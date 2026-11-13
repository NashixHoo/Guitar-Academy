/**
 * Guitar Academy — Project Identifier Sync Helper
 *
 * Updates `firebase-applet-config.json` and `src/tests/security.test.ts`
 * so both reference a consistent Firebase project identifier dynamically.
 *
 * Usage:
 *   npx tsx scripts/sync-project-ids.ts
 *   npx tsx scripts/sync-project-ids.ts --project gen-lang-client-0214739740
 *   npx tsx scripts/sync-project-ids.ts --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_PROJECT_ID = 'gen-lang-client-0214739740';

const PROJECT_ID_REGEX = /^[a-z0-9-]{4,64}$/;
const SECURITY_TEST_PROJECT_ID_PATTERN =
  /(const\s+PROJECT_ID\s*=[^;]*?)(['"])([a-z0-9-]+)\2(\s*;)/;

export interface SyncProjectIdsOptions {
  projectId?: string;
  rootDir?: string;
  dryRun?: boolean;
}

export interface FileSyncResult {
  file: string;
  previousProjectId: string | null;
  nextProjectId: string;
  changed: boolean;
}

export interface SyncProjectIdsResult {
  projectId: string;
  dryRun: boolean;
  results: FileSyncResult[];
}

export function validateProjectId(projectId: string): string {
  const normalized = projectId.trim();
  if (!PROJECT_ID_REGEX.test(normalized)) {
    throw new Error(
      `Invalid Firebase project ID "${projectId}". Expected lowercase alphanumeric characters and hyphens (4-64 chars).`
    );
  }
  return normalized;
}

export function updateAppletConfigContent(
  rawJson: string,
  targetProjectId: string
): { content: string; previousProjectId: string | null; changed: boolean } {
  const parsed = JSON.parse(rawJson) as Record<string, unknown>;
  const previousProjectId =
    typeof parsed.projectId === 'string' ? parsed.projectId : null;
  const changed = previousProjectId !== targetProjectId;
  const updated = {
    ...parsed,
    projectId: targetProjectId,
  };
  return {
    content: `${JSON.stringify(updated, null, 2)}\n`,
    previousProjectId,
    changed,
  };
}

export function updateSecurityTestContent(
  source: string,
  targetProjectId: string
): { content: string; previousProjectId: string | null; changed: boolean } {
  const match = source.match(SECURITY_TEST_PROJECT_ID_PATTERN);
  if (!match) {
    throw new Error(
      'Could not locate `const PROJECT_ID = ...` declaration in src/tests/security.test.ts.'
    );
  }

  const previousProjectId = match[3] ?? null;
  const changed = previousProjectId !== targetProjectId;
  const content = changed
    ? source.replace(
        SECURITY_TEST_PROJECT_ID_PATTERN,
        `$1$2${targetProjectId}$2$4`
      )
    : source;

  return {
    content,
    previousProjectId,
    changed,
  };
}

export function syncProjectIds(
  options: SyncProjectIdsOptions = {}
): SyncProjectIdsResult {
  const projectId = validateProjectId(options.projectId ?? DEFAULT_PROJECT_ID);
  const rootDir = path.resolve(options.rootDir ?? process.cwd());
  const dryRun = Boolean(options.dryRun);

  const appletConfigPath = path.join(rootDir, 'firebase-applet-config.json');
  const securityTestPath = path.join(rootDir, 'src', 'tests', 'security.test.ts');

  if (!fs.existsSync(appletConfigPath)) {
    throw new Error(`Missing required file: ${appletConfigPath}`);
  }
  if (!fs.existsSync(securityTestPath)) {
    throw new Error(`Missing required file: ${securityTestPath}`);
  }

  const rawAppletConfig = fs.readFileSync(appletConfigPath, 'utf-8');
  const appletUpdate = updateAppletConfigContent(rawAppletConfig, projectId);
  if (appletUpdate.changed && !dryRun) {
    fs.writeFileSync(appletConfigPath, appletUpdate.content, 'utf-8');
  }

  const rawSecurityTest = fs.readFileSync(securityTestPath, 'utf-8');
  const securityTestUpdate = updateSecurityTestContent(
    rawSecurityTest,
    projectId
  );
  if (securityTestUpdate.changed && !dryRun) {
    fs.writeFileSync(securityTestPath, securityTestUpdate.content, 'utf-8');
  }

  return {
    projectId,
    dryRun,
    results: [
      {
        file: 'firebase-applet-config.json',
        previousProjectId: appletUpdate.previousProjectId,
        nextProjectId: projectId,
        changed: appletUpdate.changed,
      },
      {
        file: 'src/tests/security.test.ts',
        previousProjectId: securityTestUpdate.previousProjectId,
        nextProjectId: projectId,
        changed: securityTestUpdate.changed,
      },
    ],
  };
}

function parseCliArgs(argv: string[]): SyncProjectIdsOptions {
  let projectId: string | undefined;
  let dryRun = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--project' && argv[i + 1]) {
      projectId = argv[++i];
    } else if (arg.startsWith('--project=')) {
      projectId = arg.slice('--project='.length);
    } else if (!arg.startsWith('-') && !projectId) {
      projectId = arg;
    }
  }

  return { projectId, dryRun };
}

const currentFilePath = fileURLToPath(import.meta.url);
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(currentFilePath)
) {
  try {
    const opts = parseCliArgs(process.argv.slice(2));
    const summary = syncProjectIds(opts);
    const modeLabel = summary.dryRun ? '[DRY RUN] ' : '';

    console.log(
      `${modeLabel}Synced project identifier to "${summary.projectId}":`
    );
    for (const item of summary.results) {
      const status = item.changed
        ? `${item.previousProjectId ?? '(none)'} -> ${item.nextProjectId}`
        : `unchanged (${item.nextProjectId})`;
      console.log(`  - ${item.file}: ${status}`);
    }
  } catch (err) {
    console.error(
      'Failed to sync project identifiers:',
      err instanceof Error ? err.message : err
    );
    process.exit(1);
  }
}

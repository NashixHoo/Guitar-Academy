/**
 * Guitar Academy — Migração e Reconciliação Segura de Turmas Legadas (CLI)
 *
 * Modos de execução:
 *   npx tsx scripts/reconcile-legacy-classes.ts            (dry-run por padrão — NÃO altera dados)
 *   npx tsx scripts/reconcile-legacy-classes.ts --dry-run  (dry-run explícito)
 *   npx tsx scripts/reconcile-legacy-classes.ts --apply    (aplica reconciliação transacional no Firestore)
 *
 * Opcionais:
 *   --class=<classId>   Limita a execução a uma turma específica (pode ser repetido).
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { reconcileAllLegacyClasses } from '../src/services/classCountReconciler';

interface FirebaseAppletConfig {
  projectId?: string;
  firestoreDatabaseId?: string;
}

function loadConfig(): FirebaseAppletConfig {
  const cfgPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (!fs.existsSync(cfgPath)) return {};
  return JSON.parse(fs.readFileSync(cfgPath, 'utf-8')) as FirebaseAppletConfig;
}

function hasAdminCredentials(): boolean {
  if (process.env.FIRESTORE_EMULATOR_HOST) return true;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    return true;
  }
  const adcPath = path.join(os.homedir(), '.config', 'gcloud', 'application_default_credentials.json');
  return fs.existsSync(adcPath);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(
      'Uso: npx tsx scripts/reconcile-legacy-classes.ts [--dry-run | --apply] [--class=<classId>]'
    );
    process.exit(0);
  }

  const applyRequested = args.includes('--apply');
  const dryRun = !applyRequested || args.includes('--dry-run');
  const classIds = args
    .filter((a) => a.startsWith('--class='))
    .map((a) => a.slice('--class='.length).trim())
    .filter(Boolean);

  if (!hasAdminCredentials()) {
    console.error(
      '[ERRO] Credenciais do Firebase Admin SDK não encontradas (ADC / GOOGLE_APPLICATION_CREDENTIALS / FIRESTORE_EMULATOR_HOST).'
    );
    console.error(
      'Nenhuma conexão remota foi iniciada. Execute em ambiente autenticado ou com FIRESTORE_EMULATOR_HOST.'
    );
    process.exit(1);
  }

  const config = loadConfig();
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    config.projectId ||
    'gen-lang-client-0214739740';
  const databaseId = process.env.FIRESTORE_DATABASE_ID || config.firestoreDatabaseId || '(default)';

  if (!getApps().length) {
    initializeApp({ projectId });
  }

  const adminDb =
    databaseId && databaseId !== '(default)' ? getFirestore(databaseId) : getFirestore();

  console.log(
    `[Reconciliador Guitar Academy] Modo: ${dryRun ? 'DRY-RUN (SOMENTE LEITURA)' : 'APPLY (TRANSACIONAL)'} | Projeto: ${projectId} | Banco: ${databaseId}`
  );

  const report = await reconcileAllLegacyClasses(adminDb, {
    dryRun,
    classIds: classIds.length > 0 ? classIds : undefined,
  });

  console.log(JSON.stringify(report, null, 2));
  if (report.errorCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[Reconciliador] Falha inesperada:', err);
  process.exit(1);
});

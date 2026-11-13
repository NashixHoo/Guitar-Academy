import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import type { UserRole } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export type AdminLogEventType =
  | 'auth_login_success'
  | 'auth_login_failed'
  | 'auth_signup'
  | 'auth_logout'
  | 'auth_password_reset'
  | 'role_checked'
  | 'role_escalation_blocked'
  | 'admin_preview_toggled'
  | 'student_status_updated'
  | 'security_audit_viewed'
  | 'auth_token_rejected'
  | 'role_access_denied'
  | 'admin_role_lookup';

export type AdminLogSeverity = 'info' | 'warning' | 'critical';
export type AdminLogSource = 'client' | 'backend' | 'admin_portal';

export interface AdminLogEntry {
  id: string;
  eventType: AdminLogEventType;
  severity: AdminLogSeverity;
  actorUid: string;
  actorEmail?: string | null;
  actorRole: UserRole | 'unauthenticated';
  targetUid?: string | null;
  action: string;
  details?: string | null;
  source: AdminLogSource;
  timestamp: string;
}

export interface LogAdminSecurityEventInput {
  eventType: AdminLogEventType;
  severity?: AdminLogSeverity;
  actorUid?: string;
  actorEmail?: string | null;
  actorRole?: UserRole;
  targetUid?: string | null;
  action: string;
  details?: string | null;
  source?: AdminLogSource;
}

const VALID_ID_RE = /^[a-zA-Z0-9_\-.:]{1,128}$/;

function sanitizeId(raw: string | undefined, fallback: string): string {
  const cleaned = (raw || '').trim().slice(0, 128);
  return VALID_ID_RE.test(cleaned) ? cleaned : fallback;
}

function generateLogId(): string {
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return `log_${Date.now()}_${randomSuffix}`;
}

export async function logAdminSecurityEvent(
  input: LogAdminSecurityEventInput
): Promise<AdminLogEntry | null> {
  const currentUser = auth.currentUser;
  const effectiveUid = currentUser?.uid || input.actorUid;

  // Apenas usuários autenticados podem gravar diretamente em admin_logs via Client SDK
  if (!currentUser || !effectiveUid || currentUser.uid !== effectiveUid) {
    return null;
  }

  const logId = generateLogId();
  const safeActorUid = sanitizeId(currentUser.uid, 'unknown');
  const safeEmail = (input.actorEmail ?? currentUser.email ?? null)?.slice(0, 254) || null;
  const safeTargetUid = input.targetUid ? sanitizeId(input.targetUid, '') || null : null;
  const safeAction = (input.action || 'Evento de segurança').trim().slice(0, 160);
  const safeDetails = input.details ? input.details.trim().slice(0, 500) : null;
  const safeRole: UserRole =
    input.actorRole === 'admin' || input.actorRole === 'teacher' ? input.actorRole : 'student';
  const safeSource: AdminLogSource =
    input.source === 'admin_portal' && safeRole === 'admin' ? 'admin_portal' : 'client';

  const entry: AdminLogEntry = {
    id: logId,
    eventType: input.eventType,
    severity: input.severity || 'info',
    actorUid: safeActorUid,
    actorEmail: safeEmail,
    actorRole: safeRole,
    ...(safeTargetUid ? { targetUid: safeTargetUid } : {}),
    action: safeAction,
    ...(safeDetails ? { details: safeDetails } : {}),
    source: safeSource,
    timestamp: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'admin_logs', logId), {
      ...entry,
      createdAt: serverTimestamp(),
    });
    return entry;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.CREATE, `admin_logs/${logId}`);
    } catch {
      // Falha silenciosa em eventos de auditoria em background para não interromper o fluxo do usuário
    }
    return null;
  }
}

export async function fetchRecentAdminLogs(maxItems = 50): Promise<AdminLogEntry[]> {
  const path = 'admin_logs';
  try {
    const logsQuery = query(
      collection(db, path),
      orderBy('timestamp', 'desc'),
      limit(Math.max(1, Math.min(100, maxItems)))
    );
    const snapshot = await getDocs(logsQuery);
    return snapshot.docs.map((d) => {
      const data = d.data() as Partial<AdminLogEntry>;
      return {
        id: data.id || d.id,
        eventType: (data.eventType as AdminLogEventType) || 'security_audit_viewed',
        severity: (data.severity as AdminLogSeverity) || 'info',
        actorUid: data.actorUid || 'unknown',
        actorEmail: data.actorEmail ?? null,
        actorRole: data.actorRole || 'student',
        targetUid: data.targetUid ?? null,
        action: data.action || 'Evento registrado',
        details: data.details ?? null,
        source: data.source || 'client',
        timestamp: data.timestamp || new Date(0).toISOString(),
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToAdminLogs(
  onData: (logs: AdminLogEntry[]) => void,
  onError: (error: Error) => void,
  maxItems = 50
): Unsubscribe {
  const path = 'admin_logs';
  const logsQuery = query(
    collection(db, path),
    orderBy('timestamp', 'desc'),
    limit(Math.max(1, Math.min(100, maxItems)))
  );

  return onSnapshot(
    logsQuery,
    (snapshot) => {
      const items: AdminLogEntry[] = snapshot.docs.map((d) => {
        const data = d.data() as Partial<AdminLogEntry>;
        return {
          id: data.id || d.id,
          eventType: (data.eventType as AdminLogEventType) || 'security_audit_viewed',
          severity: (data.severity as AdminLogSeverity) || 'info',
          actorUid: data.actorUid || 'unknown',
          actorEmail: data.actorEmail ?? null,
          actorRole: data.actorRole || 'student',
          targetUid: data.targetUid ?? null,
          action: data.action || 'Evento registrado',
          details: data.details ?? null,
          source: data.source || 'client',
          timestamp: data.timestamp || new Date(0).toISOString(),
        };
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (formattedError) {
        onError(
          formattedError instanceof Error ? formattedError : new Error(String(formattedError))
        );
      }
    }
  );
}

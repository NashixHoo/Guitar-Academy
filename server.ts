import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  doesStatusOccupySeat,
  isValidatedEnrolledCount,
  reconcileAllLegacyClasses,
} from './src/services/classCountReconciler';
import {
  computeDeterministicGrantDocId,
  computeGrantIdempotencyKey,
  computePlacementDocId,
  getCatalogCourse,
  isValidCourseId,
  mapGrantTypeToSource,
  validateGrantTarget,
  validatePlacementTarget,
} from './src/services/academicCatalog';
import {
  evaluateGrantStatus,
  resolveStudentAccessSnapshot,
} from './src/services/accessAuthorizationEngine';
import type {
  AccessGrantScopeType,
  AccessGrantType,
  CourseAccessGrant,
  StudentAcademicPlacement,
} from './src/types/accessControl';
import {
  COMMERCE_CONFIRMATION_PHRASE,
  createAppliedPriceSnapshot,
  DEFAULT_COMMERCE_CONFIG,
  evaluateAndCalculateCoupon,
  generateCommerceId,
  isCommerceStorefrontVisible,
  isSamePriceSlot,
  normalizeCommerceConfig,
  normalizeCouponCode,
  validateNewPriceVersionInput,
  validateProductCreateInput,
  validateProductUpdateInput,
  validatePromotionInput,
} from './src/services/commerceCore';
import {
  applySubscriptionLifecycleTransition,
  assertNoSensitiveCardData,
  canOfferAcceptReservation,
  computeAvailableOfferSeats,
  computeFinancialSummaryReport,
  DEFAULT_RESERVATION_TTL_MS,
  DEFAULT_WAITLIST_SUMMON_TTL_MS,
  generatePhase3Id,
  isAdvertisementVisibleToStudent,
  isReservationExpired,
  isWaitlistSummonExpired,
  pickNextWaitlistCandidate,
  validateAdvertisementCreateInput,
  validateAdvertisementUpdateInput,
  validateBannerFileUpload,
  validateClassOfferCreateInput,
  validateClassOfferUpdateInput,
  validateWebhookPaymentConsistency,
} from './src/services/commercePhase3Core';
import { DisabledFailClosedGatewayProvider } from './src/services/paymentGateway';
import {
  computePayloadSha256Digest,
  verifyWebhookHmacSignature,
} from './src/services/paymentWebhookVerifier';
import type {
  AdvertisementImageMimeType,
  ClassReservation,
  ClassWaitlistEntry,
  CommerceAdvertisement,
  CommerceClassOffer,
  CommerceEntitlementRecord,
  CommerceGlobalConfig,
  CommerceOrder,
  CommercePayment,
  CommercePaymentEvent,
  CommerceProduct,
  CommerceProductPrice,
  CommercePromotion,
  CommercePromotionStatus,
  CommerceSubscription,
  FinancialAdjustmentRecord,
  SubscriptionStatus,
} from './src/types/commerce';

dotenv.config();

interface FirebaseAppletConfig {
  projectId?: string;
  firestoreDatabaseId?: string;
}

function loadFirebaseAppletConfig(): FirebaseAppletConfig {
  try {
    const configPath = path.resolve('firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as FirebaseAppletConfig;
    }
  } catch {
    // Fallback para variáveis de ambiente
  }
  return {};
}

const appletConfig = loadFirebaseAppletConfig();
const FIREBASE_PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ||
  (process.env.FIRESTORE_EMULATOR_HOST ? process.env.GCLOUD_PROJECT : undefined) ||
  appletConfig.projectId ||
  'gen-lang-client-0214739740';
const FIRESTORE_DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId || '(default)';
const STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET ||
  (appletConfig as any).storageBucket ||
  'gen-lang-client-0214739740.firebasestorage.app';

// Inicialização segura do Firebase Admin SDK (admin.initializeApp)
// Utilizado exclusivamente para validação criptográfica de ID Tokens e leitura de system_roles
void admin;
if (!getApps().length) {
  try {
    initializeApp({
      projectId: FIREBASE_PROJECT_ID,
    });
  } catch (err: any) {
    console.warn('[Firebase Admin] Aviso de inicialização:', err?.message || err);
  }
}

function getAdminDb() {
  return FIRESTORE_DATABASE_ID && FIRESTORE_DATABASE_ID !== '(default)'
    ? getFirestore(FIRESTORE_DATABASE_ID)
    : getFirestore();
}

function hasFirestoreAdminCredentials(): boolean {
  if (process.env.FIRESTORE_EMULATOR_HOST) return true;
  const gacPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (gacPath && fs.existsSync(gacPath)) return true;
  try {
    const adcPath = path.join(os.homedir(), '.config', 'gcloud', 'application_default_credentials.json');
    if (fs.existsSync(adcPath)) return true;
  } catch {
    // Ignora falha ao inspecionar diretório home
  }
  if (
    process.env.K_SERVICE ||
    process.env.CLOUD_RUN_JOB ||
    process.env.FUNCTION_TARGET ||
    process.env.GAE_APPLICATION
  ) {
    return true;
  }
  return false;
}

function canWriteAuditLogToFirestore(): boolean {
  const isUnitTestWithoutEmulator =
    Boolean(process.env.NODE_TEST_CONTEXT) && !process.env.FIRESTORE_EMULATOR_HOST;
  if (isUnitTestWithoutEmulator) return false;
  return hasFirestoreAdminCredentials();
}

export interface AdminLogPayload {
  eventType:
    | 'auth_token_rejected'
    | 'role_access_denied'
    | 'admin_role_lookup'
    | 'student_status_updated'
    | 'course_access_granted'
    | 'course_access_updated'
    | 'course_access_revoked'
    | 'course_access_reactivated'
    | 'student_placement_updated'
    | 'commerce_product_created'
    | 'commerce_product_updated'
    | 'commerce_price_version_created'
    | 'commerce_promotion_created'
    | 'commerce_promotion_updated'
    | 'commerce_coupon_updated'
    | 'commerce_config_updated'
    | 'commerce_unauthorized_attempt'
    | 'commerce_advertisement_created'
    | 'commerce_advertisement_updated'
    | 'commerce_advertisement_image_uploaded'
    | 'commerce_class_offer_created'
    | 'commerce_class_offer_updated'
    | 'commerce_reservation_updated'
    | 'commerce_waitlist_summoned'
    | 'commerce_order_created'
    | 'commerce_payment_confirmed'
    | 'commerce_payment_invalid'
    | 'commerce_payment_refunded'
    | 'commerce_subscription_updated'
    | 'commerce_financial_adjustment';
  severity: 'info' | 'warning' | 'critical';
  actorUid: string;
  actorEmail?: string | null;
  actorRole: 'student' | 'teacher' | 'admin' | 'unauthenticated';
  targetUid?: string | null;
  action: string;
  details?: string;
}

export interface AdminAuthUserSnapshot {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  provider: string;
  disabled: boolean;
  createdAt: string | null;
  lastSignInTime: string | null;
}

export interface AdminDirectoryPayloadSnapshot {
  authUsers: AdminAuthUserSnapshot[];
  userDocs: Array<{ id: string; data: Record<string, any> }>;
  studentDocs?: Array<{ id: string; data: Record<string, any> }>;
  roleDocs: Array<{ id: string; data: Record<string, any> }>;
  classes: Array<Record<string, any>>;
  enrollments: Array<Record<string, any>>;
  progressByUid?: Record<
    string,
    { completedLessonsCount: number; totalStudyMinutes: number; primaryCourseId?: string }
  >;
}

export interface ServerAuthDependencies {
  verifyIdToken?: (token: string) => Promise<{ uid: string; email?: string; [key: string]: any }>;
  getSystemRole?: (uid: string) => Promise<{ exists: boolean; role: string }>;
  writeAdminLog?: (entry: AdminLogPayload) => Promise<void>;
  listAdminLogs?: () => Promise<Array<Record<string, unknown>>>;
  listAdminDirectoryData?: () => Promise<AdminDirectoryPayloadSnapshot>;
  updateUserAccountStatus?: (
    uid: string,
    accountStatus: 'active' | 'suspended',
    actor: { uid: string; email?: string | null }
  ) => Promise<{ firestorePersisted: boolean; authDisabledUpdated: boolean }>;
  validateClassInvite?: (params: {
    code: string;
    callerUid: string;
  }) => Promise<{
    valid: boolean;
    reason?: string;
    message: string;
    classGroup?: Record<string, any>;
    alreadyEnrolled?: boolean;
    currentStudentCount?: number;
  }>;
  joinClassWithInvite?: (params: {
    code: string;
    callerUid: string;
    studentName: string;
    studentEmail: string;
    studentPhotoUrl: string | null;
  }) => Promise<{
    success: boolean;
    statusCode?: number;
    reason?: string;
    message: string;
    classGroup?: Record<string, any>;
    enrollment?: Record<string, any>;
  }>;
  adminDbForClasses?: any;
  adminDbForAccess?: any;
  adminDbForCommerce?: any;
  adminStorageForCommerce?: {
    uploadBanner: (params: {
      advertisementId: string;
      storagePath: string;
      buffer: Buffer;
      mimeType: AdvertisementImageMimeType;
      fileName: string;
      version: number;
    }) => Promise<{ imageUrl: string; storagePath: string }>;
  };
  commerceWebhookSecret?: string;
}

const VALID_ROLES = new Set(['student', 'teacher', 'admin']);
const UID_REGEX = /^[a-zA-Z0-9_\-.:]{1,128}$/;

function normalizeRole(rawRole: unknown): 'student' | 'teacher' | 'admin' {
  if (rawRole === 'admin') return 'admin';
  if (rawRole === 'teacher') return 'teacher';
  return 'student';
}

function getAllowedOrigins(): Set<string> {
  const origins = new Set<string>([
    'https://nashixhoo.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]);

  const addOriginFromValue = (val?: string) => {
    if (!val) return;
    const trimmed = val.trim();
    if (!trimmed || trimmed === 'MY_APP_URL') return;
    try {
      const parsed = new URL(trimmed);
      origins.add(parsed.origin);
    } catch {
      if (/^https?:\/\/[^/\s]+$/i.test(trimmed)) {
        origins.add(trimmed.replace(/\/+$/, ''));
      }
    }
  };

  addOriginFromValue(process.env.APP_URL);
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach((entry) => addOriginFromValue(entry));
  }

  return origins;
}

// Sanitização de erros para não vazar caminhos, credenciais ou stack traces
function sanitizeErrorMessage(err: any): string {
  if (!err) return 'Falha na comunicação com o serviço.';
  const msg = typeof err.message === 'string' ? err.message : '';
  if (msg.includes('Tempo limite excedido')) {
    return 'O Professor IA demorou para responder. Tente novamente em instantes.';
  }
  if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'Limite de requisições atingido no momento. Aguarde alguns segundos e tente novamente.';
  }
  return 'Falha temporária ao comunicar com o Professor IA. Tente novamente.';
}

// Helper para timeout seguro em chamadas de IA (25 segundos)
function withTimeout<T>(promise: Promise<T>, ms = 25000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Tempo limite excedido na comunicação com a IA.')), ms)
    ),
  ]);
}

function sanitizeJsonSnippet(value: unknown, maxLength = 500): string {
  if (!value || typeof value !== 'object') return '{}';
  try {
    const serialized = JSON.stringify(value);
    if (!serialized) return '{}';
    return serialized.slice(0, maxLength);
  } catch {
    return '{}';
  }
}

export function createAuthMiddlewares(deps: ServerAuthDependencies = {}) {
  const verifyToken =
    deps.verifyIdToken ||
    (async (token: string) => {
      // admin.auth().verifyIdToken(token)
      return await getAuth().verifyIdToken(token);
    });

  const resolveSystemRole =
    deps.getSystemRole ||
    (async (uid: string) => {
      const roleDoc = await getAdminDb().collection('system_roles').doc(uid).get();
      const rawRole = roleDoc.exists ? roleDoc.data()?.role : undefined;
      return {
        exists: roleDoc.exists,
        role: typeof rawRole === 'string' && VALID_ROLES.has(rawRole) ? rawRole : 'student',
      };
    });

  const recordAdminLog =
    deps.writeAdminLog ||
    (async (entry: AdminLogPayload) => {
      // Não grava no Firestore remoto quando deps de autenticação de teste estão injetadas sem writeAdminLog
      // ou quando não há emulador/credenciais ADC válidas disponíveis (evita atividade gRPC sem credencial)
      if (deps.verifyIdToken || deps.getSystemRole || !canWriteAuditLogToFirestore()) return;
      try {
        const id = `srv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        await getAdminDb()
          .collection('admin_logs')
          .doc(id)
          .set({
            id,
            eventType: entry.eventType,
            severity: entry.severity,
            actorUid: UID_REGEX.test(entry.actorUid) ? entry.actorUid : 'unauthenticated',
            actorEmail: entry.actorEmail ? String(entry.actorEmail).slice(0, 254) : null,
            actorRole: entry.actorRole,
            ...(entry.targetUid && UID_REGEX.test(entry.targetUid)
              ? { targetUid: entry.targetUid }
              : {}),
            action: String(entry.action).slice(0, 160),
            ...(entry.details ? { details: String(entry.details).slice(0, 500) } : {}),
            source: 'backend',
            timestamp: new Date().toISOString(),
          });
      } catch {
        // Auditoria best-effort no servidor para não impactar disponibilidade
      }
    });

  // Middleware de Autenticação Obrigatória via Firebase ID Token (Bearer Token)
  async function requireAuthMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Autenticação obrigatória. Cabeçalho Authorization com Bearer token ausente.',
        code: 'auth/missing-token',
      });
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      return res.status(401).json({
        error: 'Token de autenticação não fornecido.',
        code: 'auth/missing-token',
      });
    }

    try {
      const decodedToken = await verifyToken(token);
      if (!decodedToken || typeof decodedToken.uid !== 'string' || !UID_REGEX.test(decodedToken.uid)) {
        return res.status(401).json({
          error: 'Token de autenticação sem identificador de usuário válido.',
          code: 'auth/invalid-token',
        });
      }
      (req as any).user = decodedToken;
      return next();
    } catch (err: any) {
      console.error('[requireAuth] Falha na validação criptográfica do token:', err?.message || err);
      await recordAdminLog({
        eventType: 'auth_token_rejected',
        severity: 'warning',
        actorUid: 'unauthenticated',
        actorRole: 'unauthenticated',
        action: `Token rejeitado em ${req.method} ${req.path}`,
        details: 'Token Bearer inválido ou expirado bloqueado pelo middleware requireAuth',
      });
      return res.status(401).json({
        error: 'Sessão inválida ou expirada. Faça login novamente no Guitar Academy.',
        code: 'auth/token-expired-or-invalid',
      });
    }
  }

  // Middleware de Autorização por Papel (RBAC Zero-Trust)
  // Consulta EXCLUSIVAMENTE system_roles/{uid} — jamais confia em role enviado pelo frontend.
  function requireRoleMiddleware(allowedRoles: Array<'student' | 'teacher' | 'admin'>) {
    return async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const user = (req as any).user;
      if (!user || !user.uid) {
        return res.status(401).json({
          error: 'Autenticação necessária para verificação de permissão.',
          code: 'auth/unauthorized',
        });
      }

      try {
        const record = await resolveSystemRole(user.uid);
        const authoritativeRole = record.exists ? normalizeRole(record.role) : 'student';
        (req as any).userRole = authoritativeRole;

        if (!allowedRoles.includes(authoritativeRole)) {
          await recordAdminLog({
            eventType: 'role_access_denied',
            severity: 'critical',
            actorUid: user.uid,
            actorEmail: user.email || null,
            actorRole: authoritativeRole,
            action: `Acesso negado (403) em ${req.method} ${req.path}`,
            details: `Papel "${authoritativeRole}" tentou acessar rota restrita a [${allowedRoles.join(', ')}]`,
          });
          return res.status(403).json({
            error: 'Acesso negado. Seu perfil autenticado não possui permissão para esta operação.',
            code: 'auth/forbidden-role',
          });
        }

        return next();
      } catch (err: any) {
        console.error('[requireRole] Falha na consulta autoritativa de papel (fail-closed):', err?.message || err);
        return res.status(403).json({
          error: 'Falha na validação de permissões. Acesso negado por segurança.',
          code: 'auth/role-verification-failed',
        });
      }
    };
  }

  // Middleware administrativo baseado exclusivamente em requireRole(['admin'])
  const requireAdminMiddleware = requireRoleMiddleware(['admin']);

  return {
    requireAuth: requireAuthMiddleware,
    requireRole: requireRoleMiddleware,
    requireAdmin: requireAdminMiddleware,
    resolveSystemRole,
    recordAdminLog,
  };
}

const defaultMiddlewares = createAuthMiddlewares();
export async function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  return defaultMiddlewares.requireAuth(req, res, next);
}

export function requireRole(allowedRoles: Array<'student' | 'teacher' | 'admin'>) {
  return defaultMiddlewares.requireRole(allowedRoles);
}

export async function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  return defaultMiddlewares.requireAdmin(req, res, next);
}

export function isProfessorIaEnabled(): boolean {
  return process.env.ENABLE_PROFESSOR_IA === 'true';
}

// Inicialização segura do SDK Gemini no backend (process.env.GEMINI_API_KEY)
// Chave NUNCA trafega para o navegador nem é exposta em bundles.
// Desativada por padrão quando ENABLE_PROFESSOR_IA !== 'true' (operação custo zero).
function createGeminiClient() {
  if (!isProfessorIaEnabled()) return null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function createServerApp(deps: ServerAuthDependencies = {}) {
  const app = express();
  const middlewares = createAuthMiddlewares(deps);
  const requireAuth = middlewares.requireAuth;
  const requireRole = middlewares.requireRole;
  const requireAdmin = middlewares.requireAdmin;
  const resolveSystemRole = middlewares.resolveSystemRole;
  const recordAdminLog = middlewares.recordAdminLog;
  const professorIaEnabled = isProfessorIaEnabled();
  const ai = professorIaEnabled ? createGeminiClient() : null;
  const allowedOrigins = getAllowedOrigins();

  // Configuração estrita de CORS por allowlist explícita
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const requestHostOrigin = req.headers.host ? `${req.protocol}://${req.headers.host}` : '';
    const isAllowedOrigin =
      !origin ||
      allowedOrigins.has(origin) ||
      (Boolean(requestHostOrigin) && origin === requestHostOrigin);

    if (origin) {
      if (isAllowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      } else if (req.method === 'OPTIONS' || req.path.startsWith('/api/')) {
        return res.status(403).json({ error: 'Origem não autorizada pela política CORS.' });
      }
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Body parser com limite de payload por rota e captura de rawBody para validação HMAC de webhooks
  const jsonParserDefault = express.json({
    limit: '200kb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString('utf8');
    },
  });
  const jsonParserAdUpload = express.json({
    limit: '8mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString('utf8');
    },
  });
  app.use((req, res, next) => {
    if (
      req.path.startsWith('/api/admin/commerce/advertisements/') &&
      req.path.endsWith('/upload')
    ) {
      return jsonParserAdUpload(req, res, next);
    }
    return jsonParserDefault(req, res, next);
  });

  // Rate Limiting em memória por UID/IP para proteção dos endpoints de IA
  const requestLog = new Map<string, number[]>();
  function rateLimiter(limit = 30, windowMs = 60000) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const key = (req as any).user?.uid || req.ip || 'anonymous';
      const now = Date.now();
      const timestamps = (requestLog.get(key) || []).filter((time) => now - time < windowMs);

      if (timestamps.length >= limit) {
        return res.status(429).json({
          error: 'Limite de requisições excedido. Aguarde alguns instantes antes de enviar nova mensagem ao Professor IA.',
        });
      }

      timestamps.push(now);
      requestLog.set(key, timestamps);
      next();
    };
  }

  // ==========================================
  // HEALTH CHECK & STATUS ROUTES
  // ==========================================
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      geminiConfigured: !!ai,
      firebaseAdminReady: !!getApps().length,
      service: 'Guitar Academy Production Backend',
    });
  });

  // Consulta autenticada do próprio papel autoritativo (Zero-Trust Fail-Closed)
  app.get('/api/auth/role', requireAuth, async (req, res) => {
    const caller = (req as any).user;
    try {
      const record = await resolveSystemRole(caller.uid);
      return res.json({
        uid: caller.uid,
        role: record.exists ? normalizeRole(record.role) : 'student',
      });
    } catch (err: any) {
      console.error('[/api/auth/role] Falha ao consultar system_roles (fail-closed):', err?.message || err);
      return res.json({
        uid: caller.uid,
        role: 'student',
      });
    }
  });

  // ==========================================
  // PROFESSOR IA API ROUTES
  // Matriz explícita de autorização:
  // - Uso discente (student, teacher, admin): /chat, /exercise, /evaluate, /recommend
  // - Gestão pedagógica (somente teacher ou admin): /class-insights
  // ==========================================

  // 1. Status do Professor IA
  app.get('/api/professor/status', (_req, res) => {
    res.json({
      available: professorIaEnabled && !!ai,
      disabled: !professorIaEnabled,
      model: professorIaEnabled ? 'gemini-3.8-flash' : 'desativado',
      provider: professorIaEnabled ? 'Google Gemini' : 'Desativado',
      permissions: {
        studentRoutes: ['/api/professor/chat', '/api/professor/exercise', '/api/professor/evaluate', '/api/professor/recommend'],
        teacherRoutes: ['/api/professor/class-insights'],
        adminRoutes: ['/api/admin/overview', '/api/admin/roles/:uid'],
      },
      message: !professorIaEnabled
        ? 'Professor IA desativado por configuração (operação sem custo de API).'
        : ai
        ? 'Professor IA operacional via Gemini 3.8 Flash'
        : 'GEMINI_API_KEY não configurada no ambiente.',
    });
  });

  // 2. Chat Contextualizado com Professor IA (student, teacher, admin)
  app.post('/api/professor/chat', requireAuth, requireRole(['student', 'teacher', 'admin']), rateLimiter(20, 60000), async (req, res) => {
    if (!professorIaEnabled || !ai) {
      return res.status(503).json({
        error: 'Professor IA desativado nesta versão.',
        disabled: true,
      });
    }

    const { message, context } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida ou ausente.' });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return res.status(400).json({ error: 'A pergunta não pode ser vazia.' });
    }
    if (trimmedMessage.length > 1000) {
      return res.status(400).json({ error: 'A pergunta deve ter no máximo 1000 caracteres.' });
    }

    const studentLevel = Math.max(0, Math.min(5, Number(context?.studentLevel) || 0));
    const currentLessonTitle =
      typeof context?.currentLessonTitle === 'string'
        ? context.currentLessonTitle.slice(0, 120)
        : 'Fundamentos';
    const masteredSkills = Array.isArray(context?.masteredSkills)
      ? context.masteredSkills.slice(0, 10).map((s: any) => String(s).slice(0, 50))
      : [];
    const difficulties = Array.isArray(context?.difficulties)
      ? context.difficulties.slice(0, 10).map((s: any) => String(s).slice(0, 50))
      : [];
    const coachChords = Array.isArray(context?.coachFeedback?.chords)
      ? context.coachFeedback.chords.slice(0, 12).map((c: any) => String(c).slice(0, 20)).join(' -> ')
      : '';
    const coachAccuracy = Math.max(0, Math.min(100, Number(context?.coachFeedback?.accuracy) || 0));
    const coachBpm = Math.max(20, Math.min(350, Number(context?.coachFeedback?.bpm) || 60));

    const prompt = `Você é o Professor IA do Guitar Academy, um experiente mentor de guitarra e violão brasileiro.
Sua didática é técnica, precisa, encorajadora e focada no progresso real do aluno.

CONTEXTO ATUAL DO ALUNO:
- Nível de Formação: Nível ${studentLevel}
- Aula Atual: ${currentLessonTitle}
- Habilidades Dominadas: ${masteredSkills.join(', ') || 'Nenhuma registrada ainda'}
- Dificuldades / Focos Recentes: ${difficulties.join(', ') || 'Transições de acordes e postura'}
${context?.coachFeedback ? `- Último Treino no Guitar Coach: Acordes [${coachChords}], Precisão: ${coachAccuracy}%, BPM: ${coachBpm}` : ''}

PERGUNTA OU DÚVIDA DO ALUNO:
"${trimmedMessage}"

DIRETRIZES DA RESPOSTA:
1. Responda em Português do Brasil de forma estruturada e concisa (2 a 4 parágrafos focados).
2. Explique a teoria musical conectando diretamente com a anatomia do braço da guitarra (cordas, casas, digitação, intervalos) de forma prática.
3. Se envolver execução técnica, dê instruções biomecânicas claras (posição do polegar, pressão das pontas dos dedos, relaxamento do punho, palhetada alternada).
4. Termine com uma dica prática imediata e sugira qual ferramenta do Guitar Academy usar para treinar (ex: Guitar Coach, Braço Interativo, Dicionário de Acordes ou Metrônomo).`;

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        }),
        25000
      );

      return res.json({
        reply: response.text || 'Não foi possível gerar a explicação. Tente reformular a pergunta.',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error in /api/professor/chat:', err?.message || err);
      return res.status(500).json({ error: sanitizeErrorMessage(err) });
    }
  });

  // 3. Gerador de Exercícios Estruturados por Nível (student, teacher, admin)
  app.post('/api/professor/exercise', requireAuth, requireRole(['student', 'teacher', 'admin']), rateLimiter(20, 60000), async (req, res) => {
    if (!professorIaEnabled || !ai) {
      return res.status(503).json({ error: 'Professor IA desativado nesta versão.', disabled: true });
    }

    const rawLevel = Number(req.body?.level);
    const level = Number.isInteger(rawLevel) ? Math.max(0, Math.min(5, rawLevel)) : 0;
    const rawTopic = typeof req.body?.topic === 'string' ? req.body.topic.trim() : 'Harmonia e Tríades';
    const topic = rawTopic.slice(0, 100);

    const prompt = `Gere 1 exercício prático de fixação em Português do Brasil para um estudante de guitarra de Nível ${level} sobre o tópico "${topic}".
O exercício deve testar raciocínio musical real aplicado à guitarra (formação de acordes, escalas, sistema CAGED, intervalos ou leitura).

Responda ESTRITAMENTE em formato JSON com o seguinte schema:
{
  "question": "Enunciado da pergunta com contexto claro na guitarra",
  "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "correctIndex": 0,
  "explanation": "Explicação detalhada de por que a resposta está certa e aplicação na guitarra",
  "skillEvaluated": "Nome da habilidade específica avaliada (ex: Formação de Tríades Menores)"
}`;

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        25000
      );

      const parsed = JSON.parse(response.text?.trim() || '{}');
      if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length < 2) {
        throw new Error('Formato de resposta inválido gerado pelo provedor.');
      }

      return res.json(parsed);
    } catch (err: any) {
      console.error('Error in /api/professor/exercise:', err?.message || err);
      return res.status(500).json({ error: sanitizeErrorMessage(err) });
    }
  });

  // 4. Avaliação e Correção de Respostas / Desempenho (student, teacher, admin)
  app.post('/api/professor/evaluate', requireAuth, requireRole(['student', 'teacher', 'admin']), rateLimiter(20, 60000), async (req, res) => {
    if (!professorIaEnabled || !ai) {
      return res.status(503).json({ error: 'Professor IA desativado nesta versão.', disabled: true });
    }

    const { question, studentAnswer, correctAnswer, explanation, level = 0 } = req.body || {};
    if (!question || !studentAnswer) {
      return res.status(400).json({ error: 'Parâmetros incompletos para avaliação.' });
    }

    const safeQuestion = String(question).slice(0, 500);
    const safeAnswer = String(studentAnswer).slice(0, 300);
    const safeCorrect = String(correctAnswer || '').slice(0, 300);
    const safeExplanation = String(explanation || '').slice(0, 500);
    const safeLevel = Math.max(0, Math.min(5, Number(level) || 0));

    const prompt = `Você é o avaliador pedagógico do Guitar Academy.
Avalie a resposta do aluno de Nível ${safeLevel} para o seguinte exercício:
Enunciado: "${safeQuestion}"
Resposta escolhida pelo aluno: "${safeAnswer}"
Resposta correta esperada: "${safeCorrect}"
Explicação teórica de referência: "${safeExplanation}"

Responda ESTRITAMENTE em formato JSON com o seguinte schema:
{
  "isCorrect": boolean,
  "feedback": "Feedback pedagógico encorajador e construtivo em Português",
  "masteredSkill": "Habilidade dominada se correto, ou null se incorreto",
  "pointToReview": "Conceito a ser revisado se incorreto, ou null se correto",
  "nextDrill": "Sugestão prática de 1 exercício de 5 minutos na guitarra"
}`;

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        25000
      );

      const result = JSON.parse(response.text?.trim() || '{}');
      return res.json(result);
    } catch (err: any) {
      console.error('Error in /api/professor/evaluate:', err?.message || err);
      return res.status(500).json({ error: sanitizeErrorMessage(err) });
    }
  });

  // 5. Recomendação de Próxima Atividade baseada no Progresso (student, teacher, admin)
  app.post('/api/professor/recommend', requireAuth, requireRole(['student', 'teacher', 'admin']), rateLimiter(20, 60000), async (req, res) => {
    if (!professorIaEnabled || !ai) {
      return res.status(503).json({ error: 'Professor IA desativado nesta versão.', disabled: true });
    }

    const progress = req.body?.progress;
    const safeLevel = Math.max(0, Math.min(5, Number(progress?.studyPlan?.selectedLevel) || 0));
    const safeDailyGoal = Math.max(5, Math.min(480, Number(progress?.dailyGoalMinutes) || 30));
    const safeTodayMinutes = Math.max(0, Math.min(1440, Math.floor((Number(progress?.todayStudyTimeSeconds) || 0) / 60)));
    const safeCompletedCount = Array.isArray(progress?.completedLessons)
      ? Math.min(1000, progress.completedLessons.length)
      : 0;
    const safeErrors = sanitizeJsonSnippet(progress?.frequentErrors, 500);
    const safeQuizzes = sanitizeJsonSnippet(progress?.quizScores, 500);

    const prompt = `Você é o orientador pedagógico do Guitar Academy.
Analise os dados de progresso do estudante:
- Nível: ${safeLevel}
- Meta Diária: ${safeDailyGoal} minutos
- Tempo Praticado Hoje: ${safeTodayMinutes} min
- Aulas Concluídas: ${safeCompletedCount}
- Erros Frequentes Registrados: ${safeErrors}
- Últimas Avaliações: ${safeQuizzes}

Determine a recomendação ideal para a próxima sessão de estudo.
Responda ESTRITAMENTE em formato JSON com o seguinte schema:
{
  "title": "Título conciso da recomendação (ex: Treinar Troca C para Am no Guitar Coach)",
  "recommendedAction": "lesson" | "guitar-coach" | "practice-routine" | "tuner" | "theory" | "technique" | "ear-training",
  "rationale": "Justificativa pedagógica baseada nas metas e pontos fracos do aluno",
  "suggestedDurationMinutes": 10,
  "focusAreas": ["Área 1", "Área 2"],
  "motivationalNote": "Frase de incentivo personalizada"
}`;

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        25000
      );

      const result = JSON.parse(response.text?.trim() || '{}');
      return res.json(result);
    } catch (err: any) {
      console.error('Error in /api/professor/recommend:', err?.message || err);
      return res.status(500).json({ error: sanitizeErrorMessage(err) });
    }
  });

  // 6. Análise Pedagógica Agregada de Turmas (EXIGE papel teacher ou admin — bloqueia student com HTTP 403)
  app.post('/api/professor/class-insights', requireAuth, requireRole(['teacher', 'admin']), rateLimiter(15, 60000), async (req, res) => {
    if (!professorIaEnabled || !ai) {
      return res.status(503).json({ error: 'Professor IA desativado nesta versão.', disabled: true });
    }

    const className = typeof req.body?.className === 'string' ? req.body.className.trim().slice(0, 100) : 'Turma Geral';
    const summarySnippet = sanitizeJsonSnippet(req.body?.metrics, 800);

    const prompt = `Você é o consultor pedagógico sênior da Guitar Academy auxiliando um professor.
Analise os indicadores agregados da turma "${className}":
${summarySnippet}

Responda ESTRITAMENTE em JSON com plano de intervenção coletiva:
{
  "priorityFocus": "Tema principal para a próxima aula coletiva",
  "recommendations": ["Ação 1", "Ação 2"],
  "suggestedWarmupBpm": 70
}`;

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        }),
        25000
      );
      return res.json(JSON.parse(response.text?.trim() || '{}'));
    } catch (err: any) {
      console.error('Error in /api/professor/class-insights:', err?.message || err);
      return res.status(500).json({ error: sanitizeErrorMessage(err) });
    }
  });

  // Rota administrativa para consulta de papéis do sistema protegida por Zero-Trust
  app.get('/api/admin/roles/:uid', requireAuth, async (req, res) => {
    const caller = (req as any).user;
    const targetUid = String(req.params.uid || '').trim();

    if (!UID_REGEX.test(targetUid)) {
      return res.status(400).json({ error: 'Identificador de usuário inválido.' });
    }

    try {
      const callerRecord = await resolveSystemRole(caller.uid);
      const isCallerAdmin = callerRecord.exists && normalizeRole(callerRecord.role) === 'admin';

      if (!isCallerAdmin && caller.uid !== targetUid) {
        await recordAdminLog({
          eventType: 'role_access_denied',
          severity: 'critical',
          actorUid: caller.uid,
          actorEmail: caller.email || null,
          actorRole: callerRecord.exists ? normalizeRole(callerRecord.role) : 'student',
          targetUid,
          action: 'Tentativa bloqueada de consulta de papel de terceiros',
          details: `Usuário ${caller.uid} tentou consultar /api/admin/roles/${targetUid}`,
        });
        return res.status(403).json({
          error: 'Acesso negado. Apenas administradores podem consultar papéis de outros usuários.',
        });
      }

      if (isCallerAdmin && caller.uid !== targetUid) {
        await recordAdminLog({
          eventType: 'admin_role_lookup',
          severity: 'info',
          actorUid: caller.uid,
          actorEmail: caller.email || null,
          actorRole: 'admin',
          targetUid,
          action: 'Consulta administrativa de papel de usuário',
          details: `Admin consultou papel do UID ${targetUid}`,
        });
      }

      const targetRecord = await resolveSystemRole(targetUid);
      return res.json({
        uid: targetUid,
        role: targetRecord.exists ? normalizeRole(targetRecord.role) : 'student',
        exists: targetRecord.exists,
      });
    } catch {
      return res.status(403).json({ error: 'Falha ao validar permissão para consulta de papel.' });
    }
  });

  // Rota administrativa para consulta de logs recentes (protegida por requireAuth e requireAdmin)
  app.get('/api/admin/logs', requireAuth, requireAdmin, async (_req, res) => {
    try {
      if (deps.listAdminLogs) {
        const logs = await deps.listAdminLogs();
        return res.json({ logs });
      }
      if (deps.verifyIdToken || deps.getSystemRole || !canWriteAuditLogToFirestore()) {
        return res.json({ logs: [] });
      }
      const snap = await getAdminDb()
        .collection('admin_logs')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();
      return res.json({
        logs: snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })),
      });
    } catch {
      return res.json({ logs: [] });
    }
  });

  // Rota de governança administrativa protegida por requireAuth e requireAdmin
  app.get('/api/admin/overview', requireAuth, requireAdmin, async (_req, res) => {
    return res.json({
      status: 'ok',
      security: 'Zero-Trust RBAC Active',
      platform: 'Guitar Academy Production Backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Diretório administrativo completo via Firebase Admin SDK (Auth listUsers + coleções Firestore reais)
  app.get('/api/admin/users', requireAuth, requireAdmin, async (_req, res) => {
    try {
      if (deps.listAdminDirectoryData) {
        const snapshot = await deps.listAdminDirectoryData();
        return res.json({
          status: 'ok',
          mode: 'backend_admin_sdk',
          ...snapshot,
        });
      }

      if (!canWriteAuditLogToFirestore()) {
        return res.status(503).json({
          error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
          code: 'admin/credentials-unavailable',
        });
      }

      const authUsers: AdminAuthUserSnapshot[] = [];
      let nextPageToken: string | undefined;
      do {
        const page = await getAuth().listUsers(1000, nextPageToken);
        for (const u of page.users) {
          authUsers.push({
            uid: u.uid,
            email: u.email || '',
            displayName: u.displayName || '',
            photoURL: u.photoURL || null,
            provider: u.providerData?.[0]?.providerId || 'password',
            disabled: Boolean(u.disabled),
            createdAt: u.metadata?.creationTime || null,
            lastSignInTime: u.metadata?.lastSignInTime || null,
          });
        }
        nextPageToken = page.pageToken;
      } while (nextPageToken);

      const adminDb = getAdminDb();
      const [usersSnap, studentsSnap, rolesSnap, classesSnap, enrollmentsSnap] = await Promise.all([
        adminDb.collection('users').get(),
        adminDb.collection('students').get(),
        adminDb.collection('system_roles').get(),
        adminDb.collection('classes').get(),
        adminDb.collection('enrollments').get(),
      ]);

      const userDocs = usersSnap.docs.map((d) => ({ id: d.id, data: d.data() as Record<string, any> }));
      const studentDocs = studentsSnap.docs.map((d) => ({ id: d.id, data: d.data() as Record<string, any> }));
      const roleDocs = rolesSnap.docs.map((d) => ({ id: d.id, data: d.data() as Record<string, any> }));
      const classes = classesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, any>));
      const enrollments = enrollmentsSnap.docs.map((d) => d.data() as Record<string, any>);

      if (classes.length > 0) {
        const classStudentsSnaps = await Promise.allSettled(
          classes.map((cls) => adminDb.collection('classes').doc(String(cls.id)).collection('students').get())
        );
        classStudentsSnaps.forEach((snapRes) => {
          if (snapRes.status === 'fulfilled') {
            snapRes.value.docs.forEach((d) => {
              enrollments.push(d.data() as Record<string, any>);
            });
          }
        });
      }

      const uidSet = new Set<string>();
      authUsers.forEach((u) => uidSet.add(u.uid));
      userDocs.forEach((d) => uidSet.add(typeof d.data?.uid === 'string' && d.data.uid ? d.data.uid : d.id));
      studentDocs.forEach((d) => uidSet.add(typeof d.data?.uid === 'string' && d.data.uid ? d.data.uid : d.id));

      const allUids = Array.from(uidSet).filter((uid) => UID_REGEX.test(uid));
      const progressByUid: Record<
        string,
        { completedLessonsCount: number; totalStudyMinutes: number; primaryCourseId?: string }
      > = {};

      for (let i = 0; i < allUids.length; i += 15) {
        const batch = allUids.slice(i, i + 15);
        const snaps = await Promise.allSettled(
          batch.map((uid) => adminDb.collection('users').doc(uid).collection('data').doc('progress').get())
        );
        snaps.forEach((snapRes, idx) => {
          if (snapRes.status === 'fulfilled' && snapRes.value.exists) {
            const p = (snapRes.value.data() as { progress?: Record<string, any> })?.progress;
            if (p && typeof p === 'object') {
              const completedCount = Array.isArray(p.completedLessons) ? p.completedLessons.length : 0;
              const totalSec = typeof p.totalStudyTimeSeconds === 'number' ? p.totalStudyTimeSeconds : 0;
              progressByUid[batch[idx]] = {
                completedLessonsCount: completedCount,
                totalStudyMinutes: Math.floor(Math.max(0, totalSec) / 60),
                primaryCourseId: typeof p.primaryCourseId === 'string' ? p.primaryCourseId : undefined,
              };
            }
          }
        });
      }

      return res.json({
        status: 'ok',
        mode: 'backend_admin_sdk',
        authUsers,
        userDocs,
        studentDocs,
        roleDocs,
        classes,
        enrollments,
        progressByUid,
      });
    } catch (err: any) {
      console.error('[Admin] Falha ao carregar diretório administrativo no servidor:', err?.message || err);
      return res.status(500).json({
        error: 'Não foi possível consultar o diretório real de contas e matrículas no servidor.',
      });
    }
  });

  // Atualização administrativa persistente da situação da conta (Zero-Trust: requer ID Token + admin em system_roles)
  app.post('/api/admin/users/:uid/status', requireAuth, requireAdmin, async (req, res) => {
    const caller = (req as any).user;
    const targetUid = String(req.params.uid || '').trim();
    const rawStatus = req.body?.accountStatus;

    if (!UID_REGEX.test(targetUid)) {
      return res.status(400).json({ error: 'Identificador de usuário inválido.' });
    }
    if (targetUid === caller.uid) {
      return res.status(400).json({
        error: 'O administrador não pode suspender ou alterar o status da própria conta ativa.',
      });
    }
    if (rawStatus !== 'active' && rawStatus !== 'suspended') {
      return res.status(400).json({
        error: 'Valor de accountStatus inválido. Valores permitidos: "active" ou "suspended".',
      });
    }

    const nextStatus: 'active' | 'suspended' = rawStatus;

    try {
      if (deps.updateUserAccountStatus) {
        const result = await deps.updateUserAccountStatus(targetUid, nextStatus, {
          uid: caller.uid,
          email: caller.email || null,
        });
        await recordAdminLog({
          eventType: 'student_status_updated',
          severity: nextStatus === 'suspended' ? 'warning' : 'info',
          actorUid: caller.uid,
          actorEmail: caller.email || null,
          actorRole: 'admin',
          targetUid,
          action: `Situação da conta alterada para "${nextStatus}"`,
          details: `Operação administrativa executada via backend (Auth disabled=${result.authDisabledUpdated})`,
        });
        return res.json({
          status: 'ok',
          uid: targetUid,
          accountStatus: nextStatus,
          firestorePersisted: result.firestorePersisted,
          authDisabledUpdated: result.authDisabledUpdated,
        });
      }

      if (!canWriteAuditLogToFirestore()) {
        return res.status(503).json({
          error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
          code: 'admin/credentials-unavailable',
        });
      }

      const adminDb = getAdminDb();
      const userRef = adminDb.collection('users').doc(targetUid);
      const existingSnap = await userRef.get();
      if (!existingSnap.exists) {
        return res.status(404).json({
          error: `Usuário "${targetUid}" não encontrado na coleção users.`,
        });
      }

      await userRef.update({
        accountStatus: nextStatus,
        updatedAt: FieldValue.serverTimestamp(),
      });

      let authDisabledUpdated = false;
      try {
        await getAuth().updateUser(targetUid, { disabled: nextStatus === 'suspended' });
        if (nextStatus === 'suspended') {
          await getAuth().revokeRefreshTokens(targetUid);
        }
        authDisabledUpdated = true;
      } catch (authErr: any) {
        console.warn(
          `[Admin] accountStatus persistido em users/${targetUid}, mas não foi possível atualizar Firebase Auth (${authErr?.code || authErr?.message || 'erro'}).`
        );
      }

      await recordAdminLog({
        eventType: 'student_status_updated',
        severity: nextStatus === 'suspended' ? 'warning' : 'info',
        actorUid: caller.uid,
        actorEmail: caller.email || null,
        actorRole: 'admin',
        targetUid,
        action: `Situação da conta alterada para "${nextStatus === 'active' ? 'Ativa' : 'Suspensa'}"`,
        details: `Persistido em users/${targetUid}.accountStatus=${nextStatus} via backend (Auth disabled=${authDisabledUpdated})`,
      });

      return res.json({
        status: 'ok',
        uid: targetUid,
        accountStatus: nextStatus,
        firestorePersisted: true,
        authDisabledUpdated,
      });
    } catch (err: any) {
      console.error('[Admin] Falha ao atualizar status da conta:', err?.message || err);
      return res.status(500).json({
        error: 'Não foi possível persistir a alteração de status da conta.',
      });
    }
  });

  // ==========================================
  // ENTRADA SEGURA DE ALUNO EM TURMA VIA CÓDIGO DE CONVITE
  // ==========================================
  const VALID_COURSE_IDS = new Set(['violao', 'canonical', 'solo', 'baixo', 'teclado', 'bateria']);
  const isInactiveEnrollmentStatusSrv = (status: unknown): boolean => !doesStatusOccupySeat(status);

  const formatInstrumentFromCourse = (courseId?: string, instrument?: string): string => {
    if (typeof instrument === 'string' && instrument.trim()) return instrument.trim();
    switch (courseId) {
      case 'violao':
        return 'Violão';
      case 'canonical':
        return 'Guitarra Elétrica';
      case 'solo':
        return 'Guitarra Solo';
      case 'baixo':
        return 'Contrabaixo';
      case 'teclado':
        return 'Teclado & Piano';
      case 'bateria':
        return 'Bateria';
      default:
        return 'Formação Geral';
    }
  };

  async function validateInviteServerSide(cleanCode: string, callerUid: string) {
    const adminDb = deps.adminDbForClasses || getAdminDb();
    const inviteSnap = await adminDb.collection('class_invites').doc(cleanCode).get();

    let classSnap: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> | null = null;
    let inviteData: Record<string, any> | null = null;

    if (inviteSnap.exists) {
      const resolvedInviteData: Record<string, any> = inviteSnap.data() || {};
      inviteData = resolvedInviteData;
      if (resolvedInviteData.classId && UID_REGEX.test(String(resolvedInviteData.classId))) {
        classSnap = await adminDb.collection('classes').doc(String(resolvedInviteData.classId)).get();
      }
    } else {
      const qSnap = await adminDb
        .collection('classes')
        .where('code', '==', cleanCode)
        .limit(1)
        .get();
      if (!qSnap.empty) {
        classSnap = qSnap.docs[0];
      }
    }

    if (!inviteSnap.exists && (!classSnap || !classSnap.exists)) {
      return {
        valid: false,
        reason: 'not_found',
        message: 'Código de convite não encontrado. Confira o código com seu professor.',
      };
    }

    const classData = classSnap?.exists ? classSnap.data() || {} : {};
    const mergedClassId = String(classSnap?.id || inviteData?.classId || '');
    if (!mergedClassId || !UID_REGEX.test(mergedClassId)) {
      return {
        valid: false,
        reason: 'not_found',
        message: 'Turma associada ao código de convite não é válida.',
      };
    }

    const isInviteActive = inviteData ? inviteData.active !== false : true;
    const isClassActive = classSnap?.exists ? classData.active !== false : isInviteActive;

    if (!isInviteActive || !isClassActive || (classSnap && !classSnap.exists)) {
      return {
        valid: false,
        reason: 'closed',
        message: 'Esta turma ou código de convite foi encerrado pelo professor.',
      };
    }

    const rawExpiresAt = classData.expiresAt || inviteData?.expiresAt || null;
    const rawExpiresAtMs =
      typeof classData.expiresAtMs === 'number'
        ? classData.expiresAtMs
        : typeof inviteData?.expiresAtMs === 'number'
        ? inviteData.expiresAtMs
        : typeof rawExpiresAt === 'string' && rawExpiresAt.trim()
        ? Date.parse(rawExpiresAt.trim())
        : NaN;

    if (!Number.isNaN(rawExpiresAtMs) && rawExpiresAtMs < Date.now()) {
      return {
        valid: false,
        reason: 'expired',
        message: 'Este código de convite expirou. Solicite um novo código ao seu professor.',
      };
    }

    const courseIdRaw =
      typeof classData.courseId === 'string' && classData.courseId.trim()
        ? classData.courseId.trim()
        : typeof inviteData?.courseId === 'string' && inviteData.courseId.trim()
        ? inviteData.courseId.trim()
        : undefined;

    const resolvedClassGroup = {
      id: mergedClassId,
      name: String(classData.name || inviteData?.name || 'Turma Guitar Academy'),
      code: String(classData.code || inviteData?.code || cleanCode),
      description: String(classData.description || inviteData?.description || ''),
      ...(courseIdRaw ? { courseId: courseIdRaw } : {}),
      instrument: formatInstrumentFromCourse(
        courseIdRaw,
        String(classData.instrument || inviteData?.instrument || '')
      ),
      teacherId: String(classData.teacherId || inviteData?.teacherId || ''),
      teacherEmail: '',
      teacherName: String(classData.teacherName || inviteData?.teacherName || 'Professor Guitar Academy'),
      createdAt:
        typeof classData.createdAt === 'string'
          ? classData.createdAt
          : typeof inviteData?.createdAt === 'string'
          ? inviteData.createdAt
          : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: typeof rawExpiresAt === 'string' ? rawExpiresAt : null,
      active: true,
      maxStudents: Number(classData.maxStudents || inviteData?.maxStudents || 60),
    };

    if (classSnap?.exists && !isValidatedEnrolledCount(classData.enrolledCount)) {
      return {
        valid: false,
        reason: 'legacy_unvalidated',
        message:
          'Esta turma está aguardando validação da contagem real de alunos antes de liberar novas matrículas.',
        classGroup: resolvedClassGroup,
      };
    }

    const deterministicId = `enroll-${mergedClassId}-${callerUid}`;
    if (!UID_REGEX.test(deterministicId)) {
      return {
        valid: false,
        reason: 'invalid_format',
        message: 'Identificador de matrícula excede o limite permitido.',
      };
    }

    // Verifica matrícula duplicada, suspensão e lotação real da turma
    const [classStudentsSnap, deterministicEnrollSnap] = await Promise.all([
      adminDb.collection('classes').doc(mergedClassId).collection('students').get(),
      adminDb.collection('enrollments').doc(deterministicId).get(),
    ]);

    const activeStudentIds = new Set<string>();
    let alreadyInSubcol = false;
    let isSuspended = false;
    classStudentsSnap.docs.forEach((d: any) => {
      const data = d.data() || {};
      const st = typeof data.status === 'string' ? data.status.trim().toLowerCase() : 'active';
      const sId = typeof data.studentId === 'string' && data.studentId ? data.studentId : d.id;
      if (sId === callerUid && st === 'suspended') {
        isSuspended = true;
      }
      if (doesStatusOccupySeat(data.status)) {
        activeStudentIds.add(sId);
        if (sId === callerUid) alreadyInSubcol = true;
      }
    });

    const deterministicData = deterministicEnrollSnap.exists ? deterministicEnrollSnap.data() || {} : null;
    const deterministicStatus =
      deterministicData && typeof deterministicData.status === 'string'
        ? deterministicData.status.trim().toLowerCase()
        : '';
    if (deterministicStatus === 'suspended') {
      isSuspended = true;
    }

    if (isSuspended) {
      return {
        valid: false,
        reason: 'closed',
        message: 'Sua matrícula nesta turma está suspensa. Entre em contato com seu professor.',
        classGroup: resolvedClassGroup,
        currentStudentCount: activeStudentIds.size,
      };
    }

    const alreadyInEnrollments =
      Boolean(deterministicData) && !isInactiveEnrollmentStatusSrv(deterministicStatus);

    if (alreadyInSubcol || alreadyInEnrollments) {
      return {
        valid: false,
        reason: 'already_enrolled',
        alreadyEnrolled: true,
        message: `Você já está matriculado na turma "${resolvedClassGroup.name}".`,
        classGroup: resolvedClassGroup,
        currentStudentCount: activeStudentIds.size,
      };
    }

    if (
      typeof resolvedClassGroup.maxStudents === 'number' &&
      resolvedClassGroup.maxStudents > 0 &&
      activeStudentIds.size >= resolvedClassGroup.maxStudents
    ) {
      return {
        valid: false,
        reason: 'full',
        message: 'Esta turma já atingiu o limite máximo de alunos matriculados.',
        classGroup: resolvedClassGroup,
        currentStudentCount: activeStudentIds.size,
      };
    }

    return {
      valid: true,
      message: 'Turma localizada e disponível para matrícula.',
      classGroup: resolvedClassGroup,
      currentStudentCount: activeStudentIds.size,
    };
  }

  class JoinClassDomainError extends Error {
    statusCode: number;
    reason: string;
    classGroup?: Record<string, any>;
    alreadyEnrolled?: boolean;

    constructor(
      statusCode: number,
      reason: string,
      message: string,
      classGroup?: Record<string, any>,
      alreadyEnrolled?: boolean
    ) {
      super(message);
      this.statusCode = statusCode;
      this.reason = reason;
      this.classGroup = classGroup;
      this.alreadyEnrolled = alreadyEnrolled;
    }
  }

  async function joinClassTransactionalServerSide(params: {
    cleanCode: string;
    callerUid: string;
    studentName: string;
    studentEmail: string;
    studentPhotoUrl: string | null;
  }) {
    const adminDb = deps.adminDbForClasses || getAdminDb();
    const { cleanCode, callerUid, studentName, studentEmail, studentPhotoUrl } = params;

    return await adminDb.runTransaction(async (tx: any) => {
      // FASE 1: Todas as leituras dentro da transação serializável (all reads before writes)
      const inviteRef = adminDb.collection('class_invites').doc(cleanCode);
      const inviteSnap = await tx.get(inviteRef);
      const inviteData = inviteSnap.exists ? inviteSnap.data() || {} : null;

      let classRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> | null = null;
      let classSnap: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> | null = null;

      if (inviteData?.classId && UID_REGEX.test(String(inviteData.classId))) {
        classRef = adminDb.collection('classes').doc(String(inviteData.classId));
        classSnap = await tx.get(classRef);
      } else if (!inviteSnap.exists) {
        const classQuery = adminDb.collection('classes').where('code', '==', cleanCode).limit(1);
        const classQuerySnap = await tx.get(classQuery);
        const firstDoc = classQuerySnap.docs[0];
        if (firstDoc) {
          classSnap = firstDoc;
          classRef = firstDoc.ref;
        }
      }

      if (!inviteSnap.exists && (!classSnap || !classSnap.exists)) {
        throw new JoinClassDomainError(
          400,
          'not_found',
          'Código de convite não encontrado. Confira o código com seu professor.'
        );
      }

      const classData = classSnap?.exists ? classSnap.data() || {} : {};
      const mergedClassId = String(classSnap?.id || inviteData?.classId || '');
      if (!mergedClassId || !UID_REGEX.test(mergedClassId) || !classRef || !classSnap?.exists) {
        throw new JoinClassDomainError(
          400,
          'closed',
          'Esta turma ou código de convite foi encerrado pelo professor.'
        );
      }

      const isInviteActive = inviteData ? inviteData.active !== false : true;
      const isClassActive = classData.active !== false;
      if (!isInviteActive || !isClassActive) {
        throw new JoinClassDomainError(
          400,
          'closed',
          'Esta turma ou código de convite foi encerrado pelo professor.'
        );
      }

      const rawExpiresAt = classData.expiresAt || inviteData?.expiresAt || null;
      const rawExpiresAtMs =
        typeof classData.expiresAtMs === 'number'
          ? classData.expiresAtMs
          : typeof inviteData?.expiresAtMs === 'number'
          ? inviteData.expiresAtMs
          : typeof rawExpiresAt === 'string' && rawExpiresAt.trim()
          ? Date.parse(rawExpiresAt.trim())
          : NaN;

      if (!Number.isNaN(rawExpiresAtMs) && rawExpiresAtMs < Date.now()) {
        throw new JoinClassDomainError(
          400,
          'expired',
          'Este código de convite expirou. Solicite um novo código ao seu professor.'
        );
      }

      const enrollmentId = `enroll-${mergedClassId}-${callerUid}`;
      if (!UID_REGEX.test(enrollmentId)) {
        throw new JoinClassDomainError(
          400,
          'invalid_format',
          'Identificador de matrícula inválido ou acima do limite permitido.'
        );
      }

      const courseIdRaw =
        typeof classData.courseId === 'string' && classData.courseId.trim()
          ? classData.courseId.trim()
          : typeof inviteData?.courseId === 'string' && inviteData.courseId.trim()
          ? inviteData.courseId.trim()
          : undefined;

      const maxStudentsRaw = Number(classData.maxStudents || inviteData?.maxStudents || 60);
      const maxStudents =
        Number.isFinite(maxStudentsRaw) && maxStudentsRaw > 0 ? Math.min(500, Math.round(maxStudentsRaw)) : 60;

      const resolvedClassGroup = {
        id: mergedClassId,
        name: String(classData.name || inviteData?.name || 'Turma Guitar Academy'),
        code: String(classData.code || inviteData?.code || cleanCode),
        description: String(classData.description || inviteData?.description || ''),
        ...(courseIdRaw ? { courseId: courseIdRaw } : {}),
        instrument: formatInstrumentFromCourse(
          courseIdRaw,
          String(classData.instrument || inviteData?.instrument || '')
        ),
        teacherId: String(classData.teacherId || inviteData?.teacherId || ''),
        teacherEmail: '',
        teacherName: String(classData.teacherName || inviteData?.teacherName || 'Professor Guitar Academy'),
        createdAt:
          typeof classData.createdAt === 'string'
            ? classData.createdAt
            : typeof inviteData?.createdAt === 'string'
            ? inviteData.createdAt
            : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: typeof rawExpiresAt === 'string' ? rawExpiresAt : null,
        active: true,
        maxStudents,
      };

      if (!isValidatedEnrolledCount(classData.enrolledCount)) {
        throw new JoinClassDomainError(
          409,
          'legacy_unvalidated',
          'Esta turma ainda não teve sua contagem de vagas validada após a migração. Aguarde a reconciliação administrativa.',
          resolvedClassGroup
        );
      }

      const classStudentsColRef = classRef.collection('students');
      const ownSubRef = classStudentsColRef.doc(callerUid);
      const ownEnrollRef = adminDb.collection('enrollments').doc(enrollmentId);
      const officialCourseId =
        courseIdRaw && VALID_COURSE_IDS.has(courseIdRaw) ? courseIdRaw : undefined;
      const userRef = officialCourseId ? adminDb.collection('users').doc(callerUid) : null;

      const [classStudentsSnap, ownSubSnap, ownEnrollSnap, userSnap] = await Promise.all([
        tx.get(classStudentsColRef),
        tx.get(ownSubRef),
        tx.get(ownEnrollRef),
        userRef ? tx.get(userRef) : Promise.resolve(null),
      ]);

      const activeStudentIds = new Set<string>();
      classStudentsSnap.docs.forEach((d: any) => {
        const data = d.data() || {};
        if (doesStatusOccupySeat(data.status)) {
          const sId = typeof data.studentId === 'string' && data.studentId ? data.studentId : d.id;
          activeStudentIds.add(sId);
        }
      });

      const subStatus = ownSubSnap.exists
        ? String(ownSubSnap.data()?.status || 'active').trim().toLowerCase()
        : '';
      const enrollStatus = ownEnrollSnap.exists
        ? String(ownEnrollSnap.data()?.status || 'active').trim().toLowerCase()
        : '';

      if (subStatus === 'suspended' || enrollStatus === 'suspended') {
        throw new JoinClassDomainError(
          403,
          'closed',
          'Sua matrícula nesta turma está suspensa. Entre em contato com seu professor.',
          resolvedClassGroup
        );
      }

      if (
        (ownSubSnap.exists && !isInactiveEnrollmentStatusSrv(subStatus)) ||
        (ownEnrollSnap.exists && !isInactiveEnrollmentStatusSrv(enrollStatus)) ||
        activeStudentIds.has(callerUid)
      ) {
        throw new JoinClassDomainError(
          409,
          'already_enrolled',
          `Você já está matriculado na turma "${resolvedClassGroup.name}".`,
          resolvedClassGroup,
          true
        );
      }

      // Garantia transacional de última vaga: dois alunos concorrentes jamais excedem maxStudents
      if (maxStudents > 0 && activeStudentIds.size >= maxStudents) {
        throw new JoinClassDomainError(
          409,
          'full',
          'Esta turma já atingiu o limite máximo de alunos matriculados.',
          resolvedClassGroup
        );
      }

      // FASE 2: Escritas atômicas 1-para-1 entre subcoleção, matrícula raiz e contador da turma
      const nowIso = new Date().toISOString();
      const courseIdField = officialCourseId ? { courseId: officialCourseId } : {};

      const firestorePayload: Record<string, any> = {
        id: enrollmentId,
        classId: mergedClassId,
        ...courseIdField,
        studentId: callerUid,
        studentName,
        studentEmail,
        studentPhotoUrl,
        teacherId: resolvedClassGroup.teacherId,
        joinedAt: nowIso,
        status: 'active',
        lastActivityAt: nowIso,
        updatedAt: FieldValue.serverTimestamp(),
      };

      tx.set(ownSubRef, firestorePayload);
      tx.set(ownEnrollRef, firestorePayload);
      tx.update(classRef, {
        enrolledCount: activeStudentIds.size + 1,
        updatedAt: FieldValue.serverTimestamp(),
      });

      if (userRef && userSnap?.exists && officialCourseId) {
        tx.update(userRef, {
          enrolledCourses: FieldValue.arrayUnion(officialCourseId),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      return {
        matchedClass: {
          ...resolvedClassGroup,
          enrolledCount: activeStudentIds.size + 1,
        },
        enrollment: {
          ...firestorePayload,
          updatedAt: nowIso,
        },
      };
    });
  }

  app.post('/api/classes/validate-invite', requireAuth, async (req, res) => {
    const caller = (req as any).user;
    const cleanCode = String(req.body?.code || '').trim().toUpperCase();

    if (!cleanCode) {
      return res.status(400).json({
        valid: false,
        reason: 'empty',
        message: 'Informe o código de convite da turma.',
      });
    }
    if (!UID_REGEX.test(cleanCode)) {
      return res.status(400).json({
        valid: false,
        reason: 'invalid_format',
        message: 'Formato de código de convite inválido. Use apenas letras, números, hífen ou ponto.',
      });
    }

    try {
      if (deps.validateClassInvite) {
        const result = await deps.validateClassInvite({ code: cleanCode, callerUid: caller.uid });
        return res.json(result);
      }
      if (!deps.adminDbForClasses && !canWriteAuditLogToFirestore()) {
        return res.status(503).json({
          error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
          code: 'admin/credentials-unavailable',
        });
      }
      const result = await validateInviteServerSide(cleanCode, caller.uid);
      return res.json(result);
    } catch (err: any) {
      console.error('[Classes] Erro ao validar código de convite:', err?.message || err);
      return res.status(500).json({
        valid: false,
        reason: 'error',
        message: 'Falha ao validar código de convite no servidor.',
      });
    }
  });

  app.post('/api/classes/join', requireAuth, async (req, res) => {
    const caller = (req as any).user;
    const bodyTargetUid =
      typeof req.body?.studentUid === 'string' && req.body.studentUid.trim()
        ? req.body.studentUid.trim()
        : typeof req.body?.uid === 'string' && req.body.uid.trim()
        ? req.body.uid.trim()
        : null;

    if (bodyTargetUid && bodyTargetUid !== caller.uid) {
      return res.status(403).json({
        success: false,
        message: 'Operação negada: o aluno só pode matricular seu próprio usuário autenticado.',
      });
    }

    const cleanCode = String(req.body?.code || '').trim().toUpperCase();
    if (!cleanCode) {
      return res.status(400).json({
        success: false,
        reason: 'empty',
        message: 'Informe o código de convite da turma.',
      });
    }
    if (!UID_REGEX.test(cleanCode)) {
      return res.status(400).json({
        success: false,
        reason: 'invalid_format',
        message: 'Formato de código de convite inválido.',
      });
    }

    const safeStudentName = String(
      req.body?.studentName || caller.name || caller.email?.split('@')[0] || 'Estudante'
    )
      .trim()
      .slice(0, 120);
    const safeStudentEmail = String(caller.email || req.body?.studentEmail || '')
      .trim()
      .slice(0, 254);
    const rawPhoto = typeof req.body?.studentPhotoUrl === 'string' ? req.body.studentPhotoUrl.trim() : '';
    const safePhotoUrl = rawPhoto && rawPhoto.length <= 1024 ? rawPhoto : null;

    try {
      if (deps.joinClassWithInvite) {
        const result = await deps.joinClassWithInvite({
          code: cleanCode,
          callerUid: caller.uid,
          studentName: safeStudentName,
          studentEmail: safeStudentEmail,
          studentPhotoUrl: safePhotoUrl,
        });
        return res.status(result.statusCode || (result.success ? 200 : 400)).json(result);
      }

      if (!deps.adminDbForClasses && !canWriteAuditLogToFirestore()) {
        return res.status(503).json({
          error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
          code: 'admin/credentials-unavailable',
        });
      }

      const { matchedClass, enrollment } = await joinClassTransactionalServerSide({
        cleanCode,
        callerUid: caller.uid,
        studentName: safeStudentName,
        studentEmail: safeStudentEmail,
        studentPhotoUrl: safePhotoUrl,
      });

      return res.json({
        success: true,
        message: `Você ingressou com sucesso na turma "${matchedClass.name}" do Professor ${matchedClass.teacherName}!`,
        classGroup: matchedClass,
        enrollment,
      });
    } catch (err: any) {
      if (err instanceof JoinClassDomainError) {
        return res.status(err.statusCode).json({
          success: false,
          reason: err.reason,
          alreadyEnrolled: err.alreadyEnrolled,
          message: err.message,
          classGroup: err.classGroup,
        });
      }
      console.error('[Classes] Erro transacional ao registrar matrícula na turma:', err?.message || err);
      return res.status(500).json({
        success: false,
        message: 'Não foi possível concluir a matrícula na turma. Tente novamente.',
      });
    }
  });

  // Rota administrativa para auditoria e reconciliação transacional idempotente de turmas legadas
  app.post('/api/admin/classes/reconcile', requireAuth, requireAdmin, async (req, res) => {
    try {
      if (!deps.adminDbForClasses && !canWriteAuditLogToFirestore()) {
        return res.status(503).json({
          error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
          code: 'admin/credentials-unavailable',
        });
      }

      const dryRun = req.body?.dryRun !== false;
      const rawClassIds = req.body?.classIds;
      let classIds: string[] | undefined;

      if (rawClassIds !== undefined) {
        if (!Array.isArray(rawClassIds)) {
          return res.status(400).json({ error: 'O campo classIds deve ser um array de IDs válidos.' });
        }
        const cleaned = rawClassIds.map((id) => String(id || '').trim()).filter(Boolean);
        if (cleaned.some((id) => !UID_REGEX.test(id))) {
          return res.status(400).json({ error: 'Identificador de turma inválido em classIds.' });
        }
        classIds = cleaned;
      }

      const adminDb = deps.adminDbForClasses || getAdminDb();
      const report = await reconcileAllLegacyClasses(adminDb, { dryRun, classIds });
      return res.json({
        status: 'ok',
        ...report,
      });
    } catch (err: any) {
      console.error('[Admin] Erro ao reconciliar turmas legadas:', err?.message || err);
      return res.status(500).json({
        error: 'Não foi possível concluir a auditoria/reconciliação das turmas.',
      });
    }
  });

  // =========================================================================
  // FASE 1: GESTÃO ACADÊMICA AVANÇADA E CONTROLE DE ACESSO DO ADMINISTRADOR
  // =========================================================================
  const getAccessDb = () => deps.adminDbForAccess || deps.adminDbForClasses || getAdminDb();

  const hasAccessDbReady = (): boolean => {
    return Boolean(deps.adminDbForAccess || deps.adminDbForClasses || canWriteAuditLogToFirestore());
  };

  async function loadStudentAccessContextServerSide(adminDb: any, studentUid: string) {
    const [grantsSnap, placementsSnap, enrollmentsSnap, progressSnap] = await Promise.all([
      adminDb.collection('course_access_grants').where('studentUid', '==', studentUid).limit(200).get(),
      adminDb.collection('student_academic_placements').where('studentUid', '==', studentUid).limit(50).get(),
      adminDb.collection('enrollments').where('studentId', '==', studentUid).limit(100).get(),
      adminDb.collection('users').doc(studentUid).collection('data').doc('progress').get(),
    ]);

    const grants: CourseAccessGrant[] = (grantsSnap?.docs || []).map((d: any) => ({
      id: d.id,
      ...(d.data() || {}),
    }));
    const placements: StudentAcademicPlacement[] = (placementsSnap?.docs || []).map((d: any) => ({
      id: d.id,
      ...(d.data() || {}),
    }));
    const enrollments = (enrollmentsSnap?.docs || []).map((d: any) => {
      const data = d.data() || {};
      return {
        enrollmentId: d.id,
        classId: data.classId || '',
        className: data.className || data.classId || 'Turma',
        courseId: data.courseId || undefined,
        status: data.status || 'active',
      };
    });
    const progressData = progressSnap?.exists ? progressSnap.data() : null;

    const snapshot = resolveStudentAccessSnapshot({
      studentUid,
      isAdminUser: false,
      progress: progressData,
      grants,
      enrollments,
      placements,
    });

    return { grants, placements, enrollments, progressData, snapshot };
  }

  // Aluno autenticado consulta EXCLUSIVAMENTE seu próprio acesso resolvido
  app.get('/api/me/access', requireAuth, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null; role: string };
    if (!hasAccessDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    try {
      const adminDb = getAccessDb();
      const ctx = await loadStudentAccessContextServerSide(adminDb, caller.uid);
      return res.json({
        status: 'ok',
        studentUid: caller.uid,
        grants: ctx.grants,
        placements: ctx.placements,
        snapshot: ctx.snapshot,
      });
    } catch (err: any) {
      console.error('[Access] Erro ao resolver acesso próprio do aluno:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível carregar suas permissões acadêmicas.' });
    }
  });

  // Admin consulta a situação completa de acesso, concessões, direcionamentos e progresso resumido do aluno
  app.get('/api/admin/students/:uid/access', requireAuth, requireAdmin, async (req, res) => {
    const targetUid = String(req.params.uid || '').trim();
    if (!UID_REGEX.test(targetUid)) {
      return res.status(400).json({ error: 'Identificador de aluno inválido.' });
    }
    if (!hasAccessDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    try {
      const adminDb = getAccessDb();
      const ctx = await loadStudentAccessContextServerSide(adminDb, targetUid);
      return res.json({
        status: 'ok',
        studentUid: targetUid,
        grants: ctx.grants,
        placements: ctx.placements,
        enrollments: ctx.enrollments,
        progressSummary: {
          completedLessonsCount: Array.isArray(ctx.progressData?.completedLessons)
            ? ctx.progressData.completedLessons.length
            : 0,
          primaryCourseId: ctx.progressData?.primaryCourseId || null,
          currentLessonId: ctx.progressData?.currentLessonId || null,
          totalStudyTimeSeconds: Number(ctx.progressData?.totalStudyTimeSeconds || 0),
        },
        snapshot: ctx.snapshot,
      });
    } catch (err: any) {
      console.error('[Admin Access] Erro ao consultar acesso do aluno:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível consultar o acesso acadêmico do aluno.' });
    }
  });

  // Admin cria concessão individual gratuita com validação estrita e idempotência transacional
  app.post('/api/admin/access-grants', requireAuth, requireAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null; role: 'admin' };
    if (!hasAccessDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    const body = req.body || {};
    const studentUid = String(body.studentUid || '').trim();
    if (!UID_REGEX.test(studentUid)) {
      return res.status(400).json({ error: 'UID do aluno inválido.' });
    }

    const scopeType = body.scopeType as AccessGrantScopeType;
    if (!['course', 'instrument', 'module', 'lesson', 'lesson_range'].includes(scopeType)) {
      return res.status(400).json({ error: 'Escopo de liberação inválido.' });
    }

    const grantType = body.grantType as AccessGrantType;
    if (!['permanent', 'temporary', 'trial', 'special'].includes(grantType)) {
      return res.status(400).json({ error: 'Tipo de liberação inválido.' });
    }

    const validatedTarget = validateGrantTarget({
      scopeType,
      courseId: body.courseId ?? null,
      instrumentId: body.instrumentId ?? null,
      moduleId: body.moduleId ?? null,
      lessonId: body.lessonId ?? null,
      rangeStartLessonId: body.rangeStartLessonId ?? null,
      rangeEndLessonId: body.rangeEndLessonId ?? null,
    });
    if (!validatedTarget.valid) {
      return res.status(400).json({ error: validatedTarget.error || 'Alvo curricular inválido.' });
    }

    let startsAt: string | null = null;
    let startsAtMs: number | null = null;
    if (body.startsAt) {
      const parsedStart = Date.parse(String(body.startsAt));
      if (Number.isNaN(parsedStart)) {
        return res.status(400).json({ error: 'Data de início inválida.' });
      }
      startsAt = new Date(parsedStart).toISOString();
      startsAtMs = parsedStart;
    }

    let expiresAt: string | null = null;
    let expiresAtMs: number | null = null;
    if (body.expiresAt) {
      const parsedExp = Date.parse(String(body.expiresAt));
      if (Number.isNaN(parsedExp)) {
        return res.status(400).json({ error: 'Data de validade inválida.' });
      }
      expiresAt = new Date(parsedExp).toISOString();
      expiresAtMs = parsedExp;
    }

    if (grantType === 'temporary' && expiresAtMs === null) {
      return res.status(400).json({
        error: 'Liberações por período determinado exigem uma data/hora de expiração.',
      });
    }
    if (startsAtMs !== null && expiresAtMs !== null && expiresAtMs <= startsAtMs) {
      return res.status(400).json({
        error: 'A data de expiração deve ser posterior à data de início.',
      });
    }

    const reason =
      typeof body.reason === 'string' && body.reason.trim()
        ? body.reason.trim().slice(0, 500)
        : null;

    const idempotencyKey = computeGrantIdempotencyKey({
      studentUid,
      scopeType,
      grantType,
      courseId: validatedTarget.courseId,
      instrumentId: validatedTarget.instrumentId,
      moduleId: validatedTarget.moduleId,
      lessonId: validatedTarget.lessonId,
      rangeStartLessonId: validatedTarget.rangeStartLessonId,
      rangeEndLessonId: validatedTarget.rangeEndLessonId,
      startsAtMs,
      expiresAtMs,
    });
    const grantId = computeDeterministicGrantDocId(idempotencyKey);
    const source = mapGrantTypeToSource(grantType);
    const adminDb = getAccessDb();

    try {
      const txResult = await adminDb.runTransaction(async (tx: any) => {
        const grantRef = adminDb.collection('course_access_grants').doc(grantId);
        const existingSnap = await tx.get(grantRef);
        const nowMs = Date.now();
        const nowIso = new Date(nowMs).toISOString();

        if (existingSnap?.exists) {
          const existing = { id: grantId, ...(existingSnap.data() || {}) } as CourseAccessGrant;
          const evalRes = evaluateGrantStatus(existing, nowMs);
          if (evalRes.active) {
            return { created: false, idempotent: true, grant: existing };
          }
          const reactivated: CourseAccessGrant = {
            ...existing,
            status: 'active',
            source,
            grantType,
            reason: reason ?? existing.reason ?? null,
            grantedBy: caller.uid,
            grantedByEmail: caller.email || null,
            revokedBy: null,
            revokedAt: null,
            statusReason: null,
            updatedAt: nowIso,
          };
          tx.set(grantRef, reactivated);
          return { created: true, idempotent: false, grant: reactivated };
        }

        const newGrant: CourseAccessGrant = {
          id: grantId,
          studentUid,
          scopeType,
          grantType,
          source,
          status: 'active',
          courseId: validatedTarget.courseId ?? null,
          instrumentId: validatedTarget.instrumentId ?? null,
          moduleId: validatedTarget.moduleId ?? null,
          lessonId: validatedTarget.lessonId ?? null,
          rangeStartLessonId: validatedTarget.rangeStartLessonId ?? null,
          rangeEndLessonId: validatedTarget.rangeEndLessonId ?? null,
          lessonIds: validatedTarget.lessonIds ?? null,
          startsAt,
          startsAtMs,
          expiresAt,
          expiresAtMs,
          reason,
          idempotencyKey,
          grantedBy: caller.uid,
          grantedByEmail: caller.email || null,
          revokedBy: null,
          revokedAt: null,
          statusReason: null,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        tx.set(grantRef, newGrant);
        return { created: true, idempotent: false, grant: newGrant };
      });

      if (txResult.created) {
        await recordAdminLog({
          eventType: 'course_access_granted',
          severity: 'info',
          actorUid: caller.uid,
          actorEmail: caller.email,
          actorRole: 'admin',
          targetUid: studentUid,
          action: `Liberação acadêmica (${scopeType}/${grantType}) aplicada ao aluno`,
          details: `grantId=${grantId} course=${validatedTarget.courseId || validatedTarget.instrumentId || ''}`,
        });
      }

      const ctx = await loadStudentAccessContextServerSide(adminDb, studentUid);
      return res.status(txResult.created ? 201 : 200).json({
        status: 'ok',
        idempotent: txResult.idempotent,
        created: txResult.created,
        grant: txResult.grant,
        snapshot: ctx.snapshot,
      });
    } catch (err: any) {
      console.error('[Admin Access] Erro ao conceder acesso:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível salvar a concessão de acesso.' });
    }
  });

  // Admin suspende, reativa ou revoga uma concessão existente
  app.patch('/api/admin/access-grants/:grantId/status', requireAuth, requireAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null; role: 'admin' };
    const grantId = String(req.params.grantId || '').trim();
    if (!UID_REGEX.test(grantId)) {
      return res.status(400).json({ error: 'Identificador de concessão inválido.' });
    }
    if (!hasAccessDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    const nextStatus = String(req.body?.status || '').trim();
    if (!['active', 'suspended', 'revoked'].includes(nextStatus)) {
      return res.status(400).json({ error: 'Status de concessão inválido. Utilize active, suspended ou revoked.' });
    }
    const statusReason =
      typeof req.body?.reason === 'string' && req.body.reason.trim()
        ? req.body.reason.trim().slice(0, 500)
        : null;

    const adminDb = getAccessDb();
    try {
      const updatedGrant = await adminDb.runTransaction(async (tx: any) => {
        const grantRef = adminDb.collection('course_access_grants').doc(grantId);
        const snap = await tx.get(grantRef);
        if (!snap?.exists) {
          return null;
        }
        const existing = { id: grantId, ...(snap.data() || {}) } as CourseAccessGrant;
        const nowIso = new Date().toISOString();
        const isRevoking = nextStatus === 'revoked' || nextStatus === 'suspended';

        const nextDoc: CourseAccessGrant = {
          ...existing,
          status: nextStatus as 'active' | 'suspended' | 'revoked',
          statusReason,
          revokedBy: isRevoking ? caller.uid : null,
          revokedAt: isRevoking ? nowIso : null,
          updatedAt: nowIso,
        };
        tx.set(grantRef, nextDoc);
        return nextDoc;
      });

      if (!updatedGrant) {
        return res.status(404).json({ error: 'Concessão de acesso não encontrada.' });
      }

      await recordAdminLog({
        eventType: nextStatus === 'active' ? 'course_access_reactivated' : 'course_access_revoked',
        severity: nextStatus === 'revoked' ? 'warning' : 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        targetUid: updatedGrant.studentUid,
        action: `Concessão ${grantId} atualizada para "${nextStatus}"`,
        details: statusReason || undefined,
      });

      const ctx = await loadStudentAccessContextServerSide(adminDb, updatedGrant.studentUid);
      return res.json({
        status: 'ok',
        grant: updatedGrant,
        snapshot: ctx.snapshot,
      });
    } catch (err: any) {
      console.error('[Admin Access] Erro ao atualizar status da concessão:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível atualizar o status da concessão.' });
    }
  });

  // Admin define ou remove o Direcionamento Inicial no currículo sem apagar progresso anterior
  app.put('/api/admin/students/:uid/placement', requireAuth, requireAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null; role: 'admin' };
    const studentUid = String(req.params.uid || '').trim();
    if (!UID_REGEX.test(studentUid)) {
      return res.status(400).json({ error: 'UID do aluno inválido.' });
    }
    if (!hasAccessDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    const body = req.body || {};
    const mode = body.mode === 'default_path' ? 'default_path' : 'custom_start';
    const reason =
      typeof body.reason === 'string' && body.reason.trim()
        ? body.reason.trim().slice(0, 500)
        : null;
    const adminDb = getAccessDb();

    try {
      const nowIso = new Date().toISOString();

      if (mode === 'default_path') {
        const targetCourseId = body.courseId ? String(body.courseId).trim() : null;
        if (targetCourseId && !isValidCourseId(targetCourseId)) {
          return res.status(400).json({ error: 'Curso inválido ao limpar direcionamento.' });
        }
        const placementsSnap = await adminDb
          .collection('student_academic_placements')
          .where('studentUid', '==', studentUid)
          .limit(50)
          .get();

        const cleared: StudentAcademicPlacement[] = [];
        for (const docItem of placementsSnap?.docs || []) {
          const data = docItem.data() || {};
          if (targetCourseId && data.courseId !== targetCourseId) continue;
          const nextPlacement: StudentAcademicPlacement = {
            ...data,
            id: docItem.id,
            studentUid,
            mode: 'default_path',
            status: 'cleared',
            reason: reason ?? data.reason ?? 'Retornado ao percurso padrão pelo administrador.',
            assignedBy: caller.uid,
            assignedByEmail: caller.email || null,
            updatedAt: nowIso,
          };
          await adminDb.collection('student_academic_placements').doc(docItem.id).set(nextPlacement);
          cleared.push(nextPlacement);
        }

        await recordAdminLog({
          eventType: 'student_placement_updated',
          severity: 'info',
          actorUid: caller.uid,
          actorEmail: caller.email,
          actorRole: 'admin',
          targetUid: studentUid,
          action: 'Direcionamento inicial removido (retorno ao percurso padrão)',
          details: targetCourseId ? `courseId=${targetCourseId}` : 'all_courses',
        });

        const ctx = await loadStudentAccessContextServerSide(adminDb, studentUid);
        return res.json({
          status: 'ok',
          mode: 'default_path',
          clearedCount: cleared.length,
          placements: ctx.placements,
          snapshot: ctx.snapshot,
        });
      }

      const validated = validatePlacementTarget({
        courseId: String(body.courseId || ''),
        moduleId: body.moduleId ?? null,
        lessonId: body.lessonId ?? null,
      });
      if (!validated.valid || !validated.courseId || !validated.lessonId) {
        return res.status(400).json({ error: validated.error || 'Ponto inicial inválido no catálogo oficial.' });
      }

      const placementId = computePlacementDocId(studentUid, validated.courseId);
      const placementRef = adminDb.collection('student_academic_placements').doc(placementId);

      const savedPlacement = await adminDb.runTransaction(async (tx: any) => {
        const existingSnap = await tx.get(placementRef);
        const createdAt = existingSnap?.exists ? existingSnap.data()?.createdAt || nowIso : nowIso;
        const payload: StudentAcademicPlacement = {
          id: placementId,
          studentUid,
          courseId: validated.courseId!,
          moduleId: validated.moduleId ?? null,
          moduleNumber: validated.moduleNumber ?? null,
          lessonId: validated.lessonId!,
          mode: 'custom_start',
          status: 'active',
          reason,
          assignedBy: caller.uid,
          assignedByEmail: caller.email || null,
          createdAt,
          updatedAt: nowIso,
        };
        tx.set(placementRef, payload);
        return payload;
      });

      const courseMeta = getCatalogCourse(validated.courseId);
      await recordAdminLog({
        eventType: 'student_placement_updated',
        severity: 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        targetUid: studentUid,
        action: `Direcionamento inicial definido em ${courseMeta?.title || validated.courseId}`,
        details: `module=${validated.moduleId || ''} lesson=${validated.lessonId}`,
      });

      const ctx = await loadStudentAccessContextServerSide(adminDb, studentUid);
      return res.json({
        status: 'ok',
        placement: savedPlacement,
        placements: ctx.placements,
        snapshot: ctx.snapshot,
      });
    } catch (err: any) {
      console.error('[Admin Placement] Erro ao atualizar direcionamento inicial:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível salvar o direcionamento inicial do aluno.' });
    }
  });

  // =========================================================================
  // FASE 2: GUITAR ACADEMY COMMERCE CORE (CATÁLOGO, PREÇOS, CUPONS E MODO PAGO)
  // Modo pago inicia e permanece DESATIVADO (false / fail-closed) até autorização
  // explícita e documentada do administrador. Sem gateway conectado.
  // =========================================================================
  const getCommerceDb = () =>
    deps.adminDbForCommerce || deps.adminDbForAccess || deps.adminDbForClasses || getAdminDb();

  const hasCommerceDbReady = (): boolean => {
    return Boolean(
      deps.adminDbForCommerce ||
        deps.adminDbForAccess ||
        deps.adminDbForClasses ||
        canWriteAuditLogToFirestore()
    );
  };

  const requireCommerceAdmin: express.RequestHandler = async (req, res, next) => {
    const authUser = (req as any).user as
      | { uid: string; email?: string | null; role?: 'student' | 'teacher' | 'admin' }
      | undefined;

    if (!authUser || !authUser.uid) {
      return res.status(401).json({ error: 'Autenticação necessária.' });
    }

    try {
      const roleCheck = await resolveSystemRole(authUser.uid);
      const authoritativeRole = roleCheck.exists ? normalizeRole(roleCheck.role) : 'student';
      (req as any).userRole = authoritativeRole;
      (req as any).user.role = authoritativeRole;

      if (!roleCheck.exists || authoritativeRole !== 'admin') {
        await recordAdminLog({
          eventType: 'commerce_unauthorized_attempt',
          severity: 'warning',
          actorUid: authUser.uid,
          actorEmail: authUser.email,
          actorRole: authoritativeRole,
          action: `Tentativa não autorizada no módulo comercial (${req.method} ${req.path})`,
          details: `role=${authoritativeRole}`,
        });
        return res.status(403).json({
          error: 'Acesso negado. Operações comerciais exigem perfil administrador verificado.',
          code: 'auth/forbidden-role',
        });
      }

      return next();
    } catch (err: any) {
      console.error('[requireCommerceAdmin] Falha na consulta autoritativa de papel (fail-closed):', err?.message || err);
      await recordAdminLog({
        eventType: 'commerce_unauthorized_attempt',
        severity: 'warning',
        actorUid: authUser.uid,
        actorEmail: authUser.email,
        actorRole: 'student',
        action: `Falha na validação de papel no módulo comercial (${req.method} ${req.path})`,
        details: 'role-verification-failed',
      });
      return res.status(403).json({
        error: 'Falha na validação de permissões. Acesso negado por segurança.',
        code: 'auth/role-verification-failed',
      });
    }
  };

  async function loadCommerceConfigServerSide(adminDb: any): Promise<CommerceGlobalConfig> {
    try {
      const cfgSnap = await adminDb.collection('platform_config').doc('commerce').get();
      if (!cfgSnap?.exists) {
        return { ...DEFAULT_COMMERCE_CONFIG };
      }
      return normalizeCommerceConfig(cfgSnap.data());
    } catch {
      return { ...DEFAULT_COMMERCE_CONFIG };
    }
  }

  // Endpoint autenticado para leitura pública do catálogo comercial (Fail-Closed)
  app.get('/api/commerce/catalog', requireAuth, async (_req, res) => {
    if (!hasCommerceDbReady()) {
      return res.json({
        status: 'ok',
        commerceEnabled: false,
        catalogVisible: false,
        products: [],
        prices: [],
      });
    }

    try {
      const adminDb = getCommerceDb();
      const config = await loadCommerceConfigServerSide(adminDb);
      if (!isCommerceStorefrontVisible(config)) {
        return res.json({
          status: 'ok',
          commerceEnabled: false,
          catalogVisible: false,
          products: [],
          prices: [],
        });
      }

      const [productsSnap, pricesSnap] = await Promise.all([
        adminDb.collection('products').limit(200).get(),
        adminDb.collection('product_prices').limit(500).get(),
      ]);

      const publicProducts: CommerceProduct[] = (productsSnap?.docs || [])
        .map((d: any) => ({ productId: d.id, ...(d.data() || {}) }) as CommerceProduct)
        .filter((p: CommerceProduct) => p.status === 'active' && p.visibility === 'public');

      const publicProductIds = new Set(publicProducts.map((p) => p.productId));
      const publicPrices: CommerceProductPrice[] = (pricesSnap?.docs || [])
        .map((d: any) => ({ priceId: d.id, ...(d.data() || {}) }) as CommerceProductPrice)
        .filter((pr: CommerceProductPrice) => pr.status === 'active' && publicProductIds.has(pr.productId));

      return res.json({
        status: 'ok',
        commerceEnabled: config.commerceEnabled,
        catalogVisible: config.catalogVisible,
        products: publicProducts,
        prices: publicPrices,
      });
    } catch (err: any) {
      console.error('[Commerce] Falha ao consultar catálogo público (fail-closed):', err?.message || err);
      return res.json({
        status: 'ok',
        commerceEnabled: false,
        catalogVisible: false,
        products: [],
        prices: [],
      });
    }
  });

  // Endpoint autenticado de validação autoritativa de cupom no servidor (rejeita se promoções desligadas)
  app.post('/api/commerce/validate-coupon', requireAuth, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null; role: string };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Serviço comercial indisponível no momento.',
        code: 'admin/credentials-unavailable',
      });
    }

    const body = req.body || {};
    const code = normalizeCouponCode(String(body.code || ''));
    const productId = String(body.productId || '').trim();
    const priceId = String(body.priceId || '').trim();

    if (!UID_REGEX.test(productId) || !UID_REGEX.test(priceId)) {
      return res.status(400).json({ valid: false, error: 'Produto ou preço informado é inválido.' });
    }

    try {
      const adminDb = getCommerceDb();
      const config = await loadCommerceConfigServerSide(adminDb);
      if (!config.commerceEnabled || !config.promotionsEnabled) {
        return res.status(403).json({
          valid: false,
          reason: 'promotions_disabled',
          error: 'O sistema de promoções e cupons está desativado na configuração global.',
        });
      }

      const [productSnap, priceSnap, promoSnap, enrollmentsSnap] = await Promise.all([
        adminDb.collection('products').doc(productId).get(),
        adminDb.collection('product_prices').doc(priceId).get(),
        adminDb.collection('promotions').limit(200).get(),
        adminDb.collection('enrollments').where('studentId', '==', caller.uid).limit(50).get(),
      ]);

      if (!productSnap?.exists || !priceSnap?.exists) {
        return res.status(404).json({ valid: false, error: 'Produto ou preço não encontrado.' });
      }

      const product = { productId: productSnap.id, ...(productSnap.data() || {}) } as CommerceProduct;
      const price = { priceId: priceSnap.id, ...(priceSnap.data() || {}) } as CommerceProductPrice;
      const promotions: CommercePromotion[] = (promoSnap?.docs || []).map(
        (d: any) => ({ promotionId: d.id, ...(d.data() || {}) }) as CommercePromotion
      );
      const matchedPromo =
        promotions.find((p) => normalizeCouponCode(p.code || '') === code) || null;

      const hasActiveClassEnrollment = (enrollmentsSnap?.docs || []).some((d: any) => {
        const s = String(d.data()?.status || '').toLowerCase();
        return s === 'active' || s === 'approved';
      });

      const evaluation = evaluateAndCalculateCoupon({
        code,
        product,
        price,
        promotion: matchedPromo,
        config,
        studentUid: caller.uid,
        isNewStudent: !hasActiveClassEnrollment,
        hasActiveClassEnrollment,
        allowAdminPreviewWhenDisabled: false,
      });

      if (!evaluation.valid) {
        return res.status(400).json({ status: 'invalid', evaluation });
      }
      return res.json({ status: 'ok', evaluation });
    } catch (err: any) {
      console.error('[Commerce] Erro ao validar cupom:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível validar o cupom no servidor.' });
    }
  });

  // Admin: visão completa da infraestrutura comercial (catálogo oculto, preços, promoções, config)
  app.get('/api/admin/commerce/overview', requireAuth, requireCommerceAdmin, async (_req, res) => {
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    try {
      const adminDb = getCommerceDb();
      const [config, productsSnap, pricesSnap, promotionsSnap] = await Promise.all([
        loadCommerceConfigServerSide(adminDb),
        adminDb.collection('products').limit(300).get(),
        adminDb.collection('product_prices').limit(1000).get(),
        adminDb.collection('promotions').limit(300).get(),
      ]);

      const products: CommerceProduct[] = (productsSnap?.docs || [])
        .map((d: any) => ({ productId: d.id, ...(d.data() || {}) }) as CommerceProduct)
        .sort((a: CommerceProduct, b: CommerceProduct) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));

      const prices: CommerceProductPrice[] = (pricesSnap?.docs || [])
        .map((d: any) => ({ priceId: d.id, ...(d.data() || {}) }) as CommerceProductPrice)
        .sort((a: CommerceProductPrice, b: CommerceProductPrice) => (b.version || 0) - (a.version || 0));

      const promotions: CommercePromotion[] = (promotionsSnap?.docs || [])
        .map((d: any) => ({ promotionId: d.id, ...(d.data() || {}) }) as CommercePromotion)
        .sort((a: CommercePromotion, b: CommercePromotion) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));

      return res.json({
        status: 'ok',
        config,
        products,
        prices,
        promotions,
      });
    } catch (err: any) {
      console.error('[Admin Commerce] Erro ao carregar overview comercial:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível carregar o módulo comercial.' });
    }
  });

  // Admin: atualizar interruptor global Fail-Closed (exige confirmação explícita para habilitar)
  app.put('/api/admin/commerce/config', requireAuth, requireCommerceAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null; role: 'admin' };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    const body = req.body || {};
    const wantsEnable =
      body.commerceEnabled === true ||
      body.catalogVisible === true ||
      body.checkoutEnabled === true;

    if (
      wantsEnable &&
      String(body.confirmationText || '').trim().toUpperCase() !== COMMERCE_CONFIRMATION_PHRASE
    ) {
      return res.status(400).json({
        error: `Ativação comercial requer confirmação explícita: "${COMMERCE_CONFIRMATION_PHRASE}".`,
      });
    }

    const nowIso = new Date().toISOString();
    const nextConfig = normalizeCommerceConfig({
      configId: 'commerce',
      commerceEnabled: body.commerceEnabled === true,
      catalogVisible: body.catalogVisible === true,
      checkoutEnabled: body.checkoutEnabled === true,
      promotionsEnabled: body.promotionsEnabled === true,
      advertisementsEnabled: body.advertisementsEnabled === true,
      paidClassesEnabled: body.paidClassesEnabled === true,
      subscriptionsEnabled: body.subscriptionsEnabled === true,
      defaultCurrency: body.defaultCurrency || 'BRL',
      updatedAt: nowIso,
      updatedBy: caller.uid,
      updatedByEmail: caller.email || null,
      lastActivationReason:
        typeof body.reason === 'string' && body.reason.trim()
          ? body.reason.trim().slice(0, 500)
          : null,
      failClosedVerified: true,
    });

    try {
      const adminDb = getCommerceDb();
      await adminDb.collection('platform_config').doc('commerce').set(nextConfig);

      await recordAdminLog({
        eventType: 'commerce_config_updated',
        severity: nextConfig.commerceEnabled ? 'warning' : 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        action: `Configuração comercial atualizada (commerceEnabled=${String(nextConfig.commerceEnabled)})`,
        details: `catalog=${nextConfig.catalogVisible}, checkout=${nextConfig.checkoutEnabled}, promos=${nextConfig.promotionsEnabled}`,
      });

      return res.json({ status: 'ok', config: nextConfig });
    } catch (err: any) {
      console.error('[Admin Commerce] Erro ao salvar config comercial:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível salvar a configuração comercial.' });
    }
  });

  // Admin: criar produto comercial (SEMPRE inicia oculto: visibility = 'hidden')
  app.post('/api/admin/commerce/products', requireAuth, requireCommerceAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null; role: 'admin' };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    const validation = validateProductCreateInput(req.body || {});
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const nowIso = new Date().toISOString();
    const productId = generateCommerceId('prod');
    const product: CommerceProduct = {
      productId,
      name: validation.data.name,
      description: validation.data.description,
      productType: validation.data.productType,
      courseIds: validation.data.courseIds,
      status: validation.data.status,
      visibility: 'hidden',
      linkedClassId: validation.data.linkedClassId,
      notes: validation.data.notes,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: caller.uid,
      createdByEmail: caller.email || null,
    };

    try {
      const adminDb = getCommerceDb();
      await adminDb.collection('products').doc(productId).set(product);

      await recordAdminLog({
        eventType: 'commerce_product_created',
        severity: 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        action: `Produto comercial criado (oculto): ${product.name}`,
        details: `productId=${productId}, type=${product.productType}, courses=${product.courseIds.join(',')}`,
      });

      return res.status(201).json({ status: 'ok', product });
    } catch (err: any) {
      console.error('[Admin Commerce] Erro ao criar produto:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível criar o produto comercial.' });
    }
  });

  // Admin: atualizar produto comercial existente
  app.patch('/api/admin/commerce/products/:productId', requireAuth, requireCommerceAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null; role: 'admin' };
    const productId = String(req.params.productId || '').trim();
    if (!UID_REGEX.test(productId)) {
      return res.status(400).json({ error: 'Identificador de produto inválido.' });
    }
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    try {
      const adminDb = getCommerceDb();
      const ref = adminDb.collection('products').doc(productId);
      const snap = await ref.get();
      if (!snap?.exists) {
        return res.status(404).json({ error: 'Produto comercial não encontrado.' });
      }
      const existing = { productId: snap.id, ...(snap.data() || {}) } as CommerceProduct;
      const validated = validateProductUpdateInput(existing, req.body || {});
      if (!validated.valid) {
        return res.status(400).json({ error: validated.error });
      }
      const nextProduct: CommerceProduct = {
        ...validated.nextProduct,
        updatedAt: new Date().toISOString(),
      };
      await ref.set(nextProduct);

      await recordAdminLog({
        eventType: 'commerce_product_updated',
        severity: 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        action: `Produto comercial atualizado: ${nextProduct.name}`,
        details: `productId=${productId}, status=${nextProduct.status}, visibility=${nextProduct.visibility}`,
      });

      return res.json({ status: 'ok', product: nextProduct });
    } catch (err: any) {
      console.error('[Admin Commerce] Erro ao atualizar produto:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível atualizar o produto comercial.' });
    }
  });

  // Admin: registrar nova versão imutável de preço (nunca sobrescreve versões históricas)
  app.post(
    '/api/admin/commerce/products/:productId/prices',
    requireAuth,
    requireCommerceAdmin,
    async (req, res) => {
      const caller = (req as any).user as { uid: string; email?: string | null; role: 'admin' };
      const productId = String(req.params.productId || '').trim();
      const validation = validateNewPriceVersionInput({
        ...(req.body || {}),
        productId,
      });
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
      if (!hasCommerceDbReady()) {
        return res.status(503).json({
          error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
          code: 'admin/credentials-unavailable',
        });
      }

      const adminDb = getCommerceDb();
      const newPriceId = generateCommerceId('price');
      const nowIso = new Date().toISOString();

      try {
        const txResult = await adminDb.runTransaction(async (tx: any) => {
          const productRef = adminDb.collection('products').doc(productId);
          const productSnap = await tx.get(productRef);
          if (!productSnap?.exists) {
            return { notFound: true as const };
          }

          const existingSnap = await tx.get(
            adminDb.collection('product_prices').where('productId', '==', productId).limit(200)
          );
          const productPrices: CommerceProductPrice[] = (existingSnap?.docs || []).map(
            (d: any) => ({ priceId: d.id, ...(d.data() || {}) }) as CommerceProductPrice
          );

          let maxVersion = 0;
          let previousSameSlot: CommerceProductPrice | null = null;
          const toSupersede: CommerceProductPrice[] = [];

          for (const item of productPrices) {
            if ((item.version || 0) > maxVersion) {
              maxVersion = item.version || 0;
            }
            if (
              isSamePriceSlot(item, {
                productId,
                currency: validation.data.currency,
                billingInterval: validation.data.billingInterval,
                isPromotional: validation.data.isPromotional,
              })
            ) {
              previousSameSlot = item;
              toSupersede.push(item);
            }
          }

          const newPrice: CommerceProductPrice = {
            priceId: newPriceId,
            productId,
            currency: validation.data.currency,
            amount: validation.data.amount,
            amountCents: validation.data.amountCents,
            billingInterval: validation.data.billingInterval,
            isPromotional: validation.data.isPromotional,
            promotionalLabel: validation.data.promotionalLabel,
            version: maxVersion + 1,
            previousPriceId: previousSameSlot?.priceId ?? null,
            status: 'active',
            validFrom: validation.data.validFrom,
            validFromMs: validation.data.validFromMs,
            validUntil: validation.data.validUntil,
            validUntilMs: validation.data.validUntilMs,
            notes: validation.data.notes,
            createdAt: nowIso,
            createdBy: caller.uid,
            createdByEmail: caller.email || null,
            supersededAt: null,
            supersededBy: null,
          };

          for (const oldPrice of toSupersede) {
            tx.set(adminDb.collection('product_prices').doc(oldPrice.priceId), {
              ...oldPrice,
              status: 'superseded',
              supersededAt: nowIso,
              supersededBy: newPriceId,
            });
          }

          tx.set(adminDb.collection('product_prices').doc(newPriceId), newPrice);

          return {
            notFound: false as const,
            price: newPrice,
            supersededPriceIds: toSupersede.map((p) => p.priceId),
          };
        });

        if (txResult.notFound) {
          return res.status(404).json({ error: 'Produto comercial não encontrado.' });
        }

        await recordAdminLog({
          eventType: 'commerce_price_version_created',
          severity: 'info',
          actorUid: caller.uid,
          actorEmail: caller.email,
          actorRole: 'admin',
          action: `Nova versão de preço v${txResult.price.version} registrada (${txResult.price.currency} ${txResult.price.amount.toFixed(2)})`,
          details: `productId=${productId}, interval=${txResult.price.billingInterval}, superseded=${txResult.supersededPriceIds.join(',') || 'none'}`,
        });

        return res.status(201).json({
          status: 'ok',
          price: txResult.price,
          supersededPriceIds: txResult.supersededPriceIds,
        });
      } catch (err: any) {
        console.error('[Admin Commerce] Erro ao registrar versão de preço:', err?.message || err);
        return res.status(500).json({ error: 'Não foi possível criar a nova versão de preço.' });
      }
    }
  );

  // Admin: criar promoção ou cupom comercial
  app.post('/api/admin/commerce/promotions', requireAuth, requireCommerceAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null; role: 'admin' };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
        code: 'admin/credentials-unavailable',
      });
    }

    const validation = validatePromotionInput(req.body || {});
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    try {
      const adminDb = getCommerceDb();
      if (validation.data.code) {
        const existingSnap = await adminDb.collection('promotions').limit(300).get();
        const duplicate = (existingSnap?.docs || []).some((d: any) => {
          const data = d.data() || {};
          return normalizeCouponCode(data.code || '') === validation.data.code && data.status !== 'ended';
        });
        if (duplicate) {
          return res.status(409).json({
            error: `Já existe uma promoção ativa/vigente utilizando o código "${validation.data.code}".`,
          });
        }
      }

      const nowIso = new Date().toISOString();
      const promotionId = generateCommerceId('promo');
      const promotion: CommercePromotion = {
        promotionId,
        name: validation.data.name,
        description: validation.data.description,
        code: validation.data.code,
        discountType: validation.data.discountType,
        discountValue: validation.data.discountValue,
        scopeType: validation.data.scopeType,
        targetProductIds: validation.data.targetProductIds,
        targetCourseIds: validation.data.targetCourseIds,
        startsAt: validation.data.startsAt,
        startsAtMs: validation.data.startsAtMs,
        endsAt: validation.data.endsAt,
        endsAtMs: validation.data.endsAtMs,
        maxRedemptions: validation.data.maxRedemptions,
        maxPerStudent: validation.data.maxPerStudent,
        redeemedCount: 0,
        eligibleAudience: validation.data.eligibleAudience,
        eligibleStudentUids: validation.data.eligibleStudentUids,
        status: validation.data.status,
        createdAt: nowIso,
        updatedAt: nowIso,
        createdBy: caller.uid,
        createdByEmail: caller.email || null,
      };

      await adminDb.collection('promotions').doc(promotionId).set(promotion);

      await recordAdminLog({
        eventType: 'commerce_promotion_created',
        severity: 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        action: `Promoção/Cupom criado: ${promotion.name}${promotion.code ? ` [${promotion.code}]` : ''}`,
        details: `promotionId=${promotionId}, scope=${promotion.scopeType}, discount=${promotion.discountValue}`,
      });

      return res.status(201).json({ status: 'ok', promotion });
    } catch (err: any) {
      console.error('[Admin Commerce] Erro ao criar promoção:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível criar a promoção/cupom.' });
    }
  });

  // Admin: atualizar status de promoção/cupom
  app.patch(
    '/api/admin/commerce/promotions/:promotionId',
    requireAuth,
    requireCommerceAdmin,
    async (req, res) => {
      const caller = (req as any).user as { uid: string; email?: string | null; role: 'admin' };
      const promotionId = String(req.params.promotionId || '').trim();
      if (!UID_REGEX.test(promotionId)) {
        return res.status(400).json({ error: 'Identificador de promoção inválido.' });
      }
      if (!hasCommerceDbReady()) {
        return res.status(503).json({
          error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
          code: 'admin/credentials-unavailable',
        });
      }

      const nextStatus = String(req.body?.status || '').trim() as CommercePromotionStatus;
      if (!['draft', 'active', 'paused', 'ended'].includes(nextStatus)) {
        return res.status(400).json({ error: 'Status de promoção inválido.' });
      }

      try {
        const adminDb = getCommerceDb();
        const ref = adminDb.collection('promotions').doc(promotionId);
        const snap = await ref.get();
        if (!snap?.exists) {
          return res.status(404).json({ error: 'Promoção/cupom não encontrado.' });
        }
        const existing = { promotionId: snap.id, ...(snap.data() || {}) } as CommercePromotion;
        const updated: CommercePromotion = {
          ...existing,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
        await ref.set(updated);

        await recordAdminLog({
          eventType: existing.code ? 'commerce_coupon_updated' : 'commerce_promotion_updated',
          severity: 'info',
          actorUid: caller.uid,
          actorEmail: caller.email,
          actorRole: 'admin',
          action: `Status de ${existing.code ? `cupom ${existing.code}` : `promoção ${existing.name}`} alterado para "${nextStatus}"`,
          details: `promotionId=${promotionId}`,
        });

        return res.json({ status: 'ok', promotion: updated });
      } catch (err: any) {
        console.error('[Admin Commerce] Erro ao atualizar promoção:', err?.message || err);
        return res.status(500).json({ error: 'Não foi possível atualizar a promoção.' });
      }
    }
  );

  // Admin: cálculo/validação autoritativa no servidor (ou simulação explícita quando commerceEnabled=false)
  app.post(
    '/api/admin/commerce/coupons/validate',
    requireAuth,
    requireCommerceAdmin,
    async (req, res) => {
      if (!hasCommerceDbReady()) {
        return res.status(503).json({
          error: 'Credenciais administrativas do Firebase Admin SDK não estão disponíveis neste servidor.',
          code: 'admin/credentials-unavailable',
        });
      }

      const body = req.body || {};
      const code = normalizeCouponCode(String(body.code || ''));
      const productId = String(body.productId || '').trim();
      const priceId = String(body.priceId || '').trim();
      const studentUid = body.studentUid ? String(body.studentUid).trim() : null;
      const allowAdminPreview = body.allowAdminPreview === true;
      const nowMs =
        typeof body.nowMs === 'number' && Number.isFinite(body.nowMs) ? body.nowMs : Date.now();

      if (!UID_REGEX.test(productId) || !UID_REGEX.test(priceId)) {
        return res.status(400).json({ error: 'Produto ou preço inválido para simulação.' });
      }

      try {
        const adminDb = getCommerceDb();
        const [config, productSnap, priceSnap, promoSnap] = await Promise.all([
          loadCommerceConfigServerSide(adminDb),
          adminDb.collection('products').doc(productId).get(),
          adminDb.collection('product_prices').doc(priceId).get(),
          adminDb.collection('promotions').limit(300).get(),
        ]);

        if (!productSnap?.exists || !priceSnap?.exists) {
          return res.status(404).json({ error: 'Produto ou versão de preço não encontrado.' });
        }

        const product = { productId: productSnap.id, ...(productSnap.data() || {}) } as CommerceProduct;
        const price = { priceId: priceSnap.id, ...(priceSnap.data() || {}) } as CommerceProductPrice;
        const promotions: CommercePromotion[] = (promoSnap?.docs || []).map(
          (d: any) => ({ promotionId: d.id, ...(d.data() || {}) }) as CommercePromotion
        );
        const matchedPromo =
          promotions.find((p) => normalizeCouponCode(p.code || '') === code) || null;

        let hasActiveClassEnrollment: boolean | undefined;
        if (studentUid && UID_REGEX.test(studentUid)) {
          const enrSnap = await adminDb
            .collection('enrollments')
            .where('studentId', '==', studentUid)
            .limit(50)
            .get();
          hasActiveClassEnrollment = (enrSnap?.docs || []).some((d: any) => {
            const s = String(d.data()?.status || '').toLowerCase();
            return s === 'active' || s === 'approved';
          });
        }

        // Recálculo integral no servidor — quaisquer campos discountAmount/finalAmount do request são ignorados
        const evaluation = evaluateAndCalculateCoupon({
          code,
          product,
          price,
          promotion: matchedPromo,
          config,
          studentUid,
          isNewStudent: hasActiveClassEnrollment === undefined ? undefined : !hasActiveClassEnrollment,
          hasActiveClassEnrollment,
          studentRedemptionCount: Number(body.studentRedemptionCount ?? 0),
          nowMs,
          allowAdminPreviewWhenDisabled: allowAdminPreview,
        });

        if (!evaluation.valid) {
          return res.status(400).json({ status: 'invalid', evaluation });
        }
        return res.json({ status: 'ok', evaluation });
      } catch (err: any) {
        console.error('[Admin Commerce] Erro ao simular/validar cupom:', err?.message || err);
        return res.status(500).json({ error: 'Não foi possível validar o cupom no servidor.' });
      }
    }
  );

  // =========================================================================
  // FASE 3: CAMPANHAS/STORAGE, TURMAS PAGAS, RESERVAS, LISTA DE ESPERA,
  // PEDIDOS, PAGAMENTOS/WEBHOOKS, ASSINATURAS E FINANCEIRO
  // =========================================================================

  // Público autenticado: anúncios visíveis apenas se commerceEnabled && advertisementsEnabled == true
  app.get('/api/commerce/advertisements', requireAuth, async (req, res) => {
    const caller = (req as any).user as { uid: string };
    const positionFilter = req.query?.position ? String(req.query.position).trim() : '';

    if (!hasCommerceDbReady()) {
      return res.json({
        status: 'ok',
        commerceEnabled: false,
        advertisementsEnabled: false,
        advertisements: [],
      });
    }

    try {
      const adminDb = getCommerceDb();
      const config = await loadCommerceConfigServerSide(adminDb);
      if (!config.commerceEnabled || !config.advertisementsEnabled) {
        return res.json({
          status: 'ok',
          commerceEnabled: config.commerceEnabled,
          advertisementsEnabled: false,
          advertisements: [],
        });
      }

      const [adsSnap, enrollmentsSnap] = await Promise.all([
        adminDb.collection('advertisements').limit(200).get(),
        adminDb.collection('enrollments').where('studentId', '==', caller.uid).limit(50).get(),
      ]);

      const hasActiveClassEnrollment = (enrollmentsSnap?.docs || []).some((d: any) => {
        const s = String(d.data()?.status || '').toLowerCase();
        return s === 'active' || s === 'approved';
      });
      const nowMs = Date.now();

      const advertisements: CommerceAdvertisement[] = (adsSnap?.docs || [])
        .map((d: any) => ({ advertisementId: d.id, ...(d.data() || {}) }) as CommerceAdvertisement)
        .filter((ad: CommerceAdvertisement) =>
          isAdvertisementVisibleToStudent({
            advertisement: ad,
            config,
            studentUid: caller.uid,
            hasActiveClassEnrollment,
            position: (positionFilter || undefined) as any,
            nowMs,
          })
        );

      return res.json({
        status: 'ok',
        commerceEnabled: true,
        advertisementsEnabled: true,
        advertisements,
      });
    } catch (err: any) {
      console.error('[Commerce Phase3] Erro ao listar anúncios (fail-closed):', err?.message || err);
      return res.json({
        status: 'ok',
        commerceEnabled: false,
        advertisementsEnabled: false,
        advertisements: [],
      });
    }
  });

  // Público autenticado: ofertas de turmas pagas (fail-closed quando desligado)
  app.get('/api/commerce/class-offers', requireAuth, async (_req, res) => {
    if (!hasCommerceDbReady()) {
      return res.json({
        status: 'ok',
        commerceEnabled: false,
        paidClassesEnabled: false,
        offers: [],
      });
    }

    try {
      const adminDb = getCommerceDb();
      const config = await loadCommerceConfigServerSide(adminDb);
      if (!config.commerceEnabled || !config.paidClassesEnabled) {
        return res.json({
          status: 'ok',
          commerceEnabled: config.commerceEnabled,
          paidClassesEnabled: false,
          offers: [],
        });
      }

      const offersSnap = await adminDb.collection('class_offers').limit(200).get();
      const offers = (offersSnap?.docs || [])
        .map((d: any) => ({ offerId: d.id, ...(d.data() || {}) }) as CommerceClassOffer)
        .filter((o: CommerceClassOffer) => o.status === 'open' || o.status === 'scheduled')
        .map((o: CommerceClassOffer) => ({
          ...o,
          availableSeats: computeAvailableOfferSeats(o),
        }));

      return res.json({
        status: 'ok',
        commerceEnabled: true,
        paidClassesEnabled: true,
        offers,
      });
    } catch (err: any) {
      console.error('[Commerce Phase3] Erro ao listar ofertas de turma:', err?.message || err);
      return res.json({
        status: 'ok',
        commerceEnabled: false,
        paidClassesEnabled: false,
        offers: [],
      });
    }
  });

  // Público autenticado: reserva temporária transacional de vaga (NUNCA matricula antes do pagamento confirmado)
  app.post('/api/commerce/reservations', requireAuth, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Serviço comercial indisponível.',
        code: 'admin/credentials-unavailable',
      });
    }

    const offerId = String(req.body?.offerId || '').trim();
    const idempotencyKeyInput = String(req.body?.idempotencyKey || '').trim();
    const ttlMsRaw = Number(req.body?.ttlMs);
    const ttlMs =
      Number.isFinite(ttlMsRaw) && ttlMsRaw >= 60 * 1000 && ttlMsRaw <= 24 * 60 * 60 * 1000
        ? Math.floor(ttlMsRaw)
        : DEFAULT_RESERVATION_TTL_MS;

    if (!UID_REGEX.test(offerId)) {
      return res.status(400).json({ error: 'Identificador de oferta de turma inválido.' });
    }

    try {
      const adminDb = getCommerceDb();
      const config = await loadCommerceConfigServerSide(adminDb);
      if (!config.commerceEnabled || !config.checkoutEnabled || !config.paidClassesEnabled) {
        return res.status(403).json({
          error: 'Checkout comercial e turmas pagas estão desativados na plataforma.',
          code: 'commerce/checkout-disabled',
        });
      }

      const nowMs = Date.now();
      const nowIso = new Date(nowMs).toISOString();
      const idempotencyKey =
        idempotencyKeyInput && idempotencyKeyInput.length <= 200
          ? `${caller.uid}:${offerId}:${idempotencyKeyInput}`
          : `${caller.uid}:${offerId}:${nowMs}`;

      const txResult = await adminDb.runTransaction(async (tx: any) => {
        const offerRef = adminDb.collection('class_offers').doc(offerId);
        const offerSnap = await tx.get(offerRef);
        if (!offerSnap?.exists) {
          return { ok: false as const, status: 404, error: 'Oferta de turma não encontrada.' };
        }

        const offer = { offerId: offerSnap.id, ...(offerSnap.data() || {}) } as CommerceClassOffer;
        const reservationsSnap = await tx.get(
          adminDb.collection('class_reservations').where('offerId', '==', offerId).limit(500)
        );
        const existingReservations: ClassReservation[] = (reservationsSnap?.docs || []).map(
          (d: any) => ({ reservationId: d.id, ...(d.data() || {}) }) as ClassReservation
        );

        let effectiveReserved = offer.reservedSeats || 0;
        const expiredToRelease: ClassReservation[] = [];
        for (const r of existingReservations) {
          if (r.status === 'pending_payment' && isReservationExpired(r, nowMs)) {
            expiredToRelease.push(r);
            effectiveReserved = Math.max(0, effectiveReserved - 1);
          }
        }

        // Idempotência explícita por chave
        const idempotentHit = existingReservations.find(
          (r) =>
            r.studentUid === caller.uid &&
            r.idempotencyKey === idempotencyKey &&
            (r.status === 'pending_payment' || r.status === 'confirmed')
        );
        if (idempotentHit) {
          return {
            ok: true as const,
            status: 200,
            idempotent: true,
            reservation: idempotentHit,
            offer: { ...offer, reservedSeats: effectiveReserved },
          };
        }

        // Previne reserva duplicada ativa do mesmo aluno na mesma oferta
        const duplicateActive = existingReservations.find(
          (r) =>
            r.studentUid === caller.uid &&
            ((r.status === 'pending_payment' && !isReservationExpired(r, nowMs)) ||
              r.status === 'confirmed')
        );
        if (duplicateActive) {
          return {
            ok: false as const,
            status: 409,
            code: 'reservation/duplicate',
            error: 'Você já possui uma reserva ativa ou confirmada para esta turma.',
          };
        }

        // Previne reserva se aluno já possui matrícula ativa na turma acadêmica
        const classStudentSnap = await tx.get(
          adminDb.collection('classes').doc(offer.classId).collection('students').doc(caller.uid)
        );
        if (classStudentSnap?.exists && doesStatusOccupySeat(classStudentSnap.data()?.status)) {
          return {
            ok: false as const,
            status: 409,
            code: 'enrollment/already-enrolled',
            error: 'Você já está matriculado nesta turma.',
          };
        }

        const effectiveOffer: CommerceClassOffer = {
          ...offer,
          reservedSeats: effectiveReserved,
        };
        const availability = canOfferAcceptReservation(effectiveOffer, nowMs);
        if (!availability.allowed) {
          return {
            ok: false as const,
            status: 409,
            code: 'offer/unavailable',
            error: availability.reason || 'Não há vagas disponíveis para reserva nesta oferta.',
          };
        }

        for (const exp of expiredToRelease) {
          tx.set(adminDb.collection('class_reservations').doc(exp.reservationId), {
            ...exp,
            status: 'expired',
            updatedAt: nowIso,
          });
        }

        const reservationId = generatePhase3Id('res');
        const expiresAtMs = nowMs + ttlMs;
        const reservation: ClassReservation = {
          reservationId,
          offerId: offer.offerId,
          classId: offer.classId,
          studentUid: caller.uid,
          studentEmail: caller.email || null,
          orderId: null,
          priceId: offer.priceId,
          status: 'pending_payment',
          expiresAt: new Date(expiresAtMs).toISOString(),
          expiresAtMs,
          confirmedAt: null,
          cancelledAt: null,
          refundedAt: null,
          waitlistEntryId: null,
          idempotencyKey,
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        const updatedOffer: CommerceClassOffer = {
          ...effectiveOffer,
          reservedSeats: effectiveReserved + 1,
          updatedAt: nowIso,
        };

        tx.set(adminDb.collection('class_reservations').doc(reservationId), reservation);
        tx.set(offerRef, updatedOffer);

        return {
          ok: true as const,
          status: 201,
          idempotent: false,
          reservation,
          offer: updatedOffer,
        };
      });

      if (!txResult.ok) {
        return res.status(txResult.status).json({
          error: txResult.error,
          code: (txResult as any).code || 'reservation/rejected',
        });
      }

      if (!txResult.idempotent) {
        await recordAdminLog({
          eventType: 'commerce_reservation_updated',
          severity: 'info',
          actorUid: caller.uid,
          actorEmail: caller.email,
          actorRole: 'student',
          action: `Reserva temporária de vaga criada (${txResult.reservation.reservationId})`,
          details: `offerId=${offerId}, classId=${txResult.offer.classId}, status=pending_payment`,
        });
      }

      return res.status(txResult.status).json({
        status: 'ok',
        idempotent: txResult.idempotent,
        reservation: txResult.reservation,
        offer: txResult.offer,
      });
    } catch (err: any) {
      console.error('[Commerce Phase3] Erro ao criar reserva temporária:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível criar a reserva de vaga.' });
    }
  });

  // Público autenticado: inscrição em lista de espera (sem garantia nem ocupação automática de vaga)
  app.post('/api/commerce/waitlist', requireAuth, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Serviço comercial indisponível.',
        code: 'admin/credentials-unavailable',
      });
    }

    const offerId = String(req.body?.offerId || '').trim();
    if (!UID_REGEX.test(offerId)) {
      return res.status(400).json({ error: 'Oferta inválida para lista de espera.' });
    }

    try {
      const adminDb = getCommerceDb();
      const config = await loadCommerceConfigServerSide(adminDb);
      if (!config.commerceEnabled || !config.paidClassesEnabled) {
        return res.status(403).json({
          error: 'Turmas pagas e lista de espera estão desativadas na configuração global.',
          code: 'commerce/paid-classes-disabled',
        });
      }

      const nowMs = Date.now();
      const nowIso = new Date(nowMs).toISOString();

      const txResult = await adminDb.runTransaction(async (tx: any) => {
        const offerSnap = await tx.get(adminDb.collection('class_offers').doc(offerId));
        if (!offerSnap?.exists) {
          return { ok: false as const, status: 404, error: 'Oferta de turma não encontrada.' };
        }
        const offer = { offerId: offerSnap.id, ...(offerSnap.data() || {}) } as CommerceClassOffer;
        if (!offer.waitlistEnabled || offer.status === 'cancelled' || offer.status === 'closed') {
          return {
            ok: false as const,
            status: 400,
            error: 'A lista de espera não está habilitada para esta oferta.',
          };
        }

        const wlSnap = await tx.get(
          adminDb.collection('class_waitlist').where('offerId', '==', offerId).limit(500)
        );
        const existingEntries: ClassWaitlistEntry[] = (wlSnap?.docs || []).map(
          (d: any) => ({ waitlistId: d.id, ...(d.data() || {}) }) as ClassWaitlistEntry
        );

        const activeDup = existingEntries.find(
          (e) => e.studentUid === caller.uid && (e.status === 'waiting' || e.status === 'summoned')
        );
        if (activeDup) {
          return {
            ok: false as const,
            status: 409,
            error: 'Você já está inscrito na lista de espera desta oferta.',
          };
        }

        const maxPriority = existingEntries.reduce(
          (max, e) => (e.priorityOrder > max ? e.priorityOrder : max),
          0
        );
        const waitlistId = generatePhase3Id('wl');
        const entry: ClassWaitlistEntry = {
          waitlistId,
          offerId: offer.offerId,
          classId: offer.classId,
          studentUid: caller.uid,
          studentEmail: caller.email || null,
          joinedAt: nowIso,
          joinedAtMs: nowMs,
          priorityOrder: maxPriority + 1,
          status: 'waiting',
          summonedAt: null,
          summonedAtMs: null,
          responseDeadlineAt: null,
          responseDeadlineAtMs: null,
          convertedReservationId: null,
          history: [
            {
              status: 'waiting',
              at: nowIso,
              reason: 'Inscrição realizada na lista de espera.',
              actorUid: caller.uid,
            },
          ],
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        tx.set(adminDb.collection('class_waitlist').doc(waitlistId), entry);
        return { ok: true as const, status: 201, entry };
      });

      if (!txResult.ok) {
        return res.status(txResult.status).json({ error: txResult.error });
      }
      return res.status(201).json({ status: 'ok', waitlistEntry: txResult.entry });
    } catch (err: any) {
      console.error('[Commerce Phase3] Erro ao ingressar na lista de espera:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível registrar inscrição na lista de espera.' });
    }
  });

  // Público autenticado: criação de pedido com cálculo exclusivo no backend (ignora valores enviados pelo cliente)
  app.post('/api/commerce/orders', requireAuth, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Serviço comercial indisponível.',
        code: 'admin/credentials-unavailable',
      });
    }

    const body = req.body || {};
    const sensitiveCheck = assertNoSensitiveCardData(body);
    if (!sensitiveCheck.ok) {
      return res.status(400).json({
        error: `Dados sensíveis de cartão ("${sensitiveCheck.field}") não são permitidos.`,
        code: 'payment/sensitive-card-data-forbidden',
      });
    }

    const productId = String(body.productId || '').trim();
    const priceId = String(body.priceId || '').trim();
    const couponCode = body.couponCode ? normalizeCouponCode(String(body.couponCode)) : '';
    const reservationId = body.reservationId ? String(body.reservationId).trim() : null;
    const idempotencyKeyRaw = String(body.idempotencyKey || '').trim();
    const method = body.method ? String(body.method).trim().slice(0, 48) : 'pending_selection';

    if (!UID_REGEX.test(productId) || !UID_REGEX.test(priceId)) {
      return res.status(400).json({ error: 'Produto ou preço inválido para criação do pedido.' });
    }
    if (reservationId && !UID_REGEX.test(reservationId)) {
      return res.status(400).json({ error: 'Reserva informada é inválida.' });
    }

    try {
      const adminDb = getCommerceDb();
      const config = await loadCommerceConfigServerSide(adminDb);
      if (!config.commerceEnabled || !config.checkoutEnabled) {
        return res.status(403).json({
          error: 'Checkout comercial está desativado. Nenhum pedido pode ser iniciado.',
          code: 'commerce/checkout-disabled',
        });
      }

      const idempotencyKey =
        idempotencyKeyRaw && idempotencyKeyRaw.length <= 200
          ? `${caller.uid}:${idempotencyKeyRaw}`
          : `${caller.uid}:${productId}:${priceId}:${Date.now()}`;

      // Idempotência prévia por usuário + chave
      if (idempotencyKeyRaw) {
        const existingOrdersSnap = await adminDb
          .collection('orders')
          .where('studentUid', '==', caller.uid)
          .limit(200)
          .get();
        const existingOrderDoc = (existingOrdersSnap?.docs || []).find(
          (d: any) => d.data()?.idempotencyKey === idempotencyKey
        );
        if (existingOrderDoc) {
          const existingOrder = {
            orderId: existingOrderDoc.id,
            ...(existingOrderDoc.data() || {}),
          } as CommerceOrder;
          const paymentsSnap = await adminDb
            .collection('payments')
            .where('orderId', '==', existingOrder.orderId)
            .limit(10)
            .get();
          const existingPayment = paymentsSnap?.docs?.[0]
            ? ({
                paymentId: paymentsSnap.docs[0].id,
                ...(paymentsSnap.docs[0].data() || {}),
              } as CommercePayment)
            : null;
          return res.status(200).json({
            status: 'ok',
            idempotent: true,
            order: existingOrder,
            payment: existingPayment,
          });
        }
      }

      const [productSnap, priceSnap, promoSnap, enrollmentsSnap] = await Promise.all([
        adminDb.collection('products').doc(productId).get(),
        adminDb.collection('product_prices').doc(priceId).get(),
        couponCode ? adminDb.collection('promotions').limit(300).get() : Promise.resolve({ docs: [] }),
        adminDb.collection('enrollments').where('studentId', '==', caller.uid).limit(50).get(),
      ]);

      if (!productSnap?.exists || !priceSnap?.exists) {
        return res.status(404).json({ error: 'Produto ou preço não encontrado no catálogo.' });
      }

      const product = { productId: productSnap.id, ...(productSnap.data() || {}) } as CommerceProduct;
      const price = { priceId: priceSnap.id, ...(priceSnap.data() || {}) } as CommerceProductPrice;

      if (price.productId !== product.productId || price.status !== 'active' || product.status !== 'active') {
        return res.status(400).json({
          error: 'Produto ou versão de preço não está ativo ou não corresponde ao item selecionado.',
        });
      }

      const hasActiveClassEnrollment = (enrollmentsSnap?.docs || []).some((d: any) => {
        const s = String(d.data()?.status || '').toLowerCase();
        return s === 'active' || s === 'approved';
      });

      const nowMs = Date.now();
      const nowIso = new Date(nowMs).toISOString();

      let discountCents = 0;
      let promotionSnapshot: CommerceOrder['promotionSnapshot'] = null;
      let matchedPromo: CommercePromotion | null = null;

      if (couponCode) {
        const promotions: CommercePromotion[] = (promoSnap?.docs || []).map(
          (d: any) => ({ promotionId: d.id, ...(d.data() || {}) }) as CommercePromotion
        );
        matchedPromo =
          promotions.find((p) => normalizeCouponCode(p.code || '') === couponCode) || null;
        const evalResult = evaluateAndCalculateCoupon({
          code: couponCode,
          product,
          price,
          promotion: matchedPromo,
          config,
          studentUid: caller.uid,
          isNewStudent: !hasActiveClassEnrollment,
          hasActiveClassEnrollment,
          nowMs,
          allowAdminPreviewWhenDisabled: false,
        });
        if (!evalResult.valid) {
          return res.status(400).json({
            error: evalResult.message,
            code: evalResult.reason || 'coupon/invalid',
          });
        }
        discountCents = evalResult.discountAmountCents;
        promotionSnapshot = {
          promotionId: matchedPromo!.promotionId,
          code: matchedPromo!.code || couponCode,
          discountType: matchedPromo!.discountType,
          discountValue: matchedPromo!.discountValue,
          discountAmountCents: discountCents,
          evaluatedAt: nowIso,
        };
      }

      const subtotalCents = Math.round(price.amountCents);
      const totalCents = Math.max(0, subtotalCents - discountCents);
      const gateway = DisabledFailClosedGatewayProvider;

      const txResult = await adminDb.runTransaction(async (tx: any) => {
        let linkedReservation: ClassReservation | null = null;
        if (reservationId) {
          const resSnap = await tx.get(adminDb.collection('class_reservations').doc(reservationId));
          if (!resSnap?.exists) {
            return { ok: false as const, status: 404, error: 'Reserva informada não encontrada.' };
          }
          linkedReservation = {
            reservationId: resSnap.id,
            ...(resSnap.data() || {}),
          } as ClassReservation;
          if (linkedReservation.studentUid !== caller.uid) {
            return { ok: false as const, status: 403, error: 'Reserva não pertence ao usuário autenticado.' };
          }
          if (linkedReservation.status !== 'pending_payment' || isReservationExpired(linkedReservation, nowMs)) {
            return { ok: false as const, status: 409, error: 'A reserva informada expirou ou já foi processada.' };
          }
        }

        const orderId = generatePhase3Id('ord');
        const paymentId = generatePhase3Id('pay');
        const providerReference = `ref_${orderId}`;

        const order: CommerceOrder = {
          orderId,
          studentUid: caller.uid,
          studentEmail: caller.email || null,
          items: [
            {
              productId: product.productId,
              productName: product.name,
              productType: product.productType,
              courseIds: [...product.courseIds],
              priceId: price.priceId,
              priceVersion: price.version,
              billingInterval: price.billingInterval,
              quantity: 1,
              unitAmountCents: subtotalCents,
              totalAmountCents: subtotalCents,
              classOfferId: linkedReservation?.offerId ?? null,
            },
          ],
          subtotal: Number((subtotalCents / 100).toFixed(2)),
          subtotalCents,
          discount: Number((discountCents / 100).toFixed(2)),
          discountCents,
          total: Number((totalCents / 100).toFixed(2)),
          totalCents,
          currency: price.currency,
          status: 'pending',
          priceSnapshot: createAppliedPriceSnapshot({
            product,
            price,
            discountAmountCents: discountCents,
            promotionId: promotionSnapshot?.promotionId ?? null,
            couponCode: promotionSnapshot?.code ?? null,
            capturedAt: nowIso,
          }),
          promotionSnapshot,
          createdAt: nowIso,
          updatedAt: nowIso,
          providerReference,
          providerName: gateway.providerId,
          idempotencyKey,
          paidAt: null,
          refundedAt: null,
          refundedAmountCents: 0,
          reservationId: linkedReservation?.reservationId ?? null,
          subscriptionId: null,
          isHomologation: body.isHomologation === true,
        };

        const payment: CommercePayment = {
          paymentId,
          orderId,
          studentUid: caller.uid,
          provider: gateway.providerId,
          providerReference,
          method,
          amount: order.total,
          amountCents: order.totalCents,
          currency: order.currency,
          status: 'pending',
          idempotencyKey: `pay:${idempotencyKey}`,
          paidAt: null,
          refundedAmountCents: 0,
          failureReason: null,
          isHomologation: order.isHomologation,
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        tx.set(adminDb.collection('orders').doc(orderId), order);
        tx.set(adminDb.collection('payments').doc(paymentId), payment);
        if (linkedReservation) {
          tx.set(adminDb.collection('class_reservations').doc(linkedReservation.reservationId), {
            ...linkedReservation,
            orderId,
            updatedAt: nowIso,
          });
        }

        return { ok: true as const, order, payment };
      });

      if (!txResult.ok) {
        return res.status(txResult.status).json({ error: txResult.error });
      }

      await recordAdminLog({
        eventType: 'commerce_order_created',
        severity: 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'student',
        action: `Pedido comercial criado (${txResult.order.orderId})`,
        details: `totalCents=${txResult.order.totalCents}, currency=${txResult.order.currency}, product=${productId}`,
      });

      return res.status(201).json({
        status: 'ok',
        idempotent: false,
        order: txResult.order,
        payment: txResult.payment,
      });
    } catch (err: any) {
      console.error('[Commerce Phase3] Erro ao criar pedido:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível criar o pedido comercial.' });
    }
  });

  // Webhook Server-to-Server de Pagamentos: valida assinatura HMAC-SHA256, consistência e idempotência
  app.post('/api/commerce/webhooks/payment', async (req, res) => {
    const webhookSecret = deps.commerceWebhookSecret ?? process.env.COMMERCE_WEBHOOK_SECRET ?? '';
    const signatureHeader = String(
      req.headers['x-commerce-signature'] || req.headers['x-webhook-signature'] || ''
    );
    const rawBody =
      typeof (req as any).rawBody === 'string' && (req as any).rawBody.length > 0
        ? (req as any).rawBody
        : JSON.stringify(req.body || {});

    if (!webhookSecret || !verifyWebhookHmacSignature(rawBody, signatureHeader, webhookSecret)) {
      await recordAdminLog({
        eventType: 'commerce_payment_invalid',
        severity: 'critical',
        actorUid: 'webhook_unauthenticated',
        actorRole: 'unauthenticated',
        action: 'Webhook de pagamento rejeitado por assinatura inválida ou segredo ausente',
        details: `sigPresent=${Boolean(signatureHeader)}`,
      });
      return res.status(401).json({
        error: 'Assinatura HMAC de webhook inválida ou ausente.',
        code: 'webhook/invalid-signature',
      });
    }

    const body = req.body || {};
    const sensitiveCheck = assertNoSensitiveCardData(body);
    if (!sensitiveCheck.ok) {
      return res.status(400).json({
        error: `Payload contém dado sensível proibido ("${sensitiveCheck.field}").`,
        code: 'payment/sensitive-card-data-forbidden',
      });
    }

    if (!hasCommerceDbReady()) {
      return res.status(503).json({ error: 'Banco comercial indisponível.' });
    }

    const providerEventId = String(body.providerEventId || '').trim();
    const provider = String(body.provider || 'generic_webhook').trim().slice(0, 64);
    const eventType = String(body.eventType || '').trim();
    const orderId = String(body.orderId || '').trim();
    const paymentId = body.paymentId ? String(body.paymentId).trim() : '';
    const providerReference = String(body.providerReference || '').trim();
    const amountCents = Number(body.amountCents);
    const currency = String(body.currency || '').trim().toUpperCase();

    if (!UID_REGEX.test(providerEventId) || !UID_REGEX.test(orderId) || !eventType) {
      return res.status(400).json({ error: 'Campos obrigatórios de webhook ausentes ou inválidos.' });
    }

    const adminDb = getCommerceDb();
    const payloadDigest = computePayloadSha256Digest(rawBody);
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();

    try {
      const txResult = await adminDb.runTransaction(async (tx: any) => {
        const eventRef = adminDb.collection('payment_events').doc(providerEventId);
        const existingEventSnap = await tx.get(eventRef);
        if (existingEventSnap?.exists) {
          const existingData = existingEventSnap.data() as CommercePaymentEvent;
          if (existingData.processingStatus === 'processed') {
            return {
              httpStatus: 200,
              idempotent: true,
              processingStatus: 'ignored_duplicate' as const,
              event: existingData,
            };
          }
        }

        const orderRef = adminDb.collection('orders').doc(orderId);
        const orderSnap = await tx.get(orderRef);
        if (!orderSnap?.exists) {
          const rejectedEvent: CommercePaymentEvent = {
            eventId: providerEventId,
            provider,
            providerEventId,
            eventType,
            orderId,
            paymentId: paymentId || null,
            providerReference: providerReference || null,
            amountCents: Number.isFinite(amountCents) ? amountCents : null,
            currency: (currency as any) || null,
            signatureVerified: true,
            processingStatus: 'rejected',
            rejectionReason: 'order_not_found',
            payloadDigest,
            processedAt: nowIso,
            createdAt: nowIso,
          };
          tx.set(eventRef, rejectedEvent);
          return {
            httpStatus: 404,
            idempotent: false,
            processingStatus: 'rejected' as const,
            error: 'Pedido não encontrado.',
            event: rejectedEvent,
          };
        }

        const order = { orderId: orderSnap.id, ...(orderSnap.data() || {}) } as CommerceOrder;

        let targetPayment: CommercePayment | null = null;
        if (paymentId) {
          const paySnap = await tx.get(adminDb.collection('payments').doc(paymentId));
          if (paySnap?.exists) {
            targetPayment = { paymentId: paySnap.id, ...(paySnap.data() || {}) } as CommercePayment;
          }
        } else {
          const payListSnap = await tx.get(
            adminDb.collection('payments').where('orderId', '==', order.orderId).limit(5)
          );
          if (payListSnap?.docs?.[0]) {
            targetPayment = {
              paymentId: payListSnap.docs[0].id,
              ...(payListSnap.docs[0].data() || {}),
            } as CommercePayment;
          }
        }

        if (!targetPayment) {
          const rejectedEvent: CommercePaymentEvent = {
            eventId: providerEventId,
            provider,
            providerEventId,
            eventType,
            orderId: order.orderId,
            paymentId: paymentId || null,
            providerReference: providerReference || null,
            amountCents: Number.isFinite(amountCents) ? amountCents : null,
            currency: (currency as any) || null,
            signatureVerified: true,
            processingStatus: 'rejected',
            rejectionReason: 'payment_not_found',
            payloadDigest,
            processedAt: nowIso,
            createdAt: nowIso,
          };
          tx.set(eventRef, rejectedEvent);
          return {
            httpStatus: 404,
            idempotent: false,
            processingStatus: 'rejected' as const,
            error: 'Registro de pagamento não encontrado para este pedido.',
            event: rejectedEvent,
          };
        }

        const consistency =
          order.providerReference && providerReference !== order.providerReference
            ? {
                valid: false as const,
                reason: 'Referência do provedor no webhook ausente ou divergente do pedido.',
              }
            : validateWebhookPaymentConsistency({
                order,
                event: {
                  provider,
                  providerEventId,
                  eventType: eventType as any,
                  orderId: order.orderId,
                  providerReference,
                  amountCents,
                  currency: currency as any,
                  refundedAmountCents:
                    typeof body.refundedAmountCents === 'number'
                      ? body.refundedAmountCents
                      : amountCents,
                  occurredAt: String(body.occurredAt || nowIso),
                  failureReason: body.failureReason ? String(body.failureReason) : null,
                },
              });

        if (!consistency.valid) {
          const rejectedEvent: CommercePaymentEvent = {
            eventId: providerEventId,
            provider,
            providerEventId,
            eventType,
            orderId: order.orderId,
            paymentId: targetPayment.paymentId,
            providerReference,
            amountCents: Number.isFinite(amountCents) ? amountCents : null,
            currency: (currency as any) || null,
            signatureVerified: true,
            processingStatus: 'rejected',
            rejectionReason: consistency.reason || 'inconsistent_payment_payload',
            payloadDigest,
            processedAt: nowIso,
            createdAt: nowIso,
          };
          tx.set(eventRef, rejectedEvent);
          return {
            httpStatus: 400,
            idempotent: false,
            processingStatus: 'rejected' as const,
            error: consistency.reason || 'Inconsistência de valor, moeda ou referência no webhook.',
            event: rejectedEvent,
          };
        }

        // Pre-leituras necessárias na transação antes de qualquer escrita
        let promoRef: any = null;
        let promoData: CommercePromotion | null = null;
        if (eventType === 'payment.paid' && order.promotionSnapshot?.promotionId) {
          promoRef = adminDb.collection('promotions').doc(order.promotionSnapshot.promotionId);
          const pSnap = await tx.get(promoRef);
          if (pSnap?.exists) {
            promoData = { promotionId: pSnap.id, ...(pSnap.data() || {}) } as CommercePromotion;
          }
        }

        let reservationRef: any = null;
        let reservationData: ClassReservation | null = null;
        let offerRef: any = null;
        let offerData: CommerceClassOffer | null = null;
        let classRef: any = null;
        let classData: Record<string, any> | null = null;
        let classStudentRef: any = null;
        let classStudentSnap: any = null;
        let enrollmentRef: any = null;
        let enrollmentSnap: any = null;

        if (order.reservationId) {
          reservationRef = adminDb.collection('class_reservations').doc(order.reservationId);
          const rSnap = await tx.get(reservationRef);
          if (rSnap?.exists) {
            reservationData = { reservationId: rSnap.id, ...(rSnap.data() || {}) } as ClassReservation;
            offerRef = adminDb.collection('class_offers').doc(reservationData.offerId);
            const oSnap = await tx.get(offerRef);
            if (oSnap?.exists) {
              offerData = { offerId: oSnap.id, ...(oSnap.data() || {}) } as CommerceClassOffer;
            }
            classRef = adminDb.collection('classes').doc(reservationData.classId);
            const cSnap = await tx.get(classRef);
            if (cSnap?.exists) {
              classData = cSnap.data() || {};
            }
            classStudentRef = classRef.collection('students').doc(order.studentUid);
            classStudentSnap = await tx.get(classStudentRef);
            const enrollmentId = `enroll-${reservationData.classId}-${order.studentUid}`;
            enrollmentRef = adminDb.collection('enrollments').doc(enrollmentId);
            enrollmentSnap = await tx.get(enrollmentRef);
          }
        }

        const primaryItem = order.items[0];
        const entitlementId = `ent_${order.orderId}`;
        const entitlementRef = adminDb.collection('commerce_entitlements').doc(entitlementId);
        const existingEntitlementSnap = await tx.get(entitlementRef);

        const isSubscriptionItem =
          primaryItem?.productType === 'subscription_plan' ||
          primaryItem?.billingInterval === 'monthly' ||
          primaryItem?.billingInterval === 'semiannual' ||
          primaryItem?.billingInterval === 'annual';
        const subscriptionId = `sub_${order.studentUid}_${primaryItem?.productId || order.orderId}`;
        const subscriptionRef = adminDb.collection('subscriptions').doc(subscriptionId);
        const existingSubSnap = isSubscriptionItem ? await tx.get(subscriptionRef) : null;

        if (eventType === 'payment.paid') {
          const updatedPayment: CommercePayment = {
            ...targetPayment,
            status: 'paid',
            paidAt: nowIso,
            updatedAt: nowIso,
          };
          const updatedOrder: CommerceOrder = {
            ...order,
            status: 'paid',
            paidAt: nowIso,
            subscriptionId: isSubscriptionItem ? subscriptionId : order.subscriptionId ?? null,
            updatedAt: nowIso,
          };
          tx.set(adminDb.collection('payments').doc(targetPayment.paymentId), updatedPayment);
          tx.set(orderRef, updatedOrder);

          if (promoRef && promoData) {
            tx.set(promoRef, {
              ...promoData,
              redeemedCount: (promoData.redeemedCount || 0) + 1,
              updatedAt: nowIso,
            });
          }

          if (reservationRef && reservationData) {
            const wasPending = reservationData.status === 'pending_payment';
            tx.set(reservationRef, {
              ...reservationData,
              status: 'confirmed',
              confirmedAt: nowIso,
              updatedAt: nowIso,
            });
            if (offerRef && offerData && wasPending) {
              tx.set(offerRef, {
                ...offerData,
                reservedSeats: Math.max(0, (offerData.reservedSeats || 0) - 1),
                confirmedSeats: (offerData.confirmedSeats || 0) + 1,
                updatedAt: nowIso,
              });
            }
            // Somente após pagamento confirmado criamos a matrícula acadêmica real 1-para-1
            if (classRef && classData && classStudentRef && enrollmentRef) {
              const alreadyEnrolled =
                (classStudentSnap?.exists && doesStatusOccupySeat(classStudentSnap.data()?.status)) ||
                (enrollmentSnap?.exists && doesStatusOccupySeat(enrollmentSnap.data()?.status));
              const enrollmentId = `enroll-${reservationData.classId}-${order.studentUid}`;
              const studentPayload = {
                uid: order.studentUid,
                studentId: order.studentUid,
                studentName: order.studentEmail || 'Aluno Guitar Academy',
                studentEmail: order.studentEmail || '',
                teacherId: classData.teacherId || 'admin',
                classId: reservationData.classId,
                courseId: classData.courseId || primaryItem?.courseIds?.[0] || 'violao',
                status: 'active',
                joinedAt: nowIso,
                updatedAt: nowIso,
                orderId: order.orderId,
                reservationId: reservationData.reservationId,
              };
              const enrollmentPayload = {
                id: enrollmentId,
                classId: reservationData.classId,
                studentId: order.studentUid,
                studentName: studentPayload.studentName,
                studentEmail: studentPayload.studentEmail,
                teacherId: studentPayload.teacherId,
                courseId: studentPayload.courseId,
                status: 'active',
                joinedAt: nowIso,
                updatedAt: nowIso,
                orderId: order.orderId,
              };
              tx.set(classStudentRef, studentPayload);
              tx.set(enrollmentRef, enrollmentPayload);
              if (!alreadyEnrolled) {
                const currentCount = isValidatedEnrolledCount(classData.enrolledCount)
                  ? Number(classData.enrolledCount)
                  : 0;
                tx.set(classRef, {
                  ...classData,
                  enrolledCount: currentCount + 1,
                  updatedAt: nowIso,
                });
              }
            }
          }

          if (primaryItem) {
            const periodDays =
              primaryItem.billingInterval === 'annual'
                ? 365
                : primaryItem.billingInterval === 'semiannual'
                ? 180
                : primaryItem.billingInterval === 'monthly'
                ? 30
                : null;
            const periodEndIso = periodDays
              ? new Date(nowMs + periodDays * 24 * 60 * 60 * 1000).toISOString()
              : new Date(nowMs + 30 * 24 * 60 * 60 * 1000).toISOString();

            const entitlement: CommerceEntitlementRecord = {
              entitlementId,
              studentUid: order.studentUid,
              type: isSubscriptionItem ? 'subscription' : 'purchase',
              sourceId: isSubscriptionItem ? subscriptionId : order.orderId,
              orderId: order.orderId,
              productId: primaryItem.productId,
              courseIds: [...primaryItem.courseIds],
              status: 'active',
              expiresAt: periodDays ? periodEndIso : null,
              expiresAtMs: periodDays ? Date.parse(periodEndIso) : null,
              createdAt: nowIso,
              updatedAt: nowIso,
            };
            tx.set(entitlementRef, entitlement);

            if (isSubscriptionItem) {
              const prevSub = existingSubSnap?.exists
                ? ({ subscriptionId, ...(existingSubSnap.data() || {}) } as CommerceSubscription)
                : null;
              const nextSub: CommerceSubscription = {
                subscriptionId,
                studentUid: order.studentUid,
                studentEmail: order.studentEmail || null,
                productId: primaryItem.productId,
                priceId: primaryItem.priceId,
                courseIds: [...primaryItem.courseIds],
                billingInterval: primaryItem.billingInterval,
                amountCents: order.totalCents,
                currency: order.currency,
                status: 'active',
                startedAt: prevSub?.startedAt || nowIso,
                currentPeriodStartAt: nowIso,
                currentPeriodEndAt: periodEndIso,
                nextRenewalAt: periodEndIso,
                expiresAt: periodEndIso,
                expiresAtMs: Date.parse(periodEndIso),
                pausedAt: null,
                cancelledAt: null,
                cancelReason: null,
                billingHistory: [
                  ...(prevSub?.billingHistory || []),
                  {
                    entryId: `bill_${order.orderId}`,
                    orderId: order.orderId,
                    paymentId: targetPayment.paymentId,
                    amountCents: order.totalCents,
                    currency: order.currency,
                    status: 'paid',
                    date: nowIso,
                    note: 'Pagamento confirmado via webhook',
                  },
                ],
                entitlementId,
                isHomologation: order.isHomologation,
                createdAt: prevSub?.createdAt || nowIso,
                updatedAt: nowIso,
              };
              tx.set(subscriptionRef, nextSub);
            }
          }
        } else if (eventType === 'payment.refunded' || eventType === 'payment.partially_refunded') {
          const isFullRefund = eventType === 'payment.refunded' || amountCents >= order.totalCents;
          const nextOrderStatus = isFullRefund ? 'refunded' : 'partially_refunded';
          const updatedPayment: CommercePayment = {
            ...targetPayment,
            status: nextOrderStatus,
            refundedAmountCents: isFullRefund ? order.totalCents : amountCents,
            updatedAt: nowIso,
          };
          const updatedOrder: CommerceOrder = {
            ...order,
            status: nextOrderStatus,
            refundedAt: nowIso,
            refundedAmountCents: isFullRefund ? order.totalCents : amountCents,
            updatedAt: nowIso,
          };
          tx.set(adminDb.collection('payments').doc(targetPayment.paymentId), updatedPayment);
          tx.set(orderRef, updatedOrder);

          if (isFullRefund) {
            // Revoga EXCLUSIVAMENTE o acesso comercial (commerce_entitlements), nunca course_access_grants nem progresso acadêmico
            if (existingEntitlementSnap?.exists) {
              const ent = existingEntitlementSnap.data() as CommerceEntitlementRecord;
              tx.set(entitlementRef, {
                ...ent,
                status: 'revoked',
                updatedAt: nowIso,
              });
            }
            if (reservationRef && reservationData) {
              const wasConfirmed = reservationData.status === 'confirmed';
              const wasPending = reservationData.status === 'pending_payment';
              tx.set(reservationRef, {
                ...reservationData,
                status: 'refunded',
                refundedAt: nowIso,
                updatedAt: nowIso,
              });
              if (offerRef && offerData) {
                tx.set(offerRef, {
                  ...offerData,
                  reservedSeats: wasPending
                    ? Math.max(0, (offerData.reservedSeats || 0) - 1)
                    : offerData.reservedSeats || 0,
                  confirmedSeats: wasConfirmed
                    ? Math.max(0, (offerData.confirmedSeats || 0) - 1)
                    : offerData.confirmedSeats || 0,
                  updatedAt: nowIso,
                });
              }
            }
          }
        } else if (eventType === 'payment.failed') {
          tx.set(adminDb.collection('payments').doc(targetPayment.paymentId), {
            ...targetPayment,
            status: 'failed',
            failureReason: body.failureReason ? String(body.failureReason).slice(0, 300) : 'payment_failed',
            updatedAt: nowIso,
          });
          tx.set(orderRef, {
            ...order,
            status: 'failed',
            updatedAt: nowIso,
          });
          if (reservationRef && reservationData && reservationData.status === 'pending_payment') {
            tx.set(reservationRef, {
              ...reservationData,
              status: 'cancelled',
              cancelledAt: nowIso,
              updatedAt: nowIso,
            });
            if (offerRef && offerData) {
              tx.set(offerRef, {
                ...offerData,
                reservedSeats: Math.max(0, (offerData.reservedSeats || 0) - 1),
                updatedAt: nowIso,
              });
            }
          }
        }

        const processedEvent: CommercePaymentEvent = {
          eventId: providerEventId,
          provider,
          providerEventId,
          eventType,
          orderId: order.orderId,
          paymentId: targetPayment.paymentId,
          providerReference,
          amountCents,
          currency: currency as any,
          signatureVerified: true,
          processingStatus: 'processed',
          rejectionReason: null,
          payloadDigest,
          processedAt: nowIso,
          createdAt: nowIso,
        };
        tx.set(eventRef, processedEvent);

        return {
          httpStatus: 200,
          idempotent: false,
          processingStatus: 'processed' as const,
          event: processedEvent,
        };
      });

      if (txResult.processingStatus === 'rejected') {
        await recordAdminLog({
          eventType: 'commerce_payment_invalid',
          severity: 'warning',
          actorUid: 'webhook_verified',
          actorRole: 'unauthenticated',
          action: `Evento webhook rejeitado (${providerEventId})`,
          details: (txResult as any).error || 'rejected',
        });
        return res.status(txResult.httpStatus).json({
          error: (txResult as any).error,
          processingStatus: 'rejected',
        });
      }

      if (!txResult.idempotent) {
        const logType =
          eventType === 'payment.refunded' || eventType === 'payment.partially_refunded'
            ? 'commerce_payment_refunded'
            : eventType === 'payment.paid'
            ? 'commerce_payment_confirmed'
            : 'commerce_payment_invalid';
        await recordAdminLog({
          eventType: logType,
          severity: 'info',
          actorUid: 'webhook_verified',
          actorRole: 'unauthenticated',
          action: `Webhook processado (${eventType}) para pedido ${orderId}`,
          details: `providerEventId=${providerEventId}, amountCents=${amountCents}`,
        });
      }

      return res.status(200).json({
        status: 'ok',
        idempotent: txResult.idempotent,
        processingStatus: txResult.processingStatus,
        event: txResult.event,
      });
    } catch (err: any) {
      console.error('[Commerce Webhook] Erro ao processar evento:', err?.message || err);
      return res.status(500).json({ error: 'Falha interna ao processar webhook de pagamento.' });
    }
  });

  // Admin: visão operacional completa da Fase 3
  app.get('/api/admin/commerce/phase3/overview', requireAuth, requireCommerceAdmin, async (_req, res) => {
    if (!hasCommerceDbReady()) {
      return res.status(503).json({
        error: 'Credenciais administrativas indisponíveis.',
        code: 'admin/credentials-unavailable',
      });
    }

    try {
      const adminDb = getCommerceDb();
      const [
        adsSnap,
        offersSnap,
        resSnap,
        wlSnap,
        ordersSnap,
        paymentsSnap,
        eventsSnap,
        subsSnap,
        entSnap,
        adjSnap,
        classesSnap,
      ] = await Promise.all([
        adminDb.collection('advertisements').limit(200).get(),
        adminDb.collection('class_offers').limit(200).get(),
        adminDb.collection('class_reservations').limit(500).get(),
        adminDb.collection('class_waitlist').limit(500).get(),
        adminDb.collection('orders').limit(500).get(),
        adminDb.collection('payments').limit(500).get(),
        adminDb.collection('payment_events').limit(500).get(),
        adminDb.collection('subscriptions').limit(500).get(),
        adminDb.collection('commerce_entitlements').limit(500).get(),
        adminDb.collection('financial_adjustments').limit(500).get(),
        adminDb.collection('classes').limit(200).get(),
      ]);

      return res.json({
        status: 'ok',
        advertisements: (adsSnap?.docs || []).map((d: any) => ({ advertisementId: d.id, ...(d.data() || {}) })),
        classOffers: (offersSnap?.docs || []).map((d: any) => ({ offerId: d.id, ...(d.data() || {}) })),
        reservations: (resSnap?.docs || []).map((d: any) => ({ reservationId: d.id, ...(d.data() || {}) })),
        waitlist: (wlSnap?.docs || []).map((d: any) => ({ waitlistId: d.id, ...(d.data() || {}) })),
        orders: (ordersSnap?.docs || []).map((d: any) => ({ orderId: d.id, ...(d.data() || {}) })),
        payments: (paymentsSnap?.docs || []).map((d: any) => ({ paymentId: d.id, ...(d.data() || {}) })),
        paymentEvents: (eventsSnap?.docs || []).map((d: any) => ({ eventId: d.id, ...(d.data() || {}) })),
        subscriptions: (subsSnap?.docs || []).map((d: any) => ({ subscriptionId: d.id, ...(d.data() || {}) })),
        entitlements: (entSnap?.docs || []).map((d: any) => ({ entitlementId: d.id, ...(d.data() || {}) })),
        adjustments: (adjSnap?.docs || []).map((d: any) => ({ adjustmentId: d.id, ...(d.data() || {}) })),
        availableClasses: (classesSnap?.docs || []).map((d: any) => {
          const data = d.data() || {};
          return {
            id: d.id,
            name: String(data.name || 'Turma sem nome'),
            courseId: data.courseId,
            teacherName: data.teacherName,
            maxStudents: typeof data.maxStudents === 'number' ? data.maxStudents : undefined,
            enrolledCount: typeof data.enrolledCount === 'number' ? data.enrolledCount : undefined,
            active: data.active !== false,
          };
        }),
        mode: 'backend_admin_sdk',
      });
    } catch (err: any) {
      console.error('[Admin Phase3] Erro ao carregar overview:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível carregar dados da Fase 3.' });
    }
  });

  // Admin: criar campanha publicitária
  app.post('/api/admin/commerce/advertisements', requireAuth, requireCommerceAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
    }

    const validation = validateAdvertisementCreateInput(req.body || {});
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const nowIso = new Date().toISOString();
    const advertisementId = generatePhase3Id('ad');
    const ad: CommerceAdvertisement = {
      advertisementId,
      title: validation.data.title,
      subtitle: validation.data.subtitle,
      description: validation.data.description,
      ctaText: validation.data.ctaText,
      ctaDestination: validation.data.ctaDestination,
      productId: validation.data.productId,
      targetAudience: validation.data.targetAudience,
      eligibleStudentUids: validation.data.eligibleStudentUids,
      position: validation.data.position,
      imageUrl: null,
      storagePath: null,
      imageMimeType: null,
      imageSizeBytes: null,
      imageVersion: 0,
      previousStoragePaths: [],
      startsAt: validation.data.startsAt,
      startsAtMs: validation.data.startsAtMs,
      endsAt: validation.data.endsAt,
      endsAtMs: validation.data.endsAtMs,
      status: validation.data.status,
      isHomologation: req.body?.isHomologation === true,
      createdBy: caller.uid,
      createdByEmail: caller.email || null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    try {
      const adminDb = getCommerceDb();
      await adminDb.collection('advertisements').doc(advertisementId).set(ad);
      await recordAdminLog({
        eventType: 'commerce_advertisement_created',
        severity: 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        action: `Campanha publicitária criada: ${ad.title}`,
        details: `advertisementId=${advertisementId}, position=${ad.position}, status=${ad.status}`,
      });
      return res.status(201).json({ status: 'ok', advertisement: ad });
    } catch (err: any) {
      console.error('[Admin Phase3] Erro ao criar campanha:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível criar a campanha.' });
    }
  });

  // Admin: atualizar campanha publicitária (ativar, pausar, arquivar, editar textos/datas)
  app.patch('/api/admin/commerce/advertisements/:advertisementId', requireAuth, requireCommerceAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null };
    const advertisementId = String(req.params.advertisementId || '').trim();
    if (!UID_REGEX.test(advertisementId)) {
      return res.status(400).json({ error: 'Identificador de anúncio inválido.' });
    }
    if (!hasCommerceDbReady()) {
      return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
    }

    try {
      const adminDb = getCommerceDb();
      const ref = adminDb.collection('advertisements').doc(advertisementId);
      const snap = await ref.get();
      if (!snap?.exists) {
        return res.status(404).json({ error: 'Campanha não encontrada.' });
      }
      const existing = { advertisementId: snap.id, ...(snap.data() || {}) } as CommerceAdvertisement;
      const validated = validateAdvertisementUpdateInput(existing, req.body || {});
      if (!validated.valid) {
        return res.status(400).json({ error: validated.error });
      }
      const updated: CommerceAdvertisement = {
        ...validated.nextAdvertisement,
        updatedAt: new Date().toISOString(),
      };
      await ref.set(updated);
      await recordAdminLog({
        eventType: 'commerce_advertisement_updated',
        severity: 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        action: `Campanha atualizada (${updated.title}) para status "${updated.status}"`,
        details: `advertisementId=${advertisementId}, position=${updated.position}`,
      });
      return res.json({ status: 'ok', advertisement: updated });
    } catch (err: any) {
      console.error('[Admin Phase3] Erro ao atualizar campanha:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível atualizar a campanha.' });
    }
  });

  // Admin: upload seguro de banner para Firebase Storage (preserva versões anteriores em previousStoragePaths)
  app.post(
    '/api/admin/commerce/advertisements/:advertisementId/upload',
    requireAuth,
    requireCommerceAdmin,
    async (req, res) => {
      const caller = (req as any).user as { uid: string; email?: string | null };
      const advertisementId = String(req.params.advertisementId || '').trim();
      if (!UID_REGEX.test(advertisementId)) {
        return res.status(400).json({ error: 'Identificador de campanha inválido.' });
      }
      if (!hasCommerceDbReady()) {
        return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
      }

      const body = req.body || {};
      const fileName = String(body.fileName || 'banner.webp').trim();
      const mimeType = String(body.mimeType || '').trim().toLowerCase();
      const base64Raw = String(body.fileDataBase64 || '').trim();
      const cleanedBase64 = base64Raw.includes('base64,') ? base64Raw.split('base64,')[1] : base64Raw;

      if (!cleanedBase64) {
        return res.status(400).json({ error: 'Conteúdo da imagem não enviado.' });
      }

      const fileBuffer = Buffer.from(cleanedBase64, 'base64');

      try {
        const adminDb = getCommerceDb();
        const ref = adminDb.collection('advertisements').doc(advertisementId);
        const snap = await ref.get();
        if (!snap?.exists) {
          return res.status(404).json({ error: 'Campanha não encontrada.' });
        }

        const existing = { advertisementId: snap.id, ...(snap.data() || {}) } as CommerceAdvertisement;
        const nextVersion = (existing.imageVersion || 0) + 1;
        const uploadValidation = validateBannerFileUpload({
          advertisementId,
          fileName,
          mimeType,
          sizeBytes: fileBuffer.byteLength,
          bytes: fileBuffer.subarray(0, 16),
          nextVersion,
        });

        if (!uploadValidation.valid) {
          return res.status(400).json({ error: uploadValidation.error });
        }

        const { storagePath: validatedStoragePath, mimeType: validatedMimeType } =
          uploadValidation.data;
        const canonicalFileName = validatedStoragePath.split('/').pop() || 'banner.webp';

        let uploadedResult: { imageUrl: string; storagePath: string };
        if (deps.adminStorageForCommerce) {
          uploadedResult = await deps.adminStorageForCommerce.uploadBanner({
            advertisementId,
            storagePath: validatedStoragePath,
            buffer: fileBuffer,
            mimeType: validatedMimeType,
            fileName: canonicalFileName,
            version: nextVersion,
          });
        } else {
          const bucket = getStorage().bucket(STORAGE_BUCKET);
          const fileRef = bucket.file(validatedStoragePath);
          const token = generatePhase3Id('tok');
          await fileRef.save(fileBuffer, {
            resumable: false,
            contentType: validatedMimeType,
            metadata: {
              cacheControl: 'public, max-age=31536000',
              metadata: {
                firebaseStorageDownloadTokens: token,
                uploadedBy: caller.uid,
                advertisementId,
                version: String(nextVersion),
              },
            },
          });
          const encodedPath = encodeURIComponent(validatedStoragePath);
          uploadedResult = {
            storagePath: validatedStoragePath,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodedPath}?alt=media&token=${token}`,
          };
        }

        const previousPaths = Array.isArray(existing.previousStoragePaths)
          ? [...existing.previousStoragePaths]
          : [];
        if (existing.storagePath && !previousPaths.includes(existing.storagePath)) {
          previousPaths.push(existing.storagePath);
        }

        const nowIso = new Date().toISOString();
        const updatedAd: CommerceAdvertisement = {
          ...existing,
          imageUrl: uploadedResult.imageUrl,
          storagePath: uploadedResult.storagePath,
          imageMimeType: validatedMimeType,
          imageSizeBytes: fileBuffer.byteLength,
          imageVersion: nextVersion,
          previousStoragePaths: previousPaths,
          updatedAt: nowIso,
        };
        await ref.set(updatedAd);

        await recordAdminLog({
          eventType: 'commerce_advertisement_image_uploaded',
          severity: 'info',
          actorUid: caller.uid,
          actorEmail: caller.email,
          actorRole: 'admin',
          action: `Imagem de campanha v${nextVersion} enviada (${canonicalFileName})`,
          details: `advertisementId=${advertisementId}, storagePath=${uploadedResult.storagePath}, size=${fileBuffer.byteLength}`,
        });

        return res.json({ status: 'ok', advertisement: updatedAd });
      } catch (err: any) {
        console.error('[Admin Phase3] Erro no upload de banner:', err?.message || err);
        return res.status(500).json({ error: 'Não foi possível enviar a imagem da campanha.' });
      }
    }
  );

  // Admin: criar oferta comercial vinculada a turma existente (sem duplicar ou recriar classes)
  app.post('/api/admin/commerce/class-offers', requireAuth, requireCommerceAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
    }

    const validation = validateClassOfferCreateInput(req.body || {});
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    try {
      const adminDb = getCommerceDb();
      const [classSnap, productSnap, priceSnap] = await Promise.all([
        adminDb.collection('classes').doc(validation.data.classId).get(),
        adminDb.collection('products').doc(validation.data.productId).get(),
        adminDb.collection('product_prices').doc(validation.data.priceId).get(),
      ]);

      if (!classSnap?.exists) {
        return res.status(404).json({
          error: 'Turma acadêmica informada não existe. A oferta comercial deve usar uma turma já cadastrada.',
        });
      }
      if (!productSnap?.exists || !priceSnap?.exists) {
        return res.status(404).json({ error: 'Produto ou preço informado não encontrado.' });
      }

      const classData = classSnap.data() || {};
      const nowIso = new Date().toISOString();
      const offerId = generatePhase3Id('offer');
      const offer: CommerceClassOffer = {
        offerId,
        classId: validation.data.classId,
        className: String(classData.name || 'Turma Guitar Academy'),
        productId: validation.data.productId,
        priceId: validation.data.priceId,
        capacity: validation.data.capacity,
        reservedSeats: 0,
        confirmedSeats: 0,
        registrationStartsAt: validation.data.registrationStartsAt,
        registrationStartsAtMs: validation.data.registrationStartsAtMs,
        registrationEndsAt: validation.data.registrationEndsAt,
        registrationEndsAtMs: validation.data.registrationEndsAtMs,
        status: validation.data.status,
        waitlistEnabled: validation.data.waitlistEnabled,
        createdBy: caller.uid,
        createdByEmail: caller.email || null,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      await adminDb.collection('class_offers').doc(offerId).set(offer);
      await recordAdminLog({
        eventType: 'commerce_class_offer_created',
        severity: 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        action: `Oferta comercial criada para turma "${offer.className}"`,
        details: `offerId=${offerId}, classId=${offer.classId}, capacity=${offer.capacity}`,
      });

      return res.status(201).json({ status: 'ok', offer });
    } catch (err: any) {
      console.error('[Admin Phase3] Erro ao criar oferta de turma:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível criar a oferta comercial de turma.' });
    }
  });

  // Admin: atualizar oferta comercial de turma
  app.patch('/api/admin/commerce/class-offers/:offerId', requireAuth, requireCommerceAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null };
    const offerId = String(req.params.offerId || '').trim();
    if (!UID_REGEX.test(offerId)) {
      return res.status(400).json({ error: 'Identificador de oferta inválido.' });
    }
    if (!hasCommerceDbReady()) {
      return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
    }

    try {
      const adminDb = getCommerceDb();
      const ref = adminDb.collection('class_offers').doc(offerId);
      const snap = await ref.get();
      if (!snap?.exists) {
        return res.status(404).json({ error: 'Oferta de turma não encontrada.' });
      }
      const existing = { offerId: snap.id, ...(snap.data() || {}) } as CommerceClassOffer;
      const validated = validateClassOfferUpdateInput(existing, req.body || {});
      if (!validated.valid) {
        return res.status(400).json({ error: validated.error });
      }
      const nextOffer: CommerceClassOffer = {
        ...validated.nextOffer,
        updatedAt: new Date().toISOString(),
      };
      await ref.set(nextOffer);
      await recordAdminLog({
        eventType: 'commerce_class_offer_updated',
        severity: 'info',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        action: `Oferta de turma atualizada (${offerId})`,
        details: `status=${nextOffer.status}, capacity=${nextOffer.capacity}, waitlist=${nextOffer.waitlistEnabled}`,
      });
      return res.json({ status: 'ok', offer: nextOffer });
    } catch (err: any) {
      console.error('[Admin Phase3] Erro ao atualizar oferta:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível atualizar a oferta de turma.' });
    }
  });

  // Admin: expirar reservas pendentes vencidas e liberar vagas reservadas
  app.post(
    '/api/admin/commerce/class-offers/:offerId/expire-reservations',
    requireAuth,
    requireCommerceAdmin,
    async (req, res) => {
      const caller = (req as any).user as { uid: string; email?: string | null };
      const offerId = String(req.params.offerId || '').trim();
      if (!UID_REGEX.test(offerId)) {
        return res.status(400).json({ error: 'Oferta inválida.' });
      }
      if (!hasCommerceDbReady()) {
        return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
      }

      const nowMs =
        typeof req.body?.nowMs === 'number' && Number.isFinite(req.body.nowMs)
          ? req.body.nowMs
          : Date.now();
      const nowIso = new Date().toISOString();

      try {
        const adminDb = getCommerceDb();
        const txResult = await adminDb.runTransaction(async (tx: any) => {
          const offerRef = adminDb.collection('class_offers').doc(offerId);
          const offerSnap = await tx.get(offerRef);
          if (!offerSnap?.exists) {
            return { notFound: true as const };
          }
          const offer = { offerId: offerSnap.id, ...(offerSnap.data() || {}) } as CommerceClassOffer;
          const resSnap = await tx.get(
            adminDb.collection('class_reservations').where('offerId', '==', offerId).limit(500)
          );
          const reservations: ClassReservation[] = (resSnap?.docs || []).map(
            (d: any) => ({ reservationId: d.id, ...(d.data() || {}) }) as ClassReservation
          );

          let expiredCount = 0;
          for (const r of reservations) {
            if (r.status === 'pending_payment' && isReservationExpired(r, nowMs)) {
              expiredCount += 1;
              tx.set(adminDb.collection('class_reservations').doc(r.reservationId), {
                ...r,
                status: 'expired',
                updatedAt: nowIso,
              });
            }
          }

          const updatedOffer: CommerceClassOffer = {
            ...offer,
            reservedSeats: Math.max(0, (offer.reservedSeats || 0) - expiredCount),
            updatedAt: nowIso,
          };
          tx.set(offerRef, updatedOffer);

          return { notFound: false as const, expiredCount, offer: updatedOffer };
        });

        if (txResult.notFound) {
          return res.status(404).json({ error: 'Oferta não encontrada.' });
        }

        if (txResult.expiredCount > 0) {
          await recordAdminLog({
            eventType: 'commerce_reservation_updated',
            severity: 'info',
            actorUid: caller.uid,
            actorEmail: caller.email,
            actorRole: 'admin',
            action: `${txResult.expiredCount} reserva(s) vencida(s) expirada(s) e vaga(s) liberada(s)`,
            details: `offerId=${offerId}`,
          });
        }

        return res.json({
          status: 'ok',
          expiredCount: txResult.expiredCount,
          offer: txResult.offer,
        });
      } catch (err: any) {
        console.error('[Admin Phase3] Erro ao expirar reservas:', err?.message || err);
        return res.status(500).json({ error: 'Não foi possível reconciliar reservas expiradas.' });
      }
    }
  );

  // Admin: convocar próximo candidato elegível da lista de espera (expirando convocações vencidas antes)
  app.post(
    '/api/admin/commerce/class-offers/:offerId/summon-waitlist',
    requireAuth,
    requireCommerceAdmin,
    async (req, res) => {
      const caller = (req as any).user as { uid: string; email?: string | null };
      const offerId = String(req.params.offerId || '').trim();
      if (!UID_REGEX.test(offerId)) {
        return res.status(400).json({ error: 'Oferta inválida.' });
      }
      if (!hasCommerceDbReady()) {
        return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
      }

      const nowMs =
        typeof req.body?.nowMs === 'number' && Number.isFinite(req.body.nowMs)
          ? req.body.nowMs
          : Date.now();
      const responseTtlMsRaw = Number(req.body?.responseTtlMs);
      const responseTtlMs =
        Number.isFinite(responseTtlMsRaw) && responseTtlMsRaw >= 60 * 1000
          ? Math.floor(responseTtlMsRaw)
          : DEFAULT_WAITLIST_SUMMON_TTL_MS;
      const nowIso = new Date().toISOString();

      try {
        const adminDb = getCommerceDb();
        const txResult = await adminDb.runTransaction(async (tx: any) => {
          const offerRef = adminDb.collection('class_offers').doc(offerId);
          const offerSnap = await tx.get(offerRef);
          if (!offerSnap?.exists) {
            return { ok: false as const, status: 404, error: 'Oferta de turma não encontrada.' };
          }
          const offer = { offerId: offerSnap.id, ...(offerSnap.data() || {}) } as CommerceClassOffer;
          const wlSnap = await tx.get(
            adminDb.collection('class_waitlist').where('offerId', '==', offerId).limit(500)
          );
          const entries: ClassWaitlistEntry[] = (wlSnap?.docs || []).map(
            (d: any) => ({ waitlistId: d.id, ...(d.data() || {}) }) as ClassWaitlistEntry
          );

          let expiredSummons = 0;
          const updatedEntries = entries.map((e) => {
            if (e.status === 'summoned' && isWaitlistSummonExpired(e, nowMs)) {
              expiredSummons += 1;
              const next: ClassWaitlistEntry = {
                ...e,
                status: 'expired',
                history: [
                  ...(e.history || []),
                  {
                    status: 'expired',
                    at: nowIso,
                    reason: 'Prazo de convocação expirado automaticamente.',
                    actorUid: caller.uid,
                  },
                ],
                updatedAt: nowIso,
              };
              tx.set(adminDb.collection('class_waitlist').doc(e.waitlistId), next);
              return next;
            }
            return e;
          });

          const availableSeats = computeAvailableOfferSeats(offer);
          if (availableSeats < 1) {
            return {
              ok: false as const,
              status: 409,
              error: 'Não há vagas disponíveis nesta oferta para convocar lista de espera.',
              expiredSummons,
            };
          }

          const candidate = pickNextWaitlistCandidate(updatedEntries);
          if (!candidate) {
            return {
              ok: false as const,
              status: 404,
              error: 'Nenhum candidato aguardando na lista de espera.',
              expiredSummons,
            };
          }

          const deadlineMs = nowMs + responseTtlMs;
          const summoned: ClassWaitlistEntry = {
            ...candidate,
            status: 'summoned',
            summonedAt: nowIso,
            summonedAtMs: nowMs,
            responseDeadlineAt: new Date(deadlineMs).toISOString(),
            responseDeadlineAtMs: deadlineMs,
            history: [
              ...(candidate.history || []),
              {
                status: 'summoned',
                at: nowIso,
                reason: 'Convocado para preenchimento de vaga disponível.',
                actorUid: caller.uid,
              },
            ],
            updatedAt: nowIso,
          };
          tx.set(adminDb.collection('class_waitlist').doc(candidate.waitlistId), summoned);

          return { ok: true as const, summoned, expiredSummons };
        });

        if (!txResult.ok) {
          return res.status(txResult.status).json({
            error: txResult.error,
            expiredSummons: (txResult as any).expiredSummons || 0,
          });
        }

        await recordAdminLog({
          eventType: 'commerce_waitlist_summoned',
          severity: 'info',
          actorUid: caller.uid,
          actorEmail: caller.email,
          actorRole: 'admin',
          targetUid: txResult.summoned.studentUid,
          action: `Candidato #${txResult.summoned.priorityOrder} convocado na lista de espera`,
          details: `offerId=${offerId}, waitlistId=${txResult.summoned.waitlistId}`,
        });

        return res.json({
          status: 'ok',
          summoned: txResult.summoned,
          expiredSummons: txResult.expiredSummons,
        });
      } catch (err: any) {
        console.error('[Admin Phase3] Erro ao convocar lista de espera:', err?.message || err);
        return res.status(500).json({ error: 'Não foi possível convocar candidato da lista de espera.' });
      }
    }
  );

  // Admin: transicionar ciclo de assinatura (pausar, reativar, cancelar, expirar) preservando histórico e Fase 1
  app.post(
    '/api/admin/commerce/subscriptions/:subscriptionId/transition',
    requireAuth,
    requireCommerceAdmin,
    async (req, res) => {
      const caller = (req as any).user as { uid: string; email?: string | null };
      const subscriptionId = String(req.params.subscriptionId || '').trim();
      if (!UID_REGEX.test(subscriptionId)) {
        return res.status(400).json({ error: 'Identificador de assinatura inválido.' });
      }
      if (!hasCommerceDbReady()) {
        return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
      }

      const nextStatus = String(req.body?.status || '').trim() as SubscriptionStatus;
      const reason = req.body?.reason ? String(req.body.reason).trim().slice(0, 400) : undefined;
      const nowIso = new Date().toISOString();

      try {
        const adminDb = getCommerceDb();
        const txResult = await adminDb.runTransaction(async (tx: any) => {
          const subRef = adminDb.collection('subscriptions').doc(subscriptionId);
          const subSnap = await tx.get(subRef);
          if (!subSnap?.exists) {
            return { ok: false as const, status: 404, error: 'Assinatura não encontrada.' };
          }
          const existing = { subscriptionId: subSnap.id, ...(subSnap.data() || {}) } as CommerceSubscription;
          const transition = applySubscriptionLifecycleTransition({
            subscription: existing,
            nextStatus,
            reason,
            nowIso,
          });
          if (!transition.valid) {
            return { ok: false as const, status: 400, error: transition.error || 'Transição inválida.' };
          }

          tx.set(subRef, transition.subscription);

          if (existing.entitlementId) {
            const entRef = adminDb.collection('commerce_entitlements').doc(existing.entitlementId);
            const entSnap = await tx.get(entRef);
            if (entSnap?.exists) {
              const entData = entSnap.data() as CommerceEntitlementRecord;
              tx.set(entRef, {
                ...entData,
                status: transition.entitlementStatus,
                updatedAt: nowIso,
              });
            }
          }

          return { ok: true as const, subscription: transition.subscription };
        });

        if (!txResult.ok) {
          return res.status(txResult.status).json({ error: txResult.error });
        }

        await recordAdminLog({
          eventType: 'commerce_subscription_updated',
          severity: 'info',
          actorUid: caller.uid,
          actorEmail: caller.email,
          actorRole: 'admin',
          targetUid: txResult.subscription.studentUid,
          action: `Assinatura ${subscriptionId} alterada para "${txResult.subscription.status}"`,
          details: reason || undefined,
        });

        return res.json({ status: 'ok', subscription: txResult.subscription });
      } catch (err: any) {
        console.error('[Admin Phase3] Erro ao atualizar assinatura:', err?.message || err);
        return res.status(500).json({ error: 'Não foi possível atualizar a assinatura.' });
      }
    }
  );

  // Admin: relatório financeiro consolidado (estritamente bloqueado para alunos e professores)
  app.get('/api/admin/commerce/financial', requireAuth, requireCommerceAdmin, async (req, res) => {
    if (!hasCommerceDbReady()) {
      return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
    }

    const currency = String(req.query?.currency || 'BRL').toUpperCase() as any;
    const startDate = req.query?.startDate ? String(req.query.startDate) : undefined;
    const endDate = req.query?.endDate ? String(req.query.endDate) : undefined;
    const includeHomologation = req.query?.includeHomologation === 'true';

    try {
      const adminDb = getCommerceDb();
      const [ordersSnap, paymentsSnap, subsSnap, adjSnap] = await Promise.all([
        adminDb.collection('orders').limit(1000).get(),
        adminDb.collection('payments').limit(1000).get(),
        adminDb.collection('subscriptions').limit(500).get(),
        adminDb.collection('financial_adjustments').limit(500).get(),
      ]);

      const report = computeFinancialSummaryReport({
        orders: (ordersSnap?.docs || []).map((d: any) => ({ orderId: d.id, ...(d.data() || {}) })),
        payments: (paymentsSnap?.docs || []).map((d: any) => ({ paymentId: d.id, ...(d.data() || {}) })),
        subscriptions: (subsSnap?.docs || []).map((d: any) => ({ subscriptionId: d.id, ...(d.data() || {}) })),
        adjustments: (adjSnap?.docs || []).map((d: any) => ({ adjustmentId: d.id, ...(d.data() || {}) })),
        currency: ['BRL', 'USD', 'EUR'].includes(currency) ? currency : 'BRL',
        startDateIso: startDate,
        endDateIso: endDate,
        includeHomologation,
      });

      return res.json({ status: 'ok', report });
    } catch (err: any) {
      console.error('[Admin Financial] Erro ao calcular resumo financeiro:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível gerar o resumo financeiro.' });
    }
  });

  // Admin: registrar ajuste financeiro imutável com justificativa obrigatória
  app.post('/api/admin/commerce/financial/adjustments', requireAuth, requireCommerceAdmin, async (req, res) => {
    const caller = (req as any).user as { uid: string; email?: string | null };
    if (!hasCommerceDbReady()) {
      return res.status(503).json({ error: 'Credenciais administrativas indisponíveis.' });
    }

    const body = req.body || {};
    const type = String(body.type || '').trim() as FinancialAdjustmentRecord['type'];
    const orderId = body.orderId ? String(body.orderId).trim() : null;
    const amountCents = Number(body.amountCents);
    const currency = String(body.currency || 'BRL').toUpperCase() as any;
    const justification = String(body.justification || '').trim();

    if (!['reconciliation_note', 'manual_credit_note', 'refund_adjustment', 'chargeback_record'].includes(type)) {
      return res.status(400).json({ error: 'Tipo de ajuste financeiro inválido.' });
    }
    if (!Number.isInteger(amountCents)) {
      return res.status(400).json({ error: 'Valor do ajuste deve ser informado em centavos inteiros.' });
    }
    if (!['BRL', 'USD', 'EUR'].includes(currency)) {
      return res.status(400).json({ error: 'Moeda inválida para ajuste financeiro.' });
    }
    if (justification.length < 10 || justification.length > 500) {
      return res.status(400).json({
        error: 'Justificativa obrigatória com mínimo de 10 e máximo de 500 caracteres.',
      });
    }
    if (orderId && !UID_REGEX.test(orderId)) {
      return res.status(400).json({ error: 'Identificador de pedido inválido.' });
    }

    const adjustmentId = generatePhase3Id('adj');
    const nowIso = new Date().toISOString();
    const record: FinancialAdjustmentRecord = {
      adjustmentId,
      type,
      orderId,
      amountCents,
      currency,
      justification,
      actorUid: caller.uid,
      actorEmail: caller.email || null,
      createdAt: nowIso,
    };

    try {
      const adminDb = getCommerceDb();
      await adminDb.collection('financial_adjustments').doc(adjustmentId).set(record);
      await recordAdminLog({
        eventType: 'commerce_financial_adjustment',
        severity: 'warning',
        actorUid: caller.uid,
        actorEmail: caller.email,
        actorRole: 'admin',
        action: `Ajuste financeiro registrado (${type}: ${amountCents} ${currency})`,
        details: `adjustmentId=${adjustmentId} | ${justification.slice(0, 200)}`,
      });
      return res.status(201).json({ status: 'ok', adjustment: record });
    } catch (err: any) {
      console.error('[Admin Financial] Erro ao salvar ajuste financeiro:', err?.message || err);
      return res.status(500).json({ error: 'Não foi possível registrar o ajuste financeiro.' });
    }
  });

  // Catch-all 404 para rotas /api inexistentes (retorna JSON, nunca HTML)
  app.all('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Endpoint da API não encontrado.' });
  });

  return app;
}

export const app = createServerApp();

// ==========================================
// VITE DEV MIDDLEWARE OU STATIC PROD
// ==========================================
async function start() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';
  const ai = createGeminiClient();
  const httpServer = http.createServer(app);

  if (isProduction) {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Guitar Academy Server running on http://0.0.0.0:${PORT} (Gemini AI: ${ai ? 'ENABLED' : 'DISABLED'})`
    );
  });
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)) {
  start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

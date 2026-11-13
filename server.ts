import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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
  process.env.FIREBASE_PROJECT_ID || appletConfig.projectId || 'gen-lang-client-0214739740';
const FIRESTORE_DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId || '(default)';

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

export interface ServerAuthDependencies {
  verifyIdToken?: (token: string) => Promise<{ uid: string; email?: string; [key: string]: any }>;
  getSystemRole?: (uid: string) => Promise<{ exists: boolean; role: string }>;
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

// Inicialização segura do SDK Gemini no backend (process.env.GEMINI_API_KEY)
// Chave NUNCA trafega para o navegador nem é exposta em bundles.
function createGeminiClient() {
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
  const ai = createGeminiClient();
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
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

  // Body parser com limite de payload para prevenir abusos
  app.use(express.json({ limit: '200kb' }));

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
      available: !!ai,
      model: 'gemini-3.8-flash',
      provider: 'Google Gemini',
      permissions: {
        studentRoutes: ['/api/professor/chat', '/api/professor/exercise', '/api/professor/evaluate', '/api/professor/recommend'],
        teacherRoutes: ['/api/professor/class-insights'],
        adminRoutes: ['/api/admin/overview', '/api/admin/roles/:uid'],
      },
      message: ai
        ? 'Professor IA operacional via Gemini 3.8 Flash'
        : 'GEMINI_API_KEY não configurada no ambiente. Adicione a chave nas Configurações.',
    });
  });

  // 2. Chat Contextualizado com Professor IA (student, teacher, admin)
  app.post('/api/professor/chat', requireAuth, requireRole(['student', 'teacher', 'admin']), rateLimiter(20, 60000), async (req, res) => {
    if (!ai) {
      return res.status(503).json({
        error: 'Serviço do Professor IA indisponível. Configure a chave GEMINI_API_KEY no painel de configurações.',
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
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY não configurada.' });
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
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY não configurada.' });
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
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY não configurada.' });
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
    if (!ai) {
      return res.status(503).json({ error: 'GEMINI_API_KEY não configurada.' });
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
        return res.status(403).json({
          error: 'Acesso negado. Apenas administradores podem consultar papéis de outros usuários.',
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

  // Rota de governança administrativa protegida por requireAuth e requireAdmin
  app.get('/api/admin/overview', requireAuth, requireAdmin, async (_req, res) => {
    return res.json({
      status: 'ok',
      security: 'Zero-Trust RBAC Active',
      platform: 'Guitar Academy Production Backend',
      timestamp: new Date().toISOString(),
    });
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

  if (isProduction) {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
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

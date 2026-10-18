import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser com limite de payload para prevenir abusos
app.use(express.json({ limit: '200kb' }));

// Inicialização segura do SDK Gemini no backend (process.env.GEMINI_API_KEY)
// Chave NUNCA trafega para o navegador nem é exposta em bundles.
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper para timeout seguro em chamadas de IA (25 segundos)
function withTimeout<T>(promise: Promise<T>, ms = 25000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Tempo limite excedido na comunicação com a IA.')), ms)
    ),
  ]);
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

// ==========================================
// PROFESSOR IA API ROUTES (Regra 6 & Item 3)
// ==========================================

// 1. Status do Professor IA
app.get('/api/professor/status', (_req, res) => {
  res.json({
    available: !!ai,
    model: 'gemini-3.8-flash',
    provider: 'Google Gemini',
    message: ai
      ? 'Professor IA operacional via Gemini 3.8 Flash'
      : 'GEMINI_API_KEY não configurada no ambiente. Adicione a chave nas Configurações.',
  });
});

// 2. Chat Contextualizado com Professor IA
app.post('/api/professor/chat', async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: 'Serviço do Professor IA indisponível. Configure a chave GEMINI_API_KEY no painel de configurações.',
    });
  }

  const { message, context } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensagem inválida ou ausente.' });
  }

  // Limite de tamanho de entrada para proteção contra abuso (máximo 1000 caracteres)
  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return res.status(400).json({ error: 'A pergunta não pode ser vazia.' });
  }
  if (trimmedMessage.length > 1000) {
    return res.status(400).json({ error: 'A pergunta deve ter no máximo 1000 caracteres.' });
  }

  // Sanitização de contexto do aluno
  const studentLevel = Math.max(0, Math.min(5, Number(context?.studentLevel) || 0));
  const currentLessonTitle = typeof context?.currentLessonTitle === 'string' 
    ? context.currentLessonTitle.slice(0, 120) 
    : 'Fundamentos';
  const masteredSkills = Array.isArray(context?.masteredSkills) 
    ? context.masteredSkills.slice(0, 10).map((s: any) => String(s).slice(0, 50)) 
    : [];
  const difficulties = Array.isArray(context?.difficulties) 
    ? context.difficulties.slice(0, 10).map((s: any) => String(s).slice(0, 50)) 
    : [];

  const prompt = `Você é o Professor IA do Guitar Academy, um experiente mentor de guitarra e violão brasileiro.
Sua didática é técnica, precisa, encorajadora e focada no progresso real do aluno.

CONTEXTO ATUAL DO ALUNO:
- Nível de Formação: Nível ${studentLevel}
- Aula Atual: ${currentLessonTitle}
- Habilidades Dominadas: ${masteredSkills.join(', ') || 'Nenhuma registrada ainda'}
- Dificuldades / Focos Recentes: ${difficulties.join(', ') || 'Transições de acordes e postura'}
${context?.coachFeedback ? `- Último Treino no Guitar Coach: Acordes [${(context.coachFeedback.chords || []).join(' -> ')}], Precisão: ${context.coachFeedback.accuracy || 0}%, BPM: ${context.coachFeedback.bpm || 60}` : ''}

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

// 3. Gerador de Exercícios Estruturados por Nível
app.post('/api/professor/exercise', async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: 'GEMINI_API_KEY não configurada.' });
  }

  const rawLevel = Number(req.body.level);
  const level = Number.isInteger(rawLevel) ? Math.max(0, Math.min(5, rawLevel)) : 0;
  const rawTopic = typeof req.body.topic === 'string' ? req.body.topic.trim() : 'Harmonia e Tríades';
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

// 4. Avaliação e Correção de Respostas / Desempenho
app.post('/api/professor/evaluate', async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: 'GEMINI_API_KEY não configurada.' });
  }

  const { question, studentAnswer, correctAnswer, explanation, level = 0 } = req.body;
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

// 5. Recomendação de Próxima Atividade baseada no Progresso
app.post('/api/professor/recommend', async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: 'GEMINI_API_KEY não configurada.' });
  }

  const { progress } = req.body;
  const prompt = `Você é o orientador pedagógico do Guitar Academy.
Analise os dados de progresso do estudante:
- Nível: ${progress?.studyPlan?.selectedLevel ?? 0}
- Meta Diária: ${progress?.dailyGoalMinutes ?? 30} minutos
- Tempo Praticado Hoje: ${Math.floor((progress?.todayStudyTimeSeconds ?? 0) / 60)} min
- Aulas Concluídas: ${(progress?.completedLessons || []).length}
- Erros Frequentes Registrados: ${JSON.stringify(progress?.frequentErrors || {})}
- Últimas Avaliações: ${JSON.stringify(progress?.quizScores || {})}

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

// Catch-all 404 para rotas /api inexistentes (retorna JSON, nunca HTML)
app.all('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Endpoint da API não encontrado.' });
});

// ==========================================
// VITE DEV MIDDLEWARE OU STATIC PROD
// ==========================================
async function start() {
  const isProduction = process.env.NODE_ENV === 'production';

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
    console.log(`Guitar Academy Server running on http://0.0.0.0:${PORT} (Gemini AI: ${ai ? 'ENABLED' : 'DISABLED'})`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

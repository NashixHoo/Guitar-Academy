// =============================================================
// GUITAR ACADEMY - PROFESSOR IA CLIENT SERVICE (HARDENED V1.1)
// src/services/professorService.ts
// Interface segura de integração do cliente com a API de IA
// Requer autenticação com Firebase Bearer Token e suporta
// VITE_PROFESSOR_API_URL para Google Cloud Run / Produção.
// =============================================================

import {
  ProfessorExercise,
  ProfessorEvaluation,
  ProfessorRecommendation,
  UserProgress,
} from '../types';
import { auth } from './firebase';

export const PROFESSOR_IA_ENABLED = false;

export interface ProfessorStatus {
  available: boolean;
  model: string;
  provider: string;
  message: string;
}

/**
 * Retorna a URL base do backend configurada ou vazia em desenvolvimento
 */
export function getProfessorApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_PROFESSOR_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // Em modo de desenvolvimento local no Vite, utiliza caminho relativo '/api'
  if (import.meta.env.DEV) {
    return '';
  }
  // Em produção estática (ex: GitHub Pages) sem backend configurado
  return '';
}

/**
 * Cliente HTTP centralizado com injeção automática de Firebase ID Token
 */
async function authorizedApiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  if (!PROFESSOR_IA_ENABLED) {
    return new Response(
      JSON.stringify({ error: 'Professor IA desativado.', disabled: true }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const baseUrl = getProfessorApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  // Obtém o token seguro do usuário autenticado no Firebase
  let idToken: string | null = null;
  if (auth.currentUser) {
    try {
      idToken = await auth.currentUser.getIdToken();
    } catch {
      // Offline fallback
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      throw new Error('Sessão não autorizada ou expirada. Faça login novamente para consultar o Professor IA.');
    }
    if (response.status === 403) {
      throw new Error('Acesso restrito. Sua conta não possui permissão para esta operação.');
    }
    if (response.status === 429) {
      throw new Error('Limite de requisições excedido. Aguarde alguns instantes antes de enviar nova pergunta.');
    }
    if (response.status === 503) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Serviço do Professor IA temporariamente indisponível.');
    }

    return response;
  } catch (err: any) {
    // Se a URL do backend não estiver configurada no GitHub Pages
    if (!baseUrl && !import.meta.env.DEV) {
      throw new Error(
        'O serviço do Professor IA requer o backend conectado. Configure a URL da API em VITE_PROFESSOR_API_URL.'
      );
    }
    throw err;
  }
}

export const professorService = {
  /**
   * Checa o status e a disponibilidade do serviço de IA no servidor.
   */
  async checkStatus(): Promise<ProfessorStatus> {
    if (!PROFESSOR_IA_ENABLED) {
      return {
        available: false,
        model: 'desativado',
        provider: 'Desativado',
        message: 'Professor IA desativado por configuração (modo custo zero).',
      };
    }

    try {
      const res = await authorizedApiFetch('/api/professor/status');
      if (!res.ok) {
        return {
          available: false,
          model: 'gemini-3.8-flash',
          provider: 'Google Gemini',
          message: 'Servidor retornou erro ao verificar status do Professor IA.',
        };
      }
      return await res.json();
    } catch (err: any) {
      return {
        available: false,
        model: 'gemini-3.8-flash',
        provider: 'Google Gemini',
        message: err?.message || 'Não foi possível conectar ao backend do Professor IA.',
      };
    }
  },

  /**
   * Envia uma dúvida técnica ou teórica com contexto do aluno.
   */
  async askQuestion(
    message: string,
    context: {
      studentLevel?: number;
      currentLessonTitle?: string;
      masteredSkills?: string[];
      difficulties?: string[];
      coachFeedback?: {
        chords?: string[];
        accuracy?: number;
        bpm?: number;
      };
    }
  ): Promise<{ reply: string; timestamp: string }> {
    const res = await authorizedApiFetch('/api/professor/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao obter resposta do Professor IA.');
    }

    return await res.json();
  },

  /**
   * Solicita a geração de 1 exercício estruturado por nível e tópico.
   */
  async generateExercise(level: number, topic: string): Promise<ProfessorExercise> {
    const res = await authorizedApiFetch('/api/professor/exercise', {
      method: 'POST',
      body: JSON.stringify({ level, topic }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao gerar exercício.');
    }

    return await res.json();
  },

  /**
   * Envia a resposta do aluno para avaliação pedagógica do Professor IA.
   */
  async evaluateAnswer(params: {
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    explanation: string;
    level: number;
  }): Promise<ProfessorEvaluation> {
    const res = await authorizedApiFetch('/api/professor/evaluate', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao avaliar resposta.');
    }

    return await res.json();
  },

  /**
   * Gera uma recomendação didática da próxima atividade baseada no progresso real.
   */
  async getRecommendation(progress: UserProgress): Promise<ProfessorRecommendation> {
    const res = await authorizedApiFetch('/api/professor/recommend', {
      method: 'POST',
      body: JSON.stringify({ progress }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao gerar recomendação pedagógica.');
    }

    return await res.json();
  },
};

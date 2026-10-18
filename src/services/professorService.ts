// =============================================================
// GUITAR ACADEMY - PROFESSOR IA CLIENT SERVICE
// src/services/professorService.ts
// Interface segura de integração do cliente com a API de IA
// Mantém o histórico do aluno e o currículo estritamente separados
// do mecanismo de IA (Regra 6).
// =============================================================

import {
  ProfessorExercise,
  ProfessorEvaluation,
  ProfessorRecommendation,
  UserProgress,
} from '../types';

export interface ProfessorStatus {
  available: boolean;
  model: string;
  provider: string;
  message: string;
}

export const professorService = {
  /**
   * Checa o status e a disponibilidade do serviço de IA no servidor.
   */
  async checkStatus(): Promise<ProfessorStatus> {
    try {
      const res = await fetch('/api/professor/status');
      if (!res.ok) {
        return {
          available: false,
          model: 'gemini-3.8-flash',
          provider: 'Google Gemini',
          message: 'Servidor retornou erro ao verificar status do Professor IA.',
        };
      }
      return await res.json();
    } catch {
      return {
        available: false,
        model: 'gemini-3.8-flash',
        provider: 'Google Gemini',
        message: 'Não foi possível conectar ao backend do Professor IA.',
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
    const res = await fetch('/api/professor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch('/api/professor/exercise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch('/api/professor/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch('/api/professor/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao gerar recomendação pedagógica.');
    }

    return await res.json();
  },
};

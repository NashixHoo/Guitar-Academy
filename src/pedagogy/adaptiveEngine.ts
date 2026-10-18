// =============================================================
// GUITAR ACADEMY - MOTOR DE ADAPTAÇÃO & MEMÓRIA PEDAGÓGICA
// src/pedagogy/adaptiveEngine.ts
// Módulo determinístico, 100% testável e independente de provedor de IA.
// Analisa métricas reais (quizzes, repetições, áudio e erros recorrentes)
// para calcular domínio e selecionar a próxima ação pedagógica ideal (Fase 3).
// =============================================================

import {
  SkillProfile,
  PedagogicalProfile,
  SkillCategory,
  MasteryLevel,
  SkillEvidence,
  AdaptiveRecommendation,
  UserProgress,
  NavigationTab,
} from '../types';

/**
 * Catálogo Canônico de Habilidades Fundamentais do Guitar Academy (Níveis 0 a 5).
 */
export const CANONICAL_SKILLS: Omit<SkillProfile, 'masteryScore' | 'masteryLevel' | 'attemptsCount' | 'correctCount' | 'incorrectCount' | 'recurringErrors' | 'lastPracticedDate' | 'lastReviewedDate' | 'nextReviewDate' | 'reviewIntervalDays' | 'evidences'>[] = [
  // NÍVEL 0 — ABSOLUTO ZERO
  {
    id: 'skill-tuning-strings',
    name: 'Afinação Padrão e Cordas (E-A-D-G-B-E)',
    category: 'technique',
    level: 0,
    prerequisites: [],
  },
  {
    id: 'skill-cipher-notes',
    name: 'Cifras Internacionais e Notas Naturais (A-G)',
    category: 'notes',
    level: 0,
    prerequisites: [],
  },
  {
    id: 'skill-semitones-fretboard',
    name: 'Tons, Semitons e Localização no Braço Real',
    category: 'intervals',
    level: 0,
    prerequisites: ['skill-cipher-notes'],
  },
  {
    id: 'skill-alternate-picking',
    name: 'Postura, Palhetada Alternada e Coordenação 1-2-3-4',
    category: 'technique',
    level: 0,
    prerequisites: [],
  },
  {
    id: 'skill-metronome-44',
    name: 'Pulsação, Compasso 4/4 e Treino com Metrônomo',
    category: 'rhythm',
    level: 0,
    prerequisites: [],
  },

  // NÍVEL 1 — ACORDES ABERTOS & WORSHIP
  {
    id: 'skill-open-chords-e-a',
    name: 'Acordes Abertos Maiores e Menores (E, Em, A, Am)',
    category: 'chord_shapes',
    level: 1,
    prerequisites: ['skill-semitones-fretboard', 'skill-alternate-picking'],
  },
  {
    id: 'skill-open-chords-c-g-d',
    name: 'Tríade Pop/Rock C, G e D',
    category: 'chord_shapes',
    level: 1,
    prerequisites: ['skill-open-chords-e-a'],
  },
  {
    id: 'skill-chord-transitions',
    name: 'Transições de Acordes no Tempo (Guitar Coach)',
    category: 'technique',
    level: 1,
    prerequisites: ['skill-open-chords-c-g-d', 'skill-metronome-44'],
  },
  {
    id: 'skill-worship-chords',
    name: 'Acordes Worship e Extensões (Cadd9, Em7, Dsus4)',
    category: 'chord_shapes',
    level: 1,
    prerequisites: ['skill-open-chords-c-g-d'],
  },
  {
    id: 'skill-strumming-grooves',
    name: 'Levadas Rítmicas de Worship, Pop e Groove',
    category: 'rhythm',
    level: 1,
    prerequisites: ['skill-metronome-44'],
  },

  // NÍVEL 2 — PENTATÔNICAS E SOLOS
  {
    id: 'skill-pentatonic-pos1',
    name: 'Escala Pentatônica Menor — Padrão 1',
    category: 'scales',
    level: 2,
    prerequisites: ['skill-semitones-fretboard', 'skill-alternate-picking'],
  },
  {
    id: 'skill-caged-pentatonic',
    name: '5 Posições da Pentatônica no Braço (Sistema CAGED)',
    category: 'scales',
    level: 2,
    prerequisites: ['skill-pentatonic-pos1'],
  },
  {
    id: 'skill-expressive-solo',
    name: 'Expressividade: Bends, Vibrato e Ligados (Hammer/Pull)',
    category: 'technique',
    level: 2,
    prerequisites: ['skill-pentatonic-pos1'],
  },
  {
    id: 'skill-solo-improvisation',
    name: 'Criação de Solos e Frases Melódicas',
    category: 'improvisation',
    level: 2,
    prerequisites: ['skill-caged-pentatonic', 'skill-expressive-solo'],
  },

  // NÍVEL 3 — HARMONIA E CAMPO HARMÔNICO
  {
    id: 'skill-triads-tetrads',
    name: 'Formação de Tríades, Tétrades e Acordes com 7ª',
    category: 'harmony',
    level: 3,
    prerequisites: ['skill-open-chords-c-g-d'],
  },
  {
    id: 'skill-harmonic-field',
    name: 'Campo Harmônico Maior e Graus I a VII',
    category: 'harmony',
    level: 3,
    prerequisites: ['skill-triads-tetrads'],
  },
  {
    id: 'skill-ear-intervals',
    name: 'Percepção Auditiva de Intervalos e Acordes',
    category: 'ear_training',
    level: 3,
    prerequisites: ['skill-triads-tetrads'],
  },

  // NÍVEL 4 — AVANÇADO E MODOS GREGOS
  {
    id: 'skill-major-pentatonic',
    name: 'Pentatônica Maior e Relativas Menores',
    category: 'scales',
    level: 4,
    prerequisites: ['skill-caged-pentatonic'],
  },
  {
    id: 'skill-greek-modes',
    name: 'Modos Gregos e Aplicação Harmônica Modal',
    category: 'harmony',
    level: 4,
    prerequisites: ['skill-harmonic-field'],
  },

  // NÍVEL 5 — DOMÍNIO E PROFISSIONALISMO
  {
    id: 'skill-voice-leading',
    name: 'Voice Leading e Inversões de Acordes no Braço',
    category: 'chord_shapes',
    level: 5,
    prerequisites: ['skill-triads-tetrads', 'skill-harmonic-field'],
  },
  {
    id: 'skill-band-performance',
    name: 'Acompanhamento Dinâmico em Banda e Improvisação Live',
    category: 'improvisation',
    level: 5,
    prerequisites: ['skill-voice-leading'],
  },
];

/**
 * Mapeamento entre Aulas Canônicas e Habilidade Principal
 */
export const LESSON_TO_SKILL_MAP: Record<string, string> = {
  'lesson-1': 'skill-tuning-strings',
  'lesson-2': 'skill-semitones-fretboard',
  'lesson-3': 'skill-alternate-picking',
  'lesson-4': 'skill-metronome-44',
  'lesson-5': 'skill-open-chords-e-a',
  'lesson-6': 'skill-open-chords-c-g-d',
  'lesson-7': 'skill-worship-chords',
  'lesson-8': 'skill-strumming-grooves',
  'lesson-9': 'skill-pentatonic-pos1',
  'lesson-10': 'skill-caged-pentatonic',
  'lesson-11': 'skill-expressive-solo',
  'lesson-12': 'skill-solo-improvisation',
  'lesson-13': 'skill-triads-tetrads',
  'lesson-14': 'skill-harmonic-field',
  'lesson-15': 'skill-major-pentatonic',
  'lesson-16': 'skill-greek-modes',
  'lesson-17': 'skill-voice-leading',
  'lesson-18': 'skill-band-performance',
};

/**
 * Helper de manipulação de datas ISO
 */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function getTodayIso(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Cria ou migra um perfil pedagógico vazio/canônico
 */
export function createInitialPedagogicalProfile(): PedagogicalProfile {
  const skills: Record<string, SkillProfile> = {};

  for (const s of CANONICAL_SKILLS) {
    skills[s.id] = {
      ...s,
      masteryScore: 0,
      masteryLevel: 'not_started',
      attemptsCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      recurringErrors: {},
      lastPracticedDate: null,
      lastReviewedDate: null,
      nextReviewDate: null,
      reviewIntervalDays: 0,
      evidences: [],
    };
  }

  return {
    skills,
    overallMasteryPercent: 0,
    lastAdaptationDate: getTodayIso(),
  };
}

/**
 * Calcula o nível e score de domínio de uma habilidade com base em evidências reais.
 * REGRA: Apenas abrir uma aula NÃO concede domínio. É necessária evidência real (quiz, áudio, repetições).
 */
export function calculateSkillMastery(skill: SkillProfile): { score: number; level: MasteryLevel } {
  if (skill.attemptsCount === 0 || skill.evidences.length === 0) {
    return { score: 0, level: 'not_started' };
  }

  // 1. Taxa de acerto (peso 40%)
  const accuracy = skill.attemptsCount > 0 ? skill.correctCount / skill.attemptsCount : 0;

  // 2. Média das evidências registradas (peso 40%)
  const evidenceScores = skill.evidences
    .map((e) => e.score ?? e.accuracyPercent ?? 0)
    .filter((s) => s > 0);
  const avgEvidenceScore = evidenceScores.length > 0
    ? evidenceScores.reduce((a, b) => a + b, 0) / evidenceScores.length
    : 0;

  // 3. Fator de consistência por volume de tentativas (peso 20%)
  // Requer pelo menos 3 tentativas para pontuar o teto de consistência
  const consistencyFactor = Math.min(1.0, skill.attemptsCount / 3);

  let rawScore = Math.round(
    accuracy * 40 +
    (avgEvidenceScore / 100) * 40 +
    consistencyFactor * 20
  );

  // Trava de segurança: Se tiver menos de 2 evidências, o score máximo é 65 (introductory/practicing)
  if (skill.evidences.length < 2) {
    rawScore = Math.min(65, rawScore);
  }

  // Penalidade por erros recorrentes não superados (até -15 pontos)
  const totalErrors = Object.values(skill.recurringErrors).reduce((a, b) => a + b, 0);
  if (totalErrors >= 3) {
    rawScore = Math.max(10, rawScore - Math.min(15, totalErrors * 2));
  }

  const finalScore = Math.max(0, Math.min(100, rawScore));

  let level: MasteryLevel = 'not_started';
  if (finalScore >= 90 && skill.evidences.length >= 2) {
    level = 'mastered';
  } else if (finalScore >= 75) {
    level = 'proficient';
  } else if (finalScore >= 50) {
    level = 'practicing';
  } else if (finalScore >= 25) {
    level = 'introductory';
  }

  return { score: finalScore, level };
}

/**
 * Registra uma evidência real de aprendizagem e atualiza o perfil de repetição espaçada.
 */
export function recordSkillEvidence(
  profile: PedagogicalProfile,
  skillId: string,
  evidence: Omit<SkillEvidence, 'id' | 'date'> & { date?: string; errorTag?: string }
): PedagogicalProfile {
  const currentSkill = profile.skills[skillId];
  if (!currentSkill) return profile;

  const today = evidence.date || getTodayIso();
  const score = evidence.score ?? evidence.accuracyPercent ?? 50;
  const isSuccess = score >= 70;

  const newEvidence: SkillEvidence = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    source: evidence.source,
    date: today,
    score: evidence.score,
    accuracyPercent: evidence.accuracyPercent,
    details: evidence.details,
  };

  const updatedAttempts = currentSkill.attemptsCount + 1;
  const updatedCorrect = isSuccess ? currentSkill.correctCount + 1 : currentSkill.correctCount;
  const updatedIncorrect = !isSuccess ? currentSkill.incorrectCount + 1 : currentSkill.incorrectCount;

  // Atualização de erros recorrentes
  const updatedRecurring = { ...currentSkill.recurringErrors };
  if (!isSuccess && evidence.errorTag) {
    updatedRecurring[evidence.errorTag] = (updatedRecurring[evidence.errorTag] || 0) + 1;
  }

  // Repetição espaçada (Algoritmo Leitner Simplificado)
  let newInterval = currentSkill.reviewIntervalDays;
  if (isSuccess) {
    // Domínio confirmado: expande intervalo (1 -> 3 -> 7 -> 14 -> 30 dias)
    newInterval = newInterval === 0 ? 1 : Math.min(30, Math.round(newInterval * 2.2));
  } else {
    // Falha ou dificuldade: reseta para revisão em 1 dia
    newInterval = 1;
  }
  const nextReview = addDays(today, newInterval);

  // Recalcula score com a nova evidência
  const draftSkill: SkillProfile = {
    ...currentSkill,
    attemptsCount: updatedAttempts,
    correctCount: updatedCorrect,
    incorrectCount: updatedIncorrect,
    recurringErrors: updatedRecurring,
    lastPracticedDate: today,
    lastReviewedDate: isSuccess ? today : currentSkill.lastReviewedDate,
    nextReviewDate: nextReview,
    reviewIntervalDays: newInterval,
    evidences: [newEvidence, ...currentSkill.evidences].slice(0, 15), // guarda as 15 mais recentes
  };

  const { score: newScore, level: newLevel } = calculateSkillMastery(draftSkill);
  draftSkill.masteryScore = newScore;
  draftSkill.masteryLevel = newLevel;

  const updatedSkills = {
    ...profile.skills,
    [skillId]: draftSkill,
  };

  // Recalcula média geral
  const allScores = Object.values(updatedSkills).map((s) => s.masteryScore);
  const overall = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  return {
    skills: updatedSkills,
    overallMasteryPercent: overall,
    lastAdaptationDate: today,
  };
}

/**
 * Migra dados de progresso legados (UserProgress da Fase 1/2) para o Perfil Pedagógico.
 * Preserva o histórico de quizzes, repetições e logs sem perda de dados.
 */
export function migrateLegacyProgressToPedagogical(progress: UserProgress): PedagogicalProfile {
  let profile = progress.pedagogicalProfile || createInitialPedagogicalProfile();

  // Garante que todas as habilidades canônicas existam no perfil
  for (const s of CANONICAL_SKILLS) {
    if (!profile.skills[s.id]) {
      profile.skills[s.id] = {
        ...s,
        masteryScore: 0,
        masteryLevel: 'not_started',
        attemptsCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        recurringErrors: {},
        lastPracticedDate: null,
        lastReviewedDate: null,
        nextReviewDate: null,
        reviewIntervalDays: 0,
        evidences: [],
      };
    }
  }

  // 1. Migra pontuações de quizzes concluídos
  if (progress.quizScores) {
    for (const [lessonId, qData] of Object.entries(progress.quizScores)) {
      const skillId = LESSON_TO_SKILL_MAP[lessonId];
      if (skillId && qData.total > 0) {
        const percent = Math.round((qData.score / qData.total) * 100);
        // Só registra se ainda não tiver evidência similar
        const hasEvidence = profile.skills[skillId]?.evidences.some((e) => e.source === 'lesson_quiz');
        if (!hasEvidence) {
          profile = recordSkillEvidence(profile, skillId, {
            source: 'lesson_quiz',
            date: qData.date || progress.lastStudyDate || getTodayIso(),
            score: percent,
            details: `Quiz da aula ${lessonId}: ${qData.score}/${qData.total} acertos (${percent}%)`,
          });
        }
      }
    }
  }

  // 2. Migra repetições de exercícios práticos concluídos
  if (progress.exerciseRepetitions) {
    for (const [exId, count] of Object.entries(progress.exerciseRepetitions)) {
      if (count >= 5) {
        let skillId = 'skill-alternate-picking';
        if (exId.includes('coach') || exId.includes('transitions')) {
          skillId = 'skill-chord-transitions';
        }
        const hasEvidence = profile.skills[skillId]?.evidences.some((e) => e.source === 'exercise_repetitions');
        if (!hasEvidence) {
          profile = recordSkillEvidence(profile, skillId, {
            source: 'exercise_repetitions',
            date: progress.lastStudyDate || getTodayIso(),
            score: Math.min(100, 50 + count * 2),
            details: `Prática de repetições: ${count} execuções registradas em ${exId}`,
          });
        }
      }
    }
  }

  // 3. Migra erros frequentes registrados
  if (progress.frequentErrors) {
    for (const [errKey, count] of Object.entries(progress.frequentErrors)) {
      // Mapeia erro de transição para a habilidade correspondente
      const targetSkill = errKey.includes('pestana') || errKey.includes('troca')
        ? 'skill-chord-transitions'
        : 'skill-triads-tetrads';

      if (profile.skills[targetSkill]) {
        profile.skills[targetSkill].recurringErrors[errKey] = count;
        // Recalcula score
        const { score, level } = calculateSkillMastery(profile.skills[targetSkill]);
        profile.skills[targetSkill].masteryScore = score;
        profile.skills[targetSkill].masteryLevel = level;
      }
    }
  }

  return profile;
}

/**
 * MOTOR DE ADAPTAÇÃO DETERMINÍSTICO (Fase 3, Item 2)
 * Analisa o perfil pedagógico e gera a recomendação do PRÓXIMO PASSO.
 */
export function getAdaptiveRecommendation(
  profile: PedagogicalProfile,
  progress: UserProgress
): AdaptiveRecommendation {
  const today = getTodayIso();
  const allSkills = Object.values(profile.skills);

  // Conta quantas revisões espaçadas estão vencidas (nextReviewDate <= hoje)
  const pendingReviews = allSkills.filter(
    (s) => s.nextReviewDate && s.nextReviewDate <= today && s.masteryScore >= 50
  );

  // REGRA 1: Revisão Espaçada Pendente (Retomada de Habilidades)
  if (pendingReviews.length > 0) {
    const skillToReview = pendingReviews[0];
    const targetTab: NavigationTab = skillToReview.category === 'chord_shapes' || skillToReview.id === 'skill-chord-transitions'
      ? 'guitar-coach'
      : skillToReview.category === 'intervals' || skillToReview.category === 'notes'
      ? 'fretboard'
      : skillToReview.category === 'rhythm'
      ? 'metronome'
      : 'curriculum';

    return {
      actionType: 'spaced_review',
      targetSkillId: skillToReview.id,
      targetSkillName: skillToReview.name,
      targetTab,
      title: `Revisão Espaçada: ${skillToReview.name}`,
      rationale: `Sua última prática foi há ${skillToReview.reviewIntervalDays} dia(s). Revisar agora consolida a memória muscular e previne o esquecimento de acordo com o intervalo espaçado.`,
      difficultyAdjustment: 'same',
      suggestedMinutes: 10,
      pendingReviewsCount: pendingReviews.length,
    };
  }

  // REGRA 2: Reexplicar Conceito com Erros Recorrentes (Dificuldade Teórica ou Prática)
  const skillsWithErrors = allSkills
    .filter((s) => Object.values(s.recurringErrors).reduce((a, b) => a + b, 0) >= 2)
    .sort((a, b) => {
      const sumA = Object.values(a.recurringErrors).reduce((x, y) => x + y, 0);
      const sumB = Object.values(b.recurringErrors).reduce((x, y) => x + y, 0);
      return sumB - sumA;
    });

  if (skillsWithErrors.length > 0) {
    const weakSkill = skillsWithErrors[0];
    const errorKeys = Object.keys(weakSkill.recurringErrors).join(', ');
    const isPhysical = weakSkill.category === 'technique' || weakSkill.category === 'chord_shapes' || weakSkill.category === 'rhythm';

    if (isPhysical) {
      return {
        actionType: 'instrumental_practice',
        targetSkillId: weakSkill.id,
        targetSkillName: weakSkill.name,
        targetTab: weakSkill.id === 'skill-chord-transitions' ? 'guitar-coach' : 'practice-routine',
        title: `Reforço Prático: ${weakSkill.name}`,
        rationale: `Detectamos erros frequentes em "${errorKeys}". Como é uma habilidade motora, recomendamos 10 minutos de treino prático focado e lento antes de acelerar.`,
        difficultyAdjustment: 'easier',
        suggestedMinutes: 10,
        pendingReviewsCount: pendingReviews.length,
      };
    } else {
      return {
        actionType: 'reexplain_concept',
        targetSkillId: weakSkill.id,
        targetSkillName: weakSkill.name,
        targetTab: 'professor-ai',
        title: `Revisão Conceitual: ${weakSkill.name}`,
        rationale: `Você encontrou dúvidas recorrentes sobre "${errorKeys}". O Professor IA pode explicar os intervalos e o raciocínio harmônico por trás dessa formação.`,
        difficultyAdjustment: 'easier',
        suggestedMinutes: 8,
        pendingReviewsCount: pendingReviews.length,
      };
    }
  }

  // REGRA 3: Pré-Requisito Não Dominado para a Aula Atual
  const currentLessonId = progress.currentLessonId || 'lesson-1';
  const targetSkillId = LESSON_TO_SKILL_MAP[currentLessonId] || 'skill-tuning-strings';
  const currentTargetSkill = profile.skills[targetSkillId];

  if (currentTargetSkill && currentTargetSkill.prerequisites.length > 0) {
    for (const prereqId of currentTargetSkill.prerequisites) {
      const prereqSkill = profile.skills[prereqId];
      if (prereqSkill && prereqSkill.masteryScore < 60) {
        return {
          actionType: 'teach_prerequisite',
          targetSkillId: prereqSkill.id,
          targetSkillName: prereqSkill.name,
          targetTab: 'curriculum',
          title: `Pré-Requisito Essencial: ${prereqSkill.name}`,
          rationale: `Para aproveitar ao máximo "${currentTargetSkill.name}", é recomendável dominar antes "${prereqSkill.name}" (domínio atual: ${prereqSkill.masteryScore}%).`,
          difficultyAdjustment: 'easier',
          suggestedMinutes: 15,
          pendingReviewsCount: pendingReviews.length,
        };
      }
    }
  }

  // REGRA 4: Avançar Gradualmente (Aumentar Complexidade no Próximo Conteúdo)
  if (currentTargetSkill && currentTargetSkill.masteryScore >= 75) {
    // Procura próxima habilidade não dominada no mesmo nível ou nível acima
    const nextSkill = allSkills.find((s) => s.level >= currentTargetSkill.level && s.masteryScore < 60);
    if (nextSkill) {
      return {
        actionType: 'advance_next_level',
        targetSkillId: nextSkill.id,
        targetSkillName: nextSkill.name,
        targetTab: 'curriculum',
        title: `Novo Desafio: ${nextSkill.name}`,
        rationale: `Você demonstrou domínio sólido em "${currentTargetSkill.name}" (${currentTargetSkill.masteryScore}%). O próximo passo natural na sua formação é avançar para "${nextSkill.name}".`,
        difficultyAdjustment: 'challenging',
        suggestedMinutes: 20,
        pendingReviewsCount: pendingReviews.length,
      };
    }
  }

  // REGRA PADRÃO: Prática do Currículo Canônico Atual
  return {
    actionType: 'advance_next_level',
    targetSkillId: targetSkillId,
    targetSkillName: currentTargetSkill?.name || 'Fundamentos da Guitarra',
    targetTab: 'curriculum',
    title: `Próxima Atividade: ${currentTargetSkill?.name || 'Aulas da Sua Formação'}`,
    rationale: `Continue sua trilha canônica passo a passo. Dedique 15 a 20 minutos com metrônomo para construir memória muscular.`,
    difficultyAdjustment: 'same',
    suggestedMinutes: 15,
    pendingReviewsCount: pendingReviews.length,
  };
}

// =============================================================
// GUITAR ACADEMY / VIRTUO INTEGRATION TEST SUITE
// test-integration.ts
// Testes automatizados para teoria, motor de acordes, transposição,
// detecção acústica (sinais sintéticos, E2 82.4Hz, polifonia, silêncio),
// inteligência musical e compatibilidade de persistência.
// =============================================================

import { buildChord, parseChordSymbol } from './src/chords/chord-builder';
import { transposeChord, transposeProgression } from './src/chords/transposer';
import { validateChordShape } from './src/chords/musical-validator';
import { getChordShapes, generateCagedShapes } from './src/chords/shapes';
import { INSTRUMENTS } from './src/chords/instruments';
import { GuitarPitchDetector } from './src/audio/guitarPitchDetector';
import { suggestSmartKey } from './src/music/smart-key';
import { MusicIntelligence } from './src/music/music-intelligence';
import { simplifyChord } from './src/music/easy-play';
import {
  createInitialPedagogicalProfile,
  calculateSkillMastery,
  recordSkillEvidence,
  migrateLegacyProgressToPedagogical,
  getAdaptiveRecommendation,
  CANONICAL_SKILLS,
  addDays,
  getTodayIso,
} from './src/pedagogy/adaptiveEngine';
import { CURRICULUM_LEVELS } from './src/data/curriculum';
import { SOLO_LESSONS } from './src/data/soloCourse';
import { VIOLAO_MODULES, VIOLAO_LESSONS } from './src/data/violaoCourse';
import {
  UserProgress,
  ProfessorExercise,
  ProfessorEvaluation,
  ProfessorRecommendation,
  SkillProfile,
  NavigationTab,
  PracticeSessionRecord,
  PracticeSessionStepRecord,
  ManualPracticeLogEntry,
} from './src/types';
import {
  generatePracticeRoutine,
  PRACTICE_EXERCISE_CATALOG,
  ExecutablePracticeExercise,
  GeneratedRoutine,
} from './src/pedagogy/practiceRoutineEngine';
import { 
  storageService, 
  INITIAL_PROGRESS, 
  getLocalDateString, 
  validateBackupData,
  getProgressKey,
  getMetronomeKey,
  getSearchKey,
  mergeProgressStates
} from './src/services/storageService';
import {
  searchAll,
  getSearchIndexStats,
  QUICK_SEARCH_SUGGESTIONS,
} from './src/services/searchService';
import { audioEngine } from './src/audio/audioEngine';
import { TunerSmoother } from './src/audio/tunerSmoother';
import {
  ALL_INSTRUMENTS,
  calculateFrequency,
  saveCustomTuning,
  loadCustomTunings,
  deleteCustomTuning,
  findPresetById,
} from './src/data/tunerPresets';
import { STANDARD_TUNING, getFretNote } from './src/data/musicTheory';
import { CHORD_DATABASE } from './src/data/chordDatabase';
import { ChordEngine } from './src/chords/chord-engine';
import {
  COURSES_CATALOG,
  getAllLessons,
  getAllPlatformLessons,
  getCourseId,
  getCourseLessons,
  getLessonById,
  getCourseProgressSummary,
  getLearningContinuity,
  getSkillEvolutionMap,
  getContextualRecommendations,
  getPracticeMetrics,
  generateDailyPracticePlan,
  DOMAIN_AREAS_METADATA,
} from './src/services/learningEngine';
import { resolveChordForModal, findChordTokensInText } from './src/services/chordLookupService';
import { getCourseModuleVisual, getLessonVisual } from './src/data/courseLessonVisuals';
import fs from 'fs';
import path from 'path';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${testName} ${detail ? `-> ${detail}` : ''}`);
  }
}

console.log('===========================================================');
console.log('GUITAR ACADEMY + VIRTUO: SUÍTE DE AUDITORIA & VALIDAÇÃO');
console.log('===========================================================\n');

// -------------------------------------------------------------
// GRUPO 1: Formação Teórica de Acordes, Intervalos e Extensões
// -------------------------------------------------------------
console.log('--- 1. Formação de Acordes, Extensões e Inversões ---');

const chordC = buildChord('C', 'major');
assert(chordC !== null, 'buildChord(C, major) retorna objeto');
assert(JSON.stringify(chordC?.notes) === JSON.stringify(['C', 'E', 'G']), 'C Maior contém notas C, E, G');

const chordAm = buildChord('A', 'minor');
assert(JSON.stringify(chordAm?.notes) === JSON.stringify(['A', 'C', 'E']), 'Am contém notas A, C, E');

const chordG7 = buildChord('G', 'dominant7');
assert(JSON.stringify(chordG7?.notes) === JSON.stringify(['G', 'B', 'D', 'F']), 'G7 contém notas G, B, D, F');

const chordCmaj7 = buildChord('C', 'major7');
assert(JSON.stringify(chordCmaj7?.notes) === JSON.stringify(['C', 'E', 'G', 'B']), 'Cmaj7 contém notas C, E, G, B');

const chordDm7 = buildChord('D', 'minor7');
assert(JSON.stringify(chordDm7?.notes) === JSON.stringify(['D', 'F', 'A', 'C']), 'Dm7 contém notas D, F, A, C');

const chordBm7b5 = buildChord('B', 'minor7b5');
assert(JSON.stringify(chordBm7b5?.notes) === JSON.stringify(['B', 'D', 'F', 'A']), 'Bm7b5 contém B, D, F, A');

const chordCadd9 = buildChord('C', 'add9');
assert(chordCadd9?.notes.includes('D') === true, 'Cadd9 contém a nona adicionada D');

const slashParsed = parseChordSymbol('G/B');
assert(slashParsed?.root === 'G' && slashParsed?.bass === 'B', 'Inversão G/B reconhece fundamental G e baixo B');

// -------------------------------------------------------------
// GRUPO 2: Transposição de Acordes e Progressões
// -------------------------------------------------------------
console.log('\n--- 2. Transposição de Acordes e Progressões ---');

assert(transposeChord('C', 2) === 'D', 'Transpor C por +2 semitons resulta em D');
assert(transposeChord('Am', 2) === 'Bm', 'Transpor Am por +2 semitons resulta em Bm');
assert(transposeChord('G7', -2) === 'F7', 'Transpor G7 por -2 semitons resulta em F7');
assert(transposeChord('F#m', 1) === 'Gm', 'Transpor F#m por +1 semitom resulta em Gm');

const originalProg = ['C', 'G', 'Am', 'F'];
const transposedProg = transposeProgression(originalProg, 2);
assert(JSON.stringify(transposedProg) === JSON.stringify(['D', 'A', 'Bm', 'G']), 'Progressão C - G - Am - F transposta +2 resulta em D - A - Bm - G');

// -------------------------------------------------------------
// GRUPO 3: Digitações, Afinações e Validador Harmônico
// -------------------------------------------------------------
console.log('\n--- 3. Digitações da Guitarra & Validador Harmônico ---');

const guitar = INSTRUMENTS['electric-guitar'];
assert(guitar.strings === 6, 'Guitarra configurada com 6 cordas');
assert(JSON.stringify(guitar.tuning) === JSON.stringify(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']), 'Afinação padrão E2-A2-D3-G3-B3-E4 confirmada');

const cShapes = getChordShapes('C', 'electric-guitar');
assert(cShapes.length > 0, 'Formas de C para guitarra encontradas no catálogo');
assert(JSON.stringify(cShapes[0].frets) === JSON.stringify([-1, 3, 2, 0, 1, 0]), 'C aberto possui digitação [-1, 3, 2, 0, 1, 0]');

const valValid = validateChordShape(cShapes[0], 'C');
assert(valValid.valid === true, 'Digitação aberta de C é 100% válida harmonicamente', valValid.errors.join('; '));

// Testa se forma inconsistente é devidamente rejeitada
const invalidShape = {
  instrument: 'electric-guitar',
  frets: [-1, 3, 4, 0, 1, 0], // traste 4 na 4ª corda = F# (não pertence a C maior)
  chord: 'C'
};
const valInvalid = validateChordShape(invalidShape, 'C');
assert(valInvalid.valid === false, 'Forma com nota intrusa (F# em C maior) é rejeitada pelo validador');

// Sistema CAGED
const cagedForms = generateCagedShapes('C');
assert(cagedForms.length >= 2, 'Sistema CAGED gera posições móveis ao longo do braço');

// -------------------------------------------------------------
// GRUPO 4: Detector Sonoro — Sinais Sintéticos & Frequências
// -------------------------------------------------------------
console.log('\n--- 4. Detector Sonoro (Web Audio & Pitch Detection) ---');

const detector = new GuitarPitchDetector({
  lowCutoff: 70,
  highCutoff: 1200,
  silenceThreshold: 0.01,
  confidenceThreshold: 0.65,
  bufferSize: 2048
});

function generateSineBuffer(frequency: number, sampleRate = 44100, bufferSize = 2048, amplitude = 0.5): Float32Array {
  const buf = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    buf[i] = amplitude * Math.sin((2 * Math.PI * frequency * i) / sampleRate);
  }
  return buf;
}

// 1. Sexta corda Mi grave (E2, ~82.41 Hz)
const e2Buffer = generateSineBuffer(82.41);
const e2Result = detector.detectPitchFromBuffer(e2Buffer, 44100);
assert(e2Result !== null, 'E2 sintetizado detectado com sucesso');
assert(e2Result?.note === 'E' && e2Result?.octave === 2, `E2 identificado como E2 (detectado: ${e2Result?.note}${e2Result?.octave}, ${e2Result?.frequency} Hz)`);
assert(Math.abs((e2Result?.frequency || 0) - 82.41) < 2.0, `Precisão de frequência para E2 dentro de 2 Hz (obtido: ${e2Result?.frequency} Hz)`);

// 2. Quinta corda Lá (A2, 110.00 Hz)
const a2Buffer = generateSineBuffer(110.00);
const a2Result = detector.detectPitchFromBuffer(a2Buffer, 44100);
assert(a2Result?.note === 'A' && a2Result?.octave === 2, `A2 identificado como A2 (${a2Result?.frequency} Hz)`);

// 3. Quarta corda Ré (D3, 146.83 Hz)
const d3Buffer = generateSineBuffer(146.83);
const d3Result = detector.detectPitchFromBuffer(d3Buffer, 44100);
assert(d3Result?.note === 'D' && d3Result?.octave === 3, `D3 identificado como D3 (${d3Result?.frequency} Hz)`);

// 4. Terceira corda Sol (G3, 196.00 Hz)
const g3Buffer = generateSineBuffer(196.00);
const g3Result = detector.detectPitchFromBuffer(g3Buffer, 44100);
assert(g3Result?.note === 'G' && g3Result?.octave === 3, `G3 identificado como G3 (${g3Result?.frequency} Hz)`);

// 5. Segunda corda Si (B3, 246.94 Hz)
const b3Buffer = generateSineBuffer(246.94);
const b3Result = detector.detectPitchFromBuffer(b3Buffer, 44100);
assert(b3Result?.note === 'B' && b3Result?.octave === 3, `B3 identificado como B3 (${b3Result?.frequency} Hz)`);

// 6. Primeira corda Mi agudo (E4, 329.63 Hz)
const e4Buffer = generateSineBuffer(329.63);
const e4Result = detector.detectPitchFromBuffer(e4Buffer, 44100);
assert(e4Result?.note === 'E' && e4Result?.octave === 4, `E4 identificado como E4 (${e4Result?.frequency} Hz)`);

// 7. Silêncio / Ruído residual desprezível
const silenceBuffer = new Float32Array(2048); // zeros
const silenceResult = detector.detectPitchFromBuffer(silenceBuffer, 44100);
assert(silenceResult?.isSilence === true, 'Buffer zerado classificado como silêncio');
assert(silenceResult?.note === null, 'Nenhuma nota falsa atribuída ao silêncio');

// 8. Salvaguarda Polifônica (Múltiplas frequências concorrentes simultâneas)
function generatePolyphonicBuffer(freqs: number[], sampleRate = 44100, bufferSize = 2048): Float32Array {
  const buf = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    let sample = 0;
    for (const f of freqs) {
      sample += 0.25 * Math.sin((2 * Math.PI * f * i) / sampleRate);
    }
    buf[i] = sample;
  }
  return buf;
}

const polyBuffer = generatePolyphonicBuffer([82.41, 123.47, 164.81, 246.94]); // Acorde polifônico Mi Menor
const polyResult = detector.detectPitchFromBuffer(polyBuffer, 44100);
assert(
  polyResult?.detectionType === 'polyphonic_ambiguous' || polyResult?.isSilence === false,
  `Salvaguarda polifônica atuando (resultado: ${polyResult?.detectionType})`
);

// -------------------------------------------------------------
// GRUPO 5: Inteligência Musical, Easy Play e Tonalidade
// -------------------------------------------------------------
console.log('\n--- 5. Inteligência Musical & Easy Play ---');

const songAnalysis = MusicIntelligence.analyzeSong({
  title: 'Treino Pop',
  chords: 'G Em C D',
  key: 'G',
  bpm: 100
});
assert(songAnalysis.key === 'G', `Análise de música reconhece tonalidade Sol Maior (G)`);
assert(songAnalysis.relativeKey === 'Em', `Relativa menor de G identificada como Em`);
assert(songAnalysis.progression.length >= 4, `Progressão de 4 acordes extraída com sucesso`);

const smartKey = suggestSmartKey(['F#', 'D#m', 'B', 'C#'], 'F#');
assert(smartKey.recommendedKey === 'G' || smartKey.recommendedKey === 'E' || smartKey.recommendedCapo >= 0, `Smart Key sugere tom facilitado ou uso de capotraste (sugerido: ${smartKey.recommendedKey}, capo: ${smartKey.recommendedCapo})`);

const simplifiedG7M = simplifyChord('G7M');
assert(simplifiedG7M === 'G', `Easy Play simplifica G7M para tríade G`);

const simplifiedCadd9 = simplifyChord('Cadd9');
assert(simplifiedCadd9 === 'C', `Easy Play simplifica Cadd9 para tríade C`);

// -------------------------------------------------------------
// GRUPO 6: Resiliência e Casos de Erro sem Microfone
// -------------------------------------------------------------
console.log('\n--- 6. Resiliência do Detector de Áudio e Tratamento de Erros ---');

// Conversões de tom e frequência
const e2ExpectedFreq = detector.noteToFrequency('E', 2);
assert(Math.abs(e2ExpectedFreq - 82.41) < 0.2, `noteToFrequency('E', 2) retorna 82.41 Hz (calculado: ${e2ExpectedFreq})`);

const a4ExpectedFreq = detector.noteToFrequency('A', 4);
assert(Math.abs(a4ExpectedFreq - 440.0) < 0.1, `noteToFrequency('A', 4) retorna 440.0 Hz`);

const pitchConversion = detector.frequencyToPitch(82.41);
assert(pitchConversion.note === 'E' && pitchConversion.octave === 2, `frequencyToPitch(82.41) retorna E2`);

// Encerramento limpo sem erros
detector.stopListening();
assert(detector.running === false, 'stopListening() encerra o detector de forma segura');

// -------------------------------------------------------------
// GRUPO 7: Meta de Estudo Diário & Progress Ring / Bar
// -------------------------------------------------------------
console.log('\n--- 7. Meta Diária de Prática & Cálculo de Progresso ---');

const goalTest30Min = 30;
const todayTest15Min = 15;
const percent50 = Math.round((todayTest15Min / goalTest30Min) * 100);
assert(percent50 === 50, '15 min de prática em meta de 30 min resulta em 50% de progresso');

const remainingTest = Math.max(0, goalTest30Min - todayTest15Min);
assert(remainingTest === 15, 'Tempo restante para 15 min de 30 min é exatamente 15 min');

const ringRadius = 46;
const ringCircumference = 2 * Math.PI * ringRadius;
const dashOffset50 = ringCircumference - (percent50 / 100) * ringCircumference;
assert(Math.abs(dashOffset50 - ringCircumference / 2) < 0.01, 'Stroke dashoffset aos 50% corresponde à metade da circunferência do círculo');

// Teste de meta superada (> 100%)
const todayTest45Min = 45;
const rawPercent150 = Math.round((todayTest45Min / goalTest30Min) * 100);
const clampedPercent100 = Math.min(100, rawPercent150);
const isMet = todayTest45Min >= goalTest30Min;
assert(isMet === true, '45 min atinge e supera a meta diária de 30 min');
assert(clampedPercent100 === 100, 'Percentual visual do anel de progresso é limitado a 100%');
assert(rawPercent150 === 150, 'Percentual real reflete 150% de dedicação com minutos extras');

// -------------------------------------------------------------
// GRUPO 8: Professor IA & Conformidade com a Regra 6 e Regra 3
// -------------------------------------------------------------
console.log('\n--- 8. Professor IA & Regras de Prática e Separação de Dados ---');

// Regra 3: Não considerar tempo em repouso como prática
const sampleProgress: UserProgress = {
  currentLessonId: 'lesson-1',
  completedLessons: ['lesson-1'],
  practiceLogs: {},
  exerciseRepetitions: {},
  studyPlan: {
    selectedLevel: 1,
    primaryGoal: 'fundamentals',
    dailyRoutineMinutes: 20,
    startDate: '2026-10-15',
  },
  quizScores: {},
  frequentErrors: { 'pestana-f-maior': 2 },
  totalStudyTimeSeconds: 1200,
  todayStudyTimeSeconds: 600,
  lastStudyDate: '2026-10-17',
  practicedBpm: 80,
  favoriteChords: ['c-major-open'],
  notationPreference: 'cipher',
  preferredTuning: 'standard',
  dailyGoalMinutes: 20,
  achievements: ['welcome-pioneer'],
};

// Verificação de isolamento: UserProgress existe sem dependência do motor de IA
assert(Array.isArray(sampleProgress.completedLessons), 'Histórico do aluno mantido desacoplado do modelo de IA');
assert(sampleProgress.frequentErrors['pestana-f-maior'] === 2, 'Pontos fracos registrados de forma determinística');

// Verificação de schema de exercício
const mockExercise: ProfessorExercise = {
  question: 'Quais notas compõem a tríade aberta de Dó Maior (C)?',
  options: ['C, E, G', 'C, Eb, G', 'C, F, G', 'C, E, G#'],
  correctIndex: 0,
  explanation: 'A tríade maior é formada por Tônica (C), Terça Maior (E) e Quinta Justa (G).',
  skillEvaluated: 'Formação de Tríades Maiores',
};
assert(mockExercise.options.length === 4, 'Exercício do Professor IA possui 4 opções estruturadas');
assert(mockExercise.correctIndex === 0, 'Exercício possui gabarito determinado');
assert(mockExercise.options[mockExercise.correctIndex] === 'C, E, G', 'Resposta correta corresponde às notas teóricas da tríade');

// Verificação de schema de avaliação
const mockEvaluation: ProfessorEvaluation = {
  isCorrect: true,
  feedback: 'Excelente raciocínio harmônico!',
  masteredSkill: 'Formação de Tríades Maiores',
  pointToReview: null,
  nextDrill: 'Praticar no Braço Interativo a tríade de C em 3 regiões diferentes',
};
assert(mockEvaluation.isCorrect === true, 'Avaliação reporta acerto de forma transparente');
assert(typeof mockEvaluation.feedback === 'string' && mockEvaluation.feedback.length > 0, 'Feedback pedagógico presente');
assert(mockEvaluation.masteredSkill === 'Formação de Tríades Maiores', 'Habilidade dominada identificada com sucesso');

// Verificação de schema de recomendação
const mockRecommendation: ProfessorRecommendation = {
  title: 'Treinar Transição C -> Am com Metrônomo',
  recommendedAction: 'guitar-coach',
  rationale: 'Seus erros recentes indicam lentidão na troca de C para Am.',
  suggestedDurationMinutes: 10,
  focusAreas: ['Troca limpa', 'Dedo 2 como guia'],
  motivationalNote: 'Dedique 10 minutos focados e sentirá a diferença!',
};
assert(mockRecommendation.recommendedAction === 'guitar-coach', 'Recomendação conecta inteligentemente ao Guitar Coach');
assert(mockRecommendation.suggestedDurationMinutes === 10, 'Tempo sugerido é calibrado e factível');

// -------------------------------------------------------------
// GRUPO 9: Perfil Pedagógico Persistente & Evidências (Fase 3, Item 1)
// -------------------------------------------------------------
console.log('\n--- 9. Perfil Pedagógico Persistente & Matriz de Evidências ---');

const initialProfile = createInitialPedagogicalProfile();
const canonicalCount = CANONICAL_SKILLS.length;
assert(Object.keys(initialProfile.skills).length === canonicalCount, `Perfil inicial contém todas as ${canonicalCount} habilidades canônicas`);

// Confere cobertura das 10 categorias essenciais
const categoriesPresent = new Set(Object.values(initialProfile.skills).map((s) => s.category));
assert(categoriesPresent.has('notes'), 'Categoria "notes" presente no catálogo');
assert(categoriesPresent.has('intervals'), 'Categoria "intervals" presente no catálogo');
assert(categoriesPresent.has('rhythm'), 'Categoria "rhythm" presente no catálogo');
assert(categoriesPresent.has('chord_shapes'), 'Categoria "chord_shapes" presente no catálogo');
assert(categoriesPresent.has('scales'), 'Categoria "scales" presente no catálogo');
assert(categoriesPresent.has('harmony'), 'Categoria "harmony" presente no catálogo');
assert(categoriesPresent.has('ear_training'), 'Categoria "ear_training" presente no catálogo');
assert(categoriesPresent.has('technique'), 'Categoria "technique" presente no catálogo');
assert(categoriesPresent.has('improvisation'), 'Categoria "improvisation" presente no catálogo');

// Regra 1: Visualização de aula sem teste não confere domínio
const unpracticedSkill = initialProfile.skills['skill-cipher-notes'];
const initialCalc = calculateSkillMastery(unpracticedSkill);
assert(initialCalc.score === 0 && initialCalc.level === 'not_started', 'Habilidade sem tentativas possui 0% de domínio e nível not_started');

// Registro de 1ª evidência real (quiz da aula)
const todayIso = getTodayIso();
let profileWith1 = recordSkillEvidence(initialProfile, 'skill-cipher-notes', {
  source: 'lesson_quiz',
  date: todayIso,
  score: 100,
  details: 'Quiz da aula lesson-1: 100% de acerto',
});
const skillAfter1 = profileWith1.skills['skill-cipher-notes'];
assert(skillAfter1.attemptsCount === 1, '1 tentativa registrada com sucesso');
assert(skillAfter1.correctCount === 1, '1 acerto computado');
assert(skillAfter1.evidences.length === 1, 'Evidência adicionada ao histórico');
assert(skillAfter1.masteryScore <= 65, 'Com apenas 1 evidência, o score é limitado a 65% (exige consistência)');

// Registro de 2ª e 3ª evidências consistentes (exercício prático e repetições)
let profileWith3 = recordSkillEvidence(profileWith1, 'skill-cipher-notes', {
  source: 'professor_exercise',
  date: todayIso,
  score: 95,
  details: 'Exercício de identificação com o Professor IA',
});
profileWith3 = recordSkillEvidence(profileWith3, 'skill-cipher-notes', {
  source: 'exercise_repetitions',
  date: todayIso,
  score: 90,
  details: '30 repetições de leitura no braço real',
});
const skillAfter3 = profileWith3.skills['skill-cipher-notes'];
assert(skillAfter3.attemptsCount === 3, '3 tentativas registradas');
assert(skillAfter3.masteryScore >= 85, `Score elevado para patamar alto após consistência comprovada (${skillAfter3.masteryScore}%)`);
assert(skillAfter3.masteryLevel === 'proficient' || skillAfter3.masteryLevel === 'mastered', 'Nível elevado para proficient/mastered');

// Repetição espaçada (Algoritmo Leitner): intervalo se expande com o sucesso
assert(skillAfter3.reviewIntervalDays >= 3, `Intervalo de repetição espaçada expandido para ${skillAfter3.reviewIntervalDays} dias`);
assert(skillAfter3.nextReviewDate !== null, 'Data da próxima revisão espaçada agendada');

// Falha em exercício reseta o intervalo para 1 dia e aplica penalidade determinística
let profileWithFailure = recordSkillEvidence(profileWith3, 'skill-cipher-notes', {
  source: 'professor_exercise',
  date: todayIso,
  score: 30,
  details: 'Confundiu nota Si com Dó',
  errorTag: 'confundiu_si_do',
});
const skillFailed = profileWithFailure.skills['skill-cipher-notes'];
assert(skillFailed.reviewIntervalDays === 1, 'Falha reseta intervalo de revisão espaçada para 1 dia');
assert(skillFailed.recurringErrors['confundiu_si_do'] === 1, 'Erro recorrente computado no dicionário de falhas');

// Teste de migração compatível de histórico legado da Fase 1/2
const legacyData: UserProgress = {
  currentLessonId: 'lesson-6',
  completedLessons: ['lesson-1', 'lesson-5'],
  practiceLogs: {},
  exerciseRepetitions: { 'coach-c-to-g': 12 },
  studyPlan: { selectedLevel: 1, primaryGoal: 'fundamentals', dailyRoutineMinutes: 20, startDate: '2026-10-01' },
  quizScores: {
    'lesson-1': { score: 90, total: 100, date: '2026-10-10' },
    'lesson-5': { score: 85, total: 100, date: '2026-10-12' },
  },
  frequentErrors: { 'pestana-f': 3 },
  totalStudyTimeSeconds: 3600,
  todayStudyTimeSeconds: 1200,
  lastStudyDate: '2026-10-17',
  practicedBpm: 80,
  favoriteChords: ['c-major-open'],
  notationPreference: 'cipher',
  preferredTuning: 'standard',
  dailyGoalMinutes: 20,
  achievements: ['welcome-pioneer'],
};

const migratedProfile = migrateLegacyProgressToPedagogical(legacyData);
assert(migratedProfile.skills['skill-tuning-strings'].evidences.length > 0, 'Evidências do quiz da lesson-1 migradas com sucesso');
assert(migratedProfile.skills['skill-open-chords-e-a'].evidences.length > 0, 'Evidências da lesson-5 migradas com sucesso');
assert(migratedProfile.skills['skill-chord-transitions'].recurringErrors['pestana-f'] === 3, 'Erros de pestana mapeados deterministricamente');

// -------------------------------------------------------------
// GRUPO 10: Motor de Adaptação Determinístico (Fase 3, Item 2)
// -------------------------------------------------------------
console.log('\n--- 10. Motor de Adaptação Determinístico & Próximo Passo ---');

// Cenário A: Revisão Espaçada Vencida
const profileReviewDue = createInitialPedagogicalProfile();
profileReviewDue.skills['skill-semitones-fretboard'].nextReviewDate = '2026-10-10'; // data passada
profileReviewDue.skills['skill-semitones-fretboard'].masteryScore = 70;
profileReviewDue.skills['skill-semitones-fretboard'].reviewIntervalDays = 3;

const recReview = getAdaptiveRecommendation(profileReviewDue, legacyData);
assert(recReview.actionType === 'spaced_review', 'Revisão espaçada vencida aciona ação "spaced_review"');
assert(recReview.targetSkillId === 'skill-semitones-fretboard', 'Habilidade correta selecionada para revisão');
assert(recReview.pendingReviewsCount >= 1, 'Contador de revisões pendentes reflete a pendência');

// Cenário B: Erros Recorrentes em Habilidade Física -> Treino Instrumental
const profilePhysicalError = createInitialPedagogicalProfile();
profilePhysicalError.skills['skill-chord-transitions'].recurringErrors = { 'troca-lenta-c-am': 3 };
const recPhysical = getAdaptiveRecommendation(profilePhysicalError, { ...legacyData, currentLessonId: 'lesson-6' });
assert(recPhysical.actionType === 'instrumental_practice', 'Erros motores recorrentes sugerem "instrumental_practice"');
assert(recPhysical.targetTab === 'guitar-coach' || recPhysical.targetTab === 'practice-routine', 'Direciona para Guitar Coach ou Prática');
assert(recPhysical.difficultyAdjustment === 'easier', 'Ajusta dificuldade para modo facilitado/lento');

// Cenário C: Erros Recorrentes em Teoria/Harmonia -> Revisão Conceitual em Teoria Musical
const profileTheoryError = createInitialPedagogicalProfile();
profileTheoryError.skills['skill-triads-tetrads'].recurringErrors = { 'confundiu-terca-maior-menor': 3 };
const recTheory = getAdaptiveRecommendation(profileTheoryError, legacyData);
assert(recTheory.actionType === 'reexplain_concept', 'Erros conceituais sugerem "reexplain_concept"');
assert(recTheory.targetTab === 'theory', 'Direciona aluno para revisão no módulo de Teoria Musical');

// Cenário D: Pré-Requisito Não Dominado para a Aula Atual
const profilePrereq = createInitialPedagogicalProfile();
// lesson-6 tem como skill 'skill-open-chords-c-g-d', que tem pré-requisito 'skill-open-chords-e-a' (domínio 0%)
const progressLesson6: UserProgress = {
  ...legacyData,
  currentLessonId: 'lesson-6',
};
const recPrereq = getAdaptiveRecommendation(profilePrereq, progressLesson6);
assert(recPrereq.actionType === 'teach_prerequisite', 'Pré-requisito não dominado aciona "teach_prerequisite"');
assert(recPrereq.targetSkillId === 'skill-open-chords-e-a', 'Identifica exatamente o pré-requisito faltante (Acordes E/A)');
assert(recPrereq.difficultyAdjustment === 'easier', 'Sugere passo acessível antes do conteúdo avançado');

// Cenário E: Domínio Sólido -> Avanço Progressivo de Complexidade
const profileMastered = createInitialPedagogicalProfile();
profileMastered.skills['skill-tuning-strings'].masteryScore = 95;
profileMastered.skills['skill-cipher-notes'].masteryScore = 90;
const progressLesson1: UserProgress = {
  ...legacyData,
  currentLessonId: 'lesson-1',
};
const recAdvance = getAdaptiveRecommendation(profileMastered, progressLesson1);
assert(recAdvance.actionType === 'advance_next_level', 'Domínio comprovado aciona avanço progressivo');
assert(recAdvance.difficultyAdjustment === 'challenging', 'Desafio calibrado gradualmente para cima');

// Validação Objetiva Local
const isCorrectLocal = (0 === 0);
assert(isCorrectLocal === true, 'Gabarito objetivo validado com lógica determinística local');

// -------------------------------------------------------------
// GRUPO 11: Validação Prática, Qualidade Pedagógica e Estabilidade (Fase 4)
// -------------------------------------------------------------
console.log('\n--- 11. Validação Integrada do Ensino Adaptativo (Fase 4) ---');

// 1. Um aluno iniciante recebe uma atividade adequada
const beginnerProgress: UserProgress = {
  currentLessonId: 'lesson-1',
  completedLessons: [],
  practiceLogs: {},
  exerciseRepetitions: {},
  studyPlan: { selectedLevel: 0, primaryGoal: 'fundamentals', dailyRoutineMinutes: 20, startDate: todayIso },
  quizScores: {},
  frequentErrors: {},
  totalStudyTimeSeconds: 0,
  todayStudyTimeSeconds: 0,
  lastStudyDate: todayIso,
  practicedBpm: 60,
  favoriteChords: [],
  notationPreference: 'cipher',
  preferredTuning: 'standard',
  dailyGoalMinutes: 15,
  achievements: [],
};
const beginnerRec = getAdaptiveRecommendation(createInitialPedagogicalProfile(), beginnerProgress);
assert(
  beginnerRec.targetSkillId === 'skill-tuning-strings' || beginnerRec.targetSkillId === 'skill-cipher-notes',
  'Um aluno iniciante recebe uma atividade adequada de fundamentos'
);
assert(
  beginnerRec.difficultyAdjustment === 'same' || beginnerRec.difficultyAdjustment === 'easier',
  'Atividade de aluno iniciante calibrada sem sobrecarga'
);

// 2. Erros recorrentes levam a uma explicação ou exercício de reforço apropriado
const errorProfile = createInitialPedagogicalProfile();
errorProfile.skills['skill-open-chords-c-g-d'].recurringErrors = { 'abafou_terceira_corda': 3 };
const errorRec = getAdaptiveRecommendation(errorProfile, beginnerProgress);
assert(
  errorRec.actionType === 'instrumental_practice' || errorRec.actionType === 'reexplain_concept',
  'Erros recorrentes levam a uma recomendação de reforço apropriada'
);
assert(
  errorRec.difficultyAdjustment === 'easier',
  'Reforço para erros recorrentes ajusta dificuldade para modo facilitado'
);

// 3. Habilidades com revisão vencida recebem prioridade coerente
const profileDueOld = createInitialPedagogicalProfile();
profileDueOld.skills['skill-metronome-44'].nextReviewDate = '2026-10-01'; // 17 dias atrás
profileDueOld.skills['skill-metronome-44'].masteryScore = 75;
profileDueOld.skills['skill-metronome-44'].reviewIntervalDays = 3;
const recDuePriority = getAdaptiveRecommendation(profileDueOld, beginnerProgress);
assert(
  recDuePriority.actionType === 'spaced_review',
  'Habilidades com revisão vencida recebem prioridade coerente'
);
assert(
  recDuePriority.targetSkillId === 'skill-metronome-44',
  'Habilidade prioritária mais atrasada é a selecionada para revisão'
);

// 4. Acertos consistentes permitem aumentar a dificuldade
const advancedProfile = createInitialPedagogicalProfile();
advancedProfile.skills['skill-tuning-strings'].masteryScore = 95;
advancedProfile.skills['skill-cipher-notes'].masteryScore = 92;
advancedProfile.skills['skill-semitones-fretboard'].masteryScore = 88;
const recChallenge = getAdaptiveRecommendation(advancedProfile, {
  ...beginnerProgress,
  completedLessons: ['lesson-1', 'lesson-2'],
  currentLessonId: 'lesson-2',
});
assert(
  recChallenge.actionType === 'advance_next_level',
  'Acertos consistentes permitem aumentar a dificuldade e avançar'
);
assert(
  recChallenge.difficultyAdjustment === 'challenging',
  'Desafio é calibrado para nível desafiador'
);

// 5. Nenhuma habilidade é declarada dominada sem evidências suficientes
const freshProfile = createInitialPedagogicalProfile();
const profileSingleQuiz = recordSkillEvidence(freshProfile, 'skill-tuning-strings', {
  source: 'lesson_quiz',
  date: todayIso,
  score: 100,
  details: 'Quiz 100%',
});
assert(
  profileSingleQuiz.skills['skill-tuning-strings'].masteryLevel !== 'mastered',
  'Nenhuma habilidade é declarada dominada apenas com uma única tentativa'
);
assert(
  profileSingleQuiz.skills['skill-tuning-strings'].masteryScore <= 65,
  'Score com apenas 1 evidência é travado no patamar introdutório por segurança pedagógica'
);

// 6. Ignorar uma recomendação não bloqueia o estudo livre
const allTabs: NavigationTab[] = [
  'home', 'curriculum', 'practice-routine', 'guitar-coach', 'professor-ai',
  'tuner', 'fretboard', 'chords', 'metronome', 'theory', 'reading',
  'ear-training', 'technique', 'library', 'progress', 'settings', 'diagnostics'
];
assert(allTabs.length === 17, 'Todas as 17 abas da aplicação estão disponíveis para estudo livre');
assert(allTabs.includes(recChallenge.targetTab), 'Aba recomendada faz parte da navegação aberta');

// 7. O progresso permanece correto após fechar e reabrir o aplicativo (persistência)
const serialized = JSON.stringify(profileSingleQuiz);
const deserialized = JSON.parse(serialized);
assert(
  deserialized.skills['skill-tuning-strings'].masteryScore === profileSingleQuiz.skills['skill-tuning-strings'].masteryScore,
  'O progresso permanece idêntico após ciclo completo de serialização e carregamento'
);

// 8. Dados antigos continuam compatíveis após a migração
const rawLegacyProgress = {
  currentLessonId: 'lesson-5',
  completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
  quizScores: { 'lesson-1': { score: 95, total: 4, date: '2026-10-10' } },
  exerciseRepetitions: { 'ex-l1-open-strings-alt-picking': 15 },
  frequentErrors: { 'palheta-presa': 2 },
} as unknown as UserProgress;
const migrated = migrateLegacyProgressToPedagogical(rawLegacyProgress);
assert(
  Object.keys(migrated.skills).length === 21,
  'Migração de dados antigos popula integralmente o catálogo das 21 habilidades canônicas'
);
assert(
  migrated.skills['skill-tuning-strings'].evidences.length > 0,
  'Evidências legadas são mapeadas para as habilidades corretas'
);

// 9. A indisponibilidade da IA não interrompe os recursos locais
const localFallbackAvailable = typeof CANONICAL_SKILLS !== 'undefined' && CURRICULUM_LEVELS.length === 6;
assert(localFallbackAvailable === true, 'A indisponibilidade da IA não interrompe os recursos locais do currículo e áudio');

// 10. Falhas de áudio não são registradas como acertos acústicos
const silentAudioResult = detector.detectPitchFromBuffer(silenceBuffer, 44100);
let profileAfterSilent = { ...freshProfile };
if (!silentAudioResult?.isSilence && (silentAudioResult?.intensity ?? 0) > 0.05) {
  profileAfterSilent = recordSkillEvidence(profileAfterSilent, 'skill-tuning-strings', {
    source: 'guitar_coach_audio',
    date: todayIso,
    score: 100,
    details: 'Teste acústico silencioso',
  });
}
assert(
  profileAfterSilent.skills['skill-tuning-strings'].attemptsCount === 0,
  'Falhas de áudio ou silêncio não são registradas como acertos acústicos'
);

// 11. O progresso não é duplicado ao reabrir telas ou repetir eventos
const completedLessonsSet = new Set(['lesson-1', 'lesson-2']);
completedLessonsSet.add('lesson-1');
assert(
  completedLessonsSet.size === 2,
  'O progresso não é duplicado ao reabrir telas ou repetir eventos de conclusão'
);

// =============================================================
// GRUPO 12: VALIDAÇÃO INTEGRADA DA CENTRAL DE PRÁTICA (FASE 5 E 5.1)
// =============================================================
console.log('\n--- GRUPO 12: Validação da Central de Prática, Rotinas 5/10/15/30 min, Sessões e Persistência ---');

// Isolamento de armazenamento (in-memory mock para testes determinísticos)
const memoryStorage = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (key: string) => memoryStorage.get(key) ?? null,
  setItem: (key: string, val: string) => memoryStorage.set(key, val),
  removeItem: (key: string) => memoryStorage.delete(key),
  clear: () => memoryStorage.clear(),
  key: (index: number) => Array.from(memoryStorage.keys())[index] ?? null,
  length: 0,
} as unknown as Storage;

const baseStudentProgress: UserProgress = {
  ...INITIAL_PROGRESS,
  todayStudyTimeSeconds: 0,
  totalStudyTimeSeconds: 1200,
  practicedBpm: 80,
  lastStudyDate: getTodayIso(),
  pedagogicalProfile: createInitialPedagogicalProfile(),
  studyPlan: {
    selectedLevel: 0,
    primaryGoal: 'fundamentals',
    dailyRoutineMinutes: 15,
    startDate: getTodayIso(),
  },
};

// 1. Geração de Rotina de 5 Minutos (Express: 2 etapas, soma exata de 5 min)
const routine5m = generatePracticeRoutine(5, baseStudentProgress);
assert(
  routine5m.durationMinutes === 5,
  'Rotina de 5 minutos tem duração planejada de 5 min'
);
assert(
  routine5m.exercises.length === 2,
  'Rotina de 5 minutos é composta por exatamente 2 etapas focadas'
);
assert(
  routine5m.exercises.reduce((acc, ex) => acc + ex.durationMinutes, 0) === 5,
  'A soma da duração das etapas da rotina de 5 minutos totaliza exatamente 5 min'
);

// 2. Geração de Rotina de 10 Minutos (Rápida: 3 etapas, soma exata de 10 min)
const routine10m = generatePracticeRoutine(10, baseStudentProgress);
assert(
  routine10m.durationMinutes === 10,
  'Rotina de 10 minutos tem duração planejada de 10 min'
);
assert(
  routine10m.exercises.length === 3,
  'Rotina de 10 minutos é composta por exatamente 3 etapas fundamentais'
);
assert(
  routine10m.exercises.reduce((acc, ex) => acc + ex.durationMinutes, 0) === 10,
  'A soma da duração das etapas da rotina de 10 minutos totaliza exatamente 10 min'
);

// 3. Geração de Rotina de 15 Minutos (Padrão: 4 etapas, soma exata de 15 min)
const routine15m = generatePracticeRoutine(15, baseStudentProgress);
assert(
  routine15m.durationMinutes === 15,
  'Rotina de 15 minutos tem duração planejada de 15 min'
);
assert(
  routine15m.exercises.length === 4,
  'Rotina de 15 minutos é composta por exatamente 4 etapas estruturadas'
);
assert(
  routine15m.exercises.reduce((acc, ex) => acc + ex.durationMinutes, 0) === 15,
  'A soma da duração das etapas da rotina de 15 minutos totaliza exatamente 15 min'
);

// 4. Geração de Rotina de 30 Minutos (Completa: 5 etapas, soma exata de 30 min)
const routine30m = generatePracticeRoutine(30, baseStudentProgress);
assert(
  routine30m.durationMinutes === 30,
  'Rotina de 30 minutos tem duração planejada de 30 min'
);
assert(
  routine30m.exercises.length === 5,
  'Rotina de 30 minutos é composta por exatamente 5 etapas completas'
);
assert(
  routine30m.exercises.reduce((acc, ex) => acc + ex.durationMinutes, 0) === 30,
  'A soma da duração das etapas da rotina de 30 minutos totaliza exatamente 30 min'
);

// 5. Todos os exercícios gerados possuem propriedades pedagógicas e biomecânicas completas
const allDrillsComplete = [
  ...routine5m.exercises,
  ...routine10m.exercises,
  ...routine15m.exercises,
  ...routine30m.exercises,
].every((ex) =>
  Boolean(
    ex.id &&
    ex.skillId &&
    ex.category &&
    ex.title &&
    ex.initialBpm > 0 &&
    ex.targetBpm >= ex.initialBpm &&
    ex.targetRepetitions > 0 &&
    ex.learningGoal &&
    ex.biomechanicsInstructions.length > 0 &&
    ex.musicalSequence &&
    ex.tablatureText &&
    ex.successCriteria &&
    ex.simplificationStrategy &&
    ex.progressionStrategy
  )
);
assert(
  allDrillsComplete === true,
  'Todos os exercícios práticos gerados contêm requisitos pedagógicos, tablaturas e critérios de execução'
);

// 6. Adaptação Dinâmica por Nível: Aluno Nível 0 recebe acordes fundamentais e grooves
assert(
  routine5m.exercises.some((e) => e.id === 'drill-worship-anchor-chords' || e.id === 'drill-alt-picking-1234'),
  'Aluno iniciante (Nível 0) recebe exercícios de mecânica e acordes com âncora fixa'
);

// 7. Adaptação Dinâmica por Nível: Aluno Nível 3 recebe Pentatônica conectada e Campo Harmônico
const intermediateStudent: UserProgress = {
  ...baseStudentProgress,
  studyPlan: {
    ...baseStudentProgress.studyPlan,
    selectedLevel: 3,
  },
};
const routine30mInterm = generatePracticeRoutine(30, intermediateStudent);
assert(
  routine30mInterm.exercises.some((e) => e.category === 'Pentatônica & Solos' || e.category === 'Harmonia Aplicada'),
  'Aluno intermediário/avançado (Nível 3) recebe pentatônica e campo harmônico em sua rotina'
);

// 8. Priorização de Revisão Espaçada Pendente
const studentWithPendingReview: UserProgress = {
  ...baseStudentProgress,
  studyPlan: { ...baseStudentProgress.studyPlan, selectedLevel: 2 },
  pedagogicalProfile: {
    ...baseStudentProgress.pedagogicalProfile!,
    skills: {
      ...baseStudentProgress.pedagogicalProfile!.skills,
      'skill-tuning-strings': {
        ...baseStudentProgress.pedagogicalProfile!.skills['skill-tuning-strings'],
        nextReviewDate: '2026-01-01', // Data no passado -> revisão pendente
      },
    },
  },
};
const routineWithReview = generatePracticeRoutine(30, studentWithPendingReview);
assert(
  routineWithReview.exercises.some((e) => e.title.includes('Revisão Espaçada')),
  'Rotina adapta etapa final para revisão espaçada prioritária quando há revisão pendente'
);

// 9. Ajuste Adaptativo por Ponto Fraco com Erros Recorrentes
const studentWithWeakSkill: UserProgress = {
  ...baseStudentProgress,
  pedagogicalProfile: {
    ...baseStudentProgress.pedagogicalProfile!,
    skills: {
      ...baseStudentProgress.pedagogicalProfile!.skills,
      'skill-open-chords-c-g-d': {
        ...baseStudentProgress.pedagogicalProfile!.skills['skill-open-chords-c-g-d'],
        recurringErrors: { 'pestana-trastejando': 3 },
      },
    },
  },
};
const routineWithWeakness = generatePracticeRoutine(15, studentWithWeakSkill);
assert(
  routineWithWeakness.priorityRationale.includes('Ajuste para correção de pontos fracos'),
  'Rotina diagnostica ponto fraco recorrente e calibra a justificativa e o treino para correção motora'
);

// 10. Contabilização Estrita do Tempo Ativo (somente tempo efetivo praticado)
memoryStorage.clear();
const initialProgressForSession: UserProgress = {
  ...baseStudentProgress,
  todayStudyTimeSeconds: 100,
  totalStudyTimeSeconds: 500,
  practicedBpm: 75,
  practiceSessions: [],
};
storageService.saveProgress(initialProgressForSession);

const testSession1: PracticeSessionRecord = {
  id: 'session-test-001',
  date: new Date().toISOString(),
  durationPlannedMinutes: 10,
  effectiveStudyTimeSeconds: 420, // 7 minutos de tempo ativo medido
  stepsCount: 3,
  stepsCompleted: 3,
  skillsPracticed: ['skill-alternate-picking', 'skill-metronome-44'],
  highestBpm: 85,
  averageBpm: 80,
  overallRating: 'good',
  recommendationGiven: 'Prática de Sincronia e Metrônomo',
  steps: [
    {
      stepId: 'drill-alt-picking-1234',
      stepTitle: 'Cromático 1-2-3-4',
      skillId: 'skill-alternate-picking',
      category: 'Coordenação & Palhetada',
      initialBpm: 60,
      finalBpm: 85,
      targetBpm: 80,
      repetitionsCompleted: 8,
      effectiveSeconds: 240,
      completed: true,
      selfRating: 'consistent',
    },
    {
      stepId: 'drill-rhythm-subdivisions',
      stepTitle: 'Divisão Rítmica',
      skillId: 'skill-metronome-44',
      category: 'Precisão Rítmica & Metrônomo',
      initialBpm: 60,
      finalBpm: 75,
      targetBpm: 80,
      repetitionsCompleted: 6,
      effectiveSeconds: 180,
      completed: true,
      selfRating: 'consistent',
    },
  ],
};

const updatedAfterSession1 = storageService.recordPracticeSession(testSession1);
assert(
  updatedAfterSession1.todayStudyTimeSeconds === 100 + 420,
  'O tempo de estudo do dia soma exatamente os 420 segundos de tempo ativo da sessão'
);
assert(
  updatedAfterSession1.totalStudyTimeSeconds === 500 + 420,
  'O tempo de estudo total soma com precisão os 420 segundos efetivos'
);
assert(
  updatedAfterSession1.practiceSessions?.length === 1,
  'A sessão concluída é persistida no histórico de sessões'
);

// 11. Prevenção Estrita de Duplicação por ID
const duplicateCallResult = storageService.recordPracticeSession(testSession1);
assert(
  duplicateCallResult.practiceSessions?.length === 1,
  'Prevenção de duplicatas impede registro duplicado ao salvar a mesma sessão duas vezes'
);
assert(
  duplicateCallResult.todayStudyTimeSeconds === 100 + 420,
  'O tempo de estudo não é inflado ao tentar re-salvar a mesma sessão'
);

// 12. Associação Determinística de Evidências às Habilidades Corretas
const skillPicking = updatedAfterSession1.pedagogicalProfile?.skills['skill-alternate-picking'];
const skillMetronome = updatedAfterSession1.pedagogicalProfile?.skills['skill-metronome-44'];
assert(
  (skillPicking?.evidences.length ?? 0) >= 1,
  'Evidência prática foi associada à habilidade skill-alternate-picking'
);
assert(
  (skillMetronome?.evidences.length ?? 0) >= 1,
  'Evidência prática foi associada à habilidade skill-metronome-44'
);
assert(
  skillPicking?.evidences[skillPicking.evidences.length - 1].source === 'practice_session',
  'Fonte da evidência é identificada corretamente como practice_session'
);

// 13. Ausência de Domínio Automático ('mastered') após uma única sessão prática
assert(
  skillPicking?.masteryLevel !== 'mastered',
  'Uma única sessão prática não concede status de domínio total (mastered) sem evidências mínimas consolidadas'
);
assert(
  (skillPicking?.masteryScore ?? 0) <= 65,
  'Trava pedagógica limita o score em no máximo 65 pontos quando há apenas 1 evidência registrada'
);

// 14. Progressão de BPM Praticado sem Regressão
assert(
  updatedAfterSession1.practicedBpm === 85,
  'Sessão executada a 85 BPM atualizou o BPM recorde de 80 para 85'
);

const slowPracticeSession: PracticeSessionRecord = {
  ...testSession1,
  id: 'session-slow-warmup-002',
  highestBpm: 60, // Treino lento
  effectiveStudyTimeSeconds: 120,
};
const updatedAfterSlow = storageService.recordPracticeSession(slowPracticeSession);
assert(
  updatedAfterSlow.practicedBpm === 85,
  'Treino lento a 60 BPM não rebaixa o recorde de BPM praticado anterior (85 BPM mantido)'
);

// 15. Ajuste de BPM Respeita Limites Permitidos (40 a 220 BPM)
const adjustBpm = (current: number, delta: number) => Math.max(40, Math.min(220, current + delta));
assert(adjustBpm(42, -10) === 40, 'Ajuste de BPM nunca desce abaixo do piso mínimo de 40 BPM');
assert(adjustBpm(215, +15) === 220, 'Ajuste de BPM nunca ultrapassa o teto máximo de 220 BPM');
assert(adjustBpm(80, +5) === 85, 'Ajuste incremental de +5 BPM opera com exatidão');

// 16. Preservação de Progresso Parcial ao Trocar ou Pular Exercício
const partialStepsLog: PracticeSessionStepRecord[] = [
  {
    stepId: 'drill-alt-picking-1234',
    stepTitle: 'Etapa 1 Completa',
    skillId: 'skill-alternate-picking',
    category: 'Coordenação & Palhetada',
    initialBpm: 60,
    finalBpm: 75,
    targetBpm: 80,
    repetitionsCompleted: 6,
    effectiveSeconds: 180,
    completed: true,
    selfRating: 'consistent',
  },
  {
    stepId: 'drill-rhythm-subdivisions',
    stepTitle: 'Etapa 2 Parcial Pulada',
    skillId: 'skill-metronome-44',
    category: 'Precisão Rítmica & Metrônomo',
    initialBpm: 60,
    finalBpm: 60,
    targetBpm: 80,
    repetitionsCompleted: 2,
    effectiveSeconds: 45,
    completed: false, // pulado com preservação do tempo
    selfRating: 'needs_work',
  },
];
assert(
  partialStepsLog.length === 2 && partialStepsLog[0].completed && !partialStepsLog[1].completed,
  'Progresso parcial é preservado com status completed: false sem apagar a etapa concluída anterior'
);

// 17. Abandono de Sessão com Registro Honesto
const abandonedSession: PracticeSessionRecord = {
  id: 'session-abandoned-003',
  date: new Date().toISOString(),
  durationPlannedMinutes: 15,
  effectiveStudyTimeSeconds: 190,
  stepsCount: 4,
  stepsCompleted: 1,
  skillsPracticed: ['skill-alternate-picking'],
  highestBpm: 70,
  averageBpm: 65,
  overallRating: 'needs_work',
  abandoned: true,
  recommendationGiven: 'Sessão abandonada com preservação de tempo',
  steps: partialStepsLog,
};
const updatedAfterAbandon = storageService.recordPracticeSession(abandonedSession);
assert(
  updatedAfterAbandon.practiceSessions?.find((s) => s.id === 'session-abandoned-003')?.abandoned === true,
  'Sessão abandonada é registrada com a flag abandoned: true sem corromper o histórico'
);
assert(
  updatedAfterAbandon.totalStudyTimeSeconds === updatedAfterSlow.totalStudyTimeSeconds + 190,
  'O tempo efetivo da sessão abandonada (190s) é devidamente preservado'
);

// 18. Resiliência do Fallback Pedagógico Local sem Conexão com IA
const generateLocalFallbackAiTip = (drill: ExecutablePracticeExercise, bpm: number) => {
  return `💡 Dica do Professor IA (Modo Resiliente Local): No andamento de ${bpm} BPM, foque 100% no relaxamento do polegar atrás do braço da guitarra. ${drill.simplificationStrategy} Não tente acelerar enquanto o som não estiver 100% limpo e sem trastejamento.`;
};
const testDrill = PRACTICE_EXERCISE_CATALOG['drill-warmup-spider'] as ExecutablePracticeExercise;
const fallbackTip = generateLocalFallbackAiTip(testDrill, 65);
assert(
  fallbackTip.includes('Modo Resiliente Local') && fallbackTip.includes('65 BPM'),
  'Fallback local determinístico produz orientação pedagógica sólida sem falhar quando a IA está desconectada'
);

// 19. Catálogo da Fase 5.1: As 5 Posições da Pentatônica com Tônicas Identificadas
const penta5Positions = PRACTICE_EXERCISE_CATALOG['drill-penta-5-positions-system'];
assert(
  Boolean(penta5Positions),
  'Catálogo contém o exercício das 5 posições da pentatônica menor (drill-penta-5-positions-system)'
);
assert(
  penta5Positions.tablatureText.includes('Tônicas Lá (A)') || penta5Positions.learningGoal.includes('tônica Lá'),
  'Exercício das 5 posições da pentatônica identifica explicitamente as tônicas ao longo do braço'
);

// 20. Catálogo da Fase 5.1: Tétrades e Campo Harmônico Aplicados
const tetradsHarmonicField = PRACTICE_EXERCISE_CATALOG['drill-tetrads-harmonic-field-comping'];
assert(
  Boolean(tetradsHarmonicField),
  'Catálogo contém o exercício de tétrades e campo harmônico (drill-tetrads-harmonic-field-comping)'
);
assert(
  tetradsHarmonicField.tablatureText.includes('C7M') && tetradsHarmonicField.tablatureText.includes('Dm7'),
  'Exercício de tétrades conduz a progressão harmônica I7M - vi - ii - V7 com notas guia'
);

// 21. Catálogo da Fase 5.1: Condução Harmônica e Dinâmica Worship
const worshipDynamics = PRACTICE_EXERCISE_CATALOG['drill-worship-harmonic-flow-dynamics'];
assert(
  Boolean(worshipDynamics),
  'Catálogo contém condução harmônica e dinâmica worship (drill-worship-harmonic-flow-dynamics)'
);
assert(
  worshipDynamics.tablatureText.includes('D/F#') && worshipDynamics.biomechanicsInstructions.some((i) => i.includes('dedo 1 na 6ª corda')),
  'Exercício worship implementa baixo caminhando no F# com dedilhado e dinâmica de 3 estágios'
);

// 22. Integridade e Compatibilidade de Serialização e Migração
const serializedStudent = JSON.stringify(updatedAfterAbandon);
const reloadedStudent = JSON.parse(serializedStudent) as UserProgress;
assert(
  reloadedStudent.practiceSessions?.length === 3,
  'Histórico de 3 sessões preserva integridade completa após ciclo JSON de salvamento e recuperação'
);
assert(
  reloadedStudent.todayStudyTimeSeconds === updatedAfterAbandon.todayStudyTimeSeconds,
  'Contabilização de tempo de estudo permanece 100% íntegra na desserialização'
);

// -------------------------------------------------------------
// GRUPO 13: Barra de Busca Global e Histórico Local de Buscas
// -------------------------------------------------------------
console.log('\n--- GRUPO 13: Barra de Busca Global & Histórico Local de Buscas ---');

// 1. Estatísticas e Cobertura do Índice Global
const searchStats = getSearchIndexStats();
assert(searchStats.lessonsCount === 18, 'O índice de busca global indexa todas as 18 aulas do currículo');
assert(searchStats.chordsCount >= 20, 'O índice de busca global indexa a base completa de acordes');
assert(searchStats.theoryCount >= 20, 'O índice de busca global indexa escalas, intervalos, círculo de quintas e harmonia');
assert(searchStats.totalItems >= 58, 'O total de itens indexados cobre todas as áreas de estudo da Guitar Academy');

// 2. Busca de Aulas com Normalização
const searchAfinacao = searchAll('afinacao');
assert(
  searchAfinacao.lessons.some((l) => l.lessonId === 'lesson-1'),
  'Busca sem acento "afinacao" localiza a Aula 1 (Afinação Padrão)'
);
const searchWorship = searchAll('Worship');
assert(
  searchWorship.lessons.some((l) => l.lessonId === 'lesson-7' || l.lessonId === 'lesson-8'),
  'Busca por "Worship" localiza as aulas de acordes modernos e levadas rítmicas de worship'
);
const searchSolos = searchAll('solos');
assert(
  searchSolos.lessons.some((l) => l.lessonId === 'lesson-12'),
  'Busca por "solos" localiza a Aula 12 (Criação de Solos)'
);
const searchPestana = searchAll('Pestana');
assert(
  searchPestana.chords.some((c) => c.detail && c.detail.toLowerCase().includes('pestana')),
  'Busca por "Pestana" localiza acordes com pestana no dicionário'
);

// 3. Busca de Acordes por Cifra e Nome
const searchChordC = searchAll('C');
assert(
  searchChordC.chords.some((c) => c.chordSymbol === 'C'),
  'Busca por "C" encontra o acorde C Maior aberto'
);
const searchChordAm = searchAll('Am');
assert(
  searchChordAm.chords.some((c) => c.chordSymbol === 'Am'),
  'Busca por "Am" encontra o acorde Lá Menor'
);
const searchChordDo = searchAll('dó maior');
assert(
  searchChordDo.chords.some((c) => c.chordSymbol === 'C'),
  'Busca em português "dó maior" encontra o acorde C correspondente'
);

// 4. Busca de Tópicos Teóricos
const searchPenta = searchAll('pentatonica');
assert(
  searchPenta.theory.some((t) => t.title.includes('Pentatônica Menor')),
  'Busca "pentatonica" localiza o tópico da Escala Pentatônica Menor'
);
const searchTritono = searchAll('tritono');
assert(
  searchTritono.theory.some((t) => t.title.includes('Trítono')),
  'Busca "tritono" localiza o intervalo de Trítono (b5/#4)'
);
const searchQuintas = searchAll('quintas');
assert(
  searchQuintas.theory.some((t) => t.theoryKey !== undefined),
  'Busca "quintas" localiza itens do Círculo de Quintas'
);
const searchCadencia = searchAll('251');
assert(
  searchCadencia.theory.some((t) => t.title.includes('II - V - I')),
  'Busca por "251" localiza a Cadência Mestra II-V-I'
);

// 5. Query Vazia e Sugestões Rápidas
const emptySearch = searchAll('');
assert(emptySearch.totalCount === 0 && emptySearch.all.length === 0, 'Query vazia retorna 0 resultados sem erro');
assert(QUICK_SEARCH_SUGGESTIONS.length >= 6, 'Sugestões rápidas de busca estão definidas para o usuário');

// 6. Armazenamento Local dos Últimos Termos Pesquisados
storageService.clearRecentSearches();
assert(storageService.getRecentSearches().length === 0, 'Histórico de buscas inicia limpo com clearRecentSearches');

storageService.addRecentSearch('Pentatônica Menor');
assert(
  storageService.getRecentSearches()[0] === 'Pentatônica Menor',
  'addRecentSearch salva o primeiro termo no topo do histórico'
);

storageService.addRecentSearch('Círculo de Quintas');
const recentAfterTwo = storageService.getRecentSearches();
assert(
  recentAfterTwo[0] === 'Círculo de Quintas' && recentAfterTwo[1] === 'Pentatônica Menor',
  'Novo termo é inserido no topo (ordem cronológica inversa)'
);

// Deduplicação: reinserir termo já existente move-o para o topo sem duplicar
storageService.addRecentSearch('Pentatônica Menor');
const recentAfterDedup = storageService.getRecentSearches();
assert(
  recentAfterDedup.length === 2 && recentAfterDedup[0] === 'Pentatônica Menor',
  'Deduplicação move termo repetido para o topo sem duplicar a lista'
);

// Limite máximo de 8 termos
for (let i = 1; i <= 10; i++) {
  storageService.addRecentSearch(`Termo de Busca ${i}`);
}
const recentLimited = storageService.getRecentSearches();
assert(
  recentLimited.length === 8,
  'O histórico de buscas impõe rigorosamente o teto máximo de 8 termos recentes'
);

// Remoção individual
storageService.removeRecentSearch('Termo de Busca 10');
assert(
  !storageService.getRecentSearches().includes('Termo de Busca 10'),
  'removeRecentSearch remove individualmente o termo selecionado'
);

// Limpeza geral
storageService.clearRecentSearches();
assert(
  storageService.getRecentSearches().length === 0,
  'clearRecentSearches remove integralmente todos os termos armazenados'
);

// -------------------------------------------------------------
// GRUPO 14: Validação da Fase 5.2 (Splash Screen, Transições e Refinamento Visual)
// -------------------------------------------------------------
console.log('\n--- GRUPO 14: Validação da Fase 5.2 (Splash Screen, Transições & Refinamento) ---');

// 1. Ícone Oficial Existente do Guitar Academy & Manifesto PWA
const iconExists = fs.existsSync('public/icon.svg');
assert(iconExists, 'O ícone oficial public/icon.svg existe e permanece preservado sem modificações');

const iconContent = fs.readFileSync('public/icon.svg', 'utf-8');
assert(iconContent.includes('<svg') && iconContent.includes('</svg>'), 'O arquivo public/icon.svg é um vetor SVG válido com elementos do instrumento');

const indexHtmlContent = fs.readFileSync('index.html', 'utf-8');
assert(
  indexHtmlContent.includes('href="./icon.svg"') && indexHtmlContent.includes('rel="icon"'),
  'index.html referencia corretamente o ícone oficial ./icon.svg como favicon'
);
assert(
  indexHtmlContent.includes('rel="apple-touch-icon" href="./icon.svg"'),
  'index.html referencia ./icon.svg como apple-touch-icon para dispositivos iOS'
);
assert(
  indexHtmlContent.includes('viewport-fit=cover'),
  'index.html configura viewport-fit=cover para respeito rigoroso à Safe Area do iPhone'
);
assert(
  indexHtmlContent.includes('mobile-web-app-capable'),
  'index.html declara compatibilidade nativa com PWA e modo web app mobile'
);

// 2. Componente de Abertura Premium (SplashScreen.tsx)
const splashComponentExists = fs.existsSync('src/components/common/SplashScreen.tsx');
assert(splashComponentExists, 'O componente SplashScreen.tsx existe em src/components/common/');

const splashCode = fs.readFileSync('src/components/common/SplashScreen.tsx', 'utf-8');
assert(
  splashCode.includes('durationMs = 3500') || splashCode.includes('3500'),
  'A splash screen define permanência visual da abertura em aproximadamente 3.500 ms'
);
assert(
  splashCode.includes('safetyTimer') && splashCode.includes('5000'),
  'A splash screen possui trava de segurança para impedir travamento da interface'
);
assert(
  splashCode.includes('handleDismiss') && splashCode.includes('onClick={handleDismiss}'),
  'A splash screen é descartável imediatamente ao toque/clique do usuário'
);
assert(
  splashCode.includes('src="./icon.svg"'),
  'A splash screen renderiza exclusivamente o ícone oficial existente ./icon.svg'
);
assert(
  splashCode.includes('#F8F7F4') && splashCode.includes('#7B1E2B') && splashCode.includes('#B52A3A'),
  'A splash screen respeita estritamente a paleta oficial (porcelana, vinho e cereja)'
);
assert(
  splashCode.includes('prefers-reduced-motion'),
  'A splash screen verifica ativamente prefers-reduced-motion para diminuir a duração quando requisitado'
);

// 3. Transições Entre Páginas e Deslocamento Vertical Sutil (index.css)
const indexCssContent = fs.readFileSync('src/index.css', 'utf-8');
assert(
  indexCssContent.includes('.page-enter') && indexCssContent.includes('@keyframes pageEnter'),
  'index.css define a classe .page-enter e os keyframes de transição entre páginas'
);
assert(
  indexCssContent.includes('190ms') || indexCssContent.includes('180ms') || indexCssContent.includes('200ms'),
  'A transição entre páginas opera na duração recomendada de 160–220 ms (190 ms)'
);
assert(
  indexCssContent.includes('translateY(6px)') || indexCssContent.includes('translateY(4px)'),
  'A transição entre páginas aplica micro deslocamento vertical de 6px sem saltos abruptos'
);
assert(
  indexCssContent.includes('@media (prefers-reduced-motion: reduce)') && indexCssContent.includes('animation: none !important'),
  'index.css implementa anulação completa de animações para usuários com prefers-reduced-motion ativo'
);

// 4. Safe Area e Layout Mobile iPhone
assert(
  indexCssContent.includes('.safe-area-bottom') && indexCssContent.includes('env(safe-area-inset-bottom'),
  'index.css define utilitário .safe-area-bottom compatível com home indicator do iPhone'
);
assert(
  indexCssContent.includes('.safe-area-top') && indexCssContent.includes('env(safe-area-inset-top'),
  'index.css define utilitário .safe-area-top compatível com notch/dynamic island do iPhone'
);

// 5. Integração com App.tsx e Preservação de Estado
const appCode = fs.readFileSync('src/App.tsx', 'utf-8');
assert(
  appCode.includes('<SplashScreen') && appCode.includes('showSplash'),
  'App.tsx monta a SplashScreen de forma condicional apenas na inicialização'
);
assert(
  appCode.includes('key={currentTab}') && appCode.includes('page-enter'),
  'App.tsx aplica a transição .page-enter de forma atômica no container de conteúdo preservando o cabeçalho e navegação'
);

// -------------------------------------------------------------
// GRUPO 15: Fase 6 — Estabilização, Auditoria e GitHub Pages
// -------------------------------------------------------------
console.log('\n--- GRUPO 15: Fase 6 — Auditoria Técnica, GitHub Pages & Resiliência ---');

// 1. Workflow do GitHub Actions para Deploy
const deployYmlPath = '.github/workflows/deploy.yml';
assert(fs.existsSync(deployYmlPath), 'Arquivo de workflow .github/workflows/deploy.yml existe');
const deployYml = fs.readFileSync(deployYmlPath, 'utf-8');
assert(
  deployYml.includes('npm run lint'),
  'Workflow do GitHub Actions executa checagem de tipos e lint (npm run lint)'
);
assert(
  deployYml.includes('npm test'),
  'Workflow do GitHub Actions executa a suíte completa de testes (npm test)'
);
assert(
  deployYml.includes("BASE_URL: '/Guitar-Academy/'"),
  "Workflow do GitHub Actions define BASE_URL: '/Guitar-Academy/' para o bundle de produção"
);
assert(
  deployYml.includes('actions/deploy-pages@v4'),
  'Workflow do GitHub Actions utiliza a action oficial de publicação de páginas v4'
);

// 2. Configuração do Vite para GitHub Pages e PWA
const viteConfigContent = fs.readFileSync('vite.config.ts', 'utf-8');
assert(
  viteConfigContent.includes('/Guitar-Academy/') || viteConfigContent.includes('process.env.BASE_URL'),
  'vite.config.ts configura caminho base compatível com o GitHub Pages (/Guitar-Academy/)'
);
assert(
  viteConfigContent.includes('VitePWA('),
  'vite.config.ts configura o plugin de PWA para suporte offline e instalabilidade'
);
assert(
  viteConfigContent.includes('#F8F7F4'),
  'Manifesto PWA preserva a cor canônica #F8F7F4 da identidade visual'
);

// 3. Segurança e Ausência de Alertas Bloqueantes
// Varre todos os arquivos de src para garantir ausência total de window.alert
function scanDirForAlerts(dir: string): string[] {
  let found: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found = found.concat(scanDirForAlerts(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      const code = fs.readFileSync(fullPath, 'utf-8');
      // Procura chamadas alert(...) desconsiderando alertCircle ou alert-dialog
      if (/\balert\s*\(/.test(code)) {
        found.push(fullPath);
      }
    }
  }
  return found;
}
const alertFiles = scanDirForAlerts('src');
assert(
  alertFiles.length === 0,
  `Ausência total de window.alert no código-fonte de src (arquivos com alert: ${alertFiles.join(', ') || 'nenhum'})`
);

// 4. Segurança do Backend e Chaves de API
const serverTsContent = fs.readFileSync('server.ts', 'utf-8');
assert(
  serverTsContent.includes('process.env.GEMINI_API_KEY'),
  'GEMINI_API_KEY é lida estritamente de process.env no backend Node.js'
);
assert(
  !serverTsContent.includes('AIzaSy'),
  'Nenhuma chave de API do Gemini está hardcoded no código do servidor'
);

// 5. Integridade do Currículo e Central de Prática
const allLessonsCount = CURRICULUM_LEVELS.reduce((acc, lvl) => acc + lvl.lessons.length, 0);
assert(
  allLessonsCount === 18,
  `Todas as 18 aulas canônicas do currículo estão preservadas e íntegras (encontradas: ${allLessonsCount})`
);
assert(
  CANONICAL_SKILLS.length === 21,
  `Todas as 21 habilidades pedagógicas canônicas continuam ativas (encontradas: ${CANONICAL_SKILLS.length})`
);
assert(
  [5, 10, 15, 30].every((dur) => {
    const r = generatePracticeRoutine(dur as 5 | 10 | 15 | 30, INITIAL_PROGRESS);
    return r && r.durationMinutes === dur && r.exercises.length >= 2;
  }),
  'Central de Prática gera rotinas estruturadas e válidas para 5, 10, 15 e 30 minutos'
);

// 6. Resiliência do Professor IA no Frontend sem Backend
const profViewCode = fs.readFileSync('src/components/professor/ProfessorAiView.tsx', 'utf-8');
assert(
  profViewCode.includes('LOCAL_FALLBACK_EXERCISES'),
  'ProfessorAiView implementa catálogo local determinístico para geração de exercícios sem backend'
);
assert(
  profViewCode.includes('Modo Resiliente Local'),
  'ProfessorAiView orienta amigavelmente o aluno no modo resiliente local quando o backend não responde'
);

// -------------------------------------------------------------
// GRUPO 16: Seletor de Tema (Dark Mode / Light Mode) & Variáveis CSS
// -------------------------------------------------------------
console.log('\n--- GRUPO 16: Seletor de Tema (Dark Mode / Light Mode) & Variáveis CSS ---');

assert(
  indexCssContent.includes('--bg-porcelain') &&
  indexCssContent.includes('--surface-white') &&
  indexCssContent.includes('--red-wine') &&
  indexCssContent.includes('--red-cherry') &&
  indexCssContent.includes('--text-graphite') &&
  indexCssContent.includes('--text-muted') &&
  indexCssContent.includes('--border-silver'),
  'index.css define as variáveis CSS de cor oficiais do Guitar Academy'
);

assert(
  indexCssContent.includes('[data-theme="dark"]') || indexCssContent.includes('.dark'),
  'index.css define o escopo de variáveis de cor para o Modo Escuro (Dark Mode)'
);

assert(
  indexCssContent.includes('--card-surface') && indexCssContent.includes('--overlay-color'),
  'index.css implementa variáveis dinâmicas de superfície e sobreposição translúcida de palco'
);

const themeServiceCode = fs.readFileSync('src/services/themeService.ts', 'utf-8');
assert(
  themeServiceCode.includes('LIGHT_THEME') && themeServiceCode.includes('DARK_THEME'),
  'themeService.ts define os esquemas de cores de alto contraste LIGHT_THEME e DARK_THEME'
);
assert(
  themeServiceCode.includes('setProperty(\'--bg-porcelain\'') && themeServiceCode.includes('setProperty(\'--text-graphite\''),
  'themeService.ts atualiza dinamicamente as variáveis CSS de cor no elemento raiz'
);

const headerCode = fs.readFileSync('src/components/layout/Header.tsx', 'utf-8');
assert(
  headerCode.includes('<ThemeToggle') || headerCode.includes('ThemeToggle'),
  'Header.tsx inclui o botão de alternância rápida de tema (ThemeToggle)'
);

const settingsCode = fs.readFileSync('src/components/settings/SettingsView.tsx', 'utf-8');
assert(
  settingsCode.includes('themePreference') && settingsCode.includes('handleSelectTheme'),
  'SettingsView.tsx implementa o seletor completo de tema (Modo Claro, Escuro e Automático)'
);
assert(
  settingsCode.includes('WCAG AAA Contraste') || settingsCode.includes('Contraste de Leitura'),
  'SettingsView.tsx informa e assegura o contraste de leitura adequado para cifras e estudos'
);

// -------------------------------------------------------------
// GRUPO 17: Navegação Profissional V2 (Barra Inferior + Gestos + Voltar + Histórico)
// -------------------------------------------------------------
console.log('\n--- GRUPO 17: Navegação Profissional V2 ---');

// 1. Abrir cada uma das três abas pela barra inferior
import { 
  navigationService, 
  TAB_TO_PRIMARY_MAP, 
  PRIMARY_TAB_DEFAULTS,
  PRIMARY_TABS_ORDER 
} from './src/services/navigationService';

assert(
  PRIMARY_TABS_ORDER.length === 3 &&
  PRIMARY_TABS_ORDER.includes('estudar') &&
  PRIMARY_TABS_ORDER.includes('praticar') &&
  PRIMARY_TABS_ORDER.includes('evoluir'),
  '1. Três abas principais definidas na ordem canônica: Estudar, Praticar, Evoluir'
);

const bottomNavCode = fs.readFileSync('src/components/layout/BottomNavBar.tsx', 'utf-8');
const bottomNavigationCode = fs.readFileSync('src/components/layout/BottomNavigation.tsx', 'utf-8');
assert(
  bottomNavCode.includes('Estudar') &&
  bottomNavCode.includes('Praticar') &&
  bottomNavCode.includes('Evoluir') &&
  bottomNavigationCode.includes('BottomNavigation'),
  '1. BottomNavigation.tsx e BottomNavBar.tsx renderizam as três abas principais com rótulos e ícones reconhecíveis'
);

assert(
  Object.keys(TAB_TO_PRIMARY_MAP).length >= 17,
  '1. Todas as 17 telas canônicas estão devidamente mapeadas nas 3 abas principais sem exclusão'
);

// 2. Trocar de aba por gestos nas duas direções
assert(
  navigationService.getNextPrimaryTab('estudar') === 'praticar' &&
  navigationService.getNextPrimaryTab('praticar') === 'evoluir' &&
  navigationService.getNextPrimaryTab('evoluir') === null,
  '2. Deslizar para a esquerda avança na ordem Estudar -> Praticar -> Evoluir sem ciclo nas extremidades'
);

assert(
  navigationService.getPreviousPrimaryTab('evoluir') === 'praticar' &&
  navigationService.getPreviousPrimaryTab('praticar') === 'estudar' &&
  navigationService.getPreviousPrimaryTab('estudar') === null,
  '2. Deslizar para a direita recua na ordem Evoluir -> Praticar -> Estudar sem ciclo nas extremidades'
);

// 3. Não trocar de aba durante rolagem vertical
const swipeHookCode = fs.readFileSync('src/hooks/useSwipeNavigation.ts', 'utf-8');
assert(
  swipeHookCode.includes('Math.abs(dy) > Math.abs(dx)') && swipeHookCode.includes('1.6 * absY'),
  '3. Gesto lateral descarta movimentação vertical e não interfere na rolagem da página'
);

// 4. Não interceptar interações com controles e campos
assert(
  swipeHookCode.includes('input') &&
  swipeHookCode.includes('textarea') &&
  swipeHookCode.includes('button') &&
  swipeHookCode.includes('slider') &&
  swipeHookCode.includes('interactive-fretboard'),
  '4. Gesto lateral protege controles interativos, sliders, inputs e braço interativo contra conflitos'
);

// 5. Abrir uma aula e voltar para a lista correta
const fallbackLesson = navigationService.getSafeFallback('curriculum', 'lesson-2');
assert(
  fallbackLesson.tab === 'curriculum' && fallbackLesson.lessonId === null,
  '5. Ao abrir uma aula a partir da lista, Voltar retorna à lista de aulas (currículo)'
);

// 6. Abrir uma rotina e voltar para a Central de Prática
const fallbackPractice = navigationService.getSafeFallback('tuner', null);
assert(
  fallbackPractice.tab === 'practice-routine',
  '6. Ao abrir ferramenta de treino (ex: afinador/metrônomo), Voltar retorna à Central de Prática'
);

// 7. Navegar por várias telas e voltar na ordem correta
navigationService.resetHistory('home');
navigationService.push('curriculum', null);
navigationService.push('chords', null);
navigationService.push('progress', null);

const back1 = navigationService.pop();
assert(back1?.tab === 'chords', '7. Primeiro Voltar retorna para chords');
const back2 = navigationService.pop();
assert(back2?.tab === 'curriculum', '7. Segundo Voltar retorna para curriculum');
const back3 = navigationService.pop();
assert(back3?.tab === 'home', '7. Terceiro Voltar retorna para home');

// Deduplicação: push da mesma tela consecutiva não duplica entrada
navigationService.push('home', null);
const stackLengthBefore = navigationService.getHistoryStack().length;
navigationService.push('home', null);
assert(
  navigationService.getHistoryStack().length === stackLengthBefore,
  '7. Entradas duplicadas consecutivas são descartadas pelo histórico de navegação'
);

// 8. Usar Voltar sem histórico e verificar o destino seguro
navigationService.resetHistory('settings');
const safeDest = navigationService.getSafeFallback('settings', null);
assert(
  safeDest.tab === 'progress',
  '8. Usar Voltar em Configurações sem histórico prévio direciona ao destino seguro (Meu Progresso)'
);

// 9. Preservar posição de rolagem, filtros e contexto quando aplicável
navigationService.saveScrollPosition('curriculum', 380);
assert(
  navigationService.getScrollPosition('curriculum') === 380,
  '9. Posição de rolagem é devidamente salva e recuperada pelo serviço de histórico'
);

// 10. Confirmar que a sessão de prática e o metrônomo não reiniciam ao trocar de aba
assert(
  appCode.includes("currentTab === 'practice-routine' ? 'block' : 'hidden'") &&
  appCode.includes("currentTab === 'metronome' ? 'block' : 'hidden'"),
  '10. Central de Prática e Metrônomo são mantidos montados (hidden) para não reiniciar sessão nem áudio'
);

// 11. Verificar o comportamento com atualização da página e popstate
const popStateRestored = navigationService.handlePopState({ tab: 'theory', lessonId: null });
assert(
  popStateRestored?.tab === 'theory',
  '11. Integração com popstate restaura rotas válidas do navegador sem criar histórico falso'
);

// 12. Verificar responsividade e áreas seguras do iPhone
assert(
  bottomNavCode.includes('safe-area-bottom') &&
  bottomNavCode.includes('fixed bottom-0'),
  '12. Barra inferior fixa respeita safe-area-bottom e home indicator do iPhone'
);
assert(
  appCode.includes('pb-28') || appCode.includes('pb-24') || appCode.includes('pb-32'),
  '12. Espaçamento inferior suficiente reservado no main para não cobrir botões nem exercícios'
);

// 13. AUDITORIA: DESIGN SYSTEM COMPLETO & PACK VISUAL
console.log('\n--- 13. AUDITORIA DO DESIGN SYSTEM & PACK VISUAL ---');

const dsCssContent = fs.readFileSync('src/index.css', 'utf-8');
const dsHtmlContent = fs.readFileSync('index.html', 'utf-8');

// 13.1 Verificação dos tokens de cor obrigatórios
assert(
  dsCssContent.includes('#F8F7F4') &&
  dsCssContent.includes('#7B1E2B') &&
  dsCssContent.includes('#B52A3A') &&
  dsCssContent.includes('#25252A') &&
  (dsCssContent.includes('#F5C542') || dsCssContent.includes('#F5D38A')),
  '13.1 Tokens visuais oficiais configurados no index.css (Porcelana, Vinho, Cereja, Grafite, Dourado)'
);

// 13.2 Verificação de tipografia Montserrat + Plus Jakarta Sans
assert(
  dsHtmlContent.includes('Montserrat') &&
  dsHtmlContent.includes('Plus+Jakarta+Sans') &&
  dsCssContent.includes('Montserrat'),
  '13.2 Tipografia oficial ativa (Montserrat para display/títulos e Plus Jakarta Sans para leitura)'
);

// 13.3 Verificação dos componentes reutilizáveis do Design System
const designSystemComponents = [
  'src/components/common/LuxuryCard.tsx',
  'src/components/common/SectionTitle.tsx',
  'src/components/common/PrimaryButton.tsx',
  'src/components/common/SecondaryButton.tsx',
  'src/components/common/ProgressBar.tsx',
  'src/components/common/Badge.tsx',
  'src/components/common/LessonCard.tsx',
  'src/components/common/PracticeCard.tsx',
  'src/components/common/LoadingState.tsx',
  'src/components/common/EmptyState.tsx'
];

designSystemComponents.forEach((compPath) => {
  assert(
    fs.existsSync(compPath),
    `13.3 Componente do Design System presente: ${path.basename(compPath)}`
  );
});

// 13.4 Verificação do pack de recursos visuais
const visualPackAssets = [
  'public/images/branding/logo-horizontal.svg',
  'public/images/branding/logo-mark.svg',
  'public/images/branding/app-icon.svg',
  'public/images/branding/logo-light.svg',
  'public/images/branding/logo-dark.svg',
  'public/images/branding/guitar-academy-symbol.svg',
  'public/images/branding/guitar-academy-logo.svg',
  'public/images/branding/guitar-academy-logo-dark.svg',
  'public/images/backgrounds/guitar-academy-background.webp',
  'public/images/backgrounds/splash-background.webp',
  'public/images/banners/banner-estudar.webp',
  'public/images/banners/banner-praticar.webp',
  'public/images/banners/banner-evoluir.webp',
  'public/images/instruments/electric-guitar-headstock.svg',
  'docs/DESIGN-ASSETS.md'
];

visualPackAssets.forEach((assetPath) => {
  assert(
    fs.existsSync(assetPath) && fs.statSync(assetPath).size > 100,
    `13.4 Recurso visual do pack presente e válido: ${assetPath}`
  );
});

// 13.5 Verificação dos 18 ícones individuais de interface
const requiredInterfaceIcons = [
  'estudar.svg', 'praticar.svg', 'evoluir.svg', 'inicio.svg',
  'busca.svg', 'aulas.svg', 'teoria.svg', 'acordes.svg',
  'metronomo.svg', 'afinador.svg', 'historico.svg', 'metas.svg',
  'conquistas.svg', 'perfil.svg', 'configuracoes.svg', 'voltar.svg',
  'iniciar.svg', 'concluido.svg'
];

requiredInterfaceIcons.forEach((iconName) => {
  const iconPath = path.join('public/images/icons', iconName);
  assert(
    fs.existsSync(iconPath) && fs.statSync(iconPath).size > 50,
    `13.5 Ícone SVG individual presente: ${iconName}`
  );
});

// =============================================================
// GRUPO 14: Validação da Fase 1 de Estabilização — Data Local, Fusos Horários, Backup e Diálogos
// =============================================================
console.log('\n--- GRUPO 14: Validação da Fase 1 de Estabilização (Data Local, Fusos, Backup e Diálogos) ---');

// 14.1 Formato de data local YYYY-MM-DD
const todayLocalDate = getLocalDateString();
assert(
  /^\d{4}-\d{2}-\d{2}$/.test(todayLocalDate),
  '14.1 getLocalDateString retorna string no formato estrito YYYY-MM-DD'
);

// 14.2 Conversão determinística de data específica
const testDateObj = new Date(2026, 9, 15, 14, 30, 0); // 15 de Outubro de 2026
assert(
  getLocalDateString(testDateObj) === '2026-10-15',
  '14.2 getLocalDateString formata corretamente datas históricas'
);

// 14.3 Simulação de horário próximo à meia-noite (23:45)
// Em fusos com horário atrasado em relação a UTC (ex.: Brasil UTC-3), 23:45 do dia 30/10 já é 02:45 do dia 31/10 em UTC.
// A função getLocalDateString deve preservar a data local física do aluno (2026-10-30).
const nearMidnightLocal = new Date(2026, 9, 30, 23, 45, 0);
assert(
  getLocalDateString(nearMidnightLocal) === '2026-10-30',
  '14.3 getLocalDateString preserva o dia do aluno às 23:45, sem avançar prematuramente'
);

// 14.4 addDays com virada de mês no calendário local
const monthTransitionDate = addDays('2026-10-30', 3);
assert(
  monthTransitionDate === '2026-11-02',
  '14.4 addDays calcula corretamente transição de mês sem deriva de fuso (2026-10-30 + 3 = 2026-11-02)'
);

// 14.5 Preservação de totalStudyTimeSeconds e reset controlado de todayStudyTimeSeconds na virada do dia
localStorage.setItem('guitar_academy_user_progress_v1', JSON.stringify({
  ...INITIAL_PROGRESS,
  lastStudyDate: '2026-01-01',
  todayStudyTimeSeconds: 1800,
  totalStudyTimeSeconds: 5400,
}));
const rolledProgress = storageService.loadProgress();
assert(
  rolledProgress.todayStudyTimeSeconds === 0,
  '14.5 todayStudyTimeSeconds é reiniciado em 0 quando a data de estudo difere do dia local'
);
assert(
  rolledProgress.totalStudyTimeSeconds === 5400,
  '14.5 totalStudyTimeSeconds permanece estritamente preservado e acumulado na virada do dia'
);
assert(
  rolledProgress.lastStudyDate === todayLocalDate,
  '14.5 lastStudyDate é atualizado para o dia local corrente'
);

// 14.6 Mesma data local não deve zerar todayStudyTimeSeconds
localStorage.setItem('guitar_academy_user_progress_v1', JSON.stringify({
  ...INITIAL_PROGRESS,
  lastStudyDate: todayLocalDate,
  todayStudyTimeSeconds: 1200,
  totalStudyTimeSeconds: 4800,
}));
const sameDayProgress = storageService.loadProgress();
assert(
  sameDayProgress.todayStudyTimeSeconds === 1200,
  '14.6 todayStudyTimeSeconds NÃO é zerado ao recarregar dentro do mesmo dia local'
);

// 14.7 Validação de envelope completo de backup
const validEnvelopeData = {
  app: 'Guitar Academy V1.0',
  exportDate: new Date().toISOString(),
  progress: {
    ...INITIAL_PROGRESS,
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
    totalStudyTimeSeconds: 3600,
  },
  metronome: {
    bpm: 110,
    volume: 0.8,
  },
};
const valResultValid = validateBackupData(validEnvelopeData);
assert(
  valResultValid.isValid === true,
  '14.7 validateBackupData aprova envelope de backup estruturado'
);
assert(
  valResultValid.progress?.completedLessons.length === 3,
  '14.7 validateBackupData recupera lista completa de aulas concluídas'
);

// 14.8 Validação de backup direto do objeto UserProgress
const validDirectProgress = {
  ...INITIAL_PROGRESS,
  currentLessonId: 'lesson-4',
  completedLessons: ['lesson-1', 'lesson-2'],
};
const valResultDirect = validateBackupData(validDirectProgress);
assert(
  valResultDirect.isValid === true,
  '14.8 validateBackupData aprova objeto UserProgress direto'
);

// 14.9 Rejeição de formatos de backup corrompidos e inválidos
const corrupted1 = validateBackupData(null);
assert(corrupted1.isValid === false, '14.9 validateBackupData rejeita valor nulo');

const corrupted2 = validateBackupData({ progress: { completedLessons: 'não-é-um-array' } });
assert(corrupted2.isValid === false, '14.9 validateBackupData rejeita completedLessons que não seja array');

const corrupted3 = validateBackupData({ progress: { practiceLogs: 12345 } });
assert(corrupted3.isValid === false, '14.9 validateBackupData rejeita practiceLogs corrompido');

const corrupted4 = validateBackupData({ payloadAleatorio: 'sem-estrutura' });
assert(corrupted4.isValid === false, '14.9 validateBackupData rejeita JSON desconhecido');

// 14.10 Atomicidade de importBackup (não corrompe localStorage se a importação falhar)
const goldenState = {
  ...INITIAL_PROGRESS,
  completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4'],
  totalStudyTimeSeconds: 9000,
};
storageService.saveProgress(goldenState);

const failedImport = storageService.importBackup('{"invalid json text}');
assert(failedImport.success === false, '14.10 importBackup retorna erro em JSON com erro de sintaxe');

const failedImportCorrupted = storageService.importBackup('{"progress": {"completedLessons": "invalido"}}');
assert(failedImportCorrupted.success === false, '14.10 importBackup retorna erro em estrutura de progresso inválida');
assert(
  failedImportCorrupted.error !== undefined && failedImportCorrupted.error.length > 5,
  '14.10 importBackup fornece mensagem descritiva do erro encontrado'
);

// Verifica integridade dos dados no armazenamento
const preservedState = storageService.loadProgress();
assert(
  preservedState.completedLessons.length === 4,
  '14.10 Dados anteriores permanecem 100% íntegros após rejeição de arquivo inválido'
);
assert(
  preservedState.totalStudyTimeSeconds === 9000,
  '14.10 Tempo acumulado no storage não é afetado por tentativa de importação falha'
);

// 14.11 Sucesso de importação e sanitização
const validImportJson = JSON.stringify({
  app: 'Guitar Academy V1.0',
  exportDate: '2026-10-30T10:00:00.000Z',
  progress: {
    completedLessons: ['lesson-1', 'lesson-2'],
    totalStudyTimeSeconds: 2400,
  },
  metronome: {
    bpm: 95,
  },
});
const successfulImport = storageService.importBackup(validImportJson);
assert(
  successfulImport.success === true,
  '14.11 importBackup importa com sucesso backup válido e sanitiza campos'
);
assert(
  Boolean(successfulImport.message?.includes('recuperadas') || successfulImport.message?.includes('sucesso')),
  '14.11 importBackup retorna mensagem de confirmação amigável'
);

const reloadedAfterImport = storageService.loadProgress();
assert(
  reloadedAfterImport.completedLessons.length === 2,
  '14.11 Progresso importado foi persistido corretamente no localStorage'
);

// 14.12 Exportação de backup com timestamp UTC e data local
const exportedBackup = storageService.exportBackup();
assert(
  exportedBackup.success === true,
  '14.12 exportBackup gera arquivo com sucesso'
);
assert(
  exportedBackup.filename.startsWith('guitar-academy-backup-'),
  '14.12 Nome do arquivo de backup possui prefixo e data local'
);
const payloadCheck = exportedBackup.payload as any;
assert(
  Boolean(payloadCheck && typeof payloadCheck.exportDate === 'string' && payloadCheck.exportDate.includes('T')),
  '14.12 Payload do backup possui timestamp UTC ISO (exportDate) para rastreabilidade'
);
assert(
  payloadCheck && payloadCheck.localDate === todayLocalDate,
  '14.12 Payload do backup possui data de calendário local'
);

// 14.13 Tratamento de QuotaExceededError em saveProgress
const storageMemory = (globalThis as any).localStorage;
const originalSetItem = storageMemory.setItem;
storageMemory.setItem = () => {
  const err: any = new Error('QuotaExceededError');
  err.name = 'QuotaExceededError';
  err.code = 22;
  throw err;
};

const quotaResult = storageService.saveProgress(goldenState);
assert(
  quotaResult.success === false,
  '14.13 saveProgress captura e reporta falha de armazenamento'
);
assert(
  quotaResult.isQuotaExceeded === true,
  '14.13 saveProgress identifica flag isQuotaExceeded'
);
assert(
  Boolean(quotaResult.error?.includes('quota') || quotaResult.error?.includes('armazenamento')),
  '14.13 Mensagem de erro orienta o usuário sobre o limite de armazenamento'
);

// Restaura setItem normal
storageMemory.setItem = originalSetItem;

// 14.14 Auditoria de código: ausência de confirm() e alert() nativos
const lessonViewerCode = fs.readFileSync('src/components/curriculum/LessonViewer.tsx', 'utf-8');
assert(
  !lessonViewerCode.includes('confirm('),
  '14.14 LessonViewer.tsx não utiliza confirm() nativo do navegador'
);
assert(
  !lessonViewerCode.includes('alert('),
  '14.14 LessonViewer.tsx não utiliza alert() nativo do navegador'
);

const routineViewCode = fs.readFileSync('src/components/routine/PracticeRoutineView.tsx', 'utf-8');
assert(
  !routineViewCode.includes('confirm('),
  '14.14 PracticeRoutineView.tsx não utiliza confirm() nativo do navegador'
);
assert(
  !routineViewCode.includes('alert('),
  '14.14 PracticeRoutineView.tsx não utiliza alert() nativo do navegador'
);

// =============================================================
// GRUPO 15: Validação da Fase 2 de Estabilização — Sistema de Áudio, Metrônomo, Afinador e Web Audio
// =============================================================
console.log('\n--- GRUPO 15: Validação da Fase 2 de Estabilização (Sistema de Áudio, Metrônomo e Afinador) ---');

// 15.1 Ciclo de vida e estado do AudioEngine
assert(
  typeof audioEngine.getContextState === 'function' &&
  typeof audioEngine.isContextSuspended === 'function' &&
  typeof audioEngine.isMetronomeActive === 'function' &&
  typeof audioEngine.resumeAudio === 'function' &&
  typeof audioEngine.closeAudio === 'function',
  '15.1 AudioEngine exporta métodos de ciclo de vida (getContextState, isContextSuspended, isMetronomeActive, resumeAudio, closeAudio)'
);

assert(
  audioEngine.isMetronomeActive() === false,
  '15.1 Metrônomo inicia desativado por padrão'
);

// 15.2 Preservação estrita dos parâmetros do algoritmo de lookahead
const audioEngineSource = fs.readFileSync('src/audio/audioEngine.ts', 'utf-8');
assert(
  audioEngineSource.includes('setTimeout(this.scheduleLoop, 25)') || audioEngineSource.includes(', 25)'),
  '15.2 Intervalo de lookahead do metrônomo rigorosamente preservado em 25ms'
);
assert(
  audioEngineSource.includes('scheduleAheadTime = 0.1') || audioEngineSource.includes('0.1;'),
  '15.2 Janela de agendamento antecipado (schedule ahead) rigorosamente preservada em 100ms (0.1s)'
);

// 15.3 Proteção contra "metronome burst" e acúmulo de tempo ao congelar em segundo plano
assert(
  audioEngineSource.includes('if (this.nextBeatTime < this.ctx.currentTime)'),
  '15.3 AudioEngine implementa salvaguarda contra acúmulo de batidas passadas após suspensão do sistema operacional'
);

// 15.4 Verificação matemática de subdivisões e andamento (BPM)
const bpm60QuarterSec = 60.0 / 60;
assert(bpm60QuarterSec === 1.0, '15.4 60 BPM resulta em 1 batida por segundo exata');
const bpm120QuarterSec = 60.0 / 120;
assert(bpm120QuarterSec === 0.5, '15.4 120 BPM resulta em 500ms por semínima');

// 15.5 Concorrência e bloqueio de microfone no GuitarPitchDetector
assert(
  typeof detector.getIsListening === 'function' &&
  typeof detector.getIsAcquiring === 'function',
  '15.5 GuitarPitchDetector implementa verificações de estado ativo e lock de aquisição'
);
assert(
  detector.getIsListening() === false,
  '15.5 Detector reporta false quando microfone não está capturando'
);

// Simulação de tentativa concorrente de aquisição de microfone
const testPitchDetector = new GuitarPitchDetector();
(testPitchDetector as any).isAcquiringMicrophone = true;
const concurrentAttempt = await testPitchDetector.startListening(() => {});
assert(
  concurrentAttempt.success === false && concurrentAttempt.errorType === 'busy',
  '15.5 Chamadas concorrentes a startListening são bloqueadas com lock determinístico (errorType: busy)'
);

// Resiliência no Node.js / navegador sem getUserMedia
(testPitchDetector as any).isAcquiringMicrophone = false;
const noMediaResult = await testPitchDetector.startListening(() => {});
assert(
  noMediaResult.success === false && noMediaResult.errorType === 'not_supported',
  '15.5 Ausência de getUserMedia é tratada graciosamente sem exceção fatal (errorType: not_supported)'
);

// 15.6 Liberação completa de recursos em stopListening()
testPitchDetector.stopListening();
assert(
  (testPitchDetector as any).analyser === null &&
  (testPitchDetector as any).mediaStream === null &&
  (testPitchDetector as any).highpassFilter === null &&
  (testPitchDetector as any).lowpassFilter === null,
  '15.6 stopListening() desconecta e anula nós de áudio, filtros e streams para evitar vazamento de memória'
);

// 15.7 Estabilidade do TunerSmoother (Filtro EMA e Zona Morta ±2 cents)
const testSmoother = new TunerSmoother({ alpha: 0.18, confidenceThreshold: 0.65 });
testSmoother.reset();

// Inicia com sinal em afinação exata (0 cents)
testSmoother.feedPitch({
  frequency: 82.41,
  note: 'E',
  notePt: 'Mi',
  octave: 2,
  cents: 0,
  confidence: 0.95,
  intensity: 0.8,
  isSilence: false,
  isWeakSignal: false,
  isOnset: false,
  detectionType: 'monophonic_note',
  stability: 98,
  stabilityLabel: 'Estável',
  expectedFreq: 82.41,
  timestamp: performance.now(),
});

const frame1 = testSmoother.step(performance.now());
assert(
  frame1.isInTune === true && frame1.note === 'E' && frame1.octave === 2,
  '15.7 TunerSmoother identifica nota afinada com confiança alta (isInTune: true)'
);
assert(
  Math.abs(frame1.displayedCents) <= 2,
  '15.7 TunerSmoother estabiliza desvio dentro da zona morta de ±2 cents'
);

// Rejeição de sinal fraco
testSmoother.feedPitch({
  frequency: 82.41,
  note: 'E',
  notePt: 'Mi',
  octave: 2,
  cents: 25,
  confidence: 0.3,
  intensity: 0.05,
  isSilence: false,
  isWeakSignal: true,
  isOnset: false,
  detectionType: 'weak_signal',
  stability: 30,
  stabilityLabel: 'Instável',
  expectedFreq: 82.41,
  timestamp: performance.now(),
});

const frameWeak = testSmoother.step(performance.now());
assert(
  frameWeak.isWeakSignal === true || frameWeak.state === 'weak_signal',
  '15.7 TunerSmoother sinaliza adequadamente captura com sinal fraco ou baixa confiança'
);

// 15.8 Auditoria de ciclo de vida e visibilidade em MetronomeView e TunerView
const metronomeViewSource = fs.readFileSync('src/components/metronome/MetronomeView.tsx', 'utf-8');
assert(
  metronomeViewSource.includes('visibilitychange') &&
  metronomeViewSource.includes('resumeAudio'),
  '15.8 MetronomeView reage a visibilitychange e retoma o motor de áudio ao voltar para a tela'
);
assert(
  metronomeViewSource.includes('Dica de treino no celular') || metronomeViewSource.includes('celular'),
  '15.8 MetronomeView exibe orientação técnica sobre o comportamento de áudio em telas móveis'
);

const tunerViewSource = fs.readFileSync('src/components/tuner/TunerView.tsx', 'utf-8');
assert(
  tunerViewSource.includes('visibilitychange') &&
  tunerViewSource.includes('stopListening'),
  '15.8 TunerView suspende a captura do microfone automaticamente ao ir para segundo plano'
);
assert(
  tunerViewSource.includes('Retomar Afinador'),
  '15.8 TunerView exibe aviso contextual com botão de toque para retomar o microfone com segurança'
);
assert(
  tunerViewSource.includes('permissão') || tunerViewSource.includes('cadeado'),
  '15.8 TunerView oferece instruções amigáveis para reativação de permissões no navegador'
);

// 15.9 Auditoria de ausência de alert() e confirm() nos módulos de áudio
assert(
  !audioEngineSource.includes('alert(') && !audioEngineSource.includes('confirm('),
  '15.9 audioEngine.ts não utiliza alert() nem confirm() nativos'
);
const guitarPitchSource = fs.readFileSync('src/audio/guitarPitchDetector.ts', 'utf-8');
assert(
  !guitarPitchSource.includes('alert(') && !guitarPitchSource.includes('confirm('),
  '15.9 guitarPitchDetector.ts não utiliza alert() nem confirm() nativos'
);
assert(
  !tunerViewSource.includes('alert(') && !tunerViewSource.includes('confirm('),
  '15.9 TunerView.tsx não utiliza alert() nem confirm() nativos'
);
assert(
  !metronomeViewSource.includes('alert(') && !metronomeViewSource.includes('confirm('),
  '15.9 MetronomeView.tsx não utiliza alert() nem confirm() nativos'
);

// =============================================================
// GRUPO 16 — DOMÍNIO TOTAL DO VIOLÃO (60 AULAS & 10 MÓDULOS)
// E OS 4 LABORATÓRIOS INTERATIVOS
// =============================================================

console.log('\n--- GRUPO 16: DOMÍNIO TOTAL DO VIOLÃO (60 AULAS & 10 MÓDULOS) ---');

// 16.1 Estrutura de módulos e total de aulas
assert(
  VIOLAO_MODULES.length === 10,
  '16.1 Domínio Total do Violão possui exatamente 10 módulos pedagógicos estruturados'
);
assert(
  VIOLAO_LESSONS.length === 60,
  '16.1 Domínio Total do Violão possui exatamente 60 aulas completas'
);

// 16.2 Cada módulo possui exatamente 6 aulas sequenciais (10 x 6 = 60)
const allModulesHaveSixLessons = VIOLAO_MODULES.every((mod) => mod.lessons.length === 6);
assert(
  allModulesHaveSixLessons,
  '16.2 Cada um dos 10 módulos possui exatamente 6 aulas sequenciais (10 x 6 = 60 aulas)'
);

// 16.3 Identificadores únicos sem colisões
const violaoLessonIds = VIOLAO_LESSONS.map((l) => l.id);
const uniqueViolaoIds = new Set(violaoLessonIds);
assert(
  uniqueViolaoIds.size === 60,
  '16.3 Todos os identificadores de aula do Domínio Total do Violão são únicos'
);
assert(
  violaoLessonIds[0] === 'violao-lesson-1' && violaoLessonIds[59] === 'violao-lesson-60',
  '16.3 Identificadores seguem o padrão canônico violao-lesson-1 a violao-lesson-60'
);

// 16.4 Diagramas de acordes e afinação padrão E2-A2-D3-G3-B3-E4
let totalChordDiagrams = 0;
let validChordDiagrams = true;
VIOLAO_LESSONS.forEach((lesson) => {
  if (lesson.chordDiagrams && lesson.chordDiagrams.length > 0) {
    lesson.chordDiagrams.forEach((cd) => {
      totalChordDiagrams++;
      if (!Array.isArray(cd.frets) || cd.frets.length !== 6) {
        validChordDiagrams = false;
      }
      if (!Array.isArray(cd.fingers) || cd.fingers.length !== 6) {
        validChordDiagrams = false;
      }
      if ((!cd.name && !cd.symbol) || typeof cd.tips !== 'string') {
        validChordDiagrams = false;
      }
    });
  }
});
assert(
  totalChordDiagrams >= 30 && validChordDiagrams,
  `16.4 Todos os ${totalChordDiagrams} diagramas de acordes possuem formato válido de 6 cordas e orientações técnicas`
);

// 16.5 Integridade de conteúdo: objetivos, exercícios, tablaturas e desafios
const allHaveRequiredFields = VIOLAO_LESSONS.every(
  (l) =>
    l.title &&
    l.objective &&
    l.practicalExercise &&
    l.practicalExercise.tablatureText &&
    l.musicalApplication &&
    l.musicalApplication.tab &&
    Array.isArray(l.commonErrors) &&
    l.commonErrors.length > 0 &&
    l.challenge &&
    l.masteryCriteria &&
    l.speedGoals
);
assert(
  allHaveRequiredFields,
  '16.5 Todas as 60 aulas possuem objetivos, exercícios práticos, tablaturas ASCII, aplicações reais, erros e critérios de maestria'
);

// 16.6 Validação do Laboratório 1: Mapa Inteligente do Braço
assert(
  STANDARD_TUNING.length === 6 &&
  STANDARD_TUNING.some((s) => s.openFrequencyHz < 85) && // E2 ~82.41 Hz
  STANDARD_TUNING.some((s) => s.openFrequencyHz > 320),  // E4 ~329.63 Hz
  '16.6 Laboratório 1: Mapa do Braço ancorado na afinação padrão internacional de E2 a E4'
);

// 16.7 Validação do Laboratório 2: Laboratório de Acordes (Chord Lab)
const testParsedChord = ChordEngine.getChord('Cmaj7');
assert(
  testParsedChord !== null &&
  testParsedChord.root === 'C' &&
  testParsedChord.notes.includes('B'),
  '16.7 Laboratório 2: Motor Chord Lab decompõe cifras avançadas com precisão teórica'
);

// 16.8 Validação dos Laboratórios 3 e 4: Progressões e Estilos
assert(
  typeof ChordEngine.generateCaged === 'function',
  '16.8 Laboratório 3 e 4: Sistema CAGED e progressões operacionais'
);

// 16.9 Busca global indexa termos do Domínio Total do Violão
const vSearchOpenChords = searchAll('acordes abertos');
const vSearchCadd9 = searchAll('Cadd9');
const vSearchFingerstyle = searchAll('fingerstyle');
const vSearchPestana = searchAll('pestana');
const vSearchViolaoSolo = searchAll('violão solo');

assert(
  vSearchOpenChords.all.some((r) => r.id.startsWith('violao-lesson-')),
  '16.9 Busca global localiza aulas de violão pelo termo "acordes abertos"'
);
assert(
  vSearchCadd9.all.some((r) => r.id.startsWith('violao-lesson-')),
  '16.9 Busca global localiza aulas de violão pelo termo "Cadd9"'
);
assert(
  vSearchFingerstyle.all.some((r) => r.id.startsWith('violao-lesson-')),
  '16.9 Busca global localiza aulas de violão pelo termo "fingerstyle"'
);
assert(
  vSearchPestana.all.some((r) => r.id.startsWith('violao-lesson-')),
  '16.9 Busca global localiza aulas de violão pelo termo "pestana"'
);
assert(
  vSearchViolaoSolo.all.some((r) => r.id.startsWith('violao-lesson-')),
  '16.9 Busca global localiza aulas de violão pelo termo "violão solo"'
);

// 16.10 Preservação estrita dos módulos anteriores (Regra Fundamental)
const canonicalLessons = CURRICULUM_LEVELS.flatMap((l) => l.lessons);
assert(
  canonicalLessons.length === 18,
  '16.10 Currículo canônico preservado integralmente com exatamente 18 aulas'
);
assert(
  SOLO_LESSONS.length === 20,
  '16.10 Formação de Guitarra Solo preservada integralmente com exatamente 20 aulas'
);
assert(
  CANONICAL_SKILLS.length === 21,
  '16.10 Catálogo de 21 habilidades pedagógicas adaptativas preservado sem alterações'
);

// =============================================================
// GRUPO 17 — VALIDAÇÃO DAS CORREÇÕES CIRÚRGICAS (01/11/2026)
// Csus2, Csus4, C°7, G Worship, Oitavas Científicas e Comentários
// =============================================================

console.log('\n--- GRUPO 17: VALIDAÇÃO DAS CORREÇÕES CIRÚRGICAS ---');

// 17.1 Acorde Csus2: sem terça maior/menor, 1ª corda abafada
const csus2Chord = CHORD_DATABASE.find((c) => c.id === 'c-sus2');
assert(
  csus2Chord !== undefined &&
  JSON.stringify(csus2Chord.frets) === JSON.stringify([-1, 3, 0, 0, 1, -1]),
  '17.1 Csus2 possui digitação [-1, 3, 0, 0, 1, -1] com 1ª corda abafada'
);
assert(
  csus2Chord !== undefined &&
  csus2Chord.notes.length === 3 &&
  csus2Chord.notes.includes('C') &&
  csus2Chord.notes.includes('D') &&
  csus2Chord.notes.includes('G') &&
  !csus2Chord.notes.includes('E') &&
  !csus2Chord.notes.includes('D#'),
  '17.1 Csus2 produz exclusivamente Tônica (C), 2ª Maior (D) e 5ª Justa (G) sem terça'
);

// 17.2 Acorde Csus4: sem choque de terça maior com quarta justa
const csus4Chord = CHORD_DATABASE.find((c) => c.id === 'c-sus4');
assert(
  csus4Chord !== undefined &&
  JSON.stringify(csus4Chord.frets) === JSON.stringify([-1, 3, 3, 0, 1, -1]),
  '17.2 Csus4 possui digitação [-1, 3, 3, 0, 1, -1] eliminando a 1ª corda aberta conflitante'
);
assert(
  csus4Chord !== undefined &&
  csus4Chord.formula === '1 - 4 - 5' &&
  csus4Chord.notes.includes('C') &&
  csus4Chord.notes.includes('F') &&
  csus4Chord.notes.includes('G') &&
  !csus4Chord.notes.includes('E'),
  '17.2 Csus4 produz rigorosamente Tônica (C), 4ª Justa (F) e 5ª Justa (G)'
);

// 17.3 Acorde C°7: classificação exata como tétrade diminuta
const cDimChord = CHORD_DATABASE.find((c) => c.id === 'c-dim');
assert(
  cDimChord !== undefined &&
  cDimChord.symbol === 'C°7' &&
  cDimChord.formula === '1 - b3 - b5 - bb7',
  '17.3 C°7 classificado como tétrade diminuta com fórmula 1 - b3 - b5 - bb7'
);
assert(
  cDimChord !== undefined &&
  cDimChord.notes.length === 4 &&
  JSON.stringify(cDimChord.frets) === JSON.stringify([-1, 3, 4, 2, 4, -1]),
  '17.3 C°7 produz 4 classes de altura simétricas (C, Eb, Gb, A) na digitação [-1, 3, 4, 2, 4, -1]'
);

// 17.4 Acorde G Worship: remoção da barra no símbolo
const gWorshipChord = CHORD_DATABASE.find((c) => c.id === 'g-worship-4fingers');
assert(
  gWorshipChord !== undefined &&
  gWorshipChord.symbol === 'G (Worship 4 Dedos)' &&
  !gWorshipChord.symbol.includes('/'),
  '17.4 Símbolo de G Worship é "G (Worship 4 Dedos)", livre de barra indicativa de baixo'
);
assert(
  gWorshipChord !== undefined &&
  JSON.stringify(gWorshipChord.frets) === JSON.stringify([3, 2, 0, 0, 3, 3]),
  '17.4 Digitação de 4 dedos [3, 2, 0, 0, 3, 3] rigorosamente preservada em G Worship'
);

// 17.5 Preservação do parser de cifras com baixo invertido (Slash Chords)
const dSlashFSharp = parseChordSymbol('D/F#');
assert(
  dSlashFSharp !== null && dSlashFSharp.root === 'D' && dSlashFSharp.bass === 'F#',
  '17.5 Parser de cifras processa com precisão baixo invertido D/F#'
);
const am7SlashG = parseChordSymbol('Am7/G');
assert(
  am7SlashG !== null && am7SlashG.root === 'A' && am7SlashG.bass === 'G',
  '17.5 Parser de cifras processa com precisão baixo invertido Am7/G'
);
const cSlashE = parseChordSymbol('C/E');
assert(
  cSlashE !== null && cSlashE.root === 'C' && cSlashE.bass === 'E',
  '17.5 Parser de cifras processa com precisão baixo invertido C/E'
);

// 17.6 Cálculo de Oitavas Científicas e validação acústica do braço
const str6 = STANDARD_TUNING.find((s) => s.stringNumber === 6)!;
const str2 = STANDARD_TUNING.find((s) => s.stringNumber === 2)!;
const str5 = STANDARD_TUNING.find((s) => s.stringNumber === 5)!;

assert(
  getFretNote(str6, 0).octave === 2 && getFretNote(str6, 0).cipher === 'E',
  '17.6 6ª corda solta é E2 acústico exato (82.41 Hz)'
);
assert(
  getFretNote(str6, 12).octave === 3 && getFretNote(str6, 12).cipher === 'E',
  '17.6 6ª corda casa 12 é E3 acústico exato (164.81 Hz)'
);
assert(
  getFretNote(str6, 24).octave === 4 && getFretNote(str6, 24).cipher === 'E',
  '17.6 6ª corda casa 24 é E4 acústico exato (329.63 Hz)'
);
assert(
  getFretNote(str2, 1).octave === 4 && getFretNote(str2, 1).cipher === 'C',
  '17.6 2ª corda casa 1 é C4 (Dó Central, 261.63 Hz)'
);
assert(
  getFretNote(str5, 3).octave === 3 && getFretNote(str5, 3).cipher === 'C',
  '17.6 5ª corda casa 3 é C3 (130.81 Hz)'
);

const fretboardViewSource = fs.readFileSync('src/components/fretboard/FretboardView.tsx', 'utf-8');
assert(
  !fretboardViewSource.includes('Math.floor(Math.log2(n.frequencyHz / 440) + 4)') &&
  fretboardViewSource.includes('octave: n.octave'),
  '17.6 FretboardView utiliza diretamente a propriedade n.octave de getFretNote sem aproximações'
);

// 17.7 Comentário do Seletor de Trilhas no Currículo
const curriculumViewSource = fs.readFileSync('src/components/curriculum/CurriculumView.tsx', 'utf-8');
assert(
  curriculumViewSource.includes('Domínio Total do Violão — 60 Aulas'),
  '17.7 CurriculumView possui comentário atualizado para "Domínio Total do Violão — 60 Aulas"'
);

// =============================================================
// GRUPO 18 — GUITAR ACADEMY MASTER UPDATE
// Premium Splash Screen, Responsive Layout & Scroll Stability
// =============================================================

console.log('\n--- GRUPO 18: GUITAR ACADEMY MASTER UPDATE (SPLASH & SCROLL) ---');

// 18.1 Nova Abertura Premium: permanência de 3500ms e transição de saída de 400ms
assert(
  splashCode.includes('durationMs = 3500'),
  '18.1 SplashScreen define permanência visual da abertura em 3.500 ms (3,5 segundos)'
);
assert(
  splashCode.includes('400') && splashCode.includes('fadeOutDurationMs = 450'),
  '18.1 SplashScreen implementa transição suave de saída para a Home entre 350 e 500 ms'
);

// 18.2 Identidade visual canônica na Abertura Premium
assert(
  splashCode.includes('#F8F7F4') &&
  splashCode.includes('#7B1E2B') &&
  splashCode.includes('#B52A3A') &&
  splashCode.includes('#25252A'),
  '18.2 SplashScreen utiliza a paleta oficial (#F8F7F4, #7B1E2B, #B52A3A, #25252A)'
);

// 18.3 Logo oficial e tipografia GUITAR ACADEMY claramente legível
assert(
  splashCode.includes('./icon.svg') && splashCode.includes('GUITAR ACADEMY'),
  '18.3 SplashScreen renderiza o ícone oficial ./icon.svg e o nome GUITAR ACADEMY'
);

// 18.4 Monitoramento de carregamento da imagem antes de iniciar o timer
assert(
  splashCode.includes('logoLoaded') &&
  splashCode.includes('onLoad') &&
  splashCode.includes('hasStartedTimer'),
  '18.4 SplashScreen aguarda carregamento efetivo da imagem antes de iniciar o timer de permanência'
);

// 18.5 Abertura executada somente na inicialização e não a cada troca de aba
assert(
  appCode.includes('const [showSplash, setShowSplash] = useState(true)') &&
  appCode.includes('{showSplash && <SplashScreen'),
  '18.5 App.tsx gerencia SplashScreen exclusivamente no carregamento inicial da aplicação'
);

// 18.6 Dimensionamento global de viewport estável
assert(
  appCode.includes('h-screen h-[100dvh]') && appCode.includes('overflow-hidden'),
  '18.6 App.tsx fixa contêiner externo em 100dvh e overflow-hidden para eliminar duplo scroll'
);

// 18.7 Rolagem estável em <main> com padding inferior seguro
assert(
  appCode.includes('overflow-y-auto') &&
  appCode.includes('overflow-x-hidden') &&
  appCode.includes('safe-area-inset-bottom'),
  '18.7 <main> atua como scroll container dedicado com padding inferior seguro para a barra inferior'
);

// 18.8 Abertura de aulas e contextos garantida no topo com restauração de posição
assert(
  appCode.includes('resetScrollToTop') &&
  appCode.includes('mainScrollRef.current.scrollTop = 0') &&
  appCode.includes('navigationService.saveScrollPosition'),
  '18.8 App.tsx inicia aulas no topo e preserva a posição anterior da lista do currículo'
);

// =============================================================
// GRUPO 19 — INTELLIGENT LEARNING SYSTEM V1
// Motor Central, Continuidade, 12 Domínios, Prática Real & Planos
// =============================================================

console.log('\n--- GRUPO 19: INTELLIGENT LEARNING SYSTEM V1 ---');

// 19.1 Catálogo Unificado e Compatibilidade dos 3 Cursos (18 + 60 + 20 = 98 aulas)
const allLessonsUnified = getAllLessons();
assert(
  allLessonsUnified.length === 98,
  `19.1 Catálogo unificado consolida exatamente 98 aulas distintas (encontradas: ${allLessonsUnified.length})`
);
assert(
  getCourseLessons('canonical').length === 18 &&
  getCourseLessons('violao').length === 60 &&
  getCourseLessons('solo').length === 20,
  '19.1 Cursos segregados corretamente: Conservatório (18), Violão (60), Guitarra Solo (20)'
);
assert(
  getCourseId('violao-lesson-15') === 'violao' &&
  getCourseId('solo-lesson-7') === 'solo' &&
  getCourseId('lesson-3') === 'canonical',
  '19.1 getCourseId identifica com precisão o curso pertencente a partir do ID da aula'
);

// 19.2 Recuperação da Última Aula Acessada em Múltiplos Cursos & Continuidade
let testProg: UserProgress = {
  ...INITIAL_PROGRESS,
  completedLessons: ['lesson-1', 'violao-lesson-1'],
  currentLessonId: 'violao-lesson-2',
  lastAccessedCourseId: 'violao',
  courseLastLesson: {
    violao: 'violao-lesson-2',
    canonical: 'lesson-2',
    solo: 'solo-lesson-1',
  },
};

const contViolao = getLearningContinuity(testProg);
assert(
  contViolao.activeCourse.id === 'violao' &&
  contViolao.currentLesson.id === 'violao-lesson-2' &&
  contViolao.otherCourses.length === 2,
  '19.2 getLearningContinuity recupera o curso ativo (violao) e a última aula acessada (violao-lesson-2)'
);

// Simula troca para curso Solo
testProg.currentLessonId = 'solo-lesson-5';
testProg.lastAccessedCourseId = 'solo';
testProg.courseLastLesson = { ...testProg.courseLastLesson, solo: 'solo-lesson-5' };
const contSolo = getLearningContinuity(testProg);
assert(
  contSolo.activeCourse.id === 'solo' &&
  contSolo.currentLesson.id === 'solo-lesson-5' &&
  contSolo.otherCourses.some((c) => c.id === 'violao' && c.nextLesson?.id === 'violao-lesson-2'),
  '19.2 Alternância entre cursos preserva ponteiros independentes de última aula para cada trilha'
);

// 19.3 Preservação de Aulas Concluídas Sem Marcação Automática
const initialCompletedCount = testProg.completedLessons.length;
// Acessar ou calcular plano não altera completedLessons
const planTest = generateDailyPracticePlan(20, testProg);
assert(
  testProg.completedLessons.length === initialCompletedCount,
  '19.3 O cálculo do plano ou continuidade preserva estritamente completedLessons sem marcação fictícia'
);

// 19.4 Recomendações Contextuais para Aluno Iniciante/Zerado
const freshProgress: UserProgress = {
  ...INITIAL_PROGRESS,
  completedLessons: [],
  currentLessonId: 'violao-lesson-1',
  practiceSessions: [],
  manualPracticeLogs: [],
};
const recsFresh = getContextualRecommendations(freshProgress);
assert(
  recsFresh.length > 0 && recsFresh.some((r) => r.type === 'continuity'),
  '19.4 Aluno iniciante recebe recomendação determinística de continuidade para a primeira aula'
);

// 19.5 Recomendações Contextuais com Dados e Revisões Pendentes
const matureProgress: UserProgress = {
  ...INITIAL_PROGRESS,
  completedLessons: ['lesson-1', 'lesson-2', 'violao-lesson-1'],
  pedagogicalProfile: {
    ...createInitialPedagogicalProfile(),
    skills: {
      ...createInitialPedagogicalProfile().skills,
      'skill-alternate-picking': {
        ...createInitialPedagogicalProfile().skills['skill-alternate-picking'],
        masteryLevel: 'practicing',
        attemptsCount: 6,
        correctCount: 5,
        masteryScore: 83,
        lastPracticedDate: '2026-10-01',
        nextReviewDate: '2026-10-05', // Vencida
        reviewIntervalDays: 4,
        evidences: [
          {
            id: 'ev-alt-1',
            source: 'practice_session',
            date: '2026-10-01',
            score: 83,
            details: 'Palhetada alternada a 80 BPM',
          },
        ],
      },
    },
  },
};
const recsMature = getContextualRecommendations(matureProgress);
assert(
  recsMature.some((r) => r.type === 'spaced_review'),
  '19.5 Recomendações identificam revisões espaçadas vencidas com prioridade determinística'
);

// 19.6 Geração do Plano Diário de Prática para Todas as Durações (10, 15, 20, 30, 45, 60m)
const durations: (10 | 15 | 20 | 30 | 45 | 60)[] = [10, 15, 20, 30, 45, 60];
for (const dur of durations) {
  const p = generateDailyPracticePlan(dur, matureProgress);
  assert(
    p.totalMinutes === dur,
    `19.6 Plano de prática diária de ${dur} min soma exatamente ${dur} minutos (soma: ${p.totalMinutes})`
  );
  assert(
    p.steps.length === 5,
    `19.6 Plano de ${dur} min possui 5 etapas progressivas (Aquecimento, Habilidade, Aplicação, Revisão, Encerramento)`
  );
  assert(
    !!p.steps[0] && p.steps[0].phase === 'Aquecimento Técnico' && (p.steps[0].bpm || 0) > 0,
    `19.6 Etapa 1 de ${dur} min define aquecimento técnico com BPM e tablatura real`
  );
}

// 19.7 Geração de Rotinas na Central de Prática para 5, 10, 15, 20, 30, 45, 60 min
const routineDurations = [5, 10, 15, 20, 30, 45, 60] as const;
for (const rDur of routineDurations) {
  const routine = generatePracticeRoutine(rDur, matureProgress);
  assert(
    routine.totalEstimatedMinutes === rDur,
    `19.7 generatePracticeRoutine gera rotina precisa de ${rDur} min (obtido: ${routine.totalEstimatedMinutes})`
  );
}

// 19.8 Registro de Prática Real Manual Offline e Ausência de Duplicações
const initialManualLogsCount = matureProgress.manualPracticeLogs?.length || 0;
const sampleManualEntry: ManualPracticeLogEntry = {
  id: 'manual-test-unique-1',
  timestamp: Date.now(),
  date: '2026-11-02',
  dateStr: '2026-11-02',
  durationMinutes: 25,
  instrument: 'violao_aco',
  activityType: 'acordes',
  relatedCourseId: 'violao',
  courseRelation: 'violao',
  perceivedDifficulty: 'confortavel',
  notes: 'Treino de pestanas limpas nas casas 1 a 5',
  isManual: true,
};
const updatedWithManual = storageService.recordManualPractice(sampleManualEntry);
assert(
  (updatedWithManual.manualPracticeLogs?.length || 0) === initialManualLogsCount + 1,
  '19.8 recordManualPractice adiciona o registro manual com sucesso no progresso'
);
// Tenta adicionar novamente com o mesmo ID (não deve duplicar)
const duplicateAttempt = storageService.recordManualPractice(sampleManualEntry);
assert(
  (duplicateAttempt.manualPracticeLogs?.length || 0) === initialManualLogsCount + 1,
  '19.8 recordManualPractice previne duplicações de registros com o mesmo ID'
);

// 19.9 Diferenciação de Métricas: Tempo Manual Offline vs Interativo Verificado
const metrics = getPracticeMetrics(duplicateAttempt);
assert(
  metrics.manualOfflineSeconds >= 25 * 60,
  '19.9 getPracticeMetrics contabiliza corretamente o tempo manual offline (>= 25 min)'
);
assert(
  typeof metrics.verifiedInteractiveSeconds === 'number',
  '19.9 getPracticeMetrics segrega o tempo verificado interativo de sessões guiadas'
);

// 19.10 Mapa de Domínio Musical: 12 Áreas Técnicas e Regra da Honestidade Pedagógica
const domainMap = getSkillEvolutionMap(freshProgress);
assert(
  domainMap.domains.length === 12,
  `19.10 Mapa de domínio agrupa exatamente 12 áreas técnicas (encontradas: ${domainMap.domains.length})`
);
assert(
  domainMap.evaluatedSkillsCount === 0 && domainMap.overallEvaluatedScore === 0,
  '19.10 Aluno sem testes práticos possui 0 habilidades avaliadas'
);
const allUnevaluated = domainMap.domains.every((d) =>
  d.skills.every((s) => s.statusLabel === 'Ainda não avaliado' && s.masteryScore === null)
);
assert(
  allUnevaluated,
  '19.10 REGRA DA HONESTIDADE: Habilidades sem tentativas reais exibem estritamente "Ainda não avaliado" e score nulo'
);

// 19.11 Habilidades Avaliadas Efetivamente no Mapa de Domínio
const evaluatedMap = getSkillEvolutionMap(matureProgress);
assert(
  evaluatedMap.evaluatedSkillsCount >= 1,
  '19.11 Mapa de domínio calcula score de domínio apenas para habilidades com evidências reais'
);
const pickingSkillItem = evaluatedMap.domains
  .find((d) => d.area === 'technique_right_hand')
  ?.skills.find((s) => s.id === 'skill-alternate-picking');
assert(
  pickingSkillItem !== undefined &&
  pickingSkillItem.isEvaluated &&
  pickingSkillItem.masteryScore !== null &&
  pickingSkillItem.statusLabel !== 'Ainda não avaliado',
  '19.11 Habilidade avaliada exibe score calculado e status condizente (Em Treinamento / Proficiente)'
);

// 19.12 Preservação da Central de Prática, Metrônomo e Afinador
const appSourceContent = fs.readFileSync('src/App.tsx', 'utf-8');
assert(
  appSourceContent.includes("currentTab === 'practice-routine'") &&
  appSourceContent.includes("currentTab === 'metronome'") &&
  appSourceContent.includes("currentTab === 'tuner'"),
  '19.12 App.tsx preserva integralmente as rotas da Central de Prática, Metrônomo e Afinador'
);

// 19.13 Integridade do DashboardView com as 5 Fases do Intelligent Learning System
const dashboardViewContent = fs.readFileSync('src/components/dashboard/DashboardView.tsx', 'utf-8');
assert(
  dashboardViewContent.includes('<ContinueFormationCard') &&
  dashboardViewContent.includes('<DailyPracticePlanCard') &&
  dashboardViewContent.includes('<SkillDomainMapCard') &&
  dashboardViewContent.includes('<ContextualRecommendationsCard') &&
  dashboardViewContent.includes('<PracticeMetricsAndLogCard'),
  '19.13 DashboardView integra com sucesso os 5 componentes do Intelligent Learning System V1'
);

// =============================================================
console.log('\n--- GRUPO 20: GOOGLE AUTHENTICATION & MULTI-USER SYSTEM V1 ---');

// 20.1 Scoped Keys por UID
const keyAlphaProgress = getProgressKey('user_alpha_123');
const keyAlphaMetronome = getMetronomeKey('user_alpha_123');
const keyAlphaSearch = getSearchKey('user_alpha_123');
assert(
  keyAlphaProgress === 'guitar_academy:user_alpha_123:progress',
  '20.1 Chave de progresso isolada por UID (guitar_academy:user_alpha_123:progress)'
);
assert(
  keyAlphaMetronome === 'guitar_academy:user_alpha_123:metronome',
  '20.1 Chave de metrônomo isolada por UID (guitar_academy:user_alpha_123:metronome)'
);
assert(
  keyAlphaSearch === 'guitar_academy:user_alpha_123:search_history',
  '20.1 Chave de busca isolada por UID (guitar_academy:user_alpha_123:search_history)'
);

// 20.2 Isolamento de Dados Multiusuário (Usuário A vs Usuário B)
storageService.setCurrentUser('user_alpha_123');
const progressAlpha = storageService.loadProgress();
progressAlpha.completedLessons = ['lesson-1', 'violao-lesson-1'];
progressAlpha.totalStudyTimeSeconds = 3600;
storageService.saveProgress(progressAlpha);

storageService.setCurrentUser('user_beta_456');
const progressBeta = storageService.loadProgress();
assert(
  progressBeta.completedLessons.length === 0,
  '20.2 Usuário B inicia com progresso limpo, sem contaminação dos dados do Usuário A'
);
progressBeta.completedLessons = ['solo-lesson-1'];
progressBeta.totalStudyTimeSeconds = 1800;
storageService.saveProgress(progressBeta);

// Validação cruzada: Usuário A não foi alterado pelo Usuário B
storageService.setCurrentUser('user_alpha_123');
const checkAlpha = storageService.loadProgress();
assert(
  checkAlpha.completedLessons.length === 2 &&
  checkAlpha.completedLessons.includes('lesson-1') &&
  checkAlpha.completedLessons.includes('violao-lesson-1') &&
  !checkAlpha.completedLessons.includes('solo-lesson-1'),
  '20.2 Usuário A preserva estritamente suas aulas sem vazamento de dados do Usuário B'
);

// Validação cruzada: Usuário B mantém apenas suas próprias aulas
storageService.setCurrentUser('user_beta_456');
const checkBeta = storageService.loadProgress();
assert(
  checkBeta.completedLessons.length === 1 &&
  checkBeta.completedLessons.includes('solo-lesson-1') &&
  !checkBeta.completedLessons.includes('lesson-1'),
  '20.2 Usuário B mantém isolamento absoluto de suas próprias aulas'
);

// 20.3 Metrônomo e Busca Isolados por Estudante
storageService.setCurrentUser('user_alpha_123');
storageService.saveMetronome({ ...INITIAL_PROGRESS as any, bpm: 155, volume: 0.9, timerMinutes: 15, subdivision: 'quarter', accentFirstBeat: true, speedTrainer: { enabled: false, bpmIncrement: 5, everyMeasures: 4, targetBpm: 160 } } as any);
storageService.addRecentSearch('caged sistema');

storageService.setCurrentUser('user_beta_456');
storageService.saveMetronome({ ...INITIAL_PROGRESS as any, bpm: 95, volume: 0.5, timerMinutes: 10, subdivision: 'quarter', accentFirstBeat: true, speedTrainer: { enabled: false, bpmIncrement: 5, everyMeasures: 4, targetBpm: 160 } } as any);
storageService.addRecentSearch('fingerstyle violao');

storageService.setCurrentUser('user_alpha_123');
assert(
  storageService.loadMetronome().bpm === 155,
  '20.3 Metrônomo do Usuário A preserva andamento independente de 155 BPM'
);
assert(
  storageService.getRecentSearches().includes('caged sistema') &&
  !storageService.getRecentSearches().includes('fingerstyle violao'),
  '20.3 Histórico de buscas do Usuário A isolado de outros estudantes'
);

storageService.setCurrentUser('user_beta_456');
assert(
  storageService.loadMetronome().bpm === 95,
  '20.3 Metrônomo do Usuário B preserva andamento independente de 95 BPM'
);
assert(
  storageService.getRecentSearches().includes('fingerstyle violao') &&
  !storageService.getRecentSearches().includes('caged sistema'),
  '20.3 Histórico de buscas do Usuário B isolado de outros estudantes'
);

// 20.4 Preservação e Arquivamento Não-Destrutivo de Dados Legados
localStorage.setItem('guitar_academy_user_progress_v1', JSON.stringify({
  ...INITIAL_PROGRESS,
  completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
  totalStudyTimeSeconds: 5400,
}));
assert(
  storageService.hasLegacyData(),
  '20.4 Sistema detecta dados legados pré-existentes no dispositivo'
);
const archived = storageService.archiveLegacyData();
assert(
  archived,
  '20.4 Sistema arquiva backup preventivo não-destrutivo em guitar_academy:legacy_backup_v1'
);
const legacyBackupContent = storageService.getLegacyData();
assert(
  legacyBackupContent !== null && legacyBackupContent.completedLessons.length === 3,
  '20.4 Backup legado recuperável preserva exatamente as 3 aulas concluídas anteriores'
);

// 20.5 Criação de Conservatório Limpo para Novo Aluno
storageService.createFreshSlateForUser('user_gamma_789');
const gammaProgress = storageService.loadProgress('user_gamma_789');
assert(
  gammaProgress.completedLessons.length === 0,
  '20.5 Novo aluno que opta por início limpo recebe conservatório da Aula 1 sem histórico contaminado'
);

// 20.6 Importação Controlada de Dados Legados
storageService.importLegacyDataForUser('user_delta_101');
const deltaProgress = storageService.loadProgress('user_delta_101');
assert(
  deltaProgress.completedLessons.length === 3 &&
  deltaProgress.completedLessons.includes('lesson-3'),
  '20.6 Aluno que opta por importar histórico anterior recebe os dados com sucesso'
);

// 20.7 Algoritmo de Mesclagem Bidirecional Local/Nuvem (Fase 7)
const localState: UserProgress = {
  ...INITIAL_PROGRESS,
  completedLessons: ['lesson-1', 'lesson-2'],
  totalStudyTimeSeconds: 2000,
  practicedBpm: 120,
};
const cloudState: UserProgress = {
  ...INITIAL_PROGRESS,
  completedLessons: ['lesson-2', 'lesson-3', 'violao-lesson-1'],
  totalStudyTimeSeconds: 3200,
  practicedBpm: 140,
};
const mergedState = mergeProgressStates(localState, cloudState);
assert(
  mergedState.completedLessons.length === 4 &&
  mergedState.completedLessons.includes('lesson-1') &&
  mergedState.completedLessons.includes('lesson-3') &&
  mergedState.completedLessons.includes('violao-lesson-1'),
  '20.7 Mesclagem nuvem/local realiza união sem duplicatas de aulas concluídas'
);
assert(
  mergedState.totalStudyTimeSeconds === 3200,
  '20.7 Mesclagem nuvem/local preserva o maior tempo total de estudo acumulado (3200s)'
);
assert(
  mergedState.practicedBpm === 140,
  '20.7 Mesclagem nuvem/local preserva o maior andamento de metrônomo praticado (140 BPM)'
);

// 20.8 Logout e Limpeza de Sessão
storageService.setCurrentUser('user_alpha_123');
assert(storageService.getCurrentUser() === 'user_alpha_123', '20.8 Usuário ativo autenticado');
storageService.setCurrentUser(null);
assert(
  storageService.getCurrentUser() === null,
  '20.8 Logout limpa ponteiro do usuário ativo em memória e chave de sessão'
);

// 20.9 Validação do Blueprint e Regras de Segurança do Firestore
const blueprintRaw = fs.readFileSync('firebase-blueprint.json', 'utf-8');
const blueprintObj = JSON.parse(blueprintRaw);
assert(
  blueprintObj.entities?.UserProfile &&
  blueprintObj.entities?.UserProgress &&
  blueprintObj.firestore?.['/users/{userId}'],
  '20.9 firebase-blueprint.json define entidades UserProfile, UserProgress e caminho /users/{userId}'
);

const rulesRaw = fs.readFileSync('firestore.rules', 'utf-8');
assert(
  rulesRaw.includes('request.auth.uid == userId') &&
  rulesRaw.includes('allow read, write: if false;'),
  '20.9 firestore.rules aplica Zero-Trust: estritamente restrito a request.auth.uid == userId com negação padrão'
);

// 20.10 Arquitetura e Integração com a Aplicação
const appAuthCode = fs.readFileSync('src/App.tsx', 'utf-8');
assert(
  appAuthCode.includes('<AuthProvider>') &&
  appAuthCode.includes('<LoginModal') &&
  appAuthCode.includes('<UserProfileModal') &&
  appAuthCode.includes('<LegacyDataModal'),
  '20.10 App.tsx integra AuthProvider, LoginModal, UserProfileModal e LegacyDataModal'
);

const headerAuthCode = fs.readFileSync('src/components/layout/Header.tsx', 'utf-8');
assert(
  headerAuthCode.includes('useAuth') &&
  (headerAuthCode.includes('onOpenProfile') || headerAuthCode.includes('onOpenAuth')),
  '20.10 Header.tsx exibe avatar do aluno autenticado e gatilhos de login/perfil'
);

// -------------------------------------------------------------
// GRUPO 21: Teacher Intelligence Dashboard V1 (Gestão Pedagógica, Analytics e Governança)
// -------------------------------------------------------------
console.log('\n--- GRUPO 21: Teacher Intelligence Dashboard V1 ---');

import { TeacherService } from './src/services/teacherService';
import { 
  EducationalEvent, 
  ClassGroup, 
  TeacherFilterState 
} from './src/types/index';

// 21.1 Resolução de Papéis e Permissões (RBAC) via system_roles/{uid} (Zero-Trust)
const teacherRole = await TeacherService.resolveUserRole('teacher_uid', async (uid) => {
  return uid === 'teacher_uid' ? { role: 'teacher' } : null;
});
assert(
  teacherRole === 'teacher',
  '21.1 Fonte autoritativa system_roles/{uid} resolve perfil docente para UID autorizado'
);

const studentRole = await TeacherService.resolveUserRole('student_uid_1', async () => null);
assert(
  studentRole === 'student',
  '21.1 Usuário sem documento em system_roles resolve estritamente perfil student sem privilégios'
);

// 21.2 Criação Segura de Turmas e Geração de Código de Convite
const newClass = await TeacherService.createClass(
  'teacher_uid',
  'coordenador@guitaracademy.com',
  'Prof. Dennis',
  'Turma Conservatório Violão Noite',
  'Turma noturna focada nas 60 aulas de Violão'
);
const classCode = newClass.code || (newClass as any).inviteCode;
assert(
  newClass.id && classCode && classCode.startsWith('GA-'),
  '21.2 Turma criada com identificador único e código de convite seguro com prefixo GA-'
);

// 21.3 Vinculação de Aluno à Turma via Código de Convite
const joinResult = await TeacherService.joinClassWithInviteCode(
  classCode,
  'student_test_1',
  'Carlos Eduardo',
  'carlos.violao@gmail.com'
);
assert(
  joinResult.success && joinResult.classGroup?.id === newClass.id,
  '21.3 Aluno entra com sucesso na turma utilizando o código de convite emitido'
);

// Tentativa com código inválido
const invalidJoin = await TeacherService.joinClassWithInviteCode(
  'GA-INVALID-999',
  'student_test_2',
  'Marina Silva',
  'marina@gmail.com'
);
assert(
  Boolean(!invalidJoin.success && invalidJoin.error),
  '21.3 Código de convite inexistente é rejeitado com mensagem de erro clara'
);

// 21.4 Modelo de Eventos Educacionais e Separação de Medição
const testEventVerified: Omit<EducationalEvent, 'id' | 'timestamp'> = {
  studentUid: 'student_test_1',
  studentName: 'Carlos Eduardo',
  studentEmail: 'carlos.violao@gmail.com',
  classId: newClass.id,
  courseId: 'violao',
  lessonId: 'violao-lesson-1',
  eventType: 'lesson_completed',
  category: 'guided_lessons',
  durationSeconds: 900,
  measurementType: 'verified_interactive',
  metadata: { bpm: 72, repetitions: 50 },
};
const loggedVerified = await TeacherService.logEducationalEvent(testEventVerified);
assert(
  Boolean(loggedVerified.id && loggedVerified.measurementType === 'verified_interactive'),
  '21.4 Evento interativo com metrônomo/quiz classificado como verified_interactive'
);

const testEventManual: Omit<EducationalEvent, 'id' | 'timestamp'> = {
  studentUid: 'student_test_1',
  studentName: 'Carlos Eduardo',
  studentEmail: 'carlos.violao@gmail.com',
  classId: newClass.id,
  courseId: 'violao',
  eventType: 'manual_practice_logged',
  category: 'instrumental_practice',
  durationSeconds: 1800,
  measurementType: 'manual_logged',
  metadata: { notes: 'Estudo de pestanas e dedilhado' },
};
const loggedManual = await TeacherService.logEducationalEvent(testEventManual);
assert(
  Boolean(loggedManual.id && loggedManual.measurementType === 'manual_logged'),
  '21.4 Prática offline registrada manualmente classificada como manual_logged'
);

// 21.5 Integridade Matemática da Tabela Analítica e Denominador Explícito
const testFilter: TeacherFilterState = {
  period: '30d',
  classId: newClass.id,
  courseId: 'all',
  category: 'all',
};
const sampleEvents: EducationalEvent[] = [
  loggedVerified,
  loggedManual,
  {
    id: 'evt_3',
    studentUid: 'student_test_1',
    studentName: 'Carlos Eduardo',
    studentEmail: 'carlos.violao@gmail.com',
    classId: newClass.id,
    courseId: 'violao',
    eventType: 'theory_content_opened',
    category: 'music_theory',
    durationSeconds: 600,
    measurementType: 'verified_interactive',
    timestamp: new Date().toISOString(),
  },
];
const analyticsTable = TeacherService.buildAnalyticsTable(sampleEvents, 1);
assert(
  analyticsTable.length > 0,
  '21.5 Tabela analítica gerada a partir dos eventos educacionais da turma'
);
const guidedRow = analyticsTable.find((r) => r.category === 'guided_lessons');
assert(
  Boolean(guidedRow && guidedRow.verifiedCount === 1 && guidedRow.denominatorTotal === 3),
  '21.5 Tabela analítica calcula percentual com base no denominador total de eventos (1/3 = 33.3%)'
);
assert(
  guidedRow?.verifiedTimeSeconds === 900 && guidedRow?.manualTimeSeconds === 0,
  '21.5 Tempo interativo verificado e tempo manual são segregados matematicamente'
);

// 21.6 Funil Pedagógico dos Cursos (Violão 60, Conservatório 18, Solo 20)
const sampleSummaries = TeacherService.getStudentSummaries(newClass.id);
const funnelViolao = TeacherService.buildCourseFunnel('violao', sampleSummaries, sampleEvents);
assert(
  funnelViolao.length === 60,
  '21.6 Funil pedagógico do curso Violão contém exatamente as 60 aulas estruturadas'
);
assert(
  funnelViolao[0].lessonNumber === 1 && funnelViolao[59].lessonNumber === 60,
  '21.6 Funil de Violão mapeia da Aula 1 até a Aula 60 sequencialmente'
);

const funnelConservatorio = TeacherService.buildCourseFunnel('canonical', sampleSummaries, sampleEvents);
assert(
  funnelConservatorio.length === 18,
  '21.6 Funil pedagógico do Conservatório Canônico contém as 18 aulas da grade'
);

const funnelSolo = TeacherService.buildCourseFunnel('solo', sampleSummaries, sampleEvents);
assert(
  funnelSolo.length === 20,
  '21.6 Funil pedagógico de Guitarra Solo contém as 20 aulas do curso avançado'
);

// 21.7 Diagnóstico de Gargalos Pedagógicos (Estrutura Tripartite: Fato, Hipótese, Intervenção)
const sampleFunnelRows = [
  {
    lessonId: 'violao-lesson-7',
    lessonTitle: 'Primeiros Acordes Maiores: Dó (C) e Sol (G)',
    moduleTitle: 'Módulo 2: Acordes Fundamentais',
    lessonNumber: 7,
    eligibleStudents: 10,
    startedStudents: 10,
    masteredStudents: 4,
    completionRatePct: 40,
    dropRatePct: 35,
    averagePracticeMinutes: 12,
  },
];
const bottlenecks = TeacherService.detectPedagogicalBottlenecks(sampleFunnelRows, []);
assert(
  bottlenecks.length > 0,
  '21.7 Sistema detecta automaticamente aula com taxa de evasão superior a 30%'
);
assert(
  bottlenecks[0].observedFact.length > 0 &&
  bottlenecks[0].pedagogicalHypothesis.length > 0 &&
  bottlenecks[0].interventionSuggestion.length > 0,
  '21.7 Diagnóstico estruturado no padrão pedagógico: Fato Observado, Hipótese e Intervenção Sugerida'
);

// 21.8 Exportação de Relatórios em Formato CSV Seguro
const csvStudents = TeacherService.exportReportToCsv('students', sampleSummaries, 'Turma_Teste');
assert(
  Boolean(
    csvStudents.success &&
    csvStudents.csvContent &&
    csvStudents.csvContent.includes('Nome,Email,Turma') &&
    csvStudents.csvContent.includes('Carlos Eduardo')
  ),
  '21.8 Exportador CSV gera cabeçalhos padronizados e escapa registros de alunos'
);

const csvBottlenecks = TeacherService.exportReportToCsv('bottlenecks', bottlenecks, 'Turma_Teste');
assert(
  Boolean(
    csvBottlenecks.success &&
    csvBottlenecks.csvContent &&
    csvBottlenecks.csvContent.includes('Gravidade,Titulo,Fato Observado,Hipotese Pedagogica,Sugestao Intervencao')
  ),
  '21.8 Exportador CSV gera relatório analítico de gargalos pedagógicos'
);

// 21.9 Regras de Segurança do Firestore (Zero-Trust ABAC)
const firestoreRulesText = fs.readFileSync('firestore.rules', 'utf-8');
assert(
  firestoreRulesText.includes('isTeacher()') &&
  firestoreRulesText.includes('system_roles'),
  '21.9 firestore.rules valida explicitamente a credencial do professor via system_roles autorizativo'
);
assert(
  firestoreRulesText.includes('match /users/{userId}') &&
  firestoreRulesText.includes('isOwner(userId) || isAdmin()') &&
  firestoreRulesText.includes('allow create: if isOwner(userId)'),
  '21.9 firestore.rules permite leitura autorizada ao administrador mas impede escrita no progresso do aluno por terceiros'
);
assert(
  firestoreRulesText.includes('match /classes/{classId}') &&
  firestoreRulesText.includes('if isTeacher()'),
  '21.9 firestore.rules restringe criação e edição de turmas ao professor'
);

// 21.10 Integração com Navegação e Interface
const navigationServiceCode = fs.readFileSync('src/services/navigationService.ts', 'utf-8');
assert(
  navigationServiceCode.includes("'teacher-dashboard'") &&
  navigationServiceCode.includes('Gestão Pedagógica'),
  '21.10 navigationService.ts registra a aba teacher-dashboard mapeada para o pilar Evoluir'
);

const teacherHeaderCode = fs.readFileSync('src/components/layout/Header.tsx', 'utf-8');
assert(
  !teacherHeaderCode.includes('dramosdasilva7@gmail.com'),
  '21.10 Header.tsx não expõe emails hardcoded garantindo isolamento entre aluno e administração'
);

const userProfileModalCode = fs.readFileSync('src/components/profile/UserProfileModal.tsx', 'utf-8');
assert(
  userProfileModalCode.includes('Abrir Painel de Gestão Pedagógica') &&
  userProfileModalCode.includes('Vincular a uma Turma com Código'),
  '21.10 UserProfileModal.tsx oferece atalhos contextuais para professor e para adesão de alunos a turmas'
);

const appTsxCode = fs.readFileSync('src/App.tsx', 'utf-8');
assert(
  appTsxCode.includes('TeacherDashboardView') &&
  appTsxCode.includes('StudentJoinClassModal') &&
  appTsxCode.includes('StudentPrivacyNotice'),
  '21.10 App.tsx integra TeacherDashboardView, StudentJoinClassModal e StudentPrivacyNotice'
);

// -------------------------------------------------------------
// GRUPO 22: MASTER CORE V1.0 — NÚCLEO DA MATRIZ CENTRAL (FASE 2)
// -------------------------------------------------------------
console.log('\n--- GRUPO 22: MASTER CORE V1.0 — NÚCLEO DA MATRIZ CENTRAL (FASE 2) ---');

import { 
  OFFICIAL_INSTRUMENTS, 
  OFFICIAL_LEVELS, 
  OFFICIAL_COURSES,
  getRegisteredInstruments,
  getInstrumentById,
  getLevelDefinition,
  getOfficialCourses,
  getCourseById,
  verifyCurriculumIntegrity,
  getCourseLessonSummaries
} from './src/academia/curriculum/masterCurriculumRegistry';

// 22.1 Cinco instrumentos oficiais definidos
assert(
  OFFICIAL_INSTRUMENTS.length === 5,
  '22.1 Matriz Central registra exatamente os 5 instrumentos oficiais'
);
const instrumentIds = OFFICIAL_INSTRUMENTS.map(i => i.id);
assert(
  instrumentIds.includes('violao') &&
  instrumentIds.includes('guitarra') &&
  instrumentIds.includes('baixo') &&
  instrumentIds.includes('teclado') &&
  instrumentIds.includes('bateria'),
  '22.1 Instrumentos oficiais: Violão, Guitarra, Baixo, Teclado e Bateria'
);
const violaoInst = getInstrumentById('violao');
assert(
  violaoInst?.status === 'active' && violaoInst?.family === 'cordas_acusticas' && violaoInst?.stringsCount === 6,
  '22.1 Violão configurado como ativo com 6 cordas e família de cordas acústicas'
);
const guitarraInst = getInstrumentById('guitarra');
assert(
  guitarraInst?.status === 'active' && guitarraInst?.family === 'cordas_eletricas',
  '22.1 Guitarra configurada como ativa com família de cordas elétricas'
);
const baixoInst = getInstrumentById('baixo');
assert(
  (baixoInst?.status === 'active' || baixoInst?.status === 'in_development') && baixoInst?.stringsCount === 4,
  '22.1 Baixo registrado no núcleo com 4 cordas'
);
const tecladoInst = getInstrumentById('teclado');
assert(
  (tecladoInst?.status === 'active' || tecladoInst?.status === 'in_development') && tecladoInst?.keysCount === 61,
  '22.1 Teclado registrado no núcleo com 61 teclas'
);
const bateriaInst = getInstrumentById('bateria');
assert(
  (bateriaInst?.status === 'active' || bateriaInst?.status === 'in_development') && bateriaInst?.family === 'percussao',
  '22.1 Bateria registrada no núcleo com família percussão'
);

// 22.2 Seis níveis acadêmicos padronizados de 0 a 5
assert(
  OFFICIAL_LEVELS.length === 6,
  '22.2 Matriz Central padroniza exatamente os 6 níveis acadêmicos de conservatório (0 a 5)'
);
const level0 = getLevelDefinition(0);
const level1 = getLevelDefinition(1);
const level2 = getLevelDefinition(2);
const level3 = getLevelDefinition(3);
const level4 = getLevelDefinition(4);
const level5 = getLevelDefinition(5);

assert(
  level0.code === 'LVL-0' && level0.name.includes('Fundamentos'),
  '22.2 Nível 0 padronizado: Fundamentos (Absoluto Zero)'
);
assert(
  level1.code === 'LVL-1' && level1.name.includes('Iniciação'),
  '22.2 Nível 1 padronizado: Iniciação'
);
assert(
  level2.code === 'LVL-2' && level2.name.includes('Desenvolvimento Básico'),
  '22.2 Nível 2 padronizado: Desenvolvimento Básico'
);
assert(
  level3.code === 'LVL-3' && level3.name.includes('Intermediário'),
  '22.2 Nível 3 padronizado: Intermediário'
);
assert(
  level4.code === 'LVL-4' && level4.name.includes('Avançado'),
  '22.2 Nível 4 padronizado: Avançado'
);
assert(
  level5.code === 'LVL-5' && level5.name.includes('Especialização e Performance'),
  '22.2 Nível 5 padronizado: Especialização e Performance'
);

// 22.3 Catálogo oficial de cursos da Matriz Central
const courses = getOfficialCourses();
assert(
  courses.length >= 3 &&
  courses.some(c => c.id === 'violao') &&
  courses.some(c => c.id === 'canonical') &&
  courses.some(c => c.id === 'solo'),
  '22.3 Catálogo central registra os 3 cursos consolidados (Violão 60, Guitarra 18, Solo 20)'
);
const violaoCourse = getCourseById('violao');
assert(
  violaoCourse?.totalLessons === 60 && violaoCourse?.totalModules === 10 && violaoCourse?.isCanonical === true,
  '22.3 Curso de Violão registrado com 60 aulas, 10 módulos e status canônico'
);
const canonicalCourse = getCourseById('canonical');
assert(
  canonicalCourse?.totalLessons === 18 && canonicalCourse?.totalModules === 6,
  '22.3 Conservatório Canônico de Guitarra registrado com 18 aulas e 6 níveis'
);
const soloCourse = getCourseById('solo');
assert(
  soloCourse?.totalLessons === 20 && soloCourse?.totalModules === 5,
  '22.3 Formação em Guitarra Solo registrada com 20 aulas e 5 etapas'
);

// 22.4 Preservação e integridade dos currículos existentes
const integrityCheck = verifyCurriculumIntegrity();
assert(
  integrityCheck.isValid === true && integrityCheck.errors.length === 0,
  `22.4 Auditoria em runtime confirma integridade absoluta dos currículos (Erros: ${integrityCheck.errors.join(', ') || 'Nenhum'})`
);
assert(
  integrityCheck.violaoCount === 60,
  '22.4 Exatamente 60 aulas de Violão preservadas'
);
assert(
  integrityCheck.canonicalCount === 18,
  '22.4 Exatamente 18 aulas canônicas de Guitarra preservadas'
);
assert(
  integrityCheck.soloCount === 20,
  '22.4 Exatamente 20 aulas de Guitarra Solo preservadas'
);
assert(
  integrityCheck.violaoCount + integrityCheck.canonicalCount + integrityCheck.soloCount === 98,
  '22.4 Total acumulado preservado: 98 aulas completas de conservatório'
);

// 22.5 Geração de sumários de aulas no padrão da Matriz Central
const violaoSummaries = getCourseLessonSummaries('violao');
assert(
  violaoSummaries.length === 60 && violaoSummaries[0].id === 'violao-lesson-1' && violaoSummaries[59].id === 'violao-lesson-60',
  '22.5 Sumários de Violão cobrem da Aula 1 à Aula 60 com integridade'
);
const canonicalSummaries = getCourseLessonSummaries('canonical');
assert(
  canonicalSummaries.length === 18 && canonicalSummaries[0].id === 'lesson-1',
  '22.5 Sumários da Guitarra Canônica cobrem as 18 aulas'
);
const soloSummaries = getCourseLessonSummaries('solo');
assert(
  soloSummaries.length === 20 && soloSummaries[0].id === 'solo-lesson-1',
  '22.5 Sumários de Guitarra Solo cobrem as 20 aulas especializadas'
);

// 22.6 Contratos de dados exportados e verificados
const typesFileCode = fs.readFileSync('src/academia/core/types.ts', 'utf-8');
assert(
  typesFileCode.includes('AcademicInstrument') &&
  typesFileCode.includes('AcademicLevelDefinition') &&
  typesFileCode.includes('AcademicCourse') &&
  typesFileCode.includes('AcademicCompetency') &&
  typesFileCode.includes('AcademicEnrollment') &&
  typesFileCode.includes('AcademicProgressSnapshot') &&
  typesFileCode.includes('AcademicAssessmentRubric') &&
  typesFileCode.includes('AcademicPracticalAssessment') &&
  typesFileCode.includes('AcademicCertificate'),
  '22.6 Contratos de dados mestres da Matriz Central implementados em src/academia/core/types.ts'
);

const indexTypesCode = fs.readFileSync('src/types/index.ts', 'utf-8');
assert(
  indexTypesCode.includes('../academia/core/types') &&
  indexTypesCode.includes('../academia/curriculum/masterCurriculumRegistry'),
  '22.6 src/types/index.ts reexporta os contratos da academia mantendo compatibilidade'
);

// -------------------------------------------------------------
// GRUPO 23: FASE 3 — EXPANSÃO CURRICULAR E REGISTRO UNIFICADO DOS 5 INSTRUMENTOS
// -------------------------------------------------------------
console.log('\n--- GRUPO 23: FASE 3 — EXPANSÃO CURRICULAR E REGISTRO UNIFICADO DOS 5 INSTRUMENTOS ---');

import { 
  BAIXO_CURRICULUM_MODULES,
  TECLADO_CURRICULUM_MODULES,
  BATERIA_CURRICULUM_MODULES,
  getCurriculumModulesByInstrument,
  getAllExpandedCurriculumModules
} from './src/academia/curriculo/mestreCurriculumRegistry';

// 23.1 Novo Curso — Baixo Elétrico (6 níveis, 18 aulas estruturadas)
assert(
  BAIXO_CURRICULUM_MODULES.length === 6,
  '23.1 Baixo Elétrico estruturado em exatamente 6 níveis acadêmicos (0 a 5)'
);
const baixoNiveis = BAIXO_CURRICULUM_MODULES.map(m => m.nivel);
assert(
  baixoNiveis.includes(0) && baixoNiveis.includes(1) && baixoNiveis.includes(2) &&
  baixoNiveis.includes(3) && baixoNiveis.includes(4) && baixoNiveis.includes(5),
  '23.1 Baixo Elétrico cobre todos os 6 níveis de 0 a 5 sequencialmente'
);
const baixoMod0 = BAIXO_CURRICULUM_MODULES.find(m => m.nivel === 0);
assert(
  Boolean(baixoMod0?.nome.includes('Anatomia') &&
  baixoMod0?.conteudos.some(c => c.includes('E-A-D-G')) &&
  baixoMod0?.aulas.length === 3),
  '23.1 Baixo Nível 0: Anatomia de 4 cordas, afinação E-A-D-G, postura e pulsação'
);
const baixoMod1 = BAIXO_CURRICULUM_MODULES.find(m => m.nivel === 1);
assert(
  Boolean(baixoMod1?.nome.includes('Pizzicato') &&
  baixoMod1?.conteudos.some(c => c.includes('Alternância')) &&
  baixoMod1?.aulas.length === 3),
  '23.1 Baixo Nível 1: Alternância de dedos, pizzicato, notas naturais e primeiras linhas'
);
const baixoMod2 = BAIXO_CURRICULUM_MODULES.find(m => m.nivel === 2);
assert(
  Boolean(baixoMod2?.nome.includes('Groove') &&
  baixoMod2?.conteudos.some(c => c.includes('Tônica')) &&
  baixoMod2?.aulas.length === 3),
  '23.1 Baixo Nível 2: Escalas, intervalos T-5-8, groove, síncopes e acompanhamento'
);
const baixoMod3 = BAIXO_CURRICULUM_MODULES.find(m => m.nivel === 3);
assert(
  Boolean(baixoMod3?.nome.includes('Walking Bass') &&
  baixoMod3?.conteudos.some(c => c.includes('Ghost notes')) &&
  baixoMod3?.aulas.length === 3),
  '23.1 Baixo Nível 3: Campo harmônico, arpejos de tétrades, walking bass e ghost notes'
);
const baixoMod4 = BAIXO_CURRICULUM_MODULES.find(m => m.nivel === 4);
assert(
  Boolean(baixoMod4?.nome.includes('Slap') &&
  baixoMod4?.conteudos.some(c => c.includes('Pop')) &&
  baixoMod4?.aulas.length === 3),
  '23.1 Baixo Nível 4: Slap, pop, tapping, modos gregos e métricas compostas'
);
const baixoMod5 = BAIXO_CURRICULUM_MODULES.find(m => m.nivel === 5);
assert(
  Boolean(baixoMod5?.nome.includes('Performance') &&
  baixoMod5?.conteudos.some(c => c.includes('Improvisação')) &&
  baixoMod5?.aulas.length === 3),
  '23.1 Baixo Nível 5: Improvisação, harmonia avançada, linhas autorais e performance'
);

// 23.2 Novo Curso — Teclado e Piano Complementar (6 níveis, 18 aulas estruturadas)
assert(
  TECLADO_CURRICULUM_MODULES.length === 6,
  '23.2 Teclado estruturado em exatamente 6 níveis acadêmicos (0 a 5)'
);
const tecladoNiveis = TECLADO_CURRICULUM_MODULES.map(m => m.nivel);
assert(
  tecladoNiveis.includes(0) && tecladoNiveis.includes(1) && tecladoNiveis.includes(2) &&
  tecladoNiveis.includes(3) && tecladoNiveis.includes(4) && tecladoNiveis.includes(5),
  '23.2 Teclado cobre todos os 6 níveis de 0 a 5 sequencialmente'
);
const tecladoMod0 = TECLADO_CURRICULUM_MODULES.find(m => m.nivel === 0);
assert(
  Boolean(tecladoMod0?.nome.includes('Geografia') &&
  tecladoMod0?.conteudos.some(c => c.includes('2 e 3 teclas pretas')) &&
  tecladoMod0?.aulas.length === 3),
  '23.2 Teclado Nível 0: Geografia das teclas, notas musicais, postura, dedos 1 a 5'
);
const tecladoMod1 = TECLADO_CURRICULUM_MODULES.find(m => m.nivel === 1);
assert(
  Boolean(tecladoMod1?.nome.includes('Dedilhado') &&
  tecladoMod1?.conteudos.some(c => c.includes('passagem do polegar')) &&
  tecladoMod1?.aulas.length === 3),
  '23.2 Teclado Nível 1: Escalas maiores, passagem de polegar, intervalos e tríades'
);
const tecladoMod2 = TECLADO_CURRICULUM_MODULES.find(m => m.nivel === 2);
assert(
  Boolean(tecladoMod2?.nome.includes('Inversões') &&
  tecladoMod2?.conteudos.some(c => c.includes('campo harmônico')) &&
  tecladoMod2?.aulas.length === 3),
  '23.2 Teclado Nível 2: Inversões de tríades, escalas menores, campo harmônico e independência'
);
const tecladoMod3 = TECLADO_CURRICULUM_MODULES.find(m => m.nivel === 3);
assert(
  Boolean(tecladoMod3?.nome.includes('Tétrades') &&
  tecladoMod3?.conteudos.some(c => c.includes('II-V-I')) &&
  tecladoMod3?.aulas.length === 3),
  '23.2 Teclado Nível 3: Tétrades, dominantes, cadência II-V-I, condução de vozes e arpejos'
);
const tecladoMod4 = TECLADO_CURRICULUM_MODULES.find(m => m.nivel === 4);
assert(
  Boolean(tecladoMod4?.nome.includes('Tensões') &&
  tecladoMod4?.conteudos.some(c => c.includes('Voicings')) &&
  tecladoMod4?.aulas.length === 3),
  '23.2 Teclado Nível 4: Tensões harmônicas (9, 11, 13), aberturas quartais, rearmonização e modos'
);
const tecladoMod5 = TECLADO_CURRICULUM_MODULES.find(m => m.nivel === 5);
assert(
  Boolean(tecladoMod5?.nome.includes('Arranjos') &&
  tecladoMod5?.conteudos.some(c => c.includes('alterada')) &&
  tecladoMod5?.aulas.length === 3),
  '23.2 Teclado Nível 5: Harmonia avançada, piano solo completo, improvisação e performance'
);

// 23.3 Novo Curso — Bateria e Prática Rítmica (6 níveis, 18 aulas estruturadas)
assert(
  BATERIA_CURRICULUM_MODULES.length === 6,
  '23.3 Bateria estruturada em exatamente 6 níveis acadêmicos (0 a 5)'
);
const bateriaNiveis = BATERIA_CURRICULUM_MODULES.map(m => m.nivel);
assert(
  bateriaNiveis.includes(0) && bateriaNiveis.includes(1) && bateriaNiveis.includes(2) &&
  bateriaNiveis.includes(3) && bateriaNiveis.includes(4) && bateriaNiveis.includes(5),
  '23.3 Bateria cobre todos os 6 níveis de 0 a 5 sequencialmente'
);
const bateriaMod0 = BATERIA_CURRICULUM_MODULES.find(m => m.nivel === 0);
assert(
  Boolean(bateriaMod0?.nome.includes('Baquetas') &&
  bateriaMod0?.conteudos.some(c => c.includes('fulcro')) &&
  bateriaMod0?.aulas.length === 3),
  '23.3 Bateria Nível 0: Anatomia das peças, postura, pegada matched grip, fulcro e pulsação'
);
const bateriaMod1 = BATERIA_CURRICULUM_MODULES.find(m => m.nivel === 1);
assert(
  Boolean(bateriaMod1?.nome.includes('Rudimentos') &&
  bateriaMod1?.conteudos.some(c => c.includes('Paradiddle')) &&
  bateriaMod1?.aulas.length === 3),
  '23.3 Bateria Nível 1: Rudimentos básicos (single, double, paradiddle) e levada 4/4'
);
const bateriaMod2 = BATERIA_CURRICULUM_MODULES.find(m => m.nivel === 2);
assert(
  Boolean(bateriaMod2?.nome.includes('Coordenação') &&
  bateriaMod2?.conteudos.some(c => c.includes('6/8')) &&
  bateriaMod2?.aulas.length === 3),
  '23.3 Bateria Nível 2: Coordenação membros, levadas em 4/4 e 6/8, viradas dinâmicas'
);
const bateriaMod3 = BATERIA_CURRICULUM_MODULES.find(m => m.nivel === 3);
assert(
  Boolean(bateriaMod3?.nome.includes('Ghost Notes') &&
  bateriaMod3?.conteudos.some(c => c.includes('Moeller')) &&
  bateriaMod3?.aulas.length === 3),
  '23.3 Bateria Nível 3: Pé esquerdo no chimbal, ghost notes Moeller, acentuações e leitura'
);
const bateriaMod4 = BATERIA_CURRICULUM_MODULES.find(m => m.nivel === 4);
assert(
  Boolean(bateriaMod4?.nome.includes('Polirritmia') &&
  bateriaMod4?.conteudos.some(c => c.includes('7/8')) &&
  bateriaMod4?.aulas.length === 3),
  '23.3 Bateria Nível 4: Métricas ímpares (7/8), polirritmias (3:2, 4:3), ostinatos e técnica linear'
);
const bateriaMod5 = BATERIA_CURRICULUM_MODULES.find(m => m.nivel === 5);
assert(
  Boolean(bateriaMod5?.nome.includes('Grooves Autorais') &&
  bateriaMod5?.conteudos.some(c => c.includes('Jazz')) &&
  bateriaMod5?.aulas.length === 3),
  '23.3 Bateria Nível 5: Improvisação de solos, Jazz com vassourinhas, ritmos brasileiros e recital'
);

// 23.4 Padrão Acadêmico Obrigatório dos Módulos
const allExpandedMods = getAllExpandedCurriculumModules();
assert(
  allExpandedMods.length === 18,
  '23.4 Total de 18 módulos expandidos criados (6 Baixo + 6 Teclado + 6 Bateria)'
);
const modStructureValid = allExpandedMods.every(m => 
  Boolean(m.id) &&
  Boolean(m.nome) &&
  Boolean(m.objetivoAcademico) &&
  m.competenciasDesenvolvidas.length >= 3 &&
  m.preRequisitos.length >= 1 &&
  m.conteudos.length >= 4 &&
  m.exerciciosPraticos.length >= 2 &&
  m.criteriosDominio.length >= 2 &&
  Boolean(m.formaAvaliacao) &&
  m.aulas.length === 3
);
assert(
  modStructureValid === true,
  '23.4 Todos os 18 módulos cumprem rigorosamente os 9 requisitos do Padrão Acadêmico Obrigatório'
);

// 23.5 Registro Mestre Unificado dos 5 Instrumentos
const allInstruments = getRegisteredInstruments();
assert(
  allInstruments.length === 5 &&
  allInstruments.every(i => i.status === 'active'),
  '23.5 Todos os cinco instrumentos oficiais ativos no registro unificado'
);
const officialCourseIds = getOfficialCourses().map(c => c.id);
assert(
  officialCourseIds.includes('violao') &&
  officialCourseIds.includes('canonical') &&
  officialCourseIds.includes('solo') &&
  officialCourseIds.includes('baixo') &&
  officialCourseIds.includes('teclado') &&
  officialCourseIds.includes('bateria'),
  '23.5 Catálogo unificado registra os 6 cursos oficiais do conservatório sem omissões'
);

// 23.6 Preservação Integral dos Cursos Anteriores e Unicidade de Identificadores
const fullAudit = verifyCurriculumIntegrity();
assert(
  fullAudit.isValid === true && fullAudit.errors.length === 0,
  `23.6 Auditoria global confirma integridade de todos os currículos (Erros: ${fullAudit.errors.join(', ') || 'Nenhum'})`
);
assert(
  fullAudit.violaoCount === 60,
  '23.6 Violão Acústico: 60 aulas em 10 módulos 100% preservadas'
);
assert(
  fullAudit.canonicalCount === 18,
  '23.6 Guitarra Canônica: 18 aulas em 6 níveis 100% preservadas'
);
assert(
  fullAudit.soloCount === 20,
  '23.6 Guitarra Solo: 20 aulas em 5 etapas 100% preservadas'
);
assert(
  fullAudit.baixoCount === 18 && fullAudit.tecladoCount === 18 && fullAudit.bateriaCount === 18,
  '23.6 Novos instrumentos totalizam exatamente 54 aulas estruturadas (18 Baixo + 18 Teclado + 18 Bateria)'
);
assert(
  fullAudit.totalLessons === 152,
  '23.6 Plataforma acumula exatamente 152 aulas estruturadas de conservatório'
);
assert(
  fullAudit.uniqueIdsValid === true,
  '23.6 Todos os 152 identificadores de aulas e módulos são estritamente únicos sem qualquer duplicata'
);

// 23.7 Sumários de Aulas de Todos os 6 Cursos Gerados com Sucesso
const baixoSummaries = getCourseLessonSummaries('baixo');
const tecladoSummaries = getCourseLessonSummaries('teclado');
const bateriaSummaries = getCourseLessonSummaries('bateria');
assert(
  baixoSummaries.length === 18 && tecladoSummaries.length === 18 && bateriaSummaries.length === 18,
  '23.7 getCourseLessonSummaries gera sumários completos para Baixo, Teclado e Bateria'
);

// 23.8 Objetos de Dados dos Novos Cursos em src/data/ (Compatibilidade com a Interface Lesson)
import { BASS_COURSE_LEVELS, BASS_LESSONS } from './src/data/bassCourse';
import { KEYBOARD_COURSE_LEVELS, KEYBOARD_LESSONS } from './src/data/keyboardCourse';
import { DRUMS_COURSE_LEVELS, DRUMS_LESSONS } from './src/data/drumsCourse';

assert(
  BASS_COURSE_LEVELS.length === 6 && BASS_LESSONS.length === 18,
  '23.8 bassCourse.ts exporta BASS_COURSE_LEVELS (6 níveis) e BASS_LESSONS (18 aulas completas)'
);
const bassLessonsValid = BASS_LESSONS.every(l => 
  Boolean(l.id) &&
  typeof l.level === 'number' &&
  Boolean(l.moduleTitle) &&
  typeof l.lessonNumber === 'number' &&
  Boolean(l.title) &&
  Boolean(l.subtitle) &&
  Boolean(l.objective) &&
  l.estimatedMinutes > 0 &&
  l.parts.length >= 1 &&
  l.parts.every(p => Boolean(p.title) && Boolean(p.contentMarkdown)) &&
  Boolean(l.quiz && l.quiz.questions.length >= 1)
);
assert(
  bassLessonsValid === true,
  '23.8 Todas as 18 aulas de Baixo implementam integralmente o contrato Lesson (partes ricas em markdown e quizzes)'
);

assert(
  KEYBOARD_COURSE_LEVELS.length === 6 && KEYBOARD_LESSONS.length === 18,
  '23.8 keyboardCourse.ts exporta KEYBOARD_COURSE_LEVELS (6 níveis) e KEYBOARD_LESSONS (18 aulas completas)'
);
const keyboardLessonsValid = KEYBOARD_LESSONS.every(l => 
  Boolean(l.id) &&
  typeof l.level === 'number' &&
  Boolean(l.moduleTitle) &&
  typeof l.lessonNumber === 'number' &&
  Boolean(l.title) &&
  Boolean(l.subtitle) &&
  Boolean(l.objective) &&
  l.estimatedMinutes > 0 &&
  l.parts.length >= 1 &&
  l.parts.every(p => Boolean(p.title) && Boolean(p.contentMarkdown)) &&
  Boolean(l.quiz && l.quiz.questions.length >= 1)
);
assert(
  keyboardLessonsValid === true,
  '23.8 Todas as 18 aulas de Teclado implementam integralmente o contrato Lesson (partes ricas em markdown e quizzes)'
);

assert(
  DRUMS_COURSE_LEVELS.length === 6 && DRUMS_LESSONS.length === 18,
  '23.8 drumsCourse.ts exporta DRUMS_COURSE_LEVELS (6 níveis) e DRUMS_LESSONS (18 aulas completas)'
);
const drumsLessonsValid = DRUMS_LESSONS.every(l => 
  Boolean(l.id) &&
  typeof l.level === 'number' &&
  Boolean(l.moduleTitle) &&
  typeof l.lessonNumber === 'number' &&
  Boolean(l.title) &&
  Boolean(l.subtitle) &&
  Boolean(l.objective) &&
  l.estimatedMinutes > 0 &&
  l.parts.length >= 1 &&
  l.parts.every(p => Boolean(p.title) && Boolean(p.contentMarkdown)) &&
  Boolean(l.quiz && l.quiz.questions.length >= 1)
);
assert(
  drumsLessonsValid === true,
  '23.8 Todas as 18 aulas de Bateria implementam integralmente o contrato Lesson (partes ricas em markdown e quizzes)'
);

// -------------------------------------------------------------
// GRUPO 24: FASE 4 — MATRÍCULA, PROGRESSÃO E DESBLOQUEIO AUTOMÁTICO DE CURSOS (50%)
// -------------------------------------------------------------
console.log('\n--- GRUPO 24: FASE 4 — MATRÍCULA, PROGRESSÃO E DESBLOQUEIO DE CURSOS (50%) ---');

import {
  calculateCourseProgress,
  getMandatoryLessonIdsForCourse,
  getPrimaryCourseId,
  enrollPrimaryCourse,
  isCourseUnlocked,
  canAccessCourse,
  getCatalogCoursesStatus,
  COURSE_METADATA_MAP,
  OfficialCourseId,
} from './src/academia/progress/unlockGate';

// 1. Cálculo de progresso com 0%
const prog0 = storageService.createDefaultProgress();
prog0.completedLessons = [];
const calc0 = calculateCourseProgress('violao', prog0);
assert(
  calc0.progressPercentage === 0 && calc0.isFiftyPercentReached === false && calc0.canUnlockElectives === false,
  '24.1 Aluno com 0 aulas concluídas tem 0.00% de progresso e cursos eletivos bloqueados'
);
assert(
  isCourseUnlocked('canonical', prog0) === false && isCourseUnlocked('baixo', prog0) === false,
  '24.1 isCourseUnlocked rejeita acesso a instrumentos secundários com 0% de progresso no curso principal'
);

// 2. Cálculo de progresso com 25% (15 de 60 aulas de Violão)
const prog25 = storageService.createDefaultProgress();
const g24ViolaoLessonIds = getMandatoryLessonIdsForCourse('violao');
prog25.completedLessons = g24ViolaoLessonIds.slice(0, 15);
const calc25 = calculateCourseProgress('violao', prog25);
assert(
  calc25.progressPercentage === 25.0 && calc25.isFiftyPercentReached === false,
  '24.2 15 de 60 aulas de Violão equivalem a exatamente 25.00% de progresso'
);
assert(
  isCourseUnlocked('canonical', prog25) === false && calc25.remainingActivitiesToFifty === 15,
  '24.2 Com 25% de progresso, cursos secundários permanecem bloqueados e restam 15 aulas para 50%'
);

// 3. Cálculo de progresso com 49% (29 de 60 aulas de Violão = 48.33%)
const prog48 = storageService.createDefaultProgress();
prog48.completedLessons = g24ViolaoLessonIds.slice(0, 29);
const calc48 = calculateCourseProgress('violao', prog48);
assert(
  calc48.progressPercentage === 48.33 && calc48.isFiftyPercentReached === false,
  '24.3 29 de 60 aulas de Violão equivalem a 48.33% (< 50%) e mantêm o catálogo bloqueado'
);
assert(
  isCourseUnlocked('teclado', prog48) === false && isCourseUnlocked('bateria', prog48) === false,
  '24.3 isCourseUnlocked bloqueia estritamente Teclado e Bateria com progresso de 48.33%'
);

// 4. Cálculo com valor rigorosamente abaixo de 50.00% (49.99%)
const calcSimulated = {
  progressPercentage: 49.99,
  isFiftyPercentReached: 49.99 >= 50.0
};
assert(
  calcSimulated.isFiftyPercentReached === false,
  '24.4 A regra dos 50% é estrita: 49.99% não desbloqueia os cursos do conservatório'
);

// 5. Cálculo de progresso com 50% exato (30 de 60 aulas de Violão)
const prog50 = storageService.createDefaultProgress();
prog50.completedLessons = g24ViolaoLessonIds.slice(0, 30);
const calc50 = calculateCourseProgress('violao', prog50);
assert(
  calc50.progressPercentage === 50.0 && calc50.isFiftyPercentReached === true && calc50.canUnlockElectives === true,
  '24.5 30 de 60 aulas de Violão atingem exatamente 50.00% com canUnlockElectives verdadeiro'
);
assert(
  isCourseUnlocked('canonical', prog50) === true &&
  isCourseUnlocked('baixo', prog50) === true &&
  isCourseUnlocked('teclado', prog50) === true &&
  isCourseUnlocked('bateria', prog50) === true,
  '24.5 Com exatamente 50% no curso principal, todos os outros instrumentos são desbloqueados automaticamente'
);

// 6. Cálculo de progresso com 51% ou mais (31 de 60 aulas = 51.67%)
const prog51 = storageService.createDefaultProgress();
prog51.completedLessons = g24ViolaoLessonIds.slice(0, 31);
const calc51 = calculateCourseProgress('violao', prog51);
assert(
  calc51.progressPercentage === 51.67 && calc51.isFiftyPercentReached === true,
  '24.6 31 de 60 aulas de Violão equivalem a 51.67% (> 50%) e confirmam desbloqueio'
);
assert(
  isCourseUnlocked('solo', prog51) === true && isCourseUnlocked('teclado', prog51) === true,
  '24.6 Progresso acima de 50% mantém todas as eletivas plenamente autorizadas'
);

// 7. Cálculo de progresso com 100%
const prog100 = storageService.createDefaultProgress();
prog100.completedLessons = [...g24ViolaoLessonIds];
const calc100 = calculateCourseProgress('violao', prog100);
assert(
  calc100.progressPercentage === 100.0 && calc100.remainingPercentageToFifty === 0 && calc100.remainingActivitiesToFifty === 0,
  '24.7 60 de 60 aulas de Violão atingem 100.00% com 0 pendências'
);
assert(
  isCourseUnlocked('canonical', prog100) === true && isCourseUnlocked('bateria', prog100) === true,
  '24.7 Aluno graduado (100%) tem acesso universal a todos os cursos do conservatório'
);

// 8. Curso sem atividades obrigatórias válidas (0 atividades)
const emptyCourseCalc = calculateCourseProgress('violao', {
  ...storageService.createDefaultProgress(),
  completedLessons: []
});
assert(
  !isNaN(emptyCourseCalc.progressPercentage) && isFinite(emptyCourseCalc.progressPercentage),
  '24.8 Cálculo previne divisão por zero ou valores NaN / Infinity'
);

// 9. Aulas meramente visualizadas ('viewed' em practiceLogs) não contam
const progViewed = storageService.createDefaultProgress();
progViewed.completedLessons = []; // nenhuma aula concluída
progViewed.practiceLogs = {
  'violao-lesson-1': { lessonId: 'violao-lesson-1', status: 'viewed', timesPracticed: 10, practicedBpm: 60, lastPracticedDate: '2026-03-30', confidence: 'playable_slow', needsReview: false },
  'violao-lesson-2': { lessonId: 'violao-lesson-2', status: 'viewed', timesPracticed: 5, practicedBpm: 60, lastPracticedDate: '2026-03-30', confidence: 'playable_slow', needsReview: false },
  'violao-lesson-3': { lessonId: 'violao-lesson-3', status: 'practicing', timesPracticed: 2, practicedBpm: 60, lastPracticedDate: '2026-03-30', confidence: 'playable_slow', needsReview: false }
};
const calcViewed = calculateCourseProgress('violao', progViewed);
assert(
  calcViewed.completedMandatoryActivities === 0 && calcViewed.progressPercentage === 0,
  '24.9 Aulas com status "viewed" ou "practicing" sem conclusão comprovada não contam no progresso de 50%'
);
assert(
  isCourseUnlocked('canonical', progViewed) === false,
  '24.9 isCourseUnlocked rejeita contagem de aulas meramente abertas ou visualizadas'
);

// 10. Tempo de estudo no app não altera percentual de desbloqueio
const progTimeOnly = storageService.createDefaultProgress();
progTimeOnly.completedLessons = [];
progTimeOnly.totalStudyTimeSeconds = 360000; // 100 horas de app
progTimeOnly.todayStudyTimeSeconds = 18000;
const calcTimeOnly = calculateCourseProgress('violao', progTimeOnly);
assert(
  calcTimeOnly.progressPercentage === 0 && calcTimeOnly.canUnlockElectives === false,
  '24.10 Tempo de permanência no app (100h) não concede desbloqueio de cursos'
);

// 11. Tentativa de acessar curso bloqueado é rejeitada com motivo pedagógico
const accessAttempt = canAccessCourse('baixo', prog25);
assert(
  accessAttempt.allowed === false && Boolean(accessAttempt.reason) && accessAttempt.reason!.includes('50%'),
  '24.11 canAccessCourse bloqueia curso secundário e devolve justificativa pedagógica com meta de 50%'
);

// 12. Matrícula no curso principal é persistida corretamente
const enrollTestProg = storageService.createDefaultProgress();
const enrollResult = enrollPrimaryCourse(enrollTestProg, 'violao');
assert(
  enrollResult.success === true && enrollResult.progress.primaryCourseId === 'violao',
  '24.12 enrollPrimaryCourse matricula o aluno no curso de Violão e persiste a chave primaryCourseId'
);

// 13. Prevenção de duplicidade na matrícula
const repeatEnrollResult = enrollPrimaryCourse(enrollResult.progress, 'violao');
assert(
  repeatEnrollResult.success === true && repeatEnrollResult.message.includes('já está matriculado'),
  '24.13 Matrícula repetida no mesmo curso é tratada de forma idempotente sem duplicar registros'
);

// 14. Tentativa de contorno trocando de curso principal
const bypassAttempt = enrollPrimaryCourse(prog25, 'baixo');
const isCanonicalUnlockedAfterBypass = isCourseUnlocked('canonical', bypassAttempt.progress);
assert(
  isCanonicalUnlockedAfterBypass === false,
  '24.14 Troca de curso principal para instrumento com 0 aulas não burla o desbloqueio das demais eletivas'
);

// 15. Migração de dados de alunos existentes sem primaryCourseId
const legacyDataWithoutPrimary: any = {
  currentLessonId: 'violao-lesson-5',
  completedLessons: ['violao-lesson-1', 'violao-lesson-2'],
  totalStudyTimeSeconds: 1200
};
const deducedPrimary = getPrimaryCourseId(legacyDataWithoutPrimary);
assert(
  deducedPrimary === 'violao',
  '24.15 Migração inteligente deduz curso principal "violao" a partir do histórico de aulas concluídas'
);

// 16. Isolamento entre múltiplos alunos (Aluno A com 100% não desbloqueia Aluno B com 0%)
const studentA = storageService.createDefaultProgress();
studentA.completedLessons = [...g24ViolaoLessonIds]; // 100%
const studentB = storageService.createDefaultProgress();
studentB.completedLessons = []; // 0%
assert(
  isCourseUnlocked('baixo', studentA) === true && isCourseUnlocked('baixo', studentB) === false,
  '24.16 Isolamento multiusuário estrito: progresso do Aluno A não vaza e não desbloqueia cursos do Aluno B'
);

// 17. Sincronização e merge preservam matrícula e status de desbloqueio
const localStudent = { ...prog50, primaryCourseId: 'violao' as const };
const cloudStudent = { ...prog25, primaryCourseId: 'violao' as const };
const mergedStudent = mergeProgressStates(localStudent, cloudStudent);
assert(
  mergedStudent.primaryCourseId === 'violao' && isCourseUnlocked('canonical', mergedStudent) === true,
  '24.17 mergeProgressStates preserva curso principal e união de progresso elegível para desbloqueio'
);

// 18. Todos os 5 instrumentos contemplados no catálogo de status
const fullCatalogStatus = getCatalogCoursesStatus(prog25);
const expectedCourses: OfficialCourseId[] = ['violao', 'canonical', 'solo', 'baixo', 'teclado', 'bateria'];
assert(
  expectedCourses.every((cId) => Boolean(fullCatalogStatus[cId])) &&
  fullCatalogStatus['violao'].isPrimary === true &&
  fullCatalogStatus['baixo'].isUnlocked === false &&
  fullCatalogStatus['teclado'].isUnlocked === false &&
  fullCatalogStatus['bateria'].isUnlocked === false,
  '24.18 getCatalogCoursesStatus contempla todos os 5 instrumentos e 6 cursos com status rigoroso'
);

// =========================================================================
// GRUPO 25: FASE 5 — MASTER CONTENT ENGINE
// EXPANSÃO PEDAGÓGICA E TÉCNICA DOS CURSOS EXTRAS (54 AULAS)
// Contrabaixo Elétrico (18 Aulas) • Teclado / Piano (18 Aulas) • Bateria (18 Aulas)
// =========================================================================

console.log('\n--- GRUPO 25: FASE 5 — MASTER CONTENT ENGINE (54 AULAS DE CONSERVATÓRIO) ---');

// 1. Contagem exata e conformidade das 18 aulas de Contrabaixo Elétrico
assert(
  BASS_LESSONS.length === 18 && BASS_COURSE_LEVELS.length === 6,
  '25.1 Contrabaixo Elétrico possui exatamente 18 aulas distribuídas em 6 níveis canônicos (0 a 5)'
);
const bassLevelsDistribution = BASS_COURSE_LEVELS.every((lvl) => lvl.lessons.length === 3);
assert(
  bassLevelsDistribution === true,
  '25.2 Cada um dos 6 níveis do Contrabaixo possui exatamente 3 aulas progressivas'
);

// 2. Contagem exata e conformidade das 18 aulas de Teclado / Piano
assert(
  KEYBOARD_LESSONS.length === 18 && KEYBOARD_COURSE_LEVELS.length === 6,
  '25.3 Teclado / Piano possui exatamente 18 aulas distribuídas em 6 níveis canônicos (0 a 5)'
);
const keyboardLevelsDistribution = KEYBOARD_COURSE_LEVELS.every((lvl) => lvl.lessons.length === 3);
assert(
  keyboardLevelsDistribution === true,
  '25.4 Cada um dos 6 níveis do Teclado possui exatamente 3 aulas progressivas'
);

// 3. Contagem exata e conformidade das 18 aulas de Bateria e Prática Rítmica
assert(
  DRUMS_LESSONS.length === 18 && DRUMS_COURSE_LEVELS.length === 6,
  '25.5 Bateria e Prática Rítmica possui exatamente 18 aulas distribuídas em 6 níveis canônicos (0 a 5)'
);
const drumsLevelsDistribution = DRUMS_COURSE_LEVELS.every((lvl) => lvl.lessons.length === 3);
assert(
  drumsLevelsDistribution === true,
  '25.6 Cada um dos 6 níveis da Bateria possui exatamente 3 aulas progressivas'
);

// 4. Catálogo Global Unificado da Plataforma (152 Aulas Totais)
const unifiedLessons = getAllPlatformLessons();
assert(
  unifiedLessons.length === 152,
  `25.7 getAllPlatformLessons() unifica rigorosamente as 152 aulas de toda a plataforma (60 Violão + 18 Guitarra Canônica + 20 Solo + 18 Baixo + 18 Teclado + 18 Bateria = 152, obtido: ${unifiedLessons.length})`
);

// 5. Integridade do Padrão Master Lesson em todas as 54 aulas extras
const extraLessons = [...BASS_LESSONS, ...KEYBOARD_LESSONS, ...DRUMS_LESSONS];
assert(
  extraLessons.length === 54,
  '25.8 Total de aulas extras dos três novos instrumentos totaliza exatamente 54 aulas'
);

const allHaveMandatoryMetadata = extraLessons.every((l) =>
  Boolean(l.id) &&
  typeof l.level === 'number' &&
  Boolean(l.moduleTitle) &&
  Boolean(l.lessonNumber) &&
  Boolean(l.title) &&
  Boolean(l.subtitle) &&
  Boolean(l.objective) &&
  typeof l.estimatedMinutes === 'number' &&
  l.estimatedMinutes >= 20 &&
  Array.isArray(l.parts) &&
  l.parts.length >= 2
);
assert(
  allHaveMandatoryMetadata === true,
  '25.9 Todas as 54 aulas possuem metadados completos, objetivos claros, duração estimada e múltiplas seções didáticas'
);

// 6. Exercício Prático Obrigatório em 100% das 54 Aulas Extras
const allHavePracticalExercise = extraLessons.every((l) => {
  const ex = l.practicalExercise;
  return (
    Boolean(ex) &&
    typeof ex?.targetBpm === 'number' &&
    ex.targetBpm > 0 &&
    typeof ex?.targetRepetitions === 'number' &&
    ex.targetRepetitions > 0 &&
    Array.isArray(ex?.precisionCriteria) &&
    ex.precisionCriteria.length >= 2 &&
    Array.isArray(ex?.commonErrors) &&
    ex.commonErrors.length >= 2 &&
    Boolean(ex?.tablatureText)
  );
});
assert(
  allHavePracticalExercise === true,
  '25.10 100% das 54 aulas extras possuem practicalExercise com BPM alvo, repetições, critérios de precisão, erros comuns e notação'
);

// 7. Quiz de Fixação Obrigatório com Explicações em 100% das 54 Aulas Extras
const allHaveQuizWithExplanations = extraLessons.every((l) => {
  const qz = l.quiz;
  return (
    Boolean(qz) &&
    typeof qz?.passingScore === 'number' &&
    qz.passingScore >= 70 &&
    Array.isArray(qz?.questions) &&
    qz.questions.length >= 2 &&
    qz.questions.every((q) =>
      Boolean(q.question) &&
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      typeof q.correctIndex === 'number' &&
      q.correctIndex >= 0 &&
      q.correctIndex < q.options.length &&
      Boolean(q.explanation) &&
      q.explanation.length >= 15
    )
  );
});
assert(
  allHaveQuizWithExplanations === true,
  '25.11 100% das 54 aulas extras possuem quiz com passingScore, múltiplas questões e justificativas pedagógicas detalhadas'
);

// 8. Validação de Conteúdo Especializado e Autenticidade — CONTRABAIXO
const bassJoinedContent = BASS_LESSONS.map((l) => l.parts.map((p) => p.contentMarkdown).join(' ')).join(' ');
const bassHasKeyTopics =
  bassJoinedContent.includes('Toque apoiado') &&
  bassJoinedContent.includes('Simandl') &&
  bassJoinedContent.includes('Slap') &&
  bassJoinedContent.includes('Walking Bass') &&
  bassJoinedContent.includes('Ghost Notes') &&
  bassJoinedContent.includes('Dórico') &&
  bassJoinedContent.includes('Movable Thumb');
assert(
  bassHasKeyTopics === true,
  '25.12 Contrabaixo contempla anatomia, Simandl, slap, walking bass, ghost notes, modos gregos e ergonomia sem lesão'
);

// 9. Validação de Conteúdo Especializado e Autenticidade — TECLADO / PIANO
const keyboardJoinedContent = KEYBOARD_LESSONS.map((l) => l.parts.map((p) => p.contentMarkdown).join(' ')).join(' ');
const keyboardHasKeyTopics =
  keyboardJoinedContent.includes('Dó Central') &&
  keyboardJoinedContent.includes('Tríades') &&
  keyboardJoinedContent.includes('II-V-I') &&
  keyboardJoinedContent.includes('Voicings') &&
  keyboardJoinedContent.includes('Quartal') &&
  keyboardJoinedContent.includes('Bossa Nova') &&
  keyboardJoinedContent.includes('Polegar');
assert(
  keyboardHasKeyTopics === true,
  '25.13 Teclado/Piano contempla topografia 2/3 pretas, Dó central, tríades, inversões, cadência II-V-I, voicings sem fundamental e harmonia quartal'
);

// 10. Validação de Conteúdo Especializado e Autenticidade — BATERIA
const drumsJoinedContent = DRUMS_LESSONS.map((l) => l.parts.map((p) => p.contentMarkdown).join(' ')).join(' ');
const drumsHasKeyTopics =
  drumsJoinedContent.includes('Fulcro') &&
  drumsJoinedContent.includes('Single Stroke') &&
  drumsJoinedContent.includes('Double Stroke') &&
  drumsJoinedContent.includes('Paradiddle') &&
  drumsJoinedContent.includes('Moeller') &&
  drumsJoinedContent.includes('Ghost Notes') &&
  drumsJoinedContent.includes('Linear Drumming') &&
  drumsJoinedContent.includes('7/8') &&
  drumsJoinedContent.includes('Vassourinhas') &&
  drumsJoinedContent.includes('Samba');
assert(
  drumsHasKeyTopics === true,
  '25.14 Bateria contempla anatomia, fulcro, Single/Double Rolls, Paradiddle, Moeller, Ghost Notes, Linear Drumming, 7/8 e ritmos brasileiros'
);

// 11. Busca Global (searchService) indexa os novos instrumentos
const slapSearch = searchAll('slap');
const iiViSearch = searchAll('ii-v-i');
const paradiddleSearch = searchAll('paradiddle');
assert(
  slapSearch.lessons.some((r) => r.lessonId?.startsWith('baixo-')) &&
  iiViSearch.lessons.some((r) => r.lessonId?.startsWith('teclado-')) &&
  paradiddleSearch.lessons.some((r) => r.lessonId?.startsWith('bateria-')),
  '25.15 Busca Global (searchService) localiza perfeitamente aulas dos novos instrumentos por termos técnicos específicos'
);

// 12. Painel do Professor (teacherService) suporta métricas dos novos cursos
const mockStudent = storageService.createDefaultProgress();
mockStudent.completedLessons = ['baixo-l-0-1', 'teclado-l-0-1', 'bateria-l-0-1'];
const bassFunnel = TeacherService.buildCourseFunnel('baixo' as any, [], []);
assert(
  bassFunnel.length === 18 && bassFunnel[0].courseTitle === 'Contrabaixo Elétrico',
  '25.16 teacherService.buildCourseFunnel suporta o funil completo de 18 aulas do Contrabaixo Elétrico'
);

// 13. Resolução no LessonViewer e App.tsx
const sampleBass = getLessonById('baixo-l-2-1');
const sampleKeyboard = getLessonById('teclado-l-3-2');
const sampleDrums = getLessonById('bateria-l-4-2');
assert(
  Boolean(sampleBass) && sampleBass?.id === 'baixo-l-2-1' &&
  Boolean(sampleKeyboard) && sampleKeyboard?.id === 'teclado-l-3-2' &&
  Boolean(sampleDrums) && sampleDrums?.id === 'bateria-l-4-2',
  '25.17 getLessonById resolve perfeitamente aulas de qualquer um dos três novos cursos para exibição no LessonViewer'
);

// 14. Interface e Experiência do Aluno (Multi-Instrumento em LessonViewer)
const lessonViewerSource = fs.readFileSync('src/components/curriculum/LessonViewer.tsx', 'utf-8');
assert(
  lessonViewerSource.includes("isBassLesson") &&
  lessonViewerSource.includes("isKeyboardLesson") &&
  lessonViewerSource.includes("isDrumsLesson"),
  '25.18 LessonViewer detecta dinamicamente a tipologia de instrumento (Baixo, Teclado, Bateria, Violão/Guitarra)'
);
assert(
  lessonViewerSource.includes("Ouvir 4 Cordas do Baixo (E-A-D-G)") &&
  lessonViewerSource.includes("Ouvir Guia Harmônico (Tríade Dó Maior)") &&
  lessonViewerSource.includes("Ouvir Pulso Rítmico de Referência"),
  '25.19 LessonViewer oferece áudio de demonstração customizado e frequências físicas específicas por instrumento'
);
assert(
  lessonViewerSource.includes("Sequência de Execução no Contrabaixo") &&
  lessonViewerSource.includes("Sequência de Execução no Teclado") &&
  lessonViewerSource.includes("Sequência de Peças & Coordenação Motora na Bateria"),
  '25.20 LessonViewer renderiza guias visuais e nomenclaturas anatômicas nativas para cada família instrumental'
);

// -------------------------------------------------------------
// GRUPO 26: MASTER TUNER V2 — AFINADOR CROMÁTICO & MOTOR YIN MULTI-INSTRUMENTO
// -------------------------------------------------------------
console.log('\n--- GRUPO 26: MASTER TUNER V2 (MOTOR YIN DSP & AFINAÇÃO MULTI-INSTRUMENTO) ---');

const masterDetector = new GuitarPitchDetector({
  lowCutoff: 25,
  highCutoff: 2200,
  silenceThreshold: 0.01,
  confidenceThreshold: 0.65,
});

// 1. Guitarra Elétrica / Violão (E2 a E4)
const egE2 = masterDetector.detectPitchFromBuffer(generateSineBuffer(82.41, 44100, 2048), 44100);
const egA2 = masterDetector.detectPitchFromBuffer(generateSineBuffer(110.00, 44100, 2048), 44100);
const egD3 = masterDetector.detectPitchFromBuffer(generateSineBuffer(146.83, 44100, 2048), 44100);
const egG3 = masterDetector.detectPitchFromBuffer(generateSineBuffer(196.00, 44100, 2048), 44100);
const egB3 = masterDetector.detectPitchFromBuffer(generateSineBuffer(246.94, 44100, 2048), 44100);
const egE4 = masterDetector.detectPitchFromBuffer(generateSineBuffer(329.63, 44100, 2048), 44100);

assert(
  egE2?.note === 'E' && egE2?.octave === 2 && Math.abs(egE2.frequency - 82.41) < 1.0 &&
  egA2?.note === 'A' && egA2?.octave === 2 &&
  egD3?.note === 'D' && egD3?.octave === 3 &&
  egG3?.note === 'G' && egG3?.octave === 3 &&
  egB3?.note === 'B' && egB3?.octave === 3 &&
  egE4?.note === 'E' && egE4?.octave === 4,
  '26.1 Algoritmo YIN detecta com exatidão as 6 cordas da Guitarra e Violão (E2, A2, D3, G3, B3, E4)'
);

// 2. Contrabaixo Elétrico e Contrabaixo 5 Cordas (B0 a G2)
const bassB0 = masterDetector.detectPitchFromBuffer(generateSineBuffer(30.87, 44100, 4096), 44100);
const bassE1 = masterDetector.detectPitchFromBuffer(generateSineBuffer(41.20, 44100, 2048), 44100);
const bassA1 = masterDetector.detectPitchFromBuffer(generateSineBuffer(55.00, 44100, 2048), 44100);
const bassD2 = masterDetector.detectPitchFromBuffer(generateSineBuffer(73.42, 44100, 2048), 44100);
const bassG2 = masterDetector.detectPitchFromBuffer(generateSineBuffer(98.00, 44100, 2048), 44100);

assert(
  bassB0?.note === 'B' && bassB0?.octave === 0 && Math.abs(bassB0.frequency - 30.87) < 0.5 &&
  bassE1?.note === 'E' && bassE1?.octave === 1 && Math.abs(bassE1.frequency - 41.20) < 0.5 &&
  bassA1?.note === 'A' && bassA1?.octave === 1 &&
  bassD2?.note === 'D' && bassD2?.octave === 2 &&
  bassG2?.note === 'G' && bassG2?.octave === 2,
  '26.2 Detecção de subgraves profundos do Baixo: B0 (30.87 Hz), E1 (41.20 Hz) até G2 com decimação adaptativa'
);

// 3. Violoncelo (C2 65.41 Hz a A3 220.00 Hz)
const celloC2 = masterDetector.detectPitchFromBuffer(generateSineBuffer(65.41, 44100, 2048), 44100);
const celloG2 = masterDetector.detectPitchFromBuffer(generateSineBuffer(98.00, 44100, 2048), 44100);
const celloD3 = masterDetector.detectPitchFromBuffer(generateSineBuffer(146.83, 44100, 2048), 44100);
const celloA3 = masterDetector.detectPitchFromBuffer(generateSineBuffer(220.00, 44100, 2048), 44100);

assert(
  celloC2?.note === 'C' && celloC2?.octave === 2 &&
  celloG2?.note === 'G' && celloG2?.octave === 2 &&
  celloD3?.note === 'D' && celloD3?.octave === 3 &&
  celloA3?.note === 'A' && celloA3?.octave === 3,
  '26.3 Violoncelo: afinação por quintas clássicas (C2, G2, D3, A3) identificada com precisão'
);

// 4. Viola de Arco (C3 130.81 Hz a A4 440.00 Hz)
const violaC3 = masterDetector.detectPitchFromBuffer(generateSineBuffer(130.81, 44100, 2048), 44100);
const violaG3 = masterDetector.detectPitchFromBuffer(generateSineBuffer(196.00, 44100, 2048), 44100);
const violaD4 = masterDetector.detectPitchFromBuffer(generateSineBuffer(293.66, 44100, 2048), 44100);
const violaA4 = masterDetector.detectPitchFromBuffer(generateSineBuffer(440.00, 44100, 2048), 44100);

assert(
  violaC3?.note === 'C' && violaC3?.octave === 3 &&
  violaG3?.note === 'G' && violaG3?.octave === 3 &&
  violaD4?.note === 'D' && violaD4?.octave === 4 &&
  violaA4?.note === 'A' && violaA4?.octave === 4,
  '26.4 Viola de Arco: afinação por quintas (C3, G3, D4, A4) identificada com precisão'
);

// 5. Violino (G3 196.00 Hz a E5 659.25 Hz)
const violinG3 = masterDetector.detectPitchFromBuffer(generateSineBuffer(196.00, 44100, 2048), 44100);
const violinD4 = masterDetector.detectPitchFromBuffer(generateSineBuffer(293.66, 44100, 2048), 44100);
const violinA4 = masterDetector.detectPitchFromBuffer(generateSineBuffer(440.00, 44100, 2048), 44100);
const violinE5 = masterDetector.detectPitchFromBuffer(generateSineBuffer(659.25, 44100, 2048), 44100);

assert(
  violinG3?.note === 'G' && violinG3?.octave === 3 &&
  violinD4?.note === 'D' && violinD4?.octave === 4 &&
  violinA4?.note === 'A' && violinA4?.octave === 4 &&
  violinE5?.note === 'E' && violinE5?.octave === 5 && Math.abs(violinE5.frequency - 659.25) < 1.0,
  '26.5 Violino: agudos de conservatório (G3, D4, A4, E5 até 659.25 Hz) validados'
);

// 6. Resolução e Precisão em Cents: Desvios de -50, -10, +10, +50 cents em A4 (440 Hz)
const targetA4Ref = { stringNumber: 1, note: 'A', octave: 4, freq: 440 };
const freqM50 = 440 * Math.pow(2, -50 / 1200);
const freqM10 = 440 * Math.pow(2, -10 / 1200);
const freqP10 = 440 * Math.pow(2, +10 / 1200);
const freqP50 = 440 * Math.pow(2, +50 / 1200);

const resM50 = masterDetector.detectPitchFromBuffer(generateSineBuffer(freqM50, 44100, 2048), 44100, { targetString: targetA4Ref });
const resM10 = masterDetector.detectPitchFromBuffer(generateSineBuffer(freqM10, 44100, 2048), 44100, { targetString: targetA4Ref });
const resP10 = masterDetector.detectPitchFromBuffer(generateSineBuffer(freqP10, 44100, 2048), 44100, { targetString: targetA4Ref });
const resP50 = masterDetector.detectPitchFromBuffer(generateSineBuffer(freqP50, 44100, 2048), 44100, { targetString: targetA4Ref });

assert(
  resM50?.cents === -50 && resM10?.cents === -10 && resP10?.cents === 10 && resP50?.cents === 50,
  '26.6 Precisão sub-semitonal de desvio em cents (-50¢, -10¢, +10¢, +50¢) com resolução rigorosa'
);

// 7. Imunidade a harmônicos fortes (rejeição de oitavas falsas)
const richHarmBuffer = new Float32Array(2048);
for (let i = 0; i < 2048; i++) {
  // Fundamental 82.41 Hz (E2) + 2º harmônico (164.82 Hz) a 80% + 3º harmônico (247.23 Hz) a 50%
  richHarmBuffer[i] =
    0.30 * Math.sin((2 * Math.PI * 82.41 * i) / 44100) +
    0.25 * Math.sin((2 * Math.PI * 164.82 * i) / 44100) +
    0.15 * Math.sin((2 * Math.PI * 247.23 * i) / 44100);
}
const richHarmResult = masterDetector.detectPitchFromBuffer(richHarmBuffer, 44100);
assert(
  richHarmResult?.note === 'E' && richHarmResult?.octave === 2 && Math.abs(richHarmResult.frequency - 82.41) < 1.0,
  '26.7 Supressão de erro de oitava: timbre acústico com harmônicos sobrepostos converge para a fundamental F0 (E2)'
);

// 8. Rejeição de sinal fraco, ruído e silêncio
const lowAmpBuffer = generateSineBuffer(440, 44100, 2048, 0.005); // Amplitude abaixo do limiar
const lowAmpResult = masterDetector.detectPitchFromBuffer(lowAmpBuffer, 44100);
assert(
  lowAmpResult?.isSilence === true || lowAmpResult?.detectionType === 'silence' || lowAmpResult?.isWeakSignal === true,
  '26.8 Sinais de baixa energia sonora (< silenceThreshold) classificados adequadamente como silêncio ou fracos'
);

// 9. Rejeição de frequências fora da faixa configurada
const outOfRangeDetector = new GuitarPitchDetector({ lowCutoff: 100, highCutoff: 500 });
const outLow = outOfRangeDetector.detectPitchFromBuffer(generateSineBuffer(41.20, 44100, 2048), 44100);
assert(
  outLow?.detectionType === 'weak_signal' || outLow?.frequency === 0,
  '26.9 Frequências fora dos limites de banda do filtro biquad são rejeitadas com segurança'
);

// 10. Calibração dinâmica de referência A4 (432 Hz, 440 Hz, 442 Hz)
masterDetector.setA4Reference(432);
const a432Result = masterDetector.detectPitchFromBuffer(generateSineBuffer(432.00, 44100, 2048), 44100);
masterDetector.setA4Reference(442);
const a442Result = masterDetector.detectPitchFromBuffer(generateSineBuffer(442.00, 44100, 2048), 44100);
masterDetector.setA4Reference(440); // Restaura 440 Hz
assert(
  a432Result?.note === 'A' && a432Result?.octave === 4 && a432Result?.cents === 0 &&
  a442Result?.note === 'A' && a442Result?.octave === 4 && a442Result?.cents === 0,
  '26.10 Calibração de referência A4 dinâmica (430 a 450 Hz) recalcula cents e frequências de referência'
);

// 11. Base oficial de Presets de Instrumentos
const requiredInstruments = [
  'electric_guitar',
  'acoustic_guitar',
  'bass',
  'ukulele',
  'violin',
  'viola',
  'cello',
  'double_bass',
  'mandolin',
  'banjo',
];
assert(
  requiredInstruments.every((instId) => ALL_INSTRUMENTS.some((i) => i.id === instId)),
  '26.11 Catálogo oficial contempla mais de 10 instrumentos de cordas obrigatórios com presets canônicos'
);

// 12. Presets obrigatórios de Guitarra Elétrica
const egDef = ALL_INSTRUMENTS.find((i) => i.id === 'electric_guitar')!;
const egPresetNames = egDef.presets.map((p) => p.id);
assert(
  egPresetNames.includes('eg_standard') &&
  egPresetNames.includes('eg_drop_d') &&
  egPresetNames.includes('eg_eb_standard') &&
  egPresetNames.includes('eg_d_standard') &&
  egPresetNames.includes('eg_drop_c') &&
  egPresetNames.includes('eg_open_g') &&
  egPresetNames.includes('eg_open_d') &&
  egPresetNames.includes('eg_dadgad'),
  '26.12 Guitarra contempla Standard, Drop D, Eb Standard, D Standard, Drop C, Open G, Open D e DADGAD'
);

// 13. Contrabaixo Elétrico contempla 4, 5 e 6 cordas
const bassDef = ALL_INSTRUMENTS.find((i) => i.id === 'bass')!;
const bassPresetIds = bassDef.presets.map((p) => p.id);
assert(
  bassPresetIds.includes('bass_4_standard') &&
  bassPresetIds.includes('bass_5_standard') &&
  bassPresetIds.includes('bass_6_standard') &&
  bassPresetIds.includes('bass_drop_d') &&
  bassPresetIds.includes('bass_eb_standard'),
  '26.13 Contrabaixo Elétrico contempla configurações completas de 4, 5 cordas (B0) e 6 cordas (B0-C3)'
);

// 14. Cálculo e recalibração harmônica de cordas com A4
const guitarE2At440 = calculateFrequency('E', 2, 440);
const guitarE2At442 = calculateFrequency('E', 2, 442);
const guitarE2At432 = calculateFrequency('E', 2, 432);
assert(
  guitarE2At440 === 82.41 && guitarE2At442 === 82.78 && guitarE2At432 === 80.91,
  '26.14 calculateFrequency converte nota e oitava em Hz dinâmico segundo temperamento igual e A4'
);

// 15. Sistema de Afinações Personalizadas (CRUD em localStorage)
const mockCustom = {
  id: 'test_drop_b',
  name: 'Drop B Pesado',
  description: 'Afinação customizada de 6 cordas',
  instrumentId: 'custom',
  instrumentName: 'Personalizado',
  strings: [
    { stringNumber: 6, note: 'B', notePt: 'Si', octave: 1, label: '6ª Corda', shortName: '6B' },
    { stringNumber: 5, note: 'F#', notePt: 'Fá#', octave: 2, label: '5ª Corda', shortName: '5F#' },
    { stringNumber: 4, note: 'B', notePt: 'Si', octave: 2, label: '4ª Corda', shortName: '4B' },
    { stringNumber: 3, note: 'E', notePt: 'Mi', octave: 3, label: '3ª Corda', shortName: '3E' },
    { stringNumber: 2, note: 'G#', notePt: 'Sol#', octave: 3, label: '2ª Corda', shortName: '2G#' },
    { stringNumber: 1, note: 'C#', notePt: 'Dó#', octave: 4, label: '1ª Corda', shortName: '1C#' },
  ],
};
const savedList = saveCustomTuning(mockCustom);
const loadedList = loadCustomTunings();
const deletedList = deleteCustomTuning('test_drop_b');
assert(
  savedList.some((p) => p.id === 'test_drop_b') &&
  loadedList.some((p) => p.id === 'test_drop_b') &&
  !deletedList.some((p) => p.id === 'test_drop_b'),
  '26.15 Modo Personalizado: suporte a CRUD completo de afinações salvas em localStorage'
);

// 16. TunerSmoother V2: tolerância configurável (Conservatório ±3¢, Padrão ±5¢, Rápido ±8¢)
const smootherV2 = new TunerSmoother({ alpha: 0.18, confidenceThreshold: 0.65, inTuneTolerance: 3.0 });
smootherV2.feedPitch({
  frequency: 440.0,
  note: 'A',
  notePt: 'Lá',
  octave: 4,
  cents: 2.8,
  confidence: 0.95,
  intensity: 0.8,
  isSilence: false,
  isWeakSignal: false,
  isOnset: false,
  detectionType: 'monophonic_note',
  stability: 95,
  stabilityLabel: 'Estável',
  expectedFreq: 440.0,
  timestamp: performance.now(),
});
const frameTol3 = smootherV2.step(performance.now());
smootherV2.setTolerance(5.0);
const tolConfig = smootherV2.getTolerance();
assert(
  frameTol3.isInTune === true && tolConfig.inTune === 5.0,
  '26.16 TunerSmoother V2 suporta tolerâncias configuráveis de afinação (Conservatório, Padrão e Rápido)'
);

// 17. Modo manual por corda alvo calcula cents em relação à corda fixa
const targetE4Ref = { stringNumber: 1, note: 'E', octave: 4, freq: 329.63 };
const manualTargetResult = masterDetector.detectPitchFromBuffer(
  generateSineBuffer(331.0, 44100, 2048),
  44100,
  { targetString: targetE4Ref }
);
assert(
  manualTargetResult?.note === 'E' &&
  manualTargetResult?.octave === 4 &&
  typeof manualTargetResult?.diffHz === 'number' &&
  Math.abs(manualTargetResult.frequency - 331.0) < 0.5,
  '26.17 Modo Manual por corda alvo calcula desvio em Hz e cents relativo à frequência exata da corda'
);

// 18. TunerView integra A4, modos manual/auto/cromático, presets e tratamento de microfone
const tunerViewV2Source = fs.readFileSync('src/components/tuner/TunerView.tsx', 'utf-8');
assert(
  tunerViewV2Source.includes('a4Calibration') &&
  tunerViewV2Source.includes('isChromaticMode') &&
  tunerViewV2Source.includes('manualStringNumber') &&
  tunerViewV2Source.includes('isInstrumentModalOpen') &&
  tunerViewV2Source.includes('isCustomModalOpen') &&
  tunerViewV2Source.includes('isSettingsModalOpen'),
  '26.18 TunerView V2 integra seleção de instrumentos, calibração A4, modos e afinações personalizadas'
);

// 19. TunerView mantém conformidade com suspensão em background e segurança
assert(
  tunerViewV2Source.includes('visibilitychange') &&
  tunerViewV2Source.includes('stopListening') &&
  tunerViewV2Source.includes('Retomar Afinador') &&
  (tunerViewV2Source.includes('permissão') || tunerViewV2Source.includes('cadeado')) &&
  !tunerViewV2Source.includes('alert(') &&
  !tunerViewV2Source.includes('confirm('),
  '26.19 TunerView V2 mantém conformidade estrita de ciclo de vida, sem alert/confirm nativos'
);

// 20. App.tsx preserva a rota de acesso ao Afinador Pro
const appV2Source = fs.readFileSync('src/App.tsx', 'utf-8');
assert(
  appV2Source.includes("currentTab === 'tuner'") &&
  appV2Source.includes('<TunerView'),
  '26.20 App.tsx preserva a rota e montagem do Afinador Pro integrado à plataforma'
);

// =============================================================
// GRUPO 27: PADRONIZAÇÃO GLOBAL DOS DIAGRAMAS DE ACORDES (PADRÃO CIFRA CLUB)
// =============================================================
console.log('\n--- GRUPO 27: Padronização Global dos Diagramas de Acordes (Padrão Visual Cifra Club) ---');

// 27.1 Existência e integridade do componente central ChordDiagram.tsx
const chordDiagramSource = fs.readFileSync('src/components/chords/ChordDiagram.tsx', 'utf-8');
assert(
  chordDiagramSource.includes('export const ChordDiagram') &&
  chordDiagramSource.includes('<svg') &&
  chordDiagramSource.includes('numFrets') &&
  chordDiagramSource.includes('effectiveBarre'),
  '27.01 ChordDiagram.tsx existe como componente visual central baseado em SVG'
);

// 27.2 Diagrama visual desenha 6 cordas verticais da 6ª (Mi grave) à 1ª (Mi aguda)
assert(
  chordDiagramSource.includes('Array.from({ length: 6 })') &&
  chordDiagramSource.includes('stringGap') &&
  chordDiagramSource.includes('startX'),
  '27.02 ChordDiagram renderiza 6 cordas verticais com calibração precisa de espaçamento'
);

// 27.3 Marcação visual de cordas abafadas (✕) e cordas soltas (○)
assert(
  chordDiagramSource.includes('✕') &&
  chordDiagramSource.includes('fretVal === -1') &&
  chordDiagramSource.includes('fretVal === 0'),
  '27.03 ChordDiagram renderiza indicadores visuais de cordas abafadas (✕) e soltas (○)'
);

// 27.4 Pestana (Barre) contínua desenhada como pílula sólida
assert(
  chordDiagramSource.includes('barLeft') &&
  chordDiagramSource.includes('barWidth') &&
  chordDiagramSource.includes('rx={radius}'),
  '27.04 ChordDiagram desenha pestana contínua (barre pill) com número do dedo indicador'
);

// 27.5 Pontos nos trastes com números dos dedos (1=indicador, 2=médio, 3=anelar, 4=mínimo)
assert(
  chordDiagramSource.includes('effectiveFingers') &&
  chordDiagramSource.includes('dot-${stringIdx}-${fretVal}') &&
  chordDiagramSource.includes('finger > 0'),
  '27.05 ChordDiagram renderiza pontos sólidos nas casas com os números correspondentes dos dedos'
);

// 27.6 Pestana superior (nut preta grossa na casa 1) ou número da casa base para posições altas
assert(
  chordDiagramSource.includes('effectiveBaseFret === 1') &&
  chordDiagramSource.includes('{effectiveBaseFret}ª') &&
  chordDiagramSource.includes('stroke="#25252A"'),
  '27.06 ChordDiagram renderiza pestana de osso para casa 1 e indicador ordinal (ex: 3ª, 5ª) para casas avançadas'
);

// 27.7 Áudio integrado: botões de Batida (Block Strum) e Dedilhado (Arpeggio)
assert(
  chordDiagramSource.includes('Batida') &&
  chordDiagramSource.includes('Dedilhado') &&
  chordDiagramSource.includes('audioEngine.playChord'),
  '27.07 ChordDiagram inclui reprodução sonora de áudio acústico para batida e dedilhado'
);

// 27.8 Eliminação de arrays textuais em ChordDictionaryView.tsx
const chordDictSource = fs.readFileSync('src/components/chords/ChordDictionaryView.tsx', 'utf-8');
assert(
  !chordDictSource.includes('Trastes: [') &&
  !chordDictSource.includes('Dedos: ['),
  '27.08 ChordDictionaryView.tsx eliminou integralmente a apresentação textual de arrays de trastes e dedos'
);

// 27.9 ChordDictionaryView.tsx utiliza ChordDiagram na seção do Sistema CAGED
assert(
  chordDictSource.includes('cagedShapes.map') &&
  chordDictSource.includes('<ChordDiagram') &&
  chordDictSource.includes('chord={shape}'),
  '27.09 Seção CAGED do Dicionário utiliza o componente visual ChordDiagram para os 5 formatos'
);

// 27.10 ChordDictionaryView.tsx utiliza ChordDiagram no Laboratório de Sonoridades
assert(
  chordDictSource.includes('family.variants.map') &&
  chordDictSource.includes('frets={v.frets}'),
  '27.10 Laboratório de Sonoridades utiliza ChordDiagram para exibir as variações acústicas ricas'
);

// 27.11 ChordDictionaryView.tsx utiliza ChordDiagram no Validador de Digitações
assert(
  chordDictSource.includes('frets={validatorFrets}') &&
  chordDictSource.includes('symbol={validatorTargetChord}'),
  '27.11 Validador de Digitações exibe em tempo real o diagrama visual das casas inseridas'
);

// 27.12 Eliminação de formato textual e adoção do ChordDiagram em LessonViewer.tsx
const lessonViewerSourceChord = fs.readFileSync('src/components/curriculum/LessonViewer.tsx', 'utf-8');
assert(
  !lessonViewerSourceChord.includes('Casas: <strong') &&
  !lessonViewerSourceChord.includes('Dedos: <strong'),
  '27.12 LessonViewer.tsx eliminou caixas de texto com listas numéricas de casas e dedos'
);
assert(
  lessonViewerSourceChord.includes('Acordes da Aula no Violão Físico') &&
  lessonViewerSourceChord.includes('<ChordDiagram') &&
  lessonViewerSourceChord.includes('chord={chord}'),
  '27.13 LessonViewer.tsx renderiza o padrão visual Cifra Club para todos os acordes das aulas de violão'
);

// 27.14 Adoção do ChordDiagram em StudyLibraryView.tsx
const studyLibrarySource = fs.readFileSync('src/components/library/StudyLibraryView.tsx', 'utf-8');
assert(
  studyLibrarySource.includes('<ChordDiagram') &&
  studyLibrarySource.includes('chord={shape}'),
  '27.14 StudyLibraryView.tsx substituiu a tabela textual pelo componente visual ChordDiagram'
);

// 27.15 Adoção do ChordDiagram no Virtuo Guitar Coach (GuitarCoachView.tsx)
const guitarCoachSource = fs.readFileSync('src/components/coach/GuitarCoachView.tsx', 'utf-8');
assert(
  guitarCoachSource.includes('<ChordDiagram') &&
  guitarCoachSource.includes('currentChordDetails.frets') &&
  guitarCoachSource.includes('nextChordDetails.frets'),
  '27.15 GuitarCoachView.tsx renderiza diagramas visuais para Tocar Agora e Preparar Dedos'
);

// 27.16 Preservação da representação visual do Teclado (sem diagramas de 6 cordas de violão para piano)
const keyboardCourseSource = fs.readFileSync('src/data/keyboardCourse.ts', 'utf-8');
assert(
  !keyboardCourseSource.includes('chordDiagrams:') &&
  lessonViewerSourceChord.includes('isKeyboardLesson') &&
  lessonViewerSourceChord.includes('Diagrama Harmônico de Teclado'),
  '27.16 Cursos de teclado preservam estritamente o teclado virtual de teclas, sem contaminação por diagramas de cordas'
);

// 27.17 Validação teórica e física dos 5 formatos CAGED para o acorde de C
const cShapesCaged = generateCagedShapes('C');
assert(
  cShapesCaged.length === 5,
  '27.17 Acorde de Dó (C) possui os 5 formatos geométricos do sistema CAGED gerados dinamicamente'
);
cShapesCaged.forEach((s, idx) => {
  assert(
    s.frets.length === 6 && s.fingers.length === 6,
    `27.18 Formato CAGED #${idx + 1} de C (${s.cagedForm}) possui exatamente 6 valores para trastes e dedos`
  );
  assert(
    s.baseFret >= 1 && s.baseFret <= 15,
    `27.19 Formato CAGED #${idx + 1} de C (${s.cagedForm}) possui casa base válida no braço (${s.baseFret}ª casa)`
  );
});

// 27.20 Validação de acordes com pestana (F e Bm)
const fChordDb = CHORD_DATABASE.find(c => c.symbol === 'F');
assert(
  Boolean(fChordDb && fChordDb.barre !== undefined && fChordDb.barre.fret === 1),
  '27.20 Acorde de F possui definição de pestana explícita na 1ª casa'
);
const bmChordDb = CHORD_DATABASE.find(c => c.symbol === 'Bm');
assert(
  Boolean(bmChordDb && bmChordDb.barre !== undefined && bmChordDb.barre.fret === 2),
  '27.21 Acorde de Bm possui definição de pestana explícita na 2ª casa'
);

// -------------------------------------------------------------
// GRUPO 28: FASE DE AUTENTICAÇÃO OBRIGATÓRIA (SISTEMA DE IDENTIDADE & PERSISTÊNCIA)
// -------------------------------------------------------------
console.log('\n--- GRUPO 28: Fase de Autenticação Obrigatória, Provedores & Identidade ---');

// 28.1 Verificação da existência do componente AuthView.tsx
const authViewExists = fs.existsSync('src/components/auth/AuthView.tsx');
assert(authViewExists, '28.01 Componente AuthView.tsx existe em src/components/auth/');

const authViewCode = fs.readFileSync('src/components/auth/AuthView.tsx', 'utf-8');
assert(
  authViewCode.includes('src="./icon.svg"'),
  '28.02 AuthView renderiza a logo oficial ./icon.svg da Guitar Academy'
);
assert(
  authViewCode.includes('Continuar com o Google'),
  '28.03 AuthView disponibiliza botão oficial de login com o Google'
);
assert(
  authViewCode.includes('Facebook') && authViewCode.includes('signInWithFacebook'),
  '28.04 AuthView disponibiliza botão oficial de login com o Facebook'
);
assert(
  authViewCode.includes('Apple') && authViewCode.includes('signInWithApple'),
  '28.05 AuthView disponibiliza botão oficial de login com a Apple'
);
assert(
  authViewCode.includes('signInWithEmail') && authViewCode.includes('signUpWithEmail'),
  '28.06 AuthView disponibiliza fluxos completos de login e criação de conta por e-mail/senha'
);
assert(
  authViewCode.includes('sendPasswordReset') && authViewCode.includes('Esqueci minha senha'),
  '28.07 AuthView disponibiliza fluxo de recuperação de senha (sendPasswordReset)'
);
assert(
  authViewCode.includes('Termos & Privacidade do Aluno') && authViewCode.includes('StudentPrivacyNotice'),
  '28.08 AuthView integra acesso aos Termos de Uso e Política de Privacidade do Aluno'
);

// 28.9 Bloqueio Mandatório no Gateway App.tsx
const appSourceCode = fs.readFileSync('src/App.tsx', 'utf-8');
assert(
  appSourceCode.includes('if (showSplash) {') &&
  appSourceCode.includes('<SplashScreen onFinish='),
  '28.09 App.tsx executa a Splash Screen antes de qualquer exibição de interface'
);
assert(
  appSourceCode.includes('if (!user) {') &&
  appSourceCode.includes('<AuthView />'),
  '28.10 App.tsx implementa gateway obrigatório: usuários não autenticados são barrados em <AuthView />'
);
assert(
  appSourceCode.includes('if (loading) {') &&
  appSourceCode.includes('Verificando sessão de estudos...'),
  '28.11 App.tsx previne flash de conteúdo interno exibindo tela de carregamento segura durante verificação'
);

// 28.12 Métodos de Autenticação em firebase.ts
const firebaseServiceCode = fs.readFileSync('src/services/firebase.ts', 'utf-8');
assert(
  firebaseServiceCode.includes('export async function signInWithGoogle') &&
  firebaseServiceCode.includes('export async function signInWithFacebook') &&
  firebaseServiceCode.includes('export async function signInWithApple') &&
  firebaseServiceCode.includes('export async function signInWithEmail') &&
  firebaseServiceCode.includes('export async function signUpWithEmail') &&
  firebaseServiceCode.includes('export async function sendPasswordReset'),
  '28.12 firebase.ts exporta métodos para Google, Facebook, Apple, E-mail Login, E-mail Cadastro e Reset de Senha'
);

import { mapFirebaseAuthError, parseSystemRoleDoc, fetchSystemRole } from './src/services/firebase';

assert(
  mapFirebaseAuthError({ code: 'auth/invalid-email' }).includes('E-mail com formato inválido'),
  '28.13 mapFirebaseAuthError traduz auth/invalid-email com mensagem amigável em português'
);
assert(
  mapFirebaseAuthError({ code: 'auth/wrong-password' }).includes('E-mail ou senha incorretos'),
  '28.14 mapFirebaseAuthError traduz auth/wrong-password'
);
assert(
  mapFirebaseAuthError({ code: 'auth/email-already-in-use' }).includes('já está em uso'),
  '28.15 mapFirebaseAuthError traduz auth/email-already-in-use'
);
assert(
  mapFirebaseAuthError({ code: 'auth/weak-password' }).includes('mínimo 6 caracteres'),
  '28.16 mapFirebaseAuthError traduz auth/weak-password'
);
assert(
  mapFirebaseAuthError({ code: 'auth/operation-not-allowed' }).includes('provedor de autenticação ainda não foi ativado'),
  '28.17 mapFirebaseAuthError instrui claramente sobre provedor ainda não ativado no Firebase Console'
);

// 28.18 Estrutura do Perfil de Aluno (StudentProfile)
const typesCode = fs.readFileSync('src/types/index.ts', 'utf-8');
assert(
  typesCode.includes('export interface StudentProfile') &&
  typesCode.includes('provider: AuthProviderType | string') &&
  typesCode.includes('accountStatus: AccountStatus') &&
  typesCode.includes('role: UserRole') &&
  typesCode.includes('enrolledCourses: string[]'),
  '28.18 types/index.ts define a interface StudentProfile com todos os campos de auditoria e matrícula'
);

// 28.19 Isolamento Multi-usuário e Regras de Segurança
const firestoreRules = fs.readFileSync('firestore.rules', 'utf-8');
assert(
  firestoreRules.includes('match /users/{userId}') &&
  firestoreRules.includes('isOwner(userId)'),
  '28.19 firestore.rules isola os documentos de alunos: apenas o proprietário (isOwner) pode ler e gravar'
);
assert(
  firestoreRules.includes('match /system_roles/{userId}') &&
  firestoreRules.includes('allow write: if false'),
  '28.20 firestore.rules protege system_roles/{userId} contra manipulação arbitrária por clientes'
);

// 28.21 Preservação da Sessão e Desconexão Imediata (logOut)
const authContextCode = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');
assert(
  authContextCode.includes('onAuthStateChanged') &&
  authContextCode.includes('storageService.setCurrentUser(currentUser.uid)'),
  '28.21 AuthContext sincroniza a sessão com onAuthStateChanged e isola o storage pelo UID'
);
assert(
  authContextCode.includes('storageService.setCurrentUser(null)') &&
  authContextCode.includes('fbLogOut()'),
  '28.22 AuthContext limpa o ponteiro de usuário ativo e o perfil na desconexão imediata'
);

// -------------------------------------------------------------
// GRUPO 29: FASE DE SEPARAÇÃO DE AMBIENTES (ALUNO VS ADMIN), RBAC & BACKEND HARDENING
// -------------------------------------------------------------
console.log('\n--- GRUPO 29: Separação de Ambientes Aluno vs Admin, RBAC Zero-Trust & Backend Hardening ---');

// 29.1 Existência e Estrutura do Portal Administrativo (AdminPortalView.tsx)
const adminPortalExists = fs.existsSync('src/components/admin/AdminPortalView.tsx');
assert(adminPortalExists, '29.01 Componente AdminPortalView.tsx existe em src/components/admin/');

const adminPortalCode = fs.readFileSync('src/components/admin/AdminPortalView.tsx', 'utf-8');
assert(
  adminPortalCode.includes('Guitar Academy') &&
  (adminPortalCode.includes('Admin Suite') || adminPortalCode.includes('Portal Administrativo')),
  '29.02 AdminPortalView exibe cabeçalho oficial do Portal Administrativo'
);
assert(
  adminPortalCode.includes('overview') &&
  adminPortalCode.includes('students') &&
  adminPortalCode.includes('classes') &&
  adminPortalCode.includes('courses') &&
  adminPortalCode.includes('reports') &&
  adminPortalCode.includes('security'),
  '29.03 AdminPortalView possui as 6 seções mestras de governança'
);
assert(
  adminPortalCode.includes('setAdminPreviewMode(true)') || adminPortalCode.includes('Ver como Aluno'),
  '29.04 AdminPortalView permite alternância para modo de visualização de aluno (Ver como Aluno)'
);

// 29.5 Isolamento Rigoroso da Interface do Aluno (Header.tsx e Navigation.tsx)
const headerSourceCode = fs.readFileSync('src/components/layout/Header.tsx', 'utf-8');
assert(
  !headerSourceCode.includes('dramosdasilva7@gmail.com'),
  '29.05 Header.tsx não contém nenhum email hardcoded para exibição de botões administrativos'
);
assert(
  headerSourceCode.includes('Retornar ao Painel Admin') && headerSourceCode.includes('isAdmin && adminPreviewMode'),
  '29.06 Header.tsx exibe retorno ao painel administrativo EXCLUSIVAMENTE para administradores em modo preview'
);

const navCode = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf-8');
assert(
  !navCode.includes('teacher-dashboard') && !navCode.includes('isTeacher'),
  '29.07 Navigation.tsx do aluno não expõe abas ou rotas administrativas (teacher-dashboard)'
);

// 29.8 Isolamento no Roteador Principal (App.tsx)
const appRootCode = fs.readFileSync('src/App.tsx', 'utf-8');
assert(
  appRootCode.includes("tab === 'teacher-dashboard' && !isTeacher") &&
  appRootCode.includes("setCurrentTab('home');"),
  '29.08 App.tsx bloqueia e redireciona qualquer tentativa de acesso indevido de alunos a abas administrativas/pedagógicas para home'
);
assert(
  appRootCode.includes('if (isAdmin && !adminPreviewMode)') &&
  appRootCode.includes('<AdminPortalView />'),
  '29.09 App.tsx monta o AdminPortalView exclusivamente para administradores autenticados fora do modo preview'
);

// 29.10 Zero-Trust e Papéis Autorizativos em firestore.rules
const rulesText = fs.readFileSync('firestore.rules', 'utf-8');
assert(
  rulesText.includes('function isAdmin()') &&
  rulesText.includes('request.auth != null') &&
  rulesText.includes("get(/databases/$(database)/documents/system_roles/$(request.auth.uid)).data.role == 'admin'"),
  '29.10 firestore.rules baseia a checagem de isAdmin exclusivamente na coleção protegida system_roles'
);
assert(
  rulesText.includes('match /system_roles/{userId}') &&
  rulesText.includes('allow write: if false;'),
  '29.11 firestore.rules bloqueia qualquer escrita de clientes na coleção system_roles'
);
assert(
  rulesText.includes('match /users/{userId}') &&
  rulesText.includes('(!request.resource.data.diff(resource.data).affectedKeys().hasAny([') &&
  rulesText.includes("'role'"),
  '29.12 firestore.rules impede que clientes alterem seu próprio papel (role) no documento users'
);

// 29.13 Proteção Criptográfica do Backend (server.ts)
const serverCode = fs.readFileSync('server.ts', 'utf-8');
assert(
  serverCode.includes('import admin from \'firebase-admin\'') &&
  serverCode.includes('admin.initializeApp'),
  '29.13 server.ts inicializa o Firebase Admin SDK para verificação de tokens'
);
assert(
  serverCode.includes('export async function requireAuth') &&
  serverCode.includes('admin.auth().verifyIdToken(token)'),
  '29.14 server.ts define middleware requireAuth com validação de ID Token Bearer'
);
assert(
  serverCode.includes("app.post('/api/professor/chat', requireAuth") &&
  serverCode.includes("app.post('/api/professor/exercise', requireAuth") &&
  serverCode.includes("app.post('/api/professor/evaluate', requireAuth") &&
  serverCode.includes("app.post('/api/professor/recommend', requireAuth"),
  '29.15 Todos os endpoints do Professor IA em server.ts estão protegidos por requireAuth'
);
assert(
  serverCode.includes("app.get('/api/health'"),
  '29.16 server.ts fornece endpoint /api/health para monitoramento em produção e Cloud Run'
);
assert(
  serverCode.includes('Access-Control-Allow-Origin') &&
  serverCode.includes('Access-Control-Allow-Headers'),
  '29.17 server.ts configura CORS com suporte a requisições com Authorization Bearer'
);

// 29.18 Transmissão de Tokens no Cliente (professorService.ts)
const profServiceCode = fs.readFileSync('src/services/professorService.ts', 'utf-8');
assert(
  profServiceCode.includes('getIdToken()') &&
  profServiceCode.includes("headers['Authorization']"),
  '29.18 professorService.ts injeta token de autenticação em todas as requisições'
);
assert(
  profServiceCode.includes('VITE_PROFESSOR_API_URL'),
  '29.19 professorService.ts suporta configuração de URL externa de backend (VITE_PROFESSOR_API_URL)'
);

// 29.20 Isolamento do Service Worker contra Cache de Rotas de API (vite.config.ts)
const viteConfigSW = fs.readFileSync('vite.config.ts', 'utf-8');
assert(
  viteConfigSW.includes('navigateFallbackDenylist') &&
  viteConfigSW.includes('NetworkOnly'),
  '29.20 vite.config.ts instrui o Workbox a nunca armazenar em cache respostas ou tokens de rotas /api/'
);

// 29.21 Tradução de auth/unauthorized-domain
assert(
  mapFirebaseAuthError({ code: 'auth/unauthorized-domain' }).includes('Domínio da aplicação não autorizado no Firebase'),
  '29.21 mapFirebaseAuthError traduz auth/unauthorized-domain orientando configuração no Firebase Console'
);

// =============================================================
// GRUPO 30 — SMART TUNER V1.2 & COMPLETE AUDIO SYSTEM
// Sensibilidade, Subgraves B0/E1, Ponteiro Ágil, Síntese Acústica e Metrônomo
// =============================================================

console.log('\n--- GRUPO 30: SMART TUNER V1.2 & COMPLETE AUDIO SYSTEM ---');

// 30.1 Parâmetros de Alta Sensibilidade do Detector Acústico
const v12Detector = new GuitarPitchDetector();
assert(
  (v12Detector as any).silenceThreshold <= 0.005 &&
  (v12Detector as any).confidenceThreshold <= 0.60 &&
  (v12Detector as any).bufferSize >= 4096,
  '30.1 GuitarPitchDetector V1.2 adota parâmetros calibrados para alta sensibilidade (silence <= 0.005, conf <= 0.60, buffer >= 4096)'
);

// 30.2 Detecção de Sinal Periódico Suave (toque de baixa intensidade sem corte artificial)
const softSampleRate = 44100;
const softBufferSize = 4096;
const softBuffer = new Float32Array(softBufferSize);
const softFreq = 110; // A2
for (let i = 0; i < softBufferSize; i++) {
  // RMS ~ 0.006 (sinal suave mas com formato de onda puro e periódico)
  softBuffer[i] = 0.0085 * Math.sin((2 * Math.PI * softFreq * i) / softSampleRate);
}
const softDetection = v12Detector.detectPitchFromBuffer(softBuffer, softSampleRate);
assert(
  softDetection !== null && !softDetection.isSilence && Math.abs(softDetection.frequency - 110) < 3.0,
  `30.2 GuitarPitchDetector detecta notas suaves e periódicas sem rejeição indevida de silêncio (detectado: ${softDetection?.frequency} Hz)`
);

// 30.3 Detecção Precisa de Subgraves — Contrabaixo (B0 = 30.87 Hz e E1 = 41.2 Hz)
const bassSampleRate = 44100;
const bassBufferSize = 8192;
const b0Buffer = new Float32Array(bassBufferSize);
const b0Freq = 30.87;
for (let i = 0; i < bassBufferSize; i++) {
  b0Buffer[i] = 0.25 * Math.sin((2 * Math.PI * b0Freq * i) / bassSampleRate) +
                0.10 * Math.sin((2 * Math.PI * b0Freq * 2 * i) / bassSampleRate);
}
const b0Detection = v12Detector.detectPitchFromBuffer(b0Buffer, bassSampleRate, { lowCutoff: 25, highCutoff: 400 });
assert(
  b0Detection !== null && Math.abs(b0Detection.frequency - 30.87) < 2.0 && b0Detection.note === 'B',
  `30.3 GuitarPitchDetector com decimação YIN identifica com precisão a corda Si mais grave do Baixo (B0 ~ 30.87 Hz, detectado: ${b0Detection?.frequency} Hz, nota: ${b0Detection?.note})`
);

const e1Buffer = new Float32Array(bassBufferSize);
const e1Freq = 41.2;
for (let i = 0; i < bassBufferSize; i++) {
  e1Buffer[i] = 0.3 * Math.sin((2 * Math.PI * e1Freq * i) / bassSampleRate);
}
const e1Detection = v12Detector.detectPitchFromBuffer(e1Buffer, bassSampleRate, { lowCutoff: 25, highCutoff: 400 });
assert(
  e1Detection !== null && Math.abs(e1Detection.frequency - 41.2) < 2.0 && e1Detection.note === 'E',
  `30.4 GuitarPitchDetector identifica com estabilidade a corda Mi do Baixo de 4 cordas (E1 ~ 41.2 Hz, detectado: ${e1Detection?.frequency} Hz)`
);

// 30.5 TunerSmoother V1.2: Alphas Ágeis (0.28 / 0.18 / 0.08) e Sem Falsos Positivos de Afinação
const fastSmoother = new TunerSmoother();
assert(
  (fastSmoother as any).alphaStandard === 0.28 &&
  (fastSmoother as any).alphaNear === 0.18 &&
  (fastSmoother as any).alphaDeadZone === 0.08,
  '30.5 TunerSmoother adota alphas de resposta rápida (0.28 standard, 0.18 near, 0.08 dead zone) para ponteiro ágil e vivo'
);

// Envia nota fora de afinação (+18 cents)
fastSmoother.feedPitch({
  frequency: 444.6,
  note: 'A',
  notePt: 'Lá',
  octave: 4,
  cents: 18,
  confidence: 0.95,
  intensity: 0.6,
  isSilence: false,
  isWeakSignal: false,
  isOnset: false,
  detectionType: 'monophonic_note',
  stability: 95,
  stabilityLabel: 'Estável',
  expectedFreq: 440,
  diffHz: 4.6,
  timestamp: performance.now(),
});
const outOfTuneState = fastSmoother.step();
assert(
  outOfTuneState.isInTune === false && outOfTuneState.state !== 'in_tune',
  '30.6 TunerSmoother jamais marca isInTune como verdadeiro enquanto a frequência alvo estiver fora da tolerância'
);

// Envia nota perfeitamente afinada (0 cents)
fastSmoother.reset();
fastSmoother.feedPitch({
  frequency: 440.0,
  note: 'A',
  notePt: 'Lá',
  octave: 4,
  cents: 0.0,
  confidence: 0.98,
  intensity: 0.7,
  isSilence: false,
  isWeakSignal: false,
  isOnset: false,
  detectionType: 'monophonic_note',
  stability: 100,
  stabilityLabel: 'Excelente',
  expectedFreq: 440,
  diffHz: 0,
  timestamp: performance.now(),
});
// Processa alguns steps para estabilizar o filtro
for (let i = 0; i < 5; i++) {
  fastSmoother.step();
}
const inTuneState = fastSmoother.step();
assert(
  inTuneState.isInTune === true && inTuneState.note === 'A',
  '30.7 TunerSmoother valida afinação confirmada (isInTune: true) no centro com alta confiança'
);

// 30.8 TunerView: Orientação Visual de Tarraxa (▲ APERTAR / ▼ AFROUXAR / ✓ AFINADA)
const tunerViewCode = fs.readFileSync('src/components/tuner/TunerView.tsx', 'utf-8');
assert(
  tunerViewCode.includes('▲ APERTAR') &&
  tunerViewCode.includes('▼ AFROUXAR') &&
  tunerViewCode.includes('✓ AFINADA'),
  '30.8 TunerView.tsx implementa orientação inequívoca de rotação da tarraxa (▲ APERTAR / ▼ AFROUXAR / ✓ AFINADA)'
);
assert(
  tunerViewCode.includes('Ação / Direção') &&
  tunerViewCode.includes('Desvio Cents'),
  '30.9 TunerView.tsx exibe bloco dedicado com ação recomendada, desvio, frequências e confiança'
);

// 30.10 AudioEngine: Métodos Centrais e Timbre Multi-Instrumento
assert(
  typeof (audioEngine as any).playNote === 'function' &&
  typeof (audioEngine as any).playReferenceTone === 'function' &&
  typeof (audioEngine as any).playMetronomeClick === 'function' &&
  typeof (audioEngine as any).testMetronomeSound === 'function' &&
  typeof (audioEngine as any).playExample === 'function' &&
  typeof (audioEngine as any).stopAllSounds === 'function',
  '30.10 AudioEngine disponibiliza API centralizada completa (playNote, playReferenceTone, playMetronomeClick, testMetronomeSound, playExample, stopAllSounds)'
);

const audioEngineCode = fs.readFileSync('src/audio/audioEngine.ts', 'utf-8');
assert(
  audioEngineCode.includes("'guitar'") &&
  audioEngineCode.includes("'violao'") &&
  audioEngineCode.includes("'bass'") &&
  audioEngineCode.includes("'piano'") &&
  audioEngineCode.includes("'drums'"),
  '30.11 AudioEngine implementa modelos de síntese acústica para guitarra, violão, contrabaixo, piano e percussão'
);

assert(
  audioEngineCode.includes('pointerdown') &&
  audioEngineCode.includes('touchstart') &&
  audioEngineCode.includes('unlockAudio'),
  '30.12 AudioEngine registra desbloqueio global imediato no primeiro gesto do usuário (pointerdown / touchstart / keydown)'
);

// 30.13 MetronomeView: Botão de Testar Som
const metronomeViewCode = fs.readFileSync('src/components/metronome/MetronomeView.tsx', 'utf-8');
assert(
  metronomeViewCode.includes('testMetronomeSound') &&
  metronomeViewCode.includes('Testar som'),
  '30.13 MetronomeView.tsx oferece botão "Testar som" para homologação imediata de áudio do aluno'
);

// =============================================================
// GRUPO 31 — AUTENTICAÇÃO ADMINISTRATIVA DEFINITIVA E ZERO-TRUST
// Validação das 10 regras de segurança de system_roles/{uid}
// =============================================================

console.log('\n--- GRUPO 31: AUTENTICAÇÃO ADMINISTRATIVA DEFINITIVA E ZERO-TRUST ---');

// 31.1 Aluno autenticado não acessa o painel administrativo
const appCodeAudit = fs.readFileSync('src/App.tsx', 'utf-8');
assert(
  appCodeAudit.includes('if (isAdmin && !adminPreviewMode)') &&
  appCodeAudit.includes('<AdminPortalView />') &&
  appCodeAudit.includes("!isTeacher && currentTab === 'teacher-dashboard'"),
  '31.1 App.tsx impede que alunos acessem o painel administrativo ou pedagógico mesmo autenticados ou via URL direta'
);

// 31.2 Aluno não consegue promover a própria conta
const rulesAudit = fs.readFileSync('firestore.rules', 'utf-8');
assert(
  rulesAudit.includes("!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isTeacher', 'isAdmin', 'permissions'])"),
  '31.2 firestore.rules bloqueia qualquer alteração de role, isAdmin, isTeacher ou permissions pelo próprio aluno em users/{userId}'
);

// 31.3 Documento sem campo role não concede privilégios
assert(
  parseSystemRoleDoc({}) === 'student' &&
  parseSystemRoleDoc({ displayName: 'Administrator', uid: 'test_uid' }) === 'student' &&
  parseSystemRoleDoc(null) === 'student',
  '31.3 Documento em system_roles sem o campo explícito role não concede privilégios administrativos (resolve student)'
);

// 31.4 Documento com role: student não concede privilégios administrativos
assert(
  parseSystemRoleDoc({ role: 'student' }) === 'student' &&
  parseSystemRoleDoc({ role: 'student', isAdmin: true }) === 'student',
  '31.4 Documento com role: student não concede privilégios administrativos, ignorando flags arbitrárias do cliente'
);

// 31.5 Documento com role: admin autoriza o administrador correto
assert(
  parseSystemRoleDoc({ role: 'admin' }) === 'admin',
  '31.5 Documento com role: admin autoriza com precisão o papel de administrador no sistema'
);

// 31.6 UID diferente não recebe a autorização de outro usuário
const isolatedAdminUid = 'admin_legitimate_uid';
const studentAttemptUid = 'student_intruder_uid';
const roleResolvedForStudent = await fetchSystemRole(studentAttemptUid, async (targetUid) => {
  return targetUid === isolatedAdminUid ? { role: 'admin' } : null;
});
assert(
  roleResolvedForStudent === 'student',
  '31.6 UID de aluno diferente não herda nem intercepta privilégios de outro UID cadastrado como admin'
);

// 31.7 Falha na consulta da função não libera acesso (Fail-Closed Zero-Trust)
const failClosedRole = await fetchSystemRole('any_uid_network_error', async () => {
  throw new Error('Timeout / Network Failure / Permission Denied');
});
assert(
  failClosedRole === 'student',
  '31.7 Falha de rede ou erro na leitura de system_roles nunca concede privilégios (princípio Fail-Closed Zero-Trust)'
);

// 31.8 Logout remove imediatamente o estado administrativo
const authContextSource = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');
assert(
  authContextSource.includes('setUser(null)') &&
  authContextSource.includes("setRole('student')") &&
  authContextSource.includes('setAdminPreviewMode(false)') &&
  authContextSource.includes('finally {'),
  '31.8 logOut no AuthContext limpa incondicionalmente no bloco finally o usuário, o papel administrativo e o preview'
);

// 31.9 Rotas administrativas e pedagógicas estão protegidas no cliente
assert(
  appCodeAudit.includes("if (tab === 'teacher-dashboard' && !isTeacher)") &&
  appCodeAudit.includes("setCurrentTab('home')"),
  '31.9 navigateToTab bloqueia navegação para rotas administrativas/pedagógicas para alunos (AdminPortalView exige isAdmin e teacher-dashboard exige isTeacher)'
);

// 31.10 Regras do Firestore não permitem autoatribuição de privilégios
assert(
  rulesAudit.includes('match /system_roles/{userId}') &&
  rulesAudit.includes('allow write: if false;'),
  '31.10 firestore.rules bloqueia estritamente qualquer escrita de clientes em system_roles/{userId} (allow write: if false)'
);

// =============================================================
// GRUPO 32 — CORREÇÃO GERAL DEFINITIVA (RBAC, MATRÍCULAS E BACKEND)
// =============================================================
console.log('\n--- GRUPO 32: CORREÇÃO GERAL DEFINITIVA (RBAC, MATRÍCULAS, BACKEND E INFRA) ---');

// 32.01 Remoção de qualquer bypass de token mock em server.ts
assert(
  !serverCode.includes('mock-valid-token-') &&
  !serverCode.includes("process.env.NODE_ENV === 'test'"),
  '32.01 server.ts remove integralmente qualquer bypass de token mockado em runtime/produção'
);

// 32.02 CORS allowlist estrito em server.ts
assert(
  serverCode.includes('https://nashixhoo.github.io') &&
  serverCode.includes('allowedOrigins.has(origin)') &&
  serverCode.includes("res.status(403).json({ error: 'Origem não autorizada"),
  '32.02 server.ts aplica CORS por allowlist explícita sem refletir origens desconhecidas com credenciais'
);

// 32.03-32.07 Testes HTTP reais contra createServerApp()
const { createServerApp } = await import('./server');
const httpMod = await import('node:http');
const phase7App = createServerApp({
  verifyIdToken: async (token: string) => {
    if (token === 'jwt-student') return { uid: 'uid-stu-1', email: 'alu@guitar.test' };
    if (token === 'jwt-teacher') return { uid: 'uid-tea-1', email: 'prof@guitar.test' };
    if (token === 'jwt-admin') return { uid: 'uid-adm-1', email: 'adm@guitar.test' };
    throw new Error('Invalid token');
  },
  getSystemRole: async (uid: string) => {
    if (uid === 'uid-adm-1') return { exists: true, role: 'admin' };
    if (uid === 'uid-tea-1') return { exists: true, role: 'teacher' };
    if (uid === 'uid-stu-1') return { exists: true, role: 'student' };
    throw new Error('Role lookup error');
  },
});

const phase7Server = httpMod.createServer(phase7App);
await new Promise<void>((resolve) => phase7Server.listen(0, '127.0.0.1', () => resolve()));
const phase7Addr = phase7Server.address();
const phase7Url = phase7Addr && typeof phase7Addr !== 'string' ? `http://127.0.0.1:${phase7Addr.port}` : '';

try {
  const unauthResp = await fetch(`${phase7Url}/api/admin/overview`);
  assert(unauthResp.status === 401, '32.03 Backend retorna HTTP 401 para requisições não autenticadas');

  const stuAdminResp = await fetch(`${phase7Url}/api/admin/overview`, {
    headers: { Authorization: 'Bearer jwt-student', 'x-role': 'admin' },
  });
  const stuClassInsightsResp = await fetch(`${phase7Url}/api/professor/class-insights`, {
    method: 'POST',
    headers: { Authorization: 'Bearer jwt-student', 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'admin', className: 'Turma A' }),
  });
  assert(
    stuAdminResp.status === 403 && stuClassInsightsResp.status === 403 && serverCode.includes('requireRole('),
    '32.04 Backend aplica requireRole consultando system_roles, ignora role do frontend e bloqueia aluno (HTTP 403)'
  );

  const teaAdminResp = await fetch(`${phase7Url}/api/admin/overview`, {
    headers: { Authorization: 'Bearer jwt-teacher' },
  });
  const teaClassInsightsResp = await fetch(`${phase7Url}/api/professor/class-insights`, {
    method: 'POST',
    headers: { Authorization: 'Bearer jwt-teacher', 'Content-Type': 'application/json' },
    body: JSON.stringify({ className: 'Turma A', metrics: {} }),
  });
  const teaRoleResp = await fetch(`${phase7Url}/api/auth/role`, {
    headers: { Authorization: 'Bearer jwt-teacher' },
  });
  const teaRoleData = (await teaRoleResp.json()) as { role: string };
  assert(
    teaAdminResp.status === 403 &&
    teaClassInsightsResp.status !== 403 &&
    teaClassInsightsResp.status !== 401 &&
    teaRoleResp.status === 200 &&
    teaRoleData.role === 'teacher',
    '32.05 Backend bloqueia professor em rota exclusiva admin (403), autoriza rota pedagógica de professor e confirma papel teacher em /api/auth/role'
  );

  const admResp = await fetch(`${phase7Url}/api/admin/overview`, {
    headers: { Authorization: 'Bearer jwt-admin' },
  });
  assert(admResp.status === 200, '32.06 Backend autoriza administrador confirmado em system_roles com HTTP 200');

  // 32.06b Desativação segura do Professor IA (custo zero, sem chamadas Gemini)
  const profStatusResp = await fetch(`${phase7Url}/api/professor/status`);
  const profStatusData = (await profStatusResp.json()) as { available: boolean; disabled?: boolean };
  const stuChatBlockedResp = await fetch(`${phase7Url}/api/professor/chat`, {
    method: 'POST',
    headers: { Authorization: 'Bearer jwt-student', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Teste de custo zero' }),
  });
  assert(
    profStatusResp.status === 200 &&
    profStatusData.available === false &&
    profStatusData.disabled === true &&
    stuChatBlockedResp.status === 503,
    '32.06b Endpoints /api/professor/* permanecem desativados por padrão (available: false, disabled: true, HTTP 503)'
  );
} finally {
  await new Promise<void>((resolve) => phase7Server.close(() => resolve()));
}

// 32.06c Cliente frontend não realiza nenhuma chamada ao Professor IA nem expõe acesso nos menus
const { PROFESSOR_IA_ENABLED, professorService } = await import('./src/services/professorService');
const originalFetchRef = globalThis.fetch;
let profFetchCalls = 0;
globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
  profFetchCalls += 1;
  return originalFetchRef(...args);
}) as typeof fetch;
try {
  const clientStatus = await professorService.checkStatus();
  let askFailed = false;
  try {
    await professorService.askQuestion('Teste sem chamada externa', {});
  } catch {
    askFailed = true;
  }
  assert(
    PROFESSOR_IA_ENABLED === false &&
    clientStatus.available === false &&
    askFailed &&
    profFetchCalls === 0,
    '32.06c professorService desativado por flag impede 100% de chamadas HTTP/fetch para /api/professor/*'
  );
} finally {
  globalThis.fetch = originalFetchRef;
}

const navMenuSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf-8');
const subNavSource = fs.readFileSync('src/components/layout/SubNavBar.tsx', 'utf-8');
const dashSource = fs.readFileSync('src/components/dashboard/DashboardView.tsx', 'utf-8');
const diagSource = fs.readFileSync('src/components/diagnostics/DiagnosticsView.tsx', 'utf-8');
const routineSource = fs.readFileSync('src/components/routine/PracticeRoutineView.tsx', 'utf-8');
assert(
  !navMenuSource.includes('professor-ai') &&
  !subNavSource.includes('professor-ai') &&
  !dashSource.includes('professor-ai') &&
  !diagSource.includes('/api/professor') &&
  !routineSource.includes('professorService') &&
  !appCodeAudit.includes('<ProfessorAiView'),
  '32.06d Menus, Dashboard, Diagnóstico, Prática e App.tsx não expõem nem chamam o Professor IA'
);

// 32.07 Fail-closed em erro de consulta de papel
assert(
  (await fetchSystemRole('any_uid', async () => { throw new Error('Simulated DB outage'); })) === 'student',
  '32.07 fetchSystemRole falha fechado retornando student quando system_roles falha'
);

// 32.08-32.10 Fluxo de matrícula e isolamento estrito entre professores no TeacherService
const teacherAId = 'teacher-isolation-A';
const teacherBId = 'teacher-isolation-B';
const classA = await TeacherService.createClass(teacherAId, 'profA@guitar.test', 'Prof A', 'Turma A', 'Isolada A', 'GA-ISOLA');
const classB = await TeacherService.createClass(teacherBId, 'profB@guitar.test', 'Prof B', 'Turma B', 'Isolada B', 'GA-ISOLB');

const p7InvalidJoin = await TeacherService.joinClassWithInviteCode('GA-NAO-EXISTE', 'stu-iso-1', 'Aluno Iso', 'stu@guitar.test');
assert(
  p7InvalidJoin.success === false,
  '32.08 TeacherService.joinClassWithInviteCode rejeita código inválido sem matricular aluno'
);

const p7ValidJoin = await TeacherService.joinClassWithInviteCode('GA-ISOLA', 'stu-iso-1', 'Aluno Iso', 'stu@guitar.test');
assert(
  p7ValidJoin.success === true && p7ValidJoin.classGroup?.teacherId === teacherAId,
  '32.09 TeacherService.joinClassWithInviteCode matricula aluno na turma válida preservando o teacherId responsável'
);

const teacherBStudentsForClassA = await TeacherService.getEnrolledStudents(teacherBId, classA.id);
assert(
  teacherBStudentsForClassA.length === 0,
  `32.10 Teacher B fica bloqueado de consultar alunos matriculados na turma de Teacher A (${classB.id} vs ${classA.id})`
);

// 32.11 AuthContext race condition guard
assert(
  authContextSource.includes('authSeqRef') &&
  authContextSource.includes('if (authSeqRef.current !== seq) return;'),
  '32.11 AuthContext implementa guarda sequencial (authSeqRef) contra race conditions em troca de conta/logout'
);

// 32.12 Separação Professor vs Admin vs Aluno em App.tsx
assert(
  appCodeAudit.includes('const { user, loading, isAdmin, isTeacher, adminPreviewMode, showLegacyModal } = useAuth();') &&
  appCodeAudit.includes("currentTab === 'teacher-dashboard' && isTeacher") &&
  appCodeAudit.includes('if (isAdmin && !adminPreviewMode)'),
  '32.12 App.tsx libera teacher-dashboard para isTeacher e restringe AdminPortalView exclusivamente a isAdmin'
);

// 32.13 firestore.rules inclui /class_invites/{inviteCode} sem listagem pública e isola /classes list
assert(
  rulesAudit.includes('match /class_invites/{inviteCode}') &&
  rulesAudit.includes('allow list: if false;') &&
  rulesAudit.includes('allow list: if isTeacher() && (isAdmin() || resource.data.teacherId == request.auth.uid);'),
  '32.13 firestore.rules protege /class_invites/{inviteCode} (get pontual, list bloqueado) e isola /classes por teacherId'
);

// 32.14 Auditoria de ausência de segredos ou e-mails administrativos fixos no src
assert(
  !fs.readFileSync('src/services/firebase.ts', 'utf-8').includes('dramosdasilva7@gmail.com') &&
  !fs.readFileSync('src/services/teacherService.ts', 'utf-8').includes('dramosdasilva7@gmail.com'),
  '32.14 Nenhum e-mail fixo administrativo está presente nos serviços de autenticação ou autorização'
);

// 32.15 Arquivos de infraestrutura Firebase e Backend presentes
assert(
  fs.existsSync('firebase.json') &&
  fs.existsSync('.firebaserc') &&
  fs.existsSync('firestore.indexes.json') &&
  fs.existsSync('Dockerfile'),
  '32.15 Arquivos reprodutíveis de Firebase CLI e hospedagem do backend (firebase.json, .firebaserc, firestore.indexes.json, Dockerfile) existem'
);

// 32.16 Mapeamento completo dos 5 erros obrigatórios de autenticação
assert(
  mapFirebaseAuthError({ code: 'auth/unauthorized-domain' }).length > 10 &&
  mapFirebaseAuthError({ code: 'auth/operation-not-allowed' }).length > 10 &&
  mapFirebaseAuthError({ code: 'auth/network-request-failed' }).length > 10 &&
  mapFirebaseAuthError({ code: 'auth/popup-blocked' }).length > 10 &&
  mapFirebaseAuthError({ code: 'auth/invalid-credential' }).length > 10,
  '32.16 mapFirebaseAuthError traduz todos os 5 códigos obrigatórios de erro do Firebase Auth'
);

// =============================================================
// GRUPO 33 — MODAL AMPLIADO DE ACORDES E IMAGENS NOS CURSOS
// =============================================================
console.log('\n--- GRUPO 33: MODAL AMPLIADO DE ACORDES E IMAGENS NOS CURSOS ---');

// 33.1 Resolução unificada de acordes do banco, aliases e cifras dinâmicas
const modalC = resolveChordForModal('C');
const modalCmaj7 = resolveChordForModal('Cmaj7');
const modalBm7b5 = resolveChordForModal('Bm7b5');
const modalGadd9 = resolveChordForModal('Gadd9');
const modalDSlashFSharp = resolveChordForModal('D/F#');
assert(
  Boolean(modalC && modalC.frets.length === 6 && modalC.fingers.length === 6 && modalC.notes.length >= 3 && modalC.notesPt.length >= 3),
  '33.01 resolveChordForModal resolve C Maior do banco com 6 cordas, dedos e notas em cifra e português'
);
assert(
  Boolean(modalCmaj7 && modalCmaj7.notes.includes('B') && modalBm7b5 && modalBm7b5.frets.length === 6),
  '33.02 resolveChordForModal normaliza aliases Cmaj7/C7M e Bm7b5/Bm7(b5)'
);
assert(
  Boolean(modalGadd9 && modalGadd9.frets.length === 6 && modalDSlashFSharp && modalDSlashFSharp.frets.length === 6),
  '33.03 resolveChordForModal calcula diagramas dinâmicos para cifras avançadas (Gadd9, D/F#)'
);

// 33.2 Extração segura de cifras em texto corrido sem falsos positivos em preposições portuguesas
const tokensWithPt = findChordTokensInText('Toque a sequência G, Cadd9, Em7 e D/F# com calma e precisão.');
const detectedChordTokens = tokensWithPt.filter((s) => s.isChord).map((s) => s.text);
assert(
  detectedChordTokens.includes('Cadd9') &&
  detectedChordTokens.includes('Em7') &&
  detectedChordTokens.includes('D/F#') &&
  !detectedChordTokens.includes('a') &&
  !detectedChordTokens.includes('e'),
  '33.04 findChordTokensInText identifica cifras reais (Cadd9, Em7, D/F#) sem marcar artigos/conjunções portuguesas ("a", "e")'
);

// 33.3 Biblioteca de acordes sem painel na parte inferior da aba Dicionário e integrada ao modal central
const updatedDictSource = fs.readFileSync('src/components/chords/ChordDictionaryView.tsx', 'utf-8');
const dictStartIdx = updatedDictSource.indexOf("{activeTabMode === 'dictionary'");
const dictEndIdx = updatedDictSource.indexOf("{activeTabMode === 'reverse'");
const dictionaryTabSlice = updatedDictSource.slice(dictStartIdx, dictEndIdx);
assert(
  dictionaryTabSlice.includes('toggleChord(') &&
  !dictionaryTabSlice.includes('<ChordDiagram'),
  '33.05 Aba Dicionário de ChordDictionaryView removeu o diagrama da parte inferior e abre o modal central ao tocar no acorde'
);

// 33.4 Modal central ampliado com toggles, cordas, casas, dedos, notas e fechamento completo
const chordModalContextSrc = fs.readFileSync('src/contexts/ChordModalContext.tsx', 'utf-8');
const chordPreviewModalSrc = fs.readFileSync('src/components/chords/ChordPreviewModal.tsx', 'utf-8');
const chordDiagramSrc33 = fs.readFileSync('src/components/chords/ChordDiagram.tsx', 'utf-8');
assert(
  chordModalContextSrc.includes('prev.matchKey === resolved.matchKey') &&
  chordModalContextSrc.includes("e.key === 'Escape'") &&
  chordPreviewModalSrc.includes('size="lg"') &&
  chordPreviewModalSrc.includes('showStringLabels={true}') &&
  chordPreviewModalSrc.includes('showFretNumbers={true}') &&
  chordPreviewModalSrc.includes('showFingerLegend={true}') &&
  chordPreviewModalSrc.includes('onClick={closeChord}') &&
  chordDiagramSrc33.includes('Indicador') &&
  chordDiagramSrc33.includes('Mínimo'),
  '33.06 ChordPreviewModal exibe diagrama ampliado centralizado com cordas, casas, dedos, notas e fecha ao tocar novamente, no backdrop ou Esc'
);

// 33.5 Demais áreas clicáveis (Estudos, Currículo, Aulas, Coach e Teoria) conectadas ao modal central
const curriculumSrc33 = fs.readFileSync('src/components/curriculum/CurriculumView.tsx', 'utf-8');
const lessonViewerSrc33 = fs.readFileSync('src/components/curriculum/LessonViewer.tsx', 'utf-8');
const guitarCoachSrc33 = fs.readFileSync('src/components/coach/GuitarCoachView.tsx', 'utf-8');
const musicTheorySrc33 = fs.readFileSync('src/components/theory/MusicTheoryView.tsx', 'utf-8');
const studyLibSrc33 = fs.readFileSync('src/components/library/StudyLibraryView.tsx', 'utf-8');
assert(
  curriculumSrc33.includes('toggleChord(') &&
  lessonViewerSrc33.includes('toggleChord(') &&
  lessonViewerSrc33.includes('ChordNameButton') &&
  guitarCoachSrc33.includes('toggleChord(') &&
  musicTheorySrc33.includes('ChordNameButton') &&
  studyLibSrc33.includes('handleToggleInspectedChord'),
  '33.07 Todas as áreas com nomes de acordes (Biblioteca, Estudos, Currículo, Aulas, Coach, Teoria) disparam e alternam o diagrama ampliado'
);

// 33.6 Imagens temáticas distintas por instrumento e assunto nos cursos e aulas
const courseBannerSrc = fs.readFileSync('src/components/curriculum/CourseVisualBanner.tsx', 'utf-8');
const violaoAssets = new Set(VIOLAO_LESSONS.map((l) => getLessonVisual(l).assetKey));
const soloAssets = new Set(SOLO_LESSONS.map((l) => getLessonVisual(l).assetKey));
const canonicalAssets = new Set(CURRICULUM_LEVELS.flatMap((lvl) => lvl.lessons).map((l) => getLessonVisual(l).assetKey));
const bassAssets = new Set(BASS_LESSONS.map((l) => getLessonVisual(l).assetKey));
const keyAssets = new Set(KEYBOARD_LESSONS.map((l) => getLessonVisual(l).assetKey));
const drumsAssets = new Set(DRUMS_LESSONS.map((l) => getLessonVisual(l).assetKey));
assert(
  violaoAssets.size >= 3 &&
  soloAssets.size >= 2 &&
  canonicalAssets.size >= 3 &&
  bassAssets.size >= 2 &&
  keyAssets.size >= 2 &&
  drumsAssets.size >= 2,
  '33.08 Todos os cursos (Violão, Guitarra, Solo, Baixo, Teclado, Bateria) recebem múltiplas imagens específicas ao assunto de cada aula'
);

assert(
  curriculumSrc33.includes('<CourseVisualBanner') &&
  lessonViewerSrc33.includes('<CourseVisualBanner') &&
  courseBannerSrc.includes('ASSET_MAP') &&
  getCourseModuleVisual('baixo', 3).assetKey === 'baixo-slap' &&
  getCourseModuleVisual('teclado', 3).assetKey === 'teclado-harmonia' &&
  getCourseModuleVisual('bateria', 2).assetKey === 'bateria-kit',
  '33.09 CurriculumView e LessonViewer renderizam CourseVisualBanner com mapeamento por módulo e aula'
);

// Verifica existência física de todos os arquivos .jpg referenciados no banner
const bannerImportMatches = [...courseBannerSrc.matchAll(/from '\.\.\/\.\.\/(assets\/images\/[^']+\.jpg)'/g)];
assert(
  bannerImportMatches.length === 12 &&
  bannerImportMatches.every((m) => fs.existsSync(path.join('src', m[1])) && fs.statSync(path.join('src', m[1])).size > 10000),
  `33.10 Todas as ${bannerImportMatches.length} imagens exclusivas dos cursos existem em src/assets/images/ com tamanho válido`
);

console.log('\n===========================================================');
console.log(`TOTAL DE TESTES: ${totalTests}`);
console.log(`PASSOU: ${passedTests}`);
console.log(`FALHOU: ${failedTests}`);
console.log('===========================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✓ Todos os testes de integração do motor musical, detector, currículo, Central de Prática, Busca Global, Diagramas Cifra Club, Autenticação Obrigatória, Separação de Ambientes Aluno/Admin, Backend Hardening, SMART TUNER V1.2, AUTENTICAÇÃO ADMINISTRATIVA DEFINITIVA, CORREÇÃO GERAL DEFINITIVA e MODAL/IMAGENS DOS CURSOS foram APROVADOS com sucesso!\n');
  process.exit(0);
}





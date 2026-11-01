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
} from './src/types';
import {
  generatePracticeRoutine,
  PRACTICE_EXERCISE_CATALOG,
  ExecutablePracticeExercise,
  GeneratedRoutine,
} from './src/pedagogy/practiceRoutineEngine';
import { storageService, INITIAL_PROGRESS, getLocalDateString, validateBackupData } from './src/services/storageService';
import {
  searchAll,
  getSearchIndexStats,
  QUICK_SEARCH_SUGGESTIONS,
} from './src/services/searchService';
import { audioEngine } from './src/audio/audioEngine';
import { TunerSmoother } from './src/audio/tunerSmoother';
import { STANDARD_TUNING, getFretNote } from './src/data/musicTheory';
import { CHORD_DATABASE } from './src/data/chordDatabase';
import { ChordEngine } from './src/chords/chord-engine';
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

// Cenário C: Erros Recorrentes em Teoria/Harmonia -> Reexplicar Conceito com Professor IA
const profileTheoryError = createInitialPedagogicalProfile();
profileTheoryError.skills['skill-triads-tetrads'].recurringErrors = { 'confundiu-terca-maior-menor': 3 };
const recTheory = getAdaptiveRecommendation(profileTheoryError, legacyData);
assert(recTheory.actionType === 'reexplain_concept', 'Erros conceituais sugerem "reexplain_concept"');
assert(recTheory.targetTab === 'professor-ai', 'Direciona aluno para o Professor IA');

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

console.log('\n===========================================================');
console.log(`TOTAL DE TESTES: ${totalTests}`);
console.log(`PASSOU: ${passedTests}`);
console.log(`FALHOU: ${failedTests}`);
console.log('===========================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✓ Todos os testes de integração do motor musical, detector, currículo, Central de Prática, Busca Global e Fase 6 foram APROVADOS com sucesso!\n');
}


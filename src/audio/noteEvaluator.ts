// =============================================================
// GUITAR ACADEMY — AVALIADOR MUSICAL DE EXERCÍCIOS (V2.1)
// src/audio/noteEvaluator.ts
//
// Camada separada do afinador visual (TunerSmoother):
// Avalia execuções musicais de estudantes em 3 vereditos claros:
//   - CORRECT      (nota esperada confirmada com estabilidade)
//   - INCORRECT    (nota diferente efetivamente reconhecida com estabilidade)
//   - INCONCLUSIVE (silêncio, ruído, sinal fraco, polifonia, ataque transitório,
//                   oscilação excessiva, baixa confiança ou leitura isolada)
//
// REGRA ABSOLUTA:
// Leituras não reconhecidas ou inconclusivas NUNCA penalizam o estudante,
// nunca decrementam acurácia/pontuação e nunca gravam erros falsos.
// =============================================================

import {
  PitchDetectionResult,
  normalizeNoteName
} from './guitarPitchDetector';

export type EvaluationVerdict = 'CORRECT' | 'INCORRECT' | 'INCONCLUSIVE';

export type EvaluationReason =
  | 'confirmed_match'
  | 'wrong_note'
  | 'wrong_octave'
  | 'out_of_tune'
  | 'silence'
  | 'noise_or_unidentified'
  | 'weak_signal'
  | 'polyphonic_ambiguous'
  | 'attack_transient'
  | 'excessive_oscillation'
  | 'low_confidence'
  | 'out_of_range'
  | 'insufficient_frames';

export interface NoteEvaluatorOptions {
  toleranceCents?: number; // Padrão ±35 cents
  minConfidence?: number; // Padrão 0.65
  requiredConsecutiveCorrectFrames?: number; // Padrão 3 quadros estáveis
  requiredConsecutiveWrongFrames?: number; // Padrão 3 quadros estáveis
  maxOscillationCents?: number; // Padrão 25 cents de oscilação máxima na janela
  ignoreAttackTransients?: boolean; // Padrão true
  expectedOctave?: number | null; // Quando null/undefined, aceita oitavas válidas
  minPlausibleOctave?: number; // Padrão 1 (contrabaixo/violão)
  maxPlausibleOctave?: number; // Padrão 6
}

export interface NoteEvaluationResult {
  verdict: EvaluationVerdict;
  reason: EvaluationReason;
  shouldCountHit: boolean;
  shouldCountError: boolean;
  detectedNote: string | null;
  detectedOctave: number | null;
  rawCents: number;
  cents: number;
  confidence: number;
  stableFrameCount: number;
  message: string;
}

export class ExerciseNoteEvaluator {
  private readonly defaultOptions: Required<Omit<NoteEvaluatorOptions, 'expectedOctave'>> & {
    expectedOctave?: number | null;
  };

  private correctStreakNote: string | null = null;
  private correctStreakCount = 0;

  private wrongStreakNote: string | null = null;
  private wrongStreakCount = 0;

  private recentCentsWindow: number[] = [];

  constructor(options: NoteEvaluatorOptions = {}) {
    this.defaultOptions = {
      toleranceCents: options.toleranceCents ?? 35,
      minConfidence: options.minConfidence ?? 0.65,
      requiredConsecutiveCorrectFrames: Math.max(1, options.requiredConsecutiveCorrectFrames ?? 3),
      requiredConsecutiveWrongFrames: Math.max(1, options.requiredConsecutiveWrongFrames ?? 3),
      maxOscillationCents: options.maxOscillationCents ?? 25,
      ignoreAttackTransients: options.ignoreAttackTransients ?? true,
      expectedOctave: options.expectedOctave,
      minPlausibleOctave: options.minPlausibleOctave ?? 1,
      maxPlausibleOctave: options.maxPlausibleOctave ?? 6
    };
  }

  reset(): void {
    this.correctStreakNote = null;
    this.correctStreakCount = 0;
    this.wrongStreakNote = null;
    this.wrongStreakCount = 0;
    this.recentCentsWindow = [];
  }

  private clearStreaks(): void {
    this.correctStreakNote = null;
    this.correctStreakCount = 0;
    this.wrongStreakNote = null;
    this.wrongStreakCount = 0;
  }

  evaluateFrame(
    pitch: PitchDetectionResult | null,
    expectedNotesRaw: string[],
    overrideOptions?: NoteEvaluatorOptions
  ): NoteEvaluationResult {
    const opts = {
      ...this.defaultOptions,
      ...(overrideOptions || {})
    };

    const expectedNotes = Array.from(
      new Set(expectedNotesRaw.map(normalizeNoteName).filter(Boolean))
    );

    if (!pitch || pitch.isSilence || pitch.detectionType === 'silence') {
      this.clearStreaks();
      this.recentCentsWindow = [];
      return {
        verdict: 'INCONCLUSIVE',
        reason: 'silence',
        shouldCountHit: false,
        shouldCountError: false,
        detectedNote: null,
        detectedOctave: null,
        rawCents: 0,
        cents: 0,
        confidence: 0,
        stableFrameCount: 0,
        message: 'Aguardando som do instrumento...'
      };
    }

    if (pitch.detectionType === 'polyphonic_ambiguous') {
      this.clearStreaks();
      this.recentCentsWindow = [];
      return {
        verdict: 'INCONCLUSIVE',
        reason: 'polyphonic_ambiguous',
        shouldCountHit: false,
        shouldCountError: false,
        detectedNote: null,
        detectedOctave: null,
        rawCents: 0,
        cents: 0,
        confidence: 0,
        stableFrameCount: 0,
        message: pitch.polyphonicWarning || 'Várias notas simultâneas — toque uma corda de cada vez.'
      };
    }

    const conf = pitch.confidence ?? 0;

    if (
      pitch.detectionType !== 'monophonic_note' ||
      pitch.isWeakSignal ||
      !pitch.note ||
      pitch.frequency <= 0 ||
      pitch.isReliable === false
    ) {
      this.clearStreaks();
      this.recentCentsWindow = [];
      return {
        verdict: 'INCONCLUSIVE',
        reason: pitch.detectionType === 'weak_signal' ? 'weak_signal' : 'noise_or_unidentified',
        shouldCountHit: false,
        shouldCountError: false,
        detectedNote: null,
        detectedOctave: null,
        rawCents: 0,
        cents: 0,
        confidence: conf,
        stableFrameCount: 0,
        message: 'Não foi possível identificar a nota'
      };
    }

    if (conf < opts.minConfidence) {
      this.clearStreaks();
      return {
        verdict: 'INCONCLUSIVE',
        reason: 'low_confidence',
        shouldCountHit: false,
        shouldCountError: false,
        detectedNote: null,
        detectedOctave: null,
        rawCents: 0,
        cents: 0,
        confidence: conf,
        stableFrameCount: 0,
        message: 'Não foi possível identificar a nota'
      };
    }

    // Ignora transientes de ataque antes que a corda estabilize
    if (opts.ignoreAttackTransients && (pitch.isTransientContaminated || pitch.signalPhase === 'attack')) {
      this.clearStreaks();
      return {
        verdict: 'INCONCLUSIVE',
        reason: 'attack_transient',
        shouldCountHit: false,
        shouldCountError: false,
        detectedNote: null,
        detectedOctave: null,
        rawCents: 0,
        cents: 0,
        confidence: conf,
        stableFrameCount: 0,
        message: 'Ataque inicial — aguardando estabilização da nota...'
      };
    }

    if (
      pitch.octave !== null &&
      (pitch.octave < opts.minPlausibleOctave || pitch.octave > opts.maxPlausibleOctave)
    ) {
      this.clearStreaks();
      return {
        verdict: 'INCONCLUSIVE',
        reason: 'out_of_range',
        shouldCountHit: false,
        shouldCountError: false,
        detectedNote: null,
        detectedOctave: pitch.octave,
        rawCents: 0,
        cents: 0,
        confidence: conf,
        stableFrameCount: 0,
        message: 'Não foi possível identificar a nota'
      };
    }

    const rawCents = pitch.rawCents !== undefined ? pitch.rawCents : pitch.cents;
    const roundedCents = Math.round(rawCents);
    const normDetected = normalizeNoteName(pitch.note);

    // Monitora oscilação excessiva recente
    this.recentCentsWindow.push(rawCents);
    if (this.recentCentsWindow.length > 4) {
      this.recentCentsWindow.shift();
    }
    if (this.recentCentsWindow.length >= 3) {
      const spread = Math.max(...this.recentCentsWindow) - Math.min(...this.recentCentsWindow);
      if (spread > opts.maxOscillationCents) {
        this.clearStreaks();
        return {
          verdict: 'INCONCLUSIVE',
          reason: 'excessive_oscillation',
          shouldCountHit: false,
          shouldCountError: false,
          detectedNote: normDetected,
          detectedOctave: pitch.octave,
          rawCents,
          cents: roundedCents,
          confidence: conf,
          stableFrameCount: 0,
          message: 'Sinal oscilando — mantenha a nota sustentada e limpa.'
        };
      }
    }

    const inExpectedSet = expectedNotes.includes(normDetected);

    // Nota não pertence às notas esperadas -> acumula evidência antes de marcar erro real
    if (!inExpectedSet) {
      this.correctStreakNote = null;
      this.correctStreakCount = 0;

      if (this.wrongStreakNote === normDetected) {
        this.wrongStreakCount++;
      } else {
        this.wrongStreakNote = normDetected;
        this.wrongStreakCount = 1;
      }

      if (this.wrongStreakCount < opts.requiredConsecutiveWrongFrames) {
        return {
          verdict: 'INCONCLUSIVE',
          reason: 'insufficient_frames',
          shouldCountHit: false,
          shouldCountError: false,
          detectedNote: normDetected,
          detectedOctave: pitch.octave,
          rawCents,
          cents: roundedCents,
          confidence: conf,
          stableFrameCount: this.wrongStreakCount,
          message: `Analisando altura (${normDetected}${pitch.octave ?? ''})...`
        };
      }

      return {
        verdict: 'INCORRECT',
        reason: 'wrong_note',
        shouldCountHit: false,
        shouldCountError: true,
        detectedNote: normDetected,
        detectedOctave: pitch.octave,
        rawCents,
        cents: roundedCents,
        confidence: conf,
        stableFrameCount: this.wrongStreakCount,
        message: `Nota diferente detectada: ${normDetected}${pitch.octave ?? ''} (${pitch.frequency.toFixed(1)} Hz) — esperado [${expectedNotes.join(', ')}]`
      };
    }

    // Verifica oitava específica quando exigida pelo exercício
    if (
      opts.expectedOctave !== undefined &&
      opts.expectedOctave !== null &&
      pitch.octave !== null &&
      pitch.octave !== opts.expectedOctave
    ) {
      this.correctStreakNote = null;
      this.correctStreakCount = 0;
      const wrongKey = `${normDetected}${pitch.octave}`;
      if (this.wrongStreakNote === wrongKey) {
        this.wrongStreakCount++;
      } else {
        this.wrongStreakNote = wrongKey;
        this.wrongStreakCount = 1;
      }

      if (this.wrongStreakCount < opts.requiredConsecutiveWrongFrames) {
        return {
          verdict: 'INCONCLUSIVE',
          reason: 'insufficient_frames',
          shouldCountHit: false,
          shouldCountError: false,
          detectedNote: normDetected,
          detectedOctave: pitch.octave,
          rawCents,
          cents: roundedCents,
          confidence: conf,
          stableFrameCount: this.wrongStreakCount,
          message: `Verificando oitava de ${normDetected}...`
        };
      }

      return {
        verdict: 'INCORRECT',
        reason: 'wrong_octave',
        shouldCountHit: false,
        shouldCountError: true,
        detectedNote: normDetected,
        detectedOctave: pitch.octave,
        rawCents,
        cents: roundedCents,
        confidence: conf,
        stableFrameCount: this.wrongStreakCount,
        message: `Oitava incorreta: detectado ${normDetected}${pitch.octave} (esperado ${normDetected}${opts.expectedOctave})`
      };
    }

    // Nota correta, mas fora da tolerância de afinação (não marca acerto nem penaliza como erro fatal)
    if (Math.abs(rawCents) > opts.toleranceCents) {
      this.clearStreaks();
      return {
        verdict: 'INCONCLUSIVE',
        reason: 'out_of_tune',
        shouldCountHit: false,
        shouldCountError: false,
        detectedNote: normDetected,
        detectedOctave: pitch.octave,
        rawCents,
        cents: roundedCents,
        confidence: conf,
        stableFrameCount: 0,
        message: `Nota ${normDetected} fora da tolerância (${roundedCents > 0 ? '+' : ''}${roundedCents}¢, limite ±${opts.toleranceCents}¢)`
      };
    }

    // Nota esperada dentro da tolerância -> confirma após quadros consecutivos estáveis
    this.wrongStreakNote = null;
    this.wrongStreakCount = 0;

    if (this.correctStreakNote === normDetected) {
      this.correctStreakCount++;
    } else {
      this.correctStreakNote = normDetected;
      this.correctStreakCount = 1;
    }

    if (this.correctStreakCount < opts.requiredConsecutiveCorrectFrames) {
      return {
        verdict: 'INCONCLUSIVE',
        reason: 'insufficient_frames',
        shouldCountHit: false,
        shouldCountError: false,
        detectedNote: normDetected,
        detectedOctave: pitch.octave,
        rawCents,
        cents: roundedCents,
        confidence: conf,
        stableFrameCount: this.correctStreakCount,
        message: `Estabilizando nota ${normDetected}${pitch.octave ?? ''}...`
      };
    }

    return {
      verdict: 'CORRECT',
      reason: 'confirmed_match',
      shouldCountHit: true,
      shouldCountError: false,
      detectedNote: normDetected,
      detectedOctave: pitch.octave,
      rawCents,
      cents: roundedCents,
      confidence: conf,
      stableFrameCount: this.correctStreakCount,
      message: `Nota ${normDetected}${pitch.octave ?? ''} confirmada (${pitch.frequency.toFixed(1)} Hz)`
    };
  }
}

/**
 * Avalia uma sequência inteira de quadros de áudio sem penalizar quadros inconclusivos.
 */
export function evaluatePitchFrameSequence(
  frames: Array<PitchDetectionResult | null>,
  expectedNotesRaw: string[],
  options: NoteEvaluatorOptions = {}
): {
  finalResult: NoteEvaluationResult;
  correctCount: number;
  incorrectCount: number;
  inconclusiveCount: number;
} {
  const evaluator = new ExerciseNoteEvaluator(options);
  let correctCount = 0;
  let incorrectCount = 0;
  let inconclusiveCount = 0;
  let lastResult: NoteEvaluationResult = evaluator.evaluateFrame(null, expectedNotesRaw);

  for (const frame of frames) {
    lastResult = evaluator.evaluateFrame(frame, expectedNotesRaw);
    if (lastResult.verdict === 'CORRECT' && lastResult.shouldCountHit) {
      correctCount++;
    } else if (lastResult.verdict === 'INCORRECT' && lastResult.shouldCountError) {
      incorrectCount++;
    } else {
      inconclusiveCount++;
    }
  }

  return {
    finalResult: lastResult,
    correctCount,
    incorrectCount,
    inconclusiveCount
  };
}

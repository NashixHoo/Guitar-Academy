// =============================================================
// GUITAR ACADEMY / VIRTUO AFINADOR PRO: ENGINE DE SUAVIZAÇÃO MATEMÁTICA V2.1
// src/audio/tunerSmoother.ts
//
// 1. Filtro de Mediana Móvel (janela configurável) + Rejeição de Outliers
// 2. Exponential Moving Average (EMA) adaptativo em ponto flutuante (sem arredondamento precoce)
// 3. Zona de Estabilidade Central (Dead Zone ±2 cents, High-Precision ±5 cents)
// 4. Histerese anti-tremor entre notas + reset controlado de histórico na troca de nota
// 5. Confirmação multi-leitura antes de IN_TUNE e rejeição de transientes de ataque
// 6. 5 estágios explícitos: detected | stabilizing | stable | in_tune | inconclusive
// =============================================================

import { PitchDetectionResult } from './guitarPitchDetector';

export const TUNER_STATES = {
  IDLE: 'idle',
  WAITING_SOUND: 'waiting_sound',
  WEAK_SIGNAL: 'weak_signal',
  OUT_OF_TUNE: 'out_of_tune',
  NEAR_TUNE: 'near_tune',
  IN_TUNE: 'in_tune'
} as const;

export type TunerState = typeof TUNER_STATES[keyof typeof TUNER_STATES];

export type TunerStage =
  | 'detected'
  | 'stabilizing'
  | 'stable'
  | 'in_tune'
  | 'inconclusive';

export interface TunerSmoothedOutput {
  displayedCents: number; // Arredondado apenas para leitura numérica visual (1 casa)
  rawDisplayedCents: number; // Valor contínuo em ponto flutuante sem arredondamento
  displayedFreq: number;
  displayedAngle: number;
  displayedDiffHz: number;
  note: string | null;
  notePt: string | null;
  octave: number | null;
  state: TunerState;
  tunerStage: TunerStage;
  isInTune: boolean;
  isNearTune: boolean;
  isWeakSignal: boolean;
  isPolyphonic: boolean;
  isTransient: boolean;
  confidence: number;
  signalIntensity: number;
  stability: number;
  expectedFreq: number;
  stableFramesCount: number;
}

export interface TunerSmootherOptions {
  confidenceThreshold?: number;
  alpha?: number;
  inTuneTolerance?: number; // Cents (padrão 5.0)
  nearTuneTolerance?: number; // Cents (padrão 15.0)
  deadZone?: number; // Cents (padrão 2.0)
  minStableReadingsForInTune?: number; // Leituras consecutivas para confirmar IN_TUNE
  medianWindowSize?: number; // Janela da mediana móvel (padrão 5)
  outlierThresholdCents?: number; // Desvio máximo contra mediana para rejeitar salto isolado
}

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export class TunerSmoother {
  private alphaStandard = 0.28; // Resposta viva e ágil do ponteiro
  private alphaNear = 0.18; // ±2 a ±5 cents (suavização precisa de aproximação)
  private alphaDeadZone = 0.08; // ±2 cents (parada estável no centro)

  private inTuneTolerance = 5.0; // ±5 cents para afinação confirmada
  private nearTuneTolerance = 15.0; // ±15 cents para proximidade
  private deadZone = 2.0; // ±2 cents para zona morta

  private medianWindowSize = 5;
  private outlierThresholdCents = 22.0;
  private minStableReadingsForInTune: number;
  private explicitMinReadingsConfigured: boolean;

  private displayedCents = 0;
  private displayedFreq = 0;
  private displayedAngle = 0;
  private displayedDiffHz = 0;

  private targetCents = 0;
  private targetFreq = 0;
  private targetDiffHz = 0;
  private targetNote: string | null = null;
  private targetNotePt: string | null = null;
  private targetOctave: number | null = null;
  private targetExpectedFreq = 0;
  private targetConfidence = 0;
  private targetIntensity = 0;
  private targetStability = 0;
  private targetTransient = false;
  private targetPolyphonic = false;

  // Janela de mediana móvel + rejeição de picos isolados
  private centsMedianWindow: number[] = [];
  private outlierStreak = 0;

  // Histerese de nota para evitar oscilação visual
  private activeNote: string | null = null;
  private activeOctave: number | null = null;
  private candidateNote: string | null = null;
  private candidateOctave: number | null = null;
  private candidateFrames = 0;
  private readonly requiredCandidateFrames = 2;

  private noteTransitionStartTime = 0;
  private maxTransitionDuration = 180; // ms
  private isInTransition = false;

  private confidenceThreshold: number;
  private lastConfidentTime = 0;
  private silenceGracePeriodMs = 380;
  private isWeakSignal = false;
  private currentState: TunerState = TUNER_STATES.IDLE;
  private currentStage: TunerStage = 'inconclusive';
  private lastFrameTime = performance.now();

  private consecutiveValidReadings = 0;
  private consecutiveInTuneReadings = 0;
  private stableInTuneCount = 0;

  constructor(options: TunerSmootherOptions = {}) {
    this.confidenceThreshold = options.confidenceThreshold !== undefined ? options.confidenceThreshold : 0.58;
    if (options.alpha !== undefined) this.alphaStandard = options.alpha;
    if (options.inTuneTolerance !== undefined) this.inTuneTolerance = options.inTuneTolerance;
    if (options.nearTuneTolerance !== undefined) this.nearTuneTolerance = options.nearTuneTolerance;
    if (options.deadZone !== undefined) this.deadZone = options.deadZone;
    if (options.medianWindowSize !== undefined) this.medianWindowSize = Math.max(3, options.medianWindowSize);
    if (options.outlierThresholdCents !== undefined) this.outlierThresholdCents = Math.max(8, options.outlierThresholdCents);
    this.explicitMinReadingsConfigured = options.minStableReadingsForInTune !== undefined;
    this.minStableReadingsForInTune = Math.max(1, options.minStableReadingsForInTune ?? 1);
  }

  setTolerance(inTuneCents: number, nearTuneCents = 15.0): void {
    this.inTuneTolerance = Math.max(1.0, inTuneCents);
    this.nearTuneTolerance = Math.max(this.inTuneTolerance + 2, nearTuneCents);
  }

  getTolerance(): { inTune: number; nearTune: number; deadZone: number } {
    return {
      inTune: this.inTuneTolerance,
      nearTune: this.nearTuneTolerance,
      deadZone: this.deadZone
    };
  }

  reset(): void {
    this.displayedCents = 0;
    this.displayedFreq = 0;
    this.displayedAngle = 0;
    this.displayedDiffHz = 0;
    this.targetCents = 0;
    this.targetFreq = 0;
    this.targetDiffHz = 0;
    this.targetNote = null;
    this.targetNotePt = null;
    this.targetOctave = null;
    this.targetExpectedFreq = 0;
    this.targetConfidence = 0;
    this.targetIntensity = 0;
    this.targetStability = 0;
    this.targetTransient = false;
    this.targetPolyphonic = false;
    this.centsMedianWindow = [];
    this.outlierStreak = 0;
    this.activeNote = null;
    this.activeOctave = null;
    this.candidateNote = null;
    this.candidateOctave = null;
    this.candidateFrames = 0;
    this.isInTransition = false;
    this.isWeakSignal = false;
    this.currentState = TUNER_STATES.IDLE;
    this.currentStage = 'inconclusive';
    this.consecutiveValidReadings = 0;
    this.consecutiveInTuneReadings = 0;
    this.stableInTuneCount = 0;
  }

  feedPitch(pitch: PitchDetectionResult | null, timestamp: number | null = null): void {
    const now = timestamp !== null ? timestamp : performance.now();

    if (!pitch || pitch.isSilence || pitch.frequency === 0 || !pitch.note) {
      if (pitch) {
        this.targetIntensity = pitch.intensity ?? 0;
      }
      if (now - this.lastConfidentTime > this.silenceGracePeriodMs) {
        this.currentState = TUNER_STATES.WAITING_SOUND;
        this.consecutiveInTuneReadings = 0;
        this.consecutiveValidReadings = 0;
      }
      if (pitch && pitch.detectionType === 'polyphonic_ambiguous') {
        this.isWeakSignal = true;
        this.targetPolyphonic = true;
        this.currentState = TUNER_STATES.WEAK_SIGNAL;
        this.consecutiveInTuneReadings = 0;
      } else if (pitch && (pitch.detectionType === 'noise_or_unidentified' || pitch.detectionType === 'weak_signal')) {
        this.isWeakSignal = true;
        this.targetPolyphonic = false;
        this.currentState = TUNER_STATES.WEAK_SIGNAL;
        this.consecutiveInTuneReadings = 0;
      } else {
        this.targetPolyphonic = false;
      }
      return;
    }

    const confidence = pitch.confidence !== undefined ? pitch.confidence : 0;
    this.targetIntensity = pitch.intensity ?? 0;

    // Exige detecção monofônica válida acima do limiar de confiança
    if (
      pitch.detectionType !== 'monophonic_note' ||
      pitch.isReliable === false ||
      confidence < this.confidenceThreshold ||
      pitch.isWeakSignal
    ) {
      this.isWeakSignal = true;
      this.targetPolyphonic = false;
      this.currentState = TUNER_STATES.WEAK_SIGNAL;
      this.consecutiveInTuneReadings = 0;
      return;
    }

    this.isWeakSignal = false;
    this.targetPolyphonic = false;
    this.lastConfidentTime = now;

    // Preserva precisão em ponto flutuante (usa rawCents sempre que disponível)
    const exactRawCents = pitch.rawCents !== undefined ? pitch.rawCents : (pitch.cents ?? 0);
    const clampedIncomingCents = Math.max(-50, Math.min(50, exactRawCents));
    const exactDiffHz = pitch.exactDiffHz !== undefined
      ? pitch.exactDiffHz
      : (pitch.diffHz !== undefined ? pitch.diffHz : (pitch.frequency - pitch.expectedFreq));
    const exactExpectedFreq = pitch.exactExpectedFreq ?? pitch.expectedFreq;

    const incomingNoteId = `${pitch.note}${pitch.octave !== null ? pitch.octave : ''}`;
    const activeNoteId = `${this.activeNote}${this.activeOctave !== null ? this.activeOctave : ''}`;
    const isTransient = Boolean(pitch.isTransientContaminated || pitch.signalPhase === 'attack');
    this.targetTransient = isTransient;

    let isNoteAccepted = false;

    if (incomingNoteId === activeNoteId || this.activeNote === null) {
      this.activeNote = pitch.note;
      this.activeOctave = pitch.octave;
      this.candidateFrames = 0;
      this.candidateNote = null;
      this.targetNote = pitch.note;
      this.targetNotePt = pitch.notePt;
      this.targetOctave = pitch.octave;
      isNoteAccepted = true;
    } else {
      const candidateId = `${this.candidateNote}${this.candidateOctave !== null ? this.candidateOctave : ''}`;
      if (incomingNoteId === candidateId) {
        this.candidateFrames++;
        if (this.candidateFrames >= this.requiredCandidateFrames) {
          // Reset controlado do histórico na troca confirmada de nota
          this.activeNote = pitch.note;
          this.activeOctave = pitch.octave;
          this.targetNote = pitch.note;
          this.targetNotePt = pitch.notePt;
          this.targetOctave = pitch.octave;
          this.candidateFrames = 0;
          this.candidateNote = null;
          this.noteTransitionStartTime = now;
          this.isInTransition = true;

          this.centsMedianWindow = [];
          this.outlierStreak = 0;
          this.consecutiveValidReadings = 0;
          this.consecutiveInTuneReadings = 0;
          this.stableInTuneCount = 0;
          isNoteAccepted = true;
        }
      } else {
        this.candidateNote = pitch.note;
        this.candidateOctave = pitch.octave;
        this.candidateFrames = 1;
      }
    }

    if (!isNoteAccepted) {
      // Enquanto aguarda confirmação de troca de nota, mantém último alvo sem contaminar mediana
      return;
    }

    // Filtro de mediana móvel + rejeição de picos isolados (outliers)
    let smoothedSampleCents = clampedIncomingCents;
    if (this.centsMedianWindow.length >= 3) {
      const currentMedian = computeMedian(this.centsMedianWindow);
      if (Math.abs(clampedIncomingCents - currentMedian) > this.outlierThresholdCents && this.outlierStreak < 2) {
        // Pico isolado rejeitado (ex: ruído momentâneo / harmônico transitório)
        this.outlierStreak++;
        smoothedSampleCents = currentMedian;
      } else {
        if (this.outlierStreak >= 2) {
          // Mudança real confirmada: reinicia janela no novo patamar
          this.centsMedianWindow = [];
        }
        this.outlierStreak = 0;
        this.centsMedianWindow.push(clampedIncomingCents);
        if (this.centsMedianWindow.length > this.medianWindowSize) {
          this.centsMedianWindow.shift();
        }
        smoothedSampleCents = computeMedian(this.centsMedianWindow);
      }
    } else {
      this.outlierStreak = 0;
      this.centsMedianWindow.push(clampedIncomingCents);
      if (this.centsMedianWindow.length > this.medianWindowSize) {
        this.centsMedianWindow.shift();
      }
      smoothedSampleCents = computeMedian(this.centsMedianWindow);
    }

    this.targetFreq = pitch.frequency;
    this.targetConfidence = confidence;
    this.targetExpectedFreq = exactExpectedFreq;
    this.targetDiffHz = exactDiffHz;
    this.targetStability = pitch.stability ?? 75;
    this.targetCents = smoothedSampleCents;
    this.consecutiveValidReadings++;

    // Nunca aprova afinação durante transiente de ataque; exige leituras estáveis consecutivas
    const withinTol = Math.abs(this.targetCents) <= this.inTuneTolerance;
    const isPitchSteady = this.targetStability >= 70;
    if (!isTransient && withinTol && isPitchSteady) {
      this.consecutiveInTuneReadings++;
    } else {
      this.consecutiveInTuneReadings = 0;
    }
  }

  step(currentTime = performance.now()): TunerSmoothedOutput {
    const dt = Math.min(64, Math.max(1, currentTime - this.lastFrameTime));
    this.lastFrameTime = currentTime;

    const timeSinceLastSound = currentTime - this.lastConfidentTime;
    if (this.lastConfidentTime > 0 && timeSinceLastSound > this.silenceGracePeriodMs) {
      this.targetCents = 0;
      this.currentState = TUNER_STATES.WAITING_SOUND;
      this.stableInTuneCount = 0;
      this.consecutiveInTuneReadings = 0;
      if (timeSinceLastSound > this.silenceGracePeriodMs + 600) {
        this.targetNote = null;
        this.targetNotePt = null;
        this.targetOctave = null;
        this.activeNote = null;
        this.activeOctave = null;
        this.targetConfidence = 0;
        this.targetStability = 0;
        this.targetTransient = false;
        this.targetPolyphonic = false;
        this.centsMedianWindow = [];
        this.consecutiveValidReadings = 0;
      }
    }

    const absTarget = Math.abs(this.targetCents);
    let effectiveAlpha = this.alphaStandard;

    if (absTarget <= this.deadZone) {
      effectiveAlpha = this.alphaDeadZone;
      if (Math.abs(this.displayedCents - this.targetCents) < 0.25) {
        this.displayedCents = this.targetCents;
      }
    } else if (absTarget <= this.inTuneTolerance) {
      effectiveAlpha = this.alphaNear;
    } else {
      effectiveAlpha = this.alphaStandard;
    }

    if (this.isInTransition) {
      const elapsed = currentTime - this.noteTransitionStartTime;
      const progress = Math.min(1.0, elapsed / this.maxTransitionDuration);
      const easeFactor = 1 - Math.pow(1 - progress, 3);
      effectiveAlpha = effectiveAlpha * (0.4 + 0.6 * easeFactor);
      if (progress >= 1.0) {
        this.isInTransition = false;
      }
    }

    const fpsScale = dt / 16.666;
    const boundedAlpha = Math.max(0.01, Math.min(1.0, 1 - Math.pow(1 - effectiveAlpha, fpsScale)));
    this.displayedCents += boundedAlpha * (this.targetCents - this.displayedCents);

    if (this.targetFreq > 0 && this.targetNote) {
      if (this.displayedFreq === 0) {
        this.displayedFreq = this.targetFreq;
      } else {
        this.displayedFreq += boundedAlpha * (this.targetFreq - this.displayedFreq);
      }
      this.displayedDiffHz += boundedAlpha * (this.targetDiffHz - this.displayedDiffHz);
    } else if (timeSinceLastSound > this.silenceGracePeriodMs + 400) {
      this.displayedFreq += boundedAlpha * (0 - this.displayedFreq);
      this.displayedDiffHz = 0;
    }

    const clampedDisplayedCents = Math.max(-50, Math.min(50, this.displayedCents));
    this.displayedAngle = (clampedDisplayedCents / 50) * 45;

    const absDisplayed = Math.abs(this.displayedCents);
    // Requer múltiplas leituras estáveis sempre que minStableReadingsForInTune > 1 OU quando estabilidade inicial ainda é baixa (< 70)
    const requiredReadingsForInTune = this.explicitMinReadingsConfigured
      ? this.minStableReadingsForInTune
      : (this.targetStability < 70 || this.targetTransient ? 3 : 1);

    const canConfirmInTune =
      !this.targetTransient &&
      !this.targetPolyphonic &&
      absDisplayed <= this.inTuneTolerance &&
      absTarget <= this.inTuneTolerance &&
      this.consecutiveInTuneReadings >= requiredReadingsForInTune;

    if (this.currentState === TUNER_STATES.WEAK_SIGNAL || this.isWeakSignal) {
      this.stableInTuneCount = 0;
      this.currentStage = 'inconclusive';
    } else if (this.currentState === TUNER_STATES.WAITING_SOUND || !this.targetNote) {
      this.stableInTuneCount = 0;
      this.currentStage = 'inconclusive';
    } else if (canConfirmInTune) {
      this.currentState = TUNER_STATES.IN_TUNE;
      this.currentStage = 'in_tune';
      this.stableInTuneCount++;
    } else if (absDisplayed <= this.nearTuneTolerance) {
      this.currentState = TUNER_STATES.NEAR_TUNE;
      this.stableInTuneCount = 0;
      this.currentStage = this.consecutiveValidReadings <= 1
        ? 'detected'
        : (this.targetTransient || this.targetStability < 70 || Math.abs(this.displayedCents - this.targetCents) > 3.5)
          ? 'stabilizing'
          : 'stable';
    } else {
      this.currentState = TUNER_STATES.OUT_OF_TUNE;
      this.stableInTuneCount = 0;
      this.currentStage = this.consecutiveValidReadings <= 1
        ? 'detected'
        : (this.targetTransient || this.targetStability < 70 || Math.abs(this.displayedCents - this.targetCents) > 4.0)
          ? 'stabilizing'
          : 'stable';
    }

    return {
      displayedCents: parseFloat(this.displayedCents.toFixed(1)),
      rawDisplayedCents: this.displayedCents,
      displayedFreq: parseFloat(this.displayedFreq.toFixed(1)),
      displayedAngle: parseFloat(this.displayedAngle.toFixed(2)),
      displayedDiffHz: parseFloat(this.displayedDiffHz.toFixed(2)),
      note: this.targetNote,
      notePt: this.targetNotePt,
      octave: this.targetOctave,
      state: this.currentState,
      tunerStage: this.currentStage,
      isInTune: this.currentState === TUNER_STATES.IN_TUNE,
      isNearTune: this.currentState === TUNER_STATES.NEAR_TUNE,
      isWeakSignal: this.currentState === TUNER_STATES.WEAK_SIGNAL,
      isPolyphonic: this.targetPolyphonic,
      isTransient: this.targetTransient,
      confidence: this.targetConfidence,
      signalIntensity: this.targetIntensity,
      stability: this.targetStability,
      expectedFreq: parseFloat(this.targetExpectedFreq.toFixed(2)),
      stableFramesCount: this.stableInTuneCount
    };
  }
}

// =============================================================
// GUITAR ACADEMY / VIRTUO AFINADOR PRO: ENGINE DE SUAVIZAÇÃO MATEMÁTICA
// src/audio/tunerSmoother.ts
//
// 1. Exponential Moving Average (EMA) com alpha = 0.18
// 2. Zona de Estabilidade (Dead Zone ±2 cents, High-Precision ±5 cents)
// 3. Inércia Visual com Easing (Máximo 180ms)
// 4. Separação Estrita: Frequência Real vs. Frequência Exibida
// 5. Confidence Score e Rejeição de Sinal Fraco
// 6. 60 FPS Render Loop via requestAnimationFrame
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

export interface TunerSmoothedOutput {
  displayedCents: number;
  displayedFreq: number;
  displayedAngle: number;
  note: string | null;
  notePt: string | null;
  octave: number | null;
  state: TunerState;
  isInTune: boolean;
  isNearTune: boolean;
  isWeakSignal: boolean;
  confidence: number;
  expectedFreq: number;
}

export class TunerSmoother {
  private alphaStandard = 0.18;
  private alphaNear = 0.08; // ±2 a ±5 cents (movimento ultra suave)
  private alphaDeadZone = 0.03; // ±2 cents (parada estável no centro)

  private displayedCents = 0;
  private displayedFreq = 0;
  private displayedAngle = 0;

  private targetCents = 0;
  private targetFreq = 0;
  private targetNote: string | null = null;
  private targetNotePt: string | null = null;
  private targetOctave: number | null = null;
  private targetExpectedFreq = 0;
  private targetConfidence = 0;

  private activeNote: string | null = null;
  private activeOctave: number | null = null;
  private noteTransitionStartTime = 0;
  private maxTransitionDuration = 180; // ms
  private isInTransition = false;

  private confidenceThreshold: number;
  private lastConfidentTime = 0;
  private silenceGracePeriodMs = 350;
  private isWeakSignal = false;
  private currentState: TunerState = TUNER_STATES.IDLE;
  private lastFrameTime = performance.now();

  constructor(options: { confidenceThreshold?: number; alpha?: number } = {}) {
    this.confidenceThreshold = options.confidenceThreshold || 0.65;
    if (options.alpha !== undefined) this.alphaStandard = options.alpha;
  }

  reset(): void {
    this.displayedCents = 0;
    this.displayedFreq = 0;
    this.displayedAngle = 0;
    this.targetCents = 0;
    this.targetFreq = 0;
    this.targetNote = null;
    this.targetNotePt = null;
    this.targetOctave = null;
    this.targetExpectedFreq = 0;
    this.targetConfidence = 0;
    this.activeNote = null;
    this.activeOctave = null;
    this.isInTransition = false;
    this.isWeakSignal = false;
    this.currentState = TUNER_STATES.IDLE;
  }

  feedPitch(pitch: PitchDetectionResult | null, timestamp: number | null = null): void {
    const now = timestamp !== null ? timestamp : performance.now();

    if (!pitch || pitch.isSilence || pitch.frequency === 0) {
      if (now - this.lastConfidentTime > this.silenceGracePeriodMs) {
        this.currentState = TUNER_STATES.WAITING_SOUND;
      }
      return;
    }

    const confidence = pitch.confidence !== undefined ? pitch.confidence : 0;
    const intensity = pitch.intensity !== undefined ? pitch.intensity : 1;

    if (confidence < this.confidenceThreshold || pitch.isWeakSignal || intensity < 0.05) {
      this.isWeakSignal = true;
      this.currentState = TUNER_STATES.WEAK_SIGNAL;
      return;
    }

    this.isWeakSignal = false;
    this.lastConfidentTime = now;
    this.targetFreq = pitch.frequency;
    this.targetConfidence = confidence;
    this.targetExpectedFreq = pitch.expectedFreq;

    const rawCents = pitch.cents !== undefined ? pitch.cents : 0;
    this.targetCents = Math.max(-50, Math.min(50, rawCents));

    const newNoteId = `${pitch.note}${pitch.octave !== null ? pitch.octave : ''}`;
    const currentNoteId = `${this.activeNote}${this.activeOctave !== null ? this.activeOctave : ''}`;

    if (newNoteId !== currentNoteId) {
      this.activeNote = pitch.note;
      this.activeOctave = pitch.octave;
      this.noteTransitionStartTime = now;
      this.isInTransition = true;
    }

    this.targetNote = pitch.note;
    this.targetNotePt = pitch.notePt;
    this.targetOctave = pitch.octave;
  }

  step(currentTime = performance.now()): TunerSmoothedOutput {
    const dt = Math.min(64, Math.max(1, currentTime - this.lastFrameTime));
    this.lastFrameTime = currentTime;

    const timeSinceLastSound = currentTime - this.lastConfidentTime;
    if (this.lastConfidentTime > 0 && timeSinceLastSound > this.silenceGracePeriodMs) {
      this.targetCents = 0;
      this.currentState = TUNER_STATES.WAITING_SOUND;
    }

    const absTarget = Math.abs(this.targetCents);
    let effectiveAlpha = this.alphaStandard;

    if (absTarget <= 2.0) {
      effectiveAlpha = this.alphaDeadZone;
      if (Math.abs(this.displayedCents - this.targetCents) < 0.25) {
        this.displayedCents = this.targetCents;
      }
    } else if (absTarget <= 5.0) {
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

    if (this.targetFreq > 0) {
      if (this.displayedFreq === 0) {
        this.displayedFreq = this.targetFreq;
      } else {
        this.displayedFreq += boundedAlpha * (this.targetFreq - this.displayedFreq);
      }
    } else if (timeSinceLastSound > this.silenceGracePeriodMs + 400) {
      this.displayedFreq += boundedAlpha * (0 - this.displayedFreq);
    }

    const clampedDisplayedCents = Math.max(-50, Math.min(50, this.displayedCents));
    this.displayedAngle = (clampedDisplayedCents / 50) * 45;

    const absDisplayed = Math.abs(this.displayedCents);
    if (this.currentState === TUNER_STATES.WEAK_SIGNAL) {
      // mantém sinal fraco
    } else if (this.currentState === TUNER_STATES.WAITING_SOUND || !this.targetNote) {
      // aguardando som
    } else if (absDisplayed <= 2.5) {
      this.currentState = TUNER_STATES.IN_TUNE;
    } else if (absDisplayed <= 7.0) {
      this.currentState = TUNER_STATES.NEAR_TUNE;
    } else {
      this.currentState = TUNER_STATES.OUT_OF_TUNE;
    }

    return {
      displayedCents: parseFloat(this.displayedCents.toFixed(1)),
      displayedFreq: parseFloat(this.displayedFreq.toFixed(1)),
      displayedAngle: parseFloat(this.displayedAngle.toFixed(2)),
      note: this.targetNote,
      notePt: this.targetNotePt,
      octave: this.targetOctave,
      state: this.currentState,
      isInTune: this.currentState === TUNER_STATES.IN_TUNE,
      isNearTune: this.currentState === TUNER_STATES.NEAR_TUNE,
      isWeakSignal: this.currentState === TUNER_STATES.WEAK_SIGNAL,
      confidence: this.targetConfidence,
      expectedFreq: this.targetExpectedFreq
    };
  }
}

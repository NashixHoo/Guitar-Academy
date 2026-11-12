// =============================================================
// GUITAR ACADEMY / VIRTUO AFINADOR PRO: ENGINE DE SUAVIZAÇÃO MATEMÁTICA V2
// src/audio/tunerSmoother.ts
//
// 1. Exponential Moving Average (EMA) adaptativo com alpha dinâmico
// 2. Zona de Estabilidade Central (Dead Zone ±2 cents, High-Precision ±5 cents)
// 3. Tolerância configurável (Conservatório ±3¢, Padrão ±5¢, Rápido ±8¢)
// 4. Inércia Visual com Easing e Histerese anti-tremor entre notas
// 5. Separação Estrita: Frequência Real vs. Frequência Exibida
// 6. Confidence Score e Rejeição de Sinal Fraco / Transientes
// 7. 60 FPS Render Loop via requestAnimationFrame
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
  displayedDiffHz: number;
  note: string | null;
  notePt: string | null;
  octave: number | null;
  state: TunerState;
  isInTune: boolean;
  isNearTune: boolean;
  isWeakSignal: boolean;
  confidence: number;
  expectedFreq: number;
  stableFramesCount: number;
}

export interface TunerSmootherOptions {
  confidenceThreshold?: number;
  alpha?: number;
  inTuneTolerance?: number; // Cents (padrão 5.0)
  nearTuneTolerance?: number; // Cents (padrão 15.0)
  deadZone?: number; // Cents (padrão 2.0)
}

export class TunerSmoother {
  private alphaStandard = 0.28; // Resposta viva e ágil do ponteiro
  private alphaNear = 0.18; // ±2 a ±5 cents (suavização precisa de aproximação)
  private alphaDeadZone = 0.08; // ±2 cents (parada estável no centro)

  private inTuneTolerance = 5.0; // ±5 cents para afinação confirmada
  private nearTuneTolerance = 15.0; // ±15 cents para proximidade
  private deadZone = 2.0; // ±2 cents para zona morta

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

  // Histerese de nota para evitar oscilação visual
  private activeNote: string | null = null;
  private activeOctave: number | null = null;
  private candidateNote: string | null = null;
  private candidateOctave: number | null = null;
  private candidateFrames = 0;
  private readonly requiredCandidateFrames = 2; // Exige 2 quadros para comutar nota

  private noteTransitionStartTime = 0;
  private maxTransitionDuration = 180; // ms
  private isInTransition = false;

  private confidenceThreshold: number;
  private lastConfidentTime = 0;
  private silenceGracePeriodMs = 380;
  private isWeakSignal = false;
  private currentState: TunerState = TUNER_STATES.IDLE;
  private lastFrameTime = performance.now();

  private stableInTuneCount = 0;

  constructor(options: TunerSmootherOptions = {}) {
    this.confidenceThreshold = options.confidenceThreshold !== undefined ? options.confidenceThreshold : 0.58;
    if (options.alpha !== undefined) this.alphaStandard = options.alpha;
    if (options.inTuneTolerance !== undefined) this.inTuneTolerance = options.inTuneTolerance;
    if (options.nearTuneTolerance !== undefined) this.nearTuneTolerance = options.nearTuneTolerance;
    if (options.deadZone !== undefined) this.deadZone = options.deadZone;
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
    this.activeNote = null;
    this.activeOctave = null;
    this.candidateNote = null;
    this.candidateOctave = null;
    this.candidateFrames = 0;
    this.isInTransition = false;
    this.isWeakSignal = false;
    this.currentState = TUNER_STATES.IDLE;
    this.stableInTuneCount = 0;
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

    // Alta sensibilidade: notas musicais periódicas suaves são acolhidas sem corte artificial por intensidade
    if (confidence < this.confidenceThreshold || pitch.isWeakSignal) {
      this.isWeakSignal = true;
      this.currentState = TUNER_STATES.WEAK_SIGNAL;
      return;
    }

    this.isWeakSignal = false;
    this.lastConfidentTime = now;
    this.targetFreq = pitch.frequency;
    this.targetConfidence = confidence;
    this.targetExpectedFreq = pitch.expectedFreq;
    this.targetDiffHz = pitch.diffHz !== undefined ? pitch.diffHz : (pitch.frequency - pitch.expectedFreq);

    const rawCents = pitch.cents !== undefined ? pitch.cents : 0;
    this.targetCents = Math.max(-50, Math.min(50, rawCents));

    // Histerese de nota: só comuta nota se a nova nota se mantiver estável por quadros consecutivos
    const incomingNoteId = `${pitch.note}${pitch.octave !== null ? pitch.octave : ''}`;
    const activeNoteId = `${this.activeNote}${this.activeOctave !== null ? this.activeOctave : ''}`;

    if (incomingNoteId === activeNoteId || this.activeNote === null) {
      this.activeNote = pitch.note;
      this.activeOctave = pitch.octave;
      this.candidateFrames = 0;
      this.candidateNote = null;
      this.targetNote = pitch.note;
      this.targetNotePt = pitch.notePt;
      this.targetOctave = pitch.octave;
    } else {
      const candidateId = `${this.candidateNote}${this.candidateOctave !== null ? this.candidateOctave : ''}`;
      if (incomingNoteId === candidateId) {
        this.candidateFrames++;
        if (this.candidateFrames >= this.requiredCandidateFrames) {
          this.activeNote = pitch.note;
          this.activeOctave = pitch.octave;
          this.targetNote = pitch.note;
          this.targetNotePt = pitch.notePt;
          this.targetOctave = pitch.octave;
          this.candidateFrames = 0;
          this.candidateNote = null;
          this.noteTransitionStartTime = now;
          this.isInTransition = true;
        }
      } else {
        this.candidateNote = pitch.note;
        this.candidateOctave = pitch.octave;
        this.candidateFrames = 1;
      }
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

    if (this.targetFreq > 0) {
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
    if (this.currentState === TUNER_STATES.WEAK_SIGNAL) {
      this.stableInTuneCount = 0;
    } else if (this.currentState === TUNER_STATES.WAITING_SOUND || !this.targetNote) {
      this.stableInTuneCount = 0;
    } else if (absDisplayed <= this.inTuneTolerance && absTarget <= this.inTuneTolerance) {
      // Afinado apenas quando tanto a agulha visual quanto o desvio acústico real estão na tolerância
      this.currentState = TUNER_STATES.IN_TUNE;
      this.stableInTuneCount++;
    } else if (absDisplayed <= this.nearTuneTolerance) {
      this.currentState = TUNER_STATES.NEAR_TUNE;
      this.stableInTuneCount = 0;
    } else {
      this.currentState = TUNER_STATES.OUT_OF_TUNE;
      this.stableInTuneCount = 0;
    }

    return {
      displayedCents: parseFloat(this.displayedCents.toFixed(1)),
      displayedFreq: parseFloat(this.displayedFreq.toFixed(1)),
      displayedAngle: parseFloat(this.displayedAngle.toFixed(2)),
      displayedDiffHz: parseFloat(this.displayedDiffHz.toFixed(2)),
      note: this.targetNote,
      notePt: this.targetNotePt,
      octave: this.targetOctave,
      state: this.currentState,
      isInTune: this.currentState === TUNER_STATES.IN_TUNE,
      isNearTune: this.currentState === TUNER_STATES.NEAR_TUNE,
      isWeakSignal: this.currentState === TUNER_STATES.WEAK_SIGNAL,
      confidence: this.targetConfidence,
      expectedFreq: this.targetExpectedFreq,
      stableFramesCount: this.stableInTuneCount
    };
  }
}

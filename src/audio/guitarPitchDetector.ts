// =============================================================
// GUITAR ACADEMY / VIRTUO GUITAR PITCH DETECTOR & ANALYZER 2.1
// src/audio/guitarPitchDetector.ts
//
// Motor DSP Profissional de Detecção de Pitch via Web Audio API:
// 1. Algoritmo YIN (de Cheveigné & Kawahara) com CMNDF + verificação rígida de periodicidade
// 2. Interpolação parabólica sub-amostral de alta precisão
// 3. Análise espectral FFT (Radix-2) com Spectral Flatness / Crest para rejeição de ruído branco/ambiente
// 4. Decimação adaptativa (2:1 / 4:1) com validação anti-ruído em taxa original para subgraves (B0=30.87Hz, E1=41.2Hz)
// 5. Supressão segura de erro de oitava (rejeição de harmônicos sem falsa queda de oitava)
// 6. Salvaguarda polifônica com detecção espectral de picos não-harmônicos concorrentes
// 7. Analisador espectral multi-nota (evaluateChordFromBuffer) para validação honesta de acordes
// 8. Captura segura de microfone com fallback progressivo, sink silencioso e detecção de track muda/ctx suspenso
// =============================================================

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const NOTE_NAMES_PT: Record<string, string> = {
  'C': 'Dó', 'C#': 'Dó#', 'Db': 'Réb',
  'D': 'Ré', 'D#': 'Ré#', 'Eb': 'Mib',
  'E': 'Mi',
  'F': 'Fá', 'F#': 'Fá#', 'Gb': 'Solb',
  'G': 'Sol', 'G#': 'Sol#', 'Ab': 'Láb',
  'A': 'Lá', 'A#': 'Lá#', 'Bb': 'Sib',
  'B': 'Si'
};

export const ENHARMONIC_EQUIVALENTS: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'Cb': 'B',
  'Fb': 'E',
  'E#': 'F',
  'B#': 'C'
};

export type DetectionType =
  | 'silence'
  | 'monophonic_note'
  | 'polyphonic_ambiguous'
  | 'weak_signal'
  | 'noise_or_unidentified';

export interface TargetStringRef {
  stringNumber: number;
  note: string;
  notePt?: string;
  octave: number;
  freq?: number;
}

export interface PitchDetectionResult {
  frequency: number;
  note: string | null;
  notePt: string | null;
  octave: number | null;
  cents: number;
  confidence: number;
  intensity: number;
  isSilence: boolean;
  isWeakSignal: boolean;
  isOnset: boolean;
  detectionType: DetectionType;
  polyphonicWarning?: string;
  diagnosticMessage?: string;
  isReliable?: boolean;
  normalizedPeriodicity?: number;
  inharmonicPeaksCount?: number;
  audioGraphHealthy?: boolean;
  contextState?: AudioContextState | 'unavailable';
  trackMuted?: boolean;
  sampleRate?: number;
  stability: number; // 0..100
  stabilityLabel: string;
  expectedFreq: number;
  diffHz?: number;
  timestamp: number;
}

export interface ChordEvaluationResult {
  status: 'confirmed' | 'incomplete' | 'single_note_only' | 'silence' | 'unidentified' | 'noise';
  isChordConfirmed: boolean;
  expectedNotes: string[];
  recognizedNotes: string[];
  missingNotes: string[];
  unexpectedNotes: string[];
  confidence: number;
  message: string;
}

export type PitchDetectorErrorType =
  | 'not_supported'
  | 'permission_denied'
  | 'not_found'
  | 'device_busy'
  | 'busy'
  | 'aborted'
  | 'unknown';

export interface StartListeningResult {
  success: boolean;
  error?: string;
  errorType?: PitchDetectorErrorType;
  sampleRate?: number;
}

export interface GuitarPitchDetectorOptions {
  lowCutoff?: number; // Hz (padrão 25 Hz para cobrir B0=30.87 Hz e E1=41.2 Hz)
  highCutoff?: number; // Hz (padrão 1600 Hz para harmônicos e violino E5=659 Hz)
  silenceThreshold?: number; // RMS threshold
  confidenceThreshold?: number; // 0..1
  bufferSize?: number;
  a4Calibration?: number; // Padrão 440 Hz (faixa 430..450 Hz)
}

export interface NoteMatchValidation {
  status: 'correct' | 'wrong_note' | 'wrong_octave' | 'out_of_tune' | 'unidentified' | 'silence' | 'polyphonic';
  isMatch: boolean;
  isWrongNote: boolean;
  detectedNote: string | null;
  detectedOctave: number | null;
  cents: number;
  message: string;
}

export function normalizeNoteName(note: string | null | undefined): string {
  if (!note) return '';
  const cleaned = String(note).trim().replace(/[0-9]/g, '');
  if (!cleaned) return '';
  const canonical = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return ENHARMONIC_EQUIVALENTS[canonical] || canonical;
}

/**
 * Valida com rigor uma detecção contra uma nota esperada, considerando confiança,
 * tipo de detecção, tolerância em cents e (opcionalmente) oitava.
 */
export function validateDetectedNoteAgainstExpected(
  pitch: PitchDetectionResult | null,
  expectedNote: string,
  options?: {
    expectedOctave?: number | null;
    toleranceCents?: number;
    minConfidence?: number;
  }
): NoteMatchValidation {
  if (!pitch || pitch.isSilence || pitch.detectionType === 'silence') {
    return {
      status: 'silence',
      isMatch: false,
      isWrongNote: false,
      detectedNote: null,
      detectedOctave: null,
      cents: 0,
      message: 'Silêncio'
    };
  }

  if (pitch.detectionType === 'polyphonic_ambiguous') {
    return {
      status: 'polyphonic',
      isMatch: false,
      isWrongNote: false,
      detectedNote: null,
      detectedOctave: null,
      cents: 0,
      message: pitch.polyphonicWarning || 'Múltiplas notas simultâneas detectadas — toque uma nota por vez.'
    };
  }

  const minConf = options?.minConfidence ?? 0.65;
  const tolCents = options?.toleranceCents ?? 35;

  if (
    pitch.detectionType !== 'monophonic_note' ||
    pitch.isWeakSignal ||
    !pitch.note ||
    pitch.frequency <= 0 ||
    pitch.confidence < minConf ||
    pitch.isReliable === false
  ) {
    return {
      status: 'unidentified',
      isMatch: false,
      isWrongNote: false,
      detectedNote: null,
      detectedOctave: null,
      cents: 0,
      message: 'Não foi possível identificar a nota'
    };
  }

  const normDetected = normalizeNoteName(pitch.note);
  const normExpected = normalizeNoteName(expectedNote);

  if (normDetected !== normExpected) {
    return {
      status: 'wrong_note',
      isMatch: false,
      isWrongNote: true,
      detectedNote: normDetected,
      detectedOctave: pitch.octave,
      cents: pitch.cents,
      message: `Nota incorreta: detectado ${normDetected}${pitch.octave ?? ''} (esperado ${normExpected}${options?.expectedOctave ?? ''})`
    };
  }

  if (
    options?.expectedOctave !== undefined &&
    options.expectedOctave !== null &&
    pitch.octave !== null &&
    pitch.octave !== options.expectedOctave
  ) {
    return {
      status: 'wrong_octave',
      isMatch: false,
      isWrongNote: true,
      detectedNote: normDetected,
      detectedOctave: pitch.octave,
      cents: pitch.cents,
      message: `Oitava diferente: detectado ${normDetected}${pitch.octave} (esperado ${normExpected}${options.expectedOctave})`
    };
  }

  if (Math.abs(pitch.cents) > tolCents) {
    return {
      status: 'out_of_tune',
      isMatch: false,
      isWrongNote: false,
      detectedNote: normDetected,
      detectedOctave: pitch.octave,
      cents: pitch.cents,
      message: `Nota ${normDetected} fora da tolerância de afinação (${pitch.cents > 0 ? '+' : ''}${pitch.cents} cents, limite ±${tolCents} cents)`
    };
  }

  return {
    status: 'correct',
    isMatch: true,
    isWrongNote: false,
    detectedNote: normDetected,
    detectedOctave: pitch.octave,
    cents: pitch.cents,
    message: `Nota ${normDetected}${pitch.octave ?? ''} confirmada (${pitch.frequency.toFixed(1)} Hz)`
  };
}

/**
 * FFT Radix-2 in-place (somente magnitudes reais) com janela de Hann.
 */
function computeHannFftMagnitudes(
  buffer: Float32Array,
  targetFftSize: number
): Float32Array {
  const fftSize = targetFftSize;
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  const copyLen = Math.min(buffer.length, fftSize);
  const denom = Math.max(1, copyLen - 1);

  for (let i = 0; i < copyLen; i++) {
    const win = 0.5 * (1 - Math.cos((2 * Math.PI * i) / denom));
    real[i] = buffer[i] * win;
  }

  // Bit-reversal permutation
  let j = 0;
  for (let i = 1; i < fftSize; i++) {
    let bit = fftSize >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;
    if (i < j) {
      const tr = real[i];
      real[i] = real[j];
      real[j] = tr;
      const ti = imag[i];
      imag[i] = imag[j];
      imag[j] = ti;
    }
  }

  // Butterfly stages
  for (let len = 2; len <= fftSize; len <<= 1) {
    const halfLen = len >> 1;
    const angleStep = (-2 * Math.PI) / len;
    const wRealStep = Math.cos(angleStep);
    const wImagStep = Math.sin(angleStep);

    for (let i = 0; i < fftSize; i += len) {
      let wReal = 1;
      let wImag = 0;
      for (let k = 0; k < halfLen; k++) {
        const idx1 = i + k;
        const idx2 = idx1 + halfLen;
        const tReal = wReal * real[idx2] - wImag * imag[idx2];
        const tImag = wReal * imag[idx2] + wImag * real[idx2];

        real[idx2] = real[idx1] - tReal;
        imag[idx2] = imag[idx1] - tImag;
        real[idx1] += tReal;
        imag[idx1] += tImag;

        const nextWReal = wReal * wRealStep - wImag * wImagStep;
        wImag = wReal * wImagStep + wImag * wRealStep;
        wReal = nextWReal;
      }
    }
  }

  const halfBins = fftSize >> 1;
  const mags = new Float32Array(halfBins);
  for (let k = 0; k < halfBins; k++) {
    mags[k] = Math.hypot(real[k], imag[k]);
  }
  return mags;
}

interface SpectralSummary {
  flatness: number;
  crest: number;
  dominantPeakFreq: number;
  dominantPeakMag: number;
  peaks: Array<{ freq: number; mag: number }>;
  inharmonicCount: number;
  magnitudes: Float32Array;
  fftSize: number;
}

function analyzeSpectrum(
  buffer: Float32Array,
  sampleRate: number,
  lowFreq: number,
  highFreq: number
): SpectralSummary {
  const fftSize = buffer.length >= 8192 ? 8192 : 4096;
  const magnitudes = computeHannFftMagnitudes(buffer, fftSize);
  const binHz = sampleRate / fftSize;

  const minBin = Math.max(1, Math.floor(lowFreq / binHz));
  const maxBin = Math.min(magnitudes.length - 2, Math.ceil(highFreq / binHz));

  if (minBin >= maxBin) {
    return {
      flatness: 1,
      crest: 1,
      dominantPeakFreq: 0,
      dominantPeakMag: 0,
      peaks: [],
      inharmonicCount: 0,
      magnitudes,
      fftSize
    };
  }

  let logSum = 0;
  let powerSum = 0;
  let maxPower = 0;
  let maxBinIdx = minBin;
  let count = 0;

  for (let k = minBin; k <= maxBin; k++) {
    const p = magnitudes[k] * magnitudes[k] + 1e-18;
    logSum += Math.log(p);
    powerSum += p;
    if (p > maxPower) {
      maxPower = p;
      maxBinIdx = k;
    }
    count++;
  }

  const arithMean = count > 0 ? powerSum / count : 1e-18;
  const geomMean = count > 0 ? Math.exp(logSum / count) : 1e-18;
  const flatness = Math.min(1, geomMean / Math.max(arithMean, 1e-18));
  const crest = Math.sqrt(maxPower / Math.max(arithMean, 1e-18));

  // Coleta picos espectrais locais relevantes acima de um limiar relativo ao pico e à média
  const magFloor = Math.max(Math.sqrt(arithMean) * 2.2, magnitudes[maxBinIdx] * 0.25);
  const rawPeaks: Array<{ freq: number; mag: number }> = [];

  for (let k = minBin + 1; k <= maxBin - 1; k++) {
    const m = magnitudes[k];
    if (m >= magFloor && m >= magnitudes[k - 1] && m > magnitudes[k + 1]) {
      // Interpolação parabólica de frequência no espectro
      const a = magnitudes[k - 1];
      const b = magnitudes[k];
      const c = magnitudes[k + 1];
      const denom = a - 2 * b + c;
      const delta = Math.abs(denom) > 1e-12 ? (0.5 * (a - c)) / denom : 0;
      const exactBin = k + Math.max(-0.5, Math.min(0.5, delta));
      const freq = exactBin * binHz;
      rawPeaks.push({ freq, mag: m });
    }
  }

  // Deduplica picos muito próximos (< 1.5 semitom) mantendo o maior
  rawPeaks.sort((a, b) => b.mag - a.mag);
  const peaks: Array<{ freq: number; mag: number }> = [];
  for (const p of rawPeaks) {
    const tooClose = peaks.some((existing) => Math.abs(Math.log2(p.freq / existing.freq)) < 0.08);
    if (!tooClose) {
      peaks.push(p);
    }
  }

  // Determina quantos picos NÃO são série harmônica de uma única fundamental
  // A candidata fundamental mais plausível costuma ser o menor pico forte (>= 30% do pico dominante)
  // ou o próprio pico dominante. Verificamos se todos os picos se explicam por uma mesma fundamental F0.
  let inharmonicCount = 0;
  if (peaks.length >= 2) {
    const strongCandidates = peaks.filter((p) => p.mag >= magnitudes[maxBinIdx] * 0.30);
    if (strongCandidates.length >= 2) {
      // Testa possíveis fundamentais (cada pico forte ou f0/2 se houver oitava)
      const f0Candidates = strongCandidates.map((p) => p.freq);
      let bestMinInharmonic = strongCandidates.length - 1;

      for (const f0 of f0Candidates) {
        let nonHarm = 0;
        for (const p of strongCandidates) {
          const ratio = p.freq / f0;
          const nearestInt = Math.max(1, Math.round(ratio));
          const relErr = Math.abs(ratio - nearestInt) / nearestInt;
          // Se o pico p NÃO é múltiplo inteiro (1x..6x) nem sub-oitava limpa dentro de 6.5%, é não-harmônico
          if (!(nearestInt <= 6 && relErr <= 0.065)) {
            nonHarm++;
          }
        }
        if (nonHarm < bestMinInharmonic) {
          bestMinInharmonic = nonHarm;
        }
      }
      inharmonicCount = bestMinInharmonic;
    }
  }

  // Refina frequência do pico dominante
  let domBin = maxBinIdx;
  if (maxBinIdx > 1 && maxBinIdx < magnitudes.length - 1) {
    const a = magnitudes[maxBinIdx - 1];
    const b = magnitudes[maxBinIdx];
    const c = magnitudes[maxBinIdx + 1];
    const denom = a - 2 * b + c;
    const delta = Math.abs(denom) > 1e-12 ? (0.5 * (a - c)) / denom : 0;
    domBin = maxBinIdx + Math.max(-0.5, Math.min(0.5, delta));
  }

  return {
    flatness,
    crest,
    dominantPeakFreq: domBin * binHz,
    dominantPeakMag: magnitudes[maxBinIdx],
    peaks,
    inharmonicCount,
    magnitudes,
    fftSize
  };
}

export class GuitarPitchDetector {
  private lowCutoff: number;
  private highCutoff: number;
  private silenceThreshold: number;
  private confidenceThreshold: number;
  private bufferSize: number;
  private a4Calibration: number;

  private targetString: TargetStringRef | null = null;

  private audioCtx: AudioContext | null = null;
  private isSharedAudioCtx = false;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private highpassFilter: BiquadFilterNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private silentSinkGainNode: GainNode | null = null;
  private isRunning = false;
  private isAcquiringMicrophone = false;
  private animFrameId: number | null = null;

  private lastTimeBuffer: Float32Array | null = null;
  private lastSampleRate = 44100;
  private consecutiveZeroBuffers = 0;

  // Onset & Debounce State
  private prevRms = 0;
  private noiseFloor = 0.003;
  private recentDetections: { note: string | null; octave: number | null; cents: number; freq: number }[] = [];
  private maxStabilityWindow = 7;

  // Sintetizador de Tom de Referência
  private activeOscillator: OscillatorNode | null = null;
  private activeGain: GainNode | null = null;

  constructor(options: GuitarPitchDetectorOptions = {}) {
    this.lowCutoff = options.lowCutoff !== undefined ? options.lowCutoff : 25;
    this.highCutoff = options.highCutoff !== undefined ? options.highCutoff : 1600;
    this.silenceThreshold = options.silenceThreshold !== undefined ? options.silenceThreshold : 0.004;
    this.confidenceThreshold = options.confidenceThreshold !== undefined ? options.confidenceThreshold : 0.60;
    this.bufferSize = options.bufferSize || 4096;
    this.a4Calibration = options.a4Calibration || 440;
  }

  get running(): boolean {
    return this.isRunning;
  }

  getA4Reference(): number {
    return this.a4Calibration;
  }

  setA4Reference(a4: number): void {
    if (a4 >= 420 && a4 <= 460) {
      this.a4Calibration = a4;
    }
  }

  setRange(lowCutoff: number, highCutoff: number): void {
    this.lowCutoff = Math.max(20, lowCutoff);
    this.highCutoff = Math.min(4000, highCutoff);

    if (this.audioCtx && this.highpassFilter && this.lowpassFilter) {
      const now = this.audioCtx.currentTime;
      this.highpassFilter.frequency.setValueAtTime(this.lowCutoff, now);
      this.lowpassFilter.frequency.setValueAtTime(this.highCutoff, now);
    }
  }

  setTargetString(target: TargetStringRef | null): void {
    this.targetString = target;
  }

  getTargetString(): TargetStringRef | null {
    return this.targetString;
  }

  getAudioDiagnostics(): {
    isListening: boolean;
    contextState: AudioContextState | 'unavailable';
    sampleRate: number;
    trackMuted: boolean;
    trackLive: boolean;
    consecutiveZeroBuffers: number;
  } {
    const track = this.mediaStream?.getAudioTracks()[0];
    return {
      isListening: this.isRunning,
      contextState: this.audioCtx ? this.audioCtx.state : 'unavailable',
      sampleRate: this.audioCtx?.sampleRate || this.lastSampleRate,
      trackMuted: Boolean(track?.muted),
      trackLive: track ? track.readyState === 'live' : false,
      consecutiveZeroBuffers: this.consecutiveZeroBuffers
    };
  }

  /**
   * Inicia a escuta do microfone com tratamento completo de erros, fallback progressivo de constraints,
   * verificação de saúde do grafo Web Audio e bloqueio contra instâncias duplicadas.
   */
  async startListening(
    onPitchDetected: (pitch: PitchDetectionResult | null) => void,
    externalAudioCtx?: AudioContext | null
  ): Promise<StartListeningResult> {
    if (this.isAcquiringMicrophone) {
      return {
        success: false,
        error: 'A inicialização do microfone já está em andamento. Aguarde.',
        errorType: 'busy',
      };
    }

    this.isAcquiringMicrophone = true;

    if (this.isRunning || this.mediaStream) {
      this.stopListening();
    }

    if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
      this.isAcquiringMicrophone = false;
      return {
        success: false,
        error: 'Microfone não suportado neste navegador ou ambiente de execução.',
        errorType: 'not_supported',
      };
    }

    try {
      const stream = await this.acquireAudioStream();
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack || audioTrack.readyState !== 'live') {
        stream.getTracks().forEach((t) => t.stop());
        return {
          success: false,
          error: 'Nenhuma trilha de áudio ativa disponível no dispositivo de entrada.',
          errorType: 'not_found',
        };
      }

      if (externalAudioCtx && externalAudioCtx.state !== 'closed') {
        this.audioCtx = externalAudioCtx;
        this.isSharedAudioCtx = true;
      } else {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) {
          stream.getTracks().forEach((t) => t.stop());
          return {
            success: false,
            error: 'Web Audio API não está disponível no navegador.',
            errorType: 'not_supported',
          };
        }
        this.audioCtx = new AudioContextClass();
        this.isSharedAudioCtx = false;
      }

      if (this.audioCtx.state === 'suspended') {
        try {
          await this.audioCtx.resume();
        } catch (resumeErr) {
          console.warn('AudioContext resume pendente:', resumeErr);
        }
      }

      this.mediaStream = stream;
      this.sourceNode = this.audioCtx.createMediaStreamSource(stream);

      this.highpassFilter = this.audioCtx.createBiquadFilter();
      this.highpassFilter.type = 'highpass';
      this.highpassFilter.frequency.setValueAtTime(this.lowCutoff, this.audioCtx.currentTime);
      this.highpassFilter.Q.setValueAtTime(0.707, this.audioCtx.currentTime);

      this.lowpassFilter = this.audioCtx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.setValueAtTime(this.highCutoff, this.audioCtx.currentTime);
      this.lowpassFilter.Q.setValueAtTime(0.707, this.audioCtx.currentTime);

      const isSubBassInstrument = this.lowCutoff <= 45;
      const targetFftSize = isSubBassInstrument ? 8192 : Math.max(4096, this.bufferSize);
      const effectiveBufferSize = Math.min(16384, Math.max(2048, targetFftSize));
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = effectiveBufferSize;
      this.analyser.smoothingTimeConstant = 0;

      // Mantém o grafo Web Audio ativo sem retornar áudio para os alto-falantes (evita microfonia e suspensões em mobile)
      this.silentSinkGainNode = this.audioCtx.createGain();
      this.silentSinkGainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);

      this.sourceNode.connect(this.highpassFilter);
      this.highpassFilter.connect(this.lowpassFilter);
      this.lowpassFilter.connect(this.analyser);
      this.analyser.connect(this.silentSinkGainNode);
      this.silentSinkGainNode.connect(this.audioCtx.destination);

      this.isRunning = true;
      this.recentDetections = [];
      this.prevRms = 0;
      this.consecutiveZeroBuffers = 0;
      this.lastSampleRate = this.audioCtx.sampleRate || 44100;

      const buffer = new Float32Array(effectiveBufferSize);
      this.lastTimeBuffer = buffer;

      audioTrack.onended = () => {
        if (this.isRunning) {
          onPitchDetected({
            frequency: 0,
            note: null,
            notePt: null,
            octave: null,
            cents: 0,
            confidence: 0,
            intensity: 0,
            isSilence: true,
            isWeakSignal: false,
            isOnset: false,
            detectionType: 'silence',
            isReliable: false,
            audioGraphHealthy: false,
            trackMuted: true,
            contextState: this.audioCtx?.state || 'unavailable',
            diagnosticMessage: 'Microfone desconectado pelo sistema ou navegador.',
            stability: 0,
            stabilityLabel: 'Desconectado',
            expectedFreq: 0,
            diffHz: 0,
            timestamp: Date.now()
          });
        }
      };

      const loop = () => {
        if (!this.isRunning || !this.analyser || !this.audioCtx) return;

        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }

        this.analyser.getFloatTimeDomainData(buffer);
        const sRate = this.audioCtx.sampleRate || 44100;
        this.lastSampleRate = sRate;

        const pitch = this.detectPitchFromBuffer(buffer, sRate);
        if (pitch) {
          const track = this.mediaStream?.getAudioTracks()[0];
          const isMuted = Boolean(track?.muted) || track?.readyState !== 'live';
          const ctxSuspended = this.audioCtx.state !== 'running';

          let maxAbs = 0;
          for (let i = 0; i < buffer.length; i += 8) {
            const abs = Math.abs(buffer[i]);
            if (abs > maxAbs) maxAbs = abs;
          }
          if (maxAbs === 0) {
            this.consecutiveZeroBuffers++;
          } else {
            this.consecutiveZeroBuffers = 0;
          }

          pitch.contextState = this.audioCtx.state;
          pitch.trackMuted = isMuted;
          pitch.sampleRate = sRate;
          pitch.audioGraphHealthy = !isMuted && !ctxSuspended;

          if (ctxSuspended) {
            pitch.diagnosticMessage = 'Motor de áudio suspenso pelo navegador — toque na tela para reativar.';
          } else if (isMuted) {
            pitch.diagnosticMessage = 'Microfone mudo no sistema operacional ou bloqueado.';
          } else if (this.consecutiveZeroBuffers > 45) {
            pitch.audioGraphHealthy = false;
            pitch.diagnosticMessage = 'Nenhum dado de áudio chegando do microfone. Verifique a entrada selecionada.';
          }
        }

        onPitchDetected(pitch);
        this.animFrameId = requestAnimationFrame(loop);
      };

      this.animFrameId = requestAnimationFrame(loop);
      return { success: true, sampleRate: this.lastSampleRate };
    } catch (err: unknown) {
      this.stopListening();
      const errorObj = err as { name?: string; message?: string };
      const errName = errorObj?.name || '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError' || errName === 'SecurityError') {
        return {
          success: false,
          error: 'Permissão de microfone negada. Autorize o microfone no ícone de cadeado do seu navegador.',
          errorType: 'permission_denied',
        };
      }
      if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        return {
          success: false,
          error: 'Nenhum microfone encontrado. Conecte um microfone, fone de ouvido ou interface de áudio.',
          errorType: 'not_found',
        };
      }
      if (errName === 'NotReadableError' || errName === 'TrackStartError') {
        return {
          success: false,
          error: 'O microfone está em uso por outro aplicativo ou aba. Feche outros aplicativos de gravação e tente novamente.',
          errorType: 'device_busy',
        };
      }
      return {
        success: false,
        error: `Erro ao iniciar captura de áudio: ${errorObj?.message || 'Falha desconhecida'}`,
        errorType: 'unknown',
      };
    } finally {
      this.isAcquiringMicrophone = false;
    }
  }

  private async acquireAudioStream(): Promise<MediaStream> {
    const constraintTiers: MediaStreamConstraints[] = [
      {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      },
      {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
        },
      },
      { audio: true },
    ];

    let lastErr: unknown;
    for (const constraints of constraintTiers) {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err: unknown) {
        lastErr = err;
        const name = (err as { name?: string })?.name || '';
        // Só faz fallback para erros de constraint/dispositivo; se negado/ausente/ocupado, propaga direto sem re-prompt
        if (
          name === 'NotAllowedError' ||
          name === 'PermissionDeniedError' ||
          name === 'SecurityError' ||
          name === 'NotFoundError' ||
          name === 'DevicesNotFoundError' ||
          name === 'NotReadableError' ||
          name === 'TrackStartError'
        ) {
          throw err;
        }
      }
    }
    throw lastErr;
  }

  /**
   * Avalia um acorde contra o buffer de áudio capturado ao vivo pelo microfone ativo.
   */
  evaluateCurrentChord(expectedNotes: string[]): ChordEvaluationResult {
    if (!this.isRunning || !this.lastTimeBuffer) {
      return {
        status: 'unidentified',
        isChordConfirmed: false,
        expectedNotes: expectedNotes.map(normalizeNoteName),
        recognizedNotes: [],
        missingNotes: expectedNotes.map(normalizeNoteName),
        unexpectedNotes: [],
        confidence: 0,
        message: 'Microfone inativo.'
      };
    }
    return this.evaluateChordFromBuffer(
      this.lastTimeBuffer,
      this.lastSampleRate,
      expectedNotes,
      this.a4Calibration
    );
  }

  /**
   * Finaliza e limpa completamente todas as conexões de áudio, nós e streams.
   */
  stopListening(): void {
    this.isRunning = false;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {}
      this.sourceNode = null;
    }

    if (this.highpassFilter) {
      try {
        this.highpassFilter.disconnect();
      } catch {}
      this.highpassFilter = null;
    }

    if (this.lowpassFilter) {
      try {
        this.lowpassFilter.disconnect();
      } catch {}
      this.lowpassFilter = null;
    }

    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch {}
      this.analyser = null;
    }

    if (this.silentSinkGainNode) {
      try {
        this.silentSinkGainNode.disconnect();
      } catch {}
      this.silentSinkGainNode = null;
    }

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => {
          track.onended = null;
          track.stop();
        });
      } catch {}
      this.mediaStream = null;
    }

    if (this.audioCtx && !this.isSharedAudioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }

    this.lastTimeBuffer = null;
    this.recentDetections = [];
    this.prevRms = 0;
    this.consecutiveZeroBuffers = 0;
  }

  /**
   * Calcula a autocorrelação normalizada r(T) na taxa original para confirmar periodicidade real
   * e rejeitar alucinações geradas por ruído branco/ambiente ou decimação.
   */
  private computeNormalizedAutocorrelation(buf: Float32Array, sRate: number, freq: number): number {
    if (freq <= 0) return 0;
    const lagExact = sRate / freq;
    const lagLow = Math.floor(lagExact);
    const frac = lagExact - lagLow;
    if (lagLow < 2 || lagLow + 2 >= buf.length) return 0;

    const compareLen = buf.length - (lagLow + 2);
    if (compareLen < 32) return 0;

    let num = 0;
    let denA = 0;
    let denB = 0;
    for (let i = 0; i < compareLen; i++) {
      const a = buf[i];
      const b = buf[i + lagLow] * (1 - frac) + buf[i + lagLow + 1] * frac;
      num += a * b;
      denA += a * a;
      denB += b * b;
    }
    const denom = Math.sqrt(denA * denB);
    return denom > 1e-12 ? num / denom : 0;
  }

  /**
   * Núcleo YIN para cálculo da função de diferença média cumulativa normalizada (CMNDF)
   * com interpolação parabólica sub-amostral e proteção rigorosa de oitava.
   */
  private runYinCore(
    buf: Float32Array,
    sRate: number,
    minF: number,
    maxF: number,
    threshold = 0.15
  ): { freq: number; confidence: number; dipCount: number; dPrimeVal: number } | null {
    const bLen = buf.length;
    const minPeriod = Math.max(2, Math.floor(sRate / maxF));
    const maxPeriod = Math.min(bLen - 15, Math.floor(sRate / minF));
    if (minPeriod >= maxPeriod) return null;

    const windowSize = Math.min(Math.floor(bLen / 2), bLen - maxPeriod);
    if (windowSize < 24) return null;

    const d = new Float32Array(maxPeriod + 1);
    for (let tau = 1; tau <= maxPeriod; tau++) {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        const diff = buf[j] - buf[j + tau];
        sum += diff * diff;
      }
      d[tau] = sum;
    }

    const dPrime = new Float32Array(maxPeriod + 1);
    dPrime[0] = 1;
    let runningSum = 0;
    for (let tau = 1; tau <= maxPeriod; tau++) {
      runningSum += d[tau];
      dPrime[tau] = runningSum > 0 ? (d[tau] * tau) / runningSum : 1;
    }

    let tauCandidate = -1;
    for (let tau = minPeriod; tau <= maxPeriod; tau++) {
      if (dPrime[tau] < threshold) {
        while (tau + 1 <= maxPeriod && dPrime[tau + 1] < dPrime[tau]) {
          tau++;
        }
        tauCandidate = tau;
        break;
      }
    }

    // Fallback estrito: apenas aceita mínimo global se estiver abaixo de 0.30 (evita ruído com d' ~ 0.38..0.44)
    if (tauCandidate === -1) {
      let minVal = 1.0;
      let minTau = -1;
      for (let tau = minPeriod; tau <= maxPeriod; tau++) {
        if (dPrime[tau] < minVal) {
          minVal = dPrime[tau];
          minTau = tau;
        }
      }
      if (minVal < 0.30 && minTau !== -1) {
        tauCandidate = minTau;
      }
    }

    if (tauCandidate === -1) return null;

    // Supressão segura de erro de oitava:
    // Só desce para 2*tau / 3*tau se o candidato inicial NÃO for um vale limpo (< 0.05) e o múltiplo for muito mais profundo.
    if (dPrime[tauCandidate] > 0.05) {
      for (let mult = 2; mult <= 3; mult++) {
        const multTau = Math.round(tauCandidate * mult);
        if (multTau <= maxPeriod) {
          let localMinTau = multTau;
          let localMinVal = dPrime[multTau];
          for (let dt = -2; dt <= 2; dt++) {
            const t = multTau + dt;
            if (t >= minPeriod && t <= maxPeriod && dPrime[t] < localMinVal) {
              localMinVal = dPrime[t];
              localMinTau = t;
            }
          }
          if (localMinVal < 0.12 && localMinVal < dPrime[tauCandidate] * 0.45) {
            tauCandidate = localMinTau;
            break;
          }
        }
      }
    }

    // Contagem de vales NÃO-harmônicos de tauCandidate (evita falso alarme em harmônicos 2T, 3T...)
    let nonHarmonicDipCount = 0;
    for (let tau = minPeriod + 1; tau < maxPeriod - 1; tau++) {
      if (dPrime[tau] < dPrime[tau - 1] && dPrime[tau] < dPrime[tau + 1] && dPrime[tau] < 0.25) {
        const multRatio = tau / tauCandidate;
        const nearestInt = Math.max(1, Math.round(multRatio));
        const isHarmonicMultiple = Math.abs(multRatio - nearestInt) / nearestInt <= 0.08;
        if (!isHarmonicMultiple) {
          nonHarmonicDipCount++;
        }
      }
    }

    let refinedTau = tauCandidate;
    if (tauCandidate > 1 && tauCandidate < maxPeriod) {
      const y0 = dPrime[tauCandidate - 1];
      const y1 = dPrime[tauCandidate];
      const y2 = dPrime[tauCandidate + 1];
      const denom = 2 * (y0 - 2 * y1 + y2) + 1e-12;
      const delta = (y0 - y2) / denom;
      if (Math.abs(delta) <= 1) {
        refinedTau = tauCandidate + delta;
      }
    }

    const freq = sRate / refinedTau;
    const confidence = Math.max(0, Math.min(1, 1 - dPrime[tauCandidate]));

    return {
      freq,
      confidence,
      dipCount: nonHarmonicDipCount,
      dPrimeVal: dPrime[tauCandidate]
    };
  }

  /**
   * Algoritmo YIN + análise espectral anti-ruído + proteção anti-oitava + salvaguarda polifônica.
   */
  detectPitchFromBuffer(
    buffer: Float32Array,
    sampleRate = 44100,
    rangeOverride?: { lowCutoff?: number; highCutoff?: number; a4?: number; targetString?: TargetStringRef | null }
  ): PitchDetectionResult | null {
    const bufferLen = buffer ? buffer.length : 0;
    if (!buffer || bufferLen < 256) {
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: 0,
        intensity: 0,
        isSilence: true,
        isWeakSignal: false,
        isOnset: false,
        detectionType: 'silence',
        isReliable: false,
        diagnosticMessage: 'Buffer insuficiente',
        stability: 0,
        stabilityLabel: 'Silêncio',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    const effectiveLow = rangeOverride?.lowCutoff ?? this.lowCutoff;
    const effectiveHigh = rangeOverride?.highCutoff ?? this.highCutoff;
    const effectiveA4 = rangeOverride?.a4 ?? this.a4Calibration;
    const effectiveTarget = rangeOverride?.targetString !== undefined ? rangeOverride.targetString : this.targetString;

    // 1. Energia RMS e proteção contra NaN/Infinity
    let sumSquares = 0;
    for (let i = 0; i < bufferLen; i++) {
      const sample = Number.isFinite(buffer[i]) ? buffer[i] : 0;
      sumSquares += sample * sample;
    }
    const rms = Math.sqrt(sumSquares / bufferLen);
    const intensity = Math.min(1.0, rms * 10);

    const isOnset = rms > 0.025 && rms > this.prevRms * 1.7;
    this.prevRms = rms;

    if (rms < 0.02) {
      this.noiseFloor = this.noiseFloor * 0.95 + rms * 0.05;
    }

    // 2. Silêncio
    if (rms < this.silenceThreshold) {
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: 0,
        intensity,
        isSilence: true,
        isWeakSignal: false,
        isOnset: false,
        detectionType: 'silence',
        isReliable: false,
        diagnosticMessage: 'Silêncio',
        stability: 0,
        stabilityLabel: 'Silêncio',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    // 3. Análise espectral FFT (para separar ruído branco/ambiente e polifonia real)
    const spec = analyzeSpectrum(buffer, sampleRate, Math.max(25, effectiveLow), Math.min(2000, effectiveHigh));

    // Ruído de banda larga: SFM alto e baixo crest factor espectral
    if (spec.flatness > 0.32 && spec.crest < 4.0) {
      this.recentDetections = [];
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: 0,
        intensity,
        isSilence: false,
        isWeakSignal: true,
        isOnset,
        detectionType: 'noise_or_unidentified',
        isReliable: false,
        normalizedPeriodicity: 0,
        diagnosticMessage: 'Não foi possível identificar a nota',
        stability: 0,
        stabilityLabel: 'Ruído',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    // Salvaguarda polifônica espectral: múltiplas notas fundamentais concorrentes não-harmônicas
    if (spec.inharmonicCount >= 1 && rms >= Math.max(this.silenceThreshold * 1.5, 0.008)) {
      this.recentDetections = [];
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: 0,
        intensity,
        isSilence: false,
        isWeakSignal: false,
        isOnset,
        detectionType: 'polyphonic_ambiguous',
        isReliable: false,
        inharmonicPeaksCount: spec.inharmonicCount,
        polyphonicWarning: 'Múltiplas notas soando ao mesmo tempo — toque uma nota por vez.',
        diagnosticMessage: 'Múltiplas notas simultâneas detectadas',
        stability: 0,
        stabilityLabel: 'Polifonia',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    // 4. YIN direto em taxa total
    let yinRes = this.runYinCore(
      buffer,
      sampleRate,
      Math.max(45, effectiveLow),
      effectiveHigh,
      0.15
    );

    // 5. Decimação adaptativa 2:1 para graves/subgraves (com validação anti-ruído!)
    if ((!yinRes || yinRes.freq < 65 || yinRes.confidence < 0.60) && effectiveLow < 55) {
      const halfLen = Math.floor(bufferLen / 2);
      const decimated = new Float32Array(halfLen);
      for (let i = 0; i < halfLen; i++) {
        decimated[i] = 0.5 * (buffer[2 * i] + buffer[2 * i + 1]);
      }
      const lowYin = this.runYinCore(decimated, sampleRate / 2, effectiveLow, 130, 0.16);
      if (lowYin) {
        const origCorr = this.computeNormalizedAutocorrelation(buffer, sampleRate, lowYin.freq);
        if (origCorr >= 0.55 && (!yinRes || lowYin.confidence > yinRes.confidence)) {
          yinRes = lowYin;
        }
      }
    }

    // 6. Decimação 4:1 para subgraves extremos (B0 = 30.87 Hz) com validação estrita na taxa original
    if ((!yinRes || yinRes.freq < 45 || yinRes.confidence < 0.60) && effectiveLow <= 45 && bufferLen >= 2048) {
      const quarterLen = Math.floor(bufferLen / 4);
      const quadDecimated = new Float32Array(quarterLen);
      for (let i = 0; i < quarterLen; i++) {
        quadDecimated[i] = 0.25 * (buffer[4 * i] + buffer[4 * i + 1] + buffer[4 * i + 2] + buffer[4 * i + 3]);
      }
      const subBassYin = this.runYinCore(quadDecimated, sampleRate / 4, effectiveLow, 90, 0.16);
      if (subBassYin) {
        const origCorr = this.computeNormalizedAutocorrelation(buffer, sampleRate, subBassYin.freq);
        if (origCorr >= 0.55 && (!yinRes || subBassYin.confidence > yinRes.confidence)) {
          yinRes = subBassYin;
        }
      }
    }

    // 7. Validação de periodicidade real para eliminar falsos positivos por ruído
    const periodicity = yinRes
      ? this.computeNormalizedAutocorrelation(buffer, sampleRate, yinRes.freq)
      : 0;

    if (yinRes && (periodicity < 0.50 || (yinRes.dipCount >= 3 && yinRes.confidence < 0.85))) {
      const isPoly = yinRes.dipCount >= 3 && periodicity >= 0.30;
      this.recentDetections = [];
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: 0,
        intensity,
        isSilence: false,
        isWeakSignal: !isPoly,
        isOnset,
        detectionType: isPoly ? 'polyphonic_ambiguous' : 'noise_or_unidentified',
        isReliable: false,
        normalizedPeriodicity: parseFloat(periodicity.toFixed(3)),
        polyphonicWarning: isPoly ? 'Múltiplas cordas soando (polifonia) — toque uma nota isolada.' : undefined,
        diagnosticMessage: isPoly
          ? 'Múltiplas notas simultâneas detectadas'
          : 'Não foi possível identificar a nota',
        stability: 0,
        stabilityLabel: isPoly ? 'Polifonia' : 'Ruído / Inconclusivo',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    // 8. Limiar de confiança e sinal fraco
    if (!yinRes || yinRes.confidence < this.confidenceThreshold) {
      const isWeak = yinRes !== null && yinRes.confidence >= 0.30 && rms >= this.silenceThreshold;
      this.recentDetections = [];
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: parseFloat(Math.max(0, yinRes?.confidence || 0).toFixed(2)),
        intensity,
        isSilence: false,
        isWeakSignal: true,
        isOnset,
        detectionType: isWeak ? 'weak_signal' : 'noise_or_unidentified',
        isReliable: false,
        normalizedPeriodicity: parseFloat(periodicity.toFixed(3)),
        diagnosticMessage: 'Não foi possível identificar a nota',
        stability: 0,
        stabilityLabel: isWeak ? 'Sinal fraco' : 'Não identificado',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    const frequency = parseFloat(yinRes.freq.toFixed(2));

    // 9. Verificação de faixa configurada
    if (frequency < effectiveLow || frequency > effectiveHigh) {
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: 0,
        intensity,
        isSilence: false,
        isWeakSignal: true,
        isOnset,
        detectionType: 'weak_signal',
        isReliable: false,
        normalizedPeriodicity: parseFloat(periodicity.toFixed(3)),
        diagnosticMessage: 'Frequência fora da faixa do instrumento',
        stability: 0,
        stabilityLabel: 'Fora da faixa',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    // 10. Conversão de frequência para nota, oitava e cents
    const pitchDetails = this.frequencyToPitch(frequency, effectiveA4, effectiveTarget);
    const effectiveConf = Math.min(yinRes.confidence, Math.min(1, periodicity + 0.15));

    this.recordDetection({
      note: pitchDetails.note,
      octave: pitchDetails.octave,
      cents: pitchDetails.cents,
      freq: frequency
    });
    const stabilityInfo = this.calculateStability();

    return {
      frequency,
      note: pitchDetails.note,
      notePt: pitchDetails.note ? NOTE_NAMES_PT[pitchDetails.note] || pitchDetails.note : null,
      octave: pitchDetails.octave,
      cents: pitchDetails.cents,
      confidence: parseFloat(effectiveConf.toFixed(2)),
      intensity,
      isSilence: false,
      isWeakSignal: false,
      isOnset,
      detectionType: 'monophonic_note',
      isReliable: effectiveConf >= this.confidenceThreshold && pitchDetails.note !== null,
      normalizedPeriodicity: parseFloat(periodicity.toFixed(3)),
      inharmonicPeaksCount: spec.inharmonicCount,
      diagnosticMessage: 'Nota identificada',
      stability: stabilityInfo.score,
      stabilityLabel: stabilityInfo.label,
      expectedFreq: pitchDetails.expectedFreq,
      diffHz: pitchDetails.diffHz,
      timestamp: Date.now()
    };
  }

  /**
   * Analisador espectral multi-nota honesto para acordes.
   * Nunca aprova um acorde baseado em 1 única nota nem aprova sobre ruído/silêncio.
   * Rejeita sinais cuja energia pertença a apenas uma nota fundamental e seus próprios harmônicos.
   */
  evaluateChordFromBuffer(
    buffer: Float32Array,
    sampleRate: number,
    expectedNotesRaw: string[],
    a4 = this.a4Calibration
  ): ChordEvaluationResult {
    const expectedNotes = Array.from(new Set(expectedNotesRaw.map(normalizeNoteName).filter(Boolean)));
    if (!buffer || buffer.length < 256 || expectedNotes.length === 0) {
      return {
        status: 'unidentified',
        isChordConfirmed: false,
        expectedNotes,
        recognizedNotes: [],
        missingNotes: expectedNotes,
        unexpectedNotes: [],
        confidence: 0,
        message: 'Não foi possível identificar a nota'
      };
    }

    let sumSq = 0;
    for (let i = 0; i < buffer.length; i++) {
      sumSq += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sumSq / buffer.length);
    if (rms < this.silenceThreshold) {
      return {
        status: 'silence',
        isChordConfirmed: false,
        expectedNotes,
        recognizedNotes: [],
        missingNotes: expectedNotes,
        unexpectedNotes: [],
        confidence: 0,
        message: 'Silêncio'
      };
    }

    const spec = analyzeSpectrum(buffer, sampleRate, 70, 1400);
    if (spec.flatness > 0.30 && spec.crest < 4.5) {
      return {
        status: 'noise',
        isChordConfirmed: false,
        expectedNotes,
        recognizedNotes: [],
        missingNotes: expectedNotes,
        unexpectedNotes: [],
        confidence: 0,
        message: 'Não foi possível identificar a nota'
      };
    }

    // Se todas as frequências pertencem à série harmônica de uma única nota (monofônico),
    // nunca aprova como acorde completo mesmo que os harmônicos 3x/5x coincidam com a 5ª/3ª!
    if (spec.inharmonicCount === 0 && expectedNotes.length > 1) {
      const single = spec.dominantPeakFreq > 0 ? this.frequencyToPitch(spec.dominantPeakFreq, a4) : null;
      const singleNote = single?.note ? [normalizeNoteName(single.note)] : [];
      const missing = expectedNotes.filter((n) => !singleNote.includes(n));
      return {
        status: 'single_note_only',
        isChordConfirmed: false,
        expectedNotes,
        recognizedNotes: singleNote,
        missingNotes: missing,
        unexpectedNotes: singleNote.filter((n) => !expectedNotes.includes(n)),
        confidence: 0.4,
        message: singleNote[0]
          ? `Apenas 1 nota detectada (${singleNote[0]}). Para validar o acorde completo, é necessário reconhecer todas as notas (${expectedNotes.join(', ')}).`
          : 'Não foi possível identificar a nota'
      };
    }

    // Extrai classes de notas presentes nos picos espectrais relevantes (>= 25% do pico principal)
    const significantPeaks = spec.peaks.filter((p) => p.mag >= spec.dominantPeakMag * 0.22);
    const recognizedSet = new Set<string>();

    for (const pk of significantPeaks) {
      const mapped = this.frequencyToPitch(pk.freq, a4);
      if (mapped.note && Math.abs(mapped.cents) <= 38) {
        recognizedSet.add(normalizeNoteName(mapped.note));
      }
    }

    const recognizedNotes = Array.from(recognizedSet);
    const missingNotes = expectedNotes.filter((n) => !recognizedSet.has(n));
    const unexpectedNotes = recognizedNotes.filter((n) => !expectedNotes.includes(n));

    if (recognizedNotes.length === 0) {
      return {
        status: 'unidentified',
        isChordConfirmed: false,
        expectedNotes,
        recognizedNotes: [],
        missingNotes: expectedNotes,
        unexpectedNotes: [],
        confidence: 0,
        message: 'Não foi possível identificar a nota'
      };
    }

    // Aprovação estrita: TODAS as notas esperadas devem estar presentes E sem notas estranhas dominantes
    const isConfirmed = missingNotes.length === 0 && unexpectedNotes.length === 0;
    const matchRatio = expectedNotes.length > 0
      ? (expectedNotes.length - missingNotes.length) / expectedNotes.length
      : 0;

    return {
      status: isConfirmed ? 'confirmed' : 'incomplete',
      isChordConfirmed: isConfirmed,
      expectedNotes,
      recognizedNotes,
      missingNotes,
      unexpectedNotes,
      confidence: parseFloat(matchRatio.toFixed(2)),
      message: isConfirmed
        ? `Acorde confirmado (${recognizedNotes.join(' - ')})`
        : `Acorde incompleto ou divergente — reconhecido: [${recognizedNotes.join(', ')}], faltam: [${missingNotes.join(', ')}]`
    };
  }

  private recordDetection(d: { note: string | null; octave: number | null; cents: number; freq: number }) {
    this.recentDetections.push(d);
    if (this.recentDetections.length > this.maxStabilityWindow) {
      this.recentDetections.shift();
    }
  }

  private calculateStability(): { score: number; label: string } {
    if (this.recentDetections.length < 3) {
      return { score: 60, label: 'Calibrando' };
    }

    const notes = this.recentDetections.map((d) => `${d.note}${d.octave}`);
    const lastNote = notes[notes.length - 1];
    const sameNoteMatches = notes.filter((n) => n === lastNote).length;
    const noteStabilityRatio = sameNoteMatches / notes.length;

    const centsList = this.recentDetections.map((d) => d.cents);
    const avgCents = centsList.reduce((a, b) => a + b, 0) / centsList.length;
    const centsVariance = centsList.reduce((acc, c) => acc + Math.pow(c - avgCents, 2), 0) / centsList.length;
    const stdDev = Math.sqrt(centsVariance);

    const score = Math.max(
      10,
      Math.min(100, Math.round(noteStabilityRatio * 70 + Math.max(0, 30 - stdDev * 1.5)))
    );

    let label = 'Instável';
    if (score >= 85) label = 'Excelente';
    else if (score >= 70) label = 'Boa';
    else if (score >= 50) label = 'Moderada';

    return { score, label };
  }

  /**
   * Converte uma frequência detectada na nota mais próxima, oitava, desvio em cents e frequência esperada,
   * respeitando a calibração de A4 e a corda alvo quando definida.
   */
  frequencyToPitch(
    frequency: number,
    a4 = this.a4Calibration,
    targetString?: TargetStringRef | null
  ): {
    note: string | null;
    octave: number | null;
    cents: number;
    expectedFreq: number;
    diffHz: number;
  } {
    if (!frequency || frequency <= 0) {
      return { note: null, octave: null, cents: 0, expectedFreq: 0, diffHz: 0 };
    }

    if (targetString) {
      const normTargetNote = normalizeNoteName(targetString.note);
      const noteIdx = (NOTE_NAMES as readonly string[]).indexOf(normTargetNote);
      if (noteIdx !== -1) {
        const midiNum = (targetString.octave + 1) * 12 + noteIdx;
        const expectedFreq = a4 * Math.pow(2, (midiNum - 69) / 12);
        const cents = Math.round(1200 * Math.log2(frequency / expectedFreq));
        const diffHz = parseFloat((frequency - expectedFreq).toFixed(2));
        return {
          note: targetString.note,
          octave: targetString.octave,
          cents,
          expectedFreq: parseFloat(expectedFreq.toFixed(2)),
          diffHz
        };
      }
    }

    const midiNumExact = 69 + 12 * Math.log2(frequency / a4);
    const midiNumRound = Math.round(midiNumExact);
    const noteIndex = ((midiNumRound % 12) + 12) % 12;
    const note = NOTE_NAMES[noteIndex];
    const octave = Math.floor(midiNumRound / 12) - 1;

    const expectedFreq = a4 * Math.pow(2, (midiNumRound - 69) / 12);
    const cents = Math.round(1200 * Math.log2(frequency / expectedFreq));
    const diffHz = parseFloat((frequency - expectedFreq).toFixed(2));

    return {
      note,
      octave,
      cents,
      expectedFreq: parseFloat(expectedFreq.toFixed(2)),
      diffHz
    };
  }

  /**
   * Converte nome da nota e oitava na frequência fundamental em Hz segundo a calibração de A4.
   */
  noteToFrequency(noteInput: string, octave = 4, cents = 0, a4 = this.a4Calibration): number {
    const note = normalizeNoteName(noteInput);
    const noteIndex = (NOTE_NAMES as readonly string[]).indexOf(note);
    if (noteIndex === -1) {
      throw new Error(`Nota inválida: ${noteInput}`);
    }
    const midiNum = (octave + 1) * 12 + noteIndex;
    const baseFreq = a4 * Math.pow(2, (midiNum - 69 + cents / 100) / 12);
    return parseFloat(baseFreq.toFixed(2));
  }

  playReferenceTone(frequency: number, durationMs = 1500): boolean {
    try {
      this.stopReferenceTone();
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return false;

      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioContextClass();
        this.isSharedAudioCtx = false;
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.03);

      if (durationMs > 0) {
        const stopTime = now + durationMs / 1000;
        gain.gain.setValueAtTime(0.35, stopTime - 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);
        osc.stop(stopTime);
      }

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);

      this.activeOscillator = osc;
      this.activeGain = gain;
      return true;
    } catch {
      return false;
    }
  }

  stopReferenceTone(): void {
    if (this.activeOscillator) {
      try {
        this.activeOscillator.stop();
        this.activeOscillator.disconnect();
      } catch {}
      this.activeOscillator = null;
    }
    if (this.activeGain) {
      try {
        this.activeGain.disconnect();
      } catch {}
      this.activeGain = null;
    }
  }

  getIsListening(): boolean {
    return this.isRunning;
  }

  getIsAcquiring(): boolean {
    return this.isAcquiringMicrophone;
  }
}

export const guitarPitchDetector = new GuitarPitchDetector();

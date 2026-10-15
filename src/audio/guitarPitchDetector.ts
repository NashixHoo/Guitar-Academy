// =============================================================
// GUITAR ACADEMY / VIRTUO GUITAR PITCH DETECTOR & ANALYZER 2.0
// src/audio/guitarPitchDetector.ts
// Detecção de pitch de alta precisão via Web Audio API
// Filtros passa-faixa customizados para a guitarra (E2 ~ 82.4Hz até agudos)
// Autocorrelação com interpolação parabólica sub-amostral
// Detecção de onset (ataque de palheta) e diferenciação monofônica vs polifônica
// Sintetizador de tom de referência e medição de estabilidade
// 100% Client-Side - Zero chamadas de API externas
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
  'Bb': 'A#'
};

export type DetectionType = 'silence' | 'monophonic_note' | 'polyphonic_ambiguous' | 'weak_signal';

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
  isOnset: boolean; // Verdadeiro no instante inicial do ataque da palheta
  detectionType: DetectionType;
  polyphonicWarning?: string;
  stability: number; // 0..100
  stabilityLabel: string;
  expectedFreq: number;
  timestamp: number;
}

export interface GuitarPitchDetectorOptions {
  lowCutoff?: number; // Hz (padrão 70 Hz para capturar E2=82.4 Hz e Drop D=73.4 Hz)
  highCutoff?: number; // Hz (padrão 1200 Hz para harmônicos e agudos)
  silenceThreshold?: number; // RMS threshold
  confidenceThreshold?: number; // 0..1
  bufferSize?: number;
}

export class GuitarPitchDetector {
  private lowCutoff: number;
  private highCutoff: number;
  private silenceThreshold: number;
  private confidenceThreshold: number;
  private bufferSize: number;

  private audioCtx: AudioContext | null = null;
  private isSharedAudioCtx = false;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private highpassFilter: BiquadFilterNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isRunning = false;
  private animFrameId: number | null = null;

  // Onset & Debounce State
  private prevRms = 0;
  private lastConfirmedNote: string | null = null;
  private lastConfirmedTimestamp = 0;
  private minNoteIntervalMs = 200; // Intervalo mínimo de debounce entre repetições da mesma nota

  private recentDetections: { note: string | null; octave: number | null; cents: number }[] = [];
  private maxStabilityWindow = 7;

  // Sintetizador de Tom de Referência
  private activeOscillator: OscillatorNode | null = null;
  private activeGain: GainNode | null = null;

  constructor(options: GuitarPitchDetectorOptions = {}) {
    this.lowCutoff = options.lowCutoff || 70; // 70 Hz inclui E2 (82.4 Hz) e Drop D (73.4 Hz)
    this.highCutoff = options.highCutoff || 1200;
    this.silenceThreshold = options.silenceThreshold || 0.012;
    this.confidenceThreshold = options.confidenceThreshold || 0.65;
    this.bufferSize = options.bufferSize || 2048;
  }

  get running(): boolean {
    return this.isRunning;
  }

  /**
   * Inicia a escuta do microfone com tratamento completo de erros.
   * Deve ser disparado apenas por ação explícita do usuário (botão/clique).
   */
  async startListening(
    onPitchDetected: (pitch: PitchDetectionResult | null) => void,
    externalAudioCtx?: AudioContext | null
  ): Promise<{ success: boolean; error?: string }> {
    if (this.isRunning) {
      this.stopListening();
    }

    if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
      return {
        success: false,
        error: 'Microfone não suportado neste navegador ou ambiente de execução.'
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true
        }
      });

      if (externalAudioCtx && externalAudioCtx.state !== 'closed') {
        this.audioCtx = externalAudioCtx;
        this.isSharedAudioCtx = true;
      } else {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          stream.getTracks().forEach((t) => t.stop());
          return {
            success: false,
            error: 'Web Audio API não está disponível no navegador.'
          };
        }
        this.audioCtx = new AudioContextClass();
        this.isSharedAudioCtx = false;
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.mediaStream = stream;
      this.sourceNode = this.audioCtx.createMediaStreamSource(stream);

      // Filtro Passa-Altas: remove ruídos subgraves abaixo de 70Hz (preserva E2 82.4Hz)
      this.highpassFilter = this.audioCtx.createBiquadFilter();
      this.highpassFilter.type = 'highpass';
      this.highpassFilter.frequency.setValueAtTime(this.lowCutoff, this.audioCtx.currentTime);
      this.highpassFilter.Q.setValueAtTime(0.707, this.audioCtx.currentTime);

      // Filtro Passa-Baixas: atenua ruídos e interferências acima de 1200Hz
      this.lowpassFilter = this.audioCtx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.setValueAtTime(this.highCutoff, this.audioCtx.currentTime);
      this.lowpassFilter.Q.setValueAtTime(0.707, this.audioCtx.currentTime);

      // Analisador FFT
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = this.bufferSize;

      // Conexão em cascata: microfone -> passa-altas -> passa-baixas -> analisador
      this.sourceNode.connect(this.highpassFilter);
      this.highpassFilter.connect(this.lowpassFilter);
      this.lowpassFilter.connect(this.analyser);

      this.isRunning = true;
      this.recentDetections = [];
      this.prevRms = 0;
      this.lastConfirmedNote = null;
      this.lastConfirmedTimestamp = 0;

      const buffer = new Float32Array(this.bufferSize);

      const loop = () => {
        if (!this.isRunning || !this.analyser) return;

        this.analyser.getFloatTimeDomainData(buffer);
        const pitch = this.detectPitchFromBuffer(buffer, this.audioCtx?.sampleRate || 44100);
        onPitchDetected(pitch);

        this.animFrameId = requestAnimationFrame(loop);
      };

      this.animFrameId = requestAnimationFrame(loop);
      return { success: true };
    } catch (err: any) {
      this.stopListening();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        return {
          success: false,
          error: 'Permissão de microfone negada. Clique no ícone de permissão do navegador para autorizar o microfone.'
        };
      }
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        return {
          success: false,
          error: 'Nenhum microfone encontrado. Conecte um microfone ou headset.'
        };
      }
      if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        return {
          success: false,
          error: 'O microfone está em uso por outro aplicativo ou aba. Feche outros gravadores e tente novamente.'
        };
      }
      return {
        success: false,
        error: `Erro ao iniciar captura de áudio: ${err.message || 'Falha desconhecida'}`
      };
    }
  }

  /**
   * Finaliza e limpa completamente todas as conexões de áudio e streams.
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

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      } catch {}
      this.mediaStream = null;
    }

    // Se o AudioContext NÃO for compartilhado, fecha-o; se for compartilhado, mantém aberto para o metrônomo
    if (this.audioCtx && !this.isSharedAudioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }

    this.analyser = null;
    this.recentDetections = [];
    this.prevRms = 0;
  }

  /**
   * Algoritmo de autocorrelação com interpolação parabólica sub-amostral,
   * detecção de onset e salvaguarda polifônica.
   */
  detectPitchFromBuffer(buffer: Float32Array, sampleRate = 44100): PitchDetectionResult | null {
    const bufferLen = buffer.length;

    // 1. Cálculo de RMS (Energy)
    let sumSquares = 0;
    for (let i = 0; i < bufferLen; i++) {
      sumSquares += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sumSquares / bufferLen);
    const intensity = Math.min(1.0, rms * 10);

    // Detecção de onset (ataque percussivo da palheta): aumento expressivo de energia
    const isOnset = rms > 0.025 && rms > this.prevRms * 1.7;
    this.prevRms = rms;

    // 2. Silêncio ou ruído de fundo desprezível
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
        stability: 0,
        stabilityLabel: 'Silêncio',
        expectedFreq: 0,
        timestamp: Date.now()
      };
    }

    // 3. Autocorrelação
    const minPeriod = Math.floor(sampleRate / this.highCutoff);
    const maxPeriod = Math.floor(sampleRate / this.lowCutoff);

    let bestPeriod = -1;
    let bestCorrelation = 0;
    const correlations = new Float32Array(maxPeriod + 2);

    let peakCount = 0;
    let rivalPeaks = 0;

    for (let period = minPeriod; period <= maxPeriod; period++) {
      let correlation = 0;
      let norm1 = 0;
      let norm2 = 0;

      const limit = bufferLen - period;
      for (let i = 0; i < limit; i++) {
        correlation += buffer[i] * buffer[i + period];
        norm1 += buffer[i] * buffer[i];
        norm2 += buffer[i + period] * buffer[i + period];
      }

      const norm = Math.sqrt(norm1 * norm2);
      if (norm > 0) {
        correlation /= norm;
      }

      correlations[period] = correlation;

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }

    // 3.1. Prevenção de sub-harmônicos de oitava (Octave Error Suppression)
    // Verifica se existe um pico anterior que seja divisor inteiro de bestPeriod (ex: bestPeriod / 2, / 3)
    let fundamentalPeriod = bestPeriod;
    for (let div = 4; div >= 2; div--) {
      const candPeriod = Math.round(bestPeriod / div);
      if (candPeriod >= minPeriod) {
        let localMax = 0;
        let localPeriod = candPeriod;
        for (let d = -2; d <= 2; d++) {
          const p = candPeriod + d;
          if (p >= minPeriod && p <= maxPeriod && correlations[p] > localMax) {
            localMax = correlations[p];
            localPeriod = p;
          }
        }
        if (localMax >= Math.max(this.confidenceThreshold * 0.85, bestCorrelation * 0.78)) {
          fundamentalPeriod = localPeriod;
          bestCorrelation = localMax;
          break;
        }
      }
    }

    // 3.2. Salvaguarda Polifônica:
    // Identifica se há picos concorrentes de intensidade alta que NÃO são múltiplos harmônicos do período fundamental
    for (let period = minPeriod + 1; period < maxPeriod; period++) {
      if (
        correlations[period] > correlations[period - 1] &&
        correlations[period] > correlations[period + 1] &&
        correlations[period] > 0.40
      ) {
        peakCount++;
        const ratio = period / fundamentalPeriod;
        const nearestMultiple = Math.round(ratio);
        const isHarmonicMultiple = Math.abs(ratio - nearestMultiple) < 0.12;

        if (!isHarmonicMultiple && bestCorrelation > 0 && correlations[period] >= 0.45 && correlations[period] >= bestCorrelation * 0.70) {
          rivalPeaks++;
        }
      }
    }

    // Salvaguarda Polifônica Honesta:
    // Múltiplos picos não-harmônicos com energia sonora indicam polifonia (acorde completo)
    const isPolyphonicAmbiguous = (rivalPeaks >= 2 || (peakCount >= 4 && bestCorrelation < 0.70)) && rms > 0.035;

    if (isPolyphonicAmbiguous) {
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: parseFloat(bestCorrelation.toFixed(2)),
        intensity,
        isSilence: false,
        isWeakSignal: false,
        isOnset: false,
        detectionType: 'polyphonic_ambiguous',
        polyphonicWarning: 'Múltiplas cordas soando (polifonia) — toque apenas uma corda isolada.',
        stability: 30,
        stabilityLabel: 'Polifonia detectada',
        expectedFreq: 0,
        timestamp: Date.now()
      };
    }

    // 4. Limiar de Confiança para nota monofônica
    if (fundamentalPeriod === -1 || bestCorrelation < this.confidenceThreshold) {
      const isWeak = bestCorrelation >= 0.30 && rms >= this.silenceThreshold;
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: parseFloat(Math.max(0, bestCorrelation).toFixed(2)),
        intensity,
        isSilence: false,
        isWeakSignal: isWeak,
        isOnset,
        detectionType: isWeak ? 'weak_signal' : 'silence',
        stability: 0,
        stabilityLabel: isWeak ? 'Sinal muito fraco' : 'Instável',
        expectedFreq: 0,
        timestamp: Date.now()
      };
    }

    // 5. Interpolação Parabólica Sub-amostral
    let refinedPeriod = fundamentalPeriod;
    if (fundamentalPeriod > minPeriod && fundamentalPeriod < maxPeriod) {
      const alpha = correlations[fundamentalPeriod - 1];
      const beta = correlations[fundamentalPeriod];
      const gamma = correlations[fundamentalPeriod + 1];
      const delta = (alpha - gamma) / (2 * (alpha - 2 * beta + gamma) + 1e-9);
      if (Math.abs(delta) < 1) {
        refinedPeriod = fundamentalPeriod + delta;
      }
    }

    const frequency = parseFloat((sampleRate / refinedPeriod).toFixed(1));

    if (frequency < this.lowCutoff || frequency > this.highCutoff) {
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
        stability: 0,
        stabilityLabel: 'Fora da faixa',
        expectedFreq: 0,
        timestamp: Date.now()
      };
    }

    // 6. Conversão de frequência para nota, oitava e cents
    const pitchDetails = this.frequencyToPitch(frequency);

    // 7. Estabilidade em janela móvel
    this.recordDetection(pitchDetails);
    const stabilityInfo = this.calculateStability();

    return {
      frequency,
      note: pitchDetails.note,
      notePt: pitchDetails.note ? NOTE_NAMES_PT[pitchDetails.note] || pitchDetails.note : null,
      octave: pitchDetails.octave,
      cents: pitchDetails.cents,
      confidence: parseFloat(bestCorrelation.toFixed(2)),
      intensity,
      isSilence: false,
      isWeakSignal: false,
      isOnset,
      detectionType: 'monophonic_note',
      stability: stabilityInfo.score,
      stabilityLabel: stabilityInfo.label,
      expectedFreq: pitchDetails.expectedFreq,
      timestamp: Date.now()
    };
  }

  private recordDetection(pitchDetails: { note: string | null; octave: number | null; cents: number }) {
    this.recentDetections.push(pitchDetails);
    if (this.recentDetections.length > this.maxStabilityWindow) {
      this.recentDetections.shift();
    }
  }

  private calculateStability(): { score: number; label: string } {
    if (this.recentDetections.length < 3) {
      return { score: 70, label: 'Calibrando' };
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

  frequencyToPitch(frequency: number): {
    note: string | null;
    octave: number | null;
    cents: number;
    expectedFreq: number;
  } {
    if (!frequency || frequency <= 0) {
      return { note: null, octave: null, cents: 0, expectedFreq: 0 };
    }

    const midiNumExact = 69 + 12 * Math.log2(frequency / 440);
    const midiNumRound = Math.round(midiNumExact);
    const noteIndex = ((midiNumRound % 12) + 12) % 12;
    const note = NOTE_NAMES[noteIndex];
    const octave = Math.floor(midiNumRound / 12) - 1;

    const expectedFreq = 440 * Math.pow(2, (midiNumRound - 69) / 12);
    const cents = Math.round(1200 * Math.log2(frequency / expectedFreq));

    return {
      note,
      octave,
      cents,
      expectedFreq: parseFloat(expectedFreq.toFixed(1))
    };
  }

  noteToFrequency(noteInput: string, octave = 4, cents = 0): number {
    let note = String(noteInput).trim();
    if (ENHARMONIC_EQUIVALENTS[note]) {
      note = ENHARMONIC_EQUIVALENTS[note];
    }
    const noteIndex = (NOTE_NAMES as readonly string[]).indexOf(note as any);
    if (noteIndex === -1) {
      throw new Error(`Nota inválida: ${noteInput}`);
    }
    const midiNum = (octave + 1) * 12 + noteIndex;
    const baseFreq = 440 * Math.pow(2, (midiNum - 69 + cents / 100) / 12);
    return parseFloat(baseFreq.toFixed(2));
  }

  /**
   * Toca um tom senoidal de referência para afinação por ouvido.
   */
  playReferenceTone(frequency: number, durationMs = 1500): boolean {
    try {
      this.stopReferenceTone();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
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
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);

      if (durationMs > 0) {
        const stopTime = now + durationMs / 1000;
        gain.gain.exponentialRampToValueAtTime(0.001, stopTime);
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
}

export const guitarPitchDetector = new GuitarPitchDetector();

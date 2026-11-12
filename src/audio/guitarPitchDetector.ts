// =============================================================
// GUITAR ACADEMY / VIRTUO GUITAR PITCH DETECTOR & ANALYZER 2.0 (MASTER TUNER V2)
// src/audio/guitarPitchDetector.ts
//
// Motor DSP Profissional de Detecção de Pitch via Web Audio API:
// 1. Algoritmo YIN (de Cheveigné & Kawahara) com diferença quadrática normalizada (CMNDF)
// 2. Interpolação parabólica sub-amostral de alta precisão
// 3. Decimação adaptativa (2:1 / 4:1) para captura robusta de subgraves:
//    Contrabaixo Si0 (B0 ~ 30.87 Hz), Mi1 (E1 ~ 41.2 Hz) e Dó2 (C2 ~ 65.4 Hz)
// 4. Supressão de erro de oitava e rejeição de harmônicos superiores falsos
// 5. Salvaguarda polifônica com detecção de múltiplos picos concorrentes não-harmônicos
// 6. Calibração universal de A4 (430 Hz a 450 Hz, padrão 440 Hz)
// 7. Modo Automático (cromático) e Modo Manual por corda alvo
// 8. Sintetizador senoidal de tom de referência sem cliques (envelope ADSR suave)
// 9. 100% Client-Side - Zero chamadas de API externas
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
  isOnset: boolean; // Verdadeiro no instante inicial do ataque da palheta/toque
  detectionType: DetectionType;
  polyphonicWarning?: string;
  stability: number; // 0..100
  stabilityLabel: string;
  expectedFreq: number;
  diffHz?: number;
  timestamp: number;
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
}

export interface GuitarPitchDetectorOptions {
  lowCutoff?: number; // Hz (padrão 25 Hz para cobrir B0=30.87 Hz e E1=41.2 Hz)
  highCutoff?: number; // Hz (padrão 1600 Hz para harmônicos e violino E5=659 Hz)
  silenceThreshold?: number; // RMS threshold
  confidenceThreshold?: number; // 0..1
  bufferSize?: number;
  a4Calibration?: number; // Padrão 440 Hz (faixa 430..450 Hz)
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
  private isRunning = false;
  private isAcquiringMicrophone = false;
  private animFrameId: number | null = null;

  // Onset & Debounce State
  private prevRms = 0;
  private noiseFloor = 0.003; // Rastreamento contínuo adaptativo do ruído ambiente
  private recentDetections: { note: string | null; octave: number | null; cents: number; freq: number }[] = [];
  private maxStabilityWindow = 7;

  // Sintetizador de Tom de Referência
  private activeOscillator: OscillatorNode | null = null;
  private activeGain: GainNode | null = null;

  constructor(options: GuitarPitchDetectorOptions = {}) {
    this.lowCutoff = options.lowCutoff !== undefined ? options.lowCutoff : 25;
    this.highCutoff = options.highCutoff !== undefined ? options.highCutoff : 1600;
    // Limiar calibrado para alta sensibilidade (permite capturar toques suaves e notas graves)
    this.silenceThreshold = options.silenceThreshold !== undefined ? options.silenceThreshold : 0.004;
    this.confidenceThreshold = options.confidenceThreshold !== undefined ? options.confidenceThreshold : 0.58;
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

  /**
   * Inicia a escuta do microfone com tratamento completo de erros e bloqueio contra instâncias duplicadas.
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

    // Se já estiver rodando, encerra a captura anterior de forma limpa para não deixar streams órfãos
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
      // Configuração acústica otimizada para instrumentos de cordas e subgraves:
      // Desativa cancelamento de eco e supressão de ruído agressiva do sistema operacional,
      // pois eles costumam cortar notas sustentadas e frequências graves do instrumento.
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
      } catch {
        // Fallback caso o driver do dispositivo não suporte desativação explícita do AGC
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
          },
        });
      }

      if (externalAudioCtx && externalAudioCtx.state !== 'closed') {
        this.audioCtx = externalAudioCtx;
        this.isSharedAudioCtx = true;
      } else {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
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

      // Filtro Passa-Altas: corta subgraves abaixo da faixa útil do instrumento (ex: 25 Hz para B0)
      this.highpassFilter = this.audioCtx.createBiquadFilter();
      this.highpassFilter.type = 'highpass';
      this.highpassFilter.frequency.setValueAtTime(this.lowCutoff, this.audioCtx.currentTime);
      this.highpassFilter.Q.setValueAtTime(0.707, this.audioCtx.currentTime);

      // Filtro Passa-Baixas: atenua ruídos de alta frequência acima da faixa útil do instrumento
      this.lowpassFilter = this.audioCtx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.setValueAtTime(this.highCutoff, this.audioCtx.currentTime);
      this.lowpassFilter.Q.setValueAtTime(0.707, this.audioCtx.currentTime);

      // Janela adaptativa: 8192 amostras para contrabaixo/subgraves (B0=30.87Hz, E1=41.2Hz) e 4096 para guitarra/violão
      const isSubBassInstrument = this.lowCutoff <= 45;
      const targetFftSize = isSubBassInstrument ? 8192 : Math.max(4096, this.bufferSize);
      const effectiveBufferSize = Math.min(16384, Math.max(2048, targetFftSize));
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = effectiveBufferSize;

      // Conexão em cascata: microfone -> passa-altas -> passa-baixas -> analisador
      this.sourceNode.connect(this.highpassFilter);
      this.highpassFilter.connect(this.lowpassFilter);
      this.lowpassFilter.connect(this.analyser);

      this.isRunning = true;
      this.recentDetections = [];
      this.prevRms = 0;

      const buffer = new Float32Array(effectiveBufferSize);

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
          error: 'Permissão de microfone negada. Autorize o microfone no ícone de cadeado do seu navegador para afinar seu instrumento.',
          errorType: 'permission_denied',
        };
      }
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        return {
          success: false,
          error: 'Nenhum microfone encontrado. Conecte um microfone, fone de ouvido ou interface de áudio.',
          errorType: 'not_found',
        };
      }
      if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        return {
          success: false,
          error: 'O microfone está em uso por outro aplicativo ou aba. Feche outros aplicativos de gravação e tente novamente.',
          errorType: 'device_busy',
        };
      }
      return {
        success: false,
        error: `Erro ao iniciar captura de áudio: ${err.message || 'Falha desconhecida'}`,
        errorType: 'unknown',
      };
    } finally {
      this.isAcquiringMicrophone = false;
    }
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

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch {}
      this.mediaStream = null;
    }

    // Se o AudioContext NÃO for compartilhado, fecha-o; se for compartilhado, mantém aberto
    if (this.audioCtx && !this.isSharedAudioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }

    this.recentDetections = [];
    this.prevRms = 0;
  }

  /**
   * Núcleo YIN para cálculo da função de diferença média cumulativa normalizada (CMNDF)
   * com interpolação parabólica sub-amostral e verificação de harmônicos.
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

    // 1. Função de Diferença d(tau) = sum_{j=0}^{W-1} (x[j] - x[j + tau])^2
    const d = new Float32Array(maxPeriod + 1);
    for (let tau = 1; tau <= maxPeriod; tau++) {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        const diff = buf[j] - buf[j + tau];
        sum += diff * diff;
      }
      d[tau] = sum;
    }

    // 2. CMNDF: d'(tau)
    const dPrime = new Float32Array(maxPeriod + 1);
    dPrime[0] = 1;
    let runningSum = 0;
    for (let tau = 1; tau <= maxPeriod; tau++) {
      runningSum += d[tau];
      dPrime[tau] = runningSum > 0 ? (d[tau] * tau) / runningSum : 1;
    }

    // 3. Contagem de vales para salvaguarda polifônica
    let dipCount = 0;
    for (let tau = minPeriod + 1; tau < maxPeriod - 1; tau++) {
      if (dPrime[tau] < dPrime[tau - 1] && dPrime[tau] < dPrime[tau + 1] && dPrime[tau] < 0.35) {
        dipCount++;
      }
    }

    // 4. Limiar Absoluto: encontra o primeiro vale onde d'(tau) < threshold
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

    // Se nenhum valor estiver abaixo do limiar, encontra o mínimo global
    if (tauCandidate === -1) {
      let minVal = 1.0;
      let minTau = -1;
      for (let tau = minPeriod; tau <= maxPeriod; tau++) {
        if (dPrime[tau] < minVal) {
          minVal = dPrime[tau];
          minTau = tau;
        }
      }
      if (minVal < 0.45 && minTau !== -1) {
        tauCandidate = minTau;
      }
    }

    if (tauCandidate === -1) return null;

    // 5. Supressão de Erro de Oitava / Verificação Subharmônica:
    // Garante que tauCandidate não é um múltiplo harmônico se a fundamental estiver clara
    for (let mult = 2; mult <= 3; mult++) {
      const multTau = Math.round(tauCandidate * mult);
      if (multTau <= maxPeriod && dPrime[multTau] < threshold * 1.5 && dPrime[multTau] < dPrime[tauCandidate] * 1.25) {
        let localMinTau = multTau;
        let localMinVal = dPrime[multTau];
        for (let dt = -2; dt <= 2; dt++) {
          const t = multTau + dt;
          if (t >= minPeriod && t <= maxPeriod && dPrime[t] < localMinVal) {
            localMinVal = dPrime[t];
            localMinTau = t;
          }
        }
        if (localMinVal < 0.20) {
          tauCandidate = localMinTau;
          break;
        }
      }
    }

    // 6. Interpolação Parabólica Sub-amostral para precisão milimétrica
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
      dipCount,
      dPrimeVal: dPrime[tauCandidate]
    };
  }

  /**
   * Algoritmo YIN com interpolação parabólica sub-amostral, decimação adaptativa para graves,
   * detecção de onset e salvaguarda polifônica.
   */
  detectPitchFromBuffer(
    buffer: Float32Array,
    sampleRate = 44100,
    rangeOverride?: { lowCutoff?: number; highCutoff?: number; a4?: number; targetString?: TargetStringRef | null }
  ): PitchDetectionResult | null {
    const bufferLen = buffer.length;
    const effectiveLow = rangeOverride?.lowCutoff ?? this.lowCutoff;
    const effectiveHigh = rangeOverride?.highCutoff ?? this.highCutoff;
    const effectiveA4 = rangeOverride?.a4 ?? this.a4Calibration;
    const effectiveTarget = rangeOverride?.targetString !== undefined ? rangeOverride.targetString : this.targetString;

    // 1. Cálculo de RMS (Energy)
    let sumSquares = 0;
    for (let i = 0; i < bufferLen; i++) {
      sumSquares += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sumSquares / bufferLen);
    const intensity = Math.min(1.0, rms * 10);

    // Detecção de onset (ataque percussivo): aumento expressivo de energia
    const isOnset = rms > 0.025 && rms > this.prevRms * 1.7;
    this.prevRms = rms;

    // Rastreamento contínuo adaptativo do piso de ruído do ambiente
    if (rms < 0.02) {
      this.noiseFloor = this.noiseFloor * 0.95 + rms * 0.05;
    }

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
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    // 3. Execução do YIN direto em taxa total
    let yinRes = this.runYinCore(
      buffer,
      sampleRate,
      Math.max(45, effectiveLow),
      effectiveHigh,
      0.15
    );

    // 4. Decimação adaptativa 2:1 para graves e subgraves (B0 ~ 30.87 Hz, E1 ~ 41.2 Hz, etc.)
    // Se a frequência detectada for grave (< 65 Hz), ou se não houver pitch confiável e o limite inferior permitir
    if ((!yinRes || yinRes.freq < 65 || yinRes.confidence < 0.60) && effectiveLow < 55) {
      const halfLen = Math.floor(bufferLen / 2);
      const decimated = new Float32Array(halfLen);
      for (let i = 0; i < halfLen; i++) {
        decimated[i] = 0.5 * (buffer[2 * i] + buffer[2 * i + 1]);
      }
      const lowYin = this.runYinCore(
        decimated,
        sampleRate / 2,
        effectiveLow,
        130,
        0.18
      );
      if (lowYin && (!yinRes || lowYin.confidence > yinRes.confidence)) {
        yinRes = lowYin;
      }
    }

    // Decimação adaptativa 4:1 adicional para subgraves extremos (B0 ~ 30.87 Hz em contrabaixos de 5 e 6 cordas)
    if ((!yinRes || yinRes.freq < 45 || yinRes.confidence < 0.60) && effectiveLow <= 45 && bufferLen >= 2048) {
      const quarterLen = Math.floor(bufferLen / 4);
      const quadDecimated = new Float32Array(quarterLen);
      for (let i = 0; i < quarterLen; i++) {
        quadDecimated[i] = 0.25 * (buffer[4 * i] + buffer[4 * i + 1] + buffer[4 * i + 2] + buffer[4 * i + 3]);
      }
      const subBassYin = this.runYinCore(
        quadDecimated,
        sampleRate / 4,
        effectiveLow,
        90,
        0.20
      );
      if (subBassYin && (!yinRes || subBassYin.confidence > yinRes.confidence)) {
        yinRes = subBassYin;
      }
    }

    // 5. Salvaguarda Polifônica:
    // Múltiplos vales independentes profundos indicam que um acorde ou várias cordas estão soando simultaneamente
    if (yinRes && yinRes.dipCount >= 4 && yinRes.confidence < 0.85 && rms > 0.035) {
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: parseFloat(yinRes.confidence.toFixed(2)),
        intensity,
        isSilence: false,
        isWeakSignal: false,
        isOnset: false,
        detectionType: 'polyphonic_ambiguous',
        polyphonicWarning: 'Múltiplas cordas soando (polifonia) — toque apenas uma corda isolada.',
        stability: 30,
        stabilityLabel: 'Polifonia detectada',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    // 6. Limiar de Confiança e Rejeição de Sinal Fraco
    if (!yinRes || yinRes.confidence < this.confidenceThreshold) {
      const isWeak = yinRes !== null && yinRes.confidence >= 0.30 && rms >= this.silenceThreshold;
      return {
        frequency: 0,
        note: null,
        notePt: null,
        octave: null,
        cents: 0,
        confidence: parseFloat(Math.max(0, yinRes?.confidence || 0).toFixed(2)),
        intensity,
        isSilence: false,
        isWeakSignal: isWeak,
        isOnset,
        detectionType: isWeak ? 'weak_signal' : 'silence',
        stability: 0,
        stabilityLabel: isWeak ? 'Sinal muito fraco' : 'Instável',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    const frequency = parseFloat(yinRes.freq.toFixed(2));

    // Verificação de limites de faixa
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
        stability: 0,
        stabilityLabel: 'Fora da faixa',
        expectedFreq: 0,
        diffHz: 0,
        timestamp: Date.now()
      };
    }

    // 7. Conversão de frequência para nota, oitava e cents com calibração A4
    const pitchDetails = this.frequencyToPitch(frequency, effectiveA4, effectiveTarget);

    // 8. Registro de estabilidade em janela móvel
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
      confidence: parseFloat(yinRes.confidence.toFixed(2)),
      intensity,
      isSilence: false,
      isWeakSignal: false,
      isOnset,
      detectionType: 'monophonic_note',
      stability: stabilityInfo.score,
      stabilityLabel: stabilityInfo.label,
      expectedFreq: pitchDetails.expectedFreq,
      diffHz: pitchDetails.diffHz,
      timestamp: Date.now()
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
      return { score: 75, label: 'Calibrando' };
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

    // Se uma corda específica estiver selecionada no modo manual, calcula os cents em relação a ela
    if (targetString) {
      let normTargetNote = targetString.note.trim();
      if (ENHARMONIC_EQUIVALENTS[normTargetNote]) {
        normTargetNote = ENHARMONIC_EQUIVALENTS[normTargetNote];
      }
      const noteIdx = (NOTE_NAMES as readonly string[]).indexOf(normTargetNote as any);
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

    // Modo Automático / Cromático Universal
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
    let note = String(noteInput).trim();
    if (ENHARMONIC_EQUIVALENTS[note]) {
      note = ENHARMONIC_EQUIVALENTS[note];
    }
    const noteIndex = (NOTE_NAMES as readonly string[]).indexOf(note as any);
    if (noteIndex === -1) {
      throw new Error(`Nota inválida: ${noteInput}`);
    }
    const midiNum = (octave + 1) * 12 + noteIndex;
    const baseFreq = a4 * Math.pow(2, (midiNum - 69 + cents / 100) / 12);
    return parseFloat(baseFreq.toFixed(2));
  }

  /**
   * Toca um tom senoidal de referência para afinação de ouvido com envelope ADSR suave (sem estalos).
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
      // Fade-in suave de 30ms para evitar estalo no início
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.03);

      if (durationMs > 0) {
        const stopTime = now + durationMs / 1000;
        // Fade-out suave de 80ms no final
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

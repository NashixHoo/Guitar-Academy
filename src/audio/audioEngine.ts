/**
 * Web Audio Engine for Guitar Academy
 * Provides:
 * 1. High-precision Lookahead Metronome (drift-free audio scheduling)
 * 2. Plucked-string guitar synthesis (multi-harmonic decay & filtering)
 * 3. Chord strumming & arpeggiation
 * 4. Ear training intervals and chords
 */

export type AudioInstrumentType = 'guitar' | 'violao' | 'bass' | 'piano' | 'drums';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isUnlocked: boolean = false;
  private activeAudioNodes: Set<{ stop?: () => void; disconnect?: () => void }> = new Set();

  // Metronome scheduler state
  private metronomeTimerId: number | null = null;
  private isMetronomeRunning: boolean = false;
  private nextBeatTime: number = 0;
  private currentBeat: number = 0; // 0 to beatsPerMeasure - 1
  private currentMeasure: number = 0;
  private onBeatCallback: ((beatIndex: number, measureIndex: number, isAccent: boolean) => void) | null = null;

  // Metronome parameters
  private bpm: number = 100;
  private beatsPerMeasure: number = 4;
  private subdivision: 'quarter' | 'eighth' | 'triplet' | 'sixteenth' = 'quarter';
  private accentFirstBeat: boolean = true;
  private metronomeVolume: number = 0.8;

  // Speed trainer
  private speedTrainer = {
    enabled: false,
    bpmIncrement: 5,
    everyMeasures: 4,
    targetBpm: 160,
  };
  private onBpmChangeCallback: ((newBpm: number) => void) | null = null;

  private hasSetupLifecycleListeners: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
    if (typeof window !== 'undefined') {
      this.setupLifecycleListeners();
    }
  }

  public async initAudio(): Promise<AudioContext> {
    if (!this.ctx) {
      if (typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('AudioContext resume pendente de interação do usuário:', err);
      }
    }
    this.isUnlocked = this.ctx?.state === 'running';
    return this.ctx as AudioContext;
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  public getContextState(): AudioContextState | 'uninitialized' {
    return this.ctx ? this.ctx.state : 'uninitialized';
  }

  public isContextSuspended(): boolean {
    return this.ctx?.state === 'suspended';
  }

  public isMetronomeActive(): boolean {
    return this.isMetronomeRunning;
  }

  /**
   * Tenta recuperar com segurança o contexto de áudio após suspensão pelo navegador/SO
   */
  public async resumeAudio(): Promise<boolean> {
    if (!this.ctx) {
      await this.initAudio();
      const currentCtx = this.ctx as AudioContext | null;
      return currentCtx !== null && currentCtx.state === 'running';
    }

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('Falha ao retomar AudioContext:', err);
        return false;
      }
    }

    this.isUnlocked = this.ctx.state === 'running';
    return this.isUnlocked;
  }

  /**
   * Liberação completa de recursos e encerramento do AudioContext
   */
  public async closeAudio(): Promise<void> {
    this.stopMetronome();
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        await this.ctx.close();
      } catch {}
      this.ctx = null;
    }
    this.isUnlocked = false;
  }

  private setupLifecycleListeners() {
    if (this.hasSetupLifecycleListeners) return;
    this.hasSetupLifecycleListeners = true;

    // Desbloqueio global imediato no primeiro gesto do usuário em desktop ou mobile
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initAudio().then(() => this.resumeAudio()).catch(() => {});
      };
      ['pointerdown', 'touchstart', 'keydown'].forEach((eventName) => {
        window.addEventListener(eventName, unlockAudio, { once: true, passive: true });
      });
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.ctx && this.ctx.state === 'suspended' && this.isMetronomeRunning) {
          this.resumeAudio();
        }
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('pageshow', () => {
        if (this.ctx && this.ctx.state === 'suspended' && this.isMetronomeRunning) {
          this.resumeAudio();
        }
      });
    }
  }

  public setMasterVolume(val: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, val));
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.02);
    }
  }

  /**
   * Síntese acústica multi-instrumento centralizada para todo o aplicativo
   * @param frequency Frequência da nota em Hz
   * @param duration Duração do som em segundos
   * @param velocity Dinâmica / intensidade sonora (0.1 a 1.0)
   * @param instrument Timbre: 'guitar' (guitarra), 'violao' (acústico), 'bass' (baixo), 'piano' (piano), 'drums' (percussão)
   * @param time Timestamp agendado (padrão: currentTime)
   */
  public playNote(
    frequency: number,
    duration: number = 2.0,
    velocity: number = 0.7,
    instrument: AudioInstrumentType = 'guitar',
    time?: number
  ): void {
    if (!this.ctx || !this.masterGain) {
      this.initAudio().then(() => this.playNote(frequency, duration, velocity, instrument, time));
      return;
    }

    const t = time ?? this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    gainNode.connect(this.masterGain);

    const activeRecord: { stop?: () => void; disconnect?: () => void } = {
      disconnect: () => {
        try { gainNode.disconnect(); } catch {}
      }
    };
    this.activeAudioNodes.add(activeRecord);

    const cleanup = () => {
      this.activeAudioNodes.delete(activeRecord);
      try { gainNode.disconnect(); } catch {}
    };

    if (instrument === 'drums') {
      // Síntese percussiva (kick / snare / rimshot click)
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      const startPitch = Math.max(80, frequency * 1.5);
      osc.frequency.setValueAtTime(startPitch, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.06);

      gainNode.gain.setValueAtTime(0.0001, t);
      gainNode.gain.linearRampToValueAtTime(velocity * 0.9, t + 0.003);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(0.35, duration));

      osc.connect(gainNode);
      osc.start(t);
      osc.stop(t + Math.min(0.35, duration) + 0.02);
      osc.onended = cleanup;
      return;
    }

    if (instrument === 'bass') {
      // Síntese de contrabaixo encorpado (fundamental senoidal pura + 1º harmônico triangular)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, t);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 2, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(1200, frequency * 4), t);
      filter.frequency.exponentialRampToValueAtTime(Math.min(400, frequency * 1.8), t + duration * 0.8);

      gainNode.gain.setValueAtTime(0.0001, t);
      gainNode.gain.linearRampToValueAtTime(velocity * 0.8, t + 0.012);
      gainNode.gain.exponentialRampToValueAtTime(velocity * 0.45, t + 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + duration + 0.05);
      osc2.stop(t + duration + 0.05);
      osc1.onended = cleanup;
      return;
    }

    if (instrument === 'violao') {
      // Síntese de violão acústico (nylon/aço): caloroso, ressonância de corpo e decay natural
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const bodyFilter = this.ctx.createBiquadFilter();
      const lowpass = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(frequency, t);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2, t);

      bodyFilter.type = 'peaking';
      bodyFilter.frequency.setValueAtTime(220, t);
      bodyFilter.gain.setValueAtTime(3.5, t);
      bodyFilter.Q.setValueAtTime(1.2, t);

      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(Math.min(4800, frequency * 5), t);
      lowpass.frequency.exponentialRampToValueAtTime(frequency * 1.6, t + duration * 0.7);

      gainNode.gain.setValueAtTime(0.0001, t);
      gainNode.gain.linearRampToValueAtTime(velocity * 0.55, t + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(velocity * 0.28, t + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc1.connect(bodyFilter);
      osc2.connect(bodyFilter);
      bodyFilter.connect(lowpass);
      lowpass.connect(gainNode);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + duration + 0.05);
      osc2.stop(t + duration + 0.05);
      osc1.onended = cleanup;
      return;
    }

    if (instrument === 'piano') {
      // Síntese de piano acústico (ataque percussivo + harmônicos ricos e límpidos)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(frequency, t);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2.001, t);

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(frequency * 3.002, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(7000, frequency * 8), t);
      filter.frequency.exponentialRampToValueAtTime(frequency * 2.0, t + duration * 0.85);

      gainNode.gain.setValueAtTime(0.0001, t);
      gainNode.gain.linearRampToValueAtTime(velocity * 0.7, t + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(velocity * 0.35, t + 0.07);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gainNode);

      osc1.start(t);
      osc2.start(t);
      osc3.start(t);
      osc1.stop(t + duration + 0.05);
      osc2.stop(t + duration + 0.05);
      osc3.stop(t + duration + 0.05);
      osc1.onended = cleanup;
      return;
    }

    // Default 'guitar' (guitarra elétrica com harmônicos ricos e brilho de palheta)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, t);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(frequency * 1.002, t);

    filter.type = 'lowpass';
    const initialCutoff = Math.min(6000, frequency * 6);
    filter.frequency.setValueAtTime(initialCutoff, t);
    filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, t + duration * 0.7);

    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(velocity * 0.45, t + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(velocity * 0.22, t + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration + 0.05);
    osc2.stop(t + duration + 0.05);
    osc1.onended = cleanup;
  }

  /**
   * Compatibilidade garantida com código legado
   */
  public playGuitarNote(frequency: number, duration: number = 2.0, velocity: number = 0.7, time?: number): void {
    this.playNote(frequency, duration, velocity, 'guitar', time);
  }

  /**
   * Emissão de tom contínuo de referência para afinação e percepção de altura
   */
  public playReferenceTone(frequency: number, duration: number = 3.0): void {
    if (!this.ctx || !this.masterGain) {
      this.initAudio().then(() => this.playReferenceTone(frequency, duration));
      return;
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
    gain.gain.setValueAtTime(0.35, t + duration - 0.05);
    gain.gain.linearRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  /**
   * Execução instantânea de clique de metrônomo para verificação
   */
  public playMetronomeClick(isAccent: boolean = false, isSubdivision: boolean = false): void {
    if (!this.ctx || !this.masterGain) {
      this.initAudio().then(() => this.playMetronomeClick(isAccent, isSubdivision));
      return;
    }
    this.scheduleClick(this.ctx.currentTime, isAccent, isSubdivision);
  }

  /**
   * Teste imediato de áudio do metrônomo (tempo forte acentuado + tempo fraco)
   */
  public testMetronomeSound(): void {
    this.initAudio().then(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      this.scheduleClick(t, true, false);
      this.scheduleClick(t + 0.35, false, false);
    });
  }

  /**
   * Execução sequencial de exemplos de notas e melodias em exercícios
   */
  public playExample(
    notesOrFrequencies: number[],
    tempoBpm: number = 100,
    instrument: AudioInstrumentType = 'guitar'
  ): void {
    if (!this.ctx || !this.masterGain) {
      this.initAudio().then(() => this.playExample(notesOrFrequencies, tempoBpm, instrument));
      return;
    }

    const secondsPerBeat = 60.0 / Math.max(30, tempoBpm);
    const startT = this.ctx.currentTime + 0.05;

    notesOrFrequencies.forEach((freq, idx) => {
      this.playNote(freq, secondsPerBeat * 0.9, 0.7, instrument, startT + idx * secondsPerBeat);
    });
  }

  /**
   * Interrompe todos os sons ativos e silencia o motor de áudio
   */
  public stopAllSounds(): void {
    this.stopMetronome();
    this.activeAudioNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {}
    });
    this.activeAudioNodes.clear();
  }

  /**
   * Toca acordes dedilhados (arpejo) ou batidos (strum)
   */
  public playChord(
    frequencies: number[],
    arpeggio: boolean = false,
    strumSpeedMs: number = 30,
    instrument: AudioInstrumentType = 'guitar'
  ): void {
    if (!this.ctx || !this.masterGain) {
      this.initAudio().then(() => this.playChord(frequencies, arpeggio, strumSpeedMs, instrument));
      return;
    }

    const startT = this.ctx.currentTime;
    frequencies.forEach((freq, idx) => {
      const delay = arpeggio ? idx * 0.18 : idx * (strumSpeedMs / 1000);
      this.playNote(freq, 2.5, 0.65 - idx * 0.03, instrument, startT + delay);
    });
  }

  /**
   * Convert pitch and octave (e.g. E2, A2, C4) to frequency in Hz
   */
  public noteToFrequency(note: string, octave: number): number {
    const semitoneMap: Record<string, number> = {
      'C': 0, 'C#': 1, 'Db': 1,
      'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4,
      'F': 5, 'F#': 6, 'Gb': 6,
      'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10,
      'B': 11
    };
    const semitonesFromC0 = octave * 12 + (semitoneMap[note] ?? 0);
    // A4 (440Hz) is octave 4, note A -> 4 * 12 + 9 = 57
    const semitonesFromA4 = semitonesFromC0 - 57;
    return 440 * Math.pow(2, semitonesFromA4 / 12);
  }

  /* =======================================================================
   * HIGH-PRECISION WEB AUDIO METRONOME (LOOKAHEAD SCHEDULER)
   * ======================================================================= */

  public startMetronome(
    bpm: number,
    beatsPerMeasure: number,
    subdivision: 'quarter' | 'eighth' | 'triplet' | 'sixteenth',
    accentFirstBeat: boolean,
    onBeat: (beatIndex: number, measureIndex: number, isAccent: boolean) => void,
    onBpmChange?: (newBpm: number) => void
  ) {
    this.bpm = bpm;
    this.beatsPerMeasure = beatsPerMeasure;
    this.subdivision = subdivision;
    this.accentFirstBeat = accentFirstBeat;
    this.onBeatCallback = onBeat;
    this.onBpmChangeCallback = onBpmChange || null;

    this.initAudio().then(() => {
      if (!this.ctx) return;
      this.isMetronomeRunning = true;
      this.currentBeat = 0;
      this.currentMeasure = 0;
      this.nextBeatTime = this.ctx.currentTime + 0.05;

      this.scheduleLoop();
    });
  }

  public stopMetronome() {
    this.isMetronomeRunning = false;
    if (this.metronomeTimerId !== null) {
      clearTimeout(this.metronomeTimerId);
      this.metronomeTimerId = null;
    }
  }

  public updateMetronomeParams(
    bpm?: number,
    beatsPerMeasure?: number,
    subdivision?: 'quarter' | 'eighth' | 'triplet' | 'sixteenth',
    accentFirstBeat?: boolean,
    volume?: number
  ) {
    if (bpm !== undefined) this.bpm = bpm;
    if (beatsPerMeasure !== undefined) this.beatsPerMeasure = beatsPerMeasure;
    if (subdivision !== undefined) this.subdivision = subdivision;
    if (accentFirstBeat !== undefined) this.accentFirstBeat = accentFirstBeat;
    if (volume !== undefined) this.metronomeVolume = Math.max(0, Math.min(1, volume));
  }

  public configureSpeedTrainer(enabled: boolean, increment: number, everyMeasures: number, target: number) {
    this.speedTrainer = {
      enabled,
      bpmIncrement: increment,
      everyMeasures,
      targetBpm: target,
    };
  }

  private getSubdivisionMultiplier(): number {
    switch (this.subdivision) {
      case 'eighth': return 2;
      case 'triplet': return 3;
      case 'sixteenth': return 4;
      case 'quarter':
      default: return 1;
    }
  }

  private scheduleLoop = () => {
    if (!this.isMetronomeRunning || !this.ctx) return;

    const scheduleAheadTime = 0.1; // schedule 100ms in advance
    const subMultiplier = this.getSubdivisionMultiplier();
    const secondsPerQuarter = 60.0 / this.bpm;
    const secondsPerSubBeat = secondsPerQuarter / subMultiplier;

    // Prevenção de acúmulo de agendamentos ("metronome burst") ao retornar de suspensão no mobile
    if (this.nextBeatTime < this.ctx.currentTime) {
      this.nextBeatTime = this.ctx.currentTime + 0.05;
    }

    while (this.nextBeatTime < this.ctx.currentTime + scheduleAheadTime) {
      const isQuarterBeat = (this.currentBeat % subMultiplier) === 0;
      const quarterBeatIndex = Math.floor(this.currentBeat / subMultiplier);
      const isFirstBeatOfMeasure = quarterBeatIndex === 0 && isQuarterBeat;
      const isAccent = this.accentFirstBeat && isFirstBeatOfMeasure;

      // Play click sound
      this.scheduleClick(this.nextBeatTime, isAccent, !isQuarterBeat);

      // Trigger UI callback at exact audio time via setTimeout
      if (isQuarterBeat && this.onBeatCallback) {
        const beatToReport = quarterBeatIndex;
        const measureToReport = this.currentMeasure;
        const deltaMs = Math.max(0, (this.nextBeatTime - this.ctx.currentTime) * 1000);
        setTimeout(() => {
          if (this.isMetronomeRunning && this.onBeatCallback) {
            this.onBeatCallback(beatToReport, measureToReport, isAccent);
          }
        }, deltaMs);
      }

      // Advance
      this.nextBeatTime += secondsPerSubBeat;
      this.currentBeat++;

      const totalSubBeatsPerMeasure = this.beatsPerMeasure * subMultiplier;
      if (this.currentBeat >= totalSubBeatsPerMeasure) {
        this.currentBeat = 0;
        this.currentMeasure++;

        // Speed Trainer: increase tempo every N measures
        if (this.speedTrainer.enabled && this.currentMeasure > 0 && this.currentMeasure % this.speedTrainer.everyMeasures === 0) {
          if (this.bpm < this.speedTrainer.targetBpm) {
            this.bpm = Math.min(this.speedTrainer.targetBpm, this.bpm + this.speedTrainer.bpmIncrement);
            if (this.onBpmChangeCallback) {
              this.onBpmChangeCallback(this.bpm);
            }
          }
        }
      }
    }

    this.metronomeTimerId = window.setTimeout(this.scheduleLoop, 25);
  };

  /**
   * High-definition synthesized woodblock / rimshot metronome click
   */
  private scheduleClick(time: number, isAccent: boolean, isSubdivision: boolean) {
    if (!this.ctx || !this.masterGain || this.metronomeVolume <= 0.01) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Woodblock high pitch for accent, punchy mid for normal, gentle low for subdivisions
    let freq = 1600;
    let clickGain = 0.5 * this.metronomeVolume;
    let duration = 0.035;

    if (isAccent) {
      freq = 2400;
      clickGain = 0.85 * this.metronomeVolume;
      duration = 0.045;
    } else if (isSubdivision) {
      freq = 1100;
      clickGain = 0.22 * this.metronomeVolume;
      duration = 0.02;
    }

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(clickGain, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.01);
  }

  /**
   * Sound an alert tone (e.g. at end of study timer)
   */
  public playCompletionChime() {
    if (!this.ctx || !this.masterGain) {
      this.initAudio().then(() => this.playCompletionChime());
      return;
    }
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      this.playGuitarNote(freq, 1.2, 0.4, this.ctx!.currentTime + i * 0.12);
    });
  }
}

export const audioEngine = new AudioEngine();

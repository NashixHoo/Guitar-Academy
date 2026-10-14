/**
 * Web Audio Engine for Guitar Academy
 * Provides:
 * 1. High-precision Lookahead Metronome (drift-free audio scheduling)
 * 2. Plucked-string guitar synthesis (multi-harmonic decay & filtering)
 * 3. Chord strumming & arpeggiation
 * 4. Ear training intervals and chords
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isUnlocked: boolean = false;

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

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  public async initAudio(): Promise<AudioContext> {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.isUnlocked = true;
    return this.ctx;
  }

  public setMasterVolume(val: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, val));
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.02);
    }
  }

  /**
   * Synthesize a plucked guitar note
   * @param frequency Frequency in Hz
   * @param duration Duration in seconds
   * @param velocity Dynamics (0.1 to 1.0)
   * @param time Scheduled time (defaults to currentTime)
   */
  public playGuitarNote(frequency: number, duration: number = 2.0, velocity: number = 0.7, time?: number): void {
    if (!this.ctx || !this.masterGain) {
      this.initAudio().then(() => this.playGuitarNote(frequency, duration, velocity, time));
      return;
    }

    const t = time ?? this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Fundamental (triangle for warmth) + slight detuned sawtooth for rich string harmonics
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, t);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(frequency * 1.002, t);

    // Dynamic low-pass filter: starts bright (pluck attack) and damps down
    filter.type = 'lowpass';
    const initialCutoff = Math.min(6000, frequency * 6);
    filter.frequency.setValueAtTime(initialCutoff, t);
    filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, t + duration * 0.7);

    // Amplitude envelope: instantaneous pluck attack, sharp transient decay, then singing sustain
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.linearRampToValueAtTime(velocity * 0.45, t + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(velocity * 0.22, t + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    // Routing
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration + 0.05);
    osc2.stop(t + duration + 0.05);
  }

  /**
   * Play multiple notes as an acoustic guitar strum or arpeggio
   */
  public playChord(frequencies: number[], arpeggio: boolean = false, strumSpeedMs: number = 30): void {
    if (!this.ctx || !this.masterGain) {
      this.initAudio().then(() => this.playChord(frequencies, arpeggio, strumSpeedMs));
      return;
    }

    const startT = this.ctx.currentTime;
    frequencies.forEach((freq, idx) => {
      const delay = arpeggio ? (idx * 0.18) : (idx * (strumSpeedMs / 1000));
      this.playGuitarNote(freq, 2.5, 0.65 - idx * 0.03, startT + delay);
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

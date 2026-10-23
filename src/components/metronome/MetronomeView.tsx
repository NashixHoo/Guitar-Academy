import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../../audio/audioEngine';
import { storageService } from '../../services/storageService';
import { MetronomeConfig } from '../../types';
import { Play, Pause, Square, Volume2, Timer, Flame, RefreshCw, Zap, Minus, Plus } from 'lucide-react';

export const MetronomeView: React.FC = () => {
  const [config, setConfig] = useState<MetronomeConfig>(() => storageService.loadMetronome());
  const [isRunning, setIsRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [measureCount, setMeasureCount] = useState(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const tapTimesRef = useRef<number[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    storageService.saveMetronome(config);
    audioEngine.updateMetronomeParams(
      config.bpm,
      config.timeSignature.beats,
      config.subdivision,
      config.accentFirstBeat,
      config.volume
    );
    audioEngine.configureSpeedTrainer(
      config.speedTrainer.enabled,
      config.speedTrainer.bpmIncrement,
      config.speedTrainer.everyMeasures,
      config.speedTrainer.targetBpm
    );
  }, [config]);

  useEffect(() => {
    if (isTimerActive && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            handleStop();
            audioEngine.playCompletionChime();
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerActive, timerSecondsLeft]);

  useEffect(() => {
    return () => {
      audioEngine.stopMetronome();
    };
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    setMeasureCount(0);
    if (config.timerMinutes > 0 && timerSecondsLeft === null) {
      setTimerSecondsLeft(config.timerMinutes * 60);
      setIsTimerActive(true);
    } else if (timerSecondsLeft !== null && timerSecondsLeft > 0) {
      setIsTimerActive(true);
    }

    audioEngine.startMetronome(
      config.bpm,
      config.timeSignature.beats,
      config.subdivision,
      config.accentFirstBeat,
      (beatIdx, measureIdx) => {
        setCurrentBeat(beatIdx);
        setMeasureCount(measureIdx);
      },
      (newBpm) => {
        setConfig((prev) => ({ ...prev, bpm: newBpm }));
      }
    );
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsTimerActive(false);
    audioEngine.stopMetronome();
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsTimerActive(false);
    setCurrentBeat(0);
    setMeasureCount(0);
    setTimerSecondsLeft(config.timerMinutes > 0 ? config.timerMinutes * 60 : null);
    audioEngine.stopMetronome();
  };

  const adjustBpm = (delta: number) => {
    setConfig((prev) => {
      const nextBpm = Math.max(30, Math.min(300, prev.bpm + delta));
      return { ...prev, bpm: nextBpm };
    });
  };

  const handleTapTempo = () => {
    const now = performance.now();
    const taps = tapTimesRef.current.filter((t) => now - t < 3000);
    taps.push(now);
    tapTimesRef.current = taps;

    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 30 && calculatedBpm <= 300) {
        setConfig((prev) => ({ ...prev, bpm: calculatedBpm }));
      }
    }
  };

  const getTempoItalianName = (bpm: number) => {
    if (bpm < 40) return 'Grave';
    if (bpm < 60) return 'Largo';
    if (bpm < 66) return 'Larghetto';
    if (bpm < 76) return 'Adagio';
    if (bpm < 108) return 'Andante';
    if (bpm < 120) return 'Moderato';
    if (bpm < 168) return 'Allegro';
    if (bpm < 200) return 'Presto';
    return 'Prestissimo';
  };

  const presets = [
    { label: 'Lento (Balada)', bpm: 60 },
    { label: 'Andante (Estudo)', bpm: 80 },
    { label: 'Moderato (Pop)', bpm: 100 },
    { label: 'Allegro (Rock)', bpm: 124 },
    { label: 'Presto (Veloz)', bpm: 156 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Main Meter Card */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-4 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle tortoiseshell top ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge" />

        {/* Header & Tempo Italian Label */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7B1E2B] animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-[#25252A]">Metrônomo de Precisão</h2>
            </div>
            <p className="text-xs text-[#666672] mt-0.5 font-medium">
              Agendamento de áudio sem latência via Web Audio API Lookahead
            </p>
          </div>
          <div className="px-3.5 py-1 rounded-full bg-[#F5E8EA] border border-[#E8D3D6] text-[#7B1E2B] font-bold text-xs tracking-wider uppercase">
            {getTempoItalianName(config.bpm)}
          </div>
        </div>

        {/* Visual Beat Indicator Dots */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 my-4 sm:my-6 py-3 sm:py-4 bg-[#F8F7F4] rounded-2xl border border-[#D9D9D9] overflow-x-auto no-scrollbar">
          {Array.from({ length: config.timeSignature.beats }).map((_, idx) => {
            const isCurrent = isRunning && currentBeat === idx;
            const isAccent = idx === 0 && config.accentFirstBeat;

            return (
              <div
                key={`beat-indicator-${idx}`}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div
                  className={`transition-all duration-100 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCurrent
                      ? isAccent
                        ? 'w-10 h-10 sm:w-14 sm:h-14 bg-[#B52A3A] text-white shadow-md scale-105 ring-2 sm:ring-4 ring-[#B52A3A]/30'
                        : 'w-10 h-10 sm:w-14 sm:h-14 bg-[#7B1E2B] text-white shadow-md scale-105 ring-2 sm:ring-4 ring-[#7B1E2B]/30'
                      : 'w-8 h-8 sm:w-12 sm:h-12 bg-white text-[#666672] border border-[#D9D9D9]'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-[9px] sm:text-[10px] text-[#666672] font-mono-code font-semibold">
                  {idx === 0 && config.accentFirstBeat ? 'Forte' : 'Fraco'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Big BPM Display & Rapid Adjust Buttons */}
        <div className="flex flex-col items-center justify-center my-3 sm:my-4">
          <div className="flex flex-wrap items-center justify-center gap-1.5 xs:gap-3 sm:gap-6">
            <button
              onClick={() => adjustBpm(-5)}
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:text-[#7B1E2B] active:scale-95 text-[#25252A] flex items-center justify-center font-bold text-xs sm:text-sm transition border border-[#D9D9D9]"
              title="-5 BPM"
            >
              -5
            </button>
            <button
              onClick={() => adjustBpm(-1)}
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:text-[#7B1E2B] active:scale-95 text-[#25252A] flex items-center justify-center transition border border-[#D9D9D9]"
              title="-1 BPM"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Direct BPM Number Input */}
            <div className="text-center px-1 sm:px-4">
              <input
                type="number"
                min={30}
                max={300}
                value={config.bpm}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    setConfig((prev) => ({ ...prev, bpm: Math.max(30, Math.min(300, val)) }));
                  }
                }}
                className="w-24 xs:w-28 sm:w-40 text-center font-black text-4xl sm:text-6xl text-[#25252A] bg-transparent border-b-2 border-[#7B1E2B]/40 focus:border-[#7B1E2B] focus:outline-none font-mono-code"
              />
              <div className="text-[10px] sm:text-xs font-bold text-[#7B1E2B] uppercase tracking-widest mt-1">
                Batidas Por Minuto (BPM)
              </div>
            </div>

            <button
              onClick={() => adjustBpm(1)}
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:text-[#7B1E2B] active:scale-95 text-[#25252A] flex items-center justify-center transition border border-[#D9D9D9]"
              title="+1 BPM"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => adjustBpm(5)}
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:text-[#7B1E2B] active:scale-95 text-[#25252A] flex items-center justify-center font-bold text-xs sm:text-sm transition border border-[#D9D9D9]"
              title="+5 BPM"
            >
              +5
            </button>
          </div>

          {/* BPM Slider Range */}
          <div className="w-full max-w-md mt-6 px-4">
            <input
              type="range"
              min={30}
              max={300}
              value={config.bpm}
              onChange={(e) => setConfig((prev) => ({ ...prev, bpm: parseInt(e.target.value, 10) }))}
              className="w-full accent-[#7B1E2B] cursor-pointer bg-[#D9D9D9]"
            />
            <div className="flex justify-between text-[11px] text-[#666672] font-mono-code mt-1 font-medium">
              <span>30 Min</span>
              <span>100 Normal</span>
              <span>200 Rápido</span>
              <span>300 Max</span>
            </div>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 bg-[#7B1E2B] text-white hover:bg-[#B52A3A] active:scale-95 px-8 py-3.5 rounded-2xl font-bold text-base shadow-sm transition"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Iniciar Metrônomo</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 bg-[#B52A3A] text-white hover:bg-[#991F2D] active:scale-95 px-8 py-3.5 rounded-2xl font-bold text-base shadow-sm transition"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pausar</span>
            </button>
          )}

          <button
            onClick={handleStop}
            className="flex items-center gap-2 bg-[#F8F7F4] hover:bg-[#F5E8EA] active:scale-95 text-[#25252A] border border-[#D9D9D9] px-5 py-3.5 rounded-2xl font-bold text-sm transition"
            title="Parar e Zerar"
          >
            <Square className="w-4 h-4" />
            <span>Zerar</span>
          </button>

          <button
            onClick={handleTapTempo}
            className="flex items-center gap-2 bg-[#F5E8EA] hover:bg-[#ebd3d6] active:scale-95 text-[#7B1E2B] border border-[#E8D3D6] px-5 py-3.5 rounded-2xl font-bold text-sm transition"
            title="Toque no ritmo desejado para calcular o BPM"
          >
            <Zap className="w-4 h-4 text-[#B52A3A]" />
            <span>Tap Tempo</span>
          </button>
        </div>

        {/* Measure Count & Training Timer Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#D9D9D9] text-xs text-[#666672]">
          <div className="flex items-center gap-2 font-mono-code font-medium">
            <span>Compassos executados:</span>
            <span className="font-bold text-[#25252A] text-sm bg-[#F8F7F4] px-2.5 py-1 rounded-lg border border-[#D9D9D9]">
              {measureCount}
            </span>
          </div>

          {timerSecondsLeft !== null && (
            <div className="flex items-center gap-2 font-mono-code text-[#7B1E2B] font-bold">
              <Timer className="w-4 h-4" />
              <span>
                Temporizador:{' '}
                {Math.floor(timerSecondsLeft / 60)}:
                {String(timerSecondsLeft % 60).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Settings Grid: Time Signature, Subdivisions, Volume, Speed Trainer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Compasso e Subdivisões */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#25252A] flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#7B1E2B]" />
            <span>Compasso e Subdivisão Rítmica</span>
          </h3>

          <div>
            <label className="text-xs text-[#666672] block mb-2 font-semibold">
              Fórmula de Compasso:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { beats: 2, label: '2/4' },
                { beats: 3, label: '3/4' },
                { beats: 4, label: '4/4' },
                { beats: 6, label: '6/8' },
              ].map((sig) => (
                <button
                  key={`sig-${sig.label}`}
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      timeSignature: { beats: sig.beats, noteValue: 4 },
                    }))
                  }
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    config.timeSignature.beats === sig.beats
                      ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                      : 'bg-[#F8F7F4] text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
                  }`}
                >
                  {sig.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#666672] block mb-2 font-semibold">
              Subdivisão do Tempo:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'quarter', label: '1/4 Semínima' },
                { id: 'eighth', label: '1/8 Colcheia' },
                { id: 'triplet', label: '1/8T Tercina' },
                { id: 'sixteenth', label: '1/16 Semicolcheia' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      subdivision: sub.id as MetronomeConfig['subdivision'],
                    }))
                  }
                  className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold transition border ${
                    config.subdivision === sub.id
                      ? 'bg-[#F5E8EA] text-[#7B1E2B] border-[#7B1E2B] font-bold'
                      : 'bg-[#F8F7F4] text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.accentFirstBeat}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, accentFirstBeat: e.target.checked }))
                }
                className="w-4 h-4 accent-[#7B1E2B] rounded"
              />
              <span className="text-xs font-medium text-[#25252A]">
                Acentuar o primeiro tempo do compasso (som mais agudo)
              </span>
            </label>

            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-[#666672]" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={config.volume}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, volume: parseFloat(e.target.value) }))
                }
                className="flex-1 accent-[#7B1E2B] bg-[#D9D9D9]"
              />
              <span className="text-xs text-[#666672] font-mono-code w-10 font-bold">
                {Math.round(config.volume * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Speed Trainer & Presets */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#25252A] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#B52A3A]" />
            <span>Speed Trainer (Aceleração Automática)</span>
          </h3>

          <div className="bg-[#F8F7F4] p-4 rounded-xl border border-[#D9D9D9] space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.speedTrainer.enabled}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    speedTrainer: { ...prev.speedTrainer, enabled: e.target.checked },
                  }))
                }
                className="w-4 h-4 accent-[#7B1E2B] rounded"
              />
              <span className="text-xs font-bold text-[#7B1E2B]">
                Ativar Treino de Velocidade Gradual
              </span>
            </label>

            {config.speedTrainer.enabled && (
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[#666672] text-[10px] block font-semibold">Aumentar:</span>
                  <div className="flex items-center gap-1 font-mono-code text-[#25252A] font-bold">
                    <span>+{config.speedTrainer.bpmIncrement}</span>
                    <span className="text-[10px] text-[#666672]">BPM</span>
                  </div>
                </div>
                <div>
                  <span className="text-[#666672] text-[10px] block font-semibold">A cada:</span>
                  <div className="flex items-center gap-1 font-mono-code text-[#25252A] font-bold">
                    <span>{config.speedTrainer.everyMeasures}</span>
                    <span className="text-[10px] text-[#666672]">compassos</span>
                  </div>
                </div>
                <div>
                  <span className="text-[#666672] text-[10px] block font-semibold">Meta Máx:</span>
                  <div className="flex items-center gap-1 font-mono-code text-[#7B1E2B] font-bold">
                    <span>{config.speedTrainer.targetBpm}</span>
                    <span className="text-[10px] text-[#666672]">BPM</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-[#666672] block mb-2 font-semibold">
              Presets Rápidos de Estudo:
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.bpm}
                  onClick={() => setConfig((prev) => ({ ...prev, bpm: preset.bpm }))}
                  className="px-3 py-1.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:text-[#7B1E2B] text-xs font-semibold text-[#25252A] transition border border-[#D9D9D9]"
                >
                  {preset.label} ({preset.bpm})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

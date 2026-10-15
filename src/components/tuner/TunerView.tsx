import React, { useState, useEffect, useRef } from 'react';
import { guitarPitchDetector, PitchDetectionResult } from '../../audio/guitarPitchDetector';
import { TunerSmoother, TunerSmoothedOutput } from '../../audio/tunerSmoother';
import { Mic, MicOff, Volume2, VolumeX, ShieldCheck, HelpCircle, Activity, Sparkles, RefreshCw } from 'lucide-react';

interface TunerViewProps {
  onOpenLessonTuning?: () => void;
}

interface StringPreset {
  stringNumber: number;
  note: string;
  notePt: string;
  octave: number;
  freq: number;
  label: string;
}

const GUITAR_STRINGS: StringPreset[] = [
  { stringNumber: 6, note: 'E', notePt: 'Mi', octave: 2, freq: 82.4, label: '6ª Corda (Grave)' },
  { stringNumber: 5, note: 'A', notePt: 'Lá', octave: 2, freq: 110.0, label: '5ª Corda' },
  { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, freq: 146.8, label: '4ª Corda' },
  { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, freq: 196.0, label: '3ª Corda' },
  { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, freq: 246.9, label: '2ª Corda' },
  { stringNumber: 1, note: 'E', notePt: 'Mi', octave: 4, freq: 329.6, label: '1ª Corda (Aguda)' }
];

const BASS_STRINGS: StringPreset[] = [
  { stringNumber: 4, note: 'E', notePt: 'Mi', octave: 1, freq: 41.2, label: '4ª Corda (E1)' },
  { stringNumber: 3, note: 'A', notePt: 'Lá', octave: 1, freq: 55.0, label: '3ª Corda (A1)' },
  { stringNumber: 2, note: 'D', notePt: 'Ré', octave: 2, freq: 73.4, label: '2ª Corda (D2)' },
  { stringNumber: 1, note: 'G', notePt: 'Sol', octave: 2, freq: 98.0, label: '1ª Corda (G2)' }
];

export const TunerView: React.FC<TunerViewProps> = ({ onOpenLessonTuning }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<'electric_guitar' | 'acoustic_guitar' | 'bass' | 'chromatic'>('electric_guitar');
  const [playingRefString, setPlayingRefString] = useState<number | null>(null);

  const smootherRef = useRef<TunerSmoother>(new TunerSmoother({ alpha: 0.18, confidenceThreshold: 0.65 }));
  const [displayState, setDisplayState] = useState<TunerSmoothedOutput>({
    displayedCents: 0,
    displayedFreq: 0,
    displayedAngle: 0,
    note: null,
    notePt: null,
    octave: null,
    state: 'idle',
    isInTune: false,
    isNearTune: false,
    isWeakSignal: false,
    confidence: 0,
    expectedFreq: 0
  });

  const animLoopRef = useRef<number | null>(null);

  // Inicia ou pausa a escuta
  const handleToggleListening = async () => {
    if (isListening) {
      guitarPitchDetector.stopListening();
      smootherRef.current.reset();
      setIsListening(false);
      setErrorMessage(null);
      if (animLoopRef.current) {
        cancelAnimationFrame(animLoopRef.current);
        animLoopRef.current = null;
      }
    } else {
      setErrorMessage(null);
      smootherRef.current.reset();

      const result = await guitarPitchDetector.startListening((rawPitch) => {
        smootherRef.current.feedPitch(rawPitch);
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Falha ao acessar o microfone.');
        setIsListening(false);
      } else {
        setIsListening(true);

        const renderFrame = () => {
          const smoothed = smootherRef.current.step(performance.now());
          setDisplayState(smoothed);
          animLoopRef.current = requestAnimationFrame(renderFrame);
        };
        animLoopRef.current = requestAnimationFrame(renderFrame);
      }
    }
  };

  // Teardown completo no unmount
  useEffect(() => {
    return () => {
      guitarPitchDetector.stopListening();
      guitarPitchDetector.stopReferenceTone();
      if (animLoopRef.current) {
        cancelAnimationFrame(animLoopRef.current);
        animLoopRef.current = null;
      }
    };
  }, []);

  const handlePlayReference = (str: StringPreset) => {
    if (playingRefString === str.stringNumber) {
      guitarPitchDetector.stopReferenceTone();
      setPlayingRefString(null);
    } else {
      guitarPitchDetector.playReferenceTone(str.freq, 2500);
      setPlayingRefString(str.stringNumber);
      setTimeout(() => {
        setPlayingRefString((prev) => (prev === str.stringNumber ? null : prev));
      }, 2500);
    }
  };

  const activeStrings = selectedPreset === 'bass' ? BASS_STRINGS : GUITAR_STRINGS;

  // Status visual
  let statusBadge = {
    text: 'Aguardando som da guitarra...',
    bg: 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9]',
    color: '#666672'
  };

  if (!isListening) {
    statusBadge = {
      text: 'Microfone desligado',
      bg: 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9]',
      color: '#666672'
    };
  } else if (displayState.isWeakSignal) {
    statusBadge = {
      text: 'Sinal sonoro fraco — toque mais firme',
      bg: 'bg-amber-50 text-amber-700 border-amber-300',
      color: '#D97706'
    };
  } else if (displayState.isInTune) {
    statusBadge = {
      text: '✓ AFINADA COM PRECISÃO!',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      color: '#10B981'
    };
  } else if (displayState.isNearTune) {
    statusBadge = {
      text: 'Quase lá — ajuste fino',
      bg: 'bg-amber-50 text-amber-700 border-amber-300',
      color: '#F59E0B'
    };
  } else if (displayState.note) {
    const isFlat = displayState.displayedCents < 0;
    statusBadge = {
      text: isFlat ? 'Muito Baixa (Aperte a tarracha ♯)' : 'Muito Alta (Afrouxe a tarracha ♭)',
      bg: 'bg-[#F5E8EA] text-[#7B1E2B] border-[#E8D3D6]',
      color: '#7B1E2B'
    };
  }

  // Agulha limitada entre -45deg e +45deg
  const needleRotation = Math.max(-45, Math.min(45, displayState.displayedAngle));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7B1E2B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              🎸
            </div>
            <h1 className="text-2xl font-black text-[#25252A]">Afinador Pro — Microfone Real & DSP</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Detector de pitch da guitarra física com filtragem acústica, suavização matemática EMA e resposta em tempo real a 60 FPS.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleToggleListening}
          className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition shadow-xs ${
            isListening
              ? 'bg-[#1A1A20] text-white hover:bg-black'
              : 'bg-[#7B1E2B] text-white hover:bg-[#B52A3A]'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 text-rose-400" />
              <span>Pausar Afinador</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-emerald-300" />
              <span>Ligar Microfone Real</span>
            </>
          )}
        </button>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Permissão ou Dispositivo de Microfone</p>
            <p className="text-xs text-rose-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Tuner Gauge Box */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-center relative overflow-hidden">
        {/* Subtle background glow when in tune */}
        {displayState.isInTune && (
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none transition-all duration-300" />
        )}

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'electric_guitar', label: 'Guitarra (Giannini 101 HSS)' },
            { id: 'acoustic_guitar', label: 'Violão Acústico' },
            { id: 'bass', label: 'Baixo Elétrico (4C)' },
            { id: 'chromatic', label: 'Cromático Livre' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedPreset === preset.id
                  ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                  : 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9] hover:bg-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Large Analog Gauge Display */}
        <div className="relative max-w-sm mx-auto h-48 sm:h-56 flex flex-col items-center justify-end">
          {/* Curved Meter Arc */}
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 160">
            {/* Background Arc */}
            <path
              d="M 30 140 A 120 120 0 0 1 270 140"
              fill="none"
              stroke="#E5E5E5"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Flat zone (red/left) */}
            <path
              d="M 30 140 A 120 120 0 0 1 125 40"
              fill="none"
              stroke="#F5E8EA"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Center In-tune zone (green) */}
            <path
              d="M 135 34 A 120 120 0 0 1 165 34"
              fill="none"
              stroke="#10B981"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Sharp zone (red/right) */}
            <path
              d="M 175 40 A 120 120 0 0 1 270 140"
              fill="none"
              stroke="#F5E8EA"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Gauge Tick Marks */}
            {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((cent) => {
              const angleDeg = (cent / 50) * 45;
              const angleRad = ((angleDeg - 90) * Math.PI) / 180;
              const r1 = 120;
              const r2 = cent === 0 ? 100 : 108;
              const cx = 150;
              const cy = 140;
              const x1 = cx + r1 * Math.cos(angleRad);
              const y1 = cy + r1 * Math.sin(angleRad);
              const x2 = cx + r2 * Math.cos(angleRad);
              const y2 = cy + r2 * Math.sin(angleRad);

              return (
                <line
                  key={cent}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={cent === 0 ? '#10B981' : '#A0A0A8'}
                  strokeWidth={cent === 0 ? '3' : '1.5'}
                />
              );
            })}

            {/* Scale Numbers */}
            <text x="35" y="155" fill="#666672" fontSize="10" fontWeight="bold">-50♭</text>
            <text x="142" y="20" fill="#10B981" fontSize="12" fontWeight="900">0</text>
            <text x="245" y="155" fill="#666672" fontSize="10" fontWeight="bold">+50♯</text>

            {/* Physical Needle Pin & Pivot */}
            <g
              style={{
                transform: `rotate(${needleRotation}deg)`,
                transformOrigin: '150px 140px',
                transition: 'transform 0.05s linear'
              }}
            >
              <line
                x1="150"
                y1="140"
                x2="150"
                y2="28"
                stroke={displayState.isInTune ? '#10B981' : '#7B1E2B'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="150" cy="140" r="8" fill="#25252A" />
              <circle cx="150" cy="140" r="3.5" fill="#FFFFFF" />
            </g>
          </svg>
        </div>

        {/* Center Note Display */}
        <div className="space-y-2">
          {displayState.note ? (
            <div className="space-y-1">
              <div className="inline-flex items-baseline gap-2">
                <span className="text-6xl sm:text-7xl font-black text-[#25252A] tracking-tight">
                  {displayState.note}
                </span>
                <span className="text-2xl font-bold text-[#7B1E2B]">
                  {displayState.octave !== null ? displayState.octave : ''}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#666672]">
                Nota {displayState.notePt || displayState.note}
              </p>
            </div>
          ) : (
            <div className="py-4">
              <span className="text-4xl sm:text-5xl font-black text-[#D9D9D9]">
                --
              </span>
              <p className="text-xs text-[#666672] mt-1 font-medium">
                {isListening ? 'Toque uma corda na guitarra física...' : 'Clique em "Ligar Microfone Real" para começar'}
              </p>
            </div>
          )}

          {/* Status Badge */}
          <div className="pt-2">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border transition ${statusBadge.bg}`}
            >
              {statusBadge.text}
            </span>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 border-t border-[#D9D9D9]">
          <div className="bg-[#F8F7F4] p-3 rounded-2xl border border-[#D9D9D9] text-center">
            <span className="text-[10px] font-bold text-[#666672] uppercase block">Frequência Real</span>
            <span className="text-sm font-black text-[#25252A] font-mono-code">
              {displayState.displayedFreq > 0 ? `${displayState.displayedFreq} Hz` : '--'}
            </span>
          </div>

          <div className="bg-[#F8F7F4] p-3 rounded-2xl border border-[#D9D9D9] text-center">
            <span className="text-[10px] font-bold text-[#666672] uppercase block">Desvio em Cents</span>
            <span
              className={`text-sm font-black font-mono-code ${
                displayState.isInTune
                  ? 'text-emerald-600'
                  : Math.abs(displayState.displayedCents) > 10
                  ? 'text-[#7B1E2B]'
                  : 'text-amber-600'
              }`}
            >
              {displayState.note
                ? `${displayState.displayedCents > 0 ? '+' : ''}${displayState.displayedCents} ¢`
                : '--'}
            </span>
          </div>

          <div className="bg-[#F8F7F4] p-3 rounded-2xl border border-[#D9D9D9] text-center">
            <span className="text-[10px] font-bold text-[#666672] uppercase block">Frequência Alvo</span>
            <span className="text-sm font-black text-[#25252A] font-mono-code">
              {displayState.expectedFreq > 0 ? `${displayState.expectedFreq} Hz` : '--'}
            </span>
          </div>

          <div className="bg-[#F8F7F4] p-3 rounded-2xl border border-[#D9D9D9] text-center">
            <span className="text-[10px] font-bold text-[#666672] uppercase block">Confiança DSP</span>
            <span className="text-sm font-black text-emerald-600 font-mono-code">
              {displayState.confidence > 0 ? `${Math.round(displayState.confidence * 100)}%` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* String Reference Pitch & Ear Tuning Section */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-[#25252A] text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7B1E2B]" />
              Afinação das Cordas & Tons de Referência
            </h3>
            <p className="text-xs text-[#666672]">
              Clique em qualquer corda para ouvir a frequência senoidal de referência gerada via sintetizador Web Audio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {activeStrings.map((str) => {
            const isPlaying = playingRefString === str.stringNumber;
            const isCurrentDetected =
              displayState.note === str.note && displayState.octave === str.octave;

            return (
              <div
                key={str.stringNumber}
                className={`p-3.5 rounded-2xl border transition text-center space-y-2 ${
                  isCurrentDetected
                    ? displayState.isInTune
                      ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                      : 'bg-[#F5E8EA] border-[#7B1E2B] shadow-xs'
                    : 'bg-[#F8F7F4] border-[#D9D9D9]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-[#666672]">
                  <span>{str.stringNumber}ª Corda</span>
                  <span>{str.freq} Hz</span>
                </div>

                <div>
                  <span className="text-2xl font-black text-[#25252A] block">
                    {str.note}
                    <span className="text-xs text-[#7B1E2B] ml-0.5">{str.octave}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#666672]">
                    {str.notePt}
                  </span>
                </div>

                <button
                  onClick={() => handlePlayReference(str)}
                  className={`w-full py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                    isPlaying
                      ? 'bg-[#7B1E2B] text-white shadow-xs'
                      : 'bg-white hover:bg-[#F5E8EA] text-[#7B1E2B] border border-[#D9D9D9]'
                  }`}
                  title={`Ouvir tom senoidal de ${str.note}${str.octave}`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 fill-current" />
                      <span>Parar</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ouvir</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical Tuning Practical Guide */}
      <div className="bg-[#F8F7F4] border border-[#D9D9D9] rounded-3xl p-6 space-y-3">
        <h4 className="font-bold text-[#25252A] text-xs uppercase tracking-wider text-[#7B1E2B] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#7B1E2B]" />
          Regras de Afinação na Guitarra Real (Giannini 101 HSS)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#666672]">
          <div className="bg-white p-3.5 rounded-2xl border border-[#D9D9D9]">
            <p className="font-bold text-[#25252A] mb-1">1. Uma corda de cada vez</p>
            <p className="leading-relaxed">
              Toque apenas uma corda solta com ataque firme de palheta. Abafe as outras cordas com a palma da mão direita para evitar vibração simpática.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#D9D9D9]">
            <p className="font-bold text-[#25252A] mb-1">2. Afine sempre subindo</p>
            <p className="leading-relaxed">
              Se a nota estiver alta (♯), afrouxe a tarracha abaixo da nota e suba tensionando devagar. Isso evita folgas no pino da tarracha.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#D9D9D9]">
            <p className="font-bold text-[#25252A] mb-1">3. Estabilidade do centro</p>
            <p className="leading-relaxed">
              Quando a agulha repousar na faixa verde central (±2 cents), a corda estará afinada e pronta para o estudo das aulas e exercícios práticos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { guitarPitchDetector, PitchDetectionResult, TargetStringRef } from '../../audio/guitarPitchDetector';
import { TunerSmoother, TunerSmoothedOutput } from '../../audio/tunerSmoother';
import {
  ALL_INSTRUMENTS,
  TunerPreset,
  TunerString,
  InstrumentDefinition,
  calculateFrequency,
  loadCustomTunings,
  saveCustomTuning,
  deleteCustomTuning,
  findPresetById,
  NOTE_NAMES,
  NOTE_NAMES_PT
} from '../../data/tunerPresets';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  HelpCircle,
  Activity,
  Sparkles,
  RefreshCw,
  Settings2,
  Sliders,
  Plus,
  Trash2,
  Music,
  CheckCircle2,
  ChevronDown,
  Info,
  X,
  Volume1
} from 'lucide-react';

interface TunerViewProps {
  onOpenLessonTuning?: () => void;
}

export const TunerView: React.FC<TunerViewProps> = ({ onOpenLessonTuning }) => {
  // Estado do microfone e captura
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [suspendedInBackground, setSuspendedInBackground] = useState(false);
  const wasListeningBeforeHiddenRef = useRef(false);

  // Calibração de referência A4
  const [a4Calibration, setA4Calibration] = useState<number>(440);

  // Tolerância de afinação
  const [tuningTolerance, setTuningTolerance] = useState<number>(5.0); // ±5 cents padrão

  // Instrumento e Preset selecionado
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>('electric_guitar');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('eg_standard');
  const [isChromaticMode, setIsChromaticMode] = useState(false);

  // Afinações personalizadas
  const [customTunings, setCustomTunings] = useState<TunerPreset[]>([]);

  // Corda alvo (null = Modo Automático; número da corda = Modo Manual travado)
  const [manualStringNumber, setManualStringNumber] = useState<number | null>(null);

  // Tom de referência em execução
  const [playingRefString, setPlayingRefString] = useState<number | null>(null);

  // Modais
  const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Formulário de Afinação Personalizada
  const [customName, setCustomName] = useState('');
  const [customStrings, setCustomStrings] = useState<Array<{ note: string; octave: number }>>([
    { note: 'E', octave: 2 },
    { note: 'A', octave: 2 },
    { note: 'D', octave: 3 },
    { note: 'G', octave: 3 },
    { note: 'B', octave: 3 },
    { note: 'E', octave: 4 },
  ]);

  // Smoother de física do ponteiro
  const smootherRef = useRef<TunerSmoother>(
    new TunerSmoother({ alpha: 0.28, confidenceThreshold: 0.58, inTuneTolerance: 5.0, deadZone: 2.0 })
  );

  const [displayState, setDisplayState] = useState<TunerSmoothedOutput>({
    displayedCents: 0,
    displayedFreq: 0,
    displayedAngle: 0,
    displayedDiffHz: 0,
    note: null,
    notePt: null,
    octave: null,
    state: 'idle',
    isInTune: false,
    isNearTune: false,
    isWeakSignal: false,
    confidence: 0,
    expectedFreq: 0,
    stableFramesCount: 0
  });

  const animLoopRef = useRef<number | null>(null);

  // Carrega afinações personalizadas no carregamento
  useEffect(() => {
    setCustomTunings(loadCustomTunings());
  }, []);

  // Instrumento atual
  const currentInstrument = useMemo(() => {
    return ALL_INSTRUMENTS.find((i) => i.id === selectedInstrumentId) || ALL_INSTRUMENTS[0];
  }, [selectedInstrumentId]);

  // Preset ativo atual
  const currentPreset = useMemo(() => {
    const found = findPresetById(selectedPresetId, customTunings);
    return found || currentInstrument.presets[0];
  }, [selectedPresetId, customTunings, currentInstrument]);

  // Cordas do preset atual com frequências calculadas dinamicamente com base em A4
  const activeStrings = useMemo(() => {
    return currentPreset.strings.map((s) => ({
      ...s,
      freq: calculateFrequency(s.note, s.octave, a4Calibration)
    }));
  }, [currentPreset, a4Calibration]);

  // Atualiza limites e calibração no detector quando instrumento ou A4 mudam
  useEffect(() => {
    guitarPitchDetector.setA4Reference(a4Calibration);
    const low = currentPreset.recommendedLowCutoff || 25;
    const high = currentPreset.recommendedHighCutoff || 1600;
    guitarPitchDetector.setRange(low, high);
    smootherRef.current.setTolerance(tuningTolerance);
  }, [a4Calibration, currentPreset, tuningTolerance]);

  // Configuração da corda alvo no detector
  useEffect(() => {
    if (manualStringNumber !== null && !isChromaticMode) {
      const target = activeStrings.find((s) => s.stringNumber === manualStringNumber);
      if (target) {
        guitarPitchDetector.setTargetString({
          stringNumber: target.stringNumber,
          note: target.note,
          notePt: target.notePt,
          octave: target.octave,
          freq: target.freq
        });
        return;
      }
    }
    guitarPitchDetector.setTargetString(null);
  }, [manualStringNumber, activeStrings, isChromaticMode]);

  // Alterna a escuta do microfone
  const handleToggleListening = async () => {
    setSuspendedInBackground(false);
    wasListeningBeforeHiddenRef.current = false;

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

  // Gerenciamento de ciclo de vida seguro (visibilidade da aba e unmount)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (typeof document === 'undefined') return;

      if (document.hidden) {
        if (guitarPitchDetector.getIsListening()) {
          wasListeningBeforeHiddenRef.current = true;
          guitarPitchDetector.stopListening();
          if (animLoopRef.current) {
            cancelAnimationFrame(animLoopRef.current);
            animLoopRef.current = null;
          }
          setIsListening(false);
          setSuspendedInBackground(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      guitarPitchDetector.stopListening();
      guitarPitchDetector.stopReferenceTone();
      if (animLoopRef.current) {
        cancelAnimationFrame(animLoopRef.current);
        animLoopRef.current = null;
      }
    };
  }, []);

  // Tocar tom senoidal de referência
  const handlePlayReference = (str: TunerString & { freq: number }) => {
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

  // Seleciona um instrumento
  const handleSelectInstrument = (inst: InstrumentDefinition) => {
    setSelectedInstrumentId(inst.id);
    setSelectedPresetId(inst.defaultPresetId);
    setManualStringNumber(null);
    setIsChromaticMode(false);
    setIsInstrumentModalOpen(false);
  };

  // Seleciona uma afinação personalizada
  const handleSelectCustomTuning = (custom: TunerPreset) => {
    setSelectedPresetId(custom.id);
    setManualStringNumber(null);
    setIsChromaticMode(false);
    setIsInstrumentModalOpen(false);
  };

  // Salvar nova afinação personalizada
  const handleSaveCustomTuning = () => {
    if (!customName.trim()) return;
    const count = customStrings.length;
    const strings: TunerString[] = customStrings.map((s, idx) => ({
      stringNumber: count - idx,
      note: s.note,
      notePt: NOTE_NAMES_PT[s.note] || s.note,
      octave: s.octave,
      label: `${count - idx}ª Corda`,
      shortName: `${count - idx}${s.note}`
    }));

    const newPreset: Omit<TunerPreset, 'isCustom' | 'category'> = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      description: `Afinação personalizada de ${count} cordas`,
      instrumentId: 'custom',
      instrumentName: 'Personalizado',
      strings
    };

    const updated = saveCustomTuning(newPreset);
    setCustomTunings(updated);
    setSelectedPresetId(newPreset.id);
    setCustomName('');
    setIsCustomModalOpen(false);
  };

  // Excluir afinação personalizada
  const handleDeleteCustomTuning = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteCustomTuning(id);
    setCustomTunings(updated);
    if (selectedPresetId === id) {
      setSelectedPresetId(currentInstrument.defaultPresetId);
    }
  };

  // Status visual da afinação
  let statusBadge = {
    text: 'Aguardando som do instrumento...',
    subtext: 'Toque uma corda firme e isolada',
    bg: 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9]',
    color: '#666672',
    actionPrompt: 'Aguardando'
  };

  if (!isListening) {
    statusBadge = {
      text: 'Microfone desligado',
      subtext: 'Clique em "Ligar Microfone Real" para afinar',
      bg: 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9]',
      color: '#666672',
      actionPrompt: 'Pronto'
    };
  } else if (displayState.isWeakSignal) {
    statusBadge = {
      text: 'Sinal sonoro fraco',
      subtext: 'Toque a corda mais firme próximo ao microfone',
      bg: 'bg-amber-50 text-amber-700 border-amber-300',
      color: '#D97706',
      actionPrompt: 'Aumente o ataque'
    };
  } else if (displayState.isInTune) {
    statusBadge = {
      text: '✓ AFINADA!',
      subtext: `No centro exato (tolerância ±${tuningTolerance}¢)`,
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs ring-2 ring-emerald-200',
      color: '#10B981',
      actionPrompt: '✓ AFINADA'
    };
  } else if (displayState.isNearTune) {
    const isFlat = displayState.displayedCents < 0;
    statusBadge = {
      text: isFlat ? '▲ APERTAR (Ajuste fino)' : '▼ AFROUXAR (Ajuste fino)',
      subtext: `${displayState.displayedCents > 0 ? '+' : ''}${displayState.displayedCents}¢ — quase no centro`,
      bg: 'bg-amber-50 text-amber-700 border-amber-300',
      color: '#F59E0B',
      actionPrompt: isFlat ? '▲ APERTAR' : '▼ AFROUXAR'
    };
  } else if (displayState.note) {
    const isFlat = displayState.displayedCents < 0;
    statusBadge = {
      text: isFlat ? '▲ APERTAR (Grave / Baixa)' : '▼ AFROUXAR (Aguda / Alta)',
      subtext: isFlat
        ? 'Gire a tarraxa para aumentar a tensão da corda'
        : 'Gire a tarraxa para reduzir a tensão da corda',
      bg: 'bg-[#F5E8EA] text-[#7B1E2B] border-[#E8D3D6]',
      color: '#7B1E2B',
      actionPrompt: isFlat ? '▲ APERTAR' : '▼ AFROUXAR'
    };
  }

  // Agulha do medidor limitada entre -45° e +45°
  const needleRotation = Math.max(-45, Math.min(45, displayState.displayedAngle));

  // Identifica se a corda atual coincide com a nota detectada
  const detectedMatchingString = useMemo(() => {
    if (!displayState.note) return null;
    return activeStrings.find(
      (s) => s.note === displayState.note && (displayState.octave === null || s.octave === displayState.octave)
    );
  }, [displayState.note, displayState.octave, activeStrings]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentInstrument.icon}</span>
            <h1 className="text-2xl font-black text-[#25252A] tracking-tight">
              Afinador Cromático Pro — Master Tuner V2
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] font-medium">
            Motor YIN DSP com suporte a Contrabaixo (B0 ~ 30.87 Hz), Instrumentos de Arco, Folk e Afinações Personalizadas.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-3 bg-[#F8F7F4] hover:bg-white text-[#25252A] border border-[#D9D9D9] rounded-2xl transition shadow-xs text-xs font-bold flex items-center gap-1.5"
            title="Configurações de Calibração A4 e Tolerância"
          >
            <Settings2 className="w-4 h-4 text-[#7B1E2B]" />
            <span className="font-mono-code font-black">{a4Calibration} Hz</span>
          </button>

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
      </div>

      {/* Notificação amigável de pausa em segundo plano */}
      {suspendedInBackground && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#25252A]">Afinador pausado em segundo plano</p>
              <p className="text-xs text-[#666672]">
                A captura do microfone foi suspensa enquanto o aplicativo esteve fora da tela para economizar bateria e proteger sua privacidade.
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleListening}
            className="px-4 py-2 bg-[#7B1E2B] hover:bg-[#B52A3A] text-white font-bold rounded-xl text-xs transition shadow-xs shrink-0 w-full sm:w-auto"
          >
            Retomar Afinador
          </button>
        </div>
      )}

      {/* Error alert if microphone access fails */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-[#25252A]">Permissão ou Dispositivo de Microfone</p>
            <p className="text-xs text-rose-700 leading-relaxed">{errorMessage}</p>
            {errorMessage.toLowerCase().includes('permissão') && (
              <p className="text-[11px] text-rose-600 mt-1">
                Dica de segurança: no navegador (Chrome, Safari, Edge ou Firefox), toque no ícone de ajustes ou cadeado na barra de endereços, mude "Microfone" para "Permitir" e recarregue a página.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Instrument & Tuning Selector Bar */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Instrument Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInstrumentModalOpen(true)}
            className="px-4 py-2.5 bg-[#F8F7F4] hover:bg-white text-[#25252A] border border-[#D9D9D9] rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition shadow-xs"
          >
            <span>{currentInstrument.icon}</span>
            <span>{currentPreset.isCustom ? currentPreset.name : currentInstrument.name}</span>
            <ChevronDown className="w-4 h-4 text-[#666672]" />
          </button>

          {/* Preset Pill (for standard instruments) */}
          {!currentPreset.isCustom && currentInstrument.presets.length > 1 && !isChromaticMode && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-xs sm:max-w-md">
              {currentInstrument.presets.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPresetId(p.id);
                    setManualStringNumber(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                    selectedPresetId === p.id
                      ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                      : 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9] hover:bg-white'
                  }`}
                >
                  {p.name.split(' (')[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mode Switchers: Auto vs Manual vs Chromatic */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsChromaticMode(!isChromaticMode);
              setManualStringNumber(null);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition border ${
              isChromaticMode
                ? 'bg-[#1A1A20] text-white border-[#1A1A20] shadow-xs'
                : 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9] hover:bg-white'
            }`}
          >
            Modo Cromático Livre
          </button>

          {!isChromaticMode && (
            <button
              onClick={() => setManualStringNumber(manualStringNumber === null ? activeStrings[0].stringNumber : null)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition border ${
                manualStringNumber !== null
                  ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                  : 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9] hover:bg-white'
              }`}
            >
              {manualStringNumber !== null ? `Corda ${manualStringNumber}ª Fixa` : 'Modo Automático'}
            </button>
          )}
        </div>
      </div>

      {/* Main Tuner Gauge Box */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-center relative overflow-hidden">
        {/* Subtle background glow when in tune */}
        {displayState.isInTune && (
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none transition-all duration-300" />
        )}

        {/* Large Analog Gauge Display */}
        <div className="relative max-w-sm mx-auto h-48 sm:h-56 flex flex-col items-center justify-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 160">
            {/* Background Arc */}
            <path
              d="M 30 140 A 120 120 0 0 1 270 140"
              fill="none"
              stroke="#E5E5E5"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Flat zone (red/burgundy left) */}
            <path
              d="M 30 140 A 120 120 0 0 1 125 40"
              fill="none"
              stroke="#F5E8EA"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Center In-tune zone (emerald green) */}
            <path
              d="M 132 34 A 120 120 0 0 1 168 34"
              fill="none"
              stroke="#10B981"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Sharp zone (red/burgundy right) */}
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
                  strokeWidth={cent === 0 ? '3.5' : '1.5'}
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
                {detectedMatchingString && (
                  <span className="ml-2 font-mono-code text-xs bg-[#F8F7F4] px-2 py-0.5 rounded-md border border-[#D9D9D9]">
                    {detectedMatchingString.label}
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className="py-4">
              <span className="text-4xl sm:text-5xl font-black text-[#D9D9D9]">
                --
              </span>
              <p className="text-xs text-[#666672] mt-1 font-medium">
                {isListening
                  ? 'Toque uma corda no seu instrumento físico...'
                  : 'Clique em "Ligar Microfone Real" para afinar'}
              </p>
            </div>
          )}

          {/* Status Badge */}
          <div className="pt-2">
            <span
              className={`inline-block px-5 py-2 rounded-full text-xs font-bold border transition ${statusBadge.bg}`}
            >
              {statusBadge.text}
            </span>
            <p className="text-[11px] text-[#666672] mt-1 font-medium">
              {statusBadge.subtext}
            </p>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto pt-4 border-t border-[#D9D9D9]">
          <div className="bg-[#F8F7F4] p-3 rounded-2xl border border-[#D9D9D9] text-center">
            <span className="text-[10px] font-bold text-[#666672] uppercase block">Frequência Real</span>
            <span className="text-sm font-black text-[#25252A] font-mono-code">
              {displayState.displayedFreq > 0 ? `${displayState.displayedFreq} Hz` : '--'}
            </span>
          </div>

          <div className="bg-[#F8F7F4] p-3 rounded-2xl border border-[#D9D9D9] text-center">
            <span className="text-[10px] font-bold text-[#666672] uppercase block">Desvio Cents</span>
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

          <div className="bg-[#F8F7F4] p-3 rounded-2xl border border-[#D9D9D9] text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-[#666672] uppercase block">Ação / Direção</span>
            <span
              className={`text-xs font-black tracking-tight ${
                displayState.isInTune
                  ? 'text-emerald-600'
                  : displayState.displayedCents < 0
                  ? 'text-amber-600'
                  : 'text-[#7B1E2B]'
              }`}
            >
              {displayState.note ? statusBadge.actionPrompt : '--'}
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

      {/* String Reference Pitch & Pegs Section */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-[#25252A] text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7B1E2B]" />
              Cordas do Instrumento — {currentPreset.name}
            </h3>
            <p className="text-xs text-[#666672]">
              Toque na corda para travar no modo manual ou clique no alto-falante para ouvir o tom senoidal de referência.
            </p>
          </div>
          <div className="text-xs font-mono-code text-[#666672] bg-[#F8F7F4] px-3 py-1 rounded-xl border border-[#D9D9D9]">
            A4 = {a4Calibration} Hz
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {activeStrings.map((str) => {
            const isPlaying = playingRefString === str.stringNumber;
            const isSelectedManual = manualStringNumber === str.stringNumber;
            const isCurrentDetected =
              displayState.note === str.note && displayState.octave === str.octave;

            return (
              <div
                key={str.stringNumber}
                onClick={() => {
                  if (isSelectedManual) {
                    setManualStringNumber(null);
                  } else {
                    setManualStringNumber(str.stringNumber);
                    setIsChromaticMode(false);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition text-center space-y-2 cursor-pointer ${
                  isSelectedManual
                    ? 'bg-[#7B1E2B]/10 border-[#7B1E2B] ring-2 ring-[#7B1E2B]/20 shadow-xs'
                    : isCurrentDetected
                    ? displayState.isInTune
                      ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                      : 'bg-[#F5E8EA] border-[#7B1E2B] shadow-xs'
                    : 'bg-[#F8F7F4] border-[#D9D9D9] hover:bg-white'
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
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayReference(str);
                  }}
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

      {/* Practical Tuning Rules */}
      <div className="bg-[#F8F7F4] border border-[#D9D9D9] rounded-3xl p-6 space-y-3">
        <h4 className="font-bold text-[#25252A] text-xs uppercase tracking-wider text-[#7B1E2B] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#7B1E2B]" />
          Regras de Ouro da Afinação Acústica
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#666672]">
          <div className="bg-white p-3.5 rounded-2xl border border-[#D9D9D9]">
            <p className="font-bold text-[#25252A] mb-1">1. Uma corda de cada vez</p>
            <p className="leading-relaxed">
              Toque apenas uma corda solta com ataque firme. Abafe as outras cordas com a palma da mão para evitar vibração simpática e sobreposição harmônica.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#D9D9D9]">
            <p className="font-bold text-[#25252A] mb-1">2. Afine sempre subindo</p>
            <p className="leading-relaxed">
              Se a nota estiver alta (♯), afrouxe a tarracha abaixo da nota e suba tensionando devagar. Isso elimina folgas no pino da tarracha.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#D9D9D9]">
            <p className="font-bold text-[#25252A] mb-1">3. Estabilidade no centro</p>
            <p className="leading-relaxed">
              Quando a agulha repousar na faixa verde central (±{tuningTolerance} cents), a corda estará afinada com padrão de conservatório.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Instrumento e Presets */}
      {isInstrumentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-xl border border-[#D9D9D9] space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
              <div>
                <h3 className="font-black text-lg text-[#25252A]">Selecione o Instrumento</h3>
                <p className="text-xs text-[#666672]">Mais de 10 instrumentos de cordas e afinações personalizadas</p>
              </div>
              <button
                onClick={() => setIsInstrumentModalOpen(false)}
                className="p-2 hover:bg-[#F8F7F4] rounded-xl text-[#666672]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de Instrumentos Nativos */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#666672] uppercase tracking-wider">Instrumentos Oficiais</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ALL_INSTRUMENTS.map((inst) => {
                  const isSelected = selectedInstrumentId === inst.id && !currentPreset.isCustom;
                  return (
                    <button
                      key={inst.id}
                      onClick={() => handleSelectInstrument(inst)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                        isSelected
                          ? 'bg-[#7B1E2B]/10 border-[#7B1E2B] ring-2 ring-[#7B1E2B]/20'
                          : 'bg-[#F8F7F4] border-[#D9D9D9] hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{inst.icon}</span>
                      <div className="min-w-0">
                        <p className="font-black text-xs sm:text-sm text-[#25252A]">{inst.name}</p>
                        <p className="text-[11px] text-[#666672] truncate">{inst.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Afinações Personalizadas */}
              <div className="pt-2 border-t border-[#D9D9D9] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#666672] uppercase tracking-wider">Minhas Afinações Personalizadas</h4>
                  <button
                    onClick={() => {
                      setIsInstrumentModalOpen(false);
                      setIsCustomModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Criar Nova</span>
                  </button>
                </div>

                {customTunings.length === 0 ? (
                  <p className="text-xs text-[#666672] italic bg-[#F8F7F4] p-3 rounded-2xl border border-[#D9D9D9] text-center">
                    Nenhuma afinação personalizada salva. Crie uma para instrumentos de 1 a 8 cordas.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customTunings.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCustomTuning(c)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                          selectedPresetId === c.id
                            ? 'bg-[#7B1E2B]/10 border-[#7B1E2B]'
                            : 'bg-[#F8F7F4] border-[#D9D9D9] hover:bg-white'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-xs text-[#25252A]">{c.name}</p>
                          <p className="text-[11px] text-[#666672]">
                            {c.strings.map((s) => `${s.note}${s.octave}`).join(' ')}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteCustomTuning(c.id, e)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                          title="Excluir afinação personalizada"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configurações & Calibração A4 */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#D9D9D9] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
              <div>
                <h3 className="font-black text-lg text-[#25252A]">Configurações do Afinador</h3>
                <p className="text-xs text-[#666672]">Calibração A4 e precisão em cents</p>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-2 hover:bg-[#F8F7F4] rounded-xl text-[#666672]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calibração A4 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#666672] uppercase block">
                Frequência de Referência (Lá A4)
              </label>
              <div className="flex items-center justify-center gap-3 bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9]">
                <button
                  onClick={() => setA4Calibration((prev) => Math.max(430, prev - 1))}
                  className="w-10 h-10 bg-white border border-[#D9D9D9] rounded-xl font-bold text-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-3xl font-black font-mono-code text-[#25252A]">
                  {a4Calibration} <span className="text-sm font-semibold text-[#666672]">Hz</span>
                </span>
                <button
                  onClick={() => setA4Calibration((prev) => Math.min(450, prev + 1))}
                  className="w-10 h-10 bg-white border border-[#D9D9D9] rounded-xl font-bold text-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[
                  { label: '440 Hz Padrão', val: 440 },
                  { label: '442 Hz Orquestra', val: 442 },
                  { label: '432 Hz Filosófico', val: 432 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setA4Calibration(item.val)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                      a4Calibration === item.val
                        ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                        : 'bg-white text-[#666672] border-[#D9D9D9]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tolerância de Afinação */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#666672] uppercase block">
                Precisão / Tolerância Central
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Conservatório', cents: 3.0, desc: '±3 cents (ultra precisa)' },
                  { label: 'Padrão', cents: 5.0, desc: '±5 cents (recomendado)' },
                  { label: 'Rápido', cents: 8.0, desc: '±8 cents (ensaio/palco)' },
                ].map((t) => (
                  <button
                    key={t.cents}
                    onClick={() => setTuningTolerance(t.cents)}
                    className={`p-3 rounded-2xl border text-center transition ${
                      tuningTolerance === t.cents
                        ? 'bg-[#7B1E2B]/10 border-[#7B1E2B] text-[#7B1E2B] font-bold ring-2 ring-[#7B1E2B]/20'
                        : 'bg-[#F8F7F4] border-[#D9D9D9] text-[#666672]'
                    }`}
                  >
                    <p className="text-xs font-black">{t.label}</p>
                    <p className="text-[10px] mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full py-3 bg-[#7B1E2B] text-white font-bold rounded-2xl text-xs hover:bg-[#B52A3A] transition shadow-xs"
            >
              Concluir Ajustes
            </button>
          </div>
        </div>
      )}

      {/* Modal de Criação de Afinação Personalizada */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-[#D9D9D9] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
              <div>
                <h3 className="font-black text-lg text-[#25252A]">Criar Nova Afinação</h3>
                <p className="text-xs text-[#666672]">Adicione de 1 a 8 cordas com notas e oitavas personalizadas</p>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-2 hover:bg-[#F8F7F4] rounded-xl text-[#666672]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#666672] uppercase block mb-1">
                  Nome da Afinação
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ex: Drop B, Nashville Tuning, 7 Cordas..."
                  className="w-full px-4 py-2.5 bg-[#F8F7F4] border border-[#D9D9D9] rounded-2xl text-xs sm:text-sm font-bold text-[#25252A] outline-none focus:border-[#7B1E2B]"
                />
              </div>

              {/* Cordas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#666672] uppercase">
                    Cordas ({customStrings.length})
                  </label>
                  {customStrings.length < 8 && (
                    <button
                      type="button"
                      onClick={() =>
                        setCustomStrings([...customStrings, { note: 'E', octave: 4 }])
                      }
                      className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Corda</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {customStrings.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 bg-[#F8F7F4] border border-[#D9D9D9] rounded-2xl"
                    >
                      <span className="text-xs font-bold text-[#666672] w-16">
                        {customStrings.length - idx}ª Corda:
                      </span>

                      {/* Seletor de Nota */}
                      <select
                        value={s.note}
                        onChange={(e) => {
                          const updated = [...customStrings];
                          updated[idx].note = e.target.value;
                          setCustomStrings(updated);
                        }}
                        className="px-2 py-1 bg-white border border-[#D9D9D9] rounded-xl text-xs font-bold text-[#25252A]"
                      >
                        {NOTE_NAMES.map((n) => (
                          <option key={n} value={n}>
                            {n} ({NOTE_NAMES_PT[n]})
                          </option>
                        ))}
                      </select>

                      {/* Seletor de Oitava */}
                      <select
                        value={s.octave}
                        onChange={(e) => {
                          const updated = [...customStrings];
                          updated[idx].octave = parseInt(e.target.value, 10);
                          setCustomStrings(updated);
                        }}
                        className="px-2 py-1 bg-white border border-[#D9D9D9] rounded-xl text-xs font-bold text-[#25252A]"
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map((oct) => (
                          <option key={oct} value={oct}>
                            Oitava {oct}
                          </option>
                        ))}
                      </select>

                      <span className="text-[11px] font-mono-code text-[#666672] ml-auto">
                        {calculateFrequency(s.note, s.octave, a4Calibration)} Hz
                      </span>

                      {customStrings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomStrings(customStrings.filter((_, i) => i !== idx));
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="w-1/2 py-2.5 bg-[#F8F7F4] text-[#666672] font-bold rounded-2xl text-xs hover:bg-white border border-[#D9D9D9]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomTuning}
                  disabled={!customName.trim()}
                  className="w-1/2 py-2.5 bg-[#7B1E2B] text-white font-bold rounded-2xl text-xs hover:bg-[#B52A3A] transition disabled:opacity-50 shadow-xs"
                >
                  Salvar Afinação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

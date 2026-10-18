// =============================================================
// GUITAR ACADEMY / VIRTUO GUITAR COACH (TREINADOR DE TROCAS)
// src/components/coach/GuitarCoachView.tsx
// Treinador inteligente de transição de acordes com metrônomo
// integrado e avaliação acústica real via microfone (Web Audio API)
// 100% Determinístico e Local — Sem chamadas a servidores externos
// =============================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserProgress, NavigationTab } from '../../types';
import { audioEngine } from '../../audio/audioEngine';
import { guitarPitchDetector, PitchDetectionResult, NOTE_NAMES_PT } from '../../audio/guitarPitchDetector';
import { CHORD_DATABASE } from '../../data/chordDatabase';
import { getChordShapes } from '../../chords/shapes';
import { parseChordSymbol } from '../../chords/chord-builder';
import { storageService } from '../../services/storageService';
import { createInitialPedagogicalProfile, recordSkillEvidence } from '../../pedagogy/adaptiveEngine';
import { 
  Play, 
  Square, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  TrendingUp,
  Activity,
  Zap,
  Music,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';

interface GuitarCoachViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export interface DrillSet {
  id: string;
  name: string;
  genre: string;
  chords: string[];
  description: string;
}

const DEFAULT_DRILL_SETS: DrillSet[] = [
  { 
    id: 'worship-open', 
    name: 'Worship & Louvor Aberto', 
    genre: 'Gospel / Balada',
    chords: ['G', 'Cadd9', 'Em7', 'D'],
    description: 'A transição moderna mais utilizada. Mantenha os dedos 3 e 4 fixos nas cordas 1 e 2!'
  },
  { 
    id: 'pop-g', 
    name: 'I - V - vi - IV (Pop em Sol)', 
    genre: 'Pop / Rock',
    chords: ['G', 'D', 'Em', 'C'],
    description: 'A progressão dos 4 acordes mais famosos da história da música ocidental.'
  },
  { 
    id: 'louvor-c', 
    name: 'Cadência em Dó Maior', 
    genre: 'Acústico / MPB',
    chords: ['C', 'G', 'Am', 'F'],
    description: 'Excelente para treinar a transição do Am para a temida pestana de Fá.'
  },
  { 
    id: 'acoustic-d', 
    name: 'Harmonia Dourada em Ré', 
    genre: 'Folk / Sertanejo / Rock',
    chords: ['D', 'A', 'Bm', 'G'],
    description: 'Trabalha a transição do polegar e a pestana de Si menor na 2ª casa.'
  },
  { 
    id: 'minor-ballad', 
    name: 'Balada Menor Melancólica', 
    genre: 'Balada / Rock',
    chords: ['Am', 'F', 'C', 'G'],
    description: 'Sequência emocional amplamente encontrada em clássicos da guitarra.'
  },
  { 
    id: 'jazz-blues', 
    name: 'Blues Dominante em Lá', 
    genre: 'Blues / Rock and Roll',
    chords: ['A7', 'D7', 'E7', 'A7'],
    description: 'Acordes de sétima dominante com abertura sonora marcante e swing.'
  }
];

export type CoachDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Desafio';

export const GuitarCoachView: React.FC<GuitarCoachViewProps> = ({
  progress,
  onUpdateProgress,
  onNavigateTab
}) => {
  // Configuração do Exercício
  const [drillSets, setDrillSets] = useState<DrillSet[]>(DEFAULT_DRILL_SETS);
  const [selectedSetId, setSelectedSetId] = useState<string>('worship-open');
  const [customChordsInput, setCustomChordsInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Parâmetros de Treino
  const [bpm, setBpm] = useState<number>(65);
  const [difficulty, setDifficulty] = useState<CoachDifficulty>('Iniciante');
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number>(2); // 1, 2, 5, 0 (livre)

  // Estado da Execução
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(0);
  const [currentBar, setCurrentBar] = useState<number>(1);
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [isBeatAccent, setIsBeatAccent] = useState<boolean>(false);
  const [totalSwitches, setTotalSwitches] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Microfone & Avaliação Sonora Real
  const [isMicEnabled, setIsMicEnabled] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [currentPitch, setCurrentPitch] = useState<PitchDetectionResult | null>(null);

  // Métricas Acústicas do Treino
  const [acousticallyConfirmedSwitches, setAcousticallyConfirmedSwitches] = useState<number>(0);
  const [harmonicMatchesCount, setHarmonicMatchesCount] = useState<number>(0);
  const [harmonicMismatchesCount, setHarmonicMismatchesCount] = useState<number>(0);
  const [audioFeedbackText, setAudioFeedbackText] = useState<string>('Microfone desativado');
  const [lastDetectedNoteMatch, setLastDetectedNoteMatch] = useState<'root' | 'chord_tone' | 'outside' | null>(null);

  // Modal / Resumo pós-treino
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<{
    totalSwitches: number;
    confirmedSwitches: number;
    accuracyPercent: number;
    durationSeconds: number;
    bpm: number;
    drillName: string;
  } | null>(null);

  // Refs de sincronização
  const isRunningRef = useRef<boolean>(false);
  isRunningRef.current = isRunning;
  const timerIntervalRef = useRef<number | null>(null);
  const currentChordIdxRef = useRef<number>(0);
  currentChordIdxRef.current = currentChordIndex;
  const currentBarRef = useRef<number>(1);
  currentBarRef.current = currentBar;
  const switchWindowHitRef = useRef<boolean>(false);

  // Determina número de compassos por acorde baseado no nível
  const barsPerChord = useMemo(() => {
    switch (difficulty) {
      case 'Iniciante': return 4;
      case 'Intermediário': return 2;
      case 'Avançado': return 1;
      case 'Desafio': return 0.5; // troca a cada 2 tempos
    }
  }, [difficulty]);

  // Sequência ativa de acordes
  const activeChords = useMemo(() => {
    if (isCustomMode && customChordsInput.trim()) {
      const parts = customChordsInput.split(/[\s,->]+/).map(s => s.trim()).filter(Boolean);
      return parts.length > 0 ? parts : ['G', 'C', 'D'];
    }
    const current = drillSets.find(d => d.id === selectedSetId);
    return current ? current.chords : DEFAULT_DRILL_SETS[0].chords;
  }, [drillSets, selectedSetId, isCustomMode, customChordsInput]);

  const currentChordSymbol = activeChords[currentChordIndex % activeChords.length] || 'G';
  const nextChordSymbol = activeChords[(currentChordIndex + 1) % activeChords.length] || activeChords[0];

  // Informações harmônicas teóricas do acorde atual
  const currentChordDetails = useMemo(() => {
    const fromDb = CHORD_DATABASE.find(c => c.symbol === currentChordSymbol);
    const parsed = parseChordSymbol(currentChordSymbol);
    const shapes = getChordShapes(currentChordSymbol);
    return {
      symbol: currentChordSymbol,
      namePt: fromDb?.namePt || `${currentChordSymbol}`,
      root: parsed?.root || currentChordSymbol.replace(/[^A-G#b]/g, ''),
      notes: fromDb?.notes || parsed?.notes || [],
      frets: shapes[0]?.frets || fromDb?.frets || [-1, -1, -1, -1, -1, -1],
      description: fromDb?.description || 'Toque as cordas com clareza e ritmo firme.'
    };
  }, [currentChordSymbol]);

  // Próximo acorde info
  const nextChordDetails = useMemo(() => {
    const fromDb = CHORD_DATABASE.find(c => c.symbol === nextChordSymbol);
    const shapes = getChordShapes(nextChordSymbol);
    return {
      symbol: nextChordSymbol,
      namePt: fromDb?.namePt || `${nextChordSymbol}`,
      frets: shapes[0]?.frets || fromDb?.frets || [-1, -1, -1, -1, -1, -1]
    };
  }, [nextChordSymbol]);

  // Iniciar / Parar Microfone de forma segura
  const toggleMicrophone = async () => {
    if (isMicActive) {
      guitarPitchDetector.stopListening();
      setIsMicActive(false);
      setIsMicEnabled(false);
      setCurrentPitch(null);
      setAudioFeedbackText('Microfone desligado');
      return;
    }

    setMicErrorMessage(null);
    setAudioFeedbackText('Iniciando captura de áudio...');

    // Assegura inicialização do contexto de áudio compartilhado
    const audioCtx = await audioEngine.initAudio();

    const result = await guitarPitchDetector.startListening((pitch) => {
      if (!pitch) return;
      setCurrentPitch(pitch);
      handlePitchAcousticAnalysis(pitch);
    }, audioCtx);

    if (result.success) {
      setIsMicActive(true);
      setIsMicEnabled(true);
      setAudioFeedbackText('Microfone ativo: captando frequência real...');
    } else {
      setIsMicActive(false);
      setIsMicEnabled(false);
      setMicErrorMessage(result.error || 'Falha ao acessar o microfone.');
      setAudioFeedbackText('Erro no microfone');
    }
  };

  // Análise Acústica da Nota Tocada vs Acorde Atual
  const handlePitchAcousticAnalysis = (pitch: PitchDetectionResult) => {
    if (!isRunningRef.current || pitch.isSilence || !pitch.note) {
      return;
    }

    const detectedNote = pitch.note.toUpperCase();
    const chordRoot = currentChordDetails.root.toUpperCase();
    const chordNotes = currentChordDetails.notes.map(n => n.toUpperCase());

    // Se detectou polifonia ambígua, alerta no HUD sem punir
    if (pitch.detectionType === 'polyphonic_ambiguous') {
      setAudioFeedbackText('Polifonia detectada: para afinação precisa, toque a tônica isolada.');
      return;
    }

    // 1. Tônica exata detectada (alta prioridade)
    if (detectedNote === chordRoot) {
      setLastDetectedNoteMatch('root');
      setAudioFeedbackText(`Excelente! Tônica ${detectedNote} confirmada (${pitch.frequency} Hz, ${pitch.stabilityLabel})`);
      setHarmonicMatchesCount(prev => prev + 1);

      // Marca confirmação de transição acústica na janela do primeiro tempo
      if (!switchWindowHitRef.current) {
        switchWindowHitRef.current = true;
        setAcousticallyConfirmedSwitches(prev => prev + 1);
      }
      return;
    }

    // 2. Nota integrante do acorde (terça, quinta ou sétima)
    if (chordNotes.includes(detectedNote)) {
      setLastDetectedNoteMatch('chord_tone');
      setAudioFeedbackText(`Nota do acorde: ${detectedNote} (${pitch.frequency} Hz, ${pitch.stabilityLabel})`);
      setHarmonicMatchesCount(prev => prev + 1);

      if (!switchWindowHitRef.current) {
        switchWindowHitRef.current = true;
        setAcousticallyConfirmedSwitches(prev => prev + 1);
      }
      return;
    }

    // 3. Nota fora do acorde
    if (pitch.confidence > 0.70 && !pitch.isWeakSignal) {
      setLastDetectedNoteMatch('outside');
      setAudioFeedbackText(`Nota fora: ${detectedNote} (${pitch.frequency} Hz) — Alvo do acorde: ${chordRoot} [${chordNotes.join(', ')}]`);
      setHarmonicMismatchesCount(prev => prev + 1);
    }
  };

  // Iniciar Sessão de Treino com Metrônomo do Guitar Academy
  const startCoachSession = async () => {
    // Inicializa motor de áudio único
    await audioEngine.initAudio();

    setIsRunning(true);
    setCurrentChordIndex(0);
    setCurrentBar(1);
    setCurrentBeat(1);
    setTotalSwitches(0);
    setElapsedSeconds(0);
    setAcousticallyConfirmedSwitches(0);
    setHarmonicMatchesCount(0);
    setHarmonicMismatchesCount(0);
    switchWindowHitRef.current = false;
    currentChordIdxRef.current = 0;
    currentBarRef.current = 1;

    // Se o microfone estiver ativado nas opções mas ainda não aberto, tenta abrir
    if (isMicEnabled && !isMicActive) {
      toggleMicrophone();
    }

    // Timer cronômetro em segundos
    timerIntervalRef.current = window.setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        if (sessionDurationMinutes > 0 && next >= sessionDurationMinutes * 60) {
          stopCoachSession(true);
        }
        return next;
      });
    }, 1000);

    // Inicia o Metrônomo oficial do AudioEngine (zero concorrência de áudio!)
    audioEngine.startMetronome(
      bpm,
      4,
      'quarter',
      true,
      (beatIdx, measureIdx, isAccent) => {
        const beatNum = beatIdx + 1;
        setCurrentBeat(beatNum);
        setIsBeatAccent(isAccent);

        // Lógica de avanço de compasso e troca de acorde
        if (beatNum === 1) {
          switchWindowHitRef.current = false; // reseta janela acústica para a nova batida 1

          setCurrentBar(prevBar => {
            const nextBar = prevBar + 1;

            // Verifica se atingiu o limite de compassos do acorde
            if (barsPerChord === 0.5) {
              // Modo Desafio: troca também no tempo 3 (tratado abaixo)
              return 1;
            } else if (nextBar > barsPerChord) {
              // Troca para o próximo acorde na batida 1
              setCurrentChordIndex(prevIdx => {
                const newIdx = prevIdx + 1;
                currentChordIdxRef.current = newIdx;
                return newIdx;
              });
              setTotalSwitches(prev => prev + 1);
              return 1;
            }
            return nextBar;
          });
        } else if (barsPerChord === 0.5 && beatNum === 3) {
          // Desafio: troca de acorde no tempo 3 do compasso
          switchWindowHitRef.current = false;
          setCurrentChordIndex(prevIdx => {
            const newIdx = prevIdx + 1;
            currentChordIdxRef.current = newIdx;
            return newIdx;
          });
          setTotalSwitches(prev => prev + 1);
        }
      }
    );
  };

  // Parar Sessão
  const stopCoachSession = (completed = false) => {
    setIsRunning(false);
    audioEngine.stopMetronome();

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const currentTotalSwitches = totalSwitches;
    const currentConfirmed = acousticallyConfirmedSwitches;
    const totalDetections = harmonicMatchesCount + harmonicMismatchesCount;
    const accuracy = totalDetections > 0 
      ? Math.round((harmonicMatchesCount / totalDetections) * 100) 
      : isMicActive ? 50 : 100;

    const drillName = isCustomMode 
      ? 'Sequência Personalizada' 
      : drillSets.find(d => d.id === selectedSetId)?.name || 'Treino de Acordes';

    setSummaryData({
      totalSwitches: currentTotalSwitches,
      confirmedSwitches: currentConfirmed,
      accuracyPercent: accuracy,
      durationSeconds: elapsedSeconds,
      bpm,
      drillName
    });

    setShowSummaryModal(true);
  };

  // Salvar Prática no Progresso
  const handleSaveProgress = () => {
    if (!summaryData) return;
    const timeSpent = Math.max(30, summaryData.durationSeconds);

    let updatedProfile = progress.pedagogicalProfile || createInitialPedagogicalProfile();
    // Somente atualiza métricas de áudio quando houver uma medição real disponível (Fase 3, Regra 3)
    if (summaryData.confirmedSwitches > 0 && isMicActive) {
      updatedProfile = recordSkillEvidence(updatedProfile, 'skill-chord-transitions', {
        source: 'guitar_coach_audio',
        score: summaryData.accuracyPercent,
        accuracyPercent: summaryData.accuracyPercent,
        details: `Sessão Guitar Coach: ${summaryData.confirmedSwitches}/${summaryData.totalSwitches} trocas confirmadas acusticamente (${summaryData.accuracyPercent}% precisão a ${summaryData.bpm} BPM).`,
      });
    } else {
      // Treino sem medição acústica comprovada: registra repetições motoras com metrônomo
      updatedProfile = recordSkillEvidence(updatedProfile, 'skill-chord-transitions', {
        source: 'exercise_repetitions',
        score: Math.min(100, 50 + summaryData.totalSwitches * 3),
        details: `Sessão Guitar Coach: ${summaryData.totalSwitches} trocas praticadas com metrônomo a ${summaryData.bpm} BPM.`,
      });
    }

    const updated: UserProgress = {
      ...progress,
      totalStudyTimeSeconds: (progress.totalStudyTimeSeconds || 0) + timeSpent,
      todayStudyTimeSeconds: (progress.todayStudyTimeSeconds || 0) + timeSpent,
      practicedBpm: Math.max(progress.practicedBpm || 60, summaryData.bpm),
      pedagogicalProfile: updatedProfile,
      exerciseRepetitions: {
        ...(progress.exerciseRepetitions || {}),
        'guitar-coach-transitions': ((progress.exerciseRepetitions || {})['guitar-coach-transitions'] || 0) + summaryData.totalSwitches
      }
    };

    onUpdateProgress(updated);
    storageService.saveProgress(updated);
    setShowSummaryModal(false);
  };

  // Desmontagem: garante parada de áudio e microfone
  useEffect(() => {
    return () => {
      audioEngine.stopMetronome();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      guitarPitchDetector.stopListening();
    };
  }, []);

  // Formatação de tempo mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header do Guitar Coach */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E8EA] border border-[#E8D3D6] text-[#7B1E2B] text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Treinador de Transições de Acordes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#25252A] tracking-tight">
            Guitar Coach • Treino com Metrônomo & Avaliação Sonora
          </h1>
          <p className="text-sm text-[#666672] mt-1 font-medium">
            Treine trocas de acordes no tempo exato, visualize o próximo posicionamento e valide seu som via microfone real.
          </p>
        </div>

        {/* Botão de Microfone On/Off */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMicrophone}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition border ${
              isMicActive
                ? 'bg-[#10b981]/10 border-[#10b981] text-[#047857]'
                : 'bg-[#F2F2F2] border-[#D9D9D9] text-[#666672] hover:bg-[#EAEAEA]'
            }`}
          >
            {isMicActive ? <Mic className="w-4 h-4 text-[#10b981] animate-pulse" /> : <MicOff className="w-4 h-4 text-[#8C8C9A]" />}
            <span>{isMicActive ? 'Microfone Ativo' : 'Ativar Microfone Real'}</span>
          </button>
        </div>
      </div>

      {/* Erro de Microfone se houver */}
      {micErrorMessage && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold">Aviso de Acesso ao Microfone:</strong>
            <p>{micErrorMessage}</p>
            <p className="text-xs text-amber-700">
              Você ainda pode praticar normalmente com o metrônomo visual e sonoro! Para ativar a pontuação por áudio, autorize o microfone no ícone de permissão do navegador.
            </p>
          </div>
        </div>
      )}

      {/* Configuração de Sequência / Repertório */}
      <div className="bg-white border border-[#D9D9D9] rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2F2F2] pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#666672]">
            1. Escolha a Sequência Harmônica
          </span>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                !isCustomMode ? 'bg-[#7B1E2B] text-white' : 'bg-[#F2F2F2] text-[#666672]'
              }`}
            >
              Músicas & Padrões
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                isCustomMode ? 'bg-[#7B1E2B] text-white' : 'bg-[#F2F2F2] text-[#666672]'
              }`}
            >
              Personalizada
            </button>
          </div>
        </div>

        {!isCustomMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {drillSets.map(drill => {
              const isSelected = selectedSetId === drill.id;
              return (
                <button
                  key={drill.id}
                  onClick={() => {
                    if (isRunning) stopCoachSession();
                    setSelectedSetId(drill.id);
                  }}
                  className={`p-3.5 rounded-xl text-left transition border ${
                    isSelected
                      ? 'bg-[#7B1E2B]/5 border-[#7B1E2B] ring-2 ring-[#7B1E2B]/15'
                      : 'bg-white border-[#D9D9D9] hover:bg-[#F9F9F9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#25252A]">{drill.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F2F2F2] text-[#666672]">
                      {drill.genre}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {drill.chords.map((ch, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-0.5 rounded bg-white border border-[#D9D9D9] text-xs font-black text-[#7B1E2B]">
                          {ch}
                        </span>
                        {idx < drill.chords.length - 1 && (
                          <span className="text-[10px] text-[#A6A6B2]">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#666672] mt-2 line-clamp-1">
                    {drill.description}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#4D4D54] block">
              Digite os acordes separados por espaço ou hífen (ex: G Em C D ou C Am F G):
            </label>
            <input
              type="text"
              value={customChordsInput}
              onChange={(e) => setCustomChordsInput(e.target.value)}
              placeholder="Ex: C G Am F"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D9D9D9] font-mono text-sm uppercase focus:outline-none focus:border-[#7B1E2B]"
            />
          </div>
        )}
      </div>

      {/* Parâmetros de Dificuldade & Andamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nível de Troca */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 space-y-2 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#666672] block">
            Compassos por Acorde
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(['Iniciante', 'Intermediário', 'Avançado', 'Desafio'] as CoachDifficulty[]).map(lvl => (
              <button
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                disabled={isRunning}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition border ${
                  difficulty === lvl
                    ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                    : 'bg-[#F2F2F2] text-[#4D4D54] border-[#E5E5E5] hover:bg-[#EAEAEA]'
                }`}
              >
                {lvl}
                <span className="block text-[9px] font-normal opacity-80">
                  {lvl === 'Iniciante' ? '4 comp.' : lvl === 'Intermediário' ? '2 comp.' : lvl === 'Avançado' ? '1 comp.' : '2 tempos'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Andamento (BPM) */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#666672]">
              Andamento
            </span>
            <strong className="text-xl font-black text-[#7B1E2B]">
              {bpm} <span className="text-xs font-semibold text-[#666672]">BPM</span>
            </strong>
          </div>
          <input
            type="range"
            min="40"
            max="180"
            step="1"
            value={bpm}
            onChange={(e) => {
              const newBpm = parseInt(e.target.value, 10);
              setBpm(newBpm);
              if (isRunning) {
                audioEngine.updateMetronomeParams(newBpm);
              }
            }}
            className="w-full accent-[#7B1E2B] cursor-pointer"
          />
          <div className="flex items-center justify-between gap-1 pt-1">
            {[-5, -1, +1, +5].map(step => (
              <button
                key={step}
                onClick={() => {
                  const val = Math.max(40, Math.min(200, bpm + step));
                  setBpm(val);
                  if (isRunning) audioEngine.updateMetronomeParams(val);
                }}
                className="flex-1 py-1 px-1 rounded bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[11px] font-bold text-[#4D4D54]"
              >
                {step > 0 ? `+${step}` : step}
              </button>
            ))}
          </div>
        </div>

        {/* Duração do Treino */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 space-y-2 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#666672] block">
            Duração da Sessão
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: 1, label: '1 min' },
              { val: 2, label: '2 min' },
              { val: 5, label: '5 min' },
              { val: 0, label: 'Livre' }
            ].map(dur => (
              <button
                key={dur.val}
                onClick={() => setSessionDurationMinutes(dur.val)}
                disabled={isRunning}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition border ${
                  sessionDurationMinutes === dur.val
                    ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                    : 'bg-[#F2F2F2] text-[#4D4D54] border-[#E5E5E5] hover:bg-[#EAEAEA]'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-[#666672] text-center pt-2">
            Tempo decorrido: <strong className="text-[#25252A] font-mono">{formatTime(elapsedSeconds)}</strong>
          </div>
        </div>
      </div>

      {/* PAINEL GIGANTE DO TREINO DE TRANSIÇÃO (HUD DO COACH) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121217] text-white border-2 border-[#7B1E2B]/40 p-6 sm:p-10 shadow-lg text-center space-y-8">
        {/* Top Status Bar: Compasso, Trocas, Batidas */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#A6A6B2]">Compasso:</span>
            <span className="font-extrabold text-white px-2.5 py-0.5 rounded-md bg-white/10">
              {currentBar} de {barsPerChord}
            </span>
          </div>

          {/* Batidas 1, 2, 3, 4 com flash sonoro */}
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map(b => {
              const isCurrent = isRunning && currentBeat === b;
              const isAccent = isCurrent && isBeatAccent;
              return (
                <div
                  key={b}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all duration-75 ${
                    isCurrent
                      ? isAccent
                        ? 'bg-[#B52A3A] text-white scale-125 shadow-[0_0_15px_#B52A3A]'
                        : 'bg-white text-[#121217] scale-110 shadow-[0_0_10px_white]'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {b}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#A6A6B2]">Transições:</span>
            <span className="font-black text-[#10b981] px-2.5 py-0.5 rounded-md bg-[#10b981]/15">
              {totalSwitches} trocas
            </span>
          </div>
        </div>

        {/* Acordes em Destaque: TOCAR AGORA vs PREPARAR DEDOS */}
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-6 max-w-3xl mx-auto py-2">
          {/* Acorde Atual (Gigante) */}
          <div className="md:col-span-2 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#B52A3A]">
              Tocar Agora
            </span>
            <div className="text-7xl sm:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">
              {currentChordDetails.symbol}
            </div>
            <div className="text-sm font-semibold text-[#D9D9D9]">
              {currentChordDetails.namePt}
            </div>
            <div className="text-[11px] text-[#A6A6B2]">
              Notas: {currentChordDetails.notes.join(' - ')}
            </div>
          </div>

          {/* Seta de Transição */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <ArrowRight className="w-10 h-10 text-[#7B1E2B] animate-pulse hidden md:block" />
            <span className="text-xs text-[#A6A6B2] font-semibold md:mt-1">
              Próxima
            </span>
          </div>

          {/* Próximo Acorde (Preparação) */}
          <div className="md:col-span-2 space-y-2 opacity-90">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#A6A6B2]">
              Preparar Dedos
            </span>
            <div className="text-5xl sm:text-6xl font-black text-[#E8D3D6] tracking-tight">
              {nextChordDetails.symbol}
            </div>
            <div className="text-sm font-semibold text-[#A6A6B2]">
              {nextChordDetails.namePt}
            </div>
            <div className="text-[11px] text-[#8C8C9A]">
              Antecipe o posicionamento
            </div>
          </div>
        </div>

        {/* Monitor Acústico em Tempo Real (Web Audio + Microfone) */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-left max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Monitor Acústico da Guitarra Real
              </span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isMicActive ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-white/10 text-[#A6A6B2]'
            }`}>
              {isMicActive ? 'Captação Ativa' : 'Microfone Desligado'}
            </span>
          </div>

          {isMicActive && currentPitch && !currentPitch.isSilence ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#A6A6B2] block">Nota Tocada:</span>
                <strong className="text-sm font-black text-white">
                  {currentPitch.note || '-'} {currentPitch.octave ? `(${currentPitch.octave})` : ''}
                </strong>
                <span className="text-[10px] text-[#A6A6B2] block">
                  {currentPitch.notePt || ''}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#A6A6B2] block">Frequência:</span>
                <strong className="text-sm font-bold text-white">
                  {currentPitch.frequency.toFixed(1)} Hz
                </strong>
                <span className={`text-[10px] font-semibold block ${
                  Math.abs(currentPitch.cents) <= 8 ? 'text-[#10b981]' : 'text-amber-400'
                }`}>
                  {currentPitch.cents > 0 ? `+${currentPitch.cents}` : currentPitch.cents} cents
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#A6A6B2] block">Estabilidade:</span>
                <strong className={`text-sm font-bold ${
                  currentPitch.stability >= 80 ? 'text-[#10b981]' : currentPitch.stability >= 50 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {currentPitch.stabilityLabel}
                </strong>
                <span className="text-[10px] text-[#A6A6B2] block">
                  {currentPitch.stability}% confiança
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#A6A6B2] block">Avaliação Alvo:</span>
                <strong className={`text-xs font-bold block truncate ${
                  lastDetectedNoteMatch === 'root' 
                    ? 'text-[#10b981]' 
                    : lastDetectedNoteMatch === 'chord_tone' 
                    ? 'text-cyan-400' 
                    : lastDetectedNoteMatch === 'outside' 
                    ? 'text-amber-400' 
                    : 'text-[#A6A6B2]'
                }`}>
                  {lastDetectedNoteMatch === 'root' ? 'Tônica Perfeita' : lastDetectedNoteMatch === 'chord_tone' ? 'Nota do Acorde' : lastDetectedNoteMatch === 'outside' ? 'Fora do Acorde' : 'Aguardando'}
                </strong>
                <span className="text-[10px] text-[#A6A6B2]">
                  Alvo: {currentChordDetails.root}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#A6A6B2] py-1 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#A6A6B2] shrink-0" />
              <span>
                {isMicActive 
                  ? 'Aguardando toque na guitarra... Toque a tônica ou palhete as cordas do acorde.' 
                  : 'Ative o microfone para comparar em tempo real a nota que você toca com o acorde alvo.'}
              </span>
            </div>
          )}

          {/* Feedback Text Banner */}
          <div className="text-[11px] text-[#D9D9D9] bg-white/5 px-3 py-1.5 rounded-lg font-medium">
            {audioFeedbackText}
          </div>
        </div>

        {/* Botão de Controle Principal (Iniciar / Parar) */}
        <div className="pt-2">
          {!isRunning ? (
            <button
              onClick={startCoachSession}
              className="px-10 py-5 rounded-2xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] active:scale-95 font-black text-lg sm:text-xl shadow-lg transition flex items-center justify-center gap-3 mx-auto w-full max-w-md"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Iniciar Treino com Metrônomo</span>
            </button>
          ) : (
            <button
              onClick={() => stopCoachSession(false)}
              className="px-10 py-5 rounded-2xl bg-red-600 text-white hover:bg-red-700 active:scale-95 font-black text-lg sm:text-xl shadow-lg transition flex items-center justify-center gap-3 mx-auto w-full max-w-md"
            >
              <Square className="w-6 h-6 fill-current" />
              <span>Encerrar Treino & Ver Resultado</span>
            </button>
          )}
        </div>
      </div>

      {/* Dicas de Execução & Biomecânica da Giannini 101 HSS */}
      <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 space-y-3 shadow-xs">
        <h3 className="text-sm font-black text-[#25252A] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7B1E2B]" />
          <span>Regras de Ouro para Transição de Acordes</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#666672]">
          <div className="p-3.5 rounded-xl bg-[#F9F9F9] border border-[#EAEAEA] space-y-1">
            <strong className="text-[#25252A] block font-bold">1. Dedo Pivô (Pivot Finger)</strong>
            <p>Identifique dedos que permanecem na mesma corda ou casa entre os dois acordes (como nos acordes G e Cadd9). Nunca os retire do braço.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F9F9F9] border border-[#EAEAEA] space-y-1">
            <strong className="text-[#25252A] block font-bold">2. Troca no Ar (Air Form)</strong>
            <p>Mova todos os dedos ao mesmo tempo em direção ao formato seguinte, antes mesmo de pousá-los nas cordas.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F9F9F9] border border-[#EAEAEA] space-y-1">
            <strong className="text-[#25252A] block font-bold">3. Prioridade Rítmica</strong>
            <p>Nunca pare a mão da palheta. Mesmo se um dedo atrasar milissegundos, mantenha o tempo forte do metrônomo.</p>
          </div>
        </div>
      </div>

      {/* MODAL DE RESUMO PÓS-TREINO */}
      {showSummaryModal && summaryData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D9D9D9] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mx-auto mb-2">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#25252A]">
                Sessão Concluída!
              </h2>
              <p className="text-xs text-[#666672]">
                {summaryData.drillName} • {summaryData.bpm} BPM
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F9F9F9] border border-[#EAEAEA] text-center">
                <span className="text-[10px] text-[#666672] uppercase font-bold block">
                  Total de Trocas
                </span>
                <strong className="text-2xl font-black text-[#25252A]">
                  {summaryData.totalSwitches}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F9F9F9] border border-[#EAEAEA] text-center">
                <span className="text-[10px] text-[#666672] uppercase font-bold block">
                  Tempo Praticado
                </span>
                <strong className="text-2xl font-black text-[#7B1E2B]">
                  {formatTime(summaryData.durationSeconds)}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F9F9F9] border border-[#EAEAEA] text-center">
                <span className="text-[10px] text-[#666672] uppercase font-bold block">
                  Validadas por Áudio
                </span>
                <strong className="text-2xl font-black text-[#10b981]">
                  {summaryData.confirmedSwitches}
                </strong>
                <span className="text-[9px] text-[#666672] block">
                  {isMicActive ? 'Acordes confirmados' : 'Sem microfone'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F9F9F9] border border-[#EAEAEA] text-center">
                <span className="text-[10px] text-[#666672] uppercase font-bold block">
                  Precisão Harmônica
                </span>
                <strong className="text-2xl font-black text-[#B52A3A]">
                  {summaryData.accuracyPercent}%
                </strong>
                <span className="text-[9px] text-[#666672] block">
                  {summaryData.accuracyPercent >= 80 ? 'Excelente' : 'Em evolução'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5E8EA] border border-[#E8D3D6] text-xs text-[#7B1E2B] space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Avaliação do Treinador:</span>
              </strong>
              <p>
                {summaryData.totalSwitches >= 20
                  ? 'Impressionante regularidade! O tempo rítmico e a memória muscular dos dedos estão sincronizados.'
                  : 'Bom começo! Pratique diariamente por 2 minutos para consolidar a velocidade de transição.'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-[#D9D9D9] font-bold text-xs text-[#666672] hover:bg-[#F2F2F2] transition"
              >
                Descartar
              </button>
              <button
                onClick={handleSaveProgress}
                className="flex-1 py-3 px-4 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] font-bold text-xs shadow-sm transition"
              >
                Salvar no Meu Progresso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

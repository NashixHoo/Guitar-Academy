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
import {
  guitarPitchDetector,
  PitchDetectionResult,
  NOTE_NAMES_PT,
  normalizeNoteName,
  validateDetectedNoteAgainstExpected,
  ChordEvaluationResult
} from '../../audio/guitarPitchDetector';
import { CHORD_DATABASE } from '../../data/chordDatabase';
import { ChordDiagram } from '../chords/ChordDiagram';
import { getChordShapes } from '../../chords/shapes';
import { parseChordSymbol } from '../../chords/chord-builder';
import { storageService } from '../../services/storageService';
import { createInitialPedagogicalProfile, recordSkillEvidence } from '../../pedagogy/adaptiveEngine';
import { useChordModal } from '../../contexts/ChordModalContext';
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
export type CoachValidationMode = 'arpeggio_all_notes' | 'simultaneous_spectrum';

export interface CoachSummaryData {
  totalSwitches: number;
  confirmedSwitches: number;
  harmonicMatchesCount: number;
  harmonicMismatchesCount: number;
  accuracyPercent: number | null;
  durationSeconds: number;
  bpm: number;
  drillName: string;
  hasValidAudioEvidence: boolean;
}

export function computeCoachSessionSummary(params: {
  totalSwitches: number;
  confirmedSwitches: number;
  harmonicMatchesCount: number;
  harmonicMismatchesCount: number;
  durationSeconds: number;
  bpm: number;
  drillName: string;
}): CoachSummaryData {
  const totalDetections = params.harmonicMatchesCount + params.harmonicMismatchesCount;
  const accuracyPercent = totalDetections > 0
    ? Math.round((params.harmonicMatchesCount / totalDetections) * 100)
    : null;

  return {
    totalSwitches: params.totalSwitches,
    confirmedSwitches: params.confirmedSwitches,
    harmonicMatchesCount: params.harmonicMatchesCount,
    harmonicMismatchesCount: params.harmonicMismatchesCount,
    accuracyPercent,
    durationSeconds: params.durationSeconds,
    bpm: params.bpm,
    drillName: params.drillName,
    hasValidAudioEvidence: totalDetections > 0 && accuracyPercent !== null,
  };
}

export function evaluateMonophonicChordStep(
  pitch: PitchDetectionResult,
  expectedChordNotesRaw: string[],
  alreadyConfirmedNotes: string[],
  options?: { toleranceCents?: number; minConfidence?: number }
): {
  outcome: 'chord_note_hit' | 'wrong_note' | 'unidentified' | 'silence' | 'polyphonic' | 'out_of_tune';
  detectedNote: string | null;
  updatedConfirmedNotes: string[];
  missingNotes: string[];
  chordCompleted: boolean;
  message: string;
} {
  const expectedNotes = Array.from(new Set(expectedChordNotesRaw.map(normalizeNoteName).filter(Boolean)));
  const currentConfirmed = Array.from(new Set(alreadyConfirmedNotes.map(normalizeNoteName).filter(Boolean)));

  if (!pitch || pitch.isSilence || pitch.detectionType === 'silence') {
    return {
      outcome: 'silence',
      detectedNote: null,
      updatedConfirmedNotes: currentConfirmed,
      missingNotes: expectedNotes.filter((n) => !currentConfirmed.includes(n)),
      chordCompleted: expectedNotes.length > 0 && expectedNotes.every((n) => currentConfirmed.includes(n)),
      message: 'Aguardando som do instrumento...'
    };
  }

  if (pitch.detectionType === 'polyphonic_ambiguous') {
    return {
      outcome: 'polyphonic',
      detectedNote: null,
      updatedConfirmedNotes: currentConfirmed,
      missingNotes: expectedNotes.filter((n) => !currentConfirmed.includes(n)),
      chordCompleted: false,
      message: 'Várias notas simultâneas — no modo arpejo, toque uma corda de cada vez.'
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
      outcome: 'unidentified',
      detectedNote: null,
      updatedConfirmedNotes: currentConfirmed,
      missingNotes: expectedNotes.filter((n) => !currentConfirmed.includes(n)),
      chordCompleted: false,
      message: 'Não foi possível identificar a nota'
    };
  }

  // Valida oitava plausível de guitarra/violão (E1/E2 até C6)
  if (pitch.octave !== null && (pitch.octave < 1 || pitch.octave > 6)) {
    return {
      outcome: 'unidentified',
      detectedNote: null,
      updatedConfirmedNotes: currentConfirmed,
      missingNotes: expectedNotes.filter((n) => !currentConfirmed.includes(n)),
      chordCompleted: false,
      message: 'Não foi possível identificar a nota'
    };
  }

  const normDetected = normalizeNoteName(pitch.note);
  const inChord = expectedNotes.includes(normDetected);

  if (inChord) {
    if (Math.abs(pitch.cents) > tolCents) {
      return {
        outcome: 'out_of_tune',
        detectedNote: normDetected,
        updatedConfirmedNotes: currentConfirmed,
        missingNotes: expectedNotes.filter((n) => !currentConfirmed.includes(n)),
        chordCompleted: false,
        message: `Nota ${normDetected} desafinada (${pitch.cents > 0 ? '+' : ''}${pitch.cents}¢) — ajuste dentro de ±${tolCents}¢`
      };
    }

    const updatedSet = Array.from(new Set([...currentConfirmed, normDetected]));
    const missing = expectedNotes.filter((n) => !updatedSet.includes(n));
    const completed = expectedNotes.length > 0 && missing.length === 0;
    return {
      outcome: 'chord_note_hit',
      detectedNote: normDetected,
      updatedConfirmedNotes: updatedSet,
      missingNotes: missing,
      chordCompleted: completed,
      message: completed
        ? `Acorde completo validado! Todas as notas confirmadas (${updatedSet.join(' - ')})`
        : `Nota ${normDetected} confirmada (${updatedSet.length}/${expectedNotes.length}). Faltam: ${missing.join(', ')}`
    };
  }

  const validation = validateDetectedNoteAgainstExpected(pitch, expectedNotes[0] || '', {
    toleranceCents: tolCents,
    minConfidence: minConf
  });

  if (validation.isWrongNote && validation.detectedNote) {
    return {
      outcome: 'wrong_note',
      detectedNote: validation.detectedNote,
      updatedConfirmedNotes: currentConfirmed,
      missingNotes: expectedNotes.filter((n) => !currentConfirmed.includes(n)),
      chordCompleted: false,
      message: `Nota diferente detectada: ${validation.detectedNote}${pitch.octave ?? ''} (${pitch.frequency.toFixed(1)} Hz) — esperado [${expectedNotes.join(', ')}]`
    };
  }

  return {
    outcome: 'unidentified',
    detectedNote: null,
    updatedConfirmedNotes: currentConfirmed,
    missingNotes: expectedNotes.filter((n) => !currentConfirmed.includes(n)),
    chordCompleted: false,
    message: 'Não foi possível identificar a nota'
  };
}

export const GuitarCoachView: React.FC<GuitarCoachViewProps> = ({
  progress,
  onUpdateProgress,
  onNavigateTab
}) => {
  const { toggleChord, isChordOpen } = useChordModal();
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
  const [validationMode, setValidationMode] = useState<CoachValidationMode>('arpeggio_all_notes');
  const [confirmedChordNotes, setConfirmedChordNotes] = useState<string[]>([]);

  // Métricas Acústicas do Treino
  const [acousticallyConfirmedSwitches, setAcousticallyConfirmedSwitches] = useState<number>(0);
  const [harmonicMatchesCount, setHarmonicMatchesCount] = useState<number>(0);
  const [harmonicMismatchesCount, setHarmonicMismatchesCount] = useState<number>(0);
  const [audioFeedbackText, setAudioFeedbackText] = useState<string>('Microfone desativado');
  const [lastDetectedNoteMatch, setLastDetectedNoteMatch] = useState<'root' | 'chord_tone' | 'outside' | 'unidentified' | null>(null);

  // Modal / Resumo pós-treino
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<CoachSummaryData | null>(null);

  // Refs de sincronização (eliminam closures obsoletas em callbacks assíncronos de áudio e timer)
  const isRunningRef = useRef<boolean>(false);
  isRunningRef.current = isRunning;
  const isMicActiveRef = useRef<boolean>(false);
  isMicActiveRef.current = isMicActive;
  const validationModeRef = useRef<CoachValidationMode>('arpeggio_all_notes');
  validationModeRef.current = validationMode;
  const timerIntervalRef = useRef<number | null>(null);
  const currentChordIdxRef = useRef<number>(0);
  currentChordIdxRef.current = currentChordIndex;
  const currentBarRef = useRef<number>(1);
  currentBarRef.current = currentBar;
  const switchWindowHitRef = useRef<boolean>(false);

  const totalSwitchesRef = useRef<number>(0);
  const confirmedSwitchesRef = useRef<number>(0);
  const harmonicMatchesRef = useRef<number>(0);
  const harmonicMismatchesRef = useRef<number>(0);
  const elapsedSecondsRef = useRef<number>(0);
  const confirmedNotesForWindowRef = useRef<string[]>([]);
  const frameConfirmStreakRef = useRef<{ note: string | null; count: number }>({ note: null, count: 0 });
  const wrongStreakRef = useRef<{ note: string | null; count: number }>({ note: null, count: 0 });
  const chordEvalThrottleRef = useRef<number>(0);

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
    const activeShape = shapes[0] || fromDb;
    return {
      symbol: currentChordSymbol,
      namePt: fromDb?.namePt || `${currentChordSymbol}`,
      root: parsed?.root || currentChordSymbol.replace(/[^A-G#b]/g, ''),
      notes: fromDb?.notes || parsed?.notes || [],
      frets: activeShape?.frets || [-1, -1, -1, -1, -1, -1],
      fingers: activeShape?.fingers || [0, 0, 0, 0, 0, 0],
      baseFret: activeShape?.baseFret || 1,
      barre: (activeShape as { barre?: { fret: number; fromString: number; toString: number } })?.barre || fromDb?.barre,
      description: fromDb?.description || 'Toque as cordas com clareza e ritmo firme.'
    };
  }, [currentChordSymbol]);

  const currentChordDetailsRef = useRef(currentChordDetails);
  currentChordDetailsRef.current = currentChordDetails;

  // Próximo acorde info
  const nextChordDetails = useMemo(() => {
    const fromDb = CHORD_DATABASE.find(c => c.symbol === nextChordSymbol);
    const shapes = getChordShapes(nextChordSymbol);
    const activeShape = shapes[0] || fromDb;
    return {
      symbol: nextChordSymbol,
      namePt: fromDb?.namePt || `${nextChordSymbol}`,
      frets: activeShape?.frets || [-1, -1, -1, -1, -1, -1],
      fingers: activeShape?.fingers || [0, 0, 0, 0, 0, 0],
      baseFret: activeShape?.baseFret || 1,
      barre: (activeShape as { barre?: { fret: number; fromString: number; toString: number } })?.barre || fromDb?.barre
    };
  }, [nextChordSymbol]);

  const drillNameCurrent = isCustomMode
    ? 'Sequência Personalizada'
    : drillSets.find(d => d.id === selectedSetId)?.name || 'Treino de Acordes';
  const drillNameRef = useRef(drillNameCurrent);
  drillNameRef.current = drillNameCurrent;
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;

  // Reseta rastreamento da janela acústica ao trocar de acorde
  useEffect(() => {
    confirmedNotesForWindowRef.current = [];
    setConfirmedChordNotes([]);
    frameConfirmStreakRef.current = { note: null, count: 0 };
    wrongStreakRef.current = { note: null, count: 0 };
    switchWindowHitRef.current = false;
  }, [currentChordIndex, currentChordSymbol]);

  // Iniciar / Parar Microfone de forma segura
  const toggleMicrophone = async () => {
    if (isMicActive) {
      guitarPitchDetector.stopListening();
      setIsMicActive(false);
      isMicActiveRef.current = false;
      setIsMicEnabled(false);
      setCurrentPitch(null);
      setAudioFeedbackText('Microfone desligado');
      return;
    }

    setMicErrorMessage(null);
    setAudioFeedbackText('Iniciando captura de áudio...');

    const audioCtx = await audioEngine.initAudio();

    const result = await guitarPitchDetector.startListening((pitch) => {
      if (!pitch) return;
      setCurrentPitch(pitch);
      handlePitchAcousticAnalysis(pitch);
    }, audioCtx);

    if (result.success) {
      setIsMicActive(true);
      isMicActiveRef.current = true;
      setIsMicEnabled(true);
      setAudioFeedbackText('Microfone ativo: aguardando som do instrumento...');
    } else {
      setIsMicActive(false);
      isMicActiveRef.current = false;
      setIsMicEnabled(false);
      setMicErrorMessage(result.error || 'Falha ao acessar o microfone.');
      setAudioFeedbackText('Erro no microfone');
    }
  };

  // Análise Acústica Real via Refs (sempre compara contra o acorde ativo no instante atual)
  const handlePitchAcousticAnalysis = (pitch: PitchDetectionResult) => {
    if (!isRunningRef.current) return;

    if (pitch.audioGraphHealthy === false && pitch.diagnosticMessage) {
      setAudioFeedbackText(pitch.diagnosticMessage);
      return;
    }

    if (pitch.isSilence || pitch.detectionType === 'silence') {
      frameConfirmStreakRef.current = { note: null, count: 0 };
      wrongStreakRef.current = { note: null, count: 0 };
      return;
    }

    const liveChord = currentChordDetailsRef.current;
    const expectedNotes = liveChord.notes;

    // MODO B: Validação Espectral Simultânea de Acordes (exige todas as notas do acorde)
    if (validationModeRef.current === 'simultaneous_spectrum') {
      const now = performance.now();
      if (now - chordEvalThrottleRef.current < 160) return;
      chordEvalThrottleRef.current = now;

      const chordEval: ChordEvaluationResult = guitarPitchDetector.evaluateCurrentChord(expectedNotes);
      setConfirmedChordNotes(chordEval.recognizedNotes);

      if (chordEval.status === 'noise' || chordEval.status === 'unidentified') {
        setLastDetectedNoteMatch('unidentified');
        setAudioFeedbackText('Não foi possível identificar a nota');
        return;
      }

      if (chordEval.isChordConfirmed) {
        setLastDetectedNoteMatch('root');
        setAudioFeedbackText(chordEval.message);
        harmonicMatchesRef.current += 1;
        setHarmonicMatchesCount(harmonicMatchesRef.current);

        if (!switchWindowHitRef.current) {
          switchWindowHitRef.current = true;
          confirmedSwitchesRef.current += 1;
          setAcousticallyConfirmedSwitches(confirmedSwitchesRef.current);
        }
      } else if (chordEval.unexpectedNotes.length > 0 && chordEval.recognizedNotes.length > 0) {
        setLastDetectedNoteMatch('outside');
        setAudioFeedbackText(chordEval.message);
        harmonicMismatchesRef.current += 1;
        setHarmonicMismatchesCount(harmonicMismatchesRef.current);
      } else {
        setLastDetectedNoteMatch('unidentified');
        setAudioFeedbackText(chordEval.message);
      }
      return;
    }

    // MODO A (Padrão Seguro): Validação Nota por Nota / Arpejo — aprova o acorde SOMENTE após confirmar todas as notas esperadas
    const step = evaluateMonophonicChordStep(pitch, expectedNotes, confirmedNotesForWindowRef.current, {
      toleranceCents: 35,
      minConfidence: 0.65,
    });

    if (step.outcome === 'unidentified' || step.outcome === 'polyphonic' || step.outcome === 'out_of_tune') {
      frameConfirmStreakRef.current = { note: null, count: 0 };
      wrongStreakRef.current = { note: null, count: 0 };
      setLastDetectedNoteMatch('unidentified');
      setAudioFeedbackText(step.message);
      return;
    }

    if (step.outcome === 'chord_note_hit' && step.detectedNote) {
      wrongStreakRef.current = { note: null, count: 0 };
      if (frameConfirmStreakRef.current.note === step.detectedNote) {
        frameConfirmStreakRef.current.count += 1;
      } else {
        frameConfirmStreakRef.current = { note: step.detectedNote, count: 1 };
      }

      // Exige 2 quadros consecutivos estáveis para não contar ruído ou ataque transitório
      if (frameConfirmStreakRef.current.count < 2) {
        return;
      }

      const wasAlreadyCountedThisNote = confirmedNotesForWindowRef.current.includes(step.detectedNote);
      confirmedNotesForWindowRef.current = step.updatedConfirmedNotes;
      setConfirmedChordNotes(step.updatedConfirmedNotes);

      const normRoot = normalizeNoteName(liveChord.root);
      setLastDetectedNoteMatch(step.detectedNote === normRoot ? 'root' : 'chord_tone');
      setAudioFeedbackText(step.message);

      if (!wasAlreadyCountedThisNote) {
        harmonicMatchesRef.current += 1;
        setHarmonicMatchesCount(harmonicMatchesRef.current);
      }

      // Acorde só é confirmado quando TODAS as notas esperadas tiverem sido confirmadas
      if (step.chordCompleted && !switchWindowHitRef.current) {
        switchWindowHitRef.current = true;
        confirmedSwitchesRef.current += 1;
        setAcousticallyConfirmedSwitches(confirmedSwitchesRef.current);
      }
      return;
    }

    if (step.outcome === 'wrong_note' && step.detectedNote) {
      frameConfirmStreakRef.current = { note: null, count: 0 };
      if (wrongStreakRef.current.note === step.detectedNote) {
        wrongStreakRef.current.count += 1;
      } else {
        wrongStreakRef.current = { note: step.detectedNote, count: 1 };
      }

      // Só contabiliza erro após 2 quadros consecutivos estáveis de uma nota diferente reconhecida
      if (wrongStreakRef.current.count === 2) {
        setLastDetectedNoteMatch('outside');
        setAudioFeedbackText(step.message);
        harmonicMismatchesRef.current += 1;
        setHarmonicMismatchesCount(harmonicMismatchesRef.current);
      }
    }
  };

  // Iniciar Sessão de Treino com Metrônomo do Guitar Academy
  const startCoachSession = async () => {
    await audioEngine.initAudio();

    setIsRunning(true);
    isRunningRef.current = true;
    setCurrentChordIndex(0);
    setCurrentBar(1);
    setCurrentBeat(1);
    setTotalSwitches(0);
    setElapsedSeconds(0);
    setAcousticallyConfirmedSwitches(0);
    setHarmonicMatchesCount(0);
    setHarmonicMismatchesCount(0);
    setConfirmedChordNotes([]);
    setLastDetectedNoteMatch(null);

    totalSwitchesRef.current = 0;
    confirmedSwitchesRef.current = 0;
    harmonicMatchesRef.current = 0;
    harmonicMismatchesRef.current = 0;
    elapsedSecondsRef.current = 0;
    confirmedNotesForWindowRef.current = [];
    frameConfirmStreakRef.current = { note: null, count: 0 };
    wrongStreakRef.current = { note: null, count: 0 };
    switchWindowHitRef.current = false;
    currentChordIdxRef.current = 0;
    currentBarRef.current = 1;

    if (isMicEnabled && !isMicActiveRef.current) {
      toggleMicrophone();
    }

    timerIntervalRef.current = window.setInterval(() => {
      elapsedSecondsRef.current += 1;
      const next = elapsedSecondsRef.current;
      setElapsedSeconds(next);
      if (sessionDurationMinutes > 0 && next >= sessionDurationMinutes * 60) {
        stopCoachSession();
      }
    }, 1000);

    audioEngine.startMetronome(
      bpm,
      4,
      'quarter',
      true,
      (beatIdx, _measureIdx, isAccent) => {
        const beatNum = beatIdx + 1;
        setCurrentBeat(beatNum);
        setIsBeatAccent(isAccent);

        if (beatNum === 1) {
          setCurrentBar(prevBar => {
            const nextBar = prevBar + 1;

            if (barsPerChord === 0.5) {
              return 1;
            } else if (nextBar > barsPerChord) {
              setCurrentChordIndex(prevIdx => {
                const newIdx = prevIdx + 1;
                currentChordIdxRef.current = newIdx;
                return newIdx;
              });
              totalSwitchesRef.current += 1;
              setTotalSwitches(totalSwitchesRef.current);
              return 1;
            }
            return nextBar;
          });
        } else if (barsPerChord === 0.5 && beatNum === 3) {
          setCurrentChordIndex(prevIdx => {
            const newIdx = prevIdx + 1;
            currentChordIdxRef.current = newIdx;
            return newIdx;
          });
          totalSwitchesRef.current += 1;
          setTotalSwitches(totalSwitchesRef.current);
        }
      }
    );
  };

  // Parar Sessão (lê Refs ao vivo — zero stale closures, zero precisão inventada)
  const stopCoachSession = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    audioEngine.stopMetronome();

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const summary = computeCoachSessionSummary({
      totalSwitches: totalSwitchesRef.current,
      confirmedSwitches: confirmedSwitchesRef.current,
      harmonicMatchesCount: harmonicMatchesRef.current,
      harmonicMismatchesCount: harmonicMismatchesRef.current,
      durationSeconds: elapsedSecondsRef.current,
      bpm: bpmRef.current,
      drillName: drillNameRef.current,
    });

    setSummaryData(summary);
    setShowSummaryModal(true);
  };

  // Salvar Prática no Progresso (apenas com evidência sonora válida para áudio; sem inflar métricas em silêncio/ruído)
  const handleSaveProgress = () => {
    if (!summaryData) return;
    const timeSpent = Math.max(10, summaryData.durationSeconds);

    let updatedProfile = progress.pedagogicalProfile || createInitialPedagogicalProfile();
    if (
      summaryData.hasValidAudioEvidence &&
      summaryData.accuracyPercent !== null &&
      summaryData.confirmedSwitches > 0 &&
      isMicActiveRef.current
    ) {
      updatedProfile = recordSkillEvidence(updatedProfile, 'skill-chord-transitions', {
        source: 'guitar_coach_audio',
        score: summaryData.accuracyPercent,
        accuracyPercent: summaryData.accuracyPercent,
        details: `Sessão Guitar Coach: ${summaryData.confirmedSwitches}/${summaryData.totalSwitches} acordes confirmados acusticamente (${summaryData.accuracyPercent}% precisão a ${summaryData.bpm} BPM).`,
      });
    } else if (!isMicActiveRef.current && summaryData.totalSwitches > 0) {
      updatedProfile = recordSkillEvidence(updatedProfile, 'skill-chord-transitions', {
        source: 'exercise_repetitions',
        score: Math.min(100, 50 + summaryData.totalSwitches * 3),
        details: `Sessão Guitar Coach sem microfone: ${summaryData.totalSwitches} trocas praticadas com metrônomo a ${summaryData.bpm} BPM.`,
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
                <div
                  key={drill.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (isRunning) stopCoachSession();
                    setSelectedSetId(drill.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isRunning) stopCoachSession();
                      setSelectedSetId(drill.id);
                    }
                  }}
                  className={`p-3.5 rounded-xl text-left transition border cursor-pointer ${
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
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {drill.chords.map((ch, idx) => {
                      const open = isChordOpen({ symbol: ch });
                      return (
                        <React.Fragment key={idx}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChord({ symbol: ch });
                            }}
                            title={`Toque para ver ou fechar o diagrama do acorde ${ch}`}
                            className={`px-2 py-0.5 rounded border text-xs font-black transition cursor-pointer ${
                              open
                                ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                                : 'bg-white border-[#D9D9D9] text-[#7B1E2B] hover:bg-[#F5E8EA]'
                            }`}
                          >
                            {ch}
                          </button>
                          {idx < drill.chords.length - 1 && (
                            <span className="text-[10px] text-[#A6A6B2]">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#666672] mt-2 line-clamp-1">
                    {drill.description}
                  </p>
                </div>
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
          {/* Acorde Atual (Gigante com Diagrama Visual) */}
          <div className="md:col-span-2 space-y-2 flex flex-col items-center">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#B52A3A]">
              Tocar Agora
            </span>
            <button
              type="button"
              onClick={() => toggleChord({ symbol: currentChordDetails.symbol, chordData: currentChordDetails })}
              title={`Toque para ampliar ou fechar o diagrama do acorde ${currentChordDetails.symbol}`}
              className="text-6xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:text-[#FF8FA3] transition cursor-pointer"
            >
              {currentChordDetails.symbol}
            </button>
            <div className="text-sm font-semibold text-[#D9D9D9]">
              {currentChordDetails.namePt}
            </div>
            <div className="text-[11px] text-[#A6A6B2]">
              Notas: {currentChordDetails.notes.join(' - ')}
            </div>

            <div className="mt-2 bg-black/30 p-2 rounded-2xl border border-white/10">
              <ChordDiagram
                frets={currentChordDetails.frets}
                fingers={currentChordDetails.fingers}
                baseFret={currentChordDetails.baseFret}
                barre={currentChordDetails.barre}
                symbol={currentChordDetails.symbol}
                size="sm"
                showAudio={false}
                showTitle={false}
                showDetails={false}
              />
            </div>
          </div>

          {/* Seta de Transição */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <ArrowRight className="w-10 h-10 text-[#7B1E2B] animate-pulse hidden md:block" />
            <span className="text-xs text-[#A6A6B2] font-semibold md:mt-1">
              Próxima
            </span>
          </div>

          {/* Próximo Acorde (Preparação com Diagrama Visual) */}
          <div className="md:col-span-2 space-y-2 opacity-90 flex flex-col items-center">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#A6A6B2]">
              Preparar Dedos
            </span>
            <button
              type="button"
              onClick={() => toggleChord({ symbol: nextChordDetails.symbol, chordData: nextChordDetails })}
              title={`Toque para ampliar ou fechar o diagrama do acorde ${nextChordDetails.symbol}`}
              className="text-4xl sm:text-5xl font-black text-[#E8D3D6] tracking-tight hover:text-white transition cursor-pointer"
            >
              {nextChordDetails.symbol}
            </button>
            <div className="text-sm font-semibold text-[#A6A6B2]">
              {nextChordDetails.namePt}
            </div>
            <div className="text-[11px] text-[#8C8C9A]">
              Antecipe o posicionamento
            </div>

            <div className="mt-2 bg-black/30 p-2 rounded-2xl border border-white/10">
              <ChordDiagram
                frets={nextChordDetails.frets}
                fingers={nextChordDetails.fingers}
                baseFret={nextChordDetails.baseFret}
                barre={nextChordDetails.barre}
                symbol={nextChordDetails.symbol}
                size="xs"
                showAudio={false}
                showTitle={false}
                showDetails={false}
              />
            </div>
          </div>
        </div>

        {/* Monitor Acústico em Tempo Real (Web Audio + Microfone) */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-left max-w-2xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Monitor Acústico da Guitarra Real
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg bg-white/10 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setValidationMode('arpeggio_all_notes')}
                  disabled={isRunning}
                  className={`px-2 py-0.5 rounded font-bold transition ${
                    validationMode === 'arpeggio_all_notes'
                      ? 'bg-[#7B1E2B] text-white'
                      : 'text-[#A6A6B2] hover:text-white'
                  }`}
                >
                  Arpejo (Nota a Nota)
                </button>
                <button
                  type="button"
                  onClick={() => setValidationMode('simultaneous_spectrum')}
                  disabled={isRunning}
                  className={`px-2 py-0.5 rounded font-bold transition ${
                    validationMode === 'simultaneous_spectrum'
                      ? 'bg-[#7B1E2B] text-white'
                      : 'text-[#A6A6B2] hover:text-white'
                  }`}
                >
                  Acorde Simultâneo (Espectro)
                </button>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isMicActive ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-white/10 text-[#A6A6B2]'
              }`}>
                {isMicActive ? 'Captação Ativa' : 'Microfone Desligado'}
              </span>
            </div>
          </div>

          {/* Progresso por Nota do Acorde Atual (nunca aprova com apenas 1 nota) */}
          {currentChordDetails.notes.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-[#A6A6B2] mr-1">
                Notas exigidas para confirmar {currentChordDetails.symbol}:
              </span>
              {currentChordDetails.notes.map((n) => {
                const norm = normalizeNoteName(n);
                const hit = confirmedChordNotes.includes(norm);
                return (
                  <span
                    key={n}
                    className={`px-2 py-0.5 rounded text-[11px] font-black border transition ${
                      hit
                        ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]'
                        : 'bg-white/5 border-white/15 text-[#A6A6B2]'
                    }`}
                  >
                    {hit ? `✓ ${n}` : n}
                  </span>
                );
              })}
            </div>
          )}

          {isMicActive && currentPitch && !currentPitch.isSilence ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#A6A6B2] block">Nota Tocada:</span>
                <strong className="text-sm font-black text-white">
                  {currentPitch.detectionType === 'monophonic_note' && currentPitch.note
                    ? `${currentPitch.note}${currentPitch.octave !== null ? ` (${currentPitch.octave})` : ''}`
                    : '—'}
                </strong>
                <span className="text-[10px] text-[#A6A6B2] block">
                  {currentPitch.detectionType === 'monophonic_note' && currentPitch.notePt
                    ? currentPitch.notePt
                    : currentPitch.detectionType === 'polyphonic_ambiguous'
                    ? 'Polifonia'
                    : 'Não identificada'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#A6A6B2] block">Frequência:</span>
                <strong className="text-sm font-bold text-white">
                  {currentPitch.frequency > 0 ? `${currentPitch.frequency.toFixed(1)} Hz` : '—'}
                </strong>
                <span className={`text-[10px] font-semibold block ${
                  currentPitch.frequency <= 0
                    ? 'text-[#A6A6B2]'
                    : Math.abs(currentPitch.cents) <= 15
                    ? 'text-[#10b981]'
                    : 'text-amber-400'
                }`}>
                  {currentPitch.frequency > 0
                    ? `${currentPitch.cents > 0 ? `+${currentPitch.cents}` : currentPitch.cents} cents`
                    : 'Sem frequência fixa'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#A6A6B2] block">Confiança:</span>
                <strong className={`text-sm font-bold ${
                  currentPitch.confidence >= 0.75 ? 'text-[#10b981]' : currentPitch.confidence >= 0.60 ? 'text-amber-400' : 'text-[#A6A6B2]'
                }`}>
                  {currentPitch.stabilityLabel}
                </strong>
                <span className="text-[10px] text-[#A6A6B2] block">
                  {Math.round(currentPitch.confidence * 100)}% confiança
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
                    ? 'text-rose-400' 
                    : 'text-[#A6A6B2]'
                }`}>
                  {lastDetectedNoteMatch === 'root'
                    ? 'Tônica Confirmada'
                    : lastDetectedNoteMatch === 'chord_tone'
                    ? 'Nota do Acorde'
                    : lastDetectedNoteMatch === 'outside'
                    ? 'Nota Diferente'
                    : lastDetectedNoteMatch === 'unidentified'
                    ? 'Não identificada'
                    : 'Aguardando'}
                </strong>
                <span className="text-[10px] text-[#A6A6B2]">
                  {harmonicMatchesCount} ✓ • {harmonicMismatchesCount} ✗
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#A6A6B2] py-1 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#A6A6B2] shrink-0" />
              <span>
                {isMicActive
                  ? validationMode === 'arpeggio_all_notes'
                    ? `Aguardando som... Toque cada nota do acorde (${currentChordDetails.notes.join(' - ')}) separadamente para validação rigorosa.`
                    : `Aguardando som... Palhete todas as cordas de ${currentChordDetails.symbol} (${currentChordDetails.notes.join(' - ')}).`
                  : 'Ative o microfone para comparar em tempo real as notas tocadas com o acorde alvo.'}
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
              onClick={stopCoachSession}
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
                  {summaryData.accuracyPercent !== null ? `${summaryData.accuracyPercent}%` : '—'}
                </strong>
                <span className="text-[9px] text-[#666672] block">
                  {summaryData.accuracyPercent === null
                    ? 'Sem evidência sonora válida'
                    : summaryData.accuracyPercent >= 80
                    ? 'Excelente'
                    : 'Em evolução'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5E8EA] border border-[#E8D3D6] text-xs text-[#7B1E2B] space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Avaliação do Treinador:</span>
              </strong>
              <p>
                {summaryData.hasValidAudioEvidence
                  ? `${summaryData.harmonicMatchesCount} nota(s) confirmada(s) e ${summaryData.harmonicMismatchesCount} divergência(s) registradas com evidência acústica real.`
                  : isMicActive
                  ? 'Nenhuma nota pôde ser validada com segurança pelo microfone nesta sessão. O progresso não foi alterado com pontuação falsa.'
                  : summaryData.totalSwitches >= 20
                  ? 'Boa regularidade rítmica com o metrônomo!'
                  : 'Pratique com o metrônomo e ative o microfone para validar suas notas.'}
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

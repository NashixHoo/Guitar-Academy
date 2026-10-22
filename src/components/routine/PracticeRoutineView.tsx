import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, NavigationTab, PracticeSessionRecord, PracticeSessionStepRecord } from '../../types';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { audioEngine } from '../../audio/audioEngine';
import { storageService } from '../../services/storageService';
import { 
  generatePracticeRoutine, 
  ExecutablePracticeExercise,
  GeneratedRoutine 
} from '../../pedagogy/practiceRoutineEngine';
import { professorService } from '../../services/professorService';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  Target, 
  Award, 
  ArrowRight, 
  Guitar, 
  AlertCircle,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

interface PracticeRoutineViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onSelectLesson: (lessonId: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenMetronomeAtBpm: (bpm: number) => void;
}

export const PracticeRoutineView: React.FC<PracticeRoutineViewProps> = ({
  progress,
  onUpdateProgress,
  onSelectLesson,
  onNavigateTab,
}) => {
  // Configuração inicial de duração (5, 10, 15 ou 30 min)
  const initialDuration = (
    [5, 10, 15, 30].includes(progress.studyPlan?.dailyRoutineMinutes as number)
      ? progress.studyPlan.dailyRoutineMinutes
      : 15
  ) as 5 | 10 | 15 | 30;

  const [routineDuration, setRoutineDuration] = useState<5 | 10 | 15 | 30>(initialDuration);
  
  // Geração determinística da rotina baseada no motor pedagógico
  const [routine, setRoutine] = useState<GeneratedRoutine>(() =>
    generatePracticeRoutine(initialDuration, progress)
  );

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const activeExercise: ExecutablePracticeExercise = routine.exercises[currentStepIndex] || routine.exercises[0];

  // Estado do andamento interativo (BPM)
  const [currentBpm, setCurrentBpm] = useState<number>(activeExercise?.initialBpm || 60);

  // Metrônomo sonoro integrado
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [metronomeBeat, setMetronomeBeat] = useState<number>(0);

  // Cronômetro da sessão e cálculo de tempo efetivo ativo
  const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState<number>(0); // tempo efetivo ativo da sessão
  const [stepElapsedSeconds, setStepElapsedSeconds] = useState<number>(0); // tempo ativo na etapa atual

  // Contadores e resultados da etapa
  const [stepRepsCompleted, setStepRepsCompleted] = useState<number>(0);
  const [stepSelfRating, setStepSelfRating] = useState<'needs_work' | 'consistent' | 'mastered'>('consistent');

  // Histórico temporário da sessão em andamento
  const [sessionStepsLog, setSessionStepsLog] = useState<PracticeSessionStepRecord[]>([]);

  // Modal de conclusão e síntese da sessão
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [sessionCompletedData, setSessionCompletedData] = useState<PracticeSessionRecord | null>(null);
  const [sessionNotes, setSessionNotes] = useState<string>('');

  // Dica pedagógica do Professor IA
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  // Feedback toast
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Regenera a rotina quando a duração muda
  const handleChangeDuration = (newDuration: 5 | 10 | 15 | 30) => {
    // Para metrônomo se ativo
    audioEngine.stopMetronome();
    setIsMetronomeActive(false);
    setIsSessionRunning(false);

    setRoutineDuration(newDuration);
    const newRoutine = generatePracticeRoutine(newDuration, progress);
    setRoutine(newRoutine);
    setCurrentStepIndex(0);
    setCurrentBpm(newRoutine.exercises[0]?.initialBpm || 60);
    setStepRepsCompleted(0);
    setStepElapsedSeconds(0);
    setSessionElapsedSeconds(0);
    setSessionStepsLog([]);

    // Salva preferência no plano de estudo
    const updated: UserProgress = {
      ...progress,
      studyPlan: {
        ...progress.studyPlan,
        dailyRoutineMinutes: newDuration,
      },
    };
    onUpdateProgress(updated);
    storageService.saveProgress(updated);
  };

  // Quando troca de etapa dentro da mesma sessão
  useEffect(() => {
    if (activeExercise) {
      setCurrentBpm(activeExercise.initialBpm);
      setStepRepsCompleted(0);
      setStepElapsedSeconds(0);
      setAiTip(null);
      if (isMetronomeActive) {
        audioEngine.updateMetronomeParams(activeExercise.initialBpm);
      }
    }
  }, [currentStepIndex]);

  // Cronômetro de tempo efetivo (apenas enquanto a sessão está em execução ativa)
  useEffect(() => {
    let intervalId: number | null = null;
    if (isSessionRunning) {
      intervalId = window.setInterval(() => {
        setSessionElapsedSeconds((prev) => prev + 1);
        setStepElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [isSessionRunning]);

  // Limpeza de áudio ao desmontar componente
  useEffect(() => {
    return () => {
      audioEngine.stopMetronome();
    };
  }, []);

  // Iniciar / Pausar sessão
  const handleTogglePlayPause = () => {
    if (!isSessionRunning) {
      // Iniciar / Retomar
      setIsSessionRunning(true);
      // Inicia metrônomo automaticamente junto com a sessão para ritmo imediato
      audioEngine.startMetronome(
        currentBpm,
        4,
        'quarter',
        true,
        (beatIdx) => setMetronomeBeat(beatIdx)
      );
      setIsMetronomeActive(true);
    } else {
      // Pausar
      setIsSessionRunning(false);
      audioEngine.stopMetronome();
      setIsMetronomeActive(false);
    }
  };

  // Alternar Metrônomo individualmente
  const handleToggleMetronome = () => {
    if (isMetronomeActive) {
      audioEngine.stopMetronome();
      setIsMetronomeActive(false);
    } else {
      audioEngine.startMetronome(
        currentBpm,
        4,
        'quarter',
        true,
        (beatIdx) => setMetronomeBeat(beatIdx)
      );
      setIsMetronomeActive(true);
      // Se a sessão estiver parada, inicia a contagem de prática efetiva
      if (!isSessionRunning) {
        setIsSessionRunning(true);
      }
    }
  };

  // Alterar BPM com recalibragem imediata do metrônomo
  const handleAdjustBpm = (delta: number) => {
    const newBpm = Math.max(40, Math.min(220, currentBpm + delta));
    setCurrentBpm(newBpm);
    if (isMetronomeActive) {
      audioEngine.updateMetronomeParams(newBpm);
    }
  };

  // Concluir Etapa Atual e Avançar
  const handleCompleteCurrentStep = () => {
    audioEngine.playGuitarNote(523.25, 0.5, 0.8); // C5 chime

    const stepLog: PracticeSessionStepRecord = {
      stepId: activeExercise.id,
      stepTitle: activeExercise.title,
      skillId: activeExercise.skillId,
      category: activeExercise.category,
      initialBpm: activeExercise.initialBpm,
      finalBpm: currentBpm,
      targetBpm: activeExercise.targetBpm,
      repetitionsCompleted: stepRepsCompleted,
      effectiveSeconds: stepElapsedSeconds,
      completed: true,
      selfRating: stepSelfRating,
    };

    const updatedLogs = [...sessionStepsLog.filter((s) => s.stepId !== activeExercise.id), stepLog];
    setSessionStepsLog(updatedLogs);

    if (currentStepIndex < routine.exercises.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setFeedbackToast(`Etapa concluída! Próximo exercício: ${routine.exercises[currentStepIndex + 1]?.title.split('—')[0]}`);
      setTimeout(() => setFeedbackToast(null), 3000);
    } else {
      // Concluiu última etapa -> dispara síntese da sessão
      handleFinishSession(updatedLogs);
    }
  };

  // Pular ou trocar de exercício sem perder registros anteriores
  const handleSkipOrSwitchStep = (targetIdx: number) => {
    // Grava etapa parcial se praticou mais de 5 segundos
    if (stepElapsedSeconds >= 5) {
      const partialLog: PracticeSessionStepRecord = {
        stepId: activeExercise.id,
        stepTitle: activeExercise.title,
        skillId: activeExercise.skillId,
        category: activeExercise.category,
        initialBpm: activeExercise.initialBpm,
        finalBpm: currentBpm,
        targetBpm: activeExercise.targetBpm,
        repetitionsCompleted: stepRepsCompleted,
        effectiveSeconds: stepElapsedSeconds,
        completed: false, // marcado como pulado/parcial
        selfRating: stepSelfRating,
      };
      setSessionStepsLog((prev) => [...prev.filter((s) => s.stepId !== activeExercise.id), partialLog]);
    }

    setCurrentStepIndex(targetIdx);
  };

  // Abandonar Sessão (com salvamento do tempo efetivo praticado)
  const handleAbandonSession = () => {
    audioEngine.stopMetronome();
    setIsMetronomeActive(false);
    setIsSessionRunning(false);

    if (sessionElapsedSeconds >= 10) {
      if (confirm('Deseja salvar o tempo de prática já realizado antes de sair?')) {
        handleFinishSession(sessionStepsLog, true);
        return;
      }
    }
    // Reinicia contadores
    setSessionElapsedSeconds(0);
    setStepElapsedSeconds(0);
    setStepRepsCompleted(0);
    setSessionStepsLog([]);
  };

  // Finalizar Sessão e Exibir Síntese
  const handleFinishSession = (completedSteps: PracticeSessionStepRecord[], wasAbandoned: boolean = false) => {
    audioEngine.stopMetronome();
    setIsMetronomeActive(false);
    setIsSessionRunning(false);
    audioEngine.playCompletionChime();

    const uniqueSkills = Array.from(new Set(completedSteps.map((s) => s.skillId).filter(Boolean))) as string[];
    const bpms = completedSteps.map((s) => s.finalBpm || 60);
    const highest = bpms.length > 0 ? Math.max(...bpms) : currentBpm;
    const avg = bpms.length > 0 ? Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length) : currentBpm;

    const sessionRecord: PracticeSessionRecord = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      durationPlannedMinutes: routineDuration,
      effectiveStudyTimeSeconds: sessionElapsedSeconds,
      stepsCount: routine.exercises.length,
      stepsCompleted: completedSteps.filter((s) => s.completed).length,
      skillsPracticed: uniqueSkills,
      highestBpm: highest,
      averageBpm: avg,
      overallRating: wasAbandoned ? 'needs_work' : 'good',
      abandoned: wasAbandoned,
      recommendationGiven: routine.recommendation.title,
      steps: completedSteps,
    };

    setSessionCompletedData(sessionRecord);
    setShowSummaryModal(true);
  };

  // Confirmar e Salvar Sessão no Perfil Pedagógico
  const handleSaveAndCloseSummary = () => {
    if (!sessionCompletedData) return;

    const recordToSave: PracticeSessionRecord = {
      ...sessionCompletedData,
      studentNotes: sessionNotes,
    };

    // Salva no storageService e alimenta o perfil pedagógico deterministicamente
    const updated = storageService.recordPracticeSession(recordToSave);
    onUpdateProgress(updated);

    setShowSummaryModal(false);
    setSessionCompletedData(null);
    setSessionElapsedSeconds(0);
    setStepElapsedSeconds(0);
    setStepRepsCompleted(0);
    setSessionStepsLog([]);
    setSessionNotes('');

    setFeedbackToast('Sessão registrada com sucesso no seu perfil pedagógico! 🎸');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Solicitar Dica Pedagógica do Professor IA com Fallback Gracioso
  const handleRequestAiTip = async () => {
    setIsAiLoading(true);
    setAiTip(null);

    try {
      const response = await professorService.askQuestion(
        `Como guitarrista iniciante/intermediário, qual é a dica biomecânica e prática mais importante para executar com perfeição o exercício: "${activeExercise.title}" a ${currentBpm} BPM?`,
        {
          studentLevel: routine.level,
          currentLessonTitle: activeExercise.title,
          masteredSkills: [activeExercise.skillId],
        }
      );

      if (response && response.reply) {
        setAiTip(response.reply);
      } else {
        throw new Error('Sem resposta');
      }
    } catch {
      // Fallback gracioso local com dicas pedagógicas determinísticas comprovadas
      setAiTip(
        `💡 Dica do Professor IA (Modo Resiliente Local): No andamento de ${currentBpm} BPM, foque 100% no relaxamento do polegar atrás do braço da guitarra. ${activeExercise.simplificationStrategy} Não tente acelerar enquanto o som não estiver 100% limpo e sem trastejamento.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Formatação de minutos e segundos
  const sessionMins = Math.floor(sessionElapsedSeconds / 60);
  const sessionSecs = sessionElapsedSeconds % 60;
  const stepMins = Math.floor(stepElapsedSeconds / 60);
  const stepSecs = stepElapsedSeconds % 60;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#25252A] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#B52A3A]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* TOP BANNER: CENTRAL DE PRÁTICA DIÁRIA */}
      <div className="bg-white dark:bg-[#22141A] border border-[#D9D9D9] dark:border-[#422933] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle pillar banner background */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 pointer-events-none opacity-20 hidden md:block">
          <img
            src="./images/backgrounds/banner-praticar.svg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-right"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#7B1E2B]" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E8EA] dark:bg-[#381A25] border border-[#E8D3D6] dark:border-[#7B1E2B]/40 text-[#7B1E2B] dark:text-[#FF6B81] text-xs font-bold mb-2">
              <Guitar className="w-3.5 h-3.5 text-[#B52A3A]" />
              <span>Central de Prática Instrumental • Guitarra Física</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#25252A] dark:text-[#F8F7F4] leading-tight">
              Treino Diário Estruturado
            </h1>
            <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1 font-medium max-w-xl">
              Exercícios reais com metrônomo integrado, controle de andamento, palhetada alternada e progressão mensurável.
            </p>
          </div>

          {/* Duração da Sessão (5, 10, 15 ou 30 min) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#666672] uppercase tracking-wider block">
              Duração da Sessão
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={`dur-${mins}`}
                  onClick={() => handleChangeDuration(mins as 5 | 10 | 15 | 30)}
                  className={`py-2 px-3.5 rounded-xl font-bold text-xs transition border flex items-center gap-1.5 ${
                    routineDuration === mins
                      ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                      : 'bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] border-[#D9D9D9]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mins}m</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CARD DE RECOMENDAÇÃO PRIORITÁRIA DO DIA */}
        <div className="mt-5 p-4 bg-[#F8F7F4] rounded-2xl border border-[#D9D9D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#7B1E2B] tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Recomendação Adaptativa Prioritária
            </span>
            <h2 className="text-sm sm:text-base font-black text-[#25252A]">
              {routine.recommendation.title}
            </h2>
            <p className="text-xs text-[#666672] leading-relaxed">
              {routine.priorityRationale}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab(routine.recommendation.targetTab)}
            className="shrink-0 px-4 py-2 rounded-xl bg-white hover:bg-[#F5E8EA] border border-[#D9D9D9] text-[#7B1E2B] text-xs font-bold transition flex items-center gap-1 shadow-xs"
          >
            <span>Ver no {routine.recommendation.targetTab}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PAINEL DE CONTROLE DA SESSÃO ATIVA (STICKY OU DESTACADO) */}
      <div className="bg-[#25252A] text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Botão Gigante Play / Pause */}
          <button
            onClick={handleTogglePlayPause}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-transform active:scale-95 ${
              isSessionRunning
                ? 'bg-amber-600 hover:bg-amber-700 ring-4 ring-amber-600/20'
                : 'bg-[#7B1E2B] hover:bg-[#B52A3A] ring-4 ring-[#7B1E2B]/30'
            }`}
            title={isSessionRunning ? 'Pausar Sessão' : 'Iniciar Sessão'}
          >
            {isSessionRunning ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSessionRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-xs uppercase font-mono-code tracking-wider text-white/70">
                {isSessionRunning ? 'Prática Efetiva Ativa' : 'Sessão Pausada'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black font-mono-code text-white">
                {String(sessionMins).padStart(2, '0')}:{String(sessionSecs).padStart(2, '0')}
              </span>
              <span className="text-xs text-white/60">
                / {routineDuration}:00 min
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLES INTEGRADOS DE METRÔNOMO E SPEED TRAINER */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Metrônomo Toggle */}
          <button
            onClick={handleToggleMetronome}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 border ${
              isMetronomeActive
                ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
          >
            {isMetronomeActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span>Metrônomo: {currentBpm} BPM</span>
          </button>

          {/* Ajustes de BPM (+5 / -5) */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/20">
            <button
              onClick={() => handleAdjustBpm(-5)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              title="Reduzir 5 BPM (Simplificar)"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono-code text-xs font-bold">
              {currentBpm} BPM
            </span>
            <button
              onClick={() => handleAdjustBpm(+5)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              title="Acelerar 5 BPM (Desafio)"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Abandonar Sessão */}
          {sessionElapsedSeconds > 0 && (
            <button
              onClick={handleAbandonSession}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-rose-900/40 border border-white/20 text-xs font-bold text-white transition flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          )}
        </div>
      </div>

      {/* ÁREA DE TRABALHO DA ROTINA: ETAPAS + EXERCÍCIO ATIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUNA ESQUERDA: LISTA DE ETAPAS DA SESSÃO */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F2F2F2]">
              <span className="text-xs font-bold text-[#666672] uppercase tracking-wider">
                Etapas ({routine.exercises.length})
              </span>
              <span className="text-xs font-mono-code font-bold text-[#7B1E2B]">
                {currentStepIndex + 1} de {routine.exercises.length}
              </span>
            </div>

            <div className="space-y-2">
              {routine.exercises.map((ex, idx) => {
                const isActive = currentStepIndex === idx;
                const isCompleted = sessionStepsLog.some((s) => s.stepId === ex.id && s.completed);

                return (
                  <button
                    key={ex.id}
                    onClick={() => handleSkipOrSwitchStep(idx)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-medium transition border flex items-start justify-between ${
                      isActive
                        ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] border-[#D9D9D9]'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] uppercase font-bold block ${isActive ? 'text-white/80' : 'text-[#7B1E2B]'}`}>
                        {idx + 1}. {ex.category}
                      </span>
                      <span className="font-bold line-clamp-1 mt-0.5">{ex.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span className={`text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-[#666672] border border-[#D9D9D9]'
                      }`}>
                        {ex.durationMinutes}m
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dica do Professor IA para a Etapa */}
          <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
                <span>Mentor Didático IA</span>
              </span>
            </div>

            {aiTip ? (
              <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D9D9D9] text-xs text-[#25252A] leading-relaxed animate-in fade-in">
                {aiTip}
              </div>
            ) : (
              <p className="text-xs text-[#666672]">
                Dificuldade técnica neste exercício? Solicite uma dica pontual de relaxamento e biomecânica.
              </p>
            )}

            <button
              onClick={handleRequestAiTip}
              disabled={isAiLoading}
              className="w-full py-2 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] border border-[#D9D9D9] text-[#7B1E2B] text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiLoading ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Consultando Professor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pedir Dica para este Exercício</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA: EXERCÍCIO PRÁTICO EXECUTÁVEL */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header do Exercício */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D9D9D9]">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
                  {activeExercise.category} • Etapa {currentStepIndex + 1} de {routine.exercises.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#25252A] mt-2">
                  {activeExercise.title}
                </h2>
                <p className="text-xs text-[#666672] font-medium mt-1">
                  {activeExercise.subtitle}
                </p>
              </div>

              {/* Tempo decorrido na etapa */}
              <div className="flex items-center gap-2 bg-[#F8F7F4] border border-[#D9D9D9] px-3.5 py-1.5 rounded-xl text-xs font-mono-code font-bold text-[#25252A]">
                <Clock className="w-4 h-4 text-[#7B1E2B]" />
                <span>
                  {String(stepMins).padStart(2, '0')}:{String(stepSecs).padStart(2, '0')} praticados
                </span>
              </div>
            </div>

            {/* O QUE O ALUNO VAI APRENDER */}
            <div className="p-4 bg-[#F8F7F4] rounded-2xl border border-[#D9D9D9] space-y-1.5">
              <span className="text-[11px] font-bold text-[#7B1E2B] uppercase tracking-wider block">
                🎯 Objetivo de Aprendizagem
              </span>
              <p className="text-xs sm:text-sm text-[#25252A] font-medium leading-relaxed">
                {activeExercise.learningGoal}
              </p>
            </div>

            {/* SEQUÊNCIA E TABLATURA */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#25252A] uppercase tracking-wider block">
                  🎸 Sequência Musical na Guitarra Física
                </span>
                <span className="text-[11px] font-mono-code font-bold text-[#666672]">
                  {activeExercise.musicalSequence}
                </span>
              </div>
              <div className="p-4 bg-[#1A1A20] rounded-2xl text-xs sm:text-sm font-mono-code text-[#F8F7F4] border border-[#33333E] overflow-x-auto whitespace-pre">
                {activeExercise.tablatureText}
              </div>
            </div>

            {/* DICAS BIOMECÂNICAS E DE POSTURA */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#B52A3A]" />
                <span>Como Posicionar as Mãos e Executar o Movimento</span>
              </span>
              <ul className="space-y-1.5 text-xs text-[#4D4D54] bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9]">
                {activeExercise.biomechanicsInstructions.map((tip, tipIdx) => (
                  <li key={tipIdx} className="flex items-start gap-2">
                    <span className="text-[#7B1E2B] font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ESTRATÉGIAS: SIMPLIFICAÇÃO SE HOUVER ERRO vs AVANÇO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 text-rose-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-rose-800">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Se houver dificuldade ou erros:
                </span>
                <p className="text-[11px] leading-relaxed">
                  {activeExercise.simplificationStrategy}
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Como avançar com consistência:
                </span>
                <p className="text-[11px] leading-relaxed">
                  {activeExercise.progressionStrategy}
                </p>
              </div>
            </div>

            {/* CRITÉRIO DE SUCESSO */}
            <div className="p-3.5 bg-[#F5E8EA] rounded-xl border border-[#E8D3D6] text-xs text-[#7B1E2B] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B52A3A] shrink-0" />
              <span>Critério de Validação: {activeExercise.successCriteria}</span>
            </div>

            {/* CONTADOR DE REPETIÇÕES E AUTOAVALIAÇÃO DA ETAPA */}
            <div className="pt-4 border-t border-[#D9D9D9] flex flex-wrap items-center justify-between gap-4">
              {/* Repetições */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#666672]">
                  Repetições Limpas Concluídas:
                </span>
                <div className="flex items-center gap-1.5 bg-[#F8F7F4] p-1 rounded-xl border border-[#D9D9D9]">
                  <button
                    onClick={() => setStepRepsCompleted((prev) => Math.max(0, prev - 1))}
                    className="p-1 rounded-lg hover:bg-white text-[#25252A]"
                    title="Diminuir repetição"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-mono-code font-bold text-sm text-[#7B1E2B]">
                    {stepRepsCompleted} / {activeExercise.targetRepetitions}
                  </span>
                  <button
                    onClick={() => setStepRepsCompleted((prev) => prev + 1)}
                    className="p-1 rounded-lg hover:bg-white text-[#25252A]"
                    title="Adicionar repetição concluída"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Seletor de Autoavaliação Honesta */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#666672]">
                  Sensação:
                </span>
                <select
                  value={stepSelfRating}
                  onChange={(e) => setStepSelfRating(e.target.value as 'needs_work' | 'consistent' | 'mastered')}
                  className="bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#25252A] focus:outline-none"
                >
                  <option value="needs_work">Preciso lapidar mais</option>
                  <option value="consistent">Consistente e limpo</option>
                  <option value="mastered">Dominado com segurança</option>
                </select>
              </div>
            </div>

            {/* BOTÕES DE NAVEGAÇÃO DA SESSÃO */}
            <div className="flex items-center justify-between pt-4 border-t border-[#D9D9D9]">
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  currentStepIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-[#666672]'
                    : 'bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] border border-[#D9D9D9]'
                }`}
              >
                ← Etapa Anterior
              </button>

              <button
                onClick={handleCompleteCurrentStep}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] font-bold text-xs sm:text-sm shadow-xs transition"
              >
                <span>
                  {currentStepIndex < routine.exercises.length - 1
                    ? 'Concluir Etapa e Avançar'
                    : 'Concluir Sessão e Salvar'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE SÍNTESE DA SESSÃO CONCLUÍDA */}
      {showSummaryModal && sessionCompletedData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-[#D9D9D9]">
              <div className="p-3 bg-[#F5E8EA] rounded-2xl text-[#7B1E2B]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#25252A]">
                  Síntese da Sessão de Prática
                </h3>
                <span className="text-xs text-[#666672] font-medium">
                  {sessionCompletedData.abandoned ? 'Sessão encerrada antecipadamente' : 'Sessão completa realizada com sucesso!'}
                </span>
              </div>
            </div>

            {/* Métricas Reais Efetivas */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D9D9D9]">
                <span className="text-[#666672] text-[10px] uppercase font-bold block">Tempo Efetivo</span>
                <span className="text-lg font-black text-[#7B1E2B]">
                  {Math.round(sessionCompletedData.effectiveStudyTimeSeconds / 60)} min
                </span>
              </div>
              <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D9D9D9]">
                <span className="text-[#666672] text-[10px] uppercase font-bold block">Etapas Feitas</span>
                <span className="text-lg font-black text-[#25252A]">
                  {sessionCompletedData.stepsCompleted} / {sessionCompletedData.stepsCount}
                </span>
              </div>
              <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D9D9D9]">
                <span className="text-[#666672] text-[10px] uppercase font-bold block">Andamento Máx.</span>
                <span className="text-lg font-black text-[#25252A]">
                  {sessionCompletedData.highestBpm} BPM
                </span>
              </div>
            </div>

            {/* Habilidades Alimentadas no Perfil */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-[#25252A] block">
                Habilidades Alimentadas com Novas Evidências:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sessionCompletedData.skillsPracticed.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-md bg-[#F8F7F4] text-[#7B1E2B] border border-[#D9D9D9] font-mono-code font-bold text-[10px]"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-[#666672] italic">
                * Concluir uma sessão gera evidências sólidas, mas não concede domínio automático. O domínio é calculado pela consistência acumulada no tempo.
              </p>
            </div>

            {/* Notas pessoais do aluno */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#25252A] block">
                Notas Pessoais da Sessão (Opcional)
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Ex.: Troca C para G fluindo melhor. Dedo 4 ainda precisa de um pouco mais de arco..."
                rows={2}
                className="w-full bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl p-3 text-xs text-[#25252A] focus:outline-none focus:border-[#7B1E2B]"
              />
            </div>

            {/* Botão Salvar e Fechar */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#D9D9D9]">
              <button
                onClick={handleSaveAndCloseSummary}
                className="w-full py-3 rounded-2xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Sessão e Atualizar Perfil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, NavigationTab, LevelInfo } from '../../types';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { audioEngine } from '../../audio/audioEngine';
import { storageService } from '../../services/storageService';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Target, 
  Award, 
  ArrowRight, 
  Guitar, 
  AlertCircle,
  Volume2,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface PracticeRoutineViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onSelectLesson: (lessonId: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenMetronomeAtBpm: (bpm: number) => void;
}

interface RoutineStep {
  id: string;
  category: 'Aquecimento' | 'Técnica Mão Esquerda' | 'Palhetada Alternada' | 'Sincronia' | 'Precisão Rítmica' | 'Aplicação Musical' | 'Revisão';
  title: string;
  durationMinutes: number;
  initialBpm: number;
  objective: string;
  commonMistakes: string[];
  tabSnippet?: string;
  criteria: string;
}

export const PracticeRoutineView: React.FC<PracticeRoutineViewProps> = ({
  progress,
  onUpdateProgress,
  onSelectLesson,
  onNavigateTab,
  onOpenMetronomeAtBpm,
}) => {
  const currentPlan = progress.studyPlan || {
    selectedLevel: 0,
    primaryGoal: 'fundamentals',
    dailyRoutineMinutes: 20,
    startDate: new Date().toISOString().split('T')[0],
  };

  const [routineDuration, setRoutineDuration] = useState<10 | 20 | 30>(currentPlan.dailyRoutineMinutes || 20);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Define steps according to duration selected
  const getRoutineSteps = (duration: 10 | 20 | 30, level: number): RoutineStep[] => {
    if (duration === 10) {
      return [
        {
          id: 'step-1',
          category: 'Aquecimento',
          title: 'Alongamento suave e exercício cromático 1-2-3-4 na 6ª corda',
          durationMinutes: 2,
          initialBpm: 60,
          objective: 'Despertar a circulação dos dedos e aquecer os tendões sem forçar velocidade.',
          commonMistakes: ['Tensionar os ombros', 'Bater a palheta com força excessiva'],
          tabSnippet: '6ª corda: 1-2-3-4 (Palheta: ↓ ↑ ↓ ↑)',
          criteria: 'Som 100% limpo em 4 compassos seguidos a 60 BPM.',
        },
        {
          id: 'step-2',
          category: 'Palhetada Alternada',
          title: 'Sincronização rigorosa Down-Up entre cordas vizinhas',
          durationMinutes: 3,
          initialBpm: 70,
          objective: 'Garantir que a palheta alterne sem interrupção entre a 6ª e a 5ª corda.',
          commonMistakes: ['Repetir duas palhetadas para baixo ao trocar de corda'],
          tabSnippet: '6ª: 1-2-3-4 | 5ª: 1-2-3-4 (↓ ↑ ↓ ↑)',
          criteria: 'Movimento estritamente originado do pulso relaxado.',
        },
        {
          id: 'step-3',
          category: 'Aplicação Musical',
          title: level >= 2 ? 'Improviso melódico na Pentatônica de Am' : 'Transição limpa dos acordes abertos',
          durationMinutes: 3,
          initialBpm: level >= 2 ? 65 : 75,
          objective: level >= 2 ? 'Construir frases curtas de 3 a 5 notas com pausas.' : 'Troca no ar entre G, Cadd9 e Em7.',
          commonMistakes: ['Parar a mão da palheta durante a troca de acordes'],
          tabSnippet: level >= 2 ? 'Pentatônica Posição 1 (Casas 5 a 8)' : 'G -> Cadd9 -> Em7 -> Dsus4',
          criteria: 'Manter a batida sem pausas nos tempos fortes.',
        },
        {
          id: 'step-4',
          category: 'Revisão',
          title: 'Revisão rápida de memorização sem olhar para a tela',
          durationMinutes: 2,
          initialBpm: 60,
          objective: 'Fechar os olhos e executar o exercício principal fixando o mapa motor.',
          commonMistakes: ['Consultar o diagrama a cada nota'],
          criteria: 'Execução de olhos fechados com confiança.',
        },
      ];
    }

    if (duration === 20) {
      return [
        {
          id: 'step-1',
          category: 'Aquecimento',
          title: 'Aquecimento gradual: digitação 1-2-3-4 em todas as 6 cordas',
          durationMinutes: 3,
          initialBpm: 60,
          objective: 'Aquecer a musculatura intrínseca da mão esquerda e soltar o pulso direito.',
          commonMistakes: ['Começar em velocidade alta com as mãos frias', 'Apertar a escala com força extrema'],
          tabSnippet: '6ª corda à 1ª corda: 1-2-3-4 (↓ ↑ ↓ ↑)',
          criteria: 'Nenhum zumbido ou trastejamento nas 6 cordas.',
        },
        {
          id: 'step-2',
          category: 'Técnica Mão Esquerda',
          title: 'Independência e força do dedo mínimo (Dedo 4)',
          durationMinutes: 4,
          initialBpm: 65,
          objective: 'Curvar as falanges do dedo 4 e posicioná-lo rente ao traste.',
          commonMistakes: ['Deixar o dedo 4 esticado reto como uma vareta'],
          tabSnippet: 'Cordas 3 e 2: casas 3 e 5 alternadas com dedos 1 e 4',
          criteria: 'Articulação redonda da ponta do dedo.',
        },
        {
          id: 'step-3',
          category: 'Palhetada Alternada',
          title: 'Palhetada alternada estrita e cruzamento de cordas',
          durationMinutes: 4,
          initialBpm: 75,
          objective: 'Manter a amplitude mínima da ponta da palheta (3 mm).',
          commonMistakes: ['Afastar a palheta longe das cordas'],
          tabSnippet: 'Padrão alternado: 4ª corda casa 5-7, 3ª corda casa 5-7',
          criteria: 'Palheta firme sem escapar dos dedos.',
        },
        {
          id: 'step-4',
          category: 'Precisão Rítmica',
          title: 'Treino de semínimas e colcheias no metrônomo',
          durationMinutes: 4,
          initialBpm: 80,
          objective: 'Cravar as notas exatamente no centro do clique do metrônomo.',
          commonMistakes: ['Adiantar as notas (ansiedade rítmica)'],
          criteria: 'Sensação de que o clique do metrônomo "desaparece" atrás da sua palhetada.',
        },
        {
          id: 'step-5',
          category: 'Aplicação Musical',
          title: level >= 2 ? 'Fraseado na Pentatônica com Bends e Vibratos' : 'Levada rítmica Worship / Pop no repertório',
          durationMinutes: 3,
          initialBpm: 80,
          objective: 'Aplicar a técnica em música real com dinâmica e emoção.',
          commonMistakes: ['Tocar todas as notas no mesmo volume sem expressividade'],
          criteria: 'Diferenciação clara entre versos calmos e refrão com peso.',
        },
        {
          id: 'step-6',
          category: 'Revisão',
          title: 'Fixação e registro de evolução no diário de prática',
          durationMinutes: 2,
          initialBpm: 60,
          objective: 'Registrar o andamento atingido e planejar o próximo treino.',
          commonMistakes: ['Guardar a guitarra sem avaliar os pontos que precisam de atenção'],
          criteria: 'Registro salvo no aplicativo.',
        },
      ];
    }

    // 30 min full intensive session
    return [
      {
        id: 'step-1',
        category: 'Aquecimento',
        title: 'Alongamento dos flexores do antebraço e cromáticos 1-2-3-4',
        durationMinutes: 4,
        initialBpm: 60,
        objective: 'Preparação biomecânica profunda sem tensão.',
        commonMistakes: ['Alongar com puxões bruscos'],
        criteria: 'Articulações aquecidas e relaxadas.',
      },
      {
        id: 'step-2',
        category: 'Técnica Mão Esquerda',
        title: 'Independência de dedos, ligados (Hammer-on e Pull-off)',
        durationMinutes: 5,
        initialBpm: 70,
        objective: 'Produzir som nítido ao martelar e puxar a corda sem auxílio da palheta.',
        commonMistakes: ['Puxar a corda para cima em vez de para baixo no pull-off'],
        criteria: 'Volume idêntico entre a nota palhetada e a nota ligada.',
      },
      {
        id: 'step-3',
        category: 'Palhetada Alternada',
        title: 'Sincronização estrita de mãos em andamento crescente (Speed Trainer)',
        durationMinutes: 5,
        initialBpm: 75,
        objective: 'Iniciar a 75 BPM e subir 5 BPM a cada 4 compassos até o limite do conforto.',
        commonMistakes: ['Continuar acelerando mesmo após errar notas'],
        criteria: 'Parar na velocidade onde a execução for impecável.',
      },
      {
        id: 'step-4',
        category: 'Precisão Rítmica',
        title: 'Subdivisões rítmicas: semínimas, colcheias e tercinas com metrônomo',
        durationMinutes: 5,
        initialBpm: 70,
        objective: 'Mudar a subdivisão (1 nota, 2 notas e 3 notas por batida) mantendo o BPM fixo.',
        commonMistakes: ['Apressar as tercinas'],
        criteria: 'Controle métrico consciente.',
      },
      {
        id: 'step-5',
        category: 'Aplicação Musical',
        title: 'Improvisação autoral e repertório prático',
        durationMinutes: 8,
        initialBpm: 80,
        objective: 'Construir solos autorais aplicando pausas e resolução harmônica.',
        commonMistakes: ['Tocar notas aleatórias sem objetivo melódico'],
        criteria: 'Frases com começo, meio e fim coerentes.',
      },
      {
        id: 'step-6',
        category: 'Revisão',
        title: 'Revisão espaçada de conteúdos marcados e autoavaliação',
        durationMinutes: 3,
        initialBpm: 60,
        objective: 'Repassar aulas salvas na fila de revisão e gravar mentalmente os avanços.',
        commonMistakes: ['Negligenciar a repetição espaçada'],
        criteria: 'Revisão concluída.',
      },
    ];
  };

  const steps = getRoutineSteps(routineDuration, currentPlan.selectedLevel);
  const activeStep = steps[currentStepIndex] || steps[0];

  // Initialize timer for active step
  useEffect(() => {
    setTimerSecondsLeft(activeStep.durationMinutes * 60);
    setIsTimerRunning(false);
  }, [currentStepIndex, routineDuration]);

  // Live timer interval
  useEffect(() => {
    if (isTimerRunning && timerSecondsLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            audioEngine.playCompletionChime();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  const handleUpdateDuration = (mins: 10 | 20 | 30) => {
    setRoutineDuration(mins);
    setCurrentStepIndex(0);
    const updated: UserProgress = {
      ...progress,
      studyPlan: {
        ...currentPlan,
        dailyRoutineMinutes: mins,
      },
      dailyGoalMinutes: mins,
    };
    onUpdateProgress(updated);
    storageService.saveProgress(updated);
  };

  const handleUpdateLevel = (lvl: number) => {
    const updated: UserProgress = {
      ...progress,
      studyPlan: {
        ...currentPlan,
        selectedLevel: lvl,
      },
    };
    onUpdateProgress(updated);
    storageService.saveProgress(updated);
  };

  const minutesLeft = Math.floor(timerSecondsLeft / 60);
  const secondsLeft = timerSecondsLeft % 60;

  // Active lesson from curriculum
  const allLessons = CURRICULUM_LEVELS.flatMap((l) => l.lessons);
  const currentLesson =
    allLessons.find((l) => l.id === progress.currentLessonId) ||
    allLessons.find((l) => !progress.completedLessons.includes(l.id)) ||
    allLessons[0];

  // Lessons queued for review
  const reviewLessons = allLessons.filter(
    (l) => progress.practiceLogs?.[l.id]?.needsReview || progress.practiceLogs?.[l.id]?.confidence === 'needs_review'
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner: Personalized Study Plan Configuration */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#7B1E2B]" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E8EA] border border-[#E8D3D6] text-[#7B1E2B] text-xs font-bold mb-2">
              <Target className="w-3.5 h-3.5 text-[#B52A3A]" />
              <span>Plano de Estudo Personalizado • Guitarra Física</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#25252A] leading-tight">
              Sessões Diárias de Prática Guiada
            </h1>
            <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium max-w-xl">
              Estrutura profissional de treino: aquecimento, mecânica motora, palhetada alternada, ritmo e aplicação musical.
            </p>
          </div>

          {/* Quick Resume Button */}
          <button
            onClick={() => onSelectLesson(currentLesson.id)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] font-bold text-xs sm:text-sm shadow-xs transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Retomar Aula Atual: {currentLesson.title.split('—')[0]}</span>
          </button>
        </div>

        {/* Profile Selector Controls */}
        <div className="mt-6 pt-6 border-t border-[#D9D9D9] grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Level Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
              Seu Nível Pedagógico Atual
            </label>
            <select
              value={currentPlan.selectedLevel}
              onChange={(e) => handleUpdateLevel(Number(e.target.value))}
              className="w-full bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[#25252A] focus:outline-none focus:border-[#7B1E2B]"
            >
              {CURRICULUM_LEVELS.map((lvl) => (
                <option key={`level-opt-${lvl.level}`} value={lvl.level}>
                  {lvl.name} ({lvl.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Session Duration Selector (10, 20 or 30 min) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
              Tempo Disponível para Hoje
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30].map((mins) => (
                <button
                  key={`time-btn-${mins}`}
                  onClick={() => handleUpdateDuration(mins as 10 | 20 | 30)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition border flex items-center justify-center gap-1.5 ${
                    routineDuration === mins
                      ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                      : 'bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] border-[#D9D9D9]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mins} minutos</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Routine Workspace: Steps Bar + Active Step Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Step Navigation */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-[#666672] uppercase tracking-wider block mb-3">
              Etapas da Sessão ({routineDuration} min)
            </span>
            <div className="space-y-2">
              {steps.map((step, idx) => {
                const isActive = currentStepIndex === idx;
                const isPast = currentStepIndex > idx;

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-medium transition border flex items-start justify-between ${
                      isActive
                        ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                        : isPast
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] border-[#D9D9D9]'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] uppercase font-bold block ${isActive ? 'text-white/80' : 'text-[#7B1E2B]'}`}>
                        {idx + 1}. {step.category}
                      </span>
                      <span className="font-bold line-clamp-1 mt-0.5">{step.title}</span>
                    </div>
                    <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#666672] border border-[#D9D9D9]'
                    }`}>
                      {step.durationMinutes}m
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spaced Repetition Box */}
          <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <RotateCcw className="w-3.5 h-3.5 text-[#B52A3A]" />
              <span>Fila de Revisão Espaçada</span>
            </span>
            {reviewLessons.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] text-[#666672]">
                  {reviewLessons.length} aula(s) marcadas para revisão e fixação motora:
                </p>
                {reviewLessons.slice(0, 3).map((l) => (
                  <button
                    key={`review-item-${l.id}`}
                    onClick={() => onSelectLesson(l.id)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] border border-[#D9D9D9] text-xs font-bold text-[#25252A] flex items-center justify-between transition"
                  >
                    <span className="line-clamp-1">{l.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#7B1E2B]" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#666672] font-medium italic">
                Nenhuma aula pendente de revisão. Excelente trabalho!
              </p>
            )}
          </div>
        </div>

        {/* Right Col: Active Step Execution View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D9D9D9]">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
                  {activeStep.category} • Etapa {currentStepIndex + 1} de {steps.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#25252A] mt-2">
                  {activeStep.title}
                </h2>
              </div>

              {/* Integrated Step Stopwatch */}
              <div className="flex items-center gap-3 bg-[#F8F7F4] border border-[#D9D9D9] px-4 py-2 rounded-2xl">
                <Clock className="w-5 h-5 text-[#7B1E2B]" />
                <span className="text-2xl font-black font-mono-code text-[#25252A]">
                  {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
                </span>
                <button
                  onClick={() => setIsTimerRunning((prev) => !prev)}
                  className={`p-2 rounded-xl text-white font-bold transition ${
                    isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7B1E2B] hover:bg-[#B52A3A]'
                  }`}
                  title={isTimerRunning ? 'Pausar Cronômetro' : 'Iniciar Cronômetro'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSecondsLeft(activeStep.durationMinutes * 60);
                  }}
                  className="p-2 rounded-xl bg-white border border-[#D9D9D9] text-[#666672] hover:bg-[#F5E8EA]"
                  title="Reiniciar tempo da etapa"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Objective & Metronome trigger */}
            <div className="p-4 bg-[#F8F7F4] rounded-2xl border border-[#D9D9D9] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                    Objetivo Desta Etapa
                  </span>
                  <p className="text-xs sm:text-sm text-[#25252A] mt-1 font-medium leading-relaxed">
                    {activeStep.objective}
                  </p>
                </div>
                <button
                  onClick={() => onOpenMetronomeAtBpm(activeStep.initialBpm)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5E8EA] border border-[#D9D9D9] text-[#7B1E2B] text-xs font-bold transition shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Metrônomo ({activeStep.initialBpm} BPM)</span>
                </button>
              </div>

              {/* Tab snippet */}
              {activeStep.tabSnippet && (
                <div className="mt-2 p-3 bg-[#1A1A20] rounded-xl text-xs sm:text-sm font-mono-code text-[#F8F7F4] border border-[#33333E]">
                  {activeStep.tabSnippet}
                </div>
              )}
            </div>

            {/* Common Mistakes to Avoid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Erros Comuns a Evitar</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#666672] font-medium bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                {activeStep.commonMistakes.map((err, errIdx) => (
                  <li key={errIdx}>{err}</li>
                ))}
              </ul>
            </div>

            {/* Completion Criteria */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Critério para Avançar: {activeStep.criteria}</span>
            </div>

            {/* Navigation between steps */}
            <div className="flex items-center justify-between pt-4 border-t border-[#D9D9D9]">
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  currentStepIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-[#666672]'
                    : 'bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] border border-[#D9D9D9]'
                }`}
              >
                Etapa Anterior
              </button>

              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] font-bold text-xs sm:text-sm shadow-xs transition"
                >
                  <span>Próxima Etapa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    audioEngine.playCompletionChime();
                    onNavigateTab('progress');
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-bold text-xs sm:text-sm shadow-xs transition"
                >
                  <Award className="w-4 h-4" />
                  <span>Sessão de {routineDuration}m Concluída! Ver Progresso</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

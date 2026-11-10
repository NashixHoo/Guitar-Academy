import React, { useState } from 'react';
import { UserProgress, NavigationTab } from '../../types';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { SOLO_LESSONS } from '../../data/soloCourse';
import { VIOLAO_LESSONS } from '../../data/violaoCourse';
import { storageService } from '../../services/storageService';
import { 
  Play, 
  Sparkles, 
  Clock, 
  Flame, 
  Guitar, 
  BookOpen, 
  Trophy, 
  ArrowRight, 
  Compass, 
  CheckCircle2,
  Volume2,
  Radio,
  Zap,
  Target,
  Check,
  Edit3,
  Plus,
  Award,
  TrendingUp,
  Sliders,
  RotateCcw,
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { 
  getPrimaryCourseId, 
  calculateCourseProgress, 
  COURSE_METADATA_MAP 
} from '../../academia/progress/unlockGate';
import { IniciarIcon, PraticarIcon, AulasIcon } from '../common/GuitarIcons';
import { DailyGoalSettings } from './DailyGoalSettings';
import { ContinueFormationCard } from './ContinueFormationCard';
import { DailyPracticePlanCard } from './DailyPracticePlanCard';
import { SkillDomainMapCard } from './SkillDomainMapCard';
import { ContextualRecommendationsCard } from './ContextualRecommendationsCard';
import { PracticeMetricsAndLogCard } from './PracticeMetricsAndLogCard';
import {
  getAdaptiveRecommendation,
  createInitialPedagogicalProfile,
} from '../../pedagogy/adaptiveEngine';

interface DashboardViewProps {
  progress: UserProgress;
  onUpdateProgress?: (updated: UserProgress) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  onUpdateProgress,
  onNavigateTab,
  onSelectLesson,
}) => {
  // Goal setting & feedback states
  const [isGoalSettingsModalOpen, setIsGoalSettingsModalOpen] = useState<boolean>(false);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  // Find current lesson (supporting canonical curriculum, solo course & violao course)
  const allCurriculumLessons = CURRICULUM_LEVELS.flatMap((l) => l.lessons);
  const allLessons = [...allCurriculumLessons, ...SOLO_LESSONS, ...VIOLAO_LESSONS];
  const currentLesson =
    allLessons.find((l) => l.id === progress.currentLessonId) ||
    allLessons.find((l) => !progress.completedLessons.includes(l.id)) ||
    allLessons[0];

  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / allCurriculumLessons.length) * 100);

  const hours = Math.floor(progress.totalStudyTimeSeconds / 3600);
  const minutes = Math.floor((progress.totalStudyTimeSeconds % 3600) / 60);

  // Daily Practice Goal Metrics (todayStudyTimeSeconds versus dailyGoalMinutes)
  const todayStudyTimeSeconds = progress.todayStudyTimeSeconds || 0;
  const todayMinutes = Math.floor(todayStudyTimeSeconds / 60);
  const todaySecondsPart = todayStudyTimeSeconds % 60;
  const dailyGoalMinutes = Math.max(5, progress.dailyGoalMinutes || 30);
  const dailyGoalSeconds = dailyGoalMinutes * 60;
  const goalPercentage = Math.round((todayStudyTimeSeconds / dailyGoalSeconds) * 100);
  const clampedPercentage = Math.min(100, Math.max(0, goalPercentage));
  const isGoalReached = todayStudyTimeSeconds >= dailyGoalSeconds;
  const secondsRemaining = Math.max(0, dailyGoalSeconds - todayStudyTimeSeconds);
  const minutesRemaining = Math.ceil(secondsRemaining / 60);
  const extraSeconds = Math.max(0, todayStudyTimeSeconds - dailyGoalSeconds);
  const extraMinutes = Math.floor(extraSeconds / 60);

  // SVG Progress Ring calculations (Radius: 46px, Circumference: ~289.03px)
  const ringRadius = 46;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (clampedPercentage / 100) * ringCircumference;

  // Preset goal choices
  const goalPresets = [10, 15, 20, 30, 45, 60];

  // Memória Pedagógica & Motor de Adaptação (Fase 3)
  const pedagogicalProfile = progress.pedagogicalProfile || createInitialPedagogicalProfile();
  const adaptiveRec = getAdaptiveRecommendation(pedagogicalProfile, progress);
  const skillsList = Object.values(pedagogicalProfile.skills);
  const masteredSkillsCount = skillsList.filter((s) => s.masteryLevel === 'mastered').length;

  // Matriz Central — Curso Principal e Desbloqueio de Eletivas (Fase 4)
  const primaryCourseId = getPrimaryCourseId(progress);
  const primaryMeta = COURSE_METADATA_MAP[primaryCourseId];
  const primaryProg = calculateCourseProgress(primaryCourseId, progress);

  // Update Daily Practice Goal
  const handleUpdateDailyGoal = (newGoalMinutes: number) => {
    const validGoal = Math.max(5, Math.min(240, Math.round(newGoalMinutes)));
    const updated: UserProgress = {
      ...progress,
      dailyGoalMinutes: validGoal,
      studyPlan: {
        ...progress.studyPlan,
        dailyRoutineMinutes: (validGoal <= 15 ? 10 : validGoal <= 25 ? 20 : 30) as 10 | 20 | 30
      }
    };
    if (onUpdateProgress) {
      onUpdateProgress(updated);
    }
    storageService.saveProgress(updated);
    setIsGoalSettingsModalOpen(false);
    setToastFeedback(`Meta diária definida para ${validGoal} minutos! 🎯`);
    setTimeout(() => setToastFeedback(null), 3500);
  };

  // Quick manual log of practice time (e.g. for offline unplugged guitar drills)
  const handleLogQuickPractice = (addMinutes: number) => {
    const addSeconds = addMinutes * 60;
    const updated: UserProgress = {
      ...progress,
      todayStudyTimeSeconds: (progress.todayStudyTimeSeconds || 0) + addSeconds,
      totalStudyTimeSeconds: (progress.totalStudyTimeSeconds || 0) + addSeconds,
      lastStudyDate: storageService.getLocalDateString()
    };
    if (onUpdateProgress) {
      onUpdateProgress(updated);
    }
    storageService.saveProgress(updated);
    setToastFeedback(`+${addMinutes} min registrados na prática de hoje! 🎸`);
    setTimeout(() => setToastFeedback(null), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
      {/* Toast Notification */}
      {toastFeedback && (
        <div className="fixed top-20 right-6 z-50 bg-[#25252A] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#B52A3A]" />
          <span>{toastFeedback}</span>
        </div>
      )}

      {/* Hero: Conservatório & Giannini 101 HSS White with Red Tortoiseshell Accent */}
      <div className="relative overflow-hidden rounded-3xl luxury-hero-banner p-5 sm:p-7 lg:p-10 shadow-xs">
        {/* Subtle decorative tortoiseshell top accent line with gold trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge" />

        {/* Faint guitar silhouette in the background */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none hidden md:block">
          <Guitar className="w-64 h-64 text-[#7B1E2B]" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF4E6] dark:bg-[#382810] border border-[#C5A059]/40 text-[#8C5F18] dark:text-[#F5D38A] text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-display tracking-wider">Trilha de Formação Musical • Conservatório</span>
          </div>

          <div>
            <span className="text-xs text-[#7B1E2B] dark:text-[#FF6B81] font-bold uppercase tracking-wider block font-mono-code">
              {currentLesson.moduleTitle}
            </span>
            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-display font-black text-[#25252A] dark:text-[#F8F7F4] mt-1.5 leading-tight tracking-tight">
              {currentLesson.title}
            </h1>
            <p className="text-xs xs:text-sm sm:text-base text-[#4D4D54] dark:text-[#B8B3C0] mt-2 font-medium leading-relaxed">
              {currentLesson.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2">
            <button
              onClick={() => onSelectLesson(currentLesson.id)}
              className="luxury-btn-primary flex items-center justify-center gap-3 px-6 sm:px-7 py-3.5 rounded-2xl active:scale-95 font-bold text-sm sm:text-base transition w-full sm:w-auto shadow-xs"
            >
              <IniciarIcon className="w-5 h-5 ml-0.5" />
              <span>Continuar Aula Atual</span>
            </button>

            <button
              onClick={() => onNavigateTab('practice-routine')}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-2xl bg-[#FAF1F2] hover:bg-[#F3E2E5] text-[#7B1E2B] font-bold text-xs sm:text-sm border border-[#E8D3D6] transition shadow-2xs w-full sm:w-auto"
            >
              <PraticarIcon className="w-4 h-4 text-[#B52A3A]" />
              <span>Central de Prática (5/10/15/30 min)</span>
            </button>

            <button
              onClick={() => onNavigateTab('curriculum')}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-[#FAF1F2] text-[#25252A] font-bold text-xs sm:text-sm border border-[#D9D9D9] transition shadow-2xs w-full sm:w-auto"
            >
              <AulasIcon className="w-4 h-4 text-[#7B1E2B]" />
              <span>Ver Trilha (6 Níveis)</span>
            </button>
          </div>
        </div>
      </div>

      {/* FASE 2: CONTINUE SUA FORMAÇÃO (HERO DE CONTINUIDADE PEDAGÓGICA) */}
      <ContinueFormationCard
        progress={progress}
        onSelectLesson={onSelectLesson}
        onNavigateTab={onNavigateTab}
      />

      {/* FASE 4: STATUS DO CURSO PRINCIPAL & DESBLOQUEIO DE INSTRUMENTOS (REGRA DOS 50%) */}
      <div className="bg-white dark:bg-[#25252A] border border-[#D9D9D9] dark:border-[#33333E] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5E8EA] dark:bg-[#3A1E24] border border-[#E8D3D6] dark:border-[#4D2830] flex items-center justify-center text-[#7B1E2B] dark:text-[#FF6B81] shrink-0">
              <Guitar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7B1E2B] dark:text-[#FF6B81] bg-[#F5E8EA] dark:bg-[#3A1E24] px-2 py-0.5 rounded-md">
                  Curso Principal Ativo
                </span>
                <span className="text-xs text-[#666672] dark:text-[#B8B3C0]">
                  {primaryMeta.instrumentName}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#25252A] dark:text-[#F8F7F4] mt-0.5">
                {primaryMeta.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('curriculum')}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#1A1A20] hover:bg-[#F5E8EA] dark:hover:bg-[#3A1E24] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#D9D9D9] dark:border-[#33333E] text-xs font-bold transition"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Barra de Progresso com Marco de 50% */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#25252A] dark:text-[#F8F7F4]">
              Progresso no Curso Base ({primaryProg.completedMandatoryActivities} de {primaryProg.totalMandatoryActivities} aulas concluídas):
            </span>
            <span className="font-mono-code text-[#7B1E2B] dark:text-[#FF6B81]">
              {primaryProg.progressPercentage}%
            </span>
          </div>

          <div className="relative w-full bg-[#F0EFEB] dark:bg-[#1A1A20] h-3.5 rounded-full overflow-hidden border border-[#D9D9D9] dark:border-[#33333E]">
            {/* Linha indicadora de 50% */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-500 z-10" title="Marco de 50% para desbloqueio do catálogo" />
            <div
              className={`h-full transition-all duration-300 ${
                primaryProg.isFiftyPercentReached
                  ? 'bg-emerald-600 dark:bg-emerald-500'
                  : 'bg-[#7B1E2B] dark:bg-[#FF6B81]'
              }`}
              style={{ width: `${Math.min(100, primaryProg.progressPercentage)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#666672] dark:text-[#B8B3C0]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Marco de Desbloqueio: 50.0%</span>
            </span>

            {primaryProg.isFiftyPercentReached ? (
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Catálogo de 5 instrumentos liberado por mérito!</span>
              </span>
            ) : (
              <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Restam {primaryProg.remainingActivitiesToFifty} aulas ({primaryProg.remainingPercentageToFifty}%) para liberar todos os instrumentos</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FASE 3: PLANO INTELIGENTE DE PRÁTICA (5 ETAPAS: 10, 15, 20, 30, 45, 60 MIN) */}
      <DailyPracticePlanCard
        progress={progress}
        onNavigateTab={onNavigateTab}
      />

      {/* FASE 4: MAPA DE DOMÍNIO MUSICAL (12 DIMENSÕES TÉCNICAS E ESTADO HONESTO) */}
      <SkillDomainMapCard
        progress={progress}
        onNavigateTab={onNavigateTab}
        onSelectLesson={onSelectLesson}
      />

      {/* FASE 5: RECOMENDAÇÕES CONTEXTUAIS DETERMINÍSTICAS (CONTINUIDADE, REVISÃO, TREINO) */}
      <ContextualRecommendationsCard
        progress={progress}
        onNavigateTab={onNavigateTab}
        onSelectLesson={onSelectLesson}
      />

      {/* FASE 6: REGISTRO DE PRÁTICA REAL & METAS (FÍSICA OFFLINE VS INTERATIVA VERIFICADA) */}
      <PracticeMetricsAndLogCard
        progress={progress}
        onUpdateProgress={onUpdateProgress}
        onToastFeedback={(msg) => {
          setToastFeedback(msg);
          setTimeout(() => setToastFeedback(null), 3500);
        }}
      />

      {/* Quick Metrics Bar: Study Time, Completed Lessons, Daily Goal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="luxury-card rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF4E6] flex items-center justify-center text-[#8C5F18] border border-[#C5A059]/40 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#666672] uppercase font-bold tracking-wider block">Tempo Total</span>
            <span className="text-base sm:text-lg font-black text-[#1F1F24] font-mono-code">
              {hours > 0 ? `${hours}h ` : ''}{minutes}m
            </span>
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#666672] uppercase font-bold tracking-wider block">Aulas Concluídas</span>
            <span className="text-base sm:text-lg font-black text-[#1F1F24] font-mono-code">
              {completedCount} <span className="text-xs font-normal text-[#666672]">/ {allLessons.length}</span>
            </span>
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
            isGoalReached 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-[#FAF1F2] text-[#B52A3A] border-[#E8D3D6]'
          }`}>
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#666672] uppercase font-bold tracking-wider block">Meta Hoje</span>
              <span className={`text-[10px] font-black font-mono-code ${isGoalReached ? 'text-[#059669]' : 'text-[#7B1E2B]'}`}>
                {goalPercentage}%
              </span>
            </div>
            <span className="text-base sm:text-lg font-black text-[#1F1F24] font-mono-code block">
              {todayMinutes} <span className="text-xs font-normal text-[#666672]">/ {dailyGoalMinutes}m</span>
            </span>
            {/* Miniature linear progress bar inside metric card */}
            <div className="w-full bg-[#EAEAEA] rounded-full h-1.5 mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isGoalReached ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-[#7B1E2B] to-[#B52A3A]'
                }`}
                style={{ width: `${clampedPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF1F2] flex items-center justify-center text-[#7B1E2B] border border-[#E8D3D6] shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#666672] uppercase font-bold tracking-wider block">Progresso Geral</span>
            <span className="text-base sm:text-lg font-black text-[#7B1E2B] font-mono-code">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* DESTAQUE: ACADEMIA DO VIOLÃO (30 AULAS) */}
      <div className="bg-gradient-to-r from-[#1F191D] via-[#2E1620] to-[#7B1E2B] text-white p-5 sm:p-6 rounded-3xl border border-[#B52A3A]/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#7B1E2B] text-white text-[10px] font-extrabold uppercase tracking-wider border border-[#B52A3A]/50">
              Formação Completa
            </span>
            <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Academia do Violão • 30 Aulas • 6 Módulos
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            Academia do Violão: Técnica, Harmonia e Expressão
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Do domínio dos acordes abertos e dedilhados à harmonia funcional, pestanas sem dor e criação de arranjos para violão solo.
          </p>
        </div>
        <button
          onClick={() => {
            onNavigateTab('curriculum');
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-[#F5E8EA] text-[#7B1E2B] font-bold text-xs sm:text-sm shadow-xs transition self-start md:self-auto shrink-0"
        >
          <Guitar className="w-4 h-4 text-[#7B1E2B]" />
          <span>Acessar Academia do Violão</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* DESTAQUE: FORMAÇÃO EM GUITARRA SOLO (20 AULAS) */}
      <div className="bg-gradient-to-r from-[#25252A] to-[#3B151E] text-white p-5 sm:p-6 rounded-3xl border border-[#7B1E2B]/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#B52A3A] text-white text-[10px] font-extrabold uppercase tracking-wider">
              Curso Mestre
            </span>
            <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              20 Aulas • 5 Etapas Pedagógicas
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            Formação Progressiva em Guitarra Solo
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Palhetada alternada, 5 padrões da pentatônica menor, bends com biomecânica de 3 dedos, legato, vibrato, notas-alvo e o projeto final de 16 compassos.
          </p>
        </div>
        <button
          onClick={() => {
            onNavigateTab('curriculum');
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#B52A3A] hover:bg-[#D9384B] text-white font-bold text-xs sm:text-sm shadow-xs transition self-start md:self-auto shrink-0"
        >
          <Guitar className="w-4 h-4" />
          <span>Acessar Formação de Solo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Launch Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Guitar Coach Quick Access */}
        <div
          onClick={() => onNavigateTab('guitar-coach')}
          className="bg-white dark:bg-[#1A1216] border border-[#7B1E2B]/30 hover:border-[#7B1E2B] dark:border-[#FF6B81]/30 dark:hover:border-[#FF6B81] p-5 rounded-2xl cursor-pointer transition shadow-2xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] flex items-center justify-center text-[#7B1E2B] dark:text-[#FF6B81] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6] dark:border-[#422933]">
              <Zap className="w-5 h-5 text-[#B52A3A] dark:text-[#FF6B81]" />
            </div>
            <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-base group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors flex items-center gap-1.5">
              <span>Guitar Coach</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#047857] dark:text-[#34D399] font-bold">Novo</span>
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-1 leading-relaxed">
              Treine transições de acordes no tempo com metrônomo e avaliação acústica real.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
            <span>Abrir Treinador</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Professor IA Quick Access */}
        <div
          onClick={() => onNavigateTab('professor-ai')}
          className="bg-white dark:bg-[#1A1216] border border-[#7B1E2B]/40 hover:border-[#7B1E2B] dark:border-[#FF6B81]/40 dark:hover:border-[#FF6B81] p-5 rounded-2xl cursor-pointer transition shadow-2xs group flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF6F6] dark:from-[#1A1216] dark:to-[#22141A]"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#7B1E2B] flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-base group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors flex items-center gap-1.5">
              <span>Professor IA</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#7B1E2B]/15 text-[#7B1E2B] dark:bg-[#FF6B81]/15 dark:text-[#FF6B81] font-bold">Gemini</span>
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-1 leading-relaxed">
              Tira-dúvidas de harmonia, exercícios estruturados com correção e recomendação didática.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
            <span>Consultar Professor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tuner Pro Quick Access */}
        <div
          onClick={() => onNavigateTab('tuner')}
          className="bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] hover:border-[#7B1E2B] dark:hover:border-[#FF6B81] p-5 rounded-2xl cursor-pointer transition shadow-2xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] flex items-center justify-center text-[#7B1E2B] dark:text-[#FF6B81] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6] dark:border-[#422933]">
              <Radio className="w-5 h-5 text-[#7B1E2B] dark:text-[#FF6B81]" />
            </div>
            <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-base group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors">
              Afinador Pro
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-1 leading-relaxed">
              Afinação da guitarra física via microfone real e agulha suave a 60 FPS.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
            <span>Afinar Guitarra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Metronome Quick Access */}
        <div
          onClick={() => onNavigateTab('metronome')}
          className="bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] hover:border-[#7B1E2B] dark:hover:border-[#FF6B81] p-5 rounded-2xl cursor-pointer transition shadow-2xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] flex items-center justify-center text-[#7B1E2B] dark:text-[#FF6B81] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6] dark:border-[#422933]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-base group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors">
              Metrônomo
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-1 leading-relaxed">
              Treine tempo, subdivisões rítmicas e velocidade com o Speed Trainer.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
            <span>Abrir Metrônomo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Chord Dictionary Quick Access */}
        <div
          onClick={() => onNavigateTab('chords')}
          className="bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] hover:border-[#7B1E2B] dark:hover:border-[#FF6B81] p-5 rounded-2xl cursor-pointer transition shadow-2xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] flex items-center justify-center text-[#7B1E2B] dark:text-[#FF6B81] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6] dark:border-[#422933]">
              <Guitar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-base group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors">
              Dicionário de Acordes
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-1 leading-relaxed">
              Consulte digitações, pestanas, power chords e ouça o áudio das cordas.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
            <span>Consultar Acordes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Interactive Fretboard Quick Access */}
        <div
          onClick={() => onNavigateTab('fretboard')}
          className="bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] hover:border-[#7B1E2B] dark:hover:border-[#FF6B81] p-5 rounded-2xl cursor-pointer transition shadow-2xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] flex items-center justify-center text-[#7B1E2B] dark:text-[#FF6B81] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6] dark:border-[#422933]">
              <Sparkles className="w-5 h-5 text-[#B52A3A] dark:text-[#FF6B81]" />
            </div>
            <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-base group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors">
              Braço Interativo
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-1 leading-relaxed">
              Mapeie escalas Pentatônicas, Modos gregos e localize notas nas casas 0 a 22.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
            <span>Explorar Braço</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Ear Training Quick Access */}
        <div
          onClick={() => onNavigateTab('ear-training')}
          className="bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] hover:border-[#7B1E2B] dark:hover:border-[#FF6B81] p-5 rounded-2xl cursor-pointer transition shadow-2xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] flex items-center justify-center text-[#7B1E2B] dark:text-[#FF6B81] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6] dark:border-[#422933]">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-base group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors">
              Treino Auditivo
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-1 leading-relaxed">
              Eduque seus ouvidos para reconhecer intervalos e tirar músicas de ouvido.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
            <span>Iniciar Treino</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Recommended Exercise & Next Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommended Exercise Card */}
        <div className="bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1] dark:border-[#422933]">
            <span className="text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
              Exercício Recomendado para Hoje
            </span>
          </div>

          <div>
            <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-lg">
              Coordenação & Digitação 1-2-3-4 Cromático
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-1 leading-relaxed">
              Pratique o exercício de independência dos dedos nas 6 cordas da guitarra utilizando palhetada alternada estrita a 60 BPM durante 10 minutos.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('technique')}
              className="px-4 py-2.5 rounded-xl bg-[#F8F7F4] dark:bg-[#22141A] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-xs font-bold text-[#25252A] dark:text-[#F8F7F4] transition border border-[#E8E6E1] dark:border-[#422933]"
            >
              Ver Técnica & Tablatura
            </button>
            <button
              onClick={() => onNavigateTab('metronome')}
              className="px-4 py-2.5 rounded-xl bg-[#7B1E2B] dark:bg-[#FF6B81] hover:bg-[#B52A3A] text-xs font-bold text-white dark:text-[#180A0E] transition shadow-2xs"
            >
              Abrir Metrônomo (60 BPM)
            </button>
          </div>
        </div>

        {/* Next Goals Card */}
        <div className="bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1] dark:border-[#422933]">
            <span className="text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] flex items-center gap-1.5 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
              Próximos Objetivos de Estudo
            </span>
          </div>

          <div className="space-y-3">
            {[
              { 
                title: 'Exercício Prático da Aula 1: 10 repetições das 6 cordas a 60 BPM', 
                done: (progress.exerciseRepetitions?.['ex-l1-open-strings-alt-picking'] || 0) >= 10 || !!progress.practiceLogs?.['lesson-1']?.targetRepetitionsMet 
              },
              { title: 'Concluir a Aula 1: As 6 cordas e as 7 notas', done: progress.completedLessons.includes('lesson-1') },
              { title: 'Aprender os primeiros acordes abertos: E, Em, A e Am', done: progress.completedLessons.includes('lesson-5') },
              { title: 'Treinar com o metrônomo por 15 minutos sem interrupção', done: progress.todayStudyTimeSeconds >= 900 },
              { title: 'Localizar as notas naturais nas casas 0 a 12 da 6ª corda', done: progress.completedLessons.includes('lesson-2') },
            ].map((goal, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-[#F8F7F4] dark:bg-[#22141A] p-3 rounded-xl border border-[#E8E6E1] dark:border-[#422933] text-xs"
              >
                {goal.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-[#D9D9D9] dark:border-[#422933] shrink-0" />
                )}
                <span className={goal.done ? 'text-[#666672] dark:text-[#888892] line-through font-normal' : 'text-[#25252A] dark:text-[#F8F7F4] font-semibold'}>
                  {goal.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Configuração de Meta Diária */}
      {isGoalSettingsModalOpen && (
        <DailyGoalSettings
          currentGoalMinutes={dailyGoalMinutes}
          onSaveGoal={(newMins) => {
            handleUpdateDailyGoal(newMins);
            setIsGoalSettingsModalOpen(false);
          }}
          onClose={() => setIsGoalSettingsModalOpen(false)}
          variant="modal"
        />
      )}
    </div>
  );
};

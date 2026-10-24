import React, { useState } from 'react';
import { UserProgress, NavigationTab } from '../../types';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
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
  AlertCircle
} from 'lucide-react';
import { DailyGoalSettings } from './DailyGoalSettings';
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

  // Find current lesson
  const allLessons = CURRICULUM_LEVELS.flatMap((l) => l.lessons);
  const currentLesson =
    allLessons.find((l) => l.id === progress.currentLessonId) ||
    allLessons.find((l) => !progress.completedLessons.includes(l.id)) ||
    allLessons[0];

  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

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
      lastStudyDate: new Date().toISOString().split('T')[0]
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
              <Play className="w-5 h-5 fill-current" />
              <span>Continuar Aula Atual</span>
            </button>

            <button
              onClick={() => onNavigateTab('practice-routine')}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-2xl bg-[#FAF1F2] hover:bg-[#F3E2E5] text-[#7B1E2B] font-bold text-xs sm:text-sm border border-[#E8D3D6] transition shadow-2xs w-full sm:w-auto"
            >
              <Flame className="w-4 h-4 text-[#B52A3A]" />
              <span>Central de Prática (5/10/15/30 min)</span>
            </button>

            <button
              onClick={() => onNavigateTab('curriculum')}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-[#FAF1F2] text-[#25252A] font-bold text-xs sm:text-sm border border-[#D9D9D9] transition shadow-2xs w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4 text-[#7B1E2B]" />
              <span>Ver Trilha (6 Níveis)</span>
            </button>
          </div>
        </div>
      </div>

      {/* PAINEL DE ENSINO ADAPTATIVO & MEMÓRIA PEDAGÓGICA (Fase 3) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#D9D9D9] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F2F2F2]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold uppercase tracking-wider">
              {adaptiveRec.actionType === 'spaced_review' && <RotateCcw className="w-3.5 h-3.5 text-[#B52A3A]" />}
              {adaptiveRec.actionType === 'teach_prerequisite' && <AlertCircle className="w-3.5 h-3.5 text-[#B52A3A]" />}
              {adaptiveRec.actionType === 'instrumental_practice' && <Zap className="w-3.5 h-3.5 text-[#B52A3A]" />}
              {adaptiveRec.actionType === 'reexplain_concept' && <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />}
              {adaptiveRec.actionType === 'advance_next_level' && <TrendingUp className="w-3.5 h-3.5 text-[#B52A3A]" />}
              <span>
                {adaptiveRec.actionType === 'spaced_review' && 'Revisão Espaçada Agendada'}
                {adaptiveRec.actionType === 'teach_prerequisite' && 'Pré-Requisito Não Dominado'}
                {adaptiveRec.actionType === 'instrumental_practice' && 'Treino Prático Motor'}
                {adaptiveRec.actionType === 'reexplain_concept' && 'Reforço de Teoria & Harmonia'}
                {adaptiveRec.actionType === 'advance_next_level' && 'Próximo Passo Recomendado'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#25252A] tracking-tight">
              {adaptiveRec.title}
            </h2>
          </div>

          {/* Indicadores de Dificuldade e Duração */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8F7F4] border border-[#E5E5E5] text-[#4D4D54]">
              ⏱️ {adaptiveRec.suggestedMinutes} min sugeridos
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8F7F4] border border-[#E5E5E5] text-[#4D4D54]">
              🎯 {adaptiveRec.difficultyAdjustment === 'easier' ? 'Passo Simples' : adaptiveRec.difficultyAdjustment === 'challenging' ? 'Desafio Gradual' : 'Passo Regular'}
            </span>
            {adaptiveRec.pendingReviewsCount > 0 && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
                ⚠️ {adaptiveRec.pendingReviewsCount} revisão(ões) pendente(s)
              </span>
            )}
          </div>
        </div>

        {/* Justificativa Pedagógica */}
        <div className="py-4 space-y-2">
          <p className="text-xs sm:text-sm text-[#4D4D54] leading-relaxed">
            <strong className="text-[#25252A]">Por que esta atividade? </strong>
            {adaptiveRec.rationale}
          </p>
        </div>

        {/* Ações: Seguir Recomendação vs Escolher Livremente */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#F2F2F2]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (adaptiveRec.targetLessonId) {
                  onSelectLesson(adaptiveRec.targetLessonId);
                } else {
                  onNavigateTab(adaptiveRec.targetTab);
                }
              }}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] font-bold text-xs sm:text-sm shadow-xs transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Seguir Recomendação</span>
            </button>

            <button
              onClick={() => onNavigateTab('curriculum')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F8F7F4] hover:bg-[#F2F2F2] text-[#25252A] font-bold text-xs sm:text-sm border border-[#D9D9D9] transition"
            >
              <Compass className="w-4 h-4 text-[#666672]" />
              <span>Escolher Livremente</span>
            </button>
          </div>

          {/* Resumo de Domínio */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#666672]">
            <span>
              Habilidades Dominadas:{' '}
              <strong className="text-emerald-600 font-bold">{masteredSkillsCount}</strong>/
              {skillsList.length}
            </span>
            <span>
              Domínio Geral:{' '}
              <strong className="text-[#7B1E2B] font-bold">
                {pedagogicalProfile.overallMasteryPercent}%
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* NOVO: PAINEL DE META DIÁRIA DE PRÁTICA (DAILY PRACTICE GOAL & PROGRESS RING/BAR) */}
      <div className={`relative overflow-hidden rounded-3xl bg-white border p-4 sm:p-8 shadow-xs transition-all ${
        isGoalReached 
          ? 'border-[#10B981]/40 ring-1 ring-[#10B981]/20' 
          : 'border-[#D9D9D9]'
      }`}>
        {/* Subtle accent header line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          isGoalReached ? 'bg-[#10B981]' : 'tortoiseshell-badge'
        }`} />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          
          {/* Lado Esquerdo: Circular Progress Ring (SVG) */}
          <div className="flex flex-col xs:flex-row items-center gap-4 sm:gap-6 shrink-0 text-center xs:text-left">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <defs>
                  {/* Giannini Red Burgundy Gradient */}
                  <linearGradient id="practiceRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7B1E2B" />
                    <stop offset="100%" stopColor="#B52A3A" />
                  </linearGradient>
                  {/* Goal Met Emerald Gradient */}
                  <linearGradient id="goalSuccessRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>

                {/* Track Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={ringRadius}
                  fill="none"
                  stroke={isGoalReached ? 'rgba(16, 185, 129, 0.12)' : '#F2F2F2'}
                  strokeWidth="10"
                />

                {/* Animated Progress Stroke */}
                <circle
                  cx="60"
                  cy="60"
                  r={ringRadius}
                  fill="none"
                  stroke={isGoalReached ? 'url(#goalSuccessRingGradient)' : 'url(#practiceRingGradient)'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Progress Ring Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                {isGoalReached ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mb-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-lg sm:text-xl font-black text-[#10B981] leading-none">
                      {goalPercentage}%
                    </span>
                    <span className="text-[9px] font-bold text-[#059669] uppercase tracking-wide mt-0.5">
                      Meta Atingida
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xl sm:text-2xl font-black text-[#25252A] leading-none font-mono-code">
                      {goalPercentage}%
                    </span>
                    <span className="text-[10px] font-semibold text-[#666672] mt-0.5">
                      {todayMinutes}/{dailyGoalMinutes}m
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Informações de Destaque da Meta */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5E8EA] text-[#7B1E2B] text-[10px] font-bold uppercase tracking-wider">
                <Target className="w-3 h-3 text-[#B52A3A]" />
                <span>Meta Diária de Prática</span>
              </div>

              <div className="flex items-baseline gap-2">
                <strong className="text-2xl sm:text-3xl font-black text-[#25252A] tracking-tight">
                  {todayMinutes} <span className="text-sm font-semibold text-[#666672]">min hoje</span>
                </strong>
                <span className="text-xs font-bold text-[#666672]">
                  / meta de {dailyGoalMinutes} min
                </span>
              </div>

              <p className="text-xs text-[#666672] font-medium max-w-sm">
                {isGoalReached ? (
                  <span className="text-[#059669] font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Parabéns! Meta diária concluída {extraMinutes > 0 ? `(+${extraMinutes} min extras)` : ''}!
                  </span>
                ) : (
                  <span>
                    Faltam apenas <strong className="text-[#7B1E2B] font-bold">{minutesRemaining} minutos</strong> para cumprir sua meta hoje.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Centro / Direita: Barra de Progresso Linear & Seletor de Metas */}
          <div className="w-full lg:max-w-md space-y-4">
            
            {/* Linear Progress Bar com Marcadores de Marcos (0%, 25%, 50%, 75%, 100%) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#666672] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#7B1E2B]" />
                  <span>Progresso do Dia</span>
                </span>
                <span className={isGoalReached ? 'text-[#10B981]' : 'text-[#7B1E2B]'}>
                  {todayMinutes} de {dailyGoalMinutes} min ({goalPercentage}%)
                </span>
              </div>

              {/* Barra */}
              <div className="w-full bg-[#F2F2F2] rounded-full h-3.5 p-0.5 border border-[#E5E5E5] relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isGoalReached
                      ? 'bg-gradient-to-r from-[#10B981] to-[#059669]'
                      : 'bg-gradient-to-r from-[#7B1E2B] to-[#B52A3A]'
                  }`}
                  style={{ width: `${clampedPercentage}%` }}
                />
              </div>

              {/* Marcadores de Etapa */}
              <div className="flex justify-between text-[9px] text-[#8C8C9A] font-semibold px-0.5">
                <span>0m</span>
                <span>{Math.round(dailyGoalMinutes * 0.25)}m</span>
                <span>{Math.round(dailyGoalMinutes * 0.5)}m</span>
                <span>{Math.round(dailyGoalMinutes * 0.75)}m</span>
                <span className={isGoalReached ? 'text-[#10B981] font-bold' : ''}>{dailyGoalMinutes}m (100%)</span>
              </div>
            </div>

            {/* Configuração da Meta Diária via DailyGoalSettings */}
            <div className="pt-1 border-t border-[#F2F2F2] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-[#4D4D54]">
                  Ajustar Meta Diária:
                </span>
                <button
                  onClick={() => setIsGoalSettingsModalOpen(true)}
                  className="text-[11px] font-bold text-[#7B1E2B] hover:text-[#B52A3A] flex items-center gap-1.5 transition px-2.5 py-1 rounded-lg bg-[#F5E8EA] hover:bg-[#ebd3d6]"
                  title="Abrir configurações completas de meta diária"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configurar Meta</span>
                </button>
              </div>

              {/* Botões Chips de Predefinição de Metas (10, 15, 20, 30, 45, 60m) */}
              <div className="flex flex-wrap gap-1.5">
                {goalPresets.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleUpdateDailyGoal(mins)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition border ${
                      dailyGoalMinutes === mins
                        ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                        : 'bg-[#F8F7F4] text-[#4D4D54] border-[#D9D9D9] hover:bg-[#F5E8EA] hover:text-[#7B1E2B]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
                <button
                  onClick={() => setIsGoalSettingsModalOpen(true)}
                  className="py-1.5 px-3 rounded-xl text-xs font-bold transition border border-dashed border-[#7B1E2B] text-[#7B1E2B] hover:bg-[#F5E8EA] flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Personalizar...</span>
                </button>
              </div>

              {/* Registro Rápido de Prática Avulsa (+5 min / +15 min) */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-[#666672]">
                <span>Praticou offline na guitarra física?</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLogQuickPractice(5)}
                    className="px-2 py-1 rounded-lg bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] border border-[#D9D9D9] font-bold text-[10px] flex items-center gap-1 transition"
                    title="Adicionar 5 minutos de prática física de hoje"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+5 min</span>
                  </button>
                  <button
                    onClick={() => handleLogQuickPractice(15)}
                    className="px-2 py-1 rounded-lg bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] border border-[#D9D9D9] font-bold text-[10px] flex items-center gap-1 transition"
                    title="Adicionar 15 minutos de prática física de hoje"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+15 min</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Quick Launch Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Guitar Coach Quick Access */}
        <div
          onClick={() => onNavigateTab('guitar-coach')}
          className="bg-white border-2 border-[#7B1E2B]/30 hover:border-[#7B1E2B] p-5 rounded-2xl cursor-pointer transition shadow-xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] flex items-center justify-center text-[#7B1E2B] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6]">
              <Zap className="w-5 h-5 text-[#B52A3A]" />
            </div>
            <h3 className="font-bold text-[#25252A] text-base group-hover:text-[#7B1E2B] transition-colors flex items-center gap-1.5">
              <span>Guitar Coach</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#047857] font-bold">Novo</span>
            </h3>
            <p className="text-xs text-[#666672] mt-1">
              Treine transições de acordes no tempo com metrônomo e avaliação acústica real.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B]">
            <span>Abrir Treinador</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Professor IA Quick Access */}
        <div
          onClick={() => onNavigateTab('professor-ai')}
          className="bg-white border-2 border-[#7B1E2B]/40 hover:border-[#7B1E2B] p-5 rounded-2xl cursor-pointer transition shadow-xs group flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF6F6]"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#7B1E2B] flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-[#25252A] text-base group-hover:text-[#7B1E2B] transition-colors flex items-center gap-1.5">
              <span>Professor IA</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#7B1E2B]/15 text-[#7B1E2B] font-bold">Gemini</span>
            </h3>
            <p className="text-xs text-[#666672] mt-1">
              Tira-dúvidas de harmonia, exercícios estruturados com correção e recomendação didática.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B]">
            <span>Consultar Professor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tuner Pro Quick Access */}
        <div
          onClick={() => onNavigateTab('tuner')}
          className="bg-white border border-[#D9D9D9] hover:border-[#7B1E2B] p-5 rounded-2xl cursor-pointer transition shadow-xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] flex items-center justify-center text-[#7B1E2B] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6]">
              <Radio className="w-5 h-5 text-[#7B1E2B]" />
            </div>
            <h3 className="font-bold text-[#25252A] text-base group-hover:text-[#7B1E2B] transition-colors">
              Afinador Pro
            </h3>
            <p className="text-xs text-[#666672] mt-1">
              Afinação da guitarra física via microfone real e agulha suave a 60 FPS.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B]">
            <span>Afinar Guitarra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Metronome Quick Access */}
        <div
          onClick={() => onNavigateTab('metronome')}
          className="bg-white border border-[#D9D9D9] hover:border-[#7B1E2B] p-5 rounded-2xl cursor-pointer transition shadow-xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] flex items-center justify-center text-[#7B1E2B] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#25252A] text-base group-hover:text-[#7B1E2B] transition-colors">
              Metrônomo
            </h3>
            <p className="text-xs text-[#666672] mt-1">
              Treine tempo, subdivisões rítmicas e velocidade com o Speed Trainer.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B]">
            <span>Abrir Metrônomo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Chord Dictionary Quick Access */}
        <div
          onClick={() => onNavigateTab('chords')}
          className="bg-white border border-[#D9D9D9] hover:border-[#7B1E2B] p-5 rounded-2xl cursor-pointer transition shadow-xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] flex items-center justify-center text-[#7B1E2B] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6]">
              <Guitar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#25252A] text-base group-hover:text-[#7B1E2B] transition-colors">
              Dicionário de Acordes
            </h3>
            <p className="text-xs text-[#666672] mt-1">
              Consulte digitações, pestanas, power chords e ouça o áudio das cordas.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B]">
            <span>Consultar Acordes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Interactive Fretboard Quick Access */}
        <div
          onClick={() => onNavigateTab('fretboard')}
          className="bg-white border border-[#D9D9D9] hover:border-[#7B1E2B] p-5 rounded-2xl cursor-pointer transition shadow-xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] flex items-center justify-center text-[#7B1E2B] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6]">
              <Sparkles className="w-5 h-5 text-[#B52A3A]" />
            </div>
            <h3 className="font-bold text-[#25252A] text-base group-hover:text-[#7B1E2B] transition-colors">
              Braço Interativo
            </h3>
            <p className="text-xs text-[#666672] mt-1">
              Mapeie escalas Pentatônicas, Modos gregos e localize notas nas casas 0 a 22.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B]">
            <span>Explorar Braço</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Ear Training Quick Access */}
        <div
          onClick={() => onNavigateTab('ear-training')}
          className="bg-white border border-[#D9D9D9] hover:border-[#7B1E2B] p-5 rounded-2xl cursor-pointer transition shadow-xs group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] flex items-center justify-center text-[#7B1E2B] mb-3 group-hover:scale-105 transition-transform border border-[#E8D3D6]">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#25252A] text-base group-hover:text-[#7B1E2B] transition-colors">
              Treino Auditivo
            </h3>
            <p className="text-xs text-[#666672] mt-1">
              Eduque seus ouvidos para reconhecer intervalos e tirar músicas de ouvido.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7B1E2B]">
            <span>Iniciar Treino</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Recommended Exercise & Next Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommended Exercise Card */}
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
            <span className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#B52A3A]" />
              Exercício Recomendado para Hoje
            </span>
          </div>

          <div>
            <h3 className="font-bold text-[#25252A] text-lg">
              Coordenação & Digitação 1-2-3-4 Cromático
            </h3>
            <p className="text-xs text-[#666672] mt-1 leading-relaxed">
              Pratique o exercício de independência dos dedos nas 6 cordas da guitarra utilizando palhetada alternada estrita a 60 BPM durante 10 minutos.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('technique')}
              className="px-4 py-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-xs font-bold text-[#25252A] transition border border-[#D9D9D9]"
            >
              Ver Técnica & Tablatura
            </button>
            <button
              onClick={() => onNavigateTab('metronome')}
              className="px-4 py-2.5 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-xs font-bold text-white transition shadow-xs"
            >
              Abrir Metrônomo (60 BPM)
            </button>
          </div>
        </div>

        {/* Next Goals Card */}
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
            <span className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1.5 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#B52A3A]" />
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
                className="flex items-center gap-3 bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9] text-xs"
              >
                {goal.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-[#D9D9D9] shrink-0" />
                )}
                <span className={goal.done ? 'text-[#666672] line-through font-normal' : 'text-[#25252A] font-semibold'}>
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

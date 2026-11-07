import React, { useState } from 'react';
import { UserProgress, ManualPracticeLogEntry } from '../../types';
import { getPracticeMetrics, PracticeMetricsSummary } from '../../services/learningEngine';
import { storageService } from '../../services/storageService';
import {
  Clock,
  Flame,
  Target,
  Plus,
  Sliders,
  Award,
  TrendingUp,
  Guitar,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DailyGoalSettings } from './DailyGoalSettings';
import { ManualPracticeModal } from './ManualPracticeModal';

interface PracticeMetricsAndLogCardProps {
  progress: UserProgress;
  onUpdateProgress?: (updated: UserProgress) => void;
  onToastFeedback?: (msg: string) => void;
}

export const PracticeMetricsAndLogCard: React.FC<PracticeMetricsAndLogCardProps> = ({
  progress,
  onUpdateProgress,
  onToastFeedback,
}) => {
  const [isGoalSettingsOpen, setIsGoalSettingsOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const metrics: PracticeMetricsSummary = getPracticeMetrics(progress);
  const todayMinutes = Math.floor(metrics.todayStudyTimeSeconds / 60);
  const dailyGoalMinutes = metrics.dailyGoalMinutes;
  const goalPercentage = metrics.goalPercentage;
  const clampedPercentage = Math.min(100, Math.max(0, goalPercentage));
  const isGoalReached = metrics.isGoalReached;

  const manualMinutes = Math.floor(metrics.manualOfflineSeconds / 60);
  const interactiveMinutes = Math.floor(metrics.verifiedInteractiveSeconds / 60);

  // SVG Progress Ring calculations (Radius: 44px)
  const ringRadius = 44;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (clampedPercentage / 100) * ringCircumference;

  const goalPresets = [10, 15, 20, 30, 45, 60];

  const handleUpdateDailyGoal = (newGoalMinutes: number) => {
    const validGoal = Math.max(5, Math.min(240, Math.round(newGoalMinutes)));
    const updated: UserProgress = {
      ...progress,
      dailyGoalMinutes: validGoal,
      studyPlan: {
        ...progress.studyPlan,
        dailyRoutineMinutes: (validGoal <= 15 ? 10 : validGoal <= 25 ? 20 : 30) as 10 | 20 | 30,
      },
    };
    if (onUpdateProgress) {
      onUpdateProgress(updated);
    }
    storageService.saveProgress(updated);
    setIsGoalSettingsOpen(false);
    if (onToastFeedback) {
      onToastFeedback(`Meta diária definida para ${validGoal} minutos! 🎯`);
    }
  };

  const handleQuickAdd = (addMinutes: number) => {
    const localDate = storageService.getLocalDateString();
    const entry: ManualPracticeLogEntry = {
      id: `manual-log-${Date.now()}`,
      timestamp: Date.now(),
      date: localDate,
      dateStr: localDate,
      durationMinutes: addMinutes,
      instrument: 'violao_aco',
      activityType: 'acordes',
      relatedCourseId: progress.lastAccessedCourseId || 'violao',
      courseRelation: progress.lastAccessedCourseId || 'violao',
      perceivedDifficulty: 'confortavel',
      notes: 'Registro rápido de prática física',
      isManual: true,
    };
    const updated = storageService.recordManualPractice(entry);
    if (onUpdateProgress) {
      onUpdateProgress(updated);
    }
    if (onToastFeedback) {
      onToastFeedback(`+${addMinutes} min registrados na prática de hoje! 🎸`);
    }
  };

  const recentManualLogs = (progress.manualPracticeLogs || []).slice(-4).reverse();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#1A1216] border p-5 sm:p-7 shadow-xs transition-all ${
        isGoalReached
          ? 'border-[#10B981]/50 ring-1 ring-[#10B981]/20'
          : 'border-[#E8E6E1] dark:border-[#422933]'
      }`}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isGoalReached ? 'bg-[#10B981]' : 'tortoiseshell-badge'
        }`}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 pt-1">
        {/* Left Side: Circular Progress Ring & Summary */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 shrink-0 text-center sm:text-left w-full lg:w-auto">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="practiceRingGradientV2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7B1E2B" />
                  <stop offset="100%" stopColor="#B52A3A" />
                </linearGradient>
                <linearGradient id="goalSuccessRingGradientV2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                stroke={isGoalReached ? 'rgba(16, 185, 129, 0.15)' : 'currentColor'}
                className={isGoalReached ? '' : 'text-[#F0EBE9] dark:text-[#2E1B23]'}
                strokeWidth="9"
              />

              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                fill="none"
                stroke={isGoalReached ? 'url(#goalSuccessRingGradientV2)' : 'url(#practiceRingGradientV2)'}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>

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
                  <span className="text-xl sm:text-2xl font-black text-[#25252A] dark:text-[#F8F7F4] leading-none font-mono-code">
                    {goalPercentage}%
                  </span>
                  <span className="text-[10px] font-semibold text-[#666672] dark:text-[#B8B3C0] mt-0.5">
                    {todayMinutes}/{dailyGoalMinutes}m
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Goal Information & Differentiation */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] text-[10px] font-bold uppercase tracking-wider">
              <Target className="w-3 h-3 text-[#B52A3A]" />
              <span>Prática Real & Meta Diária</span>
            </div>

            <div className="flex items-baseline justify-center sm:justify-start gap-2">
              <strong className="text-2xl sm:text-3xl font-black text-[#25252A] dark:text-[#F8F7F4] tracking-tight">
                {todayMinutes} <span className="text-sm font-semibold text-[#666672]">min hoje</span>
              </strong>
              <span className="text-xs font-bold text-[#666672] dark:text-[#B8B3C0]">
                / meta de {dailyGoalMinutes} min
              </span>
            </div>

            {/* Differentiation pills: Offline Physical vs Verified Interactive */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <div className="px-2.5 py-1 rounded-xl bg-[#F8F7F4] dark:bg-[#22141A] border border-[#E8E6E1] dark:border-[#422933] text-[11px] flex items-center gap-1.5">
                <Guitar className="w-3.5 h-3.5 text-[#7B1E2B] dark:text-[#FF6B81]" />
                <span className="text-[#4D4D54] dark:text-[#B8B3C0]">Física Offline:</span>
                <strong className="text-[#25252A] dark:text-[#F8F7F4] font-mono-code">
                  {manualMinutes}m
                </strong>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-[#F8F7F4] dark:bg-[#22141A] border border-[#E8E6E1] dark:border-[#422933] text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#4D4D54] dark:text-[#B8B3C0]">Interativa Verificada:</span>
                <strong className="text-[#25252A] dark:text-[#F8F7F4] font-mono-code">
                  {interactiveMinutes}m
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Add, Presets & Manual Practice Modal Launcher */}
        <div className="w-full lg:max-w-md space-y-3.5">
          {/* Main Action: Register Manual Offline Practice */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="luxury-btn-primary flex items-center justify-center gap-2 px-5 py-3 rounded-2xl active:scale-95 font-bold text-xs sm:text-sm transition shadow-xs flex-1"
            >
              <Guitar className="w-4 h-4 ml-0.5" />
              <span>Registrar Prática Instrumental Real</span>
            </button>

            <button
              onClick={() => setIsGoalSettingsOpen(true)}
              className="px-3.5 py-3 rounded-2xl bg-[#F8F7F4] hover:bg-[#F2F2F2] dark:bg-[#22141A] text-[#25252A] dark:text-[#F8F7F4] border border-[#E8E6E1] dark:border-[#422933] font-bold text-xs flex items-center justify-center gap-1.5 transition"
              title="Ajustar Meta Diária"
            >
              <Sliders className="w-3.5 h-3.5 text-[#7B1E2B] dark:text-[#FF6B81]" />
              <span className="hidden sm:inline">Meta</span>
            </button>
          </div>

          {/* Quick Add row */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F2F2F2] dark:border-[#422933]">
            <span className="text-[#666672] dark:text-[#B8B3C0]">Adicionar prática rápida:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleQuickAdd(5)}
                className="px-2.5 py-1 rounded-lg bg-[#F8F7F4] hover:bg-[#F5E8EA] dark:bg-[#22141A] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8E6E1] dark:border-[#422933] font-bold text-[11px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>5m</span>
              </button>
              <button
                onClick={() => handleQuickAdd(15)}
                className="px-2.5 py-1 rounded-lg bg-[#F8F7F4] hover:bg-[#F5E8EA] dark:bg-[#22141A] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8E6E1] dark:border-[#422933] font-bold text-[11px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>15m</span>
              </button>
              <button
                onClick={() => handleQuickAdd(30)}
                className="px-2.5 py-1 rounded-lg bg-[#F8F7F4] hover:bg-[#F5E8EA] dark:bg-[#22141A] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8E6E1] dark:border-[#422933] font-bold text-[11px] flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>30m</span>
              </button>
            </div>
          </div>

          {/* Recent manual logs summary */}
          {recentManualLogs.length > 0 && (
            <div className="pt-2 border-t border-[#F2F2F2] dark:border-[#422933] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#8C8C9A] tracking-wider block">
                Últimos Treinos Físicos Registrados:
              </span>
              <div className="space-y-1">
                {recentManualLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-xl bg-[#F8F7F4] dark:bg-[#22141A] border border-[#E8E6E1] dark:border-[#422933] flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#25252A] dark:text-[#F8F7F4]">
                        {log.durationMinutes}m no{' '}
                        {log.instrument === 'violao_aco'
                          ? 'Violão Aço'
                          : log.instrument === 'violao_nylon'
                          ? 'Violão Nylon'
                          : log.instrument === 'guitarra'
                          ? 'Guitarra'
                          : 'Instrumento'}
                      </span>
                      <span className="text-[#8C8C9A]">({log.activityType})</span>
                    </div>
                    <span className="text-[10px] text-[#8C8C9A] font-mono-code">{log.dateStr || log.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isGoalSettingsOpen && (
        <DailyGoalSettings
          currentGoalMinutes={dailyGoalMinutes}
          onSaveGoal={(newMins) => handleUpdateDailyGoal(newMins)}
          onClose={() => setIsGoalSettingsOpen(false)}
          variant="modal"
        />
      )}

      {isManualModalOpen && (
        <ManualPracticeModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          progress={progress}
          onSave={(updated) => {
            if (onUpdateProgress) {
              onUpdateProgress(updated);
            }
            if (onToastFeedback) {
              onToastFeedback('Sessão instrumental física salva com sucesso! 🎸');
            }
          }}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { UserProgress, NavigationTab } from '../../types';
import { generateDailyPracticePlan, DailyPracticePlanStep } from '../../services/learningEngine';
import { storageService } from '../../services/storageService';
import { Clock, Play, Flame, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';
import { PraticarIcon } from '../common/GuitarIcons';

interface DailyPracticePlanCardProps {
  progress: UserProgress;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenMetronomeAtBpm?: (bpm: number) => void;
}

export const DailyPracticePlanCard: React.FC<DailyPracticePlanCardProps> = ({
  progress,
  onNavigateTab,
  onOpenMetronomeAtBpm,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<10 | 15 | 20 | 30 | 45 | 60>(
    (progress.studyPlan?.dailyRoutineMinutes as 10 | 15 | 20 | 30 | 45 | 60) || 20
  );
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const plan = generateDailyPracticePlan(selectedDuration, progress);

  const durationOptions: (10 | 15 | 20 | 30 | 45 | 60)[] = [10, 15, 20, 30, 45, 60];

  const handleLaunchMetronome = (bpm: number) => {
    if (onOpenMetronomeAtBpm) {
      onOpenMetronomeAtBpm(bpm);
    } else {
      const cfg = storageService.loadMetronome();
      cfg.bpm = bpm;
      storageService.saveMetronome(cfg);
      onNavigateTab('metronome');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] p-5 sm:p-7 shadow-xs space-y-5">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F2F2F2] dark:border-[#422933]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81]">
            <Target className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Plano Inteligente de Prática</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#25252A] dark:text-[#F8F7F4] tracking-tight">
            Sessão Estruturada de Hoje ({selectedDuration} minutos)
          </h3>
          <p className="text-xs text-[#666672] dark:text-[#B8B3C0]">
            5 etapas progressivas desenhadas para o seu nível atual, prevenindo lesões e maximizando a retenção motora.
          </p>
        </div>

        {/* Duration Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-[#4D4D54] dark:text-[#B8B3C0] mr-1 hidden sm:inline">
            Duração:
          </span>
          {durationOptions.map((dur) => (
            <button
              key={dur}
              onClick={() => setSelectedDuration(dur)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedDuration === dur
                  ? 'bg-[#7B1E2B] dark:bg-[#FF6B81] text-white dark:text-[#180A0E] border-[#7B1E2B] dark:border-[#FF6B81] shadow-2xs'
                  : 'bg-[#F8F7F4] dark:bg-[#22141A] text-[#4D4D54] dark:text-[#B8B3C0] border-[#E8E6E1] dark:border-[#422933] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] hover:text-[#7B1E2B]'
              }`}
            >
              {dur}m
            </button>
          ))}
        </div>
      </div>

      {/* 5-Phase Steps List */}
      <div className="space-y-2.5">
        {plan.steps.map((step) => {
          const isExpanded = expandedStep === step.stepNumber;
          return (
            <div
              key={step.stepNumber}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-[#FAF7F5] dark:bg-[#20151B] border-[#7B1E2B]/40 dark:border-[#FF6B81]/40 shadow-xs'
                  : 'bg-[#F8F7F4] dark:bg-[#22141A] border-[#E8E6E1] dark:border-[#422933] hover:border-[#7B1E2B]/30'
              }`}
            >
              {/* Step Header / Toggle Button */}
              <div
                onClick={() => setExpandedStep(isExpanded ? null : step.stepNumber)}
                className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-mono-code font-black text-xs shrink-0 ${
                      isExpanded
                        ? 'bg-[#7B1E2B] text-white'
                        : 'bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] text-[#7B1E2B] dark:text-[#FF6B81]'
                    }`}
                  >
                    {step.stepNumber}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#7B1E2B] dark:text-[#FF6B81]">
                        {step.phase}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-bold font-mono-code">
                        {step.durationMinutes} min
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold font-mono-code">
                        {step.bpm} BPM
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[#25252A] dark:text-[#F8F7F4] truncate">
                      {step.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-[#666672] dark:text-[#B8B3C0] hidden md:inline">
                    {isExpanded ? 'Ocultar detalhes' : 'Ver tablatura & biomecânica'}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81] transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Step Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-black/5 dark:border-white/5">
                  <p className="text-xs text-[#4D4D54] dark:text-[#B8B3C0] leading-relaxed">
                    {step.description}
                  </p>

                  {/* Biomechanics Instructions */}
                  {step.instructions && step.instructions.length > 0 && (
                    <div className="p-3 rounded-xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] space-y-1">
                      <span className="text-[10px] font-bold text-[#7B1E2B] dark:text-[#FF6B81] uppercase tracking-wider block">
                        Instrução Biomecânica:
                      </span>
                      {step.instructions.map((inst, i) => (
                        <p key={i} className="text-xs text-[#4D4D54] dark:text-[#B8B3C0]">
                          • {inst}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Tablature Snippet */}
                  {step.tablatureSnippet && (
                    <div className="p-3 rounded-xl bg-[#1F191D] text-amber-300 font-mono-code text-[11px] overflow-x-auto shadow-2xs">
                      <pre className="whitespace-pre leading-relaxed">{step.tablatureSnippet}</pre>
                    </div>
                  )}

                  {/* Action row for this step */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => handleLaunchMetronome(step.bpm || 60)}
                      className="px-3.5 py-2 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Abrir Metrônomo a {step.bpm || 60} BPM</span>
                    </button>

                    <button
                      onClick={() => onNavigateTab('practice-routine')}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#25252A] dark:text-[#F8F7F4] border border-[#E8E6E1] dark:border-[#422933] text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <PraticarIcon className="w-3.5 h-3.5 text-[#7B1E2B] dark:text-[#FF6B81]" />
                      <span>Executar na Central de Prática</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <span className="text-xs text-[#666672] dark:text-[#B8B3C0]">
          Total estimado da sessão: <strong className="text-[#25252A] dark:text-[#F8F7F4]">{plan.totalMinutes} minutos</strong> de prática ativa.
        </span>

        <button
          onClick={() => onNavigateTab('practice-routine')}
          className="luxury-btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-2xl active:scale-95 font-bold text-xs sm:text-sm transition shadow-xs w-full sm:w-auto"
        >
          <PraticarIcon className="w-4 h-4" />
          <span>Iniciar Sessão Guiada Completa</span>
        </button>
      </div>
    </div>
  );
};

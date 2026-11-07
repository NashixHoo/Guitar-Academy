import React, { useState } from 'react';
import { UserProgress, NavigationTab } from '../../types';
import {
  getSkillEvolutionMap,
  DOMAIN_AREAS_METADATA,
  SkillEvolutionSummary,
  DomainArea,
} from '../../services/learningEngine';
import {
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';

interface SkillDomainMapCardProps {
  progress: UserProgress;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectLesson?: (lessonId: string) => void;
}

export const SkillDomainMapCard: React.FC<SkillDomainMapCardProps> = ({
  progress,
  onNavigateTab,
  onSelectLesson,
}) => {
  const evolution: SkillEvolutionSummary = getSkillEvolutionMap(progress);
  const [selectedArea, setSelectedArea] = useState<DomainArea | null>(null);

  const getStatusBadge = (statusLabel: string) => {
    switch (statusLabel) {
      case 'Dominado':
        return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
      case 'Proficiente':
        return 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30';
      case 'Em Treinamento':
        return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
      case 'Ainda não avaliado':
      default:
        return 'bg-black/5 dark:bg-white/10 text-[#666672] dark:text-[#888892] border-transparent';
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
            <Award className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Mapa de Domínio Musical</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#25252A] dark:text-[#F8F7F4] tracking-tight">
            12 Dimensões de Técnica e Harmonia Instrumental
          </h3>
          <p className="text-xs text-[#666672] dark:text-[#B8B3C0]">
            Avaliação rigorosa baseada em execuções e exercícios práticos reais. Habilidades sem registro prático permanecem honestamente como "Ainda não avaliado".
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-[#F8F7F4] dark:bg-[#22141A] border border-[#E8E6E1] dark:border-[#422933] text-right">
            <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] uppercase font-bold tracking-wider block">
              Avaliadas Realmente
            </span>
            <span className="text-sm font-black text-[#25252A] dark:text-[#F8F7F4] font-mono-code">
              {evolution.evaluatedSkillsCount} / {evolution.totalSkillsCount} habilidades
            </span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-[#F5E8EA] dark:bg-[#381A25] border border-[#7B1E2B]/20 text-right">
            <span className="text-[10px] text-[#7B1E2B] dark:text-[#FF6B81] uppercase font-bold tracking-wider block">
              Domínio Geral
            </span>
            <span className="text-sm font-black text-[#7B1E2B] dark:text-[#FF6B81] font-mono-code">
              {evolution.overallEvaluatedScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 12 Domain Areas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {evolution.domains.map((domain) => {
          const isSelected = selectedArea === domain.area;
          const isEvaluated = domain.evaluatedCount > 0;

          return (
            <div
              key={domain.area}
              onClick={() => setSelectedArea(isSelected ? null : domain.area)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FAF4E6] dark:bg-[#2A2016] border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]/30'
                  : 'bg-[#F8F7F4] dark:bg-[#22141A] border-[#E8E6E1] dark:border-[#422933] hover:border-[#7B1E2B]/40 hover:bg-[#FAF1F2] dark:hover:bg-[#2E1822]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#25252A] dark:text-[#F8F7F4]">
                    {domain.title}
                  </h4>
                  <p className="text-[11px] text-[#666672] dark:text-[#B8B3C0] mt-0.5 line-clamp-1">
                    {domain.description}
                  </p>
                </div>

                <ChevronRight
                  className={`w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81] shrink-0 transition-transform ${
                    isSelected ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {/* Status Bar */}
              <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-[#8C8C9A]">
                  {domain.evaluatedCount}/{domain.skills.length} avaliadas
                </span>

                {isEvaluated && domain.averageScore !== null ? (
                  <span className="font-bold text-[#7B1E2B] dark:text-[#FF6B81] font-mono-code">
                    {domain.averageScore}% domínio
                  </span>
                ) : (
                  <span className="font-medium text-[#8C8C9A] italic">
                    Ainda não avaliado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Domain Drilldown Drawer / Details */}
      {selectedArea && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F5] dark:bg-[#20151B] border border-[#7B1E2B]/30 space-y-3">
          {(() => {
            const domain = evolution.domains.find((d) => d.area === selectedArea);
            if (!domain) return null;

            return (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/5 dark:border-white/5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7B1E2B] dark:text-[#FF6B81]">
                      Detalhamento Técnico
                    </span>
                    <h4 className="text-base font-black text-[#25252A] dark:text-[#F8F7F4]">
                      {domain.title}
                    </h4>
                  </div>
                  <span className="text-xs text-[#666672] dark:text-[#B8B3C0]">
                    {domain.description}
                  </span>
                </div>

                <div className="space-y-2">
                  {domain.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 rounded-xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-[#25252A] dark:text-[#F8F7F4]">
                            {skill.name}
                          </strong>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              skill.statusLabel
                            )}`}
                          >
                            {skill.statusLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666672] dark:text-[#B8B3C0]">
                          {skill.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {skill.isEvaluated ? (
                          <div className="text-right">
                            <span className="text-[10px] text-[#8C8C9A] block">
                              {skill.attemptsCount} treinos ({skill.accuracyPercent}% precisão)
                            </span>
                            <span className="font-bold text-[#7B1E2B] dark:text-[#FF6B81] font-mono-code">
                              {skill.masteryScore}% domínio
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8C8C9A] italic">
                            Sem tentativas registradas
                          </span>
                        )}

                        <button
                          onClick={() => {
                            if (skill.targetTab) {
                              onNavigateTab(skill.targetTab);
                            } else {
                              onNavigateTab('practice-routine');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#F8F7F4] hover:bg-[#F5E8EA] dark:bg-[#22141A] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8E6E1] dark:border-[#422933] font-bold text-[11px] transition shrink-0"
                        >
                          Treinar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

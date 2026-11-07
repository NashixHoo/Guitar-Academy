import React from 'react';
import { UserProgress, NavigationTab } from '../../types';
import { getContextualRecommendations, ContextualRecommendation } from '../../services/learningEngine';
import { Sparkles, ArrowRight, Play, RotateCcw, Zap, Target, BookOpen } from 'lucide-react';

interface ContextualRecommendationsCardProps {
  progress: UserProgress;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const ContextualRecommendationsCard: React.FC<ContextualRecommendationsCardProps> = ({
  progress,
  onNavigateTab,
  onSelectLesson,
}) => {
  const recommendations: ContextualRecommendation[] = getContextualRecommendations(progress);

  if (recommendations.length === 0) return null;

  const getTypeIcon = (type: ContextualRecommendation['type']) => {
    switch (type) {
      case 'continuity':
        return <BookOpen className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />;
      case 'spaced_review':
        return <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'drill':
        return <Zap className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />;
      case 'foundation':
      default:
        return <Target className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />;
    }
  };

  const getTypeBadge = (type: ContextualRecommendation['type']) => {
    switch (type) {
      case 'continuity':
        return 'bg-[#F5E8EA] text-[#7B1E2B] dark:bg-[#381A25] dark:text-[#FF6B81]';
      case 'spaced_review':
        return 'bg-amber-500/15 text-amber-800 dark:text-amber-300';
      case 'drill':
        return 'bg-rose-500/15 text-rose-800 dark:text-rose-300';
      case 'foundation':
      default:
        return 'bg-blue-500/15 text-blue-800 dark:text-blue-300';
    }
  };

  const getTypeLabel = (type: ContextualRecommendation['type']) => {
    switch (type) {
      case 'continuity':
        return 'Continuidade Pedagógica';
      case 'spaced_review':
        return 'Revisão Espaçada';
      case 'drill':
        return 'Treino Motor Físico';
      case 'foundation':
      default:
        return 'Habilidade Fundamental';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] p-5 sm:p-7 shadow-xs space-y-4">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F2] dark:border-[#422933]">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7B1E2B] dark:text-[#FF6B81]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recomendações Contextuais Baseadas em Evidências</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#25252A] dark:text-[#F8F7F4] tracking-tight">
            Próximos Passos Prioritários
          </h3>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-[#22141A] border border-[#E8E6E1] dark:border-[#422933] flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTypeBadge(
                    rec.type
                  )}`}
                >
                  {getTypeIcon(rec.type)}
                  <span>{getTypeLabel(rec.type)}</span>
                </span>

                <span className="text-[10px] text-[#8C8C9A] font-mono-code font-bold">
                  ⏱️ {rec.suggestedMinutes} min
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#25252A] dark:text-[#F8F7F4] leading-snug">
                  {rec.title}
                </h4>
                <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-0.5">
                  {rec.subtitle}
                </p>
              </div>

              <p className="text-xs text-[#4D4D54] dark:text-[#B8B3C0] leading-relaxed">
                {rec.rationale}
              </p>
            </div>

            <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <button
                onClick={() => {
                  if (rec.targetLessonId) {
                    onSelectLesson(rec.targetLessonId);
                  } else if (rec.targetTab) {
                    onNavigateTab(rec.targetTab);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Praticar Agora</span>
              </button>

              <span className="text-[10px] text-[#8C8C9A]">
                Prioridade #{rec.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

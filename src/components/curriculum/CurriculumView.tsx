import React, { useState } from 'react';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { UserProgress } from '../../types';
import { GraduationCap, CheckCircle2, ChevronRight, Clock, Award, AlertCircle, ShieldCheck } from 'lucide-react';
import { LESSON_TO_SKILL_MAP, createInitialPedagogicalProfile } from '../../pedagogy/adaptiveEngine';

interface CurriculumViewProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ progress, onSelectLesson }) => {
  const [activeLevelIndex, setActiveLevelIndex] = useState<number>(0);

  const activeLevel = CURRICULUM_LEVELS[activeLevelIndex] || CURRICULUM_LEVELS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-4 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#25252A]">Minha Formação Musical</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Trilha pedagógica completa em 6 níveis progressivos: do absoluto zero à maestria na guitarra.
          </p>
        </div>
      </div>

      {/* 6 Levels Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {CURRICULUM_LEVELS.map((lvl) => {
          const isSelected = activeLevelIndex === lvl.level;
          const completedInLvl = lvl.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
          const isAllCompleted = completedInLvl === lvl.lessons.length && lvl.lessons.length > 0;

          return (
            <button
              key={lvl.level}
              onClick={() => setActiveLevelIndex(lvl.level)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs scale-[1.02]'
                  : 'bg-white border-[#D9D9D9] hover:bg-[#F5E8EA]'
              }`}
            >
              <div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                  isSelected ? 'text-[#F5E8EA]' : 'text-[#7B1E2B]'
                }`}>
                  Nível {lvl.level}
                </span>
                <span className={`text-xs font-bold line-clamp-1 mt-0.5 ${isSelected ? 'text-white' : 'text-[#25252A]'}`}>
                  {lvl.badge}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span className={isSelected ? 'text-[#F5E8EA]' : 'text-[#666672]'}>
                  {lvl.lessons.length} aulas
                </span>
                {isAllCompleted ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                ) : (
                  <span className={`font-mono-code font-bold ${isSelected ? 'text-white' : 'text-[#25252A]'}`}>
                    {completedInLvl}/{lvl.lessons.length}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Level Overview */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-4 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-[#D9D9D9]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#7B1E2B] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#B52A3A]" />
            <span>Currículo Pedagógico</span>
          </div>
          <h2 className="text-2xl font-black text-[#25252A] mt-1">{activeLevel.name}</h2>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">{activeLevel.subtitle}</p>
          <p className="text-xs text-[#25252A] mt-2 bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9] leading-relaxed">
            {activeLevel.description}
          </p>
        </div>

        {/* Lessons List in this Level */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
            Módulos & Aulas deste Nível:
          </label>

          {activeLevel.lessons.map((lesson) => {
            const isCompleted = progress.completedLessons.includes(lesson.id);
            const isCurrent = progress.currentLessonId === lesson.id;

            // Memória Pedagógica: Checagem de Pré-Requisitos (Fase 3, Item 4)
            const profile = progress.pedagogicalProfile || createInitialPedagogicalProfile();
            const skillId = LESSON_TO_SKILL_MAP[lesson.id];
            const skill = skillId ? profile.skills[skillId] : null;
            const prereqSkills = (skill?.prerequisites || [])
              .map((pId) => profile.skills[pId])
              .filter(Boolean);
            const pendingPrereqs = prereqSkills.filter((p) => p.masteryScore < 60);
            const hasPrereqs = prereqSkills.length > 0;

            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#F5E8EA] border-[#7B1E2B] shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                    : 'bg-[#F8F7F4] border-[#D9D9D9] hover:bg-[#F5E8EA] hover:border-[#E8D3D6]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="mt-0.5 sm:mt-0 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#D9D9D9] flex items-center justify-center font-bold text-[10px] text-[#666672] bg-white">
                        {lesson.lessonNumber}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-[#666672] uppercase font-bold block">
                        {lesson.moduleTitle}
                      </span>
                      {lesson.practicalExercise && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#7B1E2B] bg-[#F5E8EA] px-2 py-0.2 rounded-md border border-[#E8D3D6]">
                          Ex. Prático ({lesson.practicalExercise.targetBpm} BPM)
                        </span>
                      )}

                      {/* Pré-requisitos Pedagógicos */}
                      {hasPrereqs && pendingPrereqs.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200" title={`Recomendado dominar: ${pendingPrereqs.map(p => p.name).join(', ')}`}>
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Pré-requisito pendente ({pendingPrereqs[0].name.split(' ')[0]}...)</span>
                        </span>
                      )}

                      {hasPrereqs && pendingPrereqs.length === 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Pré-requisitos dominados</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-[#25252A] text-sm sm:text-base group-hover:text-[#7B1E2B]">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-[#666672] line-clamp-1">{lesson.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D9D9D9]">
                  <div className="flex items-center gap-1.5 text-xs text-[#666672] font-mono-code font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.estimatedMinutes} min</span>
                  </div>

                  <button className="flex items-center gap-1 text-xs font-bold text-[#7B1E2B] hover:text-[#B52A3A] px-3.5 py-1.5 rounded-xl bg-white border border-[#D9D9D9] transition shadow-xs">
                    <span>{isCompleted ? 'Revisar' : 'Estudar'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

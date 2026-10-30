import React, { useState } from 'react';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { SOLO_COURSE_STAGES, SOLO_LESSONS } from '../../data/soloCourse';
import { UserProgress, SoloLesson } from '../../types';
import { 
  GraduationCap, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Award, 
  AlertCircle, 
  ShieldCheck, 
  Guitar, 
  Zap, 
  Activity, 
  Target, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { LESSON_TO_SKILL_MAP, createInitialPedagogicalProfile } from '../../pedagogy/adaptiveEngine';

interface CurriculumViewProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ progress, onSelectLesson }) => {
  // Track selector: 'solo' (Formação Guitarra Solo - 20 Aulas) vs 'conservatory' (Conservatório Geral - 18 Aulas)
  const [activeTrack, setActiveTrack] = useState<'solo' | 'conservatory'>('solo');
  const [activeSoloStage, setActiveSoloStage] = useState<number>(1);
  const [activeLevelIndex, setActiveLevelIndex] = useState<number>(0);

  const activeLevel = CURRICULUM_LEVELS[activeLevelIndex] || CURRICULUM_LEVELS[0];
  const activeStage = SOLO_COURSE_STAGES.find((s) => s.stageNumber === activeSoloStage) || SOLO_COURSE_STAGES[0];

  // Métricas do Curso de Solo
  const soloLessonsCompleted = SOLO_LESSONS.filter((l) => progress.completedLessons.includes(l.id)).length;
  const soloProgressPercent = Math.round((soloLessonsCompleted / SOLO_LESSONS.length) * 100);

  // Status pedagógico de uma aula solo (3 estados: Aprendendo, Consolidando, Dominado)
  const getSoloLessonStatus = (lesson: SoloLesson) => {
    const isCompleted = progress.completedLessons.includes(lesson.id);
    const log = progress.practiceLogs?.[lesson.id];
    
    if (isCompleted || log?.confidence === 'mastered_with_metronome' || log?.status === 'mastered') {
      return {
        label: 'Dominado',
        state: 'mastered' as const,
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50',
        desc: 'Execução limpa no andamento alvo com metrônomo'
      };
    }
    if (log?.status === 'practicing' || log?.confidence === 'playable_slow' || (progress.exerciseRepetitions?.[lesson.id] || 0) > 0) {
      return {
        label: 'Consolidando',
        state: 'consolidating' as const,
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/50',
        desc: 'Em treino motor no andamento intermediário'
      };
    }
    return {
      label: 'Aprendendo',
      state: 'learning' as const,
      badgeClass: 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9] dark:bg-[#1A1A20] dark:text-[#B8B3C0] dark:border-[#33333E]',
      desc: 'Compreensão de dedilhado, palhetada e formato'
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-12">
      {/* Header com Seletor de Trilha */}
      <div className="bg-white dark:bg-[#25252A] border border-[#D9D9D9] dark:border-[#33333E] rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Guitar className="w-5 h-5 text-[#7B1E2B] dark:text-[#FF6B81]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#25252A] dark:text-[#F8F7F4]">
              Currículo Pedagógico
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1 font-medium">
            Formação musical estruturada para guitarra física com estudo guiado, tablaturas e metrônomo.
          </p>
        </div>

        {/* Alternador de Trilhas */}
        <div className="flex items-center bg-[#F8F7F4] dark:bg-[#1A1A20] p-1 rounded-2xl border border-[#D9D9D9] dark:border-[#33333E] self-start md:self-auto">
          <button
            onClick={() => setActiveTrack('solo')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTrack === 'solo'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] dark:text-[#B8B3C0] hover:text-[#25252A] dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Guitarra Solo (20 Aulas)</span>
          </button>
          <button
            onClick={() => setActiveTrack('conservatory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTrack === 'conservatory'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] dark:text-[#B8B3C0] hover:text-[#25252A] dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Conservatório (18 Aulas)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TRILHA 1: FORMAÇÃO PROGRESSIVA EM GUITARRA SOLO (20 AULAS) */}
      {/* ======================================================== */}
      {activeTrack === 'solo' && (
        <>
          {/* Barra de Progresso do Curso Solo */}
          <div className="bg-[#F8F7F4] dark:bg-[#1A1A20] border border-[#D9D9D9] dark:border-[#33333E] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
              <span className="text-xs font-extrabold text-[#25252A] dark:text-[#F8F7F4]">
                Evolução no Curso de Guitarra Solo:
              </span>
              <span className="text-xs font-mono-code font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
                {soloLessonsCompleted} de 20 aulas concluídas ({soloProgressPercent}%)
              </span>
            </div>
            <div className="w-full sm:w-48 bg-white dark:bg-[#25252A] h-2.5 rounded-full overflow-hidden border border-[#D9D9D9] dark:border-[#33333E]">
              <div 
                className="bg-[#7B1E2B] dark:bg-[#FF6B81] h-full transition-all duration-300" 
                style={{ width: `${soloProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Seletor de 5 Etapas do Curso de Solo */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {SOLO_COURSE_STAGES.map((stg) => {
              const isSelected = activeSoloStage === stg.stageNumber;
              const completedInStage = stg.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
              const isAllCompleted = completedInStage === stg.lessons.length;

              return (
                <button
                  key={stg.id}
                  onClick={() => setActiveSoloStage(stg.stageNumber)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs scale-[1.02]'
                      : 'bg-white dark:bg-[#25252A] border-[#D9D9D9] dark:border-[#33333E] hover:bg-[#F5E8EA] dark:hover:bg-[#2E2E36]'
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                      isSelected ? 'text-[#F5E8EA]' : 'text-[#7B1E2B] dark:text-[#FF6B81]'
                    }`}>
                      Etapa {stg.stageNumber}
                    </span>
                    <span className={`text-xs font-bold line-clamp-1 mt-0.5 ${isSelected ? 'text-white' : 'text-[#25252A] dark:text-[#F8F7F4]'}`}>
                      {stg.badge}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px]">
                    <span className={isSelected ? 'text-[#F5E8EA]' : 'text-[#666672] dark:text-[#B8B3C0]'}>
                      {stg.lessons.length} aulas
                    </span>
                    {isAllCompleted ? (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                    ) : (
                      <span className={`font-mono-code font-bold ${isSelected ? 'text-white' : 'text-[#25252A] dark:text-[#F8F7F4]'}`}>
                        {completedInStage}/{stg.lessons.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visão da Etapa Selecionada */}
          <div className="bg-white dark:bg-[#25252A] border border-[#D9D9D9] dark:border-[#33333E] rounded-3xl p-4 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-[#D9D9D9] dark:border-[#33333E]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] uppercase tracking-wider">
                <Target className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
                <span>Formação Progressiva em Guitarra Solo • Etapa {activeStage.stageNumber}</span>
              </div>
              <h2 className="text-2xl font-black text-[#25252A] dark:text-[#F8F7F4] mt-1">
                {activeStage.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1 font-medium">
                {activeStage.subtitle}
              </p>
              <p className="text-xs text-[#25252A] dark:text-[#E0DDE5] mt-2 bg-[#F8F7F4] dark:bg-[#1A1A20] p-3 rounded-xl border border-[#D9D9D9] dark:border-[#33333E] leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            {/* Lista das 4 Aulas da Etapa */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] uppercase tracking-wider block">
                Aulas desta Etapa:
              </label>

              {activeStage.lessons.map((lesson) => {
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const isCurrent = progress.currentLessonId === lesson.id;
                const status = getSoloLessonStatus(lesson);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-[#F5E8EA] dark:bg-[#3A1E24] border-[#7B1E2B] dark:border-[#FF6B81] shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400'
                        : 'bg-[#F8F7F4] dark:bg-[#1F1F24] border-[#D9D9D9] dark:border-[#33333E] hover:bg-[#F5E8EA] dark:hover:bg-[#2A2328]'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="mt-0.5 sm:mt-0 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-[#D9D9D9] dark:border-[#4D4D58] flex items-center justify-center font-bold text-[11px] text-[#666672] dark:text-[#B8B3C0] bg-white dark:bg-[#25252A]">
                            {lesson.lessonNumber}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] uppercase font-bold block">
                            Aula {lesson.lessonNumber} • {lesson.moduleTitle}
                          </span>

                          {/* 3 Estados Pedagógicos: Aprendendo / Consolidando / Dominado */}
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${status.badgeClass}`}>
                            <Activity className="w-3 h-3" />
                            <span>{status.label}</span>
                          </span>

                          {/* Metrônomo Alvo */}
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono-code font-bold text-[#7B1E2B] dark:text-[#FF6B81] bg-[#F5E8EA] dark:bg-[#3A1E24] px-2 py-0.5 rounded-md border border-[#E8D3D6] dark:border-[#4D2830]">
                            {lesson.speedGoals.startingBpm} → {lesson.speedGoals.targetBpm} BPM
                          </span>
                        </div>

                        <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-sm sm:text-base">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-[#666672] dark:text-[#B8B3C0] line-clamp-1">
                          {lesson.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D9D9D9] dark:border-[#33333E]">
                      <div className="flex items-center gap-1.5 text-xs text-[#666672] dark:text-[#B8B3C0] font-mono-code font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lesson.estimatedMinutes} min</span>
                      </div>

                      <button className="flex items-center gap-1 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] hover:text-[#B52A3A] px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#25252A] border border-[#D9D9D9] dark:border-[#33333E] transition shadow-xs">
                        <span>{isCompleted ? 'Revisar' : 'Estudar'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* TRILHA 2: CONSERVATÓRIO GERAL (18 AULAS EM 6 NÍVEIS)    */}
      {/* ======================================================== */}
      {activeTrack === 'conservatory' && (
        <>
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
                      : 'bg-white dark:bg-[#25252A] border-[#D9D9D9] dark:border-[#33333E] hover:bg-[#F5E8EA] dark:hover:bg-[#2E2E36]'
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                      isSelected ? 'text-[#F5E8EA]' : 'text-[#7B1E2B] dark:text-[#FF6B81]'
                    }`}>
                      Nível {lvl.level}
                    </span>
                    <span className={`text-xs font-bold line-clamp-1 mt-0.5 ${isSelected ? 'text-white' : 'text-[#25252A] dark:text-[#F8F7F4]'}`}>
                      {lvl.badge}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px]">
                    <span className={isSelected ? 'text-[#F5E8EA]' : 'text-[#666672] dark:text-[#B8B3C0]'}>
                      {lvl.lessons.length} aulas
                    </span>
                    {isAllCompleted ? (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                    ) : (
                      <span className={`font-mono-code font-bold ${isSelected ? 'text-white' : 'text-[#25252A] dark:text-[#F8F7F4]'}`}>
                        {completedInLvl}/{lvl.lessons.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Level Overview */}
          <div className="bg-white dark:bg-[#25252A] border border-[#D9D9D9] dark:border-[#33333E] rounded-3xl p-4 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-[#D9D9D9] dark:border-[#33333E]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
                <span>Currículo Pedagógico Conservatório</span>
              </div>
              <h2 className="text-2xl font-black text-[#25252A] dark:text-[#F8F7F4] mt-1">{activeLevel.name}</h2>
              <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1 font-medium">{activeLevel.subtitle}</p>
              <p className="text-xs text-[#25252A] dark:text-[#E0DDE5] mt-2 bg-[#F8F7F4] dark:bg-[#1A1A20] p-3 rounded-xl border border-[#D9D9D9] dark:border-[#33333E] leading-relaxed">
                {activeLevel.description}
              </p>
            </div>

            {/* Lessons List in this Level */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] uppercase tracking-wider block">
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
                        ? 'bg-[#F5E8EA] dark:bg-[#3A1E24] border-[#7B1E2B] dark:border-[#FF6B81] shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400'
                        : 'bg-[#F8F7F4] dark:bg-[#1F1F24] border-[#D9D9D9] dark:border-[#33333E] hover:bg-[#F5E8EA] dark:hover:bg-[#2A2328]'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="mt-0.5 sm:mt-0 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-[#D9D9D9] dark:border-[#4D4D58] flex items-center justify-center font-bold text-[10px] text-[#666672] dark:text-[#B8B3C0] bg-white dark:bg-[#25252A]">
                            {lesson.lessonNumber}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] uppercase font-bold block">
                            {lesson.moduleTitle}
                          </span>
                          {lesson.practicalExercise && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#7B1E2B] dark:text-[#FF6B81] bg-[#F5E8EA] dark:bg-[#3A1E24] px-2 py-0.2 rounded-md border border-[#E8D3D6] dark:border-[#4D2830]">
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
                        <h3 className="font-bold text-[#25252A] dark:text-[#F8F7F4] text-sm sm:text-base">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-[#4D4D54] dark:text-[#B8B3C0] line-clamp-1">{lesson.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D9D9D9] dark:border-[#33333E]">
                      <div className="flex items-center gap-1.5 text-xs text-[#666672] dark:text-[#B8B3C0] font-mono-code font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lesson.estimatedMinutes} min</span>
                      </div>

                      <button className="flex items-center gap-1 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] hover:text-[#B52A3A] px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#25252A] border border-[#D9D9D9] dark:border-[#33333E] transition shadow-xs">
                        <span>{isCompleted ? 'Revisar' : 'Estudar'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

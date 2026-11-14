import React, { useState } from 'react';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { SOLO_COURSE_STAGES, SOLO_LESSONS } from '../../data/soloCourse';
import { VIOLAO_MODULES, VIOLAO_LESSONS } from '../../data/violaoCourse';
import { BASS_COURSE_LEVELS, BASS_LESSONS } from '../../data/bassCourse';
import { KEYBOARD_COURSE_LEVELS, KEYBOARD_LESSONS } from '../../data/keyboardCourse';
import { DRUMS_COURSE_LEVELS, DRUMS_LESSONS } from '../../data/drumsCourse';
import { UserProgress, SoloLesson, ViolaoLesson, Lesson } from '../../types';
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
  BookOpen,
  Music,
  Lock,
  Unlock,
  Disc,
  Grid,
  ArrowRight
} from 'lucide-react';
import { LESSON_TO_SKILL_MAP, createInitialPedagogicalProfile } from '../../pedagogy/adaptiveEngine';
import { 
  OfficialCourseId, 
  COURSE_METADATA_MAP,
  calculateCourseProgress, 
  isCourseUnlocked, 
  canAccessCourse,
  getPrimaryCourseId,
  getCatalogCoursesStatus
} from '../../academia/progress/unlockGate';
import { useChordModal } from '../../contexts/ChordModalContext';
import { CourseVisualBanner } from './CourseVisualBanner';
import { getCourseModuleVisual } from '../../data/courseLessonVisuals';
import { COURSE_TRACK_VISUALS } from '../../data/visualGallery';
import { IllustrativeCard } from '../common/IllustrativeCard';

interface CurriculumViewProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ progress, onSelectLesson }) => {
  const { toggleChord, isChordOpen } = useChordModal();
  const primaryCourseId = getPrimaryCourseId(progress);
  const catalogStatus = getCatalogCoursesStatus(progress);

  // Track selector: 'violao' (Domínio Total do Violão — 60 Aulas) vs 'solo' (Guitarra Solo - 20 Aulas) vs 'conservatory' (Conservatório Geral - 18 Aulas)
  // Active track selection: violao | canonical | solo | baixo | teclado | bateria
  const [activeTrack, setActiveTrack] = useState<OfficialCourseId>(primaryCourseId);
  const [activeViolaoModule, setActiveViolaoModule] = useState<number>(1);
  const [activeSoloStage, setActiveSoloStage] = useState<number>(1);
  const [activeLevelIndex, setActiveLevelIndex] = useState<number>(0);

  const activeLevel = CURRICULUM_LEVELS[activeLevelIndex] || CURRICULUM_LEVELS[0];
  const activeStage = SOLO_COURSE_STAGES.find((s) => s.stageNumber === activeSoloStage) || SOLO_COURSE_STAGES[0];
  const activeViolaoMod = VIOLAO_MODULES.find((m) => m.moduleNumber === activeViolaoModule) || VIOLAO_MODULES[0];

  const currentCourseStatus = catalogStatus[activeTrack];
  const primaryStatus = catalogStatus[primaryCourseId];
  const isTrackUnlocked = isCourseUnlocked(activeTrack, progress);

  // Violão metrics
  const violaoLessonsCompleted = VIOLAO_LESSONS.filter((l) => progress.completedLessons.includes(l.id)).length;
  const violaoProgressPercent = Math.round((violaoLessonsCompleted / VIOLAO_LESSONS.length) * 100);

  // Solo metrics
  const soloLessonsCompleted = SOLO_LESSONS.filter((l) => progress.completedLessons.includes(l.id)).length;
  const soloProgressPercent = Math.round((soloLessonsCompleted / SOLO_LESSONS.length) * 100);

  // Status pedagógico de uma aula de violão (3 estados: Aprendendo, Consolidando, Dominado)
  const getViolaoLessonStatus = (lesson: ViolaoLesson) => {
    const isCompleted = progress.completedLessons.includes(lesson.id);
    const log = progress.practiceLogs?.[lesson.id];
    
    if (isCompleted || log?.confidence === 'mastered_with_metronome' || log?.status === 'mastered') {
      return {
        label: 'Dominado',
        state: 'mastered' as const,
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50',
        desc: 'Acordes e dedilhados limpos no andamento alvo'
      };
    }
    if (log?.status === 'practicing' || log?.confidence === 'playable_slow' || (progress.exerciseRepetitions?.[lesson.id] || 0) > 0) {
      return {
        label: 'Consolidando',
        state: 'consolidating' as const,
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/50',
        desc: 'Transições de acordes e ritmo em consolidação'
      };
    }
    return {
      label: 'Aprendendo',
      state: 'learning' as const,
      badgeClass: 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9] dark:bg-[#1A1A20] dark:text-[#B8B3C0] dark:border-[#33333E]',
      desc: 'Compreensão de digitação, postura e sonoridade'
    };
  };

  // Status pedagógico de uma aula solo
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

  const handleSelectLesson = (lessonId: string, courseId: OfficialCourseId) => {
    if (!isCourseUnlocked(courseId, progress)) {
      return;
    }
    onSelectLesson(lessonId);
  };

  // Helper para renderizar os níveis de Baixo, Teclado, Bateria ou Canônica
  const renderConservatoryLevelCourse = (
    courseLevels: typeof CURRICULUM_LEVELS,
    courseId: OfficialCourseId,
    courseTitle: string
  ) => {
    const currentCourseLevel = courseLevels[activeLevelIndex] || courseLevels[0];
    const totalLessons = courseLevels.flatMap((lvl) => lvl.lessons);
    const completedCount = totalLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    const progressPercent = Math.round((completedCount / totalLessons.length) * 100);

    return (
      <>
        {/* Barra de Progresso do Curso */}
        <div className="bg-[#F8F7F4] dark:bg-[#1A1A20] border border-[#D9D9D9] dark:border-[#33333E] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
            <span className="text-xs font-extrabold text-[#25252A] dark:text-[#F8F7F4]">
              Evolução em {courseTitle}:
            </span>
            <span className="text-xs font-mono-code font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
              {completedCount} de {totalLessons.length} aulas concluídas ({progressPercent}%)
            </span>
          </div>
          <div className="w-full sm:w-48 bg-white dark:bg-[#25252A] h-2.5 rounded-full overflow-hidden border border-[#D9D9D9] dark:border-[#33333E]">
            <div 
              className="bg-[#7B1E2B] dark:bg-[#FF6B81] h-full transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 6 Levels Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {courseLevels.map((lvl) => {
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
              <span>{courseTitle} • Nível {currentCourseLevel.level}</span>
            </div>
            <h2 className="text-2xl font-black text-[#25252A] dark:text-[#F8F7F4] mt-1">{currentCourseLevel.name}</h2>
            <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1 font-medium">{currentCourseLevel.subtitle}</p>
            <p className="text-xs text-[#25252A] dark:text-[#E0DDE5] mt-2 bg-[#F8F7F4] dark:bg-[#1A1A20] p-3 rounded-xl border border-[#D9D9D9] dark:border-[#33333E] leading-relaxed">
              {currentCourseLevel.description}
            </p>
          </div>

          <CourseVisualBanner
            visual={getCourseModuleVisual(courseId, currentCourseLevel.level)}
            variant="module"
          />

          {/* Lessons List in this Level */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] uppercase tracking-wider block">
              Módulos & Aulas deste Nível:
            </label>

            {currentCourseLevel.lessons.map((lesson) => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              const isCurrent = progress.currentLessonId === lesson.id;

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson.id, courseId)}
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
    );
  };

  const getCourseTabIcon = (id: OfficialCourseId) => {
    switch (id) {
      case 'violao':
        return <Music className="w-3.5 h-3.5" />;
      case 'canonical':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'solo':
        return <Zap className="w-3.5 h-3.5" />;
      case 'baixo':
        return <Disc className="w-3.5 h-3.5" />;
      case 'teclado':
        return <Grid className="w-3.5 h-3.5" />;
      case 'bateria':
        return <Activity className="w-3.5 h-3.5" />;
    }
  };

  const courseList: OfficialCourseId[] = ['violao', 'canonical', 'solo', 'baixo', 'teclado', 'bateria'];

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-12">
      {/* Header com Seletor de Cursos do Conservatório */}
      <div className="bg-white dark:bg-[#25252A] border border-[#D9D9D9] dark:border-[#33333E] rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Guitar className="w-5 h-5 text-[#7B1E2B] dark:text-[#FF6B81]" />
              <h1 className="text-xl sm:text-2xl font-black text-[#25252A] dark:text-[#F8F7F4]">
                Currículo Pedagógico do Conservatório
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1 font-medium">
              Formação musical acadêmica estruturada em 5 instrumentos com progressão progressiva e desbloqueio por mérito.
            </p>
          </div>

          {/* Badge informativo de desbloqueio */}
          <div className="flex items-center gap-2 bg-[#F8F7F4] dark:bg-[#1A1A20] px-3 py-1.5 rounded-xl border border-[#D9D9D9] dark:border-[#33333E] self-start sm:self-auto">
            {primaryStatus.isUnlocked && primaryStatus.progressPercentage >= 50 ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Catálogo 100% Desbloqueado
                </span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#7B1E2B] dark:text-[#FF6B81]" />
                <span className="text-xs font-bold text-[#25252A] dark:text-[#F8F7F4]">
                  Desbloqueio Geral: {primaryStatus.progressPercentage}% / 50%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Barra Seletora dos 6 Cursos (com miniatura visual de cada instrumento) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-[#F8F7F4] dark:bg-[#1A1A20] p-2 rounded-2xl border border-[#D9D9D9] dark:border-[#33333E]">
          {courseList.map((cId) => {
            const meta = COURSE_METADATA_MAP[cId];
            const status = catalogStatus[cId];
            const isSelected = activeTrack === cId;
            const isPrimary = cId === primaryCourseId;
            const trackVisual = COURSE_TRACK_VISUALS[cId];

            return (
              <button
                key={cId}
                onClick={() => setActiveTrack(cId)}
                className={`flex flex-col overflow-hidden rounded-xl text-left transition-all relative border ${
                  isSelected
                    ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-sm ring-2 ring-[#7B1E2B]/25'
                    : 'bg-white dark:bg-[#25252A] text-[#666672] dark:text-[#B8B3C0] hover:text-[#25252A] dark:hover:text-white border-[#D9D9D9] dark:border-[#33333E]'
                }`}
              >
                {/* Instrument thumbnail strip */}
                <div className="relative w-full h-14 sm:h-16 overflow-hidden bg-[#25252A]">
                  <img
                    src={trackVisual.src}
                    alt={trackVisual.alt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      isSelected ? 'scale-105 opacity-95' : 'opacity-85 hover:scale-105'
                    }`}
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-t ${
                      isSelected ? 'from-[#7B1E2B]/85 via-black/20 to-transparent' : 'from-black/65 via-black/15 to-transparent'
                    }`}
                  />
                  <div className="absolute top-1.5 right-1.5">
                    {isPrimary ? (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/55 text-[#F5C542] backdrop-blur-xs">
                        Base
                      </span>
                    ) : !status.isUnlocked ? (
                      <span className="w-5 h-5 rounded-full bg-black/55 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-amber-300" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-black/55 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 flex-1 flex flex-col justify-between w-full">
                  <div className="flex items-center gap-1.5 w-full">
                    {getCourseTabIcon(cId)}
                    <span className={`text-[11px] font-extrabold uppercase tracking-wide truncate ${
                      isSelected ? 'text-white' : 'text-[#25252A] dark:text-[#F8F7F4]'
                    }`}>
                      {meta.instrumentName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-medium mt-1.5">
                    <span className={isSelected ? 'text-white/85' : 'text-[#666672] dark:text-[#B8B3C0]'}>
                      {meta.totalLessons} aulas
                    </span>
                    <span className={`font-mono-code font-bold ${
                      isSelected ? 'text-white' : status.isUnlocked ? 'text-[#7B1E2B] dark:text-[#FF6B81]' : 'text-amber-700 dark:text-amber-400'
                    }`}>
                      {status.isUnlocked ? `${status.progressPercentage}%` : '50% nec.'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SE O CURSO ATIVO ESTIVER BLOQUEADO: TELA DE BLOQUEIO    */}
      {/* ======================================================== */}
      {!isTrackUnlocked ? (
        <div className="bg-white dark:bg-[#25252A] border border-[#D9D9D9] dark:border-[#33333E] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <IllustrativeCard
              artwork={COURSE_TRACK_VISUALS[activeTrack]}
              variant="banner"
              className="text-left"
            />
            <div className="w-12 h-12 rounded-2xl bg-[#F5E8EA] dark:bg-[#3A1E24] border border-[#E8D3D6] dark:border-[#4D2830] flex items-center justify-center mx-auto text-[#7B1E2B] dark:text-[#FF6B81] shadow-xs">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#7B1E2B] dark:text-[#FF6B81] bg-[#F5E8EA] dark:bg-[#3A1E24] px-3 py-1 rounded-full border border-[#E8D3D6] dark:border-[#4D2830]">
                Acesso Restrito por Mérito Acadêmico
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#25252A] dark:text-[#F8F7F4] mt-3">
                {currentCourseStatus.name}
              </h2>
              <p className="text-sm text-[#666672] dark:text-[#B8B3C0] mt-2 leading-relaxed">
                Este curso completo de conservatório será liberado automaticamente assim que você alcançar <strong className="text-[#25252A] dark:text-white">pelo menos 50% de conclusão válida</strong> no seu curso principal (<strong className="text-[#7B1E2B] dark:text-[#FF6B81]">{primaryStatus.name}</strong>).
              </p>
            </div>

            {/* Painel de Progresso do Curso Principal */}
            <div className="bg-[#F8F7F4] dark:bg-[#1A1A20] border border-[#D9D9D9] dark:border-[#33333E] rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#25252A] dark:text-[#F8F7F4]">
                  Seu Progresso no Curso Base ({primaryStatus.name}):
                </span>
                <span className="font-mono-code text-[#7B1E2B] dark:text-[#FF6B81]">
                  {primaryStatus.progressPercentage}% de 50.0%
                </span>
              </div>

              {/* Barra com meta em 50% */}
              <div className="relative w-full bg-stone-200 dark:bg-stone-700 h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-[#7B1E2B] dark:bg-[#FF6B81] h-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (primaryStatus.progressPercentage / 50) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#666672] dark:text-[#B8B3C0]">
                <span>
                  {primaryStatus.completedLessons} de {primaryStatus.totalLessons} aulas concluídas
                </span>
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  Faltam {primaryStatus.remainingLessonsToFifty} aulas ({primaryStatus.remainingPercentageToFifty}%) para liberar
                </span>
              </div>
            </div>

            {/* Botão de Redirecionamento Pedagógico */}
            <div className="pt-2">
              <button
                onClick={() => setActiveTrack(primaryCourseId)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-white font-bold text-sm shadow-xs transition transform hover:scale-[1.02]"
              >
                <span>Continuar Estudando no Curso Principal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] italic">
              "A pedagogia de conservatório preserva a solidez técnica no instrumento de escolha antes da ampliação do repertório instrumental."
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ======================================================== */}
          {/* TRILHA: DOMÍNIO TOTAL DO VIOLÃO (60 AULAS EM 10 MÓDULOS) */}
          {/* ======================================================== */}
          {activeTrack === 'violao' && (
            <>
              {/* Barra de Progresso do Domínio Total do Violão */}
              <div className="bg-[#F8F7F4] dark:bg-[#1A1A20] border border-[#D9D9D9] dark:border-[#33333E] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
                  <span className="text-xs font-extrabold text-[#25252A] dark:text-[#F8F7F4]">
                    Evolução no Domínio Total do Violão:
                  </span>
                  <span className="text-xs font-mono-code font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
                    {violaoLessonsCompleted} de {VIOLAO_LESSONS.length} aulas concluídas ({violaoProgressPercent}%)
                  </span>
                </div>
                <div className="w-full sm:w-48 bg-white dark:bg-[#25252A] h-2.5 rounded-full overflow-hidden border border-[#D9D9D9] dark:border-[#33333E]">
                  <div 
                    className="bg-[#7B1E2B] dark:bg-[#FF6B81] h-full transition-all duration-300" 
                    style={{ width: `${violaoProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Seletor de 10 Módulos do Curso de Violão */}
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
                {VIOLAO_MODULES.map((mod) => {
                  const isSelected = activeViolaoModule === mod.moduleNumber;
                  const completedInMod = mod.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
                  const isAllCompleted = completedInMod === mod.lessons.length;

                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveViolaoModule(mod.moduleNumber)}
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
                          Módulo {mod.moduleNumber}
                        </span>
                        <span className={`text-xs font-bold line-clamp-1 mt-0.5 ${isSelected ? 'text-white' : 'text-[#25252A] dark:text-[#F8F7F4]'}`}>
                          {mod.badge}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[10px]">
                        <span className={isSelected ? 'text-[#F5E8EA]' : 'text-[#666672] dark:text-[#B8B3C0]'}>
                          {mod.lessons.length} aulas
                        </span>
                        {isAllCompleted ? (
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                        ) : (
                          <span className={`font-mono-code font-bold ${isSelected ? 'text-white' : 'text-[#25252A] dark:text-[#F8F7F4]'}`}>
                            {completedInMod}/{mod.lessons.length}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Visão do Módulo de Violão Selecionado */}
              <div className="bg-white dark:bg-[#25252A] border border-[#D9D9D9] dark:border-[#33333E] rounded-3xl p-4 sm:p-8 shadow-xs space-y-6">
                <div className="pb-4 border-b border-[#D9D9D9] dark:border-[#33333E]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] uppercase tracking-wider">
                    <Target className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
                    <span>Academia do Violão • Módulo {activeViolaoMod.moduleNumber}</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#25252A] dark:text-[#F8F7F4] mt-1">
                    {activeViolaoMod.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1 font-medium">
                    {activeViolaoMod.subtitle}
                  </p>
                  <p className="text-xs text-[#25252A] dark:text-[#E0DDE5] mt-2 bg-[#F8F7F4] dark:bg-[#1A1A20] p-3 rounded-xl border border-[#D9D9D9] dark:border-[#33333E] leading-relaxed">
                    {activeViolaoMod.description}
                  </p>
                </div>

                <CourseVisualBanner
                  visual={getCourseModuleVisual('violao', activeViolaoMod.moduleNumber)}
                  variant="module"
                />

                {/* Lista das 5 Aulas do Módulo */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] uppercase tracking-wider block">
                    Aulas deste Módulo:
                  </label>

                  {activeViolaoMod.lessons.map((lesson) => {
                    const isCompleted = progress.completedLessons.includes(lesson.id);
                    const isCurrent = progress.currentLessonId === lesson.id;
                    const status = getViolaoLessonStatus(lesson);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson.id, 'violao')}
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

                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${status.badgeClass}`}>
                                <Activity className="w-3 h-3" />
                                <span>{status.label}</span>
                              </span>

                              {lesson.chordDiagrams && lesson.chordDiagrams.length > 0 && (
                                <div
                                  className="inline-flex flex-wrap items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {lesson.chordDiagrams.map((c, cIdx) => {
                                    const chordSymbol = c.symbol || c.name || '';
                                    const open = isChordOpen({ chordData: c, symbol: chordSymbol });
                                    return (
                                      <button
                                        key={`${lesson.id}-chord-${cIdx}`}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleChord({ chordData: c, symbol: chordSymbol });
                                        }}
                                        title={`Toque para ver ou fechar o diagrama do acorde ${chordSymbol}`}
                                        className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono-code text-[11px] font-bold transition cursor-pointer ${
                                          open
                                            ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                                            : 'bg-stone-100 dark:bg-stone-800 text-[#7B1E2B] dark:text-[#FF6B81] border-stone-200 dark:border-stone-700 hover:bg-[#F5E8EA] dark:hover:bg-[#381A25]'
                                        }`}
                                      >
                                        {chordSymbol}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

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
          {/* TRILHA: GUITARRA SOLO (20 AULAS EM 5 ETAPAS)            */}
          {/* ======================================================== */}
          {activeTrack === 'solo' && (
            <>
              {/* Barra de Progresso do Curso Solo */}
              <div className="bg-[#F8F7F4] dark:bg-[#1A1A20] border border-[#D9D9D9] dark:border-[#33333E] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
                  <span className="text-xs font-extrabold text-[#25252A] dark:text-[#F8F7F4]">
                    Evolução em Guitarra Solo:
                  </span>
                  <span className="text-xs font-mono-code font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
                    {soloLessonsCompleted} de {SOLO_LESSONS.length} aulas concluídas ({soloProgressPercent}%)
                  </span>
                </div>
                <div className="w-full sm:w-48 bg-white dark:bg-[#25252A] h-2.5 rounded-full overflow-hidden border border-[#D9D9D9] dark:border-[#33333E]">
                  <div 
                    className="bg-[#7B1E2B] dark:bg-[#FF6B81] h-full transition-all duration-300" 
                    style={{ width: `${soloProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Seletor de 5 Etapas do Curso Solo */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SOLO_COURSE_STAGES.map((stg) => {
                  const isSelected = activeSoloStage === stg.stageNumber;
                  const completedInStg = stg.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
                  const isAllCompleted = completedInStg === stg.lessons.length;

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
                            {completedInStg}/{stg.lessons.length}
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
                    <Zap className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" />
                    <span>Guitarra Solo • Etapa {activeStage.stageNumber}</span>
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

                <CourseVisualBanner
                  visual={getCourseModuleVisual('solo', activeStage.stageNumber)}
                  variant="module"
                />

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
                        onClick={() => handleSelectLesson(lesson.id, 'solo')}
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

                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${status.badgeClass}`}>
                                <Activity className="w-3 h-3" />
                                <span>{status.label}</span>
                              </span>

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
          {/* TRILHA: CONSERVATÓRIO DE GUITARRA (GRADE CANÔNICA)       */}
          {/* ======================================================== */}
          {activeTrack === 'canonical' && renderConservatoryLevelCourse(CURRICULUM_LEVELS, 'canonical', 'Conservatório de Guitarra')}

          {/* ======================================================== */}
          {/* TRILHA: CONTRABAIXO ELÉTRICO                            */}
          {/* ======================================================== */}
          {activeTrack === 'baixo' && renderConservatoryLevelCourse(BASS_COURSE_LEVELS as any, 'baixo', 'Formação em Contrabaixo Elétrico')}

          {/* ======================================================== */}
          {/* TRILHA: TECLADO E PIANO                                 */}
          {/* ======================================================== */}
          {activeTrack === 'teclado' && renderConservatoryLevelCourse(KEYBOARD_COURSE_LEVELS as any, 'teclado', 'Formação em Teclado e Piano')}

          {/* ======================================================== */}
          {/* TRILHA: BATERIA E PRÁTICA RÍTMICA                       */}
          {/* ======================================================== */}
          {activeTrack === 'bateria' && renderConservatoryLevelCourse(DRUMS_COURSE_LEVELS as any, 'bateria', 'Formação em Bateria e Prática Rítmica')}
        </>
      )}
    </div>
  );
};

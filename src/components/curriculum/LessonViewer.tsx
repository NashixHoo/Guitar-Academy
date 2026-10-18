import React, { useState, useEffect, useRef } from 'react';
import { Lesson, UserProgress } from '../../types';
import { InteractiveFretboard } from '../fretboard/InteractiveFretboard';
import { audioEngine } from '../../audio/audioEngine';
import { storageService } from '../../services/storageService';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Clock,
  Guitar,
  Flame,
  BookmarkCheck,
  Check,
  ChevronRight,
  Target,
  Trophy,
  Play,
  Pause,
  AlertCircle,
  Radio,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { LESSON_TO_SKILL_MAP, createInitialPedagogicalProfile } from '../../pedagogy/adaptiveEngine';

interface LessonViewerProps {
  lesson: Lesson;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenMetronomeAtBpm?: (bpm: number) => void;
  onOpenTuner?: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  progress,
  onUpdateProgress,
  onSelectLesson,
  onOpenMetronomeAtBpm,
  onOpenTuner,
}) => {
  const currentLog = progress.practiceLogs?.[lesson.id];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('part-0');

  // Metronome state for practical exercise
  const [isMetronomeRunning, setIsMetronomeRunning] = useState<boolean>(false);
  const [activeBeat, setActiveBeat] = useState<number>(0);
  const isPlayingAudioSequenceRef = useRef<boolean>(false);

  // Self-evaluation state
  const [practicedBpm, setPracticedBpm] = useState<number>(currentLog?.practicedBpm || 60);
  const [confidence, setConfidence] = useState<'needs_review' | 'playable_slow' | 'mastered_with_metronome'>(
    currentLog?.confidence || 'playable_slow'
  );
  const [personalNotes, setPersonalNotes] = useState<string>(currentLog?.notes || '');
  const [needsReview, setNeedsReview] = useState<boolean>(currentLog?.needsReview || false);
  const [practiceSavedMessage, setPracticeSavedMessage] = useState<boolean>(false);

  // Practical exercise repetitions tracking
  const exercise = lesson.practicalExercise;
  const currentRepetitions = exercise
    ? progress.exerciseRepetitions?.[exercise.id] ?? currentLog?.exerciseRepetitions ?? 0
    : 0;

  // Cleanup metronome on unmount or section change
  useEffect(() => {
    return () => {
      audioEngine.stopMetronome();
      setIsMetronomeRunning(false);
    };
  }, [lesson.id, activeSection]);

  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setActiveSection('part-0');
    setPracticeSavedMessage(false);
    setIsMetronomeRunning(false);
    audioEngine.stopMetronome();

    const log = progress.practiceLogs?.[lesson.id];
    setPracticedBpm(log?.practicedBpm || 60);
    setConfidence(log?.confidence || 'playable_slow');
    setPersonalNotes(log?.notes || '');
    setNeedsReview(log?.needsReview || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id]);

  const isCompleted = progress.completedLessons.includes(lesson.id);

  const toggleExerciseMetronome = (targetBpm: number) => {
    if (isMetronomeRunning) {
      audioEngine.stopMetronome();
      setIsMetronomeRunning(false);
    } else {
      setIsMetronomeRunning(true);
      audioEngine.startMetronome(
        targetBpm,
        4,
        'quarter',
        true,
        (beatIndex) => {
          setActiveBeat(beatIndex);
        }
      );
    }
  };

  const playOpenStringsSequence = () => {
    if (isPlayingAudioSequenceRef.current) return;
    isPlayingAudioSequenceRef.current = true;

    // Frequencies for standard tuning: E2, A2, D3, G3, B3, E4
    const notes = [
      { freq: 82.41, name: '6ª: E (Mi)' },
      { freq: 110.0, name: '5ª: A (Lá)' },
      { freq: 146.83, name: '4ª: D (Ré)' },
      { freq: 196.0, name: '3ª: G (Sol)' },
      { freq: 246.94, name: '2ª: B (Si)' },
      { freq: 329.63, name: '1ª: E (Mi)' },
    ];

    notes.forEach((note, idx) => {
      setTimeout(() => {
        audioEngine.playGuitarNote(note.freq, 1.2, 0.75);
        if (idx === notes.length - 1) {
          isPlayingAudioSequenceRef.current = false;
        }
      }, idx * 1000); // 1 beat per second = 60 BPM
    });
  };

  const handleAddRepetition = () => {
    if (!exercise) return;
    const newCount = currentRepetitions + 1;
    const updated = storageService.recordExerciseRepetition(
      lesson.id,
      exercise.id,
      newCount,
      exercise.targetRepetitions,
      exercise.targetBpm
    );
    onUpdateProgress(updated);

    audioEngine.playGuitarNote(523.25, 0.4, 0.8); // C5 chime
    if (newCount >= exercise.targetRepetitions && currentRepetitions < exercise.targetRepetitions) {
      audioEngine.playCompletionChime();
    }
  };

  const handleDecrementRepetition = () => {
    if (!exercise || currentRepetitions <= 0) return;
    const newCount = Math.max(0, currentRepetitions - 1);
    const updated = storageService.recordExerciseRepetition(
      lesson.id,
      exercise.id,
      newCount,
      exercise.targetRepetitions,
      exercise.targetBpm
    );
    onUpdateProgress(updated);
  };

  const handleResetRepetitions = () => {
    if (!exercise) return;
    if (confirm('Deseja reiniciar a contagem de repetições deste exercício prático?')) {
      const updated = storageService.recordExerciseRepetition(
        lesson.id,
        exercise.id,
        0,
        exercise.targetRepetitions,
        exercise.targetBpm
      );
      onUpdateProgress(updated);
    }
  };

  const playToneExample = () => {
    audioEngine.playGuitarNote(261.63, 1.2, 0.7);
    setTimeout(() => {
      audioEngine.playGuitarNote(293.66, 1.2, 0.7);
    }, 600);
  };

  const playSemitoneExample = () => {
    audioEngine.playGuitarNote(329.63, 1.2, 0.7);
    setTimeout(() => {
      audioEngine.playGuitarNote(349.23, 1.2, 0.7);
    }, 600);
  };

  const handleSavePractice = (status: 'viewed' | 'practicing' | 'mastered') => {
    const updated = storageService.saveLessonPractice(lesson.id, {
      status,
      practicedBpm,
      confidence,
      notes: personalNotes,
      needsReview,
    });
    onUpdateProgress(updated);
    setPracticeSavedMessage(true);
    audioEngine.playGuitarNote(440, 0.8, 0.6);
    setTimeout(() => setPracticeSavedMessage(false), 3000);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCompleteQuiz = () => {
    if (!lesson.quiz) return;
    setQuizSubmitted(true);

    let correctCount = 0;
    const errors: Record<string, number> = { ...progress.frequentErrors };

    lesson.quiz.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected === q.correctIndex) {
        correctCount++;
      } else {
        errors[q.question] = (errors[q.question] || 0) + 1;
      }
    });

    const totalQuestions = lesson.quiz.questions.length;
    const scorePct = Math.round((correctCount / totalQuestions) * 100);

    const updated = storageService.recordQuizScore(lesson.id, scorePct, totalQuestions, errors);
    if (lesson.id === 'lesson-1' && !updated.achievements.includes('first-lesson')) {
      updated.achievements = [...updated.achievements, 'first-lesson'];
      storageService.saveProgress(updated);
    }

    if (scorePct >= 80) {
      audioEngine.playCompletionChime();
    }

    onUpdateProgress(updated);
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const allLessons = CURRICULUM_LEVELS.flatMap((l) => l.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Active part index if in part section
  const currentPartIndex = activeSection.startsWith('part-') ? parseInt(activeSection.replace('part-', ''), 10) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Lesson Hero Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Decorative wine red top accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#7B1E2B]" />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#7B1E2B] font-semibold mb-2">
          <span className="px-3 py-1 rounded-full bg-[#F5E8EA] border border-[#E8D3D6] font-bold">
            {lesson.moduleTitle}
          </span>
          <div className="flex items-center gap-2 text-[#666672]">
            <Clock className="w-3.5 h-3.5 text-[#7B1E2B]" />
            <span>Estimado: {lesson.estimatedMinutes} min</span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-emerald-700 font-bold ml-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Concluída
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#25252A] mt-2 leading-tight tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-sm sm:text-base text-[#666672] mt-2 font-medium">
          {lesson.subtitle}
        </p>

        {/* Learning Objective Box */}
        <div className="mt-4 p-4 rounded-2xl bg-[#F8F7F4] border border-[#D9D9D9] flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-[#7B1E2B] shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
              Objetivo desta aula
            </span>
            <p className="text-xs sm:text-sm text-[#25252A] mt-0.5 font-medium leading-relaxed">
              {lesson.objective}
            </p>
          </div>
        </div>
      </div>

      {/* Informative Prerequisite Banner (Fase 3, Item 4) */}
      {(() => {
        const profile = progress.pedagogicalProfile || createInitialPedagogicalProfile();
        const skillId = LESSON_TO_SKILL_MAP[lesson.id];
        const skill = skillId ? profile.skills[skillId] : null;
        const prereqSkills = (skill?.prerequisites || [])
          .map((pId) => profile.skills[pId])
          .filter(Boolean);
        const pendingPrereqs = prereqSkills.filter((p) => p.masteryScore < 60);

        if (pendingPrereqs.length === 0) return null;

        return (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <strong className="text-amber-900 block font-bold">
                  Recomendação Pedagógica de Pré-Requisito:
                </strong>
                <span className="text-amber-800">
                  Esta aula pressupõe domínio prévio de{' '}
                  <strong>{pendingPrereqs.map((p) => p.name).join(', ')}</strong> (domínio atual: {pendingPrereqs[0].masteryScore}%). Você é livre para estudar esta aula agora ou praticar os fundamentos primeiro.
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Lesson Navigation Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {lesson.parts.map((part, idx) => (
          <button
            key={part.id}
            onClick={() => setActiveSection(`part-${idx}`)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
              activeSection === `part-${idx}`
                ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                : 'bg-white text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
            }`}
          >
            {part.title.split('—')[0] || `Parte ${idx + 1}`}
          </button>
        ))}

        {/* Practical Exercise Tab */}
        {exercise && (
          <button
            onClick={() => setActiveSection('exercise')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
              activeSection === 'exercise'
                ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                : 'bg-[#F5E8EA] text-[#7B1E2B] hover:bg-[#ebd3d6] border-[#E8D3D6]'
            }`}
          >
            <Target className="w-4 h-4 text-[#B52A3A]" />
            <span>Exercício Prático</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono-code font-bold ${
              activeSection === 'exercise' ? 'bg-white/20 text-white' : 'bg-white text-[#7B1E2B]'
            }`}>
              {exercise.targetBpm} BPM
            </span>
          </button>
        )}

        {lesson.quiz && (
          <button
            onClick={() => setActiveSection('quiz')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
              activeSection === 'quiz'
                ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                : 'bg-white text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#B52A3A]" />
            <span>Validação Teórica</span>
          </button>
        )}

        <button
          onClick={() => setActiveSection('evaluation')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
            activeSection === 'evaluation'
              ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
              : 'bg-white text-[#7B1E2B] border-[#7B1E2B]'
          }`}
        >
          <Guitar className="w-4 h-4 text-[#7B1E2B]" />
          <span>Registro de Prática Real</span>
        </button>

        {onOpenTuner && lesson.id === 'lesson-1' && (
          <button
            onClick={onOpenTuner}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-2xs"
            title="Abrir o Afinador Pro com microfone real para conferir as 6 cordas da guitarra física"
          >
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>Afinador de Guitarra (Microfone)</span>
          </button>
        )}
      </div>

      {/* SECTION 1: Lesson Theoretical Content Parts */}
      {activeSection.startsWith('part-') && currentPartIndex < lesson.parts.length && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
            <h2 className="text-xl font-bold text-[#25252A]">
              {lesson.parts[currentPartIndex].title}
            </h2>
            <span className="text-xs text-[#666672] font-semibold">
              Passo {currentPartIndex + 1} de {lesson.parts.length}
            </span>
          </div>

          {/* Interactive Audio Examples for Lesson 1 */}
          {lesson.id === 'lesson-1' && currentPartIndex === 0 && (
            <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] space-y-3">
              <span className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#B52A3A]" />
                Demonstração Auditiva: Tom vs Semitom
              </span>
              <p className="text-xs text-[#666672] font-medium">
                Ouça com atenção a diferença de distância sonora entre duas notas separadas por um tom e por um semitom:
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={playToneExample}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#F5E8EA] text-xs font-bold text-[#25252A] transition border border-[#D9D9D9] shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#7B1E2B]" />
                  <span>Ouvir 1 Tom (Dó para Ré)</span>
                </button>
                <button
                  onClick={playSemitoneExample}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#F5E8EA] text-xs font-bold text-[#25252A] transition border border-[#D9D9D9] shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#B52A3A]" />
                  <span>Ouvir 1 Semitom (Mi para Fá)</span>
                </button>
              </div>
            </div>
          )}

          {/* Educational Content Markdown */}
          <div className="prose max-w-none text-[#25252A] text-sm sm:text-base leading-relaxed space-y-4">
            {lesson.parts[currentPartIndex].contentMarkdown.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={pIdx} className="text-lg font-black text-[#7B1E2B] mt-4 mb-2 tracking-tight">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('* ')) {
                return (
                  <ul key={pIdx} className="list-disc list-inside space-y-1.5 text-[#25252A]">
                    {paragraph.split('\n').map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace('* ', '')}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <div key={pIdx} className="p-3.5 rounded-xl bg-[#F5E8EA] border-l-4 border-[#7B1E2B] text-xs sm:text-sm text-[#25252A] font-medium">
                    {paragraph.replace('> ', '')}
                  </div>
                );
              }
              if (paragraph.startsWith('```')) {
                return (
                  <pre key={pIdx} className="bg-[#1A1A20] p-4 rounded-xl text-xs sm:text-sm font-mono-code text-[#F8F7F4] overflow-x-auto border border-[#33333E] whitespace-pre">
                    {paragraph.replace(/```/g, '')}
                  </pre>
                );
              }
              return (
                <p key={pIdx} className="text-[#666672] leading-relaxed font-medium">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Integrated Static Fretboard Reference */}
          {lesson.parts[currentPartIndex].fretboardHighlight && (
            <div className="mt-6 pt-6 border-t border-[#D9D9D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#25252A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B52A3A]" />
                  Diagrama de Consulta para Guitarra Física — As Seis Cordas Soltas
                </span>
                <span className="text-xs text-[#7B1E2B] font-bold">Casas 0 a 12</span>
              </div>
              <InteractiveFretboard
                maxFrets={12}
                highlightedFrets={lesson.parts[currentPartIndex].fretboardHighlight?.frets}
                showAllNotes={false}
              />
            </div>
          )}

          {/* Navigation between parts */}
          <div className="flex items-center justify-between pt-6 border-t border-[#D9D9D9]">
            <button
              onClick={() => setActiveSection(`part-${Math.max(0, currentPartIndex - 1)}`)}
              disabled={currentPartIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                currentPartIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-[#666672]'
                  : 'bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] border border-[#D9D9D9]'
              }`}
            >
              Anterior
            </button>

            <button
              onClick={() => {
                if (currentPartIndex < lesson.parts.length - 1) {
                  setActiveSection(`part-${currentPartIndex + 1}`);
                } else if (exercise) {
                  setActiveSection('exercise');
                } else if (lesson.quiz) {
                  setActiveSection('quiz');
                } else {
                  setActiveSection('evaluation');
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] text-xs sm:text-sm font-bold transition shadow-xs"
            >
              <span>{currentPartIndex === lesson.parts.length - 1 ? (exercise ? 'Ir para Exercício Prático (60 BPM)' : 'Ir para Validação') : 'Próxima Parte'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: NEW PRACTICAL EXERCISE (6 OPEN STRINGS, ALTERNATE PICKING, 60 BPM & REPETITIONS COUNTER) */}
      {activeSection === 'exercise' && exercise && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header */}
          <div className="pb-4 border-b border-[#D9D9D9] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E8EA] border border-[#E8D3D6] text-[#7B1E2B] text-xs font-bold">
                <Target className="w-3.5 h-3.5 text-[#B52A3A]" />
                <span>Exercício Prático na Guitarra Física • 60 BPM</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#666672]">
                  Meta: {exercise.targetRepetitions} repetições limpas
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#7B1E2B] text-white font-mono-code font-bold text-xs">
                  {exercise.targetBpm} BPM
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#25252A]">
              {exercise.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#666672] font-medium leading-relaxed">
              {exercise.subtitle}
            </p>
          </div>

          {/* Integrated Metronome Control Box */}
          <div className="bg-[#F8F7F4] border border-[#D9D9D9] rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                  Metrônomo do Exercício (Áudio de Precisão Real)
                </span>
                <span className="text-xs text-[#666672] font-medium">
                  Compasso 4/4 • Subdivisão em semínimas (1 clique por nota a 60 BPM)
                </span>
              </div>

              {/* Metronome Beat Indicator Visualizer */}
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((b) => {
                  const isActive = isMetronomeRunning && activeBeat === b;
                  const isAccent = b === 0;

                  return (
                    <div
                      key={`beat-dot-${b}`}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono-code text-xs font-bold transition-all duration-100 ${
                        isActive
                          ? isAccent
                            ? 'bg-[#B52A3A] text-white scale-110 shadow-sm ring-2 ring-[#B52A3A]/40'
                            : 'bg-[#7B1E2B] text-white scale-105 shadow-xs'
                          : 'bg-white border border-[#D9D9D9] text-[#666672]'
                      }`}
                    >
                      {b + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons for Metronome and Audio Demo */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => toggleExerciseMetronome(exercise.targetBpm)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-xs ${
                  isMetronomeRunning
                    ? 'bg-[#B52A3A] hover:bg-[#96222f] text-white animate-pulse'
                    : 'bg-[#7B1E2B] hover:bg-[#B52A3A] text-white'
                }`}
              >
                {isMetronomeRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isMetronomeRunning ? 'Pausar Metrônomo (60 BPM)' : 'Ligar Metrônomo a 60 BPM'}</span>
              </button>

              <button
                onClick={playOpenStringsSequence}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#F5E8EA] text-xs font-bold text-[#25252A] transition border border-[#D9D9D9]"
              >
                <Volume2 className="w-4 h-4 text-[#7B1E2B]" />
                <span>Ouvir Demonstração das 6 Cordas (60 BPM)</span>
              </button>

              {onOpenMetronomeAtBpm && (
                <button
                  onClick={() => onOpenMetronomeAtBpm(exercise.targetBpm)}
                  className="text-xs font-bold text-[#7B1E2B] hover:underline ml-auto"
                >
                  Abrir Módulo Metrônomo →
                </button>
              )}
            </div>
          </div>

          {/* Interactive Repetitions Counter Card */}
          <div className="bg-white border-2 border-[#E8D3D6] rounded-3xl p-6 shadow-xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 tortoiseshell-badge" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                  Contador de Repetições no Sistema de Progresso
                </span>
                <h3 className="text-2xl font-black text-[#25252A] mt-0.5 font-mono-code">
                  {currentRepetitions} <span className="text-sm font-normal text-[#666672]">/ {exercise.targetRepetitions} repetições limpas</span>
                </h3>
              </div>

              {currentRepetitions >= exercise.targetRepetitions ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <Trophy className="w-4 h-4 text-emerald-600" />
                  <span>Meta de Maestria Concluída!</span>
                </div>
              ) : (
                <div className="text-xs text-[#666672] font-semibold">
                  Faltam <strong className="text-[#7B1E2B]">{Math.max(0, exercise.targetRepetitions - currentRepetitions)}</strong> para a meta
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#F5E8EA] h-3 rounded-full overflow-hidden border border-[#E8D3D6]">
              <div
                className="bg-gradient-to-r from-[#7B1E2B] to-[#B52A3A] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((currentRepetitions / exercise.targetRepetitions) * 100))}%` }}
              />
            </div>

            {/* Counter Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleAddRepetition}
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#7B1E2B] hover:bg-[#B52A3A] active:scale-95 text-white font-black text-sm sm:text-base shadow-sm transition"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>+1 Repetição Concluída (6 Cordas a 60 BPM)</span>
              </button>

              <button
                onClick={handleDecrementRepetition}
                disabled={currentRepetitions <= 0}
                className="px-4 py-4 rounded-2xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-xs font-bold text-[#666672] border border-[#D9D9D9] transition disabled:opacity-40"
                title="Diminuir uma repetição"
              >
                -1
              </button>

              <button
                onClick={handleResetRepetitions}
                disabled={currentRepetitions <= 0}
                className="px-4 py-4 rounded-2xl bg-[#F8F7F4] hover:bg-rose-50 text-xs font-bold text-rose-700 border border-[#D9D9D9] transition disabled:opacity-40"
                title="Zerar contador de repetições"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Completion feedback banner */}
            {currentRepetitions >= exercise.targetRepetitions && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-medium flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-emerald-950">
                    Excelente coordenação rítmica!
                  </strong>
                  Você concluiu as {exercise.targetRepetitions} repetições com palhetada alternada a 60 BPM. Os dados foram salvos no seu histórico de prática e o distintivo de palhetada inicial foi desbloqueado!
                </div>
              </div>
            )}
          </div>

          {/* Visual Sequence Guide: 6 Strings with Alternate Picking Directions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider flex items-center gap-1.5">
                <Guitar className="w-4 h-4 text-[#B52A3A]" />
                Sequência das 6 Cordas e Sentido Obrigatório da Palheta
              </span>
              <span className="text-xs text-[#666672] font-semibold">
                Padrão: {exercise.pickingPattern}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {exercise.notesSequence.map((step, idx) => (
                <div
                  key={`string-step-${idx}`}
                  className="bg-[#F8F7F4] border border-[#D9D9D9] hover:border-[#7B1E2B] rounded-2xl p-3.5 text-center transition shadow-xs space-y-1.5"
                >
                  <span className="text-[10px] text-[#666672] font-bold block uppercase">
                    Passo {idx + 1}
                  </span>
                  <div className="text-lg font-black text-[#25252A]">
                    {step.stringNumber}ª Corda
                  </div>
                  <div className="text-xs font-bold text-[#7B1E2B]">
                    {step.noteCipher} ({step.notePt})
                  </div>
                  <div className={`mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black ${
                    step.pickDirection === 'down'
                      ? 'bg-[#7B1E2B] text-white'
                      : 'bg-[#B52A3A] text-white'
                  }`}>
                    <span className="text-sm">{step.pickDirection === 'down' ? '↓' : '↑'}</span>
                    <span>{step.pickDirection === 'down' ? 'Para Baixo' : 'Para Cima'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tablature Block */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#25252A] block uppercase tracking-wider">
              Tablatura Musical da Sequência
            </span>
            <pre className="bg-[#1A1A20] p-4 rounded-2xl text-xs sm:text-sm font-mono-code text-[#F8F7F4] overflow-x-auto border border-[#33333E] whitespace-pre leading-relaxed">
              {exercise.tablatureText}
            </pre>
          </div>

          {/* Instructions and Biomechanics Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step-by-step instructions */}
            <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-[#D9D9D9] space-y-3">
              <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                Instruções de Execução na Guitarra Real
              </span>
              <ul className="space-y-2 text-xs text-[#25252A]">
                {exercise.instructions.map((inst, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#F5E8EA] text-[#7B1E2B] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {iIdx + 1}
                    </span>
                    <span className="font-medium leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Biomechanics Tips */}
            <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-[#D9D9D9] space-y-3">
              <span className="text-xs font-bold text-[#B52A3A] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Dicas Biomecânicas Inegociáveis
              </span>
              <ul className="space-y-2 text-xs text-[#25252A]">
                {exercise.biomechanicTips.map((tip, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <span className="text-[#B52A3A] font-bold mt-0.5">•</span>
                    <span className="font-medium leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 pt-3 border-t border-[#D9D9D9]">
                <span className="text-[11px] font-bold text-[#666672] uppercase block">
                  Critério de Avaliação:
                </span>
                <p className="text-xs text-[#25252A] font-medium mt-0.5">
                  {exercise.validationCriteria}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-[#D9D9D9]">
            <button
              onClick={() => setActiveSection('part-0')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F8F7F4] text-[#25252A] hover:bg-[#F5E8EA] border border-[#D9D9D9] transition"
            >
              Voltar ao Conteúdo Teórico
            </button>

            <button
              onClick={() => {
                if (lesson.quiz) {
                  setActiveSection('quiz');
                } else {
                  setActiveSection('evaluation');
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] text-xs sm:text-sm font-bold transition shadow-xs"
            >
              <span>{lesson.quiz ? 'Avançar para Validação Teórica' : 'Ir para Registro de Prática'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: QUIZ SECTION (Validação Teórica) */}
      {activeSection === 'quiz' && lesson.quiz && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
            <div>
              <h2 className="text-xl font-bold text-[#25252A] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#7B1E2B]" />
                Validação de Conceitos Musicais
              </h2>
              <p className="text-xs text-[#666672] mt-0.5 font-medium">
                Responda às perguntas para verificar a compreensão teórica dos fundamentos estudados.
              </p>
            </div>
            {quizSubmitted && (
              <button
                onClick={handleRetryQuiz}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold transition border border-[#D9D9D9]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Validação</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {lesson.quiz.questions.map((q) => {
              const selectedIdx = selectedAnswers[q.id];
              const isAnswered = selectedIdx !== undefined;
              const isCorrect = isAnswered && selectedIdx === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    quizSubmitted
                      ? isCorrect
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-rose-50 border-rose-300'
                      : 'bg-[#F8F7F4] border-[#D9D9D9]'
                  }`}
                >
                  <h3 className="text-sm sm:text-base font-bold text-[#25252A] mb-3">
                    {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedIdx === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium transition border flex items-center justify-between ${
                            isOptionSelected
                              ? quizSubmitted
                                ? isCorrect
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-rose-600 text-white border-rose-600'
                                : 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                              : quizSubmitted && optIdx === q.correctIndex
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                              : 'bg-white text-[#25252A] border-[#D9D9D9] hover:bg-[#F5E8EA]'
                          }`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isOptionSelected && (
                            <span>{isCorrect ? '✓ Correto' : '✕ Incorreto'}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-3 pt-3 border-t border-[#D9D9D9] text-xs text-[#666672] font-medium">
                      <strong className="text-[#25252A]">Explicação:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#D9D9D9]">
            <button
              onClick={() => {
                if (exercise) {
                  setActiveSection('exercise');
                } else {
                  setActiveSection('part-0');
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F8F7F4] text-[#25252A] border border-[#D9D9D9]"
            >
              Voltar
            </button>

            {!quizSubmitted ? (
              <button
                onClick={handleCompleteQuiz}
                disabled={Object.keys(selectedAnswers).length < lesson.quiz.questions.length}
                className="px-6 py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] disabled:opacity-40 font-bold text-xs sm:text-sm shadow-xs transition"
              >
                Confirmar Respostas
              </button>
            ) : (
              <button
                onClick={() => setActiveSection('evaluation')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] font-bold text-xs sm:text-sm shadow-xs transition"
              >
                <span>Ir para Registro de Prática na Guitarra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: REAL PHYSICAL GUITAR PRACTICE EVALUATION */}
      {activeSection === 'evaluation' && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D9D9D9]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold mb-1">
                <Guitar className="w-3.5 h-3.5" />
                <span>Instrumento Real: Guitarra Física</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#25252A]">
                Registro de Prática e Autoavaliação Musical
              </h2>
              <p className="text-xs sm:text-sm text-[#666672] font-medium mt-0.5">
                O aplicativo não finge ouvir sua guitarra. Você é o juiz sincero da sua evolução musical física.
              </p>
            </div>

            {onOpenMetronomeAtBpm && (
              <button
                onClick={() => onOpenMetronomeAtBpm(practicedBpm)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-xs font-bold text-[#7B1E2B] border border-[#D9D9D9] transition"
              >
                <Clock className="w-4 h-4" />
                <span>Abrir Metrônomo a {practicedBpm} BPM</span>
              </button>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BPM Practiced */}
            <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-[#D9D9D9] space-y-3">
              <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                Andamento Alcançado na Guitarra (BPM)
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPracticedBpm((prev) => Math.max(40, prev - 5))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#D9D9D9] font-bold text-base hover:bg-[#F5E8EA]"
                >
                  -5
                </button>
                <div className="flex-1 text-center bg-white border border-[#D9D9D9] rounded-xl py-2">
                  <span className="text-2xl font-black text-[#25252A] font-mono-code">{practicedBpm}</span>
                  <span className="text-xs text-[#666672] font-bold ml-1">BPM</span>
                </div>
                <button
                  onClick={() => setPracticedBpm((prev) => Math.min(220, prev + 5))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#D9D9D9] font-bold text-base hover:bg-[#F5E8EA]"
                >
                  +5
                </button>
              </div>
              <p className="text-[11px] text-[#666672] italic">
                Recomendação: comece em 60 BPM. Só avance para andamento superior quando o som for limpo sem esforço.
              </p>
            </div>

            {/* Confidence Level */}
            <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-[#D9D9D9] space-y-3">
              <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                Nível de Domínio Motor e Sonoridade
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setConfidence('needs_review')}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition border flex items-center justify-between ${
                    confidence === 'needs_review'
                      ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-300'
                      : 'bg-white border-[#D9D9D9] text-[#666672]'
                  }`}
                >
                  <span>⚠️ Trastejando / Trocas lentas (Preciso Revisar)</span>
                  {confidence === 'needs_review' && <Check className="w-4 h-4 text-rose-700" />}
                </button>

                <button
                  type="button"
                  onClick={() => setConfidence('playable_slow')}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition border flex items-center justify-between ${
                    confidence === 'playable_slow'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-300'
                      : 'bg-white border-[#D9D9D9] text-[#666672]'
                  }`}
                >
                  <span>🔄 Toco em andamento lento (Em Desenvolvimento)</span>
                  {confidence === 'playable_slow' && <Check className="w-4 h-4 text-amber-700" />}
                </button>

                <button
                  type="button"
                  onClick={() => setConfidence('mastered_with_metronome')}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition border flex items-center justify-between ${
                    confidence === 'mastered_with_metronome'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-300'
                      : 'bg-white border-[#D9D9D9] text-[#666672]'
                  }`}
                >
                  <span>✅ Dominado com som limpo no metrônomo</span>
                  {confidence === 'mastered_with_metronome' && <Check className="w-4 h-4 text-emerald-700" />}
                </button>
              </div>
            </div>
          </div>

          {/* Personal Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#25252A] flex items-center gap-1.5">
              <span>Anotações Pessoais de Prática (Dificuldades, dedilhado ou sensações)</span>
            </label>
            <textarea
              rows={3}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Ex: Tive dificuldade na troca do Dedo 3 para o Dedo 4 na 2ª corda. Pratiquei 10 minutos a 60 BPM..."
              className="w-full bg-[#F8F7F4] border border-[#D9D9D9] rounded-2xl p-3 text-xs sm:text-sm text-[#25252A] focus:outline-none focus:border-[#7B1E2B]"
            />
          </div>

          {/* Spaced Repetition Toggle */}
          <div className="flex items-center gap-2 p-3 bg-[#F8F7F4] rounded-xl border border-[#D9D9D9]">
            <input
              type="checkbox"
              id="review-checkbox"
              checked={needsReview}
              onChange={(e) => setNeedsReview(e.target.checked)}
              className="w-4 h-4 text-[#7B1E2B] rounded border-[#D9D9D9]"
            />
            <label htmlFor="review-checkbox" className="text-xs font-bold text-[#25252A] cursor-pointer">
              Adicionar esta aula à lista de Revisão Espaçada para os próximos treinos
            </label>
          </div>

          {/* Success toast */}
          {practiceSavedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Registro de prática salvo com sucesso! Seu progresso está atualizado.</span>
            </div>
          )}

          {/* Save buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D9D9D9]">
            <button
              onClick={() => handleSavePractice('practicing')}
              className="px-5 py-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] font-bold text-xs sm:text-sm border border-[#D9D9D9] transition"
            >
              Salvar como "Em Prática"
            </button>

            <button
              onClick={() => handleSavePractice('mastered')}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] font-bold text-xs sm:text-sm shadow-xs transition"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Concluir por Autoavaliação</span>
            </button>
          </div>

          {/* Next lesson button */}
          {nextLesson && (
            <div className="mt-6 pt-6 border-t border-[#D9D9D9] flex items-center justify-between">
              <div className="text-xs text-[#666672]">
                Próxima aula da formação: <strong className="text-[#25252A]">{nextLesson.title}</strong>
              </div>
              <button
                onClick={() => onSelectLesson(nextLesson.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#F5E8EA] text-[#7B1E2B] font-bold text-xs sm:text-sm border border-[#D9D9D9] transition"
              >
                <span>Avançar para Próxima Aula</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Lesson, UserProgress } from '../../types';
import { InteractiveFretboard } from '../fretboard/InteractiveFretboard';
import { audioEngine } from '../../audio/audioEngine';
import { storageService } from '../../services/storageService';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Award,
  ChevronRight,
  Clock
} from 'lucide-react';

interface LessonViewerProps {
  lesson: Lesson;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  progress,
  onUpdateProgress,
  onSelectLesson,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [activeTabPart, setActiveTabPart] = useState<number>(0);

  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setActiveTabPart(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id]);

  const isCompleted = progress.completedLessons.includes(lesson.id);

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

    const updatedCompleted = isCompleted
      ? progress.completedLessons
      : [...progress.completedLessons, lesson.id];

    const updatedScores = {
      ...progress.quizScores,
      [lesson.id]: {
        score: scorePct,
        total: totalQuestions,
        date: new Date().toISOString(),
      },
    };

    const updated: UserProgress = {
      ...progress,
      completedLessons: updatedCompleted,
      quizScores: updatedScores,
      frequentErrors: errors,
      achievements: [
        ...progress.achievements,
        ...(lesson.id === 'lesson-1' && !progress.achievements.includes('first-lesson')
          ? ['first-lesson']
          : []),
      ],
    };

    if (scorePct >= 80) {
      audioEngine.playCompletionChime();
    }

    onUpdateProgress(updated);
    storageService.saveProgress(updated);
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const allLessons = CURRICULUM_LEVELS.flatMap((l) => l.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Lesson Hero Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Decorative tortoiseshell top accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge" />

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

      {/* Lesson Parts Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {lesson.parts.map((part, idx) => (
          <button
            key={part.id}
            onClick={() => setActiveTabPart(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
              activeTabPart === idx
                ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                : 'bg-white text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
            }`}
          >
            {part.title}
          </button>
        ))}

        {lesson.quiz && (
          <button
            onClick={() => setActiveTabPart(lesson.parts.length)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
              activeTabPart === lesson.parts.length
                ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                : 'bg-[#F5E8EA] text-[#7B1E2B] hover:bg-[#ebd3d6] border-[#E8D3D6]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#B52A3A]" />
            <span>Parte D — Exercício Prático</span>
          </button>
        )}
      </div>

      {/* Current Part Content Display */}
      {activeTabPart < lesson.parts.length && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
            <h2 className="text-xl font-bold text-[#25252A]">
              {lesson.parts[activeTabPart].title}
            </h2>
            <span className="text-xs text-[#666672] font-semibold">
              Passo {activeTabPart + 1} de {lesson.parts.length}
            </span>
          </div>

          {/* Interactive Audio Examples for Lesson 1 Part B */}
          {lesson.id === 'lesson-1' && activeTabPart === 1 && (
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
            {lesson.parts[activeTabPart].contentMarkdown.split('\n\n').map((paragraph, pIdx) => {
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
                  <pre key={pIdx} className="bg-[#1A1A20] p-4 rounded-xl text-xs sm:text-sm font-mono-code text-[#F8F7F4] overflow-x-auto border border-[#33333E]">
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

          {/* Integrated Interactive Fretboard in Part C of Lesson 1 */}
          {lesson.parts[activeTabPart].fretboardHighlight && (
            <div className="mt-6 pt-6 border-t border-[#D9D9D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#25252A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B52A3A]" />
                  Braço Interativo da Guitarra — As Seis Cordas Soltas
                </span>
                <span className="text-xs text-[#7B1E2B] font-bold">Casas 0 a 12</span>
              </div>
              <InteractiveFretboard
                maxFrets={12}
                highlightedFrets={lesson.parts[activeTabPart].fretboardHighlight?.frets}
                showAllNotes={false}
              />
            </div>
          )}

          {/* Navigation between parts */}
          <div className="flex items-center justify-between pt-6 border-t border-[#D9D9D9]">
            <button
              onClick={() => setActiveTabPart((prev) => Math.max(0, prev - 1))}
              disabled={activeTabPart === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTabPart === 0
                  ? 'opacity-40 cursor-not-allowed text-[#666672]'
                  : 'bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] border border-[#D9D9D9]'
              }`}
            >
              Anterior
            </button>

            <button
              onClick={() => setActiveTabPart((prev) => prev + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] text-xs sm:text-sm font-bold transition shadow-xs"
            >
              <span>{activeTabPart === lesson.parts.length - 1 ? 'Ir para o Exercício' : 'Próxima Parte'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz Section (Parte D) */}
      {activeTabPart === lesson.parts.length && lesson.quiz && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
            <div>
              <h2 className="text-xl font-bold text-[#25252A] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#7B1E2B]" />
                Parte D — Primeiro Exercício Interativo
              </h2>
              <p className="text-xs text-[#666672] mt-0.5 font-medium">
                Responda às 5 perguntas abaixo para validar seu aprendizado e registrar seu progresso.
              </p>
            </div>
            {quizSubmitted && (
              <button
                onClick={handleRetryQuiz}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold transition border border-[#D9D9D9]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Exercício</span>
              </button>
            )}
          </div>

          {/* Questions list */}
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

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selectedIdx === optIndex;
                      let optionClasses = 'bg-white text-[#25252A] border-[#D9D9D9] hover:bg-[#F5E8EA] hover:border-[#E8D3D6]';

                      if (isOptionSelected && !quizSubmitted) {
                        optionClasses = 'bg-[#F5E8EA] text-[#7B1E2B] border-[#7B1E2B] font-bold ring-2 ring-[#7B1E2B]/20';
                      }

                      if (quizSubmitted) {
                        if (optIndex === q.correctIndex) {
                          optionClasses = 'bg-emerald-100 text-emerald-900 border-emerald-500 font-bold';
                        } else if (isOptionSelected) {
                          optionClasses = 'bg-rose-100 text-rose-900 border-rose-500 line-through';
                        } else {
                          optionClasses = 'bg-white/60 text-[#666672]/60 border-[#D9D9D9]';
                        }
                      }

                      return (
                        <button
                          key={`opt-${optIndex}`}
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIndex === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {quizSubmitted && isOptionSelected && optIndex !== q.correctIndex && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Educational explanation */}
                  {quizSubmitted && (
                    <div
                      className={`mt-4 p-3.5 rounded-xl text-xs leading-relaxed flex items-start gap-2.5 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold block mb-0.5">
                          {isCorrect ? 'Correto!' : 'Explicação:'}
                        </span>
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#D9D9D9] flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setActiveTabPart(lesson.parts.length - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#666672] hover:text-[#25252A] bg-[#F8F7F4] border border-[#D9D9D9] transition"
            >
              Voltar ao Conteúdo
            </button>

            {!quizSubmitted ? (
              <button
                onClick={handleCompleteQuiz}
                disabled={Object.keys(selectedAnswers).length < lesson.quiz.questions.length}
                className={`px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                  Object.keys(selectedAnswers).length === lesson.quiz.questions.length
                    ? 'bg-[#7B1E2B] text-white hover:bg-[#B52A3A] shadow-xs active:scale-95'
                    : 'bg-[#D9D9D9] text-[#666672] cursor-not-allowed'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Confirmar Respostas</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {nextLesson && (
                  <button
                    onClick={() => onSelectLesson(nextLesson.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#7B1E2B] text-white font-bold text-xs sm:text-sm hover:bg-[#B52A3A] shadow-xs active:scale-95 transition"
                  >
                    <span>Avançar para a {nextLesson.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

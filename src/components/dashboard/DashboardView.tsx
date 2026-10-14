import React from 'react';
import { UserProgress, NavigationTab } from '../../types';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
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
  Volume2
} from 'lucide-react';

interface DashboardViewProps {
  progress: UserProgress;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  onNavigateTab,
  onSelectLesson,
}) => {
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Hero: Giannini 101 HSS White with Red Tortoiseshell Pickguard Accent */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#D9D9D9] p-6 sm:p-10 shadow-xs">
        {/* Subtle decorative tortoiseshell top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge" />

        {/* Faint guitar silhouette in the background */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none hidden md:block">
          <Guitar className="w-64 h-64 text-[#7B1E2B]" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E8EA] border border-[#E8D3D6] text-[#7B1E2B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Trilha de Formação Musical • Guitar Academy</span>
          </div>

          <div>
            <span className="text-xs text-[#666672] font-semibold uppercase tracking-wider block">
              {currentLesson.moduleTitle}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#25252A] mt-1 leading-tight tracking-tight">
              {currentLesson.title}
            </h1>
            <p className="text-sm sm:text-base text-[#666672] mt-2 font-medium">
              {currentLesson.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => onSelectLesson(currentLesson.id)}
              className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] active:scale-95 font-bold text-sm sm:text-base shadow-sm transition"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Continuar Estudando</span>
            </button>

            <button
              onClick={() => onNavigateTab('curriculum')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] font-bold text-xs sm:text-sm border border-[#D9D9D9] transition"
            >
              <BookOpen className="w-4 h-4 text-[#7B1E2B]" />
              <span>Ver Trilha Completa (6 Níveis)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar: Study Time, Completed Lessons, Daily Goal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] flex items-center justify-center text-[#7B1E2B] border border-[#E8D3D6]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#666672] uppercase font-bold block">Tempo de Estudo</span>
            <span className="text-base sm:text-lg font-black text-[#25252A] font-mono-code">
              {hours > 0 ? `${hours}h ` : ''}{minutes}m
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#666672] uppercase font-bold block">Aulas Concluídas</span>
            <span className="text-base sm:text-lg font-black text-[#25252A] font-mono-code">
              {completedCount} <span className="text-xs font-normal text-[#666672]">/ {allLessons.length}</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] flex items-center justify-center text-[#B52A3A] border border-[#E8D3D6]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#666672] uppercase font-bold block">Rotina Hoje</span>
            <span className="text-base sm:text-lg font-black text-[#25252A] font-mono-code">
              {Math.floor(progress.todayStudyTimeSeconds / 60)} <span className="text-xs font-normal text-[#666672]">/ {progress.dailyGoalMinutes}m</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8F7F4] flex items-center justify-center text-[#7B1E2B] border border-[#D9D9D9]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#666672] uppercase font-bold block">Progresso Geral</span>
            <span className="text-base sm:text-lg font-black text-[#7B1E2B] font-mono-code">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Launch Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
};

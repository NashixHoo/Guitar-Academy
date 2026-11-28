import React from 'react';
import { UserProgress } from '../../types';
import { VIOLAO_LESSONS } from '../../data/violaoCourse';
import { SOLO_LESSONS } from '../../data/soloCourse';
import { BASS_LESSONS } from '../../data/bassCourse';
import { KEYBOARD_LESSONS } from '../../data/keyboardCourse';
import { DRUMS_LESSONS } from '../../data/drumsCourse';
import { BookOpen, Award, CheckCircle, ArrowRight, Music, PlayCircle, Star } from 'lucide-react';

interface CoursesViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onSelectInstrument: (instrumentId: 'violao' | 'guitarra' | 'baixo' | 'teclado' | 'bateria') => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  progress,
  onUpdateProgress,
  onSelectInstrument,
}) => {
  const instruments = [
    {
      id: 'violao' as const,
      name: 'Violão Acústico & Popular',
      subtitle: 'Fingerstyle, Ritmos Brasileiros & Acordes',
      lessons: VIOLAO_LESSONS,
      color: 'from-amber-600 to-amber-800',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: '🎸',
      description: 'Domine o violão do zero ao avançado com técnicas de dedilhado, batidas populares e repertório nacional.'
    },
    {
      id: 'guitarra' as const,
      name: 'Guitarra Solo & Rock',
      subtitle: 'Pentatônicas, Modos Gregos & Improvisação',
      lessons: SOLO_LESSONS,
      color: 'from-purple-600 to-indigo-800',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: '⚡',
      description: 'Aprenda solos icônicos, bends, sweeping, técnicas de alta performance e linguagem moderna de guitarra.'
    },
    {
      id: 'baixo' as const,
      name: 'Contrabaixo Groove & Bassline',
      subtitle: 'Slap, Walking Bass & Fundamentos do Groove',
      lessons: BASS_LESSONS,
      color: 'from-blue-600 to-cyan-800',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: '🎸',
      description: 'Construa linhas de baixo magnéticas, domine o tempo, groove, slap e sustentação rítmica impecável.'
    },
    {
      id: 'teclado' as const,
      name: 'Teclado & Piano Popular',
      subtitle: 'Harmonia, Vozes, Acordes & Acompanhamento',
      lessons: KEYBOARD_LESSONS,
      color: 'from-emerald-600 to-teal-800',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: '🎹',
      description: 'Aprenda leitura de cifras, inversões de acordes, vozes de piano e condução harmônica profissional.'
    },
    {
      id: 'bateria' as const,
      name: 'Bateria & Ritmo Aplicado',
      subtitle: 'Independência, Viradas, Groove & Dinâmica',
      lessons: DRUMS_LESSONS,
      color: 'from-rose-600 to-red-800',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: '🥁',
      description: 'Desenvolva coordenação motora, independência dos membros, viradas marcantes e precisão rítmica.'
    },
  ];

  const primaryId = progress.primaryCourseId || 'violao';

  const handleSetPrimary = (id: 'violao' | 'guitarra' | 'baixo' | 'teclado' | 'bateria') => {
    onUpdateProgress({
      ...progress,
      primaryCourseId: id,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Music className="w-3.5 h-3.5" />
            Master Curriculum 300
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Seus Cursos & Instrumentos
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            O Guitar Academy oferece 5 cursos completos com 60 aulas estruturadas em 10 módulos para cada instrumento. Escolha seu curso principal ou explore qualquer trilha a qualquer momento.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instruments.map((inst) => {
          const isPrimary = primaryId === inst.id;
          const completedLessonsCount = (progress.completedLessons || []).filter(id => 
            inst.lessons.some(l => l.id === id)
          ).length;
          const totalLessons = inst.lessons.length;
          const percent = Math.round((completedLessonsCount / totalLessons) * 100);

          return (
            <div
              key={inst.id}
              className={`bg-slate-900/80 backdrop-blur-xl border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-indigo-500/40 relative group ${
                isPrimary ? 'border-indigo-500 shadow-indigo-500/10 ring-2 ring-indigo-500/20' : 'border-slate-800'
              }`}
            >
              {isPrimary && (
                <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Curso Principal
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                    {inst.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${inst.badgeColor}`}>
                    60 Aulas • 10 Módulos
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-indigo-300 font-medium mt-0.5">
                    {inst.subtitle}
                  </p>
                </div>

                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                  {inst.description}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Progresso do Curso</span>
                    <span className="text-indigo-400">{completedLessonsCount} / {totalLessons} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectInstrument(inst.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Acessar Trilha
                  </button>
                  {!isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(inst.id)}
                      title="Definir como curso principal"
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

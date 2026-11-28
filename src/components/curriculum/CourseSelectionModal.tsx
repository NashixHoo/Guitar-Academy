import React from 'react';
import { OfficialCourseId, enrollPrimaryCourse } from '../../academia/progress/unlockGate';
import { COURSE_TRACK_VISUALS } from '../../data/visualGallery';
import { Guitar, Music, Disc, Grid, Activity, Sparkles, Check, ArrowRight } from 'lucide-react';
import { UserProgress } from '../../types';
import { storageService } from '../../services/storageService';

interface CourseSelectionModalProps {
  isOpen: boolean;
  onSelectCourse: (courseId: OfficialCourseId) => void;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  isMandatory?: boolean;
}

export const CourseSelectionModal: React.FC<CourseSelectionModalProps> = ({
  isOpen,
  onSelectCourse,
  progress,
  onUpdateProgress,
  isMandatory = false,
}) => {
  if (!isOpen) return null;

  const instruments: Array<{
    id: OfficialCourseId;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
    badge: string;
  }> = [
    {
      id: 'violao',
      title: 'Violão',
      subtitle: 'Nylon e Aço',
      description: 'Postura ergonômica, acordes abertos, pestanas, dedilhados clássicos e ritmos brasileiros.',
      icon: Music,
      badge: '60 Aulas'
    },
    {
      id: 'guitarra',
      title: 'Guitarra',
      subtitle: 'Elétrica & Solos',
      description: 'Técnica mecânica, palhetada alternada, pentatônicas, sistema CAGED, modos e solos expressivos.',
      icon: Guitar,
      badge: '60 Aulas'
    },
    {
      id: 'baixo',
      title: 'Contrabaixo',
      subtitle: 'Elétrico de 4 Cordas',
      description: 'Sustentação harmônica, pizzicato, groove, walking bass, arpejos e slap & pop.',
      icon: Disc,
      badge: '60 Aulas'
    },
    {
      id: 'teclado',
      title: 'Teclado / Piano',
      subtitle: 'Complementar & Voicings',
      description: 'Geografia das teclas, dedilhado funcional, tríades, inversões, campo harmônico e voicings.',
      icon: Grid,
      badge: '60 Aulas'
    },
    {
      id: 'bateria',
      title: 'Bateria',
      subtitle: 'Prática Rítmica',
      description: 'Postura do kit, rudimentos essenciais, independência motora, levadas e compassos.',
      icon: Activity,
      badge: '60 Aulas'
    }
  ];

  const handlePick = (courseId: OfficialCourseId) => {
    const res = enrollPrimaryCourse(progress, courseId);
    storageService.saveProgress(res.progress);
    onUpdateProgress(res.progress);
    onSelectCourse(courseId);
  };

  const currentSelected = progress.primaryCourseId || 'violao';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge" />

        <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81]">
            <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Bem-vindo ao Conservatório</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#25252A] dark:text-[#F8F7F4]">
            Escolha seu Instrumento Principal
          </h2>
          <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0]">
            Selecione por onde deseja começar sua formação de 300 aulas. Você poderá explorar e estudar todos os outros instrumentos a qualquer momento na aba <strong>Meus Cursos</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-1 pb-2">
          {instruments.map((inst) => {
            const Icon = inst.icon;
            const isSelected = currentSelected === inst.id;
            const visual = COURSE_TRACK_VISUALS[inst.id === 'guitarra' ? 'canonical' : inst.id];

            return (
              <div
                key={inst.id}
                onClick={() => handlePick(inst.id)}
                className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all flex flex-col justify-between p-4 ${
                  isSelected
                    ? 'bg-[#F5E8EA] dark:bg-[#3A1E24] border-[#7B1E2B] dark:border-[#FF6B81] ring-2 ring-[#7B1E2B]/30 shadow-md'
                    : 'bg-[#F8F7F4] hover:bg-white dark:bg-[#22141A] dark:hover:bg-[#2E1B23] border-[#E8E6E1] dark:border-[#422933]'
                }`}
              >
                {visual && (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3">
                    <img
                      src={visual.src}
                      alt={visual.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-black/60 text-[#F5C542] backdrop-blur-xs">
                      {inst.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#7B1E2B]/10 dark:bg-[#FF6B81]/10 flex items-center justify-center text-[#7B1E2B] dark:text-[#FF6B81]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-display font-bold text-base text-[#25252A] dark:text-[#F8F7F4]">
                        {inst.title}
                      </h3>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-[#7B1E2B] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono-code font-bold text-[#7B1E2B] dark:text-[#FF6B81] block">
                    {inst.subtitle}
                  </span>

                  <p className="text-xs text-[#666672] dark:text-[#B8B3C0] line-clamp-3 leading-relaxed">
                    {inst.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
                  <span>{isSelected ? 'Curso Principal Ativo' : 'Selecionar Curso'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {!isMandatory && (
          <div className="mt-4 text-center">
            <button
              onClick={() => onSelectCourse(currentSelected)}
              className="px-6 py-2.5 rounded-xl bg-[#25252A] dark:bg-[#381A25] text-white font-bold text-xs hover:bg-[#7B1E2B] transition"
            >
              Continuar com {currentSelected.toUpperCase()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

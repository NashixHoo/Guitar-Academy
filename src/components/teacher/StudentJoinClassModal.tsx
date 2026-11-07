import React, { useState } from 'react';
import { TeacherService } from '../../services/teacherService';
import { X, KeyRound, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface StudentJoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  studentPhotoUrl?: string;
  onJoined: (className: string) => void;
}

export const StudentJoinClassModal: React.FC<StudentJoinClassModalProps> = ({
  isOpen,
  onClose,
  studentUid,
  studentName,
  studentEmail,
  studentPhotoUrl,
  onJoined,
}) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setFeedback({ type: 'error', text: 'Por favor, digite o código de convite fornecido pelo seu professor.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await TeacherService.joinClassWithInviteCode(
        studentUid,
        studentName,
        studentEmail,
        inviteCode,
        studentPhotoUrl
      );
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        if (res.classGroup) {
          onJoined(res.classGroup.name);
        }
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erro ao conectar à turma. Verifique sua conexão e tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-class-title"
    >
      <div 
        className="relative w-full max-w-md bg-[#FAF9F6] dark:bg-[#1A1216] rounded-2xl border border-[#E8E6E1] dark:border-[#422933] shadow-2xl p-6 sm:p-7 text-[#25252A] dark:text-[#F8F7F4]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] hover:text-[#7B1E2B] dark:hover:text-[#FF6B81] transition focus:outline-hidden"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] flex items-center justify-center border border-[#7B1E2B]/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono-code font-bold text-[#C5A059] uppercase tracking-wider block">
              INGRESSO EM TURMA PEDAGÓGICA
            </span>
            <h2 id="join-class-title" className="font-display text-lg font-black text-[#1F1F24] dark:text-[#F8F7F4]">
              Vincular ao seu Professor
            </h2>
          </div>
        </div>

        <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mb-5 leading-relaxed">
          Digite o código de convite da sua turma (ex: <strong>GA-TURMA-101</strong>) para que seu professor possa acompanhar sua frequência e evolução musical.
        </p>

        {feedback && (
          <div
            className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold block mb-1">Código da Turma</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Ex: GA-TURMA-101"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#251820] border border-[#D9D9D9] dark:border-[#422933] text-sm text-[#1F1F24] dark:text-[#F8F7F4] font-mono-code tracking-wider focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30 uppercase"
            />
          </div>

          <div className="p-3 rounded-xl bg-white/70 dark:bg-[#251820]/70 border border-[#E8E6E1] dark:border-[#422933] text-[11px] text-[#666672] dark:text-[#B8B3C0] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Seus dados continuam isolados. Outros alunos da turma nunca têm acesso aos seus estudos.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-[#666672] hover:bg-[#E8E6E1] dark:hover:bg-[#381A25] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl luxury-btn-primary text-white text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Vinculando...' : 'Entrar na Turma'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

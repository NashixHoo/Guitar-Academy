import React, { useState, useEffect } from 'react';
import { TeacherService, formatClassInstrumentLabel } from '../../services/teacherService';
import { ClassGroup } from '../../types/teacher';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Guitar,
  UserCheck,
  Users,
  Calendar,
  ClipboardPaste,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface StudentJoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  studentPhotoUrl?: string;
  onJoined: (className: string, classGroup?: ClassGroup) => void | Promise<void>;
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
  const [step, setStep] = useState<'enter_code' | 'confirm_class' | 'joined'>('enter_code');
  const [previewClass, setPreviewClass] = useState<ClassGroup | null>(null);
  const [previewStudentCount, setPreviewStudentCount] = useState<number | undefined>(undefined);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setInviteCode('');
      setStep('enter_code');
      setPreviewClass(null);
      setPreviewStudentCount(undefined);
      setIsValidating(false);
      setIsSubmitting(false);
      setFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasteCode = async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInviteCode(text.trim().toUpperCase());
          setFeedback(null);
          return;
        }
      }
      setFeedback({
        type: 'error',
        text: 'Cole o código diretamente no campo abaixo usando Ctrl+V ou toque longo.',
      });
    } catch {
      setFeedback({
        type: 'error',
        text: 'Seu navegador bloqueou a leitura automática da área de transferência. Cole manualmente no campo.',
      });
    }
  };

  const handleValidateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inviteCode.trim().toUpperCase();
    if (!trimmed) {
      setFeedback({
        type: 'error',
        text: 'Digite ou cole o código de convite fornecido pelo seu professor.',
      });
      return;
    }

    setIsValidating(true);
    setFeedback(null);

    try {
      const validation = await TeacherService.validateInviteCode(trimmed, studentUid);
      if (validation.valid && validation.classGroup) {
        setPreviewClass(validation.classGroup);
        setPreviewStudentCount(validation.currentStudentCount);
        setStep('confirm_class');
      } else {
        setFeedback({
          type: 'error',
          text: validation.message || 'Código de convite inválido ou indisponível.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Erro ao validar o código no Firebase. Verifique sua conexão e tente novamente.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmJoin = async () => {
    if (!previewClass) return;

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await TeacherService.joinClassWithInviteCode(
        studentUid,
        studentName,
        studentEmail,
        previewClass.code || inviteCode,
        studentPhotoUrl
      );
      if (res.success) {
        const confirmedClass = res.classGroup || previewClass;
        setPreviewClass(confirmedClass);
        setStep('joined');
        setFeedback({ type: 'success', text: res.message });
        await Promise.resolve(onJoined(confirmedClass.name, confirmedClass));
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Erro ao registrar matrícula na turma. Verifique sua conexão e tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const instrumentDisplay = previewClass
    ? formatClassInstrumentLabel(previewClass.courseId, previewClass.instrument)
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-class-title"
    >
      <div className="relative w-full max-w-md bg-[#FAF9F6] dark:bg-[#1A1216] rounded-2xl border border-[#E8E6E1] dark:border-[#422933] shadow-2xl p-5 sm:p-7 text-[#25252A] dark:text-[#F8F7F4] max-h-[92dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-xl text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] hover:text-[#7B1E2B] dark:hover:text-[#FF6B81] transition focus:outline-hidden cursor-pointer"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] flex items-center justify-center border border-[#7B1E2B]/20 shrink-0">
            <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono-code font-bold text-[#C5A059] uppercase tracking-wider block">
              INGRESSO EM TURMA OFICIAL
            </span>
            <h2
              id="join-class-title"
              className="font-display text-lg font-black text-[#1F1F24] dark:text-[#F8F7F4] leading-tight"
            >
              Entrar em uma turma
            </h2>
          </div>
        </div>

        {feedback && (
          <div
            className={`mb-4 p-3 rounded-xl border text-xs flex items-start gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            )}
            <span className="leading-relaxed">{feedback.text}</span>
          </div>
        )}

        {/* ETAPA 1: Digitar ou colar o código */}
        {step === 'enter_code' && (
          <form onSubmit={handleValidateInvite} className="space-y-4">
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
              Digite ou cole o código de convite enviado pelo seu professor ou administrador (ex:{' '}
              <strong>GA-2026A</strong>) para localizar a turma e confirmar sua matrícula.
            </p>

            <div>
              <label
                htmlFor="invite-code-input"
                className="text-xs font-bold block mb-1.5 text-[#1F1F24] dark:text-[#F8F7F4]"
              >
                Código da turma
              </label>
              <div className="flex items-stretch gap-2">
                <input
                  id="invite-code-input"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value.toUpperCase());
                    if (feedback) setFeedback(null);
                  }}
                  placeholder="Ex: GA-2026A"
                  className="flex-1 min-w-0 px-3.5 py-3 rounded-xl bg-white dark:bg-[#251820] border border-[#D9D9D9] dark:border-[#422933] text-sm sm:text-base text-[#1F1F24] dark:text-[#F8F7F4] font-mono-code tracking-wider focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30 uppercase"
                />
                <button
                  type="button"
                  onClick={handlePasteCode}
                  className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#251820] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] border border-[#D9D9D9] dark:border-[#422933] text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                  title="Colar código copiado"
                >
                  <ClipboardPaste className="w-4 h-4" />
                  <span className="hidden xs:inline">Colar</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-[#251820]/80 border border-[#E8E6E1] dark:border-[#422933] text-[11px] text-[#666672] dark:text-[#B8B3C0] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>
                Sua matrícula é vinculada com segurança exclusivamente à sua conta autenticada. Outros alunos nunca veem seus dados.
              </span>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#666672] hover:bg-[#E8E6E1] dark:hover:bg-[#381A25] transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isValidating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl luxury-btn-primary text-white text-xs sm:text-sm font-bold transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validando código...</span>
                  </>
                ) : (
                  <span>Entrar na turma</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ETAPA 2: Prévia com detalhes reais da turma antes da confirmação */}
        {step === 'confirm_class' && previewClass && (
          <div className="space-y-4">
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
              Turma localizada no Firebase! Confira os dados abaixo antes de confirmar sua matrícula:
            </p>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#251820] border border-[#C5A059]/40 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#E8E6E1] dark:border-[#422933]">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#C5A059] block">
                    Turma Confirmada
                  </span>
                  <h3 className="text-base font-black text-[#1F1F24] dark:text-[#F8F7F4] leading-snug mt-0.5">
                    {previewClass.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#FAF1F2] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8D3D6] dark:border-[#522536] font-mono-code font-bold text-[11px] shrink-0">
                  {previewClass.code}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF4E6] dark:bg-[#332211] text-[#8C5F18] dark:text-[#F3D17A] flex items-center justify-center shrink-0">
                    <Guitar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#666672] dark:text-[#B8B3C0] block">
                      Instrumento / Formação
                    </span>
                    <span className="font-bold text-[#1F1F24] dark:text-[#F8F7F4]">
                      {instrumentDisplay}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#666672] dark:text-[#B8B3C0] block">
                      Professor Responsável
                    </span>
                    <span className="font-bold text-[#1F1F24] dark:text-[#F8F7F4] truncate block">
                      {previewClass.teacherName}
                    </span>
                  </div>
                </div>

                {previewClass.description && (
                  <p className="text-xs text-[#4D4D54] dark:text-[#B8B3C0] bg-[#F8F7F4] dark:bg-[#1A1216] p-2.5 rounded-xl border border-[#E8E6E1] dark:border-[#422933] leading-relaxed">
                    {previewClass.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#666672] dark:text-[#B8B3C0] pt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>
                      {typeof previewStudentCount === 'number' && typeof previewClass.maxStudents === 'number'
                        ? `${previewStudentCount}/${previewClass.maxStudents} alunos`
                        : previewClass.maxStudents
                        ? `Limite de ${previewClass.maxStudents} vagas`
                        : 'Turma aberta'}
                    </span>
                  </span>

                  {previewClass.expiresAt && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>
                        Convite válido até {new Date(previewClass.expiresAt).toLocaleDateString('pt-BR')}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setStep('enter_code');
                  setPreviewClass(null);
                  setFeedback(null);
                }}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#666672] dark:text-[#B8B3C0] hover:bg-[#E8E6E1] dark:hover:bg-[#381A25] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Alterar código</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmJoin}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl luxury-btn-primary text-white text-xs sm:text-sm font-bold transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirmando matrícula...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar entrada na turma</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: Confirmação final */}
        {step === 'joined' && previewClass && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Matrícula confirmada!</span>
              </div>
              <p className="text-xs text-emerald-900/80 dark:text-emerald-200/90 leading-relaxed">
                Você agora faz parte da turma <strong>{previewClass.name}</strong> ({instrumentDisplay}) com{' '}
                <strong>{previewClass.teacherName}</strong>. Suas informações de matrícula já foram atualizadas.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl luxury-btn-primary text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

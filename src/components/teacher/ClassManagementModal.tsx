import React, { useState } from 'react';
import { ClassGroup } from '../../types/teacher';
import { TeacherService } from '../../services/teacherService';
import { X, Users, Plus, Copy, Check, ShieldCheck, KeyRound } from 'lucide-react';

interface ClassManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassGroup[];
  teacherId: string;
  teacherEmail: string;
  teacherName: string;
  onClassCreated: (newClass: ClassGroup) => void;
}

export const ClassManagementModal: React.FC<ClassManagementModalProps> = ({
  isOpen,
  onClose,
  classes,
  teacherId,
  teacherEmail,
  teacherName,
  onClassCreated,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      setErrorMsg('Informe o nome da turma.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const created = await TeacherService.createClass(
        teacherId,
        teacherEmail,
        teacherName,
        className,
        classDescription,
        customCode
      );
      onClassCreated(created);
      setClassName('');
      setClassDescription('');
      setCustomCode('');
      setShowCreateForm(false);
    } catch {
      setErrorMsg('Falha ao criar turma. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="class-mgmt-title"
    >
      <div 
        className="relative w-full max-w-xl bg-[#FAF9F6] dark:bg-[#1A1216] rounded-2xl border border-[#E8E6E1] dark:border-[#422933] shadow-2xl p-6 sm:p-7 text-[#25252A] dark:text-[#F8F7F4] max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] hover:text-[#7B1E2B] dark:hover:text-[#FF6B81] transition focus:outline-hidden"
          aria-label="Fechar janela de turmas"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#7B1E2B] text-white flex items-center justify-center border border-[#C5A059]/40 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono-code font-bold text-[#C5A059] uppercase tracking-wider block">
              GESTÃO DE TURMAS & CONVITES
            </span>
            <h2 id="class-mgmt-title" className="font-display text-xl font-black text-[#1F1F24] dark:text-[#F8F7F4]">
              Turmas sob sua Responsabilidade
            </h2>
          </div>
        </div>

        {/* Lista de Turmas */}
        <div className="space-y-3 mb-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-4 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] flex flex-wrap items-center justify-between gap-3 shadow-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4] truncate">
                    {cls.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                    Ativa
                  </span>
                </div>
                {cls.description && (
                  <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-0.5 truncate">
                    {cls.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-[#666672] dark:text-[#B8B3C0]">Código de Convite:</span>
                  <span className="font-mono-code font-bold text-xs px-2 py-0.5 rounded-md bg-[#FAF1F2] text-[#7B1E2B] border border-[#E8D3D6] dark:bg-[#381A25] dark:text-[#FF6B81] dark:border-[#522536]">
                    {cls.code}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCopyCode(cls.code)}
                className="px-3 py-1.5 rounded-xl bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8E6E1] dark:border-[#422933] text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Copiar código de convite para os alunos"
              >
                {copiedCode === cls.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span className="text-[#16A34A]">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Formulário de Criação de Turma */}
        {showCreateForm ? (
          <form onSubmit={handleCreate} className="p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#20151C] border border-[#E8E6E1] dark:border-[#422933] space-y-3 mb-4">
            <h4 className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4]">Criar Nova Turma</h4>
            {errorMsg && <p className="text-xs text-[#B52A3A] font-medium">{errorMsg}</p>}
            <div>
              <label className="text-xs font-bold block mb-1">Nome da Turma</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ex: Turma Avançada de Violão Fingerstyle"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1216] border border-[#D9D9D9] dark:border-[#422933] text-xs text-[#1F1F24] dark:text-[#F8F7F4] focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Descrição Pedagógica (Opcional)</label>
              <input
                type="text"
                value={classDescription}
                onChange={(e) => setClassDescription(e.target.value)}
                placeholder="Ex: Foco em harmonia moderna, tríades abertas e arpejos"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1216] border border-[#D9D9D9] dark:border-[#422933] text-xs text-[#1F1F24] dark:text-[#F8F7F4] focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Código de Convite Personalizado (Opcional)</label>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                placeholder="Ex: GA-FINGER-2026 (deixe vazio para gerar automaticamente)"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1216] border border-[#D9D9D9] dark:border-[#422933] text-xs text-[#1F1F24] dark:text-[#F8F7F4] font-mono-code focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-[#666672] hover:bg-[#E8E6E1] dark:hover:bg-[#381A25] transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-xl luxury-btn-primary text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Criando...' : 'Salvar Turma'}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-[#C5A059] text-[#7B1E2B] dark:text-[#FF6B81] hover:bg-[#FAF1F2] dark:hover:bg-[#281A22] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer mb-6"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Nova Turma</span>
          </button>
        )}

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] text-xs text-[#666672] dark:text-[#B8B3C0] flex items-start gap-2.5">
          <KeyRound className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
          <span>
            <strong>Como funciona o vínculo seguro:</strong> Compartilhe o código da turma com os alunos. Eles digitam o código em seus perfis para ingressar na turma. Nenhum aluno tem acesso aos dados de outros alunos; somente o professor tem a visão analítica coletiva.
          </span>
        </div>
      </div>
    </div>
  );
};

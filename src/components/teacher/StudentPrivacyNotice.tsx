import React from 'react';
import { Shield, Eye, Lock, FileCheck, CheckCircle2, X } from 'lucide-react';

interface StudentPrivacyNoticeProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const StudentPrivacyNotice: React.FC<StudentPrivacyNoticeProps> = ({
  isOpen,
  onClose,
}) => {
  if (isOpen === false) return null;

  const content = (
    <div className="bg-white dark:bg-[#1A1216] border border-[#D9D9D9] dark:border-[#422933] rounded-2xl p-6 shadow-xs space-y-5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] flex items-center justify-center border border-[#7B1E2B]/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code font-bold text-[#C5A059] uppercase tracking-wider block">
              CONFORMIDADE LGPD & TRANSPARÊNCIA
            </span>
            <h3 className="font-display text-base font-bold text-[#1F1F24] dark:text-[#F8F7F4]">
              Privacidade dos Dados de Aprendizagem do Estudante
            </h3>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5F5F5] dark:hover:bg-[#251820] transition"
            aria-label="Fechar aviso de privacidade"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
        No Guitar Academy, a privacidade e a clareza didática são princípios fundamentais. O acompanhamento realizado pelo seu professor responsável possui finalidade exclusivamente pedagógica, visando orientar seu ritmo de estudo, identificar dificuldades técnicas e aprimorar a metodologia de ensino.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
            <Eye className="w-4 h-4 shrink-0" />
            <span>O que o Professor Visualiza</span>
          </div>
          <ul className="text-[11px] text-[#666672] dark:text-[#B8B3C0] space-y-1 list-disc pl-4 leading-relaxed">
            <li>Aulas concluídas e em andamento</li>
            <li>Tempo total de prática e sessões com metrônomo</li>
            <li>Andamento máximo praticado (BPM)</li>
            <li>Habilidades demonstradas em exercícios práticos</li>
            <li>Frequência semanal de estudo</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059]">
            <Lock className="w-4 h-4 shrink-0" />
            <span>O que Permanece 100% Privado</span>
          </div>
          <ul className="text-[11px] text-[#666672] dark:text-[#B8B3C0] space-y-1 list-disc pl-4 leading-relaxed">
            <li>Anotações pessoais marcadas como privadas</li>
            <li>Senhas, credenciais ou tokens de acesso</li>
            <li>Áudios brutos gravados no microfone (processados localmente no navegador)</li>
            <li>Nenhum dado é compartilhado com outros alunos</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#16A34A] dark:text-[#4ADE80]">
            <FileCheck className="w-4 h-4 shrink-0" />
            <span>Seus Direitos (LGPD)</span>
          </div>
          <ul className="text-[11px] text-[#666672] dark:text-[#B8B3C0] space-y-1 list-disc pl-4 leading-relaxed">
            <li>Direito a exportar backup completo dos seus dados em JSON</li>
            <li>Direito a solicitar exclusão ou desvinculação da turma a qualquer momento</li>
            <li>Minimização de coleta: coletamos apenas dados necessários para a educação musical</li>
          </ul>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-[#FAF1F2] dark:bg-[#2A1822] border border-[#E8D3D6] dark:border-[#422933] flex items-center gap-2 text-xs text-[#7B1E2B] dark:text-[#FF8095]">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>Garantia de Isolamento: Outros alunos matriculados na mesma turma nunca têm acesso aos seus dados ou histórico.</span>
      </div>
    </div>
  );

  if (isOpen !== undefined) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-label="Aviso de Privacidade e LGPD"
      >
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

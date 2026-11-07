import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Database, PlusCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface LegacyDataModalProps {
  isOpen: boolean;
  onChoiceMade: () => void;
}

export const LegacyDataModal: React.FC<LegacyDataModalProps> = ({ isOpen, onChoiceMade }) => {
  const { user, handleLegacyChoice } = useAuth();

  if (!isOpen || !user) return null;

  const onImport = async () => {
    await handleLegacyChoice('import');
    onChoiceMade();
  };

  const onFresh = async () => {
    await handleLegacyChoice('fresh');
    onChoiceMade();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legacy-modal-title"
    >
      <div 
        className="relative w-full max-w-lg bg-[#FAF9F6] dark:bg-[#1A1216] rounded-2xl border border-[#C5A059]/40 shadow-2xl p-6 sm:p-7 text-[#25252A] dark:text-[#F8F7F4]"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] flex items-center justify-center border border-[#7B1E2B]/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono-code font-bold text-[#C5A059] uppercase tracking-wider block">
              CONFIGURAÇÃO DE PERFIL INICIAL
            </span>
            <h2 id="legacy-modal-title" className="font-display text-lg sm:text-xl font-black text-[#1F1F24] dark:text-[#F8F7F4]">
              Estudos Anteriores Detectados
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] leading-relaxed mb-5">
          Identificamos um histórico de aulas e práticas registrado anteriormente neste navegador. Como o Guitar Academy é compartilhado por múltiplos estudantes, escolha como deseja iniciar seus estudos com a conta <strong>{user.email}</strong>:
        </p>

        <div className="space-y-3 mb-6">
          {/* Opção 1: Vincular dados anteriores */}
          <button
            onClick={onImport}
            className="w-full text-left p-4 rounded-xl border border-[#C5A059]/50 bg-white/80 dark:bg-[#251820]/80 hover:bg-[#F5E8EA]/50 dark:hover:bg-[#381A25]/50 transition shadow-xs group cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4] block mb-1">
                  Vincular histórico anterior à minha conta
                </span>
                <span className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
                  Importa as aulas já concluídas e minutos de estudo anteriores deste dispositivo para a sua conta Google individual na nuvem.
                </span>
              </div>
            </div>
          </button>

          {/* Opção 2: Começar do zero */}
          <button
            onClick={onFresh}
            className="w-full text-left p-4 rounded-xl border border-[#E8E6E1] dark:border-[#422933] bg-white/40 dark:bg-[#20151C]/40 hover:bg-[#F8F7F4] dark:hover:bg-[#281A22] transition shadow-xs group cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <PlusCircle className="w-5 h-5 text-[#7B1E2B] dark:text-[#FF6B81] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4] block mb-1">
                  Iniciar novo conservatório do zero
                </span>
                <span className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
                  Cria um ambiente de estudos 100% individual e limpo para você, começando da Aula 1, sem alterar o histórico de outros estudantes.
                </span>
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#666672] dark:text-[#B8B3C0] border-t border-[#E8E6E1] dark:border-[#422933] pt-4">
          <HelpCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span>Uma cópia de segurança dos dados locais foi arquivada automaticamente por precaução.</span>
        </div>
      </div>
    </div>
  );
};

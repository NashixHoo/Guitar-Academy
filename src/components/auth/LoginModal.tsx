import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, ShieldCheck, Cloud, AlertCircle, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, authError, clearAuthError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    clearAuthError();
    try {
      await signInWithGoogle();
      onClose();
    } catch {
      // O erro amigável já é tratado e disponibilizado pelo AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div 
        className="relative w-full max-w-md bg-[#FAF9F6] dark:bg-[#1A1216] rounded-2xl border border-[#E8E6E1] dark:border-[#422933] shadow-2xl p-6 sm:p-7 overflow-hidden text-[#25252A] dark:text-[#F8F7F4]"
      >
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] hover:text-[#7B1E2B] dark:hover:text-[#FF6B81] transition focus:outline-hidden"
          aria-label="Fechar janela de login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho da Marca */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#22141A] border border-[#C5A059]/50 flex items-center justify-center shadow-md p-2 mb-3.5 tortoiseshell-card">
            <img src="./icon.svg" alt="Guitar Academy" className="w-full h-full object-contain" />
          </div>
          <span className="font-mono-code text-[11px] font-bold text-[#C5A059] tracking-widest uppercase mb-1">
            CONTA PESSOAL DE ESTUDOS
          </span>
          <h2 id="login-modal-title" className="font-display text-xl sm:text-2xl font-black text-[#1F1F24] dark:text-[#F8F7F4] tracking-tight">
            Guitar Academy Cloud
          </h2>
          <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1.5 max-w-xs leading-relaxed">
            Tenha seu próprio ambiente de estudos, preserve sua evolução individual e sincronize entre todos os seus dispositivos.
          </p>
        </div>

        {/* Alerta de Erro se houver */}
        {authError && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#FFF0F2] dark:bg-[#3A141A] border border-[#B52A3A]/30 text-[#7B1E2B] dark:text-[#FF8095] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B52A3A]" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">Aviso de Acesso</span>
              <span>{authError}</span>
            </div>
          </div>
        )}

        {/* Benefícios da Conta Individual */}
        <div className="space-y-2.5 mb-6 text-xs text-[#52525B] dark:text-[#D4D4D8]">
          <div className="flex items-center gap-2.5 bg-white/70 dark:bg-[#251820]/70 p-2.5 rounded-xl border border-[#E8E6E1]/60 dark:border-[#422933]/60">
            <ShieldCheck className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81] shrink-0" />
            <span><strong>Isolamento Total:</strong> seus dados não se misturam com outros usuários deste dispositivo.</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/70 dark:bg-[#251820]/70 p-2.5 rounded-xl border border-[#E8E6E1]/60 dark:border-[#422933]/60">
            <Cloud className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span><strong>Nuvem Automática:</strong> acesse seus estudos no celular, tablet e computador.</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/70 dark:bg-[#251820]/70 p-2.5 rounded-xl border border-[#E8E6E1]/60 dark:border-[#422933]/60">
            <Sparkles className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81] shrink-0" />
            <span><strong>Off-line First:</strong> estude mesmo sem internet; os dados sobem assim que reconectar.</span>
          </div>
        </div>

        {/* Botão Oficial Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-white hover:bg-[#F5F5F5] dark:bg-[#281A22] dark:hover:bg-[#35222E] text-[#1F1F24] dark:text-[#F8F7F4] font-semibold text-sm transition border border-[#D9D9D9] dark:border-[#422933] shadow-sm flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-[#7B1E2B] border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continuar com o Google</span>
        </button>

        {/* Opção Convidado / Fechar */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs text-[#666672] dark:text-[#B8B3C0] hover:text-[#7B1E2B] dark:hover:text-[#FF6B81] transition underline underline-offset-4"
          >
            Continuar sem login neste dispositivo (offline)
          </button>
        </div>
      </div>
    </div>
  );
};

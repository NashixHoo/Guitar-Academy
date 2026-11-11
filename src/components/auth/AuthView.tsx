import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  KeyRound,
  FileText
} from 'lucide-react';
import { StudentPrivacyNotice } from '../teacher/StudentPrivacyNotice';

export const AuthView: React.FC = () => {
  const { 
    signInWithGoogle, 
    signInWithFacebook, 
    signInWithApple, 
    signInWithEmail, 
    signUpWithEmail, 
    sendPasswordReset,
    authError, 
    authSuccessMessage,
    clearAuthError,
    clearAuthSuccess 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProviderLoading, setActiveProviderLoading] = useState<string | null>(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  const resetFormState = () => {
    setLocalError(null);
    clearAuthError();
    clearAuthSuccess();
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    resetFormState();
    setMode(newMode);
  };

  // Login Social: Google
  const handleGoogleAuth = async () => {
    resetFormState();
    setActiveProviderLoading('google');
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      // Erro gerenciado no contexto
    } finally {
      setIsSubmitting(false);
      setActiveProviderLoading(null);
    }
  };

  // Login Social: Facebook
  const handleFacebookAuth = async () => {
    resetFormState();
    setActiveProviderLoading('facebook');
    setIsSubmitting(true);
    try {
      await signInWithFacebook();
    } catch {
      // Erro gerenciado no contexto
    } finally {
      setIsSubmitting(false);
      setActiveProviderLoading(null);
    }
  };

  // Login Social: Apple
  const handleAppleAuth = async () => {
    resetFormState();
    setActiveProviderLoading('apple');
    setIsSubmitting(true);
    try {
      await signInWithApple();
    } catch {
      // Erro gerenciado no contexto
    } finally {
      setIsSubmitting(false);
      setActiveProviderLoading(null);
    }
  };

  // Submissão de E-mail e Senha
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setLocalError('Por favor, informe seu endereço de e-mail.');
      return;
    }

    if (mode === 'forgot') {
      setIsSubmitting(true);
      try {
        await sendPasswordReset(cleanEmail);
      } catch {
        // Erro gerenciado no contexto
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password) {
      setLocalError('Por favor, informe sua senha.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setLocalError('Por favor, informe seu nome completo.');
        return;
      }
      if (password.length < 6) {
        setLocalError('A senha deve conter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('As senhas digitadas não coincidem. Verifique e tente novamente.');
        return;
      }

      setIsSubmitting(true);
      try {
        await signUpWithEmail(name, cleanEmail, password);
      } catch {
        // Erro gerenciado no contexto
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Modo Entrar
      setIsSubmitting(true);
      try {
        await signInWithEmail(cleanEmail, password);
      } catch {
        // Erro gerenciado no contexto
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const currentError = localError || authError;

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#F8F7F4] flex flex-col justify-between items-center text-[#25252A] p-4 sm:p-6 overflow-y-auto selection:bg-[#7B1E2B]/15">
      {/* Background Decorativo Sutil */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-b from-[#7B1E2B]/6 via-[#B52A3A]/4 to-transparent blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7B1E2B] via-[#B52A3A] to-[#7B1E2B]" />
      </div>

      {/* Top Header Badge */}
      <div className="w-full max-w-md pt-2 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] uppercase text-[#8C5F18] px-2.5 py-0.5 rounded-full bg-[#FAF4E6] border border-[#C5A059]/40">
            Acesso Obrigatório
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#666672]">
          <ShieldCheck className="w-4 h-4 text-[#7B1E2B]" />
          <span className="text-[11px] font-medium">Ambiente Seguro</span>
        </div>
      </div>

      {/* Cartão Central de Autenticação */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_20px_50px_-12px_rgba(37,37,42,0.08)] p-6 sm:p-8 my-auto transition-all">
        {/* Cabeçalho com Logo Oficial */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#D9D9D9] shadow-md flex items-center justify-center p-2.5 ring-4 ring-[#7B1E2B]/5">
              <img 
                src="./icon.svg" 
                alt="Guitar Academy Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#7B1E2B] border-2 border-white flex items-center justify-center shadow-xs">
              <span className="text-[9px] font-black text-[#FAF4E6]">★</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-display font-black text-[#25252A] tracking-wider uppercase">
            Guitar Academy
          </h1>
          <p className="text-xs text-[#666672] mt-1 font-medium max-w-xs">
            {mode === 'forgot'
              ? 'Recuperação de Acesso da sua Conta de Aluno'
              : 'Entre ou crie sua conta para iniciar sua formação musical.'}
          </p>
        </div>

        {/* Abas Alternadoras: Entrar / Criar Conta (ocultas no modo forgot) */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-[#F4F3EF] rounded-2xl mb-6 border border-[#E5E3DC]">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-white text-[#7B1E2B] shadow-xs'
                  : 'text-[#666672] hover:text-[#25252A]'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#7B1E2B] shadow-xs'
                  : 'text-[#666672] hover:text-[#25252A]'
              }`}
            >
              Criar Conta
            </button>
          </div>
        )}

        {/* Notificação de Erro */}
        {currentError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#FFF0F2] border border-[#B52A3A]/30 text-[#7B1E2B] text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B52A3A]" />
            <div className="flex-1 leading-relaxed">
              <span className="font-bold block mb-0.5">Aviso de Autenticação</span>
              <span>{currentError}</span>
            </div>
          </div>
        )}

        {/* Notificação de Sucesso */}
        {authSuccessMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#16A34A]/30 text-[#15803D] text-xs flex items-start gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#16A34A]" />
            <div className="flex-1 leading-relaxed">
              <span className="font-bold block mb-0.5">Operação Concluída</span>
              <span>{authSuccessMessage}</span>
            </div>
          </div>
        )}

        {/* MODO ESQUECI MINHA SENHA */}
        {mode === 'forgot' ? (
          <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
            <div className="text-xs text-[#52525B] leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-[#E8E6E1]">
              Informe o endereço de e-mail associado à sua conta. Enviaremos um link seguro para redefinição de sua senha.
            </div>

            <div>
              <label htmlFor="auth-forgot-email" className="block text-xs font-bold text-[#25252A] mb-1.5">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C8C9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aluno@email.com"
                  required
                  autoFocus
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#D9D9D9] bg-white text-xs text-[#25252A] placeholder:text-[#A0A0AA] focus:border-[#7B1E2B] focus:ring-2 focus:ring-[#7B1E2B]/10 outline-hidden transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7B1E2B] to-[#B52A3A] hover:brightness-105 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Enviar Link de Recuperação</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="w-full py-2 text-xs font-semibold text-[#666672] hover:text-[#7B1E2B] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para o login</span>
            </button>
          </form>
        ) : (
          <>
            {/* PROVEDORES SOCIAIS: Google, Facebook, Apple */}
            <div className="space-y-2.5 mb-5">
              {/* Botão Google */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full h-11 px-4 rounded-xl bg-white hover:bg-[#F9F9F9] text-[#25252A] font-semibold text-xs transition border border-[#D9D9D9] shadow-2xs flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {activeProviderLoading === 'google' ? (
                  <div className="w-4 h-4 border-2 border-[#7B1E2B] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

              {/* Grid Secundário: Facebook e Apple */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Botão Facebook */}
                <button
                  type="button"
                  onClick={handleFacebookAuth}
                  disabled={isSubmitting}
                  className="h-11 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold text-xs transition shadow-2xs flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  title="Entrar com Facebook"
                >
                  {activeProviderLoading === 'facebook' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  <span>Facebook</span>
                </button>

                {/* Botão Apple */}
                <button
                  type="button"
                  onClick={handleAppleAuth}
                  disabled={isSubmitting}
                  className="h-11 px-3 rounded-xl bg-black hover:bg-[#1C1C1E] text-white font-semibold text-xs transition shadow-2xs flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  title="Entrar com Apple"
                >
                  {activeProviderLoading === 'apple' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.66-7.85-11.91-14.3-6.28-9.48-11.22-20.2-14.81-32.18-3.59-11.97-5.39-23.3-5.39-33.99 0-14.34 3.69-26.23 11.07-35.67 7.38-9.44 16.5-14.28 27.36-14.53 4.8 0 10.28 1.29 16.44 3.86 6.16 2.57 10.23 3.91 12.22 4.02 1.63 0 5.86-1.42 12.69-4.26 6.83-2.84 12.76-4.04 17.79-3.6 13.23.87 23.35 5.76 30.36 14.67-11.75 7.07-17.5 16.89-17.26 29.46.22 9.8 4.01 18.06 11.37 24.77 7.36 6.71 16.03 10.45 26.01 11.22-2.18 6.64-4.8 13.1-7.87 19.38zm-39.73-107.8c0-7.07 2.59-13.68 7.77-19.82 5.18-6.14 11.72-9.98 19.63-11.53 1.09 7.4-1.2 14.36-6.87 20.89-5.67 6.53-12.51 10.46-20.53 11.79z" />
                    </svg>
                  )}
                  <span>Apple</span>
                </button>
              </div>
            </div>

            {/* Divisor */}
            <div className="relative flex items-center justify-center my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E3DC]" />
              </div>
              <span className="relative px-3 bg-white text-[11px] font-semibold text-[#8C8C9A] uppercase tracking-wider">
                ou continue com e-mail
              </span>
            </div>

            {/* FORMULÁRIO DE LOGIN / CADASTRO */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
              {/* Campo Nome (Apenas no Cadastro) */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-bold text-[#25252A] mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#8C8C9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Santana"
                      required
                      autoComplete="name"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-[#D9D9D9] bg-white text-xs text-[#25252A] placeholder:text-[#A0A0AA] focus:border-[#7B1E2B] focus:ring-2 focus:ring-[#7B1E2B]/10 outline-hidden transition"
                    />
                  </div>
                </div>
              )}

              {/* Campo E-mail */}
              <div>
                <label htmlFor="auth-email" className="block text-xs font-bold text-[#25252A] mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C8C9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aluno@email.com"
                    required
                    autoComplete="email"
                    className="w-full h-10 pl-10 pr-3 rounded-xl border border-[#D9D9D9] bg-white text-xs text-[#25252A] placeholder:text-[#A0A0AA] focus:border-[#7B1E2B] focus:ring-2 focus:ring-[#7B1E2B]/10 outline-hidden transition"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="auth-password" className="block text-xs font-bold text-[#25252A]">
                    Senha
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[11px] text-[#7B1E2B] hover:text-[#B52A3A] font-semibold transition"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C8C9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Mínimo de 6 caracteres' : 'Sua senha de acesso'}
                    required
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className="w-full h-10 pl-10 pr-10 rounded-xl border border-[#D9D9D9] bg-white text-xs text-[#25252A] placeholder:text-[#A0A0AA] focus:border-[#7B1E2B] focus:ring-2 focus:ring-[#7B1E2B]/10 outline-hidden transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8C9A] hover:text-[#25252A] transition"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Campo Confirmar Senha (Apenas no Cadastro) */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-confirm-password" className="block text-xs font-bold text-[#25252A] mb-1">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C8C9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha digitada"
                      required
                      autoComplete="new-password"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-[#D9D9D9] bg-white text-xs text-[#25252A] placeholder:text-[#A0A0AA] focus:border-[#7B1E2B] focus:ring-2 focus:ring-[#7B1E2B]/10 outline-hidden transition"
                    />
                  </div>
                </div>
              )}

              {/* Botão de Envio Principal */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#7B1E2B] to-[#B52A3A] hover:brightness-105 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>
                    {mode === 'signup' ? 'Criar Minha Conta de Aluno' : 'Entrar na Guitar Academy'}
                  </span>
                )}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Rodapé com Termos & LGPD */}
      <div className="w-full max-w-md pt-4 pb-2 text-center space-y-2">
        <p className="text-[11px] text-[#666672] leading-tight">
          Ao continuar, você concorda com os{' '}
          <button
            type="button"
            onClick={() => setShowPrivacyNotice(true)}
            className="text-[#7B1E2B] hover:underline font-medium inline-flex items-center gap-0.5"
          >
            <FileText className="w-3 h-3 inline" />
            Termos & Privacidade do Aluno
          </button>.
        </p>
        <p className="text-[10px] text-[#8C8C9A] font-mono-code">
          Guitar Academy • Identidade Acadêmica e Isolamento de Dados
        </p>
      </div>

      {/* Modal de Transparência e LGPD */}
      <StudentPrivacyNotice
        isOpen={showPrivacyNotice}
        onClose={() => setShowPrivacyNotice(false)}
      />
    </div>
  );
};

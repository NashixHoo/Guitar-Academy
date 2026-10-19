import React, { useEffect, useState, useCallback } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number; // Padrão: 850 ms (dentro da faixa exigida de 700–1000 ms)
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 850,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish();
    }, 180);
  }, [onFinish]);

  useEffect(() => {
    // Respeita prefers-reduced-motion do sistema operacional
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const effectiveDuration = prefersReducedMotion ? Math.min(350, durationMs) : durationMs;
    const fadeOutStart = Math.max(100, effectiveDuration - 200);

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, fadeOutStart);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, effectiveDuration);

    // Trava de segurança absoluta: nunca deixa o usuário preso na abertura
    const safetyTimer = setTimeout(() => {
      onFinish();
    }, 1200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      clearTimeout(safetyTimer);
    };
  }, [durationMs, onFinish]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando Guitar Academy"
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F7F4] select-none cursor-pointer transition-all duration-200 ease-out ${
        isFadingOut ? 'opacity-0 scale-[0.99] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Decorative subtle ambient backdrop element */}
      <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge" />

      <div className="flex flex-col items-center text-center px-6 max-w-sm w-full animate-splash-content">
        {/* Ícone Oficial Existente do Guitar Academy com Borda Luthier Ouro */}
        <div className="relative mb-5 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-[#C5A059]/50 shadow-xl flex items-center justify-center p-3.5 tortoiseshell-card glow-wine">
            <img
              src="./icon.svg"
              alt="Ícone Oficial Guitar Academy"
              className="w-full h-full object-contain filter drop-shadow-sm"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full tortoiseshell-badge border-2 border-white flex items-center justify-center shadow-xs">
            <span className="text-[10px] font-black text-[#FAF4E6] leading-none">★</span>
          </div>
        </div>

        {/* Tipografia Oficial Guitar Academy com Hierarquia Luxuosa */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full luxury-gold-badge text-[10px] font-bold uppercase tracking-widest mb-1 font-mono-code">
            <span>Conservatório Pro • 101 HSS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#1A1A1F] tracking-[0.12em] leading-tight">
            GUITAR ACADEMY
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-[#666672] max-w-xs mx-auto leading-relaxed">
            Formação Musical de Excelência para Guitarristas
          </p>
        </div>

        {/* Barra de Progresso Sutil com Gradiente Vermelho Rajado */}
        <div className="w-36 h-1 rounded-full overflow-hidden bg-[#E8D3D6] mt-6 relative">
          <div className="h-full w-full bg-gradient-to-r from-[#7B1E2B] via-[#B52A3A] to-[#7B1E2B] rounded-full animate-splash-bar" />
        </div>

        {/* Legenda de Inicialização Rápida e Área Segura */}
        <span className="text-[10px] font-mono-code text-[#888896] mt-4 tracking-wide">
          Carregando plataforma...
        </span>
      </div>
    </div>
  );
};

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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F7F4] select-none cursor-pointer overflow-hidden transition-all duration-200 ease-out ${
        isFadingOut ? 'opacity-0 scale-[0.99] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Cenário Cinematográfico: Palco com guitarra elétrica, bateria ao fundo e iluminação vinho/âmbar */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <picture>
          <source srcSet="./stage-hero.webp" type="image/webp" />
          <img
            src="./stage-hero.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center filter brightness-[0.40] contrast-[1.15] scale-105 transition-transform duration-1000 ease-out"
            loading="eager"
            decoding="async"
          />
        </picture>
        {/* Camada de Contraste e Vinheta Cinematográfica em Tons de Vinho (#7B1E2B), Cereja (#B52A3A) e Grafite Escuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#140608]/90 via-[#220B10]/80 to-[#0F0507]/95" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#100507]/45 to-[#050203]/90" />
      </div>

      {/* Friso sutil de acabamento superior */}
      <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge opacity-90 z-10" />

      {/* Conteúdo Central da Apresentação */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full animate-splash-content">
        {/* Ícone Oficial Existente do Guitar Academy (Palheta de Instrumento com Detalhes Luthier) */}
        <div className="relative mb-5 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/95 backdrop-blur-md border border-[#C5A059]/60 shadow-2xl flex items-center justify-center p-3.5 tortoiseshell-card glow-wine ring-4 ring-[#7B1E2B]/30">
            <img
              src="./icon.svg"
              alt="Ícone Oficial Guitar Academy"
              className="w-full h-full object-contain filter drop-shadow-md"
              loading="eager"
            />
          </div>
          {/* Selo Dourado Conservatório */}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full tortoiseshell-badge border-2 border-white flex items-center justify-center shadow-md">
            <span className="text-[11px] font-black text-[#FAF4E6] leading-none">★</span>
          </div>
        </div>

        {/* Tipografia Oficial Guitar Academy com Hierarquia Cinematográfica Luxuosa */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF4E6]/95 border border-[#C5A059]/60 text-[10px] font-bold uppercase tracking-widest mb-0.5 text-[#8C5F18] shadow-sm font-mono-code">
            <span>Conservatório Pro • 101 HSS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-[0.14em] leading-tight drop-shadow-md">
            GUITAR ACADEMY
          </h1>

          {/* Frase Oficial Requisitada */}
          <p className="text-sm sm:text-base font-semibold text-[#F2DFE3] max-w-xs sm:max-w-sm mx-auto leading-relaxed drop-shadow-sm">
            “Do zero ao seu melhor com a guitarra”
          </p>
        </div>

        {/* Barra de Progresso Elegante com Gradiente Vinho (#7B1E2B) & Cereja (#B52A3A) */}
        <div className="w-40 sm:w-48 h-1.5 rounded-full overflow-hidden bg-white/20 mt-6 relative backdrop-blur-xs">
          <div className="h-full w-full bg-gradient-to-r from-[#7B1E2B] via-[#B52A3A] to-[#C5A059] rounded-full animate-splash-bar shadow-sm" />
        </div>

        {/* Legenda de Acesso Rápido e Área Segura */}
        <span className="text-[11px] font-mono-code text-[#D9C4C7] mt-4 tracking-wide">
          Toque para entrar • Inicialização rápida
        </span>
      </div>
    </div>
  );
};

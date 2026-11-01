import React, { useEffect, useState, useCallback, useRef } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  // Duração padrão da abertura premium: 3500 ms (3,5 segundos visíveis após carregamento da logo)
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 3500,
}) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasStartedTimer, setHasStartedTimer] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleDismiss = useCallback(() => {
    setIsFadingOut(true);
    const dismissTimer = setTimeout(() => {
      onFinish();
    }, 400); // Transição de saída refinada de 400 ms (faixa de 350–500 ms)
    timersRef.current.push(dismissTimer);
  }, [onFinish]);

  // Se a imagem da logo já estiver em cache na montagem inicial, marca como carregada
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setLogoLoaded(true);
    }
  }, []);

  // Trava de segurança máxima (5000 ms) para nunca deixar o usuário preso
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (!logoLoaded) {
        setLogoLoaded(true);
      }
    }, 1200); // Dispara timer visual se rede demorar

    const absoluteSafetyTimer = setTimeout(() => {
      onFinish();
    }, 5000);

    timersRef.current.push(safetyTimer, absoluteSafetyTimer);

    return () => {
      clearTimeout(safetyTimer);
      clearTimeout(absoluteSafetyTimer);
    };
  }, [logoLoaded, onFinish]);

  // Contagem de permanência de 3.500 ms a partir do momento em que a logo e nome estão visíveis
  useEffect(() => {
    if (!logoLoaded || hasStartedTimer) return;
    setHasStartedTimer(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Respeita prefers-reduced-motion reduzindo para transição breve
    const effectiveDuration = prefersReducedMotion ? Math.min(850, durationMs) : durationMs;
    const fadeOutDurationMs = 450; // Duração da saída (350–500 ms)
    const fadeStartMs = Math.max(200, effectiveDuration - fadeOutDurationMs);

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, fadeStartMs);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, effectiveDuration);

    timersRef.current.push(fadeTimer, finishTimer);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [logoLoaded, hasStartedTimer, durationMs, onFinish]);

  // Limpeza de todos os timers na desmontagem do componente
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando Guitar Academy"
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between select-none cursor-pointer overflow-hidden transition-all duration-450 ease-in-out ${
        isFadingOut
          ? 'opacity-0 scale-[1.01] pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#F8F7F4',
        paddingTop: 'max(2rem, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Fundo Premium: Textura Limpa e Sofisticada com Iluminação Radial e Vinho Nobre */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Glow Radial Sutil de Fundo (#7B1E2B e #B52A3A com opacidade refinada) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#7B1E2B]/8 via-[#B52A3A]/5 to-transparent blur-3xl pointer-events-none" />
        
        {/* Linha Fina Superior com Acabamento Vinho e Dourado Nobre */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7B1E2B] via-[#B52A3A] to-[#7B1E2B] opacity-90" />
      </div>

      {/* Espaçador Superior para Perfeito Equilíbrio Visual e Espaço Negativo */}
      <div className="w-full flex justify-center pt-2">
        <span className="text-[10px] sm:text-[11px] font-mono-code font-bold tracking-[0.24em] uppercase text-[#8C5F18] px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#C5A059]/40 shadow-xs">
          Conservatório de Guitarra & Violão
        </span>
      </div>

      {/* Núcleo Central: Logo Oficial Centralizada com Dimensão Proporcional e Tipografia Legível */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full transition-all duration-700 ease-out">
        {/* Logo Oficial Centralizada com Palheta e Detalhes de Luthier */}
        <div className="relative mb-6 transform transition-transform duration-500 hover:scale-105">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-[#D9D9D9] shadow-[0_16px_40px_-8px_rgba(123,30,43,0.18)] flex items-center justify-center p-3.5 ring-4 ring-[#7B1E2B]/10">
            <img
              ref={imgRef}
              src="./icon.svg"
              alt="Guitar Academy Logo Oficial"
              className={`w-full h-full object-contain transition-all duration-700 ease-out ${
                logoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              loading="eager"
              decoding="async"
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoLoaded(true)}
            />
          </div>

          {/* Emblema Estrela Dourada do Conservatório */}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#7B1E2B] border-2 border-white flex items-center justify-center shadow-md">
            <span className="text-[11px] font-black text-[#FAF4E6] leading-none">★</span>
          </div>
        </div>

        {/* Nome GUITAR ACADEMY Claramente Legível */}
        <div className="space-y-2.5">
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#25252A] tracking-[0.16em] sm:tracking-[0.2em] leading-tight">
            GUITAR ACADEMY
          </h1>

          {/* Divisor Minimalista na Paleta Vinho e Cereja */}
          <div className="flex items-center justify-center gap-1.5 py-0.5">
            <div className="w-6 h-0.5 bg-[#7B1E2B] rounded-full" />
            <div className="w-1.5 h-1.5 bg-[#B52A3A] rounded-full" />
            <div className="w-6 h-0.5 bg-[#7B1E2B] rounded-full" />
          </div>

          {/* Subtítulo Sofisticado com Espaço Negativo Equilibrado */}
          <p className="text-xs sm:text-sm font-medium text-[#666672] tracking-wide leading-relaxed max-w-xs mx-auto">
            Plataforma Pessoal de Formação Musical
          </p>
        </div>

        {/* Indicador de Carregamento Discreto e Elegante */}
        <div className="w-36 sm:w-44 h-1 rounded-full overflow-hidden bg-[#E8D3D6]/60 mt-8 relative">
          <div className="h-full w-full bg-gradient-to-r from-[#7B1E2B] via-[#B52A3A] to-[#7B1E2B] rounded-full animate-splash-bar" />
        </div>
      </div>

      {/* Rodapé Minimalista: Legenda de Acesso Rápido */}
      <div className="w-full text-center pb-2 z-10">
        <span className="text-[10px] sm:text-[11px] font-mono-code text-[#8C8C9A] tracking-wider transition-opacity hover:opacity-100">
          Toque em qualquer lugar para avançar
        </span>
      </div>
    </div>
  );
};

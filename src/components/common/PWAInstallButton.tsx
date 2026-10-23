import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'settings' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Guitar Academy já instalado como aplicativo!</span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          className={`flex items-center gap-1.5 rounded-xl font-bold transition shadow-xs ${
            variant === 'header'
              ? 'bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] hover:bg-[#ebd3d6] dark:hover:bg-[#4a2432] border border-[#E8D3D6] dark:border-[#422933] p-2 sm:px-3 sm:py-1.5 text-xs min-w-[40px] min-h-[40px] justify-center shrink-0'
              : 'bg-[#7B1E2B] text-white hover:bg-[#B52A3A] px-4 py-2.5 text-sm w-full justify-center'
          }`}
          title="Instalar Guitar Academy no seu dispositivo"
          aria-label="Instalar Guitar Academy no dispositivo"
        >
          <Download className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" aria-hidden="true" />
          <span className={variant === 'header' ? 'hidden md:inline whitespace-nowrap' : ''}>Instalar App</span>
        </button>
      )}

      {isIOS && (
        <>
          <button
            onClick={() => setShowIOSGuide(true)}
            className={`flex items-center gap-1.5 rounded-xl font-bold transition ${
              variant === 'header'
                ? 'bg-[#F8F7F4] dark:bg-[#1A1216] text-[#7B1E2B] dark:text-[#FF6B81] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] border border-[#D9D9D9] dark:border-[#422933] p-2 sm:px-3 sm:py-1.5 text-xs min-w-[40px] min-h-[40px] justify-center shrink-0'
                : 'bg-white text-[#7B1E2B] border border-[#D9D9D9] hover:bg-[#F5E8EA] px-4 py-2.5 text-sm w-full justify-center'
            }`}
            title="Instalar Guitar Academy no iPhone / iPad"
            aria-label="Instalar Guitar Academy no iPhone"
          >
            <Smartphone className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" aria-hidden="true" />
            <span className={variant === 'header' ? 'hidden md:inline whitespace-nowrap' : ''}>Instalar no iPhone</span>
          </button>

          {showIOSGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#25252A]/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-sm rounded-2xl bg-white border border-[#D9D9D9] p-6 shadow-2xl text-[#25252A]">
                <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#7B1E2B]" />
                    <h3 className="text-base font-bold text-[#25252A]">Instalar no iPhone / iPad</h3>
                  </div>
                  <button
                    onClick={() => setShowIOSGuide(false)}
                    className="p-1 rounded-lg text-[#666672] hover:text-[#25252A] hover:bg-[#F5E8EA] transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-3 text-sm text-[#666672]">
                  <p className="flex items-start gap-2">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#F5E8EA] text-[#7B1E2B] flex items-center justify-center font-bold text-xs border border-[#E8D3D6]">1</span>
                    <span>Toque no botão <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima) na barra inferior do Safari.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#F5E8EA] text-[#7B1E2B] flex items-center justify-center font-bold text-xs border border-[#E8D3D6]">2</span>
                    <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#7B1E2B] text-white flex items-center justify-center font-bold text-xs">3</span>
                    <span>Toque em <strong>Adicionar</strong>. O app funcionará 100% offline em tela cheia!</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-5 w-full rounded-xl bg-[#7B1E2B] text-white font-bold py-2.5 text-sm hover:bg-[#B52A3A] transition shadow-xs"
                >
                  Entendi
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

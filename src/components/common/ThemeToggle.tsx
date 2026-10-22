import React, { useEffect, useState } from 'react';
import { themeService, ThemeMode } from '../../services/themeService';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'header' | 'compact' | 'full';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', variant = 'header' }) => {
  const [currentMode, setCurrentMode] = useState<ThemeMode>(themeService.getSavedTheme());
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(themeService.getEffectiveTheme());

  useEffect(() => {
    // Inicializar tema no carregamento do componente
    themeService.applyTheme(currentMode);

    // Ouvir alterações de tema
    const unsubscribe = themeService.subscribe((detail) => {
      setCurrentMode(detail.mode);
      setEffectiveTheme(detail.effectiveTheme);
    });

    return unsubscribe;
  }, []);

  const handleToggle = () => {
    const next = themeService.toggleTheme();
    setCurrentMode(next);
    setEffectiveTheme(themeService.getEffectiveTheme(next));
  };

  const isDark = effectiveTheme === 'dark';

  if (variant === 'full') {
    return (
      <button
        onClick={handleToggle}
        className={`flex items-center justify-between w-full p-3 rounded-xl border border-[#D9D9D9] dark:border-[#422933] bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] transition min-h-[44px] ${className}`}
        aria-label={isDark ? 'Alternar para Modo Claro (Conservatório)' : 'Alternar para Modo Escuro (Palco Noturno)'}
        title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-[#22141A] border border-[#D9D9D9] dark:border-[#422933] text-[#7B1E2B] dark:text-[#E05368]">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-[#25252A] dark:text-[#F8F7F4]">
              {isDark ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}
            </span>
            <span className="block text-[10px] text-[#666672] dark:text-[#B8B3C0]">
              {isDark ? 'Palco noturno de alto contraste' : 'Porcelana clássica de conservatório'}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-white dark:bg-[#22141A] border border-[#D9D9D9] dark:border-[#422933] text-[#7B1E2B] dark:text-[#E05368]">
          Alternar
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-xl bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#25252A] dark:text-[#F8F7F4] transition border border-[#D9D9D9] dark:border-[#422933] min-w-[40px] min-h-[40px] flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30 dark:focus:ring-[#E05368]/30 ${className}`}
      aria-label={isDark ? 'Alternar para Modo Claro (Conservatório)' : 'Alternar para Modo Escuro (Palco Noturno)'}
      title={isDark ? 'Mudar para Modo Claro (Porcelana)' : 'Mudar para Modo Escuro (Palco)'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#F5D38A] hover:rotate-45 transition-transform" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-[#7B1E2B] hover:-rotate-12 transition-transform" aria-hidden="true" />
      )}
    </button>
  );
};

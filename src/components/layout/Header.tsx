import React, { useState } from 'react';
import { NavigationTab } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { ThemeToggle } from '../common/ThemeToggle';
import { audioEngine } from '../../audio/audioEngine';
import { GlobalSearchBar } from './GlobalSearchBar';
import { 
  Menu, 
  Volume2, 
  VolumeX, 
  BookOpen,
  ArrowLeft
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onToggleMobileNav: () => void;
  onGoToFirstLesson: () => void;
  onSelectLesson?: (lessonId: string) => void;
  onNavigateTab?: (tab: NavigationTab) => void;
  onSelectChord?: (chordSymbol: string, chordId?: string) => void;
  onSelectTheoryTopic?: (topic: string, key?: string) => void;
  focusSearchTrigger?: number;
  canGoBack?: boolean;
  onGoBack?: () => void;
  backTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onToggleMobileNav,
  onGoToFirstLesson,
  onSelectLesson,
  onNavigateTab,
  onSelectChord,
  onSelectTheoryTopic,
  focusSearchTrigger,
  canGoBack,
  onGoBack,
  backTitle,
}) => {
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (newVal > 0) setIsMuted(false);
    audioEngine.setMasterVolume(newVal);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setMasterVolume(volume || 0.8);
    } else {
      setIsMuted(true);
      audioEngine.setMasterVolume(0);
    }
  };

  return (
    <header 
      role="banner" 
      aria-label="Cabeçalho principal do Guitar Academy"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D9D9D9] px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 shadow-xs safe-area-top"
    >
      {/* Left: Voltar button (if available), Mobile hamburger & Brand */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {canGoBack && onGoBack && (
          <button
            onClick={onGoBack}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] transition border border-[#D9D9D9] flex items-center gap-1.5 min-w-[40px] min-h-[40px] font-bold text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30"
            aria-label={backTitle ? `Voltar para ${backTitle}` : 'Voltar para a tela anterior'}
            title={backTitle ? `Voltar para ${backTitle}` : 'Voltar'}
          >
            <ArrowLeft className="w-4 h-4 text-[#7B1E2B]" aria-hidden="true" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
        )}

        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] transition border border-[#D9D9D9] min-w-[40px] min-h-[40px] flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/20"
          aria-label="Abrir Menu de Navegação"
        >
          <Menu className="w-5 h-5 text-[#7B1E2B]" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Logo icon box using official icon.svg with tortoiseshell gold trim */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-[#C5A059]/40 flex items-center justify-center shadow-xs overflow-hidden p-1 tortoiseshell-card shrink-0">
            <img src="./icon.svg" alt="Guitar Academy Ícone" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-bold text-[#1F1F24] dark:text-[#F8F7F4] text-sm sm:text-base tracking-[0.08em] flex items-center gap-1.5 leading-none">
              GUITAR ACADEMY
              <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded-md luxury-gold-badge">
                101 HSS
              </span>
            </span>
            <span className="hidden md:block text-[10px] text-[#666672] dark:text-[#B8B3C0] tracking-wide leading-none mt-1 font-medium">
              Conservatório Musical para Guitarristas
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <GlobalSearchBar
        onSelectLesson={onSelectLesson || (() => {})}
        onNavigateTab={onNavigateTab || (() => {})}
        onSelectChord={onSelectChord}
        onSelectTheoryTopic={onSelectTheoryTopic}
        focusTrigger={focusSearchTrigger}
      />

      {/* Right Controls: Direct Lesson 1 Button, Audio Volume, PWA Install */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Direct First Lesson shortcut with luxury gradient */}
        <button
          onClick={onGoToFirstLesson}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl luxury-btn-primary active:scale-95 text-white text-xs font-bold transition shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30"
          title="Abrir diretamente a Aula 1"
          aria-label="Abrir diretamente a Aula 1: As Cordas da Guitarra e Afinação Padrão"
        >
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Aula 1 Pronta</span>
        </button>

        {/* Master Audio Volume Control */}
        <div className="flex items-center gap-1.5 bg-[#F8F7F4] px-2.5 py-1.5 rounded-xl border border-[#D9D9D9]">
          <button
            onClick={handleToggleMute}
            className="text-[#666672] hover:text-[#7B1E2B] transition p-0.5 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#7B1E2B]"
            title={isMuted ? 'Desmutar áudio' : 'Mutar áudio'}
            aria-label={isMuted ? 'Desmutar áudio do aplicativo' : 'Mutar áudio do aplicativo'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#B52A3A]" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#7B1E2B]" aria-hidden="true" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 sm:w-20 accent-[#7B1E2B] h-1.5 cursor-pointer bg-[#D9D9D9]"
            title="Volume Geral"
            aria-label="Volume geral de áudio do aplicativo"
          />
        </div>

        {/* Theme Toggle (Modo Claro / Modo Escuro) */}
        <ThemeToggle />

        {/* PWA Install Button */}
        <PWAInstallButton variant="header" />
      </div>
    </header>
  );
};

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
  User as UserIcon,
  GraduationCap
} from 'lucide-react';
import { VoltarIcon, AulasIcon } from '../common/GuitarIcons';
import { useAuth } from '../../contexts/AuthContext';

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
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
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
  onOpenAuth,
  onOpenProfile,
}) => {
  const { user, syncStatus, isAdmin, adminPreviewMode, setAdminPreviewMode } = useAuth();
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
      className="sticky top-0 z-40 bg-white/97 dark:bg-[#1A1216]/97 backdrop-blur-md border-b border-[#E8E6E1] dark:border-[#422933] px-2.5 xs:px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-4 shadow-xs safe-area-top transition-colors"
    >
      {/* Left: Voltar button (if available), Mobile hamburger & Brand */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
        {canGoBack && onGoBack && (
          <button
            onClick={onGoBack}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] transition border border-[#E8E6E1] dark:border-[#422933] flex items-center gap-1.5 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] font-bold text-xs shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30"
            aria-label={backTitle ? `Voltar para ${backTitle}` : 'Voltar para a tela anterior'}
            title={backTitle ? `Voltar para ${backTitle}` : 'Voltar'}
          >
            <VoltarIcon className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" aria-hidden="true" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
        )}

        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#25252A] dark:text-[#F8F7F4] transition border border-[#E8E6E1] dark:border-[#422933] w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/20"
          aria-label="Abrir Menu de Navegação"
        >
          <Menu className="w-5 h-5 text-[#7B1E2B] dark:text-[#FF6B81]" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Logo icon box using official icon.svg with tortoiseshell gold trim */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-[#22141A] border border-[#C5A059]/40 flex items-center justify-center shadow-xs overflow-hidden p-1.5 tortoiseshell-card shrink-0">
            <img src="./icon.svg" alt="Guitar Academy Ícone" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <span className="font-display font-black text-[#1F1F24] dark:text-[#F8F7F4] text-xs xs:text-sm sm:text-base tracking-[0.06em] sm:tracking-[0.10em] flex items-center gap-1.5 leading-none">
              <span className="truncate">GUITAR ACADEMY</span>
              <span className="hidden sm:inline-block text-[9px] sm:text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded-md luxury-gold-badge shrink-0">
                101 HSS
              </span>
            </span>
            <span className="hidden md:block text-[10px] text-[#666672] dark:text-[#B8B3C0] tracking-wider leading-none mt-1 font-medium truncate">
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
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Direct First Lesson shortcut with luxury gradient */}
        <button
          onClick={onGoToFirstLesson}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl luxury-btn-primary active:scale-95 text-white text-xs font-bold transition shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30 h-9 sm:h-10"
          title="Abrir diretamente a Aula 1"
          aria-label="Abrir diretamente a Aula 1: As Cordas da Guitarra e Afinação Padrão"
        >
          <AulasIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Aula 1 Pronta</span>
        </button>

        {/* Master Audio Volume Control */}
        <div className="flex items-center gap-1.5 bg-[#F8F7F4] dark:bg-[#1A1216] px-2 py-1.5 rounded-xl border border-[#E8E6E1] dark:border-[#422933] h-9 sm:h-10">
          <button
            onClick={handleToggleMute}
            className="text-[#666672] dark:text-[#B8B3C0] hover:text-[#7B1E2B] dark:hover:text-[#FF6B81] transition p-1 rounded-md min-w-[28px] min-h-[28px] flex items-center justify-center focus:outline-hidden focus:ring-1 focus:ring-[#7B1E2B]"
            title={isMuted ? 'Desmutar áudio' : 'Mutar áudio'}
            aria-label={isMuted ? 'Desmutar áudio do aplicativo' : 'Mutar áudio do aplicativo'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#B52A3A] dark:text-[#FF6B81]" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" aria-hidden="true" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="hidden sm:block w-16 sm:w-20 accent-[#7B1E2B] h-1.5 cursor-pointer bg-[#D9D9D9] dark:bg-[#422933] rounded-full"
            title="Volume Geral"
            aria-label="Volume geral de áudio do aplicativo"
          />
        </div>

        {/* Theme Toggle (Modo Claro / Modo Escuro) */}
        <ThemeToggle />

        {/* PWA Install Button */}
        <PWAInstallButton variant="header" />

        {/* Botão de retorno ao painel administrativo exclusivo para administrador em modo preview */}
        {isAdmin && adminPreviewMode && (
          <button
            onClick={() => setAdminPreviewMode(false)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            title="Retornar ao Painel Admin"
          >
            <span>Retornar ao Painel Admin</span>
          </button>
        )}

        {/* User Account / Google Login Button */}
        {user ? (
          <button
            onClick={onOpenProfile}
            className="relative p-0.5 rounded-xl border border-[#C5A059]/60 hover:scale-105 transition shadow-xs flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] cursor-pointer"
            title={`Perfil de ${user.displayName || user.email || 'Estudante'}`}
            aria-label="Abrir painel do estudante"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Estudante'}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#7B1E2B] text-white font-bold text-xs flex items-center justify-center">
                {(user.displayName || user.email || 'G')[0].toUpperCase()}
              </div>
            )}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white dark:border-[#1A1216] ${
                syncStatus === 'synced'
                  ? 'bg-[#16A34A]'
                  : syncStatus === 'syncing'
                  ? 'bg-[#C5A059] animate-pulse'
                  : 'bg-[#D97706]'
              }`}
              title={
                syncStatus === 'synced'
                  ? 'Sincronizado na nuvem'
                  : syncStatus === 'syncing'
                  ? 'Sincronizando...'
                  : 'Modo offline'
              }
            />
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] transition border border-[#E8E6E1] dark:border-[#422933] text-xs font-bold shadow-xs cursor-pointer h-9 sm:h-10 shrink-0"
            title="Entrar com conta Google para sincronizar seus estudos"
            aria-label="Entrar com conta Google"
          >
            <UserIcon className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
            <span className="hidden md:inline">Entrar</span>
          </button>
        )}
      </div>
    </header>
  );
};

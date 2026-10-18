import React, { useState } from 'react';
import { NavigationTab } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { audioEngine } from '../../audio/audioEngine';
import { 
  Menu, 
  Volume2, 
  VolumeX, 
  Guitar, 
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onToggleMobileNav: () => void;
  onGoToFirstLesson: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onToggleMobileNav,
  onGoToFirstLesson,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D9D9D9] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs safe-area-top">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] transition border border-[#D9D9D9] min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Abrir Menu de Navegação"
        >
          <Menu className="w-5 h-5 text-[#7B1E2B]" />
        </button>

        <div className="flex items-center gap-2.5">
          {/* Logo icon box using official icon.svg */}
          <div className="w-9 h-9 rounded-xl bg-[#F8F7F4] border border-[#D9D9D9] flex items-center justify-center shadow-xs overflow-hidden p-1 tortoiseshell-card">
            <img src="./icon.svg" alt="Guitar Academy" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-[#25252A] text-base tracking-tight flex items-center gap-1.5 leading-none">
              GUITAR ACADEMY
              <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded-md bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
                101 HSS
              </span>
            </span>
            <span className="text-[10px] text-[#666672] block leading-none mt-1 font-medium">
              Formação Musical para Guitarristas
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Direct Lesson 1 Button, Audio Volume, PWA Install */}
      <div className="flex items-center gap-2.5">
        {/* Direct First Lesson shortcut */}
        <button
          onClick={onGoToFirstLesson}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] active:scale-95 text-white text-xs font-bold transition shadow-xs"
          title="Abrir diretamente a Aula 1"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Aula 1 Pronta</span>
        </button>

        {/* Master Audio Volume Control */}
        <div className="flex items-center gap-1.5 bg-[#F8F7F4] px-2.5 py-1.5 rounded-xl border border-[#D9D9D9]">
          <button
            onClick={handleToggleMute}
            className="text-[#666672] hover:text-[#7B1E2B] transition"
            title={isMuted ? 'Desmutar' : 'Mutar áudio'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#B52A3A]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#7B1E2B]" />
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
          />
        </div>

        {/* PWA Install Button */}
        <PWAInstallButton variant="header" />
      </div>
    </header>
  );
};

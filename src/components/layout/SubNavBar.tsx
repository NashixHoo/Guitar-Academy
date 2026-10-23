import React from 'react';
import { NavigationTab } from '../../types';
import { PrimaryTab } from '../../services/navigationService';
import { 
  Home, 
  GraduationCap, 
  Target, 
  Clock, 
  Radio, 
  Guitar, 
  BookOpen, 
  Zap, 
  Activity, 
  Headphones, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  Settings, 
  Compass, 
  Music, 
  BookMarked 
} from 'lucide-react';

interface SubNavBarProps {
  primaryTab: PrimaryTab;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  className?: string;
}

interface SubTabItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
}

const SUB_TABS_BY_PRIMARY: Record<PrimaryTab, SubTabItem[]> = {
  estudar: [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'curriculum', label: 'Formação & Aulas', icon: GraduationCap },
    { id: 'theory', label: 'Teoria Musical', icon: Compass },
    { id: 'library', label: 'Biblioteca', icon: BookMarked },
    { id: 'reading', label: 'Leitura', icon: Music },
  ],
  praticar: [
    { id: 'practice-routine', label: 'Central de Prática', icon: Target },
    { id: 'metronome', label: 'Metrônomo', icon: Clock },
    { id: 'tuner', label: 'Afinador', icon: Radio },
    { id: 'fretboard', label: 'Braço', icon: Guitar },
    { id: 'chords', label: 'Acordes', icon: BookOpen },
    { id: 'guitar-coach', label: 'Coach', icon: Zap },
    { id: 'technique', label: 'Técnica', icon: Activity },
    { id: 'ear-training', label: 'Ouvido', icon: Headphones },
  ],
  evoluir: [
    { id: 'progress', label: 'Meu Progresso', icon: Trophy },
    { id: 'professor-ai', label: 'Professor IA', icon: Sparkles },
    { id: 'diagnostics', label: 'Diagnóstico', icon: ShieldCheck },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ],
};

export const SubNavBar: React.FC<SubNavBarProps> = ({
  primaryTab,
  currentTab,
  onSelectTab,
  className = '',
}) => {
  const items = SUB_TABS_BY_PRIMARY[primaryTab] || [];

  return (
    <div
      role="tablist"
      aria-label={`Sub-navegação de ${primaryTab}`}
      className={`w-full overflow-x-auto no-scrollbar py-2 px-2 sm:px-6 bg-white/70 dark:bg-[#1A1216]/70 backdrop-blur-md border-b border-[#D9D9D9]/80 dark:border-[#422933] flex items-center select-none no-swipe ${className}`}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 min-w-max mx-auto sm:justify-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 min-h-[36px] ${
                isActive
                  ? 'bg-[#7B1E2B] dark:bg-[#FF6B81] text-white dark:text-[#180A0E] shadow-xs'
                  : 'text-[#666672] dark:text-[#B8B3C0] hover:text-[#25252A] dark:hover:text-[#F8F7F4] hover:bg-[#F5E8EA]/60 dark:hover:bg-[#381A25]/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

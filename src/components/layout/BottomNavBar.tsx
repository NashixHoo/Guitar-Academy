import React from 'react';
import { PrimaryTab } from '../../services/navigationService';
import { EstudarIcon, PraticarIcon, EvoluirIcon } from '../common/GuitarIcons';

interface BottomNavBarProps {
  activePrimaryTab: PrimaryTab;
  onSelectPrimaryTab: (tab: PrimaryTab) => void;
  className?: string;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activePrimaryTab,
  onSelectPrimaryTab,
  className = '',
}) => {
  const tabs: {
    id: PrimaryTab;
    label: string;
    subtitle: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'estudar',
      label: 'Estudar',
      subtitle: 'Aulas & Teoria',
      icon: EstudarIcon,
    },
    {
      id: 'praticar',
      label: 'Praticar',
      subtitle: 'Rotinas & Treino',
      icon: PraticarIcon,
    },
    {
      id: 'evoluir',
      label: 'Evoluir',
      subtitle: 'Progresso & IA',
      icon: EvoluirIcon,
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Barra de navegação inferior"
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/97 dark:bg-[#1A1216]/97 backdrop-blur-xl border-t border-[#E8E6E1] dark:border-[#422933] px-2 sm:px-6 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] select-none transition-colors ${className}`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-14 sm:h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePrimaryTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={`Aba ${tab.label}: ${tab.subtitle}`}
              onClick={() => onSelectPrimaryTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-2 relative group min-h-[48px] rounded-xl transition-all ${
                isActive
                  ? 'text-[#7B1E2B] dark:text-[#FF6B81] font-bold'
                  : 'text-[#666672] dark:text-[#B8B3C0] hover:text-[#25252A] dark:hover:text-[#F8F7F4] font-medium'
              }`}
            >
              {/* Barra indicadora superior da aba ativa */}
              {isActive && (
                <div
                  aria-hidden="true"
                  className="absolute top-0 w-10 h-0.5 bg-[#7B1E2B] dark:bg-[#FF6B81] rounded-full shadow-[0_2px_8px_rgba(123,30,43,0.35)]"
                />
              )}

              {/* Ícone com escala sutil e realce visual */}
              <div
                className={`p-1.5 rounded-xl transition-transform ${
                  isActive
                    ? 'scale-105 bg-[#F5E8EA]/90 dark:bg-[#381A25]'
                    : 'group-hover:scale-105'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? 'text-[#7B1E2B] dark:text-[#FF6B81]'
                      : 'text-[#666672] dark:text-[#B8B3C0]'
                  }`}
                  aria-hidden="true"
                />
              </div>

              {/* Rótulo da Aba */}
              <span className="text-[11px] sm:text-xs tracking-tight leading-none mt-0.5">
                {tab.label}
              </span>

              {/* Subtítulo discreto */}
              <span className="hidden xs:inline-block text-[9px] tracking-tight opacity-75 leading-none mt-0.5 font-normal">
                {tab.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

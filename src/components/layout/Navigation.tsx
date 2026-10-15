import React from 'react';
import { NavigationTab } from '../../types';
import { 
  Home, 
  GraduationCap, 
  Guitar, 
  BookOpen, 
  Clock, 
  Compass, 
  Music, 
  Headphones, 
  Activity, 
  BookMarked, 
  Trophy, 
  Settings, 
  Target,
  X
} from 'lucide-react';

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: '1. Início', icon: Home },
    { id: 'curriculum', label: '2. Minha Formação', icon: GraduationCap, badge: '6 Níveis' },
    { id: 'practice-routine', label: '3. Rotina de Estudo', icon: Target, badge: '10/20/30m' },
    { id: 'fretboard', label: '4. Braço da Guitarra', icon: Guitar },
    { id: 'chords', label: '5. Dicionário de Acordes', icon: BookOpen },
    { id: 'metronome', label: '6. Metrônomo', icon: Clock, badge: 'Áudio Real' },
    { id: 'theory', label: '7. Teoria Musical', icon: Compass },
    { id: 'reading', label: '8. Leitura Musical', icon: Music },
    { id: 'ear-training', label: '9. Treino Auditivo', icon: Headphones },
    { id: 'technique', label: '10. Técnica', icon: Activity },
    { id: 'library', label: '11. Biblioteca de Estudos', icon: BookMarked },
    { id: 'progress', label: '12. Meu Progresso', icon: Trophy },
    { id: 'settings', label: '13. Configurações', icon: Settings },
  ];

  const handleItemClick = (id: NavigationTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full py-4 px-3 space-y-1">
      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#666672]">
        Navegação Principal
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition group ${
                isActive
                  ? 'bg-[#7B1E2B] text-white shadow-xs font-extrabold'
                  : 'text-[#25252A] hover:text-[#7B1E2B] hover:bg-[#F5E8EA]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7B1E2B] group-hover:scale-110 transition-transform'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono-code font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info banner */}
      <div className="pt-4 border-t border-[#D9D9D9] px-2 text-[11px] text-[#666672] text-center font-medium">
        Guitar Academy • Giannini 101 HSS
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-[#D9D9D9] flex-shrink-0 min-h-[calc(100vh-61px)]">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#25252A]/60 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-[#D9D9D9] shadow-2xl z-10 flex flex-col animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-4 border-b border-[#D9D9D9]">
              <span className="font-extrabold text-[#25252A] text-sm">Navegação Guitar Academy</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-[#666672] hover:text-[#25252A] hover:bg-[#F5E8EA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

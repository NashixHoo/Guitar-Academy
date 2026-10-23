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
  Radio,
  Zap,
  Sparkles,
  ShieldCheck,
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
  const pillars: {
    title: string;
    items: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string }[];
  }[] = [
    {
      title: '1. Estudar',
      items: [
        { id: 'home', label: 'Início', icon: Home },
        { id: 'curriculum', label: 'Formação & Aulas', icon: GraduationCap, badge: '6 Níveis' },
        { id: 'theory', label: 'Teoria Musical', icon: Compass },
        { id: 'library', label: 'Biblioteca de Estudos', icon: BookMarked },
        { id: 'reading', label: 'Leitura Musical', icon: Music },
      ],
    },
    {
      title: '2. Praticar',
      items: [
        { id: 'practice-routine', label: 'Central de Prática', icon: Target, badge: '5/10/15/30m' },
        { id: 'metronome', label: 'Metrônomo Pro', icon: Clock, badge: 'Áudio Real' },
        { id: 'tuner', label: 'Afinador Pro', icon: Radio, badge: 'Microfone Real' },
        { id: 'fretboard', label: 'Braço da Guitarra', icon: Guitar },
        { id: 'chords', label: 'Dicionário de Acordes', icon: BookOpen },
        { id: 'guitar-coach', label: 'Guitar Coach', icon: Zap, badge: 'Treino c/ Áudio' },
        { id: 'technique', label: 'Técnica & Exercícios', icon: Activity },
        { id: 'ear-training', label: 'Treino Auditivo', icon: Headphones },
      ],
    },
    {
      title: '3. Evoluir',
      items: [
        { id: 'progress', label: 'Meu Progresso', icon: Trophy },
        { id: 'professor-ai', label: 'Professor IA', icon: Sparkles, badge: 'Gemini' },
        { id: 'diagnostics', label: 'Diagnóstico do Sistema', icon: ShieldCheck, badge: 'Auditoria' },
        { id: 'settings', label: 'Configurações', icon: Settings },
      ],
    },
  ];

  const handleItemClick = (id: NavigationTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full py-4 px-3 space-y-3">
      <div className="px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-[#8C5F18] flex items-center justify-between">
        <span>Guitar Academy V2</span>
        <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded-sm bg-[#FAF4E6] text-[#8C5F18] border border-[#C5A059]/30">
          PRO
        </span>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="space-y-1">
            <span className="px-3 text-[10px] font-bold tracking-wider uppercase text-[#7B1E2B] dark:text-[#FF6B81] block font-mono-code">
              {pillar.title}
            </span>
            <div className="space-y-0.5">
              {pillar.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full min-h-[42px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#7B1E2B] via-[#8E2232] to-[#A82739] text-white shadow-sm font-extrabold border-l-2 border-[#C5A059]'
                        : 'text-[#25252A] dark:text-[#F8F7F4] hover:text-[#7B1E2B] dark:hover:text-[#FF6B81] hover:bg-gradient-to-r hover:from-[#FAF1F2] dark:hover:from-[#381A25] hover:to-white dark:hover:to-[#22141A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF4E6]' : 'text-[#7B1E2B] dark:text-[#FF6B81] group-hover:scale-110 transition-transform'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono-code font-bold ${
                        isActive ? 'bg-black/20 text-[#FAF4E6] border border-white/20' : 'bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8D3D6] dark:border-[#422933]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer info banner with luxury conservatory crest */}
      <div className="pt-4 border-t border-[#D9D9D9] px-3 py-2 text-center space-y-0.5">
        <span className="font-display text-[10px] tracking-[0.14em] text-[#8C5F18] uppercase font-bold block">
          Guitar Academy
        </span>
        <span className="text-[10px] text-[#666672] font-medium block">
          Giannini 101 HSS Vintage Spec
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar com acabamento translúcido de conservatório */}
      <aside className="hidden lg:block w-64 bg-white/92 backdrop-blur-md border-r border-[#D9D9D9]/80 flex-shrink-0 min-h-[calc(100vh-61px)]">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#0E0709]/70 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white/96 dark:bg-[#1A1216]/96 backdrop-blur-xl border-r border-[#D9D9D9] dark:border-[#422933] shadow-2xl z-10 flex flex-col animate-in slide-in-from-left safe-area-top safe-area-bottom">
            <div className="flex items-center justify-between p-4 border-b border-[#D9D9D9]">
              <span className="font-extrabold text-[#25252A] text-sm">Navegação Guitar Academy</span>
              <button
                onClick={onCloseMobile}
                className="p-2 rounded-lg text-[#666672] hover:text-[#25252A] hover:bg-[#F5E8EA] min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Fechar menu"
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

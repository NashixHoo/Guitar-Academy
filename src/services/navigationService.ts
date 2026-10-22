import { NavigationTab } from '../types';

export type PrimaryTab = 'estudar' | 'praticar' | 'evoluir';

export interface NavigationState {
  primaryTab: PrimaryTab;
  currentTab: NavigationTab;
  selectedLessonId: string | null;
  searchTargetChord?: { symbol: string; id?: string } | null;
  searchTargetTheoryKey?: string | null;
}

export interface HistoryEntry {
  tab: NavigationTab;
  lessonId: string | null;
  primaryTab: PrimaryTab;
  title: string;
  timestamp: number;
}

// Mapeamento canônico das 17 telas nas 3 abas principais
export const TAB_TO_PRIMARY_MAP: Record<NavigationTab, PrimaryTab> = {
  // 1. Estudar: dashboard, trilha dos níveis 0–5, aulas, currículo, teoria e biblioteca
  home: 'estudar',
  curriculum: 'estudar',
  theory: 'estudar',
  library: 'estudar',
  reading: 'estudar',

  // 2. Praticar: Central de Prática, rotinas, metrônomo, afinador, acordes, braço e treino
  'practice-routine': 'praticar',
  metronome: 'praticar',
  tuner: 'praticar',
  chords: 'praticar',
  fretboard: 'praticar',
  'guitar-coach': 'praticar',
  technique: 'praticar',
  'ear-training': 'praticar',

  // 3. Evoluir: progresso, habilidades, metas, histórico de estudo, diagnósticos e Professor IA
  progress: 'evoluir',
  'professor-ai': 'evoluir',
  diagnostics: 'evoluir',
  settings: 'evoluir',
};

// Rótulos legíveis para o histórico e botão voltar
export const SCREEN_TITLES: Record<NavigationTab, string> = {
  home: 'Início',
  curriculum: 'Currículo & Aulas',
  'practice-routine': 'Central de Prática',
  'guitar-coach': 'Guitar Coach',
  'professor-ai': 'Professor IA',
  tuner: 'Afinador Pro',
  fretboard: 'Braço da Guitarra',
  chords: 'Dicionário de Acordes',
  metronome: 'Metrônomo',
  theory: 'Teoria Musical',
  reading: 'Leitura Musical',
  'ear-training': 'Treino Auditivo',
  technique: 'Técnica',
  library: 'Biblioteca de Estudos',
  progress: 'Meu Progresso',
  settings: 'Configurações',
  diagnostics: 'Diagnóstico',
};

// Tela inicial padrão para cada uma das três abas principais
export const PRIMARY_TAB_DEFAULTS: Record<PrimaryTab, NavigationTab> = {
  estudar: 'home',
  praticar: 'practice-routine',
  evoluir: 'progress',
};

// Ordem estrita de gestos laterais (Estudar ↔ Praticar ↔ Evoluir)
export const PRIMARY_TABS_ORDER: PrimaryTab[] = ['estudar', 'praticar', 'evoluir'];

// Gerenciador centralizado de histórico de navegação
class NavigationHistoryService {
  private historyStack: HistoryEntry[] = [];
  private scrollPositions: Map<string, number> = new Map();
  private maxStackSize: number = 25;
  private isPopstateHandling: boolean = false;

  constructor() {
    // Inicializa com a tela inicial
    this.historyStack = [
      {
        tab: 'home',
        lessonId: null,
        primaryTab: 'estudar',
        title: 'Início',
        timestamp: Date.now(),
      },
    ];
  }

  public getPrimaryTab(tab: NavigationTab): PrimaryTab {
    return TAB_TO_PRIMARY_MAP[tab] || 'estudar';
  }

  public getNextPrimaryTab(current: PrimaryTab): PrimaryTab | null {
    const idx = PRIMARY_TABS_ORDER.indexOf(current);
    if (idx >= 0 && idx < PRIMARY_TABS_ORDER.length - 1) {
      return PRIMARY_TABS_ORDER[idx + 1];
    }
    return null; // Sem ciclo automático na extremidade
  }

  public getPreviousPrimaryTab(current: PrimaryTab): PrimaryTab | null {
    const idx = PRIMARY_TABS_ORDER.indexOf(current);
    if (idx > 0) {
      return PRIMARY_TABS_ORDER[idx - 1];
    }
    return null; // Sem ciclo automático na extremidade
  }

  public push(tab: NavigationTab, lessonId: string | null = null): void {
    const primaryTab = this.getPrimaryTab(tab);
    const title = lessonId ? `Aula ${lessonId}` : SCREEN_TITLES[tab] || tab;

    // Evitar entradas duplicadas consecutivas no histórico
    const top = this.getCurrent();
    if (top && top.tab === tab && top.lessonId === lessonId) {
      return;
    }

    // Prevenir ciclos imediatos se o novo destino for igual ao anterior imediato (evita A -> B -> A -> B)
    if (this.historyStack.length >= 2) {
      const prev = this.historyStack[this.historyStack.length - 2];
      if (prev.tab === tab && prev.lessonId === lessonId) {
        // Apenas volta um nível em vez de empilhar ciclicamente
        this.historyStack.pop();
        this.syncBrowserHistory(tab, lessonId);
        return;
      }
    }

    this.historyStack.push({
      tab,
      lessonId,
      primaryTab,
      title,
      timestamp: Date.now(),
    });

    if (this.historyStack.length > this.maxStackSize) {
      this.historyStack.shift();
    }

    this.syncBrowserHistory(tab, lessonId);
  }

  public pop(): HistoryEntry | null {
    if (this.historyStack.length <= 1) {
      return null;
    }

    // Remove a tela atual do topo
    this.historyStack.pop();

    // Retorna a tela de destino
    const destination = this.getCurrent();
    if (destination) {
      this.syncBrowserHistory(destination.tab, destination.lessonId);
    }
    return destination;
  }

  public getCurrent(): HistoryEntry | null {
    return this.historyStack.length > 0
      ? this.historyStack[this.historyStack.length - 1]
      : null;
  }

  public getPrevious(): HistoryEntry | null {
    return this.historyStack.length >= 2
      ? this.historyStack[this.historyStack.length - 2]
      : null;
  }

  public canGoBack(selectedLessonId?: string | null, currentTab?: NavigationTab): boolean {
    // Se o usuário estiver dentro do visualizador de aula, sempre pode voltar para a lista
    if (selectedLessonId) return true;

    // Se houver histórico acumulado
    if (this.historyStack.length > 1) return true;

    // Se estiver em uma tela interna/ferramenta secundária que não é a raiz da aba
    if (currentTab && currentTab !== 'home' && currentTab !== 'practice-routine' && currentTab !== 'progress') {
      return true;
    }

    return false;
  }

  public getSafeFallback(currentTab: NavigationTab, selectedLessonId: string | null): { tab: NavigationTab; lessonId: string | null } {
    // Ao abrir uma aula a partir da lista, Voltar retorna à lista de níveis e aulas
    if (selectedLessonId) {
      return { tab: 'curriculum', lessonId: null };
    }

    const primary = this.getPrimaryTab(currentTab);

    // Destinos seguros baseados no contexto da aba atual
    if (primary === 'estudar') {
      if (currentTab === 'curriculum' || currentTab === 'theory' || currentTab === 'library' || currentTab === 'reading') {
        return { tab: 'home', lessonId: null };
      }
      return { tab: 'home', lessonId: null };
    }

    if (primary === 'praticar') {
      if (currentTab !== 'practice-routine') {
        return { tab: 'practice-routine', lessonId: null };
      }
      return { tab: 'home', lessonId: null };
    }

    if (primary === 'evoluir') {
      if (currentTab !== 'progress') {
        return { tab: 'progress', lessonId: null };
      }
      return { tab: 'home', lessonId: null };
    }

    return { tab: 'home', lessonId: null };
  }

  public getHistoryStack(): readonly HistoryEntry[] {
    return this.historyStack;
  }

  // Armazenamento de posição de rolagem por tela
  public saveScrollPosition(key: string, position: number): void {
    this.scrollPositions.set(key, position);
  }

  public getScrollPosition(key: string): number {
    return this.scrollPositions.get(key) || 0;
  }

  // Integração com o histórico do navegador (popstate)
  private syncBrowserHistory(tab: NavigationTab, lessonId: string | null): void {
    if (typeof window === 'undefined' || this.isPopstateHandling) return;
    try {
      const stateObj = { tab, lessonId };
      const hash = `#tab=${tab}${lessonId ? `&lesson=${lessonId}` : ''}`;
      if (window.location.hash !== hash) {
        window.history.pushState(stateObj, '', hash);
      }
    } catch {
      // Ignora restrições de sandbox se houver
    }
  }

  public handlePopState(state: { tab?: NavigationTab; lessonId?: string | null } | null): { tab: NavigationTab; lessonId: string | null } | null {
    this.isPopstateHandling = true;
    try {
      if (state && state.tab) {
        if (this.historyStack.length > 1) {
          this.historyStack.pop();
        }
        return { tab: state.tab, lessonId: state.lessonId || null };
      }
    } finally {
      this.isPopstateHandling = false;
    }
    return null;
  }

  // Para fins de teste e reinicialização limpa
  public resetHistory(initialTab: NavigationTab = 'home'): void {
    this.historyStack = [
      {
        tab: initialTab,
        lessonId: null,
        primaryTab: this.getPrimaryTab(initialTab),
        title: SCREEN_TITLES[initialTab] || initialTab,
        timestamp: Date.now(),
      },
    ];
    this.scrollPositions.clear();
  }
}

export const navigationService = new NavigationHistoryService();

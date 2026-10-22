export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  bgPorcelain: string;
  surfaceWhite: string;
  redWine: string;
  redCherry: string;
  textGraphite: string;
  textMuted: string;
  borderSilver: string;
  roseSoft: string;
  roseSubtle: string;
  cardSurface: string;
  cardSurfaceEnd: string;
  cardBorder: string;
  cardShadow: string;
  tortoiseBorder: string;
  overlayColor: string;
  bodyBg: string;
  bodyText: string;
  headerBg: string;
  navBg: string;
}

export const LIGHT_THEME: ThemeColors = {
  bgPorcelain: '#F8F7F4',
  surfaceWhite: '#FFFFFF',
  redWine: '#7B1E2B',
  redCherry: '#B52A3A',
  textGraphite: '#25252A',
  textMuted: '#666672',
  borderSilver: '#D9D9D9',
  roseSoft: '#F5E8EA',
  roseSubtle: '#FAF1F2',
  cardSurface: 'rgba(255, 255, 255, 0.95)',
  cardSurfaceEnd: 'rgba(250, 247, 244, 0.92)',
  cardBorder: 'rgba(220, 205, 200, 0.70)',
  cardShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.16), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
  tortoiseBorder: '#E8D3D6',
  overlayColor: 'rgba(14, 7, 9, 0.85)',
  bodyBg: '#0E0709',
  bodyText: '#25252A',
  headerBg: 'rgba(255, 255, 255, 0.95)',
  navBg: 'rgba(255, 255, 255, 0.92)',
};

export const DARK_THEME: ThemeColors = {
  bgPorcelain: '#1A1216',
  surfaceWhite: '#22141A',
  redWine: '#E05368',
  redCherry: '#FF6B81',
  textGraphite: '#F8F7F4',
  textMuted: '#B8B3C0',
  borderSilver: '#422933',
  roseSoft: '#381A25',
  roseSubtle: '#2A131C',
  cardSurface: 'rgba(34, 20, 26, 0.94)',
  cardSurfaceEnd: 'rgba(24, 15, 20, 0.92)',
  cardBorder: 'rgba(224, 83, 104, 0.35)',
  cardShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.60), 0 2px 6px -1px rgba(0, 0, 0, 0.35)',
  tortoiseBorder: 'rgba(224, 83, 104, 0.40)',
  overlayColor: 'rgba(10, 4, 6, 0.92)',
  bodyBg: '#0A0406',
  bodyText: '#F8F7F4',
  headerBg: 'rgba(26, 15, 20, 0.95)',
  navBg: 'rgba(26, 15, 20, 0.94)',
};

const THEME_STORAGE_KEY = 'guitar_academy_theme_preference';
const THEME_CHANGE_EVENT = 'guitar_academy_theme_changed';

let systemMediaListener: ((e: MediaQueryListEvent) => void) | null = null;

export const themeService = {
  getSavedTheme(): ThemeMode {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'light'; // Default to official porcelain conservatory palette
  },

  getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  },

  getEffectiveTheme(mode?: ThemeMode): 'light' | 'dark' {
    const active = mode || this.getSavedTheme();
    if (active === 'system') {
      return this.getSystemTheme();
    }
    return active;
  },

  applyTheme(mode: ThemeMode): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors in restricted contexts
    }

    const effective = this.getEffectiveTheme(mode);
    const colors = effective === 'dark' ? DARK_THEME : LIGHT_THEME;
    const root = document.documentElement;

    // 1. Atualizar atributos e classes do elemento raiz
    root.setAttribute('data-theme', effective);
    root.setAttribute('data-theme-preference', mode);
    root.classList.toggle('dark', effective === 'dark');

    // 2. Atualizar variáveis CSS diretamente no :root para feedback dinâmico imediato
    root.style.setProperty('--bg-porcelain', colors.bgPorcelain);
    root.style.setProperty('--surface-white', colors.surfaceWhite);
    root.style.setProperty('--red-wine', colors.redWine);
    root.style.setProperty('--red-cherry', colors.redCherry);
    root.style.setProperty('--text-graphite', colors.textGraphite);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--border-silver', colors.borderSilver);
    root.style.setProperty('--rose-soft', colors.roseSoft);
    root.style.setProperty('--rose-subtle', colors.roseSubtle);
    root.style.setProperty('--card-surface', colors.cardSurface);
    root.style.setProperty('--card-surface-end', colors.cardSurfaceEnd);
    root.style.setProperty('--card-border', colors.cardBorder);
    root.style.setProperty('--card-shadow', colors.cardShadow);
    root.style.setProperty('--tortoise-border', colors.tortoiseBorder);
    root.style.setProperty('--overlay-color', colors.overlayColor);
    root.style.setProperty('--body-bg', colors.bodyBg);
    root.style.setProperty('--body-text', colors.bodyText);
    root.style.setProperty('--header-bg', colors.headerBg);
    root.style.setProperty('--nav-bg', colors.navBg);

    // 3. Gerenciar listener de mudança do sistema operacional
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (systemMediaListener) {
        mediaQuery.removeEventListener('change', systemMediaListener);
        systemMediaListener = null;
      }
      if (mode === 'system') {
        systemMediaListener = () => {
          this.applyTheme('system');
        };
        mediaQuery.addEventListener('change', systemMediaListener);
      }
    }

    // 4. Notificar ouvintes da aplicação
    window.dispatchEvent(
      new CustomEvent(THEME_CHANGE_EVENT, {
        detail: { mode, effectiveTheme: effective, colors },
      })
    );
  },

  toggleTheme(): ThemeMode {
    const current = this.getSavedTheme();
    const effective = this.getEffectiveTheme(current);
    const next: ThemeMode = effective === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    return next;
  },

  subscribe(callback: (detail: { mode: ThemeMode; effectiveTheme: 'light' | 'dark'; colors: ThemeColors }) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode: ThemeMode; effectiveTheme: 'light' | 'dark'; colors: ThemeColors }>;
      callback(customEvent.detail);
    };
    window.addEventListener(THEME_CHANGE_EVENT, handler);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handler);
  },
};

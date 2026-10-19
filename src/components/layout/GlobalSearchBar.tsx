import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Guitar, 
  Compass, 
  ArrowRight, 
  CornerDownLeft, 
  Trash2 
} from 'lucide-react';
import { 
  searchAll, 
  SearchResultItem, 
  QUICK_SEARCH_SUGGESTIONS 
} from '../../services/searchService';
import { storageService } from '../../services/storageService';
import { NavigationTab } from '../../types';

interface GlobalSearchBarProps {
  onSelectLesson: (lessonId: string) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectChord?: (chordSymbol: string, chordId?: string) => void;
  onSelectTheoryTopic?: (topic: string, key?: string) => void;
  focusTrigger?: number;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onSelectLesson,
  onNavigateTab,
  onSelectChord,
  onSelectTheoryTopic,
  focusTrigger,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isMac, setIsMac] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Detect platform for shortcut label (⌘K vs Ctrl+K)
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  // React to external focus trigger from App.tsx (Ctrl+K or Cmd+K)
  useEffect(() => {
    if (focusTrigger && focusTrigger > 0) {
      setIsOpen(true);
      const applyFocusAndSelect = () => {
        const target = (window.innerWidth < 640 ? mobileInputRef.current : inputRef.current) ||
          (document.getElementById('global-search-input') as HTMLInputElement | null) ||
          (document.getElementById('global-search-mobile-input') as HTMLInputElement | null);
        if (target) {
          target.focus();
          target.select();
        }
      };

      applyFocusAndSelect();
      setTimeout(applyFocusAndSelect, 25);
      setTimeout(applyFocusAndSelect, 60);
    }
  }, [focusTrigger]);

  // Load recent searches on mount and when opening
  useEffect(() => {
    setRecentSearches(storageService.getRecentSearches());
  }, [isOpen]);

  // Global keyboard shortcuts (Ctrl+K, Cmd+K, '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement as HTMLElement)?.isContentEditable;

      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => {
          if (window.innerWidth < 640) {
            mobileInputRef.current?.focus();
            mobileInputRef.current?.select();
          } else {
            inputRef.current?.focus();
            inputRef.current?.select();
          }
        }, 50);
        return;
      }

      // Quick slash shortcut '/' if not typing in an input
      if (e.key === '/' && !isInputActive) {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => {
          if (window.innerWidth < 640) {
            mobileInputRef.current?.focus();
            mobileInputRef.current?.select();
          } else {
            inputRef.current?.focus();
            inputRef.current?.select();
          }
        }, 50);
        return;
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        mobileInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Click outside to close (desktop dropdown)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // Only auto-close on desktop outside clicks, mobile has dedicated close button/backdrop
        if (window.innerWidth >= 640) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Search results
  const searchResults = useMemo(() => {
    return searchAll(query, 18);
  }, [query]);

  // Flat list of items for arrow navigation
  const flatItems: SearchResultItem[] = searchResults.all;

  // Handle keyboard navigation inside search input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      setIsOpen(true);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && flatItems[highlightedIndex]) {
        handleSelectItem(flatItems[highlightedIndex]);
      } else if (flatItems.length > 0) {
        handleSelectItem(flatItems[0]);
      } else if (query.trim()) {
        const updated = storageService.addRecentSearch(query.trim());
        setRecentSearches(updated);
      }
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    // Save search query or item title to local history
    const termToSave = query.trim() || item.title;
    const updated = storageService.addRecentSearch(termToSave);
    setRecentSearches(updated);

    // Route based on item type
    if (item.type === 'lesson' && item.lessonId) {
      onSelectLesson(item.lessonId);
      onNavigateTab('curriculum');
    } else if (item.type === 'chord' && item.chordSymbol) {
      if (onSelectChord) {
        onSelectChord(item.chordSymbol, item.chordId);
      }
      onNavigateTab('chords');
    } else if (item.type === 'theory') {
      if (onSelectTheoryTopic) {
        onSelectTheoryTopic(item.title, item.theoryKey);
      }
      onNavigateTab('theory');
    }

    setIsOpen(false);
    setQuery('');
    setHighlightedIndex(-1);
    inputRef.current?.blur();
    mobileInputRef.current?.blur();
  };

  const handleSelectRecentTerm = (term: string) => {
    setQuery(term);
    setIsOpen(true);
    setTimeout(() => {
      if (window.innerWidth < 640) {
        mobileInputRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }, 50);
  };

  const handleRemoveRecentTerm = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = storageService.removeRecentSearch(term);
    setRecentSearches(updated);
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.clearRecentSearches();
    setRecentSearches([]);
  };

  // Reusable search results list markup for both desktop dropdown and mobile overlay
  const renderResultsList = () => (
    <>
      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite">
        {query.trim()
          ? `${searchResults.totalCount} resultados encontrados para ${query}`
          : 'Sugestões e histórico de buscas disponíveis'}
      </div>

      {/* When query is empty: Recent Searches & Quick Suggestions */}
      {!query.trim() && (
        <div className="p-3.5 space-y-4 overflow-y-auto max-h-[60vh] sm:max-h-[50vh]">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#666672] px-1">
                <span className="flex items-center gap-1.5 text-[#25252A]">
                  <Clock className="w-3.5 h-3.5 text-[#7B1E2B]" aria-hidden="true" />
                  Últimas buscas
                </span>
                <button
                  onClick={handleClearAllRecent}
                  className="text-[11px] text-[#B52A3A] hover:underline flex items-center gap-1 focus:outline-hidden focus:ring-1 focus:ring-[#7B1E2B] rounded-xs px-1"
                  aria-label="Limpar histórico de pesquisas"
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                  Limpar
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5" role="list">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    onClick={() => handleSelectRecentTerm(term)}
                    role="listitem"
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] text-xs border border-[#D9D9D9] hover:border-[#E8D3D6] cursor-pointer transition select-none"
                    title={`Pesquisar novamente: ${term}`}
                  >
                    <Search className="w-3 h-3 text-[#7B1E2B] opacity-70 group-hover:opacity-100" aria-hidden="true" />
                    <span className="font-medium">{term}</span>
                    <button
                      onClick={(e) => handleRemoveRecentTerm(e, term)}
                      className="text-[#888892] hover:text-[#B52A3A] p-0.5 rounded-md hover:bg-white transition"
                      aria-label={`Remover ${term} do histórico`}
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#25252A] px-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" aria-hidden="true" />
              Sugestões de estudo rápido
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {QUICK_SEARCH_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSelectRecentTerm(sug)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:border-[#E8D3D6] text-left text-xs text-[#25252A] border border-[#D9D9D9] transition font-medium group focus:outline-hidden focus:ring-1 focus:ring-[#7B1E2B]"
                >
                  <span className="truncate">{sug}</span>
                  <ArrowRight className="w-3 h-3 text-[#7B1E2B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer instruction */}
          <div className="pt-2 border-t border-[#D9D9D9] flex items-center justify-between text-[11px] text-[#888892] px-1">
            <span>Dica: Pressione <kbd className="font-mono-code px-1 py-0.5 bg-[#F8F7F4] rounded border border-[#D9D9D9] text-[#25252A] font-bold">/</kbd> para pesquisar</span>
            <span className="hidden sm:inline">Esc para fechar</span>
          </div>
        </div>
      )}

      {/* When query has text: Categorized Results */}
      {query.trim() && (
        <div 
          id="search-results-listbox" 
          role="listbox" 
          aria-label="Resultados da pesquisa"
          className="overflow-y-auto divide-y divide-[#EAEAEA] max-h-[60vh] sm:max-h-[50vh]"
        >
          {/* Header result count */}
          <div className="px-4 py-2 bg-[#F8F7F4] text-xs font-bold text-[#666672] flex items-center justify-between border-b border-[#D9D9D9]">
            <span>
              {searchResults.totalCount > 0
                ? `${searchResults.totalCount} resultado${searchResults.totalCount > 1 ? 's' : ''} para "${query}"`
                : `Nenhum resultado para "${query}"`}
            </span>
            <span className="text-[10px] text-[#7B1E2B] font-mono-code hidden sm:inline">
              ↑↓ Navegar • ↵ Abrir
            </span>
          </div>

          {/* Empty state */}
          {searchResults.totalCount === 0 && (
            <div className="p-6 text-center space-y-2">
              <p className="text-sm font-bold text-[#25252A]">
                Nenhum resultado encontrado
              </p>
              <p className="text-xs text-[#666672] max-w-sm mx-auto leading-relaxed">
                Tente buscar por cifras (ex: <strong>C</strong>, <strong>Am</strong>, <strong>G7</strong>), temas de aula (ex: <strong>afinação</strong>, <strong>pestana</strong>) ou tópicos teóricos (ex: <strong>pentatônica</strong>, <strong>tríades</strong>).
              </p>
            </div>
          )}

          {/* 1. Aulas */}
          {searchResults.lessons.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#7B1E2B] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                Aulas do Currículo ({searchResults.lessons.length})
              </div>
              {searchResults.lessons.map((item) => {
                const itemIdx = flatItems.indexOf(item);
                const isHighlighted = itemIdx === highlightedIndex;
                return (
                  <button
                    key={item.id}
                    id={`search-option-${itemIdx}`}
                    role="option"
                    aria-selected={isHighlighted}
                    onClick={() => handleSelectItem(item)}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-start justify-between gap-3 focus:outline-hidden ${
                      isHighlighted
                        ? 'bg-[#F5E8EA] border border-[#E8D3D6] ring-1 ring-[#7B1E2B]/20'
                        : 'hover:bg-[#F8F7F4] border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#25252A] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6] shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#666672] truncate mt-0.5 font-medium">
                        {item.subtitle}
                      </p>
                      {item.detail && (
                        <span className="text-[10px] text-[#888892] block mt-0.5">
                          {item.detail}
                        </span>
                      )}
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#7B1E2B] shrink-0 mt-1 opacity-70" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. Acordes */}
          {searchResults.chords.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#7B1E2B] uppercase tracking-wider">
                <Guitar className="w-3.5 h-3.5" aria-hidden="true" />
                Dicionário de Acordes ({searchResults.chords.length})
              </div>
              {searchResults.chords.map((item) => {
                const itemIdx = flatItems.indexOf(item);
                const isHighlighted = itemIdx === highlightedIndex;
                return (
                  <button
                    key={item.id}
                    id={`search-option-${itemIdx}`}
                    role="option"
                    aria-selected={isHighlighted}
                    onClick={() => handleSelectItem(item)}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-start justify-between gap-3 focus:outline-hidden ${
                      isHighlighted
                        ? 'bg-[#F5E8EA] border border-[#E8D3D6] ring-1 ring-[#7B1E2B]/20'
                        : 'hover:bg-[#F8F7F4] border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#25252A] font-mono-code text-sm">
                          {item.chordSymbol}
                        </span>
                        <span className="text-xs font-bold text-[#666672] truncate">
                          {item.title.replace(item.chordSymbol + ' ', '')}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white text-[#25252A] border border-[#D9D9D9] shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#666672] truncate mt-0.5 font-medium">
                        {item.subtitle}
                      </p>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#7B1E2B] shrink-0 mt-1 opacity-70" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. Teoria Musical */}
          {searchResults.theory.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#7B1E2B] uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                Teoria Musical & Harmonia ({searchResults.theory.length})
              </div>
              {searchResults.theory.map((item) => {
                const itemIdx = flatItems.indexOf(item);
                const isHighlighted = itemIdx === highlightedIndex;
                return (
                  <button
                    key={item.id}
                    id={`search-option-${itemIdx}`}
                    role="option"
                    aria-selected={isHighlighted}
                    onClick={() => handleSelectItem(item)}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-start justify-between gap-3 focus:outline-hidden ${
                      isHighlighted
                        ? 'bg-[#F5E8EA] border border-[#E8D3D6] ring-1 ring-[#7B1E2B]/20'
                        : 'hover:bg-[#F8F7F4] border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#25252A] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F8F7F4] text-[#B52A3A] border border-[#D9D9D9] shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#666672] truncate mt-0.5 font-medium">
                        {item.subtitle}
                      </p>
                      {item.detail && (
                        <p className="text-[10px] text-[#888892] truncate mt-0.5">
                          {item.detail}
                        </p>
                      )}
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#7B1E2B] shrink-0 mt-1 opacity-70" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* 1. Mobile Search Trigger Button (Screens < 640px) */}
      <div className="sm:hidden flex items-center">
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => {
              mobileInputRef.current?.focus();
            }, 50);
          }}
          className="p-2 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] border border-[#D9D9D9] min-w-[40px] min-h-[40px] flex items-center justify-center transition shadow-2xs"
          aria-label="Abrir barra de busca de aulas, acordes e teoria"
          title="Pesquisar (Ctrl+K ou /)"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* 2. Desktop Search Input Bar (Screens >= 640px) */}
      <div ref={containerRef} className="hidden sm:block relative flex-1 max-w-md lg:max-w-lg mx-2">
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-results-listbox"
          className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl border transition-all duration-200 bg-[#F8F7F4] ${
            isOpen
              ? 'border-[#7B1E2B] bg-white ring-2 ring-[#7B1E2B]/15 shadow-sm'
              : 'border-[#D9D9D9] hover:border-[#B52A3A]/40'
          }`}
        >
          <Search className="w-4 h-4 text-[#7B1E2B] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(-1);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleInputKeyDown}
            placeholder="Pesquisar aulas, acordes, teoria..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#25252A] placeholder-[#888892] focus:outline-hidden font-medium"
            aria-label="Pesquisa global no Guitar Academy"
            aria-autocomplete="list"
            aria-activedescendant={highlightedIndex >= 0 ? `search-option-${highlightedIndex}` : undefined}
          />

          {/* Clear query button */}
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setHighlightedIndex(-1);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-[#666672] hover:text-[#25252A] hover:bg-[#EAEAEA] transition shrink-0"
              aria-label="Limpar texto da pesquisa"
              title="Limpar pesquisa"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}

          {/* Keyboard shortcut hint badge */}
          <div className="flex items-center gap-0.5 text-[10px] font-mono-code font-bold text-[#7B1E2B] bg-[#F5E8EA] px-1.5 py-0.5 rounded-md border border-[#E8D3D6] shrink-0 select-none">
            <span>{isMac ? '⌘K' : 'Ctrl+K'}</span>
          </div>
        </div>

        {/* Desktop Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#D9D9D9] shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col">
            {renderResultsList()}
          </div>
        )}
      </div>

      {/* 3. Mobile Search Fullscreen Modal (Screens < 640px) */}
      {isOpen && (
        <div 
          className="sm:hidden fixed inset-0 z-50 bg-[#25252A]/50 backdrop-blur-xs flex flex-col p-3 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Pesquisa global de aulas, acordes e teoria"
        >
          <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-2xl flex flex-col overflow-hidden max-h-[85vh] mt-2">
            {/* Modal Input Header */}
            <div className="p-3 border-b border-[#D9D9D9] flex items-center gap-2 bg-[#F8F7F4]">
              <div 
                role="combobox"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-controls="search-results-listbox"
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#7B1E2B] ring-2 ring-[#7B1E2B]/15"
              >
                <Search className="w-4 h-4 text-[#7B1E2B] shrink-0" aria-hidden="true" />
                <input
                  ref={mobileInputRef}
                  id="global-search-mobile-input"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Pesquisar aulas, acordes, teoria..."
                  className="w-full bg-transparent text-sm text-[#25252A] placeholder-[#888892] focus:outline-hidden font-medium"
                  aria-label="Pesquisa global no Guitar Academy"
                  aria-autocomplete="list"
                  aria-activedescendant={highlightedIndex >= 0 ? `search-option-${highlightedIndex}` : undefined}
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setHighlightedIndex(-1);
                      mobileInputRef.current?.focus();
                    }}
                    className="p-1 rounded-md text-[#666672] hover:text-[#25252A] transition"
                    aria-label="Limpar texto da pesquisa"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Close Modal Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className="px-3 py-2 rounded-xl bg-white hover:bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold border border-[#D9D9D9] transition min-h-[40px] flex items-center justify-center shrink-0"
                aria-label="Fechar janela de pesquisa"
              >
                Fechar
              </button>
            </div>

            {/* Results Content */}
            {renderResultsList()}
          </div>
        </div>
      )}
    </>
  );
};

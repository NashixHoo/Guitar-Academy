import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ResolvedChordModalData,
  ChordModalTriggerInput,
  resolveChordForModal,
} from '../services/chordLookupService';

interface ChordModalContextValue {
  activeChord: ResolvedChordModalData | null;
  isOpen: boolean;
  toggleChord: (input: ChordModalTriggerInput) => void;
  openChord: (input: ChordModalTriggerInput) => void;
  closeChord: () => void;
  isChordOpen: (input: ChordModalTriggerInput) => boolean;
  favoriteChords: string[];
  onToggleFavorite?: (chordId: string) => void;
}

const ChordModalContext = createContext<ChordModalContextValue | null>(null);

interface ChordModalProviderProps {
  children: React.ReactNode;
  favoriteChords?: string[];
  onToggleFavorite?: (chordId: string) => void;
}

export const ChordModalProvider: React.FC<ChordModalProviderProps> = ({
  children,
  favoriteChords = [],
  onToggleFavorite,
}) => {
  const [activeChord, setActiveChord] = useState<ResolvedChordModalData | null>(null);

  const toggleChord = useCallback((input: ChordModalTriggerInput) => {
    const resolved = resolveChordForModal(input);
    if (!resolved) return;

    setActiveChord((prev) => {
      if (prev && prev.matchKey === resolved.matchKey) {
        return null;
      }
      return resolved;
    });
  }, []);

  const openChord = useCallback((input: ChordModalTriggerInput) => {
    const resolved = resolveChordForModal(input);
    if (!resolved) return;
    setActiveChord(resolved);
  }, []);

  const closeChord = useCallback(() => {
    setActiveChord(null);
  }, []);

  const isChordOpen = useCallback(
    (input: ChordModalTriggerInput) => {
      if (!activeChord) return false;
      const resolved = resolveChordForModal(input);
      return Boolean(resolved && resolved.matchKey === activeChord.matchKey);
    },
    [activeChord]
  );

  useEffect(() => {
    if (!activeChord) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveChord(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChord]);

  return (
    <ChordModalContext.Provider
      value={{
        activeChord,
        isOpen: Boolean(activeChord),
        toggleChord,
        openChord,
        closeChord,
        isChordOpen,
        favoriteChords,
        onToggleFavorite,
      }}
    >
      {children}
    </ChordModalContext.Provider>
  );
};

export function useChordModal(): ChordModalContextValue {
  const ctx = useContext(ChordModalContext);
  if (!ctx) {
    throw new Error('useChordModal must be used inside ChordModalProvider');
  }
  return ctx;
}

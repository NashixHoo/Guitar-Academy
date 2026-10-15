// =============================================================
// GUITAR ACADEMY / VIRTUO CHORD ENGINE: EASY PLAY & SMART KEY INTEGRATION
// src/chords/easy-play-integration.ts
// =============================================================

import { parseChordSymbol, buildChord, ConstructedChord } from './chord-builder';
import { getChordShapes, ChordShapeDef } from './shapes';

export interface EasyPlayResult {
  originalChord: string;
  originalDetails: ConstructedChord | null;
  easyChord: string;
  easyDetails: ConstructedChord | null;
  isSimplified: boolean;
  easyQuality: string;
}

export function toEasyPlay(chordInput: string | { symbol?: string }): EasyPlayResult {
  const originalSymbol =
    typeof chordInput === 'string'
      ? chordInput.trim()
      : chordInput?.symbol || 'C';

  const parsed = parseChordSymbol(originalSymbol);
  if (!parsed) {
    return {
      originalChord: originalSymbol,
      originalDetails: null,
      easyChord: originalSymbol,
      easyDetails: null,
      isSimplified: false,
      easyQuality: 'major'
    };
  }

  const isMinor =
    parsed.quality.includes('minor') ||
    parsed.quality === 'diminished' ||
    parsed.quality === 'minor7';

  const easyQuality = isMinor ? 'minor' : 'major';
  const easyChordObj = buildChord(parsed.root, easyQuality);
  const easySymbol = easyChordObj ? easyChordObj.symbol : parsed.root;

  return {
    originalChord: originalSymbol,
    originalDetails: parsed,
    easyChord: easySymbol,
    easyDetails: easyChordObj,
    isSimplified: originalSymbol !== easySymbol,
    easyQuality
  };
}

export function getSmartKeySubstitutions(
  chordSymbol: string,
  instrumentId = 'electric-guitar'
): {
  originalChord: string;
  easyPlay: EasyPlayResult;
  recommendedShape: ChordShapeDef | null;
  alternativeShapes: ChordShapeDef[];
  easyShapes: ChordShapeDef[];
  hasOpenPosition: boolean;
} {
  const clean = chordSymbol ? chordSymbol.trim() : 'C';
  const easy = toEasyPlay(clean);
  const shapes = getChordShapes(clean, instrumentId);
  const easyShapes = easy.isSimplified ? getChordShapes(easy.easyChord, instrumentId) : shapes;

  const beginnerShapes = shapes.filter((s) => s.difficulty === 'beginner');
  const recommendedShape = beginnerShapes[0] || shapes[0] || null;

  return {
    originalChord: clean,
    easyPlay: easy,
    recommendedShape,
    alternativeShapes: shapes,
    easyShapes,
    hasOpenPosition: shapes.some((s) => s.position === 'open')
  };
}

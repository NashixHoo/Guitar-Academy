// =============================================================
// GUITAR ACADEMY / VIRTUO CHORD ENGINE: CHORD BUILDER
// src/chords/chord-builder.ts
// =============================================================

import { normalizeNote, CHROMATIC_SCALE, NOTE_TO_SEMITONE } from './notes';
import { resolveQuality, ChordQuality } from './qualities';

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NATURAL_SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const DIATONIC_STEPS: Record<number, number> = {
  0: 0,
  1: 1, 2: 1,
  3: 2, 4: 2,
  5: 3,
  6: 4,
  7: 4, 8: 4,
  9: 5,
  10: 6, 11: 6,
  12: 0,
  13: 1, 14: 1,
  17: 3, 18: 3,
  20: 5, 21: 5
};

export interface ConstructedChord {
  id: string;
  root: string;
  quality: string;
  qualityName: string;
  intervals: number[];
  notes: string[];
  symbol: string;
  bass: string | null;
}

function getTheoreticalNote(root: string, semitoneInterval: number, qualityId = ''): string {
  const rootLetter = root.charAt(0).toUpperCase();
  const rootLetterIdx = LETTERS.indexOf(rootLetter);
  if (rootLetterIdx === -1) return '';

  const rootSemi = NOTE_TO_SEMITONE[normalizeNote(root)];
  if (rootSemi === undefined) return '';

  let step = DIATONIC_STEPS[semitoneInterval] ?? Math.floor((semitoneInterval % 12) / 2);
  if (semitoneInterval === 8 && qualityId === 'minor6') {
    step = 5;
  }
  if (semitoneInterval === 9 && qualityId === 'diminished7') {
    step = 6;
  }

  const targetLetter = LETTERS[(rootLetterIdx + step) % 7];
  const naturalSemi = NATURAL_SEMITONES[targetLetter];
  const targetSemi = (rootSemi + semitoneInterval) % 12;
  const diff = (targetSemi - naturalSemi + 12) % 12;

  if (diff === 0) return targetLetter;
  if (diff === 1) return `${targetLetter}#`;
  if (diff === 2) return `${targetLetter}##`;
  if (diff === 11) return `${targetLetter}b`;
  if (diff === 10) return `${targetLetter}bb`;
  return CHROMATIC_SCALE[targetSemi];
}

/**
 * Constrói teoricamente um acorde musical completo a partir de sua fundamental e qualidade.
 */
export function buildChord(
  root: string,
  quality: string | ChordQuality = 'major',
  bass: string | null = null
): ConstructedChord | null {
  if (!root || typeof root !== 'string') return null;
  const cleanRoot = root.trim().charAt(0).toUpperCase() + root.trim().slice(1);
  const qObj = typeof quality === 'object' && quality !== null ? quality : resolveQuality(quality);
  if (!qObj) return null;

  const notes = qObj.intervals.map((semitones) =>
    getTheoreticalNote(cleanRoot, semitones, qObj.id)
  );

  let symbol = cleanRoot + qObj.symbol;
  let cleanBass: string | null = null;
  if (bass && typeof bass === 'string') {
    cleanBass = bass.trim().charAt(0).toUpperCase() + bass.trim().slice(1);
    symbol += `/${cleanBass}`;
  }

  const id = `${cleanRoot}_${qObj.id}${cleanBass ? `_${cleanBass}` : ''}`;
  return {
    id,
    root: cleanRoot,
    quality: qObj.id,
    qualityName: qObj.name,
    intervals: [...qObj.intervals],
    notes,
    symbol,
    bass: cleanBass
  };
}

/**
 * Reconhece a raiz, qualidade e baixo a partir de uma cifra em texto (ex: 'Cmaj7', 'D/F#', 'Bbm7')
 */
export function parseChordSymbol(symbol: string): ConstructedChord | null {
  if (!symbol || typeof symbol !== 'string') return null;
  const clean = symbol.trim();
  const match = clean.match(/^([A-Ga-g][b#]?)([^/]*)(?:\/([A-Ga-g][b#]?))?$/);
  if (!match) return null;

  const root = match[1].charAt(0).toUpperCase() + match[1].slice(1);
  const qualityStr = match[2] || '';
  const bass = match[3] ? match[3].charAt(0).toUpperCase() + match[3].slice(1) : null;

  const qObj = resolveQuality(qualityStr);
  if (!qObj) return null;

  return buildChord(root, qObj.id, bass);
}

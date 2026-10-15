// =============================================================
// GUITAR ACADEMY / VIRTUO CHORD ENGINE: TRANSPOSER
// src/chords/transposer.ts
// =============================================================

import { normalizeNote, NOTE_TO_SEMITONE, CHROMATIC_SCALE, CHROMATIC_SCALE_FLATS } from './notes';
import { parseChordSymbol, buildChord, ConstructedChord } from './chord-builder';

export function transposeNote(note: string, semitones = 0, preferFlats: boolean | null = null): string {
  if (!note || semitones === 0) return note;
  const clean = note.trim();
  const semi = NOTE_TO_SEMITONE[clean] ?? NOTE_TO_SEMITONE[normalizeNote(clean)];
  if (semi === undefined) return note;

  let targetSemi = (semi + semitones) % 12;
  if (targetSemi < 0) targetSemi += 12;

  let useFlats = false;
  if (preferFlats !== null) {
    useFlats = preferFlats;
  } else if (clean.includes('b')) {
    useFlats = true;
  }

  const scale = useFlats ? CHROMATIC_SCALE_FLATS : CHROMATIC_SCALE;
  return scale[targetSemi];
}

export function transposeChord(
  chord: string | ConstructedChord,
  semitones = 0,
  preferFlats: boolean | null = null
): string {
  if (!chord || semitones === 0) {
    return typeof chord === 'string' ? chord : chord.symbol;
  }

  const symbol = typeof chord === 'string' ? chord : chord.symbol;
  const parsed = parseChordSymbol(symbol);
  if (!parsed) return symbol;

  const newRoot = transposeNote(parsed.root, semitones, preferFlats);
  const newBass = parsed.bass ? transposeNote(parsed.bass, semitones, preferFlats) : null;
  const transposed = buildChord(newRoot, parsed.quality, newBass);

  return transposed ? transposed.symbol : symbol;
}

export function transposeProgression(
  progression: string[] | string,
  semitones = 0,
  preferFlats: boolean | null = null
): string[] | string {
  if (!progression || semitones === 0) return progression;

  if (Array.isArray(progression)) {
    return progression.map((c) => transposeChord(c, semitones, preferFlats));
  }

  if (typeof progression === 'string') {
    const tokens = progression.trim().split(/(\s+|-|,)/);
    const transposedTokens = tokens.map((token) => {
      if (/^[A-Ga-g][b#]?/.test(token.trim())) {
        return transposeChord(token.trim(), semitones, preferFlats);
      }
      return token;
    });
    return transposedTokens.join('');
  }

  return progression;
}

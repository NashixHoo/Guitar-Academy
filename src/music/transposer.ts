// =============================================================
// GUITAR ACADEMY / VIRTUO MUSICAL ENGINE: TRANSPOSER
// src/music/transposer.ts
// Motor de transposição harmônica baseada em semitons
// =============================================================

import {
  NOTE_TO_SEMITONE,
  SHARPS_SCALE,
  FLATS_SCALE,
  parseChord,
  isChordLine,
  CHORD_FINDER_REGEX
} from './chord-parser';

const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];

export function transposeNote(note: string, semitones = 0, preferFlats: boolean | null = null): string {
  if (!note || semitones === 0) return note;
  const cleanNote = note.trim();
  const currentSemitone = NOTE_TO_SEMITONE[cleanNote];
  if (currentSemitone === undefined) return note;

  let targetSemitone = (currentSemitone + semitones) % 12;
  if (targetSemitone < 0) targetSemitone += 12;

  let useFlats = false;
  if (preferFlats !== null) {
    useFlats = preferFlats;
  } else if (cleanNote.includes('b')) {
    useFlats = true;
  }

  return useFlats ? FLATS_SCALE[targetSemitone] : SHARPS_SCALE[targetSemitone];
}

export function transposeChord(chord: string, semitones = 0, preferFlats: boolean | null = null): string {
  if (!chord || semitones === 0) return chord;
  const parsed = parseChord(chord);
  if (parsed) {
    const newRoot = transposeNote(parsed.root, semitones, preferFlats);
    const newBass = parsed.bass ? transposeNote(parsed.bass, semitones, preferFlats) : null;
    return `${newRoot}${parsed.modifier}${newBass ? '/' + newBass : ''}`;
  }

  return chord.replace(CHORD_FINDER_REGEX, (full, root, modifier = '', slash = '') => {
    const newRoot = transposeNote(root, semitones, preferFlats);
    let newSlash = '';
    if (slash) {
      newSlash = '/' + transposeNote(slash, semitones, preferFlats);
    }
    return `${newRoot}${modifier}${newSlash}`;
  });
}

function transposeChordLineAligned(line: string, semitones: number, preferFlats: boolean | null): string {
  const regex = new RegExp(CHORD_FINDER_REGEX.source, 'g');
  const matches: { index: number; raw: string; length: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = regex.exec(line)) !== null) {
    matches.push({
      index: m.index,
      raw: m[0],
      length: m[0].length
    });
  }

  if (matches.length === 0) return line;

  let result = '';
  let lastIndex = 0;
  let charDelta = 0;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    let beforeText = line.substring(lastIndex, match.index);

    if (charDelta > 0) {
      const spacesAvailable = (beforeText.match(/ +$/) || [''])[0].length;
      const spacesToRemove = Math.min(charDelta, spacesAvailable > 2 ? spacesAvailable - 2 : 0);
      if (spacesToRemove > 0) {
        beforeText = beforeText.slice(0, -spacesToRemove);
        charDelta -= spacesToRemove;
      }
    } else if (charDelta < 0) {
      const spacesToAdd = -charDelta;
      beforeText = beforeText + ' '.repeat(spacesToAdd);
      charDelta = 0;
    }

    result += beforeText;
    const transposed = transposeChord(match.raw, semitones, preferFlats);
    result += transposed;
    charDelta += transposed.length - match.length;
    lastIndex = match.index + match.length;
  }

  result += line.substring(lastIndex);
  return result;
}

export function transposeChordSheet(
  sheet: string | string[],
  semitones = 0,
  targetKeyReference = ''
): string | string[] {
  if (!sheet || semitones === 0) return sheet;
  const preferFlats = targetKeyReference ? FLAT_KEYS.includes(targetKeyReference) : null;

  if (Array.isArray(sheet)) {
    return sheet.map((c) => (typeof c === 'string' ? transposeChord(c, semitones, preferFlats) : c));
  }

  const sheetStr = typeof sheet === 'string' ? sheet : String(sheet || '');
  return sheetStr
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      const sectionMatch = line.match(/^(\s*\[[^\]]+\]\s*)(.*)$/);
      if (sectionMatch) {
        const tag = sectionMatch[1];
        const rest = sectionMatch[2];
        if (rest.trim().length === 0) {
          return line;
        }
        const transposedRest = transposeChordLineAligned(rest, semitones, preferFlats);
        return `${tag}${transposedRest}`;
      }

      if (/\[[A-G][b#]?[^\]]*\]/.test(line)) {
        return line.replace(/\[([A-G][b#]?[^\]]*)\]/g, (full, chordInside) => {
          return `[${transposeChord(chordInside, semitones, preferFlats)}]`;
        });
      }

      if (isChordLine(line)) {
        return transposeChordLineAligned(line, semitones, preferFlats);
      }

      return line;
    })
    .join('\n');
}

export function calculateKey(originalKey: string, semitones = 0): string {
  if (!originalKey) return 'G';
  if (semitones === 0) return originalKey;
  const parsed = parseChord(originalKey);
  if (!parsed) {
    return transposeNote(originalKey, semitones);
  }
  const newRoot = transposeNote(parsed.root, semitones);
  return `${newRoot}${parsed.modifier}`;
}

export function getSemitoneDistance(fromKey: string, toKey: string): number {
  const fromClean = (fromKey || '').replace(/m.*$/, '');
  const toClean = (toKey || '').replace(/m.*$/, '');
  const fromSemi = NOTE_TO_SEMITONE[fromClean];
  const toSemi = NOTE_TO_SEMITONE[toClean];
  if (fromSemi === undefined || toSemi === undefined) return 0;
  let diff = (toSemi - fromSemi) % 12;
  if (diff > 6) diff -= 12;
  if (diff < -6) diff += 12;
  return diff;
}

// =============================================================
// GUITAR ACADEMY / VIRTUO MUSICAL ENGINE: CHORD PARSER
// src/music/chord-parser.ts
// Reconhece, analisa e valida acordes musicais com extensões e baixos
// =============================================================

export const ROOT_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

export const NOTE_TO_SEMITONE: Record<string, number> = {
  'C': 0, 'B#': 0,
  'C#': 1, 'Db': 1,
  'D': 2,
  'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4,
  'F': 5, 'E#': 5,
  'F#': 6, 'Gb': 6,
  'G': 7,
  'G#': 8, 'Ab': 8,
  'A': 9,
  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11
};

export const SHARPS_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const FLATS_SCALE  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

/**
 * Regex canônica para detectar acorde individual.
 * Grupo 1: Raiz (ex: C, C#, Bb)
 * Grupo 2: Qualidade / Extensão combinada completa
 * Grupo 3: Nota do baixo com barra omitida (ex: F#, B)
 */
export const CHORD_REGEX = /^([A-G][b#]?)((?:m(?:aj|in)?|M(?:aj)?|dim|aug|sus[24]?|add[0-9]+|[0-9]+|°|\+|-(?:[0-9]+)?|\([^\)]+\))*)(?:\/([A-G][b#]?))?$/;

/**
 * Regex para encontrar acordes em uma linha de texto.
 */
export const CHORD_FINDER_REGEX = /\b([A-G][b#]?)((?:m(?:aj|in)?|M(?:aj)?|dim|aug|sus[24]?|add[0-9]+|[0-9]+|°|\+|-(?:[0-9]+)?|\([^\)]+\))*)(?:\/([A-G][b#]?))?(?=\s|[,\)\]\.;]|$|\b)/g;

export interface ParsedChordDetails {
  raw: string;
  root: string;
  modifier: string;
  bass: string | null;
  isMinor: boolean;
  hasSlash: boolean;
}

export function parseChord(token: string): ParsedChordDetails | null {
  if (!token || typeof token !== 'string') return null;
  const clean = token.trim();
  const match = clean.match(CHORD_REGEX);
  if (!match) return null;

  const root = match[1];
  const modifier = match[2] || '';
  const bass = match[3] || null;
  const isMinor =
    (modifier.startsWith('m') && !modifier.startsWith('maj') && !modifier.startsWith('min')) ||
    modifier.startsWith('min') ||
    modifier.startsWith('-');

  return {
    raw: clean,
    root,
    modifier,
    bass,
    isMinor,
    hasSlash: !!bass
  };
}

export function isChordToken(token: string): boolean {
  return parseChord(token) !== null;
}

/**
 * Identifica se uma linha é uma linha exclusiva/predominante de acordes
 * ou se é uma linha de letra (evita transpor palavras em português como 'E', 'A', 'Em').
 */
export function isChordLine(line: string): boolean {
  if (!line || typeof line !== 'string') return false;
  const trimmed = line.trim();
  if (!trimmed) return false;

  // Linhas com tags como [Intro] G C D ou [Refrão] G Em
  if (trimmed.startsWith('[') && trimmed.includes(']')) {
    const afterTag = trimmed.replace(/^\[[^\]]+\]\s*/, '').trim();
    if (afterTag.length === 0) return false;
    return isChordLine(afterTag);
  }

  const tokens = trimmed.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length === 0) return false;

  let chordCount = 0;
  for (const token of tokens) {
    const cleanToken = token.replace(/^[\[\(\{]+|[\]\)\},;:]+$/g, '');
    if (isChordToken(cleanToken)) {
      chordCount++;
    }
  }

  return chordCount / tokens.length >= 0.6;
}

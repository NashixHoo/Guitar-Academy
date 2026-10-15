// =============================================================
// GUITAR ACADEMY / VIRTUO CHORD ENGINE: NOTES & PITCH CONVERSIONS
// src/chords/notes.ts
// =============================================================

export const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const CHROMATIC_SCALE_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

export const ENHARMONIC_EQUIVALENTS: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
  'B#': 'C',
  'Cb': 'B',
  'E#': 'F',
  'Fb': 'E'
};

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

export const CIPHER_TO_PT: Record<string, string> = {
  'C': 'Dó', 'C#': 'Dó#', 'Db': 'Réb',
  'D': 'Ré', 'D#': 'Ré#', 'Eb': 'Mib',
  'E': 'Mi',
  'F': 'Fá', 'F#': 'Fá#', 'Gb': 'Solb',
  'G': 'Sol', 'G#': 'Sol#', 'Ab': 'Láb',
  'A': 'Lá', 'A#': 'Lá#', 'Bb': 'Sib',
  'B': 'Si'
};

/**
 * Normaliza uma nota para representação padrão em sustenidos (ex: Db -> C#).
 */
export function normalizeNote(note: string): string {
  if (!note) return '';
  const clean = note.trim();
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  return ENHARMONIC_EQUIVALENTS[capitalized] && capitalized.includes('b')
    ? ENHARMONIC_EQUIVALENTS[capitalized]
    : capitalized;
}

/**
 * Retorna o equivalente enarmônico (ex: C# -> Db).
 */
export function enharmonicEquivalent(note: string): string {
  if (!note) return '';
  const clean = note.trim();
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  return ENHARMONIC_EQUIVALENTS[capitalized] || capitalized;
}

/**
 * Converte nota com oitava (ex: 'A4', 'E2') para número MIDI.
 * A4 = 69, C4 = 60, E2 = 40.
 */
export function noteToMidi(noteWithOctave: string): number {
  if (!noteWithOctave) return 0;
  const match = noteWithOctave.trim().match(/^([A-G][b#]?)(-?[0-9]+)$/);
  if (!match) return 0;
  const noteName = match[1];
  const octave = parseInt(match[2], 10);
  const semi = NOTE_TO_SEMITONE[noteName] ?? NOTE_TO_SEMITONE[normalizeNote(noteName)];
  if (semi === undefined) return 0;
  return (octave + 1) * 12 + semi;
}

/**
 * Converte número MIDI para nota com oitava (ex: 69 -> 'A4', 60 -> 'C4', 40 -> 'E2').
 */
export function midiToNote(midiNumber: number, useFlats = false): string {
  const noteIndex = ((midiNumber % 12) + 12) % 12;
  const octave = Math.floor(midiNumber / 12) - 1;
  const scale = useFlats ? CHROMATIC_SCALE_FLATS : CHROMATIC_SCALE;
  return `${scale[noteIndex]}${octave}`;
}

/**
 * Distância em semitons entre duas notas (0 a 11).
 */
export function getSemitoneDistance(fromNote: string, toNote: string): number {
  const s1 = NOTE_TO_SEMITONE[fromNote] ?? NOTE_TO_SEMITONE[normalizeNote(fromNote)] ?? 0;
  const s2 = NOTE_TO_SEMITONE[toNote] ?? NOTE_TO_SEMITONE[normalizeNote(toNote)] ?? 0;
  let diff = (s2 - s1) % 12;
  if (diff < 0) diff += 12;
  return diff;
}

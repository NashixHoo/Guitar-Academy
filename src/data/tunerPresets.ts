// =============================================================
// GUITAR ACADEMY — MASTER TUNER V2: PRESETS & INSTRUMENT DATABASE
// src/data/tunerPresets.ts
//
// Suporte completo aos instrumentos de cordas do conservatório:
// Guitarra Elétrica, Violão, Contrabaixo Elétrico (4, 5 e 6 cordas),
// Ukulele (Soprano, Concerto, Tenor, Barítono), Violino, Viola,
// Violoncelo, Contrabaixo Acústico, Bandolim, Banjo (5C e 4C) e
// Afinações Personalizadas (armazenadas em localStorage).
// =============================================================

export type InstrumentCategory =
  | 'guitar'
  | 'acoustic'
  | 'bass'
  | 'ukulele'
  | 'strings_bowed'
  | 'folk'
  | 'custom'
  | 'chromatic';

export interface TunerString {
  stringNumber: number; // Ex: 6, 5, 4, 3, 2, 1
  note: string; // Ex: 'E', 'A', 'D', 'G', 'B', 'C#'
  notePt: string; // Ex: 'Mi', 'Lá', 'Ré', 'Sol', 'Si', 'Dó#'
  octave: number; // Ex: 2
  label: string; // Ex: '6ª Corda (Grave)'
  shortName?: string; // Ex: '6E' ou '5g'
}

export interface TunerPreset {
  id: string;
  name: string;
  description: string;
  instrumentId: string;
  instrumentName: string;
  category: InstrumentCategory;
  strings: TunerString[];
  recommendedLowCutoff?: number; // Hz
  recommendedHighCutoff?: number; // Hz
  isCustom?: boolean;
}

export interface InstrumentDefinition {
  id: string;
  name: string;
  shortName: string;
  category: InstrumentCategory;
  icon: string;
  description: string;
  defaultPresetId: string;
  presets: TunerPreset[];
}

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const NOTE_NAMES_PT: Record<string, string> = {
  'C': 'Dó', 'C#': 'Dó#', 'Db': 'Réb',
  'D': 'Ré', 'D#': 'Ré#', 'Eb': 'Mib',
  'E': 'Mi',
  'F': 'Fá', 'F#': 'Fá#', 'Gb': 'Solb',
  'G': 'Sol', 'G#': 'Sol#', 'Ab': 'Láb',
  'A': 'Lá', 'A#': 'Lá#', 'Bb': 'Sib',
  'B': 'Si'
};

export const ENHARMONIC_EQUIVALENTS: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#'
};

/**
 * Calcula a frequência exata em ponto flutuante (sem arredondamento) de uma nota e oitava baseada em A4.
 */
export function calculateExactFrequency(note: string, octave: number, a4 = 440, cents = 0): number {
  let normalized = note.trim();
  if (ENHARMONIC_EQUIVALENTS[normalized]) {
    normalized = ENHARMONIC_EQUIVALENTS[normalized];
  }
  const noteIndex = NOTE_NAMES.indexOf(normalized as (typeof NOTE_NAMES)[number]);
  if (noteIndex === -1) return 440;

  const midi = (octave + 1) * 12 + noteIndex;
  return a4 * Math.pow(2, (midi - 69 + cents / 100) / 12);
}

/**
 * Calcula a frequência formatada (2 casas decimais) para exibição na UI e compatibilidade.
 */
export function calculateFrequency(note: string, octave: number, a4 = 440, cents = 0): number {
  return parseFloat(calculateExactFrequency(note, octave, a4, cents).toFixed(2));
}

// -------------------------------------------------------------
// PRESETS POR INSTRUMENTO
// -------------------------------------------------------------

// 1. GUITARRA ELÉTRICA
export const ELECTRIC_GUITAR_PRESETS: TunerPreset[] = [
  {
    id: 'eg_standard',
    name: 'Padrão (E A D G B E)',
    description: 'Afinação standard internacional para guitarra de 6 cordas.',
    instrumentId: 'electric_guitar',
    instrumentName: 'Guitarra Elétrica',
    category: 'guitar',
    strings: [
      { stringNumber: 6, note: 'E', notePt: 'Mi', octave: 2, label: '6ª Corda (Grave)', shortName: '6E' },
      { stringNumber: 5, note: 'A', notePt: 'Lá', octave: 2, label: '5ª Corda', shortName: '5A' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda', shortName: '3G' },
      { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, label: '2ª Corda', shortName: '2B' },
      { stringNumber: 1, note: 'E', notePt: 'Mi', octave: 4, label: '1ª Corda (Aguda)', shortName: '1E' },
    ]
  },
  {
    id: 'eg_drop_d',
    name: 'Drop D (D A D G B E)',
    description: '6ª corda rebaixada para Ré, permitindo power chords com um só dedo.',
    instrumentId: 'electric_guitar',
    instrumentName: 'Guitarra Elétrica',
    category: 'guitar',
    strings: [
      { stringNumber: 6, note: 'D', notePt: 'Ré', octave: 2, label: '6ª Corda (Drop D)', shortName: '6D' },
      { stringNumber: 5, note: 'A', notePt: 'Lá', octave: 2, label: '5ª Corda', shortName: '5A' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda', shortName: '3G' },
      { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, label: '2ª Corda', shortName: '2B' },
      { stringNumber: 1, note: 'E', notePt: 'Mi', octave: 4, label: '1ª Corda (Aguda)', shortName: '1E' },
    ]
  },
  {
    id: 'eg_eb_standard',
    name: 'Eb Standard / 1/2 Tom Abaixo',
    description: 'Todas as cordas rebaixadas 1 semitom (Eb Ab Db Gb Bb Eb) — clássico Hendrix e SRV.',
    instrumentId: 'electric_guitar',
    instrumentName: 'Guitarra Elétrica',
    category: 'guitar',
    strings: [
      { stringNumber: 6, note: 'D#', notePt: 'Mib', octave: 2, label: '6ª Corda (Eb2)', shortName: '6Eb' },
      { stringNumber: 5, note: 'G#', notePt: 'Láb', octave: 2, label: '5ª Corda (Ab2)', shortName: '5Ab' },
      { stringNumber: 4, note: 'C#', notePt: 'Réb', octave: 3, label: '4ª Corda (Db3)', shortName: '4Db' },
      { stringNumber: 3, note: 'F#', notePt: 'Solb', octave: 3, label: '3ª Corda (Gb3)', shortName: '3Gb' },
      { stringNumber: 2, note: 'A#', notePt: 'Sib', octave: 3, label: '2ª Corda (Bb3)', shortName: '2Bb' },
      { stringNumber: 1, note: 'D#', notePt: 'Mib', octave: 4, label: '1ª Corda (Eb4)', shortName: '1Eb' },
    ]
  },
  {
    id: 'eg_d_standard',
    name: 'D Standard / 1 Tom Abaixo',
    description: 'Todas as cordas rebaixadas 1 tom inteiro (D G C F A D) para timbre encorpado e pesado.',
    instrumentId: 'electric_guitar',
    instrumentName: 'Guitarra Elétrica',
    category: 'guitar',
    strings: [
      { stringNumber: 6, note: 'D', notePt: 'Ré', octave: 2, label: '6ª Corda (D2)', shortName: '6D' },
      { stringNumber: 5, note: 'G', notePt: 'Sol', octave: 2, label: '5ª Corda (G2)', shortName: '5G' },
      { stringNumber: 4, note: 'C', notePt: 'Dó', octave: 3, label: '4ª Corda (C3)', shortName: '4C' },
      { stringNumber: 3, note: 'F', notePt: 'Fá', octave: 3, label: '3ª Corda (F3)', shortName: '3F' },
      { stringNumber: 2, note: 'A', notePt: 'Lá', octave: 3, label: '2ª Corda (A3)', shortName: '2A' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  },
  {
    id: 'eg_drop_c',
    name: 'Drop C (C G C F A D)',
    description: 'Afinação D Standard com a 6ª corda rebaixada mais um tom até Dó grave (C2).',
    instrumentId: 'electric_guitar',
    instrumentName: 'Guitarra Elétrica',
    category: 'guitar',
    strings: [
      { stringNumber: 6, note: 'C', notePt: 'Dó', octave: 2, label: '6ª Corda (Drop C)', shortName: '6C' },
      { stringNumber: 5, note: 'G', notePt: 'Sol', octave: 2, label: '5ª Corda (G2)', shortName: '5G' },
      { stringNumber: 4, note: 'C', notePt: 'Dó', octave: 3, label: '4ª Corda (C3)', shortName: '4C' },
      { stringNumber: 3, note: 'F', notePt: 'Fá', octave: 3, label: '3ª Corda (F3)', shortName: '3F' },
      { stringNumber: 2, note: 'A', notePt: 'Lá', octave: 3, label: '2ª Corda (A3)', shortName: '2A' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  },
  {
    id: 'eg_open_g',
    name: 'Open G (D G D G B D)',
    description: 'Acorde de Sol maior ao ar livre — muito usada no Blues e pelos Rolling Stones.',
    instrumentId: 'electric_guitar',
    instrumentName: 'Guitarra Elétrica',
    category: 'guitar',
    strings: [
      { stringNumber: 6, note: 'D', notePt: 'Ré', octave: 2, label: '6ª Corda (D2)', shortName: '6D' },
      { stringNumber: 5, note: 'G', notePt: 'Sol', octave: 2, label: '5ª Corda (G2)', shortName: '5G' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda (D3)', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (G3)', shortName: '3G' },
      { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, label: '2ª Corda (B3)', shortName: '2B' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  },
  {
    id: 'eg_open_d',
    name: 'Open D (D A D F# A D)',
    description: 'Acorde de Ré maior ao ar livre — ideal para slide guitar e afinação aberta.',
    instrumentId: 'electric_guitar',
    instrumentName: 'Guitarra Elétrica',
    category: 'guitar',
    strings: [
      { stringNumber: 6, note: 'D', notePt: 'Ré', octave: 2, label: '6ª Corda (D2)', shortName: '6D' },
      { stringNumber: 5, note: 'A', notePt: 'Lá', octave: 2, label: '5ª Corda (A2)', shortName: '5A' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda (D3)', shortName: '4D' },
      { stringNumber: 3, note: 'F#', notePt: 'Fá#', octave: 3, label: '3ª Corda (F#3)', shortName: '3F#' },
      { stringNumber: 2, note: 'A', notePt: 'Lá', octave: 3, label: '2ª Corda (A3)', shortName: '2A' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  },
  {
    id: 'eg_dadgad',
    name: 'DADGAD (Celta / Folk)',
    description: 'Afinação modal DADGAD clássica da música celta e rock acústico (Jimmy Page).',
    instrumentId: 'electric_guitar',
    instrumentName: 'Guitarra Elétrica',
    category: 'guitar',
    strings: [
      { stringNumber: 6, note: 'D', notePt: 'Ré', octave: 2, label: '6ª Corda (D2)', shortName: '6D' },
      { stringNumber: 5, note: 'A', notePt: 'Lá', octave: 2, label: '5ª Corda (A2)', shortName: '5A' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda (D3)', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (G3)', shortName: '3G' },
      { stringNumber: 2, note: 'A', notePt: 'Lá', octave: 3, label: '2ª Corda (A3)', shortName: '2A' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  }
];

// 2. VIOLÃO ACÚSTICO
export const ACOUSTIC_GUITAR_PRESETS: TunerPreset[] = [
  {
    id: 'ag_standard',
    name: 'Padrão (E A D G B E)',
    description: 'Afinação clássica do violão nylon e de aço.',
    instrumentId: 'acoustic_guitar',
    instrumentName: 'Violão Acústico',
    category: 'acoustic',
    strings: [
      { stringNumber: 6, note: 'E', notePt: 'Mi', octave: 2, label: '6ª Corda (Mi grave)', shortName: '6E' },
      { stringNumber: 5, note: 'A', notePt: 'Lá', octave: 2, label: '5ª Corda (Lá)', shortName: '5A' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda (Ré)', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (Sol)', shortName: '3G' },
      { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, label: '2ª Corda (Si)', shortName: '2B' },
      { stringNumber: 1, note: 'E', notePt: 'Mi', octave: 4, label: '1ª Corda (Mi aguda)', shortName: '1E' },
    ]
  },
  {
    id: 'ag_drop_d',
    name: 'Drop D (D A D G B E)',
    description: 'Bordão em Ré para peças clássicas e arranjos de violão solo.',
    instrumentId: 'acoustic_guitar',
    instrumentName: 'Violão Acústico',
    category: 'acoustic',
    strings: [
      { stringNumber: 6, note: 'D', notePt: 'Ré', octave: 2, label: '6ª Corda (Ré grave)', shortName: '6D' },
      { stringNumber: 5, note: 'A', notePt: 'Lá', octave: 2, label: '5ª Corda', shortName: '5A' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda', shortName: '3G' },
      { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, label: '2ª Corda', shortName: '2B' },
      { stringNumber: 1, note: 'E', notePt: 'Mi', octave: 4, label: '1ª Corda', shortName: '1E' },
    ]
  },
  {
    id: 'ag_eb_standard',
    name: 'Eb Standard / Meio Tom Abaixo',
    description: 'Afinação em Eb para reduzir tensão das cordas e facilitar canto.',
    instrumentId: 'acoustic_guitar',
    instrumentName: 'Violão Acústico',
    category: 'acoustic',
    strings: [
      { stringNumber: 6, note: 'D#', notePt: 'Mib', octave: 2, label: '6ª Corda (Eb2)', shortName: '6Eb' },
      { stringNumber: 5, note: 'G#', notePt: 'Láb', octave: 2, label: '5ª Corda (Ab2)', shortName: '5Ab' },
      { stringNumber: 4, note: 'C#', notePt: 'Réb', octave: 3, label: '4ª Corda (Db3)', shortName: '4Db' },
      { stringNumber: 3, note: 'F#', notePt: 'Solb', octave: 3, label: '3ª Corda (Gb3)', shortName: '3Gb' },
      { stringNumber: 2, note: 'A#', notePt: 'Sib', octave: 3, label: '2ª Corda (Bb3)', shortName: '2Bb' },
      { stringNumber: 1, note: 'D#', notePt: 'Mib', octave: 4, label: '1ª Corda (Eb4)', shortName: '1Eb' },
    ]
  },
  {
    id: 'ag_dadgad',
    name: 'DADGAD (Folk Celta)',
    description: 'Muito popular no violão fingerstyle contemporâneo e música folclórica.',
    instrumentId: 'acoustic_guitar',
    instrumentName: 'Violão Acústico',
    category: 'acoustic',
    strings: [
      { stringNumber: 6, note: 'D', notePt: 'Ré', octave: 2, label: '6ª Corda (D2)', shortName: '6D' },
      { stringNumber: 5, note: 'A', notePt: 'Lá', octave: 2, label: '5ª Corda (A2)', shortName: '5A' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda (D3)', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (G3)', shortName: '3G' },
      { stringNumber: 2, note: 'A', notePt: 'Lá', octave: 3, label: '2ª Corda (A3)', shortName: '2A' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  },
  {
    id: 'ag_open_g',
    name: 'Open G (D G D G B D)',
    description: 'Sol maior aberto com ressonâncias ricas para violão acústico.',
    instrumentId: 'acoustic_guitar',
    instrumentName: 'Violão Acústico',
    category: 'acoustic',
    strings: [
      { stringNumber: 6, note: 'D', notePt: 'Ré', octave: 2, label: '6ª Corda (D2)', shortName: '6D' },
      { stringNumber: 5, note: 'G', notePt: 'Sol', octave: 2, label: '5ª Corda (G2)', shortName: '5G' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda (D3)', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (G3)', shortName: '3G' },
      { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, label: '2ª Corda (B3)', shortName: '2B' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  },
  {
    id: 'ag_open_d',
    name: 'Open D (D A D F# A D)',
    description: 'Ré maior aberto com harmônicos exuberantes para violão instrumental.',
    instrumentId: 'acoustic_guitar',
    instrumentName: 'Violão Acústico',
    category: 'acoustic',
    strings: [
      { stringNumber: 6, note: 'D', notePt: 'Ré', octave: 2, label: '6ª Corda (D2)', shortName: '6D' },
      { stringNumber: 5, note: 'A', notePt: 'Lá', octave: 2, label: '5ª Corda (A2)', shortName: '5A' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda (D3)', shortName: '4D' },
      { stringNumber: 3, note: 'F#', notePt: 'Fá#', octave: 3, label: '3ª Corda (F#3)', shortName: '3F#' },
      { stringNumber: 2, note: 'A', notePt: 'Lá', octave: 3, label: '2ª Corda (A3)', shortName: '2A' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  }
];

// 3. CONTRABAIXO ELÉTRICO
export const BASS_PRESETS: TunerPreset[] = [
  {
    id: 'bass_4_standard',
    name: '4 Cordas Padrão (E A D G)',
    description: 'Afinação standard de 4 cordas (E1=41.2 Hz a G2=98.0 Hz).',
    instrumentId: 'bass',
    instrumentName: 'Contrabaixo Elétrico',
    category: 'bass',
    recommendedLowCutoff: 35,
    recommendedHighCutoff: 600,
    strings: [
      { stringNumber: 4, note: 'E', notePt: 'Mi', octave: 1, label: '4ª Corda (E1)', shortName: '4E' },
      { stringNumber: 3, note: 'A', notePt: 'Lá', octave: 1, label: '3ª Corda (A1)', shortName: '3A' },
      { stringNumber: 2, note: 'D', notePt: 'Ré', octave: 2, label: '2ª Corda (D2)', shortName: '2D' },
      { stringNumber: 1, note: 'G', notePt: 'Sol', octave: 2, label: '1ª Corda (G2)', shortName: '1G' },
    ]
  },
  {
    id: 'bass_5_standard',
    name: '5 Cordas Padrão (B E A D G)',
    description: 'Inclui Si grave ultra-subgrave (B0=30.87 Hz) de conservatório.',
    instrumentId: 'bass',
    instrumentName: 'Contrabaixo Elétrico',
    category: 'bass',
    recommendedLowCutoff: 25,
    recommendedHighCutoff: 600,
    strings: [
      { stringNumber: 5, note: 'B', notePt: 'Si', octave: 0, label: '5ª Corda (B0)', shortName: '5B' },
      { stringNumber: 4, note: 'E', notePt: 'Mi', octave: 1, label: '4ª Corda (E1)', shortName: '4E' },
      { stringNumber: 3, note: 'A', notePt: 'Lá', octave: 1, label: '3ª Corda (A1)', shortName: '3A' },
      { stringNumber: 2, note: 'D', notePt: 'Ré', octave: 2, label: '2ª Corda (D2)', shortName: '2D' },
      { stringNumber: 1, note: 'G', notePt: 'Sol', octave: 2, label: '1ª Corda (G2)', shortName: '1G' },
    ]
  },
  {
    id: 'bass_6_standard',
    name: '6 Cordas Padrão (B E A D G C)',
    description: 'Extensão completa de 6 cordas: de B0 (30.87 Hz) até Dó agudo C3 (130.8 Hz).',
    instrumentId: 'bass',
    instrumentName: 'Contrabaixo Elétrico',
    category: 'bass',
    recommendedLowCutoff: 25,
    recommendedHighCutoff: 800,
    strings: [
      { stringNumber: 6, note: 'B', notePt: 'Si', octave: 0, label: '6ª Corda (B0)', shortName: '6B' },
      { stringNumber: 5, note: 'E', notePt: 'Mi', octave: 1, label: '5ª Corda (E1)', shortName: '5E' },
      { stringNumber: 4, note: 'A', notePt: 'Lá', octave: 1, label: '4ª Corda (A1)', shortName: '4A' },
      { stringNumber: 3, note: 'D', notePt: 'Ré', octave: 2, label: '3ª Corda (D2)', shortName: '3D' },
      { stringNumber: 2, note: 'G', notePt: 'Sol', octave: 2, label: '2ª Corda (G2)', shortName: '2G' },
      { stringNumber: 1, note: 'C', notePt: 'Dó', octave: 3, label: '1ª Corda (C3)', shortName: '1C' },
    ]
  },
  {
    id: 'bass_drop_d',
    name: 'Drop D (D A D G)',
    description: '4ª corda rebaixada para D1 (36.7 Hz) para peso extra no rock/metal.',
    instrumentId: 'bass',
    instrumentName: 'Contrabaixo Elétrico',
    category: 'bass',
    recommendedLowCutoff: 30,
    recommendedHighCutoff: 600,
    strings: [
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 1, label: '4ª Corda (Drop D1)', shortName: '4D' },
      { stringNumber: 3, note: 'A', notePt: 'Lá', octave: 1, label: '3ª Corda (A1)', shortName: '3A' },
      { stringNumber: 2, note: 'D', notePt: 'Ré', octave: 2, label: '2ª Corda (D2)', shortName: '2D' },
      { stringNumber: 1, note: 'G', notePt: 'Sol', octave: 2, label: '1ª Corda (G2)', shortName: '1G' },
    ]
  },
  {
    id: 'bass_eb_standard',
    name: 'Eb Standard / 1/2 Tom Abaixo (Eb Ab Db Gb)',
    description: 'Todas as cordas rebaixadas 1 semitom para acompanhar guitarras em Eb.',
    instrumentId: 'bass',
    instrumentName: 'Contrabaixo Elétrico',
    category: 'bass',
    recommendedLowCutoff: 30,
    recommendedHighCutoff: 600,
    strings: [
      { stringNumber: 4, note: 'D#', notePt: 'Mib', octave: 1, label: '4ª Corda (Eb1)', shortName: '4Eb' },
      { stringNumber: 3, note: 'G#', notePt: 'Láb', octave: 1, label: '3ª Corda (Ab1)', shortName: '3Ab' },
      { stringNumber: 2, note: 'C#', notePt: 'Réb', octave: 2, label: '2ª Corda (Db2)', shortName: '2Db' },
      { stringNumber: 1, note: 'F#', notePt: 'Solb', octave: 2, label: '1ª Corda (Gb2)', shortName: '1Gb' },
    ]
  }
];

// 4. UKULELE
export const UKULELE_PRESETS: TunerPreset[] = [
  {
    id: 'uku_soprano_reentrant',
    name: 'Soprano Padrão (G C E A - Reentrante)',
    description: 'Afinação havaiana tradicional reentrante: 4ª corda G4 mais aguda que C4.',
    instrumentId: 'ukulele',
    instrumentName: 'Ukulele',
    category: 'ukulele',
    recommendedLowCutoff: 180,
    recommendedHighCutoff: 1600,
    strings: [
      { stringNumber: 4, note: 'G', notePt: 'Sol', octave: 4, label: '4ª Corda (High G4)', shortName: '4g' },
      { stringNumber: 3, note: 'C', notePt: 'Dó', octave: 4, label: '3ª Corda (C4)', shortName: '3C' },
      { stringNumber: 2, note: 'E', notePt: 'Mi', octave: 4, label: '2ª Corda (E4)', shortName: '2E' },
      { stringNumber: 1, note: 'A', notePt: 'Lá', octave: 4, label: '1ª Corda (A4)', shortName: '1A' },
    ]
  },
  {
    id: 'uku_concerto',
    name: 'Concerto (G C E A)',
    description: 'Afinação standard de concerto (G4 C4 E4 A4).',
    instrumentId: 'ukulele',
    instrumentName: 'Ukulele',
    category: 'ukulele',
    recommendedLowCutoff: 180,
    recommendedHighCutoff: 1600,
    strings: [
      { stringNumber: 4, note: 'G', notePt: 'Sol', octave: 4, label: '4ª Corda (G4)', shortName: '4g' },
      { stringNumber: 3, note: 'C', notePt: 'Dó', octave: 4, label: '3ª Corda (C4)', shortName: '3C' },
      { stringNumber: 2, note: 'E', notePt: 'Mi', octave: 4, label: '2ª Corda (E4)', shortName: '2E' },
      { stringNumber: 1, note: 'A', notePt: 'Lá', octave: 4, label: '1ª Corda (A4)', shortName: '1A' },
    ]
  },
  {
    id: 'uku_tenor_linear',
    name: 'Tenor Linear Low G (G3 C4 E4 A4)',
    description: 'Afinação linear com Sol grave (G3) na 4ª corda, ampliando a extensão.',
    instrumentId: 'ukulele',
    instrumentName: 'Ukulele',
    category: 'ukulele',
    recommendedLowCutoff: 150,
    recommendedHighCutoff: 1600,
    strings: [
      { stringNumber: 4, note: 'G', notePt: 'Sol', octave: 3, label: '4ª Corda (Low G3)', shortName: '4G' },
      { stringNumber: 3, note: 'C', notePt: 'Dó', octave: 4, label: '3ª Corda (C4)', shortName: '3C' },
      { stringNumber: 2, note: 'E', notePt: 'Mi', octave: 4, label: '2ª Corda (E4)', shortName: '2E' },
      { stringNumber: 1, note: 'A', notePt: 'Lá', octave: 4, label: '1ª Corda (A4)', shortName: '1A' },
    ]
  },
  {
    id: 'uku_baritone',
    name: 'Barítono (D G B E)',
    description: 'Afinação idêntica às 4 primeiras cordas da guitarra (D3 G3 B3 E4).',
    instrumentId: 'ukulele',
    instrumentName: 'Ukulele',
    category: 'ukulele',
    recommendedLowCutoff: 120,
    recommendedHighCutoff: 1400,
    strings: [
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda (D3)', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (G3)', shortName: '3G' },
      { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, label: '2ª Corda (B3)', shortName: '2B' },
      { stringNumber: 1, note: 'E', notePt: 'Mi', octave: 4, label: '1ª Corda (E4)', shortName: '1E' },
    ]
  }
];

// 5. VIOLINO
export const VIOLIN_PRESETS: TunerPreset[] = [
  {
    id: 'violin_standard',
    name: 'Violino Padrão (G D A E)',
    description: 'Afinação clássica por quintas perfeitas (G3 D4 A4 E5).',
    instrumentId: 'violin',
    instrumentName: 'Violino',
    category: 'strings_bowed',
    recommendedLowCutoff: 180,
    recommendedHighCutoff: 1600,
    strings: [
      { stringNumber: 4, note: 'G', notePt: 'Sol', octave: 3, label: '4ª Corda (G3)', shortName: '4G' },
      { stringNumber: 3, note: 'D', notePt: 'Ré', octave: 4, label: '3ª Corda (D4)', shortName: '3D' },
      { stringNumber: 2, note: 'A', notePt: 'Lá', octave: 4, label: '2ª Corda (A4)', shortName: '2A' },
      { stringNumber: 1, note: 'E', notePt: 'Mi', octave: 5, label: '1ª Corda (E5)', shortName: '1E' },
    ]
  }
];

// 6. VIOLA
export const VIOLA_PRESETS: TunerPreset[] = [
  {
    id: 'viola_standard',
    name: 'Viola de Arco Padrão (C G D A)',
    description: 'Afinação clássica por quintas (C3 G3 D4 A4), uma quinta abaixo do violino.',
    instrumentId: 'viola',
    instrumentName: 'Viola de Arco',
    category: 'strings_bowed',
    recommendedLowCutoff: 110,
    recommendedHighCutoff: 1200,
    strings: [
      { stringNumber: 4, note: 'C', notePt: 'Dó', octave: 3, label: '4ª Corda (C3)', shortName: '4C' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (G3)', shortName: '3G' },
      { stringNumber: 2, note: 'D', notePt: 'Ré', octave: 4, label: '2ª Corda (D4)', shortName: '2D' },
      { stringNumber: 1, note: 'A', notePt: 'Lá', octave: 4, label: '1ª Corda (A4)', shortName: '1A' },
    ]
  }
];

// 7. VIOLONCELO (CELLO)
export const CELLO_PRESETS: TunerPreset[] = [
  {
    id: 'cello_standard',
    name: 'Violoncelo Padrão (C G D A)',
    description: 'Afinação por quintas na oitava grave (C2=65.4 Hz até A3=220 Hz).',
    instrumentId: 'cello',
    instrumentName: 'Violoncelo',
    category: 'strings_bowed',
    recommendedLowCutoff: 55,
    recommendedHighCutoff: 800,
    strings: [
      { stringNumber: 4, note: 'C', notePt: 'Dó', octave: 2, label: '4ª Corda (C2)', shortName: '4C' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 2, label: '3ª Corda (G2)', shortName: '3G' },
      { stringNumber: 2, note: 'D', notePt: 'Ré', octave: 3, label: '2ª Corda (D3)', shortName: '2D' },
      { stringNumber: 1, note: 'A', notePt: 'Lá', octave: 3, label: '1ª Corda (A3)', shortName: '1A' },
    ]
  }
];

// 8. CONTRABAIXO ACÚSTICO (DOUBLE BASS)
export const DOUBLE_BASS_PRESETS: TunerPreset[] = [
  {
    id: 'db_4_standard',
    name: '4 Cordas Orquestral (E A D G)',
    description: 'Afinação orquestral por quartas (E1=41.2 Hz a G2=98.0 Hz).',
    instrumentId: 'double_bass',
    instrumentName: 'Contrabaixo Acústico',
    category: 'strings_bowed',
    recommendedLowCutoff: 35,
    recommendedHighCutoff: 600,
    strings: [
      { stringNumber: 4, note: 'E', notePt: 'Mi', octave: 1, label: '4ª Corda (E1)', shortName: '4E' },
      { stringNumber: 3, note: 'A', notePt: 'Lá', octave: 1, label: '3ª Corda (A1)', shortName: '3A' },
      { stringNumber: 2, note: 'D', notePt: 'Ré', octave: 2, label: '2ª Corda (D2)', shortName: '2D' },
      { stringNumber: 1, note: 'G', notePt: 'Sol', octave: 2, label: '1ª Corda (G2)', shortName: '1G' },
    ]
  },
  {
    id: 'db_5_low_b',
    name: '5 Cordas Low B (B E A D G)',
    description: 'Contrabaixo acústico sinfônico com 5ª corda em Si subgrave (B0=30.87 Hz).',
    instrumentId: 'double_bass',
    instrumentName: 'Contrabaixo Acústico',
    category: 'strings_bowed',
    recommendedLowCutoff: 25,
    recommendedHighCutoff: 600,
    strings: [
      { stringNumber: 5, note: 'B', notePt: 'Si', octave: 0, label: '5ª Corda (B0)', shortName: '5B' },
      { stringNumber: 4, note: 'E', notePt: 'Mi', octave: 1, label: '4ª Corda (E1)', shortName: '4E' },
      { stringNumber: 3, note: 'A', notePt: 'Lá', octave: 1, label: '3ª Corda (A1)', shortName: '3A' },
      { stringNumber: 2, note: 'D', notePt: 'Ré', octave: 2, label: '2ª Corda (D2)', shortName: '2D' },
      { stringNumber: 1, note: 'G', notePt: 'Sol', octave: 2, label: '1ª Corda (G2)', shortName: '1G' },
    ]
  },
  {
    id: 'db_solo_tuning',
    name: 'Afinação Solo (F# B E A)',
    description: 'Afinação 1 tom acima para concertos solo e maior projeção sonora.',
    instrumentId: 'double_bass',
    instrumentName: 'Contrabaixo Acústico',
    category: 'strings_bowed',
    recommendedLowCutoff: 40,
    recommendedHighCutoff: 700,
    strings: [
      { stringNumber: 4, note: 'F#', notePt: 'Fá#', octave: 1, label: '4ª Corda (F#1)', shortName: '4F#' },
      { stringNumber: 3, note: 'B', notePt: 'Si', octave: 1, label: '3ª Corda (B1)', shortName: '3B' },
      { stringNumber: 2, note: 'E', notePt: 'Mi', octave: 2, label: '2ª Corda (E2)', shortName: '2E' },
      { stringNumber: 1, note: 'A', notePt: 'Lá', octave: 2, label: '1ª Corda (A2)', shortName: '1A' },
    ]
  }
];

// 9. BANDOLIM (MANDOLIN)
export const MANDOLIN_PRESETS: TunerPreset[] = [
  {
    id: 'mandolin_standard',
    name: 'Bandolim Padrão (G D A E)',
    description: '4 pares de cordas uníssonas afinadas como o violino (G3 D4 A4 E5).',
    instrumentId: 'mandolin',
    instrumentName: 'Bandolim',
    category: 'folk',
    recommendedLowCutoff: 180,
    recommendedHighCutoff: 1600,
    strings: [
      { stringNumber: 4, note: 'G', notePt: 'Sol', octave: 3, label: '4º Par (G3)', shortName: '4G' },
      { stringNumber: 3, note: 'D', notePt: 'Ré', octave: 4, label: '3º Par (D4)', shortName: '3D' },
      { stringNumber: 2, note: 'A', notePt: 'Lá', octave: 4, label: '2º Par (A4)', shortName: '2A' },
      { stringNumber: 1, note: 'E', notePt: 'Mi', octave: 5, label: '1º Par (E5)', shortName: '1E' },
    ]
  }
];

// 10. BANJO
export const BANJO_PRESETS: TunerPreset[] = [
  {
    id: 'banjo_5_open_g',
    name: '5 Cordas Padrão Open G (g D G B D)',
    description: 'Afinação clássica Bluegrass com a 5ª corda curta afinada em Sol agudo (g4).',
    instrumentId: 'banjo',
    instrumentName: 'Banjo',
    category: 'folk',
    recommendedLowCutoff: 120,
    recommendedHighCutoff: 1200,
    strings: [
      { stringNumber: 5, note: 'G', notePt: 'Sol', octave: 4, label: '5ª Corda Curta (High g4)', shortName: '5g' },
      { stringNumber: 4, note: 'D', notePt: 'Ré', octave: 3, label: '4ª Corda (D3)', shortName: '4D' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (G3)', shortName: '3G' },
      { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, label: '2ª Corda (B3)', shortName: '2B' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  },
  {
    id: 'banjo_4_tenor',
    name: '4 Cordas Tenor (C G D A)',
    description: 'Afinação por quintas para Banjo Tenor no Jazz tradicional e música irlandesa.',
    instrumentId: 'banjo',
    instrumentName: 'Banjo',
    category: 'folk',
    recommendedLowCutoff: 120,
    recommendedHighCutoff: 1200,
    strings: [
      { stringNumber: 4, note: 'C', notePt: 'Dó', octave: 3, label: '4ª Corda (C3)', shortName: '4C' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (G3)', shortName: '3G' },
      { stringNumber: 2, note: 'D', notePt: 'Ré', octave: 4, label: '2ª Corda (D4)', shortName: '2D' },
      { stringNumber: 1, note: 'A', notePt: 'Lá', octave: 4, label: '1ª Corda (A4)', shortName: '1A' },
    ]
  },
  {
    id: 'banjo_4_plectrum',
    name: '4 Cordas Plectrum (C G B D)',
    description: 'Afinação clássica Plectrum para acompanhamento de Dixieland.',
    instrumentId: 'banjo',
    instrumentName: 'Banjo',
    category: 'folk',
    recommendedLowCutoff: 120,
    recommendedHighCutoff: 1200,
    strings: [
      { stringNumber: 4, note: 'C', notePt: 'Dó', octave: 3, label: '4ª Corda (C3)', shortName: '4C' },
      { stringNumber: 3, note: 'G', notePt: 'Sol', octave: 3, label: '3ª Corda (G3)', shortName: '3G' },
      { stringNumber: 2, note: 'B', notePt: 'Si', octave: 3, label: '2ª Corda (B3)', shortName: '2B' },
      { stringNumber: 1, note: 'D', notePt: 'Ré', octave: 4, label: '1ª Corda (D4)', shortName: '1D' },
    ]
  }
];

// LISTA OFICIAL DE TODOS OS INSTRUMENTOS
export const ALL_INSTRUMENTS: InstrumentDefinition[] = [
  {
    id: 'electric_guitar',
    name: 'Guitarra Elétrica',
    shortName: 'Guitarra',
    category: 'guitar',
    icon: '🎸',
    description: 'Padrão 6 cordas, Drop D, DADGAD, Open Tunings e afinações baixadas.',
    defaultPresetId: 'eg_standard',
    presets: ELECTRIC_GUITAR_PRESETS
  },
  {
    id: 'acoustic_guitar',
    name: 'Violão Acústico',
    shortName: 'Violão',
    category: 'acoustic',
    icon: '🪕',
    description: 'Nylon e aço: Afinação clássica, Drop D, DADGAD, Meio Tom e Abertas.',
    defaultPresetId: 'ag_standard',
    presets: ACOUSTIC_GUITAR_PRESETS
  },
  {
    id: 'bass',
    name: 'Contrabaixo Elétrico',
    shortName: 'Baixo',
    category: 'bass',
    icon: '🎸',
    description: '4 cordas (E1), 5 cordas com B0 (30.87 Hz), 6 cordas e Drop D.',
    defaultPresetId: 'bass_4_standard',
    presets: BASS_PRESETS
  },
  {
    id: 'ukulele',
    name: 'Ukulele',
    shortName: 'Ukulele',
    category: 'ukulele',
    icon: '🏝️',
    description: 'Soprano reentrante, Concerto, Tenor Low G linear e Barítono.',
    defaultPresetId: 'uku_soprano_reentrant',
    presets: UKULELE_PRESETS
  },
  {
    id: 'violin',
    name: 'Violino',
    shortName: 'Violino',
    category: 'strings_bowed',
    icon: '🎻',
    description: 'Quintas perfeitas G3 D4 A4 E5.',
    defaultPresetId: 'violin_standard',
    presets: VIOLIN_PRESETS
  },
  {
    id: 'viola',
    name: 'Viola de Arco',
    shortName: 'Viola',
    category: 'strings_bowed',
    icon: '🎻',
    description: 'Quintas clássicas C3 G3 D4 A4.',
    defaultPresetId: 'viola_standard',
    presets: VIOLA_PRESETS
  },
  {
    id: 'cello',
    name: 'Violoncelo',
    shortName: 'Cello',
    category: 'strings_bowed',
    icon: '🎻',
    description: 'Quintas graves de orquestra C2 G2 D3 A3.',
    defaultPresetId: 'cello_standard',
    presets: CELLO_PRESETS
  },
  {
    id: 'double_bass',
    name: 'Contrabaixo Acústico',
    shortName: 'Cb. Acústico',
    category: 'strings_bowed',
    icon: '🎻',
    description: '4 cordas orquestral, 5 cordas com Si subgrave B0 e Afinação Solo.',
    defaultPresetId: 'db_4_standard',
    presets: DOUBLE_BASS_PRESETS
  },
  {
    id: 'mandolin',
    name: 'Bandolim',
    shortName: 'Bandolim',
    category: 'folk',
    icon: '🪕',
    description: '4 pares de cordas uníssonas G3 D4 A4 E5.',
    defaultPresetId: 'mandolin_standard',
    presets: MANDOLIN_PRESETS
  },
  {
    id: 'banjo',
    name: 'Banjo',
    shortName: 'Banjo',
    category: 'folk',
    icon: '🪕',
    description: '5 cordas Bluegrass com 5ª curta e 4 cordas Tenor / Plectrum.',
    defaultPresetId: 'banjo_5_open_g',
    presets: BANJO_PRESETS
  }
];

// CHAVE DE LOCALSTORAGE PARA AFINAÇÕES PERSONALIZADAS
export const CUSTOM_TUNINGS_STORAGE_KEY = 'guitar_academy_custom_tunings_v2';

// Helper para acesso seguro ao localStorage (browser ou ambiente de teste)
function getSafeStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
    return (globalThis as any).localStorage;
  }
  return null;
}

/**
 * Carrega afinações personalizadas do localStorage
 */
export function loadCustomTunings(): TunerPreset[] {
  const storage = getSafeStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(CUSTOM_TUNINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((p) => ({ ...p, isCustom: true, category: 'custom' as const }));
    }
  } catch (err) {
    console.error('Falha ao carregar afinações personalizadas:', err);
  }
  return [];
}

/**
 * Salva uma nova afinação personalizada ou atualiza existente
 */
export function saveCustomTuning(tuning: Omit<TunerPreset, 'isCustom' | 'category'>): TunerPreset[] {
  const current = loadCustomTunings();
  const fullTuning: TunerPreset = {
    ...tuning,
    isCustom: true,
    category: 'custom'
  };

  const filtered = current.filter((c) => c.id !== fullTuning.id);
  const updated = [fullTuning, ...filtered];

  const storage = getSafeStorage();
  if (storage) {
    storage.setItem(CUSTOM_TUNINGS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

/**
 * Remove uma afinação personalizada
 */
export function deleteCustomTuning(id: string): TunerPreset[] {
  const current = loadCustomTunings();
  const updated = current.filter((c) => c.id !== id);
  const storage = getSafeStorage();
  if (storage) {
    storage.setItem(CUSTOM_TUNINGS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

/**
 * Encontra um preset por ID (seja nativo ou personalizado)
 */
export function findPresetById(presetId: string, customList: TunerPreset[] = []): TunerPreset | null {
  for (const inst of ALL_INSTRUMENTS) {
    const match = inst.presets.find((p) => p.id === presetId);
    if (match) return match;
  }
  const customMatch = customList.find((p) => p.id === presetId);
  if (customMatch) return customMatch;
  return null;
}

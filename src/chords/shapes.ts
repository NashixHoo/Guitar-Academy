// =============================================================
// GUITAR ACADEMY / VIRTUO CHORD ENGINE: SHAPES & VOICINGS
// src/chords/shapes.ts
// Formas fundamentais de guitarra (Giannini 101 HSS 6 cordas),
// CAGED móvel, baixo e instrumentos didáticos
// =============================================================

import { normalizeNote, NOTE_TO_SEMITONE } from './notes';
import { parseChordSymbol, buildChord } from './chord-builder';
import { validateChordShape } from './musical-validator';

export interface ChordShapeDef {
  instrument: string;
  chord: string;
  tuning: string;
  frets: number[]; // 6 strings from low E (6th) to high E (1st). -1 is muted (X), 0 is open (O)
  fingers: number[]; // 0 open/none, 1 index, 2 middle, 3 ring, 4 pinky
  mutedStrings: number[];
  openStrings: number[];
  baseFret: number;
  position: 'open' | 'barre' | 'mid-neck';
  cagedForm: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function createChordShape(params: {
  instrument?: string;
  chord?: string;
  tuning?: string;
  frets?: number[];
  fingers?: number[];
  baseFret?: number;
  position?: 'open' | 'barre' | 'mid-neck';
  cagedForm?: string | null;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}): ChordShapeDef {
  const {
    instrument = 'electric-guitar',
    chord = 'C',
    tuning = 'standard',
    frets = [-1, 3, 2, 0, 1, 0],
    fingers = [0, 3, 2, 0, 1, 0],
    baseFret = 1,
    position = 'open',
    cagedForm = null,
    difficulty = 'beginner'
  } = params;

  const mutedStrings: number[] = [];
  const openStrings: number[] = [];

  frets.forEach((fret, idx) => {
    if (fret === -1) mutedStrings.push(idx);
    else if (fret === 0) openStrings.push(idx);
  });

  return {
    instrument,
    chord,
    tuning,
    frets: [...frets],
    fingers: [...fingers],
    mutedStrings,
    openStrings,
    baseFret,
    position,
    cagedForm,
    difficulty
  };
}

// Catálogo essencial de formas para Guitarra (Standard E-A-D-G-B-E)
const GUITAR_SHAPES_DATABASE: Record<string, ChordShapeDef[]> = {
  // C
  'C': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'C',
      frets: [-1, 3, 2, 0, 1, 0],
      fingers: [0, 3, 2, 0, 1, 0],
      baseFret: 1,
      position: 'open',
      cagedForm: 'C',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'C',
      frets: [-1, 3, 5, 5, 5, 3],
      fingers: [0, 1, 3, 3, 3, 1],
      baseFret: 3,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'C',
      frets: [8, 10, 10, 9, 8, 8],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 8,
      position: 'barre',
      cagedForm: 'E',
      difficulty: 'intermediate'
    })
  ],
  // Cm
  'Cm': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Cm',
      frets: [-1, 3, 5, 5, 4, 3],
      fingers: [0, 1, 3, 4, 2, 1],
      baseFret: 3,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Cm',
      frets: [8, 10, 10, 8, 8, 8],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 8,
      position: 'barre',
      cagedForm: 'E',
      difficulty: 'intermediate'
    })
  ],
  // C7
  'C7': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'C7',
      frets: [-1, 3, 2, 3, 1, 0],
      fingers: [0, 3, 2, 4, 1, 0],
      baseFret: 1,
      position: 'open',
      cagedForm: 'C',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'C7',
      frets: [-1, 3, 5, 3, 5, 3],
      fingers: [0, 1, 3, 1, 4, 1],
      baseFret: 3,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    })
  ],
  // Cmaj7
  'Cmaj7': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Cmaj7',
      frets: [-1, 3, 2, 0, 0, 0],
      fingers: [0, 3, 2, 0, 0, 0],
      baseFret: 1,
      position: 'open',
      cagedForm: 'C',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Cmaj7',
      frets: [-1, 3, 5, 4, 5, 3],
      fingers: [0, 1, 3, 2, 4, 1],
      baseFret: 3,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    })
  ],
  // D
  'D': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'D',
      frets: [-1, -1, 0, 2, 3, 2],
      fingers: [0, 0, 0, 1, 3, 2],
      baseFret: 1,
      position: 'open',
      cagedForm: 'D',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'D',
      frets: [-1, 5, 7, 7, 7, 5],
      fingers: [0, 1, 3, 3, 3, 1],
      baseFret: 5,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    })
  ],
  // Dm
  'Dm': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Dm',
      frets: [-1, -1, 0, 2, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
      baseFret: 1,
      position: 'open',
      cagedForm: 'D',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Dm',
      frets: [-1, 5, 7, 7, 6, 5],
      fingers: [0, 1, 3, 4, 2, 1],
      baseFret: 5,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    })
  ],
  // E
  'E': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'E',
      frets: [0, 2, 2, 1, 0, 0],
      fingers: [0, 2, 3, 1, 0, 0],
      baseFret: 1,
      position: 'open',
      cagedForm: 'E',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'E',
      frets: [-1, 7, 9, 9, 9, 7],
      fingers: [0, 1, 3, 3, 3, 1],
      baseFret: 7,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    })
  ],
  // Em
  'Em': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Em',
      frets: [0, 2, 2, 0, 0, 0],
      fingers: [0, 2, 3, 0, 0, 0],
      baseFret: 1,
      position: 'open',
      cagedForm: 'E',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Em',
      frets: [-1, 7, 9, 9, 8, 7],
      fingers: [0, 1, 3, 4, 2, 1],
      baseFret: 7,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    })
  ],
  // F
  'F': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'F',
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 1,
      position: 'barre',
      cagedForm: 'E',
      difficulty: 'intermediate'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'F',
      frets: [-1, -1, 3, 2, 1, 1],
      fingers: [0, 0, 3, 2, 1, 1],
      baseFret: 1,
      position: 'barre',
      cagedForm: 'C',
      difficulty: 'beginner'
    })
  ],
  // G
  'G': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'G',
      frets: [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, 0, 0, 0, 3],
      baseFret: 1,
      position: 'open',
      cagedForm: 'G',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'G',
      frets: [3, 5, 5, 4, 3, 3],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 3,
      position: 'barre',
      cagedForm: 'E',
      difficulty: 'intermediate'
    })
  ],
  // A
  'A': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'A',
      frets: [-1, 0, 2, 2, 2, 0],
      fingers: [0, 0, 1, 2, 3, 0],
      baseFret: 1,
      position: 'open',
      cagedForm: 'A',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'A',
      frets: [5, 7, 7, 6, 5, 5],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 5,
      position: 'barre',
      cagedForm: 'E',
      difficulty: 'intermediate'
    })
  ],
  // Am
  'Am': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Am',
      frets: [-1, 0, 2, 2, 1, 0],
      fingers: [0, 0, 2, 3, 1, 0],
      baseFret: 1,
      position: 'open',
      cagedForm: 'A',
      difficulty: 'beginner'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Am',
      frets: [5, 7, 7, 5, 5, 5],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 5,
      position: 'barre',
      cagedForm: 'E',
      difficulty: 'intermediate'
    })
  ],
  // B
  'B': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'B',
      frets: [-1, 2, 4, 4, 4, 2],
      fingers: [0, 1, 2, 3, 4, 1],
      baseFret: 2,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'B',
      frets: [7, 9, 9, 8, 7, 7],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 7,
      position: 'barre',
      cagedForm: 'E',
      difficulty: 'intermediate'
    })
  ],
  // Bm
  'Bm': [
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Bm',
      frets: [-1, 2, 4, 4, 3, 2],
      fingers: [0, 1, 3, 4, 2, 1],
      baseFret: 2,
      position: 'barre',
      cagedForm: 'A',
      difficulty: 'intermediate'
    }),
    createChordShape({
      instrument: 'electric-guitar',
      chord: 'Bm',
      frets: [7, 9, 9, 7, 7, 7],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 7,
      position: 'barre',
      cagedForm: 'E',
      difficulty: 'intermediate'
    })
  ]
};

// Modelos CAGED padrão
export const CAGED_ROOT_OFFSETS: Record<
  string,
  { stringRoot: number; openSemitone: number; shapeFrets: number[]; shapeFingers: number[] }
> = {
  E: { stringRoot: 0, openSemitone: 4, shapeFrets: [0, 2, 2, 1, 0, 0], shapeFingers: [1, 3, 4, 2, 1, 1] },
  A: { stringRoot: 1, openSemitone: 9, shapeFrets: [-1, 0, 2, 2, 2, 0], shapeFingers: [0, 1, 3, 3, 3, 1] },
  D: { stringRoot: 2, openSemitone: 2, shapeFrets: [-1, -1, 0, 2, 3, 2], shapeFingers: [0, 0, 1, 3, 4, 2] },
  C: { stringRoot: 1, openSemitone: 0, shapeFrets: [-1, 3, 2, 0, 1, 0], shapeFingers: [0, 4, 3, 1, 2, 1] },
  G: { stringRoot: 0, openSemitone: 7, shapeFrets: [3, 2, 0, 0, 0, 3], shapeFingers: [4, 3, 1, 1, 1, 4] }
};

/**
 * Gera formas CAGED para qualquer tonalidade maior
 */
export function generateCagedShapes(rootNote: string): ChordShapeDef[] {
  const normRoot = normalizeNote(rootNote);
  const targetSemi = NOTE_TO_SEMITONE[normRoot];
  if (targetSemi === undefined) return [];

  const forms: ChordShapeDef[] = [];
  const cagedKeys = ['C', 'A', 'G', 'E', 'D'];

  for (const formKey of cagedKeys) {
    const template = CAGED_ROOT_OFFSETS[formKey];
    const shift = (targetSemi - template.openSemitone + 12) % 12;
    const baseFret = shift === 0 ? 1 : shift;

    const frets = template.shapeFrets.map((f) => {
      if (f === -1) return -1;
      return f + shift;
    });

    const shape = createChordShape({
      instrument: 'electric-guitar',
      chord: rootNote,
      frets,
      fingers: template.shapeFingers,
      baseFret,
      position: shift === 0 ? 'open' : 'barre',
      cagedForm: formKey,
      difficulty: shift === 0 ? 'beginner' : 'intermediate'
    });

    const chordBuilt = buildChord(normRoot, 'major');
    if (chordBuilt) {
      const val = validateChordShape(shape, {
        id: chordBuilt.id,
        root: normRoot,
        quality: 'major',
        qualityName: 'Maior',
        intervals: chordBuilt.intervals,
        notes: chordBuilt.notes,
        symbol: chordBuilt.symbol,
        bass: null
      });
      if (val.valid) {
        forms.push(shape);
      }
    }
  }

  return forms;
}

/**
 * Obtém todas as formas de um acorde para determinado instrumento
 */
export function getChordShapes(chordSymbol: string, instrumentId = 'electric-guitar'): ChordShapeDef[] {
  const clean = chordSymbol ? chordSymbol.trim() : 'C';

  // Guitarra / Violão
  const stored = GUITAR_SHAPES_DATABASE[clean];
  if (stored && stored.length > 0) {
    return stored;
  }

  // Tenta CAGED dinâmico para tríades maiores
  const chordObj = parseChordSymbol(clean);
  if (chordObj && chordObj.quality === 'major') {
    return generateCagedShapes(chordObj.root);
  }

  return [];
}

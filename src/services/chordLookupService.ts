import { CHORD_DATABASE } from '../data/chordDatabase';
import { CIPHER_TO_PT } from '../data/musicTheory';
import { ChordEngine } from '../chords/chord-engine';
import { ChordDiagramData } from '../components/chords/ChordDiagram';
import { ChordShape, NoteCipher } from '../types';

export interface ResolvedChordModalData {
  matchKey: string;
  symbol: string;
  namePt: string;
  category: string;
  formula: string;
  frets: number[];
  fingers: number[];
  baseFret: number;
  barre?: { fret: number; fromString: number; toString: number };
  notes: string[];
  notesPt: string[];
  description?: string;
  tips?: string;
  cagedForm?: string | null;
  chordDbId?: string;
}

export type ChordModalTriggerInput =
  | string
  | {
      matchKey?: string;
      chordId?: string;
      symbol?: string;
      chordData?: ChordDiagramData | ChordShape;
      namePt?: string;
      formula?: string;
      category?: string;
      description?: string;
    };

const SYMBOL_ALIASES: Record<string, string[]> = {
  Cmaj7: ['C7M', 'Cmaj7'],
  C7M: ['C7M', 'Cmaj7'],
  Gmaj7: ['G7M', 'Gmaj7'],
  G7M: ['G7M', 'Gmaj7'],
  Fmaj7: ['F7M', 'Fmaj7'],
  F7M: ['F7M', 'Fmaj7'],
  Dmaj7: ['D7M', 'Dmaj7'],
  D7M: ['D7M', 'Dmaj7'],
  Amaj7: ['A7M', 'Amaj7'],
  A7M: ['A7M', 'Amaj7'],
  Emaj7: ['E7M', 'Emaj7'],
  E7M: ['E7M', 'Emaj7'],
  Bm7b5: ['Bm7(b5)', 'Bm7b5'],
  'Bm7(b5)': ['Bm7b5', 'Bm7(b5)'],
};

function normalizeChordLookupSymbol(raw: string): string {
  return raw.trim().replace(/\s+/g, '');
}

function toPortugueseNotes(notes: string[]): string[] {
  return notes.map((n) => CIPHER_TO_PT[n as NoteCipher] || n);
}

function findInChordDatabase(symbol: string, chordId?: string): ChordShape | undefined {
  if (chordId) {
    const byId = CHORD_DATABASE.find((c) => c.id === chordId);
    if (byId) return byId;
  }

  const clean = normalizeChordLookupSymbol(symbol);
  const direct = CHORD_DATABASE.find((c) => c.symbol === clean);
  if (direct) return direct;

  const aliases = SYMBOL_ALIASES[clean] || [];
  for (const alias of aliases) {
    const found = CHORD_DATABASE.find((c) => c.symbol === alias);
    if (found) return found;
  }

  // Portuguese 7M notation <-> maj7 equivalence
  if (clean.endsWith('7M')) {
    const majAlt = clean.slice(0, -2) + 'maj7';
    const found = CHORD_DATABASE.find((c) => c.symbol === majAlt);
    if (found) return found;
  } else if (clean.endsWith('maj7')) {
    const ptAlt = clean.slice(0, -4) + '7M';
    const found = CHORD_DATABASE.find((c) => c.symbol === ptAlt);
    if (found) return found;
  }

  return CHORD_DATABASE.find((c) => c.symbol.toLowerCase() === clean.toLowerCase());
}

/**
 * Resolves any chord symbol, ChordDatabase ID, or custom diagram shape into
 * a complete, standardized payload for the centered enlarged ChordPreviewModal.
 */
export function resolveChordForModal(input: ChordModalTriggerInput): ResolvedChordModalData | null {
  if (typeof input === 'string') {
    const clean = normalizeChordLookupSymbol(input);
    if (!clean) return null;

    const fromDb = findInChordDatabase(clean);
    if (fromDb) {
      return {
        matchKey: `symbol:${clean.toLowerCase()}`,
        symbol: fromDb.symbol,
        namePt: fromDb.namePt,
        category: fromDb.category,
        formula: fromDb.formula,
        frets: [...fromDb.frets],
        fingers: [...fromDb.fingers],
        baseFret: fromDb.baseFret || 1,
        barre: fromDb.barre,
        notes: [...fromDb.notes],
        notesPt: [...fromDb.notesPt],
        description: fromDb.description,
        chordDbId: fromDb.id,
      };
    }

    const constructed = ChordEngine.getChord(clean);
    const shapes = ChordEngine.getShapes(clean, 'acoustic-guitar');
    const primaryShape = shapes[0];

    const SEMITONE_TO_FORMULA: Record<number, string> = {
      0: '1',
      1: 'b2',
      2: '2',
      3: 'b3',
      4: '3',
      5: '4',
      6: 'b5',
      7: '5',
      8: '#5',
      9: '6',
      10: 'b7',
      11: '7',
      13: 'b9',
      14: '9',
      15: '#9',
      17: '11',
      18: '#11',
      21: '13',
    };

    if (constructed || primaryShape) {
      const notes = constructed?.notes || [];
      const frets = primaryShape?.frets || [-1, 3, 2, 0, 1, 0];
      const fingers = primaryShape?.fingers || frets.map((f) => (f > 0 ? 1 : 0));
      return {
        matchKey: `symbol:${clean.toLowerCase()}`,
        symbol: constructed?.symbol || clean,
        namePt: constructed ? `${constructed.root} ${constructed.qualityName}` : clean,
        category: primaryShape?.position === 'barre' ? 'Pestana' : 'Acorde',
        formula: constructed?.intervals?.map((st) => SEMITONE_TO_FORMULA[st] || `${st}st`).join(' - ') || '',
        frets: [...frets],
        fingers: [...fingers],
        baseFret: primaryShape?.baseFret || 1,
        notes: [...notes],
        notesPt: toPortugueseNotes(notes),
        description: constructed?.bass
          ? `Acorde invertido com baixo em ${constructed.bass}.`
          : 'Desenho calculado harmonicamente pelo motor de acordes.',
        cagedForm: primaryShape?.cagedForm || null,
      };
    }

    return null;
  }

  const rawSymbol = normalizeChordLookupSymbol(
    input.symbol ||
      (input.chordData as any)?.symbol ||
      (input.chordData as any)?.chord ||
      (input.chordData as any)?.name ||
      ''
  );
  const fromDb = findInChordDatabase(rawSymbol, input.chordId);

  if (input.chordData) {
    const data = input.chordData as any;
    const effectiveSymbol = rawSymbol || fromDb?.symbol || 'Acorde';
    const notes: string[] =
      Array.isArray(data.notes) && data.notes.length > 0
        ? data.notes
        : fromDb?.notes || ChordEngine.getChord(effectiveSymbol)?.notes || [];
    const notesPt: string[] =
      Array.isArray(data.notesPt) && data.notesPt.length > 0
        ? data.notesPt
        : fromDb?.notesPt || toPortugueseNotes(notes);
    const frets: number[] = Array.isArray(data.frets) ? data.frets : fromDb?.frets || [-1, 3, 2, 0, 1, 0];
    const fingers: number[] =
      Array.isArray(data.fingers) && data.fingers.length === 6
        ? data.fingers
        : fromDb?.fingers || frets.map((f) => (f > 0 ? 1 : 0));

    const matchKey =
      input.matchKey ||
      (data.cagedForm ? `caged:${effectiveSymbol}:${data.cagedForm}` : undefined) ||
      (input.chordId ? `id:${input.chordId}` : `symbol:${effectiveSymbol.toLowerCase()}`);

    return {
      matchKey,
      symbol: effectiveSymbol,
      namePt: input.namePt || data.namePt || fromDb?.namePt || effectiveSymbol,
      category: input.category || data.category || data.position || fromDb?.category || 'Acorde',
      formula: input.formula || data.formula || fromDb?.formula || '',
      frets: [...frets],
      fingers: [...fingers],
      baseFret: data.baseFret || fromDb?.baseFret || 1,
      barre: data.barre || fromDb?.barre,
      notes: [...notes],
      notesPt: [...notesPt],
      tips: data.tips,
      description: input.description || data.description || fromDb?.description,
      cagedForm: data.cagedForm || null,
      chordDbId: fromDb?.id || input.chordId,
    };
  }

  if (fromDb) {
    return {
      matchKey: input.matchKey || (input.chordId ? `id:${fromDb.id}` : `symbol:${fromDb.symbol.toLowerCase()}`),
      symbol: fromDb.symbol,
      namePt: input.namePt || fromDb.namePt,
      category: input.category || fromDb.category,
      formula: input.formula || fromDb.formula,
      frets: [...fromDb.frets],
      fingers: [...fromDb.fingers],
      baseFret: fromDb.baseFret || 1,
      barre: fromDb.barre,
      notes: [...fromDb.notes],
      notesPt: [...fromDb.notesPt],
      description: input.description || fromDb.description,
      chordDbId: fromDb.id,
    };
  }

  if (rawSymbol) {
    return resolveChordForModal(rawSymbol);
  }

  return null;
}

/**
 * Extracts unambiguous chord symbols inside markdown/lesson strings without matching
 * single Portuguese prepositions/articles like "A", "E", "a", "e", etc.
 */
export function findChordTokensInText(text: string): { text: string; isChord: boolean }[] {
  const tokenRegex =
    /(?<![A-Za-zÀ-ÿ0-9_#/])([A-G](?:#|b)?(?:maj7|7M|m7b5|m7\(b5\)|add9|sus2|sus4|dim7|dim|aug|m9|m7|m6|7\(#9\)|7\(#11\)|7\(b9\)|7\(13\)|7#9|6\/9|m|7|9|6)(?:\/[A-G](?:#|b)?)?|[A-G](?:#|b)?\/[A-G](?:#|b)?|[A-G](?:#|b)|[A-G](?=\s*(?:,|->|→)))(?=$|[\s,.;:!?()\]"'—–-])/g;

  const segments: { text: string; isChord: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    const candidate = match[1];
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), isChord: false });
    }
    const resolved = resolveChordForModal(candidate);
    segments.push({ text: candidate, isChord: Boolean(resolved) });
    lastIndex = match.index + candidate.length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isChord: false });
  }

  return segments.length > 0 ? segments : [{ text, isChord: false }];
}

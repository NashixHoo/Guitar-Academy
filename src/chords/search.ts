// =============================================================
// GUITAR ACADEMY / VIRTUO CHORD ENGINE: SEARCH & REVERSE CHORD FINDER
// src/chords/search.ts
// =============================================================

import { normalizeNote, NOTE_TO_SEMITONE, CHROMATIC_SCALE } from './notes';
import { CHORD_QUALITIES } from './qualities';
import { buildChord, ConstructedChord } from './chord-builder';

export function searchChords(query: string, limit = 20): ConstructedChord[] {
  if (!query || typeof query !== 'string') return [];
  const clean = query.trim().toUpperCase();

  const rootMatch = clean.match(/^([A-G][#B]?)(.*)$/);
  const results: ConstructedChord[] = [];

  if (rootMatch) {
    const root =
      rootMatch[1].charAt(0) +
      (rootMatch[1].charAt(1) ? (rootMatch[1].charAt(1).toLowerCase() === 'b' ? 'b' : '#') : '');
    const remainder = rootMatch[2].trim().toLowerCase();

    for (const [qKey, qObj] of Object.entries(CHORD_QUALITIES)) {
      if (!remainder || qKey.includes(remainder) || qObj.aliases.some((a) => a.toLowerCase().includes(remainder))) {
        const chord = buildChord(root, qKey);
        if (chord) results.push(chord);
      }
    }
  } else {
    const searchLow = query.toLowerCase().trim();
    for (const root of ['C', 'D', 'E', 'F', 'G', 'A', 'B']) {
      for (const [qKey, qObj] of Object.entries(CHORD_QUALITIES)) {
        if (
          qKey.includes(searchLow) ||
          qObj.name.toLowerCase().includes(searchLow) ||
          qObj.symbol.toLowerCase() === searchLow
        ) {
          const chord = buildChord(root, qKey);
          if (chord) results.push(chord);
        }
      }
    }
  }

  return results.slice(0, limit);
}

/**
 * Reconhece acordes a partir de um conjunto de notas (Reverse Chord Finder)
 * Ex: ['E', 'G', 'C'] -> 'C/E' e 'C'
 */
export function identifyChordFromNotes(notesInput: string[] | string): ConstructedChord[] {
  if (!notesInput) return [];

  let noteArray: string[] = [];
  if (Array.isArray(notesInput)) {
    noteArray = notesInput.map((n) => normalizeNote(n)).filter(Boolean);
  } else if (typeof notesInput === 'string') {
    noteArray = notesInput
      .trim()
      .split(/[\s,;-]+/)
      .map((n) => normalizeNote(n))
      .filter(Boolean);
  }

  if (noteArray.length < 2) return [];

  const bassNote = noteArray[0];
  const uniqueSemitones = Array.from(
    new Set(noteArray.map((n) => NOTE_TO_SEMITONE[n]).filter((s) => s !== undefined))
  ).sort((a, b) => a - b);

  const candidates: { chord: ConstructedChord; matchScore: number }[] = [];

  for (const rootCandidate of uniqueSemitones) {
    const rootName = CHROMATIC_SCALE[rootCandidate];

    const relativeIntervals = uniqueSemitones
      .map((s) => (s - rootCandidate + 12) % 12)
      .sort((a, b) => a - b);

    for (const [qKey, qObj] of Object.entries(CHORD_QUALITIES)) {
      const qIntervals = Array.from(new Set(qObj.intervals.map((i) => i % 12))).sort((a, b) => a - b);

      const isExactMatch =
        relativeIntervals.length === qIntervals.length &&
        relativeIntervals.every((val, idx) => val === qIntervals[idx]);

      if (isExactMatch) {
        const isSlash = bassNote !== rootName;
        const chord = buildChord(rootName, qKey, isSlash ? bassNote : null);
        if (chord) {
          candidates.push({
            chord,
            matchScore: isSlash ? 85 : 100
          });
        }
      }
    }
  }

  return candidates.sort((a, b) => b.matchScore - a.matchScore).map((c) => c.chord);
}

// =============================================================
// GUITAR ACADEMY / VIRTUO CHORD ENGINE: MUSICAL VALIDATOR
// src/chords/musical-validator.ts
// Validador estrito de digitações, notas geradas e integridade harmônica
// =============================================================

import { normalizeNote, noteToMidi, midiToNote } from './notes';
import { parseChordSymbol, ConstructedChord } from './chord-builder';
import { getInstrument } from './instruments';

export interface ChordShapeToValidate {
  instrument?: string;
  frets: number[];
  chord?: string;
  tuning?: string;
  baseFret?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  notesPlayed: string[];
  uniqueNotes?: string[];
  bassNote?: string | null;
}

/**
 * Valida estritamente uma forma de acorde (ChordShape) para um instrumento.
 * Verifica afinação, número de cordas, casas e se as notas resultantes
 * pertencem rigorosamente ao acorde esperado.
 *
 * Rejeita qualquer forma inconsistente (ex: C maior gerando C, F#, A).
 */
export function validateChordShape(
  shape: ChordShapeToValidate,
  expectedChord: string | ConstructedChord | null = null,
  targetInstrument: string | null = null
): ValidationResult {
  const errors: string[] = [];
  if (!shape || typeof shape !== 'object') {
    return { valid: false, errors: ['Forma de acorde inexistente ou inválida.'], notesPlayed: [] };
  }

  const instId = shape.instrument || targetInstrument || 'electric-guitar';
  const inst = getInstrument(instId);
  if (!inst) {
    return { valid: false, errors: [`Instrumento '${instId}' não reconhecido.`], notesPlayed: [] };
  }

  if (inst.family === 'strings') {
    if (!Array.isArray(shape.frets)) {
      return { valid: false, errors: ["A propriedade 'frets' deve ser um array numérico."], notesPlayed: [] };
    }
    if (shape.frets.length !== inst.strings) {
      errors.push(
        `Número de cordas inválido: a forma tem ${shape.frets.length} cordas, mas o instrumento '${inst.name}' possui ${inst.strings}.`
      );
    }
    for (let i = 0; i < shape.frets.length; i++) {
      const fret = shape.frets[i];
      if (typeof fret !== 'number' || isNaN(fret) || fret < -1 || fret > inst.fretCount) {
        errors.push(`Traste inválido na corda ${i + 1}: ${fret} (limite: -1 a ${inst.fretCount}).`);
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, notesPlayed: [] };
  }

  const notesPlayed: string[] = [];
  const noteSet = new Set<string>();
  let bassNote: string | null = null;

  if (inst.family === 'strings') {
    for (let i = 0; i < shape.frets.length; i++) {
      const fret = shape.frets[i];
      if (fret === -1) continue; // Corda mutada (X)

      const openTuningNote = inst.tuning[i];
      const openMidi = noteToMidi(openTuningNote);
      if (openMidi === 0) {
        errors.push(`Afinação da corda ${i + 1} (${openTuningNote}) é inválida.`);
        continue;
      }

      const playedMidi = openMidi + fret;
      const pitchWithOctave = midiToNote(playedMidi);
      // Remove a oitava para extrair a classe de nota (pitch class)
      const pitchClass = pitchWithOctave.replace(/[0-9-]+$/, '');
      const normalizedPitch = normalizeNote(pitchClass);
      notesPlayed.push(normalizedPitch);
      noteSet.add(normalizedPitch);

      if (!bassNote) {
        bassNote = normalizedPitch;
      }
    }

    if (notesPlayed.length === 0) {
      errors.push('Nenhuma nota está sendo tocada (todas as cordas estão mutadas).');
      return { valid: false, errors, notesPlayed: [] };
    }
  }

  // Resolve o acorde esperado para validação harmônica
  const chordTarget = expectedChord || shape.chord;
  const chordObj =
    typeof chordTarget === 'string'
      ? parseChordSymbol(chordTarget)
      : chordTarget;

  if (chordObj && Array.isArray(chordObj.notes)) {
    const validPitchClasses = new Set(chordObj.notes.map((n) => normalizeNote(n)));

    if (chordObj.bass) {
      validPitchClasses.add(normalizeNote(chordObj.bass));
    }

    for (const note of noteSet) {
      if (!validPitchClasses.has(note)) {
        errors.push(
          `Inconsistência Harmônica: A nota '${note}' gerada na digitação não pertence ao acorde esperado '${chordObj.symbol}' [${chordObj.notes.join(', ')}].`
        );
      }
    }

    const normalizedRoot = normalizeNote(chordObj.root);
    const hasRoot = noteSet.has(normalizedRoot);
    if (!hasRoot && !chordObj.bass) {
      if (chordObj.quality === 'major' || chordObj.quality === 'minor') {
        errors.push(`A nota fundamental '${normalizedRoot}' do acorde não foi encontrada na digitação.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    notesPlayed,
    uniqueNotes: Array.from(noteSet),
    bassNote
  };
}

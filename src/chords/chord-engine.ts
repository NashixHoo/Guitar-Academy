// =============================================================
// GUITAR ACADEMY / VIRTUO CHORD ENGINE: MAIN FACADE
// src/chords/chord-engine.ts
// API unificada com cache em memória de alta performance
// =============================================================

import { normalizeNote, noteToMidi, midiToNote, enharmonicEquivalent, getSemitoneDistance } from './notes';
import { INTERVALS, INTERVAL_LIST, getInterval } from './intervals';
import { CHORD_QUALITIES, resolveQuality, ChordQuality } from './qualities';
import { buildChord, parseChordSymbol, ConstructedChord } from './chord-builder';
import { INSTRUMENTS, getInstrument, getAllInstruments, InstrumentConfig } from './instruments';
import { getChordShapes, generateCagedShapes, createChordShape, ChordShapeDef } from './shapes';
import { validateChordShape, ValidationResult } from './musical-validator';
import { transposeChord, transposeNote, transposeProgression } from './transposer';
import { searchChords, identifyChordFromNotes } from './search';
import { toEasyPlay, getSmartKeySubstitutions, EasyPlayResult } from './easy-play-integration';

export class ChordEngine {
  private static chordCache = new Map<string, ConstructedChord>();
  private static shapesCache = new Map<string, ChordShapeDef[]>();

  static getChord(symbol: string): ConstructedChord | null {
    if (!symbol || typeof symbol !== 'string') return null;
    const clean = symbol.trim();
    if (this.chordCache.has(clean)) {
      return this.chordCache.get(clean)!;
    }
    const chord = parseChordSymbol(clean);
    if (chord) {
      this.chordCache.set(clean, chord);
    }
    return chord;
  }

  static buildChord(root: string, quality: string | ChordQuality = 'major', bass: string | null = null): ConstructedChord | null {
    return buildChord(root, quality, bass);
  }

  static getShapes(chordSymbol: string, instrumentId = 'electric-guitar'): ChordShapeDef[] {
    const key = `${chordSymbol}_${instrumentId}`;
    if (this.shapesCache.has(key)) {
      return this.shapesCache.get(key)!;
    }
    const shapes = getChordShapes(chordSymbol, instrumentId);
    this.shapesCache.set(key, shapes);
    return shapes;
  }

  static generateCaged(rootNote: string): ChordShapeDef[] {
    return generateCagedShapes(rootNote);
  }

  static validateShape(shape: any, expectedChord: any = null, instrumentId: any = null): ValidationResult {
    return validateChordShape(shape, expectedChord, instrumentId);
  }

  static transpose(chord: string | ConstructedChord, semitones = 0, preferFlats: boolean | null = null): string {
    return transposeChord(chord, semitones, preferFlats);
  }

  static transposeProgression(progression: string[] | string, semitones = 0, preferFlats: boolean | null = null): string[] | string {
    return transposeProgression(progression, semitones, preferFlats);
  }

  static search(query: string, limit = 20): ConstructedChord[] {
    return searchChords(query, limit);
  }

  static identifyFromNotes(notes: string[] | string): ConstructedChord[] {
    return identifyChordFromNotes(notes);
  }

  static toEasyPlay(chord: string | { symbol?: string }): EasyPlayResult {
    return toEasyPlay(chord);
  }

  static getSmartKey(chord: string, instrumentId = 'electric-guitar') {
    return getSmartKeySubstitutions(chord, instrumentId);
  }

  static normalizeNote(note: string): string {
    return normalizeNote(note);
  }

  static enharmonic(note: string): string {
    return enharmonicEquivalent(note);
  }

  static noteToMidi(noteWithOctave: string): number {
    return noteToMidi(noteWithOctave);
  }

  static midiToNote(midi: number, useFlats = false): string {
    return midiToNote(midi, useFlats);
  }

  static getDistance(fromNote: string, toNote: string): number {
    return getSemitoneDistance(fromNote, toNote);
  }

  static getInstrument(id?: string | null): InstrumentConfig {
    return getInstrument(id);
  }

  static getAllInstruments(): InstrumentConfig[] {
    return getAllInstruments();
  }

  static clearCache(): void {
    this.chordCache.clear();
    this.shapesCache.clear();
  }
}

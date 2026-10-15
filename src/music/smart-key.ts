// =============================================================
// GUITAR ACADEMY / VIRTUO SMART KEY ENGINE
// src/music/smart-key.ts
// Sugestão inteligente de tonalidade para execução facilitada na guitarra
// Preserva a identidade harmônica e minimiza pestanas e dissonâncias
// =============================================================

import { transposeChord } from './transposer';

const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

const OPEN_SHAPES_MAJOR = ['G', 'C', 'D', 'E', 'A'];
const OPEN_SHAPES_MINOR = ['Em', 'Am', 'Dm'];
const BARRE_CHORDS = ['F', 'B', 'Bb', 'F#', 'F#m', 'Bm', 'G#m', 'C#m', 'D#m', 'Ab', 'Eb', 'Cm', 'Fm'];

function calculateEffortScore(chords: string[]): number {
  let score = 0;
  for (const chord of chords) {
    if (BARRE_CHORDS.some((b) => chord === b || chord.startsWith(b))) {
      score += 3;
    }
    if (chord.includes('/')) {
      score += 1.5;
    }
    if (/(?:maj7|7M|9|11|13|dim|aug|m7b5)/i.test(chord)) {
      score += 1;
    }
  }
  return score;
}

export interface SmartKeySuggestion {
  originalKey: string;
  recommendedKey: string;
  recommendedCapo: number;
  semitoneOffset: number;
  reason: string;
  isOriginalBest: boolean;
  originalEffort: number;
  targetEffort: number;
  chordsInTargetKey: string[];
}

export function suggestSmartKey(
  songOrChords: string | string[] | { chords?: string; chordSheet?: string; key?: string },
  currentKey = 'G'
): SmartKeySuggestion {
  const chordsInput =
    typeof songOrChords === 'object' && songOrChords !== null
      ? (songOrChords as any).chords || (songOrChords as any).chordSheet || ''
      : String(songOrChords || '');

  const origKey =
    typeof songOrChords === 'object' && songOrChords !== null && (songOrChords as any).key
      ? (songOrChords as any).key
      : currentKey || 'G';

  const isMinor = origKey.endsWith('m');
  const cleanRoot = origKey
    .replace('m', '')
    .replace('Db', 'C#')
    .replace('Eb', 'D#')
    .replace('Gb', 'F#')
    .replace('Ab', 'G#')
    .replace('Bb', 'A#');

  const rootIndex = CHROMATIC_SCALE.indexOf(cleanRoot as any);

  let uniqueOriginalChords: string[] = [];
  if (Array.isArray(chordsInput)) {
    uniqueOriginalChords = [...new Set(chordsInput.map((c) => String(c).trim()).filter(Boolean))];
  } else {
    const matches =
      String(chordsInput).match(/[A-G][b#]?(?:m|maj|min|dim|aug|sus[24]?|add[29]?|[0-9]+)*(?:\/[A-G][b#]*)?/g) || [];
    uniqueOriginalChords = [...new Set(matches.map((c) => c.trim()).filter((c) => /^[A-G]/.test(c)))];
  }

  const originalEffort = calculateEffortScore(uniqueOriginalChords);
  const candidateShapes = isMinor ? OPEN_SHAPES_MINOR : OPEN_SHAPES_MAJOR;

  if (candidateShapes.includes(origKey) && originalEffort <= 4) {
    return {
      originalKey: origKey,
      recommendedKey: origKey,
      recommendedCapo: 0,
      semitoneOffset: 0,
      reason: `A tonalidade original (${origKey}) já utiliza acordes abertos naturais na guitarra com excelente ressonância e pouca ou nenhuma pestana.`,
      isOriginalBest: true,
      originalEffort,
      targetEffort: originalEffort,
      chordsInTargetKey: uniqueOriginalChords
    };
  }

  let bestCandidate: {
    recommendedKey: string;
    recommendedCapo: number;
    semitoneOffset: number;
    effort: number;
    transposedChords: string[];
  } | null = null;
  let lowestEffort = 999;

  for (const shape of candidateShapes) {
    const shapeClean = shape
      .replace('m', '')
      .replace('Db', 'C#')
      .replace('Eb', 'D#')
      .replace('Gb', 'F#')
      .replace('Ab', 'G#')
      .replace('Bb', 'A#');
    const shapeIdx = CHROMATIC_SCALE.indexOf(shapeClean as any);
    if (shapeIdx === -1 || rootIndex === -1) continue;

    const capoFret = (rootIndex - shapeIdx + 12) % 12;
    if (capoFret >= 0 && capoFret <= 7) {
      const transposedChords = uniqueOriginalChords.map((c) => transposeChord(c, -capoFret));
      const effort = calculateEffortScore(transposedChords);
      const totalScore = effort + capoFret * 0.3;

      if (totalScore < lowestEffort) {
        lowestEffort = totalScore;
        bestCandidate = {
          recommendedKey: shape,
          recommendedCapo: capoFret,
          semitoneOffset: -capoFret,
          effort,
          transposedChords
        };
      }
    }
  }

  if (bestCandidate && (bestCandidate.effort < originalEffort || originalEffort >= 6)) {
    const capoText =
      bestCandidate.recommendedCapo === 0
        ? 'sem capotraste'
        : `com Capo na ${bestCandidate.recommendedCapo}ª casa`;
    return {
      originalKey: origKey,
      recommendedKey: bestCandidate.recommendedKey,
      recommendedCapo: bestCandidate.recommendedCapo,
      semitoneOffset: bestCandidate.semitoneOffset,
      reason: `Reduz a dificuldade dos acordes mantendo a região harmônica e o tom original. Toque em digitações de ${bestCandidate.recommendedKey} ${capoText}.`,
      isOriginalBest: false,
      originalEffort,
      targetEffort: bestCandidate.effort,
      chordsInTargetKey: bestCandidate.transposedChords
    };
  }

  return {
    originalKey: origKey,
    recommendedKey: origKey,
    recommendedCapo: 0,
    semitoneOffset: 0,
    reason: `Mantenha o tom de ${origKey}. Os acordes estão equilibrados para execução na guitarra.`,
    isOriginalBest: true,
    originalEffort,
    targetEffort: originalEffort,
    chordsInTargetKey: uniqueOriginalChords
  };
}

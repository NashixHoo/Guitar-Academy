// =============================================================
// GUITAR ACADEMY / VIRTUO MUSIC INTELLIGENCE ENGINE 2.0
// src/music/music-intelligence.ts
// Análise musical determinística avançada - 100% offline
// Zero chamadas a APIs externas, execução imediata (< 2ms)
// =============================================================

import { simplifyChord, identifySubstitutableChords } from './easy-play';
import { suggestSmartKey, SmartKeySuggestion } from './smart-key';
import { generateStudyPlan, GeneratedStudyPlan } from './study-plan';
import { parseChord, CHORD_FINDER_REGEX } from './chord-parser';

export const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const PREFERRED_OPEN_KEYS_MAJOR = ['G', 'C', 'D', 'E', 'A'];
export const PREFERRED_OPEN_KEYS_MINOR = ['Em', 'Am', 'Dm'];

const MAJOR_SCALE_DEGREES: Record<number, { roman: string; quality: string }> = {
  0: { roman: 'I', quality: 'maj' },
  2: { roman: 'ii', quality: 'min' },
  4: { roman: 'iii', quality: 'min' },
  5: { roman: 'IV', quality: 'maj' },
  7: { roman: 'V', quality: 'maj' },
  9: { roman: 'vi', quality: 'min' },
  11: { roman: 'vii°', quality: 'dim' }
};

const MINOR_SCALE_DEGREES: Record<number, { roman: string; quality: string }> = {
  0: { roman: 'i', quality: 'min' },
  2: { roman: 'ii°', quality: 'dim' },
  3: { roman: 'III', quality: 'maj' },
  5: { roman: 'iv', quality: 'min' },
  7: { roman: 'v', quality: 'min' },
  8: { roman: 'VI', quality: 'maj' },
  10: { roman: 'VII', quality: 'maj' }
};

const RELATIVE_KEYS_MAP: Record<string, string> = {
  'Am': 'C', 'Em': 'G', 'Bm': 'D', 'F#m': 'A', 'C#m': 'E', 'G#m': 'B',
  'Dm': 'F', 'Gm': 'Bb', 'Cm': 'Eb', 'Fm': 'Ab', 'Bbm': 'Db', 'D#m': 'F#',
  'A#m': 'C#', 'Ebm': 'Gb',
  'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m', 'E': 'C#m', 'B': 'G#m',
  'F': 'Dm', 'Bb': 'Gm', 'Eb': 'Cm', 'Ab': 'Fm', 'Db': 'Bbm', 'F#': 'D#m',
  'C#': 'A#m', 'Gb': 'Ebm'
};

export interface SongAnalysisResult {
  key: string;
  relativeKey: string;
  bpm: number;
  timeSignature: string;
  difficulty: string;
  chordCount: number;
  uniqueChords: string[];
  progression: string[];
  progressionDetails: { chord: string; degree: string; interval?: number }[];
  cadence: string;
  sections: string[];
  smartKeySuggestion: SmartKeySuggestion;
  easyPlayAvailable: boolean;
  difficultyReasons: string[];
  seventhChords: string[];
  extendedChords: string[];
  slashChords: string[];
  fastChanges: boolean;
  repeatingProgressions: string[];
  simplificationSuggestions: { original: string; easy: string; harmonicFunction: string; reason: string }[];
  studyPlan: GeneratedStudyPlan;
  score: number;
}

export class MusicIntelligence {
  static getRelativeKey(key = 'G'): string {
    if (!key) return 'Em';
    const clean = key.trim();
    if (RELATIVE_KEYS_MAP[clean]) {
      return RELATIVE_KEYS_MAP[clean];
    }
    const isMinor = clean.endsWith('m');
    const root = clean
      .replace('m', '')
      .replace('Db', 'C#')
      .replace('Eb', 'D#')
      .replace('Gb', 'F#')
      .replace('Ab', 'G#')
      .replace('Bb', 'A#');

    const idx = CHROMATIC_SCALE.indexOf(root as any);
    if (idx === -1) return isMinor ? 'C' : 'Am';

    if (isMinor) {
      const majorIdx = (idx + 3) % 12;
      const target = CHROMATIC_SCALE[majorIdx];
      const flatEquivalents: Record<string, string> = { 'D#': 'Eb', 'G#': 'Ab', 'A#': 'Bb', 'C#': 'Db' };
      return flatEquivalents[target] || target;
    } else {
      const minorIdx = (idx + 9) % 12;
      const target = CHROMATIC_SCALE[minorIdx];
      return `${target}m`;
    }
  }

  static extractChords(input: any): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return [...new Set(input.map((c) => String(c).trim()).filter(Boolean))];
    const text = String(input);
    const matches = text.match(CHORD_FINDER_REGEX);
    if (!matches) return [];
    return [...new Set(matches.map((c) => c.trim()).filter((c) => parseChord(c) !== null))];
  }

  static extractSequentialChords(input: any): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input.map((c) => String(c).trim()).filter(Boolean);
    const text = String(input);
    const matches = text.match(CHORD_FINDER_REGEX);
    if (!matches) return [];
    return matches.map((c) => c.trim()).filter((c) => parseChord(c) !== null);
  }

  static extractSections(song: any): string[] {
    const sections: string[] = [];
    if (song?.structure && typeof song.structure === 'string') {
      const parts = song.structure.split(/•|-|\/|,/).map((s: string) => s.trim()).filter(Boolean);
      if (parts.length > 0) return parts;
    }
    const chordsText = typeof song?.chords === 'string' ? song.chords : song?.chordSheet || '';
    const tagMatches = chordsText.match(/\[([^\]]+)\]/g);
    if (tagMatches && tagMatches.length > 0) {
      tagMatches.forEach((tag: string) => {
        const clean = tag.replace(/\[|\]/g, '').trim();
        if (clean && !sections.includes(clean)) {
          sections.push(clean);
        }
      });
    }
    if (sections.length > 0) return sections;
    return ['Intro', 'Verso', 'Refrão', 'Solo', 'Final'];
  }

  static calculateDeterministicDifficulty(
    chordsInput: any,
    bpm = 74,
    structureInput = ''
  ): {
    difficulty: string;
    score: number;
    reasons: string[];
    totalChords: number;
    uniqueCount: number;
  } {
    const uniqueChords = this.extractChords(chordsInput);
    const sequentialChords = this.extractSequentialChords(chordsInput);
    let score = 0;
    const reasons: string[] = [];

    const barreChords = ['F', 'B', 'Bb', 'F#', 'F#m', 'Bm', 'G#m', 'C#m', 'D#m', 'Ab', 'Eb', 'Cm', 'Fm'];
    const slashChords = uniqueChords.filter((c) => c.includes('/'));
    const seventhChords = uniqueChords.filter((c) => /(?:7|7M|maj7|m7)/i.test(c));
    const complexExtensions = uniqueChords.filter((c) => /(?:9|11|13|dim|aug|m7b5|sus|add|°|\+)/i.test(c));
    const foundBarres = uniqueChords.filter((c) => barreChords.some((b) => c === b || c.startsWith(b)));

    if (uniqueChords.length >= 9) {
      score += 4;
      reasons.push(`${uniqueChords.length} acordes diferentes na harmonia`);
    } else if (uniqueChords.length >= 6) {
      score += 2;
      reasons.push(`${uniqueChords.length} acordes diferentes`);
    }

    if (foundBarres.length > 0) {
      score += foundBarres.length * 2;
      reasons.push(`${foundBarres.length} acorde(s) com pestana (${foundBarres.slice(0, 3).join(', ')})`);
    }

    if (slashChords.length > 0) {
      score += slashChords.length * 1.5;
      reasons.push(`${slashChords.length} baixo(s) invertido(s) (${slashChords.slice(0, 3).join(', ')})`);
    }

    if (complexExtensions.length > 0) {
      score += complexExtensions.length * 1.5;
      reasons.push(`${complexExtensions.length} acorde(s) com extensão (${complexExtensions.slice(0, 3).join(', ')})`);
    }

    if (seventhChords.length > 0 && complexExtensions.length === 0) {
      score += seventhChords.length * 0.8;
      reasons.push(`${seventhChords.length} acorde(s) com sétima (${seventhChords.slice(0, 3).join(', ')})`);
    }

    const numericBpm = Number(bpm) || 74;
    if (numericBpm > 125) {
      score += 3;
      reasons.push(`Andamento rápido (${numericBpm} BPM)`);
    } else if (numericBpm < 55) {
      score += 1.5;
      reasons.push(`Andamento lento exigindo sustentação (${numericBpm} BPM)`);
    }

    const sectionsCount = structureInput ? structureInput.split(/•|-|\/|,/).length : 4;
    if (sectionsCount > 5) {
      score += 2;
      reasons.push(`Estrutura longa com ${sectionsCount} seções`);
    }

    let difficulty = 'Iniciante';
    if (score >= 14) {
      difficulty = 'Avançado';
    } else if (score >= 8) {
      difficulty = 'Difícil';
    } else if (score >= 3.5) {
      difficulty = 'Intermediário';
    }

    if (reasons.length === 0) {
      reasons.push('Harmonia limpa com digitações abertas e progressão direta na guitarra');
    }

    return {
      difficulty,
      score: parseFloat(score.toFixed(1)),
      reasons,
      totalChords: sequentialChords.length,
      uniqueCount: uniqueChords.length
    };
  }

  static analyzeProgression(chordsInput: any, key = 'G') {
    const chords = this.extractChords(chordsInput);
    const isMinor = key.endsWith('m');
    const tonicClean = key
      .replace('m', '')
      .replace('Db', 'C#')
      .replace('Eb', 'D#')
      .replace('Gb', 'F#')
      .replace('Ab', 'G#')
      .replace('Bb', 'A#');

    const tonicIdx = CHROMATIC_SCALE.indexOf(tonicClean as any);
    if (tonicIdx === -1) {
      return { progression: [], progressionDegrees: [], cadence: 'Progressão Livre' };
    }

    const degreeTable = isMinor ? MINOR_SCALE_DEGREES : MAJOR_SCALE_DEGREES;
    const progression = chords.map((chord) => {
      const baseNote = chord
        .split('/')[0]
        .replace('m', '')
        .replace('7', '')
        .replace('9', '')
        .replace('sus4', '')
        .replace('4', '');
      const cleanBase = baseNote
        .replace('Db', 'C#')
        .replace('Eb', 'D#')
        .replace('Gb', 'F#')
        .replace('Ab', 'G#')
        .replace('Bb', 'A#');

      const baseIdx = CHROMATIC_SCALE.indexOf(cleanBase as any);
      if (baseIdx === -1) {
        return { chord, degree: '?' };
      }

      const interval = (baseIdx - tonicIdx + 12) % 12;
      const degInfo = degreeTable[interval];
      return {
        chord,
        degree: degInfo ? degInfo.roman : `b${interval}`,
        interval
      };
    });

    const progressionDegrees = progression.map((p) => p.degree);
    const degreesStr = progression.map((p) => p.degree).join(' - ');
    let cadence = 'Harmonia Contemporânea';

    if (degreesStr.includes('I - V - vi - IV') || degreesStr.includes('I - IV - vi - V')) {
      cadence = 'Progressão Pop/Rock (I - V - vi - IV)';
    } else if (degreesStr.includes('vi - IV - I - V')) {
      cadence = 'Cadência Menor Épica (vi - IV - I - V)';
    } else if (degreesStr.includes('ii - V - I')) {
      cadence = 'Cadência Clássica / Jazz (ii - V - I)';
    } else if (degreesStr.includes('I - IV - I')) {
      cadence = 'Cadência Plagal (I - IV - I)';
    } else if (degreesStr.includes('I - IV - V')) {
      cadence = 'Cadência Rock / Blues (I - IV - V)';
    }

    return {
      key,
      isMinor,
      progression,
      progressionDegrees,
      cadence
    };
  }

  static analyzeSong(song: any): SongAnalysisResult {
    const chordsSource = Array.isArray(song?.chords)
      ? song.chords
      : typeof song?.chords === 'string'
      ? song.chords
      : song?.chordSheet || '';
    const key = song?.key || 'G';
    const bpm = Number(song?.bpm) || 74;
    const timeSignature = song?.timeSignature || '4/4';
    const uniqueChords = this.extractChords(chordsSource);
    const sequentialChords = this.extractSequentialChords(chordsSource);
    const relativeKey = this.getRelativeKey(key);
    const sections = this.extractSections(song);

    const diffAnalysis = this.calculateDeterministicDifficulty(
      chordsSource,
      bpm,
      song?.structure || sections.join(' • ')
    );

    const seventhChords = uniqueChords.filter((c) => /(?:7|7M|maj7|m7)/i.test(c));
    const extendedChords = uniqueChords.filter((c) => /(?:9|11|13|dim|aug|m7b5|sus|add|°|\+)/i.test(c));
    const slashChords = uniqueChords.filter((c) => c.includes('/'));
    const progressionAnalysis = this.analyzeProgression(uniqueChords, key);

    const smartKeySuggestion = suggestSmartKey(song, key);
    const substitutableChords = identifySubstitutableChords(uniqueChords, key);
    const easyPlayAvailable = substitutableChords.some((s) => s.canSimplify);

    const simplificationSuggestions = substitutableChords
      .filter((s) => s.canSimplify)
      .map((s) => ({
        original: s.original,
        easy: s.easy,
        harmonicFunction: s.harmonicFunction,
        reason: s.reason
      }));

    const studyPlan = generateStudyPlan(song, { uniqueChords, difficulty: diffAnalysis.difficulty, bpm });

    return {
      key,
      relativeKey,
      bpm,
      timeSignature,
      difficulty: diffAnalysis.difficulty,
      chordCount: sequentialChords.length,
      uniqueChords,
      progression: progressionAnalysis.progressionDegrees || [],
      progressionDetails: progressionAnalysis.progression || [],
      cadence: progressionAnalysis.cadence,
      sections,
      smartKeySuggestion,
      easyPlayAvailable,
      difficultyReasons: diffAnalysis.reasons,
      seventhChords,
      extendedChords,
      slashChords,
      fastChanges: diffAnalysis.reasons.some((r) => r.includes('rápidas')),
      repeatingProgressions: [],
      simplificationSuggestions,
      studyPlan,
      score: diffAnalysis.score
    };
  }
}

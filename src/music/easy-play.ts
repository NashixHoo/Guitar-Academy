// =============================================================
// GUITAR ACADEMY / VIRTUO MUSICAL ENGINE: EASY PLAY 2.0
// src/music/easy-play.ts
// Simplificação e adaptação harmônica inteligente de acordes
// Preserva a função tonal e estrutura harmônica original
// =============================================================

import { parseChord, isChordLine, CHORD_FINDER_REGEX } from './chord-parser';
import { transposeChordSheet } from './transposer';

export function simplifyChord(chord: string): string {
  if (!chord || typeof chord !== 'string') return chord;
  const parsed = parseChord(chord);
  if (!parsed) return chord;
  const { root, modifier } = parsed;

  if (parsed.isMinor) {
    return `${root}m`;
  }
  if (modifier.includes('dim') || modifier.includes('°')) {
    return `${root}m`;
  }
  return root;
}

export function estimateHarmonicFunction(chord: string, key = 'G'): string {
  if (!chord) return 'Harmonia';
  const isMinorKey = key.endsWith('m');
  if (chord === key || chord.startsWith(key)) {
    return 'Tônica (Repouso Principal)';
  }
  if (chord.includes('/')) {
    return 'Condução de Baixo / Inversão';
  }
  if (chord.includes('7') && !chord.includes('7M') && !chord.includes('maj7')) {
    return 'Dominante / Preparação';
  }
  if (chord.includes('sus') || chord.includes('4')) {
    return 'Suspensão Harmônica';
  }
  if (chord.includes('9') || chord.includes('add9') || chord.includes('7M')) {
    return 'Tensão Colorida / Ambiência';
  }
  if (isMinorKey && chord.endsWith('m')) {
    return 'Grau Menor Congregacional';
  }
  return 'Acorde Harmônico';
}

export interface ChordSubstitution {
  original: string;
  easy: string;
  canSimplify: boolean;
  harmonicFunction: string;
  reason: string;
}

export function identifySubstitutableChords(chordsInput: string | string[], key = 'G'): ChordSubstitution[] {
  let chordList: string[] = [];
  if (Array.isArray(chordsInput)) {
    chordList = chordsInput;
  } else if (typeof chordsInput === 'string') {
    const matches =
      chordsInput.match(/[A-G][b#]?(?:m|maj|min|dim|aug|sus[24]?|add[29]?|[0-9]+)*(?:\/[A-G][b#]*)?/g) || [];
    chordList = matches;
  }

  const unique = [...new Set(chordList.map((c) => c.trim()).filter(Boolean))];

  return unique.map((chord) => {
    const easy = simplifyChord(chord);
    const canSimplify = easy !== chord;
    const harmonicFunction = estimateHarmonicFunction(chord, key);
    let reason = 'Acorde fundamental já otimizado.';

    if (canSimplify) {
      if (chord.includes('/')) {
        reason = `Substitui o baixo invertido por ${easy} fundamental, aliviando a digitação da mão esquerda na guitarra mantendo a base.`;
      } else if (chord.includes('9') || chord.includes('add')) {
        reason = `Remove a nona de tensão, preservando a tríade ${easy} para sustentação tonal estável.`;
      } else if (chord.includes('7M') || chord.includes('maj7')) {
        reason = `Converte a 7ª maior em tríade ${easy} pura, preservando a função de repouso harmônico.`;
      } else if (chord.includes('sus') || chord.includes('4')) {
        reason = `Resolve a suspensão diretamente na tríade ${easy}.`;
      } else if (chord.includes('m') && (chord.includes('7') || chord.includes('9'))) {
        reason = `Simplifica o acorde menor estendido para ${easy} fundamental.`;
      } else {
        reason = `Converte a dissonância para a tríade fundamental ${easy}.`;
      }
    }

    return {
      original: chord,
      easy,
      canSimplify,
      harmonicFunction,
      reason
    };
  });
}

export function compareOriginalAndEasyPlay(chordSheetOrChords: string | string[], key = 'G') {
  const substitutions = identifySubstitutableChords(chordSheetOrChords, key);
  const totalOriginal = substitutions.length;
  const changedList = substitutions.filter((s) => s.canSimplify);
  const changedCount = changedList.length;
  const percentSimplified =
    totalOriginal > 0 ? `${Math.round((changedCount / totalOriginal) * 100)}%` : '0%';
  const diffSummary =
    changedCount > 0
      ? `${changedCount} de ${totalOriginal} acordes (${percentSimplified}) foram simplificados para tríades fundamentais abertas na guitarra.`
      : 'Esta música já utiliza exclusivamente acordes fundamentais abertos.';

  return {
    substitutions,
    changedList,
    totalOriginal,
    changedCount,
    percentSimplified,
    diffSummary
  };
}

export function generateEasyPlaySheet(chordSheet: string | string[]): string | string[] {
  if (!chordSheet) return '';
  if (Array.isArray(chordSheet)) {
    return chordSheet.map((c) => (typeof c === 'string' ? simplifyChord(c) : c));
  }

  const sheetStr = typeof chordSheet === 'string' ? chordSheet : String(chordSheet || '');
  return sheetStr
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      const sectionMatch = line.match(/^(\s*\[[^\]]+\]\s*)(.*)$/);
      if (sectionMatch) {
        const tag = sectionMatch[1];
        const rest = sectionMatch[2];
        if (!rest.trim()) return line;
        const simplifiedRest = rest.replace(CHORD_FINDER_REGEX, (match) => simplifyChord(match));
        return `${tag}${simplifiedRest}`;
      }

      if (/\[[A-G][b#]?[^\]]*\]/.test(line)) {
        return line.replace(/\[([A-G][b#]?[^\]]*)\]/g, (full, chordInside) => {
          return `[${simplifyChord(chordInside)}]`;
        });
      }

      if (isChordLine(line)) {
        return line.replace(CHORD_FINDER_REGEX, (match) => simplifyChord(match));
      }

      return line;
    })
    .join('\n');
}

import { CURRICULUM_LEVELS } from '../data/curriculum';
import { CHORD_DATABASE } from '../data/chordDatabase';
import { SCALES, INTERVALS, CIRCLE_OF_FIFTHS } from '../data/musicTheory';

export type SearchResultType = 'lesson' | 'chord' | 'theory';

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  badge: string;
  category: string;
  detail?: string;
  score?: number;
  lessonId?: string;
  chordSymbol?: string;
  chordId?: string;
  theoryKey?: string;
  keywords: string[];
}

export interface SearchResultsGrouped {
  query: string;
  totalCount: number;
  lessons: SearchResultItem[];
  chords: SearchResultItem[];
  theory: SearchResultItem[];
  all: SearchResultItem[];
}

export const QUICK_SEARCH_SUGGESTIONS: string[] = [
  'Afinação padrão',
  'Pentatônica Menor',
  'Acorde C',
  'Círculo de Quintas',
  'Pestana F',
  'Power Chords',
  'Cadência II-V-I',
  'Tríades e Tétrades',
];

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Builds the static searchable index across all lessons, chords, and music theory topics
 */
function buildSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  // 1. Lessons from Curriculum
  CURRICULUM_LEVELS.forEach((level) => {
    level.lessons.forEach((lesson) => {
      const keywords = [
        lesson.title,
        lesson.subtitle,
        lesson.objective,
        level.name,
        level.badge,
        lesson.moduleTitle,
        `aula ${lesson.lessonNumber}`,
        `nivel ${lesson.level}`,
        ...lesson.parts.map((p) => p.title),
      ];

      items.push({
        id: `lesson-${lesson.id}`,
        type: 'lesson',
        title: lesson.title,
        subtitle: lesson.subtitle,
        badge: `Nível ${lesson.level}`,
        category: lesson.moduleTitle,
        detail: `${lesson.estimatedMinutes} min • ${lesson.parts.length} seções práticas`,
        lessonId: lesson.id,
        keywords,
      });
    });
  });

  // 2. Chords from Chord Database
  CHORD_DATABASE.forEach((chord) => {
    const keywords = [
      chord.symbol,
      chord.namePt,
      chord.root,
      chord.rootPt,
      chord.type,
      chord.category,
      chord.formula,
      ...chord.notes,
      ...chord.notesPt,
      ...(chord.intervals || []),
      'acorde',
      'cifra',
    ];

    items.push({
      id: `chord-${chord.id}`,
      type: 'chord',
      title: `${chord.symbol} (${chord.namePt})`,
      subtitle: `Fórmula: ${chord.formula} • Notas: ${chord.notes.join(', ')}`,
      badge: chord.category,
      category: 'Dicionário de Acordes',
      detail: chord.description,
      chordSymbol: chord.symbol,
      chordId: chord.id,
      keywords,
    });
  });

  // 3. Theory: Scales
  SCALES.forEach((scale) => {
    items.push({
      id: `scale-${scale.id}`,
      type: 'theory',
      title: scale.name,
      subtitle: `Fórmula: ${scale.formula} • Clima: ${scale.mood}`,
      badge: 'Escala',
      category: 'Teoria Musical: Escalas & Modos',
      detail: scale.description,
      keywords: [scale.name, scale.formula, scale.mood, scale.description, 'escala', 'solo', 'improvisação'],
    });
  });

  // 4. Theory: Intervals
  INTERVALS.forEach((interval) => {
    items.push({
      id: `interval-${interval.shortName}`,
      type: 'theory',
      title: `${interval.name} (${interval.shortName})`,
      subtitle: `${interval.semitones} semitons • Distância no braço: ${interval.fretDistance}`,
      badge: 'Intervalo',
      category: 'Teoria Musical: Intervalos',
      detail: `${interval.soundDescription} (Ex: ${interval.example})`,
      keywords: [
        interval.name,
        interval.shortName,
        `${interval.semitones} semitons`,
        interval.example,
        interval.soundDescription,
        'intervalo',
        'distancia',
      ],
    });
  });

  // 5. Theory: Circle of Fifths
  CIRCLE_OF_FIFTHS.forEach((cof) => {
    items.push({
      id: `cof-${cof.major}`,
      type: 'theory',
      title: `Círculo de Quintas: ${cof.keyPt}`,
      subtitle: `Tonalidade Maior: ${cof.major} • Relativa Menor: ${cof.minor} • Armadura: ${cof.sharpsFlats}`,
      badge: 'Círculo de Quintas',
      category: 'Teoria Musical: Harmonia & Tonalidades',
      detail: `Vizinhos funcionais: Subdominante (IV) e Dominante (V) geram cadências harmônicas.`,
      theoryKey: cof.major,
      keywords: [
        'circulo de quintas',
        'quintas',
        cof.major,
        cof.minor,
        cof.keyPt,
        cof.sharpsFlats,
        'tonalidade',
        'armadura',
      ],
    });
  });

  // 6. Theory: Core Concepts (Triads, Tetrads, Harmonic Field, Cadences)
  items.push(
    {
      id: 'concept-triads',
      type: 'theory',
      title: 'Formação de Tríades (Maiores, Menores e Diminutas)',
      subtitle: 'Estruturas de 3 notas: Fundamental (1), Terça (3/b3) e Quinta (5/b5)',
      badge: 'Harmonia',
      category: 'Teoria Musical: Harmonia',
      detail: 'Maior (1-3-5), Menor (1-b3-5), Diminuta (1-b3-b5) e Aumentada (1-3-#5).',
      keywords: ['triades', 'formacao de acordes', 'harmonia', 'terca maior', 'terca menor', 'quinta justa'],
    },
    {
      id: 'concept-tetrads',
      type: 'theory',
      title: 'Formação de Tétrades (7M, 7 Dominante, m7, m7b5)',
      subtitle: 'Estruturas de 4 notas que adicionam a 7ª para sonoridade rica e sofisticada',
      badge: 'Harmonia',
      category: 'Teoria Musical: Harmonia',
      detail: '7M (1-3-5-7), 7 (1-3-5-b7), m7 (1-b3-5-b7), m7b5 (1-b3-b5-b7).',
      keywords: ['tetrades', 'setima', 'setima maior', 'setima menor', 'acorde com setima', 'bossa nova'],
    },
    {
      id: 'concept-harmonic-field',
      type: 'theory',
      title: 'Campo Harmônico Maior e Funções Tonais',
      subtitle: 'I7M - IIm7 - IIIm7 - IV7M - V7 - VIm7 - VIIm7(b5)',
      badge: 'Harmonia',
      category: 'Teoria Musical: Harmonia',
      detail: 'Três funções mestras: Tônica (repouso), Subdominante (afastamento) e Dominante (tensão que resolve no I).',
      keywords: ['campo harmonico', 'funcoes tonais', 'tonica', 'subdominante', 'dominante', 'graus'],
    },
    {
      id: 'concept-251-cadence',
      type: 'theory',
      title: 'A Cadência Mestra II - V - I (Preparação & Resolução)',
      subtitle: 'A progressão mais importante da música popular, Jazz, MPB e Worship',
      badge: 'Harmonia',
      category: 'Teoria Musical: Harmonia',
      detail: 'O IIm7 prepara, o V7 cria tensão com o trítono e resolve perfeitamente no repouso do I7M.',
      keywords: ['cadencia', '251', 'ii-v-i', 'resolucao', 'tritono', 'preparacao'],
    }
  );

  return items;
}

const SEARCH_INDEX = buildSearchIndex();

/**
 * Searches across all indexed lessons, chords, and music theory topics
 */
export function searchAll(query: string, maxResults = 25): SearchResultsGrouped {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return {
      query: '',
      totalCount: 0,
      lessons: [],
      chords: [],
      theory: [],
      all: [],
    };
  }

  const normQuery = normalizeText(cleanQuery);
  const scoredItems: SearchResultItem[] = [];

  for (const item of SEARCH_INDEX) {
    let score = 0;
    const normTitle = normalizeText(item.title);
    const normSubtitle = normalizeText(item.subtitle);
    const normCategory = normalizeText(item.category);
    const normBadge = normalizeText(item.badge);

    // Exact matches
    if (normTitle === normQuery || (item.chordSymbol && normalizeText(item.chordSymbol) === normQuery)) {
      score += 100;
    } else if (normTitle.startsWith(normQuery) || (item.chordSymbol && normalizeText(item.chordSymbol).startsWith(normQuery))) {
      score += 80;
    } else if (normTitle.includes(` ${normQuery}`) || normTitle.includes(`(${normQuery}`)) {
      score += 65;
    } else if (normTitle.includes(normQuery)) {
      score += 50;
    }

    // Subtitle & details match
    if (normSubtitle.includes(normQuery)) {
      score += 35;
    }
    if (item.detail && normalizeText(item.detail).includes(normQuery)) {
      score += 20;
    }
    if (normCategory.includes(normQuery) || normBadge.includes(normQuery)) {
      score += 25;
    }

    // Keywords match
    for (const kw of item.keywords) {
      const normKw = normalizeText(kw);
      if (normKw === normQuery) {
        score += 45;
        break;
      } else if (normKw.startsWith(normQuery)) {
        score += 30;
        break;
      } else if (normKw.includes(normQuery)) {
        score += 15;
        break;
      }
    }

    // Direct cipher / chord special handling (e.g. searching "C", "Am", "G7", "Em")
    if (item.type === 'chord' && item.chordSymbol) {
      if (item.chordSymbol.toLowerCase() === cleanQuery.toLowerCase()) {
        score += 90;
      }
    }

    if (score > 0) {
      scoredItems.push({
        ...item,
        score,
      });
    }
  }

  // Sort by score descending
  scoredItems.sort((a, b) => (b.score || 0) - (a.score || 0));

  const limited = scoredItems.slice(0, maxResults);

  const lessons = limited.filter((i) => i.type === 'lesson');
  const chords = limited.filter((i) => i.type === 'chord');
  const theory = limited.filter((i) => i.type === 'theory');

  return {
    query: cleanQuery,
    totalCount: limited.length,
    lessons,
    chords,
    theory,
    all: limited,
  };
}

/**
 * Returns raw search index size and metadata for test audit
 */
export function getSearchIndexStats() {
  return {
    totalItems: SEARCH_INDEX.length,
    lessonsCount: SEARCH_INDEX.filter((i) => i.type === 'lesson').length,
    chordsCount: SEARCH_INDEX.filter((i) => i.type === 'chord').length,
    theoryCount: SEARCH_INDEX.filter((i) => i.type === 'theory').length,
  };
}

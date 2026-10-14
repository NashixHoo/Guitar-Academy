import { NoteCipher, NotePortuguese } from '../types';

export const CHROMATIC_NOTES: NoteCipher[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export const CHROMATIC_NOTES_PT: NotePortuguese[] = [
  'Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'
];

export const ENHARMONIC_MAP: Record<string, { cipher: NoteCipher; pt: string; altCipher: string; altPt: string }> = {
  'C#': { cipher: 'C#', pt: 'Dó#', altCipher: 'Db', altPt: 'Réb' },
  'D#': { cipher: 'D#', pt: 'Ré#', altCipher: 'Eb', altPt: 'Mib' },
  'F#': { cipher: 'F#', pt: 'Fá#', altCipher: 'Gb', altPt: 'Solb' },
  'G#': { cipher: 'G#', pt: 'Sol#', altCipher: 'Ab', altPt: 'Láb' },
  'A#': { cipher: 'A#', pt: 'Lá#', altCipher: 'Bb', altPt: 'Sib' },
};

export const CIPHER_TO_PT: Record<NoteCipher, NotePortuguese> = {
  'C': 'Dó',
  'C#': 'Dó#',
  'D': 'Ré',
  'D#': 'Ré#',
  'E': 'Mi',
  'F': 'Fá',
  'F#': 'Fá#',
  'G': 'Sol',
  'G#': 'Sol#',
  'A': 'Lá',
  'A#': 'Lá#',
  'B': 'Si',
};

export const PT_TO_CIPHER: Record<NotePortuguese, NoteCipher> = {
  'Dó': 'C',
  'Dó#': 'C#',
  'Ré': 'D',
  'Ré#': 'D#',
  'Mi': 'E',
  'Fá': 'F',
  'Fá#': 'F#',
  'Sol': 'G',
  'Sol#': 'G#',
  'Lá': 'A',
  'Lá#': 'A#',
  'Si': 'B',
};

export interface GuitarStringDef {
  stringNumber: number; // 1 to 6 (1 = high E, 6 = low E)
  openNoteCipher: NoteCipher;
  openNotePt: NotePortuguese;
  octave: number;
  openFrequencyHz: number;
  gaugeLabel: string;
}

export const STANDARD_TUNING: GuitarStringDef[] = [
  { stringNumber: 1, openNoteCipher: 'E', openNotePt: 'Mi', octave: 4, openFrequencyHz: 329.63, gaugeLabel: '1ª corda (mais fina)' },
  { stringNumber: 2, openNoteCipher: 'B', openNotePt: 'Si', octave: 3, openFrequencyHz: 246.94, gaugeLabel: '2ª corda' },
  { stringNumber: 3, openNoteCipher: 'G', openNotePt: 'Sol', octave: 3, openFrequencyHz: 196.00, gaugeLabel: '3ª corda' },
  { stringNumber: 4, openNoteCipher: 'D', openNotePt: 'Ré', octave: 3, openFrequencyHz: 146.83, gaugeLabel: '4ª corda' },
  { stringNumber: 5, openNoteCipher: 'A', openNotePt: 'Lá', octave: 2, openFrequencyHz: 110.00, gaugeLabel: '5ª corda' },
  { stringNumber: 6, openNoteCipher: 'E', openNotePt: 'Mi', octave: 2, openFrequencyHz: 82.41,  gaugeLabel: '6ª corda (mais grossa)' },
];

/**
 * Calculates note and frequency for any string and fret
 */
export function getFretNote(stringDef: GuitarStringDef, fret: number) {
  const baseIndex = CHROMATIC_NOTES.indexOf(stringDef.openNoteCipher);
  const targetIndex = (baseIndex + fret) % 12;
  const octaveShift = Math.floor((baseIndex + fret) / 12);
  const targetOctave = stringDef.octave + octaveShift;
  const cipher = CHROMATIC_NOTES[targetIndex];
  const pt = CIPHER_TO_PT[cipher];
  const frequencyHz = stringDef.openFrequencyHz * Math.pow(2, fret / 12);

  return {
    cipher,
    pt,
    octave: targetOctave,
    frequencyHz,
    fret,
    stringNumber: stringDef.stringNumber,
  };
}

export interface ScaleDefinition {
  id: string;
  name: string;
  formula: string; // e.g., "1, 2, 3, 4, 5, 6, 7"
  intervals: number[]; // semitones from root
  description: string;
  mood: string;
}

export const SCALES: ScaleDefinition[] = [
  {
    id: 'pentatonic-minor',
    name: 'Pentatônica Menor',
    formula: '1 - b3 - 4 - 5 - b7',
    intervals: [0, 3, 5, 7, 10],
    description: 'A escala mais utilizada na guitarra para Blues, Rock e solos em geral. Som marcante e expressivo.',
    mood: 'Bluesy, Rock, Tensa e Enérgica',
  },
  {
    id: 'pentatonic-major',
    name: 'Pentatônica Maior',
    formula: '1 - 2 - 3 - 5 - 6',
    intervals: [0, 2, 4, 7, 9],
    description: 'Sonoridade brilhante, melódica e limpa, essencial para Country, Southern Rock e Pop.',
    mood: 'Brilhante, Esperançosa, Aberta',
  },
  {
    id: 'blues',
    name: 'Escala Blues (com Blue Note)',
    formula: '1 - b3 - 4 - b5 - 5 - b7',
    intervals: [0, 3, 5, 6, 7, 10],
    description: 'Pentatônica menor com a adição da quinta diminuta (blue note), gerando a tensão clássica do blues.',
    mood: 'Clássico Blues, Tensa, Expressiva',
  },
  {
    id: 'major',
    name: 'Escala Maior (Modo Jônio)',
    formula: '1 - 2 - 3 - 4 - 5 - 6 - 7',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: 'Fundamento de toda a harmonia tonal ocidental. Padrão Tom-Tom-Semitom-Tom-Tom-Tom-Semitom.',
    mood: 'Alegre, Estável, Triunfante',
  },
  {
    id: 'minor-natural',
    name: 'Escala Menor Natural (Modo Eólio)',
    formula: '1 - 2 - b3 - 4 - 5 - b6 - b7',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: 'Relativa menor da escala maior. Base do Rock melódico, baladas e Metal.',
    mood: 'Melancólica, Solene, Dramática',
  },
  {
    id: 'dorian',
    name: 'Modo Dórico',
    formula: '1 - 2 - b3 - 4 - 5 - 6 - b7',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: 'Menor com a 6ª maior. Típico de Santana, Pink Floyd e Jazz Fusion.',
    mood: 'Sofisticada, Menor mas Esperançosa',
  },
  {
    id: 'mixolydian',
    name: 'Modo Mixolídio',
    formula: '1 - 2 - 3 - 4 - 5 - 6 - b7',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    description: 'Maior com a 7ª menor. O modo definitivo do Rock clássico (AC/DC, Jimi Hendrix).',
    mood: 'Rock and Roll, Festiva, Solta',
  },
  {
    id: 'harmonic-minor',
    name: 'Escala Menor Harmônica',
    formula: '1 - 2 - b3 - 4 - 5 - b6 - 7M',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    description: 'Menor com a 7ª maior gerando sensível. Cria o famoso som Neoclássico e Espanhol.',
    mood: 'Neoclássica, Dramática, Espanhola',
  },
];

export interface IntervalDefinition {
  name: string;
  shortName: string;
  semitones: number;
  fretDistance: string;
  example: string;
  soundDescription: string;
}

export const INTERVALS: IntervalDefinition[] = [
  { name: 'Segunda Menor', shortName: '2ªm', semitones: 1, fretDistance: '1 casa', example: 'Mi -> Fá / Si -> Dó', soundDescription: 'Altamente dissonante, suspense, efeito "Tubarão"' },
  { name: 'Segunda Maior', shortName: '2ªM', semitones: 2, fretDistance: '2 casas (1 tom)', example: 'Dó -> Ré', soundDescription: 'Passo melódico natural, suave tensão' },
  { name: 'Terceira Menor', shortName: '3ªm', semitones: 3, fretDistance: '3 casas', example: 'Lá -> Dó', soundDescription: 'Define o caráter triste/melancólico do acorde menor' },
  { name: 'Terceira Maior', shortName: '3ªM', semitones: 4, fretDistance: '4 casas', example: 'Dó -> Mi', soundDescription: 'Define o caráter alegre/estável do acorde maior' },
  { name: 'Quarta Justa', shortName: '4ªJ', semitones: 5, fretDistance: '5 casas (ou mesma casa na corda vizinha)', example: 'Dó -> Fá', soundDescription: 'Consonante, aberta, hino nacional, suspense sus4' },
  { name: 'Quarta Aumentada / Trítono', shortName: 'Trítono (b5/#4)', semitones: 6, fretDistance: '6 casas', example: 'Dó -> Fá#', soundDescription: 'Máxima tensão da harmonia, "diabolus in musica"' },
  { name: 'Quinta Justa', shortName: '5ªJ', semitones: 7, fretDistance: '7 casas', example: 'Dó -> Sol', soundDescription: 'Poderosa, pura, base de todos os power chords' },
  { name: 'Sexta Menor', shortName: '6ªm', semitones: 8, fretDistance: '8 casas', example: 'Dó -> Láb', soundDescription: 'Romântica, nostálgica, dramática' },
  { name: 'Sexta Maior', shortName: '6ªM', semitones: 9, fretDistance: '9 casas', example: 'Dó -> Lá', soundDescription: 'Doce, Bossa Nova, alegre sofisticada' },
  { name: 'Sétima Menor', shortName: '7ªm', semitones: 10, fretDistance: '10 casas', example: 'Dó -> Sib', soundDescription: 'Blues, acorde dominante, pede resolução' },
  { name: 'Sétima Maior', shortName: '7ªM', semitones: 11, fretDistance: '11 casas', example: 'Dó -> Si', soundDescription: 'Sonhadora, sofisticada, Jazz e MPB' },
  { name: 'Oitava Justa', shortName: '8ªJ', semitones: 12, fretDistance: '12 casas', example: 'Dó -> Dó (oitava superior)', soundDescription: 'Idêntica, uníssono perfeito expandido' },
];

export const CIRCLE_OF_FIFTHS = [
  { major: 'C', minor: 'Am', sharpsFlats: 'Nenhum', keyPt: 'Dó Maior / Lá Menor' },
  { major: 'G', minor: 'Em', sharpsFlats: '1 sustenido (F#)', keyPt: 'Sol Maior / Mi Menor' },
  { major: 'D', minor: 'Bm', sharpsFlats: '2 sustenidos (F#, C#)', keyPt: 'Ré Maior / Si Menor' },
  { major: 'A', minor: 'F#m', sharpsFlats: '3 sustenidos (F#, C#, G#)', keyPt: 'Lá Maior / Fá# Menor' },
  { major: 'E', minor: 'C#m', sharpsFlats: '4 sustenidos (F#, C#, G#, D#)', keyPt: 'Mi Maior / Dó# Menor' },
  { major: 'B', minor: 'G#m', sharpsFlats: '5 sustenidos', keyPt: 'Si Maior / Sol# Menor' },
  { major: 'F#', minor: 'D#m', sharpsFlats: '6 sustenidos', keyPt: 'Fá# Maior / Ré# Menor' },
  { major: 'Db', minor: 'Bbm', sharpsFlats: '5 bemóis', keyPt: 'Réb Maior / Sib Menor' },
  { major: 'Ab', minor: 'Fm', sharpsFlats: '4 bemóis', keyPt: 'Láb Maior / Fá Menor' },
  { major: 'Eb', minor: 'Cm', sharpsFlats: '3 bemóis (Bb, Eb, Ab)', keyPt: 'Mib Maior / Dó Menor' },
  { major: 'Bb', minor: 'Gm', sharpsFlats: '2 bemóis (Bb, Eb)', keyPt: 'Sib Maior / Sol Menor' },
  { major: 'F', minor: 'Dm', sharpsFlats: '1 bemol (Bb)', keyPt: 'Fá Maior / Ré Menor' },
];

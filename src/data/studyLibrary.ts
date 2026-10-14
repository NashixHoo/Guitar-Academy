export interface SongStudy {
  id: string;
  title: string;
  genre: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  key: string;
  bpm: number;
  timeSignature: string;
  chords: string[];
  progressionExplanation: string;
  tablatureSnippet?: string;
  audioNotes?: number[]; // Audio frequencies for demonstration
}

export const STUDY_LIBRARY: SongStudy[] = [
  {
    id: 'pop-rock-anthem',
    title: 'Progressão Universal do Pop/Rock (I - V - vi - IV)',
    genre: 'Pop / Rock',
    difficulty: 'Iniciante',
    key: 'C Maior (Dó)',
    bpm: 95,
    timeSignature: '4/4',
    chords: ['C', 'G', 'Am', 'F'],
    progressionExplanation: 'A progressão de acordes mais famosa da história moderna (Let It Be, With or Without You, Don\'t Stop Believin\'). Toca 4 tempos em cada acorde.',
    tablatureSnippet: `
  C                 G                 Am                F
E|-----------------|-----------------|-----------------|-----------------|
B|-------1---------|-------0---------|-------1---------|-------1---------|
G|-----0---0-------|-----0---0-------|-----2---2-------|-----2---2-------|
D|---2-------2---2-|---0-------0---0-|---2-------2---2-|---3-------3---3-|
A|-3-----------3---|-2-----------2---|-0-----------0---|-----------------|
E|-----------------|-----------------|-----------------|-1-----------1---|
    `,
  },
  {
    id: 'blues-12-bar',
    title: '12-Bar Blues Clássico em Mi (Shuffle)',
    genre: 'Blues Tradicional',
    difficulty: 'Iniciante',
    key: 'E (Mi)',
    bpm: 110,
    timeSignature: '4/4 (Shuffle)',
    chords: ['E7', 'A7', 'B7'],
    progressionExplanation: 'A forma sagrada de 12 compassos que deu origem ao Rock and Roll: 4 compassos em E7, 2 em A7, 2 em E7, 1 em B7, 1 em A7, 1 em E7 e o Turnaround em B7.',
    tablatureSnippet: `
  E5 / E6 Shuffle (Compassos 1-4)
E|---------------------------------------------------------|
B|---------------------------------------------------------|
G|---------------------------------------------------------|
D|---------------------------------------------------------|
A|--2--2--4--2--2--2--4--2--2--2--4--2--2--2--4--2---------|
E|--0--0--0--0--0--0--0--0--0--0--0--0--0--0--0--0---------|
    `,
  },
  {
    id: 'jazz-ii-v-i',
    title: 'Cadência Maior II - V - I em Dó',
    genre: 'Jazz / Harmonia Moderna',
    difficulty: 'Intermediário',
    key: 'C Maior',
    bpm: 120,
    timeSignature: '4/4 (Swing)',
    chords: ['Dm7', 'G7', 'C7M'],
    progressionExplanation: 'O pilar definitivo do repertório jazzístico. O segundo grau prepara o quinto dominante, que resolve magnificamente na tônica com sétima maior.',
    tablatureSnippet: `
  Dm7 (2 compassos)   G7 (2 compassos)   C7M (4 compassos)
E|-------------------|------------------|-------------------|
B|--6----------------|--3---------------|--5----------------|
G|--5----------------|--4---------------|--4----------------|
D|--7----------------|--3---------------|--5----------------|
A|--5----------------|--5---------------|--3----------------|
E|-------------------|--3---------------|-------------------|
    `,
  },
  {
    id: 'bossa-nova-groove',
    title: 'Levada de Bossa Nova Clássica (Tom Jobim Style)',
    genre: 'Bossa Nova / MPB',
    difficulty: 'Intermediário',
    key: 'F Maior',
    bpm: 130,
    timeSignature: '2/4',
    chords: ['F7M', 'G7', 'Gm7', 'C7'],
    progressionExplanation: 'O ritmo sincopado do violão brasileiro de João Gilberto. O polegar marca o baixo alternado nos tempos fortes enquanto os dedos indicador, médio e anelar puxam os acordes nas síncopas.',
    tablatureSnippet: `
  F7M (Síncopa clássica do violão brasileiro)
E|-------------------------------------------------------|
B|------1-------1-----------1-------1--------------------|
G|------2-------2-----------2-------2--------------------|
D|------2-------2-----------2-------2--------------------|
A|-------------------------------------------------------|
E|--1-------1-------1---1-------1-------1----------------|
    `,
  },
  {
    id: 'pentatonic-rock-riff',
    title: 'Riff Solo Clássico da Pentatônica de Lá Menor',
    genre: 'Classic Rock',
    difficulty: 'Iniciante',
    key: 'Am',
    bpm: 105,
    timeSignature: '4/4',
    chords: ['Am', 'G', 'F', 'E7'],
    progressionExplanation: 'Lick contendo o bend na 3ª corda (casa 7), puxando a nota Ré para Mi e resolvendo na tônica Lá (casa 5 da 1ª e 2ª cordas).',
    tablatureSnippet: `
E|----------------------5--------------------------------|
B|--------------------5---8p5----------------------------|
G|--7b9---(7)-------7---------7--5-----------------------|
D|---------------------------------7--5--7---------------|
A|-------------------------------------------------------|
E|-------------------------------------------------------|
    `,
  }
];

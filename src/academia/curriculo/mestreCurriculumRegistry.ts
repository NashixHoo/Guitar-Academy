// =========================================================================
// GUITAR ACADEMY — MASTER CORE V1.0 (MASTER CURRICULUM 300)
// REGISTRO MESTRE UNIFICADO DOS CINCO INSTRUMENTOS OFICIAIS (300 AULAS)
// =========================================================================

import { 
  AcademicInstrument, 
  AcademicInstrumentId,
  AcademicLevelDefinition, 
  AcademicLevelNumber,
  AcademicCourse,
  AcademicLessonSummary,
  CurriculumModuleDefinition
} from '../core/types';

import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { VIOLAO_MODULES } from '../../data/violaoCourse';
import { SOLO_LESSONS } from '../../data/soloCourse';
import { GUITAR_EXPANDED_MODULES } from '../../data/guitarExpandedModules';

import { BAIXO_CURRICULUM_MODULES } from './baixoCurriculum';
import { TECLADO_CURRICULUM_MODULES } from './tecladoCurriculum';
import { BATERIA_CURRICULUM_MODULES } from './bateriaCurriculum';

// Exportando os módulos específicos
export { BAIXO_CURRICULUM_MODULES } from './baixoCurriculum';
export { TECLADO_CURRICULUM_MODULES } from './tecladoCurriculum';
export { BATERIA_CURRICULUM_MODULES } from './bateriaCurriculum';

// -------------------------------------------------------------------------
// 1. CINCO INSTRUMENTOS OFICIAIS DO CONSERVATÓRIO
// -------------------------------------------------------------------------
export const OFFICIAL_INSTRUMENTS: AcademicInstrument[] = [
  {
    id: 'violao',
    name: 'Violão',
    namePlural: 'Violões',
    family: 'cordas_acusticas',
    description: 'Violão acústico (nylon e aço): postura ergonômica, mapa completo do braço, acordes abertos, pestanas, dedilhados e harmonia tonal.',
    tuningStandard: 'E2-A2-D3-G3-B3-E4 (Standard)',
    stringsCount: 6,
    status: 'active',
    icon: 'guitar'
  },
  {
    id: 'guitarra',
    name: 'Guitarra',
    namePlural: 'Guitarras',
    family: 'cordas_eletricas',
    description: 'Guitarra elétrica: fundamentos, técnica mecânica com metrônomo, palhetada alternada, ligados, escalas pentatônicas, sistema CAGED, harmonia avançada e solos expressivos.',
    tuningStandard: 'E2-A2-D3-G3-B3-E4 (Standard / Drop D / 1/2 Step Down)',
    stringsCount: 6,
    status: 'active',
    icon: 'zap'
  },
  {
    id: 'baixo',
    name: 'Baixo',
    namePlural: 'Baixos',
    family: 'cordas_eletricas',
    description: 'Contrabaixo elétrico: sustentação harmônica, precisão rítmica com metrônomo, condução de tônicas, walking bass, arpejos e slap.',
    tuningStandard: 'E1-A1-D2-G2 (4 Cordas Standard)',
    stringsCount: 4,
    status: 'active',
    icon: 'disc'
  },
  {
    id: 'teclado',
    name: 'Teclado',
    namePlural: 'Teclados',
    family: 'teclas',
    description: 'Teclado e piano complementar: mapa de teclas, dedilhado funcional com duas mãos, postura de punho, condução de vozes e harmonia em blocos.',
    keysCount: 61,
    status: 'active',
    icon: 'grid'
  },
  {
    id: 'bateria',
    name: 'Bateria',
    namePlural: 'Baterias',
    family: 'percussao',
    description: 'Bateria e prática rítmica fundamental: pegada e postura, rudimentos essenciais (single, double, paradiddle), independência motora e levadas em 4/4 e 6/8.',
    status: 'active',
    icon: 'activity'
  }
];

// -------------------------------------------------------------------------
// 2. SEIS NÍVEIS ACADÊMICOS PADRONIZADOS (0 A 5)
// -------------------------------------------------------------------------
export const OFFICIAL_LEVELS: AcademicLevelDefinition[] = [
  {
    level: 0,
    code: 'LVL-0',
    name: 'Nível 0 — Fundamentos',
    subtitle: 'Absoluto Zero, anatomia, afinação e coordenação básica',
    badge: 'Fundamentos',
    description: 'Iniciação irrestrita: alfabetização musical, afinação padrão com referência sonora, afinação por ouvido/autocorrelação, postura sem tensões e primeiras pulsações no metrônomo.',
    prerequisitesDescription: 'Nenhum pré-requisito técnico prévio. Apenas o instrumento físico.',
    graduationRequirement: 'Compreensão de notas naturais, afinação autônoma e execução de exercício motor a 60 BPM.'
  },
  {
    level: 1,
    code: 'LVL-1',
    name: 'Nível 1 — Iniciação',
    subtitle: 'Primeiros acordes fundamentais, notas na primeira posição e leitura elementar',
    badge: 'Iniciação',
    description: 'Desenvolvimento das digitações primárias: acordes abertos com cordas soltas, mudanças no compasso, leitura de cifras e tablaturas simples, e precisão na palhetada alternada ou dedilhado.',
    prerequisitesDescription: 'Conclusão validada do Nível 0 ou proficiência comprovada em afinação e notas naturais.',
    graduationRequirement: 'Troca de acordes sem interrupção de pulso no metrônomo a 70 BPM e quiz teórico satisfatório.'
  },
  {
    level: 2,
    code: 'LVL-2',
    name: 'Nível 2 — Desenvolvimento Básico',
    subtitle: 'Pestanas, escala pentatônica menor e subdivisões rítmicas',
    badge: 'Desenvolvimento',
    description: 'Mecânica aplicada: pestana (Fá Maior e Si Menor), independência dos dedos 3 e 4, padrões rítmicos de colcheias e semicolcheias, e digitação do padrão 1 da escala pentatônica.',
    prerequisitesDescription: 'Domínio dos acordes abertos do Nível 1 e controle de metrônomo.',
    graduationRequirement: 'Execução de progressão com pestana com som limpo de todas as cordas a 75 BPM.'
  },
  {
    level: 3,
    code: 'LVL-3',
    name: 'Nível 3 — Intermediário',
    subtitle: 'Campo harmônico maior, sistema CAGED, ligados e fraseado melódico',
    badge: 'Intermediário',
    description: 'Estruturação musical madura: análise de graus (I, IV, V, vi), mapeamento completo dos 5 formatos do CAGED no braço, técnicas expressivas de hammer-on, pull-off e slide.',
    prerequisitesDescription: 'Aprovação no Nível 2 e domínio técnico de pestanas.',
    graduationRequirement: 'Aplicação do sistema CAGED em 3 regiões distintas do instrumento e repertório estruturado.'
  },
  {
    level: 4,
    code: 'LVL-4',
    name: 'Nível 4 — Avançado',
    subtitle: 'Tétrades, modos gregos, modulações e palhetada alternada em velocidade',
    badge: 'Avançado',
    description: 'Profundidade harmônica e virtuosismo: acordes com sétima (maj7, 7, m7, m7b5), condução de baixos, sonoridades modais (Dórico, Frígio, Lídio, Mixolídio), e sincronismo bimanual em andamentos elevados.',
    prerequisitesDescription: 'Aprovação no Nível 3 com solidez harmônica demonstrada.',
    graduationRequirement: 'Execução limpa de exercício técnico a 110+ BPM e solo com inflexões dinâmicas.'
  },
  {
    level: 5,
    code: 'LVL-5',
    name: 'Nível 5 — Especialização e Performance',
    subtitle: 'Improvisação modal avançada, sweep picking, harmonia moderna e composição',
    badge: 'Especialização',
    description: 'Domínio artístico profissional: improvisação sobre cadências complexas, substituições harmônicas, técnicas de alta performance mecânica e expressividade de palco.',
    prerequisitesDescription: 'Aprovação integral nos Níveis 0 a 4 do conservatório.',
    graduationRequirement: 'Banca prática de performance com repertório completo e teste de improvisação orientada.'
  }
];

// -------------------------------------------------------------------------
// 3. CATÁLOGO CENTRAL DE CURSOS OFICIAIS DOS 5 INSTRUMENTOS (300 AULAS)
// -------------------------------------------------------------------------
export const OFFICIAL_COURSES: AcademicCourse[] = [
  {
    id: 'violao',
    instrumentId: 'violao',
    code: 'CURSO-VIOLAO-60',
    title: 'Domínio Total do Violão',
    subtitle: 'Formação Completa em 10 Módulos e 60 Aulas Estruturadas',
    description: 'Grade curricular completa de conservatório para violão acústico (nylon e aço), cobrindo anatomia, afinação precisa, acordes abertos, dedilhados clássicos e modernos, pestanas, campo harmônico, ritmos brasileiros e violão solo.',
    category: 'formacao_completa',
    isCanonical: true,
    totalLessons: 60,
    totalModules: 10,
    levelsCovered: [0, 1, 2, 3, 4, 5],
    estimatedHours: 40
  },
  {
    id: 'guitarra',
    instrumentId: 'guitarra',
    code: 'CURSO-GUITARRA-60',
    title: 'Conservatório Completo de Guitarra Elétrica',
    subtitle: 'Formação Acadêmica Unificada em 10 Módulos e 60 Aulas (Canônica, Solo e Expansão)',
    description: 'Formação definitiva em guitarra elétrica cobrindo desde os fundamentos físicos e técnica mecânica até solos expressivos, harmonia avançada, voicings modernos, modulações e alta performance.',
    category: 'formacao_completa',
    isCanonical: true,
    totalLessons: 60,
    totalModules: 10,
    levelsCovered: [0, 1, 2, 3, 4, 5],
    estimatedHours: 45
  },
  {
    id: 'baixo',
    instrumentId: 'baixo',
    code: 'CURSO-BAIXO-60',
    title: 'Formação Completa em Contrabaixo Elétrico',
    subtitle: 'Matriz Acadêmica de Sustentação, Groove, Walking Bass e Slap em 10 Módulos (60 Aulas)',
    description: 'Formação de contrabaixo de conservatório cobrindo anatomia, afinação, técnica de pizzicato alternado, walking bass, slap & pop, métricas ímpares, harmonia moderna e performance profissional.',
    category: 'formacao_completa',
    isCanonical: true,
    totalLessons: 60,
    totalModules: 10,
    levelsCovered: [0, 1, 2, 3, 4, 5],
    estimatedHours: 40
  },
  {
    id: 'teclado',
    instrumentId: 'teclado',
    code: 'CURSO-TECLADO-60',
    title: 'Formação Completa em Teclado e Piano Complementar',
    subtitle: 'Matriz Acadêmica de Geografia, Harmonia Funcional, Voicings e Improvisação (60 Aulas)',
    description: 'Formação essencial de conservatório para teclas: geografia e dedilhado canônico, tríades, inversões, tétrades, voicings avançados, gospel chops, rearmonização e arranjos solo completos.',
    category: 'formacao_completa',
    isCanonical: true,
    totalLessons: 60,
    totalModules: 10,
    levelsCovered: [0, 1, 2, 3, 4, 5],
    estimatedHours: 40
  },
  {
    id: 'bateria',
    instrumentId: 'bateria',
    code: 'CURSO-BATERIA-60',
    title: 'Formação Completa em Bateria e Prática Rítmica',
    subtitle: 'Matriz Acadêmica de Postura, Rudimentos, Independência e Performance em 10 Módulos (60 Aulas)',
    description: 'Formação percussiva estruturada: anatomia do kit, fulcro, rudimentos essenciais, levadas de rock, funk, jazz, ritmos latinos, compassos ímpares e solos temáticos.',
    category: 'formacao_completa',
    isCanonical: true,
    totalLessons: 60,
    totalModules: 10,
    levelsCovered: [0, 1, 2, 3, 4, 5],
    estimatedHours: 40
  }
];

// -------------------------------------------------------------------------
// 4. CONVERSÃO DOS MÓDULOS DE VIOLÃO
// -------------------------------------------------------------------------
export const VIOLAO_CURRICULUM_MODULES: CurriculumModuleDefinition[] = VIOLAO_MODULES.map(m => ({
  id: m.id,
  nome: m.title,
  instrumentId: 'violao',
  nivel: (m.lessons[0]?.level || 0) as AcademicLevelNumber,
  moduloNumero: m.moduleNumber,
  objetivoAcademico: m.description,
  competenciasDesenvolvidas: [],
  preRequisitos: [],
  conteudos: [],
  exerciciosPraticos: [],
  criteriosDominio: [],
  formaAvaliacao: '',
  aulas: m.lessons.map((l, idx) => ({
    id: l.id,
    numero: idx + 1,
    titulo: l.title,
    subtitulo: l.subtitle,
    objetivo: l.objective,
    duracaoMinutos: l.estimatedMinutes
  }))
}));

// -------------------------------------------------------------------------
// 5. CONSTRUÇÃO UNIFICADA DOS 10 MÓDULOS DE GUITARRA (60 AULAS)
// -------------------------------------------------------------------------
export function getGuitarCurriculumModules(): CurriculumModuleDefinition[] {
  const canonicLessons = CURRICULUM_LEVELS.flatMap(lvl => lvl.lessons);
  const soloLessons = SOLO_LESSONS;

  const mod1Aulas = canonicLessons.slice(0, 6).map((l, idx) => ({ id: l.id, numero: idx + 1, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }));
  const mod2Aulas = canonicLessons.slice(6, 12).map((l, idx) => ({ id: l.id, numero: idx + 1, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }));
  const mod3Aulas = canonicLessons.slice(12, 18).map((l, idx) => ({ id: l.id, numero: idx + 1, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }));

  const mod4Aulas = soloLessons.slice(0, 6).map((l, idx) => ({ id: l.id, numero: idx + 1, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }));
  const mod5Aulas = soloLessons.slice(6, 12).map((l, idx) => ({ id: l.id, numero: idx + 1, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }));
  const mod6Aulas = soloLessons.slice(12, 18).map((l, idx) => ({ id: l.id, numero: idx + 1, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }));

  const mod7Aulas = [
    { id: soloLessons[18].id, numero: 1, titulo: soloLessons[18].title, subtitulo: soloLessons[18].subtitle, objetivo: soloLessons[18].objective, duracaoMinutos: soloLessons[18].estimatedMinutes },
    { id: soloLessons[19].id, numero: 2, titulo: soloLessons[19].title, subtitulo: soloLessons[19].subtitle, objetivo: soloLessons[19].objective, duracaoMinutos: soloLessons[19].estimatedMinutes },
    ...GUITAR_EXPANDED_MODULES[0].lessons.slice(2).map((l, idx) => ({ id: l.id, numero: idx + 3, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }))
  ];

  const mod8Aulas = GUITAR_EXPANDED_MODULES[1].lessons.map((l, idx) => ({ id: l.id, numero: idx + 1, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }));
  const mod9Aulas = GUITAR_EXPANDED_MODULES[2].lessons.map((l, idx) => ({ id: l.id, numero: idx + 1, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }));
  const mod10Aulas = GUITAR_EXPANDED_MODULES[3].lessons.map((l, idx) => ({ id: l.id, numero: idx + 1, titulo: l.title, subtitulo: l.subtitle, objetivo: l.objective, duracaoMinutos: l.estimatedMinutes }));

  return [
    { id: 'guitar-mod-1', nome: 'Módulo 1 — Fundamentos e Notação na Guitarra', instrumentId: 'guitarra', nivel: 0, moduloNumero: 1, objetivoAcademico: 'Dominar afinação, anatomia e primeiras notas.', competenciasDesenvolvidas: ['Afinação', 'Notas naturais'], preRequisitos: ['Nenhum'], conteudos: ['Afinação e anatomia'], exerciciosPraticos: [], criteriosDominio: ['Precisão'], formaAvaliacao: 'Prática', aulas: mod1Aulas },
    { id: 'guitar-mod-2', nome: 'Módulo 2 — Mecânica com Metrônomo e Ritmo', instrumentId: 'guitarra', nivel: 1, moduloNumero: 2, objetivoAcademico: 'Desenvolver palhetada e subdivisão.', competenciasDesenvolvidas: ['Palhetada'], preRequisitos: ['Mod 1'], conteudos: ['Colcheias'], exerciciosPraticos: [], criteriosDominio: ['Velocidade'], formaAvaliacao: 'Prática', aulas: mod2Aulas },
    { id: 'guitar-mod-3', nome: 'Módulo 3 — Harmonia Tonal Básica e Tríades', instrumentId: 'guitarra', nivel: 2, moduloNumero: 3, objetivoAcademico: 'Formar tríades no braço.', competenciasDesenvolvidas: ['Tríades'], preRequisitos: ['Mod 2'], conteudos: ['Tríades'], exerciciosPraticos: [], criteriosDominio: ['Harmonia'], formaAvaliacao: 'Prática', aulas: mod3Aulas },
    { id: 'guitar-mod-4', nome: 'Módulo 4 — Mecânica Solo e Palhetada Alternada', instrumentId: 'guitarra', nivel: 2, moduloNumero: 4, objetivoAcademico: 'Desenvolver palhetada estrita.', competenciasDesenvolvidas: ['Palhetada alternada'], preRequisitos: ['Mod 3'], conteudos: ['Mecânica solo'], exerciciosPraticos: [], criteriosDominio: ['Sincronismo'], formaAvaliacao: 'Prática', aulas: mod4Aulas },
    { id: 'guitar-mod-5', nome: 'Módulo 5 — Legato, Semicolcheias e Velocidade', instrumentId: 'guitarra', nivel: 3, moduloNumero: 5, objetivoAcademico: 'Dominar hammer-on e pull-off.', competenciasDesenvolvidas: ['Legato'], preRequisitos: ['Mod 4'], conteudos: ['Ligados'], exerciciosPraticos: [], criteriosDominio: ['Fluidez'], formaAvaliacao: 'Prática', aulas: mod5Aulas },
    { id: 'guitar-mod-6', nome: 'Módulo 6 — Pentatônicas e Fraseado Expressivo', instrumentId: 'guitarra', nivel: 3, moduloNumero: 6, objetivoAcademico: 'Dominar o sistema CAGED e pentatônicas.', competenciasDesenvolvidas: ['CAGED'], preRequisitos: ['Mod 5'], conteudos: ['Pentatônica'], exerciciosPraticos: [], criteriosDominio: ['Improvisação'], formaAvaliacao: 'Prática', aulas: mod6Aulas },
    { id: 'guitar-mod-7', nome: 'Módulo 7 — Harmonia Avançada e Voicings Modernos', instrumentId: 'guitarra', nivel: 4, moduloNumero: 7, objetivoAcademico: 'Acordes com sétima e extensões.', competenciasDesenvolvidas: ['Voicings'], preRequisitos: ['Mod 6'], conteudos: ['Extensões'], exerciciosPraticos: [], criteriosDominio: ['Harmonia'], formaAvaliacao: 'Prática', aulas: mod7Aulas },
    { id: 'guitar-mod-8', nome: 'Módulo 8 — Condução de Vozes e Rearmonização', instrumentId: 'guitarra', nivel: 4, moduloNumero: 8, objetivoAcademico: 'Voice leading e substituições.', competenciasDesenvolvidas: ['Voice leading'], preRequisitos: ['Mod 7'], conteudos: ['Rearmonização'], exerciciosPraticos: [], criteriosDominio: ['Condução'], formaAvaliacao: 'Prática', aulas: mod8Aulas },
    { id: 'guitar-mod-9', nome: 'Módulo 9 — Improvisação Modal e Sweep Picking', instrumentId: 'guitarra', nivel: 5, moduloNumero: 9, objetivoAcademico: 'Modos avançados e varredura.', competenciasDesenvolvidas: ['Sweep picking'], preRequisitos: ['Mod 8'], conteudos: ['Modos menores'], exerciciosPraticos: [], criteriosDominio: ['Virtuosismo'], formaAvaliacao: 'Prática', aulas: mod9Aulas },
    { id: 'guitar-mod-10', nome: 'Módulo 10 — Especialização e Recital Final', instrumentId: 'guitarra', nivel: 5, moduloNumero: 10, objetivoAcademico: 'Arranjo solo e performance.', competenciasDesenvolvidas: ['Performance'], preRequisitos: ['Mod 9'], conteudos: ['Recital'], exerciciosPraticos: [], criteriosDominio: ['Maestria'], formaAvaliacao: 'Prática', aulas: mod10Aulas }
  ];
}

// -------------------------------------------------------------------------
// 6. ACESSO AOS MÓDULOS CURRICULARES POR INSTRUMENTO
// -------------------------------------------------------------------------
export function getCurriculumModulesByInstrument(instrumentId: AcademicInstrumentId): CurriculumModuleDefinition[] {
  switch (instrumentId) {
    case 'violao':
      return VIOLAO_CURRICULUM_MODULES;
    case 'guitarra':
      return getGuitarCurriculumModules();
    case 'baixo':
      return BAIXO_CURRICULUM_MODULES;
    case 'teclado':
      return TECLADO_CURRICULUM_MODULES;
    case 'bateria':
      return BATERIA_CURRICULUM_MODULES;
    default:
      return [];
  }
}

export function getAllExpandedCurriculumModules(): CurriculumModuleDefinition[] {
  return [
    ...VIOLAO_CURRICULUM_MODULES,
    ...getGuitarCurriculumModules(),
    ...BAIXO_CURRICULUM_MODULES,
    ...TECLADO_CURRICULUM_MODULES,
    ...BATERIA_CURRICULUM_MODULES
  ];
}

export function getRegisteredInstruments(): AcademicInstrument[] {
  return OFFICIAL_INSTRUMENTS;
}

export function getInstrumentById(id: AcademicInstrumentId): AcademicInstrument | undefined {
  return OFFICIAL_INSTRUMENTS.find(inst => inst.id === id);
}

export function getLevelDefinition(level: AcademicLevelNumber): AcademicLevelDefinition {
  const def = OFFICIAL_LEVELS.find(lvl => lvl.level === level);
  if (!def) {
    throw new Error(`Nível acadêmico inválido: ${level}`);
  }
  return def;
}

export function getOfficialCourses(): AcademicCourse[] {
  return OFFICIAL_COURSES;
}

export function getCourseById(courseId: string): AcademicCourse | undefined {
  return OFFICIAL_COURSES.find(c => c.id === courseId);
}

// -------------------------------------------------------------------------
// 7. VALIDAÇÃO DE INTEGRIDADE CURRICULAR (MASTER CURRICULUM 300)
// -------------------------------------------------------------------------
export function verifyCurriculumIntegrity(): {
  isValid: boolean;
  violaoCount: number;
  guitarraCount: number;
  canonicalCount: number;
  soloCount: number;
  baixoCount: number;
  tecladoCount: number;
  bateriaCount: number;
  totalLessons: number;
  uniqueIdsValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const violaoLessons = VIOLAO_CURRICULUM_MODULES.flatMap(m => m.aulas);
  const guitarraLessons = getGuitarCurriculumModules().flatMap(m => m.aulas);
  const canonicalLessons = CURRICULUM_LEVELS.flatMap(lvl => lvl.lessons);
  const soloLessons = SOLO_LESSONS;

  const baixoLessons = BAIXO_CURRICULUM_MODULES.flatMap(m => m.aulas);
  const tecladoLessons = TECLADO_CURRICULUM_MODULES.flatMap(m => m.aulas);
  const bateriaLessons = BATERIA_CURRICULUM_MODULES.flatMap(m => m.aulas);

  const violaoCount = violaoLessons.length;
  const guitarraCount = guitarraLessons.length;
  const canonicalCount = canonicalLessons.length;
  const soloCount = soloLessons.length;
  const baixoCount = baixoLessons.length;
  const tecladoCount = tecladoLessons.length;
  const bateriaCount = bateriaLessons.length;

  const totalLessons = violaoCount + baixoCount + tecladoCount + bateriaCount + canonicalCount + soloCount; // Note: canonical and solo are part of guitarraLessons, but let's make totalLessons calculation correct: violao + guitarra + baixo + teclado + bateria
  const exactTotal = violaoCount + guitarraCount + baixoCount + tecladoCount + bateriaCount;

  if (violaoCount !== 60) errors.push(`Violao count: expected 60, got ${violaoCount}`);
  if (guitarraCount !== 60) errors.push(`Guitar count: expected 60, got ${guitarraCount}`);
  if (canonicalCount !== 18) errors.push(`Canonical count: expected 18, got ${canonicalCount}`);
  if (soloCount !== 20) errors.push(`Solo count: expected 20, got ${soloCount}`);
  if (baixoCount !== 60) errors.push(`Bass count: expected 60, got ${baixoCount}`);
  if (tecladoCount !== 60) errors.push(`Keyboard count: expected 60, got ${tecladoCount}`);
  if (bateriaCount !== 60) errors.push(`Drums count: expected 60, got ${bateriaCount}`);

  if (VIOLAO_CURRICULUM_MODULES.length !== 10) errors.push(`Violao modules: expected 10, got ${VIOLAO_CURRICULUM_MODULES.length}`);
  if (getGuitarCurriculumModules().length !== 10) errors.push(`Guitar modules: expected 10, got ${getGuitarCurriculumModules().length}`);
  if (BAIXO_CURRICULUM_MODULES.length !== 10) errors.push(`Bass modules: expected 10, got ${BAIXO_CURRICULUM_MODULES.length}`);
  if (TECLADO_CURRICULUM_MODULES.length !== 10) errors.push(`Keyboard modules: expected 10, got ${TECLADO_CURRICULUM_MODULES.length}`);
  if (BATERIA_CURRICULUM_MODULES.length !== 10) errors.push(`Drums modules: expected 10, got ${BATERIA_CURRICULUM_MODULES.length}`);

  const allLessonIds = new Set<string>();
  let hasDuplicateId = false;

  const collectId = (id: string) => {
    if (allLessonIds.has(id)) {
      hasDuplicateId = true;
      errors.push(`Duplicate ID: ${id}`);
    } else {
      allLessonIds.add(id);
    }
  };

  violaoLessons.forEach(l => collectId(l.id));
  guitarraLessons.forEach(l => collectId(l.id));
  baixoLessons.forEach(l => collectId(l.id));
  tecladoLessons.forEach(l => collectId(l.id));
  bateriaLessons.forEach(l => collectId(l.id));

  return {
    isValid: errors.length === 0,
    violaoCount,
    guitarraCount,
    canonicalCount,
    soloCount,
    baixoCount,
    tecladoCount,
    bateriaCount,
    totalLessons: exactTotal,
    uniqueIdsValid: !hasDuplicateId,
    errors
  };
}

// -------------------------------------------------------------------------
// 8. SUMÁRIO DE AULAS POR CURSO
// -------------------------------------------------------------------------
export function getCourseLessonSummaries(courseId: string): AcademicLessonSummary[] {
  let modules: CurriculumModuleDefinition[] = [];
  let instId: AcademicInstrumentId = 'violao';

  if (courseId === 'violao') {
    modules = VIOLAO_CURRICULUM_MODULES;
    instId = 'violao';
  } else if (courseId === 'guitarra' || courseId === 'canonical' || courseId === 'solo') {
    modules = getGuitarCurriculumModules();
    instId = 'guitarra';
  } else if (courseId === 'baixo') {
    modules = BAIXO_CURRICULUM_MODULES;
    instId = 'baixo';
  } else if (courseId === 'teclado') {
    modules = TECLADO_CURRICULUM_MODULES;
    instId = 'teclado';
  } else if (courseId === 'bateria') {
    modules = BATERIA_CURRICULUM_MODULES;
    instId = 'bateria';
  }

  return modules.flatMap(m =>
    m.aulas.map(a => ({
      id: a.id,
      courseId,
      instrumentId: instId,
      moduleNumber: m.moduloNumero,
      lessonNumber: a.numero,
      level: m.nivel,
      title: a.titulo,
      subtitle: a.subtitulo || '',
      estimatedMinutes: a.duracaoMinutos || 25,
      hasAudioDemonstration: false,
      hasQuiz: false,
      hasPracticalExercise: true
    }))
  );
}

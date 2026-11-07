// =========================================================================
// GUITAR ACADEMY — MASTER CORE V1.0
// REGISTRO MESTRE UNIFICADO DOS CINCO INSTRUMENTOS OFICIAIS
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
import { VIOLAO_MODULES, VIOLAO_LESSONS } from '../../data/violaoCourse';
import { SOLO_COURSE_STAGES, SOLO_LESSONS } from '../../data/soloCourse';

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
    description: 'Guitarra elétrica: fundamentos, técnica mecânica com metrônomo, palhetada alternada, ligados, escalas pentatônicas, sistema CAGED e solos expressivos.',
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
// 3. CATÁLOGO CENTRAL DE CURSOS OFICIAIS DOS 5 INSTRUMENTOS
// -------------------------------------------------------------------------
export const OFFICIAL_COURSES: AcademicCourse[] = [
  // 1. Violão (60 Aulas, 10 Módulos)
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
    levelsCovered: [0, 1, 2, 3, 4],
    estimatedHours: 40
  },
  // 2. Guitarra Canônica (18 Aulas, 6 Níveis)
  {
    id: 'canonical',
    instrumentId: 'guitarra',
    code: 'CURSO-GUITARRA-CANONICA-18',
    title: 'Conservatório de Guitarra — Grade Canônica',
    subtitle: 'Formação Acadêmica Sequencial em 6 Níveis (Nível 0 ao Nível 5)',
    description: 'A espinha dorsal teórica e prática da Guitarra Academy: 18 aulas completas de rigor pedagógico cobrindo afinação física, notação, técnica com metrônomo, harmonia tonal e improvisação.',
    category: 'iniciacao',
    isCanonical: true,
    totalLessons: 18,
    totalModules: 6,
    levelsCovered: [0, 1, 2, 3, 4, 5],
    estimatedHours: 18
  },
  // 3. Guitarra Solo (20 Aulas, 5 Etapas)
  {
    id: 'solo',
    instrumentId: 'guitarra',
    code: 'CURSO-GUITARRA-SOLO-20',
    title: 'Formação Progressiva em Guitarra Solo',
    subtitle: '20 Aulas Especializadas em 5 Etapas de Mecânica e Expressão',
    description: 'Formação especializada em guitarra solo focada em técnica rigorosa: palhetada alternada estrita, sincronismo motor, bends de precisão com afinação de referência, legato e fraseado pentatônico.',
    category: 'especializacao',
    isCanonical: true,
    totalLessons: 20,
    totalModules: 5,
    levelsCovered: [1, 2, 3, 4, 5],
    estimatedHours: 25
  },
  // 4. Contrabaixo Elétrico (18 Aulas, 6 Níveis)
  {
    id: 'baixo',
    instrumentId: 'baixo',
    code: 'CURSO-BAIXO-18',
    title: 'Formação em Contrabaixo Elétrico',
    subtitle: 'Matriz Acadêmica de Sustentação, Groove, Walking Bass e Slap (Níveis 0 a 5)',
    description: 'Formação de contrabaixo de conservatório cobrindo anatomia, afinação, técnica de pizzicato alternado, tríade T-5-8, síncopes, walking bass com cromatismos, técnica de slap & pop, métricas ímpares e improvisação.',
    category: 'formacao_completa',
    isCanonical: true,
    totalLessons: 18,
    totalModules: 6,
    levelsCovered: [0, 1, 2, 3, 4, 5],
    estimatedHours: 24
  },
  // 5. Teclado e Piano Complementar (18 Aulas, 6 Níveis)
  {
    id: 'teclado',
    instrumentId: 'teclado',
    code: 'CURSO-TECLADO-18',
    title: 'Formação em Teclado e Piano Complementar',
    subtitle: 'Matriz Acadêmica de Geografia, Harmonia Funcional, Voicings e Improvisação (Níveis 0 a 5)',
    description: 'Formação essencial de conservatório para teclas: geografia e dedilhado canônico, tríades e inversões com voice leading econômico, tétrades e cadências II-V-I, aberturas Drop 2 e quartais, e arranjos solo completos.',
    category: 'formacao_completa',
    isCanonical: true,
    totalLessons: 18,
    totalModules: 6,
    levelsCovered: [0, 1, 2, 3, 4, 5],
    estimatedHours: 24
  },
  // 6. Bateria e Prática Rítmica (18 Aulas, 6 Níveis)
  {
    id: 'bateria',
    instrumentId: 'bateria',
    code: 'CURSO-BATERIA-18',
    title: 'Formação em Bateria e Prática Rítmica Fundamental',
    subtitle: 'Matriz Acadêmica de Postura, Rudimentos, Independência e Performance (Níveis 0 a 5)',
    description: 'Formação percussiva estruturada: anatomia do kit, fulcro e matched grip, rudimentos essenciais (single, double, paradiddle), levadas de rock e 6/8, viradas dinâmicas, ghost notes Moeller, métricas compostas (7/8) e solos temáticos.',
    category: 'formacao_completa',
    isCanonical: true,
    totalLessons: 18,
    totalModules: 6,
    levelsCovered: [0, 1, 2, 3, 4, 5],
    estimatedHours: 24
  }
];

// -------------------------------------------------------------------------
// 4. ACESSO AOS MÓDULOS CURRICULARES POR INSTRUMENTO
// -------------------------------------------------------------------------
export function getCurriculumModulesByInstrument(instrumentId: AcademicInstrumentId): CurriculumModuleDefinition[] {
  switch (instrumentId) {
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

/**
 * Retorna todos os módulos dos 3 novos instrumentos da Matriz Central
 */
export function getAllExpandedCurriculumModules(): CurriculumModuleDefinition[] {
  return [
    ...BAIXO_CURRICULUM_MODULES,
    ...TECLADO_CURRICULUM_MODULES,
    ...BATERIA_CURRICULUM_MODULES
  ];
}

/**
 * Retorna todos os instrumentos registrados no conservatório
 */
export function getRegisteredInstruments(): AcademicInstrument[] {
  return OFFICIAL_INSTRUMENTS;
}

/**
 * Retorna os dados de um instrumento pelo ID
 */
export function getInstrumentById(id: AcademicInstrumentId): AcademicInstrument | undefined {
  return OFFICIAL_INSTRUMENTS.find(inst => inst.id === id);
}

/**
 * Retorna a definição canônica de um nível acadêmico (0 a 5)
 */
export function getLevelDefinition(level: AcademicLevelNumber): AcademicLevelDefinition {
  const def = OFFICIAL_LEVELS.find(lvl => lvl.level === level);
  if (!def) {
    throw new Error(`Nível acadêmico inválido: ${level}`);
  }
  return def;
}

/**
 * Retorna o catálogo oficial de cursos da Matriz Central
 */
export function getOfficialCourses(): AcademicCourse[] {
  return OFFICIAL_COURSES;
}

/**
 * Retorna o curso pelo identificador único ('violao' | 'canonical' | 'solo' | 'baixo' | 'teclado' | 'bateria')
 */
export function getCourseById(courseId: string): AcademicCourse | undefined {
  return OFFICIAL_COURSES.find(c => c.id === courseId);
}

/**
 * AUDITORIA E VALIDAÇÃO DE INTEGRIDADE CURRICULAR
 * Garante em tempo de execução que nenhuma das 98 aulas existentes
 * (60 Violão + 18 Guitarra Canônica + 20 Guitarra Solo) foi corrompida
 * e que os 3 novos instrumentos (Baixo: 18, Teclado: 18, Bateria: 18)
 * possuem identificadores únicos, 6 níveis e conformidade pedagógica total.
 */
export function verifyCurriculumIntegrity(): {
  isValid: boolean;
  violaoCount: number;
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

  const violaoCount = VIOLAO_LESSONS.length;
  const canonicalCount = CURRICULUM_LEVELS.reduce((acc, lvl) => acc + lvl.lessons.length, 0);
  const soloCount = SOLO_LESSONS.length;

  const baixoLessons = BAIXO_CURRICULUM_MODULES.flatMap(m => m.aulas);
  const tecladoLessons = TECLADO_CURRICULUM_MODULES.flatMap(m => m.aulas);
  const bateriaLessons = BATERIA_CURRICULUM_MODULES.flatMap(m => m.aulas);

  const baixoCount = baixoLessons.length;
  const tecladoCount = tecladoLessons.length;
  const bateriaCount = bateriaLessons.length;

  const totalLessons = violaoCount + canonicalCount + soloCount + baixoCount + tecladoCount + bateriaCount;

  // 1. Auditoria dos cursos legados (regras sagradas de preservação)
  if (violaoCount !== 60) {
    errors.push(`Inconsistência no curso de Violão: esperado 60 aulas, obtido ${violaoCount}`);
  }
  if (canonicalCount !== 18) {
    errors.push(`Inconsistência no Conservatório de Guitarra: esperado 18 aulas, obtido ${canonicalCount}`);
  }
  if (soloCount !== 20) {
    errors.push(`Inconsistência no curso de Guitarra Solo: esperado 20 aulas, obtido ${soloCount}`);
  }
  if (VIOLAO_MODULES.length !== 10) {
    errors.push(`Inconsistência nos módulos de Violão: esperado 10 módulos, obtido ${VIOLAO_MODULES.length}`);
  }
  if (CURRICULUM_LEVELS.length !== 6) {
    errors.push(`Inconsistência nos níveis canônicos: esperado 6 níveis, obtido ${CURRICULUM_LEVELS.length}`);
  }
  if (SOLO_COURSE_STAGES.length !== 5) {
    errors.push(`Inconsistência nas etapas solo: esperado 5 etapas, obtido ${SOLO_COURSE_STAGES.length}`);
  }

  // 2. Auditoria dos novos instrumentos
  if (baixoCount !== 18) {
    errors.push(`Inconsistência no curso de Baixo: esperado 18 aulas (3 por nível), obtido ${baixoCount}`);
  }
  if (tecladoCount !== 18) {
    errors.push(`Inconsistência no curso de Teclado: esperado 18 aulas (3 por nível), obtido ${tecladoCount}`);
  }
  if (bateriaCount !== 18) {
    errors.push(`Inconsistência no curso de Bateria: esperado 18 aulas (3 por nível), obtido ${bateriaCount}`);
  }
  if (BAIXO_CURRICULUM_MODULES.length !== 6) {
    errors.push(`Inconsistência nos módulos de Baixo: esperado 6 níveis, obtido ${BAIXO_CURRICULUM_MODULES.length}`);
  }
  if (TECLADO_CURRICULUM_MODULES.length !== 6) {
    errors.push(`Inconsistência nos módulos de Teclado: esperado 6 níveis, obtido ${TECLADO_CURRICULUM_MODULES.length}`);
  }
  if (BATERIA_CURRICULUM_MODULES.length !== 6) {
    errors.push(`Inconsistência nos módulos de Bateria: esperado 6 níveis, obtido ${BATERIA_CURRICULUM_MODULES.length}`);
  }

  // 3. Auditoria de unicidade de identificadores
  const allLessonIds = new Set<string>();
  let hasDuplicateId = false;

  const collectLessonId = (id: string) => {
    if (allLessonIds.has(id)) {
      hasDuplicateId = true;
      errors.push(`Identificador duplicado encontrado: ${id}`);
    } else {
      allLessonIds.add(id);
    }
  };

  VIOLAO_LESSONS.forEach(l => collectLessonId(l.id));
  CURRICULUM_LEVELS.forEach(lvl => lvl.lessons.forEach(l => collectLessonId(l.id)));
  SOLO_LESSONS.forEach(l => collectLessonId(l.id));
  baixoLessons.forEach(l => collectLessonId(l.id));
  tecladoLessons.forEach(l => collectLessonId(l.id));
  bateriaLessons.forEach(l => collectLessonId(l.id));

  return {
    isValid: errors.length === 0,
    violaoCount,
    canonicalCount,
    soloCount,
    baixoCount,
    tecladoCount,
    bateriaCount,
    totalLessons,
    uniqueIdsValid: !hasDuplicateId,
    errors
  };
}

/**
 * Retorna o sumário unificado de todas as aulas de um curso no padrão da Matriz Central
 */
export function getCourseLessonSummaries(courseId: 'violao' | 'canonical' | 'solo' | 'baixo' | 'teclado' | 'bateria'): AcademicLessonSummary[] {
  if (courseId === 'violao') {
    return VIOLAO_LESSONS.map(l => ({
      id: l.id,
      courseId: 'violao',
      instrumentId: 'violao',
      moduleNumber: l.moduleNumber,
      lessonNumber: l.lessonNumber,
      level: (l.level as AcademicLevelNumber) || 0,
      title: l.title,
      subtitle: l.subtitle,
      estimatedMinutes: l.estimatedMinutes,
      hasAudioDemonstration: Boolean(l.demonstrationAudioNotes && l.demonstrationAudioNotes.length > 0),
      hasQuiz: Boolean(l.quiz && l.quiz.questions.length > 0),
      hasPracticalExercise: Boolean(l.practicalExercise)
    }));
  }

  if (courseId === 'canonical') {
    const list: AcademicLessonSummary[] = [];
    CURRICULUM_LEVELS.forEach(lvl => {
      lvl.lessons.forEach(l => {
        list.push({
          id: l.id,
          courseId: 'canonical',
          instrumentId: 'guitarra',
          moduleNumber: l.level + 1,
          lessonNumber: l.lessonNumber,
          level: (l.level as AcademicLevelNumber) || 0,
          title: l.title,
          subtitle: l.subtitle,
          estimatedMinutes: l.estimatedMinutes,
          hasAudioDemonstration: false,
          hasQuiz: Boolean(l.quiz && l.quiz.questions.length > 0),
          hasPracticalExercise: Boolean(l.practicalExercise)
        });
      });
    });
    return list;
  }

  if (courseId === 'solo') {
    return SOLO_LESSONS.map(l => ({
      id: l.id,
      courseId: 'solo',
      instrumentId: 'guitarra',
      moduleNumber: l.stage,
      lessonNumber: l.lessonNumber,
      level: (l.level as AcademicLevelNumber) || 1,
      title: l.title,
      subtitle: l.subtitle,
      estimatedMinutes: l.estimatedMinutes,
      hasAudioDemonstration: Boolean(l.demonstrationAudioNotes && l.demonstrationAudioNotes.length > 0),
      hasQuiz: Boolean(l.quiz && l.quiz.questions.length > 0),
      hasPracticalExercise: Boolean(l.practicalExercise)
    }));
  }

  if (courseId === 'baixo') {
    return BAIXO_CURRICULUM_MODULES.flatMap(m => 
      m.aulas.map(a => ({
        id: a.id,
        courseId: 'baixo',
        instrumentId: 'baixo',
        moduleNumber: m.moduloNumero,
        lessonNumber: a.numero,
        level: m.nivel,
        title: a.titulo,
        subtitle: a.subtitulo,
        estimatedMinutes: a.duracaoMinutos,
        hasAudioDemonstration: false,
        hasQuiz: false,
        hasPracticalExercise: true
      }))
    );
  }

  if (courseId === 'teclado') {
    return TECLADO_CURRICULUM_MODULES.flatMap(m => 
      m.aulas.map(a => ({
        id: a.id,
        courseId: 'teclado',
        instrumentId: 'teclado',
        moduleNumber: m.moduloNumero,
        lessonNumber: a.numero,
        level: m.nivel,
        title: a.titulo,
        subtitle: a.subtitulo,
        estimatedMinutes: a.duracaoMinutos,
        hasAudioDemonstration: false,
        hasQuiz: false,
        hasPracticalExercise: true
      }))
    );
  }

  if (courseId === 'bateria') {
    return BATERIA_CURRICULUM_MODULES.flatMap(m => 
      m.aulas.map(a => ({
        id: a.id,
        courseId: 'bateria',
        instrumentId: 'bateria',
        moduleNumber: m.moduloNumero,
        lessonNumber: a.numero,
        level: m.nivel,
        title: a.titulo,
        subtitle: a.subtitulo,
        estimatedMinutes: a.duracaoMinutos,
        hasAudioDemonstration: false,
        hasQuiz: false,
        hasPracticalExercise: true
      }))
    );
  }

  return [];
}

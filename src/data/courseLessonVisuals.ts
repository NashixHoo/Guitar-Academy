import { Lesson } from '../types';
import { OfficialCourseId } from '../academia/progress/unlockGate';

export type CourseVisualAssetKey =
  | 'violao-postura'
  | 'violao-dedilhado'
  | 'violao-pestana'
  | 'guitarra-hss'
  | 'guitarra-palhetada'
  | 'guitarra-solo'
  | 'baixo-pizzicato'
  | 'baixo-slap'
  | 'teclado-postura'
  | 'teclado-harmonia'
  | 'bateria-kit'
  | 'bateria-pegada';

export interface CourseVisualInfo {
  assetKey: CourseVisualAssetKey;
  instrumentLabel: string;
  focusLabel: string;
  title: string;
  caption: string;
  alt: string;
}

const VIOLAO_VISUALS: Record<'postura' | 'dedilhado' | 'pestana', CourseVisualInfo> = {
  postura: {
    assetKey: 'violao-postura',
    instrumentLabel: 'Violão Acústico',
    focusLabel: 'Postura & Acordes Abertos',
    title: 'Ergonomia e Formação de Acordes no Braço',
    caption: 'Observe a curvatura natural dos dedos pressionando próximo aos trastes e o apoio relaxado do corpo do violão.',
    alt: 'Músico segurando violão clássico com mão esquerda posicionada em acorde aberto na escala',
  },
  dedilhado: {
    assetKey: 'violao-dedilhado',
    instrumentLabel: 'Violão Acústico',
    focusLabel: 'Dedilhado PIMA & Timbre',
    title: 'Articulação da Mão Direita sobre a Roseta',
    caption: 'Polegar independente nos bordões (6ª, 5ª e 4ª) e dedos i-m-a articulando arpejos limpos sobre a boca do violão.',
    alt: 'Close da mão direita executando dedilhado PIMA sobre a roseta e cordas de um violão acústico',
  },
  pestana: {
    assetKey: 'violao-pestana',
    instrumentLabel: 'Violão Acústico',
    focusLabel: 'Pestanas, CAGED & Harmonia',
    title: 'Pressão Eficiente e Mapeamento pelo Braço',
    caption: 'Apoie a lateral do dedo indicador rente ao traste para obter pestanas firmes e acordes móveis sem tensão no polegar.',
    alt: 'Execução de acorde com pestana na escala de violão acústico com enfoque na postura da mão esquerda',
  },
};

const GUITARRA_VISUALS: Record<'hss' | 'palhetada' | 'solo', CourseVisualInfo> = {
  hss: {
    assetKey: 'guitarra-hss',
    instrumentLabel: 'Guitarra Elétrica HSS',
    focusLabel: 'Anatomia, Captadores & Timbre',
    title: 'Construção, Controles e Afinação do Instrumento',
    caption: 'Identifique captadores single-coil e humbucker, ponte, seletores e resposta dinâmica junto ao amplificador.',
    alt: 'Guitarra elétrica branca com escudo tortoiseshell ao lado de amplificador valvulado de estúdio',
  },
  palhetada: {
    assetKey: 'guitarra-palhetada',
    instrumentLabel: 'Guitarra Elétrica',
    focusLabel: 'Palhetada Alternada & Mapeamento',
    title: 'Ângulo de Ataque e Navegação no Braço',
    caption: 'Empunhadura firme e relaxada com leve inclinação da palheta (45°) para precisão rítmica e passagens limpas.',
    alt: 'Mão direita segurando palheta em ângulo de ataque sobre as cordas e escala da guitarra elétrica',
  },
  solo: {
    assetKey: 'guitarra-solo',
    instrumentLabel: 'Guitarra Solo',
    focusLabel: 'Bends, Vibrato & Expressividade',
    title: 'Fraseado Melódico e Articulação Expressiva',
    caption: 'Apoie o polegar na borda superior da escala para ganhar alavanca em bends afinados, vibratos e ligados.',
    alt: 'Mão esquerda executando bend e vibrato na região aguda de uma guitarra elétrica',
  },
};

const BAIXO_VISUALS: Record<'pizzicato' | 'slap', CourseVisualInfo> = {
  pizzicato: {
    assetKey: 'baixo-pizzicato',
    instrumentLabel: 'Contrabaixo 4 Cordas',
    focusLabel: 'Pizzicato i-m & Sustentação Grave',
    title: 'Ancoragem do Polegar e Toque Apoiado',
    caption: 'Alternância rigorosa indicador-médio com apoio no captador ou na corda superior, mantendo ataque gordo e uniforme.',
    alt: 'Contrabaixista executando pizzicato com polegar ancorado no captador de um contrabaixo elétrico',
  },
  slap: {
    assetKey: 'baixo-slap',
    instrumentLabel: 'Contrabaixo 4 Cordas',
    focusLabel: 'Slap, Oitavas & Pocket Rítmico',
    title: 'Groove Percussivo e Condução no Braço',
    caption: 'Sincronize o ataque do polegar e a puxada limpa com o abafamento silencioso da mão esquerda.',
    alt: 'Contrabaixista executando groove de slap e oitavas no braço do contrabaixo elétrico',
  },
};

const TECLADO_VISUALS: Record<'postura' | 'harmonia', CourseVisualInfo> = {
  postura: {
    assetKey: 'teclado-postura',
    instrumentLabel: 'Teclado & Piano',
    focusLabel: 'Postura, Dedos 1–5 & Escalas',
    title: 'Alinhamento de Punhos e Arcos Naturais',
    caption: 'Mantenha os dedos naturalmente curvados transferindo o peso relaxado do braço para o fundo das teclas.',
    alt: 'Mãos posicionadas com dedos arqueados sobre as teclas brancas e pretas de um piano acústico',
  },
  harmonia: {
    assetKey: 'teclado-harmonia',
    instrumentLabel: 'Teclado & Piano',
    focusLabel: 'Tétrades, Voicings & Condução',
    title: 'Aberturas Harmônicas e Progressões Modernas',
    caption: 'Conecte acordes mantendo notas comuns entre as vozes para trocas suaves em Jazz, Bossa Nova e Pop.',
    alt: 'Tecladista executando voicings e tétrades em piano digital de palco com iluminação suave',
  },
};

const BATERIA_VISUALS: Record<'kit' | 'pegada', CourseVisualInfo> = {
  kit: {
    assetKey: 'bateria-kit',
    instrumentLabel: 'Bateria Acústica',
    focusLabel: 'Anatomia do Kit & Grooves',
    title: 'Topografia do Kit e Coordenação de Membros',
    caption: 'Integração entre bumbo, caixa, chimbal, tons e pratos com postura neutra de coluna e pedais em abertura natural.',
    alt: 'Kit completo de bateria acústica montado em estúdio de madeira com caixa, bumbo, tons e pratos',
  },
  pegada: {
    assetKey: 'bateria-pegada',
    instrumentLabel: 'Bateria & Rudimentos',
    focusLabel: 'Matched Grip, Fulcro & Dinâmica',
    title: 'Ponto de Fulcro e Rebote Livre na Caixa',
    caption: 'Pinça relaxada entre polegar e indicador no primeiro terço da baqueta para explorar o rebote natural da pele.',
    alt: 'Close das mãos segurando baquetas em pegada matched grip sobre pele porosa da caixa',
  },
};

/**
 * Resolves a topic-matched, non-generic visual for a specific module/level/stage in CurriculumView.
 */
export function getCourseModuleVisual(
  courseId: OfficialCourseId,
  indexOrNumber: number
): CourseVisualInfo {
  switch (courseId) {
    case 'violao': {
      if ([1, 2, 3].includes(indexOrNumber)) return VIOLAO_VISUALS.postura;
      if ([4, 5, 6, 9].includes(indexOrNumber)) return VIOLAO_VISUALS.dedilhado;
      return VIOLAO_VISUALS.pestana;
    }
    case 'canonical': {
      if (indexOrNumber <= 1) return GUITARRA_VISUALS.hss;
      if (indexOrNumber <= 3) return GUITARRA_VISUALS.palhetada;
      return GUITARRA_VISUALS.solo;
    }
    case 'solo': {
      if (indexOrNumber === 1) return GUITARRA_VISUALS.hss;
      if (indexOrNumber <= 3) return GUITARRA_VISUALS.palhetada;
      return GUITARRA_VISUALS.solo;
    }
    case 'baixo': {
      return indexOrNumber <= 2 ? BAIXO_VISUALS.pizzicato : BAIXO_VISUALS.slap;
    }
    case 'teclado': {
      return indexOrNumber <= 2 ? TECLADO_VISUALS.postura : TECLADO_VISUALS.harmonia;
    }
    case 'bateria': {
      return indexOrNumber % 2 === 0 ? BATERIA_VISUALS.kit : BATERIA_VISUALS.pegada;
    }
  }
}

/**
 * Resolves a lesson-specific visual matched to the instrument and pedagogical topic taught in the lesson.
 */
export function getLessonVisual(lesson: Lesson): CourseVisualInfo {
  const id = lesson.id.toLowerCase();
  const text = `${lesson.title} ${lesson.subtitle} ${lesson.moduleTitle} ${lesson.objective}`.toLowerCase();

  if (id.startsWith('baixo-')) {
    if (
      text.includes('slap') ||
      text.includes('walking') ||
      text.includes('ghost') ||
      text.includes('modo') ||
      text.includes('tétrade') ||
      text.includes('pocket') ||
      text.includes('polifôn') ||
      text.includes('recital')
    ) {
      return BAIXO_VISUALS.slap;
    }
    return BAIXO_VISUALS.pizzicato;
  }

  if (id.startsWith('teclado-')) {
    if (
      text.includes('invers') ||
      text.includes('tétrade') ||
      text.includes('ii - v - i') ||
      text.includes('voicing') ||
      text.includes('quart') ||
      text.includes('rearmon') ||
      text.includes('bossa') ||
      text.includes('gospel') ||
      text.includes('recital') ||
      text.includes('campo harmônico')
    ) {
      return TECLADO_VISUALS.harmonia;
    }
    return TECLADO_VISUALS.postura;
  }

  if (id.startsWith('bateria-')) {
    if (
      text.includes('grip') ||
      text.includes('fulcro') ||
      text.includes('stroke') ||
      text.includes('paradiddle') ||
      text.includes('moeller') ||
      text.includes('ghost') ||
      text.includes('rudiment')
    ) {
      return BATERIA_VISUALS.pegada;
    }
    return BATERIA_VISUALS.kit;
  }

  if (id.startsWith('violao-')) {
    if (
      text.includes('dedilhado') ||
      text.includes('arpejo') ||
      text.includes('pima') ||
      text.includes('bossa') ||
      text.includes('fingerstyle') ||
      text.includes('sétima') ||
      text.includes('tétrade') ||
      text.includes('sus')
    ) {
      return VIOLAO_VISUALS.dedilhado;
    }
    if (
      text.includes('pestana') ||
      text.includes('caged') ||
      text.includes('campo harmônico') ||
      text.includes('ritmo') ||
      text.includes('levada') ||
      text.includes('repertório') ||
      text.includes('invers')
    ) {
      return VIOLAO_VISUALS.pestana;
    }
    return VIOLAO_VISUALS.postura;
  }

  if (id.startsWith('solo-')) {
    if (
      text.includes('bend') ||
      text.includes('vibrato') ||
      text.includes('ligado') ||
      text.includes('fraseado') ||
      text.includes('improvis') ||
      text.includes('blues') ||
      text.includes('sweep') ||
      text.includes('tapping')
    ) {
      return GUITARRA_VISUALS.solo;
    }
    if (
      text.includes('anatomia') ||
      text.includes('afinação') ||
      text.includes('cordas')
    ) {
      return GUITARRA_VISUALS.hss;
    }
    return GUITARRA_VISUALS.palhetada;
  }

  // Canonical guitar curriculum (lesson-1 .. lesson-18)
  if (
    text.includes('bend') ||
    text.includes('vibrato') ||
    text.includes('solo') ||
    text.includes('improvis') ||
    text.includes('pentat') ||
    text.includes('blues')
  ) {
    return GUITARRA_VISUALS.solo;
  }
  if (
    text.includes('palhet') ||
    text.includes('1-2-3-4') ||
    text.includes('caged') ||
    text.includes('acorde') ||
    text.includes('escala') ||
    text.includes('semitom')
  ) {
    return GUITARRA_VISUALS.palhetada;
  }
  return GUITARRA_VISUALS.hss;
}

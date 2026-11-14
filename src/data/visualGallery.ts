import { OfficialCourseId } from '../academia/progress/unlockGate';

import violaoPosturaImg from '../assets/images/violao_acordes_postura_1794685194461.jpg';
import violaoDedilhadoImg from '../assets/images/violao_dedilhado_pima_1794685195462.jpg';
import violaoPestanaImg from '../assets/images/violao_pestana_harmonia_1794685196577.jpg';
import guitarraHssImg from '../assets/images/guitarra_hss_anatomia_1794685196028.jpg';
import guitarraPalhetadaImg from '../assets/images/guitarra_palhetada_caged_1794685195327.jpg';
import guitarraSoloImg from '../assets/images/guitarra_solo_bend_1794685197402.jpg';
import baixoPizzicatoImg from '../assets/images/baixo_pizzicato_groove_1794685196724.jpg';
import baixoSlapImg from '../assets/images/baixo_slap_braco_1794685197444.jpg';
import tecladoPosturaImg from '../assets/images/teclado_postura_teclas_1794685198945.jpg';
import tecladoHarmoniaImg from '../assets/images/teclado_harmonia_voicings_1794685198099.jpg';
import bateriaKitImg from '../assets/images/bateria_kit_conservatorio_1794685198573.jpg';
import bateriaPegadaImg from '../assets/images/bateria_pegada_baquetas_1794685198662.jpg';
import guitarStageCleanImg from '../assets/images/guitar_stage_clean_1792845842155.jpg';
import stageCleanBgImg from '../assets/images/stage_clean_background_1792845792748.jpg';

import conservatoryHeroImg from '../assets/images/conservatory_home_hero_1794690392992.jpg';
import didacticChordsImg from '../assets/images/didactic_chords_anatomy_1794690393531.jpg';
import didacticScalesImg from '../assets/images/didactic_scales_neck_1794690393401.jpg';
import didacticTunerImg from '../assets/images/didactic_tuner_headstock_1794690393969.jpg';

export interface VisualArtworkMeta {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  caption: string;
}

export const COURSE_TRACK_VISUALS: Record<OfficialCourseId, VisualArtworkMeta> = {
  violao: {
    src: violaoPosturaImg,
    alt: 'Músico executando acordes abertos em violão acústico clássico com postura ergonômica',
    eyebrow: 'Violão Acústico',
    title: 'Academia do Violão',
    caption: 'Ergonomia, dedilhado PIMA, pestanas limpas e arranjos solo em cordas de nylon e aço.',
  },
  canonical: {
    src: guitarraHssImg,
    alt: 'Guitarra elétrica HSS creme com escudo tortoiseshell ao lado de amplificador de estúdio',
    eyebrow: 'Guitarra Elétrica',
    title: 'Conservatório de Guitarra',
    caption: 'Base completa de postura, leitura no braço, harmonia funcional e linguagem elétrica.',
  },
  solo: {
    src: guitarraSoloImg,
    alt: 'Guitarrista aplicando técnica de bend e vibrato na região aguda da escala',
    eyebrow: 'Guitarra Solo',
    title: 'Formação em Guitarra Solo',
    caption: 'Pentatônicas, bends afinados, ligados fluidos, vibrato vocal e improvisação melódica.',
  },
  baixo: {
    src: baixoPizzicatoImg,
    alt: 'Contrabaixista tocando pizzicato com polegar ancorado no captador de contrabaixo 4 cordas',
    eyebrow: 'Contrabaixo Elétrico',
    title: 'Formação em Contrabaixo',
    caption: 'Pizzicato i-m consistente, condução de groove, oitavas e articulação de slap.',
  },
  teclado: {
    src: tecladoPosturaImg,
    alt: 'Mãos arqueadas executando notas sobre as teclas brancas e pretas de um piano de estudo',
    eyebrow: 'Teclado & Piano',
    title: 'Formação em Teclado e Piano',
    caption: 'Independência das mãos, inversões harmônicas, voicings modernos e leitura em clave.',
  },
  bateria: {
    src: bateriaKitImg,
    alt: 'Kit completo de bateria acústica de estúdio com caixa, bumbo, tons e pratos',
    eyebrow: 'Bateria & Percussão',
    title: 'Formação em Bateria',
    caption: 'Matched grip, rudimentos essenciais, independência de membros e precisão de tempo.',
  },
};

export const SCREEN_ARTWORKS = {
  homeHero: {
    src: conservatoryHeroImg,
    alt: 'Guitarra elétrica HSS creme, violão clássico de concerto, contrabaixo e metrônomo em sala de conservatório',
    eyebrow: 'Conservatório Guitar Academy',
    title: 'Estúdio e Trilha de Formação Completa',
    caption: 'Violão, Guitarra Elétrica, Guitarra Solo, Contrabaixo, Teclado e Bateria em um único ambiente de estudo.',
  },
  chords: {
    src: didacticChordsImg,
    alt: 'Close didático da mão esquerda arqueada formando acorde limpo próximo aos trastes do violão',
    eyebrow: 'Ergonomia de Acordes',
    title: 'Curvatura dos Dedos & Pressão junto ao Traste',
    caption: 'Posicione a ponta dos dedos logo atrás do traste metálico e mantenha o polegar relaxado atrás do braço para evitar cordas abafadas.',
  },
  scales: {
    src: didacticScalesImg,
    alt: 'Mão esquerda alinhada em padrão cromático na escala e mão direita atacando com palheta a 45 graus',
    eyebrow: 'Mapeamento de Escalas',
    title: 'Digitação por Quadrantes & Palhetada Alternada',
    caption: 'Distribua um dedo por casa nas passagens escalares e explore o mapa abaixo para ouvir e visualizar cada nota em tempo real.',
  },
  tuner: {
    src: didacticTunerImg,
    alt: 'Detalhe de tarraxas cromadas e cordas enroladas no headstock de um instrumento sob iluminação de estúdio',
    eyebrow: 'Referência de Afinação',
    title: 'Afinação Ascendente para Estabilidade Mecânica',
    caption: 'Se uma corda estiver aguda, solte ligeiramente abaixo da nota alvo e aperte subindo até o centro verde para travar a engrenagem da tarraxa.',
  },
  practice: {
    src: guitarStageCleanImg,
    alt: 'Guitarra elétrica preparada no palco de estúdio para sessão de prática diária estruturada',
    eyebrow: 'Central de Prática',
    title: 'Sessões Guiadas com Metrônomo Real',
    caption: 'Alterne entre aquecimento mecânico, transições de acordes e leitura com controle progressivo de andamento em BPM.',
  },
  progress: {
    src: stageCleanBgImg,
    alt: 'Ambiente de conservatório iluminado com guitarra e bateria preparados para recital de evolução',
    eyebrow: 'Diário de Evolução',
    title: 'Consistência e Maestria Acumulada',
    caption: 'Cada sessão cronometrada, repetição limpa e avaliação concluída fortalece seu domínio real nos instrumentos.',
  },
  library: {
    src: violaoPestanaImg,
    alt: 'Mão esquerda executando acorde com pestana e inversão harmônica no braço do violão',
    eyebrow: 'Repertório & Transposição',
    title: 'Análise Harmônica Aplicada às Peças',
    caption: 'Pratique progressões reais, transponha tonalidades sem perder a condução de vozes e inspecione cada acorde ampliado.',
  },
  theory: {
    src: tecladoHarmoniaImg,
    alt: 'Tecladista executando aberturas harmônicas e encadeamento de acordes em piano de estúdio',
    eyebrow: 'Harmonia & Voice Leading',
    title: 'Conexão entre Círculo de Quintas e Acordes',
    caption: 'Visualize as relações de tônica, subdominante e dominante aplicadas diretamente no braço e nas progressões acústicas.',
  },
  technique: {
    src: guitarraPalhetadaImg,
    alt: 'Close da mão direita articulando palheta inclinada a 45 graus sobre as cordas da guitarra elétrica',
    eyebrow: 'Biomecânica & Precisão',
    title: 'Economia de Movimento e Limpeza Sonora',
    caption: 'Priorize ataque relaxado, sincronia entre as duas mãos e aumento gradual de 5 em 5 BPM somente sem tensão muscular.',
  },
  reading: {
    src: tecladoPosturaImg,
    alt: 'Posição equilibrada das mãos durante leitura musical e execução em instrumento de teclas',
    eyebrow: 'Solfejo & Partitura',
    title: 'Leitura em Clave de Sol e Rítmica',
    caption: 'Associe cada linha e espaço do pentagrama diretamente à altura sonora real e às regiões correspondentes no instrumento.',
  },
  earTraining: {
    src: violaoDedilhadoImg,
    alt: 'Dedilhado PIMA sobre as cordas do violão acústico treinando escuta ativa de intervalos',
    eyebrow: 'Percepção Auditiva',
    title: 'Reconhecimento de Intervalos, Tríades e Tônica',
    caption: 'Cante internamente cada intervalo antes de responder para desenvolver memória auditiva sólida fora da tela.',
  },
  metronome: {
    src: bateriaPegadaImg,
    alt: 'Baquetas em pegada matched grip sobre pele de caixa treinando precisão rítmica e subdivisões',
    eyebrow: 'Relógio Interno',
    title: 'Pulso Estável e Subdivisões Rítmicas',
    caption: 'Utilize o Speed Trainer para consolidar passagens difíceis em andamentos lentos antes de acelerar rumo à meta.',
  },
} satisfies Record<string, VisualArtworkMeta>;

export const INSTRUMENT_THUMBNAILS_LIST: Array<{
  courseId: OfficialCourseId;
  visual: VisualArtworkMeta;
}> = [
  { courseId: 'violao', visual: COURSE_TRACK_VISUALS.violao },
  { courseId: 'canonical', visual: COURSE_TRACK_VISUALS.canonical },
  { courseId: 'solo', visual: COURSE_TRACK_VISUALS.solo },
  { courseId: 'baixo', visual: COURSE_TRACK_VISUALS.baixo },
  { courseId: 'teclado', visual: COURSE_TRACK_VISUALS.teclado },
  { courseId: 'bateria', visual: COURSE_TRACK_VISUALS.bateria },
];

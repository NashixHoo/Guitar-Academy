// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO EM BATERIA E PRÁTICA RÍTMICA
// Matriz Acadêmica de Conservatório em 6 Níveis (Nível 0 ao Nível 5)
// =========================================================================

import { CurriculumModuleDefinition } from '../core/types';

export const BATERIA_CURRICULUM_MODULES: CurriculumModuleDefinition[] = [
  // -----------------------------------------------------------------------
  // NÍVEL 0 — FUNDAMENTOS (ABSOLUTO ZERO)
  // -----------------------------------------------------------------------
  {
    id: 'bateria-mod-0',
    nome: 'Anatomia da Bateria, Pegada de Baquetas, Postura e Pulsação',
    instrumentId: 'bateria',
    nivel: 0,
    moduloNumero: 1,
    objetivoAcademico: 'Reconhecer cada peça do kit acústico ou eletrônico (bumbo, caixa, chimbal, tons, surdo, pratos), ajustar a ergonomia do banco e pedais, dominar a pegada de baquetas (matched grip), o fulcro (ponto de equilíbrio) e manter pulsação regular no metrônomo.',
    competenciasDesenvolvidas: [
      'Identificação acústica e espacial de bumbo, caixa, chimbal (hi-hat), prato de condução (ride), prato de ataque (crash) e tambores',
      'Ajuste ergonômico de banco (ângulo de 90° a 100° nos joelhos) e altura da caixa na linha da fivela da cintura',
      'Técnica do Fulcro: pinça relaxada entre polegar e indicador no ponto de rebote da baqueta',
      'Pegada Matched Grip (American Grip): dorso das mãos inclinado a ~45° e movimento de punho sem bloqueio',
      'Manutenção de pulsação firme e constante em semínimas no metrônomo a 60 BPM'
    ],
    preRequisitos: ['Nenhum conhecimento prévio. Apenas um par de baquetas (tamanho 5A recomendado) e pad de treino ou kit de bateria.'],
    conteudos: [
      'Anatomia do kit de bateria: tambores, ferragens, pratos e peles',
      'Postura ergonômica ao sentar: centro de gravidade, relaxamento de trapézios e alinhamento dos pés nos pedais',
      'Modelos de baquetas (7A, 5A, 5B) e a física do fulcro (centro de oscilação)',
      'A pegada moderna Matched Grip vs Traditional Grip',
      'Movimento primário de punho: golpe livre (free stroke) com aproveitamento do rebote natural',
      'Pulsação básica: contagem verbal (1, 2, 3, 4) sincronizada com o metrônomo'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Toque Livre com Rebote no Pad de Treino',
        bpmAlvo: 60,
        instrucoes: 'Deixe a ponta da baqueta cair e quicar livremente como uma bola de basquete, segurando suavemente pelo fulcro. Alterne mãos D e E.',
        repeticoesAlvo: 16
      },
      {
        titulo: 'Pulsação Unificada em Semínimas com Metrônomo',
        bpmAlvo: 60,
        instrucoes: 'Toque 4 semínimas com a mão direita e 4 com a esquerda de forma contínua no clique a 60 BPM com dinâmica uniforme.',
        repeticoesAlvo: 12
      }
    ],
    criteriosDominio: [
      'Manutenção do fulcro correto sem escorregar a baqueta na mão',
      'Ausência de rigidez nos ombros ou tensão nos punhos durante 3 minutos de toque contínuo',
      'Sincronismo exato com o clique do metrônomo a 60 BPM'
    ],
    formaAvaliacao: 'Avaliação prática de postura, pegada de baquetas e pulsação em semínimas.',
    aulas: [
      {
        id: 'bateria-l-0-1',
        numero: 1,
        titulo: 'Conhecendo a Bateria: Peças, Peles e Pratos',
        subtitulo: 'A função sonora de bumbo, caixa, chimbal e pratos de condução',
        objetivo: 'Identificar cada peça do kit e sua função acústica na música.',
        duracaoMinutos: 20
      },
      {
        id: 'bateria-l-0-2',
        numero: 2,
        titulo: 'Postura, Ajuste do Banco e a Pegada de Baquetas',
        subtitulo: 'Ergonomia de conservatório: o fulcro e o Matched Grip anatômico',
        objetivo: 'Segurar as baquetas com alavanca perfeita sem tensão muscular.',
        duracaoMinutos: 25
      },
      {
        id: 'bateria-l-0-3',
        numero: 3,
        titulo: 'A Primeira Pulsação: O Golpe Livre e o Metrônomo',
        subtitulo: 'Aproveitando o rebote natural da pele a 60 BPM',
        objetivo: 'Executar toques com volume constante e tempo cravado.',
        duracaoMinutos: 25
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 1 — INICIAÇÃO
  // -----------------------------------------------------------------------
  {
    id: 'bateria-mod-1',
    nome: 'Rudimentos Básicos, Single Stroke, Double Stroke, Paradiddle e Levada 4/4',
    instrumentId: 'bateria',
    nivel: 1,
    moduloNumero: 2,
    objetivoAcademico: 'Construir a base técnica dos rudimentos essenciais (toque simples, toque duplo e paradiddle), aprender a ler figuras rítmicas e montar a primeira levada básica em compasso 4/4 integrando bumbo, caixa e chimbal.',
    competenciasDesenvolvidas: [
      'Execução do Single Stroke Roll (toque simples alternado D E D E)',
      'Execução do Double Stroke Roll (toque duplo D D E E) com controle de rebote',
      'Execução do Single Paradiddle (D E D D - E D E E)',
      'Leitura de figuras rítmicas: semínimas, colcheias e pausas',
      'Coordenação da primeira levada em 4/4: chimbal em colcheias, caixa nos tempos 2 e 4, bumbo nos tempos 1 e 3'
    ],
    preRequisitos: ['Nível 0 concluído ou domínio de pegada de baquetas e pulsação regular.'],
    conteudos: [
      'Os rudimentos fundamentais do conservatório (PAS 40 Rudiments fundamentais)',
      'Single Stroke Roll: igualdade sonora absoluta entre mão dominante e mão fraca',
      'Double Stroke Roll: mecânica de empurrar e pinçar o segundo toque com os dedos',
      'Single Paradiddle: combinação de toques simples e duplos para inversão de mãos',
      'A anatomia do compasso 4/4 no kit: o "backbeat" clássico (caixa nos tempos 2 e 4)',
      'Primeira levada independente: bumbo nos tempos 1 e 3, chimbal contínuo em colcheias'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Ciclo de Rudimentos Básicos com Metrônomo',
        bpmAlvo: 70,
        instrucoes: 'Toque 2 compassos de Single Stroke, 2 de Double Stroke e 4 de Paradiddle de forma contínua a 70 BPM.',
        repeticoesAlvo: 8
      },
      {
        titulo: 'A Levada Mestra do Rock/Pop em 4/4',
        bpmAlvo: 75,
        instrucoes: 'Mão direita toca 8 colcheias no chimbal, mão esquerda toca caixa no 2 e 4, pé direito toca bumbo no 1 e 3.',
        repeticoesAlvo: 16
      }
    ],
    criteriosDominio: [
      'Igualdade tímbrica e de volume entre os toques da mão direita e esquerda',
      'Paradiddle fluido sem tropeço na mudança de mão líder',
      'Levada básica de 4/4 tocada por 2 minutos ininterruptos sem oscilação de andamento'
    ],
    formaAvaliacao: 'Banca técnica de rudimentos no pad e execução gravada da levada básica.',
    aulas: [
      {
        id: 'bateria-l-1-1',
        numero: 1,
        titulo: 'Single Stroke e Double Stroke: Toques Simples e Duplos',
        subtitulo: 'A base da velocidade e da igualdade mecânica entre as mãos',
        objetivo: 'Tocar toques simples e duplos com som uniforme e rebote limpo.',
        duracaoMinutos: 30
      },
      {
        id: 'bateria-l-1-2',
        numero: 2,
        titulo: 'O Single Paradiddle e Sua Aplicação no Kit',
        subtitulo: 'D-E-D-D e E-D-E-E: o rudimento mais versátil da percussão',
        objetivo: 'Dominar o paradiddle e distribuí-lo entre caixa e chimbal.',
        duracaoMinutos: 30
      },
      {
        id: 'bateria-l-1-3',
        numero: 3,
        titulo: 'A Levada Fundamental: Bumbo no 1 e 3, Caixa no 2 e 4',
        subtitulo: 'Sua primeira música completa na bateria com condução firme',
        objetivo: 'Coordenar bumbo, caixa e chimbal em compasso quaternário.',
        duracaoMinutos: 35
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 2 — DESENVOLVIMENTO
  // -----------------------------------------------------------------------
  {
    id: 'bateria-mod-2',
    nome: 'Coordenação Mãos e Pés, Levadas em 4/4 e 6/8, Subdivisões e Viradas',
    instrumentId: 'bateria',
    nivel: 2,
    moduloNumero: 3,
    objetivoAcademico: 'Consolidar a coordenação dos 4 membros: variações de bumbo sincopado em 4/4, introdução ao compasso composto 6/8 (blues/balada), subdivisão em semicolcheias, viradas básicas em volta dos tambores (fills) e controle dinâmico.',
    competenciasDesenvolvidas: [
      'Variações de bumbo sincopado (bumbo no contratempo do 1 e 3)',
      'Execução de levadas em compasso 6/8 (subdivisão ternária)',
      'Construção de viradas básicas (fills) de 1 compasso em semicolcheias',
      'Transição suave entre levada no chimbal e virada nos tambores sem queda de tempo',
      'Controle dinâmico: tocar suave (piano) e forte (forte) mantendo o andamento'
    ],
    preRequisitos: ['Nível 1 concluído, levada básica 4/4 e paradiddle consolidados.'],
    conteudos: [
      'Independência linear do pé direito em relação ao chimbal e caixa',
      'Variações clássicas de bumbo no rock e pop (bumbo no "1 e", bumbo duplo)',
      'O universo do compasso composto: a pulsação em 6/8 e subdivisão em tercinas',
      'Viradas de bateria: orquestração de semicolcheias da caixa para tons 1, 2 e surdo',
      'O prato de ataque (crash): acentuação no tempo 1 pós-virada em sincronia com o bumbo',
      'Dinâmica de conservatório: como a pressão do toque altera a energia sem mudar o BPM'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Levada com Bumbo Duplo e Sincopado',
        bpmAlvo: 80,
        instrucoes: 'Toque chimbal em colcheias, caixa no 2 e 4, e bumbo no 1, no "e do 2" e no 3.',
        repeticoesAlvo: 12
      },
      {
        titulo: 'Ciclo 3 Compassos de Groove + 1 Compasso de Virada',
        bpmAlvo: 85,
        instrucoes: 'Toque 3 compassos da levada de rock e 1 compasso de virada (4 semicolcheias na caixa, 4 no tom 1, 4 no tom 2, 4 no surdo) finalizando com crash no tempo 1.',
        repeticoesAlvo: 6
      }
    ],
    criteriosDominio: [
      'Zero interrupção do andamento do chimbal durante variações de bumbo',
      'Retorno perfeito ao groove no tempo 1 após a virada com prato de ataque e bumbo simultâneos',
      'Fluência de condução em 6/8 com balanço natural'
    ],
    formaAvaliacao: 'Execução de rotina de 4 compassos de groove + virada e teste de levada em 6/8.',
    aulas: [
      {
        id: 'bateria-l-2-1',
        numero: 1,
        titulo: 'Variações de Bumbo e Síncopes no Compasso 4/4',
        subtitulo: 'Criando linhas de bumbo dialogadas com o contrabaixo',
        objetivo: 'Tocar bumbos no contratempo sem desestabilizar o chimbal.',
        duracaoMinutos: 30
      },
      {
        id: 'bateria-l-2-2',
        numero: 2,
        titulo: 'O Compasso 6/8: Levadas Ternárias, Blues e Baladas',
        subtitulo: 'A pulsação de duas semínimas pontuadas e o swing ternário',
        objetivo: 'Dominar a levada de 6/8 com dinâmica de balada.',
        duracaoMinutos: 30
      },
      {
        id: 'bateria-l-2-3',
        numero: 3,
        titulo: 'Construindo Viradas (Fills) e o Retorno com Prato de Ataque',
        subtitulo: 'Distribuindo semicolcheias entre caixa, tons e surdo',
        objetivo: 'Executar viradas sem acelerar nem atrasar a batida.',
        duracaoMinutos: 35
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 3 — INTERMEDIÁRIO
  // -----------------------------------------------------------------------
  {
    id: 'bateria-mod-3',
    nome: 'Independência dos Quatro Membros, Ghost Notes, Acentuações e Leitura Rítmica',
    instrumentId: 'bateria',
    nivel: 3,
    moduloNumero: 4,
    objetivoAcademico: 'Elevar o nível técnico através da independência dos 4 membros (pé esquerdo marcando chimbal), aplicação de Ghost Notes na caixa para grooves de Funk/Soul, controle rigoroso de acentuações e leitura avançada de partitura de bateria.',
    competenciasDesenvolvidas: [
      'Marcação constante do pé esquerdo no chimbal (marcando semínimas nos tempos 1, 2, 3, 4 ou contratempos)',
      'Técnica de Ghost Notes (notas-fantasma a 2 cm da pele) intercaladas com acentos principais (Rimshot)',
      'Sistema Moeller para acentuação fluida sem esforço muscular excessivo',
      'Aplicação prática de flans, drags e ruffs na caixa e no kit',
      'Leitura rítmica fluente de partitura específica para bateria'
    ],
    preRequisitos: ['Nível 2 concluído, controle de viradas e coordenação mãos/pés consolidada.'],
    conteudos: [
      'Independência do 4º membro: o pé esquerdo no pedal de chimbal como metrônomo interno',
      'Ghost Notes: o contraste dinâmico entre o toque suave (pianíssimo) e o Rimshot acentuado (fortíssimo)',
      'O método Moeller: chicote, toque para baixo (downstroke), toque de subida (upstroke)',
      'Rudimentos de ornamentação: Flam Accent, Flam Tap e Drag',
      'Grooves clássicos de Funk (estilo David Garibaldi e Clyde Stubblefield)',
      'Leitura de mapa de bateria em partitura: pautas de 5 linhas e convenções rítmicas'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Groove de Funk com Ghost Notes e Chimbal com Pé Esquerdo',
        bpmAlvo: 90,
        instrucoes: 'Toque condução contínua enquanto a mão esquerda executa ghost notes em todas as semicolcheias não acentuadas, com o pé esquerdo marcando semínimas.',
        repeticoesAlvo: 10
      },
      {
        titulo: 'Estudo Moeller de Acentuações em Semicolcheias',
        bpmAlvo: 95,
        instrucoes: 'Execute 4 semicolcheias por tempo acentuando apenas a 1ª, depois a 2ª, depois a 3ª e a 4ª usando a mecânica de chicote.',
        repeticoesAlvo: 8
      }
    ],
    criteriosDominio: [
      'Diferença audível e nítida de pelo menos 20 dB entre ghost notes e toques acentuados',
      'Pé esquerdo constante e firme no chimbal sem falhas durante todo o groove',
      'Leitura à primeira vista de partitura de bateria com convenções básicas'
    ],
    formaAvaliacao: 'Banca técnica de Ghost Notes e gravação de groove de funk com marcação de pé esquerdo.',
    aulas: [
      {
        id: 'bateria-l-3-1',
        numero: 1,
        titulo: 'O Pé Esquerdo no Chimbal e a Independência Total',
        subtitulo: 'Transformando seu pé esquerdo no relógio atômico da banda',
        objetivo: 'Manter o chimbal no pé marcando semínimas e contratempos.',
        duracaoMinutos: 35
      },
      {
        id: 'bateria-l-3-2',
        numero: 2,
        titulo: 'Ghost Notes e o Toque Moeller: O Segredo do Funk',
        subtitulo: 'A arte dos toques sutis e a dinâmica profissional na caixa',
        objetivo: 'Incorporar notas-fantasma que fazem o groove respirar.',
        duracaoMinutos: 40
      },
      {
        id: 'bateria-l-3-3',
        numero: 3,
        titulo: 'Rudimentos Ornamentados e Leitura Rítmica',
        subtitulo: 'Flams, drags e decifrando a partitura completa de bateria',
        objetivo: 'Ler e orquestrar partituras com ornamentações percussivas.',
        duracaoMinutos: 35
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 4 — AVANÇADO
  // -----------------------------------------------------------------------
  {
    id: 'bateria-mod-4',
    nome: 'Métricas Compostas, Polirritmia, Ostinatos e Coordenação Avançada',
    instrumentId: 'bateria',
    nivel: 4,
    moduloNumero: 5,
    objetivoAcademico: 'Navegar em métricas ímpares (5/8, 7/8, 9/8), dominar polirritmias essenciais (3:2, 4:3), manter ostinatos com os pés enquanto as mãos improvisam figuras rítmicas e construir arranjos percussivos dinâmicos para contextos profissionais.',
    competenciasDesenvolvidas: [
      'Execução e contagem interna de compassos em 5/8, 7/8 e 11/8',
      'Polirritmia 3 contra 2 e 4 contra 3 dividida entre mãos e pés',
      'Ostinatos com os pés (ex: bumbo e chimbal mantendo padrão constante de samba ou baiao)',
      'Independência linear avançada: nenhum membro toca junto com outro ao mesmo tempo',
      'Construção de arranjos com modulação métrica'
    ],
    preRequisitos: ['Nível 3 concluído, domínio de ghost notes, Moeller e leitura rítmica.'],
    conteudos: [
      'Métricas ímpares: subdivisões 2+3 e 3+2 em 5/8; 2+2+3, 3+2+2 e 2+3+2 em 7/8',
      'A física das polirritmias: pontos de encontro e subdivisões matemáticas',
      'Ostinatos rítmicos: o conceito latino/brasileiro de manter a base com os pés',
      'Técnica Linear (Linear Drumming): frases rítmicas articuladas sem sobreposição sonora',
      'Modulação métrica: transição orgânica entre andamentos através de equivalência rítmica',
      'Dinâmica orquestral: crescendo, decrescendo e texturas com vassourinhas (brushes)'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Groove Linear em 7/8 Subdividido 2+2+3',
        bpmAlvo: 105,
        instrucoes: 'Execute condução no prato ride com bumbo e caixa em padrão linear no compasso 7/8 sem repetição de toques simultâneos.',
        repeticoesAlvo: 10
      },
      {
        titulo: 'Ostinato de Pés com Solos de Mãos em 4:3',
        bpmAlvo: 85,
        instrucoes: 'Pés mantêm ostinato contínuo enquanto as mãos executam paradiddles em polirritmia quaternária contra ternária.',
        repeticoesAlvo: 6
      }
    ],
    criteriosDominio: [
      'Naturalidade na condução de 7/8 sem sensação de "tropeço" no último tempo',
      'Manutenção do ostinato dos pés inalterado durante variações de dinâmica das mãos',
      'Precisão matemática e musical nas sobreposições polirrítmicas'
    ],
    formaAvaliacao: 'Gravação de estudo avançado em 7/8 e demonstração de independência com ostinato.',
    aulas: [
      {
        id: 'bateria-l-4-1',
        numero: 1,
        titulo: 'Métricas Ímpares e Compostas: 5/8, 7/8 e 9/8',
        subtitulo: 'Dominando o tempo assimétrico com contagem e balanço interno',
        objetivo: 'Tocar grooves em compassos ímpares com fluência e musicalidade.',
        duracaoMinutos: 40
      },
      {
        id: 'bateria-l-4-2',
        numero: 2,
        titulo: 'Polirritmia na Prática: 3 Contra 2 e 4 Contra 3',
        subtitulo: 'Superpondo pulsos diferentes com precisão motora',
        objetivo: 'Executar polirritmias entre mãos e pés sem perder o tempo base.',
        duracaoMinutos: 40
      },
      {
        id: 'bateria-l-4-3',
        numero: 3,
        titulo: 'Técnica Linear e Ostinatos Rítmicos',
        subtitulo: 'A independência moderna dos bateristas de estúdio',
        objetivo: 'Dominar frases lineares de alta velocidade e ostinatos de pés.',
        duracaoMinutos: 45
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 5 — ESPECIALIZAÇÃO E PERFORMANCE
  // -----------------------------------------------------------------------
  {
    id: 'bateria-mod-5',
    nome: 'Improvisação, Criação de Grooves Autorais, Estilos Musicais e Prática de Conjunto',
    instrumentId: 'bateria',
    nivel: 5,
    moduloNumero: 6,
    objetivoAcademico: 'Atingir o nível de mestre da percussão: capacidade de improvisar solos temáticos no kit, transitar com autenticidade estilística por Jazz, Bossa Nova, Samba, Afrobeat, Fusion e Metal, criar grooves autorais inesquecíveis e liderar a dinâmica de conjunto em concertos e estúdio.',
    competenciasDesenvolvidas: [
      'Construção de solos de bateria estruturados com forma (AABA, blues, tema e variações)',
      'Domínio autêntico de estilos universais: Jazz tradicional com condução de Ride e vassourinhas, Samba brasileiro no pé e caixa, e Metal/Prog com bumbo duplo',
      'Criação de assinaturas rítmicas e grooves autorais para composições',
      'Liderança da seção rítmica: comunicação não-verbal com baixista e regente',
      'Microfonação, afinação de tambores e controle acústico de estúdio',
      'Performance pública de encerramento do conservatório'
    ],
    preRequisitos: ['Nível 4 concluído, métricas ímpares e polirritmias consolidadas.'],
    conteudos: [
      'A arte do solo de bateria: não apenas velocidade, mas melodia, dinâmica e silêncio',
      'Condução de Jazz Swing: a "pluma" no bumbo (feathering) e a conversa entre caixa e chimbal',
      'A riqueza dos ritmos brasileiros na bateria: Samba, Baião, Maracatu e Frevo',
      'Técnica com vassourinhas (Brushes): varredura circular e acentos sutis na pele áspera',
      'Afinação de bateria: relação de intervalo entre pele de ataque e pele de resposta',
      'Recital de encerramento acadêmico: repertório de performance profissional'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Solo Estruturado de 32 Compassos com Desenvolvimento Temático',
        bpmAlvo: 120,
        instrucoes: 'Execute solo de bateria com introdução, desenvolvimento de motivo em rudimentos, clímax dinâmico e resolução de volta ao groove.',
        repeticoesAlvo: 4
      },
      {
        titulo: 'Samba Cruzado com Vassourinhas e Condução Brasileira',
        bpmAlvo: 100,
        instrucoes: 'Pé marca surdo no bumbo em semicolcheias sincopadas, pé esquerdo fecha chimbal no 2 e 4, e mãos executam o telecoteco no aro e vassourinha.',
        repeticoesAlvo: 6
      }
    ],
    criteriosDominio: [
      'Autenticidade e pegada estilística inquestionável em diferentes gêneros',
      'Afinação correta e equilibrada do kit para apresentação ao vivo',
      'Expressividade artística em recital solo e como líder rítmico de grupo'
    ],
    formaAvaliacao: 'Recital final prático de conservatório com solo estruturado e atuação em banda perante banca examinadora.',
    aulas: [
      {
        id: 'bateria-l-5-1',
        numero: 1,
        titulo: 'A Linguagem do Jazz e Vassourinhas: Swing e Conversa',
        subtitulo: 'A condução no prato Ride, feathering no bumbo e textura das vassouras',
        objetivo: 'Dominar o toque de Jazz tradicional com leveza e elasticidade.',
        duracaoMinutos: 45
      },
      {
        id: 'bateria-l-5-2',
        numero: 2,
        titulo: 'Polirritmia Brasileira e Afrobeat no Kit Completo',
        subtitulo: 'Samba, Baião e Maracatu orquestrados na bateria moderna',
        objetivo: 'Tocar ritmos brasileiros com balanço autêntico e independência.',
        duracaoMinutos: 45
      },
      {
        id: 'bateria-l-5-3',
        numero: 3,
        titulo: 'Solo Temático, Afinação Profissional e Concerto Final',
        subtitulo: 'A conclusão da jornada acadêmica em bateria e percussão',
        objetivo: 'Concluir a formação acadêmica em bateria com recital perante banca.',
        duracaoMinutos: 50
      }
    ]
  }
];

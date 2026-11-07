// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO EM BAIXO ELÉTRICO
// Matriz Acadêmica de Conservatório em 6 Níveis (Nível 0 ao Nível 5)
// =========================================================================

import { CurriculumModuleDefinition } from '../core/types';

export const BAIXO_CURRICULUM_MODULES: CurriculumModuleDefinition[] = [
  // -----------------------------------------------------------------------
  // NÍVEL 0 — FUNDAMENTOS (ABSOLUTO ZERO)
  // -----------------------------------------------------------------------
  {
    id: 'baixo-mod-0',
    nome: 'Fundamentos da Sustentação Grave e Anatomia do Baixo',
    instrumentId: 'baixo',
    nivel: 0,
    moduloNumero: 1,
    objetivoAcademico: 'Compreender o papel do contrabaixo elétrico na sustentação rítmico-harmônica, dominar a anatomia do instrumento de 4 cordas, postura ergonômica sem tensões, afinação padrão E-A-D-G e primeiras pulsações no metrônomo.',
    competenciasDesenvolvidas: [
      'Identificação das partes do contrabaixo (corpo, braço, captadores, ponte, tarraxas, potenciômetros)',
      'Afinação precisa nas frequências graves: E1 (~41.2 Hz), A1 (55 Hz), D2 (~73.4 Hz), G2 (~98 Hz)',
      'Postura em pé com correia e sentado com alinhamento da coluna e ângulo do braço',
      'Apoio do polegar da mão direita (ancoragem flutuante ou fixa no captador) e relaxamento do punho esquerdo',
      'Pulsação rítmica estável em semínimas no metrônomo'
    ],
    preRequisitos: ['Nenhum pré-requisito técnico prévio. Apenas o contrabaixo elétrico de 4 cordas e cabo/amplificador ou fone.'],
    conteudos: [
      'Conhecimento do instrumento e papel do baixista na banda',
      'Anatomia do baixo de quatro cordas e comprimento da escala (34 polegadas standard)',
      'Afinação E-A-D-G com metrônomo e afinador cromático para frequências subsônicas',
      'Postura corporal ergonômica e prevenção de tendinites',
      'Técnica inicial das mãos: ancoragem do polegar e mão esquerda em concha',
      'Pulsação: o pulso do metrônomo como referência inegociável'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Afinação Guiada e Ressonância das Cordas Soltas',
        bpmAlvo: 60,
        instrucoes: 'Toque cada corda solta (E, A, D, G) no 1º tempo do metrônomo a 60 BPM, mantendo o som soando por 4 tempos completos e abafando antes de atacar a próxima.',
        repeticoesAlvo: 8
      },
      {
        titulo: 'Pulsação em Semínimas com Polegar Apoiado',
        bpmAlvo: 60,
        instrucoes: 'Apoie o polegar direito no captador braço. Ataque a 4ª corda (E) 4 vezes por compasso no clique exato do metrônomo, focando em timbre homogêneo.',
        repeticoesAlvo: 12
      }
    ],
    criteriosDominio: [
      'Afinação autônoma das 4 cordas sem desvios perceptíveis',
      'Manutenção de pulsação regular sem acelerar ou atrasar durante 2 minutos contínuos a 60 BPM',
      'Postura sem elevação de ombros ou flexão excessiva do punho esquerdo'
    ],
    formaAvaliacao: 'Avaliação prática contínua de pulsação e estabilidade mecânica gravada com metrônomo.',
    aulas: [
      {
        id: 'baixo-l-0-1',
        numero: 1,
        titulo: 'Anatomia do Contrabaixo e Física das Frequências Graves',
        subtitulo: 'As partes do instrumento de 4 cordas e sua função acústica na mixagem',
        objetivo: 'Reconhecer cada componente do instrumento e entender a física das cordas pesadas.',
        duracaoMinutos: 20
      },
      {
        id: 'baixo-l-0-2',
        numero: 2,
        titulo: 'Afinação Padrão E-A-D-G e o Afinador Cromático',
        subtitulo: 'Precisão em E1, A1, D2 e G2 sem flutuações de afinação',
        objetivo: 'Afinar as 4 cordas com afinador e reconhecer a altura de referência.',
        duracaoMinutos: 15
      },
      {
        id: 'baixo-l-0-3',
        numero: 3,
        titulo: 'Ergonomia, Apoio do Polegar e Primeira Pulsação',
        subtitulo: 'Técnica de mão direita, ancoragem no captador e toque firme a 60 BPM',
        objetivo: 'Tocar semínimas nas cordas soltas com firmeza e sincronia no metrônomo.',
        duracaoMinutos: 25
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 1 — INICIAÇÃO
  // -----------------------------------------------------------------------
  {
    id: 'baixo-mod-1',
    nome: 'Pizzicato Alternado, Notas Naturais e Primeiras Linhas',
    instrumentId: 'baixo',
    nivel: 1,
    moduloNumero: 2,
    objetivoAcademico: 'Desenvolver a técnica de pizzicato com alternância estrita entre indicador e médio (i-m), mapear as notas naturais nas primeiras quatro casas e executar as primeiras linhas de condução musical.',
    competenciasDesenvolvidas: [
      'Alternância rigorosa de dedos da mão direita (indicador e médio) sem repetição de dedo (two-finger rest stroke)',
      'Técnica do toque apoiado (rest stroke): o dedo repousa na corda superior após o ataque',
      'Mapeamento das notas naturais na primeira posição (casas 1 a 5)',
      'Execução de figuras rítmicas fundamentais: semínimas, colcheias e pausas',
      'Construção e execução das primeiras linhas de baixo de acompanhamento'
    ],
    preRequisitos: ['Nível 0 concluído ou domínio de afinação e pulsação básica no metrônomo.'],
    conteudos: [
      'Técnica de pizzicato clássico: ângulo de ataque e timbre uniforme entre indicador e médio',
      'Alternância contínua dos dedos: eliminação do vício do "dedo líder"',
      'Notas naturais nas 4 cordas soltas e nas primeiras casas (E, F, G, A, B, C, D)',
      'Divisão rítmica: semínimas e colcheias no compasso 4/4',
      'Abafamento de cordas adjacentes (muting) com a palma e dedos livres',
      'Primeiras linhas de baixo com tônicas e figuras de acompanhamento'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Pizzicato Alternado Contínuo em Colcheias',
        bpmAlvo: 70,
        instrucoes: 'Execute colcheias (1 e 2 e 3 e 4 e) alternando rigorosamente indicador e médio em cada corda solta, mantendo o mesmo volume em ambos os dedos.',
        repeticoesAlvo: 16
      },
      {
        titulo: 'Condução de Linha de Baixo em Notas Naturais',
        bpmAlvo: 75,
        instrucoes: 'Execute a progressão C - G - Am - F utilizando apenas notas tônicas na primeira posição com abafamento limpo.',
        repeticoesAlvo: 8
      }
    ],
    criteriosDominio: [
      'Zero repetição involuntária de dedo da mão direita em passagens contínuas',
      'Ausência de ressonâncias de cordas soltas não tocadas (técnica de abafamento eficaz)',
      'Precisão rítmica com metrônomo a 75 BPM em colcheias constantes'
    ],
    formaAvaliacao: 'Banca técnica de alternância de dedos e gravação de linha de condução com metrônomo.',
    aulas: [
      {
        id: 'baixo-l-1-1',
        numero: 1,
        titulo: 'A Arte do Pizzicato: Indicador e Médio Alternados',
        subtitulo: 'Mecânica do toque apoiado e igualdade de dinâmica entre os dedos',
        objetivo: 'Dominar o toque apoiado e a alternância estrita i-m.',
        duracaoMinutos: 25
      },
      {
        id: 'baixo-l-1-2',
        numero: 2,
        titulo: 'Mapa das Notas Naturais nas Primeiras Casas',
        subtitulo: 'Localização imediata de Dó, Ré, Mi, Fá, Sol, Lá e Si nas 4 cordas',
        objetivo: 'Ler e tocar notas naturais até a 5ª casa com afinação exata.',
        duracaoMinutos: 25
      },
      {
        id: 'baixo-l-1-3',
        numero: 3,
        titulo: 'Primeira Linha de Baixo: Condução com Pulso e Dinâmica',
        subtitulo: 'Acompanhamento sólido sobre acordes maiores e menores',
        objetivo: 'Tocar a primeira linha musical completa em conjunto com metrônomo.',
        duracaoMinutos: 30
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 2 — DESENVOLVIMENTO
  // -----------------------------------------------------------------------
  {
    id: 'baixo-mod-2',
    nome: 'Escalas, Intervalos, Tônicas, Quintas, Oitavas e Groove',
    instrumentId: 'baixo',
    nivel: 2,
    moduloNumero: 3,
    objetivoAcademico: 'Expandir o vocabulário harmônico do baixista: construção de escalas maiores e menores, intervalos de tônica, quinta e oitava (o triângulo de ouro do baixo), aplicação de síncopes e estruturação de grooves sólidos.',
    competenciasDesenvolvidas: [
      'Digitação das escalas maiores e menores naturais em 1 e 2 oitavas',
      'Visualização geométrica dos intervalos: terças, quintas justas e oitavas no braço',
      'Condução utilizando a fórmula Tônica - Quinta - Oitava (T-5-8)',
      'Aplicação de síncopes e antecipações rítmicas com precisão no contratempo',
      'Construção de grooves consistentes conectados ao bumbo da bateria'
    ],
    preRequisitos: ['Nível 1 concluído, alternância i-m consolidada e leitura das notas nas primeiras casas.'],
    conteudos: [
      'Escalas maiores: padrão motor e distribuição de tons e semitons',
      'Escalas menores naturais: sonoridade e digitações eficientes',
      'O "Triângulo de Ouro": relação espacial entre Tônica, 5ª Justa e 8ª no braço de 4 cordas',
      'Conceito de Groove: constância, intenção e dinâmica nos tempos fortes e fracos',
      'Síncopes rítmicas: ataque no contratempo e sustentação de notas longas',
      'Acompanhamento musical de estilos populares (Rock, Pop, Reggae, Funk básico)'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Groove Tônica-Quinta-Oitava com Síncope',
        bpmAlvo: 85,
        instrucoes: 'Toque o padrão rítmico Tônica no tempo 1, Quinta no tempo 2 e Oitava no contratempo do 3 em progressão I - IV - V.',
        repeticoesAlvo: 10
      },
      {
        titulo: 'Escala Maior em Duas Oitavas com Metrônomo',
        bpmAlvo: 80,
        instrucoes: 'Execute a escala de Sol Maior iniciando na 4ª corda, casa 3, subindo e descendo em semicolcheias a 80 BPM.',
        repeticoesAlvo: 8
      }
    ],
    criteriosDominio: [
      'Fluência motora na digitação da escala maior sem hesitações de digitação',
      'Domínio imediato da localização da quinta justa e da oitava a partir de qualquer tônica',
      'Interpretação rítmica precisa de síncopes a 85 BPM com metrônomo'
    ],
    formaAvaliacao: 'Execução de groove autoral aplicando T-5-8 e teste de identificação de intervalos.',
    aulas: [
      {
        id: 'baixo-l-2-1',
        numero: 1,
        titulo: 'O Padrão da Escala Maior e Menor no Contrabaixo',
        subtitulo: 'Digitações funcionais para navegar em qualquer tonalidade',
        objetivo: 'Tocar escalas maiores e menores com digitação uniforme.',
        duracaoMinutos: 25
      },
      {
        id: 'baixo-l-2-2',
        numero: 2,
        titulo: 'O Triângulo de Ouro: Tônica, Quinta e Oitava',
        subtitulo: 'A espinha dorsal das maiores linhas de baixo da história',
        objetivo: 'Localizar instantaneamente 5ª e 8ª a partir de qualquer nota fundamental.',
        duracaoMinutos: 25
      },
      {
        id: 'baixo-l-2-3',
        numero: 3,
        titulo: 'Construindo o Groove: Síncopes e Conexão Rítmica',
        subtitulo: 'Como fazer a linha balançar mantendo o andamento cravado',
        objetivo: 'Gravar um groove sincopado com pulso impecável.',
        duracaoMinutos: 30
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 3 — INTERMEDIÁRIO
  // -----------------------------------------------------------------------
  {
    id: 'baixo-mod-3',
    nome: 'Campo Harmônico, Arpejos, Walking Bass e Ghost Notes',
    instrumentId: 'baixo',
    nivel: 3,
    moduloNumero: 4,
    objetivoAcademico: 'Aprofundar a linguagem musical através dos arpejos das tétrades do campo harmônico, domínio do walking bass tradicional no Jazz/Blues, controle de notas percussivas (ghost notes) e independência rítmica.',
    competenciasDesenvolvidas: [
      'Arpejos das tétrades fundamentais: Maj7, 7, m7 e m7b5',
      'Construção de linhas de Walking Bass em 4/4 com aproximações cromáticas e escalares',
      'Técnica de Ghost Notes (notas-fantasma percussivas abafadas) para incremento rítmico',
      'Articulação expressiva: staccato, legato e acentos dinâmicos',
      'Independência rítmica em relação à linha vocal e guitarra'
    ],
    preRequisitos: ['Nível 2 concluído, domínio do sistema T-5-8 e controle de síncopes.'],
    conteudos: [
      'Campo harmônico maior no baixo: funções harmônicas dos 7 graus',
      'Arpejos de 4 notas: estrutura intervalar e mapas bidimensionais no braço',
      'Walking Bass: conceito de notas de alvo no tempo 1 e aproximações no tempo 4',
      'Ghost notes: produção de som percussivo sem altura definida com a mão esquerda relaxada',
      'Articulações de conservatório: staccato rítmico vs tenuto expressivo',
      'Leitura de cifras harmônicas complexas com baixos invertidos (slash chords)'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Estudo de Arpejos do Campo Harmônico Maior',
        bpmAlvo: 90,
        instrucoes: 'Toque os arpejos de Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5 subindo e descendo em colcheias.',
        repeticoesAlvo: 8
      },
      {
        titulo: 'Linha de Walking Bass Tradicional em Blues de 12 Compassos',
        bpmAlvo: 100,
        instrucoes: 'Conduza um Blues em Fá tocando 4 semínimas por compasso com notas de passagem cromáticas no 4º tempo.',
        repeticoesAlvo: 6
      }
    ],
    criteriosDominio: [
      'Conexão fluida de arpejos sem pausas involuntárias entre mudanças de acordes',
      'Execução de linha de walking bass coerente mantendo a tônica sempre no primeiro tempo',
      'Ghost notes percussivas limpas sem notas espúrias soando'
    ],
    formaAvaliacao: 'Avaliação prática de condução em Walking Bass sobre standard de Jazz ou Blues.',
    aulas: [
      {
        id: 'baixo-l-3-1',
        numero: 1,
        titulo: 'Arpejos de Tétrades: Maj7, m7, 7 e m7b5',
        subtitulo: 'Mapeando os 4 tipos fundamentais de acordes no braço do baixo',
        objetivo: 'Executar arpejos de tétrades com digitação econômica.',
        duracaoMinutos: 30
      },
      {
        id: 'baixo-l-3-2',
        numero: 2,
        titulo: 'A Arte do Walking Bass: Swing, Condução e Cromatismo',
        subtitulo: 'Como construir linhas contínuas de 4 semínimas por compasso',
        objetivo: 'Criar e tocar uma linha de walking bass autônoma.',
        duracaoMinutos: 35
      },
      {
        id: 'baixo-l-3-3',
        numero: 3,
        titulo: 'Ghost Notes e Articulação Rítmica Avançada',
        subtitulo: 'O segredo do swing e do groove percussivo no baixo',
        objetivo: 'Integrar ghost notes em grooves de funk e soul com precisão.',
        duracaoMinutos: 30
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 4 — AVANÇADO
  // -----------------------------------------------------------------------
  {
    id: 'baixo-mod-4',
    nome: 'Slap, Pop, Tapping, Modos Gregorianos e Métricas Compostas',
    instrumentId: 'baixo',
    nivel: 4,
    moduloNumero: 5,
    objetivoAcademico: 'Dominar técnicas de alto impacto percussivo e mecânico: Slap (polegar percussivo) e Pop (puxada com indicador/médio), introdução ao Tapping a duas mãos, exploração dos modos gregos e controle de métricas ímpares (5/4, 7/8).',
    competenciasDesenvolvidas: [
      'Mecânica de Slap com o polegar batendo e quicando no traste (bounce stroke)',
      'Técnica de Pop (plucking) com dedos indicador e médio puxando a corda com estalo',
      'Combinação de Slap, Pop e Ghost Notes em loops percussivos contínuos',
      'Two-handed Tapping básico no contrabaixo: baixos na esquerda e arpejos na direita',
      'Sonoridades modais aplicadas ao contrabaixo (Dórico, Mixolídio, Lídio)',
      'Execução de grooves em métricas compostas (5/4, 7/8, 6/8)'
    ],
    preRequisitos: ['Nível 3 concluído, domínio de tétrades, ghost notes e solidez de tempo.'],
    conteudos: [
      'Técnica de Slap: posicionamento do polegar paralelo vs perpendicular às cordas',
      'Técnica de Pop: ângulo de entrada e liberação elástica da corda',
      'Fraseado Slap Funk: oitavas estaladas, marteladas de mão esquerda e ghost notes',
      'Introdução ao Tapping polifônico: independência de força nos dedos das duas mãos',
      'Modos gregos na prática do baixista: quando aplicar Dórico e Mixolídio no groove',
      'Métricas ímpares e compostas: subdivisão de compassos 5/8 (3+2 ou 2+3) e 7/8 (2+2+3)'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Groove de Slap Funk com Oitavas e Ghost Notes',
        bpmAlvo: 95,
        instrucoes: 'Execute a sequência Slap (polegar grave) -> Ghost Note -> Pop (oitava aguda) com metrônomo cravado.',
        repeticoesAlvo: 12
      },
      {
        titulo: 'Condução Modal Dórica em 7/8',
        bpmAlvo: 110,
        instrucoes: 'Toque um groove modal em Ré Dórico subdividido em 2+2+3 colcheias por compasso.',
        repeticoesAlvo: 8
      }
    ],
    criteriosDominio: [
      'Slap com som percussivo brilhante sem abafar a nota fundamental',
      'Pop sem ruído estridente e com recuperação motora imediata para o próximo ataque',
      'Fluência de contagem interna em compassos ímpares sem perder o primeiro tempo'
    ],
    formaAvaliacao: 'Performance gravada de estudo avançado de Slap e leitura de groove em métrica mista.',
    aulas: [
      {
        id: 'baixo-l-4-1',
        numero: 1,
        titulo: 'Slap & Pop Essencial: Mecânica, Ataque e Timbre',
        subtitulo: 'Fundamentos da percussão no contrabaixo elétrico',
        objetivo: 'Executar slap e pop com som encorpado e controle dinâmico.',
        duracaoMinutos: 35
      },
      {
        id: 'baixo-l-4-2',
        numero: 2,
        titulo: 'Modos Gregos no Baixo: Cores Harmônicas e Fraseado',
        subtitulo: 'Aplicação prática do Dórico, Frígio e Mixolídio em grooves',
        objetivo: 'Criar frases modais sofisticadas sobre vamps de um acorde.',
        duracaoMinutos: 30
      },
      {
        id: 'baixo-l-4-3',
        numero: 3,
        titulo: 'Métricas Compostas e Ímpares: 5/4, 7/8 e 6/8',
        subtitulo: 'Navegando fora do compasso quaternário comum com autoridade',
        objetivo: 'Conduzir grooves em 5/4 e 7/8 com naturalidade e balanço.',
        duracaoMinutos: 35
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 5 — ESPECIALIZAÇÃO E PERFORMANCE
  // -----------------------------------------------------------------------
  {
    id: 'baixo-mod-5',
    nome: 'Improvisação, Linhas Autorais, Harmonia Avançada e Performance',
    instrumentId: 'baixo',
    nivel: 5,
    moduloNumero: 6,
    objetivoAcademico: 'Alcançar a maturidade artística no contrabaixo: improvisação melódica fluente, composição de linhas de baixo autorais e icônicas, aplicação de acordes e harmonia avançada no instrumento, domínio de polirritmias e liderança em prática de conjunto.',
    competenciasDesenvolvidas: [
      'Construção de solos expressivos no contrabaixo com desenvolvimento temático',
      'Harmonia avançada no baixo: execução de acordes (bicordes, tríades e aberturas de décima)',
      'Polirritmia avançada (3 contra 4, 5 contra 4) e deslocamentos métricos',
      'Arranjo e composição de linhas de baixo icônicas e memoráveis',
      'Interação com bateria e instrumentos harmônicos em formato trio ou big band',
      'Preparação para palco, estúdio profissional e gravação em linha direta'
    ],
    preRequisitos: ['Nível 4 concluído, domínio de Slap, modos e leitura avançada.'],
    conteudos: [
      'Improvisação melódica no baixo: frases sobre II-V-I maior e menor',
      'Uso de acordes no contrabaixo: décimas abertas e tríades no registro médio/agudo',
      'Polirritmias aplicadas: criando tensão rítmica consciente que resolve no tempo 1',
      'Liderança na seção rítmica: dinâmica coletiva, respiração e intenção sonora',
      'Timbragem profissional: equalização pré-amplificada, compressores e pedais de saturação',
      'Performance de encerramento do conservatório: repertório de recital'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Solo Temático sobre Cadência II-V-I Maior',
        bpmAlvo: 120,
        instrucoes: 'Construa um solo melódico de 2 coros utilizando motivos rítmicos, arpejos com extensões e resolução melódica.',
        repeticoesAlvo: 4
      },
      {
        titulo: 'Acompanhamento com Acordes de Décima e Linha Polirrítmica',
        bpmAlvo: 80,
        instrucoes: 'Execute progressão com baixos e décimas na mão direita com modulação métrica 3:4.',
        repeticoesAlvo: 6
      }
    ],
    criteriosDominio: [
      'Expressividade artística autônoma e afinação impecável em todo o braço',
      'Capacidade de improvisar sem perda de forma sobre progressões harmônicas ricas',
      'Controle absoluto de dinâmica de banda e postura de músico de alta performance'
    ],
    formaAvaliacao: 'Recital final prático perante banca examinadora com execução de peça autoral e standard.',
    aulas: [
      {
        id: 'baixo-l-5-1',
        numero: 1,
        titulo: 'Harmonia no Baixo: Acordes, Décimas e Texturas Polifônicas',
        subtitulo: 'Como transformar o baixo em instrumento harmônico completo',
        objetivo: 'Tocar progressões harmônicas utilizando décimas e tríades agudas.',
        duracaoMinutos: 35
      },
      {
        id: 'baixo-l-5-2',
        numero: 2,
        titulo: 'Improvisação Melódica e Construção de Solos no Baixo',
        subtitulo: 'Linguagem, dinâmicas, cromatismos e expressão lírica no registro grave',
        objetivo: 'Improvisar com coerência temática e técnica fluida.',
        duracaoMinutos: 40
      },
      {
        id: 'baixo-l-5-3',
        numero: 3,
        titulo: 'Performance Profissional e Prática de Conjunto',
        subtitulo: 'A liderança da seção rítmica, presença de palco e timbragem de estúdio',
        objetivo: 'Concluir a formação acadêmica em contrabaixo com recital prático.',
        duracaoMinutos: 45
      }
    ]
  }
];

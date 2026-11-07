// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO EM TECLADO E PIANO COMPLEMENTAR
// Matriz Acadêmica de Conservatório em 6 Níveis (Nível 0 ao Nível 5)
// =========================================================================

import { CurriculumModuleDefinition } from '../core/types';

export const TECLADO_CURRICULUM_MODULES: CurriculumModuleDefinition[] = [
  // -----------------------------------------------------------------------
  // NÍVEL 0 — FUNDAMENTOS (ABSOLUTO ZERO)
  // -----------------------------------------------------------------------
  {
    id: 'teclado-mod-0',
    nome: 'Geografia das Teclas, Postura e Coordenação Inicial',
    instrumentId: 'teclado',
    nivel: 0,
    moduloNumero: 1,
    objetivoAcademico: 'Compreender a disposição visual do teclado (grupos de 2 e 3 teclas pretas), mapear todas as notas naturais e acidentes, adotar postura anatômica de punho e dedos redondos, memorizar a numeração dos dedos (1 a 5) e executar as primeiras pulsações com metrônomo.',
    competenciasDesenvolvidas: [
      'Reconhecimento visual imediato das teclas a partir dos grupos de 2 e 3 teclas pretas',
      'Localização do Dó Central (C4) e mapeamento das 7 notas naturais (Dó a Si)',
      'Postura correta: altura do banco, alinhamento dos antebraços e dedos curvados ("mão segurando uma maçã")',
      'Numeração universal dos dedos: 1 (polegar) a 5 (mínimo) em ambas as mãos',
      'Pulsação rítmica inicial com metrônomo a 60 BPM'
    ],
    preRequisitos: ['Nenhum conhecimento prévio. Apenas teclado musical (61 ou 88 teclas) com sensibilidade ao toque.'],
    conteudos: [
      'Geografia das teclas: grupos de 2 e 3 teclas pretas como mapa de navegação',
      'Notas musicais brancas (naturais) e pretas (sustenidos e bemóis)',
      'Postura ergonômica: peso do braço sobre os dedos sem tensões musculares',
      'Numeração dos dedos da mão direita e esquerda (1, 2, 3, 4, 5)',
      'Coordenação motora inicial: toque relaxado sem pressionar com força excessiva',
      'Ritmo básico: semínimas e semibreves no metrônomo'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Mapeamento do Dó Central e Notas Vizinhas',
        bpmAlvo: 60,
        instrucoes: 'Toque com a mão direita as notas C - D - E - F - G usando dedos 1-2-3-4-5 em semínimas a 60 BPM, mantendo o punho solto.',
        repeticoesAlvo: 8
      },
      {
        titulo: 'Espelhamento com a Mão Esquerda',
        bpmAlvo: 60,
        instrucoes: 'Toque com a mão esquerda as notas C - B - A - G - F usando dedos 1-2-3-4-5 em semínimas mantendo curva natural dos dedos.',
        repeticoesAlvo: 8
      }
    ],
    criteriosDominio: [
      'Localização do Dó Central e de qualquer nota solicitada em menos de 2 segundos',
      'Postura de punho sem cair abaixo da linha do teclado nem rigidez nos ombros',
      'Precisão rítmica com metrônomo a 60 BPM sem tropeços motores'
    ],
    formaAvaliacao: 'Avaliação prática de postura, identificação de teclas e pulsação no metrônomo.',
    aulas: [
      {
        id: 'teclado-l-0-1',
        numero: 1,
        titulo: 'A Geografia do Teclado: Grupos de 2 e 3 Teclas Pretas',
        subtitulo: 'Como se orientar instantaneamente em qualquer oitava do instrumento',
        objetivo: 'Identificar Dó, Fá e todas as notas naturais com referência visual.',
        duracaoMinutos: 20
      },
      {
        id: 'teclado-l-0-2',
        numero: 2,
        titulo: 'Postura, Peso do Braço e Numeração dos Dedos',
        subtitulo: 'Ergonomia de conservatório: dedos 1 a 5 e punho elástico',
        objetivo: 'Posicionar mãos e punhos com técnica relaxada e anatômica.',
        duracaoMinutos: 20
      },
      {
        id: 'teclado-l-0-3',
        numero: 3,
        titulo: 'Primeira Coordenação e Pulsação com Metrônomo',
        subtitulo: 'Exercício de cinco dedos independentes a 60 BPM',
        objetivo: 'Tocar notas consecutivas com articulação uniforme no tempo.',
        duracaoMinutos: 25
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 1 — INICIAÇÃO
  // -----------------------------------------------------------------------
  {
    id: 'teclado-mod-1',
    nome: 'Escalas Maiores, Dedilhado, Tríades e Primeiros Acompanhamentos',
    instrumentId: 'teclado',
    nivel: 1,
    moduloNumero: 2,
    objetivoAcademico: 'Desenvolver a técnica de passagem do polegar na escala de Dó Maior, coordenar exercícios com ambas as mãos, compreender os intervalos musicais, construir tríades maiores e menores e executar os primeiros acompanhamentos harmônicos.',
    competenciasDesenvolvidas: [
      'Execução da escala de Dó Maior com dedilhado canônico (1-2-3-passagem do polegar-1-2-3-4-5)',
      'Exercícios de coordenação bimanual simples (mão esquerda no baixo e direita na melodia)',
      'Compreensão dos intervalos de terça maior, terça menor e quinta justa',
      'Formação de tríades fundamentais: Dó Maior, Sol Maior, Fá Maior e Lá Menor',
      'Acompanhamento básico em blocos com mudança no 1º tempo de cada compasso'
    ],
    preRequisitos: ['Nível 0 concluído ou domínio da geografia das teclas e postura de dedos.'],
    conteudos: [
      'Escalas maiores: a passagem do polegar (thumb-under) sem rotação abrupta do cotovelo',
      'Dedilhado canônico da escala de C maior para mão direita e mão esquerda',
      'Exercícios elementares de duas mãos em movimento paralelo e contrário',
      'Intervalos no teclado: semitom diatônico, tom inteiro, terça e quinta',
      'Formação de tríades: estado fundamental com dedos 1-3-5',
      'Primeiros acompanhamentos: baixo simples na mão esquerda e tríade na direita'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Escala de Dó Maior com Passagem de Polegar',
        bpmAlvo: 70,
        instrucoes: 'Execute a escala de C maior em uma oitava subindo e descendo com dedilhado 1-2-3-1-2-3-4-5 e 5-4-3-2-1-3-2-1.',
        repeticoesAlvo: 10
      },
      {
        titulo: 'Progressão I - IV - V - vi em Tríades Fundamentais',
        bpmAlvo: 65,
        instrucoes: 'Toque C - F - G - Am com a mão direita em semibreves enquanto a mão esquerda toca a tônica em oitava.',
        repeticoesAlvo: 8
      }
    ],
    criteriosDominio: [
      'Passagem de polegar suave sem sotaque de volume na nota seguinte',
      'Formação precisa de tríades sem notas intermediárias tocadas involuntariamente',
      'Mudança fluente de acordes no primeiro tempo do metrônomo a 65 BPM'
    ],
    formaAvaliacao: 'Execução da escala de C maior e acompanhamento gravado de progressão harmônica.',
    aulas: [
      {
        id: 'teclado-l-1-1',
        numero: 1,
        titulo: 'A Escala de Dó Maior e a Passagem do Polegar',
        subtitulo: 'A mecânica do thumb-under para tocar melodias contínuas',
        objetivo: 'Dominar a técnica da passagem de polegar sem tropeços.',
        duracaoMinutos: 25
      },
      {
        id: 'teclado-l-1-2',
        numero: 2,
        titulo: 'Intervalos e Formação das Primeiras Tríades',
        subtitulo: 'Terças maiores, menores e a estrutura dos acordes de C, G, F e Am',
        objetivo: 'Montar acordes perfeitos com dedos 1-3-5 em qualquer tecla fundamental.',
        duracaoMinutos: 30
      },
      {
        id: 'teclado-l-1-3',
        numero: 3,
        titulo: 'Primeiro Acompanhamento Bimanual',
        subtitulo: 'Mão esquerda no baixo + mão direita nos acordes em 4/4',
        objetivo: 'Coordenar as duas mãos tocando uma música completa.',
        duracaoMinutos: 30
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 2 — DESENVOLVIMENTO
  // -----------------------------------------------------------------------
  {
    id: 'teclado-mod-2',
    nome: 'Inversões de Acordes, Escalas Menores e Independência das Mãos',
    instrumentId: 'teclado',
    nivel: 2,
    moduloNumero: 3,
    objetivoAcademico: 'Dominar as inversões de tríades (estado fundamental, 1ª e 2ª inversão) para condução suave de acordes com economia de movimento, aprender as escalas menores relativas, campo harmônico maior e desenvolver independência rítmica entre mãos.',
    competenciasDesenvolvidas: [
      'Inversões de acordes: 1ª inversão (baixo na terça, dedos 1-2-5) e 2ª inversão (baixo na quinta, dedos 1-3-5)',
      'Condução de acordes com movimento mínimo (Voice Leading elementar)',
      'Escalas menores naturais e harmônicas (Lá menor e Ré menor)',
      'Compreensão do campo harmônico maior completo (graus I a vii°)',
      'Independência rítmica: mão esquerda marcando colcheias enquanto direita sustenta acordes'
    ],
    preRequisitos: ['Nível 1 concluído, escala de Dó Maior memorizada e tríades em estado fundamental.'],
    conteudos: [
      'O princípio das inversões de tríades: como mudar de acorde movendo os dedos o mínimo possível',
      'Dedilhados específicos para 1ª inversão (1-2-5 na direita) e 2ª inversão (1-3-5 na direita)',
      'Escala menor natural e a nota sensível na escala menor harmônica',
      'O campo harmônico de C Maior: C, Dm, Em, F, G, Am, Bdim',
      'Acompanhamentos rítmicos: arpejos de mão esquerda (padrão Alberti e padrão balada 1-5-8)',
      'Exercícios de independência bimanual com subdivisões contrastantes'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Ciclo de Inversões da Tríade de Dó Maior',
        bpmAlvo: 75,
        instrucoes: 'Toque C fundamental -> C 1ª inversão -> C 2ª inversão subindo e descendo com dedos corretos.',
        repeticoesAlvo: 12
      },
      {
        titulo: 'Progressão I - vi - IV - V com Voice Leading Otimizado',
        bpmAlvo: 80,
        instrucoes: 'Toque C (fundamental) -> Am (1ª inv) -> F (2ª inv) -> G (fundamental) mantendo notas comuns paradas.',
        repeticoesAlvo: 8
      }
    ],
    criteriosDominio: [
      'Conexão de acordes sem saltos bruscos da mão pelo teclado',
      'Execução independente da mão esquerda mantendo o andamento enquanto a direita varia ritmicamente',
      'Domínio dos graus do campo harmônico maior sem hesitação'
    ],
    formaAvaliacao: 'Execução de estudo de inversões e acompanhamento de balada com padrão 1-5-8.',
    aulas: [
      {
        id: 'teclado-l-2-1',
        numero: 1,
        titulo: 'Inversões de Acordes: Economia de Movimento no Teclado',
        subtitulo: 'Como tocar progressões inteiras sem tirar a mão do mesmo lugar',
        objetivo: 'Dominar 1ª e 2ª inversões com dedilhados anatômicos.',
        duracaoMinutos: 30
      },
      {
        id: 'teclado-l-2-2',
        numero: 2,
        titulo: 'Escalas Menores e o Campo Harmônico Maior',
        subtitulo: 'Os 7 acordes da tonalidade maior e as escalas de Am e Dm',
        objetivo: 'Identificar as funções tônica, subdominante e dominante no teclado.',
        duracaoMinutos: 30
      },
      {
        id: 'teclado-l-2-3',
        numero: 3,
        titulo: 'Independência Bimanual: O Padrão Balada 1-5-8',
        subtitulo: 'Arpejando o baixo na esquerda enquanto a direita expressa harmonia',
        objetivo: 'Coordenar ritmos diferentes entre mão esquerda e direita.',
        duracaoMinutos: 35
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 3 — INTERMEDIÁRIO
  // -----------------------------------------------------------------------
  {
    id: 'teclado-mod-3',
    nome: 'Tétrades, Dominantes, Cadências, Condução de Vozes e Arpejos',
    instrumentId: 'teclado',
    nivel: 3,
    moduloNumero: 4,
    objetivoAcademico: 'Expandir a harmonia para acordes de 4 notas (tétrades), dominar a tensão e resolução dos acordes dominantes (V7 -> I), aplicar cadências clássicas (II-V-I), conduzir vozes com elegância e ler partitura/cifra intermediária.',
    competenciasDesenvolvidas: [
      'Construção e inversão de tétrades: Maj7, m7, 7 e m7b5',
      'Resolução da sensível e do trítono no acorde dominante para a tônica',
      'Execução da cadência II-V-I maior e menor com voicings funcionais',
      'Condução de vozes (Voice Leading): notas de guia (terças e sétimas)',
      'Arpejos fluidos com as duas mãos cruzando o teclado'
    ],
    preRequisitos: ['Nível 2 concluído, inversões de tríades assimiladas e independência motora.'],
    conteudos: [
      'Tétrades fundamentais no teclado: adicionando a 7ª maior e menor',
      'O acorde dominante e o trítono: tensão máxima e resolução na tônica',
      'A cadência mestra da música ocidental: Dm7 - G7 - Cmaj7 (II-V-I)',
      'Voicings sem fundamental (Rootless): a mão esquerda toca o baixo e a direita as notas de guia (3 e 7)',
      'Arpejos estendidos: cruzamento de mãos no teclado em 2 oitavas',
      'Leitura musical funcional de partitura e cifras complexas'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Cadência II-V-I com Voicings A e B',
        bpmAlvo: 85,
        instrucoes: 'Toque Dm7 -> G7 -> Cmaj7 utilizando notas de guia 3ª e 7ª na mão direita e baixos na mão esquerda.',
        repeticoesAlvo: 10
      },
      {
        titulo: 'Arpejo Cruzado de Tétrades em Duas Oitavas',
        bpmAlvo: 90,
        instrucoes: 'Execute arpejo ascendente de Cmaj7 iniciando na esquerda e completando com cruzamento da direita.',
        repeticoesAlvo: 8
      }
    ],
    criteriosDominio: [
      'Resolução imediata do trítono nas notas de guia (3ª e 7ª descendo e subindo)',
      'Clareza na transição entre acordes sem notas emboladas ou sustentadas por pedal excessivo',
      'Fluência de arpejos sem interrupção de pulso a 90 BPM'
    ],
    formaAvaliacao: 'Banca de execução da cadência II-V-I em 3 tonalidades diferentes e arpejos de tétrades.',
    aulas: [
      {
        id: 'teclado-l-3-1',
        numero: 1,
        titulo: 'Tétrades no Teclado: Maj7, m7, 7 e m7b5',
        subtitulo: 'A sonoridade encorpada dos acordes de quatro notas',
        objetivo: 'Montar e inverter tétrades com dedilhados corretos.',
        duracaoMinutos: 35
      },
      {
        id: 'teclado-l-3-2',
        numero: 2,
        titulo: 'A Cadência II-V-I e as Notas de Guia (3ª e 7ª)',
        subtitulo: 'O segredo da harmonia do Jazz, Bossa Nova e Pop sofisticado',
        objetivo: 'Conduzir a cadência II-V-I com voicings econômicos e profissionais.',
        duracaoMinutos: 35
      },
      {
        id: 'teclado-l-3-3',
        numero: 3,
        titulo: 'Arpejos Estendidos e Cruzamento de Mãos',
        subtitulo: 'Percorrendo a extensão do piano com técnica elegante',
        objetivo: 'Executar arpejos de duas oitavas com cruzamento fluido de mãos.',
        duracaoMinutos: 30
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 4 — AVANÇADO
  // -----------------------------------------------------------------------
  {
    id: 'teclado-mod-4',
    nome: 'Tensões Harmônicas, Voicings Abertos, Rearmonização e Modos',
    instrumentId: 'teclado',
    nivel: 4,
    moduloNumero: 5,
    objetivoAcademico: 'Dominar extensões e tensões disponíveis (9, 11, 13), aberturas avançadas (Drop 2, Quartais, Bill Evans voicings), técnicas de rearmonização com acordes de empréstimo modal e dominantes secundários, modos e introdução à improvisação melódica no piano.',
    competenciasDesenvolvidas: [
      'Aplicação de extensões harmônicas: 9ª maior, 11ª aumentada (#11) e 13ª maior',
      'Harmonia quartal (acordes construídos por intervalos de quarta)',
      'Técnica Drop 2 para arranjo e acompanhamento de melodias',
      'Rearmonização: dominantes secundários, substituição trítono (SubV7) e empréstimo modal',
      'Improvisação modal sobre escalas Dórica, Lídia e Mixolídia no teclado'
    ],
    preRequisitos: ['Nível 3 concluído, domínio de tétrades, cadências II-V-I e notas de guia.'],
    conteudos: [
      'Tensões disponíveis nos acordes maiores, menores e dominantes: evitando notas a evitar (avoid notes)',
      'Voicings abertos: distribuição de vozes entre as duas mãos no teclado',
      'Voicings quartais (estilo McCoy Tyner e Herbie Hancock): modernidade e abertura acústica',
      'Rearmonização de melodias simples: substituindo acordes diatônicos por variantes ricas',
      'Escalas modais no teclado: dedilhados para solar com a mão direita mantendo harmonia na esquerda',
      'Pedal de sustentação (Sustain): técnica de troca sincopada sem deixar o som turvo'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Voicings com 9ª e 13ª na Cadência II-V-I',
        bpmAlvo: 90,
        instrucoes: 'Execute Dm9 -> G13 -> Cmaj9 com voicings rootless na mão direita e baixos na esquerda.',
        repeticoesAlvo: 10
      },
      {
        titulo: 'Rearmonização de Melodia com Dominantes Secundários e SubV7',
        bpmAlvo: 80,
        instrucoes: 'Toque arranjo rearmonizado inserindo A7(b13) antes de Dm7 e Db7(9) antes de Cmaj7.',
        repeticoesAlvo: 6
      }
    ],
    criteriosDominio: [
      'Uso impecável do pedal de sustain sem embolamento harmônico',
      'Identificação instantânea de tensões válidas para cada função harmônica',
      'Fraseado melódico sobre escalas modais com articulação legato e staccato consciente'
    ],
    formaAvaliacao: 'Gravação de arranjo com voicings abertos e improvisação modal de 2 coros.',
    aulas: [
      {
        id: 'teclado-l-4-1',
        numero: 1,
        titulo: 'Tensões Harmônicas no Teclado: 9ª, 11ª e 13ª',
        subtitulo: 'Colorindo a harmonia com extensões sem conflito de frequências',
        objetivo: 'Aplicar 9ª, 11ª e 13ª em acordes maiores, menores e dominantes.',
        duracaoMinutos: 35
      },
      {
        id: 'teclado-l-4-2',
        numero: 2,
        titulo: 'Voicings Quartais e Aberturas Drop 2',
        subtitulo: 'A sonoridade moderna dos mestres do piano jazz e gospel',
        objetivo: 'Construir aberturas elegantes distribuídas entre as duas mãos.',
        duracaoMinutos: 40
      },
      {
        id: 'teclado-l-4-3',
        numero: 3,
        titulo: 'Rearmonização Prática e Improvisação Modal',
        subtitulo: 'Transformando progressões comuns em arranjos extraordinários',
        objetivo: 'Rearmonizar uma música popular e improvisar frases modais fluidas.',
        duracaoMinutos: 40
      }
    ]
  },

  // -----------------------------------------------------------------------
  // NÍVEL 5 — ESPECIALIZAÇÃO E PERFORMANCE
  // -----------------------------------------------------------------------
  {
    id: 'teclado-mod-5',
    nome: 'Harmonia Avançada, Arranjos Completos, Improvisação e Performance',
    instrumentId: 'teclado',
    nivel: 5,
    moduloNumero: 6,
    objetivoAcademico: 'Consolidação artística do pianista/tecladista: harmonia cromática avançada (acordes diminutos de passagem, dominantes alterados), arranjos polifônicos completos solo (piano solo), improvisação sofisticada, acompanhamento profissional de cantores e bandas, e performance de concerto.',
    competenciasDesenvolvidas: [
      'Escala alterada e dominação de tensões alteradas (b9, #9, b5, #5)',
      'Arranjos completos de piano solo: linha melódica, baixo e preenchimento harmônico simultâneos',
      'Improvisação fluente com linguagem bop, blues e lírica em andamentos médios e rápidos',
      'Acompanhamento profissional: adequação de registro para não conflitar com voz, guitarra ou baixo',
      'Uso de sintetizadores, timbres elétricos (Rhodes/Wurlitzer, pads, leads) e controladores MIDI',
      'Performance pública de encerramento do conservatório'
    ],
    preRequisitos: ['Nível 4 concluído, voicings abertos assimilados e improvisação modal intermediária.'],
    conteudos: [
      'A escala alterada (7º modo da menor melódica) e acordes 7(alt)',
      'Acordes diminutos: função dominante vs função de passagem auxiliar',
      'Construção de arranjos de Piano Solo: a melodia no topo com dedos 4 e 5 da mão direita',
      'Acompanhamento dinâmico: quando tocar menos (o valor das pausas e texturas sutis)',
      'Teclados modernos e sintetizadores: filtros (Cutoff/Resonance), camadas (layers) e splits',
      'Performance de encerramento de conservatório e repertório acadêmico'
    ],
    exerciciosPraticos: [
      {
        titulo: 'Piano Solo Completo com Melodia e Harmonia Integradas',
        bpmAlvo: 75,
        instrucoes: 'Execute arranjo solo de standard em que a mão direita toca a melodia em relevo dinâmico com dedos 4 e 5 e a harmonia com dedos 1, 2 e 3.',
        repeticoesAlvo: 4
      },
      {
        titulo: 'Improvisação sobre Acordes Alterados',
        bpmAlvo: 110,
        instrucoes: 'Improvise linhas melódicas conectando G7(alt) para Cmaj7 utilizando arpejos e escala alterada.',
        repeticoesAlvo: 6
      }
    ],
    criteriosDominio: [
      'Independência polifônica onde a melodia é ouvida com clareza acima do acompanhamento',
      'Domínio da escala alterada em qualquer tonalidade sem erros de notas de repouso',
      'Maturidade musical demonstrada em performance completa de conservatório'
    ],
    formaAvaliacao: 'Recital prático final perante banca com execução de peça solo e acompanhamento.',
    aulas: [
      {
        id: 'teclado-l-5-1',
        numero: 1,
        titulo: 'Dominantes Alterados e a Escala Superlócria',
        subtitulo: 'A sofisticação máxima da tensão harmônica no teclado',
        objetivo: 'Dominar o acorde 7(alt) e suas resoluções melódicas.',
        duracaoMinutos: 40
      },
      {
        id: 'teclado-l-5-2',
        numero: 2,
        titulo: 'A Arte do Piano Solo: Melodia, Harmonia e Baixo',
        subtitulo: 'Como soar como uma orquestra inteira com as próprias mãos',
        objetivo: 'Construir e interpretar um arranjo solo completo.',
        duracaoMinutos: 45
      },
      {
        id: 'teclado-l-5-3',
        numero: 3,
        titulo: 'Performance de Concerto e Prática de Conjunto',
        subtitulo: 'Teclados eletrônicos, síntese, presença de palco e recital final',
        objetivo: 'Concluir a formação acadêmica em teclado com performance de gala.',
        duracaoMinutos: 50
      }
    ]
  }
];

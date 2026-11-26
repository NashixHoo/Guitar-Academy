// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO COMPLETA EM CONTRABAIXO ELÉTRICO (60 AULAS)
// Matriz Acadêmica de Conservatório em 10 Módulos (6 aulas por módulo)
// Preservação integral dos 18 IDs históricos (baixo-l-0-1 até baixo-l-5-3)
// =========================================================================

import { CurriculumModuleDefinition } from '../core/types';

export const BAIXO_CURRICULUM_MODULES: CurriculumModuleDefinition[] = [
  {
    id: 'baixo-mod-0',
    nome: 'Fundamentos da Sustentação Grave e Anatomia do Baixo',
    instrumentId: 'baixo',
    nivel: 0,
    moduloNumero: 1,
    objetivoAcademico: 'Compreender o papel do contrabaixo elétrico na sustentação rítmico-harmônica, dominar a anatomia do instrumento de 4 cordas, postura ergonômica, afinação padrão E-A-D-G e primeiras pulsações.',
    competenciasDesenvolvidas: ['Anatomia do instrumento', 'Afinação E1-A1-D2-G2', 'Postura e ergonomia', 'Ancoragem do polegar'],
    preRequisitos: ['Contrabaixo elétrico de 4 cordas e amplificador/fone.'],
    conteudos: ['Anatomia física', 'Afinação cromática', 'Ergonomia postural', 'Pulsação rítmica básica', 'Técnica inicial de dedos', 'O papel do groove'],
    exerciciosPraticos: [{ titulo: 'Afinação das 4 cordas soltas', bpmAlvo: 60, instrucoes: 'Ataque limpo por corda', repeticoesAlvo: 8 }],
    criteriosDominio: ['Afinação autônoma e pulsação estável a 60 BPM por 2 minutos.'],
    formaAvaliacao: 'Avaliação prática contínua de estabilidade rítmica.',
    aulas: [
      { id: 'baixo-l-0-1', numero: 1, titulo: 'Anatomia do Contrabaixo e Física das Frequências Graves', subtitulo: 'As partes do instrumento', objetivo: 'Reconhecer componentes', duracaoMinutos: 20 },
      { id: 'baixo-l-0-2', numero: 2, titulo: 'Afinação Padrão E-A-D-G e o Afinador Cromático', subtitulo: 'Precisão em E1, A1, D2 e G2', objetivo: 'Afinar com precisão', duracaoMinutos: 15 },
      { id: 'baixo-l-0-3', numero: 3, titulo: 'Ergonomia, Apoio do Polegar e Primeira Pulsação', subtitulo: 'Postura e toque a 60 BPM', objetivo: 'Tocar semínimas firmes', duracaoMinutos: 25 },
      { id: 'baixo-mod1-l4', numero: 4, titulo: 'Aula 4 — Dinâmica de Toque e Homogeneidade Timbrística', subtitulo: 'Igualdade entre polegar e indicador/médio', objetivo: 'Homogeneizar o timbre', duracaoMinutos: 25 },
      { id: 'baixo-mod1-l5', numero: 5, titulo: 'Aula 5 — Consciência Corporal e Prevenção de Lesões', subtitulo: 'Alinhamento de punho e braço', objetivo: 'Evitar tensores musculares', duracaoMinutos: 20 },
      { id: 'baixo-mod1-l6', numero: 6, titulo: 'Aula 6 — Introdução ao Metrônomo como Parceiro Rítmico', subtitulo: 'O clique nos tempos 1, 2, 3 e 4', objetivo: 'Internalizar o pulso rígido', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'baixo-mod-1',
    nome: 'Pizzicato Alternado, Notas Naturais e Primeiras Linhas',
    instrumentId: 'baixo',
    nivel: 1,
    moduloNumero: 2,
    objetivoAcademico: 'Desenvolver pizzicato i-m, notas naturais nas 4 primeiras casas e primeiras linhas.',
    competenciasDesenvolvidas: ['Alternância i-m', 'Toque apoiado', 'Notas naturais na 1ª posição'],
    preRequisitos: ['Módulo 1 concluído.'],
    conteudos: ['Pizzicato i-m', 'Notas naturais E, F, G, A, B, C, D', 'Semínimas e colcheias', 'Abafamento'],
    exerciciosPraticos: [{ titulo: 'Pizzicato contínuo em colcheias', bpmAlvo: 70, instrucoes: 'Alternância estrita', repeticoesAlvo: 16 }],
    criteriosDominio: ['Zero repetição involuntária de dedo a 70 BPM.'],
    formaAvaliacao: 'Banca técnica de alternância.',
    aulas: [
      { id: 'baixo-l-1-1', numero: 1, titulo: 'A Arte do Pizzicato: Indicador e Médio Alternados', subtitulo: 'Mecânica do toque apoiado', objetivo: 'Dominar alternância i-m', duracaoMinutos: 25 },
      { id: 'baixo-l-1-2', numero: 2, titulo: 'Mapa das Notas Naturais nas Primeiras Casas', subtitulo: 'Localização de Dó a Si', objetivo: 'Ler e tocar notas naturais', duracaoMinutos: 25 },
      { id: 'baixo-l-1-3', numero: 3, titulo: 'Primeira Linha de Baixo: Condução com Pulso e Dinâmica', subtitulo: 'Acompanhamento em acordes', objetivo: 'Executar linhas simples', duracaoMinutos: 25 },
      { id: 'baixo-mod2-l4', numero: 4, titulo: 'Aula 4 — Divisão Rítmica com Colcheias e Pausas', subtitulo: 'Groove rítmico básico', objetivo: 'Trabalhar síncopes simples', duracaoMinutos: 25 },
      { id: 'baixo-mod2-l5', numero: 5, titulo: 'Aula 5 — O Poder do Silêncio: Abafamento com a Mão Esquerda', subtitulo: 'Staccato no baixo', objetivo: 'Controlar o sustain', duracaoMinutos: 25 },
      { id: 'baixo-mod2-l6', numero: 6, titulo: 'Aula 6 — Linha de Baixo sobre Blues Básico em Lá', subtitulo: 'Aplicação prática em 12 compassos', objetivo: 'Tocar primeiro blues', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'baixo-mod-2',
    nome: 'Tríades, Escalas Maiores e Oitavas',
    instrumentId: 'baixo',
    nivel: 2,
    moduloNumero: 3,
    objetivoAcademico: 'Dominar tríades fundamentais, escala maior na 1ª posição e oitavas.',
    competenciasDesenvolvidas: ['Tríades T-3-5', 'Escala diatônica maior', 'Saltos de oitava'],
    preRequisitos: ['Módulo 2 concluído.'],
    conteudos: ['Tríades maiores e menores', 'Escala maior', 'Oitavas na horizontal', 'Groove em colcheias swung'],
    exerciciosPraticos: [{ titulo: 'Arpejos de tríade T-3-5-8', bpmAlvo: 75, instrucoes: 'Precisão rítmica', repeticoesAlvo: 12 }],
    criteriosDominio: ['Execução limpa de tríades a 75 BPM.'],
    formaAvaliacao: 'Teste de arpejos.',
    aulas: [
      { id: 'baixo-l-2-1', numero: 1, titulo: 'Tríades Maiores e Menores na Raiz do Baixo', subtitulo: 'Construção T-3-5', objetivo: 'Formar tríades fundamentais', duracaoMinutos: 25 },
      { id: 'baixo-l-2-2', numero: 2, titulo: 'Escala Maior Diatônica: O DNA da Música', subtitulo: 'Padrão digital na 1ª posição', objetivo: 'Tocar escala maior', duracaoMinutos: 30 },
      { id: 'baixo-l-2-3', numero: 3, titulo: 'Saltos de Oitava e Dinâmica de Acompanhamento', subtitulo: 'Oitavas oitavadas no groove', objetivo: 'Dominar saltos de corda', duracaoMinutos: 25 },
      { id: 'baixo-mod3-l4', numero: 4, titulo: 'Aula 4 — O Pattern T-5-8 no Rock e Pop', subtitulo: 'A base do baixo elétrico moderno', objetivo: 'Criar groove com oitavas', duracaoMinutos: 25 },
      { id: 'baixo-mod3-l5', numero: 5, titulo: 'Aula 5 — Introdução aos Três Sustenidos e Bemóis', subtitulo: 'Acidentes musicais no braço', objetivo: 'Navegar por acidentes', duracaoMinutos: 25 },
      { id: 'baixo-mod3-l6', numero: 6, titulo: 'Aula 6 — Groove de Acompanhamento em Compassos 4/4', subtitulo: 'Consolidação do Nível 2', objetivo: 'Acompanhar música completa', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'baixo-mod-3',
    nome: 'Técnica de Mutex, Semicolcheias e Pentatônicas',
    instrumentId: 'baixo',
    nivel: 3,
    moduloNumero: 4,
    objetivoAcademico: 'Desenvolver semicolcheias, escala pentatônica e abafamento avançado.',
    competenciasDesenvolvidas: ['Semicolcheias', 'Pentatônica menor', 'Muteds'],
    preRequisitos: ['Módulo 3 concluído.'],
    conteudos: ['Subdivisão em semicolcheias', 'Pentatônica menor', 'Ghost notes iniciais', 'Fingerstyle avançado'],
    exerciciosPraticos: [{ titulo: 'Semicolcheias com metrônomo', bpmAlvo: 65, instrucoes: '4 notas por pulso', repeticoesAlvo: 16 }],
    criteriosDominio: ['Semicolcheias uniformes a 70 BPM.'],
    formaAvaliacao: 'Gravação de groove funk simples.',
    aulas: [
      { id: 'baixo-l-3-1', numero: 1, titulo: 'Subdivisões Avançadas: O Universo das Semicolcheias', subtitulo: '4 notas por pulso', objetivo: 'Controlar semicolcheias', duracaoMinutos: 30 },
      { id: 'baixo-l-3-2', numero: 2, titulo: 'A Escala Pentatônica Menor no Baixo Elétrico', subtitulo: 'O padrão dos grandes baixistas', objetivo: 'Dominar pentatônica', duracaoMinutos: 30 },
      { id: 'baixo-l-3-3', numero: 3, titulo: 'Ghost Notes e Articulações Percussivas Básicas', subtitulo: 'O som abafado elegante', objetivo: 'Executar ghost notes', duracaoMinutos: 25 },
      { id: 'baixo-mod4-l4', numero: 4, titulo: 'Aula 4 — Síncopa e Deslocamento de Acento', subtitulo: 'O contratempo no funk e soul', objetivo: 'Desenvolver síncope', duracaoMinutos: 25 },
      { id: 'baixo-mod4-l5', numero: 5, titulo: 'Aula 5 — Conexão entre Pentatônica e Tríades', subtitulo: 'Melodia e harmonia unidas', objetivo: 'Mesclar escalas e arpejos', duracaoMinutos: 30 },
      { id: 'baixo-mod4-l6', numero: 6, titulo: 'Aula 6 — Linha de Baixo Estilo Funk/Soul Básico', subtitulo: 'Groove dançante', objetivo: 'Aplicar técnica funk', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'baixo-mod-4',
    nome: 'Walking Bass, Tétrades e Modos Gregos',
    instrumentId: 'baixo',
    nivel: 4,
    moduloNumero: 5,
    objetivoAcademico: 'Construir walking bass, tétrades e introdução aos modos gregos.',
    competenciasDesenvolvidas: ['Walking bass', 'Tétrades (maj7, 7, m7)', 'Modos dórico e mixolídio'],
    preRequisitos: ['Módulo 4 concluído.'],
    conteudos: ['Walking bass em semínimas', 'Tétrades fundamentais', 'Cromatismos de aproximação', 'Modos gregos aplicados ao baixo'],
    exerciciosPraticos: [{ titulo: 'Walking bass sobre ii-V-I', bpmAlvo: 80, instrucoes: 'Condução cromática', repeticoesAlvo: 12 }],
    criteriosDominio: ['Walking bass fluido sobre 12 compassos de jazz/blues a 80 BPM.'],
    formaAvaliacao: 'Banca de walking bass.',
    aulas: [
      { id: 'baixo-l-4-1', numero: 1, titulo: 'Walking Bass: A Arte de Caminhar no Jazz e na Bossa', subtitulo: 'Condução em semínimas', objetivo: 'Construir walking bass', duracaoMinutos: 30 },
      { id: 'baixo-l-4-2', numero: 2, titulo: 'Tétrades e Acordes com Sétima no Contrabaixo', subtitulo: 'Maj7, m7 e 7', objetivo: 'Tocar tétrades no braço', duracaoMinutos: 30 },
      { id: 'baixo-l-4-3', numero: 3, titulo: 'Modos Gregos Aplicados ao Baixo: Dórico e Mixolídio', subtitulo: 'Cores modais', objetivo: 'Explorar sonoridade modal', duracaoMinutos: 30 },
      { id: 'baixo-mod5-l4', numero: 4, titulo: 'Aula 4 — Aproximações Cromáticas e Notas de Passagem', subtitulo: 'Conectando acordes com sofisticação', objetivo: 'Usar cromatismos', duracaoMinutos: 25 },
      { id: 'baixo-mod5-l5', numero: 5, titulo: 'Aula 5 — O Cadencial II-V-I no Contrabaixo', subtitulo: 'A espinha dorsal da harmonia moderna', objetivo: 'Conduzir o II-V-I', duracaoMinutos: 30 },
      { id: 'baixo-mod5-l6', numero: 6, titulo: 'Aula 6 — Bossa Nova e Samba no Baixo Elétrico', subtitulo: 'O contracanto brasileiro', objetivo: 'Tocar ritmos brasileiros', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'baixo-mod-5',
    nome: 'Slap & Pop, Compassos Ímpares e Virtuosismo',
    instrumentId: 'baixo',
    nivel: 5,
    moduloNumero: 6,
    objetivoAcademico: 'Dominar slap & pop, compassos ímpares e improvisação avançada.',
    competenciasDesenvolvidas: ['Slap & pop', 'Compassos 5/8 e 7/8', 'Improvisação profissional'],
    preRequisitos: ['Módulo 5 concluído.'],
    conteudos: ['Técnica de thumb slap e finger pop', 'Métricas compostas e ímpares (7/8, 5/4)', 'Solos de baixo', 'Performance de palco'],
    exerciciosPraticos: [{ titulo: 'Slap groove básico com thumb e pop', bpmAlvo: 85, instrucoes: 'Estalo limpo', repeticoesAlvo: 16 }],
    criteriosDominio: ['Execução limpa de groove em slap a 85 BPM e compasso 7/8.'],
    formaAvaliacao: 'Performance final de conservatório em baixo.',
    aulas: [
      { id: 'baixo-l-5-1', numero: 1, titulo: 'Técnica de Slap & Pop: O Polegar Percussivo', subtitulo: 'Fundamentos do slap moderno', objetivo: 'Dominar slap e pop', duracaoMinutos: 35 },
      { id: 'baixo-l-5-2', numero: 2, titulo: 'Compassos Ímpares e Métricas Complexas (7/8 e 5/4)', subtitulo: 'Pensando fora do 4/4', objetivo: 'Tocar em compassos ímpares', duracaoMinutos: 35 },
      { id: 'baixo-l-5-3', numero: 3, titulo: 'Improvisação e Solos de Baixo de Alta Performance', subtitulo: 'O baixista como solista', objetivo: 'Construir solos expressivos', duracaoMinutos: 35 },
      { id: 'baixo-mod6-l4', numero: 4, titulo: 'Aula 4 — Tapping no Baixo e Acordes de Décima', subtitulo: 'Polifonia avançada no grave', objetivo: 'Usar décimas e tapping', duracaoMinutos: 30 },
      { id: 'baixo-mod6-l5', numero: 5, titulo: 'Aula 5 — Gravadora e Estúdio: O Timbre Perfeito', subtitulo: 'DI box, compressão e equalização', objetivo: 'Conhecer acústica de estúdio', duracaoMinutos: 25 },
      { id: 'baixo-mod6-l6', numero: 6, titulo: 'Aula 6 — Recital Final de Formação em Contrabaixo', subtitulo: 'Apresentação de conservatório', objetivo: 'Concluir a formação de baixo', duracaoMinutos: 45 }
    ]
  },
  {
    id: 'baixo-mod-6',
    nome: 'Módulo 6 — Groove Avançado e R&B Contemporâneo',
    instrumentId: 'baixo',
    nivel: 4,
    moduloNumero: 7,
    objetivoAcademico: 'Desenvolver levadas de R&B, neo-soul e groove sincopado avançado.',
    competenciasDesenvolvidas: ['Groove R&B', 'Ghost notes dinâmicas', 'Interação com a bateria'],
    preRequisitos: ['Módulos 1 a 6 concluídos.'],
    conteudos: ['Grooves inspirados em James Jamerson e Pino Palladino', 'Dinâmica de toque suave', 'Subdivisões rítmicas avançadas'],
    exerciciosPraticos: [{ titulo: 'Groove R&B com ghost notes', bpmAlvo: 75, instrucoes: 'Toque abafado expressivo', repeticoesAlvo: 12 }],
    criteriosDominio: ['Fluência rítmica em R&B a 75 BPM.'],
    formaAvaliacao: 'Gravação de linha de R&B.',
    aulas: [
      { id: 'baixo-mod7-l1', numero: 1, titulo: 'Aula 37 — O DNA do R&B e Soul Music', subtitulo: 'Grooves profundos e arrastados', objetivo: 'Dominar o toque R&B', duracaoMinutos: 30 },
      { id: 'baixo-mod7-l2', numero: 2, titulo: 'Aula 38 — Ghost Notes Dinâmicas no Funk', subtitulo: 'O balanço rítmico perfeito', objetivo: 'Controlar a percussão com os dedos', duracaoMinutos: 30 },
      { id: 'baixo-mod7-l3', numero: 3, titulo: 'Aula 39 — O Estilo de James Jamerson na Motown', subtitulo: 'Melodia e ritmo no contrabaixo', objetivo: 'Estudar clássicos da Motown', duracaoMinutos: 30 },
      { id: 'baixo-mod7-l4', numero: 4, titulo: 'Aula 40 — Linhas com Síncopas Extrema', subtitulo: 'Deslocamento de acento rítmico', objetivo: 'Tocar contratempos complexos', duracaoMinutos: 30 },
      { id: 'baixo-mod7-l5', numero: 5, titulo: 'Aula 41 — Neo-Soul: Harmonia e Groove Moderno', subtitulo: 'Acordes e baixos cadenciados', objetivo: 'Executar linhas neo-soul', duracaoMinutos: 30 },
      { id: 'baixo-mod7-l6', numero: 6, titulo: 'Aula 42 — Prática de Conjunto: Baixo e Bateria', subtitulo: 'A cozinha da banda em sintonia', objetivo: 'Sincronizar com a bateria', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'baixo-mod-7',
    nome: 'Módulo 7 — Harmonia Moderna e Substituições no Baixo',
    instrumentId: 'baixo',
    nivel: 5,
    moduloNumero: 8,
    objetivoAcademico: 'Aplicar harmonia avançada, dominantes secundários e substituições no baixo.',
    competenciasDesenvolvidas: ['Dominantes secundários', 'Substituição tritônica', 'Pedal harmônico'],
    preRequisitos: ['Módulo 7 concluído.'],
    conteudos: ['Baixo sobre dominantes secundários', 'Tritônicos no contrabaixo', 'Pedal points graves'],
    exerciciosPraticos: [{ titulo: 'Walking bass com substituições', bpmAlvo: 85, instrucoes: 'Condução harmônica avançada', repeticoesAlvo: 12 }],
    criteriosDominio: ['Condução harmônica fluida com substituições a 85 BPM.'],
    formaAvaliacao: 'Banca de harmonia aplicada.',
    aulas: [
      { id: 'baixo-mod8-l1', numero: 1, titulo: 'Aula 43 — Baixo sobre Dominantes Secundários', subtitulo: 'Tonicização e condução', objetivo: 'Conectar dominantes secundários', duracaoMinutos: 30 },
      { id: 'baixo-mod8-l2', numero: 2, titulo: 'Aula 44 — Substituição Tritônica no Baixo', subtitulo: 'Linhas cromáticas eficientes', objetivo: 'Aplicar subV7 no baixo', duracaoMinutos: 30 },
      { id: 'baixo-mod8-l3', numero: 3, titulo: 'Aula 45 — Pedal Points Graves e Tensão', subtitulo: 'Sustentação estática com harmonia em movimento', objetivo: 'Criar tensão com pedal', duracaoMinutos: 30 },
      { id: 'baixo-mod8-l4', numero: 4, titulo: 'Aula 46 — Modulações e Acordes Pivô', subtitulo: 'Mudança de tom guiada pelo baixo', objetivo: 'Modular com elegância', duracaoMinutos: 30 },
      { id: 'baixo-mod8-l5', numero: 5, titulo: 'Aula 47 — Baixo em Acordes com Extensões (9, 11, 13)', subtitulo: 'Escolha da nota fundamental vs. guia', objetivo: 'Tocar sobre tétrades estendidas', duracaoMinutos: 30 },
      { id: 'baixo-mod8-l6', numero: 6, titulo: 'Aula 48 — Análise Harmônica para Baixistas', subtitulo: 'Entendendo a partitura e cifra a fundo', objetivo: 'Analisar repertório complexo', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'baixo-mod-8',
    nome: 'Módulo 8 — Técnicas Especiais e 5 Cordas',
    instrumentId: 'baixo',
    nivel: 5,
    moduloNumero: 9,
    objetivoAcademico: 'Dominar o contrabaixo de 5 cordas (Corda Si Grave / B0) e técnicas estendidas.',
    competenciasDesenvolvidas: ['Baixo de 5 cordas', 'Flamenco slap', 'Double thumb'],
    preRequisitos: ['Módulo 8 concluído.'],
    conteudos: ['Explorando a 5ª corda (Si grave)', 'Double thumb technique (Victor Wooten style)', 'Acordes e arpejos estendidos'],
    exerciciosPraticos: [{ titulo: 'Double thumb em colcheias', bpmAlvo: 90, instrucoes: 'Thumb down e thumb up', repeticoesAlvo: 16 }],
    criteriosDominio: ['Domínio da corda Si grave e double thumb a 90 BPM.'],
    formaAvaliacao: 'Apresentação de técnica estendida.',
    aulas: [
      { id: 'baixo-mod9-l1', numero: 1, titulo: 'Aula 49 — O Universo do Baixo de 5 Cordas', subtitulo: 'Dominando a corda Si grave (B0)', objetivo: 'Explorar a 5ª corda', duracaoMinutos: 30 },
      { id: 'baixo-mod9-l2', numero: 2, titulo: 'Aula 50 — Double Thumb Technique', subtitulo: 'O estilo revolucionário de Victor Wooten', objetivo: 'Executar double thumb', duracaoMinutos: 35 },
      { id: 'baixo-mod9-l3', numero: 3, titulo: 'Aula 51 — Acordes e Harmonia em Bloco no Baixo', subtitulo: 'Polifonia avançada com acordes', objetivo: 'Tocar acordes no baixo', duracaoMinutos: 30 },
      { id: 'baixo-mod9-l4', numero: 4, titulo: 'Aula 52 — Flamenco e Técnicas Percussivas no Baixo', subtitulo: 'Golpes no corpo e cordas', objetivo: 'Expandir percussão acústica', duracaoMinutos: 30 },
      { id: 'baixo-mod9-l5', numero: 5, titulo: 'Aula 53 — Saltos de Corda Virtuosos (String Skipping)', subtitulo: 'Agilidade em intervalos largos', objetivo: 'Dominar string skipping', duracaoMinutos: 30 },
      { id: 'baixo-mod9-l6', numero: 6, titulo: 'Aula 54 — Repertório Instrumental Avançado', subtitulo: 'Executando peças solo complexas', objetivo: 'Tocar repertório virtuoso', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'baixo-mod-9',
    nome: 'Módulo 9 — O Baixista Produtor e Sideman Profissional',
    instrumentId: 'baixo',
    nivel: 5,
    moduloNumero: 10,
    objetivoAcademico: 'Preparar o baixista para o mercado profissional, gravação em estúdio e direção musical.',
    competenciasDesenvolvidas: ['Mercado de trabalho', 'Gravação profissional', 'Leitura de cifragem avançada'],
    preRequisitos: ['Módulo 9 concluído.'],
    conteudos: ['O papel do sideman', 'Leitura à primeira vista (sight reading)', 'Equipamentos, pedais e amplificadores de palco'],
    exerciciosPraticos: [{ titulo: 'Sight reading de linha inédita', bpmAlvo: 80, instrucoes: 'Leitura fluida à primeira vista', repeticoesAlvo: 8 }],
    criteriosDominio: ['Leitura e execução de linha inédita sem erros graves.'],
    formaAvaliacao: 'Banca profissional de sideman.',
    aulas: [
      { id: 'baixo-mod10-l1', numero: 1, titulo: 'Aula 55 — O Sideman Perfeito: Ética e Versatilidade', subtitulo: 'Como tocar o que a música pede', objetivo: 'Desenvolver postura profissional', duracaoMinutos: 30 },
      { id: 'baixo-mod10-l2', numero: 2, titulo: 'Aula 56 — Leitura à Primeira Vista (Sight Reading)', subtitulo: 'Lendo partitura e cifra instantaneamente', objetivo: 'Ler e tocar à primeira vista', duracaoMinutos: 35 },
      { id: 'baixo-mod10-l3', numero: 3, titulo: 'Aula 57 — O Baixista no Estúdio de Gravação', subtitulo: 'Afilando o timbre para mixagem', objetivo: 'Gravar com precisão de estúdio', duracaoMinutos: 30 },
      { id: 'baixo-mod10-l4', numero: 4, titulo: 'Aula 58 — Pedais e Processamento de Sinal para Baixo', subtitulo: 'Compressores, preamps, octavers e envelopers', objetivo: 'Dominar pedalboard de baixo', duracaoMinutos: 30 },
      { id: 'baixo-mod10-l5', numero: 5, titulo: 'Aula 59 — Direção Musical e Arranjo de Baixo', subtitulo: 'Criando linhas para naipes e bandas', objetivo: 'Arranjar para grupo completo', duracaoMinutos: 30 },
      { id: 'baixo-mod10-l6', numero: 6, titulo: 'Aula 60 — Recital Solene de Formação em Contrabaixo', subtitulo: 'Apresentação final de conservatório', objetivo: 'Concluir a formação profissional', duracaoMinutos: 45 }
    ]
  }
];

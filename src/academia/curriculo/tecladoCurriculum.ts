// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO COMPLETA EM TECLADO E PIANO (60 AULAS)
// Matriz Acadêmica de Conservatório em 10 Módulos (6 aulas por módulo)
// Preservação integral dos 18 IDs históricos (teclado-l-0-1 até teclado-l-5-3)
// =========================================================================

import { CurriculumModuleDefinition } from '../core/types';

export const TECLADO_CURRICULUM_MODULES: CurriculumModuleDefinition[] = [
  {
    id: 'teclado-mod-0',
    nome: 'Geografia do Teclado, Postura e Mão Direita',
    instrumentId: 'teclado',
    nivel: 0,
    moduloNumero: 1,
    objetivoAcademico: 'Compreender a geografia das teclas brancas e pretas, postura ergonômica de punho, dedilhado canônico e primeiras notas naturais.',
    competenciasDesenvolvidas: ['Geografia de oitavas', 'Postura de punho arqueado', 'Dedilhado 1-2-3-4-5'],
    preRequisitos: ['Teclado ou piano digital de 61+ teclas.'],
    conteudos: ['Teclas brancas e pretas', 'Grupos de 2 e 3 pretas', 'Postura correta', 'Dedilhado básico', 'Pulsação rítmica', 'Primeira escala em dó maior'],
    exerciciosPraticos: [{ titulo: 'Dedilhado de 5 dedos em Dó Maior', bpmAlvo: 60, instrucoes: 'Articulação limpa', repeticoesAlvo: 8 }],
    criteriosDominio: ['Execução fluida da escala de Dó com 5 dedos a 60 BPM.'],
    formaAvaliacao: 'Avaliação prática de postura e toque.',
    aulas: [
      { id: 'teclado-l-0-1', numero: 1, titulo: 'Anatomia do Teclado e Geografia das Teclas', subtitulo: 'O padrão de 2 e 3 teclas pretas', objetivo: 'Reconhecer o teclado', duracaoMinutos: 20 },
      { id: 'teclado-l-0-2', numero: 2, titulo: 'Postura, Altura do Banco e Curvatura dos Dedos', subtitulo: 'Ergonomia ao piano', objetivo: 'Posicionar mãos sem tensão', duracaoMinutos: 15 },
      { id: 'teclado-l-0-3', numero: 3, titulo: 'Dedilhado Funcional e as Primeiras Notas Naturais', subtitulo: 'Os dedos de 1 a 5', objetivo: 'Acionar notas com independência', duracaoMinutos: 25 },
      { id: 'teclado-mod1-l4', numero: 4, titulo: 'Aula 4 — Toque Legato vs. Staccato ao Teclado', subtitulo: 'Articulação das notas', objetivo: 'Controlar legato e staccato', duracaoMinutos: 25 },
      { id: 'teclado-mod1-l5', numero: 5, titulo: 'Aula 5 — Dinâmica Básica: Piano e Forte', subtitulo: 'Controle de volume pelo toque', objetivo: 'Variar dinâmica de toque', duracaoMinutos: 20 },
      { id: 'teclado-mod1-l6', numero: 6, titulo: 'Aula 6 — O Metrônomo no Teclado: Pulsação Estável', subtitulo: 'Sincronia com o clique', objetivo: 'Manter andamento rígido', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'teclado-mod-1',
    nome: 'Tríades Fundamentais e Duas Mãos',
    instrumentId: 'teclado',
    nivel: 1,
    moduloNumero: 2,
    objetivoAcademico: 'Formar tríades maiores e menores e coordenar o acompanhamento com a mão esquerda.',
    competenciasDesenvolvidas: ['Tríades fundamentais', 'Coordenação bimanual', 'Acordes em bloco'],
    preRequisitos: ['Módulo 1 concluído.'],
    conteudos: ['Tríades maiores e menores', 'Acompanhamento com a mão esquerda', 'Inversões básicas', 'Ritmos simples'],
    exerciciosPraticos: [{ titulo: 'Tríades em bloco com as duas mãos', bpmAlvo: 65, instrucoes: 'Ataque simultâneo', repeticoesAlvo: 12 }],
    criteriosDominio: ['Troca limpa de tríades a 65 BPM sem atrasos bimanual.'],
    formaAvaliacao: 'Banca de tríades.',
    aulas: [
      { id: 'teclado-l-1-1', numero: 1, titulo: 'Construção de Tríades Maiores e Menores', subtitulo: 'A base da harmonia em blocos', objetivo: 'Formar tríades corretas', duracaoMinutos: 25 },
      { id: 'teclado-l-1-2', numero: 2, titulo: 'Coordenação Bimanual: Mão Esquerda nos Acordes', subtitulo: 'Independência entre as mãos', objetivo: 'Tocar com duas mãos', duracaoMinutos: 30 },
      { id: 'teclado-l-1-3', numero: 3, titulo: 'Inversões de Tríades: Condução Suave de Vozes', subtitulo: '1ª e 2ª inversões', objetivo: 'Inverter tríades fluentemente', duracaoMinutos: 25 },
      { id: 'teclado-mod2-l4', numero: 4, titulo: 'Aula 4 — O Campo Harmônico Maior em Tríades', subtitulo: 'Os acordes de uma tonalidade', objetivo: 'Mapear o campo harmônico', duracaoMinutos: 25 },
      { id: 'teclado-mod2-l5', numero: 5, titulo: 'Aula 5 — Progressões Comuns I–IV–V–I', subtitulo: 'A base da música ocidental', objetivo: 'Executar cadências clássicas', duracaoMinutos: 25 },
      { id: 'teclado-mod2-l6', numero: 6, titulo: 'Aula 6 — Acompanhamento Estilo Pop/Ballad', subtitulo: 'Arpejos simples na mão esquerda', objetivo: 'Acompanhar canção pop', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'teclado-mod-2',
    nome: 'Escalas Maiores, Menores e Arpejos',
    instrumentId: 'teclado',
    nivel: 2,
    moduloNumero: 3,
    objetivoAcademico: 'Dominar escalas de 2 oitavas e arpejos fundamentais.',
    competenciasDesenvolvidas: ['Escalas em duas oitavas', 'Passagem do polegar', 'Arpejos em bloco'],
    preRequisitos: ['Módulo 2 concluído.'],
    conteudos: ['Passagem do polegar (thumb under)', 'Escalas maiores com acidentes', 'Arpejos triadicos', 'Ritmo de colcheias'],
    exerciciosPraticos: [{ titulo: 'Escala de Sol Maior em duas oitavas', bpmAlvo: 70, instrucoes: 'Fluidez na passagem do polegar', repeticoesAlvo: 8 }],
    criteriosDominio: ['Escala limpa em duas oitavas a 70 BPM.'],
    formaAvaliacao: 'Teste de escalas.',
    aulas: [
      { id: 'teclado-l-2-1', numero: 1, titulo: 'A Técnica de Passagem do Polegar (Thumb Under)', subtitulo: 'Escalas fluidas em oitavas', objetivo: 'Dominar passagem do polegar', duracaoMinutos: 30 },
      { id: 'teclado-l-2-2', numero: 2, titulo: 'Escalas Maiores com Acidentes (Sol, Ré e Fá Maior)', subtitulo: 'Navegando pelas armaduras', objetivo: 'Tocar escalas com sustenidos e bemóis', duracaoMinutos: 30 },
      { id: 'teclado-l-2-3', numero: 3, titulo: 'Arpejos Triádicos Expandidos', subtitulo: 'Abertura de acordes em arpejo', objetivo: 'Executar arpejos', duracaoMinutos: 25 },
      { id: 'teclado-mod3-l4', numero: 4, titulo: 'Aula 4 — A Escala Menor Natural no Teclado', subtitulo: 'Sonoridade melancólica e menor', objetivo: 'Tocar menor natural', duracaoMinutos: 25 },
      { id: 'teclado-mod3-l5', numero: 5, titulo: 'Aula 5 — Acompanhamento com Acordes Arpejados', subtitulo: 'Padrão Alberti e variações', objetivo: 'Criar textura arpejada', duracaoMinutos: 30 },
      { id: 'teclado-mod3-l6', numero: 6, titulo: 'Aula 6 — Repertório Clássico Elementar', subtitulo: 'Pequena peça de estudo', objetivo: 'Executar peça estruturada', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'teclado-mod-3',
    nome: 'Tétrades, Campo Harmônico e Voicings',
    instrumentId: 'teclado',
    nivel: 3,
    moduloNumero: 4,
    objetivoAcademico: 'Dominar tétrades (maj7, m7, 7) e voicings de mão esquerda.',
    competenciasDesenvolvidas: ['Tétrades', 'Voicings reduzidos', 'Campo harmônico completo'],
    preRequisitos: ['Módulo 3 concluído.'],
    conteudos: ['Acordes com sétima', 'Voicings com fundamental na esquerda', 'Cadência II-V-I', 'Inversões de tétrades'],
    exerciciosPraticos: [{ titulo: 'Cadência II-V-I com tétrades', bpmAlvo: 75, instrucoes: 'Voice leading suave', repeticoesAlvo: 10 }],
    criteriosDominio: ['Condução fluida de tétrades em II-V-I a 75 BPM.'],
    formaAvaliacao: 'Banca de harmonia ao teclado.',
    aulas: [
      { id: 'teclado-l-3-1', numero: 1, titulo: 'Tétrades e Acordes com Sétima ao Teclado', subtitulo: 'Maj7, m7, 7 e m7b5', objetivo: 'Formar tétrades no teclado', duracaoMinutos: 30 },
      { id: 'teclado-l-3-2', numero: 2, titulo: 'Voicings Essenciais: A Mão Esquerda no Jazz e Pop', subtitulo: 'Redução de acordes', objetivo: 'Aplicar voicings funcionais', duracaoMinutos: 30 },
      { id: 'teclado-l-3-3', numero: 3, titulo: 'A Cadência Definitiva: II–V–I Maior', subtitulo: 'O ciclo harmônico fundamental', objetivo: 'Dominar II-V-I', duracaoMinutos: 30 },
      { id: 'teclado-mod4-l4', numero: 4, titulo: 'Aula 4 — O Campo Harmônico Menor', subtitulo: 'Menor harmônica e melódica aplicada', objetivo: 'Explorar campo menor', duracaoMinutos: 25 },
      { id: 'teclado-mod4-l5', numero: 5, titulo: 'Aula 5 — Acordes Diminutos e Meio-Diminutos', subtitulo: 'Sutilezas harmônicas', objetivo: 'Dominar acordes diminutos', duracaoMinutos: 25 },
      { id: 'teclado-mod4-l6', numero: 6, titulo: 'Aula 6 — Acompanhamento Estilo Piano Bar', subtitulo: 'Arranjo com balanço e espressivo', objetivo: 'Tocar estilo piano bar', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'teclado-mod-4',
    nome: 'Extensões Superiores, Drop 2 e Modos',
    instrumentId: 'teclado',
    nivel: 4,
    moduloNumero: 5,
    objetivoAcademico: 'Aplicar extensões (9, 11, 13), acordes Drop 2 e sonoridades modais.',
    competenciasDesenvolvidas: ['Extensões superiores', 'Voicings Drop 2', 'Modos gregos ao teclado'],
    preRequisitos: ['Módulo 4 concluído.'],
    conteudos: ['Acordes estendidos (9, 13)', 'Técnica de Drop 2', 'Modos gregos aplicados', 'Re-harmonização básica'],
    exerciciosPraticos: [{ titulo: 'Drop 2 em cadência maior', bpmAlvo: 80, instrucoes: 'Abertura elegante de vozes', repeticoesAlvo: 12 }],
    criteriosDominio: ['Execução correta de Drop 2 nas 4 inversões a 80 BPM.'],
    formaAvaliacao: 'Teste de Drop 2 e extensões.',
    aulas: [
      { id: 'teclado-l-4-1', numero: 1, titulo: 'Extensões Superiores: Nonas, Décimas Oitavas e Trezenas', subtitulo: 'Colorindo a harmonia', objetivo: 'Adicionar extensões aos acordes', duracaoMinutos: 30 },
      { id: 'teclado-l-4-2', numero: 2, titulo: 'Aberturas Avançadas: A Técnica de Drop 2', subtitulo: 'Voicings abertos profissionais', objetivo: 'Dominar acordes Drop 2', duracaoMinutos: 35 },
      { id: 'teclado-l-4-3', numero: 3, titulo: 'Modos Gregos no Teclado: Cores e Texturas', subtitulo: 'Lídio, Frígio, Dórico e Mixolídio', objetivo: 'Explorar cores modais', duracaoMinutos: 30 },
      { id: 'teclado-mod5-l4', numero: 4, titulo: 'Aula 4 — Dominantes Secundários e Substituição', subtitulo: 'Harmonia avançada ao piano', objetivo: 'Aplicar dominantes secundários', duracaoMinutos: 30 },
      { id: 'teclado-mod5-l5', numero: 5, titulo: 'Aula 5 — Acordes Quartais e Modern Jazz Voicings', subtitulo: 'Aberturas por quartas', objetivo: 'Construir voicings quartais', duracaoMinutos: 30 },
      { id: 'teclado-mod5-l6', numero: 6, titulo: 'Aula 6 — Arranjo Pop Moderno com Sintetizadores', subtitulo: 'Pads, leads e texturas eletrônicas', objetivo: 'Trabalhar com timbres de teclado', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'teclado-mod-5',
    nome: 'Improvisação, Polifonia e Performance',
    instrumentId: 'teclado',
    nivel: 5,
    moduloNumero: 6,
    objetivoAcademico: 'Executar arranjos solo completos, polifonia avançada e improvisação profissional.',
    competenciasDesenvolvidas: ['Arranjo solo bimanual', 'Improvisação avançada', 'Performance de palco'],
    preRequisitos: ['Módulo 5 concluído.'],
    conteudos: ['Melodia na mão direita e acordes na esquerda', 'Improvisação modal', 'Pedal de sustentação (sustain pedal)', 'Recital final'],
    exerciciosPraticos: [{ titulo: 'Arranjo solo com melodia superior e baixo', bpmAlvo: 85, instrucoes: 'Independência expressiva', repeticoesAlvo: 10 }],
    criteriosDominio: ['Performance de peça solo completa com uso correto do pedal de sustain.'],
    formaAvaliacao: 'Recital final de conservatório em teclado.',
    aulas: [
      { id: 'teclado-l-5-1', numero: 1, titulo: 'Independência Polifônica: Melodia e Acompanhamento', subtitulo: 'Mão direita cantando sobre a esquerda', objetivo: 'Executar polifonia ao teclado', duracaoMinutos: 35 },
      { id: 'teclado-l-5-2', numero: 2, titulo: 'Uso Artístico do Pedal de Sustentação (Sustain Pedal)', subtitulo: 'Limpeza e ambiência sonora', objetivo: 'Dominar o pedal de sustain', duracaoMinutos: 25 },
      { id: 'teclado-l-5-3', numero: 3, titulo: 'Improvisação e Solos de Teclado de Alta Performance', subtitulo: 'Fluência e fraseado pianístico', objetivo: 'Improvisar com fluência', duracaoMinutos: 35 },
      { id: 'teclado-mod6-l4', numero: 4, titulo: 'Aula 4 — Glissandos, Trinados e Efeitos Acústicos', subtitulo: 'Técnicas de expressão avançada', objetivo: 'Executar trinados e glissandos', duracaoMinutos: 25 },
      { id: 'teclado-mod6-l5', numero: 5, titulo: 'Aula 5 — O Tecladista na Banda: MIDI, VSTs e Setup', subtitulo: 'Equipamentos e controladores modernos', objetivo: 'Configurar rig de palco', duracaoMinutos: 30 },
      { id: 'teclado-mod6-l6', numero: 6, titulo: 'Aula 6 — Recital Solene de Formação em Teclado', subtitulo: 'Apresentação final de conservatório', objetivo: 'Concluir a formação pianística', duracaoMinutos: 45 }
    ]
  },
  {
    id: 'teclado-mod-6',
    nome: 'Módulo 6 — R&B, Gospel Chops e Voicings Contemporâneos',
    instrumentId: 'teclado',
    nivel: 4,
    moduloNumero: 7,
    objetivoAcademico: 'Dominar acordes gospel, passagens rápidas (chops) e voicings densos de R&B.',
    competenciasDesenvolvidas: ['Gospel chops', 'Voicings densos', 'Pentatônicas no teclado'],
    preRequisitos: ['Módulos 1 a 6 concluídos.'],
    conteudos: ['Acordes gospel e extensões alteradas', 'Glissandos rítmicos', 'Acompanhamento em igrejas e bandas de R&B'],
    exerciciosPraticos: [{ titulo: 'Progressão gospel com extensões', bpmAlvo: 75, instrucoes: 'Voicings abertos expressivos', repeticoesAlvo: 12 }],
    criteriosDominio: ['Fluência em progressões gospel e R&B a 75 BPM.'],
    formaAvaliacao: 'Gravação de faixa estilo gospel/R&B.',
    aulas: [
      { id: 'teclado-mod7-l1', numero: 1, titulo: 'Aula 37 — O Som do Gospel: Voicings Abertos', subtitulo: 'Aberturas densas e emotivas', objetivo: 'Criar sonoridade gospel', duracaoMinutos: 30 },
      { id: 'teclado-mod7-l2', numero: 2, titulo: 'Aula 38 — Gospel Chops: Passagens Rápidas', subtitulo: 'Velocidade e limpeza em acordes', objetivo: 'Executar chops pianísticos', duracaoMinutos: 35 },
      { id: 'teclado-mod7-l3', numero: 3, titulo: 'Aula 39 — Neossoul Chords e Clustered Voicings', subtitulo: 'Clusters e acordes clusterizados', objetivo: 'Dominar clusters modernos', duracaoMinutos: 30 },
      { id: 'teclado-mod7-l4', numero: 4, titulo: 'Aula 40 — O Estilo de Teclado de R&B dos Anos 90', subtitulo: 'Rhodes, Wurlitzer e Clavinet', objetivo: 'Simular pianos eletromecânicos', duracaoMinutos: 30 },
      { id: 'teclado-mod7-l5', numero: 5, titulo: 'Aula 41 — Pentatônicas e Blues no Piano', subtitulo: 'Licks idiomáticos de teclado blues', objetivo: 'Improvisar com blues e pentatônicas', duracaoMinutos: 30 },
      { id: 'teclado-mod7-l6', numero: 6, titulo: 'Aula 42 — Acompanhamento Rítmico Sincopado', subtitulo: 'Groove de teclado na mão esquerda', objetivo: 'Manter groove sincopado', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'teclado-mod-7',
    nome: 'Módulo 7 — Harmonia Funcional Avançada e Rearmonização',
    instrumentId: 'teclado',
    nivel: 5,
    moduloNumero: 8,
    objetivoAcademico: 'Aplicar técnicas avançadas de rearmonização, modulações e acordes de empréstimo modal.',
    competenciasDesenvolvidas: ['Rearmonização funcional', 'Empréstimo modal', 'Modulação por acordes de troca'],
    preRequisitos: ['Módulo 7 concluído.'],
    conteudos: ['Técnicas de rearmonização de melodias', 'Acordes de empréstimo modal', 'Substituições avançadas de acordes'],
    exerciciosPraticos: [{ titulo: 'Rearmonização de standard de jazz', bpmAlvo: 80, instrucoes: 'Aplicação de subV7 e diminutos', repeticoesAlvo: 10 }],
    criteriosDominio: ['Rearmonização fluida de música popular a 80 BPM.'],
    formaAvaliacao: 'Banca de rearmonização.',
    aulas: [
      { id: 'teclado-mod8-l1', numero: 1, titulo: 'Aula 43 — Rearmonização por Acordes Passantes', subtitulo: 'Preenchendo vazios harmônicos', objetivo: 'Aplicar acordes passantes', duracaoMinutos: 30 },
      { id: 'teclado-mod8-l2', numero: 2, titulo: 'Aula 44 — Empréstimo Modal no Piano', subtitulo: 'Cores do modo menor no tom maior', objetivo: 'Usar empréstimo modal', duracaoMinutos: 30 },
      { id: 'teclado-mod8-l3', numero: 3, titulo: 'Aula 45 — Substituição Tritônica ao Teclado', subtitulo: 'Trítonos e condução cromática', objetivo: 'Aplicar substituição tritônica', duracaoMinutos: 30 },
      { id: 'teclado-mod8-l4', numero: 4, titulo: 'Aula 46 — Modulações por Acorde Pivô e Direta', subtitulo: 'Mudança de tom pianística', objetivo: 'Modular com fluência', duracaoMinutos: 30 },
      { id: 'teclado-mod8-l5', numero: 5, titulo: 'Aula 47 — O Acorde Napolitano e Sextas Aumentadas', subtitulo: 'Harmonia clássica aplicada ao teclado moderno', objetivo: 'Dominar harmonia avançada', duracaoMinutos: 30 },
      { id: 'teclado-mod8-l6', numero: 6, titulo: 'Aula 48 — Análise Completa de Partituras e Cifras', subtitulo: 'Decodificando arranjos complexos', objetivo: 'Analisar partituras avançadas', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'teclado-mod-8',
    nome: 'Módulo 8 — Estilos e Arranjos para Teclado Solo',
    instrumentId: 'teclado',
    nivel: 5,
    moduloNumero: 9,
    objetivoAcademico: 'Criar arranjos solo completos em diferentes estilos (Bossa, Jazz, Pop, Clássico).',
    competenciasDesenvolvidas: ['Arranjo solo', 'Estilo Bossa Nova', 'Estilo Ballad'],
    preRequisitos: ['Módulo 8 concluído.'],
    conteudos: ['Técnicas de arranjo solo para piano', 'Balanço de Bossa Nova ao teclado', 'Polifonia e contraponto elementar'],
    exerciciosPraticos: [{ titulo: 'Arranjo solo estilo Bossa Nova', bpmAlvo: 75, instrucoes: 'Baixo na esquerda e síncopa na direita', repeticoesAlvo: 10 }],
    criteriosDominio: ['Arranjo solo executado com limpeza e precisão rítmica.'],
    formaAvaliacao: 'Apresentação de arranjo solo.',
    aulas: [
      { id: 'teclado-mod9-l1', numero: 1, titulo: 'Aula 49 — Arranjo Solo: O Conceito de Piano Bar', subtitulo: 'Preenchendo todo o espectro sonoro', objetivo: 'Fazer arranjo solo completo', duracaoMinutos: 30 },
      { id: 'teclado-mod9-l2', numero: 2, titulo: 'Aula 50 — Bossa Nova ao Teclado: O Violão no Piano', subtitulo: 'Adaptação do violão bossa nova para as teclas', objetivo: 'Tocar bossa nova no teclado', duracaoMinutos: 35 },
      { id: 'teclado-mod9-l3', numero: 3, titulo: 'Aula 51 — Contraponto Elementar e Vozes Independentes', subtitulo: 'Imitação e linhas contrapontísticas', objetivo: 'Desenvolver contraponto', duracaoMinutos: 30 },
      { id: 'teclado-mod9-l4', numero: 4, titulo: 'Aula 52 — Baladas Pop Épicas ao Piano', subtitulo: 'Dinamismo e emoção em arranjos pop', objetivo: 'Executar balada épica', duracaoMinutos: 30 },
      { id: 'teclado-mod9-l5', numero: 5, titulo: 'Aula 53 — Introduções, Viradas e Finais (Intros & Outros)', subtitulo: 'Enfeites pianísticos profissionais', objetivo: 'Criar intros e finais marcantes', duracaoMinutos: 30 },
      { id: 'teclado-mod9-l6', numero: 6, titulo: 'Aula 54 — Repertório Avançado de Conservatório', subtitulo: 'Estudo de peça de concerto', objetivo: 'Tocar peça avançada', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'teclado-mod-9',
    nome: 'Módulo 9 — O Tecladista Profissional e Arranjador',
    instrumentId: 'teclado',
    nivel: 5,
    moduloNumero: 10,
    objetivoAcademico: 'Dominar o mercado profissional de tecladista, arranjos para banda e tecnologia musical.',
    competenciasDesenvolvidas: ['Mercado profissional', 'Trabalho com sintetizadores', 'Leitura à primeira vista'],
    preRequisitos: ['Módulo 9 concluído.'],
    conteudos: ['Setup de palco com múltiplos teclados', 'Programação de patches e MIDI', 'Trabalho como arranjador e produtor'],
    exerciciosPraticos: [{ titulo: 'Leitura rápida de lead sheet complexo', bpmAlvo: 80, instrucoes: 'Execução instantânea de cifra com extensões', repeticoesAlvo: 8 }],
    criteriosDominio: ['Leitura e execução de lead sheet à primeira vista sem falhas.'],
    formaAvaliacao: 'Banca profissional de tecladista.',
    aulas: [
      { id: 'teclado-mod10-l1', numero: 1, titulo: 'Aula 55 — O Tecladista na Banda: Papel e Equipamentos', subtitulo: 'Sintetizadores, workstations e pianos de palco', objetivo: 'Dominar rig de teclados', duracaoMinutos: 30 },
      { id: 'teclado-mod10-l2', numero: 2, titulo: 'Aula 56 — Programação de Timbres e Camadas (Layers)', subtitulo: 'Combinando piano com strings e pads', objetivo: 'Criar layers e splits profissionais', duracaoMinutos: 35 },
      { id: 'teclado-mod10-l3', numero: 3, titulo: 'Aula 57 — Leitura à Primeira Vista no Teclado', subtitulo: 'Decodificando partituras e cifras rapidamente', objetivo: 'Ler e tocar instantaneamente', duracaoMinutos: 30 },
      { id: 'teclado-mod10-l4', numero: 4, titulo: 'Aula 58 — Trilha Sonora e Arranjo Virtual (MIDI & VST)', subtitulo: 'Produção musical no computador', objetivo: 'Produzir com instrumentos virtuais', duracaoMinutos: 30 },
      { id: 'teclado-mod10-l5', numero: 5, titulo: 'Aula 59 — Direção Musical ao Teclado', subtitulo: 'Comandando ensaios e arranjos de banda', objetivo: 'Atuar como diretor musical', duracaoMinutos: 30 },
      { id: 'teclado-mod10-l6', numero: 6, titulo: 'Aula 60 — Recital Solene de Formação em Teclado', subtitulo: 'Apresentação final de conservatório', objetivo: 'Concluir a formação pianística profissional', duracaoMinutos: 45 }
    ]
  }
];

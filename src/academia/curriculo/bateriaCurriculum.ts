// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO COMPLETA EM BATERIA E PRÁTICA RÍTMICA (60 AULAS)
// Matriz Acadêmica de Conservatório em 10 Módulos (6 aulas por módulo)
// Preservação integral dos 18 IDs históricos (bateria-l-0-1 até bateria-l-5-3)
// =========================================================================

import { CurriculumModuleDefinition } from '../core/types';

export const BATERIA_CURRICULUM_MODULES: CurriculumModuleDefinition[] = [
  {
    id: 'bateria-mod-0',
    nome: 'Anatomia do Kit, Postura e Fulcro',
    instrumentId: 'bateria',
    nivel: 0,
    moduloNumero: 1,
    objetivoAcademico: 'Compreender a anatomia da bateria, postura ergonômica, matched/traditional grip, fulcro das baquetas e primeiras pulsações no metrônomo.',
    competenciasDesenvolvidas: ['Anatomia do kit acústico', 'Matched grip e fulcro', 'Postura em banqueta'],
    preRequisitos: ['Kit de bateria ou pad de estudo e par de baquetas.'],
    conteudos: ['Partes da bateria', 'Pegada correta (fulcro)', 'Postura sentada', 'Batidas no pad', 'Pulsação em semínimas', 'Controle de rebote'],
    exerciciosPraticos: [{ titulo: 'Toques simples no pad com rebote controlado', bpmAlvo: 60, instrucoes: 'Rebote natural', repeticoesAlvo: 16 }],
    criteriosDominio: ['Estabilidade de toque no pad a 60 BPM por 2 minutos.'],
    formaAvaliacao: 'Avaliação prática de pegada e rebote.',
    aulas: [
      { id: 'bateria-l-0-1', numero: 1, titulo: 'Anatomia do Kit de Bateria e Ergonomia da Banqueta', subtitulo: 'O instrumento percussivo completo', objetivo: 'Reconhecer peças do kit', duracaoMinutos: 20 },
      { id: 'bateria-l-0-2', numero: 2, titulo: 'Pegada, Fulcro e Matched Grip: O Domínio das Baquetas', subtitulo: 'O ponto de equilíbrio', objetivo: 'Dominar pegada correta', duracaoMinutos: 15 },
      { id: 'bateria-l-0-3', numero: 3, titulo: 'O Rebote Natural e as Primeiras Pulsações no Pad', subtitulo: 'A física da baqueta', objetivo: 'Controlar o rebote', duracaoMinutos: 25 },
      { id: 'bateria-mod1-l4', numero: 4, titulo: 'Aula 4 — Altura dos Tambores e Ajuste de Pratos', subtitulo: 'Ergonomia de alcance e visão', objetivo: 'Ajustar o kit ao corpo', duracaoMinutos: 20 },
      { id: 'bateria-mod1-l5', numero: 5, titulo: 'Aula 5 — Independência dos Pés: O Bumbo e o Chimbal', subtitulo: 'Iniciação do pé direito', objetivo: 'Coordenar pé e mãos', duracaoMinutos: 25 },
      { id: 'bateria-mod1-l6', numero: 6, titulo: 'Aula 6 — O Metrônomo para Bateristas: Precisão Cirúrgica', subtitulo: 'O clique como lei', objetivo: 'Tocar em perfeito sincronismo com o metrônomo', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'bateria-mod-1',
    nome: 'Rudimentos Básicos e Primeira Levada',
    instrumentId: 'bateria',
    nivel: 1,
    moduloNumero: 2,
    objetivoAcademico: 'Executar toques simples (single stroke), toques duplos (double stroke) e a primeira levada de rock 4/4.',
    competenciasDesenvolvidas: ['Single stroke roll', 'Double stroke roll', 'Levada básica de rock'],
    preRequisitos: ['Módulo 1 concluído.'],
    conteudos: ['Single stroke', 'Double stroke', 'Levada de rock em 4/4 (chimbal, bumbo e caixa)', 'Colcheias e semínimas'],
    exerciciosPraticos: [{ titulo: 'Toques simples e duplos alternados', bpmAlvo: 65, instrucoes: 'Limpeza de som', repeticoesAlvo: 20 }],
    criteriosDominio: ['Rudimentos limpos a 65 BPM e levada de rock estável.'],
    formaAvaliacao: 'Banca de rudimentos e levada básica.',
    aulas: [
      { id: 'bateria-l-1-1', numero: 1, titulo: 'Toques Simples e Duplos: Single e Double Stroke', subtitulo: 'Os pilares dos rudimentos', objetivo: 'Executar toques simples e duplos', duracaoMinutos: 25 },
      { id: 'bateria-l-1-2', numero: 2, titulo: 'A Primeira Levada de Rock em 4/4', subtitulo: 'Chimbal, caixa e bumbo unidos', objetivo: 'Tocar levada fundamental de rock', duracaoMinutos: 30 },
      { id: 'bateria-l-1-3', numero: 3, titulo: 'Independência Mão Direita e Pé Direito', subtitulo: 'Coordenação rítmica básica', objetivo: 'Coordenar chimbal e bumbo', duracaoMinutos: 25 },
      { id: 'bateria-mod2-l4', numero: 4, titulo: 'Aula 4 — O Papel da Caixa no Tempo 2 e 4', subtitulo: 'O backbeat inegociável', objetivo: 'Marcar com firmeza o backbeat', duracaoMinutos: 25 },
      { id: 'bateria-mod2-l5', numero: 5, titulo: 'Aula 5 — Abertura de Chimbal com o Pé Esquerdo', subtitulo: 'Chicote de chimbal (Hi-hat chick)', objetivo: 'Controlar o pedal de chimbal', duracaoMinutos: 25 },
      { id: 'bateria-mod2-l6', numero: 6, titulo: 'Aula 6 — Primeira Virada de 1 Tempo (Fill)', subtitulo: 'Entrando no compasso seguinte', objetivo: 'Executar virada simples', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'bateria-mod-2',
    nome: 'Paradiddles, Colcheias e Dinâmica',
    instrumentId: 'bateria',
    nivel: 2,
    moduloNumero: 3,
    objetivoAcademico: 'Dominar o paradiddle, subdivisão em colcheias e acentuação dinâmica.',
    competenciasDesenvolvidas: ['Single paradiddle', 'Acentuação dinâmica', 'Viradas de 2 tempos'],
    preRequisitos: ['Módulo 2 concluído.'],
    conteudos: ['Paradiddle (RLRR LRLL)', 'Dinâmica (acento e abafado)', 'Viradas em colcheias', 'Groove com caixa fantasma básica'],
    exerciciosPraticos: [{ titulo: 'Paradiddle com acentos no 1º toque', bpmAlvo: 70, instrucoes: 'Acento forte e notas fantasmas baixas', repeticoesAlvo: 16 }],
    criteriosDominio: ['Paradiddle uniforme com acentos claros a 70 BPM.'],
    formaAvaliacao: 'Teste de paradiddles e dinâmica.',
    aulas: [
      { id: 'bateria-l-2-1', numero: 1, titulo: 'O Paradiddle: O Rudimento Mais Versátil', subtitulo: 'RLRR LRLL na prática', objetivo: 'Dominar paradiddle', duracaoMinutos: 30 },
      { id: 'bateria-l-2-2', numero: 2, titulo: 'Acentuação Dinâmica: O Toque Forte e o Toque Fraquinho', subtitulo: 'Controlando a altura da baqueta', objetivo: 'Aplicar dinâmica de acentos', duracaoMinutos: 25 },
      { id: 'bateria-l-2-3', numero: 3, titulo: 'Viradas de 2 Tempos pelo Kit (Fills)', subtitulo: 'Conectando compassos com fluidez', objetivo: 'Criar viradas musicais', duracaoMinutos: 30 },
      { id: 'bateria-mod3-l4', numero: 4, titulo: 'Aula 4 — O Groove com Chimbal Aberto e Fechado', subtitulo: 'Texturas no chimbal', objetivo: 'Abrir e fechar o chimbal no ritmo', duracaoMinutos: 25 },
      { id: 'bateria-mod3-l5', numero: 5, titulo: 'Aula 5 — Bumbo Sincopado: Antecipações e Contratempos', subtitulo: 'O bumbo conversando com o baixo', objetivo: 'Sincopar o bumbo na levada', duracaoMinutos: 30 },
      { id: 'bateria-mod3-l6', numero: 6, titulo: 'Aula 6 — Prática de Repertório: Rock dos Anos 80', subtitulo: 'Aplicando em música real', objetivo: 'Tocar música completa', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'bateria-mod-3',
    nome: 'Semicolcheias, Groove Funk e Ghost Notes',
    instrumentId: 'bateria',
    nivel: 3,
    moduloNumero: 4,
    objetivoAcademico: 'Dominar semicolcheias no chimbal/caixa, ghost notes e grooves de funk/soul.',
    competenciasDesenvolvidas: ['Semicolcheias no kit', 'Ghost notes na caixa', 'Groove funk'],
    preRequisitos: ['Módulo 3 concluído.'],
    conteudos: ['Subdivisão em semicolcheias', 'Ghost notes (notas fantasmas)', 'Grooves de funk linear simples', 'Independência avançada'],
    exerciciosPraticos: [{ titulo: 'Groove funk com ghost notes na caixa', bpmAlvo: 75, instrucoes: 'Toque abafado e backbeat forte', repeticoesAlvo: 16 }],
    criteriosDominio: ['Groove funk com ghost notes limpas a 75 BPM.'],
    formaAvaliacao: 'Gravação de groove funk.',
    aulas: [
      { id: 'bateria-l-3-1', numero: 1, titulo: 'Subdivisões em Semicolcheias no Kit de Bateria', subtitulo: '16ths notes no chimbal', objetivo: 'Controlar semicolcheias', duracaoMinutos: 30 },
      { id: 'bateria-l-3-2', numero: 2, titulo: 'Ghost Notes: A Arte das Notas Fantasmas na Caixa', subtitulo: 'O balanço do funk e soul', objetivo: 'Executar ghost notes', duracaoMinutos: 30 },
      { id: 'bateria-l-3-3', numero: 3, titulo: 'Grooves de Funk e Soul Básico', subtitulo: 'Síncopa e pegada dançante', objetivo: 'Tocar levadas de funk', duracaoMinutos: 30 },
      { id: 'bateria-mod4-l4', numero: 4, titulo: 'Aula 4 — O Uso do Ride (Prato de Condução) no Rock', subtitulo: 'Mudança de textura e volume', objetivo: 'Conduzir no prato ride', duracaoMinutos: 25 },
      { id: 'bateria-mod4-l5', numero: 5, titulo: 'Aula 5 — Viradas com Semicolcheias e Caixas', subtitulo: 'Fills lineares rápidos', objetivo: 'Criar viradas em semicolcheias', duracaoMinutos: 30 },
      { id: 'bateria-mod4-l6', numero: 6, titulo: 'Aula 6 — Estilo Pop/Rock Contemporâneo', subtitulo: 'Acompanhamento de rádio moderno', objetivo: 'Tocar pop contemporâneo', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'bateria-mod-4',
    nome: 'Compassos Compostos, 6/8 e Rudimentos Avançados',
    instrumentId: 'bateria',
    nivel: 4,
    moduloNumero: 5,
    objetivoAcademico: 'Dominar compassos compostos (6/8, 12/8), rudimentos como flam e drag.',
    competenciasDesenvolvidas: ['Compasso 6/8 e 12/8', 'Flam e Drag', 'Independência em tercinas'],
    preRequisitos: ['Módulo 4 concluído.'],
    conteudos: ['Levadas em 6/8 (estilo balada e shuffle)', 'Rudimentos com graça (Flam e Drag)', 'Tercinas de colcheia', 'Dinâmica em pratos crash'],
    exerciciosPraticos: [{ titulo: 'Levada em 6/8 com bumbo no 1 e 4', bpmAlvo: 70, instrucoes: 'Fluidez em compasso composto', repeticoesAlvo: 12 }],
    criteriosDominio: ['Levada em 6/8 estável a 70 BPM com virada em tercinas.'],
    formaAvaliacao: 'Banca de 6/8 e rudimentos.',
    aulas: [
      { id: 'bateria-l-4-1', numero: 1, titulo: 'O Universo do 6/8: Baladas, Blues e Reggae', subtitulo: 'Compassos compostos na prática', objetivo: 'Tocar em compasso 6/8', duracaoMinutos: 30 },
      { id: 'bateria-l-4-2', numero: 2, titulo: 'Rudimentos Avançados: Flam e Drag', subtitulo: 'O enfeite com graça na caixa', objetivo: 'Executar flams e drags', duracaoMinutos: 30 },
      { id: 'bateria-l-4-3', numero: 3, titulo: 'O Shuffle e o Meio-Tempo (Half-Time Shuffle)', subtitulo: 'O balanço lendário de Porcaro', objetivo: 'Tocar shuffle avançado', duracaoMinutos: 35 },
      { id: 'bateria-mod5-l4', numero: 4, titulo: 'Aula 4 — O Prato Crash como Pontuação Musical', subtitulo: 'Acidentes e acentuação de seções', objetivo: 'Pontuar com o crash', duracaoMinutos: 25 },
      { id: 'bateria-mod5-l5', numero: 5, titulo: 'Aula 5 — Independência Ternária Avançada', subtitulo: 'Mãos e pés em tercinas', objetivo: 'Controlar polirritmia ternária', duracaoMinutos: 30 },
      { id: 'bateria-mod5-l6', numero: 6, titulo: 'Aula 6 — Estilo Blues e Rock Clássico', subtitulo: 'Acompanhamento de blues tradicional', objetivo: 'Tocar blues na bateria', duracaoMinutos: 30 }
    ]
  },
  {
    id: 'bateria-mod-5',
    nome: 'Compassos Ímpares, Polirritmia e Alta Performance',
    instrumentId: 'bateria',
    nivel: 5,
    moduloNumero: 6,
    objetivoAcademico: 'Executar levadas em compassos ímpares (7/8, 5/4), polirritmias e solos de bateria.',
    competenciasDesenvolvidas: ['Compassos ímpares', 'Polirritmia 3 contra 2', 'Solos de bateria'],
    preRequisitos: ['Módulo 5 concluído.'],
    conteudos: ['Levadas em 7/8 e 5/8', 'Polirritmia (3:2 e 4:3)', 'Solos estruturados', 'Recital de bateria'],
    exerciciosPraticos: [{ titulo: 'Groove em 7/8 (2+2+3)', bpmAlvo: 80, instrucoes: 'Divisão clara do compasso ímpar', repeticoesAlvo: 16 }],
    criteriosDominio: ['Groove estável em 7/8 a 80 BPM e solo de 16 compassos.'],
    formaAvaliacao: 'Recital final de conservatório em bateria.',
    aulas: [
      { id: 'bateria-l-5-1', numero: 1, titulo: 'Compassos Ímpares: 7/8 e 5/8 na Prática', subtitulo: 'Dividindo o tempo de forma não usual', objetivo: 'Tocar em compassos ímpares', duracaoMinutos: 35 },
      { id: 'bateria-l-5-2', numero: 2, titulo: 'Polirritmia: O Conflito Rítmico Elegante (3 contra 2)', subtitulo: 'Mãos e pés em métricas cruzadas', objetivo: 'Executar polirritmias', duracaoMinutos: 35 },
      { id: 'bateria-l-5-3', numero: 3, titulo: 'Solos de Bateria: Construção, Clímax e Espaço', subtitulo: 'O baterista como solista', objetivo: 'Construir solos estruturados', duracaoMinutos: 35 },
      { id: 'bateria-mod6-l4', numero: 4, titulo: 'Aula 4 — O Estilo Metal e Hard Rock: Bumbo Duplo', subtitulo: 'Técnica de pedal duplo ou dois bumbos', objetivo: 'Iniciar técnica de bumbo duplo', duracaoMinutos: 30 },
      { id: 'bateria-mod6-l5', numero: 5, titulo: 'Aula 5 — Gravação em Estúdio e Microfonação da Bateria', subtitulo: 'O som da bateria na mixagem', objetivo: 'Conhecer captação de estúdio', duracaoMinutos: 25 },
      { id: 'bateria-mod6-l6', numero: 6, titulo: 'Aula 6 — Recital Solene de Formação em Bateria', subtitulo: 'Apresentação final de conservatório', objetivo: 'Concluir a formação percussiva', duracaoMinutos: 45 }
    ]
  },
  {
    id: 'bateria-mod-6',
    nome: 'Módulo 6 — Groove Avançado e Latin Jazz',
    instrumentId: 'bateria',
    nivel: 4,
    moduloNumero: 7,
    objetivoAcademico: 'Dominar ritmos afro-cubanos, bossa nova e groove latino na bateria.',
    competenciasDesenvolvidas: ['Ritmos latinos', 'Cascara e Clave', 'Bossa nova na bateria'],
    preRequisitos: ['Módulos 1 a 6 concluídos.'],
    conteudos: ['Clave de 3-2 e 2-3', 'Ritmo de bossa nova (rimshot e bumbo)', 'Samba e ritmos latinos aplicados'],
    exerciciosPraticos: [{ titulo: 'Groove de Bossa Nova no kit', bpmAlvo: 75, instrucoes: 'Rimshot constante e leveza', repeticoesAlvo: 12 }],
    criteriosDominio: ['Fluência em ritmos latinos e bossa nova a 75 BPM.'],
    formaAvaliacao: 'Gravação de ritmo latino.',
    aulas: [
      { id: 'bateria-mod7-l1', numero: 1, titulo: 'Aula 37 — O Universo dos Ritmos Afrolatinos', subtitulo: 'A clave e o compasso latino', objetivo: 'Compreender a clave latina', duracaoMinutos: 30 },
      { id: 'bateria-mod7-l2', numero: 2, titulo: 'Aula 38 — Bossa Nova na Bateria: O Toque Leve', subtitulo: 'Rimshot e bumbo no contratempo', objetivo: 'Tocar bossa nova na bateria', duracaoMinutos: 30 },
      { id: 'bateria-mod7-l3', numero: 3, titulo: 'Aula 39 — Samba e Baião no Kit Acústico', subtitulo: 'Ritmos brasileiros tradicionais', objetivo: 'Adaptar ritmos brasileiros', duracaoMinutos: 30 },
      { id: 'bateria-mod7-l4', numero: 4, titulo: 'Aula 40 — Afro-Cuban 6/8 e Bembe', subtitulo: 'Polirritmia afro-cubana', objetivo: 'Executar afro-cuban 6/8', duracaoMinutos: 30 },
      { id: 'bateria-mod7-l5', numero: 5, titulo: 'Aula 41 — Funk Latino e Boogaloo', subtitulo: 'Groove dançante com sotaque latino', objetivo: 'Tocar boogaloo', duracaoMinutos: 30 },
      { id: 'bateria-mod7-l6', numero: 6, titulo: 'Aula 42 — Independência Avançada em Ritmos Latinos', subtitulo: 'Mãos e pés em independência total', objetivo: 'Consolidar independência latina', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'bateria-mod-7',
    nome: 'Módulo 7 — Jazz Contemporâneo e Brush Work',
    instrumentId: 'bateria',
    nivel: 5,
    moduloNumero: 8,
    objetivoAcademico: 'Dominar a levada de jazz (swing ride), o uso de vassourinhas (brushes) e improvisação no jazz.',
    competenciasDesenvolvidas: ['Jazz swing ride', 'Brush work', 'Interação em trio de jazz'],
    preRequisitos: ['Módulo 7 concluído.'],
    conteudos: ['Swing em colcheias pontuadas (ding-da-ding)', 'Técnica de vassourinhas (legato e varredura)', 'Comping na caixa e bumbo livre'],
    exerciciosPraticos: [{ titulo: 'Swing ride com chimbal no 2 e 4', bpmAlvo: 100, instrucoes: 'Swing natural e leveza', repeticoesAlvo: 16 }],
    criteriosDominio: ['Swing de jazz constante e limpo a 100 BPM.'],
    formaAvaliacao: 'Banca de jazz e vassourinhas.',
    aulas: [
      { id: 'bateria-mod8-l1', numero: 1, titulo: 'Aula 43 — A Levada de Jazz: O Swing Ride (Ding-Da-Ding)', subtitulo: 'O pulso do jazz moderno', objetivo: 'Dominar o swing ride', duracaoMinutos: 30 },
      { id: 'bateria-mod8-l2', numero: 2, titulo: 'Aula 44 — Vassourinhas (Brush Work): O Som Aveludado', subtitulo: 'Técnica de varredura e legato', objetivo: 'Tocar com vassourinhas', duracaoMinutos: 35 },
      { id: 'bateria-mod8-l3', numero: 3, titulo: 'Aula 45 — Comping no Jazz: Diálogo com o Solista', subtitulo: 'Acentuações livres e reações rápidas', objetivo: 'Fazer comping no jazz', duracaoMinutos: 30 },
      { id: 'bateria-mod8-l4', numero: 4, titulo: 'Aula 46 — Troca de Solos de 4 em 4 Compassos (Fours)', subtitulo: 'Interação e conversa rítmica', objetivo: 'Tocar "fours" com o solista', duracaoMinutos: 30 },
      { id: 'bateria-mod8-l5', numero: 5, titulo: 'Aula 5 — Jazz em Andamentos Elevados (Up-Tempo)', subtitulo: 'Resistência e precisão em 220+ BPM', objetivo: 'Tocar jazz rápido', duracaoMinutos: 30 },
      { id: 'bateria-mod8-l6', numero: 6, titulo: 'Aula 48 — Repertório de Jazz Clássico e Moderno', subtitulo: 'Executando standards de jazz', objetivo: 'Interpretar jazz com maestria', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'bateria-mod-8',
    nome: 'Módulo 8 — Linear Drumming e Alta Tecnologia',
    instrumentId: 'bateria',
    nivel: 5,
    moduloNumero: 9,
    objetivoAcademico: 'Dominar o linear drumming (sem notas simultâneas), rudimentos aplicados ao kit e bateria eletrônica.',
    competenciasDesenvolvidas: ['Linear drumming', 'Rudimentos híbridos', 'Bateria eletrônica / triggers'],
    preRequisitos: ['Módulo 8 concluído.'],
    conteudos: ['Conceito de groove linear (Stanton Moore / Eric Moore)', 'Rudimentos híbridos (Flam paradiddle-diddle, Pataflafla)', 'Uso de triggers e pads eletrônicos'],
    exerciciosPraticos: [{ titulo: 'Groove linear em semicolcheias', bpmAlvo: 85, instrucoes: 'Zero notas tocadas ao mesmo tempo', repeticoesAlvo: 16 }],
    criteriosDominio: ['Fluência em grooves lineares a 85 BPM.'],
    formaAvaliacao: 'Apresentação de linear drumming.',
    aulas: [
      { id: 'bateria-mod9-l1', numero: 1, titulo: 'Aula 49 — O Conceito de Linear Drumming', subtitulo: 'Notas nunca tocadas simultaneamente', objetivo: 'Criar grooves lineares', duracaoMinutos: 30 },
      { id: 'bateria-mod9-l2', numero: 2, titulo: 'Aula 50 — Rudimentos Híbridos Aplicados ao Kit', subtitulo: 'Inovação e fluidez no set', objetivo: 'Aplicar rudimentos híbridos', duracaoMinutos: 35 },
      { id: 'bateria-mod9-l3', numero: 3, titulo: 'Aula 51 — Bateria Híbrida: Acústica com Eletrônica', subtitulo: 'Triggers, samplers e pads auxiliares', objetivo: 'Integrar pads eletrônicos', duracaoMinutos: 30 },
      { id: 'bateria-mod9-l4', numero: 4, titulo: 'Aula 52 — Independência Total de Membros (Four-Way Independence)', subtitulo: 'Mãos e pés totalmente independentes', objetivo: 'Atingir independência total', duracaoMinutos: 35 },
      { id: 'bateria-mod9-l5', numero: 5, titulo: 'Aula 53 — Saltos e Aberturas Rápidas pelo Kit', subtitulo: 'Agilidade em distâncias longas', objetivo: 'Movimentar-se com velocidade', duracaoMinutos: 30 },
      { id: 'bateria-mod9-l6', numero: 6, titulo: 'Aula 54 — Peças Solo de Alta Complexidade', subtitulo: 'Repertório virtuoso para bateria', objetivo: 'Executar solo complexo', duracaoMinutos: 35 }
    ]
  },
  {
    id: 'bateria-mod-9',
    nome: 'Módulo 9 — O Baterista de Estúdio e Diretor Rítmico',
    instrumentId: 'bateria',
    nivel: 5,
    moduloNumero: 10,
    objetivoAcademico: 'Preparar o baterista para gravações profissionais, cliques rígidos, arranjos e mercado fonográfico.',
    competenciasDesenvolvidas: ['Gravação profissional com click', 'Leitura de partitura rítmica', 'Arranjo de bateria'],
    preRequisitos: ['Módulo 9 concluído.'],
    conteudos: ['Tocando com click e guias de gravação', 'Leitura à primeira vista de partitura de bateria', 'Equipamentos, afinação do kit e gravação em estúdio'],
    exerciciosPraticos: [{ titulo: 'Leitura de arranjo rítmico inédito com click', bpmAlvo: 80, instrucoes: 'Precisão milimétrica', repeticoesAlvo: 8 }],
    criteriosDominio: ['Leitura e gravação de arranjo à primeira vista sem desvios do clique.'],
    formaAvaliacao: 'Banca profissional de estúdio.',
    aulas: [
      { id: 'bateria-mod10-l1', numero: 1, titulo: 'Aula 55 — O Baterista no Estúdio: Afinação do Kit', subtitulo: 'Tirando o som perfeito de cada tambor', objetivo: 'Afinar tambores profissionalmente', duracaoMinutos: 30 },
      { id: 'bateria-mod10-l2', numero: 2, titulo: 'Aula 56 — Domínio Absoluto do Click Track', subtitulo: 'Gravando com metrônomo sem rigidez robótica', objetivo: 'Tocar com click humanizado', duracaoMinutos: 35 },
      { id: 'bateria-mod10-l3', numero: 3, titulo: 'Aula 57 — Leitura de Partitura Rítmica Avançada', subtitulo: 'Decodificando charts e partituras de estúdio', objetivo: 'Ler partitura rítmica complexa', duracaoMinutos: 35 },
      { id: 'bateria-mod10-l4', numero: 4, titulo: 'Aula 58 — Arranjo de Bateria para Canções', subtitulo: 'Criando a batida ideal para cada música', objetivo: 'Arranjar bateria para banda', duracaoMinutos: 30 },
      { id: 'bateria-mod10-l5', numero: 5, titulo: 'Aula 59 — Ergonomia de Palco e Saúde do Baterista', subtitulo: 'Prevenção de lesões por esforço repetitivo (LER)', objetivo: 'Proteger a saúde física', duracaoMinutos: 25 },
      { id: 'bateria-mod10-l6', numero: 6, titulo: 'Aula 60 — Recital Solene de Formação em Bateria', subtitulo: 'Apresentação final de conservatório', objetivo: 'Concluir a formação percussiva profissional', duracaoMinutos: 45 }
    ]
  }
];

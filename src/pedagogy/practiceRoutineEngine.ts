import { UserProgress, PedagogicalProfile, AdaptiveRecommendation } from '../types';
import { CANONICAL_SKILLS, getAdaptiveRecommendation, createInitialPedagogicalProfile } from './adaptiveEngine';

export interface ExecutablePracticeExercise {
  id: string;
  skillId: string;
  category: 
    | 'Aquecimento & Postura'
    | 'Coordenação & Palhetada'
    | 'Troca de Acordes'
    | 'Precisão Rítmica & Metrônomo'
    | 'Pentatônica & Solos'
    | 'Harmonia Aplicada'
    | 'Revisão Espaçada';
  title: string;
  subtitle: string;
  durationMinutes: number;
  initialBpm: number;
  targetBpm: number;
  targetRepetitions: number;
  learningGoal: string;
  biomechanicsInstructions: string[];
  musicalSequence: string;
  tablatureText: string;
  successCriteria: string;
  simplificationStrategy: string;
  progressionStrategy: string;
  aiPromptTopic: string;
}

export interface GeneratedRoutine {
  durationMinutes: 5 | 10 | 15 | 30;
  level: number;
  priorityRationale: string;
  recommendation: AdaptiveRecommendation;
  exercises: ExecutablePracticeExercise[];
  totalEstimatedMinutes: number;
}

/**
 * Catálogo Canônico de Exercícios Práticos Executáveis para Guitarra Física
 */
export const PRACTICE_EXERCISE_CATALOG: Record<string, Omit<ExecutablePracticeExercise, 'durationMinutes'>> = {
  // 1. Sincronização e Palhetada Alternada
  'drill-alt-picking-1234': {
    id: 'drill-alt-picking-1234',
    skillId: 'skill-alternate-picking',
    category: 'Coordenação & Palhetada',
    title: 'Cromático 1-2-3-4 Rigoroso com Palhetada Alternada ↓ ↑',
    subtitle: 'Sincronia biomecânica de duas mãos e ângulo da palheta nas 6 cordas',
    initialBpm: 60,
    targetBpm: 80,
    targetRepetitions: 8,
    learningGoal: 'Eliminar movimentos redundantes, apoiar a polpa dos dedos rente ao traste e manter alternância estrita ↓ ↑ no pulso relaxado.',
    biomechanicsInstructions: [
      'Segure a palheta com 3 a 4 mm de ponta à mostra em ângulo de 45° em relação ao plano das cordas.',
      'O movimento do ataque deve partir estritamente do pulso (como girar a chave de uma fechadura), nunca do cotovelo ou ombro.',
      'Deixe os dedos anteriores descansando na corda conforme avança para criar ancoragem e estabilidade motora.'
    ],
    musicalSequence: '6ª à 1ª corda: casas 1, 2, 3, 4 com dedos 1, 2, 3, 4',
    tablatureText: `e|---------------------------------1-2-3-4-|
B|-------------------------1-2-3-4---------|
G|-----------------1-2-3-4-----------------|
D|---------1-2-3-4-------------------------|
A|-1-2-3-4---------------------------------|
E|-1-2-3-4---------------------------------|
   ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑`,
    successCriteria: 'Todas as notas soam cristalinas, sem trastejamento e exatamente no clique do metrônomo.',
    simplificationStrategy: 'Se travar, reduza para 50 BPM e treine apenas na 6ª e 5ª cordas antes de percorrer todas as 6 cordas.',
    progressionStrategy: 'Ao completar 4 passagens perfeitas a 60 BPM, suba +5 BPM no Speed Trainer até alcançar 80 BPM.',
    aiPromptTopic: 'Palhetada alternada e relaxamento muscular',
  },

  // 2. Aquecimento e Alongamento
  'drill-warmup-spider': {
    id: 'drill-warmup-spider',
    skillId: 'skill-alternate-picking',
    category: 'Aquecimento & Postura',
    title: 'Aquecimento Progressivo e Coordenação Cruzada 1-3-2-4',
    subtitle: 'Despertar neuromuscular dos 4 dedos e alinhamento do polegar atrás do braço',
    initialBpm: 60,
    targetBpm: 75,
    targetRepetitions: 6,
    learningGoal: 'Ativar a circulação e flexibilidade dos tendões da mão esquerda evitando lesões e preparando para o treino.',
    biomechanicsInstructions: [
      'Respire fundo e mantenha a coluna alinhada; a guitarra deve repousar estável sobre a perna sem apoiar peso nos braços.',
      'Polegar repousando na metade traseira do braço da guitarra, na altura do dedo 2 (médio).',
      'Dedos curvados como pequenas garras redondas atingindo as cordas com a ponta.'
    ],
    musicalSequence: 'Cordas 6 e 5: padrão de saltos de dedo 1-3-2-4 nas casas 5 a 8',
    tablatureText: `A|---------5---7---6---8-|
E|-5---7---6---8---------|
   D1  D3  D2  D4  D1  D3  D2  D4
   ↓   ↑   ↓   ↑   ↓   ↑   ↓   ↑`,
    successCriteria: 'Movimentos econômicos com os dedos nunca se afastando mais de 1,5 cm das cordas.',
    simplificationStrategy: 'Execute em andamento livre sem metrônomo nos primeiros 2 minutos apenas focando no relaxamento.',
    progressionStrategy: 'Aumente o metrônomo em +5 BPM quando a mão estiver totalmente aquecida e sem rigidez.',
    aiPromptTopic: 'Postura biomecânica e aquecimento para guitarra',
  },

  // 3. Troca Limpa de Acordes Worship e Extensões
  'drill-worship-anchor-chords': {
    id: 'drill-worship-anchor-chords',
    skillId: 'skill-worship-chords',
    category: 'Troca de Acordes',
    title: 'Transições Worship com Âncora Fixa: G -> Cadd9 -> Em7 -> Dsus4',
    subtitle: 'Dedos 3 e 4 ancorados permanentemente na casa 3 das cordas 1 e 2',
    initialBpm: 65,
    targetBpm: 85,
    targetRepetitions: 10,
    learningGoal: 'Construir trocas de acordes instantâneas no ar sem interromper a mão da palheta rítmica.',
    biomechanicsInstructions: [
      'Os dedos 3 e 4 NUNCA se levantam: funcionam como o pivô de equilíbrio de toda a mão.',
      'Ao mudar de G para Cadd9, desça os dedos 1 e 2 exatamente uma corda em paralelo.',
      'A mão direita deve balançar como um pêndulo ininterrupto mesmo durante a fração de segundo da troca.'
    ],
    musicalSequence: 'Compasso 1: G | Compasso 2: Cadd9 | Compasso 3: Em7 | Compasso 4: Dsus4 (4 tempos cada)',
    tablatureText: `   G (c.1)           Cadd9 (c.2)       Em7 (c.3)         Dsus4 (c.4)
e|-3---------------|-3---------------|-3---------------|-3---------------|
B|-3---------------|-3---------------|-3---------------|-3---------------|
G|-0---------------|-0---------------|-0---------------|-2---------------|
D|-0---------------|-2---------------|-2---------------|-0---------------|
A|-2---------------|-3---------------|-2---------------|-----------------|
E|-3---------------|-----------------|-0---------------|-----------------|
   (Dedos 3 e 4 travados na casa 3 durante os 4 acordes)`,
    successCriteria: 'Todas as notas soam abertas e limpas sem abafamento acidental e sem atrasos no tempo 1 de cada compasso.',
    simplificationStrategy: 'Pratique apenas a troca entre G e Cadd9 em loop contínuo até os dedos 1 e 2 descerem automaticamente.',
    progressionStrategy: 'Aplique a levada rítmica universal Down - DownUp - Up - DownUp a 80 BPM.',
    aiPromptTopic: 'Acordes de worship e técnicas de ancoragem',
  },

  // 4. Trocas de Acordes Pop/Rock Fundamentais
  'drill-open-chords-cgd': {
    id: 'drill-open-chords-cgd',
    skillId: 'skill-open-chords-c-g-d',
    category: 'Troca de Acordes',
    title: 'O Triângulo Pop/Rock: Trocas Contínuas C -> G -> D',
    subtitle: 'Antecipação motora no ar e limpeza do som corda por corda',
    initialBpm: 60,
    targetBpm: 80,
    targetRepetitions: 8,
    learningGoal: 'Dominar a mudança entre Dó Maior, Sol Maior e Ré Maior sem pausas ou silêncios entre os compassos.',
    biomechanicsInstructions: [
      'Monte a forma do acorde "no ar" antes de encostar os dedos na escala.',
      'No acorde D (Ré Maior), use o dedo 3 como guia na 2ª corda.',
      'Palhete C a partir da 5ª corda, G em todas as 6, e D a partir da 4ª corda.'
    ],
    musicalSequence: 'C (4 tempos) -> G (4 tempos) -> D (4 tempos) -> C (4 tempos)',
    tablatureText: `   C                 G                 D                 C
e|-0---------------|-3---------------|-2---------------|-0---------------|
B|-1---------------|-0---------------|-3---------------|-1---------------|
G|-0---------------|-0---------------|-2---------------|-0---------------|
D|-2---------------|-0---------------|-0---------------|-2---------------|
A|-3---------------|-2---------------|-----------------|-3---------------|
E|-----------------|-3---------------|-----------------|-----------------|`,
    successCriteria: 'Transição no ar com a mão direita mantendo 4 batidas constantes por compasso.',
    simplificationStrategy: 'Se o C para G for difícil, toque 2 batidas e use os tempos 3 e 4 para mover a mão suavemente.',
    progressionStrategy: 'Ao atingir 75 BPM limpo, substitua por dedilhados arpejados corda a corda.',
    aiPromptTopic: 'Transição rápida de acordes abertos',
  },

  // 5. Precisão Rítmica com Metrônomo
  'drill-rhythm-subdivisions': {
    id: 'drill-rhythm-subdivisions',
    skillId: 'skill-metronome-44',
    category: 'Precisão Rítmica & Metrônomo',
    title: 'Controle Métrico: Semínimas vs Colcheias a 60, 70 e 80 BPM',
    subtitle: 'Pulsação interna, acentuação no tempo 1 e divisão 1 e 2 e 3 e 4 e',
    initialBpm: 60,
    targetBpm: 80,
    targetRepetitions: 10,
    learningGoal: 'Internalizar a pulsação do metrônomo para que o clique coincida perfeitamente com a palhetada física.',
    biomechanicsInstructions: [
      'Bata o pé suavemente no chão acompanhando cada clique do metrônomo.',
      'Nas semínimas: palhetada para baixo (↓) cravada no centro do clique.',
      'Nas colcheias: palheta desce no número (↓) e sobe no "e" (↑).'
    ],
    musicalSequence: 'Compasso 1 (Semínimas na 6ª corda) | Compasso 2 (Colcheias na 5ª corda)',
    tablatureText: `Compasso 1 (Semínimas):        Compasso 2 (Colcheias):
E|-0-----0-----0-----0---|     A|-0-0---0-0---0-0---0-0-|
   ↓     ↓     ↓     ↓            ↓ ↑   ↓ ↑   ↓ ↑   ↓ ↑
   1     2     3     4            1 e   2 e   3 e   4 e`,
    successCriteria: 'O clique do metrônomo parece desaparecer no momento do ataque da palheta de tão sincronizado.',
    simplificationStrategy: 'Toque apenas as semínimas por 3 minutos antes de tentar a divisão em colcheias.',
    progressionStrategy: 'Suba o andamento no metrônomo de 60 para 70 e depois 80 BPM sem perder a estabilidade.',
    aiPromptTopic: 'Treino rítmico e precisão métrica com metrônomo',
  },

  // 6. Levada Rítmica Universal
  'drill-universal-groove': {
    id: 'drill-universal-groove',
    skillId: 'skill-strumming-grooves',
    category: 'Precisão Rítmica & Metrônomo',
    title: 'A Levada Universal com Acentuação nos Tempos 2 e 4',
    subtitle: 'Padrão rítmico pop/worship: Down - DownUp - Up - DownUp a 80 BPM',
    initialBpm: 70,
    targetBpm: 90,
    targetRepetitions: 10,
    learningGoal: 'Desenvolver a pegada rítmica moderna de acompanhamento com dinâmicas expressivas e acentos no backbeat.',
    biomechanicsInstructions: [
      'Mantenha a mão da palheta balançando em pêndulo contínuo.',
      'No tempo 3, a mão desce no ar sem tocar as cordas (palhetada fantasma) e ataca para cima no contratempo.',
      'Acentue os tempos 2 e 4 com firmeza simulando a caixa da bateria.'
    ],
    musicalSequence: 'Levada universal aplicada sobre progressão G -> Cadd9',
    tablatureText: `Tempo:   1   e   2   e   3   e   4   e
Palheta: ↓       ↓   ↑       ↑   ↓   ↑
Acento:          !               !`,
    successCriteria: 'O ritmo soa musical, dançante e sem rigidez ou pausas involuntárias.',
    simplificationStrategy: 'Abefe as cordas com a mão esquerda e treine o padrão rítmico como um instrumento de percussão primeiro.',
    progressionStrategy: 'Acelere gradualmente até 90 BPM e alterne entre dinâmicas suave (verso) e forte (refrão).',
    aiPromptTopic: 'Levada rítmica universal e acentuações',
  },

  // 7. Escala Pentatônica Menor Padrão 1
  'drill-penta-pos1-flow': {
    id: 'drill-penta-pos1-flow',
    skillId: 'skill-pentatonic-pos1',
    category: 'Pentatônica & Solos',
    title: 'Escala Pentatônica de Lá Menor — Padrão 1 Subindo e Descendo',
    subtitle: 'As 12 notas em duas oitavas com palhetada alternada e identificação das 3 tônicas',
    initialBpm: 60,
    targetBpm: 80,
    targetRepetitions: 8,
    learningGoal: 'Construir a memória muscular do shape fundamental da pentatônica e localizar as 3 tônicas Lá (A) na 5ª casa.',
    biomechanicsInstructions: [
      'Cordas 6, 2 e 1: dedos 1 e 4 (indicador e mínimo).',
      'Cordas 5, 4 e 3: dedos 1 e 3 (indicador e anelar).',
      'Palhetada rigorosamente alternada ↓ ↑ ↓ ↑ em toda a extensão.'
    ],
    musicalSequence: 'Subida da 6ª à 1ª corda e descida imediata da 1ª à 6ª corda a 60 BPM',
    tablatureText: `e|----------------------------------5-8-|-8-5----------------------------------|
B|------------------------------5-8-|-----8-5------------------------------|
G|--------------------------5-7-----|---------7-5--------------------------|
D|----------------------5-7---------|-------------7-5----------------------|
A|------------------5-7-------------|-----------------7-5------------------|
E|--5-8-----------------------------|---------------------8-5--------------|
    (Tônica Lá na 6ª c.5, 4ª c.7 e 1ª c.5)`,
    successCriteria: 'Sonoridade homogênea em todas as notas sem que nenhuma saia mais fraca ou engasgada.',
    simplificationStrategy: 'Pratique apenas a subida nas 3 primeiras cordas graves antes de completar a escala inteira.',
    progressionStrategy: 'Toque de olhos fechados para consolidar a autonomia tátil sem olhar para o braço.',
    aiPromptTopic: 'Escala pentatônica menor e memorização de digitação',
  },

  // 8. Conexão de Posições e Criação de Frases
  'drill-penta-connection-slide': {
    id: 'drill-penta-connection-slide',
    skillId: 'skill-caged-pentatonic',
    category: 'Pentatônica & Solos',
    title: 'Conexão P1 -> P2 por Slide Horizontal e Resolução na Tônica',
    subtitle: 'Deslizando da casa 7 para a casa 9 na 3ª corda para navegar pelo braço',
    initialBpm: 65,
    targetBpm: 80,
    targetRepetitions: 8,
    learningGoal: 'Romper a barreira de tocar preso em uma única caixa e criar frases melódicas fluidas ao longo do braço.',
    biomechanicsInstructions: [
      'Use o dedo 3 para palhetar a casa 7 da 3ª corda e deslizar (slide) até a casa 9 com sustentação.',
      'Mantenha a pressão da polpa do dedo durante o deslocamento horizontal.',
      'Finalize repousando na tônica Lá na 2ª corda casa 10 com vibrato controlado.'
    ],
    musicalSequence: '4ª corda c.7 (A) -> 3ª corda c.5-7 / slide até 9 -> 2ª corda c.8-10 (A)',
    tablatureText: `B|--------------------------------------8---10~~(A)-|
G|-----------------5---7---/---9-------------------|
D|-------7(A)--------------------------------------|
         D3        D1  D3 ---- D3      D1   D3 (Vibrato!)`,
    successCriteria: 'O slide soa suave como a voz humana, sem interrupção de som entre a casa 7 e a casa 9.',
    simplificationStrategy: 'Treine o movimento de slide isoladamente na 3ª corda até o som não morrer na viagem.',
    progressionStrategy: 'Crie uma pequena frase de 4 compassos resolvendo nessa nota Lá sobre uma base harmônica.',
    aiPromptTopic: 'Conexão de escalas pentatônicas e slides melódicos',
  },

  // 9. Técnica Expressiva: Bends e Vibrato
  'drill-expressive-bend-vibrato': {
    id: 'drill-expressive-bend-vibrato',
    skillId: 'skill-expressive-solo',
    category: 'Pentatônica & Solos',
    title: 'Afinação de Bend de 1 Tom e Sustentação com Vibrato Estável',
    subtitle: 'A mecânica dos 3 dedos de reforço e rotação do punho na 2ª corda',
    initialBpm: 60,
    targetBpm: 75,
    targetRepetitions: 10,
    learningGoal: 'Aprender a afinar o bend auditivamente e controlar o vibrato expressivo no topo da nota.',
    biomechanicsInstructions: [
      'Apoie os dedos 1 e 2 na mesma corda atrás do dedo 3: a força dos 3 dedos juntos protege os tendões.',
      'Gire o punho como quem abre uma maçaneta; não empurre a corda flexionando a ponta do dedo.',
      'No vibrato: faça uma oscilação suave e rítmica sem afobação.'
    ],
    musicalSequence: '2ª corda casa 10 (ouvir nota Lá) -> 2ª corda casa 8 (subir bend de 1 tom até igualar a nota Lá)',
    tablatureText: `Passo 1 (Referência Auditiva):
B|--10(A)-----------| (Toque e memorize a nota-alvo)

Passo 2 (Execução com 3 Dedos):
B|--8b10~~----------| (Palhete no 8 e suba até soar idêntico ao 10 com vibrato!)`,
    successCriteria: 'A afinação da nota empurrada coincide 100% com a nota de referência da casa 10.',
    simplificationStrategy: 'Treine primeiro meio tom (bend da casa 9 para a casa 10) para acostumar o ouvido e os dedos.',
    progressionStrategy: 'Aplique o bend dentro do Padrão 1 da Pentatônica ao improvisar sobre Am.',
    aiPromptTopic: 'Técnica de bends, afinação auditiva e vibrato',
  },

  // 10. Harmonia Aplicada: Cadência II-V-I
  'drill-harmony-251-cadence': {
    id: 'drill-harmony-251-cadence',
    skillId: 'skill-harmonic-field',
    category: 'Harmonia Aplicada',
    title: 'A Cadência Mestra II - V - I em Dó Maior (Dm7 -> G7 -> C7M)',
    subtitle: 'Subdominante, Tensão do Trítono e Resolução Tônica na guitarra',
    initialBpm: 65,
    targetBpm: 80,
    targetRepetitions: 8,
    learningGoal: 'Compreender como a tensão do grau V (G7) se resolve no repouso do grau I (C7M) sentindo as funções harmônicas.',
    biomechanicsInstructions: [
      'Monte Dm7 suavemente com meia-pestana do dedo 1 nas cordas 1 e 2.',
      'No G7, sinta a atração magnética da nota Fá (corda 1 c.1) querendo descer para o Mi (corda 1 solta) no C7M.',
      'Mantenha dinâmica acústica leve e elegante.'
    ],
    musicalSequence: 'Dm7 (1 compasso) -> G7 (1 compasso) -> C7M (2 compassos de repouso)',
    tablatureText: `   Dm7 (ii)          G7 (V)            C7M (I - Resolução)
e|-1---------------|-1---------------|-0---------------|
B|-1---------------|-0---------------|-0---------------|
G|-2---------------|-0---------------|-0---------------|
D|-0---------------|-0---------------|-2---------------|
A|-----------------|-2---------------|-3---------------|
E|-----------------|-3---------------|-----------------|`,
    successCriteria: 'Resolução sonora nítida com as quatro notas de cada tétrade audíveis.',
    simplificationStrategy: 'Toque apenas as 3 cordas mais agudas de cada tétrade para focar na condução melódica.',
    progressionStrategy: 'Transponha a mesma cadência para o tom de Sol Maior (Am7 -> D7 -> G7M).',
    aiPromptTopic: 'Campo harmônico e cadências II-V-I na guitarra',
  },

  // 11. As Cinco Posições Conectadas da Pentatônica Menor com Tônicas Mapeadas (Fase 5.1)
  'drill-penta-5-positions-system': {
    id: 'drill-penta-5-positions-system',
    skillId: 'skill-caged-pentatonic',
    category: 'Pentatônica & Solos',
    title: 'As 5 Posições Conectadas da Pentatônica Menor com Tônicas Mapeadas',
    subtitle: 'Navegação horizontal e vertical pelos 5 shapes de Am com localização das tônicas Lá',
    initialBpm: 60,
    targetBpm: 80,
    targetRepetitions: 8,
    learningGoal: 'Conectar mental e fisicamente os 5 formatos da pentatônica menor de Lá ao longo de todo o braço físico, identificando as tônicas Lá em cada formato (c.5 na 6ª e 1ª; c.7 na 4ª; c.10 na 2ª e 5ª; c.12 na 3ª e 6ª; c.14 na 4ª).',
    biomechanicsInstructions: [
      'Padrão 1 (casas 5-8): dedo 1 na casa 5 com tônica Lá nas cordas 6 e 1.',
      'Padrão 2 (casas 7-10): dedo 1 na casa 7 com tônica Lá na 4ª corda casa 7 e 2ª corda casa 10.',
      'Padrão 3 (casas 9-12): dedo 1 na casa 9 com tônica Lá na 5ª corda casa 12 e 2ª corda casa 10.',
      'Padrão 4 (casas 12-15): dedo 1 na casa 12 com tônica Lá na 5ª corda casa 12 e 3ª corda casa 14.',
      'Padrão 5 (casas 14-17 / casas 2-5): tônica Lá na 4ª corda casa 14 e 6ª corda casa 17 (ou casa 5).',
      'Deslize o dedo 3 entre os padrões para conectar as posições sem perder o andamento métrico.'
    ],
    musicalSequence: 'P1 (c.5-8) -> Slide -> P2 (c.7-10) -> Slide -> P3 (c.9-12) -> P4 (c.12-14) -> Resolução na tônica Lá',
    tablatureText: `e|--------------------------------------------------10--12-(A)-|
B|----------------------------------------8--10(A)--------------|
G|-------------------------5--7(A)-/--9-------------------------|
D|-----------5--7(A)--------------------------------------------|
A|-----5--7-----------------------------------------------------|
E|--5(A)--------------------------------------------------------|
    [P1 c.5]               [P2 c.7-9]     [P3 c.10]       [P4 c.12]
    *Tônicas Lá (A): 6ª c.5 | 4ª c.7 | 2ª c.10 | 1ª c.12 (oitava)`,
    successCriteria: 'Transição suave entre posições sem hesitação motora ou perda da referência de onde estão as notas tônicas Lá.',
    simplificationStrategy: 'Isole a transição entre duas posições adjacentes por vez (P1 para P2 primeiro, depois P2 para P3).',
    progressionStrategy: 'Ao dominar em Lá Menor (Am), transponha o sistema completo para Mi Menor (Em iniciando na casa 12 ou cordas soltas).',
    aiPromptTopic: 'As 5 posições da escala pentatônica menor e conexão horizontal',
  },

  // 12. Tétrades e Campo Harmônico Aplicados com Resolução de Vozes (Fase 5.1)
  'drill-tetrads-harmonic-field-comping': {
    id: 'drill-tetrads-harmonic-field-comping',
    skillId: 'skill-harmonic-field',
    category: 'Harmonia Aplicada',
    title: 'Tétrades e Campo Harmônico na Prática: C7M - Am7 - Dm7 - G7',
    subtitle: 'Condução harmônica em cordas centrais (4, 3, 2, 1) com voicings modernos e resolução de notas guia (3ª e 7ª)',
    initialBpm: 60,
    targetBpm: 75,
    targetRepetitions: 8,
    learningGoal: 'Aplicar as tétrades do campo harmônico maior em uma situação real de acompanhamento musical, escutando o movimento melódico suave das notas guia entre graus I, VI, II e V.',
    biomechanicsInstructions: [
      'Economia de movimento: os acordes utilizam formatos compactos nas 4 primeiras cordas, sem necessidade de esticar a mão.',
      'No C7M, o Si (7M) sobe meio tom para Dó no compasso ou desce meio tom para Si bemol se for dominante.',
      'No Dm7 -> G7, observe a nota Dó (7ª do Dm7) descendo meio tom para Si (3ª do G7): este é o clássico movimento de resolução harmônica.',
      'Palhete com polegar e dedos ou palheta alternada abafada (hybrid picking).'
    ],
    musicalSequence: 'Compasso 1: C7M (I) | Compasso 2: Am7 (vi) | Compasso 3: Dm7 (ii) | Compasso 4: G7 (V)',
    tablatureText: `   C7M (I)           Am7 (vi)          Dm7 (ii)          G7 (V)
e|-0---------------|-0---------------|-1---------------|-1---------------|
B|-0---------------|-1---------------|-1---------------|-0---------------|
G|-0---------------|-0---------------|-2---------------|-0---------------|
D|-2---------------|-2---------------|-0---------------|-0---------------|
A|-3---------------|-0---------------|-----------------|-2---------------|
E|-----------------|-----------------|-----------------|-3---------------|
   [3ª=E, 7M=B]      [3ª=C, 7m=G]      [3ª=F, 7m=C]      [3ª=B, 7m=F (Trítono!)]`,
    successCriteria: 'Todas as notas das 4 tétrades soam perfeitamente audíveis, com ataque limpo e condução sem buracos sonoros.',
    simplificationStrategy: 'Toque apenas no tempo 1 de cada compasso deixando soar os 4 tempos antes de arriscar levadas com swing.',
    progressionStrategy: 'Substitua os voicings abertos por tétrades fechadas no meio do braço (casas 5 a 8).',
    aiPromptTopic: 'Tétrades, notas guia e condução de vozes no campo harmônico',
  },

  // 13. Condução Harmônica e Dinâmica Worship com Baixo Invertido F# (Fase 5.1)
  'drill-worship-harmonic-flow-dynamics': {
    id: 'drill-worship-harmonic-flow-dynamics',
    skillId: 'skill-worship-chords',
    category: 'Troca de Acordes',
    title: 'Condução Harmônica e Dinâmica Worship: G -> D/F# -> Em7 -> C9',
    subtitle: 'Baixo caminhando no F# com dedo 1 e transição dinâmica do dedilhado ao palm-mute e levada cheia',
    initialBpm: 68,
    targetBpm: 82,
    targetRepetitions: 10,
    learningGoal: 'Dominar a clássica progressão de louvor moderno (I - V - VIm - IV) com linha de baixo descendente (Sol -> Fá# -> Mi -> Dó) mantendo os agudos brilhantes nas cordas 1 e 2.',
    biomechanicsInstructions: [
      'No acorde D/F#, use o polegar sobre o braço (thumb over) OU o dedo 1 na 6ª corda casa 2 abafando a 5ª corda suavemente com a lateral.',
      'Dedos 3 e 4 permanecem na casa 3 das cordas 1 e 2 em todos os 4 acordes, garantindo sustentação harmônica característica.',
      'Dinâmica de 3 estágios: Ciclo 1 a 3 (dedilhado suave) -> Ciclo 4 a 6 (palm mute com palhetada para baixo em colcheias) -> Ciclo 7 a 10 (levada aberta vibrante no refrão).'
    ],
    musicalSequence: 'G (4 tempos) -> D/F# (4 tempos) -> Em7 (4 tempos) -> C9 (4 tempos)',
    tablatureText: `   G                 D/F#              Em7               C9 (Cadd9)
e|-3---------------|-3---------------|-3---------------|-3---------------|
B|-3---------------|-3---------------|-3---------------|-3---------------|
G|-0---------------|-2---------------|-0---------------|-0---------------|
D|-0---------------|-0---------------|-2---------------|-2---------------|
A|-2---------------|-x (abafada)-----|-2---------------|-3---------------|
E|-3 (Baixo Sol)---|-2 (Baixo Fá#!)--|-0 (Baixo Mi)----|-----------------|
   [Dedos 3 e 4 fixos na casa 3 nas cordas 1 e 2 durante toda a progressão]`,
    successCriteria: 'A nota F# na 6ª corda soa limpa e afinada sem abafar acidentalmente a 4ª e 3ª cordas soltas, e a dinâmica cresce sem acelerar o andamento.',
    simplificationStrategy: 'Toque D com baixo na 4ª corda solta primeiro, e após sentir o ritmo incorpore o baixo no F#.',
    progressionStrategy: 'Adicione atrasos sutis de palhetada (strumming delay) e acentos na caixa no tempo 2 e 4 conforme a intensidade sobe.',
    aiPromptTopic: 'Condução harmônica em louvores e acordes com baixo invertido',
  },
};

/**
 * MOTOR DE GERAÇÃO DETERMINÍSTICA DA ROTINA DE PRÁTICA (Fase 5)
 * Constrói a rotina a partir do tempo escolhido (5, 10, 15 ou 30 min),
 * do perfil de habilidades, das revisões pendentes e da recomendação adaptativa ativa.
 */
export function generatePracticeRoutine(
  durationMinutes: 5 | 10 | 15 | 30,
  progress: UserProgress
): GeneratedRoutine {
  const profile = progress.pedagogicalProfile || createInitialPedagogicalProfile();
  const level = progress.studyPlan?.selectedLevel ?? 0;
  const recommendation = getAdaptiveRecommendation(profile, progress);

  // 1. Identifica se há revisão espaçada pendente
  const pendingReviewSkill = Object.values(profile.skills).find(
    (s) => s.nextReviewDate && s.nextReviewDate <= new Date().toISOString().split('T')[0]
  );

  // 2. Identifica se há habilidade fraca com erros recorrentes
  const weakSkill = Object.values(profile.skills).find(
    (s) => Object.values(s.recurringErrors).some((count) => count >= 2)
  );

  const selectedExercises: ExecutablePracticeExercise[] = [];

  // ==========================================
  // CONFIGURAÇÃO POR TEMPO ESCOLHIDO
  // ==========================================

  if (durationMinutes === 5) {
    // SESSÃO EXPRESS (5 min): 2 exercícios cirúrgicos
    // Etapa 1: Aquecimento rápido / mecânica (2 min)
    selectedExercises.push({
      ...PRACTICE_EXERCISE_CATALOG['drill-alt-picking-1234'],
      durationMinutes: 2,
      targetRepetitions: 4,
    });

    // Etapa 2: Foco prioritário do dia baseado na recomendação (3 min)
    if (level >= 2) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-penta-pos1-flow'],
        durationMinutes: 3,
        targetRepetitions: 5,
      });
    } else {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-worship-anchor-chords'],
        durationMinutes: 3,
        targetRepetitions: 5,
      });
    }
  } else if (durationMinutes === 10) {
    // SESSÃO RÁPIDA (10 min): 3 exercícios fundamentais
    // Etapa 1: Aquecimento e postura (2 min)
    selectedExercises.push({
      ...PRACTICE_EXERCISE_CATALOG['drill-warmup-spider'],
      durationMinutes: 2,
      targetRepetitions: 4,
    });

    // Etapa 2: Mecânica e palhetada alternada (4 min)
    selectedExercises.push({
      ...PRACTICE_EXERCISE_CATALOG['drill-alt-picking-1234'],
      durationMinutes: 4,
      targetRepetitions: 6,
    });

    // Etapa 3: Aplicação de acordes ou solos conforme nível (4 min)
    if (level >= 2) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-penta-pos1-flow'],
        durationMinutes: 4,
        targetRepetitions: 6,
      });
    } else {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-worship-anchor-chords'],
        durationMinutes: 4,
        targetRepetitions: 6,
      });
    }
  } else if (durationMinutes === 15) {
    // SESSÃO PADRÃO (15 min): 4 exercícios estruturados
    // Etapa 1: Aquecimento neuromuscular (3 min)
    selectedExercises.push({
      ...PRACTICE_EXERCISE_CATALOG['drill-warmup-spider'],
      durationMinutes: 3,
      targetRepetitions: 5,
    });

    // Etapa 2: Palhetada alternada e coordenação (4 min)
    selectedExercises.push({
      ...PRACTICE_EXERCISE_CATALOG['drill-alt-picking-1234'],
      durationMinutes: 4,
      targetRepetitions: 8,
    });

    // Etapa 3: Ritmo com metrônomo ou troca de acordes (4 min)
    if (weakSkill && weakSkill.category === 'chord_shapes') {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-open-chords-cgd'],
        durationMinutes: 4,
        targetRepetitions: 6,
      });
    } else {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-rhythm-subdivisions'],
        durationMinutes: 4,
        targetRepetitions: 8,
      });
    }

    // Etapa 4: Aplicação musical / solo ou worship (4 min)
    if (level >= 3) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-penta-5-positions-system'],
        durationMinutes: 4,
        targetRepetitions: 6,
      });
    } else if (level >= 2) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-penta-connection-slide'],
        durationMinutes: 4,
        targetRepetitions: 6,
      });
    } else {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-worship-harmonic-flow-dynamics'],
        durationMinutes: 4,
        targetRepetitions: 8,
      });
    }
  } else {
    // SESSÃO COMPLETA (30 min): 5 exercícios profundos
    // Etapa 1: Alongamento e aquecimento biomecânico (4 min)
    selectedExercises.push({
      ...PRACTICE_EXERCISE_CATALOG['drill-warmup-spider'],
      durationMinutes: 4,
      targetRepetitions: 6,
    });

    // Etapa 2: Palhetada alternada e Speed Trainer (6 min)
    selectedExercises.push({
      ...PRACTICE_EXERCISE_CATALOG['drill-alt-picking-1234'],
      durationMinutes: 6,
      targetRepetitions: 10,
    });

    // Etapa 3: Precisão métrica no metrônomo (6 min)
    selectedExercises.push({
      ...PRACTICE_EXERCISE_CATALOG['drill-rhythm-subdivisions'],
      durationMinutes: 6,
      targetRepetitions: 10,
    });

    // Etapa 4: Foco harmônico ou melódico (7 min)
    if (level >= 4) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-tetrads-harmonic-field-comping'],
        durationMinutes: 7,
        targetRepetitions: 8,
      });
    } else if (level >= 3) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-harmony-251-cadence'],
        durationMinutes: 7,
        targetRepetitions: 8,
      });
    } else if (level >= 2) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-expressive-bend-vibrato'],
        durationMinutes: 7,
        targetRepetitions: 8,
      });
    } else {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-worship-harmonic-flow-dynamics'],
        durationMinutes: 7,
        targetRepetitions: 10,
      });
    }

    // Etapa 5: Improvisação, repertório ou revisão pendente (7 min)
    if (pendingReviewSkill) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-universal-groove'],
        durationMinutes: 7,
        targetRepetitions: 8,
        title: `Revisão Espaçada: ${pendingReviewSkill.name}`,
        subtitle: 'Fixação de memória muscular e validação de retenção a longo prazo',
      });
    } else if (level >= 3) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-penta-5-positions-system'],
        durationMinutes: 7,
        targetRepetitions: 8,
      });
    } else if (level >= 2) {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-penta-connection-slide'],
        durationMinutes: 7,
        targetRepetitions: 8,
      });
    } else {
      selectedExercises.push({
        ...PRACTICE_EXERCISE_CATALOG['drill-universal-groove'],
        durationMinutes: 7,
        targetRepetitions: 10,
      });
    }
  }

  const totalMins = selectedExercises.reduce((acc, ex) => acc + ex.durationMinutes, 0);

  const priorityRationale = pendingReviewSkill
    ? `Revisão espaçada recomendada para "${pendingReviewSkill.name}". A rotina foi adaptada com foco em retenção e precisão física.`
    : weakSkill
    ? `Ajuste para correção de pontos fracos em "${weakSkill.name}". Foco na limpeza motora e redução de velocidade.`
    : recommendation.rationale;

  return {
    durationMinutes,
    level,
    priorityRationale,
    recommendation,
    exercises: selectedExercises,
    totalEstimatedMinutes: totalMins,
  };
}

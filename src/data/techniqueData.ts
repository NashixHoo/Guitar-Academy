export interface GuitarTechnique {
  id: string;
  name: string;
  category: 'Mão Direita' | 'Mão Esquerda' | 'Expressão e Articulação';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  explanation: string;
  keyPoints: string[];
  commonMistakes: string[];
  recommendedBpmStart: number;
  recommendedBpmGoal: number;
  exerciseTab: string;
}

export const GUITAR_TECHNIQUES: GuitarTechnique[] = [
  {
    id: 'alternate-picking',
    name: 'Palhetada Alternada (Strict Alternate Picking)',
    category: 'Mão Direita',
    difficulty: 'Iniciante',
    explanation: 'A fundação da velocidade e precisão. Cada nota para baixo (↓) deve ser rigorosamente seguida por uma nota para cima (↑), independentemente de estar na mesma corda ou mudando de corda.',
    keyPoints: [
      'Movimento originado primordialmente do punho relaxado, nunca do cotovelo ou dos dedos.',
      'Ângulo de ataque da palheta em cerca de 45° em relação à corda para deslizar sem prender.',
      'Mantenha a amplitude do movimento o menor possível para economizar energia.',
    ],
    commonMistakes: [
      'Fazer dois movimentos seguidos para baixo ao mudar de corda (economizando palheta antes da hora).',
      'Tensionar os músculos do ombro ou do antebraço.',
      'Palhetar com muita profundidade nas cordas.',
    ],
    recommendedBpmStart: 60,
    recommendedBpmGoal: 130,
    exerciseTab: `
    ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑   ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑
E|------------------|-----------------|
B|------------------|-----------------|
G|------------------|-----------------|
D|------------------|---------1-2-3-4-|
A|---------1-2-3-4--|-1-2-3-4---------|
E|-1-2-3-4----------|-----------------|
    `,
  },
  {
    id: 'hammer-pull',
    name: 'Ligados (Hammer-on e Pull-off)',
    category: 'Mão Esquerda',
    difficulty: 'Iniciante',
    explanation: 'Produzir notas adicionais sem utilizar a palheta para cada uma: Hammer-on (martelar com precisão como um martelinho) e Pull-off (beliscar a corda com a polpa do dedo na descida).',
    keyPoints: [
      'O Hammer-on exige pontaria firme próximo ao traste.',
      'O Pull-off não é apenas levantar o dedo: é uma leve puxadinha/beliscão para baixo para fazer a corda vibrar.',
      'O volume das notas ligadas deve ser equilibrado com o das notas palhetadas.',
    ],
    commonMistakes: [
      'Acertar a corda vizinha durante o pull-off gerando ruído indesejado.',
      'Martelar o dedo sem energia suficiente, resultando em volume muito baixo.',
    ],
    recommendedBpmStart: 70,
    recommendedBpmGoal: 120,
    exerciseTab: `
   h  p  h  p  h  p     h  p  h  p
E|-------------------|-----------------|
B|-5h7p5-5h7p5-5h7p5-|-5h8p5-5h8p5-----|
G|-------------------|-----------------|
D|-------------------|-----------------|
A|-------------------|-----------------|
E|-------------------|-----------------|
    `,
  },
  {
    id: 'bends',
    name: 'Bends (Meio Tom e Tom Inteiro)',
    category: 'Expressão e Articulação',
    difficulty: 'Intermediário',
    explanation: 'Empurrar a corda para cima contra o braço para elevar a sua altura tonal até atingir uma nota-alvo com precisão de afinação.',
    keyPoints: [
      'Use 3 dedos juntos para empurrar (os dedos 1 e 2 apoiam e dão força ao dedo 3).',
      'A força vem do giro do punho e do antebraço como girar uma maçaneta, não da flexão isolada dos dedos.',
      'Sempre ouça a nota-alvo antes para conferir se o bend chegou 100% na afinação exata.',
    ],
    commonMistakes: [
      'Ficar abaixo da afinação (under-bend) ou ultrapassar a nota (over-bend).',
      'Tentar empurrar com apenas um único dedo, causando instabilidade e fadiga.',
    ],
    recommendedBpmStart: 60,
    recommendedBpmGoal: 100,
    exerciseTab: `
    Bend 1 Tom (7 alcança o tom da casa 9)
E|-------------------------------------|
B|--7b9--(9)r7---5---------------------|
G|------------------7------------------|
D|-------------------------------------|
A|-------------------------------------|
E|-------------------------------------|
    `,
  },
  {
    id: 'vibrato',
    name: 'Vibrato Vocal e Expressivo',
    category: 'Expressão e Articulação',
    difficulty: 'Intermediário',
    explanation: 'A assinatura sonora de qualquer guitarrista. Uma modulação periódica e rítmica da afinação que imita o canto de um vocalista.',
    keyPoints: [
      'O vibrato para cima e para baixo deve ser uniforme e ritmado com a pulsação da música.',
      'Mantenha o polegar firmemente ancorado na parte superior do braço para servir de eixo.',
      'Nunca vibre antes de atingir a sustentação e firmeza inicial da nota.',
    ],
    commonMistakes: [
      'Vibrato espasmódico e rápido demais ("mosquito"), demonstrando nervosismo.',
      'Desafinar a nota central durante o ciclo de oscilação.',
    ],
    recommendedBpmStart: 50,
    recommendedBpmGoal: 90,
    exerciseTab: `
    Nota sustentada com vibrato amplo (~)
E|-------------------------------------|
B|--8~~~-------------------------------|
G|---------7~~~------------------------|
D|-----------------7~~~----------------|
A|-------------------------------------|
E|-------------------------------------|
    `,
  },
  {
    id: 'slides',
    name: 'Slides (Glissando Ascendente e Descendente)',
    category: 'Mão Esquerda',
    difficulty: 'Iniciante',
    explanation: 'Deslizar o dedo mantendo a pressão sobre a corda de uma casa para outra, conectando notas de forma fluida.',
    keyPoints: [
      'Mantenha pressão constante enquanto o dedo desliza sobre as casas.',
      'Pare exatamente antes do traste da casa de destino.',
    ],
    commonMistakes: [
      'Aliviar o contato e deixar o som morrer no meio do caminho.',
      'Ultrapassar a casa pretendida por excesso de velocidade.',
    ],
    recommendedBpmStart: 70,
    recommendedBpmGoal: 120,
    exerciseTab: `
    Slide / (subida) e \\ (descida)
E|-------------------------------------|
B|--5/7--7/9--9/12--12\\9--9\\7----------|
G|-------------------------------------|
D|-------------------------------------|
A|-------------------------------------|
E|-------------------------------------|
    `,
  },
  {
    id: 'tapping',
    name: 'Tapping a Duas Mãos',
    category: 'Mão Direita',
    difficulty: 'Avançado',
    explanation: 'Usar o indicador ou médio da mão direita diretamente no braço como um martelo adicional, criando arpejos de alta velocidade inalcançáveis só com a mão esquerda.',
    keyPoints: [
      'Bater com firmeza perpendicularmente ao traste com a ponta ou lateral do dedo da mão direita.',
      'Executar um pull-off ligeiro ao retirar a mão direita para ativar as notas da mão esquerda.',
      'Abafar as cordas graves com a palma da mão direita para não emitir ruídos soltos.',
    ],
    commonMistakes: [
      'Ruídos nas cordas não tocadas por falta de amortecimento com a palma.',
      'Diferença brutal de volume entre o tap da mão direita e os ligados da mão esquerda.',
    ],
    recommendedBpmStart: 70,
    recommendedBpmGoal: 130,
    exerciseTab: `
    T = Tap mão direita (casa 12)
      T       T       T
E|--12p8p5--12p8p5--12p8p5-------------|
B|-------------------------------------|
G|-------------------------------------|
D|-------------------------------------|
A|-------------------------------------|
E|-------------------------------------|
    `,
  }
];

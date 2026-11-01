import { ViolaoCourseModule } from '../types';

// =========================================================================
// GUITAR ACADEMY — DOMÍNIO TOTAL DO VIOLÃO
// Módulos 4 a 6 (Aulas 19 a 36)
// =========================================================================

export const VIOLAO_MODULES_4_TO_6: ViolaoCourseModule[] = [
  // =======================================================================
  // MÓDULO 4 — ACORDES SUSPENSOS, TÉTRADES E ACORDES COM SÉTIMA (Aulas 19 a 24)
  // =======================================================================
  {
    id: 'violao-mod-4',
    moduleNumber: 4,
    title: 'Acordes Suspensos, Tétrades e Acordes com Sétima',
    subtitle: 'Da suspensão emotiva (sus2/sus4) às tétrades sofisticadas (maj7, m7, 7, add9, dim)',
    badge: 'Módulo 4 • Harmonia Estendida',
    description: 'Aprofunde o vocabulário harmônico do violão acústico. Aprenda a substituir a 3ª por 2ª ou 4ª, adicione a 7ª maior, menor e dominante, e domine sonoridades ricas como add9 e acordes diminutos.',
    lessons: [
      {
        id: 'violao-lesson-19',
        level: 2,
        moduleTitle: 'Módulo 4 • Suspensos e Tétrades',
        moduleNumber: 4,
        lessonNumber: 19,
        title: 'Sus2 e Sus4: Tensão e Resolução no Violão Acústico',
        subtitle: 'Como a substituição da 3ª cria antecipação e movimento melódico dentro do acorde',
        objective: 'Dominar os acordes suspensos (Csus2, Csus4, Dsus2, Dsus4, Asus2, Asus4), compreendendo a ausência de terça e o movimento de resolução harmônica.',
        estimatedMinutes: 25,
        prerequisites: ['Acordes abertos naturais dominados (C, D, A, E, G).'],
        parts: [
          {
            id: 'vl19-p1',
            title: '1. O Que É um Acorde Suspenso?',
            contentMarkdown: `### A Suspensão da Terça
Em um acorde convencional, a terça (maior ou menor) define se o acorde é alegre ou triste. Nos acordes suspensos:
* **Sus2:** Substituímos a 3ª pela 2ª Maior (Fórmula: 1 - 2 - 5). Sonoridade etérea, aberta, serena.
* **Sus4:** Substituímos a 3ª pela 4ª Justa (Fórmula: 1 - 4 - 5). Tensão clássica que pede resolução imediata na 3ª Maior.
No violão acústico, acordes suspensos permitem criar melodias internas na mão esquerda enquanto o ritmo continua na mão direita.`
          },
          {
            id: 'vl19-p2',
            title: '2. Digitações Essenciais de Dsus2, Dsus4, Asus2, Asus4',
            contentMarkdown: `### Movimento de Um Único Dedo
* **De D para Dsus4 e Dsus2:**
  - D: [-1, -1, 0, 2, 3, 2]
  - Dsus4: adicione o dedo 4 na casa 3 da corda 1 (G) -> [-1, -1, 0, 2, 3, 3]
  - Dsus2: solte o dedo 2, deixando a corda 1 solta (E) -> [-1, -1, 0, 2, 3, 0]
* **De A para Asus4 e Asus2:**
  - A: [-1, 0, 2, 2, 2, 0]
  - Asus4: avance a corda 2 para a casa 3 (D) -> [-1, 0, 2, 2, 3, 0]
  - Asus2: solte a corda 2 para a casa 0 (B) -> [-1, 0, 2, 2, 0, 0]`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Dsus4',
            namePt: 'Ré Suspenso com Quarta',
            formula: '1 - 4 - 5',
            notes: ['D', 'G', 'A'],
            notesPt: ['Ré', 'Sol', 'Lá'],
            frets: [-1, -1, 0, 2, 3, 3],
            fingers: [0, 0, 0, 1, 3, 4],
            openStrings: [4],
            avoidStrings: [6, 5],
            tips: 'Dedo 4 na casa 3 da 1ª corda. O dedo 3 permanece firme na casa 3 da corda 2.',
            category: 'Suspenso'
          },
          {
            symbol: 'Dsus2',
            namePt: 'Ré Suspenso com Segunda',
            formula: '1 - 2 - 5',
            notes: ['D', 'E', 'A'],
            notesPt: ['Ré', 'Mi', 'Lá'],
            frets: [-1, -1, 0, 2, 3, 0],
            fingers: [0, 0, 0, 1, 3, 0],
            openStrings: [4, 1],
            avoidStrings: [6, 5],
            tips: 'Apenas solte o dedo da 1ª corda deixando-a soar solta (Mi aguda).',
            category: 'Suspenso'
          },
          {
            symbol: 'Asus4',
            namePt: 'Lá Suspenso com Quarta',
            formula: '1 - 4 - 5',
            notes: ['A', 'D', 'E'],
            notesPt: ['Lá', 'Ré', 'Mi'],
            frets: [-1, 0, 2, 2, 3, 0],
            fingers: [0, 0, 1, 2, 4, 0],
            openStrings: [5, 1],
            avoidStrings: [6],
            tips: 'Use o dedo 4 para alcançar a casa 3 da 2ª corda com a ponta em arco.',
            category: 'Suspenso'
          }
        ],
        practicalExercise: {
          title: 'Exercício 19 — O Ciclo Clássico D - Dsus4 - D - Dsus2',
          subtitle: 'Movimento ornamental fluido na primeira corda',
          targetBpm: 70,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Batida com polegar e indicador ou dedilhado P-I-M-A',
          notesSequence: [
            { stringNumber: 1, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'down', fret: 2 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 1, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'down', fret: 2 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `e|--2---2---3---3---2---2---0---0--|
B|--3---3---3---3---3---3---3---3--|
G|--2---2---2---2---2---2---2---2--|
D|--0---0---0---0---0---0---0---0--|
A|---------------------------------|
E|---------------------------------|
    D       Dsus4   D       Dsus2`,
          instructions: [
            'Mantenha o dedo 3 fixo na casa 3 da corda B durante todo o compasso.',
            'Mexa exclusivamente os dedos que tocam a 1ª corda: dedo 2 (casa 2), dedo 4 (casa 3) e corda solta.'
          ],
          biomechanicTips: [
            'Evite levantar o dedo 1 ou 3; estabilize a mão na posição do acorde Ré.'
          ],
          validationCriteria: 'Executar a sequência sem cortes no som da corda 2 e 3.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Estilo Folk/Rock Acústico',
          description: 'A assinatura sonora de clássicos de Pink Floyd, The Who e Neil Young no violão de cordas de aço e nylon.',
          tab: `e|----2-----3-----2-----0---|
B|------3-----3-----3-----3-|
G|--2-----2-----2-----2-----|
D|--0-----------------------|
A|--------------------------|
E|--------------------------|`
        },
        commonErrors: [
          { issue: 'O dedo 3 encostar e abafar a 1ª corda.', solution: 'Mantenha a última falange do dedo 3 rigorosamente perpendicular à escala.' }
        ],
        challenge: {
          title: 'Desafio Suspenso',
          description: 'Crie uma progressão alternando A - Asus4 - A - Asus2 e depois D - Dsus4 - D - Dsus2.',
          instruction: 'Grave ou pratique 4 repetições contínuas a 72 BPM com metrônomo.'
        },
        masteryCriteria: {
          learning: 'Reconhece a diferença auditiva entre 3ª, 2ª e 4ª.',
          consolidating: 'Alterna D, Dsus4 e Dsus2 sem interrupção rítmica.',
          mastered: 'Aplica acordes suspensos espontaneamente em qualquer levada pop ou folk.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 80, targetBpm: 100 },
        reviewNotes: 'Os acordes suspensos adicionam lirismo imediato a qualquer progressão acústica básica.'
      },
      {
        id: 'violao-lesson-20',
        level: 2,
        moduleTitle: 'Módulo 4 • Suspensos e Tétrades',
        moduleNumber: 4,
        lessonNumber: 20,
        title: 'Tétrades Maiores (maj7) no Violão',
        subtitle: 'A elegância serena da 7ª maior: Cmaj7, Gmaj7, Fmaj7 e Amaj7',
        objective: 'Dominar a formação e digitação aberta e semi-aberta dos acordes com 7ª maior (Fórmula: 1 - 3 - 5 - 7), compreendendo a textura harmônica da bossa, jazz e MPB.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 19 e domínio de C, G e Fmaj7/C.'],
        parts: [
          {
            id: 'vl20-p1',
            title: '1. O Intervalo de 7ª Maior (7M / maj7)',
            contentMarkdown: `### 1 Semitom Abaixo da Oitava
A 7ª Maior está a exatamente 1 semitom (1 casa) abaixo da tônica oitavada.
* Exemplo em C: Tônica C (oitava). A nota 1 semitom abaixo é **B** (Si).
* Logo, Cmaj7 = C - E - G - B (Dó, Mi, Sol, Si).
* No violão, para transformar C em Cmaj7, basta soltar o dedo 1 da 2ª corda (casa 1 = Dó), fazendo soar a corda solta B!`
          },
          {
            id: 'vl20-p2',
            title: '2. Digitações Abertas Mágicas de maj7',
            contentMarkdown: `* **Cmaj7:** [-1, 3, 2, 0, 0, 0] — Apenas dois dedos (3 e 2), deixando as cordas 3, 2 e 1 vibrarem soltas.
* **Gmaj7:** [3, x, 0, 0, 0, 2] ou [3, 2, 0, 0, 0, 2] — Dedo 1 na casa 2 da 1ª corda (F#).
* **Fmaj7:** [-1, -1, 3, 2, 1, 0] — O acorde perfeito para quem ainda não domina a pestana de Fá!`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Cmaj7',
            namePt: 'Dó Maior com Sétima Maior',
            formula: '1 - 3 - 5 - 7',
            notes: ['C', 'E', 'G', 'B'],
            notesPt: ['Dó', 'Mi', 'Sol', 'Si'],
            frets: [-1, 3, 2, 0, 0, 0],
            fingers: [0, 3, 2, 0, 0, 0],
            openStrings: [3, 2, 1],
            avoidStrings: [6],
            tips: 'Toque da 5ª corda para baixo. Repare na ressonância das 3 cordas soltas.',
            category: 'Tétrade'
          },
          {
            symbol: 'Fmaj7',
            namePt: 'Fá Maior com Sétima Maior',
            formula: '1 - 3 - 5 - 7',
            notes: ['F', 'A', 'C', 'E'],
            notesPt: ['Fá', 'Lá', 'Dó', 'Mi'],
            frets: [-1, -1, 3, 2, 1, 0],
            fingers: [0, 0, 3, 2, 1, 0],
            openStrings: [1],
            avoidStrings: [6, 5],
            tips: 'A 1ª corda solta é a nota Mi, que adiciona a 7ª Maior ao Fá.',
            category: 'Tétrade'
          }
        ],
        practicalExercise: {
          title: 'Exercício 20 — Transição Suave Cmaj7 - Fmaj7',
          subtitle: 'A cadência clássica do violão lírico',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado P - I - M - A com baixo firme',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|------0---------0---------0---------0---|
B|----0---0-----0---0-----1---1-----1---1-|
G|--0-------0-0-------0-2-------2-2-------|
D|--------------------3---------3---------|
A|--3---------3---------------------------|
E|----------------------------------------|
    Cmaj7               Fmaj7`,
          instructions: [
            'No Cmaj7, sinta o contraste entre a nota C no baixo e as cordas B e E soando soltas.',
            'Na mudança para Fmaj7, os dedos 3 e 2 descem juntos uma corda (para D e G) e o dedo 1 entra na casa 1.'
          ],
          biomechanicTips: [
            'Mantenha o punho relaxado. Não aperte o polegar atrás do braço com força excessiva.'
          ],
          validationCriteria: 'Todas as cordas soltas e pressionadas soando com clareza cristalina.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Clima da Bossa Nova e MPB',
          description: 'A sonoridade refinada de "Garota de Ipanema" e das grandes canções acústicas brasileiras.',
          tab: `e|----0---0-------0---0---|
B|----0---0-------1---1---|
G|----0---0-------2---2---|
D|----2---2-----3---3-----|
A|--3---3-----------------|
E|------------------------|`
        },
        commonErrors: [
          { issue: 'Abafar a 1ª corda solta no Fmaj7.', solution: 'Curve o dedo 1 bem na ponta para permitir que a corda E vibre livremente.' }
        ],
        challenge: {
          title: 'Desafio Ouvido de Ouro',
          description: 'Toque um C tradicional e em seguida Cmaj7. Descreva a mudança de atmosfera e sensação emocional.',
          instruction: 'Perceba como C é conclusivo e assertivo, enquanto Cmaj7 é reflexivo e cinematográfico.'
        },
        masteryCriteria: {
          learning: 'Compreende a fórmula 1-3-5-7.',
          consolidating: 'Alterna Cmaj7 e Fmaj7 com fluidez rítmica.',
          mastered: 'Usa tétrades maj7 com intenção expressiva em qualquer arranjo.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'O acorde maj7 é o portal de entrada para a harmonia rica e sofisticada no violão.'
      },
      {
        id: 'violao-lesson-21',
        level: 2,
        moduleTitle: 'Módulo 4 • Suspensos e Tétrades',
        moduleNumber: 4,
        lessonNumber: 21,
        title: 'Tétrades Menores (m7) e a Expressividade Acústica',
        subtitle: 'A leveza melancólica dos acordes menores com sétima: Am7, Em7, Dm7 e Bm7',
        objective: 'Dominar as digitações abertas dos acordes m7 (Fórmula: 1 - b3 - 5 - b7), compreendendo o alívio de tensão e a economia de dedos no braço.',
        estimatedMinutes: 25,
        prerequisites: ['Acordes menores básicos (Am, Em, Dm).'],
        parts: [
          {
            id: 'vl21-p1',
            title: '1. A Fórmula do Acorde Menor com Sétima (m7)',
            contentMarkdown: `### 1 - b3 - 5 - b7
A 7ª menor está a 2 semitons (1 tom inteiro) abaixo da tônica.
* **Em7:** Em = E - G - B. Adicionando a nota D (7ª menor) temos: E - G - B - D.
  - Digitação aberta inacreditável: basta 1 dedo! [-1, 2, 0, 0, 0, 0] ou até mesmo a variante com 4 dedos [0, 2, 2, 0, 3, 3].
* **Am7:** Am = A - C - E. Adicionando a nota G (7ª menor) temos: A - C - E - G.
  - Digitação aberta: solte o dedo 3 do Am! [-1, 0, 2, 0, 1, 0] (basta 2 dedos!).`
          },
          {
            id: 'vl21-p2',
            title: '2. Por Que o m7 Soa Tão Bem no Violão Acústico?',
            contentMarkdown: `Ao remover um dedo de Am ou Em para criar Am7 ou Em7, você ganha cordas soltas ressoando. No violão acústico, as cordas soltas vibram por simpatia com a caixa de madeira, gerando sustain prolongado e uma sonoridade aveludada ideal para dedilhados.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Am7',
            namePt: 'Lá Menor com Sétima',
            formula: '1 - b3 - 5 - b7',
            notes: ['A', 'C', 'E', 'G'],
            notesPt: ['Lá', 'Dó', 'Mi', 'Sol'],
            frets: [-1, 0, 2, 0, 1, 0],
            fingers: [0, 0, 2, 0, 1, 0],
            openStrings: [5, 3, 1],
            avoidStrings: [6],
            tips: 'Apenas dedos 2 e 1. A 3ª corda solta é a nota Sol (7ª menor).',
            category: 'Tétrade'
          },
          {
            symbol: 'Em7',
            namePt: 'Mi Menor com Sétima',
            formula: '1 - b3 - 5 - b7',
            notes: ['E', 'G', 'B', 'D'],
            notesPt: ['Mi', 'Sol', 'Si', 'Ré'],
            frets: [0, 2, 2, 0, 3, 3],
            fingers: [0, 1, 2, 0, 3, 4],
            openStrings: [6, 3],
            tips: 'Formato moderno: dedos 3 e 4 nas cordas 2 e 1 casa 3, dando brilho extraordinário.',
            category: 'Tétrade'
          }
        ],
        practicalExercise: {
          title: 'Exercício 21 — Conexão Suave Em7 - Am7 - Dm7',
          subtitle: 'A progressão menor lírica no violão',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado P-I-M-A fluido',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `e|------3-----------0-----------1---|
B|----3---3-------1---1-------1---1-|
G|--0-------0---0-------0---2-------|
D|------------2-----------0---------|
A|----------------------------------|
E|--0-------------------------------|
    Em7         Am7         Dm7`,
          instructions: [
            'Foque na precisão do baixo de cada acorde: E (corda 6), A (corda 5) e D (corda 4).',
            'Sinta como o acorde menor com sétima é muito mais suave e moderno que a tríade menor pura.'
          ],
          biomechanicTips: [
            'Não levante a mão além de 1 cm da escala nas transições.'
          ],
          validationCriteria: 'Mudança de acorde a tempo com o metrônomo sem atrasar o baixo.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O R&B, Pop e Soul Acústico',
          description: 'A base dos maiores sucessos de Ed Sheeran, John Mayer e da bossa nova moderna.',
          tab: `e|----3---3-------0---0---|
B|----3---3-------1---1---|
G|----0---0-------0---0---|
D|----2---2-------2---2---|
A|--------------0---------|
E|--0---------------------|`
        },
        commonErrors: [
          { issue: 'Pressionar cordas que deveriam sobrar soltas.', solution: 'Mantenha os dedos arqueados para que a 3ª corda solta do Am7 ressoe com pureza.' }
        ],
        challenge: {
          title: 'Desafio Economia de Dedos',
          description: 'Toque Am e tire o dedo 3 para fazer Am7; toque Em e monte Em7 com apenas 1 dedo. Sinta a economia física.',
          instruction: 'Constate como a harmonia avançada muitas vezes exige MENOS esforço físico que a harmonia básica.'
        },
        masteryCriteria: {
          learning: 'Distingue m de m7 de ouvido.',
          consolidating: 'Executa Em7, Am7 e Dm7 com postura relaxada.',
          mastered: 'Aplica m7 em substituição a qualquer tríade menor em repertório real.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 80, targetBpm: 95 },
        reviewNotes: 'As tétrades menores abrem caminho para levadas elegantes e dedilhados contemporâneos.'
      },
      {
        id: 'violao-lesson-22',
        level: 2,
        moduleTitle: 'Módulo 4 • Suspensos e Tétrades',
        moduleNumber: 4,
        lessonNumber: 22,
        title: 'Acordes Dominantes (7) e Tensão Harmônica',
        subtitle: 'A força do trítono e a atração gravitacional para a tônica: G7, C7, D7, A7, E7 e B7',
        objective: 'Compreender a estrutura do acorde dominante (1 - 3 - 5 - b7), o intervalo de trítono entre 3ª maior e 7ª menor, e sua resolução na tônica.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 20 e 21.'],
        parts: [
          {
            id: 'vl22-p1',
            title: '1. O Motor da Harmonia Tonal: O Trítono',
            contentMarkdown: `### 3 Tons Inteiros de Tensão
No acorde dominante (ex: G7 = G - B - D - F):
* A 3ª maior é **B**.
* A 7ª menor é **F**.
* A distância entre B e F é de exatamente 3 tons inteiros (**trítono** ou quinta diminuta).
* Esse intervalo cria uma instabilidade acústica que "pede" resolução: o B quer subir meio-tom para C, e o F quer descer meio-tom para E. Por isso o G7 resolve com tanta força no acorde de C!`
          },
          {
            id: 'vl22-p2',
            title: '2. Digitações Abertas dos Dominantes',
            contentMarkdown: `* **G7:** [3, 2, 0, 0, 0, 1] — Dedo 1 na casa 1 da corda 1 (F).
* **C7:** [-1, 3, 2, 3, 1, 0] — Adicione o dedo 4 na casa 3 da corda 3 (Bb).
* **D7:** [-1, -1, 0, 2, 1, 2] — Triângulo invertido.
* **A7:** [-1, 0, 2, 0, 2, 0] — Apenas dois dedos com a 3ª corda solta (G).
* **E7:** [0, 2, 0, 1, 0, 0] — Apenas dois dedos com a 4ª corda solta (D).`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'G7',
            namePt: 'Sol Maior com Sétima Dominante',
            formula: '1 - 3 - 5 - b7',
            notes: ['G', 'B', 'D', 'F'],
            notesPt: ['Sol', 'Si', 'Ré', 'Fá'],
            frets: [3, 2, 0, 0, 0, 1],
            fingers: [3, 2, 0, 0, 0, 1],
            openStrings: [4, 3, 2],
            tips: 'Dedo 1 na casa 1 da 1ª corda, dedo 3 no baixo na casa 3 da 6ª corda.',
            category: 'Dominante'
          },
          {
            symbol: 'C7',
            namePt: 'Dó Maior com Sétima Dominante',
            formula: '1 - 3 - 5 - b7',
            notes: ['C', 'E', 'G', 'Bb'],
            notesPt: ['Dó', 'Mi', 'Sol', 'Si Bemol'],
            frets: [-1, 3, 2, 3, 1, 0],
            fingers: [0, 3, 2, 4, 1, 0],
            openStrings: [1],
            avoidStrings: [6],
            tips: 'Monte o C comum e adicione o dedo 4 na casa 3 da 3ª corda.',
            category: 'Dominante'
          },
          {
            symbol: 'A7',
            namePt: 'Lá Maior com Sétima Dominante',
            formula: '1 - 3 - 5 - b7',
            notes: ['A', 'C#', 'E', 'G'],
            notesPt: ['Lá', 'Dó Sustenido', 'Mi', 'Sol'],
            frets: [-1, 0, 2, 0, 2, 0],
            fingers: [0, 0, 2, 0, 3, 0],
            openStrings: [5, 3, 1],
            avoidStrings: [6],
            tips: 'Deixe a corda Sol vibrar livremente no centro do acorde.',
            category: 'Dominante'
          }
        ],
        practicalExercise: {
          title: 'Exercício 22 — A Resolução Arquetípica G7 -> C',
          subtitle: 'Sentindo a física da tensão e do repouso',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar no baixo e toque simultâneo dos dedos I-M-A',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|----1-------1-------0-------0---|
B|----0-------0-------1-------1---|
G|----0-------0-------0-------0---|
D|--------------------2-------2---|
A|------------------3-------3-----|
E|--3-------3---------------------|
    G7 (Tensão)     C (Repouso)`,
          instructions: [
            'Toque o G7 e sinta o anseio pela conclusão.',
            'Ao tocar o C, perceba o alívio e a sensação de "chegar em casa".'
          ],
          biomechanicTips: [
            'Na troca do G7 para o C, os dedos 2 e 3 descem uma corda juntos.'
          ],
          validationCriteria: 'Resolução no tempo 1 do compasso seguinte com clareza absoluta.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Blues Acústico e o Choro',
          description: 'A base dos 12 compassos do blues acústico tradicional (E7 - A7 - B7).',
          tab: `e|--0---0---0---0---0---0---0---0--|
B|--0---0---0---0---2---2---2---2--|
G|--1---1---1---1---0---0---0---0--|
D|--0---0---0---0---2---2---2---2--|
A|--2---2---2---2---0---0---0---0--|
E|--0---0---0---0------------------|
    E7              A7`
        },
        commonErrors: [
          { issue: 'Tocar a 6ª corda solta no C7.', solution: 'Mute a 6ª corda suavemente com a ponta do dedo 3.' }
        ],
        challenge: {
          title: 'Desafio do Blues em Mi',
          description: 'Toque uma roda de blues usando exclusivamente E7, A7 e B7.',
          instruction: 'Use uma levada rítmica com swing (shuffle acústico).'
        },
        masteryCriteria: {
          learning: 'Identifica o trítono do dominante.',
          consolidating: 'Alterna dominantes abertos com precisão e tempo firme.',
          mastered: 'Aplica dominantes secundários intuitivamente para preparar acordes de destino.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 80, targetBpm: 100 },
        reviewNotes: 'O acorde dominante é a mola propulsora que dá movimento dinâmico à música ocidental.'
      },
      {
        id: 'violao-lesson-23',
        level: 2,
        moduleTitle: 'Módulo 4 • Suspensos e Tétrades',
        moduleNumber: 4,
        lessonNumber: 23,
        title: 'Acordes com Nona (add9 e 9) e o Brilho Moderno',
        subtitle: 'A adição da 9ª maior: Cadd9, Gadd9, Dadd9, Aadd9 e Em9',
        objective: 'Dominar os acordes com 9ª adicionada (add9 = 1 - 3 - 5 - 9) e com 7ª e 9ª (9 = 1 - 3 - 5 - b7 - 9), compreendendo a assinatura sonora do violão acústico contemporâneo.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 18 e 19.'],
        parts: [
          {
            id: 'vl23-p1',
            title: '1. Diferença entre add9 e 9',
            contentMarkdown: `### A Presença ou Ausência da Sétima
* **add9 (Nona Adicionada):** Tríade básica (1 - 3 - 5) + 9ª Maior. Não tem 7ª!
  - Soa límpido, brilhante, cinematográfico, pop e sereno.
  - Exemplo: Cadd9 = C - E - G - D.
* **9 (Acorde com Nona):** Tétrade dominante (1 - 3 - 5 - b7) + 9ª Maior.
  - Soa funky, bluesy, sofisticado, bossa nova.
  - Exemplo: C9 = C - E - G - Bb - D.`
          },
          {
            id: 'vl23-p2',
            title: '2. A Famosa "Âncora" do Violão Pop Moderno',
            contentMarkdown: `### Os Dedos 3 e 4 Travados na Casa 3
Ao manter o dedo 3 na casa 3 da corda 2 (nota Ré) e o dedo 4 na casa 3 da corda 1 (nota Sol), você pode transitar entre:
* **G:** [3, 2, 0, 0, 3, 3]
* **Cadd9:** [-1, 3, 2, 0, 3, 3]
* **Em7:** [0, 2, 2, 0, 3, 3]
* **Dsus4:** [-1, -1, 0, 2, 3, 3]
Essa é a progressão de acordes mais tocada da história da música pop moderna!`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Cadd9',
            namePt: 'Dó Maior com Nona Adicionada',
            formula: '1 - 3 - 5 - 9',
            notes: ['C', 'E', 'G', 'D'],
            notesPt: ['Dó', 'Mi', 'Sol', 'Ré'],
            frets: [-1, 3, 2, 0, 3, 3],
            fingers: [0, 2, 1, 0, 3, 4],
            openStrings: [3],
            avoidStrings: [6],
            tips: 'Dedos 3 e 4 firmes na casa 3 das cordas agudas. O som brilha intensamente.',
            category: 'Estendido'
          },
          {
            symbol: 'Aadd9',
            namePt: 'Lá Maior com Nona Adicionada',
            formula: '1 - 3 - 5 - 9',
            notes: ['A', 'C#', 'E', 'B'],
            notesPt: ['Lá', 'Dó Sustenido', 'Mi', 'Si'],
            frets: [-1, 0, 2, 4, 2, 0],
            fingers: [0, 0, 1, 3, 2, 0],
            openStrings: [5, 1],
            avoidStrings: [6],
            tips: 'Dedo 3 na casa 4 da corda 3 (nota Si, que é a 9ª Maior).',
            category: 'Estendido'
          }
        ],
        practicalExercise: {
          title: 'Exercício 23 — A Conexão Âncora G - Cadd9 - Em7 - Dsus4',
          subtitle: 'A progressão definitiva de violão pop',
          targetBpm: 75,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Batida rítmica pop: Baixo - Baixo - Cima - Cima - Baixo - Cima',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `e|--3---3---3---3---3---3---3---3--|
B|--3---3---3---3---3---3---3---3--|
G|--0---0---0---0---0---0---2---2--|
D|--0---0---2---2---2---2---0---0--|
A|--2---2---3---3---2---2----------|
E|--3---3-----------0---0----------|
    G       Cadd9   Em7     Dsus4`,
          instructions: [
            'NUNCA tire os dedos 3 e 4 da escala.',
            'Apenas movimente os dedos 1 e 2 para trocar a raiz do acorde.'
          ],
          biomechanicTips: [
            'Esse exercício desenvolve a independência dos dedos 1 e 2 em relação aos dedos 3 e 4.'
          ],
          validationCriteria: 'Transições sem ruído ou interrupção rítmica a 75 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Som de Wonderwall e Good Riddance',
          description: 'A fundação das grandes canções acústicas de Oasis, Green Day e Guns N Roses.',
          tab: `e|------3-------3-------3-------3---|
B|----3---3---3---3---3---3---3---3-|
G|--0-------0-------0-------2-------|
D|--------------------------0-------|
A|----------3-----------------------|
E|--3---------------0---------------|`
        },
        commonErrors: [
          { issue: 'Levantar os dedos 3 e 4 durante as trocas.', solution: 'Cole mentalmente os dedos 3 e 4 na madeira; eles são sua âncora fixa.' }
        ],
        challenge: {
          title: 'Desafio 1 Minuto Sem Tirar a Âncora',
          description: 'Cronometre 60 segundos alternando continuamente entre os 4 acordes sem desgrudar os dedos 3 e 4.',
          instruction: 'Conte quantas repetições perfeitas do ciclo você completa.'
        },
        masteryCriteria: {
          learning: 'Monta Cadd9 e entende a nona.',
          consolidating: 'Alterna a progressão âncora com ritmo constante.',
          mastered: 'Aplica acordes add9 em arranjos próprios com dedilhados dinâmicos.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 80, targetBpm: 105 },
        reviewNotes: 'O acorde add9 é um dos maiores trunfos tímbricos do violonista acústico.'
      },
      {
        id: 'violao-lesson-24',
        level: 3,
        moduleTitle: 'Módulo 4 • Suspensos e Tétrades',
        moduleNumber: 4,
        lessonNumber: 24,
        title: 'Acordes Diminutos, Meio-Diminutos (m7b5) e Aumentados',
        subtitle: 'Cores harmônicas de transição, pontes dramáticas e o VII grau',
        objective: 'Compreender e executar acordes diminutos (dim7: 1 - b3 - b5 - bb7), meio-diminutos (m7b5: 1 - b3 - b5 - b7) e aumentados (aug: 1 - 3 - #5) no violão acústico.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 20, 21 e 22.'],
        parts: [
          {
            id: 'vl24-p1',
            title: '1. O Acorde Meio-Diminuto (m7b5) — O VII Grau',
            contentMarkdown: `### A Tétrade do Sétimo Grau Maior
No campo harmônico maior (ex: em Dó Maior), o acorde formado sobre a nota Si é **Bm7b5**:
* Notas: B - D - F - A (Si, Ré, Fá, Lá).
* Fórmula: 1 - b3 - b5 - b7.
* É também o II grau do campo harmônico menor (indispensável no ii - V - i menor de bossa nova e jazz).
* Digitação elegante sem pestana: [-1, 2, 3, 2, 3, -1].`
          },
          {
            id: 'vl24-p2',
            title: '2. O Acorde Diminuto Completo (dim7) e Sua Simetria',
            contentMarkdown: `### Um Acorde Simétrico que se Repete a Cada 3 Casas
O acorde diminuto é formado por intervalos sucessivos de terça menor (1,5 tom):
* Se você move um formato de acorde diminuto **3 casas para frente**, as notas são exatamente as mesmas invertidas!
* Exemplo: C#dim7 na casa 4 tem as mesmas notas que na casa 7 e na casa 10.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Bm7b5',
            namePt: 'Si Meio-Diminuto',
            formula: '1 - b3 - b5 - b7',
            notes: ['B', 'D', 'F', 'A'],
            notesPt: ['Si', 'Ré', 'Fá', 'Lá'],
            frets: [-1, 2, 3, 2, 3, -1],
            fingers: [0, 1, 3, 2, 4, 0],
            avoidStrings: [6, 1],
            tips: 'Dedos 1 e 2 na casa 2, dedos 3 e 4 na casa 3 em cordas adjacentes.',
            category: 'Diminuto'
          },
          {
            symbol: 'C#dim7',
            namePt: 'Dó Sustenido Diminuto',
            formula: '1 - b3 - b5 - bb7',
            notes: ['C#', 'E', 'G', 'Bb'],
            notesPt: ['Dó#', 'Mi', 'Sol', 'Si Bemol'],
            frets: [-1, 4, 5, 3, 5, -1],
            fingers: [0, 2, 4, 1, 3, 0],
            avoidStrings: [6, 1],
            tips: 'Formato clássico em diamante. Mute a 6ª e a 1ª cordas.',
            category: 'Diminuto'
          }
        ],
        practicalExercise: {
          title: 'Exercício 24 — A Conexão Cromática C -> C#dim7 -> Dm7 -> G7',
          subtitle: 'A clássica ponte cromática de passagem da MPB e do samba-canção',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Puxada em bloco com polegar e 3 dedos',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C#', notePt: 'Dó#', pickDirection: 'down', fret: 4 },
            { stringNumber: 5, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 5 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|----------------------------------|
B|----1-------5-------6-------0-----|
G|----0-------3-------5-------0-----|
D|----2-------5-------7-------0-----|
A|--3-------4-------5---------------|
E|--------------------------3-------|
    C       C#dim7  Dm7     G7`,
          instructions: [
            'Observe a linha cromática do baixo na corda 5: casa 3 (C) -> casa 4 (C#) -> casa 5 (D).',
            'O acorde diminuto funciona como um elo gravitacional perfeito conectando o C ao Dm7.'
          ],
          biomechanicTips: [
            'Mantenha a palma paralela ao braço para facilitar a montagem do acorde de 4 dedos.'
          ],
          validationCriteria: 'Condução cromática sem interrupção de tempo a 60 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Toque Sofisticado da Bossa e do Choro',
          description: 'A passagem cromática imortalizada em Tom Jobim, Cartola e Noel Rosa.',
          tab: `e|--------------------------|
B|----1---5-------6---0-----|
G|----0---3-------5---0-----|
D|----2---5-------7---0-----|
A|--3---4-------5-----------|
E|------------------3-------|`
        },
        commonErrors: [
          { issue: 'Deixar a 6ª ou a 1ª cordas soltas soarem.', solution: 'Mute a 6ª corda encostando de leve a lateral do dedo 1 e a 1ª corda com a parte carnuda da mão.' }
        ],
        challenge: {
          title: 'Desafio Simetria Diminuta',
          description: 'Desloque o acorde C#dim7 três casas à frente (para a casa 7) e toque. Perceba como ele mantém a mesma harmonia.',
          instruction: 'Execute o salto mantendo a forma idêntica da mão.'
        },
        masteryCriteria: {
          learning: 'Compreende a diferença entre m7b5 e dim7.',
          consolidating: 'Executa a passagem cromática C -> C#dim7 -> Dm7 com afinação precisa.',
          mastered: 'Aplica acordes diminutos de passagem em qualquer tom.'
        },
        speedGoals: { startingBpm: 55, intermediateBpm: 70, targetBpm: 85 },
        reviewNotes: 'Com os acordes diminutos e meio-diminutos, você domina a harmonia de transição mais rica do violão.'
      }
    ]
  },

  // =======================================================================
  // MÓDULO 5 — INVERSÕES DE ACORDES, BAIXOS ALTERADOS E VOICE LEADING (Aulas 25 a 30)
  // =======================================================================
  {
    id: 'violao-mod-5',
    moduleNumber: 5,
    title: 'Inversões de Acordes, Baixos Alterados e Condução de Vozes',
    subtitle: 'O violão como orquestra: baixos lineares, acordes slash (C/E, D/F#, G/B) e economia de movimentos',
    badge: 'Módulo 5 • Voice Leading',
    description: 'Transforme o violão de um mero gerador de acordes em um instrumento contrapontístico. Aprenda o que são inversões, domine os baixos em terça e quinta, crie linhas de baixo caminhante (walking bass) e guie as vozes com o mínimo movimento de dedos.',
    lessons: [
      {
        id: 'violao-lesson-25',
        level: 2,
        moduleTitle: 'Módulo 5 • Inversões & Voice Leading',
        moduleNumber: 5,
        lessonNumber: 25,
        title: 'O que são Inversões: 1ª, 2ª e 3ª Inversão no Violão',
        subtitle: 'A nota mais grave não precisa ser a fundamental: a física das inversões',
        objective: 'Compreender conceitualmente e fisicamente as inversões de acordes no braço do violão (Estado fundamental = Tônica no baixo; 1ª Inversão = 3ª no baixo; 2ª Inversão = 5ª no baixo; 3ª Inversão = 7ª no baixo).',
        estimatedMinutes: 25,
        prerequisites: ['Módulo 3 e 4 concluídos.'],
        parts: [
          {
            id: 'vl25-p1',
            title: '1. O Conceito Físico de Inversão',
            contentMarkdown: `### A Nota Mais Grave Muda Tudo
Um acorde é um conjunto de notas. A ordem em que elas são empilhadas de baixo para cima define a **inversão**:
* **Estado Fundamental:** A nota mais grave (baixo) é a tônica (1). Ex: C com baixo em Dó.
* **1ª Inversão:** A nota mais grave é a terça (3). Cifrado como **C/E** (Dó com baixo em Mi).
* **2ª Inversão:** A nota mais grave é a quinta (5). Cifrado como **C/G** (Dó com baixo em Sol).
* **3ª Inversão (em tétrades):** A nota mais grave é a sétima (7). Cifrado como **C/B** ou **G7/F**.`
          },
          {
            id: 'vl25-p2',
            title: '2. Por Que Usamos Inversões no Violão?',
            contentMarkdown: `No violão, mudar o baixo sem alterar o acorde permite:
1. Criar linhas melódicas contínuas no polegar (ex: passos de semitom ou tom inteiro).
2. Evitar saltos bruscos e desconexos de baixo.
3. Dar suavidade, lirismo e maturidade orquestral ao acompanhamento.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'C/E',
            namePt: 'Dó Maior com Baixo em Mi (1ª Inversão)',
            formula: '3 - 1 - 5 - 1 - 3',
            notes: ['E', 'C', 'G', 'C', 'E'],
            notesPt: ['Mi', 'Dó', 'Sol', 'Dó', 'Mi'],
            frets: [0, 3, 2, 0, 1, 0],
            fingers: [0, 3, 2, 0, 1, 0],
            openStrings: [6, 3, 1],
            tips: 'Toque todas as 6 cordas! A 6ª corda solta é o baixo Mi.',
            category: 'Inversão'
          },
          {
            symbol: 'C/G',
            namePt: 'Dó Maior com Baixo em Sol (2ª Inversão)',
            formula: '5 - 1 - 3 - 5 - 1',
            notes: ['G', 'C', 'E', 'G', 'C', 'E'],
            notesPt: ['Sol', 'Dó', 'Mi', 'Sol', 'Dó', 'Mi'],
            frets: [3, 3, 2, 0, 1, 0],
            fingers: [4, 3, 2, 0, 1, 0],
            openStrings: [3, 1],
            tips: 'Dedo 4 na casa 3 da 6ª corda (Sol) e dedo 3 na casa 3 da 5ª corda (Dó).',
            category: 'Inversão'
          }
        ],
        practicalExercise: {
          title: 'Exercício 25 — Comparação Auditiva C -> C/E -> C/G',
          subtitle: 'Mesmo acorde, três sensações emocionais completamente distintas',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar toca o baixo isolado, depois I-M-A puxam as agudas',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|----0---0-------0---0-------0---0---|
B|----1---1-------1---1-------1---1---|
G|----0---0-------0---0-------0---0---|
D|----2---2-------2---2-------2---2---|
A|--3---------------------------------|
E|--------------0-----------3---------|
    C (Fund.)   C/E (1ª Inv)  C/G (2ª Inv)`,
          instructions: [
            'Foque os ouvidos na nota grave que comanda cada compasso.',
            'Perceba como C/E soa mais leve e aberto, enquanto C/G soa denso e pesado.'
          ],
          biomechanicTips: [
            'No C/G, incline ligeiramente a mão para acomodar os dedos 4 e 3 juntos na casa 3.'
          ],
          validationCriteria: 'Execução limpa sem abafar as cordas soltas agudas.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Baixo Melódico do Violão Popular',
          description: 'A transição imortal entre acordes com baixo que caminha passo a passo.',
          tab: `e|----0---0-------0---0---|
B|----1---1-------1---1---|
G|----0---0-------0---0---|
D|------------------------|
A|--3-----------2---------|
E|------------------------|`
        },
        commonErrors: [
          { issue: 'Tocar a 6ª corda Mi solta em um C no estado fundamental.', solution: 'Mute a 6ª corda com a pontinha do dedo 3 caso queira C puro; toque a 6ª apenas se desejar C/E intencionalmente.' }
        ],
        challenge: {
          title: 'Desafio Reconhecimento de Baixo',
          description: 'Toque C, C/E e C/G de olhos fechados e tente identificar instantaneamente pelo ouvido qual nota está no baixo.',
          instruction: 'Treine a audição atenta do registro grave do instrumento acústico.'
        },
        masteryCriteria: {
          learning: 'Distingue estado fundamental de inversão.',
          consolidating: 'Digita C/E e C/G com destreza.',
          mastered: 'Explica a diferença funcional entre 1ª e 2ª inversão com exemplos práticos.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'As inversões são o ingrediente que separa o iniciante do violonista musical e maduro.'
      },
      {
        id: 'violao-lesson-26',
        level: 2,
        moduleTitle: 'Módulo 5 • Inversões & Voice Leading',
        moduleNumber: 5,
        lessonNumber: 26,
        title: 'Baixos em Terça (C/E, D/F#, G/B) e Condução Linear de Baixo',
        subtitle: 'A tríade mágica dos baixos invertidos mais tocados no violão',
        objective: 'Dominar os três acordes invertidos com baixo na terça mais essenciais do repertório acústico (D/F#, G/B, C/E) e sua aplicação em linhas de baixo descendentes e ascendentes.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 25.'],
        parts: [
          {
            id: 'vl26-p1',
            title: '1. O Lendário Acorde D/F# (Ré com Baixo em Fá Sustenido)',
            contentMarkdown: `### Como Montar o D/F# com Conforto
O acorde de Ré tem a fundamental em D. Sua terça maior é **F#**.
* No violão, a nota F# mais grave fica na **casa 2 da 6ª corda**.
* **Duas formas ergonômicas de montagem:**
  1. **Com o Polegar Esquerdo (Thumb-over):** Muito comum no pop, folk e fingerstyle. A mão envolve o braço e o polegar alcança a casa 2 da 6ª corda por cima.
  2. **Com o Dedo 1 (Clássica):** Dedo 1 na casa 2 da 6ª corda, dedo 2 na casa 2 da 3ª corda, dedo 3 na casa 3 da 2ª corda. A 5ª corda é mutada.`
          },
          {
            id: 'vl26-p2',
            title: '2. O Acorde G/B (Sol com Baixo em Si)',
            contentMarkdown: `### A Conexão Perfeita Entre C e Am
O acorde de Sol com baixo em Si é digitado simplesmente como:
* [-1, 2, 0, 0, 3, 3] ou [-1, 2, 0, 0, 0, 3].
* O baixo é a 5ª corda na casa 2 (Si). A 6ª corda NÃO deve soada!
* Essa nota Si é a ponte melódica natural entre o baixo Dó (casa 3 da corda 5) e o baixo Lá (corda 5 solta).`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'D/F#',
            namePt: 'Ré Maior com Baixo em Fá Sustenido',
            formula: '3 - 5 - 1 - 3',
            notes: ['F#', 'A', 'D', 'F#'],
            notesPt: ['Fá#', 'Lá', 'Ré', 'Fá#'],
            frets: [2, -1, 0, 2, 3, 2],
            fingers: [1, 0, 0, 2, 3, 2],
            openStrings: [4],
            avoidStrings: [5],
            tips: 'Mute a corda 5 encostando a lateral do dedo que faz o baixo na casa 2.',
            category: 'Inversão'
          },
          {
            symbol: 'G/B',
            namePt: 'Sol Maior com Baixo em Si',
            formula: '3 - 5 - 1 - 3',
            notes: ['B', 'D', 'G', 'D', 'G'],
            notesPt: ['Si', 'Ré', 'Sol', 'Ré', 'Sol'],
            frets: [-1, 2, 0, 0, 3, 3],
            fingers: [0, 1, 0, 0, 3, 4],
            openStrings: [4, 3],
            avoidStrings: [6],
            tips: 'Toque a partir da 5ª corda. O dedo 1 segura o baixo Si.',
            category: 'Inversão'
          }
        ],
        practicalExercise: {
          title: 'Exercício 26 — A Linha de Baixo Descendente G -> D/F# -> Em7',
          subtitle: 'A progressão mais famosa da história do violão acústico',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar marcando a linha de baixo melódica, dedos dedilhando agudos',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'down', fret: 2 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `e|------3-----------3-----------3---|
B|----3---3-------3---3-------3---3-|
G|--0-------0---2-------2---0-------|
D|----------------------------------|
A|----------------------------------|
E|--3---------2-----------0---------|
    G         D/F#        Em7
    (Baixo G -> Baixo F# -> Baixo E)`,
          instructions: [
            'Observe a descida suave do baixo na 6ª corda: Casa 3 -> Casa 2 -> Casa 0.',
            'Os dedos 3 e 4 permanecem imóveis na casa 3 das cordas 1 e 2!'
          ],
          biomechanicTips: [
            'Use o dedo 1 na casa 2 da 6ª corda e o dedo 2 na casa 2 da 3ª corda para o D/F#.'
          ],
          validationCriteria: 'Conexão linear do baixo sem quebras sonoras.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Toque Balada e Gospel',
          description: 'Presente em "Tears in Heaven" de Eric Clapton, baladas de Coldplay e músicas sacras contemporâneas.',
          tab: `e|----3-------3-------3---|
B|----3-------3-------3---|
G|----0-------2-------0---|
D|----0-------0-------2---|
A|------------------------|
E|--3-------2-------0-----|`
        },
        commonErrors: [
          { issue: 'Deixar a 5ª corda soar solta no D/F# (nota Lá criando choque sonoro).', solution: 'Incline o dedo da casa 2 da 6ª corda para abafar suavemente a 5ª corda.' }
        ],
        challenge: {
          title: 'Desafio Descendente Completo',
          description: 'Toque a sequência C -> G/B -> Am7 -> C/G -> Fmaj7. Repare como o baixo caminha nota a nota (C - B - A - G - F).',
          instruction: 'Execute o dedilhado P-I-M-A marcando cada nota de baixo com peso.'
        },
        masteryCriteria: {
          learning: 'Monta D/F# e G/B corretamente.',
          consolidating: 'Realiza a descida G -> D/F# -> Em7 com tempo perfeito.',
          mastered: 'Insere baixos invertidos em qualquer progressão padrão.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'O domínio do baixo na terça eleva o violonista para outro nível de maturidade musical.'
      },
      {
        id: 'violao-lesson-27',
        level: 2,
        moduleTitle: 'Módulo 5 • Inversões & Voice Leading',
        moduleNumber: 4,
        lessonNumber: 27,
        title: 'Baixos em Quinta e Baixos em Sétima (A/G, C/B, D/C)',
        subtitle: 'Cores dramáticas e tensões gravitacionais na linha de baixo',
        objective: 'Compreender o uso de baixos na quinta (pedais e estabilidade alternativa) e baixos na sétima (3ª inversão), criando quedas resolutivas ricas.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 25 e 26.'],
        parts: [
          {
            id: 'vl27-p1',
            title: '1. Acordes com Baixo na Sétima (3ª Inversão)',
            contentMarkdown: `### O Baixo em Meio-Tom que Pede Passagem
Quando tocamos um acorde maior com o baixo na 7ª maior (ex: **C/B**):
* O acorde é C (Dó Maior), mas o baixo toca a nota **B** (Si, casa 2 da 5ª corda).
* O baixo está a apenas meio-tom de resolver no **Am** (baixo Lá solto).
* Linha clássica: C -> C/B -> Am -> Am/G -> F.`
          },
          {
            id: 'vl27-p2',
            title: '2. Baixos em Sétima Menor: D/C e A/G',
            contentMarkdown: `* **D/C (Ré com baixo em Dó):** Dedo 3 na casa 3 da 5ª corda (C), mantendo o formato de Ré agudo. O baixo Dó pede resolução em G/B!
* **A/G (Lá com baixo em Sol):** Acorde de Lá maior com a 6ª corda na casa 3 (Sol).`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'C/B',
            namePt: 'Dó Maior com Baixo em Si',
            formula: '7 - 3 - 5 - 1',
            notes: ['B', 'E', 'G', 'C'],
            notesPt: ['Si', 'Mi', 'Sol', 'Dó'],
            frets: [-1, 2, 2, 0, 1, 0],
            fingers: [0, 2, 3, 0, 1, 0],
            openStrings: [3, 1],
            avoidStrings: [6],
            tips: 'Dedo 2 na casa 2 da 5ª corda (baixo Si). Passagem obrigatória para Am.',
            category: 'Inversão'
          },
          {
            symbol: 'D/C',
            namePt: 'Ré Maior com Baixo em Dó',
            formula: 'b7 - 1 - 3 - 5',
            notes: ['C', 'D', 'A', 'D', 'F#'],
            notesPt: ['Dó', 'Ré', 'Lá', 'Ré', 'Fá#'],
            frets: [-1, 3, 0, 2, 3, 2],
            fingers: [0, 3, 0, 1, 4, 2],
            openStrings: [4],
            avoidStrings: [6],
            tips: 'Dedo 3 na casa 3 da 5ª corda. Dedo 1 na casa 2 da corda 3.',
            category: 'Inversão'
          }
        ],
        practicalExercise: {
          title: 'Exercício 27 — O Descenso Completo C -> C/B -> Am -> Am/G',
          subtitle: 'A famosa descida cromática/diatônica do violão acústico',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar no baixo e dedilhado P-I-M-A',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 2 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|----0-------0-------0-------0---|
B|----1-------1-------1-------1---|
G|----0-------0-------2-------2---|
D|----2-------2-------2-------2---|
A|--3-------2-------0-------------|
E|--------------------------3-----|
    C       C/B     Am      Am/G
    (Baixo: C -> B -> A -> G)`,
          instructions: [
            'Sinta o baixo caminhando com gravidade melódica irresistível.',
            'As cordas agudas (Mi, Si, Sol) mantêm a harmonia coesa enquanto o baixo desce.'
          ],
          biomechanicTips: [
            'Para o C/B, apenas recue o dedo 3 para a casa 2 ou use o dedo 2 na casa 2.'
          ],
          validationCriteria: 'Conexão suave sem pausas entre os 4 baixos.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Clássico "Dust in the Wind" e "My Immortal"',
          description: 'A progressão descendente de violão mais emocionante do repertório universal.',
          tab: `e|------0-------0-------0-------0---|
B|----1---1---1---1---1---1---1---1-|
G|--0-------0-------2-------2-------|
D|----------------------------------|
A|--3-------2-------0---------------|
E|--------------------------3-------|`
        },
        commonErrors: [
          { issue: 'Apertar a 6ª corda com força excessiva no Am/G.', solution: 'Use o dedo 4 ou 3 na casa 3 da 6ª corda mantendo o punho solto.' }
        ],
        challenge: {
          title: 'Desafio Resolução D/C -> G/B',
          description: 'Toque D/C seguido de G/B e repare no movimento do baixo C descendo meio-tom para B.',
          instruction: 'Pratique 8 repetições a 60 BPM com metrônomo.'
        },
        masteryCriteria: {
          learning: 'Compreende baixos na sétima.',
          consolidating: 'Realiza a descida C - C/B - Am - Am/G sem hesitação.',
          mastered: 'Re-harmoniza músicas simples adicionando baixos de passagem.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'O controle do baixo descendente confere profundidade poética instantânea ao violão.'
      },
      {
        id: 'violao-lesson-28',
        level: 3,
        moduleTitle: 'Módulo 5 • Inversões & Voice Leading',
        moduleNumber: 5,
        lessonNumber: 28,
        title: 'Voice Leading: Como Mover o Mínimo de Dedos Entre Acordes',
        subtitle: 'A regra de ouro da harmonia funcional: notas comuns permanecem paradas',
        objective: 'Compreender os princípios de condução de vozes (Voice Leading), conectando acordes no violão com o menor deslocamento físico possível e criando linhas melódicas suaves nas vozes internas.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 23, 25 e 26.'],
        parts: [
          {
            id: 'vl28-p1',
            title: '1. O Que É Voice Leading?',
            contentMarkdown: `### Condução Melódica das Notas do Acorde
Voice Leading (condução de vozes) é a arte de conectar acordes de modo que cada nota se mova suavemente para a nota mais próxima do próximo acorde:
* **Princípio 1:** Se dois acordes têm notas em comum, mantenha essas notas fixas nos mesmos dedos e cordas!
* **Princípio 2:** As notas que mudam devem se mover preferencialmente por **meio-tom** ou **um tom inteiro**, nunca por saltos gigantes.
* **Princípio 3:** O violão soa muito mais doce e conexo quando os dedos não "pulam" de uma forma inteira para outra no ar.`
          },
          {
            id: 'vl28-p2',
            title: '2. Exemplo Prático: Conexão C -> Am -> Fmaj7 -> Gsus4',
            contentMarkdown: `Repare nas notas que não precisam se mover:
* De C para Am: a nota C (corda 2 casa 1) e a nota E (corda 4 casa 2) já estão lá! Só move o dedo 3.
* De Am para Fmaj7: a nota C continua no mesmo lugar! Só movem os baixos.
* De Fmaj7 para Gsus4: mantenha a nota C na corda 2!`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Gsus4',
            namePt: 'Sol Suspenso com Quarta',
            formula: '1 - 4 - 5',
            notes: ['G', 'C', 'D'],
            notesPt: ['Sol', 'Dó', 'Ré'],
            frets: [3, 2, 0, 0, 1, 3],
            fingers: [3, 2, 0, 0, 1, 4],
            openStrings: [4, 3],
            tips: 'O dedo 1 segura a nota C na corda 2 mantendo a nota comum.',
            category: 'Suspenso'
          }
        ],
        practicalExercise: {
          title: 'Exercício 28 — O Ciclo de Vozes Fixas com a Nota Dó Presa',
          subtitle: 'Tocando 4 acordes mantendo a corda 2 casa 1 imóvel',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado P - I - M - A',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|----0-------0-------0-------3---|
B|----1-------1-------1-------1---|  <-- Nota Dó imóvel em todos!
G|----0-------2-------2-------0---|
D|----2-------2-------3-------0---|
A|--3-------0---------------------|
E|------------------1-------3-----|
    C       Am      Fmaj7   Gsus4`,
          instructions: [
            'O dedo 1 na casa 1 da corda 2 JAMAIS deve sair da madeira!',
            'Observe como a música ganha uma cola melódica natural.'
          ],
          biomechanicTips: [
            'Use o polegar levemente solto atrás para permitir a articulação dos outros três dedos.'
          ],
          validationCriteria: 'Executar o ciclo sem levantar o dedo 1 em nenhum instante.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Segredo dos Violonistas de Estúdio',
          description: 'A técnica utilizada por produtores musicais para fazer violões soarem limpos, sem barulhos de troca de acordes.',
          tab: `e|------0-------0-------0-------3---|
B|----1---1---1---1---1---1---1---1-|
G|--0-------2-------2-------0-------|
D|--2-------2-------3-------0-------|
A|--3-------0-----------------------|
E|------------------1-------3-------|`
        },
        commonErrors: [
          { issue: 'Tirar toda a mão do braço para remontar o próximo acorde.', solution: 'Identifique antes de tocar quais dedos já estão no lugar correto e fixe-os como âncora.' }
        ],
        challenge: {
          title: 'Desafio do Mínimo Esforço',
          description: 'Analise uma progressão simples que você toca e encontre pelo menos 1 nota comum para manter presa entre cada par de acordes.',
          instruction: 'Elimine qualquer movimento desnecessário dos dedos.'
        },
        masteryCriteria: {
          learning: 'Entende o princípio da condução de vozes.',
          consolidating: 'Mantém notas comuns presas sem vacilar.',
          mastered: 'Aplica voice leading espontâneo conectando acordes no braço todo.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Menos movimento significa mais velocidade, mais precisão e muito mais beleza musical.'
      },
      {
        id: 'violao-lesson-29',
        level: 3,
        moduleTitle: 'Módulo 5 • Inversões & Voice Leading',
        moduleNumber: 5,
        lessonNumber: 29,
        title: 'Acordes Pedais: Mantendo Notas Comuns no Agudo ou no Baixo',
        subtitle: 'O efeito hipnótico do ponto pedal acústico',
        objective: 'Compreender o recurso harmônico do Ponto Pedal (Pedal Point), explorando pedais de baixo (tônica fixa) e pedais de agudo (cordas soltas ressoando sobre diferentes harmonias).',
        estimatedMinutes: 25,
        prerequisites: ['Aula 28.'],
        parts: [
          {
            id: 'vl29-p1',
            title: '1. O Que É um Ponto Pedal?',
            contentMarkdown: `### Uma Nota que Permanece Enquanto a Harmonia Muda
Historicamente originado nos pedais de órgão de tubos das igrejas, o pedal é uma nota sustentada que permanece inalterada enquanto os outros acordes mudam:
* **Pedal de Baixo:** A nota grave é sempre a mesma (ex: baixo Mi na 6ª corda solta) enquanto a mão esquerda desenha tríades de E, F#m/E, G#m/E, A/E.
* **Pedal de Agudo:** As cordas agudas (Si e Mi soltas) continuam vibrando enquanto você digita acordes móveis pelo braço.`
          },
          {
            id: 'vl29-p2',
            title: '2. As Cordas B e E como Pedais Celestiais',
            contentMarkdown: `### O Brilho Acústico do Violão em Mi
Por afinação natural, o violão tem as cordas 2 (Si) e 1 (Mi) soltas. Ao tocar acordes na tonalidade de E maior:
* E: [0, 2, 2, 1, 0, 0]
* F#m11/E: [0, 4, 4, 2, 0, 0]
* G#m(b6)/E: [0, 6, 6, 4, 0, 0]
* Aadd9/E: [0, 7, 7, 6, 0, 0]
As cordas agudas soltas criam uma ambiência cinematográfica e épica sem esforço extra!`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Aadd9/E',
            namePt: 'Lá com Nona e Baixo em Mi (Pedal)',
            formula: '5 - 1 - 5 - 3 - 9 - 5',
            notes: ['E', 'A', 'E', 'C#', 'B', 'E'],
            notesPt: ['Mi', 'Lá', 'Mi', 'Dó#', 'Si', 'Mi'],
            frets: [0, 7, 7, 6, 0, 0],
            fingers: [0, 2, 3, 1, 0, 0],
            openStrings: [6, 2, 1],
            tips: 'Formato de Lá aberto transladado para a casa 7, com cordas 6, 2 e 1 soando abertas.',
            category: 'Pedal'
          }
        ],
        practicalExercise: {
          title: 'Exercício 29 — A Suíte Acústica com Pedal em Mi',
          subtitle: 'Deslizando formatos abertos sobre o baixo pedal',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar toca corda 6 e dedos I-M-A dedilham as cordas 3, 2, 1',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `e|------0-----------0-----------0-----------0---|
B|----0---0-------0---0-------0---0-------0---0-|
G|--1-------1---2-------2---4-------4---6-------|
D|--2-----------4-----------6-----------7-------|
A|--2-----------4-----------6-----------7-------|
E|--0-----------0-----------0-----------0-------|
    E           F#m11/E     G#m/E       Aadd9/E`,
          instructions: [
            'Repare como o baixo Mi (corda 6 solta) ancora toda a progressão.',
            'As cordas 2 e 1 soltas vibram durante todo o exercício criando uma camada mágica.'
          ],
          biomechanicTips: [
            'Mantenha a mesma forma de mão enquanto desliza pelas casas 2, 4, 6 e 7.'
          ],
          validationCriteria: 'Ressonância ininterrupta das cordas soltas com afinação pura.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Estilo Ambient e Trilha Sonora',
          description: 'A sonoridade de trilhas de cinema, rock progressivo e violão fingerstyle instrumental.',
          tab: `e|----0---0---0---0---|
B|----0---0---0---0---|
G|--1---2---4---6-----|
D|--2---4---6---7-----|
A|--2---4---6---7-----|
E|--0---0---0---0-----|`
        },
        commonErrors: [
          { issue: 'Abafar acidentalmente a 1ª corda solta.', solution: 'Mantenha os dedos da mão esquerda curvados na ponta.' }
        ],
        challenge: {
          title: 'Desafio Criação Pedal',
          description: 'Crie sua própria sequência de acordes mantendo a 6ª corda solta como baixo pedal permanente.',
          instruction: 'Explore as casas 2, 4, 7, 9 e 11.'
        },
        masteryCriteria: {
          learning: 'Compreende o conceito de ponto pedal.',
          consolidating: 'Desliza as formas pelo braço mantendo o tempo.',
          mastered: 'Usa pedais para compor introduções e passagens atmosféricas.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'O pedal point é um dos recursos mais poéticos e fáceis de aplicar no violão acústico.'
      },
      {
        id: 'violao-lesson-30',
        level: 3,
        moduleTitle: 'Módulo 5 • Inversões & Voice Leading',
        moduleNumber: 5,
        lessonNumber: 30,
        title: 'Re-harmonização com Baixos Caminhantes (Walking Bass no Violão)',
        subtitle: 'Conduzindo o baixo jazz e samba enquanto mantém a harmonia com os outros dedos',
        objective: 'Aprender os fundamentos do Walking Bass aplicado ao violão acústico, integrando notas de aproximação cromática e diatônica no polegar enquanto os dedos sustentam acordes e síncopes.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 26, 27 e 28.'],
        parts: [
          {
            id: 'vl30-p1',
            title: '1. O Que É o Walking Bass no Violão?',
            contentMarkdown: `### O Violonista que Toca Contrabaixo e Harmonia ao Mesmo Tempo
No walking bass, o polegar da mão direita atua como um contrabaixista independente tocando uma nota a cada tempo (ou em tempos estratégicos), enquanto os dedos indicador, médio e anelar respondem com acordes sincopados:
* **Tempo 1:** Tônica do acorde no baixo.
* **Tempo 2:** Nota do acorde (terça ou quinta).
* **Tempo 3:** Nota de passagem diatônica ou bordadura.
* **Tempo 4:** Nota de aproximação cromática (meio-tom acima ou abaixo do próximo baixo!).`
          },
          {
            id: 'vl30-p2',
            title: '2. A Aproximação Cromática',
            contentMarkdown: `Se você quer chegar no acorde de **G** (baixo Sol na casa 3 da corda 6), as melhores notas para o tempo 4 anterior são:
* **Ab** (casa 4 da corda 6): aproximação cromática superior (descendo meio-tom).
* **F#** (casa 2 da corda 6): aproximação cromática inferior (subindo meio-tom).
Isso cria o balanço irresistível do samba, choro e jazz no violão!`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'C6',
            namePt: 'Dó Maior com Sexta',
            formula: '1 - 3 - 5 - 6',
            notes: ['C', 'E', 'A', 'C'],
            notesPt: ['Dó', 'Mi', 'Lá', 'Dó'],
            frets: [-1, 3, 2, 2, 1, -1],
            fingers: [0, 3, 2, 2, 1, 0],
            avoidStrings: [6, 1],
            tips: 'Formato clássico de samba e bossa nova.',
            category: 'Tétrade'
          }
        ],
        practicalExercise: {
          title: 'Exercício 30 — Walking Bass Básico C -> Dm7 -> G7 -> C',
          subtitle: 'A marcha do baixo com aproximação cromática no violão',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar marca 4 tempos, dedos puxam acorde no contratempo',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 2 },
            { stringNumber: 5, noteCipher: 'C#', notePt: 'Dó#', pickDirection: 'down', fret: 4 },
            { stringNumber: 5, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 5 }
          ],
          tablatureText: `e|----------------------------------|
B|----1-------1-------6-------6-----|
G|----0-------0-------5-------5-----|
D|----2-------2-------7-------7-----|
A|--3---2---3---4---5---------------|
E|----------------------7---6---5---|
    (Baixo caminhante no tempo 1,2,3,4)`,
          instructions: [
            'Foque na independência total do polegar direito.',
            'O polegar não para nunca: ele é o relógio rítmico do violão.'
          ],
          biomechanicTips: [
            'Mantenha o polegar à frente dos outros dedos para evitar que colidam.'
          ],
          validationCriteria: 'Execução precisa com pulsação estável no metrônomo.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Violão de 7 Cordas e o Samba-Choro',
          description: 'A técnica definitiva que consagrou gênios como Baden Powell e Dino 7 Cordas.',
          tab: `e|--------------------------|
B|----1---1-------0---0-----|
G|----0---0-------0---0-----|
D|----2---2-------0---0-----|
A|--3---2---0---------------|
E|--------------3---2---1---|`
        },
        commonErrors: [
          { issue: 'O ritmo do baixo oscilar quando a mão esquerda troca de posição.', solution: 'Pratique primeiro apenas as notas do polegar sem os acordes até internalizar a batida do relógio.' }
        ],
        challenge: {
          title: 'Desafio Walking Contínuo',
          description: 'Toque 4 voltas da progressão mantendo o polegar em semínimas estritas a 65 BPM.',
          instruction: 'Grave e escute se o baixo parece um segundo instrumento tocando junto.'
        },
        masteryCriteria: {
          learning: 'Compreende aproximações cromáticas.',
          consolidating: 'Toca a linha de walking bass sincronizada com os acordes.',
          mastered: 'Improvisa linhas de baixo caminhante em qualquer sequência harmônica.'
        },
        speedGoals: { startingBpm: 55, intermediateBpm: 70, targetBpm: 85 },
        reviewNotes: 'O walking bass transforma o violonista solo em uma banda completa de cordas e ritmo.'
      }
    ]
  },

  // =======================================================================
  // MÓDULO 6 — CAMPO HARMÔNICO MAIOR E MENOR NO VIOLÃO (Aulas 31 a 36)
  // =======================================================================
  {
    id: 'violao-mod-6',
    moduleNumber: 6,
    title: 'Campo Harmônico Maior e Menor no Violão',
    subtitle: 'A família completa dos acordes: funções tonais, cadências mestras e transposição com e sem capotraste',
    badge: 'Módulo 6 • Arquitetura Tonal',
    description: 'Entenda por que certos acordes combinam perfeitamente entre si. Mapeie o campo harmônico em tríades e tétrades, domine as três funções essenciais (Tônica, Subdominante e Dominante), decifre o campo menor e domine a transposição instantânea.',
    lessons: [
      {
        id: 'violao-lesson-31',
        level: 2,
        moduleTitle: 'Módulo 6 • Campo Harmônico',
        moduleNumber: 6,
        lessonNumber: 31,
        title: 'O Campo Harmônico Maior em Tríades',
        subtitle: 'Os 7 acordes gerados pela escala maior: I, ii, iii, IV, V, vi, vii°',
        objective: 'Compreender a regra de formação dos acordes do campo harmônico maior em tríades e reconhecer sua aplicação prática imediata em C, G e D no violão.',
        estimatedMinutes: 25,
        prerequisites: ['Módulos 2 e 3 dominados.'],
        parts: [
          {
            id: 'vl31-p1',
            title: '1. A Fórmula Universal das Tríades do Campo Maior',
            contentMarkdown: `### A Regra Inalterável
Ao empilhar terças sobre cada uma das 7 notas de qualquer escala maior diatônica, obtemos sempre o mesmo padrão:
* **Grau I:** Maior (Tônica)
* **Grau ii:** Menor (Sobretônica)
* **Grau iii:** Menor (Mediante)
* **Grau IV:** Maior (Subdominante)
* **Grau V:** Maior (Dominante)
* **Grau vi:** Menor (Relativa Menor)
* **Grau vii°:** Diminuto (Sensível)`
          },
          {
            id: 'vl31-p2',
            title: '2. O Campo de Dó Maior no Violão Físico',
            contentMarkdown: `* I = **C**
* ii = **Dm**
* iii = **Em**
* IV = **F** (ou Fmaj7)
* V = **G** (ou G7)
* vi = **Am**
* vii° = **Bdim** (ou Bm7b5)
Todos esses acordes compartilham a mesma "família" e soam consonantes juntos!`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'C',
            namePt: 'Dó Maior (Grau I)',
            formula: '1 - 3 - 5',
            notes: ['C', 'E', 'G'],
            notesPt: ['Dó', 'Mi', 'Sol'],
            frets: [-1, 3, 2, 0, 1, 0],
            fingers: [0, 3, 2, 0, 1, 0],
            tips: 'Centro tonal e ponto de repouso.',
            category: 'Tríade'
          },
          {
            symbol: 'Dm',
            namePt: 'Ré Menor (Grau ii)',
            formula: '1 - b3 - 5',
            notes: ['D', 'F', 'A'],
            notesPt: ['Ré', 'Fá', 'Lá'],
            frets: [-1, -1, 0, 2, 3, 1],
            fingers: [0, 0, 0, 2, 3, 1],
            tips: 'Acorde de afastamento suave.',
            category: 'Tríade'
          }
        ],
        practicalExercise: {
          title: 'Exercício 31 — Percorrendo os 6 Primeiros Graus em Dó',
          subtitle: 'A esteira diatônica completa no braço',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Uma batida cheia para baixo por compasso',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|--0-----1-----0-----0-----3-----0---|
B|--1-----3-----0-----1-----0-----1---|
G|--0-----2-----0-----2-----0-----2---|
D|--2-----0-----2-----3-----0-----2---|
A|--3-----------2-----------2-----0---|
E|--------------0-----1-----3---------|
    C     Dm    Em    F     G     Am
    I     ii    iii   IV    V     vi`,
          instructions: [
            'Nomeie mentalmente o número do grau ao tocar cada acorde.',
            'Perceba a coerência harmônica: nenhuma nota desafina em relação à tonalidade.'
          ],
          biomechanicTips: [
            'Antecipe a posição do próximo acorde mentalmente antes de trocar os dedos.'
          ],
          validationCriteria: 'Mudanças no tempo correto a 60 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: Composição Espontânea',
          description: 'Qualquer combinação aleatória desses acordes soará musical e agradável ao ouvido.',
          tab: `e|--0---0---3---0---|
B|--1---1---0---1---|
G|--0---2---0---2---|
D|--2---3---0---2---|
A|--3-------2---0---|
E|----------3-------|
    C   F   G   Am`
        },
        commonErrors: [
          { issue: 'Tocar Fá menor ou Ré maior achando que pertencem ao tom de Dó.', solution: 'Lembre-se da regra fixa: I, IV e V são MAIORES; ii, iii e vi são MENORES.' }
        ],
        challenge: {
          title: 'Desafio Campo de Sol',
          description: 'Escreva mentalmente os 6 primeiros acordes do campo de Sol Maior.',
          instruction: 'Resposta: G, Am, Bm, C, D, Em. Toque-os no violão.'
        },
        masteryCriteria: {
          learning: 'Memoriza a fórmula I-ii-iii-IV-V-vi-vii°.',
          consolidating: 'Toca os acordes do campo de Dó e Sol sem hesitar.',
          mastered: 'Identifica instantaneamente o grau de qualquer acorde em músicas populares.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'O campo harmônico é o mapa definitivo que desvenda 95% de todas as músicas populares.'
      },
      {
        id: 'violao-lesson-32',
        level: 2,
        moduleTitle: 'Módulo 6 • Campo Harmônico',
        moduleNumber: 6,
        lessonNumber: 32,
        title: 'O Campo Harmônico Maior em Tétrades',
        subtitle: 'Imaj7, IIm7, IIIm7, IVmaj7, V7, VIm7, VIIm7b5',
        objective: 'Dominar o campo harmônico em tétrades (acordes com 4 notas), compreendendo a adição sistemática da 7ª e seu impacto sonoro no violão acústico.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 20, 21, 22 e 31.'],
        parts: [
          {
            id: 'vl32-p1',
            title: '1. O Padrão Universal das Tétrades',
            contentMarkdown: `### Adicionando a 7ª a Cada Grau
* **Imaj7:** Tétrade Maior com Sétima Maior (Cmaj7)
* **IIm7:** Tétrade Menor com Sétima Menor (Dm7)
* **IIIm7:** Tétrade Menor com Sétima Menor (Em7)
* **IVmaj7:** Tétrade Maior com Sétima Maior (Fmaj7)
* **V7:** Tétrade Maior com Sétima Dominante (G7)
* **VIm7:** Tétrade Menor com Sétima Menor (Am7)
* **VIIm7b5:** Acorde Meio-Diminuto (Bm7b5)`
          },
          {
            id: 'vl32-p2',
            title: '2. A Singularidade do V7 e do VIIm7b5',
            contentMarkdown: `Observe que apenas o **V grau (V7)** tem a 7ª menor com terça maior (acorde dominante). Ele é o único acorde do campo que possui o trítono resolutivo natural! Por isso ele é a locomotiva de atração para o grau I.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Cmaj7',
            namePt: 'Dó com Sétima Maior (Imaj7)',
            formula: '1 - 3 - 5 - 7',
            notes: ['C', 'E', 'G', 'B'],
            notesPt: ['Dó', 'Mi', 'Sol', 'Si'],
            frets: [-1, 3, 2, 0, 0, 0],
            fingers: [0, 3, 2, 0, 0, 0],
            tips: 'Abertura nobre e majestosa.',
            category: 'Tétrade'
          },
          {
            symbol: 'G7',
            namePt: 'Sol com Sétima Dominante (V7)',
            formula: '1 - 3 - 5 - b7',
            notes: ['G', 'B', 'D', 'F'],
            notesPt: ['Sol', 'Si', 'Ré', 'Fá'],
            frets: [3, 2, 0, 0, 0, 1],
            fingers: [3, 2, 0, 0, 0, 1],
            tips: 'Tensão máxima que quer resolver em Cmaj7.',
            category: 'Dominante'
          }
        ],
        practicalExercise: {
          title: 'Exercício 32 — A Progressão Imaj7 -> VIm7 -> IIm7 -> V7',
          subtitle: 'A famosa cadência Turnaround de jazz e MPB',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Levada de bossa/jazz acústica',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|----0-------0-------1-------1---|
B|----0-------1-------1-------0---|
G|----0-------0-------2-------0---|
D|----2-------2-------0-------0---|
A|--3-------0---------------------|
E|--------------------------3-----|
    Cmaj7   Am7     Dm7     G7
    Imaj7   VIm7    IIm7    V7`,
          instructions: [
            'Sinta a riqueza harmônica incomparável em relação às tríades simples.',
            'O ciclo Imaj7 - VIm7 - IIm7 - V7 pode rodar indefinidamente com fluidez.'
          ],
          biomechanicTips: [
            'Mantenha o tempo rigorosamente uniforme com o metrônomo.'
          ],
          validationCriteria: 'Execução sem tropeços a 60 BPM por 4 voltas completas.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Turnaround Imortal',
          description: 'A base de centenas de standards de jazz, canções românticas e clássicos da MPB.',
          tab: `e|------0-------0-------1-------1---|
B|----0---0---1---1---1---1---0---0-|
G|--0-------0-------2-------0-------|
D|------------------0---------------|
A|--3-------0-----------------------|
E|--------------------------3-------|`
        },
        commonErrors: [
          { issue: 'Tocar Gmaj7 em vez de G7.', solution: 'Lembre-se: o grau V é sempre dominante (G7), com 7ª MENOR (Fá natural).' }
        ],
        challenge: {
          title: 'Desafio Tétrades de Ouvido',
          description: 'Toque C - Am - Dm - G e depois toque Cmaj7 - Am7 - Dm7 - G7. Compare a textura de cada versão.',
          instruction: 'Sinta como a segunda versão soa aveludada e sofisticada.'
        },
        masteryCriteria: {
          learning: 'Conhece as 7 tétrades diatônicas.',
          consolidating: 'Toca a cadência Imaj7 - VIm7 - IIm7 - V7 com ritmo swingado.',
          mastered: 'Substitui tríades por tétrades com elegância em qualquer repertório.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'As tétrades são o passaporte para o som profissional de violão acústico.'
      },
      {
        id: 'violao-lesson-33',
        level: 2,
        moduleTitle: 'Módulo 6 • Campo Harmônico',
        moduleNumber: 6,
        lessonNumber: 33,
        title: 'Funções Harmônicas: Tônica, Subdominante e Dominante',
        subtitle: 'A física emocional da música: Repouso, Afastamento e Tensão',
        objective: 'Compreender as 3 grandes funções harmônicas e como agrupam todos os acordes do campo harmônico de acordo com sua energia e direção musical.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 31 e 32.'],
        parts: [
          {
            id: 'vl33-p1',
            title: '1. A Trindade Funcional da Música Tonal',
            contentMarkdown: `### Todas as Músicas Operam Neste Ciclo
1. **Tônica (Repouso / Casa):** Sensação de estabilidade, paz, conclusão.
   - Acorde Principal: **I** (C)
   - Acordes Substitutos: **vi** (Am) e **iii** (Em)
2. **Subdominante (Afastamento / Caminho):** Sensação de viagem, movimento suave, amplidão.
   - Acorde Principal: **IV** (F)
   - Acorde Substituto: **ii** (Dm)
3. **Dominante (Tensão / Urgência):** Sensação de instabilidade máxima que exige retorno imediato à Tônica.
   - Acorde Principal: **V** (G / G7)
   - Acorde Substituto: **vii°** (Bdim / Bm7b5)`
          },
          {
            id: 'vl33-p2',
            title: '2. O Princípio da Substituição Harmônica',
            contentMarkdown: `Se você conhece a função harmônica, pode re-harmonizar qualquer canção:
* Onde a música pede um F (Subdominante), você pode experimentar um Dm7!
* Onde pede C (Tônica), você pode experimentar um Am7!
Isso multiplica exponencialmente sua criatividade no violão.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Em',
            namePt: 'Mi Menor (Substituto de Tônica)',
            formula: '1 - b3 - 5',
            notes: ['E', 'G', 'B'],
            notesPt: ['Mi', 'Sol', 'Si'],
            frets: [0, 2, 2, 0, 0, 0],
            fingers: [0, 2, 3, 0, 0, 0],
            tips: 'Compartilha duas notas com C (E e G).',
            category: 'Tríade'
          }
        ],
        practicalExercise: {
          title: 'Exercício 33 — O Ciclo Funcional Tônica -> Subdominante -> Dominante',
          subtitle: 'Sentindo as forças dinâmicas da harmonia',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Batida rítmica fluida ou dedilhado P-I-M-A',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|--0-------0-------1-------0---|
B|--1-------1-------0-------1---|
G|--0-------2-------0-------0---|
D|--2-------3-------0-------2---|
A|--3---------------2-------3---|
E|------------------3-----------|
    C       Fmaj7   G7      C
    (Repouso -> Afastamento -> Tensão -> Repouso)`,
          instructions: [
            'Conecte o ouvido ao que o acorde "pede".',
            'Substitua o Fmaj7 por Dm7 na segunda volta e perceba a mesma função de afastamento.'
          ],
          biomechanicTips: [
            'Mantenha a respiração compassada e os ombros relaxados.'
          ],
          validationCriteria: 'Percepção clara da resolução na volta ao acorde C.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Segredo para Tirar Músicas de Ouvido',
          description: 'Ao ouvir uma canção, identifique se o acorde soa como Repouso (I), Afastamento (IV) ou Tensão (V).',
          tab: `e|----0-------0-------1-------0---|
B|----1-------1-------0-------1---|
G|----0-------2-------0-------0---|
D|----2-------3-------0-------2---|
A|--3-----------------------3-----|
E|------------------3-------------|`
        },
        commonErrors: [
          { issue: 'Achar que qualquer acorde pode ir para qualquer outro aleatoriamente.', solution: 'A harmonia tonal funciona como gravidade: Dominante atrai Tônica com força biológica.' }
        ],
        challenge: {
          title: 'Desafio Substituição Funcional',
          description: 'Toque a sequência C - F - G - C. Depois substitua por C - Dm7 - G7 - Am7. Avalie a diferença.',
          instruction: 'Note como as funções foram preservadas com cores sonoras renovadas.'
        },
        masteryCriteria: {
          learning: 'Define as 3 funções harmônicas.',
          consolidating: 'Identifica qual função cada acorde desempenha numa progressão.',
          mastered: 'Re-harmoniza músicas aplicando substitutos de função de ouvido.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 80, targetBpm: 95 },
        reviewNotes: 'Compreender funções harmônicas liberta o aluno da necessidade de memorizar cifras cegamente.'
      },
      {
        id: 'violao-lesson-34',
        level: 3,
        moduleTitle: 'Módulo 6 • Campo Harmônico',
        moduleNumber: 6,
        lessonNumber: 34,
        title: 'O Campo Harmônico Menor Natural, Harmônico e Melódico',
        subtitle: 'A riqueza e dramaticidade das escalas menores no violão',
        objective: 'Compreender as 3 vertentes do campo menor (Natural, Harmônico e Melódico) e por que o acorde V precisa ser maior (com sensível) na harmonia menor.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 31, 32 e 33.'],
        parts: [
          {
            id: 'vl34-p1',
            title: '1. O Problema da Menor Natural e a Solução Harmônica',
            contentMarkdown: `### Por Que o Grau V da Menor Precisa Ter Terça Maior?
No campo menor natural de Lá (Am):
* As notas são: A - B - C - D - E - F - G.
* O grau v gerado é **Em** (Mi - Sol - Si).
* Mas o Em NÃO tem trítono nem sensível (a nota Sol está a 1 tom inteiro de Lá, não tem força gravitacional).
* Para resolver isso, elevamos a 7ª nota em meio-tom (G vira G#) criando a **Escala Menor Harmônica**!
* Agora o grau V vira **E7** (Mi - Sol# - Si - Ré), que resolve com vigor dramático em Am!`
          },
          {
            id: 'vl34-p2',
            title: '2. Os Acordes Mestres da Tonalidade Menor',
            contentMarkdown: `Em Lá Menor (Am):
* i = **Am** ou **Am6** / **Am(maj7)**
* ii = **Bm7b5** (meio-diminuto)
* III = **C** ou **Cmaj7(#5)**
* iv = **Dm** ou **Dm7**
* V = **E7** (Dominante Maior com 7ª)
* VI = **F** ou **Fmaj7**
* vii° = **G#dim7**`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'E7',
            namePt: 'Mi Maior com Sétima (V7 do Tom Menor)',
            formula: '1 - 3 - 5 - b7',
            notes: ['E', 'G#', 'B', 'D'],
            notesPt: ['Mi', 'Sol#', 'Si', 'Ré'],
            frets: [0, 2, 0, 1, 0, 0],
            fingers: [0, 2, 0, 1, 0, 0],
            openStrings: [6, 4, 2, 1],
            tips: 'O dedo 1 na casa 1 da corda 3 é o Sol# que atrai o Lá.',
            category: 'Dominante'
          }
        ],
        practicalExercise: {
          title: 'Exercício 34 — A Cadência Menor i -> iv -> V7 -> i',
          subtitle: 'Am -> Dm -> E7 -> Am no violão acústico',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado P-I-M-A ou batida espanhola',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `e|--0-------1-------0-------0---|
B|--1-------3-------0-------1---|
G|--2-------2-------1-------2---|
D|--2-------0-------0-------2---|
A|--0---------------2-------0---|
E|------------------0-----------|
    Am      Dm      E7      Am
    i       iv      V7      i`,
          instructions: [
            'Sinta o peso trágico e nobre do acorde E7 resolvendo em Am.',
            'Experimente tocar Em no lugar do E7 e perceba como a força da resolução se esvai.'
          ],
          biomechanicTips: [
            'Na troca para o Dm, mantenha a mão relaxada sem esticar o polegar.'
          ],
          validationCriteria: 'Resolução firme e sonoridade expressiva no metrônomo.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Flamenco, Tango e Música Clássica',
          description: 'A espinha dorsal da música ibérica, do tango argentino e do fado português.',
          tab: `e|----0-------1-------0-------0---|
B|----1-------3-------0-------1---|
G|----2-------2-------1-------2---|
D|----2-----0-------0-------2-----|
A|--0---------------------0-------|
E|----------------0---------------|`
        },
        commonErrors: [
          { issue: 'Usar acorde menor no grau V em cadências menores.', solution: 'O grau V no tom menor é SEMPRE maior ou com sétima dominante (E7 em Am, A7 em Dm, D7 em Gm).' }
        ],
        challenge: {
          title: 'Desafio Cadência Andaluza',
          description: 'Toque a famosa progressão flamenca Am -> G -> F -> E7. Repare como o E7 fecha o ciclo com vigor absoluto.',
          instruction: 'Execute com ritmo enérgico de violão espanhol.'
        },
        masteryCriteria: {
          learning: 'Compreende a necessidade da sensível no tom menor.',
          consolidating: 'Toca a cadência menor com E7 e Bm7b5.',
          mastered: 'Distingue e aplica tonalidades menores com maestria técnica.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 95 },
        reviewNotes: 'O campo harmônico menor abre o universo da música dramática e emotiva.'
      },
      {
        id: 'violao-lesson-35',
        level: 2,
        moduleTitle: 'Módulo 6 • Campo Harmônico',
        moduleNumber: 6,
        lessonNumber: 35,
        title: 'Cadências Clássicas no Violão: II-V-I, I-IV-V, I-V-vi-IV e Blues Cadence',
        subtitle: 'As 4 fórmulas universais que constroem a história da música',
        objective: 'Identificar, dominar e transpor as 4 progressões cadenciais mais utilizadas no mundo: II-V-I (Jazz/Bossa), I-IV-V (Folk/Rock), I-V-vi-IV (Pop Internacional) e a Cadência Blues de 12 compassos.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 31, 32 e 33.'],
        parts: [
          {
            id: 'vl35-p1',
            title: '1. As Quatro Grandes Fórmulas',
            contentMarkdown: `### O Código Universal das Canções
1. **I - IV - V (A Fundação Folk e Rock):** C - F - G. Simples, poderoso, ancestral.
2. **I - V - vi - IV (A Máquina Pop):** C - G - Am - F. Responsável por mais de 500 sucessos mundiais.
3. **ii - V - I (A Cadência Mestra):** Dm7 - G7 - Cmaj7. O esteio do jazz, MPB e música instrumental.
4. **12-Bar Blues (A Cadência de Raiz):** I7 - IV7 - V7 em 12 compassos estruturados.`
          },
          {
            id: 'vl35-p2',
            title: '2. Por Que o ii-V-I É Tão Poderoso?',
            contentMarkdown: `No ii-V-I, o baixo caminha por saltos de 4ª ascendente (ou 5ª descendente): D -> G -> C.
Esse movimento circular de quintas é o mais natural para o sistema auditivo humano. Ao dominá-lo em várias regiões do braço, você toca qualquer música sofisticada.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Dm7',
            namePt: 'Ré Menor com Sétima (ii)',
            formula: '1 - b3 - 5 - b7',
            notes: ['D', 'F', 'A', 'C'],
            notesPt: ['Ré', 'Fá', 'Lá', 'Dó'],
            frets: [-1, -1, 0, 2, 1, 1],
            fingers: [0, 0, 0, 2, 1, 1],
            openStrings: [4],
            tips: 'Pequena mini-pestana do dedo 1 nas cordas 1 e 2 casa 1.',
            category: 'Tétrade'
          }
        ],
        practicalExercise: {
          title: 'Exercício 35 — O ii-V-I Perfeito Dm7 -> G7 -> Cmaj7',
          subtitle: 'A transição mais elegante do violão acústico',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado P - I - M - A com balanço sincopado',
          notesSequence: [
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|----1-------1-------1-------0---|
B|----1-------1-------0-------0---|
G|----2-------2-------0-------0---|
D|--0-------0-----------------2---|
A|--------------------------3-----|
E|------------------3-------------|
    Dm7 (ii)        G7 (V)  Cmaj7 (I)`,
          instructions: [
            'Toque Dm7 por 2 tempos, G7 por 2 tempos e Cmaj7 por 4 tempos.',
            'Ouça a atração do Dm7 para o G7 e a gloriosa resolução no Cmaj7.'
          ],
          biomechanicTips: [
            'O dedo 1 segura as duas cordas agudas no Dm7 com a lateral sem tensão excessiva.'
          ],
          validationCriteria: 'Resolução perfeita no tempo 1 do compasso do Cmaj7.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Repertório Global',
          description: 'Reconheça essas 4 fórmulas em qualquer música que você escutar no rádio ou no streaming.',
          tab: `e|----1---1-------1---1-------0---|
B|----1---1-------0---0-------0---|
G|----2---2-------0---0-------0---|
D|--0---0---------------------2---|
A|--------------------------3-----|
E|--------------3---3-------------|`
        },
        commonErrors: [
          { issue: 'Tocar a cadência mecanicamente sem respirar nas resoluções.', solution: 'Dê dinâmicas: toque o ii suave, o V com mais intensidade e o I com relaxamento pleno.' }
        ],
        challenge: {
          title: 'Desafio Transposição Mental',
          description: 'Qual é o ii-V-I no tom de Sol Maior?',
          instruction: 'Resposta: Am7 -> D7 -> Gmaj7. Execute no violão.'
        },
        masteryCriteria: {
          learning: 'Reconhece as 4 fórmulas mestras.',
          consolidating: 'Toca ii-V-I em C e G com precisão.',
          mastered: 'Identifica as fórmulas em canções reais instantaneamente.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 80, targetBpm: 100 },
        reviewNotes: 'As cadências mestras são os tijolos fundamentais da composição musical ocidental.'
      },
      {
        id: 'violao-lesson-36',
        level: 2,
        moduleTitle: 'Módulo 6 • Campo Harmônico',
        moduleNumber: 6,
        lessonNumber: 36,
        title: 'Transposição Imediata de Tonalidades no Violão com e sem Capotraste',
        subtitle: 'Como mudar o tom de qualquer música instantaneamente para adequar à sua voz',
        objective: 'Dominar a técnica de transposição harmônica mental usando graus do campo harmônico e o uso inteligente do capotraste físico para preservar sonoridades abertas.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 31 a 35.'],
        parts: [
          {
            id: 'vl36-p1',
            title: '1. O Que É o Capotraste e Como Ele Funciona?',
            contentMarkdown: `### A Pestana Mecânica Móvel
O capotraste (ou capo) é um acessório de pressão que atua como uma nova pestana (nut) em qualquer casa do violão:
* Se você coloca o capotraste na **casa 2**, todas as cordas soltas sobem 1 tom inteiro (F# - B - E - A - C# - F#).
* Se você montar a digitação aberta de **C**, o som real produzido será **D**!
* Se você montar a digitação aberta de **G**, o som real produzido será **A**!
Isso permite manter as ricas cordas soltas e digitações fáceis em qualquer tom exigido pelo cantor.`
          },
          {
            id: 'vl36-p2',
            title: '2. Transposição Mental por Graus (Sem Capotraste)',
            contentMarkdown: `Se uma música está em C (C - Am - F - G) e você precisa subir 1 tom para D:
* Analise em números: I - vi - IV - V.
* Aplique os mesmos números no tom de D:
  - I = **D**
  - vi = **Bm**
  - IV = **G**
  - V = **A**
Você transpôs a música inteira em 5 segundos sem consultar partitura ou cifra!`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Bm',
            namePt: 'Si Menor (Grau vi em Ré)',
            formula: '1 - b3 - 5',
            notes: ['B', 'D', 'F#'],
            notesPt: ['Si', 'Ré', 'Fá#'],
            frets: [-1, 2, 4, 4, 3, 2],
            fingers: [0, 1, 3, 4, 2, 1],
            avoidStrings: [6],
            tips: 'Pestana na casa 2 a partir da 5ª corda.',
            category: 'Pestana'
          }
        ],
        practicalExercise: {
          title: 'Exercício 36 — Transposição da Progressão I-vi-IV-V de C para D',
          subtitle: 'Tocando a mesma estrutura harmônica em duas tonalidades',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Batida rítmica padrão pop',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `Parte 1 (Tom de C):
e|--0-----0-----1-----3---|
B|--1-----1-----1-----0---|
G|--0-----2-----2-----0---|
D|--2-----2-----3-----0---|
A|--3-----0-----------2---|
E|--------------1-----3---|
    C     Am    F     G

Parte 2 (Tom de D):
e|--2-----2-----3-----0---|
B|--3-----3-----0-----2---|
G|--2-----4-----0-----2---|
D|--0-----4-----0-----2---|
A|--------2-----2-----0---|
E|--------------3---------|
    D     Bm    G     A`,
          instructions: [
            'Toque a Parte 1 em Dó.',
            'Em seguida, toque a Parte 2 em Ré mantendo a mesma pulsação e dinâmica.'
          ],
          biomechanicTips: [
            'Na transição para Bm, posicione o indicador bem reto encostado no traste de ferro 2.'
          ],
          validationCriteria: 'Transição perfeita entre as duas tonalidades a 65 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Companheiro Perfeito de Cantores',
          description: 'A habilidade que torna o violonista disputado por vocalistas: adequar o tom da canção em tempo real.',
          tab: `e|----0---0-------2---2---|
B|----1---1-------3---3---|
G|----0---0-------2---2---|
D|----2---2-----0---0-----|
A|--3---3-----------------|
E|------------------------|`
        },
        commonErrors: [
          { issue: 'Tentar transpor decorando notas isoladas.', solution: 'Pense sempre em graus (I, IV, V) e nunca em nomes fixos de acordes.' }
        ],
        challenge: {
          title: 'Desafio Capotraste Inteligente',
          description: 'Você precisa tocar uma música no tom de Eb Maior (Mi Bemol). Como usar o capotraste?',
          instruction: 'Solução: Ponha o capo na casa 1 e toque como D, ou ponha o capo na casa 3 e toque como C!'
        },
        masteryCriteria: {
          learning: 'Compreende como o capotraste afeta a afinação.',
          consolidating: 'Transpõe progressões de C para D e G mentalmente.',
          mastered: 'Altera o tom de qualquer música instantaneamente sob demanda.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Você concluiu a primeira metade do Domínio Total do Violão: harmonia tonal, inversões e campos harmônicos dominados.'
      }
    ]
  }
];

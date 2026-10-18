import { LevelInfo } from '../types';

export const CURRICULUM_LEVELS: LevelInfo[] = [
  {
    level: 0,
    name: 'NÍVEL 0 — ABSOLUTO ZERO',
    subtitle: 'Primeiros passos, anatomia da guitarra, afinação, notas e coordenação',
    badge: 'Iniciante',
    description: 'Aprenda os fundamentos inegociáveis: afinação padrão na guitarra física, o alfabeto musical, tons e semitons, e sua primeira prática de coordenação motora com metrônomo.',
    lessons: [
      {
        id: 'lesson-1',
        level: 0,
        moduleTitle: 'Módulo A: Fundamentos Musicais',
        lessonNumber: 1,
        title: 'Aula 1 — As Cordas da Guitarra e Afinação Padrão',
        subtitle: 'As sete notas naturais, a cifra internacional e afinação das 6 cordas na guitarra física',
        objective: 'Compreender o nome das cordas da guitarra física, memorizar a cifra universal (A a G) e aprender a afinar o instrumento real com som de referência.',
        estimatedMinutes: 15,
        parts: [
          {
            id: 'l1-part-a',
            title: 'Parte A — As sete notas musicais e cifras',
            contentMarkdown: `
### As 7 Notas Naturais e a Cifra Universal

A música ocidental é construída a partir de sete notas naturais principais:

**Dó — Ré — Mi — Fá — Sol — Lá — Si**

Na notação internacional moderna (usada universalmente em partituras, tablaturas e cifras), utilizamos letras de **A** a **G**, iniciando pela nota Lá:

* **A** = Lá
* **B** = Si
* **C** = Dó
* **D** = Ré
* **E** = Mi
* **F** = Fá
* **G** = Sol

> 💡 **Regra de Ouro:** Guarde na memória imediata! Ao ler **E**, pense na hora em **Mi**. Ao ler **A**, pense em **Lá**. Ao ler **C**, pense em **Dó**.

Após o Si (B), a escala recomeça em Dó (C) em uma altura mais aguda (a **oitava superior**).
            `,
          },
          {
            id: 'l1-part-b',
            title: 'Parte B — As seis cordas na guitarra física',
            contentMarkdown: `
### A Afinação Padrão (Standard Tuning: E-A-D-G-B-E)

Pegue sua guitarra física no colo. Numeramos as cordas **da mais fina (1ª) para a mais grossa (6ª)**.

Eis a afinação padrão com sua respectiva nota e altura sonora:

* **6ª corda (mais grossa):** **E** — Mi grave (E2, ~82.4 Hz)
* **5ª corda:** **A** — Lá (A2, 110 Hz)
* **4ª corda:** **D** — Ré (D3, ~146.8 Hz)
* **3ª corda:** **G** — Sol (G3, ~196 Hz)
* **2ª corda:** **B** — Si (B3, ~246.9 Hz)
* **1ª corda (mais fina):** **E** — Mi agudo (E4, ~329.6 Hz)

> 🎸 **Exercício Prático na Guitarra Física:**
> Toque a 6ª corda solta com o polegar ou palheta. Ouça a ressonância encorpada do grave.
> Em seguida, toque a 1ª corda solta. Note que ambas são a nota **Mi (E)**, porém a 1ª corda está duas oitavas acima da 6ª corda!
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 0, label: '6ª: E (Mi)' },
                { stringIndex: 4, fret: 0, label: '5ª: A (Lá)' },
                { stringIndex: 3, fret: 0, label: '4ª: D (Ré)' },
                { stringIndex: 2, fret: 0, label: '3ª: G (Sol)' },
                { stringIndex: 1, fret: 0, label: '2ª: B (Si)' },
                { stringIndex: 0, fret: 0, label: '1ª: E (Mi)' },
              ]
            }
          },
          {
            id: 'l1-part-c',
            title: 'Parte C — Como afinar por comparação auditiva',
            contentMarkdown: `
### O Método Prático de Afinação por Ouvido

1. Toque o botão de referência sonora acima para a corda que deseja afinar.
2. Com a palheta, toque a corda solta correspondente na sua guitarra física.
3. Se o som da sua guitarra estiver mais grave (frouxo), gire a tarraxa suavemente no sentido que estica a corda.
4. Se o som estiver mais agudo, afrouxe e depois volte subindo até coincidir.
5. Quando as duas notas vibrarem sem ondas de atrito ("batimentos"), a corda estará afinada!
            `,
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q1',
              question: 'Qual é o nome e a cifra da 6ª corda solta (a mais grossa)?',
              options: ['Mi (E)', 'Lá (A)', 'Sol (G)', 'Ré (D)'],
              correctIndex: 0,
              explanation: 'A 6ª corda solta é afinada em Mi grave (cifra E). É o alicerce harmônico do grave da guitarra.'
            },
            {
              id: 'q2',
              question: 'Qual letra representa a nota Lá na notação universal de cifras?',
              options: ['A', 'L', 'C', 'B'],
              correctIndex: 0,
              explanation: 'A nota Lá é representada pela letra A (o alfabeto musical começa no Lá: A=Lá, B=Si, C=Dó...).'
            },
            {
              id: 'q3',
              question: 'Qual é a relação musical entre a 1ª corda solta e a 6ª corda solta?',
              options: [
                'Ambas são a nota Mi (E), separadas por duas oitavas',
                'São notas completamente diferentes',
                'A 1ª corda é Si e a 6ª é Mi',
                'A 1ª corda é Sol e a 6ª é Lá'
              ],
              correctIndex: 0,
              explanation: 'A 1ª e a 6ª corda soltas são a mesma nota Mi (E), com a 1ª corda sendo duas oitavas mais aguda.'
            },
            {
              id: 'q4',
              question: 'Qual é a sequência exata da afinação padrão da 6ª para a 1ª corda?',
              options: [
                'E — A — D — G — B — E',
                'E — B — G — D — A — E',
                'C — D — E — F — G — A',
                'A — B — C — D — E — F'
              ],
              correctIndex: 0,
              explanation: 'Da 6ª (grave) para a 1ª (aguda): Mi (E), Lá (A), Ré (D), Sol (G), Si (B), Mi (E).'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l1-open-strings-alt-picking',
          title: 'Exercício Prático 1 — As 6 Cordas Soltas com Palhetada Alternada a 60 BPM',
          subtitle: 'Coordenação rítmica, ângulo da palheta e sincronia das 6 cordas no tempo exato do metrônomo',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ ↓ ↑ (Down-Up Estrito)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 0 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 0 },
            { stringNumber: 2, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 0 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 0 },
          ],
          tablatureText: `e|---------------------------------0--|
B|--------------------------0---------|
G|-------------------0----------------|
D|------------0-----------------------|
A|-----0------------------------------|
E|--0---------------------------------|
    ↓  ↑      ↓      ↑      ↓      ↑
    E  A      D      G      B      E
   6ª 5ª     4ª     3ª     2ª     1ª corda`,
          instructions: [
            'Pegue sua guitarra física, posicione-se confortavelmente e certifique-se de que o instrumento está afinado.',
            'Segure a palheta firme porém sem tensão excessiva entre o polegar e a lateral do dedo indicador.',
            'Ligue o metrônomo calibrado em 60 BPM.',
            'A cada batida (clique) do metrônomo, execute uma corda solta, alternando rigorosamente a direção da palheta:',
            '1. No clique 1: 6ª corda (E) com palhetada para BAIXO (↓)',
            '2. No clique 2: 5ª corda (A) com palhetada para CIMA (↑)',
            '3. No clique 3: 4ª corda (D) com palhetada para BAIXO (↓)',
            '4. No clique 4: 3ª corda (G) com palhetada para CIMA (↑)',
            '5. No clique 1 do compasso seguinte: 2ª corda (B) com palhetada para BAIXO (↓)',
            '6. No clique 2 do compasso seguinte: 1ª corda (E) com palhetada para CIMA (↑)',
            'Ao completar a passagem pelas 6 cordas sem esbarrar nas outras cordas e no tempo exato do metrônomo, registre 1 repetição concluída no contador abaixo.',
            'O objetivo de maestria é realizar 10 repetições limpas seguidas a 60 BPM.'
          ],
          biomechanicTips: [
            'O movimento deve partir do pulso relaxado como se estivesse girando uma chave de fechadura, e não do cotovelo ou dos nós dos dedos.',
            'Incline a palheta em aproximadamente 45° em relação ao plano das cordas para que ela deslize suavemente sem travar.',
            'A amplitude do movimento da palheta não deve passar de 3 a 5 milímetros após tocar a corda.',
            'Nunca repita duas palhetadas no mesmo sentido (ex: ↓ ↓). A regra da palhetada alternada estrita (Down-Up) é sagrada para o seu desenvolvimento motor.'
          ],
          validationCriteria: 'Executar 10 ciclos completos pelas 6 cordas a 60 BPM sem falhar na alternância ↓ ↑ e com sonoridade nítida e uniforme.'
        }
      },
      {
        id: 'lesson-2',
        level: 0,
        moduleTitle: 'Módulo A: Fundamentos Musicais',
        lessonNumber: 2,
        title: 'Aula 2 — Tons, Semitons e Localização no Braço Real',
        subtitle: 'A regra Mi-Fá e Si-Dó, sustenidos, bemóis e o mapa das casas 0 a 12',
        objective: 'Compreender que cada casa na guitarra física equivale a um semitom e conseguir encontrar qualquer nota ao longo das cordas 6 e 5.',
        estimatedMinutes: 20,
        parts: [
          {
            id: 'l2-part-a',
            title: 'Parte A — Cada casa é um semitom',
            contentMarkdown: `
### A Matemática do Braço da Guitarra

* **1 Semitom (meio tom):** É a menor distância comum no ocidente. Na guitarra física, **avançar 1 casa = subir 1 semitom**.
* **1 Tom Inteiro:** Equivale a **2 semitons**. Na guitarra física, **avançar 2 casas = subir 1 tom**.

### A Regra de Ouro dos Semitons Naturais

Entre todas as notas naturais existe 1 tom inteiro de distância (2 casas), **com duas exceções vitais**:
* Entre **Mi e Fá** há apenas **1 semitom** (1 casa de distância).
* Entre **Si e Dó** há apenas **1 semitom** (1 casa de distância).

\`\`\`
Dó ==(1 Tom)==> Ré ==(1 Tom)==> Mi =(1 Semitom)=> Fá ==(1 Tom)==> Sol ==(1 Tom)==> Lá ==(1 Tom)==> Si =(1 Semitom)=> Dó
\`\`\`
            `,
          },
          {
            id: 'l2-part-b',
            title: 'Parte B — Localizando notas na 6ª corda física',
            contentMarkdown: `
### Prática Obrigatória na sua Guitarra Física:

Com a guitarra na mão, coloque o dedo 1 logo atrás do traste metálico e toque:

1. **Corda solta:** **Mi (E)**
2. **Casa 1:** **Fá (F)** — (1 semitom após Mi)
3. **Casa 3:** **Sol (G)** — (1 tom após Fá, repare no primeiro inlay/ponto)
4. **Casa 5:** **Lá (A)** — (1 tom após Sol, ponto na 5ª casa!)
5. **Casa 7:** **Si (B)** — (1 tom após Lá, ponto na 7ª casa)
6. **Casa 8:** **Dó (C)** — (1 semitom após Si, sem casa no meio!)
7. **Casa 10:** **Ré (D)** — (1 tom após Dó)
8. **Casa 12:** **Mi (E)** — (marcação dupla de dois pontos: a oitava completa da corda solta!)

> 🎯 **Meta Prática:** Feche os olhos. Posicione o dedo diretamente na casa 3 (Sol) e casa 5 (Lá) da 6ª corda sem hesitar.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 0, label: 'E' },
                { stringIndex: 5, fret: 1, label: 'F' },
                { stringIndex: 5, fret: 3, label: 'G' },
                { stringIndex: 5, fret: 5, label: 'A' },
                { stringIndex: 5, fret: 7, label: 'B' },
                { stringIndex: 5, fret: 8, label: 'C' },
                { stringIndex: 5, fret: 10, label: 'D' },
                { stringIndex: 5, fret: 12, label: 'E' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l2-q1',
              question: 'Quantas casas você deve avançar no braço da guitarra para subir 1 tom inteiro?',
              options: ['2 casas', '1 casa', '3 casas', '4 casas'],
              correctIndex: 0,
              explanation: 'Cada casa equivale a 1 semitom. Portanto, 1 tom inteiro equivale exatamente ao deslocamento de 2 casas.'
            },
            {
              id: 'l2-q2',
              question: 'Quais são os dois únicos pares de notas naturais que têm apenas 1 semitom (1 casa) entre si?',
              options: ['Mi–Fá e Si–Dó', 'Dó–Ré e Fá–Sol', 'Lá–Si e Sol–Lá', 'Ré–Mi e Fá–Sol'],
              correctIndex: 0,
              explanation: 'Entre Mi e Fá, e entre Si e Dó, não existe nota intermediária na escala natural: a distância é de apenas 1 semitom.'
            },
            {
              id: 'l2-q3',
              question: 'Na 6ª corda da guitarra (Mi solta), qual nota você toca ao apertar a casa 5?',
              options: ['Lá (A)', 'Sol (G)', 'Si (B)', 'Fá (F)'],
              correctIndex: 0,
              explanation: 'Casa 0 = Mi, Casa 1 = Fá, Casa 3 = Sol, Casa 5 = Lá (A). Essa nota é a tônica da Pentatônica mais famosa da guitarra!'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l2-fretboard-walk',
          title: 'Exercício Prático 2 — A Caminhada das Notas na 6ª Corda a 60 BPM',
          subtitle: 'Memorização auditiva e motora das notas naturais da casa 0 até a casa 12',
          targetBpm: 60,
          targetRepetitions: 8,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ (Palhetada Alternada nos cliques)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'F', notePt: 'Fá', pickDirection: 'up', fret: 1 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 5 },
            { stringNumber: 6, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 7 },
            { stringNumber: 6, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 8 },
            { stringNumber: 6, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 10 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 12 },
          ],
          tablatureText: `E|--0---1---3---5---7---8---10---12--|
    ↓   ↑   ↓   ↑   ↓   ↑   ↓    ↑
    Mi  Fá  Sol Lá  Si  Dó  Ré   Mi
    c.0 c.1 c.3 c.5 c.7 c.8 c.10 c.12`,
          instructions: [
            'Ligue o metrônomo a 60 BPM.',
            'Toque a 6ª corda com palhetada alternada executando cada nota no clique do metrônomo.',
            'Diga o nome da nota em voz alta ao tocar (ex: "Mi", "Fá", "Sol", "Lá").',
            'Preste atenção especial à transição Mi-Fá (c.0 para c.1) e Si-Dó (c.7 para c.8), onde há apenas 1 casa.',
            'Complete a subida e a descida completa para registrar 1 repetição.'
          ],
          biomechanicTips: [
            'Pressione as cordas com a ponta dos dedos, imediatamente atrás do traste metálico para evitar qualquer zumbido.',
            'Mantenha o polegar atrás do braço, alinhado à altura da casa 3 a 5.'
          ],
          validationCriteria: 'Completar 8 passagens limpas na 6ª corda sem hesitar nas posições das casas naturais.'
        }
      },
      {
        id: 'lesson-3',
        level: 0,
        moduleTitle: 'Módulo D: Técnica e Rotina de Prática',
        lessonNumber: 3,
        title: 'Aula 3 — Postura, Palhetada Alternada e Coordenação 1-2-3-4',
        subtitle: 'Empunhadura da palheta, dedos curvados e independência motora das duas mãos',
        objective: 'Desenvolver a pega correta da palheta, evitar tensão desnecessária nos ombros e executar o exercício 1-2-3-4 com palhetada alternada estrita.',
        estimatedMinutes: 20,
        parts: [
          {
            id: 'l3-part-a',
            title: 'Parte A — Como empunhar a palheta e postura corporal',
            contentMarkdown: `
### A Pegada Correta da Palheta
1. Coloque a palheta sobre a lateral do primeiro nó do indicador da mão direita.
2. Pouse o polegar por cima, formando uma pinça suave a 90 graus.
3. Deixe apenas 3 a 4 milímetros da ponta plástica aparecendo.
4. **O movimento vem do pulso relaxado**, nunca do cotovelo ou antebraço travado.

### A Mão Esquerda no Braço
* Polegar apoiado na metade traseira do braço da guitarra, na altura do dedo médio.
* Dedos curvados como pequenas "garrinhas", usando a ponta almofadada (próxima à unha).
* Pressione a corda rente ao traste de metal para que o som saia limpo sem exigir força excessiva.
            `,
          },
          {
            id: 'l3-part-b',
            title: 'Parte B — O Exercício 1-2-3-4 com Palhetada Alternada',
            contentMarkdown: `
### Tablatura do Exercício 1-2-3-4:

\`\`\`
1ª corda -----------------------------------------1-2-3-4--
2ª corda ---------------------------------1-2-3-4----------
3ª corda -------------------------1-2-3-4------------------
4ª corda -----------------1-2-3-4--------------------------
5ª corda ---------1-2-3-4----------------------------------
6ª corda -1-2-3-4------------------------------------------
Palheta:   ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑
Dedos:     1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4
\`\`\`

**Regras Inegociáveis:**
1. **Palhetada Estritamente Alternada:** Baixo (↓), Cima (↑), Baixo (↓), Cima (↑). Jamais dê duas palhetadas seguidas para baixo!
2. Deixe os dedos anteriores descansando na corda conforme avança, treinando a estabilidade da mão.
3. Não aumente a velocidade antes de cada nota soar 100% limpa e sem zumbido (trastejamento).
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 1, label: '1' },
                { stringIndex: 5, fret: 2, label: '2' },
                { stringIndex: 5, fret: 3, label: '3' },
                { stringIndex: 5, fret: 4, label: '4' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l3-q1',
              question: 'De onde deve partir prioritariamente o movimento da mão da palheta?',
              options: [
                'Do pulso relaxado (movimento circular como girar uma chave)',
                'Do cotovelo rígido',
                'Do ombro travado',
                'Exclusivamente da ponta dos dedos polegar e indicador'
              ],
              correctIndex: 0,
              explanation: 'O movimento eficiente da palhetada parte do pulso relaxado, prevenindo lesões por esforço repetitivo e garantindo velocidade no futuro.'
            },
            {
              id: 'l3-q2',
              question: 'Onde os dedos da mão esquerda devem pressionar a corda para produzir um som nítido sem forçar?',
              options: [
                'Logo atrás do traste de metal da casa',
                'Exatamente em cima do ferro do traste',
                'Bem no meio da casa, longe do traste',
                'Próximo ao traste anterior da casa mais grave'
              ],
              correctIndex: 0,
              explanation: 'Apoiar o dedo logo atrás do traste metálico exige a menor força física possível e elimina o trastejamento.'
            },
            {
              id: 'l3-q3',
              question: 'O que significa rigorosamente "Palhetada Alternada Estrita"?',
              options: [
                'Alternar rigorosamente entre palhetada para baixo (↓) e para cima (↑)',
                'Palhetar sempre para baixo para ter mais força',
                'Palhetar para cima quando a corda for aguda e para baixo nos graves',
                'Palhetar apenas com o polegar'
              ],
              correctIndex: 0,
              explanation: 'A alternância contínua ↓ ↑ cria o motor rítmico automático e a independência das duas mãos.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l3-chromatic-1234',
          title: 'Exercício Prático 3 — Independência 1-2-3-4 na 6ª e 5ª Corda a 60 BPM',
          subtitle: 'Sincronia biomecânica dos 4 dedos com palhetada alternada rigorosa',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ (Baixo-Cima Estrito)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 1 },
            { stringNumber: 6, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'up', fret: 2 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'G#', notePt: 'Sol#', pickDirection: 'up', fret: 4 },
            { stringNumber: 5, noteCipher: 'A#', notePt: 'Lá#', pickDirection: 'down', fret: 1 },
            { stringNumber: 5, noteCipher: 'B', notePt: 'Si', pickDirection: 'up', fret: 2 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C#', notePt: 'Dó#', pickDirection: 'up', fret: 4 },
          ],
          tablatureText: `A|------------------1-2-3-4--|
E|--1-2-3-4------------------|
    ↓ ↑ ↓ ↑         ↓ ↑ ↓ ↑
    D1 D2 D3 D4     D1 D2 D3 D4`,
          instructions: [
            'Ligue o metrônomo a 60 BPM.',
            'Dedo 1 na casa 1, Dedo 2 na casa 2, Dedo 3 na casa 3, Dedo 4 (mínimo) na casa 4.',
            'Toque uma nota por batida do metrônomo, alternando a palheta ↓ ↑ ↓ ↑.',
            'Ao colocar o Dedo 2, deixe o Dedo 1 repousando na corda. Faça o mesmo com os demais.',
            'Execute 10 séries completas limpas sem trastejar nem perder o clique do metrônomo.'
          ],
          biomechanicTips: [
            'Curve o dedo mínimo (dedo 4) em vez de esticá-lo reto: a força deve concentrar-se na ponta do dedo.',
            'Não levante os dedos mais do que 1 a 2 centímetros da escala ao trocá-los.'
          ],
          validationCriteria: '10 repetições perfeitas a 60 BPM com todas as 8 notas soando limpas e sem atrasar a batida.'
        }
      },
      {
        id: 'lesson-4',
        level: 0,
        moduleTitle: 'Módulo D: Técnica e Rotina de Prática',
        lessonNumber: 4,
        title: 'Aula 4 — Pulsação, Compasso 4/4 e Treino com Metrônomo',
        subtitle: 'Como estudar com precisão rítmica, semínimas e colcheias a 60, 70 e 80 BPM',
        objective: 'Aprender a sincronizar a palhetada física com a pulsação do metrônomo a 60 BPM sem correr nem atrasar.',
        estimatedMinutes: 20,
        parts: [
          {
            id: 'l4-part-a',
            title: 'Parte A — A Pulsação e o Compasso 4/4',
            contentMarkdown: `
### O Ritmo é Metade da Música

Você pode tocar as notas mais bonitas do mundo: se o ritmo falhar, a música desmorona.

* **BPM (Batidas Por Minuto):** A velocidade do tempo musical. 60 BPM = 1 batida por segundo.
* **Compasso 4/4:** Cada compasso tem 4 tempos regulares. O tempo 1 recebe uma acentuação natural mais forte.

### Semínimas vs Colcheias na Prática
* **Semínima (1 nota por clique):** Você palheta exatamente no clique do metrônomo (1, 2, 3, 4).
* **Colcheia (2 notas por clique):** Você divide o clique ao meio: "1 e, 2 e, 3 e, 4 e".
  - No número (tempo), a palheta vai para **BAIXO (↓)**.
  - No "e" (contratempo), a palheta vai para **CIMA (↑)**.
            `,
          },
          {
            id: 'l4-part-b',
            title: 'Parte B — Rotina Guiada com Metrônomo a 60 BPM',
            contentMarkdown: `
### Prática com a Guitarra Física:
1. Abra a aba **Metrônomo** e configure para **60 BPM**, compasso 4/4.
2. Toque a 6ª corda solta apenas nos cliques (1 nota por batida) por 1 minuto.
3. Em seguida, toque o exercício 1-2-3-4 na 6ª corda a 60 BPM (1 nota por batida: casa 1 no tempo 1, casa 2 no tempo 2, casa 3 no tempo 3, casa 4 no tempo 4).
4. Suba para 70 BPM somente após conseguir 4 compassos seguidos sem errar!
            `,
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l4-q1',
              question: 'Em um compasso 4/4 a 60 BPM, quantas batidas ocorrem em 1 minuto?',
              options: ['Exatamente 60 batidas (1 por segundo)', '120 batidas', '4 batidas', '240 batidas'],
              correctIndex: 0,
              explanation: 'BPM significa Batidas Por Minuto. 60 BPM é a cadência do ponteiro dos segundos do relógio.'
            },
            {
              id: 'l4-q2',
              question: 'Quando tocamos colcheias ("1 e, 2 e, 3 e, 4 e"), em qual direção a palheta deve se mover no "e" (contratempo)?',
              options: [
                'Para CIMA (↑)',
                'Para BAIXO (↓)',
                'Tanto faz',
                'Com o polegar apenas'
              ],
              correctIndex: 0,
              explanation: 'No tempo principal a palheta desce (↓) e no contratempo ("e") a palheta sobe (↑), criando o pêndulo natural do ritmo.'
            },
            {
              id: 'l4-q3',
              question: 'Qual é o sinal de que você deve aumentar o andamento do metrônomo para o próximo degrau (ex: de 60 para 70 BPM)?',
              options: [
                'Quando executar o exercício sem nenhum erro, sem tensão muscular e no tempo exato por vários compassos',
                'Assim que conseguir tocar a primeira repetição rápida',
                'Depois de 30 segundos, independentemente de erros',
                'Quando as notas estiverem abafadas'
              ],
              correctIndex: 0,
              explanation: 'A velocidade é consequência direta da precisão e do relaxamento. Nunca acelere com erros pendentes.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l4-metronome-pulse',
          title: 'Exercício Prático 4 — Pulsação de Semínimas e Colcheias a 60 BPM',
          subtitle: 'Domínio do compasso 4/4 com metrônomo estrito na guitarra física',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ (Semínimas) e ↓ ↑ (Colcheias)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 0 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 0 },
          ],
          tablatureText: `Compasso 1 (Semínimas - 6ª corda E):
E|--0-----0-----0-----0---|
    ↓     ↓     ↓     ↓
    1     2     3     4

Compasso 2 (Colcheias - 5ª corda A):
A|--0-0---0-0---0-0---0-0-|
    ↓ ↑   ↓ ↑   ↓ ↑   ↓ ↑
    1 e   2 e   3 e   4 e`,
          instructions: [
            'Ligue o metrônomo a 60 BPM.',
            'No primeiro compasso de 4 tempos, toque a 6ª corda solta exatamente na cabeça de cada batida (1, 2, 3, 4) com palhetada para baixo (↓).',
            'No segundo compasso, toque a 5ª corda solta em colcheias (1 e, 2 e, 3 e, 4 e) alternando rigorosamente ↓ ↑.',
            'O clique do metrônomo deve "desaparecer" sob o ataque da sua palheta de tão sincronizado que você estiver.',
            'Complete 10 ciclos perfeitos para registrar maestria rítmica.'
          ],
          biomechanicTips: [
            'Bata o pé no chão suavemente junto com o clique do metrônomo para internalizar a pulsação corporal.',
            'Mantenha a mão da palheta balançando como um pêndulo contínuo, mesmo quando não for tocar.'
          ],
          validationCriteria: 'Executar 10 ciclos de 2 compassos a 60 BPM com precisão rítmica cirúrgica sem oscilar o tempo.'
        }
      }
    ]
  },
  {
    level: 1,
    name: 'NÍVEL 1 — ACORDES ABERTOS, WORSHIP E GROOVE',
    subtitle: 'Primeiros acordes, transições no ar, levadas rítmicas e o trio Cadd9 / G / Em7 / D',
    badge: 'Fundamentos',
    description: 'Construa uma base harmônica sólida na guitarra física: os acordes abertos, a técnica dos dedos 3 e 4 travados como âncora, levadas de worship, pop e balada com dinâmicas e acentuações.',
    lessons: [
      {
        id: 'lesson-5',
        level: 1,
        moduleTitle: 'Módulo C: Acordes Abertos, Worship e Groove',
        lessonNumber: 5,
        title: 'Aula 5 — Acordes Maiores e Menores Abertos: E, Em, A e Am',
        subtitle: 'A diferença emocional entre Terça Maior e Terça Menor e a clareza de cada corda',
        objective: 'Aprender a montar com precisão os acordes Mi Maior (E), Mi Menor (Em), Lá Maior (A) e Lá Menor (Am) na guitarra física, garantindo que nenhuma corda soe abafada por engano.',
        estimatedMinutes: 25,
        parts: [
          {
            id: 'l5-part-a',
            title: 'Parte A — Tríades Maiores vs Tríades Menores',
            contentMarkdown: `
### A Alma do Acorde: A Terça

Um acorde básico é uma tríade: **Tônica (1) + Terça (3) + Quinta (5)**.
* **Terça Maior (4 semitons da tônica):** Soa alegre, aberto, brilhante (ex: **E**, **A**).
* **Terça Menor (3 semitons da tônica):** Soa introspectivo, melancólico, emotivo (ex: **Em**, **Am**).

Veja como no braço da guitarra a diferença física é minúscula:
* No **Mi Maior (E)**, o dedo 1 segura a 3ª corda na casa 1 (nota Sol#).
* No **Mi Menor (Em)**, basta **levantar o dedo 1**! A 3ª corda fica solta na nota Sol natural, transformando a terça maior em terça menor.
            `,
          },
          {
            id: 'l5-part-b',
            title: 'Parte B — Diagramas Estáticos e Dedilhados Sugeridos',
            contentMarkdown: `
### 1. Mi Menor (Em):
* Cordas: 6ª solta, 5ª casa 2 (dedo 2), 4ª casa 2 (dedo 3), 3ª solta, 2ª solta, 1ª solta.
* Toque todas as 6 cordas.

### 2. Mi Maior (E):
* Mesma posição do Em, adicionando o dedo 1 na 3ª corda, casa 1.

### 3. Lá Menor (Am):
* Desça a forma do Mi Maior exatamente 1 corda para baixo!
* Cordas: 6ª abafada com a ponta do polegar, 5ª solta, 4ª casa 2 (dedo 2), 3ª casa 2 (dedo 3), 2ª casa 1 (dedo 1), 1ª solta.
* Palhete da 5ª corda para baixo.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 4, fret: 2, label: 'B' },
                { stringIndex: 3, fret: 2, label: 'E' },
                { stringIndex: 2, fret: 1, label: 'G#' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l5-q1',
              question: 'Qual intervalo musical define se um acorde soa Maior ou Menor?',
              options: ['A Terça (Maior ou Menor)', 'A Quinta Justa', 'A Oitava', 'O Baixo da corda solta'],
              correctIndex: 0,
              explanation: 'A terça é o intervalo determinante: a terça maior confere brilho e alegria; a terça menor confere melancolia.'
            },
            {
              id: 'l5-q2',
              question: 'Fisicamente, qual é a única diferença na digitação entre o Mi Maior (E) e o Mi Menor (Em)?',
              options: [
                'Basta soltar o dedo 1 da 3ª corda (casa 1 fica solta na nota Sol)',
                'Mudar todos os dedos de corda',
                'Avançar 2 casas para a frente',
                'Abafar a 6ª corda'
              ],
              correctIndex: 0,
              explanation: 'Ao levantar o dedo 1, a nota Sol# (terça maior) vira Sol natural (terça menor na 3ª corda solta).'
            },
            {
              id: 'l5-q3',
              question: 'A partir de qual corda devemos palhetar o acorde de Lá Menor (Am)?',
              options: ['A partir da 5ª corda solta (nota Lá)', 'A partir da 6ª corda solta', 'Apenas as 3 cordas mais agudas', 'A partir da 4ª corda'],
              correctIndex: 0,
              explanation: 'A tônica do Am é a nota Lá, que é a 5ª corda solta. A 6ª corda deve ser abafada suavemente pelo polegar.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l5-clean-chords-arpeggio',
          title: 'Exercício Prático 5 — Arpejo de Ressonância Limpa de E e Am a 60 BPM',
          subtitle: 'Teste da clareza individual das cordas para eliminar abafamento acidental',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↓ ↓ ↓ ↓ ↓ (Arpejo descendente)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 2 },
            { stringNumber: 4, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'G#', notePt: 'Sol#', pickDirection: 'down', fret: 1 },
            { stringNumber: 2, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 0 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
          ],
          tablatureText: `Acorde Mi Maior (E):
e|----------0---|
B|---------0----|
G|--------1-----| (Dedo 1 - certifique-se de que não esbarra na 2ª corda!)
D|-------2------| (Dedo 3)
A|------2-------| (Dedo 2)
E|-----0--------|

Acorde Lá Menor (Am):
e|----------0---|
B|---------1----| (Dedo 1)
G|--------2-----| (Dedo 3)
D|-------2------| (Dedo 2)
A|------0-------| (5ª corda solta)
E|-----(X)------| (6ª abafada)`,
          instructions: [
            'Monte o acorde Mi Maior (E) na sua guitarra física.',
            'Ligue o metrônomo a 60 BPM.',
            'Toque corda por corda, da 6ª até a 1ª corda, escutando atentamente se todas vibram com clareza.',
            'Se alguma corda sair com som surdo ("thump"), curve mais as falanges dos dedos.',
            'Em seguida, desça a forma para Lá Menor (Am) e repita corda a corda.',
            'Complete 10 transições limpas com som 100% cristalino.'
          ],
          biomechanicTips: [
            'Mantenha as unhas da mão esquerda cortadas curtas para que a ponta dos dedos atinja a escala perpendicularmente.',
            'Não encoste a palma da mão na parte inferior do braço da guitarra para não esbarrar na 1ª corda.'
          ],
          validationCriteria: 'Executar 10 transições perfeitas entre E e Am com todas as cordas soando límpidas.'
        }
      },
      {
        id: 'lesson-6',
        level: 1,
        moduleTitle: 'Módulo C: Acordes Abertos, Worship e Groove',
        lessonNumber: 6,
        title: 'Aula 6 — C, G e D: O Triângulo de Ouro do Pop/Rock',
        subtitle: 'Dominando o Dó Maior, Sol Maior e Ré Maior com transições contínuas',
        objective: 'Aprender a forma aberta de C, G e D e praticar a troca de acordes no ar mantendo a mão direita em movimento contínuo.',
        estimatedMinutes: 25,
        parts: [
          {
            id: 'l6-part-a',
            title: 'Parte A — A Troca de Acordes no Ar',
            contentMarkdown: `
### O Segredo para não Parar a Mão Rítmica

O erro clássico do estudante é parar a mão da palheta enquanto os dedos da mão esquerda procuram a posição do próximo acorde.

**A Regra da Continuidade:**
1. A mão direita é um metrônomo inquebrável: ela não pode parar de balançar.
2. Monte os dedos "no ar", antes de encostarem na escala.
3. Se o tempo da troca chegou e um dedo ainda não assentou completamente, soe o acorde mesmo assim! O cérebro aprenderá a acelerar a transição.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 4, fret: 3, label: 'C' },
                { stringIndex: 3, fret: 2, label: 'E' },
                { stringIndex: 1, fret: 1, label: 'C' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l6-q1',
              question: 'Quais dedos montam o acorde aberto de Dó Maior (C)?',
              options: [
                'Dedo 1 na 2ª corda c.1, Dedo 2 na 4ª corda c.2, Dedo 3 na 5ª corda c.3',
                'Dedo 1 na 1ª corda, Dedo 2 na 2ª, Dedo 3 na 3ª',
                'Apenas dois dedos na 5ª casa',
                'Pestana completa na 1ª casa'
              ],
              correctIndex: 0,
              explanation: 'Dó Maior tem seu baixo na 5ª corda casa 3 (nota C), terça na 4ª corda c.2 (E) e tônica aguda na 2ª corda c.1 (C).'
            },
            {
              id: 'l6-q2',
              question: 'A partir de qual corda devemos palhetar o acorde de Ré Maior (D)?',
              options: ['A partir da 4ª corda solta (nota Ré)', 'Da 6ª corda solta', 'Da 5ª corda solta', 'Apenas a 1ª corda'],
              correctIndex: 0,
              explanation: 'A 4ª corda solta é a nota Ré (fundamental do acorde D). As cordas 6 e 5 não devem ser tocadas.'
            },
            {
              id: 'l6-q3',
              question: 'Como acelerar a troca de acordes sem travar o ritmo da música?',
              options: [
                'Formar o shape dos dedos no ar durante o deslocamento e nunca parar a mão da palheta',
                'Olhar fixamente para cada dedo um por um enquanto a mão direita para',
                'Apertar com o dobro de força',
                'Tocar apenas a 1ª corda'
              ],
              correctIndex: 0,
              explanation: 'A antecipação motora no ar e a continuidade do balanço da mão direita são o segredo das transições automáticas.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l6-triangle-c-g-d',
          title: 'Exercício Prático 6 — O Ciclo C -> G -> D Contínuo a 60 BPM',
          subtitle: '4 batidas por compasso sem interrupção na virada de acorde',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↓ ↓ ↓ (4 batidas por compasso)',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
          ],
          tablatureText: `Compasso 1 (C)     Compasso 2 (G)     Compasso 3 (D)     Compasso 4 (C)
e|--0--0--0--0---|--3--3--3--3---|--2--2--2--2---|--0--0--0--0---|
B|--1--1--1--1---|--0--0--0--0---|--3--3--3--3---|--1--1--1--1---|
G|--0--0--0--0---|--0--0--0--0---|--2--2--2--2---|--0--0--0--0---|
D|--2--2--2--2---|--0--0--0--0---|--0--0--0--0---|--2--2--2--2---|
A|--3--3--3--3---|--2--2--2--2---|---------------|--3--3--3--3---|
E|---------------|--3--3--3--3---|---------------|---------------|
    ↓  ↓  ↓  ↓      ↓  ↓  ↓  ↓      ↓  ↓  ↓  ↓      ↓  ↓  ↓  ↓`,
          instructions: [
            'Ligue o metrônomo a 60 BPM.',
            'Execute 4 batidas para baixo no acorde de Dó Maior (C).',
            'No tempo 1 do compasso seguinte, mude imediatamente para Sol Maior (G).',
            'No próximo compasso, vá para Ré Maior (D). Retorne para Dó Maior (C).',
            'Mantenha a mão da palheta num fluxo uniforme de 4 batidas por compasso sem hesitar na troca.',
            'Conclua 10 ciclos completos sem perder o tempo para registrar maestria.'
          ],
          biomechanicTips: [
            'Ao ir de C para G, movimente os dedos 1 e 2 em bloco para cima.',
            'Ao ir de G para D, use o dedo 3 como guia na 2ª corda.'
          ],
          validationCriteria: 'Completar 10 progressões completas C-G-D a 60 BPM sem pausas ou silêncios entre os compassos.'
        }
      },
      {
        id: 'lesson-7',
        level: 1,
        moduleTitle: 'Módulo C: Acordes Abertos, Worship e Groove',
        lessonNumber: 7,
        title: 'Aula 7 — Os Acordes Modernos de Worship: Cadd9, G, Dsus4, Em7 e Asus2',
        subtitle: 'A técnica dos dedos 3 e 4 travados como âncora de ouro para trocas instantâneas',
        objective: 'Dominar o quarteto de acordes Cadd9, G (4 dedos), Em7 e Dsus4 com os dedos 3 e 4 fixos na 1ª e 2ª corda, e aplicar o Asus2.',
        estimatedMinutes: 30,
        parts: [
          {
            id: 'l7-part-a',
            title: 'Parte A — A Âncora dos Dedos 3 e 4',
            contentMarkdown: `
### O Segredo da Harmonia Moderna de Worship e Violão/Guitarra

No estilo Worship contemporâneo e Pop Acústico, guitarristas descobriram um segredo físico e sonoro genial:
* **Dedo 3** fixo na 2ª corda, casa 3 (nota Ré).
* **Dedo 4** fixo na 1ª corda, casa 3 (nota Sol).

Esses dois dedos **NÃO SE MOVEM NUNCA** durante a progressão inteira! Apenas os dedos 1 e 2 se deslocam nas cordas graves:
1. **Sol Maior (G 4 dedos):** Dedo 2 na 6ª corda c.3, dedo 1 na 5ª corda c.2.
2. **Dó com Nona (Cadd9):** Basta descer os dedos 1 e 2 exatamente uma corda! Dedo 2 na 5ª corda c.3, dedo 1 na 4ª corda c.2.
3. **Mi Menor com Sétima (Em7 Worship):** Dedo 1 na 5ª corda c.2, dedo 2 na 4ª corda c.2.
4. **Ré Suspenso (Dsus4):** Dedo 1 na 3ª corda c.2.

O resultado é um som brilhante, atmosférico, sem cortes e com transição ultra-rápida!
            `,
          },
          {
            id: 'l7-part-b',
            title: 'Parte B — Progressão Real e Metas com Metrônomo',
            contentMarkdown: `
### Exercício Prático com a Guitarra Física:

Pratique a sequência clássica: **G -> Cadd9 -> Em7 -> Dsus4**
1. Comece com 1 batida para baixo por compasso a **60 BPM**.
2. Quando as trocas forem automáticas, pratique com levada rítmica a **80 BPM**.
3. Meta final para o nível 1: executar com clareza a **100 BPM**!
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 0, fret: 3, label: 'G (D4)' },
                { stringIndex: 1, fret: 3, label: 'D (D3)' },
                { stringIndex: 5, fret: 3, label: 'G (D2)' },
                { stringIndex: 4, fret: 2, label: 'B (D1)' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l7-q1',
              question: 'Qual é o segredo biomecânico dos acordes estilo Worship (G, Cadd9, Em7, Dsus4)?',
              options: [
                'Os dedos 3 e 4 ficam travados na casa 3 das cordas 1 e 2 servindo de âncora fixa',
                'Usar pestana em todas as casas',
                'Tocar apenas as cordas graves sem palheta',
                'Mudar todos os 4 dedos de lugar em cada acorde'
              ],
              correctIndex: 0,
              explanation: 'Ao manter os dedos 3 e 4 ancorados na casa 3, a transição entre G, Cadd9, Em7 e Dsus4 ocorre em frações de segundo apenas movendo os dedos 1 e 2.'
            },
            {
              id: 'l7-q2',
              question: 'Qual nota musical é adicionada ao acorde de Dó Maior para transformá-lo em Cadd9?',
              options: ['A 9ª maior (nota Ré / D)', 'A 7ª menor (nota Sib)', 'A 4ª justa (nota Fá)', 'A 6ª maior (nota Lá)'],
              correctIndex: 0,
              explanation: 'A nona adicionada (add9) é a nota Ré (D), que fica pressionada pelo dedo 3 na 2ª corda, casa 3.'
            },
            {
              id: 'l7-q3',
              question: 'Como se movem os dedos 1 e 2 na transição direta entre o Sol Maior (G) e o Cadd9?',
              options: [
                'Descem exatamente uma corda para baixo em paralelo (Dedo 2 vai para 5ª c.3, Dedo 1 vai para 4ª c.2)',
                'Avançam duas casas para a direita',
                'Invertem de ordem',
                'Saem do braço completamente'
              ],
              correctIndex: 0,
              explanation: 'O deslocamento é idêntico e paralelo: basta descer os dedos 1 e 2 uma corda abaixo, mantendo a forma exata.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l7-worship-anchor',
          title: 'Exercício Prático 7 — A Roda Worship G -> Cadd9 -> Em7 -> Dsus4 a 75 BPM',
          subtitle: 'Trocas ultra-rápidas com dedos 3 e 4 ancorados permanentemente na 3ª casa',
          targetBpm: 75,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↓ ↑ ↑ ↓ ↑ (Levada Worship com Balanço)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 2 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
          ],
          tablatureText: `    G                 Cadd9             Em7               Dsus4
e|--3---------------|--3---------------|--3---------------|--3---------------|
B|--3---------------|--3---------------|--3---------------|--3---------------|
G|--0---------------|--0---------------|--0---------------|--2---------------|
D|--0---------------|--2---------------|--2---------------|--0---------------|
A|--2---------------|--3---------------|--2---------------|------------------|
E|--3---------------|------------------|--0---------------|------------------|
    (Dedos 3 e 4 fixos na 1ª e 2ª cordas durante toda a progressão!)`,
          instructions: [
            'Posicione os dedos 3 e 4 na 3ª casa das cordas 2 e 1 e firme-os como âncora.',
            'Ligue o metrônomo a 75 BPM.',
            'Toque o acorde de Sol (G) por 1 compasso de 4 tempos.',
            'Desça os dedos 1 e 2 para Cadd9 no compasso 2.',
            'Vá para Em7 no compasso 3 e Dsus4 no compasso 4.',
            'Garanta que os dedos 3 e 4 nunca saiam das casas durante a execução.',
            'Complete 10 passagens sem perder a sustentação sonora.'
          ],
          biomechanicTips: [
            'Não levante os dedos 3 e 4 nem um milímetro: eles funcionam como o pivô de equilíbrio de toda a mão.',
            'Deixe o polegar confortável atrás do braço sem apertar com força descomunal.'
          ],
          validationCriteria: 'Executar 10 ciclos completos a 75 BPM mantendo a âncora perfeitamente fixa e sonoridade aberta.'
        }
      },
      {
        id: 'lesson-8',
        level: 1,
        moduleTitle: 'Módulo C: Acordes Abertos, Worship e Groove',
        lessonNumber: 8,
        title: 'Aula 8 — Levadas Rítmicas de Worship, Pop e Groove',
        subtitle: 'Acentuações no tempo 2 e 4, palhetadas fantasmas e dinâmicas de acompanhamento',
        objective: 'Aprender o padrão de batida universal, controlar a dinâmica entre partes calmas e explosivas da música, e dominar o abafamento.',
        estimatedMinutes: 25,
        parts: [
          {
            id: 'l8-part-a',
            title: 'Parte A — O Padrão Universal de Levada',
            contentMarkdown: `
### A Levada Universal (Down - Down Up - Up Down Up)

Contagem em colcheias (1 e 2 e 3 e 4 e):
\`\`\`
Tempo:    1   e   2   e   3   e   4   e
Palheta:  ↓       ↓   ↑       ↑   ↓   ↑
Acento:   *           !           !
\`\`\`

* **Tempo 1:** Batida forte para baixo nos bordões (graves).
* **Tempos 2 e 4:** Acentuação principal (simulando a caixa da bateria).
* **Dinâmica:** No verso da música, palhete apenas as 3 cordas mais graves com toque suave. No refrão, abra todas as 6 cordas com energia!
            `,
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l8-q1',
              question: 'Em quais tempos da levada rítmica 4/4 recai a acentuação principal da bateria (caixa)?',
              options: ['Tempos 2 e 4', 'Apenas no tempo 1', 'No tempo 3 e contratempo', 'No tempo 1 e 3'],
              correctIndex: 0,
              explanation: 'Os tempos 2 e 4 são o "backbeat" tradicional do Pop, Rock e Worship, onde a caixa da bateria dita a pulsação.'
            },
            {
              id: 'l8-q2',
              question: 'O que faz a mão da palheta no tempo 3 da levada universal (↓ _ ↓ ↑ _ ↑ ↓ ↑)?',
              options: [
                'Ela desce no ar sem encostar nas cordas (palhetada fantasma) e toca para cima (↑) no contratempo "e"',
                'Para completamente de se mover',
                'Bate com a mão aberta no tampo da guitarra',
                'Solta a palheta'
              ],
              correctIndex: 0,
              explanation: 'A mão mantém o balanço pendular para baixo no tempo 3 sem tocar, atacando para cima no contratempo ("e").'
            },
            {
              id: 'l8-q3',
              question: 'Como criar contraste dinâmico entre o Verso (calmo) e o Refrão (explosivo) de uma música?',
              options: [
                'No verso tocar apenas cordas graves suavemente; no refrão abrir todas as 6 cordas com amplitude e volume',
                'Tocar sempre no volume máximo o tempo todo',
                'Desligar o amplificador no verso',
                'Acelerar o andamento no refrão'
              ],
              correctIndex: 0,
              explanation: 'O controle de dinâmica e amplitude de palhetada dá vida, emoção e profissionalismo ao acompanhamento.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l8-universal-strumming',
          title: 'Exercício Prático 8 — A Levada Universal Down-DownUp-Up-DownUp a 80 BPM',
          subtitle: 'Pêndulo contínuo com acentuação nos tempos 2 e 4 sobre G e Cadd9',
          targetBpm: 80,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓   ↓ ↑   ↑ ↓ ↑ (Levada Universal)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 3 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 3 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 3 },
          ],
          tablatureText: `Tempo:   1   e   2   e   3   e   4   e
Palheta: ↓       ↓   ↑       ↑   ↓   ↑
Acento:          !               !
Acorde:  [ Sol Maior (G) ] -> [ Cadd9 ]`,
          instructions: [
            'Ligue o metrônomo a 80 BPM.',
            'Mantenha o braço direito oscilando para baixo e para cima como um pêndulo ininterrupto.',
            'No tempo 1: toque para baixo (↓) nos bordões graves.',
            'No tempo 2: toque para baixo acentuado (↓!) e suba tocando (↑).',
            'No tempo 3: desça no ar sem tocar e suba tocando (↑).',
            'No tempo 4: toque para baixo acentuado (↓!) e suba tocando (↑).',
            'Mude para Cadd9 e repita o padrão.',
            'Complete 10 compassos seguidos sem travar o balanço da mão.'
          ],
          biomechanicTips: [
            'Deixe a palheta levemente flexível entre os dedos para que ela não trave nas cordas na subida.',
            'O movimento do pêndulo deve ser tão constante que seus olhos vejam a mão se mover mesmo quando ela não ataca a corda.'
          ],
          validationCriteria: 'Executar 10 repetições perfeitas da levada a 80 BPM com acentos nítidos nos tempos 2 e 4.'
        }
      }
    ]
  },
  {
    level: 2,
    name: 'NÍVEL 2 — PENTATÔNICAS E CRIAÇÃO DE SOLOS',
    subtitle: 'As 5 posições da escala pentatônica, técnicas de expressão e a sequência de improvisação',
    badge: 'Solos & Improviso',
    description: 'A formação completa para solar com autonomia: as 5 posições da pentatônica conectadas, bends e vibrato afinados, resolução em notas do acorde e o método prático de 10 passos para criar solos próprios.',
    lessons: [
      {
        id: 'lesson-9',
        level: 2,
        moduleTitle: 'Módulo B: Pentatônicas e Solos',
        lessonNumber: 9,
        title: 'Aula 9 — A Escala Pentatônica Menor e o Padrão 1',
        subtitle: 'Fórmula 1 - b3 - 4 - 5 - b7, o shape fundamental em Lá Menor (Am) e execução limpa',
        objective: 'Compreender a lógica intervalar da pentatônica menor e executar o Padrão 1 em Lá Menor na 5ª casa ascendente e descendente a 60 BPM com metrônomo.',
        estimatedMinutes: 30,
        parts: [
          {
            id: 'l9-part-a',
            title: 'Parte A — Por que a Pentatônica Funciona Sempre',
            contentMarkdown: `
### A Mágica dos Intervalos da Pentatônica Menor

A escala pentatônica possui apenas **5 notas por oitava**:
**Fórmula: 1 (Tônica) — b3 (Terça Menor) — 4 (Quarta Justa) — 5 (Quinta Justa) — b7 (Sétima Menor)**

Em **Lá Menor (Am)**, as notas são:
**A (Lá) — C (Dó) — D (Ré) — E (Mi) — G (Sol)**

Por que ela é a escala rainha dos guitarristas de Blues, Rock, Pop e Metal?
Porque ela **elimina a 2ª menor e a 6ª menor**, os dois semitons mais tensos da escala diatônica. Como não há choques dissonantes agudos, qualquer frase soa melódica e musical!
            `,
          },
          {
            id: 'l9-part-b',
            title: 'Parte B — O Padrão 1 (Casa 5 a 8) com Dedos',
            contentMarkdown: `
### Tablatura do Padrão 1 da Pentatônica de Am:

\`\`\`
1ª corda (E):  -----------------------------------5---8--- (dedos 1 e 4)
2ª corda (B):  ---------------------------5---8----------- (dedos 1 e 4)
3ª corda (G):  -------------------5---7------------------- (dedos 1 e 3)
4ª corda (D):  -----------5---7--------------------------- (dedos 1 e 3)
5ª corda (A):  ---5---7----------------------------------- (dedos 1 e 3)
6ª corda (E):  ---5---8----------------------------------- (dedos 1 e 4) - Tônica A na casa 5!
\`\`\`

**Onde estão as tônicas (Lá / A)?**
* 6ª corda, casa 5 (dedo 1)
* 4ª corda, casa 7 (dedo 3)
* 1ª corda, casa 5 (dedo 1)

> 🎯 **Exercício Prático na Guitarra Física:**
> Ligue o metrônomo a 60 BPM. Toque uma nota por batida subindo da 6ª corda até a 1ª corda, e depois desça da 1ª até a 6ª corda. Cada nota deve ressoar com volume homogêneo!
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 5, label: 'A (1)' },
                { stringIndex: 5, fret: 8, label: 'C (b3)' },
                { stringIndex: 4, fret: 5, label: 'D (4)' },
                { stringIndex: 4, fret: 7, label: 'E (5)' },
                { stringIndex: 3, fret: 5, label: 'G (b7)' },
                { stringIndex: 3, fret: 7, label: 'A (1)' },
                { stringIndex: 2, fret: 5, label: 'C (b3)' },
                { stringIndex: 2, fret: 7, label: 'D (4)' },
                { stringIndex: 1, fret: 5, label: 'E (5)' },
                { stringIndex: 1, fret: 8, label: 'G (b7)' },
                { stringIndex: 0, fret: 5, label: 'A (1)' },
                { stringIndex: 0, fret: 8, label: 'C (b3)' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l9-q1',
              question: 'Quais intervalos formam a escala Pentatônica Menor?',
              options: [
                '1 (Tônica) — b3 (Terça Menor) — 4 (Quarta Justa) — 5 (Quinta Justa) — b7 (Sétima Menor)',
                '1 — 2 — 3 — 4 — 5',
                '1 — 3 — 5 — 7 — 9',
                '1 — b2 — 3 — #4 — 5'
              ],
              correctIndex: 0,
              explanation: 'A fórmula canônica da pentatônica menor é 1, b3, 4, 5, b7: 5 notas perfeitas sem semitons conflitantes.'
            },
            {
              id: 'l9-q2',
              question: 'No Padrão 1 da Pentatônica de Lá Menor (casas 5 a 8), onde estão as 3 notas tônicas (Lá)?',
              options: [
                '6ª corda c.5, 4ª corda c.7 e 1ª corda c.5',
                'Apenas na 6ª corda c.8',
                'Na 3ª corda c.5 e 2ª corda c.5',
                'Na 5ª corda c.5 e 3ª corda c.7'
              ],
              correctIndex: 0,
              explanation: 'A tônica se repete em 3 oitavas no Padrão 1: na 6ª corda c.5, na 4ª corda c.7 e na 1ª corda c.5.'
            },
            {
              id: 'l9-q3',
              question: 'Qual par de dedos deve ser utilizado nas cordas 6, 2 e 1 no Padrão 1?',
              options: [
                'Dedos 1 (indicador) e 4 (mínimo)',
                'Dedos 1 e 3',
                'Dedos 2 e 3',
                'Apenas o dedo 1 com pestana'
              ],
              correctIndex: 0,
              explanation: 'O intervalo entre a casa 5 e a casa 8 abrange 4 casas; a biomecânica correta exige os dedos 1 e 4.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l9-penta-pos1',
          title: 'Exercício Prático 9 — Padrão 1 de Am Pentatônica Subindo e Descendo a 60 BPM',
          subtitle: 'Execução limpa das 12 notas em duas oitavas com palhetada alternada estrita',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ (Alternada Rigorosa)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
            { stringNumber: 6, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 8 },
            { stringNumber: 5, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 5 },
            { stringNumber: 5, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 7 },
            { stringNumber: 4, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 5 },
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 7 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'up', fret: 7 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 },
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 8 },
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
            { stringNumber: 1, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 8 },
          ],
          tablatureText: `Subida (Grave -> Agudo):
e|----------------------------------5-8--|
B|------------------------------5-8------|
G|--------------------------5-7----------|
D|----------------------5-7--------------|
A|------------------5-7------------------|
E|--5-8----------------------------------|
    ↓ ↑             ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑

Descida (Agudo -> Grave):
e|--8-5----------------------------------|
B|------8-5------------------------------|
G|----------7-5--------------------------|
D|--------------7-5----------------------|
A|------------------7-5------------------|
E|----------------------8-5--------------|`,
          instructions: [
            'Ligue o metrônomo a 60 BPM.',
            'Comece na 6ª corda, casa 5 com o Dedo 1 (nota Lá) palhetando para BAIXO (↓).',
            'Suba corda por corda até a 1ª corda casa 8, e em seguida desça sem interrupção de volta à 6ª corda.',
            'Mantenha as notas rigorosamente ligadas no tempo sem pausas entre as cordas.',
            'Conclua 10 ciclos completos de subida e descida limpos a 60 BPM.'
          ],
          biomechanicTips: [
            'Nas cordas 6, 2 e 1 use Dedo 1 e Dedo 4 (mínimo). Não force o dedo 3 para esticar 4 casas.',
            'Nas cordas 5, 4 e 3 use Dedo 1 e Dedo 3 com o punho relaxado.'
          ],
          validationCriteria: 'Executar 10 ciclos de subida e descida no tempo de 60 BPM com sonoridade uniforme e sem trastejar.'
        }
      },
      {
        id: 'lesson-10',
        level: 2,
        moduleTitle: 'Módulo B: Pentatônicas e Solos',
        lessonNumber: 10,
        title: 'Aula 10 — As Cinco Posições da Pentatônica no Braço Inteiro',
        subtitle: 'Conectando o braço da casa 0 à 15, identificando a tônica em cada shape e transições por slide',
        objective: 'Mapear as 5 posições da pentatônica menor e aprender a deslizar entre posições vizinhas sem se perder.',
        estimatedMinutes: 35,
        parts: [
          {
            id: 'l10-part-a',
            title: 'Parte A — A Geometria das 5 Posições em Am',
            contentMarkdown: `
### O Braço Conectado como um Quebra-Cabeça

A escala não fica presa na 5ª casa! Ela se desdobra ao longo de todo o braço em 5 formas interligadas:

* **Posição 1 (Casas 5–8):** Tônica na 6ª corda, c.5 e 4ª corda, c.7. A posição "casa" mais conhecida.
* **Posição 2 (Casas 7–10):** Tônica na 4ª corda, c.7 e 2ª corda, c.10.
* **Posição 3 (Casas 9–12):** Tônica na 5ª corda, c.12 e 2ª corda, c.10.
* **Posição 4 (Casas 12–15):** Tônica na 5ª corda, c.12 e 3ª corda, c.14.
* **Posição 5 (Casas 2–5 ou 14–17):** Tônica na 6ª corda c.5 e 3ª corda c.2.
            `,
          },
          {
            id: 'l10-part-b',
            title: 'Parte B — Como Conectar com Slides',
            contentMarkdown: `
### A Conexão Horizontal

Em vez de tocar apenas verticalmente em uma caixa, use o **dedo 3** para escorregar (slide) da casa 7 para a casa 9 na 3ª corda. Esse movimento transporta sua mão instantaneamente da Posição 1 para a Posição 2!
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 3, fret: 7, label: 'P1: c.7' },
                { stringIndex: 2, fret: 9, label: 'Slide -> c.9' },
                { stringIndex: 1, fret: 10, label: 'P2: c.10 (A)' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l10-q1',
              question: 'Quantas posições conectadas a escala pentatônica forma ao longo do braço inteiro da guitarra?',
              options: ['5 posições (baseadas no sistema CAGED)', '3 posições', '12 posições', 'Apenas 1 posição'],
              correctIndex: 0,
              explanation: 'A escala se divide em 5 shapes geométricos contínuos que cobrem toda a extensão do braço da casa 0 à 15+.'
            },
            {
              id: 'l10-q2',
              question: 'Como conectar a Posição 1 à Posição 2 de forma melódica sem saltos mecânicos?',
              options: [
                'Deslizando (slide) o dedo 3 da casa 7 para a casa 9 na 3ª corda',
                'Tirando a mão do instrumento',
                'Palhetando a corda solta',
                'Dando um salto com os 4 dedos juntos'
              ],
              correctIndex: 0,
              explanation: 'O slide na 3ª corda da casa 7 (nota D) para a casa 9 (nota E) conduz a mão suavemente para o desenho da posição 2.'
            },
            {
              id: 'l10-q3',
              question: 'Na Posição 2 da Pentatônica de Lá Menor (casas 7 a 10), onde se localiza a tônica Lá mais aguda?',
              options: ['2ª corda, casa 10', '1ª corda, casa 7', '3ª corda, casa 8', '4ª corda, casa 12'],
              correctIndex: 0,
              explanation: 'Na 2ª corda (Si), avançando até a casa 10, temos a tônica Lá (A), ponto alto expressivo dos solos de Blues/Rock.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l10-connecting-p1-p2',
          title: 'Exercício Prático 10 — Conexão Posição 1 -> Posição 2 por Slide a 65 BPM',
          subtitle: 'Transição horizontal da 5ª para a 10ª casa sem interrupção melódica',
          targetBpm: 65,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ (slide) ↑ ↓',
          notesSequence: [
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 },
            { stringNumber: 3, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 9 }, // slide
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 8 },
            { stringNumber: 2, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 10 },
          ],
          tablatureText: `          (Posição 1)      [Slide]    (Posição 2)
e|----------------------------------------------------|
B|--------------------------------------8---10(A)-----|
G|-----------------5---7---/---9----------------------|
D|-------7(A)-----------------------------------------|
A|----------------------------------------------------|
E|----------------------------------------------------|
         D3        D1  D3 ---- D3      D1   D3
         ↓         ↑   ↓       (sl)    ↑    ↓`,
          instructions: [
            'Ligue o metrônomo a 65 BPM.',
            'Inicie na 4ª corda casa 7 (Tônica Lá) com o dedo 3.',
            'Toque a 3ª corda casa 5 com o dedo 1 e casa 7 com o dedo 3.',
            'Palhete a casa 7 e deslize imediatamente o dedo 3 até a casa 9 (slide suave).',
            'Finalize alcançando a 2ª corda casa 8 (dedo 1) e casa 10 (dedo 3, Tônica Lá na Posição 2).',
            'Complete 10 passagens limpas integrando as duas posições.'
          ],
          biomechanicTips: [
            'No slide, mantenha a pressão moderada da polpa do dedo na corda para que o som continue sustentado após o movimento.',
            'Mantenha o braço e ombro relaxados ao deslocar a mão para a direita.'
          ],
          validationCriteria: 'Executar 10 conexões completas no tempo de 65 BPM sem interrupção de som no slide.'
        }
      },
      {
        id: 'lesson-11',
        level: 2,
        moduleTitle: 'Módulo B: Pentatônicas e Solos',
        lessonNumber: 11,
        title: 'Aula 11 — A Linguagem Expressiva: Bends, Vibrato e Ligados',
        subtitle: 'Como afinar o bend de 1 tom, estabilizar o vibrato e executar hammer-ons e pull-offs limpos',
        objective: 'Aprender a mecânica correta do bend de 1 tom com apoio de 3 dedos, vibrato controlado pelo punho e ligados sem perda de volume.',
        estimatedMinutes: 30,
        parts: [
          {
            id: 'l11-part-a',
            title: 'Parte A — A Mecânica Correta do Bend',
            contentMarkdown: `
### Bend sem desafinar e sem machucar os dedos

1. **Nunca faça bend com apenas 1 dedo solto!** Use os dedos 1 e 2 atrás do dedo 3 como reforço conjunto na mesma corda.
2. A força de empurrar a corda não vem da ponta dos dedos, mas do **giro do punho** (como girar a maçaneta de uma porta).
3. **Afinação do Bend:**
   - Toque a 2ª corda na casa 10 para memorizar o som da nota Lá.
   - Agora vá para a casa 8 e empurre a corda até que ela atinja exatamente a altura da casa 10 (bend de 1 tom).
   - Use o ouvido para calibrar a tensão!
            `,
          },
          {
            id: 'l11-part-b',
            title: 'Parte B — O Vibrato: A Assinatura do Guitarrista',
            contentMarkdown: `
### Como Conseguir um Vibrato Doce e Regular

* O vibrato é uma oscilação suave e rítmica da afinação para cima e volta ao centro.
* Apoie o indicador na parte inferior do braço da guitarra como um ponto de pivô.
* Faça a oscilação em sincronia com o andamento da música (ex: vibrato em colcheias ou tercinas no tempo).
* Evite o "vibrato nervoso" rápido e descontrolado que parece picada de abelha.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 1, fret: 8, label: 'Bend (D3+D2+D1)' },
                { stringIndex: 1, fret: 10, label: 'Nota-Alvo: A' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l11-q1',
              question: 'Qual é a regra biomecânica fundamental para executar um bend afinado de 1 tom sem machucar os tendões?',
              options: [
                'Apoiar os dedos 1 e 2 atrás do dedo 3 como reforço na mesma corda e girar o punho',
                'Usar apenas o dedo mindinho sem apoio nenhum',
                'Empurrar a corda exclusivamente flexionando a ponta do dedo indicador',
                'Desafinar a corda antes'
              ],
              correctIndex: 0,
              explanation: 'A força conjugada dos dedos 1, 2 e 3 com o movimento de rotação do punho proporciona controle milimétrico e proteção física.'
            },
            {
              id: 'l11-q2',
              question: 'Como você afina auditivamente um bend de 1 tom (full bend)?',
              options: [
                'Tocando a nota 2 casas acima para memorizar o tom e empurrando a corda até alcançar exatamente aquela altura',
                'Empurrando o máximo que a força permitir sem ouvir',
                'Usando uma régua na escala',
                'Olhando para a ponte da guitarra'
              ],
              correctIndex: 0,
              explanation: 'O ouvido é o juiz supremo: ouvir a nota 2 casas à frente (ex: casa 10) e igualar a altura empurrando a casa 8.'
            },
            {
              id: 'l11-q3',
              question: 'O que caracteriza um vibrato maduro e expressivo na guitarra?',
              options: [
                'Oscilação ritmada, ampla e controlada no andamento da música',
                'Tremer o dedo o mais rápido e caótico possível',
                'Tocar a nota e soltar imediatamente',
                'Mover o braço inteiro da guitarra para frente e para trás'
              ],
              correctIndex: 0,
              explanation: 'O grande vibrato tem tempo, amplitude controlada e confere emoção profissional às notas sustentadas.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l11-full-bend-vibrato',
          title: 'Exercício Prático 11 — Bend de 1 Tom na 2ª Corda c.8 com Vibrato a 60 BPM',
          subtitle: 'Atingindo o Lá da casa 10 por bend com apoio dos 3 dedos e sustentação',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ (Ataque com subida controlada)',
          notesSequence: [
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 10 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 8 },
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 8 }, // bend para A
          ],
          tablatureText: `Passo 1 (Referência Auditiva):
B|--10(A)-----------| (Toque para ouvir a nota-alvo no tempo 1)

Passo 2 (Execução do Bend com Dedos 1+2+3):
B|--8b10~~----------| (Palhete no 8 e suba até soar idêntico ao 10 com vibrato!)`,
          instructions: [
            'Ligue o metrônomo a 60 BPM.',
            'Toque a 2ª corda na casa 10 com o dedo 3. Escute com atenção o som da nota Lá.',
            'Agora posicione o dedo 3 na casa 8 da 2ª corda, com o dedo 2 na casa 7 e o dedo 1 na casa 6 na mesma corda.',
            'Palhete a casa 8 e gire o punho empurrando a corda para cima até a afinação coincidir perfeitamente com a casa 10.',
            'Segure a nota no topo por 2 tempos aplicando uma oscilação suave de vibrato.',
            'Repita 10 vezes com afinação 100% precisa.'
          ],
          biomechanicTips: [
            'O polegar deve abraçar levemente a parte superior do braço da guitarra para criar o apoio do giro.',
            'Não deixe a 3ª corda escapar por baixo da sua unha: empurre-a junto para cima.'
          ],
          validationCriteria: 'Executar 10 bends de 1 tom afinados na altura da casa 10 com vibrato estável no topo.'
        }
      },
      {
        id: 'lesson-12',
        level: 2,
        moduleTitle: 'Módulo B: Pentatônicas e Solos',
        lessonNumber: 12,
        title: 'Aula 12 — Criação de Solos: O Método Prático em 10 Passos',
        subtitle: 'Da memorização à improvisação real: frases curtas, pausas, respiração e resolução harmônica',
        objective: 'Executar a sequência didática de 10 passos para criar solos melódicos com identidade própria sobre uma base harmônica.',
        estimatedMinutes: 35,
        parts: [
          {
            id: 'l12-part-a',
            title: 'Parte A — Os 10 Passos Obrigatórios de Formação',
            contentMarkdown: `
### A Sequência Didática da Academia de Guitarra

Siga rigorosamente estes 10 passos com sua guitarra física:

1. **Localizar:** Encontre a nota Lá na 6ª corda, casa 5.
2. **Visualizar:** Memorize a primeira posição da pentatônica menor de Lá.
3. **Executar:** Toque a escala ascendente e descendente com som limpo.
4. **Metrônomo:** Pratique a escala rigorosamente a **60 BPM** (1 nota por tempo).
5. **Autonomia:** Toque a escala de olhos fechados, sem olhar para a tela.
6. **Frases Curtas:** Crie frases musicais usando apenas 3 a 5 notas. Não tente disparar notas rápidas!
7. **Pausas e Respiração:** Introduza pausas expressivas. O silêncio dá peso e valor às notas que você toca.
8. **Improvisação sobre Base:** Improvise sobre uma base harmônica em Lá menor (Am - F - C - G ou vamp em Am7).
9. **Transposição:** Mude a tonalidade! Desloque o mesmo formato para a 7ª casa (Si Menor) e para a 12ª casa (Mi Menor).
10. **Autoavaliação Prática:** Avalie sua precisão rítmica, clareza sonora e se suas frases resolveram na tônica com intenção.
            `,
          },
          {
            id: 'l12-part-b',
            title: 'Parte B — Notas-Alvo e Resolução Harmônica',
            contentMarkdown: `
### Como Fazer seu Solo Soar Conectado à Base

Quando o acorde de fundo muda, suas notas de solo ganham novo significado:
* Quando a base toca **Am**, repouse suas frases na nota **Lá** (casa 7 da 4ª corda) ou nota **Dó** (casa 5 da 3ª corda).
* Quando a base vai para **Fá (F)**, repouse na nota **Dó** ou nota **Lá**.
* Quando a base vai para **Sol (G)**, repouse na nota **Sol** (casa 8 da 2ª corda ou casa 5 da 3ª corda com bend leve).
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 3, fret: 7, label: 'Tônica A (Alvo)' },
                { stringIndex: 2, fret: 5, label: 'Terça C (Alvo)' },
                { stringIndex: 1, fret: 8, label: 'Sétima G' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l12-q1',
              question: 'Por que o silêncio (pausas) é tão fundamental na criação de solos melódicos?',
              options: [
                'Porque o silêncio cria respiração humana e faz cada nota tocada ter peso e significado',
                'Porque serve apenas para descansar a mão',
                'Porque guitarristas não conseguem tocar sem parar',
                'Não é fundamental; quanto mais notas rápidas, melhor o solo'
              ],
              correctIndex: 0,
              explanation: 'A música é feita de som e silêncio: frases sem pausas soam cansativas e sem inteligência musical.'
            },
            {
              id: 'l12-q2',
              question: 'O que é uma "Nota-Alvo" (Target Note) na improvisação sobre acordes?',
              options: [
                'Uma nota pertencente à tríade do acorde da base onde sua frase repousa com estabilidade',
                'Qualquer nota aleatória da escala',
                'A nota mais rápida da frase',
                'A nota mais aguda do braço'
              ],
              correctIndex: 0,
              explanation: 'Repousar na nota-alvo conecta a melodia do solo aos acordes da base harmônica.'
            },
            {
              id: 'l12-q3',
              question: 'Ao transpor a Pentatônica do Padrão 1 da casa 5 para a casa 7, qual tonalidade você passa a solar?',
              options: ['Si Menor (Bm)', 'Dó Maior (C)', 'Fá Maior (F)', 'Mi Menor (Em)'],
              correctIndex: 0,
              explanation: 'Avançar 2 casas (1 tom) a partir da casa 5 (Lá) leva para a casa 7, que é a tônica Si (B).'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l12-melodic-phrasing',
          title: 'Exercício Prático 12 — Frase Melódica com Repouso na Tônica a 70 BPM',
          subtitle: 'Aplicação prática do método em 10 passos com frase cantável e resolução',
          targetBpm: 70,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ com pausas expressivas',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'up', fret: 7 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 },
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 8 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 }, // resolução
          ],
          tablatureText: `Compasso 1 (Frase):
B|---------------5---8---|
G|-------5---7-----------|
         D1  D3  D1  D4
         ↓   ↑   ↓   ↑

Compasso 2 (Resolução com Vibrato na Tônica Lá):
G|---7~~-----------------| (Sustente a tônica Lá com vibrato doce!)
D|-----------------------|`,
          instructions: [
            'Ligue o metrônomo a 70 BPM.',
            'No tempo 2 do compasso 1, inicie a frase na 3ª corda casas 5 e 7.',
            'Avance para a 2ª corda casas 5 e 8.',
            'No tempo 1 do compasso 2, repouse na nota Lá (3ª corda, casa 7) aplicando um vibrato amplo.',
            'Fique em silêncio durante os tempos 3 e 4 do compasso 2 (respeite a pausa!).',
            'Repita 10 vezes até a frase soar com convicção e expressividade.'
          ],
          biomechanicTips: [
            'Cante a frase vocalmente antes de tocar na guitarra: os dedos obedecem à voz da mente.',
            'A resolução na nota Lá deve soar segura e conclusiva.'
          ],
          validationCriteria: 'Executar 10 repetições emotivas a 70 BPM com tempo de pausa rigorosamente respeitado.'
        }
      }
    ]
  },
  {
    level: 3,
    name: 'NÍVEL 3 — HARMONIA APLICADA E CAMPO HARMÔNICO',
    subtitle: 'Formação de acordes com sétima, campo harmônico maior e como tirar músicas de ouvido',
    badge: 'Harmonia & Teoria',
    description: 'Compreenda a engrenagem oculta das músicas: por que os acordes combinam, como funcionam as funções harmônicas (Tônica, Subdominante, Dominante) e como transportar canções instantaneamente para qualquer tom.',
    lessons: [
      {
        id: 'lesson-13',
        level: 3,
        moduleTitle: 'Módulo A: Fundamentos Musicais',
        lessonNumber: 13,
        title: 'Aula 13 — Tríades, Tétrades e Acordes com Sétima',
        subtitle: 'A formação matemática dos acordes Maj7, m7 e 7 Dominante na prática da guitarra',
        objective: 'Compreender como a adição da sétima (maior ou menor) transforma a cor do acorde e montar essas formas no braço.',
        estimatedMinutes: 30,
        parts: [
          {
            id: 'l13-part-a',
            title: 'Parte A — Tríade + Sétima = Tétrade',
            contentMarkdown: `
### As 4 Famílias de Tétrades

1. **7M (Sétima Maior):** Tríade Maior + 7ª Maior (1 - 3 - 5 - 7). Som doce, lírico, sonhador (ex: C7M, F7M).
2. **m7 (Menor com Sétima):** Tríade Menor + 7ª Menor (1 - b3 - 5 - b7). Som moderno, Soul, R&B (ex: Am7, Dm7).
3. **7 (Dominante):** Tríade Maior + 7ª Menor (1 - 3 - 5 - b7). Contém o **trítono** (tensão máxima) que pede resolução (ex: G7, E7, D7).
4. **m7(b5) (Meio-Diminuto):** Tríade Diminuta + 7ª Menor (1 - b3 - b5 - b7). O clássico grau vii° e ii cadencial menor (ex: Bm7b5).
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 4, fret: 3, label: 'C (1)' },
                { stringIndex: 3, fret: 2, label: 'E (3)' },
                { stringIndex: 2, fret: 4, label: 'B (7M)' },
                { stringIndex: 1, fret: 5, label: 'E (3)' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l13-q1',
              question: 'Qual é a estrutura intervalar exata de um acorde Maior com Sétima Maior (ex: C7M)?',
              options: [
                '1 (Tônica) — 3 (Terça Maior) — 5 (Quinta Justa) — 7 (Sétima Maior)',
                '1 — 3 — 5 — b7',
                '1 — b3 — 5 — b7',
                '1 — 3 — #5 — 7'
              ],
              correctIndex: 0,
              explanation: 'O C7M é formado por C (1), E (3), G (5) e B (7). A sétima maior fica a apenas 1 semitom abaixo da oitava.'
            },
            {
              id: 'l13-q2',
              question: 'Por que o acorde com 7ª Dominante (ex: G7) soa tão tenso e pede resolução no acorde de C?',
              options: [
                'Porque contém o trítono (3 tons inteiros de distância entre a 3ª maior B e a 7ª menor F)',
                'Porque é um acorde menor',
                'Porque não tem quinta',
                'Porque é afinado mais baixo'
              ],
              correctIndex: 0,
              explanation: 'O intervalo de trítono (B para F) é a instabilidade física central da harmonia tonal que se resolve em C (C e E).'
            },
            {
              id: 'l13-q3',
              question: 'Qual é a diferença de notas entre Dm e Dm7?',
              options: [
                'Dm7 adiciona a 7ª menor (nota Dó / C)',
                'Dm7 adiciona a 9ª maior',
                'Dm7 remove a terça',
                'Dm7 adiciona um sustenido na tônica'
              ],
              correctIndex: 0,
              explanation: 'Em Dm (D, F, A), a adição da 7ª menor Dó (C) cria a tétrade menor com sétima Dm7.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l13-tetrads-cycle',
          title: 'Exercício Prático 13 — Ciclo de Tétrades C7M -> Am7 -> Dm7 -> G7 a 65 BPM',
          subtitle: 'Sonoridade aveludada do jazz/soul corda a corda na guitarra física',
          targetBpm: 65,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↓ ↓ ↓ (Arpejo e Batida)',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
          ],
          tablatureText: `    C7M               Am7               Dm7               G7
e|--0---------------|--0---------------|--1---------------|--1---------------|
B|--0---------------|--1---------------|--1---------------|--0---------------|
G|--0---------------|--0---------------|--2---------------|--0---------------|
D|--2---------------|--2---------------|--0---------------|--0---------------|
A|--3---------------|--0---------------|------------------|--2---------------|
E|------------------|------------------|------------------|--3---------------|`,
          instructions: [
            'Ligue o metrônomo a 65 BPM.',
            'Monte C7M no compasso 1 e toque com palhetada suave.',
            'Mude para Am7 no compasso 2.',
            'Mude para Dm7 no compasso 3 e resolva em G7 no compasso 4.',
            'Ouça a tensão do G7 se dissolver perfeitamente ao retornar para o C7M no ciclo seguinte.',
            'Complete 10 ciclos completos com afinação impecável.'
          ],
          biomechanicTips: [
            'Não use palhetadas agressivas: tétrades soam muito mais expressivas com palheta leve e dinâmica controlada.',
            'No Dm7, faça uma pequena meia-pestana com o dedo 1 nas cordas 1 e 2 na casa 1.'
          ],
          validationCriteria: 'Executar 10 ciclos de tétrades a 65 BPM com clareza sonora em todas as 4 notas de cada acorde.'
        }
      },
      {
        id: 'lesson-14',
        level: 3,
        moduleTitle: 'Módulo A: Fundamentos Musicais',
        lessonNumber: 14,
        title: 'Aula 14 — O Campo Harmônico Maior e as Funções dos Graus I a VII',
        subtitle: 'A regra Maior, menor, menor, Maior, Maior, menor, diminuto e como tirar músicas de ouvido',
        objective: 'Aprender a fórmula universal do campo harmônico maior e identificar a função de repouso (I), movimento (IV) e tensão (V).',
        estimatedMinutes: 30,
        parts: [
          {
            id: 'l14-part-a',
            title: 'Parte A — A Fórmula Universal dos Graus',
            contentMarkdown: `
### Em Qualquer Tom Maior do Mundo:

* **Grau I:** **Maior (ou 7M)** — Função **Tônica** (Casa, descanso, estabilidade).
* **Grau ii:** **menor (ou m7)** — Função **Subdominante** (Preparação suave).
* **Grau iii:** **menor (ou m7)** — Função **Tônica secundária**.
* **Grau IV:** **Maior (ou 7M)** — Função **Subdominante** (Abertura, jornada).
* **Grau V:** **Maior com 7ª (Dominante)** — Função **Dominante** (Tensão viva, atração magnética de volta ao I).
* **Grau vi:** **menor (ou m7)** — Relativo Menor (Sombra emocional do grau I).
* **Grau vii°:** **diminuto ou m7(b5)** — Função Dominante.

### No Tom de Dó Maior (C):
**C (I) — Dm (ii) — Em (iii) — F (IV) — G ou G7 (V) — Am (vi) — B° ou Bm7b5 (vii°)**
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 4, fret: 3, label: 'I: C' },
                { stringIndex: 3, fret: 0, label: 'ii: Dm' },
                { stringIndex: 3, fret: 2, label: 'iii: Em' },
                { stringIndex: 3, fret: 3, label: 'IV: F' },
                { stringIndex: 2, fret: 0, label: 'V: G' },
                { stringIndex: 2, fret: 2, label: 'vi: Am' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l14-q1',
              question: 'Qual é a sequência fixa de tipos de acordes no Campo Harmônico Maior (graus I a VII)?',
              options: [
                'Maior — menor — menor — Maior — Maior — menor — diminuto',
                'Maior — Maior — menor — menor — Maior — Maior — diminuto',
                'menor — Maior — menor — Maior — menor — Maior — diminuto',
                'Todos são maiores'
              ],
              correctIndex: 0,
              explanation: 'A fórmula dos graus I a VII é imutável em qualquer tom maior: I(M), ii(m), iii(m), IV(M), V(M), vi(m), vii(°).'
            },
            {
              id: 'l14-q2',
              question: 'Quais são os 3 acordes que formam a clássica cadência de preparação e resolução II - V - I em Dó Maior?',
              options: ['Dm7 — G7 — C7M', 'Em7 — A7 — D7M', 'C7M — F7M — G7', 'Am7 — Dm7 — G7'],
              correctIndex: 0,
              explanation: 'Dm7 é o grau ii (subdominante), G7 é o grau V (dominante com trítono), e C7M é o grau I (resolução tônica).'
            },
            {
              id: 'l14-q3',
              question: 'Qual é o acorde Relativo Menor (grau vi) no campo harmônico de Dó Maior (C)?',
              options: ['Lá Menor (Am)', 'Mi Menor (Em)', 'Ré Menor (Dm)', 'Sol Menor (Gm)'],
              correctIndex: 0,
              explanation: 'O 6º grau de Dó é a nota Lá; portanto, Lá Menor (Am) é a relativa menor de Dó Maior, compartilhando as mesmas notas.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l14-cadence-2-5-1',
          title: 'Exercício Prático 14 — A Cadência II - V - I em Dó Maior a 70 BPM',
          subtitle: 'A progressão harmônica mestra da música ocidental na prática instrumental',
          targetBpm: 70,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↓ ↓ ↓ (4 tempos por compasso)',
          notesSequence: [
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
          ],
          tablatureText: `Compasso 1 [ii: Dm7]   Compasso 2 [V: G7]     Compassos 3 e 4 [I: C7M]
e|--1--1--1--1---|--1--1--1--1---|--0--0--0--0---|--0--0--0--0---|
B|--1--1--1--1---|--0--0--0--0---|--0--0--0--0---|--0--0--0--0---|
G|--2--2--2--2---|--0--0--0--0---|--0--0--0--0---|--0--0--0--0---|
D|--0--0--0--0---|--0--0--0--0---|--2--2--2--2---|--2--2--2--2---|
A|---------------|--2--2--2--2---|--3--3--3--3---|--3--3--3--3---|
E|---------------|--3--3--3--3---|---------------|---------------|
    (Subdominante)   (Tensão V)      (Resolução Tônica I por 2 compassos)`,
          instructions: [
            'Ligue o metrônomo a 70 BPM.',
            'No compasso 1, toque Dm7 por 4 tempos.',
            'No compasso 2, toque G7 criando a tensão dominante com o trítono.',
            'Nos compassos 3 e 4, repouse em C7M por 8 tempos desfrutando da estabilidade harmônica.',
            'Internalize a sensação de partida, tensão e retorno à casa.',
            'Execute 10 repetições perfeitas do ciclo.'
          ],
          biomechanicTips: [
            'Ao passar de G7 para C7M, o dedo 1 desce da 1ª corda c.1 diretamente para apoiar o C7M com economia de movimento.',
            'Mantenha o tempo rigoroso a cada virada de compasso.'
          ],
          validationCriteria: 'Executar 10 progressões II-V-I perfeitas a 70 BPM com resolução transparente no I grau.'
        }
      }
    ]
  },
  {
    level: 4,
    name: 'NÍVEL 4 — AVANÇADO E MODOS GREGOS',
    subtitle: 'Relação escala-acorde, modos gregos na prática e arpejos sobre a harmonia',
    badge: 'Avançado',
    description: 'Explore a paleta completa de cores musicais: os sete modos gregos (Dórico, Lídio, Mixolídio, etc.), arpejos em tétrades sobre as mudanças de acorde e improvisação com notas-alvo.',
    lessons: [
      {
        id: 'lesson-15',
        level: 4,
        moduleTitle: 'Módulo B: Pentatônicas e Solos',
        lessonNumber: 15,
        title: 'Aula 15 — A Pentatônica Maior e o Som Doce do Rock/Country',
        subtitle: 'Fórmula 1 - 2 - 3 - 5 - 6, a diferença de sonoridade e alternância entre Maior e Menor',
        objective: 'Compreender como a Pentatônica Maior se relaciona com a Pentatônica Menor e alternar entre as duas sobre um acorde dominante.',
        estimatedMinutes: 35,
        parts: [
          {
            id: 'l15-part-a',
            title: 'Parte A — A Terça Maior Muda Tudo',
            contentMarkdown: `
### Pentatônica Menor vs Pentatônica Maior

* **Pentatônica Menor:** 1 - b3 - 4 - 5 - b7 (Blues, Rock visceral, peso).
* **Pentatônica Maior:** 1 - 2 - 3 - 5 - 6 (Som brilhante, doce, sulista, estilo Allman Brothers, Hendrix e BB King).

Em Lá Maior (A), as notas são: **A — B — C# — E — F#**.
Repare no **C# (terça maior)**: ele casa perfeitamente com o acorde de Lá Maior na base!
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 5, label: 'A (1)' },
                { stringIndex: 4, fret: 2, label: 'B (2)' },
                { stringIndex: 4, fret: 4, label: 'C# (3)' },
                { stringIndex: 3, fret: 2, label: 'E (5)' },
                { stringIndex: 3, fret: 4, label: 'F# (6)' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l15-q1',
              question: 'Qual é a fórmula intervalar da Escala Pentatônica Maior?',
              options: [
                '1 (Tônica) — 2 (Segunda Maior) — 3 (Terça Maior) — 5 (Quinta Justa) — 6 (Sexta Maior)',
                '1 — b3 — 4 — 5 — b7',
                '1 — 2 — 3 — 4 — 5',
                '1 — 3 — 5 — 7 — 9'
              ],
              correctIndex: 0,
              explanation: 'A Pentatônica Maior tem como notas-chave a 3ª maior e a 6ª maior, criando um timbre doce e consonante.'
            },
            {
              id: 'l15-q2',
              question: 'Como encontrar o desenho da Pentatônica Maior a partir de uma tônica na guitarra?',
              options: [
                'Basta recuar 3 casas (1 tom e meio) para a relativa menor e tocar o shape do Padrão 1',
                'Avançar 5 casas',
                'Subir 2 cordas',
                'Não é possível usar o mesmo desenho'
              ],
              correctIndex: 0,
              explanation: 'A Pentatônica Maior de A usa as mesmas notas da Pentatônica Menor de F#m (recuando 3 casas da casa 5 para a casa 2).'
            },
            {
              id: 'l15-q3',
              question: 'Qual guitarrista clássico imortalizou a alternância entre Pentatônica Menor e Maior no Blues/Rock?',
              options: ['B.B. King', 'Ludwig van Beethoven', 'John Philip Sousa', 'Niccolò Paganini'],
              correctIndex: 0,
              explanation: 'B.B. King, Eric Clapton e Jimi Hendrix construíram seu fraseado histórico alternando entre a dor da menor e o sorriso da maior.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l15-penta-major-shape',
          title: 'Exercício Prático 15 — Pentatônica Maior de Lá (Casas 2 a 5) a 65 BPM',
          subtitle: 'A sonoridade doce country/southern rock com ênfase na Terça Maior C#',
          targetBpm: 65,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ (Palhetada Alternada Estrita)',
          notesSequence: [
            { stringNumber: 4, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'down', fret: 4 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 2 },
            { stringNumber: 3, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 4 },
            { stringNumber: 2, noteCipher: 'C#', notePt: 'Dó#', pickDirection: 'up', fret: 2 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 },
            { stringNumber: 1, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'up', fret: 2 },
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
          ],
          tablatureText: `e|--------------------2---5(A)---|
B|------------2---5--------------|
G|----2---4----------------------|
D|--4----------------------------|
    ↓ ↑   ↓   ↑   ↓   ↑   ↓`,
          instructions: [
            'Ligue o metrônomo a 65 BPM.',
            'Execute o shape da Pentatônica Maior de Lá iniciando na 4ª corda casa 4.',
            'Preste atenção especial à nota C# (2ª corda casa 2): escute o brilho afirmativo da terça maior.',
            'Finalize repousando na tônica Lá na 1ª corda casa 5.',
            'Complete 10 passagens seguidas sem perder o tempo.'
          ],
          biomechanicTips: [
            'Use os dedos 1 e 3 para a maioria das casas 2 e 4, e o dedo 4 para a casa 5.',
            'Toque com o ataque da palheta bem próximo ao captador da ponte para obter o estalo clássico.'
          ],
          validationCriteria: 'Executar 10 repetições limpas a 65 BPM com ênfase melódica na nota C#.'
        }
      },
      {
        id: 'lesson-16',
        level: 4,
        moduleTitle: 'Módulo A: Fundamentos Musicais',
        lessonNumber: 16,
        title: 'Aula 16 — Os Modos Gregos na Guitarra: A Cor de Cada Grau',
        subtitle: 'Jônio, Dórico, Frígio, Lídio, Mixolídio, Eólio e Lócrio explicados de forma simples e prática',
        objective: 'Entender que cada modo grego é uma cor emocional gerada pela ênfase na nota característica correspondente.',
        estimatedMinutes: 35,
        parts: [
          {
            id: 'l16-part-a',
            title: 'Parte A — O Que São os Modos sem Confusão Teórica',
            contentMarkdown: `
### Não Memorize Fórmulas Decoradas: Ouça a Cor

* **Dórico (2º grau):** Escala menor com **6ª Maior**. O som elegante de Carlos Santana (*Oye Como Va*) e Pink Floyd (*Breathe*).
* **Mixolídio (5º grau):** Escala maior com **7ª Menor**. O som do Blues-Rock clássico e Southern Rock.
* **Lídio (4º grau):** Escala maior com **4ª Aumentada (#4)**. O som místico e cinematográfico de Steve Vai e Joe Satriani.
* **Frígio (3º grau):** Escala menor com **2ª Menor (b2)**. O som flamenco, espanhol e do Metal pesado.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 4, fret: 0, label: 'D (1)' },
                { stringIndex: 3, fret: 2, label: 'A (5)' },
                { stringIndex: 2, fret: 4, label: 'B (6ª M - Dor)' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l16-q1',
              question: 'Qual é a nota característica que diferencia o Modo Dórico de uma escala menor natural (Eólia)?',
              options: [
                'A 6ª Maior (em vez de 6ª menor)',
                'A 2ª menor',
                'A 7ª maior',
                'A ausência de tônica'
              ],
              correctIndex: 0,
              explanation: 'A 6ª Maior no ambiente menor é a assinatura doce e jazzística do Modo Dórico (ex: nota Si em Ré Dórico).'
            },
            {
              id: 'l16-q2',
              question: 'Qual modo grego possui uma 4ª Aumentada (#4) gerando uma atmosfera espacial e cinematográfica?',
              options: ['Modo Lídio (4º grau)', 'Modo Lócrio', 'Modo Jônio', 'Modo Eólio'],
              correctIndex: 0,
              explanation: 'O Modo Lídio tem como marca registrada a #4 (quarta aumentada), celebrizada por Steve Vai e trilhas de ficção científica.'
            },
            {
              id: 'l16-q3',
              question: 'Qual modo grego casa perfeitamente sobre um acorde Dominante com 7ª (ex: G7 ou A7)?',
              options: ['Modo Mixolídio (5º grau)', 'Modo Dórico', 'Modo Frígio', 'Modo Lócrio'],
              correctIndex: 0,
              explanation: 'O Mixolídio é a escala maior natural com 7ª menor (1-2-3-4-5-6-b7), a parceira perfeita do acorde dominante.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l16-dorian-groove',
          title: 'Exercício Prático 16 — O Vamp Dórico em Ré (Dm7 -> G) a 75 BPM',
          subtitle: 'Enfatizando a 6ª Maior (nota Si na casa 4 da 3ª corda) estilo Santana',
          targetBpm: 75,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ com articulação fluida',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 },
            { stringNumber: 2, noteCipher: 'F', notePt: 'Fá', pickDirection: 'up', fret: 6 },
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 8 },
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 5 },
            { stringNumber: 1, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 7 }, // 6ª Maior!
          ],
          tablatureText: `Base: | Dm7 | G | (Repete)
Solo Dórico:
e|-------------------5---7(B - 6ª Maior!)---|
B|-----------6---8--------------------------|
G|---7(D)-----------------------------------|
     D3      D1  D3  D1  D3 (Vibrato longo na nota Si!)`,
          instructions: [
            'Ligue o metrônomo a 75 BPM.',
            'Toque a frase iniciando na nota Ré (3ª corda, casa 7).',
            'Suba pelas notas Fá e Sol na 2ª corda, Lá na 1ª corda casa 5.',
            'Conclua pousando na nota Si (1ª corda, casa 7) com um vibrato largo.',
            'Repare como a nota Si transforma instantaneamente o clima menor tradicional em Dórico contemporâneo.',
            'Complete 10 passagens sentindo a cor modal.'
          ],
          biomechanicTips: [
            'O vibrato na nota Si deve ser estável e generoso para sustentar a cor do modo.',
            'Mantenha as pontas dos dedos relaxadas sobre a escala.'
          ],
          validationCriteria: 'Executar 10 repetições perfeitas a 75 BPM com afinação e sustentação da 6ª maior.'
        }
      }
    ]
  },
  {
    level: 5,
    name: 'NÍVEL 5 — DOMÍNIO MUSICAL E PROFISSIONALISMO',
    subtitle: 'Condução de vozes (voice leading), arranjos solo, dinamismo de banda e palco',
    badge: 'Mestre',
    description: 'A maestria e autonomia definitiva do guitarrista: inversões no sistema CAGED, voice leading suave, arranjo estilo Hendrix/Mateus Asato e como tocar com banda e acompanhar cantores sem embolar.',
    lessons: [
      {
        id: 'lesson-17',
        level: 5,
        moduleTitle: 'Módulo A: Fundamentos Musicais',
        lessonNumber: 17,
        title: 'Aula 17 — Voice Leading e Inversões de Acordes',
        subtitle: 'Conectando as notas mais próximas entre acordes e arranjos estilo Chord Melody',
        objective: 'Aprender a movimentar as vozes harmônicas no braço com deslocamentos mínimos por semitons ou tons, criando melodias internas fluidas.',
        estimatedMinutes: 40,
        parts: [
          {
            id: 'l17-part-a',
            title: 'Parte A — A Arte de Não Pular Desajeitadamente pelo Braço',
            contentMarkdown: `
### O Segredo dos Mestres

Um guitarrista maduro não pula da casa 1 para a casa 8 de forma bruta.
Ele usa **inversões de acordes** (baixo na terça ou na quinta) e **tríades nas cordas 1-2-3 ou 2-3-4**. As terças e as sétimas caminham suavemente por semitons, criando uma condução polifônica elegante.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 4, fret: 2, label: 'G/B: B' },
                { stringIndex: 3, fret: 0, label: 'G' },
                { stringIndex: 2, fret: 0, label: 'D' },
                { stringIndex: 1, fret: 3, label: 'G' },
              ]
            }
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l17-q1',
              question: 'O que significa tecnicamente o conceito de "Voice Leading" (condução de vozes)?',
              options: [
                'Mover as notas individuais entre acordes pela menor distância possível (semitons ou tons), mantendo notas comuns',
                'Cantar junto com a guitarra no microfone',
                'Tocar apenas a nota mais aguda',
                'Pular 10 casas a cada acorde'
              ],
              correctIndex: 0,
              explanation: 'Voice leading é a arte da polifonia suave: cada nota do acorde anterior caminha com elegância para a nota mais próxima do próximo acorde.'
            },
            {
              id: 'l17-q2',
              question: 'O que significa a notação com barra "G/B"?',
              options: [
                'Acorde de Sol Maior (G) com o baixo na nota Si (B), a terça maior no baixo',
                'Tocar Sol e Si ao mesmo tempo em instrumentos diferentes',
                'Sol Maior dividido por Si',
                'Um acorde menor'
              ],
              correctIndex: 0,
              explanation: 'Em acordes invertidos (slash chords), a letra antes da barra é o acorde e a letra após a barra é a nota do baixo.'
            },
            {
              id: 'l17-q3',
              question: 'Por que a sequência C -> G/B -> Am cria uma linha de baixo tão apreciada na música popular?',
              options: [
                'Porque o baixo faz uma descida cromática/diatônica contínua: C (casa 3) -> B (casa 2) -> A (solta)',
                'Porque elimina os graves',
                'Porque todos os acordes são iguais',
                'Porque é mais rápida'
              ],
              correctIndex: 0,
              explanation: 'A linha de baixo melódica Dó -> Si -> Lá na 5ª corda conecta a progressão de forma orgânica e comovente.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l17-voice-leading-line',
          title: 'Exercício Prático 17 — Voice Leading C -> G/B -> Am7 -> F7M a 60 BPM',
          subtitle: 'Descida suave do baixo na 5ª corda com notas compartilhadas no topo',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↓ ↓ ↓ (Condução Suave de Vozes)',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 2 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 1 },
          ],
          tablatureText: `    C                 G/B               Am7               F7M
e|--0---------------|--3---------------|--0---------------|--0---------------|
B|--1---------------|--3---------------|--1---------------|--1---------------|
G|--0---------------|--0---------------|--0---------------|--2---------------|
D|--2---------------|--0---------------|--2---------------|--3---------------|
A|--3(C)------------|--2(B)------------|--0(A)------------|------------------|
E|------------------|------------------|------------------|--1(F)------------|
   Baixo: Dó           Baixo: Si          Baixo: Lá          Baixo: Fá`,
          instructions: [
            'Ligue o metrônomo a 60 BPM.',
            'No compasso 1, monte Dó Maior (C) com o baixo no Dó (5ª corda c.3).',
            'No compasso 2, passe para G/B descendo apenas o baixo para a nota Si (5ª corda c.2).',
            'No compasso 3, solte a 5ª corda na nota Lá em Lá Menor 7 (Am7).',
            'No compasso 4, conclua no F7M com o polegar na 6ª corda c.1 ou dedo 3 na 4ª corda c.3.',
            'Sinta como a harmonia se move como um rio sem saltos abruptos.',
            'Execute 10 repetições completas com perfeição.'
          ],
          biomechanicTips: [
            'Concentre a pressão do polegar suavemente atrás do braço.',
            'Mantenha a nota da ponta aguda soando com clareza como uma linha de melodia superior.'
          ],
          validationCriteria: 'Executar 10 ciclos de voice leading a 60 BPM com a descida do baixo perfeitamente audível.'
        }
      },
      {
        id: 'lesson-18',
        level: 5,
        moduleTitle: 'Módulo D: Técnica e Rotina de Prática',
        lessonNumber: 18,
        title: 'Aula 18 — Tocando com Banda, Mixagem e Acompanhamento de Cantores',
        subtitle: 'Equalização da guitarra física, deixar espaço para o baixo e teclado, e dinâmica de palco',
        objective: 'Compreender como a guitarra física se insere na mixagem de uma banda e evitar conflito de frequências graves com o contrabaixo.',
        estimatedMinutes: 35,
        parts: [
          {
            id: 'l18-part-a',
            title: 'Parte A — A Guitarra é um Instrumento de Médios',
            contentMarkdown: `
### Como Não Embolar o Som em Grupo

1. **Corte o excesso de graves no seu amplificador:** A região de 40 a 150 Hz pertence ao bumbo da bateria e ao contrabaixo. Se a guitarra tiver muito grave, o som da banda vira uma "lama".
2. **Deixe o cantor respirar:** Quando o vocalista estiver cantando a estrofe, toque com dinâmica baixa ou use dedilhados espaçados. Solte o volume nos refrãos ou convenções.
3. **Escute os outros mais do que a si mesmo:** O grande guitarrista é aquele que faz a banda inteira soar melhor!
            `,
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l18-q1',
              question: 'Por que guitarristas experientes cortam o excesso de graves no amplificador ao tocar com banda?',
              options: [
                'Para não disputar espaço sonoro com o bumbo da bateria e o contrabaixo na faixa de 40 a 150 Hz',
                'Porque a guitarra não produz sons graves',
                'Para economizar eletricidade',
                'Porque o som fica mais baixo'
              ],
              correctIndex: 0,
              explanation: 'A guitarra é o rei dos médios (200 Hz a 4 kHz). Limpar os sub-graves evita embolar a mixagem com o contrabaixo.'
            },
            {
              id: 'l18-q2',
              question: 'O que um guitarrista deve fazer durante a estrofe da música enquanto o vocalista está cantando?',
              options: [
                'Reduzir a dinâmica, tocar com sutileza e deixar espaço para a voz brilhar',
                'Fazer um solo rápido em volume máximo',
                'Desafinar a guitarra',
                'Bater palmas'
              ],
              correctIndex: 0,
              explanation: 'Acompanhar é servir à canção: abrir espaço dinâmico para a voz cria impacto quando o refrão explode.'
            },
            {
              id: 'l18-q3',
              question: 'O que é a técnica de "Comping" nas cordas agudas 1-2-3?',
              options: [
                'Tocar acordes rítmicos percussivos e concisos nas cordas agudas, deixando todo o grave livre para o baixo',
                'Tocar todas as 6 cordas o mais alto possível',
                'Tocar apenas com a mão esquerda',
                'Usar apenas distorção pesada'
              ],
              correctIndex: 0,
              explanation: 'Comping (acompanhamento rítmico moderno) usa tríades limpas nas cordas agudas para pontuar a harmonia sem conflito.'
            }
          ]
        },
        practicalExercise: {
          id: 'ex-l18-band-comping-groove',
          title: 'Exercício Prático 18 — Comping Rítmico em Banda nas Cordas Agudas a 85 BPM',
          subtitle: 'Groove limpo de tríades nas cordas 1-2-3 com abafamento percussivo estilo funk/pop',
          targetBpm: 85,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ com staccato (abafamento imediato)',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 12 },
            { stringNumber: 2, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 13 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 12 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 14 },
          ],
          tablatureText: `Groove nas Cordas Agudas 1-2-3 (Tríades de C e F na 12ª casa):
Tempo:    1   e   2   e   3   e   4   e
Palheta:          ↓   ↑           ↓   ↑
Acento:           !   !           !   !
e|----------------12--12----------13--13---|
B|----------------13--13----------13--13---|
G|----------------12--12----------14--14---|
D|-----------------------------------------| (Cordas graves 6, 5 e 4 livres para o baixo!)
A|-----------------------------------------|
E|-----------------------------------------|`,
          instructions: [
            'Ligue o metrônomo a 85 BPM.',
            'Posicione a tríade de Dó Maior (C) nas cordas 1-2-3 na casa 12.',
            'No contratempo do tempo 2 e 4, ataque com palhetadas staccato cortantes (↓ ↑) e alivie a pressão imediatamente para silenciar as cordas.',
            'No compasso seguinte, mude para a tríade de Fá Maior (F) na casa 13/14.',
            'Note como o som ocupa um espaço cirúrgico e brilhante sem disputar os graves da banda.',
            'Conclua 10 repetições perfeitas com groove rítmico contagiante.'
          ],
          biomechanicTips: [
            'O staccato é obtido relaxando a tensão dos dedos sobre as cordas sem soltá-las da mão.',
            'Mantenha o pulso leve e elástico.'
          ],
          validationCriteria: 'Executar 10 repetições do groove a 85 BPM com precisão rítmica nos contratempos e staccatos secos.'
        }
      }
    ]
  }
];

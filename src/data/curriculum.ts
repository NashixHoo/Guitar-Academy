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
          }
        ]
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
        ]
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
          }
        ]
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
          }
        ]
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
          }
        ]
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
        ]
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
          }
        ]
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
          }
        ]
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
          }
        ]
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
          }
        ]
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
            id: 'l3-part-a',
            title: 'Parte A — Tríade + Sétima = Tétrade',
            contentMarkdown: `
### As 4 Famílias de Tétrades

1. **7M (Sétima Maior):** Tríade Maior + 7ª Maior (1 - 3 - 5 - 7). Som doce, lírico, sonhador (ex: C7M, F7M).
2. **m7 (Menor com Sétima):** Tríade Menor + 7ª Menor (1 - b3 - 5 - b7). Som moderno, Soul, R&B (ex: Am7, Dm7).
3. **7 (Dominante):** Tríade Maior + 7ª Menor (1 - 3 - 5 - b7). Contém o **trítono** (tensão máxima) que pede resolução (ex: G7, E7, D7).
4. **m7(b5) (Meio-Diminuto):** Tríade Diminuta + 7ª Menor (1 - b3 - b5 - b7). O clássico grau vii° e ii cadencial menor (ex: Bm7b5).
            `,
          }
        ]
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
          }
        ]
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
          }
        ]
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
          }
        ]
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
          }
        ]
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
        ]
      }
    ]
  }
];

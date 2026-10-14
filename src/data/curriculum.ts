import { LevelInfo } from '../types';

export const CURRICULUM_LEVELS: LevelInfo[] = [
  {
    level: 0,
    name: 'NÍVEL 0 — ABSOLUTO ZERO',
    subtitle: 'Primeiros passos, anatomia da guitarra, notas e afinação',
    badge: 'Iniciante',
    description: 'Aprenda os fundamentos absolutos: o alfabeto musical universal, a afinação e nome das seis cordas, tons e semitons, e sua primeira prática de coordenação motora.',
    lessons: [
      {
        id: 'lesson-1',
        level: 0,
        moduleTitle: 'Módulo 1: O Início da Jornada Musical',
        lessonNumber: 1,
        title: 'Aula 1 — Conhecendo as notas musicais e as seis cordas',
        subtitle: 'As sete notas naturais, a cifra internacional e a afinação das cordas',
        objective: 'Permitir que um iniciante compreenda o nome das cordas da guitarra e comece a reconhecer as notas musicais.',
        estimatedMinutes: 15,
        parts: [
          {
            id: 'l1-part-a',
            title: 'Parte A — As sete notas musicais',
            contentMarkdown: `
### As 7 Notas Naturais

A música ocidental é construída a partir de sete notas naturais principais:

**Dó — Ré — Mi — Fá — Sol — Lá — Si**

Na notação internacional moderna (utilizada mundialmente em cifras, tablaturas, métodos e softwares), utilizamos as letras de **A** até **G** para representar essas notas, começando pela nota Lá:

* **C** = Dó
* **D** = Ré
* **E** = Mi
* **F** = Fá
* **G** = Sol
* **A** = Lá
* **B** = Si

> 💡 **Dica de Ouro:** Memorize a relação direta! O alfabeto musical começa em **A (Lá)** e vai até **G (Sol)**. Quando você vê a letra **E**, pense imediatamente em **Mi**. Quando vê a letra **C**, pense em **Dó**.

Após o **Si (B)**, o ciclo não termina: ele recomeça em **Dó (C)** novamente, em uma altura mais aguda chamada de **oitava superior** (... Si, Dó, Ré, Mi ...). Essa repetição em oitavas é o que permite à música subir e descer pelas diferentes regiões sonoras.
            `,
          },
          {
            id: 'l1-part-b',
            title: 'Parte B — Tons e semitons',
            contentMarkdown: `
### A Medida da Distância Musical

Na música, medimos a distância entre as alturas das notas utilizando duas unidades fundamentais: o **semitom** e o **tom**.

* **Semitom (meio tom):** É a menor distância usual entre notas consecutivas no nosso sistema tonal. Na guitarra, **cada casa do braço equivale exatamente a um semitom**.
* **Tom (tom inteiro):** Equivale à soma de **dois semitons**. Na guitarra, andar um tom significa avançar ou recuar **duas casas**.

### A Regra de Ouro dos Semitons Naturais

Preste muita atenção nesta regra, pois ela guiará toda a sua vida como guitarrista:

* Entre **Mi e Fá** existe **apenas um semitom** (não há casa no meio!).
* Entre **Si e Dó** existe **apenas um semitom** (não há casa no meio!).
* Entre todos os outros pares consecutivos (**Dó-Ré**, **Ré-Mi**, **Fá-Sol**, **Sol-Lá**, **Lá-Si**) existe a distância de **um tom inteiro** (dois semitons).

\`\`\`
Dó --(tom)--> Ré --(tom)--> Mi -(semitom)-> Fá --(tom)--> Sol --(tom)--> Lá --(tom)--> Si -(semitom)-> Dó
 C             D             E               F             G             A             B               C
\`\`\`

### Sustenidos (#) e Bemóis (b)

O que existe entre duas notas separadas por um tom inteiro (como entre Dó e Ré)? Existe uma nota intermediária!
* O símbolo de **sustenido (#)** eleva a nota em um semitom.
* O símbolo de **bemol (b)** abaixa a nota em um semitom.

Por isso, a nota que fica entre Dó e Ré pode ser chamada de **Dó sustenido (C#)** ou de **Ré bemol (Db)**. No temperamento igual utilizado pelos instrumentos modernos, essas duas notas possuem a mesma altura sonora exata. Esse fenômeno sonoro é chamado de **enarmonia**.
            `,
          },
          {
            id: 'l1-part-c',
            title: 'Parte C — As seis cordas da guitarra',
            contentMarkdown: `
### Afinação Padrão (Standard Tuning)

A guitarra possui 6 cordas. Por convenção internacional, as cordas são numeradas **da mais fina (1ª) para a mais grossa (6ª)**.

Porém, quando afina e estuda, o guitarrista pensa nas duas ordens. Aqui está a afinação padrão completa, da corda mais grave (grossa) para a mais aguda (fina):

* **6ª corda (mais grossa):** **E** — Mi grave (E2)
* **5ª corda:** **A** — Lá (A2)
* **4ª corda:** **D** — Ré (D3)
* **3ª corda:** **G** — Sol (G3)
* **2ª corda:** **B** — Si (B3)
* **1ª corda (mais fina):** **E** — Mi agudo (E4)

> 🎸 **Observe:** A 1ª e a 6ª corda têm o mesmo nome de nota (**Mi / E**), porém estão separadas por duas oitavas de distância sonora! A 6ª corda é o grave de apoio, enquanto a 1ª corda é o agudo brilhante dos solos.

Explore o braço interativo abaixo para tocar as cordas soltas e verificar o som sintetizado de cada uma.
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
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'q1',
              question: '1. Qual é o nome da 6ª corda solta?',
              options: [
                'Mi, ou E',
                'Lá, ou A',
                'Sol, ou G',
                'Ré, ou D'
              ],
              correctIndex: 0,
              explanation: 'A 6ª corda solta (a mais grossa) é afinada na nota Mi (cifra E). Ela é a referência fundamental do grave da guitarra.'
            },
            {
              id: 'q2',
              question: '2. Qual é a cifra internacional de Lá?',
              options: [
                'A',
                'B',
                'C',
                'L'
              ],
              correctIndex: 0,
              explanation: 'No sistema de cifras ocidental, as notas começam pela letra A representando Lá (A=Lá, B=Si, C=Dó, D=Ré, E=Mi, F=Fá, G=Sol).'
            },
            {
              id: 'q3',
              question: '3. Qual nota natural vem imediatamente depois de Mi?',
              options: [
                'Fá',
                'Sol',
                'Ré',
                'Fá#'
              ],
              correctIndex: 0,
              explanation: 'Na sequência das notas naturais (Dó, Ré, Mi, Fá, Sol, Lá, Si), a nota imediatamente posterior a Mi é Fá.'
            },
            {
              id: 'q4',
              question: '4. Quantos semitons existem entre Mi e Fá?',
              options: [
                'Um semitom',
                'Dois semitons',
                'Meio semitom',
                'Um tom'
              ],
              correctIndex: 0,
              explanation: 'Entre Mi e Fá (assim como entre Si e Dó) existe a distância natural de apenas um semitom (uma única casa no braço da guitarra).'
            },
            {
              id: 'q5',
              question: '5. Qual é o nome da 1ª corda solta?',
              options: [
                'Mi, ou E',
                'Si, ou B',
                'Sol, ou G',
                'Lá, ou A'
              ],
              correctIndex: 0,
              explanation: 'A 1ª corda solta (a mais fina) é afinada também na nota Mi (cifra E), exatamente duas oitavas acima da 6ª corda.'
            }
          ]
        }
      },
      {
        id: 'lesson-2',
        level: 0,
        moduleTitle: 'Módulo 1: O Início da Jornada Musical',
        lessonNumber: 2,
        title: 'Aula 2 — Tons, semitons e as notas no braço da guitarra',
        subtitle: 'Descobrindo todas as notas ao longo das casas 0 a 12',
        objective: 'Compreender como o braço da guitarra se organiza e como encontrar qualquer nota aplicando a fórmula cromática.',
        estimatedMinutes: 20,
        parts: [
          {
            id: 'l2-part-a',
            title: 'Parte A — Cada casa é um semitom',
            contentMarkdown: `
### O Mapa do Braço da Guitarra

Diferente de um teclado de piano onde as teclas brancas e pretas são visualmente distintas, na guitarra todas as casas parecem semelhantes à primeira vista.

No entanto, a lógica é extremamente simples e matemática:

1. **Cada casa que você sobe em direção ao corpo da guitarra avança exatamente 1 semitom**.
2. **Duas casas avançam 1 tom inteiro**.
3. **Na 12ª casa**, todas as notas se repetem exatamente uma oitava acima da corda solta!

Por exemplo, na **6ª corda (Mi solta)**:
* Casa 0 (solta): **Mi**
* Casa 1: **Fá** (lembre-se: entre Mi e Fá há apenas 1 semitom!)
* Casa 2: **Fá# / Solb**
* Casa 3: **Sol**
* Casa 4: **Sol# / Láb**
* Casa 5: **Lá**
* Casa 7: **Si**
* Casa 8: **Dó** (entre Si e Dó há apenas 1 semitom!)
* Casa 10: **Ré**
* Casa 12: **Mi** (oitava completa!)
            `,
          },
          {
            id: 'l2-part-b',
            title: 'Parte B — As marcações do braço (Inlays)',
            contentMarkdown: `
### Guiando os Seus Olhos

Repare nas pequenas bolinhas ou marcações no braço (e na borda superior):
* As casas marcadas padrão são: **3, 5, 7, 9** e **12** (marcação dupla).
* A 12ª casa possui duas bolinhas porque marca o centro exato da corda vibrante: a oitava perfeita!
* Ao memorizar as notas nas casas 3, 5 e 7 das cordas 6 e 5, você já terá dominado mais de 80% das fundamentais dos acordes de Rock e Pop!
            `,
          }
        ],
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'l2-q1',
              question: 'Se a 6ª corda solta é Mi, qual nota encontramos na 1ª casa da 6ª corda?',
              options: ['Fá', 'Fá#', 'Sol', 'Mi#'],
              correctIndex: 0,
              explanation: 'Como a distância entre Mi e Fá é de apenas 1 semitom (1 casa), a 1ª casa da 6ª corda é a nota Fá.'
            },
            {
              id: 'l2-q2',
              question: 'Qual nota está na 3ª casa da 6ª corda?',
              options: ['Sol', 'Fá', 'Lá', 'Dó'],
              correctIndex: 0,
              explanation: 'Casa 0 = Mi, Casa 1 = Fá, Casa 2 = Fá#, Casa 3 = Sol!'
            },
            {
              id: 'l2-q3',
              question: 'O que acontece quando tocamos qualquer corda na 12ª casa?',
              options: [
                'Ouvimos a mesma nota da corda solta, uma oitava mais aguda',
                'O som fica mais grave',
                'Ocorre uma dissonância',
                'A nota muda para Dó'
              ],
              correctIndex: 0,
              explanation: 'A 12ª casa divide a corda na metade exata do comprimento vibrante, gerando a oitava superior da mesma nota.'
            }
          ]
        }
      },
      {
        id: 'lesson-3',
        level: 0,
        moduleTitle: 'Módulo 2: Técnica e Ritmo Inicial',
        lessonNumber: 3,
        title: 'Aula 3 — Postura, palhetada e coordenação motora',
        subtitle: 'Como segurar a palheta e o exercício de independência 1-2-3-4',
        objective: 'Desenvolver a pegada correta da palheta e a sincronia entre a mão direita e esquerda com som limpo.',
        estimatedMinutes: 20,
        parts: [
          {
            id: 'l3-part-a',
            title: 'Parte A — Empunhadura da Palheta e Postura',
            contentMarkdown: `
### Como Segurar a Palheta

1. Coloque a palheta sobre a lateral do primeiro nó do dedo indicador da mão direita.
2. Pouse a almofada do polegar por cima, formando um ângulo de aproximadamente 90 graus.
3. Deixe apenas 3 a 4 milímetros da ponta da palheta expostos. Muita sobra causa imprecisão e perda de controle.
4. Mantenha o pulso solto e relaxado. A força rítmica vem do movimento sutil do punho, nunca de um braço rígido.

### Postura da Mão Esquerda (Escala)

* O polegar deve ficar repousado atrás do braço, aproximadamente na metade da largura, servindo de pivô.
* Curvar as articulações dos dedos como garrinhas, para que apenas a ponta do dedo toque a corda.
* Aperte a corda o mais próximo possível do traste de metal (sem subir nele) para obter som limpo sem esforço excessivo.
            `,
          },
          {
            id: 'l3-part-b',
            title: 'Parte B — O Exercício 1-2-3-4',
            contentMarkdown: `
### O Exercício Clássico de Independência

Numeramos os dedos da mão esquerda:
* **1** = Indicador
* **2** = Médio
* **3** = Anelar
* **4** = Mínimo

Toque na 6ª corda:
* Dedo 1 na casa 1 -> Palheta para baixo (↓)
* Dedo 2 na casa 2 -> Palheta para cima (↑)
* Dedo 3 na casa 3 -> Palheta para baixo (↓)
* Dedo 4 na casa 4 -> Palheta para cima (↑)

Repita nas cordas 5, 4, 3, 2 e 1, sempre alternando a palhetada (baixo e cima) e ouvindo cada nota ressoar com clareza cristalina!
            `,
          }
        ]
      },
      {
        id: 'lesson-4',
        level: 0,
        moduleTitle: 'Módulo 2: Técnica e Ritmo Inicial',
        lessonNumber: 4,
        title: 'Aula 4 — Pulsação, andamento e o uso do metrônomo',
        subtitle: 'Dominando o tempo, compasso 4/4 e as primeiras figuras de valor',
        objective: 'Compreender a pulsação musical e aprender a estudar com precisão rítmica com metrônomo.',
        estimatedMinutes: 20,
        parts: [
          {
            id: 'l4-part-a',
            title: 'Parte A — O que é o BPM e o Compasso 4/4',
            contentMarkdown: `
### O Coração da Música: A Pulsação

Toda música possui uma batida interna constante, chamada de **pulsação**.
A velocidade dessa pulsação é medida em **BPM (Batidas Por Minuto)**:
* 60 BPM = 1 batida por segundo (um andamento calmo e lento).
* 120 BPM = 2 batidas por segundo (andamento alegre de Pop e Rock).

O compasso mais comum da música ocidental é o **4/4 (quatro por quatro)**:
Cada ciclo possui **4 tempos**, com o tempo **1** recebendo um acento forte natural (TUM - tique - tique - tique).

### Figuras Rítmicas Básicas

* **Semínima (1/4):** Dura 1 batida inteira do metrônomo. Uma nota por clique.
* **Colcheia (1/8):** Divide a batida exatamente ao meio. Duas notas por clique (ditas como "1 e 2 e 3 e 4 e").
            `,
          }
        ]
      }
    ]
  },
  {
    level: 1,
    name: 'NÍVEL 1 — FUNDAMENTOS',
    subtitle: 'Acordes abertos, trocas limpas, ritmos de batida e tablaturas',
    badge: 'Fundamentos',
    description: 'Construa sua primeira base harmônica sólida: os acordes maiores e menores abertos (C, D, E, G, A, Em, Am, Dm), levadas rítmicas de mão direita e leitura de tablaturas.',
    lessons: [
      {
        id: 'lesson-5',
        level: 1,
        moduleTitle: 'Módulo 3: Seus Primeiros Acordes',
        lessonNumber: 5,
        title: 'Aula 5 — Acordes Maiores e Menores Abertos',
        subtitle: 'A diferença emocional entre Mi Maior (E) e Mi Menor (Em), Lá Maior (A) e Lá Menor (Am)',
        objective: 'Aprender a montar e sonorizar com perfeição os acordes E, Em, A e Am sem trastejar.',
        estimatedMinutes: 25,
        parts: [
          {
            id: 'l5-part-a',
            title: 'Parte A — Maior vs Menor',
            contentMarkdown: `
### A Emoção do Acorde: Terça Maior vs Terça Menor

Um acorde é formado pelo som simultâneo de três ou mais notas (uma tríade: tônica, terça e quinta).
A **terça** é a alma do acorde:
* **Acorde Maior (E, A):** Soa estável, alegre, triunfante.
* **Acorde Menor (Em, Am):** Soa melancólico, reflexivo, emotivo.

Veja como é fácil transformar **Mi Maior (E)** em **Mi Menor (Em)**: basta levantar o dedo 1 da 3ª corda! A nota Sol# (terça maior) se torna Sol natural (terça menor).
            `,
          }
        ]
      },
      {
        id: 'lesson-6',
        level: 1,
        moduleTitle: 'Módulo 3: Seus Primeiros Acordes',
        lessonNumber: 6,
        title: 'Aula 6 — C, G e D: O trio de ouro do Pop e Rock',
        subtitle: 'Dominando o Dó Maior, Sol Maior e Ré Maior',
        objective: 'Aprender as formas abertas de C, G e D e praticar a transição limpa entre elas sem interrupção do ritmo.',
        estimatedMinutes: 25,
        parts: [
          {
            id: 'l6-part-a',
            title: 'Parte A — O Triângulo de Ouro',
            contentMarkdown: `
Milhares de canções lendárias na história da música foram escritas usando apenas **C**, **G** e **D** (como Knockin' on Heaven's Door, Sweet Home Alabama e canções dos Beatles).

O segredo da mudança rápida:
1. Pratique a troca no ar (posicionando os dedos antes de descer).
2. Deixe o polegar suave, sem apertar o braço com força excessiva.
3. Não pare a mão rítmica! É melhor errar uma nota mantendo o compasso do que pausar o tempo.
            `,
          }
        ]
      }
    ]
  },
  {
    level: 2,
    name: 'NÍVEL 2 — INTERMEDIÁRIO',
    subtitle: 'Pestana, Power Chords, Pentatônica e Técnicas de Solo',
    badge: 'Intermediário',
    description: 'Desbloqueie todo o braço da guitarra: a técnica definitiva da pestana (Fá e Si), power chords para Rock com distorção, a Escala Pentatônica e técnicas de expressão (Bends, Vibratos, Slides, Hammer-ons e Pull-offs).',
    lessons: [
      {
        id: 'lesson-7',
        level: 2,
        moduleTitle: 'Módulo 4: A Conquista da Pestana',
        lessonNumber: 7,
        title: 'Aula 7 — A Pestana Sem Dor e Sem Força Excessiva',
        subtitle: 'A mecânica do Fá Maior (F) e Si Menor (Bm)',
        objective: 'Dominar o posicionamento do dedo indicador em pestana usando o peso do braço e não apenas a força dos dedos.',
        estimatedMinutes: 30,
        parts: [
          {
            id: 'l7-part-a',
            title: 'Parte A — A Física da Pestana',
            contentMarkdown: `
O maior erro do estudante iniciante é tentar "esmagar" o braço da guitarra com a força da pinça do polegar. Isso causa dor e tendinite!

O segredo anatômico:
* Use a lateral óssea do indicador (gire o dedo ligeiramente no sentido anti-horário).
* Puxe o braço suavemente em direção ao seu peito usando o peso do antebraço.
* Aproxime o indicador rente ao traste de metal.
            `,
          }
        ]
      },
      {
        id: 'lesson-8',
        level: 2,
        moduleTitle: 'Módulo 5: A Linguagem da Guitarra Solo',
        lessonNumber: 8,
        title: 'Aula 8 — A Escala Pentatônica Menor e o Padrão 1',
        subtitle: 'A escala fundamental do Blues, Rock e solos expressivos',
        objective: 'Compreender a fórmula 1 - b3 - 4 - 5 - b7 e aplicar os primeiros licks na tonalidade de Lá Menor.',
        estimatedMinutes: 30,
        parts: [
          {
            id: 'l8-part-a',
            title: 'Parte A — Por que a Pentatônica funciona tão bem',
            contentMarkdown: `
A Pentatônica remove os dois semitons mais tensos da escala menor (a 2ª e a 6ª menor). O resultado é uma escala onde **todas as 5 notas soam melódicas e sem atrito**, permitindo que você improvise com confiança total sem escorregar em notas de passagem incômodas.
            `,
          }
        ]
      }
    ]
  },
  {
    level: 3,
    name: 'NÍVEL 3 — HARMONIA APLICADA',
    subtitle: 'Campo Harmônico, Tétrades, Inversões e Cadências',
    badge: 'Harmonia',
    description: 'Entenda por que as músicas funcionam: como os acordes nascem de uma escala, as funções harmônicas (Tônica, Subdominante e Dominante), tétrades com 7ª e como transpor qualquer canção para outra tonalidade.',
    lessons: [
      {
        id: 'lesson-9',
        level: 3,
        moduleTitle: 'Módulo 6: O Campo Harmônico Maior',
        lessonNumber: 9,
        title: 'Aula 9 — A Família dos Acordes: Graus de I a VII',
        subtitle: 'I, ii, iii, IV, V, vi, vii° e como tirar músicas de ouvido',
        objective: 'Aprender a regra universal de formação dos acordes de qualquer tom maior: Maior, menor, menor, Maior, Maior, menor, diminuto.',
        estimatedMinutes: 30,
        parts: [
          {
            id: 'l9-part-a',
            title: 'Parte A — A Fórmula Universal',
            contentMarkdown: `
Em qualquer tonalidade maior do mundo, os acordes gerados pelas notas da escala seguem sempre esta ordem rigorosa:

* **Grau I:** Maior (C em Dó Maior) -> Função Tônica (Repouso, casa)
* **Grau ii:** Menor (Dm) -> Função Subdominante (Afastamento suave)
* **Grau iii:** Menor (Em) -> Função Tônica secundária
* **Grau IV:** Maior (F) -> Função Subdominante (Abertura, jornada)
* **Grau V:** Maior com 7ª (G7) -> Função Dominante (Tensão máxima, pede volta ao I)
* **Grau vi:** Menor (Am) -> Relativo Menor
* **Grau vii°:** Diminuto / Meio-diminuto (B°) -> Tensão dominante
            `,
          }
        ]
      }
    ]
  },
  {
    level: 4,
    name: 'NÍVEL 4 — AVANÇADO',
    subtitle: 'Modos Gregos, Escala Blues, Arpejos e Improvisação',
    badge: 'Avançado',
    description: 'Domine a cor e o sabor musical: os sete modos gregos (Jônio, Dórico, Frígio, Lídio, Mixolídio, Eólio e Lócrio), mapeamento de arpejos em tétrades sobre as mudanças harmônicas, notas-alvo e composição de solos memoráveis.',
    lessons: [
      {
        id: 'lesson-10',
        level: 4,
        moduleTitle: 'Módulo 7: A Cor dos Modos Gregos',
        lessonNumber: 10,
        title: 'Aula 10 — O Modo Dórico e o Som de Carlos Santana e Pink Floyd',
        subtitle: 'A magia da 6ª maior no contexto menor',
        objective: 'Diferenciar a escala menor natural do Modo Dórico e aplicar sobre vamp de acordes i - IV (ex: Dm7 - G7).',
        estimatedMinutes: 35,
        parts: [
          {
            id: 'l10-part-a',
            title: 'Parte A — O Poder da Nota Característica',
            contentMarkdown: `
O Modo Dórico tem a fórmula: **1 - 2 - b3 - 4 - 5 - 6 - b7**.
A nota mágica é a **6ª maior** (em Ré Menor, é a nota Si natural). Ela elimina a escuridão excessiva do modo eólio e traz um brilho sonhador sofisticado, eternizado em faixas como *Oye Como Va* e *Breathe*.
            `,
          }
        ]
      }
    ]
  },
  {
    level: 5,
    name: 'NÍVEL 5 — DOMÍNIO MUSICAL',
    subtitle: 'Harmonia Superior, Leitura à Primeira Vista e Arranjo',
    badge: 'Mestre',
    description: 'A maestria completa: leitura de partituras e cifras complexas em tempo real, transcrição de solos de ouvido, rearmonização, acordes com extensões (9ª, 11ª, 13ª, alterados) e preparação profissional para tocar em palcos e estúdios.',
    lessons: [
      {
        id: 'lesson-11',
        level: 5,
        moduleTitle: 'Módulo 8: Maestria Harmônica e Profissionalismo',
        lessonNumber: 11,
        title: 'Aula 11 — Acordes Alterados, Voice Leading e Arranjo Solo',
        subtitle: 'Condução suave de vozes e criação de arranjos Fingerstyle e Chord Melody',
        objective: 'Compreender como movimentar as vozes internas de um acorde com o menor deslocamento físico possível no braço.',
        estimatedMinutes: 40,
        parts: [
          {
            id: 'l11-part-a',
            title: 'Parte A — O Conceito de Voice Leading',
            contentMarkdown: `
Grandes mestres do violão e da guitarra não pulam desajeitadamente pelo braço entre um acorde e outro. Eles conectam as notas mais próximas (as terças e as sétimas caminham por semitons ou tons), criando uma melodia harmoniosa invisível que guia os ouvidos do ouvinte.
            `,
          }
        ]
      }
    ]
  }
];

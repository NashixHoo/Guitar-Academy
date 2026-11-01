import { ViolaoCourseModule } from '../types';

// =========================================================================
// GUITAR ACADEMY — DOMÍNIO TOTAL DO VIOLÃO
// Módulos 7 a 10 (Aulas 37 a 60)
// =========================================================================

export const VIOLAO_MODULES_7_TO_10: ViolaoCourseModule[] = [
  // =======================================================================
  // MÓDULO 7 — O SISTEMA CAGED APLICADO AO VIOLÃO ACÚSTICO (Aulas 37 a 42)
  // =======================================================================
  {
    id: 'violao-mod-7',
    moduleNumber: 7,
    title: 'O Sistema CAGED Aplicado ao Violão Acústico',
    subtitle: '5 desenhos universais conectados para destravar o braço inteiro do instrumento',
    badge: 'Módulo 7 • Domínio Espacial',
    description: 'Descubra como os 5 acordes abertos primordiais (C, A, G, E, D) se transformam em fôrmas móveis capazes de desenhar qualquer acorde, escala e arpégio da casa 0 até a casa 15 do violão acústico.',
    lessons: [
      {
        id: 'violao-lesson-37',
        level: 3,
        moduleTitle: 'Módulo 7 • Sistema CAGED',
        moduleNumber: 7,
        lessonNumber: 37,
        title: 'O Conceito do Sistema CAGED: 5 Formatos Conectados pelo Braço',
        subtitle: 'A engrenagem geométrica que interliga as 5 fôrmas abertas',
        objective: 'Compreender a lógica sequencial do CAGED: a ordem fixa C -> A -> G -> E -> D -> C e como cada forma compartilha notas com a forma seguinte.',
        estimatedMinutes: 25,
        prerequisites: ['Módulos 1 a 6 dominados.'],
        parts: [
          {
            id: 'vl37-p1',
            title: '1. A Palavra Mágica C-A-G-E-D',
            contentMarkdown: `### A Sequência Inquebrável
O sistema CAGED é o método mais eficiente do mundo para entender o braço das cordas:
* Ele se baseia nos 5 acordes abertos fundamentais: **C**, **A**, **G**, **E** e **D**.
* Qualquer acorde (por exemplo, Dó Maior) pode ser tocado em 5 regiões diferentes do braço, usando cada um desses 5 formatos:
  1. Dó em formato de C (casa 0-3)
  2. Dó em formato de A (casa 3-5)
  3. Dó em formato de G (casa 5-8)
  4. Dó em formato de E (casa 8-10)
  5. Dó em formato de D (casa 10-12)
Ao chegar na casa 12, o ciclo recomeça exatamente no formato de C uma oitava acima!`
          },
          {
            id: 'vl37-p2',
            title: '2. As Duas Notas de Encaixe',
            contentMarkdown: `O segredo do CAGED é que cada formato divide notas com o formato vizinho. As notas mais agudas da forma C são as notas mais graves da forma A. Como peças de um quebra-cabeça, eles se encaixam sem deixar nenhum espaço vazio no braço.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'C (Formato A)',
            namePt: 'Dó Maior no Formato de Lá (Casa 3)',
            formula: '1 - 5 - 1 - 3 - 5',
            notes: ['C', 'G', 'C', 'E', 'G'],
            notesPt: ['Dó', 'Sol', 'Dó', 'Mi', 'Sol'],
            frets: [-1, 3, 5, 5, 5, 3],
            fingers: [0, 1, 2, 3, 4, 1],
            avoidStrings: [6],
            tips: 'Pestana na casa 3 (baixo Dó na 5ª corda) e dedos 2, 3 e 4 na casa 5.',
            category: 'Pestana'
          },
          {
            symbol: 'C (Formato E)',
            namePt: 'Dó Maior no Formato de Mi (Casa 8)',
            formula: '1 - 5 - 1 - 3 - 5 - 1',
            notes: ['C', 'G', 'C', 'E', 'G', 'C'],
            notesPt: ['Dó', 'Sol', 'Dó', 'Mi', 'Sol', 'Dó'],
            frets: [8, 10, 10, 9, 8, 8],
            fingers: [1, 3, 4, 2, 1, 1],
            tips: 'Pestana completa na casa 8 (baixo Dó na 6ª corda).',
            category: 'Pestana'
          }
        ],
        practicalExercise: {
          title: 'Exercício 37 — Conectando Dó Aberto (Forma C) com Dó na Casa 3 (Forma A)',
          subtitle: 'A primeira ponte do sistema CAGED',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Arpejo descendente lento com palheta ou polegar',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `e|----0-------3---|
B|----1-------5---|
G|----0-------5---|
D|----2-------5---|
A|--3-------3-----|
E|----------------|
    C (Forma C)   C (Forma A)`,
          instructions: [
            'Observe que ambos os acordes têm o baixo na MESMA casa e corda (5ª corda, casa 3 = Dó).',
            'Alterne entre as duas fôrmas percebendo a mudança de timbre de aberto para compacto.'
          ],
          biomechanicTips: [
            'Não contraia o antebraço ao fazer a pestana da casa 3.'
          ],
          validationCriteria: 'Execução limpa das 5 cordas em ambos os formatos a 60 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: Variação de Timbre',
          description: 'Toque a estrofe da canção na região grave (Forma C) e o refrão na região média (Forma A) para criar dinâmica sonora.',
          tab: `e|----0---0-------3---3---|
B|----1---1-------5---5---|
G|----0---0-------5---5---|
D|----2---2-------5---5---|
A|--3---3-------3---3-----|
E|------------------------|`
        },
        commonErrors: [
          { issue: 'Achar que cada formato CAGED é um acorde diferente.', solution: 'O acorde é o MESMO (Dó Maior); o que muda é apenas o formato geométrico da mão ao longo da escala.' }
        ],
        challenge: {
          title: 'Desafio Letras do CAGED',
          description: 'Recite em voz alta a sequência partindo de cada letra: C-A-G-E-D, A-G-E-D-C, G-E-D-C-A, E-D-C-A-G, D-C-A-G-E.',
          instruction: 'Internalize a ordem circular do sistema.'
        },
        masteryCriteria: {
          learning: 'Compreende a ordem fixa do CAGED.',
          consolidating: 'Alterna Dó na forma de C e forma de A sem hesitar.',
          mastered: 'Visualiza as 5 regiões do braço para qualquer tonalidade.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'O CAGED é a bússola cartográfica definitiva do braço do violão.'
      },
      {
        id: 'violao-lesson-38',
        level: 3,
        moduleTitle: 'Módulo 7 • Sistema CAGED',
        moduleNumber: 7,
        lessonNumber: 38,
        title: 'Mapeando os 5 Formatos de Acordes Maiores (C, A, G, E, D)',
        subtitle: 'A jornada completa de Dó Maior da casa 0 até a casa 12',
        objective: 'Tocar o mesmo acorde de Dó Maior nos 5 formatos consecutivos do CAGED pelo braço inteiro, identificando a localização da tônica em cada desenho.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 37.'],
        parts: [
          {
            id: 'vl38-p1',
            title: '1. Onde Fica a Tônica em Cada Formato?',
            contentMarkdown: `### O Ponto de Referência Visual
* **Formato C:** Tônica na **5ª corda** (dedo 3) e na **2ª corda** (dedo 1).
* **Formato A:** Tônica na **5ª corda** (pestana) e na **3ª corda** (dedo 3).
* **Formato G:** Tônica na **6ª corda** (dedo 4), na **3ª corda** (dedo 1) e na **1ª corda** (dedo 4).
* **Formato E:** Tônica na **6ª corda** (pestana), na **4ª corda** (dedo 3) e na **1ª corda** (pestana).
* **Formato D:** Tônica na **4ª corda** (solta/pestana) e na **2ª corda** (dedo 3).`
          },
          {
            id: 'vl38-p2',
            title: '2. Tocando Dó nos 5 Formatos',
            contentMarkdown: `1. Forma C (Casa 0-3): [-1, 3, 2, 0, 1, 0]
2. Forma A (Casa 3-5): [-1, 3, 5, 5, 5, 3]
3. Forma G (Casa 5-8): [8, 7, 5, 5, 5, 8] (ou tríade aguda [-1, -1, 5, 5, 5, 8])
4. Forma E (Casa 8-10): [8, 10, 10, 9, 8, 8]
5. Forma D (Casa 10-12): [-1, -1, 10, 12, 13, 12]`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'C (Formato D)',
            namePt: 'Dó Maior no Formato de Ré (Casa 10-12)',
            formula: '1 - 5 - 1 - 3',
            notes: ['C', 'G', 'C', 'E'],
            notesPt: ['Dó', 'Sol', 'Dó', 'Mi'],
            frets: [-1, -1, 10, 12, 13, 12],
            fingers: [0, 0, 1, 2, 4, 3],
            avoidStrings: [6, 5],
            tips: 'Formato triangular de Ré na 10ª casa. Tônica na 4ª corda casa 10.',
            category: 'CAGED'
          }
        ],
        practicalExercise: {
          title: 'Exercício 38 — A Peregrinação dos 5 Dós pelo Braço',
          subtitle: 'Tocando Dó da casa 0 até a casa 12',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Arpejo com palheta ou polegar',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 8 },
            { stringNumber: 4, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 10 }
          ],
          tablatureText: `e|--0-------3-------8-------8-------12---|
B|--1-------5-------5-------8-------13---|
G|--0-------5-------5-------9-------12---|
D|--2-------5-------5-------10------10---|
A|--3-------3-------7-------10-----------|
E|------------------8-------8------------|
    Forma C Forma A Forma G Forma E Forma D`,
          instructions: [
            'Suba casa por casa visualizando a tônica Dó antes de tocar.',
            'Conecte o som agudo de cada formato com o grave do seguinte.'
          ],
          biomechanicTips: [
            'Nas casas agudas (8 a 12), os trastes são mais estreitos; use as pontas dos dedos finas e precisas.'
          ],
          validationCriteria: 'Execução sequencial dos 5 formatos sem pausas acima de 2 segundos.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: Solos com Acordes Integrados',
          description: 'A técnica de Jimi Hendrix e Stevie Ray Vaughan de mesclar acordes e riffs na mesma posição.',
          tab: `e|----12---12-------8---8---|
B|----13---13-------8---8---|
G|----12---12-------9---9---|
D|--10------------10--------|
A|--------------------------|
E|--------------8-----------|`
        },
        commonErrors: [
          { issue: 'Tentar montar o formato G completo com pestana pesada.', solution: 'No violão acústico, toque a forma de G reduzida (cordas 4, 3, 2 e 1), que é leve e soa brilhante.' }
        ],
        challenge: {
          title: 'Desafio Subida e Descida',
          description: 'Toque as 5 formas de C subindo até a casa 12 e desça de volta até a casa 0.',
          instruction: 'Faça o trajeto a 60 BPM mantendo o ritmo.'
        },
        masteryCriteria: {
          learning: 'Localiza a tônica nos 5 formatos.',
          consolidating: 'Toca as 5 formas de Dó no violão com afinação correta.',
          mastered: 'Aplica os 5 formatos para qualquer outro acorde maior (G, A, E, F).'
        },
        speedGoals: { startingBpm: 55, intermediateBpm: 70, targetBpm: 85 },
        reviewNotes: 'Agora você não está mais restrito aos 3 primeiros trastes do violão.'
      },
      {
        id: 'violao-lesson-39',
        level: 3,
        moduleTitle: 'Módulo 7 • Sistema CAGED',
        moduleNumber: 7,
        lessonNumber: 39,
        title: 'Mapeando os 5 Formatos de Acordes Menores (Cm, Am, Gm, Em, Dm)',
        subtitle: 'A versão menor do sistema: abaixando a 3ª em meio-tom',
        objective: 'Compreender como a descida da terça maior para menor (b3) transforma as 5 formas do CAGED em suas contrapartes menores móveis.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 38.'],
        parts: [
          {
            id: 'vl39-p1',
            title: '1. A Transformação de Maior para Menor',
            contentMarkdown: `### O Movimento de Apenas Uma Nota
Para transformar qualquer formato do CAGED maior em menor, basta localizar a **terça maior** e movê-la **1 casa para trás** (1 semitom mais grave):
* Forma E vira **Forma Em** (ex: Am na casa 5: [5, 7, 7, 5, 5, 5])
* Forma A vira **Forma Am** (ex: Dm na casa 5: [-1, 5, 7, 7, 6, 5])
* Forma D vira **Forma Dm** (ex: Gm na casa 5: [-1, -1, 5, 7, 8, 6])
* Forma C vira **Forma Cm** (ex: Fm na casa 5: [-1, 8, 6, 5, 6, -1])
* Forma G vira **Forma Gm** (usada em voicings de 3 cordas).`
          },
          {
            id: 'vl39-p2',
            title: '2. As Duas Formas Menores Rainhas: Em e Am',
            contentMarkdown: `No dia a dia do violão acústico, as formas **Em** e **Am** cobrem 90% das necessidades práticas de pestanas menores, enquanto as formas Dm e Cm oferecem cores solistas líricas no registro agudo.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Am (Formato Em - Casa 5)',
            namePt: 'Lá Menor no Formato de Mi Menor',
            formula: '1 - 5 - 1 - b3 - 5 - 1',
            notes: ['A', 'E', 'A', 'C', 'E', 'A'],
            notesPt: ['Lá', 'Mi', 'Lá', 'Dó', 'Mi', 'Lá'],
            frets: [5, 7, 7, 5, 5, 5],
            fingers: [1, 3, 4, 1, 1, 1],
            tips: 'Pestana na casa 5 com dedos 3 e 4 nas cordas 5 e 4.',
            category: 'Pestana'
          },
          {
            symbol: 'Dm (Formato Am - Casa 5)',
            namePt: 'Ré Menor no Formato de Lá Menor',
            formula: '1 - 5 - 1 - b3 - 5',
            notes: ['D', 'A', 'D', 'F', 'A'],
            notesPt: ['Ré', 'Lá', 'Ré', 'Fá', 'Lá'],
            frets: [-1, 5, 7, 7, 6, 5],
            fingers: [0, 1, 3, 4, 2, 1],
            avoidStrings: [6],
            tips: 'Pestana na casa 5 da corda 5 para baixo.',
            category: 'Pestana'
          }
        ],
        practicalExercise: {
          title: 'Exercício 39 — O Diálogo Menor Am (Casa 0) vs Am (Casa 5)',
          subtitle: 'Comparando o Lá Menor aberto com a forma de Mi menor',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado P-I-M-A',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 }
          ],
          tablatureText: `e|----0-------5---|
B|----1-------5---|
G|----2-------5---|
D|----2-------7---|
A|--0---------7---|
E|----------5-----|
    Am (0)  Am (5)`,
          instructions: [
            'Sinta a diferença de ressonância entre o acorde aberto com cordas soltas e o acorde fechado com pestana.',
            'Ambos têm exatamente as mesmas notas fundamentais (Lá, Dó, Mi).'
          ],
          biomechanicTips: [
            'Aproxime o dedo 1 bem rente ao traste de ferro na casa 5 para obter som limpo com pouca pressão.'
          ],
          validationCriteria: 'Todas as notas soando sem trastejamento a 65 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Flamenco e o Rock Acústico',
          description: 'O uso de pestanas menores dinâmicas para criar batidas percussivas e staccatos.',
          tab: `e|--5---5---5---5---|
B|--5---5---5---5---|
G|--5---5---5---5---|
D|--7---7---7---7---|
A|--7---7---7---7---|
E|--5---5---5---5---|`
        },
        commonErrors: [
          { issue: 'Esquecer de recuar a terça ao mudar de formato maior para menor.', solution: 'A terça é o dedo que define o humor do acorde: 1 casa para trás torna o acorde menor.' }
        ],
        challenge: {
          title: 'Desafio Formatos Menores',
          description: 'Toque Em aberto, depois toque Em na casa 7 (forma de Am) e na casa 12 (forma de Em oitavada).',
          instruction: 'Execute com arpejos suaves.'
        },
        masteryCriteria: {
          learning: 'Compreende a alteração da terça.',
          consolidating: 'Alterna formas menores no braço com afinação precisa.',
          mastered: 'Visualiza imediatamente os 5 formatos menores para qualquer nota raiz.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Com os formatos maiores e menores dominados, a cartografia do braço está quase completa.'
      },
      {
        id: 'violao-lesson-40',
        level: 3,
        moduleTitle: 'Módulo 7 • Sistema CAGED',
        moduleNumber: 7,
        lessonNumber: 40,
        title: 'Conectando Arpégios aos 5 Desenhos CAGED',
        subtitle: 'Como tocar as notas do acorde uma a uma ao longo de toda a escala',
        objective: 'Tocar arpégios maiores e menores vinculados aos formatos CAGED, compreendendo a relação entre a forma física do acorde e o solo melódico.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 38 e 39.'],
        parts: [
          {
            id: 'vl40-p1',
            title: '1. O Que É um Arpégio no Violão?',
            contentMarkdown: `### O Acorde Desenhado em Linha Melódica
Enquanto um acorde é tocado com todas as notas soando juntas, o **arpégio** é o mesmo acorde tocado nota após nota em sequência:
* Cada formato CAGED contém internamente um desenho exato de arpégio (1 - 3 - 5).
* Ao tocar o arpégio correspondente à fôrma do acorde, você nunca erra uma nota durante o solo ou improviso: você está tocando a própria harmonia!`
          },
          {
            id: 'vl40-p2',
            title: '2. O Arpégio de Dó Maior na Forma E (Casa 8)',
            contentMarkdown: `Notas: C (8), E (7), G (10), C (10), E (9), G (8), C (8).
Todas essas notas estão debaixo dos seus dedos na casa 8. Tocar esse arpégio é como dedilhar a alma do acorde.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'C Arpégio (Forma E)',
            namePt: 'Arpégio de Dó Maior na Casa 8',
            formula: '1 - 3 - 5 - 1 - 3 - 5 - 1',
            notes: ['C', 'E', 'G', 'C', 'E', 'G', 'C'],
            notesPt: ['Dó', 'Mi', 'Sol', 'Dó', 'Mi', 'Sol', 'Dó'],
            frets: [8, 10, 10, 9, 8, 8],
            fingers: [1, 3, 4, 2, 1, 1],
            tips: 'Toque nota por nota separadamente com palhetada alternada ou P-I-M-A.',
            category: 'Arpégio'
          }
        ],
        practicalExercise: {
          title: 'Exercício 40 — Arpégio Completo de Dó Maior (Formato E)',
          subtitle: 'Subindo e descendo as 6 cordas na casa 8',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Palhetada alternada estrita (Baixo/Cima)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 8 },
            { stringNumber: 5, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 7 },
            { stringNumber: 5, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 10 },
            { stringNumber: 4, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 10 }
          ],
          tablatureText: `e|----------------------8--12--8-----------------------|
B|-------------------8------------8-------------------|
G|----------------9------------------9----------------|
D|------------10------------------------10------------|
A|--------10--------------------------------10--------|
E|--8--12---------------------------------------12--8--|`,
          instructions: [
            'Articule cada nota com clareza. Não deixe as notas embolarem umas sobre as outras.',
            'Cada dedo pressiona e solta a corda com precisão.'
          ],
          biomechanicTips: [
            'Mantenha o polegar atrás da escala alinhado com o dedo médio.'
          ],
          validationCriteria: 'Execução limpa sem ruído a 60 BPM com metrônomo.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Violão Clássico e o Choro',
          description: 'A base dos prelúdios de Heitor Villa-Lobos e dos contrapontos da música clássica de concerto.',
          tab: `e|--------8-------8---|
B|------8---8---8-----|
G|----9-------9-------|
D|--10----------------|
A|--------------------|
E|--------------------|`
        },
        commonErrors: [
          { issue: 'Deixar todos os dedos presos como se fosse um acorde em bloco.', solution: 'No arpégio melódico, levante os dedos suavemente após a nota soar para manter a pureza das notas isoladas.' }
        ],
        challenge: {
          title: 'Desafio Arpégio Forma A',
          description: 'Toque o arpégio de C a partir da casa 3 (5ª corda): C (3), E (2), G (5), C (5), E (5), G (3).',
          instruction: 'Execute subindo e descendo.'
        },
        masteryCriteria: {
          learning: 'Distingue acorde de arpégio.',
          consolidating: 'Toca o arpégio da casa 8 com ritmo regular.',
          mastered: 'Conecta arpégios consecutivos no improviso.'
        },
        speedGoals: { startingBpm: 55, intermediateBpm: 75, targetBpm: 95 },
        reviewNotes: 'Os arpégios do CAGED são as notas de ouro de qualquer solo expressivo no violão.'
      },
      {
        id: 'violao-lesson-41',
        level: 3,
        moduleTitle: 'Módulo 7 • Sistema CAGED',
        moduleNumber: 7,
        lessonNumber: 41,
        title: 'Escala Pentatônica Integrada aos Formatos CAGED',
        subtitle: 'A sobreposição perfeita entre acorde, pentatônica e expressividade',
        objective: 'Compreender como os 5 desenhos da escala pentatônica se encaixam milimetricamente sobre os 5 formatos de acordes do CAGED, permitindo solar sem sair da posição harmônica.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 40.'],
        parts: [
          {
            id: 'vl41-p1',
            title: '1. O Casamento do Acorde com a Pentatônica',
            contentMarkdown: `### Onde Está o Acorde, Está a Escala
Muitos alunos aprendem escalas decorando desenhos abstratos desconectados dos acordes. No violão de alto nível:
* A Pentatônica Maior (1 - 2 - 3 - 5 - 6) contém todas as notas da tríade (1 - 3 - 5) mais a 2ª e a 6ª!
* Portanto, cada um dos 5 desenhos da escala pentatônica mora EXATAMENTE dentro de um dos 5 formatos CAGED.
* Se você está tocando um acorde na forma de E, você já tem a pentatônica inteira debaixo dos seus dedos!`
          },
          {
            id: 'vl41-p2',
            title: '2. O Padrão Mais Famoso: Pentatônica Menor na Forma Em',
            contentMarkdown: `Em Lá Menor na casa 5:
* O acorde Am com pestana mora nas casas 5 e 7.
* A escala pentatônica de Lá Menor mora nas casas 5 e 8.
* Ao improvisar, use as notas do acorde como pontos de repouso e as outras notas da pentatônica como pontes de passagem.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Am Pentatônica (Casa 5)',
            namePt: 'Pentatônica de Lá Menor Integrada ao CAGED',
            formula: '1 - b3 - 4 - 5 - b7',
            notes: ['A', 'C', 'D', 'E', 'G'],
            notesPt: ['Lá', 'Dó', 'Mi', 'Sol', 'Ré'],
            frets: [5, 7, 7, 5, 5, 5],
            fingers: [1, 3, 4, 1, 1, 1],
            tips: 'Toque o acorde Am na casa 5 e em seguida solte frases da pentatônica em volta dele.',
            category: 'Escala'
          }
        ],
        practicalExercise: {
          title: 'Exercício 41 — Acorde + Lick Pentatônico na Mesma Posição',
          subtitle: 'A técnica híbrida do violonista virtuoso',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Batida com polegar no acorde, palhetada/dedos no lick',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'up', fret: 7 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 }
          ],
          tablatureText: `e|--5-------------------------|
B|--5--------------5--8--5----|
G|--5---------5h7-------------|
D|--7----5h7------------------|
A|--7-------------------------|
E|--5-------------------------|
    Am (Acorde)  Lick Pentatônico`,
          instructions: [
            'Toque o acorde Am firme na casa 5 no tempo 1.',
            'Nos tempos 2, 3 e 4, execute o fraseado pentatônico sem mover a mão da casa 5!'
          ],
          biomechanicTips: [
            'Mantenha o indicador como ponto de apoio na casa 5 durante os hammer-ons.'
          ],
          validationCriteria: 'Fluidez perfeita entre a batida do acorde e a resposta melódica.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Estilo John Mayer e B.B. King',
          description: 'A conversa espontânea entre base harmônica e solo em tempo real.',
          tab: `e|--5-------------------|
B|--5--------5----------|
G|--5----7b9---7--5-----|
D|--7----------------7--|
A|--7-------------------|
E|--5-------------------|`
        },
        commonErrors: [
          { issue: 'Sair da posição do acorde para caçar a escala em outro lugar.', solution: 'A escala está na mesma casa onde seu acorde já está montado. Não mova o braço!' }
        ],
        challenge: {
          title: 'Desafio Chamada e Resposta',
          description: 'Toque o acorde C na casa 8 (forma E) e responda com uma frase da pentatônica maior de C na mesma região.',
          instruction: 'Crie 3 frases diferentes sem sair da casa 8.'
        },
        masteryCriteria: {
          learning: 'Visualiza a pentatônica sobre o acorde.',
          consolidating: 'Combina acorde e lick pentatônico no tempo certo.',
          mastered: 'Improvisa frases musicais conectadas aos acordes da base.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 80, targetBpm: 100 },
        reviewNotes: 'Integrar acorde e escala na mesma posição é a chave para solar com autoridade no violão.'
      },
      {
        id: 'violao-lesson-42',
        level: 3,
        moduleTitle: 'Módulo 7 • Sistema CAGED',
        moduleNumber: 7,
        lessonNumber: 42,
        title: 'Navegação Livre pelo Braço Inteiro Usando o CAGED',
        subtitle: 'Unindo todas as peças: liberdade espacial total da pestana ao último traste',
        objective: 'Conectar com fluidez qualquer acorde, escala e tétrade através dos 5 blocos do CAGED, conquistando a capacidade de tocar em qualquer região do violão acústico sob demanda.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 37 a 41.'],
        parts: [
          {
            id: 'vl42-p1',
            title: '1. O Braço como um Território Unificado',
            contentMarkdown: `### O Fim das Regiões Misteriosas
Agora o braço do violão não é mais uma colcha de retalhos isolados:
* Se você quer tocar uma música inteira na região grave (casas 0 a 4), você tem os acordes e escalas abertos.
* Se você quer tocar na região média (casas 5 a 8), você usa os formatos A e G.
* Se você quer tocar na região alta (casas 8 a 14), você usa os formatos E e D.
Você nunca mais ficará perdido nem "preso" a uma única região!`
          },
          {
            id: 'vl42-p2',
            title: '2. Prática da Conexão Horizontal',
            contentMarkdown: `A verdadeira maestria no CAGED acontece quando você desliza horizontalmente entre dois formatos vizinhos (ex: de forma A para forma G) durante uma mesma frase musical.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'G (Formato E - Casa 3)',
            namePt: 'Sol Maior no Formato de Mi (Casa 3)',
            formula: '1 - 5 - 1 - 3 - 5 - 1',
            notes: ['G', 'D', 'G', 'B', 'D', 'G'],
            notesPt: ['Sol', 'Ré', 'Sol', 'Si', 'Ré', 'Sol'],
            frets: [3, 5, 5, 4, 3, 3],
            fingers: [1, 3, 4, 2, 1, 1],
            tips: 'Pestana na casa 3.',
            category: 'CAGED'
          }
        ],
        practicalExercise: {
          title: 'Exercício 42 — A Travessia Completa de Sol Maior nos 5 Formatos',
          subtitle: 'Tocando G pelo braço inteiro sem interrupções',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado P-I-M-A em cada posição',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 5 },
            { stringNumber: 5, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 10 }
          ],
          tablatureText: `e|--3-----7-----10-----10-----15---|
B|--0-----8-----12-----12-----12---|
G|--0-----7-----12-----12-----12---|
D|--0-----9-----12-----12-----12---|
A|--2-----10----10-----10----------|
E|--3------------------------------|
    Forma G Forma E Forma D Forma C Forma A`,
          instructions: [
            'Toque cada formato por 1 compasso.',
            'Conecte o som mentalmente ao acorde de Sol Maior da sua imaginação.'
          ],
          biomechanicTips: [
            'Respire fundo e mantenha o polegar deslizante suave atrás do braço.'
          ],
          validationCriteria: 'Conexão dos 5 blocos com andamento estável a 65 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: Arranjos de Violão Solo',
          description: 'A base necessária para criar arranjos de violão solo (melodia e harmonia simultâneas) onde cada nota da melodia dita qual formato CAGED deve ser escolhido.',
          tab: `e|--3---7---10---|
B|--0---8---12---|
G|--0---7---12---|
D|--0---9---12---|
A|--2---10--10---|
E|--3------------|`
        },
        commonErrors: [
          { issue: 'Olhar para as mãos com ansiedade ao saltar de posição.', solution: 'Olhe para a casa de destino ANTES de mover os dedos; a visão guia o movimento motor.' }
        ],
        challenge: {
          title: 'Desafio 12 Casas',
          description: 'Escolha qualquer música que você conhece e toque-a inteira usando apenas acordes acima da 5ª casa.',
          instruction: 'Sinta a libertação de não depender mais das cordas soltas.'
        },
        masteryCriteria: {
          learning: 'Navega pelos 5 blocos do CAGED.',
          consolidating: 'Executa a travessia de G em tempo constante.',
          mastered: 'Conecta qualquer tom em qualquer região com total autonomia.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Parabéns: você conquistou o domínio espacial completo do braço do violão.'
      }
    ]
  },

  // =======================================================================
  // MÓDULO 8 — TÉCNICAS DA MÃO DIREITA: LEVADAS, BATIDAS E FINGERSTYLE (Aulas 43 a 48)
  // =======================================================================
  {
    id: 'violao-mod-8',
    moduleNumber: 8,
    title: 'Técnicas da Mão Direita: Levadas, Batidas, Dedilhados e Fingerstyle',
    subtitle: 'O motor rítmico do violão: polirritmia, independência de polegar e o balanço brasileiro',
    badge: 'Módulo 8 • Rítmica & Fingerstyle',
    description: 'A mão esquerda escolhe as notas, mas é a mão direita que faz a música pulsar. Domine levadas pop/folk com síncopas, aprofunde dedilhados clássicos e modernos, aprenda o baixo alternado independente (Travis Picking), percussão no instrumento e a levada imortal da bossa nova.',
    lessons: [
      {
        id: 'violao-lesson-43',
        level: 2,
        moduleTitle: 'Módulo 8 • Mão Direita & Fingerstyle',
        moduleNumber: 8,
        lessonNumber: 43,
        title: 'Batidas e Levadas Rítmicas Pop/Folk (Síncopas, Acentos e Balanço)',
        subtitle: 'A mecânica do pêndulo constante e a dinâmica de acentuação',
        objective: 'Dominar a mecânica de pêndulo contínuo na mão direita, executando batidas com síncopas, contratempos e acentos dinâmicos nos tempos 2 e 4.',
        estimatedMinutes: 25,
        prerequisites: ['Postura correta da mão direita.'],
        parts: [
          {
            id: 'vl43-p1',
            title: '1. O Princípio do Pêndulo Rítmico',
            contentMarkdown: `### O Braço Direito Nunca Para
A regra máxima de ouro de qualquer levada rítmica no violão:
* A mão direita funciona como o **pêndulo de um relógio**: ela desce nos tempos (1, 2, 3, 4) e sobe nos contratempos (&).
* Para criar ritmos complexos com síncopas, você **NÃO interrompe o pêndulo**! Apenas passa raspando no ar (toque fantasma) sem encostar nas cordas.
* Padrão clássico: Baixo - [vácuo] - Baixo - Cima - [vácuo] - Cima - Baixo - Cima.`
          },
          {
            id: 'vl43-p2',
            title: '2. Acentuação nos Tempos 2 e 4 (A "Caixa" da Bateria)',
            contentMarkdown: `Em qualquer levada pop/rock, os tempos 2 e 4 devem ter mais peso e volume, simulando a caixa da bateria. Isso cria o groove e faz as pessoas baterem o pé junto com o violão.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 43 — A Batida Universal Pop/Folk',
          subtitle: 'A levada mais usada no mundo com acento nos tempos 2 e 4',
          targetBpm: 75,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ (1) ... ↓ ↑ (2&) ... ↑ ↓ ↑ (3& 4&)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `Ritmo:  ↓       ↓   ↑       ↑   ↓   ↑
Contagem: 1   &   2   &   3   &   4   &
         [G]                     [Cadd9]
e|-------3-------3---3-------3---3---3---|
B|-------3-------3---3-------3---3---3---|
G|-------0-------0---0-------0---0---0---|
D|-------0-------0---0-------2---2---2---|
A|-------2-------2---2-------3---3---3---|
E|-------3-------3---3-------------------|`,
          instructions: [
            'Mantenha o punho solto como se estivesse sacudindo água das pontas dos dedos.',
            'Acentue com firmeza o tempo 2 e o tempo 4.'
          ],
          biomechanicTips: [
            'O movimento deve vir do antebraço e punho, nunca de um ombro tenso.'
          ],
          validationCriteria: 'Execução de 8 compassos sem perder o pêndulo a 75 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Groove Acústico',
          description: 'A levada de "Stand by Me", canções de Bob Dylan e do pop folk moderno.',
          tab: `e|--3---3-3---3-3-3--|
B|--3---3-3---3-3-3--|
G|--0---0-0---0-0-0--|
D|--0---0-0---2-2-2--|
A|--2---2-2---3-3-3--|
E|--3---3-3----------|`
        },
        commonErrors: [
          { issue: 'Parar o braço no ar durante as pausas, perdendo o tempo.', solution: 'O braço sobe e desce sem parar no ar; você só escolhe em quais momentos encosta nas cordas.' }
        ],
        challenge: {
          title: 'Desafio 100 BPM com Swing',
          description: 'Aumente o metrônomo para 95 BPM e execute a batida sem perder o balanço dos tempos 2 e 4.',
          instruction: 'Grave e avalie se o som está orgânico ou mecânico.'
        },
        masteryCriteria: {
          learning: 'Compreende a mecânica do pêndulo.',
          consolidating: 'Executa a batida universal a 75 BPM com acentos.',
          mastered: 'Adapta a levada espontaneamente para qualquer andamento musical.'
        },
        speedGoals: { startingBpm: 65, intermediateBpm: 80, targetBpm: 100 },
        reviewNotes: 'O pêndulo constante é o segredo dos violonistas de ritmo perfeito.'
      },
      {
        id: 'violao-lesson-44',
        level: 2,
        moduleTitle: 'Módulo 8 • Mão Direita & Fingerstyle',
        moduleNumber: 8,
        lessonNumber: 44,
        title: 'Dedilhados Básicos: P-I-M-A, P-I-M-A-M-I e Compasso Ternário 3/4 e 6/8',
        subtitle: 'A independência dos 4 dedos da mão direita',
        objective: 'Dominar os padrões arquetípicos de dedilhado clássico e acústico (P-I-M-A, P-I-M-A-M-I e valsa/balada em 3/4 e 6/8), garantindo clareza e controle dinâmico.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 10 e Aula 43.'],
        parts: [
          {
            id: 'vl44-p1',
            title: '1. A Atribuição dos Dedos às Cordas',
            contentMarkdown: `### A Regra de Ouro do Dedilhado
* **P (Polegar):** Toca os bordões (cordas 6, 5 e 4) com movimento para baixo.
* **I (Indicador):** Toca exclusivamente a **3ª corda (Sol)** com puxada para cima.
* **M (Médio):** Toca exclusivamente a **2ª corda (Si)** com puxada para cima.
* **A (Anelar):** Toca exclusivamente a **1ª corda (Mi)** com puxada para cima.
Ao fixar essa atribuição espacial, sua mão direita nunca mais precisa olhar para as cordas!`
          },
          {
            id: 'vl44-p2',
            title: '2. Padrões Essenciais',
            contentMarkdown: `* **P - I - M - A (Ascendente):** Do grave para o agudo.
* **P - A - M - I (Descendente):** Do agudo para o grave.
* **P - I - M - A - M - I (Ondulatório / 6 tempos):** O clássico dedilhado de balada em 6/8.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 44 — O Dedilhado Ondulatório P-I-M-A-M-I em 6/8',
          subtitle: 'A balada fluida em Dó Maior e Lá Menor',
          targetBpm: 70,
          targetRepetitions: 5,
          timeSignature: { beats: 6, noteValue: 8 },
          pickingPattern: 'P - I - M - A - M - I estrito',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 0 },
            { stringNumber: 2, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 1 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 0 }
          ],
          tablatureText: `Dedos:   P   I   M   A   M   I      P   I   M   A   M   I
         [C]                        [Am]
e|-------------0----------------|-------------0----------------|
B|---------1-------1------------|---------1-------1------------|
G|-----0---------------0--------|-----2---------------2--------|
D|------------------------------|------------------------------|
A|---3-----------------------3--|---0-----------------------0--|
E|------------------------------|------------------------------|
Cont.: 1   2   3   4   5   6      1   2   3   4   5   6`,
          instructions: [
            'Articule cada dedo da junta intermediária, puxando a corda suavemente em direção à palma da mão.',
            'O polegar deve permanecer à frente dos dedos para não colidir com o indicador.'
          ],
          biomechanicTips: [
            'Mantenha a mão em arco relaxado sem apoiar o punho no tampo do violão.'
          ],
          validationCriteria: 'Sons de igual volume e duração sem oscilação métrica a 70 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Romantismo e o Folk',
          description: 'A fórmula de "Hallelujah" de Leonard Cohen e "House of the Rising Sun".',
          tab: `e|-------0---------0---|
B|-----1---1-----1---1-|
G|---0-------0-2-------|
D|---------------------|
A|-3---------0---------|
E|---------------------|`
        },
        commonErrors: [
          { issue: 'Tocar a corda 1 com o dedo médio em vez do anelar.', solution: 'Respeite a regra estrita: corda 1 pertence SEMPRE ao anelar (A).' }
        ],
        challenge: {
          title: 'Desafio Valsa em 3/4',
          description: 'Toque um baixo no tempo 1 (P) e puxe os dedos I-M-A simultaneamente nos tempos 2 e 3 (P - [IMA] - [IMA]).',
          instruction: 'Execute o compasso de valsa vienense em C e G.'
        },
        masteryCriteria: {
          learning: 'Atribui P-I-M-A às cordas corretas.',
          consolidating: 'Toca P-I-M-A-M-I com fluidez e tempo estável.',
          mastered: 'Dedilhas canções inteiras sem olhar para a mão direita.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 80, targetBpm: 100 },
        reviewNotes: 'O dedilhado bem treinado confere lirismo de orquestra ao violão acústico.'
      },
      {
        id: 'violao-lesson-45',
        level: 3,
        moduleTitle: 'Módulo 8 • Mão Direita & Fingerstyle',
        moduleNumber: 8,
        lessonNumber: 45,
        title: 'Baixo Alternado Independente com o Polegar (Travis Picking)',
        subtitle: 'O polegar funciona como um metrônomo enquanto os dedos tecem melodias',
        objective: 'Desenvolver a independência neurológica total do polegar da mão direita, alternando baixos entre duas cordas graves em semínimas estritas enquanto indicador e médio tocam em síncope.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 44.'],
        parts: [
          {
            id: 'vl45-p1',
            title: '1. O Que É o Travis Picking?',
            contentMarkdown: `### A Técnica que Imita Dois Violões
Criada pelo lendário Merle Travis e imortalizada por Chet Atkins e Tommy Emmanuel:
* O polegar alternado (alternating bass) toca continuamente entre dois baixos (ex: corda 5 e corda 4 no acorde C, ou corda 6 e corda 4 no acorde G).
* Ele toca exatamente nos tempos 1, 2, 3, 4 (como o bumbo de uma bateria).
* Enquanto isso, os dedos indicador e médio tocam as cordas agudas nos contratempos (&).
* Parece que dois músicos estão tocando juntos: um contrabaixista e um violonista solo!`
          },
          {
            id: 'vl45-p2',
            title: '2. A Fase 1: Isolando o Polegar',
            contentMarkdown: `Antes de tentar tocar tudo junto, treine APENAS o polegar:
* No acorde C: Polegar na corda 5 (tempo 1), corda 4 (tempo 2), corda 5 (tempo 3), corda 4 (tempo 4).
* Faça isso até que o polegar funcione no piloto automático sem você precisar pensar nele.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 45 — O Travis Picking Básico em Dó Maior',
          subtitle: 'A síncope entre polegar alternado e indicador/médio',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'P (baixo 1) -> M (agudo) -> P (baixo 2) -> I (médio)',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 2, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 1 },
            { stringNumber: 4, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 0 }
          ],
          tablatureText: `Dedos:   P       M       P       I       P       M       P       I
Cont.:   1       &       2       &       3       &       4       &
e|---------------------------------------------------------------|
B|---------------1-------------------------------1---------------|
G|-------------------------------0-------------------------------0|
D|-------2---------------2---------------2---------------2-------|
A|---3-------------------------------3---------------------------|
E|---------------------------------------------------------------|
    (Polegar alterna entre corda 5 e 4 em semínimas estritas)`,
          instructions: [
            'Treine bem lento. Note que o polegar toca sozinho no tempo 1, o dedo M responde no contratempo.',
            'Não acelere até que o polegar esteja completamente independente.'
          ],
          biomechanicTips: [
            'Deixe a mão relaxada perto da boca do violão; apoie suavemente o antebraço na borda superior.'
          ],
          validationCriteria: 'Execução de 4 compassos sem hesitação do polegar a 60 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Country, Folk e Acústico Clássico',
          description: 'A técnica fundamental de "Dust in the Wind" (Kansas) e "Landslide" (Fleetwood Mac).',
          tab: `e|-------------------|
B|-------1-------1---|
G|-----0-------0-----|
D|---2-------2-------|
A|-3-------3---------|
E|-------------------|`
        },
        commonErrors: [
          { issue: 'O polegar parar ou atrasar quando o dedo médio toca.', solution: 'Pratique a separação mental: o polegar é um músico independente e os dedos são outro.' }
        ],
        challenge: {
          title: 'Desafio Travis no Acorde Sol',
          description: 'Aplique o mesmo padrão no acorde G, alternando o polegar entre a corda 6 e a corda 4.',
          instruction: 'Execute por 1 minuto sem errar a alternância.'
        },
        masteryCriteria: {
          learning: 'Compreende o baixo alternado.',
          consolidating: 'Toca o Travis picking em C a 60 BPM com estabilidade.',
          mastered: 'Aplica Travis picking em progressões completas de acordes.'
        },
        speedGoals: { startingBpm: 55, intermediateBpm: 75, targetBpm: 95 },
        reviewNotes: 'O Travis picking é uma das técnicas mais prazerosas e impressionantes do violão.'
      },
      {
        id: 'violao-lesson-46',
        level: 3,
        moduleTitle: 'Módulo 8 • Mão Direita & Fingerstyle',
        moduleNumber: 8,
        lessonNumber: 46,
        title: 'Percussão no Violão: Palm Slap, Thumb Slap e Batidas no Tampo',
        subtitle: 'Transformando a madeira do violão em um kit completo de bateria',
        objective: 'Aprender as técnicas percussivas acústicas fundamentais: o Thumb Slap (estalo do polegar nas cordas graves) e o Palm Slap / batida no corpo, integrando ritmo percussivo ao dedilhado.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 43 e 44.'],
        parts: [
          {
            id: 'vl46-p1',
            title: '1. O Thumb Slap (A Caixa no Violão)',
            contentMarkdown: `### O Golpe Seco na 6ª Corda
O Thumb Slap é o estalo percussivo mais famoso do fingerstyle contemporâneo:
* A lateral carnuda/óssea do polegar direito é arremessada contra as cordas graves (especialmente a 6ª e a 5ª cordas) contra os trastes de metal.
* Isso gera um som seco e metálico ("TAC!"), exatamente no tempo 2 e 4, simulando a caixa da bateria.
* O segredo: o polegar bate e relaxa imediatamente, preparando-se para a próxima nota.`
          },
          {
            id: 'vl46-p2',
            title: '2. A Percussão no Tampo Harmônico (O Bumbo)',
            contentMarkdown: `Com a base carnuda da palma da mão direita (o "tênar"), você pode golpear suavemente a parte superior do tampo de madeira acima da boca. O resultado é um grave profundo e ressonante ("TUM!"), exatamente como um bumbo acústico.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 46 — O Groove Percussivo "Dedilhado + Slap"',
          subtitle: 'Dedilhado no tempo 1, Slap percussivo no tempo 2',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Tempo 1: P+IMA (acorde) | Tempo 2: SLAP (estalo) | Tempo 3: Dedilhado | Tempo 4: SLAP',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `Tempo:    1       &       2       &       3       &       4       &
Ação:     [Acorde]        [SLAP!]         [Dedos]         [SLAP!]
e|--------0---------------x---------------0---------------x-------|
B|--------1---------------x---------------1---------------x-------|
G|--------0---------------x---------------0---------------x-------|
D|--------2---------------x---------------2---------------x-------|
A|--------3---------------x---------------3---------------x-------|
E|------------------------x-------------------------------x-------|`,
          instructions: [
            'No tempo 2 e 4, execute o estalo seco (slap) com o polegar contra a escala.',
            'O som deve ser percussivo, limpo e rítmico, sem machucar a mão.'
          ],
          biomechanicTips: [
            'Use o peso natural da gravidade no punho; não precisa bater com força excessiva.'
          ],
          validationCriteria: 'Estalo percussivo nítido nos tempos 2 e 4 a 60 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Fingerstyle Moderno',
          description: 'A técnica de Michael Hedges, Andy McKee, Sungha Jung e Ed Sheeran.',
          tab: `e|--0---x---0---x---|
B|--1---x---1---x---|
G|--0---x---0---x---|
D|--2---x---2---x---|
A|--3---x---3---x---|
E|------x-------x---|`
        },
        commonErrors: [
          { issue: 'Bater com tanta força a ponto de desafinar as cordas ou doer a mão.', solution: 'O estalo vem da velocidade do contato contra o traste, não da força bruta.' }
        ],
        challenge: {
          title: 'Desafio Ed Sheeran',
          description: 'Toque uma progressão de 4 acordes usando a batida percussiva slap nos tempos 2 e 4.',
          instruction: 'Mantenha o groove dançante por 8 compassos contínuos.'
        },
        masteryCriteria: {
          learning: 'Executa o thumb slap mecânico.',
          consolidating: 'Integra slap e dedilhado em tempo firme.',
          mastered: 'Aplica elementos percussivos com musicalidade e bom gosto.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'A percussão transforma o violão em uma seção rítmica completa.'
      },
      {
        id: 'violao-lesson-47',
        level: 3,
        moduleTitle: 'Módulo 8 • Mão Direita & Fingerstyle',
        moduleNumber: 8,
        lessonNumber: 47,
        title: 'Levada de Bossa Nova e Samba no Violão: Toques Simultâneos e Síncopes',
        subtitle: 'A batida revolucionária de João Gilberto que mudou a história da música mundial',
        objective: 'Dominar a levada sincopada de bossa nova e samba no violão, executando o baixo fixo no tempo e as puxadas sincopadas dos dedos I-M-A no contratempo.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 20 e Aula 32.'],
        parts: [
          {
            id: 'vl47-p1',
            title: '1. A Revolução do Violão de João Gilberto',
            contentMarkdown: `### O Tamborim na Mão Direita
Em 1958, João Gilberto sintetizou a escola de samba inteira no violão acústico:
* O **Polegar** faz o papel do **Surdo de marcação**: toca os baixos com pulsação regular nos tempos 1 e 2.
* Os **Dedos I - M - A** puxam as cordas simultaneamente fazendo o papel do **Tamborim**: síncopes refinadas, antecipações e silêncios que criam o balanço único da Bossa Nova.
* Nenhuma palheta é usada: o toque da carne dos dedos na corda de nylon confere a maciez clássica.`
          },
          {
            id: 'vl47-p2',
            title: '2. A Célula Rítmica Básica de 2 Compassos',
            contentMarkdown: `A levada completa se estende por 2 compassos de 2/4:
* Compasso 1: Tum - Tchá - [vácuo] - Tchá
* Compasso 2: [vácuo] - Tchá - Tum - Tchá
Essa alternância cria a sensação perpétua de balanço ondulante.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'C6/9',
            namePt: 'Dó com Sexta e Nona (Acorde Bossa)',
            formula: '1 - 3 - 6 - 9',
            notes: ['C', 'E', 'A', 'D'],
            notesPt: ['Dó', 'Mi', 'Lá', 'Ré'],
            frets: [-1, 3, 2, 2, 3, -1],
            fingers: [0, 2, 1, 1, 3, 0],
            avoidStrings: [6, 1],
            tips: 'O acorde mais nobre da bossa nova. O dedo 1 faz mini-pestana nas cordas 4 e 3.',
            category: 'Bossa'
          }
        ],
        practicalExercise: {
          title: 'Exercício 47 — A Levada Canônica de Bossa Nova',
          subtitle: 'Dominando o balanço sincopado em C6/9 e Dm7',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 2, noteValue: 4 },
          pickingPattern: 'Polegar no baixo, dedos I-M-A pinçando as cordas 4, 3 e 2 juntas',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `Compasso 1:             Compasso 2:
  1   &   2   &           1   &   2   &
  P   IMA     IMA             IMA P   IMA
e|-----------------------|-----------------------|
B|----3-------3----------|----3-------3----------|
G|----2-------2----------|----2-------2----------|
D|----2-------2----------|----2-------2----------|
A|--3--------------------|----------3------------|
E|-----------------------|-----------------------|
    [C6/9]                  [C6/9]`,
          instructions: [
            'Puxe os dedos I, M e A com exata simultaneidade, soando como um único acorde compacto.',
            'O polegar deve soar aveludado e acolhedor, sem agressividade.'
          ],
          biomechanicTips: [
            'Mantenha a mão direita próxima da escala para obter um timbre doce e quente.'
          ],
          validationCriteria: 'Execução do ciclo de 2 compassos com balanço fluido a 65 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Repertório de Tom Jobim e Vinicius',
          description: 'A levada de "Garota de Ipanema", "Corcovado", "Chega de Saudade" e "Desafinado".',
          tab: `e|-------------------|
B|----3---3---3---3--|
G|----2---2---2---2--|
D|----2---2---2---2--|
A|--3-----------3----|
E|-------------------|`
        },
        commonErrors: [
          { issue: 'Tocar as cordas agudas descompassadas (dedos não puxam exatamente juntos).', solution: 'Treine a pinçada em bloco no ar até que as 3 cordas soem como um único som percussivo.' }
        ],
        challenge: {
          title: 'Desafio Bossa em 2 Acordes',
          description: 'Alterne 2 compassos de C6/9 e 2 compassos de Dm9 mantendo a levada ininterrupta.',
          instruction: 'Toque por 2 minutos seguidos sem quebrar o balanço do tamborim.'
        },
        masteryCriteria: {
          learning: 'Compreende a síncope da bossa nova.',
          consolidating: 'Executa os dois compassos da levada com afinação suave.',
          mastered: 'Toca o repertório clássico de bossa nova com autenticidade estilística.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'A bossa nova é o maior cartão de visitas do violão brasileiro no cenário internacional.'
      },
      {
        id: 'violao-lesson-48',
        level: 4,
        moduleTitle: 'Módulo 8 • Mão Direita & Fingerstyle',
        moduleNumber: 8,
        lessonNumber: 48,
        title: 'Fingerstyle Contemporâneo: Integrando Baixo, Harmonia e Melodia',
        subtitle: 'A síntese instrumental: como solar, acompanhar e manter o ritmo ao mesmo tempo',
        objective: 'Integrar as 3 camadas musicais em uma única execução instrumental no violão solo: o contrabaixo no polegar, os acordes de sustentação nas vozes médias e a melodia cantada nas cordas agudas.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 44, 45 e 47.'],
        parts: [
          {
            id: 'vl48-p1',
            title: '1. As Três Camadas do Violão Solo',
            contentMarkdown: `### Como Pensar Como um Maestro
No fingerstyle instrumental, o violonista executa simultaneamente:
1. **Camada 1 (Baixo / Polegar):** Mantém a sustentação harmônica e o pulso rítmico nos bordões.
2. **Camada 2 (Recheio Harmônico / Dedos I e M):** Preenche as notas médias do acorde criando ambiência.
3. **Camada 3 (Melodia Cantabile / Dedo A):** Conduz a canção na 1ª ou 2ª corda com dinâmica destacada (toque apoiado ou volume superior).`
          },
          {
            id: 'vl48-p2',
            title: '2. O Destaque da Voz Superior',
            contentMarkdown: `O erro mais comum é tocar todas as notas com a mesma intensidade. A melodia (normalmente a nota mais aguda tocada pelo anelar) deve soar **20% mais forte** que o baixo e o acompanhamento, para que o ouvinte reconheça a canção com nitidez cristalina.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 48 — O Estudo Polifônico em Três Camadas',
          subtitle: 'Melodia expressiva sobre baixo e harmonia em Dó Maior',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar no baixo, indicador na harmonia, anelar na melodia',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 3 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 0 }
          ],
          tablatureText: `Melodia: (G)-------------(F)-------------(E)-------------(D)-----
e|-------3-----------------1-----------------0-------------------|
B|-------1-------1---------1-------1---------1-------1---3---1---|
G|-------0---0-------------2---2-------------0---0-------0-------|
D|-------------------3-------------------2---------------0-------|
A|---3-----------------------------------------------------------|
E|-------------------------------------------------------3-------|
Baixo:   [C]                 [F]                 [C/E]           [G]`,
          instructions: [
            'Destaque com clareza as notas agudas da melodia na 1ª corda: Sol -> Fá -> Mi -> Ré.',
            'O baixo e o meio devem soar suaves como um leito harmônico sobre o qual a melodia flutua.'
          ],
          biomechanicTips: [
            'Dobre bem a falange do dedo anelar para dar peso e corpo à nota melódica.'
          ],
          validationCriteria: 'Diferenciação dinâmica evidente entre melodia e acompanhamento a 60 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Violão Solo de Concerto',
          description: 'A técnica de arranjadores lendários como Baden Powell, Dilermando Reis e Chet Atkins.',
          tab: `e|--3---1---0-------|
B|--1---1---1---3---|
G|--0---2---0---0---|
D|------3---2---0---|
A|--3---------------|
E|--------------3---|`
        },
        commonErrors: [
          { issue: 'Tocar a melodia fraca e o baixo muito estridente.', solution: 'Inverta a intenção: toque o polegar macio e use mais peso de toque no anelar.' }
        ],
        challenge: {
          title: 'Desafio Melodia Cantada',
          description: 'Cante a melodia da 1ª corda enquanto toca o estudo no violão.',
          instruction: 'Isso desenvolve a consciência auditiva polifônica.'
        },
        masteryCriteria: {
          learning: 'Identifica as 3 camadas musicais.',
          consolidating: 'Toca o estudo com melodia destacada em tempo constante.',
          mastered: 'Cria arranjos fingerstyle próprios de canções que admira.'
        },
        speedGoals: { startingBpm: 55, intermediateBpm: 70, targetBpm: 85 },
        reviewNotes: 'Você dominou a arte máxima da mão direita: transformar o violão em uma orquestra polifônica completa.'
      }
    ]
  },

  // =======================================================================
  // MÓDULO 9 — TÉCNICAS EXPRESSIVAS DA MÃO ESQUERDA NO VIOLÃO (Aulas 49 a 54)
  // =======================================================================
  {
    id: 'violao-mod-9',
    moduleNumber: 9,
    title: 'Técnicas Expressivas da Mão Esquerda no Violão',
    subtitle: 'Da pestana indolor aos harmônicos cristalinos: articulação, ergonomia e lirismo',
    badge: 'Módulo 9 • Articulação & Expressão',
    description: 'Elimine definitivamente as dores e ruídos na mão esquerda. Domine o princípio biomecânico da pestana sem força, ligaduras em acordes abertos (hammer-on e pull-off), slides, bends em nylon e aço, vibrato acústico e a magia física dos harmônicos.',
    lessons: [
      {
        id: 'violao-lesson-49',
        level: 2,
        moduleTitle: 'Módulo 9 • Mão Esquerda & Expressão',
        moduleNumber: 9,
        lessonNumber: 49,
        title: 'Pestana Perfeita: Ergonomia, Alavanca e Som Limpo Sem Fadiga',
        subtitle: 'Como o peso do braço substitui a força bruta do polegar',
        objective: 'Dominar a técnica ergonômica da pestana no violão físico, compreendendo o uso da alavanca de braço e ombro para eliminar a fadiga e a dor muscular.',
        estimatedMinutes: 25,
        prerequisites: ['Postura correta da mão esquerda.'],
        parts: [
          {
            id: 'vl49-p1',
            title: '1. O Mito da Força do Polegar',
            contentMarkdown: `### Por Que a Mão Dói ao Fazer Pestana?
Quase todo iniciante tenta fazer pestana apertando o polegar contra a parte de trás do braço como uma "torquês" ou "alicate":
* Isso gera tensão extrema no músculo adutor do polegar e causa fadiga em menos de 1 minuto.
* **A Solução Biomecânica Profissional:** O polegar serve apenas como apoio passivo!
* A força que pressiona a pestana vem do **peso morto do braço esquerdo** puxando suavemente o braço do violão para trás contra o peito, usando a alavanca natural do cotovelo e ombro.`
          },
          {
            id: 'vl49-p2',
            title: '2. A Posição Correta do Dedo Indicador',
            contentMarkdown: `* **Use a lateral óssea:** Nunca use a parte carnuda e mole da frente do dedo 1; gire o dedo ligeiramente de lado (cerca de 15 a 20 graus). A lateral do dedo é muito mais rígida e reta.
* **Cole o dedo no traste:** O indicador deve ficar colado no filete de metal, nunca no meio da casa.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'F',
            namePt: 'Fá Maior com Pestana Ergonômica',
            formula: '1 - 5 - 1 - 3 - 5 - 1',
            notes: ['F', 'C', 'F', 'A', 'C', 'F'],
            notesPt: ['Fá', 'Dó', 'Fá', 'Lá', 'Dó', 'Fá'],
            frets: [1, 3, 3, 2, 1, 1],
            fingers: [1, 3, 4, 2, 1, 1],
            tips: 'Gire o indicador de leve na lateral óssea e use o peso do cotovelo.',
            category: 'Pestana'
          }
        ],
        practicalExercise: {
          title: 'Exercício 49 — A Pestana Sem Polegar (Teste de Alavanca)',
          subtitle: 'Comprovando que você não precisa apertar o polegar',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Arpejo lento de todas as 6 cordas da casa 5',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 }
          ],
          tablatureText: `e|--5-------------------|
B|--5-------------------|
G|--5-------------------|
D|--5-------------------|
A|--5-------------------|
E|--5-------------------|
    (Pestana pura na casa 5 com o polegar TOTALMENTE solto)`,
          instructions: [
            'Coloque a pestana na casa 5.',
            'Tire o polegar de trás do braço! Deixe-o flutuando no ar.',
            'Puxe suavemente o violão em direção ao seu peito usando o peso do cotovelo esquerdo.',
            'Toque as 6 cordas: todas devem soar límpidas sem o polegar encostar na madeira!'
          ],
          biomechanicTips: [
            'Esse teste comprova fisicamente que a força vem do corpo, não dos dedos.'
          ],
          validationCriteria: 'Todas as 6 cordas soando limpas sem apoio do polegar.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Fá Maior Sem Esforço',
          description: 'A passagem de C para F executada com relaxamento e sem tensão na mão.',
          tab: `e|----0-------1---|
B|----1-------1---|
G|----0-------2---|
D|----2-------3---|
A|--3---------3---|
E|----------1-----|`
        },
        commonErrors: [
          { issue: 'Deixar o dedo indicador dobrado ou mole sobre as cordas centrais.', solution: 'Mantenha o indicador reto e utilize a lateral mais firme do osso.' }
        ],
        challenge: {
          title: 'Desafio 10 Fás Seguidos',
          description: 'Monte e desmonte o acorde de Fá 10 vezes consecutivas, tocando cada corda para checar a clareza.',
          instruction: 'Monitore para garantir que o polegar nunca aperte com força.'
        },
        masteryCriteria: {
          learning: 'Aplica a alavanca de cotovelo.',
          consolidating: 'Toca pestanas na casa 1, 3 e 5 sem fadiga.',
          mastered: 'Toca músicas cheias de pestanas por 10 minutos sem nenhuma dor muscular.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'A pestana dominada com ergonomia liberta o instrumentista para sempre.'
      },
      {
        id: 'violao-lesson-50',
        level: 2,
        moduleTitle: 'Módulo 9 • Mão Esquerda & Expressão',
        moduleNumber: 9,
        lessonNumber: 50,
        title: 'Hammer-on e Pull-off Aplicados a Acordes Abertos (Embellishments)',
        subtitle: 'Colorindo a harmonia com ornamentações melódicas instantâneas',
        objective: 'Dominar as ligaduras ascendentes (hammer-on) e descendentes (pull-off) executadas diretamente sobre acordes abertos tradicionais (C, Am, D, Em, G).',
        estimatedMinutes: 25,
        prerequisites: ['Aula 49.'],
        parts: [
          {
            id: 'vl50-p1',
            title: '1. O Que São Embellishments?',
            contentMarkdown: `### O Toque que Faz o Acorde Respirar
Em vez de bater o acorde como um bloco estático, você pode martelar (hammer-on) ou puxar (pull-off) notas individuais enquanto a mão direita continua o ritmo:
* **No acorde C:** Hammer-on na corda 4 (dedo 2 martela da casa 0 para a casa 2).
* **No acorde Am:** Hammer-on na corda 4 (dedo 2) ou corda 2 (dedo 1).
* **No acorde D:** Hammer-on na 1ª corda (dedo 2 da casa 0 para a casa 2).
Isso dá o lendário sabor acústico de violão folk, gospel e MPB.`
          },
          {
            id: 'vl50-p2',
            title: '2. A Mecânica da Ligadura no Violão Acústico',
            contentMarkdown: `* **Hammer-on:** O dedo deve martelar com a ponta como um pequeno martelo de piano, rápido e firme.
* **Pull-off:** O dedo não apenas se levanta: ele "belisca" a corda de leve para baixo antes de soltar, mantendo a vibração sonora viva.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 50 — O Ciclo de Embellishments C e Am',
          subtitle: 'Martelando a 4ª corda com precisão melódica',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar no baixo, batida com dedos e ligadura na 4ª corda',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 2 }
          ],
          tablatureText: `e|----0-------0-------0-------0---|
B|----1-------1-------1-------1---|
G|----0-------0-------2-------2---|
D|--0h2-------2-----0h2-------2---|
A|--3-------3-------0-------0-----|
E|--------------------------------|
    [C com hammer]  [Am com hammer]`,
          instructions: [
            'Toque o baixo C e, imediatamente ao bater nas cordas médias, martele o dedo 2 na casa 2 da corda 4.',
            'O som da nota ligada deve soar forte e definido como se tivesse sido tocado pela mão direita.'
          ],
          biomechanicTips: [
            'Mantenha a base da mão esquerda estável para apoiar a força do martelo.'
          ],
          validationCriteria: 'Som do hammer-on com volume idêntico às notas palhetadas.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Estilo James Taylor e Simon & Garfunkel',
          description: 'A técnica acústica mais adorada de todos os tempos.',
          tab: `e|----0-------2p0-----|
B|----1---------3-----|
G|----0---0-----2-----|
D|--0h2-------0-------|
A|--3-----------------|
E|--------------------|`
        },
        commonErrors: [
          { issue: 'Martelar com a parte mole do dedo, gerando som abafado.', solution: 'Acerte a corda rigorosamente com a ponta dura do osso do dedo 2.' }
        ],
        challenge: {
          title: 'Desafio Pull-off em Ré',
          description: 'Toque o acorde D e execute um pull-off na 1ª corda (da casa 2 para a corda solta) e retorne com hammer-on.',
          instruction: 'Execute o ornamento no tempo 3 de cada compasso.'
        },
        masteryCriteria: {
          learning: 'Executa hammer-on limpo.',
          consolidating: 'Aplica ligaduras em C e Am no ritmo correto.',
          mastered: 'Ornamente acordes espontaneamente em qualquer música.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 80, targetBpm: 100 },
        reviewNotes: 'As ligaduras dão vida e respiração orgânica aos acordes do violão.'
      },
      {
        id: 'violao-lesson-51',
        level: 3,
        moduleTitle: 'Módulo 9 • Mão Esquerda & Expressão',
        moduleNumber: 9,
        lessonNumber: 51,
        title: 'Slides e Conexões Horizontais Entre Posições',
        subtitle: 'A elegância dos glissandos acústicos pelo braço',
        objective: 'Dominar o slide (arraste) ascendente e descendente no violão acústico, utilizando dedos guias para conectar regiões distantes da escala com sustentação e sem ruídos de traste.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 50.'],
        parts: [
          {
            id: 'vl51-p1',
            title: '1. O Que É o Slide Acústico?',
            contentMarkdown: `### O Movimento Sem Tirar a Pressão
No slide (representado na tablatura por / ou \\):
* Você palheta a nota inicial e, mantendo a pressão constante da ponta do dedo sobre a escala, desliza para a casa de destino.
* A segunda nota soa sem que a mão direita precise tocar novamente!
* É o recurso mais eficaz para criar transições vocais e cinematográficas no violão.`
          },
          {
            id: 'vl51-p2',
            title: '2. O Dedo Guia',
            contentMarkdown: `Ao trocar de acorde ou posição, escolha um **dedo guia** que desliza suavemente sobre a corda sem perder o contato. Isso estabiliza a mão e garante que você nunca erre a casa de chegada.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 51 — Conexão Melódica com Slide nas Cordas 3 e 2',
          subtitle: 'Deslizando da casa 2 para a casa 4 e de 5 para 7',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Palhetada na primeira nota e sustentação no slide',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 4 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 },
            { stringNumber: 2, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'down', fret: 7 }
          ],
          tablatureText: `e|----------------------------------|
B|-------------5/7------------------|
G|---2/4-----------------4\\2--------|
D|----------------------------------|
A|----------------------------------|
E|----------------------------------|`,
          instructions: [
            'Mantenha a pressão da ponta do dedo constante durante todo o percurso.',
            'Pare exatamente atrás do traste da casa de destino para garantir afinação precisa.'
          ],
          biomechanicTips: [
            'O movimento deve vir do antebraço inteiro, não de uma flexão isolada do dedo.'
          ],
          validationCriteria: 'A nota final deve soar com sustain nítido após o slide.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Fraseado Vocal e Soul',
          description: 'A imitação da voz humana e do slide guitar em baladas e blues acústico.',
          tab: `e|-----------------------|
B|---8/10---8---7\\5------|
G|---7/9----7---7\\5---5--|
D|-----------------------|
A|-----------------------|
E|-----------------------|`
        },
        commonErrors: [
          { issue: 'Aliviar a pressão no meio do caminho, fazendo a nota morrer antes de chegar.', solution: 'Mantenha a pressão 100% ativa até o dedo alcançar a casa de chegada.' }
        ],
        challenge: {
          title: 'Desafio Slide de Sextas',
          description: 'Toque intervalos de sexta nas cordas 3 e 1 e deslize-os duas casas para frente mantendo as duas notas soando juntas.',
          instruction: 'Execute o slide duplo mantendo os dois dedos sincronizados.'
        },
        masteryCriteria: {
          learning: 'Compreende a mecânica do slide.',
          consolidating: 'Executa slides de 2 e 3 casas com sustain claro.',
          mastered: 'Conecta posições distantes da escala com slides vocais expressivos.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'O slide adiciona continuidade linear e calor emocional a qualquer solo acústico.'
      },
      {
        id: 'violao-lesson-52',
        level: 3,
        moduleTitle: 'Módulo 9 • Mão Esquerda & Expressão',
        moduleNumber: 9,
        lessonNumber: 52,
        title: 'Bends no Violão: Mecânica e Técnicas para Cordas de Nylon e Aço',
        subtitle: 'A física da tensão e a adaptação correta para o violão acústico',
        objective: 'Compreender a diferença na execução de bends entre violão com cordas de aço e cordas de nylon, dominando bends de meio-tom e micro-bends expressivos de blues.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 51.'],
        parts: [
          {
            id: 'vl52-p1',
            title: '1. A Diferença Crucial: Nylon vs. Aço',
            contentMarkdown: `### A Física da Corda
* **No Violão de Aço:** A corda é mais fina e tem alta tensão. Um bend de 1 tom inteiro (2 casas) é possível nas cordas 1, 2 e 3 (G sem revestimento).
* **No Violão de Nylon:** A corda é elástica e tem baixa tensão. Tentar dar um bend de 1 tom exige empurrar a corda quase até sair da escala!
* **A Regra de Ouro do Nylon:** No violão clássico/nylon, usamos preferencialmente **bends de meio-tom** ou **micro-bends de blues/choro** (1/4 de tom), que conferem aquele choro característico sem desafinar o instrumento.`
          },
          {
            id: 'vl52-p2',
            title: '2. A Força dos Três Dedos Unidos',
            contentMarkdown: `Nunca dê um bend usando apenas um dedo isolado!
* Use os dedos 1 e 2 imediatamente atrás do dedo 3 como suporte físico.
* A força vem do **giro do punho** (como girar a chave em uma fechadura), nunca da força dos dedos isolados.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 52 — O Bend de Meio-Tom com Retorno Controlado',
          subtitle: 'Afinando o bend na corda 2 casa 7',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Palhetada firme e empurrada controlada para cima',
          notesSequence: [
            { stringNumber: 2, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'down', fret: 7 },
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 8 }
          ],
          tablatureText: `e|----------------------------------|
B|---7b8---r7-------5---------------|
G|----------------------------------|
D|----------------------------------|
A|----------------------------------|
E|----------------------------------|
    (Bend de 1/2 tom de F# para G e retorno)`,
          instructions: [
            'Toque a casa 8 antes de começar para memorizar a altura da nota Sol no ouvido.',
            'Em seguida, empurre a casa 7 com os dedos 1, 2 e 3 até alcançar exatamente o som da casa 8.',
            'Desça a corda suavemente sem barulho de trastes.'
          ],
          biomechanicTips: [
            'Gire o antebraço e punho juntos para gerar a alavanca de elevação da corda.'
          ],
          validationCriteria: 'Afinação exata do bend comparada com a nota de referência.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Blues e o Choro Brasileiro',
          description: 'A assinatura expressiva que dá alma ao violão solo em temas de blues e chorinho.',
          tab: `e|-------------------|
B|---7b8r7---5-------|
G|---------------5---|
D|-------------------|
A|-------------------|
E|-------------------|`
        },
        commonErrors: [
          { issue: 'Tentar empurrar a corda com a força dos nós dos dedos em vez do giro do punho.', solution: 'Trave os dedos firmemente e gire a alavanca do punho.' }
        ],
        challenge: {
          title: 'Desafio Teste Cego de Afinação',
          description: 'Grave seu bend de meio-tom e confira no afinador cromático do aplicativo se a frequência atingiu a nota alvo com precisão.',
          instruction: 'Ajuste a força até cravar a afinação verde.'
        },
        masteryCriteria: {
          learning: 'Compreende a alavanca de punho.',
          consolidating: 'Executa bends de meio-tom afinados.',
          mastered: 'Aplica bends e releases expressivos com entonação perfeita.'
        },
        speedGoals: { startingBpm: 55, intermediateBpm: 70, targetBpm: 85 },
        reviewNotes: 'O bend controlado adiciona a inflexão da voz humana ao violão acústico.'
      },
      {
        id: 'violao-lesson-53',
        level: 3,
        moduleTitle: 'Módulo 9 • Mão Esquerda & Expressão',
        moduleNumber: 9,
        lessonNumber: 53,
        title: 'Vibrato Acústico: Vibrato Longitudinal (Clássico) vs Transversal',
        subtitle: 'A respiração e o sustain das notas longas',
        objective: 'Dominar os dois tipos fundamentais de vibrato no violão acústico: o vibrato longitudinal (paralelo à corda, clássico) e o vibrato transversal (perpendicular à corda, moderno).',
        estimatedMinutes: 25,
        prerequisites: ['Aula 52.'],
        parts: [
          {
            id: 'vl53-p1',
            title: '1. O Vibrato Longitudinal (Violão Clássico)',
            contentMarkdown: `### O Movimento ao Longo da Corda
No violão clássico com cordas de nylon, o vibrato é feito movendo o dedo e o antebraço **para frente e para trás na direção do comprimento da corda** (longitudinal):
* A ponta do dedo permanece fixa no mesmo ponto da madeira, mas a carne do dedo rola suavemente em direção ao traste e volta.
* Isso varia a tensão e o micro-comprimento da corda, gerando uma oscilação doce e nobre, exatamente como no violoncelo e violino.`
          },
          {
            id: 'vl53-p2',
            title: '2. O Vibrato Transversal (Blues / Aço)',
            contentMarkdown: `No violão de cordas de aço e na guitarra elétrica, o vibrato é feito balançando a corda **para cima e para baixo** (transversalmente). Esse vibrato é mais amplo, enérgico e bluesy.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 53 — Dominando o Vibrato Longitudinal em Mi (Corda 2 Casa 5)',
          subtitle: 'A oscilação refinada do antebraço clássico',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Toque apoiado com o polegar ou anelar, deixando a nota vibrar',
          notesSequence: [
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 }
          ],
          tablatureText: `e|----------------------------------|
B|---5~~~~~~~~~~~~~~~~~~~~~~~~~~~~--|
G|----------------------------------|
D|----------------------------------|
A|----------------------------------|
E|----------------------------------|
    (Nota sustentada com vibrato uniforme por 4 tempos)`,
          instructions: [
            'Pressione a nota com o dedo 2 ou 3 bem perpendicular à escala.',
            'Inicie o movimento oscilatório regular com o antebraço: frente - trás - frente - trás.',
            'Ouça a nota ganhar calor, sustain e vida própria.'
          ],
          biomechanicTips: [
            'O polegar atrás do braço deve estar frouxo ou ligeiramente descolado para permitir o balanço do antebraço.'
          ],
          validationCriteria: 'Oscilação rítmica estável e prolongada sem interrupção do som.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Clássico Espanhol e a MPB Lírica',
          description: 'A técnica de Andrés Segóvia, Baden Powell e dos grandes concertistas mundiais.',
          tab: `e|---7~~~~~~~~---5~~~~~~~~---|
B|---------------------------|
G|---------------------------|
D|---------------------------|
A|---------------------------|
E|---------------------------|`
        },
        commonErrors: [
          { issue: 'Vibrar com pressa e ansiedade (vibrato "nervoso").', solution: 'O vibrato deve ser lento, largo e seguro, transmitindo paz e maturidade musical.' }
        ],
        challenge: {
          title: 'Desafio Sustentação de 8 Segundos',
          description: 'Toque uma única nota e mantenha o vibrato ativo com clareza durante 8 segundos completos.',
          instruction: 'Observe como o vibrato correto prolonga a ressonância da madeira.'
        },
        masteryCriteria: {
          learning: 'Diferencia vibrato clássico de transversal.',
          consolidating: 'Executa vibrato longitudinal estável por 4 tempos.',
          mastered: 'Aplica vibrato com intensidade graduada (começa reto e floresce no final da nota).'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'O vibrato é a impressão digital sonora do violonista.'
      },
      {
        id: 'violao-lesson-54',
        level: 3,
        moduleTitle: 'Módulo 9 • Mão Esquerda & Expressão',
        moduleNumber: 9,
        lessonNumber: 54,
        title: 'Harmônicos Naturais e Artificiais no Violão',
        subtitle: 'A física dos nós acústicos e o som celestial de sinos',
        objective: 'Compreender a física dos harmônicos no violão acústico, dominando os harmônicos naturais nas casas 12, 7 e 5 e a técnica de harmônicos artificiais (octave harmonics) com a mão direita.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 53.'],
        parts: [
          {
            id: 'vl54-p1',
            title: '1. A Física dos Harmônicos Naturais',
            contentMarkdown: `### Os Pontos Nodais da Corda
Ao tocar uma corda solta, ela vibra em várias frações simultâneas:
* **Casa 12 (Metade da corda):** Gera o primeiro harmônico (a oitava justa).
* **Casa 7 (Um terço da corda):** Gera o segundo harmônico (oitava + quinta justa).
* **Casa 5 (Um quarto da corda):** Gera o terceiro harmônico (duas oitavas acima).
**A Técnica:** Encoste a polpa do dedo da mão esquerda EXATAMENTE em cima do filete metálico do traste (sem pressionar a corda contra a madeira!) e retire o dedo imediatamente após a mão direita tocar.`
          },
          {
            id: 'vl54-p2',
            title: '2. Harmônicos Artificiais com a Mão Direita',
            contentMarkdown: `Se você pressionar qualquer nota na mão esquerda (ex: casa 2), pode gerar um harmônico artificial tocando 12 casas à frente (casa 14):
* O **Indicador direito** toca levemente o nó 12 casas à frente.
* O **Polegar direito** ou **anelar** puxa a corda.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 54 — A Cascata de Harmônicos Naturais na Casa 12 e 7',
          subtitle: 'O som cristalino de sinos no violão acústico',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Toque firme perto do cavalete com o polegar da mão direita',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 12 },
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 12 },
            { stringNumber: 2, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 12 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 12 }
          ],
          tablatureText: `e|-------<12>-------<7>-------|
B|-------<12>-------<7>-------|
G|-------<12>-------<7>-------|
D|-------<12>-------<7>-------|
A|-------<12>-------<7>-------|
E|---<12>-------<7>-----------|
     (Harmônicos soando como carrilhão)`,
          instructions: [
            'Encoste o dedo suavemente sobre o ferrinho da casa 12 sem apertar.',
            'Toque a corda com a mão direita e levante o dedo da mão esquerda no mesmo milissegundo.',
            'O som deve soar como um sino cristalino com sustain longo.'
          ],
          biomechanicTips: [
            'Toque as cordas com a mão direita mais próxima do cavalete (ponte) para excitar mais frequências harmônicas.'
          ],
          validationCriteria: 'Harmônicos soando puros e brilhantes em todas as 6 cordas.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: Finais Mágicos de Canções',
          description: 'O final arquetípico de canções clássicas e peças instrumentais contemporâneas.',
          tab: `e|---<12>---|
B|---<12>---|
G|---<12>---|
D|----------|
A|----------|
E|---<12>---|`
        },
        commonErrors: [
          { issue: 'Pressionar a corda até encostar na madeira.', solution: 'Apenas encoste uma pluma sobre a corda diretamente acima do metal do traste.' }
        ],
        challenge: {
          title: 'Desafio Harmônico Artificial',
          description: 'Pressione o acorde de Em aberto e execute harmônicos artificiais tocando na casa 12 das cordas soltas e na casa 14 das cordas presas.',
          instruction: 'Execute o arpejo completo.'
        },
        masteryCriteria: {
          learning: 'Executa harmônicos na casa 12 e 7.',
          consolidating: 'Toca a cascata de harmônicos com clareza cristalina.',
          mastered: 'Aplica harmônicos artificiais em arranjos próprios com facilidade.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Os harmônicos são o toque de magia que fascina qualquer ouvinte.'
      }
    ]
  },

  // =======================================================================
  // MÓDULO 10 — MUSICALIDADE, REPERTÓRIO, ARRANJO E VIOLÃO SOLO (Aulas 55 a 60)
  // =======================================================================
  {
    id: 'violao-mod-10',
    moduleNumber: 10,
    title: 'Musicalidade, Repertório, Arranjo e Violão Solo',
    subtitle: 'A síntese da formação: autonomia musical, arranjo em Chord Melody e a masterclass final',
    badge: 'Módulo 10 • Maestria & Autonomia',
    description: 'Chegue ao ápice do Domínio Total do Violão. Aprenda a dosar dinâmica orquestral, descubra como tirar qualquer canção de ouvido analisando baixos e tonalidades, crie seus próprios arranjos de Chord Melody e conclua sua formação com a Masterclass da síntese.',
    lessons: [
      {
        id: 'violao-lesson-55',
        level: 3,
        moduleTitle: 'Módulo 10 • Maestria & Violão Solo',
        moduleNumber: 10,
        lessonNumber: 55,
        title: 'O Papel do Violão no Acompanhamento: Como Tocar em Banda vs Voz e Violão',
        subtitle: 'A inteligência de arranjo: saber quando preencher e quando economizar',
        objective: 'Compreender a diferença acústica e harmônica fundamental entre o formato Voz e Violão (onde o instrumento é uma orquestra completa) e o formato em Banda (onde o violão deve enxugar baixos e focar no ritmo médio).',
        estimatedMinutes: 25,
        prerequisites: ['Módulos 1 a 9 dominados.'],
        parts: [
          {
            id: 'vl55-p1',
            title: '1. O Violão no Formato "Voz e Violão"',
            contentMarkdown: `### O Instrumento É a Orquestra Inteira
Quando você toca sozinho acompanhando uma voz:
* Você é o contrabaixo (bordões graves no polegar).
* Você é a harmonia (acordes médios).
* Você é a bateria (levadas percussivas, acentos e síncopes).
* Aqui você DEVE usar acordes abertos, notas graves cheias, ressonância e condução melódica de vozes.`
          },
          {
            id: 'vl55-p2',
            title: '2. O Violão no Meio de uma Banda',
            contentMarkdown: `Quando há contrabaixo, teclado e bateria tocando junto:
* **NUNCA compita com o contrabaixo:** evite tocar a 6ª e a 5ª cordas com peso; deixe os graves para o baixista.
* **Toque nas cordas agudas:** use acordes de 3 ou 4 cordas (tríades e tétrades nas cordas 4, 3, 2 e 1).
* **Foque no ritmo:** seu papel principal vira o de um chocalho ou violão percussivo que adiciona brilho acústico à mixagem.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 55 — O Mesmo Tom em Dois Formatos: Solo vs Banda',
          subtitle: 'Tocando C - G - Am - F para voz e violão e depois para banda',
          targetBpm: 75,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Parte A: Baixos cheios e dedilhado | Parte B: Tríades agudas e batida limpa',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 }
          ],
          tablatureText: `Parte A (Voz e Violão - Baixos Cheios):
e|--0-----3-----0-----1---|
B|--1-----0-----1-----1---|
G|--0-----0-----2-----2---|
D|--2-----0-----2-----3---|
A|--3-----2-----0---------|
E|--------3-----------1---|

Parte B (Em Banda - Tríades Agudas Sem Baixo):
e|--8-----7-----5-----5---|
B|--8-----8-----5-----6---|
G|--9-----7-----5-----5---|
D|------------------------|
A|------------------------|
E|------------------------|`,
          instructions: [
            'Compare a amplitude sonora da Parte A com a clareza e corte da Parte B.',
            'Em uma banda com contrabaixo, a Parte B soa 10 vezes mais profissional e limpa.'
          ],
          biomechanicTips: [
            'Adapte o ataque da mão direita: macio para voz e violão, seco e preciso para banda.'
          ],
          validationCriteria: 'Execução das duas abordagens com total consciência tímbrica.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Músico de Gravação em Estúdio',
          description: 'A inteligência que os grandes produtores musicais buscam em um violonista profissional.',
          tab: `e|--8---7---5---5---|
B|--8---8---5---6---|
G|--9---7---5---5---|
D|------------------|
A|------------------|
E|------------------|`
        },
        commonErrors: [
          { issue: 'Tocar baixos pesados em cima da linha do contrabaixista.', solution: 'Economize nos bordões; deixe o espaço acústico para o baixo brilhar.' }
        ],
        challenge: {
          title: 'Desafio Tríades de Banda',
          description: 'Toque a progressão G - D - Em - C usando exclusivamente as três cordas agudas (1, 2 e 3).',
          instruction: 'Execute com batida funk ou pop leve.'
        },
        masteryCriteria: {
          learning: 'Compreende os papéis em banda e solo.',
          consolidating: 'Alterna entre acordes cheios e tríades agudas sem hesitar.',
          mastered: 'Adapta o acompanhamento instantaneamente a qualquer formação instrumental.'
        },
        speedGoals: { startingBpm: 65, intermediateBpm: 80, targetBpm: 95 },
        reviewNotes: 'Tocar menos e no registro certo é a maior prova de maturidade musical.'
      },
      {
        id: 'violao-lesson-56',
        level: 3,
        moduleTitle: 'Módulo 10 • Maestria & Violão Solo',
        moduleNumber: 10,
        lessonNumber: 56,
        title: 'Dinâmica e Expressão: Do Pianíssimo ao Fortíssimo, Crescendo e Decrescendo',
        subtitle: 'Como contar uma história emocional através do volume e da intensidade do toque',
        objective: 'Dominar o controle da dinâmica acústica no violão (pianíssimo pp, piano p, mezzoforte mf, forte f, fortíssimo ff), aplicando crescendo e decrescendo para criar narrativas dramáticas.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 55.'],
        parts: [
          {
            id: 'vl56-p1',
            title: '1. O Que É Dinâmica Musical?',
            contentMarkdown: `### A Música Não É Uma Linha Reta
O violão tocado sempre no mesmo volume soa robótico e cansa o ouvinte em poucos minutos:
* **Pianíssimo (pp):** Sussurro íntimo. Toque com a carícia da pele perto da escala.
* **Piano (p):** Suave, calmo, reflexivo.
* **Mezzoforte (mf):** Volume médio conversacional natural.
* **Forte (f):** Assertivo, luminoso, vibrante.
* **Fortíssimo (ff):** Ataque poderoso com peso e energia total perto do cavalete.`
          },
          {
            id: 'vl56-p2',
            title: '2. Timbre: Sul Tasto vs. Sul Ponticello',
            contentMarkdown: `* **Sul Tasto (Perto da Escala):** Som aveludado, doce, redondo, com poucos agudos. Ideal para estrofes intimistas.
* **Sul Ponticello (Perto da Ponte):** Som metálico, brilhante, cortante e incisivo. Ideal para refrões épicos.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 56 — O Grande Crescendo de 4 Compassos',
          subtitle: 'Do pianíssimo sussurrado ao fortíssimo explosivo',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado P-I-M-A aumentando a pressão a cada tempo',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `Compasso 1 (pp):        Compasso 2 (p):         Compasso 3 (mf):        Compasso 4 (ff):
e|------0-------0---|------0-------0---|------0-------0---|------0-------0---|
B|----1---1---1---1-|----1---1---1---1-|----1---1---1---1-|----1---1---1---1-|
G|--2-------2-------|--2-------2-------|--2-------2-------|--2-------2-------|
D|------------------|------------------|------------------|------------------|
A|--0---------------|--0---------------|--0---------------|--0---------------|
E|------------------|------------------|------------------|------------------|
  (Sussurro suave)     (Suave)             (Médio)             (Poderoso)`,
          instructions: [
            'No Compasso 1, toque tão suavemente que mal possa ser ouvido.',
            'Aumente o peso gradualmente a cada compasso até explodir no Compasso 4 com vigor total.',
            'Em seguida, faça o caminho inverso (Decrescendo).'
          ],
          biomechanicTips: [
            'Aumente o volume aumentando a amplitude do puxão dos dedos, sem tensionar o ombro.'
          ],
          validationCriteria: 'Progressão de volume perfeitamente gradual sem saltos bruscos.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Arco Emocional da Canção',
          description: 'A técnica que faz a plateia prender a respiração na estrofe e vibrar no refrão.',
          tab: `e|----0-------0---|
B|----1-------1---|
G|----2-------2---|
D|----2-------2---|
A|--0-------0-----|
E|----------------|`
        },
        commonErrors: [
          { issue: 'Acelerar o andamento quando o volume aumenta.', solution: 'O volume sobe, mas o metrônomo continua RIGOROSAMENTE constante a 60 BPM.' }
        ],
        challenge: {
          title: 'Desafio Contraste Extremo',
          description: 'Toque um compasso em ff seguido imediatamente de um compasso em pp.',
          instruction: 'Controle a mão para não perder o ritmo no contraste súbito.'
        },
        masteryCriteria: {
          learning: 'Distingue os níveis de dinâmica.',
          consolidating: 'Executa o crescendo gradual a tempo com metrônomo.',
          mastered: 'Aplica dinâmicas espontaneamente criando interpretações emotivas.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'A dinâmica é a diferença entre um violonista mecânico e um verdadeiro artista.'
      },
      {
        id: 'violao-lesson-57',
        level: 3,
        moduleTitle: 'Módulo 10 • Maestria & Violão Solo',
        moduleNumber: 10,
        lessonNumber: 57,
        title: 'Como Tirar Músicas de Ouvido: Identificando o Baixo e a Tonalidade',
        subtitle: 'O método científico para decodificar qualquer canção sem consultar cifras',
        objective: 'Aprender o processo investigativo de 3 etapas para tirar músicas de ouvido: 1) Isolar a linha de baixo; 2) Determinar o centro tonal (Tônica); 3) Mapear os graus do campo harmônico correspondente.',
        estimatedMinutes: 25,
        prerequisites: ['Módulo 6 dominado.'],
        parts: [
          {
            id: 'vl57-p1',
            title: '1. O Método em Três Passos',
            contentMarkdown: `### Como Ouvir o Que Ninguém Ouve
Tentar adivinhar acordes aleatoriamente gera frustração. Siga o método científico:
1. **Passo 1 — Siga o Baixo:** Em 90% das músicas populares, a nota mais grave que soa no tempo 1 do compasso é a **fundamental** do acorde. Encontre essa nota nas cordas 6 e 5 do seu violão!
2. **Passo 2 — Descubra a Tonalidade:** Qual nota transmite sensação absoluta de repouso ("fim da música")? Essa é a Tônica (Grau I).
3. **Passo 3 — Consulte o Campo Harmônico:** Se a música está em Sol Maior, você já sabe que 95% dos acordes serão G, Am, Bm, C, D ou Em. Basta testar essas 6 opções!`
          },
          {
            id: 'vl57-p2',
            title: '2. Identificando Maior vs. Menor no Ouvido',
            contentMarkdown: `Ao encontrar o baixo (ex: nota Ré):
* Toque a terça maior (F#): soou brilhante e combinou? O acorde é **D**!
* Toque a terça menor (F): soou melancólico e combinou? O acorde é **Dm**!`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 57 — O Laboratório de Investigação de Baixos',
          subtitle: 'Decodificando a progressão misteriosa através do polegar',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Toque apenas a nota grave com o polegar para mapear o esqueleto',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `Passo 1: Encontrar os baixos nas cordas graves:
e|----------------------------------|
B|----------------------------------|
G|----------------------------------|
D|----------0-----------------------|
A|--------------------------3-------|
E|--3---------------0---------------|
    (Sol)   (Ré)    (Mi)    (Dó)

Passo 2: Construir os acordes da tonalidade de Sol:
    G       D       Em      C
    I       V       vi      IV`,
          instructions: [
            'Toque apenas as notas simples do baixo.',
            'Em seguida, monte os acordes completos correspondentes e ouça a mágica acontecer.'
          ],
          biomechanicTips: [
            'Use fones de ouvido para ouvir o registro grave das gravações com clareza.'
          ],
          validationCriteria: 'Identificação correta dos 4 acordes da sequência.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: Autonomia Total',
          description: 'A liberdade de escutar uma música inédita no rádio e tocá-la no violão em menos de 2 minutos.',
          tab: `e|--3---2---0---0---|
B|--0---3---0---1---|
G|--0---2---0---0---|
D|--0---0---2---2---|
A|--2-------2---3---|
E|--3-------0-------|`
        },
        commonErrors: [
          { issue: 'Tentar adivinhar o acorde ouvindo as notas agudas da voz.', solution: 'Ignore a melodia no início; o baixo é a âncora da harmonia.' }
        ],
        challenge: {
          title: 'Desafio Rádio ao Vivo',
          description: 'Coloque uma música aleatória no celular, ache o baixo do primeiro compasso e identifique a tonalidade.',
          instruction: 'Anote os graus I, IV e V da música.'
        },
        masteryCriteria: {
          learning: 'Compreende os 3 passos para tirar de ouvido.',
          consolidating: 'Identifica o baixo e a tonalidade de músicas simples.',
          mastered: 'Tira canções populares completas de ouvido com agilidade.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Tirar de ouvido é a habilidade suprema que transforma o aluno em músico independente.'
      },
      {
        id: 'violao-lesson-58',
        level: 4,
        moduleTitle: 'Módulo 10 • Maestria & Violão Solo',
        moduleNumber: 10,
        lessonNumber: 58,
        title: 'Como Criar Seus Próprios Arranjos: Chord Melody para Iniciantes',
        subtitle: 'A arte suprema de tocar a melodia como a nota mais aguda do acorde',
        objective: 'Aprender os princípios de arranjo em Chord Melody (Harmonia Melódica): posicionar a nota da melodia na ponta mais aguda (cordas 1 ou 2) e construir o acorde de sustentação abaixo dela usando o CAGED.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 38, 48 e 57.'],
        parts: [
          {
            id: 'vl58-p1',
            title: '1. O Que É Chord Melody?',
            contentMarkdown: `### A Melodia na Crista da Onda Harmônica
Chord Melody é a técnica de violão solo onde cada nota importante da melodia é harmonizada simultaneamente por um acorde:
* **Regra de Ouro 1:** A melodia principal DEVE ser a nota mais aguda soando na mão (na corda 1 ou 2).
* **Regra de Ouro 2:** O baixo fundamental do acorde DEVE soar na nota mais grave (cordas 6, 5 ou 4).
* **Regra de Ouro 3:** As notas intermediárias do acorde preenchem o recheio harmônico.
Você toca violão solo como se fosse um pianista com as duas mãos integradas!`
          },
          {
            id: 'vl58-p2',
            title: '2. Como Encontrar o Acorde Certo para a Nota da Melodia',
            contentMarkdown: `Se a harmonia da música pede um acorde de **C** e a melodia canta a nota **Sol**:
* Onde tem Sol na 1ª corda? Casa 3!
* Qual formato CAGED de C tem Sol na 1ª corda casa 3? O formato aberto de C: basta colocar o dedo 4 na casa 3 da 1ª corda (Cadd9 / C com Sol agudo)!`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'C (Melodia Sol)',
            namePt: 'Dó Maior com Melodia Sol na Ponta',
            formula: '1 - 3 - 5 - 1 - 5',
            notes: ['C', 'E', 'G', 'C', 'G'],
            notesPt: ['Dó', 'Mi', 'Sol', 'Dó', 'Sol'],
            frets: [-1, 3, 2, 0, 1, 3],
            fingers: [0, 3, 2, 0, 1, 4],
            tips: 'Dedo 4 na casa 3 da 1ª corda cantando a melodia.',
            category: 'ChordMelody'
          }
        ],
        practicalExercise: {
          title: 'Exercício 58 — O Mini-Arranjo de Chord Melody "Ode à Alegria"',
          subtitle: 'Harmonizando a famosa melodia de Beethoven no violão solo',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Toque em bloco simultâneo com polegar e 3 dedos',
          notesSequence: [
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 1, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 1 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 }
          ],
          tablatureText: `Melodia: (E)---(E)---(F)---(G)---|---(G)---(F)---(E)---(D)---|
e|-------0-----0-----1-----3-----|---3-----1-----0-----------|
B|-------1-----1-----1-----0-----|---0-----1-----1-----3-----|
G|-------0-----0-----2-----0-----|---0-----2-----0-----0-----|
D|-------2-----2-----3-----0-----|---0-----3-----2-----0-----|
A|-------3-----3-----------------|---------------3-----2-----|
E|-------------------------3-----|---3-----------------3-----|
Harmonia: [C]         [F]   [G]      [G]   [F]   [C]   [G]`,
          instructions: [
            'Toque todas as notas de cada coluna juntas com puxada simultânea.',
            'Certifique-se de que a nota mais aguda (a melodia) sobressai com volume cantado.',
            'Ouça a beleza monumental do violão solo soando completo e autosuficiente.'
          ],
          biomechanicTips: [
            'Mantenha os dedos da mão esquerda firmes como pilares para não abafar cordas vizinhas.'
          ],
          validationCriteria: 'Execução do trecho polifônico com melodia cristalina a 60 BPM.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Violão Instrumental Brasileiro e Jazz',
          description: 'A linguagem refinada de Paulinho Nogueira, Toquinho, Yamandu Costa e Joe Pass.',
          tab: `e|--0---0---1---3---|
B|--1---1---1---0---|
G|--0---0---2---0---|
D|--2---2---3---0---|
A|--3---3-----------|
E|--------------3---|`
        },
        commonErrors: [
          { issue: 'Tocar o baixo mais forte que a nota melódica da ponta.', solution: 'Dê intenção e peso ao dedo que toca a 1ª corda; o baixo deve ser apenas o suporte.' }
        ],
        challenge: {
          title: 'Desafio Harmonizar Parabéns a Você',
          description: 'Encontre a melodia de "Parabéns a Você" nas cordas agudas e monte os acordes correspondentes debaixo dela.',
          instruction: 'Crie seu primeiro arranjo solo original.'
        },
        masteryCriteria: {
          learning: 'Compreende a arquitetura do Chord Melody.',
          consolidating: 'Toca o arranjo de Beethoven com melodia destacada.',
          mastered: 'Harmoniza melodias conhecidas em violão solo com autonomia.'
        },
        speedGoals: { startingBpm: 55, intermediateBpm: 70, targetBpm: 85 },
        reviewNotes: 'O Chord Melody é a coroação artística definitiva do violonista.'
      },
      {
        id: 'violao-lesson-59',
        level: 4,
        moduleTitle: 'Módulo 10 • Maestria & Violão Solo',
        moduleNumber: 10,
        lessonNumber: 59,
        title: 'Improvisação no Violão: Conectando Escalas aos Acordes da Harmonia',
        subtitle: 'Como solar mirando as notas certas na hora certa',
        objective: 'Aprender os princípios de improvisação melódica no violão acústico: mirar nas notas alvo (terça e fundamental do acorde de destino) em vez de correr escalas aleatórias.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 41, 42 e 58.'],
        parts: [
          {
            id: 'vl59-p1',
            title: '1. O Segredo dos Grandes Solistas: As Target Notes',
            contentMarkdown: `### Não Toque Escalas; Toque a Harmonia
A diferença entre um solo amador e um solo maduro:
* O amador corre a pentatônica para cima e para baixo esperando que tudo soe bem por sorte.
* O mestre **mira na terça do acorde que acabou de entrar**!
* Exemplo: quando a harmonia muda para o acorde de **C**, termine sua frase na nota **E** (sua terça maior).
* Quando a harmonia muda para **G**, termine sua frase na nota **B** (sua terça maior).
O solo parece que "canta" a harmonia com perfeição matemática e poética.`
          },
          {
            id: 'vl59-p2',
            title: '2. Respiração e Fraseado Musical',
            contentMarkdown: `Um bom solo é como um discurso falado: ele tem frases curtas, pausas para respirar, perguntas e respostas. Deixe pausas de 1 ou 2 tempos entre suas frases melódicas.`
          }
        ],
        chordDiagrams: [],
        practicalExercise: {
          title: 'Exercício 59 — Improvisando Mirando as Terças de C e G',
          subtitle: 'Aterrissando nas notas alvo com precisão',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Fraseado melódico expressivo com dinâmicas',
          notesSequence: [
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 2, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `Sobre o Acorde C (Alvo: Terça E):
e|-------0--3--0----------------|
B|---1------------1---[0h1]-----|
G|------------------------------|
D|------------------------------|
A|------------------------------|
E|------------------------------|

Sobre o Acorde G (Alvo: Terça B):
e|------------------------------|
B|-------0--3--0----------------|
G|---0------------0---[4/0]-----|
D|------------------------------|
A|------------------------------|
E|------------------------------|`,
          instructions: [
            'Repare como a nota Mi no acorde C soa como repouso límpido.',
            'Repare como a nota Si no acorde G soa com brilho e resolução imediata.'
          ],
          biomechanicTips: [
            'Articule com a ponta dos dedos e aplique um leve vibrato na nota final de repouso.'
          ],
          validationCriteria: 'Conexão exata das target notes com a mudança dos acordes.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Violão Melódico',
          description: 'A abordagem lírica de mestres como Baden Powell, Rafael Rabello e George Benson.',
          tab: `e|----0---3---0---|
B|--1-------1-----|
G|----------------|
D|----------------|
A|----------------|
E|----------------|`
        },
        commonErrors: [
          { issue: 'Tocar notas sem parar sem dar tempo para o ouvinte processar.', solution: 'Faça silêncios conscientes: o silêncio é metade da beleza de um solo.' }
        ],
        challenge: {
          title: 'Desafio Solo de 3 Notas',
          description: 'Crie um improviso emocionante de 8 compassos usando apenas 3 notas diferentes.',
          instruction: 'Foque todo o poder na rítmica, na dinâmica e no vibrato.'
        },
        masteryCriteria: {
          learning: 'Compreende target notes.',
          consolidating: 'Atinge as terças dos acordes no tempo 1 com naturalidade.',
          mastered: 'Improvisa frases melódicas coerentes e expressivas sobre qualquer harmonia.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 95 },
        reviewNotes: 'Improvisar é expressar sua voz interior com as ferramentas da harmonia.'
      },
      {
        id: 'violao-lesson-60',
        level: 4,
        moduleTitle: 'Módulo 10 • Maestria & Violão Solo',
        moduleNumber: 10,
        lessonNumber: 60,
        title: 'A Masterclass Final: A Síntese do Domínio Total do Violão',
        subtitle: 'A grande peça de encerramento unindo anatomia, harmonia, técnica e musicalidade',
        objective: 'Executar a peça síntese completa que integra todas as competências desenvolvidas ao longo das 60 aulas: acordes abertos, tétrades, inversões, baixos caminhantes, dedilhado P-I-M-A, percussão, ligaduras, harmônicos e Chord Melody.',
        estimatedMinutes: 30,
        prerequisites: ['Aulas 1 a 59 completadas com dedicação.'],
        parts: [
          {
            id: 'vl60-p1',
            title: '1. A Sua Jornada de 60 Aulas',
            contentMarkdown: `### Do Primeiro Traste ao Domínio Completo
Você iniciou na Aula 1 compreendendo a anatomia da madeira, os trastes, a física das cordas soltas e a afinação precisa de E2 a E4.
Ao longo de 10 módulos rigorosos:
* Dominou todos os acordes abertos, menores e com sétima.
* Desvendou os intervalos, tétrades e a formação de cifras.
* Construiu baixos invertidos (C/E, D/F#, G/B), acordes pedais e condução de vozes.
* Mapeou campos harmônicos maiores e menores em tríades e tétrades.
* Destravou o braço inteiro da casa 0 à casa 15 com o sistema CAGED.
* Conquistou independência de polegar, levadas sincopadas de Bossa Nova e fingerstyle percussivo.
* Refinou sua mão esquerda com pestanas ergonômicas indolores, ligaduras, slides, vibratos e harmônicos.
* Desenvolveu inteligência de arranjo em Chord Melody e autonomia de ouvido.`
          },
          {
            id: 'vl60-p2',
            title: '2. A Peça Síntese: "Suíte do Domínio Acústico"',
            contentMarkdown: `Uma composição original que percorre:
1. **Introdução:** Harmônicos naturais na casa 12 e arpejo lírico de Cmaj7.
2. **Tema Principal:** Chord Melody emotivo com baixo melódico descendente (C -> C/B -> Am7 -> C/G -> Fmaj7).
3. **Desenvolvimento:** Levada sincopada com síncopes de bossa e baixos caminhantes.
4. **Coda:** Cascata final de arpejo com harmônico de sino fechando a jornada.`
          }
        ],
        chordDiagrams: [
          {
            symbol: 'Cmaj9',
            namePt: 'Dó com Nona Maior (Acorde Final da Formação)',
            formula: '1 - 3 - 5 - 7 - 9',
            notes: ['C', 'E', 'G', 'B', 'D'],
            notesPt: ['Dó', 'Mi', 'Sol', 'Si', 'Ré'],
            frets: [-1, 3, 2, 4, 3, 0],
            fingers: [0, 2, 1, 4, 3, 0],
            openStrings: [1],
            avoidStrings: [6],
            tips: 'Sonoridade celestial de encerramento.',
            category: 'Masterclass'
          }
        ],
        practicalExercise: {
          title: 'Exercício 60 — A Suíte do Domínio Acústico',
          subtitle: 'A execução monumental de encerramento da formação',
          targetBpm: 65,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado polifônico, levada sincopada e harmônicos',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 12 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 2 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 }
          ],
          tablatureText: `Parte 1: O Prelúdio Celestial de Harmônicos:
e|---<12>-------0-------0-------0---|
B|---<12>-----0---0---1---1---1---1-|
G|---<12>---0-------0-------2-------|
D|--------------------------2-------|
A|----------3-------2-------0-------|
E|----------------------------------|
            Cmaj7   C/B     Am7

Parte 2: A Resolução com Chord Melody e Baixo F:
e|-------0-------3-------0-------<12>---|
B|-----1---1---0---0---3---3-----<12>---|
G|---2-------0-------4-------4---<12>---|
D|---3-------0-------0------------------|
A|-------------------3-----------3------|
E|---1-------3--------------------------|
     Fmaj7   G7      Cmaj9       C Final`,
          instructions: [
            'Execute a peça com plena presença mental, relaxamento corporal e emoção artística.',
            'Sinta o peso nobre de cada nota e a ressonância rica da madeira do violão.',
            'Ao atingir o último acorde harmônico na casa 12, deixe o som ressoar até o silêncio natural.'
          ],
          biomechanicTips: [
            'Respire profundamente antes de começar; toque como se estivesse no palco de um grande teatro.'
          ],
          validationCriteria: 'Execução completa da suíte de 60 aulas com beleza, técnica e emoção.'
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Seu Futuro como Músico Completo',
          description: 'Você não é mais um reprodutor de cifras: você é um violonista autônomo com domínio total do instrumento.',
          tab: `e|--<12>---|
B|--<12>---|
G|--<12>---|
D|---------|
A|---3-----|
E|---------|`
        },
        commonErrors: [
          { issue: 'Apressar o andamento nos trechos difíceis.', solution: 'Mantenha a nobreza e a calma; a música se revela na serenidade do toque.' }
        ],
        challenge: {
          title: 'O Recital de Formatura',
          description: 'Grave um vídeo ou áudio tocando a Suíte do Domínio Acústico completa do início ao fim.',
          instruction: 'Celebre sua conquista: você concluiu os 10 módulos e as 60 aulas do Domínio Total do Violão!'
        },
        masteryCriteria: {
          learning: 'Executa todas as partes da suíte.',
          consolidating: 'Toca a peça completa com andamento uniforme.',
          mastered: 'Apresenta a obra com virtuosismo, musicalidade refinada e alma artística.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Parabéns: você concluiu o programa mais completo, rigoroso e inspirador de violão acústico.'
      }
    ]
  }
];

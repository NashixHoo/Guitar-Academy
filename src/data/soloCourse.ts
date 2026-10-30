import { SoloLesson, SoloCourseStage, Lesson } from '../types';
import { CURRICULUM_LEVELS } from './curriculum';

// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO PROGRESSIVA EM GUITARRA SOLO (20 AULAS)
// 5 Etapas Pedagógicas estruturadas por especialistas em guitarra elétrica,
// biomecânica, teoria musical e design instrucional.
// =========================================================================

export const SOLO_COURSE_STAGES: SoloCourseStage[] = [
  // -----------------------------------------------------------------------
  // ETAPA 1 — FUNDAMENTOS TÉCNICOS (Aulas 1 a 4)
  // -----------------------------------------------------------------------
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'ETAPA 1 — FUNDAMENTOS TÉCNICOS',
    subtitle: 'Mapeamento do braço, palhetada alternada estrita, sincronização motora e ritmo com metrônomo',
    badge: 'Fundamentos',
    description: 'Construa a base mecânica indispensável para solar com autoridade. Elimine vícios de postura, domine a palhetada alternada contínua, sincronize as duas mãos no milissegundo e interiorize a subdivisão rítmica.',
    lessons: [
      {
        id: 'solo-lesson-1',
        level: 1,
        stage: 1,
        moduleTitle: 'Etapa 1 — Fundamentos Técnicos',
        lessonNumber: 1,
        title: 'Aula 1 — Conhecendo o Braço da Guitarra e Afinação Padrão',
        subtitle: 'Afinação padrão E-A-D-G-B-E, anatomia das casas, semitons e localização de notas',
        objective: 'Dominar a afinação padrão E2-A2-D3-G3-B3-E4, compreender a distância de semitom por casa no braço e localizar com rapidez as notas naturais nas seis cordas.',
        estimatedMinutes: 20,
        prerequisites: ['Postura básica de empunhadura do instrumento e palheta.'],
        parts: [
          {
            id: 'sl1-p1',
            title: '1. A Afinação Padrão e o Princípio Físico das Cordas',
            contentMarkdown: `
### A Afinação Padrão da Guitarra (Standard Tuning)

Na guitarra elétrica, a afinação padrão organiza as cordas da mais grave (6ª corda, superior) para a mais aguda (1ª corda, inferior):

\`\`\`
1ª Corda (mais fina / aguda) : E4  (~329.6 Hz) — Mi agudo
2ª Corda                    : B3  (~246.9 Hz) — Si
3ª Corda                    : G3  (~196.0 Hz) — Sol
4ª Corda                    : D3  (~146.8 Hz) — Ré
5ª Corda                    : A2  ( 110.0 Hz) — Lá
6ª Corda (mais grossa / grave): E2  ( ~82.4 Hz) — Mi grave
\`\`\`

> 🧠 **Fundamento Biomecânico:**
> A 6ª e a 1ª corda são ambas a nota **Mi (E)**, separadas por exatamente **duas oitavas** (24 semitons). Ao memorizar a 6ª corda, você automaticamente memoriza as notas correspondentes da 1ª corda!
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 0, label: '6ª: E2 (Mi)' },
                { stringIndex: 4, fret: 0, label: '5ª: A2 (Lá)' },
                { stringIndex: 3, fret: 0, label: '4ª: D3 (Ré)' },
                { stringIndex: 2, fret: 0, label: '3ª: G3 (Sol)' },
                { stringIndex: 1, fret: 0, label: '2ª: B3 (Si)' },
                { stringIndex: 0, fret: 0, label: '1ª: E4 (Mi)' },
              ]
            }
          },
          {
            id: 'sl1-p2',
            title: '2. A Geografia das Casas e Semitons',
            contentMarkdown: `
### Cada Casa é Rigorosamente 1 Semitom

Na escala temperada da guitarra ocidental:
* Avançar **1 casa** em direção ao corpo da guitarra = aumentar a altura em **1 semitom** (meio tom).
* Avançar **2 casas** = aumentar a altura em **1 tom inteiro** (2 semitons).
* O traste 12 divide a corda exatamente ao meio: na **12ª casa** de qualquer corda, você encontra a mesma nota da corda solta, porém **uma oitava acima**.

#### A Regra Natural das Notas (Onde estão os semitons naturais?):
Entre todas as notas naturais consecutivas existe a distância de **1 tom (2 casas)**, **EXCETO** entre:
* **Mi (E) e Fá (F)** → 1 semitom (1 casa de distância direta!).
* **Si (B) e Dó (C)** → 1 semitom (1 casa de distância direta!).

\`\`\`
Corda 6 (E):
Solta: E (Mi)
Casa 1: F (Fá)   ← 1 casa de E para F!
Casa 3: G (Sol)  ← 2 casas de F para G
Casa 5: A (Lá)   ← 2 casas de G para A
Casa 7: B (Si)   ← 2 casas de A para B
Casa 8: C (Dó)   ← 1 casa de B para C!
Casa 10: D (Ré)  ← 2 casas de C para D
Casa 12: E (Mi)  ← Oitava completa!
\`\`\`
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
                { stringIndex: 5, fret: 12, label: 'E (Oitava)' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 82.41, duration: 1.0 },
          { freq: 87.31, duration: 0.8 },
          { freq: 98.00, duration: 0.8 },
          { freq: 110.00, duration: 0.8 },
          { freq: 123.47, duration: 0.8 },
          { freq: 130.81, duration: 0.8 },
          { freq: 146.83, duration: 0.8 },
          { freq: 164.81, duration: 1.2 },
        ],
        practicalExercise: {
          id: 'ex-solo-1',
          title: 'Exercício de Mapeamento Linear na 6ª e 5ª Cordas',
          subtitle: 'Localização sequencial de notas naturais na guitarra física com digitação correta',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ (Palhetada para baixo consistente)',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 1 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
            { stringNumber: 6, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 7 },
            { stringNumber: 6, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 8 },
            { stringNumber: 6, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 10 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 12 },
          ],
          tablatureText: `
1ª e|---------------------------------------------------------|
2ª B|---------------------------------------------------------|
3ª G|---------------------------------------------------------|
4ª D|---------------------------------------------------------|
5ª A|---------------------------------------------------------|
6ª E|--0---1---3---5---7---8---10---12------------------------|
     E   F   G   A   B   C    D    E
Dig: -   1   3   1   3   4    1    3 (dedos da mão esquerda)
Pal: ↓   ↓   ↓   ↓   ↓   ↓    ↓    ↓ (palhetada firme)
          `,
          instructions: [
            'Apoie o polegar da mão esquerda no centro da parte traseira do braço da guitarra, sem estrangular.',
            'Pressione as cordas logo atrás do traste metálico, nunca no centro da casa nem em cima do traste.',
            'Diga o nome de cada nota em voz alta no momento exato em que a palheta toca a corda.',
            'Mantenha o metrônomo cravado em 60 BPM (1 nota por batida).'
          ],
          biomechanicTips: [
            'A ponta dos dedos deve formar um arco perpendicular em relação à escala.',
            'Relaxe o ombro e o trapézio: força excessiva trava a velocidade futura.'
          ],
          validationCriteria: 'Executar todas as 8 notas da 6ª corda sem trastejar, dizendo o nome da nota em tempo real no compasso a 60 BPM.'
        },
        speedGoals: {
          startingBpm: 50,
          intermediateBpm: 60,
          targetBpm: 75
        },
        commonErrors: [
          {
            issue: 'Tocar Mi para Fá pulando duas casas (casa 0 para casa 2).',
            solution: 'Lembre-se que entre Mi e Fá NÃO existe sustenido/bemol natural: a distância é de apenas 1 casa (casa 0 solta vai direto para a casa 1).'
          },
          {
            issue: 'Som opaco ou trastejando por pressionar longe do ferrinho do traste.',
            solution: 'Posicione a ponta do dedo a cerca de 1 a 2 milímetros do traste à direita da casa.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Baixo Fundamental do Rock',
          tab: `
6ª E|--0-0-0-0--3-3-3-3--5-5-5-5--0-0-0-0---|
Notas:  E        G        A        E
          `,
          description: 'A progressão clássica de rock E - G - A utiliza as notas naturais das casas 0, 3 e 5 da 6ª corda para conduzir o riff com autoridade.'
        },
        challenge: {
          title: 'Desafio Prático: Teste de Reflexo de Notas',
          description: 'Sem olhar para o diagrama, encontre a nota Dó (C) na 6ª corda (casa 8) e na 5ª corda (casa 3). Em seguida encontre a nota Lá (A) na 6ª corda (casa 5) e na 5ª corda (solta).',
          instruction: 'Execute o salto em menos de 2 segundos para cada nota mantendo o som limpo.'
        },
        masteryCriteria: {
          learning: 'Compreende a ordem das cordas e localiza as notas contando as casas pausadamente.',
          consolidating: 'Localiza as notas naturais da 6ª e 5ª cordas em até 3 segundos com metrônomo.',
          mastered: 'Identifica instantaneamente qualquer nota natural nas cordas 6 e 5 e executa a 60 BPM sem hesitação.'
        },
        reviewNotes: 'Na próxima aula, você aprenderá o motor mecânico primordial de qualquer solo de alto nível: a Palhetada Alternada estrita.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl1-q1',
              question: 'Qual é a nota da 6ª corda na casa 5 na afinação padrão?',
              options: ['A (Lá)', 'G (Sol)', 'B (Si)', 'C (Dó)'],
              correctIndex: 0,
              explanation: 'A 6ª corda solta é E. Casa 1: F, casa 3: G, casa 5: A (Lá).'
            },
            {
              id: 'sl1-q2',
              question: 'Qual o intervalo de semitom natural que tem apenas 1 casa de distância?',
              options: ['E para F e B para C', 'C para D e G para A', 'A para B e D para E', 'F para G e A para B'],
              correctIndex: 0,
              explanation: 'Na teoria ocidental, apenas E-F e B-C são semitons naturais puros (1 casa de distância).'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-2',
        level: 1,
        stage: 1,
        moduleTitle: 'Etapa 1 — Fundamentos Técnicos',
        lessonNumber: 2,
        title: 'Aula 2 — Palhetada Alternada (Strict Alternate Picking)',
        subtitle: 'Movimento estrito baixo-cima (Down-Up), empunhadura a 45º e economia de movimento',
        objective: 'Dominar o movimento alternado estrito para baixo (↓) e para cima (↑), garantindo consistência de dinâmica, relaxamento muscular e precisão rítmica tanto em uma corda quanto em cordas adjacentes.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 1 — Conhecendo o braço da guitarra e afinação padrão.'],
        parts: [
          {
            id: 'sl2-p1',
            title: '1. A Biomecânica da Empunhadura e o Ângulo de Ataque',
            contentMarkdown: `
### Como Segurar a Palheta de Forma Profissional

A precisão em alta velocidade nunca é fruto de força muscular, mas de **economia de movimento e geometria de ataque**.

1. **A Garra Natural:** Dobre a primeira articulação do dedo indicador da mão direita.
2. **Posição da Palheta:** Apoie a palheta na lateral da última falange do indicador.
3. **Trava do Polegar:** Coloque a polpa do polegar por cima, deixando apenas **2 a 3 milímetros** da ponta da palheta expostos.
4. **O Ângulo Mágico (45 Graus):** Nunca ataque as cordas de forma 100% paralela. Incline a palheta levemente a cerca de 30° a 45° em relação ao plano das cordas. Isso faz com que ela "deslize" pela corda em vez de engatar ou travar.

> ⚠️ **A Regra Inegociável da Palhetada Alternada:**
> Cada palhetada para baixo (**↓**) DEVE ser seguida obrigatoriamente por uma palhetada para cima (**↑**). Jamais repita duas palhetadas na mesma direção em um padrão alternado.
            `
          },
          {
            id: 'sl2-p2',
            title: '2. Movimento de Pulso vs. Antebraço',
            contentMarkdown: `
### De Onde Deve Vir o Movimento?

* ❌ **Erro Grave:** Mexer a articulação do polegar e indicador ("palhetar com os dedos"). Isso gera fadiga imediata e instabilidade.
* ❌ **Erro Grave:** Travar o pulso e mexer o braço inteiro a partir do cotovelo. Isso gera tensão nos tendões e som grosseiro.
* ✅ **Padrão Conservatório:** O movimento nasce prioritariamente da **rotação e oscilação do pulso** (como ao girar suavemente uma chave na fechadura). O antebraço fornece apenas a âncora e o posicionamento de corda.
            `
          }
        ],
        demonstrationAudioNotes: [
          { freq: 196.00, duration: 0.25 },
          { freq: 196.00, duration: 0.25 },
          { freq: 196.00, duration: 0.25 },
          { freq: 196.00, duration: 0.25 },
          { freq: 220.00, duration: 0.25 },
          { freq: 220.00, duration: 0.25 },
          { freq: 246.94, duration: 0.25 },
          { freq: 261.63, duration: 0.5 },
        ],
        practicalExercise: {
          id: 'ex-solo-2',
          title: 'Exercício de Palhetada Alternada Estrita em Duas Cordas',
          subtitle: 'Padrão em colcheias alternadas nas cordas 3 (G) e 2 (B)',
          targetBpm: 80,
          targetRepetitions: 15,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ (Estritamente alternado)',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 0 },
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 0 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 2 },
            { stringNumber: 2, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 0 },
            { stringNumber: 2, noteCipher: 'B', notePt: 'Si', pickDirection: 'up', fret: 0 },
            { stringNumber: 2, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 1 },
            { stringNumber: 2, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 1 },
          ],
          tablatureText: `
1ª e|---------------------------------------------------------|
2ª B|---------------------------------0---0---1---1---------|
3ª G|--0---0---2---2-----------------------------------------|
4ª D|---------------------------------------------------------|
5ª A|---------------------------------------------------------|
6ª E|---------------------------------------------------------|
Pal:   ↓   ↑   ↓   ↑                 ↓   ↑   ↓   ↑
Tem:   1   &   2   &                 3   &   4   &
Dig:   -   -   2   2                 -   -   1   1
          `,
          instructions: [
            'Ligue o metrônomo a 60 BPM.',
            'Toque duas notas por batida (colcheias): a batida no clique é ↓, a contrabatida no ar é ↑.',
            'Certifique-se de que o volume e o timbre da palhetada para cima (↑) sejam IDÊNTICOS aos da palhetada para baixo (↓).',
            'Ao trocar da 3ª para a 2ª corda, mantenha o padrão: se a última foi ↑, a próxima na nova corda SERÁ ↓!'
          ],
          biomechanicTips: [
            'A amplitude do movimento da palheta não deve passar de 1 centímetro da corda.',
            'Mantenha a lateral da palma da mão direita repousando levemente perto do cavalete (bridge) para abafar ruídos indesejados.'
          ],
          validationCriteria: 'Executar 16 compassos ininterruptos a 80 BPM sem falhar nenhuma inversão down/up e sem oscilar o andamento.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 80,
          targetBpm: 100
        },
        commonErrors: [
          {
            issue: 'Fazer apenas palhetadas para baixo (Downstrokes contínuos).',
            solution: 'Obrigue-se a subir a palheta tocando a corda no retorno. Palhetar só para baixo dobra o gasto de energia e cria um teto precoce de velocidade.'
          },
          {
            issue: 'A palhetada para cima sai muito mais fraca ou raspada.',
            solution: 'Incline a palheta levemente a 45°: a aresta arredondada da palheta deve guiar o movimento tanto na descida quanto na subida.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: Ostinato de Heavy Rock / Pop',
          tab: `
3ª G|--2-2-2-2-2-2-2-2-|--0-0-0-0-0-0-0-0-|
Pal:   ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑    ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑
          `,
          description: 'A base dos solos e conduções rítmicas de guitarristas como Randy Rhoads e David Gilmour baseia-se na estabilidade absoluta das semicolcheias e colcheias alternadas.'
        },
        challenge: {
          title: 'Desafio Prático: Teste de Resistência de 2 Minutos',
          description: 'Toque o exercício da aula de forma contínua durante 2 minutos a 70 BPM sem interrupções e sem sentir queimação muscular no antebraço.',
          instruction: 'Se sentir tensão acumulando no pulso, respire fundo, relaxe os dedos da mão direita e diminua a força aplicada sobre a corda.'
        },
        masteryCriteria: {
          learning: 'Compreende o ciclo down-up, mas comete inversões involuntárias ao trocar de corda.',
          consolidating: 'Executa a alternância correta entre 60 e 70 BPM com volume equilibrado.',
          mastered: 'Mantém a palhetada rigorosamente alternada a 80+ BPM com dinâmica estável e total relaxamento biomecânico.'
        },
        reviewNotes: 'Agora que a palheta se move com consistência, na Aula 3 sincronizaremos o ataque da mão direita com o pouso dos dedos da mão esquerda.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl2-q1',
              question: 'Qual é o ângulo ideal de ataque da palheta em relação à corda para reduzir atrito?',
              options: ['Aproximadamente 30° a 45°', 'Exatamente 90° (perpendicular rígido)', '0° (totalmente colada e paralela)', '180°'],
              correctIndex: 0,
              explanation: 'O ângulo de 30° a 45° permite que a palheta deslize sobre a corda sem prender nos bordos.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-3',
        level: 1,
        stage: 1,
        moduleTitle: 'Etapa 1 — Fundamentos Técnicos',
        lessonNumber: 3,
        title: 'Aula 3 — Sincronização e Independência das Mãos',
        subtitle: 'Coordenação milimétrica entre ataque e digitação, exercício cromático 1-2-3-4 e limpeza sonora',
        objective: 'Alinhar o instante do impacto da palheta com o momento exato em que o dedo da mão esquerda pressiona a casa, eliminando ruídos de cordas soltas e notas picadas.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 2 — Palhetada alternada.'],
        parts: [
          {
            id: 'sl3-p1',
            title: '1. O Problema da Não-Sincronia',
            contentMarkdown: `
### Por que os Solos Soam Sujos ou Falhados?

Em solos de guitarra, 90% dos erros técnicos de velocidade e clareza vêm de **falha de sincronia temporal**:
1. **A mão direita toca antes da esquerda:** A nota soa abafada ou trasteja porque o dedo da escala ainda não firmou a corda.
2. **A mão esquerda aperta antes da direita:** Cria-se um pequeno ruído percussivo ou martelada precoce antes do som pleno.
3. **Deslocamento prematuro:** O dedo levanta antes da palheta tocar a nota seguinte, cortando a sustentação musical.

> 🎯 **O Objetivo de Ouro da Sincronização:**
> O impacto da palheta e o contato da polpa do dedo na madeira da escala devem acontecer no **mesmo milissegundo**.
            `
          },
          {
            id: 'sl3-p2',
            title: '2. O Princípio dos 4 Dedos e Abafamento (Palm Muting Parcial)',
            contentMarkdown: `
### Numeração dos Dedos da Mão da Escala:
* **Dedo 1:** Indicador
* **Dedo 2:** Médio
* **Dedo 3:** Anelar
* **Dedo 4:** Mínimo (Mindinho)

### O Segredo da Limpeza nos Solos:
Para solar de forma limpa na guitarra com distorção ou som aberto, você deve usar a técnica de **abafamento cruzado**:
* A lateral da palma da mão direita abafa as cordas mais graves que não estão sendo tocadas.
* O dedo indicador da mão esquerda encosta levemente por baixo das cordas mais agudas para impedi-las de vibrar por simpatia acústica.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 2, fret: 5, label: 'Dedo 1' },
                { stringIndex: 2, fret: 6, label: 'Dedo 2' },
                { stringIndex: 2, fret: 7, label: 'Dedo 3' },
                { stringIndex: 2, fret: 8, label: 'Dedo 4' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 261.63, duration: 0.3 },
          { freq: 277.18, duration: 0.3 },
          { freq: 293.66, duration: 0.3 },
          { freq: 311.13, duration: 0.3 },
        ],
        practicalExercise: {
          id: 'ex-solo-3',
          title: 'Exercício de Sincronia 1-2-3-4 na 3ª Corda',
          subtitle: 'Coordenação motora pura das casas 5, 6, 7 e 8 com palhetada alternada estrita',
          targetBpm: 75,
          targetRepetitions: 12,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ (Estritamente alternado)',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'C#', notePt: 'Dó#', pickDirection: 'up', fret: 6 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 },
            { stringNumber: 3, noteCipher: 'D#', notePt: 'Ré#', pickDirection: 'up', fret: 8 },
          ],
          tablatureText: `
3ª G|--5---6---7---8---8---7---6---5---------------------------|
Pal:   ↓   ↑   ↓   ↑   ↓   ↑   ↓   ↑
Dig:   1   2   3   4   4   3   2   1
Ded:  Ind Méd Ane Mín Mín Ane Méd Ind
          `,
          instructions: [
            'Ajuste o metrônomo para 60 BPM (semínimas, 1 nota por clique).',
            'Posicione cada dedo exatamente sobre a sua respectiva casa: 1 na casa 5, 2 na casa 6, 3 na casa 7 e 4 na casa 8.',
            'Não levante os dedos anteriores excessivamente: mantenha-os a poucos milímetros das cordas.',
            'Na volta (8-7-6-5), retire cada dedo com firmeza e suavidade sem puxar a corda gerando ruído.'
          ],
          biomechanicTips: [
            'Evite o "dedo voador": se o dedo mínimo se esticar para longe toda vez que o dedo 1 toca, diminua o andamento pela metade e force o relaxamento do mindinho.',
            'O polegar permanece firme atrás da casa 6 ou 7.'
          ],
          validationCriteria: 'Tocar 8 voltas completas subindo e descendo a 70 BPM sem nenhuma nota abafada e com sincronicidade perfeita de palheta e dedo.'
        },
        speedGoals: {
          startingBpm: 55,
          intermediateBpm: 70,
          targetBpm: 85
        },
        commonErrors: [
          {
            issue: 'Levantar o dedo 1 assim que o dedo 2 é acionado.',
            solution: 'Pratique manter os dedos plantados na subida: quando o dedo 4 tocar na casa 8, os dedos 1, 2 e 3 ainda devem estar apoiados em suas casas.'
          },
          {
            issue: 'Acelerar nos dedos fortes (1 e 2) e atrasar nos fracos (3 e 4).',
            solution: 'O metrônomo é o juiz supremo: não permita que a mão direita dite o andamento antes que os dedos 3 e 4 alcancem o traste.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Lick Cromático de Passagem',
          tab: `
3ª G|--5-6-7-8--|--9------------|
Notas: C C# D D#    E (Resolução)
          `,
          description: 'Aproximações cromáticas de notas vizinhas criam tensão irresistível no jazz, fusion e rock antes de repousar na nota do acorde.'
        },
        challenge: {
          title: 'Desafio Prático: Permutação 1-3-2-4',
          description: 'Mude a ordem dos dedos nas casas 5, 6, 7 e 8: toque Dedo 1 (casa 5), Dedo 3 (casa 7), Dedo 2 (casa 6) e Dedo 4 (casa 8).',
          instruction: 'Execute o padrão a 65 BPM sem errar a sequência dos dedos.'
        },
        masteryCriteria: {
          learning: 'Os dedos ainda se afastam muito do braço e há ruídos nas trocas.',
          consolidating: 'Sincroniza bem a 60-70 BPM, mas o dedo 4 ainda hesita levemente.',
          mastered: 'Sincronismo imperceptível, economia extrema de movimento a 75+ BPM com som cristalino.'
        },
        reviewNotes: 'Com coordenação e sincronia estabelecidas, na Aula 4 vamos dominar a precisão das figuras rítmicas e acentuação de frases.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl3-q1',
              question: 'Qual é a principal causa de um solo soar "sujo" e picado?',
              options: ['A falta de sincronia milimétrica entre a palheta e a mão da escala', 'Usar uma palheta muito flexível', 'Não tocar forte o suficiente', 'Tocar com metrônomo'],
              correctIndex: 0,
              explanation: 'A falta de sincronia entre o pouso do dedo e o ataque da palheta gera ruídos, corte de sustentação e notas mortas.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-4',
        level: 1,
        stage: 1,
        moduleTitle: 'Etapa 1 — Fundamentos Técnicos',
        lessonNumber: 4,
        title: 'Aula 4 — Ritmo, Subdivisões e Precisão com Metrônomo',
        subtitle: 'Pulsação interna, semínimas, colcheias, semicolcheias, pausas e acentuação',
        objective: 'Compreender e executar com exatidão as subdivisões rítmicas fundamentais (1, 2 e 4 notas por tempo), controlando pausas e acentuações para dar vida e balanço a qualquer frase de guitarra.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 2 — Palhetada alternada', 'Aula 3 — Sincronização.'],
        parts: [
          {
            id: 'sl4-p1',
            title: '1. A Pirâmide Rítmica da Guitarra',
            contentMarkdown: `
### Por que o Ritmo é o Elemento Mais Importante de um Solo?

Uma nota errada tocada no tempo certo soa como "tensão intencional". Mas a nota mais perfeita da escala tocada fora do tempo soa amadora e desconfortável para o ouvinte.

Em um compasso 4/4 a 60 BPM:
1. **Semínima (1 nota por tempo):**
   * Contagem: **1 — 2 — 3 — 4**
   * Palhetada: ↓ ↓ ↓ ↓
2. **Colcheia (2 notas por tempo):**
   * Contagem: **1 e 2 e 3 e 4 e**
   * Palhetada: ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑
3. **Semicolcheia (4 notas por tempo):**
   * Contagem: **1 e e a, 2 e e a, 3 e e a, 4 e e a**
   * Palhetada: ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑

> ⏱️ **Dica de Ouro:**
> O metrônomo marca a pulsação básica. O seu cérebro deve antecipar o "espaço" entre os cliques, dividindo o ar com precisão matemática.
            `
          },
          {
            id: 'sl4-p2',
            title: '2. O Poder da Pausa e da Acentuação',
            contentMarkdown: `
### O Espaço é Música!

Grandes guitarristas (BB King, Eric Clapton, Stevie Ray Vaughan) não tocam notas ininterruptamente. Eles utilizam a **pausa** (silêncio) como elemento de expectativa.

#### Acentuação de Tempos:
Ao tocar 4 notas por tempo, acentuar sutilmente a **primeira nota de cada grupo** (tempo forte) ancora o ouvinte e impede que o solo pareça um exercício mecânico sem alma.
            `
          }
        ],
        demonstrationAudioNotes: [
          { freq: 220.00, duration: 0.5 },
          { freq: 220.00, duration: 0.5 },
          { freq: 220.00, duration: 0.25 },
          { freq: 220.00, duration: 0.25 },
          { freq: 220.00, duration: 0.25 },
          { freq: 220.00, duration: 0.25 },
          { freq: 220.00, duration: 1.0 },
        ],
        practicalExercise: {
          id: 'ex-solo-4',
          title: 'Exercício de Transição de Subdivisões no Tempo',
          subtitle: 'Alternância entre Semínimas, Colcheias e Semicolcheias na nota Lá (A)',
          targetBpm: 65,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Semínima: ↓ | Colcheia: ↓ ↑ | Semicolcheia: ↓ ↑ ↓ ↑',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 2 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 2 },
          ],
          tablatureText: `
3ª G|--2---2---2---2---|--2-2-2-2-2-2-2-2-|--2222-2222-2222-2222--|
Fig:   Semínimas (1x)     Colcheias (2x)     Semicolcheias (4x)
Tem:   1   2   3   4      1 & 2 & 3 & 4 &    1e&a 2e&a 3e&a 4e&a
Pal:   ↓   ↓   ↓   ↓      ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑    ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
          `,
          instructions: [
            'Configure o metrônomo para 60 BPM.',
            'Compasso 1: Toque 4 semínimas (uma palhetada para baixo em cada clique).',
            'Compasso 2: Toque 8 colcheias (duas notas por clique: ↓ no clique, ↑ no intervalo).',
            'Compasso 3: Dobre a velocidade para 16 semicolcheias (quatro notas por clique: ↓ ↑ ↓ ↑ rigoroso).',
            'Mantenha o mesmo andamento de 60 BPM durante toda a transição.'
          ],
          biomechanicTips: [
            'Ao passar para as semicolcheias, reduza pela metade o tamanho do movimento da palheta para não perder o tempo.',
            'Bata o pé no chão no tempo 1 de cada compasso para internalizar a pulsação física.'
          ],
          validationCriteria: 'Executar 4 ciclos completos de transição (Semínima → Colcheia → Semicolcheia) sem acelerar ou tropeçar no clique.'
        },
        speedGoals: {
          startingBpm: 50,
          intermediateBpm: 65,
          targetBpm: 80
        },
        commonErrors: [
          {
            issue: 'Apressar a primeira nota de semicolcheia logo após o clique.',
            solution: 'Pense nas 4 notas como sílabas perfeitamente iguais: "cho-co-la-te". O clique cai exatamente na sílaba "cho".'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Riff com Balanço Sincopado',
          tab: `
3ª G|--2---2---(pausa)--2-2---|--2-------------------|
          `,
          description: 'A inserção deliberada de uma pausa de meio tempo cria o "groove" que separa os guitarristas amadores dos profissionais de estúdio.'
        },
        challenge: {
          title: 'Desafio Prático: O Metrônomo Oculto',
          description: 'Configure o metrônomo para bater apenas nos tempos 2 e 4 (como a caixa da bateria). Toque as colcheias mantendo o tempo 1 imaginário.',
          instruction: 'Grave seu áudio e verifique se as palhetadas caem exatamente nos cliques 2 e 4.'
        },
        masteryCriteria: {
          learning: 'Consegue tocar semínimas e colcheias, mas desalinha ao entrar nas semicolcheias.',
          consolidating: 'Transiciona entre figuras rítmicas a 60 BPM com pequenas correções.',
          mastered: 'Transiciona com precisão métrica a 65+ BPM com acentuação consciente e controle rítmico total.'
        },
        reviewNotes: 'Parabéns por concluir a Etapa 1! Com os fundamentos mecânicos dominados, entraremos na Etapa 2 para aprender o mapa sonoro da Pentatônica Menor.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl4-q1',
              question: 'Quantas semicolcheias cabem em um único tempo de semínima?',
              options: ['4 notas', '2 notas', '3 notas', '8 notas'],
              correctIndex: 0,
              explanation: 'Em um compasso quaternário, 1 semínima equivale a 2 colcheias ou 4 semicolcheias.'
            }
          ]
        }
      }
    ]
  },

  // -----------------------------------------------------------------------
  // ETAPA 2 — ESCALAS E VOCABULÁRIO MUSICAL (Aulas 5 a 8)
  // -----------------------------------------------------------------------
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'ETAPA 2 — ESCALAS E VOCABULÁRIO MUSICAL',
    subtitle: 'Pentatônica menor, notas fundamentais, pergunta e resposta melódica e conexão das 5 posições',
    badge: 'Escalas & Frases',
    description: 'Transforme o braço da guitarra em um mapa de liberdade sonora. Domine a estrutura da Pentatônica Menor em Lá, compreenda o papel crucial das tônicas como notas de repouso e conecte as 5 posições pelo braço inteiro.',
    lessons: [
      {
        id: 'solo-lesson-5',
        level: 2,
        stage: 2,
        moduleTitle: 'Etapa 2 — Escalas e Vocabulário Musical',
        lessonNumber: 5,
        title: 'Aula 5 — A Pentatônica Menor: Estrutura e Posição 1',
        subtitle: 'Os 5 graus (1, ♭3, 4, 5, ♭7), digitação de Lá menor (Am) na 5ª casa e localização das tônicas',
        objective: 'Compreender a fórmula intervalar da pentatônica menor (1, ♭3, 4, 5, ♭7), memorizar a digitação clássica da Posição 1 em Lá menor e localizar suas 3 tônicas no braço.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 1 — Conhecendo o braço', 'Aula 2 — Palhetada alternada.'],
        parts: [
          {
            id: 'sl5-p1',
            title: '1. A Anatomia da Escala Pentatônica Menor',
            contentMarkdown: `
### Por que a Pentatônica é a Escala Mais Famosa da Guitarra?

A palavra **penta** significa cinco. A escala pentatônica menor é formada por **cinco notas essenciais** extraídas da escala menor natural, eliminando os semitons conflitantes (os graus 2 e ♭6). O resultado é uma escala onde **nenhuma nota soa dissonante ou desastrosa**, sendo a rainha do Blues, Rock, Pop e Metal.

#### A Fórmula Intervalar Universal:
\`\`\`
Graus:     1 (Fundamental)  —  ♭3 (Terça Menor)  —  4 (Quarta Justa)  —  5 (Quinta Justa)  —  ♭7 (Sétima Menor)
Lá menor:        A          —          C         —         D          —         E          —         G
\`\`\`

* **A (Lá):** É a **Tônica** (o centro de gravidade, repouso total).
* **C (Dó):** É a **Terça Menor** (dá o caráter melancólico, bluesy ou pesado).
* **D (Ré):** É a **Quarta Justa** (nota de movimento).
* **E (Mi):** É a **Quinta Justa** (nota de força e estabilidade harmônica).
* **G (Sol):** É a **Sétima Menor** (gera a tensão blues clássica que pede retorno ao Lá).
            `
          },
          {
            id: 'sl5-p2',
            title: '2. A Digitação da Posição 1 na Guitarra (Casa 5)',
            contentMarkdown: `
### A Famosa "Caixa 1" de Lá Menor (Am)

Na 5ª casa da guitarra, temos a primeira e mais utilizada posição da pentatônica:

\`\`\`
Corda 6 (E grave): Casas 5 e 8   → Notas: A (5) e C (8)  | Dedos: 1 e 4
Corda 5 (A):       Casas 5 e 7   → Notas: D (5) e E (7)  | Dedos: 1 e 3
Corda 4 (D):       Casas 5 e 7   → Notas: G (5) e A (7)  | Dedos: 1 e 3
Corda 3 (G):       Casas 5 e 7   → Notas: C (5) e D (7)  | Dedos: 1 e 3
Corda 2 (B):       Casas 5 e 8   → Notas: E (5) e G (8)  | Dedos: 1 e 4
Corda 1 (E aguda): Casas 5 e 8   → Notas: A (5) e C (8)  | Dedos: 1 e 4
\`\`\`

> 📍 **As 3 Tônicas de Lá (A) nesta posição:**
> 1. **6ª corda, casa 5** (Dedo 1) — Tônica grave
> 2. **4ª corda, casa 7** (Dedo 3) — Tônica média
> 3. **1ª corda, casa 5** (Dedo 1) — Tônica aguda
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 5, label: 'A (Tônica)' },
                { stringIndex: 5, fret: 8, label: 'C' },
                { stringIndex: 4, fret: 5, label: 'D' },
                { stringIndex: 4, fret: 7, label: 'E' },
                { stringIndex: 3, fret: 5, label: 'G' },
                { stringIndex: 3, fret: 7, label: 'A (Tônica)' },
                { stringIndex: 2, fret: 5, label: 'C' },
                { stringIndex: 2, fret: 7, label: 'D' },
                { stringIndex: 1, fret: 5, label: 'E' },
                { stringIndex: 1, fret: 8, label: 'G' },
                { stringIndex: 0, fret: 5, label: 'A (Tônica)' },
                { stringIndex: 0, fret: 8, label: 'C' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 110.00, duration: 0.3 },
          { freq: 130.81, duration: 0.3 },
          { freq: 146.83, duration: 0.3 },
          { freq: 164.81, duration: 0.3 },
          { freq: 196.00, duration: 0.3 },
          { freq: 220.00, duration: 0.3 },
          { freq: 261.63, duration: 0.3 },
          { freq: 293.66, duration: 0.3 },
          { freq: 329.63, duration: 0.3 },
          { freq: 392.00, duration: 0.3 },
          { freq: 440.00, duration: 0.3 },
          { freq: 523.25, duration: 0.5 },
        ],
        practicalExercise: {
          id: 'ex-solo-5',
          title: 'Exercício Ascendente e Descendente da Pentatônica 1',
          subtitle: 'Subida e descida com palhetada alternada rigorosa e tônicas destacadas',
          targetBpm: 80,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ ↓ ↑ contínuo',
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
          tablatureText: `
1ª e|---------------------------------5-8-8-5-----------------------------|
2ª B|-----------------------------5-8---------8-5-------------------------|
3ª G|-------------------------5-7-----------------7-5---------------------|
4ª D|---------------------5-7-------------------------7-5-----------------|
5ª A|-------------5-7-------------------------------------7-5-------------|
6ª E|---------5-8---------------------------------------------8-5---------|
Dig:          1 4 1 3     1 3 1 3 1 4 1 4 4 1 4 1 3 1 3 1 3 1 4 1
Pal:          ↓ ↑ ↓ ↑     ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑
          `,
          instructions: [
            'Dedo 1 é responsável exclusivo por todas as notas na casa 5.',
            'Dedo 3 é responsável pelas casas 7 nas cordas 5, 4 e 3.',
            'Dedo 4 (mindinho) é responsável pelas casas 8 nas cordas 6, 2 e 1.',
            'Toque com palhetada estritamente alternada (↓ ↑) a 60 BPM.',
            'Ao atingir a tônica aguda (1ª corda, casa 5) e a tônica média (4ª corda, casa 7), segure a nota com vibrato suave.'
          ],
          biomechanicTips: [
            'Não use o dedo 3 nas casas 8! Usar o dedo 3 onde deveria ser o mindinho deforma a mão e impede a abertura correta.'
          ],
          validationCriteria: 'Tocar a escala inteira subindo e descendo a 75 BPM de memória sem errar nenhuma digitação e sem travar nas trocas de corda.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 75,
          targetBpm: 95
        },
        commonErrors: [
          {
            issue: 'Tocar a casa 8 com o dedo 3 em vez do dedo 4.',
            solution: 'O dedo 3 tem alcance natural na casa 7. A casa 8 pertence ao dedo mínimo. Treinar o mindinho agora é indispensável para os solos rápidos.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Primeiro Lick de Rock Clássico',
          tab: `
1ª e|---------5--------|
2ª B|-------5---8p5----|
3ª G|---7b9------------|
          `,
          description: 'Este lick clássico (usado por Jimmy Page em Stairway to Heaven e Angus Young no AC/DC) baseia-se 100% no topo da Posição 1 da Pentatônica de Lá menor.'
        },
        challenge: {
          title: 'Desafio Prático: Localize as 3 Tônicas com Olhos Fechados',
          description: 'Feche os olhos e toque sem errar: 6ª corda casa 5, 4ª corda casa 7 e 1ª corda casa 5.',
          instruction: 'Memorize o relevo tátil dessas 3 posições.'
        },
        masteryCriteria: {
          learning: 'Lê o diagrama e toca as notas, mas hesita na digitação das cordas 2 e 1.',
          consolidating: 'Toca a escala completa de memória a 65-75 BPM com dedos 1, 3 e 4 corretos.',
          mastered: 'Domina a Posição 1 a 85+ BPM, com clareza cristalina e identificação imediata das 3 tônicas.'
        },
        reviewNotes: 'Agora que você conhece o mapa das notas, na Aula 6 aprenderemos a transformar essas notas em frases com significado musical real.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl5-q1',
              question: 'Quais são as notas que formam a pentatônica de Lá menor?',
              options: ['A, C, D, E, G', 'A, B, C, D, E', 'A, C#, D, E, G#', 'A, C, D, F, G'],
              correctIndex: 0,
              explanation: 'A escala pentatônica menor de Lá é formada pelos graus 1, ♭3, 4, 5 e ♭7: A, C, D, E e G.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-6',
        level: 2,
        stage: 2,
        moduleTitle: 'Etapa 2 — Escalas e Vocabulário Musical',
        lessonNumber: 6,
        title: 'Aula 6 — Criando Frases com a Pentatônica (Phrasing)',
        subtitle: 'Transformando escalas mecânicas em música: motivo, pausas, repetição e dinâmica',
        objective: 'Superar o hábito de tocar a escala como um exercício contínuo, construindo frases musicais curtas com respiração, intenção melódica e estrutura de Pergunta e Resposta.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 5 — Pentatônica Menor.'],
        parts: [
          {
            id: 'sl6-p1',
            title: '1. A Diferença Entre Escala e Frase Musical',
            contentMarkdown: `
### Escala é o Dicionário. Frase é a Poesia.

Tocar uma escala de cima a baixo em ordem numérica é como ler o alfabeto: demonstra que você conhece as letras, mas **não transmite nenhuma emoção**.

Para transformar notas soltas em **frases expressivas**, aplicamos quatro pilares fundamentais:
1. **O Espaço (Pausa):** O cérebro do ouvinte precisa de silêncio para processar o que acabou de escutar.
2. **O Motivo:** Uma ideia rítmica curta de 3 a 5 notas.
3. **A Repetição:** Repetir o mesmo ritmo mudando apenas a última nota cria identificação instantânea.
4. **A Direção Melódica:** Frases que sobem criam expectativa; frases que descem geram relaxamento.
            `
          },
          {
            id: 'sl6-p2',
            title: '2. A Técnica de Pergunta e Resposta (Call & Response)',
            contentMarkdown: `
### Como Estruturar um Diálogo Melódico

* **A Pergunta (Call):** Termina em uma nota suspensa (geralmente a 4ª ou a 7ª, como o D ou G em Am). Deixa o ouvinte esperando uma continuação.
* **A Resposta (Response):** Utiliza um ritmo similar, mas repousa com autoridade na **Tônica (A)** ou na Terça (C), fechando o ciclo.
            `
          }
        ],
        demonstrationAudioNotes: [
          { freq: 220.00, duration: 0.3 },
          { freq: 261.63, duration: 0.3 },
          { freq: 293.66, duration: 0.8 }, // Pergunta em Ré (D)
          { freq: 293.66, duration: 0.3 },
          { freq: 261.63, duration: 0.3 },
          { freq: 220.00, duration: 1.2 }, // Resposta em Lá (A)
        ],
        practicalExercise: {
          id: 'ex-solo-6',
          title: 'Exercício de Diálogo Melódico (Pergunta e Resposta em Am)',
          subtitle: 'Execução de frase interrogativa terminando em D seguida de frase conclusiva terminando em A',
          targetBpm: 75,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ com dinâmica expressiva',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'up', fret: 7 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 }, // Fim pergunta
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 8 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 5 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 }, // Fim resposta
          ],
          tablatureText: `
[ Compassos 1 e 2: A PERGUNTA ]
3ª G|--5---7--------7~~~~~--|--(pausa de 2 tempos)--------|
2ª B|----------5------------|-----------------------------|
Notas: C   D   E    D (4ª grau - sensação de pergunta!)

[ Compassos 3 e 4: A RESPOSTA ]
2ª B|--8---5----------------|-----------------------------|
3ª G|----------5------------|-----------------------------|
4ª D|--------------7~~~~~---|--(resolução na tônica A)---|
Notas: G   E   C    A (Tônica - repouso absoluto!)
          `,
          instructions: [
            'Toque a primeira frase (Pergunta) sustentando a nota Ré (casa 7, 3ª corda) durante 2 tempos com vibrato leve.',
            'Faça silêncio total por 2 tempos: sinta o suspense da frase no ar.',
            'Responda com a segunda frase, descendo pelas notas Sol, Mi, Dó até pousar firme no Lá (casa 7, 4ª corda).',
            'Ouça a sensação clara de conclusão que a tônica Lá proporciona.'
          ],
          biomechanicTips: [
            'Não corra nas pausas: contar mentalmente os tempos em silêncio é o que dá precisão ao fraseado.'
          ],
          validationCriteria: 'Executar o diálogo completo respeitando rigorosamente os tempos de pausa e finalizando a resposta na tônica com vibrato limpo.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 75,
          targetBpm: 90
        },
        commonErrors: [
          {
            issue: 'Tocar sem pausas, enfileirando notas sem respiração.',
            solution: 'Cante a frase vocalmente antes de tocar na guitarra. Se você não consegue cantar sem perder o fôlego, a frase está longa demais!'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Solo de Blues em Lá Menor',
          tab: `
2ª B|-------5---8b10---8-5---|
3ª G|---7b9------------------|--7-5---5~~~~~---|
4ª D|------------------------|------7----------|
          `,
          description: 'A essência do fraseado de BB King e Eric Clapton reside em pequenas frases articuladas com pausas elegantes entre cada declaração musical.'
        },
        challenge: {
          title: 'Desafio Prático: A Regra das 3 Notas',
          description: 'Limite-se a usar apenas 3 notas da pentatônica (ex: Lá na casa 5 da 1ª corda, Dó na casa 8 da 2ª corda e Mi na casa 5 da 2ª corda). Crie 4 frases musicais completamente diferentes variando apenas o ritmo e as pausas.',
          instruction: 'Mostre que o ritmo gera mais variedade do que o excesso de notas.'
        },
        masteryCriteria: {
          learning: 'Entende o conceito teórico, mas ainda emenda notas contínuas na prática.',
          consolidating: 'Executa a pergunta e resposta com pausas audíveis e boa intenção melódica.',
          mastered: 'Improvisa frases curtas e expressivas com domínio consciente do silêncio e resolução convicta.'
        },
        reviewNotes: 'Na Aula 7, aprofundaremos exatamente nas notas-alvo: como mirar as notas mais fortes do acorde para que cada frase soe madura e conectada à harmonia.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl6-q1',
              question: 'Qual é o elemento principal que transforma uma escala mecânica em frase expressiva?',
              options: ['O uso consciente de pausas, motivos e resolução rítmica', 'Tocar o mais rápido possível', 'Usar distorção pesada', 'Tocar sempre todas as cordas soltas'],
              correctIndex: 0,
              explanation: 'A música é feita de contraste: pausas, respiração, repetição temática e direção melódica criam significado.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-7',
        level: 2,
        stage: 2,
        moduleTitle: 'Etapa 2 — Escalas e Vocabulário Musical',
        lessonNumber: 7,
        title: 'Aula 7 — Tônicas e Notas-Alvo (Target Notes)',
        subtitle: 'Identificação visual das tônicas e finalização intencional sobre o acorde de Am',
        objective: 'Reconhecer as tônicas como pontos de atração gravitacional, dominando a técnica de notas-alvo para encerrar frases musicais com autoridade tonal.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 5 — Pentatônica Menor', 'Aula 6 — Criando frases.'],
        parts: [
          {
            id: 'sl7-p1',
            title: '1. O Conceito de Gravidade Tonal e Notas-Alvo',
            contentMarkdown: `
### A Física da Emoção Musical: Tensão vs. Repouso

Em qualquer solo, nem todas as notas têm o mesmo peso hierárquico:
* **Notas de Passagem:** Notas usadas no caminho para conectar ideias (geram movimento e dinamismo).
* **Notas-Alvo (Target Notes):** A nota onde você **pousa e sustenta** no final da frase.

Se você tocar 10 notas rápidas e terminar em uma nota que não conversa com o acorde de fundo, o solo soará perdido. Se você tocar apenas 2 notas e pousar com vibrato na **Tônica (Lá)**, o solo soará glorioso e afinado com a harmonia.

\`\`\`
Escala Pentatônica em Lá menor (Am):
A (Tônica)    → Repouso definitivo (Sensação de "cheguei em casa").
C (Terça)     → Caráter emocional menor, doce e expressivo.
E (Quinta)    → Força e estabilidade sóbria.
D (Quarta)    → Tensão suspensa (pede resolução para C ou E).
G (Sétima)    → Tensão blues (pede resolução para A).
\`\`\`
            `
          },
          {
            id: 'sl7-p2',
            title: '2. Mapeamento das 3 Tônicas na Posição 1',
            contentMarkdown: `
### Triangulação Visual das Tônicas de Lá (A)

Treine o seu olho para ver as 3 âncoras de Lá instantaneamente na 5ª casa:
1. **Âncora Grave:** 6ª corda, casa 5 (tônica E2→A2).
2. **Âncora Média:** 4ª corda, casa 7 (tônica D3→A3).
3. **Âncora Aguda:** 1ª corda, casa 5 (tônica E4→A4).

> 💡 **Exercício Mental de Fraseado:**
> Não importa onde sua frase comece (na 3ª corda, na 2ª corda ou na 1ª corda): você sempre sabe exatamente a que distância está da tônica mais próxima para resolver a melodia!
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 5, label: 'Tônica 1 (Grave)' },
                { stringIndex: 3, fret: 7, label: 'Tônica 2 (Média)' },
                { stringIndex: 0, fret: 5, label: 'Tônica 3 (Aguda)' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 261.63, duration: 0.3 },
          { freq: 293.66, duration: 0.3 },
          { freq: 329.63, duration: 0.3 },
          { freq: 392.00, duration: 0.3 },
          { freq: 440.00, duration: 1.5 }, // Resolução plena na tônica aguda A4
        ],
        practicalExercise: {
          id: 'ex-solo-7',
          title: 'Exercício de Convergência para as 3 Tônicas',
          subtitle: 'Três frases distintas que convergem respectivamente para a tônica aguda, média e grave',
          targetBpm: 70,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ articulado',
          notesSequence: [
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 8 },
            { stringNumber: 1, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 8 },
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 }, // Alvo 1
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'up', fret: 7 },
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 }, // Alvo 2
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 8 },
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 }, // Alvo 3
          ],
          tablatureText: `
[ Frase A: Pouso na Tônica Aguda (1ª corda, casa 5) ]
1ª e|-------8---5~~~~~---|
2ª B|---8---------------|
Notas:  G   C   A (Alvo Agudo)

[ Frase B: Pouso na Tônica Média (4ª corda, casa 7) ]
3ª G|---5---7-----------|
4ª D|-----------7~~~~~--|
Notas:  C   D   A (Alvo Médio)

[ Frase C: Pouso na Tônica Grave (6ª corda, casa 5) ]
5ª A|---7---5-----------|
6ª E|-----------5~~~~~--|
Notas:  E   D   A (Alvo Grave)
          `,
          instructions: [
            'Toque a Frase A sustentando a nota Lá aguda com vibrato durante 2 tempos.',
            'Toque a Frase B sustentando o Lá médio na 4ª corda casa 7.',
            'Toque a Frase C mergulhando no grave até o Lá na 6ª corda casa 5.',
            'Note como cada frase, embora diferente, gera a mesma sensação de alívio e conclusão.'
          ],
          biomechanicTips: [
            'Use a polpa firme do dedo para aplicar vibrato uniforme na nota de chegada.'
          ],
          validationCriteria: 'Executar as 3 frases sem hesitar na localização das 3 tônicas, sustentando a afinação limpa a 70 BPM.'
        },
        speedGoals: {
          startingBpm: 55,
          intermediateBpm: 70,
          targetBpm: 85
        },
        commonErrors: [
          {
            issue: 'Terminar frases sem intenção na 4ª (Ré) achando que soa resolvido.',
            solution: 'A 4ª gera suspensão. Se quiser repouso, dê mais um passo melódico até a 3ª (Dó) ou tônica (Lá).'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Solo de Conclusão sobre Am',
          tab: `
1ª e|---8-5---5~~~~~---|
2ª B|-------8----------|
          `,
          description: 'A clássica descida pentatônica de encerramento em Lá menor, utilizada em milhares de gravações antológicas.'
        },
        challenge: {
          title: 'Desafio Prático: Improvise 4 Frases com Final Obrigatório na Tônica',
          description: 'Ligue a base em Am e toque 4 frases livres. A única regra obrigatória é: a última nota de cada frase DEVE ser uma das 3 tônicas de Lá.',
          instruction: 'Observe como o solo soa imediatamente maduro e intencional.'
        },
        masteryCriteria: {
          learning: 'Precisa olhar para a escala para achar as tônicas.',
          consolidating: 'Localiza as 3 tônicas durante o toque com pequena pausa visual.',
          mastered: 'Converte instantaneamente qualquer frase para a tônica mais próxima com segurança e autoridade musical.'
        },
        reviewNotes: 'Agora que dominamos a Posição 1 e suas tônicas, na Aula 8 vamos expandir os horizontes para as 5 Posições da Pentatônica ao longo de todo o braço.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl7-q1',
              question: 'Em qual casa e corda encontramos a tônica de Lá na 4ª corda da Posição 1?',
              options: ['4ª corda, casa 7', '4ª corda, casa 5', '3ª corda, casa 7', '5ª corda, casa 5'],
              correctIndex: 0,
              explanation: 'Na 4ª corda (Ré solta), a casa 7 é a nota Lá (D3 + 7 semitons = A3).'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-8',
        level: 2,
        stage: 2,
        moduleTitle: 'Etapa 2 — Escalas e Vocabulário Musical',
        lessonNumber: 8,
        title: 'Aula 8 — As Cinco Posições da Pentatônica no Braço Inteiro',
        subtitle: 'Os 5 shapes de Am, notas compartilhadas, slides de transição e conexão sem perder o tom',
        objective: 'Mapear e conectar as 5 posições (shapes) da pentatônica menor de Lá ao longo de todo o braço da guitarra, utilizando slides de transição para transitar entre caixas vizinhas com fluidez.',
        estimatedMinutes: 30,
        prerequisites: ['Aula 5 — Pentatônica Posição 1', 'Aula 7 — Tônicas e Notas-Alvo.'],
        parts: [
          {
            id: 'sl8-p1',
            title: '1. O Sistema dos 5 Desenhos (O Quebra-Cabeça Conectado)',
            contentMarkdown: `
### As 5 Caixas da Pentatônica de Lá Menor (Am)

O braço da guitarra não é um conjunto de caixas isoladas: **as cinco posições se encaixam como peças de um quebra-cabeça contínuo**, onde as notas da borda direita de uma caixa formam a borda esquerda da caixa seguinte!

\`\`\`
Posição 1: Casas 5 a 8   (Tônica na 6ª corda, casa 5)
Posição 2: Casas 7 a 10  (Tônica na 4ª corda, casa 7)
Posição 3: Casas 9 a 13  (Tônica na 3ª corda, casa 14/2 e 5ª corda casa 12)
Posição 4: Casas 12 a 15 (Tônica na 5ª corda, casa 12 e 2ª corda casa 10)
Posição 5: Casas 14 a 17 (ou casas 2 a 5 no início do braço)
\`\`\`

Todas contêm **exatamente as mesmas 5 notas**: A, C, D, E e G. O que muda é apenas a altura sonora e a digitação!
            `
          },
          {
            id: 'sl8-p2',
            title: '2. Conectando a Posição 1 com a Posição 2 via Slide',
            contentMarkdown: `
### Como Não Ficar Preso na "Prisão da Casa 5"

O maior erro de guitarristas intermediários é ficar confinado à Posição 1 na 5ª casa.
A chave para a liberdade é o **slide de transição na 3ª corda**:
* Na 3ª corda, toque a casa 7 (Dedo 3) e deslize (slide) com o mesmo dedo para a **casa 9 (nota Mi)**.
* Pronto: sua mão agora pousou com naturalidade na Posição 2!
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 3, fret: 7, label: 'Slide D→E' },
                { stringIndex: 3, fret: 9, label: 'Posição 2' },
                { stringIndex: 1, fret: 10, label: 'A (Tônica Posição 2)' },
                { stringIndex: 0, fret: 8, label: 'C' },
                { stringIndex: 0, fret: 10, label: 'D' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 220.00, duration: 0.3 },
          { freq: 261.63, duration: 0.3 },
          { freq: 293.66, duration: 0.3 },
          { freq: 329.63, duration: 0.5 }, // Slide para E
          { freq: 392.00, duration: 0.3 },
          { freq: 440.00, duration: 0.8 }, // Tônica A aguda na Posição 2 (casa 10)
        ],
        practicalExercise: {
          id: 'ex-solo-8',
          title: 'Exercício de Deslocamento Longitudinal (Posição 1 → Posição 2)',
          subtitle: 'Frase de conexão com slide ascendente e descendente entre casas 5 e 10',
          targetBpm: 75,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ com slide ligado',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'up', fret: 7 },
            { stringNumber: 3, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 9 }, // Slide
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 8 },
            { stringNumber: 2, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 10 }, // Tônica Posição 2
            { stringNumber: 1, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 8 },
            { stringNumber: 1, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 10 },
          ],
          tablatureText: `
1ª e|---------------------------------8---10~~~~~---|
2ª B|-------------------------8---10----------------|
3ª G|---5---7---/9~~~~~----------------------------|
        (Posição 1)   (Slide) (Posição 2 - Casa 8 a 10)
Dig:    1   3   /3            1    3   1    3
Pal:    ↓   ↑   (sl)          ↓    ↑   ↓    ↑
          `,
          instructions: [
            'Inicie na Posição 1 com o dedo 1 na casa 5 da 3ª corda.',
            'Toque a casa 7 com o dedo 3 e deslize imediatamente até a casa 9 sem nova palhetada.',
            'Complete a frase nas cordas 2 e 1 já dentro da Posição 2.',
            'Ouça como a frase ganha amplitude de registro sonoro sem parecer picada.'
          ],
          biomechanicTips: [
            'Mantenha a pressão constante da polpa do dedo na corda durante todo o percurso do slide da casa 7 para a 9.',
            'O polegar atrás do braço desliza suavemente junto com a mão, sem travar na madeira.'
          ],
          validationCriteria: 'Executar a conexão Posição 1 → Posição 2 a 75 BPM com slide perfeitamente audível e resolução cravada no tempo.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 75,
          targetBpm: 90
        },
        commonErrors: [
          {
            issue: 'Aliviar a pressão no meio do slide, fazendo o som morrer.',
            solution: 'Mantenha a corda pressionada contra a escala até chegar ao traste 9.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Solo em Ascensão Triunfante',
          tab: `
3ª G|---5--7/9---|
2ª B|------------|--8--10~~~~~---|
          `,
          description: 'A transição da casa 7 para a 9 na 3ª corda é a chave de ouro utilizada por Slash, Hendrix e Santana para elevar a energia de seus solos.'
        },
        challenge: {
          title: 'Desafio Prático: Caminho Inverso com Slide Descendente',
          description: 'Toque a casa 10 na 2ª corda, casa 8 na 2ª corda, casa 9 na 3ª corda e deslize descendo (slide out) da casa 9 para a casa 7, resolvendo na casa 5 da 3ª corda.',
          instruction: 'Execute a descida fluida a 70 BPM.'
        },
        masteryCriteria: {
          learning: 'Conhece as duas posições separadamente, mas trava na hora de deslizar entre elas.',
          consolidating: 'Realiza a conexão com slide a 65-75 BPM com afinação satisfatória.',
          mastered: 'Conecta as posições da pentatônica livremente por todo o braço com fluidez, precisão e velocidade a 80+ BPM.'
        },
        reviewNotes: 'Com o mapa das escalas dominado, entramos na Etapa 3: o território das Técnicas Expressivas — Bends, Legato, Slides e Vibrato!',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl8-q1',
              question: 'Qual nota da 3ª corda na casa 9 conecta a Posição 1 à Posição 2 da pentatônica de Lá menor?',
              options: ['E (Mi)', 'D (Ré)', 'G (Sol)', 'B (Si)'],
              correctIndex: 0,
              explanation: 'A casa 7 da 3ª corda é Ré. Ao deslizar 2 casas até a casa 9, alcançamos a nota Mi (5º grau), porta de entrada da Posição 2.'
            }
          ]
        }
      }
    ]
  },

  // -----------------------------------------------------------------------
  // ETAPA 3 — TÉCNICAS EXPRESSIVAS (Aulas 9 a 12)
  // -----------------------------------------------------------------------
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'ETAPA 3 — TÉCNICAS EXPRESSIVAS',
    subtitle: 'Bends com afinação perfeita, legato (hammer-on & pull-off), vibrato musical e combinação técnica',
    badge: 'Expressão & Articulação',
    description: 'A guitarra elétrica é o instrumento mais próximo da voz humana graças à sua capacidade expressiva. Aprenda a entoar bends com suporte biomecânico e afinação cirúrgica, executar frases em legato fluído e aplicar o vibrato que define a assinatura sonora de um guitarrista.',
    lessons: [
      {
        id: 'solo-lesson-9',
        level: 3,
        stage: 3,
        moduleTitle: 'Etapa 3 — Técnicas Expressivas',
        lessonNumber: 9,
        title: 'Aula 9 — Bends: Biomecânica, Alavanca e Afinação Perfeita',
        subtitle: 'Apoio de dedos múltiplos, rotação de pulso, bends de 1/2 tom e 1 tom inteiro e nota-alvo',
        objective: 'Executar bends de meio tom (1 casa) e um tom inteiro (2 casas) com suporte biomecânico correto (dedos 1 e 2 apoiando o dedo 3), atingindo a afinação exata da nota de destino sem tensão articular excessiva.',
        estimatedMinutes: 30,
        prerequisites: ['Aula 5 — Pentatônica Menor Posição 1.'],
        parts: [
          {
            id: 'sl9-p1',
            title: '1. A Biomecânica do Bend: Alavanca do Pulso vs. Força dos Dedos',
            contentMarkdown: `
### O Segredo Físico do Bend que Não Falha

Muitos alunos tentam empurrar a corda esticando os dedos individualmente. Isso gera dor, tendinite e **bends desafinados** (sempre abaixo do tom pretendido).

#### A Regra dos Três Dedos Unidos:
* O bend principal na 3ª corda (casa 7) é executado pelo **Dedo 3 (Anelar)**.
* Os **Dedos 1 e 2 se unem atrás do dedo 3** sobre a mesma corda, atuando como um bloco maciço de reforço muscular.
* **A Alavanca:** A força **NÃO vem dos dedos**, mas sim da rotação do **antebraço e do pulso**, exatamente como o movimento de girar a maçaneta de uma porta para baixo e para cima!

\`\`\`
Corda 3 (G):
Casa 7 (D)  ──[ Bend de 1 Tom (Full) ]──>  Deve soar exatamente como a Casa 9 (E)!
Casa 7 (D)  ──[ Bend de 1/2 Tom       ]──>  Deve soar exatamente como a Casa 8 (D#)!
\`\`\`
            `
          },
          {
            id: 'sl9-p2',
            title: '2. O Método de Calibração Auditiva do Target Pitch',
            contentMarkdown: `
### Como Garantir que o seu Bend Não Está Desafinado?

Antes de empurrar a corda, o seu cérebro precisa saber **exatamente qual nota você quer alcançar**:
1. **Toque primeiro a nota de referência natural:** Toque a casa 9 na 3ª corda (nota Mi). Ouça o som com atenção e guarde na memória auditiva.
2. **Volte para a casa 7 com os dedos 1, 2 e 3 apoiados.**
3. **Palhete a casa 7 e empurre a corda:** Gire o pulso para cima até que o som do bend coincida com a frequência da casa 9 que você acabou de ouvir.
4. Se o bend parar antes, a nota soa "murcha" (flat). Se passar, soa estridente (sharp).
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 2, fret: 7, label: 'Dedo 3 (Bend)' },
                { stringIndex: 2, fret: 6, label: 'Dedo 2 (Apoio)' },
                { stringIndex: 2, fret: 5, label: 'Dedo 1 (Apoio)' },
                { stringIndex: 2, fret: 9, label: 'Target Pitch (E)' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 329.63, duration: 1.0 }, // Referência afinada Mi (casa 9)
          { freq: 293.66, duration: 0.2 }, // Ponto de partida Ré (casa 7)
          { freq: 329.63, duration: 1.5 }, // Bend alcançando Mi
        ],
        practicalExercise: {
          id: 'ex-solo-9',
          title: 'Exercício de Calibração: Nota Natural vs. Bend de 1 Tom',
          subtitle: 'Comparação auditiva direta e execução de bend de 1 tom na 3ª corda casa 7',
          targetBpm: 60,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ Palhetada firme',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 9 }, // Referência
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 }, // Ponto de bend
          ],
          tablatureText: `
3ª G|---9~~~~~---|---7b9~~~~~---|---9~~~~~---|---7b9~~~~~---|
        (Ref)        (Bend Full)     (Ref)        (Bend Full)
Dig:    3            1+2+3          3            1+2+3
          `,
          instructions: [
            'Toque a casa 9 na 3ª corda (nota Mi). Deixe soar por 3 tempos e decore o pitch.',
            'Posicione os dedos 1, 2 e 3 na 3ª corda nas casas 5, 6 e 7.',
            'Palhete a casa 7 e gire o pulso empurrando a corda para cima até o pitch igualar a casa 9.',
            'Mantenha a nota no topo sem desafinar por 2 segundos.',
            'Repita 10 vezes até a memória muscular do seu pulso calibrar a altura exata.'
          ],
          biomechanicTips: [
            'O polegar deve ficar abraçado por cima do braço da guitarra para funcionar como fulcro (ponto de apoio da alavanca).',
            'Cuidado com as cordas vizinhas: a ponta dos dedos deve empurrar a 4ª corda para fora do caminho sem deixá-la soar na descida.'
          ],
          validationCriteria: 'Executar 5 bends seguidos de 1 tom na casa 7 atingindo exatamente a afinação da casa 9 sem oscilação.'
        },
        speedGoals: {
          startingBpm: 50,
          intermediateBpm: 60,
          targetBpm: 75
        },
        commonErrors: [
          {
            issue: 'Empurrar com apenas um dedo e sentir dor nos tendões.',
            solution: 'Sempre una os dedos 1 e 2 atrás do dedo 3. São três dedos trabalhando juntos em bloco sólido.'
          },
          {
            issue: 'Deixar a nota descer antes do tempo (bend sem sustentação).',
            solution: 'Trave o pulso no ponto mais alto e segure a pressão firme até a nota morrer ou ser abafada pela mão direita.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Lick Clássico com Bend e Resolução',
          tab: `
3ª G|---7b9---7p5---|
4ª D|---------------|---7~~~~~---|
          `,
          description: 'A frase quintessential de David Gilmour em Comfortably Numb: um bend expressivo de 1 tom que desce em pull-off para repousar na tônica.'
        },
        challenge: {
          title: 'Desafio Prático: O Bend de Meio Tom (Half Bend)',
          description: 'Aplique o mesmo conceito na 2ª corda, casa 7 (F#), empurrando apenas MEIO TOM até a nota Sol (casa 8).',
          instruction: 'Compare auditivamente com a casa 8 natural antes de aplicar o bend.'
        },
        masteryCriteria: {
          learning: 'Os bends ainda ficam abaixo do tom (flat) por falta de apoio do pulso.',
          consolidating: 'Alcança o tom correto na maioria das tentativas, mas com leve tensão ou ruído de corda vizinha.',
          mastered: 'Afinação cirúrgica no centésimo de semitom em 100% dos bends com apoio biomecânico natural e relaxado.'
        },
        reviewNotes: 'Com o poder dos bends incorporado, na Aula 10 desenvolveremos a agilidade fluida do Legato com Hammer-ons e Pull-offs.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl9-q1',
              question: 'De onde deve vir a força principal para erguer a corda em um bend afinado?',
              options: ['Da rotação do pulso e antebraço com dedos reforçados em bloco', 'Apenas da ponta do dedo anelar isolado', 'Do ombro', 'Puxando a corda com a mão da palheta'],
              correctIndex: 0,
              explanation: 'A alavanca do pulso combinada aos três dedos apoiados em bloco garante potência, afinação e previne lesões articulares.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-10',
        level: 3,
        stage: 3,
        moduleTitle: 'Etapa 3 — Técnicas Expressivas',
        lessonNumber: 10,
        title: 'Aula 10 — Legato: Hammer-on e Pull-off',
        subtitle: 'Articulação fluida sem palhetada, força percussiva, puxada lateral e equilíbrio dinâmico',
        objective: 'Executar hammer-ons e pull-offs com clareza, volume uniforme em relação às notas palhetadas e independência muscular, criando linhas melódicas fluidas e contínuas (legato).',
        estimatedMinutes: 25,
        prerequisites: ['Aula 3 — Sincronização e Independência das Mãos.'],
        parts: [
          {
            id: 'sl10-p1',
            title: '1. O Mecanismo do Hammer-on (Martelada Sonora)',
            contentMarkdown: `
### O Que é o Hammer-on?

O **Hammer-on (h)** consiste em produzir uma nota mais aguda **sem usar a palheta**, exclusivamente pela energia percussiva com que o dedo da mão esquerda martela a corda contra o traste:
1. Você palheta a nota mais grave (ex: casa 5 com dedo 1).
2. Enquanto a corda vibra, o dedo 3 desce com velocidade e firmeza na casa 7.
3. **O Segredo:** A força não é peso morto, mas sim **velocidade de impacto**. A ponta do dedo atinge a madeira como um martelo de piano afinado.
            `
          },
          {
            id: 'sl10-p2',
            title: '2. O Mecanismo do Pull-off (A Puxada Lateral Oculta)',
            contentMarkdown: `
### Por que o Pull-off de Muitos Alunos Fica Mudo?

O maior equívoco é achar que o **Pull-off (p)** consiste apenas em "levantar o dedo". Se você apenas levantar o dedo verticalmente, o som morrerá instantaneamente!

#### A Mecânica Correta:
* O dedo que está na nota mais aguda (ex: dedo 3 na casa 7) faz uma **micro-beliscada para baixo**, puxando suavemente a corda para a lateral antes de soltá-la.
* Esse movimento belisca a corda de novo, fazendo a nota de trás (dedo 1 na casa 5) soar com o mesmo volume da nota original!

\`\`\`
Hammer-on:  Casa 5 ──(Martela)──> Casa 7      [Notação: 5h7]
Pull-off:   Casa 7 ──(Belisca)──> Casa 5      [Notação: 7p5]
Trill:      5h7p5h7p5h7...                     (Ligado contínuo)
\`\`\`
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 2, fret: 5, label: 'Dedo 1 (Base)' },
                { stringIndex: 2, fret: 7, label: 'Dedo 3 (Martela/Puxa)' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 220.00, duration: 0.25 },
          { freq: 261.63, duration: 0.25 },
          { freq: 220.00, duration: 0.25 },
          { freq: 261.63, duration: 0.25 },
          { freq: 220.00, duration: 0.5 },
        ],
        practicalExercise: {
          id: 'ex-solo-10',
          title: 'Exercício de Trill e Legato Progressivo em Cordas Adjacentes',
          subtitle: 'Combinação de Hammer-on e Pull-off 5h7p5 nas cordas 3, 2 e 1',
          targetBpm: 80,
          targetRepetitions: 12,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Palheta apenas na 1ª nota de cada grupo: ↓ (h) (p)',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 }, // Hammer
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 5 }, // Pull
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 },
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 8 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 5 },
          ],
          tablatureText: `
3ª G|---5h7p5---5h7p5---|-------------------|
2ª B|-------------------|---5h8p5---5h8p5---|
1ª e|-------------------|-------------------|
Pal:    ↓ (h p) ↓ (h p)     ↓ (h p) ↓ (h p)
Dig:    1  3 1  1  3 1      1  4 1  1  4 1
          `,
          instructions: [
            'Palhete apenas a primeira nota (casa 5 com dedo 1).',
            'Martela com o dedo 3 na casa 7 (Hammer-on) sem usar a palheta.',
            'Puxe a corda para baixo com o dedo 3 (Pull-off) revelando a casa 5 que já estava esperando plantada.',
            'Na 2ª corda, repita com os dedos 1 e 4 (casa 5 e 8).',
            'O volume das três notas (palhetada, martelada e puxada) deve ser estritamente igual.'
          ],
          biomechanicTips: [
            'Mantenha o dedo 1 ancorado firmemente na casa 5 durante todo o hammer e pull-off.',
            'Não faça força excessiva com o dedão atrás do braço: o movimento vem da agilidade dos tendões flexores dos dedos.'
          ],
          validationCriteria: 'Executar 10 repetições contínuas a 80 BPM onde todas as notas ligadas soem com nitidez e volume estável.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 80,
          targetBpm: 105
        },
        commonErrors: [
          {
            issue: 'O pull-off soa fraco e quase inaudível.',
            solution: 'Você está levantando o dedo em vez de puxar a corda. Aplique a micro-beliscada descendente para fazer a corda vibrar novamente.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Clássico Lick em Legato Rápido',
          tab: `
1ª e|---8p5---8p5---8p5---8p5---|
2ª B|-------8-----8-----8-------|
          `,
          description: 'A técnica base do estilo de Jimmy Page e Eddie Van Halen: velocidade extrema gerada pela mão esquerda sem cansar a palheta.'
        },
        challenge: {
          title: 'Desafio Prático: Trill Contínuo de 15 Segundos',
          description: 'Toque 5h7p5h7p5h7 ininterruptamente durante 15 segundos com apenas 1 palhetada inicial.',
          instruction: 'Mantenha a corda soando apenas com a energia dos dedos 1 e 3 da mão esquerda.'
        },
        masteryCriteria: {
          learning: 'O hammer-on soa baixo e o pull-off morre rapidamente.',
          consolidating: 'Consegue manter o som das notas ligadas com volume regular a 70-80 BPM.',
          mastered: 'Executa sequências longas em legato com ataque percussivo uniforme, velocidade a 95+ BPM e zero esforço muscular.'
        },
        reviewNotes: 'Na Aula 11, combinaremos o controle de sustentação com duas das técnicas mais ricas em nuances da guitarra: Slides e Vibrato.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl10-q1',
              question: 'Como deve ser o movimento do dedo no Pull-off para que a nota não soe fraca?',
              options: ['Uma micro-beliscada puxando levemente a corda para a lateral/baixo', 'Apenas levantar o dedo verticalmente para cima', 'Bater mais forte com a palheta', 'Soltar a corda rapidamente com o polegar'],
              correctIndex: 0,
              explanation: 'A micro-beliscada lateral com a ponta do dedo faz a corda vibrar com energia suficiente para soar como se tivesse sido palhetada.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-11',
        level: 3,
        stage: 3,
        moduleTitle: 'Etapa 3 — Técnicas Expressivas',
        lessonNumber: 11,
        title: 'Aula 11 — Slides e Vibrato: O DNA da Expressividade',
        subtitle: 'Slides ascendentes e descendentes, vibrato circular com pulso e controle de amplitude',
        objective: 'Dominar slides precisos mantendo a pressão de contato na escala e aplicar um vibrato controlado, regular e musical que enriqueça a sustentação das notas sem desafiná-las.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 9 — Bends', 'Aula 10 — Legato.'],
        parts: [
          {
            id: 'sl11-p1',
            title: '1. A Arte do Slide (Deslizamento Conectado)',
            contentMarkdown: `
### Deslizamento Perfeito sem Perda de Som

O **Slide (s)** conecta duas notas através de um movimento contínuo da mão sobre a escala:
* **Slide Ascendente (ex: 5/7):** Palhete a casa 5 e deslize em direção ao corpo até a casa 7.
* **Slide Descendente (ex: 7\\5):** Palhete a casa 7 e deslize em direção ao headstock até a casa 5.

#### As Duas Regras de Ouro do Slide:
1. **Pressão Constante:** Nunca alivie o peso do dedo durante a viagem entre as casas; se você soltar a pressão, o som morre na madeira.
2. **Freio Cirúrgico:** Pare exatamente no traste da nota de destino, sem ultrapassar nem ficar antes.
            `
          },
          {
            id: 'sl11-p2',
            title: '2. O Vibrato: A Impressão Digital do Guitarrista',
            contentMarkdown: `
### Por que o Vibrato Separa Mestres de Amadores?

Você reconhece BB King, Eric Clapton, Carlos Santana ou David Gilmour com **uma única nota sustentada**. O motivo é o **vibrato**.

O vibrato é uma micro-oscilação periódica de afinação:
* **O Movimento:** Assim como no bend, o vibrato na guitarra elétrica nasce da **rotação suave do pulso e antebraço** (nunca tremendo os dedos no ar de forma espasmódica).
* **A Afinação Central:** O vibrato sobe levemente a afinação da nota e retorna à afinação de repouso no centro do tempo.
* **Controle de Velocidade:** Um vibrato musical deve ser cadenciado no tempo da música (geralmente em tercetos ou semicolcheias relaxadas).
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 2, fret: 7, label: 'Slide 5→7' },
                { stringIndex: 2, fret: 7, label: 'Vibrato (~)' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 220.00, duration: 0.3 },
          { freq: 293.66, duration: 0.2 },
          { freq: 329.63, duration: 1.8 }, // Nota com vibrato sustentado
        ],
        practicalExercise: {
          id: 'ex-solo-11',
          title: 'Exercício de Slide com Vibrato Cadenciado no Repouso',
          subtitle: 'Slide 5/7 na 3ª corda seguido de vibrato controlado por 3 tempos',
          targetBpm: 65,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ (Slide ligado)',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 }, // Slide
          ],
          tablatureText: `
3ª G|---5/7~~~~~---|---(sustenta com oscilação rítmica suave)---|
Dig:    1 /3~~~~~
          `,
          instructions: [
            'Palhete a casa 5 na 3ª corda com o dedo 1.',
            'Deslize com firmeza para a casa 7.',
            'Assim que chegar na casa 7, espere meio segundo (deixe a nota soar pura) e inicie a rotação suave do pulso.',
            'Faça 4 oscilações de vibrato por tempo de metrônomo a 60 BPM.',
            'Mantenha a nota ressoando até o fim do compasso sem desafinar.'
          ],
          biomechanicTips: [
            'Não comece o vibrato no milissegundo em que a nota soa: dar um breve instante de pureza antes do vibrato faz a nota soar muito mais elegante.'
          ],
          validationCriteria: 'Executar o slide sem quebras e manter o vibrato uniforme por 3 tempos a 65 BPM sem perder a afinação central.'
        },
        speedGoals: {
          startingBpm: 50,
          intermediateBpm: 65,
          targetBpm: 80
        },
        commonErrors: [
          {
            issue: 'Vibrato de "mosquito" (rápido demais, tenso e histérico).',
            solution: 'Relaxe o punho. Um vibrato largo e cadenciado transmite autoridade; um vibrato rápido e nervoso denuncia tensão e inexperiência.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Canto das Cordas de Santana',
          tab: `
2ª B|---8/10~~~~~---|---10\\8~~~~~---|
          `,
          description: 'A entrada clássica em melodias líricas de guitarra: o slide que conduz à nota principal que floresce em um vibrato apaixonado.'
        },
        challenge: {
          title: 'Desafio Prático: Vibrato no Dedo 1 (Indicador)',
          description: 'Aplicar vibrato com o dedo 1 é mais desafiador porque não há dedos de apoio atrás. Apoie a base da palma e use o giro do antebraço na casa 5 da 3ª corda.',
          instruction: 'Sustente o vibrato no dedo 1 por 4 tempos completos com afinação estável.'
        },
        masteryCriteria: {
          learning: 'O slide perde volume antes de chegar e o vibrato é tenso e descompassado.',
          consolidating: 'Slide firme e vibrato musical com amplitude consistente na maioria dos tempos.',
          mastered: 'Controle absoluto de velocidade, amplitude e sustentação com vibrato maduro e expressivo.'
        },
        reviewNotes: 'Na Aula 12, fundiremos todas as técnicas dominadas (Bends, Legato, Slides e Vibrato) em um solo curto de alta musicalidade.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl11-q1',
              question: 'Qual é o segredo para um vibrato maduro e elegante na guitarra elétrica?',
              options: ['Oscilação rítmica controlada gerada pela rotação do pulso e antebraço', 'Tremer os dedos o mais rápido possível', 'Apertar a corda com toda a força do dedão', 'Tocar com a palheta várias vezes seguidas'],
              correctIndex: 0,
              explanation: 'O vibrato musical nasce da rotação suave e ritmada do pulso, garantindo amplitude constante e afinação límpida.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-12',
        level: 3,
        stage: 3,
        moduleTitle: 'Etapa 3 — Técnicas Expressivas',
        lessonNumber: 12,
        title: 'Aula 12 — Combinando as Técnicas em Frases Fluídas',
        subtitle: 'Fusão de Bends, Slides, Hammer-ons, Pull-offs e Vibrato em solos expressivos',
        objective: 'Integrar organicamente as quatro técnicas essenciais de articulação em frases longas e musicais, preservando clareza de ataque, ritmo e afinação irrepreensível.',
        estimatedMinutes: 30,
        prerequisites: ['Aula 9 — Bends', 'Aula 10 — Legato', 'Aula 11 — Slides e Vibrato.'],
        parts: [
          {
            id: 'sl12-p1',
            title: '1. O Vocabulário Híbrido da Guitarra Solo',
            contentMarkdown: `
### Como os Grandes Solistas Constroem Linhas Memoráveis

Os solos mais marcantes da história do rock e do blues não usam uma técnica isolada por vez: eles **encadeiam as técnicas em um fluxo contínuo**:
1. **O Ataque com Slide:** Para entrar na frase com dinamismo.
2. **O Clímax com Bend:** Para elevar a tensão dramática da melodia.
3. **O Alívio com Release e Pull-off:** Para descer com agilidade sem gastar palhetada.
4. **A Resolução com Vibrato:** Para ancorar o repouso com nobreza e presença.

\`\`\`
Sequência de Ouro da Articulação:
Slide In (/) ──> Bend (b) ──> Release (r) ──> Pull-off (p) ──> Vibrato (~)
\`\`\`
            `
          },
          {
            id: 'sl12-p2',
            title: '2. Dinâmica e Controle de Volume na Expressão',
            contentMarkdown: `
### A Dinâmica Musical (Pianos e Fortes)

* Notas de passagem e hammer-ons podem soar ligeiramente mais suaves (**piano**).
* O pico do bend deve ser palhetado com autoridade e presença (**forte**).
* Esse contraste de volumes impede que a guitarra soe como um instrumento eletrônico robotizado.
            `
          }
        ],
        demonstrationAudioNotes: [
          { freq: 261.63, duration: 0.2 },
          { freq: 293.66, duration: 0.2 },
          { freq: 329.63, duration: 0.8 }, // Bend 1 tom
          { freq: 293.66, duration: 0.2 },
          { freq: 261.63, duration: 0.3 },
          { freq: 220.00, duration: 1.5 }, // Vibrato
        ],
        practicalExercise: {
          id: 'ex-solo-12',
          title: 'O Estudo Expressivo Completo em Lá Menor',
          subtitle: 'Frase de 4 compassos combinando Slide, Bend, Pull-off e Vibrato',
          targetBpm: 70,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Articulação híbrida com palhetadas selecionadas',
          notesSequence: [
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 }, // Bend
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 },
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 8 },
            { stringNumber: 2, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 10 }, // Slide 8/10
          ],
          tablatureText: `
1ª e|---------------------------------------------------------|
2ª B|-----------------5---8/10~~~~~---8p5---------------------|
3ª G|---------5---7b9-----------------------7p5---------------|
4ª D|---/7----------------------------------------7~~~~~------|
Pal:    (sl)  ↓   ↓   ↓   (sl)        (p)   (p)   (vib)
Dig:    /3    1   3   1   1/3          3 1   3 1   3
          `,
          instructions: [
            'Inicie com um slide rápido de entrada para a casa 7 da 4ª corda.',
            'Passe para a casa 5 da 3ª corda e execute o bend de 1 tom na casa 7 (atingindo pitch de casa 9).',
            'Toque a casa 5 na 2ª corda e deslize da casa 8 para a 10 na 2ª corda com vibrato encorpado.',
            'Retorne com o pull-off 8p5 na 2ª corda e 7p5 na 3ª corda, repousando na tônica casa 7 da 4ª corda.'
          ],
          biomechanicTips: [
            'Respire no momento do bend: não prenda a respiração durante as passagens técnicas.'
          ],
          validationCriteria: 'Executar a frase inteira sem falhas de articulação, com bend perfeitamente afinado e transições limpas a 70 BPM.'
        },
        speedGoals: {
          startingBpm: 55,
          intermediateBpm: 70,
          targetBpm: 85
        },
        commonErrors: [
          {
            issue: 'Tocar o solo com pressa, embolando o bend com o slide seguinte.',
            solution: 'Dê tempo para cada nota brilhar. O valor do solo está na clareza de cada articulação, não no andamento descontrolado.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Solo Cantado no Estilo Pink Floyd',
          tab: `
3ª G|---7b9-r7-p5---|
4ª D|---------------|---7~~~~~---|
          `,
          description: 'A clássica combinação Bend + Release + Pull-off (b-r-p), o lick mais expressivo do vocabulário mundial de guitarra solo.'
        },
        challenge: {
          title: 'Desafio Prático: Grave a Si Mesmo e Avalie a Afinação',
          description: 'Grave a execução desta frase com o gravador do celular. Escute com fones de ouvido e confira se o bend atingiu o tom exato e se o vibrato oscilou ritmicamente.',
          instruction: 'A auto-escuta crítica é o atalho mais rápido para a maturidade musical.'
        },
        masteryCriteria: {
          learning: 'Executa as técnicas separadas, mas engasga na conexão do bend com o pull-off.',
          consolidating: 'Conecta toda a frase com boa afinação e andamento consistente a 65-70 BPM.',
          mastered: 'Linha melódica límpida, bend cirúrgico, vibrato envolvente e expressividade comovente a 75+ BPM.'
        },
        reviewNotes: 'Sensacional! Você agora possui uma caixa de ferramentas expressiva completa. Na Etapa 4, entenderemos a teoria aplicada por trás de cada escolha melódica.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl12-q1',
              question: 'Na sequência bend-release-pull-off (7b9-r7-p5), quantas palhetadas são necessárias?',
              options: ['Apenas 1 palhetada inicial na casa 7', '3 palhetadas separadas', '2 palhetadas', 'Nenhuma'],
              correctIndex: 0,
              explanation: 'Apenas uma palhetada é desferida na casa 7; a subida, a descida (release) e a retirada do dedo (pull-off) ocorrem puramente com a energia da mão esquerda.'
            }
          ]
        }
      }
    ]
  },

  // -----------------------------------------------------------------------
  // ETAPA 4 — TEORIA APLICADA E IMPROVISAÇÃO (Aulas 13 a 16)
  // -----------------------------------------------------------------------
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'ETAPA 4 — TEORIA APLICADA E IMPROVISAÇÃO',
    subtitle: 'Pentatônica Maior vs. Menor, escalas relativas diatônicas, notas do acorde (Chord Tones) e motivos',
    badge: 'Teoria & Harmonia',
    description: 'Compreenda a lógica profunda das notas e acorde o seu ouvido. Descubra a fascinante diferença entre a Pentatônica Maior e Menor, domine as escalas relativas (C Maior e Am Natural), aprenda a mirar nas notas da harmonia e desenvolva motivos melódicos consistentes.',
    lessons: [
      {
        id: 'solo-lesson-13',
        level: 4,
        stage: 4,
        moduleTitle: 'Etapa 4 — Teoria Aplicada e Improvisação',
        lessonNumber: 13,
        title: 'Aula 13 — Pentatônica Maior vs. Menor: Duas Cores Sonoras',
        subtitle: 'Comparação intervalar de Lá Maior (1, 2, 3, 5, 6) e Lá Menor (1, ♭3, 4, 5, ♭7) e contextos de aplicação',
        objective: 'Diferenciar auditiva e estruturalmente a Pentatônica Maior da Pentatônica Menor na mesma fundamental (Lá), aplicando cada uma no contexto harmônico adequado (Country/Southern Rock vs. Blues/Hard Rock).',
        estimatedMinutes: 25,
        prerequisites: ['Aula 5 — Pentatônica Menor.'],
        parts: [
          {
            id: 'sl13-p1',
            title: '1. O Confronto das Fórmulas: A Mágica da Terça Maior',
            contentMarkdown: `
### Por que o seu Solo Pode Mudar de Triste para Radiante?

A diferença mais impactante na percepção emocional da música ocidental reside na **terça**:
* **Terça Menor (♭3 - 3 semitons):** Traz o clima introspectivo, melancólico, blues ou pesado.
* **Terça Maior (3 - 4 semitons):** Traz luminosidade, alegria, triunfo, soul e country.

#### Comparação das Fórmulas na Fundamental Lá (A):
\`\`\`
Pentatônica Menor de Lá (Am):  1 — ♭3 — 4 — 5 — ♭7  (A — C  — D — E — G)
Pentatônica Maior de Lá (A):   1 —  2 — 3 — 5 —  6  (A — B  — C# — E — F#)
\`\`\`

> 💡 **A Diferença Chave:**
> Na pentatônica maior, trocamos o Dó natural (C) pelo **Dó sustenido (C#)**, e o Sol natural (G) pelo **Fá sustenido (F#)**. Essa simples mudança ilumina todo o fraseado!
            `
          },
          {
            id: 'sl13-p2',
            title: '2. O Desenho da Pentatônica Maior de Lá na Casa 2 e 5',
            contentMarkdown: `
### Como Encontrar a Pentatônica Maior Rapidamente?

A regra de ouro dos mestres:
Para tocar a Pentatônica **Maior** de Lá, basta tocar o shape da Pentatônica **Menor** recuado **3 casas** (na 2ª casa, que é F# menor)!
* Ou aprender o shape paralelo direto na 5ª casa:
\`\`\`
Corda 6 (E): Casas 5 e 7   → A (1) e B (2)
Corda 5 (A): Casas 4 e 7   → C# (3) e E (5)
Corda 4 (D): Casas 4 e 7   → F# (6) e A (1)
Corda 3 (G): Casas 4 e 6   → B (2) e C# (3)
Corda 2 (B): Casas 5 e 7   → E (5) e F# (6)
Corda 1 (E): Casas 5 e 7   → A (1) e B (2)
\`\`\`
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 5, label: 'A (1)' },
                { stringIndex: 4, fret: 4, label: 'C# (3ª Maior)' },
                { stringIndex: 3, fret: 4, label: 'F# (6ª)' },
                { stringIndex: 3, fret: 7, label: 'A (1)' },
                { stringIndex: 2, fret: 6, label: 'C# (3ª Maior)' },
                { stringIndex: 0, fret: 5, label: 'A (1)' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          // Frase Menor (melancólica)
          { freq: 220.00, duration: 0.3 },
          { freq: 261.63, duration: 0.3 }, // C natural
          { freq: 293.66, duration: 0.5 },
          // Frase Maior (luminosa)
          { freq: 220.00, duration: 0.3 },
          { freq: 277.18, duration: 0.3 }, // C# doce
          { freq: 329.63, duration: 0.8 },
        ],
        practicalExercise: {
          id: 'ex-solo-13',
          title: 'Exercício de Contraste Auditivo: Menor vs. Maior em Lá',
          subtitle: 'Execução de frase em Am seguida de frase em A Maior para calibrar o ouvido',
          targetBpm: 75,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ alternado',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 }, // Menor
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 7 },
            { stringNumber: 3, noteCipher: 'C#', notePt: 'Dó#', pickDirection: 'down', fret: 6 }, // Maior
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 7 },
          ],
          tablatureText: `
[ Frase Menor: Blues / Rock com Terça Menor C (casa 5) ]
3ª G|---5---7---5~~~~~~~~---|
4ª D|---------------7-------|
Sabor: Melancólico, pesado, bluesy (C natural)

[ Frase Maior: Southern Rock / Country com Terça Maior C# (casa 6) ]
3ª G|---6---7---6~~~~~~~~---|
4ª D|---------------7-------|
Sabor: Doce, triunfante, solar (C#)
          `,
          instructions: [
            'Toque a primeira frase enfatizando a casa 5 na 3ª corda (C natural). Ouça a cor menor.',
            'Em seguida, toque a segunda frase trocando a casa 5 pela casa 6 (C#). Sinta como a frase se ilumina imediatamente.',
            'Treine essa alternância até seu ouvido antecipar a emoção de cada terça antes mesmo de palhetar.'
          ],
          biomechanicTips: [
            'Use o dedo 1 na casa 5 e o dedo 2 na casa 6 para sentir a diferença de posicionamento.'
          ],
          validationCriteria: 'Executar e identificar de ouvido a diferença entre a frase menor e maior com 100% de acerto a 75 BPM.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 75,
          targetBpm: 90
        },
        commonErrors: [
          {
            issue: 'Tocar a terça maior (C#) sobre um acorde de Lá menor (Am).',
            solution: 'Isso gera um choque dissonante agressivo. A pentatônica maior é para acordes Maiores (A, A7); para acordes menores (Am), use sempre a pentatônica menor!'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Estilo Allman Brothers e Lynyrd Skynyrd',
          tab: `
2ª B|---5h7-5-------|
3ª G|---------6~~~~~| (C# doce no repouso)
          `,
          description: 'A assinatura do Southern Rock de Jessica e Sweet Home Alabama: melodias alegres construídas sobre a pentatônica maior.'
        },
        challenge: {
          title: 'Desafio Prático: Misturando Maior e Menor no Blues (BB King Box)',
          description: 'No Blues em Lá, toque a terça menor (casa 5 na 3ª corda) e dê um micro-bend de 1/4 de tom em direção ao C#.',
          instruction: 'Esse "bend de quarto de tom" é o segredo do tempero blues definitivo de BB King.'
        },
        masteryCriteria: {
          learning: 'Confunde os dois desenhos e aplica a terça maior sobre harmonia menor.',
          consolidating: 'Reconhece o som e toca as duas escalas separadas nos contextos corretos.',
          mastered: 'Alterna conscientemente entre pentatônica maior e menor com controle estético e expressivo refinado.'
        },
        reviewNotes: 'Na Aula 14, ampliaremos o vocabulário de 5 notas para as 7 notas completas da Escala Diatônica Maior e Menor Natural.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl13-q1',
              question: 'Qual é a nota que diferencia a pentatônica maior de Lá da pentatônica menor de Lá no 3º grau?',
              options: ['C# (Dó#) na Maior vs. C (Dó) na Menor', 'D (Ré) na Maior vs. E (Mi) na Menor', 'F# na Menor vs. F na Maior', 'G na Maior vs. A na Menor'],
              correctIndex: 0,
              explanation: 'A terça define o modo: a terça maior é C# (4 semitons de A), enquanto a terça menor é C natural (3 semitons).'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-14',
        level: 4,
        stage: 4,
        moduleTitle: 'Etapa 4 — Teoria Aplicada e Improvisação',
        lessonNumber: 14,
        title: 'Aula 14 — Escala Maior e Escala Menor Natural Relativa',
        subtitle: 'Estrutura intervalar (T-T-ST-T-T-T-ST), relação Dó Maior / Lá Menor e notas características',
        objective: 'Compreender a relação de escalas relativas (Dó Maior e Lá Menor Natural compartilham as mesmas notas), dominando a estrutura diatônica completa de 7 notas para enriquecer seus solos.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 5 — Pentatônica Menor', 'Aula 13 — Pentatônica Maior vs. Menor.'],
        parts: [
          {
            id: 'sl14-p1',
            title: '1. As 7 Notas Diatônicas e a Relação de Parentesco Relativo',
            contentMarkdown: `
### Por Que Toda Escala Maior Tem uma "Irmã Gêmea" Menor?

A escala maior é a matriz de toda a harmonia ocidental, construída pela fórmula de intervalos:
\`\`\`
Fórmula Maior:    Tom — Tom — Semitom — Tom — Tom — Tom — Semitom
Dó Maior (C):     C  —  D  —    E    —  F  —  G  —  A  —    B    —  C
\`\`\`

Se iniciarmos essa **mesma sequência exata de notas** a partir do **6º grau** (a nota Lá):
\`\`\`
Fórmula Menor:    Tom — Semitom — Tom — Tom — Semitom — Tom — Tom
Lá Menor (Am):    A  —    B    —  C  —  D  —    E    —  F  —  G  —  A
\`\`\`

> 🔑 **A Regra de Ouro das Escalas Relativas:**
> **Dó Maior (C) e Lá Menor (Am)** possuem exatamente o mesmo "DNA" (as mesmas notas naturais, sem nenhum sustenido ou bemol). O que muda é apenas o centro de gravidade:
> * Se a música repousa em C → O som soa Maior/Solar.
> * Se a música repousa em Am → O som soa Menor/Épico.
            `
          },
          {
            id: 'sl14-p2',
            title: '2. As Duas Notas Adicionadas à Pentatônica',
            contentMarkdown: `
### Pentatônica Menor + Graus 2 e ♭6 = Escala Menor Natural!

Compare:
* **Pentatônica de Am (5 notas):** A — C — D — E — G
* **Escala Menor Natural de Am (7 notas):** A — **B (2º)** — C — D — E — **F (♭6)** — G

As duas "novas" notas são o **Si (B)** e o **Fá (F)**. O Fá adiciona uma dramaticidade intensa e melancólica inconfundível (muito usada em solos de Heavy Metal e Rock Neoclássico, como Iron Maiden e Gary Moore).
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 5, fret: 5, label: 'A (1)' },
                { stringIndex: 5, fret: 7, label: 'B (2ª)' },
                { stringIndex: 5, fret: 8, label: 'C (3ª)' },
                { stringIndex: 4, fret: 5, label: 'D (4ª)' },
                { stringIndex: 4, fret: 7, label: 'E (5ª)' },
                { stringIndex: 3, fret: 5, label: 'G (7ª)' },
                { stringIndex: 3, fret: 7, label: 'A (1)' },
                { stringIndex: 2, fret: 5, label: 'C (3ª)' },
                { stringIndex: 2, fret: 6, label: 'F (♭6 Dramática!)' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 220.00, duration: 0.3 },
          { freq: 246.94, duration: 0.3 }, // B (2ª)
          { freq: 261.63, duration: 0.3 }, // C
          { freq: 293.66, duration: 0.3 }, // D
          { freq: 329.63, duration: 0.3 }, // E
          { freq: 349.23, duration: 0.6 }, // F (♭6 dramática!)
          { freq: 329.63, duration: 0.4 }, // E (resolução)
          { freq: 220.00, duration: 1.0 }, // A (tônica)
        ],
        practicalExercise: {
          id: 'ex-solo-14',
          title: 'Exercício da Escala Menor Natural Completa com ♭6 Expressiva',
          subtitle: 'Frase melódica em Lá menor destacando o drama da nota Fá (F)',
          targetBpm: 75,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ com vibrato no Fá',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 5 },
            { stringNumber: 2, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 6 }, // ♭6
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 5 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 }, // Tônica
          ],
          tablatureText: `
2ª B|---------5---6~~~~~---5-------------------|
3ª G|---7----------------------5---------------|
4ª D|------------------------------7~~~~~------|
Notas:  D     E   F (♭6)   E   C   A (Tônica)
Dig:    3     1   2        1   1   3
          `,
          instructions: [
            'Toque a frase subindo até a casa 6 da 2ª corda (nota Fá).',
            'Sustente a nota Fá com vibrato suave por 1 tempo e meio: sinta a carga dramática da 6ª menor.',
            'Resolva descendo suavemente pelo Mi e Dó até a tônica Lá.',
            'Compare com a pentatônica simples: note como o Fá adiciona uma camada de sofisticação emocional.'
          ],
          biomechanicTips: [
            'O dedo 2 alcança com naturalidade a casa 6 da 2ª corda enquanto o dedo 1 mantém a casa 5 guardada.'
          ],
          validationCriteria: 'Tocar a frase diatônica completa com a nota Fá afinada e resolução impecável a 75 BPM.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 75,
          targetBpm: 90
        },
        commonErrors: [
          {
            issue: 'Tocar a nota Fá como nota de repouso longo final.',
            solution: 'A 6ª menor (F) é uma nota de altíssima tensão; ela quer resolver no Mi (5ª) ou na tônica (Lá). Não termine o solo nela, use-a como trampolim emocional!'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Estilo Balada Rock dos Anos 80 e Gary Moore',
          tab: `
2ª B|---5-6-8-6-5---|
3ª G|---------------|---7-5-7~~~~~---|
          `,
          description: 'A melodia diatônica de Still Got the Blues e Parisienne Walkways fundamenta-se nos semitons Mi-Fá da escala menor natural.'
        },
        challenge: {
          title: 'Desafio Prático: Transposição Relativa para Dó Maior',
          description: 'Toque exatamente as mesmas notas da frase da aula, mas inicie e termine na nota Dó (casa 5 da 3ª corda).',
          instruction: 'Sinta como a mesma escala se transforma imediatamente em uma melodia solar e triunfante.'
        },
        masteryCriteria: {
          learning: 'Compreende a teoria das relativas, mas erra as notas Si e Fá ao solar.',
          consolidating: 'Aplica a escala menor natural a 70 BPM com bom senso estético das notas de passagem.',
          mastered: 'Utiliza a escala diatônica e suas notas características com maestria harmônica a 80+ BPM.'
        },
        reviewNotes: 'Na Aula 15, daremos o salto definitivo: conectar as notas do seu solo diretamente aos acordes que a banda está tocando (Chord Tones).',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl14-q1',
              question: 'Quais são as duas notas adicionadas à pentatônica menor de Lá para formar a escala menor natural?',
              options: ['B (2ª) e F (♭6)', 'C# e G#', 'D# e A#', 'F# e C#'],
              correctIndex: 0,
              explanation: 'A pentatônica de Lá tem A, C, D, E, G. A escala menor natural adiciona o Si (B, 2º grau) e o Fá (F, 6º grau menor).'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-15',
        level: 4,
        stage: 4,
        moduleTitle: 'Etapa 4 — Teoria Aplicada e Improvisação',
        lessonNumber: 15,
        title: 'Aula 15 — Solando Sobre Acordes (Chord Tone Soloing)',
        subtitle: 'Conexão com a harmonia: acompanhamento Am - Dm - Em e notas-alvo de cada tríade',
        objective: 'Mapear as notas dos acordes da progressão (Am, Dm, Em) e pousar deliberadamente nas notas da tríade no exato momento da mudança de acorde, fazendo a guitarra "cantar a harmonia".',
        estimatedMinutes: 30,
        prerequisites: ['Aula 7 — Tônicas e Notas-Alvo', 'Aula 14 — Escala Maior e Menor Natural.'],
        parts: [
          {
            id: 'sl15-p1',
            title: '1. O Que É o Chord Tone Soloing?',
            contentMarkdown: `
### Por Que Solistas de Alto Nível Parecem Conhecer o Futuro?

Um guitarrista iniciante toca a mesma escala o tempo todo e espera que ela funcione.
Um **solista de conservatório** escuta os acordes da base e faz a guitarra pousar **na nota mais forte do acorde que acabou de entrar**:

\`\`\`
Progressão Clássica em Lá Menor:
| Am (1º grau) | Dm (4º grau) | Em (5º grau) | Am (1º grau) |

Notas de Cada Acorde (Tríades):
* Am : A (Fundamental)  — C (Terça Menor)  — E (Quinta)
* Dm : D (Fundamental)  — F (Terça Menor)  — A (Quinta)
* Em : E (Fundamental)  — G (Terça Menor)  — B (Quinta)
\`\`\`

> 🎯 **A Regra de Ouro do Chord Tone:**
> Quando o acompanhamento muda para **Dm**, se você pousar com vibrato na nota **Fá (F)** ou **Ré (D)**, o solo parecerá ter sido composto sob medida para aquele compasso!
            `
          },
          {
            id: 'sl15-p2',
            title: '2. Mapeamento Visual dos Chord Tones na Posição 1',
            contentMarkdown: `
### As Notas-Alvo nos 3 Acordes Principais:
1. **Sobre o acorde Am:** Pouse em **Lá (casa 7 da 4ª corda ou casa 5 da 1ª corda)**.
2. **Sobre o acorde Dm:** Pouse em **Ré (casa 7 da 3ª corda)** ou **Fá (casa 6 da 2ª corda)**.
3. **Sobre o acorde Em:** Pouse em **Mi (casa 9 da 3ª corda ou casa 5 da 2ª corda)**.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 3, fret: 7, label: 'Am: Lá (1)' },
                { stringIndex: 2, fret: 5, label: 'Am: Dó (3)' },
                { stringIndex: 2, fret: 7, label: 'Dm: Ré (1)' },
                { stringIndex: 1, fret: 6, label: 'Dm: Fá (3)' },
                { stringIndex: 1, fret: 5, label: 'Em: Mi (1)' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          // Sobre Am
          { freq: 220.00, duration: 1.0 },
          // Sobre Dm
          { freq: 293.66, duration: 1.0 },
          // Sobre Em
          { freq: 329.63, duration: 1.0 },
          // Resolução em Am
          { freq: 440.00, duration: 1.5 },
        ],
        practicalExercise: {
          id: 'ex-solo-15',
          title: 'Exercício Guiado de Conexão Harmônica Am → Dm → Em → Am',
          subtitle: 'Linha melódica de 4 compassos pousando no Chord Tone exato de cada acorde',
          targetBpm: 70,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ com marcação no tempo 1 de cada acorde',
          notesSequence: [
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 }, // Am
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 }, // Dm
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 }, // Em
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 }, // Am final
          ],
          tablatureText: `
[ Compasso 1: Acorde Am ]
4ª D|---7~~~~~-------------------| (Alvo: Nota A - Fundamental de Am)

[ Compasso 2: Acorde Dm ]
3ª G|-----------7~~~~~-----------| (Alvo: Nota D - Fundamental de Dm)

[ Compasso 3: Acorde Em ]
2ª B|-------------------5~~~~~---| (Alvo: Nota E - Fundamental de Em)

[ Compasso 4: Acorde Am (Resolução Final) ]
1ª e|----------------------------5~~~~~---| (Alvo: Nota A Aguda)
          `,
          instructions: [
            'Escute a mudança de harmonia no metrônomo/base.',
            'No exato primeiro tempo do compasso 2 (entrada do Dm), ataque a nota Ré (casa 7 da 3ª corda).',
            'No tempo 1 do compasso 3 (entrada do Em), ataque a nota Mi (casa 5 da 2ª corda).',
            'No compasso 4, conclua no Lá agudo da 1ª corda.',
            'Observe como a melodia parece "colar" na harmonia com perfeição cirúrgica.'
          ],
          biomechanicTips: [
            'Mantenha a mão relaxada: o foco está na escuta ativa da troca harmônica.'
          ],
          validationCriteria: 'Acertar a nota-alvo no tempo 1 de cada um dos 4 compassos da progressão sem hesitar a 70 BPM.'
        },
        speedGoals: {
          startingBpm: 55,
          intermediateBpm: 70,
          targetBpm: 85
        },
        commonErrors: [
          {
            issue: 'Tocar a nota-alvo adiantada ou atrasada em relação ao clique do compasso.',
            solution: 'O Chord Tone tem impacto máximo quando cai exatamente no tempo 1 junto com o baixo e a bateria.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Solo que Delineia Acordes no Estilo Santana',
          tab: `
3ª G|---5h7~~~~~---| (Sobre Am)
2ª B|---6~~~~~-----| (Sobre Dm - Terça Fá mágica)
          `,
          description: 'A marca registrada de Carlos Santana em Europa e Black Magic Woman: enfatizar a terça menor do Dm (Fá) para arrepiar o ouvinte.'
        },
        challenge: {
          title: 'Desafio Prático: Mirando na Terça Menor (C no Am e F no Dm)',
          description: 'Em vez de tocar a fundamental de cada acorde, toque a TERÇA: pouse no Dó (casa 5 da 3ª corda) no Am e no Fá (casa 6 da 2ª corda) no Dm.',
          instruction: 'Sinta como a terça é muito mais doce e emotiva do que a própria fundamental.'
        },
        masteryCriteria: {
          learning: 'Toca a escala sem prestar atenção nos acordes que estão passando no fundo.',
          consolidating: 'Alcança as notas-alvo no tempo 1 com boa coerência na maioria dos compassos.',
          mastered: 'Delineia a harmonia com fluidez total, alternando entre fundamentais e terças expressivas a 75+ BPM.'
        },
        reviewNotes: 'Na Aula 16, aprenderemos como amarrar essas notas-alvo dentro de motivos melódicos coesos através de Repetição e Variação.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl15-q1',
              question: 'Qual é a nota da tríade de Dó Menor/Ré Menor que traz a maior expressividade ao entrar o acorde Dm?',
              options: ['F (Fá - Terça Menor de Dm)', 'G (Sol)', 'B (Si)', 'E (Mi)'],
              correctIndex: 0,
              explanation: 'A terça menor de Dm é Fá (F). Ela define o modo menor do acorde e conecta a melodia à harmonia com perfeição.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-16',
        level: 4,
        stage: 4,
        moduleTitle: 'Etapa 4 — Teoria Aplicada e Improvisação',
        lessonNumber: 16,
        title: 'Aula 16 — Construção de Frases e Motivos Melódicos',
        subtitle: 'Criação de motivos temáticos, variação rítmica, inversão melódica e narrativa do solo',
        objective: 'Desenvolver a habilidade de criar um motivo melódico marcante de poucas notas e desdobrá-lo por meio de variação rítmica e direcional, transformando exercícios mecânicos em composições memoráveis.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 6 — Criando frases', 'Aula 15 — Solando sobre acordes.'],
        parts: [
          {
            id: 'sl16-p1',
            title: '1. O Poder do Motivo Musical',
            contentMarkdown: `
### Por que Algumas Músicas Ficam Gravadas na Memória para Sempre?

A 5ª Sinfonia de Beethoven é toda construída sobre um motivo de quatro notas: **"Tchã-tchã-tchã-tchaaam"**.
O riff de *Smoke on the Water* do Deep Purple é um motivo de quatro notas.
O solo de *Hotel California* dos Eagles é uma série de motivos que conversam entre si.

#### As Três Técnicas de Variação de um Motivo:
1. **Repetição Rítmica com Variação de Altura:** Tocar o mesmo padrão de ritmo, mas começando em uma nota diferente.
2. **Alongamento / Aceleração:** Tocar a mesma melodia em semínimas (lenta) e depois acelerar para semicolcheias.
3. **Inversão de Direção:** Se a frase original subia (grave → agudo), a resposta desce (agudo → grave).
            `
          },
          {
            id: 'sl16-p2',
            title: '2. Arquitetura da Narrativa Melódica',
            contentMarkdown: `
### As Quatro Fases de Uma Frase Bem Construída:
1. **Afirmação (Statement):** Apresente o motivo curto com clareza.
2. **Confirmação (Re-statement):** Repita o motivo para o público assimilar.
3. **Desenvolvimento (Departure):** Mude a direção ou estique o ritmo gerando expectativa.
4. **Resolução (Arrival):** Desça para a nota-alvo com vibrato definitivo.
            `
          }
        ],
        demonstrationAudioNotes: [
          // Motivo Original
          { freq: 220.00, duration: 0.25 },
          { freq: 261.63, duration: 0.25 },
          { freq: 293.66, duration: 0.5 },
          // Variação
          { freq: 220.00, duration: 0.25 },
          { freq: 261.63, duration: 0.25 },
          { freq: 329.63, duration: 0.5 },
          // Resolução
          { freq: 293.66, duration: 0.25 },
          { freq: 261.63, duration: 0.25 },
          { freq: 220.00, duration: 1.2 },
        ],
        practicalExercise: {
          id: 'ex-solo-16',
          title: 'Exercício de Desenvolvimento Temático em 3 Variações',
          subtitle: 'Apresentação de um motivo de 3 notas com desdobramento melódico',
          targetBpm: 75,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ expressivo',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 },
            { stringNumber: 2, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 5 },
            { stringNumber: 2, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 },
          ],
          tablatureText: `
[ Motivo 1: A Ideia Inicial ]
3ª G|---7-------|
2ª B|-------5---|---7~~~~~---|
Notas:  A   C       D (Sustenta)

[ Motivo 2: A Variação Elevada ]
3ª G|---7-------|
2ª B|-------5---|---8/10~~~~~---| (Mesmo ritmo, nota final sobe!)
Notas:  A   C       A Agudo

[ Motivo 3: A Conclusão Resolutiva ]
2ª B|---8---5---|
3ª G|-----------|---7p5---5~~~~~---|
4ª D|-----------|-------7----------|
Notas:  G   E       D C A
          `,
          instructions: [
            'Toque o Motivo 1 e sinta a pergunta.',
            'Toque o Motivo 2: observe como o ouvinte reconhece o início idêntico (Lá-Dó), mas se surpreende com o slide para o Lá agudo.',
            'Conclua com o Motivo 3 descendo até o repouso na tônica.',
            'Pratique até o encadeamento soar fluido e natural como uma história contada.'
          ],
          biomechanicTips: [
            'Mantenha a palhetada leve para que a atenção se concentre na dinâmica da melodia.'
          ],
          validationCriteria: 'Executar as 3 variações mantendo a coerência temática e o ritmo perfeito a 75 BPM.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 75,
          targetBpm: 90
        },
        commonErrors: [
          {
            issue: 'Mudar totalmente de notas a cada compasso, sem nenhuma repetição temática.',
            solution: 'Repetição com pequena variação é a chave de toda grande música. Não tenha medo de repetir o seu motivo!'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Fraseado Temático de Brian May (Queen)',
          tab: `
2ª B|---5-7-7-5---|---5-7-8-7-5---|
          `,
          description: 'A maestria de Brian May em Bohemian Rhapsody reside no uso rigoroso de motivos melódicos estruturados como hinos.'
        },
        challenge: {
          title: 'Desafio Prático: O Solo de 8 Compassos com 1 Único Motivo',
          description: 'Crie uma ideia melódica de 4 notas. Toque um solo de 8 compassos inteiros variando apenas esse motivo.',
          instruction: 'Avalie se o solo soa coeso e memorável.'
        },
        masteryCriteria: {
          learning: 'Toca notas soltas sem conseguir estabelecer uma ideia temática reconhecível.',
          consolidating: 'Desenvolve motivos com repetição e variação audível a 70 BPM.',
          mastered: 'Compõe e improvisa temas musicais marcantes com fluidez estrutural e refinamento melódico a 80+ BPM.'
        },
        reviewNotes: 'Sensacional! Entramos agora na Etapa Final: Etapa 5 — Construção e Execução de Solos Completos!',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl16-q1',
              question: 'Qual é o benefício de repetir um motivo com pequena variação no solo?',
              options: ['Gera identificação imediata e conexão emocional com o ouvinte', 'Faz o solo parecer mais difícil', 'Economiza palhetada', 'Aumenta o volume da guitarra'],
              correctIndex: 0,
              explanation: 'A mente humana reconhece a repetição como padrão melódico e se emociona quando esse padrão varia com intenção.'
            }
          ]
        }
      }
    ]
  },

  // -----------------------------------------------------------------------
  // ETAPA 5 — CONSTRUÇÃO E EXECUÇÃO DE SOLOS (Aulas 17 a 20)
  // -----------------------------------------------------------------------
  {
    id: 'stage-5',
    stageNumber: 5,
    title: 'ETAPA 5 — CONSTRUÇÃO E EXECUÇÃO DE SOLOS',
    subtitle: 'Linguagem Blues/Rock, arquitetura do solo completo, improvisação orientada e solo de formatura',
    badge: 'Maestria & Solos',
    description: 'A consagração da sua formação musical. Integre todos os fundamentos, escalas, técnicas expressivas e conceitos harmônicos para planejar, improvisar e executar solos de guitarra completos e emocionantes do início ao fim.',
    lessons: [
      {
        id: 'solo-lesson-17',
        level: 5,
        stage: 5,
        moduleTitle: 'Etapa 5 — Construção e Execução de Solos',
        lessonNumber: 17,
        title: 'Aula 17 — Vocabulário de Blues e Rock: Licks Clássicos',
        subtitle: 'A Blue Note (♭5), Unison Bends, Double Stops e a linguagem autêntica da guitarra solo',
        objective: 'Dominar os licks e recursos essenciais da linguagem de blues e rock clássico (incluindo a Blue Note na 3ª corda casa 8, bends em uníssono e double stops), aplicando-os com atitude e timing preciso.',
        estimatedMinutes: 30,
        prerequisites: ['Aula 9 — Bends', 'Aula 12 — Combinando técnicas.'],
        parts: [
          {
            id: 'sl17-p1',
            title: '1. A Blue Note (O Segredo da Escala Blues)',
            contentMarkdown: `
### A Nota Mais "Safada" e Expressiva do Século XX

Ao adicionar a **Quinta Diminuta (♭5)** à Pentatônica Menor, obtemos a **Escala Blues (Hexatônica)**:
\`\`\`
Fórmula Blues:    1 — ♭3 — 4 — ♭5 (Blue Note) — 5 — ♭7
Lá Blues:         A — C  — D —     D#        — E — G
\`\`\`

Na Posição 1 na 5ª casa:
* A Blue Note **D#** está localizada na **3ª corda, casa 8** (e na 5ª corda, casa 6).
* Ela cria uma tensão irresistível ao passar de Ré (casa 7) para Mi (casa 9) ou deslizar de volta para Ré.
            `
          },
          {
            id: 'sl17-p2',
            title: '2. Unison Bends e Double Stops',
            contentMarkdown: `
### Duas Armas Poderosas de Acentuação:
1. **Double Stop:** Tocar duas cordas simultâneas (ex: casas 5 da 1ª e 2ª corda com pestana do dedo 1) para gerar agressividade percussiva como Chuck Berry e Jimi Hendrix.
2. **Unison Bend:** Tocar uma nota na 1ª corda (casa 5 = Lá) e dar um bend de 1 tom na 2ª corda (casa 8 = Sol→Lá), fazendo as duas cordas vibrarem no mesmo pitch com atrito harmônico rascante.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 2, fret: 8, label: 'D# (Blue Note!)' },
                { stringIndex: 1, fret: 8, label: 'Bend G→A' },
                { stringIndex: 0, fret: 5, label: 'A (Uníssono)' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 293.66, duration: 0.2 },
          { freq: 311.13, duration: 0.3 }, // Blue note D#
          { freq: 329.63, duration: 0.6 }, // E
          { freq: 440.00, duration: 1.2 }, // Uníssono
        ],
        practicalExercise: {
          id: 'ex-solo-17',
          title: 'Exercício de Vocabulário Blues-Rock com Blue Note e Double Stop',
          subtitle: 'Sequência de lick clássico com passagem cromática e fechamento em uníssono',
          targetBpm: 75,
          targetRepetitions: 10,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: '↓ ↑ com ataque percussivo',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 },
            { stringNumber: 3, noteCipher: 'D#', notePt: 'Ré#', pickDirection: 'up', fret: 8 }, // Blue Note
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 5 },
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 },
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 }, // Double stop
          ],
          tablatureText: `
1ª e|---------------------------------|--5-5---5-5~~~---| (Double stop 1ª e 2ª cordas)
2ª B|---------------------------------|--5-5---5-5~~~---|
3ª G|---7---8p7p5-------7~~~~~~~~-----|-----------------|
4ª D|---------------7-----------------|-----------------|
Notas:  D   D# D C  A   D (Blue Note!)   A/E   A/E
          `,
          instructions: [
            'Palhete a casa 7 da 3ª corda e faça o slide/pull-off rápido pela casa 8 (Blue Note).',
            'Sinta o sabor blues instantâneo que a nota D# adiciona.',
            'No compasso 2, deite o dedo 1 em mini-pestana nas casas 5 da 1ª e 2ª corda e palhete ambas juntas duas vezes.',
            'Aplique atitude e dinâmica enérgica.'
          ],
          biomechanicTips: [
            'No double stop, incline ligeiramente o dedo 1 para pressionar as duas cordas com a lateral da falange sem perder sustentação.'
          ],
          validationCriteria: 'Executar o lick com a Blue Note limpa e o double stop rítmico cravado no tempo a 75 BPM.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 75,
          targetBpm: 90
        },
        commonErrors: [
          {
            issue: 'Parar e sustentar a Blue Note por muito tempo como se fosse uma nota de repouso.',
            solution: 'A Blue Note é uma nota de passagem rápida. Ela brilha quando desliza de ou para o Ré e Mi.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Lick de Abertura de Chuck Berry / Jimi Hendrix',
          tab: `
1ª e|-------5-------5---|
2ª B|-------5-------5---|
3ª G|---7b9-----7b9-----|
          `,
          description: 'A introdução de Johnny B. Goode e licks icônicos de Hendrix em Voodoo Child são a consagração máxima deste padrão.'
        },
        challenge: {
          title: 'Desafio Prático: O Unison Bend em Lá',
          description: 'Segure a casa 5 na 1ª corda com o dedo 1. Com os dedos 2 e 3, empurre a casa 8 da 2ª corda até igualar o pitch exato da 1ª corda.',
          instruction: 'Ouça o efeito de "chorus" rascante quando as duas notas se encontram afinadas.'
        },
        masteryCriteria: {
          learning: 'A Blue Note soa desajeitada e o double stop esbarra nas cordas vizinhas.',
          consolidating: 'Toca os licks de blues-rock com boa atitude e afinação a 70 BPM.',
          mastered: 'Domina o vocabulário autêntico de blues/rock com pegada profissional, uníssono afinado e swing rítmico a 80+ BPM.'
        },
        reviewNotes: 'Na Aula 18, utilizaremos todo este vocabulário para aprender a projetar a Arquitetura de um Solo Completo (Começo, Meio, Clímax e Fim).',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl17-q1',
              question: 'Qual é a nota e a casa da Blue Note na Posição 1 de Lá Menor?',
              options: ['D# (Ré#) na 3ª corda, casa 8', 'F# na 2ª corda, casa 7', 'C# na 3ª corda, casa 6', 'G# na 1ª corda, casa 4'],
              correctIndex: 0,
              explanation: 'A Blue Note em Lá é o Ré# (5ª diminuta), localizada na 3ª corda na casa 8.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-18',
        level: 5,
        stage: 5,
        moduleTitle: 'Etapa 5 — Construção e Execução de Solos',
        lessonNumber: 18,
        title: 'Aula 18 — Construindo um Solo Completo: A Arquitetura em 4 Atos',
        subtitle: 'Introdução, Desenvolvimento, Clímax na oitava superior e Resolução conclusiva',
        objective: 'Planejar e estruturar um solo de guitarra de 16 compassos como uma narrativa coerente em 4 atos, controlando densidade de notas, intensidade emocional e pico dramático.',
        estimatedMinutes: 30,
        prerequisites: ['Aula 16 — Construção de frases', 'Aula 17 — Vocabulário Blues/Rock.'],
        parts: [
          {
            id: 'sl18-p1',
            title: '1. A Estrutura dos 4 Atos de um Grande Solo',
            contentMarkdown: `
### Por que Muitos Solos Começam Bem e se Perdem no Caminho?

Um solo não deve ser uma colcha de retalhos de licks aleatórios. Ele deve seguir uma curva dramática que prenda a respiração do ouvinte:

\`\`\`
          [ ATO 3: CLÍMAX ]
          Bends Altos, Alta Energia, Oitava Superior
                /\\
               /  \\
 [ ATO 2: DESENVOLVIMENTO ]  \\
 Variações, Notas Rápidas     \\
         /                     \\  [ ATO 4: RESOLUÇÃO ]
        /                       \\ Desce para o repouso na tônica
 [ ATO 1: INTRODUÇÃO ]           \\ Vibrato conclusivo
 Frase Curta, Espaçada
\`\`\`

1. **Ato 1 (Compassos 1-4) — O Tema de Entrada:** Poucas notas, registro médio-grave, pausas generosas. Estabeleça o motivo principal.
2. **Ato 2 (Compassos 5-8) — O Desenvolvimento:** Acelere ligeiramente a densidade de notas (subdivisões em semicolcheias, legato).
3. **Ato 3 (Compassos 9-12) — O Clímax:** Suba para as casas agudas (acima da casa 12), use bends cheios de 1 tom e máxima intensidade.
4. **Ato 4 (Compassos 13-16) — A Resolução:** Desça a melodia gradualmente até a tônica fundamental com vibrato glorioso e repouso.
            `
          },
          {
            id: 'sl18-p2',
            title: '2. O Controle de Densidade (Quando Não Tocar)',
            contentMarkdown: `
### Menos é Mais no Lugar Certo

* Se você começar o solo no volume máximo e na velocidade mais rápida na primeira casa que encostar, você **não terá para onde crescer**.
* Deixe o clímax guardado para os compassos 9 a 12. O ouvinte sentirá o impacto da catarse musical com muito mais força.
            `
          }
        ],
        demonstrationAudioNotes: [
          // Ato 1
          { freq: 220.00, duration: 0.8 },
          // Ato 2
          { freq: 261.63, duration: 0.3 },
          { freq: 293.66, duration: 0.3 },
          // Ato 3 Clímax
          { freq: 440.00, duration: 0.3 },
          { freq: 523.25, duration: 1.0 }, // Bend agudo
          // Ato 4 Resolução
          { freq: 440.00, duration: 1.5 },
        ],
        practicalExercise: {
          id: 'ex-solo-18',
          title: 'Exercício de Execução da Curva Narrativa de 16 Compassos',
          subtitle: 'Passagem guiada pelos 4 atos sobre base harmônica em Lá Menor',
          targetBpm: 75,
          targetRepetitions: 8,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dinâmica crescente (p → mf → f → ff → mf)',
          notesSequence: [
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 }, // Ato 1
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 }, // Ato 2
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 17 }, // Ato 3 Clímax
            { stringNumber: 2, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 10 }, // Ato 4
          ],
          tablatureText: `
[ ATO 1: Entrada Contida - Compassos 1 a 4 ]
4ª D|---7~~~~~-------|-------5h7~~~~~---|

[ ATO 2: Desenvolvimento - Compassos 5 a 8 ]
3ª G|---5h7p5---5/9--|---8/10~~~~~------|
2ª B|---------7------|------------------|

[ ATO 3: O CLÍMAX MÁXIMO - Compassos 9 a 12 ]
1ª e|---15b17~~~~~---|---15p12----------|
2ª B|----------------|---------15b17~~~~|

[ ATO 4: Resolução Triunfante - Compassos 13 a 16 ]
2ª B|---10~~~~~------|
3ª G|-----------9\\7--|---5--------------|
4ª D|----------------|-------7~~~~~-----| (Repouso Final em A)
          `,
          instructions: [
            'Compassos 1-4: Toque com leveza e deixe espaço.',
            'Compassos 5-8: Deslize pelas casas médias e aumente o dinamismo com legato.',
            'Compassos 9-12: Ataque o bend na casa 15 da 1ª corda (alcançando o Mi da 17ª casa) com intensidade total.',
            'Compassos 13-16: Conduza as notas de volta para a casa 7 da 4ª corda e termine com um vibrato sustentado.'
          ],
          biomechanicTips: [
            'Planeje a troca de posição da mão: o salto para a 15ª casa deve ser feito com o olhar fixado no traste de destino antes do dedo pular.'
          ],
          validationCriteria: 'Executar os 4 atos com curva dinâmica clara, clímax audível e resolução no tempo correto a 75 BPM.'
        },
        speedGoals: {
          startingBpm: 60,
          intermediateBpm: 75,
          targetBpm: 90
        },
        commonErrors: [
          {
            issue: 'Tocar o tempo todo no mesmo volume e na mesma velocidade.',
            solution: 'Use a dinâmica: toque o início suavemente (volume baixo da palhetada) e ataque com força apenas no Ato 3.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: A Estrutura de Stairway to Heaven e Hotel California',
          tab: `
Estrutura: Intro lírica → Frases articuladas → Bends duplos no topo → Fechamento harmônico
          `,
          description: 'Todos os solos eleitos como os melhores de todos os tempos seguem rigorosamente a estrutura em 4 atos.'
        },
        challenge: {
          title: 'Desafio Prático: Desenhe o Mapa Gráfico do seu Solo',
          description: 'Em uma folha de papel, desenhe a curva de intensidade do seu solo em 16 compassos antes de tocar.',
          instruction: 'Execute o solo olhando para o seu mapa e veja como a intenção guia a técnica.'
        },
        masteryCriteria: {
          learning: 'Toca fragmentos desconectados sem percepção de começo, clímax ou fim.',
          consolidating: 'Constrói os 4 atos de forma reconhecível com bom controle de energia a 70 BPM.',
          mastered: 'Domina a narrativa do solo com arquitetura impecável, clímax impactante e resolução majestosa a 80+ BPM.'
        },
        reviewNotes: 'Na Aula 19, colocaremos essa arquitetura à prova em tempo real com a Improvisação Orientada.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl18-q1',
              question: 'Em qual parte de um solo de 16 compassos deve ocorrer o Clímax de intensidade?',
              options: ['No Ato 3 (Compassos 9 a 12), após o desenvolvimento melódico', 'No primeiro compasso', 'Nos últimos dois segundos', 'Nunca deve haver clímax'],
              correctIndex: 0,
              explanation: 'O clímax nos compassos 9-12 aproveita a tensão acumulada nos atos anteriores para causar impacto máximo no ouvinte.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-19',
        level: 5,
        stage: 5,
        moduleTitle: 'Etapa 5 — Construção e Execução de Solos',
        lessonNumber: 19,
        title: 'Aula 19 — Improvisação Orientada em Três Fases',
        subtitle: 'Improvisação em tempo real com restrições criativas: ritmo, notas-alvo e expressividade livre',
        objective: 'Improvisar sobre um playback de acompanhamento musical em tempo real, aplicando o método de 3 fases progressivas que elimina o bloqueio criativo e garante coerência melódica.',
        estimatedMinutes: 30,
        prerequisites: ['Aula 15 — Solando sobre acordes', 'Aula 18 — Construindo um solo completo.'],
        parts: [
          {
            id: 'sl19-p1',
            title: '1. O Mito da Improvisação Caótica',
            contentMarkdown: `
### Improvisar Não É "Tocar Qualquer Nota e Rezar"

Muitos guitarristas travam ao tentar improvisar porque encaram o braço da guitarra como um mar infinito de opções. O segredo dos grandes improvisadores é o uso de **restrições deliberadas**:

#### O Método das 3 Fases de Treino:
1. **Fase A (Apenas 3 Notas — Foco no Ritmo):** Escolha apenas 3 notas (ex: Lá, Dó e Ré). O desafio é fazer música bonita variando apenas o ritmo, pausas e dinâmicas.
2. **Fase B (Mapeamento Harmônico — Foco nas Notas-Alvo):** Use a pentatônica inteira, mas com o compromisso de mirar nos Chord Tones a cada troca de acorde.
3. **Fase C (Expressão Total — Técnicas Liberadas):** Libere bends, slides, legatos e vibrato com a arquitetura em 4 atos aprendida na Aula 18.
            `
          },
          {
            id: 'sl19-p2',
            title: '2. A Matriz de Autoavaliação do Improviso',
            contentMarkdown: `
### Os Três Critérios Observáveis de Avaliação:
* **Critério 1 (Tempo):** O solo balançou ou atropelou o clique da bateria?
* **Critério 2 (Afinação):** Os bends e notas sustentadas soaram em harmonia pura?
* **Critério 3 (Espaço):** Houve pausas suficientes para o solo respirar?
            `
          }
        ],
        demonstrationAudioNotes: [
          { freq: 220.00, duration: 0.5 },
          { freq: 261.63, duration: 0.25 },
          { freq: 293.66, duration: 0.5 },
          { freq: 329.63, duration: 0.5 },
          { freq: 440.00, duration: 1.5 },
        ],
        practicalExercise: {
          id: 'ex-solo-19',
          title: 'Exercício de Improvisação Guiada em 3 Fases sobre Base em Am',
          subtitle: 'Sessão prática cronometrada com alternância de restrições melódicas',
          targetBpm: 75,
          targetRepetitions: 8,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Livre e expressivo',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 },
            { stringNumber: 2, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 5 },
            { stringNumber: 2, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 },
          ],
          tablatureText: `
[ Fase A: 1º Minuto - Apenas Notas A, C, D ]
3ª G|---7~~~~~-------5---7---|---5-------------------|
2ª B|------------5-----------|-------7~~~~~----------|
Foco: Espaço, pausas e groove rítmico

[ Fase B: 2º Minuto - Adiciona Notas-Alvo nos Acordes ]
Am → Mira em A | Dm → Mira em D ou F | Em → Mira em E

[ Fase C: 3º Minuto - Expressão Total ]
Bends de 1 tom, legato rápido, slides e vibrato no clímax!
          `,
          instructions: [
            'Ligue a base ou metrônomo em 75 BPM.',
            'Minuto 1: Toque APENAS nas notas das casas 5 e 7 da 3ª e 2ª cordas. Crie ritmo.',
            'Minuto 2: Expanda para as notas-alvo dos acordes da harmonia.',
            'Minuto 3: Aplique a arquitetura dos 4 atos com clímax expressivo.',
            'Grave a sessão e escute atentamente.'
          ],
          biomechanicTips: [
            'Não olhe fixamente para as mãos: sinta a posição e confie na memória motora construída nas aulas anteriores.'
          ],
          validationCriteria: 'Completar os 3 minutos de improvisação sem perder o andamento e respeitando as restrições de cada fase.'
        },
        speedGoals: {
          startingBpm: 65,
          intermediateBpm: 75,
          targetBpm: 90
        },
        commonErrors: [
          {
            issue: 'Tentar tocar rápido logo no primeiro compasso por ansiedade.',
            solution: 'Comece calmo. Lembre-se da Fase 1: apenas 3 notas com espaço constroem uma entrada muito mais impressionante.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Improviso ao Vivo no Palco',
          tab: `
Aplicação: Playback Am - F - C - G | Improviso fluido com intenção
          `,
          description: 'A habilidade de improvisar ao vivo sobre qualquer base é a marca registrada do guitarrista profissional independente.'
        },
        challenge: {
          title: 'Desafio Prático: O Solo sem Olhar para a Escala',
          description: 'Feche os olhos ou olhe para cima durante todo o Minuto 1 da improvisação.',
          instruction: 'Conecte-se com o instrumento pelo tato e pelo ouvido.'
        },
        masteryCriteria: {
          learning: 'Trava ao tentar improvisar sem uma partitura ou tablatura pronta.',
          consolidating: 'Improvisa frases coerentes respeitando as fases e o andamento a 70 BPM.',
          mastered: 'Improvisa com total liberdade, musicalidade orgânica, narrativa coesa e pegada profissional a 80+ BPM.'
        },
        reviewNotes: 'Chegamos ao grande momento! Na Aula 20, você comporá e executará o seu Projeto Final de Formatura.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl19-q1',
              question: 'Por que limitar-se a apenas 3 notas na Fase A melhora a qualidade do improviso?',
              options: ['Porque obriga o cérebro a focar no ritmo, dinâmica e pausas em vez de enfileirar notas', 'Porque a guitarra só tem 3 cordas boas', 'Porque notas demais desafinam o instrumento', 'Para tocar mais devagar'],
              correctIndex: 0,
              explanation: 'A restrição melódica força o desenvolvimento da criatividade rítmica e expressiva, eliminando a dependência mecânica da escala.'
            }
          ]
        }
      },
      {
        id: 'solo-lesson-20',
        level: 5,
        stage: 5,
        moduleTitle: 'Etapa 5 — Construção e Execução de Solos',
        lessonNumber: 20,
        title: 'Aula 20 — Projeto Final: Composição e Execução do Solo de Formatura',
        subtitle: 'Criação autoral de 16 compassos, tablatura completa, autoavaliação com rubrica e maestria',
        objective: 'Compor, refinar e executar com precisão profissional um solo autoral completo de 16 compassos em Lá Menor, aplicando as técnicas de bend, legato, vibrato, notas-alvo e dinâmica com avaliação por rubrica de domínio.',
        estimatedMinutes: 35,
        prerequisites: ['Conclusão das Aulas 1 a 19 da Formação em Guitarra Solo.'],
        parts: [
          {
            id: 'sl20-p1',
            title: '1. O Solo de Formatura: "The Ascension Solo" (16 Compassos)',
            contentMarkdown: `
### Parabéns, Guitarrista! Você Chegou ao Projeto Final!

Este solo de formatura sintetiza toda a sua jornada pedagógica ao longo das 20 aulas:
* **Compassos 1-4 (Ato 1):** O tema de entrada com motivos curtos e respiração.
* **Compassos 5-8 (Ato 2):** Desenvolvimento melódico com legato, slides e passagem pela escala menor natural.
* **Compassos 9-12 (Ato 3):** O Clímax triunfante com bends de 1 tom na 15ª casa e Blue Note ardente.
* **Compassos 13-16 (Ato 4):** Resolução majestosa pousando no Lá fundamental com vibrato cantado.

#### A Progressão Harmônica de Fundo (Backing Track em Am):
\`\`\`
| Am     | Dm     | Am     | Em     |  (Ato 1)
| Am     | Dm     | F      | G      |  (Ato 2)
| Am     | Dm     | F      | Em     |  (Ato 3 - Clímax)
| Dm     | Em     | Am     | Am     |  (Ato 4 - Resolução)
\`\`\`
            `
          },
          {
            id: 'sl20-p2',
            title: '2. A Rubrica Oficial de Avaliação de Maestria',
            contentMarkdown: `
### Os 5 Pilares de Avaliação de Domínio:
1. **Precisão Rítmica (20 pts):** As notas caíram no tempo cravado do metrônomo/base?
2. **Afinação dos Bends (20 pts):** Os bends de 1 tom atingiram a nota exata sem desafinar?
3. **Limpeza e Ruído (20 pts):** As cordas adjacentes permaneceram em silêncio graças ao abafamento correto?
4. **Articulação e Expressividade (20 pts):** O vibrato foi estável e os legatos tiveram volume homogêneo?
5. **Narrativa e Estrutura (20 pts):** O solo teve começo, meio, clímax e fim emocionantes?

> 🏆 **Critério para Domínio:** Pontuação $\\ge 85$ pontos nesta autoavaliação guiada.
            `,
            fretboardHighlight: {
              frets: [
                { stringIndex: 3, fret: 7, label: 'A (Tema 1)' },
                { stringIndex: 2, fret: 5, label: 'C (Tema 1)' },
                { stringIndex: 2, fret: 7, label: 'Bend 1 Tom' },
                { stringIndex: 1, fret: 10, label: 'A (Ato 2)' },
                { stringIndex: 0, fret: 15, label: 'Bend Clímax 15b17' },
                { stringIndex: 0, fret: 17, label: 'Target Pitch' },
              ]
            }
          }
        ],
        demonstrationAudioNotes: [
          { freq: 220.00, duration: 0.6 },
          { freq: 261.63, duration: 0.3 },
          { freq: 293.66, duration: 0.3 },
          { freq: 329.63, duration: 0.8 },
          { freq: 392.00, duration: 0.3 },
          { freq: 440.00, duration: 0.6 },
          { freq: 587.33, duration: 1.2 }, // Clímax
          { freq: 440.00, duration: 2.0 }, // Resolução
        ],
        practicalExercise: {
          id: 'ex-solo-20',
          title: 'Execução Integral do Solo de Formatura: "The Ascension Solo"',
          subtitle: 'Solo de 16 compassos completo em 4 atos com todas as técnicas combinadas',
          targetBpm: 80,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Articulação dinâmica completa (p → f → ff → mf)',
          notesSequence: [
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 7 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 5 },
            { stringNumber: 3, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 7 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 5 },
            { stringNumber: 2, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 10 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 12 },
            { stringNumber: 1, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 17 },
          ],
          tablatureText: `
=======================================================================
GUITAR ACADEMY — THE ASCENSION SOLO (Solo de Formatura em Lá Menor)
Andamento: 80 BPM | Compasso: 4/4 | Tom: Am
=======================================================================

[ ATO 1: O Chamado Temático — Compassos 1 a 4 ]
4ª D|---/7~~~~~~~~--------|-------------------|-------5h7~~~~~~~~-|-------------------|
3ª G|-----------------5---|---7b9-r7-p5---5~--|---5h7-------------|-------------------|
2ª B|---------------------|-------------7-----|-------------------|-------------------|
Acomp:  Am                    Dm                  Am                  Em

[ ATO 2: O Desenvolvimento em Legato — Compassos 5 a 8 ]
3ª G|---5h7p5---5/9~~~~---|---8/10~~~~~~~~----|-------------------|-------------------|
2ª B|---------7-----------|-------------------|---8-10-8-10b12~~~~|---10~~~~~~~~------|
1ª e|---------------------|-------------------|-------------------|-------------------|
Acomp:  Am                    Dm                  F                   G

[ ATO 3: O CLÍMAX TRIUNFANTE — Compassos 9 a 12 ]
1ª e|---12h15p12----15b17~|---15b17~~~-15p12--|-------12-15-12----|---17~~~~~~~~------|
2ª B|------------15-------|-------------------|---15b17--------15-|-------------------|
Acomp:  Am                    Dm                  F                   Em

[ ATO 4: A Grande Resolução — Compassos 13 a 16 ]
1ª e|---15\\12-------------|-------------------|-------------------|-------------------|
2ª B|---------13----------|---12h13p12--------|-------------------|-------------------|
3ª G|------------14~~~~---|------------14-12--|---14~~~~~~~~------|-------------------|
4ª D|---------------------|-------------------|-------------------|---7~~~~~~~~-------|
Acomp:  Dm                    Em                  Am                  Am (Final Solene)
=======================================================================
          `,
          instructions: [
            'Configure o metrônomo para 70 BPM para a primeira passada limpa.',
            'Concentre-se na narrativa: sinta a transição suave do Ato 1 para a intensidade vibrante do Ato 3.',
            'No compasso 10, execute o bend da 15ª casa para a 17ª com força dos 3 dedos unidos e vibrato majestoso.',
            'Finalize no compasso 16 pousando na tônica Lá da 4ª corda casa 7 com relaxamento total e sentimento de dever cumprido.'
          ],
          biomechanicTips: [
            'Celebre cada nota: toque como se estivesse no palco de um grande teatro.',
            'Respire profundamente antes de iniciar e mantenha a postura ereta e relaxada.'
          ],
          validationCriteria: 'Executar o solo completo de 16 compassos a 80 BPM com afinação precisa nos bends, sincronia das mãos e expressividade contagiante.'
        },
        speedGoals: {
          startingBpm: 65,
          intermediateBpm: 75,
          targetBpm: 85
        },
        commonErrors: [
          {
            issue: 'Desistir no Clímax por achar a 15ª casa apertada.',
            solution: 'Incline levemente a guitarra para cima para facilitar o acesso às casas agudas acima da casa 12.'
          }
        ],
        musicalApplication: {
          title: 'Aplicação Musical: O Seu Solo de Assinatura',
          tab: `
Parabéns, Mestre da Guitarra Solo! Você dominou o vocabulário, a biomecânica e a expressividade musical.
          `,
          description: 'A partir de agora, você possui as ferramentas completas para criar, compor e improvisar seus próprios solos em qualquer estilo ou banda.'
        },
        challenge: {
          title: 'Desafio Prático: Gravação Definitiva de Formatura',
          description: 'Grave um vídeo ou áudio da sua execução do Ascension Solo.',
          instruction: 'Compartilhe com amigos, familiares ou mentores musicais para celebrar a sua conquista!'
        },
        masteryCriteria: {
          learning: 'Executa trechos isolados do solo, mas ainda precisa parar entre os atos.',
          consolidating: 'Toca os 16 compassos completos com pequenas oscilações de tempo a 70 BPM.',
          mastered: 'Domínio absoluto da peça a 80 BPM, com bends cirúrgicos, legato cristalino, dinâmica vibrante e maturidade artística de conservatório.'
        },
        reviewNotes: 'Formação em Guitarra Solo CONCLUÍDA com maestria! Continue praticando diariamente na Central de Prática e consultando a Biblioteca e o Metrônomo Pro.',
        quiz: {
          passingScore: 80,
          questions: [
            {
              id: 'sl20-q1',
              question: 'Qual é o elemento mais importante que define um guitarrista solo de nível profissional?',
              options: ['A capacidade de expressar emoções reais com precisão técnica, afinação, ritmo e dinâmica musical', 'Tocar 30 notas por segundo sem pausas', 'Ter a guitarra mais cara do mercado', 'Usar apenas pedais de efeito'],
              correctIndex: 0,
              explanation: 'A técnica existe para servir à música. Um solo inesquecível une precisão mecânica, respeito ao ritmo e emoção genuína.'
            }
          ]
        }
      }
    ]
  }
];

// Array plano com todas as 20 aulas do curso de guitarra solo
export const SOLO_LESSONS: SoloLesson[] = SOLO_COURSE_STAGES.flatMap((stage) => stage.lessons);

/**
 * Localiza uma aula de guitarra solo por ID (ex: 'solo-lesson-1' a 'solo-lesson-20')
 */
export function getSoloLessonById(id: string): SoloLesson | undefined {
  return SOLO_LESSONS.find((lesson) => lesson.id === id);
}

/**
 * Retorna o acervo unificado de todas as aulas do Guitar Academy:
 * as 18 aulas da Formação Conservatório + as 20 aulas da Formação Guitarra Solo.
 */
export function getAllAcademyLessons(): Lesson[] {
  const conservatoryLessons = CURRICULUM_LEVELS.flatMap((lvl) => lvl.lessons);
  return [...conservatoryLessons, ...SOLO_LESSONS];
}

import { ViolaoLesson, ViolaoCourseModule } from '../types';
import { VIOLAO_MODULES_4_TO_6 } from './violaoModules4to6';
import { VIOLAO_MODULES_7_TO_10 } from './violaoModules7to10';

// =========================================================================
// GUITAR ACADEMY — DOMÍNIO TOTAL DO VIOLÃO
// Formação Avançada em Braço, Notas, Acordes Abertos, Harmonia e Violão Solo
// 10 Módulos • 6 Aulas por Módulo = 60 Aulas Completas
// =========================================================================

const VIOLAO_MODULES_1_TO_3: ViolaoCourseModule[] = [
  // =======================================================================
  // MÓDULO 1 — ANATOMIA, AFINAÇÃO E MAPA COMPLETO DO BRAÇO (Aulas 1 a 6)
  // =======================================================================
  {
    id: 'violao-mod-1',
    moduleNumber: 1,
    title: 'Anatomia, Afinação e Mapa Completo do Braço',
    subtitle: 'Conheça cada centímetro do seu instrumento acústico e a física das cordas',
    badge: 'Módulo 1 • Fundamentos',
    description: 'Do reconhecimento anatômico das partes do violão à afinação precisa de E2 a E4, compreensão dos trastes, semitons e primeiros mapeamentos até a 12ª casa.',
    lessons: [
      {
        id: 'violao-lesson-1',
        level: 0,
        moduleTitle: 'Módulo 1 • Anatomia & Mapa',
        moduleNumber: 1,
        lessonNumber: 1,
        title: 'Conhecendo o Instrumento: Cordas, Braço e Escala',
        subtitle: 'A anatomia do violão acústico e a relação entre cordas soltas e pressionadas',
        objective: 'Compreender as partes do violão acústico (tampo, rastilho, pestana, escala, trastes) e como o comprimento da corda altera a altura sonora.',
        estimatedMinutes: 20,
        prerequisites: ['Violão acústico (nylon ou aço) afinado e postura ereta.'],
        parts: [
          {
            id: 'vl1-p1',
            title: '1. Anatomia do Violão e Suas Partes Essenciais',
            contentMarkdown: `### O Violão Físico: Mecânica e Ressonância

O violão é um instrumento acústico de cordas dedilhadas onde a vibração mecânica é amplificada pela caixa harmônica. Conheça as peças fundamentais:

* **Tampo Harmônico:** Madeira frontal que projeta o som. Apoie o antebraço direito suavemente na borda sem abafar o tampo.
* **Cavalete e Rastilho:** Onde as cordas são presas e apoiadas. O rastilho transfere a vibração das cordas para a madeira.
* **Braço e Escala:** Região onde os dedos pressionam as cordas para mudar as notas.
* **Trastes (Trastejamento):** Filetes de metal na escala. O espaço entre dois trastes consecutivos é chamado de **casa**.
* **Pestana (Nut):** Peça de osso/plástico no início do braço que apoia as cordas soltas.
* **Mão e Tarraxas:** Onde ajustamos a tensão para afinar o instrumento.`,
          },
          {
            id: 'vl1-p2',
            title: '2. Cordas Soltas vs. Notas Pressionadas',
            contentMarkdown: `### Como a Casa Altera a Altura da Nota

* **Corda Solta (Casa 0):** A corda vibra em todo o seu comprimento da pestana ao rastilho.
* **Corda Pressionada:** Ao pressionar um dedo logo atrás do traste, você encurta o comprimento vibrátil da corda, tornando o som mais **agudo** (frequência mais alta).
* Cada casa avançada em direção à caixa acústica eleva a nota em **1 semitom**.`,
          },
          {
            id: 'vl1-p3',
            title: '3. Diferenças entre Violão Acústico e Guitarra Elétrica',
            contentMarkdown: `### O Toque no Violão Físico

No violão acústico (especialmente de nylon), o braço costuma ser mais largo (52mm na pestana) e plano. Isso exige:
1. Polegar da mão esquerda posicionado atrás do braço, sem envolver o topo.
2. Dedos curvados como arcos, atacando as cordas na ponta da polpa.
3. Toque firme com a mão direita para extrair volume acústico limpo.`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-1',
          title: 'Exercício 1 — Toque e Reconhecimento das 6 Cordas Soltas',
          subtitle: 'Ataque limpo com o polegar da 6ª à 1ª corda a 60 BPM',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar da mão direita (p) em toque apoiado suave',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 0 },
            { stringNumber: 2, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 0 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
          ],
          tablatureText: `e|----------------0---|
B|--------------0-----|
G|------------0-------|
D|----------0---------|
A|--------0-----------|
E|--0-----------------|
    p     p   p p p p`,
          instructions: [
            'Sente-se com as costas retas e o violão apoiado confortavelmente.',
            'Toque a 6ª corda solta com o polegar direito e deixe ressoar por 4 tempos.',
            'Prossiga descendo da 5ª até a 1ª corda, escutando a pureza de cada frequência.',
          ],
          biomechanicTips: [
            'Não dobre o pulso esquerdo para a frente.',
            'Mantenha os ombros relaxados e respire naturalmente.',
          ],
          validationCriteria: 'As seis cordas devem vibrar limpas, sem trastejamento e sem encostar em cordas vizinhas.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Som Aberto do Violão',
          description: 'A ressonância de cordas soltas é a marca registrada da música brasileira, do folk e da música congregacional.',
          tab: `e|--------0-----------0-------|
B|------0---0-------0---0-----|
G|----0-------0---0-------0---|
D|----------------------------|
A|--------------0-------------|
E|--0-------------------------|`,
        },
        commonErrors: [
          { issue: 'Deixar o polegar da mão esquerda escapar por cima do braço.', solution: 'Mantenha o polegar centralizado atrás do braço para dar alcance aos quatro dedos.' },
          { issue: 'Tocar com o violão deitado no colo.', solution: 'Incline o tampo ligeiramente para você sem inclinar o violão excessivamente.' }
        ],
        challenge: {
          title: 'Desafio das Cordas Soltas',
          description: 'Toque as 6 cordas de olhos fechados e nomeie a nota de cada uma em voz alta.',
          instruction: 'Grave ou recite: Mi (6ª), Lá (5ª), Ré (4ª), Sol (3ª), Si (2ª), Mi (1ª).'
        },
        masteryCriteria: {
          learning: 'Conhece as partes do violão e identifica as cordas soltas.',
          consolidating: 'Toca as 6 cordas sem hesitar e com som uniforme.',
          mastered: 'Reconhece o timbre e a altura de cada corda solta instantaneamente.'
        },
        speedGoals: { startingBpm: 50, intermediateBpm: 60, targetBpm: 75 },
        reviewNotes: 'A anatomia do violão dita a ergonomia do músico. Preserve a postura desde o primeiro dia.'
      },
      {
        id: 'violao-lesson-2',
        level: 0,
        moduleTitle: 'Módulo 1 • Anatomia & Mapa',
        moduleNumber: 1,
        lessonNumber: 2,
        title: 'Afinação Padrão: Frequências de E2 a E4',
        subtitle: 'As frequências acústicas exatas e os nomes das cordas em português',
        objective: 'Dominar a afinação padrão E2-A2-D3-G3-B3-E4, entendendo a relação entre tensão, frequência em Hertz e altura tonal.',
        estimatedMinutes: 20,
        prerequisites: ['Aula 1 concluída.', 'Afinador Pro ou diapasão.'],
        parts: [
          {
            id: 'vl2-p1',
            title: '1. As Seis Alturas da Afinação Padrão',
            contentMarkdown: `### Tabela Oficial de Frequências (Standard Tuning)

* **6ª corda (E2):** 82.41 Hz — Mi grave (Bordão)
* **5ª corda (A2):** 110.00 Hz — Lá
* **4ª corda (D3):** 146.83 Hz — Ré
* **3ª corda (G3):** 196.00 Hz — Sol
* **2ª corda (B3):** 246.94 Hz — Si
* **1ª corda (E4):** 329.63 Hz — Mi agudo (Priscila/Cantochão)`,
          },
          {
            id: 'vl2-p2',
            title: '2. Afinação Relativa no 5º Traste',
            contentMarkdown: `### O Método dos 5 Trastes para Conferir de Ouvido

1. 6ª corda na casa 5 = nota **A** (mesmo som da 5ª corda solta).
2. 5ª corda na casa 5 = nota **D** (mesmo som da 4ª corda solta).
3. 4ª corda na casa 5 = nota **G** (mesmo som da 3ª corda solta).
4. **EXCEÇÃO:** 3ª corda na casa **4** = nota **B** (mesmo som da 2ª corda solta).
5. 2ª corda na casa 5 = nota **E** (mesmo som da 1ª corda solta).`,
          },
          {
            id: 'vl2-p3',
            title: '3. Estabilidade da Afinação no Violão',
            contentMarkdown: `### Dicas para Manter a Afinação Firme

* Afine sempre subindo em direção à nota (esticando a corda), nunca descendo.
* Cordas de nylon novas precisam de alguns dias de assentamento.
* Variações de temperatura e umidade alteram a afinação da madeira.`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-2',
          title: 'Exercício 2 — Conferência Relativa no 5º Traste',
          subtitle: 'Igualando as notas pressionadas às cordas soltas vizinhas',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar alternando entre corda pressionada e corda solta',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 5 },
            { stringNumber: 4, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 0 },
            { stringNumber: 3, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 4 },
            { stringNumber: 2, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 0 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 5 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
          ],
          tablatureText: `e|----------------------------------0---0---|
B|--------------------------0---0---5-------|
G|------------------0---0---4---------------|
D|----------0---0---5-----------------------|
A|--0---0---5-------------------------------|
E|--5---------------------------------------|`,
          instructions: [
            'Toque a 6ª corda na casa 5 e em seguida a 5ª corda solta.',
            'Ouça o batimento acústico: quando as notas coincidem, o som se funde.',
            'Repita para todos os pares até a 1ª corda.',
          ],
          biomechanicTips: [
            'Pressione com a pontinha do dedo 1 ou 4 bem próximo ao ferrinho do traste.',
          ],
          validationCriteria: 'O aluno deve conseguir identificar se a corda solta está mais alta, mais baixa ou afinada.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: Oitavas Entre a 6ª e a 1ª Corda',
          description: 'A 6ª corda (E2) e a 1ª corda (E4) estão separadas por exatamente 2 oitavas (15 semitons de distância intervalar duplicada).',
          tab: `e|--0-----------------------0---|
B|------------------------------|
G|------------------------------|
D|------------------------------|
A|------------------------------|
E|--0-----------------------0---|`,
        },
        commonErrors: [
          { issue: 'Tentar afinar a 2ª corda no 5º traste da 3ª.', solution: 'Lembre-se: o intervalo entre a 3ª e a 2ª corda é de 3ª maior (4 casas), não 5.' },
        ],
        challenge: {
          title: 'Desafio do Ouvido Apurado',
          description: 'Desafine propositalmente a 2ª corda e tente afiná-la apenas comparando com a 3ª corda na casa 4.',
          instruction: 'Depois confira no Afinador Pro se ficou a menos de 5 cents.'
        },
        masteryCriteria: {
          learning: 'Sabe as frequências e as letras da afinação padrão.',
          consolidating: 'Consegue afinar de ouvido usando o método das 5 casas.',
          mastered: 'Afina com rapidez e precisão de ouvido e pelo afinador.'
        },
        speedGoals: { startingBpm: 50, intermediateBpm: 60, targetBpm: 70 },
        reviewNotes: 'Sem afinação precisa, nenhum acorde ou escala soará harmônico.'
      },
      {
        id: 'violao-lesson-3',
        level: 0,
        moduleTitle: 'Módulo 1 • Anatomia & Mapa',
        moduleNumber: 1,
        lessonNumber: 3,
        title: 'Como Funcionam as Casas: Semitons e Oitavas',
        subtitle: 'Cada casa é um semitom: a matemática por trás da escala do violão',
        objective: 'Compreender o temperamento igual: cada traste eleva o tom em 1 semitom, e após 12 trastes temos a oitava exata da corda solta.',
        estimatedMinutes: 20,
        prerequisites: ['Aulas 1 e 2 concluídas.'],
        parts: [
          {
            id: 'vl3-p1',
            title: '1. O Princípio dos Semitons Consecutivos',
            contentMarkdown: `### O Menor Intervalo da Música Ocidental

Na escala temperada ocidental, a menor distância entre duas notas consecutivas é o **semitom** (meio tom).
* No violão, avançar 1 casa = **+1 semitom**.
* Avançar 2 casas = **+1 tom inteiro** (2 semitons).
* Se a 6ª corda solta é **E**, na casa 1 temos **F**, na casa 2 temos **F#**, na casa 3 temos **G**.`,
          },
          {
            id: 'vl3-p2',
            title: '2. A Magia da 12ª Casa (A Oitava)',
            contentMarkdown: `### Ponto Médio da Corda

A casa 12 fica exatamente no meio do comprimento de corda vibrátil:
* A frequência dobra (2x): E2 (82.4Hz) passa a ser E3 (164.8Hz).
* Todas as notas da casa 12 têm o **mesmo nome** da corda solta correspondente!
* A partir da casa 13, todo o padrão da casa 1 recomeça uma oitava acima.`,
          },
          {
            id: 'vl3-p3',
            title: '3. Encontrando Oitavas no Braço',
            contentMarkdown: `### Formas Geométricas de Oitava

Para encontrar a oitava de uma nota no violão:
1. **Com salto de 1 corda (cordas 6 e 5):** Pule 1 corda e avance 2 casas.
   * Exemplo: 6ª corda, casa 3 (G) -> 4ª corda, casa 5 (G).
2. **Nas cordas 4 e 3:** Pule 1 corda e avance **3 casas** (devido à afinação da 2ª corda).
   * Exemplo: 4ª corda, casa 5 (G) -> 2ª corda, casa 8 (G).`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-3',
          title: 'Exercício 3 — O Salto da Oitava da 6ª à 4ª Corda',
          subtitle: 'Tocando a fundamental e sua oitava com som límpido',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar na 6ª corda e indicador na 4ª corda',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 4, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 2 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 5 },
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
            { stringNumber: 4, noteCipher: 'A', notePt: 'Lá', pickDirection: 'up', fret: 7 },
          ],
          tablatureText: `e|----------------------------------|
B|----------------------------------|
G|----------------------------------|
D|------2-------5-------7-----------|
A|----------------------------------|
E|--0-------3-------5---------------|
    p   i   p   i   p   i`,
          instructions: [
            'Use o polegar para a 6ª corda e o dedo indicador para a 4ª corda.',
            'Sinta a consonância perfeita da oitava: as duas notas vibram em harmonia pura.',
          ],
          biomechanicTips: [
            'Use o dedo 1 na 6ª corda e o dedo 3 na 4ª corda para os formatos com casa.',
          ],
          validationCriteria: 'As duas notas devem soar limpas, sustentando o som.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: Fraseado em Oitavas Estilo Wes Montgomery',
          description: 'Tocar em oitavas enriquece o som melódico no violão e confere peso e presença sonora.',
          tab: `e|--------------------------|
B|--------------------------|
G|------0-------2-------4---|
D|--------------------------|
A|--------------------------|
E|--0-------2-------3-------|`,
        },
        commonErrors: [
          { issue: 'Deixar a 5ª corda soar no meio do caminho.', solution: 'Encoste de leve a barriga do dedo 1 na 5ª corda para abafá-la silenciosamente.' },
        ],
        challenge: {
          title: 'Desafio da 12ª Casa',
          description: 'Toque todas as 6 cordas na casa 12 e comprove de ouvido que são exatamente as mesmas notas das cordas soltas.',
          instruction: 'Compare E2 com E3, A2 com A3, D3 com D4, G3 com G4, B3 com B4, E4 com E5.'
        },
        masteryCriteria: {
          learning: 'Entende que cada traste avança 1 semitom.',
          consolidating: 'Localiza oitavas nas cordas 6 e 5 com naturalidade.',
          mastered: 'Mapeia qualquer oitava no braço sem hesitação.'
        },
        speedGoals: { startingBpm: 55, intermediateBpm: 65, targetBpm: 80 },
        reviewNotes: 'Oitavas são âncoras geométricas para navegar no braço.'
      },
      {
        id: 'violao-lesson-4',
        level: 0,
        moduleTitle: 'Módulo 1 • Anatomia & Mapa',
        moduleNumber: 1,
        lessonNumber: 4,
        title: 'Entendendo Sustenidos, Bemóis e Enarmonia',
        subtitle: 'Notas naturais, acidentes musicais e por que C# e Db são a mesma casa física',
        objective: 'Compreender os acidentes musicais (# e b), enarmonia e a ausência de sustenido natural entre E-F e B-C.',
        estimatedMinutes: 20,
        prerequisites: ['Aulas 1 a 3 concluídas.'],
        parts: [
          {
            id: 'vl4-p1',
            title: '1. O que é Sustenido (#) e Bemol (b)',
            contentMarkdown: `### Elevação e Abaixamento de Semitons

* **Sustenido (#):** Eleva a nota em **1 semitom** (avança 1 casa para frente, em direção à boca do violão).
  * Exemplo: Casa 3 na 6ª corda é G. Casa 4 é **G#**.
* **Bemol (b):** Abaixa a nota em **1 semitom** (recua 1 casa para trás, em direção à mão do violão).
  * Exemplo: Casa 5 na 6ª corda é A. Casa 4 é **Ab**.`,
          },
          {
            id: 'vl4-p2',
            title: '2. Enarmonia: O Mesmo Som com Dois Nomes',
            contentMarkdown: `### C# e Db: O Mesmo Traste no Violão Físico

No violão temperado, **G# e Ab ocupam rigorosamente a mesma casa (casa 4 da 6ª corda)**.
Isso se chama **enarmonia**:
* C# = Db
* D# = Eb
* F# = Gb
* G# = Ab
* A# = Bb`,
          },
          {
            id: 'vl4-p3',
            title: '3. A Regra de Ouro: Sem Acidentes Naturais entre E-F e B-C',
            contentMarkdown: `### Onde Não Existem Casas Intermediárias

Na música ocidental:
* Entre **E e F** existe apenas **1 semitom** (não há E# na prática diária, o traste seguinte é F direto).
* Entre **B e C** existe apenas **1 semitom** (não há B#, o traste seguinte é C direto).
* Todas as outras notas naturais têm **1 tom inteiro** de distância (2 casas de distância).`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-4',
          title: 'Exercício 4 — Caminhada Cromática de Fá a Lá na 6ª Corda',
          subtitle: 'Identificando naturais, sustenidos e bemóis na prática',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar ou indicador apoiado',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 1 },
            { stringNumber: 6, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'down', fret: 2 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'G#', notePt: 'Sol#', pickDirection: 'down', fret: 4 },
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
          ],
          tablatureText: `e|----------------------------------|
B|----------------------------------|
G|----------------------------------|
D|----------------------------------|
A|----------------------------------|
E|--1---2---3---4---5---------------|
    F   F#  G   G#  A (ou Gb, Ab)`,
          instructions: [
            'Toque casa 1 (F), casa 2 (F#/Gb), casa 3 (G), casa 4 (G#/Ab), casa 5 (A).',
            'Recite os dois nomes ao passar pela casa 2 e 4.',
          ],
          biomechanicTips: [
            'Use os dedos 1, 2, 3 e 4 consecutivamente, um para cada casa.',
          ],
          validationCriteria: 'O aluno deve saber de cabeça que a casa 2 é F#/Gb e a casa 4 é G#/Ab.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Baixo Cromático Descendente',
          description: 'Muito comum em bossa nova, MPB e blues para conectar acordes vizinhos.',
          tab: `e|--------------------------|
B|--------------------------|
G|--------------------------|
D|--------------------------|
A|--5---4---3---2---1---0---|
E|--------------------------|
    D  C#   C   B   Bb  A`,
        },
        commonErrors: [
          { issue: 'Procurar uma casa entre Mi e Fá.', solution: 'Memorize: E-F e B-C são vizinhos colados (1 semitom).' }
        ],
        challenge: {
          title: 'Quiz Rápido Enarmônico',
          description: 'Responda sem olhar: qual é o enarmônico de Bb? E qual é a nota 1 semitom acima de B?',
          instruction: 'Resposta: A# é o enarmônico de Bb. 1 semitom acima de B é C (Dó direto).'
        },
        masteryCriteria: {
          learning: 'Compreende a diferença teórica entre sustenido e bemol.',
          consolidating: 'Identifica notas acidentadas no braço sem hesitar.',
          mastered: 'Aplica enarmonia com precisão em qualquer região do braço.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 70, targetBpm: 85 },
        reviewNotes: 'Acidentes expandem as 7 notas naturais para o universo de 12 alturas sonoras.'
      },
      {
        id: 'violao-lesson-5',
        level: 0,
        moduleTitle: 'Módulo 1 • Anatomia & Mapa',
        moduleNumber: 1,
        lessonNumber: 5,
        title: 'Marcadores do Braço: Casas 3, 5, 7, 9 e 12',
        subtitle: 'Como usar os pontos de referência (inlays) para navegar sem olhar para os dedos',
        objective: 'Memorizar os marcos visuais do violão (casas 3, 5, 7, 9 e 12) como faróis de navegação espacial.',
        estimatedMinutes: 20,
        prerequisites: ['Aulas 1 a 4 concluídas.'],
        parts: [
          {
            id: 'vl5-p1',
            title: '1. Os Faróis de Referência no Braço',
            contentMarkdown: `### Pontos de Orientação (Inlays)

No braço do violão (na escala ou no friso superior), existem marcações padronizadas:
* **Casa 3:** Marco inicial (G na 6ª corda, C na 5ª corda).
* **Casa 5:** Ponto de afinação relativa (A na 6ª corda, D na 5ª corda).
* **Casa 7:** Ponto da 5ª justa da corda solta (B na 6ª corda, E na 5ª corda).
* **Casa 9:** Terça menor da oitava (C# na 6ª corda, F# na 5ª corda).
* **Casa 12 (Ponto Duplo):** Oitava exata de todas as cordas soltas!`,
          },
          {
            id: 'vl5-p2',
            title: '2. Olhando para o Friso Superior',
            contentMarkdown: `### O Segredo dos Violonistas Profissionais

Não incline o violão para a frente para olhar a escala de frente.
Observe os **pontos no friso superior do braço** (na borda da madeira). Isso preserva a postura correta da coluna e a inclinação acústica do tampo harmônico.`,
          },
          {
            id: 'vl5-p3',
            title: '3. Saltos de Precisão Guiados pelos Marcos',
            contentMarkdown: `### Treinando a Mira Espacial

Pratique saltar diretamente da corda solta para a casa 5, depois para a casa 7, depois para a casa 12 sem passar casa por casa.
Seus olhos encontram o marcador e seu dedo aterrissa com precisão.`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-5',
          title: 'Exercício 5 — Saltos Espaciais nos Marcadores (0, 3, 5, 7, 12)',
          subtitle: 'Aterrissagem limpa na 6ª corda guiada pelos inlays',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar com toque apoiado',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
            { stringNumber: 6, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 7 },
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 12 },
          ],
          tablatureText: `e|----------------------------------|
B|----------------------------------|
G|----------------------------------|
D|----------------------------------|
A|----------------------------------|
E|--0---3---5---7---12--------------|
    E   G   A   B   E (oitava)`,
          instructions: [
            'Olhe para o ponto da casa 3 antes de tocar.',
            'Salte para a casa 5, depois 7, depois 12.',
            'O som deve cessar apenas durante o milissegundo do salto.',
          ],
          biomechanicTips: [
            'Deslize o polegar por trás do braço acompanhando o movimento da mão.',
          ],
          validationCriteria: 'Todas as notas devem soar sem trastejar e no tempo do metrônomo.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: Riff dos Marcadores',
          description: 'A progressão E - G - A - B - E é o esqueleto de centenas de músicas clássicas do rock e blues.',
          tab: `e|--------------------------|
B|--------------------------|
G|--------------------------|
D|--------------------------|
A|------5---7---------------|
E|--0---3---5---7---12------|`,
        },
        commonErrors: [
          { issue: 'Deixar o dedo cair em cima do ferrinho do traste.', solution: 'Aterre sempre logo atrás do traste de metal correspondente.' }
        ],
        challenge: {
          title: 'Salto Cego de Oitava',
          description: 'Olhe para a casa 12, feche os olhos e tente aterrissar o dedo indicador exatamente nela.',
          instruction: 'Abra os olhos para conferir se caiu perfeitamente atrás do traste 12.'
        },
        masteryCriteria: {
          learning: 'Identifica visualmente os marcadores 3, 5, 7, 9 e 12.',
          consolidating: 'Salta entre os marcadores sem perder o andamento.',
          mastered: 'Navega no braço confiando na memória muscular e nos marcadores laterais.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Marcadores são mapas de navegação rápida: use-os para nunca se perder no braço.'
      },
      {
        id: 'violao-lesson-6',
        level: 0,
        moduleTitle: 'Módulo 1 • Anatomia & Mapa',
        moduleNumber: 1,
        lessonNumber: 6,
        title: 'Primeira Exploração Completa: As 6 Cordas até a Casa 12',
        subtitle: 'Mapeando todas as 78 posições fundamentais do violão acústico',
        objective: 'Consolidar o primeiro módulo integrando afinação, trastes, semitons e marcadores em uma varredura completa das 6 cordas.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 1 a 5 concluídas.'],
        parts: [
          {
            id: 'vl6-p1',
            title: '1. O Universo das 78 Notas Iniciais',
            contentMarkdown: `### 6 Cordas x 13 Posições (Casas 0 a 12)

Com 6 cordas e 12 casas (mais as cordas soltas), temos **78 notas tocáveis na região nobre do violão**:
* Muitas dessas notas são uníssonas (mesma altura em cordas diferentes).
* Por exemplo: a 1ª corda solta (E4) é a mesma nota da 2ª corda na casa 5, da 3ª corda na casa 9, da 4ª corda na casa 14.
* Essa redundância geométrica é o que torna o violão um dos instrumentos mais ricos e versáteis do planeta!`,
          },
          {
            id: 'vl6-p2',
            title: '2. Tabela de Varredura até a Casa 12',
            contentMarkdown: `### Principais Notas Naturais nas 6 Cordas (Casa 0 a 12)

* **6ª corda:** E (0) • F (1) • G (3) • A (5) • B (7) • C (8) • D (10) • E (12)
* **5ª corda:** A (0) • B (2) • C (3) • D (5) • E (7) • F (8) • G (10) • A (12)
* **4ª corda:** D (0) • E (2) • F (3) • G (5) • A (7) • B (9) • C (10) • D (12)
* **3ª corda:** G (0) • A (2) • B (4) • C (5) • D (7) • E (9) • F (10) • G (12)
* **2ª corda:** B (0) • C (1) • D (3) • E (5) • F (6) • G (8) • A (10) • B (12)
* **1ª corda:** E (0) • F (1) • G (3) • A (5) • B (7) • C (8) • D (10) • E (12)`,
          },
          {
            id: 'vl6-p3',
            title: '3. Síntese do Módulo 1',
            contentMarkdown: `### Você Dominou os Fundamentos Físicos

Agora o braço do violão não é mais um pedaço de madeira desconhecido: é uma grade geométrica ordenada por semitons, marcadores e frequências.
No Módulo 2, aprenderemos a encontrar qualquer nota em frações de segundo!`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-6',
          title: 'Exercício 6 — Varredura das Notas Naturais nas Cordas 6 e 5',
          subtitle: 'Percorrendo todas as notas naturais da casa 0 até a 12',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar com toque apoiado',
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
          tablatureText: `e|----------------------------------------------------|
B|----------------------------------------------------|
G|----------------------------------------------------|
D|----------------------------------------------------|
A|----------------------------------------------------|
E|--0---1---3---5---7---8---10---12-------------------|
    E   F   G   A   B   C   D    E`,
          instructions: [
            'Toque cada nota e fale o nome em voz alta no andamento do metrônomo.',
            'Observe o espaçamento de 1 semitom entre E-F (0-1) e B-C (7-8).',
          ],
          biomechanicTips: [
            'Mantenha a mão relaxada e deslize sem tensão pelo braço.',
          ],
          validationCriteria: 'Execução contínua sem interrupções nem hesitações no nome das notas.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: Melodia Medieval no Bordão',
          description: 'Usando apenas a 6ª corda, podemos tocar melodias modais inteiras com sonoridade profunda.',
          tab: `e|----------------------------------|
B|----------------------------------|
G|----------------------------------|
D|----------------------------------|
A|----------------------------------|
E|--0---3---5---7---8---7---5---0---|`,
        },
        commonErrors: [
          { issue: 'Esquecer que entre B e C é só 1 casa de distância.', solution: 'Casa 7 é B, casa 8 é C direto.' }
        ],
        challenge: {
          title: 'Desafio Final do Módulo 1',
          description: 'Faça o mesmo percurso de notas naturais na 5ª corda: A (0), B (2), C (3), D (5), E (7), F (8), G (10), A (12).',
          instruction: 'Grave ou pratique até fazer em menos de 15 segundos.'
        },
        masteryCriteria: {
          learning: 'Conhece as notas naturais na 6ª corda até a casa 12.',
          consolidating: 'Executa a sequência na 6ª e 5ª cordas com metrônomo.',
          mastered: 'Visualiza instantaneamente as notas naturais e acidentes até a casa 12.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Módulo 1 concluído com sucesso. Base sólida para a localização de notas no Módulo 2.'
      }
    ]
  },

  // =======================================================================
  // MÓDULO 2 — LOCALIZAÇÃO DE TODAS AS NOTAS (Aulas 7 a 12)
  // =======================================================================
  {
    id: 'violao-mod-2',
    moduleNumber: 2,
    title: 'Localização de Todas as Notas e Memorização do Braço',
    subtitle: 'Encontre qualquer nota em qualquer corda instantaneamente',
    badge: 'Módulo 2 • Notas & Braço',
    description: 'Sequência cromática completa, notas em cada uma das seis cordas, truques de oitavas e exercícios progressivos de resposta mental e auditiva.',
    lessons: [
      {
        id: 'violao-lesson-7',
        level: 1,
        moduleTitle: 'Módulo 2 • Localização de Notas',
        moduleNumber: 2,
        lessonNumber: 7,
        title: 'A Sequência Cromática Completa e Semitons Naturais',
        subtitle: 'A fita métrica de 12 notas que governa todas as cordas do violão',
        objective: 'Dominar a sequência cromática de 12 notas e compreender a estrutura cíclica do braço sem depender de cifras decoradas.',
        estimatedMinutes: 20,
        prerequisites: ['Módulo 1 concluído.'],
        parts: [
          {
            id: 'vl7-p1',
            title: '1. O Ciclo das 12 Notas',
            contentMarkdown: `### A Sequência Cromática Infinita

Na música ocidental existem exatamente 12 notas que se repetem em ciclos:
\`\`\`
C -> C# -> D -> D# -> E -> F -> F# -> G -> G# -> A -> A# -> B -> [retorna a C]
\`\`\`
Com bemóis:
\`\`\`
C -> Db -> D -> Eb -> E -> F -> Gb -> G -> Ab -> A -> Bb -> B -> [retorna a C]
\`\`\``,
          },
          {
            id: 'vl7-p2',
            title: '2. Os Dois Intervalos de 1 Semitom Natural',
            contentMarkdown: `### Onde Não Existe Acidente Entre Notas Naturais

* **Mi -> Fá (E -> F):** 1 semitom de distância (casas vizinhas).
* **Si -> Dó (B -> C):** 1 semitom de distância (casas vizinhas).
* Entre todas as outras notas naturais existem 2 semitons (1 tom inteiro = 1 casa de intervalo).`,
          },
          {
            id: 'vl7-p3',
            title: '3. Aplicando a Sequência em Qualquer Corda',
            contentMarkdown: `### A Fórmula Universal

Para achar qualquer nota em qualquer corda:
1. Comece no nome da corda solta.
2. Cada casa avançada é o próximo elemento da sequência cromática!
* Exemplo na 3ª corda (Sol/G):
  * Casa 0: G
  * Casa 1: G#
  * Casa 2: A
  * Casa 3: A#
  * Casa 4: B
  * Casa 5: C (semitom de B para C!)`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-7',
          title: 'Exercício 7 — A Escala Cromática Completa na 3ª Corda',
          subtitle: 'Tocando as 12 notas da casa 0 à casa 12 a 60 BPM',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar ou indicador apoiado',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 0 },
            { stringNumber: 3, noteCipher: 'G#', notePt: 'Sol#', pickDirection: 'down', fret: 1 },
            { stringNumber: 3, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 2 },
            { stringNumber: 3, noteCipher: 'A#', notePt: 'Lá#', pickDirection: 'down', fret: 3 },
            { stringNumber: 3, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 4 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
          ],
          tablatureText: `e|----------------------------------------------------|
B|----------------------------------------------------|
G|--0---1---2---3---4---5---6---7---8---9---10---11---12--|
D|----------------------------------------------------|
A|----------------------------------------------------|
E|----------------------------------------------------|
    G  G#   A  A#   B   C  C#   D  D#   E   F    F#   G`,
          instructions: [
            'Toque a 3ª corda subindo casa por casa até a casa 12.',
            'Note que na casa 12 você retorna à nota G original uma oitava acima.',
          ],
          biomechanicTips: [
            'Mantenha a pressão constante e precisa bem colada ao traste.',
          ],
          validationCriteria: 'Conhecimento da sequência sem gaguejar nos semitons E-F e B-C.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Riff Cromático do Jazz Manouche',
          description: 'Aproximações cromáticas dão swing e sabor cigano ao fraseado de violão.',
          tab: `e|--------------------------|
B|--------------------------|
G|--------------------------|
D|--------------------------|
A|------2---3---4---5-------|
E|--3-----------------------|`,
        },
        commonErrors: [
          { issue: 'Achar que existe B# entre B e C.', solution: 'B vai direto para C na casa imediatamente seguinte.' }
        ],
        challenge: {
          title: 'Desafio Mental Cromático',
          description: 'Qual nota está 3 semitons acima de F? E 2 semitons abaixo de G?',
          instruction: 'Resposta: 3 semitons acima de F é G# (Ab). 2 semitons abaixo de G é F.'
        },
        masteryCriteria: {
          learning: 'Recita a sequência cromática de cor.',
          consolidating: 'Aplica a sequência em qualquer corda com facilidade.',
          mastered: 'Calcula distâncias cromáticas mentalmente em frações de segundo.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'A sequência cromática é a régua de medição de todo o braço.'
      },
      {
        id: 'violao-lesson-8',
        level: 1,
        moduleTitle: 'Módulo 2 • Localização de Notas',
        moduleNumber: 2,
        lessonNumber: 8,
        title: 'Dominando a Sexta Corda: O Bordão Guia (E2 a E3)',
        subtitle: 'A corda mestre dos baixos de acordes, tônicas e pestanas',
        objective: 'Mapear com perfeição todas as notas da 6ª corda, que serve de raiz para as pestanas em forma de E e acordes abertos.',
        estimatedMinutes: 20,
        prerequisites: ['Aula 7 concluída.'],
        parts: [
          {
            id: 'vl8-p1',
            title: '1. Por que a 6ª Corda é a Mais Importante para Acordes',
            contentMarkdown: `### A Raiz dos Acordes de Violão

A 6ª corda é o alicerce harmônico do violão:
* Define a tônica de acordes como **E, Em, G, F, F#m, G#m, A (pestana)**.
* Se você souber onde fica cada nota na 6ª corda, você saberá instantaneamente onde montar qualquer acorde com raiz na 6ª corda!`,
          },
          {
            id: 'vl8-p2',
            title: '2. Mapa Completo da 6ª Corda',
            contentMarkdown: `### Posições na 6ª Corda (Casa 0 a 12)

* **Casa 0:** E (Mi)
* **Casa 1:** F (Fá) — *raiz da pestana clássica de F*
* **Casa 2:** F# / Gb
* **Casa 3:** G (Sol) — *raiz do acorde G aberto*
* **Casa 4:** G# / Ab
* **Casa 5:** A (Lá) — *raiz da pestana de A*
* **Casa 6:** A# / Bb
* **Casa 7:** B (Si) — *raiz da pestana de B*
* **Casa 8:** C (Dó) — *raiz da pestana de C*
* **Casa 9:** C# / Db
* **Casa 10:** D (Ré)
* **Casa 11:** D# / Eb
* **Casa 12:** E (Mi) — *oitava completa*`,
          },
          {
            id: 'vl8-p3',
            title: '3. Técnicas de Fixação Rápida',
            contentMarkdown: `### Marcos da 6ª Corda: 1 (F), 3 (G), 5 (A), 7 (B), 8 (C)

Memorize a palavra mnemônica: **F - G - A - B - C** nas casas **1 - 3 - 5 - 7 - 8**.
Observe como C fica grudado em B (7 e 8)!`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-8',
          title: 'Exercício 8 — Localização Rápida de Baixos na 6ª Corda',
          subtitle: 'Saltando entre E, G, A, C e D na 6ª corda',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar apoiado',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 5 },
            { stringNumber: 6, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 8 },
            { stringNumber: 6, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 10 },
          ],
          tablatureText: `e|----------------------------------|
B|----------------------------------|
G|----------------------------------|
D|----------------------------------|
A|----------------------------------|
E|--0---3---5---8---10--------------|
    E   G   A   C   D`,
          instructions: [
            'Toque cada nota e fale o nome em voz alta no clique do metrônomo.',
            'Concentre-se em memorizar visualmente a distância das casas.',
          ],
          biomechanicTips: [
            'Mantenha o polegar atrás da escala guiando a mão.',
          ],
          validationCriteria: 'Acerto imediato das casas 0, 3, 5, 8 e 10 sem hesitar.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Caminho de Baixo I - IV - V em Sol Maior',
          description: 'A 6ª corda conduz a progressão com os baixos fundamentais.',
          tab: `e|--------------------------|
B|--------------------------|
G|--------------------------|
D|--------------------------|
A|--------------------------|
E|--3---3---8---8---10--10--|
    G       C       D`,
        },
        commonErrors: [
          { issue: 'Confundir C (casa 8) com casa 9.', solution: 'Lembre-se: C é colado no B (7), portanto casa 8.' }
        ],
        challenge: {
          title: 'Desafio do Baixo Cego',
          description: 'Peça para alguém falar uma nota (F, G, A, B, C) e aterre na casa correspondente da 6ª corda em menos de 1 segundo.',
          instruction: 'F = 1, G = 3, A = 5, B = 7, C = 8, D = 10.'
        },
        masteryCriteria: {
          learning: 'Localiza as notas naturais na 6ª corda.',
          consolidating: 'Salta entre qualquer nota da 6ª corda com metrônomo.',
          mastered: 'Sabe todas as notas e acidentes da 6ª corda de olhos fechados.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Dominar a 6ª corda abre caminho para dominar 50% de todas as pestanas do violão.'
      },
      {
        id: 'violao-lesson-9',
        level: 1,
        moduleTitle: 'Módulo 2 • Localização de Notas',
        moduleNumber: 2,
        lessonNumber: 9,
        title: 'Dominando a Quinta Corda: O Alicerce de Lá (A2 a A3)',
        subtitle: 'A segunda corda mestra: raízes de C, D, Am, Dm e pestanas em A',
        objective: 'Mapear todas as notas da 5ª corda e utilizá-la como referência para acordes fundamentais abertos e móveis.',
        estimatedMinutes: 20,
        prerequisites: ['Aula 8 concluída.'],
        parts: [
          {
            id: 'vl9-p1',
            title: '1. O Papel Estratégico da 5ª Corda',
            contentMarkdown: `### A Raiz dos Acordes Médios

A 5ª corda (Lá solta) abriga as raízes dos acordes mais tocados no violão:
* **Casa 0:** A (Lá) — raiz de A e Am
* **Casa 2:** B (Si) — raiz de B7 e Bm
* **Casa 3:** C (Dó) — raiz do clássico C maior aberto e Cadd9!
* **Casa 5:** D (Ré) — raiz de D, Dm e pestanas em forma de A
* **Casa 7:** E (Mi) — oitava de E2
* **Casa 8:** F (Fá)
* **Casa 10:** G (Sol)
* **Casa 12:** A (Lá) — oitava completa`,
          },
          {
            id: 'vl9-p2',
            title: '2. Comparando a 6ª e a 5ª Corda',
            contentMarkdown: `### Relação de 5 Semitons (Quarta Justa)

A 5ª corda é afinada uma 4ª justa acima da 6ª:
* Cada nota da 5ª corda está **5 semitons acima** da mesma casa na 6ª corda.
* Exemplo na Casa 3: na 6ª corda temos **G**, na 5ª corda temos **C** (G -> C é uma 4ª justa!).
* Essa relação em L é a base da cadência II-V-I e I-IV-V!`,
          },
          {
            id: 'vl9-p3',
            title: '3. Exercício Mental: A Triangulação de Notas',
            contentMarkdown: `### Encontrando C e D em Menos de 1 Segundo

* Precisa de C? Vá para a 5ª corda, casa 3.
* Precisa de D? Vá para a 5ª corda, casa 5.
* Precisa de B? Vá para a 5ª corda, casa 2.
Essa memória imediata liberta o aluno da necessidade de olhar cifras para saber onde pôr a mão.`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-9',
          title: 'Exercício 9 — Mapeamento de Baixos na 5ª Corda',
          subtitle: 'Caminhando entre A, B, C, D e E na 5ª corda a 60 BPM',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar apoiado',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 0 },
            { stringNumber: 5, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 2 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 5 },
            { stringNumber: 5, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 7 },
          ],
          tablatureText: `e|----------------------------------|
B|----------------------------------|
G|----------------------------------|
D|----------------------------------|
A|--0---2---3---5---7---------------|
E|----------------------------------|
    A   B   C   D   E`,
          instructions: [
            'Toque e recite o nome de cada nota.',
            'Observe que B-C estão colados (casas 2 e 3).',
          ],
          biomechanicTips: [
            'Mantenha a ponta dos dedos 1, 2 e 3 firmes.',
          ],
          validationCriteria: 'Localização imediata de C (casa 3) e D (casa 5) na 5ª corda.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Baixo Caminhante Am - C - D',
          description: 'A progressão clássica de folk e MPB conduzida na 5ª corda.',
          tab: `e|--------------------------|
B|--------------------------|
G|--------------------------|
D|--------------------------|
A|--0---0---3---3---5---5---|
E|--------------------------|`,
        },
        commonErrors: [
          { issue: 'Tocar a casa 2 achando que é Dó.', solution: 'Casa 2 na 5ª corda é Si (B). Dó (C) é na casa 3!' }
        ],
        challenge: {
          title: 'Desafio Duas Cordas',
          description: 'Toque a nota C na 6ª corda (casa 8) e logo em seguida a nota C na 5ª corda (casa 3).',
          instruction: 'Compare o som das duas oitavas de C.'
        },
        masteryCriteria: {
          learning: 'Mapeia as notas naturais na 5ª corda.',
          consolidating: 'Alterna entre notas da 6ª e 5ª cordas sem hesitação.',
          mastered: 'Usa a 5ª corda como âncora natural para acordes e baixos.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Com as cordas 6 e 5 dominadas, você já conhece a raiz de quase todos os acordes ocidentais.'
      },
      {
        id: 'violao-lesson-10',
        level: 1,
        moduleTitle: 'Módulo 2 • Localização de Notas',
        moduleNumber: 2,
        lessonNumber: 10,
        title: 'Mapeando a Quarta e Terceira Cordas (D3 e G3)',
        subtitle: 'O coração harmônico do violão: notas médias, arpejos e tríades',
        objective: 'Compreender a localização das notas nas cordas 4 (Ré) e 3 (Sol), conectando-as através do salto de oitava com as cordas 6 e 5.',
        estimatedMinutes: 20,
        prerequisites: ['Aulas 8 e 9 concluídas.'],
        parts: [
          {
            id: 'vl10-p1',
            title: '1. O Atalho da Oitava para Achar Qualquer Nota na 4ª Corda',
            contentMarkdown: `### Use o que você já sabe da 6ª Corda!

Existe uma regra geométrica mágica no violão:
* **Toda nota na 6ª corda tem sua oitava na 4ª corda duas casas para a frente!**
* Quer achar G na 4ª corda? G na 6ª corda é casa 3 -> logo, G na 4ª corda é **casa 5**!
* Quer achar A na 4ª corda? A na 6ª corda é casa 5 -> logo, A na 4ª corda é **casa 7**!
* Quer achar C na 4ª corda? C na 6ª corda é casa 8 -> logo, C na 4ª corda é **casa 10**!`,
          },
          {
            id: 'vl10-p2',
            title: '2. O Atalho da Oitava para a 3ª Corda',
            contentMarkdown: `### Conectando a 5ª Corda à 3ª Corda!

A mesma regra funciona entre a 5ª e a 3ª corda:
* **Toda nota na 5ª corda tem sua oitava na 3ª corda duas casas para a frente!**
* C na 5ª corda é casa 3 -> logo, C na 3ª corda é **casa 5**!
* D na 5ª corda é casa 5 -> logo, D na 3ª corda é **casa 7**!
* E na 5ª corda é casa 7 -> logo, E na 3ª corda é **casa 9**!`,
          },
          {
            id: 'vl10-p3',
            title: '3. A Região das Tríades Centrais',
            contentMarkdown: `### Onde Moram as Melodias Intermediárias

As cordas 4 e 3 fornecem o recheio harmônico dos acordes dedilhados. Dominar essas duas cordas permite criar vozes intermediárias fluidas que transformam um acompanhamento comum em um arranjo profissional.`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-10',
          title: 'Exercício 10 — Oitavas Cruzadas 6ª-4ª e 5ª-3ª Cordas',
          subtitle: 'Conectando as fundamentais às suas oitavas no centro do braço',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar no bordão, indicador na corda superior',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 5 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'up', fret: 5 },
          ],
          tablatureText: `e|--------------------------|
B|--------------------------|
G|----------5---------------|
D|------5-------------------|
A|--------------3-----------|
E|--3-----------------------|
    G (6ª)  G (4ª) C (5ª) C (3ª)`,
          instructions: [
            'Toque o par Sol (6ª e 4ª corda) e em seguida o par Dó (5ª e 3ª corda).',
            'Observe que ambos usam o formato "pula uma corda e avança duas casas".',
          ],
          biomechanicTips: [
            'Use os dedos 1 e 3 em ambas as posições.',
          ],
          validationCriteria: 'Compreensão intuitiva do atalho geométrico de oitavas.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: Arpejo Duplo com Oitavas',
          description: 'A base do dedilhado moderno em violão acústico.',
          tab: `e|--------------------------|
B|--------------------------|
G|------5-------7-----------|
D|----5---5---7---7---------|
A|--3-------5---------------|
E|--------------------------|`,
        },
        commonErrors: [
          { issue: 'Tentar usar o atalho de 2 casas na 2ª corda.', solution: 'Atenção: o atalho de 2 casas só vale para as cordas 6->4 e 5->3!' }
        ],
        challenge: {
          title: 'Encontre a Nota F',
          description: 'Localize a nota F na 4ª corda usando o atalho da 6ª corda.',
          instruction: 'F na 6ª corda é casa 1 -> logo, F na 4ª corda é casa 3!'
        },
        masteryCriteria: {
          learning: 'Entende a relação de oitava entre 6ª-4ª e 5ª-3ª cordas.',
          consolidating: 'Encontra notas nas cordas 4 e 3 em menos de 2 segundos.',
          mastered: 'Navega pelas cordas médias com facilidade mecânica total.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'As cordas 4 e 3 são as pontes harmônicas entre o grave e o agudo.'
      },
      {
        id: 'violao-lesson-11',
        level: 1,
        moduleTitle: 'Módulo 2 • Localização de Notas',
        moduleNumber: 2,
        lessonNumber: 11,
        title: 'Mapeando a Segunda e Primeira Cordas (B3 e E4)',
        subtitle: 'As cordas do canto: onde vivem as melodias e extensões harmônicas',
        objective: 'Mapear as cordas agudas (B e E) e compreender o espelhamento idêntico entre a 1ª e a 6ª corda.',
        estimatedMinutes: 20,
        prerequisites: ['Aulas 8 a 10 concluídas.'],
        parts: [
          {
            id: 'vl11-p1',
            title: '1. O Presente da 1ª Corda: É Idêntica à 6ª Corda!',
            contentMarkdown: `### 100% de Aproveitamento de Estudo

A 1ª corda é afinada em **E4**, exatamente duas oitavas acima da 6ª corda (**E2**).
* Isso significa que **todas as notas de todas as casas da 1ª corda têm os mesmos nomes da 6ª corda!**
* Casa 1 na 1ª corda = **F** (igual à 6ª corda)
* Casa 3 na 1ª corda = **G** (igual à 6ª corda)
* Casa 5 na 1ª corda = **A** (igual à 6ª corda)
* Casa 7 na 1ª corda = **B** (igual à 6ª corda)
* Casa 8 na 1ª corda = **C** (igual à 6ª corda)
* Casa 10 na 1ª corda = **D** (igual à 6ª corda)
* Casa 12 na 1ª corda = **E** (igual à 6ª corda)
Se você aprendeu a 6ª corda na Aula 8, você já sabe a 1ª corda inteira!`,
          },
          {
            id: 'vl11-p2',
            title: '2. Mapeando a 2ª Corda (Si / B3)',
            contentMarkdown: `### A Corda do Canto Melódico

A 2ª corda tem afinação em Si (B):
* **Casa 0:** B (Si)
* **Casa 1:** C (Dó) — *semitom natural de B para C!*
* **Casa 3:** D (Ré)
* **Casa 5:** E (Mi)
* **Casa 6:** F (Fá) — *semitom natural de E para F!*
* **Casa 8:** G (Sol)
* **Casa 10:** A (Lá)
* **Casa 12:** B (Si)`,
          },
          {
            id: 'vl11-p3',
            title: '3. A Afinação em Terça Maior entre as Cordas 3 e 2',
            contentMarkdown: `### Por que o Violão Não é Afinado Apenas em Quartas

Todas as cordas do violão têm 5 semitons de distância, exceto entre a **3ª corda (G) e a 2ª corda (B)**, que tem apenas **4 semitons (terça maior)**.
Essa escolha histórica foi feita para permitir que os acordes abertos mais comuns (C, G, E, D, A) pudessem ser alcançados confortavelmente pelos quatro dedos da mão humana!`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-11',
          title: 'Exercício 11 — Melodia em Duas Cordas Agudas (1ª e 2ª)',
          subtitle: 'Tocando temas melódicos claros nas cordas agudas a 60 BPM',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Indicador (i) e médio (m) alternados na mão direita',
          notesSequence: [
            { stringNumber: 2, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 1 },
            { stringNumber: 2, noteCipher: 'D', notePt: 'Ré', pickDirection: 'up', fret: 3 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 1, noteCipher: 'F', notePt: 'Fá', pickDirection: 'up', fret: 1 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
          ],
          tablatureText: `e|----------0---1---3---|
B|--1---3---------------|
G|----------------------|
D|----------------------|
A|----------------------|
E|----------------------|
    C   D   E   F   G
    i   m   i   m   i`,
          instructions: [
            'Alterne rigorosamente indicador (i) e médio (m) na mão direita.',
            'Escute o timbre cristalino do topo melódico.',
          ],
          biomechanicTips: [
            'Não levante os dedos em excesso longe da escala (economia de movimento).',
          ],
          validationCriteria: 'Alternância limpa entre indicador e médio sem falhas de articulação.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: Frase Lírica de Abertura',
          description: 'As cordas 1 e 2 conduzem a linha cantada sobre os acordes de violão.',
          tab: `e|--3---1---0-----------|
B|--------------3---1---|
G|----------------------|
D|----------------------|
A|----------------------|
E|----------------------|`,
        },
        commonErrors: [
          { issue: 'Usar apenas o indicador na mão direita.', solution: 'Pratique a caminhada de dois dedos (i - m) desde o início para ganhar velocidade e fluidez.' }
        ],
        challenge: {
          title: 'Desafio Espelho',
          description: 'Toque a casa 8 da 6ª corda e a casa 8 da 1ª corda simultaneamente.',
          instruction: 'Comprove que ambas são a nota Dó (C) separadas por exatamente duas oitavas.'
        },
        masteryCriteria: {
          learning: 'Reconhece o espelhamento entre 1ª e 6ª cordas.',
          consolidating: 'Toca melodias nas cordas 1 e 2 alternando indicador e médio.',
          mastered: 'Visualiza as notas de todas as 6 cordas de forma integrada.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'As cordas agudas são as cantoras do arranjo: trate-as com sensibilidade dinâmica.'
      },
      {
        id: 'violao-lesson-12',
        level: 1,
        moduleTitle: 'Módulo 2 • Localização de Notas',
        moduleNumber: 2,
        lessonNumber: 12,
        title: 'Memorização Total do Braço: O Jogo das Ocorrências',
        subtitle: 'Exercício mestre: localize todas as notas G, C, D e A em todas as 6 cordas',
        objective: 'Desenvolver a habilidade de encontrar qualquer nota em todas as cordas e casas sem consultar diagramas virtuais.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 7 a 11 concluídas.'],
        parts: [
          {
            id: 'vl12-p1',
            title: '1. O Desafio da Nota Única em Todo o Braço',
            contentMarkdown: `### O Método dos Mestres de Violão

Para dominar o braço, escolha uma única nota (por exemplo, **G**) e encontre-a em todas as seis cordas da 6ª até a 1ª:
* **6ª corda:** Casa 3
* **5ª corda:** Casa 10
* **4ª corda:** Casa 5
* **3ª corda:** Casa 0 (solta) ou Casa 12
* **2ª corda:** Casa 8
* **1ª corda:** Casa 3
Ao conectar esses pontos, você não vê mais trastes isolados, mas sim uma **constelação geométrica** conectada!`,
          },
          {
            id: 'vl12-p2',
            title: '2. A Constelação de Dó (C)',
            contentMarkdown: `### O Mapeamento Completo da Nota Dó (C)

* **6ª corda:** Casa 8
* **5ª corda:** Casa 3
* **4ª corda:** Casa 10
* **3ª corda:** Casa 5
* **2ª corda:** Casa 1
* **1ª corda:** Casa 8
Memorize essa forma: 8, 3, 10, 5, 1, 8. É a assinatura de C no violão!`,
          },
          {
            id: 'vl12-p3',
            title: '3. A Ferramenta: Mapa Inteligente do Braço',
            contentMarkdown: `### Use o Laboratório Interativo da Plataforma

Na aba **Braço Interativo** da Guitar Academy, acesse o **Mapa Inteligente do Braço**:
* Selecione a nota que deseja treinar.
* O sistema destacará instantaneamente todas as ocorrências.
* Use o modo **Desafio de Localização** para testar seu tempo de resposta no violão físico!`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-12',
          title: 'Exercício 12 — A Constelação Completa de Sol (G)',
          subtitle: 'Tocando todas as ocorrências de G da 6ª à 1ª corda a 60 BPM',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar nas cordas graves, indicador nas agudas',
          notesSequence: [
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 10 },
            { stringNumber: 4, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 5 },
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 0 },
            { stringNumber: 2, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 8 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
          ],
          tablatureText: `e|--------------------------3---|
B|----------------------8-------|
G|--------------0---------------|
D|----------5-------------------|
A|------10----------------------|
E|--3---------------------------|
    G   G   G   G   G   G`,
          instructions: [
            'Toque cada ocorrência de G mantendo o andamento contínuo.',
            'Conecte visualmente a localização de cada nota no violão físico.',
          ],
          biomechanicTips: [
            'Deslize suavemente a mão entre a casa 3, casa 10, casa 5 e casa 8.',
          ],
          validationCriteria: 'Execução de todas as 6 ocorrências de G em menos de 10 segundos.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Pedal de Sol em Diferentes Oitavas',
          description: 'A sustentação da mesma nota em diferentes registros cria efeito orquestral no violão.',
          tab: `e|------3-------3-------3-------|
B|----8-------8-------8---------|
G|--0-------0-------0-----------|
D|------------------------------|
A|------------------------------|
E|------------------------------|`,
        },
        commonErrors: [
          { issue: 'Tentar memorizar o número da casa sem pensar no som da nota.', solution: 'Ouça o tom da nota e associe a sensação tátil da casa à altura sonora.' }
        ],
        challenge: {
          title: 'Desafio Mestre do Módulo 2',
          description: 'Faça a constelação de Ré (D) nas 6 cordas: 6ª(10), 5ª(5), 4ª(0 ou 12), 3ª(7), 2ª(3), 1ª(10).',
          instruction: 'Treine até conseguir fazer a constelação de qualquer nota em menos de 12 segundos.'
        },
        masteryCriteria: {
          learning: 'Encontra todas as ocorrências de uma nota com auxílio visual.',
          consolidating: 'Encontra ocorrências de G, C e D no violão físico em andamento constante.',
          mastered: 'Localiza qualquer uma das 12 notas em qualquer corda instantaneamente.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Você agora domina o mapa do braço. O próximo passo é entender como os acordes nascem dos intervalos no Módulo 3.'
      }
    ]
  },

  // =======================================================================
  // MÓDULO 3 — FORMAÇÃO DOS ACORDES E INTERVALOS (Aulas 13 a 18)
  // =======================================================================
  {
    id: 'violao-mod-3',
    moduleNumber: 3,
    title: 'Formação dos Acordes e Intervalos',
    subtitle: 'Compreenda a ciência harmônica: tríades, tétrades e extensões',
    badge: 'Módulo 3 • Harmonia & Acordes',
    description: 'Tons, semitons, intervalos musicais de 2ª a 8ª, construção de tríades maiores, menores, diminutas e aumentadas, acordes com 7ª e extensões (add9, sus2, sus4).',
    lessons: [
      {
        id: 'violao-lesson-13',
        level: 2,
        moduleTitle: 'Módulo 3 • Intervalos & Formação',
        moduleNumber: 3,
        lessonNumber: 13,
        title: 'Tons e Semitons: A Métrica da Harmonia',
        subtitle: 'Distâncias intervalares no violão: a física acústica dos passos musicais',
        objective: 'Compreender a diferença prática e teórica entre tom e semitom e como eles formam as escalas e acordes.',
        estimatedMinutes: 20,
        prerequisites: ['Módulos 1 e 2 concluídos.'],
        parts: [
          {
            id: 'vl13-p1',
            title: '1. O Tijolo Fundamental da Música',
            contentMarkdown: `### Semitom (1 casa) e Tom Inteiro (2 casas)

* **1 Semitom (ST):** Distância de **1 casa**. É o menor passo do violão.
* **1 Tom (T):** Distância de **2 casas** (1 Tom = 2 Semitons).
* Se você está na casa 3 (G) e avança 1 casa (G#), andou **1 semitom**.
* Se você está na casa 3 (G) e avança 2 casas (A), andou **1 tom inteiro**.`,
          },
          {
            id: 'vl13-p2',
            title: '2. A Escala Maior em Tons e Semitons',
            contentMarkdown: `### A Fórmula Universal da Escala Maior

Toda escala maior segue rigorosamente a mesma sequência de passos:
\`\`\`
Tom - Tom - Semitom - Tom - Tom - Tom - Semitom
(T - T - ST - T - T - T - ST)
\`\`\`
Em Dó (C):
* C -> (+1T) -> D -> (+1T) -> E -> (+1ST) -> F -> (+1T) -> G -> (+1T) -> A -> (+1T) -> B -> (+1ST) -> C`,
          },
          {
            id: 'vl13-p3',
            title: '3. Visualizando a Fórmula em Uma Única Corda',
            contentMarkdown: `### Tocando a Escala Maior Linearmente

Para visualizar a fórmula T-T-ST-T-T-T-ST, toque na 5ª corda partindo de C (casa 3):
* Casa 3 (C) + 2 casas = Casa 5 (D)
* Casa 5 (D) + 2 casas = Casa 7 (E)
* Casa 7 (E) + 1 casa  = Casa 8 (F)
* Casa 8 (F) + 2 casas = Casa 10 (G)
* Casa 10 (G) + 2 casas = Casa 12 (A)
* Casa 12 (A) + 2 casas = Casa 14 (B)
* Casa 14 (B) + 1 casa  = Casa 15 (C)`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-13',
          title: 'Exercício 13 — A Escala Maior Linear na 5ª Corda',
          subtitle: 'Aplicando T-T-ST-T-T-T-ST a partir da casa 3 a 60 BPM',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar apoiado',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 5, noteCipher: 'D', notePt: 'Ré', pickDirection: 'down', fret: 5 },
            { stringNumber: 5, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 7 },
            { stringNumber: 5, noteCipher: 'F', notePt: 'Fá', pickDirection: 'down', fret: 8 },
            { stringNumber: 5, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 10 },
            { stringNumber: 5, noteCipher: 'A', notePt: 'Lá', pickDirection: 'down', fret: 12 },
            { stringNumber: 5, noteCipher: 'B', notePt: 'Si', pickDirection: 'down', fret: 14 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 15 },
          ],
          tablatureText: `e|----------------------------------------------------|
B|----------------------------------------------------|
G|----------------------------------------------------|
D|----------------------------------------------------|
A|--3---5---7---8---10---12---14---15-----------------|
E|----------------------------------------------------|
    C   D   E   F    G    A    B    C`,
          instructions: [
            'Observe a geometria dos dedos: onde há 1 casa de salto e onde as casas são coladas (7-8 e 14-15).',
          ],
          biomechanicTips: [
            'Use os dedos 1 e 3 para saltos de 1 tom e dedos 1 e 2 para semitons.',
          ],
          validationCriteria: 'Consciência imediata da fórmula T-T-ST-T-T-T-ST no instrumento físico.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Hino da Alegria Linear',
          description: 'A melodia imortal de Beethoven construída com passos simples de tom e semitom.',
          tab: `e|--------------------------|
B|--------------------------|
G|--------------------------|
D|--------------------------|
A|--7---7---8---10--10--8---|
E|--------------------------|
    E   E   F   G   G   F`,
        },
        commonErrors: [
          { issue: 'Avançar 2 casas de Mi para Fá.', solution: 'Mi e Fá são colados: apenas 1 casa de avanço!' }
        ],
        challenge: {
          title: 'Aplique em Sol (G)',
          description: 'Toque a mesma fórmula T-T-ST-T-T-T-ST partindo da 6ª corda na casa 3 (G).',
          instruction: 'G (3), A (5), B (7), C (8), D (10), E (12), F# (14), G (15).'
        },
        masteryCriteria: {
          learning: 'Compreende a diferença entre tom e semitom.',
          consolidating: 'Toca a escala linear em qualquer corda com a fórmula correta.',
          mastered: 'Reconhece auditiva e visualmente passos de tom e semitom.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Tons e semitons são as distâncias atômicas que constroem todos os intervalos.'
      },
      {
        id: 'violao-lesson-14',
        level: 2,
        moduleTitle: 'Módulo 3 • Intervalos & Formação',
        moduleNumber: 3,
        lessonNumber: 14,
        title: 'Os Intervalos Musicais: O DNA de Todos os Sons',
        subtitle: 'Da segunda menor à oitava: identificação, som e distâncias em casas',
        objective: 'Compreender os 12 intervalos musicais em relação à nota fundamental e como eles geram sensações de consonância e dissonância.',
        estimatedMinutes: 20,
        prerequisites: ['Aula 13 concluída.'],
        parts: [
          {
            id: 'vl14-p1',
            title: '1. O que é um Intervalo Musical',
            contentMarkdown: `### A Distância Entre Duas Alturas Sonoras

Um **intervalo** é a distância entre duas notas. É o intervalo que dá "personalidade" ao acorde ou à melodia:
* **2ª menor (1 semitom):** Tensão extrema, suspense (efeito tubarão).
* **2ª maior (2 semitons):** Movimento suave de caminhada melódica.
* **3ª menor (3 semitons):** A cor melancólica, solene e misteriosa dos acordes menores.
* **3ª maior (4 semitons):** A cor alegre, luminosa e estável dos acordes maiores.
* **4ª justa (5 semitons):** Firmeza, hino, abertura.
* **Trítono (6 semitons / b5 / #4):** Tensão máxima, o motor da resolução harmônica!
* **5ª justa (7 semitons):** A base sólida, o som puro dos power chords.
* **6ª maior (9 semitons):** Sonoridade doce de Bossa Nova e MPB.
* **7ª menor (10 semitons):** O som do Blues e da tensão dominante (G7).
* **7ª maior (11 semitons):** Sonoridade sonhadora, poética e cinematográfica (Cmaj7).
* **8ª justa (12 semitons):** Conclusão perfeita em oitava.`,
          },
          {
            id: 'vl14-p2',
            title: '2. A Tabela Prática de Casas no Violão',
            contentMarkdown: `### Distâncias em Casas a Partir da Mesma Corda

* Fundamental: Casa 0 (ou casa X)
* +1 casa = 2ª menor
* +2 casas = 2ª maior
* +3 casas = 3ª menor
* +4 casas = 3ª maior
* +5 casas = 4ª justa
* +6 casas = Trítono (b5)
* +7 casas = 5ª justa
* +8 casas = 6ª menor
* +9 casas = 6ª maior
* +10 casas = 7ª menor
* +11 casas = 7ª maior
* +12 casas = Oitava justa`,
          },
          {
            id: 'vl14-p3',
            title: '3. A Terça: A Rainha dos Acordes',
            contentMarkdown: `### O que Decide se um Acorde é Maior ou Menor?

Apenas a **terça**!
* Fundamental + **3ª Maior (4 casas)** + 5ª Justa = **Acorde Maior** (C = C - E - G)
* Fundamental + **3ª Menor (3 casas)** + 5ª Justa = **Acorde Menor** (Cm = C - Eb - G)
Mudar apenas 1 traste na terça transforma alegria em melancolia!`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-14',
          title: 'Exercício 14 — Comparação Auditiva 3ª Maior vs 3ª Menor',
          subtitle: 'Sentindo a diferença emocional entre Dó Maior e Dó Menor',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar e indicador juntos',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 2 },
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'D#', notePt: 'Ré#', pickDirection: 'up', fret: 1 },
          ],
          tablatureText: `e|--------------------------|
B|--------------------------|
G|--------------------------|
D|------2-----------1-------|
A|--3-----------3-----------|
E|--------------------------|
    3ª Maior    3ª Menor (Eb)`,
          instructions: [
            'Toque Dó com Mi (casa 3 na 5ª corda + casa 2 na 4ª corda) -> 3ª Maior.',
            'Depois toque Dó com Mib (casa 3 na 5ª corda + casa 1 na 4ª corda) -> 3ª Menor.',
            'Feche os olhos e sinta a mudança radical no humor acústico.',
          ],
          biomechanicTips: [
            'Mantenha o dedo na nota Dó fixo enquanto muda apenas a terça.',
          ],
          validationCriteria: 'Reconhecimento auditivo imediato do caráter maior vs menor.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Intervalo de 7ª Maior (Cmaj7)',
          description: 'A beleza nostálgica da 7ª maior soando contra a fundamental.',
          tab: `e|--------------------------|
B|------0-------0-----------|
G|--------------------------|
D|--------------------------|
A|--3-------3-------3-------|
E|--------------------------|
    C (5ª)  B (2ª corda solta = 7ªM!)`,
        },
        commonErrors: [
          { issue: 'Confundir 7ª maior com 7ª menor.', solution: '7ª maior fica a 1 semitom da oitava; 7ª menor fica a 1 tom inteiro da oitava.' }
        ],
        challenge: {
          title: 'Desafio do Trítono',
          description: 'Toque Dó (5ª corda casa 3) e Fá# (4ª corda casa 4) e ouça a famosa tensão do trítono.',
          instruction: 'Depois resolva para Dó e Sol (5ª corda casa 3 + 4ª corda casa 5).'
        },
        masteryCriteria: {
          learning: 'Conhece os nomes dos intervalos de 2ª a 8ª.',
          consolidating: 'Calcula o número de semitons de qualquer intervalo.',
          mastered: 'Identifica intervalos de ouvido com alta precisão.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Intervalos são os blocos construtores de toda a harmonia tonal.'
      },
      {
        id: 'violao-lesson-15',
        level: 2,
        moduleTitle: 'Módulo 3 • Intervalos & Formação',
        moduleNumber: 3,
        lessonNumber: 15,
        title: 'Formação das Tríades: Maior, Menor, Diminuta e Aumentada',
        subtitle: 'Como três notas combinadas formam os quatro tipos fundamentais de acordes',
        objective: 'Compreender as fórmulas das 4 tríades (Maior, Menor, Diminuta e Aumentada) e saber empilhar terças no violão físico.',
        estimatedMinutes: 20,
        prerequisites: ['Aulas 13 e 14 concluídas.'],
        parts: [
          {
            id: 'vl15-p1',
            title: '1. O que é uma Tríade',
            contentMarkdown: `### O Acorde Básico de 3 Notas

Uma tríade é formada por três notas empilhadas por intervalos de terça:
1. **Fundamental (1):** A nota que dá nome ao acorde.
2. **Terça (3):** Define se é maior ou menor.
3. **Quinta (5):** Define a estabilidade (justa, diminuta ou aumentada).`,
          },
          {
            id: 'vl15-p2',
            title: '2. As Quatro Fórmulas Mestras de Tríade',
            contentMarkdown: `### As 4 Qualidades de Tríade

1. **Tríade Maior:** 1 - 3M - 5J
   * Em C: **C - E - G** (3ªM = 4 semitons, 5ªJ = 7 semitons)
2. **Tríade Menor:** 1 - 3m - 5J
   * Em C: **C - Eb - G** (3ªm = 3 semitons, 5ªJ = 7 semitons)
3. **Tríade Diminuta (dim):** 1 - 3m - 5dim
   * Em C: **C - Eb - Gb** (3ªm = 3 semitons, 5ªdim = 6 semitons)
4. **Tríade Aumentada (aug):** 1 - 3M - 5aum
   * Em C: **C - E - G#** (3ªM = 4 semitons, 5ªaum = 8 semitons)`,
          },
          {
            id: 'vl15-p3',
            title: '3. A Tríade Fechada nas Cordas 1, 2 e 3',
            contentMarkdown: `### Onde o Violonista Aplica as Tríades

No violão, tocamos tríades em formatos compactos nas cordas agudas:
* Tríade de Dó Maior fundamental nas cordas 3, 2 e 1:
  * 3ª corda casa 5 (C)
  * 2ª corda casa 5 (E)
  * 1ª corda casa 3 (G)
Som limpo, direto e sem duplicar notas desnecessariamente!`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-15',
          title: 'Exercício 15 — Tríades Fechadas nas Cordas 3, 2 e 1',
          subtitle: 'Alternando entre Dó Maior e Dó Menor nas cordas agudas',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado p - i - m nas cordas 3, 2, 1',
          notesSequence: [
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 2, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 5 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 3 },
            { stringNumber: 3, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 5 },
            { stringNumber: 2, noteCipher: 'D#', notePt: 'Ré#', pickDirection: 'up', fret: 4 },
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 3 },
          ],
          tablatureText: `e|------3-----------3-------|
B|------5-----------4-------|
G|------5-----------5-------|
D|--------------------------|
A|--------------------------|
E|--------------------------|
    Dó Maior    Dó Menor (Cm)`,
          instructions: [
            'Toque o bloco C (5-5-3) e em seguida Cm (5-4-3).',
            'Note que apenas a 2ª corda recuou 1 casa (de Mi para Mib).',
          ],
          biomechanicTips: [
            'Faça meia pestana na casa 5 com o dedo 3 para o maior.',
          ],
          validationCriteria: 'As 3 cordas devem soar perfeitamente balanceadas.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Riff de Tríades Pop/Rock',
          description: 'Tríades agudas são muito usadas em violão para não brigar com o baixo da banda.',
          tab: `e|----3---3---5---5---|
B|----5---5---6---6---|
G|----5---5---7---7---|
D|--------------------|
A|--------------------|
E|--------------------|
      C         Dm`,
        },
        commonErrors: [
          { issue: 'Abafar a 1ª corda ao pressionar a 2ª corda.', solution: 'Curve o dedo da 2ª corda para deixar a 1ª vibrar livre.' }
        ],
        challenge: {
          title: 'Monte a Tríade de Sol Maior (G)',
          description: 'Quais são as 3 notas de G maior? Onde você as localiza nas cordas 4, 3 e 2?',
          instruction: 'Notas: G - B - D. 4ª corda casa 5 (G), 3ª corda casa 4 (B), 2ª corda casa 3 (D).'
        },
        masteryCriteria: {
          learning: 'Sabe a fórmula das 4 tríades (M, m, dim, aug).',
          consolidating: 'Identifica e monta tríades maiores e menores no braço.',
          mastered: 'Conecta tríades ao longo do braço com agilidade.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Tríades são a base de qualquer acorde complexo. Se você domina a tríade, domina o acorde.'
      },
      {
        id: 'violao-lesson-16',
        level: 2,
        moduleTitle: 'Módulo 3 • Intervalos & Formação',
        moduleNumber: 3,
        lessonNumber: 16,
        title: 'Formação dos Acordes com Sétima: 7, maj7, m7 e m7(b5)',
        subtitle: 'A adição da quarta nota que traz sofisticação e estilo musical',
        objective: 'Compreender a adição da sétima (maior, menor ou diminuta) à tríade básica e seu impacto estético.',
        estimatedMinutes: 20,
        prerequisites: ['Aula 15 concluída.'],
        parts: [
          {
            id: 'vl16-p1',
            title: '1. O Salto para as Tétrades (4 Notas)',
            contentMarkdown: `### Por que Adicionar a Sétima?

Na música brasileira (bossa nova, choro, MPB) e no jazz, quase não tocamos tríades simples. Usamos **tétrades** (acordes de 4 notas):
1. **7 Dominante (1 - 3M - 5J - 7m):** Tensão que pede resolução (ex: G7, C7).
2. **maj7 / 7M (1 - 3M - 5J - 7M):** Sonoridade aveludada, sofisticada (ex: Cmaj7, Amaj7).
3. **m7 (1 - 3m - 5J - 7m):** Suave, melancólico, moderno (ex: Am7, Em7, Dm7).
4. **m7(b5) / Meio-diminuto (1 - 3m - 5dim - 7m):** Acorde de preparação dramática (ex: Bm7b5).`,
          },
          {
            id: 'vl16-p2',
            title: '2. Comparando C, C7 e Cmaj7',
            contentMarkdown: `### A Diferença Prática em Dó

* **C (tríade):** C - E - G (alegre, direto)
* **C7 (com 7ª menor):** C - E - G - **Bb** (bluesy, pede para ir para F!)
* **Cmaj7 (com 7ª maior):** C - E - G - **B** (sonhador, contemplativo, Bossa Nova)`,
          },
          {
            id: 'vl16-p3',
            title: '3. A Magia dos Acordes Abertos com Sétima',
            contentMarkdown: `### No Violão Físico é Muitas Vezes Mais Fácil!

Curiosamente, no violão, muitos acordes com sétima são **mais fáceis de tocar** que suas versões simples, pois exigem menos dedos ou aproveitam cordas soltas:
* Cmaj7: basta tirar o dedo 1 do acorde de C tradicional!
* Em7: basta tirar o dedo 3 do acorde de Em tradicional!
* Am7: basta tirar o dedo 3 do acorde de Am tradicional!`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-16',
          title: 'Exercício 16 — De C a Cmaj7 e C7 no Violão Aberto',
          subtitle: 'Transformando o acorde de Dó com apenas 1 movimento de dedo',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar na 5ª corda e dedilhado i - m - a nas cordas 3, 2, 1',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 4, noteCipher: 'E', notePt: 'Mi', pickDirection: 'up', fret: 2 },
            { stringNumber: 3, noteCipher: 'G', notePt: 'Sol', pickDirection: 'up', fret: 0 },
            { stringNumber: 2, noteCipher: 'B', notePt: 'Si', pickDirection: 'up', fret: 0 },
          ],
          tablatureText: `e|--0-------0-------0---|
B|--1-------0-------1---|
G|--0-------0-------3---|
D|--2-------2-------2---|
A|--3-------3-------3---|
E|----------------------|
    C     Cmaj7    C7`,
          instructions: [
            'Toque C tradicional.',
            'Tire o dedo 1 (a 2ª corda solta é Si = 7ª maior) -> Cmaj7 instantâneo!',
            'Coloque o dedo 4 na casa 3 da 3ª corda (Bb = 7ª menor) -> C7 dominante!',
          ],
          biomechanicTips: [
            'Ouça com atenção a dramaticidade de cada variação.',
          ],
          validationCriteria: 'Diferenciação clara entre C, Cmaj7 e C7 de ouvido.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: Garota de Ipanema (Abertura)',
          description: 'A clássica progressão Fmaj7 - G7 - Gm7 - C7 que revolucionou a harmonia mundial.',
          tab: `e|--0-------1-------1-------0---|
B|--1-------0-------1-------1---|
G|--2-------0-------1-------3---|
D|--3-------0-------0-------2---|
A|--------------------------3---|
E|--1-------3-------3-----------|
  Fmaj7     G7     Gm7      C7`,
        },
        commonErrors: [
          { issue: 'Chamar C7 de Cmaj7.', solution: 'C7 tem sétima menor (Bb). Cmaj7 tem sétima maior (B natural).' }
        ],
        challenge: {
          title: 'Desafio Em para Em7',
          description: 'Toque o acorde Em e retire o dedo 3. Qual corda solta passou a soar e qual nota ela produz?',
          instruction: 'A 4ª corda solta passa a soar a nota D (Ré), que é a 7ª menor de Mi!'
        },
        masteryCriteria: {
          learning: 'Distingue a fórmula de 7, maj7 e m7.',
          consolidating: 'Toca C, Cmaj7, C7, Em, Em7, Am, Am7 com naturalidade.',
          mastered: 'Aplica tétrades em qualquer estilo com sensibilidade harmônica.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'As sétimas são o tempero da harmonia moderna. Nunca mais toque apenas acordes simples.'
      },
      {
        id: 'violao-lesson-17',
        level: 2,
        moduleTitle: 'Módulo 3 • Intervalos & Formação',
        moduleNumber: 3,
        lessonNumber: 17,
        title: 'Extensões Harmônicas: 6, 9, add9, 11, 13, Sus2 e Sus4',
        subtitle: 'Como adicionar notas de cor sem perder a essência do acorde',
        objective: 'Compreender as extensões superiores (9ª, 11ª, 13ª, 6ª) e os acordes suspensos (sus2, sus4) que definem o som do violão contemporâneo.',
        estimatedMinutes: 25,
        prerequisites: ['Aula 16 concluída.'],
        parts: [
          {
            id: 'vl17-p1',
            title: '1. A Diferença Crucial entre 9 e add9',
            contentMarkdown: `### 9 vs. add9: Não Perca Esta Distinção!

* **add9 (Adicionada):** É uma **tríade simples** + a nona. NÃO tem sétima!
  * Exemplo: Cadd9 = C - E - G - D. (Sonoridade limpa, pop, folk, worship).
* **9 (Nona Dominante):** É uma **tétrade com 7ª menor** + a nona!
  * Exemplo: C9 = C - E - G - Bb - D. (Sonoridade funk, blues, bossa).
* **maj9 (Nona Maior):** É uma **tétrade com 7ª maior** + a nona!
  * Exemplo: Cmaj9 = C - E - G - B - D. (Sonoridade jazz, cinematográfica).`,
          },
          {
            id: 'vl17-p2',
            title: '2. Os Acordes Suspensos: Sus2 e Sus4',
            contentMarkdown: `### Acordes Sem Terça (Suspense Harmônico)

Nos acordes suspensos, **substituímos a terça** pela 2ª ou pela 4ª:
* **Sus2 (1 - 2M - 5J):** Troca a terça pela segunda. Sonoridade aberta, flutuante.
  * Exemplo: Dsus2 = D - E - A.
* **Sus4 (1 - 4J - 5J):** Troca a terça pela quarta. Cria uma tensão que pede para resolver no acorde maior!
  * Exemplo: Dsus4 = D - G - A (resolve naturalmente em D!).`,
          },
          {
            id: 'vl17-p3',
            title: '3. Extensões de 6ª e 13ª',
            contentMarkdown: `### O Brilho da Sexta

* **C6 (1 - 3M - 5J - 6M):** C - E - G - A. Sonoridade doce, vintage, MPB.
* **Am6 (1 - 3m - 5J - 6M):** A - C - E - F#. Clássica harmonia menor melódica.`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-17',
          title: 'Exercício 17 — A Sequência de Resolução Dsus4 -> D -> Dsus2',
          subtitle: 'O clássico movimento de 1 dedo na 1ª corda',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Dedilhado ou batida suave nas cordas 4, 3, 2, 1',
          notesSequence: [
            { stringNumber: 1, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
            { stringNumber: 1, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'down', fret: 2 },
            { stringNumber: 1, noteCipher: 'E', notePt: 'Mi', pickDirection: 'down', fret: 0 },
            { stringNumber: 1, noteCipher: 'F#', notePt: 'Fá#', pickDirection: 'down', fret: 2 },
          ],
          tablatureText: `e|--3-------2-------0-------2---|
B|--3-------3-------3-------3---|
G|--2-------2-------2-------2---|
D|--0-------0-------0-------0---|
A|------------------------------|
E|------------------------------|
  Dsus4     D     Dsus2     D`,
          instructions: [
            'Mantenha o acorde de Ré fixo.',
            'Adicione o dedo 4 na casa 3 da 1ª corda (Dsus4).',
            'Tire o dedo 4 voltando para o D tradicional (casa 2).',
            'Tire o dedo 2 deixando a 1ª corda solta (Dsus2).',
            'Volte ao D tradicional.',
          ],
          biomechanicTips: [
            'Apenas o dedo na 1ª corda se move. A estrutura de D permanece imóvel.',
          ],
          validationCriteria: 'Fluidez no movimento do dedo mínimo sem interromper o som das outras cordas.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: O Som Acústico dos Anos 70 e 90',
          description: 'Usado em clássicos de Led Zeppelin, Pink Floyd, Oasis e worship moderno.',
          tab: `e|--3---2---0---2---3---2---|
B|--3---3---3---3---3---3---|
G|--2---2---2---2---2---2---|
D|--0---0---0---0---0---0---|
A|--------------------------|
E|--------------------------|`,
        },
        commonErrors: [
          { issue: 'Tocar a 6ª e 5ª cordas no acorde de Ré.', solution: 'Abra o acorde apenas a partir da 4ª corda solta.' }
        ],
        challenge: {
          title: 'Descubra a Nota Nona de C',
          description: 'Se C é a fundamental, conte 9 notas na escala maior para descobrir quem é a 9ª.',
          instruction: 'C(1), D(2), E(3), F(4), G(5), A(6), B(7), C(8), D(9)! A nona de Dó é Ré!'
        },
        masteryCriteria: {
          learning: 'Distingue add9 de acordes com 7ª e 9ª.',
          consolidating: 'Executa a sequência Dsus4 -> D -> Dsus2 com perfeição motora.',
          mastered: 'Aplica extensões de cor harmônica espontaneamente em progressões.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Extensões são a assinatura sonora do violão sofisticado contemporâneo.'
      },
      {
        id: 'violao-lesson-18',
        level: 2,
        moduleTitle: 'Módulo 3 • Intervalos & Formação',
        moduleNumber: 3,
        lessonNumber: 18,
        title: 'Construindo Acordes por Conta Própria',
        subtitle: 'A independência definitiva: monte qualquer cifra no braço sem consultar tabelas',
        objective: 'Ensinar o método dedutivo de construção de acordes a partir da fundamental, intervalos e geometria do violão.',
        estimatedMinutes: 25,
        prerequisites: ['Aulas 13 a 17 concluídas.'],
        parts: [
          {
            id: 'vl18-p1',
            title: '1. O Método dos Três Passos',
            contentMarkdown: `### Como Criar Qualquer Acorde do Zero

Nunca mais fique refém de dicionários de cifras. Siga estes 3 passos:
1. **Passo 1 — Identifique as Notas Teóricas:**
   * Qual é a fórmula do acorde?
   * Exemplo: Em7 = 1 (E) + 3m (G) + 5J (B) + 7m (D).
2. **Passo 2 — Localize a Fundamental no Braço:**
   * Onde está o baixo mais confortável? 6ª corda solta (E) ou 5ª corda casa 7 (E)?
3. **Passo 3 — Distribua as Outras Notas nas Cordas Vizinha:**
   * Encontre G, B e D nas casas mais próximas possíveis, garantindo que sua mão alcance sem tensão!`,
          },
          {
            id: 'vl18-p2',
            title: '2. Estudo de Caso: Construindo um Cadd9',
            contentMarkdown: `### Da Fórmula à Posição Física

1. **Fórmula de Cadd9:** 1 (C) + 3M (E) + 5J (G) + 9 (D).
2. **Fundamental:** 5ª corda casa 3 = **C**.
3. **Terça:** 4ª corda casa 2 = **E**.
4. **Quinta:** 3ª corda solta = **G**.
5. **Nona:** 2ª corda casa 3 = **D**.
6. **Agudo:** 1ª corda casa 3 = **G** (reforço de 5ª) ou solta = **E** (reforço de 3ª).
Resultado: **[-1, 3, 2, 0, 3, 3]** — o lendário Cadd9 do violão moderno!`,
          },
          {
            id: 'vl18-p3',
            title: '3. A Ferramenta: Laboratório de Acordes',
            contentMarkdown: `### Valide Suas Ideias na Plataforma

Acesse o **Laboratório de Acordes** na Guitar Academy:
* Digite qualquer cifra (ex: \`Cmaj7\`, \`Gadd9\`, \`F#m7b5\`).
* O sistema decompõe fundamental, fórmula, notas teóricas e exibe as formas fisicamente validadas no violão acústico!`,
          }
        ],
        practicalExercise: {
          id: 'ex-vl-18',
          title: 'Exercício 18 — Construção Prática de Cadd9 e Gadd9',
          subtitle: 'Tocando acordes construídos a partir da fórmula teórica',
          targetBpm: 60,
          targetRepetitions: 5,
          timeSignature: { beats: 4, noteValue: 4 },
          pickingPattern: 'Polegar e dedilhado em bloco',
          notesSequence: [
            { stringNumber: 5, noteCipher: 'C', notePt: 'Dó', pickDirection: 'down', fret: 3 },
            { stringNumber: 6, noteCipher: 'G', notePt: 'Sol', pickDirection: 'down', fret: 3 },
          ],
          tablatureText: `e|--3-------3---|
B|--3-------3---|
G|--0-------0---|
D|--2-------0---|
A|--3-------2---|
E|----------3---|
  Cadd9   Gadd9`,
          instructions: [
            'Observe que os dedos 3 e 4 permanecem fixos na casa 3 das cordas 1 e 2.',
            'Apenas os dedos 1 e 2 sobem da posição de Cadd9 para Gadd9!',
          ],
          biomechanicTips: [
            'Essa âncora de 2 dedos é o segredo do pop acústico e do worship contemporâneo.',
          ],
          validationCriteria: 'Transição perfeita em menos de meio segundo mantendo a âncora.',
        },
        musicalApplication: {
          title: 'Aplicação Musical: A Conexão Cadd9 - Gadd9',
          description: 'A troca de acordes mais bonita e fluida de todo o repertório de violão acústico.',
          tab: `e|----3---3-------3---3---|
B|----3---3-------3---3---|
G|----0---0-------0---0---|
D|----2---2-------0---0---|
A|--3-----------2---------|
E|------------3-----------|`,
        },
        commonErrors: [
          { issue: 'Tentar montar acordes com notas impossíveis de alcançar fisicamente.', solution: 'Distribua as vozes usando cordas soltas sempre que possível para facilitar a digitação.' }
        ],
        challenge: {
          title: 'Desafio Autônomo',
          description: 'Construa mentalmente o acorde de Am7: quais são suas notas e qual a digitação aberta mais econômica?',
          instruction: 'Notas: A - C - E - G. Digitação: [-1, 0, 2, 0, 1, 0] (basta 2 dedos!).'
        },
        masteryCriteria: {
          learning: 'Compreende os 3 passos de construção de acordes.',
          consolidating: 'Monta acordes add9 e sus no braço sem consultar cifras.',
          mastered: 'Constrói qualquer acorde a partir da cifra de forma instantânea.'
        },
        speedGoals: { startingBpm: 60, intermediateBpm: 75, targetBpm: 90 },
        reviewNotes: 'Parabéns: você conquistou a independência teórica para construir qualquer harmonia.'
      }
    ]
  }
];

// =========================================================================
// CONSOLIDAÇÃO DOS 10 MÓDULOS E 60 AULAS DO DOMÍNIO TOTAL DO VIOLÃO
// =========================================================================
export const VIOLAO_MODULES: ViolaoCourseModule[] = [
  ...VIOLAO_MODULES_1_TO_3,
  ...VIOLAO_MODULES_4_TO_6,
  ...VIOLAO_MODULES_7_TO_10
];

export const VIOLAO_LESSONS: ViolaoLesson[] = VIOLAO_MODULES.flatMap((m) => m.lessons);


// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO DE CONSERVATÓRIO
// Módulo de Conteúdo Oficial V1 — src/data/keyboardCourse.ts
// 100% tipado, progressivo e compatível com a interface Lesson
// =========================================================================

import { KeyboardLesson, KeyboardCourseLevel } from '../types';

export const KEYBOARD_COURSE_LEVELS: KeyboardCourseLevel[] = [
  {
    "level": 0,
    "name": "NÍVEL 0 — FUNDAMENTOS E MECÂNICA INSTRUMENTAL",
    "subtitle": "Geografia do teclado, postura ao piano, numeração dos dedos 1 a 5 e independência inicial",
    "badge": "Fundamentos",
    "description": "A base ergonômica e acústica do tecladista/pianista: identificação dos grupos de teclas pretas (2 e 3), peso natural do braço, relaxamento dos ombros e primeiros movimentos coordenados com as mãos separadas e juntas.",
    "lessons": [
      {
        "id": "teclado-l-0-1",
        "level": 0,
        "moduleTitle": "Módulo 1: Geografia e Postura ao Teclado",
        "lessonNumber": 1,
        "title": "Aula 1 — Geografia das Teclas, Ponto do Dó Central (C4) e Postura Neutra",
        "subtitle": "Mapeamento visual das 88/61 teclas através dos grupos de 2 e 3 teclas pretas",
        "objective": "Reconhecer instantaneamente qualquer nota no teclado e sentar-se ao piano com alinhamento esquelético sem tensões musculares.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-C5",
        "parts": [
          {
            "id": "kl01-p1",
            "title": "1. O Mapa das Teclas: O Segredo dos Grupos de Teclas Pretas",
            "contentMarkdown": "\n### Como Navegar em 88 ou 61 Teclas sem se Perder\n\nO teclado parece intimidador pelo número de teclas brancas idênticas. Porém, a chave de navegação está no padrão das **teclas pretas (acidentes: sustenidos e bemóis)**:\n\n* **Padrão Alternado:** As teclas pretas estão agrupadas em conjuntos de **2 teclas** e **3 teclas**.\n  * **O Dó (C):** É sempre a tecla branca imediatamente à esquerda do grupo de **2 teclas pretas**.\n  * **O Fá (F):** É sempre a tecla branca imediatamente à esquerda do grupo de **3 teclas pretas**.\n* **Dó Central (C4 / Middle C):** É o Dó situado no centro físico do teclado (na altura do logotipo da marca). É o ponto de referência onde a mão esquerda (clave de fá) encontra a mão direita (clave de sol).\n\n```\n========================================================================\nGEOGRAFIA VISUAL DO TECLADO (OITAVA PADRÃO)\n========================================================================\n   [C#] [D#]         [F#] [G#] [A#]   <- Teclas Pretas (Grupos de 2 e 3)\n  |  |   |  |       |  |   |  |   |  |\n  |C | D | E |  F   |G | A | B |C |   <- Teclas Brancas (Notas Naturais)\n========================================================================\nRegra:\n* Antes de 2 pretas = C (Dó)\n* Entre 2 pretas    = D (Ré)\n* Depois de 2 pretas = E (Mi)\n* Antes de 3 pretas = F (Fá)\n* Depois de 3 pretas = B (Si)\n========================================================================\n```\n            "
          },
          {
            "id": "kl01-p2",
            "title": "2. Postura e Peso do Braço (Weight Technique)",
            "contentMarkdown": "\n### Ergonomia ao Piano: O Som Vem da Gravidade, Não da Força\n\n1. **Altura do Banco:** Os cotovelos devem ficar levemente acima da altura das teclas, formando um ângulo de aproximadamente 100° a 110°.\n2. **Pés no Chão:** Pés apoiados firmemente no chão (sensação de aterramento) para sustentar o tronco sem sobrecarregar a lombar.\n3. **Forma da Mão:** A mão deve manter a curvatura natural e relaxada, como se segurasse uma bola de tênis ou uma maçã fresca. Os dedos nunca devem desabar suas falanges!\n            "
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-0-1-ex",
          "title": "Exercício 1 — Localização Espacial dos Dós e Sustentação",
          "subtitle": "Mapeamento de todos os Dós do teclado com metrônomo",
          "targetBpm": 60,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Toque com peso de braço (Arm Weight) e relaxamento",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nMD: [ C4 ] ---- [ C5 ] ---- [ C4 ] ---- [ C3 ]\nME: [ C3 ] ---- [ C2 ] ---- [ C3 ] ---- [ C4 ]\nContagem: 1   2   3   4   1   2   3   4\n          ",
          "instructions": [
            "Localize o Dó Central (C4) com o dedo 1 (polegar) da mão direita.",
            "Toque e sustente por 4 tempos a 60 BPM sentindo o peso do braço afundar a tecla até o fundo.",
            "Salte para o C5 (oitava acima) no tempo 1 do próximo compasso.",
            "Repita com a mão esquerda no C3 e C2."
          ],
          "biomechanicTips": [
            "Deixe o pulso flexível e elástico; nunca trave a articulação do punho."
          ],
          "validationCriteria": "Localizar todos os Dós do instrumento a 60 BPM sem olhar para os dedos.",
          "precisionCriteria": [
            "Localize o Dó Central (C4) com o dedo 1 (polegar) da mão direita.",
            "Toque e sustente por 4 tempos a 60 BPM sentindo o peso do braço afundar a tecla até o fundo.",
            "Salte para o C5 (oitava acima) no tempo 1 do próximo compasso.",
            "Repita com a mão esquerda no C3 e C2."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq01-1",
              "question": "Qual é o ponto de referência visual para localizar a nota Dó (C) no teclado?",
              "options": [
                "A tecla branca imediatamente à esquerda do grupo de 2 teclas pretas",
                "A tecla branca no meio do grupo de 3 teclas pretas",
                "A primeira tecla preta da esquerda",
                "A tecla branca imediatamente à direita do grupo de 3 teclas pretas"
              ],
              "correctIndex": 0,
              "explanation": "O Dó (C) situa-se sempre imediatamente à esquerda das duas teclas pretas em qualquer oitava."
            },
            {
              "id": "kq01-2",
              "question": "Em um piano de 88 teclas padrão de conservatório, onde se localiza o Dó Central (C4)?",
              "options": [
                "É o quarto Dó contando da esquerda para a direita, situado imediatamente antes do grupo de 2 teclas pretas no centro geométrico do instrumento",
                "Na primeira tecla preta da ponta esquerda",
                "Na tecla branca mais aguda da extremidade direita",
                "Exatamente no pedal de sustain"
              ],
              "correctIndex": 0,
              "explanation": "O Dó Central é denominado C4 porque é a quarta nota Dó na extensão de um piano standard, servindo de divisor de águas entre a Clave de Fá e a Clave de Sol."
            }
          ]
        }
      },
      {
        "id": "teclado-l-0-2",
        "level": 0,
        "moduleTitle": "Módulo 1: Geografia e Postura ao Teclado",
        "lessonNumber": 2,
        "title": "Aula 2 — Numeração Canônica dos Dedos (1 a 5) e a Posição de Dó Maior",
        "subtitle": "Identificação de dedos em ambas as mãos e articulação independente",
        "objective": "Internalizar a numeração universal de dedos (1 a 5 para MD e ME) e executar a posição estática de 5 dedos (C-D-E-F-G).",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-G4",
        "parts": [
          {
            "id": "kl02-p1",
            "title": "1. A Numeração Universal dos Dedos no Piano",
            "contentMarkdown": "\n### Sistema Internacional de Digitação Pianística\n\nDiferente do violão e guitarra (onde os dedos da mão esquerda são 1 a 4 e o polegar não conta na digitação de notas), no teclado e piano **ambas as mãos usam os 5 dedos**:\n\n```\n========================================================================\nNUMERAÇÃO DOS DEDOS (MÃO ESQUERDA E MÃO DIREITA)\n========================================================================\nDedo 1 -> Polegar (Thumb)\nDedo 2 -> Indicador (Index)\nDedo 3 -> Médio (Middle)\nDedo 4 -> Anelar (Ring)\nDedo 5 -> Mínimo / Mindinho (Pinky)\n========================================================================\nAtenção: A numeração é SIMÉTRICA a partir do centro do corpo!\nOs dois polegares são 1; os dois mínimos são 5.\n========================================================================\n```\n            "
          },
          {
            "id": "kl02-p2",
            "title": "2. A Posição de Cinco Dedos (Five-Finger Pattern em Dó)",
            "contentMarkdown": "\n### Mão Direita (C4 a G4):\n* Dedo 1 no Dó (C4)\n* Dedo 2 no Ré (D4)\n* Dedo 3 no Mi (E4)\n* Dedo 4 no Fá (F4)\n* Dedo 5 no Sol (G4)\n\n### Mão Esquerda (C3 a G3):\n* Dedo 5 no Dó (C3)\n* Dedo 4 no Ré (D3)\n* Dedo 3 no Mi (E3)\n* Dedo 2 no Fá (F3)\n* Dedo 1 no Sol (G3)\n            "
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-0-2-ex",
          "title": "Exercício 2 — Subida e Descida dos Cinco Dedos com Articulação Legato",
          "subtitle": "Toque conectado sem sobreposição de sons",
          "targetBpm": 70,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Articulação Legato (uma tecla sobe exatamente quando a outra desce)",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nMD: 1-2-3-4-5-4-3-2-1 (C D E F G F E D C)\nME: 5-4-3-2-1-2-3-4-5 (C D E F G F E D C)\n          ",
          "instructions": [
            "Pratique primeiro com a Mão Direita sozinha a 50 BPM.",
            "Pratique com a Mão Esquerda sozinha a 50 BPM.",
            "Una as duas mãos a 60 BPM e atinja 70 BPM com articulação legato cristalina."
          ],
          "biomechanicTips": [
            "O polegar toca com a lateral externa da ponta, nunca deitado plano na tecla."
          ],
          "validationCriteria": "12 repetições perfeitas com som uniforme e sem notas emboladas.",
          "precisionCriteria": [
            "Pratique primeiro com a Mão Direita sozinha a 50 BPM.",
            "Pratique com a Mão Esquerda sozinha a 50 BPM.",
            "Una as duas mãos a 60 BPM e atinja 70 BPM com articulação legato cristalina."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq02-1",
              "question": "Na notação de digitação para teclado e piano, a qual dedo corresponde o número 1 em ambas as mãos?",
              "options": [
                "Ao Polegar",
                "Ao Indicador",
                "Ao Dedo Médio",
                "Ao Mindinho"
              ],
              "correctIndex": 0,
              "explanation": "No piano e teclado, o dedo 1 é sempre o polegar, tanto na mão direita quanto na mão esquerda."
            },
            {
              "id": "kq02-2",
              "question": "Qual é a numeração universal dos dedos adotada na literatura de teclado e piano para ambas as mãos?",
              "options": [
                "1 = Polegar, 2 = Indicador, 3 = Médio, 4 = Anelar, 5 = Mínimo",
                "1 = Indicador, 2 = Médio, 3 = Anelar, 4 = Mínimo, 5 = Polegar",
                "1 = Mínimo da mão esquerda e 5 = Mínimo da mão direita",
                "Não há numeração de dedos no teclado"
              ],
              "correctIndex": 0,
              "explanation": "Em todo o mundo, a digitação de piano numera os dedos de 1 (polegar) a 5 (mindinho) em ambas as mãos de forma simétrica."
            }
          ]
        }
      },
      {
        "id": "teclado-l-0-3",
        "level": 0,
        "moduleTitle": "Módulo 1: Geografia e Postura ao Teclado",
        "lessonNumber": 3,
        "title": "Aula 3 — Coordenação e Independência Inicial das Mãos",
        "subtitle": "Movimento paralelo, movimento contrário e sustentação de nota longa na ME",
        "objective": "Desenvolver a independência motora das mãos: manter a mão esquerda sustentando enquanto a mão direita articula frases melódicas.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-G4",
        "parts": [
          {
            "id": "kl03-p1",
            "title": "1. O Desafio da Independência: Quebrando o Reflexo em Espelho",
            "contentMarkdown": "\n### A Batalha Cerebral: Mão Direita Independente da Esquerda\n\nO cérebro humano tende naturalmente a espelhar os movimentos das duas mãos. Para tocar teclado, precisamos desassociar a atividade motora:\n1. **Movimento Contrário:** Ambas as mãos abrem (MD sobe de 1 a 5 enquanto ME desce de 1 a 5). É o exercício mais natural para iniciar.\n2. **Sustentação vs Movimento:** A mão esquerda toca um acorde ou nota longa de 4 tempos (semibreve) enquanto a mão direita toca 4 notas em semínimas.\n            "
          },
          {
            "id": "teclado-l-0-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-0-3-ex",
          "title": "Exercício 3 — Baixo Sustentado na ME com Melodia na MD",
          "subtitle": "Primeiro acompanhamento real a duas mãos",
          "targetBpm": 65,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "ME: Semibreve sustentada / MD: Semínimas em legato",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 1 (C):\nMD: 1 (C) - 2 (D) - 3 (E) - 4 (F) | 5 (G) - 4 (F) - 3 (E) - 2 (D)\nME: 5 (C3) sustentado nos 4 tempos | 5 (C3) sustentado nos 4 tempos\n          ",
          "instructions": [
            "Toque o C3 na mão esquerda e segure a tecla pressionada durante os 4 cliques do metrônomo.",
            "Enquanto segura a ME, articule os tempos 1, 2, 3, 4 com a mão direita.",
            "Meta: 50 -> 65 BPM sem que a mão esquerda levante antes da hora."
          ],
          "biomechanicTips": [
            "Não tensione o pulso da mão esquerda enquanto ela sustenta a nota."
          ],
          "validationCriteria": "10 execuções sem falha de sustentação nem descompasso entre as mãos.",
          "precisionCriteria": [
            "Toque o C3 na mão esquerda e segure a tecla pressionada durante os 4 cliques do metrônomo.",
            "Enquanto segura a ME, articule os tempos 1, 2, 3, 4 com a mão direita.",
            "Meta: 50 -> 65 BPM sem que a mão esquerda levante antes da hora."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq03-1",
              "question": "Por que o movimento contrário entre as mãos é pedagogicamente mais fácil no início do estudo de piano?",
              "options": [
                "Porque utiliza dedos idênticos simultaneamente (ex: dedos 1 juntos, dedos 2 juntos), respeitando a simetria motora do cérebro",
                "Porque o piano só aceita notas contrárias",
                "Porque a mão esquerda é mais rápida que a direita",
                "Porque não precisa de metrônomo"
              ],
              "correctIndex": 0,
              "explanation": "No movimento contrário, dedos equivalentes (1 e 1, 2 e 2, etc.) tocam juntos, facilitando a sinapse cerebral inicial."
            },
            {
              "id": "kq03-2",
              "question": "Qual estratégia motora permite desenvolver independência real entre as mãos no teclado?",
              "options": [
                "Tocar uma das mãos em notas longas (mínimas/semibreves) enquanto a outra executa notas em movimento (semínimas/colcheias)",
                "Tocar as duas mãos sempre nas mesmas notas e nos mesmos tempos para sempre",
                "Praticar apenas com a mão direita e esquecer a esquerda",
                "Olhar fixamente para a mão esquerda com os olhos vendados na direita"
              ],
              "correctIndex": 0,
              "explanation": "A independência é conquistada desacoplando as velocidades: manter uma mão como âncora harmônica estável enquanto a outra desenvolve fluidez rítmica."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 1,
    "name": "NÍVEL 1 — ACORDES E ACOMPANHAMENTO",
    "subtitle": "Escalas maiores com passagem do polegar, tríades fundamentais e inversões sem saltos",
    "badge": "Iniciação",
    "description": "A fundação harmônica: a técnica do \"Thumb-Under\" (passagem do polegar), montagem instantânea de acordes maiores e menores e o conceito sagrado de Voice Leading (condução suave de vozes).",
    "lessons": [
      {
        "id": "teclado-l-1-1",
        "level": 1,
        "moduleTitle": "Módulo 2: O Mecanismo da Escala e Tríades",
        "lessonNumber": 4,
        "title": "Aula 4 — Escala Maior e a Técnica da Passagem do Polegar (Thumb-Under)",
        "subtitle": "Como tocar mais de 5 notas consecutivas sem interromper o som",
        "objective": "Executar a escala de Dó Maior (C) em 1 e 2 oitavas com passagem suave do polegar por baixo da mão sem solavancos no braço.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-C5",
        "parts": [
          {
            "id": "kl04-p1",
            "title": "1. O Segredo da Passagem do Polegar (Thumb-Under)",
            "contentMarkdown": "\n### Como Tocar 8 Notas com Apenas 5 Dedos\n\nComo a mão humana só possui 5 dedos e a escala tem 7 notas mais a repetição da oitava, precisamos de um mecanismo para deslocar a mão: a **passagem do polegar por baixo**.\n\n```\n========================================================================\nDIGITAÇÃO DA ESCALA DE DÓ MAIOR (MÃO DIREITA):\nNotas:   C   D   E | F   G   A   B | C\nDedos:   1   2   3 | 1   2   3   4 | 5\n                   ^ Passagem do dedo 1 por baixo do dedo 3!\n========================================================================\nDIGITAÇÃO DA ESCALA DE DÓ MAIOR (MÃO ESQUERDA):\nNotas:   C   D   E   F   G | A   B | C\nDedos:   5   4   3   2   1 | 3   2 | 1\n                           ^ Passagem do dedo 3 por cima do dedo 1!\n========================================================================\n```\n            "
          },
          {
            "id": "teclado-l-1-1-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-1-1-ex",
          "title": "Exercício 4 — Passagem Fluida do Polegar em Dó Maior",
          "subtitle": "Eliminando o solavanco do cotovelo na passagem",
          "targetBpm": 75,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Subida: 1-2-3-1-2-3-4-5 / Descida: 5-4-3-2-1-3-2-1",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nMD: C(1) D(2) E(3) -> F(1) G(2) A(3) B(4) C(5)\nDescida: C(5) B(4) A(3) G(2) F(1) -> E(3) D(2) C(1)\n          ",
          "instructions": [
            "Toque Dó (1), Ré (2), Mi (3).",
            "Enquanto o dedo 3 pressiona o Mi, mova o polegar (1) suavemente por baixo da palma da mão, apontando em direção ao Fá.",
            "Assim que o polegar toca o Fá, a mão se acomoda na nova posição.",
            "Meta: 60 -> 75 BPM com intensidade milimetricamente idêntica em todas as notas."
          ],
          "biomechanicTips": [
            "Não levante o cotovelo para o lado como uma asa de frango ao passar o polegar."
          ],
          "validationCriteria": "10 escalas completas (subindo e descendo) a 75 BPM sem acento acidental na nota Fá.",
          "precisionCriteria": [
            "Toque Dó (1), Ré (2), Mi (3).",
            "Enquanto o dedo 3 pressiona o Mi, mova o polegar (1) suavemente por baixo da palma da mão, apontando em direção ao Fá.",
            "Assim que o polegar toca o Fá, a mão se acomoda na nova posição.",
            "Meta: 60 -> 75 BPM com intensidade milimetricamente idêntica em todas as notas."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq04-1",
              "question": "Na escala de Dó Maior executada pela Mão Direita, após qual dedo ocorre a passagem do polegar por baixo?",
              "options": [
                "Após o dedo 3 (tocando o Mi)",
                "Após o dedo 5",
                "Após o dedo 1",
                "Após o dedo 4"
              ],
              "correctIndex": 0,
              "explanation": "A digitação padrão de C maior na MD é 1-2-3 no C-D-E, passando o polegar por baixo do dedo 3 para alcançar o Fá."
            },
            {
              "id": "kq04-2",
              "question": "Na escala de Dó Maior na mão direita, em qual momento ocorre a passagem do polegar (Thumb-Under)?",
              "options": [
                "Após o dedo 3 (Médio) tocar a nota Mi (E), o polegar (Dedo 1) passa por baixo da palma para alcançar a nota Fá (F)",
                "Após o dedo 5 tocar a nota Si",
                "Antes de começar a escala",
                "O polegar nunca passa por baixo dos outros dedos"
              ],
              "correctIndex": 0,
              "explanation": "O dedilhado clássico 1-2-3-1-2-3-4-5 passa o polegar suavemente por baixo do dedo 3 na transição de Mi para Fá, permitindo tocar escalas fluidas e infinitas."
            }
          ]
        }
      },
      {
        "id": "teclado-l-1-2",
        "level": 1,
        "moduleTitle": "Módulo 2: O Mecanismo da Escala e Tríades",
        "lessonNumber": 5,
        "title": "Aula 5 — Formação de Tríades Maiores e Menores (Estrutura T - 3 - 5)",
        "subtitle": "Construção anatômica de acordes com os dedos 1 - 3 - 5",
        "objective": "Formar qualquer tríade maior ou menor no teclado utilizando a fórmula intervalar de semitons e a digitação confortável 1-3-5.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-C5",
        "parts": [
          {
            "id": "kl05-p1",
            "title": "1. A Fórmula Científica das Tríades: Terças Sobrepostas",
            "contentMarkdown": "\n### Como Qualquer Acorde é Construído\n\nUm acorde em tríade é formado pela sobreposição de **duas terças**:\n* **Tríade Maior (Ex: C = C - E - G):**\n  * Da Tônica para a 3ª: **4 semitons** (Terça Maior - intervalo alegre e aberto).\n  * Da 3ª para a 5ª: **3 semitons** (Terça Menor).\n* **Tríade Menor (Ex: Cm = C - Eb - G):**\n  * Da Tônica para a 3ª: **3 semitons** (Terça Menor - intervalo melancólico).\n  * Da 3ª para a 5ª: **4 semitons** (Terça Maior).\n\n```\n========================================================================\nDIGITAÇÃO PADRÃO DE TRÍADE (MÃO DIREITA):\nDedo 1 -> Tônica (ex: C)\nDedo 3 -> Terça  (ex: E ou Eb)\nDedo 5 -> Quinta (ex: G)\n========================================================================\n```\n            "
          },
          {
            "id": "teclado-l-1-2-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-1-2-ex",
          "title": "Exercício 5 — Alternância Maior/Menor em C, G, D e F",
          "subtitle": "Percepção auditiva e motora da descida do dedo 3 em meio tom",
          "targetBpm": 60,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Toque bloco simultâneo das 3 teclas com peso de braço",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nC Maior:  [C - E - G]   (Dedos 1-3-5)\nC Menor:  [C - Eb - G]  (Dedo 3 desce 1 semitom para a tecla preta)\nG Maior:  [G - B - D]   -> G Menor: [G - Bb - D]\n          ",
          "instructions": [
            "Toque o acorde de C Maior e sustente por 4 tempos.",
            "No próximo compasso, deslize apenas o dedo 3 para o Eb, formando Cm.",
            "Observe que os dedos 1 e 5 permanecem estáticos nas mesmas teclas.",
            "Meta: 60 BPM com ataque 100% simultâneo das 3 notas."
          ],
          "biomechanicTips": [
            "As 3 notas devem soar exatamente no mesmo milissegundo, como um único bloco sonoro."
          ],
          "validationCriteria": "Executar o ciclo de C, Cm, G, Gm, D, Dm a 60 BPM sem flutuação rítmica.",
          "precisionCriteria": [
            "Toque o acorde de C Maior e sustente por 4 tempos.",
            "No próximo compasso, deslize apenas o dedo 3 para o Eb, formando Cm.",
            "Observe que os dedos 1 e 5 permanecem estáticos nas mesmas teclas.",
            "Meta: 60 BPM com ataque 100% simultâneo das 3 notas."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq05-1",
              "question": "Quantos semitons separam a Tônica da Terça em uma Tríade Menor?",
              "options": [
                "3 semitons",
                "4 semitons",
                "2 semitons",
                "5 semitons"
              ],
              "correctIndex": 0,
              "explanation": "A terça menor mede exatamente 3 semitons (um tom e meio) acima da tônica."
            },
            {
              "id": "kq05-2",
              "question": "Qual é a estrutura de semitons que forma uma Tríade Maior fundamental (ex.: C Maior: C - E - G)?",
              "options": [
                "Terça Maior (4 semitons) entre Tônica e 3ª, e Terça Menor (3 semitons) entre 3ª e 5ª",
                "Terça Menor (3 semitons) e depois Terça Maior (4 semitons)",
                "Dois intervalos de segunda maior",
                "Três notas pretas consecutivas"
              ],
              "correctIndex": 0,
              "explanation": "Uma tríade maior é composta por uma terça maior (4 semitons da tônica) somada a uma terça menor (3 semitons acima), totalizando uma quinta justa de 7 semitons."
            }
          ]
        }
      },
      {
        "id": "teclado-l-1-3",
        "level": 1,
        "moduleTitle": "Módulo 2: O Mecanismo da Escala e Tríades",
        "lessonNumber": 6,
        "title": "Aula 6 — Inversões de Acordes e Condução Suave de Vozes (Voice Leading)",
        "subtitle": "Eliminando saltos desnecessários entre acordes com notas comuns",
        "objective": "Tocar progressões harmônicas conectando as inversões mais próximas dos acordes (estado fundamental, 1ª e 2ª inversões).",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-G4",
        "parts": [
          {
            "id": "kl05-p2",
            "title": "1. O que são Inversões de Acordes",
            "contentMarkdown": "\n### Por que Músicos Profissionais Não Ficam \"Pulando\" no Teclado\n\nSe para tocar C - F - G você mover a mão inteira em blocos fundamentais, o som parecerá amador e desconectado. As **inversões** mudam a nota do baixo do acorde sem alterar suas notas:\n\n* **Posição Fundamental:** Tônica no grave $\\rightarrow$ $[C - E - G]$ (Dedos 1-3-5)\n* **1ª Inversão:** Terça no grave $\\rightarrow$ $[E - G - C]$ (Dedos 1-2-5)\n* **2ª Inversão:** Quinta no grave $\\rightarrow$ $[G - C - E]$ (Dedos 1-3-5 ou 1-2-4)\n\n```\n========================================================================\nVOICE LEADING PERFEITO NA PROGRESSÃO C -> F -> G -> C:\n========================================================================\nAcorde C (Fundamental): [ C - E - G ]  (Dedos 1 - 3 - 5)\nAcorde F (2ª Inversão):  [ C - F - A ]  (Dedos 1 - 3 - 5) -> O Dó é NOTA COMUM!\nAcorde G (1ª Inversão):  [ B - D - G ]  (Dedos 1 - 2 - 5) -> Deslocamento de 1 mm!\nAcorde C (Fundamental): [ C - E - G ]  (Dedos 1 - 3 - 5)\n========================================================================\nObserve que a mão praticamente NÃO SAI DO LUGAR!\n========================================================================\n```\n            "
          },
          {
            "id": "teclado-l-1-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-1-3-ex",
          "title": "Exercício 6 — A Progressão Pop C - G - Am - F com Inversões",
          "subtitle": "A mais famosa cadência musical com economia total de movimento",
          "targetBpm": 65,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "MD: Acordes em bloco / ME: Baixo oitavado na tônica",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nC:  MD: [C-E-G]  | ME: C (grave)\nG:  MD: [B-D-G]  | ME: G (grave)\nAm: MD: [C-E-A]  | ME: A (grave)\nF:  MD: [C-F-A]  | ME: F (grave)\n          ",
          "instructions": [
            "Conecte os 4 acordes mantendo a nota comum sempre que ela existir.",
            "Mão esquerda marca a tônica no tempo 1.",
            "Meta: 65 BPM com transições instantâneas."
          ],
          "biomechanicTips": [
            "A mão não deve flutuar no ar durante as trocas; os dedos deslizam pelas teclas vizinhas."
          ],
          "validationCriteria": "10 ciclos consecutivos em 65 BPM com zero pausas de hesitação entre os compassos.",
          "precisionCriteria": [
            "Conecte os 4 acordes mantendo a nota comum sempre que ela existir.",
            "Mão esquerda marca a tônica no tempo 1.",
            "Meta: 65 BPM com transições instantâneas."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq06-1",
              "question": "Qual é a estrutura de notas de um acorde de Fá Maior (F) em sua 2ª Inversão?",
              "options": [
                "C - F - A",
                "F - A - C",
                "A - C - F",
                "F - C - A"
              ],
              "correctIndex": 0,
              "explanation": "A 2ª inversão coloca a quinta no grave (C), seguida pela tônica (F) e terça (A)."
            },
            {
              "id": "kq06-2",
              "question": "Em um acompanhamento pop/worship básico no teclado, como as funções das mãos costumam ser divididas?",
              "options": [
                "Mão esquerda toca a tônica do acorde (ou tônica + quinta/oitava) no grave, enquanto a mão direita toca a tríade na região média",
                "Mão esquerda toca a melodia agudíssima e mão direita toca os acordes no grave absoluto",
                "Ambas as mãos cruzadas tocam a mesma nota no mesmo instante",
                "A mão direita deve permanecer imóvel"
              ],
              "correctIndex": 0,
              "explanation": "A mão esquerda estabelece a âncora harmônica grave (baixo), liberando a mão direita para conduzir a harmonia intermediária e a condução rítmica."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 2,
    "name": "NÍVEL 2 — TÉCNICA E HARMONIA",
    "subtitle": "Campo harmônico maior, escalas menores, arpejos fluídos e padrões rítmicos",
    "badge": "Básico",
    "description": "Expansão harmônica completa: os 7 acordes do campo harmônico maior, escalas menores harmônica e melódica, arpejos distribuídos entre as mãos e dinâmicas expressivas.",
    "lessons": [
      {
        "id": "teclado-l-2-1",
        "level": 2,
        "moduleTitle": "Módulo 3: O Campo Harmônico e Acompanhamento",
        "lessonNumber": 7,
        "title": "Aula 7 — O Campo Harmônico Maior e Acompanhamento Pop/Worship",
        "subtitle": "Estrutura dos 7 graus (I, IIm, IIIm, IV, V, VIm, VIIº) e padrão rítmico moderno",
        "objective": "Tocar e reconhecer os 7 acordes diatônicos em Dó Maior e aplicar no clássico acompanhamento Pop/Worship com arpejo quebrado.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C2-G4",
        "parts": [
          {
            "id": "kl07-p1",
            "title": "1. A Família Diatônica do Campo Harmônico Maior",
            "contentMarkdown": "\n### Os Sete Graus Diatônicos Naturais\n\nConstruindo tríades exclusivamente sobre as teclas brancas da escala de Dó Maior:\n* **Grau I:** Dó Maior (C) — Maior\n* **Grau II:** Ré Menor (Dm) — Menor\n* **Grau III:** Mi Menor (Em) — Menor\n* **Grau IV:** Fá Maior (F) — Maior\n* **Grau V:** Sol Maior (G) — Maior\n* **Grau VI:** Lá Menor (Am) — Menor\n* **Grau VII:** Si Diminuto (Bº) — Diminuto\n            "
          },
          {
            "id": "teclado-l-2-1-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-2-1-ex",
          "title": "Exercício 7 — Levada Pop/Worship em C - G - Am - F",
          "subtitle": "Padrão arpejado com colcheias contínuas",
          "targetBpm": 70,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "MD: Baixo + Terça/Quinta alternadas / ME: Oitavas",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nMD: [Tônica] - [3ª/5ª] - [3ª/5ª] - [3ª/5ª] em colcheias\nME: Tônica oitavada no tempo 1\n          ",
          "instructions": [
            "Mão esquerda toca a oitava no tempo 1.",
            "Mão direita executa a pulsação em colcheias no padrão Worship.",
            "Meta: 70 BPM com dinâmica suave (mezzo-piano)."
          ],
          "biomechanicTips": [
            "Toque com o peso do braço amortecido pelo pulso para que o som seja aveludado."
          ],
          "validationCriteria": "8 repetições com balanço rítmico perfeitamente estável.",
          "precisionCriteria": [
            "Mão esquerda toca a oitava no tempo 1.",
            "Mão direita executa a pulsação em colcheias no padrão Worship.",
            "Meta: 70 BPM com dinâmica suave (mezzo-piano)."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq07-1",
              "question": "Qual grau do Campo Harmônico Maior possui a qualidade de acorde diminuto?",
              "options": [
                "O VII grau",
                "O III grau",
                "O VI grau",
                "O II grau"
              ],
              "correctIndex": 0,
              "explanation": "O VII grau é formado por duas terças menores sobrepostas (T - b3 - b5), resultando na tríade diminuta (Bº em C maior)."
            },
            {
              "id": "kq07-2",
              "question": "Quais notas formam a Primeira Inversão da tríade de Dó Maior (C/E) e qual nota fica no baixo?",
              "options": [
                "Notas E - G - C, com a terça (E) na voz mais grave",
                "Notas G - C - E, com a quinta (G) na voz mais grave",
                "Notas C - E - G, com a tônica (C) no baixo",
                "Apenas a nota Dó"
              ],
              "correctIndex": 0,
              "explanation": "Na primeira inversão (estado de sexta), a terça do acorde é transferida para o baixo, gerando a ordem intervalar E - G - C."
            }
          ]
        }
      },
      {
        "id": "teclado-l-2-2",
        "level": 2,
        "moduleTitle": "Módulo 3: O Campo Harmônico e Acompanhamento",
        "lessonNumber": 8,
        "title": "Aula 8 — Escalas Menores: Natural, Harmônica e Melódica",
        "subtitle": "A atração da sensível na escala harmônica e dedilhados simétricos",
        "objective": "Diferenciar e executar a escala de Lá Menor nas suas 3 formas (natural, harmônica com G# e melódica com F# e G#).",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "A2-A4",
        "parts": [
          {
            "id": "kl08-p1",
            "title": "1. As Três Faces da Tonalidade Menor",
            "contentMarkdown": "\n### Por que Existem Três Escalas Menores\n\n1. **Menor Natural (Am):** $A - B - C - D - E - F - G$ (Sem sensível; atração dominante fraca).\n2. **Menor Harmônica (Am):** $A - B - C - D - E - F - G\\#$ (O $G\\#$ cria a sensível que atrai de volta ao Lá, permitindo o acorde maior E7).\n3. **Menor Melódica (Am):** Sobe com $F\\#$ e $G\\#$; desce como menor natural.\n            "
          },
          {
            "id": "teclado-l-2-2-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-2-2-ex",
          "title": "Exercício 8 — Escala de Lá Menor Harmônica a 2 Mãos",
          "subtitle": "Atenção ao salto de segunda aumentada entre F e G#",
          "targetBpm": 75,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Legato estrito com passagem do polegar",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "B",
              "notePt": "Si",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nMD: A(1) B(2) C(3) D(1) E(2) F(3) G#(4) A(5)\n          ",
          "instructions": [
            "Articule a nota G# (tecla preta) com o dedo 4 com precisão cirúrgica.",
            "Meta: 60 -> 75 BPM."
          ],
          "biomechanicTips": [
            "Aproxime a mão ligeiramente para o fundo das teclas pretas para acomodar o dedo 4 no G#."
          ],
          "validationCriteria": "10 repetições perfeitas sem tropeçar no salto intervalar de F para G#.",
          "precisionCriteria": [
            "Articule a nota G# (tecla preta) com o dedo 4 com precisão cirúrgica.",
            "Meta: 60 -> 75 BPM."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq08-1",
              "question": "Qual alteração acidental transforma a escala de Lá Menor Natural em Lá Menor Harmônica?",
              "options": [
                "A elevação do 7º grau em meio tom (G para G#)",
                "A elevação do 3º grau",
                "O rebaixamento do 5º grau",
                "A elevação do 2º grau"
              ],
              "correctIndex": 0,
              "explanation": "A escala menor harmônica eleva o 7º grau em um semitom para criar a nota sensível que resolve na tônica."
            },
            {
              "id": "kq08-2",
              "question": "Por que a Escala Menor Harmônica eleva o sétimo grau em meio-tom (7ª Maior / Sensível)?",
              "options": [
                "Para criar uma sensível que resolve em semitom na tônica e transformar o acorde de grau V em um dominante maior (V7)",
                "Para complicar a leitura na partitura",
                "Para que a escala fique idêntica à escala maior",
                "Porque a escala menor não possui notas pretas"
              ],
              "correctIndex": 0,
              "explanation": "Sem o 7º grau elevado, o quinto grau da escala menor seria menor (v) sem atração tonal. Elevando a 7ª, o acorde V torna-se dominante maior (ex: E7 em Am), criando forte resolução."
            }
          ]
        }
      },
      {
        "id": "teclado-l-2-3",
        "level": 2,
        "moduleTitle": "Módulo 3: O Campo Harmônico e Acompanhamento",
        "lessonNumber": 9,
        "title": "Aula 9 — Arpejos Fluídos e Articulação Legato / Staccato",
        "subtitle": "Distribuição de notas entre as duas mãos e rotação de antebraço",
        "objective": "Executar arpejos de 2 oitavas conectando a mão esquerda e direita sem descontinuidade rítmica.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C2-C5",
        "parts": [
          {
            "id": "kl09-p1",
            "title": "1. Arpejos Pianísticos a Duas Mãos",
            "contentMarkdown": "\n### A Cascata de Notas: A Técnica de Arpejo Contínuo\n\nTocar arpejos estendidos no piano não é feito com uma mão só esticada, mas pela **passagem em revezamento entre ME e MD**:\n* ME toca: $C2 - G2 - C3$\n* MD assume imediatamente: $E3 - G3 - C4 - E4$\n* O movimento cria uma onda contínua que preenche qualquer introdução ou finalização de balada.\n            "
          },
          {
            "id": "teclado-l-2-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-2-3-ex",
          "title": "Exercício 9 — Arpejo em Cascata de Dó Maior e Sol Maior",
          "subtitle": "Revezamento entre as mãos a 80 BPM",
          "targetBpm": 80,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Revezamento fluido ME -> MD",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nME: [C2-G2] -> MD: [C3-E3-G3-C4] -> ME cruza por cima para [E4-G4]\n          ",
          "instructions": [
            "Conecte o arpejo com som aveludado e contínuo.",
            "Meta: 65 -> 80 BPM."
          ],
          "biomechanicTips": [
            "Use o movimento rotacional do antebraço para facilitar a fluidez."
          ],
          "validationCriteria": "10 cascatas de arpejo sem interrupção de som entre a troca de mãos.",
          "precisionCriteria": [
            "Conecte o arpejo com som aveludado e contínuo.",
            "Meta: 65 -> 80 BPM."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq09-1",
              "question": "Qual movimento biomecânico do braço facilita a execução de arpejos rápidos no piano?",
              "options": [
                "A rotação suave do antebraço (pronação e supinação) acompanhando a direção das notas",
                "Travar o pulso completamente rígido",
                "Bater com os dedos retos",
                "Tocar apenas com a ponta do polegar"
              ],
              "correctIndex": 0,
              "explanation": "A leve rotação do antebraço direciona o peso natural do braço para o dedo que está atacando a tecla."
            },
            {
              "id": "kq09-2",
              "question": "Qual é o segredo biomecânico para executar arpejos rápidos em duas oitavas sem tropeçar no teclado?",
              "options": [
                "Rotação suave do antebraço e pulso flexível que antecipa o deslocamento do polegar antes que o dedo anterior solte a tecla",
                "Manter o punho completamente engessado e rígido batendo com força",
                "Tocar todas as notas com o dedo indicador deslizando na horizontal",
                "Usar apenas o pedal sem tocar nas teclas"
              ],
              "correctIndex": 0,
              "explanation": "O arpejo fluente exige que a rotação lateral do punho transporte o braço suavemente ao longo do teclado, evitando saltos bruscos e tensões."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 3,
    "name": "NÍVEL 3 — HARMONIA FUNCIONAL",
    "subtitle": "Tétrades com sétima, cadência II-V-I, tensões (9, 11, 13) e Rootless Voicings",
    "badge": "Intermediário",
    "description": "A sofisticação do Jazz, MPB e Gospel moderno: tétrades de 4 sons (7M, 7, m7, m7b5), a cadência mestra II-V-I com voice leading e acordes sem tônica na mão direita.",
    "lessons": [
      {
        "id": "teclado-l-3-1",
        "level": 3,
        "moduleTitle": "Módulo 4: Tétrades e Cadências Modernas",
        "lessonNumber": 10,
        "title": "Aula 10 — Tétrades com Sétima (7M, 7, m7 e m7b5) e Aberturas Ricas",
        "subtitle": "Adicionando a quarta nota para enriquecer o som do piano",
        "objective": "Montar e aplicar tétrades maiores com sétima maior (C7M), dominantes (G7), menores (Dm7) e meio-diminutas (Bm7b5).",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-B4",
        "parts": [
          {
            "id": "kl10-p1",
            "title": "1. A Anatomia dos Quatro Tipos de Tétrades Diatônicas",
            "contentMarkdown": "\n### Acordes de Quatro Sons no Teclado\n\n* **7M (Sétima Maior):** $T - 3 - 5 - 7$ (Ex: C7M = C - E - G - B) $\\rightarrow$ Sonoridade suave e iluminada.\n* **7 (Dominante):** $T - 3 - 5 - b7$ (Ex: G7 = G - B - D - F) $\\rightarrow$ Contém o trítono de tensão que pede resolução.\n* **m7 (Menor com Sétima):** $T - b3 - 5 - b7$ (Ex: Dm7 = D - F - A - C) $\\rightarrow$ Aveludado e relaxado.\n* **m7b5 (Meio-Diminuto):** $T - b3 - b5 - b7$ (Ex: Bm7b5 = B - D - F - A) $\\rightarrow$ O acorde de tensão da tonalidade menor.\n            "
          },
          {
            "id": "teclado-l-3-1-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-3-1-ex",
          "title": "Exercício 10 — Tétrades Diatônicas em C7M - Dm7 - Em7 - F7M - G7",
          "subtitle": "Dedilhados confortáveis 1 - 2 - 3 - 5",
          "targetBpm": 70,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Dedos 1-2-3-5 na mão direita / Baixo na esquerda",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nC7M: [C-E-G-B] -> Dm7: [D-F-A-C] -> G7: [G-B-D-F]\n          ",
          "instructions": [
            "Toque cada tétrade articulando as 4 notas juntas.",
            "Meta: 60 -> 70 BPM."
          ],
          "biomechanicTips": [
            "Abra a mão confortavelmente utilizando os dedos 1-2-3-5 para a tétrade fundamental."
          ],
          "validationCriteria": "8 repetições perfeitas com ataque simultâneo de todas as 4 notas.",
          "precisionCriteria": [
            "Toque cada tétrade articulando as 4 notas juntas.",
            "Meta: 60 -> 70 BPM."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq10-1",
              "question": "Qual nota diferencia a tétrade de C7M da tétrade de C7 (dominante)?",
              "options": [
                "A sétima: C7M possui Si natural (7M) e C7 possui Si bemol (b7)",
                "A terça: C7 tem terça menor",
                "A quinta: C7 tem quinta diminuta",
                "A tônica"
              ],
              "correctIndex": 0,
              "explanation": "A sétima maior (B) caracteriza o 7M, enquanto a sétima menor (Bb) caracteriza o acorde dominante (7)."
            },
            {
              "id": "kq10-2",
              "question": "Qual é a diferença estrutural entre um acorde C7M (Cmaj7) e um acorde C7 (Dominante)?",
              "options": [
                "C7M possui Sétima Maior (B natural, 11 semitons), enquanto C7 possui Sétima Menor (Bb, 10 semitons)",
                "C7M é um acorde menor e C7 é um acorde diminuto",
                "C7 não possui terça",
                "São acordes absolutamente idênticos com nomes diferentes"
              ],
              "correctIndex": 0,
              "explanation": "C7M possui a sétima maior (B natural), conferindo som aveludado e relaxado. C7 possui a sétima menor (Bb), formando o trítono com a terça (E-Bb) que exige resolução em Fá."
            }
          ]
        }
      },
      {
        "id": "teclado-l-3-2",
        "level": 3,
        "moduleTitle": "Módulo 4: Tétrades e Cadências Modernas",
        "lessonNumber": 11,
        "title": "Aula 11 — A Cadência II - V - I no Piano: Condução Suave com Tétrades",
        "subtitle": "A progressão mestra do Jazz e da MPB sem mover a mão do lugar",
        "objective": "Executar a cadência II-V-I maior (Dm7 - G7 - C7M) utilizando inversões otimizadas com saltos de no máximo 1 semitom entre as vozes.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-G4",
        "parts": [
          {
            "id": "kl11-p1",
            "title": "1. A Resolução do Trítono no II-V-I",
            "contentMarkdown": "\n### A Matemática do Voice Leading no II-V-I\n\nEm Dó Maior:\n* **Dm7 (II):** $F - A - C - E$ (ou Dm9)\n* **G7 (V):** O trítono entre $B$ e $F$ resolve suavemente: o $F$ desce meio tom para o $E$ (terça do C7M) e o $B$ sobe para o $C$.\n* **C7M (I):** Chegada no repouso tonal absoluto.\n            "
          },
          {
            "id": "teclado-l-3-2-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-3-2-ex",
          "title": "Exercício 11 — Cadência II-V-I em C com Aberturas Compactas",
          "subtitle": "Voice leading perfeito a 2 mãos",
          "targetBpm": 70,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "ME: Tônica / MD: Guia de vozes (3ª e 7ª)",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nDm7: ME: D | MD: [F - C - E]\nG7:  ME: G | MD: [F - B - D]\nC7M: ME: C | MD: [E - B - D]\n          ",
          "instructions": [
            "Observe que a nota Fá (F) se mantém entre Dm7 e G7.",
            "Conecte com dinâmica aveludada.",
            "Meta: 70 BPM."
          ],
          "biomechanicTips": [
            "Apenas 1 ou 2 dedos se movem em meio tom em cada troca."
          ],
          "validationCriteria": "10 cadências completas sem hesitação e com voice leading impecável.",
          "precisionCriteria": [
            "Observe que a nota Fá (F) se mantém entre Dm7 e G7.",
            "Conecte com dinâmica aveludada.",
            "Meta: 70 BPM."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq11-1",
              "question": "Quais notas formam a cadência II - V - I na tonalidade de Dó Maior?",
              "options": [
                "Dm7 - G7 - C7M",
                "Em7 - A7 - Dm7",
                "C7M - F7M - G7",
                "Am7 - D7 - G7M"
              ],
              "correctIndex": 0,
              "explanation": "Em Dó Maior, o II grau é Dm7, o V grau é G7 e o I grau é C7M."
            },
            {
              "id": "kq11-2",
              "question": "Na cadência II-V-I em Dó Maior (Dm7 - G7 - C7M), o que são as Guide Tones (Notas Guia)?",
              "options": [
                "As 3ªs e 7ªs de cada acorde, que definem a qualidade harmônica e resolvem suavemente por graus conjuntos (voz leading)",
                "As notas mais graves tocadas pelo pé no pedal",
                "Os nomes dos acordes escritos a lápis na partitura",
                "As notas tocadas apenas com a mão esquerda"
              ],
              "correctIndex": 0,
              "explanation": "As 3ªs e 7ªs são as notas essenciais que definem se o acorde é maior, menor ou dominante; na transição de Dm7 para G7, a 7ª de Dm7 (C) desce meio-tom para a 3ª de G7 (B)."
            }
          ]
        }
      },
      {
        "id": "teclado-l-3-3",
        "level": 3,
        "moduleTitle": "Módulo 4: Tétrades e Cadências Modernas",
        "lessonNumber": 12,
        "title": "Aula 12 — Tensões Harmônicas (9, 11, 13) e Voicings sem Tônica (Rootless)",
        "subtitle": "Deixando a tônica para o baixista e colorindo o piano com 9as e 13as",
        "objective": "Construir voicings modernos no estilo Bill Evans / Gospel contemporâneo omitindo a tônica na mão direita e adicionando 9ª e 13ª.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-A4",
        "parts": [
          {
            "id": "kl12-p1",
            "title": "1. Por que Omitir a Tônica na Mão Direita (Rootless Voicings)",
            "contentMarkdown": "\n### A Regra de Ouro da Harmonia em Grupo\n\nEm uma banda, o baixista **já está tocando a tônica** no registro grave. Se o tecladista duplicar a tônica na mão direita, o som fica pesado e sem espaço para os instrumentos solistas.\n* **Rootless Voicing (Tipo A):** $3 - 5 - 7 - 9$ (Ex: C7M(9) $\\rightarrow$ $E - G - B - D$)\n* **Rootless Voicing (Tipo B):** $7 - 9 - 3 - 5$ (Ex: C7M(9) $\\rightarrow$ $B - D - E - G$)\n            \n\n* **Voicings Sem Fundamental:** Aberturas modernas onde a mão esquerda assume guide tones e tensões harmônicas."
          },
          {
            "id": "teclado-l-3-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-3-3-ex",
          "title": "Exercício 12 — II-V-I com Rootless Voicings e Tensões (Dm9 - G13 - C7M(9))",
          "subtitle": "A sonoridade definitiva do piano moderno",
          "targetBpm": 65,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "MD: Rootless 4 sons / ME: Tônica grave",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nDm9:    ME: D | MD: [F - A - C - E] (Tríade de F7M sobre D!)\nG13:    ME: G | MD: [F - A - B - E] (Fá, Lá, Si, Mi)\nC7M(9): ME: C | MD: [E - G - B - D] (Tríade de Em sobre C!)\n          ",
          "instructions": [
            "Ouça a riqueza da 9ª adicionada (E no Dm9, D no C7M(9)) e da 13ª (E no G13).",
            "Meta: 65 BPM com som elegante e aveludado."
          ],
          "biomechanicTips": [
            "Apoie os 4 dedos com peso equilibrado para que a 9ª não soe mais alta que as notas guias."
          ],
          "validationCriteria": "8 progressões completas com sonoridade impecável e sem tensões nas mãos.",
          "precisionCriteria": [
            "Ouça a riqueza da 9ª adicionada (E no Dm9, D no C7M(9)) e da 13ª (E no G13).",
            "Meta: 65 BPM com som elegante e aveludado."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq12-1",
              "question": "Quais notas compõem o Rootless Voicing (Tipo A) de C7M(9)?",
              "options": [
                "E - G - B - D (3ª, 5ª, 7ª e 9ª)",
                "C - E - G - B",
                "C - D - E - G",
                "G - B - D - F"
              ],
              "correctIndex": 0,
              "explanation": "O Rootless Voicing Tipo A omite a tônica e toca a partir da terça: 3 (E), 5 (G), 7 (B) e 9 (D)."
            },
            {
              "id": "kq12-2",
              "question": "O que caracteriza os Rootless Voicings (aberturas sem fundamental) no piano jazzístico?",
              "options": [
                "A mão esquerda omite a tônica (que é tocada pelo contrabaixista) e toca 3ª, 7ª, 9ª e 13ª, criando sonoridade rica e transparente",
                "Tocar o piano sem usar as mãos",
                "Remover as teclas fundamentais do instrumento com uma chave de fenda",
                "Tocar apenas a nota mais grave possível"
              ],
              "correctIndex": 0,
              "explanation": "No contexto de conjunto, o contrabaixo já emite a tônica com peso acústico. O pianista omite a tônica para liberar dedos e vozes para tensões nobres como 9ª e 13ª."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 4,
    "name": "NÍVEL 4 — ACOMPANHAMENTO AVANÇADO",
    "subtitle": "Voicings quartais, rearmonização, substituições harmônicas e padrões rítmicos por estilo",
    "badge": "Avançado",
    "description": "Técnicas de pianistas de elite: harmonias quartais (McCoy Tyner), rearmonização com acordes diminutos de passagem e domínio estilístico em Bossa Nova, Gospel e Jazz Ballad.",
    "lessons": [
      {
        "id": "teclado-l-4-1",
        "level": 4,
        "moduleTitle": "Módulo 5: Voicings Modernos e Rearmonização",
        "lessonNumber": 13,
        "title": "Aula 13 — Voicings Quartais (Quartal Harmony) e Texturas Modais",
        "subtitle": "Empilhando intervalos de quarta justa para sonoridades abertas e modernas",
        "objective": "Construir acordes formados por quartas sobrepostas no estilo McCoy Tyner e aplicá-los sobre harmonias modais e worship.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-C5",
        "parts": [
          {
            "id": "kl13-p1",
            "title": "1. A Harmonia por Quartas (Quartal Voicings)",
            "contentMarkdown": "\n### Rompendo com as Terças Tradicionais\n\nEnquanto a harmonia clássica empilha terças ($C-E-G$), a harmonia moderna empilha **quartas justas** ($E-A-D-G$):\n* Menos direcionada e mais \"espacial\".\n* Excelente para acompanhar músicas modais (Dórico, Frígio) e baladas modernas.\n            \n\n* **Harmonia Quartal:** Empilhamento de quartas justas conferindo sonoridade modal moderna."
          },
          {
            "id": "teclado-l-4-1-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-4-1-ex",
          "title": "Exercício 13 — Padrão Quartal em D Dórico (So What Chords)",
          "subtitle": "Abertura quartal com terça no topo",
          "targetBpm": 75,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Acorde em bloco com peso amplo de braço",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nAcorde 1 (Dm11): ME: [D2 - A2] | MD: [E3 - A3 - D4 - G4] (3 quartas + terça)\nAcorde 2 (Em11): ME: [E2 - B2] | MD: [F#3 - B3 - E4 - A4]\n          ",
          "instructions": [
            "Toque o bloco quartal sentindo a ressonância ampla do piano.",
            "Meta: 75 BPM."
          ],
          "biomechanicTips": [
            "Mantenha os dedos firmes em arco para que todas as notas da quarta soem com igual volume."
          ],
          "validationCriteria": "8 repetições perfeitas com sustentação aveludada.",
          "precisionCriteria": [
            "Toque o bloco quartal sentindo a ressonância ampla do piano.",
            "Meta: 75 BPM."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq13-1",
              "question": "O que caracteriza um voicing quartal no piano?",
              "options": [
                "As notas são empilhadas principalmente em intervalos de quarta justa em vez de terças",
                "O acorde é tocado quatro vezes por compasso",
                "O acorde só tem quatro teclas pretas",
                "Apenas a mão esquerda toca"
              ],
              "correctIndex": 0,
              "explanation": "A harmonia quartal baseia-se na sobreposição de intervalos de 4ª justa, criando um som aberto e sem forte gravidade tonal."
            },
            {
              "id": "kq13-2",
              "question": "Qual é o conceito definidor da Harmonia Quartal celebrizada por McCoy Tyner e Bill Evans (\"So What\")?",
              "options": [
                "Empilhamento de notas em intervalos de quartas justas (4J) em vez das terças tradicionais, criando sonoridade modal e moderna",
                "Tocar apenas quatro acordes em todas as músicas",
                "Tocar apenas no quarto compasso de cada música",
                "Afinar o teclado quatro semitons abaixo"
              ],
              "correctIndex": 0,
              "explanation": "A harmonia quartal empilha quartas (ex: D - G - C - F), gerando aberturas abertas e ambíguas sem a polaridade tradicional de sensível e tônica."
            }
          ]
        }
      },
      {
        "id": "teclado-l-4-2",
        "level": 4,
        "moduleTitle": "Módulo 5: Voicings Modernos e Rearmonização",
        "lessonNumber": 14,
        "title": "Aula 14 — Rearmonização Prática: Acordes Diminutos de Passagem e SubV",
        "subtitle": "Transformando progressões simples de 3 acordes em peças sofisticadas",
        "objective": "Inserir acordes diminutos de passagem ascendentes/descendentes e substitutos tritonais (SubV) em progressões Pop e Gospel.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-A4",
        "parts": [
          {
            "id": "kl14-p1",
            "title": "1. O Acorde Diminuto como Elo de Conexão Cromática",
            "contentMarkdown": "\n### Conectando Acordes com Meio Tom de Tensão\n\nEm vez de saltar direto de $C$ para $Dm$, inserimos o diminuto de passagem:\n$$C \\rightarrow C\\#º \\rightarrow Dm7 \\rightarrow D\\#º \\rightarrow Em7$$\nO baixo caminha cromaticamente ($C \\rightarrow C\\# \\rightarrow D \\rightarrow D\\# \\rightarrow E$), gerando um movimento melódico irresistível.\n            "
          },
          {
            "id": "teclado-l-4-2-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-4-2-ex",
          "title": "Exercício 14 — Progressão Rearmonizada com C#º e D#º",
          "subtitle": "Caminhada cromática no baixo com acordes no teclado",
          "targetBpm": 70,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "ME: Baixo cromático / MD: Inversões suaves",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C#",
              "notePt": "Dó#",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "D#",
              "notePt": "Ré#",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nC:   ME: C  | MD: [E - G - C]\nC#º: ME: C# | MD: [E - G - Bb - C#]\nDm7: ME: D  | MD: [F - A - C]\nD#º: ME: D# | MD: [F# - A - C - D#]\nEm7: ME: E  | MD: [G - B - D]\n          ",
          "instructions": [
            "Ouça a tensão e resolução perfeita de cada acorde diminuto.",
            "Meta: 70 BPM."
          ],
          "biomechanicTips": [
            "Os dedos da MD devem manter a posição compacta sem movimentos bruscos."
          ],
          "validationCriteria": "8 voltas ininterruptas na progressão com precisão de tempo.",
          "precisionCriteria": [
            "Ouça a tensão e resolução perfeita de cada acorde diminuto.",
            "Meta: 70 BPM."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq14-1",
              "question": "Qual é a função do acorde C#º entre os acordes C e Dm7?",
              "options": [
                "Atuar como acorde diminuto de passagem cromática ascendente",
                "Substituir a tônica por silêncio",
                "Finalizar a música",
                "Mudar a afinação do piano"
              ],
              "correctIndex": 0,
              "explanation": "O C#º atua como dominante secundário (equivalente a A7(b9)) criando condução cromática no baixo em direção ao Dm."
            },
            {
              "id": "kq14-2",
              "question": "Qual é a função do acorde diminuto de passagem ascendente (ex.: C7M -> C#dim7 -> Dm7)?",
              "options": [
                "Conectar dois graus diatônicos vizinhos por aproximação cromática tensa que resolve no acorde seguinte",
                "Parar a música para afinar o piano",
                "Substituir a melodia inteira por um acorde errado",
                "Eliminar a tonalidade da música para sempre"
              ],
              "correctIndex": 0,
              "explanation": "O acorde C#dim7 atua como um dominante secundário sem fundamental de Dm7 (A7b9/C#), conduzindo a voz do baixo e da harmonia por meio-tom ascendente."
            }
          ]
        }
      },
      {
        "id": "teclado-l-4-3",
        "level": 4,
        "moduleTitle": "Módulo 5: Voicings Modernos e Rearmonização",
        "lessonNumber": 15,
        "title": "Aula 15 — Padrões Estilísticos: Bossa Nova, Gospel Chops e Soul",
        "subtitle": "Síncopes rítmicas de Bossa Nova e ataques percussivos de Soul/Funk no teclado",
        "objective": "Executar o padrão sincopado de Bossa Nova a duas mãos e o fraseado percussivo de Gospel/Soul com dinâmica e swing.",
        "estimatedMinutes": 25,
        "instrument": "teclado",
        "keyRange": "C3-G4",
        "parts": [
          {
            "id": "kl15-p1",
            "title": "1. A Levada Sincopada de Bossa Nova ao Piano",
            "contentMarkdown": "\n### O Segredo de Tom Jobim e César Camargo Mariano\n\nA Bossa Nova no piano exige dissociação estrita:\n* **Mão Esquerda:** Toca a tônica e a quinta em semínimas pontuadas e semínimas, simulando o tamborim e o surdo.\n* **Mão Direita:** Sincopa os acordes nos contratempos leves, imitando a batida de violão de João Gilberto.\n            "
          },
          {
            "id": "teclado-l-4-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-4-3-ex",
          "title": "Exercício 15 — Levada de Bossa Nova em Dm7 - G7 - C7M",
          "subtitle": "Síncope rítmica brasileira no piano",
          "targetBpm": 90,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "ME: Baixo surdo / MD: Ataques sincopados no contratempo",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nContagem:  1   e   2   e   3   e   4   e\nME (Baixo):X       .       X       .\nMD (Acorde):   X       X       X     X\n          ",
          "instructions": [
            "Sinta o balanço suave e relaxado da Bossa Nova.",
            "Meta: 75 -> 90 BPM."
          ],
          "biomechanicTips": [
            "Toque leve com as pontas dos dedos sem bater pesado nas teclas."
          ],
          "validationCriteria": "10 compassos contínuos de Bossa Nova a 90 BPM com suíngue natural.",
          "precisionCriteria": [
            "Sinta o balanço suave e relaxado da Bossa Nova.",
            "Meta: 75 -> 90 BPM."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq15-1",
              "question": "Na levada tradicional de Bossa Nova ao piano, qual é a função rítmica da mão direita?",
              "options": [
                "Executar ataques sincopados nos contratempos imitando o violão de João Gilberto",
                "Tocar escalas contínuas em semicolcheias",
                "Fazer o papel do contrabaixo grave",
                "Tocar no mesmo instante exato da mão esquerda o tempo todo"
              ],
              "correctIndex": 0,
              "explanation": "A mão direita imita a rítmica sincopada do violão de Bossa Nova, criando a leveza característica do gênero."
            },
            {
              "id": "kq15-2",
              "question": "Qual é o elemento primordial da levada de Bossa Nova ao piano (estilo Tom Jobim e César Camargo Mariano)?",
              "options": [
                "Mão esquerda tocando o baixo de surdo alternado nos tempos 1 e 2, enquanto a mão direita executa a clave rítmica sincopada nos contratempos",
                "Bater com os punhos fechados em todas as teclas pretas",
                "Tocar o mais alto e rápido possível no estilo heavy metal",
                "Usar apenas o pedal de sustentação sem tocar acordes"
              ],
              "correctIndex": 0,
              "explanation": "A Bossa Nova ao piano reproduz o violão de João Gilberto: o polegar do violão vira o baixo da mão esquerda, e os dedilhados sincopados tornam-se os acordes da mão direita."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 5,
    "name": "NÍVEL 5 — ESPECIALIZAÇÃO E PERFORMANCE",
    "subtitle": "Independência polifônica avançada, piano solo completo e recital de formatura",
    "badge": "Performance",
    "description": "A consagração do pianista completo: capacidade de atuar como orquestra solo (melodia, harmonia e baixo simultâneos), contraponto expressivo e execução impecável de recital.",
    "lessons": [
      {
        "id": "teclado-l-5-1",
        "level": 5,
        "moduleTitle": "Módulo 6: O Pianista Solista e Recital",
        "lessonNumber": 16,
        "title": "Aula 16 — Independência Polifônica e Condução de Três Vozes Simultâneas",
        "subtitle": "Baixo no pedal/ME, harmonia no centro e melodia lírica na ponta da MD",
        "objective": "Controlar o equilíbrio dinâmico entre três camadas sonoras independentes executadas simultaneamente.",
        "estimatedMinutes": 30,
        "instrument": "teclado",
        "keyRange": "C2-C5",
        "parts": [
          {
            "id": "kl16-p1",
            "title": "1. A Arquitetura das Três Camadas Sonoras no Piano",
            "contentMarkdown": "\n### Como o Piano se Torna uma Orquestra Completa\n\nPara solar sozinho sem banda:\n1. **Camada 1 (O Baixo):** Mão esquerda sustentando a fundação tonal (grave).\n2. **Camada 2 (A Harmonia):** Dedos 1, 2 e 3 da mão direita preenchendo o miolo harmônico em dinâmica suave ($piano$).\n3. **Camada 3 (A Melodia Lírica):** Dedos 4 e 5 da mão direita cantando a melodia principal com projeção brilhante ($forte$).\n            "
          },
          {
            "id": "teclado-l-5-1-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-5-1-ex",
          "title": "Exercício 16 — Estudo Polifônico em Três Camadas em Dó Maior",
          "subtitle": "Destacando a melodia no dedo 5 enquanto os dedos 1-2 tocam suave",
          "targetBpm": 65,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Diferenciação dinâmica dentro da mesma mão (Voicing the Melody)",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nMD: Dedo 5 canta melodia (f) | Dedos 1-2 preenchem acorde (p)\nME: Baixo oitavado com pedal de sustain\n          ",
          "instructions": [
            "Aplique mais peso no dedo 5 para que a melodia cante por cima da harmonia.",
            "Meta: 65 BPM com controle dinâmico impecável."
          ],
          "biomechanicTips": [
            "Incline levemente a mão em direção ao mindinho (supinação) para transferir mais peso para o dedo 5."
          ],
          "validationCriteria": "A melodia deve ser audivelmente mais proeminente que o acompanhamento em 8 repetições.",
          "precisionCriteria": [
            "Aplique mais peso no dedo 5 para que a melodia cante por cima da harmonia.",
            "Meta: 65 BPM com controle dinâmico impecável."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq16-1",
              "question": "O que significa o conceito de \"voicing the melody\" (dar voz à melodia) no piano solo?",
              "options": [
                "Tocar a nota melódica (geralmente nos dedos 4 ou 5) com maior projeção dinâmica que as notas harmônicas da mesma mão",
                "Cantar junto com a voz enquanto toca",
                "Tocar apenas a melodia sem acordes",
                "Tocar todas as notas com a mesma força mecânica"
              ],
              "correctIndex": 0,
              "explanation": "\"Voicing the melody\" é a técnica de destacar a linha melódica aplicando maior peso no dedo correspondente, mantendo o acompanhamento suave."
            },
            {
              "id": "kq16-2",
              "question": "O que é a Substituição de Trítono (SubV7) na rearmonização avançada no teclado?",
              "options": [
                "Substituir um acorde dominante por outro dominante situado a uma distância de trítono (ex: Db7 no lugar de G7), mantendo o mesmo trítono de 3ª e 7ª",
                "Tocar três acordes maiores ao mesmo tempo com o cotovelo",
                "Substituir todas as notas brancas por notas pretas",
                "Remover três teclas do teclado"
              ],
              "correctIndex": 0,
              "explanation": "G7 e Db7 compartilham o mesmo trítono exato (F e B/Cb). Por isso, Db7 pode substituir G7 resolvendo em C com um elegante movimento cromático de baixo descendente (Db -> C)."
            }
          ]
        }
      },
      {
        "id": "teclado-l-5-2",
        "level": 5,
        "moduleTitle": "Módulo 6: O Pianista Solista e Recital",
        "lessonNumber": 17,
        "title": "Aula 17 — Piano Solo Completo: Arranjo de Introdução, Estrofe, Refrão e Coda",
        "subtitle": "Estruturação formal de uma peça completa sem depender de outros instrumentos",
        "objective": "Criar e executar um arranjo completo de piano solo integrando introdução atmosférica, condução temática e encerramento.",
        "estimatedMinutes": 30,
        "instrument": "teclado",
        "keyRange": "C2-G5",
        "parts": [
          {
            "id": "kl17-p1",
            "title": "1. O Roteiro de um Arranjo de Piano Solo de Alto Nível",
            "contentMarkdown": "\n### Estrutura Formal de uma Peça de Concerto\n\n* **Introdução:** Arpejo quartal ou cascata lírica estabelecendo a tonalidade.\n* **Tema Principal (Estrofe):** Melodia expressiva com baixo simples e harmonia aveludada.\n* **Refrão:** Crescendo dinâmico com oitavas na melodia e baixo potente.\n* **Finalização (Coda):** Diminuendo gradual e acorde final com harmônicos abertos sustentados no pedal damper.\n            "
          },
          {
            "id": "teclado-l-5-2-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-5-2-ex",
          "title": "Exercício 17 — Arranjo Solo de Balada/Worship em G Maior",
          "subtitle": "Execução formal completa",
          "targetBpm": 68,
          "targetRepetitions": 6,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Arranjo solo orquestral completo",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nIntro: Arpejo G(add9) -> C7M\nTema:  G -> D/F# -> Em7 -> C9 com melodia cantada\nCoda:  Arpejo descendente em G\n          ",
          "instructions": [
            "Conecte todas as seções respeitando as indicações de expressão e dinâmicas.",
            "Meta: 68 BPM."
          ],
          "biomechanicTips": [
            "Troque o pedal de sustain a cada mudança de acorde para não embolar as harmonias."
          ],
          "validationCriteria": "6 execuções integrais com musicalidade, dinâmica e clareza impecáveis.",
          "precisionCriteria": [
            "Conecte todas as seções respeitando as indicações de expressão e dinâmicas.",
            "Meta: 68 BPM."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq17-1",
              "question": "Qual é o momento correto para trocar o pedal de sustain durante uma mudança de acorde?",
              "options": [
                "Logo após o ataque do novo acorde (pedal sincopado), limpando o acorde anterior e sustentando o novo",
                "Antes do acorde tocar",
                "Nunca se solta o pedal de sustain",
                "Apenas no final da música"
              ],
              "correctIndex": 0,
              "explanation": "A troca sincopada do pedal (levantar e abaixar imediatamente após a tecla do novo acorde ser pressionada) garante som contínuo sem misturar harmonias diferentes."
            },
            {
              "id": "kq17-2",
              "question": "Como um pianista solista equilibra dinamicamente as três camadas sonoras (Melodia, Harmonia e Baixo)?",
              "options": [
                "Melodia cantabile em destaque dinâmico (Forte), Baixo presente e sólido (Mezzo-Forte), e Harmonia intermediária suave e transparente (Piano)",
                "Tocando a harmonia o mais alto possível para encobrir a melodia",
                "Tocando todas as 10 notas com a mesma intensidade física sem nuance",
                "Silenciando a mão direita"
              ],
              "correctIndex": 0,
              "explanation": "No piano solo de conservatório, a clareza polifônica exige hierarquia dinâmica: a melodia deve projetar sobre os acordes intermediários que devem sussurrar com leveza."
            }
          ]
        }
      },
      {
        "id": "teclado-l-5-3",
        "level": 5,
        "moduleTitle": "Módulo 6: O Pianista Solista e Recital",
        "lessonNumber": 18,
        "title": "Aula 18 — Projeto de Conclusão: Recital Completo de Graduação em Teclado/Piano",
        "subtitle": "Apresentação formal da peça de conservatório com todas as competências integradas",
        "objective": "Executar a peça de recital de graduação integrando técnica, precisão métrica, dinâmica expressiva e autoridade musical.",
        "estimatedMinutes": 35,
        "instrument": "teclado",
        "keyRange": "C1-C6",
        "parts": [
          {
            "id": "kl18-p1",
            "title": "1. O Recital de Conclusão de Conservatório",
            "contentMarkdown": "\n### O Pináculo da Sua Formação no Piano e Teclado\n\nParabéns! Você percorreu toda a jornada de conservatório da Guitar Academy:\n1. **Domínio Técnico:** Passagens de polegar límpidas, dedos independentes e postura neutra.\n2. **Domínio Harmônico:** Tríades, inversões, campo harmônico, tétrades, voicings quartais e rearmonizações.\n3. **Domínio Expressivo:** Controle dinâmico polifônico, uso refinado do pedal e autoridade de palco.\n            "
          },
          {
            "id": "teclado-l-5-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Teclado\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, peso natural dos braços relaxado e punhos flexíveis sem tensão isométrica.\n* **Dedilhado Canônico:** Respeite rigorosamente a numeração de dedos de 1 a 5 para ambas as mãos, facilitando passagens de polegar e saltos harmônicos.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Worship, Jazz, Bossa Nova, MPB), ouvindo criticamente o equilíbrio e condução de vozes (voice leading)."
          }
        ],
        "practicalExercise": {
          "id": "teclado-l-5-3-ex",
          "title": "Exercício 18 — A Peça Completa de Recital de Conservatório",
          "subtitle": "Apresentação pública de formatura",
          "targetBpm": 72,
          "targetRepetitions": 4,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Performance expressiva completa de recital",
          "notesSequence": [
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\n[Recital Completo: Intro Quartal -> Tema Melódico -> Refrão Orquestral -> Coda]\n          ",
          "instructions": [
            "Execute a peça completa de recital do início ao fim sem interrupções.",
            "Concentre-se na mensagem musical, na beleza do timbre e na respiração.",
            "Meta: 72 BPM com precisão e alma artística."
          ],
          "biomechanicTips": [
            "Mantenha a mente calma, os ombros soltos e confie na memória motora consolidada."
          ],
          "validationCriteria": "4 performances integrais consecutivas com nível de conservatório de excelência.",
          "precisionCriteria": [
            "Execute a peça completa de recital do início ao fim sem interrupções.",
            "Concentre-se na mensagem musical, na beleza do timbre e na respiração.",
            "Meta: 72 BPM com precisão e alma artística."
          ],
          "commonErrors": [
            "Bater nas teclas com força de dedo em vez de usar a transferência de peso do braço",
            "Colapsar a primeira falange dos dedos deixando a mão espalmada e rígida",
            "Tencionar os ombros ao realizar passagens de polegar ou aberturas amplas"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "kq18-1",
              "question": "Qual é o maior diferencial de um tecladista/pianista profissional formado em conservatório?",
              "options": [
                "A sensibilidade musical para equilibrar dinâmica, precisão rítmica e escolha de timbres e voicings em benefício da música",
                "Tocar o mais alto e rápido possível o tempo todo",
                "Usar apenas um dedo por mão",
                "Não estudar harmonia"
              ],
              "correctIndex": 0,
              "explanation": "A maestria pianística é a capacidade de colocar a técnica impecável e o conhecimento harmônico a serviço da expressividade e da emoção musical."
            },
            {
              "id": "kq18-2",
              "question": "Qual é a principal competência avaliada na Peça de Concerto Final do curso de Teclado/Piano?",
              "options": [
                "Integração de precisão técnica, independência polifônica, sensibilidade tímbrica, condução harmônica e expressividade artística",
                "Tocar todas as 88 teclas em menos de 3 segundos",
                "Decorar a cor de todas as teclas do piano",
                "Tocar sem respirar durante 10 minutos"
              ],
              "correctIndex": 0,
              "explanation": "A conclusão da formação exige demonstrar proficiência integral: leitura, controle de toque, articulação polifônica e maturidade interpretativa."
            }
          ]
        }
      }
    ]
  }
];

export const KEYBOARD_LESSONS: KeyboardLesson[] = KEYBOARD_COURSE_LEVELS.flatMap((l) => l.lessons);

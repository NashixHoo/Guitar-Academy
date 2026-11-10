// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO DE CONSERVATÓRIO
// Módulo de Conteúdo Oficial V1 — src/data/drumsCourse.ts
// 100% tipado, progressivo e compatível com a interface Lesson
// =========================================================================

import { DrumsLesson, DrumsCourseLevel } from '../types';

export const DRUMS_COURSE_LEVELS: DrumsCourseLevel[] = [
  {
    "level": 0,
    "name": "NÍVEL 0 — FUNDAMENTOS",
    "subtitle": "Anatomia do kit de bateria, postura, pegada matched grip, fulcro e primeira pulsação",
    "badge": "Fundamentos",
    "description": "A iniciação ao universo percussivo: identificação de todas as peças do kit, ergonomia do banco e pedais, pegada de baquetas anatômica e controle de pulsação a 60 BPM.",
    "lessons": [
      {
        "id": "bateria-l-0-1",
        "level": 0,
        "moduleTitle": "Módulo 1: Anatomia do Kit e Postura Rítmica",
        "lessonNumber": 1,
        "title": "Aula 1 — Anatomia do Kit de Bateria, Acústica e Ergonomia de Montagem",
        "subtitle": "A função sonora de bumbo, caixa, chimbal, tambores e pratos com postura sem lesão",
        "objective": "Identificar cada peça do kit acústico/eletrônico, ajustar a altura do banco em ângulo neutro de 90°-100° e posicionar os pedais para relaxamento muscular.",
        "estimatedMinutes": 25,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Pulsação básica",
          "Controle biomecânico"
        ],
        "parts": [
          {
            "id": "dl01-p1",
            "title": "1. As Peças do Kit e Suas Funções Acústicas",
            "contentMarkdown": "\n### O Kit de Bateria de Conservatório: Frequências e Papel Rítmico\n\nA bateria moderna reúne instrumentos de percussão membranofônicos (tambores) e idiofônicos (pratos), acionados simultaneamente por mãos e pés:\n\n* **Bumbo (Bass Drum / Kick, 20\" a 22\"):** Acionado pelo pedal do pé direito. É a âncora grave do arranjo (30 Hz - 100 Hz), marcando os tempos fortes e conversando diretamente com a linha do contrabaixo.\n* **Caixa (Snare Drum, 14\" x 5.5\" ou 6.5\"):** Posicionada entre as pernas, acionada principalmente pela mão esquerda. Possui uma esteira metálica inferior de 20 a 42 fios que vibra contra a pele de resposta, produzindo o estalo cortante (backbeat) no 2 e 4 do compasso 4/4.\n* **Chimbal (Hi-Hat, par de pratos de 14\"):** Controlado pelo pedal do pé esquerdo e tocado pela mão direita (braços cruzados ou abertos). É o metrônomo humano da banda, marcando a subdivisão contínua (semínimas, colcheias ou semicolcheias).\n* **Tons (Tom 1 de 10\" e Tom 2 de 12\"):** Tambores suspensos sobre o bumbo, afinados em intervalos melódicos (geralmente quartas ou terças) para desenhos de viradas.\n* **Surdo de Chão (Floor Tom, 14\" ou 16\"):** Tambor grave apoiado em três pés no chão à direita do baterista, oferecendo peso para preenchimentos e grooves pesados de rock.\n* **Prato de Condução (Ride, 20\" a 22\"):** Prato pesado com cúpula destacada à direita. Fornece um som limpo de 'ping' e definição rítmica contínua em refrãos e seções abertas.\n* **Pratos de Ataque (Crash, 16\" a 18\"):** Pratos de espessura média a fina, usados para pontuar quedas de compasso, transições dinâmicas e o tempo 1 de novas seções.\n\n```\n========================================================================\nTOPOGRAFIA DO KIT DE BATERIA (VISTA SUPERIOR DO BATERISTA)\n========================================================================\n                   [Tom 1 (10\")]     [Tom 2 (12\")]\n                         \\              /\n  [Crash 16\"]             [BUMBO (22\")]            [Ride 20\"]\n       \\                   [Pedal BD]                 /\n    [Chimbal 14\"]               |               [Surdo (16\")]\n    [Pedal HH]              [CAIXA 14\"]\n        \\                       |\n     (Pé Esq.)             (BANCO / VOCÊ)          (Pé Dir.)\n========================================================================\n```\n            "
          },
          {
            "id": "dl01-p2",
            "title": "2. Ergonomia do Banco, Altura dos Pedais e Prevenção de Lesões",
            "contentMarkdown": "\n### Biomecânica da Bateria: Construindo a Base sem Fadiga\n\nA bateria exige movimentos rápidos de extremidades com estabilidade do core (tronco):\n\n1. **Altura do Banco (Regra Primordial):** A articulação do quadril deve estar **ligeiramente mais alta que a linha dos joelhos**, formando um ângulo aberto entre 90° e 105°. Se o banco estiver muito baixo (< 90°), você comprimirá os flexores do quadril e sobrecarregará a lombar.\n2. **Posicionamento dos Pedais:** Os pedais de bumbo e chimbal devem ser posicionados na abertura natural dos seus pés relaxados em formato de \"V\" (~45° de abertura entre si), e não paralelos de forma forçada.\n3. **Altura da Caixa:** A pele da caixa deve ficar na altura da fivela do seu cinto (linha do umbigo). Isso permite tocar golpes simples no centro sem bater as baquetas nas pernas e executar rimshots sem elevar os ombros.\n4. **Distância dos Pratos:** Nenhum prato deve exigir que você estique totalmente o cotovelo ou incline a coluna para a frente. O alcance deve ser feito pelo movimento natural do antebraço e rotação suave do ombro.\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-0-1-ex",
          "title": "Exercício 1 — Calibração Postural e Pulso Fundamental de Caixa",
          "subtitle": "Aferição do assento, alinhamento de pedais e sustentação de semínimas no centro da pele",
          "targetBpm": 60,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Alternância de mãos D - E - D - E com toque no centro geométrico da caixa",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D",
              "notePt": "Mão Direita (Downstroke)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "E",
              "notePt": "Mão Esquerda (Downstroke)",
              "pickDirection": "up"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D",
              "notePt": "Mão Direita",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "E",
              "notePt": "Mão Esquerda",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\n4/4 | BPM: 60 (Inicial: 50 | Alvo: 70)\nMão:  D       E       D       E       | D       E       D       E       |\nSD:   o       o       o       o       | o       o       o       o       |\nCont: 1       2       3       4       | 1       2       3       4       |\n          ",
          "targetExecutionSeconds": 48,
          "precisionCriteria": [
            "Coluna ereta e pés totalmente apoiados nas sapatas dos pedais",
            "Toques concentrados rigorosamente no círculo central de 5 cm da caixa",
            "Sincronização milimétrica com o clique do metrônomo a 60 BPM",
            "Ombros completamente soltos e relaxados sem tensão cervical"
          ],
          "commonErrors": [
            "Bater próximo ao aro gerando som harmônico estridente em vez de som encorpado",
            "Sentar com joelhos flexionados a menos de 90° forçando a coluna lombar",
            "Pisar no pedal mantendo a perna travada e rígida"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq01-1",
              "question": "Qual é o ângulo recomendado para a articulação do joelho no ajuste da altura do banco?",
              "options": [
                "Entre 90° e 105°, com o quadril ligeiramente acima da linha dos joelhos",
                "Exatamente 45°, ficando bem agachado próximo ao chão",
                "180°, com as pernas totalmente esticadas",
                "O banco não possui ajuste e não influencia na execução"
              ],
              "correctIndex": 0,
              "explanation": "Um ângulo de 90° a 105° com o quadril ligeiramente elevado alivia a tensão sobre os flexores do quadril e protege a coluna lombar durante a operação dos pedais."
            },
            {
              "id": "dq01-2",
              "question": "Qual elemento confere o estalo agudo e seco característico da caixa da bateria?",
              "options": [
                "A esteira metálica de fios de aço tensionada contra a pele de resposta inferior",
                "O peso de chumbo colocado dentro do tambor",
                "O uso obrigatório de baquetas de metal",
                "O pedal de bumbo batendo no aro da caixa"
              ],
              "correctIndex": 0,
              "explanation": "A esteira de aço (snare wire), ao vibrar em contato com a pele inferior ultrafina de resposta, gera o estalo agudo e encorpado que define o backbeat."
            }
          ]
        }
      },
      {
        "id": "bateria-l-0-2",
        "level": 0,
        "moduleTitle": "Módulo 1: Anatomia do Kit e Postura Rítmica",
        "lessonNumber": 2,
        "title": "Aula 2 — Pegadas Matched Grip (American, German, French) e o Ponto de Fulcro",
        "subtitle": "A física da alavanca, mecânica do fulcrum e o princípio do Free Stroke (rebote natural)",
        "objective": "Dominar o ponto de fulcro entre polegar e indicador e transitar entre as pegadas American (45°), German (90°) e French (0°) aproveitando o rebote livre da baqueta.",
        "estimatedMinutes": 25,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Fulcrum",
          "Free Stroke",
          "Matched Grip"
        ],
        "parts": [
          {
            "id": "dl02-p1",
            "title": "1. O Ponto de Fulcro (Fulcrum) e a Alavanca Física",
            "contentMarkdown": "\n### O Segredo da Velocidade sem Força: O Ponto de Giro\n\nA baqueta de bateria é uma alavanca mecânica de primeira classe. Você não deve segurá-la como um martelo com o punho fechado:\n\n* **Localização do Fulcro:** A baqueta deve ser pinçada suavemente entre a **polpa do polegar** e a **primeira ou segunda falange do dedo indicador**, exatamente a cerca de **1/3 da distância a partir da base (butt end)**.\n* **O Eixo de Giro:** Nesse ponto de equilíbrio natural, a baqueta quica livremente dezenas de vezes quando solta contra a pele.\n* **Os Dedos Traseiros (Médio, Anelar e Mínimo):** Atuam como molas condutoras que abraçam a baqueta sem sufocá-la, controlando o retorno do rebote.\n\n```\n========================================================================\nMECÂNICA DO FULCRO (FULCRUM) NA BAQUETA\n========================================================================\n           [Ponta / Tip]           [Corpo / Shaft]     [Fulcro]  [Base]\n(Pele) <---- o============================================( * )====|\n                                                          /   \\\n                                                    Polegar  Indicador\n                                                   (Pinça relaxada)\n========================================================================\n```\n            "
          },
          {
            "id": "dl02-p2",
            "title": "2. As Três Variações do Matched Grip e o Free Stroke",
            "contentMarkdown": "\n### German, American e French Grip: Qual Escolher?\n\nNo sistema **Matched Grip** (ambas as mãos seguram a baqueta de forma simétrica), existem três orientações de punho:\n\n1. **German Grip (Palmas para baixo a 90°):** As palmas das mãos ficam paralelas ao chão. Movimento gerado essencialmente pela flexão do punho. Máxima potência para toques fortes na caixa e surdo.\n2. **French Grip (Polegares para cima a quase 0°):** As palmas ficam voltadas uma para a outra. O movimento é acionado quase inteiramente pela ponta dos dedos. Ideal para passagens ultra rápidas no prato de condução, chimbal e dinâmicas sutis.\n3. **American Grip (Palmas a 45° — O Padrão Universal):** Posição híbrida intermediária. Concede o melhor dos dois mundos: potência do punho e velocidade dos dedos traseiros. É a pegada canônica ensinada nos conservatórios.\n\n### O Princípio do Free Stroke (Toque Livre)\nInventado pedagogicamente por George Lawrence Stone e aperfeiçoado por Joe Morello:\n* A baqueta parte de cima (altura máxima).\n* O punho desce e arremessa a ponta contra a pele como se jogasse uma bola de basquete no chão.\n* **A baqueta quica no rebote e retorna sozinha à altura inicial**, sem que seus músculos precisem puxá-la para cima!\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-0-2-ex",
          "title": "Exercício 2 — O Free Stroke com American Grip no Pad de Estudo",
          "subtitle": "Ciclo contínuo de arremesso e captura no topo pelo rebote elástico",
          "targetBpm": 70,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "8 toques contínuos com a mão direita, depois 8 com a mão esquerda",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D",
              "notePt": "Mão Direita (Free Stroke)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D",
              "notePt": "Mão Direita (Free Stroke)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "E",
              "notePt": "Mão Esquerda (Free Stroke)",
              "pickDirection": "up"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "E",
              "notePt": "Mão Esquerda (Free Stroke)",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nCompasso 4/4 | Pad de Treino ou Caixa\nMão Dir (D): | D D D D D D D D | - - - - - - - - |\nMão Esq (E): | - - - - - - - - | E E E E E E E E |\nContagem:    | 1 & 2 & 3 & 4 & | 1 & 2 & 3 & 4 & |\n          ",
          "targetExecutionSeconds": 45,
          "precisionCriteria": [
            "Retorno imediato da baqueta à altura de 90° apenas com a energia do rebote",
            "Manutenção do American Grip com palmas a 45° sem travar os dedos",
            "Pressão zero no punho no momento do impacto (mão relaxada)"
          ],
          "commonErrors": [
            "Apertar a baqueta com o punho fechado sufocando o rebote natural",
            "Puxar a baqueta para cima com os músculos do bíceps em vez de deixá-la subir pelo quique",
            "Deixar o dedo mindinho espetado para fora sem contato de apoio"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq02-1",
              "question": "A que distância da base (butt end) da baqueta situa-se o ponto ótimo de fulcro?",
              "options": [
                "Aproximadamente a 1/3 da distância total a partir da base",
                "Exatamente na ponta (tip) da baqueta",
                "No meio exato da baqueta dividindo-a em 50%",
                "Colado na borda inferior extrema da base"
              ],
              "correctIndex": 0,
              "explanation": "A cerca de 1/3 da base situa-se o centro de gravidade e ressonância da baqueta, permitindo o máximo número de oscilações livres de rebote sem perda de energia."
            },
            {
              "id": "dq02-2",
              "question": "Qual é a principal característica do movimento Free Stroke?",
              "options": [
                "A baqueta é lançada para baixo e retorna à posição inicial aproveitando a energia do rebote natural",
                "A baqueta é pressionada com força máxima contra a pele para não sair do lugar",
                "Tocar apenas com o cotovelo mantendo o punho imóvel e engessado",
                "Segurar a baqueta com as duas mãos ao mesmo tempo"
              ],
              "correctIndex": 0,
              "explanation": "No Free Stroke, a baqueta é arremessada pelo punho e a elasticidade da pele a devolve ao ponto alto sem intervenção muscular ativa para levantá-la."
            }
          ]
        }
      },
      {
        "id": "bateria-l-0-3",
        "level": 0,
        "moduleTitle": "Módulo 1: Anatomia do Kit e Postura Rítmica",
        "lessonNumber": 3,
        "title": "Aula 3 — Primeira Coordenação de Membros: Pulso Mão-Pé em Semínimas (4/4)",
        "subtitle": "Sincronização de bumbo, caixa e chimbal com subdivisão em semínimas a 60 BPM",
        "objective": "Executar a primeira levada rítmica quaternária completa, coordenando o pé direito no bumbo (tempos 1 e 3), mão esquerda na caixa (tempos 2 e 4) e mão direita no chimbal.",
        "estimatedMinutes": 25,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Independência motora mão-pé",
          "Backbeat quaternário"
        ],
        "parts": [
          {
            "id": "dl03-p1",
            "title": "1. A Arquitetura do Groove Quaternário Canônico",
            "contentMarkdown": "\n### A Conexão dos Três Membros no Compasso 4/4\n\nO padrão mais executado na história da música ocidental (Pop, Rock, Worship, Blues e Soul) organiza-se em torno de uma conversa de três vias:\n\n1. **Chimbal (Mão Direita):** Pulso contínuo marcando os 4 tempos (`1, 2, 3, 4`).\n2. **Bumbo (Pé Direito):** Marca a fundação grave nos tempos `1` e `3`.\n3. **Caixa (Mão Esquerda):** Marca a resposta enérgica nos tempos `2` e `4` (o famoso **Backbeat**).\n\n```\n========================================================================\nNOTAÇÃO RÍTMICA EM GRADE (GROOVE QUATERNÁRIO BÁSICO EM SEMÍNIMAS)\n========================================================================\nTempo:         1           2           3           4\nChimbal (HH): [ X ]       [ X ]       [ X ]       [ X ]   (Mão Dir)\nCaixa   (SD):   .         [ O ]         .         [ O ]   (Mão Esq)\nBumbo   (BD): [ O ]         .         [ O ]         .     (Pé Dir)\n------------------------------------------------------------------------\nMembros:      (HH + BD)   (HH + SD)   (HH + BD)   (HH + SD)\n========================================================================\n```\n            "
          },
          {
            "id": "dl03-p2",
            "title": "2. Superando o Efeito Espelho (Independência Neurogênica)",
            "contentMarkdown": "\n### Como Desassociar a Mão Esquerda do Pé Direito\n\nO cérebro humano tende espontaneamente a mover o braço esquerdo quando o pé direito é acionado (movimento contralateral de marcha). Para quebrar essa dependência:\n\n1. **Passo 1 (Isolamento Bumbo-Chimbal):** Toque apenas o chimbal com a mão direita e o bumbo no 1 e no 3. Não toque a caixa. Repita 20 vezes até ficar automático.\n2. **Passo 2 (Isolamento Caixa-Chimbal):** Toque apenas o chimbal e a caixa no 2 e no 4. Não toque o bumbo. Repita 20 vezes.\n3. **Passo 3 (Fusão Lenta a 50 BPM):** Una os dois padrões. Sinta como o tempo 1 é \"grave + prato\" e o tempo 2 é \"estalo + prato\".\n4. **Contagem Cantada em Voz Alta:** Conte `\"UM - DOIS - TRÊS - QUATRO\"` audivelmente. A voz sincroniza o córtex motor e impede que o pé atrase.\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-0-3-ex",
          "title": "Exercício 3 — O Groove Quaternário de Semínimas a 60 BPM",
          "subtitle": "Coordenação sincronizada de 3 membros sem flams acidentais",
          "targetBpm": 60,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Pé direito no 1 e 3, mão esquerda no 2 e 4, mão direita contínua no chimbal",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "BD+HH",
              "notePt": "Tempo 1: Bumbo + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "SD+HH",
              "notePt": "Tempo 2: Caixa + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "BD+HH",
              "notePt": "Tempo 3: Bumbo + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "SD+HH",
              "notePt": "Tempo 4: Caixa + Chimbal",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 4/4 | Metrônomo: 60 BPM (Progresso: 50 -> 60 -> 75 BPM)\nHH: | x   x   x   x   | x   x   x   x   |\nSD: |     o       o   |     o       o   |\nBD: | o       o       | o       o       |\n      1   2   3   4     1   2   3   4\n          ",
          "targetExecutionSeconds": 50,
          "precisionCriteria": [
            "Simultaneidade absoluta entre prato e tambor (sem \"flam\" ou desencontro de milissegundos)",
            "Volume da caixa firme e consistente em relação ao chimbal",
            "Andamento estritamente estável sem acelerar na transição de compasso"
          ],
          "commonErrors": [
            "O pé direito tocar involuntariamente no tempo 2 junto com a caixa",
            "O chimbal parar quando a caixa entra no tempo 2",
            "Tocar o bumbo fraco por receio de perder o equilíbrio no banco"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq03-1",
              "question": "Em um compasso 4/4 tradicional, em quais tempos a caixa (backbeat) deve ser acionada?",
              "options": [
                "Nos tempos 2 e 4",
                "Nos tempos 1 e 3",
                "Apenas no tempo 1",
                "Em todos os tempos do compasso de forma contínua"
              ],
              "correctIndex": 0,
              "explanation": "O backbeat canônico da música ocidental localiza a caixa com precisão nos tempos 2 e 4, contrastando com o bumbo nos tempos 1 e 3."
            },
            {
              "id": "dq03-2",
              "question": "O que caracteriza um \"flam acidental\" na coordenação entre mão e pé?",
              "options": [
                "Quando a baqueta e o pedal deveriam soar no mesmo instante exato, mas tocam separados por milissegundos",
                "Quando o bumbo quebra a pele do tambor",
                "Quando o chimbal permanece totalmente aberto",
                "Quando a baqueta cai no chão"
              ],
              "correctIndex": 0,
              "explanation": "Um flam ocorre quando dois membros tocam com um micro-desencontro de tempo em vez de impactarem a pele e o prato com simultaneidade perfeita."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 1,
    "name": "NÍVEL 1 — INICIAÇÃO",
    "subtitle": "Rudimentos essenciais (Single & Double Stroke), leitura rítmica e grooves clássicos de Pop/Rock",
    "badge": "Iniciação",
    "description": "Desenvolvimento técnico com toques simples e duplos, leitura métrica em colcheias (1-e-2-e-3-e-4-e) e aplicação dos primeiros grooves completos de Pop, Rock e Worship.",
    "lessons": [
      {
        "id": "bateria-l-1-1",
        "level": 1,
        "moduleTitle": "Módulo 2: Rudimentos e Subdivisão Rítmica",
        "lessonNumber": 4,
        "title": "Aula 4 — Single Stroke Roll (Toque Simples) e Double Stroke Roll (Toque Duplo)",
        "subtitle": "A base dos 40 rudimentos internacionais: simetria de mãos e controle do segundo toque",
        "objective": "Executar o Single Stroke Roll (D-E-D-E) e o Double Stroke Roll (D-D-E-E) em colcheias e semicolcheias com dinâmica idêntica entre as duas mãos.",
        "estimatedMinutes": 25,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Single Stroke Roll",
          "Double Stroke Roll"
        ],
        "parts": [
          {
            "id": "dl04-p1",
            "title": "1. O Single Stroke Roll e a Igualdade de Timbres",
            "contentMarkdown": "\n### Single Stroke Roll (Toque Simples: D - E - D - E)\n\nO rudimento número 1 da NARD e da PAS (Percussive Arts Society) consiste na alternância perfeita entre as mãos direita (D) e esquerda (E).\n\n* **Desafio Auditivo:** Como a maioria dos bateristas é destra, a mão direita costuma soar mais alta e encorpada que a esquerda. Seu objetivo é fechar os olhos e não conseguir distinguir qual mão está golpeando a caixa.\n* **Altura de Golpe:** Mantenha ambas as baquetas subindo exatamente à mesma altura (ex.: 20 cm da pele).\n* **Relaxamento de Punho:** Não aperte os dedos; deixe o punho flexionar com liberdade.\n            "
          },
          {
            "id": "dl04-p2",
            "title": "2. O Double Stroke Roll (Toque Duplo: D - D - E - E)",
            "contentMarkdown": "\n### O Segredo do Segundo Toque (Did-dle)\n\nNo toque duplo, cada mão desfere dois golpes consecutivos: `D - D - E - E`.\n\n* **Mecânica dos Dois Toques:**\n  1. **Primeiro Toque (Downstroke primário):** Golpe arremessado pelo punho.\n  2. **Segundo Toque (Snap de rebote):** Os dedos anelar e médio fecham ligeiramente contra a palma (movimento de 'snap'), impulsionando a baqueta para um segundo golpe imediato antes que a energia do rebote se perca.\n* **Erro Frequente a Evitar:** Tocar o segundo golpe muito mais fraco que o primeiro (`Ddd - Ddd`). Pratique acentuando conscientemente o **segundo toque** para equilibrar a dinâmica: `d-D e-E d-D e-E`.\n            \n\n* **Double Stroke:** O Double Stroke (toque duplo D-D-E-E) aproveita o rebote elástico no segundo impacto."
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-1-1-ex",
          "title": "Exercício 4 — Pirâmide de Rudimentos: Singles e Doubles",
          "subtitle": "Transição métrica de toques simples para toques duplos sem oscilação de tempo",
          "targetBpm": 80,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "1 compasso de Single Stroke seguido de 1 compasso de Double Stroke",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D",
              "notePt": "Mão Dir (Single)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "E",
              "notePt": "Mão Esq (Single)",
              "pickDirection": "up"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D",
              "notePt": "Mão Dir (Double)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D",
              "notePt": "Mão Dir (Double)",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 4/4 em Colcheias | Caixa ou Pad\nComp 1 (Singles): | D E D E D E D E |\nComp 2 (Doubles): | D D E E D D E E |\nContagem:         | 1 & 2 & 3 & 4 & |\n          ",
          "targetExecutionSeconds": 45,
          "precisionCriteria": [
            "Volume perfeitamente uniforme entre mão direita e esquerda",
            "O segundo golpe do toque duplo com a mesma projeção sonora do primeiro",
            "Transição sem pausas ou hesitações entre os dois compassos"
          ],
          "commonErrors": [
            "O segundo toque do double soar abafado ou mastigado como um toque morto",
            "A mão esquerda tocar mais baixo que a mão direita",
            "Acelerar involuntariamente ao passar para os toques duplos"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq04-1",
              "question": "Qual técnica nos dedos permite produzir o segundo golpe do Double Stroke Roll com velocidade e clareza?",
              "options": [
                "O fechamento dos dedos traseiros (médio e anelar) impulsionando o rebote elástico",
                "O uso de força máxima do antebraço para cada toque individual",
                "Soltar a baqueta completamente deixando-a rolar na pele",
                "Bater a baqueta no aro com a mão contrária"
              ],
              "correctIndex": 0,
              "explanation": "O snap dos dedos traseiros (finger control) direciona o rebote do primeiro golpe para criar um segundo impacto nítido sem a necessidade de um segundo movimento de punho."
            },
            {
              "id": "dq04-2",
              "question": "Qual fórmula rudimentar representa o Double Stroke Roll?",
              "options": [
                "D - D - E - E",
                "D - E - D - E",
                "D - E - D - D",
                "D - D - D - D"
              ],
              "correctIndex": 0,
              "explanation": "O toque duplo consiste estritamente em dois impactos com a mão direita seguidos de dois impactos com a mão esquerda (D-D-E-E)."
            }
          ]
        }
      },
      {
        "id": "bateria-l-1-2",
        "level": 1,
        "moduleTitle": "Módulo 2: Rudimentos e Subdivisão Rítmica",
        "lessonNumber": 5,
        "title": "Aula 5 — Leitura Rítmica em 4/4 e Subdivisão em Colcheias (1-e-2-e-3-e-4-e)",
        "subtitle": "A pulsação do chimbal em colcheias como motor rítmico do baterista moderno",
        "objective": "Subdividir o compasso 4/4 cantando a contagem de colcheias (\"1-e-2-e-3-e-4-e\") enquanto conduz o chimbal com precisão métrica milimétrica.",
        "estimatedMinutes": 25,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Subdivisão em colcheias",
          "Metronomia interna"
        ],
        "parts": [
          {
            "id": "dl05-p1",
            "title": "1. O Motor em Colcheias no Chimbal",
            "contentMarkdown": "\n### Do Pulso Simples à Subdivisão Binária\n\nNa Aula 3 tocamos o chimbal apenas em semínimas (4 toques por compasso). Agora, duplicamos a densidade de eventos para **colcheias (8 toques por compasso)**:\n\n* **Tempo de Cabeça (Downbeat):** São os números `1, 2, 3, 4`.\n* **Contratempo (Upbeat):** É o `\"e\"` falado entre os tempos.\n* **Fórmula de Contagem Obrigatória:** `\"1 - e - 2 - e - 3 - e - 4 - e\"`.\n\n```\n========================================================================\nGRADE DE COLCHEIAS NO COMPASSO 4/4\n========================================================================\nPulso:     |    1        2        3        4    |\nSubdiv:    | 1  e  2  e  3  e  4  e | 1  e  2  e  3  e  4  e |\nChimbal:   | x  x  x  x  x  x  x  x | x  x  x  x  x  x  x  x |\nMão Dir:   | D  D  D  D  D  D  D  D | D  D  D  D  D  D  D  D |\n========================================================================\n```\n            "
          },
          {
            "id": "dl05-p2",
            "title": "2. Abertura do Som: Ponta da Baqueta vs Corpo no Chimbal",
            "contentMarkdown": "\n### Timbragem Profissional do Chimbal\n\n* **Toque com a Ponta (Tip of Stick) na Face Superior:** Produz um som fechado, cristalino, estalado e ideal para estúdio e baladas delicadas.\n* **Toque com o Corpo (Shoulder of Stick) na Borda:** Produz um som encorpado, agressivo e cortante, fundamental para refrãos de Rock e Pop enérgico.\n* **Ajuste de Pressão do Pé:** Mantenha o pé esquerdo pressionando a sapata com firmeza moderada para evitar que os dois pratos vibrem soltos zumbindo descontroladamente.\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-1-2-ex",
          "title": "Exercício 5 — Condução Contínua em Colcheias com Backbeat de Caixa",
          "subtitle": "Chimbal contínuo em 8 toques por compasso com caixa no 2 e 4",
          "targetBpm": 85,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Mão direita toca 8 colcheias no chimbal; mão esquerda entra sincronizada no 2 e 4",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Tempo 1: Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Contratempo \"e\": Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+SD",
              "notePt": "Tempo 2: Chimbal + Caixa",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Contratempo \"e\": Chimbal",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 4/4 | Metrônomo: 85 BPM (Inicial: 65 | Alvo: 105)\nHH: | x x x x x x x x | x x x x x x x x |\nSD: |     o       o   |     o       o   |\n      1 e 2 e 3 e 4 e   1 e 2 e 3 e 4 e\n          ",
          "targetExecutionSeconds": 48,
          "precisionCriteria": [
            "Todas as 8 colcheias de chimbal com espaçamento milimétrico idêntico",
            "O toque da caixa no 2 e 4 não deve alterar a dinâmica do chimbal que soa junto",
            "Contagem cantada em voz alta sem engasgar"
          ],
          "commonErrors": [
            "Acentuar o chimbal no momento em que a caixa toca tornando o prato estridente",
            "A mão direita falhar um golpe de chimbal ao tentar coordenar com a mão esquerda",
            "Acelerar a contagem nos contratempos \"e\""
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq05-1",
              "question": "Quantas colcheias cabem em um compasso 4/4 completo?",
              "options": [
                "8 colcheias",
                "4 colcheias",
                "16 colcheias",
                "6 colcheias"
              ],
              "correctIndex": 0,
              "explanation": "Como a semínima vale 1 tempo em 4/4 e cada semínima se divide em duas colcheias, o compasso comporta exatamente 8 colcheias (4 x 2 = 8)."
            },
            {
              "id": "dq05-2",
              "question": "Onde se localiza o contratempo na contagem cantada \"1 - e - 2 - e - 3 - e - 4 - e\"?",
              "options": [
                "Nas sílabas \"e\"",
                "Nos números 1, 2, 3 e 4",
                "Apenas no número 1",
                "Não existem contratempos em compasso binário/quaternário"
              ],
              "correctIndex": 0,
              "explanation": "Os números representam os tempos de cabeça (downbeats), enquanto as sílabas \"e\" representam os contratempos (upbeats)."
            }
          ]
        }
      },
      {
        "id": "bateria-l-1-3",
        "level": 1,
        "moduleTitle": "Módulo 2: Rudimentos e Subdivisão Rítmica",
        "lessonNumber": 6,
        "title": "Aula 6 — Grooves Clássicos de Pop, Rock e Worship",
        "subtitle": "Síncopes de bumbo no tempo forte e contratempo com backbeat sólido",
        "objective": "Tocar levadas completas de Pop/Rock e Worship moderno, posicionando o bumbo no tempo 1 e no contratempo \"e\" do tempo 3 com precisão de estúdio.",
        "estimatedMinutes": 30,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Groove Pop/Rock",
          "Síncope de bumbo"
        ],
        "parts": [
          {
            "id": "dl06-p1",
            "title": "1. O Groove Canônico do Rock/Pop (Bumbo no 1 e no 3-e)",
            "contentMarkdown": "\n### A Pulsação que Move Estádios\n\nUma das variações mais consagradas da música popular transfere o segundo bumbo do tempo 3 para o **contratempo do 3** (ou dobra: 3 e o contratempo \"e\"):\n\n```\n========================================================================\nGROOVE POP/ROCK CLÁSSICO (BUMBO NO 1, 3 e 3-e)\n========================================================================\nTempo:       1   e   2   e   3   e   4   e\nChimbal:    [x] [x] [x] [x] [x] [x] [x] [x]\nCaixa:        .   .  [o]  .   .   .  [o]  .\nBumbo:      [o]   .   .   .  [o] [o]  .   .\n------------------------------------------------------------------------\nAnálise:    Bumbo no 1 inicia com peso; caixa no 2 estala firme;\n            dois bumbos no \"3\" e no \"e\" geram propulsão rítmica.\n========================================================================\n```\n            "
          },
          {
            "id": "dl06-p2",
            "title": "2. A Levada Worship: Dinâmica Crescente e Rimshot",
            "contentMarkdown": "\n### Do Verso Suave ao Refrão Explosivo no Worship\n\n* **No Verso (Pianíssimo - P):** Chimbal fechado tocado com a ponta da baqueta; bumbo apenas no tempo 1 marcando o pulso e aro de caixa (Cross-Stick / Side Stick) no tempo 4.\n* **No Refrão (Fortíssimo - FF):** Condução no prato de ataque ou de condução aberto (wash); bumbo pulsando firme em colcheias ou sincopado; caixa em **Rimshot** (golpe simultâneo no centro da pele e no aro metálico com a haste da baqueta) para estalo ensurdecedor.\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-1-3-ex",
          "title": "Exercício 6 — O Groove Rock/Worship a 90 BPM",
          "subtitle": "Coordenação precisa de bumbo duplo sincronizado com colcheias de chimbal",
          "targetBpm": 90,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Chimbal em colcheias; caixa no 2 e 4; bumbo no 1, 3 e contratempo do 3",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+BD",
              "notePt": "Tempo 1: Bumbo + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+SD",
              "notePt": "Tempo 2: Caixa + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+BD",
              "notePt": "Tempo 3: Bumbo + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+BD",
              "notePt": "Contratempo \"e\": Bumbo + Chimbal",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 4/4 | Andamento: 90 BPM (Inicial: 70 | Alvo: 110)\nHH: | x   x   x   x   x   x   x   x   |\nSD: |         o               o       |\nBD: | o               o   o           |\n      1   e   2   e   3   e   4   e\n          ",
          "targetExecutionSeconds": 50,
          "precisionCriteria": [
            "O segundo bumbo no contratempo \"e\" do 3 deve cair rigorosamente alinhado com o golpe do chimbal",
            "Caixa no 2 e 4 com dinâmica constante e sem oscilar de volume",
            "Manter o pé esquerdo travando o chimbal para som seco e definido"
          ],
          "commonErrors": [
            "O pé direito adiantar o bumbo do contratempo gerando uma sensação de tropeço",
            "Bater a caixa mais fraca quando o bumbo toca logo em seguida",
            "Deixar o chimbal abrir acidentalmente por cansaço no pé esquerdo"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq06-1",
              "question": "Como se executa o Rimshot na caixa da bateria para obter máxima potência em refrãos de Rock/Worship?",
              "options": [
                "A baqueta atinge simultaneamente o centro da pele e o aro metálico com a haste da baqueta",
                "Golpeando apenas o corpo de madeira do tambor por fora",
                "Tocando a esteira inferior com a mão esquerda descalça",
                "Usando uma baqueta de feltro macia no prato de condução"
              ],
              "correctIndex": 0,
              "explanation": "O Rimshot clássico combina a ressonância encorpada da pele central com o estalo harmônico agudo do aro metálico atingido pela haste da baqueta no mesmo instante."
            },
            {
              "id": "dq06-2",
              "question": "No groove estudado, qual é o posicionamento exato do bumbo sincopado?",
              "options": [
                "No contratempo \"e\" do tempo 3",
                "No contratempo \"e\" do tempo 1",
                "No tempo 2 junto com a caixa",
                "Apenas no tempo 4"
              ],
              "correctIndex": 0,
              "explanation": "O bumbo no contratempo do 3 cria a antecipação rítmica característica que confere dinamismo e suingue à levada moderna."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 2,
    "name": "NÍVEL 2 — DESENVOLVIMENTO BÁSICO",
    "subtitle": "Paradiddle aplicado ao kit, semicolcheias, compasso composto 6/8 e viradas musicais",
    "badge": "Desenvolvimento",
    "description": "Aprofundamento técnico com o Single Paradiddle no kit, levadas de 16 notas (semicolcheias), baladas e worship em 6/8, e construção de viradas orquestradas com transição precisa para o crash.",
    "lessons": [
      {
        "id": "bateria-l-2-1",
        "level": 2,
        "moduleTitle": "Módulo 3: Paradiddle e Expressividade Técnica",
        "lessonNumber": 7,
        "title": "Aula 7 — O Paradiddle Simples Aplicado ao Kit",
        "subtitle": "A fórmula R-L-R-R L-R-L-L distribuída entre chimbal, caixa e bumbo",
        "objective": "Executar o Single Paradiddle em semicolcheias e orquestrá-lo no kit, posicionando a mão direita no prato e a esquerda na caixa com acentuação.",
        "estimatedMinutes": 30,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Single Paradiddle",
          "Orquestração no kit"
        ],
        "parts": [
          {
            "id": "dl07-p1",
            "title": "1. A Fórmula Mágica: R-L-R-R L-R-L-L",
            "contentMarkdown": "\n### O Rudimento Mais Versátil da História da Bateria\n\nO **Single Paradiddle** combina dois toques simples com um toque duplo:\n* **Primeira Metade:** `D - E - D - D` (\"Pa-ra-did-dle\")\n* **Segunda Metade:** `E - D - E - E` (\"Pa-ra-did-dle\")\n\n```\n========================================================================\nFÓRMULA DO SINGLE PARADIDDLE COM ACENTO\n========================================================================\nToques:      >                  >\n             D   E   D   D      E   D   E   E\nAltura:     30cm 5cm 5cm 5cm   30cm 5cm 5cm 5cm\nDinâmica:   FORTE piano piano  FORTE piano piano\n========================================================================\n```\nO toque acentuado (primeira nota) deve subir a cerca de 30 cm, enquanto as outras três notas (tap e doubles) permanecem como toques suaves a 5 cm da pele.\n            "
          },
          {
            "id": "dl07-p2",
            "title": "2. Orquestrando o Paradiddle no Kit",
            "contentMarkdown": "\n### Transformando um Exercício de Pad em um Groove Groovy\n\nQuando transferimos as mãos do paradiddle para peças diferentes, criamos levadas complexas com esforço mínimo:\n* **Mão Direita (D):** Toca na cúpula do prato de condução ou no chimbal.\n* **Mão Esquerda (E):** Toca na caixa. A nota acentuada vira o **Backbeat** no tempo 2 ou 4, e os toques não acentuados tornam-se notas fantasma sussurradas.\n* **Bumbo:** Apoia sincronizado com as notas acentuadas da mão direita.\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-2-1-ex",
          "title": "Exercício 7 — Single Paradiddle Acentuado em Semicolcheias",
          "subtitle": "Desenvolvimento de fluidez e acentuação no tempo forte a 80 BPM",
          "targetBpm": 80,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "D-E-D-D E-D-E-E contínuo com acentuação rigorosa na primeira nota de cada grupo",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D (Acento)",
              "notePt": "Mão Dir (Acento Downstroke)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "E",
              "notePt": "Mão Esq (Tap leve)",
              "pickDirection": "up"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D",
              "notePt": "Mão Dir (Double 1)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "D",
              "notePt": "Mão Dir (Double 2)",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 4/4 em Semicolcheias | Pad / Caixa\nManulação: | >               >               | >               >               |\n           | D E D D E D E E D E D D E D E E | D E D D E D E E D E D D E D E E |\nContagem:  | 1 e & a 2 e & a 3 e & a 4 e & a | 1 e & a 2 e & a 3 e & a 4 e & a |\n          ",
          "targetExecutionSeconds": 45,
          "precisionCriteria": [
            "Diferença dinâmica nítida entre o toque acentuado (Downstroke alto) e os três toques suaves subsequentes",
            "Manter velocidade contínua sem que o toque duplo atrase a contagem",
            "Nenhuma contração ou rigidez no pulso durante a inversão de mãos"
          ],
          "commonErrors": [
            "Tocar todas as 4 notas com o mesmo volume monótono",
            "Embolar o toque duplo (D-D ou E-E) transformando a semicolcheia em tercina",
            "Levantar o ombro esquerdo na hora do acento da mão esquerda"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq07-1",
              "question": "Qual é a sequência exata de manulação de um Single Paradiddle completo?",
              "options": [
                "D - E - D - D  |  E - D - E - E",
                "D - E - D - E  |  D - E - D - E",
                "D - D - D - D  |  E - E - E - E",
                "D - E - E - D  |  E - D - D - E"
              ],
              "correctIndex": 0,
              "explanation": "O Single Paradiddle é formado por dois toques simples e um toque duplo (D-E-D-D), seguido de sua inversão simétrica (E-D-E-E)."
            },
            {
              "id": "dq07-2",
              "question": "O que define a musicalidade do paradiddle quando aplicado na bateria?",
              "options": [
                "O contraste dinâmico entre o golpe acentuado e as notas não acentuadas suaves (taps)",
                "Tocar todas as notas com a força máxima possível para quebrar a baqueta",
                "Tocar apenas com a mão esquerda mantendo a direita no bolso",
                "Desativar a esteira da caixa para não produzir som"
              ],
              "correctIndex": 0,
              "explanation": "Sem contraste dinâmico, o paradiddle soa mecânico. O controle entre o acento alto e as notas baixas leves é o segredo de sua aplicação expressiva."
            }
          ]
        }
      },
      {
        "id": "bateria-l-2-2",
        "level": 2,
        "moduleTitle": "Módulo 3: Paradiddle e Expressividade Técnica",
        "lessonNumber": 8,
        "title": "Aula 8 — Grooves em Semicolcheias e Compasso Composto 6/8",
        "subtitle": "Levadas de 16 notas a duas mãos e baladas ternárias de Worship",
        "objective": "Tocar grooves em semicolcheias com condução alternada no chimbal (D-E-D-E) e dominar o compasso composto 6/8 com caixa no tempo 4.",
        "estimatedMinutes": 30,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Groove em 16th notes",
          "Compasso Composto 6/8"
        ],
        "parts": [
          {
            "id": "dl08-p1",
            "title": "1. O Groove em Semicolcheias a Duas Mãos (Two-Handed Hi-Hat)",
            "contentMarkdown": "\n### 16 Notas por Compasso: Funk, Disco e Pop Moderno\n\nQuando o andamento exige uma malha rítmica densa em semicolcheias (`1-e-&-a 2-e-&-a 3-e-&-a 4-e-&-a`), tocar com uma mão só causaria fadiga muscular. A solução é a condução alternada a duas mãos:\n\n* **Mãos no Chimbal:** Ambas as mãos tocam no chimbal alternando `D - E - D - E`.\n* **A Caixa no Backbeat:** A mão direita ou esquerda desce momentaneamente para a caixa no tempo 2 e no tempo 4 sem interromper a fluidez da esteira rítmica.\n            "
          },
          {
            "id": "dl08-p2",
            "title": "2. O Compasso 6/8: A Dança Ternária das Baladas e Worship",
            "contentMarkdown": "\n### Estrutura do Compasso Composto 6/8\n\nEm 6/8 temos 6 colcheias agrupadas em **duas pulsações ternárias principais (semínimas pontuadas)**:\n* **Pulso 1:** Compreende os tempos `1, 2, 3`.\n* **Pulso 2:** Compreende os tempos `4, 5, 6`.\n\n```\n========================================================================\nGRADE DO GROOVE EM COMPASSO 6/8 (WORSHIP / SLOW ROCK)\n========================================================================\nContagem:       1     2     3     4     5     6\nChimbal (HH):  [x]   [x]   [x]   [x]   [x]   [x]   (Condução fluida)\nCaixa   (SD):   .     .     .    [o]    .     .    (Estalo no tempo 4)\nBumbo   (BD):  [o]    .     .     .     .    [o]   (Bumbo no 1 e 6)\n========================================================================\n```\nO bumbo no 1 ancora o compasso; a caixa no 4 cria o clímax expressivo da balada.\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-2-2-ex",
          "title": "Exercício 8 — O Groove 6/8 de Conservatório a 50 BPM Pontuado",
          "subtitle": "Sustentação da pulsação composta ternária com dinâmica de caixa no 4",
          "targetBpm": 75,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 6,
            "noteValue": 8
          },
          "pickingPattern": "Chimbal contínuo em 6 colcheias; bumbo no 1 e 6; caixa estalada no 4",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+BD",
              "notePt": "Tempo 1: Bumbo + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Tempo 2: Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Tempo 3: Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+SD",
              "notePt": "Tempo 4: Caixa + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Tempo 5: Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+BD",
              "notePt": "Tempo 6: Bumbo + Chimbal",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 6/8 | 75 BPM de colcheia (ou 25 BPM pontuado)\nHH: | x  x  x  x  x  x | x  x  x  x  x  x |\nSD: |          o       |          o       |\nBD: | o              o | o              o |\n      1  2  3  4  5  6   1  2  3  4  5  6\n          ",
          "targetExecutionSeconds": 48,
          "precisionCriteria": [
            "Fluidez circular das 6 colcheias sem acentuar o tempo 2 ou 3 indevidamente",
            "Caixa no tempo 4 com estalo firme e ressonância aberta",
            "Bumbo no 6 antecipando suavemente o retorno para o tempo 1"
          ],
          "commonErrors": [
            "Tocar 6/8 como se fosse 3/4 (errar a acentuação do tempo 4)",
            "Parar o chimbal no momento em que a caixa golpeia no tempo 4",
            "Acelerar as colcheias 5 e 6 por ansiedade"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq08-1",
              "question": "Em um groove tradicional no compasso composto 6/8, em qual tempo a caixa deve soar para marcar o clímax do pulso?",
              "options": [
                "No tempo 4",
                "No tempo 2",
                "No tempo 3",
                "No tempo 6"
              ],
              "correctIndex": 0,
              "explanation": "Em 6/8, os dois pulsos principais recaem no tempo 1 (bumbo) e no tempo 4 (caixa), dividindo o compasso em duas metades de 3 colcheias cada."
            },
            {
              "id": "dq08-2",
              "question": "Qual vantagem técnica a condução a duas mãos no chimbal oferece em grooves de semicolcheias?",
              "options": [
                "Permite tocar 16 notas por compasso com relaxamento muscular sem sobrecarregar uma única mão",
                "Faz o bumbo tocar automaticamente sem precisar do pé",
                "Permite afinar os tambores durante a música",
                "Elimina a necessidade de usar metrônomo"
              ],
              "correctIndex": 0,
              "explanation": "Alternando D e E no chimbal, cada mão toca apenas em colcheias, reduzindo pela metade a exigência de velocidade individual e permitindo relaxamento físico."
            }
          ]
        }
      },
      {
        "id": "bateria-l-2-3",
        "level": 2,
        "moduleTitle": "Módulo 3: Paradiddle e Expressividade Técnica",
        "lessonNumber": 9,
        "title": "Aula 9 — Viradas de 1 Compasso e Transições Dinâmicas com Crash",
        "subtitle": "Distribuição melódica entre tambores e aterrissagem perfeita no tempo 1",
        "objective": "Construir viradas musicais completas de 1 compasso em semicolcheias (Caixa -> Tom 1 -> Tom 2 -> Surdo) e finalizar no prato de ataque com bumbo simultâneo no tempo 1.",
        "estimatedMinutes": 30,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Viradas de 1 compasso",
          "Transição para o Crash"
        ],
        "parts": [
          {
            "id": "dl09-p1",
            "title": "1. A Cascata Melódica dos Tambores",
            "contentMarkdown": "\n### A Geometria Espacial da Virada\n\nUma virada de bateria clássica percorre o kit no sentido horário (do agudo para o grave):\n1. **Tempo 1 (4 semicolcheias):** Caixa (`D E D E`)\n2. **Tempo 2 (4 semicolcheias):** Tom 1 (`D E D E`)\n3. **Tempo 3 (4 semicolcheias):** Tom 2 (`D E D E`)\n4. **Tempo 4 (4 semicolcheias):** Surdo (`D E D E`)\n\n```\n========================================================================\nFLUXO GEOMÉTRICO DA VIRADA DE 1 COMPASSO\n========================================================================\n[Caixa] ----> [Tom 1] ----> [Tom 2] ----> [Surdo] =====> [CRASH + BUMBO]\n(Tempo 1)     (Tempo 2)     (Tempo 3)     (Tempo 4)      (Tempo 1 do próx!)\n```\n            "
          },
          {
            "id": "dl09-p2",
            "title": "2. A Regra de Ouro: Aterrissagem no Crash + Bumbo no Tempo 1",
            "contentMarkdown": "\n### Como Não Perder o Andamento Durante a Virada\n\nO erro mais destrutivo cometido por bateristas iniciantes é **acelerar (rush) durante a virada** e depois \"cair fora do tempo\" no refrão. Para garantir precisão:\n\n* **O Ataque Triplo Simultâneo:** No tempo 1 do compasso seguinte, a mão direita atinge o **Prato de Crash**, o pé direito atinge o **Bumbo**, e o pé esquerdo **fecha o Chimbal** simultaneamente.\n* **Retorno Imediato ao Groove:** Não pare para admirar o som do prato! A mão esquerda já deve estar posicionada para o próximo backbeat de caixa, e a mão direita retoma a condução no chimbal ou ride sem hesitação.\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-2-3-ex",
          "title": "Exercício 9 — Ciclo Groove (3 Compassos) + Virada (1 Compasso)",
          "subtitle": "Manutenção rigorosa de andamento na transição entre levada e virada",
          "targetBpm": 85,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "3 compassos de groove Pop/Rock + 1 compasso de virada descendo pelos tambores + Crash no 1",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "SD",
              "notePt": "Tempo 1: Caixa (D E D E)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "T1",
              "notePt": "Tempo 2: Tom 1 (D E D E)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "T2",
              "notePt": "Tempo 3: Tom 2 (D E D E)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "FT",
              "notePt": "Tempo 4: Surdo (D E D E)",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 4/4 | 85 BPM (Inicial: 65 | Alvo: 105 BPM)\nComp 1 a 3: [ GROOVE ROCK CONTÍNUO ]\nComp 4 (Virada):\nSD: | D E D E . . . . . . . . . . . . |\nT1: | . . . . D E D E . . . . . . . . |\nT2: | . . . . . . . . D E D E . . . . |\nFT: | . . . . . . . . . . . . D E D E |\n      1 e & a 2 e & a 3 e & a 4 e & a\nComp 5: [ CRASH + BUMBO no tempo 1 ] e retoma o groove!\n          ",
          "targetExecutionSeconds": 55,
          "precisionCriteria": [
            "Zero oscilação de BPM entre os compassos de levada e o compasso de virada",
            "Impacto simultâneo milimétrico de Crash e Bumbo na cabeça do tempo 1 do Compasso 5",
            "Manter baquetas paralelas à pele dos tambores sem bater nos aros metálicos por erro de mira"
          ],
          "commonErrors": [
            "Acelerar desesperadamente na virada e cair adiantado no crash",
            "Tocar o crash sem o apoio do bumbo deixando a transição sonora oca e magra",
            "Travar o corpo e esquecer de respirar durante os 4 tempos da virada"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq09-1",
              "question": "Por que o prato de ataque (crash) deve quase sempre ser tocado junto com o bumbo no tempo 1 de uma transição?",
              "options": [
                "Porque o bumbo fornece o corpo grave que sustenta a explosão brilhante e aguda do crash, criando impacto pleno",
                "Porque é proibido tocar o crash sozinho pela lei da física acústica",
                "Para impedir que o prato caia da estante",
                "Porque a mão direita não consegue se mover sem o pé direito se mover junto"
              ],
              "correctIndex": 0,
              "explanation": "Acusticamente, o prato de ataque emite apenas frequências médias e agudas. Sem o peso grave do bumbo no mesmo instante, o impacto sonoro fica magro e desprovido de potência musical."
            },
            {
              "id": "dq09-2",
              "question": "Qual é o maior erro cometido por bateristas ao executar uma virada de 1 compasso em uma apresentação ao vivo?",
              "options": [
                "Acelerar o andamento (rush) devido à ansiedade motora, desalinhando a banda inteira",
                "Tocar a virada muito suavemente",
                "Usar uma baqueta de madeira",
                "Olhar para o surdo durante a execução"
              ],
              "correctIndex": 0,
              "explanation": "A excitação e o esforço motor de mover os braços pelo kit frequentemente levam o baterista a acelerar a virada, destruindo o timing sólido do arranjo."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 3,
    "name": "NÍVEL 3 — INTERMEDIÁRIO",
    "subtitle": "Ghost notes, controle dinâmico, técnica Moeller e fraseado rítmico musical",
    "badge": "Intermediário",
    "description": "Refinamento expressivo profissional: contraste dinâmico extremo com notas fantasma na caixa (30 cm vs 2 cm), a física do chicote na técnica Moeller e estruturação melódica de viradas.",
    "lessons": [
      {
        "id": "bateria-l-3-1",
        "level": 3,
        "moduleTitle": "Módulo 4: Dinâmica Avançada e Técnica Moeller",
        "lessonNumber": 10,
        "title": "Aula 10 — Ghost Notes e Contraste Dinâmico na Caixa",
        "subtitle": "A arte do sussurro rítmico: notas fantasma a 2 cm da pele vs acentos a 30 cm",
        "objective": "Dominar o toque de Ghost Notes na caixa com volume pianíssimo (pp) preenchendo as semicolcheias do groove sem competir com o backbeat acentuado.",
        "estimatedMinutes": 30,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Ghost Notes",
          "Controle dinâmico extremo"
        ],
        "parts": [
          {
            "id": "dl10-p1",
            "title": "1. O Que São Ghost Notes e Por Que Elas Criam o \"Suingue\"?",
            "contentMarkdown": "\n### A Terceira Dimensão do Som: Profundidade Sonora\n\nEm um groove básico, ouvimos apenas o bumbo, o chimbal e o estalo forte da caixa. As **Ghost Notes (Notas Fantasma)** preenchem o espaço vazio entre os tempos com pequenos toques percussivos quase inaudíveis individualmente, mas que conferem uma textura aveludada contagiante (essencial no Funk, R&B, Gospel e Pop refinado).\n\n* **Acento no 2 e 4:** Altura de baqueta a **30 cm**, gerando **Fortíssimo (ff)** com rimshot potente (~95 dB).\n* **Ghost Note:** Altura de baqueta a meros **2 cm da pele**, gerando **Pianíssimo (pp)** através de um toque leve dos dedos (~65 dB). Uma diferença acústica colossal de 30 decibéis!\n            "
          },
          {
            "id": "dl10-p2",
            "title": "2. A Notação das Notas Fantasma",
            "contentMarkdown": "\n### Notação em Grade com Ghost Notes Entre Parênteses\n\nNa partitura e nas tablaturas de bateria, notas fantasma são universalmente representadas entre parênteses: `(o)`.\n\n```\n========================================================================\nGROOVE FUNK/POP COM GHOST NOTES (ESTILO BERNARD PURDIE / CLYDE STUBBLEFIELD)\n========================================================================\nTempo:       1   e   &   a   2   e   &   a   3   e   &   a   4   e   &   a\nChimbal:    [x] [x] [x] [x] [x] [x] [x] [x] [x] [x] [x] [x] [x] [x] [x] [x]\nCaixa:        .   . (o)   . [O]   . (o) (o)   .   . (o)   . [O]   .   . (o)\nBumbo:      [o]   .   .   .   .   .   .   . [o]   .   .  [o]  .   .   .   .\n------------------------------------------------------------------------\nLegenda:    [O] = Acento alto (30 cm) | (o) = Ghost note leve (2 cm)\n========================================================================\n```\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-3-1-ex",
          "title": "Exercício 10 — O Groove com Ghost Notes na Caixa a 80 BPM",
          "subtitle": "Isolamento muscular de altura de baqueta com chimbal contínuo",
          "targetBpm": 80,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Chimbal em colcheias ou semicolcheias; caixa alternando acento forte e notas fantasma",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+BD",
              "notePt": "Tempo 1: Bumbo + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "SD (ghost)",
              "notePt": "Semicolcheia \"a\": Ghost note na caixa",
              "pickDirection": "up"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+SD (Acento)",
              "notePt": "Tempo 2: Caixa Forte + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "SD (ghost)",
              "notePt": "Contratempo: Ghost note na caixa",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nCompasso 4/4 | Andamento: 80 BPM (Inicial: 60 | Alvo: 95)\nHH: | x   x   x   x   x   x   x   x   |\nSD: |       (o)   O         (o)   O   |\nBD: | o               o   o           |\n      1   e   &   a   2   e   &   a\n          ",
          "targetExecutionSeconds": 50,
          "precisionCriteria": [
            "A baqueta que toca a ghost note não deve subir mais de 3 cm acima da pele",
            "O acento do tempo 2 deve manter projeção cortante sem diminuir de volume",
            "O chimbal deve permanecer regular e impassível sem acompanhar a oscilação de volume da caixa"
          ],
          "commonErrors": [
            "Tocar a ghost note com força excessiva parecendo um erro ou tropeço",
            "Deixar a baqueta quicar involuntariamente encostando na esteira",
            "Subir a mão direita no chimbal quando vai tocar a ghost note na mão esquerda"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq10-1",
              "question": "Qual é a altura física aproximada recomendada para a baqueta ao executar uma Ghost Note na caixa?",
              "options": [
                "Cerca de 2 cm acima da pele, quase encostada, utilizando apenas o movimento sutil dos dedos",
                "30 cm acima da cabeça para dar bastante velocidade",
                "Na altura do ombro com força máxima",
                "A mesma altura exata de um golpe de rimshot acentuado"
              ],
              "correctIndex": 0,
              "explanation": "A ghost note exige altura mínima (cerca de 2 cm) para que o golpe produza um som pianíssimo que funcione como textura rítmica sem mascarar o pulso forte."
            },
            {
              "id": "dq10-2",
              "question": "Como as Ghost Notes são comumente representadas na notação gráfica de bateria?",
              "options": [
                "Entre parênteses: (o) ou (x)",
                "Com letras maiúsculas em negrito",
                "Com uma seta vermelha apontando para cima",
                "Não podem ser escritas na pauta musical"
              ],
              "correctIndex": 0,
              "explanation": "Na convenção universal da escrita percussiva, notas circundadas por parênteses indicam dinâmica fantasma (ghost note/pianíssimo)."
            }
          ]
        }
      },
      {
        "id": "bateria-l-3-2",
        "level": 3,
        "moduleTitle": "Módulo 4: Dinâmica Avançada e Técnica Moeller",
        "lessonNumber": 11,
        "title": "Aula 11 — Técnica Moeller: Chicote, Downstroke, Upstroke e Tap",
        "subtitle": "A mecânica de Sanford Moeller para velocidade infinita com zero tensão muscular",
        "objective": "Executar os 4 movimentos essenciais do método Moeller (Downstroke, Tap, Upstroke e Whip) aplicando acentos fluidos em colcheias no chimbal e na caixa.",
        "estimatedMinutes": 35,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Método Moeller",
          "Quatro Golpes Fundamentais"
        ],
        "parts": [
          {
            "id": "dl11-p1",
            "title": "1. A Física do Chicote Humano: Sanford Moeller e Jim Chapin",
            "contentMarkdown": "\n### Por Que Tentar Tocar Rápido com o Punho Rígido Causa Tendinite?\n\nA técnica Moeller, desenvolvida pelo baterista militar Sanford Moeller e imortalizada por Jim Chapin e Dave Weckl, trata o braço como um **chicote**:\n* O movimento tem início no **ombro e cotovelo**.\n* A energia viaja pelo antebraço e deságua no **punho**.\n* O punho transfere a onda de choque para a baqueta, que atinge a pele com velocidade terminal sem que os músculos tenham que se contrair de forma isométrica.\n            "
          },
          {
            "id": "dl11-p2",
            "title": "2. Os Quatro Golpes Fundamentais do Sistema",
            "contentMarkdown": "\n### A Gramática Motora do Baterista de Alta Performance\n\n1. **Downstroke (Golpe Descendente Acentuado):** A baqueta parte do topo (30 cm), golpeia a pele com potência e **é travada perto da pele (2 cm)** pelos dedos, preparando a próxima nota baixa.\n2. **Tap (Toque Leve de Baixa Altura):** A baqueta parte de 2 cm, desfere um golpe pianíssimo e permanece a 2 cm.\n3. **Upstroke (Golpe Ascendente de Preparação):** A baqueta parte de 2 cm, golpeia a pele de raspão enquanto o cotovelo já a puxa para cima, terminando armada no topo (30 cm).\n4. **Full Stroke / Whip (Chicote Completo):** Golpe livre que parte do topo e retorna ao topo sem resistência.\n\n```\n========================================================================\nCICLO MOELLER DE 3 NOTAS (EX.: TERCINAS OU ACENTO A CADA 3 TOQUES)\n========================================================================\nNota 1: [ DOWNSTROKE ] -> Parte do alto, atinge forte e para embaixo (2 cm)\nNota 2: [ TAP ]        -> Toca baixinho e fica embaixo (2 cm)\nNota 3: [ UPSTROKE ]   -> Toca baixinho subindo e arma o próximo golpe no alto!\n========================================================================\n```\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-3-2-ex",
          "title": "Exercício 11 — O Ciclo Moeller no Chimbal (Acento no Tempo, Upstroke no \"e\")",
          "subtitle": "Acentuação orgânica de colcheias com movimento contínuo de onda de cotovelo",
          "targetBpm": 90,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Mão direita no chimbal: Downstroke no número (tempo) e Upstroke no \"e\" (contratempo)",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH (Down)",
              "notePt": "Tempo 1: Downstroke acentuado com haste",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH (Up)",
              "notePt": "Contratempo \"e\": Upstroke leve com ponta",
              "pickDirection": "up"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH (Down)",
              "notePt": "Tempo 2: Downstroke acentuado",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH (Up)",
              "notePt": "Contratempo \"e\": Upstroke leve",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nCompasso 4/4 | Metrônomo: 90 BPM (Progresso: 70 -> 90 -> 115 BPM)\nMovimento: | Down  Up  Down  Up  Down  Up  Down  Up  |\nHH:        | >         >         >         >         |\n           | x     x   x     x   x     x   x     x   |\nContagem:  | 1     e   2     e   3     e   4     e   |\n          ",
          "targetExecutionSeconds": 45,
          "precisionCriteria": [
            "Movimento fluido e circular do antebraço sem solavancos mecânicos",
            "O toque no número deve atingir o aro/borda com a haste da baqueta (som encorpado)",
            "O toque no \"e\" deve atingir o topo do prato suavemente com a ponta (som de ping)"
          ],
          "commonErrors": [
            "Endurecer o pulso transformando o movimento em dois golpes pesados iguais",
            "Fazer o upstroke sem tocar no prato perdendo a subdivisão da colcheia",
            "Tencionar o trapézio e elevar o ombro durante a passagem"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq11-1",
              "question": "Qual é a função primordial do golpe de Upstroke na técnica Moeller?",
              "options": [
                "Produzir um toque suave de baixa altura enquanto o braço já se eleva preparando o próximo golpe acentuado",
                "Jogar a baqueta para cima para pegá-la no ar",
                "Silenciar a esteira da caixa com o dedo polegar",
                "Bater no prato com a parte de trás da mão"
              ],
              "correctIndex": 0,
              "explanation": "O Upstroke é um golpe econômico: ele executa uma nota suave ao mesmo tempo em que a alavanca do braço sobe, preparando o próximo Downstroke potente sem gasto de tempo extra."
            },
            {
              "id": "dq11-2",
              "question": "Onde tem origem a onda biomecânica de movimento no golpe chicoteado Moeller?",
              "options": [
                "No ombro e cotovelo, propagando-se fluidamente até o punho e a ponta da baqueta",
                "Exclusivamente na primeira falange do dedo mindinho",
                "Na ponta do pé esquerdo",
                "Na mandíbula do baterista"
              ],
              "correctIndex": 0,
              "explanation": "A técnica Moeller utiliza grandes grupos musculares (costas, ombro e cotovelo) para gerar uma onda de energia que se afunila e acelera até a ponta da baqueta, agindo exatamente como um chicote."
            }
          ]
        }
      },
      {
        "id": "bateria-l-3-3",
        "level": 3,
        "moduleTitle": "Módulo 4: Dinâmica Avançada e Técnica Moeller",
        "lessonNumber": 12,
        "title": "Aula 12 — Construção de Viradas Musicais e Fraseado",
        "subtitle": "Superando a rotina dos tambores: pergunta e resposta, pausas e motivos rítmicos",
        "objective": "Compor e executar viradas musicais estruturadas com motivos de pergunta e resposta rítmica, pausas conscientes e dinâmica sem perda de andamento.",
        "estimatedMinutes": 35,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Fraseado Rítmico",
          "Pergunta e Resposta Musical"
        ],
        "parts": [
          {
            "id": "dl12-p1",
            "title": "1. O Conceito de Melodia Rítmica no Kit",
            "contentMarkdown": "\n### Bateristas Não Tocam Apenas Ritmo: Bateristas Tocam Melodia!\n\nUm baterista amador toca viradas que soam como uma máquina de lavar roupa desgovernada rolando escada abaixo. Um músico de conservatório pensa como um compositor:\n* **Afinação Relativa:** Caixa (agudo penetrante), Tom 1 (médio-agudo), Tom 2 (médio-grave), Surdo (grave ressonante), Bumbo (sub-grave).\n* **Desenvolvimento de Motivo:** Apresente uma pequena célula rítmica de 2 tempos (a **pergunta**) e responda com uma variação dinâmica nos 2 tempos seguintes (a **resposta**).\n* **O Valor do Silêncio:** Uma pausa súbita de meia semínima antes do clímax no prato de ataque cria cem vezes mais impacto do que 16 notas ininterruptas.\n            "
          },
          {
            "id": "dl12-p2",
            "title": "2. Arquitetura da Virada Pergunta-Resposta",
            "contentMarkdown": "\n```\n========================================================================\nESTRUTURA DE FRASEADO: PERGUNTA E RESPOSTA EM 1 COMPASSO (4/4)\n========================================================================\nTempo:      1     e     &     a     2     e     &     a\nFunção:     [ PERGUNTA RÍTMICA: Caixa e Tons ]\n            D     E     D     .     .     D     E     D\nPeças:      [ Caixa ]  [ Tom 1 ]         [ Tom 2 ]\n------------------------------------------------------------------------\nTempo:      3     e     &     a     4     e     &     a\nFunção:     [ RESPOSTA DINÂMICA: Surdo e Resolução com Pausa ]\n            D     E     D     E     D     .     .     .\nPeças:      [ Surdo de Chão ]      [ Bumbo ]   (Silêncio!)\n========================================================================\nTempo 1 do próx compasso: [ EXPLOSÃO DE CRASH + BUMBO ]\n========================================================================\n```\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-3-3-ex",
          "title": "Exercício 12 — A Virada Temática com Pausa de Semicolcheia",
          "subtitle": "Execução de fraseado orquestrado com precisão cirúrgica de silêncio a 95 BPM",
          "targetBpm": 95,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Frase melódica orquestrada com pausa no final do tempo 4 e resolução no 1",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "SD",
              "notePt": "Tempo 1: Frase de Caixa",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "T1",
              "notePt": "Tempo 2: Motivo no Tom 1",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "FT",
              "notePt": "Tempo 3: Resposta no Surdo",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "REST",
              "notePt": "Tempo 4 final: Pausa dramática",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nCompasso 4/4 | Andamento: 95 BPM (Inicial: 75 | Alvo: 115)\nComp de Virada:\nSD: | o . o . . . . . . . . . . . . . |\nT1: | . . . . o . o . . . . . . . . . |\nFT: | . . . . . . . . o o o o . . . . |\nBD: | . . . . . . . . . . . . o . . . |\n      1 e & a 2 e & a 3 e & a 4 e & a (silêncio no '& a'!)\nComp Seguinte: [ CRASH + BUMBO no 1 ]\n          ",
          "targetExecutionSeconds": 48,
          "precisionCriteria": [
            "Respeito absoluto à pausa no final do tempo 4 sem deixar baquetas esbarrarem em pratos",
            "Equilíbrio de volume entre os tambores de tamanhos diferentes",
            "Cair no tempo 1 do compasso seguinte no exato clique do metrônomo"
          ],
          "commonErrors": [
            "Preencher a pausa por insegurança ou medo do silêncio",
            "Atrasar o crash após a pausa",
            "Bater nos tons com dinâmicas desiguais"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq12-1",
              "question": "Qual é o papel do silêncio (pausas rítmicas) na construção de viradas musicais?",
              "options": [
                "Gera expectativa e contraste dinâmico, tornando a chegada no tempo 1 muito mais potente",
                "Serve apenas para o baterista coçar o nariz durante o show",
                "Indica que o baterista esqueceu como continuar tocando",
                "Diminui o volume geral do show para economizar energia do amplificador"
              ],
              "correctIndex": 0,
              "explanation": "O silêncio é uma ferramenta musical poderosa: uma pausa calculada de fração de segundo quebra a expectativa rítmica e amplia dramaticamente o impacto da resolução no tempo 1."
            },
            {
              "id": "dq12-2",
              "question": "O que diferencia uma virada musical expressiva de uma simples sequência mecânica de notas?",
              "options": [
                "A estruturação de motivos com pergunta, resposta, dinâmicas intencionais e respiração melódica",
                "A quantidade bruta de notas tocadas por segundo",
                "O número de pratos de ataque atingidos simultaneamente com a boca",
                "O uso de baquetas quebradas"
              ],
              "correctIndex": 0,
              "explanation": "A musicalidade reside na dramaturgia rítmica: utilizar afinações diferentes dos tambores para criar contornos melódicos com dinâmicas intencionais."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 4,
    "name": "NÍVEL 4 — AVANÇADO",
    "subtitle": "Independência dos 4 membros, linear drumming, compassos ímpares (7/8 e 5/4) e polirritmia",
    "badge": "Avançado",
    "description": "Técnica de alto rendimento: independência absoluta do pé esquerdo no chimbal, frases de bateria linear (linear drumming), domínio de métricas ímpares e polirritmia 3:2.",
    "lessons": [
      {
        "id": "bateria-l-4-1",
        "level": 4,
        "moduleTitle": "Módulo 5: Independência Total e Métricas Complexas",
        "lessonNumber": 13,
        "title": "Aula 13 — Independência do Pé Esquerdo e Condução no Chimbal",
        "subtitle": "Marcação contínua do pé esquerdo no 2 e 4 e aberturas sincopadas com splash",
        "objective": "Manter a marcação contínua de chimbal com o pé esquerdo nos tempos 2 e 4 enquanto conduz no prato de ride e sincroniza bumbos sincopados.",
        "estimatedMinutes": 35,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Independência de 4 membros",
          "Pé esquerdo no chimbal"
        ],
        "parts": [
          {
            "id": "dl13-p1",
            "title": "1. O Quarto Membro: Libertando o Pé Esquerdo",
            "contentMarkdown": "\n### Por Que o Pé Esquerdo Não Pode Ficar Morto na Sapata?\n\nNa bateria avançada (Jazz, Funk, Fusion e MPB), o pé esquerdo é um membro independente ativo:\n* **O \"Chick\" no 2 e 4:** Manter o chimbal pisando com pressão nos tempos 2 e 4 enquanto a mão direita conduz no prato de Ride. Isso fornece a espinha dorsal rítmica da banda, permitindo que o bumbo e a caixa façam síncopes livres.\n* **O \"Splash\" de Chimbal:** Movimento de calcanhar-ponta que faz os pratos colidirem e abrirem imediatamente, gerando um som brilhante de sustentação percussiva.\n            "
          },
          {
            "id": "dl13-p2",
            "title": "2. A Coordenação de 4 Membros em Grade",
            "contentMarkdown": "\n```\n========================================================================\nGRADE DE 4 MEMBROS INDEPENDENTES (CONDUÇÃO NO RIDE)\n========================================================================\nTempo:           1   e   2   e   3   e   4   e\nRide (Mão Dir): [x] [x] [x] [x] [x] [x] [x] [x]  (Condução constante)\nCaixa(Mão Esq):   .   . [o]   .   .   . [o]   .  (Backbeat clássico)\nHH Pé (Pé Esq):   .   . [x]   .   .   . [x]   .  (CHICK no 2 e 4!)\nBumbo(Pé Dir):  [o]   .   .  [o] [o]  .   .   .  (Síncopes no 1, e do 2, 3)\n========================================================================\n```\nObserve como o pé esquerdo trava no 2 e 4 exatamente junto com a caixa da mão esquerda, enquanto o pé direito desenha síncopes independentes!\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-4-1-ex",
          "title": "Exercício 13 — Quatro Membros Independentes com Condução no Ride",
          "subtitle": "Pé esquerdo firme no 2 e 4 com variações sincopadas de bumbo a 85 BPM",
          "targetBpm": 85,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Mão direita no Ride; pé esquerdo no chimbal; mão esquerda na caixa; pé direito no bumbo",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride+BD",
              "notePt": "Tempo 1: Ride + Bumbo",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride+SD+HH_F",
              "notePt": "Tempo 2: Ride + Caixa + Pé Esq Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride+BD",
              "notePt": "Contratempo: Bumbo antecipado",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride+SD+HH_F",
              "notePt": "Tempo 4: Ride + Caixa + Pé Esq Chimbal",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 4/4 | Metrônomo: 85 BPM (Inicial: 65 | Alvo: 105)\nRide:  | x x x x x x x x | x x x x x x x x |\nSD:    |     o       o   |     o       o   |\nHH Foot|     x       x   |     x       x   |\nBD:    | o     o o       | o     o o       |\n         1 e 2 e 3 e 4 e   1 e 2 e 3 e 4 e\n          ",
          "targetExecutionSeconds": 48,
          "precisionCriteria": [
            "O \"chick\" do pé esquerdo no chimbal deve soar com volume claro e estalado nos tempos 2 e 4",
            "O pé direito não deve vacilar ou atrasar quando o pé esquerdo pisa",
            "Manter a condução do prato de ride perfeitamente estável e fluida"
          ],
          "commonErrors": [
            "O pé esquerdo pisar involuntariamente em todos os momentos que o bumbo pisa",
            "O chimbal abrir acidentalmente gerando barulho descontrolado",
            "Perder o equilíbrio sobre o banco ao operar ambos os pés ao mesmo tempo"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq13-1",
              "question": "Qual é o papel da marcação de chimbal com o pé esquerdo nos tempos 2 e 4 ao conduzir no ride?",
              "options": [
                "Fornece uma âncora métrica estável que ancora o andamento e preenche o espaço sonoro",
                "Serve para descansar o pé esquerdo",
                "Faz o prato de ride vibrar com mais agudos",
                "Desativa os captadores da bateria eletrônica"
              ],
              "correctIndex": 0,
              "explanation": "A pisada no 2 e 4 com o pé esquerdo define a pulsação interna do kit, servindo de referência para todos os músicos do grupo e dando balanço ao groove."
            },
            {
              "id": "dq13-2",
              "question": "Como manter a estabilidade física no banco ao operar ambos os pés simultaneamente?",
              "options": [
                "Mantendo o centro de gravidade firme no osso da bacia (ísquios) e ativando a musculatura do core/abdômen",
                "Apoiando todo o peso do corpo sobre o pedal da caixa",
                "Segurando-se firmemente no prato de ataque com a mão esquerda",
                "Inclinando a coluna completamente para trás"
              ],
              "correctIndex": 0,
              "explanation": "O equilíbrio na bateria vem da sustentação do core (abdômen e lombar) apoiado sobre os ísquios no banco, deixando as pernas livres de sustentação de peso para acionar os pedais."
            }
          ]
        }
      },
      {
        "id": "bateria-l-4-2",
        "level": 4,
        "moduleTitle": "Módulo 5: Independência Total e Métricas Complexas",
        "lessonNumber": 14,
        "title": "Aula 14 — Linear Drumming (Bateria Linear) e Fraseado Moderno",
        "subtitle": "A regra de ouro linear: nenhum som soa simultaneamente",
        "objective": "Compreender o conceito de bateria linear e executar frases em semicolcheias distribuídas entre bumbo, caixa e chimbal sem sobreposição de toques.",
        "estimatedMinutes": 35,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Linear Drumming",
          "Gospel Chops e Fusion"
        ],
        "parts": [
          {
            "id": "dl14-p1",
            "title": "1. O Conceito Revolucionário da Bateria Linear",
            "contentMarkdown": "\n### Por Que a Bateria Linear Soa Tão Articulada e Moderna?\n\nNa bateria tradicional, instrumentos tocam juntos o tempo todo (ex.: Bumbo + Chimbal, Caixa + Chimbal). No **Linear Drumming (Fraseado Linear)**:\n* **REGRA ABSOLUTA:** **Em nenhum momento dois membros tocam ao mesmo tempo!**\n* Cada nota é um ponto isolado no tempo.\n* O resultado é uma transparência e articulação espetaculares, onde cada nota de tambor, prato ou bumbo é ouvida com 100% de clareza na mixagem. É a assinatura técnica de bateristas lendários como David Garibaldi (Tower of Power), Steve Gadd e os mestres do Gospel Chops.\n            "
          },
          {
            "id": "dl14-p2",
            "title": "2. Padrões Lineares de 4 e 6 Notas",
            "contentMarkdown": "\n```\n========================================================================\nPADRÃO LINEAR EM SEMICOLCHEIAS: R - L - K - K (Mão Dir, Mão Esq, Bumbo, Bumbo)\n========================================================================\nSemicolcheia:   1     e     &     a     2     e     &     a\nMembro:         D     E     B     B     D     E     B     B\nInstrumento:   [HH]  [SD]  [BD]  [BD]  [Ride][SD]  [BD]  [BD]\nSimultâneo?    NÃO   NÃO   NÃO   NÃO   NÃO   NÃO   NÃO   NÃO\n========================================================================\n```\nExperimente orquestrar: Toque a mão direita no Tom 1, a mão esquerda na Caixa, e os dois bumbos rápidos no pedal duplo ou simples!\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-4-2-ex",
          "title": "Exercício 14 — O Fraseado Linear R-L-K-K no Kit a 85 BPM",
          "subtitle": "Articulação sequencial estrita sem sobreposição de membros",
          "targetBpm": 85,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Sequência linear contínua D (Ride) - E (Caixa) - B (Bumbo) - B (Bumbo)",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride",
              "notePt": "Nota 1: Ride (Mão Dir)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "SD",
              "notePt": "Nota 2: Caixa (Mão Esq)",
              "pickDirection": "up"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "BD",
              "notePt": "Nota 3: Bumbo 1 (Pé Dir)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "BD",
              "notePt": "Nota 4: Bumbo 2 (Pé Dir)",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 4/4 em Semicolcheias | Metrônomo: 85 BPM (Inicial: 65 | Alvo: 105)\nRide: | x . . . . . . . x . . . . . . . |\nSD:   | . o . . . . . . . o . . . . . . |\nBD:   | . . o o . . . . . . o o . . . . |\n        1 e & a 2 e & a 3 e & a 4 e & a\n          ",
          "targetExecutionSeconds": 45,
          "precisionCriteria": [
            "Zero toques simultâneos (espaçamento milimétrico idêntico entre cada uma das 16 notas)",
            "O bumbo duplo deve soar com a mesma clareza e ataque das notas das mãos",
            "Manter andamento estável sem engavetar as notas"
          ],
          "commonErrors": [
            "Deixar a mão direita tocar junto com a caixa por vício de backbeat",
            "Atrasar o segundo bumbo por falta de técnica de pedal (Slide ou Heel-Toe)",
            "Tocar a caixa excessivamente alta em relação ao prato"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq14-1",
              "question": "Qual é o princípio definidor da técnica de Linear Drumming (Bateria Linear)?",
              "options": [
                "Nenhum membro toca simultaneamente no mesmo instante de tempo",
                "Tocar apenas em linha reta com os olhos fechados",
                "Bater apenas nos tambores que estão enfileirados",
                "Usar apenas baquetas de grafite alinhadas"
              ],
              "correctIndex": 0,
              "explanation": "O fraseado linear é estritamente monofônico na sua distribuição: apenas uma fonte sonora (mão ou pé) atinge um elemento do kit por fração de tempo."
            },
            {
              "id": "dq14-2",
              "question": "Qual é o efeito estético e acústico que a bateria linear produz em uma produção musical?",
              "options": [
                "Máxima definição, clareza e articulação sem cancelamentos de fase ou embolamento sonoro",
                "Um som completamente confuso onde não se entende nada",
                "A eliminação total dos pratos de condução",
                "A redução do volume para zero"
              ],
              "correctIndex": 0,
              "explanation": "Como não há frequências graves e agudas colidindo no mesmo instante exato, a bateria linear oferece separação e transparência rítmica impecáveis."
            }
          ]
        }
      },
      {
        "id": "bateria-l-4-3",
        "level": 4,
        "moduleTitle": "Módulo 5: Independência Total e Métricas Complexas",
        "lessonNumber": 15,
        "title": "Aula 15 — Compassos Ímpares (7/8 e 5/4) e Polirritmias (3:2)",
        "subtitle": "Subdivisões assimétricas (2+2+3 e 3+2) e a sobreposição polirrítmica",
        "objective": "Executar grooves em compasso 7/8 (subdivisão 2+2+3) e compasso 5/4, além de internalizar a polirritmia fundamental de 3 contra 2 (3:2).",
        "estimatedMinutes": 35,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Compassos Ímpares (7/8 e 5/4)",
          "Polirritmia 3:2"
        ],
        "parts": [
          {
            "id": "dl15-p1",
            "title": "1. O Compasso 7/8: A Matemática da Assimetria",
            "contentMarkdown": "\n### Desmistificando o Compasso 7/8\n\nUm compasso 7/8 contém 7 colcheias. Para que o groove ganhe pulso e dança em vez de parecer um tropeço, ele é subdividido em blocos binários e ternários:\n* **Subdivisão Canônica (2 + 2 + 3):**\n  * Bloco 1 (2 colcheias): `1 - 2` (Bumbo no 1)\n  * Bloco 2 (2 colcheias): `3 - 4` (Caixa no 3)\n  * Bloco 3 (3 colcheias): `5 - 6 - 7` (Bumbo no 5 com extensão ternária)\n\n```\n========================================================================\nGRADE DE COMPASSO 7/8 (SUBDIVISÃO 2 + 2 + 3)\n========================================================================\nColcheia:     1   2   |   3   4   |   5   6   7   |\nChimbal:     [x] [x]  |  [x] [x]  |  [x] [x] [x]  |\nCaixa:        .   .   |  [o]  .   |   .   .   .   |\nBumbo:       [o]  .   |   .   .   |  [o]  .   .   |\nSentimento:  \"TA - ka |   TA - ka |   TA - ka - ki\"\n========================================================================\n```\n            "
          },
          {
            "id": "dl15-p2",
            "title": "2. A Polirritmia de 3 Contra 2 (3:2)",
            "contentMarkdown": "\n### Duas Métricas Coexistindo no Mesmo Espaço de Tempo\n\nNa polirritmia 3:2, uma mão toca **3 pulsos uniformemente espaçados** enquanto a outra toca **2 pulsos no mesmo intervalo**:\n* **Frase Mnemônica de Conservatório:** `\"NOT DIF-FI-CULT\"` (Não é difícil!).\n  * \"NOT\": As duas mãos tocam juntas.\n  * \"DIF\": A mão que faz os 3 toca sozinha.\n  * \"FI\": A mão que faz os 2 toca sozinha.\n  * \"CULT\": A mão que faz os 3 toca sozinha.\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-4-3-ex",
          "title": "Exercício 15 — Groove em Compasso 7/8 a 140 BPM de Colcheia",
          "subtitle": "Sustentação contínua da métrica 2+2+3 sem hesitar na transição de compasso",
          "targetBpm": 75,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 7,
            "noteValue": 8
          },
          "pickingPattern": "Chimbal em 7 colcheias; bumbo no 1 e 5; caixa sólida no 3",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+BD",
              "notePt": "Tempo 1: Bumbo + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Tempo 2: Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+SD",
              "notePt": "Tempo 3: Caixa + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Tempo 4: Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH+BD",
              "notePt": "Tempo 5: Bumbo + Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Tempo 6: Chimbal",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "HH",
              "notePt": "Tempo 7: Chimbal",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 7/8 | Andamento: 75 BPM de semínima pontuada equivalente (~150 colcheia)\nHH: | x x x x x x x | x x x x x x x |\nSD: |     o         |     o         |\nBD: | o       o     | o       o     |\n      1 2 3 4 5 6 7   1 2 3 4 5 6 7\n      (2) (2)  (3)    (2) (2)  (3)\n          ",
          "targetExecutionSeconds": 48,
          "precisionCriteria": [
            "O bloco de 3 colcheias finais (5-6-7) não deve ser encurtado ou acelerado",
            "O retorno para a cabeça do tempo 1 deve soar natural e fluido",
            "Caixa no tempo 3 marcando o eixo da levada"
          ],
          "commonErrors": [
            "Adicionar uma 8ª colcheia por vício transformando o compasso em 4/4",
            "Tropeçar na transição entre o tempo 7 e o novo tempo 1",
            "Perder a conta cantada interna do agrupamento 2+2+3"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq15-1",
              "question": "Como se organiza a subdivisão assimétrica mais comum de um compasso 7/8 na música moderna?",
              "options": [
                "Em blocos de 2 + 2 + 3 colcheias (ou 3 + 2 + 2)",
                "Em 7 semibreves iguais",
                "Dividindo por 2 compassos de 4/4",
                "Tocando apenas no tempo 7"
              ],
              "correctIndex": 0,
              "explanation": "Para que o compasso ímpar de 7 colcheias tenha pulso orgânico, ele é agrupado em células de 2 e 3 tempos (2+2+3 ou 3+2+2)."
            },
            {
              "id": "dq15-2",
              "question": "Na polirritmia 3 contra 2 (3:2), o que ocorre no primeiro impacto?",
              "options": [
                "Ambas as mãos tocam juntas no mesmo instante exato",
                "A mão direita toca e a mão esquerda espera 1 compasso",
                "O pedal de bumbo quebra",
                "O metrônomo para de funcionar"
              ],
              "correctIndex": 0,
              "explanation": "Toda polirritmia clássica inicia com um ponto de sincronia absoluta (ponto zero), onde ambas as vozes partem simultaneamente."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 5,
    "name": "NÍVEL 5 — ESPECIALIZAÇÃO",
    "subtitle": "Vassourinhas (Brushes), Jazz Swing, Ritmos Brasileiros e Peça de Recital de Graduação",
    "badge": "Virtuoso",
    "description": "O ápice da formação em bateria: técnica de vassourinhas e condução de Jazz Swing, polirritmia e levadas da música brasileira (Samba, Bossa Nova e Baião), e solo estruturado de concerto final.",
    "lessons": [
      {
        "id": "bateria-l-5-1",
        "level": 5,
        "moduleTitle": "Módulo 6: Tradições Globais, Ritmos Brasileiros e Concerto",
        "lessonNumber": 16,
        "title": "Aula 16 — Vassourinhas (Brushes) e Condução de Jazz Swing",
        "subtitle": "A varredura circular (swish) na pele porosa e o swing ternário no Ride (\"Spang-a-lang\")",
        "objective": "Dominar o movimento circular de vassourinhas na mão esquerda criando a textura de swish contínuo e executar a condução clássica de Jazz Swing no Ride com chimbal no 2 e 4.",
        "estimatedMinutes": 40,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Vassourinhas (Brushes)",
          "Jazz Swing Spang-a-lang"
        ],
        "parts": [
          {
            "id": "dl16-p1",
            "title": "1. A Arte das Vassourinhas na Pele Porosa",
            "contentMarkdown": "\n### O Som de Veludo do Jazz Tradicional\n\nAs vassourinhas de arame de aço exigem peles porosas (Coated) na caixa para gerar atrito sonoro:\n* **Mão Esquerda (O Círculo Swish):** A mão esquerda descreve um **círculo contínuo no sentido horário** sobre a pele sem nunca desencostar os arames. Isso produz o tapete acústico sussurrado característico do Jazz acústico.\n* **Mão Direita (Acentos e Toques):** Desfere toques leves nos tempos 2 e 4 ou acompanha o swing com toques e puxadas.\n            \n\n* **Vassourinhas:** A técnica de Vassourinhas desliza em círculos suaves criando o tapete do jazz swing."
          },
          {
            "id": "dl16-p2",
            "title": "2. O Padrão Rítmico de Jazz Swing no Ride (\"Spang-a-lang\")",
            "contentMarkdown": "\n### A Condução Sagrada do Jazz: Tercinas de Semínima\n\nO swing não é tocado em colcheias retas; ele é baseado em **tercinas de colcheia**:\n\n```\n========================================================================\nCONDUÇÃO DE JAZZ SWING NO PRATO DE RIDE\n========================================================================\nTempo:         1           2      e       3           4      e\nRide:         [x]         [x]    [x]     [x]         [x]    [x]\nMétrica:     Semínima     Tercina(3ª col)Semínima   Tercina(3ª col)\nOnomatopeia:  SPANG        -      A     - LANG       -      A\nChimbal Pé:    .          [x]     .       .         [x]     .  (Chick no 2 e 4!)\nBumbo:       (Feathering: toque quase inaudível marcando os 4 tempos)\n========================================================================\n```\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-5-1-ex",
          "title": "Exercício 16 — Condução de Jazz Swing com Chimbal no 2 e 4 a 120 BPM",
          "subtitle": "Flutuação ternária no Ride com feathering de bumbo e chick de pé esquerdo",
          "targetBpm": 120,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Ride conduzindo \"1, 2-e, 3, 4-e\" em tercinas; chimbal pisado estalado no 2 e 4",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride",
              "notePt": "Tempo 1: Semínima limpa no Ride",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride+HH_F",
              "notePt": "Tempo 2: Ride + Chick firme de Pé Esq",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride (swing)",
              "notePt": "Tercina do 2: Toque swingado leve",
              "pickDirection": "up"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride",
              "notePt": "Tempo 3: Semínima limpa no Ride",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 4/4 Swing Feel | Andamento: 120 BPM (Inicial: 90 | Alvo: 140)\nRide:   | x   x  x x   x  x | x   x  x x   x  x |\nHH Foot:|     x        x    |     x        x    |\nBD:     |(o) (o)  (o) (o)   |(o) (o)  (o) (o)   |\n          1   2  e 3   4  e   1   2  e 3   4  e\n          (Subdivisão tercinada)\n          ",
          "targetExecutionSeconds": 45,
          "precisionCriteria": [
            "O \"e\" swingado deve cair exatamente na terceira colcheia da tercina e nunca em colcheia reta",
            "O bumbo deve ser tocado como \"feathering\" (tão suave que é sentido mais como vibração do que como ataque)",
            "O pé esquerdo no chimbal no 2 e 4 deve ser seco, preciso e constante"
          ],
          "commonErrors": [
            "Tocar o prato reto em colcheias binárias de rock perdendo o balanço do swing",
            "Tocar o bumbo alto demais invadindo o espaço do contrabaixo acústico",
            "Tencionar a mão direita e perder a elasticidade do prato"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq16-1",
              "question": "Qual é o nome da técnica em que o bumbo toca os 4 tempos de jazz de forma quase inaudível, apenas como sustentação de peso acústico?",
              "options": [
                "Feathering (toque de pluma)",
                "Blast Beat",
                "Rimshot extremo",
                "Double Bass Kick"
              ],
              "correctIndex": 0,
              "explanation": "Feathering consiste em tocar o bumbo tão suavemente com o calcanhar baixo que o som mal é percebido isoladamente, servindo apenas para engordar o som das notas do contrabaixo acústico."
            },
            {
              "id": "dq16-2",
              "question": "Em que subdivisão métrica o ritmo de Jazz Swing se fundamenta?",
              "options": [
                "Em tercinas de colcheia (subdivisão ternária)",
                "Em semicolcheias binárias retas",
                "Em fusas militares",
                "Em semibreves estáticas"
              ],
              "correctIndex": 0,
              "explanation": "O swing fundamenta-se na subdivisão ternária: o tempo é dividido em três partes iguais, e a nota do contratempo cai na terceira parte da tercina."
            }
          ]
        }
      },
      {
        "id": "bateria-l-5-2",
        "level": 5,
        "moduleTitle": "Módulo 6: Tradições Globais, Ritmos Brasileiros e Concerto",
        "lessonNumber": 17,
        "title": "Aula 17 — Ritmos Brasileiros: Samba, Bossa Nova e Baião",
        "subtitle": "A orquestração do surdo no bumbo, o tamborim no prato e o clave de Bossa Nova",
        "objective": "Orquestrar a riqueza da percussão brasileira no kit: o bumbo imitando o surdo de escola de samba, a mão esquerda no aro (cross-stick) e o balanço do Baião nordestino.",
        "estimatedMinutes": 40,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Samba na Bateria",
          "Bossa Nova Clave",
          "Baião"
        ],
        "parts": [
          {
            "id": "dl17-p1",
            "title": "1. O Samba na Bateria: Uma Escola de Samba em Um Homem Só",
            "contentMarkdown": "\n### A Transposição dos Instrumentos de Percussão Brasileira para o Kit\n\n* **Bumbo (O Surdo de Marcação):** O surdo de primeira e segunda é imitado pelo pedal de bumbo:\n  * Tempo 1: Golpe mais suave e abafado.\n  * Tempo 2: Golpe com sustentação aberta e acentuação com síncope antecipada (`tum... tum-PÁ`).\n* **Mão Direita (O Prato/Tamborim):** Conduz o desenho sincopado do tamborim no prato ou no chimbal semi-aberto.\n* **Mão Esquerda (O Caixa de Guerra / Repique de Anel):** Toca no aro (cross-stick) ou na pele desenhando a síncope brasileira.\n            \n\n* **Samba:** O Samba na bateria transfere o surdo de marcação para o bumbo e o tamborim para o prato."
          },
          {
            "id": "dl17-p2",
            "title": "2. A Bossa Nova e o Baião Nordestino",
            "contentMarkdown": "\n### Clave de Bossa Nova e o Pulso do Zabumba\n\n* **Clave de Bossa Nova no Aro da Caixa (Cross-Stick):**\n  * Compasso 1: Toques no `1, contratempo do 2, 4`.\n  * Compasso 2: Toques no `contratempo do 1, 3`.\n* **Baião na Bateria:** O bumbo imita o clássico toque grave do zabumba nordestino:\n  * `TUM ... TUM-TÁ` (Semínima no 1, e duas semicolcheias sincopadas no tempo 2).\n  * A mão direita conduz no chimbal imitando o triângulo em semicolcheias rápidas com acento na segunda semicolcheia!\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-5-2-ex",
          "title": "Exercício 17 — Levada de Samba de Conservatório a 95 BPM",
          "subtitle": "Bumbo sincopado imitando o surdo com aro de caixa e condução de tamborim",
          "targetBpm": 95,
          "targetRepetitions": 15,
          "timeSignature": {
            "beats": 2,
            "noteValue": 4
          },
          "pickingPattern": "Bumbo com peso no 2; mão esquerda no aro da caixa; mão direita no prato em semicolcheias sincopadas",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "BD (suave)",
              "notePt": "Tempo 1: Bumbo imitando surdo de resposta",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Rim (Aro)",
              "notePt": "Contratempo: Estalo no aro da caixa",
              "pickDirection": "up"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "BD (forte)",
              "notePt": "Tempo 2: Bumbo acentuado (surdo de primeira)",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "Ride/HH",
              "notePt": "Semicolcheias: Condução de tamborim",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nCompasso 2/4 (Samba Brasileiro) | Andamento: 95 BPM (Inicial: 75 | Alvo: 115)\nPrato: | x . x x . x . x | x . x x . x . x |\nAro:   | . o . . o . . o | . o . . o . . o |\nBD:    | o . . . . o o . | o . . . . o o . |\n         1 e & a 2 e & a   1 e & a 2 e & a\n          ",
          "targetExecutionSeconds": 48,
          "precisionCriteria": [
            "O andamento de 2/4 deve possuir o balanço e suingue natural sem soar duro ou militar",
            "O bumbo no tempo 2 deve ter mais peso e sustentação do que o bumbo do tempo 1",
            "O estalo do aro da caixa (cross-stick) deve ser cristalino e amadeirado"
          ],
          "commonErrors": [
            "Tocar o bumbo do tempo 1 mais forte do que o tempo 2 invertendo a hierarquia do surdo",
            "Endurecer o pulso da mão direita perdendo as nuances do tamborim",
            "Acelerar involuntariamente devido à complexidade rítmica"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq17-1",
              "question": "Qual instrumento da bateria acústica assume a função de reproduzir a marcação do surdo de escola de samba?",
              "options": [
                "O pedal de bumbo, com dinâmica mais suave no 1 e mais pesada e acentuada no 2",
                "O prato de ataque tocado com vassourinha",
                "O tom de 10 polegadas",
                "O pedal de chimbal aberto"
              ],
              "correctIndex": 0,
              "explanation": "No samba tradicional, o bumbo reproduz a conversa dos surdos de marcação, onde o surdo de primeira (mais grave e forte) ancora o tempo 2, enquanto o surdo de segunda responde no tempo 1."
            },
            {
              "id": "dq17-2",
              "question": "Qual instrumento folclórico nordestino o bumbo imita na levada de Baião na bateria?",
              "options": [
                "A Zabumba (com a célula grave característica no tempo forte e contratempos)",
                "O Berimbau",
                "O Caxixi",
                "A Flauta de pã"
              ],
              "correctIndex": 0,
              "explanation": "A levada de Baião na bateria reproduz o ritmo característico da Zabumba no bumbo e o tilintar sincopado do triângulo no chimbal ou condução."
            }
          ]
        }
      },
      {
        "id": "bateria-l-5-3",
        "level": 5,
        "moduleTitle": "Módulo 6: Tradições Globais, Ritmos Brasileiros e Concerto",
        "lessonNumber": 18,
        "title": "Aula 18 — Solo Temático, Afinação Profissional e Concerto Final",
        "subtitle": "A conclusão da jornada acadêmica em bateria: recital de solo estruturado",
        "objective": "Executar a peça de recital de graduação completa, integrando afinação de peles, dinâmica extrema, polirritmia, bateria linear e solo temático memorável.",
        "estimatedMinutes": 50,
        "instrument": "bateria",
        "rudimentsFocused": [
          "Solo Temático de Bateria",
          "Afinação de Peles",
          "Recital de Graduação"
        ],
        "parts": [
          {
            "id": "dl18-p1",
            "title": "1. A Dramaturgia de um Grande Solo de Bateria de Conservatório",
            "contentMarkdown": "\n### Solo de Bateria Não É Velocidade Aleatória: É Narrativa Musical\n\nPara que um solo de bateria comova e prenda a atenção de uma plateia por minutos, ele deve ser arquitetado em três atos:\n\n1. **Ato I — Introdução e Estabelecimento do Tema (Pianíssimo ao Mezzo-Forte):**\n   * Motivo rítmico simples nos tambores graves (surdo e bumbo).\n   * Respiração e espaços abertos com notas de prato de condução sutis.\n2. **Ato II — Desenvolvimento e Conflito Rítmico (Forte ao Fortíssimo):**\n   * Modulação para bateria linear rápida.\n   * Introdução de compassos compostos e polirritmia 3:2.\n   * Frases explosivas de paradiddles orquestrados e rudimentos de bumbo duplo.\n3. **Ato III — Clímax e Conclusão Triunfal:**\n   * Crescendo épico de caixa com técnica Moeller.\n   * Fechamento em grande tutti no tempo 1 com Crash e Bumbo simultâneos em uníssono estrondoso.\n            "
          },
          {
            "id": "dl18-p2",
            "title": "2. Afinação de Peles por Intervalos Musicais",
            "contentMarkdown": "\n### O Segredo do Timbre Profissional\n\n* **Pele de Resposta vs Pele de Ataque:** Afinar a pele de resposta ligeiramente mais apertada que a de ataque confere projeção, definição de nota e reduz o sustain embolado.\n* **Intervalos Harmônicos entre Tambores:**\n  * Tom 1 (10\") -> Afinado em **Dó (C)**\n  * Tom 2 (12\") -> Afinado em **Sol (G)** (Quinta justa abaixo)\n  * Surdo (16\") -> Afinado em **Dó grave (C)** (Oitava abaixo do Tom 1)\nEssa relação intervalar impede ressonâncias simpáticas desarmônicas quando a banda estiver tocando!\n            "
          }
        ],
        "practicalExercise": {
          "id": "bateria-l-5-3-ex",
          "title": "Exercício 18 — A Peça de Recital de Graduação (Solo Estruturado)",
          "subtitle": "Execução do ciclo de concerto integrando dinâmicas de pianíssimo a fortíssimo a 100 BPM",
          "targetBpm": 100,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Ciclo completo de 16 compassos: Tema -> Linear Chops -> Moeller Crescendo -> Clímax Tutti",
          "notesSequence": [
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "TEMA",
              "notePt": "Compassos 1-4: Tema melódico no Surdo/Bumbo",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "LINEAR",
              "notePt": "Compassos 5-8: Bateria linear R-L-K-K",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "MOELLER",
              "notePt": "Compassos 9-12: Rolo Moeller com crescendo",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "fret": 0,
              "noteCipher": "CLÍMAX",
              "notePt": "Compassos 13-16: Todos os membros no clímax final",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nPeça de Concerto Final: \"The Rhythm Sanctuary\" (4/4 | 100 BPM)\nComp 1-4:   | FT . . BD . FT . . | (Dinâmica pp a mf)\nComp 5-8:   | D E B B D E B B    | (Linear Chops rápido f)\nComp 9-12:  | D D E E D D E E    | (Moeller Roll com crescendo ff)\nComp 13-15: | CRASH + BUMBO + ACCENTS nos Toms |\nComp 16:    | [ CRASH + BUMBO FINAL NO TEMPO 1 ] | Sustenta o prato com silêncio absoluto!\n          ",
          "targetExecutionSeconds": 65,
          "precisionCriteria": [
            "Dramaturgia sonora impecável: contraste visível e auditivo entre o pianíssimo inicial e o fortíssimo final",
            "Manter pulso imperturbável de 100 BPM ao longo de todas as transições de estilo",
            "Postura relaxada e domínio visual e ergonômico completo de todas as peças do kit"
          ],
          "commonErrors": [
            "Começar o solo já no volume máximo não sobrando espaço para crescer",
            "Acelerar o andamento no clímax do Moeller roll",
            "Terminar de forma tímida sem cravar o tempo 1 final com bumbo e crash juntos"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "dq18-1",
              "question": "Qual é a estrutura dramática recomendada para um solo de bateria de concerto de nível conservatório?",
              "options": [
                "Três atos: Introdução temática com dinâmicas sutis, desenvolvimento com complexidade linear/polirritmia e clímax triunfal",
                "Tocar a mesma virada de bumbo o tempo todo por 10 minutos",
                "Bater apenas nos pratos o mais rápido possível e sair correndo",
                "Não tocar os tambores e apenas falar no microfone"
              ],
              "correctIndex": 0,
              "explanation": "Um grande solo é uma narrativa musical: estabelece um motivo rítmico temático, explora variações dinâmicas e texturas, e culmina em um clímax estruturado."
            },
            {
              "id": "dq18-2",
              "question": "Por que é recomendado afinar os tambores (tons e surdo) em intervalos harmônicos de terças ou quartas/quintas?",
              "options": [
                "Para criar uma relação melódica agradável entre as peças e evitar ressonâncias dissonantes na mixagem",
                "Para fazer a bateria tocar notas de contrabaixo sozinha",
                "Porque os tambores só funcionam se estiverem na mesma nota do violino",
                "Para impedir que a baqueta lasque"
              ],
              "correctIndex": 0,
              "explanation": "Afinar tambores em intervalos musicais consonantes (como quartas ou quintas) proporciona clareza tonal em viradas melódicas e integração harmônica com a harmonia dos outros instrumentos."
            }
          ]
        }
      }
    ]
  }
];

export const DRUMS_LESSONS: DrumsLesson[] = DRUMS_COURSE_LEVELS.flatMap((l) => l.lessons);

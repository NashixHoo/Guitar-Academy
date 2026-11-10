// =========================================================================
// GUITAR ACADEMY — FORMAÇÃO DE CONSERVATÓRIO
// Módulo de Conteúdo Oficial V1 — src/data/bassCourse.ts
// 100% tipado, progressivo e compatível com a interface Lesson
// =========================================================================

import { BassLesson, BassCourseLevel } from '../types';

export const BASS_COURSE_LEVELS: BassCourseLevel[] = [
  {
    "level": 0,
    "name": "NÍVEL 0 — FUNDAMENTOS E CONTROLE INSTRUMENTAL",
    "subtitle": "Anatomia, ergonomia sem lesão, afinação, técnica de alternância i-m e digitação básica",
    "badge": "Fundamentos",
    "description": "O alicerce físico e acústico do contrabaixista moderno: postura sentado e em pé, apoio no captador, toque apoiado (rest stroke), pressão mínima sem tensão e primeiras notas na região grave.",
    "lessons": [
      {
        "id": "baixo-l-0-1",
        "level": 0,
        "moduleTitle": "Módulo 1: Fundamentos da Sustentação Grave",
        "lessonNumber": 1,
        "title": "Aula 1 — Anatomia do Contrabaixo, Ergonomia e Calibração de Frequências Graves",
        "subtitle": "Componentes do instrumento de 4 cordas, equilíbrio de peso e física acústica na mixagem",
        "objective": "Compreender a função estrutural do contrabaixo elétrico, regulagem de correia para postura neutra e afinação precisa em E1-A1-D2-G2.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "tuning": "E1-A1-D2-G2",
        "stringsCount": 4,
        "parts": [
          {
            "id": "bl01-p1",
            "title": "1. O Papel do Contrabaixo e a Física das Frequências Baixas",
            "contentMarkdown": "\n### O Alicerce Acústico: Peso, Frequência e Conexão Rítmico-Harmônica\n\nO contrabaixo elétrico é o instrumento pivotal de qualquer formação musical contemporânea. Ele estabelece o ponto de gravidade onde a harmonia (acordes) se funde com o pulso rítmico (bateria).\n\n* **Faixa de Frequência Fundamental:** Opera entre **40 Hz e 200 Hz**. Essas ondas longas exigem grande deslocamento de ar e são percebidas fisicamente no peito do ouvinte.\n* **Escala Standard (34 polegadas / 864 mm):** Distância da pestana (nut) ao rastilho na ponte. Essa extensão garante que a corda mais grossa (Mi / E1) possua tensão suficiente para vibrar com afinação definida sem soar frouxa ou embolada.\n* **Captadores Magnéticos:**\n  * **Split-Coil (Precision Bass):** Bobinas divididas canceladoras de ruído. Produzem um som encorpado, focado nos médios-graves e com ataque direto.\n  * **Single-Coil (Jazz Bass):** Bobinas lineares nos pontos de braço e ponte. Entregam definição cortante, brilho de harmônicos e flexibilidade tímbrica.\n\n```\n========================================================================\nANATOMIA DO CONTRABAIXO DE 4 CORDAS (VISÃO GERAL)\n========================================================================\n[Headstock] -> Tarraxas blindadas de alta precisão (relação 20:1)\n    ||\n  [Nut]     -> Pestana de osso/grafite (altura calibrada para conforto)\n    ||\n  [Braço]   -> Madeira dura (Maple/Marfim), raio de escala de 9.5\" a 12\"\n  [Trastes] -> 20 a 24 trastes Jumbo para entonação precisa\n    ||\n  [Corpo]   -> Madeira sólida (Alder/Ash) proporcionando ressonância e sustain\n  [Captador]-> Sensor eletromagnético que converte vibração de aço em áudio\n  [Ponte]   -> Saddles individuais com ajuste de altura e oitavas (intonação)\n========================================================================\n```\n            "
          },
          {
            "id": "bl01-p2",
            "title": "2. Postura Neutra, Altura da Correia e Afinação E-A-D-G",
            "contentMarkdown": "\n### Ergonomia sem Lesão e Afinação Absoluta\n\nO maior inimigo do contrabaixista é a flexão excessiva do pulso esquerdo. Para proteger o túnel do carpo e os tendões flexores:\n\n1. **Ajuste da Correia (Regra de Ouro):** O instrumento deve permanecer na **mesma altura** quer você esteja sentado ou em pé. O centro do corpo do baixo deve cobrir o umbigo.\n2. **Ângulo do Braço:** O braço do baixo deve apontar para cima em um ângulo de aproximadamente 30° a 45°, permitindo que o ombro esquerdo relaxe completamente.\n3. **Afinação Padrão (Frequências Reais):**\n   * **4ª Corda (mais grossa):** **E1** (~41.20 Hz) — Mi grave\n   * **3ª Corda:** **A1** (55.00 Hz) — Lá\n   * **2ª Corda:** **D2** (~73.42 Hz) — Ré\n   * **1ª Corda (mais fina):** **G2** (~97.99 Hz) — Sol\n\n> 💡 **Nota de Ouro:** Observe que o baixo de 4 cordas é afinado nos mesmos intervalos das 4 cordas mais graves da guitarra e do violão, soando exatamente **uma oitava abaixo**.\n            "
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-0-1-ex",
          "title": "Exercício 1 — Calibração e Sustentação de Cordas Soltas",
          "subtitle": "Aferição acústica e sustentação de 4 tempos por corda",
          "targetBpm": 60,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Toque apoiado (Rest Stroke) alternado com polegar ancorado",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "up"
            },
            {
              "stringNumber": 2,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |---------------------------------0---|\nD |-------------------------0-----------|\nA |-----------------0-------------------|\nE |---------0---------------------------|\n   Contagem: 1   2   3   4   1   2   3   4\n          ",
          "instructions": [
            "Afine o contrabaixo com afinador cromático de alta sensibilidade.",
            "Apoie o polegar direito no captador do braço (Precision) ou captador do braço (Jazz).",
            "Toque a 4ª corda (E) e deixe soar por 4 tempos exatos no metrônomo a 60 BPM.",
            "Passe para A, D e G sucessivamente, abafando a corda anterior com a lateral do dedo que tocou."
          ],
          "biomechanicTips": [
            "Mantenha o pulso reto, sem ângulo agudo com o antebraço.",
            "O toque deve ser direcionado para dentro, descansando o dedo na corda de cima."
          ],
          "validationCriteria": "Executar 12 ciclos consecutivos em 60 BPM sem flutuação de afinação nem ruído de cordas soltas vibrando por simpatia.",
          "precisionCriteria": [
            "Afine o contrabaixo com afinador cromático de alta sensibilidade.",
            "Apoie o polegar direito no captador do braço (Precision) ou captador do braço (Jazz).",
            "Toque a 4ª corda (E) e deixe soar por 4 tempos exatos no metrônomo a 60 BPM.",
            "Passe para A, D e G sucessivamente, abafando a corda anterior com a lateral do dedo que tocou."
          ],
          "commonErrors": [
            "Mantenha o pulso reto, sem ângulo agudo com o antebraço.",
            "O toque deve ser direcionado para dentro, descansando o dedo na corda de cima."
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq01-1",
              "question": "Qual é a afinação padrão das 4 cordas do contrabaixo elétrico, da mais grave para a mais aguda?",
              "options": [
                "E1 - A1 - D2 - G2",
                "B0 - E1 - A1 - D2",
                "D1 - G1 - B1 - E2",
                "C1 - G1 - D2 - A2"
              ],
              "correctIndex": 0,
              "explanation": "A afinação padrão de 4 cordas é Mi (E1: ~41.2 Hz), Lá (A1: 55 Hz), Ré (D2: ~73.4 Hz) e Sol (G2: ~98 Hz)."
            },
            {
              "id": "bq01-2",
              "question": "Qual é a regra biomecânica fundamental para ajuste da correia no contrabaixo?",
              "options": [
                "O instrumento deve permanecer na mesma altura relativa ao tronco quer o músico esteja sentado ou em pé",
                "O instrumento deve ficar o mais baixo possível na altura dos joelhos",
                "O braço deve ficar perfeitamente horizontal sem inclinação",
                "O polegar esquerdo deve segurar o braço por cima da escala"
              ],
              "correctIndex": 0,
              "explanation": "Manter a mesma altura sentado e em pé protege os tendões do pulso esquerdo contra ângulos agudos e lesões por esforço repetitivo."
            }
          ]
        }
      },
      {
        "id": "baixo-l-0-2",
        "level": 0,
        "moduleTitle": "Módulo 1: Fundamentos da Sustentação Grave",
        "lessonNumber": 2,
        "title": "Aula 2 — Técnica de Mão Direita: Pizzicato com Dedos Indicador e Médio (i-m)",
        "subtitle": "Alternância estrita, ataque apoiado (Rest Stroke) e ancoragem móvel do polegar (Movable Thumb)",
        "objective": "Dominar o toque apoiado com alternância rigorosa entre indicador e médio, obtendo volume uniforme e timbre gordo sem estalos.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "tuning": "E1-A1-D2-G2",
        "stringsCount": 4,
        "parts": [
          {
            "id": "bl02-p1",
            "title": "1. A Mecânica do Toque Apoiado (Rest Stroke / Apoyando)",
            "contentMarkdown": "\n### A Física do Som Gordo: Por que o Toque Apoiado é Essencial\n\nNo contrabaixo, puxar a corda para fora (toque livre) resulta em um som fino, metálico e com pouco sustain. O toque tradicional de conservatório é o **toque apoiado** (*Rest Stroke*):\n\n1. **Ataque Horizontal:** O dedo (indicador ou médio) ataca a corda perpendicularmente à escala, empurrando-a para trás.\n2. **Repouso Imediato:** Após vibrar a corda, o dedo cai e repousa firmemente sobre a corda superior (mais grossa).\n   * Exemplo: Ao tocar a 2ª corda (D), o dedo termina repousado sobre a 3ª corda (A).\n3. **Ponto de Contato com a Polpa:** Utilize a área carnosa da ponta do dedo, levemente angulada a 45°. Nunca use unhas compridas no contrabaixo clássico ou pop.\n\n```\nMÃO DIREITA: ANCORAGEM FIXA vs ANCORAGEM MÓVEL (MOVABLE THUMB)\n------------------------------------------------------------------------\n* Ancoragem Fixa: Polegar apoiado sobre a borda do captador do braço.\n* Ancoragem Móvel (Recomendada):\n  - Ao tocar E (4ª): Polegar no captador.\n  - Ao tocar A (3ª): Polegar na 4ª corda (abafando o Mi).\n  - Ao tocar D (2ª): Polegar na 3ª corda (abafando o Lá e o Mi com a lateral).\n  - Ao tocar G (1ª): Polegar na 2ª corda (abafando Ré, Lá e Mi).\n------------------------------------------------------------------------\n```\n            \n\n* **Toque apoiado (Rest Stroke):** O dedo puxa a corda e repousa na corda imediatamente superior."
          },
          {
            "id": "bl02-p2",
            "title": "2. Alternância Estrita Indicador-Médio (i-m): O Princípio do Andador",
            "contentMarkdown": "\n### Nunca Repetir o Mesmo Dedo Consecutivamente\n\nAssim como ao caminhar você nunca avança duas vezes com o mesmo pé, no contrabaixo a regra inegociável é:\n$$\\text{Alternância Estrita: } i \\rightarrow m \\rightarrow i \\rightarrow m$$\n\n* **Causa do Vício:** Tocar notas consecutivas com o indicador gera fadiga prematura, desigualdade rítmica e perda de velocidade em andamentos superiores a 90 BPM.\n* **Igualdade Timbrística:** O dedo médio costuma ser mais longo e forte que o indicador. Ajuste a curva dos dedos para que ambos golpeiem a corda exatamente com o mesmo ângulo e energia sonora.\n            \n\n* **Técnica Movable Thumb:** O polegar desliza pelas cordas graves garantindo silêncio e estabilidade."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-0-2-ex",
          "title": "Exercício 2 — Ciclo de Alternância i-m nas Quatro Cordas",
          "subtitle": "Semínimas e colcheias com alternância inegociável",
          "targetBpm": 70,
          "targetRepetitions": 16,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m - i - m (estrito rest stroke)",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "up"
            },
            {
              "stringNumber": 3,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |---------------------------------0-0-0-0---------|\nD |-----------------0-0-0-0-------------------------|\nA |---------0-0-0-0---------------------------------|\nE |-0-0-0-0-----------------------------------------|\n    i m i m i m i m i m i m i m i m i m i m i m i m\n          ",
          "instructions": [
            "Ligue o metrônomo a 50 BPM inicialmente (BPM inicial de segurança).",
            "Toque 4 notas na 4ª corda: i, m, i, m com apoio na borda do captador.",
            "Mude para a 3ª corda com i, m, i, m apoiando na 4ª corda.",
            "Suba para D e G, descendo em seguida até E.",
            "Aumente gradualmente para 60 BPM (intermediário) e 70 BPM (alvo)."
          ],
          "biomechanicTips": [
            "O movimento parte da articulação da base dos dedos (junta metacarpo-falângica), não do pulso.",
            "Mantenha o antebraço descansando suavemente sobre a borda superior do corpo do baixo."
          ],
          "validationCriteria": "16 repetições do ciclo completo sem falhar a alternância e com intensidade sonora milimetricamente uniforme.",
          "precisionCriteria": [
            "Ligue o metrônomo a 50 BPM inicialmente (BPM inicial de segurança).",
            "Toque 4 notas na 4ª corda: i, m, i, m com apoio na borda do captador.",
            "Mude para a 3ª corda com i, m, i, m apoiando na 4ª corda.",
            "Suba para D e G, descendo em seguida até E."
          ],
          "commonErrors": [
            "O movimento parte da articulação da base dos dedos (junta metacarpo-falângica), não do pulso.",
            "Mantenha o antebraço descansando suavemente sobre a borda superior do corpo do baixo."
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq02-1",
              "question": "O que caracteriza a técnica de toque apoiado (rest stroke) no contrabaixo elétrico?",
              "options": [
                "Após atacar a corda, o dedo repousa sobre a corda imediatamente superior",
                "O dedo toca a corda e se afasta para o ar sem encostar em nada",
                "A mão toca com o polegar empurrando a corda para cima",
                "A corda é abafada com a palma da mão antes de soar"
              ],
              "correctIndex": 0,
              "explanation": "No toque apoiado (rest stroke), o dedo desliza através da corda e descansa na corda de cima, transferindo o máximo de energia acústica."
            },
            {
              "id": "bq02-2",
              "question": "Qual é o maior benefício da técnica de ancoragem móvel (movable thumb)?",
              "options": [
                "Abafar automaticamente as cordas mais graves, evitando vibrações simpáticas indesejadas",
                "Tocar acordes de 4 notas simultaneamente",
                "Permitir o uso de palheta rápida",
                "Eliminar a necessidade do metrônomo"
              ],
              "correctIndex": 0,
              "explanation": "Ao mover o polegar para as cordas superiores conforme se toca nas agudas, o baixista limpa o som ao abafar fisicamente as cordas mais graves."
            }
          ]
        }
      },
      {
        "id": "baixo-l-0-3",
        "level": 0,
        "moduleTitle": "Módulo 1: Fundamentos da Sustentação Grave",
        "lessonNumber": 3,
        "title": "Aula 3 — Técnica de Mão Esquerda: Posicionamento, Pressão Mínima e Regra Simandl",
        "subtitle": "Distribuição dos dedos, ponto de pressão próximo ao traste e abafamento mútuo",
        "objective": "Posicionar os dedos da mão esquerda com precisão cirúrgica colado ao traste, eliminando trastejamentos (fret buzz) com gasto mínimo de energia muscular.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "tuning": "E1-A1-D2-G2",
        "stringsCount": 4,
        "parts": [
          {
            "id": "bl03-p1",
            "title": "1. O Ponto Exato de Contato: O Segredo Contra o Trastejamento",
            "contentMarkdown": "\n### Onde Apertar a Corda no Contrabaixo\n\nNo contrabaixo, as cordas são grossas e a tensão é elevada. Apertar no meio da casa exige três vezes mais força e causa trastejamento (*fret buzz*).\n\n* **Posição Ideal:** Pressione a corda a **1 a 2 milímetros imediatamente antes do traste metálico** (em direção ao corpo do instrumento).\n* **Pressão Mínima Necessária:** Aperte a corda gradualmente enquanto toca até que a nota soe limpa sem chiar. Essa é a pressão exata necessária — qualquer força além disso causa fadiga na mão e desafinação por micro-bending.\n* **Polegar Esquerdo Neutro:** Deve ficar apoiado atrás do braço, aproximadamente na altura do meio da escala (oposto ao dedo 2 / médio). **Nunca** aperte o braço com força de pinça entre o polegar e os outros dedos! A força vem do peso do braço sustentado pelo ombro.\n            \n\n* **Regra Simandl:** Nas primeiras casas graves, os dedos 3 e 4 atuam em conjunto para proteger tendões."
          },
          {
            "id": "bl03-p2",
            "title": "2. Digitação na Região Grave: Método Simandl vs 1 Dedo por Casa",
            "contentMarkdown": "\n### A Biomecânica da Região Grave (Casas 1 a 4)\n\nNas primeiras casas do contrabaixo, a distância entre os trastes é de aproximadamente 3.5 a 4 cm. Forçar a abertura \"um dedo por casa\" nessa região tensiona o tendão flexor de mãos médias e pequenas.\n\n```\n========================================================================\nSISTEMA SIMANDL (CASAS 1 A 4):\nDedo 1 (Indicador) -> Casa 1\nDedo 2 (Médio)     -> Casa 2\nDedos 3 e 4 juntos -> Casa 3 (Anelar apoia o Mínimo para máxima força)\n========================================================================\nSISTEMA 1 DEDO POR CASA (A PARTIR DA CASA 5):\nDedo 1 -> Casa 5\nDedo 2 -> Casa 6\nDedo 3 -> Casa 7\nDedo 4 -> Casa 8\n========================================================================\n```\n            "
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-0-3-ex",
          "title": "Exercício 3 — Exercício Cromático Fundacional (Casas 1-2-3-4)",
          "subtitle": "Sincronização mãos direita e esquerda com pressão mínima",
          "targetBpm": 65,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m alternado na mão direita; dedos 1-2-3-4 na esquerda",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "F#",
              "notePt": "Fá#",
              "pickDirection": "up"
            },
            {
              "stringNumber": 4,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "G#",
              "notePt": "Sol#",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |---------------------------------1-2-3-4---------|\nD |-------------------------1-2-3-4-----------------|\nA |-----------------1-2-3-4-------------------------|\nE |-1-2-3-4-1-2-3-4---------------------------------|\n    1 2 3 4 1 2 3 4 1 2 3 4 1 2 3 4 (Dedos ME)\n          ",
          "instructions": [
            "Inicie na 4ª corda, casa 1 (F) com o dedo 1.",
            "Mantenha o dedo 1 apoiado ao colocar o dedo 2 na casa 2 (F#).",
            "Mantenha 1 e 2 apoiados ao colocar o dedo 3 na casa 3 (G).",
            "Coloque o dedo 4 na casa 4 (G#). Mantenha todos os dedos curvados como se segurasse uma maçã.",
            "Suba para a 3ª corda (A: Bb, B, C, C#) e repita.",
            "Metrônomo: comece a 45 BPM, avance para 55 BPM e consolide a 65 BPM."
          ],
          "biomechanicTips": [
            "Dedos em arco (90° em relação à escala na primeira falange).",
            "Nunca deixe o dedo mindinho dobrar a falange para trás (colapso da articulação)."
          ],
          "validationCriteria": "Executar o exercício em todas as 4 cordas a 65 BPM com 100% de notas limpas, sem estalos e sem dor no antebraço.",
          "precisionCriteria": [
            "Inicie na 4ª corda, casa 1 (F) com o dedo 1.",
            "Mantenha o dedo 1 apoiado ao colocar o dedo 2 na casa 2 (F#).",
            "Mantenha 1 e 2 apoiados ao colocar o dedo 3 na casa 3 (G).",
            "Coloque o dedo 4 na casa 4 (G#). Mantenha todos os dedos curvados como se segurasse uma maçã."
          ],
          "commonErrors": [
            "Dedos em arco (90° em relação à escala na primeira falange).",
            "Nunca deixe o dedo mindinho dobrar a falange para trás (colapso da articulação)."
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq03-1",
              "question": "Qual é o ponto ideal para pressionar a corda contra a escala no contrabaixo?",
              "options": [
                "1 a 2 mm imediatamente antes do traste metálico",
                "Exatamente no meio da casa entre os dois trastes",
                "Em cima da haste do traste metálico",
                "O mais longe possível do traste em direção ao headstock"
              ],
              "correctIndex": 0,
              "explanation": "Apertar 1 a 2 mm antes do traste exige a menor força mecânica e evita 100% dos ruídos de trastejamento."
            },
            {
              "id": "bq03-2",
              "question": "De onde deve vir a força principal para pressionar as cordas na mão esquerda?",
              "options": [
                "Do peso natural do braço puxando levemente para trás pelo cotovelo/ombro",
                "Do aperto do polegar contra a parte de trás do braço em pinça",
                "Apenas da força isolada dos tendões da ponta dos dedos",
                "Da inclinação da cabeça sobre o instrumento"
              ],
              "correctIndex": 0,
              "explanation": "Usar o peso do braço e as costas alivia o polegar, prevenindo tendinite e fadiga precoce no músculo adutor do polegar."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 1,
    "name": "NÍVEL 1 — RITMO E CONSTRUÇÃO DE GROOVES",
    "subtitle": "Pulsação rítmica, subdivisão, a fórmula Tônica-Quinta-Oitava e linhas em 4/4",
    "badge": "Iniciação",
    "description": "Transformação da técnica mecânica em linguagem musical: leitura rítmica de semínimas e colcheias, a relação geométrica T-5-8 e condução sólida de bandas em Pop, Rock e Gospel.",
    "lessons": [
      {
        "id": "baixo-l-1-1",
        "level": 1,
        "moduleTitle": "Módulo 2: O Pulso Rítmico do Baixista",
        "lessonNumber": 4,
        "title": "Aula 4 — Pulsação, Subdivisão em Colcheias e Conexão com o Bumbo",
        "subtitle": "Tempo forte, contratempo e precisão milimétrica no clique do metrônomo",
        "objective": "Executar linhas rítmicas com subdivisão exata em colcheias (downbeat e upbeat), travando o ataque da nota exatamente no pulso do bumbo da bateria.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl04-p1",
            "title": "1. O Conceito de Pocket e a Subdivisão do Tempo",
            "contentMarkdown": "\n### Tocar no \"Pocket\": O que Significa Estar no Tempo\n\nNo mundo profissional, o baixista não é contratado por tocar rápido, mas por tocar **firme** (*solid groove*). Estar no *pocket* significa que o início do ataque da sua nota coincide exatamente com o transiente acústico do bumbo da bateria.\n\n* **Subdivisão em Colcheias (Compasso 4/4):**\n  * Cada tempo se divide em duas partes iguais: **Tempo** (no clique) e **Contratempo** (no ar).\n  * Contagem oficial: `1 - e - 2 - e - 3 - e - 4 - e`\n* **Duração da Nota (Articulação):**\n  * **Staccato (Curto):** A nota soa por metade do seu valor e é abafada imediatamente.\n  * **Tenuto (Longo/Sustentado):** A nota soa até o milissegundo imediatamente anterior à próxima.\n            "
          },
          {
            "id": "bl04-p2",
            "title": "2. Notação em Tablatura de Baixo e Aplicação em Linha de Rock/Pop",
            "contentMarkdown": "\n```\n========================================================================\nGROOVE EM COLCHEIAS CONTÍNUAS (ROCK/POP FUNDACIONAL)\nTom: Lá Menor (Am) -> Dó Maior (C) -> Sol Maior (G) -> Fá Maior (F)\nAndamento: 80 BPM\n========================================================================\nG |-----------------------------------------------------------------|\nD |-----------------------------------------------------------------|\nA |-----------------3-3-3-3-3-3-3-3---------------------------------|\nE |-5-5-5-5-5-5-5-5-----------------3-3-3-3-3-3-3-3-1-1-1-1-1-1-1-1-|\n    1 e 2 e 3 e 4 e 1 e 2 e 3 e 4 e 1 e 2 e 3 e 4 e 1 e 2 e 3 e 4 e\n    Am              C               G               F\n========================================================================\n```\n            "
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-1-1-ex",
          "title": "Exercício 4 — Condução em Colcheias em Am-C-G-F",
          "subtitle": "Travamento rítmico em 80 BPM sem oscilação",
          "targetBpm": 80,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m - i - m contínuo",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "up"
            },
            {
              "stringNumber": 4,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nE |-5-5-5-5-5-5-5-5-| (Am)\nA |-3-3-3-3-3-3-3-3-| (C)\nE |-3-3-3-3-3-3-3-3-| (G)\nE |-1-1-1-1-1-1-1-1-| (F)\n          ",
          "instructions": [
            "Conecte com o metrônomo a 60 BPM (inicial).",
            "Toque as 8 colcheias por compasso em Am (E casa 5).",
            "Mude no tempo 1 do próximo compasso para C (A casa 3) sem atrasar nem adiantar.",
            "Avance para 70 BPM e atinja o objetivo de 80 BPM."
          ],
          "biomechanicTips": [
            "Use a ponta dos dedos 1 e 4 na mão esquerda para manter a mão relaxada nas trocas de casa."
          ],
          "validationCriteria": "Completar 10 progressões inteiras em 80 BPM com precisão rítmica absoluta no metrônomo.",
          "precisionCriteria": [
            "Conecte com o metrônomo a 60 BPM (inicial).",
            "Toque as 8 colcheias por compasso em Am (E casa 5).",
            "Mude no tempo 1 do próximo compasso para C (A casa 3) sem atrasar nem adiantar.",
            "Avance para 70 BPM e atinja o objetivo de 80 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq04-1",
              "question": "Quantas colcheias completam um compasso quaternário simples (4/4)?",
              "options": [
                "8 colcheias",
                "4 colcheias",
                "16 colcheias",
                "6 colcheias"
              ],
              "correctIndex": 0,
              "explanation": "Em 4/4, cada tempo equivale a uma semínima, que se divide em 2 colcheias. 4 tempos x 2 = 8 colcheias."
            },
            {
              "id": "bq04-2",
              "question": "Qual é a regra primordial para a conexão perfeita entre o contrabaixo e o bumbo da bateria no \"pocket\"?",
              "options": [
                "Ataque milimetricamente simultâneo com o bumbo nos tempos fortes, criando uma unidade de impacto sonoro",
                "O contrabaixo deve sempre tocar 1 segundo após o bumbo para não embolar o áudio",
                "O contrabaixo nunca deve tocar nas mesmas notas em que a bateria toca",
                "Aumentar o volume do amplificador até a bateria sumir da mixagem"
              ],
              "correctIndex": 0,
              "explanation": "No \"pocket\", a nota do baixo e o golpe do bumbo fundem-se em um único evento sonoro: o bumbo dá o \"punch\" percussivo e o baixo sustenta a nota afinada."
            }
          ]
        }
      },
      {
        "id": "baixo-l-1-2",
        "level": 1,
        "moduleTitle": "Módulo 2: O Pulso Rítmico do Baixista",
        "lessonNumber": 5,
        "title": "Aula 5 — A Tríade Geométrica do Contrabaixista: Tônica, Quinta e Oitava (T-5-8)",
        "subtitle": "A fórmula mais tocada da história da música ocidental em qualquer estilo",
        "objective": "Mapear visual e auditivamente o shape universal de Tônica, Quinta e Oitava no braço do baixo em todas as tonalidades.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl05-p1",
            "title": "1. A Geometria das Quartas: O Mapa Perfeito do Braço",
            "contentMarkdown": "\n### Por que o Baixo é Simétrico: A Geometria T-5-8\n\nComo todas as cordas do contrabaixo são afinadas no mesmo intervalo de **quarta justa (5 semitons)**, qualquer desenho geométrico que você aprender é 100% transportável para qualquer tom!\n\n* **Tônica (T):** A nota base que dá nome ao acorde (Ex: Sol na 4ª corda, casa 3).\n* **Quinta Justa (5ª):** Fica exatamente **uma corda abaixo e duas casas à frente** (Ex: Ré na 3ª corda, casa 5).\n* **Oitava (8ª):** Fica exatamente **duas cordas abaixo e duas casas à frente** (Ex: Sol agudo na 2ª corda, casa 5).\n\n```\n========================================================================\nSHAPE UNIVERSAL DE TÔNICA, QUINTA E OITAVA (T - 5 - 8)\n========================================================================\nCorda G (1ª): |---|---|---|---|---|\nCorda D (2ª): |---|---|---|-8-|---| -> 8ª (Sol agudo, casa 5)\nCorda A (3ª): |---|---|---|-5-|---| -> 5ª (Ré, casa 5)\nCorda E (4ª): |---|-T-|---|---|---| -> Tônica (Sol, casa 3)\n                 Casa 3    Casa 5\nDigitação ME:   Dedo 1    Dedo 3(5ª) / Dedo 4(8ª)\n========================================================================\n```\n            "
          },
          {
            "id": "bl05-p2",
            "title": "2. Aplicação Musical em Ritmos Gospel, Country e Pop Clássico",
            "contentMarkdown": "\n### O Groove Alternado Tônica-Quinta\n\nAlternar entre Tônica e Quinta sustenta o ritmo sem disputar espaço com os vocais ou teclados:\n* **Tempo 1:** Tônica no grave (peso da harmonia).\n* **Tempo 3:** Quinta justa (apoio rítmico que impulsiona para o próximo acorde).\n            "
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-1-2-ex",
          "title": "Exercício 5 — Padrão T-5-8 em G, C e D",
          "subtitle": "Groove dinâmico transportando o shape de acordes maiores",
          "targetBpm": 85,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m alternado com saltos de corda limpos",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "up"
            },
            {
              "stringNumber": 2,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |---------5---------------|---------7---------------|\nD |-----5-------5-----------|-----7-------7-----------|\nA |---5-----------5---------|---7-----------7---------|\nE |-3---------------3-------|-5---------------5-------|\n    T 5 8 5 T 5 8 5 (em G)    T 5 8 5 T 5 8 5 (em A)\n          ",
          "instructions": [
            "Posicione o dedo 1 na Tônica (G, corda E casa 3).",
            "Toque a 5ª (D, corda A casa 5) com o dedo 3.",
            "Toque a 8ª (G, corda D casa 5) com o dedo 4.",
            "Mantenha as cordas abafadas imediatamente após a duração da nota."
          ],
          "biomechanicTips": [
            "Use a ancoragem móvel do polegar direito para abafar a 4ª corda ao tocar a 8ª na 2ª corda."
          ],
          "validationCriteria": "Executar a progressão inteira a 85 BPM com som gordo e zero vazamento sonoro entre as cordas.",
          "precisionCriteria": [
            "Posicione o dedo 1 na Tônica (G, corda E casa 3).",
            "Toque a 5ª (D, corda A casa 5) com o dedo 3.",
            "Toque a 8ª (G, corda D casa 5) com o dedo 4.",
            "Mantenha as cordas abafadas imediatamente após a duração da nota."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq05-1",
              "question": "Geometricamente, onde se localiza a Oitava justa em relação a uma Tônica na 4ª corda?",
              "options": [
                "Duas cordas abaixo (mais aguda) e duas casas à frente",
                "Uma corda abaixo e na mesma casa",
                "Na mesma corda, quatro casas à frente",
                "Três cordas abaixo e uma casa atrás"
              ],
              "correctIndex": 0,
              "explanation": "Pela afinação em quartas justas do contrabaixo, a oitava sempre se situa duas cordas abaixo e duas casas à frente."
            },
            {
              "id": "bq05-2",
              "question": "Na geometria visual do braço do contrabaixo, onde localiza-se a quinta justa (5J) em relação à tônica na mesma casa?",
              "options": [
                "Na corda imediatamente mais aguda, duas casas acima (2 semitons à frente)",
                "Na mesma corda, dez casas para trás",
                "Na corda mais grave, cinco casas para frente",
                "Em qualquer lugar aleatório do instrumento dependendo da afinação"
              ],
              "correctIndex": 0,
              "explanation": "Como o baixo é afinado em quartas justas perfeitas, a quinta justa situa-se sempre uma corda acima e duas casas à frente da tônica."
            }
          ]
        }
      },
      {
        "id": "baixo-l-1-3",
        "level": 1,
        "moduleTitle": "Módulo 2: O Pulso Rítmico do Baixista",
        "lessonNumber": 6,
        "title": "Aula 6 — Construção de Linhas de Baixo em Compassos 4/4 e Riffs Memoráveis",
        "subtitle": "Sincronização de tônica no 1, antecipações rítmicas e condução fluida",
        "objective": "Construir linhas de baixo autônomas em 4/4 para progressões populares usando tônica, aproximações e dinâmicas.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl06-p1",
            "title": "1. A Anatomia de uma Linha de Baixo Eficaz",
            "contentMarkdown": "\n### Como Criar Linhas que Sustentam a Música\n\nUma linha de baixo eficiente atende a três mandamentos:\n1. **Clareza da Harmonia:** A nota no tempo 1 deve quase sempre ser a **Tônica** para situar o ouvinte e a banda.\n2. **Conexão com o Bumbo:** Os ataques principais devem coincidir com as batidas de bumbo.\n3. **Notas de Passagem:** No final do compasso (tempo 4 ou 4-e), utiliza-se uma nota de passagem cromática ou diatônica para caminhar até o próximo acorde.\n            "
          },
          {
            "id": "baixo-l-1-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-1-3-ex",
          "title": "Exercício 6 — Linha Completa de Pop/Worship em E - B - C#m - A",
          "subtitle": "Aplicação real com notas de passagem",
          "targetBpm": 80,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m alternado com dinâmica acentuada",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "B",
              "notePt": "Si",
              "pickDirection": "up"
            },
            {
              "stringNumber": 3,
              "noteCipher": "C#",
              "notePt": "Dó#",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nE |-0---0-0---0-0-2-|-7---7-7---7-7-6-|-9---9-9---9-9-7-|-5---5-5---5-5-3-|\n    E                 B                 C#m               A\n          ",
          "instructions": [
            "Toque a linha a 65 BPM prestando atenção nas notas de passagem no tempo 4.",
            "Avance para 80 BPM mantendo o andamento rigorosamente estável."
          ],
          "biomechanicTips": [
            "Mantenha a mão esquerda relaxada para deslizar com facilidade entre as casas 2, 7, 9 e 5."
          ],
          "validationCriteria": "8 voltas completas sem hesitação na troca de posições a 80 BPM.",
          "precisionCriteria": [
            "Toque a linha a 65 BPM prestando atenção nas notas de passagem no tempo 4.",
            "Avance para 80 BPM mantendo o andamento rigorosamente estável."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq06-1",
              "question": "Qual é o papel primordial da nota tocada no tempo 1 de cada compasso pelo contrabaixista?",
              "options": [
                "Afirmar a tônica da harmonia, dando sustentação ao acorde e à banda",
                "Fazer um solo rápido de escala pentatônica",
                "Demonstrar velocidade técnica",
                "Tocar a nota mais aguda possível"
              ],
              "correctIndex": 0,
              "explanation": "A tônica no tempo 1 ancora a harmonia e estabelece a referência tonal para todos os instrumentos e ouvintes."
            },
            {
              "id": "bq06-2",
              "question": "Qual é a função da síncope ou antecipação em uma linha de baixo de Pop/Rock em compasso 4/4?",
              "options": [
                "Antecipar o acorde no contratempo do tempo 4, gerando propulsão e fluidez para a próxima seção musical",
                "Fazer a banda inteira errar a contagem do tempo",
                "Impedir o cantor de respirar durante a música",
                "Diminuir o volume do baixo para economizar pilhas ativas"
              ],
              "correctIndex": 0,
              "explanation": "A antecipação no contratempo \"e\" do tempo 4 conecta harmonias com balanço rítmico dinâmico, impulsionando a resolução no tempo 1 seguinte."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 2,
    "name": "NÍVEL 2 — ESCALAS E CONDUÇÃO HARMÔNICA",
    "subtitle": "Escala maior, escala menor natural, arpejos de tríades e condução de linha entre acordes",
    "badge": "Básico",
    "description": "Expansão do vocabulário harmônico: domínio dos shapes universais de escalas maiores e menores, formação de arpejos no braço inteiro e transições melódicas elegantes.",
    "lessons": [
      {
        "id": "baixo-l-2-1",
        "level": 2,
        "moduleTitle": "Módulo 3: Escalas e Condução Melódica",
        "lessonNumber": 7,
        "title": "Aula 7 — A Escala Maior no Contrabaixo: Digitação com Dedo 2 e Expansão de Shapes",
        "subtitle": "Estrutura intervalar T - T - st - T - T - T - st sem mudar de posição",
        "objective": "Executar a escala maior em 2 oitavas com digitação fechada padrão de conservatório, associando graus e notas.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl07-p1",
            "title": "1. O Shape Universal da Escala Maior (Dedo 2 na Tônica)",
            "contentMarkdown": "\n### O Padrão Canônico: Digitação Iniciando com o Dedo 2\n\nNo contrabaixo, a digitação mais eficiente para a escala maior inicia com o **Dedo 2 (médio)** na tônica. Isso permite cobrir uma oitava inteira sem necessidade de deslocar a mão pelo braço!\n\n```\n========================================================================\nSHAPE DA ESCALA MAIOR (1 OITAVA - DIGITAÇÃO PADRÃO DEDO 2)\nExemplo: Dó Maior (C) - Tônica na 3ª corda, casa 3\n========================================================================\nCorda G (1ª): |---|-7-(B)-|-8-(C)-|---|  -> Dedo 1 (B), Dedo 2 (C)\nCorda D (2ª): |-4-(F)-|---|-5-(G)-|---|-6-(A)-| -> Dedo 1 (F), Dedo 2 (G), Dedo 4 (A)\nCorda A (3ª): |---|-1-(C)-|---|-2-(D)-|---| -> Dedo 2 (C), Dedo 4 (D)\nCorda E (4ª): |---|---|---|-3-(E)-|---|  -> Dedo 1 (E) na 4ª corda se descer\n========================================================================\n```\n            "
          },
          {
            "id": "baixo-l-2-1-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-2-1-ex",
          "title": "Exercício 7 — Escala de Sol Maior (G) em 2 Oitavas",
          "subtitle": "Fluência ascendente e descendente com metrônomo",
          "targetBpm": 75,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m alternado rigoroso",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "up"
            },
            {
              "stringNumber": 4,
              "noteCipher": "B",
              "notePt": "Si",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |-------------------------2-4-5-|\nD |-------------------2-4-5-------|\nA |-------------2-3-5-------------|\nE |-3-5---------------------------|\n    G A B C D E F# G A B C D E F# G\n          ",
          "instructions": [
            "Inicie em G (E casa 3) com dedo 2.",
            "Suba todas as notas com clareza e desça sem hesitação.",
            "Meta: 60 BPM (inicial) -> 75 BPM (alvo de maestria)."
          ],
          "biomechanicTips": [
            "Não retire os dedos da escala precipitadamente ao subir; mantenha os dedos próximos das cordas."
          ],
          "validationCriteria": "Executar 10 vezes consecutivas sem notas mascaradas nem quebras rítmicas.",
          "precisionCriteria": [
            "Inicie em G (E casa 3) com dedo 2.",
            "Suba todas as notas com clareza e desça sem hesitação.",
            "Meta: 60 BPM (inicial) -> 75 BPM (alvo de maestria)."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq07-1",
              "question": "Qual é a estrutura intervalar que define a Escala Maior Natural?",
              "options": [
                "Tom - Tom - Semitom - Tom - Tom - Tom - Semitom",
                "Tom - Semitom - Tom - Tom - Semitom - Tom - Tom",
                "Tom - Tom - Tom - Semitom - Tom - Tom - Semitom",
                "Semitom - Tom - Tom - Tom - Semitom - Tom - Tom"
              ],
              "correctIndex": 0,
              "explanation": "A fórmula canônica da escala maior é T-T-st-T-T-T-st."
            },
            {
              "id": "bq07-2",
              "question": "Por que o shape canônico da Escala Maior no baixo inicia com o Dedo 2 (Médio) na tônica?",
              "options": [
                "Porque deixa o Dedo 1 livre para alcançar a terça menor ou notas recuadas, e o Dedo 4 para a oitava sem deslocar a mão",
                "Porque o dedo 1 não tem força para pressionar a escala",
                "Porque é proibido iniciar com o dedo 1 pela tradição dos conservatórios",
                "Para facilitar o uso de palheta de polegar"
              ],
              "correctIndex": 0,
              "explanation": "Iniciar com o Dedo 2 na tônica posiciona a mão perfeitamente para cobrir 1 oitava inteira dentro de uma extensão de 4 casas sem mudar de posição."
            }
          ]
        }
      },
      {
        "id": "baixo-l-2-2",
        "level": 2,
        "moduleTitle": "Módulo 3: Escalas e Condução Melódica",
        "lessonNumber": 8,
        "title": "Aula 8 — A Escala Menor Natural e a Pentatônica Menor",
        "subtitle": "A sonoridade melancólica e o groove expressivo em tonalidades menores",
        "objective": "Dominar a digitação da Escala Menor Natural e da Pentatônica Menor com dedo 1 na tônica, aplicando em frases de blues e rock.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl08-p1",
            "title": "1. Estrutura da Escala Menor e Redução Pentatônica",
            "contentMarkdown": "\n### O Poder dos Cinco Sons: A Pentatônica Menor\n\nA Pentatônica Menor elimina o 2º e o 6º graus da escala menor natural, deixando apenas os intervalos mais fortes e sem atrito tonal:\n$$\\text{Fórmula Pentatônica Menor: } T - b3 - 4 - 5 - b7$$\n\nÉ a base definitiva para 90% dos fraseados de Blues, Rock, Funk e Gospel no contrabaixo elétrico.\n            "
          },
          {
            "id": "baixo-l-2-2-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-2-2-ex",
          "title": "Exercício 8 — Riff Pentatônico em Lá Menor (Am)",
          "subtitle": "Fraseado com slides e ligados",
          "targetBpm": 80,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m alternado",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "up"
            },
            {
              "stringNumber": 3,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |-----------------|---------5-7-----|\nD |---------5-7-----|-5-7-------------|\nA |-5-7-------------|-----------------|\nE |-----------------|-----------------|\n    A C D E G A\n          ",
          "instructions": [
            "Toque o padrão pentatônico em Am com articulação firme e vibrato sutil na nota de repouso.",
            "Metrônomo: 65 -> 80 BPM."
          ],
          "biomechanicTips": [
            "No slide para a casa 7, mantenha a pressão firme na ponta do dedo sem desacelerar."
          ],
          "validationCriteria": "12 repetições perfeitas a 80 BPM.",
          "precisionCriteria": [
            "Toque o padrão pentatônico em Am com articulação firme e vibrato sutil na nota de repouso.",
            "Metrônomo: 65 -> 80 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq08-1",
              "question": "Quais notas formam a escala pentatônica menor de Lá (Am)?",
              "options": [
                "A - C - D - E - G",
                "A - B - C - D - E",
                "A - C# - D - E - G#",
                "A - D - E - G - B"
              ],
              "correctIndex": 0,
              "explanation": "A pentatônica menor de Lá é formada pelos graus T (A), b3 (C), 4 (D), 5 (E) e b7 (G)."
            },
            {
              "id": "bq08-2",
              "question": "Quais intervalos compõem a fórmula da Escala Pentatônica Menor no contrabaixo?",
              "options": [
                "Tônica (1), Terça Menor (b3), Quarta Justa (4), Quinta Justa (5) e Sétima Menor (b7)",
                "Tônica, Segunda Maior, Terça Maior, Quinta Justa e Sétima Maior",
                "Apenas cinco notas cromáticas vizinhas",
                "Sete notas maiores consecutivas"
              ],
              "correctIndex": 0,
              "explanation": "A pentatônica menor elimina a 2ª e a 6ª da escala menor natural, resultando na fórmula estritamente consonante: 1 - b3 - 4 - 5 - b7."
            }
          ]
        }
      },
      {
        "id": "baixo-l-2-3",
        "level": 2,
        "moduleTitle": "Módulo 3: Escalas e Condução Melódica",
        "lessonNumber": 9,
        "title": "Aula 9 — Arpejos de Tríades Maiores, Menores e Diminutas",
        "subtitle": "Delineando os acordes nota por nota para conduções harmônicas ricas",
        "objective": "Executar arpejos de tríades maiores (T-3-5), menores (T-b3-5) e diminutas (T-b3-b5) em qualquer região do braço.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl09-p1",
            "title": "1. Arpejos: A Radiografia do Acorde no Baixo",
            "contentMarkdown": "\n### Diferença Entre Escala e Arpejo\n\nEnquanto a escala contém notas de passagem, o **arpejo toca exclusivamente as notas formadoras do acorde**. Tocar arpejos é a forma mais refinada de evidenciar a harmonia sem soar poluto.\n\n* **Tríade Maior:** Tônica - 3ª Maior - 5ª Justa\n* **Tríade Menor:** Tônica - 3ª Menor - 5ª Justa\n* **Tríade Diminuta:** Tônica - 3ª Menor - 5ª Diminuta (b5)\n            "
          },
          {
            "id": "baixo-l-2-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-2-3-ex",
          "title": "Exercício 9 — Condução com Arpejos em C - Am - Dm - G",
          "subtitle": "Conexão harmônica de conservatório",
          "targetBpm": 75,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m apoiado",
          "notesSequence": [
            {
              "stringNumber": 3,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "up"
            },
            {
              "stringNumber": 3,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nA |-3-----2-|-0-------|-------0-|-2-0-----|\nE |-----3---|-----3-0-|-1---3---|-----3-1-|\n    C           Am        Dm        G\n          ",
          "instructions": [
            "Arpeje cada acorde destacando a tônica no tempo 1 e a terça no tempo 3.",
            "Execute a 60 BPM e atinja 75 BPM."
          ],
          "biomechanicTips": [
            "Abroche os dedos com precisão para não embolar notas de cordas vizinhas."
          ],
          "validationCriteria": "Executar a progressão inteira 10 vezes em 75 BPM com afinação cristalina.",
          "precisionCriteria": [
            "Arpeje cada acorde destacando a tônica no tempo 1 e a terça no tempo 3.",
            "Execute a 60 BPM e atinja 75 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq09-1",
              "question": "Qual é a diferença entre a tríade menor e a tríade diminuta?",
              "options": [
                "A tríade diminuta possui a quinta diminuta (b5), enquanto a menor possui quinta justa (5)",
                "A tríade diminuta possui terça maior",
                "A tríade diminuta tem quatro notas",
                "Não há diferença de intervalos"
              ],
              "correctIndex": 0,
              "explanation": "A tríade menor é T - b3 - 5, enquanto a tríade diminuta é T - b3 - b5."
            },
            {
              "id": "bq09-2",
              "question": "Qual é a composição intervalar da Tríade Diminuta e qual sentimento sonoro ela produz?",
              "options": [
                "Tônica, Terça Menor (b3) e Quinta Diminuta (b5), gerando tensão instável de trítono",
                "Tônica, Terça Maior e Quinta Justa, gerando som brilhante e repousante",
                "Tônica e Quinta Aumentada apenas",
                "Três notas idênticas na mesma casa"
              ],
              "correctIndex": 0,
              "explanation": "A tríade diminuta (1 - b3 - b5) contém o intervalo de trítono entre tônica e quinta diminuta (6 semitons), criando forte instabilidade que pede resolução."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 3,
    "name": "NÍVEL 3 — VOCABULÁRIO E ARTICULAÇÃO",
    "subtitle": "Ghost notes, walking bass, condução cromática e introdução ao Slap & Pop",
    "badge": "Intermediário",
    "description": "Refinamento expressivo: controle de dinâmicas com notas fantasmas percussivas, a arte do walking bass em Jazz/Blues e a mecânica atlética de Slap & Pop.",
    "lessons": [
      {
        "id": "baixo-l-3-1",
        "level": 3,
        "moduleTitle": "Módulo 4: Articulações Modernas e Percussividade",
        "lessonNumber": 10,
        "title": "Aula 10 — Ghost Notes (Notas Fantasmas) e Controle Milimétrico de Dinâmica",
        "subtitle": "Adicionando percussividade e suíngue funk/soul com abafamento palmar e digital",
        "objective": "Executar ghost notes nítidas com som de \"thump\" percussivo sem desafinação residual ou harmônicos indesejados.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl10-p1",
            "title": "1. O que é uma Ghost Note no Contrabaixo",
            "contentMarkdown": "\n### O \"Thump\" Percussivo que Dá Alma ao Groove\n\nUma **Ghost Note** (notada como um 'X' na tablatura) é uma nota percussiva sem altura tonal definida. Ela imita o som da caixa da bateria ou de uma conga.\n\n1. **Mão Esquerda (O Segredo):** Os dedos repousam sobre as cordas sem pressioná-las até o traste de metal. Utilize múltiplos dedos para calar a corda e impedir que harmônicos naturais soem!\n2. **Mão Direita:** Ataca a corda normalmente com o toque apoiado. O resultado deve ser um \"estalo seco e focado\".\n            \n\n* **Ghost Notes no Baixo:** Toques percussivos abafados com a mão esquerda que enriquecem o groove."
          },
          {
            "id": "baixo-l-3-1-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-3-1-ex",
          "title": "Exercício 10 — Groove Sincopado com Ghost Notes em Ré (D)",
          "subtitle": "Padrão Funk / Soul de 16 avos",
          "targetBpm": 85,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m alternado com dinâmicas contrastantes",
          "notesSequence": [
            {
              "stringNumber": 3,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "up"
            },
            {
              "stringNumber": 3,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nD |---------------------------------|\nA |-5---x-5---x-5-x-|-5---x-5---x-5-x-|\nE |---------------------------------|\n    1 e 2 e 3 e 4 e   1 e 2 e 3 e 4 e\n          ",
          "instructions": [
            "Diferencie claramente o volume e a sustentação das notas reais (5) do clique seco das ghost notes (X).",
            "Meta: 70 -> 85 BPM."
          ],
          "biomechanicTips": [
            "Ao tocar a ghost note, use pelo menos 3 dedos da mão esquerda pousados sobre a corda."
          ],
          "validationCriteria": "Groove 100% sincopado e percussivo a 85 BPM sem notas desafinadas soando.",
          "precisionCriteria": [
            "Diferencie claramente o volume e a sustentação das notas reais (5) do clique seco das ghost notes (X).",
            "Meta: 70 -> 85 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq10-1",
              "question": "Como a mão esquerda deve se posicionar para produzir uma ghost note perfeita?",
              "options": [
                "Pousar múltiplos dedos suavemente sobre a corda sem pressioná-la contra o traste",
                "Apertar a corda com máxima força contra a escala",
                "Tirar a mão inteira do instrumento",
                "Usar uma palheta metálica"
              ],
              "correctIndex": 0,
              "explanation": "Múltiplos dedos pousados suavemente calam a nota fundamental e os harmônicos, gerando o clássico estalo percussivo."
            },
            {
              "id": "bq10-2",
              "question": "Como a mão esquerda (escala) deve atuar para produzir uma Ghost Note perfeita no contrabaixo?",
              "options": [
                "Descansando suavemente as polpas dos dedos sobre a corda sem pressioná-la contra o traste ou a madeira",
                "Apertando a corda com toda a força do braço até encostar no traste",
                "Tirando a mão esquerda do baixo e tocando com o queixo",
                "Colocando um pedaço de borracha entre os captadores"
              ],
              "correctIndex": 0,
              "explanation": "Ao descansar levemente os dedos sobre a corda, a vibração tonal é abafada, soando apenas o clique percussivo do ataque da mão direita."
            }
          ]
        }
      },
      {
        "id": "baixo-l-3-2",
        "level": 3,
        "moduleTitle": "Módulo 4: Articulações Modernas e Percussividade",
        "lessonNumber": 11,
        "title": "Aula 11 — Walking Bass e Condução por Aproximação Cromática",
        "subtitle": "A linhagem tradicional do Jazz e Blues: 4 semínimas contínuas por compasso",
        "objective": "Construir linhas de walking bass com tônica no 1, notas de arpejo no 2 e 3, e aproximação cromática no 4.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl11-p1",
            "title": "1. O Mecanismo do Walking Bass: O Relógio que Caminha",
            "contentMarkdown": "\n### Regra dos Quatro Tempos no Walking Bass\n\nNo Blues e no Jazz tradicional, o contrabaixo é o relógio contínuo:\n* **Tempo 1:** Tônica do acorde atual.\n* **Tempo 2:** Terça ou Quinta do acorde.\n* **Tempo 3:** Sétima ou nota diatônica da escala.\n* **Tempo 4:** **Aproximação Cromática** (1 semitom acima ou abaixo da tônica do próximo compasso).\n            "
          },
          {
            "id": "baixo-l-3-2-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-3-2-ex",
          "title": "Exercício 11 — Walking Bass em um Blues de 12 Compassos em F",
          "subtitle": "Condução swingada contínua",
          "targetBpm": 100,
          "targetRepetitions": 6,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Toque apoiado encorpado com indicador",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "D#",
              "notePt": "Ré#",
              "pickDirection": "down"
            }
          ],
          "tablatureText": "\nE |-1-5-----|-1-5-----|-1-5-----|-1-5-----|\nA |-----3-5-|-----3-5-|-----3-5-|-----3-5-|\n    F7        Bb7       F7        F7\n          ",
          "instructions": [
            "Toque com balanço de swing (subdivisão tercinada implícita).",
            "Meta: 80 -> 100 BPM."
          ],
          "biomechanicTips": [
            "Mantenha as notas compridas (legato), conectando o final de uma nota com o início da outra."
          ],
          "validationCriteria": "Concluir os 12 compassos do Blues a 100 BPM com pegada swingada contínua.",
          "precisionCriteria": [
            "Toque com balanço de swing (subdivisão tercinada implícita).",
            "Meta: 80 -> 100 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq11-1",
              "question": "No Walking Bass tradicional, qual é a função mais comum da nota tocada no tempo 4?",
              "options": [
                "Servir de aproximação cromática ou diatônica para a tônica do acorde seguinte",
                "Fazer uma pausa longa de silêncio",
                "Repetir a tônica aguda em slap",
                "Tocar um acorde de 3 cordas"
              ],
              "correctIndex": 0,
              "explanation": "A aproximação cromática no tempo 4 conduz o ouvido com máxima fluidez até o novo centro tonal no tempo 1."
            },
            {
              "id": "bq11-2",
              "question": "No Walking Bass tradicional do Jazz, qual é o papel das aproximações cromáticas no tempo 4?",
              "options": [
                "Conduzir o ouvido suavemente para a tônica do acorde seguinte por meio de meio-tom acima ou abaixo",
                "Tocar uma nota desafinada para surpreender a plateia",
                "Encerrar a música imediatamente",
                "Substituir o solo de saxofone por uma pausa"
              ],
              "correctIndex": 0,
              "explanation": "A aproximação cromática no tempo 4 (meio tom acima ou abaixo da próxima tônica) cria gravidade melódica irresistível rumo ao tempo 1 do próximo compasso."
            }
          ]
        }
      },
      {
        "id": "baixo-l-3-3",
        "level": 3,
        "moduleTitle": "Módulo 4: Articulações Modernas e Percussividade",
        "lessonNumber": 12,
        "title": "Aula 12 — Técnica de Slap & Pop: Mecânica do Polegar e Puxada com Indicador",
        "subtitle": "A percussão metálica do funk de Larry Graham, Marcus Miller e Flea",
        "objective": "Executar o Slap com o osso lateral do polegar e o Pop com o dedo indicador, equilibrando volumes e eliminando tensões.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl12-p1",
            "title": "1. O Golpe de Polegar (Slap / Thumb Strike)",
            "contentMarkdown": "\n### A Mecânica Correta do Polegar\n\nO Slap não é força bruta, é **velocidade de rebote (efeito chicote)**:\n1. **Ponto de Impacto:** Use a lateral óssea da articulação da falange distal do polegar.\n2. **Local no Baixo:** Golpeie a corda exatamente sobre o final da escala (onde o braço encontra o corpo).\n3. **Rebote Imediato:** O polegar deve bater na corda e ricochetear instantaneamente para fora, permitindo que a corda vibre contra os trastes. Se você deixar o polegar encostado, o som morrerá abafado.\n            "
          },
          {
            "id": "bl12-p2",
            "title": "2. A Puxada (Pop / Pluck)",
            "contentMarkdown": "\n### A Puxada Elástica com o Indicador\n\n1. Enganche a ponta da primeira falange do dedo indicador por baixo da corda aguda (G ou D).\n2. Puxe a corda cerca de 1 cm para fora do braço e solte-a, permitindo que ela chicoteie contra a escala metálica.\n            "
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-3-3-ex",
          "title": "Exercício 12 — Padrão Fundamental Slap & Pop em Oitavas",
          "subtitle": "Slap na tônica grave e Pop na oitava aguda",
          "targetBpm": 90,
          "targetRepetitions": 16,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "S (Slap no polegar) / P (Pop no indicador)",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 2,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "up"
            },
            {
              "stringNumber": 4,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 2,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |-----9-------|-----12------|\nD |-------------|-------------|\nA |-------------|-------------|\nE |-0-------0---|-3-------3---|\n    S   P   S     S   P   S\n          ",
          "instructions": [
            "Bata com o polegar (S) no Mi solto (E) e puxe com o indicador (P) na oitava (D casa 2 ou G casa 9).",
            "Mantenha o volume de Slap e Pop rigorosamente emparelhados.",
            "Metrônomo: 70 -> 90 BPM."
          ],
          "biomechanicTips": [
            "A rotação parte do antebraço (pronação e supinação), como quem gira uma maçaneta de porta."
          ],
          "validationCriteria": "16 compassos ininterruptos a 90 BPM com ataque nítido e sem estalar cordas indesejadas.",
          "precisionCriteria": [
            "Bata com o polegar (S) no Mi solto (E) e puxe com o indicador (P) na oitava (D casa 2 ou G casa 9).",
            "Mantenha o volume de Slap e Pop rigorosamente emparelhados.",
            "Metrônomo: 70 -> 90 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq12-1",
              "question": "Por que o polegar deve ricochetear imediatamente após bater na corda durante o Slap?",
              "options": [
                "Para permitir que a corda vibre livremente e produza o sustain percussivo após chocar-se com o traste",
                "Para não quebrar a corda de aço",
                "Para dar espaço para o dedo mindinho tocar",
                "Porque o captador esquenta se o dedo permanecer na corda"
              ],
              "correctIndex": 0,
              "explanation": "Se o polegar ficar encostado na corda após o golpe, ele abafa a vibração, destruindo o ataque característico do Slap."
            },
            {
              "id": "bq12-2",
              "question": "Na mecânica do Slap no contrabaixo, como o polegar deve se comportar após o golpe contra a corda?",
              "options": [
                "Rebater imediatamente como se tocasse em uma chapa quente, liberando a vibração percussiva metálica",
                "Ficar prensado contra a corda silenciando qualquer som que pudesse ressoar",
                "Entrar por baixo da corda para puxá-la para cima",
                "Bater na madeira do corpo e nunca na corda"
              ],
              "correctIndex": 0,
              "explanation": "O polegar deve golpear com a parte óssea lateral da articulação e quicar instantaneamente (rebound), permitindo que a corda bata no traste e ressoe."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 4,
    "name": "NÍVEL 4 — HARMONIA E RECURSOS AVANÇADOS",
    "subtitle": "Modos gregos, arpejos de tétrades (7M, 7, m7, m7b5), síncopes pesadas e métricas compostas",
    "badge": "Avançado",
    "description": "Aprofundamento na teoria moderna: sonoridades modais (Dórico, Mixolídio), expansão harmônica com arpejos de 4 sons e domínio rítmico em compassos 6/8 e 7/8.",
    "lessons": [
      {
        "id": "baixo-l-4-1",
        "level": 4,
        "moduleTitle": "Módulo 5: Harmonia Modal e Complexidade Rítmica",
        "lessonNumber": 13,
        "title": "Aula 13 — Modos Gregos Aplicados ao Contrabaixo: Dórico e Mixolídio",
        "subtitle": "Criando linhas com cores modais marcantes em Funk, Fusion e Jazz",
        "objective": "Diferenciar auditivamente e tecnicamente o modo Dórico (6ª maior) e o Mixolídio (7ª menor), aplicando em grooves autorais.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl13-p1",
            "title": "1. O Modo Dórico: O Som do Funk Sofisticado",
            "contentMarkdown": "\n### A Cor Dórica no Baixo (T - 2 - b3 - 4 - 5 - 6M - b7)\n\nA nota característica do modo Dórico é a **Sexta Maior (6M)** convivendo com a terça menor. Essa sonoridade elimina o peso trágico da escala menor e traz um ar moderno e sofisticado (estilo Jaco Pastorius em *Chameleon*).\n            "
          },
          {
            "id": "baixo-l-4-1-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-4-1-ex",
          "title": "Exercício 13 — Groove Dórico em D Dórico (Dm7)",
          "subtitle": "Linha com destaque para a 6ª maior (B)",
          "targetBpm": 90,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m alternado com ghost notes",
          "notesSequence": [
            {
              "stringNumber": 3,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "down"
            },
            {
              "stringNumber": 2,
              "noteCipher": "F",
              "notePt": "Fá",
              "pickDirection": "up"
            },
            {
              "stringNumber": 2,
              "noteCipher": "B",
              "notePt": "Si",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |-------5-7-|-4---4---|\nD |---5-7-----|---7-----|\nA |-5---------|---------|\nE |-----------|---------|\n    Dórico em D\n          ",
          "instructions": [
            "Destaque a nota Si (B: D casa 9 ou G casa 4) que é a 6ª maior do modo Dórico.",
            "Meta: 75 -> 90 BPM."
          ],
          "biomechanicTips": [
            "Utilize digitações econômicas para manter a mão posicionada sem saltos bruscos."
          ],
          "validationCriteria": "Execução precisa a 90 BPM evidenciando o intervalo característico.",
          "precisionCriteria": [
            "Destaque a nota Si (B: D casa 9 ou G casa 4) que é a 6ª maior do modo Dórico.",
            "Meta: 75 -> 90 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq13-1",
              "question": "Qual é a nota característica (intervalo distintivo) que diferencia o Modo Dórico da Escala Menor Natural?",
              "options": [
                "A Sexta Maior (6M)",
                "A Terça Maior (3M)",
                "A Quinta Diminuta (b5)",
                "A Segunda Menor (b2)"
              ],
              "correctIndex": 0,
              "explanation": "O modo Dórico difere do menor natural exclusivamente por possuir a 6ª maior no lugar da 6ª menor."
            },
            {
              "id": "bq13-2",
              "question": "Qual intervalo é a \"nota característica\" do Modo Dórico que o diferencia da Escala Menor Natural?",
              "options": [
                "A Sexta Maior (6M), conferindo uma sonoridade aberta, brilhante e sofisticada ao acorde menor",
                "A Terça Maior",
                "A Quinta Diminuta",
                "A Nona Bemol"
              ],
              "correctIndex": 0,
              "explanation": "Enquanto a escala menor natural possui sexta menor (b6), o modo Dórico possui sexta maior (6M natural), a marca registrada do Funk, Fusion e Jazz modal."
            }
          ]
        }
      },
      {
        "id": "baixo-l-4-2",
        "level": 4,
        "moduleTitle": "Módulo 5: Harmonia Modal e Complexidade Rítmica",
        "lessonNumber": 14,
        "title": "Aula 14 — Arpejos de Tétrades (7M, 7, m7, m7b5) em Duas Oitavas",
        "subtitle": "A estrutura dos 4 tipos de acordes de 4 sons do campo harmônico maior",
        "objective": "Executar e conectar tétrades maiores, menores, dominantes e meio-diminutas no braço inteiro.",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl14-p1",
            "title": "1. As Quatro Famílias de Tétrades",
            "contentMarkdown": "\n### Tétrades: A Linguagem da Música Profissional\n\n1. **Maior com Sétima Maior (7M):** $T - 3 - 5 - 7$\n2. **Dominante (7):** $T - 3 - 5 - b7$\n3. **Menor com Sétima (m7):** $T - b3 - 5 - b7$\n4. **Meio-Diminuto (m7b5):** $T - b3 - b5 - b7$\n            "
          },
          {
            "id": "baixo-l-4-2-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-4-2-ex",
          "title": "Exercício 14 — Ciclo de Tétrades em C7M - Dm7 - Em7 - F7M - G7",
          "subtitle": "Subindo e descendo tétrades no braço",
          "targetBpm": 80,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m alternado rigoroso",
          "notesSequence": [
            {
              "stringNumber": 3,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 2,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "up"
            },
            {
              "stringNumber": 2,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "B",
              "notePt": "Si",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |---4-5-|---5-7-|---7-9-|\nD |-5-----|-7-----|-9-----|\nA |-------|-------|-------|\nE |-------|-------|-------|\n    C7M     Dm7     Em7\n          ",
          "instructions": [
            "Conecte as tétrades de forma fluida sem interrupção de som entre os compassos.",
            "Meta: 65 -> 80 BPM."
          ],
          "biomechanicTips": [
            "Abra os dedos no formato do arpejo antes mesmo do ataque para garantir clareza."
          ],
          "validationCriteria": "8 voltas ininterruptas no ciclo de tétrades a 80 BPM.",
          "precisionCriteria": [
            "Conecte as tétrades de forma fluida sem interrupção de som entre os compassos.",
            "Meta: 65 -> 80 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq14-1",
              "question": "Quais intervalos formam uma tétrade de Acorde Dominante (ex: G7)?",
              "options": [
                "Tônica, Terça Maior, Quinta Justa e Sétima Menor (T - 3 - 5 - b7)",
                "Tônica, Terça Maior, Quinta Justa e Sétima Maior (T - 3 - 5 - 7)",
                "Tônica, Terça Menor, Quinta Justa e Sétima Menor",
                "Tônica, Terça Menor, Quinta Diminuta e Sétima Diminuta"
              ],
              "correctIndex": 0,
              "explanation": "O acorde dominante é composto por tríade maior e sétima menor (T - 3 - 5 - b7)."
            },
            {
              "id": "bq14-2",
              "question": "Qual é a estrutura de intervalos da tétrade Meio-Diminuta (m7b5) estudada no Nível 4?",
              "options": [
                "Tônica (1), Terça Menor (b3), Quinta Diminuta (b5) e Sétima Menor (b7)",
                "Tônica, Terça Maior, Quinta Justa e Sétima Maior",
                "Tônica, Terça Maior, Quinta Aumentada e Sétima Menor",
                "Quatro notas separadas por tons inteiros"
              ],
              "correctIndex": 0,
              "explanation": "O acorde m7b5 (meio-diminuto) é o acorde do grau VII do campo maior e grau II do campo menor harmônico: 1 - b3 - b5 - b7."
            }
          ]
        }
      },
      {
        "id": "baixo-l-4-3",
        "level": 4,
        "moduleTitle": "Módulo 5: Harmonia Modal e Complexidade Rítmica",
        "lessonNumber": 15,
        "title": "Aula 15 — Métricas Compostas (6/8 e 12/8) e Métricas Ímpares (7/8)",
        "subtitle": "Contagem assimétrica, deslocamento de tempo e pulsação ternária",
        "objective": "Tocar com estabilidade métricas em 6/8 (baladas/gospel) e 7/8 (música instrumental contemporânea).",
        "estimatedMinutes": 25,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl15-p1",
            "title": "1. O Balanço do 6/8 e a Assimetria do 7/8",
            "contentMarkdown": "\n### Pulso Composto vs Pulso Ímpar\n\n* **Compasso 6/8:** Dois pulsos pontuados por compasso: `1-2-3 | 4-5-6` (balanço de balada e worship).\n* **Compasso 7/8:** Sete colcheias divididas assimetricamente: `2 + 2 + 3` ou `3 + 2 + 2`.\n            "
          },
          {
            "id": "baixo-l-4-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-4-3-ex",
          "title": "Exercício 15 — Groove em 7/8 (Divisão 2+2+3)",
          "subtitle": "Precisão rítmica com acentuação assimétrica",
          "targetBpm": 110,
          "targetRepetitions": 12,
          "timeSignature": {
            "beats": 7,
            "noteValue": 8
          },
          "pickingPattern": "i - m alternado com acentos dinâmicos",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "up"
            },
            {
              "stringNumber": 3,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "D",
              "notePt": "Ré",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nE |-0-0---3-3---5-5-5-|\n    > .   > .   > . .  (Padrão 2 + 2 + 3)\n          ",
          "instructions": [
            "Acentue os tempos fortes: 1, 3 e 5 da contagem de 7 colcheias.",
            "Meta: 90 -> 110 BPM."
          ],
          "biomechanicTips": [
            "Conte em voz alta \"um-dois, um-dois, um-dois-três\" até internalizar o balanço."
          ],
          "validationCriteria": "12 ciclos perfeitos em 7/8 a 110 BPM sem perder a contagem.",
          "precisionCriteria": [
            "Acentue os tempos fortes: 1, 3 e 5 da contagem de 7 colcheias.",
            "Meta: 90 -> 110 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq15-1",
              "question": "Como costuma ser agrupado o compasso de 7/8 na música instrumental e progressiva?",
              "options": [
                "Em células de 2 + 2 + 3 ou 3 + 2 + 2",
                "Apenas em 4 + 4",
                "Em 7 tempos inteiros lentos",
                "Não possui agrupamento"
              ],
              "correctIndex": 0,
              "explanation": "A métrica de 7/8 é formada pela combinação de pulsos binários e ternários (ex: 2+2+3 ou 3+2+2)."
            },
            {
              "id": "bq15-2",
              "question": "Como se divide comumente o compasso ímpar 7/8 para criar um groove fluente e balanceado no contrabaixo?",
              "options": [
                "Em grupos de 2 + 2 + 3 colcheias (ou 3 + 2 + 2)",
                "Em 7 semínimas pontuadas",
                "Dividindo 7 por 4 tempos iguais",
                "Tocando apenas no tempo 1 e descansando os outros 6"
              ],
              "correctIndex": 0,
              "explanation": "O compasso 7/8 ganha suingue e clareza motora quando agrupado assimetricamente em células de 2 e 3 colcheias (2+2+3 ou 3+2+2)."
            }
          ]
        }
      }
    ]
  },
  {
    "level": 5,
    "name": "NÍVEL 5 — ESPECIALIZAÇÃO E PERFORMANCE",
    "subtitle": "Tapping a duas mãos, interação locked groove com a bateria e recital de graduação",
    "badge": "Performance",
    "description": "Atingimento da maestria profissional: técnicas modernas de duas mãos, arranjo polifônico, química rítmica absoluta com a bateria e projeto autoral de encerramento.",
    "lessons": [
      {
        "id": "baixo-l-5-1",
        "level": 5,
        "moduleTitle": "Módulo 6: Virtuosismo e Recital de Conservatório",
        "lessonNumber": 16,
        "title": "Aula 16 — Acordes Harmônicos e Técnicas Polifônicas no Contrabaixo",
        "subtitle": "Décimas, terças e acordes de passagem sem embolar as frequências graves",
        "objective": "Tocar acordes e décimas afinadas no contrabaixo mantendo clareza tímbrica na região média e aguda do braço.",
        "estimatedMinutes": 30,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl16-p1",
            "title": "1. O Limite das Frequências Graves: A Regra dos Acordes em Décimas",
            "contentMarkdown": "\n### Por que Tocar Décimas no Baixo\n\nTocar terças na região grave (abaixo da casa 5) gera uma onda acústica lamacenta devido ao fenômeno dos batimentos de frequências próximas. Para contornar isso:\n* **Acordes em Décimas:** Tocamos a tônica na corda E ou A e a terça **uma oitava acima** na corda G. O espaço aberto de mais de uma oitava entre as notas gera uma sonoridade limpa, cristalina e com beleza harmônica incomparável.\n            "
          },
          {
            "id": "baixo-l-5-1-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-5-1-ex",
          "title": "Exercício 16 — Progressão de Décimas em Dó Maior (C - Am - F - G)",
          "subtitle": "Arranjo polifônico a duas cordas",
          "targetBpm": 70,
          "targetRepetitions": 8,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Polegar na Tônica / Indicador ou Médio na Décima aguda",
          "notesSequence": [
            {
              "stringNumber": 3,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "up"
            },
            {
              "stringNumber": 4,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 1,
              "noteCipher": "C",
              "notePt": "Dó",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nG |-9---9-|-5---5-|-2---2-|-4---4-| (Terça / Décima)\nD |-------|-------|-------|-------|\nA |-------|-------|-------|-------|\nE |-8---8-|-5---5-|-1---1-|-3---3-| (Tônica)\n    C       Am      F       G\n          ",
          "instructions": [
            "Pince as duas notas simultaneamente (Tônica no polegar, décima no indicador).",
            "Deixe os dois sons vibrarem em perfeita consonância.",
            "Meta: 60 -> 70 BPM."
          ],
          "biomechanicTips": [
            "Afaste os dedos da mão esquerda para não tocar na corda D (ela deve permanecer muda)."
          ],
          "validationCriteria": "8 repetições perfeitas com sustentação cristalina de todas as décimas.",
          "precisionCriteria": [
            "Pince as duas notas simultaneamente (Tônica no polegar, décima no indicador).",
            "Deixe os dois sons vibrarem em perfeita consonância.",
            "Meta: 60 -> 70 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq16-1",
              "question": "Por que no contrabaixo os acordes costumam ser tocados em aberturas de décimas em vez de terças fechadas?",
              "options": [
                "Porque terças na região grave geram batimentos de frequência acústica que embolam o som",
                "Porque é proibido tocar duas notas no baixo",
                "Porque o baixo só tem 4 cordas",
                "Porque a mão não alcança"
              ],
              "correctIndex": 0,
              "explanation": "O intervalo de décima (oitava + terça) abre espaço sonoro suficiente para que as duas notas soem com clareza tímbrica."
            },
            {
              "id": "bq16-2",
              "question": "Por que no contrabaixo elétrico os acordes são preferencialmente montados com o intervalo de Décima (oitava + terça)?",
              "options": [
                "Porque terças fechadas na região grave colidem frequências e embolam o som, enquanto décimas abertas soam transparentes e límpidas",
                "Porque a mão humana não consegue alcançar notas menores que uma décima",
                "Porque décimas são afinadas em dó maior automaticamente",
                "Para que o contrabaixo toque mais alto que a guitarra"
              ],
              "correctIndex": 0,
              "explanation": "A teoria acústica dos limites de harmônicos graves ensina que terças fechadas abaixo de 200 Hz soam ásperas e confusas; abrir o intervalo para uma décima clareia a ressonância."
            }
          ]
        }
      },
      {
        "id": "baixo-l-5-2",
        "level": 5,
        "moduleTitle": "Módulo 6: Virtuosismo e Recital de Conservatório",
        "lessonNumber": 17,
        "title": "Aula 17 — Interação Avançada Baixo-Bateria (Locked In Groove & Pocket)",
        "subtitle": "Trabalhando com o chimbal, caixa e bumbo para criar uma parede rítmica inquebrável",
        "objective": "Ajustar a duração exata das notas e o ataque para trancar com o kit da bateria em estúdio e ao vivo.",
        "estimatedMinutes": 30,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl17-p1",
            "title": "1. A Simbiose da \"Cozinha\": Baixo e Bateria como um Só Instrumento",
            "contentMarkdown": "\n### A Unidade Perfeita: Quando o Ouvinte Ouve um Só Pulso\n\nUm grande contrabaixista não toca sozinho; ele escuta a bateria com tanta intensidade que seu ataque de mão direita e o pedal do bumbo tornam-se indistinguíveis.\n* **Ataque com o Bumbo:** Dá o punch e o peso inicial.\n* **Sustain com a Caixa:** O baixo preenche os intervalos entre os estalos de caixa (tempos 2 e 4).\n* **Micro-Timing:** Tocar levemente atrás do tempo (*behind the beat*) gera peso e relaxamento (Reggae/Soul); tocar na cabeça do tempo (*on top*) gera urgência e energia (Rock/Punk).\n            "
          },
          {
            "id": "baixo-l-5-2-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-5-2-ex",
          "title": "Exercício 17 — Groove \"Locked In\" com Bumbo em Síncope",
          "subtitle": "Ataque rigoroso nas aberturas de bumbo",
          "targetBpm": 95,
          "targetRepetitions": 10,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "i - m apoiado com dinâmica firme",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "G",
              "notePt": "Sol",
              "pickDirection": "up"
            },
            {
              "stringNumber": 3,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\nE |-0---0---0-0-----|-0---0---0-0-3-5-|\nA |-------2-------2-|-------2---------|\n    1 e 2 e 3 e 4 e   1 e 2 e 3 e 4 e\n          ",
          "instructions": [
            "Toque com o metrônomo acentuando tempos 2 e 4.",
            "Meta: 80 -> 95 BPM."
          ],
          "biomechanicTips": [
            "Abroche a nota imediatamente no tempo 4 com a mão esquerda para dar espaço ao estalo da caixa."
          ],
          "validationCriteria": "10 repetições com sincronização absoluta de transientes.",
          "precisionCriteria": [
            "Toque com o metrônomo acentuando tempos 2 e 4.",
            "Meta: 80 -> 95 BPM."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq17-1",
              "question": "O que significa a expressão tocar \"behind the beat\" (atrás do tempo)?",
              "options": [
                "Tocar milissegundos após o centro do pulso, criando sensação de peso e relaxamento sem perder o andamento",
                "Tocar atrasado e descompassado",
                "Tocar mais rápido que o baterista",
                "Parar de tocar"
              ],
              "correctIndex": 0,
              "explanation": "Tocar \"behind the beat\" é uma sutileza profissional de micro-timing que cria o clássico groove relaxado de Soul, Neo-Soul e R&B."
            },
            {
              "id": "bq17-2",
              "question": "O que significa para um contrabaixista tocar \"in the pocket\" com o baterista?",
              "options": [
                "Alinhamento micro-temporal impecável entre o ataque do baixo e a dinâmica do bumbo e caixa, gerando sensação de balanço irresistível",
                "Guardar as baquetas no bolso do contrabaixista",
                "Tocar exatamente 2 semitons acima do tom da música",
                "Usar um contrabaixo tão pequeno que cabe no bolso"
              ],
              "correctIndex": 0,
              "explanation": "Estar no \"pocket\" é o ápice do músico de sessão: a fusão rítmica onde o tempo parece respirar com perfeição sem oscilações involuntárias de andamento."
            }
          ]
        }
      },
      {
        "id": "baixo-l-5-3",
        "level": 5,
        "moduleTitle": "Módulo 6: Virtuosismo e Recital de Conservatório",
        "lessonNumber": 18,
        "title": "Aula 18 — Projeto de Conclusão: Construção e Recital de Linha Autoral Completa",
        "subtitle": "Aplicação integral de vocabulário, dinâmicas, slap, walking e condução rítmica",
        "objective": "Compor, memorizar e executar uma linha completa de contrabaixo de conservatório integrando groove, passagens, dinâmicas e solo temático.",
        "estimatedMinutes": 35,
        "instrument": "baixo",
        "parts": [
          {
            "id": "bl18-p1",
            "title": "1. As Quatro Etapas do Recital de Conclusão",
            "contentMarkdown": "\n### O Recital de Graduação em Contrabaixo Elétrico\n\nParabéns por atingir o ápice do Conservatório de Contrabaixo da Guitar Academy! Esta aula final reúne tudo o que você construiu:\n1. **Seção A (Intro e Estrofe):** Groove firme de sustentação com tônica, quinta e oitava e controle de dinâmica (piano a mezzo-forte).\n2. **Seção B (Refrão):** Adição de ghost notes e antecipações rítmicas com pegada moderna.\n3. **Seção C (Ponte Instrumental / Solo):** Fraseado melódico utilizando modos gregos e abertura de décimas na região aguda.\n4. **Seção D (Coda):** Finalização com slap percussivo e acorde final sustentado.\n            "
          },
          {
            "id": "baixo-l-5-3-p2",
            "title": "2. Execução Técnica, Notação Prática e Aplicação Musical",
            "contentMarkdown": "### Prática Estruturada e Aplicação de Conservatório no Contrabaixo\n\nPara consolidar os fundamentos técnicos desta aula:\n* **Biomecânica de Precisão:** Mantenha postura neutra, respiração contínua e relaxamento muscular ativo sem tensões parasitas no túnel do carpo.\n* **Toque apoiado e Movable Thumb:** Pratique a alternância rigorosa com dedos indicador e médio, utilizando o polegar como âncora e silenciador de ressonâncias indesejadas.\n* **Notação e Pulso:** Execute cada frase respeitando milimetricamente a subdivisão e o andamento com metrônomo.\n* **Aplicação em Arranjos:** Conecte o conceito estudado aos gêneros canônicos (Pop, Rock, Worship, Jazz, MPB), ouvindo criticamente o equilíbrio sonoro no contexto de banda com a bateria e o bumbo."
          }
        ],
        "practicalExercise": {
          "id": "baixo-l-5-3-ex",
          "title": "Exercício 18 — A Linha Completa de Recital (Estrutura A-B-C-D)",
          "subtitle": "Apresentação formal da peça de graduação",
          "targetBpm": 90,
          "targetRepetitions": 4,
          "timeSignature": {
            "beats": 4,
            "noteValue": 4
          },
          "pickingPattern": "Pizzicato i-m dinâmico + Slap/Pop na Coda",
          "notesSequence": [
            {
              "stringNumber": 4,
              "noteCipher": "E",
              "notePt": "Mi",
              "pickDirection": "down"
            },
            {
              "stringNumber": 3,
              "noteCipher": "B",
              "notePt": "Si",
              "pickDirection": "up"
            },
            {
              "stringNumber": 3,
              "noteCipher": "C#",
              "notePt": "Dó#",
              "pickDirection": "down"
            },
            {
              "stringNumber": 4,
              "noteCipher": "A",
              "notePt": "Lá",
              "pickDirection": "up"
            }
          ],
          "tablatureText": "\n[Parte A: Groove]\nE |-0---0-0---0-0-2-|-7---7-7---7-7-6-|-9---9-9---9-9-7-|-5---5-5---5-5-3-|\n[Parte B: Slap Coda]\nE |-0---x-0---x-0-x-|-3---x-3---x-3-x-|-5---x-5---x-5-x-|-0~~~~~~~~~~~~~~~|\n          ",
          "instructions": [
            "Execute a peça inteira do início ao fim sem interrupções.",
            "Respeite as dinâmicas escritas (inicie suave, cresça no refrão e finalize com autoridade).",
            "Meta: 90 BPM com afinação, precisão e presença de palco impecáveis."
          ],
          "biomechanicTips": [
            "Respire fundo e mantenha a coluna alinhada durante toda a performance."
          ],
          "validationCriteria": "Execução de 4 recitais completos seguidos com nota máxima de consistência rítmica e sonora.",
          "precisionCriteria": [
            "Execute a peça inteira do início ao fim sem interrupções.",
            "Respeite as dinâmicas escritas (inicie suave, cresça no refrão e finalize com autoridade).",
            "Meta: 90 BPM com afinação, precisão e presença de palco impecáveis."
          ],
          "commonErrors": [
            "Tencionar os músculos do braço e flexores do punho durante a execução contínua",
            "Acelerar involuntariamente nos trechos mais fáceis da frase rítmica",
            "Pressionar a escala com força desnecessária gerando fadiga prematura"
          ]
        },
        "quiz": {
          "passingScore": 80,
          "questions": [
            {
              "id": "bq18-1",
              "question": "Qual é a marca definitiva de um contrabaixista de nível profissional graduado em conservatório?",
              "options": [
                "A capacidade de sustentar o andamento com estabilidade, timbre consistente e serviço musical à canção e à banda",
                "Tocar mais notas por segundo que a guitarra",
                "Tocar sempre no volume máximo do amplificador",
                "Não usar o metrônomo nos ensaios"
              ],
              "correctIndex": 0,
              "explanation": "A excelência do contrabaixo reside na consistência, peso, estabilidade rítmica inabalável e inteligência musical a serviço do coletivo."
            },
            {
              "id": "bq18-2",
              "question": "Qual é o critério principal de avaliação no Recital de Graduação em Contrabaixo do Conservatório?",
              "options": [
                "Narrativa musical consistente, domínio técnico nas 4 cordas, precisão métrica milimétrica e expressividade artística",
                "O número máximo de notas tocadas por segundo sem parar",
                "Quebrar o maior número de cordas durante a apresentação",
                "Tocar o recital inteiro de costas para a banca examinadora"
              ],
              "correctIndex": 0,
              "explanation": "Um recital de graduação avalia a maturidade de um instrumentista completo: sonoridade encorpada, clareza harmônica, timing irrepreensível e musicalidade."
            }
          ]
        }
      }
    ]
  }
];

export const BASS_LESSONS: BassLesson[] = BASS_COURSE_LEVELS.flatMap((l) => l.lessons);

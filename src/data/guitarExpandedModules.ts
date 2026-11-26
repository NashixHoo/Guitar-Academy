// =========================================================================
// GUITAR ACADEMY — MÓDULOS DE EXPANSÃO DA GUITARRA (MÓDULOS 7 A 10)
// Complemento de 22 aulas novas + 2 solos históricos para atingir 60 aulas
// =========================================================================

export interface GuitarExpandedLesson {
  id: string;
  moduleNumber: number;
  lessonNumber: number;
  title: string;
  subtitle: string;
  objective: string;
  estimatedMinutes: number;
  contentSummary: string;
  practicalExercise: string;
}

export interface GuitarExpandedModule {
  moduleNumber: number;
  title: string;
  subtitle: string;
  nivel: number;
  lessons: GuitarExpandedLesson[];
}

export const GUITAR_EXPANDED_MODULES: GuitarExpandedModule[] = [
  {
    moduleNumber: 7,
    title: 'Módulo 7 — Harmonia Avançada e Voicings Modernos',
    subtitle: 'Acordes com sétima, extensões (9ª e 13ª), II-V-I e dominantes secundários',
    nivel: 4,
    lessons: [
      {
        id: 'solo-lesson-19',
        moduleNumber: 7,
        lessonNumber: 37,
        title: 'Solo Avançado 19 — Fraseado Modal e Velocidade Sincronizada',
        subtitle: 'Aplicação de tétrades e pentatônicas com abafamento e legato',
        objective: 'Desenvolver fluência em solos modais com precisão mecânica.',
        estimatedMinutes: 30,
        contentSummary: 'Integração de acordes com extensões superiores e fraseado fluido.',
        practicalExercise: 'Execução de Cmaj9–Am13–Dm9–G13 a 70 BPM com metrônomo.'
      },
      {
        id: 'solo-lesson-20',
        moduleNumber: 7,
        lessonNumber: 38,
        title: 'Solo Avançado 20 — Apogeu Técnico e Expressão de Palco',
        subtitle: 'Síntese de sweep picking, bends microtonais e dinâmica de palco',
        objective: 'Consolidar o domínio solista profissional.',
        estimatedMinutes: 35,
        contentSummary: 'Expressão artística avançada e controle de alta performance.',
        practicalExercise: 'Solo completo aplicando todas as técnicas consolidadas.'
      },
      {
        id: 'guitar-mod7-l1',
        moduleNumber: 7,
        lessonNumber: 39,
        title: 'Aula 39 — Acordes com Sétima Dominante e Extensões (9ª e 13ª)',
        subtitle: 'Voicings modernos e aplicação prática em cadências II-V-I',
        objective: 'Dominar acordes estendidos no braço da guitarra.',
        estimatedMinutes: 25,
        contentSummary: 'Construção de voicings sem tônica (drop 2 e drop 3) e extensões superiores.',
        practicalExercise: 'Progressão Cmaj9–Am13–Dm9–G13 a 70 BPM com metrônomo.'
      },
      {
        id: 'guitar-mod7-l2',
        moduleNumber: 7,
        lessonNumber: 40,
        title: 'Aula 40 — Dominantes Secundários e Resoluções',
        subtitle: 'V7/II, V7/V, V7/VI e extensões alteradas',
        objective: 'Compreender a função e a resolução de dominantes secundários.',
        estimatedMinutes: 25,
        contentSummary: 'Harmonia funcional avançada com tonicizações temporárias.',
        practicalExercise: 'Análise e execução de progressão com V7/V resolvendo em V7.'
      },
      {
        id: 'guitar-mod7-l3',
        moduleNumber: 7,
        lessonNumber: 41,
        title: 'Aula 41 — Acordes Diminutos de Passagem e Inversões',
        subtitle: 'Condução harmônica suave e sustentação de baixos cromáticos',
        objective: 'Utilizar acordes diminutos para conectar acordes diatônicos.',
        estimatedMinutes: 25,
        contentSummary: 'Simetria dos acordes diminutos e inversões no braço.',
        practicalExercise: 'Condução de baixo com acordes diminutos de passagem a 65 BPM.'
      },
      {
        id: 'guitar-mod7-l4',
        moduleNumber: 7,
        lessonNumber: 42,
        title: 'Aula 42 — Empréstimo Modal e Troca de Cor Harmônica',
        subtitle: 'Aplicação de acordes do modo menor homônimo (I–IV–iv–I)',
        objective: 'Explorar sonoridades emotivas através do empréstimo modal.',
        estimatedMinutes: 25,
        contentSummary: 'Uso de tétrades e tríades emprestadas do modo menor natural.',
        practicalExercise: 'Exercício obrigatório: C–F–Fm–C com condução suave de vozes.'
      }
    ]
  },
  {
    moduleNumber: 8,
    title: 'Módulo 8 — Condução de Vozes, Rearmonização e Modulação',
    subtitle: 'Voice leading, substituições tritônicas e modulações por acorde pivô',
    nivel: 4,
    lessons: [
      { id: 'guitar-mod8-l1', moduleNumber: 8, lessonNumber: 43, title: 'Aula 43 — Voice Leading Avançado', subtitle: 'Condução suave de vozes internas em cadências complexas', objective: 'Manter notas comuns e movimento contário entre acordes.', estimatedMinutes: 25, contentSummary: 'Movimento melódico nas vozes internas.', practicalExercise: 'Condução de vozes em II-V-I maior.' },
      { id: 'guitar-mod8-l2', moduleNumber: 8, lessonNumber: 44, title: 'Aula 44 — Substituição Tritônica', subtitle: 'Substituindo dominantes por acordes a meio tom de distância', objective: 'Aplicar subtituições tritônicas (subV7).', estimatedMinutes: 25, contentSummary: 'Teoria e prática do trítono compartilhado.', practicalExercise: 'G7 alterado substituído por Db7 em cadência.' },
      { id: 'guitar-mod8-l3', moduleNumber: 8, lessonNumber: 45, title: 'Aula 45 — Rearmonização Funcional', subtitle: 'Técnicas de rearmonização para enriquecer melodias simples', objective: 'Modificar a harmonia de uma música sem alterar a melodia.', estimatedMinutes: 30, contentSummary: 'Uso de acordes passantes e dominantes estendidos.', practicalExercise: 'Rearmonizar uma progressão básica de pop/jazz.' },
      { id: 'guitar-mod8-l4', moduleNumber: 8, lessonNumber: 46, title: 'Aula 46 — Modulação por Acorde Pivô', subtitle: 'Transição fluida entre tonalidades distantes', objective: 'Modular de forma imperceptível usando acordes comuns.', estimatedMinutes: 25, contentSummary: 'Modulação diatônica e cromática.', practicalExercise: 'Modulação de Dó Maior para Sol Maior via acorde pivô.' },
      { id: 'guitar-mod8-l5', moduleNumber: 8, lessonNumber: 47, title: 'Aula 47 — Escalas Símétricas e Diminutas', subtitle: 'Aplicação da escala diminuta e meio-diminuta na improvisação', objective: 'Explorar sonoridades simétricas em acordes diminutos.', estimatedMinutes: 30, contentSummary: 'Geometria das escalas simétricas no braço da guitarra.', practicalExercise: 'Licks usando a escala diminuta sobre V7(b9).' },
      { id: 'guitar-mod8-l6', moduleNumber: 8, lessonNumber: 48, title: 'Aula 48 — Escala Tons Inteiros', subtitle: 'Sonoridade misteriosa e suspensão tonal', objective: 'Improvisar sobre acordes aumentados (7#5).', estimatedMinutes: 25, contentSummary: 'Estrutura simétrica de tons inteiros.', practicalExercise: 'Fraseado em tons inteiros sobre acorde dominante alterado.' }
    ]
  },
  {
    moduleNumber: 9,
    title: 'Módulo 9 — Improvisação Modal Avançada e Alta Performance',
    subtitle: 'Modos da escala menor melódica, super-lídio, alterada e sweep picking',
    nivel: 5,
    lessons: [
      { id: 'guitar-mod9-l1', moduleNumber: 9, lessonNumber: 49, title: 'Aula 49 — Menor Melódica: Modos 1 e 4 (Lídio Dominante)', subtitle: 'Sonoridades modernas para acordes dominantes com alteração', objective: 'Dominar a escala menor melódica e seus modos.', estimatedMinutes: 30, contentSummary: 'Estudo do modo Lídio Dominante (4º grau da menor melódica).', practicalExercise: 'Improvisação sobre V7#11.' },
      { id: 'guitar-mod9-l2', moduleNumber: 9, lessonNumber: 50, title: 'Aula 50 — O Modo Alterado (Super-Locriano)', subtitle: 'A escala definitiva para dominantes com todas as alterações (b5, #5, b9, #9)', objective: 'Aplicar o modo alterado em cadências V7.', estimatedMinutes: 30, contentSummary: 'Tensões alteradas na guitarra.', practicalExercise: 'Licks no modo alterado sobre G7(alt) a 80 BPM.' },
      { id: 'guitar-mod9-l3', moduleNumber: 9, lessonNumber: 51, title: 'Aula 51 — Sweep Picking: Arpejos de Tríade e Tétrade', subtitle: 'Mecânica de varredura de palheta para arpejos fluidos', objective: 'Executar arpejos em sweep picking sem trastejamento.', estimatedMinutes: 35, contentSummary: 'Sincronismo bimanual estrito e abafamento com a mão esquerda.', practicalExercise: 'Arpejos em A menor em sweep a 90 BPM com metrônomo.' },
      { id: 'guitar-mod9-l4', moduleNumber: 9, lessonNumber: 52, title: 'Aula 52 — Tapping Avançado e Arpejos Expandidos', subtitle: 'Ligados com duas mãos e saltos de corda virtuosos', objective: 'Expandir o braço da guitarra usando tapping com 3 e 4 dedos.', estimatedMinutes: 30, contentSummary: 'Independência da mão direita no braço.', practicalExercise: 'Padrão de tapping em tríades maiores e menores.' },
      { id: 'guitar-mod9-l5', moduleNumber: 9, lessonNumber: 53, title: 'Aula 53 — Pentatônicas com 3 Notas por Corda e Outside Playing', subtitle: 'Técnica de expansão pentatônica e notas de aproximação cromática fora da tonalidade', objective: 'Criar tensão deliberada (outside playing) com resolução.', estimatedMinutes: 30, contentSummary: 'Conceito de inside vs. outside na improvisação.', practicalExercise: 'Solo modulando pentatônicas meio tom acima.' },
      { id: 'guitar-mod9-l6', moduleNumber: 9, lessonNumber: 54, title: 'Aula 54 — Pedal Points e Ostinatos Rítmicos', subtitle: 'Fraseado com nota pedal fixa e saltos intervalares complexos', objective: 'Desenvolver texturas solistas avançadas.', estimatedMinutes: 30, contentSummary: 'Uso de cordas soltas ou notas fixas como pedal harmônico.', practicalExercise: 'Solo com pedal point em Mi a 100 BPM.' }
    ]
  },
  {
    moduleNumber: 10,
    title: 'Módulo 10 — Especialização, Composição e Performance de Palco',
    subtitle: 'Improvisação livre, arranjo para guitarra solo, timbragem e recital final',
    nivel: 5,
    lessons: [
      { id: 'guitar-mod10-l1', moduleNumber: 10, lessonNumber: 55, title: 'Aula 55 — Arranjo para Guitarra Solo (Fingerstyle na Elétrica)', subtitle: 'Executando linha de baixo, harmonia e melodia simultaneamente', objective: 'Arranjar músicas populares para guitarra solo desacompanhada.', estimatedMinutes: 35, contentSummary: 'Técnica de independência polifônica na guitarra.', practicalExercise: 'Arranjo de uma progressão padrão com baixo e melodia.' },
      { id: 'guitar-mod10-l2', moduleNumber: 10, lessonNumber: 56, title: 'Aula 56 — Imagem Sonora, Timbragem e Uso de Efeitos', subtitle: 'Overdrive, delay, reverb, compressão e modelagem de timbre', objective: 'Dominar a interação entre pedais/efeitos e a dinâmica do toque.', estimatedMinutes: 25, contentSummary: 'Física do timbre elétrico e ganho.', practicalExercise: 'Ajuste de ganho e equalização para solos vs. bases.' },
      { id: 'guitar-mod10-l3', moduleNumber: 10, lessonNumber: 57, title: 'Aula 57 — Construção de Solos Temáticos e Cíclicos', subtitle: 'Desenvolvimento motívico, clímax e resolução narrativa', objective: 'Compor solos com arco narrativo estruturado.', estimatedMinutes: 30, contentSummary: 'Arquitetura de um solo memorável.', practicalExercise: 'Criação de solo temático sobre base de blues progressivo.' },
      { id: 'guitar-mod10-l4', moduleNumber: 10, lessonNumber: 58, title: 'Aula 58 — Improvisação Livre sobre Cadências Complexas', subtitle: 'Navegando por modulações rápidas e compassos compostos', objective: 'Improvisar livremente sem suporte diatônico óbvio.', estimatedMinutes: 35, contentSummary: 'Percepção harmônica em tempo real.', practicalExercise: 'Improvisação sobre Giant Steps em andamento moderado.' },
      { id: 'guitar-mod10-l5', moduleNumber: 10, lessonNumber: 59, title: 'Aula 59 — Masterclass de Performance e Combate à Tensão', subtitle: 'Ergonomia de palco, psicologia da performance e foco mental', objective: 'Eliminar a ansiedade de execução e rigidez muscular.', estimatedMinutes: 25, contentSummary: 'Respiração, relaxamento e autoconfiança.', practicalExercise: 'Rotina de aquecimento pré-performance de 15 minutos.' },
      { id: 'guitar-mod10-l6', moduleNumber: 10, lessonNumber: 60, title: 'Aula 60 — Recital de Graduação e Banca Final de Guitarra', subtitle: 'Apresentação do repertório de conservatório e avaliação de maestria', objective: 'Consolidar a formação instrumental completa em guitarra.', estimatedMinutes: 45, contentSummary: 'Síntese de todas as competências desenvolvidas no curso.', practicalExercise: 'Performance integral de peça solista e teste prático de improvisação.' }
    ]
  }
];

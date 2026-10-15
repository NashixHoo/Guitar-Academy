// =============================================================
// GUITAR ACADEMY / VIRTUO STUDY PLAN GENERATOR
// src/music/study-plan.ts
// Gera planos de estudo estruturados em 7 dias para domínio instrumental
// 100% determinístico, offline e adaptativo à dificuldade da música
// =============================================================

export interface StudyPlanDay {
  day: number;
  name: string;
  title: string;
  subtitle: string;
  focus: string;
  practiceMinutes: number;
  tasks: string[];
  tip: string;
}

export interface GeneratedStudyPlan {
  songTitle: string;
  artist: string;
  key: string;
  bpm: number;
  difficulty: string;
  days: StudyPlanDay[];
  totalDays: number;
  totalPracticeMinutes: number;
  summary: string;
}

export function generateStudyPlan(
  song: { title?: string; artist?: string; key?: string; bpm?: number; difficulty?: string; chords?: any },
  analysis: any = null
): GeneratedStudyPlan {
  const title = song?.title || 'Peça Didática Selecionada';
  const artist = song?.artist || 'Guitar Academy';
  const key = song?.key || 'G';
  const bpm = Number(song?.bpm) || 74;
  const warmUpBpm = Math.max(40, Math.round(bpm * 0.75));

  const chords =
    analysis?.uniqueChords && analysis.uniqueChords.length > 0
      ? analysis.uniqueChords
      : Array.isArray(song?.chords)
      ? song.chords
      : typeof song?.chords === 'string'
      ? [
          ...new Set(
            song.chords.match(/[A-G][b#]?(?:m|maj|min|dim|aug|sus[24]?|add[29]?|[0-9]+)*(?:\/[A-G][b#]*)?/g) || []
          )
        ]
      : ['G', 'C', 'D', 'Em'];

  const difficulty = analysis?.difficulty || song?.difficulty || 'Médio';

  const keyTransitions: string[] = [];
  for (let i = 0; i < chords.length - 1 && keyTransitions.length < 4; i++) {
    keyTransitions.push(`${chords[i]} ➔ ${chords[i + 1]}`);
  }
  if (chords.length > 2 && keyTransitions.length < 4) {
    keyTransitions.push(`${chords[chords.length - 1]} ➔ ${chords[0]}`);
  }

  const days: StudyPlanDay[] = [
    {
      day: 1,
      name: 'Dia 1',
      title: 'Acordes e Digitação',
      subtitle: 'Formação na Guitarra Física',
      focus: 'Memorização física e sonoridade limpa de cada acorde sem zumbidos',
      practiceMinutes: 20,
      tasks: [
        `Memorizar a digitação exata dos acordes no braço da guitarra: ${chords.slice(0, 6).join(', ')}.`,
        `Tocar cada acorde corda por corda na guitarra física com palheta, garantindo que todas as notas soem límpidas.`,
        `Se algum acorde apresentar dificuldade com pestana, utilize a versão do Easy Play.`
      ],
      tip: 'Mantenha o polegar no meio das costas do braço da guitarra para facilitar a abertura dos dedos 1, 2, 3 e 4.'
    },
    {
      day: 2,
      name: 'Dia 2',
      title: 'Transições Rápidas',
      subtitle: 'Trocas Fluidas sem Parar',
      focus: 'Fluidez na transição entre acordes consecutivos',
      practiceMinutes: 25,
      tasks: [
        `Treinar as transições críticas: ${keyTransitions.slice(0, 3).join(' | ')}.`,
        `Utilizar o metrônomo da academia a ${warmUpBpm} BPM (75% da velocidade) sem parar a batida entre as trocas.`,
        `Antecipar mentalmente o próximo desenho 1 tempo antes da mudança de compasso.`
      ],
      tip: 'Identifique dedos guias ou notas comuns na guitarra que permanecem parados para economizar movimento.'
    },
    {
      day: 3,
      name: 'Dia 3',
      title: 'Levada Rítmica e Palhetada',
      subtitle: 'Pulsação e Condução Estável',
      focus: 'Precisão rítmica com metrônomo no andamento da música',
      practiceMinutes: 20,
      tasks: [
        `Configurar o metrônomo da Guitar Academy para ${bpm} BPM.`,
        `Praticar o ritmo com as cordas abafadas pela mão esquerda (som percussivo 'chck') até internalizar a acentuação.`,
        `Unir a levada rítmica com a progressão da música mantendo a divisão estrita.`
      ],
      tip: 'Mantenha o punho relaxado e use o movimento do antebraço para manter o balanço contínuo.'
    },
    {
      day: 4,
      name: 'Dia 4',
      title: 'Dinâmica e Variações',
      subtitle: 'Expressão e Intensidade',
      focus: 'Transição suave entre partes suaves e o refrão com elevação da palhetada',
      practiceMinutes: 25,
      tasks: [
        `Isolar a parte mais intensa da música e praticar 5 repetições consecutivas.`,
        `Trabalhar o crescendo de palhetada nos 2 compassos que antecedem o clímax.`,
        `Praticar a sustentação harmônica limpa nos acordes abertos.`
      ],
      tip: 'Na Giannini 101 HSS, experimente alternar entre o captador do braço (som quente) e o da ponte (ataque firme).'
    },
    {
      day: 5,
      name: 'Dia 5',
      title: 'Música Completa',
      subtitle: 'Execução de Ponta a Ponta',
      focus: 'Integração de todas as seções sem interromper a execução',
      practiceMinutes: 30,
      tasks: [
        `Executar a música inteira do início ao fim com a cifra e tablatura da biblioteca.`,
        `Fazer 3 passagens completas sem interromper mesmo em caso de pequenas falhas.`,
        `Gravar em áudio ou tocar prestando atenção nos compassos difíceis.`
      ],
      tip: 'Se cometer uma pequena falha, não pare! O tempo musical é sagrado: continue na contagem do metrônomo.'
    },
    {
      day: 6,
      name: 'Dia 6',
      title: 'Velocidade e Resistência',
      subtitle: 'Domínio Técnico do Andamento',
      focus: 'Superar o andamento original com folga de segurança (+5 BPM)',
      practiceMinutes: 30,
      tasks: [
        `Praticar no andamento de ${bpm} BPM com o metrônomo.`,
        `Aumentar temporariamente para ${bpm + 5} BPM para desenvolver folga técnica.`,
        `Retornar para ${bpm} BPM: observe como o andamento original agora soa natural e relaxado.`
      ],
      tip: 'A musculatura da mão esquerda deve trabalhar com a pressão mínima necessária para a nota soar.'
    },
    {
      day: 7,
      name: 'Dia 7',
      title: 'Apresentação Real',
      subtitle: 'Execução Completa com Confiança',
      focus: 'Performance completa de pé ou postura de palco com a guitarra física afinada',
      practiceMinutes: 25,
      tasks: [
        `Conferir a afinação das 6 cordas no Afinador Pro da Guitar Academy antes de iniciar.`,
        `Tocar a música inteira de pé com a correia ajustada, simulando apresentação ao vivo.`,
        `Celebrar o domínio da canção e registrar o tempo de estudo no Diário de Bordo.`
      ],
      tip: 'A música é arte e conexão. Toque com alegria e sinta cada vibração das cordas da guitarra real!'
    }
  ];

  return {
    songTitle: title,
    artist,
    key,
    bpm,
    difficulty,
    days,
    totalDays: 7,
    totalPracticeMinutes: days.reduce((acc, d) => acc + d.practiceMinutes, 0),
    summary: `Plano de 7 dias desenvolvido pelo Motor de Inteligência Musical para dominar "${title}" no tom de ${key} a ${bpm} BPM.`
  };
}

import React, { useState } from 'react';
import { EducationalEvent, AnalyticsTableRow } from '../../types/teacher';
import { PieChart, TrendingUp, TrendingDown, Minus, Filter, Info } from 'lucide-react';

interface TeacherAnalyticsTabProps {
  events: EducationalEvent[];
  tableRows: AnalyticsTableRow[];
  totalEligibleStudents: number;
}

export const TeacherAnalyticsTab: React.FC<TeacherAnalyticsTabProps> = ({
  events,
  tableRows,
  totalEligibleStudents,
}) => {
  const [selectedChartIndex, setSelectedChartIndex] = useState<number>(0);

  const totalEvents = events.length;

  // 1. Dados: Distribuição por Categoria
  const categoryCounts = events.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels: Record<string, string> = {
    instrumental_practice: 'Prática Instrumental',
    guided_lessons: 'Aulas Guiadas',
    music_theory: 'Teoria Musical',
    technique_mechanics: 'Técnica & Mecânica',
    chords_harmony: 'Harmonia & Acordes',
    repertoire_ear: 'Treino Auditivo & Leitura',
  };

  // 2. Dados: Distribuição por Curso
  const courseCounts = events.reduce((acc, e) => {
    const c = e.courseId === 'violao' ? 'Violão' : e.courseId === 'solo' ? 'Guitarra Solo' : 'Conservatório';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 3. Dados: Prática vs Teoria
  const practiceVsTheory = {
    'Prática Instrumental': (categoryCounts['instrumental_practice'] || 0) + (categoryCounts['technique_mechanics'] || 0),
    'Estudo Teórico': (categoryCounts['music_theory'] || 0) + (categoryCounts['chords_harmony'] || 0),
    'Aulas & Repertório': (categoryCounts['guided_lessons'] || 0) + (categoryCounts['repertoire_ear'] || 0),
  };

  // 4. Dados: Tipo de Registro (Medido vs Manual)
  const measurementCounts = events.reduce((acc, e) => {
    const typeLabel = e.measurementType === 'verified_interactive' ? 'Interativo Verificado' : 'Registro Manual Offline';
    acc[typeLabel] = (acc[typeLabel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 5. Dados: Status de Aulas (Concluídas vs Iniciadas/Em andamento)
  const statusCounts = events.reduce((acc, e) => {
    if (e.eventType === 'lesson_completed') {
      acc['Concluídas'] = (acc['Concluídas'] || 0) + 1;
    } else {
      acc['Em Andamento / Prática'] = (acc['Em Andamento / Prática'] || 0) + 1;
    }
    return acc;
  }, { 'Concluídas': 0, 'Em Andamento / Prática': 0 } as Record<string, number>);

  const CHARTS = [
    {
      title: '1. Distribuição de Estudos por Categoria',
      data: categoryCounts,
      labels: categoryLabels,
      colors: ['#7B1E2B', '#C5A059', '#16A34A', '#2563EB', '#9333EA', '#D97706'],
      description: 'Mapeia a concentração das atividades de aprendizagem entre os 6 eixos do conservatório.',
      denominator: `Total de ${totalEvents} ações registradas no período`,
    },
    {
      title: '2. Distribuição de Acessos por Curso',
      data: courseCounts,
      labels: {},
      colors: ['#7B1E2B', '#C5A059', '#16A34A'],
      description: 'Proporção de dedicação dos alunos entre Violão, Conservatório e Guitarra Solo.',
      denominator: `Total de ${totalEvents} eventos de curso`,
    },
    {
      title: '3. Prática Instrumental versus Teoria Musical',
      data: practiceVsTheory,
      labels: {},
      colors: ['#7B1E2B', '#C5A059', '#2563EB'],
      description: 'Equilíbrio real entre execução com instrumento e absorção teórica de conceitos.',
      denominator: 'Total de eventos de prática e teoria combinados',
    },
    {
      title: '4. Tipo de Atividade (Verificada vs Manual)',
      data: measurementCounts,
      labels: {},
      colors: ['#16A34A', '#D97706'],
      description: 'Diferenciação honesta entre tempo medido pelo app e estudo autônomo reportado.',
      denominator: 'Total de registros de tempo',
    },
    {
      title: '5. Distribuição de Status de Aulas',
      data: statusCounts,
      labels: {},
      colors: ['#16A34A', '#C5A059'],
      description: 'Taxa de aulas concluídas com domínio comprovado versus aulas em andamento.',
      denominator: 'Total de registros de lições e exercícios',
    },
  ];

  const currentChart = CHARTS[selectedChartIndex] || CHARTS[0];

  // Converte data para fatias de pizza SVG
  const dataEntries = Object.entries(currentChart.data).filter(([_, val]) => val > 0);
  const chartSum = dataEntries.reduce((acc, [_, v]) => acc + v, 0) || 1;

  let accumulatedPercent = 0;
  const slices = dataEntries.map(([key, value], idx) => {
    const percent = (value / chartSum) * 100;
    const startPercent = accumulatedPercent;
    accumulatedPercent += percent;
    return {
      key,
      label: (currentChart.labels as Record<string, string>)[key] || key,
      value,
      percent: Number(percent.toFixed(1)),
      startPercent,
      color: currentChart.colors[idx % currentChart.colors.length],
    };
  });

  return (
    <div className="space-y-6">
      {/* Seletor de Gráfico */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] rounded-2xl shadow-xs">
        {CHARTS.map((c, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedChartIndex(idx)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedChartIndex === idx
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25]'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span className="truncate">{c.title.split('. ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Card do Gráfico Ativo + Legenda Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
        {/* Lado Esquerdo: Gráfico de Rosca SVG Interativo */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-56 h-56">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
              {slices.map((slice, sIdx) => {
                // Cálculo de arco SVG stroke-dasharray para rosca perfeita
                const circumference = 2 * Math.PI * 35; // raio 35
                const strokeLength = (slice.percent / 100) * circumference;
                const strokeOffset = (slice.startPercent / 100) * circumference;

                return (
                  <circle
                    key={sIdx}
                    cx="50"
                    cy="50"
                    r="35"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="16"
                    strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                    strokeDashoffset={-strokeOffset}
                    className="transition-all duration-500 hover:opacity-85 cursor-pointer"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-[#1F1F24] dark:text-[#F8F7F4]">{chartSum}</span>
              <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] font-mono-code">Ações Reais</span>
            </div>
          </div>
          <span className="text-[11px] text-[#666672] dark:text-[#B8B3C0] mt-3 text-center">
            {currentChart.description}
          </span>
        </div>

        {/* Lado Direito: Legenda e Métricas Detalhadas */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-3">
          <div className="border-b border-[#E8E6E1] dark:border-[#422933] pb-2">
            <h3 className="font-display font-black text-base text-[#1F1F24] dark:text-[#F8F7F4]">
              {currentChart.title}
            </h3>
            <span className="text-[11px] text-[#666672] dark:text-[#B8B3C0] flex items-center gap-1 mt-0.5">
              <Info className="w-3 h-3 text-[#C5A059]" />
              Denominador Matemático: {currentChart.denominator}
            </span>
          </div>

          <div className="space-y-2">
            {slices.map((slice, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="font-bold text-xs text-[#1F1F24] dark:text-[#F8F7F4] truncate">
                    {slice.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#666672] dark:text-[#B8B3C0] font-mono-code">
                    {slice.value} ações
                  </span>
                  <span className="font-mono-code font-bold text-xs px-2 py-0.5 rounded-md bg-white dark:bg-[#1A1216] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8D3D6] dark:border-[#422933]">
                    {slice.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela Analítica Correspondente com Denominadores Explícitos */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#1F1F24] dark:text-[#F8F7F4]">
              Tabela Analítica de Distribuição Pedagógica
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-0.5">
              Dados correlacionados aos gráficos acima com transparência sobre os denominadores de cálculo.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E6E1] dark:border-[#422933] text-[#666672] dark:text-[#B8B3C0]">
                <th className="pb-3 font-bold">Categoria / Atividade</th>
                <th className="pb-3 font-bold">Curso Relacionado</th>
                <th className="pb-3 font-bold text-center">Ocorrências</th>
                <th className="pb-3 font-bold text-center">Alunos Envolvidos</th>
                <th className="pb-3 font-bold text-right">Percentual Real</th>
                <th className="pb-3 font-bold text-center">Tendência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6E1] dark:divide-[#422933]">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#F8F7F4] dark:hover:bg-[#251820] transition-colors">
                  <td className="py-3 font-bold text-[#1F1F24] dark:text-[#F8F7F4]">
                    {row.categoryOrActivity}
                  </td>
                  <td className="py-3 text-[#666672] dark:text-[#B8B3C0]">
                    {row.course}
                  </td>
                  <td className="py-3 font-mono-code text-center font-bold text-[#1F1F24] dark:text-[#F8F7F4]">
                    {row.occurrenceCount}
                  </td>
                  <td className="py-3 font-mono-code text-center text-[#666672] dark:text-[#B8B3C0]">
                    {row.studentsInvolvedCount} de {totalEligibleStudents}
                  </td>
                  <td className="py-3 text-right">
                    <span className="font-mono-code font-bold text-xs px-2 py-0.5 rounded-md bg-[#FAF1F2] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8D3D6] dark:border-[#522536]">
                      {row.percentage}%
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    {row.trend === 'up' ? (
                      <span className="inline-flex items-center text-[#16A34A] text-[11px] font-bold gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Alta
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[#666672] dark:text-[#B8B3C0] text-[11px] gap-0.5">
                        <Minus className="w-3.5 h-3.5" /> Estável
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

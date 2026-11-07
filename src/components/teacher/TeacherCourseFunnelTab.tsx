import React, { useState } from 'react';
import { CourseFunnelRow } from '../../types/teacher';
import { Filter, ArrowUpDown, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react';

interface TeacherCourseFunnelTabProps {
  funnelRows: CourseFunnelRow[];
  selectedCourseId: 'violao' | 'canonical' | 'solo';
  onSelectCourseId: (cId: 'violao' | 'canonical' | 'solo') => void;
}

type SortField = 'lessonTitle' | 'startedCount' | 'completedCount' | 'completionRate' | 'dropRate';

export const TeacherCourseFunnelTab: React.FC<TeacherCourseFunnelTabProps> = ({
  funnelRows,
  selectedCourseId,
  onSelectCourseId,
}) => {
  const [sortField, setSortField] = useState<SortField>('dropRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  const filteredRows = funnelRows.filter((r) => {
    if (r.courseId !== selectedCourseId) return false;
    if (moduleFilter !== 'all' && r.moduleId !== moduleFilter) return false;
    return true;
  });

  // Módulos únicos do curso selecionado
  const modules = Array.from(new Set(funnelRows.filter((r) => r.courseId === selectedCourseId).map((r) => r.moduleId)));

  // Ordenação
  const sortedRows = [...filteredRows].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
    }
    return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Identificação do ponto crítico
  const criticalDrop = sortedRows.find((r) => r.dropRate > 0);

  return (
    <div className="space-y-6">
      {/* Seletor do Curso */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
        <div className="flex items-center gap-2">
          {(['violao', 'canonical', 'solo'] as const).map((cId) => (
            <button
              key={cId}
              onClick={() => onSelectCourseId(cId)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCourseId === cId
                  ? 'luxury-btn-primary text-white shadow-xs'
                  : 'text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25]'
              }`}
            >
              {cId === 'violao' ? 'Domínio Total do Violão (60 Aulas)' : cId === 'solo' ? 'Guitarra Solo (20 Aulas)' : 'Conservatório Geral (18 Aulas)'}
            </button>
          ))}
        </div>

        {/* Filtro por Módulo */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#7B1E2B] dark:text-[#FF6B81]" />
          <span className="font-bold text-[#666672] dark:text-[#B8B3C0]">Módulo:</span>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] text-xs text-[#1F1F24] dark:text-[#F8F7F4] focus:outline-hidden"
          >
            <option value="all">Todos os Módulos</option>
            {modules.map((m, idx) => (
              <option key={idx} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Destaque do Ponto Crítico de Abandono */}
      {criticalDrop && (
        <div className="p-4 rounded-2xl bg-[#FFF0F2] dark:bg-[#3A141A] border border-[#B52A3A]/30 flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-[#B52A3A] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-[#7B1E2B] dark:text-[#FF8095] block mb-0.5">
              Alerta de Retenção Pedagógica na Etapa
            </span>
            <p className="text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
              Na etapa <strong>"{criticalDrop.lessonTitle}"</strong>, <strong>{criticalDrop.dropRate}%</strong> dos alunos que iniciaram ainda não concluíram ({criticalDrop.droppedCount} alunos parados). Recomendado reforçar exercícios de transição de andamento nesta fase.
            </p>
          </div>
        </div>
      )}

      {/* Tabela do Funil de Etapas */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#1F1F24] dark:text-[#F8F7F4]">
              Funil de Conclusão e Retenção por Aula
            </h3>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] mt-0.5">
              Clique nos títulos das colunas para ordenar por taxa de conclusão ou taxa de interrupção.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E6E1] dark:border-[#422933] text-[#666672] dark:text-[#B8B3C0]">
                <th
                  onClick={() => handleToggleSort('lessonTitle')}
                  className="pb-3 font-bold cursor-pointer hover:text-[#7B1E2B]"
                >
                  <div className="flex items-center gap-1">
                    <span>Aula / Etapa</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('startedCount')}
                  className="pb-3 font-bold text-center cursor-pointer hover:text-[#7B1E2B]"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Iniciaram</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('completedCount')}
                  className="pb-3 font-bold text-center cursor-pointer hover:text-[#7B1E2B]"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Concluíram</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('completionRate')}
                  className="pb-3 font-bold text-right cursor-pointer hover:text-[#7B1E2B]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Taxa Conclusão</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('dropRate')}
                  className="pb-3 font-bold text-right cursor-pointer hover:text-[#7B1E2B]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Taxa Abandono</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6E1] dark:divide-[#422933]">
              {sortedRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#F8F7F4] dark:hover:bg-[#251820] transition-colors">
                  <td className="py-3">
                    <span className="font-bold text-[#1F1F24] dark:text-[#F8F7F4] block truncate max-w-xs">
                      {row.lessonTitle}
                    </span>
                    <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0]">
                      {row.moduleTitle}
                    </span>
                  </td>
                  <td className="py-3 font-mono-code text-center font-bold text-[#1F1F24] dark:text-[#F8F7F4]">
                    {row.startedCount}
                  </td>
                  <td className="py-3 font-mono-code text-center font-bold text-[#16A34A]">
                    {row.completedCount}
                  </td>
                  <td className="py-3 text-right">
                    <span className="font-mono-code font-bold text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                      {row.completionRate}%
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`font-mono-code font-bold text-xs px-2 py-0.5 rounded-md border ${
                        row.dropRate >= 30
                          ? 'bg-[#FAF1F2] text-[#7B1E2B] border-[#E8D3D6] dark:bg-[#381A25] dark:text-[#FF6B81]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {row.dropRate}%
                    </span>
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

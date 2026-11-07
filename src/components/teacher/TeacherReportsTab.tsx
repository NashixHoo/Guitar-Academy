import React, { useState } from 'react';
import { TeacherService } from '../../services/teacherService';
import { 
  StudentAnalyticsSummary, 
  AnalyticsTableRow, 
  PedagogicalBottleneck,
  ClassGroup 
} from '../../types/teacher';
import { Download, FileSpreadsheet, CheckCircle2, ShieldCheck } from 'lucide-react';

interface TeacherReportsTabProps {
  students: StudentAnalyticsSummary[];
  tableRows: AnalyticsTableRow[];
  bottlenecks: PedagogicalBottleneck[];
  activeClass?: ClassGroup;
}

export const TeacherReportsTab: React.FC<TeacherReportsTabProps> = ({
  students,
  tableRows,
  bottlenecks,
  activeClass,
}) => {
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const className = activeClass ? activeClass.name.replace(/\s+/g, '_') : 'Turma_Geral';

  const triggerExport = (type: 'class_overview' | 'students' | 'activities' | 'bottlenecks') => {
    let dataset: any[] = [];
    if (type === 'students') dataset = students;
    else if (type === 'activities') dataset = tableRows;
    else if (type === 'bottlenecks') dataset = bottlenecks;
    else dataset = students;

    const res = TeacherService.exportReportToCsv(type, dataset, className);
    if (res.success) {
      setDownloadMessage(`Relatório "${res.filename}" gerado e baixado com sucesso!`);
      setTimeout(() => setDownloadMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#7B1E2B] dark:text-[#FF6B81]" />
          <h2 className="font-display font-black text-lg text-[#1F1F24] dark:text-[#F8F7F4]">
            Exportação de Relatórios Pedagógicos em CSV
          </h2>
        </div>
        <p className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
          Gere planilhas em formato CSV para análise acadêmica no Excel, Google Planilhas ou sistemas de gestão escolar. Apenas os alunos formalmente matriculados na sua turma são incluídos.
        </p>
      </div>

      {downloadMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{downloadMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Relatório 1: Progresso Individual dos Alunos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4] block">
              1. Desempenho Individual de Alunos
            </span>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
              Exporta a lista completa com nome, e-mail, tempo total praticado, tempo medido interativo vs manual, aulas feitas, andamento máximo (BPM) e contagem de habilidades avaliadas.
            </p>
          </div>
          <button
            onClick={() => triggerExport('students')}
            className="w-full py-2.5 rounded-xl luxury-btn-primary text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar CSV de Alunos ({students.length})</span>
          </button>
        </div>

        {/* Relatório 2: Distribuição de Atividades */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4] block">
              2. Distribuição de Atividades & Categorias
            </span>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
              Exporta a matriz de ocorrências por categoria (prática instrumental, teoria, acordes, técnica), quantidade de alunos envolvidos, percentual real e denominadores matemáticos.
            </p>
          </div>
          <button
            onClick={() => triggerExport('activities')}
            className="w-full py-2.5 rounded-xl bg-white dark:bg-[#251820] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#D9D9D9] dark:border-[#422933] text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar CSV de Categorias</span>
          </button>
        </div>

        {/* Relatório 3: Diagnóstico de Gargalos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4] block">
              3. Diagnóstico de Gargalos & Abandono
            </span>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
              Exporta os pontos críticos identificados, com fatos mensurados nos dados, hipóteses pedagógicas e sugestões de intervenção recomendadas.
            </p>
          </div>
          <button
            onClick={() => triggerExport('bottlenecks')}
            className="w-full py-2.5 rounded-xl bg-white dark:bg-[#251820] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#D9D9D9] dark:border-[#422933] text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar CSV de Gargalos</span>
          </button>
        </div>

        {/* Relatório 4: Panorama Geral da Turma */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4] block">
              4. Panorama Geral da Turma
            </span>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
              Exporta síntese executiva contendo total de alunos ativos, turmas gerenciadas e métricas globais de conclusão consolidada.
            </p>
          </div>
          <button
            onClick={() => triggerExport('class_overview')}
            className="w-full py-2.5 rounded-xl bg-white dark:bg-[#251820] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#D9D9D9] dark:border-[#422933] text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Síntese da Turma</span>
          </button>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] text-xs text-[#666672] dark:text-[#B8B3C0] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
        <span>Garantia de Privacidade: Os relatórios gerados respeitam as vinculações de turma e nunca exportam alunos de outras instituições.</span>
      </div>
    </div>
  );
};

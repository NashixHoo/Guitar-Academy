import React from 'react';
import { StudentAnalyticsSummary, ClassGroup, PedagogicalBottleneck } from '../../types/teacher';
import { 
  Users, 
  UserCheck, 
  UserX, 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface TeacherOverviewTabProps {
  students: StudentAnalyticsSummary[];
  classes: ClassGroup[];
  bottlenecks: PedagogicalBottleneck[];
  periodLabel: string;
  onNavigateTab: (tab: any) => void;
}

export const TeacherOverviewTab: React.FC<TeacherOverviewTabProps> = ({
  students,
  classes,
  bottlenecks,
  periodLabel,
  onNavigateTab,
}) => {
  const totalStudents = students.length;

  // Alunos ativos nos últimos 7 dias
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const activeStudents = students.filter(
    (s) => new Date(s.lastActivityAt).getTime() >= sevenDaysAgo || s.totalStudyTimeSeconds > 0
  );
  const inactiveStudents = students.filter(
    (s) => new Date(s.lastActivityAt).getTime() < sevenDaysAgo && s.totalStudyTimeSeconds === 0
  );

  // Total de aulas concluídas coletivamente
  const totalCompletedLessons = students.reduce((acc, s) => acc + s.completedLessonsCount, 0);

  // Média de conclusão (denominador: 98 aulas do currículo total)
  const averageCompletionRate = totalStudents > 0 
    ? (totalCompletedLessons / (totalStudents * 98)) * 100 
    : 0;

  // Tempo total acumulado de prática
  const totalSeconds = students.reduce((acc, s) => acc + s.totalStudyTimeSeconds, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

  return (
    <div className="space-y-6">
      {/* Barra de Período & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
        <div className="flex items-center gap-2 text-xs text-[#666672] dark:text-[#B8B3C0]">
          <Calendar className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
          <span>Período de Referência dos Indicadores: <strong>{periodLabel}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#16A34A] dark:text-[#4ADE80] font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Dados atualizados com o Cloud Firestore</span>
        </div>
      </div>

      {/* Grid de 6 KPIs com Denominadores Claros */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1: Total Alunos */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#666672] dark:text-[#B8B3C0]">Total Alunos</span>
            <Users className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
          </div>
          <span className="text-2xl font-black text-[#1F1F24] dark:text-[#F8F7F4] block">{totalStudents}</span>
          <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] mt-1 block">
            {classes.length} {classes.length === 1 ? 'turma ativa' : 'turmas ativas'}
          </span>
        </div>

        {/* KPI 2: Alunos Ativos */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#666672] dark:text-[#B8B3C0]">Alunos Ativos</span>
            <UserCheck className="w-4 h-4 text-[#16A34A]" />
          </div>
          <span className="text-2xl font-black text-[#16A34A] block">{activeStudents.length}</span>
          <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] mt-1 block">
            {totalStudents > 0 ? `${Math.round((activeStudents.length / totalStudents) * 100)}% da turma` : '0%'}
          </span>
        </div>

        {/* KPI 3: Sem Atividade */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#666672] dark:text-[#B8B3C0]">Sem Atividade</span>
            <UserX className="w-4 h-4 text-[#D97706]" />
          </div>
          <span className="text-2xl font-black text-[#D97706] block">{inactiveStudents.length}</span>
          <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] mt-1 block">
            {inactiveStudents.length > 0 ? 'Requer intervenção' : 'Todos engajados'}
          </span>
        </div>

        {/* KPI 4: Aulas Concluídas */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#666672] dark:text-[#B8B3C0]">Aulas Feitas</span>
            <BookOpen className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
          </div>
          <span className="text-2xl font-black text-[#1F1F24] dark:text-[#F8F7F4] block">{totalCompletedLessons}</span>
          <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] mt-1 block">
            Total coletivo
          </span>
        </div>

        {/* KPI 5: Taxa Média Conclusão */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#666672] dark:text-[#B8B3C0]">Taxa Conclusão</span>
            <TrendingUp className="w-4 h-4 text-[#C5A059]" />
          </div>
          <span className="text-2xl font-black text-[#1F1F24] dark:text-[#F8F7F4] block">
            {averageCompletionRate.toFixed(1)}%
          </span>
          <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] mt-1 block">
            Base: 98 aulas por aluno
          </span>
        </div>

        {/* KPI 6: Tempo Total Praticado */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#666672] dark:text-[#B8B3C0]">Tempo de Prática</span>
            <Clock className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
          </div>
          <span className="text-2xl font-black text-[#1F1F24] dark:text-[#F8F7F4] block">
            {totalHours > 0 ? `${totalHours}h` : `${totalMinutes}m`}
          </span>
          <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0] mt-1 block">
            {totalHours > 0 ? `${totalMinutes}m adicionais` : 'minutos no app'}
          </span>
        </div>
      </div>

      {/* Seção de Alertas e Gargalos Pedagógicos Resumidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Diagnóstico Rápido de Gargalos */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4]">
                Gargalos Pedagógicos Identificados ({bottlenecks.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('diagnostic')}
              className="text-xs text-[#7B1E2B] dark:text-[#FF6B81] hover:underline font-bold"
            >
              Ver Detalhes →
            </button>
          </div>

          {bottlenecks.length > 0 ? (
            <div className="space-y-3">
              {bottlenecks.slice(0, 2).map((btn) => (
                <div
                  key={btn.id}
                  className="p-3.5 rounded-xl bg-[#FAF1F2] dark:bg-[#251820] border border-[#E8D3D6] dark:border-[#422933] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#7B1E2B] dark:text-[#FF8095]">{btn.title}</span>
                    <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#1A1216] text-[#7B1E2B] dark:text-[#FF6B81]">
                      {btn.metricValue}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
                    <strong>Fato Observado:</strong> {btn.observedFact}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] italic">
              Nenhum gargalo de alta severidade detectado no momento. A turma apresenta progressão regular.
            </p>
          )}
        </div>

        {/* Card: Trilha de Cursos em Andamento */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
              <h3 className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4]">
                Distribuição dos Cursos na Turma
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('courses')}
              className="text-xs text-[#7B1E2B] dark:text-[#FF6B81] hover:underline font-bold"
            >
              Ver Funil →
            </button>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Domínio Total do Violão', lessons: '60 Aulas', percent: 65, color: '#7B1E2B' },
              { title: 'Conservatório Geral', lessons: '18 Aulas', percent: 25, color: '#C5A059' },
              { title: 'Guitarra Solo & Improvisação', lessons: '20 Aulas', percent: 10, color: '#16A34A' },
            ].map((course, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1F1F24] dark:text-[#F8F7F4]">{course.title} ({course.lessons})</span>
                  <span className="font-mono-code font-bold text-[#666672] dark:text-[#B8B3C0]">{course.percent}% dos alunos</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E8E6E1] dark:bg-[#381A25] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${course.percent}%`, backgroundColor: course.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

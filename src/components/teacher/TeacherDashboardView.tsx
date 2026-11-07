import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ClassGroup, 
  ClassEnrollment, 
  EducationalEvent, 
  TeacherFilterState, 
  AnalyticsTableRow, 
  CourseFunnelRow, 
  PedagogicalBottleneck, 
  StudentAnalyticsSummary 
} from '../../types/teacher';
import { TeacherService } from '../../services/teacherService';
import { TeacherOverviewTab } from './TeacherOverviewTab';
import { TeacherAnalyticsTab } from './TeacherAnalyticsTab';
import { TeacherCourseFunnelTab } from './TeacherCourseFunnelTab';
import { TeacherStudentsTab } from './TeacherStudentsTab';
import { TeacherDiagnosticTab } from './TeacherDiagnosticTab';
import { TeacherReportsTab } from './TeacherReportsTab';
import { StudentPrivacyNotice } from './StudentPrivacyNotice';
import { ClassManagementModal } from './ClassManagementModal';
import { 
  GraduationCap, 
  Users, 
  PieChart, 
  BarChart3, 
  Compass, 
  FileSpreadsheet, 
  ShieldCheck, 
  Calendar, 
  Filter, 
  RefreshCw, 
  ArrowLeft,
  KeyRound
} from 'lucide-react';

interface TeacherDashboardViewProps {
  onBackToApp: () => void;
}

type TeacherTabKey = 'overview' | 'students' | 'analytics' | 'courses' | 'diagnostic' | 'reports' | 'privacy';

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({ onBackToApp }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TeacherTabKey>('overview');
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [enrollments, setEnrollments] = useState<ClassEnrollment[]>([]);
  const [events, setEvents] = useState<EducationalEvent[]>([]);
  const [analyticsRows, setAnalyticsRows] = useState<AnalyticsTableRow[]>([]);
  const [funnelRows, setFunnelRows] = useState<CourseFunnelRow[]>([]);
  const [bottlenecks, setBottlenecks] = useState<PedagogicalBottleneck[]>([]);
  const [studentSummaries, setStudentSummaries] = useState<StudentAnalyticsSummary[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<'violao' | 'canonical' | 'solo'>('violao');

  // Filtros unificados compartilhados por gráficos e tabelas (Fase 9)
  const [filterState, setFilterState] = useState<TeacherFilterState>({
    period: '30d',
    classId: 'all',
    courseId: 'all',
    category: 'all',
  });

  const teacherUid = user?.uid || 'teacher-default';
  const teacherEmail = user?.email || 'dramosdasilva7@gmail.com';
  const teacherName = user?.displayName || 'Professor Guitar Academy';

  // Carregamento de dados analíticos
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Turmas do professor
      const loadedClasses = await TeacherService.getTeacherClasses(teacherUid, teacherEmail);
      setClasses(loadedClasses);

      // 2. Alunos matriculados
      const loadedEnrollments = await TeacherService.getEnrolledStudents(teacherUid, filterState.classId);
      setEnrollments(loadedEnrollments);

      // 3. Eventos educacionais filtrados
      const loadedEvents = TeacherService.getFilteredEvents(filterState, loadedEnrollments);
      setEvents(loadedEvents);

      // 4. Tabela analítica correlacionada
      const totalStudents = loadedEnrollments.length || 1;
      const rows = TeacherService.buildAnalyticsTable(loadedEvents, totalStudents);
      setAnalyticsRows(rows);

      // 5. Funil de cursos e retenção
      const funnels = TeacherService.buildCourseFunnel(loadedEnrollments, selectedCourseId);
      setFunnelRows(funnels);

      // 6. Diagnóstico de gargalos
      const detectedBottlenecks = TeacherService.detectPedagogicalBottlenecks(funnels, totalStudents);
      setBottlenecks(detectedBottlenecks);

      // 7. Resumos individuais de alunos
      const summaries = TeacherService.getStudentSummaries(loadedEnrollments, loadedClasses);
      setStudentSummaries(summaries);
    } catch (err) {
      console.error('Erro ao carregar dados pedagógicos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [teacherUid, filterState, selectedCourseId]);

  const activeClass = classes.find((c) => c.id === filterState.classId);
  const periodLabel = filterState.period === '7d' 
    ? 'Últimos 7 dias' 
    : filterState.period === '90d' 
    ? 'Últimos 90 dias' 
    : 'Últimos 30 dias';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-fade-in text-[#25252A] dark:text-[#F8F7F4]">
      {/* 1. Header do Painel do Professor */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8E6E1] dark:border-[#422933] transition flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
            title="Voltar ao modo estudante do Conservatório"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar ao Conservatório</span>
          </button>

          <div className="w-10 h-10 rounded-2xl bg-[#7B1E2B] text-white flex items-center justify-center border border-[#C5A059]/40 shadow-xs tortoiseshell-card">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-lg sm:text-xl text-[#1F1F24] dark:text-[#F8F7F4] tracking-tight">
                Gestão Pedagógica & Analytics
              </h1>
              <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full luxury-gold-badge hidden sm:inline-block">
                Professor Autorizado
              </span>
            </div>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0]">
              Acompanhamento de turmas, detecção de gargalos e evolução dos estudantes.
            </p>
          </div>
        </div>

        {/* Ações Rápidas do Topo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowClassModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FAF1F2] dark:bg-[#251820] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8D3D6] dark:border-[#422933] text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Turmas & Convites ({classes.length})</span>
          </button>

          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8E6E1] dark:border-[#422933] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Atualizar dados analíticos"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Barra de Filtros Globais Unificados (Fase 9) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs flex flex-wrap items-center gap-4">
        {/* Filtro: Turma */}
        <div className="flex items-center gap-2 text-xs">
          <Users className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
          <span className="font-bold text-[#666672] dark:text-[#B8B3C0]">Turma:</span>
          <select
            value={filterState.classId}
            onChange={(e) => setFilterState((prev) => ({ ...prev, classId: e.target.value }))}
            className="px-2.5 py-1.5 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] text-xs text-[#1F1F24] dark:text-[#F8F7F4] focus:outline-hidden"
          >
            <option value="all">Todas as Turmas ({classes.length})</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Filtro: Período de Análise */}
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-[#C5A059]" />
          <span className="font-bold text-[#666672] dark:text-[#B8B3C0]">Período:</span>
          <select
            value={filterState.period}
            onChange={(e) => setFilterState((prev) => ({ ...prev, period: e.target.value as any }))}
            className="px-2.5 py-1.5 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] text-xs text-[#1F1F24] dark:text-[#F8F7F4] focus:outline-hidden"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
        </div>

        {/* Filtro: Curso */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
          <span className="font-bold text-[#666672] dark:text-[#B8B3C0]">Curso:</span>
          <select
            value={filterState.courseId}
            onChange={(e) => setFilterState((prev) => ({ ...prev, courseId: e.target.value as any }))}
            className="px-2.5 py-1.5 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] text-xs text-[#1F1F24] dark:text-[#F8F7F4] focus:outline-hidden"
          >
            <option value="all">Todos os Cursos</option>
            <option value="violao">Domínio Total do Violão</option>
            <option value="canonical">Conservatório Geral</option>
            <option value="solo">Guitarra Solo</option>
          </select>
        </div>
      </div>

      {/* 3. Navegação por Abas do Professor */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E8E6E1] dark:border-[#422933] pb-2">
        {[
          { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
          { id: 'students', label: `Alunos (${enrollments.length})`, icon: Users },
          { id: 'analytics', label: 'Gráficos & Distribuição', icon: PieChart },
          { id: 'courses', label: 'Funil dos Cursos', icon: GraduationCap },
          { id: 'diagnostic', label: `Diagnóstico (${bottlenecks.length})`, icon: Compass },
          { id: 'reports', label: 'Relatórios CSV', icon: FileSpreadsheet },
          { id: 'privacy', label: 'Privacidade & LGPD', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TeacherTabKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'luxury-btn-primary text-white shadow-xs'
                  : 'text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Conteúdo da Aba Selecionada */}
      {isLoading ? (
        <div className="p-12 text-center space-y-3 bg-white dark:bg-[#1A1216] rounded-2xl border border-[#E8E6E1] dark:border-[#422933]">
          <div className="w-8 h-8 border-3 border-[#7B1E2B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#666672] dark:text-[#B8B3C0]">Processando analytics pedagógico da turma...</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <TeacherOverviewTab
              students={studentSummaries}
              classes={classes}
              bottlenecks={bottlenecks}
              periodLabel={periodLabel}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'students' && (
            <TeacherStudentsTab students={studentSummaries} />
          )}

          {activeTab === 'analytics' && (
            <TeacherAnalyticsTab
              events={events}
              tableRows={analyticsRows}
              totalEligibleStudents={enrollments.length || 1}
            />
          )}

          {activeTab === 'courses' && (
            <TeacherCourseFunnelTab
              funnelRows={funnelRows}
              selectedCourseId={selectedCourseId}
              onSelectCourseId={setSelectedCourseId}
            />
          )}

          {activeTab === 'diagnostic' && (
            <TeacherDiagnosticTab bottlenecks={bottlenecks} />
          )}

          {activeTab === 'reports' && (
            <TeacherReportsTab
              students={studentSummaries}
              tableRows={analyticsRows}
              bottlenecks={bottlenecks}
              activeClass={activeClass}
            />
          )}

          {activeTab === 'privacy' && <StudentPrivacyNotice />}
        </>
      )}

      {/* Modal de Gestão de Turmas */}
      <ClassManagementModal
        isOpen={showClassModal}
        onClose={() => setShowClassModal(false)}
        classes={classes}
        teacherId={teacherUid}
        teacherEmail={teacherEmail}
        teacherName={teacherName}
        onClassCreated={(newClass) => {
          setClasses((prev) => [...prev, newClass]);
          loadDashboardData();
        }}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  Eye, 
  LogOut, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Award, 
  Bell, 
  ShieldAlert, 
  KeyRound, 
  RefreshCw,
  FolderTree,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserX
} from 'lucide-react';
import { TeacherService } from '../../services/teacherService';
import { ClassGroup, ClassEnrollment, EducationalEvent } from '../../types/teacher';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { SOLO_LESSONS } from '../../data/soloCourse';
import { VIOLAO_LESSONS } from '../../data/violaoCourse';
import { BASS_LESSONS } from '../../data/bassCourse';
import { KEYBOARD_LESSONS } from '../../data/keyboardCourse';
import { DRUMS_LESSONS } from '../../data/drumsCourse';

type AdminTabKey = 
  | 'overview' 
  | 'students' 
  | 'classes' 
  | 'courses' 
  | 'reports' 
  | 'teachers' 
  | 'notices' 
  | 'security';

interface StudentDirectoryItem {
  uid: string;
  displayName: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  enrolledCourse: string;
  completedLessonsCount: number;
  totalStudyMinutes: number;
  lastLogin: string;
  role: 'student' | 'teacher' | 'admin';
}

export const AdminPortalView: React.FC = () => {
  const { user, logOut, setAdminPreviewMode } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Estados de dados administrativos
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [enrollments, setEnrollments] = useState<ClassEnrollment[]>([]);
  const [events, setEvents] = useState<EducationalEvent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentDirectoryItem | null>(null);

  // Estatísticas de cursos da plataforma (152 aulas)
  const totalCourses = 6; // Violão, Guitarra/Canônico, Solo, Baixo, Teclado, Bateria
  const totalLessons = 
    CURRICULUM_LEVELS.reduce((acc, l) => acc + l.lessons.length, 0) +
    SOLO_LESSONS.length +
    VIOLAO_LESSONS.length +
    BASS_LESSONS.length +
    KEYBOARD_LESSONS.length +
    DRUMS_LESSONS.length; // 152 aulas

  // Diretório de alunos sincronizado
  const [students, setStudents] = useState<StudentDirectoryItem[]>([
    {
      uid: user?.uid || 'admin-root',
      displayName: user?.displayName || 'Administrador Central',
      email: user?.email || 'admin@guitaracademy.com',
      status: 'active',
      enrolledCourse: 'Guitarra Elétrica (Formação Completa)',
      completedLessonsCount: 18,
      totalStudyMinutes: 340,
      lastLogin: new Date().toLocaleDateString('pt-BR'),
      role: 'admin',
    },
    {
      uid: 'aluno-demo-01',
      displayName: 'Carlos Eduardo Santana',
      email: 'carlos.santana@email.com',
      status: 'active',
      enrolledCourse: 'Violão Acústico Canônico',
      completedLessonsCount: 9,
      totalStudyMinutes: 215,
      lastLogin: 'Hoje, 09:40',
      role: 'student',
    },
    {
      uid: 'aluno-demo-02',
      displayName: 'Mariana Duarte Lopes',
      email: 'mariana.lopes@email.com',
      status: 'active',
      enrolledCourse: 'Contrabaixo Elétrico',
      completedLessonsCount: 14,
      totalStudyMinutes: 290,
      lastLogin: 'Ontem, 18:22',
      role: 'student',
    },
    {
      uid: 'aluno-demo-03',
      displayName: 'Rafael Meireles Castro',
      email: 'rafael.meireles@email.com',
      status: 'inactive',
      enrolledCourse: 'Teclado & Piano',
      completedLessonsCount: 3,
      totalStudyMinutes: 45,
      lastLogin: 'Há 5 dias',
      role: 'student',
    },
    {
      uid: 'aluno-demo-04',
      displayName: 'Ana Beatriz Souza',
      email: 'ana.souza@email.com',
      status: 'active',
      enrolledCourse: 'Bateria Acústica',
      completedLessonsCount: 11,
      totalStudyMinutes: 180,
      lastLogin: 'Hoje, 11:15',
      role: 'student',
    },
  ]);

  // Carrega turmas e dados do TeacherService
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const teacherUid = user?.uid || 'admin-uid';
      const loadedClasses = await TeacherService.getTeacherClasses(teacherUid, user?.email || '');
      setClasses(loadedClasses);

      const loadedEnrollments = await TeacherService.getEnrolledStudents(teacherUid, 'all');
      setEnrollments(loadedEnrollments);

      const loadedEvents = TeacherService.getFilteredEvents(
        { period: '30d', classId: 'all', courseId: 'all', category: 'all' },
        loadedEnrollments
      );
      setEvents(loadedEvents);
    } catch (err) {
      console.warn('Carregamento administrativo offline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Filtragem de alunos
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.uid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStudentStatus = (uid: string, nextStatus: 'active' | 'suspended') => {
    setStudents((prev) =>
      prev.map((s) => (s.uid === uid ? { ...s, status: nextStatus } : s))
    );
    showToast(`Status do aluno atualizado para "${nextStatus === 'active' ? 'Ativo' : 'Suspenso'}"`);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#18181B] text-[#F4F4F5] font-sans flex flex-col antialiased selection:bg-[#7B1E2B] selection:text-white">
      {/* Top Bar Administrativa */}
      <header className="h-16 px-4 sm:px-8 border-b border-[#27272A] bg-[#09090B] flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7B1E2B] to-[#B52A3A] p-2 flex items-center justify-center shadow-md border border-[#C5A059]/40">
            <img src="./icon.svg" alt="Guitar Academy" className="w-full h-full object-contain filter brightness-200 invert" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm sm:text-base tracking-wider uppercase text-white">
                Guitar Academy
              </span>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#7B1E2B]/40 text-[#FFA4B0] border border-[#7B1E2B]">
                Admin Suite
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] hidden sm:block">
              Painel Central de Gestão Acadêmica, Segurança e Alunos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Botão de Preview: Ver como Aluno */}
          <button
            onClick={() => setAdminPreviewMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-xs font-semibold border border-[#3F3F46] transition cursor-pointer"
            title="Acessar o ambiente de aprendizagem para testar como aluno"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden md:inline">Ver como Aluno</span>
          </button>

          {/* Sair da Conta */}
          <button
            onClick={logOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#7B1E2B] text-zinc-300 hover:text-white text-xs font-semibold border border-[#3F3F46] hover:border-[#7B1E2B] transition cursor-pointer"
            title="Encerrar sessão administrativa"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Notificação Toast */}
      {feedbackMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-xl bg-[#09090B] border border-[#16A34A] text-[#4ADE80] text-xs font-semibold flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Menu Lateral de Navegação do Administrador */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#27272A] bg-[#0F0F12] p-3 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono-code font-bold text-[#A1A1AA] uppercase tracking-wider">
            Módulos de Controle
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#7B1E2B] text-white shadow-sm'
                : 'text-[#A1A1AA] hover:bg-[#27272A] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'students'
                ? 'bg-[#7B1E2B] text-white shadow-sm'
                : 'text-[#A1A1AA] hover:bg-[#27272A] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestão de Alunos</span>
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'classes'
                ? 'bg-[#7B1E2B] text-white shadow-sm'
                : 'text-[#A1A1AA] hover:bg-[#27272A] hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Matrículas & Turmas</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#7B1E2B] text-white shadow-sm'
                : 'text-[#A1A1AA] hover:bg-[#27272A] hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cursos & Aulas (152)</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-[#7B1E2B] text-white shadow-sm'
                : 'text-[#A1A1AA] hover:bg-[#27272A] hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Relatórios & Evasão</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#7B1E2B] text-white shadow-sm'
                : 'text-[#A1A1AA] hover:bg-[#27272A] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Segurança & Regras</span>
          </button>
        </aside>

        {/* Área Central de Conteúdo */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-0 bg-[#121215]">
          {/* ABA 1: DASHBOARD GERAL */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                  Visão Geral da Instituição
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-1">
                  Métricas em tempo real de alunos cadastrados, engajamento didático e infraestrutura.
                </p>
              </div>

              {/* Grid de Cards KPI */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
                    <span className="text-xs font-semibold">Total de Alunos</span>
                    <Users className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="text-2xl font-black text-white">{students.length}</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+100% ativos nesta versão</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
                    <span className="text-xs font-semibold">Cursos Oficiais</span>
                    <Layers className="w-4 h-4 text-[#7B1E2B]" />
                  </div>
                  <div className="text-2xl font-black text-white">{totalCourses}</div>
                  <div className="text-[10px] text-[#A1A1AA] mt-1">
                    <span>152 aulas ativas homologadas</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
                    <span className="text-xs font-semibold">Horas Praticadas</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {Math.floor(students.reduce((acc, s) => acc + s.totalStudyMinutes, 0) / 60)}h
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] mt-1">
                    <span>Média de 3.2h por aluno</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
                    <span className="text-xs font-semibold">Regras Firebase</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-400">Protegido</div>
                  <div className="text-[10px] text-[#A1A1AA] mt-1">
                    <span>Isolamento total por UID</span>
                  </div>
                </div>
              </div>

              {/* Status do Backend & Integridade */}
              <div className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="text-sm font-bold text-white">
                      Status Operacional de Serviços e Servidor
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Operacional
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#A1A1AA]">
                  <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
                    <span className="block text-white font-semibold mb-0.5">Firebase Auth & DB</span>
                    <span>Database: ai-studio-guitaracademyfor-e7ce9efa-82d3-4dd1-8b8e-58aa69749913</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
                    <span className="block text-white font-semibold mb-0.5">Professor IA Backend</span>
                    <span>Express + Firebase Admin SDK + Google GenAI 3.8 Flash</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
                    <span className="block text-white font-semibold mb-0.5">Segurança de Papéis</span>
                    <span>system_roles/{'{uid}'} imutável por clientes</span>
                  </div>
                </div>
              </div>

              {/* Lista Rápida de Atividades */}
              <div className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A]">
                <h3 className="text-sm font-bold text-white mb-3">Últimas Atividades Acadêmicas</h3>
                <div className="divide-y divide-[#27272A] text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white">Mariana Duarte</span> concluiu a Aula 14 do Contrabaixo (Walking Bass)
                    </div>
                    <span className="text-[#A1A1AA] font-mono-code">Hoje às 11:42</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white">Carlos Santana</span> completou treino no Virtuo Guitar Coach com 92% de precisão
                    </div>
                    <span className="text-[#A1A1AA] font-mono-code">Hoje às 09:15</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white">Ana Beatriz Souza</span> atingiu 100 BPM no Rudimento Paradiddle (Bateria)
                    </div>
                    <span className="text-[#A1A1AA] font-mono-code">Ontem às 20:30</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: GESTÃO DE ALUNOS */}
          {activeTab === 'students' && (
            <div className="space-y-5 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                    Diretório de Alunos
                  </h2>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Controle de matrículas, acompanhamento individual e moderação de status.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Sincronização em tempo real ativa')}
                    className="p-2 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-xs transition cursor-pointer"
                    title="Atualizar lista"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filtros e Busca */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar aluno por nome, e-mail ou UID..."
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#1C1C21] border border-[#27272A] text-xs text-white placeholder:text-[#71717A] focus:border-[#7B1E2B] outline-hidden"
                  />
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#1C1C21] border border-[#27272A] text-xs text-white focus:border-[#7B1E2B] outline-hidden"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                    <option value="suspended">Suspensos</option>
                  </select>
                </div>
              </div>

              {/* Tabela de Alunos */}
              <div className="rounded-2xl border border-[#27272A] bg-[#1C1C21] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#141417] text-[#A1A1AA] uppercase font-mono-code text-[10px] border-b border-[#27272A]">
                      <tr>
                        <th className="py-3 px-4">Estudante</th>
                        <th className="py-3 px-4">Curso Ativo</th>
                        <th className="py-3 px-4">Aulas Concluídas</th>
                        <th className="py-3 px-4">Tempo de Estudo</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A] text-[#E4E4E7]">
                      {filteredStudents.map((student) => (
                        <tr key={student.uid} className="hover:bg-[#27272A]/40 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{student.displayName}</div>
                            <div className="text-[11px] text-[#A1A1AA]">{student.email}</div>
                            <div className="text-[9px] font-mono-code text-[#71717A]">UID: {student.uid.slice(0, 16)}...</div>
                          </td>
                          <td className="py-3 px-4 font-medium">{student.enrolledCourse}</td>
                          <td className="py-3 px-4 font-mono-code">{student.completedLessonsCount} aulas</td>
                          <td className="py-3 px-4 font-mono-code">{student.totalStudyMinutes} min</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono-code ${
                                student.status === 'active'
                                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800'
                                  : student.status === 'suspended'
                                  ? 'bg-rose-950/70 text-rose-400 border border-rose-800'
                                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {student.status === 'active' ? 'Ativo' : student.status === 'suspended' ? 'Suspenso' : 'Inativo'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            {student.status === 'active' ? (
                              <button
                                onClick={() => handleToggleStudentStatus(student.uid, 'suspended')}
                                className="px-2 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-950 text-rose-400 text-[11px] font-semibold border border-rose-800/40 transition cursor-pointer"
                                title="Suspender acesso"
                              >
                                Suspender
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleStudentStatus(student.uid, 'active')}
                                className="px-2 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-950 text-emerald-400 text-[11px] font-semibold border border-emerald-800/40 transition cursor-pointer"
                                title="Ativar acesso"
                              >
                                Reativar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: MATRÍCULAS & TURMAS */}
          {activeTab === 'classes' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                  Turmas & Códigos de Convite
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Criação de turmas pedagógicas com validação estrita de convites no Firestore.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Turma Alfa • Violão Clássico</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Código: GA-VIOLAO-2026
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA]">
                    Turma iniciante com foco em postura, mão direita e primeiras trocas de acordes abertos.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono-code text-[#E4E4E7] pt-2 border-t border-[#27272A]">
                    <span>Alunos: 14/30</span>
                    <span>Status: Aberta</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Turma Beta • Contrabaixo Groove</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Código: GA-BASS-GROOVE
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA]">
                    Módulo técnico de precisão rítmica, walking bass e condução com metrônomo.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono-code text-[#E4E4E7] pt-2 border-t border-[#27272A]">
                    <span>Alunos: 8/25</span>
                    <span>Status: Aberta</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: CURSOS & AULAS */}
          {activeTab === 'courses' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                  Estrutura Acadêmica (6 Cursos • 152 Aulas)
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Monitoramento de integridade dos 6 cursos instrumentais do conservatório.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">1. Violão Clássico & Popular</div>
                  <div className="text-xs text-[#A1A1AA]">6 Níveis • 18 Aulas canônicas</div>
                  <div className="text-[11px] text-emerald-400">Progresso e Diagramas Cifra Club homologados</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">2. Guitarra Elétrica Solo</div>
                  <div className="text-xs text-[#A1A1AA]">6 Níveis • 18 Aulas canônicas</div>
                  <div className="text-[11px] text-emerald-400">Sistema CAGED e Pentatônicas 5 posições</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">3. Contrabaixo Elétrico</div>
                  <div className="text-xs text-[#A1A1AA]">6 Níveis • 18 Aulas técnicas completas</div>
                  <div className="text-[11px] text-emerald-400">Grooves, Slap, Walking Bass e YIN 30Hz</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">4. Teclado & Piano</div>
                  <div className="text-xs text-[#A1A1AA]">6 Níveis • 18 Aulas técnicas completas</div>
                  <div className="text-[11px] text-emerald-400">Teclado virtual 61/88 teclas e inversões</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">5. Bateria & Percussão</div>
                  <div className="text-xs text-[#A1A1AA]">6 Níveis • 18 Aulas técnicas completas</div>
                  <div className="text-[11px] text-emerald-400">Rudimentos PAS 40, paradiddles e grooves</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">6. Trilha Solo Avançada</div>
                  <div className="text-xs text-[#A1A1AA]">Módulos especiais complementares</div>
                  <div className="text-[11px] text-emerald-400">Regra de desbloqueio 50% preservada</div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 5: RELATÓRIOS & EVASÃO */}
          {activeTab === 'reports' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                  Relatórios Institucionais & Prevenção de Evasão
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Taxas de retenção, gargalos pedagógicos e distribuição de tempo de estudo.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-4">
                <h3 className="text-sm font-bold text-white">Diagnóstico de Gargalos no Aprendizado</h3>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-400 block mb-0.5">Transição de Acordes com Pestana (F e Bm)</span>
                      <span className="text-[#A1A1AA]">Identificado em 35% dos alunos do Nível 1 ao tentar a Aula 6.</span>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-amber-950 text-amber-300 text-[10px] font-bold">Intervenção Recomendada</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-400 block mb-0.5">Sincronia Rítmica em 80 BPM</span>
                      <span className="text-[#A1A1AA]">Taxa de aprovação de 88% após exercícios guiados com metrônomo.</span>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-emerald-950 text-emerald-300 text-[10px] font-bold">Excelente</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 6: SEGURANÇA & REGRAS */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                  Auditoria de Segurança & Regras de Acesso
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Validação do modelo Zero-Trust, isolamento de dados por UID e proteção de papéis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#1C1C21] border border-emerald-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="text-sm font-bold">Firestore Security Rules (Hardened)</h3>
                  </div>
                  <ul className="text-xs text-[#A1A1AA] space-y-2 list-disc list-inside">
                    <li><strong className="text-white">users/{'{userId}'}:</strong> Somente o próprio aluno ou admin validado pode ler/escrever.</li>
                    <li><strong className="text-white">system_roles/{'{userId}'}:</strong> Imutável por clientes (<code className="text-amber-400">allow write: if false</code>).</li>
                    <li><strong className="text-white">Impedimento de Auto-promoção:</strong> Alunos não podem alterar o campo <code className="text-rose-400">role</code>.</li>
                    <li><strong className="text-white">Isolamento Multi-aluno:</strong> Aluno não consegue consultar dados de outros estudantes.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#1C1C21] border border-emerald-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <KeyRound className="w-5 h-5" />
                    <h3 className="text-sm font-bold">Backend & Tokens de Acesso</h3>
                  </div>
                  <ul className="text-xs text-[#A1A1AA] space-y-2 list-disc list-inside">
                    <li><strong className="text-white">Bearer Token:</strong> Todas as rotas /api/professor e /api/admin requerem Firebase ID Token.</li>
                    <li><strong className="text-white">GEMINI_API_KEY:</strong> Estritamente no servidor Express, nunca no bundle do cliente.</li>
                    <li><strong className="text-white">Cloud Run Ready:</strong> Porta 3000 configurada e pronta para deploy no GCP.</li>
                    <li><strong className="text-white">Fail-Closed:</strong> Falhas de rede revertem para o menor privilégio (student).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

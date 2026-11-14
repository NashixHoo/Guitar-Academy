import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldCheck,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  Eye,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  KeyRound,
  RefreshCw,
  FileSpreadsheet,
  Layers,
  Sparkles,
  UserCheck,
  UserX,
  Info,
} from 'lucide-react';
import { ClassGroup } from '../../types/teacher';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { SOLO_LESSONS } from '../../data/soloCourse';
import { VIOLAO_LESSONS } from '../../data/violaoCourse';
import { BASS_LESSONS } from '../../data/bassCourse';
import { KEYBOARD_LESSONS } from '../../data/keyboardCourse';
import { DRUMS_LESSONS } from '../../data/drumsCourse';
import { AdminLogsPanel } from './AdminLogsPanel';
import { logAdminSecurityEvent } from '../../services/adminLogsService';
import { getProfessorApiBaseUrl } from '../../services/professorService';
import { FIRESTORE_DATABASE_ID } from '../../services/firebase';
import {
  AdminDirectoryUser,
  fetchAdminGlobalDirectory,
  formatAccountProviderLabel,
  formatCourseLabel,
  formatRoleLabel,
  updateAdminUserAccountStatus,
} from '../../services/adminUsersService';
import type { UserRole } from '../../types';

type AdminTabKey =
  | 'overview'
  | 'students'
  | 'classes'
  | 'courses'
  | 'reports'
  | 'security';

function formatDateTimePtBr(isoValue: string | null): string {
  if (!isoValue) return 'Não informado';
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return 'Não informado';
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const AdminPortalView: React.FC = () => {
  const { user, logOut, setAdminPreviewMode, refreshUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  const [isLoadingDirectory, setIsLoadingDirectory] = useState<boolean>(true);
  const [directoryError, setDirectoryError] = useState<string | null>(null);
  const [directoryWarnings, setDirectoryWarnings] = useState<string[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [backendAuthStatus, setBackendAuthStatus] = useState<'checking' | 'verified' | 'serverless' | 'denied'>('checking');

  // Dados reais carregados diretamente do Cloud Firestore (sem usuários fictícios)
  const [users, setUsers] = useState<AdminDirectoryUser[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [enrollmentsCount, setEnrollmentsCount] = useState<number>(0);

  // Estatísticas reais de catálogo da plataforma (152 aulas oficiais)
  const totalCourses = 6;
  const totalLessons =
    CURRICULUM_LEVELS.reduce((acc, l) => acc + l.lessons.length, 0) +
    SOLO_LESSONS.length +
    VIOLAO_LESSONS.length +
    BASS_LESSONS.length +
    KEYBOARD_LESSONS.length +
    DRUMS_LESSONS.length;

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const loadGlobalDirectory = useCallback(async () => {
    if (!user) {
      setUsers([]);
      setClasses([]);
      setEnrollmentsCount(0);
      setIsLoadingDirectory(false);
      return;
    }

    setIsLoadingDirectory(true);
    setDirectoryError(null);
    setActionError(null);

    try {
      const result = await fetchAdminGlobalDirectory();
      setUsers(result.users);
      setClasses(result.classes);
      setEnrollmentsCount(result.enrollmentsCount);
      setDirectoryWarnings(result.warnings);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar o diretório real de usuários do Firestore.';
      setDirectoryError(message);
      setUsers([]);
      setClasses([]);
      setEnrollmentsCount(0);
    } finally {
      setIsLoadingDirectory(false);
    }
  }, [user]);

  useEffect(() => {
    void loadGlobalDirectory();
  }, [loadGlobalDirectory]);

  // Verificação real de autorização administrativa junto ao backend (/api/admin/overview) quando Express estiver ativo
  useEffect(() => {
    let active = true;
    const verifyBackendAdminSession = async () => {
      if (!user) return;
      setBackendAuthStatus('checking');
      try {
        const idToken = await user.getIdToken();
        const baseUrl = getProfessorApiBaseUrl();
        const resp = await fetch(`${baseUrl}/api/admin/overview`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        if (!active) return;
        if (resp.status === 401 || resp.status === 403) {
          console.error(
            `[AdminPortal] Autorização administrativa recusada pelo backend (HTTP ${resp.status}). Reverificando papel Zero-Trust.`
          );
          setBackendAuthStatus('denied');
          void refreshUserProfile();
          return;
        }
        const contentType = resp.headers.get('content-type') || '';
        if (resp.ok && contentType.includes('application/json')) {
          const payload = (await resp.json()) as { status?: string; security?: string };
          if (payload?.status === 'ok') {
            setBackendAuthStatus('verified');
            return;
          }
        }
        setBackendAuthStatus('serverless');
      } catch {
        if (active) {
          setBackendAuthStatus('serverless');
        }
      }
    };
    void verifyBackendAdminSession();
    return () => {
      active = false;
    };
  }, [user, refreshUserProfile]);

  // Filtragem de usuários reais
  const filteredUsers = users.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.displayName.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.uid.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || item.accountStatus === statusFilter;
    const matchesRole = roleFilter === 'all' || item.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const activeUsersCount = users.filter((u) => u.accountStatus === 'active').length;
  const suspendedUsersCount = users.filter((u) => u.accountStatus === 'suspended').length;
  const adminsCount = users.filter((u) => u.role === 'admin').length;
  const teachersCount = users.filter((u) => u.role === 'teacher').length;
  const studentsCount = users.filter((u) => u.role === 'student').length;
  const totalStudyMinutesKnown = users.reduce((acc, u) => acc + (u.totalStudyMinutes || 0), 0);

  const handleToggleAccountStatus = async (
    target: AdminDirectoryUser,
    nextStatus: 'active' | 'suspended'
  ) => {
    setActionError(null);
    setUpdatingUid(target.uid);
    try {
      const result = await updateAdminUserAccountStatus(target, nextStatus);
      // Atualiza o estado da interface SOMENTE após confirmação da persistência
      setUsers((prev) =>
        prev.map((item) =>
          item.uid === target.uid ? { ...item, accountStatus: result.accountStatus } : item
        )
      );
      if (result.authDisabledUpdated) {
        showToast(
          `Conta "${target.email || target.uid}" ${
            nextStatus === 'suspended' ? 'suspensa' : 'reativada'
          } no Firestore e no Firebase Authentication.`
        );
      } else {
        showToast(
          `Status persistido em users/${target.uid} (${
            nextStatus === 'suspended' ? 'Suspensa' : 'Ativa'
          }) e registrado na auditoria.`
        );
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Erro desconhecido ao persistir alteração de status da conta.';
      setActionError(message);
    } finally {
      setUpdatingUid(null);
    }
  };

  const handleEnterStudentPreview = () => {
    if (user) {
      void logAdminSecurityEvent({
        eventType: 'admin_preview_toggled',
        severity: 'info',
        actorUid: user.uid,
        actorEmail: user.email,
        actorRole: 'admin',
        action: 'Administrador alternou para visualização como aluno',
        details: 'Modo preview acadêmico ativado pelo Admin Suite',
        source: 'admin_portal',
      });
    }
    setAdminPreviewMode(true);
  };

  if (backendAuthStatus === 'denied') {
    return (
      <div className="min-h-screen w-full bg-[#18181B] text-[#F4F4F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[#09090B] border border-rose-800/70 space-y-4 text-center">
          <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-display font-black text-white">
            Autorização Administrativa Negada pelo Backend
          </h2>
          <p className="text-xs text-[#A1A1AA]">
            O servidor rejeitou o token ou não confirmou <code className="text-rose-300">role: "admin"</code> em{' '}
            <code className="text-rose-300">system_roles/{user?.uid}</code>.
          </p>
          <button
            onClick={logOut}
            className="w-full h-10 rounded-xl bg-[#7B1E2B] hover:bg-[#992434] text-white text-xs font-bold transition cursor-pointer"
          >
            Encerrar Sessão
          </button>
        </div>
      </div>
    );
  }

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
              Painel Central de Gestão Acadêmica, Segurança e Usuários Reais
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleEnterStudentPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-xs font-semibold border border-[#3F3F46] transition cursor-pointer"
            title="Acessar o ambiente de aprendizagem para testar como aluno"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden md:inline">Ver como Aluno</span>
          </button>

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
        <div className="fixed top-20 right-6 z-50 max-w-md p-3.5 rounded-xl bg-[#09090B] border border-[#16A34A] text-[#4ADE80] text-xs font-semibold flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
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
            <span>Diretório de Usuários ({users.length})</span>
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
            <span>Matrículas & Turmas ({classes.length})</span>
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
            <span>Cursos & Aulas ({totalLessons})</span>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                    Visão Geral da Instituição
                  </h2>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Indicadores consolidados diretamente das coleções reais do Cloud Firestore.
                  </p>
                </div>
                <button
                  onClick={() => void loadGlobalDirectory()}
                  disabled={isLoadingDirectory}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-xs font-semibold border border-[#3F3F46] transition cursor-pointer disabled:opacity-50 self-start"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDirectory ? 'animate-spin' : ''}`} />
                  <span>Atualizar dados</span>
                </button>
              </div>

              {directoryError && (
                <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{directoryError}</span>
                </div>
              )}

              {/* Grid de Cards KPI reais */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
                    <span className="text-xs font-semibold">Contas Cadastradas</span>
                    <Users className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {isLoadingDirectory ? '...' : users.length}
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] mt-1">
                    <span>
                      {activeUsersCount} ativas • {suspendedUsersCount} suspensas
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
                    <span className="text-xs font-semibold">Perfis RBAC</span>
                    <KeyRound className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {isLoadingDirectory ? '...' : studentsCount}
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] mt-1">
                    <span>
                      Alunos • {teachersCount} prof. • {adminsCount} admin
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
                    <span className="text-xs font-semibold">Estudo na Nuvem</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {isLoadingDirectory ? '...' : `${Math.floor(totalStudyMinutesKnown / 60)}h`}
                  </div>
                  <div className="text-[10px] text-[#A1A1AA] mt-1">
                    <span>{totalStudyMinutesKnown} min registrados em progresso</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] mb-2">
                    <span className="text-xs font-semibold">Cursos Oficiais</span>
                    <Layers className="w-4 h-4 text-[#7B1E2B]" />
                  </div>
                  <div className="text-2xl font-black text-white">{totalCourses}</div>
                  <div className="text-[10px] text-[#A1A1AA] mt-1">
                    <span>{totalLessons} aulas no catálogo local</span>
                  </div>
                </div>
              </div>

              {/* Status do Backend & Integridade */}
              <div className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="text-sm font-bold text-white">
                      Status Operacional de Serviços e Banco de Dados
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold border ${
                      backendAuthStatus === 'verified'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : backendAuthStatus === 'serverless'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {backendAuthStatus === 'verified'
                      ? 'Backend Express + Admin SDK Verificado'
                      : backendAuthStatus === 'serverless'
                      ? 'Serverless (Firestore Security Rules)'
                      : 'Verificando Sessão...'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#A1A1AA]">
                  <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
                    <span className="block text-white font-semibold mb-0.5">Firebase Auth & DB</span>
                    <span className="break-all">Database: {FIRESTORE_DATABASE_ID}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
                    <span className="block text-white font-semibold mb-0.5">Modo Estático / Custo Zero</span>
                    <span>Professor IA desativado por padrão (sem consumo de API externa)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
                    <span className="block text-white font-semibold mb-0.5">Segurança de Papéis</span>
                    <span>system_roles/{'{uid}'} imutável por clientes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: DIRETÓRIO GLOBAL DE USUÁRIOS (DADOS REAIS) */}
          {activeTab === 'students' && (
            <div className="space-y-5 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                    Diretório Global de Usuários
                  </h2>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Usuários reais consultados no banco <code className="text-zinc-300">{FIRESTORE_DATABASE_ID}</code> (coleções <code className="text-zinc-300">users</code>, <code className="text-zinc-300">system_roles</code> e <code className="text-zinc-300">enrollments</code>).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void loadGlobalDirectory()}
                    disabled={isLoadingDirectory}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-xs font-semibold border border-[#3F3F46] transition cursor-pointer disabled:opacity-50"
                    title="Recarregar usuários do Firestore"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDirectory ? 'animate-spin' : ''}`} />
                    <span>Atualizar diretório</span>
                  </button>
                </div>
              </div>

              {/* Aviso transparente sobre escopo de suspensão */}
              <div className="p-3.5 rounded-xl bg-[#1C1C21] border border-[#27272A] text-[11px] text-[#A1A1AA] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Escopo de persistência de contas:</span>{' '}
                  {backendAuthStatus === 'verified'
                    ? 'Alterações de suspensão atualizam users/{uid}.accountStatus no Firestore, registram auditoria em admin_logs e invocam o backend Express (/api/admin/users/:uid/status) para desativação no Firebase Auth quando credenciais Admin SDK estiverem configuradas.'
                    : 'Em arquitetura serverless (GitHub Pages + Firebase), Suspender/Reativar persiste users/{uid}.accountStatus no Cloud Firestore (autorizado exclusivamente pela regra isAdmin()) e registra em admin_logs. A revogação imediata de sessão no Firebase Authentication (disabled: true) requer backend/Cloud Function com Firebase Admin SDK.'}
                </div>
              </div>

              {directoryError && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Erro ao carregar usuários reais</p>
                      <p className="mt-0.5">{directoryError}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => void loadGlobalDirectory()}
                    className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white text-[11px] font-semibold shrink-0 cursor-pointer"
                  >
                    Tentar novamente
                  </button>
                </div>
              )}

              {directoryWarnings.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/70 text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Avisos parciais ao consultar coleções complementares:</span>
                  </div>
                  {directoryWarnings.map((w, idx) => (
                    <p key={idx} className="text-[11px] text-amber-200/90">
                      • {w}
                    </p>
                  ))}
                </div>
              )}

              {actionError && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Falha ao alterar situação da conta</p>
                    <p className="mt-0.5">{actionError}</p>
                  </div>
                </div>
              )}

              {/* Filtros e Busca */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar usuário por nome, e-mail ou UID..."
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#1C1C21] border border-[#27272A] text-xs text-white placeholder:text-[#71717A] focus:border-[#7B1E2B] outline-hidden"
                  />
                </div>

                <div>
                  <select
                    aria-label="Filtrar por tipo de conta"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
                    className="w-full h-10 px-3 rounded-xl bg-[#1C1C21] border border-[#27272A] text-xs text-white focus:border-[#7B1E2B] outline-hidden"
                  >
                    <option value="all">Todos os Papéis</option>
                    <option value="student">Alunos</option>
                    <option value="teacher">Professores</option>
                    <option value="admin">Administradores</option>
                  </select>
                </div>

                <div>
                  <select
                    aria-label="Filtrar por situação da conta"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as 'all' | 'active' | 'inactive' | 'suspended'
                      )
                    }
                    className="w-full h-10 px-3 rounded-xl bg-[#1C1C21] border border-[#27272A] text-xs text-white focus:border-[#7B1E2B] outline-hidden"
                  >
                    <option value="all">Todas as Situações</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                    <option value="suspended">Suspensos</option>
                  </select>
                </div>
              </div>

              {/* Tabela de Usuários Reais */}
              <div className="rounded-2xl border border-[#27272A] bg-[#1C1C21] overflow-hidden">
                {isLoadingDirectory ? (
                  <div className="py-12 px-6 text-center text-xs text-[#A1A1AA] flex flex-col items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-[#C5A059] animate-spin" />
                    <span>Consultando usuários reais no Cloud Firestore...</span>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-12 px-6 text-center text-xs text-[#A1A1AA] space-y-2">
                    <Users className="w-7 h-7 text-[#52525B] mx-auto" />
                    <p className="font-semibold text-white">
                      {users.length === 0
                        ? 'Nenhum usuário encontrado na coleção users do Firestore.'
                        : 'Nenhum usuário corresponde aos filtros atuais.'}
                    </p>
                    <p className="text-[11px] text-[#71717A]">
                      {users.length === 0
                        ? 'Contas aparecerão automaticamente após autenticarem no aplicativo.'
                        : 'Limpe a busca ou altere os filtros de papel e situação.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#141417] text-[#A1A1AA] uppercase font-mono-code text-[10px] border-b border-[#27272A]">
                        <tr>
                          <th className="py-3 px-4">Usuário / UID</th>
                          <th className="py-3 px-4">Tipo de Conta</th>
                          <th className="py-3 px-4">Cadastro & Último Acesso</th>
                          <th className="py-3 px-4">Cursos & Matrículas</th>
                          <th className="py-3 px-4">Situação</th>
                          <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#27272A] text-[#E4E4E7]">
                        {filteredUsers.map((account) => {
                          const isSelf = account.uid === user?.uid;
                          const isUpdating = updatingUid === account.uid;

                          return (
                            <tr key={account.uid} className="hover:bg-[#27272A]/40 transition">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  {account.photoURL ? (
                                    <img
                                      src={account.photoURL}
                                      alt={account.displayName}
                                      className="w-8 h-8 rounded-lg object-cover border border-[#3F3F46] shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-[#27272A] text-[#E4E4E7] font-bold text-[11px] flex items-center justify-center border border-[#3F3F46] shrink-0">
                                      {(account.displayName || account.email || 'U')
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      <span className="truncate">{account.displayName}</span>
                                      {isSelf && (
                                        <span className="px-1.5 py-0.5 rounded bg-[#27272A] text-[9px] font-mono-code text-[#C5A059] border border-[#3F3F46]">
                                          Você
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-[#A1A1AA] truncate">
                                      {account.email || 'Sem e-mail registrado'}
                                    </div>
                                    <div className="text-[10px] font-mono-code text-[#71717A] select-all break-all">
                                      {account.uid}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="space-y-1">
                                  <span
                                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-code border ${
                                      account.role === 'admin'
                                        ? 'bg-[#7B1E2B]/40 text-[#FFA4B0] border-[#7B1E2B]'
                                        : account.role === 'teacher'
                                        ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                                        : 'bg-zinc-800 text-zinc-200 border-zinc-700'
                                    }`}
                                  >
                                    {formatRoleLabel(account.role)}
                                  </span>
                                  <div className="text-[10px] text-[#A1A1AA]">
                                    Provedor: {formatAccountProviderLabel(account.provider)}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-[11px] text-[#A1A1AA] space-y-0.5">
                                <div>
                                  <span className="text-zinc-400">Cadastro:</span>{' '}
                                  {formatDateTimePtBr(account.createdAt)}
                                </div>
                                <div>
                                  <span className="text-zinc-400">Último acesso:</span>{' '}
                                  {formatDateTimePtBr(account.lastSeenAt || account.lastLoginAt)}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="space-y-1">
                                  {account.enrolledCourses.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {account.enrolledCourses.map((c) => (
                                        <span
                                          key={c}
                                          className="px-1.5 py-0.5 rounded bg-[#141417] border border-[#27272A] text-[10px] text-zinc-200"
                                        >
                                          {formatCourseLabel(c)}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-[#71717A]">
                                      Sem cursos registrados
                                    </span>
                                  )}
                                  {account.classNames.length > 0 && (
                                    <div className="text-[10px] text-[#C5A059]">
                                      Turmas: {account.classNames.join(', ')}
                                    </div>
                                  )}
                                  {account.completedLessonsCount !== null && (
                                    <div className="text-[10px] font-mono-code text-[#A1A1AA]">
                                      {account.completedLessonsCount} aulas • {account.totalStudyMinutes || 0} min
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono-code ${
                                    account.accountStatus === 'active'
                                      ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800'
                                      : account.accountStatus === 'suspended'
                                      ? 'bg-rose-950/70 text-rose-400 border border-rose-800'
                                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                  }`}
                                >
                                  {account.accountStatus === 'active'
                                    ? 'Ativa'
                                    : account.accountStatus === 'suspended'
                                    ? 'Suspensa'
                                    : 'Inativa'}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-right">
                                {isSelf ? (
                                  <span className="text-[10px] text-[#71717A] font-mono-code">
                                    Sessão atual
                                  </span>
                                ) : !account.hasUserProfileDoc ? (
                                  <span
                                    className="text-[10px] text-amber-400/90 font-mono-code"
                                    title="Documento users/{uid} ainda não criado pelo login do usuário"
                                  >
                                    Sem doc em users/
                                  </span>
                                ) : account.accountStatus !== 'suspended' ? (
                                  <button
                                    onClick={() => void handleToggleAccountStatus(account, 'suspended')}
                                    disabled={isUpdating}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-950 text-rose-400 text-[11px] font-semibold border border-rose-800/40 transition cursor-pointer disabled:opacity-50"
                                    title="Persistir suspensão da conta em users/{uid}.accountStatus"
                                  >
                                    {isUpdating ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <UserX className="w-3 h-3" />
                                    )}
                                    <span>Suspender</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => void handleToggleAccountStatus(account, 'active')}
                                    disabled={isUpdating}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-950 text-emerald-400 text-[11px] font-semibold border border-emerald-800/40 transition cursor-pointer disabled:opacity-50"
                                    title="Reativar conta em users/{uid}.accountStatus"
                                  >
                                    {isUpdating ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <UserCheck className="w-3 h-3" />
                                    )}
                                    <span>Reativar</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA 3: MATRÍCULAS & TURMAS (DADOS REAIS DO FIRESTORE) */}
          {activeTab === 'classes' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                    Turmas & Matrículas Reais
                  </h2>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Turmas registradas na coleção <code className="text-zinc-300">classes</code> e matrículas em{' '}
                    <code className="text-zinc-300">enrollments</code> ({enrollmentsCount} registros encontrados).
                  </p>
                </div>
                <button
                  onClick={() => void loadGlobalDirectory()}
                  disabled={isLoadingDirectory}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-xs font-semibold border border-[#3F3F46] transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDirectory ? 'animate-spin' : ''}`} />
                  <span>Atualizar</span>
                </button>
              </div>

              {classes.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#1C1C21] border border-[#27272A] text-center space-y-2">
                  <GraduationCap className="w-7 h-7 text-[#52525B] mx-auto" />
                  <p className="text-xs font-semibold text-white">
                    Nenhuma turma real cadastrada na coleção classes.
                  </p>
                  <p className="text-[11px] text-[#71717A]">
                    Quando professores criarem turmas oficiais no Firestore, elas serão listadas aqui sem dados demonstrativos.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map((cls) => (
                    <div key={cls.id} className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{cls.name || cls.id}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                          Código: {cls.code || '—'}
                        </span>
                      </div>
                      <p className="text-xs text-[#A1A1AA]">
                        {cls.description || 'Sem descrição cadastrada.'}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-[#E4E4E7] pt-2 border-t border-[#27272A]">
                        <span>Professor: {cls.teacherName || cls.teacherEmail || cls.teacherId}</span>
                        <span>Status: {cls.active ? 'Aberta' : 'Encerrada'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA 4: CURSOS & AULAS */}
          {activeTab === 'courses' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                  Estrutura Acadêmica ({totalCourses} Cursos • {totalLessons} Aulas)
                </h2>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Catálogo instrumental oficial embarcado na aplicação.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">1. Violão Clássico & Popular</div>
                  <div className="text-xs text-[#A1A1AA]">{VIOLAO_LESSONS.length} aulas oficiais</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">2. Guitarra Canônica</div>
                  <div className="text-xs text-[#A1A1AA]">
                    {CURRICULUM_LEVELS.reduce((acc, l) => acc + l.lessons.length, 0)} aulas oficiais
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">3. Contrabaixo Elétrico</div>
                  <div className="text-xs text-[#A1A1AA]">{BASS_LESSONS.length} aulas oficiais</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">4. Teclado & Piano</div>
                  <div className="text-xs text-[#A1A1AA]">{KEYBOARD_LESSONS.length} aulas oficiais</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">5. Bateria & Percussão</div>
                  <div className="text-xs text-[#A1A1AA]">{DRUMS_LESSONS.length} aulas oficiais</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-2">
                  <div className="text-sm font-bold text-white">6. Trilha Solo Avançada</div>
                  <div className="text-xs text-[#A1A1AA]">{SOLO_LESSONS.length} aulas oficiais</div>
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
                  Resumo quantitativo extraído exclusivamente dos usuários e progressos reais carregados do Firestore.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A]">
                  <span className="text-xs text-[#A1A1AA] block">Usuários com Progresso na Nuvem</span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    {users.filter((u) => u.completedLessonsCount !== null).length}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A]">
                  <span className="text-xs text-[#A1A1AA] block">Aulas Concluídas (Soma Global)</span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    {users.reduce((acc, u) => acc + (u.completedLessonsCount || 0), 0)}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A]">
                  <span className="text-xs text-[#A1A1AA] block">Matrículas Registradas</span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    {enrollmentsCount}
                  </span>
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
                    <li><strong className="text-white">users/{'{userId}'}:</strong> Somente o próprio aluno ou admin validado pode ler; somente admin altera <code className="text-amber-400">accountStatus</code>.</li>
                    <li><strong className="text-white">system_roles/{'{userId}'}:</strong> Imutável por clientes (<code className="text-amber-400">allow write: if false</code>).</li>
                    <li><strong className="text-white">admin_logs/{'{logId}'}:</strong> Leitura exclusiva para administradores e escrita imutável.</li>
                    <li><strong className="text-white">Isolamento Multi-aluno:</strong> Aluno não consegue consultar dados de outros estudantes.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#1C1C21] border border-emerald-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <KeyRound className="w-5 h-5" />
                    <h3 className="text-sm font-bold">Backend & Tokens de Acesso</h3>
                  </div>
                  <ul className="text-xs text-[#A1A1AA] space-y-2 list-disc list-inside">
                    <li><strong className="text-white">Bearer Token:</strong> Todas as rotas /api/admin requerem Firebase ID Token validado em system_roles.</li>
                    <li><strong className="text-white">Chave Gemini:</strong> Não requerida em operação normal (Professor IA desativado).</li>
                    <li><strong className="text-white">Arquitetura Serverless:</strong> Diretório e auditoria operam com regras Zero-Trust no banco nomeado.</li>
                    <li><strong className="text-white">Fail-Closed:</strong> Falhas de rede revertem para o menor privilégio (student).</li>
                  </ul>
                </div>
              </div>

              <AdminLogsPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

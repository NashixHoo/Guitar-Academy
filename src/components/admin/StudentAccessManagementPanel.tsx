import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Compass,
  Clock,
  KeyRound,
  Layers,
  Lock,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Unlock,
  XCircle,
} from 'lucide-react';
import type { AdminDirectoryUser } from '../../services/adminUsersService';
import type { OfficialCourseId } from '../../academia/progress/unlockGate';
import {
  ACADEMIC_CATALOG_COURSE_LIST,
  ACADEMIC_CATALOG_COURSES,
  ACADEMIC_CATALOG_INSTRUMENTS,
  getCatalogCourse,
  getCatalogLesson,
  getCatalogModule,
} from '../../services/academicCatalog';
import {
  AdminStudentAccessOverview,
  createAdminAccessGrant,
  fetchAdminStudentAccessOverview,
  updateAdminAccessGrantStatus,
  updateAdminStudentPlacement,
} from '../../services/accessGrantsService';
import { evaluateGrantStatus } from '../../services/accessAuthorizationEngine';
import type {
  AccessGrantScopeType,
  AccessGrantType,
  CourseAccessGrant,
} from '../../types/accessControl';

interface StudentAccessManagementPanelProps {
  users: AdminDirectoryUser[];
  initialSelectedUid?: string | null;
  onSelectStudentUid?: (uid: string) => void;
  onNotify?: (message: string) => void;
}

const SCOPE_LABELS: Record<AccessGrantScopeType, string> = {
  course: 'Curso completo',
  instrument: 'Instrumento inteiro',
  module: 'Módulo específico',
  lesson: 'Aula específica',
  lesson_range: 'Intervalo de aulas',
};

const GRANT_TYPE_LABELS: Record<AccessGrantType, string> = {
  permanent: 'Gratuito permanente',
  temporary: 'Gratuito por período determinado',
  trial: 'Acesso experimental',
  special: 'Liberação administrativa especial',
};

function formatDateBr(iso?: string | null): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function describeGrantTarget(grant: CourseAccessGrant): string {
  if (grant.scopeType === 'instrument' && grant.instrumentId) {
    const inst = ACADEMIC_CATALOG_INSTRUMENTS.find((i) => i.id === grant.instrumentId);
    return `Instrumento: ${inst?.name || grant.instrumentId}`;
  }
  const course = grant.courseId ? getCatalogCourse(grant.courseId) : null;
  const courseLabel = course?.title || grant.courseId || 'Curso';

  if (grant.scopeType === 'course') {
    return `Curso completo: ${courseLabel}`;
  }
  if (grant.scopeType === 'module' && grant.courseId && grant.moduleId) {
    const mod = getCatalogModule(grant.courseId, grant.moduleId);
    return `${courseLabel} • ${mod?.title || grant.moduleId}`;
  }
  if (grant.scopeType === 'lesson' && grant.courseId && grant.lessonId) {
    const lesson = getCatalogLesson(grant.lessonId, grant.courseId);
    return `${courseLabel} • ${lesson?.title || grant.lessonId}`;
  }
  if (grant.scopeType === 'lesson_range' && grant.courseId) {
    const start = grant.rangeStartLessonId
      ? getCatalogLesson(grant.rangeStartLessonId, grant.courseId)
      : null;
    const end = grant.rangeEndLessonId
      ? getCatalogLesson(grant.rangeEndLessonId, grant.courseId)
      : null;
    return `${courseLabel} • Intervalo: ${start?.title || grant.rangeStartLessonId} → ${end?.title || grant.rangeEndLessonId} (${grant.lessonIds?.length || 0} aulas)`;
  }
  return courseLabel;
}

export const StudentAccessManagementPanel: React.FC<StudentAccessManagementPanelProps> = ({
  users,
  initialSelectedUid,
  onSelectStudentUid,
  onNotify,
}) => {
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedUid, setSelectedUid] = useState<string>(initialSelectedUid || '');

  const [overview, setOverview] = useState<AdminStudentAccessOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmittingGrant, setIsSubmittingGrant] = useState(false);
  const [isSubmittingPlacement, setIsSubmittingPlacement] = useState(false);
  const [updatingGrantId, setUpdatingGrantId] = useState<string | null>(null);

  // Confirmações inline (sem window.confirm/window.alert)
  const [pendingGrantAction, setPendingGrantAction] = useState<{
    grant: CourseAccessGrant;
    nextStatus: 'active' | 'suspended' | 'revoked';
  } | null>(null);
  const [pendingGrantActionReason, setPendingGrantActionReason] = useState('');
  const [confirmClearPlacement, setConfirmClearPlacement] = useState(false);

  // Formulário de Liberação Gratuita
  const [scopeType, setScopeType] = useState<AccessGrantScopeType>('course');
  const [grantType, setGrantType] = useState<AccessGrantType>('permanent');
  const [grantInstrumentId, setGrantInstrumentId] = useState<string>('guitarra');
  const [grantCourseId, setGrantCourseId] = useState<OfficialCourseId>('solo');
  const [grantModuleId, setGrantModuleId] = useState<string>('');
  const [grantLessonId, setGrantLessonId] = useState<string>('');
  const [rangeStartLessonId, setRangeStartLessonId] = useState<string>('');
  const [rangeEndLessonId, setRangeEndLessonId] = useState<string>('');
  const [startsAtInput, setStartsAtInput] = useState<string>('');
  const [expiresAtInput, setExpiresAtInput] = useState<string>('');
  const [grantReason, setGrantReason] = useState<string>('');

  // Formulário de Direcionamento Inicial
  const [placeCourseId, setPlaceCourseId] = useState<OfficialCourseId>('violao');
  const [placeModuleId, setPlaceModuleId] = useState<string>('');
  const [placeLessonId, setPlaceLessonId] = useState<string>('');
  const [placeReason, setPlaceReason] = useState<string>('');

  useEffect(() => {
    if (initialSelectedUid && initialSelectedUid !== selectedUid) {
      setSelectedUid(initialSelectedUid);
    } else if (!selectedUid && users.length > 0) {
      const firstStudent = users.find((u) => u.role === 'student') || users[0];
      if (firstStudent) setSelectedUid(firstStudent.uid);
    }
  }, [initialSelectedUid, users, selectedUid]);

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.uid.toLowerCase().includes(q)
    );
  }, [users, studentSearch]);

  const selectedStudent = useMemo(
    () => users.find((u) => u.uid === selectedUid) || null,
    [users, selectedUid]
  );

  // Sincronizar módulos/aulas ao mudar o curso do formulário de liberação
  const grantCourse = useMemo(() => ACADEMIC_CATALOG_COURSES[grantCourseId], [grantCourseId]);
  useEffect(() => {
    const firstMod = grantCourse.modules[0];
    setGrantModuleId(firstMod?.id || '');
    const firstLesson = grantCourse.lessons[0];
    setGrantLessonId(firstLesson?.id || '');
    setRangeStartLessonId(firstLesson?.id || '');
    setRangeEndLessonId(grantCourse.lessons[Math.min(2, grantCourse.lessons.length - 1)]?.id || firstLesson?.id || '');
  }, [grantCourse]);

  // Sincronizar módulo/aula no formulário de direcionamento inicial
  const placeCourse = useMemo(() => ACADEMIC_CATALOG_COURSES[placeCourseId], [placeCourseId]);
  const placeModules = placeCourse.modules;
  const placeLessonsInModule = useMemo(() => {
    const mod = placeModules.find((m) => m.id === placeModuleId) || placeModules[0];
    return mod ? mod.lessons : placeCourse.lessons;
  }, [placeModules, placeModuleId, placeCourse]);

  useEffect(() => {
    const firstMod = placeCourse.modules[0];
    setPlaceModuleId(firstMod?.id || '');
    setPlaceLessonId(firstMod?.lessons[0]?.id || placeCourse.lessons[0]?.id || '');
  }, [placeCourse]);

  useEffect(() => {
    if (!placeLessonsInModule.some((l) => l.id === placeLessonId)) {
      setPlaceLessonId(placeLessonsInModule[0]?.id || '');
    }
  }, [placeLessonsInModule, placeLessonId]);

  const loadOverview = useCallback(async () => {
    if (!selectedUid) {
      setOverview(null);
      return;
    }
    setIsLoading(true);
    setLoadError(null);
    setActionError(null);
    try {
      const data = await fetchAdminStudentAccessOverview(selectedUid);
      setOverview(data);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : 'Não foi possível carregar as permissões do aluno.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedUid]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const handleSelectUid = (uid: string) => {
    setSelectedUid(uid);
    onSelectStudentUid?.(uid);
    setPendingGrantAction(null);
    setConfirmClearPlacement(false);
  };

  const handleSubmitGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUid) return;
    setActionError(null);
    setIsSubmittingGrant(true);
    try {
      const result = await createAdminAccessGrant({
        studentUid: selectedUid,
        scopeType,
        grantType,
        instrumentId: scopeType === 'instrument' ? grantInstrumentId : undefined,
        courseId: scopeType !== 'instrument' ? grantCourseId : undefined,
        moduleId: scopeType === 'module' ? grantModuleId : undefined,
        lessonId: scopeType === 'lesson' ? grantLessonId : undefined,
        rangeStartLessonId: scopeType === 'lesson_range' ? rangeStartLessonId : undefined,
        rangeEndLessonId: scopeType === 'lesson_range' ? rangeEndLessonId : undefined,
        startsAt: startsAtInput ? new Date(startsAtInput).toISOString() : null,
        expiresAt: expiresAtInput ? new Date(expiresAtInput).toISOString() : null,
        reason: grantReason.trim() || null,
      });

      await loadOverview();
      onNotify?.(
        result.idempotent
          ? 'Liberação equivalente já estava ativa para este aluno (idempotência preservada).'
          : `Liberação gratuita (${SCOPE_LABELS[scopeType]}) aplicada com sucesso!`
      );
      if (!result.idempotent) {
        setGrantReason('');
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Erro ao salvar liberação administrativa.'
      );
    } finally {
      setIsSubmittingGrant(false);
    }
  };

  const handleConfirmGrantStatusChange = async () => {
    if (!pendingGrantAction || !selectedUid) return;
    setActionError(null);
    setUpdatingGrantId(pendingGrantAction.grant.id);
    try {
      await updateAdminAccessGrantStatus({
        grantId: pendingGrantAction.grant.id,
        studentUid: selectedUid,
        status: pendingGrantAction.nextStatus,
        reason: pendingGrantActionReason.trim() || null,
      });
      await loadOverview();
      onNotify?.(
        pendingGrantAction.nextStatus === 'active'
          ? 'Concessão reativada com sucesso.'
          : pendingGrantAction.nextStatus === 'suspended'
          ? 'Concessão suspensa com sucesso.'
          : 'Concessão revogada definitivamente.'
      );
      setPendingGrantAction(null);
      setPendingGrantActionReason('');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Falha ao atualizar status da concessão.'
      );
    } finally {
      setUpdatingGrantId(null);
    }
  };

  const handleSubmitPlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUid) return;
    setActionError(null);
    setIsSubmittingPlacement(true);
    try {
      await updateAdminStudentPlacement({
        studentUid: selectedUid,
        mode: 'custom_start',
        courseId: placeCourseId,
        moduleId: placeModuleId,
        lessonId: placeLessonId,
        reason: placeReason.trim() || null,
      });
      await loadOverview();
      onNotify?.('Direcionamento inicial aplicado preservando 100% do progresso anterior do aluno!');
      setPlaceReason('');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Falha ao aplicar direcionamento inicial.'
      );
    } finally {
      setIsSubmittingPlacement(false);
    }
  };

  const handleClearPlacement = async () => {
    if (!selectedUid) return;
    setActionError(null);
    setIsSubmittingPlacement(true);
    try {
      await updateAdminStudentPlacement({
        studentUid: selectedUid,
        mode: 'default_path',
      });
      await loadOverview();
      setConfirmClearPlacement(false);
      onNotify?.('Direcionamento inicial removido. O aluno retornou ao percurso padrão.');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Falha ao remover direcionamento inicial.'
      );
    } finally {
      setIsSubmittingPlacement(false);
    }
  };

  const handleQuickGrantForPlacement = async () => {
    if (!selectedUid) return;
    setActionError(null);
    setIsSubmittingGrant(true);
    try {
      await createAdminAccessGrant({
        studentUid: selectedUid,
        scopeType: 'lesson',
        grantType: 'special',
        courseId: placeCourseId,
        lessonId: placeLessonId,
        reason: 'Liberação vinculada ao Direcionamento Inicial pelo administrador.',
      });
      await loadOverview();
      onNotify?.('Aula inicial liberada para o aluno via Liberação Especial!');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Falha na liberação rápida.');
    } finally {
      setIsSubmittingGrant(false);
    }
  };

  const placementTargetAccessible = useMemo(() => {
    if (!overview) return true;
    return Boolean(overview.snapshot.courses[placeCourseId]?.lessons[placeLessonId]?.allowed);
  }, [overview, placeCourseId, placeLessonId]);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Cabeçalho e Seletor do Aluno */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              Gerenciar Acesso &amp; Percurso do Aluno
            </h2>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Conceda cursos, instrumentos, módulos ou aulas gratuitamente, configure validade e direcione o início sem perder progresso anterior.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadOverview()}
          disabled={isLoading || !selectedUid}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-xs font-semibold border border-[#3F3F46] transition cursor-pointer disabled:opacity-50 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Recarregar acesso</span>
        </button>
      </div>

      {/* Seletor + Busca de Aluno */}
      <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-5 space-y-1">
          <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block">
            Filtrar estudante
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Buscar por nome, e-mail ou UID..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white placeholder-[#71717A] focus:border-[#7B1E2B] outline-hidden"
            />
          </div>
        </div>

        <div className="md:col-span-7 space-y-1">
          <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block">
            Aluno selecionado ({filteredStudents.length})
          </label>
          <select
            value={selectedUid}
            onChange={(e) => handleSelectUid(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white focus:border-[#7B1E2B] outline-hidden"
          >
            {filteredStudents.length === 0 ? (
              <option value="">Nenhum usuário encontrado</option>
            ) : (
              filteredStudents.map((u) => (
                <option key={u.uid} value={u.uid}>
                  {u.displayName} ({u.email || u.uid}) • [{u.role}]
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {(loadError || actionError) && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{actionError || loadError}</span>
        </div>
      )}

      {!selectedUid ? (
        <div className="p-8 rounded-2xl bg-[#1C1C21] border border-[#27272A] text-center text-xs text-[#A1A1AA]">
          Selecione um aluno no diretório para gerenciar liberações e direcionamento curricular.
        </div>
      ) : isLoading && !overview ? (
        <div className="p-10 rounded-2xl bg-[#1C1C21] border border-[#27272A] text-center text-xs text-[#A1A1AA] flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-[#C5A059] animate-spin" />
          <span>Resolvendo motor central de autorização para o aluno...</span>
        </div>
      ) : overview && (
        <>
          {/* Resumo de Identidade & Progresso Preservado */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A] sm:col-span-2">
              <span className="text-[10px] font-mono-code uppercase text-[#C5A059] block">
                Estudante em gestão
              </span>
              <div className="text-sm font-bold text-white mt-0.5 truncate">
                {selectedStudent?.displayName || selectedUid}
              </div>
              <div className="text-[11px] text-[#A1A1AA] truncate">
                {selectedStudent?.email || 'E-mail não informado'} • UID: <span className="font-mono-code">{selectedUid}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#121215] border border-[#27272A] text-zinc-300 font-mono-code">
                  Modo: {overview.mode === 'backend_admin_sdk' ? 'Express Admin SDK' : 'Firestore Rules Zero-Trust'}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#121215] border border-[#27272A] text-emerald-300 font-mono-code">
                  Matrículas em turma: {overview.enrollments.length}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A]">
              <span className="text-[10px] font-mono-code uppercase text-[#A1A1AA] block">
                Progresso Preservado
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {overview.progressSummary.completedLessonsCount} aulas
              </div>
              <div className="text-[11px] text-[#A1A1AA] mt-0.5">
                {Math.round(overview.progressSummary.totalStudyTimeSeconds / 60)} min estudados
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1C1C21] border border-[#27272A]">
              <span className="text-[10px] font-mono-code uppercase text-[#A1A1AA] block">
                Concessões Ativas
              </span>
              <div className="text-2xl font-black text-[#C5A059] mt-1">
                {overview.snapshot.activeGrants.length}
              </div>
              <div className="text-[11px] text-[#A1A1AA] mt-0.5">
                {overview.snapshot.inactiveGrants.length} inativas/expiradas
              </div>
            </div>
          </div>

          {/* Visão Efetiva por Curso (Disponíveis, Liberados Parcial/Total, Bloqueados) */}
          <div className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Acesso Efetivo por Curso (Resolução Central)</span>
                </h3>
                <p className="text-[11px] text-[#A1A1AA]">
                  Consolida curso principal, regra dos 50%, matrículas, compras/assinaturas e concessões administrativas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ACADEMIC_CATALOG_COURSE_LIST.map((course) => {
                const eff = overview.snapshot.courses[course.id];
                const placement = overview.snapshot.activePlacementsByCourse[course.id];

                return (
                  <div
                    key={course.id}
                    className={`p-3.5 rounded-xl border space-y-2 ${
                      eff.fullCourseUnlocked
                        ? 'bg-emerald-950/20 border-emerald-800/50'
                        : eff.hasAnyAccess
                        ? 'bg-amber-950/20 border-amber-700/60'
                        : 'bg-[#141418] border-[#27272A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono-code uppercase text-[#A1A1AA] block">
                          {course.instrumentName}
                        </span>
                        <h4 className="text-xs font-bold text-white leading-snug">{course.title}</h4>
                      </div>
                      {eff.fullCourseUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 shrink-0 inline-flex items-center gap-1">
                          <Unlock className="w-3 h-3" /> Liberado
                        </span>
                      ) : eff.hasAnyAccess ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700 shrink-0 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Parcial ({eff.unlockedLessonIds.length}/{course.totalLessons})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-700 shrink-0 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Bloqueado
                        </span>
                      )}
                    </div>

                    {eff.origins.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {eff.origins.map((orig, idx) => (
                          <span
                            key={`${orig.source}-${orig.grantId || idx}`}
                            className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-zinc-200"
                          >
                            {orig.label}
                            {orig.expiresAt ? ` (até ${formatDateBr(orig.expiresAt)})` : ''}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-[#71717A] leading-relaxed">
                        {eff.lockReason}
                      </p>
                    )}

                    {placement && (
                      <div className="pt-1.5 border-t border-white/5 text-[10px] text-[#C5A059] flex items-center gap-1">
                        <Compass className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          Início direcionado: Mód. {placement.moduleNumber} • {getCatalogLesson(placement.lessonId, course.id)?.title || placement.lessonId}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid 2 Colunas: Liberação Gratuita + Direcionamento Inicial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. CONCEDER LIBERAÇÃO GRATUITA */}
            <form
              onSubmit={handleSubmitGrant}
              className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-4"
            >
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Liberar Acesso Gratuito Individual</span>
                </h3>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Libere curso completo, instrumento inteiro, módulo ou aulas reais para este aluno.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Escopo da liberação
                  </label>
                  <select
                    value={scopeType}
                    onChange={(e) => setScopeType(e.target.value as AccessGrantScopeType)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  >
                    <option value="course">Curso completo</option>
                    <option value="instrument">Instrumento inteiro</option>
                    <option value="module">Módulo específico</option>
                    <option value="lesson">Aula específica</option>
                    <option value="lesson_range">Intervalo de aulas</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Tipo de liberação
                  </label>
                  <select
                    value={grantType}
                    onChange={(e) => setGrantType(e.target.value as AccessGrantType)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  >
                    <option value="permanent">Gratuito permanente</option>
                    <option value="temporary">Gratuito por período determinado</option>
                    <option value="trial">Acesso experimental</option>
                    <option value="special">Liberação administrativa especial</option>
                  </select>
                </div>
              </div>

              {scopeType === 'instrument' ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Instrumento oficial
                  </label>
                  <select
                    value={grantInstrumentId}
                    onChange={(e) => setGrantInstrumentId(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  >
                    {ACADEMIC_CATALOG_INSTRUMENTS.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.courseIds.length}{' '}
                        {inst.courseIds.length === 1 ? 'curso' : 'cursos'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Curso oficial
                  </label>
                  <select
                    value={grantCourseId}
                    onChange={(e) => setGrantCourseId(e.target.value as OfficialCourseId)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  >
                    {ACADEMIC_CATALOG_COURSE_LIST.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.totalModules} mód. • {c.totalLessons} aulas)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {scopeType === 'module' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Módulo específico ({grantCourse.modules.length} disponíveis)
                  </label>
                  <select
                    value={grantModuleId}
                    onChange={(e) => setGrantModuleId(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  >
                    {grantCourse.modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        Módulo {m.moduleNumber} — {m.title} ({m.lessons.length} aulas)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {scopeType === 'lesson' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Aula específica ({grantCourse.lessons.length} disponíveis)
                  </label>
                  <select
                    value={grantLessonId}
                    onChange={(e) => setGrantLessonId(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  >
                    {grantCourse.lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        [Mód. {l.moduleNumber}] {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {scopeType === 'lesson_range' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-300 block">
                      Aula inicial do intervalo
                    </label>
                    <select
                      value={rangeStartLessonId}
                      onChange={(e) => setRangeStartLessonId(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                    >
                      {grantCourse.lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          #{l.orderIndex + 1} — {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-300 block">
                      Aula final do intervalo
                    </label>
                    <select
                      value={rangeEndLessonId}
                      onChange={(e) => setRangeEndLessonId(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                    >
                      {grantCourse.lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          #{l.orderIndex + 1} — {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Início (opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={startsAtInput}
                    onChange={(e) => setStartsAtInput(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Expiração {grantType === 'temporary' ? '(obrigatória)' : '(opcional)'}
                  </label>
                  <input
                    type="datetime-local"
                    required={grantType === 'temporary'}
                    value={expiresAtInput}
                    onChange={(e) => setExpiresAtInput(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300 block">
                  Motivo / Observação administrativa
                </label>
                <input
                  type="text"
                  maxLength={300}
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  placeholder="Ex.: Bolsa integral, acesso experimental 14 dias, aluno avançado..."
                  className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white placeholder-[#71717A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingGrant}
                className="w-full h-10 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmittingGrant ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
                <span>Aplicar Liberação Gratuita</span>
              </button>
            </form>

            {/* 2. DIRECIONAMENTO INICIAL NO CURRÍCULO */}
            <form
              onSubmit={handleSubmitPlacement}
              className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#C5A059]" />
                    <span>Direcionamento Inicial no Currículo</span>
                  </h3>
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                    Direcione o ponto de partida pedagógico deste aluno sem apagar aulas já concluídas, tempo de estudo ou histórico.
                  </p>
                </div>

                {/* Direcionamento ativo atual */}
                {overview.snapshot.primaryPlacement ? (
                  <div className="p-3.5 rounded-xl bg-[#271C1F] border border-[#7B1E2B]/70 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-code font-bold uppercase text-[#C5A059]">
                        Direcionamento Ativo
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          overview.snapshot.primaryPlacement.isAccessible
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}
                      >
                        {overview.snapshot.primaryPlacement.isAccessible
                          ? 'Acesso liberado'
                          : 'Aguardando liberação de acesso'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      {getCatalogCourse(overview.snapshot.primaryPlacement.courseId)?.title} • Módulo{' '}
                      {overview.snapshot.primaryPlacement.moduleNumber}
                    </div>
                    <div className="text-[11px] text-zinc-300">
                      Aula inicial:{' '}
                      {getCatalogLesson(
                        overview.snapshot.primaryPlacement.lessonId,
                        overview.snapshot.primaryPlacement.courseId
                      )?.title || overview.snapshot.primaryPlacement.lessonId}
                    </div>
                    {overview.snapshot.primaryPlacement.reason && (
                      <div className="text-[10px] text-[#A1A1AA]">
                        Motivo: {overview.snapshot.primaryPlacement.reason}
                      </div>
                    )}

                    {!confirmClearPlacement ? (
                      <button
                        type="button"
                        onClick={() => setConfirmClearPlacement(true)}
                        className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121215] hover:bg-[#27272A] text-xs font-semibold text-zinc-200 border border-[#3F3F46] cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retornar ao Percurso Padrão</span>
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-[#121215] border border-amber-700/60 space-y-2">
                        <p className="text-[11px] text-amber-200">
                          Confirmar remoção do direcionamento personalizado? O progresso acumulado permanece 100% preservado.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isSubmittingPlacement}
                            onClick={() => void handleClearPlacement()}
                            className="px-3 py-1 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            Confirmar retorno
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmClearPlacement(false)}
                            className="px-3 py-1 rounded-lg bg-[#27272A] text-zinc-300 text-[11px] cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#141418] border border-[#27272A] text-[11px] text-[#A1A1AA]">
                    Sem direcionamento personalizado ativo. O aluno segue seu percurso padrão.
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">Curso inicial</label>
                  <select
                    value={placeCourseId}
                    onChange={(e) => setPlaceCourseId(e.target.value as OfficialCourseId)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  >
                    {ACADEMIC_CATALOG_COURSE_LIST.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">Módulo inicial</label>
                  <select
                    value={placeModuleId}
                    onChange={(e) => setPlaceModuleId(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  >
                    {placeModules.map((m) => (
                      <option key={m.id} value={m.id}>
                        Módulo {m.moduleNumber} — {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">Aula inicial</label>
                  <select
                    value={placeLessonId}
                    onChange={(e) => setPlaceLessonId(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white"
                  >
                    {placeLessonsInModule.map((l) => (
                      <option key={l.id} value={l.id}>
                        Aula {l.lessonNumber} — {l.title}
                      </option>
                    ))}
                  </select>
                </div>

                {!placementTargetAccessible && (
                  <div className="p-3 rounded-xl bg-amber-950/35 border border-amber-800/60 text-[11px] text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span>
                      Aviso: o aluno ainda não possui acesso liberado para esta aula específica.
                    </span>
                    <button
                      type="button"
                      disabled={isSubmittingGrant}
                      onClick={() => void handleQuickGrantForPlacement()}
                      className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-bold text-[10px] shrink-0 cursor-pointer"
                    >
                      Liberar esta aula agora
                    </button>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Observação pedagógica (opcional)
                  </label>
                  <input
                    type="text"
                    maxLength={300}
                    value={placeReason}
                    onChange={(e) => setPlaceReason(e.target.value)}
                    placeholder="Ex.: Nivelamento técnico confirmado em audição"
                    className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#27272A] text-xs text-white placeholder-[#71717A]"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[10px] text-emerald-400/90 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Integridade garantida: aulas concluídas e prática anterior nunca são apagadas.</span>
                </p>
                <button
                  type="submit"
                  disabled={isSubmittingPlacement}
                  className="w-full h-10 rounded-xl bg-[#C5A059] hover:bg-[#d4b06a] text-[#121215] text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPlacement ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Compass className="w-4 h-4" />
                  )}
                  <span>Aplicar Direcionamento Inicial</span>
                </button>
              </div>
            </form>
          </div>

          {/* 3. HISTÓRICO E CONTROLE DE CONCESSÕES (SUSPENDER / REATIVAR / REVOGAR) */}
          <div className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C5A059]" />
                <span>Histórico &amp; Controle de Concessões ({overview.grants.length})</span>
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">
                Suspenda, reative ou revogue liberações gratuitas a qualquer instante sem afetar compras ou matrículas independentes.
              </p>
            </div>

            {pendingGrantAction && (
              <div className="p-4 rounded-xl bg-[#27171C] border border-[#B52A3A] space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-[#FFA4B0] shrink-0 mt-0.5" />
                  <div className="text-xs text-white">
                    <span className="font-bold">
                      Confirmar{' '}
                      {pendingGrantAction.nextStatus === 'revoked'
                        ? 'revogação'
                        : pendingGrantAction.nextStatus === 'suspended'
                        ? 'suspensão'
                        : 'reativação'}
                      :
                    </span>{' '}
                    {describeGrantTarget(pendingGrantAction.grant)}
                  </div>
                </div>
                <input
                  type="text"
                  maxLength={300}
                  value={pendingGrantActionReason}
                  onChange={(e) => setPendingGrantActionReason(e.target.value)}
                  placeholder="Motivo da alteração de status (opcional para auditoria)"
                  className="w-full h-9 px-3 rounded-xl bg-[#121215] border border-[#3F3F46] text-xs text-white placeholder-[#71717A]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={updatingGrantId === pendingGrantAction.grant.id}
                    onClick={() => void handleConfirmGrantStatusChange()}
                    className="px-3.5 py-1.5 rounded-lg bg-[#7B1E2B] hover:bg-[#B52A3A] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    Confirmar alteração
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingGrantAction(null);
                      setPendingGrantActionReason('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#27272A] text-zinc-300 text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {overview.grants.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#71717A] border border-dashed border-[#27272A] rounded-xl">
                Nenhuma concessão gratuita registrada para este aluno até o momento.
              </div>
            ) : (
              <div className="space-y-2.5">
                {overview.grants.map((grant) => {
                  const evalState = evaluateGrantStatus(grant);
                  const isBusy = updatingGrantId === grant.id;

                  return (
                    <div
                      key={grant.id}
                      className="p-3.5 rounded-xl bg-[#141418] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono-code ${
                              evalState.effectiveStatus === 'active' && evalState.active
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : evalState.effectiveStatus === 'suspended'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : evalState.effectiveStatus === 'expired'
                                ? 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                                : evalState.effectiveStatus === 'revoked'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-blue-950 text-blue-300 border border-blue-800'
                            }`}
                          >
                            {evalState.effectiveStatus === 'active' && !evalState.active
                              ? 'Agendada'
                              : evalState.effectiveStatus === 'active'
                              ? 'Ativa'
                              : evalState.effectiveStatus === 'suspended'
                              ? 'Suspensa'
                              : evalState.effectiveStatus === 'expired'
                              ? 'Expirada'
                              : 'Revogada'}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {describeGrantTarget(grant)}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#A1A1AA] flex flex-wrap gap-x-3 gap-y-0.5">
                          <span>Tipo: {GRANT_TYPE_LABELS[grant.grantType]}</span>
                          <span>Concedido por: {grant.grantedByEmail || grant.grantedBy}</span>
                          <span>Em: {formatDateBr(grant.createdAt)}</span>
                          {grant.expiresAt && <span>Validade: {formatDateBr(grant.expiresAt)}</span>}
                        </div>

                        {(grant.reason || grant.statusReason) && (
                          <div className="text-[11px] text-zinc-400">
                            {grant.reason && <span>Obs.: {grant.reason}</span>}
                            {grant.statusReason && (
                              <span className="ml-2 text-amber-300/90">
                                ({grant.statusReason})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {grant.status === 'active' && evalState.effectiveStatus !== 'expired' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              setPendingGrantAction({ grant, nextStatus: 'suspended' });
                              setPendingGrantActionReason('');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 text-[11px] font-semibold border border-amber-800/60 cursor-pointer"
                          >
                            <PauseCircle className="w-3.5 h-3.5" />
                            <span>Suspender</span>
                          </button>
                        )}
                        {(grant.status === 'suspended' || grant.status === 'revoked') && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              setPendingGrantAction({ grant, nextStatus: 'active' });
                              setPendingGrantActionReason('');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[11px] font-semibold border border-emerald-800/60 cursor-pointer"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Reativar</span>
                          </button>
                        )}
                        {grant.status !== 'revoked' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => {
                              setPendingGrantAction({ grant, nextStatus: 'revoked' });
                              setPendingGrantActionReason('');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[11px] font-semibold border border-rose-800/60 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Revogar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

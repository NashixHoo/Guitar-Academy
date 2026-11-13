import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import {
  AdminLogEntry,
  AdminLogSeverity,
  fetchRecentAdminLogs,
  logAdminSecurityEvent,
  subscribeToAdminLogs,
} from '../../services/adminLogsService';
import { useAuth } from '../../contexts/AuthContext';

const EVENT_TYPE_LABELS: Record<string, string> = {
  auth_login_success: 'Login Realizado',
  auth_login_failed: 'Falha de Login',
  auth_signup: 'Novo Cadastro',
  auth_logout: 'Sessão Encerrada',
  auth_password_reset: 'Redefinição de Senha',
  role_checked: 'Verificação de Papel',
  role_escalation_blocked: 'Escalonamento Bloqueado',
  admin_preview_toggled: 'Modo Preview Admin',
  student_status_updated: 'Status de Aluno Alterado',
  security_audit_viewed: 'Auditoria Registrada',
  auth_token_rejected: 'Token Rejeitado (401)',
  role_access_denied: 'Acesso Negado (403)',
  admin_role_lookup: 'Consulta de Papel Admin',
};

function formatLogTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return iso;
  }
}

export const AdminLogsPanel: React.FC = () => {
  const { user, role, isAdmin } = useAuth();
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'all' | AdminLogSeverity>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'auth' | 'security'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRecordingCheck, setIsRecordingCheck] = useState<boolean>(false);

  const loadManualRefresh = useCallback(async () => {
    if (!user || !isAdmin) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const items = await fetchRecentAdminLogs(60);
      setLogs(items);
    } catch (err: any) {
      setErrorMsg(
        'Não foi possível carregar os registros de auditoria no Firestore. Verifique a conexão e as permissões administrativas.'
      );
      console.warn('Erro ao atualizar admin_logs:', err?.message || err);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    const unsubscribe = subscribeToAdminLogs(
      (items) => {
        setLogs(items);
        setLoading(false);
        setErrorMsg(null);
      },
      () => {
        setLoading(false);
        setErrorMsg(
          'Permissão insuficiente ou indisponibilidade ao assinar admin_logs em tempo real.'
        );
      },
      60
    );

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleRecordAuditCheck = async () => {
    if (!user || !isAdmin || isRecordingCheck) return;
    setIsRecordingCheck(true);
    try {
      await logAdminSecurityEvent({
        eventType: 'security_audit_viewed',
        severity: 'info',
        actorUid: user.uid,
        actorEmail: user.email,
        actorRole: role,
        action: 'Verificação manual da trilha de auditoria administrativa',
        details: `Painel Admin Suite consultado por ${user.email || user.uid}`,
        source: 'admin_portal',
      });
      await loadManualRefresh();
    } finally {
      setIsRecordingCheck(false);
    }
  };

  const filteredLogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return logs.filter((entry) => {
      if (severityFilter !== 'all' && entry.severity !== severityFilter) {
        return false;
      }
      if (categoryFilter === 'auth' && !entry.eventType.startsWith('auth_')) {
        return false;
      }
      if (categoryFilter === 'security' && entry.eventType.startsWith('auth_')) {
        return false;
      }
      if (!term) return true;
      return (
        entry.action.toLowerCase().includes(term) ||
        entry.eventType.toLowerCase().includes(term) ||
        (entry.actorEmail || '').toLowerCase().includes(term) ||
        entry.actorUid.toLowerCase().includes(term) ||
        (entry.details || '').toLowerCase().includes(term)
      );
    });
  }, [logs, severityFilter, categoryFilter, searchTerm]);

  const counts = useMemo(() => {
    return {
      total: logs.length,
      critical: logs.filter((l) => l.severity === 'critical').length,
      warning: logs.filter((l) => l.severity === 'warning').length,
      auth: logs.filter((l) => l.eventType.startsWith('auth_')).length,
    };
  }, [logs]);

  const renderSeverityBadge = (severity: AdminLogSeverity) => {
    if (severity === 'critical') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono-code font-bold uppercase bg-rose-950/70 text-rose-300 border border-rose-800/70">
          <ShieldAlert className="w-3 h-3" />
          Crítico
        </span>
      );
    }
    if (severity === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono-code font-bold uppercase bg-amber-950/70 text-amber-300 border border-amber-800/70">
          <AlertTriangle className="w-3 h-3" />
          Alerta
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono-code font-bold uppercase bg-emerald-950/70 text-emerald-300 border border-emerald-800/70">
        <CheckCircle2 className="w-3 h-3" />
        Info
      </span>
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-[#1C1C21] border border-[#27272A] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Trilha de Auditoria & Eventos de Autenticação (admin_logs)
            </h3>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Coleção imutável no Firestore com leitura exclusiva para administradores verificados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecordAuditCheck}
            disabled={isRecordingCheck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] disabled:opacity-50 text-xs font-semibold text-[#E4E4E7] border border-[#3F3F46] transition cursor-pointer"
            title="Registrar evento de inspeção na coleção admin_logs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRecordingCheck ? 'Registrando...' : 'Registrar Inspeção'}</span>
          </button>
          <button
            onClick={loadManualRefresh}
            disabled={loading}
            className="p-2 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] disabled:opacity-50 text-[#E4E4E7] border border-[#3F3F46] transition cursor-pointer"
            title="Atualizar logs de segurança"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Resumo Numérico */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
          <span className="text-[#A1A1AA] block text-[11px]">Eventos Carregados</span>
          <span className="text-lg font-black text-white font-mono-code">{counts.total}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
          <span className="text-[#A1A1AA] block text-[11px]">Eventos de Auth</span>
          <span className="text-lg font-black text-emerald-400 font-mono-code">{counts.auth}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
          <span className="text-[#A1A1AA] block text-[11px]">Alertas</span>
          <span className="text-lg font-black text-amber-400 font-mono-code">{counts.warning}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#141417] border border-[#27272A]">
          <span className="text-[#A1A1AA] block text-[11px]">Críticos</span>
          <span className="text-lg font-black text-rose-400 font-mono-code">{counts.critical}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <div className="sm:col-span-2 relative">
          <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por ação, e-mail, UID ou detalhe..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#141417] border border-[#27272A] text-xs text-white placeholder:text-[#71717A] focus:border-[#7B1E2B] outline-hidden"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'auth' | 'security')}
          className="h-9 px-3 rounded-xl bg-[#141417] border border-[#27272A] text-xs text-white focus:border-[#7B1E2B] outline-hidden"
        >
          <option value="all">Todas as Categorias</option>
          <option value="auth">Autenticação</option>
          <option value="security">Segurança & Admin</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as 'all' | AdminLogSeverity)}
          className="h-9 px-3 rounded-xl bg-[#141417] border border-[#27272A] text-xs text-white focus:border-[#7B1E2B] outline-hidden"
        >
          <option value="all">Todas as Severidades</option>
          <option value="info">Info</option>
          <option value="warning">Alerta</option>
          <option value="critical">Crítico</option>
        </select>
      </div>

      {/* Erro */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Lista de Eventos */}
      <div className="rounded-xl border border-[#27272A] bg-[#141417] overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#A1A1AA]">
            Carregando eventos de segurança em admin_logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#A1A1AA] space-y-1">
            <KeyRound className="w-5 h-5 mx-auto text-[#71717A]" />
            <p className="font-semibold text-zinc-300">
              Nenhum evento de auditoria encontrado para os filtros selecionados.
            </p>
            <p>
              Novos logins, encerramentos de sessão, alterações administrativas e bloqueios de acesso aparecerão aqui em tempo real.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#27272A] max-h-[420px] overflow-y-auto">
            {filteredLogs.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 hover:bg-[#1C1C21]/70 transition flex flex-col gap-1.5 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {renderSeverityBadge(entry.severity)}
                    <span className="px-2 py-0.5 rounded-md bg-[#27272A] text-[#E4E4E7] text-[10px] font-mono-code">
                      {EVENT_TYPE_LABELS[entry.eventType] || entry.eventType}
                    </span>
                    <span className="font-bold text-white">{entry.action}</span>
                  </div>
                  <span className="text-[11px] font-mono-code text-[#A1A1AA]">
                    {formatLogTimestamp(entry.timestamp)}
                  </span>
                </div>

                {entry.details && (
                  <p className="text-[11px] text-[#A1A1AA] leading-relaxed">{entry.details}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono-code text-[#71717A]">
                  <span className="inline-flex items-center gap-1 text-zinc-300">
                    <UserCheck className="w-3 h-3 text-[#C5A059]" />
                    {entry.actorEmail || entry.actorUid} ({entry.actorRole})
                  </span>
                  <span>UID: {entry.actorUid.slice(0, 18)}</span>
                  {entry.targetUid && <span>Alvo: {entry.targetUid.slice(0, 18)}</span>}
                  <span>Origem: {entry.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

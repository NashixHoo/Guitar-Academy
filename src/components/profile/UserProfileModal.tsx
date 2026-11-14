import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProgress } from '../../types';
import { storageService } from '../../services/storageService';
import { 
  X, 
  Cloud, 
  RefreshCw, 
  Download, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Activity, 
  ShieldCheck,
  WifiOff,
  GraduationCap,
  KeyRound,
  FileText
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onNavigateTab?: (tab: NavigationTab) => void;
  onOpenJoinClass?: () => void;
  onOpenPrivacyNotice?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
  onNavigateTab,
  onOpenJoinClass,
  onOpenPrivacyNotice,
}) => {
  const {
    user,
    studentProfile,
    logOut,
    syncNow,
    syncStatus,
    lastSyncedAt,
    isTeacher,
    isAdmin,
    roleResolution,
    isRoleChecking,
    refreshUserProfile,
    setAdminPreviewMode,
  } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const hasPrivilegedRole = isTeacher || isAdmin;

  if (!isOpen || !user) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      await syncNow();
      const updated = storageService.loadProgress(user.uid);
      onUpdateProgress(updated);
      setSyncFeedback('Dados sincronizados com sucesso na nuvem!');
      setTimeout(() => setSyncFeedback(null), 3500);
    } catch {
      setSyncFeedback('Erro ao sincronizar. Seus dados estão preservados localmente.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = () => {
    storageService.exportBackup();
  };

  const handleLogout = async () => {
    await logOut();
    onClose();
    // Recarrega o progresso para o perfil anônimo/limpo
    onUpdateProgress(storageService.loadProgress());
  };

  // Cálculos de métricas do estudante
  const totalMinutes = Math.floor((progress.totalStudyTimeSeconds || 0) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours}h ${remainingMinutes}min` : `${remainingMinutes}min`;
  const completedCount = progress.completedLessons?.length || 0;

  const initials = (user.displayName || user.email || 'GA')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-title"
    >
      <div 
        className="relative w-full max-w-md bg-[#FAF9F6] dark:bg-[#1A1216] rounded-2xl border border-[#E8E6E1] dark:border-[#422933] shadow-2xl p-6 sm:p-7 overflow-hidden text-[#25252A] dark:text-[#F8F7F4]"
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] hover:text-[#7B1E2B] dark:hover:text-[#FF6B81] transition focus:outline-hidden"
          aria-label="Fechar painel do estudante"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Perfil Header */}
        <div className="flex items-center gap-3.5 mb-5">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'Estudante'} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C5A059] shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-[#7B1E2B] text-white font-bold text-lg flex items-center justify-center border-2 border-[#C5A059] shadow-sm">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 id="user-profile-title" className="font-display font-black text-base sm:text-lg text-[#1F1F24] dark:text-[#F8F7F4] truncate">
                {user.displayName || 'Estudante'}
              </h2>
              <span title="Conta Google Verificada" className="inline-flex">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              </span>
            </div>
            <p className="text-xs text-[#666672] dark:text-[#B8B3C0] truncate mt-0.5">
              {user.email}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-[#7B1E2B] text-white border border-[#C5A059]/60">
                  <ShieldCheck className="w-3 h-3 text-[#F3D17A]" />
                  Administrador
                </span>
              ) : hasPrivilegedRole ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <GraduationCap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Professor & Coordenador
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold luxury-gold-badge">
                  Aluno Oficial
                </span>
              )}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono-code bg-[#F0EDE6] dark:bg-[#2A1D23] text-[#666672] dark:text-[#B8B3C0] border border-[#D9D9D9] dark:border-[#422933]">
                {studentProfile?.provider === 'google.com'
                  ? 'Google'
                  : studentProfile?.provider === 'facebook.com'
                  ? 'Facebook'
                  : studentProfile?.provider === 'apple.com'
                  ? 'Apple'
                  : 'E-mail'}
              </span>
            </div>
          </div>
        </div>

        {/* Diagnóstico de Identidade e Papel Zero-Trust */}
        <div className="mb-4 p-3 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] text-[11px] space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-[#1F1F24] dark:text-[#F8F7F4]">
              Identidade & Autorização (system_roles)
            </span>
            <button
              onClick={() => void refreshUserProfile()}
              disabled={isRoleChecking}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8E6E1] dark:border-[#422933] font-semibold transition disabled:opacity-50 cursor-pointer"
              title="Reconsultar system_roles/{uid} no servidor"
            >
              <RefreshCw className={`w-3 h-3 ${isRoleChecking ? 'animate-spin' : ''}`} />
              <span>Reverificar</span>
            </button>
          </div>
          <div className="font-mono-code text-[10px] text-[#666672] dark:text-[#B8B3C0] break-all">
            UID: <span className="text-[#1F1F24] dark:text-[#F8F7F4] select-all">{user.uid}</span>
          </div>
          {roleResolution && roleResolution.status !== 'resolved' && (
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-[10px] leading-relaxed">
              {roleResolution.status === 'permission_denied' && (
                <span>
                  <strong>Permissão negada no Firestore:</strong> as regras publicadas no banco{' '}
                  <code className="font-mono-code">{roleResolution.databaseId}</code> bloquearam a leitura de{' '}
                  <code className="font-mono-code">{roleResolution.path}</code> ({roleResolution.errorCode}).
                </span>
              )}
              {roleResolution.status === 'missing_document' && (
                <span>
                  <strong>Documento não encontrado:</strong> nenhum documento existe em{' '}
                  <code className="font-mono-code">{roleResolution.path}</code> no banco{' '}
                  <code className="font-mono-code">{roleResolution.databaseId}</code>.
                </span>
              )}
              {roleResolution.status === 'invalid_role_value' && (
                <span>
                  <strong>Campo role inválido:</strong> o documento{' '}
                  <code className="font-mono-code">{roleResolution.path}</code> existe, mas{' '}
                  <code className="font-mono-code">role</code> vale{' '}
                  <code className="font-mono-code">{JSON.stringify(roleResolution.rawRoleValue ?? null)}</code> (esperado:{' '}
                  <code className="font-mono-code">"admin"</code> ou <code className="font-mono-code">"teacher"</code>).
                </span>
              )}
              {roleResolution.status === 'network_unavailable' && (
                <span>
                  <strong>Firestore indisponível/offline:</strong> não foi possível confirmar{' '}
                  <code className="font-mono-code">{roleResolution.path}</code> no servidor ({roleResolution.errorCode}).
                </span>
              )}
              {(roleResolution.status === 'invalid_config' ||
                roleResolution.status === 'unauthenticated' ||
                roleResolution.status === 'unknown_error') && (
                <span>
                  <strong>Erro na verificação de papel ({roleResolution.status}):</strong>{' '}
                  {roleResolution.errorMessage || roleResolution.errorCode || 'falha ao consultar Firestore'}.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Status de Sincronização em Nuvem */}
        <div className="mb-5 p-3 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {syncStatus === 'syncing' || isSyncing ? (
              <RefreshCw className="w-4 h-4 text-[#C5A059] animate-spin shrink-0" />
            ) : syncStatus === 'offline' ? (
              <WifiOff className="w-4 h-4 text-[#D97706] shrink-0" />
            ) : (
              <Cloud className="w-4 h-4 text-[#16A34A] shrink-0" />
            )}
            <div className="text-xs">
              <span className="font-bold block text-[#1F1F24] dark:text-[#F8F7F4]">
                {syncStatus === 'syncing' || isSyncing
                  ? 'Sincronizando com a Nuvem...'
                  : syncStatus === 'offline'
                  ? 'Armazenamento Offline Seguro'
                  : 'Sincronizado no Cloud Firestore'}
              </span>
              <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0]">
                {lastSyncedAt ? `Última sincronização: ${lastSyncedAt.toLocaleTimeString()}` : 'Pronto para sincronizar'}
              </span>
            </div>
          </div>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-1.5 rounded-lg bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] transition border border-[#E8E6E1] dark:border-[#422933] disabled:opacity-50"
            title="Sincronizar agora"
            aria-label="Sincronizar com a nuvem agora"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {syncFeedback && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#F0FDF4] dark:bg-[#143820] text-[#16A34A] dark:text-[#4ADE80] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* Métricas do Aluno */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933]">
            <BookOpen className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81] mx-auto mb-1" />
            <span className="text-sm font-black block text-[#1F1F24] dark:text-[#F8F7F4]">{completedCount}</span>
            <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0]">Aulas Feitas</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933]">
            <Clock className="w-4 h-4 text-[#C5A059] mx-auto mb-1" />
            <span className="text-sm font-black block text-[#1F1F24] dark:text-[#F8F7F4]">{timeFormatted}</span>
            <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0]">Tempo de Estudo</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933]">
            <Activity className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81] mx-auto mb-1" />
            <span className="text-sm font-black block text-[#1F1F24] dark:text-[#F8F7F4]">{progress.practicedBpm || 80}</span>
            <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0]">BPM Máximo</span>
          </div>
        </div>

        {/* Ações Pedagógicas & Conta */}
        <div className="space-y-2 border-t border-[#E8E6E1] dark:border-[#422933] pt-3">
          {isAdmin && (
            <button
              onClick={() => {
                setAdminPreviewMode(false);
                onClose();
              }}
              className="w-full h-10 rounded-xl bg-[#7B1E2B] hover:bg-[#5E1620] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#F3D17A]" />
              <span>Abrir Painel Administrativo (Admin Suite)</span>
            </button>
          )}

          {hasPrivilegedRole ? (
            <button
              onClick={() => {
                onClose();
                onNavigateTab?.('teacher-dashboard');
              }}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Abrir Painel de Gestão Pedagógica</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenJoinClass?.();
              }}
              className="w-full h-10 rounded-xl bg-[#FAF4E6] dark:bg-[#332211] hover:bg-[#F3E7C4] dark:hover:bg-[#442D15] text-[#8C5F18] dark:text-[#F3D17A] font-bold text-xs transition border border-[#C5A059]/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#C5A059]" />
              <span>Vincular a uma Turma com Código</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              className="h-9 rounded-xl bg-white hover:bg-[#F5F5F5] dark:bg-[#251820] dark:hover:bg-[#301E29] text-[#1F1F24] dark:text-[#F8F7F4] font-semibold text-[11px] transition border border-[#D9D9D9] dark:border-[#422933] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Backup (JSON)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenPrivacyNotice?.();
              }}
              className="h-9 rounded-xl bg-white hover:bg-[#F5F5F5] dark:bg-[#251820] dark:hover:bg-[#301E29] text-[#1F1F24] dark:text-[#F8F7F4] font-semibold text-[11px] transition border border-[#D9D9D9] dark:border-[#422933] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#7B1E2B] dark:text-[#FF6B81]" />
              <span>Privacidade LGPD</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full h-9 rounded-xl bg-[#FFF0F2] hover:bg-[#FFE0E4] dark:bg-[#3A141A] dark:hover:bg-[#481820] text-[#7B1E2B] dark:text-[#FF8095] font-semibold text-xs transition border border-[#B52A3A]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Desconectar / Trocar de Conta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

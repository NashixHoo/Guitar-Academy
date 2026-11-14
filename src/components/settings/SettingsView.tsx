import React, { useState, useRef } from 'react';
import { UserProgress, NavigationTab } from '../../types';
import { storageService } from '../../services/storageService';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { Settings, Music, Clock, Sliders, Smartphone, Check, Target, ShieldCheck, Sun, Moon, Monitor, Download, Upload, User as UserIcon, Cloud, RefreshCw, LogOut, GraduationCap } from 'lucide-react';
import { DailyGoalSettings } from '../dashboard/DailyGoalSettings';
import { themeService, ThemeMode } from '../../services/themeService';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ progress, onUpdateProgress, onNavigateTab }) => {
  const { user, signInWithGoogle, logOut, syncNow, syncStatus, lastSyncedAt, isTeacher, isAdmin } = useAuth();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [backupMessage, setBackupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateSetting = <K extends keyof UserProgress>(key: K, value: UserProgress[K]) => {
    const updated = { ...progress, [key]: value };
    onUpdateProgress(updated);
    storageService.saveProgress(updated);
  };

  const handleSelectTheme = (mode: ThemeMode) => {
    updateSetting('themePreference', mode);
    themeService.applyTheme(mode);
  };

  const handleExportBackup = () => {
    const res = storageService.exportBackup();
    if (res.success) {
      setBackupMessage({ type: 'success', text: `Backup exportado com sucesso (${res.filename})! 🎸` });
    } else {
      setBackupMessage({ type: 'error', text: res.error || 'Erro ao exportar arquivo de backup.' });
    }
    setTimeout(() => setBackupMessage(null), 4000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = storageService.importBackup(content);
        if (result.success) {
          const reloaded = storageService.loadProgress();
          onUpdateProgress(reloaded);
          setBackupMessage({ type: 'success', text: result.message || 'Dados e progresso importados com sucesso!' });
        } else {
          setBackupMessage({ type: 'error', text: result.error || 'Erro ao importar arquivo de backup.' });
        }
        setTimeout(() => setBackupMessage(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Configurações & Preferências</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Personalize a notação musical, a afinação padrão da guitarra e suas metas diárias de estudo.
          </p>
        </div>
      </div>

      {/* Toast / Mensagem de Status */}
      {backupMessage && (
        <div
          role="status"
          className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${
            backupMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{backupMessage.text}</span>
          <button
            onClick={() => setBackupMessage(null)}
            className="text-xs opacity-75 hover:opacity-100 font-mono-code px-2 py-0.5"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Settings Grid */}
      <div className="space-y-4">
        {/* Conta do Aluno & Sincronização Google (Multi-Usuário) */}
        <div className="bg-white dark:bg-[#1A1216] border border-[#D9D9D9] dark:border-[#422933] rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#25252A] dark:text-[#F8F7F4] font-bold text-sm">
              <UserIcon className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81]" />
              <span>Conta do Estudante & Nuvem (Multi-Usuário)</span>
            </div>
            {user ? (
              <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Google Conectado
              </span>
            ) : (
              <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#FAF1F2] text-[#7B1E2B] border border-[#E8D3D6] dark:bg-[#381A25] dark:text-[#FF6B81] dark:border-[#522536]">
                Offline / Convidado
              </span>
            )}
          </div>

          <p className="text-xs text-[#666672] dark:text-[#B8B3C0]">
            O Guitar Academy isola o progresso de cada aluno por conta Google, sincronizando aulas concluídas, rotinas e histórico do braço na nuvem.
          </p>

          {user ? (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933]">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Estudante'}
                    className="w-10 h-10 rounded-xl object-cover border border-[#C5A059]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#7B1E2B] text-white font-bold text-sm flex items-center justify-center">
                    {(user.displayName || user.email || 'G')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="font-bold text-xs sm:text-sm text-[#1F1F24] dark:text-[#F8F7F4] block">
                    {user.displayName || 'Estudante'}
                  </span>
                  <span className="text-[11px] text-[#666672] dark:text-[#B8B3C0] block">
                    {user.email}
                  </span>
                  <span className="text-[10px] text-[#16A34A] dark:text-[#4ADE80] flex items-center gap-1 mt-0.5 font-medium">
                    <Cloud className="w-3 h-3" />
                    {lastSyncedAt ? `Sincronizado às ${lastSyncedAt.toLocaleTimeString()}` : 'Pronto na nuvem'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    setIsSyncing(true);
                    try {
                      await syncNow();
                      setBackupMessage({ type: 'success', text: 'Progresso sincronizado com sucesso no Cloud Firestore!' });
                    } catch {
                      setBackupMessage({ type: 'error', text: 'Falha ao sincronizar. Seus dados estão preservados no aparelho.' });
                    } finally {
                      setIsSyncing(false);
                      setTimeout(() => setBackupMessage(null), 4000);
                    }
                  }}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8E6E1] dark:border-[#422933] text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sincronizar</span>
                </button>

                {(isTeacher || isAdmin) && (
                  <button
                    onClick={() => onNavigateTab?.('teacher-dashboard')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Gestão Pedagógica</span>
                  </button>
                )}

                <button
                  onClick={async () => {
                    await logOut();
                    onUpdateProgress(storageService.loadProgress());
                    setBackupMessage({ type: 'success', text: 'Você desconectou da sua conta Google.' });
                    setTimeout(() => setBackupMessage(null), 4000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF0F2] dark:bg-[#3A141A] hover:bg-[#FFE0E4] dark:hover:bg-[#481820] text-[#7B1E2B] dark:text-[#FF8095] border border-[#B52A3A]/20 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933]">
              <div className="text-xs text-[#666672] dark:text-[#B8B3C0]">
                <span className="font-bold text-[#1F1F24] dark:text-[#F8F7F4] block mb-0.5">
                  Conecte sua conta para não perder seus estudos
                </span>
                Salve seu histórico e acesse de qualquer outro celular ou computador.
              </div>
              <button
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                    const updated = storageService.loadProgress();
                    onUpdateProgress(updated);
                    setBackupMessage({ type: 'success', text: 'Conta Google conectada com sucesso!' });
                  } catch (err: any) {
                    setBackupMessage({ type: 'error', text: err?.message || 'Não foi possível conectar com o Google.' });
                  } finally {
                    setTimeout(() => setBackupMessage(null), 4000);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#1A1216] hover:bg-[#F5F5F5] dark:hover:bg-[#2A1822] text-[#1F1F24] dark:text-[#F8F7F4] border border-[#D9D9D9] dark:border-[#422933] text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Entrar com o Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Seletor de Tema: Modo Claro / Modo Escuro (Identidade Visual & Contraste) */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#25252A] font-bold text-sm">
              <Sun className="w-4 h-4 text-[#7B1E2B]" />
              <span>Tema Visual & Modo de Estudo (Contraste de Leitura)</span>
            </div>
            <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#FAF1F2] text-[#7B1E2B] border border-[#E8D3D6]">
              WCAG AAA Contraste
            </span>
          </div>
          <p className="text-xs text-[#666672]">
            Altera as variáveis CSS de cor no aplicativo, mantendo o contraste de leitura adequado para a interface de estudo de cifras, tablaturas e acordes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              {
                id: 'light',
                icon: Sun,
                label: 'Modo Claro',
                subtitle: 'Conservatório Porcelana',
                desc: 'Fundo porcelana (#F8F7F4), superfícies brancas e vinho clássico. Ideal para ambientes iluminados.',
              },
              {
                id: 'dark',
                icon: Moon,
                label: 'Modo Escuro',
                subtitle: 'Palco & Noturno',
                desc: 'Fundo profundo de palco, contraste otimizado e vinho vibrante. Reduz cansaço visual em estudos noturnos.',
              },
              {
                id: 'system',
                icon: Monitor,
                label: 'Automático',
                subtitle: 'Sistema Operacional',
                desc: 'Sincroniza automaticamente com o tema claro ou escuro configurado no seu dispositivo ou celular.',
              },
            ].map((opt) => {
              const activeTheme = progress.themePreference || 'light';
              const isSelected = activeTheme === opt.id;
              const IconComp = opt.icon;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectTheme(opt.id as ThemeMode)}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#F5E8EA] border-[#7B1E2B] text-[#7B1E2B] shadow-xs'
                      : 'bg-[#F8F7F4] border-[#D9D9D9] text-[#666672] hover:text-[#25252A]'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Selecionar ${opt.label} (${opt.subtitle})`}
                >
                  <div className="flex items-center justify-between font-bold text-xs w-full">
                    <div className="flex items-center gap-2">
                      <IconComp className="w-4 h-4 text-[#7B1E2B]" />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#7B1E2B]" />}
                  </div>
                  <span className="text-[10px] font-semibold mt-1 opacity-80">{opt.subtitle}</span>
                  <p className="text-[10px] text-[#666672] mt-1.5 leading-relaxed">{opt.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Amostra ao Vivo de Contraste e Cifras */}
          <div className="p-3.5 rounded-xl bg-[#F8F7F4] border border-[#D9D9D9] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-bold text-[#25252A]">Prévia de Leitura:</span>
              <span className="font-mono-code font-bold px-2 py-0.5 rounded bg-white text-[#7B1E2B] border border-[#D9D9D9]">
                Acorde C (Dó Maior)
              </span>
              <span className="font-mono-code text-[#25252A]">
                E: 0 · B: 1 · G: 0 · D: 2 · A: 3 · E: X
              </span>
            </div>
            <span className="text-[11px] text-[#666672]">
              Cores calibradas para leitura de alta fidelidade
            </span>
          </div>
        </div>

        {/* Preferred Notation */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#25252A] font-bold text-sm">
            <Music className="w-4 h-4 text-[#7B1E2B]" />
            <span>Notação Musical Preferida</span>
          </div>
          <p className="text-xs text-[#666672]">
            Escolha como as notas e acordes serão exibidos prioritariamente no braço e diagramas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { id: 'cipher', label: 'Cifra Internacional (C, D, E)', desc: 'Padrão mundial para cifras e tablaturas' },
              { id: 'portuguese', label: 'Nome em Português (Dó, Ré, Mi)', desc: 'Nomenclatura tradicional do solfejo' },
              { id: 'both', label: 'Ambos Simultâneos', desc: 'Exibe a cifra e o nome em português juntos' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateSetting('notationPreference', opt.id as UserProgress['notationPreference'])}
                className={`p-4 rounded-xl border text-left transition ${
                  progress.notationPreference === opt.id
                    ? 'bg-[#F5E8EA] border-[#7B1E2B] text-[#7B1E2B] shadow-xs'
                    : 'bg-[#F8F7F4] border-[#D9D9D9] text-[#666672] hover:text-[#25252A]'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>{opt.label}</span>
                  {progress.notationPreference === opt.id && <Check className="w-4 h-4 text-[#7B1E2B]" />}
                </div>
                <p className="text-[10px] text-[#666672] mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Tuning */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#25252A] font-bold text-sm">
            <Sliders className="w-4 h-4 text-[#B52A3A]" />
            <span>Afinação da Guitarra</span>
          </div>
          <p className="text-xs text-[#666672]">
            A afinação padrão (E-A-D-G-B-E) é a utilizada no currículo fundamental.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { id: 'standard', label: 'Afinação Padrão (E A D G B E)', desc: 'Utilizada em 95% do aprendizado clássico' },
              { id: 'dropD', label: 'Drop D (D A D G B E)', desc: 'A 6ª corda desce 1 tom inteiro para Ré' },
              { id: 'halfStepDown', label: 'Meio Tom Abaixo (Eb Ab Db Gb Bb Eb)', desc: 'Clássico de Jimi Hendrix, Guns N\' Roses e SRV' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateSetting('preferredTuning', opt.id as UserProgress['preferredTuning'])}
                className={`p-4 rounded-xl border text-left transition ${
                  progress.preferredTuning === opt.id
                    ? 'bg-[#F5E8EA] border-[#7B1E2B] text-[#7B1E2B] shadow-xs'
                    : 'bg-[#F8F7F4] border-[#D9D9D9] text-[#666672] hover:text-[#25252A]'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>{opt.label}</span>
                  {progress.preferredTuning === opt.id && <Check className="w-4 h-4 text-[#7B1E2B]" />}
                </div>
                <p className="text-[10px] text-[#666672] mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Study Routine Goal */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#25252A] font-bold text-sm">
            <Clock className="w-4 h-4 text-[#7B1E2B]" />
            <span>Meta de Estudo Diário Recomendada</span>
          </div>
          <p className="text-xs text-[#666672]">
            A consistência diária de 15 a 30 minutos é 10x mais eficaz do que estudar 3 horas uma única vez na semana.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {[15, 20, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => updateSetting('dailyGoalMinutes', mins)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition border ${
                  progress.dailyGoalMinutes === mins
                    ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                    : 'bg-[#F8F7F4] text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
                }`}
              >
                {mins} minutos / dia
              </button>
            ))}
            <button
              onClick={() => setShowGoalModal(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs transition border border-dashed border-[#7B1E2B] text-[#7B1E2B] hover:bg-[#F5E8EA] flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Personalizar com Slider & Dicas...</span>
            </button>
          </div>
        </div>

        {/* Modal de Meta Diária em Configurações */}
        {showGoalModal && (
          <DailyGoalSettings
            currentGoalMinutes={progress.dailyGoalMinutes || 30}
            onSaveGoal={(newMins) => {
              updateSetting('dailyGoalMinutes', newMins);
              setShowGoalModal(false);
            }}
            onClose={() => setShowGoalModal(false)}
            variant="modal"
          />
        )}

        {/* PWA & Offline Installation */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#25252A] font-bold text-sm">
            <Smartphone className="w-4 h-4 text-[#7B1E2B]" />
            <span>Instalação PWA & Uso Sem Conexão (Offline)</span>
          </div>
          <p className="text-xs text-[#666672]">
            O Guitar Academy é um Progressive Web App completo. Ao instalar no celular ou computador, todo o conteúdo, áudios e metrônomo funcionam mesmo sem sinal de internet.
          </p>
          <div className="pt-2 max-w-xs">
            <PWAInstallButton variant="settings" />
          </div>
        </div>

        {/* Backup & Restauração de Dados */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#25252A] font-bold text-sm">
              <Download className="w-4 h-4 text-[#7B1E2B]" />
              <span>Backup & Proteção de Dados do Aluno</span>
            </div>
            <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#FAF1F2] text-[#7B1E2B] border border-[#E8D3D6]">
              100% Local & Seguro
            </span>
          </div>
          <p className="text-xs text-[#666672]">
            Exporte todo o seu progresso, aulas concluídas, repetições de exercícios e configurações para um arquivo JSON seguro. Você pode restaurar esse arquivo a qualquer momento ou transferir para outro aparelho.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-white text-xs font-bold transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Backup (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#25252A] text-xs font-bold border border-[#D9D9D9] transition"
            >
              <Upload className="w-4 h-4 text-[#7B1E2B]" />
              <span>Restaurar Backup</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>

        {/* Diagnóstico do Sistema & Auditoria Técnica */}
        {onNavigateTab && (
          <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#25252A] font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#7B1E2B]" />
                <span>Auditoria & Diagnóstico do Sistema (Fase 4)</span>
              </div>
              <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7B34]">
                Ativo
              </span>
            </div>
            <p className="text-xs text-[#666672]">
              Verifique em tempo real o estado do localStorage, captação do microfone, perfil de domínio e a consistência das 21 habilidades e 18 aulas.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('diagnostics')}
                className="px-4 py-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold transition border border-[#D9D9D9] flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Abrir Painel de Diagnóstico do Sistema</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { UserProgress } from '../../types';
import { storageService } from '../../services/storageService';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { 
  Trophy, 
  Clock, 
  Award, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Flame,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';

interface ProgressViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalLessons = CURRICULUM_LEVELS.flatMap((l) => l.lessons).length;
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const hours = Math.floor(progress.totalStudyTimeSeconds / 3600);
  const minutes = Math.floor((progress.totalStudyTimeSeconds % 3600) / 60);

  const handleExportBackup = () => {
    storageService.exportBackup();
    setStatusMessage({ type: 'success', text: 'Backup exportado com sucesso!' });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = storageService.importBackup(content);
        if (success) {
          const reloaded = storageService.loadProgress();
          onUpdateProgress(reloaded);
          setStatusMessage({ type: 'success', text: 'Dados e progresso importados com sucesso!' });
        } else {
          setStatusMessage({ type: 'error', text: 'Erro ao importar arquivo de backup. Formato inválido.' });
        }
        setTimeout(() => setStatusMessage(null), 4000);
      }
    };
    reader.readAsText(file);
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    storageService.resetAll();
    const fresh = storageService.loadProgress();
    onUpdateProgress(fresh);
    setShowResetConfirm(false);
    setStatusMessage({ type: 'success', text: 'Todo o progresso foi reiniciado com sucesso.' });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const frequentErrorsList = Object.entries(progress.frequentErrors || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Toast de Notificação Inline */}
      {statusMessage && (
        <div
          role="status"
          className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs opacity-75 hover:opacity-100 font-mono-code px-2 py-0.5"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header with Evoluir Banner */}
      <div className="bg-white dark:bg-[#22141A] border border-[#D9D9D9] dark:border-[#422933] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle pillar banner background */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 pointer-events-none opacity-20 hidden md:block">
          <img
            src="./images/backgrounds/banner-evoluir.svg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-right"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7B1E2B] via-[#B52A3A] to-[#F5C542]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#F5C542]" />
            <h1 className="text-2xl font-display font-black text-[#25252A] dark:text-[#F8F7F4]">Meu Progresso & Estatísticas</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] dark:text-[#B8B3C0] mt-1 font-medium">
            Seu diário de bordo musical registrado 100% no seu navegador sem rastreadores.
          </p>
        </div>

        {/* Data Backup buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold border border-[#D9D9D9] transition"
            title="Exportar backup dos meus estudos em JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Backup</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold border border-[#D9D9D9] transition"
            title="Restaurar backup prévio"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restaurar</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* Main Stats Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#666672] text-xs font-semibold">
            <span>Tempo Total</span>
            <Clock className="w-4 h-4 text-[#7B1E2B]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#25252A] font-mono-code">
            {hours > 0 ? `${hours}h ` : ''}{minutes}m
          </div>
          <span className="text-[10px] text-[#666672]">de dedicação prática</span>
        </div>

        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#666672] text-xs font-semibold">
            <span>Aulas Dominadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#25252A] font-mono-code">
            {completedCount} <span className="text-sm font-normal text-[#666672]">/ {totalLessons}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">{progressPercent}% do curso</span>
        </div>

        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#666672] text-xs font-semibold">
            <span>Meta Diária</span>
            <Flame className="w-4 h-4 text-[#B52A3A]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#25252A] font-mono-code">
            {Math.floor(progress.todayStudyTimeSeconds / 60)} <span className="text-sm font-normal text-[#666672]">/ {progress.dailyGoalMinutes}m</span>
          </div>
          <span className="text-[10px] text-[#B52A3A] font-semibold">rotina de hoje</span>
        </div>

        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#666672] text-xs font-semibold">
            <span>Última Sessão</span>
            <Calendar className="w-4 h-4 text-[#7B1E2B]" />
          </div>
          <div className="mt-2 text-base font-bold text-[#25252A] font-mono-code truncate">
            {progress.lastStudyDate}
          </div>
          <span className="text-[10px] text-[#666672]">atividade sincronizada</span>
        </div>
      </div>

      {/* Competency Mastery Across Levels */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#7B1E2B]" />
          Progresso por Nível e Competência
        </h2>

        <div className="space-y-4 pt-2">
          {CURRICULUM_LEVELS.map((lvl) => {
            const levelLessons = lvl.lessons;
            const completedInLevel = levelLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
            const pct = Math.round((completedInLevel / levelLessons.length) * 100);

            return (
              <div key={lvl.level} className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-[#7B1E2B]">{lvl.badge}</span>
                    <span className="text-[#25252A]">{lvl.name}</span>
                  </div>
                  <span className="font-mono-code text-[#7B1E2B]">{pct}%</span>
                </div>

                <div className="w-full bg-[#D9D9D9] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#7B1E2B] to-[#B52A3A] h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical Guitar Practice Log & Spaced Repetition */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#D9D9D9]">
          <div>
            <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#7B1E2B]" />
              Diário de Prática na Guitarra Física
            </h2>
            <p className="text-xs text-[#666672] mt-0.5 font-medium">
              Acompanhamento de andamento (BPM) e autoavaliação motora registrada nas aulas.
            </p>
          </div>
        </div>

        {Object.keys(progress.practiceLogs || {}).length === 0 ? (
          <div className="text-center py-6 text-xs text-[#666672] bg-[#F8F7F4] rounded-2xl border border-[#D9D9D9]">
            <p className="font-bold text-[#25252A]">Nenhum registro de prática salvo ainda.</p>
            <p className="text-[#666672] mt-1">Ao estudar qualquer aula, registre o andamento (BPM) e sua autoavaliação com a guitarra em mãos.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(progress.practiceLogs).map(([lessonId, log]) => {
              const lessonDef = CURRICULUM_LEVELS.flatMap((l) => l.lessons).find((l) => l.id === lessonId);
              const title = lessonDef ? lessonDef.title : lessonId;

              const statusBadge = {
                viewed: { label: 'Visualizado', bg: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
                practicing: { label: 'Em Prática', bg: 'bg-amber-100 text-amber-900 border-amber-200' },
                mastered: { label: 'Dominado na Guitarra', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
              }[log.status || 'viewed'];

              const confidenceLabel = {
                needs_review: '⚠️ Precisa Revisar',
                playable_slow: '🔄 Toca Lento',
                mastered_with_metronome: '✅ Dominado no Metrônomo',
              }[log.confidence || 'playable_slow'];

              return (
                <div
                  key={`practice-log-${lessonId}`}
                  className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${statusBadge.bg}`}>
                        {statusBadge.label}
                      </span>
                      <span className="font-bold text-[#25252A] text-sm">{title}</span>
                    </div>
                    {log.exerciseRepetitions !== undefined && log.exerciseRepetitions > 0 && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#7B1E2B] bg-[#F5E8EA] px-2 py-0.5 rounded-md border border-[#E8D3D6]">
                        <Check className="w-3 h-3 text-[#B52A3A]" />
                        <span>{log.exerciseRepetitions} repetições do exercício prático registradas</span>
                      </div>
                    )}
                    {log.notes && (
                      <p className="text-[#666672] italic pl-1">"{log.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-white border border-[#D9D9D9] font-mono-code font-bold text-[#7B1E2B]">
                      {log.practicedBpm} BPM
                    </span>
                    <span className="font-medium text-[#666672]">
                      {confidenceLabel}
                    </span>
                    {log.needsReview && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                        Revisar
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Frequent Errors and Review Section */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[#B52A3A]" />
          Questões e Conceitos para Revisão
        </h2>

        {frequentErrorsList.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#666672] bg-[#F8F7F4] rounded-2xl border border-[#D9D9D9]">
            <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-[#25252A]">Nenhum erro registrado até o momento!</p>
            <p className="text-[#666672] mt-0.5">Ao realizar os testes e quizzes das aulas, as dúvidas recorrentes aparecerão aqui para revisão direcionada.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {frequentErrorsList.slice(0, 5).map(([question, count]) => (
              <div
                key={question}
                className="bg-[#F8F7F4] p-3 rounded-xl border border-rose-200 flex items-center justify-between text-xs"
              >
                <span className="text-[#25252A] font-medium">{question}</span>
                <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-mono-code font-bold">
                  {count} {count === 1 ? 'erro' : 'erros'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset Data */}
      <div className="pt-4 flex justify-end">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-700 hover:text-rose-800 hover:bg-rose-50 text-xs font-bold transition border border-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zerar Progresso</span>
          </button>
        ) : (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-bold text-rose-900 text-center sm:text-left">
              Tem certeza? Esta ação apagará todo o histórico e progresso de estudo.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmReset}
                className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition shadow-xs"
              >
                Sim, Zerar Tudo
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition border border-slate-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useRef } from 'react';
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
  Sparkles
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

  const hours = Math.floor(progress.totalStudyTimeSeconds / 3600);
  const minutes = Math.floor((progress.totalStudyTimeSeconds % 3600) / 60);

  const handleExportBackup = () => {
    storageService.exportBackup();
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
          alert('Dados e progresso importados com sucesso!');
        } else {
          alert('Erro ao importar arquivo de backup.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetProgress = () => {
    if (confirm('Tem certeza de que deseja reiniciar todo o seu progresso? Esta ação não pode ser desfeita.')) {
      storageService.resetAll();
      const fresh = storageService.loadProgress();
      onUpdateProgress(fresh);
    }
  };

  const frequentErrorsList = Object.entries(progress.frequentErrors || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Meu Progresso & Estatísticas</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
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
        <button
          onClick={handleResetProgress}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-700 hover:text-rose-800 hover:bg-rose-50 text-xs font-bold transition border border-rose-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Zerar Progresso</span>
        </button>
      </div>
    </div>
  );
};

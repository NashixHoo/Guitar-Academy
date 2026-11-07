import React, { useState } from 'react';
import {
  UserProgress,
  InstrumentType,
  PracticeActivityType,
  PracticeCourseRelation,
  PerceivedDifficulty,
  ManualPracticeLogEntry,
} from '../../types';
import { storageService } from '../../services/storageService';
import { Guitar, X, Check, Clock, Sparkles, BookOpen } from 'lucide-react';

interface ManualPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSave: (updatedProgress: UserProgress) => void;
}

export const ManualPracticeModal: React.FC<ManualPracticeModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSave,
}) => {
  const [instrument, setInstrument] = useState<InstrumentType>('violao_aco');
  const [durationMinutes, setDurationMinutes] = useState<number>(20);
  const [activityType, setActivityType] = useState<PracticeActivityType>('acordes');
  const [courseRelation, setCourseRelation] = useState<PracticeCourseRelation>(
    progress.lastAccessedCourseId || 'violao'
  );
  const [perceivedDifficulty, setPerceivedDifficulty] = useState<PerceivedDifficulty>('confortavel');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const durationPresets = [10, 15, 20, 30, 45, 60];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const localDate = storageService.getLocalDateString();
    const entry: ManualPracticeLogEntry = {
      id: `manual-log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      date: localDate,
      dateStr: localDate,
      durationMinutes: Math.max(1, Math.min(360, Math.round(durationMinutes))),
      instrument,
      activityType,
      relatedCourseId: courseRelation,
      courseRelation,
      perceivedDifficulty,
      notes: notes.trim() || undefined,
      isManual: true,
    };

    const updated = storageService.recordManualPractice(entry);
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1A1216] rounded-3xl border border-[#E8E6E1] dark:border-[#422933] shadow-2xl p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 tortoiseshell-badge rounded-t-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F2] dark:border-[#422933]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] flex items-center justify-center text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8D3D6] dark:border-[#422933]">
              <Guitar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#25252A] dark:text-[#F8F7F4] leading-tight">
                Registrar Prática Instrumental Real
              </h3>
              <p className="text-xs text-[#666672] dark:text-[#B8B3C0]">
                Treino físico offline no violão ou guitarra
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F8F7F4] dark:bg-[#22141A] hover:bg-[#F2F2F2] dark:hover:bg-[#381A25] flex items-center justify-center text-[#666672] dark:text-[#B8B3C0] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Instrument Selector */}
          <div>
            <label className="block text-xs font-bold text-[#4D4D54] dark:text-[#B8B3C0] uppercase tracking-wider mb-1.5">
              Instrumento Utilizado
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'violao_aco', label: 'Violão Aço' },
                { id: 'violao_nylon', label: 'Violão Nylon' },
                { id: 'guitarra', label: 'Guitarra' },
                { id: 'outro', label: 'Outro' },
              ].map((inst) => (
                <button
                  type="button"
                  key={inst.id}
                  onClick={() => setInstrument(inst.id as InstrumentType)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    instrument === inst.id
                      ? 'bg-[#7B1E2B] dark:bg-[#FF6B81] text-white dark:text-[#180A0E] border-[#7B1E2B] dark:border-[#FF6B81]'
                      : 'bg-[#F8F7F4] dark:bg-[#22141A] text-[#4D4D54] dark:text-[#B8B3C0] border-[#E8E6E1] dark:border-[#422933] hover:bg-[#F5E8EA]'
                  }`}
                >
                  {inst.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#4D4D54] dark:text-[#B8B3C0] uppercase tracking-wider">
                Duração da Sessão
              </label>
              <span className="text-xs font-black text-[#7B1E2B] dark:text-[#FF6B81] font-mono-code">
                {durationMinutes} minutos
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {durationPresets.map((dur) => (
                <button
                  type="button"
                  key={dur}
                  onClick={() => setDurationMinutes(dur)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition ${
                    durationMinutes === dur
                      ? 'bg-[#7B1E2B] dark:bg-[#FF6B81] text-white dark:text-[#180A0E] border-[#7B1E2B] dark:border-[#FF6B81]'
                      : 'bg-[#F8F7F4] dark:bg-[#22141A] text-[#4D4D54] dark:text-[#B8B3C0] border-[#E8E6E1] dark:border-[#422933]'
                  }`}
                >
                  {dur}m
                </button>
              ))}
            </div>

            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-[#7B1E2B]"
            />
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-xs font-bold text-[#4D4D54] dark:text-[#B8B3C0] uppercase tracking-wider mb-1.5">
              Foco Principal do Treino
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'acordes', label: 'Acordes & Trocas' },
                { id: 'tecnica', label: 'Técnica & Palhetada' },
                { id: 'repertorio', label: 'Música & Repertório' },
                { id: 'escalas', label: 'Escalas & Braço' },
                { id: 'teoria', label: 'Harmonia & Teoria' },
                { id: 'livre', label: 'Prática Livre' },
              ].map((act) => (
                <button
                  type="button"
                  key={act.id}
                  onClick={() => setActivityType(act.id as PracticeActivityType)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition truncate ${
                    activityType === act.id
                      ? 'bg-[#7B1E2B] dark:bg-[#FF6B81] text-white dark:text-[#180A0E] border-[#7B1E2B] dark:border-[#FF6B81]'
                      : 'bg-[#F8F7F4] dark:bg-[#22141A] text-[#4D4D54] dark:text-[#B8B3C0] border-[#E8E6E1] dark:border-[#422933] hover:bg-[#F5E8EA]'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>

          {/* Course Relation */}
          <div>
            <label className="block text-xs font-bold text-[#4D4D54] dark:text-[#B8B3C0] uppercase tracking-wider mb-1.5">
              Vinculado a qual Formação?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'violao', label: 'Academia Violão' },
                { id: 'solo', label: 'Guitarra Solo' },
                { id: 'canonical', label: 'Conservatório' },
                { id: 'livre', label: 'Prática Externa' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCourseRelation(c.id as PracticeCourseRelation)}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-bold border transition truncate ${
                    courseRelation === c.id
                      ? 'bg-[#7B1E2B] dark:bg-[#FF6B81] text-white dark:text-[#180A0E] border-[#7B1E2B] dark:border-[#FF6B81]'
                      : 'bg-[#F8F7F4] dark:bg-[#22141A] text-[#4D4D54] dark:text-[#B8B3C0] border-[#E8E6E1] dark:border-[#422933]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Perceived Difficulty */}
          <div>
            <label className="block text-xs font-bold text-[#4D4D54] dark:text-[#B8B3C0] uppercase tracking-wider mb-1.5">
              Sensação de Dificuldade
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'facil', label: 'Fácil (Fluido)' },
                { id: 'confortavel', label: 'Confortável' },
                { id: 'desafiador', label: 'Desafiador' },
                { id: 'dificil', label: 'Difícil' },
              ].map((diff) => (
                <button
                  type="button"
                  key={diff.id}
                  onClick={() => setPerceivedDifficulty(diff.id as PerceivedDifficulty)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                    perceivedDifficulty === diff.id
                      ? 'bg-[#7B1E2B] dark:bg-[#FF6B81] text-white dark:text-[#180A0E] border-[#7B1E2B] dark:border-[#FF6B81]'
                      : 'bg-[#F8F7F4] dark:bg-[#22141A] text-[#4D4D54] dark:text-[#B8B3C0] border-[#E8E6E1] dark:border-[#422933]'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#4D4D54] dark:text-[#B8B3C0] uppercase tracking-wider mb-1.5">
              Observações & Sensações (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Consegui manter a pestana sem chiar a 60 BPM..."
              className="w-full p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#22141A] border border-[#E8E6E1] dark:border-[#422933] text-xs text-[#25252A] dark:text-[#F8F7F4] focus:outline-hidden focus:border-[#7B1E2B]"
            />
          </div>

          {/* Submit & Cancel */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#F8F7F4] dark:bg-[#22141A] hover:bg-[#F2F2F2] text-[#666672] dark:text-[#B8B3C0] text-xs font-bold transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="luxury-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Registro de Prática</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Target, Clock, Check, X, Sparkles, TrendingUp, Award, Calendar } from 'lucide-react';

export interface DailyGoalSettingsProps {
  currentGoalMinutes: number;
  onSaveGoal: (newGoalMinutes: number) => void;
  onClose?: () => void;
  variant?: 'modal' | 'inline';
}

const PRESET_GOALS = [
  { minutes: 10, label: '10 min', description: 'Aquecimento rápido & manutenção do hábito' },
  { minutes: 15, label: '15 min', description: 'Consistência diária para iniciantes' },
  { minutes: 20, label: '20 min', description: 'Recomendado para rotina de fundamentos' },
  { minutes: 30, label: '30 min', description: 'Ritmo ideal de evolução técnica (padrão)' },
  { minutes: 45, label: '45 min', description: 'Estudo aprofundado: técnica + repertório' },
  { minutes: 60, label: '60 min', description: 'Formação intensiva e imersão musical' },
];

export const DailyGoalSettings: React.FC<DailyGoalSettingsProps> = ({
  currentGoalMinutes,
  onSaveGoal,
  onClose,
  variant = 'modal',
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(currentGoalMinutes || 30);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(
    !PRESET_GOALS.some((g) => g.minutes === currentGoalMinutes)
  );

  const weeklyHours = ((selectedMinutes * 7) / 60).toFixed(1);

  const handlePresetSelect = (minutes: number) => {
    setSelectedMinutes(minutes);
    setIsCustomMode(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMinutes(Number(e.target.value));
    setIsCustomMode(true);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      setSelectedMinutes(Math.max(5, Math.min(240, val)));
      setIsCustomMode(true);
    }
  };

  const handleSave = () => {
    const validMinutes = Math.max(5, Math.min(240, selectedMinutes));
    onSaveGoal(validMinutes);
    if (onClose) onClose();
  };

  // Get pedagogical advice based on minutes
  const getPedagogicalAdvice = (mins: number) => {
    if (mins <= 15) {
      return 'Perfeito para manter a sensibilidade nas pontas dos dedos e a memória muscular ativa sem cansaço.';
    }
    if (mins <= 30) {
      return 'A faixa padrão de excelência: tempo suficiente para aquecimento, 1 lição teórica e treino prático com metrônomo.';
    }
    if (mins <= 45) {
      return 'Excelente para dividir o estudo: 15 min de técnica (palhetada/dedilhado), 15 min de teoria e 15 min de músicas da biblioteca.';
    }
    return 'Nível avançado: faça pequenas pausas de 5 minutos a cada 25 minutos para relaxar a mão esquerda e evitar sobrecarga nos tendões.';
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-[#D9D9D9]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E8EA] border border-[#E8D3D6] text-[#7B1E2B] text-xs font-bold">
            <Target className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Configurar Meta de Estudo Diário</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#25252A]">
            Quanto tempo você quer praticar por dia?
          </h2>
          <p className="text-xs sm:text-sm text-[#666672]">
            Defina sua meta diária na guitarra. O anel de progresso na tela inicial acompanhará sua dedicação minuto a minuto.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#666672] hover:text-[#25252A] hover:bg-[#F2F2F2] transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Selected Goal Highlight Display */}
      <div className="bg-[#F8F7F4] border border-[#D9D9D9] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#7B1E2B] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
            {selectedMinutes}m
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#666672] uppercase tracking-wider block">
              Meta Selecionada
            </span>
            <div className="text-lg sm:text-xl font-extrabold text-[#25252A] flex items-center gap-2">
              <span>{selectedMinutes} minutos por dia</span>
            </div>
            <span className="text-xs text-[#7B1E2B] font-semibold flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              Aproximadamente {weeklyHours} horas de guitarra por semana
            </span>
          </div>
        </div>

        {/* Input numérico direto */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-[#D9D9D9] rounded-xl px-3 py-1.5 shadow-xs">
          <label htmlFor="custom-mins-input" className="text-xs font-bold text-[#666672]">
            Ajuste exato:
          </label>
          <input
            id="custom-mins-input"
            type="number"
            min="5"
            max="240"
            step="5"
            value={selectedMinutes}
            onChange={handleCustomInputChange}
            className="w-16 font-mono font-bold text-center text-sm text-[#25252A] focus:outline-none focus:border-[#7B1E2B]"
          />
          <span className="text-xs font-bold text-[#666672]">min</span>
        </div>
      </div>

      {/* Slider contínuo de 5 a 120 minutos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#666672]">
          <span>5 min (Mínimo)</span>
          <span className="text-[#7B1E2B] font-extrabold">{selectedMinutes} minutos</span>
          <span>120 min (Avançado)</span>
        </div>
        <input
          type="range"
          min="5"
          max="120"
          step="5"
          value={selectedMinutes}
          onChange={handleSliderChange}
          className="w-full accent-[#7B1E2B] cursor-pointer h-2 bg-[#E5E5E5] rounded-lg"
        />
      </div>

      {/* Grade de Metas Predefinidas */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#4D4D54] uppercase tracking-wider block">
          Metas Recomendadas:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {PRESET_GOALS.map((preset) => {
            const isSelected = selectedMinutes === preset.minutes && !isCustomMode;
            return (
              <button
                key={preset.minutes}
                type="button"
                onClick={() => handlePresetSelect(preset.minutes)}
                className={`p-3.5 rounded-2xl border text-left transition relative ${
                  isSelected
                    ? 'bg-[#F5E8EA] border-[#7B1E2B] text-[#7B1E2B] ring-2 ring-[#7B1E2B]/20 shadow-xs'
                    : 'bg-white border-[#D9D9D9] hover:bg-[#F8F7F4] text-[#25252A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold">{preset.label}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#7B1E2B] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-[#666672] mt-1 leading-snug">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conselho Pedagógico */}
      <div className="p-4 rounded-2xl bg-[#F5E8EA]/60 border border-[#E8D3D6] text-xs text-[#7B1E2B] flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#B52A3A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold block">Dica Pedagógica do Método Guitar Academy:</strong>
          <p className="leading-relaxed text-[#666672]">
            {getPedagogicalAdvice(selectedMinutes)}
          </p>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#D9D9D9] font-bold text-xs sm:text-sm text-[#666672] hover:bg-[#F2F2F2] transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-2"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Confirmar Meta de {selectedMinutes} Minutos</span>
        </button>
      </div>
    </div>
  );

  if (variant === 'inline') {
    return (
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs">
        {content}
      </div>
    );
  }

  // Modal Variant
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#D9D9D9] max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 my-8">
        {content}
      </div>
    </div>
  );
};

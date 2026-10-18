import React, { useState } from 'react';
import { UserProgress, NavigationTab } from '../../types';
import { storageService } from '../../services/storageService';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { Settings, Music, Clock, Sliders, Smartphone, Check, Target, ShieldCheck } from 'lucide-react';
import { DailyGoalSettings } from '../dashboard/DailyGoalSettings';

interface SettingsViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ progress, onUpdateProgress, onNavigateTab }) => {
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const updateSetting = <K extends keyof UserProgress>(key: K, value: UserProgress[K]) => {
    const updated = { ...progress, [key]: value };
    onUpdateProgress(updated);
    storageService.saveProgress(updated);
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

      {/* Settings Grid */}
      <div className="space-y-4">
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
              Verifique em tempo real o estado do localStorage, conectividade com o Professor IA, captação do microfone, perfil de domínio e a consistência das 21 habilidades e 18 aulas.
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

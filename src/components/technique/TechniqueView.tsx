import React, { useState } from 'react';
import { GUITAR_TECHNIQUES } from '../../data/techniqueData';
import { Activity, Flame, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TechniqueViewProps {
  onOpenMetronomeAtBpm: (bpm: number) => void;
}

export const TechniqueView: React.FC<TechniqueViewProps> = ({ onOpenMetronomeAtBpm }) => {
  const [selectedTechId, setSelectedTechId] = useState<string>(GUITAR_TECHNIQUES[0].id);

  const activeTech = GUITAR_TECHNIQUES.find((t) => t.id === selectedTechId) || GUITAR_TECHNIQUES[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Laboratório de Técnica de Guitarra</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Desenvolva velocidade, articulação limpa, controle motor e expressividade com exercícios metronômicos.
          </p>
        </div>
      </div>

      {/* Technique Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {GUITAR_TECHNIQUES.map((tech) => (
          <button
            key={tech.id}
            onClick={() => setSelectedTechId(tech.id)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
              tech.id === selectedTechId
                ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                : 'bg-white text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
            }`}
          >
            {tech.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Main Technique Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Technique Description & Practice BPM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D9D9D9]">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
                {activeTech.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F8F7F4] text-[#B52A3A] border border-[#D9D9D9]">
                Dificuldade: {activeTech.difficulty}
              </span>
            </div>

            <h2 className="text-2xl font-black text-[#25252A]">{activeTech.name}</h2>
            <p className="text-sm text-[#666672] leading-relaxed">{activeTech.explanation}</p>

            {/* Tablature Snippet */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                Exercício de Aplicação em Tablatura:
              </span>
              <pre className="bg-[#1A1A20] p-4 rounded-2xl text-xs sm:text-sm font-mono-code text-[#F8F7F4] overflow-x-auto border border-[#33333E] leading-relaxed shadow-inner">
                {activeTech.exerciseTab.trim()}
              </pre>
            </div>

            {/* Metronome Practice Launcher CTA */}
            <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] flex flex-wrap items-center justify-between gap-4 mt-4">
              <div>
                <span className="text-xs text-[#666672] block font-medium">Faixa de andamento recomendada:</span>
                <span className="text-sm font-bold text-[#25252A] font-mono-code">
                  Início: <strong className="text-[#7B1E2B]">{activeTech.recommendedBpmStart} BPM</strong> → Meta:{' '}
                  <strong className="text-[#B52A3A]">{activeTech.recommendedBpmGoal} BPM</strong>
                </span>
              </div>
              <button
                onClick={() => onOpenMetronomeAtBpm(activeTech.recommendedBpmStart)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] text-xs font-bold shadow-xs transition"
              >
                <Flame className="w-4 h-4 fill-current text-white" />
                <span>Praticar com Metrônomo ({activeTech.recommendedBpmStart} BPM)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key Points & Common Mistakes */}
        <div className="space-y-6">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#25252A] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pontos Críticos para Executar com Sucesso</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#666672]">
              {activeTech.keyPoints.map((kp, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#F8F7F4] p-2.5 rounded-xl border border-[#D9D9D9]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7B1E2B] mt-1.5 shrink-0" />
                  <span>{kp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#25252A] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#B52A3A]" />
              <span>Erros Mais Frequentes para Evitar</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#666672]">
              {activeTech.commonMistakes.map((cm, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#F8F7F4] p-2.5 rounded-xl border border-rose-200 text-[#25252A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B52A3A] mt-1.5 shrink-0" />
                  <span>{cm}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

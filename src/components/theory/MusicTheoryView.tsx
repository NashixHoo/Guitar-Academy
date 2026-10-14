import React, { useState } from 'react';
import { CIRCLE_OF_FIFTHS, INTERVALS } from '../../data/musicTheory';
import { Compass, Layers, Sparkles } from 'lucide-react';

export const MusicTheoryView: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('C');

  const circleKeyInfo = CIRCLE_OF_FIFTHS.find((k) => k.major === selectedKey) || CIRCLE_OF_FIFTHS[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Teoria Musical Aplicada à Guitarra</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Entenda a ciência por trás da harmonia, o Círculo de Quintas e as relações entre notas, acordes e escalas.
          </p>
        </div>
      </div>

      {/* Interactive Circle of Fifths Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Circle of Fifths Wheel / Selector */}
        <div className="lg:col-span-2 bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
            <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#7B1E2B]" />
              Círculo de Quintas Interativo
            </h2>
            <span className="text-xs text-[#666672] font-semibold">Selecione uma tonalidade</span>
          </div>

          <p className="text-xs text-[#666672] leading-relaxed">
            O mapa estelar da harmonia. Andar no sentido horário avança por intervalos de <strong>5ª Justa</strong> adicionando sustenidos (#). Andar no sentido anti-horário avança por <strong>4ª Justa</strong> adicionando bemóis (b).
          </p>

          {/* Interactive Wheel Representation Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
            {CIRCLE_OF_FIFTHS.map((item) => {
              const isSelected = selectedKey === item.major;
              return (
                <button
                  key={item.major}
                  onClick={() => setSelectedKey(item.major)}
                  className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs scale-105 font-bold'
                      : 'bg-[#F8F7F4] text-[#25252A] border-[#D9D9D9] hover:bg-[#F5E8EA]'
                  }`}
                >
                  <span className="text-lg font-black">{item.major}</span>
                  <span className={`text-[11px] font-semibold ${isSelected ? 'text-[#F5E8EA]' : 'text-[#B52A3A]'}`}>
                    {item.minor}
                  </span>
                  <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#666672]'}`}>
                    {item.sharpsFlats.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Key Details Card */}
          <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-[#D9D9D9] mt-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs text-[#7B1E2B] font-bold uppercase tracking-wider block">
                  Tonalidade Selecionada:
                </span>
                <h3 className="text-xl font-black text-[#25252A]">
                  {circleKeyInfo.keyPt} ({circleKeyInfo.major} / {circleKeyInfo.minor})
                </h3>
              </div>
              <span className="text-xs font-mono-code bg-[#F5E8EA] border border-[#E8D3D6] px-3 py-1.5 rounded-xl text-[#7B1E2B] font-bold">
                Armadura: {circleKeyInfo.sharpsFlats}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                <span className="text-[#666672] text-[10px] uppercase font-bold block">Tônica (I):</span>
                <span className="text-[#25252A] font-extrabold text-base">{circleKeyInfo.major}</span>
                <span className="text-[10px] text-[#666672] block">Repouso e estabilidade</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                <span className="text-[#666672] text-[10px] uppercase font-bold block">Subdominante (IV):</span>
                <span className="text-[#25252A] font-extrabold text-base">Vizinho à esquerda</span>
                <span className="text-[10px] text-[#666672] block">Abertura e movimento</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                <span className="text-[#666672] text-[10px] uppercase font-bold block">Dominante (V):</span>
                <span className="text-[#25252A] font-extrabold text-base">Vizinho à direita</span>
                <span className="text-[10px] text-[#666672] block">Tensão que pede volta ao I</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chord Construction Rules */}
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#25252A] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#7B1E2B]" />
            Formação de Tríades e Tétrades
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9]">
              <div className="flex justify-between items-center font-bold text-[#25252A]">
                <span className="text-[#7B1E2B]">Tríade Maior (M)</span>
                <span className="font-mono-code text-[#B52A3A]">1 - 3 - 5</span>
              </div>
              <p className="text-[#666672] text-[11px] mt-1 font-medium">
                Tônica + Terça Maior (4 semitons) + Quinta Justa (7 semitons). Ex: C (C - E - G).
              </p>
            </div>

            <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9]">
              <div className="flex justify-between items-center font-bold text-[#25252A]">
                <span className="text-[#7B1E2B]">Tríade Menor (m)</span>
                <span className="font-mono-code text-[#B52A3A]">1 - b3 - 5</span>
              </div>
              <p className="text-[#666672] text-[11px] mt-1 font-medium">
                Tônica + Terça Menor (3 semitons) + Quinta Justa (7 semitons). Ex: Cm (C - Eb - G).
              </p>
            </div>

            <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9]">
              <div className="flex justify-between items-center font-bold text-[#25252A]">
                <span className="text-[#7B1E2B]">Tríade Diminuta (°)</span>
                <span className="font-mono-code text-[#B52A3A]">1 - b3 - b5</span>
              </div>
              <p className="text-[#666672] text-[11px] mt-1 font-medium">
                Tônica + Terça Menor (3 semitons) + Quinta Diminuta (6 semitons).
              </p>
            </div>

            <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9]">
              <div className="flex justify-between items-center font-bold text-[#25252A]">
                <span className="text-[#7B1E2B]">Tétrade c/ 7ª Maior (7M)</span>
                <span className="font-mono-code text-[#B52A3A]">1 - 3 - 5 - 7</span>
              </div>
              <p className="text-[#666672] text-[11px] mt-1 font-medium">
                Tríade maior + Sétima maior (11 semitons). Som lírico de Bossa Nova.
              </p>
            </div>

            <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9]">
              <div className="flex justify-between items-center font-bold text-[#25252A]">
                <span className="text-[#7B1E2B]">Tétrade Dominante (7)</span>
                <span className="font-mono-code text-[#B52A3A]">1 - 3 - 5 - b7</span>
              </div>
              <p className="text-[#666672] text-[11px] mt-1 font-medium">
                Tríade maior + Sétima menor (10 semitons). Contém trítono entre 3ª e b7.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Intervals Reference Table */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B52A3A]" />
          Tabela Completa de Intervalos Musicais e Distância no Braço
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#25252A]">
            <thead className="bg-[#F8F7F4] text-[#666672] uppercase font-bold text-[10px] tracking-wider border-b border-[#D9D9D9]">
              <tr>
                <th className="p-3">Intervalo</th>
                <th className="p-3">Abreviatura</th>
                <th className="p-3">Semitons</th>
                <th className="p-3">Distância na Guitarra</th>
                <th className="p-3">Exemplo</th>
                <th className="p-3">Sensação Sonora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9D9] font-medium">
              {INTERVALS.map((inter) => (
                <tr key={inter.name} className="hover:bg-[#F8F7F4] transition">
                  <td className="p-3 font-bold text-[#25252A]">{inter.name}</td>
                  <td className="p-3 font-mono-code text-[#7B1E2B] font-bold">{inter.shortName}</td>
                  <td className="p-3 font-mono-code text-[#B52A3A] font-bold">{inter.semitones} st</td>
                  <td className="p-3 text-[#666672]">{inter.fretDistance}</td>
                  <td className="p-3 text-[#25252A] font-semibold">{inter.example}</td>
                  <td className="p-3 text-[#666672]">{inter.soundDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

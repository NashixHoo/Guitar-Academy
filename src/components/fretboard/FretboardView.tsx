import React, { useState } from 'react';
import { InteractiveFretboard } from './InteractiveFretboard';
import { CHROMATIC_NOTES, CIPHER_TO_PT, SCALES } from '../../data/musicTheory';
import { NoteCipher } from '../../types';
import { Guitar, Eye, Music, Layers, Sparkles } from 'lucide-react';

export const FretboardView: React.FC = () => {
  const [notation, setNotation] = useState<'cipher' | 'portuguese' | 'both'>('both');
  const [selectedNote, setSelectedNote] = useState<NoteCipher | 'NONE'>('NONE');
  const [selectedScale, setSelectedScale] = useState<string>('none');
  const [scaleRoot, setScaleRoot] = useState<NoteCipher>('A');
  const [showAllNotes, setShowAllNotes] = useState<boolean>(true);
  const [maxFrets, setMaxFrets] = useState<number>(15);

  const highlightedNotes = React.useMemo(() => {
    if (selectedScale !== 'none') {
      const scaleDef = SCALES.find((s) => s.id === selectedScale);
      if (scaleDef) {
        const rootIndex = CHROMATIC_NOTES.indexOf(scaleRoot);
        return scaleDef.intervals.map((semitones) => {
          return CHROMATIC_NOTES[(rootIndex + semitones) % 12];
        });
      }
    }
    if (selectedNote !== 'NONE') {
      return [selectedNote];
    }
    return [];
  }, [selectedScale, scaleRoot, selectedNote]);

  const activeScaleDef = SCALES.find((s) => s.id === selectedScale);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Guitar className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Mapa Pedagógico do Braço (Referência Física)</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Consulte a geometria do instrumento, localize notas e escalas no braço da sua guitarra física sem distrações virtuais.
          </p>
        </div>

        {/* View Options Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-[#F8F7F4] p-1 rounded-xl border border-[#D9D9D9] flex items-center text-xs">
            <button
              onClick={() => setNotation('cipher')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                notation === 'cipher' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
              }`}
            >
              Cifra (C)
            </button>
            <button
              onClick={() => setNotation('portuguese')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                notation === 'portuguese' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
              }`}
            >
              Nome (Dó)
            </button>
            <button
              onClick={() => setNotation('both')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                notation === 'both' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
              }`}
            >
              Ambos
            </button>
          </div>
        </div>
      </div>

      {/* Control Strip: Scale Selector, Single Note Finder, Max Frets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Scale Finder */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs space-y-3">
          <label className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#B52A3A]" />
            <span>Mapear Escala no Braço</span>
          </label>

          <div className="flex gap-2">
            <select
              value={scaleRoot}
              onChange={(e) => setScaleRoot(e.target.value as NoteCipher)}
              className="bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-3 py-2 text-xs font-bold text-[#25252A] focus:border-[#7B1E2B] focus:outline-none"
            >
              {CHROMATIC_NOTES.map((n) => (
                <option key={`scale-root-${n}`} value={n}>
                  {n} ({CIPHER_TO_PT[n]})
                </option>
              ))}
            </select>

            <select
              value={selectedScale}
              onChange={(e) => {
                setSelectedScale(e.target.value);
                if (e.target.value !== 'none') setSelectedNote('NONE');
              }}
              className="flex-1 bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-3 py-2 text-xs font-bold text-[#25252A] focus:border-[#7B1E2B] focus:outline-none"
            >
              <option value="none">Nenhuma escala (Manual)</option>
              {SCALES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {activeScaleDef && (
            <div className="text-[11px] text-[#666672] bg-[#F8F7F4] p-2.5 rounded-xl border border-[#D9D9D9] space-y-1">
              <div className="font-mono-code text-[#7B1E2B] font-bold">
                Fórmula: {activeScaleDef.formula}
              </div>
              <div className="text-[#25252A]">{activeScaleDef.description}</div>
            </div>
          )}
        </div>

        {/* Locate Single Note */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs space-y-3">
          <label className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1.5 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-[#B52A3A]" />
            <span>Localizar Nota Específica</span>
          </label>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedNote('NONE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedNote === 'NONE'
                  ? 'bg-[#7B1E2B] text-white shadow-xs'
                  : 'bg-[#F8F7F4] text-[#666672] hover:text-[#25252A] border border-[#D9D9D9]'
              }`}
            >
              Limpar
            </button>
            {CHROMATIC_NOTES.map((note) => (
              <button
                key={`single-${note}`}
                onClick={() => {
                  setSelectedNote(note);
                  setSelectedScale('none');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  selectedNote === note
                    ? 'bg-[#7B1E2B] text-white shadow-xs'
                    : 'bg-[#F8F7F4] text-[#25252A] hover:bg-[#F5E8EA] border border-[#D9D9D9]'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        {/* Neck Scope & Fret Limit */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs space-y-3">
          <label className="text-xs font-bold text-[#25252A] flex items-center gap-1.5 uppercase tracking-wider">
            <Music className="w-4 h-4 text-[#7B1E2B]" />
            <span>Extensão do Braço</span>
          </label>

          <div className="flex items-center gap-2">
            {[12, 15, 18, 22].map((fretCount) => (
              <button
                key={`fret-limit-${fretCount}`}
                onClick={() => setMaxFrets(fretCount)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                  maxFrets === fretCount
                    ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                    : 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9] hover:text-[#25252A]'
                }`}
              >
                {fretCount} Casas
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={showAllNotes}
              onChange={(e) => setShowAllNotes(e.target.checked)}
              className="w-4 h-4 accent-[#7B1E2B] rounded"
            />
            <span className="text-xs text-[#666672] font-medium">
              Exibir todas as notas simultaneamente
            </span>
          </label>
        </div>
      </div>

      {/* Main Interactive Fretboard Component */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs">
        <InteractiveFretboard
          maxFrets={maxFrets}
          highlightedNotes={highlightedNotes}
          rootNote={selectedScale !== 'none' ? scaleRoot : selectedNote !== 'NONE' ? selectedNote : undefined}
          showAllNotes={showAllNotes}
          notation={notation}
        />
      </div>

      {/* Educational Tips Card */}
      <div className="bg-white border border-[#D9D9D9] rounded-2xl p-6 shadow-xs flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-[#F5E8EA] border border-[#E8D3D6] text-[#7B1E2B] shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 text-[#B52A3A]" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-[#666672]">
          <h4 className="font-bold text-[#25252A] text-base">
            Como memorizar as notas do braço da guitarra com eficácia:
          </h4>
          <p>
            1. <strong>Foque primeiro nas cordas 6 e 5</strong>: são as cordas fundamentais onde você ancora a maioria das pestanas, power chords e escalas.
          </p>
          <p>
            2. <strong>Regra da Oitava em formato L</strong>: avance 2 cordas para baixo e 2 casas para a direita (ex: Casa 3 da 6ª corda é Sol; Casa 5 da 4ª corda também é Sol).
          </p>
          <p>
            3. <strong>A Casa 12 é o espelho perfeito</strong>: tudo o que acontece nas cordas soltas se repete de forma idêntica a partir da casa 12.
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useChordModal } from '../../contexts/ChordModalContext';
import { ChordDiagram } from './ChordDiagram';
import { X, Star, Music, Sparkles } from 'lucide-react';

export const ChordPreviewModal: React.FC = () => {
  const { activeChord, closeChord, favoriteChords, onToggleFavorite } = useChordModal();

  if (!activeChord) return null;

  const isFav = Boolean(activeChord.chordDbId && favoriteChords.includes(activeChord.chordDbId));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chord-modal-title"
      data-testid="chord-preview-modal"
      onClick={closeChord}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white dark:bg-[#22141A] border border-[#D9D9D9] dark:border-[#422933] rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4"
      >
        {/* Modal Header: Tappable chord name closes modal on second tap */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E8E6E1] dark:border-[#422933]">
          <button
            type="button"
            onClick={closeChord}
            title="Toque novamente no nome do acorde para fechar"
            className="text-left group focus:outline-hidden"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                id="chord-modal-title"
                className="text-3xl sm:text-4xl font-black font-mono-code text-[#7B1E2B] dark:text-[#FF6B81] group-hover:opacity-80 transition leading-none"
              >
                {activeChord.symbol}
              </span>
              {activeChord.cagedForm && (
                <span className="text-[11px] font-mono-code font-bold px-2 py-0.5 rounded-md bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8D3D6] dark:border-[#4D2830]">
                  Forma {activeChord.cagedForm}
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-[#25252A] dark:text-[#F8F7F4] mt-1">
              {activeChord.namePt}
            </p>
            <span className="text-[11px] text-[#666672] dark:text-[#B8B3C0] block mt-0.5">
              {activeChord.category}
              {activeChord.formula ? ` · Fórmula ${activeChord.formula}` : ''}
              {activeChord.baseFret > 1 ? ` · Casa base ${activeChord.baseFret}ª` : ''}
            </span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            {activeChord.chordDbId && onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(activeChord.chordDbId!)}
                aria-label={isFav ? 'Remover dos favoritos' : 'Salvar acorde nos favoritos'}
                className={`min-w-[44px] min-h-[44px] rounded-2xl border flex items-center justify-center transition ${
                  isFav
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-[#F5C542]'
                    : 'bg-[#F8F7F4] dark:bg-[#1A1216] border-[#D9D9D9] dark:border-[#422933] text-[#8C8C9A] hover:text-[#F5C542]'
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            )}

            <button
              type="button"
              onClick={closeChord}
              aria-label="Fechar janela do acorde"
              className="min-w-[44px] min-h-[44px] rounded-2xl bg-[#F8F7F4] dark:bg-[#1A1216] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] border border-[#D9D9D9] dark:border-[#422933] text-[#25252A] dark:text-[#F8F7F4] flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Enlarged, crystal-clear Chord Diagram (light sheet canvas for maximum fret/finger contrast) */}
        <ChordDiagram
          frets={activeChord.frets}
          fingers={activeChord.fingers}
          symbol={activeChord.symbol}
          namePt={activeChord.namePt}
          baseFret={activeChord.baseFret}
          barre={activeChord.barre}
          notes={activeChord.notes}
          notesPt={activeChord.notesPt}
          formula={activeChord.formula}
          category={activeChord.category}
          cagedForm={activeChord.cagedForm}
          size="lg"
          showTitle={false}
          showDetails={false}
          showAudio={true}
          showStringLabels={true}
          showFretNumbers={true}
          showFingerLegend={true}
          className="w-full"
        />

        {/* Pestana notice when present */}
        {activeChord.barre && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-900 dark:text-amber-300 text-center">
            Pestana na {activeChord.barre.fret}ª casa (cordas {activeChord.barre.fromString}ª a {activeChord.barre.toString}ª)
          </div>
        )}

        {/* Notes & Execution Tips */}
        {(activeChord.notes.length > 0 || activeChord.tips || activeChord.description) && (
          <div className="bg-[#F8F7F4] dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] rounded-2xl p-4 space-y-2.5 text-xs">
            {activeChord.notes.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E8E6E1] dark:border-[#422933]">
                <span className="font-bold text-[#7B1E2B] dark:text-[#FF6B81] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Music className="w-3.5 h-3.5" />
                  Notas do Acorde
                </span>
                <div className="text-right">
                  <span className="font-mono-code font-black text-sm text-[#25252A] dark:text-[#F8F7F4]">
                    {activeChord.notes.join(' · ')}
                  </span>
                  {activeChord.notesPt.length > 0 && (
                    <span className="block text-[11px] text-[#666672] dark:text-[#B8B3C0]">
                      {activeChord.notesPt.join(' · ')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {(activeChord.tips || activeChord.description) && (
              <p className="text-[#4D4D54] dark:text-[#E0DDE5] leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#7B1E2B] dark:text-[#FF6B81] shrink-0 mt-0.5" />
                <span>{activeChord.tips || activeChord.description}</span>
              </p>
            )}
          </div>
        )}

        {/* Clear close button */}
        <button
          type="button"
          onClick={closeChord}
          className="w-full min-h-[44px] py-2.5 rounded-2xl bg-[#F5E8EA] dark:bg-[#381A25] hover:bg-[#ead6d9] dark:hover:bg-[#4A2231] text-[#7B1E2B] dark:text-[#FF6B81] font-bold text-xs sm:text-sm border border-[#E8D3D6] dark:border-[#4D2830] transition"
        >
          Fechar Diagrama (toque no acorde novamente ou Esc)
        </button>
      </div>
    </div>
  );
};

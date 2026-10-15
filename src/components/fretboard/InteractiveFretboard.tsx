import React, { useState } from 'react';
import { STANDARD_TUNING, getFretNote, CIPHER_TO_PT } from '../../data/musicTheory';
import { audioEngine } from '../../audio/audioEngine';
import { Volume2, ShieldAlert } from 'lucide-react';
import { NoteCipher } from '../../types';

interface InteractiveFretboardProps {
  maxFrets?: number;
  highlightedNotes?: NoteCipher[];
  highlightedFrets?: { stringIndex: number; fret: number; label?: string }[];
  rootNote?: NoteCipher;
  showAllNotes?: boolean;
  notation?: 'cipher' | 'portuguese' | 'both';
  onNoteSelected?: (note: { cipher: string; pt: string; fret: number; stringNumber: number; freq: number }) => void;
}

/**
 * Diagrama Pedagógico de Referência do Braço da Guitarra
 * Princípio pedagógico inegociável: A guitarra física é o instrumento de estudo.
 * Este componente funciona como mapa visual estático de alta clareza para guiar
 * o olhar do aluno na guitarra física real, sem cliques virtuais que substituam o treino motor.
 */
export const InteractiveFretboard: React.FC<InteractiveFretboardProps> = ({
  maxFrets = 12,
  highlightedNotes = [],
  highlightedFrets = [],
  rootNote,
  showAllNotes = false,
  notation = 'both',
}) => {
  const [playingString, setPlayingString] = useState<number | null>(null);

  // Inlay markers (dots) no padrão Giannini / Stratocaster
  const singleDots = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleDots = [12, 24];

  // Strings from 1 (high E) to 6 (low E)
  const strings = [...STANDARD_TUNING];

  const playStringPitch = (stringDef: typeof STANDARD_TUNING[0]) => {
    setPlayingString(stringDef.stringNumber);
    audioEngine.playGuitarNote(stringDef.openFrequencyHz, 2.5, 0.8);
    setTimeout(() => setPlayingString(null), 1500);
  };

  const frets = Array.from({ length: maxFrets + 1 }, (_, i) => i);

  return (
    <div className="w-full select-none space-y-3">
      {/* Pedagogical Guidance Banner & Reference Pitch Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 text-xs text-[#25252A] bg-white px-3.5 py-2 rounded-xl border border-[#D9D9D9] shadow-xs">
          <ShieldAlert className="w-4 h-4 text-[#7B1E2B] shrink-0" />
          <span className="font-semibold">
            Guia Visual de Apoio: localize estas casas na sua <strong className="text-[#7B1E2B]">guitarra física</strong>.
          </span>
        </div>

        {/* Reference Audio Pitch for Physical Guitar Tuning */}
        <div className="flex items-center gap-1.5 bg-white border border-[#D9D9D9] px-3 py-1.5 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-[#666672] flex items-center gap-1 mr-1">
            <Volume2 className="w-3.5 h-3.5 text-[#7B1E2B]" />
            Afinação por Ouvido:
          </span>
          {strings.map((str) => (
            <button
              key={`tune-btn-${str.stringNumber}`}
              onClick={() => playStringPitch(str)}
              className={`px-2 py-0.5 rounded-lg text-xs font-mono-code font-bold transition ${
                playingString === str.stringNumber
                  ? 'bg-[#7B1E2B] text-white scale-105'
                  : 'bg-[#F8F7F4] text-[#25252A] hover:bg-[#F5E8EA] border border-[#D9D9D9]'
              }`}
              title={`Ouvir afinação da ${str.stringNumber}ª corda: ${str.openNoteCipher} (${str.openNotePt})`}
            >
              {str.stringNumber}ª {str.openNoteCipher}
            </button>
          ))}
        </div>
      </div>

      {/* Static Visual Fretboard Container */}
      <div className="overflow-x-auto pb-4 pt-1 rounded-2xl border border-[#D9D9D9] bg-[#F8F7F4] shadow-xs">
        <div className="min-w-[840px] p-4 relative">
          {/* Fretboard Dark Rosewood Neck */}
          <div className="relative bg-[#1A1A20] rounded-xl border border-[#33333E] overflow-hidden shadow-inner">
            
            {/* Bone Nut (Pestana inicial branca da Giannini) */}
            <div className="absolute left-[64px] top-0 bottom-0 w-[8px] bg-gradient-to-r from-[#ECEAE4] via-[#FFFFFF] to-[#D5D2CA] shadow-md z-10" />

            {/* Fret position numbers at top */}
            <div className="flex text-xs text-[#A1A1AA] font-mono-code py-1.5 border-b border-[#2D2D37] bg-[#141419]">
              <div className="w-[64px] text-center font-bold text-white/50 text-[11px]">Corda</div>
              {frets.map((fret) => (
                <div
                  key={`top-fret-${fret}`}
                  className={`flex-1 text-center font-semibold text-[11px] ${
                    fret === 0 ? 'w-[64px] flex-none text-[#F5E8EA]' : ''
                  } ${[3, 5, 7, 9, 12, 15, 17].includes(fret) ? 'text-[#F5E8EA] font-black' : ''}`}
                >
                  {fret === 0 ? 'Solta (0)' : `${fret}ª`}
                </div>
              ))}
            </div>

            {/* Strings and Frets Grid */}
            <div className="relative py-2">
              {strings.map((stringDef, stringIndex) => {
                const thickness = 1.6 + stringIndex * 0.7;
                const stringNumber = stringDef.stringNumber;

                return (
                  <div
                    key={`string-row-${stringNumber}`}
                    className="relative flex items-center h-[40px]"
                  >
                    {/* Visual Metal Chrome String line */}
                    <div
                      className="absolute left-[64px] right-0 pointer-events-none z-0"
                      style={{
                        height: `${thickness}px`,
                        background:
                          stringIndex >= 3
                            ? 'linear-gradient(180deg, #F8FAFC 0%, #CBD5E1 50%, #94A3B8 100%)' // Wound strings (E, A, D)
                            : 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 50%, #CBD5E1 100%)', // Plain steel strings (G, B, E)
                        boxShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      }}
                    />

                    {/* String label on headstock / left side */}
                    <div className="w-[64px] flex-none flex flex-col items-center justify-center rounded-l-lg z-20">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <span className="text-[#F5E8EA] font-extrabold">{stringDef.openNoteCipher}</span>
                        <span className="text-[10px] text-[#A1A1AA]">({stringNumber}ª)</span>
                      </span>
                      <span className="text-[9px] text-[#A1A1AA]">{stringDef.openNotePt}</span>
                    </div>

                    {/* Frets for this string */}
                    {frets.map((fret) => {
                      const note = getFretNote(stringDef, fret);
                      const isHighlightedByNote = highlightedNotes.includes(note.cipher);
                      const isHighlightedByPos = highlightedFrets.some(
                        (hf) => hf.stringIndex === (6 - stringNumber) && hf.fret === fret
                      );
                      const isRoot = rootNote === note.cipher;

                      const shouldDisplayLabel =
                        showAllNotes ||
                        isHighlightedByNote ||
                        isHighlightedByPos ||
                        fret === 0;

                      return (
                        <div
                          key={`cell-${stringNumber}-${fret}`}
                          className={`relative flex-1 h-full flex items-center justify-center ${
                            fret === 0 ? 'w-[64px] flex-none' : 'border-r border-[#33333E]'
                          }`}
                        >
                          {/* Fret wire reflection */}
                          {fret > 0 && (
                            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#CBD5E1] via-[#FFFFFF] to-[#94A3B8] pointer-events-none" />
                          )}

                          {/* Pearl Inlay Markers on fretboard */}
                          {stringIndex === 2 && fret > 0 && singleDots.includes(fret) && (
                            <div className="absolute top-[35px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#E5E5EB] border border-white shadow-inner pointer-events-none z-0" />
                          )}
                          {stringIndex === 2 && fret > 0 && doubleDots.includes(fret) && (
                            <>
                              <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E5E5EB] border border-white shadow-inner pointer-events-none z-0" />
                              <div className="absolute top-[54px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E5E5EB] border border-white shadow-inner pointer-events-none z-0" />
                            </>
                          )}

                          {/* Note Pin/Marker Badge */}
                          {shouldDisplayLabel && (
                            <div
                              className={`z-20 flex flex-col items-center justify-center rounded-full transition-all duration-150 ${
                                isRoot
                                  ? 'bg-[#7B1E2B] text-white font-black w-7 h-7 shadow-md scale-110 ring-2 ring-[#B52A3A]'
                                  : isHighlightedByPos || isHighlightedByNote
                                  ? 'bg-[#B52A3A] text-white font-bold w-6 h-6 shadow-xs scale-105'
                                  : 'bg-[#25252A] text-[#F8F7F4] border border-[#3E3E4A] w-5 h-5 text-[10px]'
                              }`}
                            >
                              <span className="text-[11px] leading-none font-bold">
                                {notation === 'portuguese' ? note.pt : note.cipher}
                              </span>
                              {notation === 'both' && (
                                <span className="text-[7px] leading-none opacity-85">
                                  {CIPHER_TO_PT[note.cipher] || note.pt}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend and Inlays indicator */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-[#666672] gap-3 px-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-3.5 h-3.5 rounded-full bg-[#7B1E2B] inline-block ring-2 ring-[#B52A3A]" />
                Tônica (Fundamental)
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-3.5 h-3.5 rounded-full bg-[#B52A3A] inline-block" />
                Notas da Escala / Seleção
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#25252A] border border-[#3E3E4A] inline-block" />
                Demais Notas
              </span>
            </div>

            <div className="text-[11px] italic">
              Marcações (Inlays): Casas 3, 5, 7, 9 e 12 (oitava)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

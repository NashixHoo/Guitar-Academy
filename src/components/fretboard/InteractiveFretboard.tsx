import React, { useState } from 'react';
import { STANDARD_TUNING, getFretNote, CHROMATIC_NOTES, CIPHER_TO_PT } from '../../data/musicTheory';
import { audioEngine } from '../../audio/audioEngine';
import { Volume2, Sparkles } from 'lucide-react';
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

export const InteractiveFretboard: React.FC<InteractiveFretboardProps> = ({
  maxFrets = 12,
  highlightedNotes = [],
  highlightedFrets = [],
  rootNote,
  showAllNotes = false,
  notation = 'both',
  onNoteSelected,
}) => {
  const [activeFret, setActiveFret] = useState<{ stringIndex: number; fret: number; cipher: string; pt: string; freq: number } | null>(null);

  // Inlay markers (dots)
  const singleDots = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleDots = [12, 24];

  // Strings from 1 (high E) to 6 (low E) in STANDARD_TUNING
  const strings = [...STANDARD_TUNING];

  const handleFretClick = (stringDef: typeof STANDARD_TUNING[0], stringIndex: number, fret: number) => {
    const note = getFretNote(stringDef, fret);
    audioEngine.playGuitarNote(note.frequencyHz, 2.0, 0.75);

    const fretInfo = {
      stringIndex,
      fret,
      cipher: note.cipher,
      pt: note.pt,
      freq: Math.round(note.frequencyHz * 10) / 10,
    };
    setActiveFret(fretInfo);
    if (onNoteSelected) {
      onNoteSelected({
        cipher: note.cipher,
        pt: note.pt,
        fret,
        stringNumber: stringDef.stringNumber,
        freq: fretInfo.freq,
      });
    }
  };

  const frets = Array.from({ length: maxFrets + 1 }, (_, i) => i);

  return (
    <div className="w-full select-none">
      {/* Active Note Feedback Card */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {activeFret ? (
            <div className="flex items-center gap-2 bg-white border border-[#D9D9D9] px-3.5 py-1.5 rounded-xl shadow-xs animate-in fade-in">
              <Volume2 className="w-4 h-4 text-[#7B1E2B] animate-pulse" />
              <div className="text-sm">
                <span className="font-extrabold text-[#7B1E2B] text-base">{activeFret.cipher}</span>
                <span className="text-[#666672] text-xs ml-1.5 font-semibold">({activeFret.pt})</span>
                <span className="text-[#D9D9D9] text-xs ml-2">|</span>
                <span className="text-[#B52A3A] text-xs ml-2 font-mono-code font-bold">{activeFret.freq} Hz</span>
                <span className="text-[#666672] text-xs ml-2">
                  • {6 - activeFret.stringIndex}ª corda, Casa {activeFret.fret === 0 ? 'Solta' : activeFret.fret}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#666672] bg-white px-3.5 py-1.5 rounded-xl border border-[#D9D9D9] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
              <span>Toque em qualquer casa para ouvir o som e identificar a nota</span>
            </div>
          )}
        </div>
        <div className="text-[11px] text-[#666672] italic font-medium">
          * Áudio sintetizado de referência (Giannini 101 HSS)
        </div>
      </div>

      {/* Scrollable fretboard container */}
      <div className="overflow-x-auto pb-4 pt-1 rounded-2xl border border-[#D9D9D9] bg-[#F8F7F4] shadow-xs">
        <div className="min-w-[820px] p-4 relative">
          {/* Fretboard Dark Rosewood Neck */}
          <div className="relative bg-[#1A1A20] rounded-xl border border-[#33333E] overflow-hidden shadow-inner">
            
            {/* Bone Nut (Pestana inicial) */}
            <div className="absolute left-[54px] top-0 bottom-0 w-[8px] bg-gradient-to-r from-[#ECEAE4] via-[#FFFFFF] to-[#D5D2CA] shadow-md z-10" />

            {/* Fret position numbers at top */}
            <div className="flex text-xs text-[#A1A1AA] font-mono-code py-1.5 border-b border-[#2D2D37] bg-[#141419]">
              <div className="w-[54px] text-center font-bold text-white/50 text-[11px]">Corda</div>
              {frets.map((fret) => (
                <div
                  key={`top-fret-${fret}`}
                  className={`flex-1 text-center font-semibold text-[11px] ${
                    fret === 0 ? 'w-[54px] flex-none text-[#F5E8EA]' : ''
                  } ${[3, 5, 7, 9, 12, 15, 17].includes(fret) ? 'text-[#F5E8EA] font-black' : ''}`}
                >
                  {fret === 0 ? 'Solta (0)' : fret}
                </div>
              ))}
            </div>

            {/* Strings and Frets Grid */}
            <div className="relative py-2">
              {strings.map((stringDef, stringIndex) => {
                const thickness = 1.5 + stringIndex * 0.65;
                const stringNumber = stringDef.stringNumber;

                return (
                  <div
                    key={`string-row-${stringNumber}`}
                    className="relative flex items-center h-[38px] group hover:bg-white/[0.03] transition-colors"
                  >
                    {/* Visual Metal Chrome String line */}
                    <div
                      className="absolute left-[54px] right-0 pointer-events-none z-0"
                      style={{
                        height: `${thickness}px`,
                        background:
                          stringIndex >= 3
                            ? 'linear-gradient(180deg, #F8FAFC 0%, #CBD5E1 50%, #94A3B8 100%)' // Wound strings
                            : 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 50%, #CBD5E1 100%)', // Plain steel strings
                        boxShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      }}
                    />

                    {/* String label on headstock / left side */}
                    <div
                      onClick={() => handleFretClick(stringDef, stringIndex, 0)}
                      className="w-[54px] flex-none flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 rounded-l-lg transition-colors z-20"
                      title={`Tocar ${stringNumber}ª corda solta: ${stringDef.openNoteCipher} (${stringDef.openNotePt})`}
                    >
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <span className="text-[#F5E8EA]">{stringDef.openNoteCipher}</span>
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
                      const isActive = activeFret?.stringIndex === stringIndex && activeFret?.fret === fret;

                      const shouldDisplayLabel =
                        showAllNotes ||
                        isHighlightedByNote ||
                        isHighlightedByPos ||
                        isActive ||
                        fret === 0;

                      return (
                        <div
                          key={`cell-${stringNumber}-${fret}`}
                          onClick={() => handleFretClick(stringDef, stringIndex, fret)}
                          className={`relative flex-1 h-full flex items-center justify-center cursor-pointer group/cell ${
                            fret === 0 ? 'w-[54px] flex-none' : 'border-r border-[#33333E]'
                          } ${isActive ? 'bg-[#7B1E2B]/30' : 'hover:bg-white/[0.04]'}`}
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
                                  ? 'bg-[#7B1E2B] text-white font-black w-7 h-7 shadow-md scale-105 ring-2 ring-[#B52A3A]'
                                  : isHighlightedByPos || isHighlightedByNote
                                  ? 'bg-[#B52A3A] text-white font-bold w-6 h-6 shadow-xs scale-105'
                                  : isActive
                                  ? 'bg-white text-[#7B1E2B] font-black w-6 h-6 ring-2 ring-[#7B1E2B]'
                                  : 'bg-[#25252A] text-[#F8F7F4] border border-[#3E3E4A] w-5 h-5 text-[10px]'
                              }`}
                            >
                              <span className="text-[11px] leading-none font-bold">
                                {notation === 'portuguese' ? note.pt : note.cipher}
                              </span>
                              {notation === 'both' && (
                                <span className="text-[7px] leading-none opacity-85">
                                  {note.pt}
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
        </div>
      </div>
    </div>
  );
};

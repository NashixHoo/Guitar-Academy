import React, { useState } from 'react';
import { ChordShape } from '../../types';
import { audioEngine } from '../../audio/audioEngine';
import { getChordFrequencies } from '../../data/chordDatabase';
import { Play, Music } from 'lucide-react';

interface ChordDiagramProps {
  chord: ChordShape;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chord,
  size = 'md',
  showDetails = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayChord = (arpeggio: boolean = false) => {
    setIsPlaying(true);
    const freqs = getChordFrequencies(chord);
    audioEngine.playChord(freqs, arpeggio, 25);
    setTimeout(() => setIsPlaying(false), arpeggio ? 1200 : 800);
  };

  const dimensions = {
    sm: { width: 140, height: 170, startX: 20, startY: 35, stringGap: 20, fretGap: 24, radius: 7 },
    md: { width: 180, height: 215, startX: 25, startY: 42, stringGap: 26, fretGap: 30, radius: 9 },
    lg: { width: 220, height: 260, startX: 30, startY: 50, stringGap: 32, fretGap: 36, radius: 11 },
  }[size];

  const { width, height, startX, startY, stringGap, fretGap, radius } = dimensions;
  const numFrets = 4;
  const baseFret = chord.baseFret || 1;

  return (
    <div className="flex flex-col items-center bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs hover:border-[#7B1E2B] transition-all group">
      {/* Chord Header */}
      <div className="text-center w-full mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
            {chord.category}
          </span>
          <span className="text-xs font-mono-code font-bold text-[#B52A3A]">
            {chord.formula}
          </span>
        </div>
        <h3 className="text-2xl font-black text-[#25252A] mt-1 group-hover:text-[#7B1E2B] transition-colors">
          {chord.symbol}
        </h3>
        <p className="text-xs text-[#666672] font-medium">{chord.namePt}</p>
      </div>

      {/* SVG Chord Box */}
      <div className="relative my-1">
        <svg width={width} height={height} className="select-none">
          {/* Top Nut or Base Fret Number */}
          {baseFret === 1 ? (
            <line
              x1={startX}
              y1={startY}
              x2={startX + 5 * stringGap}
              y2={startY}
              stroke="#25252A"
              strokeWidth="5"
              strokeLinecap="round"
            />
          ) : (
            <>
              <line
                x1={startX}
                y1={startY}
                x2={startX + 5 * stringGap}
                y2={startY}
                stroke="#666672"
                strokeWidth="2"
              />
              <text
                x={startX - 14}
                y={startY + fretGap / 1.5}
                fill="#7B1E2B"
                fontSize="11"
                fontWeight="bold"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
              >
                {baseFret}ª
              </text>
            </>
          )}

          {/* Horizontal Fret Lines (Silver) */}
          {Array.from({ length: numFrets + 1 }).map((_, f) => (
            <line
              key={`fret-${f}`}
              x1={startX}
              y1={startY + f * fretGap}
              x2={startX + 5 * stringGap}
              y2={startY + f * fretGap}
              stroke="#D9D9D9"
              strokeWidth="1.5"
            />
          ))}

          {/* Vertical String Lines (Chrome graphite) */}
          {Array.from({ length: 6 }).map((_, s) => (
            <line
              key={`string-${s}`}
              x1={startX + s * stringGap}
              y1={startY}
              x2={startX + s * stringGap}
              y2={startY + numFrets * fretGap}
              stroke="#666672"
              strokeWidth={s === 0 ? '2.5' : s === 5 ? '1' : '1.8'}
            />
          ))}

          {/* Barre Indicator if exists (Wine Red) */}
          {chord.barre && (
            <rect
              x={startX + (6 - chord.barre.fromString) * stringGap - radius}
              y={startY + (chord.barre.fret - baseFret + 0.5) * fretGap - radius}
              width={(chord.barre.fromString - chord.barre.toString) * stringGap + 2 * radius}
              height={2 * radius}
              rx={radius}
              fill="#7B1E2B"
              fillOpacity="0.9"
            />
          )}

          {/* Open / Muted string markers above nut */}
          {chord.frets.map((fretVal, stringIdx) => {
            const x = startX + stringIdx * stringGap;
            const y = startY - 12;

            if (fretVal === -1) {
              return (
                <text
                  key={`mute-${stringIdx}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill="#B52A3A"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  ✕
                </text>
              );
            }
            if (fretVal === 0) {
              return (
                <circle
                  key={`open-${stringIdx}`}
                  cx={x}
                  cy={y - 4}
                  r="4"
                  fill="none"
                  stroke="#7B1E2B"
                  strokeWidth="1.8"
                />
              );
            }
            return null;
          })}

          {/* Finger / Dot Markers on frets (Wine Red with White number) */}
          {chord.frets.map((fretVal, stringIdx) => {
            if (fretVal > 0) {
              const x = startX + stringIdx * stringGap;
              const relativeFret = fretVal - baseFret + 1;
              const y = startY + (relativeFret - 0.5) * fretGap;
              const finger = chord.fingers[stringIdx];

              return (
                <g key={`dot-${stringIdx}-${fretVal}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill="#7B1E2B"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  {finger > 0 && (
                    <text
                      x={x}
                      y={y + 3.5}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={radius > 8 ? '10' : '9'}
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {finger}
                    </text>
                  )}
                </g>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Notes Breakdown */}
      {showDetails && (
        <div className="w-full mt-2 pt-2 border-t border-[#D9D9D9] text-center">
          <div className="text-[11px] text-[#666672] flex justify-center items-center gap-1">
            <span>Notas:</span>
            <span className="font-bold text-[#25252A] font-mono-code">
              {chord.notes.join(' - ')}
            </span>
          </div>
          <div className="text-[10px] text-[#666672]">
            ({chord.notesPt.join(', ')})
          </div>
        </div>
      )}

      {/* Audio Playback Buttons */}
      <div className="flex items-center gap-2 mt-3 w-full">
        <button
          onClick={() => handlePlayChord(false)}
          disabled={isPlaying}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#7B1E2B] hover:bg-[#B52A3A] text-white rounded-xl text-xs font-bold transition shadow-xs"
          title="Tocar acorde batido"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Batida</span>
        </button>
        <button
          onClick={() => handlePlayChord(true)}
          disabled={isPlaying}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] border border-[#D9D9D9] rounded-xl text-xs font-bold transition"
          title="Tocar arpejo corda a corda"
        >
          <Music className="w-3.5 h-3.5 text-[#7B1E2B]" />
          <span>Dedilhado</span>
        </button>
      </div>
    </div>
  );
};

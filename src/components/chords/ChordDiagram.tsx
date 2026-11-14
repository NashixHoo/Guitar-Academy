import React, { useState } from 'react';
import { ChordShape } from '../../types';
import { ChordShapeDef } from '../../chords/shapes';
import { audioEngine } from '../../audio/audioEngine';
import { getChordFrequencies, CHORD_DATABASE } from '../../data/chordDatabase';
import { STANDARD_TUNING, getFretNote } from '../../data/musicTheory';
import { Play, Music, Sparkles } from 'lucide-react';

export interface ChordDiagramData {
  symbol?: string;
  namePt?: string;
  category?: string;
  formula?: string;
  frets: number[]; // 6 cordas: index 0 (6ª Mi grave) até index 5 (1ª Mi aguda). -1 = X, 0 = O
  fingers?: number[]; // Dedos: 0 = solta/nenhum, 1=indicador, 2=médio, 3=anelar, 4=mínimo
  baseFret?: number; // Casa inicial se > 1
  barre?: { fret: number; fromString: number; toString: number };
  notes?: string[];
  notesPt?: string[];
  tips?: string;
  cagedForm?: string | null;
  position?: string;
}

export interface ChordDiagramProps {
  chord?: ChordShape | ChordShapeDef | ChordDiagramData | null;
  frets?: number[];
  fingers?: number[];
  symbol?: string;
  namePt?: string;
  baseFret?: number;
  barre?: { fret: number; fromString: number; toString: number };
  notes?: string[];
  notesPt?: string[];
  formula?: string;
  category?: string;
  cagedForm?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  showAudio?: boolean;
  showTitle?: boolean;
  showStringLabels?: boolean;
  showFretNumbers?: boolean;
  showFingerLegend?: boolean;
  compact?: boolean;
  className?: string;
}

const STRING_LABELS_SHORT = ['6ª Mi', '5ª Lá', '4ª Ré', '3ª Sol', '2ª Si', '1ª Mi'];
const STRING_TUNING_CIPHERS = ['E', 'A', 'D', 'G', 'B', 'e'];

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  chord,
  frets: propFrets,
  fingers: propFingers,
  symbol: propSymbol,
  namePt: propNamePt,
  baseFret: propBaseFret,
  barre: propBarre,
  notes: propNotes,
  notesPt: propNotesPt,
  formula: propFormula,
  category: propCategory,
  cagedForm: propCagedForm,
  size = 'md',
  showDetails = true,
  showAudio = true,
  showTitle = true,
  showStringLabels = false,
  showFretNumbers = false,
  showFingerLegend = false,
  compact = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Unificação dos dados do acorde (props diretas ou objeto chord)
  const effectiveFrets = propFrets || chord?.frets || [-1, 3, 2, 0, 1, 0];
  const effectiveFingers = propFingers || chord?.fingers || [0, 3, 2, 0, 1, 0];
  const effectiveSymbol = propSymbol || (chord as any)?.symbol || (chord as any)?.chord || 'Acorde';
  const effectiveNamePt = propNamePt || (chord as any)?.namePt || '';
  const effectiveCategory = propCategory || (chord as any)?.category || (chord as any)?.position || '';
  const effectiveFormula = propFormula || (chord as any)?.formula || '';
  const effectiveNotes = propNotes || (chord as any)?.notes || [];
  const effectiveNotesPt = propNotesPt || (chord as any)?.notesPt || [];
  const effectiveCagedForm = propCagedForm || (chord as any)?.cagedForm || null;

  // Cálculo da casa base (baseFret)
  // Se não foi explicitamente fornecido, calcula a menor casa pressionada (> 0)
  const pressedFrets = effectiveFrets.filter((f) => f > 0);
  const minFret = pressedFrets.length > 0 ? Math.min(...pressedFrets) : 1;
  const maxFret = pressedFrets.length > 0 ? Math.max(...pressedFrets) : 1;
  const rawBaseFret = propBaseFret !== undefined ? propBaseFret : (chord as any)?.baseFret;
  const effectiveBaseFret = rawBaseFret !== undefined ? rawBaseFret : maxFret > 4 ? minFret : 1;

  // Detecção automática de pestana (barre) caso não esteja explicitada no objeto
  const effectiveBarre = React.useMemo(() => {
    if (propBarre) return propBarre;
    if ((chord as any)?.barre) return (chord as any).barre;

    // Detecta se dedo 1 é usado em 2 ou mais cordas na mesma casa
    const fretOccurrences: Record<number, number[]> = {};
    effectiveFrets.forEach((f, stringIdx) => {
      if (f > 0) {
        const finger = effectiveFingers[stringIdx];
        if (finger === 1 || (finger === 0 && f === effectiveBaseFret)) {
          if (!fretOccurrences[f]) fretOccurrences[f] = [];
          fretOccurrences[f].push(stringIdx);
        }
      }
    });

    for (const fretStr of Object.keys(fretOccurrences)) {
      const f = parseInt(fretStr, 10);
      const stringsWithFret = fretOccurrences[f];
      if (stringsWithFret.length >= 2) {
        // Encontra a corda mais grave (menor index = maior corda, ex: 0 = 6ª corda)
        // e a corda mais aguda (maior index = menor corda, ex: 5 = 1ª corda)
        const minStringIdx = Math.min(...stringsWithFret);
        const maxStringIdx = Math.max(...stringsWithFret);
        if (maxStringIdx - minStringIdx >= 1) {
          return {
            fret: f,
            fromString: 6 - minStringIdx, // 6ª corda
            toString: 6 - maxStringIdx   // 1ª corda
          };
        }
      }
    }
    return undefined;
  }, [propBarre, chord, effectiveFrets, effectiveFingers, effectiveBaseFret]);

  // Reprodução de áudio do acorde
  const handlePlayChord = (arpeggio: boolean = false) => {
    setIsPlaying(true);
    let freqs: number[] = [];

    // Tenta encontrar o acorde no banco oficial para frequências ricas
    const fromDb = CHORD_DATABASE.find((c) => c.symbol === effectiveSymbol);
    if (fromDb) {
      freqs = getChordFrequencies(fromDb);
    } else {
      // Calcula frequências físicas baseadas nas casas pressionadas na afinação padrão EADGBE
      effectiveFrets.forEach((fret, stringIdx) => {
        if (fret >= 0) {
          const stringNumber = 6 - stringIdx;
          const strDef = STANDARD_TUNING.find((s) => s.stringNumber === stringNumber);
          if (strDef) {
            const note = getFretNote(strDef, fret);
            freqs.push(note.frequencyHz);
          }
        }
      });
    }

    if (freqs.length > 0) {
      audioEngine.playChord(freqs, arpeggio, 25);
    }
    setTimeout(() => setIsPlaying(false), arpeggio ? 1200 : 800);
  };

  // Dimensões do diagrama SVG responsivo
  const dimensions = {
    xs: { width: 110, height: 130, startX: 16, startY: 26, stringGap: 15, fretGap: 18, radius: 5.5, fontSize: 8 },
    sm: { width: 135, height: 160, startX: 20, startY: 32, stringGap: 19, fretGap: 22, radius: 7, fontSize: 9 },
    md: { width: 175, height: 210, startX: 25, startY: 40, stringGap: 25, fretGap: 29, radius: 8.5, fontSize: 10 },
    lg: {
      width: showStringLabels || showFretNumbers ? 268 : 220,
      height: showStringLabels ? 290 : 260,
      startX: showFretNumbers ? 44 : 30,
      startY: 46,
      stringGap: 36,
      fretGap: 42,
      radius: 13,
      fontSize: 13,
    },
  }[size];

  const { width, height, startX, startY, stringGap, fretGap, radius, fontSize } = dimensions;
  const numFrets = 4; // 4 casas visíveis (padrão conservatório / Cifra Club)

  return (
    <div
      className={`flex flex-col items-center bg-white border border-[#D9D9D9] rounded-2xl p-3 sm:p-4 shadow-xs hover:border-[#7B1E2B] transition-all group ${className}`}
    >
      {/* Chord Header */}
      {showTitle && (
        <div className="text-center w-full mb-1.5">
          <div className="flex items-center justify-between gap-1">
            {effectiveCagedForm ? (
              <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-md bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
                Forma {effectiveCagedForm}
              </span>
            ) : effectiveCategory ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F8F7F4] text-[#666672] border border-[#D9D9D9]">
                {effectiveCategory}
              </span>
            ) : <span />}

            {effectiveFormula && (
              <span className="text-[11px] font-mono-code font-bold text-[#B52A3A]">
                {effectiveFormula}
              </span>
            )}
          </div>

          <h3 className={`${size === 'xs' ? 'text-lg' : size === 'sm' ? 'text-xl' : 'text-2xl'} font-black text-[#25252A] mt-0.5 group-hover:text-[#7B1E2B] transition-colors font-mono-code`}>
            {effectiveSymbol}
          </h3>

          {effectiveNamePt && !compact && (
            <p className="text-[11px] text-[#666672] font-medium truncate">{effectiveNamePt}</p>
          )}
        </div>
      )}

      {/* SVG Chord Box Inspired by Cifra Club Vertical Standard */}
      <div className="relative my-1 select-none flex justify-center w-full">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible max-w-full h-auto"
          role="img"
          aria-label={`Diagrama do acorde ${effectiveSymbol}${effectiveNamePt ? ` (${effectiveNamePt})` : ''}`}
        >
          {/* Top Nut or Base Fret Marker */}
          {effectiveBaseFret === 1 ? (
            // Pestana superior (Nut grossa preta para casa 1)
            <line
              x1={startX}
              y1={startY}
              x2={startX + 5 * stringGap}
              y2={startY}
              stroke="#25252A"
              strokeWidth={size === 'xs' ? '4' : '5.5'}
              strokeLinecap="round"
            />
          ) : (
            // Traste superior simples com indicação da casa ao lado
            <>
              <line
                x1={startX}
                y1={startY}
                x2={startX + 5 * stringGap}
                y2={startY}
                stroke="#666672"
                strokeWidth="2"
              />
              {!showFretNumbers && (
                <text
                  x={startX - (size === 'xs' ? 10 : 14)}
                  y={startY + fretGap / 1.5}
                  fill="#7B1E2B"
                  fontSize={fontSize}
                  fontWeight="900"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {effectiveBaseFret}ª
                </text>
              )}
            </>
          )}

          {/* Optional left-side fret row numbers (1ª..4ª or baseFret..baseFret+3) */}
          {showFretNumbers &&
            Array.from({ length: numFrets }).map((_, fIdx) => {
              const actualFret = effectiveBaseFret + fIdx;
              const y = startY + (fIdx + 0.5) * fretGap + fontSize * 0.35;
              return (
                <text
                  key={`fret-label-${actualFret}`}
                  x={startX - 18}
                  y={y}
                  fill={fIdx === 0 && effectiveBaseFret > 1 ? '#7B1E2B' : '#666672'}
                  fontSize={Math.max(10, fontSize - 1)}
                  fontWeight={fIdx === 0 ? '900' : '700'}
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {actualFret}ª
                </text>
              );
            })}

          {/* Horizontal Fret Lines (Trastes Prateados) */}
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

          {/* Vertical String Lines (6 cordas: 6ª à esquerda, 1ª à direita) */}
          {Array.from({ length: 6 }).map((_, s) => (
            <line
              key={`string-${s}`}
              x1={startX + s * stringGap}
              y1={startY}
              x2={startX + s * stringGap}
              y2={startY + numFrets * fretGap}
              stroke="#666672"
              strokeWidth={s === 0 ? '2.6' : s === 5 ? '1.1' : s === 1 ? '2.2' : s === 2 ? '1.8' : '1.4'}
            />
          ))}

          {/* Pestana (Barre) contínua desenhada como pílula sólida */}
          {effectiveBarre && effectiveBarre.fret >= effectiveBaseFret && (
            (() => {
              const fromIdx = 6 - effectiveBarre.fromString; // 6ª corda = index 0
              const toIdx = 6 - effectiveBarre.toString;     // 1ª corda = index 5
              const relFret = effectiveBarre.fret - effectiveBaseFret + 1;
              if (relFret < 1 || relFret > numFrets) return null;
              const y = startY + (relFret - 0.5) * fretGap;
              const x1 = startX + fromIdx * stringGap;
              const x2 = startX + toIdx * stringGap;
              const barLeft = Math.min(x1, x2) - radius * 0.9;
              const barWidth = Math.abs(x2 - x1) + radius * 1.8;

              return (
                <g key={`barre-${effectiveBarre.fret}`}>
                  <rect
                    x={barLeft}
                    y={y - radius}
                    width={barWidth}
                    height={radius * 2}
                    rx={radius}
                    fill="#7B1E2B"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                  />
                  {/* Número do dedo indicador na pestana */}
                  <text
                    x={barLeft + radius * 0.9}
                    y={y + (fontSize * 0.35)}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize={fontSize}
                    fontWeight="bold"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    1
                  </text>
                </g>
              );
            })()
          )}

          {/* Open / Muted string markers above nut (✕ para abafada, ○ para solta) */}
          {effectiveFrets.map((fretVal, stringIdx) => {
            const x = startX + stringIdx * stringGap;
            const y = startY - (size === 'xs' ? 7 : 12);

            if (fretVal === -1) {
              return (
                <text
                  key={`mute-${stringIdx}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill="#B52A3A"
                  fontSize={fontSize + 1}
                  fontWeight="900"
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
                  cy={y - 3.5}
                  r={radius * 0.45}
                  fill="none"
                  stroke="#7B1E2B"
                  strokeWidth="1.8"
                />
              );
            }
            return null;
          })}

          {/* Pontos de Digitação nos Trastes (Finger Dots) */}
          {effectiveFrets.map((fretVal, stringIdx) => {
            if (fretVal > 0) {
              const x = startX + stringIdx * stringGap;
              const relativeFret = fretVal - effectiveBaseFret + 1;
              if (relativeFret < 1 || relativeFret > numFrets) return null;

              const y = startY + (relativeFret - 0.5) * fretGap;
              const finger = effectiveFingers[stringIdx] || 0;

              // Se a nota estiver coberta pela pestana desenhada na mesma casa com dedo 1, pula para não sobrepor
              const isCoveredByBarre =
                effectiveBarre &&
                effectiveBarre.fret === fretVal &&
                finger === 1 &&
                stringIdx > (6 - effectiveBarre.fromString) &&
                stringIdx <= (6 - effectiveBarre.toString);

              if (isCoveredByBarre) return null;

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
                      y={y + (fontSize * 0.35)}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={fontSize}
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

          {/* Optional bottom string labels (6ª E .. 1ª e) */}
          {showStringLabels &&
            STRING_TUNING_CIPHERS.map((noteName, s) => {
              const x = startX + s * stringGap;
              const baseY = startY + numFrets * fretGap;
              const stringNum = 6 - s;
              const playedFret = effectiveFrets[s];
              let noteAtString = '✕';
              if (playedFret >= 0) {
                const strDef = STANDARD_TUNING.find((st) => st.stringNumber === stringNum);
                noteAtString = strDef ? getFretNote(strDef, playedFret).cipher : noteName;
              }
              return (
                <g key={`str-lbl-${s}`}>
                  <text
                    x={x}
                    y={baseY + 18}
                    textAnchor="middle"
                    fill="#25252A"
                    fontSize={11}
                    fontWeight="800"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {STRING_LABELS_SHORT[s].split(' ')[0]}
                  </text>
                  <text
                    x={x}
                    y={baseY + 32}
                    textAnchor="middle"
                    fill={playedFret === -1 ? '#B52A3A' : '#7B1E2B'}
                    fontSize={10.5}
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {noteAtString}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Optional clear finger legend */}
      {showFingerLegend && (
        <div className="w-full mt-2 px-2.5 py-2 rounded-xl bg-[#F8F7F4] border border-[#E8E6E1] text-[11px] text-[#4D4D54] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium">
          <span><strong className="text-[#7B1E2B] font-mono-code">1</strong> Indicador</span>
          <span><strong className="text-[#7B1E2B] font-mono-code">2</strong> Médio</span>
          <span><strong className="text-[#7B1E2B] font-mono-code">3</strong> Anelar</span>
          <span><strong className="text-[#7B1E2B] font-mono-code">4</strong> Mínimo</span>
        </div>
      )}

      {/* Breakdown de Notas Teóricas */}
      {showDetails && effectiveNotes.length > 0 && !compact && (
        <div className="w-full mt-2 pt-2 border-t border-[#D9D9D9] text-center">
          <div className="text-[11px] text-[#666672] flex justify-center items-center gap-1 font-mono-code font-bold">
            <span className="text-[#25252A]">{effectiveNotes.join(' - ')}</span>
          </div>
          {effectiveNotesPt.length > 0 && (
            <div className="text-[10px] text-[#666672]">
              ({effectiveNotesPt.join(', ')})
            </div>
          )}
        </div>
      )}

      {/* Áudio Playback Buttons */}
      {showAudio && (
        <div className="flex items-center gap-2 mt-3 w-full">
          <button
            type="button"
            onClick={() => handlePlayChord(false)}
            disabled={isPlaying}
            className="flex-1 flex items-center justify-center gap-1.5 min-h-[40px] py-1.5 px-3 bg-[#7B1E2B] hover:bg-[#B52A3A] text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
            title="Tocar acorde batido"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Batida</span>
          </button>
          <button
            type="button"
            onClick={() => handlePlayChord(true)}
            disabled={isPlaying}
            className="flex-1 flex items-center justify-center gap-1.5 min-h-[40px] py-1.5 px-3 bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#7B1E2B] border border-[#D9D9D9] rounded-xl text-xs font-bold transition disabled:opacity-50"
            title="Tocar arpejo corda a corda"
          >
            <Music className="w-3.5 h-3.5 text-[#7B1E2B]" />
            <span>Dedilhado</span>
          </button>
        </div>
      )}
    </div>
  );
};

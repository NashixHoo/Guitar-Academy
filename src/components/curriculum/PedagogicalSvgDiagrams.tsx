import React, { useState } from 'react';
import { Volume2, Sparkles, Play, Info } from 'lucide-react';
import { audioEngine } from '../../audio/audioEngine';

interface PedagogicalSvgDiagramsProps {
  instrumentType: 'violao' | 'guitarra' | 'baixo' | 'teclado' | 'bateria';
  topicKey: string;
  title: string;
}

export const PedagogicalSvgDiagrams: React.FC<PedagogicalSvgDiagramsProps> = ({
  instrumentType,
  topicKey,
  title,
}) => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [activeBeat, setActiveBeat] = useState<number | null>(null);

  // Helper to play tone when clicking interactive notes on SVG
  const playNoteTone = (freq: number, label: string) => {
    setSelectedNote(label);
    audioEngine.playGuitarNote(freq, 1.0, 0.7);
    setTimeout(() => setSelectedNote(null), 1500);
  };

  // 1. VIOLÃO & GUITARRA: Fretboard / Chord / Scale SVG
  if (instrumentType === 'violao' || instrumentType === 'guitarra') {
    return (
      <div className="bg-[#1A1A20] text-white rounded-2xl p-4 sm:p-5 border border-[#33333E] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#7B1E2B]/40 text-[#FF6B81]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#FF6B81] block">
                Diagrama Técnico SVG Interativo • {instrumentType === 'violao' ? 'Violão' : 'Guitarra'}
              </span>
              <h5 className="text-sm font-black text-white">{title}</h5>
            </div>
          </div>
          {selectedNote && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono-code text-xs font-bold animate-pulse">
              Nota Tocada: {selectedNote}
            </span>
          )}
        </div>

        {/* SVG Fretboard & Finger Position Diagram */}
        <div className="overflow-x-auto no-scrollbar py-2">
          <svg viewBox="0 0 600 220" className="w-full min-w-[500px] h-auto select-none">
            {/* Nut */}
            <rect x="50" y="30" width="12" height="160" fill="#E8E6E1" rx="2" />
            <text x="56" y="22" fill="#B8B3C0" fontSize="10" textAnchor="middle" fontFamily="monospace">Nut</text>

            {/* Frets 1 to 5 */}
            {[100, 150, 200, 250, 300, 360].map((fx, fIdx) => (
              <g key={`fret-${fIdx}`}>
                <line x1={fx} y1="30" x2={fx} y2="190" stroke="#4A4A58" strokeWidth={fIdx === 5 ? 4 : 2} />
                {fIdx < 5 && (
                  <text x={fx + 25} y="22" fill="#B8B3C0" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    Casa {fIdx + 1}
                  </text>
                )}
              </g>
            ))}

            {/* Fret Markers (Dots at frets 3 and 5) */}
            <circle cx="175" cy="110" r="6" fill="#4A4A58" opacity="0.6" />
            <circle cx="275" cy="110" r="6" fill="#4A4A58" opacity="0.6" />

            {/* 6 Strings */}
            {[35, 62, 89, 116, 143, 170].map((sy, sIdx) => {
              const stringNames = ['E (Mi Agudo)', 'B (Si)', 'G (Sol)', 'D (Ré)', 'A (Lá)', 'E (Mi Grave)'];
              const stringFreqs = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41];
              return (
                <g key={`string-${sIdx}`}>
                  {/* String Line */}
                  <line x1="40" y1={sy} x2="380" y2={sy} stroke="#D9D9D9" strokeWidth={1 + sIdx * 0.3} />
                  {/* String Label */}
                  <text x="15" y={sy + 4} fill="#F8F7F4" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    {6 - sIdx}ª
                  </text>

                  {/* Interactive Open String */}
                  <circle
                    cx="40"
                    cy={sy}
                    r="9"
                    fill="#22141A"
                    stroke="#FF6B81"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={() => playNoteTone(stringFreqs[sIdx], stringNames[sIdx])}
                  />
                  <text x="40" y={sy + 3.5} fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">
                    {['E', 'B', 'G', 'D', 'A', 'E'][sIdx]}
                  </text>
                </g>
              );
            })}

            {/* Example Finger / Note Markers on Fretboard */}
            {/* Marker 1: Dó na 2ª corda casa 1 */}
            <circle
              cx="125"
              cy="62"
              r="12"
              fill="#7B1E2B"
              stroke="#FF6B81"
              strokeWidth="2"
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => playNoteTone(261.63, 'C (Dó - 2ª Corda, 1ª Casa)')}
            />
            <text x="125" y="66" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">1</text>
            <text x="125" y="44" fill="#FF6B81" fontSize="9" textAnchor="middle">C (Tônica)</text>

            {/* Marker 2: Mi na 4ª corda casa 2 */}
            <circle
              cx="175"
              cy="116"
              r="12"
              fill="#7B1E2B"
              stroke="#FF6B81"
              strokeWidth="2"
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => playNoteTone(164.81, 'E (Mi - 4ª Corda, 2ª Casa)')}
            />
            <text x="175" y="120" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">2</text>
            <text x="175" y="98" fill="#FF6B81" fontSize="9" textAnchor="middle">E (Terça)</text>

            {/* Technique Arrow Indicator (Bend / Slide / Pull-off) */}
            <g transform="translate(250, 140)">
              <path d="M 0 0 Q 25 -25 50 0" fill="none" stroke="#F5C542" strokeWidth="3" strokeDasharray="4 2" />
              <polygon points="45,-6 52,0 45,6" fill="#F5C542" />
              <text x="25" y="-30" fill="#F5C542" fontSize="10" fontWeight="bold" textAnchor="middle">
                Bend 1 Tom (↑)
              </text>
            </g>

            {/* Legend Box */}
            <rect x="400" y="30" width="180" height="150" rx="8" fill="#22141A" stroke="#422933" />
            <text x="415" y="52" fill="#FF6B81" fontSize="11" fontWeight="bold">Legenda Técnica:</text>
            <text x="415" y="75" fill="#B8B3C0" fontSize="10">• Círculo Vinho: Dedo 1, 2, 3 ou 4</text>
            <text x="415" y="95" fill="#B8B3C0" fontSize="10">• Clique nos nós para ouvir</text>
            <text x="415" y="115" fill="#B8B3C0" fontSize="10">• Setas: Movimento de bend</text>
            <text x="415" y="135" fill="#B8B3C0" fontSize="10">• Numeração: Ordem dos dedos</text>
            <text x="415" y="155" fill="#F5C542" fontSize="10">• Posição correta no traste</text>
          </svg>
        </div>

        <div className="text-[11px] text-[#B8B3C0] font-medium flex items-center gap-1.5 pt-1">
          <Info className="w-3.5 h-3.5 text-[#FF6B81] shrink-0" />
          <span>Toque em qualquer corda solta ou marcador numerado no braço acima para ouvir a frequência exata sintetizada em tempo real.</span>
        </div>
      </div>
    );
  }

  // 2. CONTRABAIXO: 4 Strings Fretboard & Slap/Pizzicato SVG
  if (instrumentType === 'baixo') {
    return (
      <div className="bg-[#1A1A20] text-white rounded-2xl p-4 sm:p-5 border border-[#33333E] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#7B1E2B]/40 text-[#FF6B81]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#FF6B81] block">
                Diagrama SVG do Contrabaixo • 4 Cordas (E-A-D-G)
              </span>
              <h5 className="text-sm font-black text-white">{title}</h5>
            </div>
          </div>
          {selectedNote && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono-code text-xs font-bold">
              Nota: {selectedNote}
            </span>
          )}
        </div>

        <div className="overflow-x-auto no-scrollbar py-2">
          <svg viewBox="0 0 600 180" className="w-full min-w-[500px] h-auto select-none">
            {/* Nut */}
            <rect x="50" y="20" width="10" height="140" fill="#E8E6E1" rx="2" />

            {/* Frets */}
            {[110, 180, 250, 320, 390, 470].map((fx, fIdx) => (
              <line key={`b-fret-${fIdx}`} x1={fx} y1="20" x2={fx} y2="160" stroke="#4A4A58" strokeWidth="2" />
            ))}

            {/* 4 Bass Strings */}
            {[40, 80, 120, 160].map((sy, sIdx) => {
              const bassNotes = ['G (Sol)', 'D (Ré)', 'A (Lá)', 'E (Mi)'];
              const bassFreqs = [97.99, 73.42, 55.00, 41.20];
              return (
                <g key={`b-string-${sIdx}`}>
                  <line x1="40" y1={sy} x2="520" y2={sy} stroke="#D9D9D9" strokeWidth={2 + sIdx * 0.6} />
                  <text x="18" y={sy + 4} fill="#F8F7F4" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    {4 - sIdx}ª
                  </text>
                  <circle
                    cx="40"
                    cy={sy}
                    r="10"
                    fill="#22141A"
                    stroke="#FF6B81"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={() => playNoteTone(bassFreqs[sIdx], bassNotes[sIdx])}
                  />
                  <text x="40" y={sy + 3.5} fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">
                    {['G', 'D', 'A', 'E'][sIdx]}
                  </text>
                </g>
              );
            })}

            {/* Slap / Pop Movement Arrow */}
            <g transform="translate(150, 90)">
              <path d="M 0 0 L 0 -40" stroke="#F5C542" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="25" y="-20" fill="#F5C542" fontSize="10" fontWeight="bold">Slap (Polegar)</text>
            </g>
          </svg>
        </div>

        <div className="text-[11px] text-[#B8B3C0] font-medium flex items-center gap-1.5 pt-1">
          <Info className="w-3.5 h-3.5 text-[#FF6B81] shrink-0" />
          <span>Visualização das 4 cordas graves do contrabaixo com marcação de oitavas e técnica de slap/pizzicato.</span>
        </div>
      </div>
    );
  }

  // 3. TECLADO & PIANO: Keyboard Keys SVG
  if (instrumentType === 'teclado') {
    return (
      <div className="bg-[#1A1A20] text-white rounded-2xl p-4 sm:p-5 border border-[#33333E] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#7B1E2B]/40 text-[#FF6B81]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#FF6B81] block">
                Diagrama SVG do Teclado • Oitava Padrão & Voicings
              </span>
              <h5 className="text-sm font-black text-white">{title}</h5>
            </div>
          </div>
          {selectedNote && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono-code text-xs font-bold">
              Tecla: {selectedNote}
            </span>
          )}
        </div>

        {/* Keyboard SVG */}
        <div className="overflow-x-auto no-scrollbar py-2">
          <svg viewBox="0 0 500 160" className="w-full min-w-[450px] h-auto select-none">
            {/* White Keys */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((wkIdx) => {
              const noteNames = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
              const whiteFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
              const isRoot = wkIdx === 0 || wkIdx === 7 || wkIdx === 14;

              return (
                <g key={`w-key-${wkIdx}`}>
                  <rect
                    x={wkIdx * 32}
                    y="10"
                    width="31"
                    height="140"
                    fill={isRoot ? '#F5E8EA' : 'white'}
                    stroke="#D9D9D9"
                    strokeWidth="1"
                    rx="3"
                    className="cursor-pointer hover:fill-[#E8D3D6] transition-colors"
                    onClick={() => playNoteTone(whiteFreqs[wkIdx], noteNames[wkIdx])}
                  />
                  <text x={wkIdx * 32 + 15.5} y="135" fill="#25252A" fontSize="9" textAnchor="middle" fontWeight="bold">
                    {noteNames[wkIdx]}
                  </text>
                  {isRoot && (
                    <circle cx={wkIdx * 32 + 15.5} cy="115" r="4" fill="#7B1E2B" />
                  )}
                </g>
              );
            })}

            {/* Black Keys */}
            {[
              { x: 22, note: 'C#4', freq: 277.18 },
              { x: 54, note: 'D#4', freq: 311.13 },
              { x: 118, note: 'F#4', freq: 369.99 },
              { x: 150, note: 'G#4', freq: 415.30 },
              { x: 182, note: 'A#4', freq: 466.16 },
              { x: 246, note: 'C#5', freq: 554.37 },
              { x: 278, note: 'D#5', freq: 622.25 },
              { x: 342, note: 'F#5', freq: 739.99 },
              { x: 374, note: 'G#5', freq: 830.61 },
              { x: 406, note: 'A#5', freq: 932.33 },
            ].map((bk, bIdx) => (
              <rect
                key={`b-key-${bIdx}`}
                x={bk.x}
                y="10"
                width="20"
                height="85"
                fill="#25252A"
                stroke="#1A1A20"
                strokeWidth="1"
                rx="2"
                className="cursor-pointer hover:fill-[#7B1E2B] transition-colors"
                onClick={() => playNoteTone(bk.freq, bk.note)}
              />
            ))}
          </svg>
        </div>

        <div className="text-[11px] text-[#B8B3C0] font-medium flex items-center gap-1.5 pt-1">
          <Info className="w-3.5 h-3.5 text-[#FF6B81] shrink-0" />
          <span>Teclado interativo com marcação de tríades e notas fundamentais (C4, C5, C6 destacados em vinho).</span>
        </div>
      </div>
    );
  }

  // 4. BATERIA: Drum Kit & Subdivision Grid SVG
  if (instrumentType === 'bateria') {
    return (
      <div className="bg-[#1A1A20] text-white rounded-2xl p-4 sm:p-5 border border-[#33333E] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#7B1E2B]/40 text-[#FF6B81]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#FF6B81] block">
                Grade Rítmica SVG & Topografia do Kit de Bateria
              </span>
              <h5 className="text-sm font-black text-white">{title}</h5>
            </div>
          </div>
          {activeBeat !== null && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono-code text-xs font-bold">
              Tempo Ativo: {activeBeat + 1}
            </span>
          )}
        </div>

        {/* Drum Beat Subdivision Grid SVG */}
        <div className="overflow-x-auto no-scrollbar py-2">
          <svg viewBox="0 0 500 140" className="w-full min-w-[450px] h-auto select-none">
            {/* 4 Compass Beats (1, 2, 3, 4) */}
            {[0, 1, 2, 3].map((beat) => {
              const isActive = activeBeat === beat;
              const beatLabels = ['Tempo 1 (Chimbal + Bumbo)', 'Tempo 2 (Caixa Acentuada)', 'Tempo 3 (Chimbal)', 'Tempo 4 (Caixa / Virada)'];
              const beatFreqs = [880, 440, 600, 440];

              return (
                <g key={`beat-box-${beat}`}>
                  <rect
                    x={beat * 120 + 20}
                    y="20"
                    width="110"
                    height="90"
                    rx="10"
                    fill={isActive ? '#7B1E2B' : '#22141A'}
                    stroke={isActive ? '#FF6B81' : '#422933'}
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-[#381A25] transition-colors"
                    onClick={() => {
                      setActiveBeat(beat);
                      audioEngine.playGuitarNote(beatFreqs[beat], 0.3, 0.8);
                      setTimeout(() => setActiveBeat(null), 1000);
                    }}
                  />
                  <text x={beat * 120 + 75} y="45" fill="#FF6B81" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Tempo {beat + 1}
                  </text>
                  <text x={beat * 120 + 75} y="70" fill="white" fontSize="10" textAnchor="middle">
                    {beat === 0 ? 'Bumbo + Hi-Hat' : beat === 1 ? 'Caixa (Snare)' : beat === 2 ? 'Hi-Hat Solo' : 'Caixa / Prato'}
                  </text>
                  <text x={beat * 120 + 75} y="92" fill="#B8B3C0" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    (Clique para Testar)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="text-[11px] text-[#B8B3C0] font-medium flex items-center gap-1.5 pt-1">
          <Info className="w-3.5 h-3.5 text-[#FF6B81] shrink-0" />
          <span>Grade rítmica interativa de 4 pulsos. Clique em cada tempo para ouvir o pulso percussivo correspondente.</span>
        </div>
      </div>
    );
  }

  return null;
};

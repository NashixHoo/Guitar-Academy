import React, { useState, useMemo, useEffect } from 'react';
import { CHORD_DATABASE } from '../../data/chordDatabase';
import { ChordDiagram } from './ChordDiagram';
import { NoteCipher, ChordType } from '../../types';
import { CHROMATIC_NOTES, CIPHER_TO_PT, STANDARD_TUNING, getFretNote } from '../../data/musicTheory';
import { ChordEngine } from '../../chords/chord-engine';
import { audioEngine } from '../../audio/audioEngine';
import { Search, BookOpen, Star, Sparkles, Layers, CheckCircle2, AlertCircle, Volume2, Music, Wand2 } from 'lucide-react';

interface ChordDictionaryViewProps {
  favoriteChords: string[];
  onToggleFavorite: (chordId: string) => void;
  initialSearchTerm?: string;
  initialChordId?: string;
}

export const ChordDictionaryView: React.FC<ChordDictionaryViewProps> = ({
  favoriteChords,
  onToggleFavorite,
  initialSearchTerm,
  initialChordId,
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'dictionary' | 'reverse' | 'caged' | 'validator' | 'lab' | 'sonorities'>('dictionary');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [selectedRoot, setSelectedRoot] = useState<NoteCipher | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<ChordType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedChordId, setSelectedChordId] = useState<string>(
    initialChordId || CHORD_DATABASE[0]?.id || ''
  );

  // Laboratório de Cifras State
  const [labInput, setLabInput] = useState<string>('Cmaj7');

  // Reverse Finder State
  const [reverseNotesInput, setReverseNotesInput] = useState<string>('C E G');
  const [reverseSelectedNotes, setReverseSelectedNotes] = useState<string[]>(['C', 'E', 'G']);

  // CAGED System State
  const [cagedRoot, setCagedRoot] = useState<string>('C');

  // Validator State
  const [validatorFrets, setValidatorFrets] = useState<number[]>([-1, 3, 2, 0, 1, 0]);
  const [validatorTargetChord, setValidatorTargetChord] = useState<string>('C');

  useEffect(() => {
    if (initialChordId) {
      setSelectedChordId(initialChordId);
      setActiveTabMode('dictionary');
      setSelectedRoot('ALL');
      setSelectedType('ALL');
      setSelectedCategory('ALL');
    }
  }, [initialChordId]);

  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
      setActiveTabMode('dictionary');
      setSelectedRoot('ALL');
      setSelectedType('ALL');
      setSelectedCategory('ALL');
    }
  }, [initialSearchTerm]);

  const filteredChords = useMemo(() => {
    return CHORD_DATABASE.filter((chord) => {
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesSymbol = chord.symbol.toLowerCase().includes(query);
        const matchesName = chord.namePt.toLowerCase().includes(query);
        const matchesNotes = chord.notes.some((n) => n.toLowerCase().includes(query));
        const matchesNotesPt = chord.notesPt.some((n) => n.toLowerCase().includes(query));
        if (!matchesSymbol && !matchesName && !matchesNotes && !matchesNotesPt) {
          return false;
        }
      }

      if (selectedRoot !== 'ALL' && chord.root !== selectedRoot) {
        return false;
      }

      if (selectedType !== 'ALL' && chord.type !== selectedType) {
        return false;
      }

      if (selectedCategory !== 'ALL' && chord.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedRoot, selectedType, selectedCategory]);

  const activeChord = CHORD_DATABASE.find((c) => c.id === selectedChordId) || filteredChords[0] || CHORD_DATABASE[0];

  // Dynamic reverse chord search results via Virtuo Chord Engine
  const reverseResults = useMemo(() => {
    if (reverseSelectedNotes.length < 2) return [];
    return ChordEngine.identifyFromNotes(reverseSelectedNotes);
  }, [reverseSelectedNotes]);

  // Dynamic CAGED shapes via Virtuo Chord Engine
  const cagedShapes = useMemo(() => {
    return ChordEngine.generateCaged(cagedRoot);
  }, [cagedRoot]);

  // Validator Result via Virtuo Chord Engine
  const validationResult = useMemo(() => {
    return ChordEngine.validateShape(validatorFrets, validatorTargetChord, 'electric-guitar');
  }, [validatorFrets, validatorTargetChord]);

  // Laboratório de Cifras Parser
  const parsedLabChord = useMemo(() => {
    const clean = labInput.trim();
    if (!clean) return null;
    return ChordEngine.getChord(clean);
  }, [labInput]);

  const labShapes = useMemo(() => {
    if (!parsedLabChord) return [];
    return ChordEngine.getShapes(parsedLabChord.symbol, 'acoustic-guitar');
  }, [parsedLabChord]);

  // Tocar acorde no Laboratório via Web Audio
  const playLabChordAudio = (arpeggiated: boolean = false) => {
    if (!parsedLabChord) return;
    const notesToPlay = parsedLabChord.notes;
    notesToPlay.forEach((noteName, idx) => {
      // Calcular frequência aproximada na oitava 3 e 4
      const noteIndex = CHROMATIC_NOTES.indexOf(noteName as NoteCipher);
      const baseFreq = 130.81 * Math.pow(2, (noteIndex >= 0 ? noteIndex : 0) / 12);
      const freq = baseFreq * (idx > 2 ? 2 : 1);
      const delay = arpeggiated ? idx * 0.12 : 0;
      setTimeout(() => {
        audioEngine.playGuitarNote(freq, 2.0, 0.7);
      }, delay * 1000);
    });
  };

  // Banco de Famílias Acústicas para o Laboratório de Sonoridades
  const sonoritiesFamilies = [
    {
      id: 'family-c',
      name: 'Família Dó (C)',
      description: 'Da tríade pura ao brilho moderno com nona e à sofisticação da bossa nova.',
      variants: [
        {
          symbol: 'C',
          namePt: 'Dó Maior Tradicional',
          formula: '1 - 3 - 5',
          notes: 'C - E - G',
          frets: [-1, 3, 2, 0, 1, 0],
          vibe: 'Estável, conclusivo e básico.',
          tag: 'Tríade'
        },
        {
          symbol: 'Cadd9',
          namePt: 'Dó com Nona Adicionada',
          formula: '1 - 3 - 5 - 9',
          notes: 'C - E - G - D',
          frets: [-1, 3, 2, 0, 3, 3],
          vibe: 'Brilhante, pop contemporâneo, ressonância épica.',
          tag: 'Acústico Pop'
        },
        {
          symbol: 'Cmaj7',
          namePt: 'Dó com Sétima Maior',
          formula: '1 - 3 - 5 - 7',
          notes: 'C - E - G - B',
          frets: [-1, 3, 2, 0, 0, 0],
          vibe: 'Sereno, reflexivo, bossa nova e MPB.',
          tag: 'Tétrade Nobre'
        }
      ]
    },
    {
      id: 'family-g',
      name: 'Família Sol (G)',
      description: 'O acorde mais ressonante do violão em três texturas harmônicas distintas.',
      variants: [
        {
          symbol: 'G',
          namePt: 'Sol Maior Clássico',
          formula: '1 - 3 - 5',
          notes: 'G - B - D',
          frets: [3, 2, 0, 0, 0, 3],
          vibe: 'Clássico folk, cordas Si e Sol abertas.',
          tag: 'Tríade'
        },
        {
          symbol: 'Gadd9',
          namePt: 'Sol com Nona',
          formula: '1 - 3 - 5 - 9',
          notes: 'G - B - D - A',
          frets: [3, 2, 0, 2, 0, 3],
          vibe: 'Luminoso, moderno, textura aveludada.',
          tag: 'Estendido'
        },
        {
          symbol: 'G7',
          namePt: 'Sol Dominante com Sétima',
          formula: '1 - 3 - 5 - b7',
          notes: 'G - B - D - F',
          frets: [3, 2, 0, 0, 0, 1],
          vibe: 'Tensão do trítono que exige resolução em C.',
          tag: 'Dominante'
        }
      ]
    },
    {
      id: 'family-em',
      name: 'Família Mi Menor (Em)',
      description: 'A nobreza melancólica dos acordes menores abertos no violão.',
      variants: [
        {
          symbol: 'Em',
          namePt: 'Mi Menor Básico',
          formula: '1 - b3 - 5',
          notes: 'E - G - B',
          frets: [0, 2, 2, 0, 0, 0],
          vibe: 'Melancólico, denso e profundo.',
          tag: 'Tríade'
        },
        {
          symbol: 'Em7',
          namePt: 'Mi Menor com Sétima',
          formula: '1 - b3 - 5 - b7',
          notes: 'E - G - B - D',
          frets: [0, 2, 2, 0, 3, 3],
          vibe: 'Acústico moderno com as cordas 1 e 2 na casa 3.',
          tag: 'Pop / Worship'
        },
        {
          symbol: 'Em9',
          namePt: 'Mi Menor com Nona',
          formula: '1 - b3 - 5 - b7 - 9',
          notes: 'E - G - B - D - F#',
          frets: [0, 2, 4, 0, 0, 0],
          vibe: 'Etéreo, cinematográfico e sofisticado.',
          tag: 'Jazz / MPB'
        }
      ]
    },
    {
      id: 'family-d',
      name: 'Família Ré (D)',
      description: 'O universo lírico das cordas agudas: resoluções de sus2 e sus4.',
      variants: [
        {
          symbol: 'D',
          namePt: 'Ré Maior Aberto',
          formula: '1 - 3 - 5',
          notes: 'D - F# - A',
          frets: [-1, -1, 0, 2, 3, 2],
          vibe: 'Brilhante e assertivo.',
          tag: 'Tríade'
        },
        {
          symbol: 'Dsus4',
          namePt: 'Ré Suspenso com Quarta',
          formula: '1 - 4 - 5',
          notes: 'D - G - A',
          frets: [-1, -1, 0, 2, 3, 3],
          vibe: 'Tensão de espera que pede resolução em Ré.',
          tag: 'Suspenso'
        },
        {
          symbol: 'Dsus2',
          namePt: 'Ré Suspenso com Segunda',
          formula: '1 - 2 - 5',
          notes: 'D - E - A',
          frets: [-1, -1, 0, 2, 3, 0],
          vibe: 'Aberto, fluido, corda Mi aguda solta.',
          tag: 'Suspenso'
        }
      ]
    },
    {
      id: 'family-am',
      name: 'Família Lá Menor (Am)',
      description: 'Economia física máxima de dedos com expressividade lírica intensa.',
      variants: [
        {
          symbol: 'Am',
          namePt: 'Lá Menor Tradicional',
          formula: '1 - b3 - 5',
          notes: 'A - C - E',
          frets: [-1, 0, 2, 2, 1, 0],
          vibe: 'Tristeza suave e nostálgica.',
          tag: 'Tríade'
        },
        {
          symbol: 'Am7',
          namePt: 'Lá Menor com Sétima',
          formula: '1 - b3 - 5 - b7',
          notes: 'A - C - E - G',
          frets: [-1, 0, 2, 0, 1, 0],
          vibe: 'Apenas 2 dedos! Corda Sol solta brilhando.',
          tag: 'Tétrade Leve'
        },
        {
          symbol: 'Asus2',
          namePt: 'Lá Suspenso com Segunda',
          formula: '1 - 2 - 5',
          notes: 'A - B - E',
          frets: [-1, 0, 2, 2, 0, 0],
          vibe: 'Serenidade pura, cordas Si e Mi soltas.',
          tag: 'Suspenso'
        }
      ]
    }
  ];

  const playSonorityChord = (frets: number[]) => {
    frets.forEach((fret, stringIdx) => {
      if (fret >= 0) {
        const stringNumber = 6 - stringIdx;
        const strDef = STANDARD_TUNING.find((s) => s.stringNumber === stringNumber);
        if (strDef) {
          const note = getFretNote(strDef, fret);
          setTimeout(() => {
            audioEngine.playGuitarNote(note.frequencyHz, 2.0, 0.6);
          }, stringIdx * 40);
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Laboratório de Acordes & Sonoridades Acústicas</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Digite qualquer cifra, decomponha fórmulas intervalares, compare sonoridades abertas e explore o CAGED e validador.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F8F7F4] p-1.5 rounded-2xl border border-[#D9D9D9]">
          <button
            onClick={() => setActiveTabMode('dictionary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTabMode === 'dictionary'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            Dicionário
          </button>
          <button
            onClick={() => setActiveTabMode('lab')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabMode === 'lab'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Laboratório de Cifras</span>
          </button>
          <button
            onClick={() => setActiveTabMode('sonorities')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabMode === 'sonorities'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Sonoridades</span>
          </button>
          <button
            onClick={() => setActiveTabMode('reverse')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabMode === 'reverse'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Identificador Reverso</span>
          </button>
          <button
            onClick={() => setActiveTabMode('caged')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabMode === 'caged'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CAGED</span>
          </button>
          <button
            onClick={() => setActiveTabMode('validator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabMode === 'validator'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validador</span>
          </button>
        </div>
      </div>

      {/* MODE: Laboratório de Cifras (NOVO LAB) */}
      {activeTabMode === 'lab' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D9D9D9]">
              <div>
                <h2 className="text-lg font-black text-[#25252A] flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-[#7B1E2B]" />
                  Laboratório Interativo de Cifras Livres
                </h2>
                <p className="text-xs text-[#666672] mt-0.5">
                  Digite qualquer símbolo de acorde para decompor em notas, intervalos, fórmula e formas no violão acústico.
                </p>
              </div>

              {/* Input Box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={labInput}
                  onChange={(e) => setLabInput(e.target.value)}
                  placeholder="Ex: Cmaj7, Gadd9, D/F#, Bm7b5..."
                  className="bg-[#F8F7F4] border border-[#D9D9D9] px-4 py-2.5 rounded-xl font-mono-code font-bold text-sm text-[#25252A] focus:border-[#7B1E2B] focus:outline-none w-48 sm:w-64"
                />
              </div>
            </div>

            {/* Sugestões Rápidas de Cifras */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#666672] font-semibold mr-1">Exemplos populares:</span>
              {['Cmaj7', 'Gadd9', 'D/F#', 'Bm7b5', 'Am7', 'Dsus4', 'E7#9', 'F#m7', 'C6/9'].map((sym) => (
                <button
                  key={`quick-${sym}`}
                  onClick={() => setLabInput(sym)}
                  className={`px-2.5 py-1 rounded-lg font-mono-code font-bold transition border ${
                    labInput === sym
                      ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                      : 'bg-[#F8F7F4] text-[#25252A] border-[#D9D9D9] hover:bg-[#F5E8EA]'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* Resultado da Decomposição */}
            {parsedLabChord ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Cartão de Informações Teóricas */}
                <div className="md:col-span-2 bg-[#F8F7F4] rounded-2xl p-5 border border-[#D9D9D9] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                        Cifra Analisada:
                      </span>
                      <h3 className="text-3xl font-black text-[#25252A] font-mono-code">
                        {parsedLabChord.symbol}
                      </h3>
                      {parsedLabChord.bass && (
                        <span className="text-xs font-bold text-[#B52A3A]">
                          (Inversão com baixo em {parsedLabChord.bass})
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => playLabChordAudio(true)}
                        className="px-3 py-2 bg-[#7B1E2B] hover:bg-[#B52A3A] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Ouvir Arpejo
                      </button>
                      <button
                        onClick={() => playLabChordAudio(false)}
                        className="px-3 py-2 bg-white hover:bg-[#F5E8EA] border border-[#D9D9D9] text-[#25252A] rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Music className="w-3.5 h-3.5 text-[#7B1E2B]" />
                        Tocar em Bloco
                      </button>
                    </div>
                  </div>

                  {/* Notas Componentes e Intervalos */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                      <span className="text-[10px] text-[#666672] uppercase font-bold block">Fundamental:</span>
                      <span className="text-base font-extrabold text-[#25252A]">{parsedLabChord.root}</span>
                      <span className="text-[10px] text-[#7B1E2B] block">{CIPHER_TO_PT[parsedLabChord.root as NoteCipher] || parsedLabChord.root}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                      <span className="text-[10px] text-[#666672] uppercase font-bold block">Qualidade:</span>
                      <span className="text-sm font-extrabold text-[#25252A] capitalize">{parsedLabChord.quality}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                      <span className="text-[10px] text-[#666672] uppercase font-bold block">Classificação:</span>
                      <span className="text-xs font-mono-code font-bold text-[#7B1E2B]">{parsedLabChord.qualityName || parsedLabChord.quality}</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                      <span className="text-[10px] text-[#666672] uppercase font-bold block">Total de Notas:</span>
                      <span className="text-base font-extrabold text-[#25252A]">{parsedLabChord.notes.length} vozes</span>
                    </div>
                  </div>

                  {/* Lista de Notas Individuais */}
                  <div className="bg-white p-4 rounded-xl border border-[#D9D9D9] space-y-2">
                    <span className="text-xs font-extrabold text-[#25252A] uppercase block">Notas Integrantes:</span>
                    <div className="flex flex-wrap gap-2">
                      {parsedLabChord.notes.map((n, i) => (
                        <div key={`lab-note-${i}`} className="bg-[#F8F7F4] border border-[#D9D9D9] px-3 py-1.5 rounded-xl flex items-center gap-2">
                          <span className="font-mono-code font-bold text-sm text-[#7B1E2B]">{n}</span>
                          <span className="text-xs text-[#666672]">({CIPHER_TO_PT[n as NoteCipher] || n})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Métricas de Tocabilidade Acústica */}
                <div className="bg-white rounded-2xl p-5 border border-[#D9D9D9] space-y-4">
                  <h4 className="text-xs font-extrabold text-[#7B1E2B] uppercase tracking-wider">
                    Avaliação de Tocabilidade Acústica
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D9D9D9] flex justify-between items-center">
                      <span className="text-[#666672] font-semibold">Nível de Dificuldade:</span>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                        {parsedLabChord.notes.length <= 3 ? 'Iniciante' : parsedLabChord.notes.length === 4 ? 'Intermediário' : 'Avançado'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D9D9D9] flex justify-between items-center">
                      <span className="text-[#666672] font-semibold">Tipo Harmônico:</span>
                      <span className="font-bold text-[#25252A] capitalize">
                        {parsedLabChord.quality.includes('7') ? 'Tétrade' : 'Tríade Estendida'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D9D9D9] flex justify-between items-center">
                      <span className="text-[#666672] font-semibold">Resolução Recomendada:</span>
                      <span className="font-mono-code font-bold text-[#7B1E2B]">
                        {parsedLabChord.quality.includes('dom') || parsedLabChord.symbol.includes('7') ? 'Tônica (I)' : 'Livre'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#666672] leading-relaxed">
                    Dica: No violão físico, busque deixar o máximo de cordas soltas ressoando para valorizar os harmônicos naturais da madeira.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-[#666672] bg-[#F8F7F4] rounded-2xl border border-dashed border-[#D9D9D9]">
                <AlertCircle className="w-6 h-6 text-[#7B1E2B] mx-auto mb-2" />
                <p className="font-bold text-[#25252A]">Cifra não identificada</p>
                <p className="text-xs mt-1">Verifique a ortografia da cifra (ex: utilize Cmaj7, Dm7, Gadd9, F#m, Bb7).</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE: Laboratório de Sonoridades (NOVO) */}
      {activeTabMode === 'sonorities' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg font-black text-[#25252A] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7B1E2B]" />
                Laboratório Comparativo de Sonoridades Acústicas
              </h2>
              <p className="text-xs text-[#666672] mt-1 font-medium">
                Compare lado a lado os acordes básicos e suas variações acústicas ricas (add9, maj7, sus2, sus4). Ouça a diferença de cor sonora em tempo real.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {sonoritiesFamilies.map((family) => (
                <div key={family.id} className="bg-[#F8F7F4] rounded-2xl p-5 border border-[#D9D9D9] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9D9D9] pb-3">
                    <div>
                      <h3 className="text-base font-black text-[#25252A] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7B1E2B]" />
                        {family.name}
                      </h3>
                      <p className="text-xs text-[#666672] mt-0.5">{family.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {family.variants.map((v) => (
                      <div
                        key={v.symbol}
                        className="bg-white rounded-xl p-4 border border-[#D9D9D9] shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-black font-mono-code text-[#7B1E2B]">{v.symbol}</span>
                            <span className="px-2 py-0.5 rounded-md bg-[#F5E8EA] text-[#7B1E2B] text-[10px] font-bold">
                              {v.tag}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[#25252A] block mt-1">{v.namePt}</span>
                          <span className="text-[11px] font-mono-code text-[#666672] block">Fórmula: {v.formula} ({v.notes})</span>
                          <p className="text-xs text-[#666672] mt-2 italic">"{v.vibe}"</p>

                          <div className="flex justify-center my-2">
                            <ChordDiagram
                              frets={v.frets}
                              symbol={v.symbol}
                              size="xs"
                              showAudio={false}
                              showTitle={false}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => playSonorityChord(v.frets)}
                          className="w-full py-2 bg-[#F8F7F4] hover:bg-[#F5E8EA] border border-[#D9D9D9] rounded-xl text-xs font-bold text-[#25252A] hover:text-[#7B1E2B] transition flex items-center justify-center gap-1.5"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#7B1E2B]" />
                          Ouvir Sonoridade
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 1: Standard Dictionary */}
      {activeTabMode === 'dictionary' && (
        <div className="space-y-6">
          {/* Search bar & Root Note Selector */}
          <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                Fundamental (Tônica):
              </label>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#666672] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar acorde (ex: C, Em7, F#)..."
                    className="pl-9 pr-3 py-1.5 bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl text-xs font-bold text-[#25252A] focus:border-[#7B1E2B] focus:outline-none w-48 sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Root note quick buttons */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedRoot('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedRoot === 'ALL'
                    ? 'bg-[#7B1E2B] text-white shadow-xs'
                    : 'bg-[#F8F7F4] text-[#666672] hover:text-[#25252A] border border-[#D9D9D9]'
                }`}
              >
                Todos
              </button>
              {CHROMATIC_NOTES.map((root) => (
                <button
                  key={`root-btn-${root}`}
                  onClick={() => setSelectedRoot(root)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedRoot === root
                      ? 'bg-[#7B1E2B] text-white shadow-xs'
                      : 'bg-[#F8F7F4] text-[#25252A] hover:bg-[#F5E8EA] border border-[#D9D9D9]'
                  }`}
                >
                  {root}
                </button>
              ))}
            </div>

            {/* Sub-Filters: Type and Category */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D9D9D9]">
              <span className="text-[11px] font-bold text-[#666672]">Tipo:</span>
              {(['ALL', 'major', 'minor', '7', 'sus4', 'dim'] as const).map((type) => (
                <button
                  key={`type-btn-${type}`}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    selectedType === type
                      ? 'bg-[#25252A] text-white shadow-xs'
                      : 'bg-[#F8F7F4] text-[#666672] hover:text-[#25252A] border border-[#D9D9D9]'
                  }`}
                >
                  {type === 'ALL' ? 'Todos os Tipos' : type === '7' ? 'Dominante (7)' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Main Dictionary Content: List + Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chords Grid / List */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#666672] px-1">
                <span>Acordes Encontrados ({filteredChords.length})</span>
                <span>Toque para inspecionar</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto p-1">
                {filteredChords.map((chord) => {
                  const isSelected = chord.id === activeChord.id;
                  const isFav = favoriteChords.includes(chord.id);

                  return (
                    <button
                      key={chord.id}
                      onClick={() => setSelectedChordId(chord.id)}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between relative group ${
                        isSelected
                          ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs scale-102 font-bold'
                          : 'bg-white border-[#D9D9D9] hover:bg-[#F5E8EA]'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="text-xl font-black font-mono-code leading-none">
                          {chord.symbol}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(chord.id);
                          }}
                          className={`p-1 rounded-lg transition ${
                            isFav ? 'text-[#F5C542]' : 'text-gray-300 hover:text-[#F5C542]'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      <div className="mt-2 space-y-0.5">
                        <span className={`text-[11px] block font-semibold truncate ${isSelected ? 'text-white/90' : 'text-[#25252A]'}`}>
                          {chord.namePt}
                        </span>
                        <span className={`text-[9px] block font-mono-code ${isSelected ? 'text-[#F5E8EA]' : 'text-[#666672]'}`}>
                          {chord.notes.join(' • ')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Chord Focus Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <ChordDiagram
                  chord={activeChord}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Reverse Chord Finder */}
      {activeTabMode === 'reverse' && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
              <Search className="w-5 h-5 text-[#7B1E2B]" />
              Identificador Reverso de Acordes (Busca por Notas)
            </h2>
            <p className="text-xs text-[#666672] mt-1 font-medium">
              Selecione as notas que você está tocando no braço para descobrir quais acordes elas formam.
            </p>
          </div>

          {/* Note Selector Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
              Selecione as notas componentes:
            </label>
            <div className="flex flex-wrap gap-2">
              {CHROMATIC_NOTES.map((note) => {
                const isSelected = reverseSelectedNotes.includes(note);
                return (
                  <button
                    key={`rev-note-${note}`}
                    onClick={() => {
                      if (isSelected) {
                        setReverseSelectedNotes(reverseSelectedNotes.filter((n) => n !== note));
                      } else {
                        setReverseSelectedNotes([...reverseSelectedNotes, note]);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center min-w-[50px] ${
                      isSelected
                        ? 'bg-[#7B1E2B] text-white shadow-xs scale-105'
                        : 'bg-[#F8F7F4] text-[#25252A] border border-[#D9D9D9] hover:bg-[#F5E8EA]'
                    }`}
                  >
                    <span>{note}</span>
                    <span className={`text-[9px] ${isSelected ? 'text-[#F5E8EA]' : 'text-[#666672]'}`}>
                      {CIPHER_TO_PT[note]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reverse Search Matches */}
          <div className="space-y-3 pt-4 border-t border-[#D9D9D9]">
            <h3 className="text-xs font-bold text-[#25252A] uppercase tracking-wider">
              Acordes Compatíveis Encontrados ({reverseResults.length}):
            </h3>

            {reverseResults.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#666672] bg-[#F8F7F4] rounded-2xl border border-dashed border-[#D9D9D9]">
                Selecione pelo menos 2 ou 3 notas acima para identificar o acorde.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {reverseResults.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 rounded-2xl border border-[#D9D9D9] bg-[#F8F7F4] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black font-mono-code text-[#7B1E2B]">{match.symbol}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {match.qualityName}
                      </span>
                    </div>
                    <span className="text-xs text-[#25252A] font-bold block">Tônica: {match.root}</span>
                    <span className="text-[11px] text-[#666672] font-mono-code block">Notas: {match.notes.join(', ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: CAGED System Generator */}
      {activeTabMode === 'caged' && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7B1E2B]" />
              Gerador Dinâmico do Sistema CAGED
            </h2>
            <p className="text-xs text-[#666672] mt-1 font-medium">
              Explore os 5 formatos geométricos interligados (C, A, G, E, D) transladados para qualquer tônica pelo braço.
            </p>
          </div>

          {/* Root Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider mr-2">Tônica:</span>
            {CHROMATIC_NOTES.map((root) => (
              <button
                key={`caged-root-${root}`}
                onClick={() => setCagedRoot(root)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  cagedRoot === root
                    ? 'bg-[#7B1E2B] text-white shadow-xs'
                    : 'bg-[#F8F7F4] text-[#25252A] border border-[#D9D9D9] hover:bg-[#F5E8EA]'
                }`}
              >
                {root}
              </button>
            ))}
          </div>

          {/* 5 CAGED Shapes Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 border-t border-[#D9D9D9]">
            {cagedShapes.map((shape, idx) => (
              <div
                key={`caged-shape-${idx}`}
                className="p-4 rounded-2xl border border-[#D9D9D9] bg-[#F8F7F4] space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-[#7B1E2B] uppercase">Forma {shape.cagedForm || shape.chord}</span>
                    <span className="text-[10px] font-mono-code font-bold bg-white px-2 py-0.5 rounded-md border border-[#D9D9D9]">
                      Casa {shape.baseFret}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#25252A] font-mono-code mt-1">{shape.chord} (Formato {shape.cagedForm})</h3>
                  <div className="flex justify-center my-2">
                    <ChordDiagram
                      chord={shape}
                      size="xs"
                      showAudio={false}
                      showTitle={false}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D9D9D9] text-[10px] text-[#666672]">
                  Posição: <strong className="text-[#25252A] uppercase">{shape.position}</strong> ({shape.difficulty})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 4: Shape Validator */}
      {activeTabMode === 'validator' && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#7B1E2B]" />
              Validador Teórico de Digitações
            </h2>
            <p className="text-xs text-[#666672] mt-1 font-medium">
              Informe a casa pressionada em cada corda para validar se a digitação é fisicamente possível e teoricamente correta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8F7F4] p-5 rounded-2xl border border-[#D9D9D9]">
            {/* Input Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#7B1E2B] uppercase block">Acorde Alvo:</label>
                <input
                  type="text"
                  value={validatorTargetChord}
                  onChange={(e) => setValidatorTargetChord(e.target.value)}
                  className="mt-1 px-3 py-2 rounded-xl bg-white border border-[#D9D9D9] font-mono-code font-bold text-sm text-[#25252A] focus:outline-none focus:border-[#7B1E2B] w-full"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#7B1E2B] uppercase block">
                  Casas das 6 Cordas (6ª à 1ª, use -1 para mutada, 0 para solta):
                </label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {validatorFrets.map((fret, idx) => (
                    <div key={`val-fret-${idx}`} className="text-center">
                      <span className="text-[10px] text-[#666672] font-bold block">{6 - idx}ª</span>
                      <input
                        type="number"
                        min="-1"
                        max="24"
                        value={fret}
                        onChange={(e) => {
                          const next = [...validatorFrets];
                          const val = parseInt(e.target.value, 10);
                          next[idx] = isNaN(val) ? -1 : val;
                          setValidatorFrets(next);
                        }}
                        className="w-full text-center py-1.5 rounded-lg bg-white border border-[#D9D9D9] font-mono-code font-bold text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Validation Output */}
            <div className="bg-white p-5 rounded-xl border border-[#D9D9D9] space-y-3">
              <span className="text-xs font-bold text-[#666672] uppercase block">Resultado da Validação:</span>

              {validationResult.valid ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">Digitação Aprovada! Todas as notas pertencem a {validatorTargetChord}.</span>
                </div>
              ) : (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Inconsistência Encontrada:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                      {validationResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="pt-2 text-xs text-[#666672] space-y-1">
                <p>Notas tocadas no braço: <strong className="text-[#25252A] font-mono-code">{validationResult.notesPlayed.join(', ') || 'Nenhuma'}</strong></p>
                {validationResult.bassNote && (
                  <p>Baixo resultante: <strong className="text-[#7B1E2B] font-mono-code">{validationResult.bassNote}</strong></p>
                )}
              </div>

              {/* Diagrama Visual em Tempo Real */}
              <div className="pt-3 border-t border-[#D9D9D9] flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#666672] uppercase mb-1">Visualização no Braço:</span>
                <ChordDiagram
                  frets={validatorFrets}
                  symbol={validatorTargetChord}
                  size="sm"
                  showAudio={true}
                  showTitle={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

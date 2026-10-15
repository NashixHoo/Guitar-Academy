import React, { useState, useMemo } from 'react';
import { CHORD_DATABASE } from '../../data/chordDatabase';
import { ChordDiagram } from './ChordDiagram';
import { NoteCipher, ChordType } from '../../types';
import { CHROMATIC_NOTES, CIPHER_TO_PT } from '../../data/musicTheory';
import { ChordEngine } from '../../chords/chord-engine';
import { Search, BookOpen, Star, Sparkles, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

interface ChordDictionaryViewProps {
  favoriteChords: string[];
  onToggleFavorite: (chordId: string) => void;
}

export const ChordDictionaryView: React.FC<ChordDictionaryViewProps> = ({
  favoriteChords,
  onToggleFavorite,
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'dictionary' | 'reverse' | 'caged' | 'validator'>('dictionary');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<NoteCipher | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<ChordType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedChordId, setSelectedChordId] = useState<string>(CHORD_DATABASE[0]?.id || '');

  // Reverse Finder State
  const [reverseNotesInput, setReverseNotesInput] = useState<string>('C E G');
  const [reverseSelectedNotes, setReverseSelectedNotes] = useState<string[]>(['C', 'E', 'G']);

  // CAGED System State
  const [cagedRoot, setCagedRoot] = useState<string>('C');

  // Validator State
  const [validatorFrets, setValidatorFrets] = useState<number[]>([-1, 3, 2, 0, 1, 0]);
  const [validatorTargetChord, setValidatorTargetChord] = useState<string>('C');

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

  // Validation output via Virtuo Musical Validator
  const validationResult = useMemo(() => {
    return ChordEngine.validateShape(
      { frets: validatorFrets, instrument: 'electric-guitar' },
      validatorTargetChord,
      'electric-guitar'
    );
  }, [validatorFrets, validatorTargetChord]);

  const chordTypes: { id: ChordType | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Todos os Tipos' },
    { id: 'major', label: 'Maiores (M)' },
    { id: 'minor', label: 'Menores (m)' },
    { id: '7', label: 'Dominantes (7)' },
    { id: 'maj7', label: 'Sétima Maior (7M)' },
    { id: 'm7', label: 'Menor c/ Sétima (m7)' },
    { id: 'sus2', label: 'Sus2' },
    { id: 'sus4', label: 'Sus4' },
    { id: '5', label: 'Power Chord (5)' },
    { id: 'add9', label: 'Add9' },
    { id: 'dim', label: 'Diminutos (°)' },
    { id: 'aug', label: 'Aumentados (+)' },
    { id: 'm7b5', label: 'Meio-Diminuto' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Dicionário e Motor Harmônico de Acordes</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Formas testadas na afinação padrão, gerador CAGED dinâmico, identificador reverso de notas e validação teórica estrita.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F8F7F4] p-1.5 rounded-2xl border border-[#D9D9D9]">
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
            <span>Sistema CAGED</span>
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

      {/* MODE 1: Standard Dictionary */}
      {activeTabMode === 'dictionary' && (
        <div className="space-y-6">
          {/* Search bar & Root Note Selector */}
          <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                Fundamental (Tônica):
              </label>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666672]" />
                <input
                  type="text"
                  placeholder="Buscar por cifra ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[#F8F7F4] border border-[#D9D9D9] text-[#25252A] text-xs placeholder:text-[#666672]/60 focus:border-[#7B1E2B] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedRoot('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                  selectedRoot === 'ALL'
                    ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                    : 'bg-[#F8F7F4] text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
                }`}
              >
                Todas
              </button>
              {CHROMATIC_NOTES.map((root) => {
                const pt = CIPHER_TO_PT[root];
                const isSelected = selectedRoot === root;
                return (
                  <button
                    key={`root-${root}`}
                    onClick={() => setSelectedRoot(root)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex flex-col items-center border ${
                      isSelected
                        ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                        : 'bg-[#F8F7F4] text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
                    }`}
                  >
                    <span>{root}</span>
                    <span className="text-[9px] opacity-80 leading-none">{pt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chord Type Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {chordTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  selectedType === t.id
                    ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                    : 'bg-white text-[#666672] hover:text-[#25252A] border-[#D9D9D9]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Active Chord Inspector */}
            {activeChord && (
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white border border-[#7B1E2B]/40 rounded-3xl p-6 shadow-xs relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
                      Em Destaque
                    </span>
                    <button
                      onClick={() => onToggleFavorite(activeChord.id)}
                      className="p-1.5 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] text-[#666672] transition border border-[#D9D9D9]"
                      title="Favoritar este acorde"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favoriteChords.includes(activeChord.id)
                            ? 'fill-[#B52A3A] text-[#B52A3A]'
                            : 'text-[#666672]'
                        }`}
                      />
                    </button>
                  </div>

                  <ChordDiagram chord={activeChord} size="lg" showDetails={true} />

                  <div className="mt-5 pt-4 border-t border-[#D9D9D9] space-y-3">
                    <h4 className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
                      Formação & Anatomia Harmônica
                    </h4>
                    <p className="text-xs text-[#666672] leading-relaxed">
                      {activeChord.description}
                    </p>

                    <div className="bg-[#F8F7F4] p-3.5 rounded-xl border border-[#D9D9D9] space-y-1.5">
                      <span className="text-[11px] font-bold text-[#7B1E2B] block">
                        Intervalos constituintes:
                      </span>
                      <ul className="text-xs text-[#666672] space-y-0.5">
                        {activeChord.intervals.map((inter, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7B1E2B]" />
                            <span>{inter}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right: Grid of Chords */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#666672] px-1 font-medium">
                <span>{filteredChords.length} acordes encontrados</span>
              </div>

              {filteredChords.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-[#D9D9D9] text-[#666672]">
                  <p className="text-base font-semibold text-[#25252A]">Nenhum acorde encontrado com esses filtros.</p>
                  <p className="text-xs mt-1">Experimente limpar a busca ou selecionar "Todas as tônicas".</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedRoot('ALL');
                      setSelectedType('ALL');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#7B1E2B] text-white font-bold text-xs hover:bg-[#B52A3A]"
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredChords.map((chord) => {
                    const isSelected = chord.id === activeChord?.id;
                    return (
                      <div
                        key={chord.id}
                        onClick={() => setSelectedChordId(chord.id)}
                        className={`cursor-pointer transition-transform ${
                          isSelected ? 'ring-2 ring-[#7B1E2B] rounded-2xl scale-[1.02]' : ''
                        }`}
                      >
                        <ChordDiagram chord={chord} size="sm" showDetails={false} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Reverse Chord Finder */}
      {activeTabMode === 'reverse' && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#25252A] flex items-center gap-2">
              <Search className="w-5 h-5 text-[#7B1E2B]" />
              Identificador Reverso de Acordes (Reverse Chord Finder)
            </h2>
            <p className="text-xs sm:text-sm text-[#666672]">
              Selecione as notas que você está tocando no braço da guitarra para que o motor harmônico identifique a tríade, tétrade ou inversão exata.
            </p>
          </div>

          {/* Quick Note Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
              Selecione as Notas Tocadas:
            </label>
            <div className="flex flex-wrap gap-2">
              {CHROMATIC_NOTES.map((note) => {
                const isSelected = reverseSelectedNotes.includes(note);
                return (
                  <button
                    key={`rev-${note}`}
                    onClick={() => {
                      if (isSelected) {
                        setReverseSelectedNotes(reverseSelectedNotes.filter((n) => n !== note));
                      } else {
                        setReverseSelectedNotes([...reverseSelectedNotes, note]);
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                      isSelected
                        ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                        : 'bg-[#F8F7F4] text-[#25252A] border-[#D9D9D9] hover:bg-white'
                    }`}
                  >
                    {note} ({CIPHER_TO_PT[note]})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reverse Results */}
          <div className="space-y-3 pt-4 border-t border-[#D9D9D9]">
            <h3 className="text-xs font-bold text-[#25252A] uppercase tracking-wider">
              Acordes Reconhecidos ({reverseResults.length}):
            </h3>

            {reverseResults.length === 0 ? (
              <p className="text-xs text-[#666672] italic bg-[#F8F7F4] p-4 rounded-xl border border-[#D9D9D9]">
                Selecione pelo menos 2 ou 3 notas (ex: C, E, G para Dó Maior) para identificar os acordes compatíveis.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {reverseResults.map((res, idx) => (
                  <div key={idx} className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[#25252A] font-mono-code">{res.symbol}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
                        {res.qualityName}
                      </span>
                    </div>
                    <div className="text-xs text-[#666672]">
                      <p>Fundamental: <strong className="text-[#25252A]">{res.root}</strong></p>
                      {res.bass && <p>Baixo Invertido: <strong className="text-[#7B1E2B]">/{res.bass}</strong></p>}
                      <p className="font-mono-code mt-1 text-[11px] text-[#7B1E2B]">Notas: {res.notes.join(' - ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: Dynamic CAGED System */}
      {activeTabMode === 'caged' && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#25252A] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7B1E2B]" />
              Sistema CAGED Dinâmico na Guitarra
            </h2>
            <p className="text-xs sm:text-sm text-[#666672]">
              Visualize como os 5 modelos fundamentais (C, A, G, E, D) se deslocam ao longo da escala da Giannini 101 HSS para formar qualquer acorde maior.
            </p>
          </div>

          {/* Root Selector for CAGED */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
              Selecione a Tônica do CAGED:
            </label>
            <div className="flex flex-wrap gap-2">
              {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => (
                <button
                  key={`caged-${note}`}
                  onClick={() => setCagedRoot(note)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                    cagedRoot === note
                      ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                      : 'bg-[#F8F7F4] text-[#25252A] border-[#D9D9D9] hover:bg-white'
                  }`}
                >
                  {note} Maior
                </button>
              ))}
            </div>
          </div>

          {/* Generated Shapes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[#D9D9D9]">
            {cagedShapes.map((shape, idx) => (
              <div key={idx} className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] space-y-3">
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-[#7B1E2B] uppercase">Formato {shape.cagedForm}</span>
                  <span className="text-[#666672]">{shape.position === 'open' ? 'Posição Aberta' : `Pestana na ${shape.baseFret}ª casa`}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#D9D9D9] space-y-1">
                  <span className="text-[10px] font-bold text-[#666672] uppercase block">Trastes das 6 Cordas:</span>
                  <div className="flex items-center justify-between text-xs font-mono-code font-bold">
                    {shape.frets.map((f, fIdx) => (
                      <div key={fIdx} className="text-center">
                        <span className="text-[9px] text-[#666672] block">{6 - fIdx}ª</span>
                        <span className={f === -1 ? 'text-rose-600' : f === 0 ? 'text-emerald-600' : 'text-[#25252A]'}>
                          {f === -1 ? 'X' : f === 0 ? 'O' : f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-[#666672]">
                  {shape.position === 'open'
                    ? 'Posição aberta fundamental com cordas soltas ressoando.'
                    : `Transposição móvel baseada no formato de ${shape.cagedForm}.`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 4: Musical Validator */}
      {activeTabMode === 'validator' && (
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#25252A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#7B1E2B]" />
              Validador Teórico de Digitações (Musical Validator)
            </h2>
            <p className="text-xs sm:text-sm text-[#666672]">
              Insira a digitação de uma forma (trastes de 6ª a 1ª corda) para verificar se as notas físicas emitidas pertencem estritamente à harmonia teórica do acorde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8F7F4] p-6 rounded-2xl border border-[#D9D9D9]">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block mb-1">
                  Acorde Alvo Esperado:
                </label>
                <input
                  type="text"
                  value={validatorTargetChord}
                  onChange={(e) => setValidatorTargetChord(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-[#D9D9D9] font-mono-code font-bold text-sm w-full"
                  placeholder="Ex: C, Em, G, D/F#"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block mb-1">
                  Trastes (6ª a 1ª corda, -1 para mutada):
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {[6, 5, 4, 3, 2, 1].map((strNum, idx) => (
                    <div key={strNum} className="text-center">
                      <span className="text-[10px] font-bold text-[#666672] block">{strNum}ª C</span>
                      <input
                        type="number"
                        min="-1"
                        max="22"
                        value={validatorFrets[idx]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          const next = [...validatorFrets];
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

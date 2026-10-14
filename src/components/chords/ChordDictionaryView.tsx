import React, { useState, useMemo } from 'react';
import { CHORD_DATABASE } from '../../data/chordDatabase';
import { ChordDiagram } from './ChordDiagram';
import { NoteCipher, ChordType } from '../../types';
import { CHROMATIC_NOTES, CIPHER_TO_PT } from '../../data/musicTheory';
import { Search, BookOpen, Star, Sparkles } from 'lucide-react';

interface ChordDictionaryViewProps {
  favoriteChords: string[];
  onToggleFavorite: (chordId: string) => void;
}

export const ChordDictionaryView: React.FC<ChordDictionaryViewProps> = ({
  favoriteChords,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<NoteCipher | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<ChordType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedChordId, setSelectedChordId] = useState<string>(CHORD_DATABASE[0]?.id || '');

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
            <h1 className="text-2xl font-black text-[#25252A]">Dicionário de Acordes Funcional</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Posições testadas na afinação padrão com digitação correta, notas, intervalos e reprodução em áudio.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666672]" />
          <input
            type="text"
            placeholder="Buscar por cifra, nome ou nota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F7F4] border border-[#D9D9D9] text-[#25252A] text-xs placeholder:text-[#666672]/60 focus:border-[#7B1E2B] focus:outline-none"
          />
        </div>
      </div>

      {/* Root Note Selector Bar */}
      <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs">
        <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block mb-2">
          Fundamental (Tônica):
        </label>
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

      {/* Main Content Layout: Active Chord Showcase + Chord Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Chord Inspector Card */}
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

              {/* Large SVG Chord Diagram */}
              <ChordDiagram chord={activeChord} size="lg" showDetails={true} />

              {/* Theoretical Explanation */}
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

        {/* Right: Grid of Chords matching filters */}
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
  );
};

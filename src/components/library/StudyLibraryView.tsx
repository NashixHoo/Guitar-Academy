import React, { useState } from 'react';
import { STUDY_LIBRARY } from '../../data/studyLibrary';
import { BookMarked, Flame, Sparkles } from 'lucide-react';

interface StudyLibraryViewProps {
  onOpenMetronomeAtBpm: (bpm: number) => void;
}

export const StudyLibraryView: React.FC<StudyLibraryViewProps> = ({ onOpenMetronomeAtBpm }) => {
  const [selectedSongId, setSelectedSongId] = useState<string>(STUDY_LIBRARY[0].id);

  const activeSong = STUDY_LIBRARY.find((s) => s.id === selectedSongId) || STUDY_LIBRARY[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Biblioteca de Estudos e Repertório Didático</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Progressões clássicas de estudo, licks lendários e aplicações musicais do mundo real prontas para praticar.
          </p>
        </div>
      </div>

      {/* Song Selection List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {STUDY_LIBRARY.map((song) => {
          const isSelected = song.id === activeSong.id;
          return (
            <div
              key={song.id}
              onClick={() => setSelectedSongId(song.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                isSelected
                  ? 'bg-[#F5E8EA] border-[#7B1E2B] shadow-xs scale-[1.01]'
                  : 'bg-white border-[#D9D9D9] hover:bg-[#F8F7F4]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-2 font-bold">
                <span className="text-[#7B1E2B] uppercase">{song.genre}</span>
                <span className="text-[#B52A3A]">{song.difficulty}</span>
              </div>
              <h3 className="font-bold text-[#25252A] text-sm line-clamp-1">{song.title}</h3>
              <div className="flex items-center gap-2 text-xs text-[#666672] mt-2 font-mono-code font-medium">
                <span>Tom: {song.key}</span>
                <span>•</span>
                <span>{song.bpm} BPM</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Study Piece Detail Showcase */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D9D9D9]">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
              {activeSong.genre} • {activeSong.difficulty}
            </span>
            <h2 className="text-2xl font-black text-[#25252A] mt-2">{activeSong.title}</h2>
          </div>

          <button
            onClick={() => onOpenMetronomeAtBpm(activeSong.bpm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] text-xs font-bold shadow-xs transition"
          >
            <Flame className="w-4 h-4 fill-current text-white" />
            <span>Treinar no Andamento Original ({activeSong.bpm} BPM)</span>
          </button>
        </div>

        {/* Chords Used Strip */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
            Acordes Utilizados:
          </label>
          <div className="flex flex-wrap gap-2">
            {activeSong.chords.map((ch) => (
              <span
                key={ch}
                className="px-4 py-2 rounded-xl bg-[#F8F7F4] border border-[#D9D9D9] text-[#25252A] font-mono-code font-bold text-sm shadow-xs"
              >
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Harmonic Analysis & Explanation */}
        <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] space-y-1">
          <span className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
            Análise Harmônica e Dicas de Execução:
          </span>
          <p className="text-xs sm:text-sm text-[#666672] leading-relaxed font-medium">
            {activeSong.progressionExplanation}
          </p>
        </div>

        {/* Tablature Viewer */}
        {activeSong.tablatureSnippet && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
              Tablatura & Guia Rítmico de Execução:
            </label>
            <pre className="bg-[#1A1A20] p-5 rounded-2xl text-xs sm:text-sm font-mono-code text-[#F8F7F4] overflow-x-auto border border-[#33333E] leading-relaxed shadow-inner">
              {activeSong.tablatureSnippet.trim()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

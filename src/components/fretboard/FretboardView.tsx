import React, { useState, useMemo, useEffect } from 'react';
import { InteractiveFretboard } from './InteractiveFretboard';
import { CHROMATIC_NOTES, CIPHER_TO_PT, SCALES, STANDARD_TUNING, getFretNote } from '../../data/musicTheory';
import { NoteCipher } from '../../types';
import { audioEngine } from '../../audio/audioEngine';
import { Guitar, Eye, Music, Layers, Sparkles, Award, Target, CheckCircle2, RotateCcw } from 'lucide-react';
import { IllustrativeCard } from '../common/IllustrativeCard';
import { SCREEN_ARTWORKS } from '../../data/visualGallery';

export const FretboardView: React.FC = () => {
  const [notation, setNotation] = useState<'cipher' | 'portuguese' | 'both'>('both');
  const [selectedNote, setSelectedNote] = useState<NoteCipher | 'NONE'>('NONE');
  const [selectedScale, setSelectedScale] = useState<string>('none');
  const [scaleRoot, setScaleRoot] = useState<NoteCipher>('A');
  const [showAllNotes, setShowAllNotes] = useState<boolean>(true);
  const [maxFrets, setMaxFrets] = useState<number>(15);

  // Modo Desafio de Localização de Notas
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [targetQuizNote, setTargetQuizNote] = useState<NoteCipher>('C');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [quizAttempts, setQuizAttempts] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const startNewQuizRound = () => {
    const randomNote = CHROMATIC_NOTES[Math.floor(Math.random() * CHROMATIC_NOTES.length)];
    setTargetQuizNote(randomNote);
    setQuizFeedback(null);
  };

  const handleStartQuiz = () => {
    setQuizActive(true);
    setQuizScore(0);
    setQuizStreak(0);
    setQuizAttempts(0);
    setSelectedNote('NONE');
    setSelectedScale('none');
    startNewQuizRound();
  };

  const handleStopQuiz = () => {
    setQuizActive(false);
    setQuizFeedback(null);
  };

  const handleFretClick = (note: { cipher: string; pt: string; fret: number; stringNumber: number; freq: number }) => {
    // Tocar áudio da nota
    audioEngine.playGuitarNote(note.freq, 1.8, 0.7);

    if (quizActive) {
      setQuizAttempts((prev) => prev + 1);
      if (note.cipher === targetQuizNote) {
        setQuizScore((prev) => prev + 1);
        setQuizStreak((prev) => prev + 1);
        setQuizFeedback(`✓ Correto! ${note.cipher} (${note.pt}) na corda ${note.stringNumber}, casa ${note.fret}.`);
        setTimeout(() => {
          startNewQuizRound();
        }, 1200);
      } else {
        setQuizStreak(0);
        setQuizFeedback(`✗ Quase! Você clicou em ${note.cipher} (${note.pt}), procure ${targetQuizNote}.`);
      }
    } else {
      setSelectedNote(note.cipher as NoteCipher);
      setSelectedScale('none');
    }
  };

  const highlightedNotes = useMemo(() => {
    if (quizActive) {
      return [];
    }
    if (selectedScale !== 'none') {
      const scaleDef = SCALES.find((s) => s.id === selectedScale);
      if (scaleDef) {
        const rootIndex = CHROMATIC_NOTES.indexOf(scaleRoot);
        return scaleDef.intervals.map((semitones) => {
          return CHROMATIC_NOTES[(rootIndex + semitones) % 12];
        });
      }
    }
    if (selectedNote !== 'NONE') {
      return [selectedNote];
    }
    return [];
  }, [selectedScale, scaleRoot, selectedNote, quizActive]);

  // Encontrar todas as ocorrências da nota selecionada no braço
  const noteOccurrences = useMemo(() => {
    if (selectedNote === 'NONE') return [];
    const occurrences: { stringNumber: number; fret: number; freq: number; octave: number }[] = [];
    STANDARD_TUNING.forEach((str) => {
      for (let f = 0; f <= maxFrets; f++) {
        const n = getFretNote(str, f);
        if (n.cipher === selectedNote) {
          occurrences.push({ stringNumber: str.stringNumber, fret: f, freq: n.frequencyHz, octave: n.octave });
        }
      }
    });
    return occurrences;
  }, [selectedNote, maxFrets]);

  const activeScaleDef = SCALES.find((s) => s.id === selectedScale);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Guitar className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Mapa Inteligente do Braço (Laboratório Interativo)</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Localize notas, escalas, graus e frequências acústicas de E2 a E4. Teste seus reflexos com o Desafio do Braço.
          </p>
        </div>

        {/* View Options Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-[#F8F7F4] p-1 rounded-xl border border-[#D9D9D9] flex items-center text-xs">
            <button
              onClick={() => setNotation('cipher')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                notation === 'cipher' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
              }`}
            >
              Cifra (C)
            </button>
            <button
              onClick={() => setNotation('portuguese')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                notation === 'portuguese' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
              }`}
            >
              Nome (Dó)
            </button>
            <button
              onClick={() => setNotation('both')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                notation === 'both' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
              }`}
            >
              Ambos
            </button>
          </div>
        </div>
      </div>

      <IllustrativeCard artwork={SCREEN_ARTWORKS.scales} variant="strip" />

      {/* Control Strip: Scale Selector, Single Note Finder, Max Frets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scale Finder */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs space-y-3">
          <label className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#B52A3A]" />
            <span>Mapear Escala no Braço</span>
          </label>

          <div className="flex gap-2">
            <select
              value={scaleRoot}
              onChange={(e) => setScaleRoot(e.target.value as NoteCipher)}
              disabled={quizActive}
              className="bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-3 py-2 text-xs font-bold text-[#25252A] focus:border-[#7B1E2B] focus:outline-none"
            >
              {CHROMATIC_NOTES.map((n) => (
                <option key={`scale-root-${n}`} value={n}>
                  {n} ({CIPHER_TO_PT[n]})
                </option>
              ))}
            </select>

            <select
              value={selectedScale}
              onChange={(e) => {
                setSelectedScale(e.target.value);
                if (e.target.value !== 'none') setSelectedNote('NONE');
              }}
              disabled={quizActive}
              className="flex-1 bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-3 py-2 text-xs font-bold text-[#25252A] focus:border-[#7B1E2B] focus:outline-none"
            >
              <option value="none">Nenhuma escala (Manual)</option>
              {SCALES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {activeScaleDef && (
            <div className="text-[11px] text-[#666672] bg-[#F8F7F4] p-2.5 rounded-xl border border-[#D9D9D9] space-y-1">
              <div className="font-mono-code text-[#7B1E2B] font-bold">
                Fórmula: {activeScaleDef.formula}
              </div>
              <div className="text-[#25252A]">{activeScaleDef.description}</div>
            </div>
          )}
        </div>

        {/* Locate Single Note */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs space-y-3">
          <label className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1.5 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-[#B52A3A]" />
            <span>Localizar Todas Ocorrências</span>
          </label>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedNote('NONE')}
              disabled={quizActive}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedNote === 'NONE'
                  ? 'bg-[#7B1E2B] text-white shadow-xs'
                  : 'bg-[#F8F7F4] text-[#666672] hover:text-[#25252A] border border-[#D9D9D9]'
              }`}
            >
              Limpar
            </button>
            {CHROMATIC_NOTES.map((note) => (
              <button
                key={`single-${note}`}
                disabled={quizActive}
                onClick={() => {
                  setSelectedNote(note);
                  setSelectedScale('none');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  selectedNote === note
                    ? 'bg-[#7B1E2B] text-white shadow-xs'
                    : 'bg-[#F8F7F4] text-[#25252A] hover:bg-[#F5E8EA] border border-[#D9D9D9]'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        {/* Neck Scope & Fret Limit */}
        <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs space-y-3">
          <label className="text-xs font-bold text-[#25252A] flex items-center gap-1.5 uppercase tracking-wider">
            <Music className="w-4 h-4 text-[#7B1E2B]" />
            <span>Extensão do Braço</span>
          </label>

          <div className="flex items-center gap-2">
            {[12, 15, 18, 24].map((fretCount) => (
              <button
                key={`fret-limit-${fretCount}`}
                onClick={() => setMaxFrets(fretCount)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                  maxFrets === fretCount
                    ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                    : 'bg-[#F8F7F4] text-[#666672] border-[#D9D9D9] hover:text-[#25252A]'
                }`}
              >
                {fretCount} Casas
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={showAllNotes}
              onChange={(e) => setShowAllNotes(e.target.checked)}
              className="w-4 h-4 accent-[#7B1E2B] rounded"
            />
            <span className="text-xs text-[#666672] font-medium">
              Exibir todas as notas simultaneamente
            </span>
          </label>
        </div>
      </div>

      {/* Quiz Bar / Desafio de Localização */}
      <div className="bg-white border border-[#D9D9D9] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F5E8EA] text-[#7B1E2B]">
            <Target className="w-5 h-5 text-[#B52A3A]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#25252A]">
              Desafio de Localização no Braço Físico
            </h3>
            <p className="text-xs text-[#666672]">
              {quizActive
                ? `Encontre e clique em qualquer casa que produza a nota ${targetQuizNote} (${CIPHER_TO_PT[targetQuizNote]})`
                : 'Treine a agilidade mental: encontre notas no braço em tempo recorde.'}
            </p>
          </div>
        </div>

        {quizActive ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="bg-[#F8F7F4] border border-[#D9D9D9] px-3 py-1.5 rounded-xl text-[#25252A]">
                Acertos: <strong className="text-[#7B1E2B]">{quizScore}</strong> / {quizAttempts}
              </span>
              <span className="bg-[#F8F7F4] border border-[#D9D9D9] px-3 py-1.5 rounded-xl text-[#25252A]">
                Sequência: <strong className="text-emerald-700">{quizStreak}</strong> 🔥
              </span>
            </div>
            <button
              onClick={handleStopQuiz}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#25252A] rounded-xl text-xs font-bold transition"
            >
              Encerrar Desafio
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartQuiz}
            className="px-4 py-2 bg-[#7B1E2B] hover:bg-[#B52A3A] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Iniciar Desafio de Notas
          </button>
        )}
      </div>

      {/* Feedback do Desafio */}
      {quizFeedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
            quizFeedback.startsWith('✓')
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}
        >
          {quizFeedback}
        </div>
      )}

      {/* Detalhes de Ocorrência da Nota Selecionada */}
      {selectedNote !== 'NONE' && (
        <div className="bg-[#F8F7F4] border border-[#D9D9D9] rounded-2xl p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#D9D9D9]">
            <span className="text-xs font-extrabold text-[#7B1E2B] uppercase tracking-wider">
              Ocorrências da Nota {selectedNote} ({CIPHER_TO_PT[selectedNote]}) até a {maxFrets}ª Casa:
            </span>
            <span className="text-xs text-[#666672] font-semibold">
              Total: {noteOccurrences.length} posições no braço
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-3">
            {noteOccurrences.map((occ, idx) => (
              <button
                key={`occ-${idx}`}
                onClick={() => audioEngine.playGuitarNote(occ.freq, 2.0, 0.7)}
                className="bg-white border border-[#D9D9D9] p-2.5 rounded-xl hover:border-[#7B1E2B] text-left transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#25252A]">{occ.stringNumber}ª Corda</span>
                  <span className="text-[#7B1E2B]">Casa {occ.fret}</span>
                </div>
                <span className="text-[10px] text-[#666672] mt-1 font-mono-code">
                  {occ.freq.toFixed(1)} Hz (Oitava {occ.octave})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Interactive Fretboard Component */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs">
        <InteractiveFretboard
          maxFrets={maxFrets}
          highlightedNotes={highlightedNotes}
          rootNote={selectedScale !== 'none' ? scaleRoot : selectedNote !== 'NONE' ? selectedNote : undefined}
          showAllNotes={showAllNotes}
          notation={notation}
          onNoteSelected={handleFretClick}
        />
      </div>

      {/* Referência Física de Afinação Padrão */}
      <div className="bg-white border border-[#D9D9D9] rounded-2xl p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-extrabold text-[#7B1E2B] uppercase tracking-wider flex items-center gap-2">
          <Guitar className="w-4 h-4 text-[#B52A3A]" />
          Tabela Acústica de Frequências (Afinação Padrão Internacional E2 - E4)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {STANDARD_TUNING.map((str) => (
            <div key={`tuning-${str.stringNumber}`} className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9] space-y-1">
              <div className="font-extrabold text-[#25252A] flex justify-between">
                <span>{str.stringNumber}ª ({str.openNoteCipher})</span>
                <span className="text-[#7B1E2B]">{str.openNotePt}</span>
              </div>
              <div className="text-[11px] font-mono-code text-[#666672]">
                {str.openFrequencyHz.toFixed(2)} Hz
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

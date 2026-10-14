import React, { useState } from 'react';
import { audioEngine } from '../../audio/audioEngine';
import { INTERVALS } from '../../data/musicTheory';
import { Volume2, CheckCircle2, XCircle, Trophy, Headphones, RefreshCw } from 'lucide-react';

export const EarTrainingView: React.FC = () => {
  const [mode, setMode] = useState<'intervals' | 'chords'>('intervals');
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(2);
  const [baseFreq, setBaseFreq] = useState(261.63);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const chordTypes = [
    { name: 'Maior (M)', semitones: [0, 4, 7], desc: 'Alegre, brilhante, resolvido' },
    { name: 'Menor (m)', semitones: [0, 3, 7], desc: 'Melancólico, reflexivo, emotivo' },
    { name: 'Diminuto (°)', semitones: [0, 3, 6], desc: 'Extremamente tenso, suspense' },
    { name: 'Aumentado (+)', semitones: [0, 4, 8], desc: 'Flutuante, etéreo, ficção científica' },
    { name: 'Dominante (7)', semitones: [0, 4, 7, 10], desc: 'Bluesy, pede resolução' },
  ];
  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  const generateNewQuestion = () => {
    setFeedback(null);
    if (mode === 'intervals') {
      const randomIdx = Math.floor(Math.random() * INTERVALS.length);
      const randomBase = 220 * Math.pow(2, Math.floor(Math.random() * 12) / 12);
      setCurrentIntervalIndex(randomIdx);
      setBaseFreq(randomBase);
      playInterval(randomBase, INTERVALS[randomIdx].semitones);
    } else {
      const randomIdx = Math.floor(Math.random() * chordTypes.length);
      const randomBase = 220 * Math.pow(2, Math.floor(Math.random() * 12) / 12);
      setCurrentChordIndex(randomIdx);
      setBaseFreq(randomBase);
      playChordQuality(randomBase, chordTypes[randomIdx].semitones);
    }
  };

  const playInterval = (base: number, semitones: number) => {
    const targetFreq = base * Math.pow(2, semitones / 12);
    audioEngine.playGuitarNote(base, 1.2, 0.7);
    setTimeout(() => {
      audioEngine.playGuitarNote(targetFreq, 1.2, 0.7);
    }, 450);
    setTimeout(() => {
      audioEngine.playGuitarNote(base, 1.4, 0.6);
      audioEngine.playGuitarNote(targetFreq, 1.4, 0.6);
    }, 1100);
  };

  const playChordQuality = (base: number, semitones: number[]) => {
    const freqs = semitones.map((st) => base * Math.pow(2, st / 12));
    audioEngine.playChord(freqs, false, 35);
  };

  const handleReplaySound = () => {
    if (mode === 'intervals') {
      playInterval(baseFreq, INTERVALS[currentIntervalIndex].semitones);
    } else {
      playChordQuality(baseFreq, chordTypes[currentChordIndex].semitones);
    }
  };

  const handleIntervalAnswer = (shortName: string) => {
    if (feedback !== null) return;
    setTotalAttempts((prev) => prev + 1);

    const isCorrect = shortName === INTERVALS[currentIntervalIndex].shortName;
    if (isCorrect) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
    } else {
      setFeedback('wrong');
    }
  };

  const handleChordAnswer = (typeName: string) => {
    if (feedback !== null) return;
    setTotalAttempts((prev) => prev + 1);

    const isCorrect = typeName === chordTypes[currentChordIndex].name;
    if (isCorrect) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Treinamento Auditivo (Ear Training)</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Desenvolva seu ouvido musical: reconheça intervalos de notas e a cor emocional dos acordes.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-[#F8F7F4] p-1 rounded-xl border border-[#D9D9D9] text-xs">
          <button
            onClick={() => {
              setMode('intervals');
              setFeedback(null);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              mode === 'intervals' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            Intervalos
          </button>
          <button
            onClick={() => {
              setMode('chords');
              setFeedback(null);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              mode === 'chords' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            Qualidade de Acordes
          </button>
        </div>
      </div>

      {/* Main Ear Training Workspace */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-center">
        {/* Score and Streak */}
        <div className="flex items-center justify-between text-xs text-[#666672]">
          <span className="font-bold text-[#25252A]">
            Modo: {mode === 'intervals' ? 'Reconhecimento de Intervalos' : 'Reconhecimento de Acordes'}
          </span>
          <div className="flex items-center gap-2 font-mono-code bg-[#F8F7F4] px-3.5 py-1.5 rounded-xl border border-[#D9D9D9]">
            <Trophy className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>
              Acertos: <strong className="text-emerald-700">{score}</strong> / {totalAttempts}
              {totalAttempts > 0 && ` (${Math.round((score / totalAttempts) * 100)}%)`}
            </span>
          </div>
        </div>

        {/* Audio Player Core Action (Wine Red Pulse) */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={handleReplaySound}
            className="w-24 h-24 rounded-full bg-[#7B1E2B] hover:bg-[#B52A3A] hover:scale-105 active:scale-95 text-white shadow-md flex items-center justify-center transition"
            title="Clique para ouvir o som novamente"
          >
            <Volume2 className="w-10 h-10 fill-current" />
          </button>

          <div className="text-xs text-[#666672] font-medium">
            Toque no botão para ouvir o exemplo sonoro gerado localmente via sintetizador.
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center gap-2 animate-in fade-in ${
              feedback === 'correct'
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                : 'bg-rose-50 border border-rose-300 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback === 'correct' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Muito bem! Resposta correta!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>
                    Incorreto. A resposta certa era:{' '}
                    {mode === 'intervals'
                      ? `${INTERVALS[currentIntervalIndex].name} (${INTERVALS[currentIntervalIndex].shortName})`
                      : chordTypes[currentChordIndex].name}
                  </span>
                </>
              )}
            </div>

            <div className="text-xs text-[#666672] font-normal">
              {mode === 'intervals'
                ? `${INTERVALS[currentIntervalIndex].soundDescription} • Exemplo: ${INTERVALS[currentIntervalIndex].example}`
                : chordTypes[currentChordIndex].desc}
            </div>

            <button
              onClick={generateNewQuestion}
              className="mt-2 flex items-center gap-2 px-5 py-2 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-white font-bold text-xs transition shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Próxima Pergunta</span>
            </button>
          </div>
        )}

        {/* Options grid */}
        {mode === 'intervals' ? (
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block text-center mb-3">
              Qual intervalo você acabou de ouvir?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {INTERVALS.map((inter) => (
                <button
                  key={inter.shortName}
                  onClick={() => handleIntervalAnswer(inter.shortName)}
                  disabled={feedback !== null}
                  className="p-3 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:border-[#E8D3D6] active:scale-95 text-[#25252A] transition border border-[#D9D9D9] flex flex-col items-center justify-center"
                >
                  <span className="font-bold text-sm text-[#7B1E2B]">{inter.shortName}</span>
                  <span className="text-[11px] text-[#666672] mt-0.5">{inter.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block text-center mb-3">
              Qual o tipo deste acorde?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {chordTypes.map((ct) => (
                <button
                  key={ct.name}
                  onClick={() => handleChordAnswer(ct.name)}
                  disabled={feedback !== null}
                  className="p-4 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:border-[#E8D3D6] active:scale-95 text-[#25252A] transition border border-[#D9D9D9] flex flex-col items-start"
                >
                  <span className="font-bold text-base text-[#7B1E2B]">{ct.name}</span>
                  <span className="text-xs text-[#666672] mt-1">{ct.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

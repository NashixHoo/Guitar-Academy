import React, { useState } from 'react';
import { audioEngine } from '../../audio/audioEngine';
import { INTERVALS, CHROMATIC_NOTES, CIPHER_TO_PT } from '../../data/musicTheory';
import { Volume2, CheckCircle2, XCircle, Trophy, Headphones, RefreshCw, ShieldAlert, Guitar } from 'lucide-react';
import { NoteCipher } from '../../types';

export const EarTrainingView: React.FC = () => {
  const [mode, setMode] = useState<'intervals' | 'chords' | 'tonic'>('intervals');
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(2);
  const [baseFreq, setBaseFreq] = useState(261.63);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const chordTypes = [
    { name: 'Maior (M)', semitones: [0, 4, 7], desc: 'Alegre, brilhante, resolvido' },
    { name: 'Menor (m)', semitones: [0, 3, 7], desc: 'Melancólico, reflexivo, emotivo' },
    { name: 'Diminuto (°)', semitones: [0, 3, 6], desc: 'Extremamente tenso, suspense' },
    { name: 'Aumentado (+)', semitones: [0, 4, 8], desc: 'Flutuante, etéreo, instável' },
    { name: 'Dominante (7)', semitones: [0, 4, 7, 10], desc: 'Bluesy, atração para resolver' },
  ];
  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  // Tonic quiz
  const tonicOptions: NoteCipher[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const [currentTonic, setCurrentTonic] = useState<NoteCipher>('A');

  const generateNewQuestion = () => {
    setFeedback(null);
    if (mode === 'intervals') {
      const randomIdx = Math.floor(Math.random() * INTERVALS.length);
      const randomBase = 220 * Math.pow(2, Math.floor(Math.random() * 12) / 12);
      setCurrentIntervalIndex(randomIdx);
      setBaseFreq(randomBase);
      playInterval(randomBase, INTERVALS[randomIdx].semitones);
    } else if (mode === 'chords') {
      const randomIdx = Math.floor(Math.random() * chordTypes.length);
      const randomBase = 220 * Math.pow(2, Math.floor(Math.random() * 12) / 12);
      setCurrentChordIndex(randomIdx);
      setBaseFreq(randomBase);
      playChordQuality(randomBase, chordTypes[randomIdx].semitones);
    } else {
      // Tonic recognition
      const randomTonic = tonicOptions[Math.floor(Math.random() * tonicOptions.length)];
      setCurrentTonic(randomTonic);
      const noteIdx = CHROMATIC_NOTES.indexOf(randomTonic);
      const freq = 110 * Math.pow(2, noteIdx / 12); // around A2-G3
      setBaseFreq(freq);
      playTonicNote(freq);
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

  const playTonicNote = (freq: number) => {
    audioEngine.playGuitarNote(freq, 2.5, 0.85);
  };

  const handleReplaySound = () => {
    if (mode === 'intervals') {
      playInterval(baseFreq, INTERVALS[currentIntervalIndex].semitones);
    } else if (mode === 'chords') {
      playChordQuality(baseFreq, chordTypes[currentChordIndex].semitones);
    } else {
      playTonicNote(baseFreq);
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

  const handleTonicAnswer = (tonic: NoteCipher) => {
    if (feedback !== null) return;
    setTotalAttempts((prev) => prev + 1);

    const isCorrect = tonic === currentTonic;
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
            <h1 className="text-2xl font-black text-[#25252A]">Treinamento Auditivo Real (Ear Training)</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Desenvolva seu ouvido musical: reconheça intervalos de notas, a cor emocional dos acordes e a nota tônica.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#F8F7F4] p-1 rounded-xl border border-[#D9D9D9] text-xs">
          <button
            onClick={() => {
              setMode('intervals');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
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
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'chords' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            Acordes
          </button>
          <button
            onClick={() => {
              setMode('tonic');
              setFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              mode === 'tonic' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            Achar a Tônica
          </button>
        </div>
      </div>

      {/* Honest Pedagogical Notice about Audio Capabilities */}
      <div className="p-4 rounded-2xl bg-white border border-[#D9D9D9] shadow-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#7B1E2B] shrink-0 mt-0.5" />
        <div className="text-xs text-[#666672] leading-relaxed">
          <strong className="text-[#25252A]">Transparência e Princípio Pedagógico:</strong> Os exemplos auditivos são gerados pelo motor Web Audio para treinar sua percepção interna. O aplicativo <em>não finge escutar seu microfone</em> nem avalia sua guitarra fisicamente por IA simulada: você escuta o som, tenta localizá-lo na sua guitarra física real e compara honestamente.
        </div>
      </div>

      {/* Main Ear Training Workspace */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-center">
        {/* Score and Streak */}
        <div className="flex items-center justify-between text-xs text-[#666672]">
          <span className="font-bold text-[#25252A]">
            Modo Atual: {mode === 'intervals' ? 'Reconhecimento de Intervalos' : mode === 'chords' ? 'Qualidade de Acordes' : 'Identificação da Nota Tônica'}
          </span>
          <div className="flex items-center gap-2 font-mono-code bg-[#F8F7F4] px-3.5 py-1.5 rounded-xl border border-[#D9D9D9]">
            <Trophy className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>
              Acertos: <strong className="text-emerald-700">{score}</strong> / {totalAttempts}
              {totalAttempts > 0 && ` (${Math.round((score / totalAttempts) * 100)}%)`}
            </span>
          </div>
        </div>

        {/* Audio Player Core Action */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={handleReplaySound}
            className="w-24 h-24 rounded-full bg-[#7B1E2B] hover:bg-[#B52A3A] hover:scale-105 active:scale-95 text-white shadow-md flex items-center justify-center transition"
            title="Clique para ouvir o som novamente"
          >
            <Volume2 className="w-10 h-10 fill-current" />
          </button>

          <div className="text-xs text-[#666672] font-medium">
            Toque no botão para ouvir o exemplo sonoro de referência.
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
                  <span>Muito bem! Ouvido afiado, resposta correta!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>
                    {mode === 'intervals'
                      ? `Incorreto. O intervalo era: ${INTERVALS[currentIntervalIndex].name} (${INTERVALS[currentIntervalIndex].shortName}).`
                      : mode === 'chords'
                      ? `Incorreto. O acorde era: ${chordTypes[currentChordIndex].name}.`
                      : `Incorreto. A nota fundamental era: ${currentTonic} (${CIPHER_TO_PT[currentTonic]}).`}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={generateNewQuestion}
              className="mt-2 px-5 py-2 rounded-xl bg-[#7B1E2B] hover:bg-[#B52A3A] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Próxima Pergunta</span>
            </button>
          </div>
        )}

        {/* Options grid */}
        {mode === 'intervals' && (
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
        )}

        {mode === 'chords' && (
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

        {mode === 'tonic' && (
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block text-center mb-3">
              Qual nota fundamental (tônica) você ouviu? (Tente encontrar na sua guitarra física!)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {tonicOptions.map((tonic) => (
                <button
                  key={`tonic-opt-${tonic}`}
                  onClick={() => handleTonicAnswer(tonic)}
                  disabled={feedback !== null}
                  className="p-3 rounded-xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:border-[#E8D3D6] active:scale-95 text-[#25252A] transition border border-[#D9D9D9] flex flex-col items-center justify-center"
                >
                  <span className="font-bold text-lg text-[#7B1E2B]">{tonic}</span>
                  <span className="text-xs text-[#666672] font-semibold">{CIPHER_TO_PT[tonic]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Physical Guitar Application Tip */}
        <div className="pt-4 border-t border-[#D9D9D9] text-left flex items-start gap-3">
          <Guitar className="w-5 h-5 text-[#7B1E2B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#666672] leading-relaxed">
            <strong className="text-[#25252A]">Como treinar na guitarra física:</strong> Quando ouvir o exemplo sonoro, cante a nota com a sua voz e em seguida percorra a 6ª corda ou 5ª corda da sua guitarra até encontrar a mesma casa que vibra na mesma altura. É assim que grandes músicos tiram canções de ouvido!
          </div>
        </div>
      </div>
    </div>
  );
};

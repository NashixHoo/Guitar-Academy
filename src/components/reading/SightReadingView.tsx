import React, { useState } from 'react';
import { audioEngine } from '../../audio/audioEngine';
import { Volume2, CheckCircle2, XCircle, Trophy, BookOpen, Music } from 'lucide-react';

interface StaffNoteQuiz {
  nameCipher: string;
  namePt: string;
  clefLineSpace: string;
  yPos: number;
  frequencyHz: number;
}

const STAFF_NOTES_POOL: StaffNoteQuiz[] = [
  { nameCipher: 'E', namePt: 'Mi', clefLineSpace: '1ª Linha (Mi4)', yPos: 110, frequencyHz: 329.63 },
  { nameCipher: 'F', namePt: 'Fá', clefLineSpace: '1º Espaço (Fá4)', yPos: 100, frequencyHz: 349.23 },
  { nameCipher: 'G', namePt: 'Sol', clefLineSpace: '2ª Linha (Sol4)', yPos: 90, frequencyHz: 392.00 },
  { nameCipher: 'A', namePt: 'Lá', clefLineSpace: '2º Espaço (Lá4)', yPos: 80, frequencyHz: 440.00 },
  { nameCipher: 'B', namePt: 'Si', clefLineSpace: '3ª Linha (Si4)', yPos: 70, frequencyHz: 493.88 },
  { nameCipher: 'C', namePt: 'Dó', clefLineSpace: '3º Espaço (Dó5)', yPos: 60, frequencyHz: 523.25 },
  { nameCipher: 'D', namePt: 'Ré', clefLineSpace: '4ª Linha (Ré5)', yPos: 50, frequencyHz: 587.33 },
  { nameCipher: 'E', namePt: 'Mi', clefLineSpace: '4º Espaço (Mi5)', yPos: 40, frequencyHz: 659.25 },
  { nameCipher: 'F', namePt: 'Fá', clefLineSpace: '5ª Linha (Fá5)', yPos: 30, frequencyHz: 698.46 },
];

export const SightReadingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'trainer'>('guide');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const currentQuiz = STAFF_NOTES_POOL[currentQuizIndex];

  const handlePlayCurrentNote = () => {
    audioEngine.playGuitarNote(currentQuiz.frequencyHz, 1.5, 0.75);
  };

  const handleAnswer = (guessedCipher: string) => {
    if (feedback !== null) return;

    setTotalAttempts((prev) => prev + 1);
    const isCorrect = guessedCipher === currentQuiz.nameCipher;

    if (isCorrect) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      audioEngine.playGuitarNote(currentQuiz.frequencyHz, 1.2, 0.8);
    } else {
      setFeedback('wrong');
      audioEngine.playGuitarNote(130.81, 0.5, 0.4);
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentQuizIndex((prev) => (prev + 1) % STAFF_NOTES_POOL.length);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Leitura Musical e Pauta</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Aprenda a ler na pauta de 5 linhas com Clave de Sol, decifre notas e treine sua leitura à primeira vista.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-[#F8F7F4] p-1 rounded-xl border border-[#D9D9D9] text-xs">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeTab === 'guide' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            Guia Teórico
          </button>
          <button
            onClick={() => setActiveTab('trainer')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeTab === 'trainer' ? 'bg-[#7B1E2B] text-white shadow-xs' : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            Treino Interativo
          </button>
        </div>
      </div>

      {activeTab === 'guide' ? (
        <div className="space-y-6">
          {/* Visual Treble Clef Explainer */}
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#7B1E2B]" />
              O Pentagrama e a Clave de Sol
            </h2>
            <p className="text-xs sm:text-sm text-[#666672] leading-relaxed">
              O pentagrama é formado por <strong>5 linhas horizontais paralelas</strong> e <strong>4 espaços</strong> entre elas, sempre contados de baixo para cima.
              A guitarra utiliza convencionalmente a <strong>Clave de Sol</strong>, cujo desenho se inicia na <strong>2ª linha</strong>, definindo que toda nota pousada na segunda linha é a nota <strong>Sol (G)</strong>.
            </p>

            {/* SVG Interactive Staff Diagram */}
            <div className="bg-[#F8F7F4] rounded-2xl p-6 my-4 border border-[#D9D9D9] overflow-x-auto shadow-inner">
              <svg viewBox="0 0 700 160" className="w-full min-w-[550px] select-none">
                {/* 5 Staff lines */}
                {[30, 50, 70, 90, 110].map((y) => (
                  <line key={`line-${y}`} x1="40" y1={y} x2="660" y2={y} stroke="#25252A" strokeWidth="2" />
                ))}

                {/* Treble Clef glyph */}
                <text x="50" y="105" fontSize="85" fill="#25252A" fontFamily="serif" fontWeight="bold">
                  𝄞
                </text>

                {/* Drawn Notes in Wine Red */}
                {STAFF_NOTES_POOL.map((sn, i) => {
                  const x = 160 + i * 55;
                  return (
                    <g key={`guide-note-${i}`} className="cursor-pointer group">
                      <ellipse cx={x} cy={sn.yPos} rx="9" ry="7" fill="#7B1E2B" transform={`rotate(-20, ${x}, ${sn.yPos})`} />
                      <line x1={x + 7} y1={sn.yPos} x2={x + 7} y2={sn.yPos - 35} stroke="#7B1E2B" strokeWidth="2" />
                      <text x={x} y="145" textAnchor="middle" fill="#25252A" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                        {sn.nameCipher}
                      </text>
                      <text x={x} y="157" textAnchor="middle" fill="#666672" fontSize="10" fontFamily="sans-serif">
                        {sn.namePt}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Mnemonic aid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] space-y-1">
                <span className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                  Notas nas Linhas (de baixo para cima):
                </span>
                <p className="text-sm font-black text-[#25252A]">Mi — Sol — Si — Ré — Fá</p>
                <p className="text-xs text-[#666672]">E — G — B — D — F (1ª a 5ª linha)</p>
              </div>

              <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] space-y-1">
                <span className="text-xs font-bold text-[#B52A3A] uppercase tracking-wider block">
                  Notas nos Espaços (de baixo para cima):
                </span>
                <p className="text-sm font-black text-[#25252A]">Fá — Lá — Dó — Mi</p>
                <p className="text-xs text-[#666672]">F — A — C — E (1º a 4º espaço)</p>
              </div>
            </div>
          </div>

          {/* Rhythmic Values Table */}
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#25252A]">Figuras Rítmicas e Duração dos Tempos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Semibreve', beats: '4 tempos', symbol: '𝅝', rel: 'Duração total no 4/4' },
                { name: 'Mínima', beats: '2 tempos', symbol: '𝅗𝅥', rel: 'Metade da semibreve' },
                { name: 'Semínima', beats: '1 tempo', symbol: '𝅘𝅥', rel: '1 batida do metrônomo' },
                { name: 'Colcheia', beats: '1/2 tempo', symbol: '𝅘𝅥𝅮', rel: '2 notas por batida' },
              ].map((fig) => (
                <div key={fig.name} className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] text-center">
                  <div className="text-4xl text-[#7B1E2B] my-1">{fig.symbol}</div>
                  <div className="text-sm font-bold text-[#25252A]">{fig.name}</div>
                  <div className="text-xs text-[#B52A3A] font-bold">{fig.beats}</div>
                  <div className="text-[10px] text-[#666672] mt-1">{fig.rel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Sight-Reading Quiz */
        <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
            <div>
              <h2 className="text-xl font-bold text-[#25252A] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#7B1E2B]" />
                Identifique a Nota na Pauta
              </h2>
              <p className="text-xs text-[#666672]">
                Observe a posição da nota e selecione o botão correto correspondente.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#F8F7F4] px-4 py-2 rounded-2xl border border-[#D9D9D9] text-xs font-mono-code">
              <span className="text-[#666672]">Acertos:</span>
              <span className="text-emerald-700 font-bold">{score}</span>
              <span className="text-[#D9D9D9]">/</span>
              <span className="text-[#25252A] font-bold">{totalAttempts}</span>
            </div>
          </div>

          {/* SVG Staff with single target note */}
          <div className="bg-[#F8F7F4] rounded-2xl p-6 border border-[#D9D9D9] relative flex flex-col items-center justify-center">
            <svg viewBox="0 0 400 160" className="w-full max-w-lg select-none">
              {[30, 50, 70, 90, 110].map((y) => (
                <line key={`quiz-line-${y}`} x1="30" y1={y} x2="370" y2={y} stroke="#25252A" strokeWidth="2" />
              ))}

              <text x="40" y="105" fontSize="80" fill="#25252A" fontFamily="serif" fontWeight="bold">
                𝄞
              </text>

              <g>
                <ellipse
                  cx="220"
                  cy={currentQuiz.yPos}
                  rx="10"
                  ry="8"
                  fill="#7B1E2B"
                  transform={`rotate(-20, 220, ${currentQuiz.yPos})`}
                />
                <line
                  x1={227}
                  y1={currentQuiz.yPos}
                  x2={227}
                  y2={currentQuiz.yPos - 38}
                  stroke="#7B1E2B"
                  strokeWidth="2.5"
                />
              </g>
            </svg>

            <button
              onClick={handlePlayCurrentNote}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#7B1E2B] hover:bg-[#F5E8EA] border border-[#D9D9D9] text-xs font-bold transition shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir o Som desta Nota</span>
            </button>
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-2xl text-center font-bold text-sm flex items-center justify-center gap-2 animate-in fade-in ${
                feedback === 'correct'
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border border-rose-300 text-rose-800'
              }`}
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Exato! A nota é {currentQuiz.nameCipher} ({currentQuiz.namePt}) — {currentQuiz.clefLineSpace}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Incorreto. A nota correta era {currentQuiz.nameCipher} ({currentQuiz.namePt})</span>
                </>
              )}
            </div>
          )}

          {/* Multiple choice note buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((cipher) => (
              <button
                key={`btn-note-${cipher}`}
                onClick={() => handleAnswer(cipher)}
                disabled={feedback !== null}
                className="py-4 rounded-2xl bg-[#F8F7F4] hover:bg-[#F5E8EA] hover:border-[#E8D3D6] hover:text-[#7B1E2B] active:scale-95 text-[#25252A] font-black text-lg transition border border-[#D9D9D9] flex flex-col items-center justify-center gap-0.5"
              >
                <span>{cipher}</span>
                <span className="text-[10px] text-[#666672] font-semibold">
                  {cipher === 'C' ? 'Dó' : cipher === 'D' ? 'Ré' : cipher === 'E' ? 'Mi' : cipher === 'F' ? 'Fá' : cipher === 'G' ? 'Sol' : cipher === 'A' ? 'Lá' : 'Si'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

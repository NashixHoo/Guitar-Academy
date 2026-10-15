import React, { useState, useMemo } from 'react';
import { STUDY_LIBRARY } from '../../data/studyLibrary';
import { ChordEngine } from '../../chords/chord-engine';
import { MusicIntelligence } from '../../music/music-intelligence';
import { calculateKey, transposeChord } from '../../music/transposer';
import { toEasyPlay } from '../../chords/easy-play-integration';
import {
  BookMarked,
  Flame,
  Sparkles,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Zap,
  Check,
  AlertTriangle,
  Lightbulb,
  X,
  Music
} from 'lucide-react';

interface StudyLibraryViewProps {
  onOpenMetronomeAtBpm: (bpm: number) => void;
}

export const StudyLibraryView: React.FC<StudyLibraryViewProps> = ({ onOpenMetronomeAtBpm }) => {
  const [selectedSongId, setSelectedSongId] = useState<string>(STUDY_LIBRARY[0].id);
  const [semitoneOffset, setSemitoneOffset] = useState<number>(0);
  const [isEasyPlayEnabled, setIsEasyPlayEnabled] = useState<boolean>(false);
  const [inspectedChord, setInspectedChord] = useState<string | null>(null);

  const activeSong = STUDY_LIBRARY.find((s) => s.id === selectedSongId) || STUDY_LIBRARY[0];

  // Reseta transposições ao mudar de música
  const handleSelectSong = (id: string) => {
    setSelectedSongId(id);
    setSemitoneOffset(0);
    setInspectedChord(null);
  };

  // Análise harmônica determinística pelo motor de inteligência musical
  const musicAnalysis = useMemo(() => {
    return MusicIntelligence.analyzeSong(activeSong);
  }, [activeSong]);

  // Tom resultante da transposição
  const currentKey = useMemo(() => {
    return calculateKey(activeSong.key, semitoneOffset);
  }, [activeSong.key, semitoneOffset]);

  // Lista de acordes processados (transpostos + opcionalmente simplificados via Easy Play)
  const processedChords = useMemo(() => {
    return activeSong.chords.map((origChord) => {
      const transposed = semitoneOffset === 0 ? origChord : transposeChord(origChord, semitoneOffset);
      if (isEasyPlayEnabled) {
        const easy = toEasyPlay(transposed);
        return {
          original: origChord,
          transposed,
          display: easy.easyChord,
          isSimplified: easy.isSimplified,
          easyQuality: easy.easyQuality
        };
      }
      return {
        original: origChord,
        transposed,
        display: transposed,
        isSimplified: false,
        easyQuality: ''
      };
    });
  }, [activeSong.chords, semitoneOffset, isEasyPlayEnabled]);

  // Dados do acorde inspecionado no modal
  const inspectedChordDetails = useMemo(() => {
    if (!inspectedChord) return null;
    const chord = ChordEngine.getChord(inspectedChord);
    const shapes = ChordEngine.getShapes(inspectedChord, 'electric-guitar');
    return { chord, shapes };
  }, [inspectedChord]);

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
            Progressões clássicas de estudo, transposição harmônica em tempo real, Easy Play inteligente e análise musical determinística.
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
              onClick={() => handleSelectSong(song.id)}
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
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] border border-[#E8D3D6]">
                {activeSong.genre} • {activeSong.difficulty}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F8F7F4] text-[#25252A] border border-[#D9D9D9]">
                Tom Original: {activeSong.key}
              </span>
              {semitoneOffset !== 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                  Transposto: {currentKey} ({semitoneOffset > 0 ? `+${semitoneOffset}` : semitoneOffset} semitons)
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-[#25252A] mt-2">{activeSong.title}</h2>
          </div>

          <button
            onClick={() => onOpenMetronomeAtBpm(activeSong.bpm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] text-xs font-bold shadow-xs transition"
          >
            <Flame className="w-4 h-4 fill-current text-white" />
            <span>Treinar com Metrônomo ({activeSong.bpm} BPM)</span>
          </button>
        </div>

        {/* Music Intelligence & Musical Engine Bar */}
        <div className="bg-[#F8F7F4] p-4 sm:p-5 rounded-2xl border border-[#D9D9D9] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#7B1E2B] flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
              Motor de Inteligência Musical Virtuo 2.0:
            </span>

            {/* Smart Key Recommendation */}
            {musicAnalysis.smartKeySuggestion && (
              <span className="text-[11px] font-semibold text-[#25252A] flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-[#D9D9D9]">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span>
                  {musicAnalysis.smartKeySuggestion.isOriginalBest
                    ? `Tom de ${activeSong.key} é o mais confortável na guitarra`
                    : `Sugestão Smart Key: Toque no tom de ${musicAnalysis.smartKeySuggestion.recommendedKey} (menos pestanas)`}
                </span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
              <span className="text-[10px] uppercase font-bold text-[#666672] block">Cadência Harmônica</span>
              <span className="font-bold text-[#25252A]">{musicAnalysis.cadence}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
              <span className="text-[10px] uppercase font-bold text-[#666672] block">Relativo Menor / Maior</span>
              <span className="font-bold text-[#25252A]">
                {activeSong.key} ↔ {musicAnalysis.relativeKey}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
              <span className="text-[10px] uppercase font-bold text-[#666672] block">Classificação Determinística</span>
              <span className="font-bold text-[#7B1E2B]">{musicAnalysis.difficulty} (Score: {musicAnalysis.score})</span>
            </div>
          </div>
        </div>

        {/* Transposer & Easy Play Controls Toolbar */}
        <div className="bg-[#FAF9F6] border border-[#D9D9D9] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          {/* Transposer Stepper */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#25252A] uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#7B1E2B]" />
              Transpor Tom:
            </span>

            <div className="flex items-center gap-1 bg-white border border-[#D9D9D9] rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setSemitoneOffset((prev) => prev - 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#25252A] hover:bg-[#F5E8EA] hover:text-[#7B1E2B] font-bold text-xs transition"
                title="Descer 1 semitom"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 text-center min-w-[70px]">
                <span className="text-xs font-black text-[#25252A] block">{currentKey}</span>
                <span className="text-[9px] text-[#666672] font-mono-code font-bold">
                  {semitoneOffset === 0 ? 'Original' : `${semitoneOffset > 0 ? '+' : ''}${semitoneOffset} st`}
                </span>
              </div>

              <button
                onClick={() => setSemitoneOffset((prev) => prev + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#25252A] hover:bg-[#F5E8EA] hover:text-[#7B1E2B] font-bold text-xs transition"
                title="Subir 1 semitom"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {semitoneOffset !== 0 && (
              <button
                onClick={() => setSemitoneOffset(0)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#666672] hover:text-[#7B1E2B] hover:bg-white border border-transparent hover:border-[#D9D9D9] transition flex items-center gap-1"
                title="Restaurar tom original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar</span>
              </button>
            )}
          </div>

          {/* Easy Play Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEasyPlayEnabled((prev) => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition border ${
                isEasyPlayEnabled
                  ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs'
                  : 'bg-white text-[#25252A] border-[#D9D9D9] hover:bg-[#F5E8EA]'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isEasyPlayEnabled ? 'text-amber-300 fill-current' : 'text-[#7B1E2B]'}`} />
              <span>Modo Easy Play 2.0 (Iniciante)</span>
              {isEasyPlayEnabled && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Transposition Educational Warning Banner */}
        {semitoneOffset !== 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Aviso Pedagógico de Transposição Harmônica:</p>
              <p className="leading-relaxed text-amber-800">
                A tablatura abaixo reflete a digitação original na afinação em tom de <strong>{activeSong.key}</strong>.
                Ao transpor para <strong>{currentKey} ({semitoneOffset > 0 ? `+${semitoneOffset}` : semitoneOffset} semitons)</strong>,
                execute os acordes transpostos na barra acima.
              </p>
            </div>
          </div>
        )}

        {/* Chords Used Strip with Click-to-Inspect */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
              Acordes da Peça {isEasyPlayEnabled ? '(Modo Easy Play Ativado)' : ''}:
            </label>
            <span className="text-[11px] text-[#666672] font-medium">
              Clique em qualquer acorde para abrir o diagrama da guitarra
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {processedChords.map((ch, idx) => (
              <button
                key={`${ch.display}-${idx}`}
                onClick={() => setInspectedChord(ch.display)}
                className={`px-4 py-2 rounded-xl border text-sm font-bold font-mono-code flex items-center gap-2 transition cursor-pointer shadow-xs ${
                  inspectedChord === ch.display
                    ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
                    : ch.isSimplified
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-[#F8F7F4] text-[#25252A] border-[#D9D9D9] hover:bg-white hover:border-[#7B1E2B]'
                }`}
                title="Clique para ver o diagrama deste acorde no braço"
              >
                <span>{ch.display}</span>
                {ch.isSimplified && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-800 uppercase font-sans font-extrabold">
                    Easy ({ch.transposed})
                  </span>
                )}
              </button>
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#7B1E2B] uppercase tracking-wider block">
                Tablatura & Guia Rítmico de Execução:
              </label>
              {semitoneOffset !== 0 && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Tablatura em Tom Original ({activeSong.key})
                </span>
              )}
            </div>
            <pre className="bg-[#1A1A20] p-5 rounded-2xl text-xs sm:text-sm font-mono-code text-[#F8F7F4] overflow-x-auto border border-[#33333E] leading-relaxed shadow-inner">
              {activeSong.tablatureSnippet.trim()}
            </pre>
          </div>
        )}

        {/* 7-Day Study Plan Generated by Virtuo Intelligence */}
        {musicAnalysis.studyPlan && (
          <div className="border border-[#D9D9D9] rounded-2xl p-5 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#25252A] text-sm flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-[#7B1E2B]" />
                  Cronograma de Domínio da Música (7 Dias):
                </h3>
                <p className="text-xs text-[#666672] mt-0.5">
                  Plano determinístico adaptado à dificuldade e andamento de {activeSong.bpm} BPM.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {musicAnalysis.studyPlan.days.slice(0, 4).map((d) => (
                <div key={d.day} className="bg-[#F8F7F4] p-3.5 rounded-xl border border-[#D9D9D9] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#7B1E2B]">{d.name} • {d.title}</span>
                    <span className="text-[#666672]">{d.practiceMinutes} min</span>
                  </div>
                  <p className="text-[#25252A] font-medium">{d.focus}</p>
                  <p className="text-[11px] text-[#666672] italic">Dica: {d.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Chord Inspector Modal from ChordEngine */}
      {inspectedChordDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#D9D9D9] pb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-[#7B1E2B]" />
                <h3 className="text-lg font-black text-[#25252A]">
                  Acorde: {inspectedChord}
                </h3>
              </div>
              <button
                onClick={() => setInspectedChord(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#666672] hover:bg-[#F5E8EA] hover:text-[#7B1E2B] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inspectedChordDetails.chord && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-[#F8F7F4] p-3 rounded-2xl border border-[#D9D9D9]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#666672] block">Fundamental</span>
                    <span className="font-bold text-[#25252A]">{inspectedChordDetails.chord.root}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#666672] block">Qualidade</span>
                    <span className="font-bold text-[#25252A]">{inspectedChordDetails.chord.qualityName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase font-bold text-[#666672] block">Notas Teóricas</span>
                    <span className="font-bold text-[#7B1E2B] font-mono-code">
                      {inspectedChordDetails.chord.notes.join(' - ')}
                    </span>
                  </div>
                </div>

                {/* Finger shapes on guitar */}
                {inspectedChordDetails.shapes.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#7B1E2B] tracking-wider block">
                      Digitação Recomendada na Guitarra (Giannini 101 HSS):
                    </span>
                    {inspectedChordDetails.shapes.slice(0, 2).map((shape, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-xl bg-white border border-[#D9D9D9] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-[#25252A]">
                            Forma {shape.cagedForm ? `CAGED (${shape.cagedForm})` : `${shape.position}`}
                          </span>
                          <span className="text-[#666672]">
                            Casa Base: {shape.baseFret}ª casa
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1 font-mono-code text-[11px] bg-[#F8F7F4] p-2 rounded-lg border border-[#E5E5E5]">
                          {shape.frets.map((fret, fIdx) => (
                            <div key={fIdx} className="text-center">
                              <span className="text-[9px] text-[#666672] block">{6 - fIdx}ª</span>
                              <span
                                className={`font-bold block ${
                                  fret === -1 ? 'text-rose-600' : fret === 0 ? 'text-emerald-600' : 'text-[#25252A]'
                                }`}
                              >
                                {fret === -1 ? 'X' : fret === 0 ? 'O' : fret}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#666672] italic text-center py-2">
                    Forma dinâmica gerada teoricamente pelo ChordEngine.
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => setInspectedChord(null)}
              className="w-full py-2.5 rounded-xl bg-[#7B1E2B] text-white hover:bg-[#B52A3A] font-bold text-xs transition"
            >
              Fechar Detalhes do Acorde
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

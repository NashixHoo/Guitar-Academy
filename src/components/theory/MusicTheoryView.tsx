import React, { useState, useEffect } from 'react';
import { CIRCLE_OF_FIFTHS, INTERVALS, CHROMATIC_NOTES, CIPHER_TO_PT, STANDARD_TUNING, getFretNote } from '../../data/musicTheory';
import { NoteCipher } from '../../types';
import { audioEngine } from '../../audio/audioEngine';
import { Compass, Layers, Sparkles, Music, Play, Square, ArrowRight, Wand2, BookOpen } from 'lucide-react';
import { ChordNameButton } from '../chords/ChordNameButton';
import { findChordTokensInText } from '../../services/chordLookupService';
import { IllustrativeCard } from '../common/IllustrativeCard';
import { SCREEN_ARTWORKS } from '../../data/visualGallery';

interface MusicTheoryViewProps {
  initialKey?: string;
}

export const MusicTheoryView: React.FC<MusicTheoryViewProps> = ({ initialKey }) => {
  const [activeTab, setActiveTab] = useState<'circle' | 'progressions' | 'styles'>('circle');
  const [selectedKey, setSelectedKey] = useState<string>(initialKey || 'C');

  // Progression Lab State
  const [progressionArchetype, setProgressionArchetype] = useState<string>('pop-classic');
  const [progressionBpm, setProgressionBpm] = useState<number>(75);
  const [isPlayingProgression, setIsPlayingProgression] = useState<boolean>(false);
  const [currentProgressionStep, setCurrentProgressionStep] = useState<number>(0);

  // Selected Style in Styles Lab
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(0);

  useEffect(() => {
    if (initialKey) {
      setSelectedKey(initialKey);
    }
  }, [initialKey]);

  const circleKeyInfo = CIRCLE_OF_FIFTHS.find((k) => k.major === selectedKey) || CIRCLE_OF_FIFTHS[0];

  // Definições de Progressões e Voice Leading
  const PROGRESSION_PRESETS: Record<string, {
    name: string;
    description: string;
    romanNumerals: string[];
    chordsInKey: (key: string) => { symbol: string; enriched: string; bassMovement: string; commonNotes: string }[];
  }> = {
    'pop-classic': {
      name: 'I - V - vi - IV (A Máquina Pop Acústica)',
      description: 'A progressão mais gravada de todos os tempos. No violão acústico, mantém notas pedais nas cordas 1 e 2.',
      romanNumerals: ['I', 'V', 'vi', 'IV'],
      chordsInKey: (key: string) => {
        if (key === 'G') {
          return [
            { symbol: 'G', enriched: 'Gadd9', bassMovement: 'Sol (6ª corda)', commonNotes: 'Notas Ré e Sol fixas nas cordas 1 e 2' },
            { symbol: 'D', enriched: 'Dsus4 ou D/F#', bassMovement: 'Fá# (6ª corda)', commonNotes: 'Nota Ré fixa' },
            { symbol: 'Em', enriched: 'Em7', bassMovement: 'Mi (6ª corda)', commonNotes: 'Notas Ré e Sol fixas' },
            { symbol: 'C', enriched: 'Cadd9', bassMovement: 'Dó (5ª corda)', commonNotes: 'Mesma âncora de 2 dedos!' },
          ];
        }
        return [
          { symbol: 'C', enriched: 'Cadd9', bassMovement: 'Dó (5ª corda)', commonNotes: 'Nota Dó comum com Am e F' },
          { symbol: 'G', enriched: 'G/B', bassMovement: 'Si (5ª corda)', commonNotes: 'Passagem suave para Lá' },
          { symbol: 'Am', enriched: 'Am7', bassMovement: 'Lá (5ª corda)', commonNotes: 'Nota Dó comum com F' },
          { symbol: 'F', enriched: 'Fmaj7', bassMovement: 'Fá (4ª corda)', commonNotes: 'Corda Mi aguda solta' },
        ];
      }
    },
    'ii-v-i': {
      name: 'ii - V - I (Cadência Mestra Jazz & Bossa)',
      description: 'Movimento de baixo por saltos de quarta ascendente. A cadência de maior gravidade harmônica.',
      romanNumerals: ['ii7', 'V7', 'Imaj7'],
      chordsInKey: (key: string) => {
        if (key === 'G') {
          return [
            { symbol: 'Am7', enriched: 'Am9', bassMovement: 'Lá (5ª corda)', commonNotes: 'Nota Dó e Sol comuns' },
            { symbol: 'D7', enriched: 'D7(9)', bassMovement: 'Ré (4ª corda)', commonNotes: 'Trítono F#-C resolve em G' },
            { symbol: 'Gmaj7', enriched: 'G6/9', bassMovement: 'Sol (6ª corda)', commonNotes: 'Resolução serena no repouso' },
          ];
        }
        return [
          { symbol: 'Dm7', enriched: 'Dm9', bassMovement: 'Ré (4ª corda)', commonNotes: 'Notas Lá e Dó compartilhadas' },
          { symbol: 'G7', enriched: 'G13 ou G7(b9)', bassMovement: 'Sol (6ª corda)', commonNotes: 'Trítono B-F resolve em C' },
          { symbol: 'Cmaj7', enriched: 'C6/9', bassMovement: 'Dó (5ª corda)', commonNotes: 'Resolução lírica final' },
        ];
      }
    },
    'descending-bass': {
      name: 'I - I/7M - vi - I/5 - IV (Baixo Linear Descendente)',
      description: 'O baixo desce nota por nota pela escala, criando uma sensação cinematográfica profunda.',
      romanNumerals: ['I', 'I/7M', 'vi', 'I/5', 'IV'],
      chordsInKey: () => [
        { symbol: 'C', enriched: 'C', bassMovement: 'Dó (Corda 5 Casa 3)', commonNotes: 'Tríade de Dó' },
        { symbol: 'C/B', enriched: 'C/B', bassMovement: 'Si (Corda 5 Casa 2)', commonNotes: 'Meio-tom abaixo no baixo' },
        { symbol: 'Am', enriched: 'Am7', bassMovement: 'Lá (Corda 5 Solta)', commonNotes: 'Tom inteiro abaixo no baixo' },
        { symbol: 'C/G', enriched: 'Am/G', bassMovement: 'Sol (Corda 6 Casa 3)', commonNotes: 'Baixo na 6ª corda' },
        { symbol: 'F', enriched: 'Fmaj7', bassMovement: 'Fá (Corda 6 Casa 1)', commonNotes: 'Chegada na subdominante' },
      ]
    },
    'blues-12bar': {
      name: '12-Bar Blues Acústico (I7 - IV7 - V7)',
      description: 'O clássico ciclo de blues com dominantes em todas as funções.',
      romanNumerals: ['I7', 'IV7', 'V7'],
      chordsInKey: (key: string) => {
        if (key === 'E') {
          return [
            { symbol: 'E7', enriched: 'E7(#9) "Hendrix"', bassMovement: 'Mi (6ª corda solta)', commonNotes: 'Tônica do blues' },
            { symbol: 'A7', enriched: 'A7(13)', bassMovement: 'Lá (5ª corda solta)', commonNotes: 'Subdominante bluesy' },
            { symbol: 'B7', enriched: 'B7(9)', bassMovement: 'Si (5ª corda casa 2)', commonNotes: 'Dominante de turnaround' },
          ];
        }
        return [
          { symbol: 'A7', enriched: 'A7(9)', bassMovement: 'Lá (5ª corda solta)', commonNotes: 'Tônica' },
          { symbol: 'D7', enriched: 'D7(9)', bassMovement: 'Ré (4ª corda solta)', commonNotes: 'Subdominante' },
          { symbol: 'E7', enriched: 'E7(#9)', bassMovement: 'Mi (6ª corda solta)', commonNotes: 'Turnaround dominante' },
        ];
      }
    }
  };

  const currentProgression = PROGRESSION_PRESETS[progressionArchetype] || PROGRESSION_PRESETS['pop-classic'];
  const progressionChords = currentProgression.chordsInKey(selectedKey);

  // Playback da progressão em loop
  useEffect(() => {
    let interval: any = null;
    if (isPlayingProgression) {
      interval = setInterval(() => {
        setCurrentProgressionStep((prev) => {
          const nextStep = (prev + 1) % progressionChords.length;
          // Tocar notas sintetizadas do acorde correspondente
          const chordName = progressionChords[nextStep].symbol;
          const root = chordName.replace(/[^A-G#b]/g, '');
          const noteIndex = CHROMATIC_NOTES.indexOf(root as any);
          const baseFreq = 130.81 * Math.pow(2, (noteIndex >= 0 ? noteIndex : 0) / 12);
          audioEngine.playGuitarNote(baseFreq, 1.6, 0.7);
          return nextStep;
        });
      }, (60 / progressionBpm) * 2000);
    } else {
      setCurrentProgressionStep(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingProgression, progressionBpm, progressionChords]);

  // BANCO DOS 9 ESTILOS ACÚSTICOS COMPLETOS
  const ACOUSTIC_STYLES = [
    {
      id: 'pop-acustico',
      name: '1. Pop Acústico',
      tag: 'Âncoras & Síncopas',
      description: 'O som consagrado do pop internacional contemporâneo. Uso de notas pedais fixas nas cordas agudas (Si e Mi na casa 3) permitindo trocas ágeis e ressonância contínua da caixa harmônica.',
      chords: ['G', 'Cadd9', 'Em7', 'Dsus4'],
      picking: 'Batida com pêndulo constante e acentuação enérgica nos tempos 2 e 4.',
      tab: `e|--3---3-3---3-3-3--|--3---3-3---3-3-3--|
B|--3---3-3---3-3-3--|--3---3-3---3-3-3--|
G|--0---0-0---0-0-0--|--0---0-0---2-2-2--|
D|--0---0-0---2-2-2--|--2---2-2---0-0-0--|
A|--2---2-2---3-3-3--|--2---2-2----------|
E|--3---3-3----------|--0---0-0----------|
    G         Cadd9     Em7       Dsus4`,
      exercise: 'Mantenha os dedos 3 e 4 imóveis na casa 3 durante 2 minutos ininterruptos com metrônomo a 80 BPM.',
      demoFreqs: [196, 261.63, 164.81, 146.83]
    },
    {
      id: 'mpb-samba',
      name: '2. MPB / Samba-Choro',
      tag: 'Baixos Caminhantes & Síncopes',
      description: 'A sofisticação do violão brasileiro. Acordes com inversões, baixos caminhantes com aproximações cromáticas e síncopes refinadas sem palheta.',
      chords: ['C', 'C#dim7', 'Dm7', 'G7(13)', 'C6'],
      picking: 'Polegar marcando a linha melódica do contrabaixo e indicador/médio/anelar puxando os acordes em contratempos.',
      tab: `e|----------------------------------|
B|----1-------5-------6-------5-----|
G|----0-------3-------5-------4-----|
D|----2-------5-------7-------3-----|
A|--3---2---4---5---5---------------|
E|----------------------7---3-------|
    C   (B) C#dim Dm7 (F#)  G7(13)`,
      exercise: 'Execute a linha de baixo cromática C -> B -> C# -> D de forma limpa sem oscilar o tempo.',
      demoFreqs: [130.81, 138.59, 146.83, 196]
    },
    {
      id: 'bossa-nova',
      name: '3. Bossa Nova',
      tag: 'Balanço João Gilberto',
      description: 'A revolução do violão mundial de 1958. Acordes sofisticados com 7M, 9 e 6/9, tocados com toques simultâneos suaves de nylon simulando o tamborim e o surdo.',
      chords: ['C6/9', 'Dm7(9)', 'G7(13)', 'Cmaj7'],
      picking: 'Célula rítmica de 2 compassos: polegar no tempo e dedos puxando síncopes em bloco.',
      tab: `e|-----------------------|-----------------------|
B|----3-------3----------|----3-------3----------|
G|----2-------2----------|----2-------2----------|
D|----2-------2----------|----2-------2----------|
A|--3--------------------|----------3------------|
E|-----------------------|-----------------------|
    (Balanço sincopado da Bossa Nova em C6/9)`,
      exercise: 'Treine a levada em dois acordes por 3 minutos até internalizar o balanço suave sem olhar para as mãos.',
      demoFreqs: [130.81, 146.83, 196, 130.81]
    },
    {
      id: 'balada-fingerstyle',
      name: '4. Balada / Fingerstyle',
      tag: 'Lirismo P-I-M-A',
      description: 'O som emotivo das cordas dedilhadas. O polegar sustenta o baixo enquanto indicador, médio e anelar tecem arpejos e melodias cantadas.',
      chords: ['C', 'G/B', 'Am7', 'Fmaj7'],
      picking: 'Padrão ondulatório P-I-M-A-M-I em compasso 4/4 ou 6/8.',
      tab: `e|------0-----------0-----------0-----------0---|
B|----1---1-------1---1-------1---1-------1---1-|
G|--0-------0---0-------0---2-------2---2-------|
D|--------------------------------------3-------|
A|--3---------2-----------0---------------------|
E|----------------------------------------------|
    C         G/B         Am7         Fmaj7`,
      exercise: 'Toque cada corda com o mesmo volume dinâmico e deixe as cordas soltas vibrarem com sustain pleno.',
      demoFreqs: [130.81, 123.47, 110, 87.31]
    },
    {
      id: 'folk-country',
      name: '5. Folk / Country (Travis Picking)',
      tag: 'Baixo Alternado Independente',
      description: 'A técnica de Merle Travis e Chet Atkins. O polegar funciona como um metrônomo alternando entre dois bordões enquanto os dedos respondem em contratempo.',
      chords: ['C', 'G', 'D', 'Em'],
      picking: 'Polegar alternando continuamente entre a corda 5 e 4 em semínimas estritas.',
      tab: `e|-----------------------------------|
B|-------1---------------1-----------|
G|---------------0---------------0---|
D|-------2---------------2-----------|
A|---3-----------------------3-------|
E|---------------3-------------------|
    (Travis picking tradicional em Dó)`,
      exercise: 'Isole o polegar primeiro tocando 1 minuto apenas o baixo alternado antes de inserir os dedos.',
      demoFreqs: [130.81, 98, 146.83, 82.41]
    },
    {
      id: 'blues-acustico',
      name: '6. Blues Acústico',
      tag: 'Shuffle & Turnarounds',
      description: 'A raiz da música popular moderna. Ritmo shuffle swung, dominantes com 7ª, bends de meio-tom e frases de blues em cordas de aço e nylon.',
      chords: ['E7', 'A7', 'B7'],
      picking: 'Swing shuffle com polegar marcando o baixo e indicador puxando as cordas agudas.',
      tab: `e|----------------------------------|
B|----------------------------------|
G|----------------------------------|
D|---2---2---4---2---2---2---4---2--|
A|---2---2---2---2---2---2---2---2--|
E|---0---0---0---0---0---0---0---0--|
    (Shuffle básico de blues em Mi)`,
      exercise: 'Acentue o segundo tempo do shuffle com um leve estalo (slap) para dar pressão rítmica.',
      demoFreqs: [82.41, 110, 123.47]
    },
    {
      id: 'rock-acustico',
      name: '7. Rock Acústico',
      tag: 'Palheta Enérgica & Ressonância',
      description: 'O som acústico encorpado de Nirvana Unplugged, Foo Fighters e Led Zeppelin. Ataque firme de palheta, afinações encorpadas e cordas soltas vibrando alto.',
      chords: ['E', 'G', 'D', 'A'],
      picking: 'Batidas rítmicas para baixo com acentuação na caixa e dinâmicas do sussurro ao fortíssimo.',
      tab: `e|--0---0---3---3---2---2---0---0--|
B|--0---0---0---0---3---3---2---2--|
G|--1---1---0---0---2---2---2---2--|
D|--2---2---0---0---0---0---2---2--|
A|--2---2---2---2-----------0---0--|
E|--0---0---3---3------------------|
    E       G       D       A`,
      exercise: 'Pratique a transição de pianíssimo para fortíssimo sem acelerar o andamento da mão.',
      demoFreqs: [82.41, 98, 146.83, 110]
    },
    {
      id: 'louvor-worship',
      name: '8. Louvor / Worship Acústico',
      tag: 'Pad Acústico & Extensões',
      description: 'Textura celestial com acordes abertos estendidos (add9, sus4, maj7) servindo como uma cama harmônica ampla e atmosférica.',
      chords: ['Badd9/E', 'C#m7', 'Aadd9', 'E'],
      picking: 'Dedilhado lento e espalhado com dinâmica suave e arpejos que respiram.',
      tab: `e|------0-----------0-----------0-----------0---|
B|----0---0-------0---0-------0---0-------0---0-|
G|--1-------1---6-------6---4-------4---1-------|
D|--2-----------7-----------6-----------2-------|
A|--2-----------7-----------6-----------2-------|
E|--0-----------0-----------0-----------0-------|
    (Arpejo com baixo pedal Mi solto)`,
      exercise: 'Deixe cada acorde soar por 2 compassos inteiros prestando atenção no decaimento natural da madeira.',
      demoFreqs: [82.41, 138.59, 110, 82.41]
    },
    {
      id: 'fingerstyle-solo',
      name: '9. Violão Instrumental Contemporâneo',
      tag: 'Polifonia & Percussão',
      description: 'O ápice moderno do instrumento. Arranjos em Chord Melody com percussão no tampo (thumb slap), harmônicos de sino e múltiplas vozes independentes.',
      chords: ['Cmaj7', 'Bm7b5', 'E7', 'Am9'],
      picking: 'Combinação simultânea de baixo, harmonia, melodia nas cordas agudas e estalo percussivo no tempo 2.',
      tab: `e|---<12>-------0-------0-------0---|
B|---<12>-----0---0---1---1---1---1-|
G|---<12>---0-------0-------2-------|
D|--------------------------2-------|
A|----------3-------2-------0-------|
E|----------------------------------|
    (Harmônicos + Baixo Descendente)`,
      exercise: 'Destaque a melodia aguda sobre o baixo com 20% a mais de volume no dedo anelar.',
      demoFreqs: [329.63, 130.81, 123.47, 110]
    }
  ];

  const currentStyle = ACOUSTIC_STYLES[selectedStyleIndex] || ACOUSTIC_STYLES[0];

  const playStyleDemoAudio = () => {
    currentStyle.demoFreqs.forEach((freq, idx) => {
      setTimeout(() => {
        audioEngine.playGuitarNote(freq, 2.0, 0.7);
      }, idx * 400);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#7B1E2B]" />
            <h1 className="text-2xl font-black text-[#25252A]">Teoria Musical, Progressões & Estilos Acústicos</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#666672] mt-1 font-medium">
            Entenda a ciência da harmonia, monte progressões com condução de vozes (voice leading) e explore 9 estilos acústicos completos.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F8F7F4] p-1.5 rounded-2xl border border-[#D9D9D9]">
          <button
            onClick={() => setActiveTab('circle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'circle'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Círculo de Quintas</span>
          </button>
          <button
            onClick={() => setActiveTab('progressions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'progressions'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Laboratório de Progressões</span>
          </button>
          <button
            onClick={() => setActiveTab('styles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'styles'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
            <span>Estilos Musicais (9)</span>
          </button>
        </div>
      </div>

      <IllustrativeCard artwork={SCREEN_ARTWORKS.theory} variant="strip" />

      {/* TAB 1: Círculo de Quintas & Intervalos */}
      {activeTab === 'circle' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Circle Wheel Buttons */}
            <div className="lg:col-span-2 bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9]">
                <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#7B1E2B]" />
                  Círculo de Quintas Interativo
                </h2>
                <span className="text-xs text-[#666672] font-semibold">Selecione uma tonalidade</span>
              </div>

              <p className="text-xs text-[#666672] leading-relaxed">
                O mapa mestre da harmonia. Andar no sentido horário avança por intervalos de <strong>5ª Justa</strong> adicionando sustenidos (#). Andar no sentido anti-horário avança por <strong>4ª Justa</strong> adicionando bemóis (b).
              </p>

              {/* Interactive Wheel Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                {CIRCLE_OF_FIFTHS.map((item) => {
                  const isSelected = selectedKey === item.major;
                  return (
                    <button
                      key={item.major}
                      onClick={() => setSelectedKey(item.major)}
                      className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs scale-105 font-bold'
                          : 'bg-[#F8F7F4] text-[#25252A] border-[#D9D9D9] hover:bg-[#F5E8EA]'
                      }`}
                    >
                      <span className="text-lg font-black">{item.major}</span>
                      <span className={`text-[11px] font-semibold ${isSelected ? 'text-[#F5E8EA]' : 'text-[#B52A3A]'}`}>
                        {item.minor}
                      </span>
                      <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#666672]'}`}>
                        {item.sharpsFlats.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Key Details Card */}
              <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-[#D9D9D9] mt-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-[#7B1E2B] font-bold uppercase tracking-wider block">
                      Tonalidade Selecionada:
                    </span>
                    <h3 className="text-xl font-black text-[#25252A]">
                      {circleKeyInfo.keyPt} ({circleKeyInfo.major} / {circleKeyInfo.minor})
                    </h3>
                  </div>
                  <span className="text-xs font-mono-code bg-[#F5E8EA] border border-[#E8D3D6] px-3 py-1.5 rounded-xl text-[#7B1E2B] font-bold">
                    Armadura: {circleKeyInfo.sharpsFlats}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                    <span className="text-[#666672] text-[10px] uppercase font-bold block">Tônica Maior (I):</span>
                    <span className="text-[#25252A] font-extrabold text-base">{circleKeyInfo.major}</span>
                    <span className="text-[10px] text-[#666672] block">Repouso e estabilidade</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                    <span className="text-[#666672] text-[10px] uppercase font-bold block">Relativa Menor (vi):</span>
                    <span className="text-[#25252A] font-extrabold text-base">{circleKeyInfo.minor}</span>
                    <span className="text-[10px] text-[#666672] block">Mesma armadura de clave</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#D9D9D9]">
                    <span className="text-[#666672] text-[10px] uppercase font-bold block">Acidentes:</span>
                    <span className="text-[#7B1E2B] font-extrabold text-sm">{circleKeyInfo.sharpsFlats}</span>
                    <span className="text-[10px] text-[#666672] block">Sustenidos ou bemóis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Triad and Tetrad Rules */}
            <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#25252A] flex items-center gap-2 pb-3 border-b border-[#D9D9D9]">
                  <Layers className="w-5 h-5 text-[#B52A3A]" />
                  Estrutura das Tríades e Tétrades
                </h3>
                <div className="space-y-3 pt-3 text-xs">
                  <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9]">
                    <div className="flex justify-between items-center font-bold text-[#25252A]">
                      <span className="text-[#7B1E2B]">Tríade Maior</span>
                      <span className="font-mono-code text-[#B52A3A]">1 - 3 - 5</span>
                    </div>
                    <p className="text-[#666672] text-[11px] mt-1 font-medium">
                      Fundamental + 3ª Maior (4 semitons) + 5ª Justa (7 semitons).
                    </p>
                  </div>

                  <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9]">
                    <div className="flex justify-between items-center font-bold text-[#25252A]">
                      <span className="text-[#7B1E2B]">Tríade Menor</span>
                      <span className="font-mono-code text-[#B52A3A]">1 - b3 - 5</span>
                    </div>
                    <p className="text-[#666672] text-[11px] mt-1 font-medium">
                      Fundamental + 3ª Menor (3 semitons) + 5ª Justa (7 semitons).
                    </p>
                  </div>

                  <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9]">
                    <div className="flex justify-between items-center font-bold text-[#25252A]">
                      <span className="text-[#7B1E2B]">Tétrade c/ 7ª Maior (7M)</span>
                      <span className="font-mono-code text-[#B52A3A]">1 - 3 - 5 - 7</span>
                    </div>
                    <p className="text-[#666672] text-[11px] mt-1 font-medium">
                      Tríade maior + 7ª Maior (11 semitons). Som lírico de Bossa Nova.
                    </p>
                  </div>

                  <div className="bg-[#F8F7F4] p-3 rounded-xl border border-[#D9D9D9]">
                    <div className="flex justify-between items-center font-bold text-[#25252A]">
                      <span className="text-[#7B1E2B]">Tétrade Dominante (7)</span>
                      <span className="font-mono-code text-[#B52A3A]">1 - 3 - 5 - b7</span>
                    </div>
                    <p className="text-[#666672] text-[11px] mt-1 font-medium">
                      Tríade maior + 7ª Menor (10 semitons). Contém trítono que resolve na tônica.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Intervals */}
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#25252A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B52A3A]" />
              Tabela Completa de Intervalos Musicais e Distância no Braço
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#25252A]">
                <thead className="bg-[#F8F7F4] text-[#666672] uppercase font-bold text-[10px] tracking-wider border-b border-[#D9D9D9]">
                  <tr>
                    <th className="p-3">Intervalo</th>
                    <th className="p-3">Abreviatura</th>
                    <th className="p-3">Semitons</th>
                    <th className="p-3">Distância no Violão</th>
                    <th className="p-3">Exemplo</th>
                    <th className="p-3">Sensação Sonora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D9D9] font-medium">
                  {INTERVALS.map((inter) => (
                    <tr key={inter.name} className="hover:bg-[#F8F7F4] transition">
                      <td className="p-3 font-bold text-[#25252A]">{inter.name}</td>
                      <td className="p-3 font-mono-code text-[#7B1E2B] font-bold">{inter.shortName}</td>
                      <td className="p-3 font-mono-code text-[#B52A3A] font-bold">{inter.semitones} st</td>
                      <td className="p-3 text-[#666672]">{inter.fretDistance}</td>
                      <td className="p-3 text-[#25252A] font-semibold">{inter.example}</td>
                      <td className="p-3 text-[#666672]">{inter.soundDescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Laboratório de Progressões & Voice Leading */}
      {activeTab === 'progressions' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D9D9D9]">
              <div>
                <h2 className="text-xl font-black text-[#25252A] flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-[#7B1E2B]" />
                  Laboratório de Progressões & Voice Leading
                </h2>
                <p className="text-xs text-[#666672] mt-1">
                  Monte cadências com condução de vozes, analise notas comuns e experimente substituições acústicas ricas.
                </p>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#F8F7F4] border border-[#D9D9D9] px-3 py-1.5 rounded-xl text-xs font-bold">
                  <span className="text-[#666672]">Andamento:</span>
                  <input
                    type="range"
                    min="50"
                    max="120"
                    value={progressionBpm}
                    onChange={(e) => setProgressionBpm(parseInt(e.target.value, 10))}
                    className="w-20 accent-[#7B1E2B]"
                  />
                  <span className="text-[#7B1E2B] font-mono-code w-12">{progressionBpm} BPM</span>
                </div>

                <button
                  onClick={() => setIsPlayingProgression(!isPlayingProgression)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
                    isPlayingProgression
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-[#7B1E2B] text-white hover:bg-[#B52A3A]'
                  }`}
                >
                  {isPlayingProgression ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Reproduzir
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Presets and Key Selection Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-extrabold text-[#7B1E2B] uppercase tracking-wider block mb-2">
                  Fórmula Harmônica / Arquétipo:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PROGRESSION_PRESETS).map(([key, p]) => (
                    <button
                      key={key}
                      onClick={() => setProgressionArchetype(key)}
                      className={`p-3 rounded-xl border text-left text-xs transition ${
                        progressionArchetype === key
                          ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] font-bold shadow-xs'
                          : 'bg-[#F8F7F4] text-[#25252A] border-[#D9D9D9] hover:bg-[#F5E8EA]'
                      }`}
                    >
                      <span className="block font-black">{p.name.split(' ')[0]}</span>
                      <span className="text-[10px] opacity-80 line-clamp-1">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#7B1E2B] uppercase tracking-wider block mb-2">
                  Tonalidade Base:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['C', 'G', 'D', 'A', 'E', 'F'].map((k) => (
                    <button
                      key={`prog-key-${k}`}
                      onClick={() => setSelectedKey(k)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                        selectedKey === k
                          ? 'bg-[#7B1E2B] text-white shadow-xs'
                          : 'bg-[#F8F7F4] text-[#25252A] border border-[#D9D9D9] hover:bg-[#F5E8EA]'
                      }`}
                    >
                      {k} ({CIPHER_TO_PT[k as NoteCipher] || k})
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#666672] mt-3">
                  {currentProgression.description}
                </p>
              </div>
            </div>

            {/* Visual Progression Chain & Voice Leading Cards */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold text-[#25252A] uppercase tracking-wider block">
                Cadeia de Acordes & Condução Linear:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {progressionChords.map((chord, idx) => {
                  const isActiveStep = isPlayingProgression && currentProgressionStep === idx;
                  return (
                    <div
                      key={`prog-step-${idx}`}
                      className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                        isActiveStep
                          ? 'bg-[#F5E8EA] border-[#7B1E2B] shadow-md scale-102 ring-2 ring-[#7B1E2B]'
                          : 'bg-[#F8F7F4] border-[#D9D9D9]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono-code font-bold text-[#666672]">
                            Grau {currentProgression.romanNumerals[idx] || `Passo ${idx + 1}`}
                          </span>
                          {isActiveStep && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#7B1E2B] animate-pulse" />
                          )}
                        </div>
                        <div className="mt-1.5">
                          <ChordNameButton
                            chord={chord.symbol}
                            variant="chip"
                            className="text-2xl sm:text-3xl px-3 py-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-[#D9D9D9] text-xs">
                        <div>
                          <span className="text-[10px] text-[#7B1E2B] uppercase font-bold block">Enriquecimento Acústico:</span>
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            {findChordTokensInText(chord.enriched).map((seg, sIdx) =>
                              seg.isChord ? (
                                <ChordNameButton
                                  key={`enr-${idx}-${sIdx}`}
                                  chord={seg.text}
                                  variant="inline"
                                />
                              ) : (
                                <span key={`enr-${idx}-${sIdx}`} className="text-[11px] font-medium text-[#666672]">
                                  {seg.text}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#666672] uppercase font-bold block">Movimento do Baixo:</span>
                          <span className="font-medium text-[#25252A]">{chord.bassMovement}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#666672] uppercase font-bold block">Voice Leading:</span>
                          <span className="text-[11px] text-[#666672] italic">{chord.commonNotes}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dica Pedagógica do Laboratório */}
            <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#D9D9D9] text-xs text-[#666672] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#7B1E2B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#25252A] block font-bold">Princípio de Condução de Vozes no Violão:</strong>
                Ao tocar progressões acústicas, mantenha dedos fixos em notas comuns entre acordes adjacentes. Isso cria sustentação sonora ininterrupta e reduz a fadiga física em até 70%.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Laboratório de Sonoridades & Estilos Musicais (9 Estilos) */}
      {activeTab === 'styles' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#25252A] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7B1E2B]" />
                Laboratório de Sonoridades & 9 Estilos Musicais Acústicos
              </h2>
              <p className="text-xs text-[#666672] mt-1">
                Explore os 9 grandes universos rítmicos e harmônicos do violão acústico com tablaturas, batidas e exercícios no instrumento físico.
              </p>
            </div>

            {/* Selector de 9 Estilos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {ACOUSTIC_STYLES.map((st, i) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStyleIndex(i)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    selectedStyleIndex === i
                      ? 'bg-[#7B1E2B] text-white border-[#7B1E2B] shadow-xs font-bold scale-102'
                      : 'bg-[#F8F7F4] text-[#25252A] border-[#D9D9D9] hover:bg-[#F5E8EA]'
                  }`}
                >
                  <span className="text-xs font-black truncate">{st.name}</span>
                  <span className={`text-[10px] mt-1 ${selectedStyleIndex === i ? 'text-white/80' : 'text-[#7B1E2B]'}`}>
                    {st.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Painel de Detalhes do Estilo Selecionado */}
            <div className="bg-[#F8F7F4] border border-[#D9D9D9] rounded-2xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D9D9D9]">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold">
                    {currentStyle.tag}
                  </span>
                  <h3 className="text-2xl font-black text-[#25252A] mt-2">{currentStyle.name}</h3>
                  <p className="text-xs text-[#666672] mt-1 max-w-2xl leading-relaxed">
                    {currentStyle.description}
                  </p>
                </div>

                <button
                  onClick={playStyleDemoAudio}
                  className="px-4 py-2.5 bg-[#7B1E2B] hover:bg-[#B52A3A] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 self-start md:self-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  Ouvir Demonstração Sonora
                </button>
              </div>

              {/* Acordes Típicos e Padrão de Mão Direita */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-[#D9D9D9] space-y-3">
                  <h4 className="text-xs font-extrabold text-[#7B1E2B] uppercase tracking-wider">
                    Acordes Típicos do Estilo:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStyle.chords.map((c) => (
                      <ChordNameButton
                        key={`st-chord-${c}`}
                        chord={c}
                        variant="chip"
                      />
                    ))}
                  </div>

                  <h4 className="text-xs font-extrabold text-[#7B1E2B] uppercase tracking-wider pt-2">
                    Padrão de Mão Direita (Levada / Dedilhado):
                  </h4>
                  <p className="text-xs text-[#25252A] font-semibold leading-relaxed">
                    {currentStyle.picking}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#D9D9D9] space-y-2">
                  <h4 className="text-xs font-extrabold text-[#7B1E2B] uppercase tracking-wider">
                    Tablatura de Referência:
                  </h4>
                  <pre className="p-3 bg-[#1A1A20] text-emerald-400 font-mono-code text-[11px] rounded-xl overflow-x-auto">
                    {currentStyle.tab}
                  </pre>
                </div>
              </div>

              {/* Exercício Físico Recomendado */}
              <div className="bg-white p-5 rounded-xl border border-[#D9D9D9] space-y-2">
                <h4 className="text-xs font-extrabold text-[#7B1E2B] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#B52A3A]" />
                  Exercício Físico Recomendado no Violão:
                </h4>
                <p className="text-xs text-[#25252A] font-medium leading-relaxed">
                  {currentStyle.exercise}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

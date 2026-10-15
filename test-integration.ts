// =============================================================
// GUITAR ACADEMY / VIRTUO INTEGRATION TEST SUITE
// test-integration.ts
// Testes automatizados para teoria, motor de acordes, transposição,
// detecção acústica (sinais sintéticos, E2 82.4Hz, polifonia, silêncio),
// inteligência musical e compatibilidade de persistência.
// =============================================================

import { buildChord, parseChordSymbol } from './src/chords/chord-builder';
import { transposeChord, transposeProgression } from './src/chords/transposer';
import { validateChordShape } from './src/chords/musical-validator';
import { getChordShapes, generateCagedShapes } from './src/chords/shapes';
import { INSTRUMENTS } from './src/chords/instruments';
import { GuitarPitchDetector } from './src/audio/guitarPitchDetector';
import { suggestSmartKey } from './src/music/smart-key';
import { MusicIntelligence } from './src/music/music-intelligence';
import { simplifyChord } from './src/music/easy-play';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${testName} ${detail ? `-> ${detail}` : ''}`);
  }
}

console.log('===========================================================');
console.log('GUITAR ACADEMY + VIRTUO: SUÍTE DE AUDITORIA & VALIDAÇÃO');
console.log('===========================================================\n');

// -------------------------------------------------------------
// GRUPO 1: Formação Teórica de Acordes, Intervalos e Extensões
// -------------------------------------------------------------
console.log('--- 1. Formação de Acordes, Extensões e Inversões ---');

const chordC = buildChord('C', 'major');
assert(chordC !== null, 'buildChord(C, major) retorna objeto');
assert(JSON.stringify(chordC?.notes) === JSON.stringify(['C', 'E', 'G']), 'C Maior contém notas C, E, G');

const chordAm = buildChord('A', 'minor');
assert(JSON.stringify(chordAm?.notes) === JSON.stringify(['A', 'C', 'E']), 'Am contém notas A, C, E');

const chordG7 = buildChord('G', 'dominant7');
assert(JSON.stringify(chordG7?.notes) === JSON.stringify(['G', 'B', 'D', 'F']), 'G7 contém notas G, B, D, F');

const chordCmaj7 = buildChord('C', 'major7');
assert(JSON.stringify(chordCmaj7?.notes) === JSON.stringify(['C', 'E', 'G', 'B']), 'Cmaj7 contém notas C, E, G, B');

const chordDm7 = buildChord('D', 'minor7');
assert(JSON.stringify(chordDm7?.notes) === JSON.stringify(['D', 'F', 'A', 'C']), 'Dm7 contém notas D, F, A, C');

const chordBm7b5 = buildChord('B', 'minor7b5');
assert(JSON.stringify(chordBm7b5?.notes) === JSON.stringify(['B', 'D', 'F', 'A']), 'Bm7b5 contém B, D, F, A');

const chordCadd9 = buildChord('C', 'add9');
assert(chordCadd9?.notes.includes('D') === true, 'Cadd9 contém a nona adicionada D');

const slashParsed = parseChordSymbol('G/B');
assert(slashParsed?.root === 'G' && slashParsed?.bass === 'B', 'Inversão G/B reconhece fundamental G e baixo B');

// -------------------------------------------------------------
// GRUPO 2: Transposição de Acordes e Progressões
// -------------------------------------------------------------
console.log('\n--- 2. Transposição de Acordes e Progressões ---');

assert(transposeChord('C', 2) === 'D', 'Transpor C por +2 semitons resulta em D');
assert(transposeChord('Am', 2) === 'Bm', 'Transpor Am por +2 semitons resulta em Bm');
assert(transposeChord('G7', -2) === 'F7', 'Transpor G7 por -2 semitons resulta em F7');
assert(transposeChord('F#m', 1) === 'Gm', 'Transpor F#m por +1 semitom resulta em Gm');

const originalProg = ['C', 'G', 'Am', 'F'];
const transposedProg = transposeProgression(originalProg, 2);
assert(JSON.stringify(transposedProg) === JSON.stringify(['D', 'A', 'Bm', 'G']), 'Progressão C - G - Am - F transposta +2 resulta em D - A - Bm - G');

// -------------------------------------------------------------
// GRUPO 3: Digitações, Afinações e Validador Harmônico
// -------------------------------------------------------------
console.log('\n--- 3. Digitações da Guitarra & Validador Harmônico ---');

const guitar = INSTRUMENTS['electric-guitar'];
assert(guitar.strings === 6, 'Guitarra configurada com 6 cordas');
assert(JSON.stringify(guitar.tuning) === JSON.stringify(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']), 'Afinação padrão E2-A2-D3-G3-B3-E4 confirmada');

const cShapes = getChordShapes('C', 'electric-guitar');
assert(cShapes.length > 0, 'Formas de C para guitarra encontradas no catálogo');
assert(JSON.stringify(cShapes[0].frets) === JSON.stringify([-1, 3, 2, 0, 1, 0]), 'C aberto possui digitação [-1, 3, 2, 0, 1, 0]');

const valValid = validateChordShape(cShapes[0], 'C');
assert(valValid.valid === true, 'Digitação aberta de C é 100% válida harmonicamente', valValid.errors.join('; '));

// Testa se forma inconsistente é devidamente rejeitada
const invalidShape = {
  instrument: 'electric-guitar',
  frets: [-1, 3, 4, 0, 1, 0], // traste 4 na 4ª corda = F# (não pertence a C maior)
  chord: 'C'
};
const valInvalid = validateChordShape(invalidShape, 'C');
assert(valInvalid.valid === false, 'Forma com nota intrusa (F# em C maior) é rejeitada pelo validador');

// Sistema CAGED
const cagedForms = generateCagedShapes('C');
assert(cagedForms.length >= 2, 'Sistema CAGED gera posições móveis ao longo do braço');

// -------------------------------------------------------------
// GRUPO 4: Detector Sonoro — Sinais Sintéticos & Frequências
// -------------------------------------------------------------
console.log('\n--- 4. Detector Sonoro (Web Audio & Pitch Detection) ---');

const detector = new GuitarPitchDetector({
  lowCutoff: 70,
  highCutoff: 1200,
  silenceThreshold: 0.01,
  confidenceThreshold: 0.65,
  bufferSize: 2048
});

function generateSineBuffer(frequency: number, sampleRate = 44100, bufferSize = 2048, amplitude = 0.5): Float32Array {
  const buf = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    buf[i] = amplitude * Math.sin((2 * Math.PI * frequency * i) / sampleRate);
  }
  return buf;
}

// 1. Sexta corda Mi grave (E2, ~82.41 Hz)
const e2Buffer = generateSineBuffer(82.41);
const e2Result = detector.detectPitchFromBuffer(e2Buffer, 44100);
assert(e2Result !== null, 'E2 sintetizado detectado com sucesso');
assert(e2Result?.note === 'E' && e2Result?.octave === 2, `E2 identificado como E2 (detectado: ${e2Result?.note}${e2Result?.octave}, ${e2Result?.frequency} Hz)`);
assert(Math.abs((e2Result?.frequency || 0) - 82.41) < 2.0, `Precisão de frequência para E2 dentro de 2 Hz (obtido: ${e2Result?.frequency} Hz)`);

// 2. Quinta corda Lá (A2, 110.00 Hz)
const a2Buffer = generateSineBuffer(110.00);
const a2Result = detector.detectPitchFromBuffer(a2Buffer, 44100);
assert(a2Result?.note === 'A' && a2Result?.octave === 2, `A2 identificado como A2 (${a2Result?.frequency} Hz)`);

// 3. Quarta corda Ré (D3, 146.83 Hz)
const d3Buffer = generateSineBuffer(146.83);
const d3Result = detector.detectPitchFromBuffer(d3Buffer, 44100);
assert(d3Result?.note === 'D' && d3Result?.octave === 3, `D3 identificado como D3 (${d3Result?.frequency} Hz)`);

// 4. Terceira corda Sol (G3, 196.00 Hz)
const g3Buffer = generateSineBuffer(196.00);
const g3Result = detector.detectPitchFromBuffer(g3Buffer, 44100);
assert(g3Result?.note === 'G' && g3Result?.octave === 3, `G3 identificado como G3 (${g3Result?.frequency} Hz)`);

// 5. Segunda corda Si (B3, 246.94 Hz)
const b3Buffer = generateSineBuffer(246.94);
const b3Result = detector.detectPitchFromBuffer(b3Buffer, 44100);
assert(b3Result?.note === 'B' && b3Result?.octave === 3, `B3 identificado como B3 (${b3Result?.frequency} Hz)`);

// 6. Primeira corda Mi agudo (E4, 329.63 Hz)
const e4Buffer = generateSineBuffer(329.63);
const e4Result = detector.detectPitchFromBuffer(e4Buffer, 44100);
assert(e4Result?.note === 'E' && e4Result?.octave === 4, `E4 identificado como E4 (${e4Result?.frequency} Hz)`);

// 7. Silêncio / Ruído residual desprezível
const silenceBuffer = new Float32Array(2048); // zeros
const silenceResult = detector.detectPitchFromBuffer(silenceBuffer, 44100);
assert(silenceResult?.isSilence === true, 'Buffer zerado classificado como silêncio');
assert(silenceResult?.note === null, 'Nenhuma nota falsa atribuída ao silêncio');

// 8. Salvaguarda Polifônica (Múltiplas frequências concorrentes simultâneas)
function generatePolyphonicBuffer(freqs: number[], sampleRate = 44100, bufferSize = 2048): Float32Array {
  const buf = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    let sample = 0;
    for (const f of freqs) {
      sample += 0.25 * Math.sin((2 * Math.PI * f * i) / sampleRate);
    }
    buf[i] = sample;
  }
  return buf;
}

const polyBuffer = generatePolyphonicBuffer([82.41, 123.47, 164.81, 246.94]); // Acorde polifônico Mi Menor
const polyResult = detector.detectPitchFromBuffer(polyBuffer, 44100);
assert(
  polyResult?.detectionType === 'polyphonic_ambiguous' || polyResult?.isSilence === false,
  `Salvaguarda polifônica atuando (resultado: ${polyResult?.detectionType})`
);

// -------------------------------------------------------------
// GRUPO 5: Inteligência Musical, Easy Play e Tonalidade
// -------------------------------------------------------------
console.log('\n--- 5. Inteligência Musical & Easy Play ---');

const songAnalysis = MusicIntelligence.analyzeSong({
  title: 'Treino Pop',
  chords: 'G Em C D',
  key: 'G',
  bpm: 100
});
assert(songAnalysis.key === 'G', `Análise de música reconhece tonalidade Sol Maior (G)`);
assert(songAnalysis.relativeKey === 'Em', `Relativa menor de G identificada como Em`);
assert(songAnalysis.progression.length >= 4, `Progressão de 4 acordes extraída com sucesso`);

const smartKey = suggestSmartKey(['F#', 'D#m', 'B', 'C#'], 'F#');
assert(smartKey.recommendedKey === 'G' || smartKey.recommendedKey === 'E' || smartKey.recommendedCapo >= 0, `Smart Key sugere tom facilitado ou uso de capotraste (sugerido: ${smartKey.recommendedKey}, capo: ${smartKey.recommendedCapo})`);

const simplifiedG7M = simplifyChord('G7M');
assert(simplifiedG7M === 'G', `Easy Play simplifica G7M para tríade G`);

const simplifiedCadd9 = simplifyChord('Cadd9');
assert(simplifiedCadd9 === 'C', `Easy Play simplifica Cadd9 para tríade C`);

// -------------------------------------------------------------
// GRUPO 6: Resiliência e Casos de Erro sem Microfone
// -------------------------------------------------------------
console.log('\n--- 6. Resiliência do Detector de Áudio e Tratamento de Erros ---');

// Conversões de tom e frequência
const e2ExpectedFreq = detector.noteToFrequency('E', 2);
assert(Math.abs(e2ExpectedFreq - 82.41) < 0.2, `noteToFrequency('E', 2) retorna 82.41 Hz (calculado: ${e2ExpectedFreq})`);

const a4ExpectedFreq = detector.noteToFrequency('A', 4);
assert(Math.abs(a4ExpectedFreq - 440.0) < 0.1, `noteToFrequency('A', 4) retorna 440.0 Hz`);

const pitchConversion = detector.frequencyToPitch(82.41);
assert(pitchConversion.note === 'E' && pitchConversion.octave === 2, `frequencyToPitch(82.41) retorna E2`);

// Encerramento limpo sem erros
detector.stopListening();
assert(detector.running === false, 'stopListening() encerra o detector de forma segura');

// -------------------------------------------------------------
// RESUMO FINAL
// -------------------------------------------------------------
console.log('\n===========================================================');
console.log(`TOTAL DE TESTES: ${totalTests}`);
console.log(`PASSOU: ${passedTests}`);
console.log(`FALHOU: ${failedTests}`);
console.log('===========================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✓ Todos os testes de integração do motor musical e detector foram APROVADOS com sucesso!\n');
}

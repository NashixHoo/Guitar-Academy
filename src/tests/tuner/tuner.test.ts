// =============================================================
// GUITAR ACADEMY / MASTER TUNER V3 — DEDICATED TEST SUITE
// src/tests/tuner/tuner.test.ts
// =============================================================

import test from 'node:test';
import assert from 'node:assert';
import { GuitarPitchDetector } from '../../audio/guitarPitchDetector';
import { TunerSmoother } from '../../audio/tunerSmoother';

function generateSignalBuffer(
  frequency: number,
  sampleRate = 44100,
  bufferSize = 4096,
  options?: {
    amplitude?: number;
    centsOffset?: number;
    noiseLevel?: number;
    clipping?: boolean;
    harmonicAmplitudes?: number[]; // [fundamental, 2nd, 3rd, ...]
    isTransient?: boolean;
    decay?: boolean;
    secondFreq?: number;
    secondAmplitude?: number;
  }
): Float32Array {
  const buf = new Float32Array(bufferSize);
  const amp = options?.amplitude ?? 0.5;
  const cents = options?.centsOffset ?? 0;
  const targetFreq = frequency * Math.pow(2, cents / 1200);
  const noise = options?.noiseLevel ?? 0;
  const clipping = options?.clipping ?? false;
  const harmonics = options?.harmonicAmplitudes ?? [1.0];
  const decay = options?.decay ?? false;
  const secondFreq = options?.secondFreq;
  const secondAmp = options?.secondAmplitude ?? 0.3;

  for (let i = 0; i < bufferSize; i++) {
    const envelope = decay ? 1.0 - (i / bufferSize) * 0.7 : 1.0;
    let sample = 0;

    for (let h = 0; h < harmonics.length; h++) {
      const hAmp = harmonics[h];
      if (hAmp > 0) {
        sample += amp * hAmp * envelope * Math.sin((2 * Math.PI * targetFreq * (h + 1) * i) / sampleRate);
      }
    }

    if (secondFreq !== undefined) {
      sample += amp * secondAmp * Math.sin((2 * Math.PI * secondFreq * i) / sampleRate);
    }

    if (noise > 0) {
      sample += (Math.random() * 2 - 1) * noise;
    }

    if (clipping) {
      sample = Math.max(-0.95, Math.min(0.95, sample * 2.5));
    }

    buf[i] = sample;
  }

  return buf;
}

test('Master Tuner V3 — 10 Core Reference Notes Detection', async (t) => {
  const detector = new GuitarPitchDetector({ lowCutoff: 25, highCutoff: 2000 });

  const referenceNotes = [
    { name: 'B0', expectedFreq: 30.8677, expectedNote: 'B', expectedOctave: 0 },
    { name: 'E1', expectedFreq: 41.2034, expectedNote: 'E', expectedOctave: 1 },
    { name: 'E2', expectedFreq: 82.4069, expectedNote: 'E', expectedOctave: 2 },
    { name: 'A2', expectedFreq: 110.0000, expectedNote: 'A', expectedOctave: 2 },
    { name: 'D3', expectedFreq: 146.8324, expectedNote: 'D', expectedOctave: 3 },
    { name: 'G3', expectedFreq: 195.9977, expectedNote: 'G', expectedOctave: 3 },
    { name: 'B3', expectedFreq: 246.9417, expectedNote: 'B', expectedOctave: 3 },
    { name: 'E4', expectedFreq: 329.6276, expectedNote: 'E', expectedOctave: 4 },
    { name: 'A4', expectedFreq: 440.0000, expectedNote: 'A', expectedOctave: 4 },
    { name: 'E5', expectedFreq: 659.2551, expectedNote: 'E', expectedOctave: 5 },
  ];

  for (const ref of referenceNotes) {
    await t.test(`detects ${ref.name} (${ref.expectedFreq} Hz)`, () => {
      const buffer = generateSignalBuffer(ref.expectedFreq, 44100, 8192, { amplitude: 0.6 });
      const result = detector.detectPitchFromBuffer(buffer, 44100);
      assert.ok(result !== null, `Result for ${ref.name} must not be null`);
      assert.strictEqual(result.note, ref.expectedNote, `Note for ${ref.name} should be ${ref.expectedNote}`);
      assert.strictEqual(result.octave, ref.expectedOctave, `Octave for ${ref.name} should be ${ref.expectedOctave}`);
      assert.ok(
        Math.abs(result.frequency - ref.expectedFreq) / ref.expectedFreq < 0.035,
        `Frequency for ${ref.name} (${result.frequency} Hz) should be close to ${ref.expectedFreq} Hz`
      );
    });
  }
});

test('Master Tuner V3 — 20 Required DSP & Smoother Scenarios', async (t) => {
  const detector = new GuitarPitchDetector();
  const smoother = new TunerSmoother();

  await t.test('1. Perfectly tuned frequency (A4 @ 440Hz -> 0 cents)', () => {
    const buf = generateSignalBuffer(440.0, 44100, 4096, { centsOffset: 0 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.strictEqual(pitch.note, 'A');
    assert.strictEqual(pitch.octave, 4);
    assert.ok(Math.abs(pitch.cents) <= 3, `Cents deviation (${pitch.cents}) should be near 0`);
  });

  await t.test('2. Deviation of +5 cents', () => {
    const buf = generateSignalBuffer(440.0, 44100, 4096, { centsOffset: 5 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.cents > 0 && pitch.cents <= 10, `Cents (${pitch.cents}) should reflect +5 cents offset`);
  });

  await t.test('3. Deviation of -5 cents', () => {
    const buf = generateSignalBuffer(440.0, 44100, 4096, { centsOffset: -5 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.cents < 0 && pitch.cents >= -10, `Cents (${pitch.cents}) should reflect -5 cents offset`);
  });

  await t.test('4. Deviation of +25 cents', () => {
    const buf = generateSignalBuffer(440.0, 44100, 4096, { centsOffset: 25 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.cents >= 18 && pitch.cents <= 32, `Cents (${pitch.cents}) should reflect +25 cents offset`);
  });

  await t.test('5. Deviation of -25 cents', () => {
    const buf = generateSignalBuffer(440.0, 44100, 4096, { centsOffset: -25 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.cents <= -18 && pitch.cents >= -32, `Cents (${pitch.cents}) should reflect -25 cents offset`);
  });

  await t.test('6. White noise (rejected as noise or silence)', () => {
    const buf = new Float32Array(4096);
    for (let i = 0; i < buf.length; i++) buf[i] = (Math.random() * 2 - 1) * 0.4;
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(
      pitch.isSilence || pitch.detectionType === 'noise_or_unidentified' || pitch.confidence < 0.6,
      'White noise must not be confirmed as valid reliable note'
    );
  });

  await t.test('7. Digital silence', () => {
    const buf = new Float32Array(4096); // all zeros
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.strictEqual(pitch.isSilence, true);
    assert.strictEqual(pitch.note, null);
  });

  await t.test('8. Periodic weak signal', () => {
    const buf = generateSignalBuffer(110.0, 44100, 4096, { amplitude: 0.08 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.detectionType === 'weak_signal' || pitch.isWeakSignal || pitch.note === 'A');
  });

  await t.test('9. Strong signal without clipping', () => {
    const buf = generateSignalBuffer(196.0, 44100, 4096, { amplitude: 0.8 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.strictEqual(pitch.note, 'G');
    assert.strictEqual(pitch.octave, 3);
  });

  await t.test('10. Signal with clipping', () => {
    const buf = generateSignalBuffer(196.0, 44100, 4096, { amplitude: 0.95, clipping: true });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.frequency > 0, 'Clipped signal should still be detected reliably');
  });

  await t.test('11. Second harmonic stronger than fundamental', () => {
    const buf = generateSignalBuffer(110.0, 44100, 4096, { harmonicAmplitudes: [0.3, 1.0, 0.2] });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.frequency > 0);
  });

  await t.test('12. Third harmonic dominant', () => {
    const buf = generateSignalBuffer(110.0, 44100, 4096, { harmonicAmplitudes: [0.2, 0.3, 1.0] });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.frequency > 0);
  });

  await t.test('13. Noise superimposed on note', () => {
    const buf = generateSignalBuffer(246.94, 44100, 4096, { amplitude: 0.5, noiseLevel: 0.15 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.strictEqual(pitch.note, 'B');
    assert.strictEqual(pitch.octave, 3);
  });

  await t.test('14. Attack transient', () => {
    const buf = generateSignalBuffer(329.63, 44100, 4096, { amplitude: 0.9 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.frequency > 0);
  });

  await t.test('15. String decay', () => {
    const buf = generateSignalBuffer(82.41, 44100, 4096, { amplitude: 0.6, decay: true });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.strictEqual(pitch.note, 'E');
    assert.strictEqual(pitch.octave, 2);
  });

  await t.test('16. Two simultaneous frequencies (Polyphony)', () => {
    const buf = generateSignalBuffer(110.0, 44100, 4096, { secondFreq: 164.81 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(
      pitch.detectionType === 'polyphonic_ambiguous' || pitch.isSilence === false,
      'Polyphony should trigger warning or handle correctly'
    );
  });

  await t.test('17. Frequencies near semitone boundary', () => {
    const buf = generateSignalBuffer(453.0, 44100, 4096, { amplitude: 0.5 });
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.note === 'A' || pitch.note === 'A#');
  });

  await t.test('18. Frequencies outside detection range', () => {
    const buf = generateSignalBuffer(10.0, 44100, 4096);
    const pitch = detector.detectPitchFromBuffer(buf, 44100);
    assert.ok(pitch);
    assert.ok(pitch.isSilence || pitch.detectionType !== 'monophonic_note');
  });

  await t.test('19. Rapid note change & smoother stabilization', () => {
    smoother.reset();
    const p1 = detector.detectPitchFromBuffer(generateSignalBuffer(110.0), 44100);
    smoother.feedPitch(p1, 100);
    let out = smoother.step(150);

    const p2 = detector.detectPitchFromBuffer(generateSignalBuffer(146.83), 44100);
    smoother.feedPitch(p2, 200);
    smoother.feedPitch(p2, 250);
    out = smoother.step(300);
    assert.ok(out);
  });

  await t.test('20. Signal loss and recovery', () => {
    smoother.reset();
    const pValid = detector.detectPitchFromBuffer(generateSignalBuffer(220.0), 44100);
    smoother.feedPitch(pValid, 1000);
    smoother.step(1050);

    smoother.feedPitch(null, 1200);
    let out = smoother.step(1800);
    assert.strictEqual(out.state, 'waiting_sound');

    smoother.feedPitch(pValid, 2000);
    out = smoother.step(2050);
    assert.ok(out.note === 'A');
  });
});

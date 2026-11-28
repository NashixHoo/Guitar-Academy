// =============================================================
// GUITAR ACADEMY / REGRESSION TEST SUITE (3 CORE ERRORS)
// src/tests/regression.test.ts
// =============================================================

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { fetchSystemRoleWithDiagnostics, parseSystemRoleDoc } from '../services/firebase';
import { calculateCourseProgress, getMandatoryLessonIdsForCourse } from '../academia/progress/unlockGate';

describe('Regression Suite — 3 Core Errors & Robustness', () => {
  // --- ERRO 1: Consulta de cargos em system_roles/{uid} ---
  test('1.1: Missing system_roles/{uid} resolves fail-closed to student without error', async () => {
    const mockProviderMissing = async () => null;
    const res = await fetchSystemRoleWithDiagnostics('test-student-uid', mockProviderMissing);
    assert.strictEqual(res.role, 'student');
    assert.strictEqual(res.status, 'missing_document');
  });

  test('1.2: Valid admin document in system_roles/{uid} resolves correctly to admin', async () => {
    const mockProviderAdmin = async () => ({ role: 'admin' });
    const res = await fetchSystemRoleWithDiagnostics('test-admin-uid', mockProviderAdmin);
    assert.strictEqual(res.role, 'admin');
    assert.strictEqual(res.status, 'resolved');
  });

  test('1.3: Invalid role value in system_roles/{uid} resolves fail-closed to student', async () => {
    const mockProviderInvalid = async () => ({ role: 'superhero' });
    const res = await fetchSystemRoleWithDiagnostics('test-invalid-uid', mockProviderInvalid);
    assert.strictEqual(res.role, 'student');
    assert.strictEqual(res.status, 'invalid_role_value');
  });

  test('1.4: Permission denied or Firestore error preserves fail-closed student role', async () => {
    const mockProviderError = async () => {
      const err = new Error('Missing or insufficient permissions.');
      (err as any).code = 'permission-denied';
      throw err;
    };
    const res = await fetchSystemRoleWithDiagnostics('test-error-uid', mockProviderError);
    assert.strictEqual(res.role, 'student');
    assert.strictEqual(res.status, 'permission_denied');
  });

  // --- ERRO 2: Course Access Grants & Security ---
  test('2.1: Parse role helper handles unknown and malformed inputs securely', () => {
    assert.strictEqual(parseSystemRoleDoc(null), 'student');
    assert.strictEqual(parseSystemRoleDoc(undefined), 'student');
    assert.strictEqual(parseSystemRoleDoc({ role: 'admin' }), 'admin');
    assert.strictEqual(parseSystemRoleDoc({ role: 'teacher' }), 'teacher');
    assert.strictEqual(parseSystemRoleDoc({ role: 'student' }), 'student');
    assert.strictEqual(parseSystemRoleDoc({ role: 'hacker' }), 'student');
  });

  // --- ERRO 3: CurriculumView Progress Normalization ---
  test('3.1: calculateCourseProgress handles undefined progress safely', () => {
    const prog = calculateCourseProgress('violao', undefined);
    assert.strictEqual(prog.completedMandatoryActivities, 0);
    assert.strictEqual(prog.progressPercentage, 0);
    assert.strictEqual(prog.totalMandatoryActivities, 60);
  });

  test('3.2: calculateCourseProgress handles null progress safely', () => {
    const prog = calculateCourseProgress('guitarra', null);
    assert.strictEqual(prog.completedMandatoryActivities, 0);
    assert.strictEqual(prog.progressPercentage, 0);
    assert.strictEqual(prog.totalMandatoryActivities, 60);
  });

  test('3.3: calculateCourseProgress handles initial empty progress with 0% correctly', () => {
    const prog = calculateCourseProgress('baixo', {
      currentLessonId: '',
      completedLessons: [],
      practiceLogs: [],
      exerciseRepetitions: {},
      totalStudyTimeSeconds: 0,
      todayStudyTimeSeconds: 0
    });
    assert.strictEqual(prog.completedMandatoryActivities, 0);
    assert.strictEqual(prog.progressPercentage, 0);
  });

  test('3.4: calculateCourseProgress computes valid progress correctly with completed lessons', () => {
    const lessonIds = getMandatoryLessonIdsForCourse('violao');
    const completed = lessonIds.slice(0, 3);
    const prog = calculateCourseProgress('violao', {
      currentLessonId: '',
      completedLessons: completed,
      practiceLogs: [],
      exerciseRepetitions: {},
      totalStudyTimeSeconds: 120,
      todayStudyTimeSeconds: 120
    });
    assert.strictEqual(prog.completedMandatoryActivities, 3);
    assert.strictEqual(prog.progressPercentage, 5.0);
  });
});

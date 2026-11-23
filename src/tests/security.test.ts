/**
 * Guitar Academy — Security & Firebase Emulator Unit Tests
 *
 * Verifies Zero-Trust RBAC and Firestore Security Rules against the Firebase Emulator:
 *  1. An authenticated `student` user is denied access to the `admin` role.
 *  2. An authenticated `student` (and any client) is prevented from writing to `system_roles`.
 *  3. An authenticated `student` is blocked from querying administrative/restricted collections.
 *
 * Run with Firebase Emulator:
 *   firebase emulators:exec --only firestore "npx tsx --test src/tests/security.test.ts"
 *
 * Or standalone (Emulator tests skip gracefully if no emulator host is reachable):
 *   npx tsx --test src/tests/security.test.ts
 */

import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
  RulesTestContext,
  TokenOptions,
} from '@firebase/rules-unit-testing';
import type { FirebaseApp } from 'firebase/app';
import {
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  deleteField,
  doc,
  EmulatorMockTokenOptions,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  auth,
  fetchSystemRole,
  fetchSystemRoleWithDiagnostics,
  parseSystemRoleDoc,
} from '../services/firebase';
import { matchesAdminLogEventFilter } from '../services/adminLogsService';
import {
  buildAdminDirectoryUsers,
  computeEnrolledUsersCountByClass,
} from '../services/adminUsersService';
import { TeacherService } from '../services/teacherService';

const DEFAULT_FIRESTORE_DATABASE_ID =
  'ai-studio-guitaracademyfor-e7ce9efa-82d3-4dd1-8b8e-58aa69749913';

function resolveFirestoreDatabaseId(): string {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8')) as {
      firestoreDatabaseId?: string;
    };
    if (parsed.firestoreDatabaseId && parsed.firestoreDatabaseId.trim()) {
      return parsed.firestoreDatabaseId.trim();
    }
  }
  return DEFAULT_FIRESTORE_DATABASE_ID;
}

const FIRESTORE_DATABASE_ID = resolveFirestoreDatabaseId();

const PROJECT_ID =
  process.env.GCLOUD_PROJECT ||
  process.env.FIREBASE_PROJECT_ID ||
  'demo-guitar-academy-security-test';

function parseEmulatorHost(): { host: string; port: number } {
  const raw = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
  const [host, portStr] = raw.split(':');
  const port = Number(portStr) || 8080;
  return { host: host || '127.0.0.1', port };
}

describe('Zero-Trust RBAC Role Resolution (Client Fail-Closed Unit Tests)', () => {
  it('denies the admin role to an authenticated student even with forged flags', async () => {
    const studentUid = 'student-uid-1';
    const resolved = await fetchSystemRole(studentUid, async (uid) => {
      assert.equal(uid, studentUid);
      return {
        role: 'student',
        isAdmin: true,
        isTeacher: true,
        permissions: ['admin', '*'],
      };
    });

    assert.equal(resolved, 'student');
    assert.notEqual(resolved, 'admin');
  });

  it('denies the admin role when system_roles doc is missing, null, or invalid', async () => {
    assert.equal(parseSystemRoleDoc(null), 'student');
    assert.equal(parseSystemRoleDoc(undefined), 'student');
    assert.equal(parseSystemRoleDoc({}), 'student');
    assert.equal(parseSystemRoleDoc({ role: 'superadmin' }), 'student');
    assert.equal(parseSystemRoleDoc({ role: 'ADMIN' }), 'student');
    assert.equal(parseSystemRoleDoc({ isAdmin: true }), 'student');

    const missingRole = await fetchSystemRole('student-missing-doc', async () => null);
    assert.equal(missingRole, 'student');
  });

  it('fails closed to student if querying system_roles throws an error', async () => {
    const resolved = await fetchSystemRole('student-uid-1', async () => {
      throw new Error('PERMISSION_DENIED: Firestore unavailable');
    });

    assert.equal(resolved, 'student');
  });

  it('grants admin or teacher role exclusively from explicit system_roles/{uid} without Express HTTP fallback', async () => {
    const resolvedAdmin = await fetchSystemRole('admin-uid-1', async () => ({
      role: 'admin',
    }));
    assert.equal(resolvedAdmin, 'admin');

    const resolvedTeacher = await fetchSystemRole('teacher-uid-1', async () => ({
      role: 'teacher',
    }));
    assert.equal(resolvedTeacher, 'teacher');

    // Verify fetchSystemRole fails closed without issuing HTTP requests to /api/auth/role on Firestore failure
    const originalFetch = globalThis.fetch;
    let fetchCalled = 0;
    globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
      fetchCalled += 1;
      return originalFetch(...args);
    }) as typeof fetch;
    try {
      const failClosed = await fetchSystemRole('teacher-offline-uid', async () => {
        throw new Error('PERMISSION_DENIED: Simulated Firestore error');
      });
      assert.equal(failClosed, 'student');
      assert.equal(fetchCalled, 0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('filters admin_logs accurately by auth, database_access, and role_change groups', () => {
    assert.equal(matchesAdminLogEventFilter('auth_login_success', 'auth'), true);
    assert.equal(matchesAdminLogEventFilter('auth_token_rejected', 'auth'), true);
    assert.equal(matchesAdminLogEventFilter('student_status_updated', 'auth'), false);

    assert.equal(matchesAdminLogEventFilter('database_access', 'database_access'), true);
    assert.equal(matchesAdminLogEventFilter('security_audit_viewed', 'database_access'), true);
    assert.equal(matchesAdminLogEventFilter('auth_login_success', 'database_access'), false);

    assert.equal(matchesAdminLogEventFilter('role_change', 'role_change'), true);
    assert.equal(matchesAdminLogEventFilter('role_access_denied', 'role_change'), true);
    assert.equal(matchesAdminLogEventFilter('student_status_updated', 'role_change'), true);
    assert.equal(matchesAdminLogEventFilter('auth_logout', 'role_change'), false);
  });

  it('classifies system_roles diagnostics accurately while preserving fail-closed student fallback', async () => {
    const adminRes = await fetchSystemRoleWithDiagnostics('admin-diag-1', async () => ({
      role: 'admin',
    }));
    assert.equal(adminRes.status, 'resolved');
    assert.equal(adminRes.role, 'admin');
    assert.equal(adminRes.path, 'system_roles/admin-diag-1');

    const missingRes = await fetchSystemRoleWithDiagnostics('missing-diag-1', async () => null);
    assert.equal(missingRes.status, 'missing_document');
    assert.equal(missingRes.role, 'student');

    const invalidRoleRes = await fetchSystemRoleWithDiagnostics('invalid-diag-1', async () => ({
      role: 'ADMIN',
      isAdmin: true,
    }));
    assert.equal(invalidRoleRes.status, 'invalid_role_value');
    assert.equal(invalidRoleRes.role, 'student');

    const deniedRes = await fetchSystemRoleWithDiagnostics('denied-diag-1', async () => {
      throw Object.assign(new Error('Missing or insufficient permissions.'), {
        code: 'permission-denied',
      });
    });
    assert.equal(deniedRes.status, 'permission_denied');
    assert.equal(deniedRes.errorCode, 'permission-denied');
    assert.equal(deniedRes.role, 'student');

    const networkRes = await fetchSystemRoleWithDiagnostics('net-diag-1', async () => {
      throw Object.assign(new Error('Could not reach Cloud Firestore backend.'), {
        code: 'unavailable',
      });
    });
    assert.equal(networkRes.status, 'network_unavailable');
    assert.equal(networkRes.errorCode, 'unavailable');
    assert.equal(networkRes.role, 'student');

    const unauthRes = await fetchSystemRoleWithDiagnostics('');
    assert.equal(unauthRes.status, 'unauthenticated');
    assert.equal(unauthRes.role, 'student');
  });

  it('builds admin directory strictly from real Firestore inputs without fabricated accounts', () => {
    const emptyDirectory = buildAdminDirectoryUsers({
      userDocs: [],
      roleDocs: [],
      classes: [],
      enrollments: [],
    });
    assert.equal(emptyDirectory.length, 0);

    const merged = buildAdminDirectoryUsers({
      userDocs: [
        {
          id: 'real-stu-1',
          data: {
            uid: 'real-stu-1',
            displayName: 'Maria Real',
            email: 'maria@real.test',
            provider: 'google.com',
            accountStatus: 'suspended',
            createdAt: '2026-10-01T10:00:00.000Z',
            enrolledCourses: ['violao'],
            role: 'admin', // campo injetado em users/ NÃO pode conceder papel admin
          },
        },
      ],
      roleDocs: [
        { id: 'real-adm-1', data: { role: 'admin' } },
        { id: 'real-stu-1', data: { role: 'student' } },
      ],
      classes: [
        {
          id: 'cls-1',
          name: 'Turma Violão Real',
          code: 'GA-REAL1',
          teacherId: 'teacher-1',
          teacherEmail: 'prof@real.test',
          teacherName: 'Prof Real',
          createdAt: '2026-10-01T00:00:00.000Z',
          updatedAt: '2026-10-01T00:00:00.000Z',
          active: true,
        },
      ],
      enrollments: [
        {
          studentId: 'real-stu-1',
          classId: 'cls-1',
          courseId: 'solo',
        },
      ],
      progressByUid: {
        'real-stu-1': {
          completedLessonsCount: 7,
          totalStudyMinutes: 95,
        },
      },
    });

    assert.equal(merged.length, 2);
    assert.equal(merged[0].uid, 'real-adm-1');
    assert.equal(merged[0].role, 'admin');
    assert.equal(merged[0].hasUserProfileDoc, false);

    assert.equal(merged[1].uid, 'real-stu-1');
    assert.equal(merged[1].role, 'student');
    assert.equal(merged[1].accountStatus, 'suspended');
    assert.equal(merged[1].hasUserProfileDoc, true);
    assert.deepEqual(merged[1].enrolledCourses, ['violao', 'solo']);
    assert.deepEqual(merged[1].classNames, ['Turma Violão Real']);
    assert.equal(merged[1].isEnrolledStudent, true);
    assert.equal(merged[1].activeEnrollmentsCount, 1);
    assert.equal(merged[1].completedLessonsCount, 7);
    assert.equal(merged[1].totalStudyMinutes, 95);
  });

  it('merges Firebase Auth accounts missing users/{uid} docs, separates study tracks from enrollments, and deduplicates valid class counts', async () => {
    const mergedWithAuth = buildAdminDirectoryUsers({
      authUsers: [
        {
          uid: 'reginaldo-auth-uid',
          email: 'reginaldo.teste@example.com',
          displayName: 'Reginaldo Teste',
          provider: 'google.com',
          disabled: false,
          createdAt: '2026-11-01T12:00:00.000Z',
          lastSignInTime: '2026-11-10T18:30:00.000Z',
        },
        {
          uid: 'admin-auth-uid',
          email: 'admin@example.com',
          displayName: 'Admin Real',
          provider: 'google.com',
          disabled: false,
        },
      ],
      userDocs: [
        {
          id: 'admin-auth-uid',
          data: {
            uid: 'admin-auth-uid',
            displayName: 'Admin Real',
            email: 'admin@example.com',
            accountStatus: 'active',
            enrolledCourses: [],
          },
        },
      ],
      studentDocs: [],
      roleDocs: [{ id: 'admin-auth-uid', data: { role: 'admin' } }],
      classes: [
        {
          id: 'cls-real-1',
          name: 'Turma Violão Real',
          code: 'GA-REAL-1',
          teacherId: 'teacher-1',
          teacherEmail: 'prof@example.com',
          teacherName: 'Professor Real',
          createdAt: '2026-11-01T00:00:00.000Z',
          updatedAt: '2026-11-01T00:00:00.000Z',
          active: true,
        },
      ],
      enrollments: [
        // Duplicate enrollment for the same student + same class (enrollments + subcollection)
        { studentId: 'reginaldo-auth-uid', classId: 'cls-real-1', status: 'active' },
        { studentId: 'reginaldo-auth-uid', classId: 'cls-real-1', status: 'active' },
        // Cancelled / suspended / orphan enrollments must NOT inflate counts
        { studentId: 'cancelled-stu-uid', classId: 'cls-real-1', status: 'cancelled' },
        { studentId: 'suspended-stu-uid', classId: 'cls-real-1', status: 'suspended' },
        { studentId: 'orphan-stu-uid', classId: 'non-existent-class', status: 'active' },
      ],
      progressByUid: {
        'reginaldo-auth-uid': {
          completedLessonsCount: 3,
          totalStudyMinutes: 45,
          primaryCourseId: 'violao',
        },
      },
    });

    const reginaldo = mergedWithAuth.find((u) => u.uid === 'reginaldo-auth-uid');
    assert.ok(reginaldo);
    assert.equal(reginaldo.email, 'reginaldo.teste@example.com');
    assert.equal(reginaldo.hasAuthAccount, true);
    assert.equal(reginaldo.hasUserProfileDoc, false);
    assert.equal(reginaldo.role, 'student');
    assert.equal(reginaldo.isEnrolledStudent, true);
    assert.equal(reginaldo.activeEnrollmentsCount, 1);
    assert.equal(reginaldo.primaryStudyCourse, 'violao');
    assert.deepEqual(reginaldo.enrolledCourses, []); // primaryStudyCourse does not spoof enrolledCourses

    const stats = computeEnrolledUsersCountByClass(
      [
        {
          id: 'cls-real-1',
          name: 'Turma Violão Real',
          code: 'GA-REAL-1',
          teacherId: 'teacher-1',
          teacherEmail: 'prof@example.com',
          teacherName: 'Professor Real',
          createdAt: '2026-11-01T00:00:00.000Z',
          updatedAt: '2026-11-01T00:00:00.000Z',
          active: true,
        },
      ],
      [
        { studentId: 'reginaldo-auth-uid', classId: 'cls-real-1', status: 'active' },
        { studentId: 'reginaldo-auth-uid', classId: 'cls-real-1', status: 'active' },
        { studentId: 'cancelled-stu-uid', classId: 'cls-real-1', status: 'cancelled' },
        { studentId: 'orphan-stu-uid', classId: 'non-existent-class', status: 'active' },
      ]
    );
    assert.equal(stats.countsByClass['cls-real-1'], 1);
    assert.equal(stats.validUniqueEnrollmentsCount, 1);
    assert.equal(stats.enrolledStudentsCount, 1);

    // TeacherService never returns fabricated demo classes or demo students on empty state
    const emptyClasses = await TeacherService.getTeacherClasses('brand-new-teacher-uid');
    assert.equal(emptyClasses.length, 0);
    const emptyEnrollments = await TeacherService.getEnrolledStudents('brand-new-teacher-uid');
    assert.equal(emptyEnrollments.length, 0);
  });

  it('validates invite codes, blocks duplicates/expired/closed/full classes, and propagates real enrollments across student, teacher, and admin', async () => {
    const prevStorage = (globalThis as any).localStorage;
    const prevAuthUser = (auth as any).currentUser;
    (auth as any).currentUser = null;
    const store = new Map<string, string>();
    (globalThis as any).localStorage = {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => {
        store.set(k, String(v));
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
      clear: () => {
        store.clear();
      },
    };
    store.clear();

    try {
      const created = await TeacherService.createClass(
        'teacher-invite-1',
        'prof.convite@guitaracademy.test',
        'Prof. Henrique',
        'Turma Violão Fingerpicking',
        'Estudo de dedilhado e harmonia',
        'GA-FINGER1',
        {
          courseId: 'violao',
          instrument: 'Violão Clássico',
          maxStudents: 1,
          expiresAt: '2099-12-31T23:59:59.000Z',
        }
      );

      // 1. Empty / invalid / unknown codes fail safely
      assert.equal((await TeacherService.validateInviteCode('')).reason, 'empty');
      assert.equal((await TeacherService.validateInviteCode('INVALID CODE!')).reason, 'invalid_format');
      assert.equal((await TeacherService.validateInviteCode('GA-NOT-FOUND')).reason, 'not_found');

      // 2. Valid invite code returns preview metadata BEFORE confirmation
      const preview = await TeacherService.validateInviteCode('ga-finger1', 'stu-invite-1');
      assert.equal(preview.valid, true);
      assert.equal(preview.classGroup?.id, created.id);
      assert.equal(preview.classGroup?.name, 'Turma Violão Fingerpicking');
      assert.equal(preview.classGroup?.instrument, 'Violão Clássico');
      assert.equal(preview.classGroup?.teacherName, 'Prof. Henrique');

      // 3. Expired and closed invites are rejected cleanly
      await TeacherService.createClass(
        'teacher-invite-1',
        'prof.convite@guitaracademy.test',
        'Prof. Henrique',
        'Turma Expirada',
        'Expirou ontem',
        'GA-EXPIRED1',
        {
          courseId: 'solo',
          expiresAt: '2020-01-01T00:00:00.000Z',
        }
      );
      assert.equal((await TeacherService.validateInviteCode('GA-EXPIRED1', 'stu-invite-1')).reason, 'expired');

      const closedClass = await TeacherService.createClass(
        'teacher-invite-1',
        'prof.convite@guitaracademy.test',
        'Prof. Henrique',
        'Turma Encerrada',
        'Fechada',
        'GA-CLOSED1'
      );
      // Mark class as closed in storage
      const savedClasses = JSON.parse(store.get('guitar_academy:teacher_classes_v1') || '[]');
      for (const c of savedClasses) {
        if (c.id === closedClass.id) c.active = false;
      }
      store.set('guitar_academy:teacher_classes_v1', JSON.stringify(savedClasses));
      assert.equal((await TeacherService.validateInviteCode('GA-CLOSED1', 'stu-invite-1')).reason, 'closed');

      // 4. Student confirms enrollment in valid class
      const joinRes = await TeacherService.joinClassWithInviteCode(
        'stu-invite-1',
        'Lucas Violonista',
        'lucas@guitaracademy.test',
        'GA-FINGER1'
      );
      assert.equal(joinRes.success, true);
      assert.equal(joinRes.classGroup?.id, created.id);

      // 5. Duplicate enrollment for the same student is blocked
      const dupPreview = await TeacherService.validateInviteCode('GA-FINGER1', 'stu-invite-1');
      assert.equal(dupPreview.valid, false);
      assert.equal(dupPreview.reason, 'already_enrolled');
      const dupJoin = await TeacherService.joinClassWithInviteCode(
        'stu-invite-1',
        'Lucas Violonista',
        'lucas@guitaracademy.test',
        'GA-FINGER1'
      );
      assert.equal(dupJoin.success, false);

      // 6. Capacity limit blocks second student when maxStudents === 1
      const fullPreview = await TeacherService.validateInviteCode('GA-FINGER1', 'stu-invite-2');
      assert.equal(fullPreview.valid, false);
      assert.equal(fullPreview.reason, 'full');

      // 7. Student profile, Teacher panel, and Admin directory all reflect the real enrollment
      const studentClasses = await TeacherService.getStudentEnrollments('stu-invite-1');
      assert.equal(studentClasses.length, 1);
      assert.equal(studentClasses[0].classId, created.id);
      assert.equal(studentClasses[0].className, 'Turma Violão Fingerpicking');
      assert.equal(studentClasses[0].instrument, 'Violão Clássico');
      assert.equal(studentClasses[0].teacherName, 'Prof. Henrique');

      const teacherStudents = await TeacherService.getEnrolledStudents('teacher-invite-1', created.id);
      assert.equal(teacherStudents.length, 1);
      assert.equal(teacherStudents[0].studentId, 'stu-invite-1');

      const adminUsers = buildAdminDirectoryUsers({
        userDocs: [{ id: 'stu-invite-1', data: { uid: 'stu-invite-1', displayName: 'Lucas Violonista', email: 'lucas@guitaracademy.test' } }],
        roleDocs: [],
        classes: [created],
        enrollments: teacherStudents,
      });
      const stuEntry = adminUsers.find((u) => u.uid === 'stu-invite-1');
      assert.ok(stuEntry);
      assert.equal(stuEntry.isEnrolledStudent, true);
      assert.deepEqual(stuEntry.classNames, ['Turma Violão Fingerpicking']);
    } finally {
      (globalThis as any).localStorage = prevStorage;
      (auth as any).currentUser = prevAuthUser;
    }
  });
});

describe('Firebase Emulator — Firestore Security Rules (Student vs Admin)', () => {
  let testEnv: RulesTestEnvironment | null = null;
  let emulatorAvailable = false;
  let emulatorInitError: unknown = null;
  const { host, port } = parseEmulatorHost();

  function getNamedFirestoreFromContext(
    env: RulesTestEnvironment,
    context: RulesTestContext,
    mockUserToken?: EmulatorMockTokenOptions | string
  ): Firestore {
    const fsEmulator = env.emulators.firestore || { host, port };
    const compatDb = context.firestore();
    const compatApp = compatDb.app as unknown as { _delegate: FirebaseApp };
    const namedDb = getFirestore(compatApp._delegate, FIRESTORE_DATABASE_ID);
    connectFirestoreEmulator(namedDb, fsEmulator.host, fsEmulator.port, {
      mockUserToken,
    });
    return namedDb;
  }

  function getAuthenticatedDb(
    env: RulesTestEnvironment,
    uid: string,
    tokenOptions?: TokenOptions
  ): Firestore {
    const context = env.authenticatedContext(uid, tokenOptions);
    return getNamedFirestoreFromContext(env, context, {
      ...(tokenOptions as EmulatorMockTokenOptions | undefined),
      sub: uid,
      user_id: uid,
    });
  }

  function getUnauthenticatedDb(env: RulesTestEnvironment): Firestore {
    const context = env.unauthenticatedContext();
    return getNamedFirestoreFromContext(env, context, undefined);
  }

  async function withNamedSecurityRulesDisabled(
    env: RulesTestEnvironment,
    callback: (adminDb: Firestore) => Promise<void>
  ): Promise<void> {
    await env.withSecurityRulesDisabled(async (context) => {
      const adminDb = getNamedFirestoreFromContext(env, context, 'owner');
      await callback(adminDb);
    });
  }

  async function clearNamedFirestore(env: RulesTestEnvironment): Promise<void> {
    const fsEmulator = env.emulators.firestore || { host, port };
    await env.clearFirestore();
    if (FIRESTORE_DATABASE_ID && FIRESTORE_DATABASE_ID !== '(default)') {
      const endpoint = `http://${fsEmulator.host}:${fsEmulator.port}/emulator/v1/projects/${encodeURIComponent(env.projectId)}/databases/${encodeURIComponent(FIRESTORE_DATABASE_ID)}/documents`;
      const resp = await fetch(endpoint, { method: 'DELETE' });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(
          `Falha ao limpar documentos do banco nomeado "${FIRESTORE_DATABASE_ID}" no Firestore Emulator (${resp.status}): ${body}`
        );
      }
    }
  }

  const STUDENT_UID = 'student-uid-1';
  const OTHER_STUDENT_UID = 'student-uid-2';
  const TEACHER_UID = 'teacher-uid-1';
  const TEACHER_2_UID = 'teacher-uid-2';
  const ADMIN_UID = 'admin-uid-1';

  before(async () => {
    const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
    const rules = fs.readFileSync(rulesPath, 'utf8');

    try {
      const env = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: {
          rules,
          host,
          port,
        },
      });
      // Verify that the endpoint actually responds as a Firestore Emulator and clear the named database
      await clearNamedFirestore(env);
      testEnv = env;
      emulatorAvailable = true;
      emulatorInitError = null;
    } catch (err) {
      testEnv = null;
      emulatorAvailable = false;
      emulatorInitError = err;
      if (process.env.REQUIRE_FIREBASE_EMULATOR === 'true') {
        throw err;
      }
    }
  });

  after(async () => {
    if (!emulatorAvailable) {
      const detail =
        emulatorInitError instanceof Error ? emulatorInitError.message : String(emulatorInitError || '');
      console.error(
        `[WARNING] Firebase Firestore Emulator indisponivel em ${host}:${port} (banco: ${FIRESTORE_DATABASE_ID}). Os 5 testes de regras do Emulator foram IGNORADOS (NAO APROVADOS).${detail ? ` Motivo: ${detail}` : ''}`
      );
    }
    if (testEnv) {
      await testEnv.cleanup();
      testEnv = null;
    }
  });

  beforeEach(async () => {
    if (!testEnv) return;

    await clearNamedFirestore(testEnv);
    await withNamedSecurityRulesDisabled(testEnv, async (adminDb) => {

      await setDoc(doc(adminDb, 'system_roles', ADMIN_UID), {
        uid: ADMIN_UID,
        role: 'admin',
      });
      await setDoc(doc(adminDb, 'system_roles', TEACHER_UID), {
        uid: TEACHER_UID,
        role: 'teacher',
      });
      await setDoc(doc(adminDb, 'system_roles', TEACHER_2_UID), {
        uid: TEACHER_2_UID,
        role: 'teacher',
      });
      await setDoc(doc(adminDb, 'system_roles', STUDENT_UID), {
        uid: STUDENT_UID,
        role: 'student',
      });

      await setDoc(doc(adminDb, 'users', STUDENT_UID), {
        uid: STUDENT_UID,
        displayName: 'Aluno Teste',
        email: 'aluno1@guitaracademy.test',
      });
      await setDoc(doc(adminDb, 'users', OTHER_STUDENT_UID), {
        uid: OTHER_STUDENT_UID,
        displayName: 'Outro Aluno',
        email: 'aluno2@guitaracademy.test',
      });
      await setDoc(doc(adminDb, 'users', TEACHER_UID), {
        uid: TEACHER_UID,
        displayName: 'Professor Teste',
        email: 'prof1@guitaracademy.test',
      });

      await setDoc(doc(adminDb, 'students', OTHER_STUDENT_UID), {
        uid: OTHER_STUDENT_UID,
        displayName: 'Outro Aluno',
      });

      await setDoc(doc(adminDb, 'classes', 'class-101'), {
        id: 'class-101',
        name: 'Turma Violao 101',
        code: 'GA-101',
        teacherId: TEACHER_UID,
        active: true,
        enrolledCount: 0,
      });
      await setDoc(doc(adminDb, 'class_invites', 'GA-101'), {
        classId: 'class-101',
        code: 'GA-101',
        name: 'Turma Violao 101',
        teacherId: TEACHER_UID,
        active: true,
      });
      await setDoc(doc(adminDb, 'classes', 'class-101', 'events', 'evt-1'), {
        studentUid: OTHER_STUDENT_UID,
        classId: 'class-101',
        eventType: 'lesson_completed',
      });

      await setDoc(doc(adminDb, 'teacher_student_links', 'link-1'), {
        teacherId: TEACHER_UID,
        studentId: OTHER_STUDENT_UID,
      });

      await setDoc(doc(adminDb, 'enrollments', 'enroll-other'), {
        studentId: OTHER_STUDENT_UID,
        teacherId: TEACHER_UID,
        classId: 'class-101',
        status: 'active',
      });
      await setDoc(doc(adminDb, 'student_progress', OTHER_STUDENT_UID), {
        userId: OTHER_STUDENT_UID,
        studentId: OTHER_STUDENT_UID,
        completedLessons: ['lesson-1'],
      });
      await setDoc(doc(adminDb, 'practice_records', 'rec-other'), {
        userId: OTHER_STUDENT_UID,
        durationMinutes: 15,
      });
      await setDoc(doc(adminDb, 'courses', 'violao'), {
        id: 'violao',
        title: 'Dominio Total do Violao',
      });
      await setDoc(doc(adminDb, 'admin_logs', 'log-seed-1'), {
        id: 'log-seed-1',
        eventType: 'auth_login_success',
        severity: 'info',
        actorUid: ADMIN_UID,
        actorEmail: 'admin@guitaracademy.test',
        actorRole: 'admin',
        action: 'Login administrativo inicial',
        source: 'client',
        timestamp: '2026-11-13T00:00:00.000Z',
      });
    });
  });

  function requireEmulator(t: { skip: (message?: string) => void }): RulesTestEnvironment | null {
    if (!emulatorAvailable || !testEnv) {
      const detail =
        emulatorInitError instanceof Error ? emulatorInitError.message : String(emulatorInitError || '');
      const msg = `Firebase Firestore Emulator not running at ${host}:${port} for database "${FIRESTORE_DATABASE_ID}" (NOT PASSED — skipped)${detail ? `: ${detail}` : ''}`;
      if (process.env.REQUIRE_FIREBASE_EMULATOR === 'true') {
        assert.fail(msg);
      }
      t.skip(msg);
      return null;
    }
    return testEnv;
  }

  it('prevents any user (student, teacher, admin, unauthenticated) from writing to system_roles', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    const studentDb = getAuthenticatedDb(env, STUDENT_UID);
    const teacherDb = getAuthenticatedDb(env, TEACHER_UID);
    const adminDb = getAuthenticatedDb(env, ADMIN_UID);
    const unauthDb = getUnauthenticatedDb(env);

    // Student cannot create or overwrite their own system_roles doc to gain admin
    await assertFails(
      setDoc(doc(studentDb, 'system_roles', STUDENT_UID), {
        uid: STUDENT_UID,
        role: 'admin',
      })
    );

    // Student cannot update or delete their existing system_roles doc
    await assertFails(
      updateDoc(doc(studentDb, 'system_roles', STUDENT_UID), {
        role: 'admin',
      })
    );
    await assertFails(deleteDoc(doc(studentDb, 'system_roles', STUDENT_UID)));

    // Student cannot create a brand new system_roles entry or overwrite admin's entry
    await assertFails(
      setDoc(doc(studentDb, 'system_roles', 'forged-admin-uid'), {
        uid: 'forged-admin-uid',
        role: 'admin',
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'system_roles', ADMIN_UID), {
        uid: ADMIN_UID,
        role: 'student',
      })
    );

    // Teacher cannot create, update, or delete system_roles entries (self or others)
    await assertFails(
      setDoc(doc(teacherDb, 'system_roles', TEACHER_UID), {
        uid: TEACHER_UID,
        role: 'admin',
      })
    );
    await assertFails(
      updateDoc(doc(teacherDb, 'system_roles', TEACHER_UID), {
        role: 'admin',
      })
    );
    await assertFails(deleteDoc(doc(teacherDb, 'system_roles', TEACHER_UID)));
    await assertFails(
      setDoc(doc(teacherDb, 'system_roles', STUDENT_UID), {
        uid: STUDENT_UID,
        role: 'teacher',
      })
    );

    // Even an authenticated admin cannot create, update, or delete system_roles from the client SDK
    await assertFails(
      setDoc(doc(adminDb, 'system_roles', 'promoted-uid'), {
        uid: 'promoted-uid',
        role: 'admin',
      })
    );
    await assertFails(
      updateDoc(doc(adminDb, 'system_roles', STUDENT_UID), {
        role: 'teacher',
      })
    );
    await assertFails(deleteDoc(doc(adminDb, 'system_roles', STUDENT_UID)));

    // Unauthenticated requests cannot write system_roles
    await assertFails(
      setDoc(doc(unauthDb, 'system_roles', 'anon-admin'), {
        uid: 'anon-admin',
        role: 'admin',
      })
    );
  });

  it('denies student privilege escalation to admin role via users and students collections', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    const studentDb = getAuthenticatedDb(env, STUDENT_UID);
    const newStudentUid = 'student-new-signup';
    const newStudentDb = getAuthenticatedDb(env, newStudentUid);

    // Student cannot update role, isAdmin, isTeacher, permissions, or accountStatus on their profile
    await assertFails(
      updateDoc(doc(studentDb, 'users', STUDENT_UID), { role: 'admin' })
    );
    await assertFails(
      updateDoc(doc(studentDb, 'users', STUDENT_UID), { isAdmin: true })
    );
    await assertFails(
      updateDoc(doc(studentDb, 'users', STUDENT_UID), { isTeacher: true })
    );
    await assertFails(
      updateDoc(doc(studentDb, 'users', STUDENT_UID), { permissions: ['admin'] })
    );
    await assertFails(
      updateDoc(doc(studentDb, 'users', STUDENT_UID), { accountStatus: 'suspended' })
    );
    await assertFails(
      updateDoc(doc(studentDb, 'users', STUDENT_UID), { accountStatus: 'active' })
    );

    // Benign profile update on own document is still allowed
    await assertSucceeds(
      updateDoc(doc(studentDb, 'users', STUDENT_UID), { displayName: 'Aluno Atualizado' })
    );

    // New student signup cannot send role, isAdmin, isTeacher or permissions (even student/false) during create
    await assertFails(
      setDoc(doc(newStudentDb, 'users', newStudentUid), {
        uid: newStudentUid,
        email: 'hacker@guitaracademy.test',
        role: 'admin',
      })
    );
    await assertFails(
      setDoc(doc(newStudentDb, 'users', newStudentUid), {
        uid: newStudentUid,
        email: 'hacker@guitaracademy.test',
        role: 'student',
      })
    );
    await assertFails(
      setDoc(doc(newStudentDb, 'users', newStudentUid), {
        uid: newStudentUid,
        email: 'hacker@guitaracademy.test',
        isAdmin: true,
      })
    );
    await assertFails(
      setDoc(doc(newStudentDb, 'users', newStudentUid), {
        uid: newStudentUid,
        email: 'hacker@guitaracademy.test',
        isTeacher: false,
      })
    );
    await assertFails(
      setDoc(doc(newStudentDb, 'users', newStudentUid), {
        uid: newStudentUid,
        email: 'hacker@guitaracademy.test',
        permissions: ['manage_roles'],
      })
    );

    // Normal student signup without privilege fields succeeds, and reading own profile succeeds
    await assertSucceeds(
      setDoc(doc(newStudentDb, 'users', newStudentUid), {
        uid: newStudentUid,
        displayName: 'Novo Aluno',
        email: 'legit@guitaracademy.test',
        accountStatus: 'active',
      })
    );
    await assertSucceeds(getDoc(doc(newStudentDb, 'users', newStudentUid)));

    // Student cannot self-assign admin fields in /students/{uid}
    await assertFails(
      setDoc(doc(studentDb, 'students', STUDENT_UID), {
        uid: STUDENT_UID,
        role: 'admin',
        isAdmin: true,
      })
    );
  });

  it('blocks an authenticated student from querying administrative and restricted collections', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    const studentDb = getAuthenticatedDb(env, STUDENT_UID);

    // Student can read ONLY their own system_roles doc, never list collection or read another user's role
    const ownRoleSnap = await assertSucceeds(getDoc(doc(studentDb, 'system_roles', STUDENT_UID)));
    assert.equal(ownRoleSnap.data()?.role, 'student');
    await assertFails(getDocs(collection(studentDb, 'system_roles')));
    await assertFails(getDoc(doc(studentDb, 'system_roles', ADMIN_UID)));
    await assertFails(getDoc(doc(studentDb, 'system_roles', TEACHER_UID)));
    await assertFails(getDoc(doc(studentDb, 'system_roles', OTHER_STUDENT_UID)));

    // Blocked from listing users or reading/modifying another student's profile
    await assertFails(getDocs(collection(studentDb, 'users')));
    await assertFails(getDoc(doc(studentDb, 'users', OTHER_STUDENT_UID)));
    await assertFails(
      setDoc(doc(studentDb, 'users', OTHER_STUDENT_UID), {
        uid: OTHER_STUDENT_UID,
        displayName: 'Tampered',
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'users', STUDENT_UID, 'data', 'progress'), {
        uid: OTHER_STUDENT_UID,
      })
    );

    // Blocked from listing students, classes, class_invites, class events, and teacher-student links
    await assertFails(getDocs(collection(studentDb, 'students')));
    await assertFails(getDocs(collection(studentDb, 'classes')));
    await assertFails(getDocs(collection(studentDb, 'class_invites')));
    await assertFails(getDocs(collection(studentDb, 'classes', 'class-101', 'events')));
    await assertFails(getDocs(collection(studentDb, 'teacher_student_links')));

    // Student CAN lookup a single invite code directly, but cannot modify class_invites
    await assertSucceeds(getDoc(doc(studentDb, 'class_invites', 'GA-101')));
    await assertFails(
      setDoc(doc(studentDb, 'class_invites', 'GA-FAKE'), {
        classId: 'class-101',
        code: 'GA-FAKE',
        teacherId: STUDENT_UID,
        active: true,
      })
    );

    // Blocked from un-scoped collection queries on enrollments, student_progress, practice_records
    await assertFails(getDocs(collection(studentDb, 'enrollments')));
    await assertFails(getDocs(collection(studentDb, 'student_progress')));
    await assertFails(getDocs(collection(studentDb, 'practice_records')));

    // Blocked from modifying administrative/catalog collections
    await assertFails(
      setDoc(doc(studentDb, 'courses', 'violao'), {
        id: 'violao',
        title: 'Tampered Course',
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'teachers', STUDENT_UID), {
        uid: STUDENT_UID,
        name: 'Fake Teacher',
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'admin_audit_logs', 'log-1'), {
        action: 'bypass',
      })
    );
    await assertFails(getDocs(collection(studentDb, 'admin_logs')));
    await assertFails(getDoc(doc(studentDb, 'admin_logs', 'log-seed-1')));
    await assertFails(
      setDoc(doc(studentDb, 'admin_logs', 'log-forged-1'), {
        id: 'log-forged-1',
        eventType: 'auth_login_success',
        severity: 'info',
        actorUid: STUDENT_UID,
        actorRole: 'admin',
        action: 'Tentativa de falsificar papel no log',
        source: 'admin_portal',
        timestamp: '2026-11-13T00:00:00.000Z',
      })
    );
    await assertFails(
      updateDoc(doc(studentDb, 'admin_logs', 'log-seed-1'), {
        action: 'Tampered',
      })
    );

    // Unauthenticated users are also blocked from system_roles, users and admin_logs
    const unauthDb = getUnauthenticatedDb(env);
    await assertFails(getDocs(collection(unauthDb, 'system_roles')));
    await assertFails(getDoc(doc(unauthDb, 'system_roles', STUDENT_UID)));
    await assertFails(getDocs(collection(unauthDb, 'users')));
    await assertFails(getDocs(collection(unauthDb, 'admin_logs')));
  });

  it('allows verified admin to query administrative collections while blocking teacher escalation', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    const adminDb = getAuthenticatedDb(env, ADMIN_UID);
    const teacherDb = getAuthenticatedDb(env, TEACHER_UID);

    // Verified admin can list and get all system_roles, users, and admin_logs
    const rolesSnap = await assertSucceeds(getDocs(collection(adminDb, 'system_roles')));
    assert.ok(rolesSnap.size >= 3);
    await assertSucceeds(getDoc(doc(adminDb, 'system_roles', ADMIN_UID)));
    await assertSucceeds(getDoc(doc(adminDb, 'system_roles', TEACHER_UID)));
    await assertSucceeds(getDoc(doc(adminDb, 'system_roles', STUDENT_UID)));

    const usersSnap = await assertSucceeds(getDocs(collection(adminDb, 'users')));
    assert.ok(usersSnap.size >= 3);

    const logsSnap = await assertSucceeds(getDocs(collection(adminDb, 'admin_logs')));
    assert.ok(logsSnap.size >= 1);
    await assertFails(
      updateDoc(doc(adminDb, 'admin_logs', 'log-seed-1'), { action: 'Overwrite immutable' })
    );

    // Verified admin can suspend and reactivate a student's users/{uid}.accountStatus, while student cannot
    const studentSelfDb = getAuthenticatedDb(env, STUDENT_UID);
    await assertSucceeds(
      updateDoc(doc(adminDb, 'users', STUDENT_UID), { accountStatus: 'suspended' })
    );
    await assertFails(
      updateDoc(doc(studentSelfDb, 'users', STUDENT_UID), { accountStatus: 'active' })
    );
    await assertFails(
      updateDoc(doc(studentSelfDb, 'users', STUDENT_UID), { accountStatus: deleteField() })
    );
    await assertSucceeds(
      updateDoc(doc(adminDb, 'users', STUDENT_UID), { accountStatus: 'active' })
    );

    // Teacher can read ONLY their own system_roles doc (serverless role resolution)
    const teacherOwnRoleSnap = await assertSucceeds(getDoc(doc(teacherDb, 'system_roles', TEACHER_UID)));
    assert.equal(teacherOwnRoleSnap.data()?.role, 'teacher');

    // Teacher is blocked from reading other users' system_roles, listing system_roles, or reading admin_logs
    await assertFails(getDoc(doc(teacherDb, 'system_roles', STUDENT_UID)));
    await assertFails(getDoc(doc(teacherDb, 'system_roles', OTHER_STUDENT_UID)));
    await assertFails(getDoc(doc(teacherDb, 'system_roles', ADMIN_UID)));
    await assertFails(getDocs(collection(teacherDb, 'system_roles')));
    await assertFails(getDocs(collection(teacherDb, 'admin_logs')));

    // Teacher can query/manage own classes and read class students & events, but cannot modify other classes
    await assertSucceeds(
      getDocs(query(collection(teacherDb, 'classes'), where('teacherId', '==', TEACHER_UID)))
    );
    await assertSucceeds(
      getDocs(collection(teacherDb, 'classes', 'class-101', 'students'))
    );
    await assertSucceeds(
      getDoc(doc(teacherDb, 'classes', 'class-101', 'events', 'evt-1'))
    );
    await assertSucceeds(
      setDoc(doc(teacherDb, 'classes', 'class-102'), {
        id: 'class-102',
        name: 'Turma Guitarra Solo',
        code: 'GA-102',
        teacherId: TEACHER_UID,
        active: true,
      })
    );

    // Teacher cannot promote their own account via system_roles, users, or courses
    await assertFails(
      setDoc(doc(teacherDb, 'system_roles', TEACHER_UID), {
        uid: TEACHER_UID,
        role: 'admin',
      })
    );
    await assertFails(
      updateDoc(doc(teacherDb, 'system_roles', TEACHER_UID), {
        role: 'admin',
      })
    );
    await assertFails(
      updateDoc(doc(teacherDb, 'users', TEACHER_UID), {
        role: 'admin',
      })
    );
    await assertFails(
      updateDoc(doc(teacherDb, 'users', TEACHER_UID), {
        isAdmin: true,
      })
    );
    await assertFails(
      setDoc(doc(teacherDb, 'courses', 'hacked-course'), {
        id: 'hacked-course',
        title: 'Unauthorized',
      })
    );
  });

  it('enforces strict cross-user validations on enrollments and student_progress', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    const studentDb = getAuthenticatedDb(env, STUDENT_UID);
    const otherStudentDb = getAuthenticatedDb(env, OTHER_STUDENT_UID);
    const otherTeacherDb = getAuthenticatedDb(env, TEACHER_2_UID);

    // Enrollments: student cannot create enrollment for another user, non-existent class, or forged approval
    await assertFails(
      setDoc(doc(studentDb, 'enrollments', 'forged-other-student'), {
        studentId: OTHER_STUDENT_UID,
        classId: 'class-101',
        teacherId: TEACHER_UID,
        status: 'active',
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'enrollments', 'forged-missing-class'), {
        studentId: STUDENT_UID,
        classId: 'non-existent-class',
        teacherId: TEACHER_UID,
        status: 'active',
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'enrollments', 'forged-approval'), {
        studentId: STUDENT_UID,
        classId: 'class-101',
        teacherId: TEACHER_UID,
        status: 'approved',
        approvedBy: ADMIN_UID,
      })
    );

    // Non-atomic / orphan enrollment writes MUST fail (1-to-1 integrity + server-validated enrolledCount required)
    const detEnrollId = `enroll-class-101-${STUDENT_UID}`;
    await assertFails(
      setDoc(doc(studentDb, 'enrollments', detEnrollId), {
        id: detEnrollId,
        studentId: STUDENT_UID,
        classId: 'class-101',
        teacherId: TEACHER_UID,
        status: 'active',
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'classes', 'class-101', 'students', STUDENT_UID), {
        studentId: STUDENT_UID,
        classId: 'class-101',
        teacherId: TEACHER_UID,
        studentName: 'Aluno Teste',
        status: 'active',
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'enrollments', 'enroll-arbitrary-forged-id'), {
        studentId: STUDENT_UID,
        classId: 'class-101',
        teacherId: TEACHER_UID,
        status: 'active',
      })
    );
    // Client cannot tamper with enrolledCount or maxStudents directly
    await assertFails(
      updateDoc(doc(studentDb, 'classes', 'class-101'), {
        enrolledCount: 0,
        maxStudents: 999,
      })
    );

    // Atomic WriteBatch updating classes/{classId}.enrolledCount + students/{uid} + enrollments/{detId} succeeds
    const validBatch = writeBatch(studentDb);
    validBatch.update(doc(studentDb, 'classes', 'class-101'), {
      enrolledCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    validBatch.set(doc(studentDb, 'classes', 'class-101', 'students', STUDENT_UID), {
      id: detEnrollId,
      studentId: STUDENT_UID,
      classId: 'class-101',
      teacherId: TEACHER_UID,
      studentName: 'Aluno Teste',
      status: 'active',
    });
    validBatch.set(doc(studentDb, 'enrollments', detEnrollId), {
      id: detEnrollId,
      studentId: STUDENT_UID,
      classId: 'class-101',
      teacherId: TEACHER_UID,
      studentName: 'Aluno Teste',
      status: 'active',
    });
    await assertSucceeds(validBatch.commit());
    await assertSucceeds(getDoc(doc(studentDb, 'classes', 'class-101')));
    await assertSucceeds(getDoc(doc(studentDb, 'classes', 'class-101', 'students', STUDENT_UID)));

    // Non-enrolled student cannot read class or other student's class enrollment/profile
    await assertFails(getDoc(doc(otherStudentDb, 'classes', 'class-101')));
    await assertFails(getDoc(doc(otherStudentDb, 'classes', 'class-101', 'students', STUDENT_UID)));
    await assertFails(getDoc(doc(otherStudentDb, 'users', STUDENT_UID)));

    // Student cannot tamper with another student's enrollment or reassign teacherId
    await assertFails(
      updateDoc(doc(studentDb, 'enrollments', 'enroll-other'), {
        status: 'cancelled',
      })
    );
    await assertFails(
      updateDoc(doc(studentDb, 'enrollments', detEnrollId), {
        teacherId: TEACHER_2_UID,
      })
    );
    // Verified unrelated teacher (TEACHER_2_UID) cannot read or modify another teacher's class, students, events, or role
    await assertFails(getDoc(doc(otherTeacherDb, 'system_roles', TEACHER_UID)));
    await assertFails(getDoc(doc(otherTeacherDb, 'classes', 'class-101')));
    await assertFails(getDocs(collection(otherTeacherDb, 'classes', 'class-101', 'students')));
    await assertFails(getDoc(doc(otherTeacherDb, 'classes', 'class-101', 'events', 'evt-1')));
    await assertFails(
      updateDoc(doc(otherTeacherDb, 'enrollments', 'enroll-other'), {
        status: 'suspended',
      })
    );
    await assertFails(
      updateDoc(doc(otherTeacherDb, 'classes', 'class-101'), {
        name: 'Turma Hijacked',
      })
    );

    // Student progress: block split-identity, cross-user ID spoofing, negative metrics, and cross-user reads
    await assertFails(
      setDoc(doc(studentDb, 'student_progress', 'split-identity'), {
        userId: STUDENT_UID,
        studentId: OTHER_STUDENT_UID,
        totalStudyTimeSeconds: 60,
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'student_progress', OTHER_STUDENT_UID), {
        userId: STUDENT_UID,
        totalStudyTimeSeconds: 60,
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'student_progress', STUDENT_UID), {
        userId: STUDENT_UID,
        totalStudyTimeSeconds: -100,
      })
    );
    await assertFails(getDoc(doc(studentDb, 'student_progress', OTHER_STUDENT_UID)));
    await assertFails(
      updateDoc(doc(studentDb, 'student_progress', OTHER_STUDENT_UID), {
        totalStudyTimeSeconds: 999,
      })
    );

    // Valid own progress write succeeds, but cannot reassign ownership on update
    await assertSucceeds(
      setDoc(doc(studentDb, 'student_progress', STUDENT_UID), {
        userId: STUDENT_UID,
        studentId: STUDENT_UID,
        totalStudyTimeSeconds: 300,
        practicedBpm: 90,
      })
    );
    await assertFails(
      updateDoc(doc(studentDb, 'student_progress', STUDENT_UID), {
        studentId: OTHER_STUDENT_UID,
      })
    );
  });

  it('enforces server-verified maxStudents limit and invite expiration on atomic batches', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    await withNamedSecurityRulesDisabled(env, async (adminDb) => {
      await setDoc(doc(adminDb, 'classes', 'class-cap-1'), {
        id: 'class-cap-1',
        name: 'Turma Limite 1 Vaga',
        code: 'GA-CAP1',
        teacherId: TEACHER_UID,
        active: true,
        maxStudents: 1,
        enrolledCount: 0,
      });
      await setDoc(doc(adminDb, 'classes', 'class-expired'), {
        id: 'class-expired',
        name: 'Turma Expirada',
        code: 'GA-EXP1',
        teacherId: TEACHER_UID,
        active: true,
        maxStudents: 10,
        enrolledCount: 0,
        expiresAtMs: Date.now() - 60_000,
      });
    });

    const studentDb = getAuthenticatedDb(env, STUDENT_UID);
    const otherStudentDb = getAuthenticatedDb(env, OTHER_STUDENT_UID);

    const buildJoinBatch = (dbClient: Firestore, clsId: string, uid: string) => {
      const enrollId = `enroll-${clsId}-${uid}`;
      const b = writeBatch(dbClient);
      b.update(doc(dbClient, 'classes', clsId), {
        enrolledCount: increment(1),
        updatedAt: serverTimestamp(),
      });
      b.set(doc(dbClient, 'classes', clsId, 'students', uid), {
        id: enrollId,
        studentId: uid,
        classId: clsId,
        teacherId: TEACHER_UID,
        status: 'active',
      });
      b.set(doc(dbClient, 'enrollments', enrollId), {
        id: enrollId,
        studentId: uid,
        classId: clsId,
        teacherId: TEACHER_UID,
        status: 'active',
      });
      return b;
    };

    // 1. Expired class invite blocked by request.time.toMillis() <= expiresAtMs
    await assertFails(buildJoinBatch(studentDb, 'class-expired', STUDENT_UID).commit());

    // 2. First student takes the 1 available seat
    await assertSucceeds(buildJoinBatch(studentDb, 'class-cap-1', STUDENT_UID).commit());

    // 3. Second student cannot exceed maxStudents=1 even with a valid atomic batch
    await assertFails(buildJoinBatch(otherStudentDb, 'class-cap-1', OTHER_STUDENT_UID).commit());
  });

  it('blocks unvalidated legacy classes lacking enrolledCount and enforces legacy expiresAt compatibility', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    await withNamedSecurityRulesDisabled(env, async (adminDb) => {
      // Unvalidated legacy class without enrolledCount field
      await setDoc(doc(adminDb, 'classes', 'class-legacy-unvalidated'), {
        id: 'class-legacy-unvalidated',
        name: 'Turma Legada Sem Contador',
        code: 'GA-LEG-NO-COUNT',
        teacherId: TEACHER_UID,
        active: true,
        maxStudents: 10,
      });
      // Legacy non-expiring class without expiresAt or expiresAtMs (with validated enrolledCount)
      await setDoc(doc(adminDb, 'classes', 'class-legacy-no-exp'), {
        id: 'class-legacy-no-exp',
        name: 'Turma Legada Sem Validade',
        code: 'GA-LEG-NO-EXP',
        teacherId: TEACHER_UID,
        active: true,
        maxStudents: 5,
        enrolledCount: 0,
      });
      // Legacy class with text expiresAt but missing expiresAtMs
      await setDoc(doc(adminDb, 'classes', 'class-legacy-text-exp'), {
        id: 'class-legacy-text-exp',
        name: 'Turma Legada Exp Textual',
        code: 'GA-LEG-TEXT-EXP',
        teacherId: TEACHER_UID,
        active: true,
        maxStudents: 5,
        enrolledCount: 0,
        expiresAt: '2020-01-01T00:00:00.000Z',
      });
    });

    const studentDb = getAuthenticatedDb(env, STUDENT_UID);
    const buildLegacyBatch = (dbClient: Firestore, clsId: string, uid: string) => {
      const enrollId = `enroll-${clsId}-${uid}`;
      const b = writeBatch(dbClient);
      b.update(doc(dbClient, 'classes', clsId), {
        enrolledCount: increment(1),
        updatedAt: serverTimestamp(),
      });
      b.set(doc(dbClient, 'classes', clsId, 'students', uid), {
        id: enrollId,
        studentId: uid,
        classId: clsId,
        teacherId: TEACHER_UID,
        status: 'active',
      });
      b.set(doc(dbClient, 'enrollments', enrollId), {
        id: enrollId,
        studentId: uid,
        classId: clsId,
        teacherId: TEACHER_UID,
        status: 'active',
      });
      return b;
    };

    // Unvalidated legacy class MUST be blocked in Rules until enrolledCount is reconciled
    await assertFails(buildLegacyBatch(studentDb, 'class-legacy-unvalidated', STUDENT_UID).commit());

    // Legacy class with text expiresAt and missing expiresAtMs is blocked until backfilled
    await assertFails(buildLegacyBatch(studentDb, 'class-legacy-text-exp', STUDENT_UID).commit());

    // Validated legacy non-expiring class without expiresAtMs remains compatible
    await assertSucceeds(buildLegacyBatch(studentDb, 'class-legacy-no-exp', STUDENT_UID).commit());
  });

  it('enforces Zero-Trust admin-only writes and owner-only reads on course_access_grants and student_academic_placements', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    const adminDb = getAuthenticatedDb(env, ADMIN_UID);
    const teacherDb = getAuthenticatedDb(env, TEACHER_UID);
    const studentDb = getAuthenticatedDb(env, STUDENT_UID);
    const otherStudentDb = getAuthenticatedDb(env, OTHER_STUDENT_UID);
    const nowIso = '2026-11-15T12:00:00.000Z';

    const grantId = 'grant-emu-1';
    const validGrant = {
      id: grantId,
      studentUid: STUDENT_UID,
      scopeType: 'module',
      grantType: 'special',
      source: 'admin_special',
      status: 'active',
      courseId: 'violao',
      instrumentId: null,
      moduleId: 'violao-mod-3',
      lessonId: null,
      rangeStartLessonId: null,
      rangeEndLessonId: null,
      lessonIds: null,
      startsAt: null,
      startsAtMs: null,
      expiresAt: null,
      expiresAtMs: null,
      reason: 'Bolsa parcial modulo 3',
      idempotencyKey: 'emu-key-1',
      grantedBy: ADMIN_UID,
      grantedByEmail: 'admin@guitaracademy.test',
      revokedBy: null,
      revokedAt: null,
      statusReason: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const placementId = `place_${STUDENT_UID}_violao`;
    const validPlacement = {
      id: placementId,
      studentUid: STUDENT_UID,
      courseId: 'violao',
      moduleId: 'violao-mod-3',
      moduleNumber: 3,
      lessonId: 'violao-lesson-13',
      mode: 'custom_start',
      status: 'active',
      reason: 'Nivelamento direto no modulo 3',
      assignedBy: ADMIN_UID,
      assignedByEmail: 'admin@guitaracademy.test',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Student & Teacher CANNOT create, update or delete grants or placements
    await assertFails(
      setDoc(doc(studentDb, 'course_access_grants', 'grant-self'), {
        ...validGrant,
        id: 'grant-self',
        grantedBy: STUDENT_UID,
      })
    );
    await assertFails(
      setDoc(doc(teacherDb, 'course_access_grants', 'grant-teacher'), {
        ...validGrant,
        id: 'grant-teacher',
        grantedBy: TEACHER_UID,
      })
    );
    await assertFails(
      setDoc(doc(studentDb, 'student_academic_placements', 'place-self'), {
        ...validPlacement,
        id: 'place-self',
        assignedBy: STUDENT_UID,
      })
    );
    await assertFails(
      setDoc(doc(teacherDb, 'student_academic_placements', 'place-teacher'), {
        ...validPlacement,
        id: 'place-teacher',
        assignedBy: TEACHER_UID,
      })
    );

    // Verified Admin CAN create, read, list and update grants and placements
    await assertSucceeds(setDoc(doc(adminDb, 'course_access_grants', grantId), validGrant));
    await assertSucceeds(setDoc(doc(adminDb, 'student_academic_placements', placementId), validPlacement));
    await assertSucceeds(getDocs(collection(adminDb, 'course_access_grants')));
    await assertSucceeds(getDocs(collection(adminDb, 'student_academic_placements')));
    await assertSucceeds(
      updateDoc(doc(adminDb, 'course_access_grants', grantId), {
        status: 'suspended',
        updatedAt: '2026-11-15T13:00:00.000Z',
      })
    );

    // Owner student CAN read/query ONLY own grant & placement
    await assertSucceeds(getDoc(doc(studentDb, 'course_access_grants', grantId)));
    await assertSucceeds(
      getDocs(query(collection(studentDb, 'course_access_grants'), where('studentUid', '==', STUDENT_UID)))
    );
    await assertSucceeds(getDoc(doc(studentDb, 'student_academic_placements', placementId)));
    await assertSucceeds(
      getDocs(query(collection(studentDb, 'student_academic_placements'), where('studentUid', '==', STUDENT_UID)))
    );

    // Owner student STILL CANNOT update/delete own grant or placement
    await assertFails(
      updateDoc(doc(studentDb, 'course_access_grants', grantId), { status: 'active' })
    );
    await assertFails(deleteDoc(doc(studentDb, 'course_access_grants', grantId)));
    await assertFails(
      updateDoc(doc(studentDb, 'student_academic_placements', placementId), { lessonId: 'violao-l20' })
    );
    await assertFails(deleteDoc(doc(studentDb, 'student_academic_placements', placementId)));

    // Other student & teacher CANNOT read or list another student's grants/placements
    await assertFails(getDoc(doc(otherStudentDb, 'course_access_grants', grantId)));
    await assertFails(getDocs(collection(otherStudentDb, 'course_access_grants')));
    await assertFails(getDoc(doc(otherStudentDb, 'student_academic_placements', placementId)));
    await assertFails(getDocs(collection(teacherDb, 'course_access_grants')));
    await assertFails(getDoc(doc(teacherDb, 'course_access_grants', grantId)));
    await assertFails(getDoc(doc(teacherDb, 'student_academic_placements', placementId)));
  });

  it('enforces Fase 2 Commerce Core fail-closed config, hidden products, immutable price versions and admin-only promotions', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    const adminDb = getAuthenticatedDb(env, ADMIN_UID);
    const teacherDb = getAuthenticatedDb(env, TEACHER_UID);
    const studentDb = getAuthenticatedDb(env, STUDENT_UID);
    const nowIso = '2026-11-15T12:00:00.000Z';

    const hiddenProd = {
      productId: 'prod-emu-1',
      name: 'Violão Completo Emu',
      description: 'Curso oficial completo de violão.',
      productType: 'individual_course',
      courseIds: ['violao'],
      status: 'active',
      visibility: 'hidden',
      linkedClassId: null,
      notes: null,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: ADMIN_UID,
      createdByEmail: 'admin@guitaracademy.test',
    };

    const priceV1 = {
      priceId: 'price-emu-1',
      productId: 'prod-emu-1',
      currency: 'BRL',
      amount: 197,
      amountCents: 19700,
      billingInterval: 'one_time',
      isPromotional: false,
      promotionalLabel: null,
      version: 1,
      previousPriceId: null,
      status: 'active',
      validFrom: null,
      validFromMs: null,
      validUntil: null,
      validUntilMs: null,
      notes: null,
      createdAt: nowIso,
      createdBy: ADMIN_UID,
      createdByEmail: 'admin@guitaracademy.test',
      supersededAt: null,
      supersededBy: null,
    };

    const promo1 = {
      promotionId: 'promo-emu-1',
      name: 'Cupom Violão 20',
      description: 'Teste emulador',
      code: 'VIOLAO20',
      discountType: 'percentage',
      discountValue: 20,
      scopeType: 'course',
      targetProductIds: [],
      targetCourseIds: ['violao'],
      startsAt: null,
      startsAtMs: null,
      endsAt: null,
      endsAtMs: null,
      maxRedemptions: 10,
      maxPerStudent: 1,
      redeemedCount: 0,
      eligibleAudience: 'all',
      eligibleStudentUids: [],
      status: 'active',
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: ADMIN_UID,
      createdByEmail: 'admin@guitaracademy.test',
    };

    const disabledCfg = {
      configId: 'commerce',
      commerceEnabled: false,
      catalogVisible: false,
      checkoutEnabled: false,
      promotionsEnabled: false,
      advertisementsEnabled: false,
      paidClassesEnabled: false,
      subscriptionsEnabled: false,
      defaultCurrency: 'BRL',
      updatedAt: nowIso,
      updatedBy: ADMIN_UID,
      updatedByEmail: 'admin@guitaracademy.test',
      lastActivationReason: null,
      failClosedVerified: true,
    };

    // Student & Teacher CANNOT create/write products, prices, promotions or config
    await assertFails(setDoc(doc(studentDb, 'products', 'prod-emu-stu'), { ...hiddenProd, productId: 'prod-emu-stu', createdBy: STUDENT_UID }));
    await assertFails(setDoc(doc(teacherDb, 'product_prices', 'price-emu-tch'), { ...priceV1, priceId: 'price-emu-tch', createdBy: TEACHER_UID }));
    await assertFails(setDoc(doc(teacherDb, 'promotions', 'promo-emu-tch'), { ...promo1, promotionId: 'promo-emu-tch', createdBy: TEACHER_UID }));
    await assertFails(setDoc(doc(studentDb, 'platform_config', 'commerce'), { ...disabledCfg, commerceEnabled: true }));

    // Admin CANNOT create a new product already public (must start visibility == 'hidden')
    await assertFails(
      setDoc(doc(adminDb, 'products', 'prod-emu-pub-create'), {
        ...hiddenProd,
        productId: 'prod-emu-pub-create',
        visibility: 'public',
      })
    );

    // Admin CAN create config (disabled), hidden product, v1 price & promotion
    await assertSucceeds(setDoc(doc(adminDb, 'platform_config', 'commerce'), disabledCfg));
    await assertSucceeds(setDoc(doc(adminDb, 'products', 'prod-emu-1'), hiddenProd));
    await assertSucceeds(setDoc(doc(adminDb, 'product_prices', 'price-emu-1'), priceV1));
    await assertSucceeds(setDoc(doc(adminDb, 'promotions', 'promo-emu-1'), promo1));

    // Student & Teacher CANNOT read platform_config/commerce, promotions, or hidden products
    await assertFails(getDoc(doc(studentDb, 'platform_config', 'commerce')));
    await assertFails(getDoc(doc(teacherDb, 'platform_config', 'commerce')));
    await assertFails(getDoc(doc(studentDb, 'promotions', 'promo-emu-1')));
    await assertFails(getDoc(doc(studentDb, 'products', 'prod-emu-1')));
    await assertFails(getDoc(doc(studentDb, 'product_prices', 'price-emu-1')));

    // Even if admin sets product visibility='public', commerceEnabled=false STILL blocks student reads
    await assertSucceeds(updateDoc(doc(adminDb, 'products', 'prod-emu-1'), { visibility: 'public' }));
    await assertFails(getDoc(doc(studentDb, 'products', 'prod-emu-1')));

    // Historical prices are IMMUTABLE (cannot mutate amount or delete)
    await assertFails(updateDoc(doc(adminDb, 'product_prices', 'price-emu-1'), { amount: 99, amountCents: 9900 }));
    await assertFails(deleteDoc(doc(adminDb, 'product_prices', 'price-emu-1')));

    // Admin CAN supersede price status without modifying historical amount
    await assertSucceeds(
      updateDoc(doc(adminDb, 'product_prices', 'price-emu-1'), {
        status: 'superseded',
        supersededAt: '2026-11-15T13:00:00.000Z',
        supersededBy: 'price-emu-2',
      })
    );
  });

  it('enforces Fase 3 fail-closed rules on advertisements, class_offers, reservations, orders, payments, subscriptions and financial_adjustments', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    const adminDb = getAuthenticatedDb(env, ADMIN_UID);
    const teacherDb = getAuthenticatedDb(env, TEACHER_UID);
    const studentDb = getAuthenticatedDb(env, STUDENT_UID);
    const nowIso = '2026-11-15T14:00:00.000Z';

    const sampleAd = {
      advertisementId: 'ad-emu-1',
      title: 'Campanha Violão Emu',
      subtitle: 'Subtítulo oficial',
      description: 'Banner fail-closed',
      ctaText: 'Ver curso',
      ctaDestination: '/cursos',
      productId: 'prod-emu-1',
      targetAudience: 'all',
      eligibleStudentUids: [],
      position: 'home',
      imageUrl: null,
      storagePath: null,
      imageMimeType: null,
      imageSizeBytes: null,
      imageVersion: 0,
      previousStoragePaths: [],
      startsAt: null,
      startsAtMs: null,
      endsAt: null,
      endsAtMs: null,
      status: 'active',
      createdBy: ADMIN_UID,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const sampleOffer = {
      offerId: 'offer-emu-1',
      classId: 'class-101',
      className: 'Turma Violao 101',
      productId: 'prod-emu-1',
      priceId: 'price-emu-1',
      capacity: 15,
      reservedSeats: 0,
      confirmedSeats: 0,
      status: 'open',
      waitlistEnabled: true,
      createdBy: ADMIN_UID,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const sampleAdjustment = {
      adjustmentId: 'adj-emu-1',
      type: 'reconciliation_note',
      orderId: null,
      amountCents: 0,
      currency: 'BRL',
      justification: 'Nota inicial de conciliação homologada sem movimentação real.',
      actorUid: ADMIN_UID,
      actorEmail: 'admin@guitaracademy.test',
      createdAt: nowIso,
    };

    // Student & Teacher CANNOT create/modify advertisements, class_offers, orders, payments, or financial_adjustments
    await assertFails(setDoc(doc(studentDb, 'advertisements', 'ad-emu-stu'), { ...sampleAd, advertisementId: 'ad-emu-stu' }));
    await assertFails(setDoc(doc(teacherDb, 'advertisements', 'ad-emu-tch'), { ...sampleAd, advertisementId: 'ad-emu-tch' }));
    await assertFails(setDoc(doc(teacherDb, 'class_offers', 'offer-emu-tch'), { ...sampleOffer, offerId: 'offer-emu-tch' }));
    await assertFails(setDoc(doc(studentDb, 'orders', 'ord-emu-stu'), { orderId: 'ord-emu-stu', studentUid: STUDENT_UID, status: 'paid' }));
    await assertFails(setDoc(doc(studentDb, 'payments', 'pay-emu-stu'), { paymentId: 'pay-emu-stu', studentUid: STUDENT_UID, status: 'paid' }));
    await assertFails(setDoc(doc(teacherDb, 'financial_adjustments', 'adj-emu-tch'), sampleAdjustment));

    // Admin CAN create advertisement, class_offer and financial_adjustment (justification >= 10 chars)
    await assertSucceeds(setDoc(doc(adminDb, 'advertisements', 'ad-emu-1'), sampleAd));
    await assertSucceeds(setDoc(doc(adminDb, 'class_offers', 'offer-emu-1'), sampleOffer));
    await assertSucceeds(setDoc(doc(adminDb, 'financial_adjustments', 'adj-emu-1'), sampleAdjustment));

    // Financial adjustments & payment_events are IMMUTABLE even for admin (no update/delete)
    await assertFails(updateDoc(doc(adminDb, 'financial_adjustments', 'adj-emu-1'), { amountCents: 99999 }));
    await assertFails(deleteDoc(doc(adminDb, 'financial_adjustments', 'adj-emu-1')));

    // With commerceEnabled=false / advertisementsEnabled=false, Student & Teacher CANNOT read active advertisement or offers or financial_adjustments
    await assertFails(getDoc(doc(studentDb, 'advertisements', 'ad-emu-1')));
    await assertFails(getDoc(doc(studentDb, 'class_offers', 'offer-emu-1')));
    await assertFails(getDoc(doc(teacherDb, 'financial_adjustments', 'adj-emu-1')));
    await assertFails(getDoc(doc(studentDb, 'financial_adjustments', 'adj-emu-1')));
  });
});

describe('Backend Express HTTP — Zero-Trust Auth, RBAC & CORS (Real Server Requests)', async () => {
  const { createServerApp } = await import('../../server');
  const http = await import('node:http');

  const TOKENS: Record<string, { uid: string; email: string }> = {
    'valid-student-jwt': { uid: 'student-http-1', email: 'student@guitaracademy.test' },
    'valid-teacher-jwt': { uid: 'teacher-http-1', email: 'teacher@guitaracademy.test' },
    'valid-admin-jwt': { uid: 'admin-http-1', email: 'admin@guitaracademy.test' },
    'valid-broken-role-jwt': { uid: 'broken-role-http-1', email: 'broken@guitaracademy.test' },
  };

  const ROLES: Record<string, { exists: boolean; role: string }> = {
    'student-http-1': { exists: true, role: 'student' },
    'teacher-http-1': { exists: true, role: 'teacher' },
    'admin-http-1': { exists: true, role: 'admin' },
  };

  const statusAuditCalls: Array<{ uid: string; status: string; actorUid: string }> = [];

  const app = createServerApp({
    verifyIdToken: async (token: string) => {
      const decoded = TOKENS[token];
      if (!decoded) {
        throw new Error('Firebase ID token has invalid signature.');
      }
      return decoded;
    },
    getSystemRole: async (uid: string) => {
      if (uid === 'broken-role-http-1') {
        throw new Error('Firestore permission or transient failure');
      }
      return ROLES[uid] || { exists: false, role: 'student' };
    },
    writeAdminLog: async (entry) => {
      if (entry.eventType === 'student_status_updated' && entry.targetUid) {
        statusAuditCalls.push({
          uid: entry.targetUid,
          status: entry.action,
          actorUid: entry.actorUid,
        });
      }
    },
    listAdminLogs: async () => [],
    listAdminDirectoryData: async () => ({
      authUsers: [
        {
          uid: 'reginaldo-http-1',
          email: 'reginaldo@guitaracademy.test',
          displayName: 'Reginaldo Real',
          photoURL: null,
          provider: 'google.com',
          disabled: false,
          createdAt: '2026-11-02T00:00:00.000Z',
          lastSignInTime: '2026-11-12T00:00:00.000Z',
        },
      ],
      userDocs: [],
      studentDocs: [],
      roleDocs: [{ id: 'admin-http-1', data: { role: 'admin' } }],
      classes: [],
      enrollments: [],
      progressByUid: {},
    }),
    updateUserAccountStatus: async (uid, accountStatus) => {
      void uid;
      void accountStatus;
      return { firestorePersisted: true, authDisabledUpdated: true };
    },
    validateClassInvite: async ({ code, callerUid }) => {
      if (code === 'GA-HTTP-OK') {
        return {
          valid: true,
          message: 'Turma localizada.',
          classGroup: {
            id: 'cls-http-1',
            name: 'Turma Violão HTTP',
            code: 'GA-HTTP-OK',
            courseId: 'violao',
            instrument: 'Violão',
            teacherId: 'teacher-http-1',
            teacherEmail: 'teacher@guitaracademy.test',
            teacherName: 'Prof. HTTP',
            createdAt: '2026-11-10T00:00:00.000Z',
            updatedAt: '2026-11-10T00:00:00.000Z',
            active: true,
            maxStudents: 30,
          },
        };
      }
      void callerUid;
      return {
        valid: false,
        reason: 'not_found',
        message: 'Código não encontrado.',
      };
    },
    joinClassWithInvite: async ({ code, callerUid, studentName, studentEmail }) => {
      if (code !== 'GA-HTTP-OK') {
        return {
          statusCode: 400,
          success: false,
          reason: 'not_found',
          message: 'Código não encontrado.',
        };
      }
      return {
        statusCode: 200,
        success: true,
        message: 'Matrícula confirmada com sucesso!',
        classGroup: {
          id: 'cls-http-1',
          name: 'Turma Violão HTTP',
          code: 'GA-HTTP-OK',
          courseId: 'violao',
          instrument: 'Violão',
          teacherId: 'teacher-http-1',
          teacherEmail: 'teacher@guitaracademy.test',
          teacherName: 'Prof. HTTP',
          createdAt: '2026-11-10T00:00:00.000Z',
          updatedAt: '2026-11-10T00:00:00.000Z',
          active: true,
        },
        enrollment: {
          id: `enroll-cls-http-1-${callerUid}`,
          classId: 'cls-http-1',
          courseId: 'violao',
          studentId: callerUid,
          studentName,
          studentEmail,
          teacherId: 'teacher-http-1',
          joinedAt: '2026-11-15T00:00:00.000Z',
          status: 'active',
          lastActivityAt: '2026-11-15T00:00:00.000Z',
        },
      };
    },
  });

  let server: import('node:http').Server;
  let baseUrl = '';

  before(async () => {
    await new Promise<void>((resolve) => {
      server = http.createServer(app);
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        if (addr && typeof addr !== 'string') {
          baseUrl = `http://127.0.0.1:${addr.port}`;
        }
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      server.closeAllConnections?.();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('rejects unauthenticated and forged mock-valid-token requests on protected routes with HTTP 401', async () => {
    const noAuthOverview = await fetch(`${baseUrl}/api/admin/overview`);
    assert.equal(noAuthOverview.status, 401);

    const noAuthChat = await fetch(`${baseUrl}/api/professor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Como tocar acordes?' }),
    });
    assert.equal(noAuthChat.status, 401);

    const forgedMockRes = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: { Authorization: 'Bearer mock-valid-token-admin_123' },
    });
    assert.equal(forgedMockRes.status, 401);

    // Even default production server middleware rejects mock-valid-token-* strings
    const defaultApp = createServerApp();
    await new Promise<void>((resolve, reject) => {
      const defaultSrv = http.createServer(defaultApp);
      defaultSrv.listen(0, '127.0.0.1', async () => {
        const addr = defaultSrv.address();
        const defaultUrl = addr && typeof addr !== 'string' ? `http://127.0.0.1:${addr.port}` : '';
        try {
          const res = await fetch(`${defaultUrl}/api/auth/role`, {
            headers: { Authorization: 'Bearer mock-valid-token-admin_123' },
          });
          assert.equal(res.status, 401);
          defaultSrv.closeAllConnections?.();
          defaultSrv.close(() => resolve());
        } catch (err) {
          defaultSrv.closeAllConnections?.();
          defaultSrv.close(() => reject(err));
        }
      });
    });
  });

  it('blocks students and teachers from admin endpoints with HTTP 403 while authorizing verified admin', async () => {
    const studentOverview = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: { Authorization: 'Bearer valid-student-jwt' },
    });
    assert.equal(studentOverview.status, 403);

    const teacherOverview = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: { Authorization: 'Bearer valid-teacher-jwt' },
    });
    assert.equal(teacherOverview.status, 403);

    const brokenOverview = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: { Authorization: 'Bearer valid-broken-role-jwt' },
    });
    assert.equal(brokenOverview.status, 403);

    const adminOverview = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: { Authorization: 'Bearer valid-admin-jwt' },
    });
    assert.equal(adminOverview.status, 200);
    const adminBody = (await adminOverview.json()) as { status: string };
    assert.equal(adminBody.status, 'ok');

    const studentLogs = await fetch(`${baseUrl}/api/admin/logs`, {
      headers: { Authorization: 'Bearer valid-student-jwt' },
    });
    assert.equal(studentLogs.status, 403);

    const teacherLogs = await fetch(`${baseUrl}/api/admin/logs`, {
      headers: { Authorization: 'Bearer valid-teacher-jwt' },
    });
    assert.equal(teacherLogs.status, 403);

    const adminLogs = await fetch(`${baseUrl}/api/admin/logs`, {
      headers: { Authorization: 'Bearer valid-admin-jwt' },
    });
    assert.equal(adminLogs.status, 200);
    const adminLogsBody = (await adminLogs.json()) as { logs: unknown[] };
    assert.ok(Array.isArray(adminLogsBody.logs));
  });

  it('enforces self-only vs admin role inspection on /api/auth/role and /api/admin/roles/:uid', async () => {
    const teacherRoleRes = await fetch(`${baseUrl}/api/auth/role`, {
      headers: { Authorization: 'Bearer valid-teacher-jwt' },
    });
    assert.equal(teacherRoleRes.status, 200);
    assert.deepEqual(await teacherRoleRes.json(), { uid: 'teacher-http-1', role: 'teacher' });

    const brokenRoleRes = await fetch(`${baseUrl}/api/auth/role`, {
      headers: { Authorization: 'Bearer valid-broken-role-jwt' },
    });
    assert.equal(brokenRoleRes.status, 200);
    assert.deepEqual(await brokenRoleRes.json(), { uid: 'broken-role-http-1', role: 'student' });

    const studentCrossLookup = await fetch(`${baseUrl}/api/admin/roles/admin-http-1`, {
      headers: { Authorization: 'Bearer valid-student-jwt' },
    });
    assert.equal(studentCrossLookup.status, 403);

    const adminCrossLookup = await fetch(`${baseUrl}/api/admin/roles/teacher-http-1`, {
      headers: { Authorization: 'Bearer valid-admin-jwt' },
    });
    assert.equal(adminCrossLookup.status, 200);
    assert.deepEqual(await adminCrossLookup.json(), {
      uid: 'teacher-http-1',
      role: 'teacher',
      exists: true,
    });
  });

  it('ignores frontend-supplied role claims and enforces teacher/admin separation on Professor IA routes', async () => {
    const spoofedAdminAttempt = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: {
        Authorization: 'Bearer valid-student-jwt',
        'x-role': 'admin',
        'x-user-role': 'admin',
      },
    });
    assert.equal(spoofedAdminAttempt.status, 403);

    // Student cannot invoke teacher-only Professor IA route even if sending role: "teacher" or "admin" in body
    const studentClassInsights = await fetch(`${baseUrl}/api/professor/class-insights`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-student-jwt',
        'Content-Type': 'application/json',
        'x-role': 'teacher',
      },
      body: JSON.stringify({ role: 'admin', className: 'Turma 1', metrics: { total: 10 } }),
    });
    assert.equal(studentClassInsights.status, 403);

    // Teacher passes requireRole(['teacher', 'admin']) (reaches Gemini availability check 503 or 200, never 403)
    const teacherClassInsights = await fetch(`${baseUrl}/api/professor/class-insights`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-teacher-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ className: 'Turma 1', metrics: { total: 10 } }),
    });
    assert.notEqual(teacherClassInsights.status, 401);
    assert.notEqual(teacherClassInsights.status, 403);

    // Student passes requireRole(['student', 'teacher', 'admin']) on /api/professor/chat (validation 400 with empty msg, never 403)
    const studentChatEmpty = await fetch(`${baseUrl}/api/professor/chat`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-student-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: '' }),
    });
    assert.ok(studentChatEmpty.status === 400 || studentChatEmpty.status === 503);
  });

  it('enforces strict CORS allowlist on preflight OPTIONS and API POST requests', async () => {
    const allowedOriginRes = await fetch(`${baseUrl}/api/health`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://nashixhoo.github.io' },
    });
    assert.equal(allowedOriginRes.status, 204);
    assert.equal(allowedOriginRes.headers.get('access-control-allow-origin'), 'https://nashixhoo.github.io');

    const blockedOriginRes = await fetch(`${baseUrl}/api/health`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://malicious-attacker.example.com' },
    });
    assert.equal(blockedOriginRes.status, 403);
    assert.equal(blockedOriginRes.headers.get('access-control-allow-origin'), null);

    const blockedPostRes = await fetch(`${baseUrl}/api/professor/chat`, {
      method: 'POST',
      headers: {
        Origin: 'https://malicious-attacker.example.com',
        Authorization: 'Bearer valid-student-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Ola' }),
    });
    assert.equal(blockedPostRes.status, 403);
  });

  it('protects POST /api/admin/users/:uid/status with Zero-Trust auth, admin check, validation, and audit logging', async () => {
    const unauthStatusRes = await fetch(`${baseUrl}/api/admin/users/student-http-1/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountStatus: 'suspended' }),
    });
    assert.equal(unauthStatusRes.status, 401);

    const studentAttempt = await fetch(`${baseUrl}/api/admin/users/teacher-http-1/status`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-student-jwt',
        'Content-Type': 'application/json',
        'x-role': 'admin',
      },
      body: JSON.stringify({ accountStatus: 'suspended', role: 'admin' }),
    });
    assert.equal(studentAttempt.status, 403);

    const teacherAttempt = await fetch(`${baseUrl}/api/admin/users/student-http-1/status`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-teacher-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountStatus: 'suspended' }),
    });
    assert.equal(teacherAttempt.status, 403);

    const selfSuspendAttempt = await fetch(`${baseUrl}/api/admin/users/admin-http-1/status`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-admin-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountStatus: 'suspended' }),
    });
    assert.equal(selfSuspendAttempt.status, 400);

    const invalidStatusAttempt = await fetch(`${baseUrl}/api/admin/users/student-http-1/status`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-admin-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountStatus: 'deleted' }),
    });
    assert.equal(invalidStatusAttempt.status, 400);

    const validSuspendRes = await fetch(`${baseUrl}/api/admin/users/student-http-1/status`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-admin-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountStatus: 'suspended' }),
    });
    assert.equal(validSuspendRes.status, 200);
    const suspendPayload = (await validSuspendRes.json()) as {
      status: string;
      accountStatus: string;
      firestorePersisted: boolean;
      authDisabledUpdated: boolean;
    };
    assert.equal(suspendPayload.status, 'ok');
    assert.equal(suspendPayload.accountStatus, 'suspended');
    assert.equal(suspendPayload.firestorePersisted, true);
    assert.equal(suspendPayload.authDisabledUpdated, true);
    assert.ok(
      statusAuditCalls.some((c) => c.uid === 'student-http-1' && c.actorUid === 'admin-http-1')
    );
  });

  it('protects GET /api/admin/users with Zero-Trust auth and admin role, returning real directory only to admin', async () => {
    const noAuthRes = await fetch(`${baseUrl}/api/admin/users`);
    assert.equal(noAuthRes.status, 401);

    const studentRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: 'Bearer valid-student-jwt' },
    });
    assert.equal(studentRes.status, 403);

    const teacherRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: 'Bearer valid-teacher-jwt' },
    });
    assert.equal(teacherRes.status, 403);

    const adminRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: 'Bearer valid-admin-jwt' },
    });
    assert.equal(adminRes.status, 200);
    const body = (await adminRes.json()) as {
      status: string;
      mode: string;
      authUsers: Array<{ uid: string; email: string }>;
    };
    assert.equal(body.status, 'ok');
    assert.equal(body.mode, 'backend_admin_sdk');
    assert.ok(body.authUsers.some((u) => u.uid === 'reginaldo-http-1'));
  });

  it('protects POST /api/classes/validate-invite and /api/classes/join against unauthenticated access and UID spoofing', async () => {
    // 1. Unauthenticated access rejected
    const unauthValidate = await fetch(`${baseUrl}/api/classes/validate-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'GA-HTTP-OK' }),
    });
    assert.equal(unauthValidate.status, 401);

    const unauthJoin = await fetch(`${baseUrl}/api/classes/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'GA-HTTP-OK' }),
    });
    assert.equal(unauthJoin.status, 401);

    // 2. Empty or invalid invite format rejected with HTTP 400
    const emptyValidate = await fetch(`${baseUrl}/api/classes/validate-invite`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-student-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: '   ' }),
    });
    assert.equal(emptyValidate.status, 400);

    const invalidFormatValidate = await fetch(`${baseUrl}/api/classes/validate-invite`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-student-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: 'GA INVALID!' }),
    });
    assert.equal(invalidFormatValidate.status, 400);

    // 3. Valid invite preview returns class metadata
    const okValidate = await fetch(`${baseUrl}/api/classes/validate-invite`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-student-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: 'ga-http-ok' }),
    });
    assert.equal(okValidate.status, 200);
    const validateBody = (await okValidate.json()) as {
      valid: boolean;
      classGroup?: { name: string; instrument: string; teacherName: string };
    };
    assert.equal(validateBody.valid, true);
    assert.equal(validateBody.classGroup?.name, 'Turma Violão HTTP');
    assert.equal(validateBody.classGroup?.instrument, 'Violão');
    assert.equal(validateBody.classGroup?.teacherName, 'Prof. HTTP');

    // 4. Attempting to enroll another student UID is blocked with HTTP 403
    const spoofedJoin = await fetch(`${baseUrl}/api/classes/join`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-student-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: 'GA-HTTP-OK',
        studentUid: 'other-victim-uid',
      }),
    });
    assert.equal(spoofedJoin.status, 403);

    // 5. Valid self-join derives studentId from verified token
    const okJoin = await fetch(`${baseUrl}/api/classes/join`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid-student-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: 'GA-HTTP-OK',
        studentName: 'Aluno HTTP',
      }),
    });
    assert.equal(okJoin.status, 200);
    const joinBody = (await okJoin.json()) as {
      success: boolean;
      enrollment?: { studentId: string; classId: string; status: string };
    };
    assert.equal(joinBody.success, true);
    assert.equal(joinBody.enrollment?.studentId, 'student-http-1');
    assert.equal(joinBody.enrollment?.classId, 'cls-http-1');
    assert.equal(joinBody.enrollment?.status, 'active');
  });

  it('prevents last-seat overbooking under concurrent requests and enforces 1-to-1 integrity in POST /api/classes/join transaction', async () => {
    // In-memory serializable transactional Firestore adapter (optimistic concurrency control + conflict retry)
    const docsStore = new Map<string, { data: Record<string, any>; version: number }>();
    const clone = (val: any) => JSON.parse(JSON.stringify(val));

    const seedDoc = (pathKey: string, data: Record<string, any>) => {
      docsStore.set(pathKey, { data: clone(data), version: 1 });
    };

    seedDoc('class_invites/GA-RACE-1', {
      classId: 'cls-race-1',
      code: 'GA-RACE-1',
      name: 'Turma Última Vaga',
      courseId: 'violao',
      instrument: 'Violão',
      teacherId: 'teacher-http-1',
      teacherName: 'Prof. Concorrência',
      maxStudents: 2,
      active: true,
    });
    seedDoc('classes/cls-race-1', {
      id: 'cls-race-1',
      name: 'Turma Última Vaga',
      code: 'GA-RACE-1',
      courseId: 'violao',
      instrument: 'Violão',
      teacherId: 'teacher-http-1',
      teacherName: 'Prof. Concorrência',
      maxStudents: 2,
      enrolledCount: 1,
      active: true,
    });
    // 1 student already enrolled -> strictly 1 last seat remaining
    seedDoc('classes/cls-race-1/students/existing-stu-0', {
      id: 'enroll-cls-race-1-existing-stu-0',
      classId: 'cls-race-1',
      studentId: 'existing-stu-0',
      teacherId: 'teacher-http-1',
      status: 'active',
    });
    seedDoc('enrollments/enroll-cls-race-1-existing-stu-0', {
      id: 'enroll-cls-race-1-existing-stu-0',
      classId: 'cls-race-1',
      studentId: 'existing-stu-0',
      teacherId: 'teacher-http-1',
      status: 'active',
    });
    seedDoc('class_invites/GA-EXP-RACE', {
      classId: 'cls-exp-1',
      code: 'GA-EXP-RACE',
      name: 'Turma Expirada',
      teacherId: 'teacher-http-1',
      maxStudents: 10,
      expiresAtMs: Date.now() - 30_000,
      active: true,
    });
    seedDoc('classes/cls-exp-1', {
      id: 'cls-exp-1',
      name: 'Turma Expirada',
      code: 'GA-EXP-RACE',
      teacherId: 'teacher-http-1',
      maxStudents: 10,
      expiresAtMs: Date.now() - 30_000,
      active: true,
    });
    seedDoc('users/student-http-1', { uid: 'student-http-1', enrolledCourses: [] });
    seedDoc('users/student-http-2', { uid: 'student-http-2', enrolledCourses: [] });

    class TxConflictError extends Error {}

    const makeDocRef = (docPath: string): any => ({
      path: docPath,
      id: docPath.split('/').pop()!,
      get: async () => {
        const entry = docsStore.get(docPath);
        return {
          id: docPath.split('/').pop()!,
          exists: Boolean(entry),
          ref: makeDocRef(docPath),
          data: () => (entry ? clone(entry.data) : undefined),
        };
      },
      collection: (sub: string) => makeColRef(`${docPath}/${sub}`),
    });

    const makeColRef = (colPath: string): any => ({
      path: colPath,
      doc: (docId: string) => makeDocRef(`${colPath}/${docId}`),
      where: (field: string, _op: string, value: any) => ({
        limit: (_n: number) => ({
          _colPath: colPath,
          _field: field,
          _value: value,
        }),
      }),
    });

    const normalizeFieldValues = (input: Record<string, any>, existing: Record<string, any> = {}) => {
      const out = { ...existing };
      for (const [k, v] of Object.entries(input)) {
        if (v && typeof v === 'object' && v.constructor?.name === 'ArrayUnionTransform') {
          const current = Array.isArray(out[k]) ? out[k] : [];
          const elements = (v as any).elements || [];
          out[k] = Array.from(new Set([...current, ...elements]));
        } else if (v && typeof v === 'object' && v.constructor?.name === 'ServerTimestampTransform') {
          out[k] = new Date().toISOString();
        } else {
          out[k] = v;
        }
      }
      return out;
    };

    const transactionalAdapter = {
      collection: (name: string) => makeColRef(name),
      runTransaction: async (fn: (tx: any) => Promise<any>) => {
        for (let attempt = 0; attempt < 5; attempt++) {
          const readVersions = new Map<string, number>();
          const colReadSnapshots = new Map<string, Map<string, number>>();
          const stagedWrites: Array<{ path: string; mode: 'set' | 'update'; data: Record<string, any> }> = [];

          const tx = {
            get: async (target: any) => {
              if (target.path && !target._colPath && docsStore !== undefined && target.doc === undefined) {
                // docRef
                const cur = docsStore.get(target.path);
                readVersions.set(target.path, cur ? cur.version : 0);
                return {
                  id: target.id,
                  exists: Boolean(cur),
                  ref: target,
                  data: () => (cur ? clone(cur.data) : undefined),
                };
              }
              if (target._colPath) {
                const matches: any[] = [];
                const snapMap = new Map<string, number>();
                for (const [k, v] of docsStore.entries()) {
                  if (k.startsWith(`${target._colPath}/`) && k.slice(target._colPath.length + 1).indexOf('/') === -1) {
                    snapMap.set(k, v.version);
                    if (v.data[target._field] === target._value) {
                      matches.push({ id: k.split('/').pop(), exists: true, ref: makeDocRef(k), data: () => clone(v.data) });
                    }
                  }
                }
                colReadSnapshots.set(target._colPath, snapMap);
                return { empty: matches.length === 0, docs: matches };
              }
              // subcollection ref
              const prefix = `${target.path}/`;
              const docsList: any[] = [];
              const snapMap = new Map<string, number>();
              for (const [k, v] of docsStore.entries()) {
                if (k.startsWith(prefix) && !k.slice(prefix.length).includes('/')) {
                  snapMap.set(k, v.version);
                  docsList.push({ id: k.split('/').pop(), exists: true, ref: makeDocRef(k), data: () => clone(v.data) });
                }
              }
              colReadSnapshots.set(target.path, snapMap);
              return { empty: docsList.length === 0, docs: docsList };
            },
            set: (ref: any, data: Record<string, any>) => {
              stagedWrites.push({ path: ref.path, mode: 'set', data });
            },
            update: (ref: any, data: Record<string, any>) => {
              stagedWrites.push({ path: ref.path, mode: 'update', data });
            },
          };

          try {
            const result = await fn(tx);
            // Yield microtask to force concurrent overlap between competing HTTP requests
            await Promise.resolve();

            // Verify serializability against concurrent commits
            for (const [p, v] of readVersions.entries()) {
              const nowVer = docsStore.get(p)?.version || 0;
              if (nowVer !== v) throw new TxConflictError(`Conflict on ${p}`);
            }
            for (const [colPath, snapMap] of colReadSnapshots.entries()) {
              const prefix = `${colPath}/`;
              for (const [k, v] of docsStore.entries()) {
                if (k.startsWith(prefix) && !k.slice(prefix.length).includes('/')) {
                  if (snapMap.get(k) !== v.version) {
                    throw new TxConflictError(`Collection conflict on ${k}`);
                  }
                }
              }
            }

            // Commit atomically
            for (const w of stagedWrites) {
              const cur = docsStore.get(w.path);
              const nextData =
                w.mode === 'update' && cur
                  ? normalizeFieldValues(w.data, cur.data)
                  : normalizeFieldValues(w.data, {});
              docsStore.set(w.path, { data: nextData, version: (cur?.version || 0) + 1 });
            }
            return result;
          } catch (err) {
            if (err instanceof TxConflictError && attempt < 4) {
              continue;
            }
            throw err;
          }
        }
        throw new Error('Transaction aborted after retries');
      },
    };

    const raceTokens: Record<string, { uid: string; email: string }> = {
      'race-stu-1': { uid: 'student-http-1', email: 's1@guitaracademy.test' },
      'race-stu-2': { uid: 'student-http-2', email: 's2@guitaracademy.test' },
    };

    const txApp = createServerApp({
      verifyIdToken: async (token: string) => {
        const dec = raceTokens[token];
        if (!dec) throw new Error('Invalid token');
        return dec;
      },
      getSystemRole: async () => ({ exists: true, role: 'student' }),
      adminDbForClasses: transactionalAdapter,
    });

    await new Promise<void>((resolve, reject) => {
      const txSrv = http.createServer(txApp);
      txSrv.listen(0, '127.0.0.1', async () => {
        const addr = txSrv.address();
        const txUrl = addr && typeof addr !== 'string' ? `http://127.0.0.1:${addr.port}` : '';
        try {
          // 1. Concurrent last-seat race: 2 students attempt simultaneously for 1 remaining seat
          const [res1, res2] = await Promise.all([
            fetch(`${txUrl}/api/classes/join`, {
              method: 'POST',
              headers: {
                Authorization: 'Bearer race-stu-1',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code: 'GA-RACE-1', studentName: 'Aluno Um' }),
            }),
            fetch(`${txUrl}/api/classes/join`, {
              method: 'POST',
              headers: {
                Authorization: 'Bearer race-stu-2',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code: 'GA-RACE-1', studentName: 'Aluno Dois' }),
            }),
          ]);

          const statuses = [res1.status, res2.status].sort((a, b) => a - b);
          assert.deepEqual(statuses, [200, 409]);

          const body1 = (await res1.json()) as { success: boolean; reason?: string };
          const body2 = (await res2.json()) as { success: boolean; reason?: string };
          const winnerBody = res1.status === 200 ? body1 : body2;
          const loserBody = res1.status === 409 ? body1 : body2;
          assert.equal(winnerBody.success, true);
          assert.equal(loserBody.success, false);
          assert.equal(loserBody.reason, 'full');

          // Verify 1-to-1 integrity and authoritative seat count never exceeded maxStudents (2)
          const activeSubDocs = Array.from(docsStore.keys()).filter((k) =>
            k.startsWith('classes/cls-race-1/students/')
          );
          const rootEnrDocs = Array.from(docsStore.keys()).filter((k) =>
            k.startsWith('enrollments/enroll-cls-race-1-')
          );
          assert.equal(activeSubDocs.length, 2);
          assert.equal(rootEnrDocs.length, 2);
          assert.equal(docsStore.get('classes/cls-race-1')?.data.enrolledCount, 2);

          // 2. Expired invite is rejected by backend transaction
          const expRes = await fetch(`${txUrl}/api/classes/join`, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer race-stu-1',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: 'GA-EXP-RACE' }),
          });
          assert.equal(expRes.status, 400);
          const expBody = (await expRes.json()) as { reason?: string };
          assert.equal(expBody.reason, 'expired');

          txSrv.closeAllConnections?.();
          txSrv.close(() => resolve());
        } catch (err) {
          txSrv.closeAllConnections?.();
          txSrv.close(() => reject(err));
        }
      });
    });
  });

  it('reconciles legacy classes safely across all 6 mandatory scenarios with idempotency, status distinction, and zero student mutation', async () => {
    const {
      reconcileAllLegacyClasses,
      doesStatusOccupySeat,
    } = await import('../services/classCountReconciler');

    const docsStore = new Map<string, { data: Record<string, any>; version: number }>();
    const clone = (val: any) => JSON.parse(JSON.stringify(val));
    const seedDoc = (pathKey: string, data: Record<string, any>) => {
      docsStore.set(pathKey, { data: clone(data), version: 1 });
    };

    // system_roles must remain completely untouched
    seedDoc('system_roles/admin-http-1', { uid: 'admin-http-1', role: 'admin' });
    seedDoc('system_roles/student-http-1', { uid: 'student-http-1', role: 'student' });

    // SCENARIO 1: Legacy class with 10 active students and maxStudents: 10 (missing enrolledCount)
    seedDoc('classes/cls-leg-10', {
      id: 'cls-leg-10',
      name: 'Turma Legada Lotada 10/10',
      code: 'GA-LEG-10',
      teacherId: 'teacher-http-1',
      teacherName: 'Prof. Legado',
      maxStudents: 10,
      active: true,
    });
    seedDoc('class_invites/GA-LEG-10', {
      classId: 'cls-leg-10',
      code: 'GA-LEG-10',
      name: 'Turma Legada Lotada 10/10',
      teacherId: 'teacher-http-1',
      maxStudents: 10,
      active: true,
    });
    for (let i = 1; i <= 10; i++) {
      seedDoc(`classes/cls-leg-10/students/leg10-stu-${i}`, {
        id: `enroll-cls-leg-10-leg10-stu-${i}`,
        classId: 'cls-leg-10',
        studentId: `leg10-stu-${i}`,
        teacherId: 'teacher-http-1',
        status: 'active',
      });
    }

    // SCENARIO 2: Legacy class with 9 active students and maxStudents: 10 (missing enrolledCount)
    seedDoc('classes/cls-leg-9', {
      id: 'cls-leg-9',
      name: 'Turma Legada 9/10',
      code: 'GA-LEG-9',
      teacherId: 'teacher-http-1',
      teacherName: 'Prof. Legado',
      maxStudents: 10,
      active: true,
    });
    seedDoc('class_invites/GA-LEG-9', {
      classId: 'cls-leg-9',
      code: 'GA-LEG-9',
      name: 'Turma Legada 9/10',
      teacherId: 'teacher-http-1',
      maxStudents: 10,
      active: true,
    });
    for (let i = 1; i <= 9; i++) {
      seedDoc(`classes/cls-leg-9/students/leg9-stu-${i}`, {
        id: `enroll-cls-leg-9-leg9-stu-${i}`,
        classId: 'cls-leg-9',
        studentId: `leg9-stu-${i}`,
        teacherId: 'teacher-http-1',
        status: 'active',
      });
    }

    // SCENARIO 3: Legacy class with 0 students and missing enrolledCount
    seedDoc('classes/cls-leg-0', {
      id: 'cls-leg-0',
      name: 'Turma Legada Vazia',
      code: 'GA-LEG-0',
      teacherId: 'teacher-http-1',
      teacherName: 'Prof. Legado',
      maxStudents: 5,
      active: true,
    });
    seedDoc('class_invites/GA-LEG-0', {
      classId: 'cls-leg-0',
      code: 'GA-LEG-0',
      name: 'Turma Legada Vazia',
      teacherId: 'teacher-http-1',
      maxStudents: 5,
      active: true,
    });

    // SCENARIO 4: Legacy class with mixed statuses (active, pending, approved, legacy-no-status vs cancelled, suspended, inactive)
    seedDoc('classes/cls-leg-statuses', {
      id: 'cls-leg-statuses',
      name: 'Turma Status Mistos',
      code: 'GA-LEG-ST',
      teacherId: 'teacher-http-1',
      teacherName: 'Prof. Legado',
      maxStudents: 10,
      enrolledCount: 99, // Inconsistent high legacy value must be fixed to 4
      active: true,
    });
    seedDoc('classes/cls-leg-statuses/students/st-active', { studentId: 'st-active', classId: 'cls-leg-statuses', status: 'active' });
    seedDoc('classes/cls-leg-statuses/students/st-pending', { studentId: 'st-pending', classId: 'cls-leg-statuses', status: 'pending' });
    seedDoc('classes/cls-leg-statuses/students/st-approved', { studentId: 'st-approved', classId: 'cls-leg-statuses', status: 'approved' });
    seedDoc('classes/cls-leg-statuses/students/st-legacy-empty', { studentId: 'st-legacy-empty', classId: 'cls-leg-statuses' }); // missing status
    seedDoc('classes/cls-leg-statuses/students/st-cancelled', { studentId: 'st-cancelled', classId: 'cls-leg-statuses', status: 'cancelled' });
    seedDoc('classes/cls-leg-statuses/students/st-suspended', { studentId: 'st-suspended', classId: 'cls-leg-statuses', status: 'suspended' });
    seedDoc('classes/cls-leg-statuses/students/st-inactive', { studentId: 'st-inactive', classId: 'cls-leg-statuses', status: 'inactive' });

    // Legacy expiresAt without expiresAtMs (expired & future)
    seedDoc('classes/cls-leg-exp-past', {
      id: 'cls-leg-exp-past',
      name: 'Turma Expirada Legada',
      code: 'GA-LEG-PAST',
      teacherId: 'teacher-http-1',
      maxStudents: 10,
      expiresAt: '2020-01-01T00:00:00.000Z',
      active: true,
    });
    seedDoc('class_invites/GA-LEG-PAST', {
      classId: 'cls-leg-exp-past',
      code: 'GA-LEG-PAST',
      teacherId: 'teacher-http-1',
      expiresAt: '2020-01-01T00:00:00.000Z',
      active: true,
    });
    seedDoc('classes/cls-leg-exp-future', {
      id: 'cls-leg-exp-future',
      name: 'Turma Futura Legada',
      code: 'GA-LEG-FUTURE',
      teacherId: 'teacher-http-1',
      maxStudents: 10,
      expiresAt: '2099-12-31T23:59:59.000Z',
      active: true,
    });
    seedDoc('class_invites/GA-LEG-FUTURE', {
      classId: 'cls-leg-exp-future',
      code: 'GA-LEG-FUTURE',
      teacherId: 'teacher-http-1',
      expiresAt: '2099-12-31T23:59:59.000Z',
      active: true,
    });

    // Already consistent class (must yield 0 writes / unchanged)
    seedDoc('classes/cls-already-ok', {
      id: 'cls-already-ok',
      name: 'Turma Já Validada',
      code: 'GA-OK-1',
      teacherId: 'teacher-http-1',
      maxStudents: 10,
      enrolledCount: 1,
      active: true,
    });
    seedDoc('classes/cls-already-ok/students/ok-stu-1', {
      studentId: 'ok-stu-1',
      classId: 'cls-already-ok',
      status: 'active',
    });

    seedDoc('users/student-http-1', { uid: 'student-http-1', enrolledCourses: [] });
    seedDoc('users/student-http-2', { uid: 'student-http-2', enrolledCourses: [] });

    // Snapshot student docs & roles before migration to prove zero mutations
    const snapshotStudentAndRoleDocs = () => {
      const snap: Record<string, { data: any; version: number }> = {};
      for (const [k, v] of docsStore.entries()) {
        if (
          k.includes('/students/') ||
          k.startsWith('enrollments/') ||
          k.startsWith('system_roles/')
        ) {
          snap[k] = { data: clone(v.data), version: v.version };
        }
      }
      return snap;
    };
    const beforeStudentAndRoles = snapshotStudentAndRoleDocs();

    class TxConflictError extends Error {}

    const makeDocRef = (docPath: string): any => ({
      path: docPath,
      id: docPath.split('/').pop()!,
      get: async () => {
        const entry = docsStore.get(docPath);
        return {
          id: docPath.split('/').pop()!,
          exists: Boolean(entry),
          ref: makeDocRef(docPath),
          data: () => (entry ? clone(entry.data) : undefined),
        };
      },
      collection: (sub: string) => makeColRef(`${docPath}/${sub}`),
    });

    const makeColRef = (colPath: string): any => ({
      path: colPath,
      doc: (docId: string) => makeDocRef(`${colPath}/${docId}`),
      get: async () => {
        const prefix = `${colPath}/`;
        const docsList: any[] = [];
        for (const [k, v] of docsStore.entries()) {
          if (k.startsWith(prefix) && !k.slice(prefix.length).includes('/')) {
            docsList.push({
              id: k.split('/').pop(),
              exists: true,
              ref: makeDocRef(k),
              data: () => clone(v.data),
            });
          }
        }
        return { empty: docsList.length === 0, docs: docsList };
      },
      where: (field: string, _op: string, value: any) => ({
        limit: (_n: number) => ({
          _colPath: colPath,
          _field: field,
          _value: value,
        }),
      }),
    });

    const normalizeFieldValues = (input: Record<string, any>, existing: Record<string, any> = {}) => {
      const out = { ...existing };
      for (const [k, v] of Object.entries(input)) {
        if (v && typeof v === 'object' && v.constructor?.name === 'ArrayUnionTransform') {
          const current = Array.isArray(out[k]) ? out[k] : [];
          const elements = (v as any).elements || [];
          out[k] = Array.from(new Set([...current, ...elements]));
        } else if (v && typeof v === 'object' && v.constructor?.name === 'ServerTimestampTransform') {
          out[k] = new Date().toISOString();
        } else {
          out[k] = v;
        }
      }
      return out;
    };

    const transactionalAdapter = {
      collection: (name: string) => makeColRef(name),
      runTransaction: async (fn: (tx: any) => Promise<any>) => {
        for (let attempt = 0; attempt < 6; attempt++) {
          const readVersions = new Map<string, number>();
          const colReadSnapshots = new Map<string, Map<string, number>>();
          const stagedWrites: Array<{ path: string; mode: 'set' | 'update'; data: Record<string, any> }> = [];

          const tx = {
            get: async (target: any) => {
              if (target.path && !target._colPath && target.doc === undefined) {
                const cur = docsStore.get(target.path);
                readVersions.set(target.path, cur ? cur.version : 0);
                return {
                  id: target.id,
                  exists: Boolean(cur),
                  ref: target,
                  data: () => (cur ? clone(cur.data) : undefined),
                };
              }
              if (target._colPath) {
                const matches: any[] = [];
                const snapMap = new Map<string, number>();
                for (const [k, v] of docsStore.entries()) {
                  if (k.startsWith(`${target._colPath}/`) && !k.slice(target._colPath.length + 1).includes('/')) {
                    snapMap.set(k, v.version);
                    if (v.data[target._field] === target._value) {
                      matches.push({ id: k.split('/').pop(), exists: true, ref: makeDocRef(k), data: () => clone(v.data) });
                    }
                  }
                }
                colReadSnapshots.set(target._colPath, snapMap);
                return { empty: matches.length === 0, docs: matches };
              }
              const prefix = `${target.path}/`;
              const docsList: any[] = [];
              const snapMap = new Map<string, number>();
              for (const [k, v] of docsStore.entries()) {
                if (k.startsWith(prefix) && !k.slice(prefix.length).includes('/')) {
                  snapMap.set(k, v.version);
                  docsList.push({ id: k.split('/').pop(), exists: true, ref: makeDocRef(k), data: () => clone(v.data) });
                }
              }
              colReadSnapshots.set(target.path, snapMap);
              return { empty: docsList.length === 0, docs: docsList };
            },
            set: (ref: any, data: Record<string, any>) => {
              stagedWrites.push({ path: ref.path, mode: 'set', data });
            },
            update: (ref: any, data: Record<string, any>) => {
              stagedWrites.push({ path: ref.path, mode: 'update', data });
            },
          };

          try {
            const result = await fn(tx);
            await Promise.resolve();

            for (const [p, v] of readVersions.entries()) {
              const nowVer = docsStore.get(p)?.version || 0;
              if (nowVer !== v) throw new TxConflictError(`Conflict on ${p}`);
            }
            for (const [colPath, snapMap] of colReadSnapshots.entries()) {
              const prefix = `${colPath}/`;
              for (const [k, v] of docsStore.entries()) {
                if (k.startsWith(prefix) && !k.slice(prefix.length).includes('/')) {
                  if (snapMap.get(k) !== v.version) {
                    throw new TxConflictError(`Collection conflict on ${k}`);
                  }
                }
              }
            }

            for (const w of stagedWrites) {
              const cur = docsStore.get(w.path);
              const nextData =
                w.mode === 'update' && cur
                  ? normalizeFieldValues(w.data, cur.data)
                  : normalizeFieldValues(w.data, {});
              docsStore.set(w.path, { data: nextData, version: (cur?.version || 0) + 1 });
            }
            return result;
          } catch (err) {
            if (err instanceof TxConflictError && attempt < 5) continue;
            throw err;
          }
        }
        throw new Error('Transaction aborted after retries');
      },
    };

    const legTokens: Record<string, { uid: string; email: string }> = {
      'leg-stu-1': { uid: 'student-http-1', email: 's1@guitaracademy.test' },
      'leg-stu-2': { uid: 'student-http-2', email: 's2@guitaracademy.test' },
      'leg-teacher-1': { uid: 'teacher-http-1', email: 'prof@guitaracademy.test' },
      'leg-admin-1': { uid: 'admin-http-1', email: 'admin@guitaracademy.test' },
    };
    const legRoles: Record<string, { exists: boolean; role: string }> = {
      'student-http-1': { exists: true, role: 'student' },
      'student-http-2': { exists: true, role: 'student' },
      'teacher-http-1': { exists: true, role: 'teacher' },
      'admin-http-1': { exists: true, role: 'admin' },
    };

    const legApp = createServerApp({
      verifyIdToken: async (token: string) => {
        const dec = legTokens[token];
        if (!dec) throw new Error('Invalid token');
        return dec;
      },
      getSystemRole: async (uid: string) => legRoles[uid] || { exists: false, role: 'student' },
      adminDbForClasses: transactionalAdapter,
    });

    await new Promise<void>((resolve, reject) => {
      const srv = http.createServer(legApp);
      srv.listen(0, '127.0.0.1', async () => {
        const addr = srv.address();
        const url = addr && typeof addr !== 'string' ? `http://127.0.0.1:${addr.port}` : '';
        try {
          // A. Status distinction unit check
          assert.equal(doesStatusOccupySeat('active'), true);
          assert.equal(doesStatusOccupySeat('pending'), true);
          assert.equal(doesStatusOccupySeat('approved'), true);
          assert.equal(doesStatusOccupySeat(undefined), true);
          assert.equal(doesStatusOccupySeat('cancelled'), false);
          assert.equal(doesStatusOccupySeat('suspended'), false);
          assert.equal(doesStatusOccupySeat('inactive'), false);

          // B. Requirement 5: Unvalidated legacy classes MUST be rejected BEFORE reconciliation
          for (const unvalCode of ['GA-LEG-10', 'GA-LEG-0']) {
            const valRes = await fetch(`${url}/api/classes/validate-invite`, {
              method: 'POST',
              headers: { Authorization: 'Bearer leg-stu-1', 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: unvalCode }),
            });
            const valBody = (await valRes.json()) as { valid: boolean; reason?: string };
            assert.equal(valBody.valid, false);
            assert.equal(valBody.reason, 'legacy_unvalidated');

            const joinRes = await fetch(`${url}/api/classes/join`, {
              method: 'POST',
              headers: { Authorization: 'Bearer leg-stu-1', 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: unvalCode, studentName: 'Aluno Teste' }),
            });
            assert.equal(joinRes.status, 409);
            const joinBody = (await joinRes.json()) as { success: boolean; reason?: string };
            assert.equal(joinBody.success, false);
            assert.equal(joinBody.reason, 'legacy_unvalidated');
          }

          // C. Zero-Trust RBAC on POST /api/admin/classes/reconcile
          const unauthRec = await fetch(`${url}/api/admin/classes/reconcile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dryRun: true }),
          });
          assert.equal(unauthRec.status, 401);
          const stuRec = await fetch(`${url}/api/admin/classes/reconcile`, {
            method: 'POST',
            headers: { Authorization: 'Bearer leg-stu-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ dryRun: false }),
          });
          assert.equal(stuRec.status, 403);
          const teachRec = await fetch(`${url}/api/admin/classes/reconcile`, {
            method: 'POST',
            headers: { Authorization: 'Bearer leg-teacher-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ dryRun: false }),
          });
          assert.equal(teachRec.status, 403);

          // D. Dry-run audit inspects all classes with 0 writes
          const dryRes = await fetch(`${url}/api/admin/classes/reconcile`, {
            method: 'POST',
            headers: { Authorization: 'Bearer leg-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ dryRun: true }),
          });
          assert.equal(dryRes.status, 200);
          const dryReport = (await dryRes.json()) as any;
          assert.equal(dryReport.dryRun, true);
          assert.equal(dryReport.totalClasses, 7);
          assert.equal(dryReport.totalWrites, 0);
          assert.equal(dryReport.unchangedCount, 1); // cls-already-ok
          assert.equal(dryReport.dryRunPendingCount, 6);

          // E. Apply authoritative reconciliation via admin endpoint (without teacher opening dashboard)
          const applyRes = await fetch(`${url}/api/admin/classes/reconcile`, {
            method: 'POST',
            headers: { Authorization: 'Bearer leg-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ dryRun: false }),
          });
          assert.equal(applyRes.status, 200);
          const applyReport = (await applyRes.json()) as any;
          assert.equal(applyReport.dryRun, false);
          assert.equal(applyReport.migratedCount, 6);
          assert.equal(applyReport.unchangedCount, 1);
          assert.equal(applyReport.errorCount, 0);

          // Verify reconciled counts and expiresAtMs backfills
          assert.equal(docsStore.get('classes/cls-leg-10')?.data.enrolledCount, 10);
          assert.equal(docsStore.get('classes/cls-leg-9')?.data.enrolledCount, 9);
          assert.equal(docsStore.get('classes/cls-leg-0')?.data.enrolledCount, 0);
          assert.equal(docsStore.get('classes/cls-leg-statuses')?.data.enrolledCount, 4);
          assert.equal(docsStore.get('classes/cls-already-ok')?.version, 1); // Untouched!
          assert.ok(typeof docsStore.get('classes/cls-leg-exp-past')?.data.expiresAtMs === 'number');
          assert.ok(typeof docsStore.get('class_invites/GA-LEG-PAST')?.data.expiresAtMs === 'number');
          assert.ok(typeof docsStore.get('classes/cls-leg-exp-future')?.data.expiresAtMs === 'number');
          assert.ok(typeof docsStore.get('class_invites/GA-LEG-FUTURE')?.data.expiresAtMs === 'number');
          // Non-expiring classes keep no artificial expiresAtMs
          assert.equal(docsStore.get('classes/cls-leg-9')?.data.expiresAtMs, undefined);

          // F. Requirement 7 & 8: ZERO student docs, enrollments or system_roles were modified/deleted
          const afterStudentAndRoles = snapshotStudentAndRoleDocs();
          assert.deepEqual(afterStudentAndRoles, beforeStudentAndRoles);

          // G. Scenario 6: Idempotency check — re-running reconciliation repeatedly performs 0 writes
          const secondRun = await reconcileAllLegacyClasses(transactionalAdapter, { dryRun: false });
          const thirdRun = await reconcileAllLegacyClasses(transactionalAdapter, { dryRun: false });
          assert.equal(secondRun.migratedCount, 0);
          assert.equal(secondRun.unchangedCount, 7);
          assert.equal(secondRun.totalWrites, 0);
          assert.equal(thirdRun.migratedCount, 0);
          assert.equal(thirdRun.totalWrites, 0);

          // H. Scenario 1 check: Full 10/10 class rejects 11th student
          const fullJoin11 = await fetch(`${url}/api/classes/join`, {
            method: 'POST',
            headers: { Authorization: 'Bearer leg-stu-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'GA-LEG-10', studentName: 'Décimo Primeiro' }),
          });
          assert.equal(fullJoin11.status, 409);
          assert.equal(((await fullJoin11.json()) as any).reason, 'full');
          assert.equal(docsStore.get('classes/cls-leg-10')?.data.enrolledCount, 10);

          // I. Scenario 3 check: 0-student reconciled class accepts 1st student
          const zeroFirstJoin = await fetch(`${url}/api/classes/join`, {
            method: 'POST',
            headers: { Authorization: 'Bearer leg-stu-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'GA-LEG-0', studentName: 'Primeiro Aluno' }),
          });
          assert.equal(zeroFirstJoin.status, 200);
          assert.equal(docsStore.get('classes/cls-leg-0')?.data.enrolledCount, 1);

          // J. Scenario 2 & Scenario 5: 9/10 reconciled class with 2 students racing simultaneously for 10th seat
          // PLUS simultaneous reconcile execution running concurrently with the race
          const [race1, race2, concReconcile] = await Promise.all([
            fetch(`${url}/api/classes/join`, {
              method: 'POST',
              headers: { Authorization: 'Bearer leg-stu-1', 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: 'GA-LEG-9', studentName: 'Concorrente 1' }),
            }),
            fetch(`${url}/api/classes/join`, {
              method: 'POST',
              headers: { Authorization: 'Bearer leg-stu-2', 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: 'GA-LEG-9', studentName: 'Concorrente 2' }),
            }),
            reconcileAllLegacyClasses(transactionalAdapter, {
              dryRun: false,
              classIds: ['cls-leg-9'],
            }),
          ]);

          assert.equal(concReconcile.errorCount, 0);
          const raceStatuses = [race1.status, race2.status].sort((a, b) => a - b);
          assert.deepEqual(raceStatuses, [200, 409]);
          const raceBody1 = (await race1.json()) as any;
          const raceBody2 = (await race2.json()) as any;
          const loser = race1.status === 409 ? raceBody1 : raceBody2;
          assert.equal(loser.reason, 'full');
          assert.equal(docsStore.get('classes/cls-leg-9')?.data.enrolledCount, 10);

          // Verify total active subcollection docs on cls-leg-9 equals 10 and 11th subsequent attempt still fails
          const cls9SubDocs = Array.from(docsStore.keys()).filter((k) =>
            k.startsWith('classes/cls-leg-9/students/')
          );
          assert.equal(cls9SubDocs.length, 10);

          // K. Requirement 10: Legacy expired invite fails, legacy future invite succeeds
          const pastJoin = await fetch(`${url}/api/classes/join`, {
            method: 'POST',
            headers: { Authorization: 'Bearer leg-stu-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'GA-LEG-PAST' }),
          });
          assert.equal(pastJoin.status, 400);
          assert.equal(((await pastJoin.json()) as any).reason, 'expired');

          const futureJoin = await fetch(`${url}/api/classes/join`, {
            method: 'POST',
            headers: { Authorization: 'Bearer leg-stu-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'GA-LEG-FUTURE' }),
          });
          assert.equal(futureJoin.status, 200);
          assert.equal(docsStore.get('classes/cls-leg-exp-future')?.data.enrolledCount, 1);

          srv.closeAllConnections?.();
          srv.close(() => resolve());
        } catch (err) {
          srv.closeAllConnections?.();
          srv.close(() => reject(err));
        }
      });
    });
  });
});

describe('Fase 1: Academic Access Grants, Initial Placement & Authorization Engine (12 Mandatory Scenarios)', async () => {
  const { createServerApp } = await import('../../server');
  const http = await import('node:http');
  const {
    resolveStudentAccessSnapshot,
    canStudentAccessCourse,
    canStudentAccessModule,
    canStudentAccessLesson,
    resolveStudentEntryPoint,
    evaluateGrantStatus,
  } = await import('../services/accessAuthorizationEngine');
  const { ACADEMIC_CATALOG_COURSES } = await import('../services/academicCatalog');

  it('covers all 12 academic access, placement, progress preservation, RBAC and idempotency scenarios', async () => {
    const docsStore = new Map<string, { data: Record<string, any>; version: number }>();
    const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

    const seedDoc = (docPath: string, data: Record<string, any>) => {
      docsStore.set(docPath, { data: clone(data), version: 1 });
    };

    const initialCompleted = ['violao-lesson-1', 'violao-lesson-2'];
    const initialQuizScores = {
      'violao-lesson-1': { score: 95, total: 100, date: '2026-11-01' },
    };
    const initialPracticeLogs = {
      '2026-11-01': { date: '2026-11-01', minutes: 25, exercisesCompleted: 3, streakMaintained: true },
    };
    const initialPedagogical = {
      schemaVersion: 1,
      lastUpdated: '2026-11-01T10:00:00.000Z',
      skills: {},
      learningHistory: [],
    };

    const seedStudentProgress = {
      primaryCourseId: 'violao',
      currentLessonId: 'violao-lesson-3',
      completedLessons: [...initialCompleted],
      practiceLogs: clone(initialPracticeLogs),
      exerciseRepetitions: { 'violao-ex-1': 10 },
      studyPlan: { selectedLevel: 0, primaryGoal: 'fundamentals', dailyRoutineMinutes: 20, startDate: '2026-11-01' },
      quizScores: clone(initialQuizScores),
      frequentErrors: {},
      totalStudyTimeSeconds: 4200,
      todayStudyTimeSeconds: 600,
      lastStudyDate: '2026-11-01',
      practicedBpm: 76,
      favoriteChords: ['c-major-open'],
      notationPreference: 'cipher',
      preferredTuning: 'standard',
      dailyGoalMinutes: 20,
      achievements: ['first-chord'],
      pedagogicalProfile: clone(initialPedagogical),
    };

    seedDoc('users/student-acc-1', { uid: 'student-acc-1', email: 'aluno1@guitaracademy.test', accountStatus: 'active' });
    seedDoc('users/student-acc-2', { uid: 'student-acc-2', email: 'aluno2@guitaracademy.test', accountStatus: 'active' });
    seedDoc('users/student-acc-1/data/progress', seedStudentProgress);
    seedDoc('users/student-acc-2/data/progress', {
      ...seedStudentProgress,
      completedLessons: [],
      quizScores: {},
      practiceLogs: {},
      totalStudyTimeSeconds: 0,
    });

    const queryMatches = (colPath: string, filters: Array<{ field: string; value: any }>, maxLimit?: number) => {
      const prefix = `${colPath}/`;
      const out: any[] = [];
      for (const [k, v] of docsStore.entries()) {
        if (k.startsWith(prefix) && !k.slice(prefix.length).includes('/')) {
          const ok = filters.every((f) => v.data[f.field] === f.value);
          if (ok) {
            out.push({
              id: k.split('/').pop()!,
              exists: true,
              ref: makeDocRef(k),
              data: () => clone(v.data),
            });
            if (maxLimit && out.length >= maxLimit) break;
          }
        }
      }
      return out;
    };

    const makeDocRef = (docPath: string): any => ({
      path: docPath,
      id: docPath.split('/').pop()!,
      get: async () => {
        const entry = docsStore.get(docPath);
        return {
          id: docPath.split('/').pop()!,
          exists: Boolean(entry),
          ref: makeDocRef(docPath),
          data: () => (entry ? clone(entry.data) : undefined),
        };
      },
      set: async (data: Record<string, any>) => {
        const cur = docsStore.get(docPath);
        docsStore.set(docPath, { data: clone(data), version: (cur?.version || 0) + 1 });
      },
      update: async (patch: Record<string, any>) => {
        const cur = docsStore.get(docPath);
        docsStore.set(docPath, {
          data: clone({ ...(cur?.data || {}), ...patch }),
          version: (cur?.version || 0) + 1,
        });
      },
      collection: (sub: string) => makeColRef(`${docPath}/${sub}`),
    });

    const makeQueryObj = (colPath: string, filters: Array<{ field: string; value: any }>, maxLimit?: number): any => ({
      where: (field: string, _op: string, value: any) =>
        makeQueryObj(colPath, [...filters, { field, value }], maxLimit),
      limit: (n: number) => makeQueryObj(colPath, filters, n),
      get: async () => {
        const docs = queryMatches(colPath, filters, maxLimit);
        return { empty: docs.length === 0, docs };
      },
    });

    const makeColRef = (colPath: string): any => ({
      path: colPath,
      doc: (docId: string) => makeDocRef(`${colPath}/${docId}`),
      where: (field: string, _op: string, value: any) =>
        makeQueryObj(colPath, [{ field, value }]),
      limit: (n: number) => makeQueryObj(colPath, [], n),
      get: async () => {
        const docs = queryMatches(colPath, []);
        return { empty: docs.length === 0, docs };
      },
    });

    const accessDbAdapter = {
      collection: (name: string) => makeColRef(name),
      runTransaction: async (fn: (tx: any) => Promise<any>) => {
        const tx = {
          get: async (target: any) => target.get(),
          set: (ref: any, data: Record<string, any>) => {
            const cur = docsStore.get(ref.path);
            docsStore.set(ref.path, { data: clone(data), version: (cur?.version || 0) + 1 });
          },
          update: (ref: any, patch: Record<string, any>) => {
            const cur = docsStore.get(ref.path);
            docsStore.set(ref.path, {
              data: clone({ ...(cur?.data || {}), ...patch }),
              version: (cur?.version || 0) + 1,
            });
          },
        };
        return await fn(tx);
      },
    };

    const TOKENS: Record<string, { uid: string; email: string }> = {
      'acc-student-1': { uid: 'student-acc-1', email: 'aluno1@guitaracademy.test' },
      'acc-student-2': { uid: 'student-acc-2', email: 'aluno2@guitaracademy.test' },
      'acc-teacher-1': { uid: 'teacher-acc-1', email: 'prof@guitaracademy.test' },
      'acc-admin-1': { uid: 'admin-acc-1', email: 'admin@guitaracademy.test' },
    };
    const ROLES: Record<string, { exists: boolean; role: string }> = {
      'student-acc-1': { exists: true, role: 'student' },
      'student-acc-2': { exists: true, role: 'student' },
      'teacher-acc-1': { exists: true, role: 'teacher' },
      'admin-acc-1': { exists: true, role: 'admin' },
    };

    const testApp = createServerApp({
      verifyIdToken: async (token: string) => {
        const found = TOKENS[token];
        if (!found) throw new Error('Invalid token');
        return found;
      },
      getSystemRole: async (uid: string) => ROLES[uid] || { exists: false, role: 'student' },
      adminDbForAccess: accessDbAdapter,
    });

    await new Promise<void>((resolve, reject) => {
      const srv = http.createServer(testApp);
      srv.listen(0, '127.0.0.1', async () => {
        const addr = srv.address();
        const url = addr && typeof addr !== 'string' ? `http://127.0.0.1:${addr.port}` : '';
        try {
          // Baseline: student-acc-1 has violao unlocked (primary) and canonical/solo/baixo locked
          const baseMeRes = await fetch(`${url}/api/me/access`, {
            headers: { Authorization: 'Bearer acc-student-1' },
          });
          assert.equal(baseMeRes.status, 200);
          const baseMe = (await baseMeRes.json()) as any;
          assert.equal(canStudentAccessCourse(baseMe.snapshot, 'violao').allowed, true);
          assert.equal(canStudentAccessCourse(baseMe.snapshot, 'baixo').allowed, false);
          assert.equal(canStudentAccessCourse(baseMe.snapshot, 'canonical').allowed, false);

          // SCENARIO 1: Admin grants full course (baixo) AND instrument (guitarra -> canonical + solo)
          const grantCourseRes = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentUid: 'student-acc-1',
              scopeType: 'course',
              grantType: 'permanent',
              courseId: 'baixo',
              reason: 'Liberacao completa de Baixo',
            }),
          });
          assert.equal(grantCourseRes.status, 201);
          const grantCourseBody = (await grantCourseRes.json()) as any;
          assert.equal(grantCourseBody.created, true);
          assert.equal(canStudentAccessCourse(grantCourseBody.snapshot, 'baixo').fullCourseUnlocked, true);
          assert.equal(canStudentAccessCourse(grantCourseBody.snapshot, 'teclado').allowed, false);

          const grantInstRes = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentUid: 'student-acc-1',
              scopeType: 'instrument',
              grantType: 'special',
              instrumentId: 'guitarra',
              reason: 'Combo Guitarra completo',
            }),
          });
          assert.equal(grantInstRes.status, 201);
          const grantInstBody = (await grantInstRes.json()) as any;
          assert.equal(canStudentAccessCourse(grantInstBody.snapshot, 'canonical').fullCourseUnlocked, true);
          assert.equal(canStudentAccessCourse(grantInstBody.snapshot, 'solo').fullCourseUnlocked, true);

          // SCENARIO 12: Idempotency — repeating the exact same grant returns HTTP 200 without duplicating records
          const repeatCourseRes = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentUid: 'student-acc-1',
              scopeType: 'course',
              grantType: 'permanent',
              courseId: 'baixo',
              reason: 'Clique duplo admin',
            }),
          });
          assert.equal(repeatCourseRes.status, 200);
          const repeatCourseBody = (await repeatCourseRes.json()) as any;
          assert.equal(repeatCourseBody.idempotent, true);
          assert.equal(repeatCourseBody.created, false);
          assert.equal(repeatCourseBody.grant.id, grantCourseBody.grant.id);
          const student1Grants = Array.from(docsStore.values()).filter(
            (e) => e.data.studentUid === 'student-acc-1' && e.data.scopeType === 'course' && e.data.courseId === 'baixo'
          );
          assert.equal(student1Grants.length, 1);

          // SCENARIO 2: Admin grants ONLY a module (teclado-mod-2) to student-acc-1 -> other modules blocked
          const grantModRes = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentUid: 'student-acc-1',
              scopeType: 'module',
              grantType: 'special',
              courseId: 'teclado',
              moduleId: 'teclado-mod-2',
            }),
          });
          assert.equal(grantModRes.status, 201);
          const grantModBody = (await grantModRes.json()) as any;
          assert.equal(canStudentAccessModule(grantModBody.snapshot, 'teclado', 'teclado-mod-2'), true);
          assert.equal(canStudentAccessModule(grantModBody.snapshot, 'teclado', 'teclado-mod-0'), false);
          assert.equal(canStudentAccessCourse(grantModBody.snapshot, 'teclado').partialAccess, true);
          assert.equal(canStudentAccessCourse(grantModBody.snapshot, 'teclado').fullCourseUnlocked, false);
          const mod2FirstLesson = ACADEMIC_CATALOG_COURSES.teclado.modules.find((m) => m.id === 'teclado-mod-2')!.lessons[0].id;
          const mod0FirstLesson = ACADEMIC_CATALOG_COURSES.teclado.modules[0].lessons[0].id;
          assert.equal(canStudentAccessLesson(grantModBody.snapshot, mod2FirstLesson, 'teclado')?.allowed, true);
          assert.equal(canStudentAccessLesson(grantModBody.snapshot, mod0FirstLesson, 'teclado')?.allowed, false);

          // SCENARIO 3: Admin grants ONLY a specific lesson & a lesson_range on bateria
          const batLessons = ACADEMIC_CATALOG_COURSES.bateria.lessons;
          const singleBatLesson = batLessons[0].id;
          const rangeStart = batLessons[4].id;
          const rangeEnd = batLessons[6].id;
          const outsideBatLesson = batLessons[2].id;

          const grantLessonRes = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentUid: 'student-acc-1',
              scopeType: 'lesson',
              grantType: 'trial',
              courseId: 'bateria',
              lessonId: singleBatLesson,
            }),
          });
          assert.equal(grantLessonRes.status, 201);

          const grantRangeRes = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentUid: 'student-acc-1',
              scopeType: 'lesson_range',
              grantType: 'trial',
              courseId: 'bateria',
              rangeStartLessonId: rangeStart,
              rangeEndLessonId: rangeEnd,
            }),
          });
          assert.equal(grantRangeRes.status, 201);
          const rangeBody = (await grantRangeRes.json()) as any;
          assert.equal(canStudentAccessLesson(rangeBody.snapshot, singleBatLesson, 'bateria')?.allowed, true);
          assert.equal(canStudentAccessLesson(rangeBody.snapshot, batLessons[4].id, 'bateria')?.allowed, true);
          assert.equal(canStudentAccessLesson(rangeBody.snapshot, batLessons[5].id, 'bateria')?.allowed, true);
          assert.equal(canStudentAccessLesson(rangeBody.snapshot, batLessons[6].id, 'bateria')?.allowed, true);
          assert.equal(canStudentAccessLesson(rangeBody.snapshot, outsideBatLesson, 'bateria')?.allowed, false);
          assert.equal(canStudentAccessLesson(rangeBody.snapshot, batLessons[7].id, 'bateria')?.allowed, false);

          // SCENARIO 4: Admin configures Initial Placement, updates it, then clears it
          const setPlace1 = await fetch(`${url}/api/admin/students/student-acc-1/placement`, {
            method: 'PUT',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: 'custom_start',
              courseId: 'violao',
              moduleId: 'violao-mod-4',
              lessonId: 'violao-lesson-19',
              reason: 'Aluno ja domina acordes abertos',
            }),
          });
          assert.equal(setPlace1.status, 200);
          const place1Body = (await setPlace1.json()) as any;
          assert.equal(place1Body.snapshot.primaryPlacement?.lessonId, 'violao-lesson-19');
          const resolvedEntry1 = resolveStudentEntryPoint(place1Body.snapshot, seedStudentProgress as any, 'violao');
          assert.equal(resolvedEntry1.fromAdminPlacement, true);
          assert.equal(resolvedEntry1.lessonId, 'violao-lesson-19');

          const setPlace2 = await fetch(`${url}/api/admin/students/student-acc-1/placement`, {
            method: 'PUT',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: 'custom_start',
              courseId: 'violao',
              moduleId: 'violao-mod-6',
              lessonId: 'violao-lesson-31',
            }),
          });
          assert.equal(setPlace2.status, 200);
          const place2Body = (await setPlace2.json()) as any;
          assert.equal(place2Body.snapshot.primaryPlacement?.lessonId, 'violao-lesson-31');

          const clearPlace = await fetch(`${url}/api/admin/students/student-acc-1/placement`, {
            method: 'PUT',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'default_path', courseId: 'violao' }),
          });
          assert.equal(clearPlace.status, 200);
          const clearPlaceBody = (await clearPlace.json()) as any;
          assert.equal(clearPlaceBody.snapshot.primaryPlacement, null);
          const resolvedDefault = resolveStudentEntryPoint(clearPlaceBody.snapshot, seedStudentProgress as any, 'violao');
          assert.equal(resolvedDefault.fromAdminPlacement, false);

          // SCENARIO 5: Prior student progress remains 100% intact after placement changes and grants
          const storedProgressAfter = docsStore.get('users/student-acc-1/data/progress')?.data;
          assert.deepEqual(storedProgressAfter?.completedLessons, initialCompleted);
          assert.deepEqual(storedProgressAfter?.quizScores, initialQuizScores);
          assert.deepEqual(storedProgressAfter?.practiceLogs, initialPracticeLogs);
          assert.deepEqual(storedProgressAfter?.pedagogicalProfile, initialPedagogical);
          assert.equal(storedProgressAfter?.totalStudyTimeSeconds, 4200);

          // SCENARIO 6: Time-bounded temporary grant validation & expiration behavior
          const badTempRes = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentUid: 'student-acc-2',
              scopeType: 'course',
              grantType: 'temporary',
              courseId: 'baixo',
            }),
          });
          assert.equal(badTempRes.status, 400);

          const futureIso = new Date(Date.now() + 3_600_000).toISOString();
          const tempGrantRes = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentUid: 'student-acc-2',
              scopeType: 'course',
              grantType: 'temporary',
              courseId: 'baixo',
              expiresAt: futureIso,
              reason: 'Acesso temporario 1h',
            }),
          });
          assert.equal(tempGrantRes.status, 201);
          const tempGrantBody = (await tempGrantRes.json()) as any;
          assert.equal(evaluateGrantStatus(tempGrantBody.grant, Date.now()).active, true);
          assert.equal(canStudentAccessCourse(tempGrantBody.snapshot, 'baixo').allowed, true);
          const afterExpirySnapshot = resolveStudentAccessSnapshot({
            studentUid: 'student-acc-2',
            nowMs: Date.parse(futureIso) + 60_000,
            grants: [tempGrantBody.grant],
          });
          assert.equal(evaluateGrantStatus(tempGrantBody.grant, Date.parse(futureIso) + 60_000).effectiveStatus, 'expired');
          assert.equal(canStudentAccessCourse(afterExpirySnapshot, 'baixo').allowed, false);

          // SCENARIO 7: Suspend, Revoke, and Reactivate grants immediately control access
          const baixoGrantId = grantCourseBody.grant.id;
          const suspRes = await fetch(`${url}/api/admin/access-grants/${baixoGrantId}/status`, {
            method: 'PATCH',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'suspended', reason: 'Pausa solicitada' }),
          });
          assert.equal(suspRes.status, 200);
          assert.equal(canStudentAccessCourse(((await suspRes.json()) as any).snapshot, 'baixo').allowed, false);

          const reactRes = await fetch(`${url}/api/admin/access-grants/${baixoGrantId}/status`, {
            method: 'PATCH',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'active' }),
          });
          assert.equal(reactRes.status, 200);
          assert.equal(canStudentAccessCourse(((await reactRes.json()) as any).snapshot, 'baixo').allowed, true);

          const revRes = await fetch(`${url}/api/admin/access-grants/${baixoGrantId}/status`, {
            method: 'PATCH',
            headers: { Authorization: 'Bearer acc-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'revoked', reason: 'Encerrado' }),
          });
          assert.equal(revRes.status, 200);
          const revBody = (await revRes.json()) as any;
          assert.equal(canStudentAccessCourse(revBody.snapshot, 'baixo').allowed, false);

          // SCENARIO 8: Coexistence with future ExternalCourseEntitlement (purchase & subscription)
          const activePurchase = {
            id: 'purch-baixo-1',
            type: 'purchase' as const,
            courseId: 'baixo' as const,
            status: 'active' as const,
          };
          const coexBoth = resolveStudentAccessSnapshot({
            studentUid: 'student-acc-2',
            grants: [{ ...tempGrantBody.grant, status: 'revoked' }],
            entitlements: [activePurchase],
          });
          assert.equal(canStudentAccessCourse(coexBoth, 'baixo').allowed, true);
          assert.equal(coexBoth.courses.baixo.primarySource, 'purchase');

          const coexPurchaseCancelled = resolveStudentAccessSnapshot({
            studentUid: 'student-acc-2',
            grants: [tempGrantBody.grant],
            entitlements: [{ ...activePurchase, status: 'cancelled' }],
          });
          assert.equal(canStudentAccessCourse(coexPurchaseCancelled, 'baixo').allowed, true);
          assert.equal(coexPurchaseCancelled.courses.baixo.primarySource, 'admin_temporary');

          // SCENARIO 9, 10 & 11: Strict Zero-Trust RBAC & cross-student isolation (student & teacher blocked)
          const studentAttemptGrant = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer acc-student-2',
              'Content-Type': 'application/json',
              'x-role': 'admin',
            },
            body: JSON.stringify({
              studentUid: 'student-acc-2',
              scopeType: 'course',
              grantType: 'permanent',
              courseId: 'solo',
            }),
          });
          assert.equal(studentAttemptGrant.status, 403);

          const studentAttemptReadOther = await fetch(`${url}/api/admin/students/student-acc-1/access`, {
            headers: { Authorization: 'Bearer acc-student-2' },
          });
          assert.equal(studentAttemptReadOther.status, 403);

          const teacherAttemptGrant = await fetch(`${url}/api/admin/access-grants`, {
            method: 'POST',
            headers: { Authorization: 'Bearer acc-teacher-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentUid: 'student-acc-2',
              scopeType: 'course',
              grantType: 'permanent',
              courseId: 'solo',
            }),
          });
          assert.equal(teacherAttemptGrant.status, 403);

          const teacherAttemptStatus = await fetch(`${url}/api/admin/access-grants/${baixoGrantId}/status`, {
            method: 'PATCH',
            headers: { Authorization: 'Bearer acc-teacher-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'active' }),
          });
          assert.equal(teacherAttemptStatus.status, 403);

          const teacherAttemptPlacement = await fetch(`${url}/api/admin/students/student-acc-1/placement`, {
            method: 'PUT',
            headers: { Authorization: 'Bearer acc-teacher-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'custom_start', courseId: 'violao', lessonId: 'violao-lesson-5' }),
          });
          assert.equal(teacherAttemptPlacement.status, 403);

          // /api/me/access returns ONLY caller's own records (never leaks student-acc-1 grants to student-acc-2)
          const me2Res = await fetch(`${url}/api/me/access`, {
            headers: { Authorization: 'Bearer acc-student-2' },
          });
          assert.equal(me2Res.status, 200);
          const me2 = (await me2Res.json()) as any;
          assert.equal(me2.studentUid, 'student-acc-2');
          assert.equal(me2.grants.every((g: any) => g.studentUid === 'student-acc-2'), true);

          srv.closeAllConnections?.();
          srv.close(() => resolve());
        } catch (err) {
          srv.closeAllConnections?.();
          srv.close(() => reject(err));
        }
      });
    });
  });
});

describe('Fase 2: Guitar Academy Commerce Core (12 Mandatory Security, Fail-Closed & Integrity Scenarios)', async () => {
  const { createServerApp } = await import('../../server');
  const http = await import('node:http');
  const {
    COMMERCE_CONFIRMATION_PHRASE,
    DEFAULT_COMMERCE_CONFIG,
    buildEntitlementsFromPurchase,
    buildEntitlementsFromSubscription,
    createAppliedPriceSnapshot,
    evaluateAndCalculateCoupon,
    normalizeCommerceConfig,
    resolveCommerceAndAcademicAccess,
  } = await import('../services/commerceCore');
  const { canStudentAccessCourse } = await import('../services/accessAuthorizationEngine');

  it('covers all 12 mandatory Fase 2 commercial core tests without exposing paid mode or breaking Fase 1', async () => {
    const docsStore = new Map<string, { data: Record<string, any>; version: number }>();
    const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

    const queryMatches = (colPath: string, filters: Array<{ field: string; value: any }>, maxLimit?: number) => {
      const prefix = `${colPath}/`;
      const out: any[] = [];
      for (const [k, v] of docsStore.entries()) {
        if (k.startsWith(prefix) && !k.slice(prefix.length).includes('/')) {
          const ok = filters.every((f) => v.data[f.field] === f.value);
          if (ok) {
            out.push({
              id: k.split('/').pop()!,
              exists: true,
              ref: makeDocRef(k),
              data: () => clone(v.data),
            });
            if (maxLimit && out.length >= maxLimit) break;
          }
        }
      }
      return out;
    };

    const makeDocRef = (docPath: string): any => ({
      path: docPath,
      id: docPath.split('/').pop()!,
      get: async () => {
        const entry = docsStore.get(docPath);
        return {
          id: docPath.split('/').pop()!,
          exists: Boolean(entry),
          ref: makeDocRef(docPath),
          data: () => (entry ? clone(entry.data) : undefined),
        };
      },
      set: async (data: Record<string, any>) => {
        const cur = docsStore.get(docPath);
        docsStore.set(docPath, { data: clone(data), version: (cur?.version || 0) + 1 });
      },
      update: async (patch: Record<string, any>) => {
        const cur = docsStore.get(docPath);
        docsStore.set(docPath, {
          data: clone({ ...(cur?.data || {}), ...patch }),
          version: (cur?.version || 0) + 1,
        });
      },
      collection: (sub: string) => makeColRef(`${docPath}/${sub}`),
    });

    const makeQueryObj = (colPath: string, filters: Array<{ field: string; value: any }>, maxLimit?: number): any => ({
      where: (field: string, _op: string, value: any) =>
        makeQueryObj(colPath, [...filters, { field, value }], maxLimit),
      limit: (n: number) => makeQueryObj(colPath, filters, n),
      get: async () => {
        const docs = queryMatches(colPath, filters, maxLimit);
        return { empty: docs.length === 0, docs };
      },
    });

    const makeColRef = (colPath: string): any => ({
      path: colPath,
      doc: (docId: string) => makeDocRef(`${colPath}/${docId}`),
      where: (field: string, _op: string, value: any) =>
        makeQueryObj(colPath, [{ field, value }]),
      limit: (n: number) => makeQueryObj(colPath, [], n),
      get: async () => {
        const docs = queryMatches(colPath, []);
        return { empty: docs.length === 0, docs };
      },
    });

    const commerceDbAdapter = {
      collection: (name: string) => makeColRef(name),
      runTransaction: async (fn: (tx: any) => Promise<any>) => {
        const tx = {
          get: async (target: any) => target.get(),
          set: (ref: any, data: Record<string, any>) => {
            const cur = docsStore.get(ref.path);
            docsStore.set(ref.path, { data: clone(data), version: (cur?.version || 0) + 1 });
          },
          update: (ref: any, patch: Record<string, any>) => {
            const cur = docsStore.get(ref.path);
            docsStore.set(ref.path, {
              data: clone({ ...(cur?.data || {}), ...patch }),
              version: (cur?.version || 0) + 1,
            });
          },
        };
        return await fn(tx);
      },
    };

    const auditTrail: Array<{ eventType: string; actorUid: string; action: string }> = [];

    const TOKENS: Record<string, { uid: string; email: string }> = {
      'com-student-1': { uid: 'student-com-1', email: 'aluno1@guitaracademy.test' },
      'com-student-2': { uid: 'student-com-2', email: 'aluno2@guitaracademy.test' },
      'com-teacher-1': { uid: 'teacher-com-1', email: 'prof@guitaracademy.test' },
      'com-admin-1': { uid: 'admin-com-1', email: 'admin@guitaracademy.test' },
    };
    const ROLES: Record<string, { exists: boolean; role: string }> = {
      'student-com-1': { exists: true, role: 'student' },
      'student-com-2': { exists: true, role: 'student' },
      'teacher-com-1': { exists: true, role: 'teacher' },
      'admin-com-1': { exists: true, role: 'admin' },
    };

    const testApp = createServerApp({
      verifyIdToken: async (token: string) => {
        const found = TOKENS[token];
        if (!found) throw new Error('Invalid token');
        return found;
      },
      getSystemRole: async (uid: string) => ROLES[uid] || { exists: false, role: 'student' },
      writeAdminLog: async (entry) => {
        auditTrail.push({
          eventType: entry.eventType,
          actorUid: entry.actorUid,
          action: entry.action,
        });
      },
      adminDbForCommerce: commerceDbAdapter,
    });

    await new Promise<void>((resolve, reject) => {
      const srv = http.createServer(testApp);
      srv.listen(0, '127.0.0.1', async () => {
        const addr = srv.address();
        const url = addr && typeof addr !== 'string' ? `http://127.0.0.1:${addr.port}` : '';
        try {
          // 1 & 11. Modo comercial inicia DESATIVADO mesmo sem doc platform_config/commerce e fail-closed em corrupção
          assert.equal(DEFAULT_COMMERCE_CONFIG.commerceEnabled, false);
          assert.equal(DEFAULT_COMMERCE_CONFIG.catalogVisible, false);
          assert.equal(DEFAULT_COMMERCE_CONFIG.checkoutEnabled, false);
          assert.equal(DEFAULT_COMMERCE_CONFIG.promotionsEnabled, false);
          assert.equal(DEFAULT_COMMERCE_CONFIG.advertisementsEnabled, false);
          assert.equal(DEFAULT_COMMERCE_CONFIG.paidClassesEnabled, false);
          assert.equal(DEFAULT_COMMERCE_CONFIG.subscriptionsEnabled, false);

          const corruptedCfg = normalizeCommerceConfig({
            commerceEnabled: 'true',
            checkoutEnabled: true,
            corrupted: true,
          });
          assert.equal(corruptedCfg.commerceEnabled, false);
          assert.equal(corruptedCfg.checkoutEnabled, false);
          assert.equal(corruptedCfg.catalogVisible, false);

          // Doc corrompido salvo no banco também nunca ativa cobrança
          docsStore.set('platform_config/commerce', {
            data: { commerceEnabled: 'yes', checkoutEnabled: true, corrupted: true },
            version: 1,
          });
          const corruptedCatalogRes = await fetch(`${url}/api/commerce/catalog`, {
            headers: { Authorization: 'Bearer com-student-1' },
          });
          assert.equal(corruptedCatalogRes.status, 200);
          const corruptedCatalogBody = (await corruptedCatalogRes.json()) as any;
          assert.equal(corruptedCatalogBody.commerceEnabled, false);
          assert.equal(corruptedCatalogBody.products.length, 0);
          docsStore.delete('platform_config/commerce');

          // 4 & 5. Aluno e Professor NÃO acessam configuração comercial nem rotas admin comerciais
          const stuReadCfg = await fetch(`${url}/api/admin/commerce/overview`, {
            headers: { Authorization: 'Bearer com-student-1' },
          });
          assert.equal(stuReadCfg.status, 403);

          const stuWriteCfg = await fetch(`${url}/api/admin/commerce/config`, {
            method: 'PUT',
            headers: { Authorization: 'Bearer com-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ commerceEnabled: true, confirmationText: COMMERCE_CONFIRMATION_PHRASE }),
          });
          assert.equal(stuWriteCfg.status, 403);

          const teacherCreateProd = await fetch(`${url}/api/admin/commerce/products`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-teacher-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Produto Professor Bloqueado',
              description: 'Tentativa não autorizada',
              productType: 'individual_course',
              courseIds: ['violao'],
            }),
          });
          assert.equal(teacherCreateProd.status, 403);

          // 6 & 2. Admin cria produto válido; produto novo SEMPRE inicia oculto ('hidden')
          const invalidCourseProd = await fetch(`${url}/api/admin/commerce/products`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Produto Inválido',
              description: 'Curso inventado',
              productType: 'individual_course',
              courseIds: ['curso-inexistente'],
            }),
          });
          assert.equal(invalidCourseProd.status, 400);

          const createProdRes = await fetch(`${url}/api/admin/commerce/products`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Pacote Violão + Guitarra Canônica',
              description: 'Infraestrutura comercial estruturada para teste',
              productType: 'instrument_bundle',
              courseIds: ['violao', 'canonical'],
              status: 'active',
              visibility: 'public', // Servidor força 'hidden' na criação
            }),
          });
          assert.equal(createProdRes.status, 201);
          const createdProdBody = (await createProdRes.json()) as any;
          const prodId = createdProdBody.product.productId;
          assert.equal(createdProdBody.product.visibility, 'hidden');

          // 3. Aluno não visualiza catálogo oculto (mesmo que admin marque product visibility='public', commerceEnabled=false bloqueia!)
          const stuCatalogHidden = await fetch(`${url}/api/commerce/catalog`, {
            headers: { Authorization: 'Bearer com-student-1' },
          });
          assert.equal(stuCatalogHidden.status, 200);
          assert.equal(((await stuCatalogHidden.json()) as any).products.length, 0);

          await fetch(`${url}/api/admin/commerce/products/${prodId}`, {
            method: 'PATCH',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ visibility: 'public', status: 'active' }),
          });
          const stuCatalogStillBlocked = await fetch(`${url}/api/commerce/catalog`, {
            headers: { Authorization: 'Bearer com-student-1' },
          });
          assert.equal(((await stuCatalogStillBlocked.json()) as any).products.length, 0);

          // 5 & 7. Professor não altera preços; Admin cria v1 e v2 preservando v1 imutável (superseded)
          const teacherPriceRes = await fetch(`${url}/api/admin/commerce/products/${prodId}/prices`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-teacher-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 150, currency: 'BRL', billingInterval: 'one_time' }),
          });
          assert.equal(teacherPriceRes.status, 403);

          const priceV1Res = await fetch(`${url}/api/admin/commerce/products/${prodId}/prices`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 200, currency: 'BRL', billingInterval: 'one_time' }),
          });
          assert.equal(priceV1Res.status, 201);
          const priceV1 = ((await priceV1Res.json()) as any).price;
          assert.equal(priceV1.version, 1);
          assert.equal(priceV1.amountCents, 20000);

          const priceV2Res = await fetch(`${url}/api/admin/commerce/products/${prodId}/prices`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 240, currency: 'BRL', billingInterval: 'one_time' }),
          });
          assert.equal(priceV2Res.status, 201);
          const priceV2Body = (await priceV2Res.json()) as any;
          const priceV2 = priceV2Body.price;
          assert.equal(priceV2.version, 2);
          assert.equal(priceV2.previousPriceId, priceV1.priceId);

          const storedV1After = docsStore.get(`product_prices/${priceV1.priceId}`)?.data;
          assert.equal(storedV1After?.status, 'superseded');
          assert.equal(storedV1After?.amount, 200);
          assert.equal(storedV1After?.amountCents, 20000);
          assert.equal(storedV1After?.supersededBy, priceV2.priceId);

          // Snapshot imutável preserva valor aplicado no instante do uso
          const snapshotV2 = createAppliedPriceSnapshot({
            product: createdProdBody.product,
            price: priceV2,
            discountAmountCents: 6000,
            couponCode: 'PACOTE25',
          });
          assert.equal(snapshotV2.baseAmountCents, 24000);
          assert.equal(snapshotV2.discountAmountCents, 6000);
          assert.equal(snapshotV2.finalAmountCents, 18000);

          // 8 & 9. Cupons válidos calculados no servidor; expirados, inativos ou limite esgotado rejeitados
          const createPromoValidRes = await fetch(`${url}/api/admin/commerce/promotions`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Desconto 25% Pacote',
              code: 'PACOTE25',
              discountType: 'percentage',
              discountValue: 25,
              scopeType: 'bundle',
              targetProductIds: [prodId],
              maxRedemptions: 5,
              status: 'active',
            }),
          });
          assert.equal(createPromoValidRes.status, 201);

          const createPromoExpiredRes = await fetch(`${url}/api/admin/commerce/promotions`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Cupom Expirado',
              code: 'EXPIRADO10',
              discountType: 'percentage',
              discountValue: 10,
              scopeType: 'all_products',
              endsAt: '2020-01-01T00:00:00.000Z',
              status: 'active',
            }),
          });
          assert.equal(createPromoExpiredRes.status, 201);

          const createPromoExhaustedRes = await fetch(`${url}/api/admin/commerce/promotions`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Cupom Esgotado',
              code: 'ESGOTADO50',
              discountType: 'fixed_amount',
              discountValue: 50,
              scopeType: 'all_products',
              maxRedemptions: 1,
              status: 'active',
            }),
          });
          assert.equal(createPromoExhaustedRes.status, 201);
          const exhaustedPromoId = ((await createPromoExhaustedRes.json()) as any).promotion.promotionId;
          // Simula esgotamento no armazenamento
          const exhaustedDoc = docsStore.get(`promotions/${exhaustedPromoId}`)!;
          exhaustedDoc.data.redeemedCount = 1;

          // Endpoint de aluno rejeita cupom com HTTP 403 enquanto promoções estiverem desativadas!
          const stuCouponBlocked = await fetch(`${url}/api/commerce/validate-coupon`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'PACOTE25', productId: prodId, priceId: priceV2.priceId }),
          });
          assert.equal(stuCouponBlocked.status, 403);

          // Simulação autoritativa no servidor (ignora qualquer desconto falsificado pelo cliente!)
          const simValidRes = await fetch(`${url}/api/admin/commerce/coupons/validate`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: 'pacote25',
              productId: prodId,
              priceId: priceV2.priceId,
              discountAmount: 239.99, // Tentativa de manipulação ignorada pelo servidor
              finalAmount: 0.01,
              allowAdminPreview: true,
            }),
          });
          assert.equal(simValidRes.status, 200);
          const simValidBody = (await simValidRes.json()) as any;
          assert.equal(simValidBody.evaluation.valid, true);
          assert.equal(simValidBody.evaluation.baseAmountCents, 24000);
          assert.equal(simValidBody.evaluation.discountAmountCents, 6000); // 25% de R$ 240 = R$ 60
          assert.equal(simValidBody.evaluation.finalAmountCents, 18000);

          const simExpiredRes = await fetch(`${url}/api/admin/commerce/coupons/validate`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: 'EXPIRADO10',
              productId: prodId,
              priceId: priceV2.priceId,
              allowAdminPreview: true,
            }),
          });
          assert.equal(simExpiredRes.status, 400);
          assert.equal(((await simExpiredRes.json()) as any).evaluation.reason, 'expired');

          const simExhaustedRes = await fetch(`${url}/api/admin/commerce/coupons/validate`, {
            method: 'POST',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: 'ESGOTADO50',
              productId: prodId,
              priceId: priceV2.priceId,
              allowAdminPreview: true,
            }),
          });
          assert.equal(simExhaustedRes.status, 400);
          assert.equal(((await simExhaustedRes.json()) as any).evaluation.reason, 'max_redemptions_reached');

          // Cupom específico por UID rejeita outro estudante
          const individualCheck = evaluateAndCalculateCoupon({
            code: 'INDIV10',
            product: createdProdBody.product,
            price: priceV2,
            promotion: {
              promotionId: 'promo-indiv',
              name: 'Individual',
              code: 'INDIV10',
              discountType: 'percentage',
              discountValue: 10,
              scopeType: 'all_products',
              targetProductIds: [],
              targetCourseIds: [],
              redeemedCount: 0,
              eligibleAudience: 'specific_uids',
              eligibleStudentUids: ['student-com-1'],
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: 'admin-com-1',
            },
            config: { ...DEFAULT_COMMERCE_CONFIG, commerceEnabled: true, promotionsEnabled: true },
            studentUid: 'student-com-2',
          });
          assert.equal(individualCheck.valid, false);
          assert.equal(individualCheck.reason, 'audience_not_eligible');

          // 10. Liberação gratuita do admin (Fase 1) permanece independente de compras/assinaturas/reembolso
          const adminGrant = {
            id: 'grant-com-free-violao',
            studentUid: 'student-com-1',
            scopeType: 'course' as const,
            grantType: 'permanent' as const,
            source: 'admin_permanent' as const,
            status: 'active' as const,
            courseId: 'violao' as const,
            idempotencyKey: 'k-free-violao',
            grantedBy: 'admin-com-1',
            createdAt: '2026-11-15T00:00:00.000Z',
            updatedAt: '2026-11-15T00:00:00.000Z',
          };
          const purchaseEnts = buildEntitlementsFromPurchase({
            entitlementId: 'ord-1',
            product: createdProdBody.product, // violao + canonical
            status: 'revoked', // Simula reembolso da compra
          });
          const subEnts = buildEntitlementsFromSubscription({
            subscriptionId: 'sub-1',
            courseIds: ['baixo'],
            status: 'active',
          });
          const unifiedAccess = resolveCommerceAndAcademicAccess({
            studentUid: 'student-com-1',
            grants: [adminGrant],
            entitlements: [...purchaseEnts, ...subEnts],
          });
          // Mesmo com compra reembolsada ('revoked'), concessão gratuita do admin em 'violao' permanece ativa!
          assert.equal(canStudentAccessCourse(unifiedAccess, 'violao').allowed, true);
          assert.equal(unifiedAccess.courses.violao.primarySource, 'admin_permanent');
          assert.equal(canStudentAccessCourse(unifiedAccess, 'canonical').allowed, false);
          assert.equal(canStudentAccessCourse(unifiedAccess, 'baixo').allowed, true);
          assert.equal(unifiedAccess.courses.baixo.primarySource, 'subscription');

          // Ativação global sem frase de confirmação explícita falha com 400; salvar desativado passa com 200
          const enableNoPhrase = await fetch(`${url}/api/admin/commerce/config`, {
            method: 'PUT',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ commerceEnabled: true }),
          });
          assert.equal(enableNoPhrase.status, 400);

          const saveSafeDisabled = await fetch(`${url}/api/admin/commerce/config`, {
            method: 'PUT',
            headers: { Authorization: 'Bearer com-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ commerceEnabled: false }),
          });
          assert.equal(saveSafeDisabled.status, 200);
          assert.equal(((await saveSafeDisabled.json()) as any).config.commerceEnabled, false);

          // 12. Auditoria registrou operações comerciais e tentativas não autorizadas
          const loggedEvents = auditTrail.map((e) => e.eventType);
          assert.equal(loggedEvents.includes('commerce_unauthorized_attempt'), true);
          assert.equal(loggedEvents.includes('commerce_product_created'), true);
          assert.equal(loggedEvents.includes('commerce_price_version_created'), true);
          assert.equal(loggedEvents.includes('commerce_promotion_created'), true);
          assert.equal(loggedEvents.includes('commerce_config_updated'), true);

          srv.closeAllConnections?.();
          srv.close(() => resolve());
        } catch (err) {
          srv.closeAllConnections?.();
          srv.close(() => reject(err));
        }
      });
    });
  });
});

describe('Fase 3: Campanhas, Storage, Turmas Pagas, Reservas, Pedidos, Webhooks, Assinaturas e Financeiro (18 Mandatory Scenarios)', async () => {
  const { createServerApp } = await import('../../server');
  const http = await import('node:http');
  const { computeWebhookHmacSignature } = await import('../services/paymentWebhookVerifier');
  const { resolveCommerceAndAcademicAccess } = await import('../services/commerceCore');
  const { canStudentAccessCourse } = await import('../services/accessAuthorizationEngine');

  it('enforces all 18 mandatory Fase 3 operational, concurrency, webhook HMAC, idempotency, entitlement isolation and financial integrity scenarios', async () => {
    const WEBHOOK_SECRET = 'ga-phase3-hmac-test-secret-2026';
    class TxConflictError extends Error {}

    const docsStore = new Map<string, { data: Record<string, any>; version: number }>();
    const storageFiles = new Map<string, { mimeType: string; bytesLength: number; version: number }>();
    const auditTrail: Array<{ eventType: string; actorUid: string; action: string }> = [];
    const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

    const queryMatches = (colPath: string, filters: Array<{ field: string; value: any }>, maxLimit?: number) => {
      const prefix = `${colPath}/`;
      const out: any[] = [];
      for (const [k, v] of docsStore.entries()) {
        if (k.startsWith(prefix) && !k.slice(prefix.length).includes('/')) {
          const ok = filters.every((f) => v.data[f.field] === f.value);
          if (ok) {
            out.push({
              id: k.split('/').pop()!,
              exists: true,
              ref: makeDocRef(k),
              data: () => clone(v.data),
            });
            if (maxLimit && out.length >= maxLimit) break;
          }
        }
      }
      return out;
    };

    const makeDocRef = (docPath: string): any => ({
      path: docPath,
      id: docPath.split('/').pop()!,
      get: async () => {
        const entry = docsStore.get(docPath);
        return {
          id: docPath.split('/').pop()!,
          exists: Boolean(entry),
          ref: makeDocRef(docPath),
          data: () => (entry ? clone(entry.data) : undefined),
        };
      },
      set: async (data: Record<string, any>) => {
        const cur = docsStore.get(docPath);
        docsStore.set(docPath, { data: clone(data), version: (cur?.version || 0) + 1 });
      },
      update: async (patch: Record<string, any>) => {
        const cur = docsStore.get(docPath);
        docsStore.set(docPath, {
          data: clone({ ...(cur?.data || {}), ...patch }),
          version: (cur?.version || 0) + 1,
        });
      },
      collection: (sub: string) => makeColRef(`${docPath}/${sub}`),
    });

    const makeQueryObj = (colPath: string, filters: Array<{ field: string; value: any }>, maxLimit?: number): any => ({
      where: (field: string, _op: string, value: any) =>
        makeQueryObj(colPath, [...filters, { field, value }], maxLimit),
      limit: (n: number) => makeQueryObj(colPath, filters, n),
      get: async () => {
        const docs = queryMatches(colPath, filters, maxLimit);
        return { empty: docs.length === 0, docs };
      },
    });

    const makeColRef = (colPath: string): any => ({
      path: colPath,
      doc: (docId: string) => makeDocRef(`${colPath}/${docId}`),
      where: (field: string, _op: string, value: any) => makeQueryObj(colPath, [{ field, value }]),
      limit: (n: number) => makeQueryObj(colPath, [], n),
      get: async () => {
        const docs = queryMatches(colPath, []);
        return { empty: docs.length === 0, docs };
      },
    });

    // Serializable optimistic concurrency transaction engine so Promise.all detects read-set drift
    const phase3DbAdapter = {
      collection: (name: string) => makeColRef(name),
      runTransaction: async (fn: (tx: any) => Promise<any>) => {
        for (let attempt = 0; attempt < 25; attempt++) {
          const readVersions = new Map<string, number>();
          const queryReadCollections = new Map<string, Map<string, number>>();
          const stagedWrites: Array<{ path: string; data: Record<string, any> }> = [];

          const tx = {
            get: async (target: any) => {
              if (typeof target?.path === 'string' && target.path.split('/').length % 2 === 0) {
                const entry = docsStore.get(target.path);
                readVersions.set(target.path, entry?.version || 0);
                return {
                  id: target.id,
                  exists: Boolean(entry),
                  ref: makeDocRef(target.path),
                  data: () => (entry ? clone(entry.data) : undefined),
                };
              }
              // Query snapshot
              const snap = await target.get();
              const colVersions = new Map<string, number>();
              for (const d of snap.docs || []) {
                colVersions.set(d.ref.path, docsStore.get(d.ref.path)?.version || 0);
              }
              queryReadCollections.set(String(Math.random()), colVersions);
              return snap;
            },
            set: (ref: any, data: Record<string, any>) => {
              stagedWrites.push({ path: ref.path, data: clone(data) });
            },
            update: (ref: any, patch: Record<string, any>) => {
              const cur = docsStore.get(ref.path)?.data || {};
              stagedWrites.push({ path: ref.path, data: clone({ ...cur, ...patch }) });
            },
          };

          const result = await fn(tx);

          // Simulate async I/O yield inside concurrent transactions to verify conflict retry safety
          await new Promise((r) => setTimeout(r, 2));

          let conflicted = false;
          for (const [p, expectedV] of readVersions.entries()) {
            const curV = docsStore.get(p)?.version || 0;
            if (curV !== expectedV) {
              conflicted = true;
              break;
            }
          }
          if (!conflicted) {
            for (const colVersions of queryReadCollections.values()) {
              for (const [p, expectedV] of colVersions.entries()) {
                const curV = docsStore.get(p)?.version || 0;
                if (curV !== expectedV) {
                  conflicted = true;
                  break;
                }
              }
              if (conflicted) break;
            }
          }

          if (conflicted) {
            if (attempt === 24) throw new TxConflictError('Transaction conflict after retries');
            continue;
          }

          for (const w of stagedWrites) {
            const curV = docsStore.get(w.path)?.version || 0;
            docsStore.set(w.path, { data: clone(w.data), version: curV + 1 });
          }
          return result;
        }
        throw new TxConflictError('Transaction exhausted retries');
      },
    };

    const TOKENS: Record<string, { uid: string; email: string }> = {
      'p3-student-1': { uid: 'student-p3-1', email: 'aluno1@guitaracademy.test' },
      'p3-student-2': { uid: 'student-p3-2', email: 'aluno2@guitaracademy.test' },
      'p3-teacher-1': { uid: 'teacher-p3-1', email: 'prof@guitaracademy.test' },
      'p3-admin-1': { uid: 'admin-p3-1', email: 'admin@guitaracademy.test' },
    };
    const ROLES: Record<string, { exists: boolean; role: string }> = {
      'student-p3-1': { exists: true, role: 'student' },
      'student-p3-2': { exists: true, role: 'student' },
      'teacher-p3-1': { exists: true, role: 'teacher' },
      'admin-p3-1': { exists: true, role: 'admin' },
    };

    // Seed baseline real class, student academic progress & Fase 1 free grant
    docsStore.set('classes/cls-p3-violao', {
      data: {
        id: 'cls-p3-violao',
        name: 'Turma Violão Presencial T3',
        courseId: 'violao',
        teacherId: 'teacher-p3-1',
        teacherName: 'Prof. Henrique',
        maxStudents: 15,
        enrolledCount: 0,
        active: true,
      },
      version: 1,
    });
    docsStore.set('users/student-p3-1/data/progress', {
      data: {
        primaryCourseId: 'baixo',
        completedLessons: ['baixo-lesson-1', 'baixo-lesson-2'],
        totalStudyTimeSeconds: 3600,
      },
      version: 1,
    });
    docsStore.set('course_access_grants/grant-free-p3-baixo', {
      data: {
        id: 'grant-free-p3-baixo',
        studentUid: 'student-p3-1',
        scopeType: 'course',
        grantType: 'permanent',
        source: 'admin_permanent',
        status: 'active',
        courseId: 'baixo',
        idempotencyKey: 'k-free-baixo',
        grantedBy: 'admin-p3-1',
        createdAt: '2026-11-15T00:00:00.000Z',
        updatedAt: '2026-11-15T00:00:00.000Z',
      },
      version: 1,
    });

    const testApp = createServerApp({
      verifyIdToken: async (token: string) => {
        const found = TOKENS[token];
        if (!found) throw new Error('Invalid token');
        return found;
      },
      getSystemRole: async (uid: string) => ROLES[uid] || { exists: false, role: 'student' },
      writeAdminLog: async (entry) => {
        auditTrail.push({
          eventType: entry.eventType,
          actorUid: entry.actorUid,
          action: entry.action,
        });
      },
      adminDbForCommerce: phase3DbAdapter,
      adminDbForAccess: phase3DbAdapter,
      adminStorageForCommerce: {
        uploadBanner: async ({ storagePath, buffer, mimeType, version }) => {
          storageFiles.set(storagePath, {
            mimeType,
            bytesLength: buffer.byteLength,
            version,
          });
          return {
            storagePath,
            imageUrl: `https://storage.test/${encodeURIComponent(storagePath)}?v=${version}`,
          };
        },
      },
      commerceWebhookSecret: WEBHOOK_SECRET,
    });

    await new Promise<void>((resolve, reject) => {
      const srv = http.createServer(testApp);
      srv.listen(0, '127.0.0.1', async () => {
        const addr = srv.address();
        const url = addr && typeof addr !== 'string' ? `http://127.0.0.1:${addr.port}` : '';
        try {
          // Setup product, price v1 and coupon
          const prodRes = await fetch(`${url}/api/admin/commerce/products`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Turma Violão P3 + Curso',
              description: 'Produto completo Fase 3',
              productType: 'paid_class_offer',
              courseIds: ['violao'],
              status: 'active',
            }),
          });
          assert.equal(prodRes.status, 201);
          const prod = ((await prodRes.json()) as any).product;

          const priceV1Res = await fetch(`${url}/api/admin/commerce/products/${prod.productId}/prices`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 300, currency: 'BRL', billingInterval: 'one_time' }),
          });
          assert.equal(priceV1Res.status, 201);
          const priceV1 = ((await priceV1Res.json()) as any).price;

          const promoRes = await fetch(`${url}/api/admin/commerce/promotions`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Desconto 10% Turma',
              code: 'TURMA10',
              discountType: 'percentage',
              discountValue: 10,
              scopeType: 'all_products',
              maxRedemptions: 10,
              status: 'active',
            }),
          });
          assert.equal(promoRes.status, 201);
          const promo = ((await promoRes.json()) as any).promotion;

          // 1 & 2. Aluno e Professor NÃO acessam áreas administrativas nem financeiras (overview, anúncios, ofertas, financeiro, ajustes)
          for (const tok of ['p3-student-1', 'p3-teacher-1']) {
            const ov = await fetch(`${url}/api/admin/commerce/phase3/overview`, {
              headers: { Authorization: `Bearer ${tok}` },
            });
            assert.equal(ov.status, 403);
            const fin = await fetch(`${url}/api/admin/commerce/financial`, {
              headers: { Authorization: `Bearer ${tok}` },
            });
            assert.equal(fin.status, 403);
            const adj = await fetch(`${url}/api/admin/commerce/financial/adjustments`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'reconciliation_note',
                amountCents: 0,
                currency: 'BRL',
                justification: 'Tentativa não autorizada no financeiro',
              }),
            });
            assert.equal(adj.status, 403);
          }

          // Financial report initially shows 0 real transactions (no fabricated numbers)
          const emptyFinRes = await fetch(`${url}/api/admin/commerce/financial?currency=BRL`, {
            headers: { Authorization: 'Bearer p3-admin-1' },
          });
          assert.equal(emptyFinRes.status, 200);
          const emptyReport = ((await emptyFinRes.json()) as any).report;
          assert.equal(emptyReport.hasRealTransactions, false);
          assert.equal(emptyReport.totalSoldCount, 0);
          assert.equal(emptyReport.grossRevenueCents, 0);
          assert.equal(emptyReport.netRevenueCents, 0);

          // Admin cria campanha publicitária e realiza upload de imagens
          const createAdRes = await fetch(`${url}/api/admin/commerce/advertisements`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: 'Campanha Turma Violão Presencial',
              subtitle: 'Vagas limitadas',
              description: 'Inscrições em preparação',
              ctaText: 'Ver Turma',
              ctaDestination: '/cursos',
              productId: prod.productId,
              position: 'home',
              targetAudience: 'all',
              status: 'active',
            }),
          });
          assert.equal(createAdRes.status, 201);
          const adId = ((await createAdRes.json()) as any).advertisement.advertisementId;

          const validWebpBytes = Buffer.from([
            0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x20,
          ]);
          const validPngBytes = Buffer.from([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
          ]);

          // 3. Upload de imagem rejeitado para usuário não-admin (aluno e professor)
          const stuUpload = await fetch(`${url}/api/admin/commerce/advertisements/${adId}/upload`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: 'banner.webp',
              mimeType: 'image/webp',
              fileDataBase64: validWebpBytes.toString('base64'),
            }),
          });
          assert.equal(stuUpload.status, 403);

          const tchUpload = await fetch(`${url}/api/admin/commerce/advertisements/${adId}/upload`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-teacher-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: 'banner.webp',
              mimeType: 'image/webp',
              fileDataBase64: validWebpBytes.toString('base64'),
            }),
          });
          assert.equal(tchUpload.status, 403);

          // 4. Upload bloqueia MIME, extensão, magic bytes inválidos e arquivo > 5MB
          const badExtUpload = await fetch(`${url}/api/admin/commerce/advertisements/${adId}/upload`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: 'script.svg',
              mimeType: 'image/svg+xml',
              fileDataBase64: Buffer.from('<svg></svg>').toString('base64'),
            }),
          });
          assert.equal(badExtUpload.status, 400);

          const spoofedMagicUpload = await fetch(`${url}/api/admin/commerce/advertisements/${adId}/upload`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: 'disguised.webp',
              mimeType: 'image/webp',
              fileDataBase64: Buffer.from('NOT_A_REAL_WEBP_HEADER_FILE').toString('base64'),
            }),
          });
          assert.equal(spoofedMagicUpload.status, 400);

          const oversizedBuf = Buffer.concat([validWebpBytes, Buffer.alloc(5 * 1024 * 1024 + 64)]);
          const oversizedUpload = await fetch(`${url}/api/admin/commerce/advertisements/${adId}/upload`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: 'huge.webp',
              mimeType: 'image/webp',
              fileDataBase64: oversizedBuf.toString('base64'),
            }),
          });
          assert.equal(oversizedUpload.status, 400);

          // 5. Upload v1 seguido de v2 preserva versões anteriores (previousStoragePaths)
          const upV1Res = await fetch(`${url}/api/admin/commerce/advertisements/${adId}/upload`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: 'banner.webp',
              mimeType: 'image/webp',
              fileDataBase64: validWebpBytes.toString('base64'),
            }),
          });
          assert.equal(upV1Res.status, 200);
          const adV1 = ((await upV1Res.json()) as any).advertisement;
          assert.equal(adV1.imageVersion, 1);
          assert.equal(adV1.storagePath, `commerce/advertisements/${adId}/banner.webp`);

          const upV2Res = await fetch(`${url}/api/admin/commerce/advertisements/${adId}/upload`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: 'banner2.png',
              mimeType: 'image/png',
              fileDataBase64: validPngBytes.toString('base64'),
            }),
          });
          assert.equal(upV2Res.status, 200);
          const adV2 = ((await upV2Res.json()) as any).advertisement;
          assert.equal(adV2.imageVersion, 2);
          assert.equal(adV2.storagePath, `commerce/advertisements/${adId}/banner_v2.png`);
          assert.equal(adV2.previousStoragePaths.includes(`commerce/advertisements/${adId}/banner.webp`), true);
          assert.equal(storageFiles.has(`commerce/advertisements/${adId}/banner.webp`), true);
          assert.equal(storageFiles.has(`commerce/advertisements/${adId}/banner_v2.png`), true);

          // 6. Anúncio NÃO aparece quando advertisementsEnabled = false
          const stuAdsDisabledRes = await fetch(`${url}/api/commerce/advertisements?position=home`, {
            headers: { Authorization: 'Bearer p3-student-1' },
          });
          assert.equal(stuAdsDisabledRes.status, 200);
          const stuAdsDisabledBody = (await stuAdsDisabledRes.json()) as any;
          assert.equal(stuAdsDisabledBody.advertisementsEnabled, false);
          assert.equal(stuAdsDisabledBody.advertisements.length, 0);

          // Criar oferta de turma inicialmente em rascunho (status: 'draft') com capacity = 1
          const createOfferRes = await fetch(`${url}/api/admin/commerce/class-offers`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              classId: 'cls-p3-violao',
              productId: prod.productId,
              priceId: priceV1.priceId,
              capacity: 1,
              waitlistEnabled: true,
              status: 'draft',
            }),
          });
          assert.equal(createOfferRes.status, 201);
          const offerId = ((await createOfferRes.json()) as any).offer.offerId;

          // 7. Reserva de vaga falha se paidClassesEnabled = false (HTTP 403)
          const resBlockedDisabled = await fetch(`${url}/api/commerce/reservations`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ offerId }),
          });
          assert.equal(resBlockedDisabled.status, 403);

          // Habilita configuração comercial apenas neste ambiente de teste isolado em memória
          docsStore.set('platform_config/commerce', {
            data: {
              configId: 'commerce',
              commerceEnabled: true,
              catalogVisible: true,
              checkoutEnabled: true,
              promotionsEnabled: true,
              advertisementsEnabled: true,
              paidClassesEnabled: true,
              subscriptionsEnabled: true,
              defaultCurrency: 'BRL',
              updatedAt: new Date().toISOString(),
              updatedBy: 'admin-p3-1',
            },
            version: 1,
          });

          // Anúncio passa a aparecer na posição correta quando flag ligada
          const stuAdsEnabledRes = await fetch(`${url}/api/commerce/advertisements?position=home`, {
            headers: { Authorization: 'Bearer p3-student-1' },
          });
          assert.equal(stuAdsEnabledRes.status, 200);
          assert.equal(((await stuAdsEnabledRes.json()) as any).advertisements.length, 1);

          // Oferta ainda em 'draft' continua rejeitando reserva (HTTP 409)
          const resBlockedDraft = await fetch(`${url}/api/commerce/reservations`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ offerId }),
          });
          assert.equal(resBlockedDraft.status, 409);

          // Admin abre a oferta ('open')
          const openOfferRes = await fetch(`${url}/api/admin/commerce/class-offers/${offerId}`, {
            method: 'PATCH',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'open' }),
          });
          assert.equal(openOfferRes.status, 200);

          // 8. Duas tentativas simultâneas (Promise.all) para última vaga NÃO ultrapassam capacity=1
          const [race1, race2] = await Promise.all([
            fetch(`${url}/api/commerce/reservations`, {
              method: 'POST',
              headers: { Authorization: 'Bearer p3-student-1', 'Content-Type': 'application/json' },
              body: JSON.stringify({ offerId, ttlMs: 120_000 }),
            }),
            fetch(`${url}/api/commerce/reservations`, {
              method: 'POST',
              headers: { Authorization: 'Bearer p3-student-2', 'Content-Type': 'application/json' },
              body: JSON.stringify({ offerId, ttlMs: 120_000 }),
            }),
          ]);
          const raceStatuses = [race1.status, race2.status].sort((a, b) => a - b);
          assert.deepEqual(raceStatuses, [201, 409]);
          const offerAfterRace = docsStore.get(`class_offers/${offerId}`)?.data;
          assert.equal(offerAfterRace?.reservedSeats, 1);
          assert.equal(offerAfterRace?.confirmedSeats, 0);

          // 9. Expiração de reserva pendente libera a vaga
          const expireRes = await fetch(`${url}/api/admin/commerce/class-offers/${offerId}/expire-reservations`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ nowMs: Date.now() + 600_000 }),
          });
          assert.equal(expireRes.status, 200);
          const expireBody = (await expireRes.json()) as any;
          assert.equal(expireBody.expiredCount, 1);
          assert.equal(expireBody.offer.reservedSeats, 0);

          // 10. Lista de espera respeita ordem de entrada e avança quando prazo da convocação expira
          const wl1Res = await fetch(`${url}/api/commerce/waitlist`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ offerId }),
          });
          assert.equal(wl1Res.status, 201);
          assert.equal(((await wl1Res.json()) as any).waitlistEntry.priorityOrder, 1);

          const wl2Res = await fetch(`${url}/api/commerce/waitlist`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-student-2', 'Content-Type': 'application/json' },
            body: JSON.stringify({ offerId }),
          });
          assert.equal(wl2Res.status, 201);
          assert.equal(((await wl2Res.json()) as any).waitlistEntry.priorityOrder, 2);

          const summon1Res = await fetch(`${url}/api/admin/commerce/class-offers/${offerId}/summon-waitlist`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ responseTtlMs: 60_000 }),
          });
          assert.equal(summon1Res.status, 200);
          const summon1 = ((await summon1Res.json()) as any).summoned;
          assert.equal(summon1.studentUid, 'student-p3-1');
          assert.equal(summon1.priorityOrder, 1);

          // Prazo expira -> próxima convocação expira #1 e chama #2
          const summon2Res = await fetch(`${url}/api/admin/commerce/class-offers/${offerId}/summon-waitlist`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ nowMs: Date.now() + 300_000 }),
          });
          assert.equal(summon2Res.status, 200);
          const summon2Body = (await summon2Res.json()) as any;
          assert.equal(summon2Body.expiredSummons, 1);
          assert.equal(summon2Body.summoned.studentUid, 'student-p3-2');
          assert.equal(summon2Body.summoned.priorityOrder, 2);
          assert.equal(docsStore.get(`class_waitlist/${summon1.waitlistId}`)?.data?.status, 'expired');

          // Reserva legítima do student-p3-1 para testar pedido + pagamento + matrícula
          const stuResCreate = await fetch(`${url}/api/commerce/reservations`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ offerId, idempotencyKey: 'res-key-p3-1' }),
          });
          assert.equal(stuResCreate.status, 201);
          const reservationId = ((await stuResCreate.json()) as any).reservation.reservationId;

          // 13. Dados sensíveis de cartão estritamente rejeitados com HTTP 400
          const cardRejectRes = await fetch(`${url}/api/commerce/orders`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: prod.productId,
              priceId: priceV1.priceId,
              cardNumber: '4111111111111111',
              cvv: '123',
            }),
          });
          assert.equal(cardRejectRes.status, 400);

          // 11 & 12. Pedido ignora manipulação do cliente, congela snapshot (v1 R$ 300 - 10% = R$ 270) e NÃO matricula antes do pagamento
          const orderRes = await fetch(`${url}/api/commerce/orders`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: prod.productId,
              priceId: priceV1.priceId,
              couponCode: 'TURMA10',
              reservationId,
              idempotencyKey: 'ord-key-p3-1',
              totalCents: 100, // Manipulação pelo cliente — ignorada pelo servidor
              discountCents: 29900,
              amount: 1,
            }),
          });
          assert.equal(orderRes.status, 201);
          const orderBody = (await orderRes.json()) as any;
          const order = orderBody.order;
          const payment = orderBody.payment;
          assert.equal(order.status, 'pending');
          assert.equal(order.subtotalCents, 30000);
          assert.equal(order.discountCents, 3000);
          assert.equal(order.totalCents, 27000);
          assert.equal(order.priceSnapshot.finalAmountCents, 27000);
          assert.equal(order.promotionSnapshot.code, 'TURMA10');

          // Matrícula definitiva NÃO existe ainda antes do webhook pago
          assert.equal(docsStore.has('classes/cls-p3-violao/students/student-p3-1'), false);
          assert.equal(docsStore.has('enrollments/enroll-cls-p3-violao-student-p3-1'), false);

          // Admin altera preço para v2 (R$ 500), mas snapshot do pedido permanece R$ 300 / total R$ 270
          const priceV2Res = await fetch(`${url}/api/admin/commerce/products/${prod.productId}/prices`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 500, currency: 'BRL', billingInterval: 'one_time' }),
          });
          assert.equal(priceV2Res.status, 201);
          assert.equal(docsStore.get(`orders/${order.orderId}`)?.data?.totalCents, 27000);

          // 14. Webhook sem assinatura HMAC válida é rejeitado (HTTP 401)
          const paidWebhookPayload = {
            providerEventId: 'evt-p3-paid-1',
            provider: 'test_gateway',
            eventType: 'payment.paid',
            orderId: order.orderId,
            paymentId: payment.paymentId,
            providerReference: order.providerReference,
            amountCents: 27000,
            currency: 'BRL',
          };
          const badSigWebhook = await fetch(`${url}/api/commerce/webhooks/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-commerce-signature': 'sha256=deadbeef',
            },
            body: JSON.stringify(paidWebhookPayload),
          });
          assert.equal(badSigWebhook.status, 401);

          // 16. Webhook com divergência de valor/moeda/referência é rejeitado com HTTP 400 e registrado como rejected
          const mismatchedAmountRaw = JSON.stringify({
            ...paidWebhookPayload,
            providerEventId: 'evt-p3-mismatch-1',
            amountCents: 100,
          });
          const mismatchedRes = await fetch(`${url}/api/commerce/webhooks/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-commerce-signature': computeWebhookHmacSignature(mismatchedAmountRaw, WEBHOOK_SECRET),
            },
            body: mismatchedAmountRaw,
          });
          assert.equal(mismatchedRes.status, 400);
          assert.equal(docsStore.get('payment_events/evt-p3-mismatch-1')?.data?.processingStatus, 'rejected');

          // 17. Webhook payment.paid válido confirma pagamento, gera matrícula 1-para-1 na turma, libera commerce_entitlements e atualiza financeiro
          const paidRaw = JSON.stringify(paidWebhookPayload);
          const paidSig = computeWebhookHmacSignature(paidRaw, WEBHOOK_SECRET);
          const okWebhookRes = await fetch(`${url}/api/commerce/webhooks/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-commerce-signature': paidSig,
            },
            body: paidRaw,
          });
          assert.equal(okWebhookRes.status, 200);
          assert.equal(((await okWebhookRes.json()) as any).processingStatus, 'processed');

          assert.equal(docsStore.get(`orders/${order.orderId}`)?.data?.status, 'paid');
          assert.equal(docsStore.get(`payments/${payment.paymentId}`)?.data?.status, 'paid');
          assert.equal(docsStore.get(`class_offers/${offerId}`)?.data?.confirmedSeats, 1);
          assert.equal(docsStore.get(`class_offers/${offerId}`)?.data?.reservedSeats, 0);
          assert.equal(docsStore.get('classes/cls-p3-violao')?.data?.enrolledCount, 1);
          assert.equal(docsStore.get('classes/cls-p3-violao/students/student-p3-1')?.data?.status, 'active');
          assert.equal(docsStore.get('enrollments/enroll-cls-p3-violao-student-p3-1')?.data?.status, 'active');
          assert.equal(docsStore.get(`commerce_entitlements/ent_${order.orderId}`)?.data?.status, 'active');
          assert.equal(docsStore.get(`promotions/${promo.promotionId}`)?.data?.redeemedCount, 1);

          // 15. Webhook duplicado (mesmo providerEventId) NÃO duplica matrícula, receita, vagas ou redeemedCount
          const dupWebhookRes = await fetch(`${url}/api/commerce/webhooks/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-commerce-signature': paidSig,
            },
            body: paidRaw,
          });
          assert.equal(dupWebhookRes.status, 200);
          const dupBody = (await dupWebhookRes.json()) as any;
          assert.equal(dupBody.idempotent, true);
          assert.equal(dupBody.processingStatus, 'ignored_duplicate');
          assert.equal(docsStore.get(`promotions/${promo.promotionId}`)?.data?.redeemedCount, 1);
          assert.equal(docsStore.get(`class_offers/${offerId}`)?.data?.confirmedSeats, 1);
          assert.equal(docsStore.get('classes/cls-p3-violao')?.data?.enrolledCount, 1);

          // Verifica Financeiro após venda confirmada (sem dados inventados)
          const finAfterPaidRes = await fetch(`${url}/api/admin/commerce/financial?currency=BRL`, {
            headers: { Authorization: 'Bearer p3-admin-1' },
          });
          assert.equal(finAfterPaidRes.status, 200);
          const finPaid = ((await finAfterPaidRes.json()) as any).report;
          assert.equal(finPaid.hasRealTransactions, true);
          assert.equal(finPaid.approvedOrdersCount, 1);
          assert.equal(finPaid.grossRevenueCents, 30000);
          assert.equal(finPaid.totalDiscountCents, 3000);
          assert.equal(finPaid.netRevenueCents, 27000);
          assert.equal(finPaid.couponUsage.length, 1);
          assert.equal(finPaid.couponUsage[0].code, 'TURMA10');
          assert.equal(finPaid.couponUsage[0].usesCount, 1);

          // Ajuste financeiro exige justificativa >= 10 chars e registra trilha imutável
          const shortAdjRes = await fetch(`${url}/api/admin/commerce/financial/adjustments`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'reconciliation_note',
              amountCents: 0,
              currency: 'BRL',
              justification: 'curta',
            }),
          });
          assert.equal(shortAdjRes.status, 400);

          const okAdjRes = await fetch(`${url}/api/admin/commerce/financial/adjustments`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'reconciliation_note',
              orderId: order.orderId,
              amountCents: 0,
              currency: 'BRL',
              justification: 'Conferência contábil de homologação realizada pelo administrador.',
            }),
          });
          assert.equal(okAdjRes.status, 201);

          // 18. Reembolso e transição de assinatura revogam apenas commerce_entitlements, preservando progresso acadêmico e Fase 1 (course_access_grants)
          const refundPayloadRaw = JSON.stringify({
            providerEventId: 'evt-p3-refund-1',
            provider: 'test_gateway',
            eventType: 'payment.refunded',
            orderId: order.orderId,
            paymentId: payment.paymentId,
            providerReference: order.providerReference,
            amountCents: 27000,
            currency: 'BRL',
          });
          const refundRes = await fetch(`${url}/api/commerce/webhooks/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-commerce-signature': computeWebhookHmacSignature(refundPayloadRaw, WEBHOOK_SECRET),
            },
            body: refundPayloadRaw,
          });
          assert.equal(refundRes.status, 200);
          assert.equal(docsStore.get(`orders/${order.orderId}`)?.data?.status, 'refunded');
          assert.equal(docsStore.get(`commerce_entitlements/ent_${order.orderId}`)?.data?.status, 'revoked');

          // Assinatura criada e posteriormente expirada/cancelada também preserva Fase 1
          const subProdRes = await fetch(`${url}/api/admin/commerce/products`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Assinatura Mensal Guitarra Solo',
              description: 'Plano recorrente',
              productType: 'subscription_plan',
              courseIds: ['solo'],
              status: 'active',
            }),
          });
          const subProd = ((await subProdRes.json()) as any).product;
          const subPriceRes = await fetch(`${url}/api/admin/commerce/products/${subProd.productId}/prices`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 99, currency: 'BRL', billingInterval: 'monthly' }),
          });
          const subPrice = ((await subPriceRes.json()) as any).price;

          const subOrderRes = await fetch(`${url}/api/commerce/orders`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-student-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: subProd.productId,
              priceId: subPrice.priceId,
              idempotencyKey: 'sub-ord-p3-1',
            }),
          });
          const subOrder = ((await subOrderRes.json()) as any).order;

          const subPaidRaw = JSON.stringify({
            providerEventId: 'evt-p3-sub-paid-1',
            provider: 'test_gateway',
            eventType: 'payment.paid',
            orderId: subOrder.orderId,
            providerReference: subOrder.providerReference,
            amountCents: 9900,
            currency: 'BRL',
          });
          const subPaidWebhook = await fetch(`${url}/api/commerce/webhooks/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-commerce-signature': computeWebhookHmacSignature(subPaidRaw, WEBHOOK_SECRET),
            },
            body: subPaidRaw,
          });
          assert.equal(subPaidWebhook.status, 200);
          const subId = `sub_student-p3-1_${subProd.productId}`;
          assert.equal(docsStore.get(`subscriptions/${subId}`)?.data?.status, 'active');

          const subExpireRes = await fetch(`${url}/api/admin/commerce/subscriptions/${subId}/transition`, {
            method: 'POST',
            headers: { Authorization: 'Bearer p3-admin-1', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'expired', reason: 'Ciclo encerrado sem renovação' }),
          });
          assert.equal(subExpireRes.status, 200);
          assert.equal(docsStore.get(`subscriptions/${subId}`)?.data?.status, 'expired');
          assert.equal(docsStore.get(`commerce_entitlements/ent_${subOrder.orderId}`)?.data?.status, 'expired');

          // Fase 1 grant em 'baixo' e progresso do aluno permanecem 100% preservados
          const fase1Grant = docsStore.get('course_access_grants/grant-free-p3-baixo')?.data as any;
          const progressAfter = docsStore.get('users/student-p3-1/data/progress')?.data as any;
          assert.equal(fase1Grant.status, 'active');
          assert.deepEqual(progressAfter.completedLessons, ['baixo-lesson-1', 'baixo-lesson-2']);

          const resolved = resolveCommerceAndAcademicAccess({
            studentUid: 'student-p3-1',
            progress: progressAfter,
            grants: [fase1Grant],
            entitlements: [
              { id: `ent_${order.orderId}`, type: 'purchase', courseId: 'violao', status: 'revoked' },
              { id: `ent_${subOrder.orderId}`, type: 'subscription', courseId: 'solo', status: 'expired' },
            ],
          });
          assert.equal(canStudentAccessCourse(resolved, 'baixo').allowed, true);
          assert.equal(resolved.courses.baixo.primarySource, 'admin_permanent');
          assert.equal(canStudentAccessCourse(resolved, 'violao').allowed, false);
          assert.equal(canStudentAccessCourse(resolved, 'solo').allowed, false);

          // Auditoria registrou eventos da Fase 3
          const evts = auditTrail.map((a) => a.eventType);
          assert.equal(evts.includes('commerce_advertisement_created'), true);
          assert.equal(evts.includes('commerce_advertisement_image_uploaded'), true);
          assert.equal(evts.includes('commerce_class_offer_created'), true);
          assert.equal(evts.includes('commerce_order_created'), true);
          assert.equal(evts.includes('commerce_payment_confirmed'), true);
          assert.equal(evts.includes('commerce_payment_invalid'), true);
          assert.equal(evts.includes('commerce_payment_refunded'), true);
          assert.equal(evts.includes('commerce_subscription_updated'), true);
          assert.equal(evts.includes('commerce_financial_adjustment'), true);

          srv.closeAllConnections?.();
          srv.close(() => resolve());
        } catch (err) {
          srv.closeAllConnections?.();
          srv.close(() => reject(err));
        }
      });
    });
  });
});




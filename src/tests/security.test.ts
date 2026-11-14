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
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { fetchSystemRole, parseSystemRoleDoc } from '../services/firebase';
import { matchesAdminLogEventFilter } from '../services/adminLogsService';

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
});

describe('Firebase Emulator — Firestore Security Rules (Student vs Admin)', () => {
  let testEnv: RulesTestEnvironment | null = null;
  let emulatorAvailable = false;
  const { host, port } = parseEmulatorHost();

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
      // Verify that the endpoint actually responds as a Firestore Emulator
      await env.clearFirestore();
      testEnv = env;
      emulatorAvailable = true;
    } catch {
      testEnv = null;
      emulatorAvailable = false;
    }
  });

  after(async () => {
    if (!emulatorAvailable) {
      console.error(
        `[WARNING] Firebase Firestore Emulator indisponivel em ${host}:${port}. Os 5 testes de regras do Emulator foram IGNORADOS (NAO APROVADOS).`
      );
    }
    if (testEnv) {
      await testEnv.cleanup();
      testEnv = null;
    }
  });

  beforeEach(async () => {
    if (!testEnv) return;

    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();

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
      const msg = `Firebase Firestore Emulator not running at ${host}:${port} (NOT PASSED — skipped)`;
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

    const studentDb = env.authenticatedContext(STUDENT_UID).firestore();
    const teacherDb = env.authenticatedContext(TEACHER_UID).firestore();
    const adminDb = env.authenticatedContext(ADMIN_UID).firestore();
    const unauthDb = env.unauthenticatedContext().firestore();

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

    const studentDb = env.authenticatedContext(STUDENT_UID).firestore();
    const newStudentUid = 'student-new-signup';
    const newStudentDb = env.authenticatedContext(newStudentUid).firestore();

    // Student cannot update role, isAdmin, isTeacher, or permissions on their profile
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

    const studentDb = env.authenticatedContext(STUDENT_UID).firestore();

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
    const unauthDb = env.unauthenticatedContext().firestore();
    await assertFails(getDocs(collection(unauthDb, 'system_roles')));
    await assertFails(getDoc(doc(unauthDb, 'system_roles', STUDENT_UID)));
    await assertFails(getDocs(collection(unauthDb, 'users')));
    await assertFails(getDocs(collection(unauthDb, 'admin_logs')));
  });

  it('allows verified admin to query administrative collections while blocking teacher escalation', async (t) => {
    const env = requireEmulator(t);
    if (!env) return;

    const adminDb = env.authenticatedContext(ADMIN_UID).firestore();
    const teacherDb = env.authenticatedContext(TEACHER_UID).firestore();

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

    const studentDb = env.authenticatedContext(STUDENT_UID).firestore();
    const otherStudentDb = env.authenticatedContext(OTHER_STUDENT_UID).firestore();
    const otherTeacherDb = env.authenticatedContext(TEACHER_2_UID).firestore();

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

    // Valid self-enrollment in an active class with matching teacherId succeeds
    await assertSucceeds(
      setDoc(doc(studentDb, 'enrollments', 'enroll-legit-1'), {
        studentId: STUDENT_UID,
        classId: 'class-101',
        teacherId: TEACHER_UID,
        status: 'active',
      })
    );

    // Student can join an active class via classes/{classId}/students/{studentId} and then read that class
    await assertSucceeds(
      setDoc(doc(studentDb, 'classes', 'class-101', 'students', STUDENT_UID), {
        studentId: STUDENT_UID,
        classId: 'class-101',
        teacherId: TEACHER_UID,
        studentName: 'Aluno Teste',
      })
    );
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
      updateDoc(doc(studentDb, 'enrollments', 'enroll-legit-1'), {
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
    writeAdminLog: async () => {},
    listAdminLogs: async () => [],
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
});


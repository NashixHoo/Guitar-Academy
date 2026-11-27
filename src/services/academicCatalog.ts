// =========================================================================
// GUITAR ACADEMY — CATÁLOGO CANÔNICO E VALIDAÇÃO DE CURRÍCULO REAL
// src/services/academicCatalog.ts
// Isomórfico (Client + Node/Express). Deriva EXCLUSIVAMENTE dos módulos reais
// do projeto (ZERO IDs inventados).
// =========================================================================

import { OFFICIAL_COURSES, OFFICIAL_INSTRUMENTS } from '../academia/curriculo/mestreCurriculumRegistry';
import type { AcademicInstrument, AcademicInstrumentId } from '../academia/core/types';
import type { OfficialCourseId } from '../academia/progress/unlockGate';
import { VIOLAO_MODULES } from '../data/violaoCourse';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { SOLO_COURSE_STAGES } from '../data/soloCourse';
import { BASS_COURSE_LEVELS } from '../data/bassCourse';
import { KEYBOARD_COURSE_LEVELS } from '../data/keyboardCourse';
import { DRUMS_COURSE_LEVELS } from '../data/drumsCourse';
import type {
  AccessGrantScopeType,
  AccessGrantSource,
  AccessGrantType,
} from '../types/accessControl';

export interface CatalogLessonEntry {
  id: string;
  courseId: OfficialCourseId;
  instrumentId: AcademicInstrumentId;
  moduleId: string;
  moduleNumber: number;
  moduleTitle: string;
  lessonNumber: number;
  orderIndex: number; // Índice sequencial global dentro do curso (0-based)
  title: string;
  subtitle: string;
  estimatedMinutes: number;
}

export interface CatalogModuleEntry {
  id: string;
  courseId: OfficialCourseId;
  instrumentId: AcademicInstrumentId;
  moduleNumber: number;
  levelNumber?: number;
  title: string;
  subtitle: string;
  badge: string;
  lessons: CatalogLessonEntry[];
}

export interface CatalogCourseEntry {
  id: OfficialCourseId;
  instrumentId: AcademicInstrumentId;
  instrumentName: string;
  title: string;
  subtitle: string;
  totalModules: number;
  totalLessons: number;
  modules: CatalogModuleEntry[];
  lessons: CatalogLessonEntry[];
}

export interface CatalogInstrumentEntry {
  id: AcademicInstrumentId;
  name: string;
  description: string;
  courseIds: OfficialCourseId[];
}

function buildCatalog(): {
  instruments: CatalogInstrumentEntry[];
  courses: Record<OfficialCourseId, CatalogCourseEntry>;
  courseList: CatalogCourseEntry[];
} {
  const courseMap = {} as Record<OfficialCourseId, CatalogCourseEntry>;

  const registerCourse = (
    courseId: OfficialCourseId,
    rawModules: Array<{
      id: string;
      moduleNumber: number;
      levelNumber?: number;
      title: string;
      subtitle: string;
      badge: string;
      lessons: Array<{
        id: string;
        lessonNumber: number;
        title: string;
        subtitle: string;
        estimatedMinutes: number;
      }>;
    }>
  ) => {
    const officialCourse = OFFICIAL_COURSES.find((c) => c.id === courseId);
    const instrumentId: AcademicInstrumentId =
      (officialCourse?.instrumentId as AcademicInstrumentId) ||
      (courseId === 'canonical' || courseId === 'solo' ? 'guitarra' : (courseId as AcademicInstrumentId));
    const officialInstrument = OFFICIAL_INSTRUMENTS.find((i) => i.id === instrumentId);

    const modules: CatalogModuleEntry[] = [];
    const flatLessons: CatalogLessonEntry[] = [];
    let orderCursor = 0;

    for (const mod of rawModules) {
      const modLessons: CatalogLessonEntry[] = [];
      for (const l of mod.lessons) {
        const entry: CatalogLessonEntry = {
          id: l.id,
          courseId,
          instrumentId,
          moduleId: mod.id,
          moduleNumber: mod.moduleNumber,
          moduleTitle: mod.title,
          lessonNumber: l.lessonNumber,
          orderIndex: orderCursor++,
          title: l.title,
          subtitle: l.subtitle,
          estimatedMinutes: l.estimatedMinutes,
        };
        modLessons.push(entry);
        flatLessons.push(entry);
      }
      modules.push({
        id: mod.id,
        courseId,
        instrumentId,
        moduleNumber: mod.moduleNumber,
        levelNumber: mod.levelNumber,
        title: mod.title,
        subtitle: mod.subtitle,
        badge: mod.badge,
        lessons: modLessons,
      });
    }

    courseMap[courseId] = {
      id: courseId,
      instrumentId,
      instrumentName: officialInstrument?.name || instrumentId,
      title: officialCourse?.title || courseId,
      subtitle: officialCourse?.subtitle || '',
      totalModules: modules.length,
      totalLessons: flatLessons.length,
      modules,
      lessons: flatLessons,
    };
  };

  // 1. Violão (10 Módulos, 60 aulas)
  registerCourse(
    'violao',
    VIOLAO_MODULES.map((m) => ({
      id: m.id,
      moduleNumber: m.moduleNumber,
      title: m.title,
      subtitle: m.subtitle,
      badge: m.badge,
      lessons: m.lessons,
    }))
  );

  // 2. Guitarra Canônica (6 Níveis, 18 aulas)
  registerCourse(
    'canonical',
    CURRICULUM_LEVELS.map((lvl) => ({
      id: `canonical-level-${lvl.level}`,
      moduleNumber: lvl.level + 1,
      levelNumber: lvl.level,
      title: lvl.name,
      subtitle: lvl.subtitle,
      badge: lvl.badge,
      lessons: lvl.lessons,
    }))
  );

  // 3. Guitarra Solo (5 Etapas, 20 aulas)
  registerCourse(
    'solo',
    SOLO_COURSE_STAGES.map((stg) => ({
      id: stg.id,
      moduleNumber: stg.stageNumber,
      title: stg.title,
      subtitle: stg.subtitle,
      badge: stg.badge,
      lessons: stg.lessons,
    }))
  );

  // 4. Contrabaixo Elétrico (6 Módulos/Níveis, 18 aulas) — alinhado a baixoCurriculum.ts (`baixo-mod-0`..`5`)
  registerCourse(
    'baixo',
    BASS_COURSE_LEVELS.map((lvl) => ({
      id: `baixo-mod-${lvl.level}`,
      moduleNumber: lvl.level + 1,
      levelNumber: lvl.level,
      title: lvl.name,
      subtitle: lvl.subtitle,
      badge: lvl.badge,
      lessons: lvl.lessons,
    }))
  );

  // 5. Teclado e Piano (6 Módulos/Níveis, 18 aulas) — alinhado a tecladoCurriculum.ts (`teclado-mod-0`..`5`)
  registerCourse(
    'teclado',
    KEYBOARD_COURSE_LEVELS.map((lvl) => ({
      id: `teclado-mod-${lvl.level}`,
      moduleNumber: lvl.level + 1,
      levelNumber: lvl.level,
      title: lvl.name,
      subtitle: lvl.subtitle,
      badge: lvl.badge,
      lessons: lvl.lessons,
    }))
  );

  // 6. Bateria e Prática Rítmica (6 Módulos/Níveis, 18 aulas) — alinhado a bateriaCurriculum.ts (`bateria-mod-0`..`5`)
  registerCourse(
    'bateria',
    DRUMS_COURSE_LEVELS.map((lvl) => ({
      id: `bateria-mod-${lvl.level}`,
      moduleNumber: lvl.level + 1,
      levelNumber: lvl.level,
      title: lvl.name,
      subtitle: lvl.subtitle,
      badge: lvl.badge,
      lessons: lvl.lessons,
    }))
  );

  const courseList: CatalogCourseEntry[] = [
    courseMap.violao,
    courseMap.canonical,
    courseMap.solo,
    courseMap.baixo,
    courseMap.teclado,
    courseMap.bateria,
  ];

  const instruments: CatalogInstrumentEntry[] = OFFICIAL_INSTRUMENTS.map((inst: AcademicInstrument) => ({
    id: inst.id,
    name: inst.name,
    description: inst.description,
    courseIds: courseList.filter((c) => c.instrumentId === inst.id).map((c) => c.id),
  }));

  return { instruments, courses: courseMap, courseList };
}

const BUILT_CATALOG = buildCatalog();

export const ACADEMIC_CATALOG_INSTRUMENTS: CatalogInstrumentEntry[] = BUILT_CATALOG.instruments;
export const ACADEMIC_CATALOG_COURSES: Record<OfficialCourseId, CatalogCourseEntry> = BUILT_CATALOG.courses;
export const ACADEMIC_CATALOG_COURSE_LIST: CatalogCourseEntry[] = BUILT_CATALOG.courseList;

export const VALID_COURSE_IDS: OfficialCourseId[] = ['violao', 'canonical', 'solo', 'baixo', 'teclado', 'bateria'];
export const VALID_INSTRUMENT_IDS: AcademicInstrumentId[] = ['violao', 'guitarra', 'baixo', 'teclado', 'bateria'];

export function isValidCourseId(value: unknown): value is OfficialCourseId {
  return typeof value === 'string' && VALID_COURSE_IDS.includes(value as OfficialCourseId);
}

export function isValidInstrumentId(value: unknown): value is AcademicInstrumentId {
  return typeof value === 'string' && VALID_INSTRUMENT_IDS.includes(value as AcademicInstrumentId);
}

export function getCatalogCourse(courseId: string): CatalogCourseEntry | null {
  return isValidCourseId(courseId) ? ACADEMIC_CATALOG_COURSES[courseId] : null;
}

export function getCoursesForInstrument(instrumentId: string): CatalogCourseEntry[] {
  if (!isValidInstrumentId(instrumentId)) return [];
  return ACADEMIC_CATALOG_COURSE_LIST.filter((c) => c.instrumentId === instrumentId);
}

export function getModulesForCourse(courseId: string): CatalogModuleEntry[] {
  const course = getCatalogCourse(courseId);
  return course ? course.modules : [];
}

export function getCatalogModule(courseId: string, moduleId: string): CatalogModuleEntry | null {
  const course = getCatalogCourse(courseId);
  if (!course) return null;
  return course.modules.find((m) => m.id === moduleId) || null;
}

export function getCatalogLesson(lessonId: string, courseId?: string | null): CatalogLessonEntry | null {
  if (courseId) {
    const course = getCatalogCourse(courseId);
    if (!course) return null;
    return course.lessons.find((l) => l.id === lessonId) || null;
  }
  for (const course of ACADEMIC_CATALOG_COURSE_LIST) {
    const found = course.lessons.find((l) => l.id === lessonId);
    if (found) return found;
  }
  return null;
}

export function resolveLessonRangeIds(
  courseId: string,
  startLessonId: string,
  endLessonId: string
): { valid: boolean; lessonIds: string[]; error?: string } {
  const course = getCatalogCourse(courseId);
  if (!course) {
    return { valid: false, lessonIds: [], error: 'Curso oficial inválido ou não encontrado.' };
  }
  const startLesson = course.lessons.find((l) => l.id === startLessonId);
  const endLesson = course.lessons.find((l) => l.id === endLessonId);
  if (!startLesson || !endLesson) {
    return { valid: false, lessonIds: [], error: 'Aula inicial ou final do intervalo não pertence ao curso.' };
  }
  if (startLesson.orderIndex > endLesson.orderIndex) {
    return {
      valid: false,
      lessonIds: [],
      error: 'A aula inicial do intervalo deve anteceder ou coincidir com a aula final.',
    };
  }
  const lessonIds = course.lessons
    .slice(startLesson.orderIndex, endLesson.orderIndex + 1)
    .map((l) => l.id);

  return { valid: true, lessonIds };
}

export function mapGrantTypeToSource(grantType: AccessGrantType): AccessGrantSource {
  switch (grantType) {
    case 'temporary':
      return 'admin_temporary';
    case 'trial':
      return 'admin_trial';
    case 'special':
      return 'admin_special';
    case 'permanent':
    default:
      return 'admin_permanent';
  }
}

export interface GrantTargetValidationInput {
  scopeType: AccessGrantScopeType;
  courseId?: string | null;
  instrumentId?: string | null;
  moduleId?: string | null;
  lessonId?: string | null;
  rangeStartLessonId?: string | null;
  rangeEndLessonId?: string | null;
}

export interface ValidatedGrantTarget {
  valid: boolean;
  error?: string;
  courseId?: OfficialCourseId | null;
  instrumentId?: AcademicInstrumentId | null;
  moduleId?: string | null;
  lessonId?: string | null;
  rangeStartLessonId?: string | null;
  rangeEndLessonId?: string | null;
  lessonIds?: string[] | null;
}

export function validateGrantTarget(input: GrantTargetValidationInput): ValidatedGrantTarget {
  const { scopeType } = input;

  if (scopeType === 'instrument') {
    if (!isValidInstrumentId(input.instrumentId)) {
      return { valid: false, error: 'Instrumento oficial inválido ou não encontrado no catálogo.' };
    }
    return {
      valid: true,
      instrumentId: input.instrumentId,
      courseId: null,
      moduleId: null,
      lessonId: null,
      rangeStartLessonId: null,
      rangeEndLessonId: null,
      lessonIds: null,
    };
  }

  if (!input.courseId || !isValidCourseId(input.courseId)) {
    return { valid: false, error: 'Curso oficial inválido ou não encontrado no catálogo.' };
  }
  const course = getCatalogCourse(input.courseId)!;

  if (scopeType === 'course') {
    return {
      valid: true,
      courseId: course.id,
      instrumentId: course.instrumentId,
      moduleId: null,
      lessonId: null,
      rangeStartLessonId: null,
      rangeEndLessonId: null,
      lessonIds: null,
    };
  }

  if (scopeType === 'module') {
    const mod = input.moduleId ? getCatalogModule(course.id, input.moduleId) : null;
    if (!mod) {
      return { valid: false, error: 'Módulo selecionado não pertence ao curso informado.' };
    }
    return {
      valid: true,
      courseId: course.id,
      instrumentId: course.instrumentId,
      moduleId: mod.id,
      lessonId: null,
      rangeStartLessonId: null,
      rangeEndLessonId: null,
      lessonIds: mod.lessons.map((l) => l.id),
    };
  }

  if (scopeType === 'lesson') {
    const lesson = input.lessonId ? getCatalogLesson(input.lessonId, course.id) : null;
    if (!lesson) {
      return { valid: false, error: 'Aula selecionada não pertence ao curso informado.' };
    }
    return {
      valid: true,
      courseId: course.id,
      instrumentId: course.instrumentId,
      moduleId: lesson.moduleId,
      lessonId: lesson.id,
      rangeStartLessonId: null,
      rangeEndLessonId: null,
      lessonIds: [lesson.id],
    };
  }

  if (scopeType === 'lesson_range') {
    if (!input.rangeStartLessonId || !input.rangeEndLessonId) {
      return { valid: false, error: 'Informe a aula inicial e a aula final do intervalo.' };
    }
    const rangeRes = resolveLessonRangeIds(course.id, input.rangeStartLessonId, input.rangeEndLessonId);
    if (!rangeRes.valid) {
      return { valid: false, error: rangeRes.error };
    }
    return {
      valid: true,
      courseId: course.id,
      instrumentId: course.instrumentId,
      moduleId: null,
      lessonId: null,
      rangeStartLessonId: input.rangeStartLessonId,
      rangeEndLessonId: input.rangeEndLessonId,
      lessonIds: rangeRes.lessonIds,
    };
  }

  return { valid: false, error: 'Escopo de liberação inválido.' };
}

export function validatePlacementTarget(input: {
  courseId: string;
  moduleId?: string | null;
  lessonId?: string | null;
}): {
  valid: boolean;
  error?: string;
  courseId?: OfficialCourseId;
  moduleId?: string;
  moduleNumber?: number;
  lessonId?: string;
} {
  if (!isValidCourseId(input.courseId)) {
    return { valid: false, error: 'Curso inicial inválido ou não encontrado no catálogo.' };
  }
  const course = getCatalogCourse(input.courseId)!;

  let chosenModule = input.moduleId ? getCatalogModule(course.id, input.moduleId) : null;
  if (input.moduleId && !chosenModule) {
    return { valid: false, error: 'Módulo inicial não pertence ao curso selecionado.' };
  }

  let chosenLesson = input.lessonId ? getCatalogLesson(input.lessonId, course.id) : null;
  if (input.lessonId && !chosenLesson) {
    return { valid: false, error: 'Aula inicial não pertence ao curso selecionado.' };
  }

  if (chosenModule && chosenLesson && chosenLesson.moduleId !== chosenModule.id) {
    return { valid: false, error: 'A aula inicial selecionada não pertence ao módulo inicial informado.' };
  }

  if (!chosenLesson) {
    const sourceMod = chosenModule || course.modules[0];
    chosenLesson = sourceMod?.lessons[0] || course.lessons[0] || null;
  }
  if (!chosenLesson) {
    return { valid: false, error: 'Nenhuma aula disponível para o direcionamento selecionado.' };
  }
  if (!chosenModule) {
    chosenModule = getCatalogModule(course.id, chosenLesson.moduleId);
  }

  return {
    valid: true,
    courseId: course.id,
    moduleId: chosenModule?.id || chosenLesson.moduleId,
    moduleNumber: chosenModule?.moduleNumber || chosenLesson.moduleNumber,
    lessonId: chosenLesson.id,
  };
}

export function computeGrantIdempotencyKey(params: {
  studentUid: string;
  scopeType: AccessGrantScopeType;
  grantType: AccessGrantType;
  courseId?: string | null;
  instrumentId?: string | null;
  moduleId?: string | null;
  lessonId?: string | null;
  rangeStartLessonId?: string | null;
  rangeEndLessonId?: string | null;
  startsAtMs?: number | null;
  expiresAtMs?: number | null;
}): string {
  const parts = [
    params.studentUid.trim(),
    params.scopeType,
    params.grantType,
    params.instrumentId || '_',
    params.courseId || '_',
    params.moduleId || '_',
    params.lessonId || '_',
    params.rangeStartLessonId || '_',
    params.rangeEndLessonId || '_',
    params.startsAtMs ?? 'null',
    params.expiresAtMs ?? 'null',
  ];
  return parts.join('::');
}

export function computeDeterministicGrantDocId(idempotencyKey: string): string {
  // FNV-1a 64-bit hash pair -> deterministic Firestore-safe ID <= 128 chars
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < idempotencyKey.length; i++) {
    const ch = idempotencyKey.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= ch + i;
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return `grant_${h1.toString(36)}_${h2.toString(36)}`;
}

export function computePlacementDocId(studentUid: string, courseId: OfficialCourseId): string {
  return `place_${studentUid}_${courseId}`;
}

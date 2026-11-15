// =========================================================================
// GUITAR ACADEMY — FASE 1: SISTEMA DE CONTROLE ACADÊMICO E LIBERAÇÃO DE ACESSO
// src/types/accessControl.ts
// Tipos canônicos para Concessões de Acesso, Direcionamento Inicial e
// Resolução Central de Autorização.
// =========================================================================

import type { OfficialCourseId } from '../academia/progress/unlockGate';
import type { AcademicInstrumentId } from '../academia/core/types';

export type AccessGrantScopeType =
  | 'course'
  | 'instrument'
  | 'module'
  | 'lesson'
  | 'lesson_range';

export type AccessGrantType =
  | 'permanent'
  | 'temporary'
  | 'trial'
  | 'special';

export type AccessGrantSource =
  | 'admin_permanent'
  | 'admin_temporary'
  | 'admin_trial'
  | 'admin_special';

export type AccessGrantStatus =
  | 'active'
  | 'suspended'
  | 'revoked'
  | 'expired';

export type AccessResolutionSource =
  | 'admin_role'
  | 'admin_special'
  | 'admin_temporary'
  | 'admin_trial'
  | 'admin_permanent'
  | 'purchase'
  | 'subscription'
  | 'enrollment'
  | 'progress_primary'
  | 'progress_merit_50';

export interface CourseAccessGrant {
  id: string;
  studentUid: string;
  scopeType: AccessGrantScopeType;
  grantType: AccessGrantType;
  source: AccessGrantSource;
  status: AccessGrantStatus;
  courseId?: OfficialCourseId | null;
  instrumentId?: AcademicInstrumentId | null;
  moduleId?: string | null;
  lessonId?: string | null;
  rangeStartLessonId?: string | null;
  rangeEndLessonId?: string | null;
  lessonIds?: string[] | null;
  startsAt?: string | null;
  startsAtMs?: number | null;
  expiresAt?: string | null;
  expiresAtMs?: number | null;
  reason?: string | null;
  idempotencyKey: string;
  grantedBy: string;
  grantedByEmail?: string | null;
  revokedBy?: string | null;
  revokedAt?: string | null;
  statusReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type StudentPlacementMode = 'custom_start' | 'default_path';
export type StudentPlacementStatus = 'active' | 'cleared';

export interface StudentAcademicPlacement {
  id: string;
  studentUid: string;
  courseId: OfficialCourseId;
  moduleId?: string | null;
  moduleNumber?: number | null;
  lessonId: string;
  mode: StudentPlacementMode;
  status: StudentPlacementStatus;
  reason?: string | null;
  assignedBy: string;
  assignedByEmail?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalCourseEntitlement {
  id?: string;
  type: 'purchase' | 'subscription';
  courseId: OfficialCourseId;
  status: 'active' | 'expired' | 'revoked' | 'cancelled';
  expiresAt?: string | null;
  expiresAtMs?: number | null;
  referenceId?: string | null;
}

export interface EffectiveGrantOrigin {
  source: AccessResolutionSource;
  label: string;
  grantId?: string;
  scopeType?: AccessGrantScopeType;
  expiresAt?: string | null;
  expiresAtMs?: number | null;
  reason?: string | null;
}

export interface EffectiveLessonAccess {
  lessonId: string;
  courseId: OfficialCourseId;
  moduleId: string;
  allowed: boolean;
  primarySource: AccessResolutionSource | null;
  origins: EffectiveGrantOrigin[];
  blockedReason?: string;
}

export interface EffectiveModuleAccess {
  moduleId: string;
  courseId: OfficialCourseId;
  moduleNumber: number;
  fullModuleUnlocked: boolean;
  hasAnyLessonUnlocked: boolean;
  unlockedLessonIds: string[];
  primarySource: AccessResolutionSource | null;
  origins: EffectiveGrantOrigin[];
}

export interface EffectiveCourseAccess {
  courseId: OfficialCourseId;
  fullCourseUnlocked: boolean;
  hasAnyAccess: boolean;
  unlockedModuleIds: string[];
  unlockedLessonIds: string[];
  primarySource: AccessResolutionSource | null;
  origins: EffectiveGrantOrigin[];
  lockReason?: string;
  lessons: Record<string, EffectiveLessonAccess>;
  modules: Record<string, EffectiveModuleAccess>;
}

export interface ResolvedInitialPlacement {
  placementId: string;
  courseId: OfficialCourseId;
  moduleId: string;
  moduleNumber: number;
  lessonId: string;
  reason?: string | null;
  assignedBy: string;
  assignedByEmail?: string | null;
  updatedAt: string;
  isAccessible: boolean;
}

export interface StudentEffectiveAccessSnapshot {
  studentUid: string;
  evaluatedAtMs: number;
  courses: Record<OfficialCourseId, EffectiveCourseAccess>;
  activeGrants: CourseAccessGrant[];
  inactiveGrants: Array<CourseAccessGrant & { effectiveStatus: AccessGrantStatus }>;
  activePlacementsByCourse: Partial<Record<OfficialCourseId, ResolvedInitialPlacement>>;
  primaryPlacement: ResolvedInitialPlacement | null;
}

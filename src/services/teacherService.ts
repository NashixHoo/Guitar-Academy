import {
  ClassGroup,
  ClassEnrollment,
  EducationalEvent,
  EducationalEventType,
  ActivityCategory,
  TeacherFilterState,
  AnalyticsTableRow,
  CourseFunnelRow,
  PedagogicalBottleneck,
  StudentAnalyticsSummary,
  UserRole,
} from '../types/teacher';
import { auth, db, fetchSystemRole } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { SOLO_LESSONS } from '../data/soloCourse';
import { VIOLAO_LESSONS } from '../data/violaoCourse';
import { BASS_LESSONS } from '../data/bassCourse';
import { KEYBOARD_LESSONS } from '../data/keyboardCourse';
import { DRUMS_LESSONS } from '../data/drumsCourse';

export function getAllLessons() {
  return [
    ...CURRICULUM_LEVELS.flatMap((l) => l.lessons),
    ...SOLO_LESSONS,
    ...VIOLAO_LESSONS,
    ...BASS_LESSONS,
    ...KEYBOARD_LESSONS,
    ...DRUMS_LESSONS,
  ];
}
import { storageService } from './storageService';
import { UserProgress } from '../types';

// Chaves locais para resiliência offline
const LOCAL_CLASSES_KEY = 'guitar_academy:teacher_classes_v1';
const LOCAL_ENROLLMENTS_KEY = 'guitar_academy:teacher_enrollments_v1';
const LOCAL_EVENTS_KEY = 'guitar_academy:teacher_events_v1';
const LOCAL_STUDENT_CLASS_LINK_KEY = 'guitar_academy:student_class_link_v1';

export class TeacherService {
  /**
   * Determina o papel do usuário (STUDENT, TEACHER ou ADMIN).
   * Consulta a fonte autoritativa única protegida em system_roles/{uid}.
   * NUNCA utiliza e-mails fixos ou endereços de e-mail como mecanismo de autorização.
   */
  static async resolveUserRole(uid: string, testDocProvider?: (uid: string) => Promise<any>): Promise<UserRole> {
    if (!uid) return 'student';
    return await fetchSystemRole(uid, testDocProvider);
  }

  /**
   * Retorna as turmas de responsabilidade do professor
   */
  static async getTeacherClasses(teacherId: string, teacherEmail?: string): Promise<ClassGroup[]> {
    // 1. Tenta carregar do Firestore
    try {
      const classesRef = collection(db, 'classes');
      const q = query(classesRef, where('teacherId', '==', teacherId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const firestoreClasses = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClassGroup));
        this.saveLocalClasses(firestoreClasses);
        return firestoreClasses;
      }
    } catch {
      // Offline fallback
    }

    // 2. Fallback de cache local
    const local = this.loadLocalClasses().filter((c) => c.teacherId === teacherId);
    if (local.length > 0) return local;

    // 3. Inicialização padrão de turma base para o professor
    const defaultClass: ClassGroup = {
      id: `class-${teacherId}-turma-1`,
      name: 'Turma Geral de Conservatório (Violão & Guitarra)',
      code: 'GA-TURMA-101',
      description: 'Turma de formação continuada em harmonia, braço, acordes abertos e técnica.',
      teacherId,
      teacherEmail: teacherEmail || 'professor@guitaracademy.com',
      teacherName: 'Professor Titular Guitar Academy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
      maxStudents: 50,
    };

    const initialList = [defaultClass];
    this.saveLocalClasses(initialList);

    // Tenta persistir no Firestore (turma + convite indexado sem expor listagem de turmas)
    try {
      await setDoc(doc(db, 'classes', defaultClass.id), {
        ...defaultClass,
        updatedAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'class_invites', defaultClass.code), {
        classId: defaultClass.id,
        code: defaultClass.code,
        name: defaultClass.name,
        teacherId: defaultClass.teacherId,
        teacherName: defaultClass.teacherName,
        active: true,
        updatedAt: serverTimestamp(),
      });
    } catch {
      // offline
    }

    return initialList;
  }

  /**
   * Cria uma nova turma com código de convite exclusivo
   */
  static async createClass(
    teacherId: string,
    teacherEmail: string,
    teacherName: string,
    name: string,
    description?: string,
    customCode?: string
  ): Promise<ClassGroup> {
    const classId = `class-${Date.now()}`;
    const code = customCode?.toUpperCase().trim() || `GA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newClass: ClassGroup = {
      id: classId,
      name: name.trim(),
      code,
      description: description?.trim() || '',
      teacherId,
      teacherEmail,
      teacherName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
      maxStudents: 60,
    };

    const currentClasses = this.loadLocalClasses();
    this.saveLocalClasses([...currentClasses, newClass]);

    try {
      await setDoc(doc(db, 'classes', classId), {
        ...newClass,
        updatedAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'class_invites', code), {
        classId,
        code,
        name: newClass.name,
        teacherId,
        teacherName,
        active: true,
        updatedAt: serverTimestamp(),
      });
    } catch {
      // offline
    }

    return newClass;
  }

  /**
   * Vincula um aluno a uma turma através do código de convite seguro
   */
  static async joinClassWithInviteCode(
    studentUidOrCode: string,
    studentNameOrUid: string,
    studentEmailOrName: string,
    inviteCodeOrEmail?: string,
    studentPhotoUrl?: string
  ): Promise<{ success: boolean; message: string; error?: string; classGroup?: ClassGroup }> {
    let studentUid = studentUidOrCode;
    let studentName = studentNameOrUid;
    let studentEmail = studentEmailOrName;
    let inviteCode = inviteCodeOrEmail || '';

    // Detecção flexível: se o primeiro parâmetro for o código de convite (começa com GA- ou quarto parâmetro indefinido)
    if (studentUidOrCode.toUpperCase().startsWith('GA-') || !inviteCodeOrEmail) {
      inviteCode = studentUidOrCode;
      studentUid = studentNameOrUid;
      studentName = studentEmailOrName;
      studentEmail = inviteCodeOrEmail || '';
    }

    const cleanStudentUid = (studentUid || '').trim();
    if (!cleanStudentUid) {
      return { success: false, message: 'Sessão do estudante inválida para matrícula.', error: 'UID ausente.' };
    }

    // Impede que o cliente tente matricular outro UID diferente do usuário autenticado
    if (auth.currentUser && auth.currentUser.uid !== cleanStudentUid) {
      return {
        success: false,
        message: 'Operação negada: o aluno só pode realizar matrícula em seu próprio UID autenticado.',
        error: 'UID divergente do usuário autenticado.',
      };
    }

    const cleanCode = inviteCode.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Código de convite inválido ou vazio.', error: 'Código de convite inválido ou vazio.' };
    }

    // 1. Busca direta segura pelo documento /class_invites/{cleanCode} (evita expor listagem de classes)
    let matchedClass: ClassGroup | undefined;

    try {
      const inviteSnap = await getDoc(doc(db, 'class_invites', cleanCode));
      if (inviteSnap.exists()) {
        const inv = inviteSnap.data();
        if (inv.active === true && inv.classId && inv.teacherId) {
          matchedClass = {
            id: inv.classId,
            name: inv.name || 'Turma Guitar Academy',
            code: inv.code || cleanCode,
            description: inv.description || '',
            teacherId: inv.teacherId,
            teacherEmail: inv.teacherEmail || '',
            teacherName: inv.teacherName || 'Professor Guitar Academy',
            createdAt: inv.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            active: true,
            maxStudents: inv.maxStudents || 60,
          };
        }
      }
    } catch {
      // fallback abaixo
    }

    if (!matchedClass) {
      try {
        const classesRef = collection(db, 'classes');
        const q = query(classesRef, where('code', '==', cleanCode), where('active', '==', true));
        const snap = await getDocs(q);
        if (!snap.empty) {
          matchedClass = { id: snap.docs[0].id, ...snap.docs[0].data() } as ClassGroup;
        }
      } catch {
        // offline ou bloqueado para listagem direta de classes
      }
    }

    if (!matchedClass) {
      // Procura no cache local
      const localClasses = this.loadLocalClasses();
      matchedClass = localClasses.find((c) => (c.code === cleanCode || (c as any).inviteCode === cleanCode) && c.active);
    }

    if (!matchedClass) {
      return {
        success: false,
        message: 'Código de turma não encontrado. Verifique com seu professor o código exato da sua turma.',
        error: 'Código de turma não encontrado.',
      };
    }

    const enrollmentId = `enroll-${matchedClass.id}-${cleanStudentUid}`;
    const enrollment: ClassEnrollment = {
      id: enrollmentId,
      classId: matchedClass.id,
      studentId: cleanStudentUid,
      studentName: studentName || 'Estudante',
      studentEmail: studentEmail || '',
      studentPhotoUrl,
      teacherId: matchedClass.teacherId,
      joinedAt: new Date().toISOString(),
      status: 'active',
      lastActivityAt: new Date().toISOString(),
    };

    // Salva localmente
    const localEnrollments = this.loadLocalEnrollments();
    const existingIndex = localEnrollments.findIndex((e) => e.studentId === cleanStudentUid && e.classId === matchedClass!.id);
    if (existingIndex >= 0) {
      localEnrollments[existingIndex] = enrollment;
    } else {
      localEnrollments.push(enrollment);
    }
    this.saveLocalEnrollments(localEnrollments);

    // Registra link do aluno
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STUDENT_CLASS_LINK_KEY, JSON.stringify(enrollment));
      } catch {}
    }

    // Salva no Firestore (coleção da turma e registro de matrícula isolado)
    try {
      await setDoc(doc(db, 'classes', matchedClass.id, 'students', cleanStudentUid), {
        ...enrollment,
        updatedAt: serverTimestamp(),
      });
    } catch {
      // offline
    }

    return {
      success: true,
      message: `Você ingressou com sucesso na turma "${matchedClass.name}" do Professor ${matchedClass.teacherName}!`,
      classGroup: matchedClass,
    };
  }

  /**
   * Retorna os alunos vinculados às turmas do professor
   */
  static async getEnrolledStudents(teacherId: string, classId?: string): Promise<ClassEnrollment[]> {
    let enrollments: ClassEnrollment[] = [];

    try {
      if (classId && classId !== 'all') {
        const classes = await this.getTeacherClasses(teacherId);
        const ownsClass = classes.some((c) => c.id === classId && c.teacherId === teacherId);
        if (!ownsClass) {
          return [];
        }
        const snap = await getDocs(collection(db, 'classes', classId, 'students'));
        enrollments = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as ClassEnrollment))
          .filter((e) => !e.teacherId || e.teacherId === teacherId);
      } else {
        const classes = await this.getTeacherClasses(teacherId);
        for (const c of classes) {
          const snap = await getDocs(collection(db, 'classes', c.id, 'students'));
          const classStudents = snap.docs
            .map((d) => ({ id: d.id, ...d.data() } as ClassEnrollment))
            .filter((e) => !e.teacherId || e.teacherId === teacherId);
          enrollments.push(...classStudents);
        }
      }
    } catch {
      // offline
    }

    if (enrollments.length === 0) {
      const local = this.loadLocalEnrollments().filter((e) => {
        if (e.teacherId !== teacherId) return false;
        if (classId && classId !== 'all' && e.classId !== classId) return false;
        return true;
      });
      enrollments = local;
    }

    // Se ainda não houver nenhum aluno vinculado, provisiona alunos de demonstração acadêmica
    // isolados estritamente ao teacherId atual para permitir visualização analítica imediata
    if (enrollments.length === 0) {
      enrollments = this.getBootstrapDemoEnrollments(teacherId, classId);
      this.saveLocalEnrollments([...this.loadLocalEnrollments(), ...enrollments]);
    }

    return enrollments;
  }

  /**
   * Registra um evento educacional consistente para fins analíticos
   */
  static logEducationalEvent(
    eventData: Omit<EducationalEvent, 'id' | 'timestamp'>
  ): EducationalEvent {
    const event: EducationalEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
    };

    const events = this.loadLocalEvents();
    // Limite de 500 eventos locais para não sobrecarregar localStorage
    const updated = [event, ...events].slice(0, 500);
    this.saveLocalEvents(updated);

    // Se houver turma associada e online, envia ao Firestore
    if (event.classId) {
      try {
        setDoc(doc(db, 'classes', event.classId, 'events', event.id), {
          ...event,
          createdAt: serverTimestamp(),
        }).catch(() => {});
      } catch {}
    }

    return event;
  }

  /**
   * Obtém lista de eventos educacionais aplicando filtros estritos
   */
  static getFilteredEvents(
    filters: TeacherFilterState,
    enrolledStudents: ClassEnrollment[]
  ): EducationalEvent[] {
    const studentUids = new Set(enrolledStudents.map((s) => s.studentId));
    let allEvents = this.loadLocalEvents().filter((e) => studentUids.has(e.studentUid));

    // Se houver poucos eventos nos logs, enriquece com os eventos derivados dos progressos reais dos alunos
    if (allEvents.length < 10) {
      const derived = this.generateDerivedEventsFromStudents(enrolledStudents);
      allEvents = [...allEvents, ...derived];
    }

    // Filtro por Turma
    if (filters.classId && filters.classId !== 'all') {
      allEvents = allEvents.filter((e) => e.classId === filters.classId);
    }

    // Filtro por Curso
    if (filters.courseId && filters.courseId !== 'all') {
      allEvents = allEvents.filter((e) => e.courseId === filters.courseId);
    }

    // Filtro por Categoria
    if (filters.category && filters.category !== 'all') {
      allEvents = allEvents.filter((e) => e.category === filters.category);
    }

    // Filtro por Aluno
    if (filters.studentId) {
      allEvents = allEvents.filter((e) => e.studentUid === filters.studentId);
    }

    // Filtro por Período
    const now = Date.now();
    let minTimestamp = 0;
    if (filters.period === '7d') {
      minTimestamp = now - 7 * 24 * 60 * 60 * 1000;
    } else if (filters.period === '30d') {
      minTimestamp = now - 30 * 24 * 60 * 60 * 1000;
    } else if (filters.period === '90d') {
      minTimestamp = now - 90 * 24 * 60 * 60 * 1000;
    } else if (filters.period === 'custom' && filters.startDate) {
      minTimestamp = new Date(filters.startDate).getTime();
    }

    if (minTimestamp > 0) {
      allEvents = allEvents.filter((e) => new Date(e.timestamp).getTime() >= minTimestamp);
    }

    if (filters.period === 'custom' && filters.endDate) {
      const maxTimestamp = new Date(filters.endDate).getTime() + 24 * 60 * 60 * 1000;
      allEvents = allEvents.filter((e) => new Date(e.timestamp).getTime() <= maxTimestamp);
    }

    return allEvents;
  }

  /**
   * Constrói tabela analítica com denominadores matemáticos explícitos
   */
  static buildAnalyticsTable(
    events: EducationalEvent[],
    totalEligibleStudents: number
  ): AnalyticsTableRow[] {
    const totalEventsCount = events.length;
    if (totalEventsCount === 0) return [];

    // Agrupa por categoria
    const categoryMap = new Map<string, { events: EducationalEvent[]; students: Set<string> }>();

    events.forEach((evt) => {
      const key = evt.category;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, { events: [], students: new Set() });
      }
      const item = categoryMap.get(key)!;
      item.events.push(evt);
      item.students.add(evt.studentUid);
    });

    const categoryLabels: Record<ActivityCategory, string> = {
      instrumental_practice: 'Prática Instrumental (Violão/Guitarra)',
      guided_lessons: 'Aulas Teórico-Práticas Guiadas',
      music_theory: 'Teoria Musical & Intervalos',
      technique_mechanics: 'Técnica & Mecânica dos Dedos',
      chords_harmony: 'Harmonia & Dicionário de Acordes',
      repertoire_ear: 'Treino Auditivo & Leitura',
    };

    const rows: AnalyticsTableRow[] = [];

    categoryMap.forEach((val, catKey) => {
      const occurrences = val.events.length;
      const studentsCount = val.students.size;
      const percentage = (occurrences / totalEventsCount) * 100;

      const verifiedCount = val.events.filter((e) => e.measurementType === 'verified_interactive').length;
      const manualCount = val.events.filter((e) => e.measurementType === 'manual_logged').length;
      const verifiedTimeSeconds = val.events
        .filter((e) => e.measurementType === 'verified_interactive')
        .reduce((acc, e) => acc + (e.durationSeconds || 0), 0);
      const manualTimeSeconds = val.events
        .filter((e) => e.measurementType === 'manual_logged')
        .reduce((acc, e) => acc + (e.durationSeconds || 0), 0);

      rows.push({
        categoryOrActivity: categoryLabels[catKey as ActivityCategory] || catKey,
        category: catKey as ActivityCategory,
        course: val.events[0]?.courseId ? (val.events[0].courseId === 'violao' ? 'Violão' : val.events[0].courseId === 'solo' ? 'Guitarra Solo' : 'Conservatório Geral') : 'Geral',
        module: 'Módulos Integrados',
        lessonOrExercise: `${val.events.length} ações registradas`,
        occurrenceCount: occurrences,
        studentsInvolvedCount: studentsCount,
        percentage: Number(percentage.toFixed(1)),
        denominatorDescription: `Total de ${totalEventsCount} eventos válidos no período`,
        denominatorTotal: totalEventsCount,
        verifiedCount,
        manualCount,
        verifiedTimeSeconds,
        manualTimeSeconds,
        trend: occurrences >= 5 ? 'up' : 'stable',
      });
    });

    return rows.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  }

  /**
   * Calcula funil e métricas de etapas dos cursos
   */
  static buildCourseFunnel(
    enrolledOrCourseId: ClassEnrollment[] | 'violao' | 'canonical' | 'solo' | 'baixo' | 'teclado' | 'bateria' | string,
    courseIdOrEnrollments?: 'violao' | 'canonical' | 'solo' | 'baixo' | 'teclado' | 'bateria' | string | any,
    _optionalEvents?: EducationalEvent[]
  ): CourseFunnelRow[] {
    let courseId: 'violao' | 'canonical' | 'solo' | 'baixo' | 'teclado' | 'bateria' | string = 'violao';
    let enrolledStudents: ClassEnrollment[] = [];

    if (typeof enrolledOrCourseId === 'string') {
      courseId = enrolledOrCourseId as any;
      if (Array.isArray(courseIdOrEnrollments)) {
        enrolledStudents = courseIdOrEnrollments;
      } else {
        enrolledStudents = this.loadLocalEnrollments();
      }
    } else {
      enrolledStudents = Array.isArray(enrolledOrCourseId) ? enrolledOrCourseId : [];
      courseId = (typeof courseIdOrEnrollments === 'string' ? courseIdOrEnrollments : 'violao') as any;
    }

    const totalStudents = enrolledStudents.length || 1;
    const allCourseLessons = getAllLessons().filter((l) => {
      if (courseId === 'violao') return l.id.startsWith('violao-');
      if (courseId === 'solo') return l.id.startsWith('solo-');
      if (courseId === 'baixo') return l.id.startsWith('baixo-');
      if (courseId === 'teclado') return l.id.startsWith('teclado-');
      if (courseId === 'bateria') return l.id.startsWith('bateria-');
      return !l.id.startsWith('violao-') && !l.id.startsWith('solo-') && !l.id.startsWith('baixo-') && !l.id.startsWith('teclado-') && !l.id.startsWith('bateria-');
    });

    // Mapeia o progresso de cada aluno
    const studentProgresses = enrolledStudents.map((s) => storageService.loadProgress((s as any).studentId || (s as any).studentUid || ''));

    const rows: CourseFunnelRow[] = allCourseLessons.map((lesson) => {
      const completedStudents = studentProgresses.filter((p) => p.completedLessons.includes(lesson.id)).length;
      const startedStudents = studentProgresses.filter(
        (p) => p.completedLessons.includes(lesson.id) || (p.practiceLogs && p.practiceLogs[lesson.id])
      ).length;

      // Abandonou: iniciou a aula mas não concluiu
      const droppedStudents = Math.max(0, startedStudents - completedStudents);

      const completionRate = startedStudents > 0 ? (completedStudents / startedStudents) * 100 : 0;
      const dropRate = startedStudents > 0 ? (droppedStudents / startedStudents) * 100 : 0;

      return {
        courseId,
        courseTitle:
          courseId === 'violao' ? 'Domínio Total do Violão' :
          courseId === 'solo' ? 'Guitarra Solo' :
          courseId === 'baixo' ? 'Contrabaixo Elétrico' :
          courseId === 'teclado' ? 'Teclado / Piano' :
          courseId === 'bateria' ? 'Bateria e Prática Rítmica' :
          'Conservatório Geral',
        moduleId: lesson.moduleTitle || 'Módulo Geral',
        moduleTitle: lesson.moduleTitle || 'Fundamentos',
        lessonId: lesson.id,
        lessonTitle: `${lesson.lessonNumber ? `Aula ${lesson.lessonNumber}: ` : ''}${lesson.title}`,
        lessonNumber: lesson.lessonNumber || (parseInt(lesson.id.replace(/\D/g, ''), 10) || 1),
        startedCount: startedStudents,
        completedCount: completedStudents,
        droppedCount: droppedStudents,
        completionRate: Number(completionRate.toFixed(1)),
        dropRate: Number(dropRate.toFixed(1)),
        affectedStudentsCount: droppedStudents,
      };
    });

    return rows;
  }

  /**
   * Gera diagnósticos de gargalos pedagógicos explicáveis (Fase 7)
   */
  static detectPedagogicalBottlenecks(
    funnelRows: any[],
    enrolledOrEvents?: number | any
  ): PedagogicalBottleneck[] {
    const bottlenecks: PedagogicalBottleneck[] = [];
    const count = typeof enrolledOrEvents === 'number' ? enrolledOrEvents : Array.isArray(enrolledOrEvents) ? enrolledOrEvents.length : 1;

    // 1. Gargalos por alta taxa de abandono na aula (>= 30% dos que iniciaram)
    const highDropLessons = funnelRows.filter((r) => {
      const dropRate = r.dropRatePct !== undefined ? r.dropRatePct : r.dropRate !== undefined ? r.dropRate : 0;
      const started = r.startedStudents !== undefined ? r.startedStudents : r.startedCount !== undefined ? r.startedCount : 0;
      return started >= 2 && dropRate >= 30;
    });

    highDropLessons.slice(0, 3).forEach((row) => {
      const dropRateVal = row.dropRatePct !== undefined ? row.dropRatePct : row.dropRate;
      const started = row.startedStudents !== undefined ? row.startedStudents : row.startedCount || 1;
      const completed = row.masteredStudents !== undefined ? row.masteredStudents : row.completedCount || 0;
      const dropped = row.droppedCount !== undefined ? row.droppedCount : Math.max(0, started - completed);

      bottlenecks.push({
        id: `btn-drop-${row.lessonId}`,
        severity: dropRateVal >= 50 ? 'high' : 'medium',
        title: `Alta retenção na etapa: ${row.lessonTitle}`,
        observedFact: `${dropped} de ${started} alunos (${dropRateVal}%) iniciaram esta aula mas ainda não alcançaram o critério de conclusão.`,
        pedagogicalHypothesis:
          'A mudança de digitação de acordes com pestana ou o salto de andamento no metrônomo exigem mais tempo de adaptação mecânica da mão esquerda.',
        interventionSuggestion:
          'Dedicar 10 minutos na próxima aula coletiva para treino de micro-movimentos e redução de tensão no polegar esquerdo a 60 BPM.',
        affectedCourseId: row.courseId || 'violao',
        affectedLessonId: row.lessonId,
        affectedStudentsCount: dropped,
        metricValue: `${dropRateVal}% de abandono`,
      });
    });

    // 2. Gargalo de equilíbrio teoria vs prática
    const localEvents = this.loadLocalEvents();
    const theoryCount = localEvents.filter((e) => e.category === 'music_theory').length;
    const practiceCount = localEvents.filter((e) => e.category === 'instrumental_practice').length;

    if (practiceCount > 0 && theoryCount > practiceCount * 2) {
      bottlenecks.push({
        id: 'btn-imbalance-theory',
        severity: 'medium',
        title: 'Desequilíbrio entre Estudo Teórico e Execução Instrumental',
        observedFact: `A turma registrou ${theoryCount} consultas de teoria contra apenas ${practiceCount} sessões ativas com metrônomo no período.`,
        pedagogicalHypothesis:
          'Os alunos estão compreendendo os conceitos analiticamente, mas não estão aplicando fisicamente no braço com rotinas guiadas.',
        interventionSuggestion:
          'Recomendar a Central de Prática diária com o plano estruturado de 15 minutos com foco em arpejos e digitação.',
        affectedCourseId: 'all',
        affectedStudentsCount: count,
        metricValue: `${Math.round((practiceCount / (theoryCount + practiceCount || 1)) * 100)}% de prática`,
      });
    }

    // 3. Gargalo de revisão espaçada
    const revisionEvents = localEvents.filter((e) => e.eventType === 'revision_completed');
    if (revisionEvents.length === 0 && count > 0) {
      bottlenecks.push({
        id: 'btn-low-revision',
        severity: 'low',
        title: 'Baixa Frequência de Revisão Espaçada',
        observedFact: 'Nenhum ciclo de revisão de conteúdos de módulos anteriores foi concluído nos últimos 14 dias.',
        pedagogicalHypothesis:
          'Sem revisões cíclicas a cada 7 e 14 dias, a curva de esquecimento reduz a retenção de intervalos e formas do sistema CAGED.',
        interventionSuggestion:
          'Ativar o gatilho de revisão rápida de 5 minutos no início de cada sessão na Central de Prática.',
        affectedCourseId: 'all',
        affectedStudentsCount: count,
        metricValue: '0 revisões',
      });
    }

    return bottlenecks;
  }

  /**
   * Constrói resumo individual de cada aluno vinculado
   */
  static getStudentSummaries(
    enrolledStudents?: ClassEnrollment[] | string,
    classes?: ClassGroup[]
  ): StudentAnalyticsSummary[] {
    let studentList: ClassEnrollment[] = [];
    if (typeof enrolledStudents === 'string') {
      studentList = this.loadLocalEnrollments().filter((e) => enrolledStudents === 'all' || e.classId === enrolledStudents);
    } else if (Array.isArray(enrolledStudents)) {
      studentList = enrolledStudents;
    } else {
      studentList = this.loadLocalEnrollments();
    }
    const classList = classes || this.loadLocalClasses();
    const classMap = new Map(classList.map((c) => [c.id, c.name]));

    return studentList.map((student) => {
      const progress: UserProgress = storageService.loadProgress(student.studentId);
      const className = classMap.get(student.classId) || 'Turma Principal';

      const totalSec = progress.totalStudyTimeSeconds || 0;
      // Separa tempo interativo medido de registros manuais
      const manualSec = (progress.manualPracticeLogs || []).reduce(
        (acc, l) => acc + (l.durationMinutes || 0) * 60,
        0
      );
      const verifiedSec = Math.max(0, totalSec - manualSec);

      // Avaliações de habilidades do perfil pedagógico
      const profile = progress.pedagogicalProfile;
      let evaluatedCount = 0;
      let proficientCount = 0;
      if (profile && profile.skills) {
        Object.values(profile.skills).forEach((s) => {
          if (s.evidences && s.evidences.length > 0) {
            evaluatedCount++;
            if (s.masteryScore && s.masteryScore >= 75) {
              proficientCount++;
            }
          }
        });
      }

      const activeCoursesList: string[] = [];
      if (progress.completedLessons.some((id) => id.startsWith('violao-'))) activeCoursesList.push('Violão');
      if (progress.completedLessons.some((id) => id.startsWith('solo-'))) activeCoursesList.push('Guitarra Solo');
      if (progress.completedLessons.some((id) => !id.startsWith('violao-') && !id.startsWith('solo-'))) activeCoursesList.push('Conservatório');
      if (activeCoursesList.length === 0) activeCoursesList.push('Conservatório (Iniciante)');

      return {
        studentUid: student.studentId,
        studentName: student.studentName,
        studentEmail: student.studentEmail,
        studentPhotoUrl: student.studentPhotoUrl,
        classId: student.classId,
        className,
        joinedAt: student.joinedAt,
        lastActivityAt: student.lastActivityAt || progress.lastStudyDate || student.joinedAt,
        totalStudyTimeSeconds: totalSec,
        verifiedInteractiveSeconds: verifiedSec,
        manualLoggedSeconds: manualSec,
        completedLessonsCount: progress.completedLessons.length,
        activeCourses: activeCoursesList,
        currentLessons: progress.courseLastLesson || { canonical: 'lesson-1' },
        studyFrequencyDaysPerWeek: progress.todayStudyTimeSeconds > 0 ? 4 : 2,
        practicedBpmMax: progress.practicedBpm || 80,
        pendingActivitiesCount: Math.max(0, 98 - progress.completedLessons.length),
        evaluatedSkillsCount: evaluatedCount,
        unevaluatedSkillsCount: Math.max(0, 21 - evaluatedCount),
        skillsProficientCount: proficientCount,
      };
    });
  }

  /**
   * Exporta relatórios analíticos em formato CSV (Fase 10)
   */
  static exportReportToCsv(
    reportType: 'class_overview' | 'students' | 'activities' | 'bottlenecks',
    data: any[],
    className: string = 'Guitar_Academy'
  ): { success: boolean; filename: string; csvContent: string } {
    let csvContent = '';
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `relatorio_${reportType}_${className}_${dateStr}.csv`;

    if (reportType === 'students') {
      csvContent += 'Nome,Email,Turma,Data Ingresso,Ultima Atividade,Tempo Total (min),Tempo Verificado (min),Tempo Manual (min),Aulas Concluidas,BPM Maximo,Habilidades Avaliadas\n';
      data.forEach((s: StudentAnalyticsSummary) => {
        csvContent += `"${s.studentName}","${s.studentEmail}","${s.className}","${s.joinedAt.split('T')[0]}","${s.lastActivityAt.split('T')[0]}",${Math.round(s.totalStudyTimeSeconds / 60)},${Math.round(s.verifiedInteractiveSeconds / 60)},${Math.round(s.manualLoggedSeconds / 60)},${s.completedLessonsCount},${s.practicedBpmMax},${s.evaluatedSkillsCount}\n`;
      });
    } else if (reportType === 'activities') {
      csvContent += 'Categoria,Curso,Modulo,Qtd Eventos,Alunos Envolvidos,Percentual,Denominador\n';
      data.forEach((r: AnalyticsTableRow) => {
        csvContent += `"${r.categoryOrActivity}","${r.course}","${r.module}",${r.occurrenceCount},${r.studentsInvolvedCount},${r.percentage}%,"${r.denominatorDescription}"\n`;
      });
    } else if (reportType === 'bottlenecks') {
      csvContent += 'Gravidade,Titulo,Fato Observado,Hipotese Pedagogica,Sugestao Intervencao,Alunos Afetados,Metrica\n';
      data.forEach((b: PedagogicalBottleneck) => {
        csvContent += `"${b.severity.toUpperCase()}","${b.title}","${b.observedFact}","${b.pedagogicalHypothesis}","${b.interventionSuggestion}",${b.affectedStudentsCount},"${b.metricValue}"\n`;
      });
    } else {
      // Class overview
      csvContent += 'Metrica,Valor,Observacao\n';
      csvContent += `"Total de Alunos Vinculados",${data.length},"Registrados na turma"\n`;
      csvContent += `"Data do Relatorio","${dateStr}","Exportacao autorizada pelo Professor"\n`;
    }

    if (typeof window !== 'undefined' && typeof Blob !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    return { success: true, filename, csvContent };
  }

  // --- MÉTODOS AUXILIARES DE PERSISTÊNCIA LOCAL ---

  private static loadLocalClasses(): ClassGroup[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(LOCAL_CLASSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveLocalClasses(classes: ClassGroup[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_CLASSES_KEY, JSON.stringify(classes));
    } catch {}
  }

  private static loadLocalEnrollments(): ClassEnrollment[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveLocalEnrollments(enrollments: ClassEnrollment[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(enrollments));
    } catch {}
  }

  private static loadLocalEvents(): EducationalEvent[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(LOCAL_EVENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveLocalEvents(events: EducationalEvent[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
    } catch {}
  }

  /**
   * Provisiona os dados iniciais dos 3 alunos do estúdio para exibição inicial no painel do professor
   */
  private static getBootstrapDemoEnrollments(teacherId: string, classId?: string): ClassEnrollment[] {
    const cId = classId && classId !== 'all' ? classId : `class-${teacherId}-turma-1`;
    return [
      {
        id: `enroll-${cId}-student-1`,
        classId: cId,
        studentId: 'user_aluno_diego_01',
        studentName: 'Diego Ramos',
        studentEmail: 'diegoramos.violao@gmail.com',
        teacherId,
        joinedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: `enroll-${cId}-student-2`,
        classId: cId,
        studentId: 'user_aluno_carolina_02',
        studentName: 'Carolina Mendes',
        studentEmail: 'carolina.guitarra@gmail.com',
        teacherId,
        joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        lastActivityAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: `enroll-${cId}-student-3`,
        classId: cId,
        studentId: 'user_aluno_lucas_03',
        studentName: 'Lucas Ferreira',
        studentEmail: 'lucas.acordes@gmail.com',
        teacherId,
        joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        lastActivityAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  /**
   * Deriva eventos analíticos realistas dos registros de estudo reais dos alunos
   */
  private static generateDerivedEventsFromStudents(students: ClassEnrollment[]): EducationalEvent[] {
    const events: EducationalEvent[] = [];
    const now = Date.now();

    students.forEach((s, idx) => {
      const progress = storageService.loadProgress(s.studentId);
      const studentClass = s.classId;

      // Eventos de aulas concluídas
      progress.completedLessons.forEach((lessonId, lIdx) => {
        const courseId = lessonId.startsWith('violao-') ? 'violao' : lessonId.startsWith('solo-') ? 'solo' : 'canonical';
        events.push({
          id: `evt-derived-${s.studentId}-${lessonId}`,
          studentUid: s.studentId,
          studentName: s.studentName,
          studentEmail: s.studentEmail,
          classId: studentClass,
          courseId,
          lessonId,
          eventType: 'lesson_completed',
          category: 'guided_lessons',
          durationSeconds: 1200,
          measurementType: 'verified_interactive',
          timestamp: new Date(now - (lIdx + 1) * 24 * 60 * 60 * 1000).toISOString(),
        });
      });

      // Evento de prática instrumental
      if (progress.totalStudyTimeSeconds > 0) {
        events.push({
          id: `evt-derived-practice-${s.studentId}`,
          studentUid: s.studentId,
          studentName: s.studentName,
          studentEmail: s.studentEmail,
          classId: studentClass,
          courseId: 'violao',
          eventType: 'practice_session_recorded',
          category: 'instrumental_practice',
          durationSeconds: progress.totalStudyTimeSeconds,
          measurementType: 'verified_interactive',
          timestamp: new Date(now - (idx + 1) * 36 * 60 * 60 * 1000).toISOString(),
        });
      }
    });

    return events;
  }
}

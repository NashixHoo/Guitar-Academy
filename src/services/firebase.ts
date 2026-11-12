import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut, 
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { UserProgress, StudentProfile, AuthProviderType, UserRole } from '../types/index.ts';

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);

// Conecta à instância do Cloud Firestore configurada
export const db: Firestore = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Provedor Google com escopos mínimos e seletor de contas explícito
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Provedor Facebook
export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Provedor Apple
export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export interface AuthUserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

/**
 * Mapeia erros nativos do Firebase Authentication em mensagens amigáveis em português
 */
export function mapFirebaseAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail com formato inválido. Por favor, verifique a digitação.';
    case 'auth/user-not-found':
      return 'Não há nenhuma conta cadastrada com este e-mail.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está em uso por outra conta. Faça login ou recupere sua senha.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/missing-password':
      return 'Por favor, informe a sua senha.';
    case 'auth/missing-email':
      return 'Por favor, informe o seu e-mail.';
    case 'auth/popup-closed-by-user':
      return 'A janela de autenticação foi fechada antes de concluir o login.';
    case 'auth/popup-blocked':
      return 'O pop-up de login foi bloqueado pelo navegador. Por favor, autorize pop-ups para esta página.';
    case 'auth/cancelled-popup-request':
      return 'A solicitação de autenticação anterior foi cancelada.';
    case 'auth/network-request-failed':
      return 'Falha na conexão com a internet. Verifique sua rede e tente novamente.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Por favor, aguarde alguns minutos e tente novamente.';
    case 'auth/unauthorized-domain':
      return 'Domínio da aplicação não autorizado no Firebase Console. Para que o login funcione, adicione o domínio atual em: Console Firebase > Authentication > Settings > Authorized Domains.';
    case 'auth/operation-not-allowed':
      return 'Este provedor de autenticação ainda não foi ativado no console administrativo do Firebase.';
    case 'auth/configuration-not-found':
      return 'Credenciais do provedor (App ID / Secret) pendentes de configuração no console Firebase.';
    case 'auth/user-disabled':
      return 'Esta conta de aluno foi desativada pelo suporte ou administração.';
    default:
      return error?.message || 'Ocorreu um erro na autenticação. Tente novamente.';
  }
}

/**
 * Realiza login com Conta Google utilizando popup seguro
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await saveUserProfile(result.user);
    }
    return result.user;
  } catch (error: any) {
    console.error('Erro na autenticação Google:', error);
    throw error;
  }
}

/**
 * Realiza login com Facebook utilizando popup seguro
 */
export async function signInWithFacebook(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    if (result.user) {
      await saveUserProfile(result.user);
    }
    return result.user;
  } catch (error: any) {
    console.error('Erro na autenticação Facebook:', error);
    throw error;
  }
}

/**
 * Realiza login com Apple utilizando popup seguro
 */
export async function signInWithApple(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    if (result.user) {
      await saveUserProfile(result.user);
    }
    return result.user;
  } catch (error: any) {
    console.error('Erro na autenticação Apple:', error);
    throw error;
  }
}

/**
 * Realiza login com E-mail e Senha
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    if (result.user) {
      await saveUserProfile(result.user);
    }
    return result.user;
  } catch (error: any) {
    console.error('Erro no login por e-mail/senha:', error);
    throw error;
  }
}

/**
 * Cria uma nova conta com E-mail e Senha
 */
export async function signUpWithEmail(name: string, email: string, password: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (result.user) {
      if (name.trim()) {
        await updateProfile(result.user, {
          displayName: name.trim(),
        });
      }
      await saveUserProfile(result.user);
    }
    return result.user;
  } catch (error: any) {
    console.error('Erro no cadastro por e-mail/senha:', error);
    throw error;
  }
}

/**
 * Envia e-mail de redefinição de senha
 */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error: any) {
    console.error('Erro ao enviar e-mail de redefinição:', error);
    throw error;
  }
}

/**
 * Efetua logout da sessão atual
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Erro ao efetuar logout:', error);
    throw error;
  }
}

/**
 * Valida o documento de papel do sistema recuperado de system_roles/{uid}.
 * Documentos sem campo role, com role inválido ou com role 'student' NUNCA concedem privilégios.
 */
export function parseSystemRoleDoc(data: any): UserRole {
  if (!data || typeof data !== 'object') return 'student';
  if (data.role === 'admin') return 'admin';
  if (data.role === 'teacher') return 'teacher';
  return 'student';
}

/**
 * Consulta a fonte autoritativa única de papéis em system_roles/{uid}.
 * Somente o servidor administrativo com Admin SDK pode alterar este documento.
 * Qualquer erro de leitura, ausência de documento ou ausência do campo role resulta em 'student'.
 */
export async function fetchSystemRole(
  uid: string,
  testDocProvider?: (uid: string) => Promise<any>
): Promise<UserRole> {
  if (!uid || typeof uid !== 'string') return 'student';

  // Suporte a injeção determinística de provedor de documento em suítes de testes unitários
  if (testDocProvider) {
    try {
      const data = await testDocProvider(uid);
      return parseSystemRoleDoc(data);
    } catch {
      return 'student';
    }
  }

  try {
    const roleRef = doc(db, 'system_roles', uid);
    const snap = await getDoc(roleRef);
    if (snap.exists()) {
      return parseSystemRoleDoc(snap.data());
    }
    return 'student';
  } catch (err) {
    console.warn('Não foi possível consultar system_roles (fail-closed Zero-Trust):', err);
    return 'student';
  }
}

/**
 * Salva ou atualiza os metadados do estudante no Firestore (users/{uid}).
 * SEGURANÇA: Não permite que o cliente defina o campo `role` ou privilégios administrativos.
 */
export async function saveUserProfile(user: User): Promise<StudentProfile | null> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(userRef);
    const existingData = existingSnap.exists() ? existingSnap.data() : null;

    // Detecta provedor
    const providerId = (user.providerData[0]?.providerId as AuthProviderType) || 'password';

    // O papel confiável é consultado em system_roles/{uid}, NUNCA atribuído pelo cliente
    const authoritativeRole = await fetchSystemRole(user.uid);

    const profileData = {
      uid: user.uid,
      displayName: user.displayName || existingData?.displayName || 'Estudante Guitar Academy',
      email: user.email || '',
      photoURL: user.photoURL || existingData?.photoURL || null,
      provider: providerId,
      createdAt: existingData?.createdAt || user.metadata.creationTime || new Date().toISOString(),
      lastLoginAt: user.metadata.lastSignInTime || new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      accountStatus: existingData?.accountStatus || 'active',
      enrolledCourses: existingData?.enrolledCourses || ['violao'],
      preferences: existingData?.preferences || {
        theme: 'light',
        preferredInstrument: 'violao',
      },
    };

    await setDoc(
      userRef,
      {
        ...profileData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return {
      ...profileData,
      role: authoritativeRole,
    };
  } catch (err) {
    console.warn('Não foi possível sincronizar o perfil no Firestore (modo offline):', err);
    return null;
  }
}

/**
 * Recupera o perfil do estudante no Firestore combinando dados de perfil com o papel confiável
 */
export async function fetchUserProfile(uid: string): Promise<StudentProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const [snapshot, role] = await Promise.all([
      getDoc(userRef),
      fetchSystemRole(uid),
    ]);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        ...(data as StudentProfile),
        role,
      };
    }
    return null;
  } catch (err) {
    console.warn('Erro ao carregar perfil do Firestore:', err);
    return null;
  }
}

/**
 * Atualiza o timestamp de última atividade (lastSeenAt)
 */
export async function updateUserLastSeen(uid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastSeenAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    // Silencioso em caso de offline
  }
}

/**
 * Carrega o progresso do estudante do Cloud Firestore (users/{uid}/data/progress)
 */
export async function fetchCloudProgress(uid: string): Promise<UserProgress | null> {
  try {
    const progressRef = doc(db, 'users', uid, 'data', 'progress');
    const snapshot = await getDoc(progressRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return (data.progress as UserProgress) || null;
    }
    return null;
  } catch (err) {
    console.warn('Erro ao carregar progresso da nuvem (offline ou sem permissão):', err);
    return null;
  }
}

/**
 * Sincroniza o progresso do estudante no Cloud Firestore
 */
export async function syncProgressToCloud(uid: string, progress: UserProgress): Promise<boolean> {
  try {
    const progressRef = doc(db, 'users', uid, 'data', 'progress');
    await setDoc(
      progressRef,
      {
        uid,
        progress,
        lastUpdated: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Falha na sincronização do progresso com a nuvem (offline):', err);
    return false;
  }
}

export { onAuthStateChanged };
export type { User };


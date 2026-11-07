import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
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
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { UserProgress } from '../types/index.ts';

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

export interface AuthUserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

/**
 * Realiza login com Conta Google utilizando popup seguro
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Atualiza o documento de perfil do usuário na nuvem
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
 * Salva ou atualiza os metadados do estudante no Firestore (users/{uid})
 */
export async function saveUserProfile(user: User): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        displayName: user.displayName || 'Estudante Guitar Academy',
        email: user.email || '',
        photoURL: user.photoURL || '',
        lastLoginAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Não foi possível sincronizar o perfil no Firestore (modo offline):', err);
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

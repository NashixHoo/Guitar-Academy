import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { 
  User, 
  signInWithGoogle as fbSignInGoogle, 
  signInWithFacebook as fbSignInFacebook,
  signInWithApple as fbSignInApple,
  signInWithEmail as fbSignInEmail,
  signUpWithEmail as fbSignUpEmail,
  sendPasswordReset as fbSendPasswordReset,
  logOut as fbLogOut, 
  fetchUserProfile,
  fetchSystemRole,
  updateUserLastSeen,
  mapFirebaseAuthError,
  onAuthStateChanged,
  auth
} from '../services/firebase';
import { storageService } from '../services/storageService';
import { UserProgress, StudentProfile, UserRole } from '../types';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface AuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isTeacher: boolean;
  adminPreviewMode: boolean;
  setAdminPreviewMode: (preview: boolean) => void;
  loading: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  authError: string | null;
  authSuccessMessage: string | null;
  showLegacyModal: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  clearAuthError: () => void;
  clearAuthSuccess: () => void;
  syncNow: () => Promise<void>;
  handleLegacyChoice: (choice: 'import' | 'fresh') => Promise<void>;
  dismissLegacyModal: () => void;
  refreshProgress: () => UserProgress;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [role, setRole] = useState<UserRole>('student');
  const [adminPreviewMode, setAdminPreviewMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [showLegacyModal, setShowLegacyModal] = useState<boolean>(false);
  const authSeqRef = useRef<number>(0);

  const refreshUserProfile = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setStudentProfile(null);
      setRole('student');
      setAdminPreviewMode(false);
      return;
    }
    try {
      const [profile, resolvedRole] = await Promise.all([
        fetchUserProfile(currentUser.uid),
        fetchSystemRole(currentUser.uid),
      ]);
      if (auth.currentUser?.uid !== currentUser.uid) return;
      setStudentProfile(profile);
      setRole(resolvedRole);
      if (resolvedRole !== 'admin') {
        setAdminPreviewMode(false);
      }
    } catch {
      if (auth.currentUser?.uid !== currentUser.uid) return;
      setRole('student');
      setAdminPreviewMode(false);
    }
  }, []);

  // Inicialização preventiva de arquivamento de dados legados e listener de autenticação
  useEffect(() => {
    storageService.archiveLegacyData();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const seq = ++authSeqRef.current;
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        storageService.setCurrentUser(currentUser.uid);

        // Carrega o perfil do estudante e o papel confiável exclusivamente de system_roles/{uid}
        try {
          const [profile, resolvedRole] = await Promise.all([
            fetchUserProfile(currentUser.uid),
            fetchSystemRole(currentUser.uid),
          ]);
          if (authSeqRef.current !== seq) return;
          setStudentProfile(profile);
          setRole(resolvedRole);
          if (resolvedRole !== 'admin') {
            setAdminPreviewMode(false);
          }
          updateUserLastSeen(currentUser.uid);
        } catch {
          if (authSeqRef.current !== seq) return;
          // Em caso de falha de rede ou leitura, mantém estritamente o papel seguro de aluno
          setRole('student');
          setStudentProfile(null);
          setAdminPreviewMode(false);
        }

        if (authSeqRef.current !== seq) return;

        // Verifica se há dados legados anteriores e se este usuário ainda não possui histórico isolado
        const userHasLocal = storageService.hasUserLocalData(currentUser.uid);
        const legacyAvailable = storageService.hasLegacyData();

        if (!userHasLocal && legacyAvailable) {
          setShowLegacyModal(true);
        }

        // Sincronização inicial com o Cloud Firestore
        try {
          setSyncStatus('syncing');
          const syncResult = await storageService.syncUserWithCloud(currentUser.uid);
          if (authSeqRef.current !== seq) return;
          if (syncResult.synced) {
            setSyncStatus('synced');
            setLastSyncedAt(new Date());
          } else {
            setSyncStatus('offline');
          }
        } catch {
          if (authSeqRef.current !== seq) return;
          setSyncStatus('offline');
        }
      } else {
        // Sessão desconectada: limpa imediatamente usuário ativo, perfil e privilégios administrativos
        setUser(null);
        setStudentProfile(null);
        setRole('student');
        setAdminPreviewMode(false);
        storageService.setCurrentUser(null);
        setShowLegacyModal(false);
        setSyncStatus('synced');
      }
      if (authSeqRef.current === seq) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const clearAuthSuccess = useCallback(() => {
    setAuthSuccessMessage(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      await fbSignInGoogle();
      await refreshUserProfile();
    } catch (err: any) {
      console.error('Falha no login com Google:', err);
      const friendly = mapFirebaseAuthError(err);
      setAuthError(friendly);
      throw err;
    }
  }, [refreshUserProfile]);

  const signInWithFacebook = useCallback(async () => {
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      await fbSignInFacebook();
      await refreshUserProfile();
    } catch (err: any) {
      console.error('Falha no login com Facebook:', err);
      const friendly = mapFirebaseAuthError(err);
      setAuthError(friendly);
      throw err;
    }
  }, [refreshUserProfile]);

  const signInWithApple = useCallback(async () => {
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      await fbSignInApple();
      await refreshUserProfile();
    } catch (err: any) {
      console.error('Falha no login com Apple:', err);
      const friendly = mapFirebaseAuthError(err);
      setAuthError(friendly);
      throw err;
    }
  }, [refreshUserProfile]);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      await fbSignInEmail(email, pass);
      await refreshUserProfile();
    } catch (err: any) {
      console.error('Falha no login com e-mail/senha:', err);
      const friendly = mapFirebaseAuthError(err);
      setAuthError(friendly);
      throw err;
    }
  }, [refreshUserProfile]);

  const signUpWithEmail = useCallback(async (name: string, email: string, pass: string) => {
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      await fbSignUpEmail(name, email, pass);
      await refreshUserProfile();
      setAuthSuccessMessage('Conta criada com sucesso! Seja bem-vindo à Guitar Academy.');
    } catch (err: any) {
      console.error('Falha no cadastro com e-mail/senha:', err);
      const friendly = mapFirebaseAuthError(err);
      setAuthError(friendly);
      throw err;
    }
  }, [refreshUserProfile]);

  const sendPasswordReset = useCallback(async (email: string) => {
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      await fbSendPasswordReset(email);
      setAuthSuccessMessage('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
    } catch (err: any) {
      console.error('Falha na recuperação de senha:', err);
      const friendly = mapFirebaseAuthError(err);
      setAuthError(friendly);
      throw err;
    }
  }, []);

  const logOut = useCallback(async () => {
    try {
      await fbLogOut();
    } catch (err: any) {
      console.error('Erro ao efetuar logout:', err);
      setAuthError('Erro ao desconectar sua conta.');
    } finally {
      // Desconexão imediata e irrevogável de privilégios e dados locais
      setUser(null);
      storageService.setCurrentUser(null);
      setStudentProfile(null);
      setRole('student');
      setAdminPreviewMode(false);
      setAuthError(null);
      setAuthSuccessMessage(null);
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (!user) return;
    setSyncStatus('syncing');
    try {
      const res = await storageService.syncUserWithCloud(user.uid);
      if (res.synced) {
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
      } else {
        setSyncStatus('offline');
      }
    } catch {
      setSyncStatus('error');
    }
  }, [user]);

  const handleLegacyChoice = useCallback(async (choice: 'import' | 'fresh') => {
    if (!user) return;
    if (choice === 'import') {
      storageService.importLegacyDataForUser(user.uid);
    } else {
      storageService.createFreshSlateForUser(user.uid);
    }
    setShowLegacyModal(false);
    await syncNow();
  }, [user, syncNow]);

  const dismissLegacyModal = useCallback(() => {
    setShowLegacyModal(false);
  }, []);

  const refreshProgress = useCallback((): UserProgress => {
    return storageService.loadProgress(user?.uid);
  }, [user]);

  // SEGURANÇA REAL: Papéis autenticados exclusivamente pela fonte confiável system_roles
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher' || role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        role,
        isAdmin,
        isTeacher,
        adminPreviewMode,
        setAdminPreviewMode,
        loading,
        syncStatus,
        lastSyncedAt,
        authError,
        authSuccessMessage,
        showLegacyModal,
        signInWithGoogle,
        signInWithFacebook,
        signInWithApple,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        logOut,
        clearAuthError,
        clearAuthSuccess,
        syncNow,
        handleLegacyChoice,
        dismissLegacyModal,
        refreshProgress,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }
  return context;
};


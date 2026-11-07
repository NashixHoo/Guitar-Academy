import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  User, 
  signInWithGoogle as fbSignIn, 
  logOut as fbLogOut, 
  onAuthStateChanged,
  auth
} from '../services/firebase';
import { storageService } from '../services/storageService';
import { UserProgress } from '../types';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  authError: string | null;
  showLegacyModal: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  clearAuthError: () => void;
  syncNow: () => Promise<void>;
  handleLegacyChoice: (choice: 'import' | 'fresh') => Promise<void>;
  dismissLegacyModal: () => void;
  refreshProgress: () => UserProgress;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showLegacyModal, setShowLegacyModal] = useState<boolean>(false);

  // Inicialização preventiva de arquivamento de dados legados
  useEffect(() => {
    storageService.archiveLegacyData();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        storageService.setCurrentUser(currentUser.uid);

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
          if (syncResult.synced) {
            setSyncStatus('synced');
            setLastSyncedAt(new Date());
          } else {
            setSyncStatus('offline');
          }
        } catch {
          setSyncStatus('offline');
        }
      } else {
        // Sessão desconectada: limpa ponteiro do usuário ativo
        storageService.setCurrentUser(null);
        setShowLegacyModal(false);
        setSyncStatus('synced');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      await fbSignIn();
    } catch (err: any) {
      console.error('Falha no login com Google:', err);
      let userFriendlyMsg = 'Não foi possível concluir o login com o Google. Tente novamente.';
      if (err?.code === 'auth/popup-closed-by-user') {
        userFriendlyMsg = 'A janela de autenticação com o Google foi fechada antes da conclusão.';
      } else if (err?.code === 'auth/popup-blocked') {
        userFriendlyMsg = 'O pop-up de login foi bloqueado pelo navegador. Por favor, autorize pop-ups para esta página.';
      } else if (err?.code === 'auth/network-request-failed') {
        userFriendlyMsg = 'Falha de conexão com a internet. Verifique sua rede e tente novamente.';
      } else if (err?.code === 'auth/cancelled-popup-request') {
        userFriendlyMsg = 'A solicitação de login anterior foi cancelada.';
      }
      setAuthError(userFriendlyMsg);
      throw err;
    }
  }, []);

  const logOut = useCallback(async () => {
    try {
      await fbLogOut();
      storageService.setCurrentUser(null);
    } catch (err: any) {
      console.error('Erro ao efetuar logout:', err);
      setAuthError('Erro ao desconectar sua conta.');
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        syncStatus,
        lastSyncedAt,
        authError,
        showLegacyModal,
        signInWithGoogle,
        logOut,
        clearAuthError,
        syncNow,
        handleLegacyChoice,
        dismissLegacyModal,
        refreshProgress,
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

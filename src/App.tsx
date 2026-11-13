import React, { useState, useEffect, useRef } from 'react';
import { NavigationTab, UserProgress, Lesson } from './types';
import { storageService } from './services/storageService';
import { themeService } from './services/themeService';
import { 
  navigationService, 
  PrimaryTab, 
  PRIMARY_TAB_DEFAULTS, 
  SCREEN_TITLES 
} from './services/navigationService';
import { useSwipeNavigation } from './hooks/useSwipeNavigation';
import { CURRICULUM_LEVELS } from './data/curriculum';
import { SOLO_LESSONS } from './data/soloCourse';
import { VIOLAO_LESSONS } from './data/violaoCourse';
import { BASS_LESSONS } from './data/bassCourse';
import { KEYBOARD_LESSONS } from './data/keyboardCourse';
import { DRUMS_LESSONS } from './data/drumsCourse';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { SubNavBar } from './components/layout/SubNavBar';
import { DashboardView } from './components/dashboard/DashboardView';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { LessonViewer } from './components/curriculum/LessonViewer';
import { PracticeRoutineView } from './components/routine/PracticeRoutineView';
import { FretboardView } from './components/fretboard/FretboardView';
import { ChordDictionaryView } from './components/chords/ChordDictionaryView';
import { MetronomeView } from './components/metronome/MetronomeView';
import { MusicTheoryView } from './components/theory/MusicTheoryView';
import { SightReadingView } from './components/reading/SightReadingView';
import { EarTrainingView } from './components/eartraining/EarTrainingView';
import { TechniqueView } from './components/technique/TechniqueView';
import { TunerView } from './components/tuner/TunerView';
import { GuitarCoachView } from './components/coach/GuitarCoachView';
import { ProfessorAiView } from './components/professor/ProfessorAiView';
import { StudyLibraryView } from './components/library/StudyLibraryView';
import { ProgressView } from './components/progress/ProgressView';
import { SettingsView } from './components/settings/SettingsView';
import { DiagnosticsView } from './components/diagnostics/DiagnosticsView';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { SplashScreen } from './components/common/SplashScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthView } from './components/auth/AuthView';
import { LoginModal } from './components/auth/LoginModal';
import { LegacyDataModal } from './components/auth/LegacyDataModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { TeacherDashboardView } from './components/teacher/TeacherDashboardView';
import { StudentJoinClassModal } from './components/teacher/StudentJoinClassModal';
import { StudentPrivacyNotice } from './components/teacher/StudentPrivacyNotice';
import { AdminPortalView } from './components/admin/AdminPortalView';

function MainAppContent() {
  const { user, loading, isAdmin, isTeacher, adminPreviewMode, showLegacyModal } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>(() => navigationService.getPrimaryTab('home'));
  const [progress, setProgress] = useState<UserProgress>(() => storageService.loadProgress());
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchTargetChord, setSearchTargetChord] = useState<{ symbol: string; id?: string } | null>(null);
  const [searchTargetTheoryKey, setSearchTargetTheoryKey] = useState<string | null>(null);
  const [focusSearchTrigger, setFocusSearchTrigger] = useState(0);

  const mainScrollRef = useRef<HTMLElement>(null);

  // Inicialização do tema visual (Modo Claro / Modo Escuro / Sistema)
  useEffect(() => {
    const active = progress.themePreference || themeService.getSavedTheme();
    themeService.applyTheme(active);
  }, []);

  // Sincroniza o progresso isolado do estudante sempre que o usuário ativo alternar
  useEffect(() => {
    const loaded = storageService.loadProgress(user?.uid);
    setProgress(loaded);
  }, [user]);

  // Ouvinte de histórico popstate do navegador (botão voltar físico ou browser)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const restored = navigationService.handlePopState(e.state);
      if (restored) {
        setCurrentTab(restored.tab);
        setPrimaryTab(navigationService.getPrimaryTab(restored.tab));
        setSelectedLessonId(restored.lessonId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ouvinte global de eventos de teclado para focar a barra de busca (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setFocusSearchTrigger((prev) => prev + 1);

        const focusAndSelectSearch = () => {
          const input = (document.getElementById('global-search-input') ||
            document.getElementById('global-search-mobile-input') ||
            document.querySelector('header input[type="text"]')) as HTMLInputElement | null;

          if (input) {
            input.focus();
            input.select();
            return true;
          }
          return false;
        };

        if (!focusAndSelectSearch()) {
          requestAnimationFrame(() => {
            if (!focusAndSelectSearch()) {
              setTimeout(focusAndSelectSearch, 40);
            }
          });
        } else {
          setTimeout(focusAndSelectSearch, 30);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // SEGURANÇA REAL: Bloqueio estrito de acesso a rotas administrativas/pedagógicas para alunos
  useEffect(() => {
    if (!isTeacher && currentTab === 'teacher-dashboard') {
      console.warn('Acesso a rota pedagógica/administrativa bloqueado para perfil de aluno.');
      setCurrentTab('home');
      setPrimaryTab('estudar');
    }
  }, [isTeacher, currentTab]);

  // Navegação unificada com preservação de rolagem e histórico
  const navigateToTab = (tab: NavigationTab, lessonId: string | null = null, resetScrollToTop: boolean = false) => {
    // Bloqueia tentativas de navegação direta para rotas administrativas/pedagógicas por alunos
    if (tab === 'teacher-dashboard' && !isTeacher) {
      setCurrentTab('home');
      setPrimaryTab('estudar');
      return;
    }

    // 1. Salvar rolagem atual
    if (mainScrollRef.current) {
      const currentKey = selectedLessonId ? `lesson_${selectedLessonId}` : currentTab;
      navigationService.saveScrollPosition(currentKey, mainScrollRef.current.scrollTop);
    }

    // 2. Registrar no histórico de navegação
    navigationService.push(tab, lessonId);

    // 3. Atualizar estados
    setCurrentTab(tab);
    setPrimaryTab(navigationService.getPrimaryTab(tab));
    setSelectedLessonId(lessonId);

    // 4. Restaurar rolagem para o destino ou rolar ao topo em novo contexto
    requestAnimationFrame(() => {
      if (mainScrollRef.current) {
        if (lessonId || resetScrollToTop) {
          mainScrollRef.current.scrollTop = 0;
        } else {
          const targetKey = tab;
          const savedPos = navigationService.getScrollPosition(targetKey);
          mainScrollRef.current.scrollTop = savedPos;
        }
      }
      try {
        window.scrollTo(0, 0);
      } catch {
        // Fallback para ambientes restritos
      }
    });
  };

  // Alternância entre as 3 abas principais na barra inferior
  const handleSelectPrimaryTab = (nextPrimary: PrimaryTab) => {
    if (nextPrimary === primaryTab && !selectedLessonId) {
      // Já está na mesma aba principal: rolar suavemente ao topo
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const defaultTab = PRIMARY_TAB_DEFAULTS[nextPrimary];
    navigateToTab(defaultTab, null);
  };

  // Botão Voltar unificado (aulas, detalhes, histórico e fallback seguro)
  const handleGoBack = () => {
    // 1. Ao abrir uma aula a partir da lista, voltar retorna à lista na mesma posição de rolagem
    if (selectedLessonId) {
      if (mainScrollRef.current) {
        navigationService.saveScrollPosition(`lesson_${selectedLessonId}`, mainScrollRef.current.scrollTop);
      }
      setSelectedLessonId(null);
      setCurrentTab('curriculum');
      setPrimaryTab('estudar');
      navigationService.push('curriculum', null);

      requestAnimationFrame(() => {
        if (mainScrollRef.current) {
          mainScrollRef.current.scrollTop = navigationService.getScrollPosition('curriculum');
        }
      });
      return;
    }

    // 2. Se houver histórico de navegação acumulado
    const destination = navigationService.pop();
    if (destination) {
      setCurrentTab(destination.tab);
      setPrimaryTab(destination.primaryTab);
      setSelectedLessonId(destination.lessonId);

      requestAnimationFrame(() => {
        if (mainScrollRef.current) {
          const key = destination.lessonId ? `lesson_${destination.lessonId}` : destination.tab;
          mainScrollRef.current.scrollTop = navigationService.getScrollPosition(key);
        }
      });
      return;
    }

    // 3. Fallback seguro e previsível (sem histórico)
    const fallback = navigationService.getSafeFallback(currentTab, selectedLessonId);
    setCurrentTab(fallback.tab);
    setPrimaryTab(navigationService.getPrimaryTab(fallback.tab));
    setSelectedLessonId(fallback.lessonId);
  };

  const handleSelectLesson = (lessonId: string) => {
    // Ao abrir uma aula a partir de qualquer contexto, garante que a aula inicie estritamente no topo (scrollTop = 0)
    navigateToTab('curriculum', lessonId, true);
    setProgress((_prev) => {
      const updated = storageService.setActiveLessonAndCourse(lessonId);
      return updated;
    });
  };

  const handleGoToFirstLesson = () => {
    handleSelectLesson('lesson-1');
  };

  const handleSelectChordFromSearch = (symbol: string, chordId?: string) => {
    setSearchTargetChord({ symbol, id: chordId });
    navigateToTab('chords', null);
  };

  const handleSelectTheoryTopicFromSearch = (_topic: string, key?: string) => {
    if (key) {
      setSearchTargetTheoryKey(key);
    }
    navigateToTab('theory', null);
  };

  const handleOpenMetronomeAtBpm = (bpm: number) => {
    const cfg = storageService.loadMetronome();
    cfg.bpm = bpm;
    storageService.saveMetronome(cfg);
    navigateToTab('metronome', null);
  };

  const handleToggleFavoriteChord = (chordId: string) => {
    setProgress((prev) => {
      const exists = prev.favoriteChords.includes(chordId);
      const updatedFavorites = exists
        ? prev.favoriteChords.filter((id) => id !== chordId)
        : [...prev.favoriteChords, chordId];
      const updated = { ...prev, favoriteChords: updatedFavorites };
      storageService.saveProgress(updated);
      return updated;
    });
  };

  // Gestos laterais entre as abas principais (Estudar ↔ Praticar ↔ Evoluir)
  const { touchHandlers } = useSwipeNavigation({
    currentPrimaryTab: primaryTab,
    onNavigatePrimaryTab: handleSelectPrimaryTab,
    enabled: true,
  });

  const canGoBack = navigationService.canGoBack(selectedLessonId, currentTab);
  const previousEntry = navigationService.getPrevious();
  const backTitle = selectedLessonId 
    ? 'Aulas' 
    : previousEntry 
      ? previousEntry.title 
      : SCREEN_TITLES[currentTab] || 'Anterior';

  // Localiza a aula ativa se selecionada (suporta os 5 instrumentos: Violão, Guitarra, Baixo, Teclado, Bateria)
  const allLessons: Lesson[] = [
    ...CURRICULUM_LEVELS.flatMap((l) => l.lessons),
    ...SOLO_LESSONS,
    ...VIOLAO_LESSONS,
    ...(BASS_LESSONS as Lesson[]),
    ...(KEYBOARD_LESSONS as Lesson[]),
    ...(DRUMS_LESSONS as Lesson[]),
  ];
  const activeLesson: Lesson | undefined = selectedLessonId
    ? allLessons.find((l) => l.id === selectedLessonId)
    : undefined;

  // FLUXO DE ENTRADA OBRIGATÓRIA:
  // 1. Apresentação da Splash Screen de abertura
  if (showSplash) {
    return (
      <>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </>
    );
  }

  // 2. Verificação do estado de autenticação (sem flash de conteúdo interno)
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F7F4] text-[#25252A]">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#D9D9D9] shadow-md flex items-center justify-center p-2.5 mb-4 ring-4 ring-[#7B1E2B]/5">
          <img src="./icon.svg" alt="Guitar Academy" className="w-full h-full object-contain" />
        </div>
        <div className="w-6 h-6 border-2 border-[#7B1E2B] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#666672] font-mono-code mt-3">Verificando sessão de estudos...</span>
      </div>
    );
  }

  // 3. Se não autenticado: bloqueio total e exibição da tela de autenticação
  if (!user) {
    return <AuthView />;
  }

  // 4. SEPARAÇÃO ESTRITA DE AMBIENTES:
  // Administrador autenticado visualiza exclusivamente o painel administrativo (Admin Suite)
  if (isAdmin && !adminPreviewMode) {
    return <AdminPortalView />;
  }

  return (
    <div className="relative h-screen h-[100dvh] max-h-screen max-h-[100dvh] text-[#25252A] flex flex-col font-sans bg-transparent overflow-hidden">
      {/* 1. PAPEL DE PAREDE FIXO GLOBAL (Estúdio Cinematográfico com Guitarra Elétrica e Bateria) */}
      <div 
        aria-hidden="true" 
        className="ga-wallpaper fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `var(--ga-wallpaper-overlay), url("${import.meta.env.BASE_URL}images/backgrounds/guitar-academy-background.webp"), url("./images/backgrounds/guitar-academy-background.webp"), url("/images/backgrounds/guitar-academy-background.webp")`
        }}
      />

      {/* 2. Conteúdo do Aplicativo em Camada Superior (z-10) com Rolagem Fluida e Independente */}
      <div className="relative z-10 flex flex-col h-full min-h-0 min-w-0 bg-transparent overflow-hidden">
        {/* Top Header com Botão Voltar Integrado */}
        <Header
          currentTab={currentTab}
          onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
          onGoToFirstLesson={handleGoToFirstLesson}
          onSelectLesson={handleSelectLesson}
          onNavigateTab={(tab) => navigateToTab(tab, null, true)}
          onSelectChord={handleSelectChordFromSearch}
          onSelectTheoryTopic={handleSelectTheoryTopicFromSearch}
          focusSearchTrigger={focusSearchTrigger}
          canGoBack={canGoBack}
          onGoBack={handleGoBack}
          backTitle={backTitle}
          onOpenAuth={() => setShowLoginModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
        />

        {/* Sub-navegação secundária das ferramentas do pilar ativo */}
        <SubNavBar
          primaryTab={primaryTab}
          currentTab={currentTab}
          onSelectTab={(tab) => navigateToTab(tab, null, true)}
        />

        {/* Main Workspace: Sidebar + Content */}
        <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
          <Navigation
            currentTab={currentTab}
            onSelectTab={(tab) => navigateToTab(tab, null, true)}
            isOpenMobile={mobileNavOpen}
            onCloseMobile={() => setMobileNavOpen(false)}
          />

          <main 
            ref={mainScrollRef}
            {...touchHandlers}
            className="flex-1 min-w-0 w-full h-full px-3.5 pt-4 pb-28 sm:pb-32 pb-[calc(6rem+env(safe-area-inset-bottom,16px))] sm:pb-[calc(7rem+env(safe-area-inset-bottom,16px))] lg:px-8 lg:pt-6 overflow-y-auto overflow-x-hidden overscroll-contain"
          >
            <div key={currentTab} className="page-enter">
              {/* TAB 1: Início (Estudar) */}
              {currentTab === 'home' && (
                <DashboardView
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onNavigateTab={(tab) => navigateToTab(tab, null)}
                  onSelectLesson={handleSelectLesson}
                />
              )}

              {/* TAB 2: Minha Formação (Currículo ou Aula Ativa) */}
              {currentTab === 'curriculum' && (
                activeLesson ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleGoBack}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold transition border border-[#D9D9D9] flex items-center gap-1.5 shadow-xs"
                      aria-label="Voltar à lista de níveis e aulas"
                    >
                      ← Voltar à lista de níveis e aulas
                    </button>
                    <LessonViewer
                      lesson={activeLesson}
                      progress={progress}
                      onUpdateProgress={setProgress}
                      onSelectLesson={handleSelectLesson}
                      onOpenMetronomeAtBpm={handleOpenMetronomeAtBpm}
                      onOpenTuner={() => navigateToTab('tuner', null)}
                    />
                  </div>
                ) : (
                  <CurriculumView
                    progress={progress}
                    onSelectLesson={handleSelectLesson}
                  />
                )
              )}

              {/* TAB 4: Guitar Coach (Treino com Microfone & Metrônomo) */}
              {currentTab === 'guitar-coach' && (
                <GuitarCoachView
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onNavigateTab={(tab) => navigateToTab(tab, null)}
                />
              )}

              {/* TAB 5: Professor IA (Mentor Didático Gemini) */}
              {currentTab === 'professor-ai' && (
                <ProfessorAiView
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onNavigateTab={(tab) => navigateToTab(tab, null)}
                />
              )}

              {/* TAB 6: Afinador Pro (Microfone Real) */}
              {currentTab === 'tuner' && (
                <TunerView
                  onOpenLessonTuning={() => {
                    handleSelectLesson('lesson-1');
                  }}
                />
              )}

              {/* TAB 7: Braço da Guitarra */}
              {currentTab === 'fretboard' && <FretboardView />}

              {/* TAB 8: Dicionário de Acordes */}
              {currentTab === 'chords' && (
                <ChordDictionaryView
                  favoriteChords={progress.favoriteChords}
                  onToggleFavorite={handleToggleFavoriteChord}
                  initialSearchTerm={searchTargetChord?.symbol}
                  initialChordId={searchTargetChord?.id}
                />
              )}

              {/* TAB 10: Teoria Musical */}
              {currentTab === 'theory' && (
                <MusicTheoryView initialKey={searchTargetTheoryKey || undefined} />
              )}

              {/* TAB 11: Leitura Musical */}
              {currentTab === 'reading' && <SightReadingView />}

              {/* TAB 12: Treino Auditivo */}
              {currentTab === 'ear-training' && <EarTrainingView />}

              {/* TAB 13: Técnica */}
              {currentTab === 'technique' && (
                <TechniqueView onOpenMetronomeAtBpm={handleOpenMetronomeAtBpm} />
              )}

              {/* TAB 14: Biblioteca de Estudos */}
              {currentTab === 'library' && (
                <StudyLibraryView onOpenMetronomeAtBpm={handleOpenMetronomeAtBpm} />
              )}

              {/* TAB 15: Meu Progresso */}
              {currentTab === 'progress' && (
                <ProgressView
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onSelectLesson={handleSelectLesson}
                />
              )}

              {/* TAB 16: Configurações */}
              {currentTab === 'settings' && (
                <SettingsView
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onNavigateTab={(tab) => navigateToTab(tab, null)}
                />
              )}

              {/* TAB 17: Diagnóstico do Sistema & Auditoria Técnica */}
              {currentTab === 'diagnostics' && (
                <DiagnosticsView
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onNavigateTab={(tab) => navigateToTab(tab, null)}
                />
              )}

              {/* TAB 18: Gestão Pedagógica & Analytics do Professor (Acesso restrito a professor/admin) */}
              {currentTab === 'teacher-dashboard' && isTeacher && (
                <TeacherDashboardView
                  onBackToApp={() => navigateToTab('home', null)}
                />
              )}
            </div>

            {/* TAB 3: Sessão de Prática / Rotina Guiada — mantida montada para preservar andamento, BPM, timer e áudio */}
            <div 
              className={currentTab === 'practice-routine' ? 'block' : 'hidden'} 
              aria-hidden={currentTab !== 'practice-routine'}
            >
              <PracticeRoutineView
                progress={progress}
                onUpdateProgress={setProgress}
                onSelectLesson={handleSelectLesson}
                onNavigateTab={(tab) => navigateToTab(tab, null)}
                onOpenMetronomeAtBpm={handleOpenMetronomeAtBpm}
              />
            </div>

            {/* TAB 9: Metrônomo Pro — mantido montado para preservar execução contínua de áudio */}
            <div 
              className={currentTab === 'metronome' ? 'block' : 'hidden'} 
              aria-hidden={currentTab !== 'metronome'}
            >
              <MetronomeView />
            </div>
          </main>
        </div>

        {/* 3. Barra de Navegação Inferior Fixa com as 3 Abas Principais (Estudar, Praticar, Evoluir) */}
        <BottomNavigation
          activePrimaryTab={primaryTab}
          onSelectPrimaryTab={handleSelectPrimaryTab}
        />

        {/* Floating Offline Notification Status */}
        <OfflineIndicator />
      </div>

      {/* Modais de Autenticação Google, Perfil do Aluno e Migração Segura */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        progress={progress}
        onUpdateProgress={setProgress}
        onNavigateTab={(tab) => {
          setShowProfileModal(false);
          navigateToTab(tab, null);
        }}
        onOpenJoinClass={() => {
          setShowProfileModal(false);
          setShowJoinClassModal(true);
        }}
        onOpenPrivacyNotice={() => {
          setShowProfileModal(false);
          setShowPrivacyModal(true);
        }}
      />

      {/* Modal de Entrada em Turma via Código Seguro (para Alunos) */}
      <StudentJoinClassModal
        isOpen={showJoinClassModal}
        onClose={() => setShowJoinClassModal(false)}
        studentUid={user?.uid || ''}
        studentName={user?.displayName || 'Estudante'}
        studentEmail={user?.email || ''}
        studentPhotoUrl={user?.photoURL || undefined}
        onJoined={() => {
          setShowJoinClassModal(false);
        }}
      />

      {/* Modal de Transparência e LGPD */}
      <StudentPrivacyNotice
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <LegacyDataModal
        isOpen={showLegacyModal}
        onChoiceMade={() => {
          const updated = storageService.loadProgress(user?.uid);
          setProgress(updated);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}


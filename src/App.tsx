import React, { useState, useEffect } from 'react';
import { NavigationTab, UserProgress, Lesson } from './types';
import { storageService } from './services/storageService';
import { CURRICULUM_LEVELS } from './data/curriculum';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { DashboardView } from './components/dashboard/DashboardView';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { LessonViewer } from './components/curriculum/LessonViewer';
import { FretboardView } from './components/fretboard/FretboardView';
import { ChordDictionaryView } from './components/chords/ChordDictionaryView';
import { MetronomeView } from './components/metronome/MetronomeView';
import { MusicTheoryView } from './components/theory/MusicTheoryView';
import { SightReadingView } from './components/reading/SightReadingView';
import { EarTrainingView } from './components/eartraining/EarTrainingView';
import { TechniqueView } from './components/technique/TechniqueView';
import { StudyLibraryView } from './components/library/StudyLibraryView';
import { ProgressView } from './components/progress/ProgressView';
import { SettingsView } from './components/settings/SettingsView';
import { OfflineIndicator } from './components/common/OfflineIndicator';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [progress, setProgress] = useState<UserProgress>(() => storageService.loadProgress());
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Background study session timer (increments study seconds while app is in foreground)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const updated: UserProgress = {
          ...prev,
          totalStudyTimeSeconds: prev.totalStudyTimeSeconds + 5,
          todayStudyTimeSeconds: prev.todayStudyTimeSeconds + 5,
        };
        storageService.saveProgress(updated);
        return updated;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('curriculum');
    setProgress((prev) => {
      const updated = { ...prev, currentLessonId: lessonId };
      storageService.saveProgress(updated);
      return updated;
    });
  };

  const handleGoToFirstLesson = () => {
    setSelectedLessonId('lesson-1');
    setCurrentTab('curriculum');
  };

  const handleOpenMetronomeAtBpm = (bpm: number) => {
    const cfg = storageService.loadMetronome();
    cfg.bpm = bpm;
    storageService.saveMetronome(cfg);
    setCurrentTab('metronome');
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

  // Find currently selected lesson if any
  const allLessons = CURRICULUM_LEVELS.flatMap((l) => l.lessons);
  const activeLesson: Lesson | undefined = selectedLessonId
    ? allLessons.find((l) => l.id === selectedLessonId)
    : undefined;

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#25252A] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
        onGoToFirstLesson={handleGoToFirstLesson}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex">
        <Navigation
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'curriculum') {
              // keep current selected lesson or allow browsing
            } else {
              setSelectedLessonId(null);
            }
          }}
          isOpenMobile={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* TAB 1: Início */}
          {currentTab === 'home' && (
            <DashboardView
              progress={progress}
              onNavigateTab={(tab) => {
                setCurrentTab(tab);
                setSelectedLessonId(null);
              }}
              onSelectLesson={handleSelectLesson}
            />
          )}

          {/* TAB 2: Minha Formação (Curriculum or Active Lesson Viewer) */}
          {currentTab === 'curriculum' && (
            activeLesson ? (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedLessonId(null)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold transition border border-[#D9D9D9] flex items-center gap-1.5 shadow-xs"
                >
                  ← Voltar à lista de níveis e aulas
                </button>
                <LessonViewer
                  lesson={activeLesson}
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onSelectLesson={handleSelectLesson}
                />
              </div>
            ) : (
              <CurriculumView
                progress={progress}
                onSelectLesson={handleSelectLesson}
              />
            )
          )}

          {/* TAB 3: Braço da Guitarra */}
          {currentTab === 'fretboard' && <FretboardView />}

          {/* TAB 4: Dicionário de Acordes */}
          {currentTab === 'chords' && (
            <ChordDictionaryView
              favoriteChords={progress.favoriteChords}
              onToggleFavorite={handleToggleFavoriteChord}
            />
          )}

          {/* TAB 5: Metrônomo */}
          {currentTab === 'metronome' && <MetronomeView />}

          {/* TAB 6: Teoria Musical */}
          {currentTab === 'theory' && <MusicTheoryView />}

          {/* TAB 7: Leitura Musical */}
          {currentTab === 'reading' && <SightReadingView />}

          {/* TAB 8: Treino Auditivo */}
          {currentTab === 'ear-training' && <EarTrainingView />}

          {/* TAB 9: Técnica */}
          {currentTab === 'technique' && (
            <TechniqueView onOpenMetronomeAtBpm={handleOpenMetronomeAtBpm} />
          )}

          {/* TAB 10: Biblioteca de Estudos */}
          {currentTab === 'library' && (
            <StudyLibraryView onOpenMetronomeAtBpm={handleOpenMetronomeAtBpm} />
          )}

          {/* TAB 11: Meu Progresso */}
          {currentTab === 'progress' && (
            <ProgressView
              progress={progress}
              onUpdateProgress={setProgress}
              onSelectLesson={handleSelectLesson}
            />
          )}

          {/* TAB 12: Configurações */}
          {currentTab === 'settings' && (
            <SettingsView
              progress={progress}
              onUpdateProgress={setProgress}
            />
          )}
        </main>
      </div>

      {/* Floating Offline Notification Status */}
      <OfflineIndicator />
    </div>
  );
}

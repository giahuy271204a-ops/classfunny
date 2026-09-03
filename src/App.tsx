import React, { useState, useEffect } from 'react';
import { StorageService } from './lib/storage';
import { SoundEffects } from './lib/sound';
import { AppSettings, ClassRoom, QuizQuestion, TeamScore, ActivityLog, QuestionSet, GamePreset } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { QuickTimerModal } from './components/common/QuickTimerModal';
import { DashboardPage } from './pages/DashboardPage';
import { ClassesPage } from './pages/ClassesPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { RandomStudentPage } from './pages/RandomStudentPage';
import { GroupGeneratorPage } from './pages/GroupGeneratorPage';
import { RandomOrderPage } from './pages/RandomOrderPage';
import { ScoreboardPage } from './pages/ScoreboardPage';
import { TimerPage } from './pages/TimerPage';
import { GameLibraryPage } from './pages/GameLibraryPage';
import { SettingsPage } from './pages/SettingsPage';
import { HistoryPage } from './pages/HistoryPage';
import { Minimize2, Maximize2 } from 'lucide-react';

export default function App() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [activeClassId, setActiveClassId] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [gamePresets, setGamePresets] = useState<GamePreset[]>([]);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Modals & UI Controls
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isQuickTimerOpen, setIsQuickTimerOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial data from Storage / IndexedDB
  useEffect(() => {
    async function loadData() {
      try {
        const loadedClasses = await StorageService.getClasses();
        const loadedScores = await StorageService.getTeamScores();
        const loadedQuestions = await StorageService.getQuizQuestions();
        const loadedSets = await StorageService.getQuestionSets();
        const loadedPresets = await StorageService.getGamePresets();
        const loadedLogs = await StorageService.getActivityLogs();

        setClasses(loadedClasses);
        if (loadedClasses.length > 0) {
          setActiveClassId(loadedClasses[0].id);
        }
        setTeamScores(loadedScores);
        setQuizQuestions(loadedQuestions);
        setQuestionSets(loadedSets);
        setGamePresets(loadedPresets);
        setActivityLogs(loadedLogs);
      } catch (err) {
        console.error('Failed to initialize app data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update theme class on root element
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Sync sound settings
  useEffect(() => {
    SoundEffects.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Active class entity
  const activeClass = classes.find((c) => c.id === activeClassId) || classes[0] || null;

  // Handlers for data changes
  const handleUpdateClasses = async (updated: ClassRoom[]) => {
    setClasses(updated);
    await StorageService.saveClasses(updated);
    if (!updated.some((c) => c.id === activeClassId) && updated.length > 0) {
      setActiveClassId(updated[0].id);
    }
  };

  const handleUpdateScores = async (updated: TeamScore[]) => {
    setTeamScores(updated);
    await StorageService.saveTeamScores(updated);
  };

  const handleUpdateQuestions = async (updated: QuizQuestion[]) => {
    setQuizQuestions(updated);
    await StorageService.saveQuizQuestions(updated);
  };

  const handleSaveQuestion = async (q: QuizQuestion) => {
    const updated = await StorageService.saveQuizQuestion(q);
    setQuizQuestions(updated);
    SoundEffects.click();
  };

  const handleDeleteQuestion = async (id: string) => {
    const updated = await StorageService.deleteQuizQuestion(id);
    setQuizQuestions(updated);
    SoundEffects.click();
  };

  const handleBulkDeleteQuestions = async (ids: string[]) => {
    const updated = await StorageService.bulkDeleteQuizQuestions(ids);
    setQuizQuestions(updated);
    SoundEffects.click();
  };

  const handleSaveQuestionSet = async (set: QuestionSet) => {
    const updated = await StorageService.saveQuestionSet(set);
    setQuestionSets(updated);
    SoundEffects.win();
  };

  const handleDeleteQuestionSet = async (id: string) => {
    const updated = await StorageService.deleteQuestionSet(id);
    setQuestionSets(updated);
    SoundEffects.click();
  };

  const handleSaveGamePreset = async (preset: GamePreset) => {
    const updated = await StorageService.saveGamePreset(preset);
    setGamePresets(updated);
  };

  const handleImportQuestions = async (imported: QuizQuestion[]) => {
    const current = await StorageService.getQuizQuestions();
    const merged = [...imported, ...current];
    await StorageService.saveQuizQuestions(merged);
    setQuizQuestions(merged);
    SoundEffects.win();
    handleLogActivity(`Đã nhập ${imported.length} câu hỏi mới vào Ngân hàng.`);
  };

  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  const handleLogActivity = async (title: string, details?: string) => {
    try {
      const newLog = await StorageService.addActivityLog(title, details);
      setActivityLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePresentation = () => {
    SoundEffects.click();
    setPresentationMode(!presentationMode);
  };

  const handleResetToDefault = async () => {
    await StorageService.resetToDefaults();
    const loadedClasses = await StorageService.getClasses();
    const loadedScores = await StorageService.getTeamScores();
    const loadedQuestions = await StorageService.getQuizQuestions();
    const loadedSets = await StorageService.getQuestionSets();
    const loadedPresets = await StorageService.getGamePresets();
    setClasses(loadedClasses);
    if (loadedClasses.length > 0) setActiveClassId(loadedClasses[0].id);
    setTeamScores(loadedScores);
    setQuizQuestions(loadedQuestions);
    setQuestionSets(loadedSets);
    setGamePresets(loadedPresets);
    setActivityLogs([]);
    SoundEffects.win();
    alert('Đã khôi phục dữ liệu mẫu thành công!');
  };

  const handleRestoreAllData = async (data: {
    classes?: ClassRoom[];
    quizQuestions?: QuizQuestion[];
    questionSets?: QuestionSet[];
    gamePresets?: GamePreset[];
    teamScores?: TeamScore[];
    settings?: AppSettings;
  }) => {
    if (data.classes) {
      setClasses(data.classes);
      await StorageService.saveClasses(data.classes);
      if (data.classes.length > 0) setActiveClassId(data.classes[0].id);
    }
    if (data.quizQuestions) {
      setQuizQuestions(data.quizQuestions);
      await StorageService.saveQuizQuestions(data.quizQuestions);
    }
    if (data.questionSets) {
      setQuestionSets(data.questionSets);
      await StorageService.saveQuestionSets(data.questionSets);
    }
    if (data.gamePresets) {
      setGamePresets(data.gamePresets);
      await StorageService.saveGamePresets(data.gamePresets);
    }
    if (data.teamScores) {
      setTeamScores(data.teamScores);
      await StorageService.saveTeamScores(data.teamScores);
    }
    if (data.settings) {
      setSettings(data.settings);
      StorageService.saveSettings(data.settings);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-sans font-bold text-sm text-slate-700 dark:text-slate-300">
            Đang tải dữ liệu lớp học...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 antialiased selection:bg-blue-600 selection:text-white">
      {/* Navbar (Hidden in Presentation Mode for max projector immersion) */}
      {!presentationMode && (
        <Navbar
          classes={classes}
          activeClass={activeClass}
          onSelectClass={(id) => {
            SoundEffects.click();
            setActiveClassId(id);
          }}
          onManageClasses={() => setCurrentTab('classes')}
          soundEnabled={settings.soundEnabled ?? true}
          onToggleSound={() =>
            handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
          }
          theme={settings.theme}
          onToggleTheme={() =>
            handleUpdateSettings({
              theme: settings.theme === 'light' ? 'dark' : 'light',
            })
          }
          presentationMode={presentationMode}
          onTogglePresentation={handleTogglePresentation}
          onOpenQuickTimer={() => setIsQuickTimerOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
      )}

      {/* Presentation Mode Float Bar to Exit */}
      {presentationMode && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in flex items-center gap-2">
          <button
            onClick={() => setIsQuickTimerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 cursor-pointer"
          >
            ⏱ Đồng hồ
          </button>
          <button
            onClick={handleTogglePresentation}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
            Thoát chế độ máy chiếu
          </button>
        </div>
      )}

      {/* Main Workspace layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        {!presentationMode && (
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              SoundEffects.click();
              setCurrentTab(tab);
            }}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            gameCount={10}
            questionCount={quizQuestions.length}
            studentCount={activeClass?.students.filter((s) => !s.isAbsent).length || 0}
          />
        )}

        {/* Dynamic Page Views */}
        <main
          className={`flex-1 overflow-y-auto ${
            presentationMode ? 'p-4 sm:p-8 max-w-7xl mx-auto w-full' : 'lg:ml-64 p-4 sm:p-6 lg:p-8'
          }`}
        >
          {currentTab === 'dashboard' && (
            <DashboardPage
              classes={classes}
              activeClass={activeClass}
              activityLogs={activityLogs}
              onNavigate={(tab) => {
                SoundEffects.click();
                setCurrentTab(tab as NavTab);
              }}
              onOpenQuickTimer={() => setIsQuickTimerOpen(true)}
            />
          )}

          {currentTab === 'classes' && (
            <ClassesPage
              classes={classes}
              activeClassId={activeClassId}
              onSelectClass={(id) => setActiveClassId(id)}
              onUpdateClasses={handleUpdateClasses}
              onLogActivity={handleLogActivity}
            />
          )}

          {currentTab === 'games' && (
            <GameLibraryPage
              activeClass={activeClass}
              quizQuestions={quizQuestions}
              questionSets={questionSets}
              gamePresets={gamePresets}
              teams={teamScores}
              onSaveQuizQuestions={handleUpdateQuestions}
              onSaveGamePreset={handleSaveGamePreset}
              onLogActivity={handleLogActivity}
              onNavigateToQuestionBank={() => setCurrentTab('questions')}
            />
          )}

          {currentTab === 'questions' && (
            <QuestionBankPage
              questions={quizQuestions}
              questionSets={questionSets}
              onSaveQuestion={handleSaveQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onBulkDeleteQuestions={handleBulkDeleteQuestions}
              onSaveQuestionSet={handleSaveQuestionSet}
              onDeleteQuestionSet={handleDeleteQuestionSet}
              onImportQuestions={handleImportQuestions}
              onLaunchGameWithSet={() => {
                setCurrentTab('games');
              }}
            />
          )}

          {currentTab === 'random-student' && (
            <RandomStudentPage
              activeClass={activeClass}
              onLogActivity={handleLogActivity}
            />
          )}

          {currentTab === 'groups' && (
            <GroupGeneratorPage
              activeClass={activeClass}
              onSyncToScoreboard={handleUpdateScores}
              onLogActivity={handleLogActivity}
            />
          )}

          {currentTab === 'random-order' && (
            <RandomOrderPage
              activeClass={activeClass}
              onLogActivity={handleLogActivity}
            />
          )}

          {currentTab === 'scoreboard' && (
            <ScoreboardPage
              scores={teamScores}
              onSaveScores={handleUpdateScores}
              onLogActivity={handleLogActivity}
            />
          )}

          {currentTab === 'timer' && (
            <TimerPage onLogActivity={handleLogActivity} />
          )}

          {currentTab === 'history' && (
            <HistoryPage
              activityLogs={activityLogs}
              onClearHistory={async () => {
                setActivityLogs([]);
                await StorageService.clearActivityLogs();
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              classes={classes}
              quizQuestions={quizQuestions}
              teamScores={teamScores}
              onRestoreAllData={handleRestoreAllData}
              onResetToDefault={handleResetToDefault}
              onLogActivity={handleLogActivity}
            />
          )}
        </main>
      </div>

      {/* Global Quick Timer Modal */}
      <QuickTimerModal
        isOpen={isQuickTimerOpen}
        onClose={() => setIsQuickTimerOpen(false)}
      />
    </div>
  );
}

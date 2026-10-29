import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { OfflineProvider } from './context/OfflineContext';
import { ConnectivityBanner } from './components/ConnectivityBanner';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AITutorPage } from './pages/AITutorPage';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { MyLearningPage } from './pages/MyLearningPage';
import { CoursesPage } from './pages/CoursesPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string>('');
  const [tutorInitialMode, setTutorInitialMode] = useState<any>('simple');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Si el usuario inicia sesión y estaba en 'landing', llevarlo al panel correspondiente
  const handleAuthenticatedRedirect = () => {
    const role = user?.profile?.role || 'student';
    if (role === 'teacher') {
      setCurrentTab('teacher-dashboard');
    } else if (role === 'admin') {
      setCurrentTab('admin-dashboard');
    } else {
      setCurrentTab('student-dashboard');
    }
  };

  useEffect(() => {
    if (user && currentTab === 'landing') {
      handleAuthenticatedRedirect();
    }
  }, [user]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigate = (tab: string, extra?: any) => {
    if (tab === 'course-detail') {
      setSelectedCourseId(extra);
      setCurrentTab('courses');
    } else if (tab === 'tutor') {
      if (typeof extra === 'object' && extra?.prompt) {
        setTutorInitialPrompt(extra.prompt);
        if (extra.mode) setTutorInitialMode(extra.mode);
      } else if (typeof extra === 'string') {
        setTutorInitialPrompt(extra);
      }
      setCurrentTab('tutor');
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] flex flex-col font-sans">
      {/* 1. Banner de Conectividad & Offline Sync */}
      <ConnectivityBanner />

      {/* 2. Barra de Navegación Principal */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* 3. Contenido Dinámico */}
      <main className="flex-1 animate-fade-in">
        {/* Si no ha iniciado sesión, la pantalla de inicio actúa como el portal de acceso/login */}
        {!user || currentTab === 'landing' ? (
          <LandingPage onAuthenticated={handleAuthenticatedRedirect} />
        ) : (
          <>
            {currentTab === 'student-dashboard' && (
              <StudentDashboard onNavigate={handleNavigate} />
            )}

            {currentTab === 'courses' && (
              <CoursesPage
                initialCourseId={selectedCourseId}
                onNavigateToTutor={(topic) => handleNavigate('tutor', `Explícame más sobre el tema: ${topic}`)}
              />
            )}

            {currentTab === 'tutor' && (
              <AITutorPage
                initialPrompt={tutorInitialPrompt}
                initialMode={tutorInitialMode}
              />
            )}

            {currentTab === 'evaluations' && (
              <EvaluationsPage
                onNavigateToTutor={(topic) => handleNavigate('tutor', topic)}
              />
            )}

            {currentTab === 'my-learning' && (
              <MyLearningPage
                onNavigateToTutor={(topic) => handleNavigate('tutor', topic)}
              />
            )}

            {currentTab === 'teacher-dashboard' && (
              <TeacherDashboardPage />
            )}

            {currentTab === 'admin-dashboard' && (
              <AdminDashboardPage />
            )}
          </>
        )}
      </main>

      {/* 4. Modal de Autenticación & Acceso Rápido Demo */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccessRedirect={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <OfflineProvider>
          <MainApp />
        </OfflineProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

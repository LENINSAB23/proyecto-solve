import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserCheck, LogOut, ChevronDown, BookOpen, GraduationCap, Shield } from 'lucide-react';
import type { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const role = user?.profile?.role || 'student';

  const handleRoleSwitch = async (newRole: UserRole) => {
    setShowRoleDropdown(false);
    await switchDemoRole(newRole);
    if (newRole === 'teacher') {
      setCurrentTab('teacher-dashboard');
    } else if (newRole === 'admin') {
      setCurrentTab('admin-dashboard');
    } else {
      setCurrentTab('student-dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentTab('landing');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logotipo: MontesSori */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentTab(user ? 'student-dashboard' : 'landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs group-hover:bg-black transition-all">
              M
            </div>
            <div>
              <span className="font-extrabold text-lg text-neutral-900 tracking-tight block leading-tight">
                MontesSori
              </span>
            </div>
          </button>

          {/* Menú de Navegación de Funcionalidades (Visible ÚNICAMENTE tras iniciar sesión / registrarse) */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => setCurrentTab('student-dashboard')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentTab === 'student-dashboard' ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Panel Estudiante
              </button>
              <button
                onClick={() => setCurrentTab('courses')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentTab === 'courses' ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Cursos
              </button>
              <button
                onClick={() => setCurrentTab('tutor')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'tutor' ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-700 hover:text-neutral-900 bg-neutral-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Tutor Inteligente
              </button>
              <button
                onClick={() => setCurrentTab('evaluations')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentTab === 'evaluations' ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Evaluaciones
              </button>
              <button
                onClick={() => setCurrentTab('my-learning')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentTab === 'my-learning' ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Mi Aprendizaje
              </button>

              {/* Accesos condicionales por rol */}
              {(role === 'teacher' || role === 'admin') && (
                <button
                  onClick={() => setCurrentTab('teacher-dashboard')}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                    currentTab === 'teacher-dashboard' ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Docente
                </button>
              )}

              {role === 'admin' && (
                <button
                  onClick={() => setCurrentTab('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                    currentTab === 'admin-dashboard' ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </button>
              )}
            </nav>
          )}
        </div>

        {/* Acciones del Lado Derecho */}
        <div className="flex items-center gap-3">

          {/* Selector Rápido de Rol para Jueces y Evaluadores */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 px-2.5 py-1.5 rounded-full transition-all cursor-pointer font-medium"
              title="Cambiar rápidamente de rol de prueba para evaluar la plataforma"
            >
              <UserCheck className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">Rol:</span>
              <span className="font-semibold capitalize">
                {user ? (role === 'teacher' ? 'Docente Elena' : role === 'admin' ? 'Admin Camila' : 'Estudiante Mateo') : 'Acceso Demo'}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-50 animate-fade-in">
                <div className="px-3 py-1.5 border-b border-neutral-100">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Cambio rápido para evaluación
                  </p>
                </div>
                <button
                  onClick={() => handleRoleSwitch('student')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                    user && role === 'student' ? 'font-bold text-neutral-900 bg-neutral-50' : 'text-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Estudiante (Mateo)</span>
                  </div>
                  {user && role === 'student' && <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded">Activo</span>}
                </button>
                <button
                  onClick={() => handleRoleSwitch('teacher')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                    user && role === 'teacher' ? 'font-bold text-neutral-900 bg-neutral-50' : 'text-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Docente (Elena)</span>
                  </div>
                  {user && role === 'teacher' && <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded">Activo</span>}
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                    user && role === 'admin' ? 'font-bold text-neutral-900 bg-neutral-50' : 'text-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Administrador (Camila)</span>
                  </div>
                  {user && role === 'admin' && <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded">Activo</span>}
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-neutral-900 leading-tight">
                  {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
                </span>
                <span className="text-[10px] text-neutral-500">
                  {user.profile?.school_name ? user.profile.school_name.slice(0, 24) + '...' : 'MontesSori'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all cursor-pointer"
                title="Cerrar sesión y volver al inicio"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-medium px-3 py-1.5 text-neutral-700 hover:text-neutral-900 cursor-pointer"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="text-xs font-semibold px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-black text-white shadow-xs transition-all cursor-pointer"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

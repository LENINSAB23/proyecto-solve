import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, BookOpen, GraduationCap, Shield } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccessRedirect?: (tab: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccessRedirect,
}) => {
  const { login, register, switchDemoRole, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await login({ username, password });
      } else {
        await register({
          username,
          password,
          email,
          first_name: firstName,
          last_name: lastName,
          role,
        });
      }
      onClose();
      if (onSuccessRedirect) {
        onSuccessRedirect(role === 'teacher' ? 'teacher-dashboard' : (role === 'admin' ? 'admin-dashboard' : 'student-dashboard'));
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación. Por favor verifica tus credenciales.');
    }
  };

  const handleDemoClick = async (demoRole: UserRole) => {
    setError(null);
    try {
      await switchDemoRole(demoRole);
      onClose();
      if (onSuccessRedirect) {
        onSuccessRedirect(demoRole === 'teacher' ? 'teacher-dashboard' : (demoRole === 'admin' ? 'admin-dashboard' : 'student-dashboard'));
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión de demostración.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-neutral-200 shadow-xl overflow-hidden p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1 rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-base mx-auto mb-3">
            M
          </div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            {mode === 'login' ? 'Bienvenido a MontesSori' : 'Crea tu cuenta de aprendizaje'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {mode === 'login'
              ? 'Ingresa tus credenciales o accede con 1 clic en modo demostración'
              : 'Únete a la plataforma inclusiva para estudiantes y docentes'}
          </p>
        </div>

        {/* Acceso Rápido Demo (Ideal para jueces MIT Solve) */}
        <div className="mb-6 bg-neutral-50 border border-neutral-200 rounded-xl p-3">
          <p className="text-[11px] font-semibold text-neutral-600 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            Acceso Rápido para Demostración:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('student')}
              className="text-left p-2 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-xs transition-all text-xs cursor-pointer group"
            >
              <div className="flex items-center gap-1 font-semibold text-neutral-900 mb-0.5">
                <BookOpen className="w-3 h-3 text-neutral-500 group-hover:text-neutral-900" />
                Estudiante
              </div>
              <p className="text-[10px] text-neutral-400">Mateo Ríos</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('teacher')}
              className="text-left p-2 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-xs transition-all text-xs cursor-pointer group"
            >
              <div className="flex items-center gap-1 font-semibold text-neutral-900 mb-0.5">
                <GraduationCap className="w-3 h-3 text-neutral-500 group-hover:text-neutral-900" />
                Docente
              </div>
              <p className="text-[10px] text-neutral-400">Elena Torres</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              className="text-left p-2 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-xs transition-all text-xs cursor-pointer group"
            >
              <div className="flex items-center gap-1 font-semibold text-neutral-900 mb-0.5">
                <Shield className="w-3 h-3 text-neutral-500 group-hover:text-neutral-900" />
                Admin
              </div>
              <p className="text-[10px] text-neutral-400">Camila Vargas</p>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-neutral-200 w-full"></div>
          <span className="bg-white px-2 text-[11px] text-neutral-400 uppercase tracking-wider">o con usuario</span>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ej. Mateo"
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ej. Ríos"
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">Rol en la plataforma</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 px-3 text-xs rounded-lg border font-medium cursor-pointer transition-all ${
                      role === 'student'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    Estudiante
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-1.5 px-3 text-xs rounded-lg border font-medium cursor-pointer transition-all ${
                      role === 'teacher'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    Docente
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="estudiante@escuela.edu"
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-medium text-neutral-700 mb-1">Nombre de usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. mateo_rios"
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-neutral-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrar mi Cuenta'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setError(null);
              setMode(mode === 'login' ? 'register' : 'login');
            }}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
          >
            {mode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

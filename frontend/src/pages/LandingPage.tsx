import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Compass, Cpu, WifiOff, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck, Eye, BookOpen, GraduationCap, Shield } from 'lucide-react';
import type { UserRole } from '../types';

interface LandingPageProps {
  onAuthenticated: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthenticated }) => {
  const { login, register, switchDemoRole, isLoading } = useAuth();

  // Estados del formulario integrado de acceso
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (authMode === 'login') {
        await login({ username, password });
      } else {
        await register({
          username,
          password,
          first_name: firstName,
          last_name: lastName,
          role,
        });
      }
      onAuthenticated();
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación. Por favor revisa tus credenciales.');
    }
  };

  const handleQuickDemo = async (demoRole: UserRole) => {
    setError(null);
    try {
      await switchDemoRole(demoRole);
      onAuthenticated();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión de demostración.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      {/* 1. SECCIÓN PRINCIPAL / PORTAL DE INICIO Y ACCESO */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Lado Izquierdo: Mensaje de Impacto y Propósito */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-600 text-xs font-semibold shadow-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-neutral-900"></span>
              <span>MIT Solve Global Learning Challenge 2027</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.1] mb-6">
              Aprender no debería tener límites.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed mb-8 font-normal">
              Una nueva forma de aprender, enseñar y descubrir tu potencial. Inteligencia artificial socrática al servicio de una educación más accesible, personalizada e inclusiva.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-500 border-t border-neutral-200 pt-6">
              <span className="flex items-center gap-1.5 font-medium text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Aprendizaje a tu propio ritmo
              </span>
              <span className="flex items-center gap-1.5 font-medium text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Funciona sin conexión (Offline)
              </span>
              <span className="flex items-center gap-1.5 font-medium text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Lectura por voz y accesibilidad
              </span>
            </div>
          </div>

          {/* Lado Derecho: Portal Directo de Inicio de Sesión y Registro */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-base mx-auto mb-3 shadow-xs">
                  M
                </div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                  {authMode === 'login' ? 'Ingresar a MontesSori' : 'Crear Cuenta en MontesSori'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Accede a tus cursos, tutor inteligente y evaluaciones
                </p>
              </div>

              {/* Selector de Pestaña: Iniciar Sesión / Registro */}
              <div className="flex bg-neutral-100 p-1 rounded-xl mb-6 border border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    authMode === 'login' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    authMode === 'register' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {/* Acceso Rápido Demo (1-Clic para evaluación MIT Solve) */}
              <div className="mb-5 bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                <p className="text-[11px] font-semibold text-neutral-500 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-neutral-900" />
                  <span>Acceso Rápido para Evaluadores:</span>
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('student')}
                    className="p-2 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-[11px] text-neutral-900 block">Estudiante</span>
                    <span className="text-[10px] text-neutral-400 block -mt-0.5">Mateo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('teacher')}
                    className="p-2 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-[11px] text-neutral-900 block">Docente</span>
                    <span className="text-[10px] text-neutral-400 block -mt-0.5">Elena</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="p-2 rounded-lg bg-white border border-neutral-200 hover:border-neutral-900 text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-[11px] text-neutral-900 block">Admin</span>
                    <span className="text-[10px] text-neutral-400 block -mt-0.5">Camila</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-700 mb-1">Nombre</label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Mateo"
                          className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-700 mb-1">Apellido</label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Ríos"
                          className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-700 mb-1">Rol</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRole('student')}
                          className={`py-1.5 text-xs rounded-lg border font-semibold cursor-pointer transition-all ${
                            role === 'student' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200'
                          }`}
                        >
                          Estudiante
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('teacher')}
                          className={`py-1.5 text-xs rounded-lg border font-semibold cursor-pointer transition-all ${
                            role === 'teacher' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200'
                          }`}
                        >
                          Docente
                        </button>
                      </div>
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
                    placeholder="Ej. mateo_estudiante"
                    className="w-full text-xs px-3 py-2.5 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
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
                    className="w-full text-xs px-3 py-2.5 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{isLoading ? 'Ingresando...' : authMode === 'login' ? 'Iniciar Sesión y Entrar' : 'Registrar y Comenzar'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOTOGRAFÍA PRINCIPAL & IMPACTO VISUAL MINIMALISTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <div className="relative rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm aspect-16/9 sm:aspect-21/9">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
            alt="Estudiantes colaborando activamente en una experiencia de aprendizaje inclusiva"
            className="w-full h-full object-cover filter contrast-[1.02] brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white max-w-xl">
              <span className="text-xs uppercase font-semibold tracking-wider text-neutral-300">
                Acompañamiento Socrático en Cada Rincón
              </span>
              <p className="text-base sm:text-lg font-medium mt-1 leading-snug">
                Diseñado para operar en comunidades con conectividad intermitente, reduciendo la brecha educativa con tutoría inteligente guiada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EL PROBLEMA EDUCATIVO QUE SOLUCIONAMOS */}
      <section className="py-16 bg-white border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
              Desafío Global
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-1">
              Las barreras que frenan el potencial de millones de estudiantes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-bold text-neutral-900 mb-4 shadow-2xs">
                01
              </div>
              <h3 className="font-bold text-base text-neutral-900 mb-2">Falta de Acompañamiento Individual</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                En aulas con 30 o 40 estudiantes, el docente no puede dedicar 15 minutos diarios a cada alumno para resolver dudas específicas sobre matemáticas o ciencias.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-bold text-neutral-900 mb-4 shadow-2xs">
                02
              </div>
              <h3 className="font-bold text-base text-neutral-900 mb-2">Dificultades Identificadas Demasiado Tarde</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Muchos vacíos de aprendizaje se descubren recién en exámenes finales, cuando el rezago ya es acumulativo y difícil de remediar sin intervención temprana.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-bold text-neutral-900 mb-4 shadow-2xs">
                03
              </div>
              <h3 className="font-bold text-base text-neutral-900 mb-2">Exclusión por Conectividad y Discapacidad</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Plataformas complejas exigen conexiones de alta velocidad constantes y carecen de herramientas de lectura por voz, adaptabilidad visual o sincronización offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FUNCIONALIDADES CLAVE DE MONTESSORI */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
            Arquitectura de la Solución
          </span>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mt-1">
            Herramientas inteligentes para una autonomía real
          </h2>
          <p className="text-sm text-neutral-600 mt-3">
            Inspirada en el método MontesSori: el estudiante aprende haciendo, a su propio ritmo, con retroalimentación inmediata y apoyo constante.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Tutor Socrático Inteligente</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              No entrega respuestas hechas para copiar. Pregunta, desglosa paso a paso y orienta al estudiante para que razone y comprenda.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Diagnóstico & Mi Aprendizaje</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Monitoreo visual de temas dominados vs. temas que necesitan refuerzo, con gráficos claros de maestría académica.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Modo Conexión Limitada</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Descarga contenidos y responde autoevaluaciones sin internet. Los progresos se sincronizan automáticamente al recuperar la señal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Copiloto para Docentes</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Genera borradores de planes de clase, rúbricas y ejercicios personalizados. El docente conserva siempre el 100% del control editorial.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Accesibilidad Universal Nativa</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Lectura en voz alta mediante Web Speech API, ajuste de escala tipográfica (A, A+, A++) y modo de alto contraste para baja visión.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all shadow-xs group">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Privacidad y Protección</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Los datos de los estudiantes nunca se utilizan para entrenar modelos externos. Las claves API residen de forma segura en el backend.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CÓMO FUNCIONA LA INTELIGENCIA ARTIFICIAL (Ética y no reemplazo) */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
                Filosofía Pedagógica
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 mb-6">
                La IA complementa al profesor, jamás lo reemplaza.
              </h2>
              <p className="text-neutral-300 text-base leading-relaxed mb-6">
                MontesSori está diseñada bajo un principio ético inquebrantable: la inteligencia artificial es una herramienta de apoyo que libera al docente de tareas repetitivas y le ofrece al estudiante un compañero de estudio siempre paciente.
              </p>

              <div className="space-y-4 text-sm text-neutral-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Técnica Socrática y Metacognición</strong>
                    <span>Guía al estudiante mediante preguntas y analogías cotidianas para que comprenda el origen de los resultados.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Alertas de Estudiantes en Riesgo</strong>
                    <span>El docente recibe métricas automáticas para intervenir oportunamente con los alumnos que presentan dificultades persistentes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Transparencia y Modo Demostración</strong>
                    <span>Si el servidor opera sin clave API o sin red, la plataforma utiliza su motor de demostración pedagógica claramente identificado.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800/80 rounded-2xl p-6 sm:p-8 border border-neutral-700">
              <div className="flex items-center justify-between border-b border-neutral-700 pb-4 mb-4 text-xs text-neutral-400">
                <span className="font-semibold text-white">Simulación de Diálogo Pedagógico</span>
                <span className="bg-neutral-700 px-2 py-0.5 rounded text-[11px]">Modo: Paso a paso</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="bg-neutral-900/90 p-3.5 rounded-xl border border-neutral-700">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold mb-1">Estudiante:</span>
                  <p className="text-neutral-200">"¿Por qué no puedo sumar 1/2 + 1/3 sumando los números de abajo para que dé 2/5?"</p>
                </div>

                <div className="bg-neutral-900/90 p-3.5 rounded-xl border border-neutral-700">
                  <span className="text-emerald-400 block text-[10px] uppercase font-bold mb-1">MontesSori:</span>
                  <p className="text-neutral-300 leading-relaxed font-sans text-xs">
                    "¡Excelente pregunta! Pensemos en una pizza. Si tienes media pizza (1/2), eso es el 50%. Si le sumas un tercio (1/3), tienes más de la mitad. Pero 2/5 es solo el 40%, ¡sería menos de lo que tenías al principio! Por eso necesitamos encontrar rebanadas de igual tamaño común (sextos) antes de juntarlas."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. IMPACTO SOCIAL: MIT SOLVE 2027 */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-100 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs uppercase font-bold tracking-widest text-neutral-500">
              Candidatura MIT Solve 2027
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1 mb-4">
              Escalabilidad probada para comunidades vulnerables
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Diseñado inicialmente para implementarse en centros de educación básica y media rural, MontesSori requiere recursos de hardware mínimos, opera en dispositivos móviles estándar y garantiza la continuidad pedagógica aun sin electricidad o señal permanente.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0 w-full md:w-auto">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 text-center">
              <span className="text-3xl font-extrabold text-neutral-900 block">100%</span>
              <span className="text-xs text-neutral-500 mt-1 block">Accesible y Offline</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 text-center">
              <span className="text-3xl font-extrabold text-neutral-900 block">0</span>
              <span className="text-xs text-neutral-500 mt-1 block">Costo de Licencias</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PREGUNTAS FRECUENTES (FAQ) */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 border-t border-neutral-200">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-xs text-neutral-500 mt-2">
            Todo lo que necesitas saber sobre MontesSori y su propuesta pedagógica.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "¿Cómo apoya MontesSori a los docentes en el aula?",
              a: "Los docentes cuentan con un panel de analíticas que identifica a los alumnos que necesitan refuerzo en tiempo real. Además, tienen una herramienta de IA que sugiere planes de clase, rúbricas y ejercicios diferenciados según el nivel del grupo."
            },
            {
              q: "¿Qué sucede si una escuela no cuenta con conexión permanente a internet?",
              a: "La plataforma cuenta con almacenamiento local (offline-first). Los estudiantes pueden leer lecciones descargadas y completar autoevaluaciones sin red. Tan pronto el dispositivo detecta conexión, los resultados se sincronizan de forma transparente."
            },
            {
              q: "¿Cómo se protege la privacidad de los menores de edad?",
              a: "Cumplimos con estrictas políticas de protección de datos. No se requiere información sensible innecesaria, las credenciales no son públicas y los datos de interacción no se comparten con terceros para entrenar modelos."
            },
            {
              q: "¿Qué modelo de inteligencia artificial utiliza la plataforma?",
              a: "Se integra en el backend con Google Gemini API. En caso de no contar con clave configurada o durante cortes de conectividad, el sistema activa su motor pedagógico de demostración MontesSori de forma honesta y documentada."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-neutral-200 rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-neutral-900 cursor-pointer"
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER MINIMALISTA */}
      <footer className="border-t border-neutral-200 py-12 bg-white text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span className="font-semibold text-neutral-900">MontesSori</span>
            <span>· MIT Solve Challenge 2027</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Inclusión y Accesibilidad</span>
            <span>Tutoría Socrática</span>
            <span>Código Abierto</span>
          </div>

          <p className="text-[11px] text-neutral-400">
            © 2027 MontesSori. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

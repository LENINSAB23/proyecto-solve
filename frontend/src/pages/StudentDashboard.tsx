import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StudentDashboardData } from '../types';
import { Sparkles, BookOpen, Clock, Award, Flame, ArrowRight, CheckCircle, Calendar, Play } from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentDashboard();
      setData(res);
    } catch (err) {
      console.error('Error loading student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Saludo Personalizado y Header (Inspirado en Imagen de Referencia 3 "Good Morning, Cecillia") */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Buenos días, {user?.first_name || 'Estudiante'} 👋
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
              {data?.grade_level || 'Educación Básica'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            "El objetivo de la educación no es llenar un recipiente, sino encender un fuego." — Aprendizaje Activo
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador de Racha de Estudio */}
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-3.5 py-2 rounded-xl">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <div>
              <span className="text-xs font-bold text-neutral-900 block leading-none">
                {data?.streak_days || 5} Días
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">Racha activa</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('tutor')}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultar a mi Tutor IA</span>
          </button>
        </div>
      </div>

      {/* KPI Cards de Resumen Académico */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cursos Activos</span>
            <BookOpen className="w-4 h-4 text-neutral-800" />
          </div>
          <span className="text-2xl font-extrabold text-neutral-900">{data?.active_courses_count || 3}</span>
          <span className="text-[11px] text-neutral-500 block mt-1">En curso este ciclo</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Horas de Estudio</span>
            <Clock className="w-4 h-4 text-neutral-800" />
          </div>
          <span className="text-2xl font-extrabold text-neutral-900">{data?.study_hours || 14.5} h</span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">+2.4h esta semana</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Actividades</span>
            <CheckCircle className="w-4 h-4 text-neutral-800" />
          </div>
          <span className="text-2xl font-extrabold text-neutral-900">{data?.completed_activities_count || 8}</span>
          <span className="text-[11px] text-neutral-500 block mt-1">Completadas con éxito</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Promedio General</span>
            <Award className="w-4 h-4 text-neutral-800" />
          </div>
          <span className="text-2xl font-extrabold text-neutral-900">{data?.average_score || 82}%</span>
          <span className="text-[11px] text-neutral-500 block mt-1">Nivel: Destacado</span>
        </div>
      </div>

      {/* Grid Principal: Cursos en Progreso + Horario & Tutor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Columna Izquierda (2 spans): Cursos Inscritos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Mis Cursos en Curso</h2>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos los cursos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.courses && data.courses.length > 0 ? (
              data.courses.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-900 transition-all shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2 font-medium">
                      <span>{enrollment.course.subject_details?.name || 'Asignatura'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-semibold">
                        {enrollment.progress_percentage}%
                      </span>
                    </div>

                    <h3 className="font-bold text-neutral-900 text-base leading-snug mb-2">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {enrollment.course.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100">
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className="bg-neutral-900 h-full rounded-full transition-all duration-500"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">
                        Prof. {enrollment.course.teacher_name || 'Elena Torres'}
                      </span>
                      <button
                        onClick={() => onNavigate('course-detail', enrollment.course.id)}
                        className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Continuar</span>
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 bg-white rounded-2xl border border-neutral-200">
                <p className="text-xs text-neutral-500">No tienes cursos activos todavía.</p>
                <button
                  onClick={() => onNavigate('courses')}
                  className="mt-2 text-xs font-semibold text-neutral-900 underline"
                >
                  Explorar cursos disponibles
                </button>
              </div>
            )}
          </div>

          {/* Horario de Clases y Actividades (Inspirado en Referencias 1 y 3) */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-700" />
                <h3 className="font-bold text-neutral-900 text-sm">Cronograma y Sesiones Semanales</h3>
              </div>
              <span className="text-xs text-neutral-400">Semana en curso</span>
            </div>

            <div className="space-y-3">
              {[
                { time: '08:00 - 09:30', course: 'Fracciones y Proporciones', type: 'Taller Práctico', teacher: 'Prof. Elena Torres', status: 'Hoy' },
                { time: '10:00 - 11:30', course: 'Ecosistemas y Conservación', type: 'Laboratorio Virtual', teacher: 'Prof. Elena Torres', status: 'Mañana' },
                { time: '14:00 - 15:00', course: 'Lectura Crítica & Debate', type: 'Evaluación Formativa', teacher: 'Prof. Elena Torres', status: 'Viernes' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-neutral-500 font-medium">{item.time}</span>
                    <div>
                      <h4 className="font-bold text-neutral-900">{item.course}</h4>
                      <p className="text-neutral-500 text-[11px]">{item.type} · {item.teacher}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 font-semibold text-[11px]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha (1 span): Tutor IA Widget + Recomendaciones */}
        <div className="space-y-6">
          {/* Card Destacado: Tutor Inteligente MontesSori */}
          <div className="bg-neutral-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span>Tutor Socrático Inteligente</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2">
              ¿Tienes dudas sobre tu lección?
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Tu tutor IA te explica conceptos difíciles con analogías sencillas, ejemplos de la vida real o paso a paso.
            </p>

            <div className="space-y-2 mb-5">
              <button
                onClick={() => onNavigate('tutor', { prompt: 'Explícame las fracciones equivalentes con una analogía sencilla', mode: 'simple' })}
                className="w-full text-left text-xs bg-neutral-800/80 hover:bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 text-neutral-200 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>🌱 Explicación con analogías</span>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
              </button>
              <button
                onClick={() => onNavigate('tutor', { prompt: '¿Cómo resuelvo paso a paso una suma de fracciones con distinto denominador?', mode: 'step_by_step' })}
                className="w-full text-left text-xs bg-neutral-800/80 hover:bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 text-neutral-200 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>🪜 Resolver ejercicio paso a paso</span>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('tutor')}
              className="w-full bg-white hover:bg-neutral-100 text-neutral-900 py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
            >
              Abrir Conversación Completa
            </button>
          </div>

          {/* Recomendaciones de Aprendizaje Personalizadas */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-900 text-sm">Recomendado para ti</h3>
              <button
                onClick={() => onNavigate('my-learning')}
                className="text-xs text-neutral-500 hover:text-neutral-900 font-medium"
              >
                Mi Aprendizaje →
              </button>
            </div>

            <div className="space-y-3">
              {data?.recommendations && data.recommendations.length > 0 ? (
                data.recommendations.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-900">{rec.title}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        Prioridad {rec.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-2 mb-2 leading-relaxed">
                      {rec.description}
                    </p>
                    <button
                      onClick={() => onNavigate('tutor', { prompt: `Ayúdame a reforzar: ${rec.topic}`, mode: 'practical' })}
                      className="text-[11px] font-bold text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Realizar actividad sugerida</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-400 py-3 text-center">¡Estás al día con tus temas!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

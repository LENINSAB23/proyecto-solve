import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Course, Activity } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import { BookOpen, Clock, Users, ArrowRight, Play, Volume2, VolumeX, CheckCircle, ArrowLeft } from 'lucide-react';

interface CoursesPageProps {
  initialCourseId?: number;
  onNavigateToTutor: (topic: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ initialCourseId, onNavigateToTutor }) => {
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (initialCourseId && courses.length > 0) {
      loadCourseDetail(initialCourseId);
    }
  }, [initialCourseId, courses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await api.getCourses();
      setCourses(data);
    } catch (e) {
      console.error('Error loading courses:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetail = async (id: number) => {
    try {
      setLoading(true);
      const detail = await api.getCourseDetail(id);
      setSelectedCourse(detail);
      setSelectedActivity(null);
    } catch (e) {
      console.error('Error loading course detail:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteActivity = async (activityId: number) => {
    try {
      await api.completeActivity(activityId);
      if (selectedCourse) {
        loadCourseDetail(selectedCourse.id);
      }
    } catch (e) {
      console.error('Error completing activity:', e);
    }
  };

  // 1. Vista de Lección / Actividad Específica
  if (selectedActivity && selectedCourse) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => setSelectedActivity(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al temario del curso</span>
        </button>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                {selectedCourse.title} · Lección {selectedActivity.order}
              </span>
              <h1 className="text-2xl font-bold text-neutral-900 mt-1">{selectedActivity.title}</h1>
              <p className="text-xs text-neutral-500 mt-0.5">Tema: {selectedActivity.topic}</p>
            </div>

            {/* Botón Accesible de Lectura en Voz Alta */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakText(`${selectedActivity.title}. ${selectedActivity.content_markdown}`);
                }
              }}
              className="flex items-center gap-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium self-start sm:self-center"
              title="Escuchar lección completa en voz alta"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-red-600 animate-pulse" />
                  <span>Detener lectura</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-neutral-700" />
                  <span>Escuchar lección</span>
                </>
              )}
            </button>
          </div>

          <div className="py-8 prose prose-neutral max-w-none text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
            {selectedActivity.content_markdown}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200">
            <button
              onClick={() => onNavigateToTutor(`Explícame más sobre la lección: ${selectedActivity.title}`)}
              className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
            >
              ¿Dudas sobre esta lección? Preguntar a mi Tutor IA →
            </button>

            <button
              onClick={() => handleCompleteActivity(selectedActivity.id)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Marcar como Completada</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Vista de Detalle del Curso (Temario y Actividades)
  if (selectedCourse) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo de cursos</span>
        </button>

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden mb-8 shadow-xs">
          <div className="p-6 sm:p-8">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {selectedCourse.subject_details?.name || 'Asignatura'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1 mb-3">
              {selectedCourse.title}
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
              {selectedCourse.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-neutral-500 border-t border-neutral-100 pt-4">
              <span><strong>Docente:</strong> {selectedCourse.teacher_name || 'Elena Torres'}</span>
              <span>·</span>
              <span><strong>Nivel:</strong> {selectedCourse.grade_level}</span>
              <span>·</span>
              <span><strong>Progreso general:</strong> {selectedCourse.user_progress || 0}%</span>
            </div>
          </div>
        </div>

        {/* Listado de Actividades / Módulos */}
        <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">
          Plan de Lecciones y Actividades Prácticas
        </h2>

        <div className="space-y-3 mb-8">
          {selectedCourse.activities && selectedCourse.activities.length > 0 ? (
            selectedCourse.activities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-xl border border-neutral-200 p-4 hover:border-neutral-900 transition-all flex items-center justify-between gap-4 cursor-pointer text-xs"
                onClick={() => setSelectedActivity(act)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-800">
                    {act.order}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm leading-snug">{act.title}</h3>
                    <p className="text-neutral-500 text-[11px] mt-0.5">{act.topic} · {act.estimated_minutes} min aprox.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {act.student_status === 'completed' ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold text-[11px] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Completada
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white font-semibold flex items-center gap-1 hover:bg-black transition-all">
                      <span>Iniciar</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-neutral-400 p-6 bg-white rounded-xl border border-neutral-200 text-center">
              No hay actividades registradas en este curso todavía.
            </p>
          )}
        </div>
      </div>
    );
  }

  // 3. Catálogo Principal de Cursos
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Cursos de Aprendizaje Activo
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Currículo adaptado con explicaciones socráticas, material descargable y autoevaluaciones formativas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-900 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full bg-neutral-100 overflow-hidden relative">
                {course.cover_image ? (
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <BookOpen className="w-10 h-10" />
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-neutral-900 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs">
                  {course.grade_level}
                </span>
              </div>

              <div className="p-5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  {course.subject_details?.name || 'Asignatura'}
                </span>
                <h3 className="font-bold text-base text-neutral-900 leading-snug mb-2">
                  {course.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-neutral-100 mt-4 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-medium">
                Prof. {course.teacher_name || 'Elena Torres'}
              </span>

              <button
                onClick={() => setSelectedCourse(course)}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>Ver lecciones</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

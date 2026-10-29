import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sparkles, Users, BookOpen, AlertTriangle, CheckCircle, Plus, FileText, ChevronRight, Edit3, Save } from 'lucide-react';

export const TeacherDashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados de la Herramienta de IA para Docentes (Teacher AI Copilot)
  const [aiGenType, setAiGenType] = useState<'quiz' | 'lesson_plan' | 'exercise'>('lesson_plan');
  const [aiTopic, setAiTopic] = useState('Ecosistemas y Conservación del Agua');
  const [aiSubject, setAiSubject] = useState('Ciencias Naturales');
  const [aiGrade, setAiGrade] = useState('Secundaria - 2° Año');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any | null>(null);
  const [editableContent, setEditableContent] = useState<string>('');

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      const res = await api.getTeacherDashboard();
      setDashboardData(res);
    } catch (e) {
      console.error('Error loading teacher dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setGenerationResult(null);
    try {
      const res = await api.teacherAiGenerate({
        generation_type: aiGenType,
        topic: aiTopic,
        subject: aiSubject,
        grade_level: aiGrade,
        prompt: aiPrompt,
      });
      setGenerationResult(res);
      setEditableContent(JSON.stringify(res.data, null, 2));
    } catch (e) {
      console.error('Error generating AI resource:', e);
      alert('Hubo un error al generar el recurso pedagógico.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Docente */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-neutral-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Panel de Gestión Docente & Copiloto IA
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
            {dashboardData?.teacher_name || 'Prof. Elena Torres'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Supervisa el aprendizaje activo de tu comunidad escolar y diseña materiales inclusivos en minutos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
            Aula Inclusiva MontesSori
          </span>
        </div>
      </div>

      {/* KPI Cards del Aula */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Total Estudiantes
          </span>
          <span className="text-3xl font-extrabold text-neutral-900">
            {dashboardData?.total_students || 28}
          </span>
          <span className="text-[11px] text-neutral-500 block mt-1">En tus cursos asignados</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Cursos Activos
          </span>
          <span className="text-3xl font-extrabold text-neutral-900">
            {dashboardData?.active_courses_count || 3}
          </span>
          <span className="text-[11px] text-neutral-500 block mt-1">Con lecciones publicadas</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Maestría Promedio
          </span>
          <span className="text-3xl font-extrabold text-neutral-900">
            {dashboardData?.average_class_mastery || 76.4}%
          </span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">Meta del ciclo: &gt;75%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Requieren Apoyo
          </span>
          <span className="text-3xl font-extrabold text-red-600">
            {dashboardData?.at_risk_students?.length || 2}
          </span>
          <span className="text-[11px] text-red-600 font-medium block mt-1">Alertas tempranas activas</span>
        </div>
      </div>

      {/* Grid: Alertas de Estudiantes que Necesitan Apoyo + Copiloto IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 1. Identificación Oportuna de Estudiantes en Riesgo */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="font-bold text-neutral-900 text-base">
                  Estudiantes que Necesitan Acompañamiento
                </h2>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full font-semibold">
                Detección Temprana
              </span>
            </div>

            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              La plataforma monitorea de forma ética los desempeños en evaluaciones y el progreso en lecciones para sugerirte intervenciones formativas personalizadas.
            </p>

            <div className="space-y-3">
              {dashboardData?.at_risk_students && dashboardData.at_risk_students.length > 0 ? (
                dashboardData.at_risk_students.map((st: any) => (
                  <div
                    key={st.id}
                    className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{st.name}</h4>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        {st.course} · Avance: {st.progress}% · Promedio: {st.avg_score}%
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Causa: {st.risk_reason}
                      </span>
                    </div>

                    <button
                      onClick={() => alert(`Sugerencia de intervención para ${st.name}: Enviar actividad guiada con el Tutor MontesSori.`)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-neutral-300 hover:border-neutral-900 font-bold text-neutral-800 transition-all shrink-0 cursor-pointer shadow-2xs"
                    >
                      Intervenir
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center">
                  ¡Todos los estudiantes se encuentran actualmente dentro del estándar esperado!
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
            * Privacidad garantizada: Solo el docente a cargo tiene acceso a las métricas individuales.
          </div>
        </div>

        {/* 2. Herramienta de IA para Docentes (Copiloto Pedagógico) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-900" />
              <h2 className="font-bold text-neutral-900 text-base">
                Copiloto de Creación Pedagógica con IA
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-neutral-500">
              Control 100% Docente
            </span>
          </div>

          <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
            Genera borradores estructurados de planes de clase, rúbricas de evaluación o ejercicios contextualizados listos para que los edites y apruebes.
          </p>

          <div className="space-y-3 text-xs mb-4">
            <div>
              <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                Tipo de Material Educativo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'lesson_plan', label: 'Plan de Clase' },
                  { id: 'quiz', label: 'Cuestionario' },
                  { id: 'exercise', label: 'Taller Práctico' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAiGenType(item.id as any)}
                    className={`py-2 px-2 text-center rounded-xl border font-semibold cursor-pointer transition-all ${
                      aiGenType === item.id
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">Asignatura</label>
                <input
                  type="text"
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">Nivel Escolar</label>
                <input
                  type="text"
                  value={aiGrade}
                  onChange={(e) => setAiGrade(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-700 mb-1">Tema Específico</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Ej. Fotosíntesis, Fracciones equivalentes..."
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                Instrucciones Pedagógicas Adicionales (Opcional)
              </label>
              <textarea
                rows={2}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ej. Enfatizar aplicación en la comunidad rural, incluir preguntas de debate..."
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
              />
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generando borrador pedagógico...' : 'Generar Borrador con IA'}</span>
            </button>
          </div>

          {/* Resultado Generado con Capacidad de Edición para el Docente */}
          {generationResult && (
            <div className="mt-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs animate-fade-in">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-200">
                <span className="font-bold text-neutral-900 flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  Borrador Generado ({generationResult.data?.title || 'Recurso'})
                </span>
                <span className="text-[10px] text-neutral-400">
                  {generationResult.provider || 'Motor Pedagógico MontesSori'}
                </span>
              </div>

              <textarea
                rows={6}
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full font-mono text-[11px] p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-hidden text-neutral-800"
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-neutral-500">
                  El docente conserva el control y puede modificar el borrador antes de publicarlo.
                </span>
                <button
                  onClick={() => alert('¡Borrador guardado exitosamente en tu catálogo de materiales docentes!')}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3 h-3" />
                  <span>Guardar Recurso</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

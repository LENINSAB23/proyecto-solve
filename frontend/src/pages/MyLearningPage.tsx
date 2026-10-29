import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StudentMastery, LearningRecommendation } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Compass, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Award, Target, TrendingUp } from 'lucide-react';

interface MyLearningPageProps {
  onNavigateToTutor: (topic: string) => void;
}

export const MyLearningPage: React.FC<MyLearningPageProps> = ({ onNavigateToTutor }) => {
  const [topics, setTopics] = useState<StudentMastery[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMasteryData();
  }, []);

  const loadMasteryData = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentMastery();
      setTopics(res.topics || []);
      setChartData(res.mastery_chart_data || []);
      setWeeklyProgress(res.weekly_progress || []);
      setRecommendations(res.recommendations || []);
    } catch (e) {
      console.error('Error loading mastery data:', e);
    } finally {
      setLoading(false);
    }
  };

  const getMasteryBadge = (level: string) => {
    switch (level) {
      case 'mastered':
        return <span className="bg-neutral-900 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Dominado (85-100%)</span>;
      case 'standard_met':
        return <span className="bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Nivel Alcanzado (70-84%)</span>;
      case 'nearly_met':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">En Progreso (50-69%)</span>;
      default:
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Necesita Refuerzo (&lt;50%)</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Mi Aprendizaje y Diagnóstico de Maestría
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Visualiza tus fortalezas consolidadas y las áreas prioritarias para reforzar con tu tutor.
          </p>
        </div>

        <button
          onClick={() => onNavigateToTutor('Quiero un plan para reforzar mis temas pendientes')}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generar Plan de Refuerzo con IA</span>
        </button>
      </div>

      {/* Gráficos Analíticos de Rendimiento (Inspirado en Referencia 5 "LeapXR") */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico Donut de Maestría por Temas */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">Distribución de Competencias</h3>
              <p className="text-[11px] text-neutral-400">Porcentaje de asimilación global</p>
            </div>
            <Award className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.length ? chartData : [
                    { name: 'Dominados', value: 4, color: '#111111' },
                    { name: 'Alcanzados', value: 3, color: '#4F46E5' },
                    { name: 'En Progreso', value: 2, color: '#71717A' },
                    { name: 'Refuerzo', value: 1, color: '#E11D48' },
                  ]}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(chartData.length ? chartData : [
                    { color: '#111111' }, { color: '#4F46E5' }, { color: '#71717A' }, { color: '#E11D48' }
                  ]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#111111'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2 text-xs">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span>{d.name}</span>
                </span>
                <span className="font-semibold text-neutral-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Barras: Horas de Dedicación Semanal */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">Progreso y Rendimiento Semanal</h3>
              <p className="text-[11px] text-neutral-400">Horas dedicadas vs. precisión en evaluaciones</p>
            </div>
            <TrendingUp className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <XAxis dataKey="day" stroke="#A1A1AA" fontSize={11} tickLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Puntaje Promedio (%)" fill="#111111" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hours" name="Horas de Estudio" fill="#A1A1AA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Listado Detallado de Temas Evaluados (Fortalezas vs. Oportunidades) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8 shadow-2xs">
        <h3 className="font-bold text-neutral-900 text-sm mb-4">
          Diagnóstico Temático Detallado
        </h3>

        <div className="space-y-4">
          {topics.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-neutral-900">{t.topic}</span>
                  <span className="text-neutral-400 font-medium">({t.subject_name})</span>
                  {getMasteryBadge(t.mastery_level)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-neutral-600">
                  <p className="flex items-start gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-neutral-800">Fortaleza:</strong> {t.strengths || 'Comprensión de conceptos base.'}</span>
                  </p>
                  <p className="flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong className="text-neutral-800">A reforzar:</strong> {t.areas_to_improve || 'Ejercicios de aplicación.'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="font-bold text-sm text-neutral-900">{t.score_average}%</span>
                  <span className="text-[10px] text-neutral-400 block">Promedio</span>
                </div>

                <button
                  onClick={() => onNavigateToTutor(`Quiero practicar y reforzar el tema de ${t.topic}`)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Reforzar con IA</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Pasos y Recomendaciones */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-neutral-700" />
          <h3 className="font-bold text-neutral-900 text-sm">Objetivos y Próximos Pasos Recomendados</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-neutral-900">{rec.title}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-neutral-500 text-[11px] leading-relaxed mb-3">
                  {rec.description}
                </p>
              </div>

              <button
                onClick={() => onNavigateToTutor(`Realicemos la siguiente actividad: ${rec.title}`)}
                className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Iniciar actividad con el tutor</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

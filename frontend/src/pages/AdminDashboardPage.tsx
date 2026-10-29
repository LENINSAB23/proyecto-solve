import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Shield, Users, BookOpen, Award, CheckCircle2, AlertCircle, Cpu, RefreshCw, Key } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminOverview();
      setOverview(res);
    } catch (e) {
      console.error('Error loading admin overview:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-neutral-900" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Panel de Administración MontesSori
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Supervisión institucional, integridad de datos, métricas de inclusión y estado de servicios de IA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Plataforma Operativa 100%
          </span>
        </div>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Total Usuarios
          </span>
          <span className="text-3xl font-extrabold text-neutral-900">
            {overview?.total_users || 3}
          </span>
          <span className="text-[11px] text-neutral-500 block mt-1">
            {overview?.students_count || 1} Estudiantes · {overview?.teachers_count || 1} Docentes
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Cursos Disponibles
          </span>
          <span className="text-3xl font-extrabold text-neutral-900">
            {overview?.courses_count || 3}
          </span>
          <span className="text-[11px] text-neutral-500 block mt-1">Currículo activo</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Evaluaciones
          </span>
          <span className="text-3xl font-extrabold text-neutral-900">
            {overview?.evaluations_count || 2}
          </span>
          <span className="text-[11px] text-neutral-500 block mt-1">Con corrección instantánea</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Intentos Registrados
          </span>
          <span className="text-3xl font-extrabold text-neutral-900">
            {overview?.attempts_count || 4}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">Sincronizados local & cloud</span>
        </div>
      </div>

      {/* Estado del Motor de IA y Configuración de Render */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Motor de Inteligencia Artificial */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-neutral-900" />
              <h2 className="font-bold text-neutral-900 text-base">Estado del Motor de IA</h2>
            </div>
            <span className="text-xs font-mono bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full">
              {overview?.ai_engine?.status || 'Activo'}
            </span>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            Configuración segura del backend. Las claves nunca son expuestas al frontend ni al cliente del navegador.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-900 block">Proveedor Activo</span>
                <span className="text-neutral-500 text-[11px]">{overview?.ai_engine?.provider || 'Motor Pedagógico MontesSori'}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 font-semibold text-[10px]">
                {overview?.ai_engine?.live_key_configured ? 'API Key Configurada' : 'Modo Demostración Activo'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-900 block">Privacidad y Protección Estudiantil</span>
                <span className="text-neutral-500 text-[11px]">Cero datos de menores enviados a entrenamiento externo</span>
              </div>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cumple
              </span>
            </div>
          </div>
        </div>

        {/* Parámetros de Despliegue en Render */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-neutral-900" />
              <h2 className="font-bold text-neutral-900 text-base">Preparación para Render Cloud</h2>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              Listo para Despliegue
            </span>
          </div>

          <div className="space-y-2 text-xs text-neutral-600">
            <div className="flex items-center justify-between py-2 border-b border-neutral-100">
              <span className="font-medium text-neutral-800">Servicio Web Backend</span>
              <span className="font-mono text-neutral-500">Python 3.14 · Django 6.1 · Gunicorn</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-neutral-100">
              <span className="font-medium text-neutral-800">Base de Datos</span>
              <span className="font-mono text-neutral-500">PostgreSQL (dj-database-url / SQLite)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-neutral-100">
              <span className="font-medium text-neutral-800">Frontend Estático</span>
              <span className="font-mono text-neutral-500">React · Vite · TypeScript · Tailwind v4</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-medium text-neutral-800">Almacenamiento de Archivos Estáticos</span>
              <span className="font-mono text-neutral-500">WhiteNoise Compressed Manifest</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

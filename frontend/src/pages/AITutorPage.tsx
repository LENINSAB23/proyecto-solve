import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useOffline } from '../context/OfflineContext';
import { api } from '../services/api';
import { AIMessage, TutorMode } from '../types';
import { Sparkles, ArrowUp, Volume2, VolumeX, RefreshCw, BookOpen, Lightbulb, Compass, FileCheck, Layers, AlertCircle } from 'lucide-react';

interface AITutorPageProps {
  initialPrompt?: string;
  initialMode?: TutorMode;
}

export const AITutorPage: React.FC<AITutorPageProps> = ({
  initialPrompt = '',
  initialMode = 'simple',
}) => {
  const { user } = useAuth();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const { isOnline } = useOffline();

  const [mode, setMode] = useState<TutorMode>(initialMode);
  const [inputMessage, setInputMessage] = useState(initialPrompt);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [activeSessionId, setActiveSessionId] = useState<number | undefined>(undefined);
  const [speakingMessageIdx, setSpeakingMessageIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt, initialMode);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const tutorModes = [
    { id: 'simple', label: 'Explicación sencilla', icon: Lightbulb, desc: 'Conceptos claros sin tecnicismos' },
    { id: 'detailed', label: 'Explicación detallada', icon: Layers, desc: 'Profundidad académica y rigor' },
    { id: 'practical', label: 'Ejemplos prácticos', icon: Compass, desc: 'Casos y aplicaciones del mundo real' },
    { id: 'step_by_step', label: 'Resolver paso a paso', icon: BookOpen, desc: 'Desglose guiado de ejercicios' },
    { id: 'practice_quiz', label: 'Crear una práctica', icon: FileCheck, desc: 'Preguntas para autoevaluarte' },
  ];

  const sendMessage = async (textToSend?: string, modeOverride?: TutorMode) => {
    const text = textToSend || inputMessage;
    const currentMode = modeOverride || mode;
    if (!text.trim() || isLoading) return;

    const userMsg: AIMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await api.sendTutorMessage(text, currentMode, '', activeSessionId);
      if (res.session_id) setActiveSessionId(res.session_id);
      setIsDemoMode(Boolean(res.is_demo));
      setProviderInfo(res.provider || 'MontesSori Pedagogical Engine');

      const assistantMsg: AIMessage = {
        role: 'assistant',
        content: res.message.content,
        suggested_followups: res.message.suggested_followups || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_demo_generated: res.is_demo,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Error contacting AI Tutor:', err);
      const errorMsg: AIMessage = {
        role: 'assistant',
        content: !isOnline
          ? '🔌 Te encuentras en **Modo Sin Conexión**. La generación dinámica mediante Gemini requiere conexión a internet. Sin embargo, tus actividades y evaluaciones previamente descargadas continúan disponibles.'
          : 'Hubo una dificultad de conexión con el servicio educativo. Puedes intentar de nuevo en un momento.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string, idx: number) => {
    if (speakingMessageIdx === idx && isSpeaking) {
      stopSpeaking();
      setSpeakingMessageIdx(null);
    } else {
      setSpeakingMessageIdx(idx);
      speakText(text);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-8rem)] flex flex-col justify-between">
      {/* Banner de Estado del Modelo / Modo Demostración */}
      <div className="flex items-center justify-between py-2 px-4 mb-4 bg-white rounded-xl border border-neutral-200 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
          <span className="font-semibold text-neutral-800">Tutor MontesSori</span>
          <span className="text-neutral-300">|</span>
          <span className="text-neutral-500">{providerInfo || 'Motor Pedagógico Activo'}</span>
        </div>

        {isDemoMode && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full border border-neutral-200" title="No se detectó GEMINI_API_KEY en variables de entorno; opera el motor pedagógico local">
            <AlertCircle className="w-3 h-3 text-neutral-500" />
            Modo Demostración Educativo
          </span>
        )}
      </div>

      {/* Selector de Modo Pedagógico */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {tutorModes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id as TutorMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
              title={m.desc}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Área Central: Conversación o Estado Inicial (Inspirado en Imagen de Referencia 4 "NovaMind 2.0") */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-12 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm mb-4">
            M
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Hola, {user?.first_name || 'Estudiante'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-1 mb-2">
            ¿Qué podemos descubrir hoy?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-8">
            Pregúntame sobre cualquier tema difícil. Te guiaré paso a paso sin darte respuestas para copiar.
          </p>

          {/* Sugerencias Rápidas Iniciales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full text-left">
            {[
              { text: '¿Por qué no puedo sumar fracciones con diferente denominador directamente?', mode: 'simple' as TutorMode },
              { text: '¿Cómo funciona la fotosíntesis y por qué es vital para mi comunidad?', mode: 'practical' as TutorMode },
              { text: 'Resuelve conmigo un problema de proporcionalidad inversa paso a paso', mode: 'step_by_step' as TutorMode },
              { text: 'Hazme 3 preguntas rápidas para practicar mi examen de ciencias', mode: 'practice_quiz' as TutorMode },
            ].map((sug, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMode(sug.mode);
                  sendMessage(sug.text, sug.mode);
                }}
                className="p-3 bg-white border border-neutral-200 hover:border-neutral-900 rounded-xl text-xs text-neutral-700 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
              >
                <span className="block font-medium group-hover:text-neutral-900 leading-snug">
                  {sug.text}
                </span>
                <span className="text-[10px] text-neutral-400 mt-1 block capitalize">
                  Modo: {tutorModes.find((t) => t.id === sug.mode)?.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto mb-6 pr-1">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-5 py-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-neutral-900 text-white rounded-br-xs'
                      : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {/* Encabezado del mensaje */}
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-neutral-100/30 text-[11px] opacity-75">
                    <span className="font-semibold">
                      {isUser ? 'Tú' : 'MontesSori Tutor'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>

                      {/* Botón de Voz TTS Nativo de Navegador */}
                      {!isUser && (
                        <button
                          onClick={() => handleSpeak(msg.content, idx)}
                          className="hover:opacity-100 p-0.5 rounded transition-all cursor-pointer text-neutral-500 hover:text-neutral-900"
                          title="Escuchar explicación en voz alta"
                        >
                          {speakingMessageIdx === idx && isSpeaking ? (
                            <VolumeX className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contenido con formateo limpio */}
                  <div className="whitespace-pre-line space-y-2">
                    {msg.content}
                  </div>

                  {/* Chips de Preguntas de Seguimiento Sugeridas */}
                  {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-neutral-100">
                      <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2">
                        Siguientes pasos pedagógicos recomendados:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggested_followups.map((followup, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => sendMessage(followup)}
                            className="text-left text-[11px] bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            {followup}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 p-4 bg-white border border-neutral-200 rounded-2xl w-fit animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-700" />
              <span>MontesSori está formulando una explicación guiada...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Flotante Estilo Minimalista (Inspirado en Referencia 4) */}
      <div className="sticky bottom-4 z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="relative bg-white border border-neutral-300 rounded-2xl shadow-md p-2 flex items-center gap-2 focus-within:border-neutral-900 transition-all"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Pregunta a tu tutor (${tutorModes.find((m) => m.id === mode)?.label})...`}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent border-none focus:outline-hidden text-neutral-900 placeholder:text-neutral-400"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
            title="Enviar consulta"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-[10px] text-neutral-400 mt-2">
          MontesSori fomenta el pensamiento crítico · Complementa a tus profesores sin reemplazarlos
        </p>
      </div>
    </div>
  );
};

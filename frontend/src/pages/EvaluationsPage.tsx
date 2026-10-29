import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Evaluation } from '../types';
import { useOffline } from '../context/OfflineContext';
import { offlineStorage } from '../services/offlineStorage';
import { DrawingWhiteboard } from '../components/DrawingWhiteboard';
import { CheckCircle2, XCircle, ArrowRight, Clock, Lightbulb, Sparkles, HelpCircle, ChevronRight, Check, RefreshCw } from 'lucide-react';

interface EvaluationsPageProps {
  onNavigateToTutor: (topic: string) => void;
}

export const EvaluationsPage: React.FC<EvaluationsPageProps> = ({ onNavigateToTutor }) => {
  const { isOnline } = useOffline();

  // Pestaña principal: 'practice-whiteboard' (Práctica interactiva con pizarra como la imagen) vs 'evaluations-list'
  const [activeTab, setActiveTab] = useState<'practice-whiteboard' | 'evaluations-list'>('practice-whiteboard');

  // Estado del flujo de práctica interactiva con pizarrón (Inspirado en la imagen de referencia)
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  // Lista de ejercicios interactivos con pizarra
  const practiceExercises = [
    {
      id: 1,
      topic: 'Suma distinto denominador',
      grade: '5.º grado · Fracciones',
      formula: '1/4 + 1/8 = ?',
      options: [
        { id: 0, text: '2/12', isCorrect: false, feedback: '¡Cuidado! No se deben sumar numeradores y denominadores directamente (1+1=2, 4+8=12). Primero debes buscar un denominador común.' },
        { id: 1, text: '3/8', isCorrect: true, feedback: '¡Excelente! Convertiste 1/4 a 2/8 multiplicando por 2, y luego sumaste 2/8 + 1/8 = 3/8.' },
        { id: 2, text: '1/8', isCorrect: false, feedback: 'Incorrecto. Al sumar dos cantidades positivas, el resultado debe ser mayor que cada una de las partes.' },
        { id: 3, text: '2/8', isCorrect: false, feedback: 'Incorrecto. 2/8 es equivalente solo a 1/4; aún te falta sumar el 1/8 adicional.' },
      ],
      hint: 'Pista guiada: El 8 es múltiplo de 4. Convierte 1/4 a octavos multiplicando numerador y denominador por 2 (1/4 = 2/8). Ahora suma los numeradores: 2/8 + 1/8.',
    },
    {
      id: 2,
      topic: 'Resta distinto denominador',
      grade: '5.º grado · Fracciones',
      formula: '2/3 - 1/6 = ?',
      options: [
        { id: 0, text: '1/3', isCorrect: false, feedback: 'Casi, pero falta simplificar o verificar la escala a sextos (4/6 - 1/6 = 3/6 = 1/2).' },
        { id: 1, text: '3/6 (1/2)', isCorrect: true, feedback: '¡Correcto! 2/3 equivale a 4/6. Al restar 4/6 - 1/6 obtienes 3/6, que simplificado es 1/2.' },
        { id: 2, text: '1/6', isCorrect: false, feedback: 'Incorrecto. 4/6 menos 1/6 resulta en 3/6.' },
        { id: 3, text: '2/9', isCorrect: false, feedback: 'Incorrecto. No se deben restar los denominadores (6 - 3 ≠ 9).' },
      ],
      hint: 'Pista guiada: El mínimo común múltiplo entre 3 y 6 es 6. Multiplica 2/3 por 2 para obtener 4/6. Ahora calcula 4/6 - 1/6.',
    },
    {
      id: 3,
      topic: 'Fracción de una cantidad',
      grade: '5.º grado · Fracciones',
      formula: '3/5 de 40 = ?',
      options: [
        { id: 0, text: '15', isCorrect: false, feedback: 'Incorrecto. Divide 40 entre 5 (da 8) y luego multiplica por 3.' },
        { id: 1, text: '24', isCorrect: true, feedback: '¡Magnífico! 40 dividido entre 5 es 8; y 8 multiplicado por 3 es exactamente 24.' },
        { id: 2, text: '20', isCorrect: false, feedback: 'Incorrecto. 20 es la mitad (1/2 de 40).' },
        { id: 3, text: '30', isCorrect: false, feedback: 'Incorrecto. 30 equivaldría a 3/4 de 40.' },
      ],
      hint: 'Pista guiada: Primero halla 1/5 dividiendo 40 entre 5 (40 ÷ 5 = 8). Como te piden 3 partes, multiplica ese resultado por 3 (8 × 3).',
    },
    {
      id: 4,
      topic: 'Suma de fracciones con enteros',
      grade: '5.º grado · Fracciones',
      formula: '1/2 + 2/4 = ?',
      options: [
        { id: 0, text: '3/6', isCorrect: false, feedback: 'Error común: sumaste 1+2 y 2+4. Recuerda que 2/4 es la mitad (1/2).' },
        { id: 1, text: '1 (Entero)', isCorrect: true, feedback: '¡Brillante! 1/2 + 2/4 = 1/2 + 1/2 = 2/2 = 1 entero completo.' },
        { id: 2, text: '3/4', isCorrect: false, feedback: 'Incorrecto. Faltó considerar que 2/4 es equivalente a 2 cuartos completos.' },
        { id: 3, text: '1/4', isCorrect: false, feedback: 'Incorrecto. El resultado no puede ser menor que las partes sumadas.' },
      ],
      hint: 'Pista guiada: Observa que 2/4 se puede simplificar dividiendo entre 2: 2/4 = 1/2. Así tienes 1/2 + 1/2. ¿Cuánto da dos mitades juntas?',
    },
    {
      id: 5,
      topic: 'Resta de fracciones equivalentes',
      grade: '5.º grado · Fracciones',
      formula: '3/4 - 2/8 = ?',
      options: [
        { id: 0, text: '1/2 (2/4)', isCorrect: true, feedback: '¡Excelente deducción! 2/8 se simplifica a 1/4. Entonces 3/4 - 1/4 = 2/4, que simplificado es 1/2.' },
        { id: 1, text: '1/4', isCorrect: false, feedback: 'Incorrecto. 3/4 menos 1/4 resulta en 2/4.' },
        { id: 2, text: '5/8', isCorrect: false, feedback: 'Incorrecto. Para restar debes unificar denominadores: 6/8 - 2/8 = 4/8 = 1/2.' },
        { id: 3, text: '1/8', isCorrect: false, feedback: 'Incorrecto. La diferencia entre 6/8 y 2/8 es 4/8.' },
      ],
      hint: 'Pista guiada: Convierte 3/4 a octavos multiplicando por 2 (3/4 = 6/8). Ahora resta los numeradores: 6/8 - 2/8 = 4/8. ¿A qué fracción irreducible equivale 4/8?',
    },
  ];

  const currentExercise = practiceExercises[currentExerciseIdx];

  // Estado para Evaluaciones Estándar de la Base de Datos
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [activeEval, setActiveEval] = useState<Evaluation | null>(null);
  const [answers, setAnswers] = useState<Record<number, { selectedIndex?: number; textResponse?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      const data = await api.getEvaluations();
      setEvaluations(data);
    } catch (e) {
      console.error('Error loading evaluations:', e);
      const cached = offlineStorage.getCachedEvaluations();
      if (cached.length) setEvaluations(cached);
    }
  };

  const handleSelectPracticeOption = (optionId: number) => {
    if (practiceSubmitted) return;
    setSelectedPracticeOption(optionId);
    setPracticeSubmitted(true);
    if (currentExercise.options[optionId].isCorrect) {
      setPracticeScore((prev) => prev + 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIdx < practiceExercises.length - 1) {
      setCurrentExerciseIdx((prev) => prev + 1);
      setSelectedPracticeOption(null);
      setPracticeSubmitted(false);
      setShowHint(false);
    } else {
      // Final de la práctica
      alert(`¡Felicitaciones! Has completado los 5 ejercicios de práctica. Aciertos: ${practiceScore + (selectedPracticeOption !== null && currentExercise.options[selectedPracticeOption].isCorrect ? 1 : 0)} de 5.`);
      setCurrentExerciseIdx(0);
      setSelectedPracticeOption(null);
      setPracticeSubmitted(false);
      setShowHint(false);
      setPracticeScore(0);
    }
  };

  // Manejo de Evaluaciones estándar
  const startEvaluation = async (evaluationId: number) => {
    try {
      const detail = await api.getEvaluationDetail(evaluationId);
      setActiveEval(detail);
      setAnswers({});
      setResult(null);
    } catch (e) {
      console.error('Error starting evaluation:', e);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!activeEval) return;
    setIsSubmitting(true);

    const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
      question_id: Number(qId),
      selected_option_index: ans.selectedIndex,
      text_response: ans.textResponse || '',
    }));

    if (!isOnline) {
      offlineStorage.savePendingAttempt({
        evaluation_id: activeEval.id,
        answers: formattedAnswers,
        title: activeEval.title,
      });

      let calculatedScore = 0;
      activeEval.questions?.forEach((q) => {
        const userAns = answers[q.id];
        if (q.question_type === 'multiple_choice' && userAns?.selectedIndex !== undefined) {
          if (q.options[userAns.selectedIndex]?.is_correct) {
            calculatedScore += q.points;
          }
        } else if (userAns?.textResponse && userAns.textResponse.trim().length > 10) {
          calculatedScore += q.points;
        }
      });

      setResult({
        score: calculatedScore,
        max_score: activeEval.total_points,
        passed: calculatedScore >= activeEval.passing_score,
        is_offline_saved: true,
        feedback: 'Evaluación completada sin conexión. Respuestas guardadas en tu dispositivo.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.submitEvaluation(activeEval.id, formattedAnswers, false);
      setResult(res);
    } catch (err) {
      console.error('Error submitting evaluation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Selector Superior de Modo (Inspirado en la cabecera de la imagen de referencia) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Práctica Activa y Evaluaciones
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Desarrolla tus ejercicios en el pizarrón interactivo usando ratón o pantalla táctil.
          </p>
        </div>

        {/* Pestañas: Mi Ruta de Práctica con Pizarrón vs Evaluaciones del Curso */}
        <div className="flex bg-neutral-200/80 p-1 rounded-full border border-neutral-300">
          <button
            onClick={() => {
              setActiveTab('practice-whiteboard');
              setActiveEval(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'practice-whiteboard'
                ? 'bg-[#0f4c3a] text-white shadow-xs'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            Mi ruta de práctica (Pizarrón)
          </button>
          <button
            onClick={() => {
              setActiveTab('evaluations-list');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'evaluations-list'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            Evaluaciones del Curso
          </button>
        </div>
      </div>

      {/* ========================================================
          MODO 1: PRÁCTICA CON PIZARRÓN (COMO LA IMAGEN DE REFERENCIA)
          ======================================================== */}
      {activeTab === 'practice-whiteboard' && (
        <div className="space-y-6 animate-fade-in">
          {/* Tarjeta de Ejercicio (Estilo exacto de la imagen de referencia) */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
            {/* Cabecera del Ejercicio */}
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span className="font-semibold text-neutral-700">
                Ejercicio {currentExerciseIdx + 1} de {practiceExercises.length} · {currentExercise.topic}
              </span>
              <span className="font-mono text-neutral-400">
                Aciertos: {practiceScore}
              </span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-[#E5DFD7] h-2 rounded-full overflow-hidden mb-8">
              <div
                className="bg-[#0f4c3a] h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentExerciseIdx + 1) / practiceExercises.length) * 100}%` }}
              />
            </div>

            {/* Fórmula Central Destacada */}
            <div className="py-6 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-mono">
                {currentExercise.formula}
              </span>
            </div>

            {/* Opciones en Cuadrícula 2x2 (Exacto a la imagen) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto my-6">
              {currentExercise.options.map((opt, idx) => {
                const isSelected = selectedPracticeOption === idx;
                let btnStyle = 'bg-white border-neutral-300 text-neutral-800 hover:border-neutral-900';

                if (practiceSubmitted) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                  } else {
                    btnStyle = 'bg-neutral-50 border-neutral-200 text-neutral-400 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-neutral-900 border-neutral-900 text-white font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={practiceSubmitted}
                    onClick={() => handleSelectPracticeOption(idx)}
                    className={`p-4 rounded-xl border text-base font-bold transition-all text-center cursor-pointer shadow-2xs ${btnStyle}`}
                  >
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Retroalimentación inmediata tras responder */}
            {practiceSubmitted && selectedPracticeOption !== null && (
              <div className={`p-4 rounded-xl border my-4 text-xs max-w-xl mx-auto ${
                currentExercise.options[selectedPracticeOption].isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {currentExercise.options[selectedPracticeOption].isCorrect ? (
                    <><Check className="w-4 h-4 text-emerald-600" /> ¡Respuesta Correcta!</>
                  ) : (
                    <><XCircle className="w-4 h-4 text-amber-600" /> Revisión Pedagógica:</>
                  )}
                </div>
                <p className="leading-relaxed">
                  {currentExercise.options[selectedPracticeOption].feedback}
                </p>
              </div>
            )}

            {/* Botón "Necesito una pista" y Acción Siguiente */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-100 max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border-2 border-[#0f4c3a] text-[#0f4c3a] hover:bg-[#0f4c3a]/5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Ocultar pista' : 'Necesito una pista'}</span>
              </button>

              {practiceSubmitted && (
                <button
                  type="button"
                  onClick={handleNextExercise}
                  className="w-full sm:w-auto px-6 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{currentExerciseIdx < practiceExercises.length - 1 ? 'Siguiente Ejercicio' : 'Finalizar Práctica'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Pista Socrática Desplegada */}
            {showHint && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 max-w-xl mx-auto leading-relaxed flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Pista del Tutor Socrático:</span>
                  <span>{currentExercise.hint}</span>
                </div>
              </div>
            )}

            {/* Nota de pie exacta de la imagen */}
            <p className="text-center text-[11px] text-neutral-400 mt-6 select-none">
              Prototipo con datos de ejemplo ({currentExercise.grade}). La IA sugiere; el docente decide. Los datos de los alumnos son ficticios.
            </p>
          </div>

          {/* ========================================================
              PIZARRÓN ABAJO PARA DESARROLLAR (TÁCTIL O RATÓN)
              ======================================================== */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span>🎨 Pizarrón de Desarrollo de Ejercicios</span>
                  <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-semibold">
                    Táctil & Ratón
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Haz tus cálculos, desglosa las fracciones y comprueba tu procedimiento antes de marcar tu opción definitiva.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToTutor(`Tengo dudas con el ejercicio: ${currentExercise.formula}`)}
                className="text-xs text-neutral-700 hover:text-neutral-900 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-center"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consultar al Tutor IA</span>
              </button>
            </div>

            {/* Componente Canvas Pizarrón */}
            <DrawingWhiteboard
              initialHeight={260}
              questionLabel={`Desarrollo de: ${currentExercise.formula}`}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          MODO 2: EVALUACIONES GENERALES DEL CURSO
          ======================================================== */}
      {activeTab === 'evaluations-list' && (
        <div className="space-y-6 animate-fade-in">
          {/* Si hay una evaluación abierta para responder */}
          {activeEval && !result && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                <div>
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Evaluación en Progreso
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900 mt-0.5">{activeEval.title}</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeEval.duration_minutes} min sugeridos</span>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {activeEval.questions?.map((q, qIndex) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-neutral-900 text-sm">
                        {qIndex + 1}. {q.text}
                      </h3>
                      <span className="text-[11px] font-semibold text-neutral-400 shrink-0">
                        {q.points} pts
                      </span>
                    </div>

                    {q.question_type === 'multiple_choice' ? (
                      <div className="space-y-2 mt-3">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = answers[q.id]?.selectedIndex === oIndex;
                          return (
                            <button
                              key={oIndex}
                              type="button"
                              onClick={() => {
                                setAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: { ...prev[q.id], selectedIndex: oIndex },
                                }));
                              }}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                                  : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
                              }`}
                            >
                              <span>{opt.text}</span>
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                  isSelected ? 'border-white text-white font-bold' : 'border-neutral-300 text-neutral-400'
                                }`}
                              >
                                {String.fromCharCode(65 + oIndex)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <textarea
                          rows={3}
                          value={answers[q.id]?.textResponse || ''}
                          onChange={(e) => {
                            const text = e.target.value;
                            setAnswers((prev) => ({
                              ...prev,
                              [q.id]: { ...prev[q.id], textResponse: text },
                            }));
                          }}
                          placeholder="Escribe tu razonamiento o explicación con tus propias palabras..."
                          className="w-full text-xs p-3 bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                        />
                      </div>
                    )}

                    {/* Pizarrón opcional para operaciones en cada pregunta */}
                    <div className="mt-4 pt-3 border-t border-neutral-200">
                      <DrawingWhiteboard
                        initialHeight={180}
                        questionLabel={`Cálculos para la Pregunta ${qIndex + 1}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setActiveEval(null)}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSubmitEvaluation}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? 'Calificando...' : 'Finalizar Evaluación'}
                </button>
              </div>
            </div>
          )}

          {/* Resultado de la Evaluación */}
          {result && activeEval && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Resultado de Evaluación
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900 mt-1">{activeEval.title}</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">Tema: {activeEval.topic}</p>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-extrabold text-neutral-900 block leading-none">
                    {result.score}/{result.max_score}
                  </span>
                  <span className={`text-[11px] font-bold ${result.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {result.passed ? '✓ Nivel Alcanzado' : '⚠️ Requiere Refuerzo'}
                  </span>
                </div>
              </div>

              <div className="py-6">
                <p className="text-sm text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-200 leading-relaxed">
                  {result.feedback}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveEval(null);
                  setResult(null);
                }}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                ← Volver al listado
              </button>
            </div>
          )}

          {/* Catálogo de Evaluaciones */}
          {!activeEval && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluations.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-900 transition-all shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2">
                      <span>{ev.topic}</span>
                      <span className="font-mono">{ev.duration_minutes} min</span>
                    </div>

                    <h3 className="font-bold text-base text-neutral-900 leading-snug mb-2">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {ev.description || 'Evaluación diagnóstica con corrección y explicaciones guiadas.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 font-semibold">
                      {ev.questions_count || 4} preguntas
                    </span>
                    <button
                      type="button"
                      onClick={() => startEvaluation(ev.id)}
                      className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>Comenzar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { VolumeX, Eye } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const { textScale, setTextScale, highContrast, toggleHighContrast, isSpeaking, stopSpeaking } = useAccessibility();

  return (
    <div className="flex items-center gap-2 border-l border-neutral-200 pl-3 text-xs">
      {/* Indicador de Lectura de Voz (TTS) */}
      {isSpeaking && (
        <button
          onClick={stopSpeaking}
          className="flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-1 rounded-md transition-all cursor-pointer font-medium animate-pulse"
          title="Detener lectura en voz alta"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Detener voz</span>
        </button>
      )}

      {/* Ajuste de Tamaño de Fuente */}
      <div className="flex items-center bg-neutral-100 rounded-md p-0.5 border border-neutral-200">
        <button
          onClick={() => setTextScale('normal')}
          className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-all ${
            textScale === 'normal' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
          }`}
          title="Tamaño de letra estándar"
        >
          A
        </button>
        <button
          onClick={() => setTextScale('large')}
          className={`px-1.5 py-0.5 rounded text-[12px] font-semibold transition-all ${
            textScale === 'large' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
          }`}
          title="Tamaño de letra grande"
        >
          A+
        </button>
        <button
          onClick={() => setTextScale('xlarge')}
          className={`px-1.5 py-0.5 rounded text-[13px] font-bold transition-all ${
            textScale === 'xlarge' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
          }`}
          title="Tamaño de letra muy grande (Máxima legibilidad)"
        >
          A++
        </button>
      </div>

      {/* Alto Contraste */}
      <button
        onClick={toggleHighContrast}
        className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium transition-all cursor-pointer ${
          highContrast
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
        }`}
        title="Activar / Desactivar modo de alto contraste para baja visión"
      >
        <Eye className="w-3 h-3" />
        <span>{highContrast ? 'Contraste Activo' : 'Alto Contraste'}</span>
      </button>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

type TextScale = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textScale, setTextScaleState] = useState<TextScale>(() => {
    return (localStorage.getItem('montessori_text_scale') as TextScale) || 'normal';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('montessori_high_contrast') === 'true';
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    root.classList.add(`text-scale-${textScale}`);
    localStorage.setItem('montessori_text_scale', textScale);
  }, [textScale]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('montessori_high_contrast', String(highContrast));
  }, [highContrast]);

  const setTextScale = (scale: TextScale) => {
    setTextScaleState(scale);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz nativa.');
      return;
    }
    window.speechSynthesis.cancel();
    if (!text || text.trim() === '') return;

    // Quitar sintaxis markdown para que la lectura sea fluida
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95; // Ritmo amigable para estudiantes

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textScale,
        setTextScale,
        highContrast,
        toggleHighContrast,
        speakText,
        stopSpeaking,
        isSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};

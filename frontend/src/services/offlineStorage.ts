/**
 * Servicio de almacenamiento sin conexión (Offline-First) para MontesSori.
 * Especialmente diseñado para estudiantes en zonas rurales o con conectividad intermitente
 * que participan en el desafío MIT Solve 2027.
 */

const PENDING_ATTEMPTS_KEY = 'montessori_pending_attempts';
const CACHED_COURSES_KEY = 'montessori_cached_courses';
const CACHED_EVALUATIONS_KEY = 'montessori_cached_evaluations';

export const offlineStorage = {
  // Guardar intento de evaluación realizado sin conexión
  savePendingAttempt: (attemptData: any) => {
    try {
      const existing = offlineStorage.getPendingAttempts();
      existing.push({
        ...attemptData,
        saved_locally_at: new Date().toISOString(),
      });
      localStorage.setItem(PENDING_ATTEMPTS_KEY, JSON.stringify(existing));
      return true;
    } catch (e) {
      console.error('Error saving pending attempt:', e);
      return false;
    }
  },

  getPendingAttempts: (): any[] => {
    try {
      const raw = localStorage.getItem(PENDING_ATTEMPTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  clearPendingAttempts: () => {
    localStorage.removeItem(PENDING_ATTEMPTS_KEY);
  },

  // Cachear cursos y actividades para consulta offline
  cacheCourses: (courses: any[]) => {
    try {
      localStorage.setItem(CACHED_COURSES_KEY, JSON.stringify(courses));
    } catch (e) {
      console.warn('Could not cache courses offline', e);
    }
  },

  getCachedCourses: (): any[] => {
    try {
      const raw = localStorage.getItem(CACHED_COURSES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // Cachear evaluaciones
  cacheEvaluations: (evaluations: any[]) => {
    try {
      localStorage.setItem(CACHED_EVALUATIONS_KEY, JSON.stringify(evaluations));
    } catch (e) {
      console.warn('Could not cache evaluations', e);
    }
  },

  getCachedEvaluations: (): any[] => {
    try {
      const raw = localStorage.getItem(CACHED_EVALUATIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
};

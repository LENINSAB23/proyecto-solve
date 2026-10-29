import { offlineStorage } from './offlineStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  getToken: () => localStorage.getItem('montessori_token'),
  setToken: (token: string) => localStorage.setItem('montessori_token', token),
  clearToken: () => localStorage.removeItem('montessori_token'),

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = api.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Error HTTP ${response.status}` };
        }
        throw new Error(errorData.error || errorData.detail || `Error en la solicitud: ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error: any) {
      // Si estamos sin conexión o falló la red, intentar responder desde caché si aplica
      if (!navigator.onLine) {
        if (endpoint.includes('/courses/')) {
          const cached = offlineStorage.getCachedCourses();
          if (cached.length) return cached as unknown as T;
        }
        if (endpoint.includes('/evaluations/')) {
          const cached = offlineStorage.getCachedEvaluations();
          if (cached.length) return cached as unknown as T;
        }
      }
      throw error;
    }
  },

  // Auth
  login: (data: any) => api.request<any>('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => api.request<any>('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  quickDemoLogin: (role: string) => api.request<any>('/auth/quick-demo/', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => api.request<any>('/auth/me/'),
  updateMe: (data: any) => api.request<any>('/auth/me/', { method: 'PUT', body: JSON.stringify(data) }),

  // Courses & Activities
  getCourses: async (subjectId?: number) => {
    const url = subjectId ? `/courses/?subject=${subjectId}` : '/courses/';
    const data = await api.request<any[]>(url);
    offlineStorage.cacheCourses(data);
    return data;
  },
  getCourseDetail: (id: number) => api.request<any>(`/courses/${id}/`),
  enrollCourse: (id: number) => api.request<any>(`/courses/${id}/enroll/`, { method: 'POST' }),
  getActivityDetail: (id: number) => api.request<any>(`/activities/${id}/`),
  completeActivity: (id: number, timeSpent?: number) =>
    api.request<any>(`/activities/${id}/complete/`, { method: 'POST', body: JSON.stringify({ time_spent_minutes: timeSpent }) }),

  // Evaluations
  getEvaluations: async (courseId?: number) => {
    const url = courseId ? `/evaluations/?course=${courseId}` : '/evaluations/';
    const data = await api.request<any[]>(url);
    offlineStorage.cacheEvaluations(data);
    return data;
  },
  getEvaluationDetail: (id: number) => api.request<any>(`/evaluations/${id}/`),
  submitEvaluation: (id: number, answers: any[], isOffline: boolean = false) =>
    api.request<any>(`/evaluations/${id}/submit/`, {
      method: 'POST',
      body: JSON.stringify({ answers, is_offline_synced: isOffline }),
    }),

  // Student Hub
  getStudentDashboard: () => api.request<any>('/student/dashboard/'),
  getStudentMastery: () => api.request<any>('/student/mastery/'),

  // AI Tutor
  sendTutorMessage: (message: string, mode: string, topic?: string, sessionId?: number) =>
    api.request<any>('/tutor/chat/', {
      method: 'POST',
      body: JSON.stringify({ message, mode, topic, session_id: sessionId }),
    }),
  getTutorSessions: () => api.request<any[]>('/tutor/chat/'),
  getTutorSessionDetail: (id: number) => api.request<any>(`/tutor/sessions/${id}/`),

  // Teacher Hub
  getTeacherDashboard: () => api.request<any>('/teacher/dashboard/'),
  teacherAiGenerate: (data: any) => api.request<any>('/teacher/ai-generate/', { method: 'POST', body: JSON.stringify(data) }),
  createCourse: (data: any) => api.request<any>('/courses/', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  getAdminOverview: () => api.request<any>('/admin-overview/'),
};

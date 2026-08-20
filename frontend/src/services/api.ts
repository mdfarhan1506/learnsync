import axios from 'axios';

// Normalize API URL from environment variable or fallback to '/api'
const getBaseURL = () => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (!envUrl) return '/api';
  const cleanUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ls_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ls_token');
      localStorage.removeItem('ls_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

// Classes
export const classAPI = {
  list: () => api.get('/classes'),
  get: (id: string) => api.get(`/classes/${id}`),
  create: (data: any) => api.post('/classes', data),
  update: (id: string, data: any) => api.put(`/classes/${id}`, data),
  getTopics: (id: string) => api.get(`/classes/${id}/topics`),
};

// Students
export const studentAPI = {
  list: (classId?: string) => api.get('/students', { params: classId ? { classId } : {} }),
  get: (id: string) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  addObservation: (id: string, data: any) => api.post(`/students/${id}/observations`, data),
  importCSV: (csv: string, classId: string) => api.post('/students/import-csv', { csv, classId }),
};

// Assessments
export const assessmentAPI = {
  list: (classId?: string) => api.get('/assessments', { params: classId ? { classId } : {} }),
  get: (id: string) => api.get(`/assessments/${id}`),
  create: (data: any) => api.post('/assessments', data),
  update: (id: string, data: any) => api.put(`/assessments/${id}`, data),
  generateQuestions: (id: string, data: any) => api.post(`/assessments/${id}/generate-questions`, data),
  approveQuestion: (assessmentId: string, qid: string) => api.post(`/assessments/${assessmentId}/questions/${qid}/approve`),
  publish: (id: string) => api.post(`/assessments/${id}/publish`),
  submitResults: (id: string, data: any) => api.post(`/assessments/${id}/submit-results`, data),
  getAnalysis: (id: string) => api.get(`/assessments/${id}/analysis`),
};

// Groups
export const groupAPI = {
  list: (classId?: string) => api.get('/groups', { params: classId ? { classId } : {} }),
  listForClass: (classId: string) => api.get(`/groups/class/${classId}`),
  get: (id: string) => api.get(`/groups/${id}`),
  generateIntervention: (id: string, data?: any) => api.post(`/groups/${id}/generate-intervention`, data || {}),
  startIntervention: (groupId: string, interventionId: string) => api.post(`/groups/${groupId}/interventions/${interventionId}/start`),
  completeIntervention: (groupId: string, interventionId: string) => api.post(`/groups/${groupId}/interventions/${interventionId}/complete`),
  override: (id: string, data: any) => api.post(`/groups/${id}/override`, data),
  recalculate: (classId: string) => api.post(`/groups/class/${classId}/recalculate`),
};

// Progress
export const progressAPI = {
  forClass: (classId: string) => api.get(`/progress/class/${classId}`),
  forStudent: (studentId: string) => api.get(`/progress/student/${studentId}`),
};

// Quick Checks
export const quickCheckAPI = {
  submit: (data: any) => api.post('/quick-checks', data),
  get: (id: string) => api.get(`/quick-checks/${id}`),
};

// Rules
export const rulesAPI = {
  get: (classId: string) => api.get(`/rules/${classId}`),
  update: (classId: string, data: any) => api.put(`/rules/${classId}`, data),
  reset: (classId: string) => api.post(`/rules/${classId}/reset`),
};

// Demo
export const demoAPI = {
  reset: () => api.post('/demo/reset'),
  status: () => api.get('/demo/status'),
};

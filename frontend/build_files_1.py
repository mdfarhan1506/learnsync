import os
import json

base_dir = '/Users/mdfarhan/Documents/learnsync/frontend'

files = {
    'tailwind.config.js': '''/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        mastered: '#16a34a',
        developing: '#d97706',
        needs_support: '#dc2626',
        advanced: '#7c3aed',
      }
    },
  },
  plugins: [],
}''',
    'src/index.css': '''@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }
body { font-family: 'Inter', system-ui, sans-serif; background: #f8fafc; }

.status-mastered { @apply bg-green-100 text-green-800 border border-green-200; }
.status-developing { @apply bg-yellow-100 text-yellow-800 border border-yellow-200; }
.status-needs_support { @apply bg-red-100 text-red-800 border border-red-200; }
.status-advanced { @apply bg-purple-100 text-purple-800 border border-purple-200; }
.status-unknown { @apply bg-gray-100 text-gray-600 border border-gray-200; }''',
    'vite.config.ts': '''import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})''',
    'src/services/api.ts': '''import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;''',
    'src/stores/authStore.ts': '''import { create } from 'zustand';

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('ls_token'),
  isAuthenticated: !!localStorage.getItem('ls_token'),
  login: (token, user) => {
    localStorage.setItem('ls_token', token);
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('ls_token');
    set({ token: null, user: null, isAuthenticated: false });
  }
}));''',
    'src/stores/classStore.ts': '''import { create } from 'zustand';

interface ClassState {
  currentClass: any;
  classes: any[];
  selectClass: (c: any) => void;
  setClasses: (c: any[]) => void;
}

export const useClassStore = create<ClassState>((set) => ({
  currentClass: null,
  classes: [],
  selectClass: (currentClass) => set({ currentClass }),
  setClasses: (classes) => set({ classes }),
}));''',
    'src/stores/demoStore.ts': '''import { create } from 'zustand';

interface DemoState {
  isDemoMode: boolean;
  isResetting: boolean;
  setDemoMode: (val: boolean) => void;
  setResetting: (val: boolean) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemoMode: true,
  isResetting: false,
  setDemoMode: (isDemoMode) => set({ isDemoMode }),
  setResetting: (isResetting) => set({ isResetting }),
}));'''
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)

print("Batch 1 written.")

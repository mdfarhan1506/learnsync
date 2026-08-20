/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-50', 'bg-blue-100', 'bg-blue-500', 'bg-blue-600', 'text-blue-600', 'text-blue-700',
    'bg-red-50', 'bg-red-100', 'bg-red-500', 'text-red-600',
    'bg-green-50', 'bg-green-100', 'bg-green-500', 'text-green-600',
    'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-400', 'text-yellow-600',
    'bg-purple-50', 'bg-purple-100', 'text-purple-600',
  ],
}

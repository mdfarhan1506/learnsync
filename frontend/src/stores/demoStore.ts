import { create } from 'zustand';

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
}));
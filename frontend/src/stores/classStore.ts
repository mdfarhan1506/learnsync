import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  subject: string;
  section: string;
}

interface ClassState {
  currentClass: ClassInfo | null;
  setCurrentClass: (cls: ClassInfo | null) => void;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set) => ({
      currentClass: null,
      setCurrentClass: (cls) => set({ currentClass: cls }),
    }),
    { name: 'learnsync-class' }
  )
);

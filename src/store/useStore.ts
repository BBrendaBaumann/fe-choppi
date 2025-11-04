import { create } from 'zustand';
import type { UserStore } from './interfaces/store.interface';

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

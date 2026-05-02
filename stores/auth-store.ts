import { create } from 'zustand';
import type { UserProfile } from '@/services/auth.service';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthLoading: boolean;
  isAuthInitialized: boolean;

  setAuth: (data: { accessToken: string | null; refreshToken: string | null; user: UserProfile | null }) => void;

  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  setAuthLoading: (isAuthLoading: boolean) => void;
  setAuthInitialized: (isAuthInitialized: boolean) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  isAuthLoading: false,

  isAuthInitialized: false,

  setAuth: ({ accessToken, refreshToken, user }) =>
    set({
      accessToken,
      refreshToken,
      user,
      isAuthInitialized: true
    }),

  setAccessToken: (accessToken) => set({ accessToken }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  setUser: (user) => set({ user }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
  setAuthInitialized: (isAuthInitialized) => set({ isAuthInitialized }),

  resetAuth: () =>
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthLoading: false,
      isAuthInitialized: true
    })
}));

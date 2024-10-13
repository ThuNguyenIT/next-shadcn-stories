import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { deleteCookie } from 'cookies-next';


export type AuthState = {
    user: User | null;

};
export type AuthActions = {
    setUser: (user: User) => void;
    logout: () => void;
};
export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: User) => {
                set({ user });
            },
            logout: () => {
                deleteCookie('jwtToken')
                set({ user: null });
            }
        }),
        { name: 'auth-store' }
    )
);
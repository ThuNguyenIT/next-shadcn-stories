import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';


export type State = {
    user: User | null;

};
export type Actions = {
};
export const useAuthStore = create<State & Actions>()(
    persist(
        (set) => ({
            user: null,
        }),
        { name: 'auth-store', skipHydration: true, }
    )
);
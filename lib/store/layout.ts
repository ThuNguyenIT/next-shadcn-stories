import { create } from 'zustand';
import { persist } from 'zustand/middleware';



export type LayoutState = {
    fontSize: number;
    textColor: string;
    fontFamily: string;
};
export type LayoutActions = {
    setFontSize: (font: number) => void;
    setTextColor: (color: string) => void;
    setFontFamily: (font: string) => void;
};
export const useLayoutStore = create<LayoutState & LayoutActions>()(
    persist(
        (set) => ({
            fontSize: 20,
            textColor: 'black',
            fontFamily: 'Roboto',
            setFontSize: (font: number) => {
                set({ fontSize: font });
            },
            setTextColor: (color: string) => {
                set({ textColor: color });
            },
            setFontFamily: (font: string) => {
                set({ fontFamily: font });
            },
        }),
        { name: 'layout-store' }
    )
);
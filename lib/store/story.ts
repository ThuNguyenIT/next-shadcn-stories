import { Story } from "@/types";
import { create } from "zustand";

export type StoryState = {
  storiesByCategory: Story[];
};
export type StoryActions = {
  setStoryByCategory: (stories: Story[]) => void;
};
export const useStoryStore = create<StoryState & StoryActions>()(
  (set, get) => ({
    storiesByCategory: [],
    setStoryByCategory: (stories: Story[]) => {
      set({ storiesByCategory: stories });
    },
  })
);

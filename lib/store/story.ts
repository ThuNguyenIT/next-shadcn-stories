import { Chapter, IIdChapter, Story } from "@/types";
import { create } from "zustand";

export type StoryState = {
  listStoryByCategory: Story[];
  storyDetail: Story | null;
  chapter: Chapter | null;
  listChapter: IIdChapter[];
};
export type StoryActions = {
  setStoryByCategory: (stories: Story[]) => void;
  setStoryDetail: (stories: Story) => void;
  setChapter: (chapter: Chapter) => void;
  setListChapter: (id: IIdChapter[]) => void;
};
export const useStoryStore = create<StoryState & StoryActions>()(
  (set, get) => ({
    listStoryByCategory: [],
    storyDetail: null,
    chapter: null,
    listChapter: [],
    setStoryByCategory: (stories: Story[]) => {
      set({ listStoryByCategory: stories });
    },
    setStoryDetail: (story: Story) => {
      set({ storyDetail: story });
    },
    setChapter: (data: Chapter) => {
      set({ chapter: data });
    },
    setListChapter: (data: IIdChapter[]) => {
      set({ listChapter: data });
    },
  })
);

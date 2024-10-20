import { Author } from "./author";
import { User } from "./user";

export interface Story {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  avatar_image?: string;
  cover_image?: string;
  author_id: number;
  view_count: number;
  status?: string;
  chapter?: number;
  chapters?: Chapter[];
  total_chapter?: number;
  updated_at?: string | Date;
  author?: Author;
  category_name?: string[];
  isFavorite?: boolean;
}

export interface Chapter {
  id: number;
  story_id: number;
  title: string;
  content: string;
  chapter_number: string;
  created_at: string;
  updated_at: string;
}

export interface IComment {
  id: number;
  story_id: number | null;
  chapter_id: number | null;
  user_id: number | null;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
  updated_at: string;
  user: User;
  replies: IComment[];
  parentAuthor?: string
}

export interface StoryData {
  story: Story;
  chapters: Chapter[];
  hasMoreChapters: boolean;
  totalChapters: number;
  currentPage: number;
  totalPages: number;
  latestChapter: Chapter;
}

export interface GetStoryBySlugResponse<T> {
  message: string;
  data: T;
}
export interface GetLatestChapterResponse<T> {
  message: string;
  data: T;
}
export interface IIdChapter {
  id: number;
  chapter_number: number;
}
export interface DataLatestChapterResponse {
  story: Story;
  latestChapter: Chapter;
  chapterIds: IIdChapter[];
}

export interface PostFavoritesResponse {
  message: string;
  data: null;
}


export interface CommentResponse {
  message: string;
  data: {
    comments: IComment[];
    currentPage: number;
    totalPages: number;
  };
}
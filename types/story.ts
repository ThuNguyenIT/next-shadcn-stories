import { Author } from "./author";

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
  total_chapter?: number;
  updated_at?: string | Date;
  author?: Author;
}

export interface Chapter {
  title: string;
  date: string;
}

export interface IComment {
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  avatarSrc: string;
  replies?: IComment[];
  parentAuthor?: string;
}


export interface GetStoryBySlugResponse<T> {
  message: string;
  data: T;
}

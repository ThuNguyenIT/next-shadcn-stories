export interface Story {
  id: string;
  title: string;
  author: string;
  chapter: number;
  updatedAt: string;
  coverImage: string;
  description?: string;
  slug?: string;
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
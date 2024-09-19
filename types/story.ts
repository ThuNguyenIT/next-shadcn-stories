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
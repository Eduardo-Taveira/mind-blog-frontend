export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  category?: string;
  tags?: string[];
  banner_image?: string | null;
  author_id: number;
  author_name: string;
  views?: number;
  likes?: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  article_id: number;
  author_id: number;
  author_name: string;
  author_avatar?: string;
  content: string;
  likes: number;
  created_at: string;
}
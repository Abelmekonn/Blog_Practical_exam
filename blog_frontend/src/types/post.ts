export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  image?: string; // URL or path to the post image
}

export interface PostState {
  posts: Post[];
}

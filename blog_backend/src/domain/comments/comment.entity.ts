import { Post } from "../posts/post.entity";
export class Comment {
  id: string;
  content: string;
  author: string;
  post: Post; 
  createdAt: Date;
  updatedAt: Date;
}
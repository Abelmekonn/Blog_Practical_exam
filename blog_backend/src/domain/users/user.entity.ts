import { Post } from '../posts/post.entity';
export class User {
  id: string;
  email: string;
  username: string;
  password: string;
  posts?: Post[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';

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

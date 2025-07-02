import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

export class Comment {
  id: string;
  content: string;
  author: User;
  post: Post;
  createdAt: Date;
  updatedAt: Date;
}

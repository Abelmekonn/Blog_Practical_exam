import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

export class Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePublicId?: string;
  author: User;
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

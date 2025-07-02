export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
}

export interface CommentState {
  comments: Comment[];
}

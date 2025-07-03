import type { User } from "../../posts/types";

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: User;
  parentId?: string; // For nested comments
  createdAt: string;
  updatedAt: string;
  isEdited?: boolean; // Optional flag for edited comments
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  id: string;
  content: string;
}

export interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

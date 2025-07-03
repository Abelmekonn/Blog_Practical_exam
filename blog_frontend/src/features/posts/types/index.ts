export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imagePublicId?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  author?: User; // Make optional since backend might not include it
}

export interface CreatePostRequest {
  title: string;
  content: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

export interface PostState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

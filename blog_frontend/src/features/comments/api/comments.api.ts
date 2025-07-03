import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class CommentsApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Comments API request failed:", error);
      throw error;
    }
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/comments/post/${postId}`);
  }

  async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    return this.request<Comment>("/comments", {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  }

  async updateComment(
    id: string,
    commentData: UpdateCommentRequest
  ): Promise<Comment> {
    return this.request<Comment>(`/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(id: string): Promise<void> {
    return this.request<void>(`/comments/${id}`, {
      method: "DELETE",
    });
  }
}

export const commentsApi = new CommentsApiService();

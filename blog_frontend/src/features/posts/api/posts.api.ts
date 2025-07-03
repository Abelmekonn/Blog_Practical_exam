import type { Post, CreatePostRequest, UpdatePostRequest } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class PostsApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get token from localStorage for authentication
    const token = localStorage.getItem("auth_token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
      console.log(
        "🔑 Using auth token for request:",
        `Bearer ${token.substring(0, 20)}...`
      );
    } else {
      console.log("⚠️ No auth token found for request to:", endpoint);
    }

    console.log("🌐 Making request to:", url);
    console.log("📋 Request headers:", headers);

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Posts API request failed:", error);
      throw error;
    }
  }

  async getAllPosts(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Post>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.tags) queryParams.append("tags", params.tags.join(","));

    const endpoint = `/posts${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return this.request<PaginatedResponse<Post>>(endpoint);
  }

  async getPostById(id: string): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    return this.request<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: string, postData: UpdatePostRequest): Promise<Post> {
    // Remove id from the request body since it's in the URL path
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...bodyData } = postData;
    return this.request<Post>(`/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(bodyData),
    });
  }

  async deletePost(id: string): Promise<void> {
    return this.request<void>(`/posts/${id}`, {
      method: "DELETE",
    });
  }
}

export const postsApi = new PostsApiService();

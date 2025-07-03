import type { LoginRequest, RegisterRequest, AuthResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

class AuthAPI {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();

    // Store the token and user data in localStorage
    const token = data.accessToken || data.token;
    if (token) {
      localStorage.setItem("auth_token", token);
      console.log("Token stored:", token);
    } else {
      console.warn("No token found in response");
    }

    if (data.user) {
      localStorage.setItem("user_data", JSON.stringify(data.user));
      console.log("User data stored:", data.user);
    } else {
      console.warn("No user data found in response");
    }

    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
    }

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }

  async getCurrentUser(): Promise<AuthResponse["user"]> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user data");
    }

    const data = await response.json();
    return data.user;
  }

  async updateProfile(
    userId: string,
    updates: { name?: string; email?: string }
  ): Promise<{ message: string }> {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Profile update failed");
    }

    return response.json();
  }
}

export const authAPI = new AuthAPI();

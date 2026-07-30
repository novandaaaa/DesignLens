const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('designlens_token');
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;
    const token = this.getToken();

    const isFormData = body instanceof FormData;

    const config: RequestInit = {
      method,
      cache: 'no-store',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };

    if (body) {
      config.body = isFormData ? (body as FormData) : JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}/api${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (err) {
      // Error logged or caught by caller
      throw err;
    }
  }

  // Auth
  async register(data: { name: string; email: string; password: string }) {
    return this.request<{ accessToken: string; user: any }>('/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: data,
    });
  }

  async getProfile() {
    return this.request<any>('/auth/me');
  }

  // Categories
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  // Websites
  async createWebsite(data: any) {
    return this.request<any>('/websites', { method: 'POST', body: data });
  }

  async getMyWebsites() {
    return this.request<any[]>('/websites');
  }

  async getWebsite(id: string) {
    return this.request<any>(`/websites/${id}`);
  }

  async deleteWebsite(id: string) {
    return this.request<any>(`/websites/${id}`, { method: 'DELETE' });
  }

  // AI Review
  async triggerAiReview(websiteId: string) {
    return this.request<any>(`/reviews/ai/${websiteId}`, { method: 'POST' });
  }

  async getAiReview(websiteId: string) {
    return this.request<any>(`/reviews/ai/${websiteId}`);
  }

  // Community
  async publishToFeed(websiteId: string) {
    return this.request<any>(`/community/publish/${websiteId}`, { method: 'POST' });
  }

  async getCommunityFeed(page = 1, limit = 10) {
    return this.request<any>(`/community/feed?page=${page}&limit=${limit}`);
  }

  async getCommunityPost(postId: string) {
    return this.request<any>(`/community/posts/${postId}`);
  }

  async addComment(postId: string, content: string, xPct?: number, yPct?: number, screenshotId?: string) {
    return this.request<any>(`/community/posts/${postId}/comments`, {
      method: 'POST',
      body: { content, xPct, yPct, screenshotId },
    });
  }

  async replyComment(commentId: string, content: string, xPct?: number, yPct?: number, screenshotId?: string) {
    return this.request<any>(`/community/comments/${commentId}/reply`, {
      method: 'POST',
      body: { content, xPct, yPct, screenshotId },
    });
  }

  async reactToComment(commentId: string, type: 'AGREE' | 'NEEDS_REVIEW' | 'DISAGREE') {
    return this.request<any>(`/community/comments/${commentId}/react`, {
      method: 'POST',
      body: { type },
    });
  }

  // Users
  async searchUsers(query: string) {
    return this.request<any[]>(`/users/search?q=${encodeURIComponent(query)}`);
  }

  async getUserProfile(userId: string) {
    return this.request<any>(`/users/${userId}/profile`);
  }

  async getUserActivity(userId: string, type: 'comments' | 'websites' = 'comments') {
    return this.request<any[]>(`/users/${userId}/activity?type=${type}`);
  }

  async updateProfile(data: FormData) {
    return this.request<any>('/users/profile', {
      method: 'PATCH',
      body: data,
    });
  }

  // ===== Community Post CRUD =====

  async updateCommunityPost(postId: string, data: { title?: string; description?: string; targetAudience?: string }) {
    return this.request<any>(`/community/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async unpublishCommunityPost(postId: string) {
    return this.request<any>(`/community/posts/${postId}/unpublish`, {
      method: 'PATCH',
    });
  }

  async deleteCommunityPost(postId: string) {
    return this.request<any>(`/community/posts/${postId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_URL);

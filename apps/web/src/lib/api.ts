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

    const config: RequestInit = {
      method,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}/api${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
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

  async addComment(postId: string, content: string) {
    return this.request<any>(`/community/posts/${postId}/comments`, {
      method: 'POST',
      body: { content },
    });
  }

  async replyComment(commentId: string, content: string) {
    return this.request<any>(`/community/comments/${commentId}/reply`, {
      method: 'POST',
      body: { content },
    });
  }

  async toggleLike(commentId: string) {
    return this.request<any>(`/community/comments/${commentId}/like`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient(API_URL);

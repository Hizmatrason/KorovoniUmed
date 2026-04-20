const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5248";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  // Public
  submitRequest: (data: { name: string; phone: string; email?: string; message: string }) =>
    request<{ id: number }>("/api/requests", { method: "POST", body: JSON.stringify(data) }),

  getNews: (page = 1, pageSize = 12) =>
    request<PagedResult<NewsListItem>>(`/api/news?page=${page}&pageSize=${pageSize}`),

  getNewsDetail: (slug: string) =>
    request<NewsDetail>(`/api/news/${slug}`),

  getChatSessionMessages: (sessionId: number) =>
    request<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`),

  getContent: () =>
    request<SiteContent[]>("/api/content"),

  // Auth
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  getMe: () => request<AuthResponse>("/api/auth/me"),

  // Admin - Requests
  getRequests: (page = 1, pageSize = 20, status?: number) =>
    request<PagedResult<HelpRequest>>(`/api/admin/requests?page=${page}&pageSize=${pageSize}${status !== undefined ? `&status=${status}` : ""}`),

  getRequest: (id: number) => request<HelpRequest>(`/api/admin/requests/${id}`),

  updateRequestStatus: (id: number, status: number, adminNotes?: string) =>
    request(`/api/admin/requests/${id}/status`, { method: "PUT", body: JSON.stringify({ status, adminNotes }) }),

  // Admin - News
  getAdminNews: (page = 1, pageSize = 20) =>
    request<PagedResult<NewsDetail>>(`/api/admin/news?page=${page}&pageSize=${pageSize}`),

  getAdminNewsDetail: (id: number) => request<NewsDetail>(`/api/admin/news/${id}`),

  createNews: (data: CreateNews) =>
    request<NewsDetail>("/api/admin/news", { method: "POST", body: JSON.stringify(data) }),

  updateNews: (id: number, data: CreateNews) =>
    request(`/api/admin/news/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteNews: (id: number) =>
    request(`/api/admin/news/${id}`, { method: "DELETE" }),

  // Admin - Users
  getUsers: () => request<UserInfo[]>("/api/admin/users"),

  createUser: (data: { email: string; password: string; fullName: string; role: string }) =>
    request<UserInfo>("/api/admin/users", { method: "POST", body: JSON.stringify(data) }),

  deleteUser: (id: string) =>
    request(`/api/admin/users/${id}`, { method: "DELETE" }),

  // Admin - Chat
  getChatSessions: (activeOnly = true) =>
    request<ChatSession[]>(`/api/admin/chat/sessions?activeOnly=${activeOnly}`),

  getChatMessages: (sessionId: number) =>
    request<ChatMessage[]>(`/api/admin/chat/sessions/${sessionId}/messages`),

  closeChatSession: (sessionId: number) =>
    request(`/api/admin/chat/sessions/${sessionId}/close`, { method: "POST" }),

  // Admin - Content
  getAdminContent: () => request<SiteContent[]>("/api/admin/content"),

  updateContent: (id: number, data: { valueRu: string; valueTj: string; valueEn: string }) =>
    request(`/api/admin/content/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Upload
  uploadImage: async (file: File) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/upload/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json() as { url: string };
    return { url: `${API_URL}${data.url}` };
  },
};

// Types
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface NewsListItem {
  id: number;
  titleRu: string;
  titleTj: string;
  titleEn: string;
  summaryRu?: string;
  summaryTj?: string;
  summaryEn?: string;
  imageUrl?: string;
  slug: string;
  publishedAt?: string;
}

export interface NewsDetail extends NewsListItem {
  contentRu: string;
  contentTj: string;
  contentEn: string;
  status: number;
  createdAt: string;
}

export interface CreateNews {
  titleRu: string;
  titleTj: string;
  titleEn: string;
  contentRu: string;
  contentTj: string;
  contentEn: string;
  summaryRu?: string;
  summaryTj?: string;
  summaryEn?: string;
  imageUrl?: string;
  status: number;
}

export interface HelpRequest {
  id: number;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: number;
  statusName: string;
  createdAt: string;
  updatedAt?: string;
  assignedToUserId?: string;
  adminNotes?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  createdAt: string;
}

export interface ChatSession {
  id: number;
  visitorName: string;
  source: number;
  assignedOperatorId?: string;
  isActive: boolean;
  createdAt: string;
  unreadCount: number;
  lastMessage?: ChatMessage;
}

export interface ChatMessage {
  id: number;
  chatSessionId: number;
  senderName: string;
  isFromOperator: boolean;
  content: string;
  sentAt: string;
}

export interface SiteContent {
  id: number;
  key: string;
  valueRu: string;
  valueTj: string;
  valueEn: string;
}

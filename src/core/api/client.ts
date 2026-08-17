/**
 * Client API centralisé pour Alliance OS.
 * Toutes les requêtes vers le backend passent par ici.
 * Le header X-Tenant-ID est injecté automatiquement depuis le store.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private getTenantId: (() => string | null) | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /** Permet au store de s'enregistrer pour fournir le tenantId dynamiquement. */
  setTenantResolver(resolver: () => string | null): void {
    this.getTenantId = resolver;
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    }
    return url.toString();
  }

  private getHeaders(isFormData: boolean = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    const tenantId = this.getTenantId?.();
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId;
    }
    return headers;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const res = await fetch(this.buildUrl(path, options?.params), {
      method: 'GET',
      headers: this.getHeaders(),
      ...options,
    });
    if (!res.ok) throw new Error(`API Error ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    const res = await fetch(this.buildUrl(path, options?.params), {
      method: 'POST',
      headers: this.getHeaders(isFormData),
      body: isFormData ? (body as FormData) : JSON.stringify(body),
      ...options,
    });
    if (!res.ok) throw new Error(`API Error ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async put<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    const res = await fetch(this.buildUrl(path, options?.params), {
      method: 'PUT',
      headers: this.getHeaders(isFormData),
      body: isFormData ? (body as FormData) : JSON.stringify(body),
      ...options,
    });
    if (!res.ok) throw new Error(`API Error ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    const res = await fetch(this.buildUrl(path, options?.params), {
      method: 'PATCH',
      headers: this.getHeaders(isFormData),
      body: isFormData ? (body as FormData) : JSON.stringify(body),
      ...options,
    });
    if (!res.ok) throw new Error(`API Error ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async delete(path: string, options?: RequestOptions): Promise<void> {
    const res = await fetch(this.buildUrl(path, options?.params), {
      method: 'DELETE',
      headers: this.getHeaders(),
      ...options,
    });
    if (!res.ok) throw new Error(`API Error ${res.status}: ${res.statusText}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

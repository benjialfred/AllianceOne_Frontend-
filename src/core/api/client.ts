/**
 * Client API centralisé pour Alliance OS.
 * Toutes les requêtes vers le backend passent par ici.
 * Le header X-Tenant-ID est injecté automatiquement depuis le store.
 */

const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('.local')
);

// If on localhost/127.0.0.1, prioritize local backend on port 8000 using matching hostname
const localHostUrl = typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : 'http://127.0.0.1:8000';

const RAW_API_URL = isLocalhost
  ? (import.meta.env.VITE_DEV_API_URL || import.meta.env.VITE_API_URL || localHostUrl)
  : (import.meta.env.VITE_API_URL as string || 'https://allianceone-backend.onrender.com');

const SANITIZED_URL = RAW_API_URL.replace(/\/+$/, '');

export const API_BASE_URL = SANITIZED_URL.endsWith('/api') ? SANITIZED_URL : `${SANITIZED_URL}/api`;
export const API_HOST_URL = SANITIZED_URL.replace(/\/api$/, '');

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

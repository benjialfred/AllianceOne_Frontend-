/**
 * ALLIANCE ONE — HYPERADMIN API CLIENT
 * Connects directly to backend endpoints under /api/core/dashboards/hyperadmin/
 * Strict compliance: NO MOCK DATA. Real database metrics only.
 */

import { apiClient } from './client';

export interface HyperAdminMetrics {
  totalOrganizations: number;
  activeOrganizations: number;
  pendingOrganizations: number;
  totalUsers: number;
  staffUsers: number;
  totalStudents: number;
  totalTransactions: number;
  totalRevenueVolume: number;
  totalInvoices: number;
  totalProducts: number;
  totalBooks: number;
  totalProjects: number;
}

export interface ModuleStat {
  key: string;
  activeTenants: number;
  adoptionRate: number;
}

export interface TenantItem {
  id: string;
  name: string;
  legalName: string;
  registrationNumber: string;
  activeModules: string[];
  createdAt: string;
  onboardingCompleted: boolean;
  sector: string;
  country: string;
  city: string;
  employeeCount: string;
  userCount: number;
  studentCount: number;
  revenueVolume: number;
}

export interface PlatformUserItem {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  roles: string[];
  createdAt: string;
}

export interface AuditTrailItem {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  user: string;
  timestamp: string;
  reason: string;
}

export interface ServiceHealth {
  name: string;
  status: string;
  badge: string;
  color: string;
}

export interface TelemetryData {
  dbEngine: string;
  dbStatus: string;
  serverTime: string;
  services: ServiceHealth[];
}

export interface HyperAdminOverviewResponse {
  status: string;
  data: {
    metrics: HyperAdminMetrics;
    moduleStats: Record<string, ModuleStat>;
    tenants: TenantItem[];
    users: PlatformUserItem[];
    auditTrail: AuditTrailItem[];
    telemetry: TelemetryData;
  };
}

export interface CreateOrgPayload {
  name: string;
  legal_name?: string;
  registration_number?: string;
  active_modules?: string[];
  sector?: string;
  country?: string;
  city?: string;
  employee_count?: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  is_hyperadmin?: boolean;
  organization_id?: string;
}

export const hyperAdminApi = {
  /**
   * Fetch complete HyperAdmin platform overview with live ORM metrics
   */
  async getOverview(): Promise<HyperAdminOverviewResponse['data']> {
    const res = await apiClient.get<HyperAdminOverviewResponse>('/core/dashboards/hyperadmin/overview/');
    return res.data;
  },

  /**
   * Toggle a module for an organization in real-time
   */
  async toggleModule(orgId: string, moduleKey: string, enabled: boolean): Promise<{ activeModules: string[] }> {
    const res = await apiClient.post<{ activeModules: string[] }>(
      `/core/dashboards/hyperadmin/organizations/${orgId}/toggle-module/`,
      { module: moduleKey, enabled }
    );
    return res;
  },

  /**
   * Create a new organization directly from the HyperAdmin cockpit
   */
  async createOrganization(payload: CreateOrgPayload): Promise<any> {
    return apiClient.post('/core/dashboards/hyperadmin/organizations/', payload);
  },

  /**
   * Create a new platform user with designated role and permissions
   */
  async createUser(payload: CreateUserPayload): Promise<any> {
    return apiClient.post('/core/dashboards/hyperadmin/users/create/', payload);
  }
};

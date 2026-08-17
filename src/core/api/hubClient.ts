import { apiClient } from './client';

export interface HubActivity {
  id: string;
  module: string;
  action: string;
  subject: string;
  detail: string;
  timestamp: string;
  routePath: string;
  badge: string;
}

export interface HubMetricsResponse {
  status: string;
  data: {
    education: {
      totalStudents: number;
      pendingEnrollments: number;
    };
    finance: {
      totalRevenue: number;
      pendingInvoices: number;
    };
    inventory: {
      totalStockValue: number;
      criticalAlerts: number;
    };
    activities: HubActivity[];
  };
}

export const hubClient = {
  /**
   * Fetches the unified metrics for the Hub OS.
   */
  getHubMetrics: async (): Promise<HubMetricsResponse> => {
    const response = await apiClient.get<HubMetricsResponse>('/core/dashboards/hub-metrics/');
    return response.data;
  },
};

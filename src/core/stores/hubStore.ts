import { create } from 'zustand';
import { hubClient } from '../api/hubClient';
import type { HubMetricsResponse } from '../api/hubClient';

interface HubState {
  metrics: HubMetricsResponse['data'] | null;
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: Date | null;
  
  fetchMetrics: () => Promise<void>;
}

export const useHubStore = create<HubState>((set) => ({
  metrics: null,
  isLoading: false,
  error: null,
  lastSyncedAt: null,

  fetchMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await hubClient.getHubMetrics();
      set({ 
        metrics: response.data, 
        isLoading: false,
        lastSyncedAt: new Date()
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors de la synchronisation du Hub', 
        isLoading: false 
      });
    }
  }
}));

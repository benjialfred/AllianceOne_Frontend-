import { apiClient, API_BASE_URL } from '../../../core/api/client';
import { Workspace } from '../../../core/workspace-sdk';

// Helper to intercept and dispatch errors
const interceptError = async (promise: Promise<any>, path: string) => {
    try {
        return await promise;
    } catch (error: any) {
        // Extract status if possible, fallback to 500
        const statusMatch = error.message?.match(/API Error (\d+):/);
        const status = statusMatch ? parseInt(statusMatch[1], 10) : 500;
        
        Workspace.events.publish('Education:APIError', {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            status,
            message: error.message || 'Une erreur inattendue est survenue',
            path: `/education${path}`,
            timestamp: Date.now()
        });
        
        throw error;
    }
};

export const api = {
    get: async (endpoint: string) => interceptError(apiClient.get(`/education${endpoint}`), endpoint),
    post: async (endpoint: string, data: any) => interceptError(apiClient.post(`/education${endpoint}`, data), endpoint),
    put: async (endpoint: string, data: any) => interceptError(apiClient.put(`/education${endpoint}`, data), endpoint),
    patch: async (endpoint: string, data: any) => interceptError(apiClient.patch(`/education${endpoint}`, data), endpoint),
    delete: async (endpoint: string) => interceptError(apiClient.delete(`/education${endpoint}`), endpoint),
};

export { API_BASE_URL };

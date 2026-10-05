import { apiClient } from './client';

export interface ModulePlan {
  id: string;
  name: string;
  price_monthly: string;
  price_yearly: string;
  currency: string;
  is_free: boolean;
  features: string[];
}

export interface ModuleManifest {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  accent_color: string;
  icon_name: string;
  version: string;
  developer_name: string;
  is_verified: boolean;
  is_native: boolean;
  status: string;
  permissions: string[];
  features: string[];
  plans: ModulePlan[];
}

export interface ModuleInstallation {
  id: string;
  module: ModuleManifest;
  status: string;
  activated_at: string | null;
  settings: Record<string, any>;
}

export const ModulesApi = {
  /**
   * Récupère le catalogue complet des modules (Marketplace)
   */
  getRegistry: async (): Promise<ModuleManifest[]> => {
    const res: any = await apiClient.get('/core/modules/registry/');
    return Array.isArray(res) ? res : (res.results || []);
  },

  /**
   * Récupère la liste des modules installés pour l'organisation courante
   */
  getInstallations: async (): Promise<ModuleInstallation[]> => {
    const res: any = await apiClient.get('/core/modules/installations/');
    return Array.isArray(res) ? res : (res.results || []);
  },

  /**
   * Demande l'installation d'un module
   * Retourne soit l'installation directe (si gratuit), soit l'URL de checkout (si payant)
   */
  installModule: (slug: string, planId?: string): Promise<any> => {
    return apiClient.post(`/core/modules/${slug}/install/`, {
      plan_id: planId
    });
  },

  /**
   * Vérifie le statut d'un paiement après redirection Nelsius
   */
  verifyPayment: (merchant_reference: string, transaction_id: string): Promise<any> => {
    return apiClient.post('/core/payments/verify/', {
      merchant_reference,
      transaction_id
    });
  }
};

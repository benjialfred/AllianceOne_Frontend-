/**
 * Fonctions d'appel API pour les ressources Identity.
 */
import { apiClient } from './client';
import type { Organization, Workspace, Role } from './types';

export const identityApi = {
  /** Récupère toutes les organisations disponibles. */
  getOrganizations: () => apiClient.get<Organization[]>('/core/identity/organizations/'),

  /** Récupère une organisation par ID. */
  getOrganization: (id: string) => apiClient.get<Organization>(`/core/identity/organizations/${id}/`),

  /** Récupère les workspaces du tenant courant (X-Tenant-ID). */
  getWorkspaces: () => apiClient.get<Workspace[]>('/core/identity/workspaces/'),

  /** Crée un workspace dans le tenant courant. */
  createWorkspace: (data: Pick<Workspace, 'name' | 'slug'>) =>
    apiClient.post<Workspace>('/core/identity/workspaces/', data),

  /** Récupère les rôles du tenant courant. */
  getRoles: () => apiClient.get<Role[]>('/core/identity/roles/'),
};

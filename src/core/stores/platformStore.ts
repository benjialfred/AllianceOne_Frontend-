/**
 * Store global Zustand pour l'état de la plateforme Alliance OS.
 * Gère le tenant actif, le workspace courant, et le thème.
 */
import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { Organization, Workspace } from '../api/types';
import type { ModuleManifest } from '../services/ManifestService';

interface PlatformState {
  // Tenant
  currentOrganization: Organization | null;
  organizations: Organization[];

  // Workspace
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];

  // Modules
  loadedModules: ModuleManifest[];
  currentModule: string | null;

  // UI
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;

  // Global Context (Education)
  currentSchoolClass: any | null;

  // Actions
  setOrganization: (org: Organization) => void;
  setOrganizations: (orgs: Organization[]) => void;
  setWorkspace: (ws: Workspace) => void;
  setWorkspaces: (wsList: Workspace[]) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setLoadedModules: (modules: ModuleManifest[]) => void;
  setCurrentModule: (mod: string | null) => void;
  setCurrentSchoolClass: (schoolClass: any | null) => void;
}

export const usePlatformStore = create<PlatformState>((set, get) => ({
  currentOrganization: null,
  organizations: [],
  currentWorkspace: null,
  workspaces: [],
  theme: 'light',
  sidebarCollapsed: false,
  loadedModules: [],
  currentModule: null,
  currentSchoolClass: null,

  setOrganization: (org) => {
    set({ currentOrganization: org });
  },

  setOrganizations: (orgs) => set({ organizations: orgs }),

  setWorkspace: (ws) => set({ currentWorkspace: ws }),

  setWorkspaces: (wsList) => set({ workspaces: wsList }),

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setLoadedModules: (modules) => set({ loadedModules: modules }),
  setCurrentModule: (mod) => set({ currentModule: mod }),
  setCurrentSchoolClass: (schoolClass) => set({ currentSchoolClass: schoolClass }),
}));

// Enregistrer le resolver de tenant dans le client API
apiClient.setTenantResolver(() => {
  return usePlatformStore.getState().currentOrganization?.id ?? null;
});

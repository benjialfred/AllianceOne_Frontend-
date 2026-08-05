import { Workspace } from '../workspace-sdk';
import type { Command } from './CommandService';
import { apiClient } from '../api/client';

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  routes: Array<{ path: string; component: string }>;
  commands?: Array<Omit<Command, 'action' | 'module'> & { action_event: string }>;
  events?: { emits: string[]; listens: string[] };
}

class ManifestLoader {
  private loadedModules = new Set<string>();

  /**
   * Récupère la liste des modules activés pour le Tenant courant depuis l'API.
   */
  public async fetchAvailableModules(): Promise<ModuleManifest[]> {
    try {
      const response = await apiClient.get<{ detail?: string } | ModuleManifest[]>('/core/identity/modules/');
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('[ManifestLoader] Failed to fetch available modules', error);
      return [];
    }
  }

  /**
   * Enregistre un manifeste de module dans l'OS (Commandes, Routes).
   */
  public loadModule(manifest: ModuleManifest) {
    if (this.loadedModules.has(manifest.id)) {
      return;
    }

    console.log(`[ManifestLoader] Bootstrapping module: ${manifest.name} (v${manifest.version})`);

    // 1. Enregistrement des Commandes CMD+K
    if (manifest.commands) {
      manifest.commands.forEach((cmd) => {
        Workspace.commands.register({
          id: `${manifest.id}_${cmd.id}`,
          module: manifest.name,
          title: cmd.title,
          shortcut: cmd.shortcut,
          action: () => Workspace.events.publish(cmd.action_event, { source: 'CommandPalette' }),
        });
      });
    }

    this.loadedModules.add(manifest.id);
    Workspace.events.publish('ModuleLoaded', { moduleId: manifest.id });
  }
}

export const ManifestService = new ManifestLoader();

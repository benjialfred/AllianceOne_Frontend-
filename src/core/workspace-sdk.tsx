import React from 'react';
import { EventBusService } from './services/EventBusService';
import { CommandService } from './services/CommandService';
import { ErrorServiceBoundary } from './services/ErrorService';

/**
 * Le Workspace SDK est le seul point de contact entre les Modules Métiers (Bounded Contexts)
 * et le Shell (Alliance Workspace).
 * Un module ne doit JAMAIS importer de fichiers en dehors de son propre dossier
 * SAUF le Workspace SDK.
 */
export const Workspace = {
  events: EventBusService,
  commands: CommandService,
  
  // Enveloppe un composant métier pour le protéger d'un crash total de l'OS
  withErrorBoundary: (moduleName: string, Component: React.ComponentType<any>) => {
    return (props: any) => (
      <ErrorServiceBoundary moduleName={moduleName}>
        <Component {...props} />
      </ErrorServiceBoundary>
    );
  }
};

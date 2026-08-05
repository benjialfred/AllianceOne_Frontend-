export interface Command {
  id: string;
  module: string;
  title: string;
  shortcut?: string[];
  action: () => void;
}

class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private subscribers: Set<() => void> = new Set();

  /**
   * Enregistrer une nouvelle commande (par un module)
   */
  register(command: Command): void {
    this.commands.set(command.id, command);
    this.notifySubscribers();
  }

  /**
   * Supprimer une commande
   */
  unregister(commandId: string): void {
    this.commands.delete(commandId);
    this.notifySubscribers();
  }

  /**
   * Récupérer toutes les commandes pour la palette CMD+K
   */
  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  /**
   * S'abonner aux changements (utile pour le composant React CMD+K)
   */
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers() {
    this.subscribers.forEach((cb) => cb());
  }
}

export const CommandService = new CommandRegistry();

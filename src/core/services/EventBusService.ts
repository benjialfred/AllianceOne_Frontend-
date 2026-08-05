type EventHandler = (payload: any) => void;

class FrontendEventBus {
  private listeners: Map<string, EventHandler[]> = new Map();

  /**
   * S'abonner à un événement du Frontend.
   * @param event Nom de l'événement (ex: 'StudentCreated')
   * @param handler Fonction de rappel
   * @returns Fonction pour se désabonner
   */
  subscribe(event: string, handler: EventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);

    // Retourne la fonction d'unsubscribe
    return () => {
      const handlers = this.listeners.get(event) || [];
      this.listeners.set(
        event,
        handlers.filter((h) => h !== handler)
      );
    };
  }

  /**
   * Publier un événement sur le bus.
   * @param event Nom de l'événement
   * @param payload Données associées
   */
  publish(event: string, payload?: any): void {
    console.debug(`[EventBus] Publishing: ${event}`, payload);
    const handlers = this.listeners.get(event) || [];
    handlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`[EventBus] Error in handler for event ${event}:`, error);
      }
    });
  }
}

export const EventBusService = new FrontendEventBus();

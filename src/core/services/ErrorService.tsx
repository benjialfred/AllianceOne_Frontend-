import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  moduleName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorServiceBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorService] Module ${this.props.moduleName} crashed:`, error, errorInfo);
    // Ici, on pourrait publier un événement d'erreur vers un AnalyticsService
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '1rem',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          color: 'var(--color-danger)'
        }}>
          <h3>⚠️ Le module "{this.props.moduleName}" a rencontré une erreur.</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
            L'OS continue de fonctionner. Veuillez recharger ce widget ou consulter les logs.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

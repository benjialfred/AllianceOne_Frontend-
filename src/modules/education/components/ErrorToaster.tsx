import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import { Workspace } from '../../../core/workspace-sdk';

export interface APIErrorDetails {
    status: number;
    message: string;
    path?: string;
    timestamp: number;
    id: string;
}

export const ErrorToaster: React.FC = () => {
    const [errors, setErrors] = useState<APIErrorDetails[]>([]);

    useEffect(() => {
        // Subscribe to the Workspace EventBus for API Errors
        const unsubscribe = Workspace.events.subscribe('Education:APIError', (errorDetails: any) => {
            setErrors(prev => [...prev, errorDetails]);
            
            // Auto-dismiss after 8 seconds
            setTimeout(() => {
                setErrors(prev => prev.filter(e => e.id !== errorDetails.id));
            }, 8000);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const dismissError = (id: string) => {
        setErrors(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 9999,
            pointerEvents: 'none' // Let clicks pass through if empty
        }}>
            <AnimatePresence>
                {errors.map(err => {
                    const isSevere = err.status >= 500;
                    return (
                        <motion.div
                            key={err.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            style={{
                                pointerEvents: 'auto',
                                width: '320px',
                                backgroundColor: 'var(--bg-surface)',
                                borderLeft: `4px solid ${isSevere ? 'var(--color-error)' : 'var(--color-warning)'}`,
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--space-3) var(--space-4)',
                                boxShadow: 'var(--shadow-lg)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--space-3)',
                                borderTop: '1px solid var(--border-subtle)',
                                borderRight: '1px solid var(--border-subtle)',
                                borderBottom: '1px solid var(--border-subtle)'
                            }}
                        >
                            <div style={{ marginTop: '2px' }}>
                                {isSevere ? 
                                    <AlertCircle color="var(--color-error)" size={20} /> : 
                                    <AlertTriangle color="var(--color-warning)" size={20} />
                                }
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <h4 style={{ 
                                    margin: 0, 
                                    fontSize: 'var(--text-sm)', 
                                    fontWeight: 600,
                                    color: isSevere ? 'var(--color-error)' : 'var(--color-warning)'
                                }}>
                                    Erreur {err.status}
                                </h4>
                                <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                    {err.message}
                                </p>
                                {err.path && (
                                    <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                        {err.path}
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => dismissError(err.id)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'var(--text-tertiary)', padding: '2px', display: 'flex'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

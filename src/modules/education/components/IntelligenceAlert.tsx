import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertItem {
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
}

interface IntelligenceAlertProps {
    alerts: AlertItem[];
    onDismiss?: (id: string) => void;
}

const getAlertStyles = (type: string) => {
    switch (type) {
        case 'error':
            return { bg: 'var(--color-danger-bg)', border: 'var(--color-danger-border)', icon: <AlertCircle color="var(--color-danger-text)" size={20} /> };
        case 'warning':
            return { bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)', icon: <AlertTriangle color="var(--color-warning-text)" size={20} /> };
        case 'success':
            return { bg: 'var(--color-success-bg)', border: 'var(--color-success-border)', icon: <CheckCircle2 color="var(--color-success-text)" size={20} /> };
        case 'info':
        default:
            return { bg: 'var(--color-accent-100)', border: 'var(--color-accent-200)', icon: <Info color="var(--color-accent-600)" size={20} /> };
    }
};

export const IntelligenceAlert: React.FC<IntelligenceAlertProps> = ({ alerts, onDismiss }) => {
    if (!alerts || alerts.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)' }}>
            <h3 className="t-h3" style={{ paddingLeft: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>Intelligence & Alertes</h3>
            
            <AnimatePresence>
                {alerts.map((alert, index) => {
                    const styles = getAlertStyles(alert.type);
                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10, height: 0, marginTop: 0, marginBottom: 0, padding: 0, overflow: 'hidden' }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            style={{
                                backgroundColor: styles.bg,
                                border: `1px solid ${styles.border}`,
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--spacing-4)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--spacing-3)',
                                position: 'relative',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            <div style={{ marginTop: '2px' }}>
                                {styles.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>
                                    {alert.title}
                                </h4>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                                    {alert.message}
                                </p>
                            </div>
                            {onDismiss && (
                                <button 
                                    onClick={() => onDismiss(alert.id)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        color: 'var(--color-text-tertiary)',
                                        display: 'flex',
                                        transition: 'color var(--transition-fast)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

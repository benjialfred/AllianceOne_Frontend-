import React from 'react';
import { motion } from 'framer-motion';

export interface PageHeaderProps {
    title: string;
    subtitle: string;
    icon?: any;
    badge?: string;
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon: Icon, badge, actions }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
                marginBottom: 'var(--space-8)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 4px 24px -6px rgba(14, 18, 27, 0.05)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                {Icon && (
                    <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: 'var(--radius-lg)', 
                        background: 'linear-gradient(135deg, var(--color-accent) 0%, #8b5cf6 100%)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.3)'
                    }}>
                        <Icon size={24} />
                    </div>
                )}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <h2 className="t-h1" style={{ margin: 0 }}>{title}</h2>
                        {badge && (
                            <span style={{ 
                                fontSize: '10px', 
                                fontWeight: 700, 
                                background: 'rgba(99, 102, 241, 0.1)', 
                                color: 'var(--color-accent)', 
                                padding: '2px 8px', 
                                borderRadius: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {badge}
                            </span>
                        )}
                    </div>
                    <p className="t-subtitle" style={{ marginTop: 'var(--space-1)', opacity: 0.8 }}>{subtitle}</p>
                </div>
            </div>
            
            {actions && (
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    {actions}
                </div>
            )}
        </motion.div>
    );
};

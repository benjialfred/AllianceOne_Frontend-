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
            className="ao-glass-panel"
            style={{ 
                marginBottom: 'var(--ao-space-8)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                padding: 'var(--ao-space-6)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ao-space-4)' }}>
                {Icon && (
                    <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: 'var(--ao-radius-lg)', 
                        background: 'var(--ao-color-bg-secondary)',
                        color: 'var(--ao-color-alliance-blue)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                    }}>
                        <Icon size={24} />
                    </div>
                )}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ao-space-3)' }}>
                        <h2 style={{ 
                            margin: 0, 
                            fontFamily: 'var(--ao-font-display)', 
                            fontSize: '20px', 
                            fontWeight: 'var(--ao-weight-semibold)',
                            color: 'var(--ao-color-text-primary)'
                        }}>
                            {title}
                        </h2>
                        {badge && (
                            <span style={{ 
                                fontSize: '10px', 
                                fontWeight: 'var(--ao-weight-bold)', 
                                background: 'var(--ao-color-bg-tertiary)', 
                                color: 'var(--ao-color-text-secondary)', 
                                padding: '2px 8px', 
                                borderRadius: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: 'var(--ao-tracking-widest)'
                            }}>
                                {badge}
                            </span>
                        )}
                    </div>
                    <p style={{ 
                        margin: 'var(--ao-space-1) 0 0 0', 
                        fontSize: '14px', 
                        color: 'var(--ao-color-text-secondary)'
                    }}>
                        {subtitle}
                    </p>
                </div>
            </div>
            
            {actions && (
                <div style={{ display: 'flex', gap: 'var(--ao-space-3)' }}>
                    {actions}
                </div>
            )}
        </motion.div>
    );
};

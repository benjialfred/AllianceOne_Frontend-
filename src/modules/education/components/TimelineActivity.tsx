import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CreditCard, FileText, Bell, LogIn } from 'lucide-react';

export interface ActivityItem {
    id: string;
    type: 'enrollment' | 'payment' | 'report' | 'message' | 'login' | string;
    message: string;
    timestamp: string; // ISO String or readable format
}

interface TimelineActivityProps {
    activities: ActivityItem[];
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'enrollment': return <UserPlus size={16} color="var(--color-primary-text)" />;
        case 'payment': return <CreditCard size={16} color="var(--color-success-text)" />;
        case 'report': return <FileText size={16} color="var(--color-accent-500)" />;
        case 'message': return <Bell size={16} color="var(--color-warning-text)" />;
        case 'login': return <LogIn size={16} color="var(--color-text-muted)" />;
        default: return <Bell size={16} color="var(--color-primary-text)" />;
    }
};

const getActivityBg = (type: string) => {
    switch (type) {
        case 'enrollment': return 'var(--color-primary-bg)';
        case 'payment': return 'var(--color-success-bg)';
        case 'report': return 'var(--color-accent-100)';
        case 'message': return 'var(--color-warning-bg)';
        case 'login': return 'var(--color-surface-hover)';
        default: return 'var(--color-surface-hover)';
    }
};

export const TimelineActivity: React.FC<TimelineActivityProps> = ({ activities }) => {
    return (
        <div style={{ padding: 'var(--spacing-2) 0' }}>
            <div style={{ position: 'relative' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    left: '23px',
                    top: '10px',
                    bottom: '10px',
                    width: '2px',
                    backgroundColor: 'var(--color-surface-border)',
                    zIndex: 0
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                    {activities.map((activity, index) => (
                        <motion.div 
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            style={{ display: 'flex', gap: 'var(--spacing-4)', position: 'relative', zIndex: 1 }}
                        >
                            {/* Icon Circle */}
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: getActivityBg(activity.type),
                                border: '4px solid var(--color-surface-card)', // Creates gap effect over the line
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {getActivityIcon(activity.type)}
                            </div>

                            {/* Content */}
                            <div style={{ paddingTop: '8px' }}>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
                                    {activity.message}
                                </p>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                    {' • '} 
                                    {new Date(activity.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    
                    {activities.length === 0 && (
                        <div style={{ paddingLeft: 'var(--spacing-10)', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                            Aucune activité récente.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

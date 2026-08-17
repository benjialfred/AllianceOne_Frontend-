import React, { useState, useEffect } from 'react';
import { Card, Badge } from './index';
import { api } from '../services/api';
import { Activity, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClassActivityFeedProps {
    classId: number;
    className: string;
}

export const ClassActivityFeed: React.FC<ClassActivityFeedProps> = ({ classId, className }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // In a real app, the API should support ?school_class=... or similar
                // Here we fetch all logs and filter by class name or related terms for demo purposes
                const data = await api.get('/audit-logs/');
                
                // Demo filtering: show logs that contain the class name in object_repr or just show recent logs
                const classLogs = data.filter((l: any) => 
                    l.object_repr?.toLowerCase().includes(className.toLowerCase()) || 
                    l.model_name === 'Attendance' || 
                    l.model_name === 'Grade'
                ).slice(0, 10); // Keep top 10

                setLogs(classLogs.length > 0 ? classLogs : data.slice(0, 10)); // Fallback to generic logs if none match
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchLogs();
        }
    }, [classId, className]);

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'CREATE': return <Badge label="Ajout" variant="success" />;
            case 'UPDATE': return <Badge label="Modification" variant="warning" />;
            case 'DELETE': return <Badge label="Suppression" variant="danger" />;
            default: return <Badge label={action} variant="default" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Card>
                <div style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-muted)' }}>Chargement des mouvements...</div>
            </Card>
        );
    }

    return (
        <Card noPadding style={{ height: '100%' }}>
            <div style={{ padding: 'var(--spacing-4) var(--spacing-5)', borderBottom: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <Activity size={18} color="var(--color-primary)" />
                <h3 className="t-h5" style={{ margin: 0 }}>Mouvements de la salle</h3>
            </div>
            
            <div style={{ padding: 'var(--spacing-4)' }}>
                {logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', color: 'var(--color-text-muted)' }}>
                        <ShieldAlert size={24} style={{ margin: '0 auto var(--spacing-2)', opacity: 0.5 }} />
                        <p style={{ margin: 0 }}>Aucun mouvement récent.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        {logs.map((log, idx) => (
                            <motion.div 
                                key={log.id || idx} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: idx * 0.05 }}
                                style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start' }}
                            >
                                <div style={{ marginTop: '2px' }}>
                                    {getActionBadge(log.action)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                                        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{log.user_name || 'Système'}</span> a agi sur <strong>{log.object_repr}</strong>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-1)' }}>
                                        <Clock size={12} />
                                        <span>{formatDate(log.timestamp)}</span>
                                        <span style={{ margin: '0 4px' }}>•</span>
                                        <span>{log.model_name}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

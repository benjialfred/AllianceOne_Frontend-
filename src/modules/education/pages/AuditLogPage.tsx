import React, { useState, useEffect } from 'react';
import { Card, Badge, PageHeader } from '../components';
import { api } from '../services/api';
import { ShieldAlert, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuditLogPage = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await api.get('/audit-logs/');
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'CREATE': return <Badge label="Création" variant="success" />;
            case 'UPDATE': return <Badge label="Modification" variant="warning" />;
            case 'DELETE': return <Badge label="Suppression" variant="danger" />;
            case 'LOGIN': return <Badge label="Connexion" variant="accent" />;
            default: return <Badge label={action} variant="default" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const filteredLogs = logs.filter(l => 
        l.model_name?.toLowerCase().includes(search.toLowerCase()) ||
        l.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        l.object_repr?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Journal d'Activité"
                subtitle="Traçabilité complète des actions sur la plateforme."
                icon={ShieldAlert}
            />

            <Card noPadding>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Search size={18} color="var(--text-tertiary)" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par utilisateur, ressource..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ padding: '0.75rem', width: '100%', maxWidth: '400px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)', outline: 'none' }}
                    />
                </div>
                {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Date & Heure</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Utilisateur</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Action</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Ressource</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Modifications</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Appareil / IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{formatDate(log.timestamp)}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{log.user_name || 'Système'}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{getActionBadge(log.action)}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 500 }}>{log.model_name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{log.object_repr}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {log.changes ? (
                                            <details style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                <summary style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>Voir les détails</summary>
                                                <pre style={{ margin: '0.5rem 0 0 0', padding: '0.5rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', overflowX: 'auto', fontSize: '0.75rem' }}>
                                                    {JSON.stringify(log.changes, null, 2)}
                                                </pre>
                                            </details>
                                        ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        <div>{log.ip_address}</div>
                                        <div style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.user_agent}>{log.user_agent}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </motion.div>
    );
};

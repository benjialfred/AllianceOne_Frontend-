import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge, PageHeader } from '../components';
import { api } from '../services/api';
import { CalendarDays, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const AcademicYearEventsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [academicYear, setAcademicYear] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'events' | 'audit'>('events');
    const [formData, setFormData] = useState({ title: '', date: '', description: '' });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ayData, evData, logData] = await Promise.all([
                api.get(`/academic-years/${id}/`),
                api.get(`/events/?academic_year=${id}`),
                api.get(`/audit-logs/?academic_year=${id}`)
            ]);
            setAcademicYear(ayData);
            setEvents(evData);
            setAuditLogs(logData);
        } catch (error) {
            console.error("Erreur de chargement", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/events/', { ...formData, academic_year: id });
            setFormData({ title: '', date: '', description: '' });
            fetchData();
            alert('Événement créé avec succès');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la création de l\'événement');
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        if (!window.confirm("Supprimer cet événement ?")) return;
        try {
            await api.delete(`/events/${eventId}/`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Chargement...</div>;

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title={`Année Académique: ${academicYear?.label || '...'}`}
                subtitle="Gestion des événements et consultation de l'historique de l'année."
                icon={CalendarDays}
                actions={
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/academic-years')}>Retour</Button>
                }
            />

            <div style={{ display: 'flex', gap: 'var(--spacing-4)', borderBottom: '1px solid var(--color-surface-border)', paddingBottom: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
                <Button variant={activeTab === 'events' ? 'primary' : 'ghost'} onClick={() => setActiveTab('events')}>Événements Scolaires</Button>
                <Button variant={activeTab === 'audit' ? 'primary' : 'ghost'} onClick={() => setActiveTab('audit')}>Historique des Actions (Audit)</Button>
            </div>

            {activeTab === 'events' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-8)' }}>
                    <Card>
                        <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Ajouter un Événement</h3>
                        <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                            <Input name="title" label="Titre de l'événement" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            <Input name="date" label="Date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                            <Input name="description" label="Description (optionnel)" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            <div style={{ marginTop: 'var(--spacing-2)' }}>
                                <Button type="submit" fullWidth>Créer</Button>
                            </div>
                        </form>
                    </Card>
                    <Card noPadding style={{ alignSelf: 'start' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Date</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Titre</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Description</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map(ev => (
                                        <tr key={ev.id} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-secondary)' }}>{ev.date}</td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{ev.title}</td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-secondary)' }}>{ev.description}</td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)' }}>
                                                <Button variant="ghost" size="sm" icon={Trash2} iconOnly title="Supprimer" onClick={() => handleDeleteEvent(ev.id)} style={{ color: 'var(--color-danger-text)' }} />
                                            </td>
                                        </tr>
                                    ))}
                                    {events.length === 0 && <tr><td colSpan={4} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucun événement enregistré.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'audit' && (
                <Card noPadding>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                                    <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Date/Heure</th>
                                    <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Utilisateur</th>
                                    <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Action</th>
                                    <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Cible</th>
                                    <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Détails</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                        <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-secondary)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                        <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{log.user_details ? log.user_details.username : 'Système'}</td>
                                        <td style={{ padding: 'var(--spacing-4) var(--spacing-6)' }}>
                                            <Badge label={log.action} variant={log.action === 'CREATE' ? 'success' : log.action === 'DELETE' ? 'danger' : 'default'} />
                                        </td>
                                        <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-primary)' }}>{log.model_name}: {log.object_repr}</td>
                                        <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                            {log.changes ? JSON.stringify(log.changes).slice(0, 50) + '...' : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {auditLogs.length === 0 && <tr><td colSpan={5} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucun log d'audit pour cette période.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </motion.div>
    );
};

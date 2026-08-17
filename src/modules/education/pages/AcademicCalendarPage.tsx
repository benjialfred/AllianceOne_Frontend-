import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Table, Badge, PageHeader } from '../components';
import type { Column } from '../components';
import { api } from '../services/api';
import { Calendar as CalendarIcon, Plus, Edit2, Trash2, Save, X, AlertTriangle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const AcademicCalendarPage = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [activeYearId, setActiveYearId] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_type: 'AUTRE',
        start_date: '',
        end_date: '',
        suspends_attendance: false,
        locks_grades: false,
        is_public: true
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (activeYearId) {
            fetchEvents();
        }
    }, [activeYearId]);

    const fetchInitialData = async () => {
        try {
            const years = await api.get('/academic-years/');
            setAcademicYears(years);
            const active = years.find((y: any) => y.is_active);
            if (active) {
                setActiveYearId(String(active.id));
            } else if (years.length > 0) {
                setActiveYearId(String(years[0].id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/academic-events/?academic_year=${activeYearId}`);
            setEvents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEdit = (ev: any) => {
        setEditingId(ev.id);
        setFormData({
            title: ev.title || '',
            description: ev.description || '',
            event_type: ev.event_type || 'AUTRE',
            start_date: ev.start_date ? String(ev.start_date).split('T')[0] : '',
            end_date: ev.end_date ? String(ev.end_date).split('T')[0] : '',
            suspends_attendance: ev.suspends_attendance || false,
            locks_grades: ev.locks_grades || false,
            is_public: ev.is_public !== undefined ? ev.is_public : true
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            title: '',
            description: '',
            event_type: 'AUTRE',
            start_date: '',
            end_date: '',
            suspends_attendance: false,
            locks_grades: false,
            is_public: true
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData, academic_year: activeYearId };
            if (editingId) {
                await api.put(`/academic-events/${editingId}/`, payload);
            } else {
                await api.post('/academic-events/', payload);
            }
            await fetchEvents();
            handleCancelEdit();
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l’enregistrement.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet événement ?")) return;
        try {
            await api.delete(`/academic-events/${id}/`);
            await fetchEvents();
            if (editingId === id) handleCancelEdit();
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    };

    const columns: Column<any>[] = [
        { header: 'Titre', accessor: 'title', render: (item) => <strong style={{color: 'var(--color-primary)'}}>{item.title}</strong> },
        { 
            header: 'Type', 
            accessor: 'event_type',
            render: (item) => <Badge label={item.event_type} variant={item.event_type === 'EXAMEN' ? 'warning' : 'info'} />
        },
        { header: 'Début', accessor: 'start_date', render: (item) => new Date(item.start_date).toLocaleDateString('fr-FR') },
        { header: 'Fin', accessor: 'end_date', render: (item) => new Date(item.end_date).toLocaleDateString('fr-FR') },
        { 
            header: 'Impacts', 
            accessor: 'impacts',
            render: (item) => (
                <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                    {item.suspends_attendance && <Badge label="Appels Suspendus" variant="danger" />}
                    {item.locks_grades && <Badge label="Notes Bloquées" variant="danger" />}
                    {!item.suspends_attendance && !item.locks_grades && <span style={{color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)'}}>-</span>}
                </div>
            )
        },
        { 
            header: 'Actions', 
            accessor: 'id',
            render: (item) => (
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <Button variant="ghost" size="sm" icon={Edit2} iconOnly title="Modifier" onClick={() => handleEdit(item)} style={{ color: 'var(--color-accent-600)' }} />
                    <Button variant="ghost" size="sm" icon={Trash2} iconOnly title="Supprimer" onClick={() => handleDelete(item.id)} style={{ color: 'var(--color-danger-text)' }} />
                </div>
            ),
            width: '150px'
        }
    ];

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Calendrier Académique"
                subtitle="Orchestrateur officiel. Les événements ici définissent le comportement des autres modules (appels, notes)."
                icon={CalendarIcon}
                actions={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>Année Académique :</span>
                        <select 
                            style={{ padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }}
                            value={activeYearId} 
                            onChange={e => setActiveYearId(e.target.value)}
                        >
                            {academicYears.map(y => (
                                <option key={y.id} value={y.id}>{y.label} {y.is_active ? '(Active)' : ''}</option>
                            ))}
                        </select>
                    </div>
                }
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-8)' }}>
                <Card>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        {editingId ? <Edit2 size={18} color="var(--color-primary)" /> : <Plus size={18} color="var(--color-primary)" />}
                        {editingId ? 'Modifier un Événement' : 'Nouvel Événement'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        <Input name="title" label="Titre de l'événement" value={formData.title} onChange={handleChange} required />
                        
                        <Input name="event_type" label="Type" type="select" value={formData.event_type} onChange={handleChange} required options={[
                            {value: 'RENTREE', label: 'Rentrée Scolaire'},
                            {value: 'CONGE', label: 'Congés / Vacances'},
                            {value: 'FERIE', label: 'Jour Férié'},
                            {value: 'EXAMEN', label: 'Période d\'Examens'},
                            {value: 'REUNION', label: 'Réunion Parents/Profs'},
                            {value: 'AUTRE', label: 'Autre événement'}
                        ]} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                            <Input name="start_date" label="Date de début" type="date" value={formData.start_date} onChange={handleChange} required />
                            <Input name="end_date" label="Date de fin" type="date" value={formData.end_date} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="t-label" style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>Description (Optionnel)</label>
                            <textarea 
                                name="description"
                                style={{ width: '100%', minHeight: '80px', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                            <h4 className="t-body-strong" style={{ margin: 0, color: 'var(--color-text-primary)' }}>Effets sur la plateforme</h4>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                <input 
                                    type="checkbox" 
                                    name="suspends_attendance"
                                    checked={formData.suspends_attendance}
                                    onChange={handleChange}
                                    style={{ accentColor: 'var(--color-primary)' }}
                                />
                                <AlertTriangle size={16} color={formData.suspends_attendance ? 'var(--color-danger-text)' : 'var(--color-text-tertiary)'} />
                                <span>Suspendre les appels (Congés, jours fériés)</span>
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                <input 
                                    type="checkbox" 
                                    name="locks_grades"
                                    checked={formData.locks_grades}
                                    onChange={handleChange}
                                    style={{ accentColor: 'var(--color-primary)' }}
                                />
                                <Lock size={16} color={formData.locks_grades ? 'var(--color-danger-text)' : 'var(--color-text-tertiary)'} />
                                <span>Bloquer la saisie des notes</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                <input 
                                    type="checkbox" 
                                    name="is_public"
                                    checked={formData.is_public}
                                    onChange={handleChange}
                                    style={{ accentColor: 'var(--color-primary)' }}
                                />
                                <span>Visible sur les espaces Parents / Élèves</span>
                            </label>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                            <Button type="submit" disabled={submitting || !activeYearId} icon={Save} fullWidth>
                                {submitting ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Ajouter l\'événement')}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="ghost" icon={X} onClick={handleCancelEdit} fullWidth>
                                    Annuler
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div>
                    <Table 
                        columns={columns} 
                        data={events} 
                        keyExtractor={(item) => item.id}
                        loading={loading}
                        emptyMessage="Aucun événement pour cette année académique."
                        pageSize={10}
                    />
                </div>
            </div>
        </motion.div>
    );
};

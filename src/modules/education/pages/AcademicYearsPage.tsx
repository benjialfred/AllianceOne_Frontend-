import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, PageHeader } from '../components';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CalendarRange, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const AcademicYearsPage = () => {
    const navigate = useNavigate();
    const [years, setYears] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState({
        label: '',
        start_year: new Date().getFullYear(),
        end_year: new Date().getFullYear() + 1,
        is_active: false
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await api.get('/academic-years/');
            setYears(data);
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleEdit = (year: any) => {
        setEditingId(year.id);
        setFormData({
            label: year.label || '',
            start_year: year.start_year || new Date().getFullYear(),
            end_year: year.end_year || new Date().getFullYear() + 1,
            is_active: !!year.is_active
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            label: '',
            start_year: new Date().getFullYear(),
            end_year: new Date().getFullYear() + 1,
            is_active: false
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg(null);
        try {
            if (editingId) {
                await api.put(`/academic-years/${editingId}/`, formData);
                alert('Année académique mise à jour !');
            } else {
                await api.post('/academic-years/', formData);
                alert('Année académique créée !');
            }
            await fetchData();
            handleCancelEdit();
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Erreur lors de l’enregistrement.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Supprimer cette année académique ? Attention, cela peut échouer si des classes y sont liées.")) return;
        setErrorMsg(null);
        try {
            await api.delete(`/academic-years/${id}/`);
            await fetchData();
            if (editingId === id) {
                handleCancelEdit();
            }
        } catch (error: any) {
            console.error(error);
            setErrorMsg("Impossible de supprimer : " + (error.message || 'Erreur inconnue.'));
        }
    };

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Années Académiques"
                subtitle="Créez et gérez les années scolaires avant de pouvoir créer des classes."
                icon={CalendarRange}
            />

            {errorMsg && (
                <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger-border)', marginBottom: 'var(--spacing-6)' }}>
                    <strong style={{ fontWeight: 'var(--font-weight-semibold)' }}>Erreur : </strong> {errorMsg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-8)' }}>
                <Card>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>
                        {editingId ? 'Modifier l’Année' : 'Nouvelle Année'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        <Input name="label" label="Libellé (ex: 2026-2027)" value={formData.label} onChange={handleChange} required />
                        <Input name="start_year" type="number" label="Année de début (ex: 2026)" value={String(formData.start_year)} onChange={handleChange} required />
                        <Input name="end_year" type="number" label="Année de fin (ex: 2027)" value={String(formData.end_year)} onChange={handleChange} required />
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                            <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active} onChange={handleChange} style={{ accentColor: 'var(--color-primary)' }} />
                            <label htmlFor="is_active" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>Définir comme année active</label>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Créer l\'année')}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                                    Annuler la modification
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <Card noPadding style={{ alignSelf: 'start' }}>
                    <div style={{ padding: 'var(--spacing-6)', borderBottom: '1px solid var(--color-surface-border)' }}>
                        <h3 className="t-h3" style={{ margin: 0 }}>Liste des années académiques</h3>
                    </div>
                    {loading ? <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Chargement...</div> : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-surface-border)', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-hover)' }}>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Libellé</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Période</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Statut</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {years.length === 0 ? (
                                        <tr><td colSpan={4} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucune année créée.</td></tr>
                                    ) : years.map((y) => (
                                        <tr key={y.id} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{y.label}</td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-secondary)' }}>{y.start_year} - {y.end_year}</td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)' }}>
                                                {y.is_active ? <Badge label="Active" variant="success" /> : <Badge label="Inactive" variant="default" />}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', display: 'flex', gap: 'var(--spacing-2)' }}>
                                                <Button variant="outline" size="sm" onClick={() => navigate(`/academic-years/${y.id}/events`)}>Détails & Événements</Button>
                                                <Button variant="ghost" size="sm" icon={Edit2} iconOnly title="Modifier" onClick={() => handleEdit(y)} style={{ color: 'var(--color-accent-600)' }} />
                                                <Button variant="ghost" size="sm" icon={Trash2} iconOnly title="Supprimer" onClick={() => handleDelete(y.id)} style={{ color: 'var(--color-danger-text)' }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </motion.div>
    );
};

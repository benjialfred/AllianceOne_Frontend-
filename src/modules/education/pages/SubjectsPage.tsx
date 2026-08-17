import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '../components';
import { Edit2, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export const SubjectsPage = () => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        level: 'Primaire',
        coefficient: 1
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await api.get('/subjects/');
            setSubjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (sub: any) => {
        setEditingId(sub.id);
        setFormData({
            name: sub.name || '',
            level: sub.level || 'Primaire',
            coefficient: sub.coefficient || 1
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', level: 'Primaire', coefficient: 1 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/subjects/${editingId}/`, formData);
                alert('Matière mise à jour !');
            } else {
                await api.post('/subjects/', formData);
                alert('Matière créée !');
            }
            await fetchData();
            handleCancelEdit();
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Erreur lors de l’enregistrement.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Supprimer cette matière ?")) return;
        try {
            await api.delete(`/subjects/${id}/`);
            await fetchData();
            if (editingId === id) {
                handleCancelEdit();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <Card>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
                        {editingId ? 'Modifier la Matière' : 'Nouvelle Matière'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Input name="name" label="Nom de la matière" value={formData.name} onChange={handleChange} required />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Niveau</label>
                            <select name="level" value={formData.level} onChange={handleChange} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none' }} required>
                                <option value="Primaire">Primaire</option>
                                <option value="1er Cycle">1er Cycle</option>
                                <option value="2nd Cycle">2nd Cycle</option>
                            </select>
                        </div>
                        <Input name="coefficient" type="number" label="Coefficient par défaut" value={formData.coefficient} onChange={handleChange} required />
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Créer')}
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
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Liste des matières</h3>
                    </div>
                    {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Code</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Niveau</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Nom</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Coeff par défaut</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((sub) => (
                                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{sub.code}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                                            <Badge 
                                                label={sub.level || 'Non défini'} 
                                                variant={
                                                    sub.level === 'Primaire' ? 'success' :
                                                    sub.level === '1er Cycle' ? 'accent' :
                                                    sub.level === '2nd Cycle' ? 'warning' : 'default'
                                                } 
                                            />
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{sub.name}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>x{sub.coefficient}</td>
                                        <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                                            <Button variant="ghost" icon={Edit2} iconOnly title="Modifier" onClick={() => handleEdit(sub)} style={{ color: 'var(--color-accent)' }} />
                                            <Button variant="ghost" icon={Trash2} iconOnly title="Supprimer" onClick={() => handleDelete(sub.id)} style={{ color: 'var(--color-error)' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>
            </div>
        </div>
    );
};

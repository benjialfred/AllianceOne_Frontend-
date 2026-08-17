import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Table } from '../components';
import type { Column } from '../components';
import { api } from '../services/api';
import { Edit2, Trash2, UserPlus, Save, X, GraduationCap } from 'lucide-react';
import { PageHeader } from '../components';
import { motion } from 'framer-motion';

export const TeachersPage = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        sex: 'M',
        specialty: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await api.get('/teachers/');
            setTeachers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (teacher: any) => {
        setEditingId(teacher.id);
        setFormData({
            first_name: teacher.first_name || '',
            last_name: teacher.last_name || '',
            sex: teacher.sex || 'M',
            specialty: teacher.specialty || '',
            phone: teacher.phone || '',
            email: teacher.email || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ first_name: '', last_name: '', sex: 'M', specialty: '', phone: '', email: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/teachers/${editingId}/`, formData);
            } else {
                await api.post('/teachers/', formData);
            }
            await fetchData();
            handleCancelEdit();
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l’enregistrement.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Supprimer cet enseignant ? Les classes affectées seront impactées.")) return;
        try {
            await api.delete(`/teachers/${id}/`);
            await fetchData();
            if (editingId === id) handleCancelEdit();
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    };

    const filteredTeachers = teachers.filter(t => 
        t.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns: Column<any>[] = [
        { header: 'Code', accessor: 'code', width: '100px' },
        { 
            header: 'Enseignant', 
            accessor: 'id',
            render: (item) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)' }}>
                        {item.first_name?.[0]}{item.last_name?.[0]}
                    </div>
                    <div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{item.first_name} {item.last_name}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{item.email || '-'}</div>
                    </div>
                </div>
            ) 
        },
        { header: 'Spécialité', accessor: 'specialty' },
        { header: 'Téléphone', accessor: 'phone' },
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
                title="Enseignants"
                subtitle="Gestion du corps professoral et des spécialités."
                icon={GraduationCap}
                badge={`${teachers.length} Professeurs`}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-8)' }}>
                <Card>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        {editingId ? <Edit2 size={18} color="var(--color-primary)" /> : <UserPlus size={18} color="var(--color-primary)" />}
                        {editingId ? 'Modifier l’Enseignant' : 'Nouvel Enseignant'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        <Input name="first_name" label="Prénom" value={formData.first_name} onChange={handleChange} required />
                        <Input name="last_name" label="Nom" value={formData.last_name} onChange={handleChange} required />
                        <Input name="sex" label="Sexe" type="select" value={formData.sex} onChange={handleChange} required options={[{value: 'M', label: 'Masculin'}, {value: 'F', label: 'Féminin'}]} />
                        <Input name="specialty" label="Spécialité" value={formData.specialty} onChange={handleChange} required />
                        <Input name="phone" label="Téléphone" value={formData.phone} onChange={handleChange} required />
                        <Input name="email" type="email" label="Email" value={formData.email} onChange={handleChange} />
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                            <Button type="submit" disabled={submitting} icon={Save} fullWidth>
                                {submitting ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Enregistrer')}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="ghost" icon={X} onClick={handleCancelEdit} fullWidth>
                                    Annuler la modification
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div>
                    <Table 
                        columns={columns} 
                        data={filteredTeachers} 
                        keyExtractor={(item) => item.id}
                        loading={loading}
                        searchable
                        searchPlaceholder="Rechercher par nom, spécialité..."
                        onSearch={setSearchQuery}
                        emptyMessage="Aucun enseignant trouvé."
                        pageSize={10}
                    />
                </div>
            </div>
        </motion.div>
    );
};

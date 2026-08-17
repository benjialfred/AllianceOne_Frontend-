import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Table, Badge, Card } from '.';
import { api } from '../services/api';
import { Trash2, Plus, Edit2, Layers } from 'lucide-react';

interface SeriesManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export const SeriesManagerModal: React.FC<SeriesManagerModalProps> = ({ isOpen, onClose, onUpdate }) => {
    const [groups, setGroups] = useState<any[]>([]);
    const [series, setSeries] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [groupName, setGroupName] = useState('');
    const [seriesName, setSeriesName] = useState('');
    const [seriesGroupId, setSeriesGroupId] = useState('');
    const [sectionName, setSectionName] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [grpRes, serRes, secRes] = await Promise.all([
                api.get('/series-groups/'),
                api.get('/series/'),
                api.get('/sections/')
            ]);
            setGroups(grpRes);
            setSeries(serRes);
            setSections(secRes);
            onUpdate();
        } catch (error) {
            console.error("Erreur chargement séries", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupName) return;
        try {
            await api.post('/series-groups/', { name: groupName });
            setGroupName('');
            fetchData();
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l’ajout du groupe');
        }
    };

    const handleAddSeries = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!seriesName || !seriesGroupId) return;
        try {
            await api.post('/series/', { name: seriesName, group: seriesGroupId });
            setSeriesName('');
            setSeriesGroupId('');
            fetchData();
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l’ajout de la série');
        }
    };

    const handleAddSection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sectionName) return;
        try {
            await api.post('/sections/', { name: sectionName });
            setSectionName('');
            fetchData();
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l’ajout de la section');
        }
    };

    const handleDeleteGroup = async (id: number) => {
        if (!window.confirm("Supprimer ce groupe ? Les séries associées seront supprimées.")) return;
        try {
            await api.delete(`/series-groups/${id}/`);
            fetchData();
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    };

    const handleDeleteSeries = async (id: number) => {
        if (!window.confirm("Supprimer cette série ?")) return;
        try {
            await api.delete(`/series/${id}/`);
            fetchData();
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    };

    const handleDeleteSection = async (id: number) => {
        if (!window.confirm("Supprimer cette section ?")) return;
        try {
            await api.delete(`/sections/${id}/`);
            fetchData();
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Layers size={20} color="var(--color-primary)" />
                    <span>Gestion des Sections, Groupes & Séries</span>
                </div>
            }
            footer={
                <Button variant="outline" onClick={onClose}>Fermer</Button>
            }
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-6)' }}>
                {/* SECTIONS */}
                <Card style={{ padding: 'var(--spacing-4)', background: 'var(--color-surface-bg)' }}>
                    <h4 className="t-h6" style={{ marginBottom: 'var(--spacing-4)' }}>Sections (ex: Francophone)</h4>
                    <form onSubmit={handleAddSection} style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
                        <div style={{ flex: 1 }}>
                            <Input placeholder="Nom de la section" value={sectionName} onChange={(e) => setSectionName(e.target.value)} required />
                        </div>
                        <Button type="submit" variant="primary" icon={Plus} iconOnly />
                    </form>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                        {sections.map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-2)', background: 'var(--color-surface-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
                                <span style={{ fontWeight: 500 }}>{s.name}</span>
                                <Button variant="ghost" size="sm" icon={Trash2} iconOnly onClick={() => handleDeleteSection(s.id)} style={{ color: 'var(--color-danger-text)' }} />
                            </div>
                        ))}
                        {sections.length === 0 && <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12px' }}>Aucune section</div>}
                    </div>
                </Card>

                {/* GROUPES */}
                <Card style={{ padding: 'var(--spacing-4)', background: 'var(--color-surface-bg)' }}>
                    <h4 className="t-h6" style={{ marginBottom: 'var(--spacing-4)' }}>Groupes (ex: 1er cycle)</h4>
                    <form onSubmit={handleAddGroup} style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
                        <div style={{ flex: 1 }}>
                            <Input placeholder="Nom du groupe" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
                        </div>
                        <Button type="submit" variant="primary" icon={Plus} iconOnly />
                    </form>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                        {groups.map(g => (
                            <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-2)', background: 'var(--color-surface-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
                                <span style={{ fontWeight: 500 }}>{g.name}</span>
                                <Button variant="ghost" size="sm" icon={Trash2} iconOnly onClick={() => handleDeleteGroup(g.id)} style={{ color: 'var(--color-danger-text)' }} />
                            </div>
                        ))}
                        {groups.length === 0 && <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12px' }}>Aucun groupe</div>}
                    </div>
                </Card>

                {/* SÉRIES */}
                <Card style={{ padding: 'var(--spacing-4)', background: 'var(--color-surface-bg)' }}>
                    <h4 className="t-h6" style={{ marginBottom: 'var(--spacing-4)' }}>Séries (ex: C, TI)</h4>
                    <form onSubmit={handleAddSeries} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
                        <Input placeholder="Nom (ex: TI)" value={seriesName} onChange={(e) => setSeriesName(e.target.value)} required />
                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                            <select 
                                className="form-input" 
                                style={{ flex: 1 }}
                                value={seriesGroupId} 
                                onChange={(e) => setSeriesGroupId(e.target.value)} 
                                required
                            >
                                <option value="">Sélectionner un groupe</option>
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                            <Button type="submit" variant="primary" icon={Plus} iconOnly />
                        </div>
                    </form>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                        {series.map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-2)', background: 'var(--color-surface-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
                                <div>
                                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{s.name}</span>
                                    <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>{s.group_details?.name}</div>
                                </div>
                                <Button variant="ghost" size="sm" icon={Trash2} iconOnly onClick={() => handleDeleteSeries(s.id)} style={{ color: 'var(--color-danger-text)' }} />
                            </div>
                        ))}
                        {series.length === 0 && <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12px' }}>Aucune série</div>}
                    </div>
                </Card>
            </div>
        </Modal>
    );
};

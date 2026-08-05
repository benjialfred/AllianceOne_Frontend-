import React, { useState, useEffect } from 'react';
import { Card, Button, Input, PageHeader } from '../components';
import { api } from '../services/api';
import { Save, Download, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsPage = () => {
    const [settings, setSettings] = useState({
        school_name: '',
        motto: '',
        address: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await api.get('/settings/');
            setSettings({
                school_name: data.school_name || '',
                motto: data.motto || '',
                address: data.address || '',
                phone: data.phone || ''
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch('/settings/', settings);
            alert('Paramètres enregistrés avec succès !');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleBackup = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/core/backup/', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (!response.ok) throw new Error('Erreur HTTP');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'backup_db.sqlite3');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            alert('Erreur lors du téléchargement de la sauvegarde.');
        }
    };

    if (loading) return <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Chargement...</div>;

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Paramètres de l'école"
                subtitle="Configurez les informations générales de l'établissement."
                icon={Settings}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-8)' }}>
                <Card>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Informations Générales</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        <Input label="Nom de l'école" name="school_name" value={settings.school_name} onChange={handleChange} />
                        <Input label="Devise" name="motto" value={settings.motto} onChange={handleChange} />
                        <Input label="Adresse" name="address" value={settings.address} onChange={handleChange} />
                        <Input label="Téléphone" name="phone" value={settings.phone} onChange={handleChange} />
                        
                        <Button icon={Save} onClick={handleSave} disabled={saving} style={{ marginTop: 'var(--spacing-4)' }} fullWidth>
                            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </div>
                </Card>

                <Card>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Maintenance et Sauvegardes</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)', lineHeight: 1.5 }}>
                        Téléchargez une copie complète de la base de données actuelle pour vos archives ou en cas de problème.
                    </p>
                    <Button variant="outline" icon={Download} onClick={handleBackup}>
                        Télécharger la Sauvegarde
                    </Button>
                </Card>
            </div>
        </motion.div>
    );
};

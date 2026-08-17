import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, UserPlus } from 'lucide-react';
import { Button, Input, Wizard, Card, PageHeader } from '../components';
import { motion } from 'framer-motion';
import type { WizardStep } from '../components';;
import { api } from '../services/api';

export const StudentFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    
    const [classes, setClasses] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        sex: 'M',
        date_of_birth: '',
        place_of_birth: '',
        school_class: '',
        parent_name: '',
        parent_phone: '',
        parent_address: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const clsData = await api.get('/classes/');
                setClasses(clsData);

                if (isEditing) {
                    const student = await api.get(`/students/${id}/`);
                    setFormData({
                        first_name: student.first_name || '',
                        last_name: student.last_name || '',
                        sex: student.sex || 'M',
                        date_of_birth: student.date_of_birth || '',
                        place_of_birth: student.place_of_birth || '',
                        school_class: student.current_enrollment?.school_class_details?.id ? String(student.current_enrollment.school_class_details.id) : '',
                        parent_name: student.parent_name || '',
                        parent_phone: student.parent_phone || '',
                        parent_address: student.parent_address || ''
                    });
                }
            } catch (error) {
                console.error(error);
                alert("Erreur de chargement");
                navigate('/students');
            }
        };
        loadData();
    }, [id, isEditing, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, (formData as any)[key]);
            });
            if (photoFile) formDataToSend.append('photo', photoFile);

            let savedStudent;
            if (isEditing) {
                savedStudent = await api.put(`/students/${id}/`, formDataToSend);
            } else {
                savedStudent = await api.post('/students/', formDataToSend);
            }
            navigate(`/students/${savedStudent.id}`);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Erreur lors de l'enregistrement");
        } finally {
            setSubmitting(false);
        }
    };

    const isIdentityValid = !!(formData.first_name && formData.last_name && formData.date_of_birth && formData.place_of_birth);
    const isSchoolValid = !!(formData.school_class);
    const isParentValid = !!(formData.parent_name && formData.parent_phone);

    const getClassName = (classId: string) => {
        const cls = classes.find(c => String(c.id) === classId);
        return cls ? cls.name : 'Inconnue';
    };

    const steps: WizardStep[] = [
        {
            id: 'identity',
            label: 'Identité',
            isValid: isIdentityValid,
            content: (
                <div>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--space-6)' }}>Informations Personnelles</h3>
                    <div className="grid-2">
                        <Input name="first_name" label="Prénom" value={formData.first_name} onChange={handleChange} required />
                        <Input name="last_name" label="Nom" value={formData.last_name} onChange={handleChange} required />
                    </div>
                    <div className="grid-3">
                        <Input name="sex" label="Sexe" type="select" value={formData.sex} onChange={handleChange} required options={[
                            { value: 'M', label: 'Masculin' },
                            { value: 'F', label: 'Féminin' }
                        ]} />
                        <Input name="date_of_birth" label="Date de naissance" type="date" value={formData.date_of_birth} onChange={handleChange} required />
                        <Input name="place_of_birth" label="Lieu de naissance" value={formData.place_of_birth} onChange={handleChange} required />
                    </div>
                </div>
            )
        },
        {
            id: 'school',
            label: 'Scolarité',
            isValid: isSchoolValid,
            content: (
                <div>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--space-6)' }}>Informations Scolaires</h3>
                    <div className="grid-2">
                        <Input name="school_class" label="Classe d'affectation" type="select" value={formData.school_class} onChange={handleChange} required options={[
                            { value: '', label: '-- Sélectionner la classe --' },
                            ...classes.map(c => ({ value: String(c.id), label: c.name }))
                        ]} />
                    </div>
                    <div style={{ marginTop: 'var(--space-4)' }}>
                        <label className="t-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Photo d'identité (Optionnel)</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => { if (e.target.files?.length) setPhotoFile(e.target.files[0]); }} 
                            style={{ 
                                padding: 'var(--space-2)', 
                                border: '1px dashed var(--border-strong)', 
                                borderRadius: 'var(--radius-md)', 
                                width: '100%',
                                backgroundColor: 'var(--bg-app)'
                            }} 
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'parent',
            label: 'Responsable',
            isValid: isParentValid,
            content: (
                <div>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--space-6)' }}>Responsable Légal</h3>
                    <div className="grid-2">
                        <Input name="parent_name" label="Nom complet du tuteur" value={formData.parent_name} onChange={handleChange} required />
                        <Input name="parent_phone" label="Téléphone principal" value={formData.parent_phone} onChange={handleChange} required />
                    </div>
                    <Input name="parent_address" label="Adresse postale complète" type="textarea" value={formData.parent_address} onChange={handleChange} rows={3} />
                </div>
            )
        },
        {
            id: 'verification',
            label: 'Vérification',
            isValid: true,
            content: (
                <div>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                        <CheckCircle size={48} color="var(--color-success)" style={{ margin: '0 auto var(--space-4)' }} />
                        <h3 className="t-h2">Vérification du dossier</h3>
                        <p className="t-body">Veuillez vérifier les informations avant validation définitive.</p>
                    </div>
                    
                    <div className="grid-2" style={{ backgroundColor: 'var(--bg-app)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                        <div>
                            <p className="t-label">Élève</p>
                            <p className="t-title">{formData.first_name} {formData.last_name}</p>
                            <p className="t-body">Né(e) le {formData.date_of_birth} à {formData.place_of_birth}</p>
                        </div>
                        <div>
                            <p className="t-label">Scolarité</p>
                            <p className="t-body">Classe : {getClassName(formData.school_class)}</p>
                        </div>
                        <div style={{ marginTop: 'var(--space-4)' }}>
                            <p className="t-label">Contact Urgence</p>
                            <p className="t-title">{formData.parent_name}</p>
                            <p className="t-body">{formData.parent_phone}</p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <motion.div className="page-transition-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <PageHeader
                title={isEditing ? 'Modifier le dossier' : 'Nouvelle Inscription'}
                subtitle="Procédure d'admission administrative."
                icon={UserPlus}
                actions={
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/students')}>Retour</Button>
                }
            />

            {submitting ? (
                <Card style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                    <h3 className="t-h2">Enregistrement en cours...</h3>
                    <p className="t-body">Veuillez patienter.</p>
                </Card>
            ) : (
                <Wizard 
                    steps={steps} 
                    onComplete={handleSubmit} 
                    onCancel={() => navigate('/students')} 
                />
            )}
        </motion.div>
    );
};

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Table, Badge, Modal, PageHeader } from '../components';
import type { Column } from '../components';
import { api } from '../services/api';
import { Edit2, Trash2, BookOpen, Save, X, ArrowRight, Users, Library } from 'lucide-react';
import { motion } from 'framer-motion';

export const ClassesPage = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [allSubjects, setAllSubjects] = useState<any[]>([]);
    const [levels, setLevels] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        section: '',
        academic_year: '',
        head_teacher: '',
        capacity: 30,
        subjects: [] as number[]
    });

    // Promotion State
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [promoSourceClass, setPromoSourceClass] = useState('');
    const [promoTargetClass, setPromoTargetClass] = useState('');
    const [promoStudents, setPromoStudents] = useState<any[]>([]);
    const [promoSelectedStudents, setPromoSelectedStudents] = useState<number[]>([]);

    useEffect(() => {
        if (promoSourceClass) {
            api.get('/students/').then(res => {
                const students = res.filter((s: any) => String(s.school_class) === promoSourceClass);
                setPromoStudents(students);
                setPromoSelectedStudents(students.map((s: any) => s.id));
            });
        } else {
            setPromoStudents([]);
            setPromoSelectedStudents([]);
        }
    }, [promoSourceClass]);

    const handlePromote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!academicYears.find(y=>y.is_active)?.id || !promoSourceClass || !promoTargetClass || promoSelectedStudents.length === 0) return;
        setSubmitting(true);
        try {
            // New Payload for PromotionEngine (via batch /process_promotions)
            const decisions = promoSelectedStudents.map(studentId => ({
                student_id: studentId,
                decision: 'PROMU',
                target_class_id: promoTargetClass
            }));
            
            const payload = {
                source_academic_year_id: academicYears.find(y=>String(y.id) === String(classes.find((c:any)=>String(c.id)===promoSourceClass)?.academic_year))?.id,
                target_academic_year_id: academicYears.find(y=>y.is_active)?.id,
                decisions: decisions
            };
            const res = await api.post('/classes/process_promotions/', payload);
            alert(`Promotion réussie: ${res.success} élève(s). Erreurs: ${res.errors?.length || 0}`);
            setShowPromotionModal(false);
            setPromoSourceClass('');
            setPromoTargetClass('');
        } catch (error: any) {
            alert(error.message || 'Erreur lors de la promotion.');
        } finally {
            setSubmitting(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [clsData, yearData, teacherData, subjectData, levelData, sectionData] = await Promise.all([
                api.get('/classes/'),
                api.get('/academic-years/'),
                api.get('/teachers/'),
                api.get('/subjects/'),
                api.get('/levels/').catch(() => []),
                api.get('/sections/').catch(() => [])
            ]);
            setClasses(clsData);
            setAcademicYears(yearData);
            setTeachers(teacherData);
            setAllSubjects(subjectData);
            setLevels(levelData);
            setSections(sectionData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (subjectId: number) => {
        setFormData(prev => {
            const subjects = prev.subjects.includes(subjectId)
                ? prev.subjects.filter(id => id !== subjectId)
                : [...prev.subjects, subjectId];
            return { ...prev, subjects };
        });
    };

    const handleEdit = (cls: any) => {
        setEditingId(cls.id);
        setFormData({
            name: cls.name || '',
            level: cls.level ? String(cls.level) : '',
            section: cls.section ? String(cls.section) : '',
            academic_year: cls.academic_year ? String(cls.academic_year) : '',
            head_teacher: cls.head_teacher ? String(cls.head_teacher) : '',
            capacity: cls.capacity || 30,
            subjects: cls.subjects || []
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', level: '', section: '', academic_year: '', head_teacher: '', capacity: 30, subjects: [] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData };
            if (!payload.head_teacher) {
                payload.head_teacher = null as any;
            }
            if (!payload.section) {
                payload.section = null as any;
            }
            if (editingId) {
                await api.put(`/classes/${editingId}/`, payload);
            } else {
                await api.post('/classes/', payload);
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
        if (!window.confirm("Supprimer cette classe ? Les élèves associés perdront leur affectation.")) return;
        try {
            await api.delete(`/classes/${id}/`);
            await fetchData();
            if (editingId === id) handleCancelEdit();
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    };

    const getTeacherName = (id: number) => {
        if (!id) return '-';
        const t = teachers.find(x => x.id === id);
        return t ? `${t.first_name} ${t.last_name}` : '-';
    };

    const filteredClasses = classes.filter(c => 
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.level_details?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns: Column<any>[] = [
        { header: 'Classe', accessor: 'name', render: (item) => <strong style={{color: 'var(--color-primary)'}}>{item.name}</strong> },
        { header: 'Niveau', accessor: 'level', render: (item) => item.level_details?.name || '-' },
        { 
            header: 'Section', 
            accessor: 'section',
            render: (item) => <Badge label={item.section_details?.name || '-'} variant="default" /> 
        },
        { header: 'Titulaire', accessor: 'head_teacher', render: (item) => getTeacherName(item.head_teacher) },
        { 
            header: 'Matières', 
            accessor: 'subjects',
            render: (item) => <Badge label={`${item.subjects?.length || 0} matière(s)`} variant="accent" /> 
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
                title="Classes & Organisation"
                subtitle="Définissez l'architecture pédagogique de l'établissement."
                icon={Library}
                actions={
                    <Button 
                        variant="primary"
                        icon={Users} 
                        onClick={() => setShowPromotionModal(true)}
                    >
                        Assistant Promotion
                    </Button>
                }
            />

            <Modal
                isOpen={showPromotionModal}
                onClose={() => setShowPromotionModal(false)}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <ArrowRight size={20} color="var(--color-primary)" />
                        <span>Assistant de Promotion de fin d'année</span>
                    </div>
                }
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
                        <Button variant="outline" onClick={() => setShowPromotionModal(false)}>Annuler</Button>
                        <Button 
                            variant="primary" 
                            onClick={handlePromote}
                            disabled={submitting || !promoSourceClass || !promoTargetClass || promoSelectedStudents.length === 0}
                            icon={Users}
                        >
                            {submitting ? 'Promotion en cours...' : 'Valider la promotion'}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                        <Input 
                            name="promoSourceClass" 
                            label="Classe de départ (Année N)" 
                            type="select" 
                            value={promoSourceClass} 
                            onChange={(e) => setPromoSourceClass(e.target.value)} 
                            required 
                            options={[
                                {value: '', label: '-- Sélectionner la classe d\'origine --'},
                                ...classes.map(c => ({ value: String(c.id), label: `${c.name} (${academicYears.find(y=>y.id===c.academic_year)?.label || ''})` }))
                            ]} 
                        />
                        <Input 
                            name="promoTargetClass" 
                            label="Classe d'arrivée (Année N+1)" 
                            type="select" 
                            value={promoTargetClass} 
                            onChange={(e) => setPromoTargetClass(e.target.value)} 
                            required 
                            options={[
                                {value: '', label: '-- Sélectionner la classe de destination --'},
                                ...classes.map(c => ({ value: String(c.id), label: `${c.name} (${academicYears.find(y=>y.id===c.academic_year)?.label || ''})` }))
                            ]} 
                        />
                    </div>

                    {promoStudents.length > 0 && (
                        <div style={{ border: '1px solid var(--color-surface-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-hover)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                                <strong style={{ color: 'var(--color-text-primary)' }}>Élèves à promouvoir ({promoSelectedStudents.length}/{promoStudents.length})</strong>
                                <label style={{ fontSize: 'var(--font-size-sm)', cursor: 'pointer', display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', color: 'var(--color-text-secondary)' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={promoSelectedStudents.length === promoStudents.length}
                                        onChange={(e) => {
                                            if (e.target.checked) setPromoSelectedStudents(promoStudents.map(s => s.id));
                                            else setPromoSelectedStudents([]);
                                        }}
                                        style={{ accentColor: 'var(--color-primary)' }}
                                    />
                                    Tout sélectionner
                                </label>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-2)', maxHeight: '200px', overflowY: 'auto', paddingRight: 'var(--spacing-2)' }}>
                                {promoStudents.map(student => (
                                    <label key={student.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={promoSelectedStudents.includes(student.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setPromoSelectedStudents([...promoSelectedStudents, student.id]);
                                                else setPromoSelectedStudents(promoSelectedStudents.filter(id => id !== student.id));
                                            }}
                                            style={{ accentColor: 'var(--color-primary)' }}
                                        />
                                        {student.first_name} {student.last_name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-8)' }}>
                <Card>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        {editingId ? <Edit2 size={18} color="var(--color-primary)" /> : <BookOpen size={18} color="var(--color-primary)" />}
                        {editingId ? 'Modifier la Classe' : 'Nouvelle Classe'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        <Input name="name" label="Nom (ex: 6e A)" value={formData.name} onChange={handleChange} required />
                        
                        <Input name="section" label="Section (Optionnel)" type="select" value={formData.section} onChange={handleChange} options={[
                            {value: '', label: '-- Aucune --'},
                            ...sections.map(s => ({ value: String(s.id), label: s.name }))
                        ]} />

                        <Input name="level" label="Niveau" type="select" value={formData.level} onChange={handleChange} required options={[
                            {value: '', label: '-- Sélectionner --'},
                            ...levels.map(l => ({ value: String(l.id), label: l.name }))
                        ]} />
                        
                        <Input name="capacity" label="Capacité d'accueil" type="number" value={String(formData.capacity)} onChange={handleChange} required />
                        
                        <Input name="academic_year" label="Année académique" type="select" value={formData.academic_year} onChange={handleChange} required options={[
                            {value: '', label: '-- Sélectionner --'},
                            ...academicYears.map(y => ({ value: String(y.id), label: y.label }))
                        ]} />

                        <Input name="head_teacher" label="Professeur Titulaire" type="select" value={formData.head_teacher} onChange={handleChange} options={[
                            {value: '', label: '-- Aucun --'},
                            ...teachers.map(t => ({ value: String(t.id), label: `${t.first_name} ${t.last_name}` }))
                        ]} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
                            <label className="t-label">Matières au programme</label>
                            <div style={{ 
                                display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-2)', 
                                maxHeight: '150px', overflowY: 'auto', padding: 'var(--spacing-3)', 
                                border: '1px solid var(--color-surface-border)', borderRadius: 'var(--radius-md)', 
                                backgroundColor: 'var(--color-surface-hover)' 
                            }}>
                                {allSubjects.map(subj => (
                                    <label key={subj.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={formData.subjects.includes(subj.id)}
                                            onChange={() => handleSubjectChange(subj.id)}
                                            style={{ accentColor: 'var(--color-primary)' }}
                                        />
                                        {subj.name}
                                    </label>
                                ))}
                                {allSubjects.length === 0 && <span style={{fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)'}}>Aucune matière créée.</span>}
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                            <Button type="submit" disabled={submitting || academicYears.length === 0} icon={Save} fullWidth>
                                {submitting ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Créer la classe')}
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
                        data={filteredClasses} 
                        keyExtractor={(item) => item.id}
                        loading={loading}
                        searchable
                        searchPlaceholder="Rechercher une classe..."
                        emptyMessage="Aucune classe trouvée."
                        pageSize={10}
                    />
                </div>
            </div>
        </motion.div>
    );
};
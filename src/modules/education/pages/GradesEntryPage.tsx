import React, { useState, useEffect } from 'react';
import { Card, Button, PageHeader } from '../components';
import { api } from '../services/api';
import { ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

export const GradesEntryPage = () => {
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    
    const [filters, setFilters] = useState({
        academic_year: '',
        school_class: '',
        subject: '',
        sequence: 'SEQ1',
        evaluation_type: 'SEQ'
    });

    const [students, setStudents] = useState<any[]>([]);
    const [grades, setGrades] = useState<{ [studentId: number]: { value: string, reason: string } }>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [ayData, clData, subData] = await Promise.all([
                    api.get('/academic-years/'),
                    api.get('/classes/'),
                    api.get('/subjects/')
                ]);
                setAcademicYears(ayData);
                setClasses(clData);
                setSubjects(subData);
                
                const activeYear = ayData.find((y: any) => y.is_active);
                if (activeYear) {
                    setFilters(prev => ({ ...prev, academic_year: activeYear.id.toString() }));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchInitialData();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const loadStudentsAndGrades = async () => {
        if (!filters.academic_year || !filters.school_class || !filters.subject) {
            alert("Veuillez sélectionner l'année, la classe et la matière.");
            return;
        }
        setLoading(true);
        try {
            const [stData, grData] = await Promise.all([
                api.get(`/students/?school_class=${filters.school_class}`),
                api.get(`/grades/?academic_year=${filters.academic_year}&subject=${filters.subject}&sequence=${filters.sequence.toLowerCase()}`)
            ]);
            
            setStudents(stData);
            
            const initialGrades: any = {};
            stData.forEach((s: any) => {
                const existingGrade = grData.find((g: any) => g.student === s.id && g.evaluation_type === filters.evaluation_type);
                initialGrades[s.id] = {
                    value: existingGrade ? existingGrade.value.toString() : '',
                    reason: ''
                };
            });
            setGrades(initialGrades);
            
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des élèves.");
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (studentId: number, field: 'value'|'reason', val: string) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: val
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const batchData = Object.keys(grades)
                .filter(studentId => grades[Number(studentId)].value !== '')
                .map(studentId => ({
                    student: Number(studentId),
                    subject: Number(filters.subject),
                    sequence: filters.sequence.toLowerCase(),
                    academic_year: Number(filters.academic_year),
                    evaluation_type: filters.evaluation_type,
                    value: grades[Number(studentId)].value,
                    reason: grades[Number(studentId)].reason
                }));

            if (batchData.length === 0) {
                alert("Aucune note à enregistrer.");
                setSaving(false);
                return;
            }

            const response = await api.post('/grades/batch/', { grades: batchData });
            alert(response.message + (response.errors?.length ? `\nErreurs: ${response.errors.join(', ')}` : ''));
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || "Erreur lors de l'enregistrement.");
        } finally {
            setSaving(false);
        }
    };

    const selectStyle: React.CSSProperties = {
        padding: 'var(--spacing-2) var(--spacing-3)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-surface-border)',
        background: 'var(--color-surface-bg)',
        color: 'var(--color-text-primary)',
        fontSize: 'var(--font-size-sm)',
        outline: 'none',
        width: '100%',
        transition: 'border-color var(--transition-fast)',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 'var(--spacing-1)',
    };

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Saisie Rapide des Notes"
                subtitle="Interface type tableau pour saisir les notes d'une classe complète."
                icon={ListChecks}
            />

            <Card style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 'var(--spacing-6)' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={labelStyle}>Année Académique</label>
                    <select name="academic_year" value={filters.academic_year} onChange={handleFilterChange} style={selectStyle}>
                        <option value="">-- Choisir --</option>
                        {academicYears.map(ay => <option key={ay.id} value={ay.id}>{ay.label}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={labelStyle}>Classe</label>
                    <select name="school_class" value={filters.school_class} onChange={handleFilterChange} style={selectStyle}>
                        <option value="">-- Choisir --</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={labelStyle}>Matière</label>
                    <select name="subject" value={filters.subject} onChange={handleFilterChange} style={selectStyle}>
                        <option value="">-- Choisir --</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} (Coef: {s.coefficient})</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={labelStyle}>Séquence / Période</label>
                    <select name="sequence" value={filters.sequence} onChange={handleFilterChange} style={selectStyle}>
                        <option value="SEQ1">Séquence 1</option>
                        <option value="SEQ2">Séquence 2</option>
                        <option value="SEQ3">Séquence 3</option>
                        <option value="SEQ4">Séquence 4</option>
                        <option value="SEQ5">Séquence 5</option>
                        <option value="SEQ6">Séquence 6</option>
                        <option value="CC">Contrôle Continu (CC)</option>
                        <option value="HEBDO">Évaluation Hebdomadaire</option>
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={labelStyle}>Type d'évaluation</label>
                    <select name="evaluation_type" value={filters.evaluation_type} onChange={handleFilterChange} style={selectStyle}>
                        <option value="SEQ">Séquentielle</option>
                        <option value="EXAM">Examen</option>
                        <option value="TD">TD</option>
                        <option value="CC">CC</option>
                    </select>
                </div>
                <div>
                    <Button onClick={loadStudentsAndGrades} disabled={loading}>{loading ? 'Chargement...' : 'Afficher'}</Button>
                </div>
            </Card>

            {students.length > 0 && (
                <Card noPadding>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text-muted)' }}>
                                    <th style={{ padding: 'var(--spacing-4)', width: '30%', fontWeight: 'var(--font-weight-medium)' }}>Élève</th>
                                    <th style={{ padding: 'var(--spacing-4)', width: '20%', fontWeight: 'var(--font-weight-medium)' }}>Note (/20)</th>
                                    <th style={{ padding: 'var(--spacing-4)', width: '50%', fontWeight: 'var(--font-weight-medium)' }}>Motif (si modification)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                        <td style={{ padding: 'var(--spacing-4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{s.first_name} {s.last_name}</td>
                                        <td style={{ padding: 'var(--spacing-4)' }}>
                                            <input 
                                                type="number" 
                                                step="0.25"
                                                min="0" max="20"
                                                value={grades[s.id]?.value || ''}
                                                onChange={(e) => handleGradeChange(s.id, 'value', e.target.value)}
                                                style={{ width: '100%', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)' }}
                                                placeholder="Ex: 15.5"
                                            />
                                        </td>
                                        <td style={{ padding: 'var(--spacing-4)' }}>
                                            <input 
                                                type="text" 
                                                value={grades[s.id]?.reason || ''}
                                                onChange={(e) => handleGradeChange(s.id, 'reason', e.target.value)}
                                                style={{ width: '100%', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)' }}
                                                placeholder="Obligatoire en cas de changement"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ padding: 'var(--spacing-6)', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-surface-border)' }}>
                        <Button onClick={handleSave} disabled={saving} size="lg">
                            {saving ? 'Enregistrement...' : 'Enregistrer toutes les notes'}
                        </Button>
                    </div>
                </Card>
            )}
        </motion.div>
    );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Input } from '../components';
import { usePlatformStore } from '../../../core/stores/platformStore';

export const TeacherGradesPage = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState<any[]>([]);
    const currentSchoolClass = usePlatformStore(s => s.currentSchoolClass);
    const [selectedClass, setSelectedClass] = useState(currentSchoolClass ? currentSchoolClass.id.toString() : '');
    const [students, setStudents] = useState<any[]>([]);
    const [grades, setGrades] = useState<{ [key: number]: number | '' }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [subjectId, setSubjectId] = useState('');
    const [evaluationType, setEvaluationType] = useState('DEVOIR1');
    const [sequence, setSequence] = useState('seq1');
    
    // Import state
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!user?.teacher_id) return;
            try {
                const response = await api.get('/classes/');
                const myClasses = response.filter((c: any) => c.head_teacher === user.teacher_id);
                setClasses(myClasses);
            } catch (error) {
                console.error("Erreur", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, [user]);

    useEffect(() => {
        if (currentSchoolClass) {
            setSelectedClass(currentSchoolClass.id.toString());
        }
    }, [currentSchoolClass]);

    useEffect(() => {
        if (!selectedClass) {
            setStudents([]);
            return;
        }
        const fetchStudents = async () => {
            try {
                const data = await api.get('/students/');
                // Filtrer par la classe sélectionnée
                const classStudents = data.filter((s: any) => 
                    s.current_enrollment?.school_class_details?.id?.toString() === selectedClass ||
                    s.enrollments?.some((e: any) => e.school_class.toString() === selectedClass)
                );
                setStudents(classStudents);
                
                // Initialiser les notes à vide
                const initialGrades: any = {};
                classStudents.forEach((s: any) => {
                    initialGrades[s.id] = '';
                });
                setGrades(initialGrades);
            } catch (error) {
                console.error("Erreur", error);
            }
        };
        fetchStudents();
    }, [selectedClass]);

    const handleGradeChange = (studentId: number, value: string) => {
        const numValue = value === '' ? '' : Number(value);
        if (numValue !== '' && (numValue < 0 || numValue > 20)) return; // Validation basique
        
        setGrades(prev => ({
            ...prev,
            [studentId]: numValue
        }));
    };

    const handleSave = async () => {
        if (!selectedClass || !subjectId) {
            alert('Veuillez sélectionner une classe et renseigner un ID de matière.');
            return;
        }
        
        setSaving(true);
        try {
            // Sauvegarder chaque note non vide
            const promises = Object.entries(grades).map(([studentId, grade]) => {
                if (grade !== '') {
                    return api.post('/grades/', {
                        student: parseInt(studentId),
                        subject: parseInt(subjectId),
                        evaluation_type: evaluationType,
                        score: grade,
                        academic_year: classes.find(c => c.id.toString() === selectedClass)?.academic_year
                    });
                }
                return Promise.resolve();
            });
            
            await Promise.all(promises);
            alert('Notes enregistrées avec succès !');
        } catch (error) {
            console.error("Erreur lors de la sauvegarde", error);
            alert('Une erreur est survenue.');
        } finally {
            setSaving(false);
        }
    };

    const handleImportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile || !selectedClass || !subjectId) {
            alert("Veuillez sélectionner une classe, spécifier l'ID matière et choisir un fichier.");
            return;
        }
        
        setImporting(true);
        try {
            const fd = new FormData();
            fd.append('file', importFile);
            const academic_year = classes.find(c => c.id.toString() === selectedClass)?.academic_year;
            fd.append('academic_year', String(academic_year));
            fd.append('school_class', selectedClass);
            fd.append('subject', subjectId);
            fd.append('sequence', sequence);
            fd.append('evaluation_type', evaluationType);

            const res = await api.post('/grades/import_grades/', fd);
            alert(res.message || 'Import terminé avec succès');
            setShowImportModal(false);
            setImportFile(null);
            // Refresh grades or students list if needed, but TeacherGradesPage is a fast-entry page
            // We can just clear the current grid.
            setGrades({});
        } catch (err: any) {
            alert(err.message || 'Erreur lors de l\'importation');
        } finally {
            setImporting(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Saisie des Notes</h2>
                    <p>Saisie en grille pour toute une classe.</p>
                </div>
            </div>

            <Card style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', padding: '1rem' }}>
                    <div>
                        <label className="form-label">Classe</label>
                        <select 
                            className="form-input" 
                            value={selectedClass} 
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="">Sélectionner une classe...</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Input 
                            label="ID Matière (ex: 1)" 
                            value={subjectId} 
                            onChange={e => setSubjectId(e.target.value)} 
                            type="number"
                        />
                    </div>
                    <div>
                        <label className="form-label">Type d'évaluation</label>
                        <select 
                            className="form-input" 
                            value={evaluationType} 
                            onChange={(e) => setEvaluationType(e.target.value)}
                        >
                            <option value="DEVOIR1">Devoir 1</option>
                            <option value="DEVOIR2">Devoir 2</option>
                            <option value="COMPOSITION">Composition</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Séquence</label>
                        <select 
                            className="form-input" 
                            value={sequence} 
                            onChange={(e) => setSequence(e.target.value)}
                        >
                            <option value="seq1">Séquence 1</option>
                            <option value="seq2">Séquence 2</option>
                            <option value="seq3">Séquence 3</option>
                            <option value="seq4">Séquence 4</option>
                            <option value="seq5">Séquence 5</option>
                            <option value="seq6">Séquence 6</option>
                        </select>
                    </div>
                </div>
                <div style={{ padding: '0 1rem 1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outline" onClick={() => setShowImportModal(true)} disabled={!selectedClass || !subjectId}>
                        Importer depuis Excel / Word
                    </Button>
                </div>
            </Card>

            {showImportModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card style={{ width: '400px', backgroundColor: 'var(--color-surface-bg)' }}>
                        <h3>Importer des notes</h3>
                        <p style={{ fontSize: '13px', color: 'gray' }}>Format attendu : Matricule (ou Nom/Prénom) en première colonne, et la note dans une autre colonne.</p>
                        <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <input type="file" accept=".xlsx,.docx" onChange={(e) => setImportFile(e.target.files?.[0] || null)} required />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <Button variant="ghost" onClick={() => setShowImportModal(false)}>Annuler</Button>
                                <Button type="submit" disabled={importing || !importFile}>{importing ? 'Importation...' : 'Importer'}</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {selectedClass && students.length > 0 && (
                <Card>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem' }}>Matricule</th>
                                <th style={{ padding: '1rem' }}>Nom de l'élève</th>
                                <th style={{ padding: '1rem' }}>Note (/20)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem' }}>{student.matricule}</td>
                                    <td style={{ padding: '1rem' }}>{student.first_name} {student.last_name}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <input 
                                            type="number" 
                                            className="form-input" 
                                            style={{ width: '100px' }}
                                            min="0" max="20" step="0.25"
                                            value={grades[student.id]}
                                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)' }}>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? 'Enregistrement...' : 'Enregistrer les notes'}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, PageHeader } from '../components';
import { api } from '../services/api';
import * as XLSX from 'xlsx';
import { FileSignature, Download, Lock, Edit2, History, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const GradesPage = () => {
    const [grades, setGrades] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Import state
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    
    const [historyData, setHistoryData] = useState<{ [gradeId: number]: any[] }>({});
    const [loadingHistoryId, setLoadingHistoryId] = useState<number | null>(null);
    
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        student: '',
        subject: '',
        teacher: '',
        value: '',
        reason: '',
        evaluation_type: 'SEQ',
        sequence: 'seq1',
        academic_year: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [grdData, stuData, subData, tchData, ayData] = await Promise.all([
                api.get('/grades/'),
                api.get('/students/'),
                api.get('/subjects/'),
                api.get('/teachers/'),
                api.get('/academic-years/')
            ]);
            setGrades(grdData);
            setStudents(stuData);
            setSubjects(subData);
            setTeachers(tchData);
            setAcademicYears(ayData);
            
            // Set default academic year if possible
            if (ayData.length > 0) {
                const currentAy = ayData.find((ay: any) => ay.is_current) || ayData[0];
                setFormData(prev => ({ ...prev, academic_year: String(currentAy.id) }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (g: any) => {
        setEditingId(g.id);
        setFormData({
            student: g.student ? String(g.student) : '',
            subject: g.subject ? String(g.subject) : '',
            teacher: g.teacher ? String(g.teacher) : '',
            value: g.value ? String(g.value) : '',
            reason: '',
            evaluation_type: g.evaluation_type || 'SEQ',
            sequence: g.sequence || 'seq1',
            academic_year: g.academic_year ? String(g.academic_year) : ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(prev => ({
            ...prev,
            student: '',
            subject: '',
            value: '',
            reason: '',
            evaluation_type: 'SEQ'
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/grades/${editingId}/`, formData);
                alert('Note mise à jour !');
            } else {
                await api.post('/grades/', formData);
                alert('Note enregistrée !');
            }
            await fetchData();
            handleCancelEdit();
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Erreur lors de l’enregistrement de la note.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Voulez-vous supprimer cette note ?")) return;
        try {
            await api.delete(`/grades/${id}/`);
            await fetchData();
            if (editingId === id) {
                handleCancelEdit();
            }
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la suppression.');
        }
    };

    const fetchHistory = async (gradeId: number) => {
        if (historyData[gradeId]) {
            // toggle off
            const newHistory = { ...historyData };
            delete newHistory[gradeId];
            setHistoryData(newHistory);
            return;
        }
        setLoadingHistoryId(gradeId);
        try {
            const data = await api.get('/grade-history/');
            // The backend doesn't have grade_id filter right now, so we filter frontend
            const gradeHist = data.filter((h: any) => h.grade === gradeId);
            setHistoryData(prev => ({ ...prev, [gradeId]: gradeHist }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingHistoryId(null);
        }
    };

    const getStudentName = (id: number) => {
        const s = students.find(x => x.id === id);
        return s ? `${s.first_name} ${s.last_name}` : 'Inconnu';
    };

    const getSubjectName = (id: number) => {
        const s = subjects.find(x => x.id === id);
        return s ? s.name : 'Inconnue';
    };

    const groupedSubjects = subjects.reduce((acc: { [key: string]: any[] }, subject) => {
        const lvl = subject.level || 'Non spécifié';
        if (!acc[lvl]) {
            acc[lvl] = [];
        }
        acc[lvl].push(subject);
        return acc;
    }, {});

    const handleExportExcel = () => {
        const exportData = grades.map(g => ({
            Élève: getStudentName(g.student),
            Matière: getSubjectName(g.subject),
            Séquence: `Seq ${g.sequence.replace('seq', '')}`,
            Type: g.evaluation_type,
            Note: g.value
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Notes");
        XLSX.writeFile(workbook, "Liste_Notes.xlsx");
    };

    const handleImportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) return;
        
        setImporting(true);
        try {
            const fd = new FormData();
            fd.append('file', importFile);
            fd.append('academic_year', formData.academic_year);
            // student is not needed since the file contains identifiers
            fd.append('subject', formData.subject);
            fd.append('teacher', formData.teacher);
            fd.append('sequence', formData.sequence);
            fd.append('evaluation_type', formData.evaluation_type);
            // we need the class ID too, so we'll need the user to select a class, or we can just pass the class ID of a selected student
            // Wait, in GradesPage, we don't have a direct class selector. Let's ask for the class.
            // Oh, the user selects a student... That's not ideal for importing a whole class. 
            // In TeacherGradesPage it's easier. Here, let's just make the user select a class for import.
            const clsId = prompt("Veuillez entrer l'ID de la classe pour cet import (ex: 1) :");
            if (!clsId) { setImporting(false); return; }
            fd.append('school_class', clsId);

            const res = await api.post('/grades/import_grades/', fd);
            alert(res.message || 'Import terminé');
            setShowImportModal(false);
            setImportFile(null);
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Erreur lors de l\'importation');
        } finally {
            setImporting(false);
        }
    };

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Saisie des Notes"
                subtitle="Enregistrement et gestion des notes d'évaluations."
                icon={FileSignature}
                actions={
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Button variant="outline" icon={Download} onClick={() => setShowImportModal(true)}>Importer Notes</Button>
                        <Button variant="outline" icon={Download} onClick={handleExportExcel}>Exporter Excel</Button>
                    </div>
                }
            />

            {showImportModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card style={{ width: '400px', backgroundColor: 'var(--color-surface-bg)' }}>
                        <h3>Importer des notes (Excel/Word)</h3>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-8)' }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                        <h3 className="t-h3" style={{ margin: 0 }}>
                            {editingId ? 'Modifier la Note' : 'Saisie Rapide'}
                        </h3>
                        {formData.academic_year && formData.sequence && (
                            <Button 
                                variant="outline" 
                                icon={Lock}
                                style={{ borderColor: 'var(--color-danger-border)', color: 'var(--color-danger-text)', padding: 'var(--spacing-2) var(--spacing-3)', fontSize: 'var(--font-size-xs)' }}
                                onClick={async () => {
                                    if(!formData.student) {
                                        alert("Veuillez sélectionner un élève (pour déduire la classe) ou utiliser la page des classes pour verrouiller.");
                                        return;
                                    }
                                    const student = students.find(s => s.id === parseInt(formData.student));
                                    if(student && window.confirm("Verrouiller la saisie pour cette classe et cette séquence ?")) {
                                        try {
                                            await api.post('/sequence-validations/toggle_lock/', {
                                                school_class: student.school_class,
                                                academic_year: formData.academic_year,
                                                sequence: formData.sequence,
                                                is_locked: true
                                            });
                                            alert("Séquence verrouillée !");
                                        } catch(e: any) {
                                            alert("Erreur lors du verrouillage.");
                                        }
                                    }
                                }}
                            >
                                Verrouiller la Séquence
                            </Button>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
                            <label className="t-label">Année Académique</label>
                            <select name="academic_year" value={formData.academic_year} onChange={handleChange} style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }} required>
                                <option value="">-- Sélectionner --</option>
                                {academicYears.map(ay => <option key={ay.id} value={ay.id}>{ay.year}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
                            <label className="t-label">Élève</label>
                            <select name="student" value={formData.student} onChange={handleChange} style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }} required>
                                <option value="">-- Sélectionner --</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
                            <label className="t-label">Matière</label>
                            <select name="subject" value={formData.subject} onChange={handleChange} style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }} required>
                                <option value="">-- Sélectionner --</option>
                                {Object.keys(groupedSubjects).map(level => (
                                    <optgroup key={level} label={level} style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text-muted)' }}>
                                        {groupedSubjects[level].map((s: any) => (
                                            <option key={s.id} value={s.id} style={{ color: 'var(--color-text-primary)', backgroundColor: 'var(--color-surface-bg)' }}>
                                                {s.name} (Coef x{s.coefficient})
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
                            <label className="t-label">Enseignant</label>
                            <select name="teacher" value={formData.teacher} onChange={handleChange} style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }} required>
                                <option value="">-- Sélectionner --</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', flex: 1 }}>
                                <label className="t-label">Séquence / Période</label>
                                <select name="sequence" value={formData.sequence} onChange={handleChange} style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }} required>
                                    <option value="seq1">Séquence 1</option>
                                    <option value="seq2">Séquence 2</option>
                                    <option value="seq3">Séquence 3</option>
                                    <option value="seq4">Séquence 4</option>
                                    <option value="seq5">Séquence 5</option>
                                    <option value="seq6">Séquence 6</option>
                                    <option value="cc">Contrôle Continu (CC)</option>
                                    <option value="hebdo">Évaluation Hebdomadaire</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', flex: 1 }}>
                                <label className="t-label">Type d'évaluation</label>
                                <select name="evaluation_type" value={formData.evaluation_type} onChange={handleChange} style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }} required>
                                    <option value="SEQ">Séquentielle</option>
                                    <option value="EXAM">Examen</option>
                                    <option value="TD">TD</option>
                                    <option value="CC">CC</option>
                                </select>
                            </div>
                        </div>

                        <Input name="value" type="number" step="0.5" min="0" max="20" label="Note ( /20 )" value={formData.value} onChange={handleChange} required />
                        
                        {editingId && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
                                <Input name="reason" type="text" label="Motif de modification (Obligatoire)" value={formData.reason} onChange={handleChange} required placeholder="Ex: Erreur de saisie, recorrection..." />
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Valider')}
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
                    <div style={{ padding: 'var(--spacing-6)', borderBottom: '1px solid var(--color-surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="t-h3" style={{ margin: 0 }}>Dernières notes saisies</h3>
                    </div>
                    {loading ? <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Chargement...</div> : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-surface-border)', color: 'var(--color-text-muted)' }}>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Élève</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Matière</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Séquence</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Type</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Note</th>
                                        <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.map((g) => (
                                        <React.Fragment key={g.id}>
                                        <tr style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-secondary)' }}>{getStudentName(g.student)}</td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-secondary)' }}>{getSubjectName(g.subject)}</td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-secondary)' }}>{g.sequence === 'hebdo' ? 'Hebdo' : g.sequence === 'cc' ? 'CC' : `Seq ${g.sequence.replace('seq', '')}`}</td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)' }}><Badge label={g.evaluation_type} variant="accent" /></td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{g.value} / 20</td>
                                            <td style={{ padding: 'var(--spacing-4) var(--spacing-6)', display: 'flex', gap: 'var(--spacing-2)' }}>
                                                <Button variant="ghost" size="sm" icon={Edit2} iconOnly title="Modifier" onClick={() => handleEdit(g)} style={{ color: 'var(--color-accent-600)' }} />
                                                <Button variant="ghost" size="sm" icon={History} title="Historique" onClick={() => fetchHistory(g.id)} />
                                                <Button variant="ghost" size="sm" icon={Trash2} iconOnly title="Supprimer" onClick={() => handleDelete(g.id)} style={{ color: 'var(--color-danger-text)' }} />
                                            </td>
                                        </tr>
                                        {historyData[g.id] && (
                                            <tr key={`hist-${g.id}`}>
                                                <td colSpan={6} style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-hover)' }}>
                                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                        <h4 style={{ margin: '0 0 var(--spacing-2) 0', color: 'var(--color-text-primary)' }}>Historique des modifications</h4>
                                                        {historyData[g.id].length === 0 ? <p>Aucune modification enregistrée.</p> : (
                                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                    <tr style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                                                        <th style={{ padding: 'var(--spacing-2)' }}>Date</th>
                                                                        <th style={{ padding: 'var(--spacing-2)' }}>Par</th>
                                                                        <th style={{ padding: 'var(--spacing-2)' }}>Ancienne</th>
                                                                        <th style={{ padding: 'var(--spacing-2)' }}>Nouvelle</th>
                                                                        <th style={{ padding: 'var(--spacing-2)' }}>Motif</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {historyData[g.id].map((h: any) => (
                                                                        <tr key={h.id} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                                                            <td style={{ padding: 'var(--spacing-2)' }}>{new Date(h.changed_at).toLocaleString()}</td>
                                                                            <td style={{ padding: 'var(--spacing-2)' }}>{h.changed_by_name || h.changed_by}</td>
                                                                            <td style={{ padding: 'var(--spacing-2)' }}>{h.old_value}</td>
                                                                            <td style={{ padding: 'var(--spacing-2)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{h.new_value}</td>
                                                                            <td style={{ padding: 'var(--spacing-2)' }}>{h.reason}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        </React.Fragment>
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

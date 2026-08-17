import React, { useState, useEffect } from 'react';
import { Card, Button, Input, PageHeader } from '../components';
import { api } from '../services/api';
import { Presentation } from 'lucide-react';
import { motion } from 'framer-motion';

export const TeacherDashboardPage = () => {
    const [activeTab, setActiveTab] = useState<'grades' | 'attendance' | 'titulaire'>('grades');
    const [loading, setLoading] = useState(false);
    
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSection, setSelectedSection] = useState('COLLEGE');
    const [selectedSequence, setSelectedSequence] = useState('seq1');
    const [selectedEvalType, setSelectedEvalType] = useState('SEQ');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    
    const [gradesData, setGradesData] = useState<{[key: number]: string}>({});
    const [attendanceData, setAttendanceData] = useState<{[key: number]: boolean}>({});

    const [classBulletin, setClassBulletin] = useState<any[]>([]);
    const [bulletinLoading, setBulletinLoading] = useState(false);
    
    useEffect(() => {
        fetchInitialData();
    }, []);
    
    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [clsRes, subRes, yearRes, stuRes, teachRes] = await Promise.all([
                api.get('/classes/'),
                api.get('/subjects/'),
                api.get('/academic-years/'),
                api.get('/students/'),
                api.get('/teachers/')
            ]);
            setClasses(clsRes);
            setSubjects(subRes);
            setAcademicYears(yearRes);
            setStudents(stuRes);
            setTeachers(teachRes);
            
            if (yearRes.length > 0) {
                const currentAy = yearRes.find((ay: any) => ay.is_current) || yearRes[0];
                setSelectedYear(String(currentAy.id));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const currentSectionClasses = classes.filter(c => c.section === selectedSection);

    const fetchGradesForSelection = async () => {
        if (!selectedClass || !selectedSubject || !selectedYear || !selectedSequence || !selectedEvalType) return;
        setLoading(true);
        try {
            const res = await api.get(`/grades/?academic_year=${selectedYear}&subject=${selectedSubject}&sequence=${selectedSequence}&evaluation_type=${selectedEvalType}`);
            const gradesMap: {[key: number]: string} = {};
            res.forEach((g: any) => {
                gradesMap[g.student] = String(g.value);
            });
            setGradesData(gradesMap);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceForSelection = async () => {
        if (!selectedClass || !selectedDate || !selectedYear || !selectedSequence) return;
        setLoading(true);
        try {
            const res = await api.get(`/attendances/?academic_year=${selectedYear}&date=${selectedDate}&sequence=${selectedSequence}`);
            const attMap: {[key: number]: boolean} = {};
            res.forEach((a: any) => {
                attMap[a.student] = a.is_absent;
            });
            setAttendanceData(attMap);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'grades') fetchGradesForSelection();
    }, [selectedClass, selectedSubject, selectedYear, selectedSequence, selectedEvalType, activeTab]);

    useEffect(() => {
        if (activeTab === 'attendance') fetchAttendanceForSelection();
    }, [selectedClass, selectedDate, selectedYear, selectedSequence, activeTab]);

    const handleGradeChange = (studentId: number, val: string) => {
        setGradesData(prev => ({...prev, [studentId]: val}));
    };

    const handleAttendanceChange = (studentId: number, isAbsent: boolean) => {
        setAttendanceData(prev => ({...prev, [studentId]: isAbsent}));
    };

    const saveGrades = async () => {
        if (!selectedTeacher) {
            alert('Veuillez sélectionner l\'enseignant qui dépose la note.');
            return;
        }
        setLoading(true);
        const payload = Object.entries(gradesData).filter(([_, v]) => v !== '').map(([studentId, val]) => ({
            student: parseInt(studentId),
            subject: parseInt(selectedSubject),
            teacher: parseInt(selectedTeacher),
            academic_year: parseInt(selectedYear),
            sequence: selectedSequence,
            evaluation_type: selectedEvalType,
            value: parseFloat(val)
        }));
        try {
            await api.post('/grades/batch/', { grades: payload });
            alert('Notes enregistrées avec succès.');
        } catch (e: any) {
            alert('Erreur: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const saveAttendance = async () => {
        setLoading(true);
        const currentClassStudents = students.filter(s => String(s.current_enrollment?.school_class_details?.id) === selectedClass);
        const payload = currentClassStudents.map(student => ({
            student: student.id,
            date: selectedDate,
            academic_year: parseInt(selectedYear),
            sequence: selectedSequence,
            is_absent: !!attendanceData[student.id]
        }));
        try {
            await api.post('/attendances/batch/', { attendances: payload });
            alert('Appel enregistré avec succès.');
        } catch (e: any) {
            alert('Erreur: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const generateClassBulletin = async () => {
        if (!selectedClass || !selectedYear || !selectedSequence) {
            alert("Sélectionnez l'année, la classe et la séquence.");
            return;
        }
        setBulletinLoading(true);
        const currentClassStudents = students.filter(s => String(s.current_enrollment?.school_class_details?.id) === selectedClass);
        try {
            const results = await Promise.all(
                currentClassStudents.map(async (student) => {
                    const res = await api.get(`/grades/bulletin/?student_id=${student.id}&academic_year_id=${selectedYear}&sequence=${selectedSequence}`);
                    return { student, bulletin: res };
                })
            );
            // Sort by general average descending
            results.sort((a, b) => (b.bulletin.general_average || 0) - (a.bulletin.general_average || 0));
            setClassBulletin(results);
        } catch (e: any) {
            alert("Erreur lors de la génération: " + e.message);
        } finally {
            setBulletinLoading(false);
        }
    };

    const currentClassStudents = selectedClass ? students.filter(s => String(s.current_enrollment?.school_class_details?.id) === selectedClass) : [];
    const selectedClassObj = classes.find(c => String(c.id) === selectedClass);

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Espace Enseignant"
                subtitle="Saisie des notes, appels et gestion de vos classes."
                icon={Presentation}
            />

            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', overflowX: 'auto' }}>
                <Button variant={activeTab === 'grades' ? 'primary' : 'ghost'} onClick={() => setActiveTab('grades')}>Registre des Notes</Button>
                <Button variant={activeTab === 'attendance' ? 'primary' : 'ghost'} onClick={() => setActiveTab('attendance')}>Registre d'Appel (Absences)</Button>
                <Button variant={activeTab === 'titulaire' ? 'primary' : 'ghost'} onClick={() => setActiveTab('titulaire')}>Espace Titulaire</Button>
            </div>
            
            <Card style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Année Académique</label>
                    <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
                        <option value="">Sélectionner</option>
                        {academicYears.map(y => <option key={y.id} value={y.id}>{y.label}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Section</label>
                    <select value={selectedSection} onChange={e => {setSelectedSection(e.target.value); setSelectedClass('');}} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
                        <option value="PRIMAIRE">Primaire</option>
                        <option value="COLLEGE">Collège</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Classe</label>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
                        <option value="">Sélectionner la classe</option>
                        {currentSectionClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Séquence</label>
                    <select value={selectedSequence} onChange={e => setSelectedSequence(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
                        {[1,2,3,4,5,6].map(s => <option key={s} value={`seq${s}`}>Séquence {s}</option>)}
                    </select>
                </div>
                {activeTab === 'grades' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Matière</label>
                            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
                                <option value="">Sélectionner</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Type Évaluation</label>
                            <select value={selectedEvalType} onChange={e => setSelectedEvalType(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
                                <option value="SEQ">Séquentielle</option>
                                <option value="EXAM">Examen</option>
                                <option value="TD">TD</option>
                                <option value="CC">CC</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Enseignant (Vous)</label>
                            <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
                                <option value="">Sélectionner</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                            </select>
                        </div>
                    </>
                )}
                {activeTab === 'attendance' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date du jour</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }} />
                    </div>
                )}
            </Card>

            {activeTab === 'grades' && (
                <Card noPadding>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Registre des notes</h3>
                        <Button onClick={saveGrades} disabled={loading || !selectedClass || !selectedSubject}>Sauvegarder les notes</Button>
                    </div>
                    {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Élève</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, width: '200px' }}>Note (/20)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClassStudents.map((student) => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{student.first_name} {student.last_name}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <input 
                                                type="number" step="0.5" min="0" max="20"
                                                value={gradesData[student.id] || ''}
                                                onChange={e => handleGradeChange(student.id, e.target.value)}
                                                style={{ padding: '0.5rem', width: '100px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {currentClassStudents.length === 0 && (
                                    <tr><td colSpan={2} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Veuillez sélectionner une classe.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </Card>
            )}

            {activeTab === 'attendance' && (
                <Card noPadding>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Registre d'appel</h3>
                        <Button onClick={saveAttendance} disabled={loading || !selectedClass}>Sauvegarder l'appel</Button>
                    </div>
                    {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Élève</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, width: '150px' }}>Absent ?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClassStudents.map((student) => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{student.first_name} {student.last_name}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <input 
                                                type="checkbox"
                                                checked={!!attendanceData[student.id]}
                                                onChange={e => handleAttendanceChange(student.id, e.target.checked)}
                                                style={{ width: '20px', height: '20px', accentColor: 'var(--color-accent)' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {currentClassStudents.length === 0 && (
                                    <tr><td colSpan={2} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Veuillez sélectionner une classe.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </Card>
            )}

            {activeTab === 'titulaire' && (
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Génération des Bulletins ({selectedClassObj?.name || 'Aucune classe'})</h3>
                        <Button onClick={generateClassBulletin} disabled={bulletinLoading || !selectedClass}>Calculer Moyennes</Button>
                    </div>

                    {!selectedClassObj?.head_teacher && selectedClass ? (
                        <p style={{ color: 'var(--color-warning)' }}>Attention : Cette classe n'a pas de professeur titulaire assigné.</p>
                    ) : null}

                    {bulletinLoading ? <p>Génération en cours...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {classBulletin.map((res, idx) => (
                                <div key={res.student.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{idx + 1}. {res.student.first_name} {res.student.last_name}</h4>
                                        <span style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>{res.bulletin.general_average} / 20</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total points: {res.bulletin.total_points} | Coefs: {res.bulletin.total_coef} | Absences: {res.bulletin.absences_count || 0}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}
        </motion.div>
    );
};

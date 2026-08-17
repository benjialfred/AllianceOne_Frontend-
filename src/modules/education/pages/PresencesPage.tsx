import React, { useState, useEffect } from 'react';
import { Card, Button, Input, PageHeader, Badge } from '../components';
import { api } from '../services/api';
import { Clock, Search, Save, UserCheck, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatformStore } from '../../../core/stores/platformStore';

export const PresencesPage = () => {
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    
    // Default date is today
    const today = new Date().toISOString().split('T')[0];

    const currentSchoolClass = usePlatformStore(s => s.currentSchoolClass);

    const [filters, setFilters] = useState({
        academic_year: '',
        school_class: currentSchoolClass ? currentSchoolClass.id.toString() : '',
        date: today,
        sequence: 'SEQ1',
    });

    const [students, setStudents] = useState<any[]>([]);
    const [attendances, setAttendances] = useState<{ [studentId: number]: { is_absent: boolean, reason: string } }>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [ayData, clData] = await Promise.all([
                    api.get('/academic-years/'),
                    api.get('/classes/')
                ]);
                setAcademicYears(ayData);
                setClasses(clData);
                
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

    // Sync if global context changes
    useEffect(() => {
        if (currentSchoolClass) {
            setFilters(prev => ({ ...prev, school_class: currentSchoolClass.id.toString() }));
        }
    }, [currentSchoolClass]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const loadStudentsAndAttendances = async () => {
        if (!filters.academic_year || !filters.school_class || !filters.date) {
            alert("Veuillez sélectionner l'année, la classe et la date.");
            return;
        }
        setLoading(true);
        try {
            const [stData, attData] = await Promise.all([
                api.get(`/students/?school_class=${filters.school_class}`),
                api.get(`/attendances/?academic_year=${filters.academic_year}&date=${filters.date}&sequence=${filters.sequence}`)
            ]);
            
            // Expected student array either directly or in results
            const studentsArray = Array.isArray(stData) ? stData : stData.results || [];
            const attArray = Array.isArray(attData) ? attData : attData.results || [];

            setStudents(studentsArray);

            const attMap: { [key: number]: { is_absent: boolean, reason: string } } = {};
            
            // Par défaut, tous présents
            studentsArray.forEach((s: any) => {
                attMap[s.id] = { is_absent: false, reason: '' };
            });

            // Surcharge avec les données existantes
            attArray.forEach((a: any) => {
                if (attMap[a.student]) {
                    attMap[a.student] = { is_absent: a.is_absent, reason: a.reason || '' };
                }
            });

            setAttendances(attMap);
        } catch (error) {
            console.error("Erreur lors du chargement", error);
            alert("Erreur lors du chargement des données. Veuillez vérifier la connexion.");
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (studentId: number, is_absent: boolean) => {
        setAttendances(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], is_absent }
        }));
    };

    const handleReasonChange = (studentId: number, reason: string) => {
        setAttendances(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], reason }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        const payload = Object.keys(attendances).map(stId => ({
            student: parseInt(stId),
            date: filters.date,
            academic_year: parseInt(filters.academic_year),
            sequence: filters.sequence,
            is_absent: attendances[parseInt(stId)].is_absent,
            reason: attendances[parseInt(stId)].reason
        }));

        try {
            const res = await api.post('/attendances/batch/', { attendances: payload });
            alert(res.message || "Appel enregistré avec succès !");
        } catch (error: any) {
            console.error("Erreur de sauvegarde", error);
            alert(error.response?.data?.error || "Erreur lors de l'enregistrement de l'appel.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div className="page-transition-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <PageHeader
                title="Présences"
                subtitle="Faire l'appel et gérer les absences des élèves."
                icon={Clock}
            />

            <Card>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', alignItems: 'end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                        <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>Année Académique</label>
                        <select name="academic_year" value={filters.academic_year} onChange={handleFilterChange} className="premium-input" style={{ width: '100%', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
                            <option value="">Sélectionner...</option>
                            {academicYears.map(y => <option key={y.id} value={y.id}>{y.label}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                        <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>Classe</label>
                        <select name="school_class" value={filters.school_class} onChange={handleFilterChange} className="premium-input" style={{ width: '100%', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
                            <option value="">Sélectionner...</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                        <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>Séquence</label>
                        <select name="sequence" value={filters.sequence} onChange={handleFilterChange} className="premium-input" style={{ width: '100%', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
                            <option value="SEQ1">Séquence 1</option>
                            <option value="SEQ2">Séquence 2</option>
                            <option value="SEQ3">Séquence 3</option>
                            <option value="SEQ4">Séquence 4</option>
                            <option value="SEQ5">Séquence 5</option>
                            <option value="SEQ6">Séquence 6</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                        <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>Date</label>
                        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="premium-input" style={{ width: '100%', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }} />
                    </div>

                    <Button icon={Search} onClick={loadStudentsAndAttendances} disabled={loading} style={{ height: '38px' }}>
                        {loading ? 'Chargement...' : 'Afficher'}
                    </Button>
                </div>
            </Card>

            <AnimatePresence>
                {students.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card noPadding style={{ overflow: 'hidden' }}>
                            <div style={{ padding: 'var(--spacing-4) var(--spacing-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                                <h3 className="t-h4" style={{ margin: 0 }}>Fiche d'Appel</h3>
                                <Badge label={`${students.length} Élèves`} variant="info" />
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)' }}>
                                            <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Élève</th>
                                            <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Statut</th>
                                            <th style={{ padding: 'var(--spacing-4) var(--spacing-6)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>Motif (si absent)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(s => {
                                            const att = attendances[s.id] || { is_absent: false, reason: '' };
                                            return (
                                                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-surface-border)', backgroundColor: att.is_absent ? 'var(--color-danger-bg)' : 'transparent', transition: 'background-color var(--transition-normal)' }}>
                                                    <td style={{ padding: 'var(--spacing-4) var(--spacing-6)' }}>
                                                        <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{s.first_name} {s.last_name}</div>
                                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Matricule: {s.matricule || 'N/A'}</div>
                                                    </td>
                                                    <td style={{ padding: 'var(--spacing-4) var(--spacing-6)' }}>
                                                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                                                            <button
                                                                onClick={() => handleAttendanceChange(s.id, false)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)',
                                                                    padding: 'var(--spacing-1) var(--spacing-3)',
                                                                    borderRadius: 'var(--radius-full)',
                                                                    border: '1px solid',
                                                                    borderColor: !att.is_absent ? 'var(--color-success)' : 'var(--color-surface-border)',
                                                                    backgroundColor: !att.is_absent ? 'var(--color-success-bg)' : 'transparent',
                                                                    color: !att.is_absent ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                                                    cursor: 'pointer',
                                                                    fontWeight: !att.is_absent ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                                                                    transition: 'all var(--transition-fast)'
                                                                }}
                                                            >
                                                                <UserCheck size={14} />
                                                                Présent
                                                            </button>
                                                            <button
                                                                onClick={() => handleAttendanceChange(s.id, true)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)',
                                                                    padding: 'var(--spacing-1) var(--spacing-3)',
                                                                    borderRadius: 'var(--radius-full)',
                                                                    border: '1px solid',
                                                                    borderColor: att.is_absent ? 'var(--color-error)' : 'var(--color-surface-border)',
                                                                    backgroundColor: att.is_absent ? 'var(--color-danger-bg)' : 'transparent',
                                                                    color: att.is_absent ? 'var(--color-error)' : 'var(--color-text-secondary)',
                                                                    cursor: 'pointer',
                                                                    fontWeight: att.is_absent ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                                                                    transition: 'all var(--transition-fast)'
                                                                }}
                                                            >
                                                                <UserX size={14} />
                                                                Absent
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: 'var(--spacing-4) var(--spacing-6)' }}>
                                                        {att.is_absent ? (
                                                            <input
                                                                type="text"
                                                                placeholder="Motif (ex: Maladie, Retard...)"
                                                                value={att.reason}
                                                                onChange={(e) => handleReasonChange(s.id, e.target.value)}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: 'var(--spacing-2) var(--spacing-3)',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    border: '1px solid var(--color-danger-border)',
                                                                    backgroundColor: 'var(--color-surface-card)',
                                                                    color: 'var(--color-text-primary)',
                                                                    outline: 'none',
                                                                    fontSize: 'var(--font-size-sm)'
                                                                }}
                                                            />
                                                        ) : (
                                                            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ padding: 'var(--spacing-4) var(--spacing-6)', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                                <Button icon={Save} onClick={handleSave} disabled={saving || students.length === 0}>
                                    {saving ? 'Enregistrement...' : 'Enregistrer l\'appel'}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {students.length === 0 && !loading && filters.academic_year && filters.school_class && (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-muted)' }}>
                    Sélectionnez les filtres et cliquez sur "Afficher".
                </div>
            )}
        </motion.div>
    );
};

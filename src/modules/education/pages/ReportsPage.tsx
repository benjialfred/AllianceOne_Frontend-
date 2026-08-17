import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components';
import { Sparkline } from '../components/Sparkline';
import { PremiumBulletin } from '../components/PremiumBulletin';
import { api } from '../services/api';
import { FileText, Download, Users, User, Loader, Eye, Printer } from 'lucide-react';
import { PageHeader } from '../components';
import { motion } from 'framer-motion';
import { usePlatformStore } from '../../../core/stores/platformStore';

export function ReportsPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState<string | null>(null);
    
    // Preview data
    const [previewData, setPreviewData] = useState<any>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    
    const currentSchoolClass = usePlatformStore(s => s.currentSchoolClass);

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSection, setSelectedSection] = useState('COLLEGE');
    const [selectedClass, setSelectedClass] = useState(currentSchoolClass ? String(currentSchoolClass.id) : '');
    const [selectedSequence, setSelectedSequence] = useState('trim1');
    const [selectedStudent, setSelectedStudent] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Load preview when student changes
    useEffect(() => {
        if (selectedStudent && selectedYear && selectedSequence && selectedSequence !== 'hebdo') {
            loadPreview();
        } else {
            setPreviewData(null);
        }
    }, [selectedStudent, selectedYear, selectedSequence]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [clsRes, yearRes, stuRes] = await Promise.all([
                api.get('/classes/'),
                api.get('/academic-years/'),
                api.get('/students/')
            ]);
            setClasses(clsRes);
            setAcademicYears(yearRes);
            setStudents(stuRes);
            
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

    // Sync with global class context
    useEffect(() => {
        if (currentSchoolClass) {
            setSelectedClass(String(currentSchoolClass.id));
        }
    }, [currentSchoolClass]);

    const loadPreview = async () => {
        setLoadingPreview(true);
        try {
            const data = await api.get(`/grades/bulletin/?student_id=${selectedStudent}&academic_year_id=${selectedYear}&sequence=${selectedSequence}`);
            setPreviewData(data);
        } catch (error) {
            console.error(error);
            setPreviewData(null);
        } finally {
            setLoadingPreview(false);
        }
    };

    const currentSectionClasses = classes.filter(c => c.section === selectedSection);
    const currentClassStudents = selectedClass ? students.filter(s => String(s.current_enrollment?.school_class_details?.id) === selectedClass) : [];

    const handleDownload = async (path: string, label: string) => {
        setDownloading(label);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`http://127.0.0.1:8000/api${path}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erreur de téléchargement');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const disposition = res.headers.get('content-disposition');
            let filename = 'document.pdf';
            if (disposition && disposition.indexOf('filename=') !== -1) {
                const matches = /filename="([^"]*)"/.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1];
            }
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch(e) {
            console.error(e);
            alert("Erreur lors de la génération du document.");
        } finally {
            setDownloading(null);
        }
    };

    const selectStyle: React.CSSProperties = {
        padding: 'var(--spacing-3) var(--spacing-4)',
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
        fontSize: 'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 'var(--spacing-1)',
    };

    const getSelectedClassName = () => {
        const c = classes.find(x => String(x.id) === selectedClass);
        return c ? c.name : '';
    };

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Contrôle Documentaire & Impressions"
                subtitle="Génération des bulletins PDF et cartes scolaires avec logo, signatures et données complètes."
                icon={Printer}
            />

            {/* Filters Bar */}
            <Card style={{ marginBottom: 'var(--spacing-6)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-4)', alignItems: 'end' }}>
                    <div>
                        <div style={labelStyle}>Année Académique</div>
                        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={selectStyle}>
                            <option value="">Sélectionner</option>
                            {academicYears.map(y => <option key={y.id} value={y.id}>{y.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <div style={labelStyle}>Section</div>
                        <select value={selectedSection} onChange={e => {setSelectedSection(e.target.value); setSelectedClass(''); setSelectedStudent('');}} style={selectStyle}>
                            <option value="PRIMAIRE">Primaire</option>
                            <option value="COLLEGE">Collège</option>
                        </select>
                    </div>
                    <div>
                        <div style={labelStyle}>Classe</div>
                        <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudent(''); }} style={selectStyle}>
                            <option value="">Sélectionner</option>
                            {currentSectionClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <div style={labelStyle}>Séquence / Période</div>
                        <select value={selectedSequence} onChange={e => setSelectedSequence(e.target.value)} style={selectStyle}>
                            <optgroup label="Trimestre 1">
                                <option value="trim1">Bulletin Trimestre 1</option>
                                <option value="seq1">Séquence 1</option>
                                <option value="seq2">Séquence 2</option>
                            </optgroup>
                            <optgroup label="Trimestre 2">
                                <option value="trim2">Bulletin Trimestre 2</option>
                                <option value="seq3">Séquence 3</option>
                                <option value="seq4">Séquence 4</option>
                            </optgroup>
                            <optgroup label="Trimestre 3">
                                <option value="trim3">Bulletin Trimestre 3</option>
                                <option value="seq5">Séquence 5</option>
                            </optgroup>
                            <optgroup label="Autres Évaluations">
                                <option value="cc">Contrôle Continu (CC)</option>
                                <option value="hebdo">Évaluations Hebdomadaires (Ne compte pas)</option>
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <div style={labelStyle}>Élève (individuel)</div>
                        <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} style={selectStyle} disabled={!selectedClass}>
                            <option value="">Tous les élèves de la classe</option>
                            {currentClassStudents.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Preview + Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
                {/* Bulletin Actions */}
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)' }}>
                        <FileText size={20} color="var(--color-accent-500)" />
                        <h3 className="t-h3" style={{ margin: 0 }}>Bulletins de Notes PDF</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        <Button 
                            variant="primary" 
                            icon={Users}
                            disabled={!selectedYear || !selectedClass || downloading === 'class-bulletin' || selectedSequence === 'hebdo'}
                            onClick={() => handleDownload(
                                `/reports/bulletins/class/${selectedClass}/?academic_year_id=${selectedYear}&sequence=${selectedSequence}`,
                                'class-bulletin'
                            )}
                        >
                            {downloading === 'class-bulletin' ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Loader size={14} className="spin" /> Génération en cours...
                                </span>
                            ) : (
                                `Imprimer pour toute la classe${selectedClass ? ` (${getSelectedClassName()})` : ''}`
                            )}
                        </Button>
                        <Button 
                            variant="secondary" 
                            icon={User}
                            disabled={!selectedYear || !selectedStudent || downloading === 'student-bulletin' || selectedSequence === 'hebdo'}
                            onClick={() => handleDownload(
                                `/reports/bulletins/student/${selectedStudent}/?academic_year_id=${selectedYear}&sequence=${selectedSequence}`,
                                'student-bulletin'
                            )}
                        >
                            {downloading === 'student-bulletin' ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Loader size={14} className="spin" /> Génération...
                                </span>
                            ) : (
                                `Imprimer pour cet élève (PDF)`
                            )}
                        </Button>
                        <Button 
                            variant="secondary" 
                            icon={User}
                            disabled={!selectedYear || !selectedStudent || !previewData || selectedSequence === 'hebdo'}
                            onClick={() => {
                                window.print();
                            }}
                        >
                            Imprimer l'Aperçu (Haute Qualité)
                        </Button>
                    </div>

                    <div style={{ marginTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-surface-border)', paddingTop: 'var(--spacing-6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
                            <Download size={20} color="var(--color-accent-500)" />
                            <h3 className="t-h3" style={{ margin: 0 }}>Cartes Scolaires</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                            <Button 
                                variant="primary" 
                                icon={Users}
                                disabled={!selectedYear || !selectedClass || downloading === 'class-card'}
                                onClick={() => handleDownload(
                                    `/cards/class/${selectedClass}/?academic_year_id=${selectedYear}`,
                                    'class-card'
                                )}
                            >
                                {downloading === 'class-card' ? 'Génération...' : 'Cartes pour toute la classe'}
                            </Button>
                            <Button 
                                variant="secondary" 
                                icon={User}
                                disabled={!selectedYear || !selectedStudent || downloading === 'student-card'}
                                onClick={() => handleDownload(
                                    `/cards/student/${selectedStudent}/?academic_year_id=${selectedYear}`,
                                    'student-card'
                                )}
                            >
                                {downloading === 'student-card' ? 'Génération...' : 'Carte individuelle'}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Preview Panel */}
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
                        <Eye size={20} color="var(--color-accent-500)" />
                        <h3 className="t-h3" style={{ margin: 0 }}>Aperçu du Bulletin</h3>
                    </div>

                    {!selectedStudent ? (
                        <div style={{ 
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: 'var(--spacing-10)', color: 'var(--color-text-tertiary)', textAlign: 'center',
                            border: '2px dashed var(--color-surface-border)', borderRadius: 'var(--radius-lg)',
                            backgroundColor: 'var(--color-surface-bg)'
                        }}>
                            <FileText size={48} style={{ marginBottom: 'var(--spacing-4)', opacity: 0.3 }} />
                            <p style={{ fontSize: 'var(--font-size-sm)' }}>
                                Sélectionnez un élève pour voir l'aperçu de son bulletin avant impression.
                            </p>
                        </div>
                    ) : selectedSequence === 'hebdo' ? (
                        <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                            Les évaluations hebdomadaires ne génèrent pas de bulletin officiel.
                        </div>
                    ) : loadingPreview ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--spacing-10)', color: 'var(--color-text-tertiary)' }}>
                            <Loader size={32} className="spin" style={{ marginBottom: 'var(--spacing-4)' }} />
                            <p>Chargement de l'aperçu...</p>
                        </div>
                    ) : previewData ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                            {/* Student name */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>
                                        {previewData.student_full_name}
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        {previewData.student_matricule} · {previewData.student_class_name}
                                    </div>
                                </div>
                                <Badge 
                                    label={previewData.mention} 
                                    variant={previewData.general_average >= 14 ? 'success' : previewData.general_average >= 10 ? 'warning' : 'danger'} 
                                />
                            </div>

                            {/* Key stats grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-3)' }}>
                                {[
                                    { label: 'Moyenne', value: `${previewData.general_average}/20`, color: previewData.general_average >= 10 ? 'var(--color-success-text)' : 'var(--color-danger-text)' },
                                    { label: 'Rang', value: previewData.rank_label, color: 'var(--color-accent-600)' },
                                    { label: 'Moy. Classe', value: `${previewData.class_average}/20`, color: 'var(--color-text-secondary)' },
                                    { label: 'Moy. Trim.', value: `${previewData.moy_trim}/20`, color: 'var(--color-text-primary)' },
                                ].map((stat, i) => (
                                    <div key={i} style={{
                                        padding: 'var(--spacing-3)',
                                        backgroundColor: 'var(--color-surface-bg)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'center',
                                        border: '1px solid var(--color-surface-border)',
                                    }}>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>{stat.label}</div>
                                        <div style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)', color: stat.color }}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Class comparison */}
                            <div style={{ 
                                display: 'flex', justifyContent: 'space-between', 
                                padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-bg)', 
                                borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)',
                                border: '1px solid var(--color-surface-border)', color: 'var(--color-text-secondary)'
                            }}>
                                <span>🏆 Plus haute : <strong>{previewData.class_max}/20</strong></span>
                                <span>📉 Plus basse : <strong>{previewData.class_min}/20</strong></span>
                                <span>👥 Effectif : <strong>{previewData.class_total_students}</strong></span>
                            </div>

                            {/* Progression Curve */}
                            <div style={{
                                padding: 'var(--spacing-4)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--color-surface-bg)',
                                border: '1px solid var(--color-surface-border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                                        Courbe de Progression
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        Évolution de la moyenne (Séquences & Trimestre)
                                    </div>
                                </div>
                                <Sparkline 
                                    data={[previewData.seq1_avg, previewData.seq2_avg, previewData.moy_trim]} 
                                    width={120} 
                                    height={40} 
                                    color="var(--color-accent-500)"
                                />
                            </div>

                            {/* Decision */}
                            <div style={{
                                padding: 'var(--spacing-4)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: previewData.general_average >= 10 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                                border: `1px solid ${previewData.general_average >= 10 ? 'var(--color-success-border)' : 'var(--color-danger-border)'}`,
                            }}>
                                <div style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                                    Décision du Conseil
                                </div>
                                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                    {previewData.decision}
                                </div>
                            </div>

                            {/* Absences */}
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Absences enregistrées : <strong style={{ color: 'var(--color-text-primary)' }}>{previewData.absences_count}</strong></span>
                                <span>Séq. 1 : <strong style={{ color: 'var(--color-text-primary)' }}>{previewData.seq1_avg}</strong> · Séq. 2 : <strong style={{ color: 'var(--color-text-primary)' }}>{previewData.seq2_avg}</strong></span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                            Aucune donnée de bulletin disponible pour cet élève.
                        </div>
                    )}
                </Card>
            </div>
            {/* Hidden printable bulletin */}
            <PremiumBulletin data={previewData} />
        </motion.div>
    );
}
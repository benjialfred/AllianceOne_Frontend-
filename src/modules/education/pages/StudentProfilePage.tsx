import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Phone, MapPin, Download, FileText, User, GraduationCap, Shield } from 'lucide-react';
import { Card, Button, Badge, Tabs, PageHeader } from '../components';
import { motion } from 'framer-motion';
import { api } from '../services/api';

export const StudentProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<any>(null);
    const [attendances, setAttendances] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [tuitionProfile, setTuitionProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const data = await api.get(`/students/${id}/`);
                setStudent(data);
                
                const [attData, gradesData, financeData] = await Promise.all([
                    api.get(`/attendances/?student=${id}`).catch(()=>[]),
                    api.get(`/grades/?student=${id}`).catch(()=>[]),
                    api.get(`/tuition-profiles/?student=${id}`).catch(()=>[])
                ]);
                
                setAttendances(attData || []);
                setGrades(gradesData || []);
                if (financeData && financeData.length > 0) {
                    setTuitionProfile(financeData[0]);
                }
            } catch (error) {
                console.error(error);
                navigate('/students');
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet élève ? Toutes ses notes seront perdues.")) return;
        try {
            await api.delete(`/students/${id}/`);
            navigate('/students');
        } catch (error: any) {
            alert(error.message);
        }
    };

    if (loading) return (
        <div style={{ padding: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--color-text-tertiary)' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--color-surface-border)', borderTopColor: 'var(--color-accent-500)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 'var(--spacing-4)' }} />
            Chargement du dossier...
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
    if (!student) return null;

    const tabs = [
        {
            id: 'identity',
            label: 'Identité',
            icon: User,
            content: (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                        <Card>
                            <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Informations Personnelles</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
                                <div>
                                    <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Prénom</div>
                                    <div className="t-body" style={{ color: 'var(--color-text-primary)' }}>{student.first_name}</div>
                                </div>
                                <div>
                                    <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Nom</div>
                                    <div className="t-body" style={{ color: 'var(--color-text-primary)' }}>{student.last_name}</div>
                                </div>
                                <div>
                                    <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Sexe</div>
                                    <div className="t-body" style={{ color: 'var(--color-text-primary)' }}>{student.sex === 'M' ? 'Masculin' : 'Féminin'}</div>
                                </div>
                                <div>
                                    <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Date de naissance</div>
                                    <div className="t-body" style={{ color: 'var(--color-text-primary)' }}>{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('fr-FR') : '-'}</div>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Lieu de naissance</div>
                                    <div className="t-body" style={{ color: 'var(--color-text-primary)' }}>{student.place_of_birth || '-'}</div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Photo d'identité</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-8)' }}>
                                <div style={{ 
                                    width: '160px', height: '160px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-hover)', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', border: '1px solid var(--color-surface-border)',
                                    overflow: 'hidden'
                                }}>
                                    {student.photo ? (
                                        <img src={student.photo} alt={`Photo de ${student.first_name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <>{student.first_name?.[0]}{student.last_name?.[0]}</>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )
        },
        {
            id: 'school',
            label: 'Scolarité & Résultats',
            icon: GraduationCap,
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                    <Card>
                        <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Dossier Académique</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-10)' }}>
                            <div>
                                <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Matricule</div>
                                <div className="t-title">{student.matricule}</div>
                            </div>
                            <div>
                                <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Classe actuelle</div>
                                <Badge label={student.current_enrollment?.school_class_details?.name || 'Non affecté'} variant="info" />
                            </div>
                            <div>
                                <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Statut</div>
                                <Badge label={student.lifecycle_status} variant="success" />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Présences & Absences</h3>
                        <div style={{ display: 'flex', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
                            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: '120px', border: '1px solid var(--color-danger-border)' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger-text)' }}>
                                    {attendances.filter(a => a.is_absent).length}
                                </div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger-text)', opacity: 0.8 }}>Absences</div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Résultats et Évaluations</h3>
                        {grades.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--color-surface-border)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Matière</th>
                                            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Note</th>
                                            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Coefficient</th>
                                            <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grades.map(g => (
                                            <tr key={g.id} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{g.subject_details?.name || 'Matière'}</td>
                                                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{g.value} / 20</td>
                                                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)' }}>{g.subject_details?.coefficient || 1}</td>
                                                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)' }}>{(parseFloat(g.value) * (g.subject_details?.coefficient || 1)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ padding: 'var(--spacing-10)', textAlign: 'center', color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-surface-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-surface-border)' }}>
                                <FileText size={48} style={{ opacity: 0.2, margin: '0 auto var(--spacing-4) auto' }} />
                                <p className="t-body">Aucune note enregistrée pour cet élève.</p>
                                <Button variant="outline" style={{ marginTop: 'var(--spacing-4)' }} onClick={() => navigate('/grades')}>Saisir des notes</Button>
                            </div>
                        )}
                    </Card>
                    <Card>
                        <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Historique des Inscriptions</h3>
                        {student.enrollments && student.enrollments.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                                {student.enrollments.map((enrollment: any) => (
                                    <div key={enrollment.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                            {enrollment.academic_year_details?.start_year}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{enrollment.school_class_details?.name}</div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Année {enrollment.academic_year_details?.label}</div>
                                        </div>
                                        <Badge label={enrollment.decision} variant={enrollment.decision === 'PROMU' ? 'success' : enrollment.decision === 'REDOUBLE' ? 'warning' : 'info'} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ color: 'var(--color-text-secondary)' }}>Aucun historique.</div>
                        )}
                    </Card>
                </div>
            )
        },
        {
            id: 'finance',
            label: 'Finances',
            icon: FileText,
            content: (
                <Card>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Situation Financière (Pension)</h3>
                    {tuitionProfile ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
                            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--color-surface-border)' }}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Total Attendu</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{parseFloat(tuitionProfile.total_amount).toLocaleString()} FCFA</div>
                            </div>
                            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--color-success-border)' }}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success-text)' }}>Total Payé</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-success-text)' }}>{parseFloat(tuitionProfile.total_paid || 0).toLocaleString()} FCFA</div>
                            </div>
                            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--color-danger-border)' }}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger-text)' }}>Reste à Payer</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-danger-text)' }}>{parseFloat(tuitionProfile.remaining_amount || 0).toLocaleString()} FCFA</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: 'var(--spacing-10)', textAlign: 'center', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-surface-border)' }}>
                            Aucun profil financier trouvé pour cette année. 
                            <br/><br/>
                            <Button variant="outline" onClick={() => navigate('/finance')}>Gérer dans Finances</Button>
                        </div>
                    )}
                </Card>
            )
        },
        {
            id: 'guardian',
            label: 'Responsable Légal',
            icon: Shield,
            content: (
                <Card>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Contact d'Urgence et Tuteur</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
                        <div>
                            <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Nom complet</div>
                            <div className="t-title">{student.parent_name || 'Non renseigné'}</div>
                        </div>
                        <div>
                            <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Téléphone</div>
                            <div className="t-body" style={{ color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                <Phone size={16} color="var(--color-text-tertiary)" />
                                {student.parent_phone || 'N/A'}
                            </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <div className="t-label" style={{ marginBottom: 'var(--spacing-1)' }}>Adresse postale</div>
                            <div className="t-body" style={{ color: 'var(--color-text-primary)', display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)' }}>
                                <MapPin size={16} color="var(--color-text-tertiary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>{student.parent_address || 'Aucune adresse renseignée'}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            )
        }
    ];

    return (
        <motion.div className="page-transition-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <PageHeader
                title={`${student.first_name} ${student.last_name}`}
                subtitle="Dossier Numérique de l'Élève"
                icon={User}
                badge={student.matricule}
                actions={
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/students')}>Retour</Button>
                        <Button variant="outline" icon={Download}>Générer Certificat</Button>
                        <Button variant="secondary" icon={Edit2} iconOnly title="Modifier" onClick={() => navigate(`/students/${id}/edit`)} />
                        <Button variant="danger" icon={Trash2} iconOnly title="Supprimer" onClick={handleDelete} />
                    </div>
                }
            />

            <Tabs tabs={tabs} defaultTabId="identity" />
        </motion.div>
    );
};

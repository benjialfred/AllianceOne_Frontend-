import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Printer, Trash2, DollarSign, Users, Upload, ArrowLeft, BookOpen } from 'lucide-react';
import { Button, Table, Badge, Input, PageHeader, Card, Modal, ClassActivityFeed } from '../components';
import type { Column, TableAction } from '../components';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import * as XLSX from 'xlsx';
import { usePlatformStore } from '../../../core/stores/platformStore';

export const StudentsPage = () => {
    const navigate = useNavigate();
    
    // Global Context
    const currentSchoolClass = usePlatformStore(s => s.currentSchoolClass);
    const setCurrentSchoolClass = usePlatformStore(s => s.setCurrentSchoolClass);

    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showArchived, setShowArchived] = useState(false);
    const [importing, setImporting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentStudent, setPaymentStudent] = useState<any>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [activeYearId, setActiveYearId] = useState<number | null>(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (currentSchoolClass) {
            fetchStudents();
        } else {
            setLoading(false);
        }
    }, [showArchived, currentSchoolClass]);

    const fetchClasses = async () => {
        try {
            const data = await api.get('/classes/');
            setClasses(data);
            
            const years = await api.get('/academic-years/');
            const active = years.find((y: any) => y.is_active);
            if (active) setActiveYearId(active.id);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            let url = `/students/?is_archived=${showArchived}`;
            if (currentSchoolClass) {
                url += `&school_class=${currentSchoolClass.id}`;
            }
            const data = await api.get(url);
            setStudents(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const getClassName = (student: any) => {
        if (student.current_enrollment && student.current_enrollment.school_class_details) {
            return student.current_enrollment.school_class_details.name;
        }
        return 'Non Inscrit';
    };

    const handleExportExcel = () => {
        const exportData = students.map(s => ({
            Matricule: s.matricule,
            Nom: s.last_name,
            Prénom: s.first_name,
            Sexe: s.sex,
            'Date de Naissance': s.date_of_birth,
            'Lieu de Naissance': s.place_of_birth,
            Classe: getClassName(s),
            'Nom Parent': s.parent_name,
            'Téléphone Parent': s.parent_phone
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Eleves");
        XLSX.writeFile(workbook, "Liste_Eleves.xlsx");
    };

    const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setImporting(true);
        try {
            const response = await api.post('/students/import_excel/', formData);
            alert(response.message);
            if (response.errors && response.errors.length > 0) {
                console.error("Erreurs d'import:", response.errors);
                alert(`Il y a eu ${response.errors.length} erreur(s). Voir la console pour les détails.`);
            }
            if (currentSchoolClass) await fetchStudents();
        } catch (error: any) {
            console.error('Erreur import:', error);
            alert(error.response?.data?.error || "Erreur lors de l'import.");
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const columns: Column<any>[] = [
        { header: 'Matricule', accessor: 'matricule', width: '120px' },
        { 
            header: 'Nom complet', 
            accessor: 'first_name',
            render: (item) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', overflow: 'hidden' }}>
                        {item.photo ? (
                            <img src={item.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <>{item.first_name?.[0]}{item.last_name?.[0]}</>
                        )}
                    </div>
                    <div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{item.first_name} {item.last_name}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{item.sex === 'M' ? 'Garçon' : 'Fille'}</div>
                    </div>
                </div>
            ) 
        },
        { 
            header: 'Responsable', 
            accessor: 'parent_name',
            render: (item) => (
                <div>
                    <div>{item.parent_name || '-'}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{item.parent_phone || '-'}</div>
                </div>
            ) 
        }
    ];

    const handleRestore = async (id: number) => {
        if (!window.confirm("Voulez-vous restaurer cet élève ?")) return;
        try {
            await api.post(`/students/${id}/restore/`, {});
            if (currentSchoolClass) await fetchStudents();
            alert("Élève restauré avec succès.");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la restauration.");
        }
    };

    const handleDelete = async (selected: any[]) => {
        if (!window.confirm(`Voulez-vous vraiment supprimer ${selected.length} élève(s) ?`)) return;
        try {
            for (const s of selected) {
                await api.delete(`/students/${s.id}/`);
            }
            if (currentSchoolClass) await fetchStudents();
            alert("Suppression effectuée.");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression.");
        }
    };

    const handlePaymentAction = async (selected: any[]) => {
        if (selected.length !== 1) {
            alert("Veuillez sélectionner un seul élève à la fois pour le paiement.");
            return;
        }
        setPaymentStudent(selected[0]);
        setPaymentModalOpen(true);
    };

    const submitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeYearId || !paymentStudent) {
            alert("Année académique active introuvable ou élève non sélectionné.");
            return;
        }
        try {
            const profiles = await api.get(`/tuition-profiles/?academic_year=${activeYearId}&student=${paymentStudent.id}`);
            let profileId = null;
            if (profiles.length > 0) {
                profileId = profiles[0].id;
            } else {
                const totalStr = prompt("Cet élève n'a pas encore de profil financier pour cette année. Quel est le montant total de la pension ?");
                if (!totalStr) return;
                const newProfile = await api.post('/tuition-profiles/', {
                    student: paymentStudent.id,
                    academic_year: activeYearId,
                    total_amount: parseFloat(totalStr)
                });
                profileId = newProfile.id;
            }

            await api.post('/payments/', {
                tuition_profile: profileId,
                amount: parseFloat(paymentAmount)
            });

            alert("Paiement enregistré avec succès. Consultez l'onglet Finances pour l'historique et les reçus.");
            setPaymentModalOpen(false);
            setPaymentAmount('');
            setPaymentStudent(null);
        } catch (error: any) {
            alert("Erreur: " + (error.response?.data?.error || error.message));
        }
    };

    const actions: TableAction<any>[] = [
        {
            label: "Enregistrer Paiement",
            icon: DollarSign,
            variant: "primary",
            onClick: handlePaymentAction
        },
        {
            label: "Imprimer Cartes",
            icon: Printer,
            variant: "outline",
            onClick: (selected) => alert(`Impression des cartes pour ${selected.length} élève(s)`)
        },
        showArchived ? {
            label: "Restaurer",
            icon: Plus,
            variant: "primary",
            onClick: (selected) => handleRestore(selected[0].id)
        } : {
            label: "Supprimer",
            icon: Trash2,
            variant: "danger",
            onClick: handleDelete
        }
    ];

    // --- Render logic: Switch between Class Selector and Class Detail ---
    if (!currentSchoolClass) {
        return (
            <motion.div className="page-transition-wrapper">
                <PageHeader
                    title="Classes & Salles"
                    subtitle="Sélectionnez une salle pour accéder à ses élèves et à l'activité correspondante."
                    icon={BookOpen}
                    actions={
                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                            <Button variant="outline" icon={Users} onClick={() => navigate('/students/all')}>Vue globale (Tous les élèves)</Button>
                        </div>
                    }
                />

                {loading ? (
                    <div style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Chargement des classes...</div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                        gap: 'var(--spacing-6)' 
                    }}>
                        {classes.map(c => (
                            <motion.div 
                                key={c.id}
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCurrentSchoolClass(c)}
                                style={{
                                    backgroundColor: 'var(--color-surface-bg)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: 'var(--spacing-6)',
                                    border: '1px solid var(--color-surface-border)',
                                    boxShadow: 'var(--shadow-sm)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--spacing-4)',
                                    transition: 'border-color var(--transition-fast)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>{c.name}</h3>
                                    <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-primary-bg)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
                                        <BookOpen size={20} />
                                    </div>
                                </div>
                                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                    Capacité : {c.capacity || 'Non définie'}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="ghost" size="sm">Entrer &rarr;</Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div className="page-transition-wrapper">
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <Button variant="ghost" icon={ArrowLeft} onClick={() => setCurrentSchoolClass(null)} style={{ paddingLeft: 0 }}>
                    Retour aux classes
                </Button>
            </div>

            <PageHeader
                title={`Salle : ${currentSchoolClass.name}`}
                subtitle={`Gestion des élèves de la classe et journal d'activité de la salle.`}
                icon={Users}
                badge={`${students.length} Élèves`}
                actions={
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Button variant="outline" onClick={() => setShowArchived(!showArchived)}>
                            {showArchived ? 'Voir les actifs' : 'Voir la corbeille'}
                        </Button>
                        <input 
                            type="file" 
                            accept=".xlsx" 
                            style={{ display: 'none' }} 
                            ref={fileInputRef} 
                            onChange={handleImportExcel} 
                        />
                        <Button variant="outline" icon={Upload} onClick={() => fileInputRef.current?.click()} disabled={importing}>
                            {importing ? 'Importation...' : 'Importer'}
                        </Button>
                        <Button variant="outline" icon={Download} onClick={handleExportExcel}>Exporter</Button>
                        <Button variant="primary" icon={Plus} onClick={() => navigate('/students/new')}>Nouvel Élève</Button>
                    </div>
                }
            />

            <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'flex-start' }}>
                <div style={{ flex: 3 }}>
                    <Table 
                        columns={columns} 
                        data={students} 
                        keyExtractor={(item) => item.id}
                        loading={loading}
                        searchable={true}
                        searchPlaceholder="Rechercher par matricule, nom, responsable..."
                        selectable={true}
                        actions={actions}
                        onRowClick={(item) => navigate(`/students/${item.id}`)}
                        emptyMessage="Aucun élève trouvé dans cette classe."
                        pageSize={15}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '300px', position: 'sticky', top: '24px' }}>
                    <ClassActivityFeed classId={currentSchoolClass.id} className={currentSchoolClass.name} />
                </div>
            </div>

            <Modal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                title="Paiement de Frais"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
                        <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>Annuler</Button>
                        <Button variant="primary" onClick={submitPayment}>Valider le versement</Button>
                    </div>
                }
            >
                {paymentStudent && (
                    <div style={{ padding: 'var(--spacing-4) 0' }}>
                        <p style={{ marginBottom: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            Enregistrement du versement pour l'élève <strong style={{ color: 'var(--color-text-primary)' }}>{paymentStudent.first_name} {paymentStudent.last_name}</strong>.
                        </p>
                        <Input 
                            label="Montant du versement (FCFA)" 
                            type="number" 
                            min="0" 
                            value={paymentAmount} 
                            onChange={e => setPaymentAmount(e.target.value)} 
                            required 
                        />
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};
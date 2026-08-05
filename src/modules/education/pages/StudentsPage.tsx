import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Printer, Trash2, DollarSign, X, Users, Upload } from 'lucide-react';
import { Button, Table, Badge, Input, PageHeader, Card, Modal } from '../components';
import type { Column, TableAction } from '../components';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import * as XLSX from 'xlsx';

export const StudentsPage = () => {
    const navigate = useNavigate();
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

    const [selectedClassId, setSelectedClassId] = useState<number | 'all'>('all');

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [showArchived, selectedClassId]);

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
            if (selectedClassId !== 'all') {
                url += `&school_class=${selectedClassId}`;
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
            await fetchStudents();
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
            accessor: 'first_name', // Used for internal sorting/searching
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
            header: 'Classe', 
            accessor: 'current_enrollment',
            render: (item) => <Badge label={getClassName(item)} variant={getClassName(item) === 'Non Inscrit' ? 'warning' : 'info'} /> 
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
            await fetchStudents();
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
            await fetchStudents();
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

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Élèves"
                subtitle="Gestion des inscriptions, dossiers et effectifs."
                icon={Users}
                badge={`${students.length} Élèves (Année Active)`}
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

            <Card style={{ marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                <span style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>Filtrer par classe :</span>
                <select 
                    value={selectedClassId} 
                    onChange={e => setSelectedClassId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    style={{ 
                        padding: 'var(--spacing-2) var(--spacing-4)', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-surface-border)',
                        backgroundColor: 'var(--color-surface-bg)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-sm)',
                        minWidth: '200px',
                        outline: 'none'
                    }}
                >
                    <option value="all">Toutes les classes</option>
                    {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </Card>

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
                emptyMessage="Aucun élève trouvé."
                pageSize={15}
            />

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
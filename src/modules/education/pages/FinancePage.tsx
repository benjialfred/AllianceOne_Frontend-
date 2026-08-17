import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Tabs } from '../components';
import type { Column, TableAction } from '../components';
import { api, API_BASE_URL } from '../services/api';
import { FileText, X, CreditCard, Download, Plus, Bell } from 'lucide-react';
import { PageHeader } from '../components';
import { motion } from 'framer-motion';

export const FinancePage = () => {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [filters, setFilters] = useState({
        academic_year: '',
        school_class: ''
    });

    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    
    // Payment Modal State
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('ESP');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [paymentSubmitting, setPaymentSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL');

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

    useEffect(() => {
        if (filters.academic_year && filters.school_class) {
            fetchProfiles();
        } else {
            setProfiles([]); // Clear profiles if no class selected
        }
    }, [filters.academic_year, filters.school_class]);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            let url = `/tuition-profiles/?academic_year=${filters.academic_year}&student__school_class=${filters.school_class}`;
            const data = await api.get(url);
            setProfiles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const printReceipt = (paymentId: number) => {
        const url = `${API_BASE_URL.replace('/api', '')}/api/finance/receipt/${paymentId}/`;
        const token = localStorage.getItem('token');
        
        fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `Recu_${paymentId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(console.error);
    };

    const openHistory = (profile: any) => {
        setSelectedProfile(profile);
        setHistoryModalOpen(true);
    };

    const openPaymentModal = (profile: any) => {
        setSelectedProfile(profile);
        setPaymentAmount('');
        setPaymentMethod('ESP');
        setReferenceNumber('');
        setPaymentModalOpen(true);
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
            alert("Veuillez entrer un montant valide.");
            return;
        }
        
        setPaymentSubmitting(true);
        try {
            const res = await api.post('/payments/', {
                tuition_profile: selectedProfile.id,
                amount: Number(paymentAmount),
                payment_method: paymentMethod,
                reference_number_trans: referenceNumber
            });
            
            setPaymentModalOpen(false);
            fetchProfiles(); // Refresh the data
            
            // Auto-download receipt
            if (res.id) {
                printReceipt(res.id);
            }
        } catch (error: any) {
            alert("Erreur lors de l'enregistrement du paiement: " + error.message);
        } finally {
            setPaymentSubmitting(false);
        }
    };

    const handleSendReminder = async (profileId: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir envoyer une relance de paiement (Simulation) ?")) return;
        try {
            const res = await api.post(`/tuition-profiles/${profileId}/send_reminder/`);
            alert(res.success || "Relance envoyée");
        } catch(e: any) {
            alert(e.message || "Erreur lors de l'envoi de la relance");
        }
    };

    const filteredProfiles = profiles.filter(p => {
        const remaining = parseFloat(p.remaining_amount);
        if (activeTab === 'PAID') return remaining <= 0;
        if (activeTab === 'UNPAID') return remaining > 0;
        return true;
    });

    const columns: Column<any>[] = [
        {
            header: "Élève",
            accessor: "student_details.first_name",
            render: (item) => (
                <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                    {item.student_details?.first_name} {item.student_details?.last_name}
                </div>
            )
        },
        {
            header: "Total Attendu",
            accessor: "total_amount",
            render: (item) => `${parseFloat(item.total_amount).toLocaleString()} FCFA`
        },
        {
            header: "Total Payé",
            accessor: "total_paid",
            render: (item) => (
                <span style={{ color: 'var(--color-success-text)', fontWeight: 'var(--font-weight-medium)' }}>
                    {parseFloat(item.total_paid).toLocaleString()} FCFA
                </span>
            )
        },
        {
            header: "Reste à Payer",
            accessor: "remaining_amount",
            render: (item) => {
                const remaining = parseFloat(item.remaining_amount);
                return (
                    <span style={{ color: remaining > 0 ? 'var(--color-danger-text)' : 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                        {remaining.toLocaleString()} FCFA
                    </span>
                );
            }
        },
        {
            header: "Progression",
            accessor: "progress",
            sortable: false,
            render: (item) => {
                const percent = item.total_amount > 0 ? (item.total_paid / item.total_amount) * 100 : 0;
                return (
                    <div style={{ width: '100px', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <progress value={item.total_paid} max={item.total_amount} style={{ width: '100%', height: '8px', accentColor: 'var(--color-primary)' }}></progress>
                        <span style={{ fontSize: 'var(--font-size-xs)' }}>{Math.round(percent)}%</span>
                    </div>
                );
            }
        }
    ];

    const tableActions: TableAction<any>[] = [
        {
            label: "Encaisser",
            icon: Plus,
            variant: "primary",
            onClick: (selected) => {
                if(selected.length === 1) openPaymentModal(selected[0]);
                else alert("Sélectionnez un seul élève pour encaisser.");
            }
        },
        {
            label: "Voir Historique",
            icon: FileText,
            variant: "outline",
            onClick: (selected) => {
                if(selected.length === 1) openHistory(selected[0]);
                else alert("Sélectionnez un seul élève à la fois pour voir l'historique.");
            }
        },
        {
            label: "Relancer",
            icon: Bell,
            variant: "ghost",
            onClick: (selected) => {
                if(selected.length === 1) {
                    if (parseFloat(selected[0].remaining_amount) > 0) {
                        handleSendReminder(selected[0].id);
                    } else {
                        alert("Cet élève est déjà en règle.");
                    }
                }
                else alert("Sélectionnez un seul élève pour envoyer une relance.");
            }
        }
    ];

    return (
        <motion.div className="page-transition-wrapper">
            <PageHeader
                title="Finances & Pensions"
                subtitle="Tableau de bord financier par classe et impression des reçus."
                icon={CreditCard}
                actions={
                    <>
                        <Button variant="outline" icon={Download}>Exporter Rapport</Button>
                    </>
                }
            />

            <Card style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'flex-end', marginBottom: 'var(--spacing-6)', backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ flex: 1 }}>
                    <label className="t-label" style={{ marginBottom: 'var(--spacing-2)' }}>Année Académique</label>
                    <select name="academic_year" value={filters.academic_year} onChange={handleFilterChange} style={{ width: '100%', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }}>
                        {academicYears.map(ay => <option key={ay.id} value={ay.id}>{ay.label}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label className="t-label" style={{ marginBottom: 'var(--spacing-2)' }}>Classe</label>
                    <select name="school_class" value={filters.school_class} onChange={handleFilterChange} style={{ width: '100%', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }}>
                        <option value="">-- Sélectionnez une classe --</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </Card>

            {!filters.school_class ? (
                <div style={{ padding: 'var(--spacing-12)', textAlign: 'center', backgroundColor: 'var(--color-surface-bg)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-surface-border)', color: 'var(--color-text-tertiary)' }}>
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-2)' }}>Sélectionnez une classe</h3>
                    <p>Veuillez choisir une classe ci-dessus pour afficher l'état financier de ses élèves.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    <Tabs
                        tabs={[
                            { id: 'ALL', label: 'Tous les profils' },
                            { id: 'PAID', label: 'En Règle (Soldé)' },
                            { id: 'UNPAID', label: 'Impayés' }
                        ]}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                    <Table 
                        columns={columns}
                        data={filteredProfiles}
                    keyExtractor={(item) => item.id}
                    loading={loading}
                    searchable={true}
                    searchPlaceholder="Rechercher un élève..."
                    emptyMessage="Aucun profil financier trouvé pour cette classe."
                    actions={tableActions}
                    onRowClick={(item) => openHistory(item)}
                    pageSize={20}
                />
                </div>
            )}

            <Modal
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                title={`Historique : ${selectedProfile?.student_details?.first_name} ${selectedProfile?.student_details?.last_name}`}
                size="lg"
            >
                {selectedProfile && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)' }}>
                            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--color-surface-border)' }}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Attendu</div>
                                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{parseFloat(selectedProfile.total_amount).toLocaleString()}</div>
                            </div>
                            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--color-success-border)' }}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success-text)', textTransform: 'uppercase' }}>Total Payé</div>
                                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-success-text)' }}>{parseFloat(selectedProfile.total_paid || 0).toLocaleString()}</div>
                            </div>
                            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--color-danger-border)' }}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger-text)', textTransform: 'uppercase' }}>Reste à Payer</div>
                                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-danger-text)' }}>{parseFloat(selectedProfile.remaining_amount || 0).toLocaleString()}</div>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto', border: '1px solid var(--color-surface-border)', borderRadius: 'var(--radius-md)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-surface-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                                        <th style={{ padding: 'var(--spacing-3)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Date</th>
                                        <th style={{ padding: 'var(--spacing-3)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>N° Reçu</th>
                                        <th style={{ padding: 'var(--spacing-3)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Montant</th>
                                        <th style={{ padding: 'var(--spacing-3)', textAlign: 'right', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProfile.payments?.map((payment: any) => (
                                        <tr key={payment.id} style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
                                            <td style={{ padding: 'var(--spacing-3)', color: 'var(--color-text-primary)' }}>{new Date(payment.date).toLocaleString()}</td>
                                            <td style={{ padding: 'var(--spacing-3)', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{payment.receipt_number}</td>
                                            <td style={{ padding: 'var(--spacing-3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{parseFloat(payment.amount).toLocaleString()} FCFA</td>
                                            <td style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>
                                                <Button variant="outline" size="sm" onClick={() => printReceipt(payment.id)}>
                                                    Imprimer PDF
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!selectedProfile.payments || selectedProfile.payments.length === 0) && (
                                        <tr><td colSpan={4} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucun paiement enregistré pour le moment.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                title="Nouveau Paiement"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
                        <Button type="button" variant="ghost" onClick={() => setPaymentModalOpen(false)}>Annuler</Button>
                        <Button type="submit" variant="primary" loading={paymentSubmitting} onClick={handlePaymentSubmit}>Valider & Imprimer</Button>
                    </div>
                }
            >
                {selectedProfile && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', paddingTop: 'var(--spacing-2)' }}>
                        <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)' }}>
                            <p style={{ margin: '0 0 var(--spacing-2) 0', color: 'var(--color-text-secondary)' }}>
                                Élève : <strong style={{ color: 'var(--color-text-primary)' }}>{selectedProfile.student_details?.first_name} {selectedProfile.student_details?.last_name}</strong>
                            </p>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                                Reste à payer : <strong style={{ color: 'var(--color-danger-text)' }}>{parseFloat(selectedProfile.remaining_amount || 0).toLocaleString()} FCFA</strong>
                            </p>
                        </div>

                        <form onSubmit={handlePaymentSubmit} id="payment-form">
                            <div>
                                <label className="t-label" style={{ display: 'block', marginBottom: 'var(--spacing-2)' }}>Montant versé (FCFA)</label>
                                <input 
                                    type="number" 
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Ex: 50000"
                                    min="1"
                                    max={selectedProfile.remaining_amount > 0 ? selectedProfile.remaining_amount : undefined}
                                    style={{ width: '100%', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', fontSize: 'var(--font-size-base)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none', marginBottom: 'var(--spacing-4)' }}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="t-label" style={{ display: 'block', marginBottom: 'var(--spacing-2)' }}>Moyen de Paiement</label>
                                <select 
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ width: '100%', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', fontSize: 'var(--font-size-base)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none', marginBottom: 'var(--spacing-4)' }}
                                >
                                    <option value="ESP">Espèces</option>
                                    <option value="MOMO">Mobile Money</option>
                                    <option value="VIR">Virement Bancaire</option>
                                    <option value="CHQ">Chèque</option>
                                </select>
                            </div>

                            <div>
                                <label className="t-label" style={{ display: 'block', marginBottom: 'var(--spacing-2)' }}>Référence (Optionnel)</label>
                                <input 
                                    type="text" 
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    placeholder="N° Transaction MoMo, N° Chèque..."
                                    style={{ width: '100%', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', fontSize: 'var(--font-size-base)', backgroundColor: 'var(--color-surface-bg)', color: 'var(--color-text-primary)', outline: 'none' }}
                                />
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};

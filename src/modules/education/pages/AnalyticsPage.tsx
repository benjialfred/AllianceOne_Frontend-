import React, { useState, useEffect } from 'react';
import { Card, PageHeader } from '../components';
import { api } from '../services/api';
import { Activity, Users, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalPayments: 0,
        actionsCount: 0,
        studentsPerClass: [] as { name: string, count: number, percent: number }[],
        recentActions: [] as { action: string, count: number, percent: number }[]
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                // Fetch data in parallel
                const [studentsRes, classesRes, logsRes, paymentsRes] = await Promise.all([
                    api.get('/students/'),
                    api.get('/classes/'),
                    api.get('/audit-logs/'), // Assumes this endpoint exists and returns array
                    api.get('/payments/')
                ]);

                // Process Students per Class
                const classCounts: Record<string, number> = {};
                classesRes.forEach((c: any) => classCounts[c.name] = 0);
                studentsRes.forEach((s: any) => {
                    const cName = s.school_class?.name;
                    if (cName) {
                        classCounts[cName] = (classCounts[cName] || 0) + 1;
                    }
                });

                const totalStudents = studentsRes.length || 1; // avoid div by 0
                const studentsPerClass = Object.entries(classCounts)
                    .map(([name, count]) => ({ name, count, percent: (count / totalStudents) * 100 }))
                    .sort((a, b) => b.count - a.count);

                // Process Actions (Audit Logs)
                const actionCounts: Record<string, number> = { 'CREATE': 0, 'UPDATE': 0, 'DELETE': 0 };
                let totalActions = 0;
                if (Array.isArray(logsRes)) {
                    logsRes.forEach((log: any) => {
                        const a = log.action;
                        if (actionCounts[a] !== undefined) {
                            actionCounts[a]++;
                            totalActions++;
                        }
                    });
                } else if (logsRes.results) {
                    logsRes.results.forEach((log: any) => {
                        const a = log.action;
                        if (actionCounts[a] !== undefined) {
                            actionCounts[a]++;
                            totalActions++;
                        }
                    });
                }
                
                totalActions = totalActions || 1;
                const recentActions = Object.entries(actionCounts)
                    .map(([action, count]) => ({ action, count, percent: (count / totalActions) * 100 }));

                // Total Payments
                const totalPayments = Array.isArray(paymentsRes) ? paymentsRes.reduce((acc, p) => acc + parseFloat(p.amount), 0) : 0;

                setStats({
                    totalStudents: studentsRes.length,
                    totalPayments,
                    actionsCount: totalActions === 1 && actionCounts['CREATE'] === 0 ? 0 : totalActions,
                    studentsPerClass,
                    recentActions
                });

            } catch (error) {
                console.error("Erreur lors de la récupération des statistiques:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div style={{ padding: 'var(--spacing-16)', textAlign: 'center' }}>Chargement de l'analytique...</div>;
    }

    return (
        <motion.div className="page-transition-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <PageHeader
                title="Vue Analytique"
                subtitle="Tableau de bord statistique et suivi des activités."
                icon={BarChart3}
            />

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                <Card className="interactive-element" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)', borderLeft: '4px solid var(--color-primary)' }}>
                    <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-full)' }}>
                        <Users size={24} color="var(--color-primary)" />
                    </div>
                    <div>
                        <div className="t-subtitle" style={{ fontSize: 'var(--font-size-sm)' }}>Effectif Total</div>
                        <div className="t-h1">{stats.totalStudents} <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-normal)', color: 'var(--color-text-tertiary)' }}>élèves</span></div>
                    </div>
                </Card>
                <Card className="interactive-element" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)', borderLeft: '4px solid var(--color-success)' }}>
                    <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-full)' }}>
                        <DollarSign size={24} color="var(--color-success)" />
                    </div>
                    <div>
                        <div className="t-subtitle" style={{ fontSize: 'var(--font-size-sm)' }}>Volume Financier</div>
                        <div className="t-h1">{stats.totalPayments.toLocaleString()} <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-normal)', color: 'var(--color-text-tertiary)' }}>FCFA</span></div>
                    </div>
                </Card>
                <Card className="interactive-element" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)', borderLeft: '4px solid var(--color-warning)' }}>
                    <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-warning-bg)', borderRadius: 'var(--radius-full)' }}>
                        <Activity size={24} color="var(--color-warning)" />
                    </div>
                    <div>
                        <div className="t-subtitle" style={{ fontSize: 'var(--font-size-sm)' }}>Actions Système</div>
                        <div className="t-h1">{stats.actionsCount} <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-normal)', color: 'var(--color-text-tertiary)' }}>enregistrements</span></div>
                    </div>
                </Card>
            </div>

            {/* Native CSS Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-6)' }}>
                <Card className="card-hover">
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <PieChart size={18} /> Répartition des Élèves par Classe
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        {stats.studentsPerClass.map((item, idx) => (
                            <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)' }}>
                                    <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{item.name}</span>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>{item.count} élèves ({Math.round(item.percent)}%)</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                    <div 
                                        style={{ 
                                            width: `${item.percent}%`, 
                                            height: '100%', 
                                            backgroundColor: `hsl(220, 70%, ${50 - idx * 5}%)`,
                                            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }} 
                                    />
                                </div>
                            </div>
                        ))}
                        {stats.studentsPerClass.length === 0 && <div style={{ color: 'var(--color-text-muted)' }}>Aucune donnée disponible.</div>}
                    </div>
                </Card>

                <Card className="card-hover">
                    <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <Activity size={18} /> Activité du Système (Logs)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', justifyContent: 'center', height: '100%' }}>
                        {stats.recentActions.map((item, idx) => {
                            let color = 'var(--color-primary)';
                            if (item.action === 'CREATE') color = 'var(--color-success)';
                            if (item.action === 'UPDATE') color = 'var(--color-warning)';
                            if (item.action === 'DELETE') color = 'var(--color-error)';
                            
                            return (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                                    <div style={{ width: '80px', fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>{item.action}</div>
                                    <div style={{ flex: 1, height: '12px', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                        <div 
                                            style={{ 
                                                width: `${item.percent}%`, 
                                                height: '100%', 
                                                backgroundColor: color,
                                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                                borderRadius: 'var(--radius-sm)'
                                            }} 
                                        />
                                    </div>
                                    <div style={{ width: '40px', textAlign: 'right', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{item.count}</div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

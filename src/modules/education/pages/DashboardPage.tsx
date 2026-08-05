import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
    Users, BarChart3, CalendarClock, AlertCircle, Plus, FileText, UserPlus, Calendar
} from 'lucide-react';
import { Button, Card } from '../components';
import { VideoHero } from '../components/VideoHero';
import { PremiumKPICard } from '../components/PremiumKPICard';
import { TimelineActivity, type ActivityItem } from '../components/TimelineActivity';
import { IntelligenceAlert, type AlertItem } from '../components/IntelligenceAlert';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import campusVideo from '../../../assets/Campus_Hero_Dashboard_prin.mp4';
import adVideo1 from '../../../assets/Cour_d_ecole_Duration_s.mp4';
import adVideo2 from '../../../assets/Create_an_ultra_realistic_corp.mp4';

// Données fictives pour le graphique financier
const mockFinancialData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Fév', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Avr', revenue: 2780 },
    { name: 'Mai', revenue: 1890 },
    { name: 'Juin', revenue: 2390 },
    { name: 'Juil', revenue: 3490 },
];

export const DashboardPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const [kpis, setKpis] = useState<any>(null);
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [kpiRes, intelligenceRes, timelineRes] = await Promise.all([
                    api.get('/dashboard-stats/kpis/'),
                    api.get('/dashboard-stats/intelligence/'),
                    api.get('/dashboard-stats/timeline/')
                ]);

                setKpis(kpiRes);
                setAlerts(intelligenceRes.alerts || []);
                setActivities(timelineRes.activities || []);
            } catch (error) {
                console.error("Erreur lors du chargement du dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const dismissAlert = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    if (loading || !kpis) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-tertiary)' }}>
                <div style={{ width: 40, height: 40, border: '3px solid var(--color-surface-border)', borderTopColor: 'var(--color-accent-500)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    return (
        <div style={{ margin: 'calc(-1 * var(--spacing-8)) calc(-1 * var(--spacing-10))', display: 'flex', flexDirection: 'column' }}>
            
            {/* HERO SECTION IMMERSIVE */}
            <VideoHero 
                videoSrc={campusVideo}
                fallbackImage="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
                title="Complexe Scolaire Alliance One"
                subtitle="Campus Operating Center. Tous les systèmes sont opérationnels et à jour."
                date={formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
                weather="24°C, Ensoleillé"
                stats={{
                    studentsPresent: kpis.present_today || 0,
                    teachersPresent: kpis.total_teachers || 0,
                    ongoingClasses: kpis.total_classes || 0,
                    todayEvents: kpis.upcoming_exams || 0
                }}
                actions={
                    <>
                        <Button variant="primary" icon={Plus} style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/students/new')}>Nouvel Élève</Button>
                        <Button variant="secondary" icon={Calendar} style={{ justifyContent: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'transparent' }} onClick={() => navigate('/academic-calendar')}>Calendrier Académique</Button>
                        <Button variant="outline" icon={FileText} style={{ justifyContent: 'flex-start', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => navigate('/reports')}>Générer Bulletins</Button>
                    </>
                }
            />

            <div style={{ padding: '0 var(--spacing-10) var(--spacing-10)' }}>
                {/* INTELLIGENCE SECTION */}
                <IntelligenceAlert alerts={alerts} onDismiss={dismissAlert} />

                {/* PREMIUM KPIS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
                    <PremiumKPICard 
                        title="Nouvelles Inscriptions"
                        value={kpis.new_enrollments || 0}
                        icon={UserPlus}
                        trend={12.5}
                        trendLabel="ce mois-ci"
                        color="var(--color-success-text)"
                        delay={0.1}
                    />
                    <PremiumKPICard 
                        title="Total Élèves Actifs"
                        value={kpis.total_students}
                        icon={Users}
                        trend={5.2}
                        trendLabel="vs année passée"
                        color="var(--color-info-text)"
                        delay={0.2}
                    />
                    <PremiumKPICard 
                        title="Absences Aujourd'hui"
                        value={kpis.absent_today || 0}
                        icon={AlertCircle}
                        trend={-1.5}
                        trendLabel="vs hier"
                        color="var(--color-danger-text)"
                        delay={0.3}
                    />
                    <PremiumKPICard 
                        title="Événements & Examens"
                        value={kpis.upcoming_exams || 0}
                        icon={CalendarClock}
                        trend={0}
                        trendLabel="à venir"
                        color="var(--color-accent-500)"
                        delay={0.4}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-8)' }}>
                    
                    {/* ANALYTICS SECTION */}
                    <Card hoverable={false} style={{ padding: 'var(--spacing-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                            <h3 className="t-h3" style={{ margin: 0 }}>Évolution Financière (Recettes)</h3>
                            <Button variant="secondary" size="sm" icon={BarChart3} onClick={() => navigate('/analytics')}>
                                Vue Détaillée
                            </Button>
                        </div>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockFinancialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-accent-500)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--color-accent-500)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-border)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontWeight: 500 }} dx={-10} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-surface-border)', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--color-surface-card)' }}
                                        itemStyle={{ color: 'var(--color-accent-500)', fontWeight: 600 }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="var(--color-accent-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* TIMELINE SECTION */}
                    <Card hoverable={false} style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="t-h3" style={{ marginBottom: 'var(--spacing-6)' }}>Activités Récentes</h3>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <TimelineActivity activities={activities} />
                        </div>
                        <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-surface-border)' }}>
                            <Button variant="ghost" fullWidth onClick={() => navigate('/audit')}>
                                Voir tout l'historique
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* PREMIUM PROMOTIONAL SECTION */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-8)' }}>
                    {/* Pub 1 */}
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', height: '220px', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} className="hover-lift">
                        <video 
                            src={adVideo1} 
                            autoPlay 
                            muted 
                            loop 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%)', padding: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', width: 'max-content', fontSize: '10px', color: '#fff', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px', backdropFilter: 'blur(4px)' }}>DÉCOUVERTE</div>
                            <h4 style={{ color: '#fff', fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-2)' }}>Le Nouveau Campus</h4>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-4)', maxWidth: '70%', lineHeight: 1.4 }}>Vivez l'expérience Alliance One dans nos nouvelles installations ultra-modernes.</p>
                        </div>
                    </div>
                    {/* Pub 2 */}
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', height: '220px', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} className="hover-lift">
                        <video 
                            src={adVideo2} 
                            autoPlay 
                            muted 
                            loop 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(79, 70, 229, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%)', padding: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', width: 'max-content', fontSize: '10px', color: '#fff', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px', backdropFilter: 'blur(4px)' }}>INNOVATION</div>
                            <h4 style={{ color: '#fff', fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-2)' }}>Alliance OS Entreprise</h4>
                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-4)', maxWidth: '70%', lineHeight: 1.4 }}>Passez à la vitesse supérieure avec nos solutions d'intelligence artificielle.</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .hover-lift:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg) !important;
                }
            `}</style>
        </div>
    );
};
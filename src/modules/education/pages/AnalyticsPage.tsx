import { useState, useEffect } from 'react';
import { Card, PageHeader, Badge, Button } from '../components';
import { api } from '../services/api';
import { 
    BarChart3, Users, GraduationCap, TrendingUp, TrendingDown, 
    Award, PieChart, Activity, BookOpen, ArrowLeft, Target, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlatformStore } from '../../../core/stores/platformStore';

// Animated number counter
const AnimatedNumber = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const duration = 800;
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(value * eased * 100) / 100);
            if (progress < 1) requestAnimationFrame(animate);
        };
        animate();
    }, [value]);
    return <>{prefix}{typeof display === 'number' && !isNaN(display) ? display.toLocaleString('fr-FR') : 0}{suffix}</>;
};

// Mini bar chart component (pure CSS)
const MiniBarChart = ({ data, height = 120 }: { data: { label: string; value: number; color: string }[]; height?: number }) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height, width: '100%' }}>
            {data.map((d, i) => (
                <motion.div 
                    key={i} 
                    initial={{ height: 0 }} 
                    animate={{ height: `${(d.value / maxVal) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                >
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{d.value > 0 ? d.value.toFixed(1) : ''}</div>
                    <div style={{ 
                        width: '100%', 
                        borderRadius: '4px 4px 0 0', 
                        backgroundColor: d.color, 
                        flex: 1, 
                        minHeight: d.value > 0 ? '4px' : '0',
                        transition: 'background-color 0.3s'
                    }} />
                    <div style={{ fontSize: '9px', color: 'var(--color-text-tertiary)', textAlign: 'center', lineHeight: 1.1, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
                </motion.div>
            ))}
        </div>
    );
};

// Donut chart (SVG)
const DonutChart = ({ segments, size = 140 }: { segments: { label: string; value: number; color: string }[]; size?: number }) => {
    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    const r = size / 2 - 10;
    const c = Math.PI * 2 * r;
    let offset = 0;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-surface-hover)" strokeWidth="16" />
                {segments.map((seg, i) => {
                    const pct = seg.value / total;
                    const dashArray = `${pct * c} ${c}`;
                    const dashOffset = -offset * c;
                    offset += pct;
                    return (
                        <motion.circle 
                            key={i}
                            cx={size/2} cy={size/2} r={r}
                            fill="none" stroke={seg.color} strokeWidth="16"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            transform={`rotate(-90 ${size/2} ${size/2})`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.15, duration: 0.4 }}
                        />
                    );
                })}
                <text x={size/2} y={size/2 - 6} textAnchor="middle" style={{ fontSize: '22px', fontWeight: 700, fill: 'var(--color-text-primary)' }}>{total}</text>
                <text x={size/2} y={size/2 + 12} textAnchor="middle" style={{ fontSize: '10px', fill: 'var(--color-text-tertiary)' }}>élèves</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {segments.map((seg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: seg.color }} />
                        <span style={{ color: 'var(--color-text-secondary)' }}>{seg.label}</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginLeft: 'auto' }}>{seg.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AnalyticsPage = () => {
    const currentSchoolClass = usePlatformStore(s => s.currentSchoolClass);
    const setCurrentSchoolClass = usePlatformStore(s => s.setCurrentSchoolClass);
    
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [classStats, setClassStats] = useState<any>(null);
    const [globalStats, setGlobalStats] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, [currentSchoolClass]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [classesRes, studentsRes, paymentsRes, gradesRes, attendancesRes, yearsRes] = await Promise.all([
                api.get('/classes/'),
                api.get(currentSchoolClass ? `/students/?school_class=${currentSchoolClass.id}` : '/students/'),
                api.get('/payments/'),
                api.get('/grades/'),
                api.get('/attendances/'),
                api.get('/academic-years/')
            ]);

            setClasses(classesRes);
            const activeYear = yearsRes.find((y: any) => y.is_active);

            // --- COMPUTE GLOBAL STATS ---
            const totalStudents = studentsRes.length;
            const totalAbsences = Array.isArray(attendancesRes) ? attendancesRes.filter((a: any) => a.is_absent).length : 0;
            const totalPresent = Array.isArray(attendancesRes) ? attendancesRes.filter((a: any) => !a.is_absent).length : 0;
            const attendanceRate = (totalPresent + totalAbsences) > 0 ? (totalPresent / (totalPresent + totalAbsences)) * 100 : 100;

            // Students per class
            const classCounts: Record<string, number> = {};
            classesRes.forEach((c: any) => classCounts[c.name] = 0);
            studentsRes.forEach((s: any) => {
                const cName = s.current_enrollment?.school_class_details?.name;
                if (cName) classCounts[cName] = (classCounts[cName] || 0) + 1;
            });
            const studentsPerClass = Object.entries(classCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count);

            // Gender split
            const boys = studentsRes.filter((s: any) => s.sex === 'M').length;
            const girls = studentsRes.filter((s: any) => s.sex === 'F').length;

            // Finance
            const totalPayments = Array.isArray(paymentsRes) ? paymentsRes.reduce((acc: number, p: any) => acc + parseFloat(p.amount || 0), 0) : 0;

            // Grades analysis
            const gradeValues = Array.isArray(gradesRes) ? gradesRes.map((g: any) => parseFloat(g.value)).filter((v: number) => !isNaN(v)) : [];
            const avgGrade = gradeValues.length > 0 ? gradeValues.reduce((a: number, b: number) => a + b, 0) / gradeValues.length : 0;
            const above10 = gradeValues.filter((v: number) => v >= 10).length;
            const below10 = gradeValues.filter((v: number) => v < 10).length;
            const successRate = gradeValues.length > 0 ? (above10 / gradeValues.length) * 100 : 0;

            // Grade distribution
            const gradeDist = [
                { label: '0-5', value: gradeValues.filter(v => v < 5).length, color: 'hsl(0, 70%, 50%)' },
                { label: '5-8', value: gradeValues.filter(v => v >= 5 && v < 8).length, color: 'hsl(25, 70%, 50%)' },
                { label: '8-10', value: gradeValues.filter(v => v >= 8 && v < 10).length, color: 'hsl(45, 70%, 50%)' },
                { label: '10-12', value: gradeValues.filter(v => v >= 10 && v < 12).length, color: 'hsl(80, 60%, 45%)' },
                { label: '12-14', value: gradeValues.filter(v => v >= 12 && v < 14).length, color: 'hsl(120, 50%, 45%)' },
                { label: '14-16', value: gradeValues.filter(v => v >= 14 && v < 16).length, color: 'hsl(180, 60%, 40%)' },
                { label: '16-18', value: gradeValues.filter(v => v >= 16 && v < 18).length, color: 'hsl(210, 70%, 50%)' },
                { label: '18-20', value: gradeValues.filter(v => v >= 18).length, color: 'hsl(260, 70%, 55%)' },
            ];

            // Averages per class (top 5)
            const classAvgs = studentsPerClass.slice(0, 8).map(cls => {
                const classObj = classesRes.find((c: any) => c.name === cls.name);
                if (!classObj) return { label: cls.name, value: 0, color: 'var(--color-primary)' };
                const classGrades = Array.isArray(gradesRes) ? gradesRes.filter((g: any) => {
                    const student = studentsRes.find((s: any) => s.id === g.student);
                    return student?.current_enrollment?.school_class_details?.id === classObj.id;
                }) : [];
                const vals = classGrades.map((g: any) => parseFloat(g.value)).filter((v: number) => !isNaN(v));
                const avg = vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0;
                return { label: cls.name, value: Math.round(avg * 100) / 100, color: avg >= 10 ? 'hsl(150, 60%, 45%)' : 'hsl(0, 60%, 50%)' };
            });

            setGlobalStats({
                totalStudents,
                boys,
                girls,
                totalPayments,
                attendanceRate,
                avgGrade,
                successRate,
                above10,
                below10,
                studentsPerClass,
                gradeDist,
                classAvgs,
                totalAbsences
            });

        } catch (error) {
            console.error("Erreur analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--color-text-tertiary)' }}>
                <div style={{ width: 40, height: 40, border: '3px solid var(--color-surface-border)', borderTopColor: 'var(--color-accent-500)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const s = globalStats;
    if (!s) return null;

    const kpiCardStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-5)',
    };

    const kpiValueStyle: React.CSSProperties = {
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 'var(--font-weight-bold)' as any,
        color: 'var(--color-text-primary)',
        lineHeight: 1.1,
    };

    const kpiLabelStyle: React.CSSProperties = {
        fontSize: 'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-medium)' as any,
        color: 'var(--color-text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    };

    return (
        <motion.div className="page-transition-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {currentSchoolClass && (
                <div style={{ marginBottom: 'var(--spacing-4)' }}>
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => setCurrentSchoolClass(null)} style={{ paddingLeft: 0 }}>
                        Retour (toutes les classes)
                    </Button>
                </div>
            )}

            <PageHeader
                title={currentSchoolClass ? `Analytique : ${currentSchoolClass.name}` : "Vue Analytique Globale"}
                subtitle={currentSchoolClass 
                    ? `Statistiques détaillées pour la classe ${currentSchoolClass.name}.`
                    : "Tableau de bord statistique et suivi des performances académiques."
                }
                icon={BarChart3}
            />

            {/* KPI ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
                {[
                    { icon: Users, label: 'Effectif', value: s.totalStudents, suffix: ' élèves', accent: 'var(--color-primary)' },
                    { icon: Target, label: 'Taux de Réussite', value: s.successRate, suffix: '%', accent: s.successRate >= 50 ? 'var(--color-success)' : 'var(--color-danger-text)' },
                    { icon: GraduationCap, label: 'Moy. Générale', value: s.avgGrade, suffix: '/20', accent: s.avgGrade >= 10 ? 'var(--color-success)' : 'var(--color-danger-text)' },
                    { icon: Clock, label: 'Taux de Présence', value: s.attendanceRate, suffix: '%', accent: 'var(--color-info-text)' },
                    { icon: Award, label: 'Volume Financier', value: s.totalPayments, suffix: ' FCFA', accent: 'var(--color-success)' },
                ].map((kpi, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card style={{ ...kpiCardStyle, borderLeft: `3px solid ${kpi.accent}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                <kpi.icon size={14} color={kpi.accent} />
                                <span style={kpiLabelStyle}>{kpi.label}</span>
                            </div>
                            <div style={kpiValueStyle}>
                                <AnimatedNumber value={kpi.value} suffix={kpi.suffix} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* MAIN GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
                
                {/* Grade Distribution */}
                <Card style={{ padding: 'var(--spacing-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
                        <BarChart3 size={18} color="var(--color-accent-500)" />
                        <h3 className="t-h5" style={{ margin: 0 }}>Distribution des Notes</h3>
                    </div>
                    <MiniBarChart data={s.gradeDist} height={150} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-bg)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
                        <span style={{ color: 'var(--color-success-text)' }}>✓ {s.above10} au-dessus de 10</span>
                        <span style={{ color: 'var(--color-danger-text)' }}>✗ {s.below10} en-dessous de 10</span>
                    </div>
                </Card>

                {/* Class Averages */}
                <Card style={{ padding: 'var(--spacing-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
                        <TrendingUp size={18} color="var(--color-success)" />
                        <h3 className="t-h5" style={{ margin: 0 }}>Moyennes par Classe</h3>
                    </div>
                    <MiniBarChart data={s.classAvgs} height={150} />
                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                        <span style={{ color: 'hsl(150, 60%, 45%)' }}>■</span> ≥ 10  &nbsp;
                        <span style={{ color: 'hsl(0, 60%, 50%)' }}>■</span> &lt; 10
                    </div>
                </Card>

                {/* Gender Split (Donut) */}
                <Card style={{ padding: 'var(--spacing-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
                        <PieChart size={18} color="var(--color-accent-500)" />
                        <h3 className="t-h5" style={{ margin: 0 }}>Répartition par Sexe</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <DonutChart segments={[
                            { label: 'Garçons', value: s.boys, color: 'hsl(220, 70%, 55%)' },
                            { label: 'Filles', value: s.girls, color: 'hsl(330, 65%, 55%)' },
                        ]} />
                    </div>
                </Card>

                {/* Students per Class */}
                <Card style={{ padding: 'var(--spacing-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
                        <BookOpen size={18} color="var(--color-primary)" />
                        <h3 className="t-h5" style={{ margin: 0 }}>Effectif par Classe</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        {s.studentsPerClass.slice(0, 8).map((cls: any, idx: number) => (
                            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: 'var(--font-size-sm)' }}>
                                    <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{cls.name}</span>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>{cls.count}</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cls.count / (s.totalStudents || 1)) * 100}%` }}
                                        transition={{ delay: idx * 0.05, duration: 0.6 }}
                                        style={{ height: '100%', backgroundColor: `hsl(${220 - idx * 15}, 65%, 55%)`, borderRadius: '3px' }} 
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* BOTTOM INSIGHT BAR */}
            <Card style={{ 
                padding: 'var(--spacing-5)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, var(--color-surface-card), var(--color-surface-bg))',
                borderLeft: '4px solid var(--color-accent-500)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <Activity size={20} color="var(--color-accent-500)" />
                    <div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                            Synthèse Rapide
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                            {s.totalStudents} élèves • Moy. générale {s.avgGrade.toFixed(2)}/20 • {s.totalAbsences} absences enregistrées • {s.totalPayments.toLocaleString('fr-FR')} FCFA collectés
                        </div>
                    </div>
                </div>
                <Badge label={s.avgGrade >= 10 ? "Résultats Satisfaisants" : "Attention Requise"} variant={s.avgGrade >= 10 ? "success" : "warning"} />
            </Card>
        </motion.div>
    );
};

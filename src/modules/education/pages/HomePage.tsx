import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, FileText, Calendar, Library, TrendingUp } from 'lucide-react';
import { DashboardGrid, StatCard, ActivityChart } from '../components';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';
import { api } from '../services/api';


export const HomePage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, classes] = await Promise.all([
          api.get('/students/'),
          api.get('/teachers/'),
          api.get('/classes/')
        ]);
        setStats({
          students: students.length,
          teachers: teachers.length,
          classes: classes.length,
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const initialLayout = [
    { i: 'stat-students', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'stat-teachers', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'stat-classes', x: 6, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'stat-revenue', x: 9, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'chart-activity', x: 0, y: 4, w: 8, h: 10, minW: 4, minH: 8 },
    { i: 'quick-actions', x: 8, y: 4, w: 4, h: 10, minW: 3, minH: 6 }
  ];

  const [layouts, setLayouts] = useState({ lg: initialLayout });

  const onLayoutChange = (layout: any, layouts: any) => {
    setLayouts(layouts);
  };

  const ActionItem = ({ icon: Icon, title, onClick, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02, backgroundColor: 'var(--color-surface-hover)' }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        border: '1px solid var(--border-subtle)',
        marginBottom: '0.5rem'
      }}
    >
      <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-primary-50)', borderRadius: '8px', color: 'var(--color-accent-600)' }}>
        <Icon size={18} />
      </div>
      <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{title}</span>
    </motion.div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="t-h1">Centre de Contrôle</h2>
          <p className="t-subtitle" style={{ marginTop: 'var(--space-1)' }}>Aperçu global et accès rapide aux modules.</p>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <DashboardGrid layouts={layouts} onLayoutChange={onLayoutChange}>
          <div key="stat-students">
            <StatCard 
              title="Élèves Inscrits" 
              value={loading ? '...' : stats.students} 
              icon={Users} 
            />
          </div>
          <div key="stat-teachers">
            <StatCard 
              title="Corps Professoral" 
              value={loading ? '...' : stats.teachers} 
              icon={GraduationCap} 
            />
          </div>
          <div key="stat-classes">
            <StatCard 
              title="Classes Actives" 
              value={loading ? '...' : stats.classes} 
              icon={BookOpen} 
            />
          </div>
          <div key="stat-revenue">
            <StatCard 
              title="Taux de Recouvrement" 
              value="78%" 
              icon={TrendingUp} 
              trend={{ value: 5, isPositive: true }} 
            />
          </div>

          <div key="chart-activity">
            <ActivityChart 
              title="Activité & Présences Hebdomadaires"
              data={[]}
              dataKey="value"
            />
          </div>

          <div key="quick-actions" style={{ height: '100%' }}>
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Actions Rapides</h3>
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                <ActionItem icon={Users} title="Gérer les Élèves" onClick={() => navigate('/students')} delay={0.1} />
                <ActionItem icon={FileText} title="Saisie des Notes" onClick={() => navigate('/grades')} delay={0.2} />
                <ActionItem icon={Library} title="Bulletins" onClick={() => navigate('/reports')} delay={0.3} />
                <ActionItem icon={Calendar} title="Années Scolaires" onClick={() => navigate('/academic-years')} delay={0.4} />
              </div>
            </Card>
          </div>
        </DashboardGrid>
      </div>
    </div>
  );
};

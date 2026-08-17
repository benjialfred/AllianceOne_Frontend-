import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Clock, AlertTriangle, FolderKanban, Plus,
  ArrowUpRight, Users, TrendingUp, Calendar, AlertCircle, RefreshCw,
  ListTodo, Layers, ArrowRight
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import { TaskModal } from '../components/TaskModal';
import { ProjectModal } from '../components/ProjectModal';
import { TaskDetailDrawer } from '../components/TaskDetailDrawer';
import { tasksApi } from '../services/api';
import type { TasksDashboardKPIs, Task, Project } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<TasksDashboardKPIs | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kpiData, projData] = await Promise.all([
        tasksApi.getKPIs(),
        tasksApi.getProjects()
      ]);
      setKpis(kpiData);
      setProjects(projData);
    } catch (err) {
      console.error('Failed to load tasks dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Pilotage des Tâches & Projets"
        subtitle="Vue d'ensemble de l'avancement, vélocité, alertes de délais et productivité."
        breadcrumbs={[{ label: 'Espace Travail' }, { label: 'Tableau de bord' }]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e4e9',
                backgroundColor: '#ffffff',
                color: '#525866',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <FolderKanban size={14} />
              Nouveau Projet
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0e121b',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              Nouvelle Tâche
            </button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Tâches Totales & Complétion */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e4e9',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#525866' }}>Tâches Totales</span>
            <div style={{ padding: '6px', backgroundColor: '#e0e7ff', borderRadius: '8px', color: '#4f46e5' }}>
              <ListTodo size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0e121b', letterSpacing: '-0.02em' }}>
            {kpis?.total_tasks || 0}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px' }}>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>{kpis?.completion_rate || 0}%</span>
            <span style={{ color: '#868c98' }}>taux de complétion ({kpis?.done_tasks || 0} terminées)</span>
          </div>
        </div>

        {/* Projets Actifs */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e4e9',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#525866' }}>Projets en Cours</span>
            <div style={{ padding: '6px', backgroundColor: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
              <FolderKanban size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0e121b', letterSpacing: '-0.02em' }}>
            {kpis?.active_projects || 0}
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px', color: '#868c98' }}>
            Sur {kpis?.total_projects || 0} projets enregistrés
          </div>
        </div>

        {/* Retards Critiques */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e4e9',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#525866' }}>Tâches en Retard</span>
            <div style={{ padding: '6px', backgroundColor: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: (kpis?.overdue_count || 0) > 0 ? '#dc2626' : '#0e121b', letterSpacing: '-0.02em' }}>
            {kpis?.overdue_count || 0}
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px', color: (kpis?.overdue_count || 0) > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
            {(kpis?.overdue_count || 0) > 0 ? 'Action corrective requise' : 'Aucun retard constaté'}
          </div>
        </div>

        {/* Temps Passé */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e4e9',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#525866' }}>Heures Passées</span>
            <div style={{ padding: '6px', backgroundColor: '#f0fdf4', borderRadius: '8px', color: '#16a34a' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0e121b', letterSpacing: '-0.02em' }}>
            {kpis?.total_logged_hours || 0}h
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px', color: '#868c98' }}>
            Estimé total : {kpis?.total_estimated_hours || 0}h
          </div>
        </div>
      </div>

      {/* Main split: Left (Overdue & Recent) | Right (Workflow Breakdown & Quick Links) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Overdue alert table if any */}
          {(kpis?.overdue_tasks && kpis.overdue_tasks.length > 0) && (
            <div style={{
              backgroundColor: '#fffafb',
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} color="#dc2626" />
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#991b1b' }}>
                    Tâches prioritaires en dépassement d'échéance
                  </h3>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '10px' }}>
                  {kpis.overdue_count} en retard
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {kpis.overdue_tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleOpenTask(task)}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>
                        {task.task_number}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0e121b' }}>
                        {task.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <PriorityBadge priority={task.priority} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>
                        Échéance : {new Date(task.due_date!).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Tasks */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e4e9',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0e121b' }}>
                  Activité Récente des Tâches
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#525866' }}>
                  Dernières modifications et avancements en direct.
                </p>
              </div>
              <button
                onClick={() => navigate('/app/tasks/board')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  background: 'transparent',
                  color: '#4f46e5',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Voir le Kanban <ArrowRight size={14} />
              </button>
            </div>

            {kpis?.recent_tasks && kpis.recent_tasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {kpis.recent_tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleOpenTask(task)}
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#f9f9fb',
                      border: '1px solid #e2e4e9',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f9f9fb'; e.currentTarget.style.borderColor = '#e2e4e9'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: task.project_color || '#4f46e5',
                        backgroundColor: `${task.project_color || '#4f46e5'}15`,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {task.task_number}
                      </span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0e121b' }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#868c98' }}>
                          {task.project_name || 'Sans projet'} • Assigné à {task.assigned_to_name}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#868c98', fontSize: '13px' }}>
                Aucune tâche enregistrée pour le moment.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Workflow Status Breakdown & Quick Access */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status Breakdown Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e4e9',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem', fontWeight: 700, color: '#0e121b' }}>
              État du Workflow
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'À faire (TODO)', count: kpis?.status_distribution?.TODO || 0, color: '#4f46e5', bg: '#e0e7ff' },
                { label: 'En cours', count: kpis?.status_distribution?.IN_PROGRESS || 0, color: '#2563eb', bg: '#dbeafe' },
                { label: 'En révision', count: kpis?.status_distribution?.IN_REVIEW || 0, color: '#9333ea', bg: '#fae8ff' },
                { label: 'Terminé', count: kpis?.status_distribution?.DONE || 0, color: '#16a34a', bg: '#dcfce7' },
                { label: 'Bloqué', count: kpis?.status_distribution?.BLOCKED || 0, color: '#dc2626', bg: '#fee2e2' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontSize: '13px', color: '#333741', fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: item.color,
                    backgroundColor: item.bg,
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e4e9',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 700, color: '#0e121b' }}>
              Raccourcis & Espaces
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => navigate('/app/tasks/board')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  backgroundColor: '#f9f9fb',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0e121b'
                }}
              >
                <span>📊 Tableau Kanban complet</span>
                <ArrowRight size={14} color="#868c98" />
              </button>

              <button
                onClick={() => navigate('/app/tasks/projects')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  backgroundColor: '#f9f9fb',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0e121b'
                }}
              >
                <span>📁 Portefeuille de Projets ({projects.length})</span>
                <ArrowRight size={14} color="#868c98" />
              </button>

              <button
                onClick={() => navigate('/app/tasks/my-tasks')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e4e9',
                  backgroundColor: '#f9f9fb',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0e121b'
                }}
              >
                <span>🎯 Mes Tâches Personnelles</span>
                <ArrowRight size={14} color="#868c98" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={loadData}
        projects={projects}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={loadData}
      />

      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={loadData}
        onEdit={(task) => {
          setSelectedTask(task);
          setIsDrawerOpen(false);
          setIsTaskModalOpen(true);
        }}
      />
    </div>
  );
};

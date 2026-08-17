import React, { useEffect, useState } from 'react';
import {
  CheckCircle2, Clock, AlertTriangle, Plus, Search,
  Calendar, CheckSquare, ListTodo, UserCheck, ArrowRight
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailDrawer } from '../components/TaskDetailDrawer';
import { tasksApi } from '../services/api';
import type { Task, Project } from '../types';

export const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  // Modals & Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, projectsData] = await Promise.all([
        tasksApi.getMyTasks(),
        tasksApi.getProjects()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      console.error('Failed to load my tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingTasks = tasks.filter((t) => t.status !== 'DONE' && t.status !== 'CANCELLED');
  const completedTasks = tasks.filter((t) => t.status === 'DONE');
  const currentList = activeTab === 'pending' ? pendingTasks : completedTasks;

  const filteredTasks = currentList.filter((t) => {
    const matchesSearch = !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.task_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = !selectedProject || t.project === selectedProject;
    const matchesPriority = !selectedPriority || t.priority === selectedPriority;
    return matchesSearch && matchesProject && matchesPriority;
  });

  const overdueCount = pendingTasks.filter((t) => t.is_overdue).length;
  const totalLoggedHours = tasks.reduce((sum, t) => sum + Number(t.logged_hours || 0), 0);

  const handleQuickToggleDone = async (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    try {
      await tasksApi.changeTaskStatus(task.id, newStatus);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Mes Tâches Personnelles"
        subtitle="Votre espace individuel de concentration, priorisation et suivi de vos livrables."
        breadcrumbs={[{ label: 'Espace Travail' }, { label: 'Mes Tâches' }]}
        actions={
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
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
            Ajouter une Tâche
          </button>
        }
      />

      {/* Summary KPI Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: '#e0e7ff', borderRadius: '8px', color: '#4f46e5' }}>
            <ListTodo size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#868c98' }}>Tâches à faire</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e121b' }}>{pendingTasks.length}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: '#dcfce7', borderRadius: '8px', color: '#16a34a' }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#868c98' }}>Terminées</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e121b' }}>{completedTasks.length}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: overdueCount > 0 ? '#fee2e2' : '#f1f5f9', borderRadius: '8px', color: overdueCount > 0 ? '#dc2626' : '#64748b' }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#868c98' }}>En retard</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: overdueCount > 0 ? '#dc2626' : '#0e121b' }}>{overdueCount}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '8px', color: '#16a34a' }}>
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#868c98' }}>Temps total loggé</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0e121b' }}>{totalLoggedHours}h</div>
          </div>
        </div>
      </div>

      {/* Filter and Tab bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '8px', padding: '2px' }}>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'pending' ? '#0e121b' : 'transparent',
              color: activeTab === 'pending' ? '#ffffff' : '#525866',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            À Faire ({pendingTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'completed' ? '#0e121b' : 'transparent',
              color: activeTab === 'completed' ? '#ffffff' : '#525866',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Terminées ({completedTasks.length})
          </button>
        </div>

        {/* Search & Project Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e4e9',
            borderRadius: '8px',
            padding: '6px 12px',
            minWidth: '200px'
          }}>
            <Search size={14} color="#868c98" />
            <input
              type="text"
              placeholder="Filtrer mes tâches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '12px',
                width: '100%',
                color: '#0e121b'
              }}
            />
          </div>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #e2e4e9',
              fontSize: '12px',
              backgroundColor: '#ffffff',
              color: '#525866',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">Tous les projets</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>[{p.code}] {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => {
              setSelectedTask(task);
              setIsDrawerOpen(true);
            }}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e4e9',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e4e9';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Left: Quick checkbox + number + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <input
                type="checkbox"
                checked={task.status === 'DONE'}
                onClick={(e) => handleQuickToggleDone(e, task)}
                onChange={() => {}}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />

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
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: task.status === 'DONE' ? '#868c98' : '#0e121b',
                  textDecoration: task.status === 'DONE' ? 'line-through' : 'none'
                }}>
                  {task.title}
                </div>
                {task.project_name && (
                  <div style={{ fontSize: '11px', color: '#868c98', marginTop: '1px' }}>
                    {task.project_name}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Meta pills & status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {task.due_date && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: task.is_overdue ? 700 : 500,
                  color: task.is_overdue ? '#dc2626' : '#525866',
                  backgroundColor: task.is_overdue ? '#fee2e2' : 'transparent',
                  padding: task.is_overdue ? '2px 6px' : '0',
                  borderRadius: '4px'
                }}>
                  {task.is_overdue && <AlertTriangle size={11} />}
                  <span>{new Date(task.due_date).toLocaleDateString('fr-FR')}</span>
                </div>
              )}

              {task.checklist_total > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#525866' }}>
                  <CheckSquare size={12} color="#6366f1" />
                  <span>{task.checklist_completed}/{task.checklist_total}</span>
                </div>
              )}

              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#868c98', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e4e9' }}>
            {activeTab === 'pending' ? 'Toutes vos tâches sont terminées ! 🎉' : 'Aucune tâche terminée.'}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={loadData}
        projects={projects}
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

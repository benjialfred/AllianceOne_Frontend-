import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, CheckCircle2, Clock, Calendar,
  ListTodo, Layers, Flag, Edit3, Trash2
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailDrawer } from '../components/TaskDetailDrawer';
import { ProjectModal } from '../components/ProjectModal';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import { tasksApi } from '../services/api';
import type { Project, Task, TaskMilestone, TaskStatus } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<TaskMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'board' | 'list' | 'milestones'>('board');

  // Modals & Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('TODO');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // New Milestone input state
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [projData, tasksData, milestonesData] = await Promise.all([
        tasksApi.getProject(id),
        tasksApi.getTasks({ project: id }),
        tasksApi.getMilestones({ project: id })
      ]);
      setProject(projData);
      setTasks(tasksData);
      setMilestones(milestonesData);
    } catch (err) {
      console.error('Failed to load project detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newMilestoneName.trim()) return;
    try {
      await tasksApi.createMilestone({
        project: id,
        name: newMilestoneName.trim(),
        due_date: newMilestoneDate || undefined
      });
      setNewMilestoneName('');
      setNewMilestoneDate('');
      setShowMilestoneForm(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMilestone = async (milestone: TaskMilestone) => {
    try {
      await tasksApi.updateMilestone(milestone.id, {
        is_reached: !milestone.is_reached
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !project) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#868c98' }}>
        Chargement du projet...
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      {/* Top navigation back button */}
      <button
        onClick={() => navigate('/app/tasks/projects')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid #e2e4e9',
          backgroundColor: '#ffffff',
          color: '#525866',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '1rem'
        }}
      >
        <ArrowLeft size={13} />
        Retour aux Projets
      </button>

      {/* Project Banner / Header Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 800,
                color: project.color || '#3b82f6',
                backgroundColor: `${project.color || '#3b82f6'}15`,
                padding: '3px 10px',
                borderRadius: '6px',
                letterSpacing: '0.05em'
              }}>
                {project.code}
              </span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0e121b' }}>
                {project.name}
              </h1>
            </div>

            <p style={{ fontSize: '13px', color: '#525866', margin: '4px 0 12px', maxWidth: '700px', lineHeight: 1.5 }}>
              {project.description || 'Aucune description disponible.'}
            </p>

            {/* Meta stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: '#525866' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} color="#16a34a" />
                <span>{project.completed_tasks_count} / {project.total_tasks_count} tâches terminées ({project.progress_percentage}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} color="#6366f1" />
                <span>{Number(project.total_logged_hours)}h passées / {Number(project.budget_hours)}h budget</span>
              </div>
              {project.due_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} color="#868c98" />
                  <span>Échéance : {new Date(project.due_date).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
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
                color: '#0e121b',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Edit3 size={13} />
              Paramètres
            </button>
            <button
              onClick={() => {
                setSelectedTask(null);
                setDefaultStatus('TODO');
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
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '16px', width: '100%', height: '6px', backgroundColor: '#e2e4e9', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${project.progress_percentage}%`,
            height: '100%',
            backgroundColor: project.color || '#3b82f6',
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #e2e4e9',
        marginBottom: '20px'
      }}>
        {[
          { id: 'board', label: '📊 Tableau Kanban' },
          { id: 'list', label: `📋 Liste des Tâches (${tasks.length})` },
          { id: 'milestones', label: `🎯 Jalons (${milestones.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#0e121b' : '#525866',
              borderBottom: activeTab === tab.id ? '2px solid #0e121b' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: '-1px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Kanban Board */}
      {activeTab === 'board' && (
        <KanbanBoard
          tasks={tasks}
          projects={[project]}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setIsDrawerOpen(true);
          }}
          onAddTask={(st) => {
            setDefaultStatus(st || 'TODO');
            setSelectedTask(null);
            setIsTaskModalOpen(true);
          }}
          onStatusChange={async (taskId, newStatus) => {
            await tasksApi.changeTaskStatus(taskId, newStatus);
            loadData();
          }}
        />
      )}

      {/* Tab 2: Task List */}
      {activeTab === 'list' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e4e9', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>N°</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Titre</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Statut</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Priorité</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Échéance</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Checklist</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Assigné</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsDrawerOpen(true);
                  }}
                  style={{ borderBottom: '1px solid #f3f3f6', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9f9fb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: project.color || '#3b82f6' }}>
                    {task.task_number}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0e121b' }}>
                    {task.title}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={task.status} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td style={{ padding: '12px 16px', color: '#525866' }}>
                    {task.due_date ? new Date(task.due_date).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {task.checklist_total > 0 ? `${task.checklist_completed}/${task.checklist_total}` : '-'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#0e121b' }}>
                    {task.assigned_to_name}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#868c98' }}>
                    Aucune tâche dans ce projet pour l'instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Milestones */}
      {activeTab === 'milestones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0e121b' }}>
              Jalons Clés du Projet
            </h3>
            <button
              onClick={() => setShowMilestoneForm(!showMilestoneForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e4e9',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Plus size={13} />
              Nouveau Jalon
            </button>
          </div>

          {showMilestoneForm && (
            <form onSubmit={handleCreateMilestone} style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e4e9',
              borderRadius: '10px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                required
                placeholder="Nom du jalon (ex: Livraison V1 Beta)..."
                value={newMilestoneName}
                onChange={(e) => setNewMilestoneName(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e4e9', fontSize: '13px' }}
              />
              <input
                type="date"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e4e9', fontSize: '13px' }}
              />
              <button
                type="submit"
                style={{ padding: '8px 16px', backgroundColor: '#0e121b', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Créer
              </button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {milestones.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e4e9',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={m.is_reached}
                    onChange={() => handleToggleMilestone(m)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: m.is_reached ? '#868c98' : '#0e121b', textDecoration: m.is_reached ? 'line-through' : 'none' }}>
                      {m.name}
                    </div>
                    {m.due_date && (
                      <div style={{ fontSize: '11px', color: '#868c98', marginTop: '2px' }}>
                        Date cible : {new Date(m.due_date).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>

                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: m.is_reached ? '#dcfce7' : '#f1f5f9',
                  color: m.is_reached ? '#15803d' : '#475569'
                }}>
                  {m.is_reached ? 'Atteint' : 'En cours'}
                </span>
              </div>
            ))}

            {milestones.length === 0 && !showMilestoneForm && (
              <div style={{ padding: '30px', textAlign: 'center', color: '#868c98', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e4e9' }}>
                Aucun jalon défini pour ce projet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={loadData}
        initialProject={project.id}
        initialStatus={defaultStatus}
        projects={[project]}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={loadData}
        projectToEdit={project}
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

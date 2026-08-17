import React, { useEffect, useState } from 'react';
import {
  Search, Plus, Filter, Calendar, CheckSquare, Clock,
  User, AlertCircle, ArrowUpDown, ChevronRight, AlertTriangle
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailDrawer } from '../components/TaskDetailDrawer';
import { tasksApi } from '../services/api';
import type { Task, Project, TaskStatus, TaskPriority } from '../types';

export const TasksListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [onlyOverdue, setOnlyOverdue] = useState(false);

  // Modals & Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, projectsData] = await Promise.all([
        tasksApi.getTasks(),
        tasksApi.getProjects()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      console.error('Failed to load tasks list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.task_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = !selectedProject || t.project === selectedProject;
    const matchesStatus = !selectedStatus || t.status === selectedStatus;
    const matchesPriority = !selectedPriority || t.priority === selectedPriority;
    const matchesOverdue = !onlyOverdue || t.is_overdue;

    return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesOverdue;
  });

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Liste des Tâches"
        subtitle="Vue tabulaire haute densité de toutes les tâches avec tri et filtres combinés."
        breadcrumbs={[{ label: 'Espace Travail' }, { label: 'Liste des Tâches' }]}
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
            Nouvelle Tâche
          </button>
        }
      />

      {/* Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f9f9fb',
          border: '1px solid #e2e4e9',
          borderRadius: '8px',
          padding: '6px 12px',
          flex: 1,
          minWidth: '220px'
        }}>
          <Search size={14} color="#868c98" />
          <input
            type="text"
            placeholder="Rechercher par titre ou numéro (ex: PRJ-001)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              width: '100%',
              color: '#0e121b'
            }}
          />
        </div>

        {/* Project select */}
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e4e9',
            fontSize: '13px',
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

        {/* Status select */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e4e9',
            fontSize: '13px',
            backgroundColor: '#ffffff',
            color: '#525866',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="">Tous les statuts</option>
          <option value="BACKLOG">Backlog</option>
          <option value="TODO">À faire</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="IN_REVIEW">En révision</option>
          <option value="DONE">Terminé</option>
          <option value="BLOCKED">Bloqué</option>
        </select>

        {/* Priority select */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e4e9',
            fontSize: '13px',
            backgroundColor: '#ffffff',
            color: '#525866',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="">Toutes priorités</option>
          <option value="URGENT">Urgente 🔴</option>
          <option value="HIGH">Haute 🟠</option>
          <option value="MEDIUM">Moyenne 🟡</option>
          <option value="LOW">Basse 🔵</option>
        </select>

        {/* Only Overdue Toggle */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 600,
          color: onlyOverdue ? '#dc2626' : '#525866',
          cursor: 'pointer',
          padding: '6px 10px',
          borderRadius: '8px',
          backgroundColor: onlyOverdue ? '#fee2e2' : 'transparent',
          border: onlyOverdue ? '1px solid #fca5a5' : '1px solid transparent'
        }}>
          <input
            type="checkbox"
            checked={onlyOverdue}
            onChange={(e) => setOnlyOverdue(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span>Retards uniquement</span>
        </label>
      </div>

      {/* Tasks Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9fb', borderBottom: '1px solid #e2e4e9', textAlign: 'left', color: '#525866' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600, width: '100px' }}>N°</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Titre & Projet</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Statut</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Priorité</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Échéance</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Checklist</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Temps</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Assigné</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => handleOpenTask(task)}
                style={{
                  borderBottom: '1px solid #f3f3f6',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9f9fb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td style={{ padding: '12px 16px' }}>
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
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#0e121b' }}>{task.title}</div>
                  <div style={{ fontSize: '11px', color: '#868c98', marginTop: '2px' }}>
                    {task.project_name || 'Sans projet'}
                  </div>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={task.status} />
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <PriorityBadge priority={task.priority} />
                </td>

                <td style={{ padding: '12px 16px' }}>
                  {task.due_date ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: task.is_overdue ? '#dc2626' : '#525866',
                      fontWeight: task.is_overdue ? 700 : 500
                    }}>
                      {task.is_overdue && <AlertTriangle size={12} />}
                      <span>{new Date(task.due_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#868c98' }}>-</span>
                  )}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  {task.checklist_total > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckSquare size={12} color="#6366f1" />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{task.checklist_completed}/{task.checklist_total}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#868c98' }}>-</span>
                  )}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <Clock size={12} color="#10b981" />
                    <span>{Number(task.logged_hours)}h</span>
                    {Number(task.estimated_hours) > 0 && (
                      <span style={{ color: '#868c98' }}>/ {Number(task.estimated_hours)}h</span>
                    )}
                  </div>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#0e121b',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textTransform: 'uppercase'
                    }}>
                      {task.assigned_to_name ? task.assigned_to_name.substring(0, 2) : 'NA'}
                    </div>
                    <span style={{ fontSize: '12px', color: '#0e121b' }}>{task.assigned_to_name}</span>
                  </div>
                </td>
              </tr>
            ))}

            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#868c98' }}>
                  Aucune tâche correspondant aux critères sélectionnés.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

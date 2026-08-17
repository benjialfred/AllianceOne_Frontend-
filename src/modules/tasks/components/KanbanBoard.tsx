import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus, Project } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
  onAddTask: (defaultStatus?: TaskStatus) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const COLUMNS: Array<{ id: TaskStatus; label: string; color: string; bg: string; border: string }> = [
  { id: 'TODO', label: 'À faire', color: '#4f46e5', bg: '#f5f3ff', border: '#ddd6fe' },
  { id: 'IN_PROGRESS', label: 'En cours', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { id: 'IN_REVIEW', label: 'En révision', color: '#9333ea', bg: '#faf5ff', border: '#f3e8ff' },
  { id: 'DONE', label: 'Terminé', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  projects,
  onTaskClick,
  onAddTask,
  onStatusChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.task_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = !selectedProject || t.project === selectedProject;
    const matchesPriority = !selectedPriority || t.priority === selectedPriority;
    return matchesSearch && matchesProject && matchesPriority;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#ffffff',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #e2e4e9'
      }}>
        {/* Left: Search & filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f9f9fb',
            border: '1px solid #e2e4e9',
            borderRadius: '8px',
            padding: '6px 12px',
            minWidth: '220px'
          }}>
            <Search size={14} color="#868c98" />
            <input
              type="text"
              placeholder="Rechercher une tâche..."
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
            <option value="URGENT">Urgente</option>
            <option value="HIGH">Haute</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Basse</option>
          </select>
        </div>

        {/* Right: New Task button */}
        <button
          onClick={() => onAddTask('TODO')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: '#0e121b',
            color: '#ffffff',
            borderRadius: '8px',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Plus size={14} />
          Nouvelle Tâche
        </button>
      </div>

      {/* Kanban Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(280px, 1fr))`,
        gap: '16px',
        alignItems: 'start',
        overflowX: 'auto',
        paddingBottom: '16px'
      }}>
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              style={{
                backgroundColor: '#f9f9fb',
                border: '1px solid #e2e4e9',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 220px)'
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e2e4e9',
                backgroundColor: '#ffffff',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: col.color
                  }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0e121b' }}>
                    {col.label}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: col.bg,
                    color: col.color,
                    border: `1px solid ${col.border}`,
                    padding: '1px 7px',
                    borderRadius: '10px'
                  }}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onAddTask(col.id)}
                  title="Ajouter dans cette colonne"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#868c98',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f3f6'; e.currentTarget.style.color = '#0e121b'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#868c98'; }}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Cards list */}
              <div style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                overflowY: 'auto',
                minHeight: '150px'
              }}>
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onStatusChange={onStatusChange}
                  />
                ))}

                {colTasks.length === 0 && (
                  <div style={{
                    padding: '24px 12px',
                    textAlign: 'center',
                    color: '#868c98',
                    fontSize: '12px',
                    border: '1px dashed #e2e4e9',
                    borderRadius: '8px'
                  }}>
                    Aucune tâche
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

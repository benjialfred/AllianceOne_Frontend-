import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailDrawer } from '../components/TaskDetailDrawer';
import { tasksApi } from '../services/api';
import type { Task, Project, TaskStatus } from '../types';

export const BoardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [defaultColumnStatus, setDefaultColumnStatus] = useState<TaskStatus>('TODO');
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
      console.error('Failed to load board tasks:', err);
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

  const handleAddTask = (status?: TaskStatus) => {
    setDefaultColumnStatus(status || 'TODO');
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await tasksApi.changeTaskStatus(taskId, newStatus);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Tableau Kanban"
        subtitle="Visualisez les flux de travail par statut, priorisez et avancez en équipe."
        breadcrumbs={[{ label: 'Espace Travail' }, { label: 'Tableau Kanban' }]}
      />

      <div style={{ flex: 1 }}>
        <KanbanBoard
          tasks={tasks}
          projects={projects}
          onTaskClick={handleOpenTask}
          onAddTask={handleAddTask}
          onStatusChange={handleStatusChange}
        />
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={loadData}
        initialStatus={defaultColumnStatus}
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban, Plus, Search, Calendar, Clock, CheckCircle2,
  Users, ArrowRight, MoreHorizontal, Edit3, Trash2
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ProjectModal } from '../components/ProjectModal';
import { tasksApi } from '../services/api';
import type { Project, ProjectStatus } from '../types';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    const map: Record<ProjectStatus, { label: string; bg: string; color: string }> = {
      PLANNING: { label: 'Planification', bg: '#f1f5f9', color: '#475569' },
      ACTIVE: { label: 'En cours', bg: '#dbeafe', color: '#1d4ed8' },
      ON_HOLD: { label: 'En pause', bg: '#fef3c7', color: '#d97706' },
      COMPLETED: { label: 'Terminé', bg: '#dcfce7', color: '#15803d' },
      ARCHIVED: { label: 'Archivé', bg: '#f3f4f6', color: '#6b7280' },
    };
    const c = map[status] || map.ACTIVE;
    return (
      <span style={{
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.color,
        padding: '2px 8px',
        borderRadius: '6px'
      }}>
        {c.label}
      </span>
    );
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <PageHeader
        title="Portefeuille de Projets"
        subtitle="Pilotez vos initiatives, jalons et charges de travail par projet."
        breadcrumbs={[{ label: 'Espace Travail' }, { label: 'Projets' }]}
        actions={
          <button
            onClick={() => {
              setProjectToEdit(null);
              setIsProjectModalOpen(true);
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
            Nouveau Projet
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
            placeholder="Rechercher un projet..."
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
          <option value="ACTIVE">En cours</option>
          <option value="PLANNING">En planification</option>
          <option value="ON_HOLD">En pause</option>
          <option value="COMPLETED">Terminé</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/tasks/projects/${project.id}`)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e4e9',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e4e9';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              {/* Header: Code badge, status, color pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: project.color || '#3b82f6',
                    backgroundColor: `${project.color || '#3b82f6'}15`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.05em'
                  }}>
                    {project.code}
                  </span>
                  {getStatusBadge(project.status)}
                </div>
              </div>

              {/* Title & Description */}
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#0e121b',
                margin: '0 0 6px 0',
                lineHeight: 1.3
              }}>
                {project.name}
              </h3>

              <p style={{
                fontSize: '12px',
                color: '#525866',
                margin: '0 0 16px 0',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {project.description || 'Aucune description fournie.'}
              </p>

              {/* Progress bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#525866', marginBottom: '4px' }}>
                  <span>Progression</span>
                  <span style={{ color: '#0e121b' }}>{project.progress_percentage}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e4e9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${project.progress_percentage}%`,
                    height: '100%',
                    backgroundColor: project.color || '#3b82f6',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>

            {/* Footer meta info */}
            <div style={{
              paddingTop: '14px',
              borderTop: '1px solid #f3f3f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#525866'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} color="#16a34a" />
                  <span>{project.completed_tasks_count}/{project.total_tasks_count} tâches</span>
                </div>

                {Number(project.total_logged_hours) > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} color="#6366f1" />
                    <span>{Number(project.total_logged_hours)}h</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4f46e5', fontWeight: 600 }}>
                <span>Détails</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#868c98' }}>
            Aucun projet trouvé. Cliquez sur "Nouveau Projet" pour démarrer.
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={loadData}
        projectToEdit={projectToEdit}
      />
    </div>
  );
};

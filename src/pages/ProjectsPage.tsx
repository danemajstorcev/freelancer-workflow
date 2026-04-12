import { useState } from 'react';
import styled from 'styled-components';
import { useTheme as useStyledTheme } from 'styled-components';
import { useApp } from '../context/AppContext';
import type { Project } from '../types';
import type { AppTheme } from '../styles/theme';
import { PageInner, PageHeader, PageTitle, PageSub } from '../components/Layout/PageWrapper';
import { Card, Badge, Button, EmptyState, projectStatusColor, priorityColor } from '../components/UI/primitives';
import ProjectModal from '../components/Projects/ProjectModal';
import { formatCurrency, formatDate } from '../utils/helpers';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProjectCard = styled(Card)`
  padding: 1rem 1.125rem;
  transition: box-shadow 0.15s;
  &:hover { box-shadow: ${({ theme }) => theme.shadowMd}; }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
`;

const MetaItem = styled.span`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const WarnBanner = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.warning};
  margin-bottom: 1rem;
  padding: 10px 14px;
  background: ${({ theme }) => theme.warningLight};
  border-radius: ${({ theme }) => theme.radiusSm};
`;

export default function ProjectsPage() {
  const { state, dispatch } = useApp();
  const theme               = useStyledTheme() as AppTheme;

  const [showNew,      setShowNew]      = useState(false);
  const [editProject,  setEditProject]  = useState<Project | null>(null);

  return (
    <PageInner>
      <PageHeader>
        <div>
          <PageTitle>Projects</PageTitle>
          <PageSub>{state.projects.length} project{state.projects.length !== 1 ? 's' : ''}</PageSub>
        </div>
        <Button onClick={() => setShowNew(true)} disabled={state.clients.length === 0}>
          + New Project
        </Button>
      </PageHeader>

      {state.clients.length === 0 && (
        <WarnBanner>Add at least one client before creating a project.</WarnBanner>
      )}

      {state.projects.length === 0 ? (
        <EmptyState>
          <div className="icon">◧</div>
          <div className="title">No projects yet</div>
          <div className="sub">Create your first project to start tracking work.</div>
        </EmptyState>
      ) : (
        <List>
          {state.projects.map((project) => {
            const client    = state.clients.find((c) => c.id === project.clientId);
            const sColors   = projectStatusColor(project.status, theme);
            const pColors   = priorityColor(project.priority, theme);
            const taskCount = state.tasks.filter((t) => t.projectId === project.id).length;
            const doneTasks = state.tasks.filter((t) => t.projectId === project.id && t.status === 'Done').length;

            return (
              <ProjectCard key={project.id}>
                <CardTop>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '2px' }}>{project.name}</div>
                    <div style={{ fontSize: '0.76rem', color: theme.textSub }}>
                      {client?.name ?? 'No client'}{client?.company ? ` — ${client.company}` : ''}
                    </div>
                    <Meta>
                      {project.deadline && <MetaItem>📅 {formatDate(project.deadline)}</MetaItem>}
                      <MetaItem>💰 {formatCurrency(project.budget)}</MetaItem>
                      {taskCount > 0 && <MetaItem>✓ {doneTasks}/{taskCount} tasks</MetaItem>}
                    </Meta>
                  </div>
                  <BadgeRow>
                    <Badge color={sColors.color} bg={sColors.bg}>{project.status}</Badge>
                    <Badge color={pColors.color} bg={pColors.bg}>{project.priority}</Badge>
                  </BadgeRow>
                </CardTop>

                <ActionRow>
                  <Button variant="ghost" size="sm" style={{ flex: 1 }} onClick={() => setEditProject(project)}>✎ Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => {
                    if (confirm(`Delete "${project.name}"?`))
                      dispatch({ type: 'DELETE_PROJECT', payload: project.id });
                  }}>✕ Delete</Button>
                </ActionRow>
              </ProjectCard>
            );
          })}
        </List>
      )}

      {showNew && (
        <ProjectModal
          onSave={(p) => dispatch({ type: 'ADD_PROJECT', payload: p })}
          onClose={() => setShowNew(false)}
        />
      )}
      {editProject && (
        <ProjectModal
          project={editProject}
          onSave={(p) => dispatch({ type: 'UPDATE_PROJECT', payload: p })}
          onClose={() => setEditProject(null)}
        />
      )}
    </PageInner>
  );
}

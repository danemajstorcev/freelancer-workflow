import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { PageInner, PageHeader, PageTitle, PageSub } from '../components/Layout/PageWrapper';
import { Card, Badge, Avatar, clientStatusColor, projectStatusColor, priorityColor } from '../components/UI/primitives';
import { formatCurrency, formatDate, initials } from '../utils/helpers';
import { useTheme as useStyledTheme } from 'styled-components';
import type { AppTheme } from '../styles/theme';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.75rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled(Card)`
  padding: 1.25rem 1.5rem;
`;

const StatValue = styled.div`
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textSub};
  font-weight: 500;
`;

const StatDelta = styled.div<{ positive?: boolean }>`
  font-size: 0.7rem;
  color: ${({ positive, theme }) => positive ? theme.success : theme.textMuted};
  margin-top: 6px;
  font-weight: 500;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const SectionCard = styled(Card)`
  padding: 1.25rem;
`;

const SectionTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a { font-size: 0.72rem; color: ${({ theme }) => theme.accent}; font-weight: 500; cursor: pointer; }
`;

const ClientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};
  &:last-child { border-bottom: none; }
`;

const TaskRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};
  &:last-child { border-bottom: none; }
`;

export default function Dashboard() {
  const { state } = useApp();
  const navigate  = useNavigate();
  const theme     = useStyledTheme() as AppTheme;

  const totalValue   = state.clients.reduce((s, c) => s + c.value, 0);
  const closedValue  = state.clients.filter((c) => c.status === 'Closed').reduce((s, c) => s + c.value, 0);
  const activeProj   = state.projects.filter((p) => p.status === 'In Progress').length;
  const pendingTasks = state.tasks.filter((t) => t.status !== 'Done').length;

  const recentClients = [...state.clients].slice(-4).reverse();
  const urgentTasks   = state.tasks
    .filter((t) => t.status !== 'Done')
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))
    .slice(0, 5);

  return (
    <PageInner>
      <PageHeader>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <PageSub>Your freelance business at a glance</PageSub>
        </div>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatLabel>Total Pipeline</StatLabel>
          <StatValue>{formatCurrency(totalValue)}</StatValue>
          <StatDelta positive>{state.clients.length} clients total</StatDelta>
        </StatCard>
        <StatCard>
          <StatLabel>Closed Revenue</StatLabel>
          <StatValue>{formatCurrency(closedValue)}</StatValue>
          <StatDelta positive>{state.clients.filter((c) => c.status === 'Closed').length} deals won</StatDelta>
        </StatCard>
        <StatCard>
          <StatLabel>Active Projects</StatLabel>
          <StatValue>{activeProj}</StatValue>
          <StatDelta>{state.projects.length} total projects</StatDelta>
        </StatCard>
        <StatCard>
          <StatLabel>Open Tasks</StatLabel>
          <StatValue>{pendingTasks}</StatValue>
          <StatDelta>{state.tasks.filter((t) => t.status === 'Done').length} completed</StatDelta>
        </StatCard>
      </StatsGrid>

      <TwoCol>
        <SectionCard>
          <SectionTitle>
            Recent Clients
            <a onClick={() => navigate('/clients')}>View all →</a>
          </SectionTitle>
          {recentClients.length === 0
            ? <div style={{ fontSize: '0.8rem', color: theme.textMuted }}>No clients yet.</div>
            : recentClients.map((c) => {
                const colors = clientStatusColor(c.status, theme);
                return (
                  <ClientRow key={c.id}>
                    <Avatar bg={c.avatarColor} size={32}>{initials(c.name)}</Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.83rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                      <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{c.company}</div>
                    </div>
                    <Badge color={colors.color} bg={colors.bg}>{c.status}</Badge>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, minWidth: '60px', textAlign: 'right' }}>{formatCurrency(c.value)}</div>
                  </ClientRow>
                );
              })
          }
        </SectionCard>

        <SectionCard>
          <SectionTitle>
            Urgent Tasks
            <a onClick={() => navigate('/tasks')}>View all →</a>
          </SectionTitle>
          {urgentTasks.length === 0
            ? <div style={{ fontSize: '0.8rem', color: theme.textMuted }}>No open tasks.</div>
            : urgentTasks.map((t) => {
                const proj   = state.projects.find((p) => p.id === t.projectId);
                const pColor = priorityColor(t.priority, theme);
                return (
                  <TaskRow key={t.id}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.83rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                      <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{proj?.name ?? '—'} · Due {formatDate(t.dueDate)}</div>
                    </div>
                    <Badge color={pColor.color} bg={pColor.bg}>{t.priority}</Badge>
                  </TaskRow>
                );
              })
          }
        </SectionCard>
      </TwoCol>
    </PageInner>
  );
}

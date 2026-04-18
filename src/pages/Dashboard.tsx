import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useApp } from "../context/AppContext";
import {
  PageInner,
  PageHeader,
  PageTitle,
  PageSub,
} from "../components/Layout/PageWrapper";
import {
  Card,
  Badge,
  Avatar,
  clientStatusColor,
  projectStatusColor,
  priorityColor,
} from "../components/UI/primitives";
import { formatCurrency, formatDate, initials } from "../utils/helpers";
import { useTheme as useStyledTheme } from "styled-components";
import type { AppTheme } from "../styles/theme";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.75rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 400px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }
`;

const StatCard = styled(Card)`
  padding: 1.1rem 1.25rem;
  @media (max-width: 480px) {
    padding: 0.9rem 1rem;
  }
`;

const StatValue = styled.div`
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    font-size: 1.35rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textSub};
  font-weight: 500;
`;

const StatDelta = styled.div<{ positive?: boolean }>`
  font-size: 0.68rem;
  color: ${({ positive, theme }) =>
    positive ? theme.success : theme.textMuted};
  margin-top: 5px;
  font-weight: 500;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled(Card)`
  padding: 1.25rem;
  overflow: hidden;
`;

const SectionTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    font-size: 0.72rem;
    color: ${({ theme }) => theme.accent};
    font-weight: 500;
    cursor: pointer;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};
  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 400px) {
    gap: 7px;
  }
`;

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const theme = useStyledTheme() as AppTheme;

  const totalValue = state.clients.reduce((s, c) => s + c.value, 0);
  const closedValue = state.clients
    .filter((c) => c.status === "Closed")
    .reduce((s, c) => s + c.value, 0);
  const activeProj = state.projects.filter(
    (p) => p.status === "In Progress",
  ).length;
  const pendingTasks = state.tasks.filter((t) => t.status !== "Done").length;

  const recentClients = [...state.clients].slice(-4).reverse();
  const urgentTasks = state.tasks
    .filter((t) => t.status !== "Done")
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
        {[
          {
            label: "Total Pipeline",
            value: formatCurrency(totalValue),
            delta: `${state.clients.length} clients`,
            positive: true,
          },
          {
            label: "Closed Revenue",
            value: formatCurrency(closedValue),
            delta: `${state.clients.filter((c) => c.status === "Closed").length} deals won`,
            positive: true,
          },
          {
            label: "Active Projects",
            value: String(activeProj),
            delta: `${state.projects.length} total`,
            positive: false,
          },
          {
            label: "Open Tasks",
            value: String(pendingTasks),
            delta: `${state.tasks.filter((t) => t.status === "Done").length} done`,
            positive: false,
          },
        ].map(({ label, value, delta, positive }) => (
          <StatCard key={label}>
            <StatLabel>{label}</StatLabel>
            <StatValue>{value}</StatValue>
            <StatDelta positive={positive}>{delta}</StatDelta>
          </StatCard>
        ))}
      </StatsGrid>

      <TwoCol>
        <SectionCard>
          <SectionTitle>
            Recent Clients
            <a onClick={() => navigate("/clients")}>View all →</a>
          </SectionTitle>
          {recentClients.length === 0 ? (
            <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>
              No clients yet.
            </div>
          ) : (
            recentClients.map((c) => {
              const colors = clientStatusColor(c.status, theme);
              return (
                <Row key={c.id}>
                  <Avatar bg={c.avatarColor} size={30}>
                    {initials(c.name)}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: theme.textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.company}
                    </div>
                  </div>
                  <Badge
                    color={colors.color}
                    bg={colors.bg}
                    style={{ fontSize: "0.6rem", flexShrink: 0 }}
                  >
                    {c.status}
                  </Badge>
                </Row>
              );
            })
          )}
        </SectionCard>

        <SectionCard>
          <SectionTitle>
            Urgent Tasks
            <a onClick={() => navigate("/tasks")}>View all →</a>
          </SectionTitle>
          {urgentTasks.length === 0 ? (
            <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>
              No open tasks.
            </div>
          ) : (
            urgentTasks.map((t) => {
              const proj = state.projects.find((p) => p.id === t.projectId);
              const pColor = priorityColor(t.priority, theme);
              return (
                <Row key={t.id}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.title}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>
                      {proj?.name ?? "—"} · {formatDate(t.dueDate)}
                    </div>
                  </div>
                  <Badge
                    color={pColor.color}
                    bg={pColor.bg}
                    style={{ fontSize: "0.6rem", flexShrink: 0 }}
                  >
                    {t.priority}
                  </Badge>
                </Row>
              );
            })
          )}
        </SectionCard>
      </TwoCol>
    </PageInner>
  );
}

import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { useTheme } from "../../context/ThemeContext";
import { useApp } from "../../context/AppContext";

const SidebarWrap = styled.aside`
  width: 220px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.bgSidebar};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 50;
`;

const Logo = styled.div`
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  .mark {
    color: ${({ theme }) => theme.accent};
    font-size: 1.3rem;
  }
  .name {
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: -0.02em;
  }
  .sub {
    font-size: 0.65rem;
    color: ${({ theme }) => theme.textMuted};
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
`;

const NavGroup = styled.nav`
  flex: 1;
  padding: 0.75rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavLabel = styled.div`
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
  padding: 0.6rem 0.6rem 0.3rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radiusSm};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSub};
  transition: all 0.15s;

  .icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
  }
  .count {
    margin-left: auto;
    font-size: 0.65rem;
    font-weight: 700;
    background: ${({ theme }) => theme.bgHover};
    color: ${({ theme }) => theme.textMuted};
    padding: 1px 6px;
    border-radius: 99px;
  }

  &:hover {
    background: ${({ theme }) => theme.bgHover};
    color: ${({ theme }) => theme.text};
  }
  &.active {
    background: ${({ theme }) => theme.accentLight};
    color: ${({ theme }) => theme.accent};
    font-weight: 600;
    .count {
      background: ${({ theme }) => theme.accent};
      color: #fff;
    }
  }
`;

const BottomSection = styled.div`
  padding: 0.75rem 0.6rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radiusSm};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSub};
  background: none;
  border: none;
  width: 100%;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.bgHover};
    color: ${({ theme }) => theme.text};
  }
  .icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
  }
`;

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();
  const { state } = useApp();

  const activeClients = state.clients.filter(
    (c) => c.status !== "Closed",
  ).length;
  const activeProjects = state.projects.filter(
    (p) => p.status === "In Progress",
  ).length;
  const pendingTasks = state.tasks.filter((t) => t.status !== "Done").length;

  return (
    <SidebarWrap>
      <Logo>
      <Link to="/">  <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "2px",
            textDecoration: "none",
          }}
        >
          <span className="mark">◆</span>
          <span className="name">FreelanceFlow</span>
        </div>
        <div className="sub">Workflow Manager</div></Link>
      </Logo>

      <NavGroup>
        <NavLabel>Workspace</NavLabel>
        <NavItem to="/" end>
          <span className="icon">⊞</span> Dashboard
        </NavItem>

        <NavLabel>Manage</NavLabel>
        <NavItem to="/pipeline">
          <span className="icon">⟳</span> Pipeline{" "}
          <span className="count">{activeClients}</span>
        </NavItem>
        <NavItem to="/clients">
          {" "}
          <span className="icon">◎</span> Clients{" "}
          <span className="count">{state.clients.length}</span>
        </NavItem>
        <NavItem to="/projects">
          <span className="icon">◧</span> Projects{" "}
          <span className="count">{activeProjects}</span>
        </NavItem>
        <NavItem to="/tasks">
          {" "}
          <span className="icon">✓</span> Tasks{" "}
          <span className="count">{pendingTasks}</span>
        </NavItem>
      </NavGroup>

      <BottomSection>
        <ThemeToggle onClick={toggleTheme}>
          <span className="icon">{isDark ? "○" : "●"}</span>
          {isDark ? "Light Mode" : "Dark Mode"}
        </ThemeToggle>
      </BottomSection>
    </SidebarWrap>
  );
}

import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useTheme } from "../../context/ThemeContext";
import { useApp } from "../../context/AppContext";

const MOBILE = "768px";
const TABLET = "1024px";

const Backdrop = styled.div<{ open: boolean }>`
  display: none;
  @media (max-width: ${MOBILE}) {
    display: ${({ open }) => (open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 99;
  }
`;

const SidebarWrap = styled.aside<{ open: boolean }>`
  width: 220px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.bgSidebar};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: ${TABLET}) {
    width: 200px;
  }

  @media (max-width: ${MOBILE}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
    box-shadow: ${({ open }) => (open ? "4px 0 24px rgba(0,0,0,0.3)" : "none")};
  }
`;

const Logo = styled.div`
  padding: 1.1rem 1.25rem 0.9rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .mark {
    color: ${({ theme }) => theme.accent};
    font-size: 1.2rem;
    line-height: 1;
  }
  .name {
    font-weight: 800;
    font-size: 0.95rem;
    letter-spacing: -0.02em;
  }
  .sub {
    font-size: 0.6rem;
    color: ${({ theme }) => theme.textMuted};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 1px;
  }
`;

const CloseBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textMuted};
  font-size: 1.3rem;
  padding: 2px;
  line-height: 1;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NavGroup = styled.nav`
  flex: 1;
  padding: 0.75rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
`;

const NavLabel = styled.div`
  font-size: 0.6rem;
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
  padding: 9px 10px;
  border-radius: ${({ theme }) => theme.radiusSm};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSub};
  transition: all 0.15s;

  .icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
  }
  .label {
    flex: 1;
  }
  .count {
    font-size: 0.65rem;
    font-weight: 700;
    background: ${({ theme }) => theme.bgHover};
    color: ${({ theme }) => theme.textMuted};
    padding: 2px 7px;
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
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
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

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const { state } = useApp();

  const activeClients = state.clients.filter(
    (c) => c.status !== "Closed",
  ).length;
  const activeProjects = state.projects.filter(
    (p) => p.status === "In Progress",
  ).length;
  const pendingTasks = state.tasks.filter((t) => t.status !== "Done").length;

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      <Backdrop open={open} onClick={onClose} />
      <SidebarWrap open={open}>
        <Logo>
          <div className="brand">
            <span className="mark">◆</span>
            <div>
              <div className="name">FreelanceFlow</div>
              <div className="sub">Workflow Manager</div>
            </div>
          </div>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Logo>

        <NavGroup>
          <NavLabel>Workspace</NavLabel>
          <NavItem to="/" end onClick={handleNavClick}>
            <span className="icon">⊞</span>
            <span className="label">Dashboard</span>
          </NavItem>

          <NavLabel>Manage</NavLabel>
          <NavItem to="/pipeline" onClick={handleNavClick}>
            <span className="icon">⟳</span>
            <span className="label">Pipeline</span>
            <span className="count">{activeClients}</span>
          </NavItem>
          <NavItem to="/clients" onClick={handleNavClick}>
            <span className="icon">◎</span>
            <span className="label">Clients</span>
            <span className="count">{state.clients.length}</span>
          </NavItem>
          <NavItem to="/projects" onClick={handleNavClick}>
            <span className="icon">◧</span>
            <span className="label">Projects</span>
            <span className="count">{activeProjects}</span>
          </NavItem>
          <NavItem to="/tasks" onClick={handleNavClick}>
            <span className="icon">✓</span>
            <span className="label">Tasks</span>
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
    </>
  );
}

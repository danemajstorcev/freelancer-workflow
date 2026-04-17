import styled from "styled-components";
import { useLocation } from "react-router-dom";

const Bar = styled.header`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    height: 54px;
    background: ${({ theme }) => theme.bgSidebar};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    position: sticky;
    top: 0;
    z-index: 50;
    flex-shrink: 0;
  }
`;

const HamburgerBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radiusSm};
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.bgHover};
  }
`;

const TopBarTitle = styled.div`
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 6px;

  .mark {
    color: ${({ theme }) => theme.accent};
  }
`;

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/pipeline": "Pipeline",
  "/clients": "Clients",
  "/projects": "Projects",
  "/tasks": "Tasks",
};

interface Props {
  onMenuOpen: () => void;
}

export default function TopBar({ onMenuOpen }: Props) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "FreelanceFlow";

  return (
    <Bar>
      <HamburgerBtn onClick={onMenuOpen} aria-label="Open menu">
        ☰
      </HamburgerBtn>
      <TopBarTitle>
        <span className="mark">◆</span> {title}
      </TopBarTitle>
      <div style={{ width: "32px" }} />
    </Bar>
  );
}

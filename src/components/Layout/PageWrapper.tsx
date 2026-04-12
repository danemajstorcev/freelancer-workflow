import styled from 'styled-components';

export const AppShell = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const PageContent = styled.main`
  flex: 1;
  overflow-y: auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;

  @media (max-width: 480px) { font-size: 1.15rem; }
`;

export const PageSub = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.textSub};
  margin-top: 2px;
`;

export const PageInner = styled.div`
  padding: 1.75rem 2rem;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 1024px) { padding: 1.5rem 1.5rem; }
  @media (max-width: 768px)  { padding: 1.25rem 1rem;  }
  @media (max-width: 480px)  { padding: 1rem 0.875rem; }
`;

import styled from 'styled-components';

export const AppShell = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const PageContent = styled.main`
  flex: 1;
  overflow-y: auto;
  min-width: 0;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

export const PageSub = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.textSub};
  margin-top: 2px;
`;

export const PageInner = styled.div`
  padding: 1.75rem 2rem;
  max-width: 1200px;
`;

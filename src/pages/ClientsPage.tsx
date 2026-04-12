import { useState } from 'react';
import styled from 'styled-components';
import { useTheme as useStyledTheme } from 'styled-components';
import { useApp } from '../context/AppContext';
import type { Client } from '../types';
import type { AppTheme } from '../styles/theme';
import { PageInner, PageHeader, PageTitle, PageSub } from '../components/Layout/PageWrapper';
import { Card, Avatar, Badge, Button, EmptyState, clientStatusColor } from '../components/UI/primitives';
import ClientModal from '../components/Clients/ClientModal';
import { formatCurrency, formatDate, initials } from '../utils/helpers';

const SearchBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    width: 100%;
    input { flex: 1; min-width: 0; }
    button { flex-shrink: 0; }
  }
`;

const SearchInput = styled.input`
  background: ${({ theme }) => theme.bgInput};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radiusSm};
  color: ${({ theme }) => theme.text};
  padding: 8px 12px;
  font-size: 0.875rem;
  outline: none;
  width: 200px;
  transition: border-color 0.15s;
  &::placeholder { color: ${({ theme }) => theme.textMuted}; }
  &:focus { border-color: ${({ theme }) => theme.accent}; }

  @media (max-width: 480px) { width: 100%; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 400px) { grid-template-columns: 1fr; }
`;

const ClientCard = styled(Card)`
  padding: 1.125rem;
  transition: box-shadow 0.15s, transform 0.15s;
  &:hover { box-shadow: ${({ theme }) => theme.shadowMd}; transform: translateY(-2px); }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export default function ClientsPage() {
  const { state, dispatch } = useApp();
  const theme               = useStyledTheme() as AppTheme;

  const [showNew,     setShowNew]     = useState(false);
  const [editClient,  setEditClient]  = useState<Client | null>(null);
  const [search,      setSearch]      = useState('');

  const filtered = state.clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageInner>
      <PageHeader>
        <div>
          <PageTitle>Clients</PageTitle>
          <PageSub>{state.clients.length} client{state.clients.length !== 1 ? 's' : ''} total</PageSub>
        </div>
        <SearchBar>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
          />
          <Button onClick={() => setShowNew(true)}>+ New</Button>
        </SearchBar>
      </PageHeader>

      {filtered.length === 0 ? (
        <EmptyState>
          <div className="icon">◎</div>
          <div className="title">No clients yet</div>
          <div className="sub">Add your first client to start managing your pipeline.</div>
          <Button onClick={() => setShowNew(true)} size="sm">+ Add Client</Button>
        </EmptyState>
      ) : (
        <Grid>
          {filtered.map((client) => {
            const colors = clientStatusColor(client.status, theme);
            return (
              <ClientCard key={client.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar bg={client.avatarColor}>{initials(client.name)}</Avatar>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{client.name}</div>
                      <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{client.company}</div>
                    </div>
                  </div>
                  <Badge color={colors.color} bg={colors.bg} style={{ flexShrink: 0 }}>{client.status}</Badge>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {client.email && <div style={{ fontSize: '0.76rem', color: theme.textSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>✉ {client.email}</div>}
                  {client.phone && <div style={{ fontSize: '0.76rem', color: theme.textSub }}>☎ {client.phone}</div>}
                  <div style={{ fontSize: '0.76rem', color: theme.textSub, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formatDate(client.createdAt)}</span>
                    <span style={{ fontWeight: 700, color: theme.text }}>{formatCurrency(client.value)}</span>
                  </div>
                </div>

                {client.tags.length > 0 && (
                  <TagRow>
                    {client.tags.map((t) => (
                      <Badge key={t} color={theme.textMuted} bg={theme.bgTag} style={{ fontSize: '0.62rem' }}>{t}</Badge>
                    ))}
                  </TagRow>
                )}

                <Actions>
                  <Button variant="ghost" size="sm" style={{ flex: 1 }} onClick={() => setEditClient(client)}>✎ Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => {
                    if (confirm(`Delete ${client.name}?`))
                      dispatch({ type: 'DELETE_CLIENT', payload: client.id });
                  }}>✕</Button>
                </Actions>
              </ClientCard>
            );
          })}
        </Grid>
      )}

      {showNew && (
        <ClientModal
          onSave={(c) => dispatch({ type: 'ADD_CLIENT', payload: c })}
          onClose={() => setShowNew(false)}
        />
      )}
      {editClient && (
        <ClientModal
          client={editClient}
          onSave={(c) => dispatch({ type: 'UPDATE_CLIENT', payload: c })}
          onClose={() => setEditClient(null)}
        />
      )}
    </PageInner>
  );
}

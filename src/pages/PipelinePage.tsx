import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { useTheme as useStyledTheme } from 'styled-components';
import type { ClientStatus, Client } from '../types';
import type { AppTheme } from '../styles/theme';
import { PageInner, PageHeader, PageTitle, PageSub } from '../components/Layout/PageWrapper';
import { Card, Avatar, Badge, Button, IconBtn, clientStatusColor, EmptyState } from '../components/UI/primitives';
import ClientModal from '../components/Clients/ClientModal';
import { formatCurrency, initials } from '../utils/helpers';

const COLUMNS: ClientStatus[] = ['Lead', 'Contacted', 'Negotiation', 'Closed'];

const BoardWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 1000px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

const Column = styled.div<{ over: boolean }>`
  background: ${({ theme }) => theme.bgCard};
  border: 1.5px solid ${({ over, theme }) => over ? theme.accent : theme.border};
  border-radius: ${({ theme }) => theme.radius};
  min-height: 360px;
  transition: border-color 0.15s;
  display: flex;
  flex-direction: column;
`;

const ColHeader = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ColTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const ColCount = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  background: ${({ theme }) => theme.bgHover};
  color: ${({ theme }) => theme.textMuted};
  padding: 2px 7px;
  border-radius: 99px;
`;

const ColBody = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const DragCard = styled(Card)<{ dragging: boolean }>`
  padding: 12px;
  cursor: grab;
  opacity: ${({ dragging }) => dragging ? 0.4 : 1};
  transition: transform 0.1s, box-shadow 0.1s, opacity 0.15s;
  &:hover { transform: translateY(-2px); box-shadow: ${({ theme }) => theme.shadowMd}; }
  &:active { cursor: grabbing; }
`;

const ClientName = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 2px;
`;

const ClientSub = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 8px;
`;

export default function PipelinePage() {
  const { state, dispatch } = useApp();
  const theme               = useStyledTheme() as AppTheme;

  const [editClient, setEditClient] = useState<Client | null>(null);
  const [showNew,    setShowNew]    = useState(false);
  const [overCol,    setOverCol]    = useState<ClientStatus | null>(null);

  const dragId = useRef<string | null>(null);

  const onDragStart = (id: string) => { dragId.current = id; };
  const onDragEnd   = ()           => { dragId.current = null; setOverCol(null); };

  const onDragOver = (e: React.DragEvent, status: ClientStatus) => {
    e.preventDefault();
    setOverCol(status);
  };

  const onDrop = (status: ClientStatus) => {
    if (dragId.current) {
      dispatch({ type: 'MOVE_CLIENT', payload: { id: dragId.current, status } });
    }
    setOverCol(null);
  };

  const colValue = (status: ClientStatus) =>
    state.clients.filter((c) => c.status === status).reduce((s, c) => s + c.value, 0);

  return (
    <PageInner>
      <PageHeader>
        <div>
          <PageTitle>Sales Pipeline</PageTitle>
          <PageSub>Drag clients between stages to track progress</PageSub>
        </div>
        <Button onClick={() => setShowNew(true)}>+ New Client</Button>
      </PageHeader>

      <BoardWrap>
        {COLUMNS.map((status) => {
          const clients = state.clients.filter((c) => c.status === status);
          const colors  = clientStatusColor(status, theme);
          return (
            <Column
              key={status}
              over={overCol === status}
              onDragOver={(e) => onDragOver(e, status)}
              onDragLeave={() => setOverCol(null)}
              onDrop={() => onDrop(status)}
            >
              <ColHeader>
                <div>
                  <ColTitle style={{ color: colors.color }}>{status}</ColTitle>
                  {clients.length > 0 && (
                    <div style={{ fontSize: '0.68rem', color: theme.textMuted, marginTop: '2px' }}>
                      {formatCurrency(colValue(status))}
                    </div>
                  )}
                </div>
                <ColCount>{clients.length}</ColCount>
              </ColHeader>

              <ColBody>
                {clients.length === 0 && (
                  <EmptyState style={{ padding: '2rem 1rem', minHeight: 'auto' }}>
                    <div className="sub">Drop clients here</div>
                  </EmptyState>
                )}
                {clients.map((client) => (
                  <DragCard
                    key={client.id}
                    dragging={dragId.current === client.id}
                    draggable
                    onDragStart={() => onDragStart(client.id)}
                    onDragEnd={onDragEnd}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Avatar bg={client.avatarColor} size={28}>{initials(client.name)}</Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <ClientName>{client.name}</ClientName>
                        <ClientSub style={{ marginBottom: 0 }}>{client.company}</ClientSub>
                      </div>
                      <IconBtn onClick={() => setEditClient(client)} style={{ padding: '2px' }}>✎</IconBtn>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {client.tags.slice(0, 2).map((t) => (
                          <Badge key={t} color={theme.textMuted} bg={theme.bgTag} style={{ fontSize: '0.62rem' }}>{t}</Badge>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{formatCurrency(client.value)}</span>
                    </div>
                  </DragCard>
                ))}
              </ColBody>
            </Column>
          );
        })}
      </BoardWrap>

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

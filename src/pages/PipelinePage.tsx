import { useState, useRef } from "react";
import styled from "styled-components";
import { useApp } from "../context/AppContext";
import { useTheme as useStyledTheme } from "styled-components";
import type { ClientStatus, Client } from "../types";
import type { AppTheme } from "../styles/theme";
import {
  PageInner,
  PageHeader,
  PageTitle,
  PageSub,
} from "../components/Layout/PageWrapper";
import {
  Card,
  Avatar,
  Badge,
  Button,
  IconBtn,
  clientStatusColor,
  EmptyState,
} from "../components/UI/primitives";
import ClientModal from "../components/Clients/ClientModal";
import { formatCurrency, initials } from "../utils/helpers";

const COLUMNS: ClientStatus[] = ["Lead", "Contacted", "Negotiation", "Closed"];

const ScrollHint = styled.div`
  display: none;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.75rem;
  @media (max-width: 768px) {
    display: block;
  }
`;

const BoardScroll = styled.div`
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 1rem;
    margin: 0 -0.875rem;
    padding-left: 0.875rem;
    padding-right: 0.875rem;
  }
`;

const BoardWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, minmax(210px, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 230px);
    gap: 0.75rem;
  }
`;

const Column = styled.div<{ over: boolean }>`
  background: ${({ theme }) => theme.bgCard};
  border: 1.5px solid
    ${({ over, theme }) => (over ? theme.accent : theme.border)};
  border-radius: ${({ theme }) => theme.radius};
  min-height: 300px;
  transition: border-color 0.15s;
  display: flex;
  flex-direction: column;
`;

const ColHeader = styled.div`
  padding: 10px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ColTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const ColCount = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  background: ${({ theme }) => theme.bgHover};
  color: ${({ theme }) => theme.textMuted};
  padding: 2px 7px;
  border-radius: 99px;
`;

const ColBody = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
`;

const DragCard = styled(Card)<{ dragging: boolean }>`
  padding: 10px;
  cursor: grab;
  opacity: ${({ dragging }) => (dragging ? 0.4 : 1)};
  transition:
    transform 0.1s,
    box-shadow 0.1s,
    opacity 0.15s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowMd};
  }
  &:active {
    cursor: grabbing;
  }
`;

export default function PipelinePage() {
  const { state, dispatch } = useApp();
  const theme = useStyledTheme() as AppTheme;

  const [editClient, setEditClient] = useState<Client | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [overCol, setOverCol] = useState<ClientStatus | null>(null);
  const dragId = useRef<string | null>(null);

  const onDragStart = (id: string) => {
    dragId.current = id;
  };
  const onDragEnd = () => {
    dragId.current = null;
    setOverCol(null);
  };
  const onDragOver = (e: React.DragEvent, s: ClientStatus) => {
    e.preventDefault();
    setOverCol(s);
  };
  const onDrop = (s: ClientStatus) => {
    if (dragId.current)
      dispatch({
        type: "MOVE_CLIENT",
        payload: { id: dragId.current, status: s },
      });
    setOverCol(null);
  };

  const colValue = (s: ClientStatus) =>
    state.clients
      .filter((c) => c.status === s)
      .reduce((sum, c) => sum + c.value, 0);

  return (
    <PageInner>
      <PageHeader>
        <div>
          <PageTitle>Sales Pipeline</PageTitle>
          <PageSub>Drag clients between stages to track progress</PageSub>
        </div>
        <Button onClick={() => setShowNew(true)}>+ New Client</Button>
      </PageHeader>

      <ScrollHint>← Scroll to see all stages →</ScrollHint>

      <BoardScroll>
        <BoardWrap>
          {COLUMNS.map((status) => {
            const clients = state.clients.filter((c) => c.status === status);
            const colors = clientStatusColor(status, theme);
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
                    <ColTitle style={{ color: colors.color }}>
                      {status}
                    </ColTitle>
                    {clients.length > 0 && (
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: theme.textMuted,
                          marginTop: "1px",
                        }}
                      >
                        {formatCurrency(colValue(status))}
                      </div>
                    )}
                  </div>
                  <ColCount>{clients.length}</ColCount>
                </ColHeader>

                <ColBody>
                  {clients.length === 0 && (
                    <EmptyState
                      style={{ padding: "1.5rem 0.5rem", minHeight: "auto" }}
                    >
                      <div className="sub" style={{ fontSize: "0.7rem" }}>
                        Drop here
                      </div>
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          marginBottom: "7px",
                        }}
                      >
                        <Avatar bg={client.avatarColor} size={26}>
                          {initials(client.name)}
                        </Avatar>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.68rem",
                              color: theme.textMuted,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.company}
                          </div>
                        </div>
                        <IconBtn
                          onClick={() => setEditClient(client)}
                          style={{ padding: "2px", flexShrink: 0 }}
                        >
                          ✎
                        </IconBtn>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "3px",
                            flexWrap: "wrap",
                          }}
                        >
                          {client.tags.slice(0, 2).map((t) => (
                            <Badge
                              key={t}
                              color={theme.textMuted}
                              bg={theme.bgTag}
                              style={{ fontSize: "0.58rem" }}
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                          {formatCurrency(client.value)}
                        </span>
                      </div>
                    </DragCard>
                  ))}
                </ColBody>
              </Column>
            );
          })}
        </BoardWrap>
      </BoardScroll>

      {showNew && (
        <ClientModal
          onSave={(c) => dispatch({ type: "ADD_CLIENT", payload: c })}
          onClose={() => setShowNew(false)}
        />
      )}
      {editClient && (
        <ClientModal
          client={editClient}
          onSave={(c) => dispatch({ type: "UPDATE_CLIENT", payload: c })}
          onClose={() => setEditClient(null)}
        />
      )}
    </PageInner>
  );
}

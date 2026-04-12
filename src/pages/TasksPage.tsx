import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useTheme as useStyledTheme } from 'styled-components';
import { useApp } from '../context/AppContext';
import type { Task, TaskStatus } from '../types';
import type { AppTheme } from '../styles/theme';
import { PageInner, PageHeader, PageTitle, PageSub } from '../components/Layout/PageWrapper';
import { Card, Badge, Button, IconBtn, EmptyState, priorityColor } from '../components/UI/primitives';
import TaskModal from '../components/Tasks/TaskModal';
import { formatDate } from '../utils/helpers';

const COLUMNS: { status: TaskStatus; label: string; icon: string }[] = [
  { status: 'Todo',        label: 'To Do',      icon: '○' },
  { status: 'In Progress', label: 'In Progress', icon: '◑' },
  { status: 'Done',        label: 'Done',        icon: '●' },
];

const BoardWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: start;
  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;

const Column = styled.div<{ over: boolean }>`
  background: ${({ theme }) => theme.bgCard};
  border: 1.5px solid ${({ over, theme }) => over ? theme.accent : theme.border};
  border-radius: ${({ theme }) => theme.radius};
  min-height: 300px;
  transition: border-color 0.15s;
`;

const ColHeader = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColIcon = styled.span<{ status: TaskStatus }>`
  color: ${({ status, theme }) =>
    status === 'Done' ? theme.success :
    status === 'In Progress' ? theme.info :
    theme.textMuted};
`;

const ColTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ColCount = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  background: ${({ theme }) => theme.bgHover};
  color: ${({ theme }) => theme.textMuted};
  padding: 2px 7px;
  border-radius: 99px;
  margin-left: auto;
`;

const ColBody = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TaskCard = styled(Card)<{ dragging: boolean; done: boolean }>`
  padding: 10px 12px;
  cursor: grab;
  opacity: ${({ dragging }) => dragging ? 0.4 : 1};
  transition: transform 0.1s, box-shadow 0.1s;
  &:hover { transform: translateY(-2px); box-shadow: ${({ theme }) => theme.shadowMd}; }
  &:active { cursor: grabbing; }
`;

const TaskTitle = styled.div<{ done: boolean }>`
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: ${({ done }) => done ? 'line-through' : 'none'};
  opacity: ${({ done }) => done ? 0.5 : 1};
  margin-bottom: 6px;
`;

export default function TasksPage() {
  const { state, dispatch } = useApp();
  const theme               = useStyledTheme() as AppTheme;

  const [showNew, setShowNew] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [overCol, setOverCol]  = useState<TaskStatus | null>(null);

  const dragId = useRef<string | null>(null);

  const onDragStart = (id: string) => { dragId.current = id; };
  const onDragEnd   = ()           => { dragId.current = null; setOverCol(null); };
  const onDragOver  = (e: React.DragEvent, s: TaskStatus) => { e.preventDefault(); setOverCol(s); };
  const onDrop      = (s: TaskStatus) => {
    if (dragId.current) dispatch({ type: 'MOVE_TASK', payload: { id: dragId.current, status: s } });
    setOverCol(null);
  };

  return (
    <PageInner>
      <PageHeader>
        <div>
          <PageTitle>Tasks</PageTitle>
          <PageSub>Drag tasks across columns to update status</PageSub>
        </div>
        <Button onClick={() => setShowNew(true)} disabled={state.projects.length === 0}>
          + New Task
        </Button>
      </PageHeader>

      {state.projects.length === 0 && (
        <div style={{ fontSize: '0.82rem', color: theme.warning, marginBottom: '1rem', padding: '10px 14px', background: theme.warningLight, borderRadius: theme.radiusSm }}>
          Create a project first before adding tasks.
        </div>
      )}

      <BoardWrap>
        {COLUMNS.map(({ status, label, icon }) => {
          const tasks = state.tasks.filter((t) => t.status === status);
          return (
            <Column
              key={status}
              over={overCol === status}
              onDragOver={(e) => onDragOver(e, status)}
              onDragLeave={() => setOverCol(null)}
              onDrop={() => onDrop(status)}
            >
              <ColHeader>
                <ColIcon status={status}>{icon}</ColIcon>
                <ColTitle>{label}</ColTitle>
                <ColCount>{tasks.length}</ColCount>
              </ColHeader>

              <ColBody>
                {tasks.length === 0 && (
                  <EmptyState style={{ padding: '1.5rem 1rem', minHeight: 'auto' }}>
                    <div className="sub">No tasks here</div>
                  </EmptyState>
                )}
                {tasks.map((task) => {
                  const proj   = state.projects.find((p) => p.id === task.projectId);
                  const pColor = priorityColor(task.priority, theme);
                  const done   = task.status === 'Done';
                  return (
                    <TaskCard
                      key={task.id}
                      dragging={dragId.current === task.id}
                      done={done}
                      draggable
                      onDragStart={() => onDragStart(task.id)}
                      onDragEnd={onDragEnd}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '4px' }}>
                        <TaskTitle done={done}>{task.title}</TaskTitle>
                        <IconBtn onClick={() => setEditTask(task)} style={{ padding: '1px', flexShrink: 0 }}>✎</IconBtn>
                      </div>

                      {proj && (
                        <div style={{ fontSize: '0.68rem', color: theme.textMuted, marginBottom: '6px' }}>
                          ◧ {proj.name}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Badge color={pColor.color} bg={pColor.bg} style={{ fontSize: '0.62rem' }}>{task.priority}</Badge>
                        {task.dueDate && (
                          <span style={{ fontSize: '0.68rem', color: theme.textMuted }}>
                            📅 {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </TaskCard>
                  );
                })}
              </ColBody>
            </Column>
          );
        })}
      </BoardWrap>

      {showNew && (
        <TaskModal
          onSave={(t) => dispatch({ type: 'ADD_TASK', payload: t })}
          onClose={() => setShowNew(false)}
        />
      )}
      {editTask && (
        <TaskModal
          task={editTask}
          onSave={(t) => dispatch({ type: 'UPDATE_TASK', payload: t })}
          onClose={() => setEditTask(null)}
        />
      )}
    </PageInner>
  );
}

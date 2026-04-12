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

const ScrollHint = styled.div`
  display: none;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.75rem;
  @media (max-width: 700px) { display: block; }
`;

const BoardScroll = styled.div`
  @media (max-width: 700px) {
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 700px) {
    grid-template-columns: repeat(3, 240px);
    gap: 0.75rem;
  }
`;

const Column = styled.div<{ over: boolean }>`
  background: ${({ theme }) => theme.bgCard};
  border: 1.5px solid ${({ over, theme }) => over ? theme.accent : theme.border};
  border-radius: ${({ theme }) => theme.radius};
  min-height: 260px;
  transition: border-color 0.15s;
`;

const ColHeader = styled.div`
  padding: 10px 12px;
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
  font-size: 0.85rem;
`;

const ColTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex: 1;
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
`;

const TaskCard = styled(Card)<{ dragging: boolean; done: boolean }>`
  padding: 9px 10px;
  cursor: grab;
  opacity: ${({ dragging }) => dragging ? 0.4 : 1};
  transition: transform 0.1s, box-shadow 0.1s;
  &:hover { transform: translateY(-2px); box-shadow: ${({ theme }) => theme.shadowMd}; }
  &:active { cursor: grabbing; }
`;

const TaskTitle = styled.div<{ done: boolean }>`
  font-size: 0.83rem;
  font-weight: 600;
  text-decoration: ${({ done }) => done ? 'line-through' : 'none'};
  opacity: ${({ done }) => done ? 0.5 : 1};
  margin-bottom: 5px;
`;

const WarnBanner = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.warning};
  margin-bottom: 1rem;
  padding: 10px 14px;
  background: ${({ theme }) => theme.warningLight};
  border-radius: ${({ theme }) => theme.radiusSm};
`;

export default function TasksPage() {
  const { state, dispatch } = useApp();
  const theme               = useStyledTheme() as AppTheme;

  const [showNew,  setShowNew]  = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [overCol,  setOverCol]  = useState<TaskStatus | null>(null);
  const dragId = useRef<string | null>(null);

  const onDragStart = (id: string)               => { dragId.current = id; };
  const onDragEnd   = ()                         => { dragId.current = null; setOverCol(null); };
  const onDragOver  = (e: React.DragEvent, s: TaskStatus) => { e.preventDefault(); setOverCol(s); };
  const onDrop      = (s: TaskStatus)            => {
    if (dragId.current) dispatch({ type: 'MOVE_TASK', payload: { id: dragId.current, status: s } });
    setOverCol(null);
  };

  return (
    <PageInner>
      <PageHeader>
        <div>
          <PageTitle>Tasks</PageTitle>
          <PageSub>Drag tasks to update their status</PageSub>
        </div>
        <Button onClick={() => setShowNew(true)} disabled={state.projects.length === 0}>
          + New Task
        </Button>
      </PageHeader>

      {state.projects.length === 0 && (
        <WarnBanner>Create a project first before adding tasks.</WarnBanner>
      )}

      <ScrollHint>← Swipe to see all columns →</ScrollHint>

      <BoardScroll>
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
                    <EmptyState style={{ padding: '1.25rem 0.5rem', minHeight: 'auto' }}>
                      <div className="sub" style={{ fontSize: '0.7rem' }}>No tasks</div>
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
                          <div style={{ fontSize: '0.66rem', color: theme.textMuted, marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            ◧ {proj.name}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Badge color={pColor.color} bg={pColor.bg} style={{ fontSize: '0.6rem' }}>{task.priority}</Badge>
                          {task.dueDate && (
                            <span style={{ fontSize: '0.65rem', color: theme.textMuted }}>📅 {formatDate(task.dueDate)}</span>
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
      </BoardScroll>

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

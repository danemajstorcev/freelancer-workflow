import { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction, Client, Project, Task } from '../types';


const SEED: AppState = {
  clients: [
    { id: 'c1', name: 'Sophie Laurent', company: 'Vertix Studio',   email: 'sophie@vertix.io',  phone: '+1 555 0101', status: 'Negotiation', tags: ['design','branding'],    value: 8500,  notes: 'Interested in full brand refresh. Decision by end of month.', createdAt: '2025-03-10', avatarColor: '#6366f4' },
    { id: 'c2', name: 'Marcus Reid',    company: 'Orion Logistics', email: 'mreid@orionlg.com', phone: '+1 555 0182', status: 'Lead',        tags: ['saas','dashboard'],    value: 14000, notes: 'Found us via LinkedIn. Needs a freight dashboard MVP.', createdAt: '2025-03-18', avatarColor: '#10b981' },
    { id: 'c3', name: 'Aiko Tanaka',    company: 'Bloom Health',    email: 'aiko@bloomhealth.co',phone: '+1 555 0234', status: 'Contacted',   tags: ['health','mobile'],     value: 6200,  notes: 'Responded to email. Wants a mobile app for patient tracking.', createdAt: '2025-03-22', avatarColor: '#f59e0b' },
    { id: 'c4', name: 'Derek Owens',    company: 'NovaTech',        email: 'dowens@novatech.ai', phone: '+1 555 0309', status: 'Closed',      tags: ['ai','platform'],       value: 22000, notes: 'Contract signed. AI dashboard project starting April.', createdAt: '2025-02-14', avatarColor: '#ef4444' },
  ],
  projects: [
    { id: 'p1', clientId: 'c4', name: 'AI Analytics Dashboard', description: 'Real-time analytics dashboard with ML-powered insights for NovaTech platform.', status: 'In Progress', priority: 'High',   budget: 22000, deadline: '2025-05-30', createdAt: '2025-03-01', tags: ['react','typescript','ai'] },
    { id: 'p2', clientId: 'c1', name: 'Vertix Brand System',    description: 'Complete design system and component library for Vertix Studio rebranding.', status: 'Not Started', priority: 'Medium', budget: 8500,  deadline: '2025-06-15', createdAt: '2025-03-20', tags: ['design','figma'] },
    { id: 'p3', clientId: 'c4', name: 'NovaTech API Integration', description: 'REST API integration layer connecting internal services to the new frontend.', status: 'Review',      priority: 'High',   budget: 5500,  deadline: '2025-04-20', createdAt: '2025-02-20', tags: ['api','node'] },
  ],
  tasks: [
    { id: 't1', projectId: 'p1', title: 'Set up monorepo structure',        notes: '', status: 'Done',        priority: 'High',   dueDate: '2025-04-02', createdAt: '2025-03-01' },
    { id: 't2', projectId: 'p1', title: 'Build chart components',           notes: '', status: 'In Progress', priority: 'High',   dueDate: '2025-04-15', createdAt: '2025-03-05' },
    { id: 't3', projectId: 'p1', title: 'Integrate WebSocket data feed',    notes: '', status: 'Todo',        priority: 'Medium', dueDate: '2025-04-22', createdAt: '2025-03-05' },
    { id: 't4', projectId: 'p3', title: 'Write API documentation',          notes: '', status: 'In Progress', priority: 'Medium', dueDate: '2025-04-10', createdAt: '2025-02-21' },
    { id: 't5', projectId: 'p3', title: 'Review and QA all endpoints',      notes: '', status: 'Todo',        priority: 'High',   dueDate: '2025-04-18', createdAt: '2025-02-25' },
    { id: 't6', projectId: 'p1', title: 'Client demo preparation',          notes: '', status: 'Todo',        priority: 'Low',    dueDate: '2025-04-28', createdAt: '2025-03-10' },
  ],
};


function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return { ...state, clients: state.clients.map((c) => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CLIENT':
      return { ...state, clients: state.clients.filter((c) => c.id !== action.payload), projects: state.projects.filter((p) => p.clientId !== action.payload) };
    case 'MOVE_CLIENT':
      return { ...state, clients: state.clients.map((c) => c.id === action.payload.id ? { ...c, status: action.payload.status } : c) };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map((p) => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter((p) => p.id !== action.payload), tasks: state.tasks.filter((t) => t.projectId !== action.payload) };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map((t) => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'MOVE_TASK':
      return { ...state, tasks: state.tasks.map((t) => t.id === action.payload.id ? { ...t, status: action.payload.status } : t) };
    default:
      return state;
  }
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem('fw_state');
    return raw ? JSON.parse(raw) : SEED;
  } catch { return SEED; }
}


interface AppContextValue {
  state:    AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppCtx = createContext<AppContextValue>({} as AppContextValue);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('fw_state', JSON.stringify(state));
  }, [state]);

  return <AppCtx.Provider value={{ state, dispatch }}>{children}</AppCtx.Provider>;
}

export const useApp = () => useContext(AppCtx);

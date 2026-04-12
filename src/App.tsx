import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import { AppShell, PageContent } from './components/Layout/PageWrapper';
import Dashboard    from './pages/Dashboard';
import PipelinePage from './pages/PipelinePage';
import ClientsPage  from './pages/ClientsPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage    from './pages/TasksPage';

export default function App() {
  return (
    <AppThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <AppShell>
            <Sidebar />
            <PageContent>
              <Routes>
                <Route path="/"         element={<Dashboard />}    />
                <Route path="/pipeline" element={<PipelinePage />} />
                <Route path="/clients"  element={<ClientsPage />}  />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/tasks"    element={<TasksPage />}    />
              </Routes>
            </PageContent>
          </AppShell>
        </BrowserRouter>
      </AppProvider>
    </AppThemeProvider>
  );
}

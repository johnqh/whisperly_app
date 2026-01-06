import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Glossaries from './pages/Glossaries';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Subscription from './pages/Subscription';
import RateLimits from './pages/RateLimits';
import Workspaces from './pages/Workspaces';
import Members from './pages/Members';
import Invitations from './pages/Invitations';
import Login from './pages/Login';
import Loading from './components/Loading';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="projects/:projectId/glossaries" element={<Glossaries />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="rate-limits" element={<RateLimits />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="workspaces" element={<Workspaces />} />
        <Route path="members" element={<Members />} />
        <Route path="invitations" element={<Invitations />} />
      </Route>
    </Routes>
  );
}

export default App;

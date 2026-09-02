import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { SecurityPage } from './pages/SecurityPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TeamPage } from './pages/TeamPage';
import { DeploymentsPage } from './pages/DeploymentsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import ProtectedRoute from './components/navigation/ProtectedRoute';
import PublicOnlyRoute from './components/navigation/PublicOnlyRoute';

export function App() {
  return (
    <Routes>
      {/* Public only routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<CommandCenterPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="intelligence" element={<IntelligencePage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="deployments" element={<DeploymentsPage />} />
          <Route path="assistant" element={<AIAssistantPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

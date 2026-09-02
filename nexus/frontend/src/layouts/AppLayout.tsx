import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Topbar } from '../components/navigation/Topbar';
import { cn } from '../utils/cn';

interface PageMeta {
  title: string;
  subtitle: string;
}

const PAGE_META_MAP: Record<string, PageMeta> = {
  '/': {
    title: 'Engineering Command Center',
    subtitle: 'High-density telemetry, AI diagnostics, and active repositories',
  },
  '/projects': {
    title: 'Projects & Repositories',
    subtitle: 'Connected GitHub codebases, health indices, and synchronization status',
  },
  '/intelligence': {
    title: 'AI Code Intelligence',
    subtitle: 'Algorithmic pull request insights, architecture drift, and velocity bottlenecks',
  },
  '/security': {
    title: 'Security & Risk Radar',
    subtitle: 'Automated vulnerability triage, secret leak detection, and dependency hygiene',
  },
  '/analytics': {
    title: 'Engineering Analytics & DORA',
    subtitle: 'Lead time for changes, deployment frequency, MTTR, and failure rate',
  },
  '/team': {
    title: 'Team Velocity & Workload',
    subtitle: 'Review turnaround distribution, PR throughput, and contributor impact',
  },
  '/deployments': {
    title: 'Deployments & CI/CD Pipelines',
    subtitle: 'Multi-environment releases, build runtimes, and rollbacks',
  },
  '/assistant': {
    title: 'NEXUS AI Assistant',
    subtitle: 'Natural-language queries over your codebase, commits, and sprint context',
  },
  '/settings': {
    title: 'Workspace Settings',
    subtitle: 'GitHub App integrations, API tokens, webhook subscriptions, and team access',
  },
};

import { RepositoryProvider } from '../context/RepositoryContext';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const currentMeta = PAGE_META_MAP[location.pathname] || {
    title: 'NEXUS Command Center',
    subtitle: 'AI Engineering Command Center',
  };

  return (
    <RepositoryProvider>
      <div className="min-h-screen bg-[#090D14] text-slate-100 flex overflow-x-hidden">
        {/* Background Subtle Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none bg-radial-gradient -z-10" />
        <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-60 -z-10" />

        {/* Left Sidebar */}
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar Header */}
          <Topbar
            onToggleSidebar={() => setCollapsed(!collapsed)}
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
          />

          {/* Content Container */}
          <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-[1600px] w-full mx-auto animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </RepositoryProvider>
  );
};

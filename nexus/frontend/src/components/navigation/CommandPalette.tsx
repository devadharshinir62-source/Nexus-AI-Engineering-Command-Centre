import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  FolderGit2,
  BrainCircuit,
  ShieldCheck,
  LineChart,
  Users2,
  Rocket,
  Sparkles,
  Settings,
  Plus,
  GitBranch,
  GitPullRequest,
  AlertTriangle,
  ShieldAlert,
  User,
  X,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchEntity {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Pages' | 'Repositories' | 'Pull Requests & Issues' | 'Deployments' | 'Security Findings' | 'Team Members';
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const allEntities: SearchEntity[] = useMemo(() => [
    // Navigation Pages
    {
      id: 'page-cmd-center',
      title: 'Command Center',
      subtitle: 'Telemetry overview, health dynamics, and AI insights',
      category: 'Pages',
      icon: LayoutDashboard,
      shortcut: 'G D',
      action: () => { navigate('/'); onClose(); },
    },
    {
      id: 'page-projects',
      title: 'Projects & Repositories',
      subtitle: 'Connected codebases and GitHub sync state',
      category: 'Pages',
      icon: FolderGit2,
      shortcut: 'G P',
      action: () => { navigate('/projects'); onClose(); },
    },
    {
      id: 'page-intelligence',
      title: 'AI Intelligence & Code Analysis',
      subtitle: 'PR bottlenecks, architectural drift, velocity diagnostics',
      category: 'Pages',
      icon: BrainCircuit,
      shortcut: 'G I',
      action: () => { navigate('/intelligence'); onClose(); },
    },
    {
      id: 'page-security',
      title: 'Security & Risk Scanner',
      subtitle: 'Vulnerability triage, secret leaks, CVE analysis',
      category: 'Pages',
      icon: ShieldCheck,
      shortcut: 'G S',
      action: () => { navigate('/security'); onClose(); },
    },
    {
      id: 'page-analytics',
      title: 'Engineering Analytics & DORA',
      subtitle: 'Lead time, deployment frequency, MTTR metrics',
      category: 'Pages',
      icon: LineChart,
      shortcut: 'G A',
      action: () => { navigate('/analytics'); onClose(); },
    },
    {
      id: 'page-team',
      title: 'Team Velocity & Workload',
      subtitle: 'Review turnaround distribution and contributor impact',
      category: 'Pages',
      icon: Users2,
      shortcut: 'G T',
      action: () => { navigate('/team'); onClose(); },
    },
    {
      id: 'page-deployments',
      title: 'Deployments & CI/CD Pipelines',
      subtitle: 'Multi-environment releases and canary rollouts',
      category: 'Pages',
      icon: Rocket,
      shortcut: 'G C',
      action: () => { navigate('/deployments'); onClose(); },
    },
    {
      id: 'page-assistant',
      title: 'NEXUS AI Assistant',
      subtitle: 'Natural-language queries over your codebase and telemetry',
      category: 'Pages',
      icon: Sparkles,
      shortcut: 'G X',
      action: () => { navigate('/assistant'); onClose(); },
    },
    {
      id: 'page-settings',
      title: 'Workspace Settings',
      subtitle: 'Integrations, webhook subscriptions, and team access',
      category: 'Pages',
      icon: Settings,
      shortcut: 'G ,',
      action: () => { navigate('/settings'); onClose(); },
    },

    // Repositories
    {
      id: 'repo-api-gateway',
      title: 'nexus-ai/nexus-api-gateway',
      subtitle: 'FastAPI microservice edge gateway • 98% Health',
      category: 'Repositories',
      icon: GitBranch,
      action: () => { navigate('/projects'); onClose(); },
    },
    {
      id: 'repo-web-client',
      title: 'nexus-ai/nexus-web-client',
      subtitle: 'React 19 Vite engineering command center • 95% Health',
      category: 'Repositories',
      icon: GitBranch,
      action: () => { navigate('/projects'); onClose(); },
    },
    {
      id: 'repo-auth-core',
      title: 'nexus-ai/nexus-auth-core',
      subtitle: 'OAuth2 & RS256 token verification service • 84% Health',
      category: 'Repositories',
      icon: GitBranch,
      action: () => { navigate('/projects'); onClose(); },
    },
    {
      id: 'repo-billing-engine',
      title: 'nexus-ai/nexus-billing-engine',
      subtitle: 'Stripe subscription webhook aggregator • 78% Health',
      category: 'Repositories',
      icon: GitBranch,
      action: () => { navigate('/projects'); onClose(); },
    },

    // Pull Requests & Issues
    {
      id: 'pr-412',
      title: 'PR #412: feat(proxy): intelligent upstream load balancing',
      subtitle: 'nexus-api-gateway • Author: Elena Rostova',
      category: 'Pull Requests & Issues',
      icon: GitPullRequest,
      action: () => { navigate('/projects'); onClose(); },
    },
    {
      id: 'pr-308',
      title: 'PR #308: refactor(billing): payment processing state machine',
      subtitle: 'nexus-billing-engine • Pending review > 5 days (High Risk)',
      category: 'Pull Requests & Issues',
      icon: AlertTriangle,
      action: () => { navigate('/intelligence'); onClose(); },
    },
    {
      id: 'pr-319',
      title: 'PR #319: fix(webhook): Stripe idempotency key validation',
      subtitle: 'nexus-billing-engine • Test coverage dropped to 81%',
      category: 'Pull Requests & Issues',
      icon: GitPullRequest,
      action: () => { navigate('/intelligence'); onClose(); },
    },

    // Deployments
    {
      id: 'dep-v241',
      title: 'Release v2.4.1 (Production - US-East-1)',
      subtitle: 'nexus-api-gateway • Status: Success (18ms P99)',
      category: 'Deployments',
      icon: Rocket,
      action: () => { navigate('/deployments'); onClose(); },
    },
    {
      id: 'dep-v118',
      title: 'Release v1.18.0 (Production - Global CDN)',
      subtitle: 'nexus-web-client • Status: Success (140ms bundle load)',
      category: 'Deployments',
      icon: Rocket,
      action: () => { navigate('/deployments'); onClose(); },
    },
    {
      id: 'dep-v210',
      title: 'Release v2.1.0-beta (Staging - US-West-2)',
      subtitle: 'nexus-billing-engine • Status: Failed during migration',
      category: 'Deployments',
      icon: AlertTriangle,
      action: () => { navigate('/deployments'); onClose(); },
    },

    // Security Findings
    {
      id: 'sec-cve',
      title: 'CVE-2026-2189: Transitive dependency buffer parser vulnerability',
      subtitle: 'nexus-data-pipeline • Severity: High',
      category: 'Security Findings',
      icon: ShieldAlert,
      action: () => { navigate('/security'); onClose(); },
    },
    {
      id: 'sec-jwt',
      title: 'Potential JWT Algorithm Confusion in RS256 parser',
      subtitle: 'nexus-auth-core • Enforce explicit algorithms=["RS256"]',
      category: 'Security Findings',
      icon: ShieldCheck,
      action: () => { navigate('/security'); onClose(); },
    },

    // Team Members
    {
      id: 'team-elena',
      title: 'Elena Rostova',
      subtitle: 'Staff Backend Engineer • nexus-api-gateway',
      category: 'Team Members',
      icon: User,
      action: () => { navigate('/team'); onClose(); },
    },
    {
      id: 'team-marcus',
      title: 'Marcus Chen',
      subtitle: 'Senior Frontend Architect • nexus-web-client',
      category: 'Team Members',
      icon: User,
      action: () => { navigate('/team'); onClose(); },
    },
    {
      id: 'team-sarah',
      title: 'Sarah Kim',
      subtitle: 'Lead DevOps & SRE • Cloud Infrastructure',
      category: 'Team Members',
      icon: User,
      action: () => { navigate('/team'); onClose(); },
    },
  ], [navigate, onClose]);

  const filteredEntities = useMemo(() => {
    if (!query.trim()) return allEntities.slice(0, 10);
    const q = query.toLowerCase();
    return allEntities.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, allEntities]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredEntities.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredEntities.length) % (filteredEntities.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredEntities[selectedIndex]) {
          filteredEntities[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredEntities]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#0E1424]/95 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center px-4 border-b border-white/[0.08] bg-white/[0.02]">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search repositories, pull requests, deployments, team, security..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-transparent px-3 py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredEntities.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No matching entities found for "{query}"
            </div>
          ) : (
            filteredEntities.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors group',
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-100 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:bg-white/[0.04] border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg border shrink-0',
                      isSelected ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate">{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono bg-white/[0.04] px-1.5 py-0.2 rounded border border-white/[0.06] shrink-0">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.shortcut && (
                    <kbd className="hidden sm:inline-block rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-400 ml-2">
                      {item.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/40 px-4 py-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="font-mono text-slate-300">↑</kbd> <kbd className="font-mono text-slate-300">↓</kbd></span>
            <span>Select: <kbd className="font-mono text-slate-300">↵</kbd></span>
          </div>
          <span>Close: <kbd className="font-mono text-slate-300">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
};

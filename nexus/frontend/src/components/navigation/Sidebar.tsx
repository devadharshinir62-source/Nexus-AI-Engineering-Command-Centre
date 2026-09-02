import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  BrainCircuit,
  ShieldCheck,
  LineChart,
  Users2,
  Rocket,
  Sparkles,
  Settings,
  ChevronRight,
  Terminal,
  Layers,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Badge } from '../common/Badge';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
}

interface NavItemDef {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'default';
  isNew?: boolean;
}

const PRIMARY_NAVIGATION: NavItemDef[] = [
  { name: 'Command Center', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderGit2, badge: '8' },
  { name: 'Intelligence', href: '/intelligence', icon: BrainCircuit, badge: 'AI', badgeVariant: 'purple' },
  { name: 'Security', href: '/security', icon: ShieldCheck, badge: '3', badgeVariant: 'amber' },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
  { name: 'Team', href: '/team', icon: Users2 },
  { name: 'Deployments', href: '/deployments', icon: Rocket, badge: 'Live', badgeVariant: 'emerald' },
  { name: 'AI Assistant', href: '/assistant', icon: Sparkles, badgeVariant: 'cyan', isNew: true },
];

const SECONDARY_NAVIGATION: NavItemDef[] = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  return (
    <aside
      className={cn(
        'sticky top-0 h-screen z-30 flex flex-col shrink-0 border-r border-white/[0.08] bg-[#0A0E1A]/95 backdrop-blur-xl transition-all duration-300 ease-in-out select-none',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b border-white/[0.06] justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 shadow-glow-cyan">
            <Layers className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute -inset-0.5 rounded-xl bg-cyan-400/30 blur-sm -z-10" />
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-black tracking-widest text-white">NEXUS</span>
                <span className="rounded bg-cyan-500/10 px-1 py-0.2 text-[9px] font-mono font-semibold text-cyan-400 border border-cyan-500/20">
                  v0.1
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight">AI Command Center</span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Current Workspace Switcher */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/20 text-blue-400 text-xs font-mono font-bold">
                NX
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-slate-200 truncate">Nexus Core Org</span>
                <span className="text-[10px] text-slate-400 font-mono">Enterprise Tier</span>
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Navigation
            </span>
          )}
          <nav className="space-y-1 mt-1">
            {PRIMARY_NAVIGATION.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/25 shadow-sm'
                        : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 border border-transparent'
                    )
                  }
                  title={collapsed ? item.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active glowing indicator pill */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan-400 shadow-glow-cyan" />
                      )}

                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                        )}
                      />

                      {!collapsed && (
                        <span className="flex-1 truncate tracking-tight">{item.name}</span>
                      )}

                      {!collapsed && item.badge && (
                        <Badge
                          variant={item.badgeVariant || 'default'}
                          size="sm"
                          className="font-mono text-[10px] py-0 px-1.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              System
            </span>
          )}
          <nav className="space-y-1 mt-1">
            {SECONDARY_NAVIGATION.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/25 shadow-sm'
                        : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 border border-transparent'
                    )
                  }
                  title={collapsed ? item.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-cyan-400 shadow-glow-cyan" />
                      )}
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                        )}
                      />
                      {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Real-time System telemetry */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-white/[0.06]">
          <div className="rounded-lg border border-white/[0.06] bg-black/40 p-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400 font-mono">
                <Terminal className="h-3 w-3 text-cyan-400" />
                Cluster Engine
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                99.98%
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Synced Repos: 8</span>
              <span>P99: 42ms</span>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Card */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className={cn(
          'flex items-center gap-3 rounded-lg p-1.5 hover:bg-white/[0.05] transition-colors cursor-pointer',
          collapsed && 'justify-center'
        )}>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Lead Architect"
              className="h-8 w-8 rounded-lg object-cover border border-white/[0.1]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0A0E1A]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-slate-200 truncate">Alex Rivera</span>
              <span className="text-[10px] text-slate-400 font-mono truncate">Lead Architect</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

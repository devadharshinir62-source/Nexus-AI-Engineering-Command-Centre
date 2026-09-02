import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRepository } from '../../context/RepositoryContext';
import {
  Menu,
  Search,
  GitBranch,
  Bell,
  Sparkles,
  Radio,
  LogOut,
  Plus,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CommandPalette } from './CommandPalette';
import { NotificationPopover } from './NotificationPopover';
import { AskNexusModal } from './AskNexusModal';
import { ConnectRepositoryModal } from './ConnectRepositoryModal';

interface TopbarProps {
  onToggleSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  title = 'Engineering Command Center',
}) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAskNexusOpen, setIsAskNexusOpen] = useState(false);
  const {
    selectedRepo,
    setSelectedRepo,
    repositories,
    isConnectModalOpen,
    setIsConnectModalOpen,
  } = useRepository();
  const { user, logout } = useAuth();

  // Global keydown listener for Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const displayName = user?.full_name || 'Devadharshini R';

  const handleRepoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__connect_new__') {
      setIsConnectModalOpen(true);
    } else {
      setSelectedRepo(val);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full min-w-0 items-center justify-between border-b border-white/[0.08] bg-[#090D14]/90 px-2 sm:px-3 md:px-4 backdrop-blur-xl gap-1.5 sm:gap-2 overflow-visible select-none">
        {/* Left Section: 1. Menu, 2. Title, 3. LIVE SYNC */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* 1. Sidebar/Menu button */}
          <button
            onClick={onToggleSidebar}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* 2. Title & 3. LIVE SYNC badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <h1 className="text-xs sm:text-sm font-semibold text-white tracking-tight whitespace-nowrap">
              <span className="hidden 2xl:inline">{title}</span>
              <span className="2xl:hidden">Command Center</span>
            </h1>
            <Badge variant="cyan" size="sm" dot pulse className="py-0 px-1.5 font-mono text-[9px] sm:text-[10px] whitespace-nowrap flex-shrink-0">
              LIVE SYNC
            </Badge>
          </div>
        </div>

        {/* Center Section: 4. Search / Run Command (allowed to shrink first) */}
        <div className="flex-1 min-w-[36px] max-w-xs md:max-w-sm flex items-center justify-center px-1">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex w-full items-center gap-1.5 sm:gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-slate-200 transition-all shadow-inner-glow cursor-pointer min-w-0"
          >
            <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span className="flex-1 text-left truncate min-w-0 hidden md:inline text-xs">Search or run command...</span>
            <span className="flex-1 text-left truncate min-w-0 hidden sm:inline md:hidden text-xs">Search...</span>
            <kbd className="hidden 2xl:inline-flex flex-shrink-0 items-center gap-0.5 rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.5 font-mono text-[9px] text-slate-400">
              <span>⌘K</span>
            </kbd>
          </button>
        </div>

        {/* Right Section: 5. Repositories, 6. GitHub Status, 7. Notifications, 8. Ask NEXUS, 9. User, 10. Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 whitespace-nowrap relative">
          {/* 5. All Repositories dropdown + Connect Modal trigger */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2 py-1 text-xs text-slate-300">
            <GitBranch className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
            <select
              value={selectedRepo}
              onChange={handleRepoChange}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-0.5 max-w-[130px] truncate"
            >
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.id} className="bg-slate-900 text-slate-100">
                  {repo.displayName}
                </option>
              ))}
              <option disabled className="bg-slate-800 text-slate-400">
                ──────────────
              </option>
              <option value="__connect_new__" className="bg-cyan-950/90 text-cyan-300 font-semibold">
                + Connect GitHub Repo
              </option>
            </select>
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="p-0.5 rounded text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
              title="Connect GitHub Repository"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 6. GitHub Webhooks Active */}
          <div className="hidden 2xl:flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400 whitespace-nowrap">
            <Radio className="h-3 w-3 animate-pulse text-emerald-400 flex-shrink-0" />
            <span className="font-mono text-[10px] lg:text-[11px] font-medium">GitHub Webhooks Active</span>
          </div>

          {/* 7. Notification bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className="relative flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.07] transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </button>
            <NotificationPopover
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* 8. Ask NEXUS button */}
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() => setIsAskNexusOpen(true)}
            className="hidden sm:inline-flex flex-shrink-0 shadow-glow-cyan text-xs whitespace-nowrap px-2.5 py-1"
          >
            Ask NEXUS
          </Button>

          {/* 9. User avatar + "Devadharshini R" */}
          <div className="flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-xs text-slate-200">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 text-white font-semibold text-[10px] flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-slate-100 text-xs whitespace-nowrap flex-shrink-0">
              {displayName}
            </span>
          </div>

          {/* 10. Logout button */}
          <button
            onClick={logout}
            className="flex-shrink-0 flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/25 hover:text-rose-200 hover:border-rose-500/50 transition-all duration-150 whitespace-nowrap shadow-sm cursor-pointer active:scale-95"
            title="Log out of NEXUS"
          >
            <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Command Search Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Ask NEXUS AI Assistant Modal */}
      <AskNexusModal isOpen={isAskNexusOpen} onClose={() => setIsAskNexusOpen(false)} />

      {/* Connect Real GitHub Repository Modal */}
      <ConnectRepositoryModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </>
  );
};

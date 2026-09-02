import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';
import {
  Bell,
  X,
  CheckCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Rocket,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export interface NotificationItem {
  id: string;
  title: string;
  category: 'security' | 'deployment' | 'build' | 'insight' | 'warning';
  repository: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Potential JWT Algorithm Confusion Detected in RS256 Parser',
    category: 'security',
    repository: 'nexus-auth-core',
    timestamp: '24m ago',
    read: false,
    link: '/security',
  },
  {
    id: 'notif-2',
    title: 'Deployment v2.4.1 succeeded to Production (US-East-1)',
    category: 'deployment',
    repository: 'nexus-api-gateway',
    timestamp: '1h ago',
    read: false,
    link: '/deployments',
  },
  {
    id: 'notif-3',
    title: 'Stale PR #308 pending code review > 5 days',
    category: 'warning',
    repository: 'nexus-billing-engine',
    timestamp: '2h ago',
    read: false,
    link: '/intelligence',
  },
  {
    id: 'notif-4',
    title: 'New AI Insight: PR review turnaround optimization available',
    category: 'insight',
    repository: 'nexus-auth-core',
    timestamp: '3h ago',
    read: true,
    link: '/intelligence',
  },
];

const categoryIconMap = {
  security: ShieldAlert,
  deployment: Rocket,
  build: CheckCircle2,
  insight: Sparkles,
  warning: AlertTriangle,
};

const categoryColorMap = {
  security: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  deployment: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  build: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  insight: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markSingleAsRead = (id: string, link?: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (link) {
      navigate(link);
      onClose();
    }
  };

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-white/[0.12] bg-[#0E1424]/95 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl z-50 overflow-hidden animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="cyan" size="sm" className="font-mono text-[10px] px-1.5 py-0">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="h-3 w-3" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-white/[0.04]">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No notifications available
          </div>
        ) : (
          notifications.map((item) => {
            const Icon = categoryIconMap[item.category] || Bell;
            const colorClass = categoryColorMap[item.category] || 'text-slate-400 bg-white/[0.04] border-white/[0.06]';

            return (
              <div
                key={item.id}
                onClick={() => markSingleAsRead(item.id, item.link)}
                className={cn(
                  'p-3 flex items-start gap-3 transition-colors cursor-pointer hover:bg-white/[0.04]',
                  !item.read ? 'bg-cyan-500/[0.03]' : ''
                )}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg border shrink-0 mt-0.5',
                    colorClass
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] text-slate-400 truncate">
                      {item.repository}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p
                    className={cn(
                      'text-xs mt-0.5 leading-snug line-clamp-2',
                      !item.read ? 'font-medium text-slate-100' : 'text-slate-400'
                    )}
                  >
                    {item.title}
                  </p>
                </div>

                {!item.read && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-white/[0.06] bg-black/40 text-center">
        <button
          onClick={() => {
            navigate('/intelligence');
            onClose();
          }}
          className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View all security & system alerts</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

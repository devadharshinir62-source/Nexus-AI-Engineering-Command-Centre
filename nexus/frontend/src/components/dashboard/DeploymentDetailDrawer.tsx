import React, { useEffect } from 'react';
import {
  X,
  Rocket,
  GitCommit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Shield,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { DeploymentItem } from '../../types/dashboard';

interface DeploymentDetailDrawerProps {
  deployment: DeploymentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentDetailDrawer: React.FC<DeploymentDetailDrawerProps> = ({
  deployment,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !deployment) return null;

  const defaultLogs = [
    '14:02:31 [INFO] Starting multi-region container rolling deployment',
    '14:02:34 [INFO] Pulling encrypted Docker image artifact from ECR',
    '14:03:12 [INFO] Running pre-flight database schema migrations (0 pending)',
    '14:03:48 [INFO] Health checks returned HTTP 200 on /health/liveness across 12 pods',
    '14:04:01 [INFO] Shifting 100% ingress traffic via AWS ALB target groups',
    '14:04:09 [INFO] Zero-downtime deployment successfully completed',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl h-full bg-[#0E1424] border-l border-white/[0.12] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{deployment.service}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  {deployment.version}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md uppercase font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {deployment.environment}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Deployed by {deployment.deployedBy} · {deployment.durationSeconds}s duration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">
          {/* Commit Summary */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <GitCommit className="h-3.5 w-3.5 text-cyan-400" />
              Commit Metadata
            </div>
            <div className="text-sm font-semibold text-slate-100">{deployment.commitMessage}</div>
            <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-400">
              <span>
                SHA: <span className="text-cyan-400 font-semibold">{deployment.commitSha}</span>
              </span>
              <span>•</span>
              <span>Branch: <span className="text-slate-300">main</span></span>
              <span>•</span>
              <span>Status: <span className="text-emerald-400 font-bold uppercase">{deployment.status}</span></span>
            </div>
          </div>

          {/* Risk & Rollback Radar */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-purple-400" />
              Risk Assessment & Rollback Radar
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[11px] text-slate-400">Deployment Risk</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-1">LOW</div>
                <div className="text-[10px] text-slate-500">Heuristic score: 96/100</div>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[11px] text-slate-400">Rollback Probability</div>
                <div className="text-base font-bold font-mono text-cyan-400 mt-1">4.2%</div>
                <div className="text-[10px] text-slate-500">Industry avg: 12.8%</div>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[11px] text-slate-400">Health Checks</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Passed
                </div>
                <div className="text-[10px] text-slate-500">12/12 pods healthy</div>
              </div>
            </div>
          </div>

          {/* Live Deployment Logs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                Pipeline Execution Logs
              </h4>
              <span className="text-[10px] font-mono text-slate-400">AWS CloudWatch LogStream</span>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-black/80 p-3.5 font-mono text-xs text-slate-300 space-y-1.5 overflow-x-auto">
              {(deployment.logsSummary || defaultLogs).map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-slate-600 select-none">{idx + 1}</span>
                  <span className={log.includes('completed') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.08] px-6 py-4 bg-white/[0.02]">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Trigger Canary Rollback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

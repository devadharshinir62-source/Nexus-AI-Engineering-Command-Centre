import React, { useState } from 'react';
import { useRepository } from '../../context/RepositoryContext';
import { ConnectedRepository } from '../../types/repository';
import {
  GitBranch,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Star,
  GitFork,
  Check,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ConnectRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANALYSIS_STEPS = [
  'Validating GitHub repository URL & access permissions...',
  'Fetching repository metadata & branch configurations...',
  'Analyzing recent commit frequency & active contributors...',
  'Inspecting pull requests & review turnaround cadence...',
  'Scanning GitHub Actions workflow runs & CI stability...',
  'Computing 7-factor deterministic Engineering Health Score...',
];

export const ConnectRepositoryModal: React.FC<ConnectRepositoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { connectRepository, isConnecting, setSelectedRepo } = useRepository();
  const [url, setUrl] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [connectedResult, setConnectedResult] = useState<ConnectedRepository | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a GitHub repository URL.');
      return;
    }

    setError(null);
    setConnectedResult(null);
    setStepIndex(0);

    // Progression animation timer
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await connectRepository(url.trim());
      clearInterval(interval);
      setConnectedResult(result);
    } catch (err: unknown) {
      clearInterval(interval);
      setError((err as Error).message || 'Failed to connect repository.');
    }
  };

  const handleApplyExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setError(null);
  };

  const handleOpenDashboard = () => {
    if (connectedResult) {
      setSelectedRepo(connectedResult.name);
    }
    onClose();
  };

  const handleReset = () => {
    setUrl('');
    setError(null);
    setConnectedResult(null);
    setStepIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-cyan-500/20 bg-[#0E1424] p-6 shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                  Connect GitHub Repository
                </h3>
                <Badge variant="cyan" size="sm" className="font-mono text-[9px]">
                  Real API v3
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Stream real-time engineering telemetry, commits, PRs, and health scores
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

        {/* Success View */}
        {connectedResult ? (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-400" />
              <div>
                <h4 className="text-sm font-semibold text-white">Repository Connected Successfully</h4>
                <p className="text-xs text-slate-300">
                  Real engineering metrics and deterministic health score have been calculated.
                </p>
              </div>
            </div>

            {/* Repository Info Card */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono">
                      {connectedResult.full_name}
                    </span>
                    <a
                      href={connectedResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {connectedResult.description || 'Connected GitHub repository'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Health Score</span>
                  <span className="text-xl font-bold font-mono text-cyan-400">
                    {connectedResult.health.health_score}
                    <span className="text-xs text-slate-400">/100</span>
                  </span>
                </div>
              </div>

              {/* Meta metrics grid */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/[0.06] text-center font-mono">
                <div className="rounded-lg bg-white/[0.03] p-2">
                  <span className="text-[9px] text-slate-400 block uppercase">Language</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block truncate">
                    {connectedResult.language || 'Codebase'}
                  </span>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-2">
                  <span className="text-[9px] text-slate-400 block uppercase flex items-center justify-center gap-1">
                    <Star className="h-2.5 w-2.5 text-yellow-400" /> Stars
                  </span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">
                    {connectedResult.stars.toLocaleString()}
                  </span>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-2">
                  <span className="text-[9px] text-slate-400 block uppercase">Commits</span>
                  <span className="text-xs font-semibold text-cyan-400 mt-0.5 block">
                    {connectedResult.metrics_summary.recent_commits_count}
                  </span>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-2">
                  <span className="text-[9px] text-slate-400 block uppercase">Branch</span>
                  <span className="text-xs font-semibold text-slate-300 mt-0.5 block truncate">
                    {connectedResult.default_branch}
                  </span>
                </div>
              </div>

              {/* Health Vector Badges */}
              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Activity: {connectedResult.health.code_activity}%
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  CI Health: {connectedResult.health.ci_health}%
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  PR Cadence: {connectedResult.health.pull_request_health}%
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Security: {connectedResult.health.security_health}%
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Connect Another
              </Button>
              <Button variant="primary" size="sm" icon={ArrowRight} onClick={handleOpenDashboard} className="shadow-glow-cyan">
                View in Command Center
              </Button>
            </div>
          </div>
        ) : (
          /* Input Form View */
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                GitHub Repository URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isConnecting}
                  placeholder="https://github.com/owner/repository"
                  className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                <span>Public repositories supported directly without credentials.</span>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1.5">
                Quick Test Repositories:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'https://github.com/facebook/react',
                  'https://github.com/vercel/next.js',
                  'https://github.com/fastapi/fastapi',
                ].map((demoUrl) => (
                  <button
                    key={demoUrl}
                    type="button"
                    onClick={() => handleApplyExample(demoUrl)}
                    disabled={isConnecting}
                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/[0.03] text-cyan-300 border border-white/[0.08] hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                  >
                    {demoUrl.replace('https://github.com/', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Analysis Progress Feed */}
            {isConnecting && (
              <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                    Analyzing Repository...
                  </span>
                  <span>
                    {stepIndex + 1}/{ANALYSIS_STEPS.length}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  {ANALYSIS_STEPS[stepIndex]}
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 transition-all duration-300 rounded-full"
                    style={{
                      width: `${((stepIndex + 1) / ANALYSIS_STEPS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isConnecting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={Search}
                isLoading={isConnecting}
                disabled={isConnecting}
                className="shadow-glow-cyan font-mono"
              >
                Analyze Repository
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

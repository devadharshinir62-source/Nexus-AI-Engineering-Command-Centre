import React, { useState, useEffect } from 'react';
import { AIInsight } from '../../types/dashboard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatRelativeTime } from '../../utils/formatters';
import {
  X,
  Sparkles,
  ShieldAlert,
  Clock,
  Gauge,
  CheckCheck,
  FolderGit2,
  GitBranch,
  Copy,
  Check,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  GitPullRequest,
  Rocket,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface InsightDetailModalProps {
  insight: AIInsight | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyAction?: (insight: AIInsight) => void;
}

const categoryIcons = {
  bottleneck: Clock,
  security: ShieldAlert,
  architecture: FolderGit2,
  velocity: Gauge,
  quality: CheckCheck,
  performance: Gauge,
  reliability: AlertTriangle,
  deployment: Rocket,
};

const impactVariantMap = {
  high: 'danger' as const,
  medium: 'warning' as const,
  low: 'primary' as const,
};

const SIMULATION_STEPS = [
  'Analyzing root-cause diagnostic telemetry...',
  '✓ Identified problematic commit & configuration delta',
  '✓ Generated targeted remediation patch',
  '✓ Validated backward compatibility & dependency tree',
  '✓ Simulated automated test suites (48 passed, 0 failed)',
  'READY TO APPLY — Ready for deployment pipeline',
];

export const InsightDetailModal: React.FC<InsightDetailModalProps> = ({
  insight,
  isOpen,
  onClose,
  onApplyAction,
}) => {
  const [copied, setCopied] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSimulationActive(false);
      setSimStep(0);
      setApplied(false);
    }
  }, [isOpen]);

  const handleStartSimulation = () => {
    setSimulationActive(true);
    setSimStep(1);

    const timer1 = setTimeout(() => setSimStep(2), 600);
    const timer2 = setTimeout(() => setSimStep(3), 1200);
    const timer3 = setTimeout(() => setSimStep(4), 1800);
    const timer4 = setTimeout(() => setSimStep(5), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleApply = () => {
    setApplied(true);
    if (onApplyAction && insight) {
      onApplyAction(insight);
    }
  };

  if (!isOpen || !insight) return null;

  const CategoryIcon = categoryIcons[insight.category] || Sparkles;

  const handleCopy = () => {
    navigator.clipboard.writeText(insight.recommendation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div
        className="w-full max-w-3xl rounded-2xl border border-white/[0.12] bg-[#0E1424] shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
              <CategoryIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={impactVariantMap[insight.impact]} size="sm" className="uppercase font-mono text-[10px]">
                  {insight.impact} impact
                </Badge>
                <Badge variant="cyan" size="sm" className="font-mono text-[10px] py-0">
                  {insight.confidenceScore}% Confidence
                </Badge>
                <span className="text-[11px] font-mono text-slate-400">
                  Detected {formatRelativeTime(insight.timestamp)}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1.5 leading-snug">
                {insight.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs scrollbar-thin">
          {/* Diagnostic Context */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Root-Cause Diagnostic Analysis
            </h4>
            <div className="text-slate-300 leading-relaxed bg-[#111728] p-3.5 rounded-xl border border-white/[0.06]">
              {insight.description}
            </div>
          </div>

          {/* Evidence Timeline */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Evidence Timeline
            </h4>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-2 font-mono text-[11px]">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-slate-500 font-semibold w-12">14:02</span>
                <Rocket className="h-3.5 w-3.5 text-blue-400" />
                <span>Deployment initiated on staging environment (v2.4.1-rc2)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-slate-500 font-semibold w-12">14:05</span>
                <Gauge className="h-3.5 w-3.5 text-amber-400" />
                <span>P99 API response latency increased by +18.4%</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-slate-500 font-semibold w-12">14:07</span>
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                <span>Error rate threshold exceeded (0.47% error rate detected)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-slate-500 font-semibold w-12">14:11</span>
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-cyan-300 font-semibold">NEXUS AI correlation engine detected causal bottleneck</span>
              </div>
            </div>
          </div>

          {/* AI Recommended Remediation Plan */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Prescribed Remediation Plan
              </h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/25 p-3.5 text-cyan-100 space-y-2">
              <p className="leading-relaxed text-slate-200">
                {insight.recommendation}
              </p>
              <div className="rounded-lg bg-black/60 p-2.5 font-mono text-[11px] text-cyan-300 border border-white/[0.05]">
                <code>// Automated remediation rule: redistribute review queue & enforce algorithm pinning</code>
              </div>
            </div>
          </div>

          {/* Automated Remediation Simulation Box */}
          <div className="space-y-2 rounded-xl border border-white/[0.08] bg-[#0A0F1D] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Automated Remediation Sandbox
                </span>
              </div>
              {!simulationActive ? (
                <button
                  onClick={handleStartSimulation}
                  className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Play className="h-3 w-3" />
                  Simulate Remediation
                </button>
              ) : (
                <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  Simulation Verified
                </span>
              )}
            </div>

            {simulationActive && (
              <div className="mt-2.5 space-y-1.5 font-mono text-[11px] bg-black/40 p-3 rounded-lg border border-white/[0.05]">
                {SIMULATION_STEPS.slice(0, simStep + 1).map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 ${
                      idx === simStep ? 'text-cyan-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <ArrowRight className="h-3 w-3 text-cyan-400" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Impacted Repositories */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Impacted Repositories
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {insight.affectedRepositories.map((repo) => (
                <div
                  key={repo}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <GitBranch className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span className="font-mono text-slate-200 truncate">{repo}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    Monitored
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/[0.08] bg-[#0A0E1A] gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={applied ? Check : Zap}
              disabled={applied}
              onClick={handleApply}
              className={applied ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
            >
              {applied ? 'Remediation Applied' : 'Apply Automated Remediation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

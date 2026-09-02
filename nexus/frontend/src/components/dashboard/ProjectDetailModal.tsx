import React from 'react';
import {
  X,
  GitBranch,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Layers,
  Rocket,
  GitCommit,
  GitPullRequest,
  ExternalLink,
} from 'lucide-react';
import { PipelineProject, PipelineStage } from '../../types/dashboard';

interface ProjectDetailModalProps {
  project: PipelineProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'research', label: 'Research' },
  { id: 'development', label: 'Development' },
  { id: 'review', label: 'Code Review' },
  { id: 'security_review', label: 'Security Review' },
  { id: 'staging', label: 'Staging' },
  { id: 'production', label: 'Production' },
];

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !project) return null;

  const currentStageIndex = STAGES.findIndex((s) => s.id === project.stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl rounded-xl border border-white/[0.12] bg-[#0E1424] shadow-2xl shadow-black/80 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] px-6 py-4 bg-white/[0.02]">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-white">{project.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  {project.repository}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase font-mono ${
                    project.riskLevel === 'high'
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                      : project.riskLevel === 'medium'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {project.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{project.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">
          {/* Stage Progression Bar */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Pipeline Stage Progression
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {STAGES.map((s, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div
                    key={s.id}
                    className={`rounded-lg border p-2.5 text-center transition-all ${
                      isCurrent
                        ? 'border-cyan-500/50 bg-cyan-500/15 shadow-xs'
                        : isPassed
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/[0.05] bg-white/[0.02] text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isPassed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-slate-600" />
                      )}
                    </div>
                    <div
                      className={`text-[11px] font-semibold tracking-tight ${
                        isCurrent ? 'text-cyan-300' : isPassed ? 'text-emerald-300' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                Health Score
              </div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {project.healthScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                Due Date
              </div>
              <div className="text-sm font-semibold font-mono text-slate-200 mt-1.5">
                {project.dueDate}
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                CI Build
              </div>
              <div className="text-sm font-semibold text-emerald-300 capitalize mt-1.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {project.buildStatus}
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Rocket className="h-3.5 w-3.5 text-blue-400" />
                Deployment
              </div>
              <div className="text-sm font-semibold text-blue-300 capitalize mt-1.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                {project.deploymentStatus}
              </div>
            </div>
          </div>

          {/* Owner & Assigned Reviewers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-cyan-400" />
                Project Owner
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={project.owner.avatar}
                  alt={project.owner.name}
                  className="h-10 w-10 rounded-full border border-white/[0.1] object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-white">{project.owner.name}</div>
                  <div className="text-xs text-slate-400">{project.owner.role}</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-purple-400" />
                Assigned Reviewers & Leads
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0E1424]"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                    alt="Marcus Chen"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0E1424]"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                    alt="Sarah Kim"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0E1424]"
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
                    alt="Devadharshini R"
                  />
                </div>
                <span className="text-xs text-slate-400 ml-2">3 reviewers assigned</span>
              </div>
            </div>
          </div>

          {/* Recent Commits & Pull Requests */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <GitPullRequest className="h-3.5 w-3.5 text-cyan-400" />
              Connected Pull Requests & Commits
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
                <div className="flex items-center gap-2.5">
                  <GitCommit className="h-4 w-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-medium text-slate-200">
                      feat: integrate vectorized rate-limiting cache rules
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      commit <span className="text-cyan-400 font-semibold">9e1a8b2</span> · 18m ago by {project.owner.name}
                    </div>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  Passing CI
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
                <div className="flex items-center gap-2.5">
                  <GitPullRequest className="h-4 w-4 text-purple-400" />
                  <div>
                    <div className="text-xs font-medium text-slate-200">
                      PR #418: Staging cluster canary deployment configuration
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      branch <span className="text-slate-300">staging-canary-v2</span> · 2 reviews approved
                    </div>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  Ready to Merge
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/[0.08] px-6 py-3.5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.06]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Pipeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

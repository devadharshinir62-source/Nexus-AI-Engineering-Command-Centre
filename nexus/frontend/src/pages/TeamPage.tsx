import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useRepository } from '../context/RepositoryContext';
import { Users2, GitPullRequest, GitCommit, CheckCircle, ShieldCheck, Zap, Activity } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { selectedRepo } = useRepository();

  const teamMembers = [
    {
      name: 'Devadharshini R',
      role: 'Engineering Lead & Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      handle: 'devadharshini',
      commits: 168,
      prsReviewed: 54,
      activePRs: 4,
      velocity: '96/100',
      status: 'active',
      repositories: ['nexus-api-gateway', 'nexus-web-client', 'nexus-auth-core'],
    },
    {
      name: 'Elena Rostova',
      role: 'Principal ML & Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      handle: 'erostova',
      commits: 142,
      prsReviewed: 48,
      activePRs: 3,
      velocity: '94/100',
      status: 'active',
      repositories: ['nexus-api-gateway', 'nexus-analytics-worker'],
    },
    {
      name: 'Marcus Chen',
      role: 'Staff Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      handle: 'mchen_dev',
      commits: 98,
      prsReviewed: 36,
      activePRs: 2,
      velocity: '91/100',
      status: 'active',
      repositories: ['nexus-web-client'],
    },
    {
      name: 'Sarah Kim',
      role: 'Security & DevOps Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      handle: 'sarah_k',
      commits: 78,
      prsReviewed: 62,
      activePRs: 1,
      velocity: '88/100',
      status: 'active',
      repositories: ['nexus-auth-core', 'nexus-billing-engine'],
    },
    {
      name: 'David Vance',
      role: 'Senior Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      handle: 'dvance',
      commits: 64,
      prsReviewed: 30,
      activePRs: 2,
      velocity: '84/100',
      status: 'active',
      repositories: ['nexus-billing-engine', 'nexus-data-pipeline'],
    },
  ];

  const filteredMembers = teamMembers.filter(
    (m) => selectedRepo === 'all' || m.repositories.includes(selectedRepo)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Users2 className="h-5 w-5 text-cyan-400" />
              Engineering Team & Contributor Telemetry
            </h2>
            {selectedRepo !== 'all' && (
              <Badge variant="cyan" size="sm" className="font-mono text-[10px]">
                Scope: {selectedRepo}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Review distribution, pull request velocity, and team workload balancing across active services
          </p>
        </div>

        <Badge variant="emerald" size="sm" dot pulse className="font-mono text-xs">
          5 Contributors Synced
        </Badge>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => (
          <Card key={member.handle} variant="interactive" className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-12 w-12 rounded-xl object-cover border border-white/[0.1]"
                />
                <div>
                  <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                  <p className="text-xs text-slate-400">{member.role}</p>
                  <span className="text-[10px] text-cyan-400 font-mono">@{member.handle}</span>
                </div>
              </div>

              <Badge variant="success" size="sm" dot pulse>
                {member.status}
              </Badge>
            </div>

            {/* Repositories Tag Strip */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {member.repositories.map((repo) => (
                <span
                  key={repo}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.05]"
                >
                  {repo}
                </span>
              ))}
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06] text-center">
              <div className="rounded-lg bg-white/[0.03] p-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Commits</span>
                <span className="text-sm font-bold font-mono text-white flex items-center justify-center gap-1 mt-0.5">
                  <GitCommit className="h-3 w-3 text-cyan-400" /> {member.commits}
                </span>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Reviews</span>
                <span className="text-sm font-bold font-mono text-white flex items-center justify-center gap-1 mt-0.5">
                  <GitPullRequest className="h-3 w-3 text-purple-400" /> {member.prsReviewed}
                </span>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Velocity</span>
                <span className="text-sm font-bold font-mono text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <Zap className="h-3 w-3" /> {member.velocity}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Settings, FolderGit2, Shield, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            Workspace & Integration Settings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure GitHub OAuth applications, webhook secrets, and notification preferences
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Save} className="text-xs">
          Save Preferences
        </Button>
      </div>

      {/* GitHub Integration Card */}
      <Card className="p-5 space-y-4">
        <CardHeader className="pb-3 border-b border-white/[0.06]">
          <div>
            <CardTitle>
              <FolderGit2 className="h-4 w-4 text-cyan-400" />
              GitHub App Integration
            </CardTitle>
            <CardDescription>
              Authorizes NEXUS to read commit logs, pull request events, and security advisories
            </CardDescription>
          </div>
          <Badge variant="success" size="sm">Connected</Badge>
        </CardHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <span className="text-xs font-semibold text-white">GitHub Organization</span>
              <p className="text-xs text-slate-400">nexus-ai</p>
            </div>
            <Button variant="secondary" size="xs">
              Re-authorize
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <span className="text-xs font-semibold text-white">Webhook Secret</span>
              <p className="text-xs font-mono text-slate-400">••••••••••••••••••••••••</p>
            </div>
            <Button variant="secondary" size="xs">
              Rotate
            </Button>
          </div>
        </div>
      </Card>

      {/* Telemetry Preferences */}
      <Card className="p-5 space-y-4">
        <CardHeader className="pb-3 border-b border-white/[0.06]">
          <div>
            <CardTitle>
              <Shield className="h-4 w-4 text-cyan-400" />
              Telemetry & AI Indexing Rules
            </CardTitle>
            <CardDescription>
              Fine-tune automated scan intervals and AI risk thresholds
            </CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white">Continuous AI PR Risk Scoring</span>
              <p className="text-xs text-slate-400">Automatically triage PRs with &gt; 500 lines changed</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-white/[0.2] text-cyan-500" />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white">Flaky Test Quarantine</span>
              <p className="text-xs text-slate-400">Mark test suites failing intermittently in CI</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-white/[0.2] text-cyan-500" />
          </label>
        </div>
      </Card>
    </div>
  );
};

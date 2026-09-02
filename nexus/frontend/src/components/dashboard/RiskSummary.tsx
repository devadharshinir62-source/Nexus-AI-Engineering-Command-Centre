import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { RiskItem, RiskLevel } from '../../types/dashboard';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface RiskSummaryProps {
  risks: RiskItem[];
  onMitigate?: (risk: RiskItem) => void;
}

const severityBadgeMap: Record<RiskLevel, { variant: 'danger' | 'warning' | 'primary' | 'neutral'; label: string }> = {
  critical: { variant: 'danger', label: 'CRITICAL' },
  high: { variant: 'danger', label: 'HIGH RISK' },
  medium: { variant: 'warning', label: 'MEDIUM' },
  low: { variant: 'neutral', label: 'LOW' },
};

export const RiskSummary: React.FC<RiskSummaryProps> = ({ risks, onMitigate }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3">
        <div>
          <CardTitle>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            Active Risk & Reliability Warnings
          </CardTitle>
          <CardDescription>
            Continuous detection of stale pull requests, brittle tests, and code decay
          </CardDescription>
        </div>

        <Badge variant="warning" size="sm" className="font-mono text-[10px]">
          {risks.length} Detected
        </Badge>
      </CardHeader>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {risks.map((risk) => {
          const badgeConfig = severityBadgeMap[risk.severity];
          return (
            <div
              key={risk.id}
              className="rounded-xl border border-white/[0.08] bg-[#0E1424]/70 p-3.5 transition-all duration-150 hover:border-amber-500/30 hover:bg-[#131B30]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500/10 text-amber-400 mt-0.5">
                    {risk.severity === 'high' || risk.severity === 'critical' ? (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{risk.title}</h4>
                    <span className="font-mono text-[10px] text-slate-400">
                      Repo: {risk.repository}
                    </span>
                  </div>
                </div>

                <Badge variant={badgeConfig.variant} size="sm" className="font-mono text-[10px]">
                  {badgeConfig.label}
                </Badge>
              </div>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed pl-8">
                {risk.details}
              </p>

              <div className="mt-3 flex items-center justify-between pl-8 pt-2 border-t border-white/[0.04]">
                <span className="text-[10px] font-mono text-slate-400">
                  Status: <span className="text-slate-300 capitalize">{risk.status}</span>
                </span>

                <Button
                  variant="outline"
                  size="xs"
                  icon={CheckCircle}
                  onClick={() => onMitigate && onMitigate(risk)}
                  className="text-slate-300 hover:text-white"
                >
                  Triage
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

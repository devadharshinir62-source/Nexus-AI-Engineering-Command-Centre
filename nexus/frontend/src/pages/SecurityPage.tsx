import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useRepository } from '../context/RepositoryContext';
import { DashboardService } from '../services/dashboardService';
import { SecurityIntelligenceData } from '../types/dashboard';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  FileCode,
  PackageSearch,
  CheckCircle,
  AlertTriangle,
  Lock,
  ExternalLink,
  X,
  Zap,
  Terminal,
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const { selectedRepo } = useRepository();
  const [secData, setSecData] = useState<SecurityIntelligenceData | null>(null);
  const [selectedVuln, setSelectedVuln] = useState<any | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    DashboardService.getSecurityData(selectedRepo).then((res) => setSecData(res));
  }, [selectedRepo]);

  const handleTriggerScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 1200);
  };

  if (!secData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Security & Risk Intelligence Center
            </h2>
            {selectedRepo !== 'all' && (
              <Badge variant="cyan" size="sm" className="font-mono text-[10px]">
                Scope: {selectedRepo}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time CVE triage, static application security testing (SAST), secrets detection, and dependency audits
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={ShieldAlert}
          isLoading={scanning}
          onClick={handleTriggerScan}
          className="text-xs"
        >
          Run Security Audit
        </Button>
      </div>

      {/* Security Risk Matrix Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-rose-400">
            <span>Critical Severity</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">{secData.criticalCount}</p>
          <span className="text-[11px] text-rose-300/80">Immediate patch required</span>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-amber-400">
            <span>High Severity</span>
            <ShieldAlert className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">{secData.highCount}</p>
          <span className="text-[11px] text-amber-300/80">Target fix within 48h</span>
        </div>

        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-blue-400">
            <span>Medium Severity</span>
            <PackageSearch className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">{secData.mediumCount}</p>
          <span className="text-[11px] text-blue-300/80">Scheduled next release</span>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-emerald-400">
            <span>Secrets Scanned</span>
            <KeyRound className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold font-mono text-emerald-400">0 Leaked</p>
          <span className="text-[11px] text-emerald-300/80">Pre-commit shields active</span>
        </div>
      </div>

      {/* CVE Scanner & Vulnerability Findings Table */}
      <Card className="p-5 space-y-4">
        <CardHeader className="pb-3 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Vulnerability Findings & Dependency Advisories ({secData.vulnerabilities.length})
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Click any finding to inspect root cause, patch instructions, and blast radius
              </CardDescription>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {secData.dependenciesScanned} packages audited
            </span>
          </div>
        </CardHeader>

        <div className="space-y-2.5">
          {secData.vulnerabilities.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-white/[0.08] rounded-xl text-slate-400">
              <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-white">No Vulnerabilities Detected</div>
              <p className="text-xs text-slate-400 mt-1">All dependencies in {selectedRepo} meet compliance baselines.</p>
            </div>
          ) : (
            secData.vulnerabilities.map((vuln) => (
              <div
                key={vuln.id}
                onClick={() => setSelectedVuln(vuln)}
                className="rounded-xl border border-white/[0.08] bg-[#0E1424] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/40 hover:bg-[#11192e] transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg border shrink-0 ${
                      vuln.severity === 'critical'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : vuln.severity === 'high'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    <PackageSearch className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                          vuln.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : vuln.severity === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {vuln.severity}
                      </span>
                      <span className="font-mono text-xs font-semibold text-white">{vuln.cve}</span>
                      <span className="font-mono text-xs text-cyan-400 font-semibold">{vuln.package}</span>
                      <span className="text-[11px] font-mono text-slate-400">({vuln.repository})</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{vuln.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block font-mono text-xs">
                    <div className="text-slate-400">Fixed in: <span className="text-emerald-400 font-bold">{vuln.patchedVersion}</span></div>
                    <div className="text-[10px] text-slate-500">Detected {vuln.detectedDate}</div>
                  </div>
                  <Button variant="secondary" size="xs">
                    Inspect Finding
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Secret Leak Detection & SAST Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-4 space-y-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            Secret Leak Detection & Token Rotation
          </CardTitle>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
              <span className="text-slate-300">GitHub Commit GitGuardian Scanner</span>
              <span className="text-emerald-400 font-mono font-semibold">Active · 0 Leaks</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
              <span className="text-slate-300">Stripe Webhook Signature Age</span>
              <span className="text-slate-300 font-mono">14 days (Rotated)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
              <span className="text-slate-300">JWT RS256 Private Key Storage</span>
              <span className="text-emerald-400 font-mono font-semibold">AWS KMS Hardware HS</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileCode className="h-4 w-4 text-purple-400" />
            SAST Static Code Analysis
          </CardTitle>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
              <span className="text-slate-300">SQL Injection Parameterization</span>
              <span className="text-emerald-400 font-mono font-semibold">100% Validated</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
              <span className="text-slate-300">DOM XSS Sanitization in Client</span>
              <span className="text-emerald-400 font-mono font-semibold">DOMPurify Enforced</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
              <span className="text-slate-300">CORS Origin Strict Header Policy</span>
              <span className="text-emerald-400 font-mono font-semibold">Restricted</span>
            </div>
          </div>
        </Card>
      </div>

      {/* CVE Inspection Drawer */}
      {selectedVuln && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl h-full bg-[#0E1424] border-l border-white/[0.12] shadow-2xl flex flex-col p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">{selectedVuln.cve}</h3>
                  <div className="text-xs text-slate-400">{selectedVuln.package} in {selectedVuln.repository}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVuln(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
                <h4 className="font-semibold text-slate-200 uppercase font-mono text-[11px]">Vulnerability Summary</h4>
                <p className="text-slate-300 leading-relaxed">{selectedVuln.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="text-slate-400 text-[11px]">Vulnerable Range</div>
                  <div className="text-rose-400 font-bold mt-1">{selectedVuln.vulnerableVersions}</div>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="text-slate-400 text-[11px]">Patched In</div>
                  <div className="text-emerald-400 font-bold mt-1">{selectedVuln.patchedVersion}</div>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-2">
                <h4 className="font-semibold text-cyan-300 uppercase font-mono text-[11px] flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  Prescribed Remediation Command
                </h4>
                <p className="text-slate-300">{selectedVuln.remediation}</p>
                <div className="rounded-lg bg-black/80 p-2.5 font-mono text-[11px] text-cyan-300 border border-white/[0.05]">
                  <code>pip install --upgrade {selectedVuln.package} {selectedVuln.patchedVersion}</code>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => setSelectedVuln(null)}
                className="px-3.5 py-1.5 rounded-lg border border-white/[0.1] text-slate-300 hover:text-white text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Remediation PR triggered on ' + selectedVuln.repository);
                  setSelectedVuln(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs cursor-pointer"
              >
                Create Auto-Fix PR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

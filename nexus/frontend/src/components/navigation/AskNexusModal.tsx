import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Sparkles,
  Send,
  Bot,
  User,
  X,
  Copy,
  Check,
  Code2,
  Terminal,
  ShieldCheck,
  GitBranch,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  actionLink?: { label: string; url: string };
}

const DEFAULT_SUGGESTED_QUESTIONS = [
  'Why did project health change?',
  'Which repository has the highest risk?',
  'What deployments need attention?',
  'What security issues should I investigate?',
  'Which project has the biggest performance bottleneck?',
];

const KNOWLEDGE_BASE: Record<string, { text: string; codeSnippet?: string }> = {
  health: {
    text: 'Project health increased to 94/100 (+3.4% vs last sprint). Key drivers include: 16 closed backlog issues across nexus-api-gateway, test pass rate improving to 98.4%, and average PR cycle turnaround decreasing from 48h to 24.2h. However, nexus-billing-engine dropped to 78/100 due to Stripe webhook reconciliation test failures.',
  },
  risk: {
    text: 'nexus-billing-engine currently holds the highest composite risk rating (Score: 78/100). Primary factor: PR #308 ("Payment processing logic refactor") touches 843 lines across 18 core billing files and has been pending code review for over 5 days without automated regression tests.',
    codeSnippet: `# Highest risk items summary:
1. nexus-billing-engine: PR #308 (Stale > 5d, 843 LOC changed)
2. nexus-auth-core: Algorithm whitelist missing in RS256 token parser
3. nexus-analytics-worker: Staging queue backpressure (4,120 items)`,
  },
  deployment: {
    text: 'Release v2.1.0-beta in nexus-billing-engine failed staging deployment during database schema migration step. Meanwhile, nexus-api-gateway v2.4.1 and nexus-web-client v1.18.0 deployed successfully to Production (US-East-1) with 99.2% build pass rate and 18ms latency.',
    codeSnippet: `// Failing deployment trace:
service: nexus-billing-engine
environment: staging
failure_step: alembic upgrade head
error: duplicate key value violates unique constraint "uq_stripe_subscriptions_customer_id"`,
  },
  security: {
    text: '1 High Severity vulnerability detected in nexus-auth-core: The RS256 token decoder in token_manager.py:44 does not enforce explicit algorithm whitelist checking, creating potential JWT algorithm confusion risk if HMAC tokens are submitted.',
    codeSnippet: `# Recommended Remediation:
# In nexus-auth-core/app/core/token_manager.py:
decoded = jwt.decode(
    token, 
    PUBLIC_KEY, 
    algorithms=["RS256"]  # Enforce explicit whitelist
)`,
  },
  bottleneck: {
    text: 'The primary velocity bottleneck is located in nexus-auth-core. Pull requests currently average 38.4 hours to merge due to a single-reviewer dependency on @alexc. We recommend distributing review assignments to @sarah_k to reduce turnaround time by an estimated ~42%.',
  },
};

interface AskNexusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskNexusModal: React.FC<AskNexusModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Greetings. I am NEXUS AI, connected to your 8 indexed repositories and continuous telemetry pipeline. Ask me anything regarding codebase health, PR bottlenecks, security vulnerabilities, or failed CI/CD deployments.',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const lower = queryText.toLowerCase();
      let response = KNOWLEDGE_BASE.health;

      if (lower.includes('risk') || lower.includes('highest')) {
        response = KNOWLEDGE_BASE.risk;
      } else if (lower.includes('deployment') || lower.includes('deploy') || lower.includes('attention')) {
        response = KNOWLEDGE_BASE.deployment;
      } else if (lower.includes('security') || lower.includes('cve') || lower.includes('vulnerability')) {
        response = KNOWLEDGE_BASE.security;
      } else if (lower.includes('bottleneck') || lower.includes('performance') || lower.includes('slow')) {
        response = KNOWLEDGE_BASE.bottleneck;
      } else if (lower.includes('health') || lower.includes('change')) {
        response = KNOWLEDGE_BASE.health;
      } else {
        response = {
          text: `Analyzing active telemetry across 8 repositories for "${queryText}". Telemetry index shows healthy build pipelines with 98.4% success rate. 4 actionable AI recommendations and 3 risks are tracked.`,
          codeSnippet: `# Microservice Telemetry Status:
nexus-api-gateway    : 98% Health (Healthy, 18ms latency)
nexus-web-client     : 95% Health (Healthy, 140ms load)
nexus-auth-core      : 84% Health (Warning, Review bottleneck)
nexus-billing-engine : 78% Health (Degraded, Failing migration)`,
        };
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.text,
        codeSnippet: response.codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#0E1424]/95 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col h-[640px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Ask NEXUS AI Assistant</h3>
                <Badge variant="cyan" size="sm" className="font-mono text-[10px] py-0">
                  8 Repos Indexed
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">
                Natural-language query engine across codebase telemetry, PRs, and CI/CD pipelines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Conversation Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs ${
                  msg.sender === 'ai'
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    : 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                }`}
              >
                {msg.sender === 'ai' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600/20 text-white border border-blue-500/30 rounded-tr-none'
                    : 'bg-[#111728] text-slate-200 border border-white/[0.08] rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>

                {msg.codeSnippet && (
                  <div className="mt-2 rounded-lg bg-black/70 p-3 font-mono text-[11px] text-cyan-300 border border-white/[0.06] overflow-x-auto">
                    <pre>{msg.codeSnippet}</pre>
                  </div>
                )}

                <span className="text-[10px] text-slate-500 block text-right font-mono mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-2xl bg-[#111728] p-3 border border-white/[0.08] rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="h-3 w-3 animate-spin text-cyan-400" />
                <span>NEXUS AI is analyzing repository telemetry...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0">Try:</span>
          {DEFAULT_SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              disabled={loading}
              className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors cursor-pointer disabled:opacity-50 truncate max-w-[220px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="p-3.5 bg-[#0A0E1A] border-t border-white/[0.08] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about PRs, bottlenecks, failed builds, flaky tests..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={Send}
            isLoading={loading}
            disabled={!input.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

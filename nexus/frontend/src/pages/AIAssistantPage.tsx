import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  Send,
  Terminal,
  Bot,
  User,
  GitBranch,
  ShieldCheck,
  Zap,
  Code2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export const AIAssistantPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings Alex. I am NEXUS AI, connected to your 8 indexed repositories. I can analyze pull request risks, debug CI/CD pipeline failures, suggest architectural refactors, and summarize sprint progress.',
      timestamp: '10:00 AM',
    },
    {
      id: '2',
      sender: 'user',
      text: 'Why did the nexus-billing-engine staging deployment fail earlier today?',
      timestamp: '10:02 AM',
    },
    {
      id: '3',
      sender: 'ai',
      text: 'The failure occurred during the database migration step in release v2.1.0-beta. The migration attempted to add a UNIQUE constraint on the customer_id column in the stripe_subscriptions table, but 4 duplicate records existed in the staging database.',
      codeSnippet: `// Migration error traceback:
alembic.util.exc.CommandError: Unique constraint "uq_stripe_subscriptions_customer_id" 
failed validation: duplicate key value (customer_id=cus_88921) already exists in table.`,
      timestamp: '10:02 AM',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: `Analyzing context across your active repositories for "${input}"... In Phase 2, this will interface directly with the FastAPI AI service pipeline.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  const samplePrompts = [
    'Analyze PR #412 for security vulnerabilities',
    'Which microservices have the highest review bottleneck?',
    'Generate test cases for Stripe webhook duplicate events',
    'Summarize commits pushed to main in the last 24 hours',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            NEXUS AI Engineering Assistant
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Natural-language codebase querying, root-cause diagnostic engine, and automated patch generator
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm" dot pulse className="font-mono">
            LLM Context Ready
          </Badge>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex flex-col h-[620px] p-0 overflow-hidden">
        {/* Messages feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                  msg.sender === 'ai'
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    : 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                }`}
              >
                {msg.sender === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600/20 text-white border border-blue-500/30 rounded-tr-none'
                    : 'bg-[#0E1424] text-slate-200 border border-white/[0.08] rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>

                {msg.codeSnippet && (
                  <div className="mt-2 rounded-lg bg-black/60 p-3 font-mono text-[11px] text-cyan-300 border border-white/[0.06] overflow-x-auto">
                    <pre>{msg.codeSnippet}</pre>
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block text-right font-mono mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-5 py-2.5 bg-black/30 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0">Try:</span>
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setInput(prompt)}
              className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#0A0E1A] border-t border-white/[0.08] flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask NEXUS about commits, pull request risks, flaky tests, architecture..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none"
          />
          <Button type="submit" variant="primary" size="sm" icon={Send}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
};

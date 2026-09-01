import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Sparkles, User } from 'lucide-react';
import {
  type ConduitData,
  type RiskBreakdown,
  computeHeatRisk,
  levelFromScore,
} from '@/data/conduit';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTED = [
  'Why is heat risk high?',
  'Has rainfall changed recently?',
  'What should farmers do?',
  'What caused today\u2019s risk?',
];

// Simple rule-based responder that uses the app's environmental data.
function answer(question: string, data: ConduitData, risk: RiskBreakdown): string {
  const q = question.toLowerCase();

  if (q.includes('heat') && (q.includes('high') || q.includes('why'))) {
    const heat = computeHeatRisk(data);
    const factors: string[] = [];
    if (data.temperature > 30) factors.push(`temperature is ${data.temperature}°C`);
    if (data.humidity > 70) factors.push(`humidity is ${data.humidity}%`);
    if (data.solar > 700) factors.push(`solar exposure is elevated (${data.solar} W/m²)`);
    if (data.wbgt > 28) factors.push(`WBGT is ${data.wbgt}°C`);
    return `Heat risk is ${risk.heat} (${levelFromScore(heat)}). Currently ${factors.join(', ')}. The combination increases heat-stress conditions.`;
  }

  if (q.includes('rainfall') && (q.includes('change') || q.includes('recent'))) {
    return `Today's rainfall is ${data.rainfall} mm with ${data.humidity}% humidity. Recent precipitation has been moderate. Atmospheric pressure is ${data.pressure} hPa, ${data.pressure < 1013 ? 'slightly below standard, suggesting unsettled conditions' : 'near standard.'}`;
  }

  if (q.includes('farmer')) {
    if (risk.heatLevel === 'CRITICAL' || risk.heatLevel === 'HIGH') {
      return `With heat risk at ${risk.heat} (${risk.heatLevel}), farmers should schedule demanding outdoor work during cooler early-morning or late-afternoon periods, ensure livestock have shade and water, and delay planting or chemical application until conditions stabilize.`;
    }
    return `Current conditions are ${risk.heatLevel.toLowerCase()} risk. Farmers can proceed with normal operations but should monitor UV levels (${data.uv}) and stay hydrated during midday work.`;
  }

  if (q.includes('caused') || q.includes('today') || q.includes('risk')) {
    return `Today's overall risk is ${risk.overall} (${risk.level}). The main drivers are: heat risk ${risk.heat}, rainfall risk ${risk.rainfall}, and environmental stress ${risk.environmental}. ${risk.heat > risk.rainfall && risk.heat > risk.environmental ? 'Heat is the dominant factor.' : risk.rainfall > risk.environmental ? 'Rainfall is the dominant factor.' : 'Environmental stress is the dominant factor.'}`;
  }

  if (q.includes('temperature')) {
    return `Current temperature is ${data.temperature}°C, up approximately 2.1°C from yesterday. WBGT (wet bulb globe temperature) is ${data.wbgt}°C, which accounts for heat and humidity combined.`;
  }

  if (q.includes('humidity')) {
    return `Humidity is currently ${data.humidity}%, up 8% from yesterday. High humidity reduces the body's ability to cool through evaporation, contributing to heat-stress risk.`;
  }

  if (q.includes('wind')) {
    return `Wind speed is ${data.wind} km/h. ${data.wind > 20 ? 'Elevated winds may increase evaporation and fire risk.' : 'Wind conditions are moderate.'}`;
  }

  if (q.includes('action') || q.includes('do') || q.includes('recommend')) {
    return `Based on current risk (${risk.level}), recommended actions: ${risk.heatLevel === 'HIGH' || risk.heatLevel === 'CRITICAL' ? 'Communities should avoid prolonged outdoor exposure. Farmers should shift work to cooler hours. Authorities may consider a heat advisory.' : 'Conditions are manageable. Standard sun protection and hydration recommended.'}`;
  }

  return `I can answer questions about current environmental conditions and risk. Try asking about heat risk, rainfall, temperature (${data.temperature}°C), humidity (${data.humidity}%), or what actions to take.`;
}

export function Copilot({ data, risk }: { data: ConduitData; risk: RiskBreakdown }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hi, I'm the AquaGuard Climate Copilot. I can explain current environmental conditions and risk based on the data shown in this app. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text };
    const reply: Message = { role: 'assistant', text: answer(text, data, risk) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeout(() => setMessages((prev) => [...prev, reply]), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">AquaGuard Copilot</h1>
        <p className="text-sm text-slate-400">Ask questions about the environment.</p>
      </div>

      <div className="glass flex flex-col rounded-2xl animate-fade-in-up" style={{ height: 'calc(100vh - 220px)', minHeight: 400 }}>
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-3 animate-fade-in',
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  m.role === 'user'
                    ? 'bg-sky-500/15 border border-sky-400/20'
                    : 'bg-gradient-to-br from-aqua-400/20 to-emerald-400/20 border border-aqua-400/20',
                )}
              >
                {m.role === 'user' ? (
                  <User className="h-4 w-4 text-sky-300" />
                ) : (
                  <Sparkles className="h-4 w-4 text-aqua-300" />
                )}
              </div>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'bg-sky-500/15 text-slate-100 border border-sky-400/15'
                    : 'bg-white/5 text-slate-200 border border-white/8',
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested questions */}
        {messages.length <= 2 && (
          <div className="border-t border-white/8 p-4">
            <div className="mb-2 text-xs font-medium text-slate-500">Suggested questions</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-white/8 bg-white/3 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-aqua-400/30 hover:bg-aqua-500/10 hover:text-aqua-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/8 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-aqua-400/40">
              <MessageSquare className="h-4 w-4 text-slate-500" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the environment..."
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-aqua-500 text-base-900 transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

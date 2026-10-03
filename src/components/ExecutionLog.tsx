import { Terminal } from 'lucide-react';
import type { LogEntry } from '@/types';

interface ExecutionLogProps {
  logs: LogEntry[];
}

const logStyles: Record<string, string> = {
  info: 'text-slate-600 border-slate-300',
  step: 'text-blue-700 border-blue-400',
  success: 'text-emerald-700 border-emerald-400',
  error: 'text-rose-600 border-rose-400',
  warning: 'text-amber-700 border-amber-400',
};

const logPrefix: Record<string, string> = {
  info: 'INFO',
  step: 'STEP',
  success: 'DONE',
  error: 'ERROR',
  warning: 'WARN',
};

export function ExecutionLog({ logs }: ExecutionLogProps) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <Terminal className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-300">Execution Log</span>
      </div>
      <div className="p-4 max-h-64 overflow-y-auto font-mono text-xs space-y-1.5">
        {logs.length === 0 ? (
          <div className="text-slate-500 italic">No logs yet. Start a simulation to see step-by-step output.</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={`flex gap-2 pl-2 border-l-2 ${logStyles[log.type] || logStyles.info}`}>
              <span className="text-slate-500 shrink-0">[{logPrefix[log.type] || 'INFO'}]</span>
              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

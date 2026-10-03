import { CheckCircle2, XCircle, BarChart3, Clock } from 'lucide-react';
import type { ResultInfo } from '@/types';

interface ResultPanelProps {
  result: ResultInfo;
}

export function ResultPanel({ result }: ResultPanelProps) {
  const statusStyles = {
    idle: 'bg-slate-50 border-slate-200',
    running: 'bg-blue-50 border-blue-200',
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-rose-50 border-rose-200',
  };

  const StatusIcon = result.status === 'success' ? CheckCircle2 : result.status === 'error' ? XCircle : BarChart3;

  return (
    <div className={`rounded-xl border-2 p-4 ${statusStyles[result.status]}`}>
      <div className="flex items-start gap-3">
        <StatusIcon className={`w-5 h-5 shrink-0 mt-0.5 ${
          result.status === 'success' ? 'text-emerald-600' :
          result.status === 'error' ? 'text-rose-600' : 'text-slate-400'
        }`} />
        <div className="flex-1 space-y-2">
          <div className="text-sm font-medium text-slate-800">
            {result.message || 'Waiting for simulation...'}
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Comparisons:</span>
              <span className="font-mono font-semibold text-slate-700">{result.comparisons}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Time Complexity:</span>
              <span className="font-mono font-semibold text-slate-700">{result.timeComplexity}</span>
            </div>
          </div>
          {result.finalArray && (
            <div className="text-xs text-slate-500">
              Final array: <span className="font-mono font-semibold text-slate-700">[{result.finalArray.join(', ')}]</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

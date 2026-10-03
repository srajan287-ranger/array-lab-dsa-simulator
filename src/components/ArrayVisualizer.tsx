import type { ArrayCell, CellState } from '@/types';

interface ArrayVisualizerProps {
  cells: ArrayCell[];
  lowerBound?: number;
}

const stateStyles: Record<CellState, string> = {
  default: 'bg-white border-slate-300 text-slate-800',
  current: 'bg-blue-500 border-blue-600 text-white scale-110 shadow-lg shadow-blue-500/50',
  comparing: 'bg-amber-400 border-amber-500 text-amber-950 scale-110 shadow-lg shadow-amber-400/50',
  target: 'bg-rose-500 border-rose-600 text-white scale-110 shadow-lg shadow-rose-500/50',
  selected: 'bg-cyan-500 border-cyan-600 text-white scale-105 shadow-md shadow-cyan-500/50',
  inserted: 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-md shadow-emerald-500/50',
  deleted: 'bg-rose-600 border-rose-700 text-white opacity-50 scale-90',
  shifted: 'bg-violet-400 border-violet-500 text-violet-950',
  found: 'bg-emerald-500 border-emerald-600 text-white scale-110 shadow-lg shadow-emerald-500/50 animate-pulse',
  low: 'bg-sky-400 border-sky-500 text-sky-950',
  mid: 'bg-indigo-500 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/50',
  high: 'bg-teal-400 border-teal-500 text-teal-950',
  discarded: 'bg-slate-200 border-slate-300 text-slate-400 opacity-50',
};

const stateLabels: Partial<Record<CellState, string>> = {
  current: 'Current',
  comparing: 'Comparing',
  target: 'Target',
  selected: 'Selected',
  inserted: 'Inserted',
  deleted: 'Deleted',
  shifted: 'Shifted',
  found: 'Found!',
  low: 'Low',
  mid: 'Mid',
  high: 'High',
  discarded: 'Discarded',
};

export function ArrayVisualizer({ cells, lowerBound = 0 }: ArrayVisualizerProps) {
  if (cells.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
        Array is empty
      </div>
    );
  }

  return (
    <div className="overflow-x-auto py-4">
      <div className="flex gap-3 min-w-max justify-center px-4">
        {cells.map((cell, i) => (
          <div key={i} className="flex flex-col items-center gap-1 transition-all">
            <div
              className={`relative w-16 h-16 flex items-center justify-center border-2 rounded-xl text-lg font-bold transition-all duration-300 ${stateStyles[cell.state]}`}
            >
              {cell.value}
              {stateLabels[cell.state] && (
                <span className="absolute -top-2.5 -right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-800 text-white whitespace-nowrap">
                  {stateLabels[cell.state]}
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-slate-500">
              i={lowerBound + i}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

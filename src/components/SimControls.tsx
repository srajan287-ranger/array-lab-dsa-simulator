import { Play, Pause, SkipForward, SkipBack, RotateCcw, Square, Gauge } from 'lucide-react';
import type { SimulationController } from '@/hooks/useSimulation';

interface SimControlsProps {
  sim: SimulationController;
}

export function SimControls({ sim }: SimControlsProps) {
  const totalSteps = sim.steps.length;
  const progress = totalSteps > 0 ? ((sim.currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={sim.start}
          disabled={totalSteps > 0 && sim.currentStep < totalSteps - 1}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Square className="w-4 h-4" />
          Start
        </button>

        <button
          onClick={sim.prev}
          disabled={sim.currentStep === 0}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={sim.isPlaying ? sim.pause : sim.play}
          disabled={totalSteps === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {sim.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {sim.isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={sim.next}
          disabled={totalSteps === 0 || sim.currentStep >= totalSteps - 1}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={sim.reset}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors ml-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
          Step {totalSteps > 0 ? sim.currentStep + 1 : 0} / {totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500">Speed:</span>
        <input
          type="range"
          min="200"
          max="2000"
          step="100"
          value={2100 - sim.speed}
          onChange={(e) => sim.setSpeed(2100 - Number(e.target.value))}
          className="flex-1 accent-blue-500"
        />
        <span className="text-xs font-mono text-slate-400 w-12 text-right">
          {((2100 - sim.speed) / 100).toFixed(1)}x
        </span>
      </div>
    </div>
  );
}

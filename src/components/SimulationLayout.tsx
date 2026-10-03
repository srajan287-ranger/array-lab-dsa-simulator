import type { ReactNode } from 'react';
import type { SimStep } from '@/types';
import { ArrayVisualizer } from '@/components/ArrayVisualizer';
import { SimControls } from '@/components/SimControls';
import { ExecutionLog } from '@/components/ExecutionLog';
import { ResultPanel } from '@/components/ResultPanel';
import type { SimulationController } from '@/hooks/useSimulation';

interface SimulationLayoutProps {
  title: string;
  description: string;
  controlPanel: ReactNode;
  sim: SimulationController;
  lowerBound?: number;
  extraVisual?: ReactNode;
}

export function SimulationLayout({
  title,
  description,
  controlPanel,
  sim,
  lowerBound = 0,
  extraVisual,
}: SimulationLayoutProps) {
  const currentStepData: SimStep | null =
    sim.steps.length > 0 ? sim.steps[sim.currentStep] : null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        {/* Control Panel */}
        <div className="space-y-3">
          {controlPanel}
        </div>

        {/* Visualization Area */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Array Visualization</div>
            <ArrayVisualizer
              cells={currentStepData?.array ?? []}
              lowerBound={lowerBound}
            />
            {extraVisual}
            {currentStepData?.stepDescription && (
              <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100">
                {currentStepData.stepDescription}
              </div>
            )}
          </div>

          <SimControls sim={sim} />

          <div className="grid md:grid-cols-2 gap-4">
            <ExecutionLog logs={currentStepData?.logs ?? []} />
            <ResultPanel result={currentStepData?.result ?? { status: 'idle', comparisons: 0, timeComplexity: '—' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

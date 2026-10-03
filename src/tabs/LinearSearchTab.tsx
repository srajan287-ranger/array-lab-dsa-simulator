import { useState, useCallback } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { SimulationLayout } from '@/components/SimulationLayout';
import { useSimulation } from '@/hooks/useSimulation';
import { generateLinearSearchSteps } from '@/operations/linearSearch';
import { parseArrayInput } from '@/utils/validation';
import type { SimStep } from '@/types';

const EXAMPLE_ARRAY = '15, 8, 42, 23, 4, 16';
const EXAMPLE_TARGET = '23';

export function LinearSearchTab() {
  const [arrayInput, setArrayInput] = useState(EXAMPLE_ARRAY);
  const [target, setTarget] = useState(EXAMPLE_TARGET);
  const [error, setError] = useState('');

  const generateSteps = useCallback((): SimStep[] => {
    setError('');
    const arr = parseArrayInput(arrayInput);
    if (!arr || arr.length === 0) {
      setError('Please enter a valid array of integers.');
      return [];
    }
    const tgt = Number(target);
    if (Number.isNaN(tgt)) {
      setError('Target must be a valid integer.');
      return [];
    }
    return generateLinearSearchSteps({ array: arr, target: tgt });
  }, [arrayInput, target]);

  const sim = useSimulation(generateSteps);

  const loadExample = () => {
    setArrayInput(EXAMPLE_ARRAY);
    setTarget(EXAMPLE_TARGET);
    sim.reset();
    setError('');
  };

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <SimulationLayout
      title="Linear Search"
      description="Search for a target value by scanning the array left to right. Each element is compared — O(n) worst case."
      sim={sim}
      controlPanel={
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Search className="w-4 h-4 text-amber-500" />
            Search Parameters
          </div>
          <div>
            <label className={labelClass} htmlFor="lsArray">Array Elements</label>
            <input id="lsArray" className={inputClass} value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="e.g. 15, 8, 42, 23" />
          </div>
          <div>
            <label className={labelClass} htmlFor="lsTarget">Target Value</label>
            <input id="lsTarget" className={inputClass} value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. 23" />
          </div>
          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>
          )}
          <button onClick={sim.start} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors">
            <Search className="w-4 h-4" />
            Start Search
          </button>
          <button onClick={loadExample} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            <Sparkles className="w-4 h-4" />
            Load Example
          </button>
        </div>
      }
    />
  );
}

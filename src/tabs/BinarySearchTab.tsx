import { useState, useCallback } from 'react';
import { ArrowRightLeft, Sparkles, AlertTriangle } from 'lucide-react';
import { SimulationLayout } from '@/components/SimulationLayout';
import { useSimulation } from '@/hooks/useSimulation';
import { generateBinarySearchSteps, isSorted } from '@/operations/binarySearch';
import { parseArrayInput } from '@/utils/validation';
import type { SimStep } from '@/types';

const EXAMPLE_ARRAY = '5, 10, 15, 20, 25, 30, 35, 40';
const EXAMPLE_TARGET = '25';

export function BinarySearchTab() {
  const [arrayInput, setArrayInput] = useState(EXAMPLE_ARRAY);
  const [target, setTarget] = useState(EXAMPLE_TARGET);
  const [error, setError] = useState('');
  const [sortNotice, setSortNotice] = useState(false);

  const generateSteps = useCallback((): SimStep[] => {
    setError('');
    setSortNotice(false);
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

    let workArr = arr;
    let wasSorted = true;
    if (!isSorted(arr)) {
      workArr = [...arr].sort((a, b) => a - b);
      wasSorted = false;
      setSortNotice(true);
    }

    return generateBinarySearchSteps({ array: workArr, target: tgt, wasSorted });
  }, [arrayInput, target]);

  const sim = useSimulation(generateSteps);

  const loadExample = () => {
    setArrayInput(EXAMPLE_ARRAY);
    setTarget(EXAMPLE_TARGET);
    sim.reset();
    setError('');
    setSortNotice(false);
  };

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <SimulationLayout
      title="Binary Search"
      description="Search a sorted array by repeatedly halving the search range. Requires sorted data — O(log n) time."
      sim={sim}
      controlPanel={
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ArrowRightLeft className="w-4 h-4 text-indigo-500" />
            Search Parameters
          </div>
          <div>
            <label className={labelClass} htmlFor="bsArray">Array Elements (sorted recommended)</label>
            <input id="bsArray" className={inputClass} value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="e.g. 5, 10, 15, 20" />
          </div>
          <div>
            <label className={labelClass} htmlFor="bsTarget">Target Value</label>
            <input id="bsTarget" className={inputClass} value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. 25" />
          </div>
          {sortNotice && (
            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Your array was unsorted and has been automatically sorted for binary search.</span>
            </div>
          )}
          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>
          )}
          <button onClick={sim.start} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors">
            <ArrowRightLeft className="w-4 h-4" />
            Start Binary Search
          </button>
          <button onClick={loadExample} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            <Sparkles className="w-4 h-4" />
            Load Example
          </button>
          <div className="text-[10px] text-slate-400 leading-relaxed pt-1">
            Note: If the array is not sorted, it will be sorted automatically before searching.
          </div>
        </div>
      }
    />
  );
}

import { useState, useCallback } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { SimulationLayout } from '@/components/SimulationLayout';
import { useSimulation } from '@/hooks/useSimulation';
import { generateInsertionSteps } from '@/operations/insertion';
import { parseArrayInput } from '@/utils/validation';
import type { SimStep } from '@/types';

const EXAMPLE_ARRAY = '10, 20, 30, 40, 50';
const EXAMPLE_VALUE = '25';
const EXAMPLE_POS = '2';

export function InsertionTab() {
  const [arrayInput, setArrayInput] = useState(EXAMPLE_ARRAY);
  const [value, setValue] = useState(EXAMPLE_VALUE);
  const [position, setPosition] = useState(EXAMPLE_POS);
  const [error, setError] = useState('');

  const generateSteps = useCallback((): SimStep[] => {
    setError('');
    const arr = parseArrayInput(arrayInput);
    if (!arr || arr.length === 0) {
      setError('Please enter a valid array of integers (e.g. 10, 20, 30).');
      return [];
    }
    const val = Number(value);
    const pos = Number(position);
    if (Number.isNaN(val)) {
      setError('Value to insert must be a valid integer.');
      return [];
    }
    if (Number.isNaN(pos) || pos < 0 || pos > arr.length) {
      setError(`Position must be between 0 and ${arr.length} (inclusive).`);
      return [];
    }
    return generateInsertionSteps({ array: arr, value: val, position: pos });
  }, [arrayInput, value, position]);

  const sim = useSimulation(generateSteps);

  const loadExample = () => {
    setArrayInput(EXAMPLE_ARRAY);
    setValue(EXAMPLE_VALUE);
    setPosition(EXAMPLE_POS);
    sim.reset();
    setError('');
  };

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <SimulationLayout
      title="Array Insertion"
      description="Insert a value at a specified position. Watch elements shift right to make space — this takes O(n) time in the worst case."
      sim={sim}
      controlPanel={
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Plus className="w-4 h-4 text-emerald-500" />
            Insertion Parameters
          </div>
          <div>
            <label className={labelClass} htmlFor="insArray">Array Elements (comma or space separated)</label>
            <input id="insArray" className={inputClass} value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="e.g. 10, 20, 30" />
          </div>
          <div>
            <label className={labelClass} htmlFor="insValue">Value to Insert</label>
            <input id="insValue" className={inputClass} value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 25" />
          </div>
          <div>
            <label className={labelClass} htmlFor="insPos">Insertion Position (0-based)</label>
            <input id="insPos" className={inputClass} value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. 2" />
            <div className="text-[10px] text-slate-400 mt-1">Valid range: 0 to {parseArrayInput(arrayInput)?.length ?? 0}</div>
          </div>
          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>
          )}
          <button onClick={sim.start} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors">
            <Plus className="w-4 h-4" />
            Start Insertion
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

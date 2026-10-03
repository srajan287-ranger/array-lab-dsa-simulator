import { useState, useCallback } from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { SimulationLayout } from '@/components/SimulationLayout';
import { useSimulation } from '@/hooks/useSimulation';
import { generateDeletionSteps } from '@/operations/deletion';
import { parseArrayInput } from '@/utils/validation';
import type { SimStep } from '@/types';

const EXAMPLE_ARRAY = '10, 20, 30, 40, 50';

export function DeletionTab() {
  const [arrayInput, setArrayInput] = useState(EXAMPLE_ARRAY);
  const [deleteMode, setDeleteMode] = useState<'index' | 'value'>('index');
  const [indexInput, setIndexInput] = useState('2');
  const [valueInput, setValueInput] = useState('30');
  const [error, setError] = useState('');

  const generateSteps = useCallback((): SimStep[] => {
    setError('');
    const arr = parseArrayInput(arrayInput);
    if (!arr || arr.length === 0) {
      setError('Please enter a valid array of integers.');
      return [];
    }

    let pos: number;
    if (deleteMode === 'index') {
      pos = Number(indexInput);
      if (Number.isNaN(pos) || pos < 0 || pos >= arr.length) {
        setError(`Index must be between 0 and ${arr.length - 1}.`);
        return [];
      }
    } else {
      const val = Number(valueInput);
      if (Number.isNaN(val)) {
        setError('Value must be a valid integer.');
        return [];
      }
      pos = arr.indexOf(val);
      if (pos === -1) {
        setError(`Value ${val} not found in the array.`);
        return [];
      }
    }

    return generateDeletionSteps({ array: arr, position: pos });
  }, [arrayInput, deleteMode, indexInput, valueInput]);

  const sim = useSimulation(generateSteps);

  const loadExample = () => {
    setArrayInput(EXAMPLE_ARRAY);
    setIndexInput('2');
    setValueInput('30');
    setDeleteMode('index');
    sim.reset();
    setError('');
  };

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <SimulationLayout
      title="Array Deletion"
      description="Remove an element by index or value. Watch remaining elements shift left to fill the gap — O(n) time in the worst case."
      sim={sim}
      controlPanel={
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Trash2 className="w-4 h-4 text-rose-500" />
            Deletion Parameters
          </div>
          <div>
            <label className={labelClass} htmlFor="delArray">Array Elements</label>
            <input id="delArray" className={inputClass} value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} placeholder="e.g. 10, 20, 30" />
          </div>
          <div>
            <label className={labelClass}>Delete By</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteMode('index')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${deleteMode === 'index' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Index
              </button>
              <button
                onClick={() => setDeleteMode('value')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${deleteMode === 'value' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Value
              </button>
            </div>
          </div>
          {deleteMode === 'index' ? (
            <div>
              <label className={labelClass} htmlFor="delIdx">Index to Delete (0-based)</label>
              <input id="delIdx" className={inputClass} value={indexInput} onChange={(e) => setIndexInput(e.target.value)} placeholder="e.g. 2" />
              <div className="text-[10px] text-slate-400 mt-1">Valid range: 0 to {(parseArrayInput(arrayInput)?.length ?? 1) - 1}</div>
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="delVal">Value to Delete</label>
              <input id="delVal" className={inputClass} value={valueInput} onChange={(e) => setValueInput(e.target.value)} placeholder="e.g. 30" />
              <div className="text-[10px] text-slate-400 mt-1">Deletes the first occurrence</div>
            </div>
          )}
          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>
          )}
          <button onClick={sim.start} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-500 transition-colors">
            <Trash2 className="w-4 h-4" />
            Start Deletion
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

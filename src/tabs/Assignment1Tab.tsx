import { useState, useCallback, useMemo } from 'react';
import { GraduationCap, Sparkles, Code2, Lightbulb, ListChecks, BarChart3 } from 'lucide-react';
import { SimulationLayout } from '@/components/SimulationLayout';
import { useSimulation } from '@/hooks/useSimulation';
import { generateSortSteps, type SortAlgorithm } from '@/operations/sorting';
import { sortInfo, sortList } from '@/data/sortInfo';
import { parseArrayInput } from '@/utils/validation';
import type { SimStep } from '@/types';

const EXAMPLE_ARRAY = '29, 10, 14, 37, 21, 5';

export function Assignment1Tab() {
  const [algo, setAlgo] = useState<SortAlgorithm>('selection');
  const [arrayInput, setArrayInput] = useState(EXAMPLE_ARRAY);
  const [error, setError] = useState('');

  const info = sortInfo[algo];

  const generateSteps = useCallback((): SimStep[] => {
    setError('');
    const arr = parseArrayInput(arrayInput);
    if (!arr || arr.length === 0) {
      setError('Please enter a valid array of non-negative integers (e.g. 29, 10, 14).');
      return [];
    }
    if (arr.some((v) => v < 0) && algo === 'radix') {
      setError('Radix sort needs non-negative integers only. Please remove negative values.');
      return [];
    }
    if (arr.length > 12) {
      setError('Please use at most 12 elements so the simulation stays readable.');
      return [];
    }
    return generateSortSteps(algo, arr);
  }, [algo, arrayInput]);

  const sim = useSimulation(generateSteps);

  const loadExample = () => {
    setArrayInput(EXAMPLE_ARRAY);
    sim.reset();
    setError('');
  };

  const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const labelClass = 'block text-xs font-medium text-slate-600 mb-1';

  const algorithmPanel = useMemo(
    () => (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-900">
          <Code2 className="w-4 h-4 text-slate-300" />
          <span className="text-sm font-medium text-slate-200">Algorithm — {info.name}</span>
        </div>
        <pre className="p-4 text-xs font-mono leading-relaxed text-slate-800 bg-slate-50 overflow-x-auto whitespace-pre">{info.pseudocode}</pre>
      </div>
    ),
    [info]
  );

  const ideaPanel = useMemo(
    () => (
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          How {info.name} Works
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{info.idea}</p>
        <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
          <pre className="text-xs text-slate-300 font-mono whitespace-pre">{info.example}</pre>
        </div>
      </div>
    ),
    [info]
  );

  const complexityPanel = useMemo(
    () => (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-slate-700">{info.name} — Complexity</span>
        </div>
        <table className="w-full text-xs">
          <tbody>
            {[
              ['Best case', info.best],
              ['Average case', info.average],
              ['Worst case', info.worst],
              ['Space complexity', info.space],
              ['Stable', info.stable],
            ].map(([label, value], idx) => (
              <tr key={label} className={idx % 2 === 0 ? 'bg-slate-50' : ''}>
                <td className="px-4 py-2 text-slate-500">{label}</td>
                <td className="px-4 py-2 font-mono font-semibold text-slate-800">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    [info]
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-800">Sorting Algorithms</h2>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          Seven sorting algorithms, each with an interactive step-by-step simulation, its algorithm in
          pseudocode, a worked example, and a complexity summary. Pick an algorithm below, enter an
          array, and run the simulation.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
          <ListChecks className="w-4 h-4" />
          Choose an algorithm
        </div>
        <div className="flex flex-wrap gap-2">
          {sortList.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setAlgo(s.id);
                sim.reset();
                setError('');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                algo === s.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <SimulationLayout
        title={`${info.name} — Simulation`}
        description="Watch the algorithm work element by element, then read the pseudocode and complexity table below."
        sim={sim}
        controlPanel={
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Input Array
            </div>
            <div>
              <label className={labelClass} htmlFor="sortArray">Array Elements (comma or space separated)</label>
              <input
                id="sortArray"
                className={inputClass}
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="e.g. 29, 10, 14, 37"
              />
              <div className="text-[10px] text-slate-400 mt-1">
                Non-negative integers, up to 12 elements (needed for radix sort and readable steps).
              </div>
            </div>
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>
            )}
            <button onClick={sim.start} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">
              <BarChart3 className="w-4 h-4" />
              Start {info.name}
            </button>
            <button onClick={loadExample} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              <Sparkles className="w-4 h-4" />
              Load Example
            </button>
          </div>
        }
      />

      <div className="grid md:grid-cols-2 gap-4">
        {ideaPanel}
        {complexityPanel}
      </div>

      <div>{algorithmPanel}</div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">All Algorithms — Comparison</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                {['Algorithm', 'Best', 'Average', 'Worst', 'Space', 'Stable'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortList.map((s, idx) => (
                <tr key={s.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} ${s.id === algo ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-2 font-medium text-slate-800 whitespace-nowrap">{s.name}</td>
                  <td className="px-4 py-2 font-mono text-slate-600">{s.best}</td>
                  <td className="px-4 py-2 font-mono text-slate-600">{s.average}</td>
                  <td className="px-4 py-2 font-mono text-slate-600">{s.worst}</td>
                  <td className="px-4 py-2 font-mono text-slate-600">{s.space}</td>
                  <td className="px-4 py-2 text-slate-600">{s.stable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

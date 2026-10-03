import { useState, useCallback } from 'react';
import { Calculator, Sparkles } from 'lucide-react';
import { SimulationLayout } from '@/components/SimulationLayout';
import { useSimulation } from '@/hooks/useSimulation';
import { generateAddressSteps } from '@/operations/addressCalculation';
import type { SimStep } from '@/types';

const DEFAULT_ARRAY = [10, 20, 30, 40, 50];
const EXAMPLE = { baseAddress: 1000, elementSize: 4, index: 3, lowerBound: 0, arrayLength: 5 };

export function AddressCalculationTab() {
  const [baseAddress, setBaseAddress] = useState('1000');
  const [elementSize, setElementSize] = useState('4');
  const [index, setIndex] = useState('3');
  const [lowerBound, setLowerBound] = useState('0');
  const [arrayLength, setArrayLength] = useState('5');
  const [error, setError] = useState('');

  const generateSteps = useCallback((): SimStep[] => {
    setError('');
    const ba = Number(baseAddress);
    const es = Number(elementSize);
    const idx = Number(index);
    const lb = Number(lowerBound);
    const al = Number(arrayLength);

    if (Number.isNaN(ba) || Number.isNaN(es) || Number.isNaN(idx) || Number.isNaN(lb) || Number.isNaN(al)) {
      setError('All inputs must be valid numbers.');
      return [];
    }
    if (es <= 0) {
      setError('Element size must be a positive number.');
      return [];
    }
    if (al <= 0) {
      setError('Array length must be a positive integer.');
      return [];
    }
    const upperBound = lb + al - 1;
    if (idx < lb || idx > upperBound) {
      setError(`Index ${idx} is out of bounds. Valid range: ${lb} to ${upperBound}.`);
      return [];
    }

    return generateAddressSteps({ baseAddress: ba, elementSize: es, index: idx, lowerBound: lb, arrayLength: al });
  }, [baseAddress, elementSize, index, lowerBound, arrayLength]);

  const sim = useSimulation(generateSteps);
  const currentStep = sim.steps.length > 0 ? sim.steps[sim.currentStep] : null;

  const loadExample = () => {
    setBaseAddress(String(EXAMPLE.baseAddress));
    setElementSize(String(EXAMPLE.elementSize));
    setIndex(String(EXAMPLE.index));
    setLowerBound(String(EXAMPLE.lowerBound));
    setArrayLength(String(EXAMPLE.arrayLength));
    sim.reset();
    setError('');
  };

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <SimulationLayout
      title="Address Calculation"
      description="Compute the memory address of any array element using the formula: Address(A[i]) = Base + (i − Lower Bound) × Element Size"
      sim={sim}
      lowerBound={Number(lowerBound) || 0}
      controlPanel={
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calculator className="w-4 h-4 text-blue-500" />
            Input Parameters
          </div>

          <div>
            <label className={labelClass} htmlFor="baseAddr">Base Address</label>
            <input id="baseAddr" className={inputClass} value={baseAddress} onChange={(e) => setBaseAddress(e.target.value)} placeholder="e.g. 1000" />
          </div>
          <div>
            <label className={labelClass} htmlFor="elemSize">Element Size (bytes)</label>
            <input id="elemSize" className={inputClass} value={elementSize} onChange={(e) => setElementSize(e.target.value)} placeholder="e.g. 4" />
          </div>
          <div>
            <label className={labelClass} htmlFor="arrLength">Array Length</label>
            <input id="arrLength" className={inputClass} value={arrayLength} onChange={(e) => setArrayLength(e.target.value)} placeholder="e.g. 5" />
          </div>
          <div>
            <label className={labelClass} htmlFor="lowerBound">Lower Bound</label>
            <input id="lowerBound" className={inputClass} value={lowerBound} onChange={(e) => setLowerBound(e.target.value)} placeholder="e.g. 0" />
          </div>
          <div>
            <label className={labelClass} htmlFor="idx">Index to Access (i)</label>
            <input id="idx" className={inputClass} value={index} onChange={(e) => setIndex(e.target.value)} placeholder="e.g. 3" />
          </div>

          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            onClick={sim.start}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Calculate Address
          </button>
          <button
            onClick={loadExample}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Load Example
          </button>
        </div>
      }
      extraVisual={
        currentStep?.formula && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="text-xs font-medium text-blue-400 mb-1 uppercase tracking-wide">Formula</div>
            <div className="font-mono text-base text-slate-800 font-semibold">{currentStep.formula}</div>
          </div>
        )
      }
    />
  );
}

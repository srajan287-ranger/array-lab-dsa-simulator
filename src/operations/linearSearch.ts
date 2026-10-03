import type { SimStep, ArrayCell, LogEntry, ResultInfo } from '@/types';

export interface LinearSearchInput {
  array: number[];
  target: number;
}

export function generateLinearSearchSteps(input: LinearSearchInput): SimStep[] {
  const steps: SimStep[] = [];
  const { array, target } = input;
  let comparisons = 0;

  const baseResult: ResultInfo = {
    status: 'idle',
    comparisons: 0,
    timeComplexity: 'O(n)',
  };

  // Step 1: Initial state
  {
    const cells: ArrayCell[] = array.map((v) => ({ value: v, state: 'default' }));
    const logs: LogEntry[] = [
      { type: 'info', message: `Searching for value ${target} in array [${array.join(', ')}]` },
      { type: 'step', message: `Start from index 0. Compare each element left to right.` },
    ];
    steps.push({ array: cells, logs, result: { ...baseResult }, stepDescription: 'Starting linear search from index 0.' });
  }

  let found = false;
  let foundIndex = -1;

  for (let i = 0; i < array.length; i++) {
    comparisons++;

    // Comparing step
    {
      const cells: ArrayCell[] = array.map((v, idx) => {
        if (idx === i) return { value: v, state: 'comparing' };
        if (idx < i) return { value: v, state: 'discarded' };
        return { value: v, state: 'default' };
      });
      const logs: LogEntry[] = [
        ...steps[steps.length - 1].logs,
        { type: 'step', message: `Comparison #${comparisons}: Is A[${i}] (${array[i]}) == ${target}? ${array[i] === target ? 'Yes!' : 'No.'}` },
      ];
      steps.push({ array: cells, logs, result: { ...baseResult, comparisons }, stepDescription: `Comparing A[${i}] = ${array[i]} with target ${target}` });
    }

    if (array[i] === target) {
      found = true;
      foundIndex = i;
      // Found step
      {
        const cells: ArrayCell[] = array.map((v, idx) => {
          if (idx === i) return { value: v, state: 'found' };
          if (idx < i) return { value: v, state: 'discarded' };
          return { value: v, state: 'default' };
        });
        const logs: LogEntry[] = [
          ...steps[steps.length - 1].logs,
          { type: 'success', message: `Found ${target} at index ${i} after ${comparisons} comparison${comparisons !== 1 ? 's' : ''}.` },
        ];
        steps.push({
          array: cells,
          logs,
          result: { ...baseResult, status: 'success', comparisons, message: `Found ${target} at index ${i}`, finalArray: [...array] },
          stepDescription: `Found ${target} at index ${i}!`,
        });
      }
      break;
    }

    // Not found at this index — move on
    {
      const cells: ArrayCell[] = array.map((v, idx) => {
        if (idx === i) return { value: v, state: 'discarded' };
        if (idx < i) return { value: v, state: 'discarded' };
        return { value: v, state: 'default' };
      });
      const logs: LogEntry[] = [
        ...steps[steps.length - 1].logs,
        { type: 'step', message: `A[${i}] (${array[i]}) ≠ ${target}. Move to index ${i + 1}.` },
      ];
      steps.push({ array: cells, logs, result: { ...baseResult, comparisons }, stepDescription: `Not a match. Moving to next index.` });
    }
  }

  if (!found) {
    const cells: ArrayCell[] = array.map((v) => ({ value: v, state: 'discarded' }));
    const logs: LogEntry[] = [
      ...steps[steps.length - 1].logs,
      { type: 'error', message: `Value ${target} not found after ${comparisons} comparison${comparisons !== 1 ? 's' : ''}.` },
    ];
    steps.push({
      array: cells,
      logs,
      result: { ...baseResult, status: 'error', comparisons, message: `${target} not found in the array`, finalArray: [...array] },
      stepDescription: `${target} was not found in the array.`,
    });
  }

  return steps;
}

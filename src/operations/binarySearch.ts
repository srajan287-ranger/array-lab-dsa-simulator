import type { SimStep, ArrayCell, LogEntry, ResultInfo } from '@/types';

export interface BinarySearchInput {
  array: number[]; // assumed sorted
  target: number;
  wasSorted: boolean;
}

export function generateBinarySearchSteps(input: BinarySearchInput): SimStep[] {
  const steps: SimStep[] = [];
  const { array, target, wasSorted } = input;
  let comparisons = 0;

  const baseResult: ResultInfo = {
    status: 'idle',
    comparisons: 0,
    timeComplexity: 'O(log n)',
  };

  // If we sorted the array, show that first
  const initialLogs: LogEntry[] = [];
  if (!wasSorted) {
    initialLogs.push({ type: 'warning', message: `Input array was unsorted. It has been sorted for binary search: [${array.join(', ')}]` });
  }
  initialLogs.push({ type: 'info', message: `Binary search for ${target} in sorted array [${array.join(', ')}]` });
  initialLogs.push({ type: 'step', message: `Initialize: low = 0, high = ${array.length - 1}` });

  // Step 1: Initial
  {
    const cells: ArrayCell[] = array.map((v) => ({ value: v, state: 'default' }));
    steps.push({ array: cells, logs: [...initialLogs], result: { ...baseResult }, stepDescription: 'Starting binary search.' });
  }

  let low = 0;
  let high = array.length - 1;
  let found = false;
  let foundIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;

    // Show low, mid, high
    {
      const cells: ArrayCell[] = array.map((v, i) => {
        if (i === mid) return { value: v, state: 'mid' };
        if (i === low) return { value: v, state: 'low' };
        if (i === high) return { value: v, state: 'high' };
        if (i < low || i > high) return { value: v, state: 'discarded' };
        return { value: v, state: 'default' };
      });
      const logs: LogEntry[] = [
        ...steps[steps.length - 1].logs,
        { type: 'step', message: `low = ${low}, high = ${high}, mid = ⌊(${low} + ${high}) / 2⌋ = ${mid}` },
        { type: 'step', message: `Comparison #${comparisons}: Is A[${mid}] (${array[mid]}) == ${target}?` },
      ];
      steps.push({ array: cells, logs, result: { ...baseResult, comparisons }, stepDescription: `low=${low}, high=${high}, mid=${mid}. Comparing A[${mid}]=${array[mid]} with ${target}.` });
    }

    if (array[mid] === target) {
      found = true;
      foundIndex = mid;
      {
        const cells: ArrayCell[] = array.map((v, i) => {
          if (i === mid) return { value: v, state: 'found' };
          if (i < low || i > high) return { value: v, state: 'discarded' };
          return { value: v, state: 'default' };
        });
        const logs: LogEntry[] = [
          ...steps[steps.length - 1].logs,
          { type: 'success', message: `A[${mid}] (${array[mid]}) == ${target}. Found at index ${mid} after ${comparisons} comparison${comparisons !== 1 ? 's' : ''}.` },
        ];
        steps.push({
          array: cells,
          logs,
          result: { ...baseResult, status: 'success', comparisons, message: `Found ${target} at index ${mid}`, finalArray: [...array] },
          stepDescription: `Found ${target} at index ${mid}!`,
        });
      }
      break;
    } else if (array[mid] < target) {
      // Discard left half
      {
        const cells: ArrayCell[] = array.map((v, i) => {
          if (i === mid) return { value: v, state: 'discarded' };
          if (i <= mid) return { value: v, state: 'discarded' };
          if (i === low) return { value: v, state: 'low' };
          return { value: v, state: 'default' };
        });
        const logs: LogEntry[] = [
          ...steps[steps.length - 1].logs,
          { type: 'step', message: `A[${mid}] (${array[mid]}) < ${target}. Target must be in the right half.` },
          { type: 'step', message: `Discard left half (indices ${low} to ${mid}). Set low = ${mid + 1}.` },
        ];
        steps.push({ array: cells, logs, result: { ...baseResult, comparisons }, stepDescription: `A[${mid}] < ${target}. Discarding left half. low = ${mid + 1}.` });
      }
      low = mid + 1;
    } else {
      // Discard right half
      {
        const cells: ArrayCell[] = array.map((v, i) => {
          if (i === mid) return { value: v, state: 'discarded' };
          if (i >= mid) return { value: v, state: 'discarded' };
          if (i === high) return { value: v, state: 'high' };
          return { value: v, state: 'default' };
        });
        const logs: LogEntry[] = [
          ...steps[steps.length - 1].logs,
          { type: 'step', message: `A[${mid}] (${array[mid]}) > ${target}. Target must be in the left half.` },
          { type: 'step', message: `Discard right half (indices ${mid} to ${high}). Set high = ${mid - 1}.` },
        ];
        steps.push({ array: cells, logs, result: { ...baseResult, comparisons }, stepDescription: `A[${mid}] > ${target}. Discarding right half. high = ${mid - 1}.` });
      }
      high = mid - 1;
    }
  }

  if (!found) {
    const cells: ArrayCell[] = array.map((v) => ({ value: v, state: 'discarded' }));
    const logs: LogEntry[] = [
      ...steps[steps.length - 1].logs,
      { type: 'step', message: `low (${low}) > high (${high}). Search range is empty.` },
      { type: 'error', message: `Value ${target} not found after ${comparisons} comparison${comparisons !== 1 ? 's' : ''}.` },
    ];
    steps.push({
      array: cells,
      logs,
      result: { ...baseResult, status: 'error', comparisons, message: `${target} not found in the array`, finalArray: [...array] },
      stepDescription: `Search range empty. ${target} not found.`,
    });
  }

  return steps;
}

export function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

import type { SimStep, ArrayCell, LogEntry, ResultInfo } from '@/types';

export interface DeletionInput {
  array: number[];
  position: number; // 0-based
}

export function generateDeletionSteps(input: DeletionInput): SimStep[] {
  const steps: SimStep[] = [];
  const { array, position } = input;
  const deletedValue = array[position];

  const baseResult: ResultInfo = {
    status: 'idle',
    comparisons: 0,
    timeComplexity: 'O(n)',
  };

  // Step 1: Initial array
  {
    const cells: ArrayCell[] = array.map((v) => ({ value: v, state: 'default' }));
    const logs: LogEntry[] = [
      { type: 'info', message: `Initial array: [${array.join(', ')}]` },
      { type: 'step', message: `Delete element at position ${position} (value ${deletedValue}).` },
    ];
    steps.push({ array: cells, logs, result: { ...baseResult }, stepDescription: 'Starting deletion operation.' });
  }

  // Step 2: Highlight the element to be deleted
  {
    const cells: ArrayCell[] = array.map((v, i) => ({
      value: v,
      state: i === position ? 'deleted' : 'default',
    }));
    const logs: LogEntry[] = [
      ...steps[steps.length - 1].logs,
      { type: 'step', message: `Element at index ${position} (value ${deletedValue}) is marked for deletion.` },
    ];
    steps.push({ array: cells, logs, result: { ...baseResult }, stepDescription: `Element at index ${position} marked for deletion.` });
  }

  // Step 3: Remove the element (show gap)
  const workArray = [...array];
  const removed = workArray.splice(position, 1)[0];

  // Step 3a: Show removed
  {
    const cells: ArrayCell[] = array.map((v, i) => ({
      value: v,
      state: i === position ? 'deleted' : i > position ? 'current' : 'default',
    }));
    const logs: LogEntry[] = [
      ...steps[steps.length - 1].logs,
      { type: 'step', message: `Remove value ${removed} from index ${position}.` },
      { type: 'step', message: `Now shift remaining elements left to fill the gap.` },
    ];
    steps.push({ array: cells, logs, result: { ...baseResult }, stepDescription: `Element ${removed} removed. Shifting remaining elements left.` });
  }

  // Shift elements left (animate)
  for (let i = position; i < workArray.length; i++) {
    const displayArray = [...workArray];
    // At this point, displayArray already has elements shifted
    const cells: ArrayCell[] = displayArray.map((v, idx) => {
      if (idx === i) return { value: v, state: 'current' };
      if (idx < i) return { value: v, state: 'shifted' };
      return { value: v, state: 'default' };
    });
    // Show the source position in the original array context
    const logs: LogEntry[] = [
      ...steps[steps.length - 1].logs,
      { type: 'step', message: `Shift element from index ${i + 1} to index ${i} (value ${workArray[i]}).` },
    ];
    steps.push({ array: cells, logs, result: { ...baseResult }, stepDescription: `Shifting A[${i + 1}] = ${workArray[i]} → A[${i}]` });
  }

  // Final result
  {
    const cells: ArrayCell[] = workArray.map((v, i) => ({
      value: v,
      state: i >= position ? 'shifted' : 'default',
    }));
    const logs: LogEntry[] = [
      ...steps[steps.length - 1].logs,
      { type: 'success', message: `Deletion complete. Final array: [${workArray.join(', ')}]` },
    ];
    steps.push({
      array: cells,
      logs,
      result: { ...baseResult, status: 'success', message: `Value ${removed} deleted from position ${position}`, finalArray: [...workArray] },
      stepDescription: `Deletion complete. Final array: [${workArray.join(', ')}]`,
    });
  }

  return steps;
}

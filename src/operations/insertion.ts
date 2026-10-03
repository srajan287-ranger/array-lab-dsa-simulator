import type { SimStep, ArrayCell, LogEntry, ResultInfo } from '@/types';

export interface InsertionInput {
  array: number[];
  value: number;
  position: number; // 0-based position in the array
}

export function generateInsertionSteps(input: InsertionInput): SimStep[] {
  const steps: SimStep[] = [];
  const { array, value, position } = input;
  const comparisons = 0;

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
      { type: 'step', message: `Insert value ${value} at position ${position}` },
    ];
    steps.push({ array: cells, logs, result: { ...baseResult }, stepDescription: 'Starting insertion operation.' });
  }

  // Step 2: Highlight the insertion position
  {
    const cells: ArrayCell[] = array.map((v, i) => ({
      value: v,
      state: i === position ? 'selected' : 'default',
    }));
    const logs: LogEntry[] = [
      ...steps[steps.length - 1].logs,
      { type: 'step', message: `Position ${position} is selected for insertion.` },
    ];
    steps.push({ array: cells, logs, result: { ...baseResult }, stepDescription: `Position ${position} selected for insertion.` });
  }

  // Step 3+: Shift elements right from the end
  const workArray = [...array];
  for (let i = workArray.length - 1; i >= position; i--) {
    const cells: ArrayCell[] = workArray.map((v, idx) => {
      if (idx === i) return { value: v, state: 'current' };
      if (idx === position) return { value: v, state: 'selected' };
      if (idx > i) return { value: v, state: 'shifted' };
      return { value: v, state: 'default' };
    });
    const logs: LogEntry[] = [
      ...steps[steps.length - 1].logs,
      { type: 'step', message: `Shift element at index ${i} (value ${workArray[i]}) to index ${i + 1}.` },
    ];
    steps.push({ array: cells, logs, result: { ...baseResult }, stepDescription: `Shifting A[${i}] = ${workArray[i]} → A[${i + 1}]` });
  }

  // Perform the actual insertion
  workArray.splice(position, 0, value);

  // Step: Show inserted element
  {
    const cells: ArrayCell[] = workArray.map((v, i) => ({
      value: v,
      state: i === position ? 'inserted' : i > position ? 'shifted' : 'default',
    }));
    const logs: LogEntry[] = [
      ...steps[steps.length - 1].logs,
      { type: 'step', message: `Insert value ${value} at index ${position}.` },
      { type: 'success', message: `Insertion complete. Final array: [${workArray.join(', ')}]` },
    ];
    steps.push({
      array: cells,
      logs,
      result: { ...baseResult, status: 'success', message: `Value ${value} inserted at position ${position}`, finalArray: [...workArray] },
      stepDescription: `Value ${value} inserted at index ${position}.`,
    });
  }

  return steps;
}

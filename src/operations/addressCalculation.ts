import type { SimStep, ArrayCell, LogEntry, ResultInfo } from '@/types';

export interface AddressInput {
  baseAddress: number;
  elementSize: number;
  index: number;
  lowerBound: number;
  arrayLength: number;
}

export function generateAddressSteps(input: AddressInput): SimStep[] {
  const steps: SimStep[] = [];
  const { baseAddress, elementSize, index, lowerBound, arrayLength } = input;

  const initialArray: ArrayCell[] = Array.from({ length: arrayLength }, (_, i) => ({
    value: lowerBound + i,
    state: 'default' as const,
  }));

  const baseResult: ResultInfo = {
    status: 'idle',
    comparisons: 0,
    timeComplexity: 'O(1)',
  };

  // Step 1: Show formula
  steps.push({
    array: initialArray.map((c) => ({ ...c })),
    logs: [{ type: 'info', message: 'Formula: Address(A[i]) = Base Address + (i − Lower Bound) × Element Size' }],
    result: { ...baseResult },
    stepDescription: 'Showing the address calculation formula.',
    formula: 'Address(A[i]) = Base Address + (i − Lower Bound) × Element Size',
  });

  // Step 2: Substitute values
  const offset = index - lowerBound;
  steps.push({
    array: initialArray.map((c, i) => ({
      ...c,
      state: i === index - lowerBound ? 'selected' : 'default',
    })),
    logs: [
      { type: 'info', message: `Formula: Address(A[i]) = Base Address + (i − Lower Bound) × Element Size` },
      { type: 'step', message: `Substituting values: Address(A[${index}]) = ${baseAddress} + (${index} − ${lowerBound}) × ${elementSize}` },
    ],
    result: { ...baseResult },
    stepDescription: `Substituting: i = ${index}, Lower Bound = ${lowerBound}, Base = ${baseAddress}, Size = ${elementSize}`,
    formula: `Address(A[${index}]) = ${baseAddress} + (${index} − ${lowerBound}) × ${elementSize}`,
  });

  // Step 3: Calculate offset
  steps.push({
    array: initialArray.map((c, i) => ({
      ...c,
      state: i === offset ? 'selected' : 'default',
    })),
    logs: [
      { type: 'info', message: `Formula: Address(A[i]) = Base Address + (i − Lower Bound) × Element Size` },
      { type: 'step', message: `Substituting values: Address(A[${index}]) = ${baseAddress} + (${index} − ${lowerBound}) × ${elementSize}` },
      { type: 'step', message: `Calculate offset: (${index} − ${lowerBound}) = ${offset}` },
    ],
    result: { ...baseResult },
    stepDescription: `Offset = ${index} − ${lowerBound} = ${offset}`,
    formula: `Address(A[${index}]) = ${baseAddress} + ${offset} × ${elementSize}`,
  });

  // Step 4: Multiply
  const multiplied = offset * elementSize;
  steps.push({
    array: initialArray.map((c, i) => ({
      ...c,
      state: i === offset ? 'selected' : 'default',
    })),
    logs: [
      { type: 'info', message: `Formula: Address(A[i]) = Base Address + (i − Lower Bound) × Element Size` },
      { type: 'step', message: `Substituting values: Address(A[${index}]) = ${baseAddress} + (${index} − ${lowerBound}) × ${elementSize}` },
      { type: 'step', message: `Calculate offset: (${index} − ${lowerBound}) = ${offset}` },
      { type: 'step', message: `Multiply offset by element size: ${offset} × ${elementSize} = ${multiplied}` },
    ],
    result: { ...baseResult },
    stepDescription: `${offset} × ${elementSize} = ${multiplied}`,
    formula: `Address(A[${index}]) = ${baseAddress} + ${multiplied}`,
  });

  // Step 5: Final address
  const finalAddress = baseAddress + multiplied;
  steps.push({
    array: initialArray.map((c, i) => ({
      ...c,
      state: i === offset ? 'found' : 'default',
    })),
    logs: [
      { type: 'info', message: `Formula: Address(A[i]) = Base Address + (i − Lower Bound) × Element Size` },
      { type: 'step', message: `Substituting values: Address(A[${index}]) = ${baseAddress} + (${index} − ${lowerBound}) × ${elementSize}` },
      { type: 'step', message: `Calculate offset: (${index} − ${lowerBound}) = ${offset}` },
      { type: 'step', message: `Multiply offset by element size: ${offset} × ${elementSize} = ${multiplied}` },
      { type: 'step', message: `Add to base address: ${baseAddress} + ${multiplied} = ${finalAddress}` },
      { type: 'success', message: `Final address of A[${index}] = ${finalAddress}` },
    ],
    result: { ...baseResult, status: 'success', message: `Address(A[${index}]) = ${finalAddress}` },
    stepDescription: `Final address: ${baseAddress} + ${multiplied} = ${finalAddress}`,
    formula: `Address(A[${index}]) = ${finalAddress}`,
  });

  return steps;
}

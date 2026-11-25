import type { SimStep, ArrayCell, LogEntry, ResultInfo, CellState } from '@/types';

export type SortAlgorithm = 'selection' | 'bubble' | 'insertion' | 'quick' | 'merge' | 'shell' | 'radix';

interface Ctx {
  steps: SimStep[];
  arr: number[];
  comparisons: number;
  complexity: string;
}

function mkCells(arr: number[], states: Record<number, CellState> = {}): ArrayCell[] {
  return arr.map((v, i) => ({ value: v, state: states[i] ?? 'default' }));
}

function push(
  ctx: Ctx,
  states: Record<number, CellState>,
  newLogs: LogEntry[],
  desc: string,
  resultOverride?: Partial<ResultInfo>
) {
  const prevLogs = ctx.steps.length > 0 ? ctx.steps[ctx.steps.length - 1].logs : [];
  ctx.steps.push({
    array: mkCells(ctx.arr, states),
    logs: [...prevLogs, ...newLogs],
    result: {
      status: 'running',
      comparisons: ctx.comparisons,
      timeComplexity: ctx.complexity,
      ...resultOverride,
    },
    stepDescription: desc,
  });
}

function sortedBelow(n: number): Record<number, CellState> {
  const s: Record<number, CellState> = {};
  for (let i = 0; i < n; i++) s[i] = 'shifted';
  return s;
}

function finish(ctx: Ctx, algoName: string) {
  const states: Record<number, CellState> = {};
  ctx.arr.forEach((_, i) => (states[i] = 'found'));
  push(
    ctx,
    states,
    [{ type: 'success', message: `${algoName} complete. Sorted array: [${ctx.arr.join(', ')}]` }],
    `${algoName} complete. Final array: [${ctx.arr.join(', ')}]`,
    {
      status: 'success',
      message: `Array sorted using ${algoName}`,
      finalArray: [...ctx.arr],
    }
  );
}

function initCtx(input: number[], complexity: string): Ctx {
  return { steps: [], arr: [...input], comparisons: 0, complexity };
}

// ---------------- Selection Sort ----------------

export function generateSelectionSortSteps(input: number[]): SimStep[] {
  const ctx = initCtx(input, 'O(n²)');
  const a = ctx.arr;
  const n = a.length;
  push(
    ctx,
    {},
    [
      { type: 'info', message: `Initial array: [${a.join(', ')}]` },
      { type: 'step', message: 'Selection sort: find the minimum of the unsorted part and place it at the front, one position per pass.' },
    ],
    'Starting selection sort.'
  );

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    const s0 = { ...sortedBelow(i), [i]: 'selected' as CellState, [minIdx]: 'current' as CellState };
    push(ctx, s0, [{ type: 'step', message: `Pass ${i + 1}: assume A[${i}] = ${a[i]} is the minimum of the unsorted part.` }], `Pass ${i + 1}: searching for the minimum from index ${i}.`);

    for (let j = i + 1; j < n; j++) {
      ctx.comparisons++;
      push(
        ctx,
        { ...sortedBelow(i), [i]: 'selected', [minIdx]: 'current', [j]: 'comparing' },
        [{ type: 'step', message: `Compare A[${j}] = ${a[j]} with current minimum A[${minIdx}] = ${a[minIdx]}: ${a[j] < a[minIdx] ? 'smaller, new minimum!' : 'not smaller.'}` }],
        `Comparing A[${j}] = ${a[j]} with minimum A[${minIdx}] = ${a[minIdx]}.`
      );
      if (a[j] < a[minIdx]) {
        minIdx = j;
        push(ctx, { ...sortedBelow(i), [i]: 'selected', [minIdx]: 'current' }, [{ type: 'step', message: `New minimum is A[${minIdx}] = ${a[minIdx]}.` }], `New minimum found at index ${minIdx}.`);
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      push(ctx, { ...sortedBelow(i), [i]: 'found', [minIdx]: 'found' }, [{ type: 'step', message: `Swap A[${i}] and A[${minIdx}]: minimum ${a[i]} is now in its final position.` }], `Swapped A[${i}] and A[${minIdx}].`);
    } else {
      push(ctx, { ...sortedBelow(i + 1), [i]: 'found' }, [{ type: 'step', message: `A[${i}] is already the minimum — no swap needed.` }], `A[${i}] already in place.`);
    }
  }

  finish(ctx, 'Selection sort');
  return ctx.steps;
}

// ---------------- Bubble Sort ----------------

export function generateBubbleSortSteps(input: number[]): SimStep[] {
  const ctx = initCtx(input, 'O(n²)');
  const a = ctx.arr;
  const n = a.length;
  push(
    ctx,
    {},
    [
      { type: 'info', message: `Initial array: [${a.join(', ')}]` },
      { type: 'step', message: 'Bubble sort: repeatedly compare adjacent elements and swap if out of order; the largest bubbles to the end each pass.' },
    ],
    'Starting bubble sort.'
  );

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    push(ctx, { ...sortedBelow(n - pass) }, [{ type: 'step', message: `Pass ${pass + 1}: scan the unsorted region (indices 0 to ${n - pass - 1}).` }], `Pass ${pass + 1} starting.`);

    for (let j = 0; j < n - pass - 1; j++) {
      ctx.comparisons++;
      push(
        ctx,
        { ...sortedBelow(n - pass), [j]: 'comparing', [j + 1]: 'comparing' },
        [{ type: 'step', message: `Compare A[${j}] = ${a[j]} and A[${j + 1}] = ${a[j + 1]}: ${a[j] > a[j + 1] ? 'out of order, swap!' : 'in order.'}` }],
        `Comparing A[${j}] and A[${j + 1}].`
      );
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        push(ctx, { ...sortedBelow(n - pass), [j]: 'found', [j + 1]: 'found' }, [{ type: 'step', message: `Swapped → [${a.join(', ')}]` }], `Swapped A[${j}] and A[${j + 1}].`);
      }
    }

    if (!swapped) {
      push(ctx, { ...sortedBelow(n) }, [{ type: 'step', message: 'No swaps in this pass — the array is already sorted. Early exit!' }], 'No swaps in this pass — early exit.');
      break;
    }
  }

  finish(ctx, 'Bubble sort');
  return ctx.steps;
}

// ---------------- Insertion Sort ----------------

export function generateInsertionSortSteps(input: number[]): SimStep[] {
  const ctx = initCtx(input, 'O(n²)');
  const a = ctx.arr;
  const n = a.length;
  push(
    ctx,
    n > 0 ? { [0]: 'shifted' } : {},
    [
      { type: 'info', message: `Initial array: [${a.join(', ')}]` },
      { type: 'step', message: 'Insertion sort: take each element (the key) and insert it into its correct place in the sorted portion to the left.' },
    ],
    'Starting insertion sort.'
  );

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    push(ctx, { ...sortedBelow(i), [i]: 'current' }, [{ type: 'step', message: `Take key = A[${i}] = ${key}. Insert it into the sorted part [0..${i - 1}].` }], `Key = ${key} taken from index ${i}.`);

    while (j >= 0) {
      ctx.comparisons++;
      push(
        ctx,
        { ...sortedBelow(i), [j]: 'comparing', [i]: 'current' },
        [{ type: 'step', message: `Compare A[${j}] = ${a[j]} with key ${key}: ${a[j] > key ? 'larger, shift it right.' : 'smaller or equal — key goes after it.'}` }],
        `Comparing A[${j}] = ${a[j]} with key ${key}.`
      );
      if (a[j] > key) {
        a[j + 1] = a[j];
        push(ctx, { ...sortedBelow(i), [j + 1]: 'shifted', [i]: 'current' }, [{ type: 'step', message: `Shifted A[${j}] into position ${j + 1}.` }], `Shifted ${a[j]} right.`);
        j--;
      } else {
        break;
      }
    }

    a[j + 1] = key;
    push(ctx, { ...sortedBelow(i + 1), [j + 1]: 'inserted' }, [{ type: 'step', message: `Insert key ${key} at index ${j + 1}. Sorted part: [${a.slice(0, i + 1).join(', ')}]` }], `Key ${key} inserted at index ${j + 1}.`);
  }

  finish(ctx, 'Insertion sort');
  return ctx.steps;
}

// ---------------- Quick Sort ----------------

export function generateQuickSortSteps(input: number[]): SimStep[] {
  const ctx = initCtx(input, 'O(n log n)');
  const a = ctx.arr;
  push(
    ctx,
    {},
    [
      { type: 'info', message: `Initial array: [${a.join(', ')}]` },
      { type: 'step', message: 'Quick sort: pick a pivot, partition the array so smaller elements are left of it and larger to the right, then recurse on both sides.' },
    ],
    'Starting quick sort (last element as pivot).'
  );

  const quickSort = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) {
      push(ctx, { ...sortedBelow(lo), [lo]: 'found' }, [{ type: 'step', message: `Single element A[${lo}] = ${a[lo]} — already in place.` }], `A[${lo}] is a single-element range — in place.`);
      return;
    }

    push(
      ctx,
      { [lo]: 'low', [hi]: 'mid' },
      [{ type: 'step', message: `Partition range [${lo}..${hi}]. Pivot = A[${hi}] = ${a[hi]} (last element).` }],
      `Partitioning [${lo}..${hi}] with pivot ${a[hi]}.`
    );

    let i = lo;
    for (let j = lo; j < hi; j++) {
      ctx.comparisons++;
      push(
        ctx,
        { [lo]: 'low', [hi]: 'mid', [i]: 'low', [j]: 'comparing' },
        [{ type: 'step', message: `Compare A[${j}] = ${a[j]} with pivot ${a[hi]}: ${a[j] < a[hi] ? 'smaller — move it to the left partition.' : 'not smaller — leave it.'}` }],
        `Comparing A[${j}] = ${a[j]} with pivot ${a[hi]}.`
      );
      if (a[j] < a[hi]) {
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          push(ctx, { [lo]: 'low', [hi]: 'mid', [i]: 'found', [j]: 'found' }, [{ type: 'step', message: `Swap A[${i}] and A[${j}] → [${a.join(', ')}]` }], `Swapped A[${i}] and A[${j}].`);
        }
        i++;
      }
    }

    if (i !== hi) {
      [a[i], a[hi]] = [a[hi], a[i]];
    }
    push(ctx, { [i]: 'found' }, [{ type: 'step', message: `Place pivot ${a[i]} at index ${i}. Everything left is smaller, everything right is larger.` }], `Pivot ${a[i]} placed at index ${i}.`);

    push(ctx, { [i]: 'found' }, [{ type: 'step', message: `Recurse on left part [${lo}..${i - 1}] and right part [${i + 1}..${hi}].` }], `Recursing on both sides of index ${i}.`);
    quickSort(lo, i - 1);
    quickSort(i + 1, hi);
  };

  quickSort(0, a.length - 1);
  finish(ctx, 'Quick sort');
  return ctx.steps;
}

// ---------------- Merge Sort ----------------

export function generateMergeSortSteps(input: number[]): SimStep[] {
  const ctx = initCtx(input, 'O(n log n)');
  const a = ctx.arr;
  push(
    ctx,
    {},
    [
      { type: 'info', message: `Initial array: [${a.join(', ')}]` },
      { type: 'step', message: 'Merge sort: divide the array in half recursively, sort each half, then merge the two sorted halves.' },
    ],
    'Starting merge sort.'
  );

  const range = (l: number, r: number, state: CellState): Record<number, CellState> => {
    const s: Record<number, CellState> = {};
    for (let i = l; i <= r; i++) s[i] = state;
    return s;
  };

  const merge = (l: number, m: number, r: number) => {
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    push(
      ctx,
      range(l, r, 'selected'),
      [{ type: 'step', message: `Merge sorted halves [${left.join(', ')}] and [${right.join(', ')}] into positions ${l}..${r}.` }],
      `Merging [${l}..${m}] and [${m + 1}..${r}].`
    );

    let i = 0;
    let j = 0;
    let k = l;
    while (i < left.length && j < right.length) {
      ctx.comparisons++;
      const takeLeft = left[i] <= right[j];
      push(
        ctx,
        { ...range(l, r, 'selected'), [k]: 'comparing' },
        [{ type: 'step', message: `Compare left ${left[i]} with right ${right[j]}: ${takeLeft ? `${left[i]} ≤ ${right[j]}, take ${left[i]} from the left half.` : `${right[j]} < ${left[i]}, take ${right[j]} from the right half.`}` }],
        `Comparing ${left[i]} and ${right[j]} at output position ${k}.`
      );
      a[k] = takeLeft ? left[i++] : right[j++];
      k++;
    }
    while (i < left.length) {
      a[k] = left[i++];
      k++;
    }
    while (j < right.length) {
      a[k] = right[j++];
      k++;
    }
    push(
      ctx,
      range(l, r, 'inserted'),
      [{ type: 'step', message: `Merged result for [${l}..${r}]: [${a.slice(l, r + 1).join(', ')}]` }],
      `Range [${l}..${r}] is now sorted: [${a.slice(l, r + 1).join(', ')}]`
    );
  };

  const mergeSort = (l: number, r: number) => {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    push(ctx, range(l, r, 'selected'), [{ type: 'step', message: `Split [${l}..${r}] into [${l}..${m}] and [${m + 1}..${r}].` }], `Splitting [${l}..${r}] at index ${m}.`);
    mergeSort(l, m);
    mergeSort(m + 1, r);
    merge(l, m, r);
  };

  mergeSort(0, a.length - 1);
  finish(ctx, 'Merge sort');
  return ctx.steps;
}

// ---------------- Shell Sort ----------------

export function generateShellSortSteps(input: number[]): SimStep[] {
  const ctx = initCtx(input, 'O(n log² n)');
  const a = ctx.arr;
  const n = a.length;
  push(
    ctx,
    {},
    [
      { type: 'info', message: `Initial array: [${a.join(', ')}]` },
      { type: 'step', message: 'Shell sort: insertion sort on elements spaced a "gap" apart, shrinking the gap to 1. Far-apart elements move into place quickly.' },
    ],
    'Starting shell sort.'
  );

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    push(ctx, {}, [{ type: 'step', message: `Gap = ${gap}: perform a gapped insertion sort — compare elements ${gap} apart.` }], `Starting pass with gap = ${gap}.`);

    for (let i = gap; i < n; i++) {
      const key = a[i];
      let j = i;
      push(ctx, { [i]: 'current' }, [{ type: 'step', message: `Key = A[${i}] = ${key}. Compare it with the element ${gap} positions left: A[${i - gap}].` }], `Key ${key} at index ${i} (gap ${gap}).`);

      while (j >= gap) {
        ctx.comparisons++;
        push(
          ctx,
          { [j - gap]: 'comparing', [i]: 'current' },
          [{ type: 'step', message: `Compare A[${j - gap}] = ${a[j - gap]} with key ${key}: ${a[j - gap] > key ? 'larger — shift it right by one gap.' : 'smaller or equal — stop.'}` }],
          `Comparing A[${j - gap}] = ${a[j - gap]} with key ${key}.`
        );
        if (a[j - gap] > key) {
          a[j] = a[j - gap];
          push(ctx, { [j]: 'shifted', [i]: 'current' }, [{ type: 'step', message: `Shifted A[${j - gap}] to index ${j}.` }], `Shifted ${a[j]} from ${j - gap} to ${j}.`);
          j -= gap;
        } else {
          break;
        }
      }

      if (j !== i) {
        a[j] = key;
        push(ctx, { [j]: 'inserted' }, [{ type: 'step', message: `Place key ${key} at index ${j}.` }], `Key ${key} placed at index ${j}.`);
      }
    }
  }

  finish(ctx, 'Shell sort');
  return ctx.steps;
}

// ---------------- Radix Sort ----------------

export function generateRadixSortSteps(input: number[]): SimStep[] {
  const ctx = initCtx(input, 'O(d·(n+k))');
  const a = ctx.arr;
  const max = Math.max(...a);
  push(
    ctx,
    {},
    [
      { type: 'info', message: `Initial array: [${a.join(', ')}]` },
      { type: 'step', message: 'Radix sort (LSD): sort the numbers digit by digit, from the least significant digit to the most significant, using a stable sort per digit.' },
    ],
    'Starting radix sort.'
  );

  if (max === 0) {
    push(ctx, {}, [{ type: 'step', message: 'All elements are 0 — the array is already sorted.' }], 'All elements are zero.');
  }

  let pass = 0;
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    pass++;
    const digitName = pass === 1 ? 'ones' : pass === 2 ? 'tens' : pass === 3 ? 'hundreds' : `10^${pass - 1}`;

    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    for (const v of a) {
      buckets[Math.floor(v / exp) % 10].push(v);
    }
    ctx.comparisons += a.length;

    const bucketLogs: LogEntry[] = [{ type: 'step', message: `Pass ${pass}: group numbers by their ${digitName} digit (digit = ⌊value / ${exp}⌋ mod 10).` }];
    for (let d = 0; d < 10; d++) {
      if (buckets[d].length > 0) {
        bucketLogs.push({ type: 'step', message: `Bucket ${d}: [${buckets[d].join(', ')}]` });
      }
    }
    push(ctx, Object.fromEntries(a.map((_, i) => [i, 'selected' as CellState])), bucketLogs, `Pass ${pass}: grouping by ${digitName} digit.`);

    let idx = 0;
    for (const bucket of buckets) {
      for (const v of bucket) {
        a[idx++] = v;
      }
    }
    push(
      ctx,
      Object.fromEntries(a.map((_, i) => [i, 'inserted' as CellState])),
      [{ type: 'step', message: `Collect buckets 0→9 in order. Array after pass ${pass}: [${a.join(', ')}]` }],
      `After pass ${pass}: [${a.join(', ')}]`
    );
  }

  finish(ctx, 'Radix sort');
  return ctx.steps;
}

export function generateSortSteps(algo: SortAlgorithm, input: number[]): SimStep[] {
  switch (algo) {
    case 'selection': return generateSelectionSortSteps(input);
    case 'bubble': return generateBubbleSortSteps(input);
    case 'insertion': return generateInsertionSortSteps(input);
    case 'quick': return generateQuickSortSteps(input);
    case 'merge': return generateMergeSortSteps(input);
    case 'shell': return generateShellSortSteps(input);
    case 'radix': return generateRadixSortSteps(input);
  }
}

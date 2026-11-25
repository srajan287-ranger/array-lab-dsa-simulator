import type { SortAlgorithm } from '@/operations/sorting';

export interface SortInfo {
  id: SortAlgorithm;
  name: string;
  idea: string;
  pseudocode: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: string;
  example: string;
}

export const sortInfo: Record<SortAlgorithm, SortInfo> = {
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    idea: 'Find the smallest element in the unsorted portion and swap it into the front. The sorted region grows by one element per pass. It always performs the same number of comparisons regardless of input order.',
    pseudocode: `for i = 0 to n-2:
    minIdx = i
    for j = i+1 to n-1:
        if A[j] < A[minIdx]:
            minIdx = j
    swap A[i] and A[minIdx]`,
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: 'No',
    example: 'Array: [29, 10, 14, 37]\nPass 1: min = 10, swap with 29 → [10, 29, 14, 37]\nPass 2: min = 14, swap with 29 → [10, 14, 29, 37]\nPass 3: min = 29, already in place → [10, 14, 29, 37]\nSorted in 3 passes with 6 comparisons.',
  },
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    idea: 'Repeatedly compare adjacent elements and swap them if they are out of order. After each pass the largest remaining element "bubbles" to its final position at the end. If a pass makes no swaps, the array is sorted and the algorithm can exit early.',
    pseudocode: `for i = 0 to n-2:
    swapped = false
    for j = 0 to n-2-i:
        if A[j] > A[j+1]:
            swap A[j] and A[j+1]
            swapped = true
    if not swapped: break   // already sorted`,
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: 'Yes',
    example: 'Array: [5, 1, 4, 2]\nPass 1: [1, 4, 2, 5] — 5 bubbled to the end\nPass 2: [1, 2, 4, 5] — 4 in place\nPass 3: no swaps → early exit\nSorted with 8 comparisons total.',
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    idea: 'Build a sorted region one element at a time: take the next element (the key) and shift larger elements in the sorted region right until the key\'s correct slot is found. Very fast on small or nearly-sorted arrays.',
    pseudocode: `for i = 1 to n-1:
    key = A[i]
    j = i - 1
    while j >= 0 and A[j] > key:
        A[j+1] = A[j]
        j = j - 1
    A[j+1] = key`,
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: 'Yes',
    example: 'Array: [12, 4, 9, 1]\ni=1: key 4 → [4, 12, 9, 1]\ni=2: key 9 → [4, 9, 12, 1]\ni=3: key 1 → [1, 4, 9, 12]\nEach key is inserted into the sorted left part.',
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    idea: 'Divide and conquer: choose a pivot, partition the array so all smaller elements come before the pivot and larger ones after, then recursively sort both sides. In-place with excellent cache behavior — the fastest general-purpose sort in practice.',
    pseudocode: `quickSort(A, lo, hi):
    if lo < hi:
        p = partition(A, lo, hi)
        quickSort(A, lo, p-1)
        quickSort(A, p+1, hi)

partition(A, lo, hi):      // Lomuto, last element as pivot
    pivot = A[hi]
    i = lo
    for j = lo to hi-1:
        if A[j] < pivot:
            swap A[i] and A[j]
            i = i + 1
    swap A[i] and A[hi]
    return i`,
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: 'No',
    example: 'Array: [10, 7, 8, 9, 1, 5], pivot = 5\nPartition: [1] + 5 + [10, 7, 8, 9]\nLeft [1] is done; right [10, 7, 8, 9] recurses with pivot 9 → [7, 8] + 9 + [10] ...\nFinal: [1, 5, 7, 8, 9, 10]',
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    idea: 'Divide and conquer: split the array in half, sort each half recursively, then merge the two sorted halves by repeatedly taking the smaller front element. Guaranteed O(n log n) on every input, at the cost of O(n) extra memory.',
    pseudocode: `mergeSort(A, l, r):
    if l < r:
        m = (l + r) / 2
        mergeSort(A, l, m)
        mergeSort(A, m+1, r)
        merge(A, l, m, r)

merge(A, l, m, r):
    L = A[l..m], R = A[m+1..r]
    i = j = 0, k = l
    while i < |L| and j < |R|:
        if L[i] <= R[j]: A[k++] = L[i++]
        else:            A[k++] = R[j++]
    copy remaining elements of L, then R`,
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: 'Yes',
    example: 'Array: [38, 27, 43, 10]\nSplit: [38, 27] and [43, 10]\nSort halves: [27, 38] and [10, 43]\nMerge: compare 27 vs 10 → take 10; 27 vs 43 → take 27; take 38, 43\nFinal: [10, 27, 38, 43]',
  },
  shell: {
    id: 'shell',
    name: 'Shell Sort',
    idea: 'A generalization of insertion sort: first sort elements that are a large "gap" apart, then progressively shrink the gap down to 1. Early passes move far-away elements close to their final position, so the final insertion-sort pass is very cheap.',
    pseudocode: `gap = n / 2
while gap > 0:
    for i = gap to n-1:
        key = A[i]
        j = i
        while j >= gap and A[j-gap] > key:
            A[j] = A[j-gap]
            j = j - gap
        A[j] = key
    gap = gap / 2`,
    best: 'O(n log n)',
    average: 'O(n log² n)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: 'No',
    example: 'Array: [35, 33, 42, 10, 14, 19, 27, 44]\ngap 4: sort 35/14, 33/19, 42/27, 10/44 → [14, 19, 27, 10, 35, 33, 42, 44]\ngap 2: sort pairs 2 apart → [14, 10, 27, 19, 35, 33, 42, 44]\ngap 1: plain insertion sort finishes quickly → [10, 14, 19, 27, 33, 35, 42, 44]',
  },
  radix: {
    id: 'radix',
    name: 'Radix Sort',
    idea: 'A non-comparison sort: process numbers digit by digit from the least significant digit to the most significant, using a stable bucket sort on each digit. After the last digit pass, the array is fully sorted. Runs in linear time for fixed-width integers.',
    pseudocode: `radixSort(A):
    max = largest element in A
    exp = 1
    while max / exp > 0:
        countSortByDigit(A, exp)   // stable, digit = (A[i]/exp) mod 10
        exp = exp * 10

countSortByDigit(A, exp):
    buckets[0..9] = empty lists
    for each x in A: buckets[(x / exp) mod 10].append(x)
    copy buckets 0..9 back into A in order`,
    best: 'O(d·(n+k))',
    average: 'O(d·(n+k))',
    worst: 'O(d·(n+k))',
    space: 'O(n + k)',
    stable: 'Yes',
    example: 'Array: [170, 45, 75, 90, 2, 802]\nOnes digit: [170, 90, 802, 2, 45, 75]\nTens digit: [802, 2, 45, 170, 75, 90]\nHundreds digit: [2, 45, 75, 90, 170, 802]\nThree stable passes produce the sorted array.',
  },
};

export const sortList: SortInfo[] = [
  sortInfo.selection,
  sortInfo.bubble,
  sortInfo.insertion,
  sortInfo.quick,
  sortInfo.merge,
  sortInfo.shell,
  sortInfo.radix,
];

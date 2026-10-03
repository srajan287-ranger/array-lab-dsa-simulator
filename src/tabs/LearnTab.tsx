import { BookOpen, Calculator, Plus, Trash2, Search, ArrowRightLeft, Clock, Database, Hash } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'What is an Array?',
    color: 'text-blue-600 bg-blue-50',
    content: 'An array is a collection of elements stored at contiguous memory locations. Each element is accessed by its index — a zero-based position (by default) or a custom lower bound. Arrays provide O(1) access to any element if you know its index, making them one of the most fundamental data structures.',
    example: 'Array: [10, 20, 30, 40, 50]\nIndex:    0    1    2    3    4\nA[0] = 10, A[2] = 30, A[4] = 50',
  },
  {
    icon: Hash,
    title: 'Zero-Based vs Custom Lower-Bound Indexing',
    color: 'text-cyan-600 bg-cyan-50',
    content: 'In most programming languages (C, Java, Python), arrays start at index 0 — this is zero-based indexing. Some languages (like Fortran) allow custom lower bounds. The address formula adapts: Address(A[i]) = Base + (i − LowerBound) × Size. With a lower bound of 0, this simplifies to Base + i × Size.',
    example: 'Lower bound = 0: A[0], A[1], A[2] ...\nLower bound = 5: A[5], A[6], A[7] ...\nAddress(A[7]) with LB=5: Base + (7−5) × Size',
  },
  {
    icon: Calculator,
    title: 'Address Calculation',
    color: 'text-violet-600 bg-violet-50',
    content: 'Given a base address, element size, and index, you can compute the exact memory address of any array element. The formula is: Address(A[i]) = Base Address + (i − Lower Bound) × Element Size. This is an O(1) operation — direct memory access.',
    example: 'Base = 1000, Size = 4 bytes, LB = 0, i = 3\nAddress = 1000 + (3 − 0) × 4 = 1000 + 12 = 1012',
  },
  {
    icon: Plus,
    title: 'Insertion',
    color: 'text-emerald-600 bg-emerald-50',
    content: 'Insertion adds a new element at a specified position. All elements from that position onward must shift right by one slot to make space. In the worst case (inserting at the beginning), all n elements shift — O(n) time.',
    example: 'Array: [10, 20, 30, 40]\nInsert 25 at index 2:\n  Shift 40 → index 4, 30 → index 3\n  Place 25 at index 2\nResult: [10, 20, 25, 30, 40]  — O(n)',
  },
  {
    icon: Trash2,
    title: 'Deletion',
    color: 'text-rose-600 bg-rose-50',
    content: 'Deletion removes an element at a specified position. All elements after that position shift left by one slot to fill the gap. Like insertion, worst-case deletion (removing the first element) requires shifting all n−1 elements — O(n) time.',
    example: 'Array: [10, 20, 30, 40, 50]\nDelete index 2 (value 30):\n  Shift 40 → index 2, 50 → index 3\nResult: [10, 20, 40, 50]  — O(n)',
  },
  {
    icon: Search,
    title: 'Linear Search',
    color: 'text-amber-600 bg-amber-50',
    content: 'Linear search checks each element from left to right until the target is found or the array ends. It works on any array (sorted or not) but takes O(n) time in the worst case — the target might be the last element or not present at all.',
    example: 'Array: [15, 8, 42, 23], Target: 23\n  Check 15 ≠ 23\n  Check 8 ≠ 23\n  Check 42 ≠ 23\n  Check 23 = 23 → Found at index 3\nComparisons: 4  — O(n)',
  },
  {
    icon: ArrowRightLeft,
    title: 'Binary Search',
    color: 'text-indigo-600 bg-indigo-50',
    content: 'Binary search works on sorted arrays only. It compares the target with the middle element; if smaller, it discards the right half; if larger, it discards the left half. This halves the search space each step, giving O(log n) time — dramatically faster than linear search for large arrays.',
    example: 'Array: [5, 10, 15, 20, 25, 30, 35], Target: 25\n  low=0, high=6, mid=3 → A[3]=20 < 25 → go right\n  low=4, high=6, mid=5 → A[5]=30 > 25 → go left\n  low=4, high=4, mid=4 → A[4]=25 = 25 → Found!\nComparisons: 3  — O(log n)',
  },
  {
    icon: Clock,
    title: 'Time Complexity Summary',
    color: 'text-slate-600 bg-slate-100',
    content: 'Understanding time complexity helps you choose the right approach. Here is a quick comparison of each operation covered in this simulator.',
    example: 'Operation          | Best    | Worst\n-------------------|---------|--------\nAddress Calculation| O(1)    | O(1)\nInsertion          | O(1)*   | O(n)\nDeletion           | O(1)*   | O(n)\nLinear Search      | O(1)    | O(n)\nBinary Search      | O(1)    | O(log n)\n\n* Best case = insert/delete at the end',
  },
];

export function LearnTab() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Learning Center</h2>
        <p className="text-sm text-slate-500 mt-1">
          A comprehensive guide to arrays and the operations simulated in ArrayLab.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">{section.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
              <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
                <pre className="text-xs text-slate-300 font-mono whitespace-pre">{section.example}</pre>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-5">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800">How to Use This Simulator</h3>
        </div>
        <ol className="text-sm text-slate-600 space-y-1.5 list-decimal list-inside">
          <li>Select an operation tab from the navigation bar above.</li>
          <li>Enter your array elements and parameters in the control panel on the left.</li>
          <li>Click the action button to generate the simulation steps.</li>
          <li>Use Play, Next, and Previous to step through the algorithm visually.</li>
          <li>Read the execution log and result panel for detailed explanations.</li>
          <li>Use the Load Example button if you need a quick starting point.</li>
        </ol>
      </div>
    </div>
  );
}

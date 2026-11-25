# Project memory

## Product intent & audience

- Interactive educational web app simulating array data structures.
- Features: address calculation, insertion, deletion, linear search, binary search — all with step-by-step visualizations.
- Includes a **Sorting** section with seven sorting algorithms and interactive simulations.
- Admin name: **Srajan Gupta**.
- Target audience: students/learners studying data structures.

## Brand personality & voice

- Educational, clear, and engaging.
- Production-quality presentation; not a basic demo.

## Visual design & UX direction

- Vite + React + Tailwind CSS + Lucide React icons.
- `@/` path alias for imports (`src/`).
- Navigation uses tabs/sections for different data-structure topics.
- Step-by-step algorithm visualizations are a core UX pattern.
- Execution log auto-scrolls to bottom whenever a new entry appears (during playback and stepping forward); snaps back to latest on next step even if user scrolled up to read earlier entries.
- Beautiful, non-cookie-cutter design per global instructions.

## Decisions, constraints & rationale

- **Sorting tab renamed**: removed "Assignment 1" prefix; navigation label is now "Sorting" and page heading reads "Sorting Algorithms". Seven algorithms and simulations unchanged.
- Only UI labels updated; no functional changes to simulations.
- **Execution log auto-scroll**: implemented across all simulation tabs including Sorting; ensures latest log entry is always visible without manual scrolling.

## Open questions & assumptions

- Exact names of the seven sorting algorithms not confirmed (assumed standard set like Bubble, Selection, Insertion, Merge, Quick, Heap, Radix).
- Whether other tabs/sections also carry "Assignment N" prefixes that should be similarly cleaned up is unknown.
- Overall site structure beyond arrays and sorting is unclear.
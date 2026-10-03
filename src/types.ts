export type CellState = 'default' | 'current' | 'comparing' | 'target' | 'selected' | 'inserted' | 'deleted' | 'shifted' | 'found' | 'low' | 'mid' | 'high' | 'discarded';

export interface ArrayCell {
  value: number;
  state: CellState;
}

export type LogType = 'info' | 'success' | 'error' | 'warning' | 'step';

export interface LogEntry {
  type: LogType;
  message: string;
}

export interface ResultInfo {
  status: 'idle' | 'running' | 'success' | 'error';
  message?: string;
  comparisons: number;
  timeComplexity: string;
  finalArray?: number[];
}

export interface SimStep {
  array: ArrayCell[];
  logs: LogEntry[];
  result: ResultInfo;
  highlightIndices?: number[];
  formula?: string;
  stepDescription: string;
}

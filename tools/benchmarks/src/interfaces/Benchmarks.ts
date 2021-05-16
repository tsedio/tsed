export interface BenchmarkDiff {
  transferPerSecDiff: number | undefined;
  requestsPerSecDiff: number | undefined;
}

export type BenchmarksDiff = Record<string, BenchmarkDiff>;

export interface BenchmarkOptions {
  baseDir: string;
  outDir: string;
  libs: {label: string; value: string}[];
  port: number;
  threads: number;
  duration: string;
  connections: number;
  compares: [string, string][];
}

export interface AlterRunInContext {
  $alterRunInContext(next: (...args: unknown[]) => unknown): () => unknown | Promise<() => unknown>;
}

import {DIContext} from "../domain/DIContext";

export interface AlterRunInContext {
  $alterRunInContext(next: (...args: unknown[]) => unknown, ctx: DIContext): () => unknown | Promise<() => unknown>;
}

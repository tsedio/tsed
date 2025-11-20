/**
 * Interface for customizing the execution context of asynchronous operations.
 *
 * Implement this interface to wrap or modify the async context in which operations run,
 * enabling custom context management, async local storage, or execution wrapping.
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, AlterRunInContext} from "@tsed/di";
 * import {AsyncLocalStorage} from "async_hooks";
 *
 * @Injectable()
 * class CustomContextProvider implements AlterRunInContext {
 *   private storage = new AsyncLocalStorage();
 *
 *   $alterRunInContext(next: Function) {
 *     return () => {
 *       return this.storage.run({requestId: generateId()}, next);
 *     };
 *   }
 * }
 * ```
 *
 * @public
 */
export interface AlterRunInContext {
  $alterRunInContext(next: (...args: unknown[]) => unknown): () => unknown | Promise<() => unknown>;
}

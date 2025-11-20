/**
 * Lifecycle hook interface for cleanup logic.
 *
 * Implement this interface to execute custom cleanup code when a provider instance is destroyed by the DI container.
 * The `$onDestroy` method is called automatically during application shutdown or when the provider scope ends.
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, OnDestroy} from "@tsed/di";
 *
 * @Injectable()
 * class MyService implements OnDestroy {
 *   async $onDestroy() {
 *     // Close connections, release resources, etc.
 *     await this.disconnect();
 *   }
 * }
 * ```
 *
 * @public
 */
export interface OnDestroy {
  $onDestroy(): Promise<any> | void;
}

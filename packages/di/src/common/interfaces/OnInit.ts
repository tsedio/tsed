/**
 * Lifecycle hook interface for initialization logic.
 *
 * Implement this interface to execute custom initialization code when a provider instance is created by the DI container.
 * The `$onInit` method is called automatically after the instance is constructed and dependencies are injected.
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, OnInit} from "@tsed/di";
 *
 * @Injectable()
 * class MyService implements OnInit {
 *   async $onInit() {
 *     // Initialize database connection, load configuration, etc.
 *     await this.connect();
 *   }
 * }
 * ```
 *
 * @public
 */
export interface OnInit {
  $onInit(): Promise<any> | void;
}

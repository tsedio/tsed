declare global {
  namespace TsED {
    interface JsonHookContext {}
  }
}

/**
 * Context object passed to JSON schema hooks during serialization and schema generation.
 *
 * This context provides information about the current serialization state, including
 * the target instance, active groups, and extensible custom properties. It enables
 * hooks to make context-aware decisions during schema generation and transformation.
 *
 * The interface is extensible via TypeScript module augmentation, allowing packages
 * to add custom context properties through the `TsED.JsonHookContext` namespace.
 *
 * ### Usage
 *
 * ```typescript
 * import {JsonHookContext} from "@tsed/schema";
 *
 * function myHook(value: any, ctx: JsonHookContext) {
 *   // Access the target instance
 *   console.log(ctx.self);
 *
 *   // Check active groups
 *   if (ctx.groups?.includes('admin')) {
 *     // Apply admin-specific transformations
 *   }
 * }
 * ```
 *
 * @public
 */
export interface JsonHookContext extends TsED.JsonHookContext {
  /**
   * The current instance used by serializer function
   */
  self: any;
  /**
   * Active groups for conditional schema generation.
   *
   * When set to an array, only properties belonging to these groups will be included.
   * When set to `false`, group filtering is disabled.
   */
  groups?: string[] | false;

  [key: string]: any;
}

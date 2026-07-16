import {JsonHookContext} from "./JsonHookContext.js";

/**
 * Callback function to determine whether a property should be ignored during serialization.
 *
 * This callback is invoked during schema generation to conditionally ignore properties
 * based on the current context and the default ignore value.
 *
 * ### Usage
 *
 * ```typescript
 * const ignoreCallback: IgnoreCallback = (value, ctx) => {
 *   // Ignore properties when specific groups are active
 *   if (ctx.groups?.includes('admin')) {
 *     return false; // Don't ignore for admin group
 *   }
 *   return value; // Use default ignore value
 * };
 * ```
 *
 * @param value - The default ignore value for the property
 * @param ctx - The current JSON hook context containing serialization metadata
 * @returns `true` to ignore the property, `false` to include it
 *
 * @public
 */
export interface IgnoreCallback {
  (value: boolean, ctx: JsonHookContext): boolean;
}

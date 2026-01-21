import {classOf} from "@tsed/core";

import {definePrompt, type PromptProps} from "../fn/definePrompt.js";

/**
 * Options accepted by {@link Prompt} when decorating a class method. Matches {@link PromptProps} minus the handler reference.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type PromptDecoratorOptions = Omit<PromptProps, "handler">;

/**
 * Declares a Ts.ED class method as an MCP prompt and registers it through {@link definePrompt}.
 *
 * @param options Optional MCP prompt metadata such as name, description, and args schema.
 * @module platform/mcp
 * @since 8.17.0
 *
 * ### Usage
 * ```ts
 * class ConciergePrompts {
 *   @Prompt()
 *   async hotelWelcome() {
 *     return {content: [{type: "text", text: "Welcome to Ts.ED Hotel!"}]};
 *   }
 * }
 * ```
 */
export function Prompt(options?: PromptDecoratorOptions) {
  return (target: any, propertyKey: string | symbol, _: PropertyDescriptor) => {
    definePrompt({
      ...(options as PromptProps),
      name: options?.name || String(propertyKey),
      token: classOf(target),
      propertyKey: propertyKey
    });
  };
}

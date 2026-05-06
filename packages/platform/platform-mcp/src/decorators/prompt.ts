import {classOf} from "@tsed/core";

import {type ClassPromptProps, definePrompt} from "../fn/definePrompt.js";

/**
 * Options accepted by {@link Prompt} when decorating a class method. Matches {@link PromptProps} minus the handler reference.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type PromptDecoratorOptions<Args extends undefined = any> = Omit<ClassPromptProps<Args>, "token" | "propertyKey">;

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
export function Prompt<Args extends undefined = any>(options?: PromptDecoratorOptions<Args>) {
  return (target: any, propertyKey: string | symbol, _: PropertyDescriptor) => {
    definePrompt<Args>({
      ...options,
      name: options?.name || String(propertyKey),
      token: classOf(target),
      propertyKey: propertyKey
    });
  };
}

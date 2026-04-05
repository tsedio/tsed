import {classOf} from "@tsed/core";

import {type ClassToolProps, defineTool} from "../fn/defineTool.js";

/**
 * Decorator that registers a class method as an MCP tool and binds it to the Ts.ED DI container.
 *
 * @typeParam Input JSON payload schema expected by the tool invocation.
 * @typeParam Output Optional structured response returned by the handler.
 * @param name Optional override for the exported tool name; defaults to the method key.
 * @param options Additional {@link ClassToolProps} such as descriptions and schema overrides.
 * @module platform/mcp
 * @since 8.17.0
 *
 * ### Usage
 * ```ts
 * class MathTools {
 *   @Tool()
 *   async add({a, b}: {a: number; b: number}) {
 *     return {content: [{type: "text", text: String(a + b)}]};
 *   }
 * }
 * ```
 */
export function Tool<Input = any, Output = any>(name?: string, options: Partial<ClassToolProps<Input, Output>> = {}) {
  return (target: any, propertyKey: string | symbol, _: PropertyDescriptor) => {
    defineTool<Input, Output>({
      ...(options as ClassToolProps<Input, Output>),
      name: name || String(propertyKey),
      token: classOf(target),
      propertyKey
    } as any);
  };
}

import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import type {RequestHandlerExtra} from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {CallToolResult, ServerNotification, ServerRequest, Tool} from "@modelcontextprotocol/sdk/types.js";
import {type AbstractType, isArrowFn, type Type} from "@tsed/core";
import {inject, injectable, logger} from "@tsed/di";
import {JsonEntityStore, JsonMethodStore, JsonSchema} from "@tsed/schema";

import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import {toZod} from "../utils/toZod.js";

/**
 * Signature implemented by MCP tool handlers invoked through {@link defineTool}.
 *
 * @typeParam Args JSON payload accepted by the handler.
 * @module platform/mcp
 * @since 8.17.0
 */
export type ToolCallback<Args = undefined> = (
  args: Args,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>
) => CallToolResult | Promise<CallToolResult>;

type ToolConfig = Parameters<McpServer["registerTool"]>[1];
type BaseToolProps<Input, Output = undefined> = Omit<ToolConfig, "inputSchema" | "outputSchema"> & {
  inputSchema?: JsonSchema<Input> | (() => JsonSchema<Input>) | Tool["inputSchema"];
  outputSchema?: JsonSchema<Output> | Tool["outputSchema"];
};

type FnToolProps<Input, Output = undefined> = BaseToolProps<Input, Output> & {
  name: string;
  handler: ToolCallback<Input>;
};

/**
 * Configuration accepted when decorating class methods as MCP tools.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type ClassToolProps<Input, Output = undefined> = BaseToolProps<Input, Output> & {
  name?: string;
  token: Type | AbstractType<any>;
  propertyKey: string | symbol;
};

/**
 * Union of functional and class-based tool definitions.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type ToolProps<Input, Output = undefined> = FnToolProps<Input, Output> | ClassToolProps<Input, Output>;

function getOutputSchema<Output>(methodStore: JsonMethodStore): JsonSchema<Output> {
  const schema: JsonSchema = methodStore.operation.getResponseOf(200)?.getMedia("application/json")?.get("schema");

  return schema?.itemSchema() as JsonSchema<Output>;
}

function getInputSchema<Input>(token: Type<any> | AbstractType<any>, propertyKey: string | symbol): JsonSchema<Input> {
  return JsonEntityStore.from(token, propertyKey, 0).schema?.itemSchema() as JsonSchema<Input>;
}

function mapOptions<Input, Output = undefined>(options: ToolProps<Input, Output>) {
  let handler: ToolCallback<Input>;

  if ("propertyKey" in options) {
    const {token, propertyKey} = options;
    handler = (args: Input, extra: any) => {
      const instance = inject(options.token) as any;
      return instance[options.propertyKey](args, extra);
    };

    const methodStore = JsonEntityStore.fromMethod(token, propertyKey);
    options.description = options.description || methodStore.operation.get("description");
    options.inputSchema = options.inputSchema || getInputSchema(token, propertyKey);
    options.outputSchema = options.outputSchema || getOutputSchema(methodStore);
  } else {
    handler = options.handler;
  }

  return {
    ...options,
    handler
  };
}

/**
 * Registers an MCP tool provider and wraps its handler with error logging plus schema conversion.
 *
 * @typeParam Input JSON payload expected by the tool.
 * @typeParam Output Structured output returned by the handler.
 * @param options Functional or class-based tool configuration.
 * @returns The DI token referencing the registered tool provider.
 * @module platform/mcp
 * @since 8.17.0
 *
 * ### Usage
 * ```ts
 * defineTool({
 *   name: "add",
 *   handler: async ({a, b}) => ({content: [{type: "text", text: String(a + b)}]})
 * });
 * ```
 */
export function defineTool<Input, Output = undefined>(options: ToolProps<Input, Output>) {
  const provider = injectable(Symbol.for(`MCP:TOOL:${options.name}`))
    .type(MCP_PROVIDER_TYPES.TOOL)
    .factory(() => {
      let {handler, ...opts} = mapOptions(options);

      return {
        ...opts,
        name: opts.name,
        inputSchema: toZod(isArrowFn(opts.inputSchema) ? opts.inputSchema() : opts.inputSchema),
        outputSchema: toZod(opts.outputSchema),
        async handler(args: Input, extra: RequestHandlerExtra<ServerRequest, ServerNotification>) {
          try {
            return await handler(args as Input, extra);
          } catch (er: any) {
            logger().error({
              event: "MCP_TOOL_ERROR",
              tool: opts.name,
              error_message: er?.message,
              stack: er?.stack
            });

            return {
              content: [],
              structuredContent: {
                code: "E_MCP_TOOL_ERROR",
                message: er?.message
              }
            } satisfies CallToolResult;
          }
        }
      };
    });

  return provider.token();
}

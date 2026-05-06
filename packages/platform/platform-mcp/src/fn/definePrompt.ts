import type {RequestHandlerExtra} from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {GetPromptResult, ServerNotification, ServerRequest} from "@modelcontextprotocol/sdk/types.js";
import {type AbstractType, isArrowFn, type Type} from "@tsed/core";
import {inject, injectable, type TokenProvider} from "@tsed/di";
import {JsonEntityStore, JsonSchema} from "@tsed/schema";

import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import {toZod} from "../utils/toZod.js";

type BasePromptConfig = {
  title?: string;
  description?: string;
};

type BasePromptProps<Args> = BasePromptConfig & {
  name: string;
  argsSchema?: JsonSchema<Args> | (() => JsonSchema<Args>) | Record<string, unknown>;
};

export type PromptHandler<Args = undefined> = Args extends undefined
  ? (extra: RequestHandlerExtra<ServerRequest, ServerNotification>) => GetPromptResult | Promise<GetPromptResult>
  : (args: Args, extra: RequestHandlerExtra<ServerRequest, ServerNotification>) => GetPromptResult | Promise<GetPromptResult>;

export type FnPromptProps<Args = any> = BasePromptProps<Args> & {
  handler: PromptHandler<Args>;
};

export type ClassPromptProps<Args = any> = Omit<BasePromptProps<Args>, "name"> & {
  name?: string;
  token: Type | AbstractType<any>;
  propertyKey: string | symbol;
};

/**
 * Union of prompt configuration accepted by {@link definePrompt}, supporting both functional and class-based handlers.
 *
 * @typeParam Args JSON payload expected by the prompt handler.
 * @module platform/mcp
 * @since 8.17.0
 */
export type PromptProps<Args = any> = FnPromptProps<Args> | ClassPromptProps<Args>;

function mapOptions<Args = any>(options: PromptProps<Args>) {
  let handler: PromptHandler<Args> = undefined as any;
  const name = options.name || ("propertyKey" in options ? String(options.propertyKey) : undefined);

  if ("handler" in options) {
    handler = options.handler;
  }

  if ("propertyKey" in options && options.propertyKey) {
    const {token, propertyKey} = options;

    handler = ((...args: any[]) => {
      const instance = inject(options.token) as any;
      return instance[propertyKey](...args);
    }) as unknown as PromptHandler<Args>;

    const methodStore = JsonEntityStore.fromMethod(token, propertyKey);
    options.description = options.description || methodStore.operation.get("description");
    options.title = options.title || methodStore.schema.get("title");
  }

  return {
    ...options,
    name,
    argsSchema: toZod(isArrowFn(options.argsSchema) ? options.argsSchema() : options.argsSchema),
    handler: handler
  };
}

/**
 * Normalized settings registered in the DI container for an MCP prompt.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type PromptsSettings = ReturnType<typeof mapOptions>;

/**
 * Registers an MCP prompt provider with the Ts.ED injector and returns the associated token.
 *
 * @typeParam Args JSON payload expected by the prompt.
 * @param options Functional or class-based prompt configuration.
 * @returns The DI token representing the registered prompt provider.
 * @module platform/mcp
 * @since 8.17.0
 *
 * ### Usage
 * ```ts
 * definePrompt({
 *   name: "weather",
 *   description: "Summaries today's forecast",
 *   handler: async () => ({content: [{type: "text", text: "Sunny"}]})
 * });
 * ```
 */
export function definePrompt<Args = any>(options: FnPromptProps<Args>): TokenProvider;
export function definePrompt<Args = any>(options: ClassPromptProps<Args>): TokenProvider;
export function definePrompt<Args = any>(options: PromptProps<Args>) {
  const provider = injectable(Symbol.for(`MCP:PROMPT:${options.name}`))
    .type(MCP_PROVIDER_TYPES.PROMPT)
    .factory(() => {
      return mapOptions<Args>(options);
    });

  return provider.token();
}

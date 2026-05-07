### Platform MCP — JSDoc Coverage Tracker (packages/platform/platform-mcp/src)

Generated: 2026-02-08

Purpose

- Guarantee every exported symbol in `packages/platform/platform-mcp/src` ships with consistent, TSDoc-compliant documentation.
- Provide a single place to track coverage, validation state, and any remaining follow-up work.
- Mirror the "symbols only" rule used elsewhere: document exported symbols (types, functions, classes, constants) rather than their private members.

Rules

- Document in English; keep the first sentence under ~120 chars for IDE summaries.
- Allowed tags: `@module platform/mcp`, `@since`, `@deprecated`, `@public`, `@typeParam`, `@param`, `@returns`, `@see`.
- Prefer markdown headings (### Usage, ### Example) inside the description over the legacy `@example` tag to keep the docs parser happy.
- Do not describe interface properties inline—document the interface itself and rely on the generated reference for member details.
- Keep edits comment-only unless a signature genuinely needs to change.

## Canonical TSDoc Block

````ts
/**
 * One-sentence summary that explains the symbol.
 *
 * Optional longer description with additional context or usage notes.
 *
 * ### Usage
 * ```ts
 * const client = await platformMcp.connect();
 * ```
 *
 * @module platform/mcp
 * @since 8.x
 * @typeParam T Provide type param summaries when generics are exposed
 * @param options Describe each parameter
 * @returns Explain the resolved value
 */
````

## Export Checklist

### constants

- [x] `MCP_PROVIDER_TYPES` (constants/constants.ts)

### decorators

- [x] `PromptDecoratorOptions`, `Prompt` (decorators/prompt.ts)
- [x] `ResourceDecoratorOptions`, `Resource` (decorators/resource.ts)
- [x] `Tool` (decorators/tool.ts)

### fn

- [x] `PromptProps`, `PromptsSettings`, `definePrompt` (fn/definePrompt.ts)
- [x] `ResourceProps`, `defineResource` overloads (fn/defineResource.ts)
- [x] `ToolCallback`, `ClassToolProps`, `ToolProps`, `defineTool` (fn/defineTool.ts)
- [x] `defineTool` error contract updated in docs/tests (`status_code`, `code`, `message`, `request_id`, `tool`)
- [x] `definePrompt` error contract updated in docs/tests (`status_code`, `code`, `message`, `request_id`, `prompt` in `_meta`)
- [x] `defineResource` error contract updated in docs/tests (`status_code`, `code`, `message`, `request_id`, `resource` in `_meta`)

### interfaces

- [x] `PlatformMcpSettings` (interfaces/PlatformMcpSettings.ts)

### services

- [x] `MCP_SERVER`, `MCP_SERVER` type alias (services/McpServerFactory.ts)
- [x] `PlatformMcpModule` (services/PlatformMcpModule.ts)

### utils

- [x] `toZod` (utils/toZod.ts)
- [x] `jsonSchemaToZod` + `default` export (utils/json-schema-to-zod/jsonSchemaToZod.ts & index.ts)
- [x] `parseSchema`, `its` (parsers/parseSchema.ts)
- [x] `parseAllOf`, `parseAnyOf`, `parseArray`, `parseBoolean`, `parseConst`, `parseDefault`, `parseEnum`, `parseIfThenElse`, `parseMultipleType`, `parseNot`, `parseNull`, `parseNullable`, `parseNumber`, `parseObject`, `parseOneOf`, `parseString` (parsers/\*)
- [x] `Serializable`, `JsonSchema`, `JsonSchemaObject`, `ParserSelector`, `ParserOverride`, `Options`, `Refs`, `ZodVersion` (Types.ts)
- [x] `expandJsdocs`, `addJsdocs` (utils/jsdocs.ts)
- [x] `withMessage` (utils/withMessage.ts)
- [x] `half` (utils/half.ts)
- [x] `omit` (utils/omit.ts)
- [x] `parseArgs`, `parseOrReadJSON`, `readPipe`, `printParams`, `Param`, `Params` (utils/cliTools.ts)
- [x] `cli` entrypoint (utils/json-schema-to-zod/cli.ts)
- [x] `toZod` dependency surface validation (utils/toZod.ts)

### misc

- [x] Ensure `index.ts` exports remain documented indirectly through their source files.
- [x] Update `reports/jsdoc/platform-mcp.md` after each documentation batch and log validation commands.
- [x] Keep tool error-handling documentation aligned with runtime payload shape.

import {OpenSpecHash, OpenSpecRef, OS3Example} from "@tsed/openspec";

import {JsonParameterStore} from "../../components/stores/JsonParameterStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Adds named examples for parameters in OpenAPI 3.0 format.
 *
 * The `@Examples()` decorator provides named examples specifically for parameters,
 * following the OpenAPI 3.0 specification format. Unlike `@Example()`, this accepts
 * an object with named example entries, each with a value and optional description.
 *
 * ### Basic Usage
 *
 * ```typescript
 * @Controller("/users")
 * class UserController {
 *   @Get("/:id")
 *   async getUser(
 *     @Examples({
 *       admin: {
 *         value: "admin-123",
 *         summary: "Admin user ID"
 *       },
 *       regular: {
 *         value: "user-456",
 *         summary: "Regular user ID"
 *       }
 *     })
 *     @PathParams("id")
 *     id: string
 *   ) {}
 * }
 * ```
 *
 * ### Query Parameters
 *
 * ```typescript
 * @Get("/search")
 * async search(
 *   @Examples({
 *     simple: {
 *       value: "typescript",
 *       summary: "Simple keyword search"
 *     },
 *     complex: {
 *       value: "typescript AND nodejs",
 *       summary: "Boolean search query"
 *     }
 *   })
 *   @QueryParams("q")
 *   query: string
 * ) {}
 * ```
 *
 * ### With Descriptions
 *
 * ```typescript
 * @Post("/filter")
 * async filter(
 *   @Examples({
 *     basic: {
 *       value: { status: "active" },
 *       summary: "Filter by status",
 *       description: "Returns only active records"
 *     },
 *     advanced: {
 *       value: { status: "active", role: "admin" },
 *       summary: "Complex filter",
 *       description: "Combines multiple filter criteria"
 *     }
 *   })
 *   @BodyParams()
 *   filters: object
 * ) {}
 * ```
 *
 * ### Use Cases
 *
 * - **Interactive Docs**: Provide multiple example scenarios in Swagger UI
 * - **API Education**: Show different use cases with descriptions
 * - **Testing**: Reference examples for integration tests
 * - **Client Generation**: Provide varied examples for SDK documentation
 *
 * ### OpenAPI 3.0 Format
 *
 * Generates:
 * ```json
 * {
 *   "examples": {
 *     "admin": {
 *       "value": "admin-123",
 *       "summary": "Admin user ID"
 *     }
 *   }
 * }
 * ```
 *
 * ### vs @Example
 *
 * - `@Examples()`: Named examples with summaries/descriptions (OpenAPI 3.0)
 * - `@Example()`: Simple array of values
 *
 * @param examples - Object mapping names to example definitions
 *
 * @decorator
 * @public
 */
export function Examples(examples: OpenSpecHash<OS3Example | OpenSpecRef>): ParameterDecorator {
  return JsonEntityFn((store: JsonParameterStore) => {
    store.parameter!.examples(examples);
  });
}

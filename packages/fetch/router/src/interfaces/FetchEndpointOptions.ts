import type {OS3MediaType, OS3Operation, OS3RequestBody, OS3Response} from "@tsed/openspec";
import type {Type} from "@tsed/core";
import type {JsonSchema} from "@tsed/schema";
import type {FetchContext, FetchEndpointInput} from "../components/FecthContext.js";

/**
 * HTTP methods supported by the Fetch router.
 */
export type FetchMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

/**
 * A Ts.ED class or JSON schema consumed by an adapter.
 */
export type FetchSchema<T = unknown> = Type<T> | JsonSchema<T>;

/**
 * Extracts the TypeScript value represented by a Ts.ED schema or class.
 */
export type InferFetchSchema<Schema> = Exclude<Schema, undefined> extends FetchSchema<infer Value> ? Value : unknown;

/**
 * HTTP metadata for a request body.
 *
 * Use this form when the JSON default is insufficient; a bare schema or class
 * remains valid for the common case.
 */
export interface FetchBodyOptions<Schema extends FetchSchema = FetchSchema> extends Omit<OS3RequestBody, "content"> {
  schema: Schema;
  contentType: string;
}

type FetchBodySchema<Body> = Body extends FetchBodyOptions<infer Schema> ? Schema : Body;

/**
 * Schema descriptors for values extracted from a request.
 */
export interface FetchEndpointSchemas {
  params?: FetchSchema;
  query?: FetchSchema;
  headers?: FetchSchema;
  body?: FetchSchema | FetchBodyOptions;
}

/**
 * Decoded handler input inferred from the endpoint's schema declarations.
 */
export type FetchEndpointInputFromSchemas<Schemas extends FetchEndpointSchemas> = {
  params: InferFetchSchema<Schemas["params"]>;
  query: InferFetchSchema<Schemas["query"]>;
  headers: InferFetchSchema<Schemas["headers"]>;
  body: InferFetchSchema<FetchBodySchema<Schemas["body"]>>;
};

/**
 * Values an endpoint handler can return before the host creates a `Response`.
 */
export type FetchHandlerResult<Output = unknown> = Output | Response | void;

/**
 * A Fetch-native endpoint handler.
 */
export type FetchHandler<Input extends FetchEndpointInput = FetchEndpointInput, Output = unknown> = (
  context: FetchContext<Input>
) => FetchHandlerResult<Output> | Promise<FetchHandlerResult<Output>>;

/**
 * Documentation metadata for the response produced by a handler.
 */
export interface FetchResponseOptions extends Omit<OS3MediaType, "schema">, Pick<OS3Response, "links" | "headers"> {
  /** Defaults to an empty string when generating OpenAPI. */
  description?: string;
  contentType?: string;
  schema?: FetchSchema;
}

/**
 * Response metadata indexed by HTTP status code.
 *
 * When a handler returns a value rather than a native `Response`, the smallest
 * declared status code supplies its default response metadata.
 */
export type FetchEndpointOutput = Record<number, FetchResponseOptions | FetchResponseOptions[]>;

/**
 * A declarative endpoint contract.
 *
 * `input` and `output` are metadata only. Parsing, validation, serialization,
 * and OpenAPI generation are deliberately delegated to adapters.
 */
export interface FetchEndpointOptions<Input extends FetchEndpointInput = FetchEndpointInput, Output = unknown> extends Omit<
  OS3Operation,
  "operationId" | "parameters" | "requestBody" | "responses"
> {
  /** Defaults to an identifier generated from the HTTP method and path. */
  operationId?: string;
  method: FetchMethod;
  path: string;
  input?: FetchEndpointSchemas;
  output?: FetchEndpointOutput;
  handler: FetchHandler<Input, Output>;
}

/**
 * Endpoint options whose handler input is inferred from the supplied schemas.
 */
export type InferredFetchEndpointOptions<Schemas extends FetchEndpointSchemas, Output = unknown> = Omit<
  FetchEndpointOptions<FetchEndpointInputFromSchemas<Schemas>, Output>,
  "input"
> & {
  input: Schemas;
};

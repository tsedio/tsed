import {deepMerge, uniq, uniqBy} from "@tsed/core";
import {OpenSpecSecurity, OpenSpecTag, OS3Operation} from "@tsed/openspec";

import {JsonHeader} from "../interfaces/JsonOpenSpec.js";
import {isRedirectionStatus, isSuccessStatus} from "../utils/isSuccessStatus.js";
import {JsonMap} from "./JsonMap.js";
import {JsonParameter} from "./JsonParameter.js";
import {JsonResponse} from "./JsonResponse.js";
import {JsonSchema} from "./JsonSchema.js";

/**
 * Represents an HTTP operation path with metadata for OpenAPI specifications.
 *
 * This class associates an HTTP method and path with operation-level metadata
 * such as summary and description. It's used internally to manage routing
 * information for API endpoints.
 *
 * @public
 */
export class JsonMethodPath extends JsonMap<any> {
  constructor(
    public method: string,
    public path: string | RegExp
  ) {
    super();
  }

  summary(summary: string): this {
    super.set("summary", summary);

    return this;
  }

  description(description: string): this {
    super.set("description", description);

    return this;
  }
}

/**
 * Configuration options for JSON operations compatible with OpenAPI 3 specifications.
 *
 * Extends the OpenAPI 3 operation specification with Ts.ED-specific media type
 * declarations (consumes/produces) for request and response handling.
 *
 * @public
 */
export interface JsonOperationOptions extends OS3Operation<JsonSchema, JsonParameter, JsonMap<JsonResponse>> {
  consumes: string[];
  produces: string[];
}

/**
 * Represents an HTTP operation (endpoint) with complete OpenAPI metadata.
 *
 * JsonOperation is the core class for defining HTTP endpoints in Ts.ED, storing all
 * operation-level information required for OpenAPI specification generation including:
 *
 * - Request parameters (path, query, header, body)
 * - Response definitions with status codes
 * - Security requirements
 * - Tags and categorization
 * - Media type handling (consumes/produces)
 * - Operation metadata (summary, description, operationId)
 *
 * ### Usage
 *
 * ```typescript
 * const operation = new JsonOperation()
 *   .summary("Create a user")
 *   .description("Creates a new user in the system")
 *   .addTags([{name: "Users"}])
 *   .addParameter(0, parameterMetadata)
 *   .addResponse(201, responseMetadata);
 * ```
 *
 * ### Key Features
 *
 * - **Parameters**: Manage operation parameters by index or name
 * - **Responses**: Define responses for different HTTP status codes
 * - **Security**: Configure authentication and authorization
 * - **Media Types**: Specify accepted and produced content types
 * - **Routing**: Multiple path/method combinations per operation
 *
 * @public
 */
export class JsonOperation extends JsonMap<JsonOperationOptions> {
  $kind: string = "operation";

  readonly operationPaths: Map<string, JsonMethodPath> = new Map();

  #status = 200;
  #redirection: boolean = false;

  constructor(obj: Partial<JsonOperationOptions> = {}) {
    super({parameters: [], responses: new JsonMap(), ...obj});
  }

  get response(): JsonResponse | undefined {
    return this.getResponses().get(this.getStatus().toString());
  }

  get status() {
    return this.#status;
  }

  tags(tags: OpenSpecTag[]): this {
    super.set("tags", tags);

    return this;
  }

  addTags(tags: OpenSpecTag[]) {
    tags = uniqBy([...(this.get("tags") || []), ...tags], "name");

    return this.tags(tags);
  }

  summary(summary: string): this {
    super.set("summary", summary);

    return this;
  }

  operationId(operationId: string): this {
    this.set("operationId", operationId);

    return this;
  }

  responses(responses: JsonMap<any>): this {
    this.set("responses", responses);

    return this;
  }

  defaultStatus(status: number) {
    this.#status = status;

    return this;
  }

  getStatus() {
    return this.#status || 200;
  }

  setRedirection(status = 302) {
    this.#redirection = true;
    this.#status = status;
    return this;
  }

  isRedirection(status?: number) {
    if (this.#redirection) {
      if (status) {
        return isRedirectionStatus(status);
      }
    }

    return this.#redirection;
  }

  addResponse(statusCode: string | number, response: JsonResponse) {
    if ((isSuccessStatus(statusCode) || isRedirectionStatus(statusCode)) && !this.#status) {
      const res = this.getResponseOf(200);

      this.getResponses().set(statusCode.toString(), res).delete("200");

      this.defaultStatus(Number(statusCode));
    }

    const currentCode = statusCode === "default" ? this.getStatus().toString() : statusCode.toString();
    const currentResponse = this.getResponses().get(currentCode);

    if (!currentResponse) {
      response.status = Number(currentCode);
      this.getResponses().set(currentCode, response);
    } else {
      response.forEach((value, key) => {
        if (!["content"].includes(key)) {
          currentResponse.set(key, deepMerge(currentResponse.get(key), value));
        }
      });
      currentResponse.status = Number(currentCode);
    }

    return this;
  }

  getResponses() {
    return this.get("responses") as JsonMap<JsonResponse>;
  }

  getResponseOf(status: number | string): JsonResponse {
    return (status === "default" ? this.response : this.getResponses().get(String(status))) || new JsonResponse();
  }

  ensureResponseOf(status: number | string): JsonResponse {
    this.addResponse(status, this.getResponseOf(status));
    return this.getResponseOf(status);
  }

  getHeadersOf(status: number): Record<string, JsonHeader & {example: string}> {
    return this.getResponseOf(status).get("headers") || {};
  }

  getContentTypeOf(status: number): any {
    return [...this.getResponseOf(status).get("content").keys()].slice(-1)[0];
  }

  security(security: OpenSpecSecurity): this {
    this.set("security", security);

    return this;
  }

  addSecurityScopes(name: string, scopes: string[]) {
    const security = this.get("security") || {};
    security[name] = uniq([...(security[name] || []), ...scopes]);

    return this.security(security);
  }

  description(description: string): this {
    super.set("description", description);

    return this;
  }

  deprecated(deprecated: boolean): this {
    super.set("deprecated", deprecated);

    return this;
  }

  addAllowedGroupsParameter(allowedGroups: string[]) {
    const jsonParameter = new JsonParameter();
    jsonParameter.in("query").name("includes");
    jsonParameter.schema(
      JsonSchema.from({
        type: "array",
        items: {
          type: "string",
          enum: [...allowedGroups]
        }
      })
    );

    this.addParameter(-1, jsonParameter);

    return this;
  }

  parameters(parameters: JsonParameter[]): this {
    super.set("parameters", parameters);

    return this;
  }

  addParameter(index: number, parameter: JsonParameter) {
    if (index === -1) {
      index = this.get("parameters").length;
    }
    this.get("parameters")[index] = parameter;
  }

  consumes(consumes: string[]): this {
    super.set("consumes", consumes);

    return this;
  }

  produces(produces: string[]): this {
    super.set("produces", produces);

    return this;
  }

  addProduce(produce: string) {
    const produces = uniq([].concat(this.get("produces"), produce as never)).filter(Boolean);

    this.set("produces", produces);
  }

  addOperationPath(method: string, path: string | RegExp) {
    const operationPath = new JsonMethodPath(method, path);
    this.operationPaths.set(String(method) + String(path), operationPath);

    return operationPath;
  }

  getAllowedOperationPath(allowedVerbs?: string[]) {
    if (!allowedVerbs) {
      return [...this.operationPaths.values()];
    }

    return [...this.operationPaths.values()].filter(({method}) => method && allowedVerbs.includes(method.toUpperCase()));
  }
}

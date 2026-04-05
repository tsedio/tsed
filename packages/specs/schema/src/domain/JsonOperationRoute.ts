import {Type} from "@tsed/core";

import {concatPath} from "../utils/concatPath.js";
import {JsonMethodStore} from "./JsonMethodStore.js";
import {JsonMethodPath, JsonOperation} from "./JsonOperation.js";

/**
 * Represents a fully resolved HTTP route combining controller and method metadata.
 *
 * JsonOperationRoute provides a unified view of an HTTP endpoint by combining:
 * - Controller class information (token, basePath)
 * - Method metadata (endpoint store)
 * - Operation details (HTTP method, path, parameters)
 * - Full URL computation
 *
 * ### Responsibilities
 *
 * - **URL Resolution**: Combines base path and operation path into full URL
 * - **Metadata Access**: Provides convenient access to operation, parameters, and store
 * - **Route Identification**: Computes route names and operation IDs
 * - **Parameter Type Tracking**: Maintains map of parameter types (query, body, etc.)
 *
 * ### Usage
 *
 * ```typescript
 * // Routes are typically created during framework initialization
 * const route = new JsonOperationRoute({
 *   token: MyController,
 *   endpoint: methodStore,
 *   operationPath: { method: "GET", path: "/:id" },
 *   basePath: "/users"
 * });
 *
 * // Access route information
 * console.log(route.fullPath);  // "/users/:id"
 * console.log(route.method);     // "GET"
 * console.log(route.name);       // "MyController.getUser()"
 * console.log(route.operationId); // "getUser"
 * ```
 *
 * ### URL Construction
 *
 * The route combines controller base path with operation path:
 * - Base path: `/users` (from `@Controller("/users")`)
 * - Operation path: `/:id` (from `@Get("/:id")`)
 * - Full path: `/users/:id`
 *
 * ### Parameter Type Detection
 *
 * The route maintains a map of parameter types present in the operation:
 * ```typescript
 * route.has("query")  // true if operation has @QueryParams
 * route.has("body")   // true if operation has @BodyParams
 * route.has("path")   // true if operation has @PathParams
 * ```
 *
 * @typeParam Entity - The type of JsonMethodStore (default: JsonMethodStore)
 *
 * @public
 */
export class JsonOperationRoute<Entity extends JsonMethodStore = JsonMethodStore> {
  readonly token!: Type<any>;
  readonly endpoint!: Entity;
  readonly operationPath?: JsonMethodPath;
  readonly basePath?: string;
  readonly paramsTypes: Record<string, boolean>;

  constructor(options: Partial<JsonOperationRoute>) {
    Object.assign(this, options);

    this.paramsTypes = this.endpoint.getParamTypes();
  }

  get url() {
    return this.fullPath;
  }

  get path() {
    return this.operationPath?.path;
  }

  get fullPath() {
    return concatPath(this.basePath, this.path as any);
  }

  get method() {
    return this.operationPath?.method || "USE";
  }

  get name() {
    return `${this.endpoint.targetName}.${this.methodClassName}()`;
  }

  get className() {
    return this.endpoint.targetName;
  }

  get methodClassName() {
    return this.propertyKey;
  }

  get parameters() {
    return this.endpoint.parameters;
  }

  get propertyKey() {
    return String(this.endpoint.propertyKey);
  }

  get propertyName() {
    return this.endpoint.propertyName;
  }

  get store() {
    return this.endpoint.store;
  }

  get operation(): JsonOperation {
    return this.endpoint.operation as JsonOperation;
  }

  get operationId() {
    return this.operation.get("operationId") || this.endpoint.propertyKey;
  }

  has(key: string) {
    return this.paramsTypes[key];
  }
}

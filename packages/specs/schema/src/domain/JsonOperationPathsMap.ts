import {JsonMethodPath} from "./JsonOperation.js";
import {OperationVerbs} from "../constants/OperationVerbs.js";

/**
 * Map container for storing HTTP operation paths indexed by method and path.
 *
 * JsonOperationPathsMap maintains a collection of operation paths (HTTP method + URL path
 * combinations) for a controller. It provides efficient lookup and prevents duplicate
 * operations from being registered.
 *
 * ### Key Features
 *
 * - **Unique Keys**: Stores operations using `method-path` composite keys
 * - **Method Safety**: Ensures operations are uniquely identified
 * - **Efficient Lookup**: Fast retrieval of operations by method and path
 * - **Type Safety**: Extends Map with JsonMethodPath values
 *
 * ### Usage
 *
 * ```typescript
 * const pathsMap = new JsonOperationPathsMap();
 *
 * // Add operation path
 * const methodPath = { method: "GET", path: "/users" };
 * pathsMap.setOperationPath(methodPath);
 *
 * // Retrieve by composite key
 * const operation = pathsMap.get("GET-/users");
 * ```
 *
 * ### Key Generation
 *
 * The map uses a composite key format: `{method}-{path}`
 * - Example: `"GET-/users/:id"` for a GET operation on `/users/:id`
 * - Example: `"POST-/users"` for a POST operation on `/users`
 *
 * This ensures that different HTTP methods on the same path are treated as
 * distinct operations.
 *
 * @public
 */
export class JsonOperationPathsMap extends Map<string, JsonMethodPath> {
  $kind: string = "operationPaths";
  readonly $isJsonDocument = true;

  setOperationPath(operationPath: JsonMethodPath) {
    // if (operationPath.method !== OperationVerbs.CUSTOM) {
    const key = this.getKey(operationPath.method, operationPath.path);
    this.set(key, operationPath);
    // }
  }

  protected getKey = (method: string, path: any) => `${method}-${path}`;
}

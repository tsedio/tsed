import type {JsonMethodStore} from "../JsonMethodStore.js";

export function inspectOperationsPaths(endpoint: JsonMethodStore) {
  return [...endpoint.operationPaths.values()].map(({method, path}) => ({
    method,
    path
  }));
}

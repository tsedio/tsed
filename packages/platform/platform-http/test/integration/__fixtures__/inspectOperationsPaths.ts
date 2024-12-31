import type {JsonMethodStore} from "@tsed/schema";

export function inspectOperationsPaths(endpoint: JsonMethodStore) {
  return [...endpoint.operationPaths.values()].map(({method, path}) => ({
    method,
    path
  }));
}

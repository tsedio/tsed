import {concatParameters} from "./concatParameters";
import {getJsonPathParameters} from "./getJsonPathParameters";

export function mergeOperation(obj: any, operation: any, {rootPath, operationId, defaultTags, tags, path, method}: any) {
  return getJsonPathParameters(rootPath, path).reduce((obj, {path, parameters}) => {
    parameters = concatParameters(parameters, operation);
    path = !!path ? path : "/";

    const operationTags = operation.tags?.length ? operation.tags : [defaultTags];

    obj.paths[path] = {
      ...obj.paths[path],
      [method.toLowerCase()]: {
        operationId: operation.operationId || operationId(path),
        ...operation,
        tags: operationTags.map(({name}: any) => name),
        parameters
      }
    };

    tags.push(...operationTags);

    return obj;
  }, obj);
}

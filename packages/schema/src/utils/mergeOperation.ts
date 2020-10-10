import {SpecTypes} from "../domain/SpecTypes";
import {concatParameters} from "./concatParameters";
import {getJsonPathParameters} from "./getJsonPathParameters";
/**
 * @ignore
 */
export interface MergeOperationOptions {
  rootPath: string;
  specType: SpecTypes;
  operationId: (path: string) => string | undefined;
  defaultTags: string[];
  tags: string[];
  path: string;
  method: string;
}

/**
 * @ignore
 */
export function mergeOperation(
  obj: any,
  operation: any,
  {rootPath, specType, operationId, defaultTags, tags, path, method}: MergeOperationOptions
) {
  return getJsonPathParameters(rootPath, path).reduce((obj, {path, parameters}) => {
    parameters = concatParameters(parameters, operation);
    path = path ? path : "/";

    const operationTags = operation.tags?.length ? operation.tags : [defaultTags];

    if (specType === SpecTypes.OPENAPI) {
      parameters = parameters.map(({type, ...param}) => {
        if (type) {
          return {
            ...param,
            schema: {
              type
            }
          };
        }

        return param;
      });
    }

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

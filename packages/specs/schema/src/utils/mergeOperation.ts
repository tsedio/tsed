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
  const pathParameters = getJsonPathParameters(rootPath, path).map(({path, parameters}) => {
    path = path ? path : "/";

    // FIXME not on the right place
    if (specType === SpecTypes.OPENAPI) {
      parameters = parameters.map(({type, ...param}) => {
        return {
          ...param,
          schema: {
            type
          }
        };
      });
    }

    return {path, parameters};
  });

  return pathParameters.reduce((obj, {path, parameters}) => {
    parameters = concatParameters(parameters, operation);
    path = path ? path : "/";

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

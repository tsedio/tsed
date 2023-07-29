import {OS3Operation, OS3Paths} from "@tsed/openspec";
import {JsonMethodStore} from "../domain/JsonMethodStore";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";
import {buildPath} from "../utils/buildPath";
import {concatParameters} from "../utils/concatParameters";
import {getJsonEntityStore} from "../utils/getJsonEntityStore";
import {getJsonPathParameters} from "../utils/getJsonPathParameters";
import {getOperationsStores} from "../utils/getOperationsStores";

function operationId(path: string, {store, operationIdFormatter}: JsonSchemaOptions) {
  return operationIdFormatter!(store.parent.schema.get("name") || store.parent.targetName, store.propertyName, path);
}

function pushToPath(
  paths: OS3Paths,
  {
    path,
    method,
    operation
  }: {
    method: string;
    path: string;
    operation: OS3Operation;
  }
) {
  return {
    ...paths,
    [path]: {
      ...(paths as any)[path],
      [method.toLowerCase()]: operation
    }
  };
}

function removeHiddenOperation(operationStore: JsonMethodStore) {
  return !operationStore.store.get("hidden");
}

function mapOperationPaths({operationStore, operation}: {operationStore: JsonMethodStore; operation: OS3Operation}) {
  return [...operationStore.operation!.operationPaths.values()]
    .map((operationPath) => {
      return {
        ...operationPath,
        operationStore,
        operation
      };
    })
    .filter(({method}) => method);
}

function mapOperationInPathParameters(options: JsonSchemaOptions) {
  return ({
    path,
    method,
    operation,
    operationStore
  }: {
    path: string;
    method: string;
    operation: OS3Operation;
    operationStore: JsonMethodStore;
  }) => {
    return getJsonPathParameters(options.ctrlRootPath, path).map(({path, parameters}) => {
      path = path ? path : "/";

      parameters = concatParameters(
        parameters.map(({type, ...param}) => {
          return {
            ...param,
            schema: {
              type
            }
          };
        }),
        operation
      );

      return {
        operation: {
          ...operation,
          parameters,
          operationId:
            operation.operationId ||
            operationId(path, {
              ...options,
              store: operationStore
            })
        },
        method,
        path
      };
    });
  };
}

function mapOperation(options: JsonSchemaOptions) {
  return (operationStore: JsonMethodStore) => {
    const operation = execMapper("operation", operationStore.operation, options);

    return {
      operation,
      operationStore
    };
  };
}

export function pathsMapper(model: any, {paths, rootPath, ...options}: JsonSchemaOptions) {
  const store = getJsonEntityStore(model);
  const ctrlPath = store.path;
  const ctrlRootPath = buildPath(rootPath + ctrlPath);

  options = {
    ...options,
    ctrlRootPath
  };

  return [...getOperationsStores(model).values()]
    .filter(removeHiddenOperation)
    .map(mapOperation(options))
    .flatMap(mapOperationPaths)
    .flatMap(mapOperationInPathParameters(options))
    .reduce(pushToPath, paths);
}

registerJsonSchemaMapper("paths", pathsMapper);

import {OS3Operation, OS3Paths} from "@tsed/openspec";
import {OperationVerbs} from "../../constants/OperationVerbs";
import {JsonMethodStore} from "../../domain/JsonMethodStore";
import {JsonMethodPath} from "../../domain/JsonOperation";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import {buildPath} from "../../utils/buildPath";
import {concatParameters} from "../../utils/concatParameters";
import {getJsonEntityStore} from "../../utils/getJsonEntityStore";
import {getJsonPathParameters} from "../../utils/getJsonPathParameters";
import {getOperationsStores} from "../../utils/getOperationsStores";
import {getOperationId} from "../../utils/operationIdFormatter";
import {removeHiddenOperation} from "../../utils/removeHiddenOperation";

const ALLOWED_VERBS = [
  OperationVerbs.ALL,
  OperationVerbs.GET,
  OperationVerbs.POST,
  OperationVerbs.PUT,
  OperationVerbs.PATCH,
  OperationVerbs.HEAD,
  OperationVerbs.OPTIONS,
  OperationVerbs.DELETE,
  OperationVerbs.TRACE
];

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

function mapOperationInPathParameters(options: JsonSchemaOptions) {
  return ({
    operationPath,
    operation,
    operationStore
  }: {
    operationPath: JsonMethodPath;
    operation: OS3Operation;
    operationStore: JsonMethodStore;
  }) => {
    const {path, method} = operationPath;

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
            getOperationId(path, {
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
    const operationPaths = operationStore.operation.getAllowedOperationPath(ALLOWED_VERBS);

    if (operationPaths.length === 0) {
      return [];
    }

    const operation = execMapper("operation", [operationStore.operation], options);

    return operationPaths.map((operationPath) => {
      return {
        operationPath,
        operation,
        operationStore
      };
    });
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
    .filter((operationStore) => operationStore.operation.getAllowedOperationPath(ALLOWED_VERBS).length > 0)
    .flatMap(mapOperation(options))
    .flatMap(mapOperationInPathParameters(options))
    .reduce(pushToPath, paths);
}

registerJsonSchemaMapper("paths", pathsMapper);

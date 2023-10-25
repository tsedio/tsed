import {camelCase} from "change-case";
import {OperationVerbs} from "../../constants/OperationVerbs";
import {JsonMethodStore} from "../../domain/JsonMethodStore";
import {JsonMethodPath} from "../../domain/JsonOperation";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import {buildPath} from "../../utils/buildPath";
import {getJsonEntityStore} from "../../utils/getJsonEntityStore";
import {getOperationsStores} from "../../utils/getOperationsStores";
import {removeHiddenOperation} from "../../utils/removeHiddenOperation";

const ALLOWED_VERBS = [OperationVerbs.PUBLISH, OperationVerbs.SUBSCRIBE];

function pushToChannels(options: JsonSchemaOptions) {
  return (
    channels: any,
    {
      operationPath,
      operationStore
    }: {
      operationPath: JsonMethodPath;
      operationStore: JsonMethodStore;
    }
  ) => {
    const path = options.ctrlRootPath || "/";
    const method = operationPath.method.toLowerCase();
    const operationId = camelCase(`${method.toLowerCase()} ${operationStore.parent.schema.getName()}`);

    const message = execMapper("message", [operationStore, operationPath], options);

    return {
      ...channels,
      [path]: {
        ...(channels as any)[path],
        [method]: {
          ...(channels as any)[path]?.[method],
          operationId,
          message: {
            oneOf: [...((channels as any)[path]?.[method]?.message?.oneOf || []), message]
          }
        }
      }
    };
  };
}

function expandOperationPaths(options: JsonSchemaOptions) {
  return (operationStore: JsonMethodStore) => {
    const operationPaths = operationStore.operation.getAllowedOperationPath(ALLOWED_VERBS);

    if (operationPaths.length === 0) {
      return [];
    }

    return operationPaths.map((operationPath) => {
      return {
        operationPath,
        operationStore
      };
    });
  };
}

export function channelsMapper(model: any, {channels, rootPath, ...options}: JsonSchemaOptions) {
  const store = getJsonEntityStore(model);
  const ctrlPath = store.path;
  const ctrlRootPath = buildPath(rootPath + ctrlPath);

  options = {
    ...options,
    ctrlRootPath
  };

  return [...getOperationsStores(model).values()]
    .filter(removeHiddenOperation)
    .flatMap(expandOperationPaths(options))
    .reduce(pushToChannels(options), channels);
}

registerJsonSchemaMapper("channels", channelsMapper);

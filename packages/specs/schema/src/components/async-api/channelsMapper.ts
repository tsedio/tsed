import {camelCase} from "change-case";

import {OperationVerbs} from "../../constants/OperationVerbs.js";
import {JsonMethodStore} from "../../domain/JsonMethodStore.js";
import {JsonMethodPath} from "../../domain/JsonOperation.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {buildPath} from "../../utils/buildPath.js";
import {getJsonEntityStore} from "../../utils/getJsonEntityStore.js";
import {getOperationsStores} from "../../utils/getOperationsStores.js";
import {removeHiddenOperation} from "../../utils/removeHiddenOperation.js";

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

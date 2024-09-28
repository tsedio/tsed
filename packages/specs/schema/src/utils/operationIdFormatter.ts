import {camelCase} from "change-case";

import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";

const DEFAULT_PATTERN = "%c.%m";

/**
 * @ignore
 */
export function operationIdFormatter(pattern: string = "") {
  const OPERATION_IDS = new Map<string, number>();

  const transform = (name: string, propertyKey: string) => {
    const str = (pattern || DEFAULT_PATTERN).replace(/%c/, name).replace(/%m/, propertyKey);
    return pattern === "" ? camelCase(str) : str;
  };

  return (name: string, propertyKey: string, path: string = "") => {
    const operationId = transform(name, propertyKey);
    const operationKey = name + propertyKey;

    if (!OPERATION_IDS.has(operationKey)) {
      OPERATION_IDS.set(operationKey, 0);

      return operationId;
    }

    // try with paths
    const result = path.match(/{(\w+)}/gi);
    if (result) {
      const operationKey = name + propertyKey + result[0];

      if (!OPERATION_IDS.has(operationKey)) {
        OPERATION_IDS.set(operationKey, 0);

        return camelCase(`${operationId} By ${result}`);
      }
    }

    const id = OPERATION_IDS.get(operationKey)! + 1;
    OPERATION_IDS.set(operationKey, id);

    return `${operationId}_${id}`;
  };
}

export function getOperationId(path: string, {store, operationIdFormatter}: JsonSchemaOptions) {
  return operationIdFormatter!(store.parent.schema.get("name") || store.parent.targetName, store.propertyName, path);
}

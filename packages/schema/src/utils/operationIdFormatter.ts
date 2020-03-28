import {camelCase} from "change-case";

export function operationIdFormatter(pattern = "%c.%m") {
  const OPERATION_IDS = new Map<string, number>();

  return (name: string, propertyKey: string, path: string = "") => {
    const operationId = camelCase(pattern.replace(/%c/, name).replace(/%m/, propertyKey));
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

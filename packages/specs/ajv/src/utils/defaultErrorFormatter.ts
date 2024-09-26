import type {AjvErrorObject} from "../interfaces/IAjvSettings.js";
import {getInstancePath, getPath} from "./getPath.js";

export function defaultErrorFormatter(error: AjvErrorObject & {dataPath: string}) {
  const value = JSON.stringify(error.data === undefined ? "undefined" : error.data);
  const join = (list: any[]): string => list.filter(Boolean).join("").trim();

  const [, indexPath, ...paths] = getInstancePath(error).split(".");
  const deepPaths = paths.length ? "." + paths.join(".") : "";

  error.dataPath = getPath(error);

  if (error.collectionName) {
    const modelName = error.modelName || "";

    switch (error.collectionName) {
      case "Array":
        return join([`${modelName}[${indexPath}]${deepPaths}`, ` ${error.message}. Given value: ${value}`]);
      case "Map":
        return join([`Map<${indexPath}, ${modelName}>${deepPaths}`, ` ${error.message}. Given value: ${value}`]);
      case "Set":
        return join([`Set<${indexPath}, ${modelName}>${deepPaths}`, ` ${error.message}. Given value: ${value}`]);
    }
  }

  return join([
    !error.modelName && "Value",
    `${error.modelName || ""}`,
    (!error?.params?.missingProperty && error.dataPath) ||
      (error?.params?.missingProperty && (error.instancePath || "").replace(/\//g, ".")),
    ` ${error.message}. Given value: ${value}`
  ]);
}

import {AjvErrorObject} from "../interfaces/IAjvSettings";
import {getPath} from "./getPath";

export function defaultErrorFormatter(error: AjvErrorObject & {dataPath: string}) {
  const value = JSON.stringify(error.data === undefined ? "undefined" : error.data);
  const join = (list: any[]): string => list.filter(Boolean).join("").trim();

  error.dataPath = getPath(error);

  const [, indexPath, ...paths] = error.dataPath.split(".");
  const deepPaths = paths.length ? "." + paths.join(".") : "";

  if (error.collectionName) {
    switch (error.collectionName) {
      case "Array":
        return join([`${error.modelName || ""}[${indexPath}]${deepPaths}`, ` ${error.message}. Given value: ${value}`]);
      case "Map":
        return join([`Map<${indexPath}, ${error.modelName || ""}>${deepPaths}`, ` ${error.message}. Given value: ${value}`]);
      case "Set":
        return join([`Set<${indexPath}, ${error.modelName || ""}>${deepPaths}`, ` ${error.message}. Given value: ${value}`]);
    }
  }

  return join([!error.modelName && "Value", `${error.modelName || ""}`, error.dataPath, ` ${error.message}. Given value: ${value}`]);
}

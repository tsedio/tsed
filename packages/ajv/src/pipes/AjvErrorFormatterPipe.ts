import {Constant, PropertyMetadata} from "@tsed/common";
import {getValue, nameOf, setValue, Type} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {ErrorObject} from "ajv";
import {AjvValidationError} from "../errors/AjvValidationError";
import {AjvErrorObject, ErrorFormatter} from "../interfaces/IAjvSettings";

function defaultFormatter(error: AjvErrorObject) {
  const value = JSON.stringify(error.data === undefined ? "undefined" : error.data);
  const join = (list: any[]): string => list.filter(Boolean).join("").trim();
  error.dataPath = error.dataPath ? error.dataPath.replace(/\//gi, ".") : error.dataPath;

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

@Injectable()
export class AjvErrorFormatterPipe {
  @Constant("ajv.errorFormatter", defaultFormatter)
  errorFormatter: ErrorFormatter;

  transform(errors: ErrorObject[], options: any) {
    const {type, collectionType, value} = options;

    const message = errors
      .map((error: AjvErrorObject) => {
        if (collectionType) {
          error.collectionName = nameOf(collectionType);
        }

        if (!error.data) {
          if (error.dataPath) {
            error.data = getValue(error.dataPath.replace(/^./, ""), value);
          } else if (error.schemaPath !== "#/required") {
            error.data = value;
          }
        }

        if (error.dataPath && error.dataPath.match(/pwd|password|mdp|secret/)) {
          error.data = "[REDACTED]";
        }

        if (type) {
          error.modelName = nameOf(type);
          error.message = this.mapClassError(error, type);
        }

        return this.errorFormatter.call(this, error, {});
      })
      .join("\n");

    return new AjvValidationError(message, errors);
  }

  private mapClassError(error: AjvErrorObject, targetType: Type<any>) {
    const propertyKey = getValue(error, "params.missingProperty");

    if (propertyKey) {
      const prop = PropertyMetadata.get(targetType, propertyKey);

      if (prop) {
        setValue(error, "params.missingProperty", prop.name || propertyKey);

        return error.message!.replace(`'${propertyKey}'`, `'${prop.name || propertyKey}'`);
      }
    }

    return error.message;
  }
}

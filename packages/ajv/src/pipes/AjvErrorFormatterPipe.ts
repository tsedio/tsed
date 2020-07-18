import {Constant, PropertyMetadata} from "@tsed/common";
import {getValue, nameOf, setValue, Type} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {ErrorObject} from "ajv";
import {AjvValidationError} from "../errors/AjvValidationError";
import {AjvErrorObject, ErrorFormatter} from "../interfaces/IAjvSettings";

function defaultFormatter(error: AjvErrorObject) {
  const value = JSON.stringify(error.data === undefined ? "undefined" : error.data);
  const join = (list: any[]): string =>
    list
      .filter(Boolean)
      .join("")
      .trim();

  if (error.collectionName) {
    switch (error.collectionName) {
      case "Map":
        return join([
          error.dataPath.replace("['", "Map<").replace("']", `, ${error.modelName || ""}>`),
          ` ${error.message}. Given value: ${value}`
        ]);
      case "Set":
        return join([
          error.dataPath.replace("[", "Set<").replace("]", `, ${error.modelName || ""}>`),
          ` ${error.message}. Given value: ${value}`
        ]);
    }
  }

  return join([
    !error.modelName && "Value",
    // index !== undefined && !error.modelName && ".",
    // index !== undefined && !isNaN(+index) && `[${index}]`,
    // index !== undefined && isNaN(+index) && `${index}`,
    // index !== undefined && error.modelName && isNaN(+index) && ".",
    `${error.modelName || ""}`,
    error.dataPath,
    ` ${error.message}. Given value: ${value}`
  ]);
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
          if (error.dataPath && error.dataPath.match(/pwd|password|mdp|secret/)) {
            error.data = "[REDACTED]";
          } else if (error.dataPath) {
            error.data = getValue(error.dataPath.replace(/^./, ""), value);
          } else if (error.schemaPath !== "#/required") {
            error.data = value;
          }
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
    const propertyKey = getValue("params.missingProperty", error);

    if (propertyKey) {
      const prop = PropertyMetadata.get(targetType, propertyKey);

      if (prop) {
        setValue("params.missingProperty", error, prop.name || propertyKey);

        return error.message!.replace(`'${propertyKey}'`, `'${prop.name || propertyKey}'`);
      }
    }

    return error.message;
  }
}

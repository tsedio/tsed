import {Constant, PropertyMetadata} from "@tsed/common";
import {getValue, nameOf, setValue, Type} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {ErrorObject} from "ajv";
import {AjvValidationError} from "../errors/AjvValidationError";
import {AjvErrorObject, ErrorFormatter} from "../interfaces/IAjvSettings";

function defaultFormatter(error: AjvErrorObject, index: string | number) {
  const value = JSON.stringify(error.data === undefined ? "undefined" : error.data);

  return (
    [
      !error.modelName && "Value",
      index !== undefined && !error.modelName && ".",
      index !== undefined && !isNaN(+index) && `[${index}]`,
      index !== undefined && isNaN(+index) && `${index}`,
      index !== undefined && error.modelName && isNaN(+index) && ".",
      `${error.modelName || ""}`,
      error.dataPath,
      ` ${error.message}. Given value: ${value}`
    ]
      // @ts-ignore
      .filter<string>(Boolean)
      .join("")
      .trim()
  );
}

@Injectable()
export class AjvErrorFormatterPipe {
  @Constant("ajv.errorFormatter", defaultFormatter)
  errorFormatter: ErrorFormatter;

  transform(errors: ErrorObject[], options: any) {
    const {type, index} = options;

    const message = errors
      .map((error: AjvErrorObject) => {
        if (type) {
          error.modelName = nameOf(type);
          error.message = this.mapClassError(error, type);
        }

        return this.errorFormatter.call(this, error, index);
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

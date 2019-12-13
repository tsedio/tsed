import {ConverterService, JsonSchemesService, OverrideService, PropertyRegistry, ValidationService} from "@tsed/common";
import {getValue, nameOf, setValue, Type} from "@tsed/core";
import {Configuration} from "@tsed/di";
import * as Ajv from "ajv";
import {ErrorObject} from "ajv";
import {AjvValidationError} from "../errors/AjvValidationError";
import {AjvErrorObject, ErrorFormatter, IAjvOptions, IAjvSettings} from "../interfaces/IAjvSettings";

@OverrideService(ValidationService)
export class AjvService extends ValidationService {
  private errorFormatter: ErrorFormatter;
  private options: IAjvOptions;
  private ajv: Ajv.Ajv;

  constructor(
    private jsonSchemaService: JsonSchemesService,
    @Configuration() private configuration: Configuration,
    private converterService: ConverterService
  ) {
    super();

    const ajvSettings: IAjvSettings = this.configuration.get("ajv") || {};

    this.options = Object.assign(
      {
        verbose: false
      },
      ajvSettings.options || {}
    );

    this.ajv = new Ajv(this.options);

    this.errorFormatter = ajvSettings.errorFormat ? ajvSettings.errorFormat : this.defaultFormatter;
  }

  /**
   *
   * @param obj
   * @param targetType
   * @param baseType
   * @returns {boolean}
   */
  public validate(obj: any, targetType: any, baseType?: any): boolean {
    const schema = this.jsonSchemaService.getSchemaDefinition(targetType) as any;

    if (schema && !(obj === null || obj === undefined)) {
      const collection = baseType ? obj : [obj];
      const options = {
        ignoreCallback: (obj: any, type: any) => type === Date,
        checkRequiredValue: false
      };

      const test = (obj: any) => {
        const valid = this.ajv.validate(schema, obj);

        if (!valid) {
          throw this.buildErrors(this.ajv.errors!, targetType);
        }
      };

      Object.keys(collection).forEach((key: any) =>
        test(this.converterService.deserialize(collection[key], targetType, undefined, options))
      );
    }

    return true;
  }

  /**
   *
   * @param {ajv.ErrorObject[]} errors
   * @param {Type<any>} targetType
   * @returns {BadRequest}
   */
  private buildErrors(errors: ErrorObject[], targetType: Type<any>) {
    const message = errors
      .map((error: AjvErrorObject) => {
        error.modelName = nameOf(targetType);
        const propertyKey = getValue("params.missingProperty", error);

        if (propertyKey) {
          const prop = PropertyRegistry.get(targetType, propertyKey);

          if (prop) {
            setValue("params.missingProperty", error, prop.name || propertyKey);
            error.message = error.message!.replace(`'${propertyKey}'`, `'${prop.name || propertyKey}'`);
          }
        }

        return this.errorFormatter.call(this, error);
      })
      .join("\n");

    return new AjvValidationError(message, errors);
  }

  /**
   *
   * @param error
   * @returns {string}
   */
  private defaultFormatter(error: AjvErrorObject) {
    let value = "";
    if (this.options.verbose) {
      value = `, value "${error.data}"`;
    }

    return `At ${error.modelName}${error.dataPath}${value} ${error.message}`;
  }
}

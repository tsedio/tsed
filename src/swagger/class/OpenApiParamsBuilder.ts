import {ParamMetadata, ParamRegistry, ParamTypes} from "@tsed/common";
import {deepExtends, nameOf, Type} from "@tsed/core";
import {BaseParameter, BodyParameter, Parameter, PathParameter, Schema} from "swagger-schema-official";
import {swaggerType} from "../utils";
import {OpenApiModelSchemaBuilder} from "./OpenApiModelSchemaBuilder";

export class OpenApiParamsBuilder extends OpenApiModelSchemaBuilder {
  private _parameters: Parameter[] = [];
  private injectedParams: ParamMetadata[];
  private name: string = "";

  constructor(target: Type<any>, methodClassName: string, private pathParameters: PathParameter[] = []) {
    super(target);
    this.name = `${nameOf(target)}${methodClassName.charAt(0).toUpperCase() + methodClassName.slice(1)}`;
    this.injectedParams = ParamRegistry.getParams(target, methodClassName);
  }

  /**
   *
   * @returns {this}
   */
  build(): this {
    let bodySchema: Schema | undefined = undefined;
    let bodyParam: BodyParameter = {} as BodyParameter;
    const pathParams: Map<string, any> = new Map();

    this._parameters = this.injectedParams
      .map((param: ParamMetadata) => {
        if (param.store.get("hidden")) {
          return;
        }

        const inType = param.paramType;

        /*if (inType === undefined || [ParamTypes.SESSION, ParamTypes.COOKIES, ParamTypes.LOCALS].indexOf(inType) > -1) {
          // not a input paramaters
          return;
        }*/

        // Next assign type/schema:
        switch (inType) {
          default:
            return;
          case ParamTypes.BODY:
            const baseParam: BaseParameter = this.createBaseParameter(param);

            if (param.expression) {
              bodySchema = deepExtends(bodySchema || {}, this.createSchemaFromBodyParam(param));
              bodyParam = baseParam;

              return;
            }

            const builder = new OpenApiModelSchemaBuilder(param.type);
            builder.build();

            deepExtends(this._responses, builder.responses);
            deepExtends(this._definitions, builder.definitions);

            return Object.assign(baseParam, {
              schema: {
                $ref: `#/definitions/${param.typeName}`
              }
            });

          case ParamTypes.QUERY:
            return Object.assign(this.createBaseParameter(param), param.store.get("schema"), this.createSchemaFromQueryParam(param));

          case ParamTypes.PATH:
            this.createBaseParameter(param);
            pathParams.set(param.expression as any, param);

            return false;

          case ParamTypes.HEADER:
            // Apply the schema to be backwards compatible...
            return Object.assign(this.createBaseParameter(param), param.store.get("schema"), {
              type: swaggerType(param.type)
            });

          case ParamTypes.FORM_DATA:
            return Object.assign(this.createBaseParameter(param), param.store.get("schema"), {
              name: ((param.expression as string) || "").replace(".0", ""),
              type: "file"
            });
        }
      })
      .filter(o => !!o) as Parameter[];

    if (bodySchema && bodyParam) {
      const model = `${this.name}Payload`;
      bodyParam.schema = {};
      bodyParam.schema["$ref"] = `#/definitions/${model}`;

      this._parameters.push(bodyParam);
      this._definitions[model] = bodySchema;
    }

    this.pathParameters.forEach(pathParam => {
      if (pathParams.has(pathParam.name)) {
        const param = pathParams.get(pathParam.name);

        pathParam = Object.assign(param.store.get("baseParameter") || {}, pathParam, param.store.get("schema"), {
          type: swaggerType(param.type)
        });

        this._parameters.push(pathParam);
      } else {
        this._parameters.push(pathParam);
      }
    });

    return this;
  }

  /**
   *
   * @param {ParamMetadata} param
   * @returns {BaseParameter}
   */
  private createBaseParameter(param: ParamMetadata): BaseParameter {
    const baseParam: BaseParameter = {
      name: param.paramType === ParamTypes.BODY ? ParamTypes.BODY : (param.expression as string),
      in: param.paramType,
      required: !!param.required,
      description: ""
    };

    if (param.required) {
      this._responses[400] = {description: "Missing required parameter"};
    }

    // override defaults with baseParameter
    return deepExtends(baseParam, param.store.get("baseParameter") || {});
  }

  /**
   * Create Properties schema from an expression.
   * @param expression
   */
  private createSchemaFromExpression(expression: string = "") {
    const schema: Schema = {};
    let current = schema;

    if (!!expression) {
      const keys = expression.split(".");
      keys.forEach((key, index) => {
        current.type = "object";
        current.properties = current.properties || {};
        current.properties![key] = {} as Schema;
        current = current.properties![key];
      });
    }

    return {currentProperty: current, schema};
  }

  /**
   *
   * @param model
   * @returns {Schema}
   */
  protected createSchemaFromBodyParam(model: ParamMetadata): Schema {
    let builder;

    const {currentProperty, schema} = this.createSchemaFromExpression(model.expression as string);

    if (model.isClass) {
      builder = new OpenApiModelSchemaBuilder(model.type);
      builder.build();

      deepExtends(this._definitions, builder.definitions);
      deepExtends(this._responses, builder.responses);
    }

    Object.assign(currentProperty, super.createSchema(model));

    return schema;
  }

  /**
   *
   * @param {ParamMetadata} model
   * @returns {Schema}
   */
  protected createSchemaFromQueryParam(model: ParamMetadata): Schema {
    const type = swaggerType(model.type);
    if (model.isCollection) {
      if (model.isArray) {
        return {
          type: "array",
          items: {
            type
          }
        };
      }

      return {
        type: "object",
        additionalProperties: {
          type
        }
      };
    }

    return {
      type
    };
  }

  public get parameters(): Parameter[] {
    return this._parameters;
  }
}

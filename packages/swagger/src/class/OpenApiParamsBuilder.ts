import {getJsonSchema, ParamMetadata, ParamTypes} from "@tsed/common";
import {deepExtends, nameOf, Store, Type} from "@tsed/core";
import {
  BodyParameter,
  FormDataParameter,
  HeaderParameter,
  Parameter,
  PathParameter,
  QueryParameter,
  Schema
} from "swagger-schema-official";
import {swaggerType} from "../utils";
import {OpenApiModelSchemaBuilder} from "./OpenApiModelSchemaBuilder";

function serializeModelToParameter(model: ParamMetadata) {
  const schema = getJsonSchema(model.type);

  return Object.entries(schema.properties!).map(([key, item]: any[]) => {
    return {
      name: [model.expression, key].filter(Boolean).join("."),
      required: (schema.required || []).includes(key),
      ...item
    };
  });
}

export class OpenApiParamsBuilder extends OpenApiModelSchemaBuilder {
  private _parameters: Parameter[] = [];
  private injectedParams: ParamMetadata[];
  private hasBody: boolean = false;
  private hasFormData: boolean = false;
  private name: string = "";

  constructor(target: Type<any>, methodClassName: string, private pathParameters: PathParameter[] = []) {
    super(target);
    this.name = `${nameOf(target)}${methodClassName.charAt(0).toUpperCase() + methodClassName.slice(1)}`;

    this.injectedParams = ParamMetadata.getParams(target, methodClassName).filter(param => {
      if (param.paramType === ParamTypes.BODY) {
        this.hasBody = true;
      }

      if (param.paramType === ParamTypes.FORM_DATA) {
        this.hasFormData = true;
      }

      return !param.store.get("hidden");
    });

    const fromMethod = Store.fromMethod(target, methodClassName);
    const operation = fromMethod.get("operation");
    if (operation && operation.consumes && operation.consumes.indexOf("application/x-www-form-urlencoded") > -1) {
      this.hasFormData = true;
    }
  }

  public get parameters(): Parameter[] {
    return this._parameters;
  }

  /**
   *
   * @returns {this}
   */
  build(): this {
    this._parameters = [];

    this._parameters = this._parameters.concat(this.getInHeaders(), this.getInPathParams(), this.getInQueryParams());

    if (this.hasFormData) {
      this._parameters = this._parameters.concat(this.getInFormData());
    } else if (this.hasBody) {
      this._parameters = this._parameters.concat(this.getInBodyParam());
    }

    return this;
  }

  /**
   *
   * @param param
   * @returns {Schema}
   */
  protected createSchemaFromBodyParam(param: ParamMetadata): Schema {
    let builder;

    const {currentProperty, schema} = this.createSchemaFromExpression(param);

    if (param.isClass) {
      builder = new OpenApiModelSchemaBuilder(param.type);
      builder.build();

      deepExtends(this._definitions, builder.definitions);
      deepExtends(this._responses, builder.responses);
    }

    Object.assign(
      currentProperty,
      super.createSchema({
        schema: param.store.get("schema"),
        type: param.type,
        collectionType: param.collectionType
      })
    );

    return schema;
  }

  /**
   *
   * @param {ParamMetadata} model
   * @returns {Schema}
   */
  protected createSchemaFromQueryParam(model: ParamMetadata): Schema[] {
    const type: any = swaggerType(model.type);
    if (model.isCollection) {
      if (model.isArray) {
        return [
          {
            type: "array",
            collectionFormat: "multi",
            items: {
              type
            }
          }
        ] as any[];
      }

      return [
        {
          type: "object",
          additionalProperties: {
            type
          }
        }
      ];
    }

    if (model.isClass) {
      return serializeModelToParameter(model);
    }

    return [
      {
        type
      }
    ];
  }

  /**
   *
   * @returns {HeaderParameter[]}
   */
  private getInHeaders(): HeaderParameter[] {
    return this.injectedParams
      .filter((param: ParamMetadata) => param.paramType === ParamTypes.HEADER)
      .map(param => {
        return Object.assign({}, param.store.get("baseParameter"), {
          in: "header",
          name: param.expression,
          type: swaggerType(param.type),
          required: param.required
        });
      });
  }

  /**
   *
   * @returns {any[]}
   */
  private getInFormData(): FormDataParameter[] {
    return this.injectedParams
      .filter((param: ParamMetadata) => param.paramType === ParamTypes.BODY || param.paramType === ParamTypes.FORM_DATA)
      .map(param => {
        const name = ((param.expression as string) || "").replace(".0", "").replace(/^files./, "");

        const type = param.paramType === ParamTypes.FORM_DATA ? "file" : swaggerType(param.paramType);

        return Object.assign({}, param.store.get("baseParameter"), {
          in: "formData",
          name,
          required: param.required,
          type
        });
      });
  }

  /**
   *
   * @returns {ParamMetadata | undefined}
   */
  private getInBodyParam(): BodyParameter {
    const params = this.injectedParams.filter((param: ParamMetadata) => param.paramType === ParamTypes.BODY);

    const param = params.find((param: ParamMetadata) => !param.expression);

    if (param) {
      const builder = new OpenApiModelSchemaBuilder(param.type);
      builder.build();

      deepExtends(this._responses, builder.responses);

      this._definitions = {
        ...this._definitions,
        ...builder.definitions
      };

      if (param.required) {
        this.addResponse400();
      }

      return Object.assign({description: ""}, param.store.get("baseParameter"), {
        in: "body",
        name: "body",
        required: !!param.required,
        schema: this.createSchema({
          schema: param.store.get("schema"),
          type: param.type,
          collectionType: param.collectionType
        })
      });
    }

    let required = false;
    const model = `${this.name}Payload`;
    const schema = params.reduce((acc: any, param) => {
      deepExtends(acc, this.createSchemaFromBodyParam(param));

      if (param.required) {
        this.addResponse400();
        required = true;
      }

      return acc;
    }, {});

    this._definitions[model] = schema;

    return {
      in: "body",
      name: "body",
      required,
      description: "",
      schema: {
        $ref: `#/definitions/${model}`
      }
    };
  }

  /**
   *
   * @returns {PathParameter[]}
   */
  private getInPathParams(): PathParameter[] {
    const inPathParams: PathParameter[] = [];
    const pathParams: Map<string, any> = new Map();

    this.injectedParams.forEach((param: ParamMetadata) => {
      if (param.paramType === ParamTypes.PATH) {
        pathParams.set(param.expression as any, param);
      }
    });

    this.pathParameters.forEach(pathParam => {
      if (pathParams.has(pathParam.name)) {
        const param = pathParams.get(pathParam.name);

        pathParam = Object.assign({}, pathParam, param.store.get("baseParameter") || {}, {
          type: swaggerType(param.type)
        });
      }

      inPathParams.push(Object.assign(pathParam, {required: true}));
    });

    return inPathParams;
  }

  /**
   *
   * @returns {HeaderParameter[]}
   */
  private getInQueryParams(): QueryParameter[] {
    return this.injectedParams
      .filter((param: ParamMetadata) => param.paramType === ParamTypes.QUERY)
      .reduce((params, param) => {
        if (param.required) {
          this.addResponse400();
        }

        return [
          ...params,
          ...this.createSchemaFromQueryParam(param).map(item => {
            return {
              ...(param.store.get<any>("baseParameter") || {}),
              in: "query",
              name: param.expression,
              required: Boolean(param.required),
              ...item
            };
          })
        ];
      }, []);
  }

  /**
   * Create Properties schema from an expression.
   * @param param
   */
  private createSchemaFromExpression(param: ParamMetadata) {
    const schema: Schema = {};
    let current = schema;
    const expression: string = (param.expression as any) || "";

    if (!!expression) {
      const keys = expression.split(".");
      keys.forEach(key => {
        current.type = "object";
        current.properties = current.properties || {};
        current.properties![key] = {} as Schema;

        if (param.required) {
          current.required = [key];
        }

        current = current.properties![key];
      });
    }

    return {currentProperty: current, schema};
  }

  private addResponse400() {
    this._responses[400] = {description: "Missing required parameter"};
  }
}

import {ancestorsOf, DecoratorTypes, isClass, isMethodDescriptor, Metadata, prototypeOf, Type} from "@tsed/core";

import {JsonEntityComponent} from "../decorators/config/jsonEntityComponent.js";
import {JsonEntityStore, JsonEntityStoreOptions} from "./JsonEntityStore.js";
import type {JsonMethodStore} from "./JsonMethodStore.js";
import {JsonParameter} from "./JsonParameter.js";

/**
 * Configuration options for creating a JsonParameterStore.
 *
 * @public
 */
export interface JsonParameterStoreOptions extends JsonEntityStoreOptions {
  dataPath?: string;
  paramType?: string;
  expression?: string;
}

/**
 * Interface for pipe classes that transform parameter values.
 *
 * Pipes are called by the framework to transform or validate parameter values
 * before they reach the method handler.
 *
 * ### Usage
 *
 * ```typescript
 * class ParseIntPipe implements PipeMethods<string, number> {
 *   transform(value: string, metadata: JsonParameterStore): number {
 *     return parseInt(value, 10);
 *   }
 * }
 * ```
 *
 * @typeParam T - The input type
 * @typeParam R - The output type after transformation
 *
 * @public
 */
export interface PipeMethods<T = any, R = any> {
  transform(value: T, metadata: JsonParameterStore): R;
}

/**
 * Store for method parameter metadata and schema information.
 *
 * JsonParameterStore manages metadata for method parameters decorated with decorators
 * like `@BodyParams()`, `@PathParams()`, `@QueryParams()`, etc. It handles parameter
 * validation, transformation pipes, and OpenAPI parameter generation.
 *
 * ### Responsibilities
 *
 * - **Parameter Definition**: Maintains JsonParameter for OpenAPI spec generation
 * - **Type Resolution**: Resolves parameter types from TypeScript metadata
 * - **Validation**: Manages required/optional state and validation rules
 * - **Transformation**: Coordinates pipe execution for value transformation
 * - **Location Tracking**: Stores where the parameter comes from (path, query, body, etc.)
 *
 * ### Usage
 *
 * ```typescript
 * // Get parameter store
 * const paramStore = JsonParameterStore.get(MyController, "myMethod", 0);
 *
 * // Access parameter definition
 * const parameter = paramStore.parameter;
 *
 * // Check if required
 * const isRequired = paramStore.required;
 *
 * // Get all parameters for a method
 * const params = JsonParameterStore.getParams(MyController, "myMethod");
 * ```
 *
 * ### Parameter Types
 *
 * Parameters can come from different locations:
 * - **path**: URL path parameters (`/users/:id`)
 * - **query**: Query string parameters (`?page=1`)
 * - **body**: Request body
 * - **header**: HTTP headers
 * - **cookies**: Cookie values
 * - **files**: File uploads
 *
 * ### Validation
 *
 * The store provides validation helpers:
 * - `required`: Marks parameter as required
 * - `allowedRequiredValues`: Values that bypass required check
 * - `isRequired(value)`: Checks if a value satisfies required constraint
 *
 * ### Transformation Pipes
 *
 * Parameters can have transformation pipes that process values:
 * ```typescript
 * @Controller("/")
 * class MyController {
 *   @Get("/:id")
 *   get(@PathParams("id") @UsePipe(ParseIntPipe) id: number) {
 *     // id is automatically transformed to number
 *   }
 * }
 * ```
 *
 * ### Expression Binding
 *
 * Parameters can use expressions to extract nested values:
 * ```typescript
 * @BodyParams("user.address.city") city: string
 * // Extracts: request.body.user.address.city
 * ```
 *
 * @public
 */
@JsonEntityComponent(DecoratorTypes.PARAM)
export class JsonParameterStore extends JsonEntityStore {
  // TODO check this after migration
  public paramType = "";
  public expression = "";
  public dataPath = "";
  /**
   * Define pipes can be called by the framework to transform input parameter
   */
  public pipes: Type<PipeMethods>[];
  /**
   * Ref to JsonParameter when the decorated object is a parameter.
   */
  readonly parameter: JsonParameter = new JsonParameter();
  readonly parent: JsonMethodStore = JsonEntityStore.fromMethod(this.target, this.propertyKey);

  constructor(options: JsonParameterStoreOptions) {
    super(options);
    this.pipes = options.pipes || [];
    this.paramType = options.paramType || this.paramType;
    this.expression = options.expression || this.expression;
    this.dataPath = options.dataPath || this.dataPath;
  }

  /**
   * Return the required state.
   * @returns {boolean}
   */
  get required(): boolean {
    return !!this.parameter.get("required");
  }

  set required(value: boolean) {
    this.parameter.required(value);
  }

  get allowedRequiredValues() {
    return this.schema.getAllowedRequiredValues();
  }

  get schema() {
    return this.parameter.schema();
  }

  static getParams<T extends JsonParameterStore = JsonParameterStore>(target: Type<any>, propertyKey: string | symbol): T[] {
    const params: T[] = [];

    const klass = ancestorsOf(target)
      .reverse()
      .find((target) => {
        return isMethodDescriptor(target, propertyKey) && JsonEntityStore.fromMethod(target, propertyKey).children.size;
      });

    if (klass) {
      JsonEntityStore.fromMethod(klass, propertyKey).children.forEach((param: JsonParameterStore, index: string | number) => {
        params[+index] = param as T;
      });

      return params;
    }

    return [];
  }

  static get(target: Type<any>, propertyKey: string | symbol, index: number) {
    return JsonEntityStore.from<JsonParameterStore>(prototypeOf(target), propertyKey, index);
  }

  /**
   * Check precondition between value, required and allowedRequiredValues to know if the entity is required.
   * @param value
   * @returns {boolean}
   */
  isRequired(value: any): boolean {
    return this.required && [undefined, null, ""].includes(value) && !this.allowedRequiredValues.includes(value);
  }

  protected build() {
    if (!this._type) {
      const type: any = Metadata.getParamTypes(prototypeOf(this.target), this.propertyKey)[this.index!];

      this.buildType(type);
    }

    this._type = this._type || Object;
    this.parent.children.set(this.index!, this);
    this.parent.operation.addParameter(this.index as number, this.parameter);

    if (this.collectionType) {
      this.parameter.schema().type(this.collectionType);
    }

    if (isClass(this._type)) {
      this.parameter.schema().itemSchema(this._type);
    } else {
      this.parameter.itemSchema().type(this._type);
    }
  }
}

/**
 * @alias JsonParameterStore
 */
export type ParamMetadata = JsonParameterStore;
export const ParamMetadata = JsonParameterStore;

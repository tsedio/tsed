import {ancestorsOf, DecoratorTypes, isClass, isMethodDescriptor, Metadata, prototypeOf, Type} from "@tsed/core";

import {JsonEntityComponent} from "../decorators/config/jsonEntityComponent.js";
import {JsonEntityStore, JsonEntityStoreOptions} from "./JsonEntityStore.js";
import type {JsonMethodStore} from "./JsonMethodStore.js";
import {JsonParameter} from "./JsonParameter.js";

export interface JsonParameterStoreOptions extends JsonEntityStoreOptions {
  dataPath?: string;
  paramType?: string;
  expression?: string;
}

export interface PipeMethods<T = any, R = any> {
  transform(value: T, metadata: JsonParameterStore): R;
}

@JsonEntityComponent(DecoratorTypes.PARAM)
export class JsonParameterStore extends JsonEntityStore {
  public paramType: string;
  public expression: string;
  public dataPath: string;
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

  get nestedGenerics(): Type<any>[][] {
    return this.parameter.nestedGenerics;
  }

  set nestedGenerics(nestedGenerics: Type<any>[][]) {
    this.parameter.nestedGenerics = nestedGenerics;
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
    return this.schema.$allow;
  }

  get schema() {
    return this.parameter.$schema;
  }

  static getParams<T extends JsonParameterStore = JsonParameterStore>(target: Type<any>, propertyKey: string | symbol): T[] {
    const params: T[] = [];

    const klass = ancestorsOf(target)
      .reverse()
      .find((target) => {
        return isMethodDescriptor(target, propertyKey) && JsonEntityStore.fromMethod(target, propertyKey).children.size;
      });

    if (klass) {
      JsonEntityStore.fromMethod(klass, propertyKey).children.forEach((param: T, index) => {
        params[+index] = param;
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
      this.parameter.itemSchema(JsonEntityStore.from(this._type).schema);
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

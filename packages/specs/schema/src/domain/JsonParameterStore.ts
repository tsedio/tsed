import {
  ancestorsOf,
  DecoratorTypes,
  descriptorOf,
  isClass,
  isCollection,
  isMethodDescriptor,
  Metadata,
  prototypeOf,
  Store,
  Type
} from "@tsed/core";
import {JsonEntityStore} from "./JsonEntityStore";
import type {JsonMethodStore} from "./JsonMethodStore";
import {JsonParameter} from "./JsonParameter";
import {JsonSchema} from "./JsonSchema";
import {JsonEntityComponent} from "../decorators/config/jsonEntityComponent";

@JsonEntityComponent(DecoratorTypes.PARAM)
export class JsonParameterStore extends JsonEntityStore {
  /**
   * Ref to JsonParameter when the decorated object is a parameter.
   */
  readonly parameter: JsonParameter = new JsonParameter();
  readonly parent: JsonMethodStore = JsonEntityStore.fromMethod(this.target, this.propertyKey);

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

  static getParams<T extends JsonParameterStore = JsonParameterStore>(target: Type<any>, propertyKey: string | symbol): T[] {
    const params: T[] = [];

    const klass = ancestorsOf(target)
      .reverse()
      .find((target) => {
        return isMethodDescriptor(target, propertyKey) && JsonEntityStore.fromMethod(target, propertyKey).children.size;
      });

    if (!klass) {
      return [];
    }

    JsonEntityStore.fromMethod(klass, propertyKey).children.forEach((param: T, index) => {
      params[+index] = param;
    });

    return params;
  }

  /**
   * Check precondition between value, required and allowedRequiredValues to know if the entity is required.
   * @param value
   * @returns {boolean}
   */
  isRequired(value: any): boolean {
    return this.required && [undefined, null, ""].includes(value) && !this.allowedRequiredValues.includes(value);
  }

  protected getSchema(type: any) {
    if (isCollection(type) || !isClass(type)) {
      return JsonSchema.from({
        type
      });
    }

    return JsonEntityStore.from(type).schema;
  }

  protected build() {
    if (!this._type) {
      const type: any = Metadata.getParamTypes(prototypeOf(this.target), this.propertyKey)[this.index!];

      this.buildType(type);
    }

    this._type = this._type || Object;

    if (!this._schema) {
      this.parent.children.set(this.index!, this);

      this._schema = this.getSchema(this.collectionType || this.type);

      this.parameter.schema(this._schema);

      if (this.collectionType) {
        this._schema.itemSchema(this.getSchema(this.type));
      }

      this.parent.operation.addParameter(this.index as number, this.parameter);
    }
  }
}

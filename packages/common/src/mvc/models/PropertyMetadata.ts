import {ancestorsOf, Enumerable, Storable, Store, Type} from "@tsed/core";
import {IPropertyOptions} from "../../converters/interfaces/IPropertyOptions";
import {JsonSchema} from "../../jsonschema/class/JsonSchema";
import {JsonSchemesRegistry} from "../../jsonschema/registries/JsonSchemesRegistry";

export class PropertyMetadata extends Storable implements IPropertyOptions {
  /**
   * Allowed value when the entity is required.
   * @type {Array}
   */
  @Enumerable()
  public allowedRequiredValues: any[] = [];

  @Enumerable()
  public ignoreProperty: boolean = false;

  @Enumerable()
  public onSerialize: Function;

  @Enumerable()
  public onDeserialize: Function;

  constructor(target: any, propertyKey: any) {
    super(target, propertyKey);
    this.createJsonSchema();
  }

  /**
   *
   * @returns {Type<any>}
   */
  get type(): Type<any> {
    return this._type;
  }

  /**
   *
   * @param value
   */
  set type(value: Type<any>) {
    this._type = value || Object;
    this.createJsonSchema();
  }

  /**
   *
   * @returns {JsonSchema}
   */
  get schema(): JsonSchema {
    return this.store.get("schema");
  }

  /**
   * Return the required state.
   * @returns {boolean}
   */
  get required(): boolean {
    return JsonSchemesRegistry.required(this.target, this.name || (this.propertyKey as string));
  }

  /**
   * Change the state of the required data.
   * @param value
   */
  set required(value: boolean) {
    JsonSchemesRegistry.required(this.target, this.name || (this.propertyKey as string), value);
  }

  /**
   *
   * @param target
   * @param propertyKey
   * @returns {PropertyMetadata}
   */
  static get(target: Type<any>, propertyKey: string | symbol): PropertyMetadata {
    const properties = this.getOwnProperties(target);

    if (!properties.has(propertyKey)) {
      this.set(target, propertyKey, new PropertyMetadata(target, propertyKey));
    }

    return properties.get(propertyKey)!;
  }

  /**
   *
   * @param target
   * @param options
   * @returns {Array}
   */
  static getProperties(target: Type<any>, options: Partial<{withIgnoredProps: boolean}> = {}): Map<string | symbol, PropertyMetadata> {
    const map = new Map<string | symbol, PropertyMetadata>();
    const ignored: string[] = [];

    ancestorsOf(target).forEach(klass => {
      this.getOwnProperties(klass).forEach((v: PropertyMetadata, k: string) => {
        /* istanbul ignore next */
        if (ignored.indexOf(k) !== -1) {
          return;
        }
        if (options.withIgnoredProps) {
          map.set(k, v);
        } else {
          if (!v.ignoreProperty) {
            map.set(k, v);
          } else {
            map.delete(k);
            ignored.push(k);
          }
        }
      });
    });

    return map;
  }

  /**
   *
   * @param {Type<any>} target
   * @returns {Map<string | symbol, PropertyMetadata>}
   */
  static getOwnProperties(target: Type<any>): Map<string | symbol, PropertyMetadata> {
    const store = Store.from(target);

    if (!store.has("properties")) {
      store.set("properties", new Map<string | symbol, PropertyMetadata>());
    }

    return store.get("properties");
  }

  /**
   *
   * @param target
   * @param propertyKey
   * @param property
   */
  static set(target: Type<any>, propertyKey: string | symbol, property: PropertyMetadata): void {
    const properties = this.getOwnProperties(target);

    properties.set(propertyKey, property);
  }

  /**
   * Check precondition between value, required and allowedRequiredValues to know if the entity is required.
   * @param value
   * @returns {boolean}
   */
  isRequired(value: any): boolean {
    return this.required && [undefined, null, ""].includes(value) && !this.allowedRequiredValues.includes(value);
  }

  private createJsonSchema() {
    this.store.set("schema", JsonSchemesRegistry.property(this.target, this.propertyKey as string, this.type, this.collectionType));
  }
}

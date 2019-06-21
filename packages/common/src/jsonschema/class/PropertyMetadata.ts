import {Enumerable, Storable, Type} from "@tsed/core";
import {IPropertyOptions} from "../../converters/interfaces/IPropertyOptions";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";
import {JsonSchema} from "./JsonSchema";

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

  private createJsonSchema() {
    this.store.set("schema", JsonSchemesRegistry.property(this.target, this.propertyKey as string, this.type, this.collectionType));
  }
}

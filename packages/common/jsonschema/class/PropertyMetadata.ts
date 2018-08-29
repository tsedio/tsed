import {NotEnumerable, Storable, Type} from "@tsed/core";
import {IPropertyOptions} from "../../converters/interfaces/IPropertyOptions";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";
import {JsonSchema} from "./JsonSchema";

export class PropertyMetadata extends Storable implements IPropertyOptions {
  /**
   * Allowed value when the entity is required.
   * @type {Array}
   */
  @NotEnumerable()
  private _allowedRequiredValues: any[] = [];

  @NotEnumerable()
  private _ignoreProperty: boolean = false;

  constructor(target: any, propertyKey: any) {
    super(target, propertyKey);
    this.store.set("schema", JsonSchemesRegistry.property(this.target, this.propertyKey as string, this.type, this.collectionType));
  }

  /**
   *
   * @param value
   */
  set type(value: Type<any>) {
    this._type = value || Object;
    this.store.set("schema", JsonSchemesRegistry.property(this.target, this.propertyKey as string, this.type, this.collectionType));
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
   * Return the allowed values.
   * @returns {any[]}
   */
  get allowedRequiredValues(): any[] {
    return this._allowedRequiredValues;
  }

  /**
   * Set the allowed values when the value is required.
   * @param {any[]} value
   */
  set allowedRequiredValues(value: any[]) {
    this._allowedRequiredValues = value;
  }

  /**
   *
   * @returns {boolean}
   */
  get ignoreProperty(): boolean {
    return this._ignoreProperty;
  }

  /**
   *
   * @param {boolean} value
   */
  set ignoreProperty(value: boolean) {
    this._ignoreProperty = value;
  }

  /**
   *
   * @param value
   * @returns {boolean}
   * @deprecated
   */
  isValidRequiredValue(value: any): boolean {
    if (this.required) {
      if (value === undefined || value === null || value === "") {
        if (this.allowedRequiredValues.indexOf(value) === -1) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   *
   * @param value
   * @returns {boolean}
   */
  isRequired(value: any): boolean {
    return this.required && [undefined, null, ""].indexOf(value) > -1 && this.allowedRequiredValues.indexOf(value) === -1;
  }
}

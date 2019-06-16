import {Enumerable, nameOf, NotEnumerable, Storable, Type} from "@tsed/core";
import {IParamOptions} from "../interfaces";
import {ParamTypes} from "../interfaces/ParamTypes";

export class ParamMetadata extends Storable implements IParamOptions<any> {
  /**
   *
   */
  @Enumerable()
  public expression: string | RegExp;
  /**
   *
   */
  @Enumerable()
  public paramType: ParamTypes;
  /**
   *
   * @type {boolean}
   */
  @Enumerable()
  public useValidation: boolean = false;
  /**
   *
   * @type {boolean}
   */
  @Enumerable()
  public useConverter: boolean = true;
  /**
   *
   */
  @NotEnumerable()
  protected _service: string | Type<any> | symbol;

  /**
   *
   * @returns {symbol}
   */
  get service(): Type<any> | symbol {
    return this._service as any;
  }

  /**
   *
   * @param value
   */
  set service(value: Type<any> | symbol) {
    this._service = value;
    this.name = nameOf(value);
  }

  /**
   *
   * @returns {{service: (string|symbol), name: string, expression: string, required: boolean, use: undefined, baseType: undefined}}
   */
  toJSON() {
    return {
      service: nameOf(this._service),
      name: this.name,
      expression: this.expression,
      required: this.required,
      use: this.typeName,
      baseType: this.collectionName
    };
  }
}

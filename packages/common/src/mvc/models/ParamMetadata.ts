import {Enumerable, Storable, Type} from "@tsed/core";
import {IParamOptions} from "../interfaces";
import {ParamTypes} from "./ParamTypes";

export class ParamMetadata extends Storable implements IParamOptions<any> {
  /**
   *
   */
  @Enumerable()
  public expression: string;
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
  @Enumerable()
  public service: string | Type<any> | symbol;
}

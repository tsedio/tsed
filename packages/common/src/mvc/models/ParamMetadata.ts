import {Enumerable, Storable, Type} from "@tsed/core";
import {IParamOptions} from "../interfaces";
import {ParamTypes} from "./ParamTypes";

export class ParamMetadata extends Storable implements IParamOptions<any> {
  public filters: any[] = [];
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
  public useConverter: boolean = false;

  /**
   *
   */
  @Enumerable()
  public service: string | Type<any> | ParamTypes;
}

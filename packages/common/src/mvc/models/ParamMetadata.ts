import {Enumerable, Storable, Type} from "@tsed/core";
import {ParamTypes} from "./ParamTypes";

export interface IParamConstructorOptions {
  target: Type<any>;
  propertyKey: string | symbol;
  index: number;
  service?: string | Type<any> | ParamTypes;
  required?: boolean;
  expression?: string;
  useType?: Type<any>;
  useConverter?: boolean;
  useValidation?: boolean;
  paramType?: string | ParamTypes;
}

export class ParamMetadata extends Storable implements IParamConstructorOptions {
  /**
   *
   */
  @Enumerable()
  public expression: string;
  /**
   *
   */
  @Enumerable()
  public paramType: string | ParamTypes;
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

  constructor(options: IParamConstructorOptions) {
    super(options.target, options.propertyKey, options.index);

    const {expression, paramType, useValidation, useConverter, service} = options;

    this.expression = expression || this.expression;
    this.paramType = paramType || this.paramType;
    this.useValidation = Boolean(useValidation);
    this.useConverter = Boolean(useConverter);
    this.service = service || this.service;
  }
}

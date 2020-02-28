import {Enumerable, Storable, Type} from "@tsed/core";
import {IFilter} from "../interfaces/IFilter";
import {ParamTypes} from "./ParamTypes";

export interface IParamConstructorOptions {
  target?: Type<any>;
  propertyKey?: string | symbol;
  index: number;
  required?: boolean;
  expression?: string;
  useType?: Type<any>;
  /**
   * @deprecated use pipe instead
   */
  filter?: Type<IFilter>;
  paramType?: string | ParamTypes;
  pipes?: Type<IPipe>[];
}

export interface IPipe {
  transform(value: any, context: ParamMetadata): any;
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

  @Enumerable()
  pipes: Type<IPipe>[] = [];

  @Enumerable()
  filter?: Type<IFilter>;

  constructor(options: IParamConstructorOptions) {
    super(options.target as Type<any>, options.propertyKey!, options.index);

    const {expression, paramType, filter, pipes} = options;

    this.expression = expression || this.expression;
    this.paramType = paramType || this.paramType;
    this.filter = filter;
    this.pipes = pipes || [];
  }

  get service(): string | Type<any> | ParamTypes {
    return this.filter || this.paramType;
  }

  set service(service: string | Type<any> | ParamTypes) {
    if (typeof service === "string") {
      this.paramType = service;
    } else {
      this.filter = service;
    }
  }
}

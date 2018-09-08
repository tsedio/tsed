import {Type} from "@tsed/core";

/**
 *
 */
export interface IInjectableMethod<T> {
  target?: Type<T>;
  methodName?: string;
  designParamTypes?: any[];
  locals?: Map<Function, any>;
}

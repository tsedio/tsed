import type {InterceptorContext, InterceptorNext} from "./InterceptorContext.js";

export interface InterceptorMethods {
  intercept(context: InterceptorContext, next?: InterceptorNext): any;
}

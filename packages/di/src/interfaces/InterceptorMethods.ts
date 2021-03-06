import {InterceptorContext, InterceptorNext} from "./InterceptorContext";

export interface InterceptorMethods {
  intercept?(context: InterceptorContext, next?: InterceptorNext): any;
}

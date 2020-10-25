import {InterceptorContext, InterceptorNext} from "./InterceptorContext";

export interface InterceptorMethods {
  intercept?(context: InterceptorContext<any>, next?: InterceptorNext): any;
}

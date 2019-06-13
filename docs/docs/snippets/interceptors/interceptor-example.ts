import {IInterceptor, IInterceptorContext, IInterceptorNextHandler, Interceptor} from "@tsed/common";

@Interceptor()
export class MyInterceptor implements IInterceptor {
  /**
   * ctx: The context that holds the dynamic data related to the method execution and the proceed method
   * to proceed with the original method execution
   *
   * opts: Static params that can be provided when the interceptor is attached to a specific method
   */
  intercept(context: IInterceptorContext<any>, next: IInterceptorNextHandler) {
    console.log(`the method ${context.propertyKey} will be executed with args ${context.args} and static data ${context.options}`);
    // let the original method proceed
    const result = context.next();

    console.log(`the method was executed, and returned ${result}`);

    // must return the returned value back to the caller
    // the retValue might be a promise in which case you can use .then to chain other code logic
    // or you can use async aroundInvoke and await ctx.proceed() to execute the code in linear fashion
    return result;
  }
}

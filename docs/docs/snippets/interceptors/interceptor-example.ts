import {IInterceptor, IInterceptorContext, IInterceptorNextHandler, Interceptor} from "@tsed/common";

@Interceptor()
export class MyInterceptor implements IInterceptor {
  /**
   * ctx: The context that holds the dynamic data related to the method execution and the proceed method
   * to proceed with the original method execution
   *
   * opts: Static params that can be provided when the interceptor is attached to a specific method
   */
  async intercept(context: IInterceptorContext<any>, next: IInterceptorNextHandler) {
    console.log(`the method ${context.propertyKey} will be executed with args ${context.args} and static data ${context.options}`);
    // let the original method by calling next function
    const result = await next();

    console.log(`the method was executed, and returned ${result}`);

    // must return the returned value back to the caller
    return result;
  }
}

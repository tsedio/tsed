# Interceptors

Creating and consuming an interceptor is two-step process.

1. Create and annotate the interceptor class that will intercept calls to service methods
2. Decide which methods will be intercepted by which interceptor

## Decorators

<ApiList query="module == '@tsed/di' && symbolType === 'decorator'" />

## Interceptor class

To create interceptor class you need to implement he `IInterceptor` interface and implement the
`aroundInvoke(ctx: IInterceptorContext)` method, and use the `@Interceptor()` annotation to register your interceptor class. Inside your `src/interceptors/MyInterceptor.ts` folder create the following simple interceptor.

```typescript
import { IInterceptor, IInterceptorContext, Interceptor, InjectorService } from '@tsed/common';

@Interceptor()
export class MyInterceptor implements IInterceptor {
    // you can inject other components as usual
    constructor(injSrv: InjectorService) {
        // do some logic
    }

    /**
     * ctx: The context that holds the dynamic data related to the method execution and the proceed method 
     * to proceed with the original method execution 
     * 
     * opts: Static params that can be provided when the interceptor is attached to a specific method 
     */
    aroundInvoke(ctx: IInterceptorContext<any>, opts?: any) {
        console.log(`the method ${ctx.method} will be executed with args ${ctx.args} and static data ${opts}`);
        // let the original method proceed
        const retValue = ctx.proceed();

        console.log(`the method was executed, and returned ${retValue}`);

        // must return the returned value back to the caller
        // the retValue might be a promise in which case you can use .then to chain other code logic
        // or you can use async aroundInvoke and await ctx.proceed() to execute the code in linear fashion
        return retValue;
    }
}
```

## Use the interceptor

Now that your interceptor logic is in place you can use it in any other service. You need to use the `@Intercept(InterceptorClass, opts)` annotation to register which interceptor should be used for the specific method you want to intercept. An example service in `src/services/MyService.ts`:

```typescript
import { Intercept } from '@tsed/common';
import { MyInterceptor } from '../interceptors/MyInterceptor';

export class MyService {
    // MyInterceptor is going to be used to intercept this method whenever called
    // 'simple data' is static data that will be passed as second arg the the interceptor aroundInvoke
    // this can be any data, you can pass array or object for that matter
    @Intercept(MyInterceptor, 'simple data')
    mySimpleMethod() {
        console.log('the simple method is executed');
    }
}
```

If the service method is executed like `myServiceInstance.mySimpleMethod()` we will get the following output:

```bash
the method mySimpleMethod will be executed with args and static data simple data
the simple method is executed
the method was executed, and returned undefined
```

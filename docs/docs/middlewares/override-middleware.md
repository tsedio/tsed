# Override a Middleware
> Beta feature. Need improvement. You can contribute !

The decorator [@OverrideMiddleware](api/common/mvc/overridemiddleware.md) give you a solution to 
override some embed Ts.ED middleware like the [SendResponseMiddleware](api/common/mvc/sendresponsemiddleware.md).

For example, this is the current implementation of the [SendResponseMiddleware](api/common/mvc/sendresponsemiddleware.md).
```typescript
@Middleware()
export class SendResponseMiddleware implements IMiddleware {

    constructor(private converterService: ConverterService) {

    }

    public use(@ResponseData() data: any, @Response() response: Express.Response) {

        if (response.headersSent) {
            return;
        }

        const type = typeof data;

        if (data === undefined) {
            response.send("");
        } else if (data === null || ["number", "boolean", "string"].indexOf(type) > -1) {
            response.send(String(data));
        } else {

            response.setHeader("Content-Type", "text/json");
            response.json(this.converterService.serialize(data));

        }

    }
}

```

But for a certain reason, this implementation isn't enough to meet your needs.

With [@OverrideMiddleware](api/common/mvc/overridemiddleware.md) it's now possible to change the default implementation like
this:


```typescript
@OverrideMiddleware(SendResponseMiddleware)
export class MySendResponseMiddleware extends SendResponseMiddleware {
 
    constructor(protected converterService: ConverterService) {
        super(converterService)
    }
    
    public use(@ResponseData() data: any, @Response() response: Express.Response) {
    
        // ... your instruction
    
    }
}
```
> Extends SendResponseMiddleware is optional. 

And that all !


> All Ts.ED middlewares can be overrided. You can find the complete list [here](api/index.md?query=keywords_Middleware|type_class).


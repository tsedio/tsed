# Filters
> Beta feature. Need improvement. You can contribute !

Filters feature let you to create a custom decorators that will be 
used on the methods parameters like [@BodyParams](api/common/mvc/bodyparams.md) 
or [@Locals](api/common/mvc/locals.md).

#### Example

This example show you, how you can implement a filter and decorator to use these, on a method Controller.
In this case, we need to retrieve the body content from an Express.Request.

So to do that, you must create a class and annotate it with the [@Filter](api/common/filters/filter.md) 
decorator and in option, implement the [IFilter](api/common/filters/ifilter.md) interface:

```typescript
@Filter()
export class BodyParamsFilter implements IFilter {

    constructor(private parseService: ParseService) {
    }

    transform(expression: string, request, response) {
        return this.parseService.eval(expression, request["body"]);
    }
}
```

Then create the decorator. This decorator will be used on a controller method.

```typescript
export function BodyParams(expression?: string | any, useType?: any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useFilter(BodyParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}
```
> To link the decorator with BodyParamsFilter, you must used the [ParamRegistry](api/common/mvc/paramregistry.md) API.


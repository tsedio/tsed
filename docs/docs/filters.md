# Filters

Filters feature lets you create a custom decorators that will be 
used on the methods parameters like @@BodyParams@@ or @@Locals@@.

### Example

This example show you, how you can implement a filter and decorator to use these, on a method Controller.
In this case, we need to retrieve the body content from an Express.Request.

So to do that, you must create a class and annotate it with the @@Filter@@
decorator and in option, implement the @@IFilter@@ interface:

```typescript
import {Filter, IFilter, ParseService} from "@tsed/common";

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
import {Type} from "@tsed/core";
import {BodyParamsFilter} from "../components/BodyParamsFilter";
import {IParamOptions} from "../interfaces/IParamOptions";
import {ParamTypes} from "../interfaces/ParamTypes";
import {UseFilter} from "./useFilter";
import {mapParamsOptions} from "./utils/mapParamsOptions";

export function BodyParams(expression: string): ParameterDecorator;
export function BodyParams(useType: Type<any> | Function): ParameterDecorator;
export function BodyParams(options: IParamOptions<any>): ParameterDecorator;
export function BodyParams(): ParameterDecorator;
export function BodyParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = true, useValidation = true} = mapParamsOptions(args);

  return UseFilter(BodyParamsFilter, {
    expression,
    useType,
    useConverter,
    useValidation,
    paramType: ParamTypes.BODY
  });
}

```

::: tip
To link the decorator with BodyParamsFilter, you must used the @@ParamRegistry@@ API.
:::

## Built-in filters

<ApiList query="symbolName.endsWith('Filter') && symbolType === 'class'" />

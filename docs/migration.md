


## GlobalErrorHandler middleware to Exception filter

[Exception filter]() is the 

To facilitate your migration, remove the line where you add you custom middleware in the server:

```typescript
$afterRoutesInit() {
  this.app.use(CustomGlobalErrorHandlerMiddleware); // remove this
}
```

Then, use the @@OverrideProvider@@ decorator over your custom middleware:

```typescript
import {OverrideProvider} from "@tsed/di";
import {GlobalErrorHandlerMiddleware} from "@tsed/common";

@OverrideProvider(GlobalErrorHandlerMiddleware)
export class CustomGlobalErrorHandlerMiddleware extends GlobalErrorHandlerMiddleware {

}
```

Now you are able to create your own exception filter. Start with the HttpException example:

<<< @/docs/docs/snippets/exceptions/http-exception-filter.ts

Then try with another error type and finally, remove your custom middleware. 
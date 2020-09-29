---
prev: /docs/configuration.md
next: /docs/controllers.html
otherTopics: true
meta:
 - name: description
   content: Migrate Ts.ED application from v5 to v6. Ts.ED is built on top of Express and uses TypeScript language.
 - name: keywords
   content: migration getting started ts.ed express typescript node.js javascript decorators mvc class models
---
# Migrate from v5

## What's news ?

## Breaking changes


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
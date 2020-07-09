# Endpoint error middleware

@@MiddlewareError@@ lets you handle all errors when you add your middleware on an Endpoint.

Create your middleware error:
```typescript
import {IMiddlewareError, Middleware, Request, Response, Next, Err} from "@tsed/common";
import {$log} from "@tsed/logger";

@Middleware()
export default class ErrorMiddleware implements IMiddlewareError {

    use(
        @Err() error: any,
        @Req() request: Req,
        @Res() response: Res,
        @Next() next: Next
    ): any {

        if (response.headersSent) {
            return next(error);
        }
        const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

        if (error instanceof Exception) {
            $log.error("" + error);
            response.status(error.status).send(toHTML(error.message));
            return next();
        }

        if (typeof error === "string") {
            response.status(404).send(toHTML(error));
            return next();
        }

        $log.error("" + error);
        response.status(error.status || 500).send("Internal Error");

        return next();
          
    }
}
```

Then, add your middleware on your endpoint's controller:

```typescript
import {Controller, Get, UseAfter} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";

@Controller('/test')
class MyCtrl {
   @Get('/')
   @UseAfter(ErrorMiddleware)
   getContent() {
      throw NotFound('Content not found');
   }
}     
```

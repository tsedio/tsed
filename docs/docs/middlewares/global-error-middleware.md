# Global Error middleware

`@MiddlewareError()` lets you handle all the errors when you add your middleware in your [ServerLoader](api/common/server/serverloader.md).

> You have two to handle error (globally). The first (better) way is to override the default [Global Error Handler](docs/middlewares/override/global-error-handler.md).

?> This method is useful if you want to keep Ts.ED error handler. Your error middleware will be called before Ts.ED error handler.

Create your middleware error:

```typescript
import { NextFunction as ExpressNext, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { MiddlewareError, MiddlewareError, Request, Response, Next, Err } from "ts-express-decorators";
import { Exception } from "ts-httpexceptions";
import { $log } from "ts-log-debug";

@MiddlewareError()
export class GlobalErrorHandlerMiddleware implements IMiddlewareError {

    use(
        @Err() error: any,
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse,
        @Next() next: ExpressNext
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

Then, add your middleware in [`ServerLoader`](api/common/server/serverloader.md):

```typescript
@ServerSettings({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   componentsScan: [
       `${rootDir}/services/**/**.js`,
       `${rootDir}/middlewares/**/**.js`
   ]
})
export class Server extends ServerLoader {
   $afterRoutesInit() {
       this.use(GlobalErrorHandlerMiddleware);
   }
}       
```
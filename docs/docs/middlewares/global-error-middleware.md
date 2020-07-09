# Global Error middleware

@@Middleware@@ lets you handle all the errors when you add your middleware in your Server.

::: tip
You have two ways to handle errors (globally). The first (better) way is to override the default [Global Error Handler](/docs/middlewares/override/global-error-handler.md).

This method is useful if you want to keep Ts.ED error handler. Your error middleware will be called before Ts.ED error handler.
:::

Create your middleware error:

```typescript
import { Middleware, IMiddleware, Req, Res, Next, Err } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { $log } from "@tsed/logger";

@Middleware()
export class GlobalErrorHandlerMiddleware implements IMiddleware {
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

Then, add your middleware in Server:

```typescript
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import {GlobalErrorHandlerMiddleware} from "@tsed/platform-express";
import {resolve} from "path";

export const rootDir = resolve(__dirname);

@Configuration({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   componentsScan: [
       `${rootDir}/services/**/**.js`,
       `${rootDir}/middlewares/**/**.js`
   ]
})
export class Server {
   @Inject()
   app: PlatformApplication;
   
   $afterRoutesInit() {
       this.app.use(GlobalErrorHandlerMiddleware);
   }
}
```

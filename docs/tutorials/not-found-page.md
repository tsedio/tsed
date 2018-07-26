# Customize 404

The guide show how you can customize the 404 response error emitted by Express.js.

To begin create a new Middleware named `NotFoundMiddleware`:

```typescript
import {Middleware, Res} from "@tsed/common";
import * as Express from "express";

@Middleware()
export class NotFoundMiddleware {
  use(
    @Res() response: Express.Response
  ) {
    // Json response
    response.status(404).json({status: 404, message: 'Not found'});

    // Or with ejs
    response.status(404).render("404.ejs");
  }
}
```


Then register your middleware on the `$afterRoutesInit` in your Server:

```typescript
import {ServerSettings, ServerLoader} from "@tsed/common";
import {NotFoundMiddleware} from "./src/middlewares";

@ServerSettings({
  // ...
})
export class Server extends ServerLoader {

  public $afterRoutesInit() {
    this.use(NotFoundMiddleware);
  }

}
```
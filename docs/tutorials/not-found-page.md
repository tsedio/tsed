# Customize 404

The guide shows you how you can customize the 404 response error emitted by Express.js.

To begin, create a new Middleware named `NotFoundMiddleware`:

```typescript
import {Middleware, Res, Next} from "@tsed/common";

@Middleware()
export class NotFoundMiddleware {
  use(@Res() response: Res, @Next() next: Next) {
    // Json response
    response.status(404).json({status: 404, message: 'Not found'});

    // Or with ejs
    response.status(404).render("404.ejs", {}, next);
  }
}
```

Then register your middleware on the `$afterRoutesInit` in your Server:

```typescript
import {Inject} from "@tsed/di";
import {Configuration, PlatformApplication} from "@tsed/common";
import {NotFoundMiddleware} from "./middlewares/NotFoundMiddleware";

@Configuration({
  // ...
})
export class Server {
  @Inject()
  app: PlatformApplication;

  public $afterRoutesInit() {
    this.app.use(NotFoundMiddleware);
  }
}
```

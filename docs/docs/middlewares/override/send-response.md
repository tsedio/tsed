# Override Send response

There is the current implementation of the @@SendResponseMiddleware@@:

<<< @/packages/common/src/platform/middlewares/SendResponseMiddleware.ts

But for some reason, this implementation isn't enough to meet your needs.

With @@OverrideProvider@@  it's possible to change the default implementation like
this:

<<< @/docs/docs/snippets/middlewares/override-send-response.ts

::: warning
It's not preferable to use inheritance when you override SendResponse middleware. The use method signature may change in future and create a breaking change for your
own implementation.
:::

::: tip
By default, the server import automatically your middlewares matching with this rules `${rootDir}/middlewares/**/*.ts` (See [componentScan configuration](/configuration.md)).

```
.
├── src
│   ├── controllers
│   ├── services
│   ├── middlewares
│   └── Server.ts
└── package.json
```

If not, just import your middleware in your server or edit the [componentScan configuration](/configuration.md).

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "./src/other/directory/MySendResponseMiddleware";

@ServerSettings({
    ...
})
export class Server extends ServerLoader {}
```
:::

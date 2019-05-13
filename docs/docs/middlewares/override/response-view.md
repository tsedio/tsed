# Override Response view

There is the current implementation of the @@ResponseViewMiddleware@@:

<<< @/packages/common/src/mvc/components/ResponseViewMiddleware.ts

But for some reason, this implementation isn't enough to meet your needs.

With @@OverrideProvider@@ it's possible to change the default implementation like
this:

<<< @/docs/docs/snippets/middlewares/override-response-view.ts

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
import "./src/other/directory/MyResponseViewMiddleware";

@ServerSettings({
    ...
})
export class Server extends ServerLoader {
  
 
}
```
:::


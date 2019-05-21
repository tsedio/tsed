# Override a Middleware

The decorator @@OverrideProvider@@ gives you the ability to override some internal Ts.ED middlewares.

> All Ts.ED middlewares can be overrided. You can find the complete list [here](/api/index.md?query=keywords_Middleware|type_class).

## Usage

<<< @/docs/docs/snippets/middlewares/override-middleware.ts

::: tip
By default, the server import automatically you middlewares matching with this rules `${rootDir}/middlewares/**/*.ts` (See [componentScan configuration](/configuration.md)).

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
import "./src/other/directory/CustomMiddleware";

@ServerSettings({
    ...
})
export class Server extends ServerLoader {
  
 
}
```
:::

## Examples

* [Send response](/docs/middlewares/override/send-response.md)
* [Authentication](/docs/middlewares/override/authentication.md)
* [Response view](/docs/middlewares/override/response-view.md)
* [Global error handler](/docs/middlewares/override/global-error-handler.md)


# Customize 404

The guide shows you how you can customize the 404 response error when a resource or route isn't resolved by
the router.

Customizing error is possible by using the [Exception filter feature](/docs/exceptions.html#exception-filter) and by catching
the @@ResourceNotFound@@ error class. This error is thrown by Ts.ED when nothing routes are resolved.

Create a new ResourceNotFoundFilter in the filters directories and copy/paste this example:

<<< @/docs/snippets/exceptions/resource-not-found-filter.ts

::: warning
`response.render()` require to configure the template engine before. See our page over [Templating engine](/docs/templating.md#installation) installation for more details.
:::

Then import the custom filter in your server:

```typescript
import {Configuration} from "@tsed/di";
import "./filters/ResourceNotFoundFilter"; // Importing filter with ES6 import is enough

@Configuration({
  // ...
})
export class Server {}
```

---
prev: true
next: true
---

# Hooks

Ts.ED emits different events during its initialization
phase (lifecycle). These lifecycle hooks provide visibility into these key life moments and the ability to act
when they occur.

This schema resume the order of hooks regard to Server and Providers:

<figure><img src="./../assets/hooks-in-sequence.png" style="max-height: 500px; padding: 20px"></figure>

### Examples

Hooks can be used on your Server:

```typescript
import {BeforeInit, Configuration} from "@tsed/common";

@Configuration({})
class Server implements BeforeInit {
  async $beforeInit(): Promise<any> {}
}
```

or on your @@Module@@ or @@Service@@:

```typescript
import {Module, OnInit} from "@tsed/common";

@Module()
export class MyModule implements OnInit {
  async $onInit(): Promise<any> {}
}
```

::: tip Note
Database connection can be performed with Asynchronous Provider since v5.26. See [custom providers](/docs/custom-providers.md)
:::

Since v6.110.0, it's also possible to register hooks on custom provider:

```typescript
import {Configuration, registerProvider} from "@tsed/di";
import {DatabaseConnection} from "connection-lib";

export const CONNECTION = Symbol.for("CONNECTION");

registerProvider<DatabaseConnection>({
  provide: CONNECTION,
  deps: [Configuration],
  useFactory(configuration: Configuration) {
    const options = configuration.get<any>("myOptions");

    return new DatabaseConnection(options);
  },
  hooks: {
    $onDestroy(connection) {
      // called when provider instance is destroyed
      return connection.close();
    }
  }
});
```

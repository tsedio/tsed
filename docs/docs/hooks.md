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
import {Module, BeforeInit} from "@tsed/common";

@Module()
export class MyModule implements BeforeInit {
  async $beforeInit(): Promise<any> {}
}
```

::: tip Note
Database connection can be performed with Asynchronous Provider since v5.26. See [custom providers](/docs/custom-providers.md)
:::

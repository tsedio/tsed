---
prev: true
next: true
---
# Hooks

Ts.ED emits different events during its initialization
phase (lifecycle). These lifecycle hooks provide visibility into these key life moments and the ability to act
when they occur.

This schemes resume the order of hooks regarding to ServerLoader and Providers:

<figure><img src="./../assets/hooks-in-sequence.png" style="max-height: 500px; padding: 20px"></figure>

### Examples

Hooks can be used on your Server:

<Tabs class="-code">
  <Tab label="v5.56.0+">
  
```typescript
import {BeforeInit, Configuration} from "@tsed/common";

@Configuration({})
class Server implements BeforeInit {
  async $beforeInit(): Promise<any>  {
    
  }
}
```

  </Tab>
  <Tab label="Legacy">

```typescript
import {ServerLoader, ServerSettings, BeforeInit} from "@tsed/common";

@ServerSettings({})
export class Server extends ServerLoader implements BeforeInit {
  async $beforeInit(): Promise<any>  {
    
  }
}
```
  
  </Tab>
</Tabs>  

or on your @@Module@@ or @@Service@@:

```typescript
import {Module, BeforeInit} from "@tsed/common";

@Module()
export class MyModule implements BeforeInit  {
  async $beforeInit(): Promise<any>  {
    
  }
}
```

::: tip Note
Database connection can be performed with Asynchronous Provider since v5.26. See [custom providers](/docs/custom-providers.md)
:::

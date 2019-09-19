# Hooks

Ts.ED emit different events during it's initialization
phase (lifecycle). This lifecycle hooks that provide visibility into these key life moments and the ability to act
when they occur.

This schemes resume the order of hooks regarding to ServerLoader and Providers:

<figure><img src="./../assets/hooks-in-sequence.png" style="max-height: 500px; padding: 20px"></figure>

[Open in fullscreen](/assets/img/hooks-in-sequence.png)

### Examples

Hooks can be used on ServerLoader or on your Provider:
```typescript
import {ServerLoader} from "@tsed/common";

class Server extends ServerLoader implements BeforeInit {
  async $beforeInit(): Promise<any>  {
    
  }
}
```

```typescript
import {Injectable, BeforeInit} from "@tsed/common";

@Injectable()
export class MyService implements BeforeInit  {
  async $beforeInit(): Promise<any>  {
    
  }
}
```

::: tip Note
Database connection can be performed with Asynchronous Provider since v5.26. See [custom providers](/docs/custom-providers.md)
:::

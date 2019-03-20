---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation OverrideMiddleware decorator
---
# OverrideMiddleware <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OverrideMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/decorators/class/overrideMiddleware.ts#L0-L0">/packages/common/src/mvc/decorators/class/overrideMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> OverrideMiddleware<span class="token punctuation">:</span> typeof <a href="/api/di/decorators/OverrideProvider.html"><span class="token">OverrideProvider</span></a><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Override a middleware which is already registered in MiddlewareRegistry.

## Usage

```typescript
import {OriginalMiddlware, OverrideMiddleware} from "@tsed/common";

@OverrideMiddleware(OriginalMiddlware)
export class CustomMiddleware extends OriginalMiddlware {
  public use() {

  }
}
```

### Override examples

* [Usage](/docs/middlewares/override-middleware.md)
* [Send response](/docs/middlewares/override/send-response.md)
* [Authentication](/docs/middlewares/override/authentication.md)
* [Response view](/docs/middlewares/override/response-view.md)
* [Global error handler](/docs/middlewares/override/global-error-handler.md)


:::
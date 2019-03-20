---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation HttpsServer decorator
---
# HttpsServer <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { HttpsServer }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/server/decorators/httpsServer.ts#L0-L0">/packages/common/src/server/decorators/httpsServer.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">type HttpsServer<span class="token punctuation"> = </span>Https.Server & <a href="/api/common/server/decorators/IHttpsFactory.html"><span class="token">IHttpsFactory</span></a><span class="token punctuation">;</span>
function <span class="token function">HttpsServer</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>Function&gt<span class="token punctuation">;</span> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Inject the Https.Server instance.

### Example

```typescript
import {HttpsServer, Service} from "@tsed/common";

@Service()
export default class OtherService {
   constructor(@HttpsServer httpServer: HttpServer) {}
}
```

> Note: TypeScript transform and store `HttpsServer` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.


:::
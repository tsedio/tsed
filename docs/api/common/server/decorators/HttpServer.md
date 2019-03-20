---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation HttpServer decorator
---
# HttpServer <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { HttpServer }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/server/decorators/httpServer.ts#L0-L0">/packages/common/src/server/decorators/httpServer.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">type HttpServer<span class="token punctuation"> = </span>Http.Server & <a href="/api/common/server/decorators/IHttpFactory.html"><span class="token">IHttpFactory</span></a><span class="token punctuation">;</span>
function <span class="token function">HttpServer</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>Function&gt<span class="token punctuation">;</span> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Inject the Http.Server instance.

### Example

```typescript
import {HttpServer, Service} from "@tsed/common";

@Service()
export default class OtherService {
   constructor(@HttpServer httpServer: HttpServer) {}
}
```

> Note: TypeScript transform and store `HttpServer` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.


:::
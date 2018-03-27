
<header class="symbol-info-header"><h1 id="overridemiddleware">OverrideMiddleware</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label decorators" title="decorators">decorators</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OverrideMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/mvc/decorators/class/overrideMiddleware.ts#L0-L0">/common/mvc/decorators/class/overrideMiddleware.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">OverrideMiddleware</span><span class="token punctuation">(</span>targetMiddleware<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> & <a href="#api/common/mvc/imiddleware"><span class="token">IMiddleware</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

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

* [Usage](docs/middlewares/override-middleware.md)
* [Send response](docs/middlewares/override/send-response.md)
* [Authentication](docs/middlewares/override/authentication.md)
* [Response view](docs/middlewares/override/response-view.md)
* [Global error handler](docs/middlewares/override/global-error-handler.md)

<!-- Members -->


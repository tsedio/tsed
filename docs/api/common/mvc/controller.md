
<header class="symbol-info-header"><h1 id="controller">Controller</h1><label class="symbol-info-type-label decorator">Decorator</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Controller }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/mvc/decorators/class/controller.ts#L0-L0">/common/mvc/decorators/class/controller.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Controller</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <a href="#api/common/mvc/pathparamstype"><span class="token">PathParamsType</span></a> | <a href="#api/common/mvc/icontrolleroptions"><span class="token">IControllerOptions</span></a><span class="token punctuation">,</span> ...dependencies<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Declare a new controller with his Rest path. His methods annotated will be collected to build the routing list.
This routing listing will be built with the `express.Router` object.

```typescript
 @Controller("/calendars")
 export provide CalendarCtrl {

   @Get("/:id")
   public get(
     @Request() request: Express.Request,
     @Response() response: Express.Response,
     @Next() next: Express.NextFunction
   ): void {

   }
 }
```

<!-- Members -->



<header class="symbol-info-header"><h1 id="routersettings">RouterSettings</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label express" title="express">express</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { RouterSettings }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/mvc/decorators/class/routerSettings.ts#L0-L0">/common/mvc/decorators/class/routerSettings.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">RouterSettings</span><span class="token punctuation">(</span>routerOptions<span class="token punctuation">:</span> <a href="#api/common/config/irouteroptions"><span class="token">IRouterOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Specify the behavior of the router controller.

```typescript
@Controller("/")
@RouterSettings({mergeParams: true})
class MyCtrl {

}
```

Property | Description | Default
---|---|---
caseSensitive | Enable case sensitivity. | Disabled by default, treating “/Foo” and “/foo” as the same.
mergeParams | Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence. | false
strict | Enable strict routing. | Disabled by default, “/foo” and “/foo/” are treated the same by the router.

<!-- Members -->


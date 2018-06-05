
<header class="symbol-info-header"><h1 id="iroutersettings">IRouterSettings</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IRouterSettings }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.20.2/src//common/config/interfaces/IServerSettings.ts#L0-L0">/common/config/interfaces/IServerSettings.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IRouterSettings <span class="token punctuation">{</span>
    caseSensitive?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    mergeParams?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    strict?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">caseSensitive?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Disabled by default, treating “/Foo” and “/foo” as the same.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">mergeParams?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence. | false



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">strict?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Enable strict routing. | Disabled by default, “/foo” and “/foo/” are treated the same by the router.








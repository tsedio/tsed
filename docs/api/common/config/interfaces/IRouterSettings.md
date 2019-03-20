---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IRouterSettings interface
---
# IRouterSettings <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IRouterSettings }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/config/interfaces/IServerSettings.ts#L0-L0">/packages/common/src/config/interfaces/IServerSettings.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IRouterSettings <span class="token punctuation">{</span>
    caseSensitive?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    mergeParams?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    strict?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">caseSensitive?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



Disabled by default, treating “/Foo” and “/foo” as the same.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">mergeParams?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence. | false



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">strict?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



Enable strict routing. | Disabled by default, “/foo” and “/foo/” are treated the same by the router.



:::
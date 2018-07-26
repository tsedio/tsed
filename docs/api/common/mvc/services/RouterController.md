---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation RouterController service
---
# RouterController <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { RouterController }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.31.4/packages/common/src/mvc/services/RouterController.ts#L0-L0">/packages/common/src/mvc/services/RouterController.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> RouterController <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>router<span class="token punctuation">:</span> Express.Router<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">getRouter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Express.Router<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

RouteController give the express Router use by the decorated controller.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang deprecated "><span class="token function">getRouter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Express.Router</code></pre>

</div>



Return the Express.Router.



:::
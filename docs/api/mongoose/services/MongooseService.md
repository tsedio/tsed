---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MongooseService service
---
# MongooseService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongooseService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//mongoose/services/MongooseService.ts#L0-L0">/mongoose/services/MongooseService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> MongooseService <span class="token keyword">implements</span> <a href="/api/common/di/interfaces/OnInit.html"><span class="token">OnInit</span></a><span class="token punctuation">,</span> <a href="/api/common/server/interfaces/AfterRoutesInit.html"><span class="token">AfterRoutesInit</span></a> <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"mongoose.url"<span class="token punctuation">)</span>
  @<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"mongoose.connectionOptions"<span class="token punctuation">)</span>
  @<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"mongoose.urls"<span class="token punctuation">)</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>@<a href="/api/common/mvc/decorators/class/ExpressApplication.html"><span class="token">ExpressApplication</span></a> <span class="token keyword">private</span> expressApp<span class="token punctuation">:</span> <a href="/api/common/mvc/decorators/class/ExpressApplication.html"><span class="token">ExpressApplication</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"mongoose.url"<span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"mongoose.connectionOptions"<span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"mongoose.urls"<span class="token punctuation">)</span></code></pre>

</div>



:::
---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ServeStaticService service
---
# ServeStaticService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ServeStaticService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/servestatic"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//servestatic/services/ServeStaticService.ts#L0-L0">/servestatic/services/ServeStaticService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ServeStaticService <span class="token punctuation">{</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>@<a href="/api/common/mvc/decorators/class/ExpressApplication.html"><span class="token">ExpressApplication</span></a> <span class="token keyword">private</span> expressApp<span class="token punctuation">:</span> Express.Application<span class="token punctuation">,</span> <span class="token keyword">private</span> serverSettingsService<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></code></pre>
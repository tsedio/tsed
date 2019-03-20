---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation getDecoratorType function
---
# getDecoratorType <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { getDecoratorType }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/core/src/utils/DecoratorUtils.ts#L0-L0">/packages/core/src/utils/DecoratorUtils.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">getDecoratorType</span><span class="token punctuation">(</span>args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> longType?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token string">"parameter"</span> | "parameter.<span class="token keyword">constructor</span>" | "parameter.<span class="token keyword">static</span>" | "property" | "property.<span class="token keyword">static</span>" | "method" | "method.<span class="token keyword">static</span>" | "<span class="token keyword">class</span>"<span class="token punctuation">;</span></code></pre>
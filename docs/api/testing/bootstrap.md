---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation bootstrap function
---
# bootstrap <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { bootstrap }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/testing"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/testing/src/bootstrap.ts#L0-L0">/packages/testing/src/bootstrap.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">bootstrap</span><span class="token punctuation">(</span>server<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">void</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Load the server silently without listening port and configure it on test profile.

:::
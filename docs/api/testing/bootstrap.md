---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation bootstrap function
---
# bootstrap <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { bootstrap }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/testing"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//testing/bootstrap.ts#L0-L0">/testing/bootstrap.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">bootstrap</span><span class="token punctuation">(</span>server<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  $log.<span class="token function">stop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  process.env.NODE_ENV<span class="token punctuation"> = </span>process.env.NODE_ENV || "test"<span class="token punctuation">;</span>

  return function <span class="token function">before</span><span class="token punctuation">(</span>done<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> instance<span class="token punctuation"> = </span>new <span class="token function">server</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span><span class="token punctuation">;</span>

    instance.startServers<span class="token punctuation"> = </span><span class="token punctuation">(</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> Promise.<span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    // TODO used by inject method
    this.$$injector<span class="token punctuation"> = </span>instance.injector<span class="token punctuation">;</span>

    instance
      .<span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      .<span class="token function">then</span><span class="token punctuation">(</span>done<span class="token punctuation">)</span>
      .<span class="token function">catch</span><span class="token punctuation">(</span>done<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Load the server silently without listening port and configure it on test profile.

:::
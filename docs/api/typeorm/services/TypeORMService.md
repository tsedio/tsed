---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation TypeORMService service
---
# TypeORMService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { TypeORMService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/typeorm"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//typeorm/services/TypeORMService.ts#L0-L0">/typeorm/services/TypeORMService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> TypeORMService <span class="token punctuation">{</span>
  async <span class="token function">createConnection</span><span class="token punctuation">(</span>id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> settings<span class="token punctuation">:</span> ConnectionOptions<span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>this.<span class="token function">has</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      return await this.<span class="token function">get</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>!<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    $log.<span class="token function">info</span><span class="token punctuation">(</span>`Connect to typeorm database<span class="token punctuation">:</span> $<span class="token punctuation">{</span>id<span class="token punctuation">}</span>`<span class="token punctuation">)</span><span class="token punctuation">;</span>
    $log.<span class="token function">debug</span><span class="token punctuation">(</span>`options<span class="token punctuation">:</span> $<span class="token punctuation">{</span>JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>settings<span class="token punctuation">)</span><span class="token punctuation">}</span>`<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return <span class="token punctuation">(</span>
      <span class="token function">createConnection</span><span class="token punctuation">(</span>settings<span class="token punctuation">)</span>
        .<span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span>connection<span class="token punctuation">:</span> Connection<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
          this._instances.<span class="token function">set</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> connection<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
        /* istanbul ignore next */
        .<span class="token function">catch</span><span class="token punctuation">(</span>err =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
          /* istanbul ignore next */
          $log.<span class="token function">error</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
          /* istanbul ignore next */
          process.<span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">get</span><span class="token punctuation">(</span>id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation"> = </span><span class="token string">"default"</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Connection | undefined <span class="token punctuation">{</span>
    return this._instances.<span class="token function">get</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">has</span><span class="token punctuation">(</span>id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation"> = </span><span class="token string">"default"</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this._instances.<span class="token function">has</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">async <span class="token function">createConnection</span><span class="token punctuation">(</span>id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> settings<span class="token punctuation">:</span> ConnectionOptions<span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 if <span class="token punctuation">(</span>this.<span class="token function">has</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   return await this.<span class="token function">get</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>!<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 $log.<span class="token function">info</span><span class="token punctuation">(</span>`Connect to typeorm database<span class="token punctuation">:</span> $<span class="token punctuation">{</span>id<span class="token punctuation">}</span>`<span class="token punctuation">)</span><span class="token punctuation">;</span>
 $log.<span class="token function">debug</span><span class="token punctuation">(</span>`options<span class="token punctuation">:</span> $<span class="token punctuation">{</span>JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>settings<span class="token punctuation">)</span><span class="token punctuation">}</span>`<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return <span class="token punctuation">(</span>
   <span class="token function">createConnection</span><span class="token punctuation">(</span>settings<span class="token punctuation">)</span>
     .<span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span>connection<span class="token punctuation">:</span> Connection<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
       this._instances.<span class="token function">set</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> connection<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span><span class="token punctuation">)</span>
     /* istanbul ignore next */
     .<span class="token function">catch</span><span class="token punctuation">(</span>err =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
       /* istanbul ignore next */
       $log.<span class="token function">error</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
       /* istanbul ignore next */
       process.<span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span><span class="token punctuation">)</span>
 <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">get</span><span class="token punctuation">(</span>id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation"> = </span><span class="token string">"default"</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Connection | undefined <span class="token punctuation">{</span>
 return this._instances.<span class="token function">get</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">has</span><span class="token punctuation">(</span>id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation"> = </span><span class="token string">"default"</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this._instances.<span class="token function">has</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::
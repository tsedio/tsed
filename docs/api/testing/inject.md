---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation inject function
---
# inject <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { inject }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/testing"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//testing/inject.ts#L0-L0">/testing/inject.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">inject</span><span class="token punctuation">(</span>targets<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> func<span class="token punctuation">:</span> Function<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return function <span class="token function">before</span><span class="token punctuation">(</span>done<span class="token punctuation">:</span> Function<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> injector<span class="token punctuation"> = </span>this.$$injector || <span class="token function">loadInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">let</span> isDoneInjected<span class="token punctuation"> = </span>false<span class="token punctuation">;</span>
    <span class="token keyword">const</span> args<span class="token punctuation"> = </span>targets.<span class="token function">map</span><span class="token punctuation">(</span>target =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>target === <a href="/api/testing/Done.html"><span class="token">Done</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        isDoneInjected<span class="token punctuation"> = </span>true<span class="token punctuation">;</span>

        return done<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      /* istanbul ignore next */
      if <span class="token punctuation">(</span>!injector.<span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        return injector.<span class="token function">invoke</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      return injector.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> result<span class="token punctuation"> = </span>func.<span class="token function">apply</span><span class="token punctuation">(</span>null<span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>

    if <span class="token punctuation">(</span>!isDoneInjected<span class="token punctuation">)</span> <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    return result<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

The inject function is one of the TsExpressDecorator testing utilities.
It injects services into the test function where you can alter, spy on, and manipulate them.

The inject function has two parameters

* an array of Service dependency injection tokens,
* a test function whose parameters correspond exactly to each item in the injection token array.


:::
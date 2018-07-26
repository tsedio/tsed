---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation parseSwaggerPath function
---
# parseSwaggerPath <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { parseSwaggerPath }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/utils/index"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//swagger/utils/index.ts#L0-L0">/swagger/utils/index.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">parseSwaggerPath</span><span class="token punctuation">(</span>base<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> path<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/PathParamsType.html"><span class="token">PathParamsType</span></a><span class="token punctuation"> = </span>""<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span> pathParams<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
  if <span class="token punctuation">(</span>path instanceof RegExp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    path<span class="token punctuation"> = </span>path
      .<span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      .<span class="token function">replace</span><span class="token punctuation">(</span>/^\//<span class="token punctuation">,</span> ""<span class="token punctuation">)</span>
      .<span class="token function">replace</span><span class="token punctuation">(</span>/\/$/<span class="token punctuation">,</span> ""<span class="token punctuation">)</span>
      .<span class="token function">replace</span><span class="token punctuation">(</span>/\\/<span class="token punctuation">,</span> ""<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> params<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> paths<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> isOptional<span class="token punctuation"> = </span>false<span class="token punctuation">;</span>
  <span class="token keyword">let</span> current<span class="token punctuation"> = </span>""<span class="token punctuation">;</span>

  <span class="token punctuation">(</span>"" + base + path<span class="token punctuation">)</span>
    .<span class="token function">split</span><span class="token punctuation">(</span>"/"<span class="token punctuation">)</span>
    .<span class="token function">filter</span><span class="token punctuation">(</span>o =&gt<span class="token punctuation">;</span> !!o<span class="token punctuation">)</span>
    .<span class="token function">map</span><span class="token punctuation">(</span>key =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> name<span class="token punctuation"> = </span>key.<span class="token function">replace</span><span class="token punctuation">(</span>"<span class="token punctuation">:</span>"<span class="token punctuation">,</span> ""<span class="token punctuation">)</span>.<span class="token function">replace</span><span class="token punctuation">(</span>"?"<span class="token punctuation">,</span> ""<span class="token punctuation">)</span><span class="token punctuation">;</span>

      if <span class="token punctuation">(</span>key.<span class="token function">indexOf</span><span class="token punctuation">(</span>"<span class="token punctuation">:</span>"<span class="token punctuation">)</span> &gt<span class="token punctuation">;</span> -1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> optional<span class="token punctuation"> = </span>key.<span class="token function">indexOf</span><span class="token punctuation">(</span>"?"<span class="token punctuation">)</span> &gt<span class="token punctuation">;</span> -1<span class="token punctuation">;</span>

        // Append previous config
        if <span class="token punctuation">(</span>optional && !isOptional<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          isOptional<span class="token punctuation"> = </span>true<span class="token punctuation">;</span>

          paths.<span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
            path<span class="token punctuation">:</span> current<span class="token punctuation">,</span>
            pathParams<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>params <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        current += "/<span class="token punctuation">{</span>" + name + "<span class="token punctuation">}</span>"<span class="token punctuation">;</span>

        params.<span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          in<span class="token punctuation">:</span> <span class="token string">"path"</span><span class="token punctuation">,</span>
          name<span class="token punctuation">,</span>
          type<span class="token punctuation">:</span> "<span class="token keyword">string</span>"<span class="token punctuation">,</span>
          required<span class="token punctuation">:</span> true
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        if <span class="token punctuation">(</span>optional && isOptional<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          paths.<span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
            path<span class="token punctuation">:</span> current<span class="token punctuation">,</span>
            pathParams<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>params <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
        current += "/" + key<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  return paths.length
    ? paths
    <span class="token punctuation">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          path<span class="token punctuation">:</span> current<span class="token punctuation">,</span>
          pathParams<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>params <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 *
 * @param type
 * @returns <span class="token punctuation">{</span><span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">}</span>
 */</code></pre>
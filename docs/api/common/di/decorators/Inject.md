---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Inject decorator
---
# Inject <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Inject }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/di/decorators/inject.ts#L0-L0">/common/di/decorators/inject.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Inject</span><span class="token punctuation">(</span>symbol?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>Function&gt<span class="token punctuation">;</span> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> bindingType<span class="token punctuation"> = </span><span class="token function">getDecoratorType</span><span class="token punctuation">(</span><span class="token punctuation">[</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> descriptor<span class="token punctuation">]</span><span class="token punctuation">,</span> true<span class="token punctuation">)</span><span class="token punctuation">;</span>

    switch <span class="token punctuation">(</span>bindingType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      case "parameter"<span class="token punctuation">:</span>
      case "parameter.<span class="token keyword">constructor</span>"<span class="token punctuation">:</span>
        if <span class="token punctuation">(</span>symbol<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> paramTypes<span class="token punctuation"> = </span><a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>

          paramTypes<span class="token punctuation">[</span>descriptor <span class="token keyword">as</span> <span class="token keyword">number</span><span class="token punctuation">]</span><span class="token punctuation"> = </span>symbol<span class="token punctuation">;</span>
          <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">setParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> paramTypes<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        break<span class="token punctuation">;</span>

      case "property"<span class="token punctuation">:</span>
        <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>"injectableProperties"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
          <span class="token punctuation">[</span>propertyKey<span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
            bindingType<span class="token punctuation">,</span>
            propertyKey<span class="token punctuation">,</span>
            useType<span class="token punctuation">:</span> symbol || <a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getType</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        break<span class="token punctuation">;</span>

      case "method"<span class="token punctuation">:</span>
        <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>"injectableProperties"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
          <span class="token punctuation">[</span>propertyKey<span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
            bindingType<span class="token punctuation">,</span>
            propertyKey
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        return descriptor<span class="token punctuation">;</span>

      default<span class="token punctuation">:</span>
        throw new <span class="token function"><a href="/api/core/utils/UnsupportedDecoratorType.html"><span class="token">UnsupportedDecoratorType</span></a></span><span class="token punctuation">(</span>Inject<span class="token punctuation">,</span> <span class="token punctuation">[</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> descriptor<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation decoratorSchemaFactory function
---
# decoratorSchemaFactory <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { decoratorSchemaFactory }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/jsonschema/utils/decoratorSchemaFactory"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/jsonschema/utils/decoratorSchemaFactory.ts#L0-L0">/common/jsonschema/utils/decoratorSchemaFactory.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">decoratorSchemaFactory</span><span class="token punctuation">(</span>fn<span class="token punctuation">:</span> <span class="token punctuation">(</span>schema<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a><span class="token punctuation">,</span> parameters<span class="token punctuation">:</span> <a href="/api/core/interfaces/DecoratorParameters.html"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> schema<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a><span class="token punctuation">;</span>

    switch <span class="token punctuation">(</span><span class="token function">getDecoratorType</span><span class="token punctuation">(</span>parameters<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      case "property"<span class="token punctuation">:</span>
        schema<span class="token punctuation"> = </span><a href="/api/common/jsonschema/registries/PropertyRegistry.html"><span class="token">PropertyRegistry</span></a>.<span class="token function">get</span><span class="token punctuation">(</span>parameters<span class="token punctuation">[</span>0<span class="token punctuation">]</span><span class="token punctuation">,</span> parameters<span class="token punctuation">[</span>1<span class="token punctuation">]</span><span class="token punctuation">)</span>.schema<span class="token punctuation">;</span>
        break<span class="token punctuation">;</span>
      case "<span class="token keyword">class</span>"<span class="token punctuation">:</span>
        schema<span class="token punctuation"> = </span><a href="/api/common/jsonschema/registries/JsonSchemesRegistry.html"><span class="token">JsonSchemesRegistry</span></a>.<span class="token function">createIfNotExists</span><span class="token punctuation">(</span>parameters<span class="token punctuation">[</span>0<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        break<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">const</span> result<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><span class="token function">fn</span><span class="token punctuation">(</span>schema!<span class="token punctuation">,</span> parameters <span class="token keyword">as</span> <a href="/api/core/interfaces/DecoratorParameters.html"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>typeof result === <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">result</span><span class="token punctuation">(</span>...parameters<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    return parameters<span class="token punctuation">[</span>2<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
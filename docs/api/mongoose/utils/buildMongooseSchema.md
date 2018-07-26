---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation buildMongooseSchema function
---
# buildMongooseSchema <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { buildMongooseSchema }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose/utils/buildMongooseSchema"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//mongoose/utils/buildMongooseSchema.ts#L0-L0">/mongoose/utils/buildMongooseSchema.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">buildMongooseSchema</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> mongoose.SchemaDefinition <span class="token punctuation">{</span>
  <span class="token keyword">const</span> properties<span class="token punctuation"> = </span><a href="/api/common/jsonschema/registries/PropertyRegistry.html"><span class="token">PropertyRegistry</span></a>.<span class="token function">getProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> jsonSchema<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><a href="/api/common/jsonschema/registries/JsonSchemesRegistry.html"><span class="token">JsonSchemesRegistry</span></a>.<span class="token function">getSchemaDefinition</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> mSchema<span class="token punctuation">:</span> mongoose.SchemaDefinition<span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

  if <span class="token punctuation">(</span>properties<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    properties.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>propertyMetadata<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>MONGOOSE_RESERVED_KEYS.<span class="token function">indexOf</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">)</span> &gt<span class="token punctuation">;</span> -1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        return<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">let</span> definition<span class="token punctuation"> = </span><span class="token punctuation">{</span>
        required<span class="token punctuation">:</span> propertyMetadata.required
          ? <span class="token function">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
              return propertyMetadata.<span class="token function">isRequired</span><span class="token punctuation">(</span>this<span class="token punctuation">[</span>propertyKey<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">:</span> false
      <span class="token punctuation">}</span><span class="token punctuation">;</span>

      if <span class="token punctuation">(</span>propertyMetadata.isClass<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        definition<span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span>definition<span class="token punctuation">,</span> <span class="token function">buildMongooseSchema</span><span class="token punctuation">(</span>propertyMetadata.type<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
        definition<span class="token punctuation"> = </span>Object.<span class="token function">assign</span><span class="token punctuation">(</span>definition<span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token punctuation">:</span> propertyMetadata.type<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token function">mapProps</span><span class="token punctuation">(</span><span class="token punctuation">(</span>jsonSchema.properties || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">[</span>propertyKey<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      definition<span class="token punctuation"> = </span><span class="token function">clean</span><span class="token punctuation">(</span>Object.<span class="token function">assign</span><span class="token punctuation">(</span>definition<span class="token punctuation">,</span> propertyMetadata.store.<span class="token function">get</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA.html"><span class="token">MONGOOSE_SCHEMA</span></a><span class="token punctuation">)</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      mSchema<span class="token punctuation">[</span>propertyKey<span class="token punctuation">]</span><span class="token punctuation"> = </span>propertyMetadata.isArray ? <span class="token punctuation">[</span>definition<span class="token punctuation">]</span> <span class="token punctuation">:</span> definition<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return mSchema<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
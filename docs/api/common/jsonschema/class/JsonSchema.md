---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation JsonSchema class
---
# JsonSchema <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { JsonSchema }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/jsonschema/class/JsonSchema.ts#L0-L0">/common/jsonschema/class/JsonSchema.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> JsonSchema <span class="token keyword">implements</span> JSONSchema6 <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> $id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
  @AutoMapKey $ref<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> $schema<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> title<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> description<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> default<span class="token punctuation">:</span> JSONSchema6Type<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> additionalItems<span class="token punctuation">:</span> <span class="token keyword">boolean</span> | JSONSchema6<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> items<span class="token punctuation">:</span> JsonSchema<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> maxItems<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> minItems<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> uniqueItems<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> maxProperties<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> minProperties<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> required<span class="token punctuation">:</span> <span class="token keyword">any</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> additionalProperties<span class="token punctuation">:</span> JsonSchema<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> allOf<span class="token punctuation">:</span> JSONSchema6<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> anyOf<span class="token punctuation">:</span> JSONSchema6<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> oneOf<span class="token punctuation">:</span> JSONSchema6<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> not<span class="token punctuation">:</span> JSONSchema6<span class="token punctuation">;</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">extends</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  @AutoMapKey multipleOf<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @AutoMapKey maximum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @AutoMapKey exclusiveMaximum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @AutoMapKey minimum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @AutoMapKey exclusiveMinimum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @AutoMapKey maxLength<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @AutoMapKey minLength<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
  @AutoMapKey pattern<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
  @AutoMapKey format<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
  @AutoMapKey <span class="token keyword">enum</span><span class="token punctuation">:</span> JSONSchema6Type<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._proxy<span class="token punctuation"> = </span>new Proxy&lt<span class="token punctuation">;</span>JsonSchema&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token function">set</span><span class="token punctuation">(</span>schema<span class="token punctuation">:</span> JsonSchema<span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        schema.<span class="token function">mapValue</span><span class="token punctuation">(</span>propertyKey<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
        return true<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  get <span class="token function">mapper</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema6 <span class="token punctuation">{</span>
    return this._proxy<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> | JSONSchema6TypeName | JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    return this._type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  @<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  set <span class="token function">type</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span> | JSONSchema6TypeName | JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this._refName<span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
      this._type<span class="token punctuation"> = </span>JsonSchema.<span class="token function">getJsonType</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      delete this._refName<span class="token punctuation">;</span>
      delete this._type<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  get <span class="token function">refName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return this._refName<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">isCollection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this._isCollection<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">isArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this.type === <span class="token string">"array"</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">schemaType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token string">"collection"</span> | JSONSchema6TypeName | JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>this.isCollection<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>!this.isArray<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        return "collection"<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    return this.type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">mapValue</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    switch <span class="token punctuation">(</span>this.schemaType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      case "collection"<span class="token punctuation">:</span>
        this.additionalProperties<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
        break<span class="token punctuation">;</span>
      case "array"<span class="token punctuation">:</span>
        this.items<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
        break<span class="token punctuation">;</span>
      default<span class="token punctuation">:</span>
        this<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token function">toCollection</span><span class="token punctuation">(</span>collectionType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._isCollection<span class="token punctuation"> = </span>true<span class="token punctuation">;</span>
    if <span class="token punctuation">(</span><span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>collectionType<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this.items<span class="token punctuation"> = </span>this.items || new <span class="token function">JsonSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      this.items.type<span class="token punctuation"> = </span>this._type<span class="token punctuation">;</span>
      this._type<span class="token punctuation"> = </span><span class="token string">"array"</span><span class="token punctuation">;</span>
      this.<span class="token function">forwardKeysTo</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> "items"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      this.additionalProperties<span class="token punctuation"> = </span>new <span class="token function">JsonSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      this.additionalProperties.type<span class="token punctuation"> = </span>this._type<span class="token punctuation">;</span>
      delete this._type<span class="token punctuation">;</span>
      this.<span class="token function">forwardKeysTo</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> "additionalProperties"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">forwardKeysTo</span><span class="token punctuation">(</span>instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> property<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <a href="/api/common/jsonschema/class/AUTO_MAP_KEYS.html"><span class="token">AUTO_MAP_KEYS</span></a>.<span class="token function">forEach</span><span class="token punctuation">(</span>key =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>instance<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        instance<span class="token punctuation">[</span>property<span class="token punctuation">]</span><span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>instance<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
        delete instance<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    for <span class="token punctuation">(</span><span class="token keyword">const</span> key in this<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>!key.<span class="token function">match</span><span class="token punctuation">(</span>/^_/<span class="token punctuation">)</span> && typeof this<span class="token punctuation">[</span>key<span class="token punctuation">]</span> !== <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>this<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
        if <span class="token punctuation">(</span>value !== undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          if <span class="token punctuation">(</span>value instanceof JsonSchema<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value.<span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
            obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    return obj<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">toObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return JSON.<span class="token function">parse</span><span class="token punctuation">(</span>JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>this.<span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">merge</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this <span class="token punctuation">{</span>
    <span class="token function">deepExtends</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">getJsonType</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema6TypeName | JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span><span class="token function">isPrimitiveOrPrimitiveClass</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span><a href="/api/common/jsonschema/class/JSON_TYPES.html"><span class="token">JSON_TYPES</span></a>.<span class="token function">indexOf</span><span class="token punctuation">(</span>value <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">)</span> &gt<span class="token punctuation">;</span> -1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        return value<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      return <span class="token function">primitiveOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span><span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>value !== Array<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        return value<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      return "array"<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span><span class="token function">isDate</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      return "<span class="token keyword">string</span>"<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return "object"<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">ref</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> JsonSchema <span class="token punctuation">{</span>
    <span class="token keyword">const</span> schema<span class="token punctuation"> = </span>new <span class="token function">JsonSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    schema.$ref<span class="token punctuation"> = </span>`#/definitions/$<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">}</span>`<span class="token punctuation">;</span>
    return schema<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> $id<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> id<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey $ref<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> $schema<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> title<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> description<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> default<span class="token punctuation">:</span> JSONSchema6Type</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> additionalItems<span class="token punctuation">:</span> <span class="token keyword">boolean</span> | JSONSchema6</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> items<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> maxItems<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> minItems<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> uniqueItems<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> maxProperties<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> minProperties<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> required<span class="token punctuation">:</span> <span class="token keyword">any</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> additionalProperties<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> allOf<span class="token punctuation">:</span> JSONSchema6<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> anyOf<span class="token punctuation">:</span> JSONSchema6<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> oneOf<span class="token punctuation">:</span> JSONSchema6<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> not<span class="token punctuation">:</span> JSONSchema6</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">extends</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey multipleOf<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey maximum<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey exclusiveMaximum<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey minimum<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey exclusiveMinimum<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey maxLength<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey minLength<span class="token punctuation">:</span> <span class="token keyword">number</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey pattern<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey format<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@AutoMapKey <span class="token keyword">enum</span><span class="token punctuation">:</span> JSONSchema6Type<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">mapper</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema6 <span class="token punctuation">{</span>
 return this._proxy<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> | JSONSchema6TypeName | JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 return this._type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/Enumerable.html"><span class="token">Enumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">type</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span> | JSONSchema6TypeName | JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 if <span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this._refName<span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
   this._type<span class="token punctuation"> = </span><a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a>.<span class="token function">getJsonType</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
   delete this._refName<span class="token punctuation">;</span>
   delete this._type<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">refName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return this._refName<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">isCollection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this._isCollection<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">isArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this.type === <span class="token string">"array"</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">schemaType</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token string">"collection"</span> | JSONSchema6TypeName | JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 if <span class="token punctuation">(</span>this.isCollection<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span>!this.isArray<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     return "collection"<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
 return this.type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">mapValue</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 switch <span class="token punctuation">(</span>this.schemaType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   case "collection"<span class="token punctuation">:</span>
     this.additionalProperties<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
     break<span class="token punctuation">;</span>
   case "array"<span class="token punctuation">:</span>
     this.items<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
     break<span class="token punctuation">;</span>
   default<span class="token punctuation">:</span>
     this<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
  <span class="token punctuation">}</span></code></pre>

</div>



Write value on the right place according to the schema type



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">toCollection</span><span class="token punctuation">(</span>collectionType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._isCollection<span class="token punctuation"> = </span>true<span class="token punctuation">;</span>
 if <span class="token punctuation">(</span><span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>collectionType<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this.items<span class="token punctuation"> = </span>this.items || new <span class="token function"><a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   this.items.type<span class="token punctuation"> = </span>this._type<span class="token punctuation">;</span>
   this._type<span class="token punctuation"> = </span><span class="token string">"array"</span><span class="token punctuation">;</span>
   this.<span class="token function">forwardKeysTo</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> "items"<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
   this.additionalProperties<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   this.additionalProperties.type<span class="token punctuation"> = </span>this._type<span class="token punctuation">;</span>
   delete this._type<span class="token punctuation">;</span>
   this.<span class="token function">forwardKeysTo</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> "additionalProperties"<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">forwardKeysTo</span><span class="token punctuation">(</span>instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> property<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <a href="/api/common/jsonschema/class/AUTO_MAP_KEYS.html"><span class="token">AUTO_MAP_KEYS</span></a>.<span class="token function">forEach</span><span class="token punctuation">(</span>key =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span>instance<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
     instance<span class="token punctuation">[</span>property<span class="token punctuation">]</span><span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>instance<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
     delete instance<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
 for <span class="token punctuation">(</span><span class="token keyword">const</span> key in this<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span>!key.<span class="token function">match</span><span class="token punctuation">(</span>/^_/<span class="token punctuation">)</span> && typeof this<span class="token punctuation">[</span>key<span class="token punctuation">]</span> !== <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
     <span class="token keyword">const</span> value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>this<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
     if <span class="token punctuation">(</span>value !== undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       if <span class="token punctuation">(</span>value instanceof <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value.<span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
       <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
         obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
       <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
 return obj<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">toObject</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return JSON.<span class="token function">parse</span><span class="token punctuation">(</span>JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>this.<span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">merge</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this <span class="token punctuation">{</span>
 <span class="token function">deepExtends</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getJsonType</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> JSONSchema6TypeName | JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 if <span class="token punctuation">(</span><span class="token function">isPrimitiveOrPrimitiveClass</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span><a href="/api/common/jsonschema/class/JSON_TYPES.html"><span class="token">JSON_TYPES</span></a>.<span class="token function">indexOf</span><span class="token punctuation">(</span>value <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">)</span> &gt<span class="token punctuation">;</span> -1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     return value<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
   return <span class="token function">primitiveOf</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 if <span class="token punctuation">(</span><span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   if <span class="token punctuation">(</span>value !== Array<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     return value<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
   return "array"<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 if <span class="token punctuation">(</span><span class="token function">isDate</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   return "<span class="token keyword">string</span>"<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return "object"<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">ref</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> schema<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 schema.$ref<span class="token punctuation"> = </span>`#/definitions/$<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">}</span>`<span class="token punctuation">;</span>
 return schema<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::
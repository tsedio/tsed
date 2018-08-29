---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation JsonProperty decorator
---
# JsonProperty <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { JsonProperty }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/jsonschema/decorators/jsonProperty.ts#L0-L0">/common/jsonschema/decorators/jsonProperty.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">JsonProperty</span><span class="token punctuation">(</span>options?<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IPropertyOptions.html"><span class="token">IPropertyOptions</span></a> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <a href="/api/common/jsonschema/registries/PropertyRegistry.html"><span class="token">PropertyRegistry</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><span class="token punctuation">(</span>propertyMetadata<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>typeof options === "<span class="token keyword">string</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      propertyMetadata.name<span class="token punctuation"> = </span>options <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else if <span class="token punctuation">(</span>typeof options === <span class="token string">"object"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      propertyMetadata.name<span class="token punctuation"> = </span>options.name <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">;</span>

      if <span class="token punctuation">(</span>!<span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">(</span>options <span class="token keyword">as</span> <a href="/api/common/converters/interfaces/IPropertyOptions.html"><span class="token">IPropertyOptions</span></a><span class="token punctuation">)</span>.use<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        propertyMetadata.type<span class="token punctuation"> = </span><span class="token punctuation">(</span>options <span class="token keyword">as</span> <a href="/api/common/converters/interfaces/IPropertyOptions.html"><span class="token">IPropertyOptions</span></a><span class="token punctuation">)</span>.use <span class="token keyword">as</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 * `@<span class="token function"><a href="/api/common/jsonschema/decorators/Property.html"><span class="token">Property</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>` <span class="token keyword">let</span> you decorate an attribute that can be serialized or deserialized. By default<span class="token punctuation">,</span> no parameters are required to use it.
 * But in some cases<span class="token punctuation">,</span> we need to configure explicitly the JSON attribute name mapped to the provide attribute.
 *
 * Here an example of different use cases with `@<span class="token function"><a href="/api/common/jsonschema/decorators/Property.html"><span class="token">Property</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>`<span class="token punctuation">:</span>
 *
 * ```typescript
 * <span class="token keyword">class</span> EventModel <span class="token punctuation">{</span>
 *
 *    @<span class="token function"><a href="/api/common/jsonschema/decorators/Property.html"><span class="token">Property</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
 *    name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
 *
 *    @<span class="token function"><a href="/api/common/jsonschema/decorators/Property.html"><span class="token">Property</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
 *    @<span class="token function"><a href="/api/common/jsonschema/decorators/Format.html"><span class="token">Format</span></a></span><span class="token punctuation">(</span>'date-time'<span class="token punctuation">)</span>
 *    startDate<span class="token punctuation">:</span> <span class="token keyword">Date</span><span class="token punctuation">;</span>
 *
 *    @<span class="token function"><a href="/api/common/jsonschema/decorators/Property.html"><span class="token">Property</span></a></span><span class="token punctuation">(</span><span class="token punctuation">{</span>name<span class="token punctuation">:</span> 'end-date'<span class="token punctuation">}</span><span class="token punctuation">)</span>
 *    @<span class="token function"><a href="/api/common/jsonschema/decorators/Format.html"><span class="token">Format</span></a></span><span class="token punctuation">(</span>'date-time'<span class="token punctuation">)</span>
 *    endDate<span class="token punctuation">:</span> <span class="token keyword">Date</span><span class="token punctuation">;</span>
 *
 *    @<span class="token function"><a href="/api/common/jsonschema/decorators/PropertyType.html"><span class="token">PropertyType</span></a></span><span class="token punctuation">(</span>Task<span class="token punctuation">)</span> // eq. @<span class="token function"><a href="/api/common/jsonschema/decorators/Property.html"><span class="token">Property</span></a></span><span class="token punctuation">(</span><span class="token punctuation">{</span>use<span class="token punctuation">:</span> Task<span class="token punctuation">}</span><span class="token punctuation">)</span>
 *    tasks<span class="token punctuation">:</span> TaskModel<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 * <span class="token punctuation">}</span>
 *
 * <span class="token keyword">class</span> TaskModel <span class="token punctuation">{</span>
 *     @<span class="token function"><a href="/api/common/jsonschema/decorators/Property.html"><span class="token">Property</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
 *     subject<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
 *
 *     @<span class="token function"><a href="/api/common/jsonschema/decorators/Minimum.html"><span class="token">Minimum</span></a></span><span class="token punctuation">(</span>0<span class="token punctuation">)</span>  // <a href="/api/common/jsonschema/decorators/Property.html"><span class="token">Property</span></a> or JsonProperty is not required when a <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a> decorator is used
 *     @<span class="token function"><a href="/api/common/jsonschema/decorators/Maximum.html"><span class="token">Maximum</span></a></span><span class="token punctuation">(</span>100<span class="token punctuation">)</span>
 *     rate<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 * <span class="token punctuation">}</span>
 *
 * &gt<span class="token punctuation">;</span> Theses ES6 collections can be used<span class="token punctuation">:</span> Map and Set. Map will be serialized <span class="token keyword">as</span> an object and Set <span class="token keyword">as</span> an array.
 * By default <span class="token keyword">Date</span><span class="token punctuation">,</span> Array<span class="token punctuation">,</span> Map and Set have a default custom <a href="/api/common/converters/decorators/Converter.html"><span class="token">Converter</span></a> already embed. But you can override theses <span class="token punctuation">(</span>see next part<span class="token punctuation">)</span>.
 *
 * For the Array<span class="token punctuation">,</span> you must use the `@<a href="/api/common/jsonschema/decorators/PropertyType.html"><span class="token">PropertyType</span></a>` decorator.
 * `TypeClass` will be used to deserialize each item in the collection stored on the attribute source.
 *
 * According to the previous example<span class="token punctuation">,</span> the <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a> generated will be <span class="token keyword">as</span> follow<span class="token punctuation">:</span>
 *
 * ```typescript
 * <span class="token punctuation">{</span>
 *    "type"<span class="token punctuation">:</span> <span class="token string">"object"</span><span class="token punctuation">,</span>
 *    "properties"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *       "name"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *          "type"<span class="token punctuation">:</span> "<span class="token keyword">string</span>"
 *       <span class="token punctuation">}</span><span class="token punctuation">,</span>
 *       "startDate"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *          "type"<span class="token punctuation">:</span> "<span class="token keyword">string</span>"<span class="token punctuation">,</span>
 *          "format"<span class="token punctuation">:</span> "date-time"
 *       <span class="token punctuation">}</span><span class="token punctuation">,</span>
 *       "endDate"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *          "type"<span class="token punctuation">:</span> "<span class="token keyword">string</span>"<span class="token punctuation">,</span>
 *          "format"<span class="token punctuation">:</span> "date-time"
 *       <span class="token punctuation">}</span><span class="token punctuation">,</span>
 *       "tasks"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *          "type"<span class="token punctuation">:</span> <span class="token string">"array"</span><span class="token punctuation">,</span>
 *          "items"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *             "$ref"<span class="token punctuation">:</span> "#/definitions/Task"
 *          <span class="token punctuation">}</span>
 *       <span class="token punctuation">}</span>
 *    <span class="token punctuation">}</span><span class="token punctuation">,</span>
 *    "definitions"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *      "Task"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *        "type"<span class="token punctuation">:</span> <span class="token string">"object"</span><span class="token punctuation">,</span>
 *        "properties"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *          "subject"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *             "type"<span class="token punctuation">:</span> "<span class="token keyword">string</span>"<span class="token punctuation">,</span>
 *          <span class="token punctuation">}</span><span class="token punctuation">,</span>
 *          "rate"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
 *             "type"<span class="token punctuation">:</span> "<span class="token keyword">number</span>"
 *             "minimum"<span class="token punctuation">:</span> 0<span class="token punctuation">,</span>
 *             "maximum<span class="token punctuation">:</span> 100
 *          <span class="token punctuation">}</span>
 *        <span class="token punctuation">}</span>
 *      <span class="token punctuation">}</span>
 *    <span class="token punctuation">}</span>
 * <span class="token punctuation">}</span>
 * ```
 *
 * @returns <span class="token punctuation">{</span>Function<span class="token punctuation">}</span>
 * @decorator
 * @param options
 */</code></pre>



<!-- Description -->
## Description

::: v-pre

`@JsonProperty()` let you decorate an attribute that can be serialized or deserialized. By default, no parameters are required to use it.
But in some cases, we need to configure explicitly the JSON attribute name mapped to the provide attribute.

Here an example of different use cases with `@JsonProperty()`:

```typescript
class EventModel {

   @JsonProperty()
   name: string;

   @JsonProperty()
   @Format('date-time')
   startDate: Date;

   @JsonProperty({name: 'end-date'}) // alias nam doesn't work with JsonSchema
   @Format('date-time')
   endDate: Date;

   @PropertyType(Task) // eq. @Property({use: Task})
   tasks: TaskModel[];
}

class TaskModel {
    @Property()
    subject: string;

    @Minimum(0)  // Property or JsonProperty is not required when a JsonSchema decorator is used
    @Maximum(100)
    rate: number;
}

> Theses ES6 collections can be used: Map and Set. Map will be serialized as an object and Set as an array.
By default Date, Array, Map and Set have a default custom Converter already embed. But you can override theses (see next part).

For the Array, you must use the `@PropertyType` decorator.
`TypeClass` will be used to deserialize each item in the collection stored on the attribute source.

According to the previous example, the JsonSchema generated will be as follow:

```typescript
{
   "type": "object",
   "properties": {
      "name": {
         "type": "string"
      },
      "startDate": {
         "type": "string",
         "format": "date-time"
      },
      "endDate": {
         "type": "string",
         "format": "date-time"
      },
      "tasks": {
         "type": "array",
         "items": {
            "$ref": "#/definitions/Task"
         }
      }
   },
   "definitions": {
     "Task": {
       "type": "object",
       "properties": {
         "subject": {
            "type": "string",
         },
         "rate": {
            "type": "number"
            "minimum": 0,
            "maximum: 100
         }
       }
     }
   }
}
```

@returns {Function}
@decorator
@param options
@decorator
@converters

:::
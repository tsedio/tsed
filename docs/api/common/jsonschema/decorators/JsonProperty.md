---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation JsonProperty decorator
---
# JsonProperty <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { JsonProperty }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/jsonProperty.ts#L0-L0">/packages/common/src/jsonschema/decorators/jsonProperty.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">JsonProperty</span><span class="token punctuation">(</span>options?<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IPropertyOptions.html"><span class="token">IPropertyOptions</span></a> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



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
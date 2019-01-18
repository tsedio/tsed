---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Schema decorator
---
# Schema <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Schema }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v5.0.2/packages/mongoose/src/decorators/schema.ts#L0-L0">/packages/mongoose/src/decorators/schema.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Schema</span><span class="token punctuation">(</span>definition<span class="token punctuation">:</span> SchemaTypeOpts&lt;<span class="token keyword">any</span>&gt;<span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Params -->
Param | Type | Description
---|---|---
 definition|<code>SchemaTypeOpts&lt;any&gt;</code>|A mongoose schema 



<!-- Description -->
## Description

::: v-pre

Attach a schema on property class.


:::

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Schema</span><span class="token punctuation">(</span>options?<span class="token punctuation">:</span> MongooseSchemaOptions<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">=></span> void<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Define a class a Mongoose Schema. The schema can compose by others schemes and models.

### Example

```typescript
@Schema()
export class EventModel {
  @Property()
  field: string;
}
```


### Options

- `schemaOptions` (mongoose.SchemaOptions): Option to configure the schema behavior.
- `plugins` (MongoosePluginOptions[]): Plugins to add to the schema.
- `indexes` (MongooseIndexOptions[]): Schema indexes.
- `pre` (MongoosePreHook[]): Schema pre hook.
- `post` (MongoosePostHook[]): Schema post hook.

:::
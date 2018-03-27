
<header class="symbol-info-header"><h1 id="model">Model</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label mongoose" title="mongoose">mongoose</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Model }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/decorators/model.ts#L0-L0">/mongoose/decorators/model.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Model</span><span class="token punctuation">(</span>options?<span class="token punctuation">:</span> <a href="#api/mongoose/mongoosemodeloptions"><span class="token">MongooseModelOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Define a class a Mongoose Model. The model can be injected to the Service, Controller, Middleware, Converters or Filter with
`@Inject` annotation.

### Example

```typescript
@Model()
export class EventModel {
  @Property()
  field: string;
}
```

Then inject the model into a service:

```typescript
class MyService {
   constructor(@Inject(EventModel) eventModel: MongooseModel<EventModel>) {
       eventModel.find().exec();
   }
}
```

### Options

- `schemaOptions` (mongoose.SchemaOptions): Option to configure the schema behavior.
- `name` (String): model name.
- `collection` (String): collection (optional, induced from model name).
- `skipInit` (Boolean): skipInit whether to skip initialization (defaults to false).

<!-- Members -->


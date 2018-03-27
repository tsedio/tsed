
<header class="symbol-info-header"><h1 id="posthook">PostHook</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label mongoose" title="mongoose">mongoose</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { PostHook }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/decorators/postHook.ts#L0-L0">/mongoose/decorators/postHook.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">PostHook</span><span class="token punctuation">(</span>method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> fn?<span class="token punctuation">:</span> <a href="#api/mongoose/mongooseposthookcb"><span class="token">MongoosePostHookCB</span></a><<span class="token keyword">any</span>> | <a href="#api/mongoose/mongooseposterrorhookcb"><span class="token">MongoosePostErrorHookCB</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

We can simply attach a `@PostHook` decorator to your model class and
define the hook function like you normally would in Mongoose.

```typescript
import {IgnoreProperty, Required} from "@tsed/common";
import {PostHook, Model} from "@tsed/mongoose";

@Model()
@PostHook("save", (car: CarModel) => {
   if (car.topSpeedInKmH > 300) {
       console.log(car.model, 'is fast!');
   }
})
export class CarModel {
   @IgnoreProperty()
   _id: string;

   @Required()
   model: string;

   @Required()
   isFast: boolean;

   // or Prehook on static method
   @PostHook("save")
   static postSave(car: CarModel) {
      if (car.topSpeedInKmH > 300) {
          console.log(car.model, 'is fast!');
      }
   }
}
```

This will execute the post-save hook each time a `CarModel` document is saved.

<!-- Members -->


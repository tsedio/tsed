
<header class="symbol-info-header"><h1 id="prehook">PreHook</h1><label class="symbol-info-type-label decorator">Decorator</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { PreHook }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/decorators/preHook.ts#L0-L0">/mongoose/decorators/preHook.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">PreHook</span><span class="token punctuation">(</span>method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> fn?<span class="token punctuation">:</span> <a href="#api/mongoose/mongooseprehooksynccb"><span class="token">MongoosePreHookSyncCB</span></a><<span class="token keyword">any</span>> | <a href="#api/mongoose/mongooseprehookasynccb"><span class="token">MongoosePreHookAsyncCB</span></a><<span class="token keyword">any</span>> | <a href="#api/mongoose/prehookoptions"><span class="token">PreHookOptions</span></a><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="#api/mongoose/prehookoptions"><span class="token">PreHookOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

We can simply attach a `@PreHook` decorator to your model class and
define the hook function like you normally would in Mongoose.

```typescript
import {IgnoreProperty, Required} from "@tsed/common";
import {PreHook, Model} from "@tsed/mongoose";

@Model()
@PreHook("save", (car: CarModel, next) => {
   if (car.model === 'Tesla') {
       car.isFast = true;
     }
     next();
})
export class CarModel {

   @IgnoreProperty()
   _id: string;

   @Required()
   model: string;

   @Required()
   isFast: boolean;

   // or Prehook on static method
   @PreHook("save")
   static preSave(car: CarModel, next) {
      if (car.model === 'Tesla') {
          car.isFast = true;
      }
      next();
   }
}
```

This will execute the pre-save hook each time a `CarModel` document is saved.

<!-- Members -->


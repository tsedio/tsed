---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation registerFactory function
---
# registerFactory <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerFactory }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.0/src//common/di/registries/ProviderRegistry.ts#L0-L0">/common/di/registries/ProviderRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> registerFactory<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Add a new factory in the `ProviderRegistry`.

#### Example with symbol definition


```typescript
import {registerFactory, InjectorService} from "@tsed/common";

export interface IMyFooFactory {
   getFoo(): string;
}

export type MyFooFactory = IMyFooFactory;
export const MyFooFactory = Symbol("MyFooFactory");

registerFactory(MyFooFactory, {
     getFoo:  () => "test"
});

// or

registerFactory({provide: MyFooFactory, instance: {
     getFoo:  () => "test"
}});

@Service()
export class OtherService {
     constructor(@Inject(MyFooFactory) myFooFactory: MyFooFactory){
         console.log(myFooFactory.getFoo()); /// "test"
     }
}
```

> Note: When you use the factory method with Symbol definition, you must use the `@Inject()`
decorator to retrieve your factory in another Service. Advice: By convention all factory class name will be prefixed by
`Factory`.

#### Example with class

```typescript
import {InjectorService, registerFactory} from "@tsed/common";

export class MyFooService {
 constructor(){}
     getFoo() {
         return "test";
     }
}

registerFactory(MyFooService, new MyFooService());
// or
registerFactory({provider: MyFooService, instance: new MyFooService()});

@Service()
export class OtherService {
     constructor(myFooService: MyFooService){
         console.log(myFooFactory.getFoo()); /// "test"
     }
}
```


:::
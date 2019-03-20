---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ModelStrict decorator
---
# ModelStrict <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ModelStrict }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/converters/decorators/modelStrict.ts#L0-L0">/packages/common/src/converters/decorators/modelStrict.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">ModelStrict</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Change the default behavior when the converters deserialize/serialize your model.

### validationModelStrict options

When `validationModelStrict` is `true`, the converters will check the model consistency. For example, when a property is unknown
on the object sent in the request, Converters will throw a `BadRequest` because the property doesn't exists on the defined Model.

Example:

```typescript
import {InjectorService, ConvertersService, Required, Property} from "@tsed/common";

const injector = new InjectorService()
injector.load();

class TaskModel {
   @Required()
   subject: string;

   @Property()
   rate: number;
}

const convertersService = injector.get(ConvertersService);
convertersService.validationModelStrict = true;

convertersService.deserialize({unknowProperty: "test"}, TaskModel); // BadRequest
```

It's possible to disable this behavior for a specific Model with the `@ModelStrict` decorator.

Example:

```typescript
import {InjectorService, ConvertersService, ModelStrict, Required, Property} from "@tsed/common";

const injector = new InjectorService()
injector.load();

@ModelStrict(false)
class TaskModel {
   @Required()
   subject: string;

   @Property()
   rate: number;

   [key: string]: any; // recommended
}

const convertersService = injector.get(ConvertersService);
convertersService.validationModelStrict = true;

const result = convertersService.deserialize({unknowProperty: "test"}, TaskModel);
console.log(result) // TaskModel {unknowProperty: "test"}
```

> If the validationModelStrict is false, you can use `@ModelStrict` decorator to enable the strict validation for a specific model.


:::
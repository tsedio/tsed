---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IgnoreProperty decorator
---
# IgnoreProperty <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IgnoreProperty }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/ignoreProperty.ts#L0-L0">/packages/common/src/jsonschema/decorators/ignoreProperty.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">IgnoreProperty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Disable serialization for this property when the Converters service will render the JSON object.

::: tip
This decorator is used by the Converters to serialize correctly your model.
:::

::: warning
Swagger will not generate documentation for the ignored property.
:::

```typescript
class User {
  @IgnoreProperty()
  _id: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @IgnoreProperty()
  password: string;
}
```

The controller:
```typescript
import {Post, Controller, BodyParams} from "@tsed/common";
import {Person} from "../models/Person";

@Controller("/")
export class UsersCtrl {

  @Get("/")
  get(): User {
      const user = new User();
      user._id = "12345";
      user.firstName = "John";
      user.lastName = "Doe";
      user.password = "secretpassword";
        return
  }
}
```

The expected json object:

```json
{
 "firstName": "John",
 "lastName": "Doe"
}
```


:::
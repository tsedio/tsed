
<header class="symbol-info-header"><h1 id="ignoreproperty">IgnoreProperty</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label converters" title="converters">converters</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IgnoreProperty }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/ignoreProperty.ts#L0-L0">/common/jsonschema/decorators/ignoreProperty.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">IgnoreProperty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Disable serialization for this property when the Converters service will render the JSON object.

?> This decorator is used by the Converters to serialize correctly your model.

!> Swagger will not generate documentation for the ignored property.

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

<!-- Members -->


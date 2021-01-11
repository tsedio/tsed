#### v6.21.0

- Add `x-request-id` header to each response.
- Add documentation over Ts.Logger. See [Logger](/docs/logger.md) page.

#### v6.20.1

- Fix swagger spec generation when the status code is 204 ([#1175](https://github.com/TypedProject/tsed/issues/1175)).

#### v6.20.0

- Add `@tsed/stripe` package. See our [documentation](/tutorials/stripe.md).
- Add `@RawBodyParams` decorator.

---

#### v6.19.0

- Add `@tsed/oidc-provider` package. See our [documentation](/tutorials/oidc.md).
- Add `ctx.request.secure` property to check if the request is secure.

---

#### v6.18.0

- Catch passport errors and transform it to Exception.
- Remove `x-powered-by` header in production profile.
- Add `@tsed/adapters` package. This package will be used by `@tsed/oidc-provider`.

---

#### v6.17.0

- [Declare custom keys on JsonSchema](/docs/models.md#custom-keys).
- [Declare custom validator with Ajv](/docs/ajv.md#user-defined-keywords).

---

#### v6.16.0

Ts.ED uses Ajv 7. 

If you use: 
```typescript
import * as Ajv from "ajv"
```

You have to replace it with:

```typescript
import Ajv from "ajv"
```

---

#### v6.14.1

Fix typings issue with mongoose. 

Since mongoose v5.11.0, the module expose his own file definition and can broke your build! 
To solve it, install latest version of `mongoose` and `@tsed/mongoose` modules then remove the `@types/mongoose` dependencies.

---

#### v6.14.0

- [Manage Groups properties](/docs/models.md#groups).
- [Use functional programming to declare custom schema](/docs/models.md#using-functions).

Example:

```typescript
import {array, number, object, Returns, Schema, string} from "@tsed/schema";

const ProductSchema = object({
  id: string().required().description("Product ID"),
  title: string().required().minLength(3).example("CANON D300").description("Product title"),
  price: number().minimum(0).example(100).description("Product price"),
  description: string().description("Product description"),
  tags: array()
    .minItems(1)
    .items(string().minLength(2).maxLength(10).description("Product tag"))
    .description("Product tags")
})
  .label("ProductModel");
```

---

#### v6.11.0

- Add @@AnyOf@@, @@AllOf@@, @@OneOf@@ and @@For@@ decorators.

@@For@@ decorator allows conditional JsonSchema depending on the JsonSchema/Swagger version:

```typescript
@For(SpecTypes.JSON, oneOf(string(), array().items(string()).maxItems(2)))
@For(SpecTypes.OPENAPI, array().items(string()).maxItems(2))
@For(SpecTypes.SWAGGER, array().items(string()).maxItems(2))
```

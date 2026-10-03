---
name: tsed-models
description: Define Ts.ED v8 models and control validation and serialization with @tsed/schema decorators or the functional `s` builder, @tsed/ajv and @tsed/json-mapper. Use when creating a DTO or entity class, when properties disappear from a request body or response, when invalid payloads are not rejected, when a 400 AJV_VALIDATION_ERROR or "Bad request on parameter" appears, or when working with @Property, @Required, @CollectionOf, @Groups, @Nullable, @OneOf, @DiscriminatorKey, @Generics, getJsonSchema, serialize/deserialize, strictGroups, custom AJV formats or keywords, or a custom ValidationPipe.
---

# Ts.ED Models, Validation and Serialization

One class describes the JSON Schema, the validation rules, the mapping and the OpenAPI model. The schema is the source of truth: what is not described does not exist.

Package map (never import from `@tsed/common`):

| Concern                                                                                             | Package                  |
| --------------------------------------------------------------------------------------------------- | ------------------------ |
| Schema decorators, `s`, `getJsonSchema`                                                             | `@tsed/schema`           |
| `serialize`, `deserialize`, `OnSerialize`, `OnDeserialize`, `BeforeDeserialize`, `AfterDeserialize` | `@tsed/json-mapper`      |
| `Formats`, `Keyword`, `AjvService`                                                                  | `@tsed/ajv` (plus `ajv`) |
| `ValidationPipe`, `ValidationError`                                                                 | `@tsed/platform-params`  |

## 1. Describe the model

```typescript
import {CollectionOf, Default, Email, Enum, Groups, MinLength, Nullable, Property, Required} from "@tsed/schema";
import {Role} from "./Role.js";

export class User {
  @Groups("!creation")
  id: string;

  @Required()
  @MinLength(3)
  name: string;

  @Required()
  @Email()
  email: string;

  @Enum("admin", "member")
  @Default("member")
  kind: string = "member";

  @Nullable(String)
  bio: string | null;

  @CollectionOf(Role)
  roles: Role[];

  @Property()
  createdAt: Date;
}
```

1. Use classes. Interfaces and type aliases carry no runtime metadata.
2. Put at least one schema decorator on every property; `@Property()` is the minimum. Undecorated properties are dropped from the schema, from deserialized inputs and from serialized outputs.
3. Declare the item type of every `Array`, `Map` and `Set` with `@CollectionOf(Item)` (aliases `@ArrayOf`, `@MapOf`). Use `@RecordOf` for records.
4. Presence and nullability are separate: `@Required()` / `@Optional()` versus `@Nullable(Type)`. `@Required()` treats `undefined`, `null` and `""` as missing; whitelist a value with `@Allow("")` or `@Allow(null)`.
5. Constraints: `@MinLength`/`@MaxLength`, `@Minimum`/`@Maximum` (aliases `@Min`/`@Max`), `@Pattern`, `@Format("date")`, `@Email`, `@Uri`, `@Url`, `@DateTime`, `@Enum`, `@Const`, `@Integer`, `@MinItems`/`@MaxItems`/`@UniqueItems`.
6. Rename on the wire with `@Name("first_name")`. Mark direction with `@ReadOnly()` / `@WriteOnly()`. Document with `@Description`, `@Example`, `@Title`.
7. Allow unknown keys per model with `@AdditionalProperties(true)` (or a schema). Do not enable `jsonMapper.additionalProperties` globally to work around a missing decorator.
8. Polymorphism: `@OneOf(A, B)` / `@AnyOf` / `@AllOf`. Add `@DiscriminatorKey()` on the base property and `@DiscriminatorValue("a")` on each subclass so `deserialize` instantiates the right class.
9. Generics: `@Generics("T")` on the class, `@CollectionOf("T")` or `@Property("T")` on the member, then bind at the endpoint with `@(Returns(200, Pagination).Of(Product))`.
10. Do not use `@Ignore()` in new code (deprecated); use `@Groups`.

## 2. Vary the model with groups

1. `@Groups("creation")` exposes a property only for that group; `@Groups("!creation")` hides it for that group; patterns such as `group.*` match several.
2. Select groups on input with `@BodyParams() @Groups("creation") user: User` and on output with `@(Returns(200, User).Groups("read"))`.
3. `@BodyParams() @Partial() payload: User` makes all properties optional for PATCH.
4. Set `jsonMapper.strictGroups: true` in new applications. Without it, an endpoint that declares no group exposes every grouped property, and the generated documentation does not match the runtime.

## 3. Enable validation

```typescript
import "@tsed/ajv";
import {Configuration} from "@tsed/di";

@Configuration({
  ajv: {returnsCoercedValues: true},
  jsonMapper: {strictGroups: true}
})
export class Server {}
```

1. Install `ajv` and `@tsed/ajv`, and import `@tsed/ajv` in the server. Without a registered validator the built-in `ValidationPipe` only checks required parameters; every other constraint is silently skipped.
2. The `ajv` configuration key takes AJV constructor options directly, plus `errorFormatter` and `returnsCoercedValues`.
3. Failures throw `AjvValidationError` (a `BadRequest`, name `AJV_VALIDATION_ERROR`, with `errors[]`), returned as 400. Payload shape and customization: tsed-exceptions.
4. Custom messages: `.Error("...")` on a constraint decorator, or `@ErrorMsg`, `@TypeError`, `@DefaultMsg`.
5. Custom format: `@Formats("slug", {type: "string"})` on a class implementing `FormatsMethods<string>` (`validate(value): boolean`); apply with `@Format("slug")`.
6. Custom keyword: `@Keyword({keyword: "range", type: "number", schemaType: "array"})` on a class implementing `KeywordMethods` (`compile` or `validate`); apply with `@CustomKey("range", [1, 10])`.
7. Import format and keyword classes from the server entry point, otherwise they are never registered.
8. Replace the validator only as a last resort: extend `ValidationPipe` and decorate with `@OverrideProvider(ValidationPipe)` from `@tsed/di`, throwing `ValidationError`. OpenAPI and mapping keep using the JSON Schema.

## 4. Map outside of controllers

```typescript
import {deserialize, serialize} from "@tsed/json-mapper";
import {s} from "@tsed/schema";
import {User} from "./models/User.js";

const user = deserialize<User>(input, {type: User, groups: ["creation"]});
const users = deserialize<User[]>(list, {type: User, collectionType: Array});
const json = serialize(user, {type: User, groups: ["read"]});
const schema = s.compile(User, {groups: ["creation"]}); // getJsonSchema() is the deprecated alias
```

1. Controllers call these automatically for `@BodyParams`, `@QueryParams`, `@PathParams` and for returned values. Call them yourself for queues, sockets, caches and tests.
2. `deserialize` does not validate. Validate first with `AjvService.validate(value, {type: User})`.
3. Transform one property with `@OnSerialize((value) => ...)` / `@OnDeserialize((value) => ...)`; hook the whole class with `@BeforeDeserialize` / `@AfterDeserialize`. All four come from `@tsed/json-mapper`.
4. The constructor does not receive the payload unless `jsonMapper.disableUnsecureConstructor` is `false`. Do not rely on `Object.assign(this, data)` constructors.

## 5. Use the functional builder when a class is not wanted

```typescript
import {s} from "@tsed/schema";

export const ProductSchema = s.object({
  title: s.string().required().minLength(3),
  price: s.number().minimum(0),
  tags: s.array(s.string())
});
export type Product = s.infer<typeof ProductSchema>;
```

`s` is the only builder export to use (`s.string`, `s.number`, `s.integer`, `s.boolean`, `s.date`, `s.datetime`, `s.email`, `s.enums`, `s.array`, `s.map`, `s.set`, `s.record`, `s.oneOf`, `s.anyOf`, `s.allOf`). `s.from(Model)` returns a local copy to compose; `s.get(Model)` returns the shared class schema, so changes to it are global; `s.generic(Pagination).of(Product)` binds generics.

## Pitfalls

- Field missing from the response or `undefined` in the handler: no decorator on the property.
- Array items arrive as plain objects: `@CollectionOf` is missing, or the parameter decorator did not receive the item class (see tsed-controllers).
- Nothing is validated: `@tsed/ajv` is not imported, or the parameter is typed with an interface or `any`.
- `null` rejected or coerced: add `@Nullable(Type)`; it is mandatory when `ajv.returnsCoercedValues` is enabled.
- Password leaks in a response: groups are declared but the endpoint sets none and `strictGroups` is off.
- `@DiscriminatorKey()` property typed with the enum: keep it `string`; values come from `@DiscriminatorValue`.
- `OnSerialize` imported from `@tsed/schema` (as some doc pages show) does not compile; import it from `@tsed/json-mapper`.

## Checklist

- Classes only; every property decorated; every collection has `@CollectionOf`.
- `@tsed/ajv` imported in the server; `jsonMapper.strictGroups` decided explicitly.
- Groups set on both the input parameter and `@Returns` where the shape differs.
- Custom formats and keywords imported at startup.
- Schema checked with `s.compile(Model)` in a unit test (see tsed-testing).
- No `@tsed/common` import; relative imports end with `.js`.

Depth: https://tsed.dev/docs/model.md, https://tsed.dev/docs/validation.md, https://tsed.dev/docs/json-mapper.md. OpenAPI output: tsed-openapi.

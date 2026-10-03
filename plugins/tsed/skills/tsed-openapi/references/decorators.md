# Operation and response decorators

Every decorator below is exported by `@tsed/schema`, except `Docs` (`@tsed/swagger` or `@tsed/scalar`). Model-level decorators (`@Property`, `@Required`, `@Groups`, `@Example`, ...) are covered by the sibling skill `tsed-models`.

## Operation decorators

| Decorator                    | Target                             | Effect                                                                     |
| ---------------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| `@Summary(text)`             | method                             | Operation `summary`.                                                       |
| `@Description(text)`         | class, method, parameter, property | `description` of the tag, operation, parameter or schema.                  |
| `@Tags(...tags)`             | class, method                      | Operation tags. Accepts names or `{name, description}` objects.            |
| `@Name(name)`                | class                              | Rename the default tag derived from the controller class name.             |
| `@OperationId(id)`           | method                             | Explicit `operationId`; overrides the pattern/formatter.                   |
| `@Deprecated()`              | method                             | Mark the operation deprecated. `@Deprecated(false)` re-enables.            |
| `@Security(name, ...scopes)` | class, method                      | Security requirement. Also accepts an `OpenSpecSecurity` object.           |
| `@Consumes(...mimes)`        | class, method                      | Request content types.                                                     |
| `@Produces(...mimes)`        | class, method                      | Response content types.                                                    |
| `@Hidden()`                  | class, method                      | Exclude from every generated document.                                     |
| `@In(type)`                  | method                             | Document an extra parameter that the handler does not consume.             |
| `@Returns(status, Model)`    | method                             | Response; see below.                                                       |
| `@Docs(...keys)`             | class                              | Assign the controller to the documents whose `doc` equals one of the keys. |

Extra parameter example:

```typescript
import {Get, In} from "@tsed/schema";

@Get("/")
@(In("header").Name("x-tenant").Type(String).Description("Tenant identifier"))
list() {}
```

## `@Returns` chain

`Returns(status?, Model?)` returns a chainable decorator. Wrap the whole expression in parentheses when chaining.

| Method                                      | Effect                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `.Description(text)`                        | Response description.                                                                             |
| `.ContentType(mime)`                        | Response media type (`"application/json"`, `"text/html"`, ...).                                   |
| `.Of(...types)`                             | Item type of an `Array`/`Map`/`Set`, or generic arguments of a generic model.                     |
| `.OfInteger()`                              | Shortcut for integer items.                                                                       |
| `.Nested(...types)`                         | Generic argument of the previous `.Of()` type.                                                    |
| `.OneOf(...)`, `.AnyOf(...)`, `.AllOf(...)` | Polymorphic response schema.                                                                      |
| `.Groups(...groups)`                        | Serialize and document with these groups. `.Groups("Name", [...])` also names the derived schema. |
| `.AllowedGroups(...groups)`                 | Groups a client may request at runtime.                                                           |
| `.Title(title)` / `.Label(label)`           | Title / component name of the generated schema (useful for generics).                             |
| `.Schema(schema)`                           | Inline JSON schema or `s.*` schema instead of a model.                                            |
| `.Examples({...})`                          | Response examples.                                                                                |
| `.Header(key, value)` / `.Headers({...})`   | Response headers.                                                                                 |
| `.Location(url)`                            | `Location` header shortcut.                                                                       |
| `.Binary()`                                 | Binary response body.                                                                             |
| `.Status(code)` / `.Type(Model)`            | Override the status or model given to `Returns()`.                                                |

## Patterns

### Collection

```typescript
@Get("/")
@(Returns(200, Array).Of(Order).Description("All orders"))
list() {}
```

### Created resource

```typescript
@Post("/")
@(Returns(201, Order).Description("Created").Location("/rest/orders/{id}"))
create(@BodyParams() @Groups("create") order: Order) {}
```

### Errors

Use the exception classes of `@tsed/exceptions` as models so the error body is documented (sibling skill `tsed-exceptions`).

```typescript
@(Returns(400, BadRequest).Description("Validation failed"))
@(Returns(404, NotFound).Description("Order not found"))
```

### Generic envelope and pagination

```typescript
import {CollectionOf, Generics, Property} from "@tsed/schema";

@Generics("T")
export class Pagination<T> {
  @CollectionOf("T")
  data: T[];

  @Property()
  totalCount: number;
}
```

```typescript
@Get("/")
@(Returns(206, Pagination).Of(Order).Title("PaginatedOrder"))
@(Returns(200, Pagination).Of(Order).Title("PaginatedOrder"))
list() {}
```

Nested generics: `@(Returns(200, Pagination).Of(Submission).Nested(Order))` documents `Pagination<Submission<Order>>`.

Always add `.Title()` (or `.Label()`) on generic responses so client generators get a stable schema name. See https://tsed.dev/docs/model.md for the full pagination recipe.

### Groups

```typescript
@Get("/:id")
@(Returns(200, User).Groups("read"))
get() {}

@Post("/")
@(Returns(201, User).Groups("read"))
create(@BodyParams() @Groups("create") user: User) {}
```

Each distinct group set produces its own component schema. Name it with `.Groups("UserRead", ["read"])` to keep generated client types readable.

### File and non-JSON responses

```typescript
@Get("/:id/invoice")
@(Returns(200, String).ContentType("application/pdf").Binary())
invoice() {}
```

### Security

```typescript
@Controller("/orders")
@Security("bearer")
export class OrdersController {
  @Delete("/:id")
  @Security("oauth2", "orders:write")
  @Returns(204)
  remove() {}
}
```

Declare `bearer` and `oauth2` under `spec.components.securitySchemes` of each document (see [configuration](configuration.md)). `@Security` only documents the requirement; enforcement belongs to a middleware or guard (sibling skill `tsed-middlewares`).

## Rules

- Do not rely on the TypeScript return type; `Promise<T>` and `T[]` are erased at runtime.
- Do not import `Returns`, `Summary` or other decorators from `@tsed/common`.
- Do not use `@Hidden()` to hide a model property; use groups (sibling skill `tsed-models`).

---
head:
  - - meta
    - name: description
      content: Learn how Ts.ED manages routing paths, including wildcards, optional parameters, and other path conventions.
  - - meta
    - name: keywords
      content: routing paths wildcards optional parameters path conventions ts.ed typescript node.js javascript decorators mvc
---

# Routing Path Conventions

Ts.ED provides a flexible and powerful routing system that supports various path conventions. This guide explains how
paths are managed in Ts.ED, including wildcards, optional parameters, and other path patterns.

## Path Syntax Overview

Ts.ED supports several path syntax conventions that allow you to define routes with dynamic segments:

| Syntax      | Description                    | Example                                               |
| ----------- | ------------------------------ | ----------------------------------------------------- |
| `:param`    | Named parameter                | `/users/:id` matches `/users/123`                     |
| `*`         | Wildcard (matches everything)  | `/files/*` matches `/files/any/path`                  |
| `/:param*`  | Named wildcard                 | `/files/:path*` matches `/files/any/path`             |
| `/:param?`  | Optional parameter             | `/users/:id?` matches both `/users/123` and `/users`  |
| `/{:param}` | Optional parameter (v5 syntax) | `/users/{:id}` matches both `/users/123` and `/users` |
| `/(.*)`     | Regular expression wildcard    | `/files/(.*)` matches `/files/any/path`               |

Ts.ED try to be compatible with the most common conventions used in web frameworks like Express.js, Koa.js, and Fastify.

::: warning
RegExp in string paths are not converted by Ts.ED. Express.js v5 has removed support for RegExp in string paths.
In this case, adapt your paths that use RegExp to use the appropriate syntax depending on the framework you are using.
:::

## Named Parameters

The most common way to define dynamic segments in routes is using named parameters:

```typescript
@Controller("/users")
class UsersController {
  @Get("/:id")
  getUser(@PathParams("id") id: string) {
    // id will contain the value from the URL
    return `User ID: ${id}`;
  }
}
```

When a request is made to `/users/123`, the `id` parameter will be `"123"`.

## Wildcards

Wildcards allow you to match any path segment or multiple segments:

### Simple Wildcard

```typescript
@Controller("/files")
class FilesController {
  @Get("/*")
  getFile(@PathParams("*") path: string) {
    // path will contain everything after /files/
    return `File path: ${path}`;
  }
}
```

A request to `/files/documents/report.pdf` will set `path` to `"documents/report.pdf"`.

### Named Wildcards

```typescript
@Controller("/files")
class FilesController {
  @Get("/:path*")
  getFile(@PathParams("path") path: string) {
    // path will contain everything after /files/
    return `File path: ${path}`;
  }
}
```

This works the same as the simple wildcard but uses a named parameter.

### Regular Expression Wildcard

```typescript
@Controller("/files")
class FilesController {
  @Get("/(.*)")
  getFile(@PathParams("*") path: string) {
    // path will contain everything after /files/
    return `File path: ${path}`;
  }
}
```

This is an alternative syntax that uses a regular expression pattern.

## Optional Parameters

Optional parameters allow a segment to be present or absent:

### Using Question Mark

```typescript
@Controller("/users")
class UsersController {
  @Get("/:id?")
  getUser(@PathParams("id") id: string) {
    if (id) {
      return `User ID: ${id}`;
    }
    return "User list";
  }
}
```

This route will match both `/users/123` and `/users`.

### Using Braces (Express v5 syntax)

```typescript
@Controller("/users")
class UsersController {
  @Get("/{:id}")
  getUser(@PathParams("id") id: string) {
    if (id) {
      return `User ID: ${id}`;
    }
    return "User list";
  }
}
```

This is the v5 syntax for optional parameters, which is equivalent to the question mark syntax. Ts.ED adapts this syntax
to his equivalent
for Express.js v4, Koa.js and Fastify.

## Path Parameter Validation

You can add validation to path parameters using decorators:

```typescript
@Controller("/users")
class UsersController {
  @Get("/:id")
  getUser(@PathParams("id") @Pattern(/^[0-9a-fA-F]{24}$/) id: string) {
    // This will only match if id is a valid 24-character hex string
    return `User ID: ${id}`;
  }
}
```

If the validation fails, Ts.ED will automatically return a 400 Bad Request response.

## Platform Adapter Considerations

Different web frameworks handle path patterns differently. Ts.ED's platform adapters (Express, Koa, Fastify)
automatically convert Ts.ED path conventions to the format expected by the underlying framework.

For example:

- Express uses `:param` for parameters and `*` for wildcards
- Koa uses similar syntax but with some differences in wildcard handling
- Fastify has its own path parameter syntax

The platform adapters handle these differences transparently, allowing you to use the same path conventions regardless
of the underlying framework.

## Examples

Here are some examples of different path patterns and how they match:

```typescript
@Controller("/path-params")
class PathParamsController {
  // Simple named parameter
  @Get("/users/:id")
  getUser(@PathParams("id") id: string) {
    return `User ID: ${id}`;
  }

  // Wildcard
  @Get("/files/*")
  getFile(@PathParams("*") path: string) {
    return `File path: ${path}`;
  }

  // Named wildcard
  @Get("/docs/:path*")
  getDoc(@PathParams("path") path: string) {
    return `Doc path: ${path}`;
  }

  // Optional parameter
  @Get("/products/:id?")
  getProduct(@PathParams("id") id: string) {
    return id ? `Product ID: ${id}` : "All products";
  }

  // Optional parameter (v5 syntax)
  @Get("/categories/{:id}")
  getCategory(@PathParams("id") id: string) {
    return id ? `Category ID: ${id}` : "All categories";
  }
}
```

## Conclusion

Ts.ED's routing system provides a flexible way to define routes with dynamic segments. By supporting various path
conventions, it allows you to create clean and expressive APIs that can handle a wide range of URL patterns.

For more information on controllers and routing, see the [Controllers documentation](./controllers.md).

# @tsed/router

`@tsed/router` defines the portable routing contracts used by the future
Fetch-native Ts.ED platform. It does not provide route matching or a server
implementation yet.

The HTTP boundary is always the Web Platform API:

```ts
router.fetch(request: Request): Response | Promise<Response>;
```

This keeps a host portable across runtimes that expose Fetch, including modern
Node.js, Bun and Workers.

## Declaring an endpoint

`defineEndpoint()` creates a `FetchRouter` containing one route. This makes an
endpoint exportable as a self-contained module and mountable in another router.

```ts
import {defineEndpoint, FetchRouter, type FetchEndpointOptions} from "@tsed/router";

type GetUserInput = {
  params: {id: string};
  query: {include?: string};
};

export const getUser = defineEndpoint<FetchEndpointOptions<GetUserInput>>({
  method: "GET",
  path: "/users/:id",
  input: {
    params: {type: "object"},
    query: {type: "object"}
  },
  output: {
    200: {
      description: "The requested user",
      contentType: "application/json",
      schema: {type: "object"}
    }
  },
  handler({request, params, query}) {
    return Response.json({id: params.id, include: query.include, url: request.url});
  }
});

const router = new FetchRouter();
router.use("/api", getUser);
```

Input and output schemas are adapter-owned metadata. The router deliberately
does not depend on `@tsed/schema`, JSON Schema or a validation library. An
adapter may use Ts.ED schemas, a third-party schema library or plain metadata.

## Handler contract

Handlers receive a `FetchContext` containing the original `Request`, decoded
`params`, `query`, `headers` and `body`. A handler can return a native
`Response`, a value that the host serializes, or `void` for a no-content
response.

Only standard HTTP methods are exposed: `GET`, `POST`, `PUT`, `PATCH`,
`DELETE`, `HEAD` and `OPTIONS`. Non-standard verbs are left to the host rather
than becoming part of the portable API.

## Router contract

`FetchRouter` is an instantiable declaration API. It offers `get`, `post`,
`put`, `patch`, `delete`, `head`, `options`, `all`, `use` and `fetch`. Method
helpers accept either a complete endpoint declaration without `method`, or the
short `(path, handler)` form. `defineEndpoint()` is the module-oriented form
that provides its HTTP method explicitly.

The contract is intentionally limited to declaration and composition. Request
decoding, validation, serialization, DI integration and OpenAPI generation are
future adapters around this stable boundary.

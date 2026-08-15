# @tsed/platform-elysia

Elysia platform adapter for Ts.ED.

```bash
yarn add @tsed/platform-elysia elysia
```

Elysia is Fetch-native. The adapter translates Ts.ED controller and DI lifecycles to Elysia's request context and response `set` object; applications running on Bun are the supported runtime.

Static files require registering `@elysia/static` on a custom Elysia application before bootstrap. Elysia parses `multipart/form-data` natively as `FormData`/`File` values; use Ts.ED body parameters to access them. The Multer decorators and storage engines are not supported. View rendering, session middleware, deep query parsing, Node `Readable` streams, manually finalized responses, redirects, response filters, response caching, custom 404 responses, WebSockets, and serverless callback compatibility are not supported by the initial adapter.

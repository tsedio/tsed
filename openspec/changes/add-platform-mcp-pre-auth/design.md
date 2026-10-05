## Context

`PlatformMcpModule.dispatch` authenticates a request only through `auth` as an OAuth resource server (`issuer`, `resource`, bearer token verification). Applications with another scheme use a global middleware.

## Decisions

### D1 — The check lives in `auth`, as `preAuth`

It is an authentication concern of the endpoint, so it is declared next to the OAuth settings rather than as a middleware or a sibling option. `auth` becomes `PlatformMcpAuthSettings | PlatformMcpPreAuthSettings`: OAuth settings (with an optional `preAuth`), or `preAuth` alone. An `auth` object with neither an issuer nor a `preAuth` is a startup error.

### D2 — Contract

`preAuth` is a function `($ctx: PlatformContext) => AuthInfo | undefined`, or a DI token resolving to a provider implementing `PlatformMcpPreAuth`. The two are told apart by the injector: a value registered as a provider is resolved and its `preAuth` method is called, anything else is called as the check itself. A class that is not registered as a provider is therefore not supported.

- An `AuthInfo` authenticates the request and skips the OAuth verification.
- `undefined` means the check does not apply to this request.
- A thrown error rejects the request and is rendered by the platform exception handling.

### D3 — Fail closed without OAuth

When the check returns `undefined` and the endpoint declares no issuer, the request is answered `401` (`{error: "unauthorized"}`) without `WWW-Authenticate` challenge. Letting it through would turn a check that forgot to throw into an open endpoint.

### D4 — One identity model

The returned `AuthInfo` is set on `req.auth`, like an OAuth identity: handlers read `ctx.http.authInfo`, and the upstream `${OAUTH_*}` placeholders are interpolated from it. Placeholders are therefore accepted on any endpoint declaring `auth`, with or without issuer. Unlike OAuth tokens, an identity returned by the check needs no `expiresAt`.

### D5 — OAuth artifacts only with an issuer

The protected resource metadata route and the OAuth configuration validation only apply when an issuer is declared.

## Risks / Trade-offs

- **A check returning an identity for an invalid credential** bypasses OAuth → documented: the check must throw on a wrong credential and return `undefined` only when the credential is absent.
- **Placeholder names** stay `OAUTH_*` even when the identity comes from an API key → accepted to avoid a second set of placeholders.

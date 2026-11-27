## Why

`@Authorize()` does not guarantee that a route is protected by the protocol it declares. `PassportMiddleware.shouldSkip` returns early for any authenticated session, so a route declared with `@Authorize("jwt")` or `@Authorize("basic")` accepts a user logged in with a form. When there is no session, the middleware runs the declared strategy through `Passport.authorize()`, so `@Authorize("local")` exchanges credentials posted to a business route and runs its handler, bypassing the protections applied only on the login endpoint (CAPTCHA, rate limiting). Finally `@Authorize("session")` lets anonymous requests through, because the built-in Passport `session` strategy always passes.

Passport.js behaves as documented: `authenticate()` and `authorize()` always run the strategy, and `authorize()` only assigns the result to `req.account` without creating a login session. The decorator only stores metadata. The defect belongs to the Ts.ED integration (`PassportMiddleware` and `ProtocolsService`).

## What Changes

- An existing session satisfies a route only when the route accepts any protocol (`"*"`), declares the reserved `"session"` protocol, or declares the protocol that established the session. Otherwise the declared strategies run.
- `ProtocolsService` records, on a successful stateful `@Authenticate()`, the protocol that established the session (`req.session.passport.protocol`).
- `"session"` becomes a reserved protocol name handled by the middleware: satisfied by a login session, never forwarded to Passport, rejected with `401` when nothing else is declared.
- New `loginOnly` protocol option (`@Protocol()` or `passport.protocols.<name>`): the strategy never runs on an `@Authorize()` route, which accepts it only through the session it established.
- The `@Authorize()` and `@Authenticate()` decorators are unchanged.
- Documentation of the guarantees in `docs/tutorials/passport.md`.

## Capabilities

### New Capabilities

- `passport-route-protection`: Rules applied by `@Authorize()` / `@Authenticate()` guards to sessions and declared protocols.

## Impact

- Package: `@tsed/passport` (`PassportMiddleware`, `ProtocolsService`, `ProtocolOptions`).
- Behaviour change: a session no longer satisfies a route declaring only other protocols. Sessions created before the upgrade or with a manual `req.login()` have no recorded protocol and are accepted only by `"*"` and `"session"` routes. Migration: add `"session"` to the declaration.
- `loginOnly` is opt-in, so existing `@Authorize("local")` routes keep running the strategy until the protocol is flagged.

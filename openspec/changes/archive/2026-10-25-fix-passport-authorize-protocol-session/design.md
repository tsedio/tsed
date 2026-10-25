## Context

`@Authorize(protocol, options)` and `@Authenticate(protocol, options)` register `PassportMiddleware` with `{protocol, method, options}`. The middleware resolves the protocol names (`"*"`, `":protocol"`, list) and calls `Passport.authorize()` or `Passport.authenticate()` with `failWithError`.

Responsibilities:

| Layer                              | Behaviour                                                                                                                                                                                                                                   | Defect                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Passport.js 0.7                    | `authenticate()` runs the strategy and logs the user in. `authorize()` is `authenticate()` with `assignProperty: "account"`: it sets `req.account`, never touches `req.user` or the session. The built-in `session` strategy always passes. | None, documented behaviour.      |
| `@Authorize()` / `@Authenticate()` | Store metadata.                                                                                                                                                                                                                             | None.                            |
| `PassportMiddleware`               | Skipped for any authenticated session, otherwise runs every declared strategy.                                                                                                                                                              | Root cause of issues 1, 2 and 3. |

## Decisions

- **Protocol-aware short-circuit.** `shouldSkip(ctx, protocols)` accepts the session only for `"*"`, `"session"`, or the protocol recorded at login. `"*"` keeps its current meaning ("any authentication method, session included"), so `@Authorize()` routes are unaffected.
- **Record the login protocol in the session.** The verify handler stores the protocol name in the request context when it returns a user; after a successful stateful `authenticate`, `ProtocolsService` writes it to `req.session.passport.protocol` (falls back to the single declared protocol). It lives next to `passport.user`, so `req.logout()` drops it. `authorize` and `session: false` never write it.
- **Reserved `"session"` protocol.** Removed from the strategies forwarded to Passport, because Passport's own `session` strategy always passes and cannot be used as a guard. `@Authorize(["session", "jwt"])` gives "cookie or token" without a custom strategy.
- **Opt-in `loginOnly`.** Ts.ED cannot tell a login strategy from a per-request one (Basic, JWT): the protocol declares it. Flagged protocols are filtered out of `@Authorize()` strategies; an empty list raises `401 Not authorized`. It is opt-in to avoid breaking applications relying on per-request local credentials.

## Alternatives rejected

- Detecting `passport-local` from the strategy name: heuristic, breaks custom strategies.
- Requiring `"session"` explicitly everywhere: breaks `@Authorize("login")` after a `login` session, the common pattern.
- Fixing in Passport.js: its behaviour is correct for its own `authorize()` contract (account linking).

## Risks

- Sessions without a recorded protocol (legacy or manual `req.login()`) are rejected by protocol-specific routes. Documented with the `"session"` migration path.

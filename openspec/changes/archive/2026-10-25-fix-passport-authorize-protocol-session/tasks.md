## 1. Reproduction

- [x] 1.1 Add `basic` and bearer (`jwt`) protocols and a guarded controller to the integration app.
- [x] 1.2 Reproduce the session bypass, the local login on a business route and the always-passing `session` strategy.

## 2. Fix

- [x] 2.1 Make `PassportMiddleware.shouldSkip` protocol-aware.
- [x] 2.2 Record the protocol that established the session in `ProtocolsService`.
- [x] 2.3 Handle the reserved `"session"` protocol in the middleware.
- [x] 2.4 Add the `loginOnly` protocol option.

## 3. Tests and docs

- [x] 3.1 Unit tests for the middleware decision matrix and the session recording.
- [x] 3.2 Integration tests for session / no session × protocol × valid / invalid credentials.
- [x] 3.3 Document the guarantees, `loginOnly` and the upgrade note in `docs/tutorials/passport.md`.

# v9 breaking-change register

Update this register with every public API break as it lands. Each row must link
to its dedicated section in `docs/introduction/migrate-from-v8.md` before an
alpha release is ready.

| Surface         | v8 behavior                                             | v9 behavior                                                       | Migration                                                                                                    | Validation                                            | Commit / PR  |
| --------------- | ------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- | ------------ |
| `IncomingEvent` | Exported Node-default `{request, response}` event type. | Removed in favor of the runtime-agnostic `PlatformNativeContext`. | Import `PlatformNativeContext` from `@tsed/platform-http`; provide the host request and response through it. | `PlatformContext.spec.ts`, `PlatformResponse.spec.ts` | `bc28a631f6` |

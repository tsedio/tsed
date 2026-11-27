# Ts.ED testing recipes (v8, Vitest)

Shared imports for every snippet:

```typescript
import {inject, runInContext} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
```

## PlatformTest API

| Method                                          | Purpose                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `PlatformTest.create(settings?)`                | Create the injector with a fake platform adapter and load all registered providers. Async.                                            |
| `PlatformTest.reset()`                          | Destroy the injector (`$onDestroy`) and clear local mocks. Async.                                                                     |
| `PlatformTest.invoke<T>(token, [{token, use}])` | Fresh instance with local overrides; awaits `$onInit`.                                                                                |
| `PlatformTest.get<T>(token)`                    | Cached instance from the injector.                                                                                                    |
| `PlatformTest.injector`                         | The `InjectorService` (`.get`, `.has`, `.invoke`, `.settings`).                                                                       |
| `PlatformTest.bootstrap(Server, settings?)`     | Returns `() => Promise<void>` that bootstraps the full server. `settings.listen` opens ports; `settings.adapter` forces the platform. |
| `PlatformTest.callback()`                       | Node request listener for SuperTest.                                                                                                  |
| `PlatformTest.createRequest(options?)`          | Fake raw request (`headers`, `method`, `url`, `query`, `get()`, `accepts()`).                                                         |
| `PlatformTest.createResponse(options?)`         | Fake raw response (`statusCode`, `headers`, `data`, `status()`, `cookie()`, ...).                                                     |
| `PlatformTest.createRequestContext(options?)`   | `PlatformContext` built on the fake request/response.                                                                                 |

`DITest` (`@tsed/di`) provides `create`, `invoke`, `get`, `reset`, `createDIContext` without the HTTP layer.

## Override configuration per test

```typescript
describe("FeatureFlagService", () => {
  afterEach(() => PlatformTest.reset());

  it("should read the flag", async () => {
    await PlatformTest.create({features: {newCheckout: true}});

    expect(inject(FeatureFlagService).isEnabled()).toBe(true);
  });
});
```

## Controller unit test

```typescript
describe("UsersController", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return a user", async () => {
    const service = {findById: vi.fn().mockResolvedValue({id: "1"})};
    const controller = await PlatformTest.invoke<UsersController>(UsersController, [{token: UsersService, use: service}]);

    expect(await controller.get("1")).toEqual({id: "1"});
    expect(service.findById).toHaveBeenCalledWith("1");
  });
});
```

Parameter decorators (`@PathParams`, `@BodyParams`), validation and serialization do not run here. Cover them with an integration test.

## Middleware unit test

```typescript
describe("AuthMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should reject a request without token", async () => {
    const middleware = await PlatformTest.invoke<AuthMiddleware>(AuthMiddleware);
    const $ctx = PlatformTest.createRequestContext({
      event: {request: PlatformTest.createRequest({headers: {}})}
    });

    await expect(middleware.use($ctx)).rejects.toThrow("Unauthorized");
  });

  it("should store the user on the context", async () => {
    const middleware = await PlatformTest.invoke<AuthMiddleware>(AuthMiddleware);
    const $ctx = PlatformTest.createRequestContext({
      event: {request: PlatformTest.createRequest({headers: {authorization: "Bearer token"}})}
    });

    await middleware.use($ctx);

    expect($ctx.get("user")).toEqual({id: "1"});
  });
});
```

Pass to `use()` exactly the arguments its parameter decorators would receive (`@Context() $ctx`, `@HeaderParams("authorization") token`, ...). Header names in `createRequest` must be lower-case.

## Interceptor unit test

```typescript
describe("TimingInterceptor", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should call next and return its value", async () => {
    const interceptor = await PlatformTest.invoke<TimingInterceptor>(TimingInterceptor);
    const next = vi.fn().mockReturnValue("result");

    const result = await interceptor.intercept({target: UsersService, propertyKey: "findById", args: ["1"], next, options: {}}, next);

    expect(result).toEqual("result");
    expect(next).toHaveBeenCalledWith();
  });
});
```

To test the wiring (`@Intercept(TimingInterceptor)` on a method), replace the interceptor for the whole suite with `PlatformTest.create({imports: [{token: TimingInterceptor, use: {intercept: vi.fn((ctx, next) => next())}}]})`, then call the decorated method on `inject(UsersService)`.

## Service using the request context

```typescript
it("should read headers from the current context", async () => {
  const $ctx = PlatformTest.createRequestContext({
    event: {request: PlatformTest.createRequest({headers: {"x-api": "api"}})}
  });
  const repository = await PlatformTest.invoke<CustomRepository>(CustomRepository);

  const result = await runInContext($ctx, () => repository.findById("id"));

  expect(result).toEqual({id: "id", headers: {"x-api": "api"}});
});
```

## Integration: stub a service or a middleware

```typescript
import SuperTest from "supertest";
import {afterAll, beforeAll} from "vitest";
import {Server} from "../Server.js";

describe("GET /rest/chapters", () => {
  beforeAll(async () => {
    await PlatformTest.bootstrap(Server)();
    vi.spyOn(PlatformTest.get<AuthMiddleware>(AuthMiddleware), "use").mockResolvedValue(undefined);
    vi.spyOn(PlatformTest.get<ChapterService>(ChapterService), "findAll").mockResolvedValue([]);
  });
  afterAll(PlatformTest.reset);

  it("should return the chapters", async () => {
    const response = await SuperTest(PlatformTest.callback()).get("/rest/chapters").expect(200);

    expect(response.body).toEqual([]);
  });
});
```

Replace a provider for the whole server instead of spying:

```typescript
beforeAll(
  PlatformTest.bootstrap(Server, {
    imports: [{token: MailTransport, use: {send: vi.fn()}}] // also repeat the modules Server imports
  })
);
```

## Integration: assert an error payload

```typescript
it("should return 404", async () => {
  const response = await SuperTest(PlatformTest.callback()).get("/rest/unknown").expect(404);

  expect(response.body).toEqual({
    name: "NOT_FOUND",
    message: 'Resource "/rest/unknown" not found',
    status: 404,
    errors: []
  });
});
```

Customising this payload belongs to tsed-exceptions.

## Jest differences

- Replace `vi` by `jest` and drop the `vitest` import (Jest globals).
- Configure `transform: {"\\.(ts)$": "ts-jest"}` with `experimentalDecorators` and `emitDecoratorMetadata` in the tsconfig used by tests.
- `PlatformTest.bootstrap()` is heavy under Jest; keep integration specs few. See `https://tsed.dev/tutorials/jest.md`.

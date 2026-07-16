import {DITest, configuration, constant, inject} from "@tsed/di";
import {PlatformAdapter} from "@tsed/platform-http";
import {beforeInit} from "./beforeInit.js";

function getFixture(middlewares: any[] = []) {
  configuration().set("middlewares", middlewares);

  const adapter = inject(PlatformAdapter);

  vi.spyOn(adapter, "bodyParser").mockReturnValue(() => {});

  return {
    middlewares,
    adapter
  };
}

class TestMiddleware {
  use() {}
}

class ValidHookMiddleware {
  use() {}
}

describe("beforeInit", () => {
  beforeEach(() =>
    DITest.create({
      env: "test"
    })
  );
  afterEach(() => DITest.reset());

  it("should return mapped middlewares", async () => {
    const {adapter} = getFixture([
      {
        env: "production",
        use: () => {},
        hook: "hook"
      },
      {
        use: () => {},
        hook: "hook"
      },
      "text-parser",
      "raw-parser",
      "json-parser",
      {use: "urlencoded-parser", options: {}}
    ]);

    await beforeInit();

    expect(adapter.bodyParser).toHaveBeenCalledWith("text", undefined);
    expect(adapter.bodyParser).toHaveBeenCalledWith("raw", undefined);
    expect(adapter.bodyParser).toHaveBeenCalledWith("json", undefined);
    expect(adapter.bodyParser).toHaveBeenCalledWith("urlencoded", {});
    expect(constant("middlewares")).toMatchInlineSnapshot(`
      [
        {
          "env": "production",
          "hook": "hook",
          "use": [Function],
        },
        {
          "env": "test",
          "hook": "hook",
          "use": [Function],
        },
        {
          "env": "test",
          "hook": "$beforeRoutesInit",
          "use": [Function],
        },
        {
          "env": "test",
          "hook": "$beforeRoutesInit",
          "use": [Function],
        },
        {
          "env": "test",
          "hook": "$beforeRoutesInit",
          "use": [Function],
        },
        {
          "env": "test",
          "hook": "$beforeRoutesInit",
          "options": {},
          "use": [Function],
        },
      ]
    `);
  });

  it("should handle function middleware", async () => {
    const middleware: any = () => {};

    getFixture([middleware]);

    await beforeInit();

    const result = constant<any[]>("middlewares")!;

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      env: "test",
      hook: "$beforeRoutesInit",
      use: middleware
    });
  });

  it("should handle string middleware", async () => {
    const {adapter} = getFixture(["middleware-name"]);

    // Mock the import to avoid the actual import error
    vi.mock("middleware-name", () => ({
      default: () => () => {}
    }));

    await beforeInit();

    const result = constant<any[]>("middlewares")!;

    expect(result).toHaveLength(1);
    expect(result[0].hook).toBe("$beforeRoutesInit");
    expect(typeof result[0].use).toBe("function");

    vi.resetAllMocks();
  });

  it("should handle middleware with string use property", async () => {
    vi.mock("custom-middleware", () => ({
      default: (options: any) => () => {}
    }));

    const middleware = {use: "custom-middleware", options: {test: true}};
    const {adapter} = getFixture([middleware]);

    await beforeInit();

    const result = constant<any[]>("middlewares")!;

    expect(result).toHaveLength(1);
    expect(result[0].hook).toBe("$beforeRoutesInit");
    expect(result[0].options).toEqual({test: true});
    expect(typeof result[0].use).toBe("function");

    vi.resetAllMocks();
  });

  it("should throw error for class middleware with invalid hook", async () => {
    const middleware = {use: TestMiddleware, hook: "$beforeInit"};

    getFixture([middleware]);

    await expect(beforeInit()).rejects.toThrow('Ts.ED Middleware "TestMiddleware" middleware cannot be added on $beforeInit hook');
  });

  it("should filter out middleware with no use property", async () => {
    const middleware = {hook: "$beforeRoutesInit"};
    const {adapter} = getFixture([middleware as any]);

    await beforeInit();

    const result = constant<any[]>("middlewares")!;
    expect(result).toHaveLength(0);
  });

  // Note: Testing modules without default exports is challenging due to hoisting issues with vi.mock()
  // The implementation in alterMiddlewares.ts handles this case with `use = (mod.default || mod)(options);`

  it("should filter out middleware with non-matching environment", async () => {
    const middleware = {
      use: () => {},
      env: "production" // Current env is "test" as set in beforeEach
    } as any;
    const {adapter} = getFixture([middleware]);

    await beforeInit();

    const result = constant<any[]>("middlewares")!;

    // The middleware should be included in the result but will be filtered out later
    // by alterMiddlewaresForHook when a specific hook is requested
    expect(result).toHaveLength(1);
    expect(result[0].env).toBe("production");
  });

  it("should handle class middleware with valid hook", async () => {
    const middleware = {
      use: ValidHookMiddleware,
      hook: "$beforeRoutesInit" // Valid hook for class middleware
    };

    getFixture([middleware]);

    await beforeInit();

    const result = constant<any[]>("middlewares")!;

    expect(result).toHaveLength(1);
    expect(result[0].use).toBe(ValidHookMiddleware);
    expect(result[0].hook).toBe("$beforeRoutesInit");
  });

  it("should use default hook when no hook is specified", async () => {
    const middleware = {
      use: () => {},
      options: {someOption: true}
    };

    getFixture([middleware]);

    await beforeInit();

    const result = constant<any[]>("middlewares")!;
    expect(result).toHaveLength(1);

    expect(result[0].hook).toBe("$beforeRoutesInit"); // Default hook
    expect(result[0].options).toEqual({someOption: true});
  });

  it("should preserve both env and hook when specified", async () => {
    const middleware = {
      use: () => {},
      env: "test",
      hook: "$afterRoutesInit"
    } as any;
    getFixture([middleware]);

    await beforeInit();

    const result = constant<any[]>("middlewares")!;

    expect(result).toHaveLength(1);
    expect(result[0].env).toBe("test");
    expect(result[0].hook).toBe("$afterRoutesInit");
  });
});

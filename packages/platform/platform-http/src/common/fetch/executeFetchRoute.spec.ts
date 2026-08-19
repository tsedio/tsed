import {createNativeMiddleware, PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {createFetchContext} from "../utils/createContext.js";
import {PlatformTest} from "../../testing/PlatformTest.js";
import {executeFetchRoute} from "./executeFetchRoute.js";

describe("executeFetchRoute", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("executes portable handlers and rejects explicit native middleware", async () => {
    const portable = vi.fn();
    const native = vi.fn();
    const response = vi.fn();
    const $ctx = createFetchContext(new Request("https://tsed.dev/widgets"));
    const execute = executeFetchRoute([
      new PlatformHandlerMetadata({handler: portable, type: PlatformHandlerType.CTX_FN}),
      PlatformHandlerMetadata.from(createNativeMiddleware(native)),
      new PlatformHandlerMetadata({handler: response, type: PlatformHandlerType.RESPONSE_FN})
    ]);

    await expect(execute($ctx)).rejects.toThrow("native() middleware requires a compatible host bridge");

    expect(portable).toHaveBeenCalledWith($ctx, expect.any(Function));
    expect(native).not.toHaveBeenCalled();
    expect(response).not.toHaveBeenCalled();
  });

  it("implicitly advances and resumes a middleware after its Promise-based continuation", async () => {
    const calls: string[] = [];
    const $ctx = createFetchContext(new Request("https://tsed.dev/widgets"));
    const execute = executeFetchRoute([
      new PlatformHandlerMetadata({
        handler: async (_ctx: unknown, next: () => Promise<void>) => {
          calls.push("before");
          await next();
          calls.push("after");
        },
        type: PlatformHandlerType.CTX_FN
      }),
      new PlatformHandlerMetadata({
        handler: () => calls.push("endpoint"),
        type: PlatformHandlerType.ENDPOINT
      })
    ]);

    await execute($ctx);

    expect(calls).toEqual(["before", "endpoint", "after"]);
  });

  it("rejects a portable middleware that invokes its continuation twice", async () => {
    const $ctx = createFetchContext(new Request("https://tsed.dev/widgets"));
    const execute = executeFetchRoute([
      new PlatformHandlerMetadata({
        handler: async (_ctx: unknown, next: () => Promise<void>) => {
          await next();
          await next();
        },
        type: PlatformHandlerType.CTX_FN
      })
    ]);

    await expect(execute($ctx)).rejects.toThrow("A portable middleware continuation can only be called once");
  });

  it("rejects legacy @Next() injection from the portable pipeline", async () => {
    const $ctx = createFetchContext(new Request("https://tsed.dev/widgets"));
    const metadata = new PlatformHandlerMetadata({
      handler: () => {},
      type: PlatformHandlerType.MIDDLEWARE
    });
    Object.defineProperty(metadata, "hasNextFunction", {value: true});
    const execute = executeFetchRoute([metadata]);

    await expect(execute($ctx)).rejects.toThrow("@Next() is not supported by the portable middleware pipeline");
  });
});

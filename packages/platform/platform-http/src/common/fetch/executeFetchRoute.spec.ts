import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {createFetchContext} from "../utils/createContext.js";
import {PlatformTest} from "../../testing/PlatformTest.js";
import {executeFetchRoute} from "./executeFetchRoute.js";

describe("executeFetchRoute", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("executes portable handlers selected by the host and skips native handlers", async () => {
    const portable = vi.fn();
    const native = vi.fn();
    const response = vi.fn();
    const $ctx = createFetchContext(new Request("https://tsed.dev/widgets"));
    const execute = executeFetchRoute([
      new PlatformHandlerMetadata({handler: portable, type: PlatformHandlerType.CTX_FN}),
      new PlatformHandlerMetadata({handler: native}),
      new PlatformHandlerMetadata({handler: response, type: PlatformHandlerType.RESPONSE_FN})
    ]);

    await execute($ctx);

    expect(portable).toHaveBeenCalledWith($ctx);
    expect(native).not.toHaveBeenCalled();
    expect(response).not.toHaveBeenCalled();
  });
});

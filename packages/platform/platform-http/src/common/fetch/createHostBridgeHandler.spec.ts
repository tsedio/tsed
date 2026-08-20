import {PlatformTest} from "../../testing/PlatformTest.js";
import {createHostBridgeHandler} from "./createHostBridgeHandler.js";

describe("createHostBridgeHandler", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("runs the shared execution cycle with bridge-owned context and response writing", async () => {
    const native = {request: {id: "request"}, response: {id: "response"}};
    const $ctx = PlatformTest.createRequestContext({event: native, fetch: new Request("https://tsed.dev/widgets")});
    const writeResponse = vi.fn();
    const bridge = {
      name: "test",
      createContext: vi.fn().mockResolvedValue($ctx),
      writeResponse
    };
    const execute = vi.fn(($ctx) => $ctx.response.status(201).body("created"));
    const handler = createHostBridgeHandler(bridge, execute);

    await handler(native);

    expect(bridge.createContext).toHaveBeenCalledWith(native);
    expect(execute).toHaveBeenCalledWith($ctx);
    expect(writeResponse).toHaveBeenCalledWith($ctx, expect.any(Response));
    expect((writeResponse.mock.calls[0][1] as Response).status).toBe(201);
  });
});

import {closeServer} from "./closeServer.js";

describe("closeServer", () => {
  it("should close the server", async () => {
    const server: any = {
      close: vi.fn().mockImplementation((cb) => cb())
    };
    expect(await closeServer(server)).toEqual(undefined);
    expect(server.close).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should handle undefined close method (fastify)", async () => {
    const server: any = {
      close: undefined
    };
    expect(await closeServer(server)).toEqual(undefined);
  });
});

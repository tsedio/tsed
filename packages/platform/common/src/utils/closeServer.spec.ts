import {closeServer} from "./closeServer";

describe("closeServer", () => {
  it("should close the server", async () => {
    const server: any = {
      close: jest.fn().mockImplementation((cb) => cb())
    };
    expect(await closeServer(server)).toEqual(undefined);
    expect(server.close).toHaveBeenCalledWith(expect.any(Function));
  });
});

import {PlatformExpress} from "./PlatformExpress.js";

class Server {}

describe("PlatformExpress", () => {
  describe("create()", () => {
    it("should create platform", () => {
      const platform = PlatformExpress.create(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformExpress);
    });
  });
  describe("bootstrap()", () => {
    it("should create platform", async () => {
      const platform = await PlatformExpress.bootstrap(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformExpress);
    });
  });

  describe("bodyParser()", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return the body parser (json)", () => {
      const stub = vi.fn().mockReturnValue("body");

      const platform = PlatformExpress.create(Server, {
        express: {
          bodyParser: {
            json: stub
          }
        }
      });

      const result = platform.adapter.bodyParser("json", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toHaveBeenCalledWith({strict: true, verify: expect.any(Function)});
    });
    it("should return the body parser (urlencoded)", () => {
      const stub = vi.fn().mockReturnValue("body");

      const platform = PlatformExpress.create(Server, {
        express: {
          bodyParser: {
            urlencoded: stub
          }
        }
      });

      const result = platform.adapter.bodyParser("urlencoded", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toHaveBeenCalledWith({extended: true, strict: true, verify: expect.any(Function)});
    });
  });
});

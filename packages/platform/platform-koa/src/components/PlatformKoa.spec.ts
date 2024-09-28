import {PlatformKoa} from "./PlatformKoa.js";

class Server {}

describe("PlatformKoa", () => {
  describe("create()", () => {
    it("should create platform", () => {
      const platform = PlatformKoa.create(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformKoa);
    });
  });
  describe("bootstrap()", () => {
    it("should create platform", async () => {
      const platform = await PlatformKoa.bootstrap(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformKoa);
    });
  });
  describe("bodyParser()", () => {
    it("should return the body parser (json)", () => {
      const stub = vi.fn().mockReturnValue("body");

      const platform = PlatformKoa.create(Server, {
        koa: {
          bodyParser: stub
        }
      });

      const result = platform.adapter.bodyParser("json", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toHaveBeenCalledWith({strict: true});
    });
    it("should return the body parser (raw)", () => {
      const stub = vi.fn().mockReturnValue("body");

      const platform = PlatformKoa.create(Server, {
        koa: {
          bodyParser: stub
        }
      });

      const result = platform.adapter.bodyParser("raw", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toHaveBeenCalledWith({strict: true});
    });
    it("should return the body parser (urlencoded)", () => {
      const stub = vi.fn().mockReturnValue("body");

      const platform = PlatformKoa.create(Server, {
        koa: {
          bodyParser: stub
        }
      });

      const result = platform.adapter.bodyParser("urlencoded", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toHaveBeenCalledWith({strict: true});
    });
  });
});

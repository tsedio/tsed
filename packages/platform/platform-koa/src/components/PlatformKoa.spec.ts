import {PlatformBuilder} from "@tsed/platform-http";
import {PlatformKoa} from "./PlatformKoa.js";

class Server {}

describe("PlatformKoa", () => {
  describe("create()", () => {
    it("should create platform", () => {
      const platform = PlatformKoa.create(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformKoa);
    });

    it("should create platform from settings", () => {
      const platform = PlatformKoa.create({httpPort: 8080});

      expect(platform.adapter).toBeInstanceOf(PlatformKoa);
    });
  });
  describe("bootstrap()", () => {
    it("should create platform", async () => {
      const platform = await PlatformKoa.bootstrap({
        rootModule: Server
      });

      expect(platform.adapter).toBeInstanceOf(PlatformKoa);
    });

    it("should create platform from settings", async () => {
      const bootstrap = vi.spyOn(PlatformBuilder.prototype, "bootstrap").mockResolvedValue({} as never);

      await PlatformKoa.bootstrap({httpPort: false});

      expect(bootstrap).toHaveBeenCalledOnce();
      vi.resetAllMocks();
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

import {PlatformHapi} from "./PlatformHapi";

class Server {}

describe("PlatformKoa", () => {
  describe("create()", () => {
    it("should create platform", () => {
      const platform = PlatformHapi.create(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformHapi);
    });
  });
  describe("bootstrap()", () => {
    it("should create platform", async () => {
      const platform = await PlatformHapi.bootstrap(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformHapi);
    });
  });
  describe("bodyParser()", () => {
    it("should return the body parser (json) ", () => {
      const stub = jest.fn().mockReturnValue("body");

      const platform = PlatformHapi.create(Server, {
        koa: {
          bodyParser: stub
        }
      });

      const result = platform.adapter.bodyParser("json", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toBeCalledWith({strict: true});
    });
    it("should return the body parser (raw) ", () => {
      const stub = jest.fn().mockReturnValue("body");

      const platform = PlatformHapi.create(Server, {
        koa: {
          bodyParser: stub
        }
      });

      const result = platform.adapter.bodyParser("raw", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toBeCalledWith({strict: true});
    });
    it("should return the body parser (urlencoded) ", () => {
      const stub = jest.fn().mockReturnValue("body");

      const platform = PlatformHapi.create(Server, {
        koa: {
          bodyParser: stub
        }
      });

      const result = platform.adapter.bodyParser("urlencoded", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toBeCalledWith({strict: true});
    });
  });
});

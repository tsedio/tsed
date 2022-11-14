import {PlatformExpress} from "@tsed/platform-express";

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
    beforeEach(() => jest.resetAllMocks());
    it("should return the body parser (json) ", () => {
      const stub = jest.fn().mockReturnValue("body");

      const platform = PlatformExpress.create(Server, {
        express: {
          bodyParser: {
            json: stub
          }
        }
      });

      const result = platform.adapter.bodyParser("json", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toBeCalledWith({strict: true, verify: expect.any(Function)});
    });
    it("should return the body parser (urlencoded) ", () => {
      const stub = jest.fn().mockReturnValue("body");

      const platform = PlatformExpress.create(Server, {
        express: {
          bodyParser: {
            urlencoded: stub
          }
        }
      });

      const result = platform.adapter.bodyParser("urlencoded", {strict: true});

      expect(result).toEqual("body");
      expect(stub).toBeCalledWith({extended: true, strict: true, verify: expect.any(Function)});
    });
  });
});

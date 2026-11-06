import fulmine from "fulmine.js";

import {PlatformFulmine} from "./PlatformFulmine.js";

class Server {}

describe("PlatformFulmine", () => {
  describe("bodyParser()", () => {
    it("should use the parser set in express.bodyParser", () => {
      const stub = vi.fn().mockReturnValue("body");

      const platform = PlatformFulmine.create(Server, {
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
    it("should use the fulmine parser by default", () => {
      const spy = vi.spyOn(fulmine as any, "urlencoded");
      const platform = PlatformFulmine.create(Server, {});

      platform.adapter.bodyParser("urlencoded", {limit: "1mb"});

      expect(spy).toHaveBeenCalledWith({extended: true, limit: "1mb", verify: expect.any(Function)});
    });
  });
});

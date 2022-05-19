import {PlatformBuilder} from "@tsed/common";
import {PlatformFastify} from "./PlatformFastify";

class Server {}

describe("PlatformFastify", () => {
  describe("create()", () => {
    beforeEach(() => {
      jest.spyOn(PlatformBuilder, "create").mockReturnValue({});
    });
    afterEach(() => jest.resetAllMocks());
    it("should create platform", () => {
      PlatformFastify.create(Server, {});

      expect(PlatformBuilder.create).toHaveBeenCalledWith(Server, {
        adapter: PlatformFastify
      });
    });
  });
  describe("bootstrap()", () => {
    beforeEach(() => {
      jest.spyOn(PlatformBuilder, "bootstrap").mockReturnValue({});
    });
    afterEach(() => jest.resetAllMocks());
    it("should create platform", async () => {
      await PlatformFastify.bootstrap(Server, {});

      expect(PlatformBuilder.bootstrap).toHaveBeenCalledWith(Server, {
        adapter: PlatformFastify
      });
    });
  });
});

import {PlatformBuilder} from "@tsed/platform-http";

import {PlatformFastify} from "./PlatformFastify.js";

class Server {}

describe("PlatformFastify", () => {
  describe("create()", () => {
    beforeEach(() => {
      vi.spyOn(PlatformBuilder, "create").mockReturnValue({});
    });
    afterEach(() => vi.resetAllMocks());
    it("should create platform", () => {
      PlatformFastify.create(Server, {});

      expect(PlatformBuilder.create).toHaveBeenCalledWith(Server, {
        adapter: PlatformFastify
      });
    });
  });
  describe("bootstrap()", () => {
    beforeEach(() => {
      vi.spyOn(PlatformBuilder, "bootstrap").mockReturnValue({});
    });
    afterEach(() => vi.resetAllMocks());
    it("should create platform", async () => {
      await PlatformFastify.bootstrap(Server, {});

      expect(PlatformBuilder.bootstrap).toHaveBeenCalledWith(Server, {
        adapter: PlatformFastify
      });
    });
  });
});

import {PlatformBuilder} from "@tsed/platform-http";
import {PlatformFastify} from "./PlatformFastify.js";

class Server {}

describe("PlatformFastify", () => {
  describe("create()", () => {
    it("should create platform", () => {
      const platform = PlatformFastify.create(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformFastify);
    });

    it("should create platform from settings", () => {
      const platform = PlatformFastify.create({httpPort: 8080});

      expect(platform.adapter).toBeInstanceOf(PlatformFastify);
    });
  });
  describe("bootstrap()", () => {
    it("should create platform", async () => {
      const platform = await PlatformFastify.bootstrap(Server, {});

      expect(platform.adapter).toBeInstanceOf(PlatformFastify);
    });

    it("should create platform from settings", async () => {
      const bootstrap = vi.spyOn(PlatformBuilder.prototype, "bootstrap").mockResolvedValue({} as never);

      await PlatformFastify.bootstrap({httpPort: false});

      expect(bootstrap).toHaveBeenCalledOnce();
      vi.resetAllMocks();
    });
  });
});

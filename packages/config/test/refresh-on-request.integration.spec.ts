import "../src/index.js";

import {constant, DITest, inject} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";

import {CONFIG_SOURCES} from "../src/constants/constants.js";
import {type ConfigSource, withOptions} from "../src/index.js";

class TestConfigSource implements ConfigSource {
  options: {};

  watch = vi.fn().mockReturnValue(vi.fn());

  read = vi.fn().mockResolvedValue({
    test: "string",
    test2: "string-3"
  });

  getAll() {
    return this.read();
  }
}

describe("@tsed/config: refresh on Request", () => {
  describe("when watch is true", () => {
    beforeEach(() =>
      DITest.create({
        extends: [
          withOptions(TestConfigSource, {
            refreshOn: "request"
          })
        ]
      })
    );
    afterEach(() => DITest.reset());

    it("should refresh configuration on request", async () => {
      const configs = inject<CONFIG_SOURCES>(CONFIG_SOURCES);

      expect(constant("test")).toEqual("string");

      vi.spyOn(configs["test"] as any, "read").mockResolvedValueOnce({
        test: "string-2",
        test2: "string-4"
      });

      await $asyncEmit("$onRequest");

      expect((configs["test"] as any).read).toHaveBeenCalledTimes(1);
      expect(constant("test")).toEqual("string-2");
    });
  });
});

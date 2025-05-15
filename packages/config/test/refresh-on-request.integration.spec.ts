import "../src/index.js";

import {constant, DITest, inject} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";

import {CONFIG_SOURCES} from "../src/constants/constants.js";
import {type ConfigSource, withOptions} from "../src/index.js";

class TestConfigSource implements ConfigSource {
  options: {};

  watch = vi.fn().mockReturnValue(vi.fn());

  getAll() {
    return Promise.resolve({
      test: "string",
      test2: "string-3",
      ...this.options
    });
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

      vi.spyOn(configs["test"], "getAll").mockResolvedValueOnce({
        test: "string-2",
        test2: "string-4"
      });

      await $asyncEmit("$onRequest");

      expect(configs["test"].getAll).toHaveBeenCalledTimes(1);
      expect(constant("test")).toEqual("string-2");
    });
  });
});

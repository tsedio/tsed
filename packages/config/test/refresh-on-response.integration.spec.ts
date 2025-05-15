import "../src/index.js";

import {constant, DITest, inject, logger} from "@tsed/di";
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

describe("@tsed/config: refresh on response", () => {
  describe("when watch is true", () => {
    beforeEach(() =>
      DITest.create({
        extends: [
          withOptions(TestConfigSource, {
            refreshOn: "response"
          })
        ]
      })
    );
    afterEach(() => DITest.reset());

    it("should refresh configuration on response", async () => {
      const configs = inject<CONFIG_SOURCES>(CONFIG_SOURCES);

      expect(constant("test")).toEqual("string");

      vi.spyOn(configs["test"], "getAll").mockResolvedValueOnce({
        test: "string-2",
        test2: "string-4"
      });

      await $asyncEmit("$onResponse");

      expect(configs["test"].getAll).toHaveBeenCalledTimes(1);
      expect(constant("test")).toEqual("string-2");
    });
    it("should refresh configuration on response and catch error", async () => {
      const configs = inject<CONFIG_SOURCES>(CONFIG_SOURCES);

      expect(constant("test")).toEqual("string");

      vi.spyOn(configs["test"], "getAll").mockRejectedValue(new Error("message"));

      vi.spyOn(logger(), "error");

      await $asyncEmit("$onResponse");

      expect(configs["test"].getAll).toHaveBeenCalledTimes(1);
      expect(logger().error).toHaveBeenCalledWith({
        event: "CONFIG_SOURCE_REFRESH_ERROR",
        hook: "$onResponse",
        error_message: "message",
        error_name: "Error",
        error_stack: expect.stringMatching(/Error: message/)
      });
    });
  });
});

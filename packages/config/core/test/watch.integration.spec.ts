import "../src/index.js";

import {DITest, inject} from "@tsed/di";

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

describe("@tsed/config: watch", () => {
  describe("when watch is true", () => {
    beforeEach(() =>
      DITest.create({
        extends: [
          withOptions(TestConfigSource, {
            watch: true
          })
        ]
      })
    );
    afterEach(() => DITest.reset());

    it("should watch method", () => {
      const configs = inject<CONFIG_SOURCES>(CONFIG_SOURCES);

      expect(configs.test).toBeDefined();
      expect(configs.test.watch).toHaveBeenCalledWith(expect.any(Function));
    });
  });
  describe("when watch is false", () => {
    beforeEach(() =>
      DITest.create({
        extends: [
          withOptions(TestConfigSource, {
            watch: false
          })
        ]
      })
    );
    afterEach(() => DITest.reset());

    it("should not call watch method", () => {
      const configs = inject<CONFIG_SOURCES>(CONFIG_SOURCES);

      expect(configs.test).toBeDefined();
      expect(configs.test.watch).not.toHaveBeenCalled();
    });
  });
});

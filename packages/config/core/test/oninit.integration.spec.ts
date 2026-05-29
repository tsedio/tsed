import "../src/index.js";

import {constant, DITest, inject} from "@tsed/di";

import {CONFIG_SOURCES, type ConfigSource, withOptions} from "../src/index.js";

class TestConfigSource implements ConfigSource {
  options: {
    hello?: string;
  };

  $onInit = vi.fn();

  getAll() {
    return Promise.resolve({
      value: "string",
      value2: "string-3",
      ...this.options
    });
  }
}

describe("@tsed/config: $onInit", () => {
  describe("without options", () => {
    beforeEach(() =>
      DITest.create({
        extends: [TestConfigSource]
      })
    );
    afterEach(() => DITest.reset());

    it("should getAll config source", () => {
      const configs = inject<CONFIG_SOURCES>(CONFIG_SOURCES);
      expect(configs.test.$onInit).toHaveBeenCalledTimes(1);
    });
  });
});

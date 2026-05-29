import "../hooks/afterResolveConfiguration.js";

import {DITest, inject, Injectable} from "@tsed/di";

import type {ConfigSource} from "../interfaces/ConfigSource.js";
import {InjectConfigSource} from "./injectConfigSource.js";

class TestConfigSource implements ConfigSource {
  options: {
    hello?: string;
  };

  getAll() {
    return Promise.resolve({
      value: "string",
      value2: "string-3",
      ...this.options
    });
  }
}

@Injectable()
class MyService {
  @InjectConfigSource("test")
  config: TestConfigSource;
}

describe("@InjectConfigSource", () => {
  describe("without options", () => {
    beforeEach(() =>
      DITest.create({
        extends: [TestConfigSource]
      })
    );
    afterEach(() => DITest.reset());

    it("should inject configuration source", () => {
      const service = inject(MyService);

      expect(service.config).toBeInstanceOf(TestConfigSource);
    });
  });
});

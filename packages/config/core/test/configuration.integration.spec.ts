import "../src/index.js";

import {constant, DITest} from "@tsed/di";

import {type ConfigSource, withOptions} from "../src/index.js";

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

class Test2ConfigSource implements ConfigSource {
  options: {
    hello2?: string;
  };

  getAll() {
    return Promise.resolve({
      value: "string-2",
      ...this.options
    });
  }
}

describe("@tsed/config: basic usage", () => {
  describe("without options", () => {
    beforeEach(() =>
      DITest.create({
        extends: [TestConfigSource, Test2ConfigSource]
      })
    );
    afterEach(() => DITest.reset());

    it("should getAll config source", () => {
      expect(constant("value")).toEqual("string-2");
      expect(constant("value2")).toEqual("string-3");
      expect(constant("configs")).toEqual({
        test: {
          value: "string",
          value2: "string-3"
        },
        test2: {
          value: "string-2"
        }
      });
      expect(constant("configs.test.value")).toEqual("string");
    });
  });

  describe("with options", () => {
    beforeEach(() =>
      DITest.create({
        extends: [
          withOptions(TestConfigSource, {
            hello: "hello"
          }),
          withOptions(Test2ConfigSource, {
            hello2: "hello2"
          })
        ]
      })
    );
    afterEach(() => DITest.reset());

    it("should getAll config source", () => {
      expect(constant("value")).toEqual("string-2");
      expect(constant("value2")).toEqual("string-3");
      expect(constant("hello")).toEqual("hello");
      expect(constant("hello2")).toEqual("hello2");
    });
  });
});

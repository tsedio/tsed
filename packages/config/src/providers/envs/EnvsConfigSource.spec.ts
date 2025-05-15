import {EnvsConfigSource} from "./EnvsConfigSource.js";

describe("EnvsConfigSource", () => {
  describe("getAll()", () => {
    it("should return all environment variables", () => {
      process.env.TEST_VAR = "test";
      process.env.TEST_VAR_2 = "test2";

      const source = new EnvsConfigSource();
      source.options = {};

      const result = source.getAll();

      expect(result.TEST_VAR).toEqual("test");
      expect(result.TEST_VAR_2).toEqual("test2");
    });

    it("should parse JSON values if parseJson is true", () => {
      process.env.TEST_JSON = '{"key":"value"}';

      const source = new EnvsConfigSource();
      source.options = {parseJson: true};

      const result = source.getAll();

      expect(result.TEST_JSON).toEqual({key: "value"});
    });

    it("should not parse JSON values if parseJson is false", () => {
      process.env.TEST_JSON = '{"key":"value"}';

      const source = new EnvsConfigSource();
      source.options = {parseJson: false};

      const result = source.getAll();

      expect(result.TEST_JSON).toEqual('{"key":"value"}');
    });
    it("should handle invalid JSON gracefully", () => {
      process.env.INVALID_JSON = "{invalid json}";

      const source = new EnvsConfigSource();
      source.options = {parseJson: true};

      const result = source.getAll();

      // Check that it falls back to the string value when parsing fails
      expect(result.INVALID_JSON).toEqual("{invalid json}");
    });
  });
});

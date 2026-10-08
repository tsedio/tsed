import {existsSync, readFileSync, watch} from "node:fs";
import {load} from "js-yaml";
import {YamlConfigSource} from "./YamlConfigSource.js";

vi.mock("node:fs");
vi.mock("js-yaml");

describe("YamlConfigSource", () => {
  describe("getAll()", () => {
    it("should read YAML file and return parsed object", async () => {
      const source = new YamlConfigSource();
      source.options = {
        path: "./test.yaml"
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue("key: value");
      vi.mocked(load).mockReturnValue({key: "value"});

      const result = await source.getAll();

      expect(readFileSync).toHaveBeenCalledWith("./test.yaml", "utf8");
      expect(load).toHaveBeenCalledWith("key: value", {});
      expect(result).toEqual({key: "value"});
    });
    it("should return empty object if the file is empty", async () => {
      const source = new YamlConfigSource();
      source.options = {
        path: "./test.yaml",
        encoding: "latin1"
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue("");
      vi.mocked(load).mockReturnValue(undefined);

      const result = await source.getAll();

      expect(readFileSync).toHaveBeenCalledWith("./test.yaml", "latin1");
      expect(result).toEqual({});
    });
    it("should return empty object if file does not exist", async () => {
      const source = new YamlConfigSource();
      source.options = {
        path: "./test.yaml"
      };

      vi.mocked(existsSync).mockReturnValue(false);

      const result = await source.getAll();

      expect(result).toEqual({});
    });
  });

  describe("watch()", () => {
    it("should call watch with the correct path", () => {
      const source = new YamlConfigSource();
      source.options = {
        path: "./test.yaml"
      };

      const mockOnChange = vi.fn();

      const mockWatcher = {
        close: vi.fn()
      };

      vi.mocked(watch).mockReturnValue(mockWatcher as any);

      const result = source.watch(mockOnChange);

      expect(watch).toHaveBeenCalledWith("./test.yaml", mockOnChange);
      expect(result).toBeInstanceOf(Function);

      result();

      expect(mockWatcher.close).toHaveBeenCalled();
    });
  });
});

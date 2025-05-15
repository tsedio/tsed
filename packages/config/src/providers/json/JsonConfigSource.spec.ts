import {existsSync, readFileSync, watch} from "node:fs";

import {JsonConfigSource} from "./JsonConfigSource.js";

vi.mock("node:fs");
describe("JsonConfigSource", () => {
  describe("getAll()", () => {
    it("should read JSON file and return parsed object", () => {
      const source = new JsonConfigSource();
      source.options = {
        path: "./test.json"
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue(JSON.stringify({key: "value"}));

      const result = source.getAll();

      expect(result).toEqual({key: "value"});
    });
    it("should return empty object if file does not exist", () => {
      const source = new JsonConfigSource();
      source.options = {
        path: "./test.json"
      };

      vi.mocked(existsSync).mockReturnValue(false);

      const result = source.getAll();

      expect(result).toEqual({});
    });
  });

  describe("watch()", () => {
    it("should call watch with the correct path", () => {
      const source = new JsonConfigSource();
      source.options = {
        path: "./test.json"
      };

      const mockOnChange = vi.fn();

      const mockWatcher = {
        close: vi.fn()
      };

      vi.mocked(watch).mockReturnValue(mockWatcher as any);

      const result = source.watch(mockOnChange);

      expect(watch).toHaveBeenCalledWith("./test.json", mockOnChange);
      expect(result).toBeInstanceOf(Function);

      result();

      expect(mockWatcher.close).toHaveBeenCalled();
    });
  });
});

import {clearCache, getFromCache, setToCache} from "./cache.js";

describe("cache", () => {
  describe("setToCache()", () => {
    it("should set result to cache", () => {
      setToCache("key", "value");
      expect(getFromCache("key")).toEqual("value");

      clearCache();
      expect(getFromCache("key")).toEqual(undefined);
    });
  });
});

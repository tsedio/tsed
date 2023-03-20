import {expect} from "chai";
import {clearCache, getFromCache, setToCache} from "./cache";

describe("cache", () => {
  describe("setToCache()", () => {
    it("should set result to cache", () => {
      setToCache("key", "value");
      expect(getFromCache("key")).to.equal("value");

      clearCache();
      expect(getFromCache("key")).to.equal(undefined);
    });
  });
});

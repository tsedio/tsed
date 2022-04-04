import {clearCache, getFromCache, setToCache} from "@tsed/engines";
import {expect} from "chai";

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

import {inject, TestContext} from "@tsed/testing";
import {MemoryStorage} from "./MemoryStorage";

describe("MemoryStorage", () => {
  before(() => TestContext.create());
  before(() => TestContext.reset());

  describe("get()", () => {
    it("should return value stored in memoryStorage", inject([MemoryStorage], (memoryStorage: MemoryStorage) => {
      // GIVEN
      memoryStorage.set("key", "value");

      // WHEN
      memoryStorage.get("key").should.eq("value");
    }));
  });
});

import {PlatformTest} from "@tsed/common";
import {MemoryStorage} from "./MemoryStorage";

describe("MemoryStorage", () => {
  before(() => PlatformTest.create());
  before(() => PlatformTest.reset());

  describe("get()", () => {
    it("should return value stored in memoryStorage", PlatformTest.inject([MemoryStorage], (memoryStorage: MemoryStorage) => {
      // GIVEN
      memoryStorage.set("key", "value");

      // WHEN
      memoryStorage.get("key").should.eq("value");
    }));
  });
});

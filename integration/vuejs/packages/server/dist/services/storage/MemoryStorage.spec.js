"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@tsed/testing");
const MemoryStorage_1 = require("./MemoryStorage");
describe("MemoryStorage", () => {
    before(() => testing_1.TestContext.create());
    before(() => testing_1.TestContext.reset());
    describe("get()", () => {
        it("should return value stored in memoryStorage", testing_1.inject([MemoryStorage_1.MemoryStorage], (memoryStorage) => {
            // GIVEN
            memoryStorage.set("key", "value");
            // WHEN
            memoryStorage.get("key").should.eq("value");
        }));
    });
});
//# sourceMappingURL=MemoryStorage.spec.js.map
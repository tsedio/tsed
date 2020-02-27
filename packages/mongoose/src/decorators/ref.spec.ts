import {Schema} from "mongoose";
import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../../src/constants";
import {Ref} from "../../src/decorators";
import {expect} from "chai";

describe("@Ref()", () => {
  describe("type is a class", () => {
    class Test {}

    class RefTest {}

    before(() => {
      Store.from(RefTest).set(MONGOOSE_MODEL_NAME, "RefTest");
      Ref(RefTest)(Test, "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });

    it("should set metadata", () => {
      expect(this.store.get(MONGOOSE_SCHEMA)).to.deep.eq({
        type: Schema.Types.ObjectId,
        ref: "RefTest"
      });
    });
  });

  describe("type is a string", () => {
    class Test {}

    class RefTest {}

    before(() => {
      Store.from(RefTest).set(MONGOOSE_MODEL_NAME, "RefTest");
      Ref("RefTest")(Test, "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });

    it("should set metadata", () => {
      expect(this.store.get(MONGOOSE_SCHEMA)).to.deep.eq({
        type: Schema.Types.ObjectId,
        ref: "RefTest"
      });
    });
  });
});

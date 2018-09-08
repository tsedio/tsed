import {expect} from "chai";
import {Readonly, Writable} from "../../../../packages/core/src/decorators";
import {descriptorOf} from "../../../../packages/core/src/utils";

class Test {}

describe("Writable", () => {
  it("should set attribut as writable", () => {
    Writable()(Test, "test");
    expect(descriptorOf(Test, "test").writable).to.eq(true);
  });
  it("should set attribut as readonly", () => {
    Readonly()(Test, "test");
    expect(descriptorOf(Test, "test").writable).to.eq(false);
  });
});

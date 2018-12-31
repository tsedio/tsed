import {expect} from "chai";
import {descriptorOf, Readonly, Writable} from "../../src";

class Test {
}

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

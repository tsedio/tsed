import {Ignore, Property} from "@tsed/schema";
import {expect} from "chai";
import {serialize} from "../../src";

describe("Mapping @Ignore", () => {
  it("should serialize model", () => {
    class Base {
      @Ignore()
      ignoreMeBase: string;

      @Property()
      fooBase: string;
    }

    class MyModel extends Base {
      @Property()
      foo: string;

      @Ignore()
      ignoreMe: string;
    }

    const model = new MyModel();
    model.foo = "foo";
    model.ignoreMe = "ignoreMe";
    model.fooBase = "fooBase";
    model.ignoreMeBase = "ignoreMeBase";

    const result = serialize(model, {type: Object});

    expect(result).to.deep.eq({
      foo: "foo",
      fooBase: "fooBase"
    });
  });
});

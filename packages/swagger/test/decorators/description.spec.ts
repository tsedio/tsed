import {JsonSchema} from "@tsed/common";
import {decoratorArgs, Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {stubSchemaDecorator} from "../../../common/test/jsonschema/decorators/utils";
import {prototypeOf} from "../../../core/src/utils";
import {Description} from "../../src";

class Test {
  test(a: any) {
  }
}

describe("Description()", () => {
  describe("on method", () => {
    before(() => {
      const args = decoratorArgs(prototypeOf(Test), "test");
      Description("description")(...args);
      this.store = Store.from(...args);
    });
    it("should set the operation", () => {
      expect(this.store.get("operation")).to.deep.eq({description: "description"});
    });
  });

  describe("on param", () => {
    before(() => {
      const args = [Test, "test", 0];
      Description("description")(...args);
      this.store = Store.from(...args);
    });
    it("should set the baseParameter", () => {
      expect(this.store.get("baseParameter")).to.deep.eq({description: "description"});
    });
  });

  describe("on class and property", () => {
    before(() => {
      this.decorator = Sinon.stub();
      this.decorateStub = stubSchemaDecorator().returns(this.decorator);
      this.schema = new JsonSchema();
      Description("description")(Test);
      this.store = Store.from(Test);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store data", () => {
      this.schema.description.should.be.eq("description");
    });

    it("should set the tag", () => {
      expect(this.store.get("description")).to.deep.eq("description");
    });
  });
});

import {Store} from "../../../../packages/core/class/Store";
import {decoratorArgs} from "../../../../packages/core/utils";
import {JsonSchema} from "../../../../packages/common/jsonschema/class/JsonSchema";
import {Description} from "../../../../packages/swagger/decorators/description";
import {expect, Sinon} from "../../../tools";
import {stubSchemaDecorator} from "../../jsonschema/decorators/utils";

class Test {
  test(a: any) {}
}

describe("Description()", () => {
  describe("on method", () => {
    before(() => {
      const args = decoratorArgs(Test, "test");
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

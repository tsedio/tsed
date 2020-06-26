import {JsonSchema} from "@tsed/common";
import {stubSchemaDecorator} from "@tsed/common/src/jsonschema/decorators/utils";
import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {Description} from "../index";

describe("Description()", () => {
  describe("on method", () => {
    it("should set the operation", () => {
      class Test {
        @Description("description")
        test(a: any) {
        }
      }

      const store = Store.fromMethod(Test, "test");
      expect(store.get("operation")).to.deep.eq({description: "description"});
    });
  });

  describe("on param", () => {
    it("should set the baseParameter", () => {
      class Test {
        test(@Description("description") a: any) {
        }
      }

      const store = Store.from(Test, "test", 0);
      expect(store.get("baseParameter")).to.deep.eq({description: "description"});
    });
  });

  describe("on class and property", () => {
    const decorator = Sinon.stub();
    let decorateStub: any;
    before(() => {
      decorateStub = stubSchemaDecorator().returns(decorator);
    });
    after(() => {
      decorateStub.restore();
    });

    it("should store data", () => {
      @Description("description")
      class Test {
      }

      const schema = new JsonSchema();

      const store = Store.from(Test);
      decorateStub.getCall(0).args[0](schema);

      expect(schema.description).to.eq("description");
      expect(store.get("description")).to.deep.eq("description");
    });
  });
});

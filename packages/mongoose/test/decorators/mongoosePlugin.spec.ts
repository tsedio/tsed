import {MongoosePlugin} from "../../src/decorators/mongoosePlugin";
import * as mod from "../../src/utils/schemaOptions";
import * as Sinon from "sinon";

describe("@MongoosePlugin()", () => {
  class Test {}

  before(() => {
    this.applySchemaOptionsStub = Sinon.stub(mod, "applySchemaOptions");
    this.fn = () => {};
    MongoosePlugin("fn" as any, "options" as any)(Test);
  });

  after(() => {
    this.applySchemaOptionsStub.restore();
  });

  it("should call applySchemaOptions", () => {
    this.applySchemaOptionsStub.should.have.been.calledWithExactly(Test, {
      plugins: [
        {
          plugin: "fn",
          options: "options"
        }
      ]
    });
  });
});

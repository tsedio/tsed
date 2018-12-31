import * as Sinon from "sinon";
import {JsonSchemesRegistry, PropertyRegistry} from "../../../src/jsonschema";
import {decoratorSchemaFactory} from "../../../src/jsonschema/utils/decoratorSchemaFactory";

class Test {
}

describe("decoratorSchemaFactory()", () => {
  describe("when there is a property", () => {
    before(() => {
      this.getStub = Sinon.stub(PropertyRegistry, "get");
      this.getStub.returns({schema: "schema"});

      this.decoratorStub = Sinon.stub();
      this.cbStub = Sinon.stub().returns(this.decoratorStub);
      decoratorSchemaFactory(this.cbStub)(Test, "test");
    });

    after(() => {
      this.getStub.restore();
    });

    it("should call PropertyRegistry.get()", () => {
      this.getStub.should.be.calledWithExactly(Test, "test");
    });

    it("should call the fn callback with the correct parameters", () => {
      this.cbStub.should.be.calledWithExactly("schema", [Test, "test"]);
    });

    it("should cal the decorators returned by the fn callback", () => {
      this.decoratorStub.should.be.calledWithExactly(Test, "test");
    });
  });

  describe("when there is a class", () => {
    before(() => {
      this.getStub = Sinon.stub(JsonSchemesRegistry, "get");
      this.getStub.returns("schema");

      this.decoratorStub = Sinon.stub();
      this.cbStub = Sinon.stub().returns(this.decoratorStub);
      decoratorSchemaFactory(this.cbStub)(Test);
    });

    after(() => {
      this.getStub.restore();
    });

    it("should call PropertyRegistry.get()", () => {
      this.getStub.should.be.calledWithExactly(Test);
    });

    it("should call the fn callback with the correct parameters", () => {
      this.cbStub.should.be.calledWithExactly("schema", [Test]);
    });

    it("should cal the decorators returned by the fn callback", () => {
      this.decoratorStub.should.be.calledWithExactly(Test);
    });
  });
});

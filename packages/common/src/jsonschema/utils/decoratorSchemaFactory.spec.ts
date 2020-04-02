import * as Sinon from "sinon";
import {JsonSchemesRegistry, PropertyRegistry} from "../../../src/jsonschema";
import {decoratorSchemaFactory} from "../../../src/jsonschema/utils/decoratorSchemaFactory";

class Test {}

const sandbox = Sinon.createSandbox();
describe("decoratorSchemaFactory()", () => {
  describe("when it's a property", () => {
    beforeEach(() => {
      // @ts-ignore
      sandbox.stub(PropertyRegistry, "get").returns({schema: "schema"});
    });
    afterEach(() => {
      // @ts-ignore
      sandbox.restore();
    });

    it("should call PropertyRegistry", () => {
      const decoratorStub = Sinon.stub();
      const cbStub = Sinon.stub().returns(decoratorStub);

      decoratorSchemaFactory(cbStub)(Test, "test");

      PropertyRegistry.get.should.be.calledWithExactly(Test, "test");
      cbStub.should.be.calledWithExactly("schema", [Test, "test"]);
      decoratorStub.should.be.calledWithExactly(Test, "test");
    });
  });

  describe("when it's is a class", () => {
    beforeEach(() => {
      // @ts-ignore
      sandbox.stub(JsonSchemesRegistry, "createIfNotExists");
    });
    afterEach(() => {
      // @ts-ignore
      sandbox.restore();
    });

    it("should call PropertyRegistry.get()", () => {
      const decoratorStub = Sinon.stub();
      const cbStub = Sinon.stub().returns(decoratorStub);

      decoratorSchemaFactory(cbStub)(Test);

      JsonSchemesRegistry.createIfNotExists.should.be.calledWithExactly(Test);
    });
  });
});

import * as Proxyquire from "proxyquire";
import * as Sinon from "sinon";

const paramRegistryStub: any = {
  required: Sinon.stub()
};

const propertyRegistryStub: any = {
  required: Sinon.stub()
};

class Test {
}

const {Required} = Proxyquire.load("../../../src/mvc/decorators/required", {
  "../../filters/registries/ParamRegistry": {ParamRegistry: paramRegistryStub},
  "../../jsonschema/registries/PropertyRegistry": {PropertyRegistry: propertyRegistryStub}
});

describe("Required", () => {
  describe("when decorator is used as param", () => {
    before(() => {
      Required()(Test, "test", 0);
    });

    after(() => {
      paramRegistryStub.required.reset();
    });

    it("should called with the correct parameters", () => {
      paramRegistryStub.required.should.have.been.calledWithExactly(Test, "test", 0);
    });
  });

  describe("when decorator is used as property", () => {
    before(() => {
      Required(null, "")(Test, "test");
    });

    after(() => {
      propertyRegistryStub.required.reset();
    });

    it("should called with the correct parameters", () => {
      propertyRegistryStub.required.should.have.been.calledWithExactly(Test, "test", [null, ""]);
    });
  });
});

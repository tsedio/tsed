import {expect} from "chai";
import {ParamRegistry} from "../../../src/filters/registries/ParamRegistry";
import {JsonSchema} from "../../../src/jsonschema/class/JsonSchema";
import {PropertyRegistry} from "../../../src/jsonschema/registries/PropertyRegistry";
import {Allow} from "../../../src/mvc/decorators/allow";
import * as Sinon from "sinon";
import {stubSchemaDecorator} from "../../jsonschema/decorators/utils";

class Test {}

describe("Allow", () => {
  describe("when decorators is used as property decorator", () => {
    before(() => {
      this.metadata = {};
      this.getStub = Sinon.stub(PropertyRegistry, "get").returns(this.metadata);
      this.setStub = Sinon.stub(PropertyRegistry, "set");

      Allow(null, "")(Test, "test");
    });
    after(() => {
      this.getStub.restore();
      this.setStub.restore();
    });

    it("should have been called PropertyRegistry.get() with the correct parameters", () => {
      this.getStub.should.be.calledWithExactly(Test, "test");
    });

    it("should have been called PropertyRegistry.set() with the correct parameters", () => {
      this.setStub.should.be.calledWithExactly(Test, "test", this.metadata);
    });

    it("should have been stored allowed value on propertyMetadata", () => {
      this.metadata.allowedRequiredValues.should.be.deep.eq([null, ""]);
    });
  });

  describe("when decorators is used as property decorator effects on the jsonschema", () => {
    before(() => {
      this.decoratorStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      this.schema.$ref = "xyz";
      Allow(null);
      this.decoratorStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decoratorStub.restore();
    });

    it("should remove the original ref", () => {
      expect(this.schema.$ref).to.be.undefined;
    });
    it("should have oneOf property", () => {
      expect(this.schema).to.have.property("oneOf");
    });
    it("should have oneOf with 2 members ", () => {
      expect(this.schema.oneOf).to.have.length(2);
    });
    it("should have oneOf with null type and the original ref", () => {
      const [e1, e2] = this.schema.oneOf;
      if (e1.type) {
        expect(e1.type).to.equal("null");
        expect(e2).to.have.property("$ref", "xyz");
      } else {
        expect(e2).to.have.property("type", "null");
        expect(e1).to.have.property("$ref", "xyz");
      }
    });
  });

  describe("when decorators is used as parameters decorator", () => {
    before(() => {
      this.metadata = {};
      this.getStub = Sinon.stub(ParamRegistry, "get").returns(this.metadata);
      this.setStub = Sinon.stub(ParamRegistry, "set");

      Allow(null, "")(Test, "test", 0);
    });
    after(() => {
      this.getStub.restore();
      this.setStub.restore();
    });

    it("should have been called ParamRegistry.get() with the correct parameters", () => {
      this.getStub.should.be.calledWithExactly(Test, "test", 0);
    });

    it("should have been called ParamRegistry.set() with the correct parameters", () => {
      this.setStub.should.be.calledWithExactly(Test, "test", 0, this.metadata);
    });

    it("should have been stored allowed value on propertyMetadata", () => {
      this.metadata.allowedRequiredValues.should.be.deep.eq([null, ""]);
    });
  });
});

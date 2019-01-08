import * as mongoose from "mongoose";
import * as Sinon from "sinon";
import {createSchema} from "../../src/utils";
import * as mod from "../../src/utils/buildMongooseSchema";

describe("createSchema()", () => {
  class Test {
  }

  before(() => {
    this.buildMongooseSchemaStub = Sinon.stub(mod, "buildMongooseSchema").returns({
      schema: {
        definition: "definition"
      },
      virtuals: new Map([["virtual", {}]])
    } as any);

    this.virtualStub = Sinon.stub();
    this.loadClassStub = Sinon.stub();

    this.schemaStub = Sinon.stub(mongoose, "Schema").returns({
      virtual: this.virtualStub,
      loadClass: this.loadClassStub
    });

    this.converterStub = {
      serializeClass: Sinon.stub()
    };

    createSchema(Test, {options: "options"} as any);

    this.instance = new Test();
    this.instance.serialize({
      checkRequiredValue: "checkRequiredValue",
      ignoreCallback: "ignoreCallback"
    }, this.converterStub);
  });

  after(() => {
    this.buildMongooseSchemaStub.restore();
    this.schemaStub.restore();
  });

  it("should call buildMongooseSchema", () => {
    this.buildMongooseSchemaStub.should.have.been.calledWithExactly(Test);
  });

  it("should create a schema instance", () => {
    this.schemaStub.should.have.been.calledWithExactly({definition: "definition"}, {options: "options"});
  });

  it("should add virtuals", () => {
    this.virtualStub.should.have.been.calledWithExactly("virtual", {});
  });

  it("should load class", () => {
    this.loadClassStub.should.have.been.calledWithExactly(Test);
  });

  it("should converter.serializeClass", () => {
    this.converterStub.serializeClass.should.have.been.calledWithExactly(this.instance, {
      type: Test,
      checkRequiredValue: "checkRequiredValue",
      ignoreCallback: "ignoreCallback"
    });
  });
});

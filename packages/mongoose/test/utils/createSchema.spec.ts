import * as mongoose from "mongoose";
import * as Sinon from "sinon";
import {createSchema} from "../../src/utils";
import * as mod from "../../src/utils/buildMongooseSchema";

describe("createSchema()", () => {
  class Test {
  }

  before(() => {
    this.buildMongooseSchemaStub = Sinon.stub(mod, "buildMongooseSchema").returns({definition: "definition"} as any);

    this.schemaStub = Sinon.stub(mongoose, "Schema");

    createSchema(Test, {options: "options"} as any);
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
});

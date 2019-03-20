import * as Sinon from "sinon";
import {Model} from "../../src/decorators";
import * as register from "../../src/registries/MongooseModelRegistry";
import * as modUtil from "../../src/utils";

describe("@Model()", () => {
  describe("with options", () => {
    class Test {
    }

    before(() => {
      this.createSchemaStub = Sinon.stub(modUtil, "createSchema").returns({schema: "schema"} as any);
      this.createModelStub = Sinon.stub(modUtil, "createModel").returns({model: "model"} as any);
      this.registerModelStub = Sinon.stub(register, "registerModel");

      Model({
        schemaOptions: "schemaOptions",
        name: "name",
        collection: "collection",
        skipInit: "skipInit"
      } as any)(Test);
    });
    after(() => {
      this.createSchemaStub.restore();
      this.registerModelStub.restore();
      this.createModelStub.restore();
    });

    it("should call createSchema", () => {
      this.createSchemaStub.should.have.been.calledWithExactly(Test, {
        schemaOptions: "schemaOptions",
        name: "name",
        collection: "collection",
        skipInit: "skipInit"
      });
    });

    it("should call createModelStub", () => {
      this.createModelStub.should.have.been.calledWithExactly(Test, {schema: "schema"}, "name", "collection", "skipInit");
    });

    it("should call registerModelStub", () => {
      this.registerModelStub.should.have.been.calledWithExactly({provide: Test, useValue: {model: "model"}});
    });
  });

  describe("without options", () => {
    class Test {
    }

    before(() => {
      this.createSchemaStub = Sinon.stub(modUtil, "createSchema").returns({schema: "schema"} as any);
      this.createModelStub = Sinon.stub(modUtil, "createModel").returns({model: "model"} as any);
      this.registerModelStub = Sinon.stub(register, "registerModel");

      Model()(Test);
    });
    after(() => {
      this.createSchemaStub.restore();
      this.registerModelStub.restore();
      this.createModelStub.restore();
    });

    it("should call createSchema", () => {
      this.createSchemaStub.should.have.been.calledWithExactly(Test, {});
    });

    it("should call createModelStub", () => {
      this.createModelStub.should.have.been.calledWithExactly(Test, {schema: "schema"}, undefined, undefined, undefined);
    });

    it("should call registerModelStub", () => {
      this.registerModelStub.should.have.been.calledWithExactly({provide: Test, useValue: {model: "model"}});
    });
  });
});

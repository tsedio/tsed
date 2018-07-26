import {Model} from "../../../../packages/mongoose/decorators";
import * as register from "../../../../packages/mongoose/registries/MongooseModelRegistry";
import * as modUtil from "../../../../packages/mongoose/utils";
import * as apply from "../../../../packages/mongoose/utils/schemaOptions";
import {Sinon} from "../../../tools";

describe("@Model()", () => {
  describe("with options", () => {
    class Test {}

    before(() => {
      this.createSchemaStub = Sinon.stub(modUtil, "createSchema").returns({schema: "schema"});
      this.applySchemaOptionStub = Sinon.stub(apply, "applySchemaOptions");
      this.createModelStub = Sinon.stub(modUtil, "createModel").returns({model: "model"});
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
      this.applySchemaOptionStub.restore();
      this.registerModelStub.restore();
      this.createModelStub.restore();
    });

    it("should call createSchema", () => {
      this.createSchemaStub.should.have.been.calledWithExactly(Test, "schemaOptions");
    });

    it("should call createSchema", () => {
      this.applySchemaOptionStub.should.have.been.calledWithExactly(Test, {
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
      this.registerModelStub.should.have.been.calledWithExactly(Test, {model: "model"});
    });
  });

  describe("without options", () => {
    class Test {}

    before(() => {
      this.createSchemaStub = Sinon.stub(modUtil, "createSchema").returns({schema: "schema"});
      this.applySchemaOptionStub = Sinon.stub(apply, "applySchemaOptions");
      this.createModelStub = Sinon.stub(modUtil, "createModel").returns({model: "model"});
      this.registerModelStub = Sinon.stub(register, "registerModel");

      Model()(Test);
    });
    after(() => {
      this.createSchemaStub.restore();
      this.applySchemaOptionStub.restore();
      this.registerModelStub.restore();
      this.createModelStub.restore();
    });

    it("should call createSchema", () => {
      this.createSchemaStub.should.have.been.calledWithExactly(Test, undefined);
    });

    it("should call applySchemaOption", () => {
      this.applySchemaOptionStub.should.have.been.calledWithExactly(Test, {});
    });

    it("should call createModelStub", () => {
      this.createModelStub.should.have.been.calledWithExactly(Test, {schema: "schema"}, undefined, undefined, undefined);
    });

    it("should call registerModelStub", () => {
      this.registerModelStub.should.have.been.calledWithExactly(Test, {model: "model"});
    });
  });
});

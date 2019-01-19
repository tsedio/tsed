import {Schema} from "../../src/decorators";
import * as modUtil from "../../src/utils";
import * as Sinon from "sinon";

describe("@Model()", () => {
  describe("when decorator type is class", () => {
    describe("with options", () => {
      class Test {}

      before(() => {
        this.createSchemaStub = Sinon.stub(modUtil, "createSchema").returns({schema: "schema"} as any);

        Schema({
          schemaOptions: "schemaOptions",
        } as any)(Test);
      });

      after(() => {
        this.createSchemaStub.restore();
      });

      it("should call createSchema", () => {
        this.createSchemaStub.should.have.been.calledWithExactly(Test, {
          schemaOptions: "schemaOptions",
        });
      });
    });

    describe("without options", () => {
      class Test {}

      before(() => {
        this.createSchemaStub = Sinon.stub(modUtil, "createSchema").returns({schema: "schema"} as any);

        Schema()(Test);
      });

      after(() => {
        this.createSchemaStub.restore();
      });

      it("should call createSchema", () => {
        this.createSchemaStub.should.have.been.calledWithExactly(Test, {});
      });
    });
  });

  describe("when decorator type is property", () => {
    // There were no test previously...
  });
});

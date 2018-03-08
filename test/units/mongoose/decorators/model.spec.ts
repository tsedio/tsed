import {Model} from "../../../../src/mongoose/decorators";
import * as modUtil from "../../../../src/mongoose/utils";
import * as register from "../../../../src/mongoose/utils/registerModel";
import {registerModel} from "../../../../src/mongoose/utils/registerModel";
import * as apply from "../../../../src/mongoose/utils/schemaOptions";
import {Sinon} from "../../../tools";


describe("@Model()", () => {
    class Test {
    }

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
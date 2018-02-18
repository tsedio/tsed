import {JsonSchema} from "../../../../src/common/jsonschema/class/JsonSchema";
import {Default} from "../../../../src/common/jsonschema/decorators/default";
import {stubSchemaDecorator} from "./utils";

describe("Default", () => {
    before(() => {
        this.decorateStub = stubSchemaDecorator();
        this.schema = new JsonSchema();
        Default("defaultValue");
        this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.schema.default.should.be.eq("defaultValue");
    });
});
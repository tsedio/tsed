import {JsonSchema} from "../../../../src/common/jsonschema/class/JsonSchema";
import {Email} from "../../../../src/common/jsonschema/decorators/email";
import {stubSchemaDecorator} from "./utils";

describe("Email", () => {
    before(() => {
        this.decorateStub = stubSchemaDecorator();
        this.schema = new JsonSchema();
        Email();
        this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
        this.decorateStub.restore();
    });

    it("should store data", () => {
        this.schema.format.should.eq("email");
    });
});
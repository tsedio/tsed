import "../../../../src/ajv";
import {AjvService} from "../../../../src/ajv/services/AjvService";
import {globalServerSettings} from "../../../../src/config";
import {JsonSchemesService} from "../../../../src/jsonschema";
import {ParseExpressionError} from "../../../../src/mvc/errors/ParseExpressionError";
import {inject} from "../../../../src/testing";
import {JsonFoo, JsonFoo2} from "../../../helper/classes";
import {expect} from "../../../tools";

describe("AjvService", () => {
    before(inject([JsonSchemesService], (jsonSchemesService: JsonSchemesService) => {
        this.ajvService = new AjvService(jsonSchemesService, globalServerSettings);
    }));

    describe("when there an error", () => {
        it("should throws errors", () => {
            const foo2 = new JsonFoo2();
            foo2.test = "te";
            try {
                this.ajvService.validate(foo2, JsonFoo2);
            } catch (er) {
                expect(new ParseExpressionError("foo2", "", er.message).toString())
                    .to.eq("BAD_REQUEST(400): Bad request on parameter \"request.foo2\".\nfoo2.test should NOT be shorter than 3 characters (minLength)");
            }
        });
    });

    describe("when there is a success", () => {
        it("should not throws errors", () => {
            const foo2 = new JsonFoo2();
            foo2.test = "test";
            foo2.foo = new JsonFoo();

            return this.ajvService.validate(foo2, JsonFoo2);
        });
    });
});
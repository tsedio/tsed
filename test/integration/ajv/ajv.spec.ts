import {AjvService} from "../../../src/ajv/services/AjvService";
import {globalServerSettings} from "../../../src/config";
import {nameOf} from "../../../src/core/utils";
import {Format, JsonSchemesService} from "../../../src/jsonschema";
import {Required} from "../../../src/mvc/decorators";
import {ParseExpressionError} from "../../../src/mvc/errors/ParseExpressionError";
import {inject} from "../../../src/testing";
import {expect} from "../../tools";

let ajvService: AjvService;

const runValidation = (obj: any, targetType: any): Chai.Assertion => {
    try {
        const result = ajvService.validate(obj, targetType);
        return expect(result);
    } catch (err) {
        if (err.name === "BAD_REQUEST") {
            const message = "" + new ParseExpressionError(nameOf(targetType), undefined, err.message);
            return expect(message.split("\n")[1]);
        }
        return expect("" + err);
    }
};

describe("AJV", () => {

    let jsonSchemesService: JsonSchemesService;
    before(inject([JsonSchemesService], (_jsonSchemesService_: JsonSchemesService) => {
        ajvService = new AjvService(_jsonSchemesService_, globalServerSettings);
        jsonSchemesService = _jsonSchemesService_;
    }));

    describe("Date validation", () => {
        const errorMsg = "testdate.dateStart should match format \"date-time\" (format)";

        class TestDate {
            @Format("date-time")
            dateStart: Date;
        }

        it("should have expected json schema", () => {
            expect(jsonSchemesService.getSchemaDefinition(TestDate)).to.deep.eq({
                "definitions": {},
                "properties": {
                    "dateStart": {
                        "format": "date-time",
                        "type": "string"
                    }
                },
                "type": "object"
            });
        });
        it("should validate data (1)", () => {
            runValidation({}, TestDate).to.be.true;
        });
        it("should not validate data (2)", () => {
            runValidation({dateStart: "1987-07-12 01:00:00"}, TestDate).to.be.eq(errorMsg);
        });
        it("should validate data (3)", () => {
            runValidation({dateStart: new Date().toISOString()}, TestDate).to.be.true;
        });
        it("should not validate data (4)", () => {
            runValidation({dateStart: new Date()}, TestDate).to.be.eq("testdate.dateStart should be string (type)");
        });
        it("should not validate data (5)", () => {
            runValidation({dateStart: "test"}, TestDate).to.be.eq(errorMsg);
        });
    });

    describe("Required validation", () => {

        class TestRequired {
            @Required()
            dateStart: Date;
        }

        it("should have expected json schema", () => {
            expect(jsonSchemesService.getSchemaDefinition(TestRequired)).to.deep.eq({
                "definitions": {},
                "properties": {
                    "dateStart": {
                        "type": "string"
                    }
                },
                "required": [
                    "dateStart"
                ],
                "type": "object"
            });
        });
        it("should not validate data (1)", () => {
            runValidation({}, TestRequired).to.be.eq("testrequired should have required property \'dateStart\' (required)");
        });

        it("should validate data (2)", () => {
            runValidation({dateStart: ""}, TestRequired).to.be.true;
        });
    });
});

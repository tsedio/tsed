import {AjvService} from "../../../src/ajv/services/AjvService";
import {nameOf} from "../../../src/core/utils";
import {Format, JsonSchemesService} from "../../../src/jsonschema";
import {Required} from "../../../src/mvc/decorators";
import {ParseExpressionError} from "../../../src/mvc/errors/ParseExpressionError";
import {inject} from "../../../src/testing";
import {expect} from "../../tools";

let ajvService: AjvService;

const runValidation = (obj: any, targetType: any, collectionType?: any): Chai.Assertion => {
    try {
        const result = ajvService.validate(obj, targetType, collectionType);
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
    before(inject([AjvService, JsonSchemesService], (_ajvService_: AjvService, _jsonSchemesService_: JsonSchemesService) => {
        ajvService = _ajvService_;
        jsonSchemesService = _jsonSchemesService_;
    }));

    describe("Date validation", () => {
        const errorMsg = "At TestDate.dateStart should match format \"date-time\"";

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
            runValidation({dateStart: new Date()}, TestDate).to.be.eq("At TestDate.dateStart should be string");
        });
        it("should not validate data (5)", () => {
            runValidation({dateStart: "test"}, TestDate).to.be.eq(errorMsg);
        });
        it("should validate data (6)", () => {
            runValidation({other: "test"}, TestDate).to.be.true;
        });
    });

    describe("Array of", () => {
        const errorMsg = "At TestDate.dateStart should match format \"date-time\"";

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
            runValidation([{}], TestDate, Array).to.be.true;
        });
        it("should not validate data (2)", () => {
            runValidation([{dateStart: "1987-07-12 01:00:00"}], TestDate, Array).to.be.eq(errorMsg);
        });
        it("should validate data (3)", () => {
            runValidation([{dateStart: new Date().toISOString()}], TestDate, Array).to.be.true;
        });
    });

    describe("Set of", () => {
        const errorMsg = "At TestDate.dateStart should match format \"date-time\"";

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
            runValidation({test: {}}, TestDate, Set).to.be.true;
        });

        it("should not validate data (2)", () => {
            runValidation({test: {dateStart: "1987-07-12 01:00:00"}}, TestDate, Set).to.be.eq(errorMsg);
        });

        it("should validate data (3)", () => {
            runValidation({test: {dateStart: new Date().toISOString()}}, TestDate, Set).to.be.true;
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
            runValidation({}, TestRequired).to.be.eq("At TestRequired should have required property 'dateStart'");
        });

        it("should validate data (2)", () => {
            runValidation({dateStart: ""}, TestRequired).to.be.true;
        });
    });
});

import {JsonSchema} from "../../../../src/jsonschema/class/JsonSchema";
import {expect} from "../../../tools";

describe("JsonSchema", () => {

    describe("getJsonType()", () => {
        it("should return number", () => {
            expect(JsonSchema.getJsonType(Number)).to.eq("number");
        });

        it("should return string", () => {
            expect(JsonSchema.getJsonType(String)).to.eq("string");
        });

        it("should return boolean", () => {
            expect(JsonSchema.getJsonType(Boolean)).to.eq("boolean");
        });

        it("should return array", () => {
            expect(JsonSchema.getJsonType(Array)).to.eq("array");
        });

        it("should return string when date is given", () => {
            expect(JsonSchema.getJsonType(Date)).to.eq("string");
        });

        it("should return object", () => {
            expect(JsonSchema.getJsonType({})).to.eq("object");
        });

        it("should return object when class is given", () => {
            expect(JsonSchema.getJsonType(class {
            })).to.eq("object");
        });

        it("should return [string] when an array is given", () => {
            expect(JsonSchema.getJsonType(["string"])).to.deep.eq(["string"]);
        });
        it("should return string when an string is given", () => {
            expect(JsonSchema.getJsonType("string")).to.deep.eq("string");
        });
    });

    describe("toJSON()", () => {
        before(() => {
            this.jsonSchema = new JsonSchema();
            this.jsonSchema.type = class Test {
            };
        });
        it("should return object", () => {
            expect(this.jsonSchema.toJSON()).to.deep.eq({type: "object"});
        });
    });
});
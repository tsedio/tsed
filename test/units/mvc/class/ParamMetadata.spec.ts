import {expect} from "chai";
import {ParamMetadata} from "../../../../src";
import {EXPRESS_ERR} from "../../../../src/mvc/constants/index";

class Test {
    method(arg1, arg2) {
    }
}
class TestFilter {
}

describe("ParamMetadata", () => {

    before(() => {
        this.paramMetadata = new ParamMetadata();
        this.paramMetadata.required = true;
        this.paramMetadata.expression = "test";
        this.paramMetadata.baseType = Test;
        this.paramMetadata.useType = Test;
        this.paramMetadata.useConverter = true;
    });

    after(() => delete this.paramMetadata);

    it("should return the required value", () =>
        expect(this.paramMetadata.required).to.be.a("boolean").and.to.eq(true)
    );

    it("should return the expression", () =>
        expect(this.paramMetadata.expression).to.be.a("string").and.to.eq("test")
    );

    it("should return useType", () =>
        expect(this.paramMetadata.useType).to.eq(Test)
    );

    it("should return baseType", () =>
        expect(this.paramMetadata.baseType).to.eq(Test)
    );

    it("should return useConverter", () =>
        expect(this.paramMetadata.useConverter).to.eq(true)
    );

    describe("as a service", () => {
        before(() =>
            this.paramMetadata.service = EXPRESS_ERR
        );

        it("should return the service", () =>
            expect(this.paramMetadata.service).to.be.a("symbol").to.eq(EXPRESS_ERR)
        );

        it("should return the service's name", () =>
            expect(this.paramMetadata.name).to.be.a("string").to.eq("err")
        );
    });

    describe("as a filter", () => {
        before(() =>
            this.paramMetadata.service = TestFilter
        );

        it("should return the service", () =>
            expect(this.paramMetadata.service).to.eq(TestFilter)
        );

        it("should return the service's name", () =>
            expect(this.paramMetadata.name).to.be.a("string").to.eq("TestFilter")
        );
    });

    describe("toJson()", () => {

        describe("with service", () => {
            before(() => {
                this.paramMetadata = new ParamMetadata();
                this.paramMetadata.required = true;
                this.paramMetadata.expression = "test";
                this.paramMetadata.baseType = Test;
                this.paramMetadata.useType = Test;
                this.paramMetadata.useConverter = true;
                this.paramMetadata.service = TestFilter;
            });

            it("should return the JSON", () => {
                expect(JSON.stringify(this.paramMetadata)).to.eq(`{"service":"TestFilter","name":"TestFilter","expression":"test","required":true,"use":"Test"}`);
            });

        });

        describe("with useType != baseType", () => {
            before(() => {
                this.paramMetadata = new ParamMetadata();
                this.paramMetadata.required = true;
                this.paramMetadata.expression = "test";
                this.paramMetadata.baseType = Array;
                this.paramMetadata.useType = Test;
                this.paramMetadata.useConverter = true;
                this.paramMetadata.service = TestFilter;
            });

            it("should return the JSON", () => {
                expect(JSON.stringify(this.paramMetadata)).to.eq(`{"service":"TestFilter","name":"TestFilter","expression":"test","required":true,"use":"Test","baseType":"Array"}`);
            });

        });

        describe("without useType and baseType", () => {
            before(() => {
                this.paramMetadata = new ParamMetadata();
                this.paramMetadata.required = true;
                this.paramMetadata.expression = "test";
                this.paramMetadata.service = TestFilter;
            });

            it("should return the JSON", () => {
                expect(JSON.stringify(this.paramMetadata)).to.eq(`{"service":"TestFilter","name":"TestFilter","expression":"test","required":true}`);
            });

        });

    });
});
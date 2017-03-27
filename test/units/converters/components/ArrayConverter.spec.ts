import {expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {ConverterService} from "../../../../src";
import assert = require("assert");


describe("ArrayConverter", () => {

    before(inject([ConverterService], (converterService: ConverterService) => {
        this.arrayConverter = converterService.getConverter(Array);
    }));
    after(() => delete this.arrayConverter);

    it("should do something", () => {
        expect(!!this.arrayConverter).to.be.true;
    });

    describe("deserialize()", () => {
        it("should deserialize data as array when a number is given", () => {
            expect(this.arrayConverter.deserialize(1)).to.be.an("array");
        });

        it("should deserialize data as array when an array is given", () => {
            expect(this.arrayConverter.deserialize([1])).to.be.an("array");
        });
    });

});
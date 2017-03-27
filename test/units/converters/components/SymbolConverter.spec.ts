import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {ConverterService} from "../../../../src";

describe("SymbolConverter", () => {

    before(inject([ConverterService], (converterService: ConverterService) => {
        this.symbolConverter = converterService.getConverter(Symbol);
    }));
    after(() => delete this.symbolConverter);


    it("should do something", () =>
        expect(!!this.symbolConverter).to.be.true
    );

    describe("deserialize()", () => {
        it("should deserialize data as symbol when a string is given", () =>
            expect(this.symbolConverter.deserialize("testSymbol")).to.be.a("symbol")
        );
    });

    describe("serialize()", () => {
        before(() =>
            this.symbolTest = this.symbolConverter.serialize(Symbol("testSymbol2"))
        );

        after(() => delete this.symbolTest);

        it("should serialize data to a string", () =>
            expect(this.symbolTest).to.be.a("string")
        );
        it("should serialize data to a string that equals to testSymbol2", () =>
            expect(this.symbolTest).to.be.equal("testSymbol2")
        );
    });
});
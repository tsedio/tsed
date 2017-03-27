import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {ConverterService} from "../../../../src";

describe("DateConverter", () => {

    before(inject([ConverterService], (converterService: ConverterService) => {
        this.dateConverter = converterService.getConverter(Date);
        this.date = new Date();
    }));

    after(() => {
        delete this.dateConverter;
        delete this.date;
    });


    it("should do something", () =>
        expect(!!this.dateConverter).to.be.true
    );

    describe("deserialize()", () => {
        it("should deserialize date as string to a Date", () => {
            expect(this.dateConverter.deserialize(this.date.toISOString())).to.be.an.instanceOf(Date);
        });

        it("should deserialize date as string to a Date", () => {
            const date = this.dateConverter.deserialize(this.date.toISOString());
            expect(date.getFullYear()).to.equals(this.date.getFullYear());
        });
    });

    describe("serialize()", () => {
        before(() => {
            this.dateTest = this.dateConverter.serialize(this.date);
        });

        after(() => delete this.dateTest);

        it("should serialize data to a string", () =>
            expect(this.dateTest).to.be.a("string").and.to.equals(this.date.toISOString())
        );
    });
});
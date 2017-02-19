import * as Chai from "chai";
import assert = require('assert');
import {inject} from '../src/testing/inject';
import {ConverterService} from "../src";

let expect: Chai.ExpectStatic = Chai.expect;


describe("SymbolConverter :", () => {

    it('should convert data', inject([ConverterService], (converterService: ConverterService) => {

        const symbolConverter = converterService.getConverter(Symbol);

        expect(!!symbolConverter).to.be.true;

        expect(symbolConverter.deserialize("testSymbol")).to.be.a('symbol');

        const symbolTest = symbolConverter.serialize(Symbol('testSymbol2'));

        expect(symbolTest).to.be.a('string');
        expect(symbolTest).to.be.equal('testSymbol2');

    }));

});
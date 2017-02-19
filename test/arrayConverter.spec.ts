import * as Chai from "chai";
import assert = require('assert');
import {inject} from '../src/testing/inject';
import {ConverterService} from "../src";

let expect: Chai.ExpectStatic = Chai.expect;


describe("ArrayConverter :", () => {

    it('should convert data', inject([ConverterService], (converterService: ConverterService) => {


        const arrayConverter = converterService.getConverter(Array);

        expect(!!arrayConverter).to.be.true;

        expect(arrayConverter.deserialize(1)).to.be.an('array');
        expect(arrayConverter.deserialize([1])).to.be.an('array');

    }));

});
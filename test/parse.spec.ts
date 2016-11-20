
import {expect} from "chai";
import {inject, Done} from '../src/testing/';
import ParseService from '../src/services/parse';

describe('ParseService :', () => {

    it('should clone object', () => {

        const source = {};

        expect(ParseService.clone(source)).not.to.be.equal(source);

    });

    it('should eval expression with a scope and return value', inject([ParseService, Done], (parserService: ParseService, done) => {

        expect(parserService.eval("test", {
            test: "yes"
        })).to.equal("yes");

        done();

    }));

    it('should eval expression with a scope and return value', inject([ParseService], (parserService: ParseService) => {


        expect(parserService.eval("test.foo", {
            test: "yes"
        })).to.equal(undefined);


    }));

    it("should eval expression with a scope and return a new object", inject([ParseService], (parserService: ParseService) => {

        let scope = {
            test: {
                foo: "yes"
            }
        };

        let value = parserService.eval("test", scope);

        expect(value.foo).to.equal("yes");

        value.foo = "test";

        expect(value.foo).to.not.equal(scope.test.foo); // New instance
    }));

});
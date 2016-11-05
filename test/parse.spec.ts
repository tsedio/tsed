
import Chai = require("chai");
import {inject} from '../testing';
import ParseService from '../src/services/parse';


const expect: Chai.ExpectStatic = Chai.expect;


describe('ParseService :', () => {

    it('should clone object', () =>{

        const source = {};

        expect(ParseService.clone(source)).not.to.be.equal(source);

    });

    it('should eval expression with a scope and return value', inject([ParseService], (parserService: ParseService) => {


        expect(parserService.eval("test", {
            test: "yes"
        })).to.equal("yes");


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
import Chai = require('chai');
import {parse} from "../lib/parse";

var expect:Chai.ExpectStatic = Chai.expect;

describe('parse()', function(){

    it('should eval expression with a scope and return value', function() {
        expect(parse('test', {test: 'yes'})).to.equal('yes');

    });

    it('should eval expression with a scope and return undefined', function(){
        expect(parse('test.foo', {test:'yes'})).to.equal(undefined);
    });


    it('should eval expression with a scope and return value', function(){

        var value = parse('test.foo', {
            test:{
                foo:'yes'
            }
        });

        expect(value).to.equal('yes');
    });

    it('should eval expression with a scope and return a new object', function(){

        var scope = {
            test:{
                foo:'yes'
            }
        };

        var value = parse('test', scope);

        expect(value.foo).to.equal('yes');

        value.foo = 'test';

        expect(value.foo).to.not.equal(scope.test.foo); //new instance
    });
});
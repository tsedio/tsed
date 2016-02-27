
import {checkParamsRequired} from "../lib/check-params-required";
import Chai = require('chai');

var expect:Chai.ExpectStatic = Chai.expect;

describe('checkParamsRequired()', function(){


    it('should return required params', function(){
        var list = checkParamsRequired(['test','test2'], {test2:true});

        expect(list).to.be.an('array');
        expect(list.length).to.equal(1);

    });

});

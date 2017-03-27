import {getClass} from "../src/utils";
import * as Chai from "chai";

const expect: Chai.ExpectStatic = Chai.expect;

class Test{

    attribut;

    constructor(){}

    method(){

    }

    static methodStatic(){

    }
}

class Test2{

    attribut;

    constructor(){}

    method(){

    }

    static methodStatic(){

    }
}




describe('Utils :', () => {

    describe('getClass', () => {

        it('should return class constructor', () => {

            expect(getClass(Test)).to.equals(Test);
            expect(getClass(new Test)).to.equals(Test);
            expect(getClass(Test.prototype)).to.equals(Test);

        });

    });
});
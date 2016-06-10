import * as Chai from "chai";
import {checkParamsRequired} from "../lib/check-params-required";
let expect: Chai.ExpectStatic = Chai.expect;

describe("checkParamsRequired", () => {
   
    it("should check if expression is defined in scope", () => {

        let result: string[] = checkParamsRequired(["test"], {test: true});

        expect(result.length).to.be.equal(0); //
    });

    it("should return a list of undefined attr in scope", () => {

        let result: string[] = checkParamsRequired(["test"], {});

        expect(result.length).to.be.equal(1); //
        expect(result[0]).to.be.equal("test"); //
    });

});
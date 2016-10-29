import * as Chai from "chai";
import {checkParamsRequired} from "../src/utils/check-params-required";
import {tryParams} from "../src/utils/try-params";
let expect: Chai.ExpectStatic = Chai.expect;

describe("tryParams", () => {

   
    it("should check if expression is defined in scope", () => {
        let nextResult;
        let next = (e) => {nextResult = e};

        tryParams(["test"], {test: true}, next);

        expect(nextResult).to.be.undefined; //
    });

    it("should pass a HttpException to nextFunction", () => {

        let nextResult;
        let next = (e) => {nextResult = e};

        tryParams(["test"], {}, next);

        expect(nextResult).not.to.be.undefined;
        expect(nextResult.status).to.be.equal(400);
    });

});
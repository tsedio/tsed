import {globalServerSettings} from "../../../../src/config";
import {Value} from "../../../../src/config/decorators/value";
import {expect, Sinon} from "../../../tools";

const path = require("path");
const root = path.resolve(__dirname + "./../");


class TestConstant {
    envTest: string;
    envTest2: string;
}

describe("Value()", () => {

    before(() => {
        this.getStub = Sinon.stub(globalServerSettings, "get");

        this.getStub.withArgs("env.test").returns("value");
        this.getStub.withArgs("env.test2").returns({test: "value"});

        Value("env.test")(TestConstant, "envTest");
        Value("env.test2")(TestConstant, "envTest2");

        this.testConstant = new TestConstant();
        this.testConstant.envTest2 = {test: "value2"};
    });
    after(() => {
        this.getStub.restore();
    });

    it("should return constants value (string)", () => {
        expect(this.testConstant.envTest).to.be.eq("value");
    });

    it("should return constants value (obj)", () => {
        expect(this.testConstant.envTest2).to.be.deep.eq({test: "value2"});
    });
});



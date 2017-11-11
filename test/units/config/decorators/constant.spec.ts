import {globalServerSettings} from "../../../../src/config";
import {Constant} from "../../../../src/config/decorators/constant";
import {expect, Sinon} from "../../../tools";

const path = require("path");
const root = path.resolve(__dirname + "./../");


class TestConstant {
    envTest: string;
    envTest2: string;
}

describe("Constant()", () => {

    before(() => {
        this.getStub = Sinon.stub(globalServerSettings, "get");

        this.getStub.withArgs("env.test").returns("value");
        this.getStub.withArgs("env.test2").returns({test: "value"});

        Constant("env.test")(TestConstant, "envTest");
        Constant("env.test2")(TestConstant, "envTest2");

        this.testConstant = new TestConstant();

        try {
            this.testConstant.envTest2.test = "value2";
        } catch (er) {
            this.error = er;
        }
    });

    after(() => {
        this.getStub.restore();
    });

    it("should return constants value (string)", () => {
        expect(this.testConstant.envTest).to.be.eq("value");
    });

    it("should return constants value (obj)", () => {
        expect(this.testConstant.envTest2).to.be.deep.eq({test: "value"});
    });

    it("should throw an error when the property object is rewritten", () => {
        expect(this.error.message).to.contains("Cannot assign to read only property 'test' of");
    });
});



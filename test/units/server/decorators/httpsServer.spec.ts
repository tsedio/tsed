import {Metadata} from "../../../../src/core/class/Metadata";
import {HttpsServer} from "../../../../src/server";
import {Sinon} from "../../../tools";


describe("HttpsServer", () => {
    before(() => {
        this.setParamTypesStub = Sinon.stub(Metadata, "setParamTypes");

        class Test {
            constructor(@HttpsServer https: HttpsServer) {
            }
        }
    });
    after(() => {
        this.setParamTypesStub.restore();
    });

    it("should store metadata", () => {
        this.setParamTypesStub.should.have.been.calledWithExactly(Sinon.match.func, undefined, [HttpsServer]);
    });
});
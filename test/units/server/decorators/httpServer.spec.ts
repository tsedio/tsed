import {Metadata} from "../../../../src/core/class/Metadata";
import {HttpServer} from "../../../../src/server";
import {Sinon} from "../../../tools";


describe("HttpServer", () => {
    before(() => {
        this.setParamTypesStub = Sinon.stub(Metadata, "setParamTypes");

        class Test {
            constructor(@HttpServer https: HttpServer) {
            }
        }
    });
    after(() => {
        this.setParamTypesStub.restore();
    });

    it("should store metadata", () => {
        this.setParamTypesStub.should.have.been.calledWithExactly(Sinon.match.func, undefined, [HttpServer]);
    });
});
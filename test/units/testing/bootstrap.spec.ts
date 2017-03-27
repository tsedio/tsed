import * as Chai from "chai";
import {bootstrap} from "../../../src/testing";

const expect: Chai.ExpectStatic = Chai.expect;

class FakeServer {
    constructor() {

    }

    start() {
        return Promise.resolve();
    }
}

describe("bootstrap", () => {


    it("should mock server for test", (done) => {

        const fnMocha = bootstrap(FakeServer);

        expect(fnMocha).to.be.a("function");

        fnMocha(() => {

            expect((FakeServer as any).$$instance).to.be.instanceof(FakeServer);
            expect((FakeServer as any).$$instance.startServers).to.be.a("function");
            expect((FakeServer as any).$$instance.startServers().then).to.be.a("function");

            bootstrap(FakeServer)(done);

        });


    });

});
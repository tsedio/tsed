import {assert, expect} from "chai";
import * as Sinon from "sinon";
import * as Proxyquire from "proxyquire";
import {FakeRequest} from "../../../helper/FakeRequest";
import {FakeResponse} from "../../../helper/FakeResponse";

const $log = {warn: Sinon.stub()};
const {MultipartFileMiddleware} = Proxyquire.load("../../../../src/multipartfiles/middlewares/MultipartFileMiddleware", {
    "ts-log-debug": {$log}
});


describe("MultipartFileMiddleware", () => {

    before(() => {
        this.middleware = new MultipartFileMiddleware({uploadDir: "/"});
        this.expressMiddleware = Sinon.stub();

        this.middleware.multer = Sinon.stub().returns({
            any: Sinon.stub().returns(this.expressMiddleware)
        });

        this.nextSpy = Sinon.spy();
        this.request = new FakeRequest();
        this.response = new FakeResponse();
        this.fakeEndpoint = {
            getMetadata: Sinon.stub()
        };
    });

    after(() => {
        delete this.middleware;
        delete this.request;
        delete this.response;
        delete this.fakeEndpoint;
        delete this.result;
    });

    describe("with multer module", () => {
        before(() => {
            this.middleware.use(this.fakeEndpoint, this.request, this.response, this.nextSpy);
        });

        it("should call multer with some options", () => {
            expect(this.middleware.multer.args[0][0].dest).to.eq("/");
        });

        it("should create middleware and call it", () => {
            expect(this.expressMiddleware.called).to.eq(true);
            expect(this.expressMiddleware.calledWith(this.request, this.response, this.nextSpy)).to.eq(true);
        });
    });

    describe("without multer module", () => {
        before(() => {
            delete this.middleware.multer;
            const result = this.middleware.use(this.fakeEndpoint, this.request, this.response, this.nextSpy);
        });

        it("should emit a warning", () => {
            expect($log.warn.calledWith(
                "Multer isn't installed ! Run npm install --save multer before using Multipart decorators."
            )).to.eq(true);
        });
    });
});


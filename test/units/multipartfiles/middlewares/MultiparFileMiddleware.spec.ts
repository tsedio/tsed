import {MultipartFileMiddleware} from "../../../../src/multipartfiles/middlewares/MultipartFileMiddleware";
import {FakeRequest} from "../../../helper/FakeRequest";
import {FakeResponse} from "../../../helper/FakeResponse";
import {$logStub, Sinon} from "../../../tools";

describe("MultipartFileMiddleware", () => {

    before(() => {
        this.settings = {
            uploadDir: "/",
            get: Sinon.stub().withArgs("multer").returns({options: "options"})
        };
        this.middleware = new MultipartFileMiddleware(this.settings);
        this.expressMiddleware = Sinon.stub();

        this.middleware.multer = Sinon.stub().returns({
            any: Sinon.stub().returns(this.expressMiddleware)
        });

        this.nextSpy = Sinon.spy();
        this.request = new FakeRequest();
        this.response = new FakeResponse();
        this.fakeEndpoint = {
            store: {
                get: Sinon.stub()
            }
        };
    });

    describe("with multer module", () => {
        before(() => {
            this.middleware.use(this.fakeEndpoint, this.request, this.response, this.nextSpy);
        });

        it("should call multer with some options", () => {
            this.middleware.multer.should.be.calledWithExactly({dest: "/", options: "options"});
        });

        it("should create middleware and call it", () => {
            this.expressMiddleware.should.be.calledWithExactly(this.request, this.response, this.nextSpy);
        });
    });

    describe("without multer module", () => {
        before(() => {
            $logStub.reset();
            delete this.middleware.multer;
            this.middleware.use(this.fakeEndpoint, this.request, this.response, this.nextSpy);
        });

        it("should emit a warning", () => {
            $logStub.warn.should.be.calledWithExactly(
                "Multer isn't installed ! Run npm install --save multer before using Multipart decorators."
            );
        });
    });
});


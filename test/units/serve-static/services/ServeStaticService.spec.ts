import * as Proxyquire from "proxyquire";
import {ServerSettingsService} from "../../../../src/config/services/ServerSettingsService";
import {ExpressApplication} from "../../../../src/mvc/decorators";
import {invoke} from "../../../../src/testing/invoke";
import {Sinon} from "../../../tools";

const middlewareServeStatic = Sinon.stub();
const serveStatic = Sinon.stub();
serveStatic.withArgs("/views").returns(middlewareServeStatic);

const {ServeStaticService} = Proxyquire("../../../../src/servestatic/services/ServeStaticService", {
    "serve-static": serveStatic
});
const expressApplication = {
    use: Sinon.stub()
};

const serverSettingService = {
    serveStatic: {
        "/path": "/views"
    }
};

describe("ServeStaticService", () => {

    before(() => {
        this.serveStaticService = invoke(ServeStaticService, [
            {
                provide: ExpressApplication,
                use: expressApplication
            },
            {
                provide: ServerSettingsService,
                use: serverSettingService
            }
        ]);
    });

    describe("mount()", () => {
        describe("when headers is not sent", () => {
            before(() => {
                this.serveStaticService.mount("/path", "/views");
                this.request = {
                    test: "request"
                };
                this.response = {
                    headersSent: false
                };
                this.nextSpy = Sinon.spy();

                expressApplication.use.getCall(0).args[1](this.request, this.response, this.nextSpy);
            });
            after(() => {
                expressApplication.use.reset();
                serveStatic.reset();
                middlewareServeStatic.reset();
            });
            it("should call the express use method", () => {
                expressApplication.use.should.be.calledWithExactly("/path", Sinon.match.func);
            });
            it("should call serveStatic", () => {
                serveStatic.should.be.calledWithExactly("/views");
            });

            it("should call the middleware", () => {
                middlewareServeStatic.should.be.calledWithExactly(this.request, this.response, this.nextSpy);
            });
        });

        describe("when headers is sent", () => {
            before(() => {
                this.serveStaticService.mount("/path", "/views");
                this.request = {
                    test: "request"
                };
                this.response = {
                    headersSent: true
                };
                this.nextSpy = Sinon.spy();

                expressApplication.use.getCall(0).args[1](this.request, this.response, this.nextSpy);
            });
            after(() => {
                expressApplication.use.reset();
                serveStatic.reset();
                middlewareServeStatic.reset();
            });
            it("should call the express use method", () => {
                expressApplication.use.should.be.calledWithExactly("/path", Sinon.match.func);
            });
            it("should call serveStatic", () => {
                serveStatic.should.be.calledWithExactly("/views");
            });

            it("should not call the middleware", () =>
                middlewareServeStatic.should.not.be.called
            );

            it("should call the next function", () =>
                this.nextSpy.should.be.calledWithExactly()
            );
        });

    });

});
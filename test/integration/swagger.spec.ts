import * as Express from "express";


import * as SuperTest from "supertest";
import {GlobalAcceptMimesMiddleware} from "../../src/mvc/components/GlobalAcceptMimesMiddleware";
import {ServerLoader} from "../../src/server/components/ServerLoader";
import {ServerSettings} from "../../src/server/decorators/serverSettings";
import "../../src/swagger";
import {expect} from "../tools";
import Path = require("path");

const rootDir = Path.join(Path.resolve(__dirname), "app");

@ServerSettings({
    rootDir,
    port: 8002,
    httpsPort: 8082,
    mount: {
        "/rest": `${rootDir}/controllers/**/**.js`
    },
    componentsScan: [
        `${rootDir}/services/**/**.js`
    ],
    serveStatic: {
        "/": `${rootDir}/views`
    },
    acceptMimes: ["application/json"],
    swagger: {
        path: "/api-doc"
    }
})
export class FakeApplication extends ServerLoader {

    static Server: FakeApplication;

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void {

        let cookieParser = require("cookie-parser"),
            bodyParser = require("body-parser"),
            compress = require("compression"),
            methodOverride = require("method-override"),
            session = require("express-session");

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());

        this.engine(".html", require("ejs").__express)
            .set("views", `${rootDir}/views`)
            .set("view engine", "html");

    }

    /**
     * Set here your check authentification strategy.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    public $onAuth(request: Express.Request, response: Express.Response, next: Express.NextFunction): boolean {

        return request.get("authorization") === "token";
    }

    public request(): SuperTest.SuperTest<SuperTest.Test> {
        return SuperTest(this.expressApp);
    }
}


describe("Rest", () => {

    before(() => {
        this.fakeApplication = new FakeApplication();
        return this.fakeApplication.start();
    });

    describe("GET /api-doc/swagger.json", () => {

        before((done) => {
            this.fakeApplication
                .request()
                .get("/api-doc/swagger.json")
                .expect(200)
                .end((err: any, response: any) => {
                    this.spec = JSON.parse(response.text);
                    done();
                });
        });

        it("should have a swagger version", () => {
            expect(this.spec.swagger).to.be.eq("2.0");
        });

        it("should have informations field ", () => {
            expect(this.spec.swagger).to.be.eq("2.0");
        });

        it("should have paths field", () => {
            expect(this.spec.paths).to.be.a("object");
        });

        it("should have securityDefinitions field", () => {
            expect(this.spec.securityDefinitions).to.be.a("object");
        });

        it("should have definitions field", () => {
            expect(this.spec.definitions).to.be.a("object");
        });

        it("should have consumes field", () => {
            expect(this.spec.consumes).to.be.an("array");
            expect(this.spec.consumes[0]).to.be.eq("application/json");
        });

        it("should have produces field", () => {
            expect(this.spec.produces).to.be.an("array");
            expect(this.spec.produces[0]).to.be.eq("application/json");
        });

    });

});
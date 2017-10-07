import * as Express from "express";
import * as SuperTest from "supertest";
import {ExpressApplication} from "../../src/core/services/ExpressApplication";
import {GlobalAcceptMimesMiddleware} from "../../src/mvc/components/GlobalAcceptMimesMiddleware";
import {ServerLoader} from "../../src/server/components/ServerLoader";
import {ServerSettings} from "../../src/server/decorators/serverSettings";
import "../../src/swagger";
import {bootstrap} from "../../src/testing";
import {Done} from "../../src/testing/done";
import {inject} from "../../src/testing/inject";
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

    protected startServer(http: any, settings: { https: boolean; address: string; port: (string | number | any) }): Promise<any> {
        return Promise.resolve();
    }
}


describe("Rest", () => {

    before(bootstrap(FakeApplication));
    before(inject([ExpressApplication], (expressApplication: ExpressApplication) =>
        this.app = SuperTest(expressApplication)
    ));

    describe("GET /rest", () => {
        it("should return html content", inject([Done], (done: Function) => {
            this.app
                .get("/rest/html")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    expect(response.text).to.be.an("string");

                    done();
                });

        }));
    });

    describe("GET /rest/calendars", () => {

        it("should return an object (without annotation)", inject([Done], (done: Function) => {

            this.app
                .get("/rest/calendars/classic/1")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }
                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal("1");
                    expect(obj.name).to.equal("test");

                    done();
                });

        }));

        it("should return an object (PathParamsType annotation)", (done: Function) => {

            this.app
                .get("/rest/calendars/annotation/test/1")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal("1");
                    expect(obj.name).to.equal("test");

                    done();
                });

        });

        it("should return an object (Via promised response)", (done: Function) => {

            this.app
                .get("/rest/calendars/annotation/promised/1")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }
                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal("1");
                    expect(obj.name).to.equal("test");

                    done();
                });

        });

        it("should return an object status (Via promised response)", (done: Function) => {

            this.app
                .get("/rest/calendars/annotation/status/1")
                .expect(202)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal("1");
                    expect(obj.name).to.equal("test");

                    done();
                });

        });

        it("should use middleware to provide user info", (done: Function) => {

            this.app
                .get("/rest/calendars/middleware")
                .set({
                    Authorization: "tokenauth"
                })
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.user).to.equal(1);
                    expect(obj.token).to.equal("tokenauth");

                    done();
                });

        });

        it("should set token", (done: Function) => {

            this.app
                .get("/rest/calendars/token/newTOKENXD")
                // .send({id: 1})
                .set("Cookie", "authorization=auth")
                .expect(200)
                .end((err: any, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("token updated");
                    done();
                });

        });

        it("should return get updated token", (done: Function) => {

            this.app
                .get("/rest/calendars/token")
                // .send({id: 1})
                .set("Cookie", "authorization=auth")
                .expect(200)
                .end((err: any, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("newTOKENXD");
                    done();
                });

        });

        it("should return query", (done: Function) => {

            this.app
                .get("/rest/calendars/query?search=ts-express-decorators")
                .expect(200)
                .end((err: any, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("ts-express-decorators");
                    done();
                });

        });

        it("should use mvc to provide info (Use)", (done: Function) => {

            this.app
                .get("/rest/calendars/mvc")
                .set({authorization: "token"})
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal(1);

                    done();
                });

        });

        it("should use mvc to provide info (UseAfter)", (done: Function) => {

            this.app
                .get("/rest/calendars/middlewares2")
                .set({authorization: "token"})
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal(10909);

                    done();
                });

        });

        it("should set all headers", (done: Function) => {

            this.app
                .get("/rest/calendars/headers")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    expect(response.headers["x-token-test"]).to.equal("test");
                    expect(response.headers["x-token-test-2"]).to.equal("test2");
                    expect(response.headers["content-type"]).to.equal("application/xml; charset=utf-8");

                    done();
                });

        });
    });

    describe("PUT /rest/calendars", () => {

        it("should throw a BadRequest", (done: Function) => {

            this.app
                .put("/rest/calendars")
                .expect(400)
                .end((err: any, response: any) => {
                    expect(response.error.text).to.contains("Bad request, parameter request.body.name is required.");
                    done();
                });

        });

        it("should return an object", (done: Function) => {

            this.app
                .put("/rest/calendars")
                .send({name: "test"})
                .expect(200)
                .end((err: any, response: any) => {

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.name).to.equal("test");
                    done();
                });

        });
    });

    describe("DELETE /rest/calendars", () => {

        it("should throw a Forbidden", (done: Function) => {

            this.app
                .delete("/rest/calendars")
                .expect(403)
                .end((err: any, response: any) => {

                    expect(response.error.text).to.contains("Forbidden");
                    done();
                });

        });

        it("should throw a BadRequest", (done: Function) => {

            this.app
                .delete("/rest/calendars")
                .set({authorization: "token"})
                .expect(400)
                .end((err: any, response: any) => {

                    expect(response.error.text).to.contains("Bad request, parameter request.body.id is required.");

                    done();
                });

        });


    });

    describe("HEAD /rest/calendars/events", () => {

        it("should return headers", (done) => {
            this.app
                .head("/rest/calendars/events")
                .expect(200)
                .end((err: any, response: any) => {

                    expect(response.text).to.eq(undefined);

                    done();
                });
        });

    });

    describe("PATCH /rest/calendars/events/:id", () => {

        it("should return headers", (done) => {
            this.app
                .patch("/rest/calendars/events/1")
                .expect(200)
                .end((err: any, response: any) => {


                    done();
                });
        });

    });
});
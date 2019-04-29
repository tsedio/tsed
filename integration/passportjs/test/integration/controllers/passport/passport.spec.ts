import {ExpressApplication} from "@tsed/common";
import {bootstrap, inject} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Passport", () => {

    // bootstrap your expressApplication in first
    before(bootstrap(Server));
    before(inject([ExpressApplication], (expressApplication: ExpressApplication) => {

        this.app = SuperTest(expressApplication);

        this.done = (done) => (err, response: any) => {
            this.err = err;
            this.response = response;
            done();
        };

    }));

    describe("POST /rest/passport/login", () => {

        describe("when credential isn't given", () => {
            before((done) => {
                this.app
                    .post("/rest/passport/login")
                    .send({})
                    .expect(403)
                    .end(this.done(done));
            });
            it("should respond 403", () => {
                expect(this.response.badRequest).to.be.true;
                expect(this.response.text).to.eq("Bad request, parameter request.body.email is required.");
            });
        });

        describe("when credential is given but is wrong", () => {
            before((done) => {
                this.app
                    .post("/rest/passport/login")
                    .send({email: "test@test.fr", password: "12345"})
                    .expect(404)
                    .end(this.done(done));
            });
            it("should respond 404", () => {
                expect(this.response.notFound).to.be.true;
                expect(this.response.text).to.eq("User not found");
            });
        });

        describe("when credential is given but email is invalid", () => {
            before((done) => {
                this.app
                    .post("/rest/passport/login")
                    .send({email: "test_test.fr", password: "12345"})
                    .expect(403)
                    .end(this.done(done));
            });
            it("should respond 403", () => {
                expect(this.response.text).to.eq("Email is invalid");
            });
        });

        describe("when credential is given", () => {
            before((done) => {
                this.app
                    .post("/rest/passport/login")
                    .send({email: "amy.riley@undefined.io", password: "583538ea97489c137ad54db5"})
                    .expect(200)
                    .end(this.done(done));
            });
            it("should respond 200 and return the user", () => {
                expect(JSON.parse(this.response.text)).to.deep.eq({
                    "_id": "583538ea678f0ce762d3ce62",
                    "firstName": "Amy",
                    "lastName": "Riley",
                    "password": "583538ea97489c137ad54db5",
                    "email": "amy.riley@undefined.io",
                    "phone": "+1 (841) 438-3631",
                    "address": "399 Pilling Street, Verdi, North Carolina, 5810"
                });
            });
        });

    });

    describe("POST /rest/passport/signup", () => {
        describe("when credential isn't given", () => {
            before((done) => {
                this.app
                    .post("/rest/passport/signup")
                    .send({})
                    .expect(403)
                    .end(this.done(done));
            });
            it("should respond 403", () => {
                expect(this.response.text).to.eq("Bad request, parameter request.body.email is required.");
            });
        });

        describe("when credential is given but email is invalid", () => {
            before((done) => {
                this.app
                    .post("/rest/passport/signup")
                    .send({
                        "firstName": "Wendi",
                        "lastName": "Small",
                        "password": "test",
                        "email": "wendi.small_undefined.net"
                    })
                    .expect(403)
                    .end(this.done(done));
            });
            it("should respond 403", () => {
                expect(this.response.text).to.eq("Email is invalid");
            });
        });

        describe("when credential is given but the email is already registered", () => {
            before((done) => {
                this.app
                    .post("/rest/passport/signup")
                    .send({
                        "firstName": "Wendi",
                        "lastName": "Small",
                        "password": "test",
                        "email": "wendi.small@undefined.net"
                    })
                    .expect(403)
                    .end(this.done(done));
            });
            it("should respond 403", () => {
                expect(this.response.text).to.eq("Email is already registered");
            });
        });

        describe("when credential is given", () => {
            before((done) => {
                this.app
                    .post("/rest/passport/signup")
                    .send({
                        "firstName": "Wendi",
                        "lastName": "Small",
                        "password": "test",
                        "email": "wendi.small@console.net"
                    })
                    .expect(200)
                    .end(this.done(done));
            });
            it("should respond 200 and return the user", () => {

                const user = JSON.parse(this.response.text);

                expect(user.email).to.eq("wendi.small@console.net");
                expect(user.firstName).to.eq("Wendi");
                expect(user.lastName).to.eq("Small");
                expect(user.password).to.eq("test");
            });
        });
    });
});
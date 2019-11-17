import {ExpressApplication} from "@tsed/common";
import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Passport", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  before(TestContext.bootstrap(Server));
  beforeEach(inject([ExpressApplication], async (expressApplication: ExpressApplication) => {
    request = SuperTest(expressApplication);
  }));
  after(() => TestContext.reset());

  describe("POST /rest/passport/login", () => {
    describe("when credential isn't given", () => {
      it("should respond 403", async () => {
        const response = await request
          .post("/rest/passport/login")
          .send({})
          .expect(403);

        expect(response.badRequest).to.be.true;
        expect(response.text).to.eq("Bad request, parameter request.body.email is required.");
      });
    });

    describe("when credential is given but is wrong", () => {
      before((done) => {

      });
      it("should respond 404", async () => {
        const response = await request
          .post("/rest/passport/login")
          .send({email: "test@test.fr", password: "12345"})
          .expect(404);

        expect(response.notFound).to.be.true;
        expect(response.text).to.eq("User not found");
      });
    });

    describe("when credential is given but email is invalid", () => {
      it("should respond 403", async () => {
        const response = await request
          .post("/rest/passport/login")
          .send({email: "test_test.fr", password: "12345"})
          .expect(403);

        expect(response.text).to.eq("Email is invalid");
      });
    });

    describe("when credential is given", () => {
      it("should respond 200 and return the user", async () => {
        const response = await request
          .post("/rest/passport/login")
          .send({email: "amy.riley@undefined.io", password: "583538ea97489c137ad54db5"})
          .expect(200);

        expect(JSON.parse(response.text)).to.deep.eq({
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
      it("should respond 403", async () => {
        const response = await request
          .post("/rest/passport/signup")
          .send({})
          .expect(403);

        expect(response.text).to.eq("Bad request, parameter request.body.email is required.");
      });
    });

    describe("when credential is given but email is invalid", () => {
      it("should respond 403", async () => {
        const response = await request
          .post("/rest/passport/signup")
          .send({
            "firstName": "Wendi",
            "lastName": "Small",
            "password": "test",
            "email": "wendi.small_undefined.net"
          })
          .expect(403);

        expect(response.text).to.eq("Email is invalid");
      });
    });

    describe("when credential is given but the email is already registered", () => {
      it("should respond 403", async () => {
        const response = await request
          .post("/rest/passport/signup")
          .send({
            "firstName": "Wendi",
            "lastName": "Small",
            "password": "test",
            "email": "wendi.small@undefined.net"
          })
          .expect(403);

        expect(response.text).to.eq("Email is already registered");
      });
    });

    describe("when credential is given", () => {
      it("should respond 200 and return the user", async () => {
        const response = await request
          .post("/rest/passport/signup")
          .send({
            "firstName": "Wendi",
            "lastName": "Small",
            "password": "test",
            "email": "wendi.small@console.net"
          })
          .expect(200);

        const user = JSON.parse(response.text);

        expect(user.email).to.eq("wendi.small@console.net");
        expect(user.firstName).to.eq("Wendi");
        expect(user.lastName).to.eq("Small");
        expect(user.password).to.eq("test");
      });
    });
  });
});

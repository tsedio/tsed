import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Auth", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  before(PlatformTest.bootstrap(Server));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("POST /rest/auth/login", () => {
    describe("when credential isn't given", () => {
      it("should respond 400", async () => {
        const response = await request
          .post("/rest/auth/login")
          .send({})
          .expect(400);

        expect(response.text).to.eq("Bad Request");
      });
    });
    describe("when credential is given but is wrong", () => {
      it("should respond 401", async () => {
        const response = await request
          .post("/rest/auth/login")
          .send({email: "test@test.fr", password: "12345"})
          .expect(401);

        expect(response.text).to.eq("Unauthorized");
      });
    });
    describe("when credential is given but email is invalid", () => {
      it("should respond 400", async () => {
        const response = await request
          .post("/rest/auth/login")
          .send({email: "test_test.fr", password: "12345"})
          .expect(400);

        expect(response.text).to.eq("Bad request on parameter \"request.body\".<br />At Credentials.email should match format \"email\"");
      });
    });
    describe("when credential is given", () => {
      it("should respond 200 and return the user", async () => {
        const response = await request
          .post("/rest/auth/login")
          .send({email: "amy.riley@undefined.io", password: "583538ea97489c137ad54db5"})
          .expect(200);

        expect(response.body).to.deep.include({
          "firstName": "Amy",
          "lastName": "Riley",
          "email": "amy.riley@undefined.io",
          "phone": "+1 (841) 438-3631",
          "address": "399 Pilling Street, Verdi, North Carolina, 5810"
        });
        expect(response.body).to.not.have.property("password");
        expect(response.body).to.have.own.property("_id");
      });
    });
  });

  describe("POST /rest/auth/signup", () => {
    describe("when credential isn't given", () => {
      it("should respond 400", async () => {
        const response = await request
          .post("/rest/auth/signup")
          .send({})
          .expect(400);

        expect(response.text).to.eq("Bad Request");
      });
    });

    describe("when credential is given but email is invalid", () => {
      it("should respond 403", async () => {
        const response = await request
          .post("/rest/auth/signup")
          .send({
            "firstName": "Wendi",
            "lastName": "Small",
            "password": "test",
            "email": "wendi.small_undefined.net"
          })
          .expect(400);

        expect(response.text).to.eq("Bad request on parameter \"request.body\".<br />At UserCreation.email should match format \"email\"");
      });
    });

    describe("when credential is given but the email is already registered", () => {
      it("should respond 403", async () => {
        const response = await request
          .post("/rest/auth/signup")
          .send({
            "firstName": "Wendi",
            "lastName": "Small",
            "email": "wendi.small@undefined.net",
            "password": "utest"
          })
          .expect(403);

        expect(response.text).to.eq("Email is already registered");
      });
    });

    describe("when credential is given", () => {
      it("should respond 200 and return the user", async () => {
        const response = await request
          .post("/rest/auth/signup")
          .send({
            "firstName": "Wendi",
            "lastName": "Small",
            "password": "test",
            "email": "wendi.small@console.net"
          })
          .expect(201);

        expect(response.body).to.deep.include({
          email: "wendi.small@console.net",
          firstName: "Wendi",
          lastName: "Small"
        });

        expect(response.body).to.not.have.property("password");
        expect(response.body).to.have.property("_id");
      });
    });
  });
});

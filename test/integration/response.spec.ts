import {ExpressApplication} from "@tsed/common";
import {bootstrap, inject, TestContext} from "@tsed/testing";
import * as SuperTest from "supertest";
import {FakeServer} from "./app/FakeServer";

describe("Response", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(bootstrap(FakeServer));
  before(
    inject([ExpressApplication], (expressApplication: ExpressApplication) => {
      request = SuperTest(expressApplication);
    })
  );
  after(TestContext.reset);

  describe("Scenario1: when multiple endpoint for the same path (classic)", () => {
    describe("GET /rest/response/scenario1/:id", () => {
      it("should return the id + test", async () => {
        const response = await request.get("/rest/response/scenario1/10").expect(200);

        response.text.should.be.equal("10value");
      });
    });
  });

  describe("Scenario2: when multiple endpoint for the same path (with next)", () => {
    describe("GET /rest/response/scenario1/:id", () => {
      it("should return the id + test", async () => {
        const response = await request.get("/rest/response/scenario2/10").expect(200);

        response.text.should.be.equal("10value");
      });
    });
  });

  describe("Scenario3: when response is empty or created", () => {
    describe("GET /rest/response/scenario3/:id?", () => {
      it("should return nothing with a 204 status", async () => {
        const response = await request.post("/rest/response/scenario3/10").expect(204);

        response.text.should.be.equal("");
      });

      it("should return a body with ", async () => {
        const response = await request
          .post("/rest/response/scenario3")
          .expect(201);

        response.body.should.deep.equal({id: 1});
      });
    });
  });
  describe("Scenario4: when endpoint use a promise and next", () => {
    describe("GET /rest/response/scenario4/10", () => {
      it("should return a body with ", async () => {
        const response = await request.get("/rest/response/scenario4/10");

        response.text.should.deep.equal("10value");
      });
    });
  });

  describe("Scenario5: when endpoint return a function", () => {
    describe("GET /rest/response/scenario5", () => {
      it("should return a body with ", async () => {
        const response = await request.get("/rest/response/scenario5");

        response.body.should.deep.equal({id: 1});
      });
    });
  });

  describe("Scenario6: when endpoint return an observable", () => {
    describe("GET /rest/response/scenario6", () => {
      it("should return a body with ", async () => {
        const response = await request.get("/rest/response/scenario6");

        response.body.should.deep.equal({id: 1});
      });
    });

    describe("GET /rest/response/scenario6b", () => {
      it("should return a body with ", async () => {
        const response = await request.get("/rest/response/scenario6b");

        response.body.should.deep.equal({id: 1});
      });
    });
  });

  describe("Scenario7: when endpoint return a stream", () => {
    describe("GET /rest/response/scenario7", () => {
      it("should return a body with ", async () => {
        const response = await request.get("/rest/response/scenario7");

        response.body.should.deep.equal({id: "1"});
      });
    });

    describe("GET /rest/response/scenario7b", () => {
      it("should return a body with ", async () => {
        const response = await request.get("/rest/response/scenario7b");

        response.body.should.deep.equal({id: "1"});
      });
    });
  });

  describe("Scenario8: when endpoint return a middleware", () => {
    describe("GET /rest/response/scenario8", () => {
      it("should return a body with ", async () => {
        const response = await request.get("/rest/response/scenario8");

        response.body.should.deep.equal({id: 1});
      });
    });
    describe("GET /rest/response/scenario8b", () => {
      it("should return a body with ", async () => {
        const response = await request.get("/rest/response/scenario8b");

        response.body.should.deep.equal({id: 1});
      });
    });
  });

  describe("Scenario9: routes without parameters must be defined first in express", () => {
    describe("GET /rest/response/scenario9/static", () => {
      it("should return the test", async () => {
        const response = await request.get("/rest/response/scenario9/static").expect(200);

        response.text.should.be.equal("value");
      });
    });

    describe("GET /rest/response/scenario9/:dynamic", () => {
      it("should return the test + id", async () => {
        const response = await request.get("/rest/response/scenario9/10").expect(200);

        response.text.should.be.equal("value10");
      });
    });

    describe("GET /rest/response/scenario9/:dynamic", () => {
      it("should throw a badRequest when path params isn't set as number", async () => {
        const response = await request.get("/rest/response/scenario9/kkk").expect(400);

        response.text.should.be.equal("Cast error. Expression value is not a number.");
      });
    });
  });
});

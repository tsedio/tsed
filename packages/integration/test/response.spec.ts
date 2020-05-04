import {ContentType, Controller, ExpressApplication, Get, Next, PathParams, Post, Req, Res, Status} from "@tsed/common";
import {inject, TestContext} from "@tsed/testing";
import {createReadStream} from "fs";
import {join} from "path";
import {of} from "rxjs";
import * as SuperTest from "supertest";
import {TestServer} from "./helpers/TestServer";

@Controller("/response")
export class ResponseScenarioCtrl {
  @Get("/scenario1/:id")
  public testScenario1Assert(@PathParams("id") id: number, @Req() request: Req) {
    request.ctx.set("test", "value");
  }

  @Get("/scenario1/:id")
  public testScenario1Get(@PathParams("id") id: number, @Req() request: Req) {
    return id + request.ctx.get("test");
  }

  @Get("/scenario2/:id")
  public testScenario2Assert(@PathParams("id") id: number, @Req() request: Req, @Next() next: Next) {
    setTimeout(() => {
      request.ctx.set("test", "value");
      next();
    }, 100);
  }

  @Get("/scenario2/:id")
  public testScenario2Get(@PathParams("id") id: number, @Req() request: Req) {
    return id + request.ctx.get("test");
  }

  @Post("/scenario3/:id?")
  @Status(204)
  public testScenario3EmptyResponse(@PathParams("id") id: number, @Res() response: Res) {
    if (id) {
      return;
    }

    response.status(201);

    return {
      id: 1
    };
  }

  @Get("/scenario4/:id")
  async testScenario4Assert(@PathParams("id") id: number, @Req() request: Req, @Next() next: Next) {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });

    request.ctx.set("test", "value");
    next();
  }

  @Get("/scenario4/:id")
  public testScenario4Get(@PathParams("id") id: number, @Req() request: Req) {
    return id + request.ctx.get("test");
  }

  @Get("/scenario5")
  async testScenario5Promise() {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });

    return {
      id: 1
    };
  }

  @Get("/scenario6")
  testScenario6Observable() {
    return of({id: 1});
  }

  @Get("/scenario6b")
  async testScenario6bObservable() {
    return of({id: 1});
  }

  @Get("/scenario7")
  @ContentType("application/json")
  testScenario7Stream() {
    return createReadStream(join(__dirname, "data/response.data.json"));
  }

  @Get("/scenario7b")
  @ContentType("application/json")
  async testScenario7bStream() {
    return createReadStream(join(__dirname, "data/response.data.json"));
  }

  @Get("/scenario8")
  testScenario8Middleware() {
    return (req: Req, res: Res, next: Next) => {
      res.json({id: 1});
    };
  }

  @Get("/scenario8b")
  async testScenario8bMiddleware() {
    return (req: Req, res: Res, next: Next) => {
      res.json({id: 1});
    };
  }

  @Get("/scenario9/static")
  public testScenario9Get(): string {
    return "value";
  }

  @Get("/scenario9/:id")
  public testScenario9WithDynamicParam(@PathParams("id") id: number): string {
    return "value" + id;
  }
}

describe("Response", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(TestContext.bootstrap(TestServer, {
    mount: {
      "/rest": ResponseScenarioCtrl
    }
  }));
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

  describe("Scenario5: when endpoint response from promise", () => {
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

        response.text.should.be.equal("Bad request on parameter \"request.path.id\".<br />Cast error. Expression value is not a number.");
      });
    });
  });
});

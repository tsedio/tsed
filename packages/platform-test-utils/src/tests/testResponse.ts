import {Context, Controller, Get, Next, PathParams, PlatformResponse, PlatformTest, Post, Res} from "@tsed/common";
import {ContentType, Ignore, Property, Status} from "@tsed/schema";
import {expect} from "chai";
import {createReadStream} from "fs";
import {join} from "path";
import {of} from "rxjs";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

class Base {
  @Ignore()
  ignoreMeBase: string;

  @Property()
  fooBase: string;
}

class MyModel extends Base {
  @Property()
  foo: string;

  @Ignore()
  ignoreMe: string;

  @Ignore((value, ctx) => ctx.endpoint)
  ignoreMe2: string;
}

class EmptyModel {
  raw: any;
  affected?: number | null;
}

@Controller("/response")
class TestResponseParamsCtrl {
  @Get("/scenario1/:id")
  public testScenario1Assert(@PathParams("id") id: number, @Context() ctx: Context) {
    ctx.set("test", "value");
  }

  @Get("/scenario1/:id")
  public testScenario1Get(@PathParams("id") id: number, @Context() ctx: Context) {
    return id + ctx.get("test");
  }

  @Get("/scenario2/:id")
  public testScenario2Assert(@PathParams("id") id: number, @Next() next: Next, @Context() ctx: Context) {
    setTimeout(() => {
      ctx.set("test", "value");
      next();
    }, 100);
  }

  @Get("/scenario2/:id")
  public testScenario2Get(@PathParams("id") id: number, @Context() ctx: Context) {
    return id + ctx.get("test");
  }

  @Post("/scenario3/:id?")
  @Status(204)
  public testScenario3EmptyResponse(@PathParams("id") id: number, @Context() ctx: Context) {
    if (id) {
      return;
    }

    ctx.response.status(201);

    return {
      id: 1
    };
  }

  @Get("/scenario5")
  async testScenario5Promise() {
    await new Promise((resolve) => {
      resolve();
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
    return createReadStream(join(__dirname, "../data/response.data.json"));
  }

  @Get("/scenario7b")
  @ContentType("application/json")
  async testScenario7bStream() {
    return createReadStream(join(__dirname, "../data/response.data.json"));
  }

  @Get("/scenario9/static")
  public testScenario9Get(): string {
    return "value";
  }

  @Get("/scenario9/:id")
  public testScenario9WithDynamicParam(@PathParams("id") id: number): string {
    return "value" + id;
  }

  @Get("/scenario10")
  public testScenario10() {
    const model = new MyModel();
    model.foo = "foo";
    model.ignoreMe = "ignoreMe";
    model.ignoreMe2 = "ignoreMe2";
    model.fooBase = "fooBase";
    model.ignoreMeBase = "ignoreMeBase";

    return model;
  }

  @Get("/scenario11")
  get() {
    const t = new EmptyModel();

    t.raw = 1;
    t.affected = 1;

    return t;
  }

  @Get("/scenario12")
  getBuffer(@Res() res: PlatformResponse) {
    res.attachment("filename");

    return Buffer.from("Hello");
  }
}

export function testResponse(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestResponseParamsCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario1: when multiple endpoint for the same path (classic)", () => {
    describe("GET /rest/response/scenario1/:id", () => {
      it("should return the id + test", async () => {
        const response = await request.get("/rest/response/scenario1/10").expect(200);

        expect(response.text).to.equal("10value");
      });
    });
  });

  describe("Scenario2: when multiple endpoint for the same path (with next)", () => {
    describe("GET /rest/response/scenario1/:id", () => {
      it("should return the id + test", async () => {
        const response = await request.get("/rest/response/scenario2/10").expect(200);

        expect(response.text).to.equal("10value");
      });
    });
  });

  describe("Scenario3: when response is empty or created", () => {
    describe("GET /rest/response/scenario3/:id?", () => {
      it("should return nothing with a 204 status", async () => {
        const response = await request.post("/rest/response/scenario3/10").expect(204);

        expect(response.text).to.equal("");
      });

      it("should return a body", async () => {
        const response = await request.post("/rest/response/scenario3").expect(201);

        expect(response.body).to.deep.equal({id: 1});
      });
    });
  });

  describe("Scenario5: when endpoint response from promise", () => {
    describe("GET /rest/response/scenario5", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/response/scenario5");

        expect(response.body).to.deep.equal({id: 1});
      });
    });
  });

  describe("Scenario6: when endpoint return an observable", () => {
    describe("GET /rest/response/scenario6", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/response/scenario6");

        expect(response.body).to.deep.equal({id: 1});
      });
    });

    describe("GET /rest/response/scenario6b", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/response/scenario6b");

        expect(response.body).to.deep.equal({id: 1});
      });
    });
  });

  describe("Scenario7: when endpoint return a stream", () => {
    describe("GET /rest/response/scenario7", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/response/scenario7");

        expect(response.body).to.deep.equal({id: "1"});
      });
    });

    describe("GET /rest/response/scenario7b", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/response/scenario7b");

        expect(response.body).to.deep.equal({id: "1"});
      });
    });
  });

  describe("Scenario9: routes without parameters must be defined first", () => {
    describe("GET /rest/response/scenario9/static", () => {
      it("should return the test", async () => {
        const response = await request.get("/rest/response/scenario9/static").expect(200);

        expect(response.text).to.equal("value");
      });
    });

    describe("GET /rest/response/scenario9/:dynamic", () => {
      it("should return the test + id", async () => {
        const response = await request.get("/rest/response/scenario9/10").expect(200);

        expect(response.text).to.equal("value10");
      });
    });

    describe("GET /rest/response/scenario9/:dynamic", () => {
      it("should throw a badRequest when path params isn't set as number", async () => {
        const response = await request.get("/rest/response/scenario9/kkk").expect(400);

        expect(response.body).to.deep.equal({
          errors: [
            {
              data: "kkk",
              dataPath: "",
              keyword: "type",
              message: "should be number",
              params: {
                type: "number"
              },
              schemaPath: "#/type"
            }
          ],
          message: 'Bad request on parameter "request.path.id".\nValue should be number. Given value: "kkk"',
          name: "AJV_VALIDATION_ERROR",
          status: 400
        });
      });
    });
  });

  describe("Scenario10: return a model with ignored props", () => {
    it("should return a body", async () => {
      const response = await request.get("/rest/response/scenario10");

      expect(response.body).to.deep.equal({
        foo: "foo",
        fooBase: "fooBase"
      });
    });
  });

  describe("Scenario11: return models without props", () => {
    it("should return a body", async () => {
      const response = await request.get("/rest/response/scenario11");

      expect(response.body).to.deep.equal({
        affected: 1,
        raw: 1
      });
    });
  });

  describe("Scenario12: Return buffer", () => {
    it("should return a body", async () => {
      const response = await request.get("/rest/response/scenario12");

      expect(response.headers["content-disposition"]).to.equal('attachment; filename="filename"');
      expect(response.headers["content-type"]).to.contains("application/octet-stream");
      expect(response.headers["content-length"]).to.equal("5");
      expect(response.body.toString()).to.deep.equal("Hello");
    });
  });
}

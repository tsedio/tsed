import {Controller, getContext} from "@tsed/di";
import {PlatformResponse, Res} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context, PathParams} from "@tsed/platform-params";
import {CollectionOf, Enum, ForwardGroups, Get, Groups, Ignore, Name, Post, Property, Required, Returns, Status} from "@tsed/schema";
import axios from "axios";
import {of} from "rxjs";
import {agent} from "superagent";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

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

export enum EnumValue {
  One = "one",
  Two = "two"
}

export class NestedEnum {
  @Required()
  @Enum(EnumValue)
  value: EnumValue;
}

export class TestNestedEnum {
  @Property()
  nested: NestedEnum;
}

export class ModelGroup {
  @Property()
  id: string;

  @Groups("!creation")
  groups: string;
}

class TeamModel {
  @Required()
  @Name("teamName")
  name: string;
}

class TeamsModel {
  @Required()
  @CollectionOf(TeamModel)
  @ForwardGroups()
  teams: TeamModel[];
}

class AllowedModel {
  @Property()
  id: string;

  @Property()
  description: string;

  @Groups("summary")
  prop1: string; // not display by default

  @Groups("details")
  prop2: string; // not display by default

  @Groups("admin")
  sensitiveProp: string; // not displayed because it's a sensitive props
}

@Controller("/response")
class TestResponseParamsCtrl {
  @Get("/scenario1/:id")
  public testScenario1Get(@PathParams("id") id: number) {
    return `hello-${id}`;
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
      resolve(undefined);
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
  testScenario6bObservable() {
    return Promise.resolve(of({id: 1}));
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
  testScenario11() {
    const t = new EmptyModel();

    t.raw = 1;
    t.affected = 1;

    return t;
  }

  @Get("/scenario12")
  testScenario12(@Res() res: PlatformResponse) {
    res.attachment("filename");

    return Buffer.from("Hello");
  }

  @Get("/scenario13")
  async testScenario13(@Res() res: PlatformResponse) {
    const http = agent();

    const image_res = await http.get("https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png");

    res.setHeader("Content-Disposition", "inline;filename=googlelogo_color_272x92dp.png;");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Type", "image/png");

    return image_res.body;
  }

  @Get("/scenario14")
  public scenario14() {
    return {
      jsonexample: 1
    };
  }

  @Get("/scenario15a")
  testScenario15a() {
    return axios.get(`https://tsed.io/api.json`, {
      responseType: "json"
    });
  }

  @Get("/scenario15b")
  testScenario15b() {
    return axios.get(`https://api.tsed.io/rest/github/typed/test`, {
      responseType: "json"
    });
  }

  @Get("/scenario16")
  testScenario16(): Promise<TestNestedEnum> {
    const test = new TestNestedEnum();
    const nested = new NestedEnum();
    nested.value = EnumValue.One;
    test.nested = nested;

    return Promise.resolve(test);
  }

  @Get("/scenario17")
  @(Returns(201, ModelGroup).Groups("creation"))
  testScenario17(): Promise<ModelGroup> {
    const model = new ModelGroup();
    model.id = "id";
    model.groups = "groups";

    return Promise.resolve(model);
  }

  @Get("/scenario18")
  @Returns(200, TeamsModel)
  testScenario18() {
    const data = new TeamsModel();
    const team: any = {};
    team.name = "name";
    data.teams = [team];

    return data;
  }

  @Get("/scenario19")
  @(Returns(200, AllowedModel).Groups("!admin").AllowedGroups("summary", "details"))
  testScenario19(): Promise<AllowedModel> {
    const model = new AllowedModel();
    model.id = "id";
    model.prop1 = "prop1";
    model.description = "description";
    model.prop2 = "prop2";
    model.sensitiveProp = "sensitiveProp";

    return Promise.resolve(model);
  }

  @Get("/scenario20")
  testScenario20() {
    const $ctx = getContext();

    return {id: $ctx?.request.query.id};
  }
}

export function testResponse(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestResponseParamsCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario1: return the id (classic)", () => {
    describe("GET /rest/response/scenario1/:id", () => {
      it("should return the id + test", async () => {
        const response = await request.get("/rest/response/scenario1/10").expect(200);

        expect(response.text).toEqual("hello-10");
      });
    });
  });

  describe("Scenario3: when response is empty or created", () => {
    describe("GET /rest/response/scenario3/:id?", () => {
      it("should return nothing with a 204 status", async () => {
        const response = await request.post("/rest/response/scenario3/10").expect(204);

        expect(response.text).toEqual("");
      });

      it("should return a body", async () => {
        const response = await request.post("/rest/response/scenario3").expect(201);

        expect(response.body).toEqual({id: 1});
      });
    });
  });

  describe("Scenario5: when endpoint response from promise", () => {
    describe("GET /rest/response/scenario5", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/response/scenario5");

        expect(response.body).toEqual({id: 1});
      });
    });
  });

  describe("Scenario6: when endpoint return an observable", () => {
    describe("GET /rest/response/scenario6", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/response/scenario6");

        expect(response.body).toEqual({id: 1});
      });
    });

    describe("GET /rest/response/scenario6b", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/response/scenario6b");

        expect(response.body).toEqual({id: 1});
      });
    });
  });

  describe("Scenario9: routes without parameters must be defined first", () => {
    describe("GET /rest/response/scenario9/static", () => {
      it("should return the test", async () => {
        const response = await request.get("/rest/response/scenario9/static").expect(200);

        expect(response.text).toEqual("value");
      });
    });

    describe("GET /rest/response/scenario9/:dynamic", () => {
      it("should return the test + id", async () => {
        const response = await request.get("/rest/response/scenario9/10").expect(200);

        expect(response.text).toEqual("value10");
      });
    });

    describe("GET /rest/response/scenario9/:dynamic", () => {
      it("should throw a badRequest when path params isn't set as number", async () => {
        const response = await request.get("/rest/response/scenario9/kkk").expect(400);

        expect(response.body).toEqual({
          errors: [
            {
              data: "kkk",
              requestPath: "path",
              dataPath: ".id",
              instancePath: "",
              keyword: "type",
              message: "must be number",
              params: {
                type: "number"
              },
              schemaPath: "#/type"
            }
          ],
          message: 'Bad request on parameter "request.path.id".\nValue must be number. Given value: "kkk"',
          name: "AJV_VALIDATION_ERROR",
          status: 400
        });
      });
    });
  });

  describe("Scenario10: return a model with ignored props", () => {
    it("should return a body", async () => {
      const response = await request.get("/rest/response/scenario10");

      expect(response.body).toEqual({
        foo: "foo",
        fooBase: "fooBase"
      });
    });
  });

  describe("Scenario11: return models without props", () => {
    it("should return a body", async () => {
      const response = await request.get("/rest/response/scenario11");

      expect(response.body).toEqual({
        affected: 1,
        raw: 1
      });
    });
  });

  describe("Scenario12: Return buffer", () => {
    it("should return a body", async () => {
      const response = await request.get("/rest/response/scenario12");

      expect(response.headers["content-disposition"]).toEqual('attachment; filename="filename"');
      expect(response.headers["content-type"]).toContain("application/octet-stream");
      expect(response.headers["content-length"]).toEqual("5");
      expect(response.body.toString()).toEqual("Hello");
    });
  });

  describe("Scenario13: Return buffer", () => {
    it("should return image", async () => {
      const response = await request.get("/rest/response/scenario13");

      expect(response.headers["content-disposition"]).toEqual("inline;filename=googlelogo_color_272x92dp.png;");
      expect(response.headers["content-type"]).toContain("image/png");
      expect(response.headers["content-length"]).toEqual("5969");
    });
  });

  describe("Scenario14: Return application/json when Accept is */*", () => {
    it("should return a */* content-type", async () => {
      const response = await request
        .get("/rest/response/scenario14")
        .set("Accept", "*/*")
        .set("Content-Type", "application/json")
        .expect(200);

      expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
      expect(response.body).toEqual({
        jsonexample: 1
      });
    });
  });
  describe("Scenario15: Use axios as proxy", () => {
    it("should return the response (200)", async () => {
      const response = await request.get("/rest/response/scenario15a").expect(200);

      expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
    });

    it("should return the response (401)", async () => {
      const response = await request.get("/rest/response/scenario15b").expect(401);

      expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
    });
  });

  describe("Scenario16: Return response with nested enum", () => {
    it("should return the response (200)", async () => {
      const response = await request.get("/rest/response/scenario16").expect(200);

      expect(response.body).toEqual({nested: {value: "one"}});
    });
  });

  describe("Scenario17: Return response with groups on 201", () => {
    it("should return the response (200)", async () => {
      const response = await request.get("/rest/response/scenario17").expect(201);

      expect(response.body).toEqual({id: "id"});
    });
  });

  describe("Scenario18: Return data with alias", () => {
    it("should return the response (200)", async () => {
      const response = await request.get("/rest/response/scenario18").expect(200);

      expect(response.body).toEqual({
        teams: [
          {
            teamName: "name"
          }
        ]
      });
    });
  });

  describe("Scenario19: includes options", () => {
    it("should return the response (200)", async () => {
      const response = await request.get("/rest/response/scenario19").expect(200);

      expect(response.body).toEqual({
        description: "description",
        id: "id",
        prop1: "prop1",
        prop2: "prop2"
      });
    });
    it("should return the response (200 + [summary])", async () => {
      const response = await request.get("/rest/response/scenario19?includes=summary").expect(200);

      expect(response.body).toEqual({
        description: "description",
        id: "id",
        prop1: "prop1"
      });
    });
    it("should return the response (200 + [summary, details])", async () => {
      const response = await request.get("/rest/response/scenario19?includes=summary&includes=details").expect(200);

      expect(response.body).toEqual({
        description: "description",
        id: "id",
        prop2: "prop2",
        prop1: "prop1"
      });
    });
    it("should return the response (200 + [summary, details, admin])", async () => {
      const response = await request.get("/rest/response/scenario19?includes=summary&includes=details&includes=admin").expect(200);

      expect(response.body).toEqual({
        description: "description",
        id: "id",
        prop2: "prop2",
        prop1: "prop1"
      });
    });
    it("should return the response (200 + 'summary,details,admin')", async () => {
      const response = await request.get("/rest/response/scenario19?includes=summary,details,admin").expect(200);

      expect(response.body).toEqual({
        description: "description",
        id: "id",
        prop2: "prop2",
        prop1: "prop1"
      });
    });
  });

  describe("Scenario20: should return query data from Context", () => {
    it("should return the response (200)", async () => {
      const response = await request.get("/rest/response/scenario20?id=id").expect(200);

      expect(response.body).toEqual({id: "id"});
    });
  });
}

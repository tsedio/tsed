import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context, PathParams} from "@tsed/platform-params";
import {Get, Property, Required, Title} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

export class MyModel {
  @Title("ID")
  @Property()
  public id: string;

  @Property()
  @Required()
  public name: string;
}

@Controller("/handlers")
export class HandlersCtrl {
  @Get("/scenario-1/:id") // Express style
  public scenario1(@PathParams("id") id: string): MyModel {
    const model = new MyModel();
    model.id = id;
    model.name = "test";

    return model;
  }

  @Get("/scenario-2/:id") // Ts.ED style with response injection
  public scenario2(
    @Context() ctx: Context,
    @PathParams("id")
    @Required()
    id: string
  ): void {
    const model = new MyModel();
    model.id = "1";
    model.name = "test";

    try {
      ctx.response.status(202).body(model);
    } catch (er) {
      console.log(er);
    }
  }

  @Get("/scenario-3/:id") // Ts.ED style
  public scenario3(@PathParams("id") id: string): Promise<any> {
    const model = new MyModel();
    model.id = id;
    model.name = "test";

    return Promise.resolve(model);
  }
}

export function testHandlers(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;
  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      logger: {},
      mount: {
        "/rest": [HandlersCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);
  it("Scenario 1: GET /rest/handlers/scenario-1/:id", async () => {
    const {body}: any = await request.get("/rest/handlers/scenario-1/1").expect(200);

    expect(body.id).toEqual("1");
    expect(body.name).toEqual("test");
  });

  it("Scenario 2: GET /rest/handlers/scenario-2/:id", async () => {
    const {body}: any = await request.get("/rest/handlers/scenario-2/1").expect(202);

    expect(body.id).toEqual("1");
    expect(body.name).toEqual("test");
  });

  it("Scenario 3: GET /rest/handlers/scenario-3/:id", async () => {
    const {body}: any = await request.get("/rest/handlers/scenario-3/1").expect(200);

    expect(body.id).toEqual("1");
    expect(body.name).toEqual("test");
  });
}

import {Controller} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Middleware, UseAuth} from "@tsed/platform-middlewares";
import {BodyParams, PathParams, QueryParams} from "@tsed/platform-params";
import {Description, Get, MaxLength, MinLength, Post, Property, Returns, Summary} from "@tsed/schema";
import SuperTest from "supertest";
import {v4} from "uuid";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

export class Resource {
  @Property()
  id: string;

  @Property()
  @MinLength(3)
  @MaxLength(100)
  name: string;
}

export class BaseController<T extends {id: string}> {
  resources: T[];

  @Get("/:id")
  @Summary("Return an element by his resource")
  get(
    @Description("Id of the resource")
    @PathParams("id")
    id: string
  ): Promise<any> {
    const resource = this.resources.find((resource) => resource.id === id);

    if (!resource) {
      return Promise.reject(new NotFound("Not found"));
    }

    return Promise.resolve(resource);
  }

  @Get("/")
  @Summary("Return all elements from a service")
  list(): Promise<any[]> {
    return Promise.resolve(this.resources);
  }
}

@Controller("/resources")
export class ResourcesCtrl extends BaseController<Resource> {
  resources = [{id: "1", name: "John"}];

  @Get("/:id")
  @Summary("Return an element by his resource")
  async get(
    @Description("Id of the resource")
    @PathParams("id")
    id: string
  ): Promise<any> {
    const resource = await super.get(id);

    resource.name = resource.name + " hello You!";

    return resource;
  }

  @Post("/")
  @(Returns(201).Type(Resource))
  post(@BodyParams() resource: Resource) {
    resource.id = v4();
    this.resources.push(resource);

    return resource;
  }
}

@Middleware()
class AuthMiddleware {
  use() {
    return true;
  }
}

abstract class AttachmentController {
  @Get("/:parentID/attachments")
  getAll(@PathParams("parentID") parentID: string) {
    return `All attachments of ${parentID}`;
  }
}

@Controller("/findings")
@UseAuth(AuthMiddleware)
export class FindingsController extends AttachmentController {
  @Get("/")
  get() {
    return "hello Finding";
  }
}

export abstract class TestBaseController {
  @Get("/")
  scenario3(@QueryParams("search") search: string) {
    return {
      search
    };
  }

  @Get("/override")
  scenario5(@QueryParams("q") q: string) {
    return {data: q};
  }
}

@Controller("/test")
export class TestChildController extends TestBaseController {
  @Get("/:id")
  scenario4(@PathParams("id") id: string): any {
    return {id};
  }

  @Get("/override")
  scenario5(@QueryParams("s") s: string) {
    return {data: s};
  }
}

export function testInheritanceController(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [ResourcesCtrl, FindingsController, TestChildController]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario 1:", () => {
    it("should return list", async () => {
      const {body} = await request.get("/rest/resources").expect(200);

      expect(body).toEqual([{id: "1", name: "John"}]);
    });

    it("should return a resource", async () => {
      const {body} = await request.get("/rest/resources/1").expect(200);

      expect(body).toEqual({
        id: "1",
        name: "John hello You!"
      });
    });

    it("should add a resource", async () => {
      const {body} = await request
        .post("/rest/resources")
        .send({
          name: "july"
        })
        .expect(201);

      expect(body.name).toEqual("july");
      expect(typeof body.id).toBe("string");

      const {body: resource} = await request.get(`/rest/resources/${body.id}`).expect(200);

      expect(resource.id).toEqual(body.id);
    });
  });

  describe("scenario2: FindingsController", () => {
    it("should call /rest/findings/:parentID/attachments", async () => {
      const {text} = await request.get("/rest/findings/1/attachments").expect(200);

      expect(text).toEqual("All attachments of 1");
    });

    it("should call /rest/findings", async () => {
      const {text} = await request.get("/rest/findings").expect(200);

      expect(text).toEqual("hello Finding");
    });
  });

  it("Scenario3: should call inherited method", async () => {
    const {body} = await request.get("/rest/test?search=test").expect(200);
    expect(body).toEqual({
      search: "test"
    });
  });

  it("Scenario4: should the Child method", async () => {
    const {body} = await request.get("/rest/test/1").expect(200);
    expect(body).toEqual({id: "1"});
  });

  it("Scenario5: should call the Child method and not the base method", async () => {
    const {body} = await request.get("/rest/test/1").expect(200);
    expect(body).toEqual({id: "1"});
  });
}
